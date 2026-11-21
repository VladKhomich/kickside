-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local time = require("time")
local fixture = require("prune_scaffold")
local scratch = require("migration_scratch")
local sweeper = require("sweeper")

local DATABASE = "app:migration_db"
local MIGRATIONS = { "00_encoding", "01_thread", "02_projection", "05_retention", "07_retention_pins", "08_write_receipts" }

local function define_tests()
    test.describe("Default retention backlog", function()
        local db: sql.DB?
        test.before_each(function()
            -- The sweeper pages over empty threads too. Control the whole
            -- rotation so unrelated harness fixtures cannot add turns.
            scratch.reset()
            for _, migration in ipairs(MIGRATIONS) do
                scratch.migrate("kickside.core.migrations:" .. migration)
            end
            db = fixture.open_db(DATABASE)
        end)

        test.after_each(function()
            if db then
                db:release()
                db = nil
            end
            if scratch.postgres() then scratch.drop() else scratch.reset() end
        end)

        test.it("drains multiple batches of newly expired events without a cadence pause", function()
            local id = fixture.make_thread(DATABASE)
            fixture.add_bulk_events(id, 10001, 60, DATABASE)
            local total = 0
            for pass = 1, 3 do
                local result, err = sweeper.run(assert(db), {})
                test.is_nil(err)
                total = total + result.events
                if pass < 3 then
                    test.eq(result.events, 5000)
                    test.is_true(result.needs_continue)
                    test.is_true(result.deadline_ms <= math.floor(time.now():unix_nano() / 1000000))
                end
            end
            test.eq(total, 10001)
            test.eq(#fixture.seqs_of(id, DATABASE), 0)
            test.eq(fixture.boundary_of(id, DATABASE), 10001)
        end)

        test.it("rotates a capped event sweep through every backlogged thread", function()
            local budget = 5000
            local threads = { fixture.make_thread(DATABASE), fixture.make_thread(DATABASE), fixture.make_thread(DATABASE) }
            table.sort(threads)
            local first, middle, last = threads[1], threads[2], threads[3]
            local first_backlog = 6 * budget + 1
            fixture.add_bulk_events(first, first_backlog, 60, DATABASE)
            fixture.add_bulk_events(middle, budget + 1, 60, DATABASE)
            fixture.add_bulk_events(last, budget + 1, 60, DATABASE)
            -- Include a suffix to visit after the cap is reached on the last backlog.
            scratch.exec("INSERT INTO kickside_thread (id,thread_class) VALUES ($1,'prune_test')",
                { "ffffffff-ffff-4fff-bfff-ffffffffffff" })

            local traversal = {}
            local total = 0
            local function pass(): ()
                local result, err = sweeper.run(assert(db), traversal)
                test.is_nil(err)
                test.is_true(result.events <= budget, "each pass respects the shared event cap")
                if result.events == budget then test.is_true(result.needs_continue) end
                total = total + result.events
            end
            for _ = 1, 6 do pass() end
            test.eq(fixture.boundary_of(middle, DATABASE), budget + 1, "middle thread drains while the first stays backlogged")
            test.eq(fixture.boundary_of(last, DATABASE), budget + 1, "last thread drains while the first stays backlogged")
            test.is_true(fixture.boundary_of(first, DATABASE) >= 2 * budget, "the traversal wraps to the first thread")
            test.is_true(fixture.boundary_of(first, DATABASE) < first_backlog)

            -- Once the later threads are drained, their suffix page and the
            -- first thread's next turn take separate passes.
            for _ = 7, 15 do pass() end
            test.eq(fixture.boundary_of(first, DATABASE), first_backlog)
            test.eq(total, first_backlog + 2 * (budget + 1))
        end)
    end)
end
return test.run_cases(define_tests)
