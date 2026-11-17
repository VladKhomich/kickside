-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Contract: registering and retiring model cards through
-- kickside.models.cards:cards. The contract shares its write path with
-- PUT /models/cards, so a card it saves is the card the admin save would store.
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local contract = require("contract")
local registry = require("registry")
local models_repo = require("models_repo")
local model_catalog = require("model_catalog")
local card_service = require("card_service")
local models_cache = require("models_cache")
local sql = require("sql")
local json = require("json")

local UPSERT = "kickside.models.cards:upsert_card"
local DISABLE = "kickside.models.cards:disable_card"
local CONTRACT = "kickside.models.cards:cards"
local BINDING = "kickside.models.cards:cards_binding"
local NAME = "cc-trained-model"

local TRAIN = {
    weights_digest = "sha256:0123456789abcdef",
    manifest_sha256 = "fedcba9876543210",
    lineage = { parent = "base-model", run = "run-1" },
}

local function card_body(overrides: any?): any
    local body = {
        name = NAME,
        title = "Trained model",
        provider_id = "wippy.llm.openai:provider",
        provider_model = "cc-trained-model-v1",
        capabilities = { "generate" },
        class = { "cc-trained-class" },
        max_tokens = 32768,
        output_tokens = 4096,
        metadata = { train = TRAIN },
    }
    for k, v in pairs(overrides or {}) do body[k] = v end
    return body
end

local function call(id: string, args: any): any
    local result, err = funcs.new():call(id, args)
    test.is_nil(err, "call " .. id)
    test.not_nil(result, "no result from " .. id)
    return result
end

local function overlay_count(name: string): number
    local overlays, err = models_repo.list_card_overlays()
    test.is_nil(err)
    local n = 0
    for _, item in ipairs(overlays) do
        if item.name == name then n = n + 1 end
    end
    return n
end

local function in_class(class_name: string, name: string): boolean
    for _, card in ipairs(model_catalog.get_by_class(class_name) or {}) do
        if card.name == name then return true end
    end
    return false
end

local function cleanup()
    models_repo.delete_card(NAME)
end

local function stored_profile(id: string): any
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT * FROM kickside_model_provider_profiles WHERE id = $1", { id })
    db:release()
    test.is_nil(err)
    return rows[1]
end

local function with_existing_provider(fn: (any) -> ())
    local profile = assert(models_repo.create_profile({
        id = "cc-existing-provider", name = "Existing provider",
        provider_id = "wippy.llm.openai:provider", api_key = "cc-existing-credential",
    }))
    local ok, err = pcall(function()
        assert(models_repo.upsert_card(card_body({
            name = "cc-existing-card", provider_profile_id = profile.id,
            class = { "cc-existing-class" },
        })))
        fn(profile)
    end)
    local deleted, delete_err = models_repo.delete_card(NAME)
    test.eq(deleted, true, tostring(delete_err))
    deleted, delete_err = models_repo.delete_profile(profile.id)
    test.eq(deleted, true, tostring(delete_err))
    if not ok then error(err, 0) end
end

