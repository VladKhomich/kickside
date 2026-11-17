-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Standalone Automation has no Workflow run storage. Workflows supplies its
-- validator through delete_admission_library when that module is installed.
local M = {}
function M.validate(_payload: table): error?
    return nil
end
return M
