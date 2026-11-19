-- GET /security/policies — policy inventory and the role editor's assignable
-- permissions. Admin-only via firewall and an explicit endpoint access check.

local http = require("http")
local api_errors = require("api_errors")
local security = require("security")
local catalog = require("scope_catalog")

local GATE = "kickside.security.api:list_policies.endpoint"

local function handler()
    local res, req, context_err = api_errors.context()
    if context_err then return nil, context_err end
    local header_err = api_errors.prepare(res)
    if header_err then return nil, header_err end

    if not security.actor() or not security.can("access", GATE) then
        return api_errors.write(res, http.STATUS.FORBIDDEN, api_errors.denied())
    end

    local policies, read_err = catalog.policies({
        assignable = req:query("assignable") == "true",
        include_private = req:query("include_private") == "true",
    })
    if read_err then return api_errors.write(res, http.STATUS.INTERNAL_ERROR, read_err) end
    return api_errors.respond(res, http.STATUS.OK, { success = true, policies = policies })
end

return { handler = handler }
