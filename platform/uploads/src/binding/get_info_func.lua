local binding_errors = require("binding_errors")
local upload_query_repo = require("upload_query_repo")
local artifact_parts_repo = require("artifact_parts_repo")
local security = require("security")
local component = require("component")
local upload_types = require("types")
local ctx = require("ctx")
local metadata_sanitizer = require("metadata_sanitizer")
local upload_mime = require("upload_mime")

local function handle(args)
    local upload_id, err = ctx.get("upload_id")
    if err then
        return nil, binding_errors.new(errors.INVALID, "Failed to get upload_id from context: " .. tostring(err), "upload_id_required", false, err)
    end

    if type(upload_id) ~= "string" or upload_id == "" then
        return nil, binding_errors.new(errors.INVALID, "upload_id is required in context", "upload_id_required")
    end

    local upload, err = upload_query_repo.get(upload_id)
    if err then
        return nil, binding_errors.from(err, errors.UNAVAILABLE,
            errors.is(err, errors.NOT_FOUND) and "upload_not_found" or "upload_lookup_failed")
    end

    local actor = security.actor()
    if not actor then
        return nil, binding_errors.new(errors.PERMISSION_DENIED, "No authenticated actor found", "actor_required")
    end

    local component_id = upload_types.component_id_for_owner(upload.actor_id)
    if not component_id then
        return nil, binding_errors.new(errors.INTERNAL, "Upload owner is invalid", "upload_owner_invalid")
    end
    local _, access_err = component.validate_access(component_id, component.ACCESS.READ)
    if access_err then return nil, binding_errors.from(access_err, errors.PERMISSION_DENIED, "access_denied") end

    local description
    local raw = args and args.format == "raw"
    local size = upload.size
    local original_metadata = upload.metadata or {}
    local metadata = original_metadata
    local artifact_id = nil
    local checksum = nil

    if not raw then
        local artifact, artifact_err, effective = artifact_parts_repo.get_primary_content_artifact(upload_id, { upload = upload, include_files = true })
        if artifact_err and not errors.is(artifact_err, errors.NOT_FOUND) then
            return nil, binding_errors.from(artifact_err, errors.UNAVAILABLE, "artifact_read_failed")
        end
        if artifact then
            local artifact_meta = artifact.metadata or {}
            description = effective
            size = artifact.size
            metadata = artifact_meta
            artifact_id = artifact.artifact_id
            checksum = artifact.checksum
        end
    else
        checksum = upload.content_sha256
    end

    if not description then
        local describe_err
        description, describe_err = upload_mime.describe(upload.mime_type, metadata.filename)
        if describe_err then return nil, binding_errors.from(describe_err, errors.UNAVAILABLE, "upload_content_description_failed") end
    end
    metadata = metadata_sanitizer.public(metadata)

    local filename = metadata.filename or metadata.original_filename
        or original_metadata.filename or original_metadata.original_filename or "unknown"

    return {
        success = true,
        content_type = raw and upload.mime_type or description.mime_type,
        content_description = description,
        size = size,
        filename = filename,
        created_at = upload.created_at,
        metadata = metadata,
        artifact_id = artifact_id,
        checksum = checksum,
        source_ref = {
            kind = "upload",
            upload_id = upload_id,
            artifact_id = artifact_id,
        },
    }
end

return { handle = handle }
