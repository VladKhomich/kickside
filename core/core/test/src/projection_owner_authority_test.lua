local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local security = require("security")
local contract = require("contract")
local lifecycle = require("lifecycle")
local invoke = require("invoke")
local claim = require("claim")
local apply = require("apply")
local fixture = require("fixture")
local callback_invoke = require("callback_invoke")
local callback_fixture = require("callback_fixture")
local component_lifecycle = require("component_lifecycle")
local writer = require("writer")

local function service(actor_id: string)
    return assert(contract.get("kickside.component:component_service"))
        :with_actor(assert(security.new_actor(actor_id, {security_groups = {}})))
        :with_scope(assert(security.named_scope("wippy.security:process"))):open()
end
local function create(impl_id: string?)
    local id = uuid.v4()
    local svc = service("system:lifecycle")
    local result, err = svc:register({component_id = id, impl_id = impl_id or "app:provision_owner_seeded_system_decl"})
    test.is_nil(err); test.is_true(result.success, tostring(result.error))
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query([[SELECT c.id,c.job_id FROM kickside_projection_cursor c
        JOIN kickside_projection p ON p.id=c.projection_id WHERE p.thread_id=$1 AND p.kind='test.owner_seed']], {lifecycle.thread_id(id)}))
    assert(db:execute("INSERT INTO kickside_component_meta (meta_id,component_id,key,value) VALUES ($1,$2,'owner_test.invoked','0')", {uuid.v4(), id}))
    local cursor = rows[1]
    local jobs = assert(claim.claim_batch(db, tostring(db:type()), 16, nil, nil))
    local job: table? = nil
    for _, value in ipairs(jobs) do if value.id == cursor.job_id then job = value end end
    test.not_nil(job)
    db:release()
    return id, cursor, job
