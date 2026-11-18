-- One event-driven retention pass for Core and the requested table owners.
local sql = require("sql")
local logger = require("logger")
local process = require("process")
local sweeper = require("sweeper")
local owner_hooks = require("owner_hooks")

local M = {}
local TOPIC = "kickside.core.retention.changed"

type Scan = { after: string?, deadline_ms: integer? }
type PassResult = { stats: table, deadline_ms: integer?, owner_failures: { table }, owner_blocked: { table } }

local function invalid_response(message: string, field: string): error
    return errors.new({message = message, kind = errors.INTERNAL, retryable = false,
        details = {code = "retention_pass_response", field = field}})
end

local function earliest(current: integer?, candidate: integer?): integer?
    if current == nil then return candidate end
    if candidate == nil then return current end
    return math.min(current :: integer, candidate :: integer)
end

local function send(pid: string, change: table): error?
    local _, err = process.send(pid, TOPIC, change)
    return err and errors.wrap(err, "retention continuation handoff failed") or nil
end

local function perform(db: sql.DB, pid: string, changes: table[]?, scan: Scan,
        armed_deadline: integer?): (PassResult?, error?)
    local threads: {string} = {}
    local seen: {[string]: boolean} = {}
    local function add_thread(id: string)
        if not seen[id] then
            seen[id] = true
            threads[#threads + 1] = id
        end
    end

    local global = changes == nil
    local requests: table[] = changes == nil and {{}} or {}
    local all_owners = global
    for _, change in ipairs(changes or {}) do
        if type(change.kind) ~= "string" or change.kind == "" then
            return nil, (errors.new({ message = "retention wake requires a change kind", kind = errors.INVALID }) :: error)
        end
        local scoped = false
        if type(change.thread_id) == "string" and change.thread_id ~= "" then
            add_thread(change.thread_id)
            scoped = true
        end
        if type(change.thread_ids) == "table" then
            for _, id in ipairs(change.thread_ids) do
                if type(id) == "string" and id ~= "" then
                    -- Multi-ingest also supplies the existing Jobs wake keys.
                    add_thread((id:gsub("^thread:", "")))
                    scoped = true
                end
            end
        end
        if not scoped then global = true end
        if change.owner_locator ~= nil then
            requests[#requests + 1] = {change = change}
        elseif not scoped and not all_owners then
            requests[#requests + 1] = {change = #(changes :: table[]) == 1 and change or nil}
            all_owners = true
        end
    end

    local stats: table = {events = 0, write_receipts = 0, needs_continue = false}
    if global then
        local page, sweep_err = sweeper.run(db, scan.after)
        if sweep_err or not page then
            local err = sweep_err or invalid_response("retention sweep returned no result", "sweeper.run")
            logger:error("retention sweep failed: " .. tostring(err))
            return nil, err
        end
        stats = page :: table
        scan.after = stats.next_after
        scan.deadline_ms = earliest(scan.deadline_ms, stats.event_deadline_ms)
        armed_deadline = stats.needs_continue and 0 or scan.deadline_ms
        if scan.after == nil then scan.deadline_ms = nil end
    end

    if #threads > 0 then
        local policy, policy_err = sweeper.policy()
        if policy_err then return nil, policy_err end
        local batch = (policy :: table).batch_events :: integer
        local pending: {string} = {}
        for index, id in ipairs(threads) do
            if stats.events >= batch or index > batch then
                pending[#pending + 1] = id
            else
                local result, err = sweeper.run_for_thread(db, id, batch - stats.events, policy)
                if err or not result then
                    return nil, err or invalid_response("retention sweep returned no result", "sweeper.run_for_thread")
                end
                stats.events = stats.events + result.events
                armed_deadline = earliest(armed_deadline, result.deadline_ms)
                if scan.after ~= nil then
                    scan.deadline_ms = earliest(scan.deadline_ms, result.deadline_ms)
                end
                if result.needs_continue then pending[#pending + 1] = id end
            end
        end
        if #pending > 0 then
            local err = send(pid, {kind = "continue", thread_ids = pending})
            if err then return nil, err end
            stats.needs_continue = true
        end
    end

    local failures: {table} = {}
    local blocked: {table} = {}
    local owner_rows = 0
    for _, request in ipairs(requests) do
        local owners, owner_err = owner_hooks.run(request.change)
        if owner_err or not owners then
            local err = owner_err or invalid_response("retention owner discovery returned no report", "owner_hooks.run")
            logger:error("retention owner discovery failed: " .. tostring(err))
            return nil, err
        end
        for _, failed in ipairs(owners.failures) do
            logger:error("retention owner operation failed: " .. tostring(failed.error), {owner = failed.owner})
            failures[#failures + 1] = failed
        end
        for _, item in ipairs(owners.blocked) do blocked[#blocked + 1] = item end
        owner_rows = owner_rows + owners.deleted
        armed_deadline = earliest(armed_deadline, owners.deadline_ms)
        if owners.needs_continue then
            local err = send(pid, {kind = "continue", owner_locator = request.change and request.change.owner_locator})
            if err then return nil, err end
            stats.needs_continue = true
        end
    end
    if global then
        local receipt_ms, err = sweeper.next_receipt_deadline_ms(db)
        if err then return nil, err end
        armed_deadline = earliest(armed_deadline, receipt_ms)
    end
    if stats.events > 0 or stats.write_receipts > 0 or owner_rows > 0 then
        logger:info("Core retention pass complete", {
            events_deleted = stats.events,
            write_receipts_deleted = stats.write_receipts,
            owner_rows_deleted = owner_rows,
        })
    end
    return {stats = stats, deadline_ms = armed_deadline, owner_failures = failures, owner_blocked = blocked}, nil
end

function M.recover(db: sql.DB, pid: string, scan: Scan?): (PassResult?, error?)
    return perform(db, pid, nil, scan or {}, nil)
end

function M.on_wake(db: sql.DB, pid: string, change: table, scan: Scan?, deadline: integer?): (PassResult?, error?)
    if type(change) ~= "table" then
        return nil, (errors.new({ message = "retention wake requires a change kind", kind = errors.INVALID }) :: error)
    end
    return perform(db, pid, {change}, scan or {}, deadline)
end

function M.on_wakes(db: sql.DB, pid: string, changes: table[], scan: Scan?, deadline: integer?): (PassResult?, error?)
    if #changes == 0 then
        return nil, (errors.new({ message = "retention wakes require changes", kind = errors.INVALID }) :: error)
    end
    return perform(db, pid, changes, scan or {}, deadline)
end

function M.on_deadline(db: sql.DB, pid: string, scan: Scan?): (PassResult?, error?)
    return M.recover(db, pid, scan)
end

return M
