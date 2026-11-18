-- Core owns event-prefix pruning and committed write-receipt retention. The
-- service invokes these operations using rotation deadlines and after
-- state-change notifications; foreign-owner retention is dispatched by its owner.

local sql = require("sql")
local time = require("time")
local clock = require("clock")
local prune = require("prune")
local receipt_purge = require("receipt_purge")
local retention_policy = require("retention_policy")

local sweeper = {}

type DB = sql.DB
type ProjectionScan = {
    thread_id: string,
    head_seq: integer,
    sqlite_status: string?,
    projection_id: string?,
    projection_kind: string?,
    projection_key: string?,
    after_cursor: string?,
}
type ProjectionBudget = { rows: integer, ranges: integer }
type EventTraversal = {
    after_thread_id: string?,
    end_thread_id: string?,
    rotation_deadline_ms: integer?,
    last_deadline_ms: integer?,
    rescan: boolean?,
    projection: ProjectionScan?,
}

type RunStats = {
    events: integer,
    write_receipts: integer,
    needs_continue: boolean,
    deadline_ms: integer?,
}

local EVENT_THREAD_PAGE = 256
local PROJECTION_SAMPLE = 4
local PROJECTION_BATCH = 256
local PROJECTION_RANGES = 16
local PROJECTION_PENDING = 2

local function response_failure(message: string, field: string): error
    return errors.new({message = message, kind = errors.INTERNAL, retryable = false,
        details = {code = "retention_sweeper_response", field = field}})
end

local function rows_result(value: any, field: string): ({ table }?, error?)
    if type(value) ~= "table" then
        return nil, response_failure("retention query returns no row collection", field)
    end
    local length = #value
    for key, row in pairs(value) do
        if type(key) ~= "number" or key < 1 or key > length or key ~= math.floor(key)
            or type(row) ~= "table" then
            return nil, response_failure("retention query returns malformed rows", field)
        end
    end
    for index = 1, length do
        if type(value[index]) ~= "table" then
            return nil, response_failure("retention query returns a missing row", field)
        end
    end
    return value, nil
end

local function load_policy(): (table?, error?)
    local value, err = retention_policy.policy()
    if err then return nil, err end
    if type(value) ~= "table" then
        return nil, response_failure("retention policy returns no policy", "policy")
    end
    for _, field in ipairs({"events_ms", "receipts_orphan_ms", "batch_events", "batch_receipts"}) do
        if type(value[field]) ~= "number" then
            return nil, response_failure("retention policy returns an incomplete policy", "policy")
        end
    end
    return value, nil
end

local function database_type(db: DB): (string?, error?)
    local raw, err = db:type()
    if err then return nil, errors.wrap(err, "failed to resolve DB type") end
    if not raw then return nil, response_failure("failed to resolve DB type", "db.type") end
    return tostring(raw), nil
end

local function begin_indexed_read(db: DB): (sql.Transaction?, error?)
    local tx, begin_err = db:begin()
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_failure("retention read transaction is missing", "indexed_read.begin") end
    -- Keep the page and cursor probes on their indexes, even for a small
    -- table or heavily skewed thread. The settings expire with this read.
    local _, err = tx:execute("SET TRANSACTION READ ONLY; SET LOCAL enable_seqscan=off; SET LOCAL enable_bitmapscan=off")
    if err then
        tx:rollback()
        return nil, errors.wrap(err, "failed to configure indexed retention read")
    end
    return tx, nil
end

local function deleted_count(value: any, field: string): (integer?, error?)
    local deleted = type(value) == "table" and value.deleted or nil
    if type(deleted) ~= "number" or deleted < 0 or deleted ~= math.floor(deleted) then
        return nil, response_failure("retention operation returns no deletion count", field)
    end
    return deleted :: integer, nil
end

local function active(value: any): boolean
    if type(value) == "number" then return value ~= 0 end
    return value ~= false
end

local function event_window_ms(row: table, policy: table): (integer?, error?)
    if row.event_hot_retention_days == nil then return policy.events_ms, nil end
    local days = tonumber(row.event_hot_retention_days)
    if not days or days < 1 or days ~= math.floor(days) then
        return nil, response_failure("invalid per-thread event retention window", "event_hot_retention_days")
    end
    return (days * 86400000) :: integer, nil
