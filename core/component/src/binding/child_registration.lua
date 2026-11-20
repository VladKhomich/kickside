-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local envelope = require("envelope")
local registration = require("registration")
local context_policy = require("context_policy")

local function register_owned_child(request)
    -- Static invocation retains the ordinary register method's admission.
    local service, open_err = context_policy.get_component_service()
    if open_err then return envelope.from_error(open_err) end
    if not service then return envelope.fail("component service unavailable", errors.UNAVAILABLE) end
    local allowed, err = security.can("contract.call", "register")
    if err then return envelope.from_error(err) end
    if allowed ~= true then
        return envelope.fail("not allowed to call method: register", errors.PERMISSION_DENIED)
    end
    return registration.handle(request, true)
end

return {register_owned_child = register_owned_child}
