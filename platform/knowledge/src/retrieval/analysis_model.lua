-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")

local M = { DEFAULT = "class:fast" }

function M.configured(config: table?): string?
    local model = config and config.analysis_model
    if type(model) == "string" and model:find("%S") then return model end
    return nil
end

function M.class_available(model: string): (boolean?, any?)
    local definition, err = contract.get("wippy.llm:model_resolver")
    if err then return nil, err end
    local resolver, open_err = definition:open()
    if open_err then return nil, open_err end
    local card, resolve_err = resolver:resolve({ model = model })
    if resolve_err then
        if errors.is(resolve_err, errors.NOT_FOUND) then return false, nil end
        return nil, resolve_err
    end
    return card ~= nil, nil
end

return M
