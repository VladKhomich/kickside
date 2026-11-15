local test = require("test")
local jobs = require("jobs")
local fixture = require("fixture")
local phases = {"policy", "workers", "fresh", "pending", "running", "dead", "expired", "due", "overdue", "age", "stranded"}
local function required(err: error?): error
    if not err then error(errors.new({kind = errors.INTERNAL, retryable = false, message = "health guard requires an error"})) end
    return err
end
local function proof(phase: string, value: any, field: string)
    fixture.reset(phase, nil); fixture.missing, fixture.value = true, value
    local ok, result, err = pcall(jobs.health)
    test.is_true(ok); test.is_nil(result); local actual = required(err)
    test.is_true(errors.is(actual, errors.INTERNAL)); test.is_false(actual:retryable())
    test.eq(actual:details().code, "job_scope_response"); test.eq(actual:details().field, field)
    test.eq(fixture.releases, 1)
end
return {run = test.run_cases(function()
    test.describe("native Jobs health response boundaries", function()
        for _, phase in ipairs(phases) do
            for _, kind in ipairs({errors.INVALID, errors.UNAVAILABLE, errors.CONFLICT}) do
                for _, policy in ipairs({{}, {retryable = false}, {retryable = true}}) do
                    for _, detailed in ipairs({false, true}) do
                        test.it(phase .. "/" .. kind .. "/" .. tostring(policy.retryable) .. "/" .. tostring(detailed), function()
                            local source = errors.new({kind = kind, message = "health dependency refusal", retryable = policy.retryable,
                                details = detailed and {code = "health_dependency", nested = {marker = "kept"}} or nil})
                            fixture.reset(phase, source); local result, err = jobs.health(); test.is_nil(result)
                            local actual = required(err)
                            test.is_true(errors.is(actual, source:kind())); test.eq(actual:retryable(), source:retryable())
                            if detailed then test.eq(actual:details().code, "health_dependency"); test.eq(actual:details().nested.marker, "kept")
                            else test.is_nil(actual:details()) end
                            test.eq(fixture.releases, 1)
                        end)
                    end
                end
            end
            for index, response in ipairs({{}, {value = false}, {value = 0}, {value = ""}}) do
                test.it("missing response/" .. phase .. "/" .. tostring(index), function()
                    proof(phase, response.value, "health." .. phase)
                end)
            end
        end
        for _, phase in ipairs({"pending", "running", "dead", "expired", "due", "overdue"}) do
            for _, value in ipairs({-1, 0.5, "bad", math.huge}) do
                test.it("invalid count/" .. phase .. "/" .. tostring(value), function()
                    proof(phase, {{n = value}}, "health." .. phase .. ".count")
                end)
            end
            test.it("count read requires one aggregate row/" .. phase, function()
                proof(phase, {}, "health." .. phase .. ".count")
            end)
        end
        for _, value in ipairs({false, "bad", math.huge, -1}) do
            test.it("invalid due age/" .. tostring(value), function()
                proof("age", {{age_ms = value}}, "health.age.age_ms")
            end)
        end
        test.it("health retains bounded status metrics and nullable due age", function()
            fixture.reset("", nil); local result, err = jobs.health(); test.is_nil(err); test.not_nil(result)
            test.is_true(result.healthy); test.eq(result.healthy_worker_count, 1); test.is_true(result.workers[1].healthy)
            test.eq(result.pending_jobs,0);test.eq(result.running_jobs,0);test.eq(result.dead_jobs,0)
            test.eq(result.expired_leases,0)
            test.eq(result.due_unclaimed_count,0);test.eq(result.overdue_unclaimed_count,0);test.eq(result.due_unclaimed_oldest_age_ms,0)
            test.eq(fixture.releases,1)
        end)
        test.it("names stranded job ids in its issue", function()
            fixture.reset("stranded", nil); fixture.missing, fixture.value = true, {{id = "job-one"}, {id = "job-two"}}
            local result, err = jobs.health()
            test.is_nil(err)
            test.is_false(result.healthy)
            test.eq(#result.issues, 1)
            test.eq(result.issues[1].code, "stranded_jobs")
            test.is_nil(result.issues[1].count)
            test.eq(#result.issues[1].job_ids, 2)
            test.eq(result.issues[1].job_ids[1], "job-one")
            test.eq(result.issues[1].job_ids[2], "job-two")
        end)
        test.it("aggregate driver numeric strings retain their values", function()
            fixture.reset("expired", nil); fixture.missing, fixture.value = true, {{n = "2"}}
            local result, err = jobs.health(); test.is_nil(err); test.eq(result.expired_leases, 2)
        end)
    end)
end)}
