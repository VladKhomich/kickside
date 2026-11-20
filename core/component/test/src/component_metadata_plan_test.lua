-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access_subjects = require("access_subjects")
local component_query = require("component_query")
local component_reader = require("component_reader")
local json = require("json")
local sql = require("sql")
local test = require("test")
local uuid = require("uuid")

local SERIES = [[WITH RECURSIVE subjects(i) AS (
    SELECT 1 UNION ALL SELECT i+1 FROM subjects WHERE i<12000
) ]]
local TABLES = {"kickside_components", "kickside_component_ancestor", "kickside_component_access", "kickside_component_meta"}

local function copy_schema(tx: sql.Transaction, postgres: boolean)
    for _, name in ipairs(TABLES) do
        if postgres then
            assert(tx:execute("CREATE TEMP TABLE " .. name .. " (LIKE public." .. name .. " INCLUDING ALL) ON COMMIT DROP", {}))
        else
            local schema = assert(tx:query([[SELECT sql FROM main.sqlite_master
                WHERE tbl_name=$1 AND sql IS NOT NULL ORDER BY type DESC]], {name}))
            for _, row in ipairs(schema) do
                -- Indexes inherit the schema of their temporary table.
                local statement = row.sql:gsub("^CREATE TABLE ", "CREATE TEMP TABLE ")
                assert(tx:execute(statement, {}))
            end
        end
    end
end

local function seed(tx: sql.Transaction, postgres: boolean, parent: string, reader: string, impl: string)
    local function id(prefix: string, suffix: string): string
        local value = "'" .. prefix .. "-0000-4000-8000-' || "
            .. "substr('000000000000' || " .. suffix .. ", length(" .. suffix .. ")+1)"
        return postgres and "CAST(" .. value .. " AS UUID)" or value
    end
    local components = uuid.v4():sub(1, 8)
    local cmp = id(components, "CAST(i AS TEXT)")
    local grants = id(uuid.v4():sub(1, 8), "CAST(i AS TEXT)")
    local metas = id(uuid.v4():sub(1, 8), "CAST(i * 8 + k AS TEXT)")
    local parent_id = postgres and "CAST($2 AS UUID)" or "$2"
    assert(tx:execute("INSERT INTO kickside_components (component_id,impl_id) VALUES ($1,$2)", {parent, impl .. ":root"}))
    assert(tx:execute(SERIES .. "INSERT INTO kickside_components (component_id,impl_id,parent_id) SELECT "
        .. cmp .. ",$1,CASE WHEN i%2=0 THEN " .. parent_id .. " END FROM subjects", {impl, parent}))
    assert(tx:execute(SERIES .. "INSERT INTO kickside_component_ancestor (component_id,ancestor_id,depth) SELECT "
        .. cmp .. ",$1,1 FROM subjects WHERE i%2=0", {parent}))
    assert(tx:execute([[INSERT INTO kickside_component_access
        (access_id,component_id,source_component_id,subject_type,subject_id,access_mask)
        VALUES ($1,$2,$3,'group',$4,1)]], {uuid.v4(), parent, parent, reader}))
    assert(tx:execute(SERIES .. [[INSERT INTO kickside_component_access
        (access_id,component_id,source_component_id,subject_type,subject_id,access_mask)
        SELECT ]] .. grants .. "," .. cmp .. ",CAST(" .. cmp .. " AS TEXT),'user',$1,3 FROM subjects WHERE i%5=0", {reader}))
    assert(tx:execute(SERIES .. [[, keys(k) AS (VALUES (0),(1),(2),(3),(4),(5),(6),(7))
        INSERT INTO kickside_component_meta (meta_id,component_id,key,value) SELECT ]]
        .. metas .. "," .. cmp .. [[,CASE WHEN k=0 THEN 'ui' ELSE 'other-' || CAST(k AS TEXT) END,
        CASE WHEN k<>0 THEN 'value-' || CAST(i AS TEXT) WHEN i%101=0 THEN 'sparse'
             WHEN i%3<>0 THEN 'common' ELSE '' END FROM subjects CROSS JOIN keys]], {}))
    local schema = postgres and "pg_temp." or "temp."
    for _, name in ipairs(TABLES) do
        assert(tx:execute("ANALYZE " .. schema .. name, {}))
    end
end

local function metadata_scans(plan: any): number
    local scans = plan["Relation Name"] == "kickside_component_meta" and (plan["Actual Loops"] or 0) or 0
    for _, child in ipairs(plan.Plans or {}) do scans = scans + metadata_scans(child) end
    return scans
end

local function explain(tx: sql.Transaction, query: any, postgres: boolean): any
    local statement, args = query:placeholder_format(sql.builder.dollar):to_sql()
    local prefix = postgres and "EXPLAIN (ANALYZE, TIMING OFF, FORMAT JSON) " or "EXPLAIN QUERY PLAN "
    local rows, err = tx:query(prefix .. statement, args)
    if err then error(err) end
    if not postgres then return rows end
    local plan = rows[1]["QUERY PLAN"]
    if type(plan) == "string" then plan = assert(json.decode(plan)) end
    return plan[1].Plan
end

return test.run_cases(function()
    test.describe("authorized metadata query plans", function()
        test.it("uses bounded metadata scans for sparse and missing values on a populated schema", function()
            local db = assert(sql.get("app:db"))
            local postgres = db:type() == sql.type.POSTGRES
            local tx = assert(db:begin())
            local parent, reader = uuid.v4(), "plan-" .. uuid.v4()
            local impl = "fixture:" .. uuid.v4()
            local previous = rawget(access_subjects, "_security")
            rawset(access_subjects, "_security", {actor = function()
                return {id = function() return reader end, meta = function() return {security_groups = {reader}} end}
            end})
            local ok, failure = pcall(function()
                -- Keep both the fixture data and optimizer statistics away from other suites.
                copy_schema(tx, postgres)
                seed(tx, postgres, parent, reader, impl)
                for _, sample in ipairs({"sparse", "common", "missing"}) do
                    local state = component_reader.new():with_user(reader):with_access_mask(1):with_impl_ids(impl)
                        :with_meta({ui = sample}):order_by("component_id", "ASC"):limit(11, 20)
                    local page = assert(component_query.select(state))
                    local discover = component_query.implementation_candidates(state)
                    local rows = assert(page:run_with(tx):query())
                    test.eq(#rows, sample == "missing" and 0 or 11)
                    for _, query in ipairs({page, discover}) do
                        local plan = explain(tx, query, postgres)
                        if postgres and sample ~= "common" then
                            test.is_true(metadata_scans(plan) <= 8, sample .. " should not probe metadata once per grant candidate")
                        elseif not postgres then
                            local encoded = assert(json.encode(plan))
                            test.is_true(encoded:find("idx_kickside_component_meta_key_value", 1, true) ~= nil)
                        end
                    end
                end
            end)
            rawset(access_subjects, "_security", previous)
            assert(tx:rollback())
            db:release()
            if not ok then error(failure) end
        end)
    end)
end)
