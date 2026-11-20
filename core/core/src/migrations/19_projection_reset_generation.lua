-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("19 projection reset generation", function()
        for _, dialect in ipairs({"sqlite", "postgres"}) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[ALTER TABLE kickside_projection
                        ADD COLUMN reset_generation INTEGER NOT NULL DEFAULT 1]])
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
