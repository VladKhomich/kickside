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
local threads_writer = require("threads")
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
        c.status,c.last_error,c.pending_transition,c.continuation,c.projection_id,p.body,p.last_event_seq,p.reset_generation,p.actor_context FROM kickside_projection_cursor c
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

        test.it("drains a populated predecessor and publishes only newly selected inputs after cutover", function()
            local f = fixture.new()
            local id = uuid.v7()
            created_component = id
            assert(f.register_bare_component(f.owner, id, "app:declared_checkpoint_component", {}))
            assert(f.run_as(f.owner, "ensure_thread", {component_id = id, impl_id = "app:declared_checkpoint_descriptor"}))
            local function current()
                return in_db(function(db) return registration(db, id, "ranged", "ranged") end)
            end
            local function decoded(row)
                return type(row.body) == "table" and row.body or assert(json.decode(row.body))
            end
            local function control(method)
                return assert(f.run_as(f.owner, method, {thread_id = id, cursor_id = current().id}))
            end
            local function append(types)
                local events = {}
                for _, kind in ipairs(types) do events[#events + 1] = {type = kind, role = "system", body_json = "{}"} end
                in_db(function(db) assert(threads_writer.append_system(db, id, events)) end)
            end
            local function install(ref, reset)
                in_db(function(db)
                    local row = registration(db, id, "ranged", "ranged")
                    assert(projections.register_projection(db, id, {kind = KIND, projection_key = "ranged",
                        cursor_key = "ranged", worker_ref = ref, worker_input_mode = "prefetch_events",
                        events = decoded(row).events, start_seq = row.last_seq, reset = reset,
                        execution_identity_row = {actor_id = row.actor_id, actor_context = row.execution_identity_json}}))
                end)
            end
            local opener = assert(security.new_actor("system:lifecycle", {system = true, groups = {"system", "lifecycle"}}))
            local function converge()
                local continuation
                repeat
                    local summary = assert(provision.converge(opener, f.test_scope(), continuation))
                    for _, skipped in ipairs(summary.skipped) do
                        if skipped.component_id == id then return skipped.reason end
                    end
                    continuation = summary.continuation
                until not continuation
            end
            install("func://app:test_count_worker")
            append({TRIGGER, TRIGGER})
            control("pause_projection")
            test.is_nil(converge())
            local old = current()
            test.eq(old.status, "paused")
            test.eq(assert(json.decode(old.pending_transition))[1], "app:declared_checkpoint_descriptor")
            test.eq(decoded(old).meta.worker_ref, "func://app:test_count_worker")
            control("resume_projection")
            test.is_nil(converge())
            test.eq(current().status, "active")
            test.eq(current().last_seq, 0)
            execute(current())
            local installed = current()
            test.is_nil(installed.pending_transition)
            test.eq(installed.status, "active")
            test.eq(decoded(installed).meta.worker_ref, "proc://app:range_checkpoint_worker")
            test.eq(installed.id, old.id)
            test.eq(installed.job_id, old.job_id)
            test.eq(installed.last_seq, 2)
            test.eq(installed.reset_generation, old.reset_generation)
            test.eq(decoded(installed).stats.count, 2)
            append({CHANGED, TRIGGER, CHANGED, TRIGGER, CHANGED})
            execute(current())
            local published = current()
            test.eq(published.last_seq, 7)
            test.eq(decoded(published).stats.count, 2)
            test.eq(decoded(published).offered, 2)
            test.eq(decoded(published).publications, 1)
            test.eq(decoded(published).reset_generation, 1)
            control("pause_projection")
            control("resume_projection")
            test.eq(current().reset_generation, published.reset_generation)
            install("proc://app:range_checkpoint_worker", true)
            local reset = current()
            test.eq(reset.id, old.id)
            test.eq(reset.last_seq, published.last_seq)
            test.eq(reset.reset_generation, published.reset_generation + 1)
            test.is_nil(decoded(reset).publications)
            append({CHANGED})
            execute(current())
            test.eq(current().last_seq, 8)
            test.is_nil(decoded(current()).publications)
            append({TRIGGER})
            execute(current())
            test.eq(decoded(current()).reset_generation, 2)
            assert(f.run_as(f.owner, "remove_projection", {thread_id = id, projection_id = reset.projection_id}))
            assert(f.run_as(f.owner, "ensure_thread", {component_id = id, impl_id = "app:declared_checkpoint_descriptor"}))
            local successor = current()
            test.is_true(successor.id ~= reset.id)
            test.is_true(successor.projection_id ~= reset.projection_id)
            test.eq(successor.reset_generation, 1)
        end)

        for _, later in ipairs({0, 32}) do
            test.it("hands off a running predecessor with " .. later .. " later events", function()
                local f = fixture.new()
                local id = uuid.v7()
                created_component = id
                local impl = "app:declared_checkpoint_descriptor"
                assert(f.register_bare_component(f.owner, id, "app:declared_checkpoint_component", {}))
                assert(f.run_as(f.owner, "ensure_thread", {component_id = id, impl_id = impl}))
                local function current()
                    return in_db(function(db) return registration(db, id, "ranged", "ranged") end)
                end
                local original = current()
                local body = type(original.body) == "table" and original.body or assert(json.decode(original.body))
                in_db(function(db)
                    assert(projections.register_projection(db, id, {kind = KIND, projection_key = "ranged", cursor_key = "ranged",
                        worker_ref = "func://app:test_count_worker", worker_input_mode = "prefetch_events",
                        events = body.events, execution_identity_row = {actor_id = original.actor_id, actor_context = original.execution_identity_json}}))
                    assert(threads_writer.append_system(db, id, {{type = TRIGGER, role = "system", body_json = "{}"}}))
                end)
                local old = current()
                old.thread_id = id
                old.body = type(old.body) == "table" and old.body or assert(json.decode(old.body))
                local job = lease(old)
                local opener = assert(security.new_actor("system:lifecycle", {system = true, groups = {"system", "lifecycle"}}))
                local continuation
                repeat
                    local summary = assert(provision.converge(opener, f.test_scope(), continuation))
                    for _, skip in ipairs(summary.skipped) do assert(skip.component_id ~= id, skip.reason) end
                    continuation = summary.continuation
                until not continuation
                -- Complete the lease through the old apply contract. This deliberately
                -- discards the follow-up marker, just as an invocation of old Core does.
                old.body.stats = {count = 1}
                assert(apply.advance("app:db", job, old, 1, {body = old.body, last_seq = 1}))
                in_db(function(db)
                    local slot = assert(db:query("SELECT scheduled_at FROM kickside_job WHERE id=$1", {old.job_id}))[1]
                    assert(slot.scheduled_at, "control wake must survive old head-satisfied settlement")
                    if later > 0 then
                        local events = {}
                        for i = 1, later do events[i] = {type = TRIGGER, role = "system", body_json = "{}"} end
                        assert(threads_writer.append_system(db, id, events))
                    end
                end)
                execute(current())
                local updated = current()
                local installed = type(updated.body) == "table" and updated.body or assert(json.decode(updated.body))
                test.eq(installed.meta.worker_ref, "proc://app:range_checkpoint_worker")
                test.eq(updated.job_id, old.job_id)
                test.eq(updated.id, old.id)
                test.is_nil(updated.pending_transition)
                if later > 0 then test.is_true(tonumber(updated.last_seq) < later + 1) end
            end)
        end

        for _, case in ipairs({
            {name = "runs the installed descriptor under its persisted actor", allowed = true},
            {name = "refuses an extra cursor", alternate = true, refusal = "installed projection declaration"},
            {name = "refuses different stored configuration", config = true, refusal = "installed projection declaration"},
            {name = "refuses a different stored actor", identity = true, refusal = "component's execution identity"},
            {name = "refuses an unrelated component implementation", owner = true, refusal = "installed projection declaration"},
            {name = "continues to enforce live actor authorization", revoked = true, refusal = "deferred principal is disabled"},
            {name = "rejects checkpoint writes after an admitted owner generation changes", change_owner = "before_write"},
            {name = "keeps the committed continuation after its owner generation changes", change_owner = "after_partial"},
            {name = "rejects stale settlement after the checkpoint commits", change_owner = "before_settlement", allowed = true},
            {name = "rejects a stale worker verdict without invalidating the projection", change_owner = "before_verdict"},
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
                    event = {type = TRIGGER, body = {change_owner = case.change_owner}}})
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
                local result
                if case.change_owner then
                    local run_err
                    result, run_err = invoke.run({job = lease(before), payload = {cursor_id = before.id}})
                    test.is_nil(result)
                    test.is_true(errors.is(run_err, errors.CONFLICT), tostring(run_err))
                else
                    result = execute(before)
                end
                in_db(function(db)
                    local after = registration(db, id, "source", params.cursor_key)
                    local effects = assert(db:query("SELECT actor_id FROM declared_checkpoint_effect WHERE thread_id=$1", {id}))
                    local outputs = assert(db:query("SELECT body FROM kickside_event WHERE thread_id=$1 AND type=$2", {id, CHANGED}))
                    test.eq(after.id, before.id)
                    test.eq(after.job_id, before.job_id)
                    test.eq(tonumber(after.generation), tonumber(before.generation))
                    if case.change_owner then
                        test.eq(after.status, "active")
                        if case.change_owner == "before_verdict" then
                            test.eq(after.last_error, before.last_error)
                        else
                            test.contains(after.last_error, "projection owner authority changed during execution")
                        end
                    end
                    if case.allowed then
                        test.eq(tonumber(after.last_seq), 1)
                        test.eq(#effects, 1)
                        test.eq(effects[1].actor_id, f.owner)
                        test.eq(#outputs, 1)
                        local output = type(outputs[1].body) == "table" and outputs[1].body or assert(json.decode(outputs[1].body))
                        test.eq(output.actor_id, f.owner)
                    else
                        if not case.change_owner then
                            test.is_true(result.invalid, tostring(after.last_error))
                            test.contains(after.last_error, assert(case.refusal))
                        end
                        test.eq(tonumber(after.last_seq), 0)
                        test.eq(#effects, 0)
                        test.eq(#outputs, 0)
                        if case.change_owner == "after_partial" then
                            local pinned = assert(apply.continuation(after))
                            test.eq(pinned.item, 1)
                            test.eq(pinned.step, 1)
                            test.eq(pinned.seq, 1)
                        end
                    end
                end)
            end)
        end
    end)
end)}
