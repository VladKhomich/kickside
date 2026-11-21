-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local uuid = require("uuid")
local time = require("time")
local component = require("component")
local access_policy = require("access_policy")
local records = require("upload_query_repo")
local storage = require("uploads_resources")
local content = require("artifact_content_repo")
local uploads = require("upload_lib")
local types = require("types")

local M = {}
local MAX_BYTES = 25 * 1024 * 1024

local function valid_id(value: any): boolean
    return type(value) == "string" and uuid.validate(value)
end

local function fail(kind: string, message: string, code: string): error
    return errors.new({kind = kind, message = message, details = {code = code}})
end

function M.adopt(request: any)
    if type(request) ~= "table" or not valid_id(request.upload_id)
        or not valid_id(request.component_id) or not valid_id(request.version_id) then
        return nil, fail(errors.INVALID, "upload, component and version IDs are required", "invalid_asset_request")
    end
    local lease = type(request.lease_until) == "string" and time.parse(time.RFC3339, request.lease_until) or nil
    if not lease then
        return nil, fail(errors.INVALID, "asset adoption lease is required", "invalid_asset_request")
    end
    local lease_ms = lease:unix_nano() // 1000000
    local remaining_ms = lease_ms - time.now():unix_nano() // 1000000
    if remaining_ms <= 0 or remaining_ms > 15 * 60 * 1000 then
        return nil, fail(errors.CONFLICT, "asset adoption lease is outside its window", "asset_lease_expired")
    end
    local actor = security.actor()
    if not actor or not security.can("uploads.asset.adopt", types.CLASS) then
        return nil, fail(errors.PERMISSION_DENIED, "asset adoption is unavailable", "asset_adoption_denied")
    end
    local owner, access_err = component.get_context_snapshot(request.component_id, component.ACCESS.WRITE)
    if access_err then return nil, access_err end
    if not owner or type(owner.impl_id) ~= "string" or owner.deleting_at
        or not access_policy.has_all(owner.access_level or 0, component.ACCESS.WRITE) then
        return nil, fail(errors.PERMISSION_DENIED, "component WRITE is required", "asset_adoption_denied")
    end
    local original, lookup_err = records.get(request.upload_id)
    if lookup_err and not errors.is(lookup_err, errors.NOT_FOUND) then return nil, lookup_err end
    if original and original.actor_id ~= actor:id() then
        return nil, fail(errors.PERMISSION_DENIED, "only the uploading actor may adopt an upload", "asset_adoption_denied")
    end
    if not original or original.storage_state ~= "completed" then
        return nil, fail(errors.NOT_FOUND, "completed upload not found", "upload_not_found")
    end
    if original.size > MAX_BYTES then
        return nil, fail(errors.INVALID, "upload exceeds the asset byte ceiling", "asset_too_large")
    end
    local backend, storage_err = storage.get_storage(original.storage_id)
    if storage_err then return nil, storage_err end
    local bytes, read_err = content.read_prefix(backend, original.storage_path, original.size + 1)
    if read_err then return nil, read_err end
    if type(bytes) ~= "string" or #bytes ~= original.size then
        return nil, fail(errors.CONFLICT, "upload bytes do not match recorded size", "upload_size_mismatch")
    end
    local filename = original.metadata.filename or original.metadata.original_filename or "file"
    local asset, err = uploads.store_component_file(request.component_id, request.version_id,
        bytes, filename, original.mime_type, owner.impl_id, lease_ms, original.content_sha256)
    if err then return nil, err end
    return {upload_id = asset.uuid}, nil
end

function M.reap(request: any)
    if type(request) ~= "table" or not valid_id(request.component_id) or not valid_id(request.version_id)
        or type(request.owner_impl) ~= "string" or request.owner_impl == "" then
        return nil, fail(errors.INVALID, "component and version IDs are required", "invalid_asset_request")
    end
    if not security.can("uploads.asset.reap", request.component_id, {impl_id = request.owner_impl}) then
        return nil, fail(errors.PERMISSION_DENIED, "asset collection is unavailable", "asset_reap_denied")
    end
    local deleted, err = uploads.reap_component_file(request.component_id, request.version_id, request.owner_impl)
    if err and not errors.is(err, errors.NOT_FOUND) then return nil, err end
    if errors.is(err, errors.NOT_FOUND) then
        local remaining, read_err = records.get(request.version_id)
        if remaining or not errors.is(read_err, errors.NOT_FOUND) then return nil, read_err or err end
    end
    return {deleted = deleted ~= nil}, nil
end

return M
