-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function schema(tx, engine)
    local columns, read_err = tx:query(engine == "postgres"
        and "SELECT column_name AS name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='kickside_components'"
        or "PRAGMA table_info(kickside_components)")
    if read_err then error(read_err) end
    local present = {}
    for _, column in ipairs(columns) do present[column.name] = true end
    local definitions = {
        {"owner_type", "TEXT NOT NULL DEFAULT 'unresolved' CHECK (owner_type IN ('principal','component','unresolved'))"},
        {"owner_kind", "TEXT"},
        {"owner_id", "TEXT"},
        {"owner_incarnation", "TEXT"},
        {"owner_producer", "TEXT"},
        {"custody_legacy", [[INTEGER NOT NULL DEFAULT 1 CHECK (custody_legacy IN (0,1))
            CHECK ((owner_type='principal' AND owner_kind IS NOT NULL AND owner_kind IN ('user','group','service','maintenance')
                    AND owner_id IS NOT NULL AND owner_incarnation IS NULL AND owner_producer IS NULL)
                OR (owner_type='component' AND owner_kind IS NULL AND owner_id IS NOT NULL
                    AND owner_incarnation IS NOT NULL AND owner_producer IS NOT NULL)
                OR (owner_type='unresolved' AND custody_legacy=1 AND owner_kind IS NULL AND owner_id IS NULL
                    AND owner_incarnation IS NULL AND owner_producer IS NULL))]]},
    }
    for _, column in ipairs(definitions) do
        if not present[column[1]] then
            local _, err = tx:execute("ALTER TABLE kickside_components ADD COLUMN " .. column[1] .. " " .. column[2])
            if err then error(err) end
        end
    end
    local _, owner_err = tx:execute([[CREATE INDEX IF NOT EXISTS idx_kickside_components_custody
        ON kickside_components (owner_type,owner_kind,owner_id,owner_incarnation,component_id)]])
    if owner_err then error(owner_err) end
    local _, scope_err = tx:execute([[CREATE INDEX IF NOT EXISTS idx_kickside_components_custody_unresolved
        ON kickside_components (impl_id,component_id) WHERE owner_type='unresolved']])
    if scope_err then error(scope_err) end
    local _, pending_err = tx:execute([[CREATE INDEX IF NOT EXISTS idx_kickside_components_custody_unresolved_pending
        ON kickside_components (component_id) WHERE owner_type='unresolved' AND deleting_at IS NOT NULL]])
    if pending_err then error(pending_err) end
end

return require("migration").define(function()
    migration("17 typed component custody schema", function()
        for _, engine in ipairs({"postgres", "sqlite"}) do
            database(engine, function()
                up(function(tx) schema(tx, engine) end)
            end)
        end
    end)
end)
