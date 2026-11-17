-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local contract = require("contract")
local security = require("security")
local uuid = require("uuid")
local component = require("component")
local sql = require("sql")
local process = require("process")
local channel = require("channel")

local function fixture(restricted: boolean?): (any, any, any, string, string, string)
    local user = "uploads-root-" .. uuid.v4()
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$1,'test-only','active')]], {user, user .. "@uploads.test"}))
    for _, group in ipairs({"app:uploads_test", "wippy.security:process"}) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {user, group}))
    end
    assert(db:release())
    local scope = assert(security.named_scope("wippy.security:process"))
    local actor = assert(security.new_actor(user, {}))
    local service = assert(assert(contract.get("kickside.component:component_service"))
        :with_actor(actor):with_scope(scope):open())
    local source = assert(service:register({impl_id = "kickside.core:thread"}))
    test.is_true(source.success)
    local root = source.component_id
    -- Model the admitted owner identity carried by a Workflow/component frame.
    local captured = {version = 2, principal = {kind = "user", id = user},
        authorized_by = {kind = "user", id = user}, component_id = root,
        captured_at = "2026-11-16T00:00:00Z"}
    if restricted then
        captured.credential_id = uuid.v4()
        captured.link_id = uuid.v4()
    end
    local framed_actor = assert(security.new_actor(user,
        {principal = captured.principal, execution_identity = captured}))
    local framed = funcs.new():with_actor(framed_actor):with_scope(scope)
    local fresh = funcs.new():with_actor(actor):with_scope(scope)
    return fresh, framed, service, user, root,
        assert(component.singleton_component_id(user, "kickside.uploads"))
end

local function deliver(caller: any, key: string): any
    local id = uuid.v4()
    local result, err = caller:call("app:uploads_select_identity_probe", {operation = "emit", upload_id = id})
    test.is_nil(err)
    test.is_true(result)
    return id
end

local function remove(service: any, id: string)
    local result, err = service:delete({component_id = id})
    test.is_nil(err)
    test.is_true(result.success, tostring(result.error))
    local cleaned, cleanup_err = funcs.call("kickside.component:delete_worker", {payload = {component_id = id}})
    test.is_nil(cleanup_err)
    test.is_true(cleaned.deleted)
end

return {run = test.run_cases(function()
    test.describe("Uploads independent execution root expectation", function()
        local pool, pool_events
        test.after_each(function()
            if not pool then return end
            assert(process.cancel(pool, "5s"))
            while true do
                local event = channel.select({pool_events:case_receive()}).value
                if tostring(event.from) == pool and event.kind == process.event.EXIT then break end
            end
            pool = nil
        end)
        test.it("projects a later delivery after deleting the component that first created the Uploads", function()
            pool_events = process.events()
            pool = tostring(assert(process.spawn_monitored("app.uploads_suites.persist:projection_jobs_pool", "app:processes")))
            local fresh, framed, service, user, root, uploads = fixture()
            deliver(framed, "before-delete")
            local stored = assert(component.get_private_context(uploads))._execution_identity
            test.eq(stored.authorized_by.id, user)
            local before, before_err = fresh:call("app:uploads_select_identity_probe", {operation = "catchup", component_id = uploads})
            test.is_nil(before_err, "initial projection: " .. tostring(before_err))
            test.eq(before.last_seq, before.event_count)
            remove(service, root)
            test.is_true((component.validate_identity_authorizer_admin(uploads, {kind = "user", id = user}, {})))
            local result = deliver(fresh, "after-delete")
            local projected, projection_err = fresh:call("app:uploads_select_identity_probe", {operation = "catchup", component_id = uploads})
            test.is_nil(projection_err, "projection after deleting creator: " .. tostring(projection_err))
            test.eq(projected.last_seq, projected.event_count, tostring(projected.error))
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT status FROM kickside_upload_read_model WHERE upload_id=$1", {result}))
            assert(db:release())
            test.eq(rows[1].status, "deleted")
            test.eq(assert(component.get_private_context(uploads))._execution_identity.component_id, uploads)
            remove(service, uploads)
        end)
        test.it("provisions its own owner identity without losing credential or link restrictions", function()
            local fresh, framed, service, user, root, uploads = fixture(true)
            local result, err = framed:call("app:uploads_select_identity_probe", {operation = "provision"})
            test.is_nil(err)
            test.not_nil(result)
            local stored = assert(component.get_private_context(uploads))._execution_identity
            test.eq(stored.component_id, uploads)
            test.eq(stored.principal.kind, "user")
            test.eq(stored.principal.id, user)
            test.eq(stored.authorized_by.kind, "user")
            test.eq(stored.authorized_by.id, user)
            local inherited = assert(framed:call("app:uploads_select_identity_probe", {operation = "identity"}))
            test.eq(inherited.component_id, root)
            test.eq(inherited.authorized_by.id, user)
            test.eq(stored.credential_id, inherited.credential_id)
            test.eq(stored.link_id, inherited.link_id)
            -- Idempotent provisioning does not replace an existing identity.
            test.not_nil(fresh:call("app:uploads_select_identity_probe", {operation = "provision"}))
            local unchanged = assert(component.get_private_context(uploads))._execution_identity
            test.eq(unchanged.captured_at, stored.captured_at)
            test.eq(unchanged.credential_id, stored.credential_id)
            test.eq(unchanged.link_id, stored.link_id)
            remove(service, root)
            remove(service, uploads)
        end)
    end)
end)}
