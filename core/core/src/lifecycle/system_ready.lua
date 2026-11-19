-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local process = require("process")
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
        results:send({err = err or errors.new({kind = errors.UNAVAILABLE, retryable = false,
            message = "see the kickside.lifecycle log for the provisioning error",
            details = {code = "lifecycle_startup_failed", provisioner = pid}})})
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
