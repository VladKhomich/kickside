local writer = require("writer")
local waiters = require("waiters")
local process = require("process")
local M = setmetatable({}, {__index = writer})

function M.wake_catch_up(db: any, thread_id: string, selected: table, authorize: table): (any?, error?)
    local rows, read_err = db:query("SELECT event_count FROM kickside_thread WHERE id=$1", {thread_id})
    if read_err then return nil, read_err end
    if #rows ~= 1 then return nil, errors.new({ kind = errors.INTERNAL, message = "catch-up cursor missing" }) end
    local event_count = math.tointeger(rows[1].event_count)
    if event_count == nil then
        return nil, errors.new({ kind = errors.INTERNAL, message = "catch-up event count missing or invalid" })
    end
    local waiter, wait_err = waiters.begin_wait(tostring(selected.id), event_count, 5000)
    if wait_err then return nil, wait_err end
    local result, wake_err = writer.wake_catch_up(db, thread_id, selected, authorize)
    if wake_err then waiters.close_wait(waiter); return nil, wake_err end
    local pid, spawn_err = process.spawn_monitored("kickside.core.jobs.service:worker", "app:processes")
    if spawn_err then waiters.close_wait(waiter); return nil, spawn_err end
    local sent, send_err = process.send("app:projection_catchup_test", "projection.test.worker", { pid = tostring(pid) })
    if send_err or sent ~= true then waiters.close_wait(waiter); return nil, send_err end
    local _, timed_out, progress_err = waiters.wait_until_reached(waiter)
    waiters.close_wait(waiter)
    if progress_err then return nil, progress_err end
    if timed_out then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "catch-up test worker did not commit" }) end
    return result, nil
end

return M
