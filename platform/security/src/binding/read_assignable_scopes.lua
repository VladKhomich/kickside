local scope_catalog = require("scope_catalog")

-- Reads the assignable human scope catalog under Security's own registry and
-- database authority, so the result is independent of which policy, role and
-- scope entries the calling member may read.
local function read(): (any?, error?)
    return scope_catalog.scopes({ assignable = true })
end

return { read = read }
