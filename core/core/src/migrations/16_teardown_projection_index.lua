-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("16 teardown projection index", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[CREATE INDEX idx_projection_thread_id
                        ON kickside_projection(thread_id,id)]])
                    if err then error(err) end
                end)
                down(function(db)
                    local _, err = db:execute("DROP INDEX idx_projection_thread_id")
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
