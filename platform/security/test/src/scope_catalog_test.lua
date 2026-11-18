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

        test.it("policies catalog excludes private grants by default", function()
            local pub = scope_catalog.policies()
            for _, p in ipairs(pub or {}) do
                test.is_false(p.private == true)
            end
        end)

        test.it("offers only declared access and management permissions by exact id", function()
            local by_id = {}
            for _, policy in ipairs(assert(scope_catalog.policies({ assignable = true }))) do
                test.is_true(policy.intent == "module_access" or policy.intent == "module_management",
                    "Unexpected permission: " .. policy.id)
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
        end)
    end)
end

return test.run_cases(define_tests)
