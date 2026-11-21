-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local jobs = require("jobs")
local process = require("process")
local projections = require("projections")
local sql = require("sql")
local test = require("test")
local threads = require("threads")
local time = require("time")
local uuid = require("uuid")

local function with_db(body)
    local db = assert(sql.get("app:db"))
    local ok, result = pcall(body, db)
    assert(select(2, db:release()) == nil)
    if not ok then error(result) end
    return result
end

local function wait_for(read, message)
    local deadline = time.now():add("22s")
    repeat
        local value = read()
        if value then return value end
        time.sleep("25ms")
    until time.now():after(deadline)
    error(message)
end

local function effects(db, thread_id)
    return assert(db:query("SELECT ordinal,attempt_no FROM checkpoint_scheduler_effect WHERE thread_id=$1 ORDER BY ordinal",
        {thread_id}))
end

local function add(db, thread_id, ordinal, seq)
    assert(threads.append_system(db, thread_id, {{type = "fixture.checkpoint", role = "system",
        seq = seq, body_json = string.format('{"ordinal":%d}', ordinal)}}))
end

return {run = test.run_cases(function()
    test.describe("shared projection checkpoints through the Jobs scheduler", function()
        test.it("holds a committed prefix during a dependency outage and recovers on the existing slot", function()
            local thread_id = uuid.v7()
            local registration = with_db(function(db)
                assert(db:execute([[CREATE TABLE IF NOT EXISTS checkpoint_scheduler_gate (
                    thread_id TEXT PRIMARY KEY, available INTEGER NOT NULL)]]))
                assert(db:execute([[CREATE TABLE IF NOT EXISTS checkpoint_scheduler_effect (
                    thread_id TEXT NOT NULL, ordinal INTEGER NOT NULL, attempt_no INTEGER NOT NULL, PRIMARY KEY (thread_id,ordinal))]]))
                assert(db:execute("INSERT INTO checkpoint_scheduler_gate (thread_id,available) VALUES ($1,0)", {thread_id}))
                -- This system worker exercises the checkpoint scheduler on an unbound fixture thread.
                assert(db:execute([[INSERT INTO kickside_thread (id,thread_class,component_id) VALUES ($1,'test','')]],
                    {thread_id}))
                add(db, thread_id, 1, 1000)
                add(db, thread_id, 2, 1500)
                return assert(projections.register_projection(db, thread_id, {kind = "checkpoint-scheduler",
                    worker_ref = "proc://app:checkpoint_scheduler_worker", worker_input_mode = "prefetch_events",
                    system_identity = true, events = {input = {{type = "fixture.checkpoint"}}}}))
            end)
            local scheduler = assert(process.spawn_monitored("kickside.core.jobs.service:worker", "app:processes"))
            local ok, err = pcall(function()
                assert(jobs.nudge_workers())
                local first_retry = wait_for(function()
                    return with_db(function(db)
                        local state = assert(db:query([[SELECT c.last_seq,c.last_error,j.last_error AS job_error,
                            j.status,j.attempts,j.scheduled_at
                            FROM kickside_projection_cursor c JOIN kickside_job j ON j.id=c.job_id WHERE c.id=$1]],
                            {registration.cursor_id}))[1]
                        if not state or state.status ~= "pending" or tonumber(state.attempts) == 0 then return nil end
                        test.eq(tonumber(state.last_seq), 1000, tostring(state.last_error or state.job_error))
                        test.contains(state.last_error, "fixture provider is unavailable")
                        test.eq(#effects(db, thread_id), 1)
                        return state
                    end)
                end, "scheduler never persisted the outage retry")

                with_db(function(db)
                    add(db, thread_id, 3, 2000)
                    local scheduled = assert(db:query("SELECT scheduled_at FROM kickside_job WHERE id=$1",
                        {registration.job_id}))[1]
                    test.eq(scheduled.scheduled_at, first_retry.scheduled_at)
                    assert(db:execute("UPDATE checkpoint_scheduler_gate SET available=1 WHERE thread_id=$1", {thread_id}))
                end)
                wait_for(function()
                    return with_db(function(db)
                        local state = assert(db:query([[SELECT c.last_seq,c.last_error,c.continuation,j.status,j.scheduled_at
                            FROM kickside_projection_cursor c JOIN kickside_job j ON j.id=c.job_id WHERE c.id=$1]],
                            {registration.cursor_id}))[1]
                        if tonumber(state.last_seq) ~= 2000 or state.status ~= "pending" or state.scheduled_at then return nil end
                        local backfill = assert(db:query("SELECT id FROM kickside_event WHERE thread_id=$1 AND seq=1750",
                            {thread_id}))
                        test.eq(#backfill, 1)
                        local written = effects(db, thread_id)
                        test.eq(#written, 5)
                        local expected_attempts = {1, 2, 2, 1, 1}
                        for index, expected in ipairs({1, 2, 31, 32, 33}) do
                            test.eq(tonumber(written[index].ordinal), expected)
                            test.eq(tonumber(written[index].attempt_no), expected_attempts[index])
                        end
                        test.eq(state.continuation, "")
                        test.is_nil(state.last_error)
                        local runs = assert(db:query([[SELECT status,error_text FROM kickside_job_run
                            WHERE job_id=$1 ORDER BY execution_seq]], {registration.job_id}))
                        test.eq(#runs, 4)
                        test.eq(runs[1].status, "failed")
                        for i = 2, 4 do test.eq(runs[i].status, "completed", tostring(runs[i].error_text)) end
                        return true
                    end)
                end, "scheduler never reached the third event")
            end)
            process.terminate(scheduler)
            with_db(function(db)
                assert(projections.remove_projection(db, thread_id, {projection_id = registration.projection_id}))
                assert(db:execute("DELETE FROM checkpoint_scheduler_effect WHERE thread_id=$1", {thread_id}))
                assert(db:execute("DELETE FROM checkpoint_scheduler_gate WHERE thread_id=$1", {thread_id}))
                assert(db:execute("DELETE FROM kickside_event WHERE thread_id=$1", {thread_id}))
                assert(db:execute("DELETE FROM kickside_thread WHERE id=$1", {thread_id}))
            end)
            if not ok then error(err) end
        end)
    end)
end)}
