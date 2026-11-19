local test = require("test")
local login = require("login")
local registry = require("registry")
local templates = require("templates")
local http = require("http")
local function define_tests()
    test.describe("login theme configuration", function()
        test.it("rejects an empty declared cookie key without substituting a hardcoded key", function()
            local failure = registry.failure
            registry.failure = nil
            registry.values = {["wippy.facade:theme_persist"] = "cookie", ["wippy.facade:theme_storage_key"] = ""}
            templates.calls = 0
            local value, err = login.handler()
            registry.failure = failure
            test.is_nil(value)
            test.is_true(errors.is(err, errors.INVALID))
            test.eq(templates.calls, 0)
        end)
        test.it("finds the theme cookie after a mebibyte of whitespace in another cookie key", function()
            local failure = registry.failure
            local values = registry.values
            registry.failure = nil
            registry.values = {["wippy.facade:theme_persist"] = "cookie", ["wippy.facade:theme_storage_key"] = "theme"}
            http.cookie = "ignored" .. string.rep(" ", 1024 * 1024) .. "key=value; theme=dark"
            templates.available = true

            local ok, result, err = pcall(login.handler)
            registry.failure, registry.values = failure, values
            http.cookie, templates.available = nil, nil
            test.is_true(ok, tostring(result))
            test.is_nil(err)
            test.is_true(templates.rendered.hasTheme)
            test.eq(templates.rendered.themeClass, "w-theme-dark")
        end)
        test.it("preserves registry failure before reading the template", function()
            templates.calls = 0
            local value, err = login.handler()
            test.is_nil(value)
            test.eq(err, registry.failure)
            test.eq(templates.calls, 0)
        end)
    end)
end
return {run = test.run_cases(define_tests)}
