-- Core owns event-prefix pruning and committed write-receipt retention. The
-- service invokes these operations at exact eligibility deadlines and after
-- state-change notifications; foreign-owner retention is dispatched by its owner.

local sql = require("sql")
local time = require("time")
local clock = require("clock")
local prune = require("prune")
local receipt_purge = require("receipt_purge")
local retention_policy = require("retention_policy")

local sweeper = {}

type DB = sql.DB

type RunStats = {
    events: integer,
    write_receipts: integer,
    needs_continue: boolean,
    next_after: string?,
    event_deadline_ms: integer?,
}

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

function sweeper.policy(): (table?, error?)
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

local function event_heads(db: DB, dbtype: string, policy: table, selection: string,
        params: table, field: string): ({ table }?, error?)
    local eligibility, joins = "", [[
        LEFT JOIN kickside_event e ON e.thread_id=t.id AND e.seq=t.max_pruned_seq+1
        LEFT JOIN kickside_retention_policy p ON p.thread_id=t.id]]
    if dbtype == sql.type.POSTGRES then
        -- These unique lookups stay parameterized even when the base tables are large.
        params[#params + 1] = policy.events_ms
        eligibility = [[,(FLOOR(EXTRACT(EPOCH FROM e.created_at)*1000)
            + COALESCE(p.event_hot_retention_days::bigint*86400000, $]]
            .. tostring(#params) .. [[::bigint) + 1)::bigint AS eligibility_ms]]
        joins = [[
            LEFT JOIN LATERAL (SELECT seq,created_at FROM kickside_event
                WHERE thread_id=t.id AND seq=t.max_pruned_seq+1 LIMIT 1) e ON true
            LEFT JOIN LATERAL (SELECT enabled,event_hot_retention_days FROM kickside_retention_policy
                WHERE thread_id=t.id LIMIT 1) p ON true]]
    end
    -- Apply the keyset limit before checking eligibility, including missing
    -- heads and disabled policies. Empty pages of eligible work still advance.
    local rows, err = db:query("WITH candidates AS MATERIALIZED (" .. selection .. [[)
        SELECT t.id,t.deleting_at,p.enabled,p.event_hot_retention_days,e.seq,e.created_at AS head_created_at,
            NOT EXISTS (SELECT 1 FROM kickside_retention_pin rp
                WHERE rp.thread_id=t.id AND rp.cursor_seq<e.seq) AS unpinned,
            (SELECT pc.last_seq FROM kickside_projection_cursor pc
                WHERE pc.thread_id=t.id AND pc.status<>'invalid' AND pc.last_seq<e.seq
                ORDER BY pc.last_seq LIMIT 1) IS NULL AS projected]]
        .. eligibility .. " FROM candidates t" .. joins .. " ORDER BY t.id", params)
    if err then return nil, errors.wrap(err, "failed to read Core event retention heads") end
    return rows_result(rows, field)
end

local function head_page(db: DB, dbtype: string, policy: table, after: string?, field: string): ({ table }?, error?)
    local source = "SELECT id,max_pruned_seq,deleting_at FROM kickside_thread"
    if after then
        return event_heads(db, dbtype, policy, source .. " WHERE id>$1 ORDER BY id LIMIT $2",
            {after, policy.batch_events}, field)
    end
    return event_heads(db, dbtype, policy, source .. " ORDER BY id LIMIT $1", {policy.batch_events}, field)
end

local function thread_head(db: DB, dbtype: string, policy: table, thread_id: string): (table?, error?)
    local rows, err = event_heads(db, dbtype, policy,
        "SELECT id,max_pruned_seq,deleting_at FROM kickside_thread WHERE id=$1",
        {thread_id}, "thread_policy.query")
    if err then return nil, err end
    return (rows :: {table})[1], nil
end

local function head_deadline(row: table, dbtype: string, policy: table): (integer?, integer?, error?)
    if row.deleting_at ~= nil or not active(row.enabled) or row.head_created_at == nil then return nil, nil, nil end
    if not tonumber(row.seq) then
        return nil, nil, response_failure("retention event head has no sequence", "event.seq")
    end
    if not active(row.unpinned) or not active(row.projected) then return nil, nil, nil end
    local window, window_err = event_window_ms(row, policy)
    if window_err then return nil, nil, window_err end
    if dbtype == sql.type.POSTGRES then
        local deadline = tonumber(row.eligibility_ms)
        if not deadline then
            return nil, nil, response_failure("retention event deadline is missing", "event.eligibility_ms")
        end
        return deadline :: integer, window, nil
    end
    local deadline, err = sweeper.deadline_ms(row.head_created_at, window :: integer, dbtype)
    return deadline, window, err
end

local function min_deadline(current: integer?, candidate: integer?): integer?
    if current == nil then return candidate end
    if candidate == nil then return current end
    return math.min(current :: integer, candidate :: integer)
end

local function receipt_deadline(db: DB, dbtype: string, policy: table): (integer?, error?)
    local receipts, receipt_err = db:query([[SELECT completed_at FROM kickside_write_receipt
        WHERE status='committed' AND completed_at IS NOT NULL ORDER BY completed_at LIMIT 1]])
    if receipt_err then return nil, errors.wrap(receipt_err, "failed to read next committed-receipt deadline") end
    local receipt_rows, receipts_err = rows_result(receipts, "receipt_deadline.query")
    if receipts_err then return nil, receipts_err end
    local receipt = (receipt_rows :: { table })[1]
    if not receipt then return nil, nil end
    return sweeper.deadline_ms(tostring(receipt.completed_at), policy.receipts_orphan_ms, dbtype)
end

local function dialect(db: DB): (string?, error?)
    local dbtype, err = db:type()
    if err then return nil, errors.wrap(err, "failed to resolve DB type") end
    if not dbtype then return nil, response_failure("failed to resolve DB type", "db.type") end
    return tostring(dbtype), nil
end

function sweeper.next_receipt_deadline_ms(db: DB): (integer?, error?)
    local policy, policy_err = sweeper.policy()
    if policy_err then return nil, policy_err end
    local dbtype, dbtype_err = dialect(db)
    if dbtype_err then return nil, dbtype_err end
    return receipt_deadline(db, dbtype :: string, policy :: table)
end

-- Exact deadline snapshot for callers outside the service. The service
-- computes this incrementally from the pages it already visits for pruning.
function sweeper.next_deadline_ms(db: DB): (integer?, error?)
    local policy, policy_err = sweeper.policy()
    if policy_err then return nil, policy_err end
    local dbtype, dbtype_err = dialect(db)
    if dbtype_err then return nil, dbtype_err end

    local next_ms: integer? = nil
    local after: string? = nil
    repeat
        local rows, err = head_page(db, dbtype :: string, policy :: table, after, "event_deadlines.query")
        if err then return nil, err end
        for _, row in ipairs(rows :: {table}) do
            local deadline, _, deadline_err = head_deadline(row, dbtype :: string, policy :: table)
            if deadline_err then return nil, deadline_err end
            next_ms = min_deadline(next_ms, deadline)
        end
        local count = #(rows :: {table})
        after = count == (policy :: table).batch_events and (rows :: {table})[count].id or nil
    until after == nil
    local next_receipt, err = receipt_deadline(db, dbtype :: string, policy :: table)
    if err then return nil, err end
    return min_deadline(next_ms, next_receipt), nil
end

local function prune_head(db: DB, dbtype: string, row: table, policy: table, now: any,
        maximum: integer): (integer?, integer?, error?)
    local id = tostring(row.id or "")
    if id == "" then return nil, nil, response_failure("retention candidate has no thread id", "candidate.id") end
    local deadline, window, err = head_deadline(row, dbtype, policy)
    if err then return nil, nil, err end
    if deadline == nil or deadline > math.floor(now:unix_nano() / 1000000) then return 0, deadline, nil end

    local result, prune_err = prune.prune_thread(db, id, {
        cutoff = event_cutoff(dbtype, window :: integer, now),
        batch_size = prune.MAX_LOCK_BATCH,
        max_total = maximum,
    })
    if prune_err then return nil, nil, prune_err end
    local deleted, count_err = deleted_count(result, "prune.deleted")
    if count_err then return nil, nil, count_err end
    -- Refresh only the head whose transaction may have advanced it or found
    -- a new protection floor.
    local head, read_err = thread_head(db, dbtype, policy, id)
    if read_err then return nil, nil, read_err end
    if not head then return deleted, nil, nil end
    local next_ms, _, deadline_err = head_deadline(head, dbtype, policy)
    return deleted, next_ms, deadline_err
end

function sweeper.run(db: DB, after: string?): (RunStats?, error?)
    local policy, policy_err = sweeper.policy()
    if policy_err then return nil, policy_err end
    local dbtype, dbtype_err = dialect(db)
    if dbtype_err then return nil, dbtype_err end
    local now = time.now()
    local agg: RunStats = { events = 0, write_receipts = 0, needs_continue = false }
    local batch = (policy :: table).batch_events :: integer

    local threads, thread_err = head_page(db, dbtype :: string, policy :: table, after, "candidates.query")
    if thread_err then return nil, thread_err end
    local visited = 0
    for _, row in ipairs(threads :: { table }) do
        local deleted, deadline, prune_err = prune_head(db, dbtype :: string, row, policy :: table, now, batch - agg.events)
        if prune_err then return nil, prune_err end
        visited = visited + 1
        after = row.id
        agg.event_deadline_ms = min_deadline(agg.event_deadline_ms, deadline)
        agg.events = agg.events + (deleted :: integer)
        if agg.events >= batch then break end
    end
    if visited < #(threads :: {table}) or visited == batch then agg.next_after = after end

    local cutoff = now:add(-(policy :: table).receipts_orphan_ms * time.MILLISECOND):utc():format(time.RFC3339)
    local purged, purge_err = receipt_purge.run(db, cutoff, (policy :: table).batch_receipts)
    if purge_err then return nil, purge_err end
    local count, count_err = deleted_count(purged, "purge.deleted")
    if count_err then return nil, count_err end
    agg.write_receipts = count :: integer
    agg.needs_continue = agg.next_after ~= nil
        or (agg.event_deadline_ms ~= nil and (agg.event_deadline_ms :: integer) <= math.floor(now:unix_nano() / 1000000))
        or agg.write_receipts >= (policy :: table).batch_receipts
    return agg, nil
end

function sweeper.run_for_thread(db: DB, thread_id: string, maximum: integer?, policy: table?): (table?, error?)
    if type(thread_id) ~= "string" or thread_id == "" then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end
    local dbtype, dbtype_err = dialect(db)
    if dbtype_err then return nil, dbtype_err end
    if not policy then
        local policy_err
        policy, policy_err = sweeper.policy()
        if policy_err then return nil, policy_err end
    end
    local head, read_err = thread_head(db, dbtype :: string, policy :: table, thread_id)
    if read_err then return nil, read_err end
    if not head then return { events = 0 }, nil end

    local limit = maximum or (policy :: table).batch_events
    local now = time.now()
    local deleted, next_ms, prune_err = prune_head(db, dbtype :: string, head, policy :: table, now, limit)
    if prune_err then return nil, prune_err end
    if next_ms ~= nil and next_ms <= math.floor(now:unix_nano() / 1000000) then
        return { events = deleted, needs_continue = true }, nil
    end
    return { events = deleted, deadline_ms = next_ms }, nil
end

return sweeper
