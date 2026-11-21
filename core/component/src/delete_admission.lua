-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Implementation validators read their configured storage before Component opens
-- its transaction. They never perform cleanup or other external side effects.
local autoinit = require("autoinit")
local M = {}

local function invalid(impl_id: string, message: string): error
    return errors.new({kind=errors.INTERNAL, retryable=false,
        message="component deletion admission " .. impl_id .. ": " .. message,
        details={code="component_delete_admission_invalid", impl_id=impl_id}})
end

function M.declaration(impl_id: string): (table?, error?)
    local entry, lookup_err = autoinit.kind_for_impl(impl_id)
    if lookup_err and not errors.is(lookup_err, errors.NOT_FOUND) then return nil, lookup_err end
    local meta = entry and type(entry.meta) == "table" and entry.meta or {}
    local value = meta.delete_owned_components
    if value ~= nil and type(value) ~= "boolean" then
        return nil, invalid(impl_id, "delete_owned_components must be a boolean")
    end
    return meta, nil
end

function M.validate(payload: table, declaration: any): error?
    local impl_id = (payload :: any).impl_id
    local alias = declaration.delete_admission
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
