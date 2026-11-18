local M = {method = "", stage = "", source = nil, dialect = "",
    policies = 0, types = 0, queries = 0, prunes = 0, purges = 0, responses = {}}
function M.reset(method: string, stage: string, source: any, dialect: string)
    M.method, M.stage, M.source, M.dialect = method, stage, source, dialect
    M.responses = {}
    M.policies, M.types, M.queries, M.prunes, M.purges = 0, 0, 0, 0, 0
end
function M.policy(): (any, error?)
    M.policies = M.policies + 1
    if M.stage == "policy" then return nil, M.source end
    if M.responses.policy then return M.responses.policy.value, nil end
    return {events_ms = 86400000, receipts_orphan_ms = 86400000, batch_events = 5, batch_receipts = 5}, nil
end
function M.prune(db: any, thread_id: string, opts: table): (any, error?)
    M.prunes = M.prunes + 1
    if M.stage == "prune" then return nil, M.source end
    if M.responses.prune then return M.responses.prune.value, nil end
    return {deleted = 1, max_pruned_seq = 1}, nil
end
function M.purge(db: any, cutoff: string, limit: integer): (any, error?)
    M.purges = M.purges + 1
    if M.stage == "purge" then return nil, M.source end
    if M.responses.purge then return M.responses.purge.value, nil end
    return {deleted = 0}, nil
end
function M.database(): any
    local db = {
        type = function(_self: any): (string?, error?)
            M.types = M.types + 1
            if M.stage == "type" then return nil, M.source end
            if M.responses.type then return M.responses.type.value, nil end
            return M.dialect, nil
        end,
        query = function(_self: any, statement: string, params: table?): (any, error?)
            M.queries = M.queries + 1
            local kind = statement:find("SELECT completed_at", 1, true) and "receipts" or "heads"
            if M.stage == kind then return nil, M.source end
            local response = M.responses[kind]
            if response then return response.value, nil end
            if kind == "receipts" then return {{completed_at = "2000-01-01T00:00:00Z"}}, nil end
            return {{id = "thread",
                eligibility_ms = 1000, head_created_at = "2000-01-01 00:00:00"}}, nil
        end,
    }
    db.begin = function(_self: any): (any, error?)
        return {query = db.query, execute = function() return {rows_affected = 0}, nil end,
            rollback = function() return true, nil end}, nil
    end
    return db
end
return M
