-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("19 index component secret revisions", function()
        for _, engine in ipairs({"sqlite", "postgres"}) do
            database(engine, function()
                up(function(db)
                    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS idx_kickside_components_impl_secrets_revision
                        ON kickside_components (impl_id, secrets_revision)]])
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
