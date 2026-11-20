-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("20 receipt source kind", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute("ALTER TABLE kickside_automation_receipt ADD COLUMN source_kind TEXT")
                    if err then error(tostring(err)) end
                end)
            end)
        end
    end)
end)
