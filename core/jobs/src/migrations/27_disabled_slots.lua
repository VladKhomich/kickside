-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("27 disabled slot convergence", function()
        for _, dialect in ipairs({"postgres", "sqlite"}) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS idx_job_disabled_slot_type
                        ON kickside_job(job_type,id) WHERE slot=TRUE AND wake_enabled=FALSE
                            AND status IN ('pending','running')]])
                    if err then error(err) end
                end)
                down(function(db)
                    local _, err = db:execute("DROP INDEX IF EXISTS idx_job_disabled_slot_type")
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
