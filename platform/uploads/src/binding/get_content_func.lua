local binding_errors = require("binding_errors")
local upload_query_repo = require("upload_query_repo")
local artifact_parts_repo = require("artifact_parts_repo")
local artifact_content_repo = require("artifact_content_repo")
local security = require("security")
local component = require("component")
local upload_types = require("types")
local ctx = require("ctx")
local metadata_sanitizer = require("metadata_sanitizer")
local uploads_resources = require("uploads_resources")
local upload_mime = require("upload_mime")
local log = require("logger"):named("kickside.uploads.binding.get_content")

local MAX_EXTRACTED_BYTES = 24 * 1024

local function public_storage_error(cause: error, message: string, code: string, upload_id: string,
    artifact_id: string?): error
    local diagnostic = binding_errors.artifact_diagnostic(cause, upload_id, artifact_id)
    log:warn(message, diagnostic)
    local source = (cause:details() or {}).artifact_read_source
    return errors.new({kind = cause:kind(), message = message, retryable = cause:retryable(), details = {
        code = diagnostic.code or code,
        artifact_read_source = (source == "blob" or source == "locator") and source or nil,
    }})
end

local function handle(args)
    args = args or {}

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

    local limit = args.max_size
    if limit ~= nil and (type(limit) ~= "number" or not (limit > 0 and limit < math.huge)
        or limit ~= math.floor(limit)) then
        return nil, binding_errors.new(errors.INVALID, "max_size must be a positive finite integer", "invalid_max_size")
    end
    if args.extracted_only == true then
        local extracted_limit = math.max(1, math.min(math.floor(tonumber(args.limit) or MAX_EXTRACTED_BYTES), MAX_EXTRACTED_BYTES))
        limit = math.min(limit or extracted_limit, extracted_limit)
    end
    local raw = args.format == "raw" and args.extracted_only ~= true
    local artifact_content, artifact_err, failed_artifact_id
    if not raw then
        artifact_content, artifact_err, failed_artifact_id = artifact_parts_repo.read_primary_content(
            upload_id, limit, { upload = upload, include_files = args.extracted_only ~= true })
    end
    if args.extracted_only == true then
        if artifact_err or not artifact_content or type(artifact_content.content) ~= "string" then
            local cause = artifact_err and binding_errors.from(artifact_err, errors.UNAVAILABLE, "artifact_read_failed")
                or binding_errors.new(errors.INTERNAL, "no primary artifact", "primary_artifact_missing")
            local details = cause:details() or {}
            local diagnostic = binding_errors.artifact_diagnostic(cause, upload_id, failed_artifact_id)
            log:warn("Failed to read extracted artifact", diagnostic)

            local read_source = details.artifact_read_source
            local public_message = read_source == "blob" and "failed to read artifact blob"
                or read_source == "locator" and "failed to read artifact bytes"
                or artifact_parts_repo.is_primary_artifact_missing(cause) and "primary content artifact not found"
            local message = "extracted text is not available"
            if public_message then message = message .. ": " .. public_message end
            local cause_code = diagnostic.code
            local code = not read_source and cause_code == "storage_unavailable" and cause_code or "artifact_read_failed"
            return {
                success = false,
                state = "unreadable",
                filename = metadata_sanitizer.public(upload.metadata).filename or "attachment",
                error = errors.new({kind = cause:kind(), message = message, retryable = cause:retryable(), details = {
                    code = code,
                    cause = {kind = cause:kind(), retryable = cause:retryable(), message = public_message or message,
                        details = {code = cause_code, upload_id = upload_id, artifact_id = failed_artifact_id}},
                }}),
            }
        end
        local content = artifact_content.content
        local artifact = type(artifact_content.artifact) == "table" and artifact_content.artifact or {}
        return {
            success = true,
            state = "ready",
            content = content,
            content_truncated = artifact_content.total_size > #content,
            truncated = artifact_content.total_size > #content,
            size = #content,
            total_size = artifact_content.total_size,
            content_type = artifact_content.mime_type,
            content_description = artifact_content.content_description,
            filename = metadata_sanitizer.public(upload.metadata).filename or "attachment",
            artifact_id = artifact.artifact_id,
            source_ref = { kind = "upload", upload_id = upload_id, artifact_id = artifact.artifact_id },
        }
    end
    if artifact_err and not artifact_parts_repo.is_primary_artifact_missing(artifact_err) then
        local cause = binding_errors.from(artifact_err, errors.UNAVAILABLE, "artifact_read_failed")
        return nil, public_storage_error(cause, "Failed to read primary upload artifact", "artifact_read_failed",
            upload_id, failed_artifact_id)
    end
    if not artifact_content then
        local metadata = metadata_sanitizer.public(upload.metadata)
        local description, describe_err = upload_mime.describe(upload.mime_type, metadata.filename)
        if describe_err then return nil, binding_errors.from(describe_err, errors.UNAVAILABLE, "upload_content_description_failed") end
        local storage_path = tostring(upload.storage_path or "")
        if storage_path == "" then
            return { success = false, error = binding_errors.new(errors.INTERNAL,
                "Original upload storage path is missing", "upload_storage_path_missing") }
        end
        local storage, storage_err = uploads_resources.get_storage(upload.storage_id)
        if storage_err or not storage then
            local cause = binding_errors.from(storage_err, errors.UNAVAILABLE, "storage_unavailable")
            return nil, public_storage_error(cause, "Failed to get upload storage", "storage_unavailable", upload_id)
        end
        local content, read_err, total_size
        if limit then
            content, read_err, total_size = artifact_content_repo.read_prefix(storage, storage_path, limit)
        else
            content, read_err = storage:readfile(storage_path)
        end
        if type(content) ~= "string" then
            local source = read_err and binding_errors.from(read_err, errors.UNAVAILABLE, "upload_content_read_failed")
                or binding_errors.new(errors.INTERNAL, "Failed to read original upload content", "upload_content_read_failed")
            return { success = false, error = public_storage_error(source, "Failed to read original upload content",
                "upload_content_read_failed", upload_id) }
        end
        return {
            success = true,
            content = content,
            content_type = raw and upload.mime_type or description.mime_type,
            content_description = description,
            size = #content,
            total_size = total_size,
            truncated = total_size and total_size > #content,
            metadata = metadata,
            artifact_id = nil,
            checksum = upload.content_sha256,
            source_ref = {
                kind = "upload",
                upload_id = upload_id,
                component_id = upload_types.owned_component(upload.actor_id),
                artifact_id = nil,
            },
        }
    end
    local content = artifact_content.content or ""
    local artifact = artifact_content.artifact or {}

    return {
        success = true,
        content = content,
        content_type = artifact_content.mime_type,
        content_description = artifact_content.content_description,
        size = #content,
        total_size = limit and artifact_content.total_size or nil,
        truncated = limit and artifact_content.total_size > #content,
        metadata = metadata_sanitizer.public(artifact_content.metadata),
        artifact_id = artifact.artifact_id,
        checksum = artifact.checksum,
        source_ref = {
            kind = "upload",
            upload_id = upload_id,
            artifact_id = artifact.artifact_id,
        },
    }
end

return { handle = handle }
