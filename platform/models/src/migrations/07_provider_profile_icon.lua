-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("store provider profile icons", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local _, err = db:execute([[
                        ALTER TABLE kickside_model_provider_profiles ADD COLUMN icon TEXT NOT NULL DEFAULT ''
                    ]])
                    if err then error(err) end
                    return true
                end)
            end)
        end
    end)
end)
