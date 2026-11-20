-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local time = require("time")
local process = require("process")
local channel = require("channel")
local config = require("config")
local retention = require("retention")
local schedule = require("retention_schedule")
local job_fixture = require("job_fixture")
local heartbeat = require("worker_heartbeat")
local clock = require("clock")
local retention_order_migration = require("retention_order_migration")
local dead_outcome = require("dead_outcome")
local enqueue = require("lifecycle_enqueue")

local function required(value: any, err: error?): any
    if err then error(err) end
    if value == nil then error("retention test requires a result") end
    return value
end

local function open_queue(): any
    local db, _, err = job_fixture.private_queue("app:private_queue_retention_pace")
    return required(db, err)
end

local function seed_job(db: any, owner: string): string
    local id = uuid.v7()
    required(db:execute([[INSERT INTO kickside_job
        (id,owner_kind,owner_id,job_type,status,job_identity)
        VALUES ($1,'test',$2,'test.retention','done',$2)]], {id, owner}))
    return id
end

local function drain(db: any, instant: any): (table, integer)
    local totals: any = {}
    local passes = 0
    local driver = schedule.new({policy = config.policy, now = function() return instant end,
        sweep = function(cursor, fence_cursor, scan_wake)
        local stats = required(retention.sweep(db, tostring(db:type()), cursor, fence_cursor, scan_wake))
        for key, value in pairs(stats) do
            if type(value) == "number" then totals[key] = (totals[key] or 0) + value end
        end
        return stats, nil
    end})
    repeat
        driver.run(instant:unix_nano())
        passes = passes + 1
        test.is_true(passes < 10000, "retention never reaches its idle interval")
    until driver.deadline() > instant:unix_nano()
    return totals, passes
end

local function with_policy(changes: table, fn: () -> ())
    local policy = required(config.policy())
    for key, value in pairs(changes) do policy[key] = value end
    local original = config.policy
    config.policy = function() return policy, nil end
    local ok, err = pcall(fn)
    config.policy = original
    if not ok then error(err) end
end

local function seen(db: any, worker_id: string, seconds_ago: integer)
    local stamp = clock.format(time.now():add(-seconds_ago * time.SECOND), tostring(db:type()))
    required(db:execute("UPDATE kickside_job_worker SET last_seen_at=$1 WHERE id=$2", {stamp, worker_id}))
    required(db:execute("UPDATE kickside_job_worker_pulse SET last_seen_at=$1 WHERE worker_id=$2", {stamp, worker_id}))
end

local function running_worker(db: any): (string, string)
    local dbtype = tostring(db:type())
    local worker_id = uuid.v7()
    test.is_nil(heartbeat.mark(db, dbtype, worker_id, "v1"))
    local job_id = uuid.v7()
    required(db:execute([[INSERT INTO kickside_job
        (id,owner_kind,owner_id,job_type,status,job_identity,lease_token,lease_until)
        VALUES ($1,'test',$2,'test.retention','running',$2,'token',$3)]],
        {job_id, job_id, clock.format(time.now():add(time.HOUR), dbtype)}))
    required(db:execute("UPDATE kickside_job_worker SET current_job_id=$1 WHERE id=$2", {job_id, worker_id}))
    return worker_id, job_id
end

