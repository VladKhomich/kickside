-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local subject = require("subject")

return { run = test.run_cases(function()
    test.describe("Workflow resume handoff", function()
        test.it("preserves the declared arm through the recorded run identity", function()
            local args = {
                dataflow_id = "flow", signal_id = "signal", arm_id = "app:review_arm",
                payload = { value = "decision" },
            }
            local result, err = subject.resume(args)
            test.is_nil(err, tostring(err))
            test.eq(result.owner, "owner")
            test.eq(result.target, "kickside.blocks:resume_under_identity")
            test.eq(result.args.dataflow_id, args.dataflow_id)
            test.eq(result.args.signal_id, args.signal_id)
            test.eq(result.args.arm_id, args.arm_id)
            test.eq(result.args.payload.value, "decision")
        end)
    end)
end) }
