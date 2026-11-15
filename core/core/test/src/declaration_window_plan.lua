-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local json = require("json")
local fs = require("fs")
local M = {builder = {}, plans = 0, growth = 0}
M.get = sql.get
function M.builder.select(...: string): any
    local columns = table.concat({...}, ",")
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
        if M.growth < 0 and (source .. predicate):find("declaration_digest", 1, true) then
            assert(not source:find(" AND id<=", 1, true),
                "post-boundary entries cannot be discarded ahead of the examined-entry limit")
        end
        if (columns .. source .. predicate):find("declaration_digest", 1, true) then
            local postgres = handle:type() == "postgres"
            assert(not source:find("SELECT component_id FROM kickside_components", 1, true),
                "digest maintenance seeks mismatches without materializing unchanged components")
            local prefix = postgres and "EXPLAIN (ANALYZE,FORMAT JSON) " or "EXPLAIN QUERY PLAN "
            local plan = assert(handle:query(prefix .. "SELECT " .. columns .. " FROM " .. source .. (predicate ~= "" and " WHERE " .. predicate or "")))
            if postgres then
                local tree = assert(json.decode(plan[1]["QUERY PLAN"]))
                local function check(node: table)
                    assert((node["Actual Loops"] or 0) <= 1,
                        "per-component probe in set-oriented convergence: " .. assert(json.encode(node)))
                    assert((node["Actual Rows"] or 0) * (node["Actual Loops"] or 0) <= 4096,
                        "population scan in bounded convergence: " .. assert(json.encode(node)))
                    assert((node["Rows Removed by Filter"] or 0) <= 4096,
                        "population filter in bounded convergence: " .. assert(json.encode(node)))
                    for _, child in ipairs(node.Plans or {}) do check(child) end
                end
                check(tree[1].Plan)
            else
                for _, row in ipairs(plan) do
                    local detail = tostring(row.detail)
                    local boundary = columns:find("AS upper", 1, true) ~= nil
                    assert(not detail:find("SCAN kickside_", 1, true)
                        or (boundary and detail:find("USING COVERING INDEX sqlite_autoindex_", 1, true)), assert(json.encode(plan)))
                    if M.growth < 0 and detail:find("idx_projection_declaration_digest", 1, true) then
                        assert(detail:find("(declaration_digest,id)<", 1, true),
                            "the index stops at the captured tuple rather than filtering beyond it: " .. detail)
                    end
                end
            end
            local encoded = assert(json.encode(plan))
            assert(encoded:find("idx_projection_declaration_digest", 1, true),
                "mismatch ranges use the declaration index: " .. encoded)
            if M.growth < 0 then
                local storage = assert(fs.get("app:uploads"))
                assert(storage:writefile("declaration-growth-" .. (postgres and "postgres" or "sqlite") .. ".json",
                    assert(json.encode({query = "SELECT " .. columns .. " FROM " .. source, plan = plan}))))
            end
            M.plans = M.plans + 1
        end
        local rows, err = bound:query()
        if not err and columns:find("AS upper", 1, true) and M.growth > 0 then
            local count = M.growth
            local postgres = handle:type() == "postgres"
            local sequence = postgres and ("SELECT generate_series(1," .. count .. ") AS n")
                or ("WITH RECURSIVE series(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM series WHERE n<" .. count .. ") SELECT n FROM series")
            local id = "'ffffffff-ffff-4fff-8fff-' || " .. (postgres and "lpad(n::text,12,'0')" or "printf('%012d',n)")
            if postgres then id = "(" .. id .. ")::uuid" end
            local tx = assert(handle:begin())
            assert(tx:execute("INSERT INTO kickside_thread(id,component_id,thread_class) SELECT " .. id .. "," .. id .. ",'plan.growth' FROM (" .. sequence .. ") series"))
            assert(tx:execute("INSERT INTO kickside_projection(id,thread_id,kind,body,declaration_digest) SELECT id,id,'plan','{}','000' FROM kickside_thread WHERE thread_class='plan.growth'"))
            assert(tx:commit())
            M.growth = -1
        end
        return rows, err
    end
    return chain
end
return M
