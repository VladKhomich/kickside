-- Core and Jobs commit each bounded teardown page together.
local json = require("json")
local writer = require("threads_writer")
local drop_notify = require("threads_drop_notify")
local jobs_cleanup = require("jobs_cleanup")
local cursor_waiters = require("cursor_waiters")
local error_envelope = require("error_envelope")
local sql_boundary = require("sql_boundary")

local M = {}
local PAGE = 100

local SPECS = {
    { "kickside_event", "id", "thread_id", ",seq" },
    { "kickside_thread_subject", "subject", "thread_id", ",subject" },
    { "kickside_projection_cursor", "id", "thread_id", ",status" },
    { "kickside_retention_policy", "id", "thread_id", "" },
    { "kickside_retention_pin", "consumer_key", "thread_id", ",consumer_key" },
    { "kickside_retention_pin_tombstone", "consumer_key", "thread_id", ",consumer_key" },
    { "kickside_projection", "id", "thread_id", ",id" },
    { "kickside_thread_edge", "id", "from_thread_id", "" },
    { "kickside_thread_edge", "id", "to_thread_id", "" },
}
local UNRESOLVED_STATUS: { [string]: { [string]: boolean } } = {
    kickside_projection = { pending = true },
    kickside_projection_cursor = { active = true, paused = true },
}
local EVIDENCE_ROWS = { kickside_event = true, kickside_retention_pin = true }
local STATUS_COLUMN = { kickside_projection = "state" }

local function internal(message: string, cause: any): error
    return (errors.new({ message = message .. ": " .. tostring(cause),
        kind = errors.INTERNAL, retryable = true }) :: error)
end

local function pending(discarded: any): error
    return (errors.new({ message = "thread cascade has another bounded page",
        kind = errors.CONFLICT, retryable = true,
        details = { cleanup_pending = true, needs_continue = true, discarded = discarded } }) :: error)
end

local function page(tx: any, spec: { string }, id: string, limit: integer): ({ any }?, error?)
    local status = UNRESOLVED_STATUS[spec[1]] and
        ("," .. (STATUS_COLUMN[spec[1]] or "status") .. " AS status") or ""
    -- Keep the scope leading the index order, even where its two bounds coincide.
    local scope = spec[3]
    local rows, err = tx:query("SELECT " .. spec[2] .. " AS row_key" .. status
        .. " FROM " .. spec[1] .. " WHERE " .. scope .. ">=$1 AND " .. scope .. "<=$1"
        .. " ORDER BY " .. scope .. spec[4] .. " LIMIT $2",
        { id, limit })
    if err or type(rows) ~= "table" then
        return nil, internal("thread " .. spec[1] .. " page read failed", err or "missing result")
    end
    return rows, nil
end

