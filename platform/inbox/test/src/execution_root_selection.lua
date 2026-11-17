-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local provision = require("provision")
return {run = function(args: any): (any?, error?)
    if args.operation == "identity" then
        local inherited = security.actor():meta().execution_identity
        return {component_id = inherited.component_id, authorized_by = inherited.authorized_by,
            credential_id = inherited.credential_id, link_id = inherited.link_id,
            can_create_actor = security.can("security.actor.create", security.actor():id())}, nil
    end
    if args.operation == "provision" then
        return provision.ensure_user(security.actor(), security.scope(), security.actor():id())
    end
    if args.operation == "catchup" then
        local threads = assert(assert(contract.get("kickside.core:threads"))
            :with_actor(security.actor()):with_scope(security.scope()):open())
        return threads:catch_up_projection({thread_id = args.component_id,
            kind = "kickside.inbox:items", projection_key = "default", cursor_key = "default", max_ticks = args.max_ticks or 20})
    end
end}
