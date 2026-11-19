-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply = require("apply")
local claim = require("claim")
local clock = require("clock")
local json = require("json")
local job_types = require("job_types")
local projections = require("projections")
local sql = require("sql")
local test = require("test")
local time = require("time")
local uuid = require("uuid")

local DATABASE = "app:db"

local function snapshot(db, id)
    local rows = assert(db:query([[SELECT c.*, p.body, p.kind FROM kickside_projection_cursor c
        JOIN kickside_projection p ON p.id=c.projection_id WHERE c.id=$1]], {id}))
    local current = assert(rows[1])
    current.body = type(current.body) == "table" and current.body or assert(json.decode(current.body))
    return current
end

local function with_execution(check)
    local thread_id = uuid.v7()
    local db = assert(sql.get(DATABASE))
    local dialect = assert(db:type())
    assert(db:execute([[CREATE TABLE IF NOT EXISTS projection_checkpoint_effects (
        thread_id TEXT NOT NULL, ordinal INTEGER NOT NULL, PRIMARY KEY (thread_id, ordinal))]]))
    assert(db:execute([[INSERT INTO kickside_thread (id,thread_class,component_id,event_count)
        VALUES ($1,'test',$2,2)]], {thread_id, thread_id}))
    for position = 1, 2 do
        assert(db:execute([[INSERT INTO kickside_event (id,thread_id,type,role,body,seq)
            VALUES ($1,$2,'fixture:checkpoint','system','{}',$3)]], {uuid.v7(), thread_id, position}))
    end
    local registered = assert(projections.register_projection(db, thread_id, {
        kind = "checkpoint-fixture", worker_ref = "func://app:test_count_worker", system_identity = true,
    }))
    local tx = assert(db:begin())
    local token = uuid.v7()
    local leased = assert(claim.lease_row(tx, dialect, registered.job_id, token,
        clock.format(time.now():add("1m"), dialect), clock.now(dialect)))
    assert(select(2, tx:commit()) == nil)
    local current = snapshot(db, registered.cursor_id)
    db:release()

    local job = {id = registered.job_id, lease_token = token, execution_seq = tonumber(leased.execution_seq)}
    local ok, err = pcall(check, job, current)
    db = assert(sql.get(DATABASE))
    assert(db:execute("DELETE FROM projection_checkpoint_effects WHERE thread_id=$1", {thread_id}))
    assert(projections.remove_projection(db, thread_id, {projection_id = registered.projection_id}))
    assert(db:execute("DELETE FROM kickside_event WHERE thread_id=$1", {thread_id}))
    assert(db:execute("DELETE FROM kickside_thread WHERE id=$1", {thread_id}))
    db:release()
    if not ok then error(err) end
end

local function write_effect(thread_id, position)
    return function(tx)
        local wrote, err = tx:execute("INSERT INTO projection_checkpoint_effects (thread_id, ordinal) VALUES ($1,$2)",
            {thread_id, position})
        if err then return nil, err end
        return wrote.rows_affected == 1
    end
end

local function persisted(job, current)
    local db = assert(sql.get(DATABASE))
    local state = snapshot(db, current.id)
    local lease = assert(db:query("SELECT status, lease_token, scheduled_at FROM kickside_job WHERE id=$1", {job.id}))[1]
    local effects = assert(db:query("SELECT ordinal FROM projection_checkpoint_effects WHERE thread_id=$1 ORDER BY ordinal",
        {current.thread_id}))
    local history = assert(db:query("SELECT status FROM kickside_job_run WHERE job_id=$1", {job.id}))
    db:release()
    return state, lease, effects, history
end

