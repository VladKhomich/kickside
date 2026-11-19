-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local json = require("json")
local security = require("security")
local contract = require("contract")
local process = require("process")
local channel = require("channel")
local time = require("time")
local events = require("events")
local funcs = require("funcs")
local provision = require("provision")
local lifecycle = require("lifecycle")
local register = require("register")
local prune = require("prune")
local writer = require("writer")

local IMPL = "app:lifecycle_convergence_kind"
local KIND = "test.lifecycle.converge"
local PRIMARY_ONLY_IMPL = "app:converge_test_projonly"

local function state(thread_id: string): any
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query([[SELECT p.body,p.updated_at AS projection_updated_at,
        c.id,c.job_id,c.last_seq,c.generation,c.status,c.last_error,c.updated_at
        FROM kickside_projection p JOIN kickside_projection_cursor c ON c.projection_id=p.id
        WHERE p.thread_id=$1 AND p.kind=$2 AND p.projection_key='custom' AND c.cursor_key='progress']],
        {thread_id, KIND}))
    assert(db:release())
    return rows[1]
end

local function catch_up(thread_id: string, last_seq: integer, count: integer)
    local events = process.events()
    local pid = assert(process.spawn_monitored("kickside.core.jobs.service:worker", "app:processes"))
    local deadline = time.now():add("5s")
    local cursor
    repeat
        cursor = state(thread_id)
        if tonumber(cursor.last_seq) ~= last_seq then time.sleep("10ms") end
    until tonumber(cursor.last_seq) == last_seq or time.now():after(deadline)
    assert(process.cancel(pid))
    while true do
        local event = channel.select({events:case_receive()}).value
        if type(event) == "table" and tostring(event.from) == tostring(pid) and event.kind == process.event.EXIT then break end
    end
    test.eq(tonumber(cursor.last_seq), last_seq)
    local body = assert(json.decode(cursor.body))
    test.eq(tonumber(body.stats.count), count)
end

