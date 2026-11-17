-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Run storage uses Workflows' configured database, independently of Component.
-- The predicate matches idx_workflow_delete_blockers; LIMIT 1 seeks only blockers.
local store = require("store")
local M = {}
function M.validate(payload: table): error?
    local p = payload :: any
    local db, db_err = store.open_db()
    if not db then return errors.wrap(db_err, "workflow deletion admission database unavailable") end
    local rows, err = db:query("SELECT run_id FROM workflow_runs WHERE workflow_id=$1"
        .. " AND (status IN ('pending','running') OR terminal_event_pending) ORDER BY run_id LIMIT 1", {p.component_id})
    db:release()
    if err then return errors.wrap(err, "workflow deletion admission read failed") end
    if type(rows) ~= "table" then
        return errors.new({kind=errors.INTERNAL, retryable=false,
            message="workflow deletion admission returned no rows"})
    end
    if rows[1] then
        return errors.new({kind=errors.CONFLICT, retryable=false,
            message="Workflow has active runs or unpublished terminal events; delete again after they finish",
            details={code="workflow_runs_active", workflow_id=p.component_id}})
    end
    return nil
end
return M
