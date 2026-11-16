-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local blocks = require("blocks")
local lower = require("lower")
local client = require("client")
local consts = require("consts")
local uuid = require("uuid")
local json = require("json")

type Map = { [string]: any }

-- Use the public lowering API and native scheduler/FUNC, including an actual
-- default-discriminator edge, rather than emulating argument composition.
local function run_flow(plan: Map, input: Map): Map
    local cli = assert(client.new())
    local source_id, target_id = uuid.v4(), uuid.v4()
    local config = plan.config :: Map
    config.data_targets = {{ data_type = consts.DATA_TYPE.WORKFLOW_OUTPUT, key = "result" }}
    local commands = {{ type = consts.COMMAND_TYPES.CREATE_NODE, payload = {
        node_id = target_id, node_type = plan.node_type, status = consts.STATUS.PENDING, config = config,
    } }}
    commands[#commands + 1] = { type = consts.COMMAND_TYPES.CREATE_NODE, payload = {
        node_id = source_id, node_type = "userspace.dataflow.node.func:node", status = consts.STATUS.PENDING,
        config = { func_id = "app:public_tool_table", data_targets = {{
            data_type = consts.DATA_TYPE.NODE_INPUT, node_id = target_id, discriminator = "default",
        }} },
    } }
    commands[#commands + 1] = { type = consts.COMMAND_TYPES.CREATE_DATA, payload = {
        data_id = uuid.v4(), node_id = source_id, data_type = consts.DATA_TYPE.NODE_INPUT,
        discriminator = "default", content = input, content_type = consts.CONTENT_TYPE.JSON,
    } }
    local id, create_err = cli:create_workflow(commands)
    test.is_nil(create_err)
    local _, execute_err = cli:execute(id)
    test.is_nil(execute_err)
    local output, output_err = cli:output(id)
    test.is_nil(output_err)
    test.not_nil(output.result)
    return output.result
end

local function tool(config: Map): Map
    local plan, err = blocks.plan({ block_id = "app.blocks_suites:argument_tool", config = config })
    test.is_nil(err)
    return plan :: Map
end

local function define_tests()
    test.describe("Block argument composition in a real Flow", function()
        test.it("delivers connected tool arguments alongside fixed config with config winning overlaps", function()
            local result = run_flow(tool({ board_id = "fixed-board" }), {
                board_id = "connected-board", item = { id = "connected-item" }, include_closed = false,
            })
            test.not_nil(result.item)
            test.eq(result.item.id, "connected-item")
            test.eq(result.board_id, "fixed-board")
            test.eq(result.include_closed, false)
            test.is_nil(result.config)
        end)

        test.it("preserves fixed JSON values and replaces overlapping input fields", function()
            local account = 'fixed "account"\\path\n雪'
            local result = run_flow(tool({ account_id = account, include_closed = false, options = {
                empty = json.decode("{}"), tags = { "fixed" },
            } }), { include_closed = true, options = { from_input = true } })
            test.eq(result.account_id, account)
            test.eq(result.include_closed, false)
            test.eq(json.encode(result.options.empty), "{}")
            test.eq(result.options.tags[1], "fixed")
            test.is_nil(result.options.from_input)
        end)

        test.it("preserves connected tool input without fixed config", function()
            local result = run_flow(tool({}), { account_id = "connected-account", include_closed = false })
            test.eq(result.account_id, "connected-account")
            test.eq(result.include_closed, false)
        end)

        test.it("delivers fixed tool arguments with an empty connected object", function()
            local result = run_flow(tool({ account_id = "fixed-account", include_closed = false }), json.decode("{}"))
            test.eq(result.account_id, "fixed-account")
            test.eq(result.include_closed, false)
        end)

        test.it("keeps function input and fixed config separate even when input contains config", function()
            local plan, err = lower.plan_descriptor({ id = "example:function", execution = {
                kind = "function", function_id = "app:public_tool_table",
            } }, { config = { account_id = "fixed-account" } })
            test.is_nil(err)
            local result = run_flow(plan :: Map, {
                account_id = "connected-account", config = { account_id = "untrusted-account" },
            })
            test.eq(result.input.account_id, "connected-account")
            test.eq(result.input.config.account_id, "untrusted-account")
            test.eq(result.config.account_id, "fixed-account")
        end)
    end)
end

return { run = function(options) return test.run_cases(define_tests)(options) end }
