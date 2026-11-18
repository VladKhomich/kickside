-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function run(input)
    local time = require("time")
    local before = math.floor(time.now():unix_nano() / 1000000)
    local response, err = require("llm").generate("hello", {
        model = input.model, max_tokens = 64, deadline_ms = 1000, timeout = 0.25})
    assert(err == nil, tostring(err))
    local after = math.floor(time.now():unix_nano() / 1000000)
    local deadline = response.metadata.deadline_at
    assert(type(deadline) == "number" and deadline >= before + 1000 and deadline <= after + 1000,
        "Saved route discards the LLM request deadline: " .. tostring(deadline))
    assert(response.metadata.timeout == 0.25, "Saved route discards the request timeout")
    return true
end

return {run = run}
