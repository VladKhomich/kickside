-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("16 component kind windows", function()
        for _, dialect in ipairs({"postgres", "sqlite"}) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute("CREATE INDEX IF NOT EXISTS idx_components_impl_component ON kickside_components(impl_id, component_id)")
                    if err then error(err) end
                    local _, err = db:execute("DROP INDEX IF EXISTS idx_kickside_components_impl_id")
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
