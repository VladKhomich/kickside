-- The Jobs-owned owner-delete fence of a thread. Enqueue and claim of a
-- thread-owned job lock the thread's cleanup row before job rows, and the
-- thread cleanup page locks it before deleting, so no job is admitted for a
-- thread whose cleanup has started.
local sql = require("sql")

local M = {}
M.TABLE = "kickside_job_thread_cleanup"

local function invalid_response(field: string, thread_id: string?): error
    return errors.new({message = "thread cleanup fence returned invalid " .. field, kind = errors.INTERNAL,
        retryable = false, details = {code = "job_thread_fence_response", field = field, thread_id = thread_id}})
end

local function flag(value: any): boolean
    return value == true or value == 1
end

-- lock(tx, thread_id) -> { started, next_page_seq, completed_at } with the
-- thread's cleanup row created when absent and held until the caller commits.
function M.lock_many(tx: sql.Transaction, thread_ids: { string }): ({ [string]: table }?, error?)
    local sorted: { string } = {}
    local seen: { [string]: boolean } = {}
    for _, id in ipairs(thread_ids) do
        if not seen[id] then seen[id] = true; sorted[#sorted + 1] = id end
    end
    table.sort(sorted)
    if #sorted == 0 then return {}, nil end
    local values: { string } = {}
    for index in ipairs(sorted) do values[#values + 1] = "($" .. tostring(index) .. ")" end
    local rows, err = tx:query("INSERT INTO " .. M.TABLE .. " (thread_id) VALUES "
        .. table.concat(values, ",") .. " ON CONFLICT(thread_id) DO UPDATE SET thread_id=excluded.thread_id"
        .. " RETURNING thread_id,started,next_page_seq,completed_at", sorted)
    if err then return nil, errors.wrap(err, "thread cleanup fence lock failed") end
    if type(rows) ~= "table" then return nil, invalid_response("rows") end
    local states: { [string]: table } = {}
    for _, row in ipairs(rows) do
        if type(row) ~= "table" then return nil, invalid_response("rows") end
        states[tostring(row.thread_id)] = { started = flag(row.started), next_page_seq = row.next_page_seq,
            completed_at = row.completed_at }
    end
    for _, id in ipairs(sorted) do
        if not states[id] then return nil, invalid_response("thread_id", id) end
    end
    return states, nil
end

function M.lock(tx: sql.Transaction, thread_id: string): (table?, error?)
    local states, err = M.lock_many(tx, { thread_id })
    if err or not states then return nil, err end
    return states[thread_id], nil
end

-- Linked producers can append a Core event later in the same transaction.
-- A nonblocking lock avoids waiting on them with Core thread rows held.
function M.lock_link(tx: sql.Transaction, dbtype: string, thread_id: string, cleanup: boolean): error?
    if dbtype ~= sql.type.POSTGRES then
        if cleanup then return nil end
        -- Start writing before reading a fence on SQLite. No fence is created
        -- for an independent link, and the cleanup transaction also writes.
        local _, err = tx:execute("UPDATE " .. M.TABLE .. " SET started=started WHERE FALSE")
        return err and errors.wrap(err, "thread link fence lock failed") or nil
    end

    local acquire = cleanup and "pg_try_advisory_xact_lock" or "pg_try_advisory_xact_lock_shared"
    local rows, err = tx:query("SELECT " .. acquire
        .. "(hashtextextended('kickside.core.jobs:thread-link:' || $1,0)) AS acquired", { thread_id })
    if err then return errors.wrap(err, "thread link fence lock failed") end
    if type(rows) ~= "table" or not rows[1] or type(rows[1].acquired) ~= "boolean" then
        return invalid_response("link_lock", thread_id)
    end
    if not rows[1].acquired then
        return errors.new({ message = "thread link write and cleanup are concurrent",
            kind = errors.CONFLICT, retryable = true, details = {
                code = "job_thread_link_busy", thread_id = thread_id,
                cleanup_pending = cleanup, needs_continue = cleanup,
            } })
    end
    return nil
end

function M.admit_link(tx: sql.Transaction, dbtype: string, thread_id: string): (string?, error?)
    local lock_err = M.lock_link(tx, dbtype, thread_id, false)
    if lock_err then return nil, lock_err end
    local rows, err = tx:query("SELECT started FROM " .. M.TABLE .. " WHERE thread_id=$1", { thread_id })
    if err then return nil, errors.wrap(err, "thread link fence read failed") end
    if type(rows) ~= "table" then return nil, invalid_response("link_rows", thread_id) end
    if rows[1] and flag(rows[1].started) then return nil, nil end
    return thread_id, nil
end

-- admit(tx, owner, operation) refuses new work for a thread owner whose
-- cleanup has started. Other owners carry no fence.
function M.admit(tx: sql.Transaction, owner: table, operation: string): error?
    if owner.kind ~= "thread" then return nil end
    local state, lock_err = M.lock(tx, owner.id)
    if lock_err then return lock_err end
    if (state :: table).started then
        return (errors.new({ message = "thread owner is being deleted",
            kind = errors.CONFLICT, retryable = false,
            details = { reason = "thread_cleanup", status = "blocked_source_deleted",
                scope = owner.kind .. ":" .. owner.id, blocked_operation = operation } }) :: error)
    end
    return nil
end

return M