end
return {run = test.run_cases(function()
    test.describe("projection component owner authority", function()
        for _, attack in ipairs({"missing-owner", "changed-owner", "revoked-access", "legacy-binding"}) do
            test.it("parks " .. attack .. " without invoking the worker", function()
                local id, cursor, job = create()
                local db = assert(sql.get("app:db"))
                if attack == "missing-owner" then
                    assert(db:execute("DELETE FROM kickside_component_meta WHERE component_id=$1 AND key='owner'", {id}))
                elseif attack == "changed-owner" then
                    assert(db:execute("UPDATE kickside_component_meta SET value='system:kickside.jobs' WHERE component_id=$1 AND key='owner'", {id}))
                elseif attack == "revoked-access" then
                    assert(db:execute("DELETE FROM kickside_component_access WHERE component_id=$1", {id}))
                else
                    assert(db:execute("UPDATE kickside_projection SET actor_id=NULL,actor_context=NULL WHERE thread_id=$1", {lifecycle.thread_id(id)}))
                    assert(db:execute("UPDATE kickside_projection_cursor SET actor_id=NULL,execution_identity_json=NULL WHERE id=$1", {cursor.id}))
                end
                db:release()
                local result, err = invoke.run({job = job, payload = {cursor_id = cursor.id}})
                test.is_nil(err); test.is_true(result.invalid)
                db = assert(sql.get("app:db"))
                local row = assert(db:query("SELECT status,last_seq,last_error FROM kickside_projection_cursor WHERE id=$1", {cursor.id}))[1]
                local context = assert(db:query("SELECT private_context FROM kickside_components WHERE component_id=$1", {id}))[1]
                local invoked = assert(db:query("SELECT value FROM kickside_component_meta WHERE component_id=$1 AND key='owner_test.invoked'", {id}))[1]
                db:release()
                test.eq(invoked.value, "0", "owner admission precedes worker entry")
                test.eq(row.status, "invalid"); test.eq(tonumber(row.last_seq), 0)
                test.not_nil(row.last_error); test.is_nil(require("json").decode(context.private_context).seeded)
            end)
        end
        test.it("repairs every legacy cursor identity and rearms a parked owner failure", function()
            local id, cursor, job = create()
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_projection SET actor_id=NULL,actor_context=NULL WHERE thread_id=$1", {lifecycle.thread_id(id)}))
            assert(db:execute("UPDATE kickside_projection_cursor SET actor_id=NULL,execution_identity_json=NULL WHERE id=$1", {cursor.id}))
            db:release()
            local failed, failure_err = invoke.run({job = job, payload = {cursor_id = cursor.id}})
            test.is_nil(failure_err); test.is_true(failed.invalid)
            db = assert(sql.get("app:db"))
            local secondary = assert(writer.register_projection(db, lifecycle.thread_id(id), {
                kind = "test.owner_seed", worker_ref = "func://app:test_lifecycle_seed_worker",
                worker_input_mode = "prefetch_events", cursor_key = "secondary", ensure = true, system_identity = true,
                events = {input = {{type = lifecycle.EVENT.CREATED}}},
            }))
            assert(db:execute("UPDATE kickside_projection_cursor SET status='paused' WHERE id=$1", {secondary.cursor_id}))
            local before = assert(db:query("SELECT id,generation,last_seq,status FROM kickside_projection_cursor WHERE thread_id=$1 ORDER BY id", {lifecycle.thread_id(id)}))
            local tx = assert(db:begin())
            local _, converge_err = component_lifecycle.converge_own(tx, tostring(db:type()), id, "app:provision_owner_seeded_system_decl")
            if converge_err then assert(tx:rollback()) else assert(tx:commit()) end
            test.is_nil(converge_err)
            local after = assert(db:query("SELECT id,actor_id,execution_identity_json,generation,last_seq,status FROM kickside_projection_cursor WHERE thread_id=$1 ORDER BY id", {lifecycle.thread_id(id)}))
            db:release()
            test.eq(#after, 2)
            for index, value in ipairs(after) do
                test.eq(value.actor_id, "system:lifecycle"); test.is_nil(value.execution_identity_json)
                test.eq(tonumber(value.generation), tonumber(before[index].generation) + 1)
                test.eq(value.last_seq, before[index].last_seq)
                test.eq(value.status, value.id == secondary.cursor_id and "paused" or "active")
            end
        end)
        test.it("denies a returned cross-component write atomically under the maintenance owner", function()
            local id, cursor, job = create()
            local f = fixture.new()
            local target = uuid.v4()
            test.is_nil(select(2, f.as_owner("create", {id = target, impl_id = "kickside.test.threads:thread_kind"})))
            local db = assert(sql.get("app:db"))
            local snapshot, snapshot_err = invoke.snapshot(db, cursor.id, job.id)
            test.is_nil(snapshot_err); db:release()
            local result, err = apply.advance("app:db", job, snapshot, 1, {
                body = {forbidden_fold = true},
                append_events = {{thread_id = target, events = {{type = "kickside.test.threads:changed", body = {}}}}},
            })
            test.is_nil(result); test.is_true(errors.is(err, errors.PERMISSION_DENIED), tostring(err))
            db = assert(sql.get("app:db"))
            local after = assert(db:query("SELECT last_seq FROM kickside_projection_cursor WHERE id=$1", {cursor.id}))[1]
            db:release()
            test.eq(tonumber(after.last_seq), 0); test.eq(f.event_type_count(target, "kickside.test.threads:changed"), 0)
        end)
        for _, mode in ipairs({"generation", "revoke"}) do
            test.it("revalidates the owner before a post-commit callback/" .. mode, function()
                local id, cursor, job = create("app:projection_owner_callback_kind")
                local db = assert(sql.get("app:db"))
                assert(db:execute("INSERT INTO kickside_component_meta (meta_id,component_id,key,value) VALUES ($1,$2,'owner_test.callback','0')", {uuid.v4(), id}))
                db:release()
                callback_fixture.mode = mode
                local result, err = callback_invoke.run({job = job, payload = {cursor_id = cursor.id}})
                test.is_nil(err)
                test.is_true(mode == "generation" and result.stale or mode == "revoke" and result.invalid)
                db = assert(sql.get("app:db"))
                local callback = assert(db:query("SELECT value FROM kickside_component_meta WHERE component_id=$1 AND key='owner_test.callback'", {id}))[1]
                local after = assert(db:query("SELECT last_seq,status,last_error FROM kickside_projection_cursor WHERE id=$1", {cursor.id}))[1]
                db:release()
                test.eq(callback.value, "0"); test.eq(tonumber(after.last_seq), 1)
                if mode == "revoke" then test.eq(after.status, "invalid"); test.not_nil(after.last_error) end
            end)
        end
        test.it("fences ownership changes away and back without changing cursor generation", function()
            local id, cursor, job = create()
            local db = assert(sql.get("app:db"))
            local snapshot, snapshot_err = invoke.snapshot(db, cursor.id, job.id)
            test.is_nil(snapshot_err)
            assert(db:execute("UPDATE kickside_components SET identity_generation=identity_generation+2 WHERE component_id=$1", {id}))
            db:release()
            local result, err = apply.advance("app:db", job, snapshot, 1, {body = {stale_fold = true}})
            test.is_nil(err); test.is_true(result.stale)
            db = assert(sql.get("app:db"))
            local after = assert(db:query("SELECT last_seq FROM kickside_projection_cursor WHERE id=$1", {cursor.id}))[1]
            db:release()
            test.eq(tonumber(after.last_seq), 0)
        end)
    end)
end)}
