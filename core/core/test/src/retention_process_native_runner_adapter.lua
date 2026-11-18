local fixture = require("fixture")
return {recover = fixture.recover, on_wake = fixture.wake, on_wakes = fixture.wakes_batch, on_deadline = fixture.deadline}
