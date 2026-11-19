-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local process = require("process")
local consts = require("lifecycle_consts")

local function wait_for_provisioner(): string
    local name = consts.system_ready_name(consts.BOOT_NAME)
    while true do
        -- Wippy requires a timeout for each event-driven name wait. Renew an
        -- expired wait until the supervisor cancels startup or provisioning completes.
        local pid, err = process.registry.lookup(name, process.registry.EVENTUAL, {timeout = "1m"})
        if pid then return pid end
        if not err then
            error(errors.new({kind = errors.INTERNAL, message = "system readiness lookup returned no result"}))
        end
        if not errors.is(err, errors.NOT_FOUND) or not err:retryable() then
            error(errors.wrap(err, "system components were not provisioned"))
        end
    end
end

local function run(): {ok: boolean}
    local ready = wait_for_provisioner()
    local owner, err = process.registry.lookup(consts.BOOT_NAME, process.registry.CONSISTENT)
    if err then error(errors.wrap(err, "system provisioner is unavailable")) end
    if ready ~= owner then
        error(errors.new({kind = errors.UNAVAILABLE, message = "system readiness does not belong to the lifecycle provisioner"}))
    end
    return {ok = true}
end

return {run = run}
