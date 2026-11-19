-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("15 projection continuation", function()
        for _, dialect in ipairs({"sqlite", "postgres"}) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[ALTER TABLE kickside_projection_cursor
                        ADD COLUMN continuation TEXT NOT NULL DEFAULT '']])
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
