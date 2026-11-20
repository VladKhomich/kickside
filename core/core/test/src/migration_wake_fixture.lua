-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {calls = 0, provisions = 0}
local failure: error? = nil
local provision_failure: error? = nil
function M.reset(err: error?, provision_err: error?): ()
    M.calls, M.provisions = 0, 0
    failure, provision_failure = err, provision_err
end
M.registry = {CONSISTENT = "consistent", lookup = function(): (string?, error?)
    return nil, errors.new({kind = errors.NOT_FOUND, message = "lifecycle process has not started"})
end}
function M.notify(change: {kind: string}): (boolean?, error?)
    M.calls = M.calls + 1
    if failure then return nil, failure end
    return change.kind == "migrations_applied", nil
end
function M.ensure_system(): ({string}?, error?)
    M.provisions = M.provisions + 1
    if provision_failure then return nil, provision_failure end
    return {}, nil
end
return M
