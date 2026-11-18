-- Durable first phase of thread deletion. Marking the thread stops new event
-- and pin admissions; the existing owner retry visits at most 100 consumers
-- per call and asks each surviving owner to block before events are removed.
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local contract = require("contract")
local job_teardown = require("job_teardown")
local sql_boundary = require("sql_boundary")

local M = {}

local function response_error(field: string): error
    return errors.new({message = "thread teardown fence response is invalid", kind = errors.INTERNAL,
        retryable = false, details = {code = "thread_teardown_fence_response", field = field}})
end

local function rows_error(rows: any, err: error?, operation: string, field: string): error?
    if err then return errors.wrap(err, operation) end
    if type(rows) ~= "table" then return response_error(field) end
    return nil
end

local function write_error(result: any, err: error?, operation: string, field: string): error?
    if err then return errors.wrap(err, operation) end
    if type(result) ~= "table" then return response_error(field) end
    local count = tonumber(result.rows_affected)
    if count == nil or count ~= count or count < 0 or count > 1 or count % 1 ~= 0 then
        return response_error(field)
    end
    return nil
end

local function pending(message: string, needs_continue: boolean?): error
    return (errors.new({ message = message, kind = errors.CONFLICT, retryable = true,
        details = { cleanup_pending = true, needs_continue = needs_continue == true } }) :: error)
end

function M.mark(db: any, id: string): error?
    local dbtype, type_err = sql_boundary.database_type(db, "thread cleanup dialect", "database.type", response_error)
    if type_err or not dbtype then return type_err end
    local tx, begin_err = sql_boundary.begin(db, "thread delete mark begin failed", "mark.transaction", response_error)
    if begin_err or not tx then return begin_err end
    local stamp = time.now():utc():format(time.RFC3339)
    local result, err = tx:execute("UPDATE kickside_thread SET deleting_at=$1 WHERE id=$2 AND deleting_at IS NULL",
        {stamp, id})
    local mark_err = write_error(result, err, "thread delete mark failed", "mark.write")
    if not mark_err and tonumber(result.rows_affected) == 1 then
        local sequence, cleanup_err = job_teardown.start_thread_cleanup_tx(tx, dbtype, id)
        mark_err = cleanup_err
        if not mark_err and (type(sequence) ~= "number" or sequence < 0 or sequence % 1 ~= 0) then
            mark_err = response_error("mark.page_seq")
        elseif not mark_err and (sequence :: integer) > 0 then
            local saved, save_err = tx:execute("UPDATE kickside_thread SET teardown_page_seq=$1 WHERE id=$2",
                {sequence, id})
            local _, proof = sql_boundary.exact_row_count(saved, save_err, "thread cleanup sequence stamp failed",
                "mark.sequence_write", 1, response_error)
            mark_err = proof
        end
    end
    if mark_err then return sql_boundary.rollback(tx, mark_err, "thread delete mark rollback failed") end
    local _, commit_err = tx:commit()
    if commit_err then return errors.wrap(commit_err, "thread delete mark commit failed") end
    local rows, proof_err = db:query("SELECT deleting_at FROM kickside_thread WHERE id=$1", { id })
    local read_err = rows_error(rows, proof_err, "thread delete mark proof failed", "mark.rows")
    if read_err then return read_err end
    if next(rows) == nil then return nil end
    if type(rows[1]) ~= "table" or rows[1].deleting_at == nil then
        return response_error("mark.deleting_at")
    end
    return nil
end

