-- A configuration write announces nav.changed through the UI's own broadcast
-- authority: an administrator scope without realtime or process messaging
-- authority still reaches every connected client.

local test = require("test")
local security = require("security")
local principal_fixture = require("principal_fixture")
local http_client = require("http_client")
local json = require("json")
local sql = require("sql")
local registry = require("registry")

local function base_url(): string
    local entry = registry.get("app:gateway") :: any
    local port = tostring(entry.data.addr):match(":(%d+)$")
    assert(port, "gateway port unavailable")
    return "http://127.0.0.1:" .. port
end

local function constrained_admin_token(): string
    return principal_fixture.token("app:ui_test_admin_without_broadcast")
end

local function define_tests()
    test.describe("nav configuration broadcast", function()
        test.it("broadcasts nav.changed from an administrator without realtime or process messaging authority", function()
            local db = assert(sql.get("app:db"))
            assert(db:execute("CREATE TABLE IF NOT EXISTS ui_nav_broadcasts (topic TEXT NOT NULL, authorized TEXT NOT NULL)"))
            assert(db:execute("DELETE FROM ui_nav_broadcasts"))
            db:release()
            local token = constrained_admin_token()
            local store = assert(security.token_store("kickside.users.security:tokens"))
            local actor, scope, validate_err = store:validate(token)
            store:close()
            test.is_nil(validate_err)
            test.not_nil(actor)
            test.not_nil(scope)
            test.neq(scope:evaluate(actor, "realtime.broadcast", "kickside.realtime:nav.changed"), "allow")
            test.neq(scope:evaluate(actor, "process.send", "app:processes"), "allow")
            local endpoint = base_url() .. "/api/auth/nav/config"
            local headers = { Authorization = "Bearer " .. token, ["Content-Type"] = "application/json" }
            local appearance = {
                navigation = { visible = true, placement = "last" },
                sessions = { intro = "default", markdown = "", show_message = true, show_agent_picker = true },
                sidebar = { intro = "markdown", markdown = "[Help](/help)", show_message = false, show_agent_picker = false },
            }
            local denied = assert(http_client.put(endpoint, {
                timeout = 10,
                headers = headers,
                body = json.encode({ chat_appearance = appearance }),
            }))
            test.eq(denied.status_code, 400, tostring(denied.body))
            test.is_true(string.find(denied.body, "default agent", 1, true) ~= nil)
            local sidebar: any = appearance.sidebar
            sidebar.default_agent = "fixtures:researcher"
            sidebar.allowed_agents = { "fixtures:researcher" }
            sidebar.markdown_alignment = "justify"
            local invalid_alignment = assert(http_client.put(endpoint, {
                timeout = 10,
                headers = headers,
                body = json.encode({ chat_appearance = appearance }),
            }))
            test.eq(invalid_alignment.status_code, 400, tostring(invalid_alignment.body))
            test.is_true(string.find(invalid_alignment.body, "Markdown alignment", 1, true) ~= nil)
            sidebar.markdown_alignment = "right"
            local response, err = http_client.put(base_url() .. "/api/auth/nav/config", {
                timeout = 10,
                headers = headers,
                body = json.encode({ chat_appearance = appearance }),
            })
            test.is_nil(err)
            test.eq(response.status_code, 200, tostring(response.body))
            db = assert(sql.get("app:db"))
            local seen = assert(db:query("SELECT topic, authorized FROM ui_nav_broadcasts"))
            db:release()
            test.eq(#seen, 1)
            test.eq(seen[1].topic, "nav.changed")
            test.eq(seen[1].authorized, "yes", "the nav.changed broadcast was refused")

            local list = assert(http_client.get(base_url() .. "/api/auth/nav/list?manage=1", {
                timeout = 10,
                headers = headers,
            }))
            test.eq(list.status_code, 200, tostring(list.body))
            local body: any = assert(json.decode(list.body))
            test.eq(body.new_chat.placement, "last")
            test.eq(body.config.chat_appearance.sessions.show_message, true)
            test.eq(body.config.chat_appearance.sidebar.show_message, false)
            test.eq(body.config.chat_appearance.sidebar.default_agent, "fixtures:researcher")
            test.eq(body.config.chat_appearance.sidebar.markdown_alignment, "right")
        end)
    end)
end

return { run = test.run_cases(define_tests) }
