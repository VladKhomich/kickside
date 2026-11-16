-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Implementation validators run as libraries so the active SQL transaction is
-- passed by reference, just like component_lifecycle. They never perform cleanup.
local autoinit = require("autoinit")
local M = {}

local function invalid(impl_id: string, message: string): error
    return errors.new({kind=errors.INTERNAL, retryable=false,
        message="component deletion admission " .. impl_id .. ": " .. message,
        details={code="component_delete_admission_invalid", impl_id=impl_id}})
end

function M.validate(payload: table): error?
    local impl_id = (payload :: any).impl_id
    local entry, lookup_err = autoinit.kind_for_impl(impl_id)
    if lookup_err and not errors.is(lookup_err, errors.NOT_FOUND) then return lookup_err end
    if not entry then return nil end
    local alias = type(entry.meta) == "table" and entry.meta.delete_admission or nil
    if alias == nil then return nil end
    if type(alias) ~= "string" or alias == "" then return invalid(impl_id, "library alias is required") end
    local loaded, validator = pcall(require, alias)
    if not loaded or type(validator) ~= "table" or type(validator.validate) ~= "function" then
        return invalid(impl_id, "validator library is not wired: " .. alias)
    end
    local err = validator.validate(payload)
    if err ~= nil and type(err) ~= "userdata" then return invalid(impl_id, "validator returned an untyped refusal") end
    return err
end

return M
