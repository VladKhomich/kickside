-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Per-type retention windows: retention.by_type overrides the global cutoffs
-- for its job types, and the global window governs every other type.
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local time = require("time")
local config = require("config")
local retention = require("retention")
local schedule = require("retention_schedule")
local job_fixture = require("job_fixture")

local DAY_MS = 86400000

local function required(value: any, err: error?): any
    if err then error(err) end
    if value == nil then error("retention by type test requires a result") end
    return value
end

local function days_ago(days: integer): string
    return time.now():add(-days * DAY_MS * time.MILLISECOND):format(time.RFC3339)
end

local function seed(db: any, job_type: string, total: integer, finished: string, runs: boolean, distinct_types: boolean?): string
    local owner = uuid.v7()
    local dbtype = tostring(db:type())
    local numbers = dbtype == sql.type.POSTGRES
        and "SELECT generate_series(1," .. tostring(total) .. ") AS n"
        or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<"
            .. tostring(total) .. ") SELECT n FROM seq"
    local id = dbtype == sql.type.POSTGRES and "md5($1::text || n::text)::uuid" or "lower(hex(randomblob(16)))"
    local stamp = dbtype == sql.type.POSTGRES and "$3::timestamptz" or "$3"
    local type_expr = distinct_types and "$2 || CAST(n AS TEXT)" or "$2"
    required(db:execute([[INSERT INTO kickside_job
        (id,owner_kind,owner_id,job_type,status,job_identity,finished_at)
        SELECT ]] .. id .. ",'test',$1," .. type_expr .. ",'done',CAST(n AS TEXT)," .. stamp
        .. " FROM (" .. numbers .. ") numbered", {owner, job_type, finished}))
    if runs then
        required(db:execute([[INSERT INTO kickside_job_run
            (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status,lease_token,started_at,finished_at)
            SELECT id,id,owner_kind,owner_id,job_type,1,1,'success','seed',finished_at,finished_at
            FROM kickside_job WHERE owner_id=$1]], {owner}))
    end
    return owner
end

local function remaining(db: any, table_name: string, owner: string): integer
    local rows = required(db:query("SELECT COUNT(*) AS n FROM " .. table_name .. " WHERE owner_id=$1", {owner}))
    return math.floor(tonumber(rows[1].n) :: number)
end

-- Runs body with the registered policy adjusted by tune; the sweep reads it
-- through config.policy exactly as the worker pool does.
local function with_policy(tune: (any) -> (), body: (any, any) -> ()): ()
    local queue, _, queue_err = job_fixture.private_queue("app:private_queue_retention_by_type")
    local db = required(queue, queue_err)
    local policy = required(config.policy())
    tune(policy)
    local original = config.policy
    config.policy = function() return config.copy(policy), nil end
    local ok, err = pcall(body, db, policy)
    config.policy = original
    db:release()
    if not ok then error(err) end
end

-- Drives the worker-pool schedule until the backlog drains and returns the
-- summed counts, the pass count and the largest single-pass counts.
local function drain(db: any, policy: any): (table, integer, table)
    local totals: any = {jobs = 0, job_runs = 0}
    local largest: any = {jobs = 0, job_runs = 0}
    local passes = 0
    local instant = time.now()
    local driver = schedule.new({policy = function() return policy, nil end,
        now = function() return instant end, sweep = function(cursor)
            local stats = required(retention.sweep(db, tostring(db:type()), cursor))
            for _, key in ipairs({"jobs", "job_runs"}) do
                totals[key] = totals[key] + stats[key]
                if stats[key] > largest[key] then largest[key] = stats[key] end
            end
            return stats, nil
        end})
    repeat
        driver.run(instant:unix_nano())
        passes = passes + 1
        test.is_true(passes < 1000, "retention never reaches its idle interval")
    until driver.deadline() > instant:unix_nano()
    return totals, passes, largest
end

