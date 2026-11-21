-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local child_registration = require("child_registration")

local function run(request: any): any
    return child_registration.register_owned_child(request)
end

return {run = run}
