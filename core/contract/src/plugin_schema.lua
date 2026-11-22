-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Resolves plugin schema declarations while leaving their content and storage
-- to the product that consumes them.
local contract = require("contract")
local hash = require("hash")
local security = require("security")

type Json = nil | boolean | number | string | { Json } | { [string]: Json }
type JsonObject = { [string]: Json }
type Source = { template: JsonObject?, provider: string? }
type Resolved = { fragment: JsonObject, version: string?, digest: string }
type ProviderResult = { fragment: unknown, version: unknown }
type Provider = { resolve: (self: Provider, request: unknown) -> (unknown, error?) }
type Canonical = (unknown) -> string

local M = {}

local function invalid(message: string): error
    return errors.new({ kind = errors.INVALID, retryable = false, message = message, details = { code = "plugin_invalid" } })
end

function M.parse(id: string, raw: unknown): (Source?, error?)
    if raw == nil then return nil, nil end
    if type(raw) ~= "table" then return nil, invalid(id .. " schema must name a template or a provider") end
    local source = raw :: { [string]: unknown }
    local template, provider = source.template, source.provider
    if (template ~= nil) == (provider ~= nil) then return nil, invalid(id .. " schema names exactly one of template or provider") end
    if template ~= nil and type(template) ~= "table" then return nil, invalid(id .. " schema template must be an object") end
    if provider ~= nil and (type(provider) ~= "string" or provider == "") then return nil, invalid(id .. " schema provider must be a binding id") end
    return { template = template :: JsonObject?, provider = provider :: string? }, nil
end

local function resolved(fragment: JsonObject, version: string?, canonical: Canonical): (Resolved?, error?)
    local digest, err = hash.sha256(canonical(fragment))
    if err then return nil, errors.wrap(err, "plugin schema digest") end
    return { fragment = fragment, version = version, digest = digest:lower() }, nil
end

-- The caller supplies its schema codec because its stored fragment digests
-- use that codec. Pass a source returned by parse.
function M.resolve(id: string, source: Source?, provider_contract: string, request: unknown, canonical: Canonical): (Resolved?, error?)
    if not source then return nil, nil end
    if source.template then return resolved(source.template, nil, canonical) end

    local binding = source.provider :: string
    local label = id .. " schema provider"
    local def, err = contract.get(provider_contract)
    if err then return nil, errors.wrap(err, "schema provider contract unavailable") end
    if not def then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "schema provider contract unavailable", details = { code = "contract_unavailable" } }) end
    local instance, open_err = def:with_actor(security.actor()):with_scope(security.scope()):open(binding)
    if open_err then return nil, errors.wrap(open_err, label .. " " .. binding .. " open failed") end
    if not instance then return nil, errors.new({ kind = errors.UNAVAILABLE, message = label .. " " .. binding .. " open returned no client", details = { code = "contract_unavailable" } }) end

    local provider = instance :: Provider
    local answer, resolve_err = provider:resolve(request)
    if resolve_err then return nil, errors.wrap(resolve_err, label) end
    if type(answer) ~= "table" or type((answer :: ProviderResult).fragment) ~= "table" then
        return nil, errors.new({ kind = errors.INTERNAL, message = label .. " answered without a fragment", details = { code = "internal" } })
    end
    local result = answer :: ProviderResult
    if result.version ~= nil and type(result.version) ~= "string" then
        return nil, errors.new({ kind = errors.INTERNAL, message = label .. " version must be a string", details = { code = "internal" } })
    end
    return resolved(result.fragment :: JsonObject, result.version :: string?, canonical)
end

return M
