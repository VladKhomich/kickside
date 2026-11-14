-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local sql = require("sql")
local policy = require("catalog_policy")
local repo = require("models_repo")
local card_policy = require("card_policy")
local fake_http = require("fake_http")
local admin_handler = require("admin_handler")

local secret_keys = {
    "api_key", "access_key", "secret_key", "session_token", "google_credentials", "access_token",
    "headers", "authorization", "password", "api_token", "auth_token", "credential_blob",
    "api-key", "apikey", "secret", "token", "credential", "credentials",
    "access-token", "accesstoken", "anthropic_api_key", "api-token", "apitoken",
    "app_password", "app_secret", "app_token", "application_password", "application_secret",
    "application_token", "atlassian_oauth_client_secret", "auth-token", "auth_access_token", "auth_api_token",
    "auth_code_token", "auth_password", "authorization_code", "authtoken", "aws_bedrock_credentials",
    "aws_container_authorization_token", "aws_secret_access_key", "aws_session_token", "basic_auth_password", "bearer-token",
    "bearer_token", "bearertoken", "bedrock_credentials", "bot_token", "cached_token",
    "capability_token", "cerebras_api_key", "client-secret", "client-secret-key", "client_credentials",
    "client_password", "client_secret", "client_secret_key", "clientsecret", "clientsecretkey",
    "consumer_key_secret", "consumer_secret", "consumersecret", "container_authorization_token", "credential_context",
    "credential_context_with", "credential_header", "credential_json", "credentialjson", "credentials_json",
    "credentialsjson", "database_password", "db_password", "deepinfra_api_key", "direct_token",
    "endpoint_authorization", "endpoint_token", "fireworks_api_key", "gemini_api_key", "github_client_secret",
    "global_credentials", "google_access_token", "google_api_key", "google_application_credentials", "google_client_secret",
    "google_oauth2_token", "google_search_api_key", "googlecredentials", "groq_api_key", "httpcredentials",
    "id-token", "id_token", "identity_token", "idtoken", "jwt_secret",
    "jwt_token", "lease_token", "local_api_key", "mistral_api_key", "oauth-token",
    "oauth2_token", "oauth_access_token", "oauth_client_secret", "oauth_consumer_secret", "oauth_refresh_token",
    "oauth_token", "oauth_token_secret", "openai_api_key", "openai_compat_api_key", "openrouter_api_key",
    "password_hash", "passwords", "personal_access_token", "pg_password", "private_token",
    "privatetoken", "profile_credentials", "proxy-authorization", "proxy_authorization", "proxy_password",
    "refresh-token", "refresh_token", "refreshtoken", "repository_live_token", "secret-key",
    "secret_access_key", "secret_config", "secret_json", "secret_value", "secretaccesskey",
    "secretkey", "secrets", "secretvalue", "security_token", "securitytoken",
    "service_account_credentials", "service_token", "serviceaccountcredentials", "session-token", "sessiontoken",
    "setting_api_key", "setting_client_secret", "setting_google_search_api_key", "setup_token", "setuptoken",
    "shared_secret", "shared_service_token", "signing_secret", "smtp_password", "state_token",
    "stored_credentials", "target_token", "together_api_key", "token-secret", "token_auth",
    "token_data", "token_key", "token_response", "token_secret", "token_value",
    "tokensecret", "trust_token", "typesafe_api_key", "upload_token", "user_password",
    "user_token", "web_socket_token", "webhook_secret", "websockettoken", "x-access-token",
    "x-api-key", "x-apikey", "x-auth-token", "x-authorization", "x_access_token",
    "x_api_key", "x_auth_token", "xai_api_key",
    "azure_api_key", "cohere_api_key", "private_key", "bearer", "cookie", "signature",
    "passwd", "passphrase", "auth", "vendor_credentials", "request_authorization", "request_cookie",
    "signing_signature", "database_passwd", "database_passphrase",
    "api_key_id", "access_key_id", "secret_key_encoding", "custom_key",
    "secret_count", "credential_type",
}

