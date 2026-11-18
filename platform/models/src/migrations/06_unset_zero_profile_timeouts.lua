-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local time = require("time")

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

                    local remove_timeout = engine == "postgres" and "(config_json::jsonb - 'timeout')::text"
                        or "json_remove(config_json, '$.timeout')"
                    for _, row in ipairs(rows) do
                        local config, decode_err = json.decode(row.config_json)
                        if decode_err or type(config) ~= "table" then
                            error("invalid stored model provider configuration")
                        end
                        local timeout = config.timeout
                        local duration = type(timeout) == "string" and time.parse_duration(timeout)
                        if tonumber(timeout) == 0 or (duration and duration:seconds() == 0) then
                            local _, write_err = db:execute("UPDATE kickside_model_provider_profiles SET config_json = "
                                .. remove_timeout .. " WHERE id = $1", {row.id})
                            if write_err then error(write_err) end
                        end
                    end
                    return rows[#rows].id
                end, "batch")
            end)
        end
    end)
end)
