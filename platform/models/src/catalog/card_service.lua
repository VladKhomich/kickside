-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The admin HTTP handler and the registrar contract share this save path.
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
    return models_repo.disable_card(name)
end

-- Deletes the stored card named name once it is disabled. An enabled card is in
-- use (it resolves by name and class), so deleting one is refused; a caller
-- retires it with disable first.
function M.delete(name: any): (boolean, any?)
    if type(name) ~= "string" or name == "" then return false, "Model name is required" end
    return models_repo.delete_disabled_card(name)
end

return M
