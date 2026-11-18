-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local seed = require("prune_scaffold")
local source = require("source")

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
    end)
end)}
