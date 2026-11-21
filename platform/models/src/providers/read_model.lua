-- Registry read-model for provider adapters and profile presets. Projects the
-- llm.provider, provider_profile_editor, and provider_profile_preset registry
-- entries and cached profiles for admin settings and model-list presentation.

local registry = require("registry")
local models_types = require("models_types")
local provider_registry = require("provider_registry")
local models_repo = require("models_repo")

local M = {}

local function provider_entries(): { any }
    return registry.find({ [".kind"] = "registry.entry", ["meta.type"] = models_types.PROVIDER_TYPE }) or {}
end

local function declared_icon(entry: any): string?
    local meta = entry.meta or {}
    local component = type(meta.component) == "table" and meta.component or {}
    return models_types.icon_name(meta.icon) or models_types.icon_name(component.icon)
end

local function preset_icons(presets: { any }): { [string]: any }
    local by_provider: { [string]: any } = {}
    for _, preset in ipairs(presets) do
        local id = preset.provider_id
        if type(id) == "string" then
            -- Compatible endpoints can share an adapter. Use an icon only if
            -- every preset agrees, otherwise the profile chooses its own.
            local icon = models_types.icon_name(preset.icon) or false
            if by_provider[id] == nil then by_provider[id] = icon
            elseif by_provider[id] ~= icon then by_provider[id] = false end
        end
    end
    return by_provider
end

function M.presets(): { any }
    local entries, err = registry.find({
        [".kind"] = "registry.entry",
        ["meta.type"] = models_types.PROVIDER_PRESET_TYPE,
    })
    if err or not entries then return {} end
    local out = {}
    for _, entry in ipairs(entries) do
        local meta = entry.meta or {}
        local data = entry.data or {}
        table.insert(out, {
            id = entry.id,
            key = data.key or entry.id,
            title = data.title or meta.title or data.key or entry.id,
            description = meta.comment or "",
            icon = models_types.icon_name(data.icon),
            provider_id = data.provider_id,
            config = data.config or {},
            profile_editor_tag = data.profile_editor_tag,
            order = tonumber(data.order) or 100,
            onboarding = data.onboarding ~= false,
        })
    end
    table.sort(out, function(a, b)
        local ao = tonumber(a.order) or 100
        local bo = tonumber(b.order) or 100
        if ao ~= bo then return ao < bo end
        return tostring(a.title) < tostring(b.title)
    end)
    return out
end

function M.adapters(presets: { any }?): { any }
    local editor_entries = registry.find({
        [".kind"] = "registry.entry",
        ["meta.type"] = models_types.PROVIDER_EDITOR_TYPE,
    }) or {}
    local editors_by_provider = {}
    for _, entry in ipairs(editor_entries) do
        local data = entry.data or {}
        if type(data.provider_id) == "string" and data.provider_id ~= "" then
            editors_by_provider[data.provider_id] = {
                tag_name = data.tag_name,
                base_path = data.base_path,
                entry_point = data.entry_point,
            }
        end
    end

    local fallback_icons = preset_icons(presets or M.presets())
    local out = {}
    for _, entry in ipairs(provider_entries()) do
        local meta = entry.meta or {}
        local driver = entry.data and entry.data.driver or {}
        local editor = editors_by_provider[entry.id] or {}
        table.insert(out, {
            id = entry.id,
            name = meta.title or entry.id,
            title = meta.title or entry.id,
            icon = declared_icon(entry) or fallback_icons[entry.id] or nil,
            description = meta.comment or "",
            tags = meta.tags or {},
            driver_id = driver.id,
            discoverable = provider_registry.adapter_for(entry.id) ~= nil,
            profile_editor_tag = editor.tag_name,
            profile_editor_base_path = editor.base_path,
            profile_editor_entry_point = editor.entry_point,
        })
    end
    table.sort(out, function(a, b) return tostring(a.title) < tostring(b.title) end)
    return out
end

local function safe_title(value: any): string?
    if type(value) ~= "string" or #value > 160 or value:find("[%c]") then return nil end
    local title = value:match("^%s*(.-)%s*$")
    return title ~= "" and title or nil
end

function M.badges(): any
    local adapters: { [string]: any } = {}
    local fallback_icons = preset_icons(M.presets())
    for _, entry in ipairs(provider_entries()) do
        adapters[entry.id] = {
            title = safe_title(entry.meta and entry.meta.title),
            icon = declared_icon(entry) or fallback_icons[entry.id] or nil,
        }
    end

    local snapshot = models_repo.snapshot()
    local profiles: { [string]: any } = {}
    for _, profile in ipairs(snapshot and snapshot.profiles or {}) do
        profiles[profile.id] = {
            provider_id = profile.provider_id,
            title = safe_title(profile.name),
            icon = models_types.icon_name(profile.icon),
        }
    end
    return { adapters = adapters, profiles = profiles }
end

function M.badge_for_model(model: any, badges: any): (string?, string?)
    local provider = type(model.providers) == "table" and model.providers[1] or nil
    if type(provider) ~= "table" or type(provider.id) ~= "string" then return nil, nil end
    local adapter = badges.adapters[provider.id] or {}
    local profile = badges.profiles[model.provider_profile_id or provider.provider_profile_id]
    if profile and profile.provider_id == provider.id then
        return profile.title or adapter.title, profile.icon or adapter.icon
    end
    return adapter.title, adapter.icon
end

return M
