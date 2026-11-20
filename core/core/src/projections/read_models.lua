-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Read-only boundary for committed materialized views. It exposes projection
-- bodies only: no event log, cursor, lag, catch-up, replay, or worker controls.

local trim = require("text_trim").trim
local sql = require("sql")
local json = require("json")

local core_db = require("core_db")
local event_access = require("event_access")

local M = {}

local function failure(message: string, kind: any): error
    return (errors.new({ message = message, kind = kind }) :: error)
end

function M.get(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    local owner_id = trim((args :: any).owner_id)
    local kind = trim((args :: any).kind)
    local projection_key = trim((args :: any).projection_key)
    if owner_id == "" then return nil, failure("owner_id is required", errors.INVALID) end
    if kind == "" then return nil, failure("kind is required", errors.INVALID) end
    if projection_key == "" then projection_key = "default" end

    local db, db_err = sql.get(core_db.id())
    if db_err then return nil, (errors.wrap(db_err, "read-model database unavailable") :: error) end
    if not db then return nil, failure("read-model database unavailable", errors.UNAVAILABLE) end
    local request = {lazy = true}
    local model = sql.builder.select("body"):from("kickside_projection")
        :where("thread_id = ? AND kind = ? AND projection_key = ?", owner_id, kind, projection_key)
    local query, query_err = event_access.authorized_query(db, owner_id, model, sql.builder.select(), request, 1)
    local rows: table[]? = nil
    if not query_err then rows, query_err = event_access.execute(db, owner_id, query, request) end
    db:release()
    if query_err then return nil, (errors.wrap(query_err, "failed to read materialized view") :: error) end
    if type(rows) ~= "table" or #rows ~= 1 then
        return nil, failure("invalid materialized view response", errors.INTERNAL)
    end
    local row = rows[1]
    local access_err = event_access.verify(request, row)
    if access_err then return nil, access_err end

    local body = row.body
    if type(body) == "string" then
        local decoded, decode_err = json.decode(body)
        if decode_err then return nil, (errors.wrap(decode_err, "invalid materialized view body") :: error) end
        body = decoded
    end
    return { body = type(body) == "table" and body or {} }, nil
end

return M
