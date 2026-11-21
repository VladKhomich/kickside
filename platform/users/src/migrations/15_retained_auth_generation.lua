-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local schema = require("session_schema")

local function table_columns(db: any, engine: string, name: string): { [string]: boolean }
    local statement = "SELECT name FROM pragma_table_info('" .. name .. "')"
    if engine == "postgres" then
        statement = "SELECT attname AS name FROM pg_attribute WHERE attrelid = '" .. name
            .. "'::regclass AND attnum > 0 AND NOT attisdropped"
    end
    local rows, err = db:query(statement)
    if err then error(tostring(err)) end
    if not rows or #rows == 0 then error("Missing Users table: " .. name) end
    local columns = {}
    for _, row in ipairs(rows) do columns[row.name] = true end
    return columns
end

local function adopt(db: any, engine: string)
    local accounts = table_columns(db, engine, "app_users")
    local sessions = table_columns(db, engine, "kickside_user_sessions")
    local accounts_hardened = accounts.auth_generation
    local sessions_hardened = sessions.auth_generation and sessions.token_key and not sessions.token
    if not sessions_hardened and (sessions.auth_generation or sessions.token_key or not sessions.token) then
        error("Unrecognized retained Users session schema")
    end
    if not accounts_hardened then
        schema.execute(db, "ALTER TABLE app_users ADD COLUMN auth_generation INTEGER NOT NULL DEFAULT 0")
    end
    if not sessions_hardened then
        if engine == "sqlite" then
            schema.execute(db, "DROP TRIGGER IF EXISTS trg_kickside_user_auth_token_session_cleanup")
        end
        schema.execute(db, "DROP TABLE kickside_user_sessions")
        schema.create(db, engine)
    end
    if not accounts_hardened or not sessions_hardened then
        -- Pre-generation bearers can exist without an ownership row. The
        -- published hardening migration signed out this cohort as well.
        schema.execute(db, "DELETE FROM kickside_user_sessions")
        schema.execute(db, "DELETE FROM kickside_user_auth_tokens")
    end
    if engine == "sqlite" then
        schema.execute(db, [[
            CREATE TRIGGER IF NOT EXISTS trg_kickside_user_auth_token_session_cleanup
            AFTER DELETE ON kickside_user_auth_tokens
            FOR EACH ROW
            BEGIN
                DELETE FROM kickside_user_sessions WHERE token_key = OLD.token_key;
            END
        ]])
    end
end

return require("migration").define(function()
    migration("15 adopt retained Users authentication generations", function()
        for _, engine in ipairs({ "postgres", "sqlite" }) do
            database(engine, function()
                up(function(db) adopt(db, engine) end)
                down(function() error("Cannot restore generationless Users sessions") end)
            end)
        end
    end)
end)