local mixed_case_credentials = {
    "apiKey", "oauthClientSecret", "vendorAPIKey", "oauth2ClientSecret", "service2Token",
    "customBearer", "customCookie", "customSignature", "customCredentials", "customKey",
    "customAPIKeyLabel", "customAccessKeyId", "customSecretKeyEncoding",
    "tokenValue", "passwordHash", "secret-value", "authToken", "sessionCookie", "hmacSignature",
    "credentialType", "secret-count", "privateKeyEncoding", "vendorTokenValue",
    "authorizationCode", "credentialContextWith", "tokenResponse", "tokenVALUE",
    "valueToken", "tokenBudgetToken", "tokenBudgetSecret",
    "vendorPasswordHash", "bearerValue", "cookieValue", "signatureAlgorithm",
}

local ordinary_metadata = {
    max_tokens = 8192, output_tokens = 1024, token_budget = 4096,
    token_limit = 2048, tokens_per_minute = 60000, max_output_tokens = 2048, key_count = 3,
    authorization_mode = "header", context_window = 32768,
    token_count = 4, token_usage = 5, token_cost = 6, token_rate = 7, token_length = 8,
    token_window = 9, token_quota = 10, token_size = 11,
    tokenBudgetValue = 4096, vendorTokenLimit = 2048, tokenCount = 4,
    tokenUsage = 5, tokenCost = 6, tokenRate = 7, tokenLength = 8, tokenWindow = 9,
    tokenQuota = 10, tokenSize = 11, private = false, customPrivate = false,
    maxTokens = 8192, outputTokens = 1024, tokenBudget = 4096, tokenLimit = 2048,
    tokensPerMinute = 60000, maxOutputTokens = 2048, keyCount = 3,
}

local function payload()
    local fields = {}
    for key, value in pairs(ordinary_metadata) do fields[key] = value end
    for _, key in ipairs(mixed_case_credentials) do fields[key] = "credential-sentinel" end
    for _, key in ipairs(secret_keys) do
        fields[key] = "credential-sentinel"
        fields[key:upper()] = "credential-sentinel"
    end
    return fields
end

local function assert_scrubbed(fields)
    for _, key in ipairs(mixed_case_credentials) do test.is_nil(fields[key], key) end
    for _, key in ipairs(secret_keys) do
        test.is_nil(fields[key], key)
        test.is_nil(fields[key:upper()], key:upper())
    end
end

local function assert_metadata(fields)
    for key, value in pairs(ordinary_metadata) do test.eq(fields[key], value, key) end
end

local function assert_card(card)
    assert_scrubbed(card.options.nested)
    assert_scrubbed(card.metadata.nested)
    assert_metadata(card.options.nested)
    assert_metadata(card.metadata.nested)
end

