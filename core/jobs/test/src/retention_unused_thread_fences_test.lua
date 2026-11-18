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
        test.it("advances an indexed window across 100000 live default fences", function()
            local queue, dbtype, open_err = job_fixture.private_queue("app:private_queue_retention_fences")
            local db = required(queue, open_err)
            local postgres = dbtype == sql.type.POSTGRES
            local batch = required(config.policy()).retention_batch
            local numbers = postgres and "SELECT generate_series(1,100001) AS n"
                or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<100001) SELECT n FROM seq"
            local id = "'00000000-0000-0000-0000-' || " .. (postgres and "lpad(n::text,12,'0')" or "printf('%012d',n)")
            local key_type = postgres and "uuid" or "text"
            required(db:execute("CREATE TABLE kickside_thread (id " .. key_type .. " PRIMARY KEY)"))
            required(db:execute("INSERT INTO kickside_job_thread_cleanup (thread_id) SELECT " .. id
                .. " FROM (" .. numbers .. ") numbers"))
            required(db:execute("INSERT INTO kickside_thread SELECT CAST(thread_id AS " .. key_type
                .. ") FROM kickside_job_thread_cleanup"))
            required(db:execute("ANALYZE kickside_job_thread_cleanup"))
            required(db:execute("ANALYZE kickside_thread"))
            local obsolete = string.format("00000000-0000-0000-0000-%012d", batch + 1)
            required(db:execute("DELETE FROM kickside_thread WHERE id=$1", {obsolete}))
            local plans = 0
            local function probe_query(connection, statement, params)
                if string.find(statement, "started=FALSE", 1, true)
                    and string.find(statement, "ORDER BY", 1, true) then
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
                        test.is_true(bounded_index, "PostgreSQL uses the partial default-fence index")
                    else
                        local plan = required(connection:query("EXPLAIN QUERY PLAN " .. statement, params))
                        local details = {}
                        for _, row in ipairs(plan) do details[#details + 1] = row.detail end
                        local shape = table.concat(details, "\n")
                        test.not_nil(shape:find("CO-ROUTINE", 1, true), shape)
                        test.not_nil(shape:find("idx_job_cleanup_unused_fence (thread_id>?)", 1, true), shape)
                    end
                end
                return connection:query(statement, params)
            end
            local probe = {
                type = function() return db:type() end,
                execute = function(_, statement, params) return db:execute(statement, params) end,
                query = function(_, statement, params) return probe_query(db, statement, params) end,
                begin = function()
                    local tx = required(db:begin())
                    return {
                        query = function(_, statement, params) return probe_query(tx, statement, params) end,
                        execute = function(_, statement, params) return tx:execute(statement, params) end,
                        commit = function() return tx:commit() end,
                        rollback = function() return tx:rollback() end,
                    }, nil
                end,
            }
            local cursor
            local instant = time.now()
            local driver = schedule.new({policy = config.policy, now = function() return instant end,
                sweep = function(job_cursor, fence_cursor)
                    local stats = required(retention.sweep(probe, dbtype, job_cursor, fence_cursor))
                    cursor = stats.unused_fence_cursor
                    return stats, nil
                end})
            driver.run(instant:unix_nano())
            test.not_nil(cursor)
            test.is_true(driver.deadline() <= instant:unix_nano())
            test.eq(#required(db:query("SELECT thread_id FROM kickside_job_thread_cleanup WHERE thread_id=$1", {obsolete})), 1)
            driver.run(instant:unix_nano())
            test.eq(#required(db:query("SELECT thread_id FROM kickside_job_thread_cleanup WHERE thread_id=$1", {obsolete})), 0)
            test.eq(plans, 2)
            local remaining = required(db:query("SELECT COUNT(*) AS n FROM kickside_job_thread_cleanup"))
            test.eq(tonumber(remaining[1].n), 100000)
            required(db:execute("DROP TABLE kickside_thread"))
            required(db:release())
        end)
    end)
end

return {run = test.run_cases(define_tests)}
