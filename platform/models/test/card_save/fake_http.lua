-- Recording stand-in for the http module: the admin handlers under test read
-- their request body from here and report status and payload back to it.
local M = { CONTENT = { JSON = "application/json" }, STATUS = { OK = 200, BAD_REQUEST = 400 } }
local raw_body: any = nil
local params: any = {}
local last_status: number = 200
local last_payload: any = nil

function M.prepare(raw: any, request_params: any?): ()
    raw_body = raw
    params = request_params or {}
    last_status = 200
    last_payload = nil
end

function M.request(): any
    return {
        body = function(_self: any): (any, any) return raw_body, nil end,
        param = function(_self: any, key: string): any return params[key] end,
    }
end

function M.response(): any
    return {
        set_header = function(): () end,
        set_content_type = function(): () end,
        set_status = function(_self: any, code: number): () last_status = code end,
        write_json = function(_self: any, value: any): () last_payload = value end,
    }
end

function M.status(): number return last_status end
function M.payload(): any return last_payload end

return M