local function define_tests()
    test.describe("credential word boundaries", function()
        test.it("scrubs declared credentials and credential words while retaining ordinary metadata", function()
            local result = policy.scrub_sensitive({ nested = payload(), items = { payload() } })
            assert_scrubbed(result.nested)
            assert_scrubbed(result.items[1])
            assert_metadata(result.nested)
            assert_metadata(result.items[1])
            local projected = card_policy.public_card({ providers = { { options = payload() } }, metadata = payload() })
            assert_scrubbed(projected.options)
            assert_scrubbed(projected.metadata)
            assert_metadata(projected.options)
            local clean, err = policy.clean_profile_input({ name = "Credential input",
                provider_id = "wippy.llm.openai_compat:provider", config = payload() })
            test.is_nil(err)
            assert_scrubbed(clean.config)
            assert_metadata(clean.config)
        end)

        test.it("keeps environment references in profile config and credentials out of public views", function()
            local config = payload()
            for _, key in ipairs(secret_keys) do
                config[key .. "_env"] = "CREDENTIAL_REFERENCE"
            end
            for _, key in ipairs(mixed_case_credentials) do
                config[key .. "_env"] = "CREDENTIAL_REFERENCE"
            end
            local scrubbed = policy.scrub_sensitive(config)
            local public = policy.public_profile({ id = "profile-policy", config = config, secret_config = payload() })
            assert_scrubbed(public.config)
            assert_metadata(public.config)
            for _, key in ipairs(secret_keys) do
                test.eq(public.config[key .. "_env"], "CREDENTIAL_REFERENCE")
                test.is_nil(scrubbed[key .. "_env"])
                test.is_nil(policy.scrub_sensitive({ [key:upper() .. "_ENV"] = "CREDENTIAL_REFERENCE" })[key:upper() .. "_ENV"])
            end
            for _, key in ipairs(mixed_case_credentials) do
                test.eq(public.config[key .. "_env"], "CREDENTIAL_REFERENCE")
                test.is_nil(scrubbed[key .. "_env"])
            end
        end)

        test.it("keeps credential words out of saved and public profile config", function()
            local profile, profile_err = repo.create_profile({ name = "Credential word profile",
                provider_id = "wippy.llm.openai_compat:provider", config = payload() })
            test.is_nil(profile_err)
            local ok, err = pcall(function()
                assert_scrubbed(profile.config)
                assert_metadata(profile.config)
                local db, db_err = sql.get("app:db")
                test.is_nil(db_err)
                local rows, read_err = db:query("SELECT config_json FROM kickside_model_provider_profiles WHERE id = $1", { profile.id })
                local _, inject_err = db:execute("UPDATE kickside_model_provider_profiles SET config_json = $1 WHERE id = $2",
                    { json.encode(payload()), profile.id })
                db:release()
                test.is_nil(read_err)
                test.is_nil(inject_err)
                local config = json.decode(rows[1].config_json)
                assert_scrubbed(config)
                assert_metadata(config)
                fake_http.prepare(nil)
                local _, admin_err = admin_handler.handler()
                test.is_nil(admin_err)
                local found = false
                for _, row in ipairs(fake_http.payload().profiles) do
                    if row.id == profile.id then
                        found = true
                        assert_scrubbed(row.config)
                        assert_metadata(row.config)
                    end
                end
                test.is_true(found)
            end)
            local _, delete_err = repo.delete_profile(profile.id)
            test.is_nil(delete_err)
            if not ok then error(err, 0) end
        end)

        test.it("persists token metadata and never stores credential fields in card options or metadata", function()
            local ok, err = pcall(function()
                local card, save_err = repo.upsert_card({ name = "metadata-policy-card",
                    provider_id = "wippy.llm.openai_compat:provider", provider_model = "metadata-model",
                    capabilities = { "generate" }, max_tokens = 8192, output_tokens = 1024,
                    metadata = { nested = payload() }, options = { nested = payload() } })
                test.is_nil(save_err)
                assert_metadata(card.metadata.nested)
                assert_metadata(card.options.nested)
                assert_scrubbed(card.metadata.nested)
                assert_scrubbed(card.options.nested)
                local raw_db, raw_err = sql.get("app:db")
                test.is_nil(raw_err)
                local raw_payload = json.encode({ nested = payload() })
                local _, inject_err = raw_db:execute("UPDATE kickside_model_cards SET options_json = $1, metadata_json = $1 WHERE name = $2", { raw_payload, card.name })
                raw_db:release()
                test.is_nil(inject_err)
                local _, reload_err = repo.reload()
                test.is_nil(reload_err)
                local cards, list_err = repo.list_cards_public()
                test.is_nil(list_err)
                local found = false
                for _, row in ipairs(cards) do
                    if row.name == card.name then
                        found = true
                        assert_metadata(row.metadata.nested)
                        assert_metadata(row.options.nested)
                        assert_scrubbed(row.metadata.nested)
                        assert_scrubbed(row.options.nested)
                    end
                end
                test.is_true(found)
                fake_http.prepare(nil)
                local _, admin_err = admin_handler.handler()
                test.is_nil(admin_err)
                test.eq(fake_http.status(), 200)
                local admin_card = nil
                for _, row in ipairs(fake_http.payload().models) do
                    if row.name == card.name then admin_card = row end
                end
                test.not_nil(admin_card)
                assert_card(admin_card)
                local resaved, resave_err = repo.upsert_card({ name = card.name, title = "Updated title" })
                test.is_nil(resave_err)
                assert_scrubbed(resaved.options.nested)
                assert_scrubbed(resaved.metadata.nested)
                assert_metadata(resaved.options.nested)
                local db, db_err = sql.get("app:db")
                test.is_nil(db_err)
                local rows, read_err = db:query("SELECT metadata_json, options_json FROM kickside_model_cards WHERE name = $1", { card.name })
                db:release()
                test.is_nil(read_err)
                test.is_nil((json.encode(rows):find("credential-sentinel", 1, true)))
                assert_metadata(json.decode(rows[1].options_json).nested)
                assert_metadata(json.decode(rows[1].metadata_json).nested)
            end)
            local _, delete_err = repo.delete_card("metadata-policy-card")
            test.is_nil(delete_err)
            if not ok then error(err, 0) end
        end)
    end)
end

return { run = test.run_cases(define_tests) }
