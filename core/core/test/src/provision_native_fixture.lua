local M = {stage = "", source = nil, gets = 0, queries = 0, releases = 0,
    upserts = 0, retentions = 0, grants = 0, calls = 0, contract_gets = 0, opens = 0}
function M.new_actor(id: string, meta: any): any
    return {id = function(): string return id end, meta = function(): any return meta end}
end
M.actor = M.new_actor("user", {})
M.scope = {evaluate = function(self: any, actor: any, action: string, resource: string): string
    return M.scope_decision or "allow"
end}
function M.converge(db: any, skipped: {any}, continuation: table?): (integer?, error?, table?)
    return 0, nil, nil
end
function M.reset(stage: string, source: any)
    M.stage, M.source, M.release_source, M.grant_result = stage, source, nil, nil
    M.scope_decision = nil
    M.gets, M.queries, M.releases, M.upserts = 0, 0, 0, 0
    M.retentions, M.grants, M.calls, M.contract_gets, M.opens = 0, 0, 0, 0, 0, 0
end
local db = {}
function db:release(): (boolean?, error?)
    M.releases = M.releases + 1
    if M.stage == "release" or M.stage == "retention_release" or M.stage == "thread_scan_release" then return nil, M.release_source or M.source end
    return true, nil
end
function M.get(id: string): (any, error?)
    M.gets = M.gets + 1
    if M.stage == "get" then return nil, M.source end
    if M.stage == "missing_get" then return nil, nil end
    return db, nil
end
local svc = {}
function svc:with_actor(actor: any): any return self end
function svc:with_scope(scope: any): any return self end
function svc:open(): (any, error?)
    M.opens = M.opens + 1
    local stage = M.opens == 1 and "threads_open" or "grants_open"
    if M.stage == stage then return nil, M.source end
    if M.stage == "missing_" .. stage then return nil, nil end
    return self, nil
end
function svc:upsert(input: table): (any, error?)
    M.upserts = M.upserts + 1
    if M.stage == "upsert" then return nil, M.source end
    return {thread_id = input.thread_id}, nil
end
function svc:grant_subtree(input: table): (any, error?)
    M.grants = M.grants + 1
    if M.stage == "grant_proof" then return M.grant_result, nil end
    if M.stage == "grant" then return nil, M.source end
    if M.stage == "grant_envelope" then
        return {success = false, error = M.source:message(), kind = M.source:kind(),
            retryable = M.source:retryable(), details = M.source:details()}, nil
    end
    return {success = true}, nil
end
function M.contract_get(id: string): (any, error?)
    M.contract_gets = M.contract_gets + 1
    local stage = M.contract_gets == 1 and "threads_get" or "grants_get"
    if M.stage == stage then return nil, M.source end
    if M.stage == "missing_" .. stage then return nil, nil end
    return svc, nil
end
function M.retention_upsert(handle: any, component_id: string, windows: table): (any, error?)
    M.retentions = M.retentions + 1
    if M.stage == "retention" or M.stage == "retention_release" then return nil, M.source end
    return {}, nil
end
function M.declarations(): {any}
    return {{scope = "user", class = "class", impl_id = "impl", retention = {event_days = 7}, grants = {{subject_id = "reader", access_mask = 1}}}}
end
function M.declared_kinds(): {any}
    return {{class = "class", impl_id = "impl", projections = {{kind = "projection", worker_ref = "func://app:test_count_worker"}}}}
end
function db:type(): string return "sqlite" end
function db:query(statement: string, args: table): (table?, error?)
    M.queries = M.queries + 1
    if M.stage == "page_budget" then
        if statement:find("AS upper", 1, true) then return {{upper = "260"}}, nil end
        local rows = {}
        if statement:find("FROM kickside_components", 1, true) then
            local after = #args == 4 and tonumber(args[3]) or 0
            for index = after + 1, math.min(after + args[#args], 260) do
                rows[#rows + 1] = {component_id = tostring(index)}
            end
        else
            local projection = statement:find("JOIN kickside_projection", 1, true)
            for index = 1, #args - (projection and 3 or 0) do
                local id = args[index]
                rows[#rows + 1] = {component_id = id, thread_id = id, thread_class = "class",
                    component_type = "thread", component_class = "class", job_id = id ~= "260" and "job" or nil}
            end
        end
        return rows, nil
    end
    if statement:find("FROM kickside_projection", 1, true) or statement:find("JOIN kickside_projection", 1, true) then
        if M.stage == "projection_scan" then return nil, M.source end
        return {{component_id = "component"}}, nil
    end
    if statement:find("AS upper", 1, true) then return {{upper = "component"}}, nil end
    if statement:find("FROM kickside_components", 1, true) then return {{component_id = "component"}}, nil end
    if M.stage == "thread_scan" or M.stage == "thread_scan_release" then return nil, M.source end
    return {{component_id = "component", thread_id = "component", thread_class = "old"}}, nil
end
function M.execution_identity_of(component_id: string): (any, error?)
    if M.stage == "identity" then return nil, M.source end
    if M.stage == "bind" then return {}, nil end
    return nil, nil
end
local executor = {}
function executor:with_actor(actor: any): (any, error?)
    if M.stage == "actor" then return nil, M.source end
    if M.stage == "missing_actor" then return nil, nil end
    return self, nil
end
function executor:with_scope(scope: any): (any, error?)
    if M.stage == "scope" then return nil, M.source end
    if M.stage == "missing_scope" then return nil, nil end
    return self, nil
end
function executor:call(target: string, input: table): (any, error?)
    M.calls = M.calls + 1
    if M.stage == "call" then return nil, M.source end
    return {}, nil
end
function M.new(): any return executor end
function M.bind(stored: table, options: table): (any, error?) return nil, M.source end
return M
