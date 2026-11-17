-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local h = require("round_harness")

return {run = test.run_cases(function()
    test.describe("round fixture isolation", function()
        local owner = uuid.v7()
        test.after_each(function()
            h.exec("DELETE FROM kickside_trigger_item_ledger WHERE owner_id=$1", {owner})
        end)

        test.it("reads the first admitted revision regardless of insertion or identity order", function()
            -- Put the later revision first in both heap and primary-key order.
            -- A record lookup without delivery order then observes waiting.
            for _, row in ipairs({
                {identity = "a-later", state = "waiting", order = 2},
                {identity = "z-earlier", state = "retrying", order = 1},
            }) do
                h.exec([[INSERT INTO kickside_trigger_item_ledger
                    (owner_id,source_port,item_key,identity_key,envelope_json,state,delivery_order,
                     first_failed_at,last_failed_at,created_at,updated_at)
                    VALUES ($1,'fixture:revision-order','mutable',$2,'{}',$3,$4,$5,$5,$5,$5)]],
                    {owner, row.identity, row.state, row.order, h.PAST})
            end
            local first = h.ledger_row(owner, "mutable")
            test.not_nil(first)
            test.eq(first.state, "retrying")
        end)
    end)
end)}
