local store = require("store")
local json = require("json")
local models_types = require("models_types")

local M = {}
-- Decoded indexes share the lifetime of the published snapshot.
local cached_raw, cached_snapshot

local function indexed(snapshot)
    snapshot.profiles_by_id = {}
    for _, profile in ipairs(snapshot.profiles or {}) do
        snapshot.profiles_by_id[profile.id] = profile
    end
    return snapshot
end

function M.read(): any?
    local s, err = store.get(models_types.CACHE_ID)
    if err or not s then return nil end
    local raw = s:get(models_types.CACHE_KEY)
    s:release()
    if raw == nil then
        cached_raw, cached_snapshot = nil, nil
        return nil
    end
    raw = tostring(raw)
    if raw == cached_raw then return cached_snapshot end
    local decoded, derr = json.decode(raw)
    if derr or type(decoded) ~= "table" then return nil end
    cached_raw, cached_snapshot = raw, indexed(decoded)
    return cached_snapshot
end

function M.replace(snapshot: any): ()
    local s, err = store.get(models_types.CACHE_ID)
    if err or not s then return end
    s:set(models_types.CACHE_KEY, json.encode(snapshot or {}), 0)
    s:release()
    cached_raw, cached_snapshot = nil, nil
end

function M.clear(): ()
    local s, err = store.get(models_types.CACHE_ID)
    if err or not s then return end
    cached_raw, cached_snapshot = nil, nil
    s:delete(models_types.CACHE_KEY)
    s:release()
end

return M
