local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local json = require("json")
local writer = require("writer")
local invoke = require("invoke")
local claim = require("claim")
local job_lifecycle = require("job_lifecycle")
local jobs = require("jobs")
local provision = require("provision")
local security = require("security")
local disabled_slots_migration = require("disabled_slots_migration")

-- A thread with `events` stored events and no projection.
local function thread_with_events(db: sql.DB, events: integer, body: string?): string
    local id = uuid.v7()
    local _, thread_err = db:execute("INSERT INTO kickside_thread (id,thread_class,component_id,event_count) VALUES ($1,'test',$2,$3)",
        { id, id, events })
    if thread_err then error("thread insert failed: " .. tostring(thread_err)) end
    for seq = 1, events do
        local _, event_err = db:execute("INSERT INTO kickside_event (id,thread_id,type,role,body,seq) VALUES ($1,$2,'test:event','user',$3,$4)",
            { uuid.v7(), id, body or "{}", seq })
        if event_err then error("event insert failed: " .. tostring(event_err)) end
    end
    return id
end

local function append_event(db: sql.DB, thread_id: string, seq: integer)
    local tx = assert(db:begin())
    local _, event_err = tx:execute("INSERT INTO kickside_event (id,thread_id,type,role,body,seq) VALUES ($1,$2,'test:event','user','{}',$3)",
        { uuid.v7(), thread_id, seq })
    if event_err then error("event insert failed: " .. tostring(event_err)) end
    local _, head_err = tx:execute("UPDATE kickside_thread SET event_count=$1 WHERE id=$2", { seq, thread_id })
    if head_err then error("thread head update failed: " .. tostring(head_err)) end
    assert(jobs.wake_tx(tx, "thread:" .. thread_id))
    assert(tx:commit())
end

-- Make this slot due and claim it the way slot_test does.
local function claim_slot(job_id: string): table
    local db = assert(sql.get("app:db"))
    local dbtype = tostring(db:type())
    local _, due_err = db:execute("UPDATE kickside_job SET scheduled_at=created_at WHERE id=$1 AND status='pending'", { job_id })
    if due_err then error("slot due update failed: " .. tostring(due_err)) end
    local batch, claim_err = claim.claim_batch(db, dbtype, 16, nil, nil)
    db:release()
    if claim_err then error("claim failed: " .. tostring(claim_err)) end
    for _, row in ipairs(batch or {}) do
        if row.id == job_id then return row end
    end
    error("projection slot is not claimed")
end

local function input_for(job: table, cursor_id: string): table
    return { job = { id = job.id, lease_token = job.lease_token, execution_seq = tonumber(job.execution_seq),
        attempts = tonumber(job.attempts) }, payload = { cursor_id = cursor_id } }
end

local function read(db: sql.DB, statement: string, args: { any }): table
    local rows, err = db:query(statement, args)
    if err or not rows or not rows[1] then error("read failed: " .. tostring(err)) end
    return rows[1] :: table
end

