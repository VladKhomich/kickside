-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local owner_hooks = require("owner_hooks")
local function run(change: table?): (any, error?)
    fixture.hooks = fixture.hooks + 1
    return owner_hooks.run(change)
end
return {run = run}
