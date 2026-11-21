local http = require("http")
local http_params = require("http_params")
local http_errors = require("http_errors")
local inventory = require("inventory")

local function handle()
    local req, res = http.request(), http.response()
    res:set_content_type(http.CONTENT.JSON)
    res:set_header("Cache-Control", "no-store")
    local limit, err = http_params.query_int(req, "limit", 50, {min = 1, max = 100})
    if err then http_params.bad_request(res, err:message(), err); return end
    local page, read_err = inventory.read({view = req:query("view"), impl_id = req:query("impl_id"),
        limit = limit, cursor = req:query("cursor")})
    if read_err then
        local status = http_errors.for_error(read_err)
        res:set_status(status)
        if status >= 500 then res:write_json({error = "custody inventory unavailable"}); return end
        res:write_json(http_errors.response(read_err))
        return
    end
    res:write_json(page)
end
return {handle = handle}
