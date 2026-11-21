local M = {}

function M.call(id)
    assert(id == "wippy.facade:host_url")
    return M.host_url
end

return M
