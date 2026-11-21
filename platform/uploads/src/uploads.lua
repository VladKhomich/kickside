local uuid = require("uuid")
local time = require("time")
local hash = require("hash")
local funcs = require("funcs")
local logger = require("logger")
local execution_identity = require("execution_identity")
local binding_errors = require("binding_errors")

local upload_record_repo = require("upload_record_repo")
local upload_query_repo = require("upload_query_repo")
local upload_response = require("upload_response")
local upload_tokens = require("upload_tokens")
local upload_read_model = require("upload_read_model")
local upload_type = require("upload_type")
local artifact_cleanup_repo = require("artifact_cleanup_repo")
local relocation_cleanup = require("relocation_cleanup_repo")
local resources = require("uploads_resources")
local uploads_events = require("uploads_events")
local upload_types = require("types")
local pipeline_lib = require("pipeline_lib")
local jobs = require("jobs")
local process_worker = require("process_worker")

local log = logger:named("upload_lib")

local IDENTITY_META_KEY = assert(execution_identity.CONTEXT_KEY, "execution_identity.CONTEXT_KEY is required")

local upload_lib = {}

-- The caller authorizes read access before issuing this bearer URL.
function upload_lib.delivery_url(upload_id: string, options: any?): (string?, any?)
    local upload, read_err = upload_query_repo.get(upload_id)
    if read_err then return nil, read_err end
    if not upload then
        return nil, errors.new({message = "Upload not found", kind = errors.NOT_FOUND, retryable = false})
    end
    if upload_types.owned_component(upload.actor_id) then
        return upload_response.raw_path(upload_id), nil
    end
    local url, delivery_err = upload_response.delivery_url(upload.storage_id, upload.storage_path, nil,
        options and {expiration = options.expires_in} or nil)
    if delivery_err then return nil, delivery_err end
    if url then return url, nil end
    local token, token_err = upload_tokens.pack_read({upload_id = upload_id,
        audience = options and options.audience, expires_in = options and options.expires_in})
    if not token then return nil, token_err end
    return upload_response.raw_path(upload_id) .. "?token=" .. token, nil
end

local function failure(message: string, kind: string, error_kind: string, retryable: boolean?): error
    return errors.new({ message = message, kind = kind, retryable = retryable == true,
        details = { error_kind = error_kind } })
end

local function typed(err: any, kind: string, error_kind: string, prefix: string): error
    if type(err) == "userdata" then return err :: error end
    return failure(prefix .. tostring(err), kind, error_kind, kind == errors.UNAVAILABLE or kind == errors.INTERNAL)
end

local function cancel_processing_job(upload)
    if type(upload.processing_job_id) ~= "string" or upload.processing_job_id == "" then return end
    local _, cancel_err = jobs.cancel(upload.processing_job_id)
    if cancel_err then
        log:warn("failed to cancel upload job", { upload_id = upload.uuid, error = tostring(cancel_err) })
    end
end

local upload_mime = require("upload_mime")
local get_file_extension = upload_mime.get_file_extension
local determine_upload_type = upload_mime.determine_upload_type

local function freeze_current_identity(metadata: any, parent_upload_id: string?, actor_id: string?): any?
    if type(metadata) ~= "table" then
        return errors.new({ message = "upload metadata table is required", kind = errors.INVALID,
            retryable = false, details = { error_kind = "declaration" } })
    end
    if metadata[IDENTITY_META_KEY] ~= nil then
        return errors.new({ message = "caller cannot supply upload execution identity", kind = errors.INVALID,
            retryable = false, details = { error_kind = "declaration" } })
    end
    if parent_upload_id then
        local parent, parent_err = upload_query_repo.get(parent_upload_id)
        if parent_err or not parent or parent.actor_id ~= actor_id then
            return errors.new({ message = "trusted parent upload is unavailable", kind = errors.PERMISSION_DENIED,
                retryable = false, details = { error_kind = "subject" } })
        end
        local row = type(parent.metadata) == "table" and parent.metadata[IDENTITY_META_KEY] or nil
        if type(row) ~= "table" then
            return errors.new({ message = "parent upload execution identity is required", kind = errors.PERMISSION_DENIED,
                retryable = false, details = { error_kind = "subject" } })
        end
        local _, row_err = execution_identity.from_row(row.actor_id, row.actor_context)
        if row_err then return row_err end
        if row.actor_id ~= actor_id then
            return failure("parent upload identity does not match its owner", errors.PERMISSION_DENIED, "subject")
        end
        metadata[IDENTITY_META_KEY] = { actor_id = row.actor_id, actor_context = row.actor_context }
        return nil
    end
    local identity, capture_err = execution_identity.capture()
    if not identity then
        return capture_err
    end
    local row, row_err = execution_identity.to_row(identity)
    if not row then
        return row_err
    end
    if actor_id and row.actor_id ~= actor_id then
        return failure("upload actor does not match authenticated caller", errors.PERMISSION_DENIED, "access")
    end
    metadata[IDENTITY_META_KEY] = { actor_id = row.actor_id, actor_context = row.actor_context }
    return nil
