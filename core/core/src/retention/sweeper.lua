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
type EventTraversal = {
    after_thread_id: string?,
    end_thread_id: string?,
    rotation_deadline_ms: integer?,
    last_deadline_ms: integer?,
    rescan: boolean?,
}

type RunStats = {
    events: integer,
    write_receipts: integer,
    needs_continue: boolean,
    deadline_ms: integer?,
}

local EVENT_THREAD_PAGE = 256

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
        now: any, now_ms: integer, maximum: integer, native_deadline: boolean): (integer?, integer?, error?)
    local thread_id = tostring(row.id or "")
    if thread_id == "" then
        return nil, nil, response_failure("retention candidate has no thread id", "candidate.id")
    end
    if row.head_blocked == 1 or type(row.head_created_at) ~= "string" then return 0, nil, nil end
    local window, window_err = event_window_ms(row, policy)
    if window_err then return nil, nil, window_err end
    local deadline: integer?
    if native_deadline then
        deadline = tonumber(row.eligibility_ms) :: integer?
        if deadline == nil then
            return nil, nil, response_failure("retention event deadline is missing", "event.eligibility_ms")
        end
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
    })
    if prune_err then return nil, nil, prune_err end
    local deleted, count_err = deleted_count(result, "prune.deleted")
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
    local native_deadline = ""
    local params: table = {}
    if dbtype == sql.type.POSTGRES then
        policy_join = [[LEFT JOIN LATERAL (
            SELECT p.enabled,p.event_hot_retention_days FROM kickside_retention_policy p WHERE p.thread_id=t.id LIMIT 1
        ) p ON TRUE]]
        -- The sequence order lets PostgreSQL seek the head using (thread_id, seq).
        event_join = [[LEFT JOIN LATERAL (
            SELECT e.seq,e.created_at,(FLOOR(EXTRACT(EPOCH FROM e.created_at)*1000)
                + COALESCE(p.event_hot_retention_days::bigint*86400000,$1::bigint) + 1)::bigint AS eligibility_ms
            FROM kickside_event e
            WHERE t.deleting_at IS NULL AND e.thread_id=t.id AND e.seq>t.max_pruned_seq
                AND (p.enabled IS NULL OR p.enabled=TRUE)
            ORDER BY e.seq LIMIT 1
        ) e ON e.seq=t.max_pruned_seq+1]]
        native_deadline = ",e.eligibility_ms"
        params = { policy.events_ms }
    end
    local bounds = ""
    if after_id then
        params[#params + 1] = after_id
        bounds = " WHERE id>$" .. tostring(#params)
        if end_id then
            params[#params + 1] = end_id
            bounds = bounds .. " AND id<=$" .. tostring(#params)
        end
    end
    -- Capture the end in the first page's snapshot. A backward primary-key
    -- seek gives the rotation a fixed endpoint even as higher IDs are added.
    local rotation_end = start_rotation
        and ",(SELECT id FROM kickside_thread ORDER BY id DESC LIMIT 1) AS end_thread_id" or ""
    -- Take the page before looking up heads or their protection floors.
    local rows, err = db:query([[SELECT t.id,p.event_hot_retention_days,e.created_at AS head_created_at,
        CASE WHEN e.seq IS NOT NULL AND (EXISTS (SELECT 1 FROM kickside_retention_pin rp
            WHERE rp.thread_id=t.id AND rp.cursor_seq<e.seq)
        OR EXISTS (SELECT 1 FROM kickside_projection_cursor pc
            WHERE pc.thread_id=t.id AND pc.status IN ('active','paused') AND pc.last_seq<e.seq))
        THEN 1 ELSE 0 END AS head_blocked]]
        .. native_deadline .. rotation_end .. "\nFROM (SELECT id,max_pruned_seq,deleting_at FROM kickside_thread"
        .. bounds .. " ORDER BY id LIMIT " .. tostring(EVENT_THREAD_PAGE) .. ") t\n"
        .. policy_join .. "\n" .. event_join .. "\nORDER BY t.id", params)
    if err then return nil, errors.wrap(err, "failed to load Core event retention candidates") end
    return rows_result(rows, "candidates.query")
end

local function min_deadline(current: integer?, candidate: integer?): integer?
    if candidate == nil then return current end
    return current == nil and candidate or math.min(current, candidate)
end

local function receipt_deadline_ms(db: DB, dbtype: string, policy: table): (integer?, error?)
    local receipts, receipt_err = db:query([[SELECT completed_at FROM kickside_write_receipt
        WHERE status='committed' AND completed_at IS NOT NULL
        ORDER BY completed_at LIMIT 1]])
    if receipt_err then return nil, errors.wrap(receipt_err, "failed to read next committed-receipt deadline") end
    local receipt_rows, receipts_err = rows_result(receipts, "receipt_deadline.query")
    if receipts_err then return nil, receipts_err end
    local receipt = (receipt_rows :: { table })[1]
    if receipt then
        return sweeper.deadline_ms(tostring(receipt.completed_at), policy.receipts_orphan_ms, dbtype)
    end
    return nil, nil
end

function sweeper.run(db: DB, traversal: EventTraversal?): (RunStats?, error?)
    local policy, policy_err = load_policy()
    if policy_err then return nil, policy_err end
    local raw_dbtype, dbtype_err = db:type()
    if dbtype_err then return nil, errors.wrap(dbtype_err, "failed to resolve DB type") end
    if not raw_dbtype then return nil, response_failure("failed to resolve DB type", "db.type") end
    local dbtype = tostring(raw_dbtype)
    local now = time.now()
    local now_ms = math.floor(now:unix_nano() / 1000000)
    local agg: RunStats = { events = 0, write_receipts = 0, needs_continue = false }

    local budget = math.floor((policy :: table).batch_events)
    local after_id = traversal and traversal.after_thread_id
    local end_id = traversal and traversal.end_thread_id
    local threads, thread_err = load_event_threads(db, dbtype, policy :: table,
        after_id, end_id, traversal ~= nil and after_id == nil)
    if thread_err then return nil, thread_err end
    local page = threads :: { table }
    local visited = 0
    local page_deadline: integer? = nil
    for index, row in ipairs(page) do
        local deleted, deadline, prune_err = prune_thread(db, dbtype, row, policy :: table,
            now, now_ms, budget - agg.events, dbtype == sql.type.POSTGRES)
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
        local last_id = visited > 0 and tostring(page[visited].id) or nil
        local rotation_end = end_id or (page[1] and page[1].end_thread_id)
        local rotation_deadline = min_deadline(traversal.rotation_deadline_ms, page_deadline)
        if visited < #page or (#page == EVENT_THREAD_PAGE and last_id ~= rotation_end) then
            traversal.after_thread_id = last_id
            traversal.end_thread_id = rotation_end
            traversal.rotation_deadline_ms = rotation_deadline
            agg.deadline_ms = 0
        else
            local receipt_deadline, deadline_err = receipt_deadline_ms(db, dbtype, policy :: table)
            if deadline_err then return nil, deadline_err end
            traversal.after_thread_id = nil
            traversal.end_thread_id = nil
            traversal.rotation_deadline_ms = nil
            traversal.last_deadline_ms = rotation_deadline
            -- Wakes received mid-rotation may affect an already visited ID.
            agg.deadline_ms = traversal.rescan and 0 or min_deadline(traversal.last_deadline_ms, receipt_deadline)
            traversal.rescan = nil
        end
    end
    return agg, nil
end

function sweeper.run_for_thread(db: DB, thread_id: string): (table?, error?)
    if type(thread_id) ~= "string" or thread_id == "" then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end
    local raw_dbtype, dbtype_err = db:type()
    if dbtype_err then return nil, errors.wrap(dbtype_err, "failed to resolve DB type") end
    if not raw_dbtype then return nil, response_failure("failed to resolve DB type", "db.type") end
    local dbtype = tostring(raw_dbtype)
    local rows, read_err = db:query([[SELECT t.id,p.event_hot_retention_days,p.enabled,
            e.created_at AS head_created_at
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
