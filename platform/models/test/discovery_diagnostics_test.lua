-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local repo = require("repo")
local discovery = require("discovery")
local http_fixture = require("http_fixture")
local fake_http = require("fake_http")
local discover_handler = require("discover_handler")
local test_handler = require("test_handler")
local openai = require("openai")
local adapters = {openai, require("anthropic"), require("google"), require("bedrock")}
local sentinel = "provider-body-credential-sentinel"

local function profile()
    return {provider_id = "wippy.llm.openai_compat:provider", config = {base_url = "https://example.invalid"},
        secret_config = {api_key = "test-key", access_key = "test-access", secret_key = "test-secret"}}
end

local function check(message, diagnostics, kind, retryable, status)
    test.eq(type(message), "string")
    test.not_nil(diagnostics)
    test.eq(diagnostics.kind, kind)
    test.eq(diagnostics.retryable, retryable)
    test.eq(diagnostics.status_code, status)
    test.is_nil(diagnostics.message)
    test.is_nil(diagnostics.details)
    test.contains(message, kind)
    if status then test.contains(message, "HTTP " .. tostring(status)) end
    test.is_nil(assert(json.encode({message, diagnostics})):find(sentinel, 1, true))
end

return {run = test.run_cases(function()
    test.describe("safe discovery diagnostics", function()
        for _, row in ipairs({{401, errors.PERMISSION_DENIED, false}, {429, errors.RATE_LIMITED, true},
            {503, errors.UNAVAILABLE, true}}) do
            test.it("preserves typed HTTP " .. tostring(row[1]) .. " diagnostics across adapters and HTTP handlers", function()
                http_fixture.prepare({status_code = row[1], body = sentinel}, nil)
                for _, adapter in ipairs(adapters) do
                    local result, message, diagnostics = adapter.fetch(profile())
                    test.is_nil(result)
                    check(message, diagnostics, row[2], row[3], row[1])
                end
                local result, message, diagnostics = openai.test(profile(), {model = "test-model"})
                test.is_nil(result)
                check(message, diagnostics, row[2], row[3], row[1])

                local saved = assert(repo.create_profile({name = "Diagnostic profile",
                    provider_id = "wippy.llm.openai_compat:provider", api_key = "test-key"}))
                local original = discovery.adapter_for
                discovery.adapter_for = function() return openai end
                local ok, err = pcall(function()
                    for _, operation in ipairs({
                        function() return discovery.discover(saved.id) end,
                        function() return discovery.test(saved.id, {}) end,
                        function() return discovery.test(saved.id, {model = "test-model"}) end,
                    }) do
                        local value, failure, diagnostic = operation()
                        test.is_nil(value)
                        check(failure, diagnostic, row[2], row[3], row[1])
                        local public = assert(repo.get_profile_public(saved.id))
                        test.eq(public.status, "unhealthy")
                        test.contains(public.message, "HTTP " .. tostring(row[1]))
                    end
                    for _, handler in ipairs({discover_handler, test_handler}) do
                        fake_http.prepare("{}", {id = saved.id})
                        handler.handler()
                        local payload = fake_http.payload()
                        test.eq(fake_http.status(), 400)
                        test.eq(payload.success, false)
                        check(payload.error, payload.diagnostics, row[2], row[3], row[1])
                    end
                    repo.set_profile_status(saved.id, "healthy", "prior state", nil)
                    discovery.test(saved.id, {model = "test-model"})
                    test.eq(assert(repo.get_profile_public(saved.id)).message, "prior state")
                end)
                discovery.adapter_for = original
                assert(repo.delete_profile(saved.id))
                if not ok then error(err, 0) end
            end)
        end

        test.it("projects native error kinds and retryability without exposing messages or details", function()
            for _, row in ipairs({{errors.INTERNAL, true}, {errors.TIMEOUT, false}, {errors.UNAVAILABLE, true}}) do
                http_fixture.prepare(nil, errors.new({kind = row[1], retryable = row[2], message = sentinel,
                    details = {credential = sentinel, status_code = 401}}))
                for _, adapter in ipairs(adapters) do
                    local value, message, diagnostics = adapter.fetch(profile())
                    test.is_nil(value)
                    check(message, diagnostics, row[1], row[2], nil)
                end
                local value, message, diagnostics = openai.test(profile(), {model = "test-model"})
                test.is_nil(value)
                check(message, diagnostics, row[1], row[2], nil)
            end
        end)

        test.it("does not infer transport categories from untyped message text", function()
            http_fixture.prepare(nil, "timeout connection refused " .. sentinel)
            for _, adapter in ipairs(adapters) do
                local value, message, diagnostics = adapter.fetch(profile())
                test.is_nil(value)
                test.is_nil(diagnostics)
                test.eq(message, "provider request failed")
            end
        end)

        test.it("retains response status for invalid model-list JSON without exposing its body", function()
            http_fixture.prepare({status_code = 200, body = sentinel}, nil)
            local value, message, diagnostics = openai.fetch(profile())
            test.is_nil(value)
            test.not_nil(diagnostics)
            test.eq(diagnostics.status_code, 200)
            test.is_nil(assert(json.encode({message, diagnostics})):find(sentinel, 1, true))
        end)
    end)
end)}