return {run = test.run_cases(function()
    test.describe("trusted shared projection checkpoints", function()
        test.it("commits two owner mutations in one existing execution and settles it once", function()
            with_execution(function(job, current)
                local first_seq = tonumber(current.last_seq)
                for position = 1, 2 do
                    local receipt = assert(apply.checkpoint(DATABASE, job, current, 2, {last_seq = position},
                        write_effect(current.thread_id, position)))
                    test.eq(receipt.last_seq, position)
                    local stored, lease, effects, history = persisted(job, current)
                    test.eq(tonumber(stored.last_seq), position)
                    test.eq(#effects, position)
                    test.eq(lease.status, "running")
                    test.eq(lease.lease_token, job.lease_token)
                    test.eq(#history, 0)
                    current = stored
                end
                local settled = assert(apply.finish_checkpointed(DATABASE, job, current, first_seq))
                test.is_true(settled.self_completed)
                local _, lease, effects, history = persisted(job, current)
                test.eq(lease.status, "pending")
                test.is_nil(lease.lease_token)
                test.is_nil(lease.scheduled_at)
                test.eq(#effects, 2)
                test.eq(#history, 1)
                test.eq(history[1].status, "completed")
            end)
        end)

        test.it("rejects a stale projection generation before calling the owner writer", function()
            with_execution(function(job, current)
                local db = assert(sql.get(DATABASE))
                assert(projections.pause(db, current.thread_id, {cursor_id = current.id}))
                db:release()
                local called = false
                local receipt, err = apply.checkpoint(DATABASE, job, current, 2, {last_seq = 1}, function()
                    called = true
                    return true
                end)
                test.is_nil(receipt)
                test.is_true(errors.is(err, errors.CONFLICT), tostring(err))
                test.is_false(called)
                local stored, _, effects, history = persisted(job, current)
                test.eq(stored.status, "paused")
                test.eq(tonumber(stored.last_seq), 0)
                test.eq(#effects, 0)
                test.eq(#history, 0)
            end)
        end)

        test.it("fences an incomplete event on the full item position", function()
            with_execution(function(job, current)
                local db = assert(sql.get(DATABASE))
                local event_id = tostring(assert(db:query("SELECT id FROM kickside_event WHERE thread_id=$1 AND seq=1",
                    {current.thread_id}))[1].id)
                db:release()
                local first = {last_seq = 0, continuation = {event_id = event_id, item = 1, step = 1}}
                assert(apply.checkpoint(DATABASE, job, current, 2, first, write_effect(current.thread_id, 1)))
                local stored, _, effects = persisted(job, current)
                test.eq(tonumber(stored.last_seq), 0)
                test.eq(assert(apply.continuation(stored)).step, 1)
                test.eq(#effects, 1)
                local next_position = {last_seq = 0, continuation = {event_id = event_id, item = 1, step = 2}}
                local stale, stale_err = apply.checkpoint(DATABASE, job, current, 2, next_position,
                    write_effect(current.thread_id, 2))
                test.is_nil(stale)
                test.is_true(errors.is(stale_err, errors.CONFLICT), tostring(stale_err))
                assert(apply.checkpoint(DATABASE, job, stored, 2, next_position, write_effect(current.thread_id, 2)))
                stored = persisted(job, current)
                test.eq(assert(apply.continuation(stored)).step, 2)
                assert(apply.checkpoint(DATABASE, job, stored, 2, {last_seq = 1}, write_effect(current.thread_id, 3)))
                stored, _, effects = persisted(job, current)
                test.eq(tonumber(stored.last_seq), 1)
                test.is_nil(apply.continuation(stored))
                test.eq(#effects, 3)
            end)
        end)

        for _, transition in ipairs({"rewind", "worker replacement"}) do
            test.it("clears the former continuation on " .. transition, function()
                with_execution(function(job, current)
                    assert(apply.checkpoint(DATABASE, job, current, 2, {last_seq = 1}, write_effect(current.thread_id, 1)))
                    local persisted_head = persisted(job, current)
                    local db = assert(sql.get(DATABASE))
                    local event_id = tostring(assert(db:query("SELECT id FROM kickside_event WHERE thread_id=$1 AND seq=2",
                        {current.thread_id}))[1].id)
                    db:release()
                    local partial = {last_seq = 1, continuation = {event_id = event_id, item = 1, step = 1}}
                    assert(apply.checkpoint(DATABASE, job, persisted_head, 2, partial, write_effect(current.thread_id, 2)))
                    local before = persisted(job, current)
                    test.eq(assert(apply.continuation(before)).event_id, event_id)
                    local rewind = transition == "rewind"
                    db = assert(sql.get(DATABASE))
                    local registered = assert(projections.register_projection(db, current.thread_id, {
                        kind = "checkpoint-fixture", system_identity = true,
                        worker_ref = rewind and "func://app:test_count_worker" or "func://app:test_failing_worker",
                        reset = rewind, start_seq = 0, ensure = not rewind,
                    }))
                    db:release()
                    local after = persisted(job, current)
                    test.eq(registered.cursor_id, current.id)
                    test.eq(tonumber(after.last_seq), rewind and 0 or 1)
                    test.eq(tonumber(after.generation), tonumber(before.generation) + 1)
                    test.is_nil(apply.continuation(after))
                end)
            end)
        end

        test.it("rolls back the owner mutation when the trusted writer fails", function()
            with_execution(function(job, current)
                local receipt, err = apply.checkpoint(DATABASE, job, current, 2, {last_seq = 1}, function(tx)
                    assert(write_effect(current.thread_id, 1)(tx))
                    return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true, message = "owner writer failed"})
                end)
                test.is_nil(receipt)
                test.is_true(errors.is(err, errors.UNAVAILABLE), tostring(err))
                test.is_true(err:retryable())
                local stored, lease, effects, history = persisted(job, current)
                test.eq(tonumber(stored.last_seq), 0)
                test.eq(lease.status, "running")
                test.eq(#effects, 0)
                test.eq(#history, 0)
            end)
        end)

        test.it("checks the existing lease and database binding before calling the owner writer", function()
            with_execution(function(job, current)
                local called = false
                local function effect()
                    called = true
                    return true
                end
                local receipt, binding_err = apply.checkpoint("app:isolated", job, current, 2, {last_seq = 1}, effect)
                test.is_nil(receipt)
                test.is_true(errors.is(binding_err, errors.INVALID), tostring(binding_err))
                local stale = {id = job.id, lease_token = uuid.v7(), execution_seq = job.execution_seq}
                local stale_receipt, stale_err = apply.checkpoint(DATABASE, stale, current, 2, {last_seq = 1}, effect)
                test.is_nil(stale_receipt)
                test.is_true(job_types.is_lease_lost_error(stale_err), tostring(stale_err))
                test.is_false(called)
                test.eq(tonumber(persisted(job, current).last_seq), 0)
            end)
        end)

        test.it("refuses an expired lease before any owner mutation", function()
            with_execution(function(job, current)
                local db = assert(sql.get(DATABASE))
                local dialect = assert(db:type())
                assert(db:execute("UPDATE kickside_job SET lease_until=$1 WHERE id=$2",
                    {clock.format(time.now():add("-1m"), dialect), job.id}))
                db:release()

                local called = false
                local receipt, err = apply.checkpoint(DATABASE, job, current, 2, {last_seq = 1}, function()
                    called = true
                    return true
                end)
                test.is_nil(receipt)
                test.is_true(job_types.is_lease_lost_error(err), tostring(err))
                test.is_false(called)
                local stored, _, effects, history = persisted(job, current)
                test.eq(tonumber(stored.last_seq), 0)
                test.eq(#effects, 0)
                test.eq(#history, 0)
            end)
        end)

        test.it("rolls back the mutation and position if lease validity ends before publication", function()
            with_execution(function(job, current)
                local receipt, err = apply.checkpoint(DATABASE, job, current, 2, {last_seq = 1}, function(tx, dialect)
                    assert(write_effect(current.thread_id, 1)(tx))
                    assert(tx:execute("UPDATE kickside_job SET lease_until=$1 WHERE id=$2",
                        {clock.format(time.now():add("-1m"), dialect), job.id}))
                    return true
                end)
                test.is_nil(receipt)
                test.is_true(job_types.is_lease_lost_error(err), tostring(err))
                local stored, lease, effects, history = persisted(job, current)
                test.eq(tonumber(stored.last_seq), 0)
                test.eq(lease.lease_token, job.lease_token)
                test.eq(#effects, 0)
                test.eq(#history, 0)
            end)
        end)
    end)
end)}
