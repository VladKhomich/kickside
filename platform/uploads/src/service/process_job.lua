local sql = require("sql")
local json = require("json")
local jobs_config = require("jobs_config")
local threads_writer = require("threads_writer")
local retention_notifier = require("retention_notifier")
local logger = require("logger")
local upload_record_repo = require("upload_record_repo")
local upload_query_repo = require("upload_query_repo")
local pipeline_lib = require("pipeline_lib")
local upload_types = require("types")
local jobs = require("jobs")
local job_types = require("job_types")
local processing_hooks = require("processing_hooks")
local trace_context = require("trace_context")

local log = logger:named("upload_job")

local function job_info(input: any): any
    return type(input) == "table" and type(input.job) == "table" and input.job or {}
end

local function is_final_attempt(job: any): boolean
    if type(job) ~= "table" or job.id == nil then return true end
    if job.is_final_attempt == true then return true end
    local attempt = tonumber(job.attempt_no) or 1
    local max_attempts = tonumber(job.max_attempts) or attempt
    return attempt >= max_attempts
end

-- A failure finalizes the upload (no retry) when it is explicitly non-retriable
-- (a permanent input failure such as "file too large") or when the retry budget is
-- exhausted. A retriable failure before the final attempt returns to the job for
-- backoff instead of terminating.
local function terminal_failure(job: any, retriable: any): boolean
    return retriable == false or is_final_attempt(job)
end

local function ensure_running(job: any): (boolean, string?)
    if type(job) ~= "table" or tostring(job.id or "") == "" or tostring(job.lease_token or "") == "" then
        return true, nil
    end
    local active, active_err = jobs.lease_valid(tostring(job.id), {
        token = job.lease_token, execution_seq = job.execution_seq,
    })
    if active_err then
        return false, tostring(active_err)
    end
    if active ~= true then
        return false, "job cancelled"
    end
    return true, nil
end

local function upload_event(version: string, upload: any, etype: string, body: any, trace_context: any?): table
    return {
        type = etype,
        body = body,
        trace_context = trace_context,
        external = {
            external_source = upload_types.EVENT_SOURCE,
            external_id = tostring(upload.uuid),
            external_version = version,
        },
    }
end

local function completed_event(version: string, upload: any, trace_context: any?): table
    return upload_event(version, upload, upload_types.EVENT.COMPLETED, {
        upload_id = upload.uuid,
        filename = type(upload.metadata) == "table" and upload.metadata.filename or nil,
        mime_type = upload.mime_type,
        size = upload.size,
        type_id = upload.type_id,
    }, trace_context)
end

local function failed_event(version: string, upload: any, error_text: string, trace_context: any?): table
    return upload_event(version, upload, upload_types.EVENT.FAILED, {
        upload_id = upload.uuid,
        filename = type(upload.metadata) == "table" and upload.metadata.filename or nil,
        mime_type = upload.mime_type,
        size = upload.size,
        type_id = upload.type_id,
        error = error_text,
    }, trace_context)
end

local function completion_output(upload: any): table
    return { success = true, upload_id = upload.uuid, owner_actor_id = upload.actor_id }
end

local function permanent(err: any): boolean
    return type(err) == "userdata" and not err:retryable()
end

