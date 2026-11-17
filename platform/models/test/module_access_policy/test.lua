local test = require("test")
local registry = require("registry")
local security = require("security")
local funcs = require("funcs")
local models_repo = require("models_repo")
local models_cache = require("models_cache")
local function composed_scope(root)
    local policies, seen = {}, {}
    local function include(id)
        if seen[id] then return end
        seen[id] = true
        local entry, err = registry.get(id)
        assert(not err, tostring(err))
        assert(entry, id)
        policies[#policies + 1] = assert(security.policy(id))
        for _, child in ipairs(entry.meta.includes or {}) do include(child) end
    end
    include(root)
    return assert(security.new_scope(policies))
end
local function define_tests()
    test.describe("Module access composition", function()
        test.it("grants only the resolver action and resource pairs", function()
            local scope = composed_scope("kickside.models.security:module_access")
            local actor = security.new_actor("resolver-policy-member", {})
            for _, resource in ipairs({"wippy.llm:model_resolver", "resolve"}) do
                for _, action in ipairs({"registry.get", "contract.get", "contract.open", "contract.call", "contract.implementations"}) do
                    local expected = (resource == "wippy.llm:model_resolver" and action == "contract.get")
                        or (resource == "resolve" and action == "contract.call")
                    test.eq(scope:evaluate(actor, action, resource), expected and "allow" or "undefined", action .. " " .. resource)
                end
            end
        end)
        test.it("keeps saved provider credentials inside provider execution", function()
            local profile_id = "member-credential-profile"
            local name = "member-credential-model"
            local profile, profile_err = models_repo.create_profile({
                id = profile_id, name = "Member credential profile",
                provider_id = "wippy.llm.openai_compat:provider",
                base_url = "https://provider.example.test/v1", api_key = "fixture-provider-secret",
            })
            test.is_nil(profile_err, tostring(profile_err))
            test.not_nil(profile)
            local card, save_err = models_repo.upsert_card({
                name = name, title = "Member credential model", provider_profile_id = profile_id,
                provider_id = "wippy.llm.openai_compat:provider", provider_model = "fixture",
                capabilities = {"embed"}, dimensions = 512, max_tokens = 8192, enabled = true,
            })
            test.is_nil(save_err, tostring(save_err))
            test.not_nil(card)
            local actor = security.new_actor("credential-member", {})
            local scope = assert(security.named_scope("app:selected_model_members"))
            local caller = funcs.new():with_actor(actor):with_scope(scope)
            local resolved, err = caller:call("kickside.models.test.module_access:resolve_probe", {model = name})
            local readable, read_err = caller:call("kickside.models.test.module_access:store_probe", {})
            local outside_scope = assert(security.named_scope("app:other_members"))
            local outside, outside_err = funcs.new():with_actor(actor):with_scope(outside_scope)
                :call("kickside.models.test.module_access:resolve_probe", {model = name})
            local _, delete_err = models_repo.delete_profile(profile_id)
            test.is_nil(delete_err, tostring(delete_err))
            test.is_nil(err, tostring(err))
            test.not_nil(resolved)
            test.eq(resolved.name, name)
            test.is_nil(readable, "Member reads the private model snapshot")
            test.not_nil(read_err, "Private store read is denied by the runtime")
            test.not_nil(tostring(read_err):find("not allowed to access store: kickside.models:cache", 1, true), tostring(read_err))
            test.is_nil(outside, "Unselected members resolve configured models")
            test.not_nil(outside_err, "The selected host group excludes other members at runtime")
            test.is_true(errors.is(outside_err, errors.PERMISSION_DENIED), tostring(outside_err))
            local serialized = require("json").encode(resolved)
            test.is_nil(serialized:find("fixture-provider-secret", 1, true), "Resolution discloses a saved provider credential")
        end)
        test.it("executes saved routes inside the owner frame without database access", function()
            local profile = assert(models_repo.create_profile({id = "binding-profile", name = "Binding profile",
                provider_id = "kickside.models.providers:fixture_provider", api_key = "fixture-provider-secret"}))
            assert(models_repo.upsert_card({name = "binding-model", provider_profile_id = profile.id,
                provider_id = "kickside.models.providers:fixture_provider", provider_model = "fixture",
                capabilities = {"generate", "embed", "structured_output"}, max_tokens = 8192, output_tokens = 1024, enabled = true}))
            local scope = assert(security.named_scope("app:selected_model_members"))
            local actor = security.new_actor("binding-member", {})
            test.eq(scope:evaluate(actor, "db.get", "app:db"), "undefined")
            test.eq(scope:evaluate(actor, "env.get", "ENCRYPTION_KEY"), "undefined")
            test.eq(scope:evaluate(actor, "funcs.call", "kickside.models.persist:reload_profiles"), "undefined")
            models_cache.clear()
            local response, err = funcs.new():with_actor(actor):with_scope(scope)
                :call("kickside.models.test.module_access:execution_probe", {model = "binding-model"})
            local _, delete_err = models_repo.delete_profile(profile.id)
            test.is_nil(delete_err, tostring(delete_err))
            test.is_nil(err, tostring(err))
            test.not_nil(response)
            test.eq(response.provider_id, "kickside.models:provider")
            test.eq(response.calls, 9)
        end)
        for _, hostile in ipairs({
            {name = "redirecting saved credentials", context = {base_url = "https://untrusted.example.test/v1"}},
            {name = "injecting provider headers", context = {headers = {Authorization = "untrusted", ["X-Untrusted"] = "present"}}},
            {name = "changing driver configuration", context = {
                organization = "untrusted", api_version = "untrusted", region = "untrusted",
                timeout_env = "UNTRUSTED_TIMEOUT", api_key_env = "UNTRUSTED_KEY",
                base_url_env = "UNTRUSTED_URL", client_id = "untrusted:client",
                retry = {attempts = 10}, beta_features = {"untrusted"}, extension_option = "untrusted",
            }},
        }) do
            test.it("keeps caller context from " .. hostile.name, function()
                local profile = assert(models_repo.create_profile({id = "context-profile", name = "Context profile",
                    provider_id = "kickside.models.providers:fixture_provider", api_key = "fixture-provider-secret"}))
                assert(models_repo.upsert_card({name = "context-model", provider_profile_id = profile.id,
                    provider_id = profile.provider_id, provider_model = "fixture", capabilities = {"generate"},
                    max_tokens = 8192, output_tokens = 1024, enabled = true}))
                local scope = assert(security.named_scope("app:selected_model_members"))
                local actor = security.new_actor("context-member", {})
                local response, err = funcs.new():with_actor(actor):with_scope(scope)
                    :call("kickside.models.test.module_access:execution_probe", {model = "context-model", context = hostile.context})
                local _, delete_err = models_repo.delete_profile(profile.id)
                test.is_nil(delete_err, tostring(delete_err))
                test.is_nil(err, tostring(err))
                test.not_nil(response)
            end)
        end
        test.it("honors request execution controls through saved routes", function()
            local profile = assert(models_repo.create_profile({id = "deadline-profile", name = "Deadline profile",
                provider_id = "kickside.models.providers:fixture_provider", api_key = "fixture-provider-secret"}))
            assert(models_repo.upsert_card({name = "deadline-model", provider_profile_id = profile.id,
                provider_id = profile.provider_id, provider_model = "fixture", capabilities = {"generate"},
                max_tokens = 8192, output_tokens = 1024, enabled = true}))
            local scope = assert(security.named_scope("app:selected_model_members"))
            local response, err = funcs.new():with_actor(security.new_actor("deadline-member", {})):with_scope(scope)
                :call("kickside.models.test.module_access:deadline_probe", {model = "deadline-model"})
            local _, delete_err = models_repo.delete_profile(profile.id)
            test.is_nil(delete_err, tostring(delete_err))
            test.is_nil(err, tostring(err))
            test.not_nil(response)
        end)
        for _, echo in ipairs({"message", "details", "metadata"}) do
            test.it("keeps returned provider " .. echo .. " free of saved credentials", function()
                local profile = assert(models_repo.create_profile({id = "echo-profile", name = "Echo profile",
                    provider_id = "kickside.models.providers:fixture_provider", api_key = "fixture-provider-secret"}))
                assert(models_repo.upsert_card({name = "echo-model", provider_profile_id = profile.id,
                    provider_id = profile.provider_id, provider_model = "fixture", capabilities = {"generate"},
                    max_tokens = 8192, output_tokens = 1024, enabled = true}))
                local scope = assert(security.named_scope("app:selected_model_members"))
                local response, err = funcs.new():with_actor(security.new_actor("echo-member", {})):with_scope(scope)
                    :call("kickside.models.test.module_access:execution_probe", {model = "echo-model", echo = echo})
                local _, delete_err = models_repo.delete_profile(profile.id)
                test.is_nil(delete_err, tostring(delete_err))
                test.is_nil(err, tostring(err))
                test.eq(response, true)
            end)
        end
        test.it("resolves saved models under the member execution scope", function()
            local name = "member-resolver-model"
            local card, save_err = models_repo.upsert_card({name = name, title = "Member model",
                provider_id = "wippy.llm.openai_compat:provider", provider_model = "fixture",
                capabilities = {"embed"}, dimensions = 512, max_tokens = 8192, output_tokens = 0, enabled = true})
            test.is_nil(save_err, tostring(save_err))
            test.not_nil(card)
            local actor = security.new_actor("model-member", {})
            local scope = composed_scope("kickside.models.security:module_access")
            test.eq(scope:evaluate(actor, "store.get", "kickside.models:cache"), "undefined")
            test.eq(scope:evaluate(actor, "db.get", "app:db"), "undefined")
            local resolved, err = funcs.new():with_actor(actor):with_scope(scope)
                :call("kickside.models.catalog:model_resolver_func", {model = name})
            local through_llm, llm_err = funcs.new():with_actor(actor):with_scope(scope)
                :call("kickside.models.test.module_access:resolve_probe", {model = name})
            local _, delete_err = models_repo.delete_card(name)
            test.is_nil(delete_err, tostring(delete_err))
            test.is_nil(err, tostring(err))
            test.not_nil(resolved, "Member resolution loses a configured model")
            test.eq(resolved.name, name)
            test.is_nil(llm_err, tostring(llm_err))
            test.not_nil(through_llm)
            test.eq(through_llm.name, name)
        end)
        test.it("admits exactly the listed endpoint identities", function()
            local policy_id = "kickside.models.security:models_endpoint_access"
            local declaration, declaration_err = registry.get(policy_id)
            test.is_nil(declaration_err)
            test.not_nil(declaration)
            test.is_nil(declaration.data.policy.conditions)
            local expected = {
                ["kickside.models.api:list_model_classes.endpoint"] = true,
                ["kickside.models.api:list_models.endpoint"] = true,
                ["kickside.models.api:models_by_name.endpoint"] = true,
            }
            local listed = {}
            for _, id in ipairs(declaration.data.policy.resources) do
                test.is_true(expected[id] == true, id)
                test.is_nil(listed[id], id)
                listed[id] = true
                local entry, err = registry.get(id)
                test.is_nil(err, id)
                test.not_nil(entry, id)
                test.eq(entry.kind, "http.endpoint", id)
            end
            for id in pairs(expected) do test.is_true(listed[id] == true, id) end
            local policy, policy_err = security.policy(policy_id)
            test.is_nil(policy_err)
            local actor = security.new_actor("listed-endpoint-member", {})
            local endpoints, find_err = registry.find({[".kind"] = "http.endpoint"})
            test.is_nil(find_err)
            for _, entry in ipairs(endpoints) do
                local id = tostring(entry.id)
                test.eq(policy:evaluate(actor, "access", id), expected[id] and "allow" or "undefined", id)
            end
            for id in pairs(expected) do
                test.eq(policy:evaluate(actor, "access", id .. ".unlisted"), "undefined", id)
            end
        end)
        test.it("declares a compatible platform Members default for every member requirement", function()
            for _, id in ipairs({"kickside.models.security:user_security_scope"}) do
                local requirement, err = registry.get(id)
                test.is_nil(err, id)
                test.not_nil(requirement, id)
                test.eq(requirement.meta.value_kind, "security.scope", id)
                test.eq(requirement.data.default, "kickside.security.groups:members", id)
            end
        end)
        test.it("admits owned member endpoints and rejects other modules", function()
            local policy, err = security.policy("kickside.models.security:models_endpoint_access")
            test.is_nil(err)
            test.not_nil(policy)
            local actor = security.new_actor("module-member", {})
            local bundle = composed_scope("kickside.models.security:module_access")
            for _, id in ipairs({
                "kickside.models.api:list_models.endpoint",
                "kickside.models.api:list_model_classes.endpoint",
                "kickside.models.api:models_by_name.endpoint",
            }) do
                test.not_nil(registry.get(id), id)
                test.eq(policy:evaluate(actor, "access", id), "allow", id)
                test.eq(bundle:evaluate(actor, "access", id), "allow", id)
                test.eq(policy:evaluate(actor, "access", (id .. ".unlisted")), "undefined", id)
                test.eq(policy:evaluate(actor, "funcs.call", id), "undefined", id)
            end
            for _, id in ipairs({ "unrelated.module:list.endpoint", "kickside.models_extension:list.endpoint" }) do
                test.eq(policy:evaluate(actor, "access", id), "undefined", id)
            end
        end)
        test.it("includes module discovery without an application blanket grant", function()
            local declaration = registry.get("kickside.models.security:module_access")
            test.is_true(type(declaration.meta.title) == "string" and declaration.meta.title ~= "")
            test.eq(declaration.meta.intent, "module_access")
            test.eq(declaration.meta.surface, "kickside.models")
            test.is_true(declaration.meta.private ~= true)
            local scope, scope_err = composed_scope("kickside.models.security:module_access")
            test.is_nil(scope_err)
            local actor = security.new_actor("module-member", {})
            test.eq(scope:evaluate(actor, "registry.get", "kickside.models:db_config"), "allow")
            for _, action in ipairs({ "access", "registry.get", "funcs.call" }) do
                test.eq(scope:evaluate(actor, action, "unrelated.module:list.endpoint"), "undefined", action)
            end
        end)
    end)
end
local run_cases = test.run_cases(define_tests)
return {
    run = function(options) return run_cases(options) end,
    store_probe = function()
        local snapshot, err = require("store").get("kickside.models:cache")
        if err then return nil, err end
        local value, read_err = snapshot:get("snapshot")
        snapshot:release()
        return value, read_err
    end,
    execution_probe = function(input)
        local card, resolve_err = require("llm").resolve_model(input.model)
        if resolve_err then return nil, resolve_err end
        local route = card.providers[1]
        assert(route.id == "kickside.models:provider", "Saved route bypasses the models binding")
        assert(require("json").encode(card):find("fixture-provider-secret", 1, true) == nil)
        local requested_context = {}
        for key, value in pairs(route.context) do requested_context[key] = value end
        for key, value in pairs(input.context or {}) do requested_context[key] = value end
        local provider, open_err = require("providers").open(route.id, requested_context)
        if open_err then return nil, open_err end
        if input.echo then
            local result, failure = provider:generate({model = route.provider_model, options = {echo = input.echo}})
            local diagnostic
            if input.echo == "metadata" then
                assert(failure == nil, tostring(failure))
                assert(result.success == true and result.metadata.status == 401)
                diagnostic = require("json").encode(result)
            elseif input.echo == "details" then
                assert(failure:kind() == errors.PERMISSION_DENIED and failure:retryable() == false)
                assert(failure:details().status == 401)
                diagnostic = tostring(failure) .. require("json").encode(failure:details())
            else
                local direct = assert(require("providers").open("kickside.models.providers:fixture_provider",
                    {api_key = "fixture-provider-secret"}))
                local _, direct_error = direct:generate({model = route.provider_model, options = {echo = input.echo}})
                assert(type(failure) == type(direct_error), "Driver error type changes")
                if type(failure) == "userdata" then
                    assert(failure:kind() == direct_error:kind() and failure:retryable() == direct_error:retryable())
                end
                diagnostic = tostring(failure)
            end
            assert(not diagnostic:find("fixture-provider-secret", 1, true), "Caller receives raw credential")
            assert(not diagnostic:find("Zml4dHVyZS1wcm92aWRlci1zZWNyZXQ=", 1, true), "Caller receives encoded credential")
            assert(diagnostic:find("401", 1, true), "Non-secret diagnostics disappear")
            return true
        end
        local calls = 0
        for _, method in ipairs({"status", "generate", "embed", "structured_output", "evaluate"}) do
            local result, err = provider[method](provider, {model = route.provider_model})
            assert(err == nil, tostring(err))
            assert(result and result.success == true, method .. " does not authenticate")
            calls = calls + 1
        end
        local _, driver_err = provider:generate({model = route.provider_model, options = {reject = true}})
        local direct = assert(require("providers").open("kickside.models.providers:fixture_provider", {api_key = "fixture-provider-secret"}))
        local _, direct_err = direct:generate({model = route.provider_model, options = {reject = true}})
        assert(type(driver_err) == type(direct_err), "Driver error type changes")
        assert(tostring(driver_err) == tostring(direct_err) and tostring(driver_err) == "fixture-driver-error", tostring(driver_err))
        local llm = require("llm")
        for index, operation in ipairs({
            function() return llm.generate("hello", {model = input.model, max_tokens = 64}) end,
            function() return llm.embed("hello", {model = input.model}) end,
            function() return llm.structured_output({type = "object"}, "hello", {model = input.model, max_tokens = 64}) end,
            function() return llm.status({model = input.model}) end,
        }) do
            local result: any, err = operation()
            assert(err == nil, tostring(err))
            assert(result ~= nil, "LLM call fails")
            if index == 1 then assert(result.result == "ok") end
            if index == 2 then assert(result.result[1][1] == 1) end
            if index == 3 then assert(result.result.ok == true) end
            if index == 4 then assert(result.status == "healthy") end
            calls = calls + 1
        end
        return {provider_id = route.id, calls = calls}
    end,
    driver_probe = function(input)
        local context = require("ctx").all()
        assert(context.api_key == "fixture-provider-secret", "Provider authentication fails")
        assert(context.driver_default == "retained", "Driver options disappear")
        assert(context.base_url ~= "https://untrusted.example.test/v1", "Caller redirects saved credentials")
        assert(not context.headers or not context.headers["X-Untrusted"], "Caller injects provider headers")
        for _, key in ipairs({"organization", "api_version", "region", "client_id", "extension_option"}) do
            assert(context[key] ~= "untrusted", "Caller changes " .. key)
        end
        assert(context.timeout_env ~= "UNTRUSTED_TIMEOUT" and context.api_key_env ~= "UNTRUSTED_KEY"
            and context.base_url_env ~= "UNTRUSTED_URL", "Caller changes environment references")
        assert(not context.retry or context.retry.attempts ~= 10, "Caller changes retry policy")
        assert(not context.beta_features or context.beta_features[1] ~= "untrusted", "Caller changes API features")
        if input and input.options and input.options.echo then
            local message = "HTTP 401: " .. context.api_key
            local details = {status = 401, nested = {authorization = "Bearer " .. context.api_key,
                encoded = "Zml4dHVyZS1wcm92aWRlci1zZWNyZXQ="}}
            if input.options.echo == "metadata" then return {success = true, metadata = details} end
            if input.options.echo == "message" then return nil, message end
            return nil, errors.new({kind = errors.PERMISSION_DENIED, retryable = false,
                message = message, details = details})
        end
        if input and input.options and input.options.reject then return nil, "fixture-driver-error" end
        local result = {content = "ok"}
        if input and input.schema then result = {data = {ok = true}}
        elseif input and input.input then result = {embeddings = {{1}}}
        elseif input and input.questions then result = {readings = {}} end
        return {success = true, status = "healthy", result = result,
            metadata = {deadline_at = context.deadline_at, timeout = input.timeout or context.timeout},
            tokens = {prompt_tokens = 1, completion_tokens = 1, total_tokens = 2}, finish_reason = "stop"}
    end,
    resolve_probe = function(input)
        local definition, err = require("contract").get("wippy.llm:model_resolver")
        if err then return nil, err end
        local _, open_err = definition:open()
        if open_err then return nil, open_err end
        return require("llm").resolve_model(input.model)
    end,
}
