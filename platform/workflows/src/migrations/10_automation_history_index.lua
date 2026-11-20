-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function replace_index(db: any, replacement: string, columns: string, previous: string)
    -- Keep the unique constraint enforced if either migration statement fails.
    local _, err = db:execute("CREATE UNIQUE INDEX IF NOT EXISTS " .. replacement .. " ON workflow_runs (" .. columns
        .. ") WHERE dedup_key IS NOT NULL AND superseded_by IS NULL")
    if err then error("create Workflow deduplication index: " .. tostring(err)) end
    local _, drop_err = db:execute("DROP INDEX IF EXISTS " .. previous)
    if drop_err then error("drop previous Workflow deduplication index: " .. tostring(drop_err)) end
end

return require("migration").define(function()
    migration("10 automation history index", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    replace_index(db, "uq_workflow_live_dedup_by_trigger", "trigger_id,dedup_key,workflow_id",
                        "uq_workflow_live_dedup")
                end)
                down(function(db)
                    replace_index(db, "uq_workflow_live_dedup", "workflow_id,trigger_id,dedup_key",
                        "uq_workflow_live_dedup_by_trigger")
                end)
            end)
        end
    end)
end)
