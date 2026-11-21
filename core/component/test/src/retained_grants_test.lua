-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local funcs = require("funcs")

local db_id = "app:retained_grants_db"
local root = "11111111-1111-4111-8111-111111111111"
local child = "22222222-2222-4222-8222-222222222222"

local function migrate(receipt)
    return assert(funcs.call("kickside.component.migrations:18_retained_grants",
        {database_id = db_id, id = "component_test:" .. receipt, direction = "up"}))
end

local function setup(db, pg)
    local id = pg and "UUID" or "TEXT"
    assert(db:execute("CREATE TABLE kickside_components(component_id " .. id
        .. " PRIMARY KEY,parent_id " .. id .. ",path TEXT,deleting_at TEXT,private_context TEXT)"))
    assert(db:execute("INSERT INTO kickside_components(component_id,parent_id) VALUES ($1,NULL),($2,$1)", {root, child}))
    assert(db:execute("CREATE TABLE kickside_component_ancestor(component_id " .. id .. ",ancestor_id "
        .. id .. ",depth INTEGER,PRIMARY KEY(component_id,ancestor_id))"))
    assert(db:execute("CREATE TABLE kickside_execution_identity_audit(created_at TEXT,component_id " .. id
        .. ",identity_generation INTEGER,published_at TEXT)"))
    local constraint = pg and "CONSTRAINT chk_kickside_component_access_subject_type " or ""
    assert(db:execute("CREATE TABLE kickside_component_access(access_id " .. id .. " PRIMARY KEY,"
        .. "subject_id TEXT NOT NULL,component_id " .. id .. " NOT NULL,source_component_id TEXT NOT NULL,"
        .. "access_mask INTEGER NOT NULL,inherited INTEGER NOT NULL DEFAULT 0,subject_type TEXT NOT NULL DEFAULT 'user' "
        .. constraint .. "CHECK (subject_type IN ('user', 'group', 'agent')),created_at TEXT NOT NULL DEFAULT 'old',"
        .. "UNIQUE(subject_id,component_id,source_component_id))"))
    for _, suffix in ipairs({"subject_id", "subject_component", "subject_mask"}) do
        assert(db:execute("CREATE INDEX idx_kickside_component_access_" .. suffix .. " ON kickside_component_access(subject_id)"))
    end
    local insert = "INSERT INTO kickside_component_access(access_id,subject_id,component_id,source_component_id,"
        .. "access_mask,inherited,subject_type) VALUES ($1,$2,$3,$4,$5,$6,$7)"
    assert(db:execute(insert, {"00000000-0000-4000-8000-000000000001","same",root,root,3,0,"group"}))
    assert(db:execute(insert, {"00000000-0000-4000-8000-000000000002","same",child,root,3,1,"group"}))
    assert(db:execute(insert, {"00000000-0000-4000-8000-000000000003","obsolete",root,root,15,0,"agent"}))
    assert(db:execute(insert, {"00000000-0000-4000-8000-000000000004","principal:service:collision",root,root,15,0,"user"}))
    return insert
end

return {run = test.run_cases(function()
    test.describe("retained Component grants", function()
        test.it("recovers typed direct grants and derived ancestry without promoting historical subjects", function()
            local shared = assert(sql.get("app:db"))
            local pg = assert(shared:type()) == sql.type.POSTGRES
            if pg then
                assert(shared:execute("DROP SCHEMA IF EXISTS component_retained_grants_test CASCADE"))
                assert(shared:execute("CREATE SCHEMA component_retained_grants_test"))
            end
            shared:release()
            local db = assert(sql.get(db_id))
            local insert = setup(db, pg)
            db:release()
            local refused = migrate("typed_grants")
            test.eq(refused.failed, 1)
            test.is_true(tostring(refused.error):find("reserved group or service", 1, true) ~= nil)
            db = assert(sql.get(db_id))
            test.eq(tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_component_access"))[1].n), 4)
            assert(db:execute("DELETE FROM kickside_component_access WHERE subject_id='principal:service:collision'"))
            db:release()
            local repaired = migrate("typed_grants")
            test.eq(repaired.status, "complete", tostring(repaired.error))
            db = assert(sql.get(db_id))
            local rows = assert(db:query("SELECT * FROM kickside_component_access"))
            test.eq(#rows, 1)
            test.eq(tostring(rows[1].access_id), "00000000-0000-4000-8000-000000000001")
            test.eq(rows[1].subject_type, "group")
            test.eq(rows[1].subject_id, "same")
            test.eq(tonumber(rows[1].access_mask), 3)
            test.eq(rows[1].created_at, "old")
            local retired = assert(db:query("SELECT * FROM kickside_component_access_retired"))
            test.eq(#retired, 1)
            test.eq(retired[1].subject_id, "obsolete")
            test.eq(tonumber(retired[1].access_mask), 15)
            local ancestors = assert(db:query("SELECT ancestor_id FROM kickside_component_ancestor WHERE component_id=$1 AND depth=1", {child}))
            test.eq(#ancestors, 1)
            test.eq(tostring(ancestors[1].ancestor_id), root)
            assert(db:execute(insert, {"00000000-0000-4000-8000-000000000005","same",root,root,1,0,"user"}))
            assert(db:execute(insert, {"00000000-0000-4000-8000-000000000006","same",root,root,2,0,"service"}))
            db:release()
            test.eq(migrate("recheck_typed_grants").status, "complete")
        end)
    end)
end)}
