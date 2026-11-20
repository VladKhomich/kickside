-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base = require("thread_ingest_base")
local status = require("thread_ingest_status")
local json = require("json")
local component = require("component")
local funcs = require("funcs")
local registry = require("registry")
local uploads = require("uploads")
local uuid = require("uuid")

local M = {}

local function conflict(message: string): error
    return errors.new({ kind = errors.CONFLICT, message = message, retryable = false })
end

local function latest(exec: any, kb_id: string, event_type: string, external_id: string, source: string?): (any?, any?)
    local result, err = exec:find_event_by_external({
        thread_id = kb_id,
        event_type = event_type,
        external_source = source or base.EXTERNAL_SOURCE,
        external_id = external_id,
        latest = true,
    })
    if err then return nil, err end
    return type(result) == "table" and result.event or nil, nil
end

local function request_id(parts: {string}): (string?, any?)
    local name, encode_err = json.encode(parts)
    if encode_err then return nil, encode_err end
    local digest = base.content_sha(name)
    if not digest then return nil, errors.new({ kind = errors.INTERNAL, message = "Could not hash the re-ingest key" }) end
    -- Deterministic UUIDv8 for Core's existing event-id deduplication.
    return table.concat({digest:sub(1, 8), digest:sub(9, 12), "8" .. digest:sub(14, 16),
        "8" .. digest:sub(18, 20), digest:sub(21, 32)}, "-"), nil
end

-- Compare the retained source against the latest ordinary upsert and delete.
-- Explicit re-ingests omit the delivery tuple from the Core envelope. They
-- retain the original document tuple in the payload and never redefine it.
local function prepare(exec: any, kb_id: string, event: any): (table?, any?)
    local thread, thread_err = status.find_primary_thread(exec, kb_id)
    if thread_err then return nil, thread_err end
    local head = type(thread) == "table" and tonumber(thread.event_count) or nil
    if head == nil then return nil, conflict("Re-ingest requires a retained source event") end

    local external = event.external
    -- Read deletes first. A concurrent prefix prune cannot remove a newer
    -- delete while leaving the earlier source visible to the subsequent read.
    local deleted, delete_err = base.latest_content_delete(exec, kb_id, external.external_id)
    if delete_err then return nil, delete_err end
    local upsert, upsert_err = latest(exec, kb_id, base.EVENT_CONTENT_UPSERTED, external.external_id)
    if upsert_err then return nil, upsert_err end
    if type(upsert) ~= "table" or tonumber(upsert.seq) == nil then
        return nil, conflict("No retained source event matches this upload")
    end
    if type(deleted) == "table" and tonumber(deleted.seq) and tonumber(deleted.seq) > tonumber(upsert.seq) then
        return nil, conflict("This document was removed from the knowledge base")
    end

    local previous, body_err = base.decode_object(upsert.body or upsert.body_json)
    if body_err then return nil, body_err end
    local body = base.shallow_copy(event.body)
    body.metadata.upload_publication_id = type(previous.metadata) == "table" and previous.metadata.upload_publication_id or nil
    local source = body.source_ref
    local old_source = previous.source_ref
    if upsert.external_version ~= external.external_version or type(old_source) ~= "table"
        or old_source.upload_id ~= source.upload_id or old_source.artifact_id ~= source.artifact_id
        or previous.content_type ~= body.content_type then
        return nil, conflict("The retained upload is no longer the current document source")
    end
    if previous.content_omitted == true then
        if type(body.content) ~= "string" or #body.content ~= previous.content_bytes
            or base.content_sha(body.content) ~= previous.content_sha256 then
            return nil, conflict("The retained artifact no longer matches the original document")
        end
        body.content = nil
        body.content_omitted = true
        body.content_bytes = previous.content_bytes
        body.content_sha256 = previous.content_sha256
    elseif previous.content ~= body.content or previous.has_text ~= body.has_text then
        return nil, conflict("The retained upload no longer matches the original document")
    end

    return { head = head, body = body }, nil
end

function M.append(exec: any, kb_id: string, event: any, key: string): (any?, any?)
    local id, id_err = request_id({"knowledge.upload.reingest", kb_id, event.body.actor_id, event.body.source_ref.upload_id, key})
    if id_err then return nil, id_err end
    local delivery = base.shallow_copy(event)
    delivery.id = id
    delivery.external = nil
    local append_err
    for _ = 1, 3 do
        local guard, guard_err = prepare(exec, kb_id, event)
        if guard_err then return nil, guard_err end
        delivery.body = guard.body
        local receipt
        receipt, append_err = base.call_threads(exec, "append_event", {
            thread_id = kb_id, event = delivery, expect = { head = guard.head },
        })
        if not errors.is(append_err, errors.CONFLICT) then return receipt, append_err end
        local details = (append_err :: error):details()
        if type(details) ~= "table" or details.reason ~= "head_mismatch" then return nil, append_err end
    end
    return nil, append_err
end

