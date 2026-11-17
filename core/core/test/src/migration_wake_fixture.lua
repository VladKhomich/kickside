-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {calls = 0}
local failure: error? = nil
function M.reset(err: error?): ()
    M.calls, failure = 0, err
end
M.registry = {CONSISTENT = "consistent", lookup = function(): (string?, error?)
    return nil, errors.new({kind = errors.NOT_FOUND, message = "lifecycle process has not started"})
end}
function M.notify(change: {kind: string}): (boolean?, error?)
    M.calls = M.calls + 1
    if failure then return nil, failure end
    return change.kind == "migrations_applied", nil
end
return M
