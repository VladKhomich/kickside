-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local adapter = require("adapter")
local M = {}

local function failure(operation: string, path: string?, kind: string?): error
    local message = path and "upload test storage read failed" or "upload test storage unavailable"
    if path then message = message .. ": " .. path end
    local unavailable = kind == nil or kind == errors.UNAVAILABLE
    return errors.new({kind = kind or errors.UNAVAILABLE, message = message,
        retryable = unavailable, details = {
            code = unavailable and "upload_test_storage_unavailable" or "upload_test_storage_invalid",
            operation = operation,
        }})
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
    if storage_id == "app.upload_errors:invalid_storage" then
        return {readfile = function(_, path) return nil, failure("read", path, errors.INVALID) end}, nil
    end
    return adapter.get(storage_id, db_id, staging_id, cloud_id, query_db)
end

return M