end

local function event_cutoff(dbtype: string, window_ms: integer, now: any): string
    return clock.format(now:add(-window_ms * time.MILLISECOND), dbtype)
end

local function parse_timestamp(raw: string, dbtype: string): (any?, error?)
    local sqlite_layouts = {
        "2006-01-02 15:04:05.999999999",
        "2006-01-02 15:04:05.000000",
        "2006-01-02 15:04:05",
        "2006-01-02 15:04:05.999999999Z07:00",
        "2006-01-02T15:04:05.999999999Z07:00",
        "2006-01-02T15:04:05Z07:00",
    }
    local postgres_layouts = {
        "2006-01-02T15:04:05.999999999Z07:00",
        "2006-01-02 15:04:05.999999999Z07:00",
        "2006-01-02 15:04:05.999999999-07",
        "2006-01-02 15:04:05.999999999",
        "2006-01-02T15:04:05Z07:00",
    }
    local layouts = dbtype == sql.type.SQLITE and sqlite_layouts or postgres_layouts
    for _, layout in ipairs(layouts) do
        local parsed, parse_err = time.parse(layout, raw, time.utc)
        if not parse_err and parsed then return parsed, nil end
    end
    return nil, response_failure("retention timestamp has an unknown shape", "timestamp")
end

-- deadline_ms returns the absolute UTC eligibility deadline for a stored row.
function sweeper.deadline_ms(stamp: string, retention_ms: integer, dbtype: string): (integer?, error?)
    if type(stamp) ~= "string" or stamp == "" or type(retention_ms) ~= "number"
        or retention_ms < 1 or retention_ms ~= math.floor(retention_ms) then
        return nil, (errors.new({ message = "timestamp and positive retention_ms are required",
            kind = errors.INVALID }) :: error)
    end
    local parsed, parse_err = parse_timestamp(stamp, dbtype)
    if parse_err then return nil, parse_err end
    -- Prune predicates use a strict timestamp comparison (< cutoff), so a row
    -- becomes eligible at the first millisecond after its exact retention
    -- boundary. For fractional milliseconds, this is ceil(boundary); for an
    -- exact millisecond boundary, add one millisecond.
    return math.floor((parsed :: any):unix_nano() / 1000000) + retention_ms + 1, nil
end

local function prune_thread(db: DB, dbtype: string, row: table, policy: table,
        now: any, now_ms: integer, maximum: integer, background: boolean): (integer?, integer?, error?)
    local thread_id = tostring(row.id or "")
    if thread_id == "" then
        return nil, nil, response_failure("retention candidate has no thread id", "candidate.id")
    end
    if row.head_blocked == 1 or type(row.head_created_at) ~= "string" then return 0, nil, nil end
    local window, window_err = event_window_ms(row, policy)
    if window_err then return nil, nil, window_err end
    local postgres_background = background and dbtype == sql.type.POSTGRES
    local deadline: integer?
    if postgres_background then
        deadline = tonumber(row.eligibility_ms) :: integer?
        if deadline == nil then
            return nil, nil, response_failure("retention event deadline is missing", "event.eligibility_ms")
        end
    elseif dbtype == sql.type.POSTGRES and row.head_created_at == "-infinity" then
        deadline = 0
    else
        local deadline_err
        deadline, deadline_err = sweeper.deadline_ms(row.head_created_at, window :: integer, dbtype)
        if deadline_err then return nil, nil, deadline_err end
    end
    if (deadline :: integer) > now_ms or maximum <= 0 then return 0, deadline, nil end
    local result, prune_err = prune.prune_thread(db, thread_id, {
        cutoff = event_cutoff(dbtype, window :: integer, now),
        batch_size = prune.MAX_LOCK_BATCH,
        max_total = maximum,
        postgres_async_commit = postgres_background,
    })
    if prune_err then return nil, nil, prune_err end
    local deleted, count_err = deleted_count(result, "prune.deleted")
    if postgres_background and deleted == 0 and row.head_blocked == PROJECTION_PENDING
        and (tonumber(result.max_pruned_seq) or 0) < tonumber(row.head_seq) then
        -- The authoritative floor can see a protection outside the observed
        -- cursor keys. Its owner will wake retention when it advances.
        return 0, nil, nil
    end
    -- A due head may have a successor. Its observed deadline brings the next
    -- rotation forward so a successor cannot be missed while the service sleeps.
    return deleted, deadline, count_err
