-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local sql = require("sql")
local migrator = require("migration")
local jobs_policy = require("jobs_policy")
local register = require("register")
local threads_writer = require("threads_writer")

local PAGE_SIZE = 100

local function link_page(tx: sql.Transaction, dialect: string, checkpoint: string?, max_attempts: integer): string?
    local candidates, read_err = tx:query([[SELECT c.id,c.thread_id FROM kickside_projection_cursor c
        JOIN kickside_thread t ON t.id=c.thread_id WHERE c.job_id IS NULL AND t.deleting_at IS NULL]]
        .. (checkpoint and " AND c.id>$1" or "") .. " ORDER BY c.id LIMIT " .. tostring(PAGE_SIZE),
        checkpoint and {checkpoint} or {})
    if read_err then error(read_err) end
    if #candidates == 0 then return nil end

    local thread_ids = {}
    for _, candidate in ipairs(candidates) do
        thread_ids[#thread_ids + 1] = candidate.thread_id
    end
    local locked, lock_err = threads_writer.lock_thread_rows_tx(tx, dialect, thread_ids)
    if lock_err then error(lock_err) end
    for _, candidate in ipairs(candidates) do
        local thread = locked[tostring(candidate.thread_id)]
        if thread and thread.deleting_at == nil then
            local rows, cursor_err = tx:query([[SELECT last_seq,status FROM kickside_projection_cursor
                WHERE id=$1 AND job_id IS NULL]], {candidate.id})
            if cursor_err then error(cursor_err) end
            local cursor = rows[1]
            if cursor then
                local parked = cursor.status ~= "active" or tonumber(cursor.last_seq) >= tonumber(thread.event_count)
                local job_id, slot_err = register.enqueue_slot(tx, dialect, tostring(candidate.thread_id),
                    tostring(candidate.id), parked, max_attempts)
                if not job_id then error(slot_err) end
                local linked, link_err = tx:execute("UPDATE kickside_projection_cursor SET job_id=$1 WHERE id=$2 AND job_id IS NULL",
                    {job_id, candidate.id})
                if link_err then error(link_err) end
                if not linked or tonumber(linked.rows_affected) ~= 1 then
                    error("historical projection slot link did not update exactly one cursor")
                end
            end
        end
    end
    if #candidates < PAGE_SIZE then return nil end
    return tostring(candidates[#candidates].id)
end

return function(options)
    -- Settings can share the App's single SQLite connection. Read the
    -- committed retry limit before the migration acquires its transaction.
    local policy, policy_err = jobs_policy.resolve()
    if policy_err or not policy then error(policy_err or "Jobs retry policy is unavailable") end
    local max_attempts = (policy :: any).retry_max_attempts

    return migrator.run(function()
        migration("Link historical projection cursors to durable Jobs slots", function()
            database("postgres", function()
                up(function(tx, checkpoint) return link_page(tx, sql.type.POSTGRES, checkpoint, max_attempts) end, "batch")
            end)
            database("sqlite", function()
                up(function(tx, checkpoint) return link_page(tx, sql.type.SQLITE, checkpoint, max_attempts) end, "batch")
            end)
        end)
    end, options)
end
