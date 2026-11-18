-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Per-type retention passes read one job type's expiration order.
local run_status = require("run_status")

return require("migration").define(function()
    migration("28 per-type Jobs retention order", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    -- SQLite orders equal index timestamps by the implicit rowid.
                    local ordered = dialect == "sqlite" and "job_type,finished_at" or "job_type,finished_at,id"
                    local statements = {
                        "CREATE INDEX IF NOT EXISTS idx_job_type_retention ON kickside_job(" .. ordered
                            .. ") WHERE status IN ('done','dead','cancelled') AND finished_at IS NOT NULL",
                        "CREATE INDEX IF NOT EXISTS idx_job_run_type_retention ON kickside_job_run(" .. ordered
                            .. ") WHERE " .. run_status.terminal_predicate() .. " AND finished_at IS NOT NULL",
                    }
                    for _, statement in ipairs(statements) do
                        local _, err = db:execute(statement)
                        if err then error(err) end
                    end
                end)
                down(function(db)
                    for _, name in ipairs({ "idx_job_type_retention", "idx_job_run_type_retention" }) do
                        local _, err = db:execute("DROP INDEX IF EXISTS " .. name)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)