local function define_tests()
    test.describe("projection slot failures", function()
        test.it("boot convergence drains disabled active slots without changing cursor progress", function()
            local db = assert(sql.get("app:db"))
            local thread_id = thread_with_events(db, 3)
            local cursors = {}
            for i = 1, 207 do
                local registered, err = writer.register_projection(db, thread_id, {
                    kind = "wake-convergence", projection_key = tostring(i),
                    worker_ref = "func://app:test_count_worker", system_identity = true,
                })
                test.is_nil(err)
                test.not_nil(registered)
                cursors[i] = registered
                local status = i == 206 and "paused" or (i == 207 and "invalid" or "active")
                test.is_nil(select(2, db:execute("UPDATE kickside_projection_cursor SET last_seq=1,status=$1 WHERE id=$2",
                    {status, registered.cursor_id})))
                test.is_nil(select(2, db:execute([[UPDATE kickside_job SET wake_enabled=FALSE,scheduled_at=NULL
                    WHERE id=$1]], {registered.job_id})))
            end
            local migration = disabled_slots_migration[1].database_implementations[tostring(db:type())]
            migration.down(db)
            migration.up(db)
            migration.up(db)
            db:release()
            local scope = assert(security.named_scope("wippy.security:process"))
            local actor = security.new_actor("system:lifecycle", {system = true, security_groups = {}})
            local summary, err = provision.converge(actor, scope)
            test.is_nil(err)
            test.eq(#summary.skipped, 0)
            db = assert(sql.get("app:db"))
            for i, registered in ipairs(cursors) do
                local row = read(db, [[SELECT c.last_seq,c.generation,c.status,j.wake_enabled,j.scheduled_at
                    FROM kickside_projection_cursor c JOIN kickside_job j ON j.id=c.job_id WHERE c.id=$1]],
                    {registered.cursor_id})
                test.eq(tonumber(row.last_seq), 1)
                test.eq(tonumber(row.generation), registered.generation)
                if i <= 205 then
                    test.eq(row.status, "active")
                    test.eq(row.wake_enabled == true or tonumber(row.wake_enabled) == 1, true)
                    test.not_nil(row.scheduled_at)
                else
                    test.eq(row.status, i == 206 and "paused" or "invalid")
                    test.eq(row.wake_enabled == true or tonumber(row.wake_enabled) == 1, false)
                    test.is_nil(row.scheduled_at)
                end
            end
            test.is_nil(select(2, db:execute("UPDATE kickside_job SET attempts=3 WHERE id=$1", {cursors[1].job_id})))
            db:release()
            test.is_nil(select(2, provision.converge(actor, scope)))
            db = assert(sql.get("app:db"))
            test.eq(tonumber(read(db, "SELECT attempts FROM kickside_job WHERE id=$1", {cursors[1].job_id}).attempts), 3)
            for _, registered in ipairs(cursors) do
                test.is_nil(select(2, writer.remove_projection(db, thread_id, {projection_id = registered.projection_id})))
            end
            db:release()
        end)

        test.it("convergence preserves a pause or restored wake that wins after candidate selection", function()
            for _, change in ipairs({"pause", "wake"}) do
                local db = assert(sql.get("app:db"))
                local thread_id = thread_with_events(db, 1)
                local registered = assert(writer.register_projection(db, thread_id, {
                    kind = "wake-race", worker_ref = "func://app:test_count_worker", system_identity = true,
                }))
                test.is_nil(select(2, db:execute("UPDATE kickside_job SET wake_enabled=FALSE,scheduled_at=NULL WHERE id=$1",
                    {registered.job_id})))
                local changed = false
                local during_selection: any = {
                    type = function(self) return db:type() end,
                    begin = function(self) return db:begin() end,
                    execute = function(self, statement, args) return db:execute(statement, args) end,
                    query = function(self, statement, args)
                        local rows, err = db:query(statement, args)
                        if not changed and statement:find("SELECT j.id AS job_id", 1, true) then
                            changed = true
                            if change == "pause" then
                                test.is_nil(select(2, writer.pause(db, thread_id, {cursor_id = registered.cursor_id})))
                            else
                                test.is_nil(select(2, writer.resume(db, thread_id, {cursor_id = registered.cursor_id})))
                                test.is_nil(select(2, db:execute("UPDATE kickside_job SET attempts=3 WHERE id=$1",
                                    {registered.job_id})))
                            end
                        end
                        return rows, err
                    end,
                }
                local skipped = {}
                local healed, err = writer.converge(during_selection, skipped)
                test.eq(#skipped, 0)
                test.is_nil(err)
                test.eq(healed, 0)
                test.is_true(changed)
                local cursor = read(db, "SELECT status,generation,last_seq FROM kickside_projection_cursor WHERE id=$1",
                    {registered.cursor_id})
                local job = read(db, "SELECT wake_enabled,attempts,scheduled_at FROM kickside_job WHERE id=$1", {registered.job_id})
                test.eq(cursor.status, change == "pause" and "paused" or "active")
                test.eq(tonumber(cursor.last_seq), 0)
                test.eq(tonumber(cursor.generation), registered.generation + (change == "pause" and 1 or 0))
                if change == "pause" then
                    test.is_nil(job.scheduled_at)
                    test.eq(job.wake_enabled == true or tonumber(job.wake_enabled) == 1, false)
                else
                    test.eq(tonumber(job.attempts), 3)
                end
                test.is_nil(select(2, writer.remove_projection(db, thread_id, {projection_id = registered.projection_id})))
                db:release()
            end
        end)

        test.it("convergence advances past a deleted thread to the next disabled slot", function()
            local db = assert(sql.get("app:db"))
            local registered = {}
            for i = 1, 2 do
                local thread_id = thread_with_events(db, 1)
                local row = assert(writer.register_projection(db, thread_id, {
                    kind = "deleted-wake-candidate", worker_ref = "func://app:test_count_worker", system_identity = true,
                }))
                row.thread_id = thread_id
                registered[i] = row
                test.is_nil(select(2, db:execute("UPDATE kickside_job SET wake_enabled=FALSE,scheduled_at=NULL WHERE id=$1",
                    {row.job_id})))
            end
            table.sort(registered, function(a, b) return a.job_id < b.job_id end)
            local removed = false
            local during_selection: any = {
                type = function(self) return db:type() end,
                begin = function(self) return db:begin() end,
                execute = function(self, statement, args) return db:execute(statement, args) end,
                query = function(self, statement, args)
                    local rows, err = db:query(statement, args)
                    if not removed and statement:find("SELECT j.id AS job_id", 1, true) then
                        removed = true
                        test.is_nil(select(2, writer.remove_projection(db, registered[1].thread_id,
                            {projection_id = registered[1].projection_id})))
                        test.is_nil(select(2, db:execute("DELETE FROM kickside_thread WHERE id=$1", {registered[1].thread_id})))
                    end
                    return rows, err
                end,
            }
            local skipped = {}
            local healed, err = writer.converge(during_selection, skipped)
            test.eq(#skipped, 0)
            test.is_nil(err)
            test.is_true(healed >= 1)
            test.is_true(removed)
            local job = read(db, "SELECT wake_enabled,scheduled_at FROM kickside_job WHERE id=$1", {registered[2].job_id})
            test.eq(job.wake_enabled == true or tonumber(job.wake_enabled) == 1, true)
            test.not_nil(job.scheduled_at)
            test.is_nil(select(2, writer.remove_projection(db, registered[2].thread_id,
                {projection_id = registered[2].projection_id})))
            db:release()
        end)

        test.it("convergence reports a failed slot and continues to the next candidate", function()
            local db = assert(sql.get("app:db"))
            local thread_id = thread_with_events(db, 1)
            local registered = {}
            for i = 1, 2 do
                registered[i] = assert(writer.register_projection(db, thread_id, {
                    kind = "wake-row-failure", projection_key = tostring(i),
                    worker_ref = "func://app:test_count_worker", system_identity = true,
                }))
                test.is_nil(select(2, db:execute("UPDATE kickside_job SET wake_enabled=FALSE,scheduled_at=NULL WHERE id=$1",
                    {registered[i].job_id})))
            end
            table.sort(registered, function(a, b) return a.job_id < b.job_id end)
            local cause = errors.new({kind = errors.UNAVAILABLE, message = "slot transaction refused", retryable = false,
                details = {code = "wake_transaction_refused", nested = {preserved = true}}})
            local first = true
            local failing_slot: any = {
                type = function(self) return db:type() end,
                query = function(self, statement, args) return db:query(statement, args) end,
                execute = function(self, statement, args) return db:execute(statement, args) end,
                begin = function(self)
                    if first then first = false; return nil, cause end
                    return db:begin()
                end,
            }
            local skipped = {}
            local healed, err = writer.converge(failing_slot, skipped)
            test.is_nil(err)
            test.is_true(healed >= 1)
            test.eq(#skipped, 1)
            test.eq(skipped[1].cursor_id, registered[1].cursor_id)
            test.eq(skipped[1].error.kind, cause:kind())
            test.eq(skipped[1].error.retryable, false)
            test.eq(skipped[1].error.details.code, "wake_transaction_refused")
            test.is_true(skipped[1].error.details.nested.preserved)
            test.not_nil(read(db, "SELECT scheduled_at FROM kickside_job WHERE id=$1", {registered[2].job_id}).scheduled_at)
            for _, row in ipairs(registered) do
                test.is_nil(select(2, writer.remove_projection(db, thread_id, {projection_id = row.projection_id})))
            end
            db:release()
        end)

        test.it("refuses a corrupt stored projection body with native metadata and preserves its durable state", function()
            for _, raw in ipairs({"false", "7", '"text"', "null"}) do
                local db = assert(sql.get("app:db"))
                local thread_id = thread_with_events(db, 1)
                local options = {kind = "stored-body-integrity", worker_ref = "func://app:test_count_worker",
                    worker_input_mode = "prefetch_events", system_identity = true}
                local registered, register_err = writer.register_projection(db, thread_id, options)
                test.is_nil(register_err)
                test.not_nil(registered)
                local _, seed_err = db:execute("UPDATE kickside_projection SET body=$1 WHERE id=$2",
                    {raw, registered.projection_id})
                test.is_nil(seed_err)
                local before = read(db, "SELECT generation,last_seq,job_id,status FROM kickside_projection_cursor WHERE id=$1",
                    {registered.cursor_id})
                local result, err = writer.register_projection(db, thread_id, options)
                test.is_nil(result)
                test.is_true(errors.is(err, errors.INTERNAL))
                test.eq(err:retryable(), false)
                test.eq(err:details().code, "persisted_data")
                test.eq(err:details().error_kind, "persisted_data")
                test.eq(err:details().field, "kickside_projection.body")
                local projection = read(db, "SELECT body FROM kickside_projection WHERE id=$1", {registered.projection_id})
                local after = read(db, "SELECT generation,last_seq,job_id,status FROM kickside_projection_cursor WHERE id=$1",
                    {registered.cursor_id})
                local _, release_err = db:release()
                test.is_nil(release_err)
                test.eq(projection.body, raw)
                for _, key in ipairs({"generation", "last_seq", "job_id", "status"}) do test.eq(after[key], before[key]) end
            end
        end)

        test.it("refuses a corrupt source body without committing a fold or advancing the cursor", function()
            for _, raw in ipairs({ "false", "7", '"text"', "null" }) do
                local db = assert(sql.get("app:db"))
                local thread_id = thread_with_events(db, 1, raw)
                local registered, register_err = writer.register_projection(db, thread_id, {
                    kind = "source-body-integrity", worker_ref = "func://app:test_count_worker",
                    worker_input_mode = "prefetch_events", system_identity = true,
                })
                test.is_nil(register_err)
                db:release()
                if type(registered.job_id) ~= "string" then error("registered projection has no job id") end
                local job = claim_slot(registered.job_id)
                local result, run_err = invoke.run(input_for(job, registered.cursor_id))
                test.is_nil(result)
                test.is_true(errors.is(run_err, errors.INTERNAL))
                test.eq(run_err:details().error_kind, "persisted_data")
                db = assert(sql.get("app:db"))
                local cursor = read(db, "SELECT last_seq,status FROM kickside_projection_cursor WHERE id=$1", { registered.cursor_id })
                local projection = read(db, "SELECT last_event_seq,body FROM kickside_projection WHERE id=$1", { registered.projection_id })
                local event = read(db, "SELECT body FROM kickside_event WHERE thread_id=$1", { thread_id })
                db:release()
                test.eq(tonumber(cursor.last_seq), 0)
                test.eq(cursor.status, "active")
                test.eq(tonumber(projection.last_event_seq), 0)
                test.eq(event.body, raw)
                local cancelled, cancel_err = jobs.cancel(registered.job_id)
                test.is_nil(cancel_err)
                test.is_true(cancelled.canceled)
            end
        end)

        test.it("records a deterministic worker failure on its projection and stops re-running it", function()
            local db = assert(sql.get("app:db"))
            local thread_id = thread_with_events(db, 1)
            local registered, register_err = writer.register_projection(db, thread_id, {
                kind = "failing-deterministic", worker_ref = "func://app:test_failing_worker",
                system_identity = true, worker_config = { kind = errors.INVALID, message = "bad declaration" },
            })
            test.is_nil(register_err)
            if not registered then error("projection is not registered") end
            db:release()
            local cursor_id = tostring(registered.cursor_id)
            db = assert(sql.get("app:db"))
            test.eq(read(db, "SELECT state FROM kickside_projection WHERE id=$1", { registered.projection_id }).state, "pending")
            db:release()
            local job = claim_slot(registered.job_id)

            local result, run_err = invoke.run(input_for(job, cursor_id))
            test.is_nil(run_err)
            test.is_true(result.self_completed)
            test.is_true(result.invalid)

            db = assert(sql.get("app:db"))
            local cursor = read(db, "SELECT status,last_error,last_seq FROM kickside_projection_cursor WHERE id=$1", { cursor_id })
            test.eq(cursor.status, "invalid")
            test.contains(tostring(cursor.last_error), "bad declaration")
            test.eq(tonumber(cursor.last_seq), 0)
            test.eq(read(db, "SELECT state FROM kickside_projection WHERE id=$1", { registered.projection_id }).state, "invalid")
            local slot = read(db, "SELECT status,scheduled_at,wake_enabled FROM kickside_job WHERE id=$1", { registered.job_id })
            test.eq(slot.status, "pending")
            test.is_nil(slot.scheduled_at)
            test.is_false(slot.wake_enabled == true or tonumber(slot.wake_enabled) == 1)
            test.eq(tonumber(read(db, "SELECT COUNT(*) AS n FROM kickside_job_run WHERE job_id=$1 AND status='failed'",
                { registered.job_id }).n), 1)
            db:release()
            local health, health_err = jobs.health()
            test.is_nil(health_err)
            test.is_true(health.pending_jobs >= 1)
            test.is_nil(health.failed_slots)
            for _, issue in ipairs(health.issues) do test.is_true(issue.code ~= "slots_failed") end
            db = assert(sql.get("app:db"))

            append_event(db, thread_id, 2)
            test.is_nil(read(db, "SELECT scheduled_at FROM kickside_job WHERE id=$1", { registered.job_id }).scheduled_at)
            test.eq(read(db, "SELECT status FROM kickside_projection_cursor WHERE id=$1", { cursor_id }).status, "invalid")
            test.eq(tonumber(read(db, "SELECT COUNT(*) AS n FROM kickside_job_run WHERE job_id=$1 AND status='failed'",
                { registered.job_id }).n), 1)
            test.is_nil(read(db, "SELECT scheduled_at FROM kickside_job WHERE id=$1", { registered.job_id }).scheduled_at)

            -- An explicit reset of the corrected declaration replays the failed range.
            local _, fix_err = writer.register_projection(db, thread_id, {
                kind = "failing-deterministic", worker_ref = "func://app:test_count_worker", reset = true,
                worker_input_mode = "prefetch_events", system_identity = true,
            })
            test.is_nil(fix_err)
            local healed = read(db, "SELECT status,last_error FROM kickside_projection_cursor WHERE id=$1", { cursor_id })
            test.eq(healed.status, "active")
            test.is_nil(healed.last_error)
            test.eq(read(db, "SELECT state FROM kickside_projection WHERE id=$1", { registered.projection_id }).state, "pending")
            test.not_nil(read(db, "SELECT scheduled_at FROM kickside_job WHERE id=$1", { registered.job_id }).scheduled_at)
            db:release()
            local repaired_job = claim_slot(registered.job_id)
            local repaired, repaired_err = invoke.run(input_for(repaired_job, cursor_id))
            test.is_nil(repaired_err)
            test.is_true(repaired.self_completed)
            db = assert(sql.get("app:db"))
            local model = read(db, "SELECT state,last_event_seq,body FROM kickside_projection WHERE id=$1", { registered.projection_id })
            test.eq(model.state, "valid")
            test.eq(tonumber(model.last_event_seq), 2)
            test.eq(json.decode(model.body).stats.count, 2)
            local removed, remove_err = writer.remove_projection(db, thread_id, { projection_id = registered.projection_id })
            test.is_nil(remove_err)
            test.eq(removed.removed_cursors, 1)
            local rows, query_err = db:query("SELECT id FROM kickside_projection WHERE id=$1", { registered.projection_id })
            test.is_nil(query_err)
            test.eq(#rows, 0)
            db:release()
        end)

        test.it("resumes an active cursor whose identity refusal disabled its slot", function()
            local db = assert(sql.get("app:db"))
            local thread_id = thread_with_events(db, 1)
            local registered = assert(writer.register_projection(db, thread_id, {
                kind = "identity-refusal-recovery", worker_ref = "func://app:test_count_worker",
                worker_input_mode = "prefetch_events", system_identity = true,
            }))
            db:release()
            local job = claim_slot(registered.job_id)
            db = assert(sql.get("app:db"))
            -- Drive exactly the Jobs transition used by an identity refusal.
            test.is_nil(job_lifecycle.fail_job(db, job, tostring(db:type()),
                "recorded authorizer no longer has root ADMIN", "deterministic"))
            append_event(db, thread_id, 2)
            local parked = read(db, "SELECT scheduled_at,wake_enabled FROM kickside_job WHERE id=$1", {job.id})
            test.is_nil(parked.scheduled_at)
            test.is_false(parked.wake_enabled == true or tonumber(parked.wake_enabled) == 1)
            local before = read(db, "SELECT generation,last_seq FROM kickside_projection_cursor WHERE id=$1", {registered.cursor_id})
            local resumed, resume_err = writer.resume(db, thread_id, {cursor_id = registered.cursor_id})
            test.is_nil(resume_err)
            test.eq(resumed.status, "active")
            local slot = read(db, "SELECT scheduled_at,wake_enabled,attempts FROM kickside_job WHERE id=$1", {job.id})
            local after = read(db, "SELECT generation,last_seq FROM kickside_projection_cursor WHERE id=$1", {registered.cursor_id})
            db:release()
            test.not_nil(slot.scheduled_at)
            test.is_true(slot.wake_enabled == true or tonumber(slot.wake_enabled) == 1)
            test.eq(tonumber(slot.attempts), 0)
            test.eq(tonumber(after.generation), tonumber(before.generation))
            test.eq(tonumber(after.last_seq), tonumber(before.last_seq))
            local repaired = claim_slot(job.id)
            local result, run_err = invoke.run(input_for(repaired, registered.cursor_id))
            test.is_nil(run_err)
            test.eq(result.last_seq, 2)
            db = assert(sql.get("app:db"))
            local model = read(db, "SELECT body FROM kickside_projection WHERE id=$1", {registered.projection_id})
            test.eq(json.decode(model.body).stats.count, 2)
            local removed, remove_err = writer.remove_projection(db, thread_id, {projection_id = registered.projection_id})
            test.is_nil(remove_err)
            test.not_nil(removed)
            db:release()
        end)

        test.it("keeps an infrastructure failure active, visible and retried", function()
            local db = assert(sql.get("app:db"))
            local thread_id = thread_with_events(db, 1)
            local registered, register_err = writer.register_projection(db, thread_id, {
                kind = "failing-infrastructure", worker_ref = "func://app:test_failing_worker",
                system_identity = true, worker_config = { kind = errors.UNAVAILABLE, message = "provider down", retryable = true,
                    details = {code = "projection_provider_unavailable", reason = "provider_busy", provider = {retry_after = 7}} },
            })
            test.is_nil(register_err)
            if not registered then error("projection is not registered") end
            local _, bound_err = db:execute("UPDATE kickside_job SET max_attempts=1 WHERE id=$1", { registered.job_id })
            test.is_nil(bound_err)
            db:release()
            local cursor_id = tostring(registered.cursor_id)
            local job = claim_slot(registered.job_id)

            local result, run_err = invoke.run(input_for(job, cursor_id))
            test.is_nil(result)
            test.not_nil(run_err)
            test.eq(run_err:kind(), errors.UNAVAILABLE)
            test.is_true(run_err:retryable())
            test.eq(run_err:details().code, "projection_provider_unavailable")
            test.eq(run_err:details().provider.retry_after, 7)
            test.eq(run_err:details().reason, "worker_failed")
            test.eq(run_err:details().cause.details.reason, "provider_busy")

            db = assert(sql.get("app:db"))
            local dbtype = tostring(db:type())
            local cursor = read(db, "SELECT status,last_error FROM kickside_projection_cursor WHERE id=$1", { cursor_id })
            test.eq(cursor.status, "active")
            test.contains(tostring(cursor.last_error), "provider down")
            -- The slot retries past max_attempts: a slot is not bounded by it.
            test.is_nil(job_lifecycle.fail_job(db, job, dbtype, tostring(run_err), "infrastructure"))
            local slot = read(db, "SELECT status,scheduled_at,last_error FROM kickside_job WHERE id=$1", { registered.job_id })
            test.eq(slot.status, "pending")
            test.not_nil(slot.scheduled_at)
            test.contains(tostring(slot.last_error), "provider down")
            db:release()
        end)
    end)
end

return { run = test.run_cases(define_tests) }
