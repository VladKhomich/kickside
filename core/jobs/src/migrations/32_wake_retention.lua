-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("32 wake retention position", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[CREATE TABLE IF NOT EXISTS kickside_job_wake_retention (
                        id INTEGER PRIMARY KEY CHECK (id = 1),
                        last_key TEXT NOT NULL
                    )]])
                    if err then error(err) end
                end)
                down(function(db)
                    local _, err = db:execute("DROP TABLE IF EXISTS kickside_job_wake_retention")
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
