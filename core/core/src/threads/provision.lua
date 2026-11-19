-- provision: materialize a declared scoped component as a thread -- the component +
-- its event-log thread (one id, since thread.id == component.id), its declared
-- lifecycle-handler projections, and its retention / vacuum policy. This is where a
-- provisioned-kind declaration becomes real.
--
-- User-scope declarations have two lifecycle owners, both calling ensure_user:
--   - interactive users: the relay's workspace plugin, on websocket login;
--   - non-interactive / bridge service actors (which never log in): the uploads
--     process worker, at first ingest (its first touch of the actor's uploads
--     component).
--
-- Every step is idempotent: upsert is get-or-create, register_projection is
-- an upsert, retention upsert is keyed on the thread. So the whole materialization is
-- CONVERGENT -- a partial run completes on the next call. That is the cross-slice
-- equivalent of a single transaction: a literal one would have to duplicate each
-- slice's insert logic (component + thread + projection + retention), which is the
-- parallel implementation this whole effort removes.

local contract = require("contract")
local funcs = require("funcs")
local sql = require("sql")
local security = require("security")
local registry = require("registry")
local autoinit = require("autoinit")
local retention_repo = require("retention_repo")
local core_db = require("core_db")
local projections_writer = require("projections_writer")
local execution_identity = require("execution_identity")
local component_identity = require("component_identity")
local component_envelope = require("component_envelope")
local error_envelope = require("error_envelope")
local lifecycle_log = require("component_lifecycle_log")
local component_lifecycle = require("component_lifecycle")
local jobs_wake = require("jobs_wake")
local proj_register = require("proj_register")
local persisted_json = require("persisted_json")

local M = {}

local THREADS = "kickside.core:threads"
-- The convergence primitive is a plain function entry, not a contract method: a
-- live module install validates the existing binding against an updated
-- definition per entry, so a definition may never grow a method in an upgrade.
local CONVERGE_THREAD_FN = "kickside.core.threads:converge_thread_method"
-- The trusted owner entry that resolves a component's stored identity to converge it.
local CONVERGE_OWNER = "kickside.core.threads:converge"
local PROVISION_USER = "kickside.core.threads:provision_user"
local PROVISION_IDENTITY = "kickside.core.threads:provision_identity"
local COMPONENT_SERVICE = "kickside.component:component_service"

local function missing_result(field: string): error
    return errors.new({kind = errors.INTERNAL, message = "provisioning dependency returns no result: " .. field,
        retryable = false, details = {code = "provision_response", field = field}})
end

-- A user's own frame may admit an independent singleton root. Delegated frames
-- retain their inherited root and authorizer so live delegation still fences work.
-- Keep request restrictions and never mutate the caller.
local function user_actor(actor: any): (any?, error?)
    if execution_identity.is_maintenance_key(actor:id()) then return actor, nil end
    local principal, principal_err = execution_identity.principal_of_key(actor:id())
    if principal_err then return nil, principal_err end
    if principal.kind ~= "user" then return actor, nil end
    local meta: { [string]: any } = {}
    for key, value in pairs(actor:meta() or {}) do meta[key] = value end
    local inherited = meta.execution_identity
    if inherited ~= nil then
        local valid, validation_err = execution_identity.validate(inherited)
        if not valid then return nil, validation_err end
        if not execution_identity.same_principal(inherited.principal, principal) then
            return nil, errors.new({kind = errors.PERMISSION_DENIED,
                message = "provisioning identity does not match its owning user"})
        end
        if not execution_identity.same_principal(inherited.authorized_by, principal) then
            return actor, nil
        end
    end
    local restrictions = inherited or meta
    local authorizer = inherited and inherited.authorized_by or principal
    -- A fresh owner frame already lets registration establish the singleton's
    -- root. It needs no actor-creation capability beyond normal provisioning.
    if restrictions.component_id == nil and execution_identity.same_principal(authorizer, principal) then
        return actor, nil
    end
    meta.principal = principal
    meta.component_id = nil
    meta.execution_identity = {
        version = execution_identity.VERSION,
        principal = principal,
        authorized_by = {kind = "user", id = principal.id},
        credential_id = restrictions.credential_id,
        link_id = restrictions.link_id,
        captured_at = execution_identity.utc_now(),
    }
    local valid, validation_err = execution_identity.validate(meta.execution_identity)
    if not valid then return nil, validation_err end
    return security.new_actor(actor:id(), meta)
