-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local logger = require("logger")
local time = require("time")

local log = logger:named("kickside.models.migrations")

local function uses_default(value: any): boolean
    if value == false or tonumber(value) == 0 then return true end
    if type(value) ~= "string" then return false end
    local duration = time.parse_duration(value)
    return duration ~= nil and duration:nanoseconds() == 0
end

return require("migration").define(function()
    migration("unset zero provider profile timeouts", function()
        for _, engine in ipairs({"sqlite", "postgres"}) do
            database(engine, function()
                up(function(db, cursor)
                    local rows, read_err = db:query([[SELECT id, config_json
                        FROM kickside_model_provider_profiles WHERE id > $1 ORDER BY id LIMIT 50]]
                        .. (engine == "postgres" and " FOR UPDATE" or ""), {cursor or ""})
                    if read_err then error(read_err) end
                    if #rows == 0 then return nil end

                    for _, row in ipairs(rows) do
                        local config, decode_err = json.decode(row.config_json)
                        if decode_err or type(config) ~= "table" then
                            log:warn("skipping unreadable provider profile configuration", {profile_id = row.id})
                        elseif uses_default(config.timeout) then
                            config.timeout = nil
                            local encoded, encode_err = json.encode(config)
                            if encode_err then error(encode_err) end
                            local _, write_err = db:execute(
                                "UPDATE kickside_model_provider_profiles SET config_json = $1 WHERE id = $2",
                                {encoded, row.id})
                            if write_err then error(write_err) end
                        end
                    end
                    return rows[#rows].id
                end, "batch")
            end)
        end
    end)
end)