local function erase(tx: any, spec: { string }, id: string, rows: { any },
        count: integer): error?
    local params: { any } = { id }
    local marks: { string } = {}
    for i = 1, count do
        params[#params + 1] = rows[i].row_key
        marks[i] = "$" .. tostring(i + 1)
    end
    local result, err = tx:execute("DELETE FROM " .. spec[1] .. " WHERE "
        .. spec[3] .. "=$1 AND " .. spec[2] .. " IN (" .. table.concat(marks, ",") .. ")", params)
    if err or not result or tonumber(result.rows_affected) ~= count then
        return internal("thread " .. spec[1] .. " page delete failed", err or "missing row proof")
    end
    return nil
end

local function persist_counts(tx: any, id: string, counts: any, next_page_seq: integer): error?
    local encoded, enc_err = json.encode(counts)
    if enc_err or type(encoded) ~= "string" then return internal("thread teardown count encode failed", enc_err) end
    local result, err = tx:execute("UPDATE kickside_thread SET teardown_counts_json=$1,"
        .. "teardown_page_seq=$2 WHERE id=$3", { encoded, next_page_seq, id })
    if err or not result or tonumber(result.rows_affected) ~= 1 then
        return internal("thread teardown count stamp failed", err or "missing row proof")
    end
    return nil
end

local function add_counts(target: table, additions: any, label: string): error?
    if type(additions) ~= "table" then return internal(label .. " count map corrupt", "missing map") end
    for name, count in pairs(additions) do
        if type(name) ~= "string" or type(count) ~= "number" or count < 0 or count ~= math.floor(count) then
            return internal(label .. " count corrupt", tostring(name))
        end
        local prior = target[name]
        if prior ~= nil and (type(prior) ~= "number" or prior < 0 or prior ~= math.floor(prior)) then
            return internal(label .. " prior count corrupt", name)
        end
        target[name] = (prior or 0) + count
    end
    return nil
end

local function body(tx: any, dbtype: string, id: string, locked: { [string]: boolean }): (any?, error?)
    local rows, read_err = tx:query([[SELECT deleting_at,teardown_counts_json,teardown_fence_done,teardown_page_seq
        FROM kickside_thread WHERE id=$1]], { id })
    if read_err or type(rows) ~= "table" then
        return nil, internal("marked thread state unavailable", read_err or "missing result")
    end
    local thread = rows[1]
    if not thread then
        return { pending = false, discarded = {}, notified = {}, removed_cursors = {} }, nil
    end
    if thread.deleting_at == nil or (thread.teardown_fence_done ~= true and thread.teardown_fence_done ~= 1) then
        return nil, internal("thread cascade ran before consumer fence", id)
    end
    local page_seq = math.tointeger(thread.teardown_page_seq)
    if page_seq == nil or page_seq < 0 then
        return nil, internal("thread teardown page sequence corrupt", id)
    end
    local counts, decode_err = json.decode(tostring(thread.teardown_counts_json))
    if decode_err or type(counts) ~= "table" then return nil, internal("thread teardown count corrupt", decode_err) end
    if counts.unresolved == nil then counts.unresolved = {} end
    if type(counts.unresolved) ~= "table" then return nil, internal("thread unresolved count corrupt", id) end

    local remaining = PAGE
    local notified: { string } = {}
    local removed_cursors: { string } = {}
    for _, spec in ipairs(SPECS) do
        local rows, read_err = page(tx, spec, id, remaining + 1)
        if read_err then return nil, read_err end
        local selected = rows :: { any }
        local size = math.min(#selected, remaining)
        if size > 0 then
            if spec[1] == "kickside_projection" then
                local hooks, hook_err = drop_notify.hooks(tx, id, size)
                if hook_err then return nil, hook_err end
                for _, target in ipairs(drop_notify.targets(hooks :: { any })) do
                    if not locked[target] then
                        return nil, (errors.new({ message = "drop hook changed during thread teardown",
                            kind = errors.CONFLICT, retryable = true }) :: error)
                    end
                end
                local targets, notify_err = drop_notify.append_tx(tx, hooks :: { any }, id)
                if notify_err then return nil, notify_err end
                for _, target in ipairs(targets :: { string }) do notified[#notified + 1] = target end
            end
            local delete_err = erase(tx, spec, id, selected, size)
            if delete_err then return nil, delete_err end
            if spec[1] == "kickside_projection_cursor" then
                for i = 1, size do removed_cursors[#removed_cursors + 1] = tostring(selected[i].row_key) end
            end
            local prior = counts[spec[1]]
            if prior ~= nil and (type(prior) ~= "number" or prior < 0) then
                return nil, internal("thread teardown row count corrupt", spec[1])
            end
            counts[spec[1]] = (prior or 0) + size
            local unresolved = 0
            for i = 1, size do
                if UNRESOLVED_STATUS[spec[1]] and type(selected[i].status) ~= "string" then
                    return nil, internal("thread unresolved status missing", spec[1])
                end
                if EVIDENCE_ROWS[spec[1]] or
                    (UNRESOLVED_STATUS[spec[1]] and UNRESOLVED_STATUS[spec[1]][selected[i].status]) then
                    unresolved = unresolved + 1
                end
            end
            if unresolved > 0 then
                local prior_unresolved = counts.unresolved[spec[1]]
                if prior_unresolved ~= nil and (type(prior_unresolved) ~= "number"
                    or prior_unresolved < 0 or prior_unresolved ~= math.floor(prior_unresolved)) then
                    return nil, internal("thread unresolved row count corrupt", spec[1])
                end
                counts.unresolved[spec[1]] = (prior_unresolved or 0) + unresolved
            end
            remaining = remaining - size
        end
        if remaining == 0 then break end
    end

    local wake_keys: { string } = {}
    for _, target in ipairs(notified) do wake_keys[#wake_keys + 1] = "thread:" .. target end
    local jobs_page, jobs_err = jobs_cleanup.page_tx(tx, dbtype, id, page_seq, wake_keys)
    if jobs_err then return nil, jobs_err end
    if not jobs_page then return nil, internal("thread Jobs page unavailable", id) end
    local count_err = add_counts(counts, jobs_page.discarded, "thread job discarded")
    if count_err then return nil, count_err end
    count_err = add_counts(counts.unresolved, jobs_page.unresolved, "thread job unresolved")
    if count_err then return nil, count_err end

    local finished = remaining > 0 and jobs_page.done == true
    local _, ack_err = jobs_cleanup.ack_tx(tx, dbtype, id, page_seq, finished)
    if ack_err then return nil, ack_err end
    if not finished then
        local stamp_err = persist_counts(tx, id, counts, page_seq + 1)
        if stamp_err then return nil, stamp_err end
        return { pending = true, discarded = counts, notified = notified, removed_cursors = removed_cursors }, nil
    end
    local result, delete_err = tx:execute("DELETE FROM kickside_thread WHERE id=$1", { id })
    if delete_err or not result or tonumber(result.rows_affected) ~= 1 then
        return nil, internal("thread final delete failed", delete_err or "missing row proof")
    end
    return { pending = false, discarded = counts, notified = notified, removed_cursors = removed_cursors }, nil
end

function M.run(db: any, id: string): (any?, error?)
    local dbtype, dbtype_err = writer.dbtype_of(db)
    if dbtype_err then return nil, dbtype_err end
    local hooks, hook_err = drop_notify.hooks(db, id, PAGE)
    if hook_err then return nil, hook_err end

    local lock_ids: { string } = { id }
    local locked: { [string]: boolean } = { [id] = true }
    for _, target in ipairs(drop_notify.targets(hooks :: { any })) do
        lock_ids[#lock_ids + 1] = target
        locked[target] = true
    end
    local tx, begin_err = db:begin()
    if begin_err or not tx then return nil, internal("thread cascade transaction failed", begin_err) end
    local lock_err = writer.lock_threads_tx(tx, dbtype :: string, lock_ids)
    if lock_err then return nil, sql_boundary.rollback(tx, lock_err, "thread cascade rollback failed") end
    local result, run_err = body(tx, dbtype :: string, id, locked)
    if run_err then return nil, sql_boundary.rollback(tx, run_err, "thread cascade rollback failed") end
    local _, commit_err = tx:commit()
    if commit_err then return nil, internal("thread cascade commit failed", commit_err) end
    local removed_err: error? = nil
    for _, cursor_id in ipairs((result :: any).removed_cursors) do
        removed_err = error_envelope.cleanup(function(): (any, error?)
            return cursor_waiters.notify_cursor(cursor_id, nil, "removed")
        end, removed_err, "thread cursor removal notification failed")
    end
    if removed_err then return nil, removed_err end
    if (result :: any).pending then return nil, pending((result :: any).discarded) end
    return result, nil
end

return M
