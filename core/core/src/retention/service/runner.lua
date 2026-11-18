-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- One event-driven retention service pass: sweep durable state, run owner
-- retention operations, and select the next wake-up hint.
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

local function perform(db: sql.DB, pid: string, change: table?, traversal: table?): (PassResult?, error?)
    local stats, sweep_err = sweeper.run(db, traversal or {})
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

    s.needs_continue = s.needs_continue or (owners :: table).needs_continue == true
    if s.needs_continue then
        local _, send_err = process.send(pid, "kickside.core.retention.changed", { kind = "continue", owner_locator = change and change.owner_locator })
        if send_err then return nil, errors.wrap(send_err, "retention continuation handoff failed") end
    end

    local deadline_ms = s.deadline_ms
    if deadline_ms ~= 0 and not s.needs_continue then
        -- A caller can commit a pending receipt while an owner hook runs.
        local receipt_deadline, receipt_err = sweeper.next_receipt_deadline_ms(db)
        if receipt_err then return nil, receipt_err end
        if receipt_deadline ~= nil then
            deadline_ms = deadline_ms == nil and receipt_deadline or math.min(deadline_ms, receipt_deadline)
        end
    end
    local owner_deadline = (owners :: table).deadline_ms
    if owner_deadline ~= nil then
        deadline_ms = deadline_ms == nil and owner_deadline or math.min(deadline_ms, owner_deadline)
    end
    return { stats = s, deadline_ms = deadline_ms, owner_failures = (owners :: table).failures, owner_blocked = (owners :: table).blocked }, nil
end

local function note_change(traversal: table?): ()
    if traversal and traversal.end_thread_id then
        traversal.rescan = true
    end
end

function M.recover(db: sql.DB, pid: string, traversal: table?): (PassResult?, error?)
    return perform(db, pid, nil, traversal)
end

function M.on_wake(db: sql.DB, pid: string, change: table, traversal: table?): (PassResult?, error?)
    if type(change) ~= "table" or type(change.kind) ~= "string" or change.kind == "" then
        return nil, (errors.new({ message = "retention wake requires a change kind", kind = errors.INVALID }) :: error)
    end
    if change.kind ~= "continue" then note_change(traversal) end
    return perform(db, pid, change, traversal)
end

-- Unscoped changes are durable recovery hints. One full recovery covers them;
-- scoped owner requests keep their original context and order.
function M.on_wakes(db: sql.DB, pid: string, changes: table[], traversal: table?): (PassResult?, error?)
    if #changes == 0 then
        return nil, (errors.new({ message = "retention wakes require changes", kind = errors.INVALID }) :: error)
    end
    local pending: table[] = {}
    local recovered = false
    local changed = false
    for _, change in ipairs(changes) do
        if type(change.kind) ~= "string" or change.kind == "" then
            return nil, (errors.new({ message = "retention wake requires a change kind", kind = errors.INVALID }) :: error)
        end
        changed = changed or change.kind ~= "continue"
        if change.owner_locator ~= nil then
            pending[#pending + 1] = { change = change }
        elseif not recovered then
            pending[#pending + 1] = {}
            recovered = true
        end
    end
    if changed then note_change(traversal) end
    local aggregate: PassResult? = nil
    for _, request in ipairs(pending) do
        local result, err = perform(db, pid, request.change, traversal)
        if err or not result then return nil, err or invalid_response("retention recovery returned no result", "runner.perform") end
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

function M.on_deadline(db: sql.DB, pid: string, traversal: table?): (PassResult?, error?)
    return perform(db, pid, nil, traversal)
end

return M
