-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local recurring_custody = require("recurring_custody")
local types = require("types")

return require("migration").define(function()
    migration("22 enroll retained ordinary recurring tasks", function()
        for _, dialect in ipairs({"postgres", "sqlite"}) do
            database(dialect, function()
                up(function(tx, cursor)
                    return recurring_custody(tx, cursor, dialect == "postgres", types.db_id())
                end, "batch")
            end)
        end
    end)
end)
