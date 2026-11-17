-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local policy = require("catalog_policy")

local function run(profile_rows: { any }): { any }
    local profiles = {}
    for _, row in ipairs(profile_rows) do
        local r = row :: any
        local secret, secret_err = policy.decrypt_secret(r.secret_json)
        local config, config_err = policy.decode_json(r.config_json, {})
        local load_err = secret_err or config_err
        local profile = {
            id = r.id,
            name = r.name,
            provider_id = r.provider_id,
            config = config,
            secret_config = secret,
            enabled = tonumber(r.enabled) ~= 0 and load_err == nil,
            error = load_err and tostring(load_err) or nil,
            status = r.status,
            message = r.message,
            last_discovered_at = tonumber(r.last_discovered_at),
            created_at = tonumber(r.created_at),
            updated_at = tonumber(r.updated_at),
        }
        table.insert(profiles, profile)
    end
    return profiles
end

return { run = run }
