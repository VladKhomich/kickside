-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local seed = require("prune_scaffold")
local source = require("source")
local time = require("time")
local uuid = require("uuid")
local channel = require("channel")
local process = require("process")
local lifecycle = require("lifecycle")
local lifecycle_impl = require("lifecycle_impl")
local notifier = require("notifier")
local receipts = require("receipts")
local pin = require("pin")
local retention_repo = require("retention_repo")

local cap = 5000
local page_size = 256
local first = "10000000-0000-4000-8000-000000000001"
local middle = "10000000-0000-4000-8000-000000000002"
local last = "ffffffff-ffff-4fff-bfff-ffffffffffff"

local function add_backlogs(): ()
    for _, id in ipairs({first, middle, last}) do
        seed.exec("INSERT INTO kickside_thread (id,thread_class) VALUES ($1,'review_retention')", {id})
        seed.add_bulk_events(id, 2 * cap + 1, 60)
    end
end

local function add_empty_threads(prefix: string, from: integer, to: integer): ()
    local numbers = tostring(from)
    if seed.dialect() == "postgres" then
        seed.exec([[INSERT INTO kickside_thread(id,thread_class)
            SELECT ($1||lpad(n::text,12,'0'))::uuid,'review_retention'
            FROM generate_series(]] .. numbers .. "," .. tostring(to) .. ") AS n", {prefix})
    else
        seed.exec([[WITH RECURSIVE numbers(n) AS (VALUES(]] .. numbers .. [[)
            UNION ALL SELECT n+1 FROM numbers WHERE n<]] .. tostring(to) .. [[)
            INSERT INTO kickside_thread(id,thread_class)
            SELECT printf('%s%012d',$1,n),'review_retention' FROM numbers]], {prefix})
    end
end

local function continue_after_cap(): table
    test.eq(fixture.continuations, fixture.hooks, "each capped pass queues a continuation")
    local change = assert(fixture.continuation)
    test.eq(change.kind, "continue")
    fixture.continuation = nil
    return change
end

local function add_event(id: string, seq: integer, due_seconds: integer, stored_at: string?): ()
    local at = fixture.now():add((due_seconds - 30 * 86400) * time.SECOND):utc()
    local stamp = seed.dialect() == "postgres" and at:format(time.RFC3339)
        or at:format("2006-01-02 15:04:05.000000")
    seed.exec([[INSERT INTO kickside_event (id,thread_id,type,role,body,seq,created_at)
        VALUES ($1,$2,'test','user','{}',$3,$4)]], {uuid.v7(), id, seq, stored_at or stamp})
    seed.exec("UPDATE kickside_thread SET event_count=$1 WHERE id=$2", {seq, id})
end

local function isolate(ids: { string }): ()
    fixture.isolated_ids = ids
    fixture.receipt_sink = "review-retention"
    fixture.at = assert(time.parse(time.RFC3339, "2025-01-01T00:00:00Z"))
end

local function with_retention_mailbox(run: (any) -> ()): ()
    local mailbox = assert(process.listen(notifier.TOPIC))
    assert(process.registry.register(notifier.NAME, nil, process.registry.CONSISTENT))
    local ok, failure = pcall(run, mailbox)
    process.registry.unregister(notifier.NAME, process.registry.CONSISTENT)
    process.unlisten(mailbox)
    if not ok then error(failure) end
end

local function receive_wake(mailbox: any): table
    local selected = channel.select({mailbox:case_receive(), time.after("2s"):case_receive()})
    test.eq(selected.channel, mailbox, "a committed eligibility change sends a retention wake")
    return selected.value
end

local function add_projection(id: string, cursor_id: string, last_seq: integer): ()
    local projection_id = uuid.v4()
    seed.exec("INSERT INTO kickside_projection (id,thread_id,kind) VALUES ($1,$2,'review_retention')", {projection_id, id})
    seed.exec([[INSERT INTO kickside_projection_cursor (id,projection_id,thread_id,last_seq)
        VALUES ($1,$2,$3,$4)]], {cursor_id, projection_id, id, last_seq})
end

return {run = test.run_cases(function()
    test.describe("Retention service traversal", function()
        test.before_each(fixture.reset)
        test.after_each(function()
            seed.exec("DELETE FROM kickside_thread WHERE thread_class='review_retention'", {})
            seed.exec("DELETE FROM kickside_write_receipt WHERE sink_id='review-retention'", {})
        end)

        test.it("reuses its cursor across continuation wakes", function()
            add_backlogs()
            local function assert_turn(a: integer, b: integer, c: integer): ()
                test.eq(seed.boundary_of(first), a, "first thread after pass " .. tostring(fixture.hooks))
                test.eq(seed.boundary_of(middle), b, "middle thread after pass " .. tostring(fixture.hooks))
                test.eq(seed.boundary_of(last), c, "last thread after pass " .. tostring(fixture.hooks))
            end
            fixture.before_select = function(): table?
                if fixture.hooks == 1 then assert_turn(cap, 0, 0); return continue_after_cap() end
                if fixture.hooks == 2 then assert_turn(cap, cap, 0); return continue_after_cap() end
                if fixture.hooks == 3 then assert_turn(cap, cap, cap); return continue_after_cap() end
                assert_turn(2 * cap, cap, cap)
                return nil
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 4)
        end)

        test.it("seeks past a deleted cursor thread", function()
            add_backlogs()
            fixture.before_select = function(): table?
                if fixture.hooks == 1 then
                    test.eq(seed.boundary_of(first), cap)
                    return continue_after_cap()
                end
                if fixture.hooks == 2 then
                    test.eq(seed.boundary_of(middle), cap)
                    seed.exec("DELETE FROM kickside_thread WHERE id=$1", {middle})
                    return continue_after_cap()
                end
                test.eq(seed.boundary_of(last), cap)
                if fixture.hooks == 3 then
                    test.eq(seed.boundary_of(first), cap)
                    return continue_after_cap()
                end
                test.eq(seed.boundary_of(first), 2 * cap)
                return nil
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 4)
        end)

        test.it("starts from the beginning after restart", function()
            add_backlogs()
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(seed.boundary_of(first), cap)
            test.eq(seed.boundary_of(middle), 0)
            fixture.reset()
            _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(seed.boundary_of(first), 2 * cap)
            test.eq(seed.boundary_of(middle), 0)
        end)

        test.it("wraps and finishes receipt cleanup and owner hooks under sustained higher IDs", function()
            seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention')", {first})
            seed.add_bulk_events(first, 2 * cap + 1, 60)
            add_empty_threads("f0000000-0000-4000-8000-", 1, 2 * page_size)
            local suffix = seed.query("SELECT COUNT(*) AS n FROM kickside_thread WHERE id>$1", {first})
            local pass_limit = math.ceil(assert(tonumber(suffix[1].n)) / page_size) + 2
            local last_candidates = 0
            fixture.before_candidate = function(): error?
                if fixture.candidates > last_candidates + 1 then
                    return errors.new({kind = errors.INTERNAL, message = "retention read a second candidate page in one pass"})
                end
                return nil
            end
            fixture.before_select = function(): table?
                test.eq(fixture.candidates - last_candidates, 1, "each pass reads one candidate page")
                test.is_true(fixture.candidate_rows <= fixture.hooks * page_size)
                last_candidates = fixture.candidates
                if fixture.hooks == 1 then
                    test.eq(seed.boundary_of(first), cap)
                    seed.exec([[INSERT INTO kickside_write_receipt
                        (sink_id,idempotency_key,identity_key,payload_hash,status,created_at,completed_at)
                        VALUES ('review-retention','key','identity','hash','committed',
                                '2000-01-01T00:00:00Z','2000-01-01T00:00:00Z')]], {})
                else
                    local receipts = seed.query("SELECT sink_id FROM kickside_write_receipt WHERE sink_id='review-retention'", {})
                    test.eq(#receipts, 0, "the first continuation runs receipt cleanup")
                    if seed.boundary_of(first) == 2 * cap then return nil end
                end
                test.is_true(fixture.hooks < pass_limit, "the initial rotation ends despite newly created higher IDs")
                local from = (fixture.hooks - 1) * page_size + 1
                add_empty_threads("f1000000-0000-4000-8000-", from, from + page_size - 1)
                if fixture.hooks == 1 then return continue_after_cap() end
                return {kind = "events_appended"}
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, pass_limit)
            test.eq(seed.boundary_of(first), 2 * cap)
        end)

        test.it("reads one candidate page on a sparse append wake", function()
            fixture.before_select = function(): table?
                if fixture.hooks == 1 then
                    fixture.candidates, fixture.candidate_rows = 0, 0
                    local existing = #seed.query("SELECT id FROM kickside_thread", {})
                    add_empty_threads("90000000-0000-4000-8000-", 1, 16384 - existing)
                    seed.add_bulk_events("90000000-0000-4000-8000-000000000001", 1, 0)
                    return {kind = "events_appended"}
                end
                return nil
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 2)
            test.eq(fixture.candidates, 1, "candidate queries on the append wake")
            test.eq(fixture.candidate_rows, page_size)
            test.eq(fixture.continuations, 0)
        end)

        test.it("sleeps on the full rotation minimum and sweeps the final thread by the next rotation", function()
            fixture.at = assert(time.parse(time.RFC3339, "2025-01-01T00:00:00Z"))
            for _, id in ipairs({first, last}) do
                seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention')", {id})
            end
            local existing = tonumber(seed.query("SELECT COUNT(*) AS n FROM kickside_thread", {})[1].n)
            add_empty_threads("90000000-0000-4000-8000-", 1, 16384 - math.floor(assert(existing)))
            add_event(first, 1, 120)
            add_event(last, 1, 60)
            add_event(last, 2, 180)
            local pages = 16384 / page_size
            fixture.before_select = function(delay: integer?): any
                local pass = fixture.hooks
                test.eq(fixture.candidates, pass, "one candidate query per pass")
                test.eq(fixture.candidate_rows, pass * page_size, "each pass visits one full page")
                if pass < pages then
                    test.eq(delay, 1, "the initial rotation advances without waiting for eligibility")
                elseif pass == pages then
                    test.eq(delay, 60001, "the final page can supply the earliest deadline")
                    test.eq(seed.boundary_of(last), 0)
                    fixture.at = fixture.now():add(60001 * time.MILLISECOND)
                elseif pass < 2 * pages then
                    test.eq(delay, 1, "the deadline starts another immediate rotation")
                elseif pass == 2 * pages then
                    test.eq(seed.boundary_of(last), 1, "one rotation is enough to prune the eligible final head")
                    test.eq(delay, 1, "a pruned head can expose a new deadline")
                else
                    if pass < 3 * pages then
                        test.eq(delay, 1)
                    else
                        test.eq(delay, 60000, "the new rotation replaces the spent minimum")
                        test.eq(seed.boundary_of(last), 1, "the successor is still fresh")
                        return nil
                    end
                end
                return "timer"
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 3 * pages)
            test.eq(fixture.event_deadline_queries, 0, "no global event deadline read")
        end)

        test.it("includes a head appended behind the cursor before sleeping", function()
            fixture.at = assert(time.parse(time.RFC3339, "2025-01-01T00:00:00Z"))
            seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention')", {first})
            local existing = tonumber(seed.query("SELECT COUNT(*) AS n FROM kickside_thread", {})[1].n)
            local pages = math.ceil((assert(existing) + page_size) / page_size)
            add_empty_threads("f0000000-0000-4000-8000-", 1, page_size)
            fixture.before_select = function(delay: integer?): any
                local pass = fixture.hooks
                if pass == 1 then
                    test.eq(delay, 1)
                    add_event(first, 1, 60)
                    return {kind = "events_appended"}
                end
                if pass == 2 * pages then
                    test.eq(delay, 60001, "the new minimum includes an ID already visited when the wake arrived")
                    return nil
                end
                test.eq(delay, 1)
                return "timer"
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 2 * pages)
        end)

        test.it("uses the receipt deadline when it precedes the event minimum", function()
            fixture.at = assert(time.parse(time.RFC3339, "2025-01-01T00:00:00Z"))
            seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention')", {first})
            add_event(first, 1, 120)
            local completed_at = fixture.now():add((-30 * 86400 + 60) * time.SECOND):utc():format(time.RFC3339)
            seed.exec([[INSERT INTO kickside_write_receipt
                (sink_id,idempotency_key,identity_key,payload_hash,status,created_at,completed_at)
                VALUES ('review-retention','key','identity','hash','committed',$1,$2)]], {completed_at, completed_at})
            local count = tonumber(seed.query("SELECT COUNT(*) AS n FROM kickside_thread", {})[1].n)
            local pages = math.ceil(assert(count) / page_size)
            fixture.before_select = function(delay: integer?): any
                if fixture.hooks == pages then
                    test.eq(delay, 60001)
                    return nil
                end
                test.eq(delay, 1)
                return "timer"
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, pages)
        end)

        test.it("wakes for a real component update after its empty lifecycle head was read", function()
            local component_id = uuid.v7()
            local db = seed.open_db()
            local id = assert(lifecycle.ensure(db, component_id, "kickside.test:lifecycle"))
            seed.exec("UPDATE kickside_thread SET thread_class='review_retention' WHERE id=$1", {id})
            isolate({id})
            fixture.at = time.now()
            with_retention_mailbox(function(mailbox)
                fixture.before_owner = function()
                    if fixture.hooks ~= 1 then return end
                    local dialect = seed.dialect()
                    local tx = assert(db:begin())
                    local updated, update_err = lifecycle_impl.updated({tx = tx, dbtype = dialect,
                        component_id = component_id, impl_id = "kickside.test:lifecycle", command_types = {"SET_META"}})
                    test.is_nil(update_err, tostring(update_err))
                    test.is_true(updated.success)
                    assert(tx:commit())
                    assert(lifecycle_impl.committed())
                    test.eq(#seed.seqs_of(id), 1)
                end
                fixture.before_select = function(delay: integer?): table?
                    if fixture.hooks == 1 then
                        test.is_nil(delay, "the candidate read saw an empty lifecycle thread")
                        local wake = receive_wake(mailbox)
                        test.eq(wake.kind, "events_appended")
                        return wake
                    end
                    test.is_true(delay >= 30 * 86400000, "the producer wake arms the new lifecycle head deadline")
                    return nil
                end
                local _, err = source.main()
                test.is_nil(err, tostring(err))
                test.eq(fixture.hooks, 2)
            end)
            db:release()
        end)

        test.it("arms a receipt committed on the caller transaction during owner work", function()
            isolate({first})
            local completed = fixture.now():add(-29 * 86400 * time.SECOND):utc():format(time.RFC3339)
            local args = {sink_id = "review-retention", idempotency_key = "transactional", identity_key = "identity",
                payload_hash = "hash", created_at = completed, completed_at = completed, dest_refs = {}, outcome = {}}
            local db = seed.open_db()
            local tx = assert(db:begin())
            assert(receipts.reserve(tx, args))
            local _, reserve_err = tx:commit()
            test.is_nil(reserve_err, tostring(reserve_err))
            fixture.before_owner = function()
                local committing = assert(db:begin())
                assert(receipts.commit(committing, args))
                local _, commit_err = committing:commit()
                test.is_nil(commit_err, tostring(commit_err))
            end
            fixture.before_select = function(delay: integer?): () test.eq(delay, 86400001) end
            local _, err = source.main()
            db:release()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 1)
        end)

        test.it("keeps sweeping past PostgreSQL heads with non-finite timestamps", function()
            if seed.dialect() ~= "postgres" then return end
            local ids = {first, middle, last, "10000000-0000-4000-8000-000000000003",
                "10000000-0000-4000-8000-000000000004"}
            isolate(ids)
            for _, id in ipairs(ids) do
                seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention')", {id})
            end
            add_event(first, 2, 0, "infinity")
            add_event(middle, 1, 0, "infinity")
            add_event(ids[4], 1, 0, "infinity")
            add_event(ids[5], 1, 0, "-infinity")
            add_event(last, 1, 120)
            local db = seed.open_db()
            assert(pin.pin_lower(db, {thread_id = middle, consumer_key = "review-retention", command_id = "protected",
                command_generation = 1, target_cursor = 0}))
            db:release()
            fixture.before_select = function(delay: integer?): any
                if fixture.hooks == 1 then
                    test.eq(seed.boundary_of(ids[5]), 1, "negative infinity satisfies the age cutoff")
                    test.eq(delay, 1, "the pruned old head triggers the next rotation")
                    return "timer"
                end
                test.eq(delay, 120001, "only the finite unblocked head contributes a timer")
                for _, id in ipairs({first, middle, ids[4]}) do test.eq(seed.boundary_of(id), 0) end
                return nil
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 2)
        end)

        test.it("continues a page with many caught-up cursors within a fixed work budget", function()
            isolate({first})
            seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention')", {first})
            add_event(first, 1, 60)
            local projection_id = uuid.v4()
            seed.exec("INSERT INTO kickside_projection (id,thread_id,kind) VALUES ($1,$2,'review_retention')",
                {projection_id, first})
            local count = 16384
            if seed.dialect() == "postgres" then
                seed.exec([[INSERT INTO kickside_projection_cursor(id,projection_id,thread_id,cursor_key,last_seq)
                    SELECT md5(n::text || $1::text)::uuid,$1::uuid,$2,n::text,1
                    FROM generate_series(1,$3) AS n]], {projection_id, first, count})
            else
                seed.exec([[WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<$1)
                    INSERT INTO kickside_projection_cursor(id,projection_id,thread_id,cursor_key,last_seq)
                    SELECT hex(randomblob(16)),$2,$3,n,1 FROM numbers]], {count, projection_id, first})
            end
            fixture.before_select = function(delay: integer?): any
                if fixture.hooks == 1 then test.eq(delay, 1, "a single pass cannot inspect all 16,384 cursors") end
                test.is_true(fixture.hooks <= 66, "cursor work makes progress across passes")
                if delay == 1 then return "timer" end
                test.is_true(fixture.hooks >= count / 256, "each pass reads at most one continuation batch")
                test.eq(delay, 60001, "the head gains a deadline after all cursors prove caught up")
                return nil
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.is_true(fixture.hooks > 1)

            seed.exec([[UPDATE kickside_projection_cursor SET last_seq=0,status='paused'
                WHERE projection_id=$1 AND cursor_key='9999']], {projection_id})
            fixture.reset()
            isolate({first})
            fixture.before_select = function(delay: integer?): any
                test.is_true(fixture.hooks <= 66, "cursor work makes progress with active and paused ranges")
                if delay == 1 then return "timer" end
                test.is_true(fixture.hooks >= count / 256, "the blocking cursor is past the initial sample")
                test.is_nil(delay, "the late paused cursor keeps the head from acquiring a timer")
                return nil
            end
            _, err = source.main()
            test.is_nil(err, tostring(err))
        end)

        test.it("retains legacy cursor protection when the projection belongs to another thread", function()
            if seed.dialect() ~= "postgres" then return end
            isolate({first})
            seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention'),($2,'review_retention')",
                {first, last})
            add_event(first, 1, -60)
            local owned, foreign = uuid.v4(), uuid.v4()
            seed.exec([[INSERT INTO kickside_projection(id,thread_id,kind)
                VALUES ($1,$2,'review_retention'),($3,$4,'review_retention')]], {owned, first, foreign, last})
            for i = 1, 6 do
                seed.exec([[INSERT INTO kickside_projection_cursor(id,projection_id,thread_id,cursor_key,last_seq)
                    VALUES ($1,$2,$3,$4,1)]], {uuid.v4(), owned, first, tostring(i)})
            end
            seed.exec([[INSERT INTO kickside_projection_cursor(id,projection_id,thread_id,status,last_seq)
                VALUES ($1,$2,$3,'paused',0)]], {uuid.v4(), foreign, first})
            fixture.before_select = function(delay: integer?): ()
                test.is_nil(delay, "the authoritative protection floor ends the expired head's timer")
                test.eq(seed.boundary_of(first), 0, "the cursor's actual thread still owns its protection")
            end
            local _, err = source.main()
            test.is_nil(err, tostring(err))
            test.eq(fixture.hooks, 1)
        end)

        for _, protection in ipairs({"pin", "cursor"}) do
            test.it("disarms the timer for an isolated blocked head until its " .. protection .. " changes", function()
                isolate({first})
                seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention'),($2,'review_retention')",
                    {first, last})
                add_event(first, 1, -60)
                add_event(last, 1, -120)
                local cursor_id = uuid.v4()
                local db = seed.open_db()
                if protection == "pin" then
                    assert(pin.pin_lower(db, {thread_id = first, consumer_key = "review-retention", command_id = "protected",
                        command_generation = 1, target_cursor = 0}))
                else
                    add_projection(first, cursor_id, 0)
                end
                with_retention_mailbox(function(mailbox)
                    fixture.before_select = function(delay: integer?): table?
                        if fixture.hooks == 1 then
                            test.is_nil(delay, "a blocked head does not arm a timer")
                            test.eq(seed.boundary_of(first), 0)
                            if protection == "pin" then
                                assert(pin.pin_release(db, {thread_id = first, consumer_key = "review-retention",
                                    expected_pin_generation = 1, terminal_op_id = "released"}))
                            else
                                seed.exec("UPDATE kickside_projection_cursor SET last_seq=1 WHERE id=$1", {cursor_id})
                                assert(notifier.notify({kind = "projection_eligibility_changed", thread_id = first}))
                            end
                            return receive_wake(mailbox)
                        end
                        test.eq(seed.boundary_of(first), 1, "the wake prunes the newly unblocked head")
                        return nil
                    end
                    local _, err = source.main()
                    test.is_nil(err, tostring(err))
                    test.eq(fixture.hooks, 2)
                    test.eq(seed.boundary_of(last), 0, "the unrelated overdue head stays outside the fixture page")
                end)
                db:release()
            end)
        end

        test.it("rearms the exact timer after a per-thread policy change", function()
            isolate({first})
            seed.exec("INSERT INTO kickside_thread(id,thread_class) VALUES ($1,'review_retention')", {first})
            add_event(first, 1, 60)
            local db = seed.open_db()
            with_retention_mailbox(function(mailbox)
                fixture.before_select = function(delay: integer?): table?
                    if fixture.hooks == 1 then
                        test.eq(delay, 60001)
                        assert(retention_repo.upsert(db, first, {event_hot_retention_days = 31,
                            archive_mode = "tombstone_only", enabled = true}))
                        return receive_wake(mailbox)
                    end
                    test.eq(delay, 86460001)
                    return nil
                end
                local _, err = source.main()
                test.is_nil(err, tostring(err))
                test.eq(fixture.hooks, 2)
            end)
            db:release()
        end)
    end)
end)}
