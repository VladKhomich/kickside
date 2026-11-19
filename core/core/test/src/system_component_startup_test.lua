-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local autoinit = require("autoinit")
local contract = require("contract")
local security = require("security")

local function run(): any
    -- Make the first consumer call as soon as the post-migration hook returns,
    -- before the resident lifecycle service or any suite can provision the fixture.
    local actor = assert(security.new_actor("startup-admin", {security_groups = {"app.security:admin"}}))
    local scope = assert(security.named_scope("wippy.security:process"))
    local threads = assert(assert(contract.get("kickside.core:threads")):with_actor(actor):with_scope(scope):open())
    local id = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "test_sys")
    local thread, err = threads:find({thread_id = id})
    assert(not err, tostring(err))
    assert(thread and thread.id == id, "system component is missing or unreadable after migrations")
    return {status = "success", message = "first scoped request can read the system component"}
end

return {run = run}
