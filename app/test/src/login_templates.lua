local M = {calls = 0}
function M.get(_id): (any?, error?)
    M.calls = M.calls + 1
    if M.available then
        return {
            render = function(_, _, data)
                M.rendered = data
                return "<html></html>", nil
            end,
            release = function() end,
        }, nil
    end
    return nil, errors.new({kind = errors.NOT_FOUND, message = "login template unavailable"})
end
return M
