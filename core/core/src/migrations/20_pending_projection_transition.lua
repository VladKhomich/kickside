-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("20 pending projection transition", function()
        for _, dialect in ipairs({"sqlite", "postgres"}) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[ALTER TABLE kickside_projection_cursor
                        ADD COLUMN pending_transition TEXT]])
                    if err then error(err) end
                    _, err = db:execute([[ALTER TABLE kickside_projection_cursor
                        ADD COLUMN pending_transition_seq BIGINT]])
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
