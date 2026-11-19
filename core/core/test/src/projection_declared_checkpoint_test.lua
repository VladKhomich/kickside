-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply = require("apply")
local funcs = require("funcs")
local security = require("security")
local claim = require("claim")
local clock = require("clock")
local fixture = require("fixture")
local invoke = require("invoke")
local json = require("json")
local projections = require("projections")
local provision = require("provision")
local sql = require("sql")
local test = require("test")
local time = require("time")
local uuid = require("uuid")

local WORKER = "proc://app:declared_checkpoint_worker"
local KIND = "test.declared.checkpoint"
local TRIGGER = "kickside.test.threads:trigger"
local CHANGED = "kickside.test.threads:changed"

local function in_db(run)
    local db = assert(sql.get("app:db"))
    local ok, value = pcall(run, db)
    assert(select(2, db:release()) == nil)
    if not ok then error(value) end
    return value
end

local function registration(db, component_id, projection_key, cursor_key)
    local rows = assert(db:query([[SELECT c.id,c.job_id,c.actor_id,c.execution_identity_json,c.generation,c.last_seq,
        c.status,c.last_error,c.projection_id,p.body,p.last_event_seq,p.actor_context FROM kickside_projection_cursor c
        JOIN kickside_projection p ON p.id=c.projection_id
        WHERE c.thread_id=$1 AND p.kind=$2 AND p.projection_key=$3 AND c.cursor_key=$4]],
        {component_id, KIND, projection_key, cursor_key}))
    return assert(rows[1])
end

local function lease(row)
    local token = uuid.v7()
    return in_db(function(db)
        local dialect = assert(db:type())
        local tx = assert(db:begin())
        local leased = assert(claim.lease_row(tx, dialect, row.job_id, token,
            clock.format(time.now():add("1m"), dialect), clock.now(dialect)))
        assert(select(2, tx:commit()) == nil)
        return {id = row.job_id, lease_token = token, execution_seq = tonumber(leased.execution_seq)}
    end)
end

local function execute(row)
    local result, err = invoke.run({job = lease(row), payload = {cursor_id = row.id}})
    assert(result, tostring(err))
    return result
end

