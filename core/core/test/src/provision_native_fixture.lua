local M = {stage = "", source = nil, gets = 0, queries = 0, releases = 0,
    upserts = 0, retentions = 0, grants = 0, calls = 0, contract_gets = 0, opens = 0}
M.scope = {evaluate = function(self: any, actor: any, action: string, resource: string): string
    return M.scope_decision or "allow"
end}
function M.reset(stage: string, source: any)
    M.stage, M.source, M.release_source, M.grant_result = stage, source, nil, nil
    M.scope_decision, M.unchanged_count, M.changed_count, M.max_page = nil, nil, nil, 0
    M.lifecycle, M.wakes, M.kind_loads = false, 0, 0
    M.require_window, M.two_kinds = false, false
    M.changed_stride, M.repair_ids = nil, {}
    M.gets, M.queries, M.releases, M.upserts = 0, 0, 0, 0
    M.retentions, M.grants, M.calls, M.contract_gets, M.opens = 0, 0, 0, 0, 0, 0
end
local db = {}
function db:type(): string return "sqlite" end
function db:begin(): any return {commit = function(): boolean return true end} end
function M.converge_own(tx: any, dialect: string, id: string, impl: string): (string?, error?)
    M.calls = M.calls + 1
    return id, nil
end
function M.committed(): (table?, error?)
    M.wakes = M.wakes + 1
    return {}, nil
end
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
    M.kind_loads = M.kind_loads + 1
    local result = {{class = not M.lifecycle and "class" or nil, impl_id = "impl", projections = {{kind = "projection",
        on = M.lifecycle and "lifecycle" or nil, worker_ref = "func://app:test_count_worker"}}}}
    if M.two_kinds then result[2] = {impl_id = "later", class = "class", projections = result[1].projections} end
    return result
end
M.builder = {}
function M.builder.select(columns: string, ...: any): any
    local chain = {}
    local source = ""
    local boundary = columns:find("AS upper", 1, true) ~= nil
    function chain:from(value: string): any source = value; return self end
    function chain:where(value: string, argument: any?): any return self end
    function chain:order_by(value: string): any return self end
    function chain:limit(value: number): any return self end
    function chain:run_with(handle: any): any return self end
    function chain:query(): (any, error?)
        M.queries = M.queries + 1
        local digest_scan = source:find("declaration_digest", 1, true) ~= nil
        if ((M.stage == "thread_scan" or M.stage == "thread_scan_release") and M.queries == 1)
            or (M.stage == "projection_scan" and source:find("kickside_projection", 1, true) ~= nil) then return nil, M.source end
        local count = M.changed_count or M.unchanged_count
        if boundary then
            local upper = count and string.format("%06d", count) or "component"
            return {{upper = upper, projection_upper = upper}}, nil
        end
        if M.require_window then
            assert(source:find("LIMIT ", 1, true), "each divergence source is limited before union and sorting")
            if digest_scan then
                assert(not source:find("SELECT component_id FROM kickside_components", 1, true),
                    "digest queries never visit unchanged component windows")
            end
        end
        if not digest_scan then return count and {} or {{component_id = "component"}}, nil end
        if not count or M.unchanged_count then return {}, nil end
        local after = tonumber((source:match("declaration_digest,id%)>%('[^']*','(%d+)'%)"))) or 0
        local upper = tonumber((source:match("id<='(%d+)'"))) or count
        local page_size = assert(tonumber((source:match("LIMIT (%d+)"))))
        assert(page_size <= 4096, "mismatch examination is bounded independently of repairs")
        local later = source:find("c.impl_id='later'", 1, true) ~= nil
        local rows = {}
        for index = after + 1, math.min(upper, later and 1 or count) do
            if not M.changed_stride or index % M.changed_stride == 0 then
                local id = string.format("%06d", index)
                rows[#rows + 1] = {id = id, declaration_digest = "old", range_id = 1, component_id = id}
                if #rows == page_size then break end
            end
        end
        M.max_page = math.max(M.max_page, #rows)
        return rows, nil
    end
    return chain
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
    M.repair_ids[#M.repair_ids + 1] = input.component_id
    M.calls = M.calls + 1
    if M.stage == "call" then return nil, M.source end
    return {}, nil
end
function M.new(): any return executor end
function M.bind(stored: table, options: table): (any, error?) return nil, M.source end
return M
