local decision_content = require("decision_content")
local files = require("inbox_files")
local expr = require("expr")
local security = require("security")
local contract = require("contract")
local inbox_writer = require("inbox_writer")
local inbox_reader = require("inbox_reader")

local M = {}

type Map = { [string]: any }

local DIRECTORY = "kickside.contract:directory"
local ITEM_TYPE = "flow_decision"

local function str(value: any): string
    return type(value) == "string" and value or ""
end

local function actor_id(): string
    local actor = security.actor()
    return actor and str(actor:id()) or ""
end

local function copy_map(value: any): Map
    local out: Map = {}
    if type(value) == "table" then for key, item in pairs(value :: Map) do out[key] = item end end
    return out
end

local function resolved_form(form: any, input: any): (any?, string?)
    if type(form) ~= "table" then return nil, nil end
    local resolved = form
    if type(form.properties) ~= "table" then return resolved, nil end
    for key, property in pairs(form.properties :: Map) do
        if type(property) == "table" and property.default_expr ~= nil then
            local path = "form.properties." .. tostring(key) .. ".default_expr"
            if type(property.default_expr) ~= "string" or property.default_expr == "" then
                return nil, path .. " must be a non-empty expression"
            end
            local value, err = expr.eval(property.default_expr, { input = input })
            if err then return nil, path .. ": " .. tostring(err) end
            local expected = property.type
            local valid = value ~= nil and (type(value) == expected
                or (expected == "integer" and type(value) == "number" and value % 1 == 0))
            if type(property.enum) == "table" then
                local member = false
                for _, option in ipairs(property.enum) do if option == value then member = true end end
                valid = valid and member
            end
            if not valid then return nil, path .. " must return a value matching the field type and enum" end
            if resolved == form then
                resolved = copy_map(form)
                resolved.properties = copy_map(form.properties)
            end
            local field = copy_map(property)
            field.default = value
            resolved.properties[key] = field
        end
    end
    return resolved, nil
end

local function decision_params(args: Map, owner: string): (Map?, string?)
    local config = type(args.config) == "table" and (args.config :: Map) or {}
    local emit = config
    local dataflow_id, signal_id = str(args.dataflow_id), str(args.signal_id)
    if dataflow_id == "" then return nil, "dataflow_id is required" end
    if signal_id == "" then return nil, "signal_id is required" end
    if owner == "" then return nil, "an authenticated workflow actor or explicit assignee is required" end

    local run_context = type(args.run_context) == "table" and (args.run_context :: Map) or {}
    -- A Workflow writes its identity into run_context.flow_ref, the versioned
    -- reference the compiler stamps on every node, so that is where the arm
    -- reads it from when the caller passed none of its own.
    local flow_ref = type(run_context.flow_ref) == "table" and (run_context.flow_ref :: Map) or {}
    local context_workflow_id = str(run_context.workflow_id) ~= "" and str(run_context.workflow_id)
        or str(flow_ref.id)
    local workflow_id = str(args.workflow_id) ~= "" and str(args.workflow_id)
        or (str(config.workflow_id) ~= "" and str(config.workflow_id) or context_workflow_id)
    local run_id = str(args.run_id) ~= "" and str(args.run_id)
        or (str(config.run_id) ~= "" and str(config.run_id) or str(run_context.run_id))
    local metadata = copy_map(emit.metadata)
    metadata.workflow_id = workflow_id
    metadata.run_id = run_id
    metadata.dataflow_id = dataflow_id
    metadata.signal_id = signal_id
    metadata.prompt = emit.prompt
    local form, form_err = resolved_form(emit.form, args.input)
    if form_err then return nil, form_err end
    metadata.form = form
    metadata.approve_label = emit.approve_label
    metadata.reject_label = emit.reject_label
    metadata.assignee = owner
    metadata.input = args.input
    metadata.context = args.context

    local content, content_err = decision_content.render(args.input, args.context)
    if content_err then return nil, content_err end
    local prompt = str(emit.prompt)
    local title = prompt ~= "" and prompt or "Workflow decision"
    if config.title_expr ~= nil then
        if type(config.title_expr) ~= "string" or config.title_expr == "" then
            return nil, "title_expr must be a non-empty expression"
        end
        local value, title_err = expr.eval(config.title_expr, { input = args.input })
        if title_err then return nil, "title_expr: " .. tostring(title_err) end
        if type(value) ~= "string" or not value:find("%S") then
            return nil, "title_expr must return a non-empty string"
        end
        title = value
    end
    local file_refs, files_err = files.normalize(emit.files)
    if files_err then return nil, tostring(files_err) end
    local item_id = "workflow-decision:" .. dataflow_id .. ":" .. signal_id
    return {
        id = item_id,
        item_type = ITEM_TYPE,
        title = title,
        content = content,
        files = file_refs,
        priority = str(emit.priority) ~= "" and str(emit.priority) or "normal",
        metadata = metadata,
        source_id = item_id,
        trace_context = {
            trace_id = "workflow:" .. (run_id ~= "" and run_id or dataflow_id),
            run_id = run_id ~= "" and run_id or dataflow_id,
            correlation_key = signal_id,
        },
    }, nil
