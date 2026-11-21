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

local function summary(card: Map): Map
    return {
        name = card.name,
        title = card.title,
        enabled = card.enabled,
        source = card.source,
        provider_id = card.provider_id,
        provider_model = card.provider_model,
        provider_profile_id = card.provider_profile_id,
        class = card.class,
        capabilities = card.capabilities,
        priority = card.priority,
        error = card.error,
    }
end

local function matches(card: Map, query: string): boolean
    if query == "" then return true end
    for _, value in ipairs({ card.name, card.title, card.provider_model }) do
        if type(value) == "string" and string.lower(value):find(query, 1, true) then return true end
    end
    return false
end

local function list(args: Map): (any?, error?)
    local limit, cursor, page_err = keyset.args(args)
    if page_err then return nil, page_err end
    if args.q ~= nil and type(args.q) ~= "string" then
        return tool_result.fail(errors.INVALID, "q must be a string")
    end
    local reply, err = cards_client.call("list_cards", {})
    if err or tool_result.is_domain_error(reply) then return reply, err end
    local query = string.lower(args.q or "")
    local rows: { Map } = {}
    for _, card in ipairs((reply :: Map).models) do
        if matches(card, query) then rows[#rows + 1] = summary(card) end
    end
    local page, next_cursor = keyset.page(rows, keyset.field("name"), limit :: integer, cursor)
    return { success = true, count = #page, cards = page, next_cursor = next_cursor }, nil
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
