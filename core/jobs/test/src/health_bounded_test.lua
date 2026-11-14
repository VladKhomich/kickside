-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local jobs = require("jobs")
local fixture = require("fixture")
local migration = require("health_migration")
local eligibility = require("eligibility")
local query_jobs = require("query_jobs")
local query_fixture = require("query_fixture")

local function plan(db: sql.DB, dbtype: string, statement: string, params: table?): string
    local rows = assert(db:query((dbtype == sql.type.POSTGRES and "EXPLAIN (COSTS OFF) " or "EXPLAIN QUERY PLAN ") .. statement, params or {}))
    local lines: {string} = {}
    for _, row in ipairs(rows) do
        for _, value in pairs(row) do if type(value) == "string" then lines[#lines+1] = value end end
    end
    return table.concat(lines, "\n")
end

local function queue(fn: (sql.DB, string) -> ())
    local db, dbtype, err = fixture.private_queue("app:private_queue_health_bounded")
    if err or not db then error(err) end
    local ok, test_err = pcall(fn, db, dbtype)
    local _, release_err = db:release()
    if not ok then error(test_err) end
    if release_err then error(release_err) end
end

local function numbers(dbtype: string, total: integer): string
    return dbtype == sql.type.POSTGRES and "SELECT generate_series(1," .. tostring(total) .. ") AS n"
        or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<" .. tostring(total) .. ") SELECT n FROM seq"
end

local function seed(db: sql.DB, dbtype: string, total: integer)
    if total == 0 then return end
    local id = dbtype == sql.type.POSTGRES and "md5(n::text)::uuid" or "printf('%032d',n)"
    assert(db:execute([[INSERT INTO kickside_job (id,owner_kind,owner_id,job_type,status,job_identity,last_error)
        SELECT ]] .. id .. ",'test','health','test.health','pending',CAST(n AS TEXT),'failed' FROM (" .. numbers(dbtype,total) .. ") numbered"))
end

local function issue(health: table, code: string): table?
    for _, row in ipairs(health.issues) do if row.code == code then return row end end
    return nil
end

