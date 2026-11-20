-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Installed component materializers take input authority from their primary
-- declaration and effect authority from the worker's own service-only policies.
local autoinit = require("autoinit")
local event_access = require("event_access")
local lifecycle = require("lifecycle")
local register = require("register")
local security = require("security")
local trim = require("text_trim").trim

local M = {}

local ACTOR = "kickside.core:component_projection"

function M.core_lifecycle(impl_id: string, thread_id: string, kind: string, target_id: string): boolean
    return kind == "lifecycle.reap" and target_id == "kickside.core.lifecycle:reaper"
        and impl_id == "kickside.core.lifecycle:system_lifecycle" and thread_id == lifecycle.thread_id()
end

local function metadata(entry: any): table
    return type(entry) == "table" and type(entry.meta) == "table" and entry.meta or {}
end

-- Wippy records this owner outside the author-editable registry entry. Its
-- state API is also authoritative for locked workspace source replacements.
local owners_revision: string? = nil
local owners: {[string]: string} = {}
local function entry_owners(snapshot: any): ({[string]: string}?, error?)
    local revision = tostring(snapshot:version():id())
    if revision ~= owners_revision then
        local state, err = snapshot:state()
        if err then return nil, err end
        if type(state) ~= "table" or type(state.entries) ~= "table" then return nil, event_access.denied() end
        local loaded: {[string]: string} = {}
        for _, entry in ipairs(state.entries) do
            local registry = entry.registry
            if type(registry) == "table" and type(registry.owner) == "string" and registry.owner ~= "" then
                loaded[tostring(entry.id)] = registry.owner
            end
        end
        owners, owners_revision = loaded, revision
    end
    return owners, nil
end

local function scope_entries(snapshot: any, kind: any, target: any): (boolean?, error?)
    local by_id, owner_err = entry_owners(snapshot)
    if owner_err then return nil, owner_err end
    if not by_id then return nil, event_access.denied() end
    local authority = by_id[tostring(kind.id)]
    if not authority or authority ~= by_id[tostring(target.id)] then return nil, event_access.denied() end
    local data = type(target.data) == "table" and target.data or {}
    local config = target.security or data.security
    local policies = type(config) == "table" and config.policies or {}
    for _, id in ipairs(policies) do
        if by_id[id] ~= authority then return nil, event_access.denied() end
    end
    return true, nil
end

function M.check_package(snapshot: any, impl_id: string, target_id: string): (boolean?, error?)
    local kind, err = snapshot:get(impl_id)
    if err then return nil, err end
    local target, target_err = snapshot:get(target_id)
    if target_err then return nil, target_err end
    if not kind or kind.kind ~= "contract.binding" or not target or target.kind ~= "function.lua" then
        return nil, event_access.denied()
    end
    return scope_entries(snapshot, kind, target)
end

local function matches(row: table, declaration: table): (boolean, error?)
    local on = declaration.on
    if (on ~= nil and on ~= "" and on ~= autoinit.PROJECTION_ON.THREAD)
        or declaration.input_mode ~= "prefetch_events"
        or trim(declaration.kind) ~= row.kind
        or register.declaration_key(declaration.projection_key) ~= row.projection_key
        or register.declaration_key(declaration.cursor_key) ~= row.cursor_key
        or (declaration.debounce_idle_ms or 0) ~= tonumber(row.debounce_idle_ms)
        or (declaration.debounce_max_ms or 0) ~= tonumber(row.debounce_max_ms) then
        return false, nil
    end
    local body, err = register.declaration_body({worker_ref = declaration.worker_ref,
        worker_input_mode = declaration.input_mode, worker_config = declaration.worker_config, events = declaration.events})
    if err then return false, err end
    return body ~= nil and register.declaration_matches(row.body, body), nil
end

-- Apply the identical installed binding restriction to actor-qualified callers
-- of a marked worker. They continue to use their saved principal for source ACLs.
function M.check(snapshot: any, row: table, target_id: string): (boolean?, error?)
    local component_id = row.component_id
    if type(component_id) ~= "string" or component_id == "" or component_id ~= row.thread_id
        or type(row.component_incarnation) ~= "string" then
        return nil, event_access.denied()
    end
    local kind, kind_err = snapshot:get(row.component_impl_id)
    if kind_err and not errors.is(kind_err, errors.NOT_FOUND) then return nil, kind_err end
    if not kind or kind.kind ~= "contract.binding" then return nil, event_access.denied() end
    local kind_meta = metadata(kind)
    local thread = kind_meta.thread
    if type(thread) == "table" and thread.class ~= row.thread_class then return nil, event_access.denied() end

    local target, target_err = snapshot:get(target_id)
    if target_err and not errors.is(target_err, errors.NOT_FOUND) then return nil, target_err end
    if not target or target.kind ~= "function.lua" then return nil, event_access.denied() end
    local target_meta = metadata(target)
    if target_meta.type ~= "projection.worker" or target_meta.component_owned ~= true or target_meta.post_commit_ref ~= nil then
        return nil, event_access.denied()
    end
    for _, declaration in ipairs(autoinit.parse_projections(kind_meta.projections)) do
        local eligible, err = matches(row, declaration)
        if err then return nil, err end
        if eligible then return scope_entries(snapshot, kind, target) end
    end
    return nil, event_access.denied()
end

function M.frame(row: table): (table?, table?, error?)
    local generation = tonumber(row.component_identity_generation)
    if tonumber(row.component_owned_candidate) ~= 1 or generation == nil then return nil, nil, event_access.denied() end
    -- The worker is called under an empty caller scope. Wippy attaches the
    -- worker's separately validated service-only policies when it enters.
    local actor, actor_err = security.new_actor(ACTOR)
    if actor_err then return nil, nil, actor_err end
    local scope, scope_err = security.new_scope({})
    if scope_err then return nil, nil, scope_err end
    return {actor = actor, scope = scope},
        {component_id = row.component_id, generation = generation, incarnation = row.component_incarnation}, nil
end

return M
