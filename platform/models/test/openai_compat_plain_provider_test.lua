-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local registry = require("registry")
local generate = require("generate")
local structured_output = require("structured_output")

local PLAIN = "kickside.models:openai_compat_plain.provider"
local DRIVER = "wippy.llm.openai_compat:driver"

local function reply(message: any): string
    return json.encode({
        choices = {{ message = message, finish_reason = "stop" }},
        usage = { prompt_tokens = 4, completion_tokens = 6, total_tokens = 10,
            completion_tokens_details = { reasoning_tokens = 3 } },
    })
end

-- The driver context a profile on the plain provider runs with: the provider
-- entry's driver options under the endpoint settings a profile supplies.
local function plain_context(): any
    local entry = assert(registry.get(PLAIN))
    local context: any = { base_url = "https://plain.example.test/v1", api_key = "fixture-key" }
    for key, value in pairs(entry.data.driver.options) do context[key] = value end
    return context
end

-- Calls a driver handler under a context, answering its one HTTP request with
-- body, and returns the wire body it sent with the handler's results.
local function call(handler: any, context: any, request: any, body: string): (any, any, any)
    local client = handler._client
    local saved = { handler._ctx, client._ctx, client._env, client._http_client }
    local sent: any = nil
    handler._ctx = { get = function(key: string) return context[key] end }
    client._ctx = { all = function() return context end }
    client._env = { get = function() return nil end }
    client._http_client = { post = function(_url: string, options: any): (any, any)
        sent = json.decode(tostring(options.body))
        return { status_code = 200, body = body, headers = {} }, nil
    end }
    local ok, result, err = pcall(handler.handler, request)
    handler._ctx, client._ctx, client._env, client._http_client = saved[1], saved[2], saved[3], saved[4]
    assert(ok, tostring(result))
    return sent, result, err
end

