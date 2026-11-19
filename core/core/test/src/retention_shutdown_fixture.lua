-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local process = require("process")
local sql = require("sql")
local notifier = require("notifier")

local changes = channel.new(1)
local cancel_sent = false
local M = {}
M.process = {pid = process.pid, events = process.events, event = process.event, registry = process.registry}

function M.process.listen(topic: string): any
    if topic == notifier.TOPIC then return changes end
    return process.listen(topic)
end

function M.process.unlisten(mailbox: any): ()
    if mailbox == changes then
        changes:close()
    else
        process.unlisten(mailbox)
    end
end

function M.recover(_db: sql.DB, _pid: string, _traversal: table?): table
    changes:send({kind = "events_appended"})
    return {}
end

function M.on_wakes(db: sql.DB, pid: string, _changes: table[], _traversal: table?): (table?, error?)
    if cancel_sent then
        return nil, errors.new({kind = errors.INTERNAL, message = "retention started another pass after cancellation"})
    end
    -- Model a new committed apply while the current pass is in progress.
    -- The wake must already be readable when the runtime queues CANCEL.
    changes:send({kind = "events_appended"})
    assert(process.cancel(pid))
    -- Yield through the same SQL boundary as a retention pass.
    assert(db:query("SELECT 1"))
    cancel_sent = true
    return {}, nil
end

return M