local function define_tests()
    test.describe("retention keeps pace with expired writes", function()
        test.it("finishes a bounded wake rotation across pool restart and tail growth", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local postgres = dbtype == sql.type.POSTGRES
            local policy = required(config.policy())
            local batch = policy.retention_batch
            local total = 2 * batch + 1
            local suffix = postgres and "lpad(n::text,12,'0')" or "printf('%012d',n)"
            local id = postgres and "md5(n::text)::uuid" or "lower(hex(randomblob(16)))"
            local key = "'wake-' || " .. suffix
            local function seed_keys(first: integer, last: integer, last_subscribed: integer)
                local numbers = postgres and "SELECT generate_series(" .. tostring(first) .. "," .. tostring(last) .. ") AS n"
                    or "WITH RECURSIVE seq(n) AS (SELECT " .. tostring(first) .. " UNION ALL SELECT n+1 FROM seq WHERE n<"
                        .. tostring(last) .. ") SELECT n FROM seq"
                required(db:execute("INSERT INTO kickside_wake_fanout(key,demand_generation,ack_generation) SELECT "
                    .. key .. ",12,11 FROM (" .. numbers .. ") numbered"))
                required(db:execute([[INSERT INTO kickside_job(id,owner_kind,owner_id,job_type,job_identity,wake_key,slot,wake_enabled)
                    SELECT ]] .. id .. ",'test','wake','test.retention'," .. key .. "," .. key
                    .. ",TRUE,FALSE FROM (" .. numbers .. ") numbered WHERE n<=" .. tostring(last_subscribed)))
            end
            seed_keys(1, total, total - 1)
            required(db:execute("ANALYZE kickside_wake_fanout"))
            required(db:execute("ANALYZE kickside_job"))

            local windows, upper_reads = 0, 0
            local probe = {
                type = function() return db:type() end,
                begin = function() return db:begin() end,
                execute = function(_, ...) return db:execute(...) end,
                query = function(_, statement, params)
                    local rows = required(db:query(statement, params))
                    if statement == "SELECT key FROM kickside_wake_fanout ORDER BY key DESC LIMIT 1" then
                        upper_reads = upper_reads + 1
                        test.eq(#rows, 1)
                    elseif statement:find("SELECT page.key,", 1, true) == 1 then
                        windows = windows + 1
                        test.is_true(#rows <= batch)
                        if windows == 2 then
                            local explain = postgres and "EXPLAIN (ANALYZE, BUFFERS) " or "EXPLAIN QUERY PLAN "
                            local plan = required(db:query(explain .. statement, params))
                            local details = {}
                            for _, row in ipairs(plan) do
                                details[#details + 1] = tostring(postgres and row["QUERY PLAN"] or row.detail)
                            end
                            local rendered = table.concat(details, "\n")
                            test.is_true(rendered:find("kickside_wake_fanout", 1, true) ~= nil, rendered)
                            local index_condition = postgres and "key >" or "key>?"
                            local upper_condition = postgres and "key <=" or "key<?"
                            local subscriber_probe = postgres and "loops=" .. tostring(batch) or "CORRELATED SCALAR SUBQUERY"
                            test.is_true(rendered:find(index_condition, 1, true) ~= nil, rendered)
                            test.is_true(rendered:find(upper_condition, 1, true) ~= nil, rendered)
                            test.is_true(rendered:find(subscriber_probe, 1, true) ~= nil, rendered)
                        end
                    end
                    return rows, nil
                end,
            }
            local function wake_key(n: integer): string return string.format("wake-%012d", n) end
            local function expect_position(n: integer?, upper: integer?)
                local rows = required(db:query("SELECT last_key,upper_key FROM kickside_job_wake_retention"))
                test.eq(rows[1].last_key, n and wake_key(n) or "")
                test.eq(rows[1].upper_key, upper and wake_key(upper) or "")
            end
            local function retained_key(n: integer): boolean
                return #required(db:query("SELECT key FROM kickside_wake_fanout WHERE key=$1", {wake_key(n)})) == 1
            end

            local instant = time.now()
            local now = instant:unix_nano()
            local idle_ns = policy.retention_interval_ms * 1000000
            local busy = true
            local function new_driver()
                return schedule.new({ policy = config.policy, now = function() return instant end,
                    sweep = function(cursor, fence_cursor, scan_wake)
                        local stats = required(retention.sweep(probe, dbtype, cursor, fence_cursor, scan_wake))
                        if busy then stats.jobs = batch end
                        return stats, nil
                    end })
            end
            local driver = new_driver()
            driver.run(now)
            expect_position(batch, total)
            required(db:execute("UPDATE kickside_job SET status='done' WHERE wake_key=$1", {wake_key(1)}))
            local tail = total + batch + 1
            seed_keys(total + 1, tail, tail)
            driver.run(now)
            test.eq(windows, 1, "another lane can drain without scanning the next wake window")
            driver.run(now + idle_ns)
            expect_position(2 * batch, total)
            test.eq(windows, 2)
            local last = tail + batch + 1
            seed_keys(tail + 1, last, last)

            db:release()
            db = required(sql.get("app:private_queue_retention_pace"))
            busy = false
            driver = new_driver()
            driver.run(now + idle_ns)
            test.eq(windows, 3)
            test.eq(upper_reads, 1, "restart reuses the captured upper key")
            expect_position(nil, nil)
            test.is_false(retained_key(total), "growing tail cannot delay the end of this rotation")
            test.is_true(retained_key(1), "the earlier orphan is behind the current rotation")

            tail = last + batch + 1
            seed_keys(last + 1, tail, tail)
            driver.run(now + 2 * idle_ns)
            test.eq(windows, 4)
            test.eq(upper_reads, 2)
            expect_position(batch, tail)
            test.is_false(retained_key(1), "next rotation reaches the original prefix despite the growing tail")
            local survivors = required(db:query([[SELECT COUNT(*) AS n FROM kickside_wake_fanout
                WHERE demand_generation=12 AND ack_generation=11]]))
            test.eq(tonumber(survivors[1].n), tail - 2, "every disabled pending subscriber keeps its generations")
            db:release()
        end)

        test.it("rechecks wake subscribers before deleting a candidate", function()
            local db = open_queue()
            required(db:execute("INSERT INTO kickside_wake_fanout(key,demand_generation) VALUES ('new-subscriber',42)"))
            local probe = {
                type = function() return db:type() end,
                begin = function() return db:begin() end,
                query = function(_, statement, params)
                    local rows = required(db:query(statement, params))
                    if statement:find("SELECT page.key,", 1, true) == 1 then
                        test.is_true(rows[1].orphan == true or rows[1].orphan == 1)
                        required(db:execute([[INSERT INTO kickside_job(id,owner_kind,owner_id,job_type,job_identity,wake_key)
                            VALUES ($1,'test','wake','test.retention','new-subscriber','new-subscriber')]], {uuid.v7()}))
                    end
                    return rows, nil
                end,
            }
            test.eq(required(retention.prune_wake_fanout(probe, 1)), 0)
            local rows = required(db:query("SELECT demand_generation FROM kickside_wake_fanout WHERE key='new-subscriber'"))
            test.eq(tonumber(rows[1].demand_generation), 42)
            db:release()
        end)

        test.it("passes a locked wake key and revisits it on the next rotation", function()
            local db = open_queue()
            if tostring(db:type()) ~= sql.type.POSTGRES then db:release(); return end
            required(db:execute("INSERT INTO kickside_wake_fanout(key) VALUES ('a-hot'),('z-orphan')"))
            local publisher = required(db:begin())
            required(publisher:execute("UPDATE kickside_wake_fanout SET demand_generation=5 WHERE key='a-hot'"))
            local removed, err = retention.prune_wake_fanout(db, 1)
            publisher:commit()
            test.eq(required(removed, err), 0)
            test.eq(required(retention.prune_wake_fanout(db, 1)), 1)
            test.eq(required(retention.prune_wake_fanout(db, 1)), 1)
            test.eq(#required(db:query("SELECT key FROM kickside_wake_fanout")), 0)
            db:release()
        end)

        test.it("visits 100000 completed fences in bounded windows and advances past empty windows", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local postgres = dbtype == sql.type.POSTGRES
            local policy = required(config.policy())
            local batch = policy.thread_cleanup_batch
            local total = 100000
            test.eq(job_fixture.seed_completed_fences(db, total), total)
            required(db:execute("ANALYZE kickside_job_thread_cleanup"))
            local fence_index = "idx_job_cleanup_completed_order"
            if postgres then
                -- The private queue clones the index definition under a generated name.
                local indexes = required(db:query([[SELECT indexname FROM pg_indexes
                    WHERE schemaname=current_schema() AND tablename='kickside_job_thread_cleanup'
                    AND indexdef LIKE '%(completed_at, thread_id)%'
                    AND indexdef LIKE '%completed_at IS NOT NULL%']]))
                test.eq(#indexes, 1)
                fence_index = indexes[1].indexname
            end

            local function thread_id(index: integer): string
                return string.format("00000000-0000-0000-0000-%012d", index)
            end
            local function seed_leftover(owner: string)
                local job_id = uuid.v7()
                required(db:execute([[INSERT INTO kickside_job
                    (id,owner_kind,owner_id,job_type,status,job_identity)
                    VALUES ($1,'thread',$2,'test.retention','pending',$3)]], {job_id, owner, job_id}))
                return job_id
            end
            local function exists(job_id: string): boolean
                return #required(db:query("SELECT id FROM kickside_job WHERE id=$1", {job_id})) == 1
            end

            local windows, inspected, locks, expiry_windows = 0, 0, 0, 0
            local function record_lock(statement: string)
                if statement:find("SELECT f.thread_id,f.completed_at", 1, true) then
                    expiry_windows = expiry_windows + 1
                elseif statement:find("started,next_page_seq,completed_at", 1, true)
                    and statement:find("kickside_job_thread_cleanup WHERE thread_id=", 1, true) then
                    locks = locks + 1
                elseif statement:find("SET thread_id=thread_id WHERE thread_id=", 1, true) then
                    locks = locks + 1
                end
            end
            local probe = {
                type = function() return db:type() end,
                begin = function()
                    return job_fixture.observe_tx(required(db:begin()), record_lock), nil
                end,
                execute = function(_, statement, params) return db:execute(statement, params) end,
                query = function(_, statement, params)
                    if not statement:find("SELECT f.thread_id,f.completed_at", 1, true) then
                        return db:query(statement, params)
                    end
                    windows = windows + 1
                    if windows <= 2 or windows == math.floor(total / batch) then
                        local explain = postgres and "EXPLAIN (ANALYZE, BUFFERS) " or "EXPLAIN QUERY PLAN "
                        local plan = required(db:query(explain .. statement, params))
                        local ordered_index = false
                        for _, row in ipairs(plan) do
                            local detail = tostring(postgres and row["QUERY PLAN"] or row.detail)
                            if detail:find(fence_index, 1, true) then
                                ordered_index = true
                                if postgres then
                                    local read, loops = detail:match("actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                                    local scanned, iterations = tonumber(read), tonumber(loops)
                                    test.is_true(scanned and iterations and scanned * iterations <= batch, detail)
                                elseif #params > 1 then
                                    test.not_nil(detail:find("(completed_at,thread_id)>(?,?)", 1, true), detail)
                                end
                            end
                            if postgres then
                                local removed = detail:match("Rows Removed by [%a ]+: (%d+)")
                                test.is_true(not removed or tonumber(removed) <= batch, detail)
                            end
                        end
                        test.is_true(ordered_index, "the completed fence window uses the existing ordered index")
                    end
                    local rows = required(db:query(statement, params))
                    test.is_true(#rows <= batch, "the eligibility checks are limited to one fence window")
                    inspected = inspected + #rows
                    return rows, nil
                end,
            }
            local instant = time.now()
            local pass_count = math.floor(total / batch) + 1
            local removals = 0
            local keep_due = true
            local driver = schedule.new({ policy = config.policy, now = function() return instant end,
                sweep = function(job_cursor, completed_fence_cursor)
                    local stats = required(retention.sweep(probe, dbtype, job_cursor, completed_fence_cursor))
                    removals = removals + stats.thread_cleanup_leftovers
                    if windows == pass_count and keep_due then
                        -- A different retention lane can need another pass even
                        -- when the completed fence scan has reached the end.
                        stats.workers = policy.retention_batch
                        keep_due = false
                    end
                    return stats, nil
                end })

            local now = instant:unix_nano()
            for pass = 1, pass_count do
                driver.run(now)
                test.eq(windows, pass, "one window per worker turn")
                test.eq(driver.deadline(), now, "an empty eligible page still advances to the next window")
            end
            driver.run(now)
            test.eq(windows, pass_count, "the exhausted scan does not restart while another lane remains due")
            test.is_true(driver.deadline() > now, "the scheduler idles after the round")
            test.eq(inspected, total, "the complete round reads each settled fence once")
            test.eq(removals, 0)
            test.eq(locks, 0, "inspecting settled fences opens no per-fence transaction")
            test.eq(expiry_windows, 1, "expiry stays closed while the longer reclaimer round continues")

            local early = seed_leftover(thread_id(batch + 1))
            local late = seed_leftover(thread_id(total))
            windows, inspected = 0, 0
            local next_round = driver.deadline()
            driver.run(next_round)
            test.is_true(exists(early) and exists(late), "the first window has no eligible owners")
            test.eq(driver.deadline(), next_round)
            driver.run(next_round)
            test.is_false(exists(early), "the next window reaches and drains the first eligible owner")
            test.is_true(exists(late))
            for _ = 3, pass_count do driver.run(next_round) end
            test.is_false(exists(late), "the tail of the round reaches the late owner")
            if driver.deadline() == next_round then driver.run(next_round) end
            test.eq(windows, pass_count)
            test.eq(inspected, total)
            test.eq(removals, 2)
            test.eq(locks, 2, "only the discovered leftover owners take fence locks")
            test.eq(expiry_windows, 2, "the next retention round starts both fence scans")
            test.is_true(driver.deadline() > next_round)
            local remaining = required(db:query("SELECT count(*) AS n FROM kickside_job_thread_cleanup"))
            test.eq(tonumber(remaining[1].n), total, "inspection leaves the active retention window untouched")
            db:release()
        end)

        test.it("bounds expiry across 100000 completed fences protected by retained work", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local postgres = dbtype == sql.type.POSTGRES
            local policy = required(config.policy())
            local batch, total = policy.retention_batch, 100000
            test.eq(job_fixture.seed_completed_fences(db, total), total)
            required(db:execute("UPDATE kickside_job_thread_cleanup SET completed_at='2000-01-01T00:00:00Z'"))
            local id = postgres and "CAST(thread_id AS uuid)" or "thread_id"
            required(db:execute([[INSERT INTO kickside_job(id,owner_kind,owner_id,job_type,status,job_identity)
                SELECT ]] .. id .. [[,'thread',thread_id,'test.fence_expiry','pending',thread_id
                FROM kickside_job_thread_cleanup]]))
            required(db:execute("ANALYZE kickside_job_thread_cleanup"))
            required(db:execute("ANALYZE kickside_job"))
            local function fence_id(index: integer): string
                return string.format("00000000-0000-0000-0000-%012d", index)
            end
            local early, changed_job, changed_receipt, late = fence_id(batch + 1), fence_id(batch + 2),
                fence_id(batch + 3), fence_id(total)
            for _, owner in ipairs({early, changed_job, changed_receipt, late}) do
                required(db:execute("DELETE FROM kickside_job WHERE owner_id=$1", {owner}))
            end
            local function exists(owner: string): boolean
                return #required(db:query("SELECT thread_id FROM kickside_job_thread_cleanup WHERE thread_id=$1", {owner})) == 1
            end

            local windows, deleted = 0, 0
            local probe = {
                type = function() return db:type() end,
                execute = function(_, statement, params) return db:execute(statement, params) end,
                query = function(_, statement, params) return db:query(statement, params) end,
                begin = function()
                    local tx = required(db:begin())
                    return job_fixture.observe_tx(tx, function(statement)
                        if not statement:find("SELECT f.thread_id,f.completed_at", 1, true) then return end
                        windows = windows + 1
                        if windows == 2 then
                            -- These references become visible after inspecting the window.
                            required(tx:execute([[INSERT INTO kickside_job
                                (id,owner_kind,owner_id,job_type,status,job_identity)
                                VALUES ($1,'thread',$2,'test.fence_expiry','pending',$3)]],
                                {uuid.v7(), changed_job, changed_job}))
                            required(tx:execute([[INSERT INTO kickside_job_thread_cleanup_receipt
                                (thread_id,page_seq,processed,done,discarded_json,unresolved_json,created_at)
                                VALUES ($1,0,0,TRUE,'{}','{}','2000-01-01T00:00:00Z')]], {changed_receipt}))
                        end
                    end), nil
                end,
            }
            local instant = time.now()
            local now = instant:unix_nano()
            local cursor
            local driver = schedule.new({policy = config.policy, now = function() return instant end,
                sweep = function(job_cursor, completed_fence_cursor)
                    local positions = completed_fence_cursor
                    if positions == nil then positions = {reclaim = false} end
                    local stats = required(retention.sweep(probe, dbtype, job_cursor, positions))
                    deleted = deleted + stats.thread_cleanup_fences
                    cursor = stats.completed_fence_cursor
                    return stats, nil
                end})
            local passes = math.floor(total / batch) + 1
            for pass = 1, passes do
                test.eq(driver.deadline(), now, "expiry continuation stays due across protected windows")
                driver.run(now)
                test.eq(windows, pass, "the worker reads one expiry window per turn")
                if pass < passes then test.eq(cursor.expire.thread_id, fence_id(pass * batch)) end
                if pass == 1 then
                    test.eq(deleted, 0)
                    test.is_true(exists(early))
                elseif pass == 2 then
                    test.eq(deleted, 1)
                    test.is_true(exists(changed_job))
                    test.is_true(exists(changed_receipt))
                    test.is_false(exists(early))
                    test.is_true(exists(late))
                end
            end
            test.eq(deleted, 2)
            test.is_false(exists(late))
            test.is_nil(cursor)
            test.is_true(driver.deadline() > now, "expiry finishes the retention round")
            local remaining = required(db:query("SELECT count(*) AS n FROM kickside_job_thread_cleanup"))
            test.eq(tonumber(remaining[1].n), total - 2)
            db:release()
        end)

        test.it("bounds each expiration page when 10000 dead parents have pending outcomes", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local postgres = dbtype == sql.type.POSTGRES
            local policy = required(config.policy())
            local batch = policy.retention_batch
            local total = 10000
            local owner = uuid.v7()
            local numbers = postgres and "SELECT generate_series(1,10000) AS n"
                or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<10000) SELECT n FROM seq"
            local id = postgres and "md5($1::text || n::text)::uuid" or "lower(hex(randomblob(16)))"
            required(db:execute([[INSERT INTO kickside_job
                (id,owner_kind,owner_id,job_type,status,job_identity,finished_at)
                SELECT ]] .. id .. ",'test',$1,'test.retention','dead',CAST(n AS TEXT),'2000-01-01T00:00:00Z' FROM ("
                .. numbers .. ") numbered", {owner}))
            local prefix, suffix = enqueue.encode_part(dead_outcome.NAMESPACE), enqueue.encode_part(dead_outcome.KEY)
            local job_id = "CAST(id AS TEXT)"
            local outcome_id = postgres and "md5('outcome' || " .. job_id .. ")::uuid" or "lower(hex(randomblob(16)))"
            required(db:execute([[WITH parents AS (SELECT id,owner_id FROM kickside_job WHERE owner_id=$1)
                INSERT INTO kickside_job
                (id,owner_kind,owner_id,job_type,status,job_identity)
                SELECT ]] .. outcome_id .. ",'test',owner_id,'test.outcome','pending',$2 || LENGTH(" .. job_id .. ") || ':' || "
                .. job_id .. " || $3 FROM parents", {owner, prefix, suffix}))
            local seeded = required(db:query("SELECT COUNT(*) AS n FROM kickside_job WHERE owner_id=$1 AND status='pending'", {owner}))
            test.eq(tonumber(seeded[1].n), total)
            local later = seed_job(db, owner)
            required(db:execute("UPDATE kickside_job SET finished_at='2000-01-02T00:00:00Z' WHERE id=$1", {later}))
            required(db:execute("ANALYZE kickside_job"))

            local instant = time.now()
            local pages, examined, deleted = 0, 0, 0
            local probe = {
                type = function() return db:type() end,
                begin = function() return db:begin() end,
                execute = function(_, statement, params) return db:execute(statement, params) end,
                query = function(_, statement, params)
                    if not string.find(statement, "SELECT id,owner_kind,owner_id,finished_at,", 1, true) then
                        return db:query(statement, params)
                    end
                    pages = pages + 1
                    if postgres then
                        local plan = required(db:query("EXPLAIN (ANALYZE, BUFFERS) " .. statement, params))
                        local loops = 0
                        for _, row in ipairs(plan) do
                            local detail = tostring(row["QUERY PLAN"])
                            local rows, scans = string.match(detail, "actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                            if rows then
                                loops = required(tonumber(scans))
                                test.is_true(required(tonumber(rows)) * loops <= batch, detail)
                            end
                            local removed = string.match(detail, "Rows Removed by [%a ]+: (%d+)")
                            if removed then
                                test.is_true(required(tonumber(removed)) * loops <= batch, detail)
                            end
                        end
                    else
                        local plan = required(db:query("EXPLAIN QUERY PLAN " .. statement, params))
                        local expiry_seek, tie_seek = false, false
                        for _, row in ipairs(plan) do
                            if string.find(row.detail, "SEARCH kickside_job USING INDEX idx_job_global_retention", 1, true) then
                                expiry_seek = true
                            end
                            if string.find(row.detail, "idx_job_global_retention (finished_at=? AND rowid>?)", 1, true) then
                                tie_seek = true
                            end
                        end
                        test.is_true(expiry_seek, "the page uses the expiry index")
                        if params[3] ~= nil then test.is_true(tie_seek, "same-timestamp parents use an indexed rowid seek") end
                    end
                    local rows = required(db:query(statement, params))
                    examined = examined + #rows
                    return rows, nil
                end,
            }
            local driver = schedule.new({policy = config.policy, now = function() return instant end,
                sweep = function(cursor)
                    local stats = required(retention.sweep(probe, dbtype, cursor))
                    deleted = deleted + stats.jobs
                    return stats, nil
                end})
            local now = instant:unix_nano()
            for pass = 1, math.ceil((total + 1) / batch) do
                local before = examined
                driver.run(now)
                test.eq(pages, pass, "each sweep fetches one expiry page")
                test.eq(examined - before, math.min(batch, total + 1 - before))
                test.eq(deleted, examined <= total and 0 or 1)
                if examined <= total then test.eq(driver.deadline(), now, "a protected page does not stop the sweep") end
            end
            test.is_true(driver.deadline() > now)
            local rows = required(db:query("SELECT id FROM kickside_job WHERE id=$1", {later}))
            test.eq(#rows, 0, "an eligible job behind all protected parents is pruned")
            rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job WHERE owner_id=$1 AND status='dead'", {owner}))
            test.eq(tonumber(rows[1].n), total)

            local order = postgres and "id" or "rowid"
            local first = required(db:query("SELECT id FROM kickside_job WHERE owner_id=$1 AND status='dead' ORDER BY "
                .. order .. " LIMIT 1", {owner}))[1].id
            required(db:execute("UPDATE kickside_job SET status='done' WHERE job_identity=$1",
                {prefix .. enqueue.encode_part(tostring(first)) .. suffix}))
            driver.run(driver.deadline())
            rows = required(db:query("SELECT id FROM kickside_job WHERE id=$1", {first}))
            test.eq(#rows, 0, "the next interval revisits parents whose outcomes settled")
            db:release()
        end)

        test.it("drains finished deletion and other jobs with their runs in bounded pages", function()
            local db = open_queue()
            local policy = required(config.policy())
            local total = policy.retention_batch * 3 + 1
            local numbers = tostring(db:type()) == sql.type.POSTGRES
                and "SELECT generate_series(1," .. tostring(total) .. ") AS n"
                or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<"
                    .. tostring(total) .. ") SELECT n FROM seq"
            local id = tostring(db:type()) == sql.type.POSTGRES and "md5(CAST(n AS TEXT))::uuid"
                or "lower(hex(randomblob(16)))"
            required(db:execute([[INSERT INTO kickside_job
                (id,owner_kind,owner_id,job_type,status,job_identity,finished_at)
                SELECT ]] .. id .. [[,
                    CASE WHEN n%2=0 THEN 'component' ELSE 'service' END,
                    'expired-' || CAST(n AS TEXT),
                    CASE WHEN n%2=0 THEN 'kickside.component:delete_worker' ELSE 'test.retention' END,
                    CASE WHEN n%3=0 THEN 'cancelled' WHEN n%3=1 THEN 'done' ELSE 'dead' END,
                    'expired-' || CAST(n AS TEXT),'2000-01-01T00:00:00Z'
                FROM (]] .. numbers .. ") numbered"))
            for seq = 1, 2 do
                required(db:execute([[INSERT INTO kickside_job_run
                    (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status,lease_token,started_at,finished_at)
                    SELECT ]] .. (tostring(db:type()) == sql.type.POSTGRES and "md5(CAST(id AS TEXT) || '" .. tostring(seq) .. "')::uuid"
                        or "lower(hex(randomblob(16)))") .. [[,
                        id,owner_kind,owner_id,job_type,1,]] .. tostring(seq) .. [[,
                        CASE WHEN status='done' THEN 'completed' ELSE 'failed' END,
                        'seed',finished_at,finished_at FROM kickside_job]]))
            end
            for _, status in ipairs({"pending", "running", "done"}) do
                local job_id = uuid.v7()
                local finished = status == "done" and "'2099-01-01T00:00:00Z'" or "NULL"
                required(db:execute([[INSERT INTO kickside_job
                    (id,owner_kind,owner_id,job_type,status,job_identity,finished_at)
                    VALUES ($1,'component',$2,'kickside.component:delete_worker',$2,$2,]] .. finished .. ")",
                    {job_id, status}))
                required(db:execute([[INSERT INTO kickside_job_run
                    (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status,lease_token,started_at,finished_at)
                    VALUES ($1,$1,'component',$2,'kickside.component:delete_worker',1,1,$3,'seed','2000-01-01T00:00:00Z',]] .. finished .. ")",
                    {job_id, status, status == "done" and "completed" or "running"}))
            end
            local pages, transactions = 0, 0
            local probe = {
                type = function() return db:type() end,
                execute = function(_, statement, params) return db:execute(statement, params) end,
                query = function(_, statement, params)
                    local rows, err = db:query(statement, params)
                    if string.find(statement, "SELECT id,", 1, true) == 1 then
                        test.is_true(#required(rows, err) <= policy.retention_batch, "candidate page exceeds the batch")
                        pages = pages + 1
                    end
                    return rows, err
                end,
                begin = function()
                    local tx = required(db:begin())
                    local deletes = 0
                    return {
                        query = function(_, statement, params) return tx:query(statement, params) end,
                        execute = function(_, statement, params)
                            local result, err = tx:execute(statement, params)
                            if string.find(statement, "DELETE FROM kickside_job ", 1, true) == 1
                                or string.find(statement, "DELETE FROM kickside_job_run ", 1, true) == 1 then
                                deletes = deletes + 1
                                test.is_true(tonumber(required(result, err).rows_affected) <= policy.retention_batch,
                                    "transaction deletes more than one page")
                            end
                            return result, err
                        end,
                        commit = function()
                            if deletes > 0 then
                                test.eq(deletes, 1, "each retained page has its own transaction")
                                transactions = transactions + 1
                            end
                            return tx:commit()
                        end,
                        rollback = function() return tx:rollback() end,
                    }, nil
                end,
            }
            local totals, passes = drain(probe, time.now())
            test.eq(totals.jobs, total)
            test.eq(totals.job_runs, total * 2)
            test.eq(passes, math.floor(total * 2 / policy.retention_batch) + math.ceil(total / policy.retention_batch))
            test.eq(pages, math.ceil(total * 2 / policy.retention_batch)
                + math.ceil(total / policy.retention_batch) + 1,
                "run pages bracket complete job rounds")
            test.is_true(transactions > 2, "backlog drains through multiple transactions")
            for _, table_name in ipairs({"kickside_job", "kickside_job_run"}) do
                local rows = required(db:query("SELECT owner_id FROM " .. table_name .. " ORDER BY owner_id"))
                test.eq(#rows, 3)
                test.eq(rows[1].owner_id, "done")
                test.eq(rows[2].owner_id, "pending")
                test.eq(rows[3].owner_id, "running")
            end
            db:release()
        end)

        test.it("pages past blocked jobs with bounded selection at small and large backlogs", function()
            for _, total in ipairs({1000, 100000}) do
                local db = open_queue()
                local dbtype = tostring(db:type())
                local batch = required(config.policy()).retention_batch
                local numbers = dbtype == sql.type.POSTGRES
                    and "SELECT generate_series(1," .. tostring(total) .. ") AS n"
                    or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<"
                        .. tostring(total) .. ") SELECT n FROM seq"
                local id = dbtype == sql.type.POSTGRES and "md5(n::text)::uuid" or "CAST(n AS TEXT)"
                required(db:execute([[INSERT INTO kickside_job
                    (id,owner_kind,owner_id,job_type,status,job_identity,finished_at)
                    SELECT ]] .. id .. ", 'component','blocked','kickside.component:delete_worker','done',CAST(n AS TEXT),"
                    .. "'2000-01-01T00:00:00Z' FROM (" .. numbers .. ") numbered"))
                required(db:execute([[INSERT INTO kickside_job_run
                    (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status,lease_token,started_at)
                    SELECT id,id,owner_kind,owner_id,job_type,1,1,'running','seed',finished_at FROM kickside_job]]))
                required(db:execute("ANALYZE kickside_job"))
                required(db:execute("ANALYZE kickside_job_run"))
                local checked = 0
                local probe = {
                    type = function() return db:type() end,
                    begin = function() return db:begin() end,
                    execute = function(_, statement, params) return db:execute(statement, params) end,
                    query = function(_, statement, params)
                        local rows, err = db:query(statement, params)
                        if string.find(statement, "SELECT id,owner_kind,owner_id", 1, true) == 1 then
                            checked = checked + 1
                            if dbtype == sql.type.POSTGRES then
                                local plan = required(db:query("EXPLAIN (ANALYZE, BUFFERS) " .. statement, params))
                                for _, row in ipairs(plan) do
                                    local detail = tostring(row["QUERY PLAN"])
                                    local examined, loops = string.match(detail, "actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                                    local examined_rows, loop_count = tonumber(examined), tonumber(loops)
                                    if examined_rows and loop_count then
                                        test.is_true(examined_rows * loop_count <= batch,
                                            "candidate selection examines more than a batch: " .. detail)
                                    end
                                    local removed = string.match(detail, "Rows Removed by [%a ]+: (%d+)")
                                    if removed then test.is_true(tonumber(removed) <= batch, detail) end
                                end
                            else
                                local plan = required(db:query("EXPLAIN QUERY PLAN " .. statement, params))
                                local seeks = 0
                                for _, row in ipairs(plan) do
                                    local detail = tostring(row.detail)
                                    test.is_nil(string.find(detail, "SCAN ", 1, true), detail)
                                    test.is_nil(string.find(detail, "TEMP B-TREE", 1, true), detail)
                                    if string.find(detail, "SEARCH kickside_job USING INDEX idx_job_global_retention", 1, true) then
                                        seeks = seeks + 1
                                    end
                                    if checked == 2 and string.find(detail, "finished_at=?", 1, true) then
                                        test.not_nil(string.find(detail, "rowid>?", 1, true), "the seek skips earlier timestamp ties")
                                    end
                                end
                                test.eq(seeks, checked == 2 and 2 or 1)
                            end
                            test.eq(#required(rows, err), batch, "blocked rows consume a bounded candidate page")
                        end
                        return rows, err
                    end,
                }
                local stats = required(retention.sweep(probe, dbtype))
                test.eq(stats.jobs, 0)
                test.eq(stats.job_runs, 0)
                test.not_nil(stats.job_cursor, "a full blocked page advances the round")
                local key = dbtype == sql.type.SQLITE and "rowid" or "id"
                local last = required(db:query("SELECT finished_at," .. key .. " AS key FROM kickside_job"
                    .. " ORDER BY finished_at," .. key .. " LIMIT 1 OFFSET $1", {total-batch-1}))[1]
                stats = required(retention.sweep(probe, dbtype, {finished_at=last.finished_at, key=last.key}))
                test.eq(stats.jobs, 0)
                test.not_nil(stats.job_cursor)
                test.eq(checked, 2, "each sweep reads one bounded job page")
                stats = required(retention.sweep(db, dbtype, stats.job_cursor))
                test.is_nil(stats.job_cursor, "the round ends beyond its last blocked row")
                local eligible = uuid.v7()
                required(db:execute([[INSERT INTO kickside_job
                    (id,owner_kind,owner_id,job_type,status,job_identity,finished_at)
                    VALUES ($1,'service','eligible','test.retention','done','eligible','2000-01-02T00:00:00Z')]], {eligible}))
                local instant = time.now()
                local passes = 0
                local driver = schedule.new({policy=config.policy, now=function() return instant end,
                    sweep=function(cursor)
                        passes = passes + 1
                        local round = math.ceil(total/batch)+1
                        test.is_true(passes <= round * (total == 1000 and 2 or 1), "blocked rows repeat within a round")
                        if total == 1000 and passes == 2 then
                            required(db:execute([[INSERT INTO kickside_job_run
                                (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status,lease_token,started_at,finished_at)
                                SELECT $1,id,owner_kind,owner_id,job_type,1,2,'completed','seed',finished_at,finished_at
                                FROM kickside_job WHERE owner_id='blocked' ORDER BY id LIMIT 1]], {uuid.v7()}))
                        end
                        local stats, err = retention.sweep(db, dbtype, cursor)
                        if total == 1000 and passes == round then
                            local rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job WHERE id=$1", {eligible}))
                            test.eq(tonumber(rows[1].n), 0, "new expired runs never restart a progressing job round")
                            test.eq(required(stats, err).job_runs, 1, "new run history drains at the round boundary")
                        end
                        return stats, err
                    end})
                repeat driver.run(instant:unix_nano()) until driver.deadline() > instant:unix_nano()
                test.eq(passes, (math.ceil(total/batch)+1) * (total == 1000 and 2 or 1))
                local rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job WHERE id=$1", {eligible}))
                test.eq(tonumber(rows[1].n), 0, "eligible rows behind blocked pages drain before idling")
                rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job_run"))
                test.eq(tonumber(rows[1].n), total, "active runs and their jobs remain")
                required(db:execute("UPDATE kickside_job_run SET status='completed',finished_at='2000-01-01T00:00:00Z'"))
                local totals = drain(db, instant)
                test.eq(totals.jobs, total)
                test.eq(totals.job_runs, total)
                db:release()
            end
        end)

        test.it("bounds job selection when runs have a longer retention window", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local policy = required(config.policy())
            local original = config.policy
            policy.retention_jobs_ms = 86400000
            policy.retention_job_runs_ms = 30 * 86400000
            config.policy = function() return policy, nil end
            local ok, err = pcall(function()
                local total = 100000
                local owner = uuid.v7()
                local finished = time.now():add(-10 * 86400000 * time.MILLISECOND):format(time.RFC3339)
                local numbers = dbtype == sql.type.POSTGRES
                    and "SELECT generate_series(1," .. tostring(total) .. ") AS n"
                    or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<"
                        .. tostring(total) .. ") SELECT n FROM seq"
                local id = dbtype == sql.type.POSTGRES and "md5($1::text || n::text)::uuid"
                    or "lower(hex(randomblob(16)))"
                local stamp = dbtype == sql.type.POSTGRES and "$2::timestamptz" or "$2"
                required(db:execute([[INSERT INTO kickside_job
                    (id,owner_kind,owner_id,job_type,status,job_identity,finished_at)
                    SELECT ]] .. id .. ",'test',$1,'test.retention','done',CAST(n AS TEXT)," .. stamp
                    .. " FROM (" .. numbers .. ") numbered", {owner, finished}))
                required(db:execute([[INSERT INTO kickside_job_run
                    (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status,lease_token,started_at,finished_at)
                    SELECT id,id,owner_kind,owner_id,job_type,1,1,'success','seed',finished_at,finished_at
                    FROM kickside_job WHERE owner_id=$1]], {owner}))
                required(db:execute("ANALYZE kickside_job"))
                required(db:execute("ANALYZE kickside_job_run"))
                local checked = 0
                local expected_range = "idx_job_global_retention (finished_at>? AND finished_at<?)"
                local probe = {
                    type = function() return db:type() end,
                    begin = function() return db:begin() end,
                    execute = function(_, statement, params) return db:execute(statement, params) end,
                    query = function(_, statement, params)
                        if string.find(statement, "SELECT id,owner_kind,owner_id", 1, true) == 1 then
                            checked = checked + 1
                            if dbtype == sql.type.SQLITE then
                                local plan = required(db:query("EXPLAIN QUERY PLAN " .. statement, params))
                                local ranged = false
                                for _, row in ipairs(plan) do
                                    if string.find(row.detail, expected_range, 1, true) then
                                        ranged = true
                                    end
                                end
                                test.is_true(ranged, "job candidates use a bounded expiration index range")
                                test.is_true(params[#params - 1] < finished, "the range excludes jobs whose runs stay in-window")
                            else
                                local plan = required(db:query("EXPLAIN (ANALYZE, BUFFERS) " .. statement, params))
                                local measured = false
                                for _, row in ipairs(plan) do
                                    local detail = tostring(row["QUERY PLAN"])
                                    local examined, loops = string.match(detail, "actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                                    if examined then
                                        measured = true
                                        test.is_true(required(tonumber(examined)) * required(tonumber(loops)) <= policy.retention_batch,
                                            "job candidates examine more than one batch: " .. detail)
                                    end
                                    local removed = string.match(detail, "Rows Removed by [%a ]+: (%d+)")
                                    if removed then
                                        test.is_true(required(tonumber(removed)) <= policy.retention_batch,
                                            "job candidates filter more than one batch: " .. detail)
                                    end
                                end
                                test.is_true(measured, "the candidate plan reports execution counters")
                            end
                        end
                        return db:query(statement, params)
                    end,
                }
                local stats = required(retention.sweep(probe, dbtype))
                test.eq(checked, 1)
                test.eq(stats.jobs, 0)
                test.eq(stats.job_runs, 0)
                policy.retention_by_type = { ["test.retention"] = {
                    jobs_ms = policy.retention_jobs_ms, job_runs_ms = policy.retention_job_runs_ms,
                } }
                expected_range = "idx_job_type_retention (job_type=? AND finished_at>? AND finished_at<?)"
                stats = required(retention.sweep(probe, dbtype))
                test.eq(checked, 2)
                test.eq(stats.jobs, 0)
                test.eq(stats.job_runs, 0)
                for _, name in ipairs({"kickside_job", "kickside_job_run"}) do
                    local rows = required(db:query("SELECT COUNT(*) AS n FROM " .. name .. " WHERE owner_id=$1", {owner}))
                    test.eq(tonumber(rows[1].n), total, "in-window run history preserves its jobs")
                    required(db:execute("UPDATE " .. name .. " SET finished_at='2000-01-01T00:00:00Z' WHERE owner_id=$1", {owner}))
                end
                local totals = drain(db, time.now())
                test.eq(totals.jobs, total)
                test.eq(totals.job_runs, total)
            end)
            config.policy = original
            db:release()
            if not ok then error(err) end
        end)

        for _, field in ipairs({ "jobs", "job_runs", "workers", "worker_pulses", "wake_rows",
                "thread_cleanup_receipts", "thread_cleanup_fences", "thread_cleanup_leftovers" }) do
            test.it("continues a full " .. field .. " batch before the idle interval", function()
                local policy = required(config.policy())
                local stats: any = { [field] = field == "thread_cleanup_leftovers" and 1 or policy.retention_batch }
                for _, name in ipairs({ "jobs", "job_runs", "workers", "worker_pulses", "wake_rows",
                    "thread_cleanup_receipts", "thread_cleanup_fences", "thread_cleanup_leftovers" }) do
                    if stats[name] == nil then stats[name] = 0 end
                end
                local instant = time.now()
                local driver = schedule.new({ policy = config.policy, sweep = function() return stats, nil end,
                    now = function() return instant end })
                local now = instant:unix_nano()
                driver.run(now)
                test.is_true(driver.deadline() <= now, "a full batch re-arms the existing worker timer")
                stats[field] = 0
                driver.run(now)
                test.eq(driver.deadline(), now + policy.retention_interval_ms * 1000000)
            end)
        end

        test.it("adds indexes to populated tables idempotently without changing rows", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local owner = uuid.v7()
            local id = seed_job(db, owner)
            job_fixture.seed_runs(db, 3, id, owner, "2000-01-01T00:00:00Z")
            local callback = retention_order_migration[1].database_implementations[dbtype].up
            local indexes: any
            if dbtype == sql.type.POSTGRES then
                indexes = required(db:query([[SELECT indexname AS name,indexdef AS definition FROM pg_indexes
                    WHERE schemaname=current_schema()]]))
            else
                indexes = required(db:query("SELECT name,sql AS definition FROM sqlite_master WHERE type='index' AND sql IS NOT NULL"))
            end
            for _, index in ipairs(indexes) do
                local definition = string.gsub(string.lower(tostring(index.definition)), "%s+", "")
                for _, columns in ipairs({"(finished_at)", "(finished_at,id)", "(acknowledged_at,thread_id,page_seq)", "(completed_at,thread_id)"}) do
                    if string.find(definition, columns, 1, true) then
                        required(db:execute("DROP INDEX " .. index.name))
                    end
                end
            end
            callback(db)
            callback(db)
            local rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job_run WHERE job_id=$1", {id}))
            test.eq(tonumber(rows[1].n), 3)
            rows = required(db:query("SELECT status,owner_id FROM kickside_job WHERE id=$1", {id}))
            test.eq(rows[1].status, "done")
            test.eq(rows[1].owner_id, owner)
            db:release()
        end)

        test.it("indexes the global expiration order without a thread prefix", function()
            local db = open_queue()
            local rows: any
            if tostring(db:type()) == sql.type.POSTGRES then
                rows = required(db:query([[SELECT indexdef AS definition FROM pg_indexes
                    WHERE schemaname=current_schema() AND tablename='kickside_job_run']]))
            else
                rows = required(db:query([[SELECT sql AS definition FROM sqlite_master
                    WHERE type='index' AND tbl_name='kickside_job_run' AND sql IS NOT NULL]]))
            end
            local ordered = tostring(db:type()) == sql.type.SQLITE and "(finished_at)" or "(finished_at,id)"
            local found = false
            for _, row in ipairs(rows) do
                local definition = string.gsub(string.lower(tostring(row.definition)), "%s+", "")
                if string.find(definition, ordered, 1, true) then found = true end
            end
            db:release()
            test.is_true(found, "global sweeps require an expiration-leading index")
        end)

        test.it("reads SQLite global candidates in index order without sorting the backlog", function()
            local db = open_queue()
            if tostring(db:type()) == sql.type.SQLITE then
                local checked = 0
                local probe = {
                    type = function() return db:type() end,
                    query = function(_, statement, params)
                        local plan = required(db:query("EXPLAIN QUERY PLAN " .. statement, params))
                        for _, row in ipairs(plan) do
                            test.is_nil(string.find(row.detail, "TEMP B-TREE", 1, true), "global candidates sort the backlog")
                        end
                        checked = checked + 1
                        return db:query(statement, params)
                    end,
                }
                required(retention.prune_runs(probe, nil, "2001-01-01T00:00:00Z", 10, true))
                required(retention.prune_jobs(probe, nil, "2001-01-01T00:00:00Z", 10, true))
                test.eq(checked, 2)
            end
            db:release()
        end)

        test.it("deletes SQLite candidates through bounded primary-key lookups", function()
            local db = open_queue()
            if tostring(db:type()) == sql.type.SQLITE then
                local owner = uuid.v7()
                local id = seed_job(db, owner)
                job_fixture.seed_runs(db, 500, id, owner, "2000-01-01T00:00:00Z")
                local checked, point_lookup = false, false
                local probe = {
                    type = function() return db:type() end,
                    query = function(_, statement, params) return db:query(statement, params) end,
                    begin = function()
                        local tx = required(db:begin())
                        return {
                            execute = function(_, statement, params)
                                local plan = required(tx:query("EXPLAIN QUERY PLAN " .. statement, params))
                                for _, row in ipairs(plan) do
                                    if string.find(row.detail, "USING INTEGER PRIMARY KEY", 1, true) then point_lookup = true end
                                end
                                checked = true
                                return tx:execute(statement, params)
                            end,
                            commit = function() return tx:commit() end,
                            rollback = function() return tx:rollback() end,
                        }, nil
                    end,
                }
                test.eq(required(retention.prune_runs(probe, nil, "2001-01-01T00:00:00Z", 500, true)), 500)
                test.is_true(checked)
                test.is_true(point_lookup, "a bounded delete scans the status population")
            end
            db:release()
        end)

        test.it("locks a PostgreSQL batch with bounded database round trips", function()
            local db = open_queue()
            if tostring(db:type()) == sql.type.POSTGRES then
                local owner = uuid.v7()
                local id = seed_job(db, owner)
                job_fixture.seed_runs(db, 10, id, owner, "2000-01-01T00:00:00Z")
                local locks = 0
                local probe = {
                    type = function() return db:type() end,
                    query = function(_, statement, params) return db:query(statement, params) end,
                    begin = function()
                        local tx = required(db:begin())
                        return {
                            query = function(_, statement, params)
                                if string.find(statement, "FOR UPDATE", 1, true) then locks = locks + 1 end
                                return tx:query(statement, params)
                            end,
                            execute = function(_, statement, params) return tx:execute(statement, params) end,
                            commit = function() return tx:commit() end,
                            rollback = function() return tx:rollback() end,
                        }, nil
                    end,
                }
                test.eq(required(retention.prune_runs(probe, nil, "2001-01-01T00:00:00Z", 10, true)), 10)
                test.eq(locks, 2, "one ordered job lock query and one ordered run lock query per batch")
            end
            db:release()
        end)

        test.it("drains multiple run batches and retains rows inside the window", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local policy = required(config.policy())
            local owner = uuid.v7()
            local job_id = seed_job(db, owner)
            local total = policy.retention_batch * 3 + 1
            job_fixture.seed_runs(db, total, job_id, owner, "2000-01-01T00:00:00Z")
            required(db:execute([[INSERT INTO kickside_job_run
                (id,job_id,owner_kind,owner_id,job_type,attempt_no,execution_seq,status,lease_token,started_at,finished_at)
                VALUES ($1,$2,'test',$3,'test.retention',1,$4,'success','seed',$5,$5)]],
                {uuid.v7(), job_id, owner, total + 1001, "2099-01-01T00:00:00Z"}))
            local totals, passes = drain(db, time.now())
            test.eq(totals.job_runs, total)
            test.is_true(passes < 10)
            local rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job_run WHERE job_id=$1", {job_id}))
            test.eq(tonumber(rows[1].n), 1)
            required(db:execute("DELETE FROM kickside_job_run WHERE job_id=$1", {job_id}))
            required(db:execute("DELETE FROM kickside_job WHERE id=$1", {job_id}))
            db:release()
        end)

        test.it("drains each retained table across batch boundaries", function()
            local db = open_queue()
            local total = required(config.policy()).retention_batch * 2 + 1
            local numbers = tostring(db:type()) == sql.type.POSTGRES
                and "SELECT generate_series(1," .. tostring(total) .. ") AS n"
                or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<"
                    .. tostring(total) .. ") SELECT n FROM seq"
            local key = "'retained-' || CAST(n AS TEXT)"
            local id = tostring(db:type()) == sql.type.POSTGRES and "md5(CAST(n AS TEXT))::uuid"
                or "lower(hex(randomblob(16)))"
            local old = tostring(db:type()) == sql.type.POSTGRES
                and "CAST('2000-01-01T00:00:00Z' AS TIMESTAMPTZ)" or "'2000-01-01T00:00:00Z'"
            local statements = {
                "INSERT INTO kickside_job(id,owner_kind,owner_id,job_type,status,job_identity,finished_at) SELECT "
                    .. id .. ",'test'," .. key .. ",'test.retention','done'," .. key .. "," .. old,
                "INSERT INTO kickside_job_worker(id,registry_version,last_seen_at) SELECT " .. key .. ",'v1'," .. old,
                "INSERT INTO kickside_wake_fanout(key) SELECT " .. key,
                "INSERT INTO kickside_job_thread_cleanup(thread_id,completed_at) SELECT " .. key .. ",'2000-01-01T00:00:00Z'",
                "INSERT INTO kickside_job_thread_cleanup_receipt(thread_id,page_seq,processed,done,discarded_json,unresolved_json,created_at,acknowledged_at) SELECT "
                    .. key .. ",0,0,true,'[]','[]','2000-01-01T00:00:00Z','2000-01-01T00:00:00Z'",
            }
            for _, statement in ipairs(statements) do required(db:execute(statement .. " FROM (" .. numbers .. ") numbered")) end
            local totals = drain(db, time.now())
            for _, field in ipairs({"jobs", "workers", "wake_rows", "thread_cleanup_receipts", "thread_cleanup_fences"}) do
                test.eq(totals[field], total, field .. " drains to completion")
            end
            db:release()
        end)

        test.it("reclaims stale worker pulses in the worker prune transaction", function()
            local db = open_queue()
            required(db:execute([[INSERT INTO kickside_job_worker(id,registry_version,last_seen_at)
                VALUES ('retired','v1','2000-01-01T00:00:00Z')]]))
            required(db:execute([[INSERT INTO kickside_job_worker_pulse(worker_id,registry_version,last_seen_at)
                VALUES ('retired','v1','2000-01-01T00:00:00Z')]]))
            local probe = {
                type = function() return db:type() end,
                query = function(_, statement, params) return db:query(statement, params) end,
                begin = function()
                    local tx = required(db:begin())
                    return {
                        query = function(_, statement, params) return tx:query(statement, params) end,
                        execute = function(_, statement, params)
                            if string.find(statement, "DELETE FROM kickside_job_worker WHERE", 1, true) then
                                return nil, errors.new("worker deletion refused")
                            end
                            return tx:execute(statement, params)
                        end,
                        rollback = function() return tx:rollback() end,
                    }, nil
                end,
            }
            local removed, err = retention.prune_workers(probe, "2001-01-01T00:00:00Z", 1)
            test.is_nil(removed)
            test.not_nil(err)
            local kept = required(db:query("SELECT worker_id FROM kickside_job_worker_pulse WHERE worker_id='retired'"))
            test.eq(#kept, 1, "a failed worker deletion rolls its pulse deletion back")
            test.eq(required(retention.prune_workers(db, "2001-01-01T00:00:00Z", 1)), 1)
            local rows = required(db:query("SELECT worker_id FROM kickside_job_worker_pulse WHERE worker_id='retired'"))
            test.eq(#rows, 0, "worker removal also reclaims its pulse")
            db:release()
        end)

        test.it("drains stale heartbeat pulses and preserves pulses inside the window", function()
            local db = open_queue()
            local total = required(config.policy()).retention_batch * 2 + 1
            local numbers = tostring(db:type()) == sql.type.POSTGRES
                and "SELECT generate_series(1," .. tostring(total) .. ") AS n"
                or "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<"
                    .. tostring(total) .. ") SELECT n FROM seq"
            required(db:execute([[INSERT INTO kickside_job_worker_pulse(worker_id,registry_version,last_seen_at)
                SELECT 'expired-' || CAST(n AS TEXT),'v1','2000-01-01T00:00:00Z' FROM (]] .. numbers .. ") numbered"))
            required(db:execute([[INSERT INTO kickside_job_worker_pulse(worker_id,registry_version,last_seen_at)
                VALUES ('current','v1','2099-01-01T00:00:00Z')]]))
            required(db:execute([[INSERT INTO kickside_job_worker(id,registry_version,last_seen_at)
                VALUES ('current','v1','2000-01-01T00:00:00Z')]]))
            drain(db, time.now())
            local rows = required(db:query("SELECT worker_id FROM kickside_job_worker_pulse"))
            test.eq(#rows, 1)
            test.eq(rows[1].worker_id, "current")
            rows = required(db:query("SELECT id FROM kickside_job_worker WHERE id='current'"))
            test.eq(#rows, 1, "a current pulse preserves a long-lived worker")
            db:release()
        end)

        test.it("keeps a live worker with a running job under a job retention shorter than its heartbeat", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            with_policy({retention_jobs_ms = 1000, retention_job_runs_ms = 1000}, function()
                local lease_seconds = required(config.policy()).lease_timeout_seconds
                test.is_true(lease_seconds > 3)
                local worker_id, job_id = running_worker(db)
                seen(db, worker_id, 3)
                for _ = 1, 3 do drain(db, time.now()) end
                local workers = required(db:query("SELECT current_job_id FROM kickside_job_worker WHERE id=$1", {worker_id}))
                test.eq(#workers, 1, "a worker inside the lease timeout keeps its registration")
                test.eq(workers[1].current_job_id, job_id)
                test.is_nil(heartbeat.pulse(db, dbtype, worker_id, "v1"), "the next heartbeat finds its registration")
                local jobs = required(db:query("SELECT status FROM kickside_job WHERE id=$1", {job_id}))
                test.eq(jobs[1].status, "running")
            end)
            db:release()
        end)

        test.it("keeps a heartbeating worker for the minimum lease timeout", function()
            local db = open_queue()
            with_policy({lease_timeout_seconds = 1, lease_heartbeat_ms = 250,
                    retention_jobs_ms = 1, retention_job_runs_ms = 1}, function()
                local worker_id, job_id = running_worker(db)
                local initial = required(db:query("SELECT last_seen_at FROM kickside_job_worker_pulse WHERE worker_id=$1", {worker_id}))[1].last_seen_at
                local lifecycle = process.events()
                local pid, spawn_err = process.spawn_linked_monitored("app:retention_heartbeat", config.process_host(),
                    {worker_id = worker_id, registry_version = "v1"})
                test.is_nil(spawn_err)
                test.not_nil(pid)
                local ok, err = pcall(function()
                    local function pulse(): string
                        local rows = required(db:query("SELECT last_seen_at FROM kickside_job_worker_pulse WHERE worker_id=$1", {worker_id}))
                        test.eq(#rows, 1, "retention preserves the live pulse")
                        return rows[1].last_seen_at
                    end
                    local ready = time.now():add(500 * time.MILLISECOND)
                    repeat
                        time.sleep("10ms")
                    until pulse() ~= initial or time.now():after(ready)
                    local first = pulse()
                    test.is_true(first ~= initial, "the heartbeat process starts pulsing")
                    local deadline = time.now():add(800 * time.MILLISECOND)
                    repeat
                        drain(db, time.now())
                        time.sleep("25ms")
                    until pulse() ~= first or time.now():after(deadline)
                    test.is_true(pulse() ~= first, "worker pulses leave scheduling margin inside the minimum lease")
                    local finish = time.now():add(2 * time.SECOND)
                    repeat
                        drain(db, time.now())
                        local workers = required(db:query("SELECT current_job_id FROM kickside_job_worker WHERE id=$1", {worker_id}))
                        test.eq(#workers, 1)
                        test.eq(workers[1].current_job_id, job_id)
                        time.sleep("25ms")
                    until time.now():after(finish)
                    test.eq(required(db:query("SELECT status FROM kickside_job WHERE id=$1", {job_id}))[1].status, "running")
                end)
                local stop_err = heartbeat.stop(tostring(pid))
                test.is_nil(stop_err)
                local stopped = time.after("5s")
                while true do
                    local selected = channel.select({lifecycle:case_receive(), stopped:case_receive()})
                    test.is_true(selected.channel == lifecycle, "the owned heartbeat exits")
                    local event = selected.value
                    if type(event) == "table" and event.kind == process.event.EXIT and tostring(event.from) == tostring(pid) then
                        test.is_nil(event.result.error)
                        break
                    end
                end
                if not ok then error(err) end
                seen(db, worker_id, 2)
                drain(db, time.now())
                test.eq(#required(db:query("SELECT id FROM kickside_job_worker WHERE id=$1", {worker_id})), 0,
                    "a stopped worker expires at the minimum lease timeout")
                test.eq(#required(db:query("SELECT worker_id FROM kickside_job_worker_pulse WHERE worker_id=$1", {worker_id})), 0)
            end)
            db:release()
        end)

        test.it("prunes a worker whose heartbeat is older than the lease timeout under a long job retention", function()
            local db = open_queue()
            with_policy({retention_jobs_ms = 30 * 86400000}, function()
                local lease_seconds = required(config.policy()).lease_timeout_seconds
                local worker_id = uuid.v7()
                test.is_nil(heartbeat.mark(db, tostring(db:type()), worker_id, "v1"))
                seen(db, worker_id, lease_seconds + 60)
                drain(db, time.now())
                local workers = required(db:query("SELECT id FROM kickside_job_worker WHERE id=$1", {worker_id}))
                test.eq(#workers, 0, "a worker past the lease timeout is no longer live")
                local pulses = required(db:query("SELECT worker_id FROM kickside_job_worker_pulse WHERE worker_id=$1", {worker_id}))
                test.eq(#pulses, 0)
            end)
            db:release()
        end)

        test.it("bounds a live worker pulse history to one current row", function()
            local db = open_queue()
            local dbtype = tostring(db:type())
            local worker_id = uuid.v7()
            test.is_nil(heartbeat.mark(db, dbtype, worker_id, "v1"))
            for _ = 1, 20 do test.is_nil(heartbeat.pulse(db, dbtype, worker_id, "v1")) end
            drain(db, time.now())
            local rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job_worker_pulse WHERE worker_id=$1", {worker_id}))
            test.eq(tonumber(rows[1].n), 1)
            db:release()
        end)

        test.it("keeps up with hourly cohorts at the default retention policy", function()
            local db = open_queue()
            local policy = required(config.policy())
            test.eq(policy.retention_batch, 500)
            test.eq(policy.retention_interval_ms, 3600000)
            test.eq(policy.retention_job_runs_ms, 30 * 24 * 3600000)
            local rate = 2000
            local owner = uuid.v7()
            local job_id = seed_job(db, owner)
            local live = seed_job(db, owner)
            job_fixture.seed_runs(db, 1, live, owner, "2099-01-01T00:00:00Z")
            -- Advance only the expired frontier of a full retention window;
            -- the in-window population is rate * window and stays untouched.
            for hour = 1, 24 do
                job_fixture.seed_runs(db, rate, job_id, owner, "2000-01-01T00:00:00Z")
                local totals, passes = drain(db, time.now())
                test.eq(totals.job_runs, rate, "the hourly cohort never accumulates expired rows")
                test.eq(passes, 5)
                local rows = required(db:query("SELECT COUNT(*) AS n FROM kickside_job_run"))
                test.eq(tonumber(rows[1].n), 1)
            end
            db:release()
        end)
    end)
end
return {run = test.run_cases(define_tests)}
