-- boot: provisions the singleton system lifecycle thread and converges declared
-- component state, then stays resident as an upgradable process. Convergence
-- reads the schema of the installed code, so it runs only once every migration
-- in the namespaces that own the tables it reads is applied. The runtime
-- delivers OUTDATED at the registry commit, before a hot install's migrations
-- run; boot answers with process.upgrade(), and the upgraded code converges on
-- entry when the schema is already current. Otherwise it parks until the migrations land: the lifecycle
-- bootloader's migrations-applied message wakes it at once, and a parked boot
-- re-reads the ledger on a fixed retry interval for migrations that arrive
-- without that message.

local process = require("process")
local channel = require("channel")
local time = require("time")
local security = require("security")
local provision = require("provision")
local logger = require("logger"):named("kickside.lifecycle")
local consts = require("lifecycle_consts")
local error_envelope = require("error_envelope")
local proc_supervisor = require("proc_supervisor")
local migration_runner = require("migration_runner")
local core_db = require("core_db")

local function response_error(field: string): error
    return errors.new({kind = errors.INTERNAL, retryable = false, message = "lifecycle boot response is invalid",
        details = {code = "lifecycle_boot_response", field = field}})
end

local function converge_page(actor: any, scope: any, continuation: table?): (table?, error?)
    local summary, err = provision.converge(actor, scope, continuation)
    if type(summary) ~= "table" then return nil, err or response_error("converge") end
    local skipped = type(summary.skipped) == "table" and #(summary.skipped :: { any }) or 0
    if (tonumber(summary.healed) or 0) > 0 or skipped > 0 then
        logger:info("declared-thread convergence", {checked = summary.checked, healed = summary.healed, skipped = skipped})
        for _, entry in ipairs((summary.skipped :: { any }) or {}) do
            local details = (entry.error or {}).details or {}
            logger:error("declared thread not convergeable", {
                component_id = entry.component_id, impl_id = entry.impl_id, reason = entry.reason,
                code = details.code, thread_id = details.thread_id, projection_id = details.projection_id,
                projection_kind = details.projection_kind, projection_key = details.projection_key,
                cursor_key = details.cursor_key,
            })
        end
    end
    return summary.continuation, err
end

local function report(err: error)
    logger:error("system lifecycle convergence failed", {reason = tostring(err), error_native = error_envelope.encode(err)})
end