end

local function load_event_threads(db: DB, dbtype: string, policy: table,
        after_id: string?, end_id: string?, start_rotation: boolean): ({ table }?, error?)
    local policy_join = [[LEFT JOIN kickside_retention_policy p ON p.thread_id=t.id]]
    local event_join = [[LEFT JOIN kickside_event e INDEXED BY uq_kickside_event_thread_seq
            ON t.deleting_at IS NULL AND e.thread_id=t.id AND e.seq=t.max_pruned_seq+1
                AND (p.enabled IS NULL OR p.enabled=1)]]
    local cursor_table = "kickside_projection_cursor pc INDEXED BY idx_kickside_projection_cursor_thread"
    local params: table = {}
    if dbtype == sql.type.POSTGRES then
        policy_join = [[LEFT JOIN LATERAL (
            SELECT p.enabled,p.event_hot_retention_days FROM kickside_retention_policy p WHERE p.thread_id=t.id LIMIT 1
        ) p ON TRUE]]
        -- The sequence order lets PostgreSQL seek the head using (thread_id, seq).
        event_join = [[LEFT JOIN LATERAL (
            SELECT e.seq,e.created_at
            FROM kickside_event e
            WHERE t.deleting_at IS NULL AND e.thread_id=t.id AND e.seq>t.max_pruned_seq
                AND (p.enabled IS NULL OR p.enabled=TRUE)
            ORDER BY e.seq LIMIT 1
        ) e ON e.seq=t.max_pruned_seq+1 AND e.created_at<'infinity'::timestamptz]]
        cursor_table = "kickside_projection_cursor pc"
        params = { policy.events_ms }
    end
    local bounds: { string } = {}
    if after_id then
        params[#params + 1] = after_id
        bounds[#bounds + 1] = "id>$" .. tostring(#params)
    end
    if end_id then
        params[#params + 1] = end_id
        bounds[#bounds + 1] = "id<=$" .. tostring(#params)
    end
    local where = #bounds > 0 and " WHERE " .. table.concat(bounds, " AND ") or ""
    -- Capture the end in the first page's snapshot. A backward primary-key
    -- seek gives the rotation a fixed endpoint even as higher IDs are added.
    local rotation_end = start_rotation
        and ",(SELECT id FROM kickside_thread ORDER BY id DESC LIMIT 1) AS end_thread_id" or ""
    -- Take the page before looking up heads or their protection floors.
    -- Cap the raw cursor rows before comparing sequences. The existing index
    -- orders thread and status but cannot seek on last_seq.
    local statement = [[SELECT t.id,p.event_hot_retention_days,e.seq AS head_seq,e.created_at AS head_created_at,
        CASE WHEN e.seq IS NULL THEN 0
        WHEN EXISTS (SELECT 1 FROM kickside_retention_pin rp WHERE rp.thread_id=t.id AND rp.cursor_seq<e.seq) THEN 1
        ELSE (SELECT CASE WHEN MIN(last_seq)<e.seq THEN 1 WHEN COUNT(*)>]] .. tostring(PROJECTION_SAMPLE)
        .. " THEN " .. tostring(PROJECTION_PENDING) .. " ELSE 0 END FROM (SELECT pc.last_seq FROM " .. cursor_table
        .. [[ WHERE pc.thread_id=t.id AND pc.status IN ('active','paused') ORDER BY pc.status LIMIT ]]
        .. tostring(PROJECTION_SAMPLE + 1) .. ") sample) END AS head_blocked"
        .. rotation_end .. "\nFROM (SELECT id,max_pruned_seq,deleting_at FROM kickside_thread"
        .. where .. " ORDER BY id LIMIT " .. tostring(EVENT_THREAD_PAGE) .. ") t\n" .. policy_join .. "\n" .. event_join
    if dbtype == sql.type.POSTGRES then
        -- The join already proved the head contiguous and excluded positive
        -- infinity. A negative infinite timestamp is already eligible by age.
        statement = [[SELECT candidate.*, CASE WHEN head_blocked<>1 THEN
            CASE WHEN head_created_at='-infinity'::timestamptz THEN 0
                ELSE (FLOOR(EXTRACT(EPOCH FROM head_created_at)*1000)
                    + COALESCE(event_hot_retention_days::bigint*86400000,$1::bigint)+1)::bigint
            END END AS eligibility_ms
            FROM (]] .. statement .. " OFFSET 0) candidate ORDER BY id"
    else
        statement = statement .. " ORDER BY t.id"
    end
    local rows, err
    if dbtype == sql.type.POSTGRES then
        local tx, begin_err = begin_indexed_read(db)
        if begin_err or not tx then return nil, begin_err end
        rows, err = tx:query(statement, params)
        local _, end_err = tx:rollback()
        err = err or end_err
    else
        rows, err = db:query(statement, params)
    end
    if err then return nil, errors.wrap(err, "failed to load Core event retention candidates") end
    return rows_result(rows, "candidates.query")
end

local function next_projection(tx: sql.Transaction, scan: ProjectionScan): (table?, error?)
    local params = {scan.thread_id}
    local after = ""
    if scan.projection_kind then
        after = " AND (kind,projection_key)>($2,$3)"
        params[2], params[3] = scan.projection_kind, scan.projection_key
    end
    local rows, err = tx:query([[SELECT id,kind,projection_key FROM kickside_projection
        WHERE thread_id=$1]] .. after .. " ORDER BY kind,projection_key LIMIT 1", params)
    if err then return nil, errors.wrap(err, "failed to seek retention projection") end
    local projections, response_err = rows_result(rows, "projection.range.query")
    return projections and projections[1], response_err
end

-- PostgreSQL's (thread_id,status) index has no cursor tie-breaker. Seek the
-- thread's projection keys, then walk each projection's unique cursor keys.
-- Only keys survive a pass, so the connection is free for receipt and owner work.
local function check_postgres_projections(tx: sql.Transaction, scan: ProjectionScan,
        budget: ProjectionBudget): (boolean?, error?)
    while budget.rows > 0 do
        if not scan.projection_id then
            if budget.ranges == 0 then return nil, nil end
            local projection, err = next_projection(tx, scan)
            if err then return nil, err end
            budget.ranges = budget.ranges - 1
            if not projection then return false, nil end
            scan.projection_id = projection.id
            scan.projection_kind, scan.projection_key = projection.kind, projection.projection_key
        end
        local params = {scan.projection_id}
        local after = ""
        if scan.after_cursor then
            after = " AND cursor_key>$2"
            params[2] = scan.after_cursor
        end
        local rows, err = tx:query([[SELECT thread_id,status,last_seq,cursor_key FROM kickside_projection_cursor
            WHERE projection_id=$1]] .. after .. " ORDER BY cursor_key LIMIT " .. tostring(budget.rows), params)
        if err then return nil, errors.wrap(err, "failed to read retention projection cursors") end
        local batch, response_err = rows_result(rows, "projection.query")
        if response_err or not batch then return nil, response_err end
        local exhausted = #batch < budget.rows
        budget.rows = budget.rows - #batch
        for _, row in ipairs(batch) do
            if row.thread_id == scan.thread_id and row.status ~= "invalid" and tonumber(row.last_seq) < scan.head_seq then
                return true, nil
            end
        end
        if exhausted then
            scan.projection_id, scan.after_cursor = nil, nil
        else
            scan.after_cursor = batch[#batch].cursor_key
        end
    end
    return nil, nil
end

local function check_projection(db: DB, dbtype: string, scan: ProjectionScan, budget: ProjectionBudget): (boolean?, error?)
    if dbtype == sql.type.POSTGRES then
        if budget.rows == 0 or (budget.ranges == 0 and not scan.projection_id) then return nil, nil end
        local tx, begin_err = begin_indexed_read(db)
        if begin_err or not tx then return nil, begin_err end
        local blocked, err = check_postgres_projections(tx, scan, budget)
        local _, end_err = tx:rollback()
        return blocked, err or end_err
    end

    -- SQLite's index orders the implicit row ID within a thread and status.
    while budget.rows > 0 do
        local params: { string } = {scan.thread_id, scan.sqlite_status or "active"}
        local after = ""
        if scan.after_cursor then
            after = " AND rowid>CAST($3 AS INTEGER)"
            params[3] = scan.after_cursor
        end
        local rows, err = db:query([[SELECT CAST(rowid AS TEXT) AS position,last_seq
            FROM kickside_projection_cursor INDEXED BY idx_kickside_projection_cursor_thread
            WHERE thread_id=$1 AND status=$2]] .. after .. " ORDER BY rowid LIMIT " .. tostring(budget.rows), params)
        if err then return nil, errors.wrap(err, "failed to read retention projection cursors") end
        local batch, response_err = rows_result(rows, "projection.query")
        if response_err or not batch then return nil, response_err end
        local exhausted = #batch < budget.rows
        budget.rows = budget.rows - #batch
        for _, row in ipairs(batch) do
            if tonumber(row.last_seq) < scan.head_seq then return true, nil end
        end
        if exhausted then
            if scan.sqlite_status == "paused" then return false, nil end
            scan.sqlite_status, scan.after_cursor = "paused", nil
        else
            scan.after_cursor = batch[#batch].position
        end
    end
    return nil, nil
end

local function min_deadline(current: integer?, candidate: integer?): integer?
    if candidate == nil then return current end
    return current == nil and candidate or math.min(current, candidate)
end

function sweeper.next_receipt_deadline_ms(db: DB): (integer?, error?)
    local policy, policy_err = load_policy()
    if policy_err then return nil, policy_err end
    local dbtype, dbtype_err = database_type(db)
    if dbtype_err then return nil, dbtype_err end
    local receipts, receipt_err = db:query([[SELECT completed_at FROM kickside_write_receipt
        WHERE status='committed' AND completed_at IS NOT NULL
        ORDER BY completed_at LIMIT 1]])
    if receipt_err then return nil, errors.wrap(receipt_err, "failed to read next committed-receipt deadline") end
    local receipt_rows, receipts_err = rows_result(receipts, "receipt_deadline.query")
    if receipts_err then return nil, receipts_err end
    local receipt = (receipt_rows :: { table })[1]
    if receipt then
        return sweeper.deadline_ms(tostring(receipt.completed_at), (policy :: table).receipts_orphan_ms, dbtype :: string)
    end
    return nil, nil
end

function sweeper.run(db: DB, traversal: EventTraversal?): (RunStats?, error?)
    local policy, policy_err = load_policy()
    if policy_err then return nil, policy_err end
    local dbtype, dbtype_err = database_type(db)
    if dbtype_err or not dbtype then return nil, dbtype_err end
    local now = time.now()
    local now_ms = math.floor(now:unix_nano() / 1000000)
    local agg: RunStats = { events = 0, write_receipts = 0, needs_continue = false }

    local budget = math.floor((policy :: table).batch_events)
    local after_id = traversal and traversal.after_thread_id
    local end_id = traversal and traversal.end_thread_id
    local threads, thread_err = load_event_threads(db, dbtype, policy :: table,
        after_id, end_id, traversal ~= nil and end_id == nil)
    if thread_err then return nil, thread_err end
    local page = threads :: { table }
    local visited = 0
    local page_deadline: integer? = nil
    local projection_budget: ProjectionBudget = {rows = PROJECTION_BATCH, ranges = PROJECTION_RANGES}
    for index, row in ipairs(page) do
        if traversal then
            local scan = traversal.projection
            if scan and (scan.thread_id ~= row.id or scan.head_seq ~= tonumber(row.head_seq)
                or row.head_blocked ~= PROJECTION_PENDING) then
                traversal.projection, scan = nil, nil
            end
            if row.head_blocked == PROJECTION_PENDING then
                if not scan then
                    local head_seq = tonumber(row.head_seq)
                    if not head_seq then return nil, response_failure("retention event head has no sequence", "event.seq") end
                    scan = {thread_id = tostring(row.id), head_seq = head_seq :: integer}
                end
                traversal.projection = scan
                local blocked, scan_err = check_projection(db, dbtype, scan, projection_budget)
                if scan_err then return nil, scan_err end
                if blocked == nil then break end
                traversal.projection = nil
                if blocked then row.head_blocked = 1 end
            end
        end
        local deleted, deadline, prune_err = prune_thread(db, dbtype, row, policy :: table,
            now, now_ms, budget - agg.events, true)
        if prune_err then return nil, prune_err end
        agg.events = agg.events + (deleted :: integer)
        page_deadline = min_deadline(page_deadline, deadline)
        visited = index
        if agg.events >= budget then break end
    end

    -- Receipt timestamps are canonical RFC3339 UTC text on both dialects;
    -- event.created_at follows the database timestamp layout instead.
    local cutoff = now:add(-(policy :: table).receipts_orphan_ms * time.MILLISECOND)
        :utc():format(time.RFC3339)
    local purged, purge_err = receipt_purge.run(db, cutoff, (policy :: table).batch_receipts)
    if purge_err then return nil, purge_err end
    local count, count_err = deleted_count(purged, "purge.deleted")
    if count_err then return nil, count_err end
    agg.write_receipts = count :: integer
    agg.needs_continue = agg.events >= (policy :: table).batch_events
        or agg.write_receipts >= (policy :: table).batch_receipts
    if traversal then
        local last_id = visited > 0 and tostring(page[visited].id) or after_id
        local rotation_end = end_id or (page[1] and page[1].end_thread_id)
        local rotation_deadline = min_deadline(traversal.rotation_deadline_ms, page_deadline)
        if visited < #page or (#page == EVENT_THREAD_PAGE and last_id ~= rotation_end) then
            traversal.after_thread_id = last_id
            traversal.end_thread_id = rotation_end
            traversal.rotation_deadline_ms = rotation_deadline
            agg.deadline_ms = 0
        else
            traversal.projection = nil
            traversal.after_thread_id = nil
            traversal.end_thread_id = nil
            traversal.rotation_deadline_ms = nil
            traversal.last_deadline_ms = rotation_deadline
            -- Wakes received mid-rotation may affect an already visited ID.
            agg.deadline_ms = traversal.rescan and 0 or traversal.last_deadline_ms
            traversal.rescan = nil
        end
    end
    return agg, nil
end

function sweeper.run_for_thread(db: DB, thread_id: string): (table?, error?)
    if type(thread_id) ~= "string" or thread_id == "" then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end
    local dbtype, dbtype_err = database_type(db)
    if dbtype_err or not dbtype then return nil, dbtype_err end
    local event_head = dbtype == sql.type.POSTGRES and "NULLIF(e.created_at,'infinity'::timestamptz)" or "e.created_at"
    local rows, read_err = db:query([[SELECT t.id,p.event_hot_retention_days,p.enabled,]] .. event_head .. [[ AS head_created_at
        FROM kickside_thread t LEFT JOIN kickside_retention_policy p ON p.thread_id=t.id
        LEFT JOIN kickside_event e ON e.thread_id=t.id AND e.seq=t.max_pruned_seq+1
        WHERE t.id=$1 AND t.deleting_at IS NULL]], { thread_id })
    if read_err then return nil, errors.wrap(read_err, "failed to load thread policy") end
    local thread_rows, rows_err = rows_result(rows, "thread_policy.query")
    if rows_err then return nil, rows_err end
    if #(thread_rows :: { table }) == 0 then return { events = 0 }, nil end
    local row = (thread_rows :: { table })[1]
    if row.enabled ~= nil and not active(row.enabled) then return { events = 0 }, nil end
    local policy, policy_err = load_policy()
    if policy_err then return nil, policy_err end
    local now = time.now()
    local deleted, _, prune_err = prune_thread(db, dbtype, row, policy :: table,
        now, math.floor(now:unix_nano() / 1000000), (policy :: table).batch_events, false)
    if prune_err then return nil, prune_err end
    return { events = deleted }, nil
end

return sweeper
