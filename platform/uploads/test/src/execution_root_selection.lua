-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local provision = require("provision")
local events = require("events")
return {run = function(args: any): (any?, error?)
    if args.operation == "emit" then
        return events.emit(security.actor():id(), events.TYPE.DELETED,
            {upload_id = args.upload_id}, args.upload_id)
    end
    if args.operation == "identity" then return security.actor():meta().execution_identity, nil end
    if args.operation == "provision" then
        return provision.ensure_user(security.actor(), security.scope(), security.actor():id())
    end
    if args.operation == "catchup" then
        local threads = assert(assert(contract.get("kickside.core:threads"))
            :with_actor(security.actor()):with_scope(security.scope()):open())
        return threads:catch_up_projection({thread_id = args.component_id,
            kind = "kickside.uploads:summary", projection_key = "default", cursor_key = "default", max_ticks = 20})
    end
end}
