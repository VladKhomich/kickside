-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- trigger_id is the launching Automation, independently of the Flow id.
-- Workflows owns both storage placement and the partial blocker index.
local store = require("store")
local M = {}
function M.validate(payload: table): error?
    local p = payload :: any
    local db, db_err = store.open_db()
    if not db then return errors.wrap(db_err, "automation deletion admission database unavailable") end
    local rows, err = db:query("SELECT run_id FROM workflow_runs WHERE trigger_id=$1"
        .. " AND (status IN ('pending','running') OR terminal_event_pending) ORDER BY run_id LIMIT 1", {p.component_id})
    db:release()
    if err then return errors.wrap(err, "automation deletion admission read failed") end
    if type(rows) ~= "table" then
        return errors.new({kind=errors.INTERNAL, retryable=false,
            message="automation deletion admission returned no rows"})
    end
    if rows[1] then
        return errors.new({kind=errors.CONFLICT, retryable=false,
            message="Automation has active runs or unpublished terminal events; delete again after they finish",
            details={code="automation_runs_active", automation_id=p.component_id}})
    end
    return nil
end
return M
