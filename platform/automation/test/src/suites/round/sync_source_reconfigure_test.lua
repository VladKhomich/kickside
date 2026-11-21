-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local h = require("round_harness")

local MANAGE = "kickside.automation.agent:automations_manage"
local EVENTS = "kickside.automation.round.fixture:events_feed"
local RECORDS = "kickside.automation.round.fixture:records"
local SINK = "kickside.automation.round.fixture:store"

local function manage(env, request)
    local result, err = env.caller:call(MANAGE, request)
    test.is_nil(err, tostring(err))
    test.is_true(result and result.success, tostring(result and result.error))
    return result
end

return { run = test.run_cases(function()
    test.describe("Data Sync source reconfiguration", function()
        for _, enabled in ipairs({ true, false }) do
            local state = enabled and "enabled" or "paused"
            test.it("moves an event sync to a collection and leaves its drive " .. state, function()
                local env = h.setup("sync_source")
                local declaration = {
                    title = "Source reconfiguration",
                    trigger = { v = 2, source = EVENTS, config = { thread_id = env.thread_id }, backfill = "none" },
                    sink_port = SINK, sink_config = {}, transform = { kind = "none" }, enabled = true,
                }
                local id = manage(env, { action = "install", type = "kickside.sync:sync", input = declaration }).id
                local pin = { env.thread_id, "drive:" .. id .. ":main" }
                local function pin_count()
                    return #h.query("SELECT thread_id FROM kickside_retention_pin WHERE thread_id=$1 AND consumer_key=$2", pin)
                end
                local before = h.read_drive(id, "main")
                test.eq(before.source_kind, "event")
                test.eq(pin_count(), 1)

                declaration.trigger = { v = 2, source = RECORDS, backfill = "all",
                    schedule = { type = "interval", expression = "30m" } }
                declaration.enabled = enabled
                manage(env, { action = "reconfigure", id = id, input = declaration })

                local after = h.read_drive(id, "main")
                test.eq(after.source_kind, "collection")
                test.eq(after.action.source_ref, RECORDS)
                test.eq(after.enabled, enabled)
                test.eq(after.phase, enabled and before.phase or "paused")
                test.eq(after.rewind_generation, before.rewind_generation + 1)
                test.is_nil(after.pending_command_id)
                test.eq(pin_count(), 0)
                local ops = h.query([[SELECT request_id,state,generation FROM kickside_automation_op
                    WHERE automation_id=$1 ORDER BY generation DESC LIMIT 2]], { id })
                test.eq(#ops, 2)
                test.eq(ops[1].request_id, "release_pins:" .. ops[2].request_id)
                test.eq(ops[1].state, "succeeded")
                test.eq(ops[2].state, "succeeded")
                test.eq(ops[1].generation, ops[2].generation + 1)
                test.eq(after.command_generation, ops[1].generation)
            end)
        end
    end)
end) }
