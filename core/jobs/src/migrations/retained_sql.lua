-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}

function M.exec(db, statement)
    local _, err = db:execute(statement)
    if err then error(err) end
end

function M.rows(db, statement)
    local rows, err = db:query(statement)
    if err then error(err) end
    return rows
end

function M.refuse(message)
    error(errors.new({kind = errors.CONFLICT, message = "retained Jobs migration: " .. message}))
end

function M.require_empty(db, statement, message)
    local row = M.rows(db, statement)[1]
    if row then M.refuse(message .. ": " .. tostring(row.id)) end
end

return M
