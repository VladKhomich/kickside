-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local cipher = require("secret_cipher")
local M = {alias_reads = 0, key_loads = 0}
function M.get(resource: string): (string?, error?)
    if resource ~= "kickside.component.env:encryption_key" then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "only the owner alias is readable"})
    end
    M.alias_reads = M.alias_reads + 1
    return "app:secret_test_key", nil
end
function M.load_key(variable: string): (string?, error?)
    M.key_loads = M.key_loads + 1
    if variable ~= "app:secret_test_key" then
        return nil, errors.new({kind = errors.INVALID, message = "unexpected key requirement binding"})
    end
    return cipher.load_key(variable)
end
M.seal = cipher.seal
M.open = cipher.open
return M
