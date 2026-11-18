local model_catalog = require("model_catalog")

local M = {}

local function resolved_card(card: any): any
    local resolved = {}
    for key, value in pairs(card) do resolved[key] = value end
    resolved.providers = {}
    for _, route in ipairs(card.providers or {}) do
        local provider = {}
        for key, value in pairs(route) do provider[key] = value end
        if route.provider_profile_id then
            provider.id = "kickside.models:provider"
            provider.context = { card = card.name }
        end
        table.insert(resolved.providers, provider)
    end
    if card.candidates then
        resolved.candidates = {}
        for _, candidate in ipairs(card.candidates) do
            table.insert(resolved.candidates, resolved_card(candidate))
        end
    end
    return resolved
end

function M.resolve(input: any): (any?, any?)
    local model = input and input.model
    if type(model) ~= "string" or model == "" then return nil end
    local card, err = model_catalog.resolve(model)
    if not card then return nil, err end
    return resolved_card(card)
end

return M
