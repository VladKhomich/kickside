-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local security = require("security")
local funcs = require("funcs")
local json = require("json")
local repo = require("repo")
local workflow = require("workflow")
local publish = require("publish")
local automation = require("automation")
local component = require("component")
local store = require("store")
local admission = require("admission")
local delete_api = require("delete_api")
local worker = require("worker")
local users = require("users")
local reaper_consts = require("reaper_consts")

local function query(statement, args)
    local db = assert(store.open_db())
    local rows, err = db:query(statement, args)
    db:release()
    test.is_nil(err, tostring(err))
    return rows
end

local function execute(statement, args)
    local db = assert(store.open_db())
    local result, err = db:execute(statement, args)
    db:release()
    test.is_nil(err, tostring(err))
    return result
end

local function reserve(id)
    local rid, fid = uuid.v4(), uuid.v4()
    return admission.reserve({workflow_id=id, run_id=rid, dataflow_id=fid, version=1,
        trigger_kind="manual", execution_identity_json='{"version":2}',
        creation_payload_json=json.encode({version=1, input={}, commands={}, start_options={},
            options={dataflow_id=fid, metadata={run_id=rid}}})})
end

local function exercise(args)
    local created, create_err = repo.create("Delete admission")
    test.is_nil(create_err, tostring(create_err))
    local id = created.id
    local _, edit_err = workflow.apply(id, {
        {type="node.add", body={id="work", kind="block", ref="app:block.engine_linear"}},
    }, "deletion-test")
    test.is_nil(edit_err, tostring(edit_err))
    local published, publish_err = publish.publish(id, "deletion-test")
    test.is_nil(publish_err, tostring(publish_err)); test.is_true(published.ok)
    local installed, install_err = automation.install_type("kickside.automation.manual:task", {
        target={kind="workflow", flow_ref={kind="flow", id=id, version=1}, input={}},
    })
    test.is_nil(install_err, tostring(install_err))
    local run, reserve_err = reserve(id)
    test.is_nil(reserve_err, tostring(reserve_err))
    local rid = run.row.run_id
    if args.status ~= "pending" then
        execute("UPDATE workflow_runs SET status=$1,terminal_event_pending=$2 WHERE run_id=$3",
            {args.status, args.status == "completed", rid})
    end
    local before_run = query("SELECT * FROM workflow_runs WHERE run_id=$1", {rid})
    local before_automation = query("SELECT * FROM kickside_components WHERE component_id=$1", {installed.id})
    if args.route == "cascade" then
        local actor = assert(security.new_actor("system:lifecycle", {}))
        local scope = assert(security.new_scope({assert(security.policy("app:workflows_suite_policy"))}))
        local _, err = funcs.new():with_actor(actor):with_scope(scope):call("kickside.core.lifecycle:reaper", {
            thread_id=reaper_consts.thread_id(), events={{type=reaper_consts.EVENT.COMPONENT_DELETED,
                body={subject_id=security.actor():id()}}}, range={to_seq=1}, projection={body={}}})
        test.is_true(errors.is(err, errors.CONFLICT), tostring(err))
        test.eq(err:details().code, "workflow_runs_active")
    elseif args.route == "owner" then
        local ok, err = component.system_delete(id, "reparent_root")
        test.is_false(ok); test.is_true(errors.is(err, errors.CONFLICT), tostring(err))
        test.eq(err:details().code, "workflow_runs_active")
    else
        local captured = {}
        local api = delete_api.new({http={CONTENT={JSON="application/json"}, STATUS={OK=200,UNAUTHORIZED=401},
            request=function() return {param=function() return id end} end,
            response=function() return {set_content_type=function() end,
                set_status=function(_, status) captured.status=status end,
                write_json=function(_, body) captured.body=body end} end}})
        api.handler()
        test.eq(captured.status, 409)
        test.eq(captured.body.kind, errors.CONFLICT)
        test.eq(captured.body.details.code, "workflow_runs_active")
        test.is_false(captured.body.retryable)
    end
    local row = query("SELECT deleting_at,delete_intent FROM kickside_components WHERE component_id=$1", {id})[1]
    test.not_nil(row); test.is_nil(row.deleting_at); test.is_nil(row.delete_intent)
    test.eq(#query("SELECT id FROM kickside_job WHERE owner_kind='component' AND owner_id=$1", {id}), 0)
    test.eq(json.encode(query("SELECT * FROM workflow_runs WHERE run_id=$1", {rid})), json.encode(before_run))
    test.eq(json.encode(query("SELECT * FROM kickside_components WHERE component_id=$1", {installed.id})), json.encode(before_automation))
    test.eq(#query("SELECT workflow_id FROM workflow_def_state WHERE workflow_id=$1", {id}), 1)
    -- Terminal state alone is insufficient; publication acknowledgement admits deletion.
    execute("UPDATE workflow_runs SET status='completed',terminal_event_pending=TRUE WHERE run_id=$1", {rid})
    local ok, pending_err = repo.delete(id)
    test.is_false(ok); test.eq(pending_err:details().code, "workflow_runs_active")
    execute("UPDATE workflow_runs SET terminal_event_pending=FALSE WHERE run_id=$1", {rid})
    local accepted, err = repo.delete(id)
    test.is_nil(err, tostring(err)); test.is_true(accepted)
    local finished, finish_err = worker.run(id)
    test.is_nil(finish_err, tostring(finish_err)); test.is_true(finished.deleted)
    test.eq(#query("SELECT component_id FROM kickside_components WHERE component_id=$1", {id}), 0)
    test.eq(#query("SELECT run_id FROM workflow_runs WHERE run_id=$1", {rid}), 0)
end

return {exercise=exercise, run=test.run_cases(function()
    test.describe("Workflow deletion admission", function()
        for _, args in ipairs({{route="http",status="pending"}, {route="http",status="running"},
            {route="http",status="completed"}, {route="owner",status="running"}, {route="cascade",status="running"}}) do
            test.it(args.route .. "/" .. tostring(args.status), function()
                local owner = "delete-admission-" .. uuid.v4()
                local _, user_err = users.create_passwordless({user_id=owner, email=owner .. "@test.local", full_name=owner, status="active"})
                test.is_nil(user_err, tostring(user_err))
                local actor = assert(security.new_actor(owner, {}))
                local scope = assert(security.new_scope({assert(security.policy("app:workflows_suite_policy"))}))
                local _, err = funcs.new():with_actor(actor):with_scope(scope):call("app:delete_admission_exercise", args)
                test.is_nil(err, tostring(err))
            end)
        end
    end)
end)}
