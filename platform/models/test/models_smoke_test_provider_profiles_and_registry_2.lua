local test = require("test")
local registry = require("registry")
local models_repo = require("models_repo")
local catalog_policy = require("catalog_policy")
local catalog_card_policy = require("catalog_card_policy")
local provider_read_model = require("provider_read_model")
local model_catalog = require("model_catalog")
local model_mapper = require("model_mapper")
local models_types = require("models_types")
local provider_registry = require("provider_registry")
local provider_openai_like = require("provider_openai_like")
local vertex_token_engine = require("vertex_token_engine")

local function value(entry: any, key: string): any
    if type(entry) ~= "table" then return nil end
    if entry[key] ~= nil then return entry[key] end
    if type(entry.data) == "table" then return entry.data[key] end
    return nil
end

local function has_process_scope(entry: any): boolean
    local lifecycle = value(entry, "lifecycle")
    if type(lifecycle) ~= "table" or type(lifecycle.security) ~= "table" then
        return false
    end
    local groups = lifecycle.security.groups
    if type(groups) ~= "table" then
        return false
    end
    for _, group_id in ipairs(groups) do
        if group_id == "wippy.security:process" then return true end
    end
    return false
end

local function meta(entry: any): any
    return type(entry) == "table" and (entry.meta or (entry.data and entry.data.meta)) or nil
end

local function has(list: any, expected: string): boolean
    if type(list) ~= "table" then return false end
    for _, item in ipairs(list) do
        if item == expected then return true end
    end
    return false
end

local function allowed_class(name: string): boolean
    return name == "fast"
        or name == "nano"
        or name == "balanced"
        or name == "premium"
        or name == "embed"
end

