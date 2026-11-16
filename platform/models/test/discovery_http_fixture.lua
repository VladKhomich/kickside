-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
local response: any = nil
local failure: any = nil
function M.prepare(value: any, err: any)
    response, failure = value, err
end
function M.get(_url: string, _opts: any): (any?, any?)
    return response, failure
end
M.post = M.get
return M
