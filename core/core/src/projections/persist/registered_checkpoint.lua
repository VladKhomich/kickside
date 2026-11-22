-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local json = require("json")
local registry = require("registry")
local process = require("process")
local security = require("security")
local canonical_json = require("canonical_json")
local component_query = require("component_query")
local component_types = require("component_types")
local access_subjects = require("access_subjects")
local event_access = require("event_access")
local execution_identity = require("execution_identity")
local jobs_config = require("jobs_config")
local core_types = require("core_types")
local registration = require("registration")
local trim = require("text_trim").trim
local owned_worker = require("owned_worker")

local M = {}

local MAX_DESTINATIONS = 32

local function conflict(message: string): error
    return errors.new({kind = errors.CONFLICT, retryable = true, message = message})
end

local function invalid(message: string): error
    return errors.new({kind = errors.INVALID, retryable = false, message = message})
end

-- Configuration comes from the persisted declaration of the registered
-- projection. Only the package declaration can name its configuration field.
function M.destinations(declaration: any, config: any): ({string}?, error?)
    if type(declaration) ~= "table" or type(declaration.writer_ref) ~= "string"
        or type(declaration.target_db_config) ~= "string" or type(declaration.destinations_key) ~= "string"
        or declaration.destinations_key == "" then
        return nil, invalid("registered checkpoint declaration is invalid")
    end
    local declared = type(config) == "table" and config[declaration.destinations_key] or nil
    if type(declared) ~= "table" or #declared < 2 or #declared > MAX_DESTINATIONS then return nil, nil end
    local seen, ids = {}, {}
    for _, raw in ipairs(declared) do
        local id = trim(raw)
        if id ~= "" and not seen[id] then
            seen[id] = true
            ids[#ids + 1] = id
        end
    end
    if #ids < 2 then return nil, nil end
    return ids, nil
end

function M.select(declaration: table, ids: {string}, db_id: string, revision: any): (table?, error?)
    local entry, err = revision:get(declaration.target_db_config)
    if err then return nil, err end
    local target = entry and entry.kind == "registry.entry" and entry.meta
    if type(target) ~= "table" or type(target.db_id) ~= "string" or target.db_id == "" then
        return nil, invalid("registered checkpoint target database is not configured")
    end
    if target.db_id ~= db_id or jobs_config.db_id() ~= db_id then return nil, nil end
    return {writer_ref = declaration.writer_ref, config_id = declaration.target_db_config,
        db_id = target.db_id, destination_ids = ids}, nil
end

function M.filter(events: any): table?
    local input = type(events) == "table" and events.input or nil
    if type(input) ~= "table" then return nil end
    local filter = {}
    for _, shape in ipairs(input) do
        if type(shape) == "table" and type(shape.type) == "string" and shape.type ~= "" then
            filter[#filter + 1] = {type = shape.type}
        end
    end
    return #filter > 0 and filter or nil
end

function M.is_registered_identity(raw: any): boolean
    return registration.is_registered_checkpoint_principal(raw)
end

function M.same_package(snapshot: any, public_id: string, writer_id: string, config_id: string): error?
    local same, err = owned_worker.same_package(snapshot, public_id, writer_id, config_id)
    if err then return err end
    if not same then return event_access.denied() end
    return nil
end

function M.recheck_revision(expected: string): error?
    local live, err = registry.current_version()
    if err then return err end
    if not live or tostring(live:id()) ~= expected then
        return conflict("registered checkpoint registry changed")
    end
    return nil
end

function M.declaration_hash(body: table): (string?, error?)
    return canonical_json.hash(registration.declaration_fields(body))
end

function M.check_declaration(body: table, admission: table): (boolean?, error?)
    local digest, err = M.declaration_hash(body)
    if not digest then return nil, err end
    return digest == admission.declaration_hash, nil
end

local function same_identity(left: any, right: any): (boolean?, error?)
    if type(left) == "string" then
        local err
        left, err = json.decode(left)
        if err then return nil, err end
    end
    if type(right) == "string" then
        local err
        right, err = json.decode(right)
        if err then return nil, err end
    end
    local a, encode_err = canonical_json.encode(left)
    if encode_err then return nil, encode_err end
    local b, other_err = canonical_json.encode(right)
    if other_err then return nil, other_err end
    return a == b, nil
end

-- Rebuild the ACL queries from the live registered actor outside the SQL
-- transaction. Execute them only using its Component rows, never a worker input.
local function authorities(ids: table, source_id: string, read_mask: integer, actor: any): (table?, error?)
    local masks = {[source_id] = read_mask}
    for _, id in ipairs(ids) do masks[id] = (masks[id] or 0) + core_types.ACCESS.WRITE end
    local ordered = {}
    for id in pairs(masks) do ordered[#ordered + 1] = id end
    table.sort(ordered)
    local actor_id, actor_err = actor:id()
    if actor_err then return nil, actor_err end
    local subjects, subject_err = access_subjects.resolve(actor_id, actor)
    if subject_err then return nil, subject_err end
    local subject_sql, subject_args = access_subjects.subject_clause(subjects, "g")
    local checks = {}
    for _, id in ipairs(ordered) do
        local acl, err = component_query.snapshot_access(id, masks[id] :: integer, actor)
        if err or not acl then return nil, err or event_access.denied() end
        local statement, args = acl:to_sql()
        checks[#checks + 1] = {id = id, statement = statement, args = args or {},
            mask = masks[id], subject_sql = subject_sql, subject_args = subject_args}
    end
    return checks, nil
end

-- PostgreSQL Component rows fence moves and incarnations. Lock the grant rows
-- that supply the required bits as well, so a concurrent revoke waits or is
-- observed by this publication. SQLite serializes grant and publication writes.
local function lock_grants(tx: any, checks: table): error?
    local tables = component_types.TABLES
    local requested, args = {}, {}
    for _, check in ipairs(checks) do
        requested[#requested + 1] = "(CAST(? AS UUID), CAST(? AS INTEGER))"
        args[#args + 1] = check.id
        args[#args + 1] = check.mask
    end
    local first = checks[1]
    local statement = "WITH requested(component_id,required_mask) AS (VALUES " .. table.concat(requested, ",") .. "),"
        .. " ancestors AS (SELECT a.ancestor_id, r.component_id, r.required_mask FROM " .. tables.ANCESTOR
        .. " a JOIN requested r ON r.component_id = a.component_id WHERE a.depth > 0),"
        .. " grants AS (SELECT g.component_id,g.access_mask FROM " .. tables.ACCESS .. " g WHERE " .. first.subject_sql
        .. " AND (g.component_id IN (SELECT component_id FROM requested) OR g.component_id IN (SELECT ancestor_id FROM ancestors))"
        .. " ORDER BY g.access_id FOR SHARE OF g),"
        .. " reached AS (SELECT r.component_id,r.required_mask,g.access_mask FROM requested r JOIN grants g USING (component_id)"
        .. " UNION ALL SELECT a.component_id,a.required_mask,g.access_mask FROM ancestors a JOIN grants g ON g.component_id=a.ancestor_id)"
        .. " SELECT COUNT(*) AS allowed FROM (SELECT component_id FROM reached GROUP BY component_id,required_mask"
        .. " HAVING (bit_or(access_mask) & required_mask) = required_mask) permitted"
    for _, arg in ipairs(first.subject_args) do args[#args + 1] = arg end
    local rows, err = tx:query(access_subjects.numbered(statement), args)
    if err then return err end
    if not rows or not rows[1] or tonumber(rows[1].allowed) ~= #checks then return event_access.denied() end
    return nil
end

local function read_components(db: any, checks: table, lock: boolean): (table?, error?)
    local observed = {}
    for _, check in ipairs(checks) do
        local query = sql.builder.select("impl_id", "CAST(created_at AS TEXT) AS incarnation", "identity_generation")
            :from("kickside_components")
            :where("component_id IN (" .. check.statement .. ") AND deleting_at IS NULL", table.unpack(check.args))
        if lock then query = query:suffix("FOR SHARE") end
        local rows, err = query:run_with(db):query()
        if err then return nil, err end
        if type(rows) ~= "table" or not rows[1] then return nil, event_access.denied() end
        observed[check.id] = rows[1]
    end
    return observed, nil
end

local function owner_matches(observed: any, owner: table, impl_id: string): boolean
    return observed ~= nil and observed.impl_id == impl_id and observed.incarnation == owner.incarnation
        and tonumber(observed.identity_generation) == owner.generation
end

function M.capture(db_id: string, admission: table, current: table, actor: any, read_mask: integer,
        empty: boolean?): (table?, error?)
    local checks, check_err = authorities(empty and {} or admission.destination_ids, current.component_id, read_mask, actor)
    if not checks then return nil, check_err end
    local db, err = sql.get(db_id)
    if not db then return nil, err end
    local observed, read_err = read_components(db, checks, false)
    local _, release_err = db:release()
    if not observed or release_err then return nil, read_err or release_err end
    if not owner_matches(observed[current.component_id], admission.owner, current.component_impl_id) then
        return nil, conflict("registered checkpoint source changed before preparation")
    end
    admission.components = observed
    admission.read_mask = read_mask
    return {checks = checks, admission = admission, filter = admission.filter}, nil
end

-- Resolve protected output authority from the installed declaration in the
-- writer's original process frame, using the revision admitted by the supervisor.
local function protected_outputs(revision: any, spec: table, admission: table, ids: {string}): (table?, error?)
    local outputs = spec.protected_outputs
    if outputs == nil then return nil, nil end
    if type(outputs) ~= "table" then return nil, invalid("registered checkpoint protected_outputs must be an array") end
    local writer, writer_err = process.id()
    if writer_err then return nil, writer_err end
    if not writer or "proc://" .. writer ~= admission.writer_ref then
        return nil, errors.new({kind = errors.PERMISSION_DENIED,
            message = "registered checkpoint writer differs from its admitted native entry"})
    end
    local entry, entry_err = revision:get(writer)
    if entry_err then return nil, entry_err end
    local meta = entry and entry.meta
    if not entry or entry.kind ~= "process.lua" or type(meta) ~= "table"
        or meta.private ~= true or meta.registered_checkpoint_writer ~= true then
        return nil, event_access.denied()
    end
    local events = {}
    for index, id in pairs(outputs) do
        if type(index) ~= "number" or index < 1 or index > #outputs or index ~= math.floor(index)
            or type(id) ~= "string" or not string.match(id, "^[^:%s%*]+:[^:%s%*]+$") or events[id] then
            return nil, invalid("registered checkpoint protected_outputs must contain unique exact event IDs")
        end
        local event, event_err = revision:get(id)
        if event_err then return nil, event_err end
        if not event or event.kind ~= "registry.entry" or type(event.meta) ~= "table"
            or event.meta.type ~= "kickside.core.threads.event" then
            return nil, invalid("registered checkpoint protected output must name a thread event")
        end
        local package_err = M.same_package(revision, admission.public_target_id, writer, id)
        if package_err then return nil, package_err end
        events[id] = true
    end
    local destinations = {}
    for _, id in ipairs(ids) do destinations[string.lower(id)] = true end
    return {events = events, destinations = destinations, revision = revision}, nil
end

function M.authorize(proof: table, snapshot: table, db_id: string): (table?, error?)
    local admission = proof.registered
    if type(admission) ~= "table" or admission.db_id ~= db_id or proof.cursor_id ~= snapshot.id
        or admission.projection_id ~= snapshot.projection_id or admission.thread_id ~= snapshot.thread_id
        or admission.thread_incarnation ~= snapshot.thread_incarnation
        or admission.actor_id ~= snapshot.actor_id or admission.generation ~= snapshot.generation
        or proof.owner.component_id ~= snapshot.component_id or proof.owner.incarnation ~= snapshot.component_incarnation
        or admission.component_impl_id ~= snapshot.component_impl_id
        or not M.is_registered_identity(snapshot.execution_identity_json)
        or type(snapshot.body) ~= "table" or type(snapshot.body.meta) ~= "table"
        or type(snapshot.body.events) ~= "table" or type(snapshot.body.events.input) ~= "table" then
        return nil, invalid("registered checkpoint does not match its assigned projection")
    end
    local declared, declaration_err = M.check_declaration(snapshot.body, admission)
    if declaration_err then return nil, declaration_err end
    if not declared then return nil, invalid("registered checkpoint does not match its assigned projection") end
    local same, compare_err = same_identity(admission.actor_context, snapshot.execution_identity_json)
    if compare_err then return nil, compare_err end
    if not same then return nil, event_access.denied() end
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    if not actor or actor:id() ~= admission.actor_id then return nil, event_access.denied() end
    local revision_err = M.recheck_revision(admission.revision)
    if revision_err then return nil, revision_err end
    local entry, entry_err = registry.get(admission.public_target_id)
    if entry_err then return nil, entry_err end
    local spec = entry and entry.meta and entry.meta.registered_checkpoint
    local revision
    if type(spec) == "table" and spec.protected_outputs ~= nil then
        local snapshot_err
        revision, snapshot_err = registry.snapshot()
        if snapshot_err then return nil, snapshot_err end
        if not revision or tostring(revision:version():id()) ~= admission.revision then
            return nil, conflict("registered checkpoint registry changed")
        end
        entry, entry_err = revision:get(admission.public_target_id)
        if entry_err then return nil, entry_err end
        spec = entry and entry.meta and entry.meta.registered_checkpoint
    end
    if type(spec) ~= "table" or spec.writer_ref ~= admission.writer_ref or spec.target_db_config ~= admission.config_id
        or snapshot.body.meta.worker_ref ~= "proc://" .. admission.public_target_id then
        return nil, conflict("registered checkpoint writer declaration changed")
    end
    local ids, ids_err = M.destinations(spec, snapshot.body.worker_config)
    if not ids then return nil, ids_err or event_access.denied() end
    local protected
    if revision then
        local protected_err
        protected, protected_err = protected_outputs(revision, spec, admission, ids)
        if protected_err then return nil, protected_err end
    end
    local filter = M.filter(snapshot.body.events)
    if not filter then return nil, invalid("registered checkpoint requires a stored input filter") end
    local identity, identity_err = execution_identity.from_row(admission.actor_id, admission.actor_context)
    if not identity then return nil, identity_err or event_access.denied() end
    local authorized, authorize_err = execution_identity.authorize(identity,
        {deferred_owner = "kickside.core.projections:tick", execution_root = identity.component_id})
    if not authorized then return nil, authorize_err or event_access.denied() end
    -- ACL predicates need the newly resolved actor metadata. The writer
    -- keeps the original execution frame, including its credential scope.
    local live_actor = {
        id = function() return authorized.actor_id end,
        meta = function() return authorized.meta end,
    }
    local checks, err = authorities(ids, snapshot.component_id, admission.read_mask, live_actor)
    if not checks then return nil, err end
    return {checks = checks, admission = admission, filter = filter, protected = protected}, nil
end

function M.check_offer(inputs: any, manifest: table, last: number): error?
    if type(inputs) ~= "table" then return invalid("registered checkpoint has no input assignment") end
    local consumed = 0
    for _, offered in ipairs(inputs) do
        if offered.seq > last then break end
        consumed = consumed + 1
        local accepted = manifest[consumed]
        if type(accepted) ~= "table" or offered.id ~= accepted.id or offered.seq ~= accepted.seq then
            return conflict("registered checkpoint does not match the input assignment")
        end
    end
    if consumed ~= #manifest then return conflict("registered checkpoint does not match the input assignment") end
    return nil
end

function M.lock(tx: any, dbtype: string, authority: table): error?
    local postgres = dbtype == sql.type.POSTGRES
    local current, err = read_components(tx, authority.checks, postgres)
    if not current then return err end
    local expected = authority.admission.components
    for id, row in pairs(current) do
        local component = expected[id]
        if not component or component.impl_id ~= row.impl_id or component.incarnation ~= row.incarnation
            or component.identity_generation ~= row.identity_generation then
            return conflict("registered checkpoint component changed during preparation")
        end
    end
    if postgres then return lock_grants(tx, authority.checks) end
    return nil
end

function M.check_cursor(current: table, authority: table): error?
    local admission = authority.admission
    local stored = current.registered_declaration
    if type(stored) == "string" then
        local err
        stored, err = json.decode(stored)
        if err then return err end
    end
    if current.actor_id ~= admission.actor_id or type(stored) ~= "table" then
        return conflict("registered checkpoint declaration changed during preparation")
    end
    local declared, declaration_err = M.check_declaration(stored, admission)
    if declaration_err then return declaration_err end
    if not declared then return conflict("registered checkpoint declaration changed during preparation") end
    local same, compare_err = same_identity(current.execution_identity_json, admission.actor_context)
    if compare_err then return compare_err end
    if not same then return conflict("registered checkpoint actor changed during preparation") end
    return nil
end

return M
