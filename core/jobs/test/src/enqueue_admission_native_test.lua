-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local enqueue = require("enqueue")
local fixture = require("fixture")

return {run = test.run_cases(function()
    test.describe("enqueue admission metadata reuse", function()
        -- JOB-ENQUEUE-METADATA-READS
        for _, worker in ipairs({"guard", "func://app:guard", "proc://app:guard"}) do
            for _, shape in ipairs({"absent", "flat", "nested", "handler"}) do
                test.it(worker .. "/" .. shape, function()
                    fixture.reset("new", "", nil)
                    local target = worker == "guard" and "guard" or "app:guard"
                    local meta = shape == "handler" and {job_dead = "app:outcome"} or {}
                    if shape ~= "absent" then
                        fixture.entries[target] = shape == "nested" and {data = {meta = meta}} or {meta = meta}
                    end
                    fixture.entries["app:outcome"] = {kind = "function.lua", meta = {}}
                    local id, err = enqueue.enqueue_job(fixture.executor(), "sqlite", {
                        owner_locator = {kind = "test", id = "owner"}, job_type = "guard", worker_ref = worker,
                        job_identity = {namespace = "guard", scope = "scope", key = "key"}, payload = {},
                    })
                    test.is_nil(err, tostring(err))
                    test.not_nil(id)
                    test.eq(fixture.registry_reads[1], target)
                    local source_reads = 0
                    for _, read in ipairs(fixture.registry_reads) do
                        if read == target then source_reads = source_reads + 1 end
                        test.is_true(read == target or (shape == "handler" and read == "app:outcome"))
                    end
                    test.eq(source_reads, 1, "capacity and dead-outcome admission share the worker metadata")
                    if shape ~= "handler" then test.eq(#fixture.registry_reads, 1)
                    else test.is_true(#fixture.registry_reads > 1, "a declared target is validated") end
                end)
            end
        end
    end)
end)}
