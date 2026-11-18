local fixture = require("fixture")
return {recover = fixture.recover, on_wake = fixture.wake, on_wakes = fixture.wake,
    on_deadline = fixture.deadline}