return {run = test.run_cases(function()
    test.describe("private checkpoints on actor-bound component declarations", function()
        local created_component: string?

        -- Convergence revisits each remaining component and can restore its projections.
        test.after_each(function()
            if not created_component then return end
            local component_id = created_component
            in_db(function(db)
                assert(db:execute("DELETE FROM kickside_components WHERE component_id=$1", {component_id}))
                local threads = assert(db:query("SELECT id FROM kickside_thread WHERE component_id=$1", {component_id}))
                for _, thread in ipairs(threads) do
                    local registered = assert(db:query("SELECT id FROM kickside_projection WHERE thread_id=$1", {thread.id}))
                    for _, row in ipairs(registered) do
                        assert(projections.remove_projection(db, thread.id, {projection_id = row.id}))
                    end
                    assert(db:execute("DELETE FROM kickside_thread WHERE id=$1", {thread.id}))
                end
            end)
            created_component = nil
        end)

        test.it("transitions a settled paused predecessor and fences its stale fold", function()
            local f = fixture.new()
            local id = uuid.v7()
            created_component = id
            local impl = "app:declared_checkpoint_descriptor"
            assert(f.register_bare_component(f.owner, id, "app:declared_checkpoint_component", {}))
            local attached, attach_err = f.run_as(f.owner, "ensure_thread", {component_id = id, impl_id = impl})
            assert(attached, tostring(attach_err))
            local params = {kind = KIND, projection_key = "source", cursor_key = "source",
                worker_ref = "func://app:test_count_worker", worker_input_mode = "prefetch_events",
                events = {input = {{type = TRIGGER}}}, ensure = true}
            in_db(function(db)
                local row = registration(db, id, "source", "source")
                params.execution_identity_row = {actor_id = row.actor_id, actor_context = row.execution_identity_json}
                local body = type(row.body) == "table" and row.body or assert(json.decode(row.body))
                params.events = body.events
                assert(projections.register_projection(db, id, params))
                assert(db:execute([[CREATE TABLE IF NOT EXISTS declared_checkpoint_effect (
                    thread_id TEXT PRIMARY KEY, actor_id TEXT NOT NULL)]]))
            end)
            assert(f.run_as(f.owner, "append_event", {thread_id = id, event = {type = TRIGGER, body = {}}}))
            local actor = security.new_actor(f.owner, {security_groups = {}})
            local opener = assert(security.new_actor("system:lifecycle", {system = true, groups = {"system", "lifecycle"}}))
            local function converge()
                local continuation
                repeat
                    local summary, err = provision.converge(opener, f.test_scope(), continuation)
                    if err then return nil, err end
                    for _, skipped in ipairs(summary.skipped) do
                        if skipped.component_id == id then return nil, skipped.reason end
                    end
                    continuation = summary.continuation
                until not continuation
                return true
            end
            local active, active_err = converge()
            test.is_nil(active)
            assert(tostring(active_err):find("pause the projection cursor", 1, true), tostring(active_err))
            assert(f.run_as(f.owner, "pause_projection", {thread_id = id, kind = KIND,
                projection_key = "source", cursor_key = "source"}))
            local before = in_db(function(db) return registration(db, id, "source", "source") end)
            local retired_job = lease(before)
            local unsettled, unsettled_err = converge()
            test.is_nil(unsettled)
            assert(tostring(unsettled_err):find("existing Jobs slot to settle", 1, true), tostring(unsettled_err))
            assert(invoke.run({job = retired_job, payload = {cursor_id = before.id}}))

            local ensured, ensure_err = f.run_as(f.owner, "ensure_thread", {component_id = id, impl_id = impl})
            test.is_nil(ensured)
            assert(tostring(ensure_err):find("different stored declaration", 1, true), tostring(ensure_err))
            local direct, direct_err = funcs.new():with_actor(actor):with_scope(f.test_scope())
                :call("kickside.core.threads:converge_thread_method", {component_id = id, impl_id = impl})
            test.is_nil(direct)
            assert(tostring(direct_err):find("different stored declaration", 1, true), tostring(direct_err))
            local changed, changed_err = converge()
            assert(changed, tostring(changed_err))
            local after = in_db(function(db) return registration(db, id, "source", "source") end)
            for _, field in ipairs({"id", "job_id", "projection_id", "status", "actor_id",
                "actor_context", "execution_identity_json", "last_seq", "last_event_seq"}) do
                test.eq(after[field], before[field], field)
            end
            test.eq(tonumber(after.generation), assert(tonumber(before.generation)) + 1)
            local body = type(after.body) == "table" and after.body or assert(json.decode(after.body))
            test.eq(body.meta.worker_ref, WORKER)
            assert(converge())
            local same = in_db(function(db) return registration(db, id, "source", "source") end)
            test.eq(tonumber(same.generation), tonumber(after.generation))

            assert(f.run_as(f.owner, "resume_projection", {thread_id = id, kind = KIND,
                projection_key = "source", cursor_key = "source"}))
            before.thread_id = id
            before.body = type(before.body) == "table" and before.body or assert(json.decode(before.body))
            local stale, stale_err = apply.advance("app:db", lease(after), before, 1, {body = {stale = true}})
            assert(stale, tostring(stale_err))
            test.is_true(stale.stale)
            local after_stale = in_db(function(db) return registration(db, id, "source", "source") end)
            test.eq(tonumber(after_stale.last_seq), tonumber(after.last_seq))
            test.eq(after_stale.body, after.body)
            assert(execute(after_stale))
            in_db(function(db)
                local settled = registration(db, id, "source", "source")
                test.eq(settled.job_id, before.job_id)
                test.eq(tonumber(settled.last_seq), 1)
            end)
        end)

        for _, case in ipairs({
            {name = "runs the installed descriptor under its persisted actor", allowed = true},
            {name = "refuses an extra cursor", alternate = true, refusal = "installed projection declaration"},
            {name = "refuses different stored configuration", config = true, refusal = "installed projection declaration"},
            {name = "refuses a different stored actor", identity = true, refusal = "component's execution identity"},
            {name = "refuses an unrelated component implementation", owner = true, refusal = "installed projection declaration"},
            {name = "continues to enforce live actor authorization", revoked = true, refusal = "deferred principal is disabled"},
        }) do
            test.it(case.name, function()
                local f = fixture.new()
                if case.revoked then f.owner = "transition-" .. f.owner end
                local id = uuid.v7()
                created_component = id
                local impl = case.owner and "kickside.test.threads:thread_kind" or "app:declared_checkpoint_component"
                assert(f.register_bare_component(f.owner, id, impl, {}))
                local attached, attach_err = f.run_as(f.owner, "ensure_thread", {component_id = id,
                    impl_id = "app:declared_checkpoint_descriptor"})
                assert(attached, tostring(attach_err))
                local params = {thread_id = id, kind = KIND, projection_key = "source", cursor_key = "source",
                    worker_ref = WORKER, worker_input_mode = "prefetch_events", events = {input = {{type = TRIGGER}}}}
                local direct, direct_err = f.run_as(f.owner, "register_projection", params)
                test.is_nil(direct)
                test.is_true(errors.is(direct_err, errors.PERMISSION_DENIED), tostring(direct_err))
                local input, append_err = f.run_as(f.owner, "append_event", {thread_id = id,
                    event = {type = TRIGGER, body = {}}})
                assert(input, tostring(append_err))

                local before = in_db(function(db)
                    assert(db:execute([[CREATE TABLE IF NOT EXISTS declared_checkpoint_effect (
                        thread_id TEXT PRIMARY KEY, actor_id TEXT NOT NULL)]]))
                    local row = registration(db, id, "source", "source")
                    if case.alternate then
                        params.cursor_key = "alternate"
                        params.execution_identity_row = {actor_id = row.actor_id, actor_context = row.execution_identity_json}
                        assert(projections.register_projection(db, id, params))
                    elseif case.config then
                        local body_row = assert(db:query("SELECT body FROM kickside_projection WHERE id=$1",
                            {row.projection_id}))[1]
                        local body = type(body_row.body) == "table" and body_row.body or assert(json.decode(body_row.body))
                        body.worker_config = {arbitrary = true}
                        assert(db:execute("UPDATE kickside_projection SET body=$1 WHERE id=$2",
                            {assert(json.encode(body)), row.projection_id}))
                    elseif case.identity then
                        local identity = assert(json.decode(row.execution_identity_json))
                        identity.principal.id = f.stranger
                        assert(db:execute("UPDATE kickside_projection_cursor SET actor_id=$1,execution_identity_json=$2 WHERE id=$3",
                            {f.stranger, assert(json.encode(identity)), row.id}))
                    elseif case.revoked then
                        assert(db:execute([[INSERT INTO kickside_component_meta (meta_id,component_id,key,value)
                            VALUES ($1,$2,$3,$4)]], {uuid.v7(), id, "core_test.principal_state", "disabled"}))
                    end
                    return registration(db, id, "source", params.cursor_key)
                end)
                test.not_nil(before.actor_id)
                local result = execute(before)
                in_db(function(db)
                    local after = registration(db, id, "source", params.cursor_key)
                    local effects = assert(db:query("SELECT actor_id FROM declared_checkpoint_effect WHERE thread_id=$1", {id}))
                    local outputs = assert(db:query("SELECT body FROM kickside_event WHERE thread_id=$1 AND type=$2", {id, CHANGED}))
                    test.eq(after.id, before.id)
                    test.eq(after.job_id, before.job_id)
                    test.eq(tonumber(after.generation), tonumber(before.generation))
                    if case.allowed then
                        test.eq(tonumber(after.last_seq), 1)
                        test.eq(#effects, 1)
                        test.eq(effects[1].actor_id, f.owner)
                        test.eq(#outputs, 1)
                        local output = type(outputs[1].body) == "table" and outputs[1].body or assert(json.decode(outputs[1].body))
                        test.eq(output.actor_id, f.owner)
                    else
                        test.is_true(result.invalid, tostring(after.last_error))
                        test.contains(after.last_error, assert(case.refusal))
                        test.eq(tonumber(after.last_seq), 0)
                        test.eq(#effects, 0)
                        test.eq(#outputs, 0)
                    end
                end)
            end)
        end
    end)
end)}
