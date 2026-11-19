local fixture = require("fixture")
local real = require("real")
return {register = real.register, has_access = function() return true, nil end, ensure_thread_type = function() return true, nil end, remove = real.remove, impl_id = fixture.impl_id}
