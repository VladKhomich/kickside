-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local models_repo = require("models_repo")
local policy = require("catalog_policy")
local providers = require("providers")

local M = {}

local function call(method: string, input: any): (any?, any?)
    local context = ctx.all() or {}
    local cards, read_err = models_repo.list_card_overlays()
    if not cards then return nil, read_err end
    local card = nil
    for _, item in ipairs(cards) do
        if item.name == context.card then card = item; break end
    end
    if not card or card.enabled == false then return nil, "Model route is unavailable" end
    local route = card.providers and card.providers[1]
    local profile, profile_err = models_repo.get_profile(card.provider_profile_id)
    if profile_err then return nil, profile_err end
    if not route or not profile or profile.enabled == false then return nil, "Provider profile is unavailable" end
    if profile.error then return nil, profile.error end
    local real_context = policy.provider_context(profile)
    for key, value in pairs(route.options or {}) do
        if key ~= "timeout" or value ~= "" then real_context[key] = value end
    end
    real_context.deadline_at = context.deadline_at
    local provider, err = providers.open(route.id, real_context)
    if not provider then return nil, err end
    local request = {}
    for key, value in pairs(input or {}) do request[key] = value end
    request.model = route.provider_model
    return provider[method](provider, request)
end

function M.status(input: any): (any?, any?) return call("status", input) end
function M.generate(input: any): (any?, any?) return call("generate", input) end
function M.embed(input: any): (any?, any?) return call("embed", input) end
function M.structured_output(input: any): (any?, any?) return call("structured_output", input) end
function M.evaluate(input: any): (any?, any?) return call("evaluate", input) end

return M
