local test = require("test")
local owner_hooks = require("owner_hooks")
local sql = require("sql")
local uuid = require("uuid")
local time = require("time")
local process = require("process")
local channel = require("channel")
local threads_writer = require("threads_writer")
local retention_repo = require("retention_repo")
local runner = require("retention_runner")
local sweeper = require("sweeper")
local pin = require("pin")
local receipts = require("write_receipt")
local retention_policy = require("retention_policy")
local receipt_purge = require("receipt_purge")

local function stamp(db: sql.DB, instant: any): string
    local dbtype = tostring(db:type())
    if dbtype == sql.type.SQLITE then
        return instant:utc():format("2006-01-02 15:04:05.000000")
    end
    return instant:utc():format(time.RFC3339)
end

local function make_thread(db: sql.DB): string
    local id = uuid.v7()
    local _, err = sql.builder.insert("kickside_thread")
        :set_map({ id = id, thread_class = "retention_service_test", component_id = "",
            event_count = 0 })
        :run_with(db):exec()
    if err then error("retention service thread insert failed: " .. tostring(err)) end
    return id
end

local function add_event(db: sql.DB, thread_id: string, created_at: string): ()
    local result, err = threads_writer.ingest_events_batch(db, thread_id, {
        system = true,
        events = { { type = "retention.service.test", body_json = "{}", created_at = created_at } },
    })
    if err or not result then error("retention service event append failed: " .. tostring(err)) end
end

local function count_events(db: sql.DB, thread_id: string): integer
    local rows, err = db:query("SELECT COUNT(*) AS n FROM kickside_event WHERE thread_id=$1", { thread_id })
    if err or type(rows) ~= "table" then error("retention service event count failed: " .. tostring(err)) end
    return tonumber((rows :: table[])[1].n) :: integer
end

local function earlier_deadline(first: integer?, second: integer): integer
    return first == nil and second or math.min(first :: integer, second)
end

local function reserve_receipt(db: sql.DB, sink_id: string, key: string): ()
    local tx, begin_err = db:begin()
    if begin_err or not tx then error("receipt reservation transaction failed: " .. tostring(begin_err)) end
    local _, reserve_err = receipts.reserve(tx :: sql.Transaction, {
        sink_id = sink_id,
        idempotency_key = key,
        identity_key = "service-test:" .. key,
        payload_hash = "service-test-hash",
        created_at = stamp(db, time.now()),
        owner_locator = { kind = "service-test", id = sink_id },
    })
    if reserve_err then tx:rollback(); error("receipt reservation failed: " .. tostring(reserve_err)) end
    local _, commit_err = tx:commit()
    if commit_err then error("receipt reservation commit failed: " .. tostring(commit_err)) end
end

local function policy_with_batch(load, batch)
    return function()
        local policy, err = load()
        if err then return nil, err end
        local result = {}
        for key, value in pairs(policy) do result[key] = value end
        result.batch_events = batch
        return result, nil
    end
end

