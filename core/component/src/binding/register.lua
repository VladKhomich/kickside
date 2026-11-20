-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registration = require("registration")

local function handle(request)
    return registration.handle(request, false)
end

return {handle = handle}
