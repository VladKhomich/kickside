-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
local response: any = nil
local failure: any = nil
local request_timeout: string? = nil
function M.prepare(value: any, err: any)
    response, failure = value, err
    request_timeout = nil
end
function M.timeout(): string?
    return request_timeout
end
function M.get(_url: string, opts: any): (any?, any?)
    request_timeout = opts and opts.timeout
    return response, failure
end
M.post = M.get
return M
