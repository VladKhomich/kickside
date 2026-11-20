-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("11 current automation failure index", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local _, err = db:execute([=[
                        CREATE INDEX IF NOT EXISTS idx_workflow_current_automation_failure
                        ON workflow_runs (trigger_id, workflow_id, binding_id, finished_at DESC, run_id DESC)
                        WHERE status='failed' AND admission_state='admitted' AND origin='automation'
                          AND trigger_kind='binding' AND binding_revision>0 AND superseded_by IS NULL
                          AND finished_at IS NOT NULL
                    ]=])
                    if err then error("create current Automation failure index: " .. tostring(err)) end
                end)
                down(function(db)
                    local _, err = db:execute("DROP INDEX IF EXISTS idx_workflow_current_automation_failure")
                    if err then error("drop current Automation failure index: " .. tostring(err)) end
                end)
            end)
        end
    end)
end)
