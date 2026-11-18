-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("15 retention cursor floor", function()
        for _, dialect in ipairs({"postgres", "sqlite"}) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS idx_projection_cursor_retention_floor
                        ON kickside_projection_cursor(thread_id,last_seq) WHERE status<>'invalid']])
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
