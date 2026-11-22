-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply = require("apply")
local job_types = require("job_types")
local sql = require("sql")
local threads = require("threads")

local function refused(kind, message)
    return {ok = false, error_native = job_types.error_to_data(errors.new({
        kind = kind, retryable = kind == errors.UNAVAILABLE, message = message,
    }))}
end

return {run = function(input)
    local assignment = input.checkpoint
    if not assignment then return refused(errors.INVALID, "checkpoint assignment is missing") end
    local cursor = assignment.cursor
    for _, event in ipairs(input.events) do
        local seq = tonumber(event.seq)
        local ordinal = tonumber(event.body.ordinal)
        if ordinal == 2 then
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT available FROM checkpoint_scheduler_gate WHERE thread_id=$1",
                {cursor.thread_id}))
            db:release()
            if tonumber(rows[1].available) ~= 1 then
                return refused(errors.UNAVAILABLE, "fixture provider is unavailable")
            end
        end
        local output = {last_seq = seq}
        if ordinal == 3 then
            local partial, partial_err = apply.continuation(cursor)
            if partial_err then return {ok = false, error_native = job_types.error_to_data(partial_err)} end
            local step = partial and partial.step + 1 or 1
            ordinal = 30 + step
            if step < 3 then
                output.last_seq = tonumber(cursor.last_seq)
                output.continuation = {event_id = event.id, item = 1, step = step}
            end
        end
        local receipt, err = apply.checkpoint("app:db", assignment.job, cursor, assignment.prefetched_last,
            output, function(tx)
                local effect, write_err = tx:execute(
                    "INSERT INTO checkpoint_scheduler_effect (thread_id,ordinal,attempt_no) VALUES ($1,$2,$3)",
                    {cursor.thread_id, ordinal, assignment.job.attempt_no})
                if write_err then return nil, write_err end
                return effect.rows_affected == 1
            end)
        if not receipt then return {ok = false, error_native = job_types.error_to_data(err)} end
        cursor.last_seq = receipt.last_seq
        cursor.continuation = receipt.continuation
        if output.continuation then
            if output.continuation.step == 1 then
                local db = assert(sql.get("app:db"))
                local _, append_err = threads.append_system(db, cursor.thread_id, {{type = "fixture.checkpoint",
                    role = "system", seq = 1750, body_json = '{"ordinal":4}'}})
                db:release()
                if append_err then return {ok = false, error_native = job_types.error_to_data(append_err)} end
            end
            return {checkpointed = true}
        end
    end
    return {checkpointed = true}
end}
