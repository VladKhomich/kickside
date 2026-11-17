-- The Automation round writes one stable record to create one workflow run.
-- The request names the invoking automation (automation_ref); the written
-- record is the run's exact Start input. A run is acknowledged only after
-- the engine has accepted start or persisted a terminal status.
local flow_ref = require("flow_ref")
local version_read = require("version_read")
local workflow_repo = require("workflow_repo")
local schema_validate = require("schema_validate")
local writable_sink = require("writable_sink")
local compiler = require("compiler")
local client = require("client")
local admission = require("admission")
local engine_api = require("engine_api")
local uuid = require("uuid")
local json = require("json")
local canonical_json = require("canonical_json")
local run_identity = require("run_identity")
local execution_identity = require("execution_identity")
local exact_automation_ref = require("automation_ref")
local errors = require("errors")
local component = require("component")

local function construct(dependencies: any): any
local selected_version_read = dependencies.version_read or version_read
local selected_repo = dependencies.repo or workflow_repo
local selected_compiler = dependencies.compiler or compiler
local client_new = dependencies.client_new or client.new
local selected_admission = dependencies.admission or admission
local load_identity = dependencies.load_identity or run_identity.load
local selected_component = dependencies.component or component
local M = {}

local function fail(code: string, message: any, retriable: boolean, scope: string, retry_after_ms: number?): any
    local error_result: any = { code = code, message = tostring(message or code), retriable = retriable, scope = scope }
    if retry_after_ms then error_result.retry_after_ms = retry_after_ms end
    return { success = false, error = error_result, retry_after_ms = retry_after_ms }
end

-- Only explicitly named scalar Start fields cross the terminal event boundary.
local function validate_correlation_fields(fields: any): string?
    if fields == nil then return nil end
    if type(fields) ~= "table" or #fields < 1 or #fields > 16 then
        return "correlation_fields must select between 1 and 16 fields"
    end
    local seen: { [string]: boolean } = {}
    local count = 0
    for index, field in pairs(fields) do
        if type(index) ~= "number" or index < 1 or index > #fields or index ~= math.floor(index)
            or type(field) ~= "string" or #field < 1 or #field > 128 or seen[field] then
            return "correlation_fields must be a dense array of distinct field names of 1 to 128 bytes"
        end
        seen[field] = true
        count = count + 1
    end
    if count ~= #fields then return "correlation_fields must be a dense array" end
    return nil
end

local function select_correlation(fields: any, input: any): (any?, any?)
    if fields == nil then return nil, nil end
    local selected: any = {}
    for _, field in ipairs(fields) do
        local value = input[field]
        local kind = type(value)
        if kind ~= "string" and kind ~= "boolean" and kind ~= "number" then
            return nil, "correlation field " .. field .. " must be a present scalar value"
        end
        if kind == "number" and (value ~= value or value == math.huge or value == -math.huge) then
            return nil, "correlation field " .. field .. " must be finite"
        end
        if kind == "string" and #value > 4096 then return nil, "correlation exceeds 4096 bytes" end
        selected[field] = value
    end
    local encoded, err = json.encode(selected)
    if err or not encoded then return nil, err or "correlation encoding failed" end
    if #encoded > 4096 then return nil, "correlation exceeds 4096 bytes" end
    return selected, nil
end

local function exact(req: any): (any?, any?)
    local config = type(req) == "table" and req.config or nil
    if type(config) ~= "table" then return nil, "config is required" end
    local selection_err = validate_correlation_fields(config.correlation_fields)
    if selection_err then return nil, selection_err end
    if config.completion ~= nil then
        local completion = config.completion
        if type(completion) ~= "table" or type(completion.component_id) ~= "string"
            or not uuid.validate(completion.component_id) or completion.token_fields == nil then
            return nil, "completion requires a component UUID and token_fields"
        end
        for field in pairs(completion) do
            if field ~= "component_id" and field ~= "token_fields" then return nil, "unknown completion field" end
        end
        local token_err = validate_correlation_fields(completion.token_fields)
        if token_err then return nil, "completion token_fields: " .. token_err end
    end
    return flow_ref.validate(config.flow_ref)
