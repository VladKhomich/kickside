-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}

function M.call(id)
    assert(id == "wippy.facade:host_url")
    return M.host_url
end

return M
