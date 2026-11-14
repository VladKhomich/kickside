-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
M.PROJECTION_ON = {LIFECYCLE = "lifecycle", THREAD = "thread"}
function M.declared_kinds(): {any}
    return {{impl_id = "test.window.plan", class = "plan", projections = {{kind = "plan", worker_ref = "func://app:test_count_worker"}}}}
end
return M
