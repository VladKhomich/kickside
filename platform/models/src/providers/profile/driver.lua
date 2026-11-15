-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local registry = require("registry")
local model_catalog = require("model_catalog")
local models_repo = require("models_repo")
local policy = require("catalog_policy")
local providers = require("providers")

local M = {}

-- Explicit unset values retain driver default resolution without inheriting caller
-- configuration. These keys supplement the bindings' declared context schemas.
local STRING_CONTEXT = {
    "api_key", "base_url", "organization", "api_version", "region", "aws_region",
    "access_key", "secret_key", "session_token", "google_credentials", "access_token",
    "project", "location", "client_id", "timeout",
}

local function driver_context(provider_id: string, profile: any, options: any): (any?, any?)
    local entry, entry_err = registry.get(provider_id)
    if not entry then return nil, entry_err or "Provider not found: " .. provider_id end
    local driver = entry.data and entry.data.driver
    if not driver or not driver.id then return nil, "Provider missing driver configuration: " .. provider_id end
    local binding, binding_err = registry.get(tostring(driver.id))
    if not binding then return nil, binding_err or "Driver binding not found: " .. tostring(driver.id) end
    local context: any = {headers = {}, beta_features = {}, retry = {}, deadline_at = false}
    for _, key in ipairs(STRING_CONTEXT) do
        context[key], context[key .. "_env"] = false, false
    end
    for _, schema in ipairs({binding.data.required_context or {}, binding.data.optional_context or {}}) do
        for key, field in pairs(schema) do
            if field.type == "object" or field.type == "array" then context[key] = {}
            else context[key] = false end
            context[key .. "_env"] = false
        end
    end
    for key, value in pairs(driver.options or {}) do context[key] = value end
    for key, value in pairs(policy.provider_context(profile)) do context[key] = value end
    for key, value in pairs(options or {}) do
        if key ~= "timeout" or value ~= "" then context[key] = value end
    end
    return context
end

local function call(method: string, input: any): (any?, any?)
    local context = ctx.all() or {}
    local card, read_err = model_catalog.get_by_name(context.card)
    if not card then return nil, read_err end
    if card.enabled == false then return nil, "Model route is unavailable" end
    local route = card.providers and card.providers[1]
    local profile, profile_err = models_repo.get_profile(card.provider_profile_id)
    if profile_err then return nil, profile_err end
    if not route or not profile or profile.enabled == false then return nil, "Provider profile is unavailable" end
    if profile.error then return nil, profile.error end
    local real_context, context_err = driver_context(route.id, profile, route.options)
    if not real_context then return nil, context_err end
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
