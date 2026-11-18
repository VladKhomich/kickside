-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local time = require("time")
local config = require("config")
local retention = require("retention")
local schedule = require("retention_schedule")
local job_fixture = require("job_fixture")

local function required(value: any, err: error?): any
    if err then error(err) end
    if value == nil then error("retention test requires a result") end
    return value
end

local function define_tests()
    test.describe("default thread fence retention", function()
        for _, completed in ipairs({false, true}) do
            test.it("bounds each pass across 100000 " .. (completed and "completed" or "live default") .. " fences", function()
                local queue, dbtype, open_err = job_fixture.private_queue("app:private_queue_retention_fences")
                local db = required(queue, open_err)
                local postgres = dbtype == sql.type.POSTGRES
                local policy = required(config.policy())
                local batch = completed and policy.thread_cleanup_batch or policy.retention_batch
                local numbers = postgres and "SELECT generate_series(1,100001) AS n"
                    or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<100001) SELECT n FROM seq"
                local id = "'00000000-0000-0000-0000-' || " .. (postgres and "lpad(n::text,12,'0')" or "printf('%012d',n)")
                local key_type = postgres and "uuid" or "text"
                required(db:execute("CREATE TABLE IF NOT EXISTS kickside_thread (id " .. key_type .. " PRIMARY KEY)"))
                local columns, values = completed and ",started,completed_at" or "",
                    completed and ",TRUE,'2099-01-01T00:00:00Z'" or ""
                required(db:execute("INSERT INTO kickside_job_thread_cleanup (thread_id" .. columns .. ") SELECT "
                    .. id .. values .. " FROM (" .. numbers .. ") numbers"))
                required(db:execute("DELETE FROM kickside_thread"))
                required(db:execute("INSERT INTO kickside_thread SELECT CAST(thread_id AS " .. key_type
                    .. ") FROM kickside_job_thread_cleanup"))
                required(db:execute("ANALYZE kickside_job_thread_cleanup"))
                required(db:execute("ANALYZE kickside_thread"))
                local obsolete = string.format("00000000-0000-0000-0000-%012d", batch + 1)
                required(db:execute("DELETE FROM kickside_thread WHERE id=$1", {obsolete}))
                if completed then
                    required(db:execute([[INSERT INTO kickside_job
                        (id,owner_kind,owner_id,job_type,status,job_identity)
                        VALUES ($1,'thread',$2,'test.retention','done',$2)]], {obsolete, obsolete}))
                end
                local plans, idle_plans = 0, 0
                local index = completed and "idx_job_cleanup_completed_order" or "idx_job_cleanup_unused_fence"
                local predicate = completed and "completed_at IS NOT NULL" or "started=FALSE"
                local function probe_query(connection, statement, params)
                    local other = completed and "started=FALSE" or "completed_at IS NOT NULL"
                    local window = statement:find("ORDER BY", 1, true) and not statement:find("completed_at < $1", 1, true)
                    if window and statement:find(other, 1, true) then
                        idle_plans = idle_plans + 1
                    end
                    if window and statement:find(predicate, 1, true) then
                        plans = plans + 1
                        if postgres then
                            local plan = required(db:query("EXPLAIN (ANALYZE, BUFFERS) " .. statement, params))
                            local bounded_index = false
                            for _, row in ipairs(plan) do
                                local detail = tostring(row["QUERY PLAN"])
                                if detail:find("Index", 1, true) and detail:find("kickside_job_thread_cleanup", 1, true) then
                                    bounded_index = true
                                end
                                local examined, loops = detail:match("actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                                if examined then
                                    test.is_true(tonumber(examined) * tonumber(loops) <= batch, detail)
                                end
                                local removed = detail:match("Rows Removed by [%a ]+: (%d+)")
                                test.is_true(not removed or tonumber(removed) <= batch, detail)
                            end
                            test.is_true(bounded_index, "PostgreSQL uses the fence index")
                        else
                            local plan = required(connection:query("EXPLAIN QUERY PLAN " .. statement, params))
                            local details = {}
                            for _, row in ipairs(plan) do details[#details + 1] = row.detail end
                            local shape = table.concat(details, "\n")
                            test.not_nil(shape:find("CO-ROUTINE", 1, true), shape)
                            test.not_nil(shape:find(index .. " (", 1, true), shape)
                        end
                    end
                    return connection:query(statement, params)
                end
                local probe = {
                    type = function() return db:type() end,
                    execute = function(_, ...) return db:execute(...) end,
                    query = function(_, ...) return probe_query(db, ...) end,
                    begin = function() return db:begin() end,
                }
                local cursor
                local instant = time.now()
                local driver = schedule.new({policy = config.policy, now = function() return instant end,
                    sweep = function(job_cursor, cleanup_cursors)
                        local stats = required(retention.sweep(probe, dbtype, job_cursor, cleanup_cursors))
                        cursor = stats.thread_cleanup_cursors[completed and "completed" or "unused"]
                        return stats, nil
                    end})
                driver.run(instant:unix_nano())
                test.not_nil(cursor)
                test.is_true(driver.deadline() <= instant:unix_nano())
                local target = completed and "SELECT id FROM kickside_job WHERE owner_id=$1"
                    or "SELECT thread_id FROM kickside_job_thread_cleanup WHERE thread_id=$1"
                test.eq(#required(db:query(target, {obsolete})), 1)
                driver.run(instant:unix_nano())
                test.eq(#required(db:query(target, {obsolete})), 0)
                test.eq(plans, 2)
                test.eq(idle_plans, 1, "the finished window stays finished")
                local remaining = required(db:query("SELECT COUNT(*) AS n FROM kickside_job_thread_cleanup"))
                test.eq(tonumber(remaining[1].n), completed and 100001 or 100000)
                required(db:execute("DROP TABLE kickside_thread"))
                required(db:release())
            end)
        end
    end)
end

return {run = test.run_cases(define_tests)}
