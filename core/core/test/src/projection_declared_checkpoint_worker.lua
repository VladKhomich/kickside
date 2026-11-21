-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply = require("apply")
local job_types = require("job_types")
local security = require("security")
local sql = require("sql")

local function change_generation(component_id: string)
    local db = assert(sql.get("app:db"))
    local changed, err = db:execute([[UPDATE kickside_components SET identity_generation=identity_generation+1
        WHERE component_id=$1]], {component_id})
    assert(select(2, db:release()) == nil)
    assert(changed and changed.rows_affected == 1, tostring(err))
end

return {run = function(input)
    local assignment = input.checkpoint
    local cursor = assignment.cursor
    local event = input.events[1]
    local position = tonumber(event.seq)
    local actor = assert(security.actor()):id()
    if event.body.change_owner == "after_partial" then
        local partial, err = apply.checkpoint("app:db", assignment.job, cursor, assignment.prefetched_last,
            {last_seq = cursor.last_seq, continuation = {event_id = event.id, item = 1, step = 1}},
            function() return true, nil end)
        if not partial then return {ok = false, error_native = job_types.error_to_data(err)} end
        cursor.continuation = partial.continuation
    end
    if event.body.change_owner == "before_verdict" then
        change_generation(cursor.thread_id)
        local err = errors.new({kind = errors.INVALID, message = "invalid input under the previous owner"})
        return {ok = false, error_native = job_types.error_to_data(err)}
    end
    if event.body.change_owner == "before_write" or event.body.change_owner == "after_partial" then
        change_generation(cursor.thread_id)
    end
    local receipt, err = apply.checkpoint("app:db", assignment.job, cursor, assignment.prefetched_last,
        {last_seq = position, append_events = {{thread_id = cursor.thread_id, events = {{
            type = "kickside.test.threads:changed", role = "system", body = {actor_id = actor},
        }}}}}, function(tx)
            local changed, write_err = tx:execute([[INSERT INTO declared_checkpoint_effect(thread_id,actor_id)
                VALUES ($1,$2)]], {cursor.thread_id, actor})
            if write_err then return nil, write_err end
            return changed.rows_affected == 1, nil
        end)
    if not receipt then return {ok = false, error_native = job_types.error_to_data(err)} end
    if event.body.change_owner == "before_settlement" then
        change_generation(cursor.thread_id)
    end
    return {checkpointed = true}
end}
