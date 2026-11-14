-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local eligibility = require("eligibility")
return require("migration").define(function()
    migration("27 indexed Jobs health reads", function()
        for _, dialect in ipairs({"postgres", "sqlite"}) do
            database(dialect, function()
                up(function(db)
                    local target = eligibility.worker_target(nil, dialect)
                    local statements = {
                        [[CREATE INDEX IF NOT EXISTS idx_job_health_errors ON kickside_job(slot,scheduled_at,id)
                            WHERE status='pending' AND last_error IS NOT NULL]],
                        [[CREATE INDEX IF NOT EXISTS idx_job_health_control ON kickside_job(updated_at)
                            WHERE wake_control_pending = ]] .. (dialect == "postgres" and "TRUE" or "1"),
                        [[CREATE INDEX IF NOT EXISTS idx_wake_health_pending ON kickside_wake_fanout(key)
                            WHERE demand_generation > ack_generation]],
                        "CREATE INDEX IF NOT EXISTS idx_job_capacity_due_group ON kickside_job("
                            .. target .. ",capacity_group,scheduled_at) WHERE status='pending' AND scheduled_at IS NOT NULL",
                        "CREATE INDEX IF NOT EXISTS idx_job_capacity_invalid_key ON kickside_job("
                            .. target .. ",scheduled_at) WHERE status='pending' AND scheduled_at IS NOT NULL"
                            .. " AND (concurrency_key IS NULL OR concurrency_key='')",
                    }
                    for _, statement in ipairs(statements) do
                        local _, err = db:execute(statement)
                        if err then error(err) end
                    end
                end)
            end)
        end
    end)
end)
