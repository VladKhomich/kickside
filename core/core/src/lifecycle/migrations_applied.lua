-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- migrations_applied: the bootloader that follows the migration bootloader. It
-- tells the resident boot process that the install's schema is in place, so
-- convergence of the installed code runs against the schema that code reads.
-- At cold boot the resident process starts after this barrier. Materialize
-- system components and apply their grants here before releasing callers.

local process = require("process")
local security = require("security")
local consts = require("lifecycle_consts")
local provision = require("provision")
local retention_notifier = require("retention_notifier")

local function provision_at_startup(): any
    local actor, actor_err = security.new_actor(consts.SYSTEM_ACTOR, {
        system = true,
        groups = { "system", "lifecycle" },
    })
    if not actor then
        return {status = "error", message = "system lifecycle actor unavailable: " .. tostring(actor_err)}
    end
    local scope, scope_err = security.named_scope(consts.SYSTEM_SCOPE)
    if not scope then
        return {status = "error", message = "system lifecycle scope unavailable: " .. tostring(scope_err)}
    end
    local _, provision_err = provision.ensure_system(actor, scope)
    if provision_err then
        return {status = "error", message = "system component provisioning failed: " .. tostring(provision_err)}
    end
    return {status = "success", message = "system components and grants provisioned"}
end

local function run(_: any?): any
    local _, notify_err = retention_notifier.notify({kind = "migrations_applied"})
    if notify_err then
        return {status = "error", message = "retention migration wake failed: " .. tostring(notify_err)}
    end
    local pid, lookup_err = process.registry.lookup(consts.BOOT_NAME, process.registry.CONSISTENT)
    if lookup_err and not errors.is(lookup_err, errors.NOT_FOUND) then
        return { status = "error", message = "lifecycle boot lookup failed: " .. tostring(lookup_err) }
    end
    if not pid then
        return provision_at_startup()
    end
    local _, send_err = process.send(tostring(pid), consts.MIGRATIONS_APPLIED_TOPIC, {})
    if send_err then
        return { status = "error", message = "lifecycle boot message failed: " .. tostring(send_err) }
    end
    return { status = "success", message = "lifecycle convergence requested" }
end

return { run = run }