end

local function remove_storage_path(storage: any, storage_path: any, upload_id: any): error?
    local path = type(storage_path) == "string" and storage_path or ""
    if path == "" then return nil end
    if not storage then return failure("storage unavailable", errors.UNAVAILABLE, "infrastructure", true) end
    local _, remove_err = storage:remove(path)
    if remove_err ~= nil then
        if tostring(remove_err):find("no such file or directory", 1, true) then
            return nil
        end
        return typed(remove_err, errors.UNAVAILABLE, "infrastructure", "upload storage cleanup failed: ")
    end
    return nil
end

-- Release an upload's heavy storage: the original stored bytes plus every artifact
-- it owns. Artifact blobs are content-addressed and refcounted, so delete_for_upload
-- keeps any blob still referenced by a surviving upload's artifact. The original
-- bytes are per-upload (content dedup resolves before a second row is ever stored),
-- so removing them is unconditional. A byte-delete failure aborts the row delete so
-- the storage path remains durably discoverable for retry.
-- This is the single storage-teardown primitive shared by the rejected-upload,
-- failed-upload, and delete paths.
local function release_storage(upload: any, storage_override: any?): error?
    if type(upload) ~= "table" or type(upload.uuid) ~= "string" or upload.uuid == "" then return nil end

    local _, cleanup_err = relocation_cleanup.flush(upload)
    if cleanup_err then return cleanup_err end

    local storage = storage_override
    if not storage then
        local resolved, storage_err = resources.get_storage(tostring(upload.storage_id or ""))
        if storage_err then
            return typed(storage_err, errors.UNAVAILABLE, "infrastructure", "failed to get storage for upload cleanup: ")
        else
            storage = resolved
        end
    end
    local storage_err = remove_storage_path(storage, upload.storage_path, upload.uuid)
    if storage_err then return storage_err end

    local _, artifacts_err = artifact_cleanup_repo.delete_for_upload(upload.uuid)
    if artifacts_err then
        return typed(artifacts_err, errors.UNAVAILABLE, "infrastructure", "artifact cleanup failed for upload: ")
    end
    return nil
end

local function invoke_on_delete(upload, owner_teardown: boolean): error?
    if not upload.type_id or upload.type_id == "" then
        return nil
    end

    local on_delete, err = upload_type.get_on_delete(upload.type_id, owner_teardown)
    if err then return typed(err, errors.UNAVAILABLE, "infrastructure", "upload delete stages unavailable: ") end
    if type(on_delete) ~= "table" then
        return failure("upload delete stages returned no result", errors.INTERNAL, "infrastructure", true)
    end
    if #on_delete == 0 then return nil end

    local executor
    for i, stage in ipairs(on_delete) do
        local owner_func = owner_teardown and stage.owner_func or nil
        local func_id = owner_func or stage.func
        if func_id then
            local result, call_err
            if owner_func then
                -- A registered owner cleanup owns a narrow maintenance operation.
                -- It receives the stored owner and upload ID, with no user credentials or private metadata.
                result, call_err = funcs.call(tostring(owner_func), { upload_id = upload.uuid, owner_id = upload.actor_id })
            else
                -- Ordinary stages use the execution identity frozen when the file was uploaded.
                if not executor then
                    local recon_err
                    executor, recon_err = pipeline_lib.upload_stage_executor(upload, "delete:" .. tostring(upload.uuid), {
                        upload_id = upload.uuid,
                        actor_id = upload.actor_id,
                        mime_type = upload.mime_type,
                        type_id = upload.type_id,
                    })
                    if recon_err or not executor then
                        return typed(recon_err or "no executor", errors.UNAVAILABLE, "infrastructure",
                            "upload delete execution identity unavailable: ")
                    end
                end
                result, call_err = executor:call(tostring(func_id), {
                    upload_id = upload.uuid,
                    mime_type = upload.mime_type,
                    storage_id = upload.storage_id,
                    storage_path = upload.storage_path,
                    size = upload.size,
                    metadata = upload.metadata,
                    processor_id = func_id,
                })
            end

            if call_err then
                return typed(call_err, errors.UNAVAILABLE, "infrastructure",
                    "upload delete stage " .. tostring(i) .. " failed: ")
            end
            if type(result) ~= "table" or result.success ~= true then
                return failure("upload delete stage " .. tostring(i) .. " reported no success",
                    errors.UNAVAILABLE, "infrastructure", true)
            end
        end
    end
    return nil
