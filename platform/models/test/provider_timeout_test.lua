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

local function assert_invalid_number(profile, err, field)
    test.is_nil(profile)
    test.not_nil(err)
    test.eq(err:kind(), errors.INVALID)
    test.eq(err:details().field, field)
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
        test.it("requires the LLM transport with provider timeout parsing and malformed-response fallback", function()
            local dependency = assert(registry.get("kickside.models:dep.wippy.llm"))
            test.eq(dependency.data.version, ">=0.5.23")
        end)

        test.it("rejects invalid timeouts on create and update", function()
            local id = "provider-timeout-validation"
            local profile
            local ok, failure = pcall(function()
                for _, timeout in ipairs({0, false, -1, "0", "0s", "30 seconds", "invalid", 0/0, math.huge}) do
                    local created, err = repo.create_profile({
                        id = id, name = id, provider_id = provider, config = {timeout = timeout},
                    })
                    profile = created
                    assert_invalid_number(created, err, "timeout")
                end
                profile = assert(repo.create_profile({id = id, name = id, provider_id = provider, timeout = 0.25}))
                test.eq(profile.config.timeout, 0.25)
                for _, timeout in ipairs({0, false, -1, "0", "0s", "30 seconds", 0/0, math.huge}) do
                    local updated, err = repo.update_profile(profile.id, {timeout = timeout})
                    assert_invalid_number(updated, err, "timeout")
                end
                test.eq(assert(repo.get_profile(profile.id)).config.timeout, 0.25)
                test.is_nil(assert(repo.update_profile(profile.id, {timeout = ""})).config.timeout)
            end)
            if profile then assert(repo.delete_profile(profile.id)) end
            assert(ok, tostring(failure))
        end)

        test.it("accepts positive timeout strings on create and update", function()
            local id = "provider-timeout-strings"
            local profile
            local ok, failure = pcall(function()
                profile = assert(repo.create_profile({
                    id = id, name = id, provider_id = provider, timeout = "250ms",
                }))
                test.eq(profile.config.timeout, 0.25)
                local updated = assert(repo.update_profile(id, {config = {timeout = "120"}}))
                test.eq(updated.config.timeout, 120)
                test.eq(assert(repo.get_profile(id)).config.timeout, 120)
            end)
            if profile then assert(repo.delete_profile(id)) end
            assert(ok, tostring(failure))
        end)

        test.it("rejects invalid retry numbers and allows a retry policy to be cleared", function()
            local id = "provider-retry-validation"
            local profile
            local ok, failure = pcall(function()
                for _, field in ipairs({"attempts", "backoff_ms"}) do
                    local invalid = {false, -1, "30 seconds", "30", 0/0, math.huge}
                    if field == "attempts" then table.insert(invalid, 0) end
                    for _, value in ipairs(invalid) do
                        local retry = {attempts = 2, backoff_ms = 250, [field] = value}
                        local created, err = repo.create_profile({
                            id = id, name = id, provider_id = provider, retry = retry,
                        })
                        profile = created
                        assert_invalid_number(created, err, "retry." .. field)
                    end
                end
                profile = assert(repo.create_profile({
                    id = id, name = id, provider_id = provider, retry = {attempts = 2, backoff_ms = 250},
                }))
                for _, field in ipairs({"attempts", "backoff_ms"}) do
                    local invalid = {false, -1, "30 seconds", "30", 0/0, math.huge}
                    if field == "attempts" then table.insert(invalid, 0) end
                    for _, value in ipairs(invalid) do
                        local updated, err = repo.update_profile(id, {retry = {attempts = 2, [field] = value}})
                        assert_invalid_number(updated, err, "retry." .. field)
                    end
                end
                local retry = assert(repo.get_profile(id)).config.retry
                test.eq(retry.attempts, 2)
                test.eq(retry.backoff_ms, 250)
                test.is_nil(assert(repo.update_profile(id, {retry = {}})).config.retry)
            end)
            if profile then assert(repo.delete_profile(profile.id)) end
            assert(ok, tostring(failure))
        end)

        test.it("preserves immediate retry and positive fractional backoff on profile writes", function()
            local profile = assert(repo.create_profile({
                id = "provider-retry-positive", name = "Saved profile", provider_id = provider,
                retry = {attempts = 2.5, backoff_ms = 0},
            }))
            local ok, failure = pcall(function()
                local created = profile.config.retry or {}
                test.eq(created.backoff_ms, 0)
                test.eq(created.attempts, 2.5)
                local immediate = assert(repo.update_profile(profile.id, {retry = {attempts = 2, backoff_ms = 0}}))
                test.eq(immediate.config.retry.backoff_ms, 0)
                local updated = assert(repo.update_profile(profile.id, {retry = {backoff_ms = 0.5}}))
                test.eq((updated.config.retry or {}).backoff_ms, 0.5)
                local edited = assert(repo.update_profile(profile.id, {name = "Renamed profile"}))
                test.is_nil(edited.config.retry.attempts)
                test.eq(edited.config.retry.backoff_ms, 0.5)
                local saved = assert(repo.get_profile(profile.id)).config.retry
                test.is_nil(saved.attempts)
                test.eq(saved.backoff_ms, 0.5)
            end)
            assert(repo.delete_profile(profile.id))
            assert(ok, tostring(failure))
        end)

        test.it("upgrades legacy profile numbers and preserves positive values", function()
            local db = assert(sql.get("app:db"))
            local preserved_text = "label" .. string.char(0) .. "suffix"
            local fixtures = {
                {id = "zero", value = 0, backoff = 0},
                {id = "string-zero", value = "0"},
                {id = "duration-zero", value = "0s"},
                {id = "false", value = false},
                {id = "negative", value = -1},
                {id = "text", value = "30 seconds"},
                {id = "duration", value = "2.5s", stored = 2.5, expected = "2500ms"},
                {id = "empty", value = ""},
                {id = "numeric-text", value = "120", stored = 120, expected = "120000ms"},
                {id = "nan-text", value = "NaN"},
                {id = "positive", value = 1, stored = 1, expected = "1000ms", attempts = 1, backoff = 1},
                {id = "positive-fraction", value = 2.5, stored = 2.5, expected = "2500ms", attempts = 2.5, backoff = 2.5},
                {id = "unset"},
            }
            local client = plain_generate._client
            local original_context, original_http = client._ctx, client._http_client
            local ok, failure = pcall(function()
                for _, fixture in ipairs(fixtures) do
                    execute(db, [[INSERT INTO kickside_model_provider_profiles
                        (id, name, provider_id, config_json, created_at, updated_at)
                        VALUES ($1, 'Saved profile', $2, $3, 1, 2)]],
                        {fixture.id, provider, json.encode({timeout = fixture.value,
                            retry = {attempts = 2, backoff_ms = fixture.value},
                            base_url = "https://example.test/v1", custom = {timeout = 0, label = preserved_text}})})
                    execute(db, [[INSERT INTO kickside_model_provider_profiles
                        (id, name, provider_id, config_json, created_at, updated_at)
                        VALUES ($1, 'Saved profile', $2, $3, 1, 2)]],
                        {fixture.id .. "-retry", provider, json.encode({
                            retry = {attempts = fixture.value, backoff_ms = 250},
                        })})
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
                    test.eq(used_timeout, fixture.expected or "600000ms")
                    test.eq(profile.config.timeout, fixture.stored)
                    test.eq(profile.config.retry.attempts, 2)
                    test.eq(profile.config.retry.backoff_ms, fixture.backoff)
                    local retry_profile = assert(repo.get_profile(fixture.id .. "-retry"))
                    test.eq(retry_profile.config.retry.attempts, fixture.attempts)
                    test.eq(retry_profile.config.retry.backoff_ms, 250)
                    local retry_edited = assert(repo.update_profile(retry_profile.id, {name = "Renamed profile"})).config.retry or {}
                    test.eq(retry_edited.backoff_ms, 250)
                    test.eq(retry_edited.attempts, fixture.attempts)
                    local edited = assert(repo.update_profile(fixture.id, {name = "Renamed profile", enabled = false}))
                    test.eq(edited.name, "Renamed profile")
                    test.is_false(edited.enabled)
                    test.eq(edited.config.timeout, fixture.stored)
                    test.eq(edited.config.retry.backoff_ms, fixture.backoff)
                end
            end)
            client._ctx, client._http_client = original_context, original_http
            for _, fixture in ipairs(fixtures) do
                execute(db, "DELETE FROM kickside_model_provider_profiles WHERE id IN ($1,$2)",
                    {fixture.id, fixture.id .. "-retry"})
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
