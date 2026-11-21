local llm = require("llm")
local env = require("env")
local registry = require("registry")

local M = {}

local SAFETY_MARGIN_RATIO = 0.10

local function positive_number(value: any): number?
    local n = tonumber(value)
    if not n or n <= 0 then return nil end
    return n
end

local function session_cap(): (number?, any?)
    local id = "wippy.session.env:token_checkpoint_threshold"
    local entry, lookup_err = registry.get(id)
    if lookup_err and not errors.is(lookup_err, errors.NOT_FOUND) then return nil, lookup_err end
    if not entry then return nil end
    local value, read_err = env.get(id)
    if read_err then return nil, read_err end
    return positive_number(value)
end

local function copy_map(value: any): { [string]: any }
    local copied = {}
    if type(value) ~= "table" then return copied end
    for key, item in pairs(value) do copied[key] = item end
    return copied
end

local function model_limits(context_window: number?, output_reservation: number?): number?
    if not context_window or not output_reservation then return nil end
    -- Usage context tokens exclude the completed output. Reserve that output and
    -- the next request's output before splitting the remaining safety margin.
    local available = context_window - 2 * output_reservation
    if available <= 0 then return nil end
    local margin = math.ceil(available * SAFETY_MARGIN_RATIO)
    return available - margin
end

-- Fit a caller-provided response default to the selected model's output limit.
-- Derive the checkpoint threshold when the model declares a context window.
function M.apply(spec: any, default_max_tokens: number?): (any, any?)
    if type(spec) ~= "table" then return spec end

    local options = copy_map(spec.agent_options)
    local checkpoint = copy_map(options.checkpoint)
    local card, resolve_err = nil, nil
    if type(spec.model) == "string" and spec.model ~= "" then
        card, resolve_err = llm.resolve_model(spec.model)
    end
    if resolve_err then return nil, resolve_err end
    local context_window = type(card) == "table" and positive_number(card.max_tokens) or nil
    local output_limit = type(card) == "table" and positive_number(card.output_tokens) or nil
    if spec.max_tokens == nil and default_max_tokens then
        spec.max_tokens = output_limit and math.min(default_max_tokens, output_limit) or default_max_tokens
    end
    local reservation = positive_number(spec.max_tokens) or output_limit
    -- The provider request applies the selected card's limit while retaining
    -- the agent's requested cap. Use the same effective output for checkpointing.
    if reservation and output_limit then reservation = math.min(reservation, output_limit) end
    local derived_threshold = model_limits(context_window, reservation)
    local configured_threshold = positive_number(checkpoint.token_threshold)
    if not configured_threshold then
        local existing_cap, cap_err = session_cap()
        if cap_err then return nil, cap_err end
        configured_threshold = existing_cap
    end

    if derived_threshold then
        checkpoint.token_threshold = configured_threshold and math.min(configured_threshold, derived_threshold) or derived_threshold
    end

    options.checkpoint = checkpoint
    spec.agent_options = options
    return spec, nil
end

return M