end

local token_flow = require("uploads_tokens")

local function persist_file(actor_id: string, file_data: string | stream.Stream, filename: string, size: number, mime_type: string?, storage_id: string?, metadata: any, parent_upload_id: string?, processing: boolean, multipart_token: string?, admission_id: string?)
    metadata = type(metadata) == "table" and metadata or {}
    local bound_id, multipart_payload
    if multipart_token ~= nil then
        multipart_payload = upload_tokens.unpack(multipart_token)
        if not multipart_payload then
            return nil, failure("Invalid or expired upload token", errors.INVALID, "declaration")
        end
        bound_id = multipart_payload.upload_id
        metadata.__upload_token = multipart_token
    else
        local bound_err
        bound_id, bound_err = token_flow.bound_token_upload_id(metadata)
        if bound_err then return nil, bound_err end
    end
    if admission_id and (bound_id or parent_upload_id) then
        return nil, failure("Delivery uploads cannot bind a callback or parent", errors.INVALID, "declaration")
    end
    local upload_uuid = parent_upload_id and uuid.v4() or (admission_id or bound_id or uuid.v4())
    if parent_upload_id then
        local rebind_err = token_flow.rebind_child_tokens(metadata, upload_uuid)
        if rebind_err then return nil, rebind_err end
    end

    local existing, lookup_err = upload_query_repo.get(upload_uuid)
    if lookup_err and not errors.is(lookup_err, errors.NOT_FOUND) then
        return nil, lookup_err
    end
    if existing then
        return nil, failure("upload already exists", errors.CONFLICT, "declaration")
    end

    local storage, err = resources.get_storage(storage_id)
    if err then
        return nil, typed(err, errors.UNAVAILABLE, "infrastructure", "")
    end

    local ext = get_file_extension(filename)
    local storage_path = uuid.v4()
    if ext and ext ~= "" then
        storage_path = storage_path .. "." .. ext
    end

    metadata.filename = filename
    local trace_context, trace_err = token_flow.take_trace_context(metadata, multipart_payload)
    if trace_err then return nil, typed(trace_err, errors.INVALID, "declaration", "") end

    -- Freeze the uploader's execution identity so the durable job can run pipeline
    -- stages as the authorizing user. Scoped work reconstructs from this.
    -- The managed key is stripped from callbacks/API views, so it never leaves the server.
    local component_owner = not processing and admission_id ~= nil and upload_types.owned_component(actor_id)
    if not component_owner then
        local identity_err = freeze_current_identity(metadata, parent_upload_id, actor_id)
        if identity_err then return nil, identity_err end
    end

    local description, mime_err = upload_mime.describe(mime_type, filename)
    if mime_err then return nil, typed(mime_err, errors.UNAVAILABLE, "infrastructure", "") end
    mime_type = description.mime_type

    local success
    success, err = storage:writefile(storage_path, file_data)
    if not success then
        return nil, typed(err, errors.UNAVAILABLE, "infrastructure", "Failed to write file: ")
    end

    if ext:lower() == "dot" and mime_type == "text/vnd.graphviz" then
        local file, open_err = storage:open(storage_path, "r")
        local signature, inspect_err
        if file then
            local read_err
            signature, read_err = file:read(8)
            local _, close_err = file:close()
            if read_err then inspect_err = tostring(read_err) end
            if close_err then inspect_err = (inspect_err and inspect_err .. "; " or "") .. tostring(close_err) end
        else
            inspect_err = tostring(open_err)
        end
        if inspect_err then
            local remove_err = remove_storage_path(storage, storage_path, upload_uuid)
            if remove_err then inspect_err = inspect_err .. "; " .. tostring(remove_err) end
            return nil, typed(inspect_err, errors.UNAVAILABLE, "infrastructure", "Failed to inspect template: ")
        end
        if signature == string.char(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1) then
            mime_type = "application/msword"
        end
    end

    local type_id, type_err = determine_upload_type(mime_type, filename)
    if not type_id then
        local remove_err = remove_storage_path(storage, storage_path, upload_uuid)
        if remove_err then return nil, remove_err end
        return nil, typed(type_err, errors.INVALID, "declaration", "")
    end

    -- Per-account content-hash deduplication. The bytes are now persisted, so hash them:
    -- a string input is hashed directly; a stream input (already consumed by writefile)
    -- is hashed from the stored copy. A hashing failure degrades to a non-deduplicated
    -- upload rather than blocking it.
    local content_sha256: string? = nil
    if (processing or component_owner) and type(file_data) == "string" then
        content_sha256 = hash.sha256(file_data :: string)
    elseif processing then
        local stored = storage:readfile(storage_path)
        if type(stored) == "string" then
            content_sha256 = hash.sha256(stored)
        end
    end
    -- A callback token names this upload exactly; content dedup cannot redirect it
    -- to a prior upload with a different UUID.
    if bound_id or (admission_id and not component_owner) then content_sha256 = nil end

    -- If this account already holds these exact bytes, drop the just-written copy and
    -- resolve to the existing upload: no second blob, no re-processing. The same file may
    -- still be attached to multiple KBs -- dedup is at the file/blob level only.
    if content_sha256 and content_sha256 ~= "" and not bound_id and not component_owner then
        local existing, lookup_err = upload_query_repo.find_by_content_hash(actor_id, content_sha256, parent_upload_id or "")
        if lookup_err then
            local remove_err = remove_storage_path(storage, storage_path, upload_uuid)
            if remove_err then lookup_err = tostring(lookup_err) .. "; " .. tostring(remove_err) end
            return nil, typed(lookup_err, errors.UNAVAILABLE, "infrastructure", "Failed to find existing upload: ")
        end
        if existing and existing.storage_state == "failed" then
            local _, release_err = upload_record_repo.release_content_hash(existing.uuid)
            if release_err then
                local remove_err = remove_storage_path(storage, storage_path, upload_uuid)
                if remove_err then release_err = tostring(release_err) .. "; " .. tostring(remove_err) end
                return nil, typed(release_err, errors.UNAVAILABLE, "infrastructure", "Failed to release failed upload: ")
            end
            existing = nil
        end
        if existing then
            local remove_err = remove_storage_path(storage, storage_path, existing.uuid)
            if remove_err then return nil, remove_err end
            token_flow.fill_missing_trace_context(existing, trace_context)
            token_flow.handle_dedup_upload_token(existing, metadata)
            existing.deduped = true
            return existing
        end
    end

    local create_args = { n = 13,
        upload_uuid,
        actor_id,
        size,
        mime_type,
        resources.get_storage_id(storage_id),
        storage_path,
        type_id,
        metadata,
        processing and "uploaded" or "completed",
        content_sha256,
        trace_context,
        processing,
    }
    local function create_record(tx, _dbtype, ceiling)
        create_args[13] = ceiling
        if tx then return upload_record_repo.create_tx(tx, table.unpack(create_args, 1, create_args.n)) end
        return upload_record_repo.create(table.unpack(create_args, 1, create_args.n))
    end
    local upload
    if processing then
        local submitted
        submitted, err = process_worker.enqueue_upload_job({ uuid = upload_uuid, actor_id = actor_id,
            mime_type = mime_type, size = size, type_id = type_id, metadata = metadata,
            trace_context = trace_context },
            false, create_record)
        upload = submitted and submitted.upload
    else
        upload, err = create_record(nil)
    end

    if err then
        if not upload then
            local remove_err = remove_storage_path(storage, storage_path, upload_uuid)
            if remove_err then return nil, typed(remove_err, errors.INTERNAL, "infrastructure", tostring(err) .. "; ") end
        end
        return nil, typed(err, errors.INTERNAL, "infrastructure", "Failed to create upload record: ")
    end

    -- A concurrent identical upload won the unique index: create resolved to that record
    -- instead of inserting ours. Drop our orphan blob and reference the winner; the
    -- winner already drives processing.
    if upload.deduped and upload.uuid ~= upload_uuid then
        local remove_err = remove_storage_path(storage, storage_path, upload.uuid)
        if remove_err then return nil, remove_err end
        token_flow.fill_missing_trace_context(upload, trace_context)
        token_flow.handle_dedup_upload_token(upload, metadata)
        return upload
    end

    return upload
