-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local adapter = require("adapter")
return {run = function(args)
    local storage = assert(adapter.get("app:uploads"))
    local value, err = storage:stat(args.kind .. "://app:objects/key")
    local details = err and err:details() or {}
    return {returned = true, missing = value == nil, denied = errors.is(err, errors.PERMISSION_DENIED),
        unavailable = errors.is(err, errors.UNAVAILABLE), code = details.code,
        cause_kind = details.cause and details.cause.kind, message = tostring(err)}
end}
