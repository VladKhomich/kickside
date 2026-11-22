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

        test.it("keeps shipped model classes compact", function()
            local entries, err = registry.find({ ["meta.type"] = "llm.model" })
            test.is_nil(err)
            for _, entry in ipairs(entries or {}) do
                local m = meta(entry) or {}
                for _, class_name in ipairs(m.class or {}) do
                    test.is_true(allowed_class(class_name), "unexpected model class: " .. tostring(class_name))
                end
            end
        end)

        test.it("publishes provider discovery adapters behind the discovery port", function()
            for _, id in ipairs({
                "kickside.models.discovery:model_discovery",
                "kickside.models.discovery:common",
                "kickside.models.discovery:mapper",
                "kickside.models.discovery:provider.openai_like",
                "kickside.models.discovery:provider.anthropic",
                "kickside.models.discovery:provider.google_genai",
                "kickside.models.discovery:provider.bedrock",
                "kickside.models.discovery:provider_registry",
            }) do
                local entry, err = registry.get(id)
                test.is_nil(err)
                test.not_nil(entry, id .. " is missing")
                test.eq(value(entry, "kind"), "library.lua")
            end
        end)

        test.it("publishes the model resolver binding", function()
            local entry, err = registry.get("kickside.models:model_resolver")
            test.is_nil(err)
            test.not_nil(entry)
            test.eq(value(entry, "kind"), "contract.binding")
        end)

        test.it("declares provider presets and editor web components", function()
            local presets = provider_read_model.presets()
            local by_key = {}
            for _, preset in ipairs(presets) do
                by_key[preset.key] = preset
            end
            test.not_nil(by_key["openrouter"])
            test.eq(by_key["openrouter"].provider_id, "wippy.llm.openai_compat:provider")
            test.eq(by_key["openrouter"].config.base_url, "https://openrouter.ai/api/v1")
            test.eq(by_key["openrouter"].config.api_key_env, "OPENROUTER_API_KEY")
            test.not_nil(by_key["openai-compatible-plain"])
            test.eq(by_key["openai-compatible-plain"].provider_id, "kickside.models:openai_compat_plain.provider")
            test.not_nil(by_key["anthropic"])
            test.eq(by_key["anthropic"].profile_editor_tag, "kickside-model-provider-anthropic")
            test.not_nil(by_key["google-gemini"])
            test.not_nil(by_key["google-vertex"])
            test.eq(by_key["google-vertex"].config.project_env, "GOOGLE_CLOUD_PROJECT")
            test.eq(by_key["google-vertex"].config.google_credentials_env, "GOOGLE_CREDENTIALS")
            test.not_nil(by_key["bedrock"])
            test.not_nil(by_key["groq"])
            test.not_nil(by_key["mistral"])

            local editors = provider_read_model.adapters()
            local adapter_by_provider = {}
            for _, adapter in ipairs(editors) do
                adapter_by_provider[adapter.id] = adapter
            end
            test.eq(adapter_by_provider["wippy.llm.openai:provider"].profile_editor_tag, "kickside-model-provider-openai")
            test.eq(adapter_by_provider["wippy.llm.openai:provider"].discoverable, true)
            test.eq(adapter_by_provider["kickside.models:openai_compat_plain.provider"].profile_editor_tag, "kickside-model-provider-openai-compatible")
            test.eq(adapter_by_provider["kickside.models:openai_compat_plain.provider"].discoverable, true)
            test.eq(adapter_by_provider["wippy.llm.claude:provider"].profile_editor_tag, "kickside-model-provider-anthropic")
            test.eq(adapter_by_provider["wippy.llm.claude:provider"].discoverable, true)
            test.eq(adapter_by_provider["wippy.llm.google.generative_ai:provider"].profile_editor_tag, "kickside-model-provider-google-generative-ai")
            test.eq(adapter_by_provider["wippy.llm.google.generative_ai:provider"].discoverable, true)
            test.eq(adapter_by_provider["wippy.llm.google.vertex:provider"].profile_editor_tag, "kickside-model-provider-google-vertex")
            test.eq(adapter_by_provider["wippy.llm.google.vertex:provider"].discoverable, false)
            test.eq(adapter_by_provider["wippy.llm.bedrock:provider"].profile_editor_tag, "kickside-model-provider-bedrock")
            test.eq(adapter_by_provider["wippy.llm.bedrock:provider"].discoverable, true)

            local editor_entries = registry.find({
                [".kind"] = "registry.entry",
                ["meta.type"] = "kickside.models:provider_profile_editor",
            }) or {}
            local editor_tags = {}
            for _, entry in ipairs(editor_entries) do
                local tag = value(entry, "tag_name")
                if type(tag) == "string" and tag ~= "" then editor_tags[tag] = true end
            end
            for _, preset in ipairs(presets) do
                if type(preset.profile_editor_tag) == "string" and preset.profile_editor_tag ~= "" then
                    test.is_true(editor_tags[preset.profile_editor_tag],
                        "preset profile_editor_tag must resolve as provider_profile_editor: " .. preset.profile_editor_tag)
                end
            end
            for _, adapter in ipairs(editors) do
                if type(adapter.profile_editor_tag) == "string" and adapter.profile_editor_tag ~= "" then
                    test.is_true(editor_tags[adapter.profile_editor_tag],
                        "adapter profile_editor_tag must resolve as provider_profile_editor: " .. adapter.profile_editor_tag)
                end
            end
        end)

        test.it("starts with no DB provider profiles", function()
            local profiles = models_repo.list_profiles_public()
            test.eq(#profiles, 0)
        end)

        -- Retry rides two declared surfaces: the profile's policy travels in
        -- the provider context (the llm layer's default), a card's own policy
        -- in its options (the caller override). A card's retry is normalized
        -- on write the same way a profile's is — garbage never persists.

    end)

end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
