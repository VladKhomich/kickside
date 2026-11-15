-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local models_repo = require("models_repo")
local driver = require("driver")
local fixture = require("fixture")

local function define_tests()
    test.describe("Cached profile execution", function()
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
