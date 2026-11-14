-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local json = require("json")
local M = {builder = {}, plans = 0}
M.get = sql.get
function M.builder.select(columns: string): any
    local source, predicate, handle = "", "", nil
    local query = sql.builder.select(columns)
    local bound: any = nil
    local chain = {}
    function chain:from(value: string): any source = value; query = query:from(value); return self end
    function chain:where(value: string): any predicate = value; query = query:where(value); return self end
    function chain:order_by(value: string): any query = query:order_by(value); return self end
    function chain:limit(value: number): any query = query:limit(value); return self end
    function chain:run_with(value: any): any handle = value; bound = query:run_with(value); return self end
    function chain:query(): (any, error?)
        if predicate:find("declaration_digest", 1, true) then
            local postgres = handle:type() == "postgres"
            local prefix = postgres and "EXPLAIN (ANALYZE,FORMAT JSON) " or "EXPLAIN QUERY PLAN "
            local plan = assert(handle:query(prefix .. "SELECT " .. columns .. " FROM " .. source .. " WHERE " .. predicate))
            if postgres then
                local tree = assert(json.decode(plan[1]["QUERY PLAN"]))
                local function check(node: table)
                    assert((node["Actual Rows"] or 0) * (node["Actual Loops"] or 0) <= 256,
                        "population scan in bounded convergence: " .. assert(json.encode(node)))
                    assert((node["Rows Removed by Filter"] or 0) <= 256,
                        "population filter in bounded convergence: " .. assert(json.encode(node)))
                    for _, child in ipairs(node.Plans or {}) do check(child) end
                end
                check(tree[1].Plan)
            else
                for _, row in ipairs(plan) do
                    assert(not tostring(row.detail):find("SCAN ", 1, true) or row.detail == "SCAN c", assert(json.encode(plan)))
                    assert(not tostring(row.detail):find("TEMP B-TREE", 1, true), assert(json.encode(plan)))
                end
            end
            M.plans = M.plans + 1
        end
        return bound:query()
    end
    return chain
end
return M
