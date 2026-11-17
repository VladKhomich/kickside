-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("09 automation delete admission index", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local _, err = db:execute([=[
                        CREATE INDEX IF NOT EXISTS idx_automation_delete_blockers
                        ON workflow_runs (trigger_id, run_id)
                        WHERE status IN ('pending','running') OR terminal_event_pending
                    ]=])
                    if err then error("create automation delete admission index: " .. tostring(err)) end
                end)
                down(function(db)
                    local _, err = db:execute("DROP INDEX IF EXISTS idx_automation_delete_blockers")
                    if err then error("drop automation delete admission index: " .. tostring(err)) end
                end)
            end)
        end
    end)
end)
