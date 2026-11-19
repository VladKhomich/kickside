-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base = require("thread_ingest_base")
local status = require("thread_ingest_status")
local thread_ingest = require("thread_ingest")
local ingest_upload = require("ingest_upload")
local uploads = require("upload_read_model")
local attachments = require("attachment_ingest")
local writable = require("writable_sink")
local component = require("component")
local funcs = require("funcs")
local registry = require("registry")
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
    if errors.is(err, errors.RATE_LIMITED) then
        local details = err:details()
        return fail(tostring(err), "rate_limited", true,
            type(details) == "table" and details.scope or "provider", details)
    end
    return fail(tostring(err or "Knowledge upload delivery returned no committed result"),
        "provider_unavailable", true)
end

local function find(exec: any, kb_id: string, event_type: string, external_id: string,
        version: string?, source: string?): (any?, any?)
    local found, err = exec:find_event_by_external({
        thread_id = kb_id, event_type = event_type, external_source = source or base.EXTERNAL_SOURCE,
        external_id = external_id, external_version = version, latest = version == nil and true or nil,
    })
    if err then return nil, err end
    return found and found.event, nil
end

local function conflict(message: string): error
    return errors.new({kind = errors.CONFLICT, retryable = false, message = message})
end

local function retired(message: string): error
    return errors.new({kind = errors.NOT_FOUND, retryable = false, message = message})
end

local function publication_matcher(kb_id: string): (string?, any?)
    local access_err, kb = base.validate_kb_access(kb_id, component.ACCESS.WRITE)
    if access_err then return nil, refuse(access_err) end
    local binding, binding_err = registry.get(kb.impl_id)
    if binding_err then return nil, refuse(binding_err) end
    local meta = binding and binding.meta
    local target = type(meta) == "table" and trim(meta.upload_publication_match) or ""
    if target == "" then
        return nil, fail("Upgrade the destination Knowledge engine to support versioned upload removal.",
            "invalid_config", false, "flow")
    end
    return target, nil
end

local function prior_delivery(exec: any, kb_id: string, delivery: any, upload_id: string): (any?, any?)
    local event, err = find(exec, kb_id, base.EVENT_CONTENT_UPSERTED,
        delivery.external_id, delivery.external_version)
    if err then return nil, err end
    if not event then return nil, nil end
    local body, body_err = base.decode_object(event.body or event.body_json)
    if body_err then return nil, body_err end
    if type(body.source_ref) ~= "table" or body.source_ref.upload_id ~= upload_id
        or trim(body.source_ref.artifact_id) == "" or type(event.id) ~= "string" or not uuid.validate(event.id)
        or type(body.metadata) ~= "table" or body.metadata.upload_publication_id ~= event.id then
        return nil, conflict("Committed delivery does not name this upload artifact")
    end
    return event, nil
end

-- An Uploads worker never publishes this item's Knowledge event. The sink checks
-- the retained claim and publishes it only while the document is still eligible.
local function publication(exec: any, kb_id: string, delivery: any, upload_id: string,
        claim_seq: integer): (any?, any?)
    local thread, thread_err = status.find_primary_thread(exec, kb_id)
    if thread_err then return nil, thread_err end
    local head = thread and math.tointeger(thread.event_count) or nil
    if not head then return nil, retired("Upload delivery has no retained Knowledge thread") end
    local deleted, delete_err = base.latest_content_delete(exec, kb_id, delivery.external_id)
    if delete_err then return nil, delete_err end
    local upsert, upsert_err = find(exec, kb_id, base.EVENT_CONTENT_UPSERTED, delivery.external_id, nil)
    if upsert_err then return nil, upsert_err end
    if (deleted and tonumber(deleted.seq) > claim_seq)
        or (upsert and tonumber(upsert.seq) > claim_seq and upsert.external_version ~= delivery.external_version) then
        return nil, retired("Upload delivery was superseded by a newer Knowledge document change")
    end
    local found, receipt_err = prior_delivery(exec, kb_id, delivery, upload_id)
    if receipt_err then return nil, receipt_err end
    if found and (not upsert or upsert.external_version ~= delivery.external_version
        or (deleted and tonumber(deleted.seq) > tonumber(upsert.seq))) then
        return nil, retired("Upload delivery is no longer the current Knowledge content")
    end
    local desired, desired_err = thread_ingest.latest_upload_intent(exec, kb_id, delivery.external_id)
    if desired_err then return nil, desired_err end
    if not desired or desired.external_version ~= delivery.key then
        return nil, retired("Upload delivery is no longer the latest admitted file for this Knowledge document")
    end
    -- Prefix pruning does not move the head. A retained original claim after
    -- the reads above proves that pruning could not have hidden a later delete.
    local claim, claim_err = find(exec, kb_id, base.EVENT_DELIVERY_CLAIMED, "delivery:" .. delivery.key, "1")
    if claim_err then return nil, claim_err end
    if not claim or tonumber(claim.seq) ~= claim_seq then
        return nil, retired("Upload delivery claim is no longer retained")
    end
    return {head = head, committed = found}, nil
end

local function receipt(req: any, kb_id: string, external_id: string, version: string,
        result: string, publication_id: string?): any
    local ref = { kb_id = kb_id, external_id = external_id, publication_id = publication_id }
    local slot = trim(req.map_slot)
    return { success = true, result = result, dest_ref = ref, dest_version = version,
        dest_refs = { [slot ~= "" and slot or "default"] = {dest_ref = ref, dest_version = version} } }
end

