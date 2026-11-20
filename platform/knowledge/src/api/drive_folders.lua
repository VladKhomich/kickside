-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local security = require("security")
local registry = require("registry")
local funcs = require("funcs")
local json = require("json")
local component = require("component")
local http_errors = require("http_errors")

local BROWSE = "kickside.google.source:browse_drive_folders"
local SINK = "kickside.knowledge.sink:kb_upload"

local function sync_requires_reconcile_delays(): boolean
    local dependency = registry.get("kickside.sync:dep.kickside.automation")
    local data = dependency and dependency.data
    if type(data) ~= "table" or data.component ~= "kickside/automation" or type(data.version) ~= "string" then
        return false
    end
    -- Sync declares a minimum version. Automation 0.2.37 first honored the
    -- provider's retry delay when enumerating keys for reconciliation.
    local major, minor, patch = data.version:match("^>=%s*(%d+)%.(%d+)%.(%d+)$")
    local major_version, minor_version, patch_version = tonumber(major), tonumber(minor), tonumber(patch)
    if not major_version or not minor_version or not patch_version then return false end
    return major_version > 0 or minor_version > 2 or (minor_version == 2 and patch_version >= 37)
end

local function available(): boolean
    if not registry.get(BROWSE) or not registry.get("kickside.sync:sync_prepare_install")
        or not sync_requires_reconcile_delays() then
        return false
    end
    local sink = registry.get(SINK)
    local schema = sink and sink.data and sink.data.input_schema
    if type(schema) == "string" then schema = json.decode(schema) end
    -- The upload-only revision of this sink cannot admit provider attachments.
    return type(schema) == "table" and type(schema.properties) == "table"
        and schema.properties.attachment ~= nil
end

local function reject(res: any, status: number, message: string)
    res:set_status(status)
    res:write_json({success = false, error = message})
end

local function handle(browse: boolean)
    local req, res = http.request(), http.response()
    if not req or not res then return nil, "no HTTP context" end
    res:set_content_type(http.CONTENT.JSON)
    res:set_header("Cache-Control", "no-store")

    local actor = security.actor()
    if not actor then
        return reject(res, http.STATUS.UNAUTHORIZED, "Authentication required")
    end
    local kb_id = req:param("id")
    if type(kb_id) ~= "string" or kb_id == "" then
        return reject(res, http.STATUS.BAD_REQUEST, "Knowledge base ID is required")
    end
    local _, access_err = component.validate_access(kb_id, component.ACCESS.WRITE)
    if access_err then
        return reject(res, http_errors.classify(access_err), tostring(access_err))
    end
    if not browse then
        local enabled = available()
        res:write_json({success = true, available = enabled, actor_id = enabled and actor:id() or nil})
        return
    end
    if not available() then
        return reject(res, http.STATUS.SERVICE_UNAVAILABLE, "Google Drive folder sync is unavailable")
    end

    local body, read_err = req:body_json()
    if read_err or type(body) ~= "table" then
        return reject(res, http.STATUS.BAD_REQUEST, "A Drive listing request is required")
    end
    -- Inherit the authenticated caller. The provider opens this connection with
    -- component READ and checks the granted Google OAuth scope on each request.
    local result, err = funcs.call(BROWSE, {
        action = body.action, connection_id = body.connection_id, drive_id = body.drive_id,
        parent_id = body.parent_id, cursor = body.cursor,
    })
    if err then return reject(res, http_errors.classify(err), err:message()) end
    if not result then return reject(res, http.STATUS.SERVICE_UNAVAILABLE, "Drive returned no folders") end
    res:write_json({success = true, items = result.items, parent = result.parent, next_cursor = result.next_cursor})
end

return {
    availability = function() return handle(false) end,
    browse = function() return handle(true) end,
}
