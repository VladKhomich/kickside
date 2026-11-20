local state = require("state")
local M = {}
function M.ensure_thread_component(args: table, _actor_id: string?, _maintenance: boolean?,
    _owner_principal: any?): (string, boolean, error?)
    return args.component_id, false, nil
end
function M.create(): (any?, error?)
    return nil, errors.new({ kind = errors.CONFLICT, message = "peer committed the thread" })
end
function M.remove_thread_component(): error?
    state.removed = state.removed + 1
    return nil
end

function M.convergence_kind(_component_id: string, requested: string): (string, error?) return requested, nil end
return M
