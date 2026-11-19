local scope_writer = require("scope_writer")
local trigger_reconcile = require("trigger_reconcile")
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local store = require("scope_store")
local registry = require("registry")
local scope_catalog = require("scope_catalog")

local LIST = "kickside.security.binding:list_scopes_func"

local function listed(result)
    local ids = {}
    for _, scope in ipairs(result.scopes) do ids[#ids + 1] = scope.id end
    table.sort(ids)
    return table.concat(ids, ",")
end

local function define_tests()
    test.describe("member scope catalog", function()
        local projector
        test.before_all(function() projector = scope_writer.start_projector() end)
        test.after_all(function() scope_writer.stop_projector(projector) end)

        test.it("lists the same assignable scopes for a member who cannot read the selected policies", function()
            local slug = "member_catalog_selection"
            test.not_nil((store.upsert({slug = slug, policies = {"app:module_access"}}, "tester")))
            local ok, failure = pcall(function()
                local member = assert(security.new_scope({assert(security.policy("app:member_catalog_caller"))}))
                local actor = security.new_actor("member-catalog-caller", {})
                test.eq(member:evaluate(actor, "registry.get", "app:module_access"), "undefined")

                local reference, reference_err = funcs.new():with_actor(actor):call(LIST, {})
                test.is_nil(reference_err)
                local result, err = funcs.new():with_actor(actor):with_scope(member):call(LIST, {})
                test.is_nil(err)
                test.not_nil(result)
                test.is_true(listed(result):find("kickside.security.scopes:" .. slug, 1, true) ~= nil)
                test.eq(listed(result), listed(reference))
            end)
            store.delete(slug)
            if not ok then error(failure) end
        end)

        test.it("lists a stored scope whose selected policy an update retired", function()
            local slug = "retired_catalog_selection"
            local retired_id = "app:retired_catalog_before"
            local changes = assert(registry.snapshot()):changes()
            changes:create({id = retired_id, kind = "security.policy",
                data = {policy = {actions = "access", resources = "app:retired.catalog", effect = "allow"}}})
            test.is_nil(select(2, changes:apply()))
            test.not_nil((store.upsert({slug = slug, policies = {retired_id, "app:module_access"}}, "tester")))
            local ok, failure = pcall(function()
                changes = assert(registry.snapshot()):changes()
                changes:delete(retired_id)
                test.is_nil(select(2, changes:apply()))

                local scopes, err = scope_catalog.scopes()
                test.is_nil(err)
                local listed_scope
                for _, scope in ipairs(scopes or {}) do
                    if scope.id == "kickside.security.scopes:" .. slug then listed_scope = scope end
                end
                test.not_nil(listed_scope)
                test.eq(#listed_scope.policies, 1)
                test.eq(listed_scope.policies[1].id, "app:module_access")
                test.eq(table.concat(assert(store.get(slug)).policies, ","), retired_id .. ",app:module_access")

                local editable = assert(scope_catalog.scopes({include_unavailable = true}))
                for _, scope in ipairs(editable) do
                    if scope.id == listed_scope.id then listed_scope = scope end
                end
                test.eq(#listed_scope.policies, 2)
                test.eq(listed_scope.policies[1].id, retired_id)
                test.eq(listed_scope.policies[1].available, false)
                test.eq(listed_scope.policies[2].id, "app:module_access")

                local member = assert(security.new_scope({assert(security.policy("app:member_catalog_caller"))}))
                local result, list_err = funcs.new():with_actor(security.new_actor("member-catalog-caller", {}))
                    :with_scope(member):call(LIST, {})
                test.is_nil(list_err)
                test.is_true(listed(result):find("kickside.security.scopes:" .. slug, 1, true) ~= nil)
            end)
            store.delete(slug)
            if registry.get(retired_id) then
                changes = assert(registry.snapshot()):changes()
                changes:delete(retired_id)
                test.is_nil(select(2, changes:apply()))
            end
            if not ok then error(failure) end
        end)

        test.it("allows edits to retain an unavailable policy only in its saved role", function()
            local slug = "retired_role_edit"
            local retired_id = "app:retired_role_edit_policy"
            local changes = assert(registry.snapshot()):changes()
            changes:create({id = retired_id, kind = "security.policy",
                data = {policy = {actions = "access", resources = "app:retired.edit", effect = "allow"}}})
            test.is_nil(select(2, changes:apply()))
            local selection = {retired_id, "app:module_access"}
            test.not_nil(assert(store.upsert({slug = slug, policies = selection}, "tester")))
            local ok, failure = pcall(function()
                changes = assert(registry.snapshot()):changes()
                changes:delete(retired_id)
                test.is_nil(select(2, changes:apply()))

                local saved, save_err = store.upsert({slug = slug, label = "Renamed role", policies = selection}, "tester")
                test.is_nil(save_err)
                test.eq(saved.label, "Renamed role")
                test.eq(table.concat(saved.policies, ","), table.concat(selection, ","))

                local copy, copy_err = store.upsert({slug = slug .. "_copy", policies = selection}, "tester")
                test.is_nil(copy)
                test.is_true(errors.is(copy_err, errors.NOT_FOUND), tostring(copy_err))

                local moved, move_err = store.upsert({slug = slug, target = "app.security:user", policies = selection}, "tester")
                test.is_nil(moved)
                test.is_true(errors.is(move_err, errors.NOT_FOUND), tostring(move_err))

                local removed = assert(store.upsert({slug = slug, policies = {"app:module_access"}}, "tester"))
                test.eq(table.concat(removed.policies, ","), "app:module_access")
                local restored, restore_err = store.upsert({slug = slug, policies = selection}, "tester")
                test.is_nil(restored)
                test.is_true(errors.is(restore_err, errors.NOT_FOUND), tostring(restore_err))
            end)
            store.delete(slug)
            store.delete(slug .. "_copy")
            if registry.get(retired_id) then
                changes = assert(registry.snapshot()):changes()
                changes:delete(retired_id)
                test.is_nil(select(2, changes:apply()))
            end
            if not ok then error(failure) end
        end)
    end)
end

return {run = test.run_cases(define_tests)}