return {run = test.run_cases(function()
    test.describe("bounded Jobs diagnostics", function()
        test.it("seeks legacy concurrency keys during capacity eligibility", function()
            queue(function(db, dbtype)
                seed(db, dbtype, 10000)
                assert(db:execute("UPDATE kickside_job SET status='running',capacity_group='capacity',concurrency_key=job_identity"))
                assert(db:execute("ANALYZE kickside_job"))
                local statement = "SELECT 1 FROM (SELECT CAST('absent' AS TEXT) AS concurrency_key,CAST('capacity' AS TEXT) AS capacity_group) j WHERE "
                    .. eligibility.available_key("'running'", "j")
                test.eq(#assert(db:query(statement)),1)
                local explain = plan(db, dbtype, statement)
                if dbtype == sql.type.SQLITE then
                    test.is_true(explain:find("uq_kickside_job_running_legacy_concurrency",1,true) ~= nil, explain)
                else
                    test.is_true(explain:find("Index Cond: (concurrency_key",1,true) ~= nil, explain)
                end
            end)
        end)
        test.it("seeks the due deadline when a registered worker has only future jobs", function()
            queue(function(db, dbtype)
                seed(db, dbtype, 100000)
                assert(db:execute("UPDATE kickside_job SET job_type='app:capacity_worker_a',scheduled_at='2099-01-01 00:00:00',concurrency_key=job_identity,capacity_group='app.capacity'"))
                assert(db:execute("ANALYZE kickside_job"))
                local observed = ""
                local observed_params: table = {}
                local recording: any = {query = function(_, statement: string, params: table): (table?, error?)
                    observed, observed_params = statement, params
                    return db:query(statement, params)
                end}
                local pending, err = eligibility.pending(recording, dbtype, nil, {
                    catalog = function(): (table, nil) return {["app:capacity_worker_a"]="app.capacity"}, nil end,
                    group = function(): (nil, error) error("future jobs must not resolve capacity") end,
                })
                test.is_nil(err)
                test.not_nil(pending)
                local start = assert((observed:find(" SELECT c.worker_ref,",1,true)))
                local existence = assert((observed:find("FROM capacity_workers c WHERE EXISTS",1,true)))
                local statement = observed:sub(1,start-1) .. " SELECT c.worker_ref " .. observed:sub(existence)
                test.eq(#assert(db:query(statement, observed_params)),0)
                local explain = plan(db, dbtype, statement, observed_params)
                if dbtype == sql.type.SQLITE then
                    test.is_true(explain:find("scheduled_at<?",1,true) ~= nil, explain)
                else
                    test.is_true(explain:find("Index Cond:",1,true) ~= nil, explain)
                    test.is_true(explain:find("scheduled_at <=",1,true) ~= nil, explain)
                end
                test.eq(assert(jobs.health()).due_unclaimed_count,0)
            end)
        end)
        test.it("reads parked slots independently of unrelated pending jobs", function()
            queue(function(db, dbtype)
                seed(db, dbtype, 100000)
                assert(db:execute("ANALYZE kickside_job"))
                query_fixture.reset("",nil)
                query_fixture.dbtype = dbtype
                assert(query_jobs.health())
                local failed_query = query_fixture.queries[5]
                local slot_plan = plan(db, dbtype, failed_query.statement, failed_query.params)
                if dbtype == sql.type.SQLITE then
                    test.is_true(slot_plan:find("idx_job_health_slots",1,true) ~= nil, slot_plan)
                else
                    test.is_true(slot_plan:find("Seq Scan on kickside_job j",1,true) == nil, slot_plan)
                    test.is_true(slot_plan:find("Index",1,true) ~= nil, slot_plan)
                end
                test.eq(assert(jobs.health()).failed_slots,0)
            end)
        end)
        test.it("counts failed current slots through execution identity without scanning historical failures", function()
            queue(function(db, dbtype)
                seed(db, dbtype, 1)
                assert(db:execute("UPDATE kickside_job SET slot=TRUE,execution_seq=100001"))
                local run_id = dbtype == sql.type.POSTGRES and "md5(n::text)::uuid" or "printf('%032d',n)"
                assert(db:execute([[INSERT INTO kickside_job_run(id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status)
                    SELECT ]] .. run_id .. ",j.id,j.owner_kind,j.owner_id,j.job_type,n,n,'failed' FROM ("
                    .. numbers(dbtype,100000) .. ") numbered CROSS JOIN kickside_job j"))
                assert(db:execute("ANALYZE kickside_job"))
                assert(db:execute("ANALYZE kickside_job_run"))
                query_fixture.reset("",nil)
                query_fixture.dbtype = dbtype
                assert(query_jobs.health())
                local failed_query = query_fixture.queries[5]
                test.eq(assert(db:query(failed_query.statement, failed_query.params))[1].n,0)
                local explain = plan(db, dbtype, failed_query.statement, failed_query.params)
                test.is_true(explain:find(dbtype == sql.type.SQLITE and "job_id=? AND execution_seq=?"
                    or "(job_id = j.id) AND (execution_seq = j.execution_seq)",1,true) ~= nil, explain)
                test.eq(assert(jobs.health()).failed_slots,0)
                assert(db:execute("UPDATE kickside_job SET execution_seq=100000"))
                test.eq(assert(jobs.health()).failed_slots,1)
            end)
        end)
        test.it("keeps bounded health discovery ordered by worker without sorting the due queue", function()
            queue(function(db, dbtype)
                seed(db, dbtype, 100000)
                assert(db:execute("UPDATE kickside_job SET job_type='app:capacity_worker_a',scheduled_at='2000-01-01 00:00:00',concurrency_key=job_identity,capacity_group='app.capacity',last_error=NULL"))
                assert(db:execute("ANALYZE kickside_job"))
                local recorded: {table} = {}
                local recording: any = {query = function(_, statement: string, params: table): (table?, error?)
                    recorded[#recorded+1] = {statement=statement,params=params}
                    return db:query(statement,params)
                end}
                local backlog = assert(eligibility.due_backlog(recording,dbtype,1,nil,1000))
                test.eq(backlog.count,1000)
                test.is_true(backlog.capped)
                if dbtype == sql.type.SQLITE then
                    local explain = plan(db,dbtype,recorded[1].statement,recorded[1].params)
                    test.is_true(explain:find("idx_job_capacity_due_time",1,true) ~= nil,explain)
                    test.is_true(explain:find("USE TEMP B-TREE FOR ORDER BY",1,true) == nil,explain)
                    explain = plan(db,dbtype,recorded[2].statement,recorded[2].params)
                    test.is_true(explain:find("SCAN running",1,true) == nil,explain)
                end
            end)
        end)
        test.it("caps current failed slots through an ordered read without sorting their population", function()
            queue(function(db, dbtype)
                seed(db,dbtype,100000)
                assert(db:execute("UPDATE kickside_job SET slot=TRUE,last_error=NULL"))
                assert(db:execute([[INSERT INTO kickside_job_run(id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status)
                    SELECT id,id,owner_kind,owner_id,job_type,1,execution_seq,'failed' FROM kickside_job]]))
                assert(db:execute("ANALYZE kickside_job"))
                assert(db:execute("ANALYZE kickside_job_run"))
                query_fixture.reset("",nil)
                query_fixture.dbtype=dbtype
                assert(query_jobs.health())
                local query=query_fixture.queries[5]
                local explain=plan(db,dbtype,query.statement,query.params)
                test.is_true(explain:find("Sort",1,true) == nil,explain)
                test.is_true(explain:find("USE TEMP B-TREE",1,true) == nil,explain)
                local health=assert(jobs.health())
                test.eq(health.failed_slots,1000)
                test.is_true(health.failed_slots_capped)
            end)
        end)
        test.it("caps counts independently from the stranded sample at the boundary", function()
            queue(function(db, dbtype)
                for _, total in ipairs({0, 16, 17, 1000, 1001}) do
                    assert(db:execute("DELETE FROM kickside_job"))
                    seed(db, dbtype, total)
                    local health = assert(jobs.health())
                    test.eq(health.degraded_jobs, math.min(total,1000))
                    test.eq(health.degraded_jobs_capped, total > 1000)
                    local stranded = issue(health, "stranded_jobs")
                    if total == 0 then test.is_nil(stranded) else
                        test.not_nil(stranded)
                        test.eq(stranded.count, math.min(total,1000))
                        test.eq(stranded.capped, total > 1000)
                        test.eq(#stranded.job_ids, math.min(total,16))
                        for index = 2, #stranded.job_ids do test.is_true(stranded.job_ids[index-1] < stranded.job_ids[index]) end
                    end
                end
            end)
        end)
        test.it("counts due and overdue matches before applying the cap", function()
            queue(function(db, dbtype)
                seed(db, dbtype, 1001)
                assert(db:execute("UPDATE kickside_job SET last_error=NULL,scheduled_at='2000-01-01 00:00:00'"))
                local health = assert(jobs.health())
                test.eq(health.due_unclaimed_count,1000)
                test.is_true(health.due_unclaimed_count_capped)
                test.eq(health.overdue_unclaimed_count,1000)
                test.is_true(health.overdue_unclaimed_count_capped)
                test.is_true(issue(health,"due_work_unclaimed").capped)
                test.is_true(health.due_unclaimed_oldest_age_ms > 700000000000)
                assert(db:execute("UPDATE kickside_job SET scheduled_at='2099-01-01 00:00:00' WHERE job_identity='1001'"))
                health = assert(jobs.health())
                test.eq(health.due_unclaimed_count,1000)
                test.is_false(health.due_unclaimed_count_capped)
                test.is_false(health.overdue_unclaimed_count_capped)
                assert(db:execute("UPDATE kickside_job SET concurrency_key='blocked' WHERE job_identity<>'1001'"))
                assert(db:execute("UPDATE kickside_job SET status='running',concurrency_key='blocked' WHERE job_identity='1001'"))
                local id = dbtype == sql.type.POSTGRES and "'ffffffff-ffff-ffff-ffff-ffffffffffff'" or "'available'"
                assert(db:execute([[INSERT INTO kickside_job (id,owner_kind,owner_id,job_type,status,job_identity,scheduled_at)
                    VALUES (]] .. id .. ",'test','health','test.health','pending','available','2001-01-01 00:00:00')"))
                health = assert(jobs.health())
                test.eq(health.due_unclaimed_count,1)
                test.is_false(health.due_unclaimed_count_capped)
                test.eq(health.overdue_unclaimed_count,1)
            end)
        end)
        test.it("caps expired leases and current failed slots without counting old runs", function()
            queue(function(db, dbtype)
                seed(db, dbtype, 1001)
                assert(db:execute("UPDATE kickside_job SET status='running',lease_until='2000-01-01 00:00:00'"))
                local health = assert(jobs.health())
                test.eq(health.expired_leases,1000)
                test.is_true(health.expired_leases_capped)
                assert(db:execute("UPDATE kickside_job SET status='pending',slot=TRUE,lease_until=NULL"))
                assert(db:execute([[INSERT INTO kickside_job_run (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status)
                    SELECT id,id,owner_kind,owner_id,job_type,1,execution_seq,'failed' FROM kickside_job]]))
                health = assert(jobs.health())
                test.eq(health.expired_leases,0)
                test.is_false(health.expired_leases_capped)
                test.eq(health.failed_slots,1000)
                test.is_true(health.failed_slots_capped)
                test.is_true(issue(health,"slots_failed").capped)
                assert(db:execute("UPDATE kickside_job SET execution_seq=execution_seq+1"))
                health = assert(jobs.health())
                test.eq(health.failed_slots,0)
                test.is_false(health.failed_slots_capped)
            end)
        end)
        test.it("caps worker and wake counts while retaining individual worker freshness and control age", function()
            queue(function(db, dbtype)
                local source = numbers(dbtype,1002)
                local id = dbtype == sql.type.POSTGRES and "LPAD(CAST(n AS TEXT),8,'0')" or "printf('%08d',n)"
                assert(db:execute([[INSERT INTO kickside_job_worker(id,registry_version)
                    SELECT ]] .. id .. ",'test' FROM (" .. source .. ") numbered"))
                assert(db:execute([[INSERT INTO kickside_job_worker_pulse(worker_id,registry_version,last_seen_at)
                    SELECT id,registry_version,'2099-01-01 00:00:00' FROM kickside_job_worker]]))
                assert(db:execute("UPDATE kickside_job_worker_pulse SET last_seen_at='2000-01-01 00:00:00' WHERE worker_id='00000001'"))
                assert(db:execute([[INSERT INTO kickside_wake_fanout(key,demand_generation,ack_generation)
                    SELECT CAST(n AS TEXT),1,0 FROM (]] .. numbers(dbtype,1001) .. ") numbered"))
                seed(db,dbtype,17)
                assert(db:execute("UPDATE kickside_job SET wake_control_pending=TRUE,updated_at='2000-01-01 00:00:00'"))
                -- The existing timestamp trigger owns updates on PostgreSQL; insert an older timestamp to test the age order.
                assert(db:execute("DELETE FROM kickside_job WHERE job_identity='17'"))
                local control_id = dbtype == sql.type.POSTGRES and "'ffffffff-ffff-ffff-ffff-ffffffffffff'" or "'control'"
                assert(db:execute([[INSERT INTO kickside_job(id,owner_kind,owner_id,job_type,status,job_identity,wake_control_pending,updated_at)
                    VALUES (]] .. control_id .. ",'test','health','test.health','pending','control',TRUE,'2000-01-01 00:00:00')"))
                local health = assert(jobs.health())
                test.eq(health.healthy_worker_count,1000)
                test.is_true(health.healthy_worker_count_capped)
                test.eq(#health.workers,256)
                test.is_false(health.workers[1].healthy)
                test.is_true(health.workers[2].healthy)
                test.eq(health.undelivered_wake_keys,1000)
                test.is_true(health.undelivered_wake_keys_capped)
                test.is_true(health.oldest_undelivered_control_wake_age_ms > 700000000000)
                assert(db:execute("UPDATE kickside_wake_fanout SET ack_generation=demand_generation"))
                assert(db:execute("UPDATE kickside_job SET wake_control_pending=FALSE"))
                health = assert(jobs.health())
                test.eq(health.undelivered_wake_keys,0)
                test.is_false(health.undelivered_wake_keys_capped)
                test.eq(health.oldest_undelivered_control_wake_age_ms,0)
            end)
        end)
        test.it("adds its read indexes idempotently to populated earlier schemas without rewriting data", function()
            queue(function(db,dbtype)
                seed(db,dbtype,17)
                local before = assert(db:query("SELECT * FROM kickside_job ORDER BY id"))
                local indexes = assert(db:query(dbtype == sql.type.POSTGRES
                    and "SELECT indexname AS name,indexdef AS definition FROM pg_indexes WHERE schemaname=current_schema()"
                    or "SELECT name,sql AS definition FROM sqlite_master WHERE type='index' AND sql IS NOT NULL"))
                local removed = 0
                for _, row in ipairs(indexes) do
                    local definition = string.lower(row.definition):gsub("[%s%(%)]", "")
                    if definition:find("last_errorisnotnull",1,true) or definition:find("capacity_group,scheduled_at",1,true)
                        or definition:find("btrim",1,true) or definition:find("wake_control_pending",1,true)
                        or definition:find("idx_job_capacity_invalid_key",1,true)
                        or definition:find("idx_job_capacity_due_time",1,true)
                        or definition:find("andslotand",1,true)
                        or definition:find("demand_generation>ack_generation",1,true) then
                        assert(db:execute("DROP INDEX " .. row.name))
                        removed = removed + 1
                    end
                end
                test.eq(removed,7)
                local up = migration[1].database_implementations[dbtype].up
                up(db)
                up(db)
                local after = assert(db:query("SELECT * FROM kickside_job ORDER BY id"))
                test.eq(#after,#before)
                for index,row in ipairs(before) do for key,value in pairs(row) do test.eq(after[index][key],value,key) end end
                test.eq(assert(jobs.health()).degraded_jobs,17)
            end)
        end)
    end)
end)}
