local test = require("test")
local provider_badges = require("provider_badges")

local function binding(provider, title, icon, id)
    return {
        id = id,
        kind = "contract.binding",
        meta = { provider = provider, title = title, icon = icon },
    }
end

local function oauth_provider(provider, title, icon)
    return {
        kind = "registry.entry",
        meta = { oauth_provider = provider, title = title, component = { icon = icon } },
    }
end

local function request(entries, options)
    options = options or {}
    local written, status
    local response = {
        set_content_type = function() end,
        set_status = function(_, value) status = value end,
        write_json = function(_, value) written = value end,
    }
    local instance = provider_badges.new(
        function(query)
            if query[".kind"] == "contract.binding" then
                test.eq(query["*meta.provider"], "")
                return entries, options.binding_error
            end
            test.eq(query[".kind"], "registry.entry")
            test.eq(query["*meta.oauth_provider"], "")
            return options.oauth_providers, options.oauth_error
        end,
        function() return response end,
        { error = function() end }
    )
    local result, err = instance.handler()
    test.is_nil(result)
    test.is_nil(err)
    return written, status
end

local function define_tests()
    test.describe("provider badges catalogue", function()
        test.it("drops malformed, oversized, and prototype-like provider ids without leaking metadata", function()
            local result = request({
                binding("discord", "Discord", "tabler:brand-discord"),
                binding("constructor", "Prototype", "tabler:alert"),
                binding("../../secret", "Should not render", "tabler:key"),
                binding(string.rep("x", 65), "Too long", "tabler:key"),
                binding("valid\nprovider", "Control", "tabler:key"),
            })
            test.is_true(result.success)
            local out = result.providers
            test.eq(#out, 2)
            test.eq(out[1].provider, "constructor")
            test.eq(out[2].provider, "discord")
        end)

        test.it("bounds unsafe presentation metadata and uses a fixed icon fallback", function()
            local result = request({ binding("discord", string.rep("t", 121), "javascript:alert(1)") })
            local out = result.providers
            test.eq(#out, 1)
            test.eq(out[1].title, "discord")
            test.eq(out[1].icon, "tabler:plug-connected")
        end)

        test.it("prefers a declared safe icon when duplicate provider bindings disagree", function()
            local result = request({
                binding("discord", "First", "not an icon"),
                binding("DISCORD", "Second", "tabler:brand-discord"),
            })
            local out = result.providers
            test.eq(#out, 1)
            test.eq(out[1].provider, "discord")
            test.eq(out[1].title, "Second")
            test.eq(out[1].icon, "tabler:brand-discord")
        end)

        test.it("uses the OAuth provider brand regardless of binding order", function()
            local drive = binding("google", "Google Drive folder", "tabler:brand-google-drive", "google:drive")
            local calendar = binding("google", "Google Calendar upcoming events", "tabler:brand-google", "google:calendar")
            local options = { oauth_providers = {
                oauth_provider("google", "Google", "tabler:brand-google"),
                oauth_provider("unbound", "OAuth without a binding", "tabler:plug"),
            } }
            for _, entries in ipairs({ { drive, calendar }, { calendar, drive } }) do
                local result = request(entries, options)
                test.eq(#result.providers, 1)
                local badge = result.providers[1]
                test.eq(badge.provider, "google")
                test.eq(badge.title, "Google")
                test.eq(badge.icon, "tabler:brand-google")
                test.is_nil(badge.entry_id)
            end
        end)

        test.it("uses registry IDs as a stable tie-breaker for equally valid binding icons", function()
            local first = binding("example", "First product", "tabler:brand-google", "example:first")
            local second = binding("example", "Second product", "tabler:brand-google-drive", "example:second")
            local options = { oauth_providers = { oauth_provider("example", "Unsafe descriptor", "javascript:alert(1)") } }
            for _, entries in ipairs({ { first, second }, { second, first } }) do
                local result = request(entries, options)
                test.eq(result.providers[1].title, "First product")
                test.eq(result.providers[1].icon, "tabler:brand-google")
            end
        end)

        test.it("uses a stable public error instead of a raw registry failure", function()
            local failures = { { binding_error = "private binding lookup failure" }, { oauth_error = "private OAuth lookup failure" } }
            for _, options in ipairs(failures) do
                local result, status = request(nil, options)
                test.eq(status, 500)
                test.is_false(result.success)
                test.eq(result.error, "provider catalogue unavailable")
            end
        end)
    end)
end

return { run = test.run_cases(define_tests) }
