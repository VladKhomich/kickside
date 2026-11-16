-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local canonical = require("canonical")
local M = {calls = 0}
function M.hash(value: any): (string?, error?)
    M.calls = M.calls + 1
    return canonical.hash(value)
end
return M
