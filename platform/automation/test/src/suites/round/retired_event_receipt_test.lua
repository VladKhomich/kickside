-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local test = require("test")
local h = require("round_harness")
local retention = require("retention")

type Map = { [string]: any }

local MANAGE = "kickside.automation.agent:automations_manage"
local EVENT_KIND = "kickside.automation.round.fixture:event_kind"
local STORE = "kickside.automation.round.fixture:store"
local OLD = "2000-01-01T00:00:00Z"
local CUTOFF = "2020-01-01T00:00:00Z"

local function manage(env: Map, request: Map): Map
    local result, err = env.caller:call(MANAGE, request)
    test.is_nil(err, tostring(err))
    test.is_true(result and result.success, tostring(result and result.error))
    return result
end

local function receipts(id: string): { Map }
    return h.query("SELECT item_key,source_port,source_kind,dest_ref_json FROM kickside_automation_receipt"
        .. " WHERE owner_id=$1 ORDER BY item_key", { id })
end

local function prune(db: any): integer
    local tx = assert(db:begin())
    local removed, err = retention.prune_orphans_tx(tx, CUTOFF, 1)
    test.is_nil(err, tostring(err))
    test.is_nil(select(2, tx:commit()))
    return removed
end

return test.run_cases(function()
    test.describe("retired event receipt retention", function()
        for _, operation in ipairs({ "removing the source", "changing the event port" }) do
            test.it("expires settled mappings after " .. operation, function()
                local env = h.setup("retired_event_receipt")
                local id = manage(env, { action = "install", type = EVENT_KIND,
                    input = { thread_id = env.thread_id, start = "new", sink_port = STORE } }).id
                env.append("first delivery")
                local _, first_err = env.run(id, "main")
                test.is_nil(first_err, tostring(first_err))
                local first = receipts(id)
                test.eq(#first, 1)
                test.eq(first[1].source_kind, "event")
                test.eq(first[1].source_port, "fixture:events")
                local ref = assert(json.decode(first[1].dest_ref_json))
                h.exec("UPDATE kickside_automation_receipt SET updated_at=$1 WHERE owner_id=$2", { OLD, id })

                env.append("recent delivery")
                local _, recent_err = env.run(id, "main")
                test.is_nil(recent_err, tostring(recent_err))
                test.eq(#receipts(id), 2)

                local input: Map = { remove_source = true, sink_port = STORE }
                if operation == "changing the event port" then
                    local next_thread = assert(env.threads:upsert({ thread_class = "kickside.test.round",
                        impl_id = "kickside.automation.round.fixture:round_source_kind",
                        external_ref = "round-next:" .. env.owner, title = "Replacement source" }))
                    input = { thread_id = next_thread.thread_id, start = "new",
                        source_port = "fixture:replacement", sink_port = STORE }
                end
                manage(env, { action = "reconfigure", id = id, input = input })
                local drive = h.read_drive(id, "main")
                test.eq(drive.source_kind, input.remove_source and "none" or "event")
                test.eq(drive.action.source_ref, input.source_port)
                test.is_nil(drive.pending_command_id)

                local db = h.db()
                test.eq(retention.oldest_eligible(db), OLD)
                test.eq(prune(db), 1)
                test.eq(prune(db), 0)
                db:release()

                local kept = receipts(id)
                test.eq(#kept, 1)
                test.is_true(kept[1].item_key ~= first[1].item_key)
                test.eq(kept[1].source_kind, "event")
                local sends = h.query("SELECT id FROM round_fixture_log WHERE drive_key='sink' AND item_key=$1",
                    { string.sub(ref.id, 5) })
                test.eq(#sends, 1, "retention does not send a destination delete")
            end)
        end

        test.it("keeps collection provenance when an event round echoes a receipt without a delivery key", function()
            local env = h.setup("stored_receipt_replay")
            local id = manage(env, { action = "install", type = EVENT_KIND,
                input = { thread_id = env.thread_id, start = "new", sink_port = STORE, echo_known_receipts = true } }).id
            env.append("reuse stored mapping")
            local item = h.query("SELECT id FROM kickside_event WHERE thread_id=$1 AND type=$2", { env.thread_id, h.EVENT_TYPE })[1]
            h.exec([[INSERT INTO kickside_automation_receipt
                (owner_id,source_port,item_key,map_slot,identity_key,dest_ref_json,updated_at,source_kind)
                VALUES ($1,'fixture:events',$2,'','previous','{"id":"mapped"}',$3,'collection')]],
                { id, item.id, OLD })

            local _, run_err = env.run(id, "main")
            test.is_nil(run_err, tostring(run_err))
            local rows = h.query("SELECT source_kind,delivery_key FROM kickside_automation_receipt WHERE owner_id=$1", { id })
            test.eq(#rows, 1)
            test.not_nil(rows[1].delivery_key, "the event round completed and recorded the replay")
            test.eq(rows[1].source_kind, "collection")
        end)
    end)
end)
