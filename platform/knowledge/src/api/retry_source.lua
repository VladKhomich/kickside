-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local json = require("json")
local security = require("security")
local http_errors = require("http_errors")
local reingest = require("reingest")

local function handler()
    local req, res = http.request(), http.response()
    if not req or not res then return nil, "failed to get http context" end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() then
        res:set_status(http.STATUS.UNAUTHORIZED)
        res:write_json({success = false, error = "authentication required"})
        return
    end
    local raw, read_err = req:body()
    local body, decode_err
    if not read_err and type(raw) == "string" and #raw <= 1024 then body, decode_err = json.decode(raw) end
    if decode_err or type(body) ~= "table" or type(body.node_id) ~= "string"
        or type(body.failed_event_id) ~= "string" then
        res:set_status(http.STATUS.BAD_REQUEST)
        res:write_json({success = false, error = "node_id and failed_event_id are required"})
        return
    end

    local queued, err = reingest.retry_failed_source(req:param("id") or "", body.node_id, body.failed_event_id)
    if err then
        res:set_status((http_errors.classify(err)))
        res:write_json({success = false, error = tostring(err)})
        return
    end
    res:set_status(http.STATUS.ACCEPTED)
    res:write_json(queued)
end

return {handler = handler}
