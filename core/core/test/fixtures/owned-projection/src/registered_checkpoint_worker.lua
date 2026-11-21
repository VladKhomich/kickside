-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply = require("apply")
local job_types = require("job_types")
local process = require("process")
local security = require("security")
local sql = require("sql")
local time = require("time")

local CHANGED = "kickside.test.threads:changed"
local TRIGGER = "kickside.test.threads:trigger"

local function failure(err)
    return {ok = false, error_native = job_types.error_to_data(err)}
end

local function retry(message)
    return errors.new({kind = errors.UNAVAILABLE, retryable = true, message = message})
end

local function ordinary(input)
    assert(input.checkpoint == nil)
    return {patch = {ordinary_calls = (input.projection.body.ordinary_calls or 0) + 1}}
end

local function mode(thread_id)
    local db = assert(sql.get("app:db"))
    local state = assert(db:query("SELECT mode FROM registered_checkpoint_gate WHERE thread_id=$1", {thread_id}))[1]
    assert(select(2, db:release()) == nil)
    return state and state.mode
end

local function write(input)
    local assignment = assert(input.checkpoint)
    assert(assignment.registered == true)
    local cursor = assignment.cursor
    assert(cursor.body == nil and cursor.raw_body == nil)
    cursor.body = input.projection.body
    local config = cursor.body.worker_config
    local actor = assert(assert(security.actor()):id())
    assert(actor == cursor.actor_id and actor == config.test_actor)
    local db = assert(sql.get("app:db"))
    assert(db:execute("UPDATE registered_checkpoint_gate SET calls=calls+1,pid=$1 WHERE thread_id=$2",
        {tostring(process.pid()), input.thread_id}))
    local state = assert(db:query("SELECT mode FROM registered_checkpoint_gate WHERE thread_id=$1", {input.thread_id}))[1]
    if state.mode == "revoke" then
        assert(db:execute("DELETE FROM kickside_component_access WHERE component_id=$1 AND subject_id=$2",
            {config.destinations[2], actor}))
    elseif state.mode == "change_range" then
        local removed = assert(db:execute("DELETE FROM kickside_event WHERE thread_id=$1 AND seq=3", {input.thread_id}))
        assert(removed.rows_affected == 1)
    elseif state.mode == "change_target" then
        local updated = assert(db:execute([[UPDATE kickside_components SET identity_generation=identity_generation+1
            WHERE component_id=$1]], {config.destinations[2]}))
        assert(updated.rows_affected == 1)
    elseif state.mode == "rebind_source" then
        local updated = assert(db:execute("UPDATE kickside_thread SET component_id=$1 WHERE id=$2",
            {config.destinations[1], input.thread_id}))
        assert(updated.rows_affected == 1)
    end
    assert(select(2, db:release()) == nil)
    if state.mode == "hold" then
        local deadline = time.now():add("20s")
        repeat
            time.sleep("10ms")
        until mode(input.thread_id) ~= "hold" or time.now():after(deadline)
    end
    local manifest = {}
    for _, event in ipairs(input.events) do
        assert(event.type == TRIGGER)
        manifest[#manifest + 1] = {id = event.id, seq = event.seq}
    end
    local output = {
        last_seq = input.range.to_seq,
        patch = {publications = (cursor.body.publications or 0) + 1, offered = #manifest},
        append_events = {{thread_id = config.output_thread, events = {{type = CHANGED, body = {count = #manifest}}}}},
    }
    if #manifest > 1 then
        local called = false
        local function unexpected_write()
            called = true
            return true, nil
        end
        local incomplete, rejected = apply.checkpoint("app:db", assignment.job, cursor, assignment.prefetched_last,
            output, unexpected_write, {manifest[1]})
        assert(not incomplete and rejected and not called, tostring(rejected))
        assert(tostring(rejected):find("does not match the input assignment", 1, true) ~= nil)
        local original = config.destinations[2]
        config.destinations[2] = config.destinations[1]
        local changed, denied = apply.checkpoint("app:db", assignment.job, cursor, assignment.prefetched_last,
            output, unexpected_write, manifest)
        config.destinations[2] = original
        assert(not changed and denied and not called, tostring(denied))
        assert(tostring(denied):find("does not match its assigned projection", 1, true) ~= nil)
    end
    local result, err = apply.checkpoint("app:db", assignment.job, cursor, assignment.prefetched_last, output,
        function(tx, dbtype)
            if state.mode == "probe_grant_lock" and dbtype == sql.type.POSTGRES then
                local observer = assert(sql.get("app:db"))
                local _, conflict = observer:query([[SELECT access_id FROM kickside_component_access
                    WHERE component_id=$1 AND subject_type='user' AND subject_id=$2 FOR UPDATE NOWAIT]],
                    {config.destinations[2], actor})
                assert(select(2, observer:release()) == nil)
                assert(conflict and tostring(conflict):find("55P03", 1, true) ~= nil, tostring(conflict))
            end
            for _, event in ipairs(manifest) do
                for _, destination in ipairs(config.destinations) do
                    local _, write_err = tx:execute([[INSERT INTO registered_checkpoint_effect
                        (thread_id,event_id,destination,actor_id) VALUES ($1,$2,$3,$4)]],
                        {input.thread_id, event.id, destination, actor})
                    if write_err then return nil, write_err end
                    if state.mode == "before_commit" then return nil, retry("fixture writer stopped before commit") end
                end
            end
            return true, nil
        end, manifest)
    if not result then return failure(err) end
    if state.mode == "lost_return" then
        time.sleep("45s")
        return failure(retry("fixture writer was not terminated after committing"))
    end
    return {checkpointed = true}
end

return {ordinary = ordinary, write = write}
