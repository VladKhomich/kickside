local http = require("http")
local json = require("json")
local card_service = require("card_service")

local function handler()
    local req = http.request()
    local res = http.response()
    if not req or not res then return nil, "Failed to get HTTP context" end
    res:set_content_type(http.CONTENT.JSON)

    local raw, raw_err = req:body()
    if raw_err or type(raw) ~= "string" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = "Invalid request body: " .. tostring(raw_err) })
        return
    end
    local data, err = json.decode(raw)
    if err then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = "Invalid JSON: " .. tostring(err) })
        return
    end

    local card, cerr = card_service.save(data)
    if not card then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({ success = false, error = cerr })
        return
    end
    res:set_status(http.STATUS.OK)
    res:write_json({ success = true, model = card })
end

return { handler = handler }