local function define_tests()
    test.describe("cards contract: upsert_card", function()
        test.it("registers a card that resolves by name and class, with its train metadata", function()
            local result = call(UPSERT, card_body())
            test.eq(result.success, true, tostring(result.error))
            test.eq(result.model.name, NAME)
            test.eq(result.model.metadata.train.weights_digest, TRAIN.weights_digest)
            test.eq(result.model.metadata.train.manifest_sha256, TRAIN.manifest_sha256)
            test.eq(result.model.metadata.train.lineage.run, "run-1")

            local resolved, err = model_catalog.get_by_name(NAME)
            test.is_nil(err)
            test.eq(resolved.providers[1].provider_model, "cc-trained-model-v1")
            test.is_true(in_class("cc-trained-class", NAME))
            cleanup()
        end)

        test.it("is idempotent by card name and updates in place", function()
            call(UPSERT, card_body())
            local again = call(UPSERT, card_body({ priority = 33 }))
            test.eq(again.success, true, tostring(again.error))
            test.eq(overlay_count(NAME), 1)
            test.eq(model_catalog.get_by_name(NAME).priority, 33)
            test.eq(again.model.metadata.train.weights_digest, TRAIN.weights_digest)
            cleanup()
        end)

        test.it("stores the same card as the shared admin save path", function()
            local via_contract = call(UPSERT, card_body())
            cleanup()
            local via_service = card_service.save(card_body())
            test.eq(via_contract.model.provider_model, via_service.provider_model)
            test.eq(via_contract.model.max_tokens, via_service.max_tokens)
            test.eq(via_contract.model.metadata.train.manifest_sha256, via_service.metadata.train.manifest_sha256)
            cleanup()
        end)

        test.it("rejects a body without a name", function()
            local result = call(UPSERT, { provider_model = "x" })
            test.eq(result.success, false)
        end)

        test.it("rejects train metadata that lacks its digests", function()
            local result = call(UPSERT, card_body({ metadata = { train = { lineage = {} } } }))
            test.eq(result.success, false)
            test.eq(overlay_count(NAME), 0)
        end)
    end)

    test.describe("cards contract: disable_card", function()
        test.it("retires a card from name and class resolution and keeps its row", function()
            call(UPSERT, card_body())
            local result = call(DISABLE, { name = NAME })
            test.eq(result.success, true, tostring(result.error))
            test.eq(result.model.enabled, false)
            test.eq(result.model.metadata.train.weights_digest, TRAIN.weights_digest)
            local resolved = model_catalog.get_by_name(NAME)
            test.is_nil(resolved)
            test.is_true(not in_class("cc-trained-class", NAME))
            test.eq(overlay_count(NAME), 1)
            cleanup()
        end)

        test.it("is idempotent", function()
            call(UPSERT, card_body())
            call(DISABLE, { name = NAME })
            local again = call(DISABLE, { name = NAME })
            test.eq(again.success, true, tostring(again.error))
            test.eq(again.model.enabled, false)
            cleanup()
        end)

        test.it("re-enables through upsert_card", function()
            call(UPSERT, card_body())
            call(DISABLE, { name = NAME })
            local result = call(UPSERT, card_body({ enabled = true }))
            test.eq(result.success, true, tostring(result.error))
            test.not_nil(model_catalog.get_by_name(NAME))
            cleanup()
        end)

        test.it("fails for a card that is not stored", function()
            local result = call(DISABLE, { name = "cc-never-saved" })
            test.eq(result.success, false)
            test.eq(overlay_count("cc-never-saved"), 0)
        end)
    end)

    test.describe("card_registrar policy", function()
        for _, action in ipairs({ "upsert_card", "disable_card" }) do
            for _, cold in ipairs({ false, true }) do
                test.it(action .. " preserves existing encrypted providers with a " .. (cold and "cold" or "warm") .. " cache", function()
                    with_existing_provider(function(profile)
                        assert(card_service.save(card_body()))
                        local before = stored_profile(profile.id)
                        if cold then models_cache.clear() end
                        local scope = assert(security.new_scope({ assert(security.policy("kickside.models.security:card_registrar")) }))
                        local cards = assert(assert(contract.get(CONTRACT))
                            :with_actor(security.new_actor("module-registrar", {})):with_scope(scope):open())
                        local result, call_err
                        if action == "upsert_card" then
                            result, call_err = (cards :: any):upsert_card(card_body({ priority = 42 }))
                        else
                            result, call_err = (cards :: any):disable_card({ name = NAME })
                        end
                        test.is_nil(call_err, tostring(call_err))
                        test.eq(result.success, true, tostring(result.error))
                        local existing, read_err = models_repo.get_profile(profile.id)
                        test.is_nil(read_err, tostring(read_err))
                        test.eq(existing.enabled, true)
                        test.is_nil(existing.error)
                        test.eq(existing.secret_config.api_key, "cc-existing-credential")
                        for _, identifier in ipairs({ "cc-existing-card", "class:cc-existing-class" }) do
                            local resolved, resolve_err = model_catalog.resolve(identifier)
                            test.is_nil(resolve_err, tostring(resolve_err))
                            test.eq(resolved.providers[1].context.api_key, "cc-existing-credential")
                        end
                        local after = stored_profile(profile.id)
                        for key, value in pairs(before) do test.eq(after[key], value, key) end
                        test.is_nil((assert(json.encode(result)):find("cc-existing-credential", 1, true)))
                    end)
                end)
            end
        end

        test.it("admits the contract, its binding and its functions, and nothing else", function()
            local policy = assert(security.policy("kickside.models.security:card_registrar"))
            local actor = security.new_actor("module-registrar", {})
            for _, id in ipairs({
                "kickside.models.cards:cards",
                "kickside.models.cards:cards_binding",
            }) do
                test.not_nil(registry.get(id), id)
                test.eq(policy:evaluate(actor, "contract.open", id), "allow", id)
            end
            for _, id in ipairs({ UPSERT, DISABLE }) do
                test.not_nil(registry.get(id), id)
                test.eq(policy:evaluate(actor, "funcs.call", id), "allow", id)
            end
            test.eq(policy:evaluate(actor, "contract.call", "upsert_card"), "allow")
            test.eq(policy:evaluate(actor, "contract.call", "disable_card"), "allow")
            test.eq(policy:evaluate(actor, "funcs.call", "kickside.models.persist:repo"), "undefined")
            test.eq(policy:evaluate(actor, "access", "kickside.models.api.admin:upsert_card.endpoint"), "undefined")
            test.eq(policy:evaluate(actor, "db.get", "*"), "undefined")
            test.eq(policy:evaluate(actor, "env.get", "ENCRYPTION_KEY"), "undefined")
            local writer_key = assert(security.policy("kickside.models.cards:card_writer_encryption_key"))
            test.eq(writer_key:evaluate(actor, "env.get", "ENCRYPTION_KEY"), "allow")
            test.eq(writer_key:evaluate(actor, "env.get", "OTHER_KEY"), "undefined")
            test.eq(writer_key:evaluate(actor, "env.set", "ENCRYPTION_KEY"), "undefined")
        end)

        test.it("opens the contract through its binding and saves and retires a card", function()
            local scope = assert(security.new_scope({ assert(security.policy("kickside.models.security:card_registrar")) }))
            local cards, open_err = assert(contract.get(CONTRACT))
                :with_actor(security.new_actor("module-registrar", {})):with_scope(scope):open()
            test.is_nil(open_err, tostring(open_err))
            local result, call_err = (cards :: any):upsert_card(card_body())
            test.is_nil(call_err, tostring(call_err))
            test.eq(result.success, true, tostring(result.error))
            test.eq(model_catalog.get_by_name(NAME).name, NAME)
            local disabled, disable_err = (cards :: any):disable_card({ name = NAME })
            test.is_nil(disable_err, tostring(disable_err))
            test.eq(disabled.model.enabled, false)
            cleanup()
        end)

        test.it("keeps the contract out of the member module grant", function()
            local runtime = assert(security.policy("kickside.models.security:module_runtime"))
            local actor = security.new_actor("module-member", {})
            for _, id in ipairs({ UPSERT, DISABLE }) do
                test.eq(runtime:evaluate(actor, "funcs.call", id), "undefined", id)
            end
            for _, id in ipairs({ CONTRACT, BINDING }) do
                test.eq(runtime:evaluate(actor, "contract.open", id), "undefined", id)
            end
        end)
    end)
end

return { run = test.run_cases(define_tests) }
