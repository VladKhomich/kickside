-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("16 encrypted component secrets", function()
        for _, engine in ipairs({"postgres", "sqlite"}) do
            database(engine, function()
                up(function(db)
                    local columns, read_err = db:query(engine == "postgres"
                        and "SELECT column_name AS name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='kickside_components'"
                        or "PRAGMA table_info(kickside_components)")
                    if read_err then error(read_err) end
                    local present = false
                    local generation_present = false
                    local incarnation_present = false
                    local revision_present = false
                    for _, column in ipairs(columns) do
                        if column.name == "encrypted_secrets" then present = true end
                        if column.name == "secrets_generation" then generation_present = true end
                        if column.name == "secrets_incarnation" then incarnation_present = true end
                        if column.name == "secrets_revision" then revision_present = true end
                    end
                    if not present then
                        local _, err = db:execute("ALTER TABLE kickside_components ADD COLUMN encrypted_secrets TEXT")
                        if err then error(err) end
                    end
                    if not generation_present then
                        local _, err = db:execute("ALTER TABLE kickside_components ADD COLUMN secrets_generation BIGINT NOT NULL DEFAULT 0")
                        if err then error(err) end
                    end
                    if not incarnation_present then
                        local _, err = db:execute("ALTER TABLE kickside_components ADD COLUMN secrets_incarnation TEXT")
                        if err then error(err) end
                    end
                    if not revision_present then
                        local _, err = db:execute("ALTER TABLE kickside_components ADD COLUMN secrets_revision TEXT")
                        if err then error(err) end
                    end
                    local _, index_err = db:execute([[CREATE INDEX IF NOT EXISTS idx_kickside_components_impl_component
                        ON kickside_components (impl_id, component_id)]])
                    if index_err then error(index_err) end
                    local _, drop_err = db:execute("DROP INDEX IF EXISTS idx_kickside_components_impl_id")
                    if drop_err then error(drop_err) end
                end)
            end)
        end
    end)
end)
