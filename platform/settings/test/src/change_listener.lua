-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness subscriber: joins this node's settings change subscribers and forwards
-- each revision it hears to the test process that spawned it.

local process = require("process")
local channel = require("channel")
local changes = require("settings_changes")

local function main(parent: string, hold_first: boolean?): (any?, any?)
    local inbox, err = changes.subscribe()
    if err or not inbox then return nil, err end
    local resume = process.listen("listener.resume")
    process.send(parent, "listener.ready", true)
    local lifecycle = process.events()
    while true do
        local result = channel.select({ inbox:case_receive(), lifecycle:case_receive() })
        if not result.ok then return nil, "listener channel closed" end
        if result.channel == lifecycle then
            if result.value and result.value.kind == process.event.CANCEL then return true, nil end
        else
            if hold_first then
                -- Hold a real keeper announcement across the setup boundary.
                process.send(parent, "listener.pending", result.value.revision)
                local resumed = resume:receive()
                assert(resumed, "listener resumes after setup commits")
                hold_first = false
            end
            process.send(parent, "listener.revision", result.value.revision)
        end
    end
end

return { main = main }
