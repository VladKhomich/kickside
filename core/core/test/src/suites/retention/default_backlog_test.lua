-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local time = require("time")
local fixture = require("prune_scaffold")
local sweeper = require("sweeper")

local function define_tests()
    test.describe("Default retention backlog", function()
        test.it("drains multiple batches of newly expired events without a cadence pause", function()
            local id = fixture.make_thread()
            fixture.add_bulk_events(id, 10001, 60)
            local db = fixture.open_db()
            local total = 0
            for pass = 1, 3 do
                local result, err = sweeper.run(db)
                test.is_nil(err)
                total = total + result.events
                if pass < 3 then
                    test.eq(result.events, 5000)
                    test.is_true(result.needs_continue)
                    local deadline, deadline_err = sweeper.next_deadline_ms(db)
                    test.is_nil(deadline_err)
                    test.is_true(deadline <= math.floor(time.now():unix_nano() / 1000000))
                end
            end
            db:release()
            test.eq(total, 10001)
            test.eq(#fixture.seqs_of(id), 0)
            test.eq(fixture.boundary_of(id), 10001)
        end)

        test.it("rotates a capped event sweep through every backlogged thread", function()
            local budget = 5000
            local threads = { fixture.make_thread(), fixture.make_thread(), fixture.make_thread() }
            table.sort(threads)
            local first, middle, last = threads[1], threads[2], threads[3]
            local first_backlog = 6 * budget + 1
            fixture.add_bulk_events(first, first_backlog, 60)
            fixture.add_bulk_events(middle, budget + 1, 60)
            fixture.add_bulk_events(last, budget + 1, 60)

            local db = fixture.open_db()
            local traversal = {}
            local total = 0
            local function pass(): ()
                local result, err = sweeper.run(db, traversal)
                test.is_nil(err)
                test.is_true(result.events <= budget, "each pass respects the shared event cap")
                if result.events == budget then test.is_true(result.needs_continue) end
                total = total + result.events
            end
            for _ = 1, 5 do pass() end
            test.eq(fixture.boundary_of(middle), budget + 1, "middle thread drains while the first stays backlogged")
            test.eq(fixture.boundary_of(last), budget + 1, "last thread drains while the first stays backlogged")
            test.is_true(fixture.boundary_of(first) >= 2 * budget, "the traversal wraps to the first thread")
            test.is_true(fixture.boundary_of(first) < first_backlog)

            for _ = 1, 4 do pass() end
            db:release()
            test.eq(fixture.boundary_of(first), first_backlog)
            test.eq(total, first_backlog + 2 * (budget + 1))
        end)
    end)
end
return test.run_cases(define_tests)
