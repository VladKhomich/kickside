local test = require("test")
local registry = require("registry")
local registry_models = require("registry_models")
local models_repo = require("models_repo")
local catalog_policy = require("catalog_policy")
local catalog_card_policy = require("catalog_card_policy")
local provider_read_model = require("provider_read_model")
local model_catalog = require("model_catalog")
local model_mapper = require("model_mapper")
local models_types = require("models_types")
local provider_registry = require("provider_registry")
local provider_openai_like = require("provider_openai_like")

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
    test.describe("Registry model request options", function()

        test.it("publishes sanitized registry provider options without changing their types", function()
            local original = registry_models.get_all
            registry_models.get_all = function()
                return {
                    {
                        name = "registry-request-options",
                        providers = {
                            {
                                id = "test.provider",
                                provider_model = "test-model",
                                options = {
                                    thinking_effort = "medium",
                                    use_responses_lite = true,
                                    nested = { limit = 4, access_token = "private" },
                                    api_key = "private",
                                },
                            },
                        },
                    },
                }
            end
            local ok, rows = pcall(model_catalog.get_all_public)
            registry_models.get_all = original
            test.is_true(ok, tostring(rows))
            local card = nil
            for _, row in ipairs(rows) do
                if row.name == "registry-request-options" then card = row end
            end
            test.not_nil(card)
            test.not_nil(card.options)
            test.eq(card.options.thinking_effort, "medium")
            test.eq(card.options.use_responses_lite, true)
            test.eq(card.options.nested.limit, 4)
            test.is_nil(card.options.nested.access_token)
            test.is_nil(card.options.api_key)
        end)
    end)

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

        test.it("keeps the shipped llm.model catalog empty", function()
            local entries, err = registry.find({ ["meta.type"] = "llm.model" })
            test.is_nil(err)
            test.is_true(type(entries) == "table")
            test.eq(#entries, 0)
        end)

        test.it("publishes read-only and admin model API endpoints under separate policy surfaces", function()
            for _, id in ipairs({
                "kickside.models.api:list_models.endpoint",
                "kickside.models.api:list_model_classes.endpoint",
                "kickside.models.api:models_by_name.endpoint",
                "kickside.models.api.admin:admin.endpoint",
                "kickside.models.api.admin:create_profile.endpoint",
                "kickside.models.api.admin:update_profile.endpoint",
                "kickside.models.api.admin:delete_profile.endpoint",
                "kickside.models.api.admin:discover_profile.endpoint",
                "kickside.models.api.admin:test_profile.endpoint",
                "kickside.models.api.admin:test_card.endpoint",
                "kickside.models.api.admin:upsert_card.endpoint",
                "kickside.models.api.admin:delete_card.endpoint",
                "kickside.models.providers.google_vertex:vertex_token_supervisor.service",
            }) do
                local entry, err = registry.get(id)
                test.is_nil(err)
                test.not_nil(entry, id .. " is missing")
                if id:match("%.endpoint$") then
                    test.eq(value(entry, "kind"), "http.endpoint")
                else
                    test.eq(value(entry, "kind"), "process.service")
                    test.is_true(has_process_scope(entry),
                        id .. " must declare lifecycle.security.groups wippy.security:process")
                end
            end
        end)

        test.it("scrubs sensitive model card options and metadata from public views", function()
            local card, cerr = models_repo.upsert_card({
                name = "public-scrub-test",
                title = "Public Scrub Test",
                provider_id = "wippy.llm.openai_compat:provider",
                provider_model = "public-scrub-test",
                capabilities = { "generate" },
                classes = { "balanced" },
                max_tokens = 32768,
                output_tokens = 4096,
                options = {
                    safe_option = true,
                    api_key = "must-not-leak",
                    nested = { access_token = "must-not-leak", keep = "ok" },
                },
                metadata = {
                    source = "test",
                    credential_blob = "must-not-leak",
                    nested = { password = "must-not-leak", keep = "ok" },
                },
                source = "manual",
            })
            test.is_nil(cerr)
            test.not_nil(card)
            test.eq(card.options.safe_option, true)
            test.is_nil(card.options.api_key)
            test.eq(card.options.nested.keep, "ok")
            test.is_nil(card.options.nested.access_token)
            test.eq(card.metadata.source, "test")
            test.is_nil(card.metadata.credential_blob)
            test.eq(card.metadata.nested.keep, "ok")
            test.is_nil(card.metadata.nested.password)
        end)

        -- Retry rides two declared surfaces: the profile's policy travels in
        -- the provider context (the llm layer's default), a card's own policy
        -- in its options (the caller override). A card's retry is normalized
        -- on write the same way a profile's is — garbage never persists.
        test.it("a card retry policy is normalized on write and survives to the runtime card", function()
            local _, cerr = models_repo.upsert_card({
                name = "retry-card-normalize",
                title = "Retry Card Normalize",
                provider_id = "wippy.llm.openai_compat:provider",
                provider_model = "retry-card-normalize",
                capabilities = { "generate" },
                classes = { "balanced" },
                max_tokens = 32768,
                output_tokens = 4096,
                options = { retry = { attempts = "99", backoff_ms = "500000", ignored = true } },
                source = "manual",
            })
            test.is_nil(cerr)

            local card = select(1, model_catalog.get_by_name("retry-card-normalize")) :: any
            test.not_nil(card)
            local retry = card.providers[1].options.retry
            test.not_nil(retry)
            test.eq(retry.attempts, 10)
            test.eq(retry.backoff_ms, 60000)
            test.is_nil(retry.ignored)

            models_repo.delete_card("retry-card-normalize")
        end)

        test.it("drives discovery capability from adapters, not a hardcoded allowlist", function()
            test.is_nil(models_types.DISCOVERABLE_PROVIDERS)

            for _, adapter in ipairs(provider_read_model.adapters()) do
                test.eq(adapter.discoverable, provider_registry.adapter_for(adapter.id) ~= nil)
            end
        end)

    end)

end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
