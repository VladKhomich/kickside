-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local models_repo = require("models_repo")
local driver = require("driver")
local fixture = require("fixture")
local registry_models = require("registry_models")
local resolver = require("resolver")

local function define_tests()
    test.describe("Cached profile execution", function()
        test.it("keeps legacy inline provider routes unchanged", function()
            local get_all = registry_models.get_all
            local route = {id = "wippy.llm.openai_compat:provider", provider_model = "wire-model",
                context = {api_key = "fixture-inline-secret", base_url = "https://inline.example.test/v1",
                    headers = {["X-Saved"] = "retained"}}, options = {temperature = 0.5}, sampling = false}
            registry_models.get_all = function() return {{name = "inline-model", providers = {route}}} end
            local ok, err = pcall(function()
                local card, resolve_err = resolver.resolve({model = "inline-model"})
                test.is_nil(resolve_err, tostring(resolve_err))
                test.eq(card.providers[1].id, route.id)
                test.eq(card.providers[1].provider_model, route.provider_model)
                test.eq(card.providers[1].context, route.context)
                test.eq(card.providers[1].options, route.options)
                test.eq(card.providers[1].sampling, false)
            end)
            registry_models.get_all = get_all
            assert(ok, tostring(err))
        end)
        test.it("executes merged registry options with saved overrides", function()
            local profile = assert(models_repo.create_profile({id = "cached-profile", name = "Cached profile",
                provider_id = "wippy.llm.openai_compat:provider", base_url = "https://provider.example.test/v1",
                api_key = "fixture-cache-secret", organization = "profile-organization"}))
            assert(models_repo.upsert_card({name = "cached-profile-model", provider_profile_id = profile.id,
                provider_id = profile.provider_id, provider_model = "wire-model", capabilities = {"generate"},
                options = {timeout = 88}, max_tokens = 8192, output_tokens = 1024, enabled = true}))
            local get_all = registry_models.get_all
            registry_models.get_all = function() return {{name = "cached-profile-model", providers = {{
                id = profile.provider_id, provider_model = "wire-model", sampling = false,
                options = {organization = "registry-organization", timeout = 77}}}}} end
            local ok, err = pcall(function()
                local card, resolve_err = resolver.resolve({model = "cached-profile-model"})
                test.is_nil(resolve_err, tostring(resolve_err))
                test.eq(card.providers[1].id, "kickside.models:provider")
                test.eq(card.providers[1].context.card, "cached-profile-model")
                test.is_nil(card.providers[1].context.api_key)
                test.eq(card.providers[1].sampling, false)
                local response, call_err = driver.generate({})
                test.is_nil(call_err, tostring(call_err))
                test.is_true(response.success)
                test.eq(fixture.context.organization, "registry-organization")
                test.eq(fixture.context.timeout, 88)
            end)
            registry_models.get_all = get_all
            local _, delete_err = models_repo.delete_profile(profile.id)
            test.is_nil(delete_err, tostring(delete_err))
            assert(ok, tostring(err))
        end)
        test.it("adds zero SQL opens across repeated provider calls", function()
            local profile = assert(models_repo.create_profile({id = "cached-profile", name = "Cached profile",
                provider_id = "wippy.llm.openai_compat:provider", base_url = "https://provider.example.test/v1",
                api_key = "fixture-cache-secret"}))
            assert(models_repo.upsert_card({name = "cached-profile-model", provider_profile_id = profile.id,
                provider_id = profile.provider_id, provider_model = "wire-model", capabilities = {"generate"},
                max_tokens = 8192, output_tokens = 1024, enabled = true}))
            fixture.reads, fixture.calls = 0, 0
            local ok, err = pcall(function()
                for _ = 1, 20 do
                    for _, method in ipairs({"status", "generate", "embed", "structured_output", "evaluate"}) do
                        local result, call_err = driver[method]({model = "caller-model"})
                        test.is_nil(call_err, tostring(call_err))
                        test.is_true(result.success)
                    end
                end
                test.eq(fixture.calls, 100)
                test.eq(fixture.reads, 0, "Warm provider calls open SQL")
            end)
            local _, delete_err = models_repo.delete_profile(profile.id)
            test.is_nil(delete_err, tostring(delete_err))
            assert(ok, tostring(err))
        end)
    end)
end
return {run = test.run_cases(define_tests)}
