-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply = require("apply")
local job_types = require("job_types")
local security = require("security")

return {run = function(input)
    local assignment = input.checkpoint
    local cursor = assignment.cursor
    local position = tonumber(input.events[1].seq)
    local actor = assert(security.actor()):id()
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
    return {checkpointed = true}
end}
