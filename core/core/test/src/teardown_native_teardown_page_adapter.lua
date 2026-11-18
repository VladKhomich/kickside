local fixture = require("fixture")
return {run = fixture.run, finish_absent = function(_, _)
    local _, err = fixture.result("absent", true)
    return err
end}