local function define_tests()
    test.describe("Core retention service runner", function()
        test.it("bounds global discovery and visits later pages even when the first page deletes nothing", function()
            local db = assert(sql.get("app:db"))
            local dialect = tostring(db:type())
            local id = "'00000000-0000-0000-0000-' || substr('000000000000' || CAST(n AS text), length(CAST(n AS text)) + 1)"
            local thread_id = dialect == sql.type.POSTGRES and "(" .. id .. ")::uuid" or id
            local table_size, batch = 4096, 8
            local final_id = "00000000-0000-0000-0000-000000004096"
            local first_id = "00000000-0000-0000-0000-000000000001"
            local old, recent = stamp(db, time.now():add(-60 * 24 * time.HOUR)), stamp(db, time.now())
            assert(db:execute([[WITH RECURSIVE numbers(n) AS
                (SELECT 1 UNION ALL SELECT n+1 FROM numbers WHERE n<]] .. table_size .. [[)
                INSERT INTO kickside_thread (id, thread_class) SELECT ]] .. thread_id ..
                ", 'retention_discovery_test' FROM numbers"))
            assert(db:execute([[INSERT INTO kickside_event (id, thread_id, type, seq, created_at)
                SELECT id,id,'retention.discovery',1,CASE WHEN id=$1 THEN CAST($2 AS ]] ..
                (dialect == sql.type.POSTGRES and "timestamptz" or "text") ..
                [[) ELSE $3 END FROM kickside_thread WHERE thread_class='retention_discovery_test']],
                { final_id, old, recent }))
            assert(db:execute([[INSERT INTO kickside_projection (id,thread_id,kind,projection_key)
                VALUES($1,$1,'retention_discovery','plan')]], {first_id}))
            assert(db:execute([[INSERT INTO kickside_projection_cursor
                (id,projection_id,thread_id,cursor_key,last_seq)
                SELECT id,$1,$1,CAST(id AS text),1 FROM kickside_thread
                WHERE thread_class='retention_discovery_test']], {first_id}))
            assert(db:execute("ANALYZE kickside_thread"))
            assert(db:execute("ANALYZE kickside_event"))
            assert(db:execute("ANALYZE kickside_projection_cursor"))

            local original_policy = retention_policy.policy
            retention_policy.policy = policy_with_batch(original_policy, batch)
            local reads = 0
            local probe = {
                type = function() return db:type() end,
                begin = function() return db:begin() end,
                execute = function(_, statement, params) return db:execute(statement, params) end,
                query = function(_, statement, params)
                    local rows = assert(db:query(statement, params))
                    if string.find(statement, "kickside_thread", 1, true) and string.find(statement, "kickside_event", 1, true) then
                        reads = reads + 1
                        test.is_true(#rows <= batch, "discovery returns more than a page")
                        if reads <= 2 then
                            local plan = assert(db:query((dialect == sql.type.POSTGRES
                                and "EXPLAIN ANALYZE " or "EXPLAIN QUERY PLAN ") .. statement, params))
                            local protection_seek = false
                            for _, row in ipairs(plan) do
                                local detail = tostring(row["QUERY PLAN"] or row.detail)
                                if dialect == sql.type.POSTGRES then
                                    local returned, loops = string.match(detail, "actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                                    local removed = tonumber((string.match(detail, "Rows Removed by [%a ]+: (%d+)"))) or 0
                                    test.is_true(removed <= batch, detail)
                                    local visited, repeats = tonumber(returned), tonumber(loops)
                                    if visited and repeats then test.is_true(visited * repeats <= batch, detail) end
                                    test.is_nil(string.find(detail, "Seq Scan on kickside_", 1, true), detail)
                                    if string.find(detail, "Index Cond:", 1, true)
                                        and string.find(detail, "last_seq <", 1, true) then protection_seek = true end
                                else
                                    test.is_nil(string.find(detail, "SCAN e ", 1, true), detail)
                                    if reads == 2 then
                                        test.is_nil(string.find(detail, "SCAN kickside_thread", 1, true), detail)
                                    end
                                    if string.find(detail, "last_seq<?", 1, true) then protection_seek = true end
                                end
                            end
                            if reads == 1 then test.is_true(protection_seek, "cursor eligibility uses a bounded index seek") end
                        end
                    end
                    return rows, nil
                end,
            }
            local ok, failure = pcall(function()
                local state = {}
                local pass = assert(runner.recover(probe :: any, tostring(process.pid()), state))
                test.eq(pass.stats.events, 0)
                test.eq(reads, 1, "recovery and deadline discovery share one page")
                test.is_true(pass.stats.needs_continue)
                local now_ms = math.floor(time.now():unix_nano() / 1000000)
                for _ = 2, table_size / batch + 2 do
                    test.is_true(pass.deadline_ms <= now_ms, "another page runs immediately")
                    pass = assert(runner.on_deadline(probe :: any, tostring(process.pid()), state))
                    if pass.stats.events > 0 then break end
                end
                test.eq(count_events(db, final_id), 0)
                test.is_true(reads >= table_size / batch)
                if pass.stats.needs_continue then
                    pass = assert(runner.on_deadline(probe :: any, tostring(process.pid()), state))
                end
                test.is_true(not pass.stats.needs_continue)
                local expected = assert(sweeper.deadline_ms(recent, assert(original_policy()).events_ms, dialect))
                test.is_true(pass.deadline_ms <= expected, "the final page includes earlier head deadlines")
                test.eq(pass.deadline_ms, assert(sweeper.next_deadline_ms(db)))
            end)
            retention_policy.policy = original_policy
            assert(db:execute("DELETE FROM kickside_thread WHERE thread_class='retention_discovery_test'"))
            db:release()
            if not ok then error(failure) end
        end)

        test.it("shares the event batch across distinct scoped wakes and skips unrelated heads", function()
            local db = assert(sql.get("app:db"))
            local old = stamp(db, time.now():add(-60 * 24 * time.HOUR))
            local unrelated = make_thread(db)
            add_event(db, unrelated, old)
            local changes: table[] = {}
            local thread_ids: {string} = {}
            for index = 1, 7 do
                local id = make_thread(db)
                add_event(db, id, old)
                thread_ids[index] = id
                changes[index] = index == 1 and {kind = "events_appended", thread_ids = {"thread:" .. id, id}}
                    or {kind = "events_appended", thread_id = id}
            end
            local original_policy, original_run = retention_policy.policy, sweeper.run
            local global_calls = 0
            retention_policy.policy = policy_with_batch(original_policy, 3)
            sweeper.run = function(handle)
                global_calls = global_calls + 1
                return original_run(handle)
            end
            local mailbox = process.listen("kickside.core.retention.changed")
            local ok, failure = pcall(function()
                local pid = tostring(process.pid())
                local armed = math.floor(time.now():unix_nano() / 1000000) - 1
                local pass = assert(runner.on_wakes(db, pid, changes, {}, armed))
                local remaining = 0
                for _, id in ipairs(thread_ids) do remaining = remaining + count_events(db, id) end
                test.eq(pass.stats.events, 3)
                test.eq(remaining, 4)
                test.eq(count_events(db, unrelated), 1)
                test.eq(global_calls, 0)
                test.eq(pass.deadline_ms, armed)
                test.is_true(pass.stats.needs_continue)
                local deleted = pass.stats.events
                for _ = 1, #changes do
                    if not pass.stats.needs_continue then break end
                    local next_wake = channel.select({mailbox:case_receive(), default = true})
                    test.eq(next_wake.channel, mailbox)
                    pass = assert(runner.on_wakes(db, pid, {next_wake.value}, {}, armed))
                    test.is_true(pass.stats.events <= 3)
                    deleted = deleted + pass.stats.events
                end
                test.eq(deleted, #changes)
                test.eq(count_events(db, unrelated), 1)
                test.eq(global_calls, 0)
            end)
            process.unlisten(mailbox)
            retention_policy.policy, sweeper.run = original_policy, original_run
            assert(db:execute("DELETE FROM kickside_thread WHERE id=$1", {unrelated}))
            for _, id in ipairs(thread_ids) do
                assert(db:execute("DELETE FROM kickside_thread WHERE id=$1", {id}))
            end
            db:release()
            if not ok then error(failure) end
        end)

        test.it("bounds receipt discovery when many rows share a completion timestamp", function()
            local db = assert(sql.get("app:db"))
            local dialect = tostring(db:type())
            local sink = "retention-service:" .. uuid.v7()
            assert(db:execute([[WITH RECURSIVE numbers(n) AS
                (SELECT 1 UNION ALL SELECT n+1 FROM numbers WHERE n<4096)
                INSERT INTO kickside_write_receipt
                    (sink_id,idempotency_key,identity_key,payload_hash,status,created_at,completed_at)
                SELECT $1,CAST(n AS text),'receipt','retention','committed','1980-01-01T00:00:00Z',
                    '1980-01-01T00:00:00Z' FROM numbers]], {sink}))
            assert(db:execute("ANALYZE kickside_write_receipt"))
            local checked = false
            local probe = {
                begin = function() return db:begin() end,
                query = function(_, statement, params)
                    local plan = assert(db:query((dialect == sql.type.POSTGRES
                        and "EXPLAIN ANALYZE " or "EXPLAIN QUERY PLAN ") .. statement, params))
                    for _, row in ipairs(plan) do
                        local detail = tostring(row["QUERY PLAN"] or row.detail)
                        local actual = tonumber((string.match(detail, "actual time=[^ ]+ rows=(%d+)")))
                        if actual then test.is_true(actual <= 8, detail) end
                        test.is_nil(string.find(detail, "TEMP B-TREE", 1, true), detail)
                        if string.find(detail, "idx_write_receipt_committed", 1, true) then checked = true end
                    end
                    return db:query(statement, params)
                end,
            }
            local ok, failure = pcall(function()
                local purged = assert(receipt_purge.run(probe, "1990-01-01T00:00:00Z", 8))
                test.eq(purged.deleted, 8)
                test.is_true(checked)
            end)
            assert(db:execute("DELETE FROM kickside_write_receipt WHERE sink_id=$1", {sink}))
            db:release()
            if not ok then error(failure) end
        end)

        test.it("keeps recent event heads inside Postgres storage during a recovery pass", function()
            local db = assert(sql.get("app:db"))
            local recent: { [string]: boolean } = {}
            for index = 1, 3 do
                local id = make_thread(db)
                add_event(db, id, stamp(db, time.now():add(index * time.HOUR)))
                local rows, read_err = db:query("SELECT created_at FROM kickside_event WHERE thread_id=$1", { id })
                test.is_nil(read_err)
                recent[tostring(rows[1].created_at)] = true
            end
            local original_deadline = sweeper.deadline_ms
            local event_parses = 0
            sweeper.deadline_ms = function(stored, window, dialect)
                if recent[stored] then event_parses = event_parses + 1 end
                return original_deadline(stored, window, dialect)
            end
            local result, run_err = sweeper.run(db)
            sweeper.deadline_ms = original_deadline
            local dialect = tostring(db:type())
            db:release()
            test.is_nil(run_err)
            test.not_nil(result)
            if dialect == sql.type.POSTGRES then
                test.eq(event_parses, 0, "recent timestamp heads must be filtered in storage")
            else
                test.eq(event_parses, 3, "SQLite validates every recent fixture text timestamp")
            end
        end)

        test.it("coalesces unscoped durable changes into one recovery and preserves scoped owner requests", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            if not db then error("retention database is absent") end
            local original_sweep, original_owners, original_deadline = sweeper.run, owner_hooks.run, sweeper.next_receipt_deadline_ms
            local sweeps, deadlines = 0, 0
            local requests: table[] = {}
            sweeper.run = function(handle)
                sweeps = sweeps + 1
                return original_sweep(handle)
            end
            sweeper.next_receipt_deadline_ms = function(handle)
                deadlines = deadlines + 1
                return original_deadline(handle)
            end
            owner_hooks.run = function(change)
                requests[#requests + 1] = { change = change }
                return original_owners(change)
            end
            local ok, failure = pcall(function()
                local changes: table[] = {}
                for _ = 1, 50 do changes[#changes + 1] = { kind = "events_appended" } end
                local pass, pass_err = runner.on_wakes(db, "retention-test", changes)
                test.is_nil(pass_err)
                test.not_nil(pass)
                test.eq(sweeps, 1)
                test.eq(deadlines, 1)
                test.eq(#requests, 1)
                test.is_nil(requests[1].change)
                local scoped = { kind = "lease_released", owner_locator = { kind = "component", id = "scope" } }
                local next_pass, next_err = runner.on_wakes(db, "retention-test", { scoped })
                test.is_nil(next_err)
                test.not_nil(next_pass)
                test.eq(sweeps, 2)
                test.eq(deadlines, 2)
                test.eq(requests[2].change.owner_locator.id, "scope")
            end)
            sweeper.run, owner_hooks.run, sweeper.next_receipt_deadline_ms = original_sweep, original_owners, original_deadline
            db:release()
            if not ok then error(failure) end
        end)

        test.it("wakes from an empty snapshot and arms the new event's exact stored deadline", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            test.not_nil(db)
            local _db = db :: sql.DB
            local thread_id = make_thread(_db)
            local _, policy_err = retention_repo.upsert(_db, thread_id, {
                event_hot_retention_days = 1, archive_mode = "tombstone_only", enabled = true,
            })
            test.is_nil(policy_err)

            local _, idle_err = runner.recover(_db, "retention-test")
            test.is_nil(idle_err)

            local created_at = stamp(_db, time.now())
            add_event(_db, thread_id, created_at)
            local wake, wake_err = runner.on_wake(_db, "retention-test", { kind = "events_appended" })
            test.is_nil(wake_err)
            local expected, expected_err = sweeper.deadline_ms(created_at, 86400000, tostring(_db:type()))
            test.is_nil(expected_err)
            local current, current_err = sweeper.next_deadline_ms(_db)
            test.is_nil(current_err)
            test.not_nil(current)
            test.eq((wake :: table).deadline_ms, current,
                "the service must arm the earliest exact deadline returned by Core storage")
            test.is_true((current :: integer) <= (expected :: integer),
                "the event's own deadline must be included in the service's exact deadline set")
            test.eq(count_events(_db, thread_id), 1)
            _db:release()
        end)

        test.it("boot recovery prunes an eligible row left durable across a service restart", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            test.not_nil(db)
            local _db = db :: sql.DB
            local thread_id = make_thread(_db)
            local _, policy_err = retention_repo.upsert(_db, thread_id, {
                event_hot_retention_days = 1, archive_mode = "tombstone_only", enabled = true,
            })
            test.is_nil(policy_err)
            add_event(_db, thread_id, stamp(_db, time.now():add(-2 * 24 * time.HOUR)))
            test.eq(count_events(_db, thread_id), 1)

            local recovered, recover_err = runner.recover(_db, "retention-restarted")
            test.is_nil(recover_err)
            test.is_true(((recovered :: table).stats :: table).events >= 1)
            test.eq(count_events(_db, thread_id), 0)
            _db:release()
        end)

        test.it("a pin release wake rechecks a previously blocked eligible head", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            test.not_nil(db)
            local _db = db :: sql.DB
            local thread_id = make_thread(_db)
            local _, policy_err = retention_repo.upsert(_db, thread_id, {
                event_hot_retention_days = 1, archive_mode = "tombstone_only", enabled = true,
            })
            test.is_nil(policy_err)
            local protected, protect_err = pin.pin_lower(_db, {
                thread_id = thread_id, consumer_key = "service-test", command_id = "pin-service-test",
                command_generation = 1, target_cursor = 0,
            })
            test.is_nil(protect_err)
            test.not_nil(protected)
            local baseline_deadline, baseline_err = sweeper.next_deadline_ms(_db)
            test.is_nil(baseline_err)
            add_event(_db, thread_id, stamp(_db, time.now():add(-2 * 24 * time.HOUR)))
            local blocked_deadline, blocked_deadline_err = sweeper.next_deadline_ms(_db)
            test.is_nil(blocked_deadline_err)
            test.eq(blocked_deadline, baseline_deadline,
                "a pinned head adds no timer before its owner releases the pin")
            local blocked, recover_err = runner.recover(_db, "retention-pin-test")
            test.is_nil(recover_err)
            test.not_nil(blocked)
            test.eq(count_events(_db, thread_id), 1)

            local released, release_err = pin.pin_release(_db, {
                thread_id = thread_id, consumer_key = "service-test", expected_pin_generation = 1,
                terminal_op_id = "release-service-test",
            })
            test.is_nil(release_err)
            test.not_nil(released)
            local awakened, wake_err = runner.on_wake(_db, "retention-pin-test", { kind = "pin_released" })
            test.is_nil(wake_err)
            test.is_true(((awakened :: table).stats :: table).events >= 1)
            test.eq(count_events(_db, thread_id), 0)
            _db:release()
        end)

        test.it("a cursor-advance wake rechecks a previously blocked eligible head", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            test.not_nil(db)
            local _db = db :: sql.DB
            local thread_id = make_thread(_db)
            local _, policy_err = retention_repo.upsert(_db, thread_id, {
                event_hot_retention_days = 1, archive_mode = "tombstone_only", enabled = true,
            })
            test.is_nil(policy_err)
            local event_at = stamp(_db, time.now():add(-2 * 24 * time.HOUR))
            local baseline_deadline, baseline_err = sweeper.next_deadline_ms(_db)
            test.is_nil(baseline_err)
            add_event(_db, thread_id, event_at)
            local projection_id, cursor_id = uuid.v7(), uuid.v7()
            local _, projection_err = sql.builder.insert("kickside_projection")
                :set_map({ id = projection_id, thread_id = thread_id, kind = "service_test",
                    projection_key = "cursor-wake", last_event_seq = 0 })
                :run_with(_db):exec()
            test.is_nil(projection_err)
            local _, cursor_err = sql.builder.insert("kickside_projection_cursor")
                :set_map({ id = cursor_id, projection_id = projection_id, thread_id = thread_id,
                    last_seq = 0, status = "active" })
                :run_with(_db):exec()
            test.is_nil(cursor_err)

            local blocked_deadline, blocked_deadline_err = sweeper.next_deadline_ms(_db)
            test.is_nil(blocked_deadline_err)
            test.eq(blocked_deadline, baseline_deadline,
                "an active cursor below the event head adds no timer until it advances")
            local blocked, recover_err = runner.recover(_db, "retention-cursor-test")
            test.is_nil(recover_err)
            test.not_nil(blocked)
            test.eq(count_events(_db, thread_id), 1)

            local _, advance_err = _db:execute("UPDATE kickside_projection_cursor SET last_seq=1 WHERE id=$1", { cursor_id })
            test.is_nil(advance_err)
            local awakened, wake_err = runner.on_wake(_db, "retention-cursor-test", { kind = "projection_cursor_advanced" })
            test.is_nil(wake_err)
            test.is_true(((awakened :: table).stats :: table).events >= 1)
            test.eq(count_events(_db, thread_id), 0)
            _db:release()
        end)

        test.it("a committed receipt resolution wake arms its stored purge deadline", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            test.not_nil(db)
            local _db = db :: sql.DB
            local sink_id = "retention-service:" .. uuid.v7()
            local key = "receipt-resolution"
            local recovered, recover_err = runner.recover(_db, "retention-receipt-test")
            test.is_nil(recover_err)
            test.not_nil(recovered)
            reserve_receipt(_db, sink_id, key)

            local completed_at = stamp(_db, time.now())
            local settled, settle_err = receipts.resolve_pending({
                sink_id = sink_id,
                idempotency_key = key,
                config = { service_test = true },
                reconcile_binding = {
                    lookup = function(_request: table): (table, error?)
                        return { state = "settled_committed", dest_refs = {}, outcome = {} }, nil
                    end,
                },
                completed_at = completed_at,
            })
            test.is_nil(settle_err)
            test.eq((settled :: table).state, "committed")

            local policy, policy_err = retention_policy.policy()
            test.is_nil(policy_err)
            local row_deadline, row_deadline_err = sweeper.deadline_ms(completed_at,
                (policy :: table).receipts_orphan_ms, tostring(_db:type()))
            test.is_nil(row_deadline_err)
            local awakened, wake_err = runner.on_wake(_db, "retention-receipt-test", { kind = "receipt_resolution" })
            test.is_nil(wake_err)
            local armed = (awakened :: table).deadline_ms
            test.not_nil(armed, "receipt settlement must leave a known deadline armed")
            test.is_true((armed :: integer) <= (row_deadline :: integer),
                "the next service deadline must not skip the committed receipt's exact deadline")
            _db:release()
        end)

        test.it("a per-thread policy change wake recomputes the event deadline", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            test.not_nil(db)
            local _db = db :: sql.DB
            local thread_id = make_thread(_db)
            local _, policy_err = retention_repo.upsert(_db, thread_id, {
                event_hot_retention_days = 1, archive_mode = "tombstone_only", enabled = true,
            })
            test.is_nil(policy_err)
            local created_at = stamp(_db, time.now())
            add_event(_db, thread_id, created_at)
            local baseline, baseline_err = sweeper.next_deadline_ms(_db)
            test.is_nil(baseline_err)

            local _, update_err = retention_repo.upsert(_db, thread_id, {
                event_hot_retention_days = 2, archive_mode = "tombstone_only", enabled = true,
            })
            test.is_nil(update_err)
            local row_deadline, row_deadline_err = sweeper.deadline_ms(created_at, 2 * 86400000,
                tostring(_db:type()))
            test.is_nil(row_deadline_err)
            local expected = earlier_deadline(baseline, row_deadline :: integer)
            local awakened, wake_err = runner.on_wake(_db, "retention-policy-test", { kind = "thread_policy_changed" })
            test.is_nil(wake_err)
            test.eq((awakened :: table).deadline_ms, expected,
                "a committed thread policy change must replace the previous deadline")
            _db:release()
        end)
    end)
end

return test.run_cases(define_tests)
