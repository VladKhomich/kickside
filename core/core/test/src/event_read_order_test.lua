-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local models = require("models")
local fixture = require("fixture")
local event_access = require("event_access")
local OWNER = "00000000-0000-4000-8000-000000000123"
return {run = test.run_cases(function()
    test.describe("Read-model attachment order", function()
        for _, admin in ipairs({false, true}) do
            test.it("authorizes the joined current declaration in one query/" .. tostring(admin), function()
                fixture.reset("admin", admin)
                local value, err = models.get({owner_id = OWNER, kind = "count"})
                if admin then test.is_nil(err); test.eq(value.body.secret, "committed")
                else test.is_nil(value); test.is_true(errors.is(err, errors.PERMISSION_DENIED)) end
                test.eq(table.concat(fixture.order, ","), "binding,body,8:component,release")
                test.eq(fixture.payload_rows, admin and 1 or 0)
            end)
        end
        test.it("checks the level for a legacy owner id before returning the body", function()
            fixture.reset("admin", false)
            local value, err = models.get({owner_id = "legacy-owner", kind = "count"})
            test.is_nil(value); test.is_true(errors.is(err, errors.PERMISSION_DENIED))
            test.eq(table.concat(fixture.order, ","), "binding,body,8:component,release")
        end)
        test.it("keeps READ for an undeclared kind", function()
            fixture.reset("", false)
            local value, err = models.get({owner_id = OWNER, kind = "count"})
            test.is_nil(err); test.eq(value.body.secret, "committed")
            test.eq(table.concat(fixture.order, ","), "binding,body,1:component,release")
        end)
        test.it("checks the declared level without requiring base READ", function()
            fixture.reset("admin", true, false)
            local value, err = models.get({owner_id = OWNER, kind = "count"})
            test.is_nil(err); test.eq(value.body.secret, "committed")
            test.eq(table.concat(fixture.order, ","), "binding,body,8:component,release")
        end)
        test.it("refuses an invalid declaration before returning the joined body", function()
            fixture.reset("invalid", true)
            local value, err = models.get({owner_id = OWNER, kind = "count"})
            test.is_nil(value); test.is_true(errors.is(err, errors.INVALID))
            test.eq(table.concat(fixture.order, ","), "binding,release")
        end)
        test.it("authorizes one binding per two-page projection read", function()
            fixture.reset("", false)
            local source = {component_id = OWNER, component_impl_id = "kickside.core:thread",
                component_incarnation = "original", thread_incarnation = "original-thread", payload_allowed = 1}
            local request = {binding = source}
            test.is_nil(event_access.verify(request, source))
            test.is_nil(event_access.verify(request, source))
            local replacement = {component_id = OWNER, component_impl_id = "kickside.core:thread",
                component_incarnation = "replacement", thread_incarnation = source.thread_incarnation, payload_allowed = 1}
            local err = event_access.verify(request, replacement)
            test.is_true(errors.is(err, errors.CONFLICT))
            test.is_true(err:retryable())
        end)
    end)
end)}
