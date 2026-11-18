-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local channel = require("channel")
local process = require("process")
local sql = require("sql")
local registry = require("registry")
local time = require("time")
local uuid = require("uuid")
local cfg = require("config")

local function wait_step(notices: any, step: string): ()
    local selected = channel.select({ notices:case_receive(), time.after("5s"):case_receive() })
    test.eq(selected.value, step, "the pool reached the gated step")
end

local function wait_exit(events: any, pid: string, deadline: any): any
    while true do
        local selected = channel.select({ events:case_receive(), deadline:case_receive() })
        if selected.channel == deadline then return nil end
        local event = selected.value
        if type(event) == "table" and event.kind == process.event.EXIT and tostring(event.from) == pid then
            return event
        end
    end
end

return { run = test.run_cases(function()
    test.describe("live Jobs pool shutdown deadline", function()
        local pool_pid: string? = nil
        local lock: sql.Transaction? = nil
        local database: sql.DB? = nil
        local original_version: registry.Version? = nil
        local successor_registered = false
        local events = process.events()
        test.after_each(function()
            if lock then lock:rollback(); lock = nil end
            if database then database:release(); database = nil end
            if successor_registered then
                process.registry.unregister(cfg.POOL_NAME, process.registry.CONSISTENT)
                successor_registered = false
            end
            if original_version then
                assert(registry.apply_version(original_version))
                original_version = nil
            end
            if not pool_pid then return end
            local pid = pool_pid :: string
            pool_pid = nil
            local _, err = process.terminate(pid)
            if err and not errors.is(err, errors.NOT_FOUND) then error(err) end
            test.not_nil(wait_exit(events, pid, time.after("5s")), "terminate the test-owned pool after a failed assertion")
        end)

        for _, step in ipairs({ "retention", "release" }) do
            test.it("bounds shutdown while " .. step .. " is waiting", function()
                local topic = "jobs.shutdown." .. uuid.v7()
                local notices = process.listen(topic)
                local child, spawn_err = process.spawn_monitored("app:pool_shutdown_probe", "app:processes",
                    tostring(process.pid()), topic, step)
                test.is_nil(spawn_err)
                test.not_nil(child)
                local pid = tostring(child)
                pool_pid = pid
                wait_step(notices, "retention")
                local requested = time.now()
                local deadline = time.after("5500ms")
                local cancelled, cancel_err = process.cancel(pid, "shutdown deadline test")
                test.is_nil(cancel_err)
                test.is_true(cancelled)
                if step == "release" then wait_step(notices, "release") end
                process.unlisten(notices)
                local exit = wait_exit(events, pid, deadline)
                test.not_nil(exit, "live jobs worker did not stop while " .. step .. " was blocked")
                pool_pid = nil
                test.is_true(tostring(exit.result.error):find("job worker pool drain timed out", 1, true) ~= nil)
                test.is_true(time.now():sub(requested):milliseconds() >= 4900)
            end)
        end

        test.it("cancels an adopted slot explicitly while the pool owner is blocked", function()
            local topic = "jobs.shutdown." .. uuid.v7()
            local notices = process.listen(topic)
            local child = assert(process.spawn_monitored("app:pool_shutdown_probe", "app:processes",
                tostring(process.pid()), topic, "hard"))
            pool_pid = tostring(child)
            local selected = channel.select({notices:case_receive(), time.after("5s"):case_receive()})
            local slot = selected.value
            test.is_true(type(slot) == "string")
            assert(process.monitor(slot))
            assert(process.cancel(pool_pid, "explicit hard stop"))
            local exit = wait_exit(events, slot, time.after("4s"))
            test.not_nil(exit, "old slots ignore dispatcher loss while busy and need explicit CANCEL")
            test.eq(exit.result.value, "cancelled")
            process.unlisten(notices)
            test.not_nil(wait_exit(events, pool_pid, time.after("5500ms")))
            pool_pid = nil
        end)

        test.it("refunds a confirmed unstarted claim after the pool exits with its release blocked", function()
            local topic = "jobs.shutdown." .. uuid.v7()
            local notices = process.listen(topic)
            local child = assert(process.spawn_monitored("app:pool_shutdown_probe", "app:processes",
                tostring(process.pid()), topic, "database"))
            local pid = tostring(child)
            pool_pid = pid
            local ready = time.after("5s")
            local selected
            repeat
                selected = channel.select({notices:case_receive(), events:case_receive(), ready:case_receive()})
                local event = selected.value
                if selected.channel == events and event.kind == process.event.EXIT and tostring(event.from) == pid then
                    pool_pid = nil
                    error("database probe exited during setup: " .. tostring(event.result.error))
                end
            until selected.channel ~= events
            test.eq(selected.channel, notices, "the probe committed its unstarted claim")
            local job = selected.value
            local deadline = time.after("5500ms")
            assert(process.cancel(pid, "shutdown deadline test"))
            wait_step(notices, "release")
            local db = assert(sql.get("app:db"))
            database = db
            local dialect = assert(db:type())
            local tx = assert(db:begin())
            lock = tx
            local for_update = dialect == sql.type.POSTGRES and " FOR UPDATE" or ""
            local running = assert(tx:query("SELECT status,attempts FROM kickside_job WHERE id=$1" .. for_update, { job.id }))
            test.eq(running[1].status, "running")
            test.eq(tonumber(running[1].attempts), 1)
            assert(process.send(pid, topic .. ".release", true))

            local exit = wait_exit(events, pid, deadline)
            test.not_nil(exit, "the pool emits EXIT with the database lock held")
            pool_pid = nil
            test.is_true(tostring(exit.result.error):find("job worker pool drain timed out", 1, true) ~= nil)
            local wake = process.listen(cfg.WAKE_TOPIC)
            assert(process.registry.register(cfg.POOL_NAME, nil, process.registry.CONSISTENT))
            successor_registered = true
            assert(tx:rollback())
            lock = nil
            local nudged = channel.select({ wake:case_receive(), time.after("4s"):case_receive() })
            process.unlisten(wake)
            local refunded_at = time.now():add(4 * time.SECOND)
            local row: table
            repeat
                local rows = assert(db:query("SELECT status,attempts,lease_token FROM kickside_job WHERE id=$1", { job.id }))
                row = rows[1]
                if row.status == "pending" then break end
                time.sleep("25ms")
            until not time.now():before(refunded_at)
            test.eq(row.status, "pending")
            test.eq(tonumber(row.attempts), 0)
            test.is_nil(row.lease_token)
            local runs = assert(db:query("SELECT id FROM kickside_job_run WHERE job_id=$1", { job.id }))
            test.eq(#runs, 0)
            local marker = assert(db:query("SELECT current_job_id FROM kickside_job_worker WHERE id=$1", { job.worker }))
            test.is_nil(marker[1].current_job_id)
            test.eq(nudged.channel, wake, "the successor can dispatch the refunded job before its old lease deadline")
            process.unlisten(notices)
            assert(db:execute("DELETE FROM kickside_job WHERE id=$1", { job.id }))
            assert(db:execute("DELETE FROM kickside_job_worker WHERE id=$1", { job.worker }))
        end)

        local function prepare_rollback(): (string, string, string, any)
            local topic = "jobs.shutdown." .. uuid.v7()
            local notices = process.listen(topic)
            local child = assert(process.spawn_monitored("app:pool_shutdown_probe", "app:processes",
                tostring(process.pid()), topic, "rollback"))
            local pid = tostring(child)
            pool_pid = pid
            local selected = channel.select({notices:case_receive(), time.after("5s"):case_receive()})
            test.eq(selected.channel, notices)
            local slot = selected.value
            assert(process.monitor(slot))
            original_version = assert(registry.current_version())
            local entry = assert(registry.get("app:pool_shutdown_probe"))
            entry.data.method = "run_rollback"
            local changes = assert(registry.snapshot()):changes()
            changes:update({ id = entry.id, kind = entry.kind, meta = entry.meta, data = entry.data })
            changes:delete("kickside.core.jobs.service:worker_shutdown")
            assert(changes:apply())
            return pid, slot, topic, notices
        end

        test.it("preserves a slot EXIT already queued behind OUTDATED for the previous pool revision", function()
            local pid, slot, topic, notices = prepare_rollback()
            assert(process.cancel(slot, "recycle the idle slot"))
            test.not_nil(wait_exit(events, slot, time.after("3s")))
            assert(process.send(pid, "jobs.shutdown.rollback.reply",
                { observer = tostring(process.pid()), topic = topic, slot = slot }))
            assert(process.send(pid, topic .. ".resume", true))
            local replaced = channel.select({notices:case_receive(), time.after("3s"):case_receive()})
            test.eq(replaced.value, "slot available for replacement")
            test.not_nil(wait_exit(events, pid, time.after("3s")))
            pool_pid = nil
            process.unlisten(notices)
        end)

        test.it("observes a CANCEL captured behind OUTDATED before changing revisions", function()
            local pid, _, topic, notices = prepare_rollback()
            assert(process.cancel(pid, "service stopping"))
            assert(process.send(pid, topic .. ".resume", true))
            local exit = wait_exit(events, pid, time.after("3s"))
            test.not_nil(exit, "the original root handles the queued stop")
            pool_pid = nil
            test.is_nil(exit.result.error)
            process.unlisten(notices)
        end)
    end)
end) }