end

local function receipt(row: any, existing: boolean): any
    return { success = true, result = existing and "noop" or "created", dest_ref = { run_id = row.run_id } }
end

local function pending(message: any): any
    return fail("provider_unavailable", message, true, "flow", 2000)
end

local function reservation_failure(err: any): any
    if errors.is(err, errors.CONFLICT) then
        local details = err:details()
        if type(details) == "table" and details.reason == "idempotency_conflict" then
            return fail("idempotency_conflict", err, false, "item")
        end
    end
    if errors.is(err, errors.INVALID) then
        local details = err:details()
        local code = type(details) == "table" and type(details.reason) == "string" and details.reason or "invalid_run"
        return fail(code, err, false, "item")
    end
    return pending(err or "run reservation unavailable")
end

local function identity_failure(err: any): any
    local kind = type(err) == "table" and (err :: any).kind or nil
    if type(err) == "table" and ((err :: any).retryable == true
        or kind == errors.UNAVAILABLE or kind == errors.TIMEOUT or kind == errors.INTERNAL) then
        return fail("identity_unavailable", err, true, "identity", 2000)
    end
    return fail("permission_denied", err, false, "identity")
end

function M.write(request: any): any
    local req = type(request) == "table" and request or {}
    local ref, ref_err = exact(req)
    if ref_err or not ref then return fail("invalid_config", ref_err, false, "flow") end
    if req.sink_op ~= "create" and req.sink_op ~= "upsert" then
        return fail("invalid_request", "workflow run only supports create", false, "item")
    end
    local input = req.input
    if type(input) ~= "table" then
        return fail("invalid_request", "workflow run input must be a record", false, "item")
    end
    local automation_ref, ref_err = exact_automation_ref.validate(req.automation_ref)
    if ref_err or not automation_ref then
        return fail("invalid_request", "the request's automation_ref must identify the invoking automation: " .. tostring(ref_err), false, "item")
    end
    local _, origin_failure = writable_sink.origin(req)
    if origin_failure then return origin_failure end
    local trigger_id = automation_ref.id
    if type(req.identity_key) ~= "string" or req.identity_key == ""
        or type(req.idempotency_key) ~= "string" or req.idempotency_key == "" then
        return fail("invalid_request", "identity_key and idempotency_key are required", false, "item")
    end
    local access_err = selected_repo.require_access(ref.id, selected_repo.ACCESS.READ)
    if access_err then return fail("permission_denied", access_err, false, "flow") end
    local version, version_err = selected_version_read.get(ref.id, ref.version)
    if version_err then return pending(version_err) end
    if not version then return fail("not_found", "published Flow version not found", false, "flow") end
    local valid_err = schema_validate.validate(version.input_schema, input, "input")
    if valid_err then return fail("invalid_request", valid_err, false, "item") end
    local admission_hash, hash_err = canonical_json.hash({ flow_ref = ref, op = req.sink_op, input = input,
        correlation_fields = req.config.correlation_fields, completion = req.config.completion })
    if hash_err or type(admission_hash) ~= "string" then
        if errors.is(hash_err, errors.INVALID) then
            return fail("invalid_request", hash_err, false, "item")
        end
        return pending(hash_err or "workflow run input hash unavailable")
    end
    local selected, identity_err = load_identity(trigger_id)
    if identity_err or not selected then
        return identity_failure(identity_err or "automation identity unavailable")
    end
    local identity_row, encode_err = execution_identity.to_row(selected)
    if encode_err or not identity_row then
        return fail("invalid_identity", encode_err or "automation identity invalid", false, "identity")
    end
    local completion: any = nil
    if req.config.completion ~= nil then
        local token, token_err = select_correlation(req.config.completion.token_fields, input)
        if token_err then return fail("invalid_request", token_err, false, "item") end
        local target, target_err = selected_component.open(req.config.completion.component_id,
            selected_component.ACCESS.WRITE, "kickside.workflows:run_completion")
        if target_err or not target then
            if errors.is(target_err, errors.PERMISSION_DENIED) then
                return fail("permission_denied", target_err, false, "item")
            end
            if errors.is(target_err, errors.INVALID) then return fail("invalid_config", target_err, false, "item") end
            return pending(target_err or "completion target unavailable")
        end
        completion = { component_id = req.config.completion.component_id, token = token }
    end
    local function creation_for(run_id: string, dataflow_id: string): (string?, any?)
        local correlation, correlation_err = select_correlation(req.config.correlation_fields, input)
        if correlation_err then return nil, correlation_err end
        local commands, _, remint_err = selected_compiler.remint(version.compiled_commands, uuid.v4, input, {
            run_id = run_id, dataflow_id = dataflow_id, version = ref.version,
            workflow_stack = { ref.id }, depth = 0,
        })
        if remint_err or not commands then return nil, remint_err or "workflow input could not be routed" end
        return json.encode({ version = ref.version, input = input, commands = commands, correlation = correlation,
            completion = completion,
            options = { dataflow_id = dataflow_id, type = "workflow",
                metadata = { run_id = run_id, origin = "automation", flow_ref = ref,
                    resume_handler = "kickside.workflows.runs:resume",
                    automation_ref = automation_ref },
                on_complete = "kickside.workflows.runs:run_completed" },
            start_options = {} })
    end
    local reservation, reserve_err = selected_admission.find(
        ref.id, trigger_id, req.idempotency_key, admission_hash)
    if reserve_err then return reservation_failure(reserve_err) end
    local candidate_id: any = nil
    local candidate_dataflow_id: any = nil
    local creation_json: string? = nil
    local creation_err: any = nil
    local reserve_args: any = { workflow_id = ref.id, version = ref.version,
        trigger_id = trigger_id, dedup_key = req.idempotency_key,
        admission_hash = admission_hash, automation_revision = automation_ref.revision,
        execution_identity_json = identity_row.actor_context }
    if not reservation then
        candidate_id, candidate_dataflow_id = uuid.v4(), uuid.v4()
        creation_json, creation_err = creation_for(candidate_id, candidate_dataflow_id)
        if creation_err or not creation_json then
            return fail("invalid_request", creation_err or "run creation payload unavailable", false, "item")
        end
        reserve_args.run_id, reserve_args.dataflow_id = candidate_id, candidate_dataflow_id
        reserve_args.creation_payload_json = creation_json
        reservation, reserve_err = selected_admission.reserve(reserve_args)
        if reserve_err or not reservation then return reservation_failure(reserve_err) end
    end
    if reservation.capacity then return fail("rate_limited", "workflow run capacity reached", true, "capacity", 2000) end
    local row = reservation.row
    local stored, decode_err = json.decode(tostring(row.execution_identity_json or ""))
    local valid, validate_err = execution_identity.validate(stored)
    if decode_err or not valid then
        return fail("invalid_identity", decode_err or validate_err or "run identity unavailable", false, "identity")
    end
    if not execution_identity.same_principal(stored.principal, selected.principal)
        or not execution_identity.same_principal(stored.authorized_by, selected.authorized_by)
        or stored.component_id ~= selected.component_id
        or stored.credential_id ~= selected.credential_id
        or stored.link_id ~= selected.link_id
        or stored.captured_at ~= selected.captured_at then
        return fail("permission_denied", "run identity differs from the invoking automation", false, "identity")
    end
    if row.admission_state == "admitted" then return receipt(row, true) end
    local cli, client_err = client_new()
    if client_err or not cli then return pending(client_err or "dataflow client unavailable") end
    local supported, support_err = engine_api.require_methods(cli)
    if support_err or not supported then
        return fail("unsupported_dataflow_client", support_err, false, "flow")
    end
    local payload, payload_err = selected_admission.creation_payload(row)
    if payload_err or not payload then return pending(payload_err or "run creation payload unavailable") end
    local current, engine_err = engine_api.run(cli, row, payload)
    if engine_err or not current then return pending(engine_err or "dataflow start pending") end
    local merged, merge_err = selected_admission.merge(row, current)
    if merge_err or not merged then return pending(merge_err or "admission commit pending") end
    if not merged.admitted then return pending("admission pending") end
    return receipt(row, reservation.existing == true)
end


M.new = construct
return M
end

return construct({})
