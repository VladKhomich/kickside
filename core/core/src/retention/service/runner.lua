-- One event-driven retention service pass: sweep durable state, run owner
-- retention operations, and compute the next stored-row eligibility deadline.
local sql = require("sql")
local logger = require("logger")
local process = require("process")
local sweeper = require("sweeper")
local owner_hooks = require("owner_hooks")

local M = {}

type PassResult = { stats: table, deadline_ms: integer?, owner_failures: { table }, owner_blocked: { table } }

local function invalid_response(message: string, field: string): error
    return errors.new({message = message, kind = errors.INTERNAL, retryable = false,
        details = {code = "retention_pass_response", field = field}})
end

local function earlier(first: integer?, second: integer?): integer?
    if first == nil then return second end
    if second == nil then return first end
    return math.min(first, second)
end

local function sweep_threads(db: sql.DB, pid: string, thread_ids: { string }, events_deleted: integer):
        (table?, integer?, error?)
    local stats = { events = 0, write_receipts = 0, needs_continue = false }
    local deadline_ms: integer? = nil
    for _, thread_id in ipairs(thread_ids) do
        local result, err = sweeper.run_for_thread(db, thread_id, events_deleted + stats.events)
        if err then return nil, nil, err end
        if not result then
            return nil, nil, invalid_response("retention sweep returned no result", "sweeper.run_for_thread")
        end
        stats.events = stats.events + result.events
        if result.needs_continue then
            local _, send_err = process.send(pid, "kickside.core.retention.changed", { kind = "continue", thread_id = thread_id })
            if send_err then return nil, nil, errors.wrap(send_err, "retention continuation handoff failed") end
            stats.needs_continue = true
        else
            local candidate, deadline_err = sweeper.next_deadline_ms(db, thread_id)
            if deadline_err then return nil, nil, deadline_err end
            deadline_ms = earlier(deadline_ms, candidate)
        end
    end
    return stats, deadline_ms, nil
end

local function perform(db: sql.DB, pid: string, change: table?, thread_ids: { string }?,
        previous_deadline: integer?, events_deleted: integer?): (PassResult?, error?)
    local stats, sweep_err, deadline_ms
    if thread_ids then
        stats, deadline_ms, sweep_err = sweep_threads(db, pid, thread_ids, events_deleted or 0)
        deadline_ms = earlier(previous_deadline, deadline_ms)
    else
        stats, sweep_err = sweeper.run(db, events_deleted)
    end
    if sweep_err or not stats then
        local err = sweep_err or invalid_response("retention sweep returned no result", "sweeper.run")
        logger:error("retention sweep failed: " .. tostring(err))
        return nil, err
    end

    -- Core passes no foreign table names, cutoff or batch. Each owner callback
    -- applies its own public retention operation and its own policy.
    local owners, owner_err = owner_hooks.run(change)
    if owner_err or not owners then
        local err = owner_err or invalid_response("retention owner discovery returned no report", "owner_hooks.run")
        logger:error("retention owner discovery failed: " .. tostring(err))
        return nil, err
    end
    -- A failed owner keeps its rows until a later pass; the other owners and
    -- Core's own retention proceed.
    for _, failed in ipairs((owners :: table).failures) do
        logger:error("retention owner operation failed: " .. tostring(failed.error), { owner = failed.owner })
    end
    local owner_rows = (owners :: table).deleted :: integer

    local s = stats :: table
    if s.events > 0 or s.write_receipts > 0 or (owner_rows :: integer) > 0 then
        logger:info("Core retention pass complete", {
            events_deleted = s.events,
            write_receipts_deleted = s.write_receipts,
            owner_rows_deleted = owner_rows,
        })
    end

    local owners_continue = (owners :: table).needs_continue == true
    if owners_continue or (thread_ids == nil and s.needs_continue) then
        local _, send_err = process.send(pid, "kickside.core.retention.changed", { kind = "continue", owner_locator = change and change.owner_locator })
        if send_err then return nil, errors.wrap(send_err, "retention continuation handoff failed") end
    end
    s.needs_continue = s.needs_continue or owners_continue

    if thread_ids == nil then
        local deadline_err
        deadline_ms, deadline_err = sweeper.next_deadline_ms(db)
        if deadline_err then return nil, deadline_err end
    end
    deadline_ms = earlier(deadline_ms, (owners :: table).deadline_ms)
    return { stats = s, deadline_ms = deadline_ms, owner_failures = (owners :: table).failures, owner_blocked = (owners :: table).blocked }, nil
end

function M.recover(db: sql.DB, pid: string): (PassResult?, error?)
    return perform(db, pid)
end

local function thread_id_of(change: table): string?
    local id = change.thread_id
    if type(id) == "string" and id ~= "" then return id end
    return nil
end

function M.on_wake(db: sql.DB, pid: string, change: table, previous_deadline: integer?): (PassResult?, error?)
    if type(change) ~= "table" or type(change.kind) ~= "string" or change.kind == "" then
        return nil, (errors.new({ message = "retention wake requires a change kind", kind = errors.INVALID }) :: error)
    end
    local thread_id = thread_id_of(change)
    return perform(db, pid, change, thread_id and { thread_id } or nil, previous_deadline)
end

-- Unscoped changes are durable recovery hints. One full recovery covers them;
-- scoped owner requests keep their original context and order.
function M.on_wakes(db: sql.DB, pid: string, changes: table[], previous_deadline: integer?): (PassResult?, error?)
    if #changes == 0 then
        return nil, (errors.new({ message = "retention wakes require changes", kind = errors.INVALID }) :: error)
    end
    local pending: table[] = {}
    local thread_ids: { string } = {}
    local seen: { [string]: boolean } = {}
    local recovered = false
    for _, change in ipairs(changes) do
        if type(change.kind) ~= "string" or change.kind == "" then
            return nil, (errors.new({ message = "retention wake requires a change kind", kind = errors.INVALID }) :: error)
        end
        local thread_id = thread_id_of(change)
        if change.owner_locator ~= nil then
            pending[#pending + 1] = { change = change, thread_ids = thread_id and { thread_id } or nil }
        elseif thread_id then
            if not seen[thread_id] then
                thread_ids[#thread_ids + 1] = thread_id
                seen[thread_id] = true
            end
        elseif not recovered then
            pending[#pending + 1] = {}
            recovered = true
        end
    end
    if not recovered and #thread_ids > 0 then pending[#pending + 1] = { thread_ids = thread_ids } end
    local aggregate: PassResult? = nil
    for _, request in ipairs(pending) do
        local events_deleted = aggregate and aggregate.stats.events or 0
        local result, err = perform(db, pid, request.change, request.thread_ids, previous_deadline, events_deleted)
        if err or not result then return nil, err or invalid_response("retention recovery returned no result", "runner.perform") end
        previous_deadline = result.deadline_ms
        if aggregate == nil then
            aggregate = result
        else
            aggregate.stats.events = aggregate.stats.events + result.stats.events
            aggregate.stats.write_receipts = aggregate.stats.write_receipts + result.stats.write_receipts
            aggregate.stats.needs_continue = aggregate.stats.needs_continue or result.stats.needs_continue
            aggregate.deadline_ms = result.deadline_ms
            for _, failure in ipairs(result.owner_failures) do aggregate.owner_failures[#aggregate.owner_failures + 1] = failure end
            for _, blocked in ipairs(result.owner_blocked) do aggregate.owner_blocked[#aggregate.owner_blocked + 1] = blocked end
        end
    end
    return aggregate, nil
end

function M.on_deadline(db: sql.DB, pid: string): (PassResult?, error?)
    return perform(db, pid)
end

return M
