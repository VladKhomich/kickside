-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- ModelCardsManage: save, retire and delete catalog cards through the
-- kickside.models.cards:cards contract.
local cards_client = require("cards_client")
local tool_action = require("tool_action")
local tool_result = require("tool_result")

type Map = { [string]: any }

local ACTIONS = {
    upsert = { required = { "card" } },
    disable = { required = { "name" } },
    delete = { required = { "name" } },
}

local function handler(args: any): (any?, error?)
    local action, action_err = tool_action.check(args, ACTIONS)
    if action_err then return nil, action_err end
    local input = args :: Map
    if action == "upsert" then
        if type(input.card) ~= "table" then return tool_result.fail(errors.INVALID, "card must be an object") end
        local reply, err = cards_client.call("upsert_card", input.card)
        if err or tool_result.is_domain_error(reply) then return reply, err end
        return { success = true, card = (reply :: Map).model }, nil
    end
    if action == "disable" then
        local reply, err = cards_client.call("disable_card", { name = input.name })
        if err or tool_result.is_domain_error(reply) then return reply, err end
        return { success = true, card = (reply :: Map).model }, nil
    end
    local reply, err = cards_client.call("delete_card", { name = input.name })
    if err or tool_result.is_domain_error(reply) then return reply, err end
    return { success = true, name = input.name }, nil
end

return { handler = handler }
