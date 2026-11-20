local store = require("workflow_store")
local component = require("component")
local json = require("json")
local types = require("types")

local M = {}
local MAX_PAGE_SIZE = 100

local function failure_message(value: any): string?
    if type(value) ~= "string" or value == "" then return nil end
    local decoded = select(1, json.decode(value))
    if type(decoded) == "table" and type(decoded.message) == "string" then
        return decoded.message
    end
    return value
end

function M.lookup(automation_id: string, keys: { string }): (any?, any?)
    if #keys == 0 then return {}, nil end
    if #keys > MAX_PAGE_SIZE then return nil, "Workflow history exceeds the page size" end
    local selects: { string } = {}
    local args: { string } = {}
    for _, key in ipairs(keys) do
        local first = #args + 1
        args[first], args[first + 1] = automation_id, key
        -- Two candidates detect ambiguity across Workflows without reading all
        -- runs sharing a key. Check admission and origin after the bounded read.
        selects[#selects + 1] = "SELECT * FROM (SELECT workflow_id,run_id,dedup_key,status,error,"
            .. " admission_state,origin,trigger_kind,binding_id,binding_revision"
            .. " FROM " .. types.TABLES.RUNS
            .. " WHERE trigger_id=$" .. tostring(first)
            .. " AND dedup_key=$" .. tostring(first + 1)
            .. " AND dedup_key IS NOT NULL AND superseded_by IS NULL"
            .. " ORDER BY workflow_id LIMIT 2) AS matches"
    end
    local db, db_err = store.open_db()
    if not db then return nil, db_err end
    local rows, read_err = db:query(table.concat(selects, " UNION ALL "), args)
    db:release()
    if read_err then return nil, read_err end

    local candidates: { [string]: any } = {}
    for _, row in ipairs(rows or {}) do
        local key = row.dedup_key
        if candidates[key] == nil then candidates[key] = row else candidates[key] = false end
    end
    local eligible: { [string]: any } = {}
    local workflow_ids: { string } = {}
    local seen: { [string]: boolean } = {}
    for key, row in pairs(candidates) do
        if row and row.admission_state == "admitted" and row.origin == "automation"
            and row.trigger_kind == "binding" and row.binding_id == automation_id
            and (tonumber(row.binding_revision) or 0) > 0 then
            local id = row.workflow_id
            eligible[key] = row
            if not seen[id] then
                seen[id] = true
                workflow_ids[#workflow_ids + 1] = id
            end
        end
    end
    if #workflow_ids == 0 then return {}, nil end
    local permitted, access_err = component.query({
        component_ids = workflow_ids, access_mask = component.ACCESS.READ,
        include = { meta = false }, limit = #workflow_ids,
    })
    if access_err then return nil, access_err end
    local access: { [string]: boolean } = {}
    for _, row in ipairs(permitted or {}) do access[row.component_id] = true end
    local out: { [string]: any } = {}
    for key, row in pairs(eligible) do
        if access[row.workflow_id] then
            out[key] = {
                workflow_id = row.workflow_id, run_id = row.run_id, status = row.status,
                error = types.RUN_TERMINAL[row.status] and failure_message(row.error) or nil,
            }
        end
    end
    return out, nil
end

return M
