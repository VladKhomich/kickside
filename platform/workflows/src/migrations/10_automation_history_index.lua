-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("10 automation history index", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local _, err = db:execute([=[
                        CREATE INDEX IF NOT EXISTS idx_workflow_automation_delivery
                        ON workflow_runs (trigger_id, binding_id, dedup_key, run_id)
                        WHERE dedup_key IS NOT NULL AND superseded_by IS NULL AND admission_state='admitted'
                          AND origin='automation' AND trigger_kind='binding'
                          AND binding_id IS NOT NULL AND binding_revision>0
                    ]=])
                    if err then error("create Automation history index: " .. tostring(err)) end
                end)
                down(function(db)
                    local _, err = db:execute("DROP INDEX IF EXISTS idx_workflow_automation_delivery")
                    if err then error("drop Automation history index: " .. tostring(err)) end
                end)
            end)
        end
    end)
end)
