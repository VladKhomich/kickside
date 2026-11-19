-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local config = require("config")
return {
    db_id = function(): string return "app:private_queue_retention_pace" end,
    policy = function(): (any?, error?)
        local policy, err = config.policy()
        if err or not policy then return nil, err end
        policy.lease_timeout_seconds = 1
        policy.lease_heartbeat_ms = 250
        return policy, nil
    end,
    worker_liveness = config.worker_liveness,
}
