-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local repo = require("repo")
local sql = require("sql")
local json = require("json")
local registry = require("registry")
local migration_runner = require("migration_runner")
local plain_generate = require("plain_generate")

local provider = "kickside.models:openai_compat_plain.provider"
local migration_id = "kickside.models.migrations:06_unset_zero_profile_timeouts"

local function assert_invalid_timeout(profile, err)
    test.is_nil(profile)
    test.eq(err:kind(), errors.INVALID)
    test.eq(err:details().field, "timeout")
    test.is_false(err:retryable())
end

local function execute(db, query, args)
    local _, err = db:execute(query, args)
    assert(not err, tostring(err))
end

local function migrate_timeouts(db)
    execute(db, "DELETE FROM _migrations WHERE id = $1", {migration_id})
    local run = migration_runner.setup("app:db"):run({allowed_ids = {migration_id}})
    assert(run.status == "complete" and run.migrations_failed == 0, json.encode(run))
    test.eq(run.migrations_applied, 1)
end

local function define_tests()
    test.describe("provider profile timeout", function()
        test.it("requires the LLM transport version that provides the timeout parser", function()
            local dependency = assert(registry.get("kickside.models:dep.wippy.llm"))
            test.eq(dependency.data.version, ">=0.5.14")
        end)

        test.it("rejects invalid timeouts on create and update", function()
            local id = "provider-timeout-validation"
            local profile
            local ok, failure = pcall(function()
                for _, timeout in ipairs({0, "0", -1, "0s", "invalid", false}) do
                    local created, err = repo.create_profile({
                        id = id, name = id, provider_id = provider, config = {timeout = timeout},
                    })
                    profile = created
                    assert_invalid_timeout(created, err)
                end
                profile = assert(repo.create_profile({id = id, name = id, provider_id = provider, timeout = 0.25}))
                test.eq(profile.config.timeout, 0.25)
                assert_invalid_timeout(repo.update_profile(profile.id, {timeout = 0}))
                test.eq(assert(repo.get_profile(profile.id)).config.timeout, 0.25)
                test.eq(assert(repo.update_profile(profile.id, {timeout = "2s"})).config.timeout, "2s")
                test.is_nil(assert(repo.update_profile(profile.id, {timeout = ""})).config.timeout)
            end)
            if profile then assert(repo.delete_profile(profile.id)) end
            assert(ok, tostring(failure))
        end)

        test.it("upgrades saved default sentinels and preserves positive timeouts", function()
            local db = assert(sql.get("app:db"))
            local preserved_text = "label" .. string.char(0) .. "suffix"
            local fixtures = {
                {id = "provider-timeout-zero", timeout = 0, expected = "600000ms"},
                {id = "provider-timeout-string-zero", timeout = "0", expected = "600000ms"},
                {id = "provider-timeout-duration-zero", timeout = "0s", expected = "600000ms"},
                {id = "provider-timeout-default-false", timeout = false, expected = "600000ms"},
                {id = "provider-timeout-positive", timeout = 1, stored = 1, expected = "1000ms"},
                {id = "provider-timeout-unset", expected = "600000ms"},
            }
            local client = plain_generate._client
            local original_context, original_http = client._ctx, client._http_client
            local ok, failure = pcall(function()
                for _, fixture in ipairs(fixtures) do
                    execute(db, [[INSERT INTO kickside_model_provider_profiles
                        (id, name, provider_id, config_json, created_at, updated_at)
                        VALUES ($1, 'Saved profile', $2, $3, 1, 2)]],
                        {fixture.id, provider, json.encode({timeout = fixture.timeout,
                            base_url = "https://example.test/v1", custom = {timeout = 0, label = preserved_text}})})
                end
                migrate_timeouts(db)
                local _, reload_err = repo.reload()
                test.is_nil(reload_err)

                local request = {model = "fixture-model", options = {},
                    messages = {{role = "user", content = {{type = "text", text = "Hello"}}}}}
                local used_timeout
                client._http_client = {post = function(_, options)
                    used_timeout = options.timeout
                    return {status_code = 200, body = [[{"choices":[{"message":{"content":"Ready"},"finish_reason":"stop"}]}]]}
                end}
                for _, fixture in ipairs(fixtures) do
                    local profile = assert(repo.get_profile(fixture.id))
                    test.eq(profile.config.custom.timeout, 0)
                    test.eq(profile.config.custom.label, preserved_text)
                    test.eq(profile.updated_at, 2)
                    client._ctx = {all = function()
                        return {base_url = profile.config.base_url, api_key = "fixture-key", timeout = profile.config.timeout}
                    end}
                    used_timeout = nil
                    local result, err = plain_generate.handler(request)
                    assert(result, tostring(err))
                    test.eq(used_timeout, fixture.expected)
                    test.eq(profile.config.timeout, fixture.stored)
                end
                local previously_false = assert(repo.update_profile("provider-timeout-default-false", {enabled = false}))
                test.is_false(previously_false.enabled)
                test.is_nil(previously_false.config.timeout)
            end)
            client._ctx, client._http_client = original_context, original_http
            for _, fixture in ipairs(fixtures) do
                execute(db, "DELETE FROM kickside_model_provider_profiles WHERE id = $1", {fixture.id})
            end
            db:release()
            local _, reload_err = repo.reload()
            test.is_nil(reload_err)
            assert(ok, tostring(failure))
        end)
        test.it("preserves a corrupt profile and migrates healthy profiles after it", function()
            local db = assert(sql.get("app:db"))
            local corrupt = "a-provider-timeout-corrupt"
            local healthy = "z-provider-timeout-healthy"
            local malformed = "{not valid json"
            local ok, failure = pcall(function()
                for _, row in ipairs({{corrupt, malformed}, {healthy, '{"timeout":0}'}}) do
                    execute(db, [[INSERT INTO kickside_model_provider_profiles
                        (id, name, provider_id, config_json, created_at, updated_at)
                        VALUES ($1, 'Saved profile', $2, $3, 1, 2)]], {row[1], provider, row[2]})
                end
                migrate_timeouts(db)
                local rows = assert(db:query([[SELECT id,config_json FROM kickside_model_provider_profiles
                    WHERE id IN ($1,$2) ORDER BY id]], {corrupt, healthy}))
                test.eq(rows[1].config_json, malformed)
                test.eq(rows[2].config_json, "{}")
                local _, reload_err = repo.reload()
                test.is_nil(reload_err)
                local bad, bad_err = repo.get_profile(corrupt)
                test.is_nil(bad)
                test.not_nil(bad_err)
                test.is_nil(assert(repo.get_profile(healthy)).config.timeout)
            end)
            execute(db, "DELETE FROM kickside_model_provider_profiles WHERE id IN ($1,$2)", {corrupt, healthy})
            db:release()
            local _, reload_err = repo.reload()
            test.is_nil(reload_err)
            assert(ok, tostring(failure))
        end)
    end)
end

return {run = test.run_cases(define_tests)}
