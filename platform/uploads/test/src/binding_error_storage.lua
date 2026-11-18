-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local adapter = require("adapter")
local M = {}

local function failure(operation: string, path: string?): error
    local message = "upload test storage unavailable"
    if path then message = message .. ": " .. path end
    return errors.new({kind = errors.UNAVAILABLE, message = message,
        retryable = true, details = {code = "upload_test_storage_unavailable", operation = operation}})
end

function M.get(storage_id, db_id, staging_id, cloud_id, query_db)
    if storage_id == "app.upload_errors:unavailable_storage" then
        return nil, failure("acquire")
    end
    if storage_id == "app.upload_errors:legacy_storage" then
        return nil, "upload test legacy storage failure"
    end
    if storage_id == "app.upload_errors:unreadable_storage" then
        return {readfile = function(_, path) return nil, failure("read", path) end}, nil
    end
    return adapter.get(storage_id, db_id, staging_id, cloud_id, query_db)
end

return M
