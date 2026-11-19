-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The single write path for model cards. The admin HTTP handlers and the
-- kickside.models.cards:cards contract functions both save and disable cards
-- here; persistence and cache publication stay in models_repo.
local card_policy = require("card_policy")
local model_catalog = require("model_catalog")
local models_repo = require("models_repo")

local M = {}

-- Creates or updates the card named input.name. Fields the input omits keep the
-- values of the card it edits (saved overlay or registry declaration).
function M.save(input: any): (any?, any?)
    if type(input) ~= "table" or type(input.name) ~= "string" or input.name == "" then
        return nil, "Model name is required"
    end
    local base = model_catalog.get_by_name(input.name)
    return models_repo.upsert_card(input, base)
end

-- Disables the stored card named name and keeps its row, so the card's
-- metadata stays readable. Disabling a disabled card succeeds unchanged.
function M.disable(name: any): (any?, any?)
    if type(name) ~= "string" or name == "" then return nil, "Model name is required" end
    local snapshot, err = models_repo.snapshot()
    if err then return nil, err end
    for _, item in ipairs(snapshot.cards) do
        if item.name == name then
            if item.configured_enabled == false then return card_policy.public_card(item) end
            return models_repo.upsert_card({ name = name, enabled = false }, item)
        end
    end
    return nil, "No stored model card named: " .. name
end

return M
