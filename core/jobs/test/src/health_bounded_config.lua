-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local config = require("config")
return {worker_liveness = config.worker_liveness, db_id = function(): string return "app:private_queue_health_bounded" end}
