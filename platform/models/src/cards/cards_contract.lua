-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Implementation of the kickside.models.cards:cards contract.
local card_service = require("card_service")
local policy = require("policy")

local M = {}

local function train_error(metadata: any): string?
    if type(metadata) ~= "table" then return nil end
    local train = (metadata :: any).train
    if train == nil then return nil end
    if type(train) ~= "table" then return "metadata.train must be an object" end
    for _, key in ipairs({ "weights_digest", "manifest_sha256" }) do
        local value = (train :: any)[key]
        if type(value) ~= "string" or value == "" then
            return "metadata.train." .. key .. " is required"
        end
    end
    return nil
end

local function redact_urls(value: any): any
    if type(value) == "string" and policy.url_has_credentials(value) then return "[redacted]" end
    if type(value) == "table" then
        for key, child in pairs(value) do value[key] = redact_urls(child) end
    end
    return value
end

local function respond(card: any?, err: any?): any
    if not card then return { success = false, error = tostring(err) } end
    local public = policy.split_config(card)
    return { success = true, model = redact_urls(public) }
end

-- upsert_card(card) -> { success, model?, error? }. Idempotent by card name.
function M.upsert_card(args: any): any
    if type(args) ~= "table" then return { success = false, error = "model body must be an object" } end
    local terr = train_error(args.metadata)
    if terr then return { success = false, error = terr } end
    local input = policy.split_config(args)
    if policy.config_credential_error(input) then
        return { success = false, error = "Model card URLs must be credential-free. Configure credentials on the provider profile." }
    end
    return respond(card_service.save(input))
end

-- disable_card({ name }) -> { success, model?, error? }. Idempotent by card name.
function M.disable_card(args: any): any
    if type(args) ~= "table" then return { success = false, error = "request must be an object" } end
    return respond(card_service.disable(args.name))
end

-- list_cards({}) -> { success, models?, error? }. Every catalog card, disabled included.
function M.list_cards(_args: any): any
    local cards, err = card_service.list()
    if not cards then return { success = false, error = tostring(err) } end
    local models: { any } = {}
    for _, card in ipairs(cards :: { any }) do
        local public = policy.split_config(card)
        models[#models + 1] = redact_urls(public)
    end
    return { success = true, models = models }
end

-- get_card({ name }) -> { success, model?, error? }. Disabled cards included.
function M.get_card(args: any): any
    if type(args) ~= "table" then return { success = false, error = "request must be an object" } end
    return respond(card_service.get(args.name))
end

-- delete_card({ name }) -> { success, error? }. Deletes a disabled stored card.
function M.delete_card(args: any): any
    if type(args) ~= "table" then return { success = false, error = "request must be an object" } end
    local ok, err = card_service.delete(args.name)
    if not ok then return { success = false, error = tostring(err) } end
    return { success = true }
end

return M