local function define_tests()
    test.describe("kickside.models packaging", function()
        -- The suite owns every profile and card it writes; a persistent
        -- database (postgres) must start each case without earlier rows.
        local FIXTURE_PROFILES = {
            "profile-config-scrub-test", "vertex-ambiguous-auth-test", "vertex-project-context-test",
            "event-openai-test", "vertex-topology-a", "vertex-topology-b",
            "delete-profile-cards-test", "local-test",
        }
        local FIXTURE_CARDS = { "public-scrub-test", "retry-card-normalize", "db-class-test", "disabled-db-model" }

        local function remove_fixtures()
            for _, id in ipairs(FIXTURE_PROFILES) do
                local _, err = models_repo.delete_profile(id)
                test.is_nil(err)
            end
            for _, name in ipairs(FIXTURE_CARDS) do
                local _, err = models_repo.delete_card(name)
                test.is_nil(err)
            end
        end

        test.before_all(remove_fixtures)
        test.after_each(remove_fixtures)

        -- Retry rides two declared surfaces: the profile's policy travels in
        -- the provider context (the llm layer's default), a card's own policy
        -- in its options (the caller override). A card's retry is normalized
        -- on write the same way a profile's is — garbage never persists.

        test.it("keeps sensitive profile config out of public profile config", function()
            local profile, perr = models_repo.create_profile({
                id = "profile-config-scrub-test",
                name = "Profile Config Scrub Test",
                provider_id = "wippy.llm.openai_compat:provider",
                config = {
                    base_url = "http://localhost:11434/v1",
                    test_model = "local-test-model",
                    api_token = "must-not-leak",
                    api_key_env = "LOCAL_API_KEY",
                    headers = { Authorization = "Bearer must-not-leak" },
                },
            })
            test.is_nil(perr)
            test.not_nil(profile)
            test.eq(profile.config.base_url, "http://localhost:11434/v1")
            test.eq(profile.config.test_model, "local-test-model")
            test.eq(profile.config.api_key_env, "LOCAL_API_KEY")
            test.is_nil(profile.config.api_token)
            test.is_nil(profile.config.headers)
            test.is_true(has(profile.secret_fields, "headers"))

            local stored = models_repo.get_profile("profile-config-scrub-test")
            test.not_nil(stored)
            local stored_config = type(stored.config) == "table" and stored.config or {}
            local stored_secret = type(stored.secret_config) == "table" and stored.secret_config or {}
            test.is_nil(stored_config.headers)
            test.eq(stored_secret.headers.Authorization, "Bearer must-not-leak")
        end)

        test.it("broadcasts a generic profile.changed event the supervisor self-filters", function()
            local captured: any = nil
            local original = models_repo.emit_profile_changed
            models_repo.emit_profile_changed = function(profile_id: any, provider_id: any)
                captured = { profile_id = profile_id, provider_id = provider_id }
            end

            local profile, perr = models_repo.create_profile({
                id = "event-openai-test",
                name = "Event OpenAI",
                provider_id = "wippy.llm.openai_compat:provider",
                base_url = "http://localhost:11434/v1",
            })
            models_repo.emit_profile_changed = original

            test.is_nil(perr)
            test.not_nil(profile)
            test.not_nil(captured)
            test.eq(captured.profile_id, "event-openai-test")
            test.eq(captured.provider_id, "wippy.llm.openai_compat:provider")

            -- The supervisor consumes the event and self-filters by provider; a
            -- non-Vertex profile is skipped without any sender-side name gate.
            local result = vertex_token_engine.handle_profile_changed(captured)
            test.eq(result.status, "skipped")

            local deleted_event: any = nil
            models_repo.emit_profile_changed = function(profile_id: any, provider_id: any,
                previous_provider_id: any)
                deleted_event = { profile_id = profile_id, provider_id = provider_id,
                    previous_provider_id = previous_provider_id }
            end
            local deleted, derr = models_repo.delete_profile("event-openai-test")
            models_repo.emit_profile_changed = original
            test.eq(deleted, true)
            test.is_nil(derr)
            test.not_nil(deleted_event)
            test.eq(deleted_event.profile_id, "event-openai-test")
            test.eq(deleted_event.provider_id, "wippy.llm.openai_compat:provider")
            test.eq(deleted_event.previous_provider_id, "wippy.llm.openai_compat:provider")
        end)

        test.it("deletes DB model cards with their provider profile", function()
            local profile, perr = models_repo.create_profile({
                id = "delete-profile-cards-test",
                name = "Delete Profile Cards Test",
                provider_id = "wippy.llm.openai_compat:provider",
                base_url = "http://localhost:11434/v1",
            })
            test.is_nil(perr)
            test.not_nil(profile)

            local card, cerr = models_repo.upsert_card({
                name = "delete-profile-cards-test/model",
                provider_id = "wippy.llm.openai_compat:provider",
                provider_profile_id = "delete-profile-cards-test",
                provider_model = "model",
                capabilities = { "generate" },
                classes = { "balanced" },
                max_tokens = 32768,
                output_tokens = 4096,
                source = "manual",
            })
            test.is_nil(cerr)
            test.not_nil(card)

            local ok, derr = models_repo.delete_profile("delete-profile-cards-test")
            test.eq(ok, true)
            test.is_nil(derr)

            local deleted_card = nil
            for _, item in ipairs(models_repo.list_cards_public()) do
                if item.name == "delete-profile-cards-test/model" then deleted_card = item end
            end
            test.is_nil(deleted_card)
        end)

        test.it("resolves DB model overlays before registry classes", function()
            local profile, perr = models_repo.create_profile({
                id = "local-test",
                name = "Local Test",
                provider_id = "wippy.llm.openai_compat:provider",
                base_url = "http://localhost:11434/v1",
                timeout = 12,
                retry = { attempts = 2, backoff_ms = 250, ignored = true },
                api_version = "test-version",
                api_key = "profile-secret",
            })
            test.is_nil(perr)
            test.not_nil(profile)

            local card, cerr = models_repo.upsert_card({
                name = "local-test/test-fast",
                title = "Test Fast",
                provider_id = "wippy.llm.openai_compat:provider",
                provider_profile_id = "local-test",
                provider_model = "test-fast",
                capabilities = { "generate", "tool_use" },
                classes = { "fast" },
                max_tokens = 32768,
                output_tokens = 4096,
                priority = 999,
                options = { reasoning_model_request = true },
                source = "manual",
            })
            test.is_nil(cerr)
            test.not_nil(card)

            local resolved, rerr = model_catalog.resolve("class:fast")
            test.is_nil(rerr)
            test.eq(resolved.name, "local-test/test-fast")
            test.eq(resolved.providers[1].options.reasoning_model_request, true)
            test.is_nil(resolved.providers[1].options.base_url)
            test.is_nil(resolved.providers[1].options.retry)
            test.is_nil(resolved.providers[1].options.api_version)
            test.is_nil(resolved.providers[1].options.api_key)
            test.eq(resolved.providers[1].context.base_url, "http://localhost:11434/v1")
            test.eq(resolved.providers[1].context.retry.attempts, 2)
            test.eq(resolved.providers[1].context.retry.backoff_ms, 250)
            test.is_nil(resolved.providers[1].context.retry.ignored)
            test.eq(resolved.providers[1].context.api_version, "test-version")
            test.eq(resolved.providers[1].context.api_key, "profile-secret")

            local public = catalog_card_policy.public_card(resolved)
            test.eq(public.options.reasoning_model_request, true)
            test.is_nil(public.options.base_url)
            test.is_nil(public.options.api_key)
            test.is_nil(public.context)

            local updated, uerr = models_repo.update_profile("local-test", { retry = {} })
            test.is_nil(uerr)
            test.not_nil(updated)
            test.is_nil(updated.config.retry)

            local resolved_after_clear, clear_err = model_catalog.resolve("local-test/test-fast")
            test.is_nil(clear_err)
            test.is_nil(resolved_after_clear.providers[1].context.retry)
        end)

        test.it("stores explicit DB model classes without registry defaults", function()
            local card, cerr = models_repo.upsert_card({
                name = "db-class-test",
                title = "DB Class Test",
                provider_id = "wippy.llm.openai:provider",
                provider_model = "db-class-test",
                capabilities = { "generate", "tool_use" },
                classes = { "fast", "nano" },
                max_tokens = 32768,
                output_tokens = 4096,
                options = { reasoning_model_request = false },
                source = "overlay",
            })
            test.is_nil(cerr)
            test.not_nil(card)

            local resolved, rerr = model_catalog.get_by_name("db-class-test")
            test.is_nil(rerr)
            test.is_true(has(resolved.class, "fast"))
            test.is_true(has(resolved.class, "nano"))
            test.eq(resolved.providers[1].options.reasoning_model_request, false)

            local ok, derr = models_repo.delete_card("db-class-test")
            test.eq(ok, true)
            test.is_nil(derr)
        end)

        test.it("lets disabled DB model cards stay visible while runtime resolution skips them", function()
            local card, cerr = models_repo.upsert_card({
                name = "disabled-db-model",
                title = "Disabled DB Model",
                provider_id = "wippy.llm.openai:provider",
                provider_model = "disabled-db-model",
                capabilities = { "generate" },
                classes = { "fast" },
                enabled = false,
                source = "overlay",
            })
            test.is_nil(cerr)
            test.not_nil(card)
            test.is_false(card.enabled)

            local resolved, rerr = model_catalog.get_by_name("disabled-db-model")
            test.is_nil(resolved)
            test.eq(rerr, "No model found with name: disabled-db-model")

            local public_row = nil
            for _, item in ipairs(model_catalog.get_all_public()) do
                if item.name == "disabled-db-model" then
                    public_row = item
                    break
                end
            end
            test.not_nil(public_row)
            test.is_false(public_row.enabled)

            local fast_models = model_catalog.get_by_class("fast")
            for _, item in ipairs(fast_models or {}) do
                test.is_true(item.name ~= "disabled-db-model")
            end

            local ok, derr = models_repo.delete_card("disabled-db-model")
            test.eq(ok, true)
            test.is_nil(derr)
        end)
    end)

end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
