-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local component = require("component")
local component_types = require("component_types")
local workflow_types = require("workflow_types")
local store = require("store")

return {run=test.run_cases(function()
    test.describe("Workflow deletion storage", function()
        test.it("reads Workflows blockers before Component begins its delete transaction", function()
            local component_db = assert(sql.get(assert(component_types.db_id())))
            local workflow_db = assert(store.open_db())
            if component_types.db_id() ~= workflow_types.db_id() then
                -- The split-db profile must use physically separate databases.
                local _, err = component_db:query("SELECT run_id FROM workflow_runs LIMIT 1")
                test.not_nil(err)
            end
            local function execute(statement, args)
                local _, err = workflow_db:execute(statement, args)
                test.is_nil(err, tostring(err))
            end
            for _, state in ipairs({"idle", "pending", "running", "unpublished"}) do
                local id, rid = uuid.v4(), uuid.v4()
                local _, register_err = component_db:execute(
                    "INSERT INTO kickside_components (component_id,impl_id) VALUES ($1,$2)",
                    {id,workflow_types.WORKFLOW_IMPL})
                test.is_nil(register_err, tostring(register_err))
                if state ~= "idle" then
                    execute("INSERT INTO workflow_runs (run_id,workflow_id,version,status,started_at,terminal_event_pending)"
                        .. " VALUES ($1,$2,1,$3,'2026-11-16T00:00:00Z',$4)",
                        {rid,id,state == "unpublished" and "completed" or state,state == "unpublished"})
                    local accepted, err = component.system_delete(id, "reparent_root")
                    test.is_false(accepted); test.is_true(errors.is(err, errors.CONFLICT), tostring(err))
                    test.eq(err:details().code, "workflow_runs_active")
                    local rows, read_err = component_db:query(
                        "SELECT deleting_at,delete_intent FROM kickside_components WHERE component_id=$1", {id})
                    test.is_nil(read_err, tostring(read_err)); test.not_nil(rows[1])
                    test.is_nil(rows[1].deleting_at); test.is_nil(rows[1].delete_intent)
                    execute("UPDATE workflow_runs SET status='completed',terminal_event_pending=FALSE WHERE run_id=$1", {rid})
                end
                local accepted, err = component.system_delete(id, "reparent_root")
                test.is_false(accepted); test.not_nil(err)
                test.is_true(err:details().cleanup_pending, tostring(err))
                local rows, read_err = component_db:query(
                    "SELECT deleting_at,delete_intent FROM kickside_components WHERE component_id=$1", {id})
                test.is_nil(read_err, tostring(read_err))
                test.not_nil(rows[1].deleting_at); test.not_nil(rows[1].delete_intent)
            end
            workflow_db:release(); component_db:release()
        end)
    end)
end)}
