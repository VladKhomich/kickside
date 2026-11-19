-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local process = require("process")
local sql = require("sql")
local worker_pool = require("worker_pool")
local fixture = require("job_fixture")
local claim = require("claim")
local claim_execution = require("claim_execution")
local lifecycle = require("lifecycle")

local function run_slot(): string?
    local events = process.events()
    while true do
        local event, open = events:receive()
        if not open then return nil end
        if event.kind == process.event.CANCEL then return "cancelled" end
    end
end

local function run_pool(observer: string, topic: string, blocked_step: string): (any?, error?)
    local slot, spawn_err = process.spawn_linked_monitored("app:pool_shutdown_slot", "app:processes")
    if spawn_err or not slot then error("shutdown probe slot failed: " .. tostring(spawn_err)) end
    local gate = channel.new(0)
    local function announce(step: any): ()
        local sent, err = process.send(observer, topic, step)
        if err or not sent then error("shutdown probe report failed: " .. tostring(err)) end
    end
    local policy = fixture.pool_policy({ worker_count_sqlite = 1, worker_count_postgres = 1, worker_awaited_slots = 0 })
    local job: table = { id = "shutdown-job" }
    local run_id = "shutdown-run"
    local dialect = sql.type.SQLITE
    if blocked_step == "database" then
        local db = assert(sql.get("app:db"))
        dialect = assert(db:type())
        local job_type = "test." .. topic
        local id = assert(lifecycle.enqueue_job(db, dialect, {
            owner_locator = { kind = "test", id = topic }, job_type = job_type, payload = {}, max_attempts = 2,
            job_identity = { namespace = "jobs-shutdown-test", scope = topic, key = "probe" },
        }))
        assert(db:execute("INSERT INTO kickside_job_worker(id,registry_version) VALUES($1,$2)",
            { tostring(slot), "shutdown test" }))
        local claimed = assert(claim.claim_batch(db, dialect, 1, nil, nil, tostring(slot), { job_type }))
        job = claimed[1]
        assert(job.id == id)
        run_id = job.run_ctx.id
        job.run_ctx = nil
        db:release()
    end
    local release_gate = blocked_step == "database" and process.listen(topic .. ".release") or nil
    local rollback_gate = blocked_step == "rollback" and process.listen(topic .. ".resume") or nil
    local pool_events = nil
    if blocked_step == "release" or blocked_step == "database" then
        local registry_ch = channel.new(0)
        local drain_gate = process.listen(topic .. ".drain")
        coroutine.spawn(function()
            drain_gate:receive()
            registry_ch:close()
        end)
        pool_events = {
            subscribe = function()
                return {
                    channel = function() return registry_ch end,
                    close = function() end,
                }, nil
            end,
        }
    end
    return worker_pool.new({
        events = pool_events,
        policy = function() return policy, nil end,
        schema_ready = function() return true, nil end,
        sql_get = function()
            return {
                type = function() return dialect end,
                query = function() return {}, nil end,
                release = function() end,
            }, nil
        end,
        reclaim = {
            reclaim_expired = function() return 0, nil end,
            reclaim_terminated = function() return 0, nil, 0 end,
            close_lost_runs = function() return 0, nil end,
        },
        retention_schedule = {
            new = function()
                return {
                    deadline = function() return nil end,
                    run = function()
                        if rollback_gate then
                            announce(tostring(slot))
                            rollback_gate:receive()
                        elseif blocked_step == "database" then
                            announce({ id = job.id, worker = tostring(slot) })
                        else
                            announce("retention")
                        end
                        if blocked_step == "retention" then gate:receive() end
                    end,
                }
            end,
        },
        claim_execution = {
            release_unstarted = function(_, claimed, worker, run)
                announce("release")
                if release_gate then
                    release_gate:receive()
                    local db = assert(sql.get("app:db"))
                    local released, err = claim_execution.release_unstarted(db, claimed, worker, run)
                    db:release()
                    return released, err
                end
                gate:receive()
                return false, nil
            end,
        },
    }).main({
        size = 1, policy = policy, database = dialect,
        slots = {{
            slot = 1, pid = tostring(slot), epoch = 1,
            assignment = not rollback_gate and { job = job, run_id = run_id } or nil,
        }},
    })
end

-- The preceding revision receives slot exits through process.events and
-- understands only slots and due entries in the handover.
local function run_rollback(handover: table): ()
    local events = process.events()
    local reply = process.listen("jobs.shutdown.rollback.reply"):receive()
    if #handover.slots == 0 then
        assert(handover.due[1].slot == 1)
    elseif handover.slots[1].pid == reply.slot then
        local slot = handover.slots[1].pid
        while true do
            local event = events:receive()
            if event.kind == process.event.EXIT and tostring(event.from) == slot then break end
        end
    end
    assert(process.send(reply.observer, reply.topic, "slot available for replacement"))
end

return { run_pool = run_pool, run_slot = run_slot, run_rollback = run_rollback }
