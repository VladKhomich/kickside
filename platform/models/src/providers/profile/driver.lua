-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base64 = require("base64")
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
    local context: any = {headers = {}, beta_features = {}, retry = {}}
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
    local execution = ctx.all() or {}
    for _, key in ipairs({"deadline_at", "timeout", "cancel"}) do
        if execution[key] ~= nil then context[key] = execution[key] end
    end
    return context
end

local function redact_returns(context: any): (any) -> any
    local secrets = {}
    local function collect(value: any)
        if type(value) == "string" and value ~= "" then
            secrets[value] = true
            secrets[base64.encode(value)] = true
            secrets["Bearer " .. value] = true
        elseif type(value) == "table" then
            for _, child in pairs(value) do collect(child) end
        end
    end
    for key in pairs(policy.secret_keys) do collect(context[key]) end
    collect(context.headers)
    local literals = {}
    for secret in pairs(secrets) do literals[#literals + 1] = secret end
    table.sort(literals, function(a, b) return #a > #b end)
    local patterns = {}
    for _, literal in ipairs(literals) do
        patterns[#patterns + 1] = literal:gsub("(%W)", "%%%1")
    end
    local seen = {}
    local function redact(value: any): any
        if type(value) == "string" then
            for _, pattern in ipairs(patterns) do value = value:gsub(pattern, "[redacted]") end
        elseif type(value) == "table" then
            if seen[value] then return seen[value] end
            local out = {}
            seen[value] = out
            for key, child in pairs(value) do out[redact(key)] = redact(child) end
            return out
        elseif type(value) == "userdata" and type(value.message) == "function" then
            return errors.new({kind = value:kind(), retryable = value:retryable(),
                message = redact(value:message()), details = redact(value:details())})
        end
        return value
    end
    return redact
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
    local redact = redact_returns(real_context)
    local provider, err = providers.open(route.id, real_context)
    if not provider then return nil, redact(err) end
    local request = {}
    for key, value in pairs(input or {}) do request[key] = value end
    request.model = route.provider_model
    local result, call_err = provider[method](provider, request)
    return redact(result), redact(call_err)
end

function M.status(input: any): (any?, any?) return call("status", input) end
function M.generate(input: any): (any?, any?) return call("generate", input) end
function M.embed(input: any): (any?, any?) return call("embed", input) end
function M.structured_output(input: any): (any?, any?) return call("structured_output", input) end
function M.evaluate(input: any): (any?, any?) return call("evaluate", input) end

return M
