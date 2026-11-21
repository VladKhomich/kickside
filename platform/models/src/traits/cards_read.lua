-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- ModelCardsRead: catalog card summaries in pages and one full card, through the
-- kickside.models.cards:cards contract.
local cards_client = require("cards_client")
local tool_action = require("tool_action")
local tool_result = require("tool_result")
local keyset = require("keyset")

type Map = { [string]: any }

local ACTIONS = {
    list = { optional = { "q", "limit", "cursor" } },
    get = { required = { "name" } },
}

local function list(args: Map): (any?, error?)
    local limit, cursor, page_err = keyset.args(args)
    if page_err then return nil, page_err end
    if args.q ~= nil and type(args.q) ~= "string" then
        return tool_result.fail(errors.INVALID, "q must be a string")
    end
    local reply, err = cards_client.call("list_card_summaries", { limit = limit, cursor = cursor, q = args.q })
    if err or tool_result.is_domain_error(reply) then return reply, err end
    local result = reply :: Map
    return { success = true, count = #result.cards, cards = result.cards, next_cursor = result.next_cursor }, nil
end

local function get(args: Map): (any?, error?)
    local reply, err = cards_client.call("get_card", { name = args.name })
    if err or tool_result.is_domain_error(reply) then return reply, err end
    return { success = true, card = (reply :: Map).model }, nil
end

local function handler(args: any): (any?, error?)
    local action, action_err = tool_action.check(args, ACTIONS)
    if action_err then return nil, action_err end
    if action == "list" then return list(args) end
    return get(args)
end

return { handler = handler }