end

local function directory_instance(): (any?, string?)
    local actor, scope = security.actor(), security.scope()
    if not actor or not scope then return nil, "Inbox review requires an authenticated Flow runner and scope" end
    local definition, get_err = contract.get(DIRECTORY)
    if get_err or not definition then return nil, "principal directory unavailable: " .. tostring(get_err) end
    local instance, open_err = definition:with_actor(actor):with_scope(scope):open()
    if open_err or not instance then return nil, "principal directory unavailable: " .. tostring(open_err) end
    return instance, nil
end

local function require_runner(owner: string): string?
    local directory, directory_err = directory_instance()
    if not directory then return directory_err end
    local result, exists_err = directory:exists({ type = "user", id = owner })
    if exists_err then return "could not validate the Flow runner: " .. tostring(exists_err) end
    if type(result) ~= "table" or (result :: Map).exists ~= true then
        return "Inbox review requires a Flow runner with an account"
    end
    return nil
end

function M.preview_decision(args: any): (Map?, string?)
    local input = type(args) == "table" and (args :: Map) or {}
    local config = type(input.config) == "table" and (input.config :: Map) or {}
    local assignee = str(config.assignee)
    return decision_params(input, assignee ~= "" and assignee or actor_id())
end

function M.create_decision(args: any): (any?, string?)
    local params = type(args) == "table" and type((args :: Map).params) == "table" and ((args :: Map).params :: Map) or nil
    if not params then return nil, "params is required" end
    local id = str((params :: Map).id)
    if id == "" then return nil, "params.id is required" end
    local existing, read_err = inbox_reader.get(id)
    if read_err then return nil, "could not inspect existing decision: " .. tostring(read_err) end
    if type(existing) == "table" then
        -- Pending and resolved items are both authoritative history. A revived Await
        -- re-arms the same stable correlation and must never append/reopen it.
        return existing, nil
    end
    return inbox_writer.create(params)
end

function M.arm_decision(args: any): (any?, string?)
    local a = type(args) == "table" and (args :: Map) or {}
    local owner = actor_id()
    if owner == "" then return nil, "Inbox review requires an authenticated Flow runner" end
    local config = type(a.config) == "table" and (a.config :: Map) or {}
    local saved_assignee = config.assignee
    if saved_assignee ~= nil and saved_assignee ~= "" and saved_assignee ~= owner then
        return nil, "Inbox reviews go to the Flow runner. Open the review step and choose Use Flow runner to remove the saved assignee."
    end
    local params, params_err = decision_params(a, owner)
    if not params then return nil, params_err end
    local runner_err = require_runner(owner)
    if runner_err then return nil, runner_err end
    return M.create_decision({ params = params })
end

return M
