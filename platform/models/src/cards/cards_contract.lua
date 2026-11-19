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

local function respond(card: any?, err: any?): any
    if not card then return { success = false, error = tostring(err) } end
    local public = policy.split_config(card)
    return { success = true, model = public }
end

-- upsert_card(card) -> { success, model?, error? }. Idempotent by card name.
function M.upsert_card(args: any): any
    if type(args) ~= "table" then return { success = false, error = "model body must be an object" } end
    local terr = train_error(args.metadata)
    if terr then return { success = false, error = terr } end
    return respond(card_service.save(args))
end

-- disable_card({ name }) -> { success, model?, error? }. Idempotent by card name.
function M.disable_card(args: any): any
    if type(args) ~= "table" then return { success = false, error = "request must be an object" } end
    return respond(card_service.disable(args.name))
end

return M
