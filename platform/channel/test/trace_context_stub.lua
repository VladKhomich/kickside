local trim = require("text_trim").trim
local trace = require("trace")
local M = { pack_correlation = trace.pack_correlation, normalize = trace.normalize, common = trace.common }

local counter = 0

function M.reset()
    counter = 0
end

function M.begin(_kind, correlation_key)
    counter = counter + 1
    local id = "trace-" .. tostring(counter)
    local out = { trace_id = id, run_id = id }
    if trim(correlation_key) ~= "" then out.correlation_key = trim(correlation_key) end
    return out
end

return M
