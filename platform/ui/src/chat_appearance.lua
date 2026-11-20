-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local M = {}

local function has_only_fields(value: any, fields: { [string]: boolean }): boolean
    if type(value) ~= "table" then return false end
    for key in pairs(value) do
        if not fields[key] then return false end
    end
    return true
end

local function valid_agent_id(id: any): boolean
    return type(id) == "string" and #id <= 256
        and string.match(id, "^[%w_.%-]+:[%w_.%-]+$") ~= nil
end

local function profile_error(profile: any): string?
    if not has_only_fields(profile, {
        intro = true, markdown = true, markdown_alignment = true, show_message = true, show_agent_picker = true,
        allowed_agents = true, default_agent = true,
    }) then
        return "Invalid chat settings"
    end
    if profile.intro ~= "default" and profile.intro ~= "markdown" and profile.intro ~= "hidden" then
        return "Choose a valid chat intro"
    end
    if type(profile.markdown) ~= "string" or #profile.markdown > 32768 then
        return "The chat intro must be at most 32 KiB"
    end
    if profile.intro == "markdown" and not string.find(profile.markdown, "%S") then
        return "Enter Markdown for the custom intro"
    end
    local alignment = profile.markdown_alignment
    if alignment ~= nil and alignment ~= "left" and alignment ~= "center" and alignment ~= "right" then
        return "Choose left, center, or right for the Markdown alignment"
    end
    if type(profile.show_message) ~= "boolean" or type(profile.show_agent_picker) ~= "boolean" then
        return "Chat field visibility must be true or false"
    end
    local selected: { [string]: boolean } = {}
    local ids = profile.allowed_agents
    if ids ~= nil then
        if type(ids) ~= "table" or #ids < 1 or #ids > 100 then
            return "Select between 1 and 100 agents"
        end
        for index, id in pairs(ids) do
            if type(index) ~= "number" or index % 1 ~= 0 or index < 1 or index > #ids
                or not valid_agent_id(id) or selected[id] then
                return "Select unique, valid agent IDs"
            end
            selected[id] = true
        end
        for index = 1, #ids do
            if ids[index] == nil then return "The agent list must be contiguous" end
        end
    end
    local default_agent = profile.default_agent
    if default_agent ~= nil and not valid_agent_id(default_agent) then
        return "Choose a valid default agent"
    end
    if not profile.show_agent_picker then
        if default_agent == nil then return "Choose a default agent before hiding the picker" end
        if ids ~= nil and not selected[default_agent] then return "Include the default agent in the list" end
    end
    return nil
end

function M.validate(args: any): any
    local value = args.value
    if not has_only_fields(value, { navigation = true, sessions = true, sidebar = true }) then
        return { valid = false, error = "Invalid chat appearance settings" }
    end
    local nav = value.navigation
    if not has_only_fields(nav, { visible = true, placement = true })
        or type(nav.visible) ~= "boolean"
        or (nav.placement ~= "first" and nav.placement ~= "last") then
        return { valid = false, error = "Choose whether to show New chat and put it first or last" }
    end
    local sessions_error = profile_error(value.sessions)
    if sessions_error then return { valid = false, error = "Sessions page: " .. sessions_error } end
    local sidebar_error = profile_error(value.sidebar)
    if sidebar_error then return { valid = false, error = "Sidebar chat: " .. sidebar_error } end
    return { valid = true }
end

return M
