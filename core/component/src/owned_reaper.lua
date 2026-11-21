-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The lifecycle reaper and component deletion jobs share this ownership walk.
local component_teardown = require("component_teardown")
local component_types = require("component_types")

local M = {}
type Budget = { remaining: integer, deleted: integer }
local MAX_DEPTH = 64
local OWNER = component_types.OWNER_META_KEY

local function cleanup_error(message: string, cause: any?): error
    if type(cause) == "userdata" then
        return (errors.wrap(cause, message) :: error)
    end
    return (errors.new({ message = message .. (cause ~= nil and (": " .. tostring(cause)) or ""),
        kind = errors.INTERNAL, retryable = true }) :: error)
end

local function owner_page_pending(): error
    return errors.new({message = "component owner cleanup has another bounded page",
        kind = errors.CONFLICT, retryable = true, details = {cleanup_pending = true, wait_for = "children"}})
end

-- Delete children before their owning parent. If a page or child cleanup
-- fails, the parent still names the unfinished subtree on the next tick.
local function reap_owner(component: any, owner_id: string, depth: integer, budget: Budget): error?
    if depth > MAX_DEPTH then return cleanup_error("component ownership depth exceeds " .. tostring(MAX_DEPTH)) end
    if type(owner_id) ~= "string" or owner_id == "" then return cleanup_error("component owner id is required") end
    local limit = math.max(1, budget.remaining)
    local rows, list_err = component.list_system({
        meta = { [OWNER] = owner_id }, include = { meta = false },
        limit = limit, order_by = { field = "component_id", direction = "ASC" },
    })
    if list_err or type(rows) ~= "table" then return cleanup_error("component owner scan failed", list_err or "no rows result") end
    if budget.remaining == 0 and #rows > 0 then
        return owner_page_pending()
    end
    local pending_error: error? = nil
    for _, row in ipairs(rows :: { any }) do
        local cid = (row :: any).component_id
        if type(cid) ~= "string" or cid == "" then return cleanup_error("component owner scan returned an invalid id") end
        local child_err = reap_owner(component, cid :: string, depth + 1, budget)
        if child_err then
            if not component_teardown.cleanup_pending(child_err) then return child_err end
            pending_error = pending_error or child_err
        else
            if budget.remaining == 0 then
                return owner_page_pending()
            end
            local ok, delete_err = component.system_delete(cid :: string, "reparent_root")
            if delete_err or ok ~= true then
                if not component_teardown.cleanup_pending(delete_err) then
                    return cleanup_error("component owner delete failed for " .. cid, delete_err or "no deletion proof")
                end
                pending_error = pending_error or delete_err
            else
                budget.deleted = budget.deleted + 1
            end
            budget.remaining = budget.remaining - 1
        end
    end
    if budget.remaining == 0 then
        local more, more_err = component.list_system({ meta = { [OWNER] = owner_id },
            include = { meta = false }, limit = 1 })
        if more_err or type(more) ~= "table" then return cleanup_error("component owner continuation scan failed", more_err or "no rows result") end
        if #more > 0 then return owner_page_pending() end
    end
    return pending_error
end

function M.reap(component: any, owner_id: string, budget: Budget): error?
    return reap_owner(component, owner_id, 0, budget)
end

return M