end

local function open_threads(actor: any, scope: any): (any?, error?)
    local svc, cerr = contract.get(THREADS)
    if cerr then return nil, (errors.wrap(cerr, "threads contract unavailable") :: error) end
    if not svc then return nil, missing_result("threads_get") end
    local threads, oerr = (svc :: any):with_actor(actor):with_scope(scope):open()
    if oerr then return nil, (errors.wrap(oerr, "open threads contract failed") :: error) end
    if not threads then return nil, missing_result("threads_open") end
    return threads, nil
end

-- The private function owns actor selection, while the caller supplies the
-- authenticated frame. No caller gains general actor-creation authority.
local function provision_user(actor: any, scope: any, args: any): (any?, error?)
    local executor, actor_err = funcs.new():with_actor(actor)
    if actor_err then return nil, actor_err end
    if not executor then return nil, missing_result("actor") end
    local scoped, scope_err = executor:with_scope(scope)
    if scope_err then return nil, scope_err end
    if not scoped then return nil, missing_result("scope") end
    return scoped:call(PROVISION_USER, args)
end

-- apply_grants writes each declared additional grant onto the provisioned component
-- through grant_subtree (the canonical access cascade), beyond the owner's implicit
-- FULL. Idempotent: grant_subtree upserts the direct grant, so re-running converges.
-- Opened with the provisioning actor + scope so the grant runs under the owner's ADMIN.
local function apply_grants(actor: any, scope: any, component_id: string, grants: { any }): error?
    if type(grants) ~= "table" or #grants == 0 then
        return nil
    end
    local cdef, cerr = contract.get(COMPONENT_SERVICE)
    if cerr then return (errors.wrap(cerr, "component service unavailable") :: error) end
    if not cdef then return missing_result("grants_get") end
    local svc, oerr = (cdef :: any):with_actor(actor):with_scope(scope):open()
    if oerr then return (errors.wrap(oerr, "open component service failed") :: error) end
    if not svc then return missing_result("grants_open") end
    for _, g in ipairs(grants) do
        local grant = g :: { subject_id: string, subject_type: string?, access_mask: integer }
        local res, herr = (svc :: any):grant_subtree({
            root_component_id = component_id,
            subject = { subject_id = grant.subject_id, subject_type = grant.subject_type },
            access_mask = grant.access_mask,
        })
        if herr then
            return (errors.wrap(herr, "grant_subtree '" .. tostring(grant.subject_id) .. "' failed") :: error)
        end
        if type(res) ~= "table" then return missing_result("grant") end
        if (res :: any).success == false then
            return component_envelope.error_of(res, "grant_subtree", "grant_subtree '" .. tostring(grant.subject_id) .. "'")
        end
        if (res :: any).success ~= true then return missing_result("grant") end
    end
    return nil
end

-- materialize one declaration for scope_key against an actor-bound threads contract.
-- actor + scope are the provisioning identity, reused to apply the declaration's grants.
local function materialize(threads: any, actor: any, scope: any, scope_key: string, decl: any): (string?, error?)
    local component_id = autoinit.component_id(scope_key, decl.class :: string) :: string
    local declared, declaration_err = autoinit.thread_for_impl(decl.impl_id)
    if declaration_err then return nil, declaration_err end

    -- The component AND its thread share one id (get-or-create, idempotent).
    local upsert_args: { [string]: any } = {
        thread_id = component_id,
        impl_id = decl.impl_id,
        thread_class = (declared or {}).class or decl.class,
        title = decl.title,
        icon = decl.icon,
    }
    local _, upsert_err = threads:upsert(upsert_args)
    if upsert_err then
        return nil, upsert_err
    end

    -- The thread writer applies declared thread projections from decl.impl_id on
    -- first create. Provisioning does not carry a second projection-registration
    -- path; reruns only converge access + retention.

    -- An absent window inherits the live Core policy; only declarations store an override.
    local r = decl.retention
    if type(r) == "table" and type(r.event_days) == "number" then
        local rdb, rdb_err = sql.get(core_db.id())
        if rdb_err then return nil, (errors.wrap(rdb_err, "provision retention database unavailable") :: error) end
        if not rdb then return nil, missing_result("get") end
        local _, retention_err = retention_repo.upsert(rdb, component_id :: string, {
            event_hot_retention_days = r.event_days,
        })
        local _, release_err = rdb:release()
        if release_err then
            if retention_err then
                return nil, error_envelope.wrap_secondary(release_err, retention_err, "provision retention database release failed")
            end
            return nil, (errors.wrap(release_err, "provision retention database release failed") :: error)
        end
        if retention_err then return nil, retention_err end
    end

    -- Declared additional grants (e.g. admin READ, user WRITE-only on a system thread).
    local grant_err = apply_grants(actor, scope, component_id :: string, (decl.grants or {}) :: { any })
    if grant_err then
        return nil, grant_err
    end

    return component_id :: string, nil
