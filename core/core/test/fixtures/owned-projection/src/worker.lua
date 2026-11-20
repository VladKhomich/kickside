local funcs = require("funcs")
local security = require("security")

local function fold(input: table): (table?, error?)
    local actor = assert(security.actor())
    local effect, err = funcs.call("core.owned.fixture:effect")
    if err then return nil, err end
    local permitted, permission_err = security.can("funcs.call", "app:test_count_worker")
    if permission_err then return nil, permission_err end
    local output: table = {
        patch = {count = #input.events, effect = effect, actor = actor:id(), ambient_permission = permitted},
    }
    local config = input.projection.body.worker_config
    if type(config) == "table" and config.return_events == true then
        output.append_events = {{thread_id = "aaaaaaaa-0000-4000-8000-000000000001",
            event = {type = "kickside.threads:message.created", body = {}}}}
    end
    return output, nil
end

return {fold = fold, effect = function() return "fixture effect ran" end}
