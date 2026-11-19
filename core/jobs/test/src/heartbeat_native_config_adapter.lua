local config = require("config")
local fixture = require("fixture")
return {process_host = function() return "app:processes" end, db_id = function() return "app:db" end,
    policy = function()
        local policy, err = config.policy()
        if err then return nil, err end
        return fixture.result("policy", policy)
    end,
    worker_liveness = config.worker_liveness}
