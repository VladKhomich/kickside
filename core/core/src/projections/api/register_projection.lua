-- POST /threads/{id}/projections — define (or re-define) a projection on a
-- thread and its catch-up cursor. The body is validated and the worker_ref is
-- checked against the registry before the row is written. The projection runs
-- under the authenticated caller: its execution identity is captured
-- server-side (principal and authorizer the caller) and rooted in the thread's
-- component, so every deferred run rechecks the caller's live root ADMIN.
-- Installing an identity-bearing execution needs ADMIN on the thread; a body
-- naming an identity is refused. Component lifecycle threads use system identity
-- after the lifecycle ADMIN or maintenance gate.

local http = require("http")
local json = require("json")
local sql = require("sql")

local core_db = require("core_db")
local worker = require("worker")
local writer = require("writer")
local thread_access = require("thread_access")
local execution_identity = require("execution_identity")

local release_error = thread_access.release_error
local error_response = thread_access.error_response
local error_envelope = require("error_envelope")

local M = {}

-- register(thread_id, data) -> (http status, response body) for one decoded
-- request body under the caller's frame.
function M.register(thread_id: string, data: any): (integer, { [string]: any })
    if type(thread_id) ~= "string" or thread_id == "" then return math.floor(http.STATUS.BAD_REQUEST), {success = false, error = "thread id is required"} end
    if type(data) ~= "table" then return math.floor(http.STATUS.BAD_REQUEST), {success = false, error = "request body is required"} end
    for _, field in ipairs({ "execution_identity", "execution_identity_row", "system_identity", "registered_checkpoint_principal" }) do
        if data[field] ~= nil then
            local refused = errors.new({ message = field .. " is server-derived and cannot be supplied",
                kind = errors.INVALID, retryable = false, details = { error_kind = "declaration" } })
            local status, payload = error_response(refused, tostring(refused))
            return status, payload
        end
    end

    -- Resolve + validate the worker_ref before touching the db so a bad ref
    -- fails fast with a 400.
    local binding, parse_err = worker.parse(data.worker_ref :: string?, true)
    if not parse_err then binding, parse_err = error_envelope.binding(binding, nil, nil, "parse projection worker", "core_http_operation_response") end
    if parse_err then
        local status, payload = error_response(parse_err, tostring(parse_err))
        return status, payload
    end
    local validated, validate_err = worker.validate(binding)
    if not validate_err then validated, validate_err = error_envelope.binding(validated, nil, nil, "validate projection worker", "core_http_operation_response") end
    if validate_err then
        local status, payload = error_response(validate_err, tostring(validate_err))
        return status, payload
    end

    local db, db_err = sql.get(core_db.id())
    if not db_err then db, db_err = error_envelope.binding(db, nil, "release", "open projection database", "core_http_operation_response") end
    if db_err then
        local status, payload = error_response(db_err, "db unavailable: " .. tostring(db_err))
        return status, payload
    end

    local source, gate_err = thread_access.gate_projection_registration(db, thread_id)
    if not gate_err then source, gate_err = error_envelope.binding(source, nil, nil, "authorize projection registration", "core_http_operation_response") end
    if gate_err then
        local status, payload = thread_access.failure_response(db, gate_err, tostring(gate_err))
        return status, payload
    end
    local lifecycle_thread = source.lifecycle == true
    local identity
    local registered_checkpoint
    if not lifecycle_thread then
        if validated.registered_checkpoint then
            local checkpoint_err
            registered_checkpoint, checkpoint_err = worker.registers_checkpoint_principal(validated,
                data.worker_config, data.worker_input_mode, data.events)
            if checkpoint_err then
                local status, payload = thread_access.failure_response(db, checkpoint_err, tostring(checkpoint_err))
                return status, payload
            end
        end
        local capture_err
        identity, capture_err = execution_identity.capture({ component_id = source.binding.component_id })
        if not capture_err then identity, capture_err = error_envelope.binding(identity, nil, nil, "capture projection identity", "core_http_operation_response") end
        if capture_err then
            local err = release_error(db, capture_err) :: error
            local status, payload = error_response(err, err == capture_err and tostring(capture_err) or nil)
            return status, payload
        end
    end

    local result, register_err = writer.register_projection(db, thread_id, {
        kind = data.kind,
        projection_key = data.projection_key,
        cursor_key = data.cursor_key,
        start_seq = data.start_seq,
        reset = data.reset,
        worker_ref = validated.worker_ref,
        worker_input_mode = data.worker_input_mode,
        execution_identity = identity,
        registered_checkpoint_principal = registered_checkpoint == true,
        system_identity = lifecycle_thread,
        worker_config = data.worker_config,
        events = data.events,
        debounce_idle_ms = data.debounce_idle_ms,
        debounce_max_ms = data.debounce_max_ms,
    }, nil, nil, not lifecycle_thread and source or nil)
    if not register_err then result, register_err = error_envelope.binding(result, nil, nil, "register projection", "core_http_operation_response") end
    local err = release_error(db, register_err, register_err == nil)
    if err then
        local status, payload = error_response(err, err == register_err and tostring(register_err) or nil)
        return status, payload
    end
    return math.floor(http.STATUS.CREATED), {
        success = true,
        projection_id = result.projection_id,
        cursor_id = result.cursor_id,
        kind = result.kind,
        projection_key = result.projection_key,
        cursor_key = result.cursor_key,
        worker_ref = result.worker_ref,
        worker_input_mode = result.worker_input_mode,
        generation = result.generation,
        created = result.created,
    }
end

function M.handler(): ()
    local req = http.request()
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)
    local raw = req:body()
    local data: any = nil
    if type(raw) == "string" and raw ~= "" then
        local decoded, decode_err = json.decode(raw)
        if decode_err or type(decoded) ~= "table" then
            res:set_status(http.STATUS.BAD_REQUEST)
            res:write_json({ success = false, error = "invalid JSON" })
            return
        end
        data = decoded
    end
    local status, body = M.register(tostring(req:param("id") or ""), data)
    res:set_status(status)
    res:write_json(body)
end

return M