return {run = test.run_cases(function()
    test.describe("lifecycle declaration convergence", function()
        local actor = security.new_actor("system:lifecycle", {system = true, security_groups = {}})
        local scope = assert(security.named_scope("wippy.security:process"))
        local id: string = ""
        local thread_id: string = ""

        local function create(impl_id: string, class: string)
            id = uuid.v4()
            thread_id = lifecycle.thread_id(id)
            local service = assert(assert(contract.get("kickside.component:component_service"))
                :with_actor(actor):with_scope(scope):open())
            local result = assert(service:register({component_id = id, impl_id = impl_id, meta = {class = class}}))
            test.is_true(result.success)
        end

        local function converge_fixture(): table
            local continuation: table? = nil
            local refusals = {}
            repeat
                local summary, err = provision.converge(actor, scope, continuation)
                assert(not err, tostring(err))
                for _, entry in ipairs(summary.skipped) do
                    if entry.component_id == id then refusals[#refusals + 1] = entry.error end
                end
                continuation = summary.continuation
            until not continuation
            return refusals
        end

        test.after_each(function()
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id}))
            local _, err = writer.remove_projection(db, thread_id, {kind = KIND, projection_key = "custom"})
            assert(not err or errors.is(err, errors.NOT_FOUND), tostring(err))
            assert(db:execute("DELETE FROM kickside_thread WHERE id=$1", {thread_id}))
            assert(db:release())
        end)

        test.it("refuses declaration drift with an explicit repair action and preserves the cursor", function()
            create(IMPL, KIND)
            local db = assert(sql.get("app:db"))
            local params = {kind = KIND, projection_key = "custom", cursor_key = "progress",
                worker_ref = "func://app:test_count_worker", worker_input_mode = "prefetch_events",
                system_identity = true, events = {input = {{type = lifecycle.EVENT.CREATED}}}}
            local registered = assert(register.register_projection(db, thread_id, params))
            assert(lifecycle.append(db, id, "updated", uuid.v4(), {}))
            assert(db:execute([[UPDATE kickside_projection_cursor
                SET last_seq=1,status='invalid',last_error='existing failure' WHERE id=$1]], {registered.cursor_id}))
            assert(db:release())
            local before = state(thread_id)

            local refusals = converge_fixture()
            test.eq(#refusals, 1)
            local refusal = refusals[1]
            test.eq(refusal.kind, errors.CONFLICT)
            test.eq(refusal.retryable, false)
            test.eq(refusal.details.code, "projection_declaration_requires_registration")
            test.eq(refusal.details.projection_kind, KIND)
            test.eq(refusal.details.projection_key, "custom")
            test.eq(refusal.details.cursor_key, "progress")
            test.eq(refusal.details.action, "explicit_reregistration_or_reset")
            local after = state(thread_id)
            for key, value in pairs(before) do test.eq(after[key], value, key) end

            params.events = {input = {{type = lifecycle.EVENT.CREATED, via = "thread"},
                {type = lifecycle.EVENT.UPDATED, via = "thread"}}, output = {}}
            local threads = assert(assert(contract.get("kickside.core:threads"))
                :with_actor(actor):with_scope(scope):open())
            params.thread_id = thread_id
            params.system_identity = nil
            local result, repair_err = threads:register_projection(params)
            assert(not repair_err, tostring(repair_err))
            test.not_nil(result)
            local repaired = state(thread_id)
            test.eq(repaired.id, before.id)
            test.eq(tonumber(repaired.last_seq), 1)
            test.eq(repaired.status, "active")
            test.is_nil(repaired.last_error)

            test.eq(#converge_fixture(), 0)
            local unchanged = state(thread_id)
            for key, value in pairs(repaired) do test.eq(unchanged[key], value, key) end
        end)

        test.it("refuses a component update without publishing the conflicting lifecycle declaration or event", function()
            create(IMPL, KIND)
            local db = assert(sql.get("app:db"))
            assert(register.register_projection(db, thread_id, {kind = KIND, projection_key = "custom",
                cursor_key = "progress", worker_ref = "func://app:test_count_worker",
                worker_input_mode = "prefetch_events", system_identity = true,
                events = {input = {{type = lifecycle.EVENT.CREATED}}}}))
            assert(db:release())
            local before = state(thread_id)
            test.eq(tonumber(before.last_seq), 0)
            test.eq(#converge_fixture(), 1)

            local service = assert(assert(contract.get("kickside.component:component_service"))
                :with_actor(actor):with_scope(scope):open())
            local update, update_err = service:update({component_id = id,
                commands = {{type = "SET_META", payload = {fields = {status = "changed"}}}}})
            local refusal = update_err and update_err:details() or update and update.details
            test.eq(refusal and refusal.code, "projection_declaration_requires_registration")
            local after = state(thread_id)
            for key, value in pairs(before) do test.eq(after[key], value, key) end
            db = assert(sql.get("app:db"))
            local retained = assert(db:query("SELECT seq,type FROM kickside_event WHERE thread_id=$1 ORDER BY seq", {thread_id}))
            assert(db:release())
            test.eq(#retained, 1)
            test.eq(retained[1].type, lifecycle.EVENT.CREATED)
            test.eq(#converge_fixture(), 1)
        end)

        test.it("lets a lifecycle administrator reset the projection through its existing HTTP control", function()
            create(IMPL, KIND)
            local db = assert(sql.get("app:db"))
            assert(lifecycle.append(db, id, "updated", uuid.v4(), {}))
            assert(db:execute([[UPDATE kickside_projection_cursor SET last_seq=1,status='invalid',last_error='failed'
                WHERE thread_id=$1]], {thread_id}))
            assert(db:release())

            local args = {thread_id = thread_id, body = {kind = KIND, projection_key = "custom",
                cursor_key = "progress", worker_ref = "func://app:test_count_worker", worker_input_mode = "prefetch_events",
                start_seq = 0, reset = true, events = {input = {{type = lifecycle.EVENT.CREATED, via = "thread"},
                    {type = lifecycle.EVENT.UPDATED, via = "thread"}}, output = {}}}}
            local member = security.new_actor("lifecycle-member", {security_groups = {"app:user"}})
            local admin = security.new_actor("lifecycle-admin", {security_groups = {"app:admin"}})
            local before = state(thread_id)
            local denied = assert(funcs.new():with_actor(member):with_scope(scope):call("app:test_register_projection", args))
            test.eq(denied.status, 403)
            local unchanged = state(thread_id)
            for key, value in pairs(before) do test.eq(unchanged[key], value, key) end
            local reset = assert(funcs.new():with_actor(admin):with_scope(scope):call("app:test_register_projection", args))
            local response = assert(json.encode(reset.body))
            test.eq(reset.status, 201, response)
            local after = state(thread_id)
            test.eq(after.id, before.id)
            test.eq(tonumber(after.last_seq), 0)
            test.eq(after.status, "active")
            test.is_nil(after.last_error)
            catch_up(thread_id, 2, 2)
        end)

        test.it("logs the typed declaration refusal as structured fields", function()
            create(IMPL, KIND)
            local db = assert(sql.get("app:db"))
            assert(register.register_projection(db, thread_id, {kind = KIND, projection_key = "custom",
                cursor_key = "progress", worker_ref = "func://app:test_count_worker",
                worker_input_mode = "prefetch_events", system_identity = true,
                events = {input = {{type = lifecycle.EVENT.CREATED}}}}))
            assert(db:release())

            local subscription = assert(events.subscribe("logs", "logs.entry"))
            local logs = subscription:channel()
            assert(funcs.call("kickside.core.lifecycle:migrations_applied"))
            local deadline = time.after("5s")
            local fields = {}
            while true do
                local selected = channel.select({logs:case_receive(), deadline:case_receive()})
                if selected.channel ~= logs then break end
                local record = selected.value.data
                if record.entry.message == "declared thread not convergeable" then
                    for _, field in ipairs(record.fields) do fields[field.key] = field.string end
                    if fields.component_id == id then break end
                    fields = {}
                end
            end
            assert(subscription:close())
            test.eq(fields.component_id, id)
            test.eq(fields.code, "projection_declaration_requires_registration")
            test.eq(fields.thread_id, thread_id)
            test.eq(fields.projection_kind, KIND)
            test.eq(fields.projection_key, "custom")
        end)

        test.it("attaches on the lifecycle thread at the retention floor and folds the retained event", function()
            create(PRIMARY_ONLY_IMPL, "test_projonly")
            test.is_nil(state(thread_id))
            local db = assert(sql.get("app:db"))
            assert(lifecycle.append(db, id, "updated", uuid.v4(), {}))
            local pruned = assert(prune.prune_thread(db, thread_id, {cutoff = "2100-01-01T00:00:00Z", max_total = 1}))
            test.eq(pruned.deleted, 1, "the lifecycle event is pruned before the kind declares a projection")
            assert(db:execute("UPDATE kickside_components SET impl_id=$1 WHERE component_id=$2", {IMPL, id}))
            assert(db:release())

            test.eq(#converge_fixture(), 0)
            local cursor = state(thread_id)
            test.not_nil(cursor)
            test.eq(tonumber(cursor.last_seq), 1)
            test.not_nil(cursor.job_id)
            catch_up(thread_id, 2, 1)

            db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM kickside_projection_cursor WHERE id=$1", {cursor.id}))
            assert(db:execute("DELETE FROM kickside_job WHERE id=$1", {cursor.job_id}))
            assert(lifecycle.append(db, id, "updated", uuid.v4(), {}))
            assert(db:release())

            test.eq(#converge_fixture(), 0)
            local replacement = state(thread_id)
            test.eq(tonumber(replacement.last_seq), 2)
            catch_up(thread_id, 3, 2)

            local settled = state(thread_id)
            test.eq(#converge_fixture(), 0)
            local unchanged = state(thread_id)
            for key, value in pairs(settled) do test.eq(unchanged[key], value, key) end
        end)
    end)
end)}
