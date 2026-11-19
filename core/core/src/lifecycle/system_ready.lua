-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local process = require("process")
local consts = require("lifecycle_consts")

local function wait_for_provisioner(): (string?, error?)
    local name = consts.system_ready_name(consts.BOOT_NAME)
    while true do
        -- Wippy requires a timeout for each event-driven name wait. Renew an
        -- expired wait until the supervisor cancels startup or provisioning completes.
        local pid, err = process.registry.lookup(name, process.registry.EVENTUAL, {timeout = "1m"})
        if pid then return pid, nil end
        if not err then
            return nil, errors.new({kind = errors.INTERNAL, message = "system readiness lookup returned no result"})
        end
        if not errors.is(err, errors.NOT_FOUND) or not err:retryable() then
            return nil, errors.wrap(err, "system components were not provisioned")
        end
    end
end

local function wait_or_cancel(): string
    local lifecycle = process.events()
    local results = channel.new(1)
    coroutine.spawn(function()
        local pid, err = wait_for_provisioner()
        results:send({pid = pid, err = err})
    end)
    while true do
        local selected = channel.select({lifecycle:case_receive(), results:case_receive()})
        if selected.channel == results and selected.ok then
            local result = selected.value :: {pid: string?, err: error?}
            if result.err then error(result.err) end
            return assert(result.pid)
        end
        if not selected.ok or (selected.value and selected.value.kind == process.event.CANCEL) then
            error(errors.new({kind = errors.CANCELED, message = "system readiness canceled"}))
        end
    end
end

local function run(): {ok: boolean}
    local ready = wait_or_cancel()
    local owner, err = process.registry.lookup(consts.BOOT_NAME, process.registry.CONSISTENT)
    if err then error(errors.wrap(err, "system provisioner is unavailable")) end
    if ready ~= owner then
        error(errors.new({kind = errors.UNAVAILABLE, message = "system readiness does not belong to the lifecycle provisioner"}))
    end
    return {ok = true}
end

return {run = run}