local function converge_state(boot_name: string): (integer?, error?, table?)
    local actor = security.new_actor(consts.SYSTEM_ACTOR, {
        system = true,
        groups = { "system", "lifecycle" },
    })
    if not actor then
        return nil, response_error("actor"), nil
    end

    local scope, scope_err = security.named_scope(consts.SYSTEM_SCOPE)
    if scope_err then return nil, errors.wrap(scope_err, "system lifecycle scope unavailable"), nil end
    if not scope then return nil, response_error("scope"), nil end

    local ids, err = provision.ensure_system(actor, scope)
    if err then
        return nil, err, nil
    end

    if type(ids) ~= "table" then return nil, response_error("provision"), nil end
    local ready, ready_err = process.registry.register(consts.system_ready_name(boot_name), nil, process.registry.EVENTUAL)
    if ready_err or not ready then return nil, ready_err or response_error("system_ready"), nil end
    logger:info("system lifecycle provisioned", { count = #ids })

    local continuation, converge_err = converge_page(actor, scope)
    if converge_err then return #ids, converge_err, nil end
    return #ids, nil, continuation and {actor = actor, scope = scope, continuation = continuation} or nil
end

-- Registry publication precedes a hot install's migrations; the migration
-- ledger is the authority on whether the schema convergence reads exists.
local function schema_ready(): (boolean, error?)
    local rows, err = migration_runner.setup(core_db.id()):find_migrations()
    if err or type(rows) ~= "table" then
        return false, errors.new({kind = errors.UNAVAILABLE, retryable = true,
            message = "lifecycle migration status unavailable: " .. tostring(err),
            details = {code = "lifecycle_migration_status"}})
    end
    local found: { [string]: boolean } = {}
    for _, owner in ipairs(consts.CONVERGE_SCHEMA) do found[owner.namespace] = false end
    local ready = true
    for _, row in ipairs(rows) do
        local namespace = string.match(tostring(row.id), "^([^:]+):")
        if namespace and found[namespace] ~= nil then
            found[namespace] = true
            if row.applied ~= true then ready = false end
        end
    end
    for _, owner in ipairs(consts.CONVERGE_SCHEMA) do
        if owner.required and not found[owner.namespace] then
            return false, errors.new({kind = errors.INTERNAL, retryable = false,
                message = "lifecycle convergence schema has no migrations: " .. owner.namespace,
                details = {code = "lifecycle_migration_namespace", namespace = owner.namespace}})
        end
    end
    return ready, nil
end

local CONVERGED, PARKED = "converged", "parked"

-- Converges when the ledger is current. A pending migration or an unavailable
-- ledger parks convergence for the next retry; the unavailable ledger is
-- logged once per parked stretch through `ledger_failed`.
local function converge_when_ready(boot_name: string, system_ready: boolean, ledger_failed: boolean): (string, integer?, error?, boolean, table?)
    local ready, ready_err = schema_ready()
    if ready_err then
        if ready_err:retryable() then
            if not ledger_failed then
                logger:error("system lifecycle migration ledger unavailable", { reason = tostring(ready_err), error_native = error_envelope.encode(ready_err) })
            end
            return PARKED, nil, nil, true, nil
        end
        report(ready_err)
        return CONVERGED, nil, ready_err, false, nil
    end
    if not ready then return PARKED, nil, nil, false, nil end
    local count, converge_err, pending = converge_state(boot_name)
    if converge_err then
        report(converge_err)
        if not system_ready and not count and converge_err:retryable() then
            return PARKED, nil, converge_err, false, nil
        end
    end
    return CONVERGED, count, converge_err, false, pending
end

-- Advertise failure only after the owner has a listener for its diagnostic.
-- The waiter proves it holds platform process authority by its registered name.
local function reject_startup(boot_name: string, events: any, cause: error)
    local requests, listen_err = process.listen(consts.SYSTEM_FAILURE_REQUEST, {message = true})
    if listen_err or not requests then
        error(error_envelope.wrap_secondary(listen_err or response_error("failure_listener"), cause, "listen for startup failure requests"))
    end
    local registered, register_err = process.registry.register(consts.system_failure_name(boot_name), nil, process.registry.EVENTUAL)
    if register_err or not registered then
        error(error_envelope.wrap_secondary(register_err or response_error("system_failed"), cause, "publish startup failure"))
    end
    local diagnostic = error_envelope.encode(cause)
    while true do
        local selected = channel.select({events:case_receive(), requests:case_receive()})
        if not selected.ok then error(cause) end
        if selected.channel == events then
            if selected.value.kind == process.event.CANCEL then error(cause) end
        else
            local sender = tostring(selected.value:from())
            local waiter = process.registry.lookup(consts.system_waiter_name(boot_name, sender), process.registry.CONSISTENT)
            if waiter == sender then
                local _, send_err = process.send(sender, consts.SYSTEM_FAILURE_REPLY, diagnostic)
                if send_err then
                    logger:warn("system lifecycle startup failure reply was not delivered", {reason = tostring(send_err)})
                end
            end
        end
    end
end

local function main(_args: any): any
    -- A registry update can reach the process as soon as its singleton name is visible.
    local opts_ok, opts_err = process.set_options({ trap_links = true, upgradable = true })
    if opts_err or opts_ok ~= true then error(opts_err or response_error("options")) end
    -- Listen and claim the boot name before the first convergence so a
    -- migrations-applied message sent meanwhile waits in the listener. An
    -- upgrade keeps the PID, its registered name and the unread listener
    -- messages. A second boot stands by until the owning boot exits.
    local events = process.events()
    local applied, listen_err = process.listen(consts.MIGRATIONS_APPLIED_TOPIC)
    if listen_err or not applied then
        error(listen_err or response_error("listen"))
    end
    local boot_name = consts.BOOT_NAME
    local claimed, stopped, claim_err, stop_kind = proc_supervisor.claim_singleton(boot_name, events, { process = process })
    if claim_err then error(claim_err) end
    if stopped then
        if stop_kind == process.event.OUTDATED then return process.upgrade() end
        return { ok = true }
    end
    if claimed ~= true then error(response_error("claim")) end

    local ready_owner = process.registry.lookup(consts.system_ready_name(boot_name), process.registry.EVENTUAL)
    local system_ready = ready_owner ~= nil and ready_owner == process.pid()
    local state, count, converge_err, ledger_failed, pending = converge_when_ready(boot_name, system_ready, false)
    system_ready = system_ready or count ~= nil
    if not system_ready and converge_err and not converge_err:retryable() then
        reject_startup(boot_name, events, converge_err)
    end
    local parked = state == PARKED
    if parked and not converge_err then logger:info("system lifecycle convergence awaits migrations") end

    -- Resident from here: upgradable, parked on the events channel and the
    -- migrations-applied listener. A clean return on CANCEL or channel closure
    -- completes graceful shutdown; the supervisor sees no exit otherwise.
    logger:info("system lifecycle resident", { upgradable = opts_ok == true })
    while true do
        -- The migrations-applied message is the immediate wake-up. A parked boot
        -- also re-reads the ledger on the retry interval, because migrations can
        -- land without that message: an install whose changed modules exclude
        -- core, or migrations applied after an install that ran none.
        local cases = { events:case_receive(), applied:case_receive() }
        local advance = pending and not parked and not converge_err and time.after("1ms") or nil
        local retry = (parked or (pending and converge_err)) and time.after(tostring(consts.SCHEMA_RETRY_MS) .. "ms") or nil
        if advance then cases[#cases + 1] = advance:case_receive() end
        if retry then cases[#cases + 1] = retry:case_receive() end
        local selected = channel.select(cases)
        local ev = selected.value
        local continuing = (advance and selected.channel == advance) or (retry and selected.channel == retry and not parked)
        if not continuing and selected.channel ~= retry
            and (not selected.ok or (selected.channel == events and ev and (ev :: any).kind == process.event.CANCEL)) then
            if converge_err then error(converge_err) end
            return { ok = true, count = count }
        end
        if continuing then
            local continuation, err = converge_page(pending.actor, pending.scope, pending.continuation)
            converge_err = err
            if err then
                report(err)
                if not err:retryable() then pending = nil end
            elseif continuation then
                pending.continuation = continuation
            else
                pending = nil
            end
        elseif selected.channel == applied or selected.channel == retry then
            local next_state, next_count, next_err, next_ledger_failed, next_pending = converge_when_ready(boot_name, system_ready, ledger_failed)
            ledger_failed = next_ledger_failed
            system_ready = system_ready or next_count ~= nil
            if not system_ready and next_err and not next_err:retryable() then
                reject_startup(boot_name, events, next_err)
            end
            if next_err then converge_err = next_err end
            if next_state == CONVERGED then
                parked = false
                count, converge_err, pending = next_count, next_err, next_pending
                logger:info("system lifecycle converged after migrations", { failed = converge_err ~= nil })
            elseif selected.channel == applied or not parked then
                parked, pending = true, nil
                logger:info("system lifecycle convergence awaits migrations")
            end
        elseif ev and (ev :: any).kind == process.event.OUTDATED then
            process.upgrade()
        end
    end
end

return { main = main }
