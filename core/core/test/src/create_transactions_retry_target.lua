local fixture = require("fixture")
local api = require("api")
return {run = function(args: table): (any, error?)
    fixture.reset("commit", errors.new({kind = args.kind, retryable = args.retryable, message = "opaque",
        details = {code = "create_transaction_dependency", nested = {marker = "kept"}}}), nil)
    fixture.effect_id = args.thread_id
    return api.create_audit(fixture.database(), {component_id = args.thread_id}, nil, {system = true}, nil)
end}
