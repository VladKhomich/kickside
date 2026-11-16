-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component holds the Workflow row lock throughout this read and delete mark.
-- The predicate matches idx_workflow_delete_blockers; LIMIT 1 seeks only blockers.
local M = {}
function M.validate(payload: table): error?
    local p = payload :: any
    local rows, err = p.tx:query("SELECT run_id FROM workflow_runs WHERE workflow_id=$1"
        .. " AND (status IN ('pending','running') OR terminal_event_pending) ORDER BY run_id LIMIT 1", {p.component_id})
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
