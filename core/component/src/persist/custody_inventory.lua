-- One instance operator explicitly reads one physical page for one implementation.
-- The permission is checked here as well as at the lifecycle report boundary.
local sql = require("sql")
local uuid = require("uuid")
local security = require("security")
local types = require("component_types")
local identity = require("execution_identity")
local M = { MAX_PAGE = 100 }

function M.authorize(): error?
    local denied = errors.new({kind = errors.PERMISSION_DENIED, message = "instance custody inspection requires a direct operator account"})
    local actor, actor_err = security.actor()
    if actor_err or not actor or security.can("component.custody.inspect", types.AUTHZ.COMPONENTS_RESOURCE) ~= true then
        return denied
    end
    local id, id_err = actor:id()
    if id_err then return denied end
    local principal, principal_err = identity.principal_of_key(id)
    if principal_err or not principal or principal.kind ~= identity.KIND.USER then return denied end
    local meta, meta_err = actor:meta()
    if meta_err or type(meta) ~= "table" or meta.access_filter ~= nil or meta.credential_id ~= nil
        or meta.link_id ~= nil or meta.component_id ~= nil or meta.execution_identity ~= nil then return denied end
    return nil
end

function M.components(impl_id: string, after: string?, limit: integer): (table?, error?)
    local auth_err = M.authorize()
    if auth_err then return nil, auth_err end
    if type(impl_id) ~= "string" or impl_id == "" or #impl_id > 512 or (after ~= nil and (type(after) ~= "string" or not uuid.validate(after)))
        or type(limit) ~= "number" or limit < 1 or limit > M.MAX_PAGE or limit % 1 ~= 0 then
        return nil, errors.new({kind = errors.INVALID, message = "invalid component inventory page"})
    end
    -- Order and seek on the full implementation index. With only an equality
    -- and ORDER BY component_id, PostgreSQL can walk the global primary key
    -- and filter arbitrarily many rows from other implementations.
    local page = sql.builder.select("component_id", "owner_type", "secrets_incarnation")
        :from(types.TABLES.COMPONENTS):where("impl_id <= ?", impl_id)
    if after then
        page = page:where("(impl_id, component_id) > (?, ?)", impl_id, after)
    else
        page = page:where("impl_id >= ?", impl_id)
    end
    local db, open_err = sql.get(types.db_id())
    if open_err then return nil, open_err end
    local rows, err = page:order_by("impl_id ASC, component_id ASC"):limit(limit + 1):run_with(db):query()
    local _, release_err = db:release()
    if err or release_err then return nil, err or release_err end
    if type(rows) ~= "table" then return nil, errors.new({kind = errors.INTERNAL, message = "component inventory unavailable"}) end
    local more = #rows > limit
    if more then table.remove(rows) end
    local items: {table} = {}
    for _, row in ipairs(rows) do
        if row.owner_type == "unresolved" then
            local marker = row.secrets_incarnation
            local known = type(marker) == "string" and uuid.validate(marker)
            items[#items + 1] = {component_id = row.component_id, incarnation_known = known,
                incarnation = known and marker or nil}
        end
    end
    return {items = items, inspected = #rows, next_after = more and rows[#rows].component_id or nil}, nil
end

return M