local function define_tests()
    test.describe("OpenAI-compatible plain chat provider", function()
        test.it("binds the upstream OpenAI-compatible driver with string text content", function()
            local entry = assert(registry.get(PLAIN))
            local driver = entry.data.driver
            test.eq(driver.id, DRIVER)
            test.eq(driver.options.text_content, "string")
            test.eq(driver.options.base_url_env, "wippy.llm.openai_compat:base_url")
            test.eq(driver.options.api_key_env, "wippy.llm.openai_compat:api_key")

            local binding = assert(registry.get(DRIVER))
            local contracts = {}
            for _, item in ipairs(binding.data.contracts) do contracts[item.contract] = true end
            for _, contract in ipairs({ "wippy.llm:generator", "wippy.llm:embedder",
                "wippy.llm:structured_output", "wippy.llm:provider" }) do
                test.is_true(contracts[contract] == true, contract)
            end
        end)

        test.it("sends text-only messages as strings and keeps image messages as parts", function()
            local sent, result, err = call(generate, plain_context(), {
                model = "gemma-4-26b",
                messages = {
                    { role = "system", content = "Be brief" },
                    { role = "user", content = {{ type = "text", text = "Hello" }, { type = "text", text = " world" }} },
                    { role = "assistant", content = {{ type = "text", text = "Hi" }} },
                    { role = "user", content = {
                        { type = "text", text = "Describe" },
                        { type = "image", source = { type = "base64", mime_type = "image/png", data = "AAA" } },
                    } },
                },
            }, reply({ content = "ok" }))

            test.is_nil(err)
            test.is_true(result.success)
            test.eq(sent.messages[1].content, "Be brief")
            test.eq(sent.messages[2].content, "Hello world")
            test.eq(sent.messages[3].content, "Hi")
            test.eq(type(sent.messages[4].content), "table")
            test.eq(sent.messages[4].content[1].text, "Describe")
            test.eq(sent.messages[4].content[2].image_url.url, "data:image/png;base64,AAA")
        end)

        test.it("sends a route's thinking effort and card request fields and returns the reasoning", function()
            local sent, result, err = call(generate, plain_context(), {
                model = "gemma-4-26b",
                messages = {{ role = "user", content = "Think" }},
                accepts = { thinking = "adaptive" },
                options = {
                    max_tokens = 512,
                    thinking_effort = 80,
                    request = { chat_template_kwargs = { enable_thinking = true }, top_k = 20 },
                },
            }, reply({ content = "answer", reasoning = "because" }))

            test.is_nil(err)
            test.eq(sent.reasoning_effort, "high")
            test.eq(sent.max_completion_tokens, 512)
            test.eq(sent.chat_template_kwargs.enable_thinking, true)
            test.eq(sent.top_k, 20)
            test.eq(result.result.content, "answer")
            test.eq(result.metadata.thinking, "because")
            test.eq(result.tokens.thinking_tokens, 3)
        end)

        test.it("sends no reasoning effort when the route declares no thinking", function()
            local sent, result, err = call(generate, plain_context(), {
                model = "gemma-4-26b",
                messages = {{ role = "user", content = "Answer" }},
                options = { max_tokens = 64, thinking_effort = 80 },
            }, reply({ content = "answer" }))

            test.is_nil(err)
            test.is_nil(sent.reasoning_effort)
            test.eq(sent.max_tokens, 64)
            test.is_nil(result.metadata.thinking)
        end)

        test.it("streams content and reasoning through the plain provider", function()
            local captured: any = {}
            local streamer: any = { chunks = {}, thinking = {} }
            function streamer:buffer_content(chunk: string): boolean table.insert(self.chunks, chunk) return true end
            function streamer:send_thinking(chunk: string): boolean table.insert(self.thinking, chunk) return true end
            function streamer:send_tool_call(_name: string, _arguments: string, _id: string): boolean return true end
            function streamer:send_error(_kind: string, _message: string, _code: any): boolean return true end
            function streamer:flush(): boolean self.flushed = true return true end

            local context = plain_context()
            local saved_client, saved_output, saved_ctx = generate._client, generate._output, generate._ctx
            generate._ctx = { get = function(key: string) return context[key] end }
            generate._output = { streamer = function(pid: string, topic: string, _size: number): any
                streamer.pid, streamer.topic = pid, topic
                return streamer
            end }
            generate._client = {
                request = function(path: string, payload: any, options: any): (any, any)
                    captured.path, captured.payload, captured.options = path, payload, options
                    return { metadata = {} }, nil
                end,
                process_stream = function(_stream: any, callbacks: any): (any, any, any)
                    callbacks.on_reasoning("weigh")
                    callbacks.on_content("hel")
                    callbacks.on_content("lo")
                    callbacks.on_done({ finish_reason = "stop", reasoning = "weigh",
                        usage = { prompt_tokens = 1, completion_tokens = 2, total_tokens = 3 } })
                    return nil, nil, nil
                end,
            }
            local ok, result, err = pcall(generate.handler, {
                model = "gemma-4-26b",
                messages = {{ role = "user", content = {{ type = "text", text = "hello" }} }},
                accepts = { thinking = "adaptive" },
                options = { thinking_effort = 10 },
                stream = { reply_to = "pid-1", topic = "chat" },
            })
            generate._client, generate._output, generate._ctx = saved_client, saved_output, saved_ctx
            assert(ok, tostring(result))

            test.is_nil(err)
            test.eq(result.result.content, "hello")
            test.eq(result.metadata.thinking, "weigh")
            test.eq(table.concat(streamer.chunks), "hello")
            test.eq(table.concat(streamer.thinking), "weigh")
            test.is_true(streamer.flushed)
            test.eq(captured.path, "/chat/completions")
            test.is_true(captured.options.stream)
            test.eq(captured.payload.messages[1].content, "hello")
            test.eq(captured.payload.reasoning_effort, "low")
        end)

        test.it("sends structured output messages as strings", function()
            local sent, result, err = call(structured_output, plain_context(), {
                model = "gemma-4-26b",
                messages = {
                    { role = "system", content = "Answer in JSON" },
                    { role = "user", content = {{ type = "text", text = "Name a colour" }} },
                },
                schema = {
                    type = "object",
                    properties = { colour = { type = "string" } },
                    required = { "colour" },
                    additionalProperties = false,
                },
            }, reply({ content = '{"colour":"white"}' }))

            test.is_nil(err)
            test.is_true(result.success)
            test.eq(sent.messages[1].content, "Answer in JSON")
            test.eq(sent.messages[2].content, "Name a colour")
            test.eq(sent.response_format.type, "json_schema")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