function M.fence_page(db: any, id: string): (boolean?, error?)
    local rows, read_err = db:query("SELECT component_id,teardown_fence_cursor,teardown_fence_done"
        .. " FROM kickside_thread WHERE id=$1", { id })
    local state_err = rows_error(rows, read_err, "thread fence state read failed", "state.rows")
    if state_err then return nil, state_err end
    if next(rows) == nil then return true, nil end
    if type(rows[1]) ~= "table" then
        return nil, response_error("state")
    end
    local state = rows[1]
    if state.teardown_fence_done == true or state.teardown_fence_done == 1 then return true, nil end
    if type(state.teardown_fence_cursor) ~= "string" then
        return nil, response_error("state.cursor")
    end
    local cursor = state.teardown_fence_cursor :: string
    local pins, pin_err = db:query("SELECT consumer_key FROM kickside_retention_pin"
        .. " WHERE thread_id=$1 AND consumer_key>$2 ORDER BY consumer_key LIMIT 101", { id, cursor })
    local page_err = rows_error(pins, pin_err, "thread consumer fence page failed", "pins.rows")
    if page_err then return nil, page_err end
    local limit = math.min(#pins, 100)
    local fence: any = nil
    for i = 1, limit do
        if type(pins[i]) ~= "table" or type(pins[i].consumer_key) ~= "string" or pins[i].consumer_key == "" then
            return nil, response_error("pins.consumer_key")
        end
        local key = pins[i].consumer_key :: string
        local local_cursor = false
        local cursor_id = key:match("^projection:(.+)$")
        if cursor_id and uuid.validate(cursor_id) then
            local owned, owned_err = db:query("SELECT id FROM kickside_projection_cursor WHERE id=$1 AND thread_id=$2",
                {cursor_id, id})
            local lookup_err = rows_error(owned, owned_err, "thread local cursor lookup failed", "cursor_owner.rows")
            if lookup_err then return nil, lookup_err end
            local_cursor = #owned > 0
        end
        local owner = key:match("^drive:([^:]+):.+$")
        if not local_cursor and key ~= "self:" .. id and owner ~= id and owner ~= tostring(state.component_id) then
            if not owner then return nil, pending("retention consumer has no owner locator: " .. key) end
            if not fence then
                local definition, def_err = contract.get("kickside.core:source_delete_fence")
                if def_err then return nil, errors.wrap(def_err, "source fence contract unavailable") end
                if type(definition) ~= "table" and type(definition) ~= "userdata" then
                    return nil, response_error("fence.contract")
                end
                local opened, open_err = (definition :: any):open()
                if open_err then return nil, errors.wrap(open_err, "source fence binding unavailable") end
                if type(opened) ~= "table" and type(opened) ~= "userdata" then
                    return nil, response_error("fence.binding")
                end
                fence = opened
            end
            local outcome, fence_err = fence:fence({ source_thread_id = id, consumer_key = key })
            if fence_err then return nil, fence_err end
            if type(outcome) ~= "table" or outcome.fenced ~= true then
                return nil, response_error("fence.outcome")
            end
        end
    end
    local last = limit > 0 and tostring(pins[limit].consumer_key) or cursor
    local more = #pins > 100
    local dialect, dt_err = db:type()
    if dt_err then return nil, errors.wrap(dt_err, "thread fence dialect unavailable") end
    if type(dialect) ~= "string" or dialect == "" then return nil, response_error("database.type") end
    local done_value: any = tostring(dialect) == sql.type.SQLITE and (more and 0 or 1) or not more
    local result, stamp_err = db:execute("UPDATE kickside_thread SET teardown_fence_cursor=$1,teardown_fence_done=$2"
        .. " WHERE id=$3 AND teardown_fence_cursor=$4 AND deleting_at IS NOT NULL",
        { last, done_value, id, cursor })
    local cursor_err = write_error(result, stamp_err, "thread fence cursor stamp failed", "cursor.write")
    if cursor_err then return nil, cursor_err end
    local proof, proof_err = db:query("SELECT teardown_fence_cursor,teardown_fence_done"
        .. " FROM kickside_thread WHERE id=$1", { id })
    local advance_err = rows_error(proof, proof_err, "thread fence cursor proof failed", "cursor.rows")
    if advance_err then return nil, advance_err end
    if next(proof) == nil then return true, nil end
    if type(proof[1]) ~= "table"
        or tostring(proof[1].teardown_fence_cursor) ~= last
        or (not more and proof[1].teardown_fence_done ~= true and proof[1].teardown_fence_done ~= 1) then
        return nil, response_error("cursor.advance")
    end
    if more then return nil, pending("thread consumer fences have another bounded page", true) end
    return true, nil
end

return M
