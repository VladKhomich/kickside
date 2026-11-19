local agents_by_name = require("agents_by_name")

local function run(args)
    args = args or {}
    if type(args.detail) == "string" then
        return agents_by_name.describe_agent(args.detail)
    end
    local identifiers = {}
    for _, identifier in ipairs(args.identifiers or {}) do
        if type(identifier) == "string" then
            identifiers[#identifiers + 1] = identifier
        end
    end
    return agents_by_name.resolve_identifiers(identifiers)
end

return { run = run }
