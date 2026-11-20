-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registration = require("registration")

local function run(request)
    local result = registration.register_owned_child(request)
    assert(request.private_context._execution_identity == nil, "registration mutated the caller's context")
    return result
end

return {run = run}
