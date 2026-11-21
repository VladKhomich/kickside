-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Retain the compact, immutable Knowledge publication receipt with a delivery
-- history event. Current receipts are deliberately mutable, so they cannot
-- identify the materialization result of an older source revision.
return require("migration").define(function()
    migration("21 delivery history publication", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute("ALTER TABLE kickside_automation_delivery_history ADD COLUMN publication_ref_json TEXT")
                    if err then error(tostring(err)) end
                end)
            end)
        end
    end)
end)
