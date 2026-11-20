-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registration = require("registration")

local function run(request)
    local result
    if request.plugin then
        result = registration.register_root_attachment(request, request.custodian, request.plugin)
    else
        result = registration.register_owned_child(request)
    end
    assert(request.private_context._execution_identity == nil, "registration mutated the caller's context")
    return result
end

return {run = run}
