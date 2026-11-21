-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local M = {}

function M.execute(db: any, statement: string)
    local _, err = db:execute(statement)
    if err then error(tostring(err)) end
end

function M.create(db: any, engine: string)
    local created_at = "(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))"
    if engine == "postgres" then
        created_at = [[(to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))]]
    end
    M.execute(db, [[
        CREATE TABLE kickside_user_sessions (
            token_key TEXT PRIMARY KEY REFERENCES kickside_user_auth_tokens(token_key) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES app_users(user_id) ON DELETE CASCADE,
            auth_generation INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT ]] .. created_at .. [[,
            expires_at TEXT
        )
    ]])
    M.execute(db, "CREATE INDEX idx_kickside_user_sessions_user_id ON kickside_user_sessions(user_id)")
    M.execute(db, "CREATE INDEX idx_kickside_user_sessions_expires_at ON kickside_user_sessions(expires_at)")
end

return M
