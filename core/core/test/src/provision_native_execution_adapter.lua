local fixture = require("fixture")
local identity = require("identity")
return {bind = fixture.bind, VERSION = identity.VERSION, is_maintenance_key = identity.is_maintenance_key, principal_of_key = identity.principal_of_key,
    validate = identity.validate, same_principal = identity.same_principal, utc_now = identity.utc_now}
