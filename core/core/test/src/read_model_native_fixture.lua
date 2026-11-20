local json = require("json")
local M = {stage = "", source = nil, rows = {}, gets = 0, queries = 0, releases = 0, decodes = 0, accesses = 0}
function M.reset(stage: string, source: any, rows: any)
    M.stage, M.source, M.rows = stage, source, rows
    M.gets, M.queries, M.releases, M.decodes, M.accesses = 0, 0, 0, 0, 0
end
function M.has_access(owner: string, mask: any): (boolean?, error?)
    M.accesses = M.accesses + 1
    if M.stage == "access" then return nil, M.source end
    if M.stage == "denied" then return false, nil end
    return true, nil
end
local db = {}
function db:type(): (string, error?) return "sqlite", nil end
function db:query(statement: string, args: any): (any, error?)
    M.queries = M.queries + 1
    if M.stage == "query" then return nil, M.source end
    local row = {component_id = "component", component_impl_id = "kickside.core:thread",
        component_incarnation = "test-component", thread_incarnation = "test-thread"}
    if statement:find("WITH eligible", 1, true) then
        M.accesses = M.accesses + 1
        if M.stage == "access" then return nil, M.source end
        row.payload_allowed = M.stage == "denied" and 0 or 1
        if row.payload_allowed == 1 then row.body = M.rows[1] and M.rows[1].body or nil end
    end
    return {row}, nil
end
function db:release() M.releases = M.releases + 1 end
function M.get(id: string): (any, error?)
    M.gets = M.gets + 1
    if M.stage == "get" then return nil, M.source end
    return db, nil
end
function M.decode(value: string): (any, error?)
    M.decodes = M.decodes + 1
    if M.stage == "decode" then return nil, M.source end
    local decoded, err = json.decode(value)
    M.source = err
    return decoded, err
end
return M
