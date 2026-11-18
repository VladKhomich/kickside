-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local process = require("process")
local sql = require("sql")
local logger = require("logger")
local cfg = require("config")
local claim_execution = require("claim_execution")
local wake = require("wake")

local function main(root: string, hard: boolean, assignments: { [string]: table }): ()
    local lifecycle = process.events()
    local updates = process.listen(cfg.SHUTDOWN_TOPIC, { message = true })
    local watched, watch_err = process.monitor(root)
    if watch_err and not errors.is(watch_err, errors.NOT_FOUND) then error(watch_err) end
    local function take_update(message: process.Message): ()
        if tostring(message:from()) ~= root then return end
        for pid, proof in pairs(message:payload():data()) do assignments[pid] = proof end
    end
    local root_exit: table? = nil
    while watched do
        local selected = channel.select({ lifecycle:case_receive(), updates:case_receive() })
        if selected.channel == updates then
            take_update(selected.value)
        elseif selected.value.kind == process.event.EXIT and tostring(selected.value.from) == root then
            root_exit = selected.value
            break
        end
    end
    -- Committed claims handed off by the owner before it exited can already
    -- be queued on the update channel.
    while true do
        local update = channel.select({ updates:case_receive(), default = true })
        if update.default then break end
        take_update(update.value)
    end
    if hard and root_exit and root_exit.result and not root_exit.result.error then return end
    if next(assignments) == nil then return end

    -- The root normally settles confirmed exits itself. After it has gone,
    -- only a dead slot and the original run owner can authorize a refund.
    local function release(pid: string): ()
        local claim = assignments[pid]
        assignments[pid] = nil
        local db, err = sql.get(cfg.db_id())
        if db and not err then
            local released, release_err = claim_execution.release_unstarted(db, claim.job, pid, claim.run_id)
            db:release()
            err = release_err
            if released then
                -- A replacement may have calculated its next lease deadline
                -- while this assignment still looked running.
                local _, nudge_err = wake.nudge_workers()
                err = nudge_err
            end
        end
        if err then logger:error("job worker shutdown assignment release failed: " .. tostring(err)) end
    end
    for pid in pairs(assignments) do
        local _, err = process.monitor(pid)
        if err then
            if errors.is(err, errors.NOT_FOUND) then
                release(pid)
            else
                assignments[pid] = nil
                logger:error("job worker shutdown slot monitor failed: " .. tostring(err))
            end
        end
    end
    while next(assignments) do
        local event = lifecycle:receive()
        local pid = tostring(event.from)
        if event.kind == process.event.EXIT and assignments[pid] then release(pid) end
    end
end

return { main = main }
