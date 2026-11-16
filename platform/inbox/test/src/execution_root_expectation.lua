-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local contract = require("contract")
local security = require("security")
local uuid = require("uuid")
local component = require("component")
local identity = require("test_identity")
local registry = require("registry")
local sql = require("sql")
local execution_identity = require("execution_identity")

local function fixture(restricted: boolean?): (any, any, any, string, string, string)
    local user = "inbox-root-" .. uuid.v4()
    identity.ensure_user(user)
    local scope = assert(security.new_scope({assert(security.policy("app:inbox_provision_owner"))}))
    local actor = assert(security.new_actor(user, {}))
    test.eq(scope:evaluate(actor, "security.actor.create", user), "undefined")
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
        assert(component.singleton_component_id(user, "kickside.inbox"))
end

local function deliver(caller: any, key: string): any
    local result, err = caller:call("kickside.inbox.sink:inbox_write", {
        origin = "inbox-root-expectation", input = {content = key},
        identity_key = key, idempotency_key = key,
    })
    test.is_nil(err)
    test.is_true(result.success, tostring(result.error))
    return result
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
    test.describe("Inbox independent execution root expectation", function()
        test.it("projects a later delivery after deleting the component that first created the Inbox", function()
            local fresh, framed, service, user, root, inbox = fixture()
            deliver(framed, "before-delete")
            local stored = assert(component.get_private_context(inbox))._execution_identity
            test.eq(stored.authorized_by.id, user)
            local before, before_err = fresh:call("app:inbox_select_identity_probe", {operation = "catchup", component_id = inbox})
            test.is_nil(before_err, "initial projection: " .. tostring(before_err))
            test.eq(before.last_seq, before.event_count)
            remove(service, root)
            test.is_true((component.validate_identity_authorizer_admin(inbox, {kind = "user", id = user}, {})))
            local result = deliver(fresh, "after-delete")
            local projected, projection_err = fresh:call("app:inbox_select_identity_probe", {operation = "catchup", component_id = inbox})
            test.is_nil(projection_err, "projection after deleting creator: " .. tostring(projection_err))
            test.eq(projected.last_seq, projected.event_count, tostring(projected.error))
            local item, read_err = fresh:call("app:inbox_read_probe", {id = result.dest_ref.item_id})
            test.is_nil(read_err)
            test.eq(item.content, "after-delete")
            test.eq(assert(component.get_private_context(inbox))._execution_identity.component_id, inbox)
            remove(service, inbox)
        end)
        test.it("keeps delegated singleton work subject to the authorizer's live delegation", function()
            local fresh, _, service, user, root, inbox = fixture()
            local authorizer = "inbox-delegate-" .. uuid.v4()
            identity.ensure_user(authorizer)
            local grant = assert(service:grant_subtree({root_component_id = root,
                subject = {subject_id = authorizer, subject_type = "user"}, access_mask = 8}))
            test.is_true(grant.success)
            local policy_id = execution_identity.delegation_policy_id("user", user, root)
            local changes = assert(registry.snapshot()):changes()
            changes:create({id = policy_id, kind = "security.policy",
                meta = {managed_by = "kickside.security", intent = "execution_delegation"},
                data = {groups = {"wippy.security:process"}, policy = {
                    actions = execution_identity.DELEGATE_ACTION, resources = "*", effect = "allow",
                    conditions = {{field = "resource", operator = "eq",
                        value = execution_identity.delegation_bytes("user", user, root)}}}}})
            assert(changes:apply())
            local inherited = {version = 2, principal = {kind = "user", id = user},
                authorized_by = {kind = "user", id = authorizer}, component_id = root,
                captured_at = "2026-11-16T00:00:00Z"}
            local provisioned, provision_err = execution_identity.run_as(inherited,
                "app:inbox_select_identity_probe", {operation = "provision"},
                {deferred_owner = "kickside.core.projections:tick"})
            test.is_nil(provision_err, tostring(provision_err))
            test.not_nil(provisioned)
            local stored = assert(component.get_private_context(inbox))._execution_identity
            test.eq(stored.component_id, root)
            test.eq(stored.principal.id, user)
            test.eq(stored.authorized_by.id, authorizer)
            local admitted, admission_err = execution_identity.authorize(stored,
                {deferred_owner = "kickside.core.projections:tick"})
            test.is_nil(admission_err, tostring(admission_err))
            test.not_nil(admitted)
            deliver(fresh, "delegated-before-revoke")
            local before, before_err = fresh:call("app:inbox_select_identity_probe", {operation = "catchup", component_id = inbox})
            test.is_nil(before_err, tostring(before_err))
            test.eq(before.last_seq, before.event_count)
            changes = assert(registry.snapshot()):changes()
            changes:delete(policy_id)
            -- The harness baseline allows all actions. An explicit revocation
            -- also denies that ambient delegation for this exact principal/root.
            changes:create({id = policy_id .. "_revoked", kind = "security.policy",
                data = {groups = {"wippy.security:process"}, policy = {
                    actions = execution_identity.DELEGATE_ACTION, resources = "*", effect = "deny",
                    conditions = {{field = "resource", operator = "eq",
                        value = execution_identity.delegation_bytes("user", user, root)}}}}})
            assert(changes:apply())
            local revoked, revoke_err = execution_identity.authorize(stored,
                {deferred_owner = "kickside.core.projections:tick"})
            test.is_nil(revoked)
            test.is_true(errors.is(revoke_err, errors.PERMISSION_DENIED), tostring(revoke_err))
            deliver(fresh, "delegated-after-revoke")
            local after, after_err = fresh:call("app:inbox_select_identity_probe",
                {operation = "catchup", component_id = inbox, max_ticks = 1})
            test.is_nil(after)
            test.not_nil(after_err)
            local db = assert(sql.get("app:db"))
            local cursors = assert(db:query("SELECT last_seq FROM kickside_projection_cursor WHERE id=$1", {before.cursor_id}))
            assert(db:release())
            test.eq(tonumber(cursors[1].last_seq), before.last_seq)
            remove(service, inbox)
            remove(service, root)
            changes = assert(registry.snapshot()):changes()
            changes:delete(policy_id .. "_revoked")
            assert(changes:apply())
        end)
        test.it("provisions its own owner identity without losing credential or link restrictions", function()
            local fresh, framed, service, user, root, inbox = fixture(true)
            local result, err = framed:call("app:inbox_select_identity_probe", {operation = "provision"})
            test.is_nil(err)
            test.not_nil(result)
            local stored = assert(component.get_private_context(inbox))._execution_identity
            test.eq(stored.component_id, inbox)
            test.eq(stored.principal.kind, "user")
            test.eq(stored.principal.id, user)
            test.eq(stored.authorized_by.kind, "user")
            test.eq(stored.authorized_by.id, user)
            local inherited = assert(framed:call("app:inbox_select_identity_probe", {operation = "identity"}))
            test.eq(inherited.component_id, root)
            test.eq(inherited.authorized_by.id, user)
            test.is_false(inherited.can_create_actor)
            test.eq(stored.credential_id, inherited.credential_id)
            test.eq(stored.link_id, inherited.link_id)
            -- Idempotent provisioning does not replace an existing identity.
            test.not_nil(fresh:call("app:inbox_select_identity_probe", {operation = "provision"}))
            local unchanged = assert(component.get_private_context(inbox))._execution_identity
            test.eq(unchanged.captured_at, stored.captured_at)
            test.eq(unchanged.credential_id, stored.credential_id)
            test.eq(unchanged.link_id, stored.link_id)
            remove(service, root)
            remove(service, inbox)
        end)
    end)
end)}
