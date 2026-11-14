local security = require("security")
return {run = function(input)
    input.projection.body.ran_as = assert(security.actor()):id()
    return {body = input.projection.body, last_seq = input.range.to_seq}
end}