local function define_tests()
    test.describe("retention windows per job type", function()
        test.it("keeps empty history on the appropriate bounded fast path", function()
            local function check(overrides, expected_discoveries, expected_selections)
                with_policy(function(policy)
                    policy.retention_by_type = overrides
                end, function(db, _)
                    local discoveries, selections = 0, 0
                    local probe = {
                        type = function() return db:type() end,
                        begin = function() return db:begin() end,
                        execute = function(_, statement, params) return db:execute(statement, params) end,
                        query = function(_, statement, params)
                            if string.find(statement, "WITH RECURSIVE types", 1, true) == 1 then
                                discoveries = discoveries + 1
                            elseif string.find(statement, "SELECT id,", 1, true) == 1
                                and (string.find(statement, "FROM kickside_job ", 1, true)
                                    or string.find(statement, "FROM kickside_job_run ", 1, true)) then
                                selections = selections + 1
                            end
                            return db:query(statement, params)
                        end,
                    }
                    local stats = required(retention.sweep(probe, tostring(db:type())))
                    test.eq(discoveries, expected_discoveries)
                    test.eq(selections, expected_selections)
                    test.eq(stats.jobs, 0)
                    test.eq(stats.job_runs, 0)
                    test.is_nil(stats.job_cursor)
                end)
            end
            check({}, 0, 2)
            check({["test.absent"] = {jobs_ms = DAY_MS, job_runs_ms = DAY_MS}}, 1, 0)
        end)

        test.it("bounds type discovery even when most types have no expired rows", function()
            with_policy(function(policy)
                policy.retention_batch = 10
                policy.retention_jobs_ms, policy.retention_job_runs_ms = 30 * DAY_MS, 30 * DAY_MS
                policy.retention_by_type = {["z.expired"] = {jobs_ms = DAY_MS, job_runs_ms = DAY_MS}}
            end, function(db, policy)
                local retained = seed(db, "a.retained.", 1024, days_ago(0), true, true)
                local expired = seed(db, "z.expired", 1, days_ago(5), true)
                local run_only = seed(db, "z.running", 1, days_ago(40), true)
                required(db:execute("UPDATE kickside_job SET status='running',finished_at=NULL WHERE owner_id=$1", {run_only}))
                local discovered, selections = 0, 0
                local probe = {
                    type = function() return db:type() end,
                    begin = function() return db:begin() end,
                    execute = function(_, statement, params) return db:execute(statement, params) end,
                    query = function(_, statement, params)
                        local rows, err = db:query(statement, params)
                        if string.find(statement, "WITH RECURSIVE types", 1, true) == 1 then
                            discovered = discovered + #required(rows, err)
                        elseif string.find(statement, "SELECT id,", 1, true) == 1
                            and string.find(statement, "job_type = ", 1, true) then
                            selections = selections + 1
                        end
                        return rows, err
                    end,
                }
                local stats = required(retention.sweep(probe, tostring(db:type())))
                test.is_true(discovered <= policy.retention_batch + 1 and selections <= policy.retention_batch * 2,
                    "one sweep materialized " .. tostring(discovered) .. " types and selected across "
                        .. tostring(selections) .. " type ranges")
                test.not_nil(stats.job_cursor, "the next batch of stored types must remain reachable")
                local totals = drain(db, policy)
                test.eq(totals.jobs, 1)
                test.eq(totals.job_runs, 2)
                test.eq(remaining(db, "kickside_job", retained), 1024)
                test.eq(remaining(db, "kickside_job_run", retained), 1024)
                test.eq(remaining(db, "kickside_job", expired), 0)
                test.eq(remaining(db, "kickside_job", run_only), 1)
                test.eq(remaining(db, "kickside_job_run", run_only), 0)
            end)
        end)

        test.it("reaches another type while the first keeps a full run backlog", function()
            with_policy(function(policy)
                policy.retention_batch = 10
                policy.retention_jobs_ms, policy.retention_job_runs_ms = 30 * DAY_MS, 30 * DAY_MS
                policy.retention_by_type = {["a.hot"] = {jobs_ms = DAY_MS, job_runs_ms = DAY_MS}}
            end, function(db, policy)
                local later = seed(db, "z.expired", 1, days_ago(45), true)
                local cursor = nil
                for pass = 1, 4 do
                    seed(db, "a.hot", policy.retention_batch, days_ago(45), true)
                    local stats = required(retention.sweep(db, tostring(db:type()), cursor))
                    test.is_true(stats.job_runs <= policy.retention_batch)
                    test.is_true(stats.jobs <= policy.retention_batch)
                    if pass == 1 then test.eq(stats.jobs, policy.retention_batch, "full run page still gives jobs a turn") end
                    cursor = stats.job_cursor
                end
                test.eq(remaining(db, "kickside_job_run", later), 0, "later type run progresses")
                test.eq(remaining(db, "kickside_job", later), 0, "later type job progresses")
            end)
        end)

        test.it("purges an overridden type by its shorter window and keeps other types", function()
            with_policy(function(policy)
                policy.retention_jobs_ms, policy.retention_job_runs_ms = 30 * DAY_MS, 30 * DAY_MS
                policy.retention_by_type = {["test.short"] = {jobs_ms = DAY_MS, job_runs_ms = DAY_MS}}
            end, function(db, policy)
                local short = seed(db, "test.short", 3, days_ago(10), true)
                local other = seed(db, "test.other", 3, days_ago(10), true)
                local totals = drain(db, policy)
                test.eq(totals.jobs, 3)
                test.eq(totals.job_runs, 3)
                test.eq(remaining(db, "kickside_job", short), 0, "the override window purges its type")
                test.eq(remaining(db, "kickside_job_run", short), 0)
                test.eq(remaining(db, "kickside_job", other), 3, "the global window keeps other types")
                test.eq(remaining(db, "kickside_job_run", other), 3)
            end)
        end)

        test.it("keeps an overridden type with a longer window past the global cutoff", function()
            with_policy(function(policy)
                policy.retention_jobs_ms, policy.retention_job_runs_ms = DAY_MS, DAY_MS
                policy.retention_by_type = {["test.long"] = {jobs_ms = 30 * DAY_MS, job_runs_ms = 30 * DAY_MS}}
            end, function(db, policy)
                local long = seed(db, "test.long", 3, days_ago(10), true)
                local expired = seed(db, "test.long", 2, days_ago(40), true)
                local other = seed(db, "test.other", 3, days_ago(10), true)
                local totals = drain(db, policy)
                test.eq(totals.jobs, 5)
                test.eq(totals.job_runs, 5)
                test.eq(remaining(db, "kickside_job", long), 3, "the global cutoff never purges an overridden type")
                test.eq(remaining(db, "kickside_job_run", long), 3)
                test.eq(remaining(db, "kickside_job", expired), 0, "the override window still expires its type")
                test.eq(remaining(db, "kickside_job_run", expired), 0)
                test.eq(remaining(db, "kickside_job", other), 0, "the default pass purges types without an override")
                test.eq(remaining(db, "kickside_job_run", other), 0)
            end)
        end)

        test.it("applies a job_runs override independently of the job window", function()
            with_policy(function(policy)
                policy.retention_jobs_ms, policy.retention_job_runs_ms = 30 * DAY_MS, 30 * DAY_MS
                policy.retention_by_type = {["test.runs"] = {jobs_ms = 30 * DAY_MS, job_runs_ms = DAY_MS}}
            end, function(db, policy)
                local runs = seed(db, "test.runs", 3, days_ago(10), true)
                local other = seed(db, "test.other", 3, days_ago(10), true)
                local totals = drain(db, policy)
                test.eq(totals.job_runs, 3)
                test.eq(totals.jobs, 0)
                test.eq(remaining(db, "kickside_job_run", runs), 0, "the run override purges run history")
                test.eq(remaining(db, "kickside_job", runs), 3, "the job window keeps the jobs")
                test.eq(remaining(db, "kickside_job_run", other), 3)
                test.eq(remaining(db, "kickside_job", other), 3)
            end)
        end)

        test.it("bounds each pass by one batch across overrides and continues until drained", function()
            with_policy(function(policy)
                policy.retention_batch = 5
                policy.retention_jobs_ms, policy.retention_job_runs_ms = DAY_MS, DAY_MS
                policy.retention_by_type = {
                    ["test.first"] = {jobs_ms = 20 * DAY_MS, job_runs_ms = 20 * DAY_MS},
                    ["test.second"] = {jobs_ms = 30 * DAY_MS, job_runs_ms = 30 * DAY_MS},
                }
            end, function(db, policy)
                local expired = {
                    seed(db, "test.first", 7, days_ago(40), true),
                    seed(db, "test.second", 7, days_ago(40), true),
                    seed(db, "test.other", 7, days_ago(10), true),
                }
                local kept = {seed(db, "test.first", 3, days_ago(10), true), seed(db, "test.second", 3, days_ago(10), true)}
                local totals, passes, largest = drain(db, policy)
                test.eq(totals.jobs, 21)
                test.eq(totals.job_runs, 21)
                test.is_true(largest.jobs <= policy.retention_batch, "a sweep deletes more jobs than one batch")
                test.is_true(largest.job_runs <= policy.retention_batch, "a sweep deletes more runs than one batch")
                test.is_true(passes >= 5, "a full batch continues before the idle interval")
                for _, owner in ipairs(expired) do
                    test.eq(remaining(db, "kickside_job", owner), 0)
                    test.eq(remaining(db, "kickside_job_run", owner), 0)
                end
                for _, owner in ipairs(kept) do
                    test.eq(remaining(db, "kickside_job", owner), 3, "override windows keep in-window rows")
                    test.eq(remaining(db, "kickside_job_run", owner), 3)
                end
            end)
        end)

        test.it("pages across blocked history and carries the remaining candidate budget across types", function()
            with_policy(function(policy)
                policy.retention_batch = 5
                policy.retention_jobs_ms, policy.retention_job_runs_ms = 30 * DAY_MS, 30 * DAY_MS
                policy.retention_by_type = { ["test.second"] = {jobs_ms = 10 * DAY_MS, job_runs_ms = 10 * DAY_MS} }
            end, function(db, policy)
                local blocked = seed(db, "test.first", 7, days_ago(40), true)
                required(db:execute([[UPDATE kickside_job_run SET status='running', finished_at=NULL WHERE owner_id=$1]],
                    {blocked}))
                local first = seed(db, "test.first", 2, days_ago(35), false)
                local second = seed(db, "test.second", 5, days_ago(20), false)
                local selected = 0
                local probe = {
                    type = function() return db:type() end,
                    begin = function() return db:begin() end,
                    execute = function(_, statement, params) return db:execute(statement, params) end,
                    query = function(_, statement, params)
                        local rows, err = db:query(statement, params)
                        if string.find(statement, "SELECT id,owner_kind,owner_id", 1, true) == 1 then
                            selected = selected + #required(rows, err)
                        end
                        return rows, err
                    end,
                }
                local dbtype = tostring(db:type())
                local stats = required(retention.sweep(probe, dbtype))
                test.eq(selected, policy.retention_batch)
                test.eq(stats.jobs, 0)
                test.not_nil(stats.job_cursor, "a fully blocked page still continues")

                selected = 0
                stats = required(retention.sweep(probe, dbtype, stats.job_cursor))
                test.eq(selected, policy.retention_batch, "blocked candidates consume the shared batch budget")
                test.eq(stats.jobs, 3)
                test.not_nil(stats.job_cursor)
                test.eq(remaining(db, "kickside_job", first), 0)
                test.eq(remaining(db, "kickside_job", second), 4)

                selected = 0
                stats = required(retention.sweep(probe, dbtype, stats.job_cursor))
                test.eq(selected, 4)
                test.eq(stats.jobs, 4)
                test.is_nil(stats.job_cursor)
                test.eq(remaining(db, "kickside_job", second), 0)
                test.eq(remaining(db, "kickside_job", blocked), 7)
                test.eq(remaining(db, "kickside_job_run", blocked), 7)
            end)
        end)

        test.it("bounds the default pass when a longer override retains rows past the global cutoff", function()
            with_policy(function(policy)
                policy.retention_jobs_ms, policy.retention_job_runs_ms = DAY_MS, DAY_MS
                policy.retention_by_type = {["test.long"] = {jobs_ms = 30 * DAY_MS, job_runs_ms = 30 * DAY_MS}}
            end, function(db, policy)
                local dbtype = tostring(db:type())
                local retained = policy.retention_batch * 4
                local long = seed(db, "test.long", retained, days_ago(10), true)
                local other = seed(db, "test.other", 3, days_ago(10), true)
                required(db:execute("ANALYZE kickside_job"))
                required(db:execute("ANALYZE kickside_job_run"))
                local checked = 0
                local probe = {
                    type = function() return db:type() end,
                    begin = function() return db:begin() end,
                    execute = function(_, statement, params) return db:execute(statement, params) end,
                    query = function(_, statement, params)
                        local candidates = string.find(statement, "SELECT id,", 1, true) == 1
                        local enumeration = string.find(statement, "WITH RECURSIVE", 1, true) == 1
                        if not candidates and not enumeration then return db:query(statement, params) end
                        checked = checked + 1
                        if dbtype == sql.type.SQLITE then
                            local plan = required(db:query("EXPLAIN QUERY PLAN " .. statement, params))
                            local ranged = false
                            for _, row in ipairs(plan) do
                                local detail = tostring(row.detail)
                                if string.find(detail, "_type_retention (job_type=?", 1, true) then ranged = true end
                                test.is_true(string.find(detail, "SCAN ", 1, true) ~= 1 or detail == "SCAN CONSTANT ROW"
                                    or detail == "SCAN types", "a sweep read scans a retained table: " .. detail)
                            end
                            if candidates then
                                test.is_true(ranged, "candidates read one job type's expiration range: " .. statement)
                            end
                        else
                            local plan = required(db:query("EXPLAIN (ANALYZE, BUFFERS) " .. statement, params))
                            for _, row in ipairs(plan) do
                                local detail = tostring(row["QUERY PLAN"])
                                local examined, loops = string.match(detail, "actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                                if examined then
                                    test.is_true(required(tonumber(examined)) * required(tonumber(loops))
                                        <= policy.retention_batch, "a sweep read examines more than one batch: " .. detail)
                                end
                                local removed = string.match(detail, "Rows Removed by [%a ]+: (%d+)")
                                if removed then
                                    test.is_true(required(tonumber(removed)) <= policy.retention_batch,
                                        "a sweep read filters more than one batch: " .. detail)
                                end
                            end
                        end
                        return db:query(statement, params)
                    end,
                }
                local stats = required(retention.sweep(probe, dbtype))
                test.is_true(checked >= 2)
                test.eq(stats.job_runs, 3)
                test.eq(stats.jobs, 3)
                test.eq(remaining(db, "kickside_job", long), retained, "the longer override keeps its rows")
                test.eq(remaining(db, "kickside_job_run", long), retained)
                test.eq(remaining(db, "kickside_job", other), 0)
                test.eq(remaining(db, "kickside_job_run", other), 0)
            end)
        end)

        test.it("reads override candidates through a type-leading expiration index", function()
            with_policy(function(policy)
                policy.retention_by_type = {["test.indexed"] = {jobs_ms = DAY_MS, job_runs_ms = DAY_MS}}
            end, function(db, _)
                local dbtype = tostring(db:type())
                seed(db, "test.indexed", 1, days_ago(0), true)
                local rows: any
                if dbtype == sql.type.POSTGRES then
                    rows = required(db:query([[SELECT indexdef AS definition FROM pg_indexes
                        WHERE schemaname=current_schema() AND tablename IN ('kickside_job','kickside_job_run')]]))
                else
                    rows = required(db:query([[SELECT sql AS definition FROM sqlite_master
                        WHERE type='index' AND tbl_name IN ('kickside_job','kickside_job_run') AND sql IS NOT NULL]]))
                end
                local ordered = dbtype == sql.type.SQLITE and "(job_type,finished_at)" or "(job_type,finished_at,id)"
                local found = 0
                for _, row in ipairs(rows) do
                    local definition = string.gsub(string.lower(tostring(row.definition)), "%s+", "")
                    if string.find(definition, ordered, 1, true) then found = found + 1 end
                end
                test.eq(found, 2, "jobs and runs each index the per-type expiration order")
                if dbtype == sql.type.SQLITE then
                    local checked = 0
                    local probe = {
                        type = function() return db:type() end,
                        begin = function() return db:begin() end,
                        execute = function(_, statement, params) return db:execute(statement, params) end,
                        query = function(_, statement, params)
                            if string.find(statement, "job_type = ", 1, true) then
                                local plan = required(db:query("EXPLAIN QUERY PLAN " .. statement, params))
                                local ranged = false
                                for _, row in ipairs(plan) do
                                    if string.find(row.detail, "_type_retention (job_type=? AND finished_at>? AND finished_at<?)", 1, true) then
                                        ranged = true
                                    end
                                    test.is_nil(string.find(row.detail, "TEMP B-TREE", 1, true),
                                        "override candidates sort the backlog")
                                end
                                test.is_true(ranged, "override candidates use a bounded type expiration range")
                                checked = checked + 1
                            end
                            return db:query(statement, params)
                        end,
                    }
                    required(retention.sweep(probe, dbtype))
                    test.eq(checked, 2, "one override pass reads runs and one reads jobs")
                end
            end)
        end)
    end)
end

return {run = test.run_cases(define_tests)}
