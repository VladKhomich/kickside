-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M: {diagnostic: string?, records: {any}} = {records = {}}
function M:named(name: string)
    local log = {}
    local function record(level: string, message: string, fields: any)
        M.records[#M.records + 1] = {name = name, level = level, message = message, fields = fields}
        if level == "warn" then M.diagnostic = fields.error end
    end
    function log:info(message: string, fields: any) record("info", message, fields) end
    function log:warn(message: string, fields: any) record("warn", message, fields) end
    function log:error(message: string, fields: any) record("error", message, fields) end
    return log
end
return M
