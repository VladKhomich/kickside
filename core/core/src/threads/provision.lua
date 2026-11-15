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
local autoinit = require("autoinit")
local retention_repo = require("retention_repo")
local core_db = require("core_db")
local proj_types = require("proj_types")
local proj_register = require("proj_register")
local execution_identity = require("execution_identity")
local component_identity = require("component_identity")
local component_envelope = require("component_envelope")
local error_envelope = require("error_envelope")
local lifecycle_log = require("component_lifecycle_log")
local component_lifecycle = require("component_lifecycle")

local M = {}

local THREADS = "kickside.core:threads"
-- The convergence primitive is a plain function entry, not a contract method: a
-- live module install validates the existing binding against an updated
-- definition per entry, so a definition may never grow a method in an upgrade.
local CONVERGE_THREAD_FN = "kickside.core.threads:converge_thread_method"
-- The trusted owner entry that resolves a component's stored identity to converge it.
local CONVERGE_OWNER = "kickside.core.threads:converge"
local COMPONENT_SERVICE = "kickside.component:component_service"

local function missing_result(field: string): error
    return errors.new({kind = errors.INTERNAL, message = "provisioning dependency returns no result: " .. field,
        retryable = false, details = {code = "provision_response", field = field}})
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
    local svc, cerr = contract.get(THREADS)
    if cerr then return nil, (errors.wrap(cerr, "threads contract unavailable") :: error) end
    if not svc then return nil, missing_result("threads_get") end
    local threads, oerr = (svc :: any):with_actor(actor):with_scope(scope):open()
    if oerr then return nil, (errors.wrap(oerr, "open threads contract failed") :: error) end
    if not threads then return nil, missing_result("threads_open") end

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

