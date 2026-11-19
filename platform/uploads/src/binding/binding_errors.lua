-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local error_envelope = require("error_envelope")
local M = {}

function M.new(kind: string, message: string, code: string, retryable: boolean?, cause: error?): error
    local details: {[string]: any} = {}
    if cause then
        for key, value in pairs(cause:details() or {}) do details[key] = value end
        details.cause = error_envelope.encode(cause)
    end
    details.code = code
    return errors.new({kind = kind, message = message, retryable = retryable == true,
        details = details :: {[string]: any}})
end

-- Native dependency errors retain their classification and source metadata.
function M.from(err: any, kind: string, code: string, operation: string?): error
    local native = type(err) == "userdata" and (err :: error)
        or M.new(kind, tostring(err), code, kind == errors.UNAVAILABLE)
    local details = native:details() or {}
    if operation then
        local wrapped = error_envelope.wrap(native, operation, {code = details.code or code})
        return M.with_message(wrapped, operation .. ": " .. tostring(native))
    end
    if details.code then return native end
    local annotated: {[string]: any} = {}
    for key, value in pairs(details) do annotated[key] = value end
    annotated.code = code
    annotated.cause = details.cause or error_envelope.encode(native)
    return errors.new({kind = native:kind(), message = native:message(),
        retryable = native:retryable(), details = annotated :: {[string]: any}})
end

function M.with_message(err: error, message: string): error
    local native = error_envelope.with_cause(err)
    return errors.new({kind = native:kind(), message = message,
        retryable = native:retryable(), details = native:details()})
end

local PUBLIC_CAUSE_CODES = table.freeze({
    artifact_reference_not_found = true,
    invalid_storage_path = true,
    primary_artifact_missing = true,
    storage_access_denied = true,
    storage_unavailable = true,
})

function M.artifact_diagnostic(err: any, upload_id: string, artifact_id: string?): {[string]: any}
    local native = type(err) == "userdata" and (err :: error)
    local details = native and native:details() or {}
    return {
        kind = native and native:kind() or errors.INTERNAL,
        code = PUBLIC_CAUSE_CODES[details.code] and details.code or nil,
        upload_id = upload_id,
        artifact_id = artifact_id,
    }
end

return M
