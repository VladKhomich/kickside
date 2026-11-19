-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base = require("thread_ingest_base")
local status = require("thread_ingest_status")
local thread_ingest = require("thread_ingest")
local embed_sink = require("embed_sink")
local ingest_upload = require("ingest_upload")
local uploads = require("upload_read_model")
local writable = require("writable_sink")
local security = require("security")
local uuid = require("uuid")

local M = {}
local trim, fail = writable.trim, writable.fail

local function refuse(err: any): any
    if errors.is(err, errors.CONFLICT) then
        local details = err:details()
        if type(details) == "table" and details.reason == "head_mismatch" then
            return fail(tostring(err), "conflict", true)
        end
        return fail(tostring(err), "idempotency_conflict")
    end
    if errors.is(err, errors.PERMISSION_DENIED) then return fail(tostring(err), "permission_denied") end
    if errors.is(err, errors.NOT_FOUND) then return fail(tostring(err), "not_found") end
    if errors.is(err, errors.INVALID) then return fail(tostring(err)) end
    return fail(tostring(err or "Knowledge upload delivery returned no committed result"),
        "provider_unavailable", true)
end

local function find(exec: any, kb_id: string, event_type: string, external_id: string,
        version: string?): (any?, any?)
    local found, err = exec:find_event_by_external({
        thread_id = kb_id, event_type = event_type, external_source = base.EXTERNAL_SOURCE,
        external_id = external_id, external_version = version, latest = version == nil and true or nil,
    })
    if err then return nil, err end
    return found and found.event, nil
end

local function conflict(message: string): error
    return errors.new({kind = errors.CONFLICT, retryable = false, message = message})
end

local function prior_delivery(exec: any, kb_id: string, delivery: any, upload_id: string): (boolean?, any?)
    local event, err = find(exec, kb_id, base.EVENT_CONTENT_UPSERTED,
        delivery.external_id, delivery.external_version)
    if err then return nil, err end
    if not event then return false, nil end
    local body, body_err = base.decode_object(event.body or event.body_json)
    if body_err then return nil, body_err end
    if type(body.source_ref) ~= "table" or body.source_ref.upload_id ~= upload_id
        or trim(body.source_ref.artifact_id) == "" then
        return nil, conflict("Committed delivery does not name this upload artifact")
    end
    return true, nil
end

-- An Uploads worker never publishes this item's Knowledge event. The sink checks
-- the retained claim and publishes it only while the document is still eligible.
local function publication(exec: any, kb_id: string, delivery: any, upload_id: string,
        claim_seq: integer): (any?, any?)
    local thread, thread_err = status.find_primary_thread(exec, kb_id)
    if thread_err then return nil, thread_err end
    local head = thread and math.tointeger(thread.event_count) or nil
    if not head then return nil, conflict("Upload delivery has no retained Knowledge thread") end
    local deleted, delete_err = find(exec, kb_id, base.EVENT_CONTENT_DELETED, delivery.external_id, nil)
    if delete_err then return nil, delete_err end
    local upsert, upsert_err = find(exec, kb_id, base.EVENT_CONTENT_UPSERTED, delivery.external_id, nil)
    if upsert_err then return nil, upsert_err end
    if (deleted and tonumber(deleted.seq) > claim_seq)
        or (upsert and tonumber(upsert.seq) > claim_seq and upsert.external_version ~= delivery.external_version) then
        return nil, conflict("Upload delivery was superseded by a newer Knowledge document change")
    end
    local found, receipt_err = prior_delivery(exec, kb_id, delivery, upload_id)
    if receipt_err then return nil, receipt_err end
    return {head = head, committed = found == true}, nil
end

function M.write(request: any): any
    local req = type(request) == "table" and request or {}
    local origin, origin_err = writable.origin(req)
    if origin_err then return origin_err end
    local kb_id = trim(type(req.config) == "table" and req.config.kb_id)
    local external_id = trim(req.identity_key)
    local key = trim(req.idempotency_key)
    if kb_id == "" then return fail("sink config.kb_id is required", "invalid_config", false, "flow") end
    if external_id == "" or key == "" then return fail("upload delivery requires identity_key and idempotency_key") end
    if req.sink_op == "delete" then return embed_sink.write(req) end
    if req.sink_op ~= "upsert" then return fail("unsupported Knowledge upload operation") end

    local upload_id = trim(type(req.input) == "table" and req.input.upload_id)
    if not uuid.validate(upload_id) then return fail("write input.upload_id is required") end
    local source_version = trim(req.input.source_version)
    if #source_version > 128 then return fail("write input.source_version exceeds 128 bytes") end
    local actor = security.actor()
    if not actor or trim(actor:id()) == "" then return fail("Authentication required", "permission_denied") end
    local record, upload_err = uploads.get_for_actor(actor:id(), upload_id)
    if upload_err == "Upload not found" or (not record and not upload_err) then
        return fail("Upload not found", "not_found")
    end
    if upload_err then return fail(tostring(upload_err), "provider_unavailable", true) end
    if record.status ~= "processing" and record.status ~= "completed" then
        return fail(record.error or ("Upload cannot be delivered in state " .. tostring(record.status)))
    end

    local _, claim_err, claim = thread_ingest.claim_delivery(kb_id, key, "", {
        operation = "upload", origin = origin, external_id = external_id, upload_id = upload_id,
        source_version = source_version,
    }, req.resume_effect == true)
    if claim_err then return refuse(claim_err) end
    local claim_seq = claim and math.tointeger(claim.seq) or nil
    if not claim_seq then return refuse("Upload delivery has no durable claim") end

    local delivery = { external_id = external_id, external_version = "delivery:" .. key, source_version = source_version }
    local exec, exec_err = base.current_executor()
    if not exec then return refuse(exec_err) end
    local guard, guard_err = publication(exec, kb_id, delivery, upload_id, claim_seq)
    if guard_err or not guard then return refuse(guard_err) end

    if not guard.committed then
        if record.status == "processing" then
            local pending = fail("Upload processing is in progress", "effect_pending", true)
            pending.error.retry_after_ms = 1000
            return pending
        end
        delivery.expected_head = guard.head
        local _, ingest_err = ingest_upload.ingest_delivery(kb_id, record, delivery)
        if ingest_err then return refuse(ingest_err) end
        local committed, receipt_err = prior_delivery(exec, kb_id, delivery, upload_id)
        if receipt_err or not committed then return refuse(receipt_err) end
    end

    local ref = { kb_id = kb_id, external_id = external_id }
    local slot = trim(req.map_slot)
    local version = delivery.external_version
    return {
        success = true, result = guard.committed and "noop" or "created",
        dest_ref = ref, dest_version = version,
        dest_refs = { [slot ~= "" and slot or "default"] = {dest_ref = ref, dest_version = version} },
    }
end

return M