-- Existence checks retain the bulk reconciliation pass; lifecycle missing sets
-- are reused across turns. Declaration maintenance seeks only mismatches. A finite
-- run rotates kinds, examines at most 4096 mismatches
-- and repairs at most 256 components per turn through the existing owners.
function M.converge(opener_actor: any, opener_scope: any, continuation: table?): ({ [string]: any }, error?)
    local summary: { [string]: any } = {checked = 0, healed = 0, skipped = {}}
    local db, db_err = sql.get(core_db.id())
    if db_err then return summary, errors.wrap(db_err, "converge: db unavailable") end
    if not db then return summary, missing_result("get") end
    local lifecycle_healed = false
    local function finish(cause: error?): ({ [string]: any }, error?)
        if lifecycle_healed then
            local _, wake_err = component_lifecycle.committed()
            if wake_err then
                cause = cause and error_envelope.wrap_secondary(wake_err, cause, "converge: job worker wake failed")
                    or errors.wrap(wake_err, "converge: job worker wake failed")
            end
        end
        local _, release_err = db:release()
        if release_err and cause then return summary, error_envelope.wrap_secondary(release_err, cause, "converge: database release failed") end
        return summary, release_err and errors.wrap(release_err, "converge: database release failed") or cause
    end
    local function converge_lifecycle(component_id: string, impl_id: string, projections: table): error?
        local dbtype, type_err = db:type()
        if type_err then return type_err end
        local tx, begin_err = db:begin()
        if begin_err then return begin_err end
        if not tx then return missing_result("begin") end
        local _, own_err = component_lifecycle.converge_own(tx, tostring(dbtype), component_id, impl_id, projections)
        if own_err then
            local _, rollback_err = tx:rollback()
            if rollback_err then return error_envelope.wrap_secondary(rollback_err, own_err, "converge: lifecycle rollback failed") end
            return own_err
        end
        local _, commit_err = tx:commit()
        if not commit_err then lifecycle_healed = true end
        return commit_err
    end
    local function quoted(value: string): string return "'" .. value:gsub("'", "''") .. "'" end
    local dbtype, type_err = db:type()
    if type_err then return finish(type_err) end
    local kinds = continuation and continuation.kinds or nil
    if not kinds then
        kinds = autoinit.declared_kinds()
        table.sort(kinds, function(a, b) return a.impl_id < b.impl_id end)
        for _, kind in ipairs(kinds) do
            kind.on_thread = type(kind.class) == "string" and kind.class ~= ""
            kind.own_lifecycle = false
            for _, decl in ipairs(kind.projections or {}) do
                local own = decl.on == autoinit.PROJECTION_ON.LIFECYCLE
                    and not lifecycle_log.is_exempt(tostring(kind.component_impl_id or kind.impl_id))
                local on_thread = decl.on == nil or decl.on == "" or decl.on == autoinit.PROJECTION_ON.THREAD
                decl.converge = own or on_thread
                kind.own_lifecycle = kind.own_lifecycle or own
                kind.on_thread = kind.on_thread or on_thread
                if decl.converge then
                    local expected, declaration_err = proj_register.declaration_body({worker_ref = decl.worker_ref,
                        worker_input_mode = decl.input_mode, worker_config = decl.worker_config, events = decl.events, drop_notify = decl.drop_notify})
                    if declaration_err then kind.declaration_error = declaration_err; break end
                    local digest, digest_err = proj_register.declaration_digest(expected, own and "lifecycle" or nil)
                    if digest_err then kind.declaration_error = digest_err; break end
                    decl.declaration_digest = digest
                    decl.declaration = {body = expected, digest = digest}
                end
            end
        end
    end
    local boundaries = continuation and continuation.boundaries or nil
    if not boundaries then
        local rows, scan_err = sql.builder.select("(SELECT component_id FROM kickside_components ORDER BY component_id DESC LIMIT 1) AS upper",
            "(SELECT id FROM kickside_projection ORDER BY id DESC LIMIT 1) AS projection_upper")
            :from("(SELECT 1) boundary"):run_with(db):query()
        if scan_err then return finish(errors.wrap(scan_err, "converge: boundary scan failed")) end
        if type(rows) ~= "table" or #rows ~= 1 then return finish(missing_result("boundary")) end
        if rows[1].upper == nil then return finish(nil) end
        boundaries = rows[1]
    end
    local positions = continuation and continuation.positions or {}
    local remaining, examination_remaining = 256, 4096
    local first = continuation and continuation.kind_index or 1
    local function resume(index: number): ({ [string]: any }, error?)
        summary.continuation = {kind_index = index, positions = positions, boundaries = boundaries, kinds = kinds}
        return finish(nil)
    end
    for offset = 0, #kinds - 1 do
        local index = (first + offset - 1) % #kinds + 1
        local kind = kinds[index]
        if positions[kind.impl_id] ~= false then
            local position = positions[kind.impl_id] or {ranges = {}, declaration = 1}
            positions[kind.impl_id] = position
            local seen: {[string]: boolean} = {}
            local function repair(component_id: string): error?
                if seen[component_id] then return nil end
                if kind.declaration_error then return kind.declaration_error end
                seen[component_id] = true
                remaining = remaining - 1
                summary.checked = summary.checked + 1
                local cause: error? = nil
                if kind.on_thread then
                    local executor, exec_err = converge_executor(component_id, opener_actor, opener_scope)
                    if exec_err or not executor then
                        cause = errors.wrap(exec_err or missing_result("executor"), "converge identity unavailable")
                    else
                        local _, converge_err = executor:call(CONVERGE_THREAD_FN, {component_id = component_id,
                            impl_id = kind.impl_id, thread_class = kind.class})
                        if converge_err then cause = errors.wrap(converge_err, "converge_thread failed") end
                    end
                end
                if not cause and kind.own_lifecycle then cause = converge_lifecycle(component_id, tostring(kind.impl_id), kind.projections) end
                if cause then
                    summary.skipped[#summary.skipped + 1] = {component_id = component_id, impl_id = kind.impl_id,
                        reason = cause:message(), error = error_envelope.encode(cause)}
                else summary.healed = summary.healed + 1 end
                return nil
            end
            local owner = "c.impl_id=" .. quoted(tostring(kind.component_impl_id or kind.impl_id))
                .. " AND c.component_id<=" .. quoted(tostring(boundaries.upper))
            if position.missing ~= false then
                local sources: {string} = {}
                local range = owner .. (position.missing and " AND c.component_id>" .. quoted(position.missing) or "")
                local function source(joins: string, predicate: string)
                    sources[#sources + 1] = "SELECT component_id FROM (SELECT c.component_id FROM kickside_components c " .. joins
                        .. " WHERE " .. range .. " AND " .. predicate .. " ORDER BY CAST(c.component_id AS TEXT)"
                        .. (kind.own_lifecycle and "" or " LIMIT " .. tostring(remaining)) .. ") missing" .. tostring(#sources + 1)
                end
                if type(kind.class) == "string" and kind.class ~= "" then
                    source("LEFT JOIN kickside_thread t ON t.id=c.component_id"
                        .. " LEFT JOIN kickside_component_meta type_meta ON type_meta.component_id=c.component_id AND type_meta.key='type'"
                        .. " LEFT JOIN kickside_component_meta class_meta ON class_meta.component_id=c.component_id AND class_meta.key='thread_class'",
                        "(t.id IS NULL OR t.thread_class<>" .. quoted(kind.class)
                        .. " OR type_meta.value IS NULL OR type_meta.value<>'thread' OR class_meta.value IS NULL OR class_meta.value<>t.thread_class)")
                end
                for _, decl in ipairs(kind.projections or {}) do
                    if decl.converge then
                        local own = decl.on == autoinit.PROJECTION_ON.LIFECYCLE
                        local key = type(decl.projection_key) == "string" and decl.projection_key ~= "" and decl.projection_key or proj_types.KEY_DEFAULT
                        local cursor_key = type(decl.cursor_key) == "string" and decl.cursor_key ~= "" and decl.cursor_key or proj_types.KEY_DEFAULT
                        local thread = "JOIN kickside_thread t ON t.id=c.component_id"
                        if own then
                            -- Lifecycle rows already carry their owner in attrs. A single
                            -- set join also finds components whose lifecycle row is absent.
                            thread = "LEFT JOIN lifecycle_threads t ON t.component_id=c.component_id"
                        end
                        source(thread .. " LEFT JOIN kickside_projection p ON p.thread_id=t.id AND p.kind=" .. quoted(decl.kind)
                            .. " AND p.projection_key=" .. quoted(key)
                            .. " LEFT JOIN kickside_projection_cursor pc ON pc.projection_id=p.id AND pc.cursor_key=" .. quoted(cursor_key)
                            .. " LEFT JOIN kickside_job j ON j.id=pc.job_id", "(p.id IS NULL OR pc.id IS NULL OR j.id IS NULL)")
                    end
                end
                if #sources > 0 then
                    local prefix = ""
                    if kind.own_lifecycle then
                        prefix = "WITH lifecycle_threads AS MATERIALIZED (SELECT id,"
                            .. (dbtype == "postgres" and "(attrs->>'component_id')::uuid" or "attrs->>'component_id'")
                            .. " AS component_id FROM kickside_thread WHERE thread_class="
                            .. quoted(lifecycle_log.class_for(tostring(kind.component_impl_id or kind.impl_id))) .. ") "
                    end
                    local rows = position.missing_rows
                    if not rows then
                        local query = sql.builder.select("DISTINCT component_id")
                            :from("(" .. prefix .. "SELECT component_id FROM (" .. table.concat(sources, " UNION ALL ") .. ") missing_set) missing")
                            :order_by("component_id")
                        if not kind.own_lifecycle then query = query:limit(remaining) end
                        local scan_err: error?
                        rows, scan_err = query:run_with(db):query()
                        if scan_err then return finish(errors.wrap(scan_err, "converge: existence scan failed")) end
                        if type(rows) ~= "table" then return finish(missing_result("scan")) end
                        if kind.own_lifecycle then position.missing_rows, position.missing_index = rows, 1 end
                    end
                    local limit = remaining
                    local start = position.missing_index or 1
                    local last = math.min(#rows, start + limit - 1)
                    for rindex = start, last do
                        local row = rows[rindex]
                        position.missing = tostring(row.component_id)
                        local cause = repair(tostring(row.component_id))
                        if cause then return finish(cause) end
                    end
                    if kind.own_lifecycle then
                        position.missing_index = last + 1
                        if last == #rows then position.missing, position.missing_rows = false, nil end
                    elseif #rows < limit then position.missing = false end
                    if remaining == 0 then return resume(index % #kinds + 1) end
                else position.missing = false end
            end
            for dindex = position.declaration, #(kind.projections or {}) do
                local decl = kind.projections[dindex]
                if decl.converge and boundaries.projection_upper ~= nil then
                    local key = type(decl.projection_key) == "string" and decl.projection_key ~= "" and decl.projection_key or proj_types.KEY_DEFAULT
                    local digest = decl.declaration_digest or ""
                    local predicates = {"declaration_digest<" .. quoted(digest), "declaration_digest>" .. quoted(digest), "declaration_digest IS NULL"}
                    local ranges: {string} = {}
                    for rindex, predicate in ipairs(predicates) do
                        local after = position.ranges[rindex]
                        if after then
                            if rindex == 3 then predicate = predicate .. " AND id>" .. quoted(after.id)
                            else predicate = predicate .. " AND (declaration_digest,id)>(" .. quoted(after.digest) .. "," .. quoted(after.id) .. ")" end
                        end
                        ranges[#ranges + 1] = "SELECT * FROM (SELECT id,thread_id,declaration_digest," .. tostring(rindex) .. " AS range_id"
                            .. " FROM kickside_projection WHERE kind=" .. quoted(decl.kind) .. " AND projection_key=" .. quoted(key)
                            .. " AND " .. predicate .. " AND id<=" .. quoted(tostring(boundaries.projection_upper))
                            .. " ORDER BY declaration_digest,id LIMIT " .. tostring(examination_remaining) .. ") range" .. tostring(rindex)
                    end
                    local own = decl.on == autoinit.PROJECTION_ON.LIFECYCLE
                    local query = "WITH candidates AS MATERIALIZED (SELECT * FROM (" .. table.concat(ranges, " UNION ALL ")
                        .. ") ranges ORDER BY range_id,declaration_digest,id LIMIT " .. tostring(examination_remaining) .. ")"
                        .. " SELECT p.id,p.declaration_digest,p.range_id,c.component_id FROM candidates p"
                        .. (own and " LEFT JOIN kickside_thread t ON t.id=p.thread_id" or "")
                        .. " LEFT JOIN kickside_components c ON c.component_id=" .. (own and (dbtype == "postgres" and "(t.attrs->>'component_id')::uuid" or "(t.attrs->>'component_id')") or "p.thread_id")
                        .. " AND " .. owner .. " ORDER BY p.range_id,p.declaration_digest,p.id"
                    local rows, scan_err = sql.builder.select("id,declaration_digest,range_id,component_id")
                        :from("(" .. query .. ") mismatches"):run_with(db):query()
                    if scan_err then return finish(errors.wrap(scan_err, "converge: declaration scan failed")) end
                    if type(rows) ~= "table" then return finish(missing_result("scan")) end
                    local limit = examination_remaining
                    for _, row in ipairs(rows) do
                        examination_remaining = examination_remaining - 1
                        position.ranges[tonumber(row.range_id)] = {id = tostring(row.id), digest = row.declaration_digest}
                        if row.component_id ~= nil then
                            local cause = repair(tostring(row.component_id))
                            if cause then return finish(cause) end
                        end
                        if remaining == 0 or examination_remaining == 0 then return resume(index % #kinds + 1) end
                    end
                    if #rows == limit then return resume(index % #kinds + 1) end
                end
                position.ranges, position.declaration = {}, dindex + 1
            end
            positions[kind.impl_id] = false
        end
    end
    for _, kind in ipairs(kinds) do
        if positions[kind.impl_id] ~= false then return resume(first) end
    end
    return finish(nil)
end

-- ensure_user materializes every user-scope declaration for the actor. Two owners
-- call it: the relay workspace plugin on interactive login, and the uploads process
-- worker at first ingest for non-interactive/bridge actors that never log in. The
-- actor owns the provisioned components; idempotent, so either owner converges.
function M.ensure_user(actor: any, scope: any, scope_key: string): ({ string }?, error?)
    return provision_scope(actor, scope, scope_key, autoinit.SCOPE.USER :: string)
end

-- ensure_system materializes every system-scope declaration (called once at boot under
-- a system actor, e.g. system:lifecycle). System singletons share the fixed
-- SYSTEM_SCOPE_KEY so the same components resolve on every boot, owned by the system
-- actor with whatever additional grants each declaration carries.
function M.ensure_system(actor: any, scope: any): ({ string }?, error?)
    return provision_scope(actor, scope, autoinit.SYSTEM_SCOPE_KEY :: string, autoinit.SCOPE.SYSTEM :: string)
end

return M
