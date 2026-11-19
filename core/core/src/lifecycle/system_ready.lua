-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local process = require("process")
local time = require("time")
local consts = require("lifecycle_consts")

local function protocol_error(message: string): error
    return errors.new({kind = errors.UNAVAILABLE, message = message})
end

local function wait_for_owner(boot_name: string, name: string): (string?, error?)
    while true do
        -- Renew the event-driven subscription. The supervisor owns startup cancellation.
        local pid, err = process.registry.lookup(name, process.registry.EVENTUAL, {timeout = "1m"})
        if pid then
            local owner, owner_err = process.registry.lookup(boot_name, process.registry.CONSISTENT)
            if owner_err then return nil, owner_err end
            if pid ~= owner then return nil, protocol_error("system startup outcome does not belong to the lifecycle provisioner") end
            return pid, nil
        end
        if not err then return nil, protocol_error("system startup lookup returned no result") end
        if not errors.is(err, errors.NOT_FOUND) or not err:retryable() then return nil, err end
    end
end

local function read_failure(boot_name: string, owner: string): error
    local pid, pid_err = process.pid()
    if pid_err or not pid then return pid_err or protocol_error("system startup waiter has no process id") end
    local registered, register_err = process.registry.register(consts.system_waiter_name(boot_name, pid), nil, process.registry.CONSISTENT)
    if register_err or not registered then return register_err or protocol_error("system startup waiter could not register") end
    local replies, listen_err = process.listen(consts.SYSTEM_FAILURE_REPLY, {message = true})
    if listen_err or not replies then return listen_err or protocol_error("system startup waiter could not listen") end
    local sent, send_err = process.send(owner, consts.SYSTEM_FAILURE_REQUEST)
    if send_err or not sent then return send_err or protocol_error("system startup waiter could not request the failure") end
    -- The provisioner has already declared terminal failure. Bound the diagnostic
    -- exchange independently of the time allowed for healthy provisioning.
    local deadline = time.after("10s")
    while true do
        local selected = channel.select({replies:case_receive(), deadline:case_receive()})
        if selected.channel ~= replies or not selected.ok then
            return protocol_error("system provisioning failed and the diagnostic could not be received")
        end
        local reply = selected.value
        if reply:from() == owner then
            local payload = reply:payload()
            local diagnostic = payload and payload:data()
            if type(diagnostic) == "table" then return errors.new(diagnostic) end
            return protocol_error("system provisioner returned an invalid startup diagnostic")
        end
    end
end

local function run(): {ok: boolean}
    local boot_name = consts.BOOT_NAME
    local lifecycle = process.events()
    local results = channel.new(2)
    coroutine.spawn(function()
        local pid, err = wait_for_owner(boot_name, consts.system_ready_name(boot_name))
        results:send({ready = pid ~= nil, err = err})
    end)
    coroutine.spawn(function()
        local pid, err = wait_for_owner(boot_name, consts.system_failure_name(boot_name))
        results:send({err = err or read_failure(boot_name, assert(pid))})
    end)
    while true do
        local selected = channel.select({lifecycle:case_receive(), results:case_receive()})
        if selected.channel == results and selected.ok then
            local result = selected.value :: {ready: boolean?, err: error?}
            if result.err then error(errors.wrap(result.err, "system component provisioning failed")) end
            if result.ready then return {ok = true} end
        end
        if not selected.ok or (selected.value and selected.value.kind == process.event.CANCEL) then
            error(errors.new({kind = errors.CANCELED, message = "system readiness canceled"}))
        end
    end
end

return {run = run}
