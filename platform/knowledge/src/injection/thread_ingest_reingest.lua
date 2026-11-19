-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base = require("thread_ingest_base")
local status = require("thread_ingest_status")
local json = require("json")

local M = {}

local function conflict(message: string): error
    return errors.new({ kind = errors.CONFLICT, message = message, retryable = false })
end

local function latest(exec: any, kb_id: string, event_type: string, external_id: string): (any?, any?)
    local result, err = exec:find_event_by_external({
        thread_id = kb_id,
        event_type = event_type,
        external_source = base.EXTERNAL_SOURCE,
        external_id = external_id,
        latest = true,
    })
    if err then return nil, err end
    return type(result) == "table" and result.event or nil, nil
end

local function request_id(kb_id: string, actor_id: string, upload_id: string, key: string): (string?, any?)
    local name, encode_err = json.encode({"knowledge.upload.reingest", kb_id, actor_id, upload_id, key})
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
    local deleted, delete_err = latest(exec, kb_id, base.EVENT_CONTENT_DELETED, external.external_id)
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
    local id, id_err = request_id(kb_id, event.body.actor_id, event.body.source_ref.upload_id, key)
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

return M