-- Settle storage, callback jobs and the thread event in the same transaction.
local function settle(job: any, upload: any, outcome: table, source: string?): (boolean, any?)
    local success, error_text = outcome.success == true, outcome.error_text
    local job_id, thread_id = job.id and tostring(job.id), tostring(job.thread_id or "")
    -- Explicit Retry records a job ID, so only the initial attempt can be intentless.
    local version = job_id or "attempt:1"
    local prepared
    if success then
        local prepare_err
        prepared, prepare_err = processing_hooks.prepare(outcome.output)
        if prepare_err then return false, prepare_err end
    end
    local db, db_err = sql.get(jobs_config.db_id())
    if db_err or not db then return false, db_err end
    local raw_type, type_err = db:type()
    if type_err then db:release(); return false, type_err end
    local dbtype = tostring(raw_type)
    local tx, begin_err = db:begin()
    if begin_err or not tx then db:release(); return false, begin_err end
    local function abort(err: any): (boolean, any?)
        local _, rollback_err = tx:rollback()
        db:release()
        return false, rollback_err or err
    end
    local checkpoint, state_err = upload_record_repo.lock_settlement_tx(tx, upload, job_id, source == "checkpoint")
    if state_err or not checkpoint then return abort(state_err) end
    local published = false
    if checkpoint.storage_state ~= "uploaded" then
        local publication_err
        published, publication_err = upload_query_repo.checkpoint_published_tx(tx, upload.uuid)
        if publication_err then return abort(publication_err) end
        if published and source then return abort(nil) end
    end
    if not published then
        -- Earlier workers wrote terminal storage before scheduling callbacks and
        -- publishing the event. A terminal row cannot prove delivery history.
        local legacy = checkpoint.storage_state ~= "uploaded"
        local _, callback_err, unverified_callback =
            pipeline_lib.invoke_upload_token(upload, success, error_text, tx, dbtype, legacy)
        if callback_err then
            if not permanent(callback_err) then return abort(callback_err) end
            if success then
                -- Discard any success callbacks staged before the permanent refusal.
                local _, rollback_err = abort(nil)
                if rollback_err then return false, rollback_err end
                outcome.success, outcome.error_text = false, tostring(callback_err)
                return settle(job, upload, outcome, source)
            end
        end
        local event = success and completed_event(version, upload, upload.trace_context)
            or failed_event(version, upload, tostring(error_text), upload.trace_context)
        if callback_err then event.body.callback_error = tostring(callback_err) end
        if unverified_callback and not callback_err then
            event.body.callback_error = "Callback delivery could not be verified for this stored processing attempt."
        end
        local body_json, encode_err = json.encode(event.body)
        if encode_err then return abort(encode_err) end
        event.body, event.body_json = nil, body_json
        local completing = not source and job_id or nil
        local _, append_err = threads_writer.append_system_tx(tx, dbtype, thread_id, { event }, completing)
        if append_err then return abort(append_err) end
        local publish_err = upload_record_repo.publish_storage_tx(tx, upload.uuid, success and "completed" or "failed")
        if publish_err then return abort(publish_err) end
        if success then
            local recorded, hook_err = processing_hooks.completed(tx, dbtype, job, outcome.output, event.trace_context, prepared)
            if hook_err or recorded ~= true then
                return abort(hook_err or errors.new({message="Processing extension did not acknowledge completion",kind=errors.INTERNAL,retryable=true}))
            end
        end
    end
    if not source then
        local _, complete_err = jobs.complete_tx(tx, job_id, {
            token = job.lease_token, execution_seq = job.execution_seq,
        }, {})
        if complete_err then return abort(complete_err) end
    end
    local _, commit_err = tx:commit()
    db:release()
    if commit_err then return false, commit_err end
    if published then return true, nil end
    local _, notify_err = retention_notifier.notify({ kind = "events_appended", thread_id = thread_id })
    if notify_err then return false, notify_err end
    local _, nudge_err = jobs.nudge_workers()
    if nudge_err then return false, nudge_err end
    return true, nil
end

-- A processing job settles the upload it holds; one that no longer can reports why.
local function settle_from_job(job: any, upload: any, outcome: table): any?
    local settled, settle_err = settle(job, upload, outcome)
    if settle_err then return settle_err end
    if not settled then
        return errors.new({ message = "upload " .. tostring(upload.uuid) .. " is no longer processing",
            kind = errors.CONFLICT, retryable = false })
    end
    return nil
end

local function run(input: any): (any, any?)
    input = type(input) == "table" and input or {}
    local payload = type(input.payload) == "table" and input.payload or {}
    local job = job_info(input)
    local upload_id = tostring(type(payload) == "table" and payload.upload_id or "")
    if upload_id == "" then
        return nil, "missing upload_id"
    end

    local upload, err = upload_query_repo.get(upload_id)
    if err then
        if errors.is(err, errors.NOT_FOUND) then
            log:info("upload missing; treating job as cancelled", { upload_id = upload_id })
            return { skipped = true, cancelled = true, upload_id = upload_id }, nil
        end
        return nil, "upload lookup failed: " .. tostring(err)
    end

    local running, running_err = ensure_running(job)
    if not running then
        return { skipped = true, cancelled = true, upload_id = upload_id, reason = running_err }, nil
    end


    local cancel_ref = nil
    if tostring(job.id or "") ~= "" and tostring(job.lease_token or "") ~= "" then
        cancel_ref = {job_id = tostring(job.id), lease_token = tostring(job.lease_token), execution_seq = job.execution_seq}
    end
    local success, proc_err, processed_upload, retriable = true, nil, upload, nil
    -- A terminal storage checkpoint resumes publication without rerunning processing.
    if upload.storage_state == "failed" then
        success, proc_err, retriable = false, "upload processing failed", false
    elseif upload.storage_state ~= "completed" then
        success, proc_err, processed_upload, retriable = pipeline_lib.process_upload(upload, {
            final_attempt = is_final_attempt(job),
            should_continue = function(_phase)
                return ensure_running(job)
            end,
            -- Carry the job lease so heavy stages (OCR) can observe cancellation
            -- between their own internal batches, not only between pipeline stages.
            cancel_ref = cancel_ref,
        })
    end
    if not success then
        if tostring(proc_err or "") == "job cancelled" then
            return { skipped = true, cancelled = true, upload_id = upload_id }, nil
        end
        if terminal_failure(job, retriable) then
            local error_text = tostring(proc_err or "upload processing failed")
            -- The terminal storage mark is part of the job's write set: a job that
            -- cannot record its outcome returns to the queue instead of reporting
            -- a result the store does not reflect.
            local settle_err = settle_from_job(job, upload, { success = false, error_text = error_text })
            if settle_err then return nil, settle_err end
            local output = { upload_id = upload_id, job_error = error_text }
            if type(proc_err) == "userdata" then return output, proc_err end
            return output, nil
        end
        return nil, proc_err or "upload processing failed"
    end

    local final_upload: any = type(processed_upload) == "table" and processed_upload or upload
    local output = completion_output(final_upload)
    local outcome = { success = true, output = output }
    local settle_err = settle_from_job(job, final_upload, outcome)
    if settle_err then return nil, settle_err end
    if not outcome.success then return { upload_id = upload_id, job_error = outcome.error_text }, nil end
    return output, nil
