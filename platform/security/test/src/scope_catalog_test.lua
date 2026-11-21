local test = require("test")
local scope_catalog = require("scope_catalog")

-- The harness seeds policy fixtures: test_admin (group app.security:admin),
-- user.app_shell_access + user.runtime_registry_read (group app.security:user),
-- and ingress.endpoint_access (group app.security:ingress, meta.internal = true).
local function define_tests()
    test.describe("scope catalog", function()
        test.it("surfaces built-in roles and excludes internal scopes by default", function()
            local scopes = scope_catalog.scopes()
            local by_id = {}
            for _, s in ipairs(scopes or {}) do by_id[s.id] = s end
            test.not_nil(by_id["app.security:user"])
            test.not_nil(by_id["app.security:admin"])
            test.eq(by_id["app.security:user"].label, "User")
            test.eq(
                by_id["app.security:user"].description,
                "Standard signed-in member. Grants the product surfaces every package contributes to the user scope."
            )
            test.eq(by_id["app.security:admin"].label, "Administrator")
            test.eq(
                by_id["app.security:admin"].description,
                "Full access to every app, keeper, and management surface. Assign sparingly."
            )
            -- ingress is carried by a meta.internal policy, so it is hidden by default.
            test.is_nil(by_id["app.security:ingress"])
        end)

        test.it("includes internal scopes when include_internal is set", function()
            local scopes = scope_catalog.scopes({ include_internal = true })
            local by_id = {}
            for _, s in ipairs(scopes or {}) do by_id[s.id] = s end
            test.not_nil(by_id["app.security:ingress"])
            test.is_true(by_id["app.security:ingress"].internal)
        end)

        test.it("shows only assignable permissions in the editor and supports single-role composition reads", function()
            local id = "app.security:user"
            local full = assert(scope_catalog.scopes({id = id}))
            test.eq(#full, 1)
            test.eq(full[1].id, id)
            local includes_runtime_policy = false
            for _, policy in ipairs(full[1].policies) do
                if policy.id == "app.security:user.runtime_registry_read" then includes_runtime_policy = true end
            end
            test.is_true(includes_runtime_policy)

            local offered = {}
            for _, policy in ipairs(assert(scope_catalog.policies({assignable = true}))) do
                offered[policy.id] = true
            end
            local expected = {}
            for _, policy in ipairs(full[1].policies) do
                if offered[policy.id] then expected[#expected + 1] = policy.id end
            end
            local summary = assert(scope_catalog.scopes({id = id, permissions_only = true}))
            test.eq(#summary, 1)
            local actual = {}
            for _, policy in ipairs(summary[1].policies) do actual[#actual + 1] = policy.id end
            test.eq(table.concat(actual, ","), table.concat(expected, ","))
            test.eq(#assert(scope_catalog.scopes({id = "app.security:ingress"})), 0)
        end)

        test.it("keeps restricted declarations in diagnostics only, even with a public role descriptor", function()
            local list = {}
            for _, scope in ipairs(assert(scope_catalog.scopes({include_internal = true}))) do
                list[scope.id] = scope
            end
            local ids = {
                "app:catalog_private_scope",
                "app:catalog_service_scope",
                "app:catalog_internal_scope",
                "app:catalog_descriptor_restricted_scope",
            }
            for _, id in ipairs(ids) do
                test.not_nil(list[id], id)
                test.is_true(list[id].internal, id)
            end
            local available = {}
            for _, scope in ipairs(assert(scope_catalog.scopes())) do
                available[scope.id] = true
            end
            test.not_nil(available["app.security:user"])
            for _, id in ipairs(ids) do test.is_nil(available[id], id) end
        end)

        test.it("policies catalog excludes private grants by default", function()
            local pub = scope_catalog.policies()
            for _, p in ipairs(pub or {}) do
                test.is_false(p.private == true)
            end
        end)

        test.it("offers only declared module and tool permissions by exact id", function()
            local by_id = {}
            local intents = {module_access = true, module_management = true, tool_access = true}
            for _, policy in ipairs(assert(scope_catalog.policies({ assignable = true }))) do
                test.is_true(intents[policy.intent] == true, "Unexpected permission: " .. policy.id)
                test.is_false(policy.private)
                test.is_true(policy.title ~= policy.id and policy.title:find("%S") ~= nil)
                test.is_nil(by_id[policy.id])
                by_id[policy.id] = policy
            end
            test.is_nil(by_id["app:sample_service"])
            test.is_nil(by_id["app:sample_infrastructure"])
            test.is_nil(by_id["kickside.contract.security:module_access"])
            test.is_nil(by_id["kickside.execution.security:module_access"])
            test.eq(by_id["app:module_access"].title, "Module access")
            test.eq(by_id["app:module_access"].comment, "Opens the sample module.")
            test.eq(by_id["app:manage_samples"].title, "Sample management")
            test.eq(by_id["app:manage_samples"].comment, "Manages sample records.")
            test.not_nil(by_id["app:sample_tool"])
            test.eq(by_id["app:sample_tool"].title, "Sample tools")
            test.eq(by_id["app:sample_tool"].comment, "Runs sample tools.")
        end)
    end)
end

return test.run_cases(define_tests)
