-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")

return { get = function(storage_id: string, ...: any): (any?, any?)
    if storage_id == "app:temporarily_unavailable_upload_storage" then
        return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true,
            message = "Upload storage temporarily unavailable", details = { code = "test_storage_unavailable" } })
    end
    return storage.get(storage_id, ...)
end }