end

local function settle_checkpoint(job: any, upload: any, decode_err: any?, source: string): (boolean, any?)
    if decode_err then
        upload.metadata, upload.trace_context = nil, nil
    else
        local _, trace_err = trace_context.normalize(upload.trace_context)
        if trace_err then upload.trace_context, decode_err = nil, trace_err end
    end
    local outcome = upload.storage_state == "completed" and not decode_err
            and { success = true, output = completion_output(upload) }
        or { success = false, error_text = tostring(decode_err or job.last_error or "upload processing failed") }
    return settle(job, upload, outcome, source)
end

local function recover(row: any): (boolean, any?)
    local upload, decode_err = upload_query_repo.parse_upload_row(row)
    return settle_checkpoint({
        id = row.processing_job_id, thread_id = upload_types.component_id_for_owner(row.actor_id),
        owner_kind = "user", owner_id = row.actor_id, payload = { upload_id = row.uuid },
    }, upload or row, decode_err, "checkpoint")
end

-- A dead processing job resumes stored completion or settles failure with its
-- last error. Redelivery and a newer processing intent leave the upload unchanged.
local function dead(input: any): (any, any?)
    local outcome = type(input) == "table" and type(input.payload) == "table" and input.payload or {}
    local job_id = tostring(outcome.job_id or "")
    if job_id == "" then
        return nil, errors.new({ message = "dead outcome requires job_id", kind = errors.INVALID, retryable = false })
    end
    local dead_job, read_err = jobs.get_job(job_id)
    if read_err then return nil, read_err end
    if not dead_job then return { skipped = true, reason = "job_absent", job_id = job_id }, nil end
    if dead_job.status ~= job_types.JOB_STATE.DEAD then
        return nil, errors.new({ message = "job " .. job_id .. " is not dead", kind = errors.INVALID, retryable = false })
    end
    local payload = dead_job.payload
    if type(payload) == "string" then
        local decode_err
        payload, decode_err = json.decode(payload)
        if decode_err then return nil, decode_err end
    end
    local upload, upload_err = upload_query_repo.find_by_processing_job(tostring(dead_job.owner_id), job_id, tostring(type(payload) == "table" and payload.upload_id or ""))
    if upload_err and (not upload or upload.storage_state == "uploaded") then return nil, upload_err end
    if not upload then return { skipped = true, reason = "upload_not_held", job_id = job_id }, nil end
    local settled, settle_err = settle_checkpoint(dead_job, upload, upload_err, "dead")
    if settle_err then return nil, settle_err end
    log:info("dead processing job settled", { upload_id = upload.uuid, job_id = job_id, settled = settled })
    return { upload_id = upload.uuid, job_id = job_id, settled = settled }, nil
end

-- proc:// entry point. The monitored process transports one status value, with
-- native failures serialized into error_native.
local function main(input: any): table
    local result, err = run(input)
    if err then
        local native = type(err) == "userdata" and err
            or (errors.new({message = tostring(err), kind = errors.INTERNAL}) :: error)
        return {ok = false, error_native = job_types.error_to_data(native :: error)}
    end
    return {ok = true, output = result}
end

return { run = run, main = main, dead = dead, recover = recover, terminal_failure = terminal_failure }
