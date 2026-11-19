local test = require("test")
local sql = require("sql")
local time = require("time")
local channel = require("channel")
local claim = require("claim")
local lifecycle = require("lifecycle")
local slot_purge = require("slot_purge")
local claim_execution = require("claim_execution")
local retention = require("retention")
local config = require("config")
local uuid = require("uuid")
local jobs = require("jobs")
local thread_fence = require("thread_fence")
local thread_teardown = require("thread_teardown")
local job_fixture = require("job_fixture")

local function open_db(): sql.DB
    local db, err = sql.get("app:db")
    if not db then error("test database unavailable: " .. tostring(err)) end
    if err or not db then error("thread teardown DB unavailable: " .. tostring(err)) end
    return db :: sql.DB
end

local function waits_for(db: sql.DB, backend_id: number, settled: () -> boolean): boolean
    for _ = 1, 500 do
        if settled() then return false end
        local rows = assert(db:query([[SELECT count(*) AS n FROM pg_stat_activity
            WHERE datname=current_database() AND $1::integer=ANY(pg_blocking_pids(pid))]], { backend_id }))
        if tonumber(rows[1].n) > 0 then return true end
        time.sleep("10ms")
    end
    return false
end

local function define_tests()
    test.describe("jobs-owned thread cleanup", function()
        local function independent_link(thread_id, owner_id, key)
            return {
                namespace = "thread", scope = thread_id, key = key, thread_id = thread_id,
                owner_locator = { kind = "user", id = owner_id }, job_type = "test.cleanup_callback",
                immutable_payload = { callback = key },
            }
        end

        test.it("preserves independent callback admission without linking to a finished cleanup", function()
            local db = open_db()
            local thread_id, user_id = uuid.v7(), uuid.v7()
            local dbtype = tostring(db:type())
            local tx = assert(db:begin())
            local early = assert(jobs.enqueue_tx(tx, dbtype, independent_link(thread_id, user_id, "early")))
            assert(tx:commit())
            test.eq(assert(jobs.get_job(early.id)).thread_id, thread_id)
            local before = assert(db:query("SELECT 1 FROM kickside_job_thread_cleanup WHERE thread_id=$1", {thread_id}))
            test.eq(#before, 0)

            test.is_true(assert(jobs.cleanup_thread_page(thread_id, 0)).done)
            assert(jobs.ack_thread_cleanup_page(thread_id, 0, true))
            local late_request = independent_link(thread_id, user_id, "late")
            local late = assert(jobs.enqueue(late_request))
            local replay = assert(jobs.enqueue(late_request))
            test.eq(replay.id, late.id)
            test.is_true(replay.existing)
            local linked_tx = assert(db:begin())
            local late_tx = assert(jobs.enqueue_tx(linked_tx, dbtype, independent_link(thread_id, user_id, "late-tx")))
            assert(linked_tx:commit())

            for _, id in ipairs({early.id, late.id, late_tx.id}) do
                local row = assert(jobs.get_job(id))
                test.eq(row.owner_kind, "user")
                test.eq(row.owner_id, user_id)
                test.is_nil(row.thread_id)
                test.eq(row.status, "pending")
            end
            db:release()
        end)

        test.it("retries concurrent linked work and cleanup without waiting on the other transaction", function()
            local db = open_db()
            local dbtype = tostring(db:type())
            if dbtype ~= sql.type.POSTGRES then db:release(); return end
            local thread_id, user_id = uuid.v7(), uuid.v7()
            local early = independent_link(thread_id, user_id, "early-busy")
            local late = independent_link(thread_id, user_id, "late-busy")
            local enqueue_tx = assert(db:begin())
            local queued = assert(jobs.enqueue_tx(enqueue_tx, dbtype, early))
            local page, cleanup_err = jobs.cleanup_thread_page(thread_id, 0)
            test.is_nil(page)
            test.is_true(cleanup_err:retryable())
            test.eq(cleanup_err:details().code, "job_thread_link_busy")
            test.is_true(cleanup_err:details().cleanup_pending)
            assert(enqueue_tx:commit())
            test.eq(assert(jobs.get_job(queued.id)).thread_id, thread_id)

            local cleanup_tx = assert(db:begin())
            test.is_true(assert(thread_teardown.page_tx(cleanup_tx, dbtype, thread_id, 0)).done)
            local admission, enqueue_err = jobs.enqueue(late)
            test.is_nil(admission)
            test.is_true(enqueue_err:retryable())
            test.eq(enqueue_err:details().code, "job_thread_link_busy")
            assert(cleanup_tx:commit())

            local retried = assert(jobs.enqueue(late))
            test.is_nil(assert(jobs.get_job(queued.id)).thread_id)
            test.is_nil(assert(jobs.get_job(retried.id)).thread_id)
            assert(jobs.ack_thread_cleanup_page(thread_id, 0, true))
            db:release()
        end)

        test.it("acquires the durable cleanup fence in one round trip and preserves its state", function()
            local db = open_db()
            local tx, begin_err = db:begin()
            test.is_nil(begin_err)
            local reads = 0
            local function observe() reads = reads + 1 end
            local probe = job_fixture.observe_tx(tx, observe, observe)
            local id = uuid.v7()
            local state, fence_err = thread_fence.lock(probe, id)
            local first_reads = reads
            local _, update_err = tx:execute("UPDATE kickside_job_thread_cleanup SET started=TRUE,next_page_seq=7 WHERE thread_id=$1", { id })
            local held, held_err = thread_fence.lock(probe, id)
            tx:rollback()
            db:release()
            test.is_nil(fence_err)
            test.not_nil(state)
            test.is_false(state.started)
            test.is_nil(update_err)
            test.is_nil(held_err)
            test.is_true(held.started)
            test.eq(tonumber(held.next_page_seq), 7)
            test.eq(first_reads, 1)
            test.eq(reads, 2)
        end)

        test.it("rechecks the completed fence before reclaiming jobs after candidate discovery", function()
            local db = open_db()
            local dbtype = tostring(db:type())
            local thread_id, stale_id = uuid.v7(), uuid.v7()
            test.is_true(assert(jobs.cleanup_thread_page(thread_id, 0)).done)
            assert(jobs.ack_thread_cleanup_page(thread_id, 0, true))
            assert(db:execute([[INSERT INTO kickside_job
                (id,job_type,job_identity,owner_kind,owner_id,status)
                VALUES ($1,'test.cleanup',$2,'thread',$3,'done')]], { stale_id, stale_id, thread_id }))
            local replacement_job = ""
            local observed: any = {
                query = function(_, statement: string, args: { any })
                    local rows = assert(db:query(statement, args))
                    local candidate
                    for _, row in ipairs(rows) do
                        if row.thread_id == thread_id then candidate = row end
                    end
                    test.is_true(candidate and (candidate.eligible == true or candidate.eligible == 1))

                    -- Another sweep and a successful replacement commit before the old
                    -- candidate takes its lock.
                    test.is_true(assert(thread_teardown.reclaim_completed(db, dbtype, 100)) >= 1)
                    local tx = assert(db:begin())
                    assert(tx:execute([[INSERT INTO kickside_thread
                        (id,thread_class,component_id,event_count) VALUES ($1,'jobs-cleanup',$2,0)]],
                        { thread_id, thread_id }))
                    test.eq(assert(thread_teardown.prepare_replacement_tx(tx, dbtype, thread_id)), 1)
                    assert(tx:commit())
                    replacement_job = assert(jobs.enqueue({
                        namespace = "thread", scope = thread_id, key = "replacement",
                        owner_locator = { kind = "thread", id = thread_id }, job_type = "test.cleanup",
                        immutable_payload = {},
                    })).id
                    return { candidate }, nil
                end,
                begin = function() return db:begin() end,
            }
            test.eq(assert(thread_teardown.reclaim_completed(observed, dbtype, 100)), 0)
            test.eq(#assert(db:query("SELECT id FROM kickside_job WHERE id=$1", { replacement_job })), 1)
            db:release()
        end)

        test.it("commits a truthful retained-row receipt when a competing detach follows discovery", function()
            local db = open_db()
            local dbtype, type_err = db:type()
            test.is_nil(type_err)
            local thread_id, owner_id, job_id = uuid.v7(), uuid.v7(), uuid.v7()
            local _, thread_err = db:execute([[INSERT INTO kickside_thread
                (id,thread_class,component_id,event_count) VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id })
            test.is_nil(thread_err, tostring(thread_err))
            local _, job_err = db:execute([[INSERT INTO kickside_job
                (id,thread_id,job_type,job_identity,owner_kind,owner_id,status)
                VALUES ($1,$2,'test.thread_cleanup',$3,'automation',$4,'done')]],
                { job_id, thread_id, "retained-race:" .. job_id, owner_id })
            test.is_nil(job_err, tostring(job_err))
            local competing: sql.DB? = nil
            if dbtype == sql.type.POSTGRES then competing = open_db() end
            local detached = false
            local observed: any = {
                begin = function()
                    local tx, begin_err = db:begin()
                    if begin_err or not tx then return tx, begin_err end
                    return job_fixture.observe_tx(tx, function(statement)
                        if dbtype ~= sql.type.POSTGRES or detached
                            or statement:find("SELECT id FROM kickside_job WHERE", 1, true) ~= 1
                            or not statement:find("AND NOT (owner_kind='thread' AND owner_id=$2)", 1, true) then return end
                        local changed, detach_err = (competing :: sql.DB):execute([[UPDATE kickside_job SET thread_id=NULL
                            WHERE id=$1 AND thread_id=$2]], { job_id, thread_id })
                        test.is_nil(detach_err, tostring(detach_err))
                        test.eq(tonumber(changed.rows_affected), 1)
                        detached = true
                    end), nil
                end,
            }
            local page, page_err = thread_teardown.page(observed, dbtype, thread_id, 0)
            if competing then competing:release() end
            test.is_nil(page_err, tostring(page_err))
            test.not_nil(page)
            test.eq(detached, dbtype == sql.type.POSTGRES)
            test.eq(page.processed, detached and 0 or 1)
            test.is_true(page.done)
            local receipt, receipt_err = db:query([[SELECT processed,done FROM kickside_job_thread_cleanup_receipt
                WHERE thread_id=$1 AND page_seq=0]], { thread_id })
            test.is_nil(receipt_err, tostring(receipt_err))
            test.eq(#receipt, 1)
            test.eq(tonumber(receipt[1].processed), page.processed)
            test.is_true(receipt[1].done == true or receipt[1].done == 1)
            local retained, retained_err = db:query("SELECT thread_id,owner_kind,owner_id,status FROM kickside_job WHERE id=$1", { job_id })
            test.is_nil(retained_err, tostring(retained_err))
            test.eq(#retained, 1)
            test.is_nil(retained[1].thread_id)
            test.eq(retained[1].owner_kind, "automation")
            test.eq(retained[1].owner_id, owner_id)
            test.eq(retained[1].status, "done")
            local _, delete_receipt_err = db:execute("DELETE FROM kickside_job_thread_cleanup_receipt WHERE thread_id=$1", { thread_id })
            test.is_nil(delete_receipt_err, tostring(delete_receipt_err))
            local _, delete_fence_err = db:execute("DELETE FROM kickside_job_thread_cleanup WHERE thread_id=$1", { thread_id })
            test.is_nil(delete_fence_err, tostring(delete_fence_err))
            local _, delete_job_err = db:execute("DELETE FROM kickside_job WHERE id=$1", { job_id })
            test.is_nil(delete_job_err, tostring(delete_job_err))
            local _, delete_thread_err = db:execute("DELETE FROM kickside_thread WHERE id=$1", { thread_id })
            test.is_nil(delete_thread_err, tostring(delete_thread_err))
            db:release()
        end)

        for _, operation in ipairs({ "slot purge", "unstarted assignment release", "age retention" }) do
            test.it("serializes " .. operation .. " with a discovered cleanup page", function()
                local db = open_db()
                local dbtype = tostring(db:type())
                local thread_id = uuid.v7()
                local _, thread_err = db:execute([[INSERT INTO kickside_thread
                    (id,thread_class,component_id,event_count) VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id })
                test.is_nil(thread_err)
                local identity = { namespace = "test", scope = thread_id, key = "cleanup-slot" }
                local job_id, enqueue_err = lifecycle.enqueue_job(db, dbtype, {
                    owner_locator = { kind = "thread", id = thread_id }, job_identity = identity,
                    job_type = "test.cleanup_slot", slot = true, parked = true,
                })
                test.is_nil(enqueue_err)
                local worker_id = "cleanup-worker-" .. thread_id
                local compete = function(): (any, error?) return slot_purge.purge_slot(identity) end
                if operation == "unstarted assignment release" then
                    local assignment, lease_err = job_fixture.lease_own(db, dbtype, job_id)
                    test.is_nil(lease_err)
                    if not assignment then error("cleanup race requires a leased assignment") end
                    local run, run_err = lifecycle.start_job_run(db, dbtype, assignment, worker_id, 1)
                    test.is_nil(run_err)
                    if not run then error("cleanup race requires an unstarted run") end
                    compete = function(): (any, error?)
                        local other = open_db()
                        local value, release_err = claim_execution.release_unstarted(other, assignment, worker_id, run.id)
                        other:release()
                        return value, release_err
                    end
                elseif operation == "age retention" then
                    local _, age_err = db:execute("UPDATE kickside_job SET status='done', finished_at=$1 WHERE id=$2",
                        { "2000-01-01T00:00:00Z", job_id })
                    test.is_nil(age_err)
                    compete = function(): (any, error?)
                        local other = open_db()
                        local value, prune_err = retention.prune_jobs(other, thread_id, "2001-01-01T00:00:00Z", 10)
                        other:release()
                        return value, prune_err
                    end
                end
                local candidate_prefix = operation == "unstarted assignment release"
                    and "SELECT id,job_id FROM kickside_job_run WHERE owner_kind="
                    or "SELECT id FROM kickside_job WHERE owner_kind="
                local done = channel.new(1)
                local started, finished, waiting = false, false, false
                local parent_selection_bounded = false
                local observed: any = { begin = function()
                    local tx, begin_err = db:begin()
                    if begin_err or not tx then return tx, begin_err end
                    local backend_id = 0
                    if dbtype == sql.type.POSTGRES then
                        local rows, pid_err = tx:query("SELECT pg_backend_pid() AS pid")
                        test.is_nil(pid_err)
                        backend_id = assert(tonumber(rows[1].pid))
                    end
                    return job_fixture.observe_tx(tx, function(statement)
                        if statement:find("SELECT id", 1, true) == 1
                            and statement:find("FROM kickside_job WHERE owner_kind=", 1, true) then
                            parent_selection_bounded = not statement:find("FROM kickside_job_run", 1, true)
                        end
                        if started or dbtype ~= sql.type.POSTGRES
                            or statement:find(candidate_prefix, 1, true) ~= 1 then return end
                        started = true
                        coroutine.spawn(function()
                            local value, err = compete()
                            finished = true
                            done:send({ value = value, err = err })
                        end)
                        waiting = waits_for(db, backend_id, function() return finished end)
                    end), nil
                end }
                local page, page_err = thread_teardown.page(observed, dbtype, thread_id, 0)
                local competed
                if started then
                    local completion = channel.select({ done:case_receive(), time.after("10s"):case_receive() })
                    test.eq(completion.channel, done, "competing operation settles after cleanup")
                    competed = completion.value
                else
                    local value, err = compete()
                    competed = { value = value, err = err }
                end
                local details = page_err and page_err:details()
                test.is_nil(page_err, tostring(page_err) .. " " .. tostring(details and details.field))
                local processed = operation == "unstarted assignment release" and 2 or 1
                test.not_nil(page)
                test.eq(page.processed, processed)
                test.eq(page.discarded.kickside_job, 1)
                if operation == "unstarted assignment release" then test.eq(page.discarded.kickside_job_run, 1) end
                test.is_true(page.done)
                test.is_true(parent_selection_bounded, "the parent scope is bounded before probing its children")
                if dbtype == sql.type.POSTGRES then test.is_true(waiting, "competitor waits for the cleanup fence") end
                test.is_nil(competed.err, tostring(competed.err))
                if operation == "unstarted assignment release" then test.is_false(competed.value)
                else test.eq(competed.value, 0) end
                local receipt, receipt_err = db:query([[SELECT processed FROM kickside_job_thread_cleanup_receipt
                    WHERE thread_id=$1 AND page_seq=0]], { thread_id })
                test.is_nil(receipt_err)
                test.eq(tonumber(receipt[1].processed), processed)
                for _, name in ipairs({ "kickside_job_thread_cleanup_receipt", "kickside_job_thread_cleanup" }) do
                    local _, cleanup_err = db:execute("DELETE FROM " .. name .. " WHERE thread_id=$1", { thread_id })
                    test.is_nil(cleanup_err)
                end
                local _, delete_err = db:execute("DELETE FROM kickside_thread WHERE id=$1", { thread_id })
                test.is_nil(delete_err)
                db:release()
            end)
        end

        test.it("pages bounded cleanup with durable receipts and recovers a lost acknowledgment", function()
            local thread_id = uuid.v7()
            local db = open_db()
            local _, thread_err = db:execute([[INSERT INTO kickside_thread
                (id,thread_class,component_id,event_count) VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id })
            test.is_nil(thread_err, tostring(thread_err))
            for index = 1, 101 do
                local job_id = uuid.v7()
                local _, job_err = db:execute([[INSERT INTO kickside_job
                    (id,thread_id,job_type,job_identity,owner_kind,owner_id,status)
                    VALUES ($1,$2,'test.thread_cleanup',$3,'thread',$4,'pending')]],
                    { job_id, thread_id, "thread-cleanup:" .. job_id, thread_id })
                test.is_nil(job_err, tostring(job_err))
            end
            db:release()

            local first, apply_err = jobs.cleanup_thread_page(thread_id, 0)
            test.is_nil(apply_err, tostring(apply_err))
            test.not_nil(first)
            test.eq(first.processed, 100)
            test.is_false(first.done)
            test.eq(first.discarded.kickside_job, 100)
            test.eq(first.unresolved.kickside_job, 100)

            local replay, replay_err = jobs.cleanup_thread_page(thread_id, 0)
            test.is_nil(replay_err, tostring(replay_err))
            test.not_nil(replay)
            test.eq(replay.processed, first.processed)
            test.eq(replay.discarded.kickside_job, first.discarded.kickside_job)

            -- A next-page request proves Core committed the prior page. It
            -- acknowledges that receipt even if Core stopped before its
            -- explicit post-commit acknowledgment call.
            local final, final_err = jobs.cleanup_thread_page(thread_id, 1)
            test.is_nil(final_err, tostring(final_err))
            test.not_nil(final)
            test.eq(final.processed, 1)
            test.is_true(final.done)
            test.eq(final.discarded.kickside_job, 1)
            test.eq(final.unresolved.kickside_job, 1)
            local acknowledged, acknowledge_err = jobs.ack_thread_cleanup_page(thread_id, 1, true)
            test.is_nil(acknowledge_err, tostring(acknowledge_err))
            test.is_true(acknowledged)
            local repeated_ack, repeated_ack_err = jobs.ack_thread_cleanup_page(thread_id, 1, true)
            test.is_nil(repeated_ack_err, tostring(repeated_ack_err))
            test.is_true(repeated_ack)

            local verify = open_db()
            local jobs_left, jobs_err = verify:query("SELECT id FROM kickside_job WHERE thread_id=$1", { thread_id })
            test.is_nil(jobs_err, tostring(jobs_err))
            test.eq(#jobs_left, 0)
            local receipts, receipt_err = verify:query([[SELECT page_seq,acknowledged_at,processed,done
                FROM kickside_job_thread_cleanup_receipt WHERE thread_id=$1 ORDER BY page_seq]], { thread_id })
            test.is_nil(receipt_err, tostring(receipt_err))
            test.eq(#receipts, 2)
            test.not_nil(receipts[1].acknowledged_at)
            test.not_nil(receipts[2].acknowledged_at)
            test.eq(tonumber(receipts[1].processed), 100)
            test.eq(tonumber(receipts[2].processed), 1)
            local fence, read_err = verify:query([[SELECT started,completed_at FROM kickside_job_thread_cleanup
                WHERE thread_id=$1]], { thread_id })
            test.is_nil(read_err, tostring(read_err))
            test.not_nil(fence[1].completed_at)
            local remaining, remaining_err = verify:query([[SELECT COUNT(*) AS n FROM kickside_job
                WHERE owner_kind='thread' AND owner_id=$1]], { thread_id })
            test.is_nil(remaining_err, tostring(remaining_err))
            test.eq(tonumber(remaining[1].n), 0)
            verify:execute("DELETE FROM kickside_job_thread_cleanup_receipt WHERE thread_id=$1", { thread_id })
            local no_fence, no_fence_err = verify:execute([[DELETE FROM kickside_job_thread_cleanup
                WHERE thread_id=$1]], { thread_id })
            test.is_nil(no_fence_err, tostring(no_fence_err))
            test.eq(tonumber(no_fence.rows_affected), 1)
            local no_thread_rows, no_thread_err = verify:execute("DELETE FROM kickside_thread WHERE id=$1", { thread_id })
            test.is_nil(no_thread_err, tostring(no_thread_err))
            test.eq(tonumber(no_thread_rows.rows_affected), 1)
            verify:release()
        end)

        -- Projection slots carry their owner thread only as owner_kind/owner_id.
        local function insert_owned_slot(db: sql.DB, thread_id: string): string
            local job_id = uuid.v7()
            local _, job_err = db:execute([[INSERT INTO kickside_job
                (id,thread_id,job_type,job_identity,owner_kind,owner_id,status,slot,execution_seq)
                VALUES ($1,NULL,'test.owned_slot',$2,'thread',$3,'pending',TRUE,1)]],
                { job_id, "owned-slot:" .. job_id, thread_id })
            if job_err then error("owned slot insert failed: " .. tostring(job_err)) end
            local _, run_err = db:execute([[INSERT INTO kickside_job_run
                (id,job_id,thread_id,job_type,attempt_no,execution_seq,status,owner_kind,owner_id)
                VALUES ($1,$2,NULL,'test.owned_slot',1,1,'completed','thread',$3)]], { uuid.v7(), job_id, thread_id })
            if run_err then error("owned run insert failed: " .. tostring(run_err)) end
            return job_id
        end

        local function owned_count(db: sql.DB, thread_id: string): integer
            local rows, err = db:query([[SELECT (SELECT COUNT(*) FROM kickside_job WHERE owner_kind='thread' AND owner_id=$1)
                + (SELECT COUNT(*) FROM kickside_job_run WHERE owner_kind='thread' AND owner_id=$1) AS n]], { thread_id })
            if err or not rows then error("owned count failed: " .. tostring(err)) end
            return math.floor(tonumber(rows[1].n) or -1)
        end

        local function forget_thread(db: sql.DB, thread_id: string)
            db:execute("DELETE FROM kickside_job_thread_cleanup_receipt WHERE thread_id=$1", { thread_id })
            db:execute("DELETE FROM kickside_job_thread_cleanup WHERE thread_id=$1", { thread_id })
            db:execute("DELETE FROM kickside_thread WHERE id=$1", { thread_id })
        end

        for _, operation in ipairs({ "run start", "completion" }) do
            test.it("keeps a surviving claim detached across cleanup pages during " .. operation, function()
                local db = open_db()
                local dbtype = tostring(db:type())
                local thread_id, owner_id = uuid.v7(), uuid.v7()
                local job_type = "test.thread_cleanup." .. owner_id
                assert(db:execute([[INSERT INTO kickside_thread (id,thread_class,component_id,event_count)
                    VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id }))
                local job_id = assert(lifecycle.enqueue_job(db, dbtype, {
                    thread_id = thread_id, owner_locator = { kind = "automation", id = owner_id },
                    job_type = job_type,
                    job_identity = { namespace = "test", scope = owner_id, key = "retained" },
                }))
                local tx = assert(db:begin())
                for seq = 2, 101 do
                    assert(tx:execute([[INSERT INTO kickside_job_run
                        (id,job_id,thread_id,job_type,attempt_no,execution_seq,status,owner_kind,owner_id)
                        VALUES ($1,$2,$3,'test.thread_cleanup',1,$4,'completed','automation',$5)]],
                        { uuid.v7(), job_id, thread_id, seq, owner_id }))
                end
                local _, commit_err = tx:commit()
                test.is_nil(commit_err)

                local job: any
                local function claim_survivor()
                    job = assert(claim.claim_batch(db, dbtype, 1, nil, nil, nil, { job_type }))[1]
                    test.eq(job.id, job_id)
                    test.eq(job.thread_id, thread_id)
                end
                if dbtype == sql.type.SQLITE then claim_survivor() end
                local function compete(): (any, error?)
                    if operation == "completion" then
                        return jobs.complete(job_id, { token = job.lease_token, execution_seq = job.execution_seq }, {})
                    end
                    return lifecycle.start_job_run(db, dbtype, job, "cleanup-race", 1)
                end
                local finished, waiting = false, false
                local done = channel.new(1)
                local observed: any = { begin = function()
                    local page_tx = assert(db:begin())
                    if dbtype == sql.type.SQLITE then return page_tx, nil end
                    local pid = assert(tonumber(assert(page_tx:query("SELECT pg_backend_pid() AS pid"))[1].pid))
                    return job_fixture.observe_tx(page_tx, function(statement)
                        if statement:find("SELECT id FROM kickside_job WHERE thread_id", 1, true) == 1 then
                            claim_survivor()
                        end
                        if not statement:find("UPDATE kickside_job SET thread_id=NULL", 1, true) then return end
                        coroutine.spawn(function()
                            local value, err = compete()
                            finished = true
                            done:send({ value = value, err = err })
                        end)
                        waiting = waits_for(db, pid, function() return finished end)
                    end), nil
                end }
                local first = assert(thread_teardown.page(observed, dbtype, thread_id, 0))
                test.eq(first.processed, 100)
                test.is_false(first.done)
                local parent = assert(db:query("SELECT thread_id FROM kickside_job WHERE id=$1", { job_id }))
                test.is_nil(parent[1].thread_id, "the parent is detached before its run links drain")
                if dbtype == sql.type.POSTGRES then
                    test.is_true(waiting, "the competing writer waits for parent detachment")
                    local event = channel.select({ done:case_receive(), time.after("10s"):case_receive() })
                    test.eq(event.channel, done)
                    test.is_nil(event.value.err, tostring(event.value.err))
                    test.not_nil(event.value.value)
                else
                    assert(compete())
                end
                local history = assert(db:query([[SELECT thread_id,owner_kind,owner_id,status FROM kickside_job_run
                    WHERE job_id=$1 AND execution_seq=$2]], { job_id, job.execution_seq }))
                test.eq(#history, 1)
                test.is_nil(history[1].thread_id)
                test.eq(history[1].owner_kind, "automation")
                test.eq(history[1].owner_id, owner_id)
                test.eq(history[1].status, operation == "run start" and "running" or "completed")
                local last = assert(jobs.cleanup_thread_page(thread_id, 1))
                test.eq(last.processed, 1)
                test.is_true(last.done)
                test.is_nil(last.discarded.kickside_job_run)
                local counts = assert(db:query([[SELECT count(*) AS n FROM kickside_job_run
                    WHERE job_id=$1 AND thread_id IS NULL]], { job_id }))
                test.eq(tonumber(counts[1].n), 101)
                assert(db:execute("DELETE FROM kickside_job WHERE id=$1", { job_id }))
                forget_thread(db, thread_id)
                db:release()
            end)
        end

        test.it("counts a completing owned run by the status actually discarded", function()
            local db = open_db()
            local dbtype = tostring(db:type())
            local thread_id = uuid.v7()
            local job_type = "test.thread_cleanup." .. thread_id
            assert(db:execute([[INSERT INTO kickside_thread (id,thread_class,component_id,event_count)
                VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id }))
            local job_id = assert(lifecycle.enqueue_job(db, dbtype, {
                thread_id = thread_id, owner_locator = { kind = "thread", id = thread_id },
                job_type = job_type,
                job_identity = { namespace = "test", scope = thread_id, key = "owned" },
            }))
            local job = assert(claim.claim_batch(db, dbtype, 1, nil, nil, nil, { job_type }))[1]
            test.eq(job.id, job_id)
            assert(lifecycle.start_job_run(db, dbtype, job, "cleanup-race", 1))
            local completed = false
            local function complete()
                assert(jobs.complete(job_id, { token = job.lease_token, execution_seq = job.execution_seq }, {}))
                completed = true
            end
            -- SQLite serializes the completion writer before the cleanup transaction.
            if dbtype == sql.type.SQLITE then complete() end
            local observed: any = { begin = function()
                local tx = assert(db:begin())
                return job_fixture.observe_tx(tx, function(statement)
                    if not completed and statement:find("FROM kickside_job_run WHERE owner_kind=", 1, true) then
                        complete()
                    end
                end), nil
            end }
            local page = assert(thread_teardown.page(observed, dbtype, thread_id, 0))
            test.is_true(completed)
            test.eq(page.processed, 2)
            test.is_true(page.done)
            test.eq(page.discarded.kickside_job, 1)
            test.eq(page.discarded.kickside_job_run, 1)
            test.is_nil(page.unresolved.kickside_job)
            test.is_nil(page.unresolved.kickside_job_run)
            forget_thread(db, thread_id)
            db:release()
        end)

        test.it("removes a thread's owner-only slot and its runs before reporting done", function()
            local thread_id = uuid.v7()
            local db = open_db()
            local _, thread_err = db:execute([[INSERT INTO kickside_thread
                (id,thread_class,component_id,event_count) VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id })
            test.is_nil(thread_err, tostring(thread_err))
            insert_owned_slot(db, thread_id)
            db:release()

            local page, page_err = jobs.cleanup_thread_page(thread_id, 0)
            test.is_nil(page_err, tostring(page_err))
            test.is_true(page.done)
            test.eq(page.discarded.kickside_job, 1)
            test.eq(page.discarded.kickside_job_run, 1)
            local verify = open_db()
            test.eq(owned_count(verify, thread_id), 0)
            forget_thread(verify, thread_id)
            verify:release()
        end)

        test.it("removes owned rows left behind after a thread's cleanup completed", function()
            local thread_id = uuid.v7()
            local db = open_db()
            local _, thread_err = db:execute([[INSERT INTO kickside_thread
                (id,thread_class,component_id,event_count) VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id })
            test.is_nil(thread_err, tostring(thread_err))
            db:release()
            local page, page_err = jobs.cleanup_thread_page(thread_id, 0)
            test.is_nil(page_err, tostring(page_err))
            test.is_true(page.done)
            local acknowledged, ack_err = jobs.ack_thread_cleanup_page(thread_id, 0, true)
            test.is_nil(ack_err, tostring(ack_err))
            test.is_true(acknowledged)

            -- The shape a teardown that selected owned rows by thread_id left.
            db = open_db()
            insert_owned_slot(db, thread_id)
            db:release()
            local swept, sweep_err = jobs.retention_sweep()
            test.is_nil(sweep_err, tostring(sweep_err))
            test.is_true(swept.thread_cleanup_leftovers >= 2)
            local verify = open_db()
            test.eq(owned_count(verify, thread_id), 0)
            forget_thread(verify, thread_id)
            verify:release()
        end)

        for _, limit in ipairs({1, 100}) do
            test.it("drains retained links after a full completed-owner batch of " .. limit, function()
                local db = open_db()
                local dbtype = tostring(db:type())
                local thread_id, job_id, run_id, owner_id = uuid.v7(), uuid.v7(), uuid.v7(), uuid.v7()
                assert(jobs.cleanup_thread_page(thread_id, 0))
                assert(jobs.ack_thread_cleanup_page(thread_id, 0, true))

                local tx = assert(db:begin())
                -- Place this owner first in the scan; earlier suites may
                -- have created completed fences without any leftovers.
                local completed_at = "1900-01-01T00:00:00Z"
                assert(tx:execute("UPDATE kickside_job_thread_cleanup SET completed_at=$1 WHERE thread_id=$2",
                    { completed_at, thread_id }))
                for _ = 1, limit do
                    local id = uuid.v7()
                    assert(tx:execute([[INSERT INTO kickside_job
                        (id,job_type,job_identity,owner_kind,owner_id,status)
                        VALUES ($1,'test.thread_cleanup',$2,'thread',$3,'pending')]], { id, id, thread_id }))
                end
                assert(tx:execute([[INSERT INTO kickside_job
                    (id,thread_id,job_type,job_identity,owner_kind,owner_id,status,slot)
                    VALUES ($1,$2,'test.thread_cleanup',$3,'automation',$4,'pending',TRUE)]],
                    { job_id, thread_id, job_id, owner_id }))
                assert(tx:execute([[INSERT INTO kickside_job_run
                    (id,job_id,thread_id,job_type,attempt_no,execution_seq,status,owner_kind,owner_id)
                    VALUES ($1,$2,$3,'test.thread_cleanup',1,1,'completed','automation',$4)]],
                    { run_id, job_id, thread_id, owner_id }))
                assert(tx:commit())

                local processed, cursor = 0, nil
                for _ = 1, 3 do
                    local count, scan_err, next_cursor = thread_teardown.reclaim_completed(db, dbtype, limit, cursor)
                    test.is_nil(scan_err)
                    test.is_true(count <= limit)
                    processed = processed + count
                    cursor = next_cursor
                end
                test.eq(processed, limit + 2)
                test.eq(assert(thread_teardown.reclaim_completed(db, dbtype, limit)), 0)
                test.eq(owned_count(db, thread_id), 0)
                local retained = assert(db:query([[SELECT j.thread_id,r.thread_id AS run_thread_id,j.owner_id,j.status
                    FROM kickside_job j JOIN kickside_job_run r ON r.job_id=j.id WHERE j.id=$1]], { job_id }))
                test.eq(#retained, 1)
                test.is_nil(retained[1].thread_id)
                test.is_nil(retained[1].run_thread_id)
                test.eq(retained[1].owner_id, owner_id)
                test.eq(retained[1].status, "pending")
                assert(db:execute("DELETE FROM kickside_job WHERE id=$1", { job_id }))
                forget_thread(db, thread_id)
                db:release()
            end)
        end

        test.it("detaches a surviving run when the remaining owned job reaches its TTL", function()
            local db = open_db()
            local dbtype = tostring(db:type())
            local thread_id, job_id, run_id, owner_id = uuid.v7(), uuid.v7(), uuid.v7(), uuid.v7()
            local limit = assert(config.policy()).thread_cleanup_batch
            assert(jobs.cleanup_thread_page(thread_id, 0))
            assert(jobs.ack_thread_cleanup_page(thread_id, 0, true))

            local tx = assert(db:begin())
            for _ = 1, limit do
                local id = uuid.v7()
                assert(tx:execute([[INSERT INTO kickside_job
                    (id,job_type,job_identity,owner_kind,owner_id,status,finished_at)
                    VALUES ($1,'test.thread_cleanup',$2,'thread',$3,'done',CURRENT_TIMESTAMP)]], {id, id, thread_id}))
            end
            assert(tx:execute([[INSERT INTO kickside_job
                (id,thread_id,job_type,job_identity,owner_kind,owner_id,status,slot)
                VALUES ($1,$2,'test.thread_cleanup',$3,'automation',$4,'pending',TRUE)]],
                {job_id, thread_id, job_id, owner_id}))
            assert(tx:execute([[INSERT INTO kickside_job_run
                (id,job_id,thread_id,job_type,attempt_no,execution_seq,status,owner_kind,owner_id,finished_at)
                VALUES ($1,$2,$3,'test.thread_cleanup',1,1,'completed','automation',$4,CURRENT_TIMESTAMP)]],
                {run_id, job_id, thread_id, owner_id}))
            assert(tx:commit())

            local first = assert(retention.sweep(db, dbtype))
            local remaining = owned_count(db, thread_id)
            assert(db:execute([[UPDATE kickside_job SET finished_at=$1
                WHERE owner_kind='thread' AND owner_id=$2]], {"2000-01-01T00:00:00Z", thread_id}))
            local second = assert(retention.sweep(db, dbtype))
            local final_count = owned_count(db, thread_id)
            local retained = assert(db:query([[SELECT j.thread_id,r.thread_id AS run_thread_id,j.owner_id,j.status
                FROM kickside_job j JOIN kickside_job_run r ON r.job_id=j.id WHERE j.id=$1]], {job_id}))[1]
            assert(db:execute("DELETE FROM kickside_job WHERE id=$1", {job_id}))
            forget_thread(db, thread_id)
            db:release()

            test.eq(first.thread_cleanup_leftovers, limit)
            test.is_true(remaining > 0)
            test.is_true(second.jobs + second.thread_cleanup_leftovers >= remaining)
            test.eq(final_count, 0)
            test.not_nil(retained)
            test.is_nil(retained.thread_id)
            test.is_nil(retained.run_thread_id)
            test.eq(retained.owner_id, owner_id)
            test.eq(retained.status, "pending")
        end)

        test.it("preserves surviving-owner jobs and reports only discarded evidence", function()
            local thread_id, owner_id = uuid.v7(), uuid.v7()
            local job_id, run_id = uuid.v7(), uuid.v7()
            local db = open_db()
            local _, thread_err = db:execute([[INSERT INTO kickside_thread
                (id,thread_class,component_id,event_count) VALUES ($1,'jobs-cleanup',$2,0)]], { thread_id, thread_id })
            test.is_nil(thread_err, tostring(thread_err))
            local _, job_err = db:execute([[INSERT INTO kickside_job
                (id,thread_id,job_type,job_identity,owner_kind,owner_id,status)
                VALUES ($1,$2,'test.thread_cleanup',$3,'automation',$4,'pending')]],
                { job_id, thread_id, "external-cleanup:" .. job_id, owner_id })
            test.is_nil(job_err, tostring(job_err))
            local _, run_err = db:execute([[INSERT INTO kickside_job_run
                (id,job_id,thread_id,job_type,attempt_no,execution_seq,status,owner_kind,owner_id)
                VALUES ($1,$2,$3,'test.thread_cleanup',1,1,'running','automation',$4)]],
                { run_id, job_id, thread_id, owner_id })
            test.is_nil(run_err, tostring(run_err))
            db:release()

            local page, page_err = jobs.cleanup_thread_page(thread_id, 0)
            test.is_nil(page_err, tostring(page_err))
            test.not_nil(page)
            test.is_true(page.done)
            test.eq(page.processed, 2)
            test.is_nil(page.discarded.kickside_job)
            test.is_nil(page.discarded.kickside_job_run)
            test.is_nil(page.unresolved.kickside_job)
            test.is_nil(page.unresolved.kickside_job_run)
            local acknowledged, acknowledge_err = jobs.ack_thread_cleanup_page(thread_id, 0, true)
            test.is_nil(acknowledge_err, tostring(acknowledge_err))
            test.is_true(acknowledged)

            local verify = open_db()
            local rows, read_err = verify:query([[SELECT j.thread_id,j.status,r.thread_id AS run_thread_id,
                r.status AS run_status FROM kickside_job j
                JOIN kickside_job_run r ON r.job_id=j.id
                WHERE j.id=$1]], { job_id })
            test.is_nil(read_err, tostring(read_err))
            test.eq(#rows, 1)
            test.is_nil(rows[1].thread_id)
            test.is_nil(rows[1].run_thread_id)
            test.eq(rows[1].status, "pending")
            test.eq(rows[1].run_status, "running")
            verify:execute("DELETE FROM kickside_job_thread_cleanup_receipt WHERE thread_id=$1", { thread_id })
            verify:execute("DELETE FROM kickside_job_run WHERE id=$1", { run_id })
            verify:execute("DELETE FROM kickside_job WHERE id=$1", { job_id })
            verify:execute("DELETE FROM kickside_job_thread_cleanup WHERE thread_id=$1", { thread_id })
            verify:execute("DELETE FROM kickside_thread WHERE id=$1", { thread_id })
            verify:release()
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

local function run(options)
    return run_cases(options)
end

return { run = run }