end

-- provision_scope materializes every declaration of want_scope for scope_key, opening
-- the threads contract bound to the actor so the components are owned by them.
-- Idempotent + convergent; returns the provisioned ids.
local function provision_scope(actor: any, scope: any, scope_key: string, want_scope: string): ({ string }?, error?)
    if type(scope_key) ~= "string" or scope_key == "" then
        return nil, (errors.new({ message = "scope_key is required", kind = errors.INVALID }) :: error)
    end
    local threads, open_err = open_threads(actor, scope)
    if open_err then return nil, open_err end

    local ids: { string } = {}
    for _, decl in ipairs(autoinit.declarations()) do
        if decl.scope == want_scope and scope:evaluate(actor, "registry.get", decl.impl_id) == "allow" then
            local id, mat_err = materialize(threads, actor, scope, scope_key, decl)
            if mat_err then return nil, mat_err end
            ids[#ids + 1] = id :: string
        end
    end
    return ids, nil
end

-- The frame a component converges under: the component's own stored execution
-- identity, resolved by this trusted owner (the converge entry) for the
-- component root, or the opener's framework frame for a framework-created
-- component that carries none. A parked or unresolvable identity is returned as
-- the error and the component is skipped visibly.
local function converge_executor(component_id: string, opener_actor: any, opener_scope: any): (any?, error?)
    local stored, load_err = component_identity.execution_identity_of(component_id)
    if load_err then return nil, load_err end
    if stored ~= nil then
        return execution_identity.bind(stored, { deferred_owner = CONVERGE_OWNER, execution_root = component_id })
    end
    -- with_actor returns (nil, err) when the process lacks the funcs.security
    -- capability; chaining onto nil would crash the whole provisioner.
    local executor, actor_err = funcs.new():with_actor(opener_actor)
    if actor_err then return nil, actor_err end
    if not executor then return nil, missing_result("actor") end
    local scoped, scope_err = (executor :: any):with_scope(opener_scope)
    if scope_err then return nil, scope_err end
    if not scoped then return nil, missing_result("scope") end
    return scoped, nil
end

local OWNER_PAGE = 256

local function current_kinds(): table
    local kinds = {}
    for _, kind in ipairs(autoinit.declared_kinds()) do
        local owner_impl = tostring(kind.component_impl_id or kind.impl_id)
        local declarations = {}
        local primary = type(kind.class) == "string" and kind.class ~= ""
        local lifecycle = false
        local invalid: error? = nil
        for index, decl in ipairs(kind.projections or {}) do
            local own = decl.on == autoinit.PROJECTION_ON.LIFECYCLE and not lifecycle_log.is_exempt(owner_impl)
            if own or decl.on == nil or decl.on == "" or decl.on == autoinit.PROJECTION_ON.THREAD then
                local body, body_err = proj_register.declaration_body({worker_ref = decl.worker_ref,
                    worker_input_mode = decl.input_mode, worker_config = decl.worker_config, events = decl.events})
                local idle, maximum, debounce_err = proj_register.debounce(decl)
                local declaration_kind = tostring(decl.kind):match("^%s*(.-)%s*$")
                local projection_key = proj_register.declaration_key(decl.projection_key)
                local validation_err = body_err or debounce_err
                if not invalid and validation_err then
                    invalid = errors.wrap(validation_err, "invalid projection declaration " .. declaration_kind .. "/" .. projection_key)
                end
                declarations[#declarations + 1] = {own = own, kind = declaration_kind, projection_key = projection_key,
                    cursor_key = proj_register.declaration_key(decl.cursor_key), body = body, idle = idle, maximum = maximum,
                    index = index, raw = decl}
                lifecycle = lifecycle or own
                primary = primary or not own
            end
        end
        if primary or lifecycle then
            kinds[#kinds + 1] = {impl_id = kind.impl_id, owner_impl = owner_impl, class = kind.class,
                primary = primary, lifecycle = lifecycle, declarations = declarations, invalid = invalid}
        end
    end
    table.sort(kinds, function(a, b) return a.impl_id < b.impl_id end)
    return kinds
end

-- The values contain only one owner page. PostgreSQL's lateral LIMIT keeps
-- the inner probes keyed even when a production table is much larger than
-- the page. SQLite uses its indexed nested-loop left joins.
local function inspect_page(db: any, dialect: string, kind: table, owners: table): (table?, error?)
    local args, values = {}, {}
    local function param(value: string): string
        args[#args + 1] = value
        return "$" .. tostring(#args)
    end
    local cast = dialect == sql.type.POSTGRES and "::uuid" or ""
    for _, row in ipairs(owners) do
        local id = tostring(row.component_id)
        local owner_id = param(id) .. cast
        local lifecycle_id = kind.lifecycle and param(lifecycle_log.thread_id(id)) .. cast or "NULL"
        values[#values + 1] = "(" .. owner_id .. "," .. lifecycle_id .. ")"
    end
    local from = " FROM (VALUES " .. table.concat(values, ",") .. ")"
    if dialect == sql.type.POSTGRES then from = from .. " AS owners(component_id,lifecycle_id)"
    else from = " FROM (SELECT column1 AS component_id,column2 AS lifecycle_id" .. from .. ") owners" end
    local function probe(alias: string, table_name: string, columns: string, predicate: string): string
        if dialect == sql.type.POSTGRES then
            return " LEFT JOIN LATERAL (SELECT " .. columns .. " FROM " .. table_name .. " " .. alias ..
                " WHERE " .. predicate .. " LIMIT 1) " .. alias .. " ON TRUE"
        end
        return " LEFT JOIN " .. table_name .. " " .. alias .. " ON " .. predicate
    end
    local states = {}
    for _, row in ipairs(owners) do states[tostring(row.component_id)] = {thread_missing = {}, lifecycle_missing = {}, refusals = {}} end
    if kind.primary then
        local query = "SELECT owners.component_id,t.id AS thread_id" .. (kind.class and
            ",t.thread_class,ty.value AS component_type,cl.value AS component_class" or "") .. from
            .. probe("t", "kickside_thread", "id,thread_class", "t.id=owners.component_id")
        if kind.class then
            query = query .. probe("ty", "kickside_component_meta", "value", "ty.component_id=owners.component_id AND ty.key='type'")
                .. probe("cl", "kickside_component_meta", "value", "cl.component_id=owners.component_id AND cl.key='thread_class'")
        end
        local rows, err = db:query(query, args)
        if err then return nil, err end
        if type(rows) ~= "table" or #rows ~= #owners then return nil, missing_result("thread_page") end
        for _, row in ipairs(rows) do
            local state = states[tostring(row.component_id)]
            state.has_primary = row.thread_id ~= nil
            state.thread = kind.class and (row.thread_class ~= kind.class or row.component_type ~= "thread"
                or row.component_class ~= kind.class)
        end
    end
    local owner_arg_count = #args
    for _, decl in ipairs(kind.declarations) do
        local source = decl.own and "owners.lifecycle_id" or "owners.component_id"
        local fields = proj_register.declaration_fields_sql(dialect, "p.body") .. " AS declaration_body"
        local declaration = dialect == sql.type.POSTGRES and "p.declaration_body" or fields
        local query = "SELECT owners.component_id,p.id AS projection_id,p.thread_id," .. declaration .. ","
            .. "c.id AS cursor_id,c.debounce_idle_ms,c.debounce_max_ms,j.id AS job_id" .. from
            .. probe("p", "kickside_projection", "id,thread_id," .. fields,
                "p.thread_id=" .. source .. " AND p.kind=" .. param(decl.kind) .. " AND p.projection_key=" .. param(decl.projection_key))
            .. probe("c", "kickside_projection_cursor", "id,thread_id,debounce_idle_ms,debounce_max_ms,job_id",
                "c.projection_id=p.id AND c.cursor_key=" .. param(decl.cursor_key))
            .. probe("j", "kickside_job", "id", "j.id=c.job_id")
        local rows, err = db:query(query, args)
        if err then return nil, err end
        if type(rows) ~= "table" or #rows ~= #owners then return nil, missing_result("projection_page") end
        for _, row in ipairs(rows) do
            local state = states[tostring(row.component_id)]
            if decl.own or state.has_primary then
                local refusal: error? = nil
                if row.cursor_id then
                    local stored, body_err = persisted_json.decode_table(row.declaration_body, "kickside_projection.body")
                    refusal = body_err
                    if not refusal and (not proj_register.declaration_matches(stored, decl.body)
                        or tonumber(row.debounce_idle_ms) ~= decl.idle or tonumber(row.debounce_max_ms) ~= decl.maximum) then
                        refusal = proj_register.declaration_refusal(row.thread_id, row.projection_id, decl.kind,
                            decl.projection_key, decl.cursor_key)
                    end
                end
                if refusal then
                    state.refusals[#state.refusals + 1] = refusal
                elseif row.job_id == nil then
                    if decl.own then
                        state.lifecycle_missing[#state.lifecycle_missing + 1] = decl.raw
                    else
                        state.thread = true
                        state.thread_missing[tostring(decl.index)] = true
                    end
                end
            end
        end
        for i = #args, owner_arg_count + 1, -1 do args[i] = nil end
    end
    return states, nil
end

-- Each pass seeks a bounded page of owners and jobs. Scan without locks, and
-- commit each repair before proceeding to another projection or owner.
function M.converge(opener_actor: any, opener_scope: any, continuation: table?): ({ [string]: any }, error?)
    local summary: { [string]: any } = {examined = 0, checked = 0, healed = 0, skipped = {}}
    local function skip(component_id: string?, impl_id: string, cause: error)
        summary.skipped[#summary.skipped + 1] = {component_id = component_id, impl_id = impl_id,
            reason = cause:message(), error = error_envelope.encode(cause)}
    end
    local db, db_err = sql.get(core_db.id())
    if db_err then return summary, errors.wrap(db_err, "converge: db unavailable") end
    if not db then return summary, missing_result("get") end
    local dialect, type_err = db:type()
    local wake = false
    local function finish(cause: error?): ({ [string]: any }, error?)
        if wake then
            local _, wake_err = jobs_wake.nudge_workers(db, dialect)
            if wake_err then
                cause = cause and error_envelope.wrap_secondary(wake_err, cause, "converge: job worker wake failed")
                    or errors.wrap(wake_err, "converge: job worker wake failed")
            end
        end
        local _, release_err = db:release()
        if release_err and cause then
            return summary, error_envelope.wrap_secondary(release_err, cause, "converge: database release failed")
        end
        return summary, release_err and errors.wrap(release_err, "converge: database release failed") or cause
    end
    if type_err then return finish(type_err) end
    local kinds = continuation and continuation.kinds or current_kinds()
    local upper = continuation and continuation.upper
    local positions: {[string]: any} = {}
    for id, after in pairs(continuation and continuation.positions or {}) do positions[id] = after end
    if not upper then
        local bounds, bounds_err = db:query("SELECT component_id AS upper FROM kickside_components ORDER BY component_id DESC LIMIT 1")
        if bounds_err then return finish(errors.wrap(bounds_err, "converge: boundary scan failed")) end
        if type(bounds) ~= "table" or #bounds > 1 then return finish(missing_result("boundary")) end
        upper = bounds[1] and tostring(bounds[1].upper) or ""
    end
    local slots = continuation and continuation.slots or nil
    local function resume(index: number): ({ [string]: any }, error?)
        summary.continuation = {kind_index = index, positions = positions, upper = upper, kinds = kinds, slots = slots}
        return finish(nil)
    end
    local function repair_thread(kind: table, state: table, component_id: string): error?
        local executor, exec_err = converge_executor(component_id, opener_actor, opener_scope)
        if exec_err or not executor then
            return errors.wrap(exec_err or missing_result("executor"), "converge identity unavailable")
        end
        local _, converge_err = executor:call(CONVERGE_THREAD_FN, {component_id = component_id,
            impl_id = kind.impl_id, thread_class = kind.class,
            projection_indexes = state.has_primary and state.thread_missing or nil})
        return converge_err and errors.wrap(converge_err, "converge_thread failed") or nil
    end
    local function repair_lifecycle(kind: table, component_id: string, declaration: table): error?
        local tx, begin_err = db:begin()
        if begin_err then return begin_err end
        if not tx then return missing_result("begin") end
        local _, own_err = component_lifecycle.converge_own(tx, tostring(dialect), component_id, kind.owner_impl, declaration)
        if own_err then
            local _, rollback_err = tx:rollback()
            if rollback_err then return error_envelope.wrap_secondary(rollback_err, own_err, "converge: lifecycle rollback failed") end
            return own_err
        end
        local _, commit_err = tx:commit()
        if commit_err then return commit_err end
        wake = true
        return nil
    end

    local first = continuation and continuation.kind_index or 1
    for offset = 0, #kinds - 1 do
        local index = (first + offset - 1) % #kinds + 1
        local kind = kinds[index]
        local after = positions[kind.impl_id]
        if upper ~= "" and after ~= false then
            local bound = OWNER_PAGE - summary.examined
            local args: {any} = {kind.owner_impl, upper}
            local statement = "SELECT component_id FROM kickside_components WHERE "
            local order = " ORDER BY component_id"
            if dialect == sql.type.POSTGRES then
                -- Keep both endpoints in the composite index. A scalar id bound
                -- can choose the global primary key and filter an entire kind.
                args[3] = after or "00000000-0000-0000-0000-000000000000"
                statement = statement .. "(impl_id,component_id)<=($1,$2) AND (impl_id,component_id)>"
                    .. (after and "" or "=") .. "($1,$3)"
                order = " ORDER BY impl_id,component_id"
            else
                statement = statement .. "impl_id=$1 AND component_id<=$2"
                if after then
                    statement = statement .. " AND component_id>$3"
                    args[3] = after
                end
            end
            args[#args + 1] = bound
            local owners, owner_err = db:query(statement .. order .. " LIMIT $" .. tostring(#args), args)
            if owner_err then return finish(errors.wrap(owner_err, "converge: owner scan failed")) end
            if type(owners) ~= "table" or #owners > bound then return finish(missing_result("owner_page")) end
            summary.examined = summary.examined + #owners
            if #owners > 0 and kind.invalid then
                skip(nil, kind.impl_id, kind.invalid)
                positions[kind.impl_id] = false
            elseif #owners > 0 then
                local states, scan_err = inspect_page(db, tostring(dialect), kind, owners)
                if scan_err then return finish(errors.wrap(scan_err, "converge: declaration scan failed")) end
                for _, owner in ipairs(owners) do
                    local id = tostring(owner.component_id)
                    local state = states[id]
                    if state.thread or #state.lifecycle_missing > 0 or #state.refusals > 0 then
                        summary.checked = summary.checked + 1
                        local failed = #state.refusals > 0
                        for _, refusal in ipairs(state.refusals) do skip(id, kind.impl_id, refusal) end
                        if state.thread then
                            local err = repair_thread(kind, state, id)
                            if err then
                                failed = true
                                skip(id, kind.impl_id, err)
                            end
                        end
                        for _, declaration in ipairs(state.lifecycle_missing) do
                            local err = repair_lifecycle(kind, id, declaration)
                            if err then
                                failed = true
                                skip(id, kind.impl_id, err)
                            end
                        end
                        if not failed then summary.healed = summary.healed + 1 end
                    end
                    positions[kind.impl_id] = id
                end
            end
            if #owners < bound then positions[kind.impl_id] = false end
            if summary.examined == OWNER_PAGE then return resume(index % #kinds + 1) end
        end
    end

    local _, slot_err, next_slots = projections_writer.converge(db, summary.skipped, slots)
    if slot_err then return finish(slot_err) end
    if next_slots then
        slots = next_slots
        return resume(first)
    end
    return finish(nil)
end

-- ensure_user materializes every user-scope declaration for the actor. Two owners
-- call it: the relay workspace plugin on interactive login, and the uploads process
-- worker at first ingest for non-interactive/bridge actors that never log in. The
-- actor owns the provisioned components; idempotent, so either owner converges.
function M.ensure_user(actor: any, scope: any, scope_key: string): ({ string }?, error?)
    if scope_key ~= actor:id() then
        return nil, errors.new({kind = errors.PERMISSION_DENIED,
            message = "user provisioning key must match the authenticated actor"})
    end
    local meta = actor:meta() or {}
    if meta.execution_identity == nil and meta.component_id == nil then
        return provision_scope(actor, scope, actor:id(), autoinit.SCOPE.USER :: string)
    end
    return provision_user(actor, scope, {})
end

-- Internal first-touch emit path. Only the owning user's declared singleton
-- enters provisioning; all other creation paths retain normal frame capture.
local function is_user_singleton(actor: any, args: any): (boolean?, error?)
    local entry, lookup_err = registry.get(args.impl_id)
    if lookup_err then return nil, lookup_err end
    local meta = entry and entry.meta or {}
    local provision = meta.provision
    local class = autoinit.first_class(meta.class)
    if type(provision) ~= "table" or provision.scope == autoinit.SCOPE.SYSTEM
        or type(class) ~= "string" or class == ""
        or args.component_id ~= autoinit.component_id(actor:id(), class) then
        return false, nil
    end
    return true, nil
end

local function ensure_singleton(actor: any, scope: any, args: any): (boolean?, error?)
    local eligible, eligibility_err = is_user_singleton(actor, args)
    if eligibility_err or not eligible then return eligible, eligibility_err end
    local owner, owner_err = user_actor(actor)
    if owner_err then return nil, owner_err end
    local threads, open_err = open_threads(owner, scope)
    if open_err then return nil, open_err end
    local _, upsert_err = threads:upsert({thread_id = args.component_id,
        impl_id = args.impl_id, thread_class = args.thread_class})
    if upsert_err then return nil, upsert_err end
    return true, nil
end

function M.ensure_singleton(actor: any, scope: any, args: any): (boolean?, error?)
    local eligible, eligibility_err = is_user_singleton(actor, args)
    if eligibility_err or not eligible then return eligible, eligibility_err end
    return provision_user(actor, scope, args)
end

-- Private provisioning entry: its extra capabilities select only the current
-- user's identity. Strip them before any contract write or declared callback.
function M.provision_user(args: any): (any?, error?)
    local actor = security.actor()
    local caller_scope = security.scope()
    if not actor or not caller_scope then
        return nil, errors.new({kind = errors.PERMISSION_DENIED,
            message = "user provisioning requires an authenticated actor and scope"})
    end
    if args.scope_key ~= nil then
        return nil, errors.new({kind = errors.PERMISSION_DENIED,
            message = "user provisioning does not accept a caller-supplied key"})
    end
    local scope = caller_scope:without(PROVISION_IDENTITY)
    if args.component_id == nil then
        local owner, owner_err = user_actor(actor)
        if owner_err then return nil, owner_err end
        return provision_scope(owner, scope, actor:id(), autoinit.SCOPE.USER :: string)
    end
    return ensure_singleton(actor, scope, args)
end

-- ensure_system materializes every system-scope declaration (called once at boot under
-- a system actor, e.g. system:lifecycle). System singletons share the fixed
-- SYSTEM_SCOPE_KEY so the same components resolve on every boot, owned by the system
-- actor with whatever additional grants each declaration carries.
function M.ensure_system(actor: any, scope: any): ({ string }?, error?)
    return provision_scope(actor, scope, autoinit.SYSTEM_SCOPE_KEY :: string, autoinit.SCOPE.SYSTEM :: string)
end

return M
