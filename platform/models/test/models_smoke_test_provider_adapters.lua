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

        test.it("maps explicit provider reasoning metadata without model-id guesses", function()
            local caps = model_mapper.infer_capabilities("opaque-provider-model", {
                supported_parameters = { "tools", "response_format", "reasoning" },
                inputModalities = { "IMAGE" },
                outputModalities = { "TEXT" },
            })

            test.is_true(has(caps, "generate"))
            test.is_true(has(caps, "tool_use"))
            test.is_true(has(caps, "structured_output"))
            test.is_true(has(caps, "vision"))
            test.is_true(has(caps, "reasoning"))

            local options = model_mapper.infer_options("opaque-provider-model", {}, caps)
            test.eq(options.reasoning_model_request, true)
        end)

        test.it("recognizes first-party OpenAI reasoning families by model id", function()
            local openai = { provider_id = "wippy.llm.openai:provider" }
            local compat = { provider_id = "wippy.llm.openai_compat:provider" }

            -- OpenAI /v1/models reports bare ids, so the adapter carries the
            -- provider knowledge: o-series and gpt-5 series are reasoning
            -- models (they reject classic sampling parameters), chat-tuned
            -- variants keep sampling semantics.
            for _, id in ipairs({ "o3-mini", "o4-mini", "gpt-5", "gpt-5.6-luna" }) do
                local caps = provider_openai_like.capabilities(id, { id = id }, openai)
                test.is_true(has(caps, "reasoning"), id .. " carries reasoning")
                test.is_true(has(caps, "generate"), id .. " carries generate")
                local options = model_mapper.infer_options(id, {}, caps)
                test.eq(options.reasoning_model_request, true)
            end

            for _, id in ipairs({ "gpt-4.1", "gpt-4o", "gpt-5-chat-latest" }) do
                local caps = provider_openai_like.capabilities(id, { id = id }, openai)
                test.is_true(not has(caps, "reasoning"), id .. " stays sampling")
            end

            -- A compatible endpoint may serve any model under any name; the
            -- id families mean nothing there, explicit metadata still wins.
            local compat_caps = provider_openai_like.capabilities("gpt-5.6-luna", { id = "gpt-5.6-luna" }, compat)
            test.is_true(not has(compat_caps, "reasoning"))
            local explicit = provider_openai_like.capabilities("anything", {
                id = "anything", supported_parameters = { "reasoning" },
            }, compat)
            test.is_true(has(explicit, "reasoning"))
        end)

        test.it("rejects ambiguous Google Vertex authentication inputs", function()
            local profile, perr = models_repo.create_profile({
                id = "vertex-ambiguous-auth-test",
                name = "Vertex Ambiguous Auth Test",
                provider_id = "wippy.llm.google.vertex:provider",
                project_env = "GOOGLE_CLOUD_PROJECT",
                location_env = "VERTEX_AI_LOCATION",
                google_credentials_env = "GOOGLE_CREDENTIALS",
                access_token_env = "GOOGLE_ACCESS_TOKEN",
            })
            test.is_nil(profile)
            test.eq(perr, "Google Vertex profiles must use either service account credentials or a direct access token, not both")
        end)

        test.it("keeps Vertex project derivation in provider context", function()
            local profile, perr = models_repo.create_profile({
                id = "vertex-project-context-test",
                name = "Vertex Project Context Test",
                provider_id = "wippy.llm.google.vertex:provider",
                location = "us-central1",
                google_credentials = '{"project_id":"vertex-derived"}',
            })
            test.is_nil(perr)
            test.not_nil(profile)

            local stored = models_repo.get_profile("vertex-project-context-test")
            test.not_nil(stored)
            local context = catalog_policy.provider_context(stored)
            test.eq(context.project, "vertex-derived")
            test.eq(context.location, "us-central1")
            test.eq(context.google_credentials, '{"project_id":"vertex-derived"}')

            local deleted, derr = models_repo.delete_profile("vertex-project-context-test")
            test.eq(deleted, true)
            test.is_nil(derr)
        end)

        test.it("routes Vertex validation and normalization through provider-declared hooks", function()
            local editor = registry.get("kickside.models:provider_editor.google_vertex")
            test.not_nil(editor)
            local validate_func = value(editor, "validate_func")
            local on_change_func = value(editor, "on_change_func")
            test.eq(validate_func, "kickside.models.providers.google_vertex:google_vertex.validate")
            test.eq(on_change_func, "kickside.models.providers.google_vertex:google_vertex.on_change")
            test.not_nil((registry.get(validate_func)))
            test.not_nil((registry.get(on_change_func)))
        end)

        test.it("skips unsafe Vertex token refresh for multiple live credentials", function()
            local profile_a, perr_a = models_repo.create_profile({
                id = "vertex-topology-a",
                name = "Vertex Topology A",
                provider_id = "wippy.llm.google.vertex:provider",
                project = "vertex-a",
                location = "us-central1",
                google_credentials_env = "MODELS_VERTEX_CREDS_A",
            })
            test.is_nil(perr_a)
            test.not_nil(profile_a)

            local profile_b, perr_b = models_repo.create_profile({
                id = "vertex-topology-b",
                name = "Vertex Topology B",
                provider_id = "wippy.llm.google.vertex:provider",
                project = "vertex-b",
                location = "us-central1",
                google_credentials_env = "MODELS_VERTEX_CREDS_B",
            })
            test.is_nil(perr_b)
            test.not_nil(profile_b)

            local result = vertex_token_engine.refresh_once()
            test.eq(result.scanned, 2)
            test.eq(result.refreshed, 0)
            test.eq(result.skipped, 2)
            test.eq(result.failed, 2)

            local public_a = models_repo.get_profile_public("vertex-topology-a")
            local public_b = models_repo.get_profile_public("vertex-topology-b")
            test.eq(public_a.status, "unhealthy")
            test.contains(public_a.message, "global")
            test.eq(public_b.status, "unhealthy")
            test.contains(public_b.message, "global")

            local deleted_a, derr_a = models_repo.delete_profile("vertex-topology-a")
            test.eq(deleted_a, true)
            test.is_nil(derr_a)
            local deleted_b, derr_b = models_repo.delete_profile("vertex-topology-b")
            test.eq(deleted_b, true)
            test.is_nil(derr_b)
        end)

    end)

end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
