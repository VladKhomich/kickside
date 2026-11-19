-- The principal lifecycle reaper retries this contract until every upload and
-- its provider bytes have been erased.
local upload_lib = require("upload_lib")

local M = {}

function M.run(request: any): any
    local actor_id = type(request) == "table" and (request.principal_id or request.user_id) or nil
    if type(actor_id) ~= "string" or actor_id == "" then
        return { success = false, error = errors.new({ message = "principal_id is required", kind = errors.INVALID }) }
    end
    return upload_lib.purge_owner(actor_id)
end

return M