-- A failed destination publication is already accepted by the delivery ledger.
-- Requeue its retained event on the same thread and preserve its delivery and
-- artifact identity. Each failed indexing attempt admits at most one retry.
function M.retry_failed_source(kb_id: string, node_id: string, failed_event_id: string): (any?, any?)
    if type(kb_id) ~= "string" or not uuid.validate(kb_id)
        or type(node_id) ~= "string" or not uuid.validate(node_id)
        or type(failed_event_id) ~= "string" or not uuid.validate(failed_event_id) then
        return nil, errors.new({kind = errors.INVALID, message = "Knowledge base, document and failed event IDs are required"})
    end
    local access_err, kb = base.validate_kb_access(kb_id, component.ACCESS.WRITE)
    if access_err then return nil, access_err end
    local actor_id = base.current_actor_id()
    if not actor_id then return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "An uploader is required"}) end

    local binding, binding_err = registry.get(kb.impl_id)
    if binding_err then return nil, binding_err end
    local read_failure = binding and binding.meta and binding.meta.failed_source_retry
    if type(read_failure) ~= "string" or read_failure == "" then
        return nil, errors.new({kind = errors.INVALID, message = "This Knowledge engine does not support retrying failed sources"})
    end
    local exec, exec_err = base.current_executor()
    if not exec or exec_err then return nil, exec_err end
    local thread, thread_err = status.find_primary_thread(exec, kb_id)
    if thread_err then return nil, thread_err end
    local head = thread and tonumber(thread.event_count)
    if head == nil then return nil, conflict("The Knowledge thread is unavailable") end

    local proof, proof_err = funcs.call(read_failure, {
        kb_id = kb_id, node_id = node_id, failed_event_id = failed_event_id,
    })
    if proof_err then return nil, proof_err end
    if type(proof) ~= "table" or proof.failed_event_id ~= failed_event_id
        or type(proof.external_id) ~= "string" or proof.external_id == ""
        or type(proof.external_version) ~= "string" or proof.external_version:sub(1, 9) ~= "delivery:"
        or type(proof.publication_id) ~= "string" or not uuid.validate(proof.publication_id) then
        return nil, conflict("The failed document has changed")
    end
    local deleted, delete_err = base.latest_content_delete(exec, kb_id, proof.external_id)
    if delete_err then return nil, delete_err end
    local current, current_err = latest(exec, kb_id, base.EVENT_CONTENT_UPSERTED, proof.external_id)
    if current_err then return nil, current_err end
    local current_seq = current and tonumber(current.seq)
    if not current_seq or current.id ~= proof.publication_id or current.external_version ~= proof.external_version then
        return nil, conflict("The failed publication is no longer the retained source")
    end
    if deleted and tonumber(deleted.seq) > current_seq then
        return nil, conflict("This document was removed from the knowledge base")
    end
    local intent, intent_err = latest(exec, kb_id, base.EVENT_DELIVERY_CLAIMED, proof.external_id, base.UPLOAD_INTENT_SOURCE)
    if intent_err then return nil, intent_err end
    if intent and tonumber(intent.seq) > current_seq then
        return nil, conflict("A newer upload is already admitted for this document")
    end

    local body, body_err = base.decode_object(current.body or current.body_json)
    if body_err then return nil, body_err end
    local metadata = body.metadata
    local source = body.source_ref
    if type(metadata) ~= "table" or metadata.upload_publication_id ~= current.id
        or metadata.external_id ~= proof.external_id or metadata.external_version ~= proof.external_version
        or type(source) ~= "table" or type(source.upload_id) ~= "string"
        or not uuid.validate(source.upload_id) or type(source.artifact_id) ~= "string"
        or not uuid.validate(source.artifact_id) then
        return nil, conflict("The failed publication has no retained upload artifact")
    end
    -- The existing upload remains accessible under the original uploader's
    -- authority. A KB write grant alone cannot re-submit someone else's upload.
    if body.actor_id ~= actor_id then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "Retry requires the original uploader"})
    end
    local upload, upload_err = uploads.get_for_actor(actor_id, source.upload_id)
    if upload_err and upload_err ~= "Upload not found" then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true, message = "Could not check the retained upload"})
    end
    if not upload or upload.status ~= "completed" then
        return nil, conflict("The retained upload is unavailable for retry")
    end

    local id, id_err = request_id({"knowledge.upload.retry-failed", kb_id, failed_event_id})
    if id_err then return nil, id_err end
    local event = {id = id, type = base.EVENT_CONTENT_UPSERTED, role = "system", body = body}
    local appended, append_err = base.call_threads(exec, "append_event", {
        thread_id = kb_id, event = event, expect = {head = head},
    })
    if append_err then return nil, append_err end
    local receipt = appended and appended.events and appended.events[1]
    if not receipt or receipt.event_id ~= id then
        return nil, errors.new({kind = errors.INTERNAL, message = "Retry returned no durable event receipt"})
    end
    return {success = true, status = "queued", event_id = id, duplicate = appended.duplicates == 1}, nil
end

return M
