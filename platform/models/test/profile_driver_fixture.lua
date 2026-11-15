-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local M = {reads = 0, calls = 0}

function M.get(id)
    M.reads = M.reads + 1
    return sql.get(id)
end

function M.open(id, context)
    assert(id == "wippy.llm.openai_compat:provider")
    assert(context.api_key == "fixture-cache-secret")
    assert(context.base_url == "https://provider.example.test/v1")
    assert(context.deadline_at == 12345)
    local function invoke(_, input)
        assert(input.model == "wire-model")
        M.calls = M.calls + 1
        return {success = true}
    end
    return {status = invoke, generate = invoke, embed = invoke, structured_output = invoke, evaluate = invoke}
end

return M
