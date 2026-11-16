-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
function M.validate(payload: table): error?
    local p = payload :: any
    local rows, err = p.tx:query("SELECT impl_id,deleting_at,delete_intent FROM kickside_components WHERE component_id=$1", {p.component_id})
    if err then return err end
    if not rows or not rows[1] or rows[1].impl_id ~= p.impl_id
        or rows[1].deleting_at ~= nil or rows[1].delete_intent ~= nil then
        return errors.new({kind=errors.INTERNAL, message="validator did not receive the live admission transaction"})
    end
    return errors.new({kind=errors.CONFLICT, retryable=false,
        message="fixture refuses deletion", details={code="fixture_delete_refused"}})
end
return M
