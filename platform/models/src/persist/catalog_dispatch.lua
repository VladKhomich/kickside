-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")

local function run(): any
    local result, err = funcs.call("kickside.models.persist:reload_catalog")
    if err then return { error = err } end
    return result
end

return { run = run }
