-- The Jobs-owned owner-delete fence of a thread. Enqueue and claim of a
-- thread-owned job lock the thread's cleanup row before job rows, and the
-- thread cleanup page locks it before deleting, so no job is admitted for a
-- thread whose cleanup has started.
local sql = require("sql")

local M = {}
M.TABLE = "kickside_job_thread_cleanup"

function M.owner_key(dbtype: string, column: string): string
    if dbtype ~= sql.type.POSTGRES then return column end
    return "CASE WHEN " .. column .. " ~* '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$'"
        .. " THEN CAST(" .. column .. " AS uuid) END"
end

-- nil starts a round; false keeps an exhausted scan finished for that round.
function M.ordered_window(db: sql.DB, source: string, alias: string, keys: {string},
        predicate: string, eligible: string, after: any, first: {any}, limit: integer, bindings: {any}?): (table[]?, error?, any)
    if after == false then return {}, nil, false end
    local params: {any} = {}
    local args: {string} = {}
    for _, value in ipairs(bindings or {}) do params[#params + 1] = value end
    for i, value in ipairs(after or first) do
        params[#params + 1] = value
        args[i] = "$" .. tostring(#params)
    end
    params[#params + 1] = limit
    local columns = table.concat(keys, ",")
    local seek = #keys == 1 and columns .. ">" .. args[1]
        or "(" .. columns .. ")>(" .. table.concat(args, ",") .. ")"
    local rows, err = db:query("SELECT " .. columns .. ",(" .. eligible .. ") AS eligible FROM (SELECT "
        .. columns .. " FROM " .. source .. " WHERE " .. predicate .. " AND " .. seek
        .. " ORDER BY " .. columns .. " LIMIT $" .. tostring(#params) .. ") " .. alias
        .. " ORDER BY " .. columns, params)
    if type(rows) ~= "table" or err then return rows, err, false end
    local matched = {}
    for _, row in ipairs(rows) do
        if row.eligible == true or row.eligible == 1 then matched[#matched + 1] = row end
    end
    if #rows < limit then return matched, nil, false end
    local position: {any} = {}
    for i, key in ipairs(keys) do position[i] = rows[#rows][key] end
    return matched, nil, position
end

local function invalid_response(field: string, thread_id: string?): error
    return errors.new({message = "thread cleanup fence returned invalid " .. field, kind = errors.INTERNAL,
        retryable = false, details = {code = "job_thread_fence_response", field = field, thread_id = thread_id}})
end

local function flag(value: any): boolean
    return value == true or value == 1
end

local function state(row: table): table
    return { started = flag(row.started), next_page_seq = row.next_page_seq, completed_at = row.completed_at }
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
        states[tostring(row.thread_id)] = state(row)
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

-- SQLite takes the write lock with the update. Neither engine creates a row.
function M.lock_existing(tx: sql.Transaction, dbtype: string, thread_id: string): (table?, error?)
    local fields = "started,next_page_seq,completed_at"
    local statement = dbtype == sql.type.POSTGRES
        and "SELECT " .. fields .. " FROM " .. M.TABLE .. " WHERE thread_id=$1 FOR UPDATE"
        or "UPDATE " .. M.TABLE .. " SET thread_id=thread_id WHERE thread_id=$1 RETURNING " .. fields
    local rows, err = tx:query(statement, {thread_id})
    if err then return nil, errors.wrap(err, "thread cleanup fence lock failed") end
    if type(rows) ~= "table" then return nil, invalid_response("rows") end
    local row = rows[1]
    if row == nil then return nil, nil end
    if type(row) ~= "table" then return nil, invalid_response("rows") end
    return state(row), nil
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
