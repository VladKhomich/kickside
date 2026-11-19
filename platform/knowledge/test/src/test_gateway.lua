-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
local system = require("system")
local time = require("time")

local function url()
    local updates = assert(events.subscribe("supervisor", "service.update"))
    local inbox = updates:channel()
    local deadline = time.after("5s")
    local ok, result = pcall(function()
        while true do
            local gateway = assert(system.supervisor.state("app:gateway"))
            local port = gateway.details and gateway.details:match(":(%d+)$")
            if port then return "http://127.0.0.1:" .. port end
            assert(gateway.status ~= "failed", gateway.details)
            local update = channel.select({inbox:case_receive(), deadline:case_receive()})
            assert(update.ok and update.channel == inbox, "test gateway does not report a listening address")
        end
    end)
    updates:close()
    if not ok then error(result, 0) end
    return result
end

return {url = url}
