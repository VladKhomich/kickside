-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local teardown = require("teardown")
return {run = function(args: any): any
    local ok, _, err = teardown.begin_delete(args.id, nil, nil)
    return {ok=ok, error=err}
end}
