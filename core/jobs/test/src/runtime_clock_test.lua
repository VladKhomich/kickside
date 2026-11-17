-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local clock = require("clock")
local frozen = require("frozen")
local fixture = require("fixture")
local pool = require("worker_pool").new({time = frozen})
local listing = require("listing")
local eligibility = require("eligibility")
local jobs = require("jobs")
local config = require("config")

local function queue(fn: (sql.DB, string) -> ())
    local db, dialect, err = fixture.private_queue("app:private_queue_runtime_clock")
    if err or not db or not dialect then error(err) end
    local ok, failure = pcall(fn, db, dialect)
    db:release()
    if not ok then error(failure) end
end
local function seed(db: sql.DB, dialect: string, offset_ms: integer, status: string?): string
    local id = uuid.v7()
    local at = clock.format(frozen.now():add(offset_ms * time.MILLISECOND), dialect)
    assert(db:execute([[INSERT INTO kickside_job
        (id,owner_kind,owner_id,job_type,status,scheduled_at,lease_until,job_identity)
        VALUES ($1,'thread','clock-owner','test.clock',$2,$3,$4,$5)]], {id,status or "pending",at,at,id}))
    return id
end
return {run = test.run_cases(function()
    test.describe("runtime clock owns Jobs comparisons", function()
        for _, status in ipairs({"pending", "running"}) do
            test.it("derives the exact " .. status .. " deadline from runtime time", function()
                queue(function(db, dialect)
                    seed(db, dialect, 1000, status)
                    local delay, kind, err = pool.next_deadline(db, dialect, clock.format(frozen.now():add(-time.SECOND),dialect))
                    test.is_nil(err)
                    test.eq(kind, status == "pending" and "due" or "lease")
                    test.eq(delay, 1000)
                end)
            end)
        end
        test.it("immediately dispatches work that became due after the claim snapshot", function()
            queue(function(db, dialect)
                seed(db,dialect,-1000)
                local delay, kind, err = pool.next_deadline(db,dialect,clock.format(frozen.now():add(-2*time.SECOND),dialect))
                test.is_nil(err); test.eq(kind,"due"); test.eq(delay,1)
            end)
        end)
        for _, method in ipairs({"get_job", "get_jobs", "list_jobs", "list_owner_jobs"}) do
            test.it("uses exact runtime eligibility in " .. method, function()
                queue(function(db,dialect)
                    local due = seed(db,dialect,0)
                    local future = seed(db,dialect,1)
                    local rows
                    if method == "get_job" then rows = {assert(listing.get_job(db,due)),assert(listing.get_job(db,future))}
                    elseif method == "get_jobs" then
                        local mapped = assert(listing.get_jobs(db,{due,future})); rows = {mapped[due],mapped[future]}
                    elseif method == "list_jobs" then rows = assert(listing.list_jobs(db,{"clock-owner"},nil,10,nil))
                    else rows = assert(listing.list_owner_jobs(db,{kind="thread",id="clock-owner"},nil,10,nil)) end
                    local found = {}
                    for _,row in ipairs(rows) do found[row.id] = row.due end
                    test.eq(found[due],true); test.eq(found[future],false)
                    local tx = assert(db:begin())
                    test.is_true(assert(listing.get_job(tx,due)).due)
                    tx:rollback()
                end)
            end)
        end
        test.it("uses runtime time when backlog has no explicit snapshot", function()
            queue(function(db,dialect)
                seed(db,dialect,-2000); seed(db,dialect,1)
                local backlog = assert(eligibility.due_backlog(db,dialect,1))
                test.eq(backlog.count,1); test.eq(backlog.overdue,1); test.eq(backlog.oldest_age_ms,2000)
            end)
        end)
        test.it("expires worker pulses at the exact runtime freshness boundary", function()
            queue(function(db,dialect)
                local timeout = assert(config.policy()).lease_timeout_seconds * time.SECOND
                assert(db:execute("INSERT INTO kickside_job_worker(id,registry_version) VALUES ('clock-worker','test')"))
                assert(db:execute("INSERT INTO kickside_job_worker_pulse(worker_id,registry_version,last_seen_at) VALUES ('clock-worker','test',$1)",
                    {clock.format(frozen.now():add(-timeout),dialect)}))
                local health = assert(jobs.health())
                test.eq(health.healthy_worker_count,0); test.eq(health.workers[1].healthy,false)
                assert(db:execute("UPDATE kickside_job_worker_pulse SET last_seen_at=$1",
                    {clock.format(frozen.now():add(-timeout+time.MICROSECOND),dialect)}))
                health = assert(jobs.health())
                test.eq(health.healthy_worker_count,1); test.eq(health.workers[1].healthy,true)
            end)
        end)
    end)
end)}