end

function upload_lib.store_component_file(component_id: string, version_id: string, data: string,
    filename: string, mime_type: string)
    return persist_file(upload_types.component_owner_key(component_id), data, filename, #data,
        mime_type, nil, {}, nil, false, nil, version_id)
end

function upload_lib.store_file(actor_id: string, file_data: string | stream.Stream, filename: string, size: number, mime_type: string?, storage_id: string?, metadata: any, parent_upload_id: string?)
    return persist_file(actor_id, file_data, filename, size, mime_type, storage_id, metadata, parent_upload_id, false)
end

function upload_lib.upload_file(actor_id: string, file_data: string | stream.Stream, filename: string, size: number, mime_type: string?, storage_id: string?, metadata: any, parent_upload_id: string?, multipart_token: string?)
    return persist_file(actor_id, file_data, filename, size, mime_type, storage_id, metadata, parent_upload_id, true, multipart_token)
end

local DELIVERY_METADATA = "__attachment_delivery"

local function delivery_upload_id(actor_id: string, delivery_key: string): (string?, error?)
    local digest = hash.sha256("kickside.uploads.attachment:" .. tostring(#actor_id) .. ":" .. actor_id .. delivery_key)
    if type(digest) ~= "string" or #digest ~= 64 then
        return nil, failure("Could not derive attachment delivery identity", errors.INTERNAL, "infrastructure", true)
    end
    return table.concat({digest:sub(1, 8), digest:sub(9, 12), "8" .. digest:sub(14, 16),
        "8" .. digest:sub(18, 20), digest:sub(21, 32)}, "-"), nil
end

-- Compare the immutable provider descriptor even on replay.
function upload_lib.find_delivery_upload(actor_id: string, delivery_key: string, signature: string): (any?, error?)
    local id, id_err = delivery_upload_id(actor_id, delivery_key)
    if id_err or not id then return nil, id_err end
    local found, err = upload_query_repo.get(id)
    if errors.is(err, errors.NOT_FOUND) then return nil, nil end
    if err or not found then return nil, err end
    if found.actor_id ~= actor_id or found.metadata[DELIVERY_METADATA] ~= signature then
        return nil, failure("Upload delivery is already bound to another attachment", errors.CONFLICT, "declaration")
    end
    return found, nil
end

function upload_lib.upload_delivery_file(actor_id: string, delivery_key: string, signature: string,
        data: string, filename: string, mime_type: string?, metadata: any): (any?, error?)
    local id, id_err = delivery_upload_id(actor_id, delivery_key)
    if id_err or not id then return nil, id_err end
    metadata[DELIVERY_METADATA] = signature
    local upload, err = persist_file(actor_id, data, filename, #data, mime_type, nil, metadata, nil, true, nil, id)
    -- Contenders use separate storage paths. Only one UUID/Jobs transaction
    -- can commit. The normal failed-create path removes a loser's blob.
    if errors.is(err, errors.CONFLICT) then
        local winner, read_err = upload_lib.find_delivery_upload(actor_id, delivery_key, signature)
        if winner or read_err then return winner, read_err end
    end
    return upload, err
end

-- Run the processing of a failed upload again on its stored bytes.
function upload_lib.retry_upload(uuid)
    local upload, err = upload_query_repo.get(uuid)
    if err then
        if errors.is(err, errors.NOT_FOUND) then
            return nil, failure("upload not found", errors.NOT_FOUND, "subject")
        end
        return nil, typed(err, errors.UNAVAILABLE, "infrastructure", "")
    end

    -- A retry is a new processing attempt under the current processing limits.
    local max_ms, limits_err = process_worker.max_execution_ms(upload.type_id)
    if not max_ms then return nil, typed(limits_err, errors.UNAVAILABLE, "infrastructure", "") end
    local marked, mark_err = upload_record_repo.mark_failed_for_retry(upload.uuid, max_ms)
    if mark_err then return nil, typed(mark_err, errors.UNAVAILABLE, "infrastructure", "") end
    if not marked then
        return nil, failure("only a failed upload can be retried", errors.CONFLICT, "subject")
    end
    upload.storage_state = "uploaded"
    upload.processing_intent_state = "pending"
    upload.processing_max_execution_ms = max_ms

    local _, submit_err = process_worker.enqueue_upload_job(upload, true)
    if submit_err then
        return nil, typed(submit_err, errors.UNAVAILABLE, "infrastructure", "Failed to submit upload processing job: ")
    end

    return upload
end

local function delete_upload(uuid, teardown_owner: string?)
    local upload, err = upload_query_repo.get(uuid)
    if err then
        if errors.is(err, errors.NOT_FOUND) then
            return nil, failure("upload not found", errors.NOT_FOUND, "subject")
        end
        return nil, typed(err, errors.UNAVAILABLE, "infrastructure", "")
    end
    if not upload then return nil, failure("upload lookup returned no result", errors.INTERNAL, "infrastructure", true) end
    if teardown_owner and upload.actor_id ~= teardown_owner then
        return nil, failure("upload is owned by another principal", errors.PERMISSION_DENIED, "subject")
    end

    local component_owner = upload_types.owned_component(upload.actor_id)
    if component_owner and not teardown_owner then
        return nil, failure("component-owned versions are reaped by their owner", errors.PERMISSION_DENIED, "subject")
    end
    if not component_owner then
        cancel_processing_job(upload)
        local stage_err = invoke_on_delete(upload, teardown_owner ~= nil)
        if stage_err then return nil, stage_err end
    end

    -- Release the original bytes plus this upload's artifacts/chunks first. A cleanup
    -- failure keeps the row as the durable retry target.
    local release_err = release_storage(upload)
    if release_err then
        return nil, release_err
    end

    -- Only a foreground deletion changes the projection of a live Uploads thread.
    -- Component and principal teardown erase their owner read model directly.
    if not teardown_owner then
        local emitted, emit_err = uploads_events.emit(tostring(upload.actor_id), upload_types.EVENT.DELETED,
            { upload_id = uuid }, uuid, upload.trace_context)
        if emit_err then return nil, typed(emit_err, errors.UNAVAILABLE, "infrastructure", "upload deletion event failed: ") end
        if emitted ~= true then
            return nil, failure("upload deletion event reported no result", errors.UNAVAILABLE, "infrastructure", true)
        end
    end

    return upload_record_repo.delete(uuid)
end

function upload_lib.delete_upload(uuid)
    return delete_upload(uuid)
end

function upload_lib.reap_component_file(component_id: string, version_id: string)
    return delete_upload(version_id, upload_types.component_owner_key(component_id))
end

-- Trusted component and principal lifecycle callers supply the stored owner.
function upload_lib.purge_owner(actor_id: string): any
    local deleted = 0
    while true do
        local rows, list_err = upload_query_repo.list_by_actor(actor_id, 100, 0)
        if list_err or type(rows) ~= "table" then
            local err = list_err and binding_errors.from(list_err, errors.UNAVAILABLE, "upload_list_failed", "list uploads")
                or binding_errors.new(errors.INTERNAL, "upload owner scan returned no rows result", "upload_list_failed", true)
            return { success = false, error = err, deleted = deleted }
        end
        if #rows == 0 then break end
        for _, row in ipairs(rows) do
            local upload_id = tostring(row.uuid)
            local result, delete_err = delete_upload(upload_id, actor_id)
            if errors.is(delete_err, errors.NOT_FOUND) then
                -- A delete stage can report NOT_FOUND while the upload still exists.
                local remaining, read_err = upload_query_repo.get(upload_id)
                if not remaining and errors.is(read_err, errors.NOT_FOUND) then
                    result, delete_err = { deleted = true }, nil
                end
            end
            if delete_err or not result then
                local err = delete_err and binding_errors.from(delete_err, errors.UNAVAILABLE, "upload_delete_failed")
                    or binding_errors.new(errors.INTERNAL, "upload deletion returned no result", "upload_delete_failed", true)
                return { success = false, error = err, deleted = deleted }
            end
            deleted = deleted + 1
        end
    end

    local read_rows, read_err = upload_read_model.delete_for_actor(actor_id)
    if read_err or read_rows == nil then
        local err = read_err and binding_errors.from(read_err, errors.UNAVAILABLE, "read_model_cleanup_failed")
            or binding_errors.new(errors.INTERNAL, "upload read-model owner cleanup returned no result",
                "read_model_cleanup_missing", true)
        return { success = false, error = err, deleted = deleted }
    end
    return { success = true, deleted = deleted, read_rows_deleted = read_rows }
end

return require("uploads_presigned").attach(upload_lib, {
    uuid = uuid, time = time, resources = resources,
    upload_record_repo = upload_record_repo,
    upload_query_repo = upload_query_repo,
    upload_types = upload_types, token_flow = token_flow, identity_meta_key = IDENTITY_META_KEY,
    execution_identity = execution_identity,
    determine_upload_type = determine_upload_type, freeze_current_identity = freeze_current_identity,
    process_worker = process_worker,
    processing_max_execution_ms = process_worker.max_execution_ms,
})
