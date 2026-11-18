-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("29 advanceable rearm deadlines", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute("ALTER TABLE kickside_job ADD COLUMN rearm_on_demand BOOLEAN")
                    if err then error(err) end
                end)
                down(function(db)
                    local _, err = db:execute("ALTER TABLE kickside_job DROP COLUMN rearm_on_demand")
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
