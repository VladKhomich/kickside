-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
local response: any = nil
local failure: any = nil
local request_timeout: string? = nil
local probe_response: any = nil
local probe_request: { url: string, body: string }? = nil
function M.prepare(value: any, err: any)
    response, failure = value, err
    probe_response, probe_request = nil, nil
    request_timeout = nil
end
function M.prepare_probe(model_list: string)
    M.prepare({ status_code = 200, body = model_list }, nil)
    probe_response = { status_code = 200, body = "{}" }
end
function M.timeout(): string?
    return request_timeout
end
function M.get(_url: string, opts: any): (any?, any?)
    request_timeout = opts and opts.timeout
    return response, failure
end
function M.post(url: string, opts: any): (any?, any?)
    request_timeout = opts and opts.timeout
    if probe_response then
        probe_request = { url = url, body = opts.body }
        return probe_response
    end
    return response, failure
end
function M.probe(): { url: string, body: string }?
    return probe_request
end
return M