local function delete_document(req: any, kb_id: string, external_id: string, key: string): any
    local previous = trim(req.dest_version)
    local ref = req.dest_ref
    local expected = type(ref) == "table" and trim(ref.publication_id) or ""
    if previous == "" or not uuid.validate(expected) or ref.kb_id ~= kb_id or ref.external_id ~= external_id then
        return fail("Upload deletion requires its current Knowledge destination receipt")
    end
    local matcher, engine_failure = publication_matcher(kb_id)
    if not matcher then return engine_failure end
    local _, claim_err = thread_ingest.claim_delivery(kb_id, key, "", {
        operation = "upload.delete", external_id = external_id, publication_id = expected, dest_version = previous,
    })
    if claim_err then return refuse(claim_err) end
    local exec, exec_err = base.current_executor()
    if not exec then return refuse(exec_err) end
    local thread, thread_err = status.find_primary_thread(exec, kb_id)
    if thread_err then return refuse(thread_err) end
    local head = thread and math.tointeger(thread.event_count) or nil
    if not head then return refuse(retired("Upload deletion has no retained Knowledge thread")) end
    local version = "delete:" .. key
    local deleted, delete_err = find(exec, kb_id, base.EVENT_CONTENT_DELETED, external_id, version, base.UPLOAD_DELETE_SOURCE)
    if delete_err then return refuse(delete_err) end
    if deleted then return receipt(req, kb_id, external_id, version, "deleted") end
    local latest, latest_err = find(exec, kb_id, base.EVENT_CONTENT_UPSERTED, external_id, nil)
    if latest_err then return refuse(latest_err) end
    local current = latest and latest.external_version == previous and latest.id == expected
    if not latest then
        local observed, observe_err = funcs.call(matcher, {kb_id = kb_id, external_id = external_id, publication_id = expected})
        if observe_err then return refuse(observe_err) end
        if type(observed) ~= "table" or type(observed.current) ~= "boolean" then
            return refuse("Knowledge engine did not identify the current publication")
        end
        current = observed.current
    end
    if not current then
        return receipt(req, kb_id, external_id, version, "deleted")
    end
    -- The materializer checks the immutable publication again under its store
    -- lock. Reading it here only avoids appending already obsolete deletes.
    local appended, append_err = thread_ingest.delete_content(kb_id, {
        external_id = external_id, external_version = version, trace_context = req.trace_context,
    }, head, expected)
    if append_err or not appended then return refuse(append_err) end
    return receipt(req, kb_id, external_id, version, "deleted")
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
    if req.sink_op == "delete" then return delete_document(req, kb_id, external_id, key) end
    if req.sink_op ~= "upsert" then return fail("unsupported Knowledge upload operation") end

    local input = type(req.input) == "table" and req.input or {}
    local upload_id = trim(input.upload_id)
    local source_version = trim(input.source_version)
    if #source_version > 128 then return fail("write input.source_version exceeds 128 bytes") end
    local attachment = input.attachment
    local matcher
    if attachment ~= nil then
        if upload_id ~= "" then return fail("Supply either an upload ID or an attachment") end
        if source_version == "" then return fail("An attachment requires its source version") end
        if type(req.resume_effect) ~= "boolean" then
            return fail("Upgrade Automation to resume pending attachment effects.", "invalid_config", false, "flow")
        end
        if req.resume_effect then
            local access_err = base.validate_kb_access(kb_id, component.ACCESS.WRITE)
            if access_err then return refuse(access_err) end
        else
            local failure
            matcher, failure = publication_matcher(kb_id)
            if not matcher then return failure end
        end
        local admitted, admit_err = attachments.admit(attachment, key, req.resume_effect == true)
        if admit_err or not admitted then return refuse(admit_err) end
        upload_id = admitted.uuid
    end
    if not uuid.validate(upload_id) then return fail("write input.upload_id is required") end
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
    if record.status == "processing" and type(req.resume_effect) ~= "boolean" then
        return fail("This upload is still processing. Upgrade Automation to resume pending effects.",
            "invalid_config", false, "flow")
    end
    if not matcher and (req.resume_effect ~= true or record.status == "completed") then
        local matcher, failure = publication_matcher(kb_id)
        if not matcher then return failure end
    end

    local _, claim_err, claim = thread_ingest.claim_delivery(kb_id, key, "", {
        operation = "upload", origin = origin, external_id = external_id, upload_id = upload_id,
        source_version = source_version,
    }, req.resume_effect == true, external_id)
    if claim_err then return refuse(claim_err) end
    local claim_seq = claim and math.tointeger(claim.seq) or nil
    if not claim_seq then return refuse("Upload delivery has no durable claim") end
    if record.status == "processing" then
        return fail("Upload processing is in progress", "effect_pending", true)
    end

    local delivery = { key = key, external_id = external_id, external_version = "delivery:" .. key, source_version = source_version }
    local exec, exec_err = base.current_executor()
    if not exec then return refuse(exec_err) end
    local guard, guard_err = publication(exec, kb_id, delivery, upload_id, claim_seq)
    if guard_err or not guard then return refuse(guard_err) end

    local committed = guard.committed
    if not committed then
        if attachment then
            local verify_err = attachments.verify(attachment)
            if verify_err then return refuse(verify_err) end
        end
        delivery.expected_head = guard.head
        local _, ingest_err = ingest_upload.ingest_delivery(kb_id, record, delivery)
        if ingest_err then return refuse(ingest_err) end
        local receipt_err
        committed, receipt_err = prior_delivery(exec, kb_id, delivery, upload_id)
        if receipt_err or not committed then return refuse(receipt_err) end
    end

    return receipt(req, kb_id, external_id, delivery.external_version,
        guard.committed and "noop" or "created", committed.id)
end

return M
