-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local funcs = require("funcs")
local security = require("security")
local ctx = require("ctx")
local component = require("component")
local repo = require("workflow_repo")
local workflow = require("workflow")
local version_publish = require("version_publish")
local writable = require("run_writable")
local maintenance = require("maintenance")
local admission = require("admission")
local identity = require("execution_identity")
local store = require("store")
local sql = require("sql")
local registry = require("registry")

local function execute(query: string, args: any): any
    local db = store.open_db()
    local rows, err = db:query(query, args)
    db:release()
    if err then error(tostring(err)) end
    return rows
end

-- Exercise the capabilities as well as querying policy decisions. The same
-- probe runs before publication to prove the harness actor starts without them.
local function storage_probe(): any
    local leaks: {string} = {}
    if security.can("db.get", "app:db") then leaks[#leaks + 1] = "db.get grant" end
    local db, db_err = sql.get("app:db")
    if db then db:release(); leaks[#leaks + 1] = "database acquired" end
    if not db_err then leaks[#leaks + 1] = "database not denied" end
    for _, id in ipairs({"kickside.workflows:db_config", "kickside.component:db_config", "kickside.core:db_config"}) do
        if security.can("registry.get", id) then leaks[#leaks + 1] = "registry grant: " .. id end
        local entry, read_err = registry.get(id)
        if entry or not read_err then leaks[#leaks + 1] = "registry acquired: " .. id end
    end
    test.eq(table.concat(leaks, "; "), "", "receiver inherited maintenance storage authority")
    return true
end

local function complete(envelope: any): (any?, any?)
    local context: any = { expected_actor = ctx.get("expected_actor"), expected_item = ctx.get("expected_item") }
    if security.actor():id() ~= context.expected_actor then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "callback used publisher authority" })
    end
    if envelope.token.item ~= context.expected_item or envelope.status ~= "failed" or envelope.input ~= nil then
        return nil, errors.new({ kind = errors.INVALID, message = "wrong completion envelope" })
    end
    if ctx.get("narrow") then
        storage_probe()
        return { acknowledged = true }, nil
    end
    -- This proves real contract dispatch reached the receiver, and that the
    -- terminal flag is still pending during receiver execution.
    local rows = execute("SELECT terminal_event_pending FROM workflow_runs WHERE run_id=$1", {envelope.run_id})
    test.is_true(rows[1].terminal_event_pending == true or rows[1].terminal_event_pending == 1)
    return { acknowledged = true }, nil
end

local function actor_run(args: any): any
    local service, service_err = component.get_service()
    if service_err or not service then error(tostring(service_err)) end
    local target, target_err = service:register({ impl_id = "app:completion_receiver",
        private_context = { expected_actor = security.actor():id(), expected_item = args.item, narrow = args.narrow } })
    test.is_nil(target_err)
    test.is_true(target.success, tostring(target.error))
    local created, create_err = repo.create("Completion live authority")
    test.is_nil(create_err)
    local flow = created.id
    local _, apply_err = workflow.apply(flow, {
        {type = "node.add", body = {id = "a", kind = "block", ref = "app:block.engine_linear"}},
        {type = "node.add", body = {id = "b", kind = "block", ref = "app:block.engine_linear"}},
        {type = "edge.add", body = {id = "ab", source_id = "a", target_id = "b"}},
    }, "completion-test")
    test.is_nil(apply_err)
    local _, publish_err = version_publish.publish(flow, "completion-test")
    test.is_nil(publish_err)
    local captured, capture_err = identity.capture()
    test.is_nil(capture_err)
    local cli: any = {}
    function cli:get_status() return "failed", nil end
    function cli:create_workflow(_commands: any, opts: any) return opts.dataflow_id, nil end
    function cli:start(id: string) return id, nil end
    function cli:execute() return {}, nil end
    function cli:output() return {}, nil end
    local run = writable.new({load_identity = function() return captured, nil end,
        client_new = function() return cli, nil end})
    local req: any = {config = {flow_ref = {kind = "flow", id = flow, version = 1},
        completion = {component_id = target.component_id, token_fields = {"item"}}},
        input = {item = args.item}, origin = "completion-live", sink_op = "create",
        automation_ref = {kind = "automation", id = "completion-live", revision = 1},
        identity_key = args.item, idempotency_key = args.item}
    if args.unsupported then req.config.completion.component_id = flow end
    if args.denied then
        execute("UPDATE kickside_component_access SET access_mask=1 WHERE component_id=$1 RETURNING component_id", {target.component_id})
    end
    local result = run.write(req)
    if args.denied or args.unsupported then
        test.is_false(result.success)
        test.eq(result.error.code, args.unsupported and "invalid_config" or "permission_denied")
        test.eq(#execute("SELECT run_id FROM workflow_runs WHERE trigger_id=$1 AND dedup_key=$2", {"completion-live", args.item}), 0)
        return true
    end
    test.is_true(result.success, tostring(result.error and result.error.message))
    local id = result.dest_ref.run_id
    local row = execute("SELECT * FROM workflow_runs WHERE run_id=$1", {id})[1]
    local _, merge_err = admission.merge(row, {status = "failed", error = "immediate failure"})
    test.is_nil(merge_err)
    if args.target_revoked then
        execute("UPDATE kickside_component_access SET access_mask=1 WHERE component_id=$1 RETURNING component_id", {target.component_id})
    end
    if args.revoked then
        execute("UPDATE app_users SET status='suspended' WHERE user_id=$1 RETURNING user_id", {captured.principal.id})
    end
    if args.narrow then
        local narrow_scope = security.new_scope({security.policy("app:completion_narrow_policy"),
            security.policy("app:completion_receiver_visibility")})
        local clean, clean_err = funcs.new():with_actor(security.actor()):with_scope(narrow_scope)
            :call("app:completion_storage_probe")
        test.is_nil(clean_err)
        test.eq(clean, true)
    end
    local first, first_err = maintenance.tick(1, id)
    test.is_nil(first_err)
    if args.revoked or args.target_revoked then
        test.eq(first.failures, 1, tostring(first.last_error))
        local pending = execute("SELECT terminal_event_pending FROM workflow_runs WHERE run_id=$1", {id})[1]
        test.is_true(pending.terminal_event_pending == true or pending.terminal_event_pending == 1)
        execute("UPDATE app_users SET status='active' WHERE user_id=$1 RETURNING user_id", {captured.principal.id})
        execute("UPDATE kickside_component_access SET access_mask=15 WHERE component_id=$1 RETURNING component_id", {target.component_id})
        execute("UPDATE workflow_runs SET terminal_event_check_at=$1 WHERE run_id=$2 RETURNING run_id", {admission.now(), id})
        local recovered, recover_err = maintenance.tick(1, id)
        test.is_nil(recover_err)
        test.eq(recovered.failures, 0, tostring(recovered.last_error))
    else test.eq(first.failures, 0, tostring(first.last_error)) end
    local final = execute("SELECT terminal_event_pending FROM workflow_runs WHERE run_id=$1", {id})[1]
    test.is_true(final.terminal_event_pending == false or final.terminal_event_pending == 0)
    return true
end

local cases = test.run_cases(function()
    test.describe("run completion live contract authority", function()
        for _, mode in ipairs({"allowed", "revoked", "target_revoked", "denied", "unsupported", "narrow"}) do
            test.it("dispatches typed completion under the stored principal with live authority: " .. mode, function()
                local actor_id = "completion-live-" .. uuid.v4()
                execute("INSERT INTO app_users (user_id,email,full_name,password_hash,status)"
                    .. " VALUES ($1,$2,$1,'x','active') RETURNING user_id", {actor_id, actor_id .. "@example.test"})
                execute("INSERT INTO app_user_groups (user_id,group_id,source,created_at)"
                    .. " VALUES ($1,$2,'manual',$3) RETURNING user_id",
                    {actor_id, mode == "narrow" and "app:completion_narrow_scope" or "app:completion_test_scope", admission.now()})
                local actor = security.new_actor(actor_id, {})
                local policy = security.policy("app:workflows_suite_policy")
                local scope = security.new_scope({policy})
                local result, err = funcs.new():with_actor(actor):with_scope(scope):call("app:run_completion_live_actor",
                    {item = uuid.v4(), narrow = mode == "narrow", revoked = mode == "revoked", target_revoked = mode == "target_revoked", denied = mode == "denied", unsupported = mode == "unsupported"})
                test.is_nil(err)
                test.eq(result, true)
            end)
        end
    end)
end)
return {storage_probe = storage_probe, run = cases, actor_run = actor_run, complete = complete,
    status = function(): any return {description = "Completion receiver"} end}
