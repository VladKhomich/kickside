local fixture = require("fixture")
return {register_thread_component = fixture.register, ensure_thread_component = fixture.ensure,
    remove_thread_component = fixture.remove, attach = fixture.attach, complete = fixture.complete,
    convergence_kind = function(_component_id: string, requested: string): (string, error?) return requested, nil end}
