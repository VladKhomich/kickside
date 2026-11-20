-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local process = require("process")
local channel = require("channel")
local time = require("time")

local function fold(input: table): table
    local config = input.projection.body.worker_config
    assert(input.events[1].body.text == "authoritative")
    local resume = assert(process.listen(config.topic .. ":resume"))
    assert(process.send(config.receiver, config.topic .. ":fold", tostring(process.pid())))
    local selected = channel.select({resume:case_receive(), time.after("5s"):case_receive()})
    process.unlisten(resume)
    assert(selected.channel == resume, "fold did not receive its resume signal")
    return {body = input.projection.body}
end

local function dispatch(input: table): table
    local config = input.projection.body.worker_config
    assert(process.send(config.receiver, config.topic, input.events[1].body.text))
    return {}
end

return {fold = fold, dispatch = dispatch}
