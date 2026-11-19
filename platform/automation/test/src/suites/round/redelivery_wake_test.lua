-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local time = require("time")
local h = require("round_harness")

local function define_tests()
    test.describe("automation event redelivery wake", function()
        local worker: string? = nil
        local listener: { [string]: any }? = nil

        test.after_each(function()
            if worker then h.stop_worker(worker); worker = nil end
            if listener then h.close_round(listener); listener = nil end
        end)

        test.it("delivers new source input before an existing item's redelivery deadline", function()
            h.await_migrations()
            local fixture = h.setup("round_wake_redelivery")
            local installed = fixture.caller:call("kickside.automation.agent:automations_manage", {
                action = "install", type = "kickside.automation.round.fixture:event_kind",
                input = { thread_id = fixture.thread_id, start = "all" },
            })
            test.is_true(installed.success, tostring(installed.error))
            local job_id = h.read_drive(installed.id, "main").job_id
            local probe_key = h.probe_key_for(job_id)
            worker = h.start_worker()
            h.await_worker_pass(probe_key, job_id)

            local held_listener = h.listen_round(installed.id, "main")
            listener = held_listener
            fixture.append("wait")
            local held = h.receive_logged(held_listener)
            h.await_worker_pass(probe_key)
            h.close_round(held_listener)
            listener = nil

            local retry = assert(h.ledger_row(installed.id, held.item_key))
            test.eq(retry.state, "waiting")
            local retry_at = assert(time.parse(time.RFC3339, retry.next_attempt_at))
            test.is_true(retry_at:after(time.now()))
            local pending = h.query("SELECT status, scheduled_at FROM kickside_job WHERE id = $1", { job_id })[1]
            test.eq(pending.status, "pending")
            test.not_nil(pending.scheduled_at)

            local fresh_listener = h.listen_round(installed.id, "main")
            listener = fresh_listener
            fixture.append("fresh event before redelivery")
            local fresh = h.receive_logged(fresh_listener, "5s")
            h.await_worker_pass(probe_key)
            test.neq(fresh.item_key, held.item_key)
            local still_waiting = assert(h.ledger_row(installed.id, held.item_key))
            test.eq(still_waiting.state, "waiting")
            test.eq(still_waiting.next_attempt_at, retry.next_attempt_at)
            test.eq(still_waiting.attempts, retry.attempts)
        end)
    end)
end

return { run = test.run_cases(define_tests) }
