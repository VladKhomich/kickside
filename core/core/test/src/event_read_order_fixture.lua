-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {order = {}, admin = false, level = "", base_allowed = true, component_id = "component", payload_rows = 0}
function M.reset(level: string, admin: boolean, base_allowed: boolean?)
    M.order, M.admin, M.level, M.base_allowed = {}, admin, level, base_allowed ~= false
    M.payload_rows = 0
end
function M.has_access(id: string, mask: integer): (boolean, error?)
    M.order[#M.order + 1] = tostring(mask) .. ":" .. id
    if mask == 1 then return M.base_allowed, nil end
    return M.admin, nil
end
local db = {}
function db:type(): (string, error?) return "sqlite", nil end
function db:query(query: string, args: table): (table?, error?)
    local kind = M.level ~= "" and "event.read.test:" .. M.level .. "_kind" or "kickside.core:thread"
    local row = {component_id = M.component_id, component_impl_id = kind,
        component_incarnation = "current-component", thread_incarnation = "current-thread"}
    if query:find("WITH eligible", 1, true) then
        M.order[#M.order + 1] = "body"
        local index = tonumber(query:match("ca%.access_mask & %$(%d+)"))
        local allowed = M.has_access(M.component_id, assert(args[assert(index)]))
        row.payload_allowed = allowed and 1 or 0
        if allowed then
            M.payload_rows = M.payload_rows + 1
            row.body = {secret = "committed"}
        end
        return {row}, nil
    end
    M.order[#M.order + 1] = "binding"
    return {row}, nil
end
function db:release() M.order[#M.order + 1] = "release" end
function M.get(_id: string): (any, error?) return db, nil end
return M
