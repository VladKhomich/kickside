-- Jobs-owned bounded thread cleanup. Each page commits with a durable receipt
-- so Core can record A48 counts in its own transaction and acknowledge after.
local sql = require("sql")
local json = require("json")
local clock = require("clock")
local thread_fence = require("thread_fence")
local cfg = require("config")
local sql_boundary = require("sql_boundary")

local M = {}
local RECEIPT = "kickside_job_thread_cleanup_receipt"
local JOB = "kickside_job"
local RUN = "kickside_job_run"
local OWNED = "owner_kind='thread' AND owner_id=$1"
local LINKED = "thread_id=$1"
-- Keep the indexed scope as the leading sort key even when the two range
-- endpoints coincide. Ordering by id alone lets a common owner scan the PK.
local OWNER_RANGE = "owner_kind='thread' AND owner_id >= $1 AND owner_id <= $1"
local LINK_RANGE = "thread_id >= $1 AND thread_id <= $1"
local SLICES = {
    { name = RUN, scope = OWNED, seek = OWNER_RANGE, order = "owner_id,id" },
    { name = JOB, scope = OWNED, seek = OWNER_RANGE, order = "owner_id,id" },
    { name = JOB, scope = LINKED, seek = LINK_RANGE, order = "thread_id", detach = true },
    { name = RUN, scope = LINKED, seek = LINK_RANGE, order = "thread_id,started_at DESC", detach = true },
}

local function response_error(field: string): error
    return errors.new({message = "thread cleanup response is invalid", kind = errors.INTERNAL,
        retryable = false, details = {code = "job_thread_cleanup_response", field = field}})
end

local function affected(result: any, label: string, expected: integer): (integer?, error?)
    return sql_boundary.exact_row_count(result, nil, label, label .. ".count", expected, response_error)
end

local function decoded(raw: any, label: string): (table?, error?)
    local value, err = json.decode(tostring(raw or ""))
    if err then return nil, errors.wrap(err, label .. " receipt is corrupt") end
    if type(value) ~= "table" then return nil, response_error(label .. ".decoded") end
    return value :: table, nil
end

local function read_receipt(row: table): (table?, error?)
    local discarded, discarded_err = decoded(row.discarded_json, "discarded")
    if discarded_err then return nil, discarded_err end
    local unresolved, unresolved_err = decoded(row.unresolved_json, "unresolved")
    if unresolved_err then return nil, unresolved_err end
    return {
        thread_id = tostring(row.thread_id), page_seq = tonumber(row.page_seq),
        processed = tonumber(row.processed), done = row.done == true or row.done == 1,
        discarded = discarded, unresolved = unresolved,
    }, nil
end

local function candidates(tx: sql.Transaction, slice: table, thread_id: string,
        limit: integer): ({ any }?, error?)
    -- Owned slices consume the budget first. At most one page of owned rows
    -- can precede the remaining links in either link index.
    local scope = slice.detach and (slice.seek .. " AND NOT (owner_kind='thread' AND owner_id=$2)") or slice.seek
    local args = slice.detach and { thread_id, thread_id, limit } or { thread_id, limit }
    local rows, err = tx:query("SELECT id" .. (slice.name == RUN and ",job_id" or "") .. " FROM " .. slice.name
        .. " WHERE " .. scope .. " ORDER BY " .. slice.order .. " LIMIT $" .. tostring(#args), args)
    return sql_boundary.bounded_rows(rows, err, "thread cleanup candidate read failed for " .. slice.name,
        "candidates.rows", 0, limit, response_error)
end

local function placeholders(first: integer, count: integer): string
    local marks: { string } = {}
    for i = 1, count do marks[i] = "$" .. tostring(first + i - 1) end
    return table.concat(marks, ",")
end

local function mutate(tx: sql.Transaction, dbtype: string, slice: table, thread_id: string,
        ids: { string }): ({ any }?, error?)
    local name = slice.name
    local args: { any } = { thread_id }
    for _, id in ipairs(ids) do args[#args + 1] = id end
    local selected = "id IN (" .. placeholders(2, #ids) .. ")"
    local target = name
    if dbtype == sql.type.SQLITE then
        -- Resolve the bounded IDs to rowids so the mutation never scans the scope.
        target = name .. " NOT INDEXED"
        selected = "rowid IN (SELECT rowid FROM " .. name .. " WHERE " .. selected .. ")"
    end
    local mutation = slice.detach and ("UPDATE " .. target .. " SET thread_id=NULL") or ("DELETE FROM " .. target)
    local scope = slice.scope
    if name == JOB and not slice.detach then
        -- A start can have inserted history since discovery. Check under the
        -- parent lock so a parent delete never cascades to unbudgeted runs.
        scope = scope .. " AND (SELECT 1 FROM kickside_job_run r WHERE r.job_id=kickside_job.id LIMIT 1) IS NULL"
    end
    local rows, err = tx:query(mutation .. " WHERE " .. scope .. " AND " .. selected .. " RETURNING status", args)
    local minimum = name == RUN and not slice.detach and #ids or 0
    return sql_boundary.bounded_rows(rows, err, "thread cleanup mutation failed for " .. name,
        "mutation.rows", minimum, #ids, response_error)
end

local function has_rows(tx: sql.Transaction, thread_id: string): (boolean?, error?)
    for _, slice in ipairs(SLICES) do
        local rows, err = tx:query("SELECT 1 FROM " .. slice.name .. " WHERE " .. slice.seek
            .. " ORDER BY " .. slice.order .. " LIMIT 1", { thread_id })
        if err then return nil, errors.wrap(err, "thread cleanup continuation read failed") end
        if type(rows) ~= "table" then return nil, response_error("continuation.rows") end
        if rows[1] then return true, nil end
    end
    return false, nil
end

local function run_page(tx: sql.Transaction, dbtype: string, thread_id: string,
        limit: integer): (table?, error?)
    local result = { processed = 0, discarded = {}, unresolved = {} }
    local remaining = limit
    local selected: {{ any }} = {}
    local last_owned: { any }? = nil
    for index, slice in ipairs(SLICES) do
        if slice.detach and slice.name == JOB and last_owned then
            -- Completed-owner retention discovers work by ownership. Hold
            -- the last owned row until the surviving links fit on the page.
            remaining = remaining + 1
        end
        if slice.detach and remaining == 0 then break end
        local candidate_limit = slice.detach and remaining or remaining + 1
        local rows, read_err = candidates(tx, slice, thread_id, candidate_limit)
        if read_err then return nil, read_err end
        local page = rows :: { any }
        selected[index] = page
        if #page > remaining then
            table.remove(page)
            break
        end
        remaining = remaining - #page
        if not slice.detach and #page > 0 then last_owned = page end
        if slice.detach and remaining == 0 and last_owned then table.remove(last_owned) end
    end

    local pages: {{ string }} = {}
    local parent_ids: { string } = {}
    local seen: { [string]: boolean } = {}
    for index, rows in ipairs(selected) do
        local slice = SLICES[index]
        local ids: { string } = {}
        for _, row in ipairs(rows) do
            local parent = slice.name == RUN and row.job_id or row.id
            if type(row.id) ~= "string" or row.id == "" or type(parent) ~= "string" or parent == "" then
                return nil, response_error("candidates.id")
            end
            ids[#ids + 1] = row.id
            if not seen[parent] then
                seen[parent] = true
                parent_ids[#parent_ids + 1] = parent
            end
        end
        pages[index] = ids
    end
    -- Batch claim and retention take the same parent order. Take every parent
    -- lock before touching any run, including links owned by another thread.
    if dbtype == sql.type.POSTGRES and #parent_ids > 0 then
        local rows, err = tx:query("SELECT id FROM kickside_job WHERE id IN ("
            .. placeholders(1, #parent_ids) .. ") ORDER BY id FOR UPDATE", parent_ids)
        if err then return nil, errors.wrap(err, "thread cleanup parent lock failed") end
        if type(rows) ~= "table" then return nil, response_error("parents.rows") end
    end
    for index, ids in ipairs(pages) do
        if #ids > 0 then
            local slice = SLICES[index] :: table
            local rows, mutation_err = mutate(tx, dbtype, slice, thread_id, ids)
            if mutation_err then return nil, mutation_err end
            local changed = rows :: { any }
            result.processed = result.processed + #changed
            if not slice.detach and #changed > 0 then
                result.discarded[slice.name] = #changed
                for _, row in ipairs(changed) do
                    if type(row.status) ~= "string" then return nil, response_error("cleanup.status") end
                    if row.status == "running" or (slice.name == JOB and row.status == "pending") then
                        result.unresolved[slice.name] = (result.unresolved[slice.name] or 0) + 1
                    end
                end
            end
        end
    end
    local lingering, linger_err = has_rows(tx, thread_id)
    if linger_err then return nil, linger_err end
    result.done = not lingering
    return result, nil
end

local function sequence_error(expected: integer, actual: integer): error
    return (errors.new({ message = "thread cleanup page sequence changed: expected "
        .. tostring(expected) .. ", received " .. tostring(actual),
        kind = errors.CONFLICT, retryable = true }) :: error)
end

function M.page(db: sql.DB, dbtype: string, thread_id: string, page_seq: integer): (table?, error?)
    if type(thread_id) ~= "string" or thread_id == "" or type(page_seq) ~= "number"
        or page_seq < 0 or page_seq ~= math.floor(page_seq) then
        return nil, (errors.new({ message = "invalid thread cleanup page identity", kind = errors.INVALID }) :: error)
    end
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local tx, begin_err = sql_boundary.begin(db, "thread cleanup transaction failed", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local fence, lock_err = thread_fence.lock(tx, thread_id)
    if lock_err then return nil, sql_boundary.rollback(tx, lock_err, "thread cleanup rollback failed") end
    if type(fence) ~= "table" then return nil, sql_boundary.rollback(tx, response_error("fence"), "thread cleanup rollback failed") end
    local next_seq_value = tonumber(fence.next_page_seq)
    local next_seq = next_seq_value and math.tointeger(next_seq_value)
    if next_seq == nil or next_seq < 0 then return nil, sql_boundary.rollback(tx, response_error("fence.next_page_seq"), "thread cleanup rollback failed") end
    if page_seq < next_seq then
        local rows, receipt_err = tx:query("SELECT thread_id,page_seq,processed,done,discarded_json,unresolved_json"
            .. " FROM " .. RECEIPT .. " WHERE thread_id=$1 AND page_seq=$2", { thread_id, page_seq })
        if receipt_err then return nil, sql_boundary.rollback(tx,
            errors.wrap(receipt_err, "thread cleanup retry receipt read failed"), "thread cleanup rollback failed") end
        if type(rows) ~= "table" or not rows[1] then return nil, sql_boundary.rollback(tx,
            response_error("receipt.rows"), "thread cleanup rollback failed") end
        local value, value_err = read_receipt(rows[1])
        if value_err then return nil, sql_boundary.rollback(tx, value_err, "thread cleanup rollback failed") end
        local _, commit_err = tx:commit()
        if commit_err then return nil, errors.wrap(commit_err, "thread cleanup receipt read commit failed") end
        return value, nil
    end
    if page_seq ~= next_seq then
        return nil, sql_boundary.rollback(tx, sequence_error(next_seq, page_seq), "thread cleanup rollback failed")
    end
    if page_seq > 0 then
        -- Core advances its durable page sequence in the same transaction that
        -- applies the prior receipt. Recover the acknowledgment if Core stopped
        -- between that commit and its post-commit acknowledgment call.
        local previous, previous_err = tx:query("SELECT acknowledged_at FROM " .. RECEIPT
            .. " WHERE thread_id=$1 AND page_seq=$2", { thread_id, page_seq - 1 })
        if previous_err then return nil, sql_boundary.rollback(tx,
            errors.wrap(previous_err, "prior thread cleanup receipt read failed"), "thread cleanup rollback failed") end
        if type(previous) ~= "table" then return nil, sql_boundary.rollback(tx,
            response_error("previous.rows"), "thread cleanup rollback failed") end
        if previous[1] and previous[1].acknowledged_at == nil then
            local acknowledged, acknowledge_err = tx:execute("UPDATE " .. RECEIPT
                .. " SET acknowledged_at=$1 WHERE thread_id=$2 AND page_seq=$3 AND acknowledged_at IS NULL",
                { clock.now(dbtype), thread_id, page_seq - 1 })
            if acknowledge_err then return nil, sql_boundary.rollback(tx,
                errors.wrap(acknowledge_err, "prior thread cleanup acknowledgment failed"), "thread cleanup rollback failed") end
            local _, acknowledge_proof = affected(acknowledged, "prior thread cleanup acknowledgment", 1)
            if acknowledge_proof then return nil, sql_boundary.rollback(tx, acknowledge_proof, "thread cleanup rollback failed") end
        end
    end
    local limit = (policy :: any).thread_cleanup_batch :: integer
    local result, run_err = run_page(tx, dbtype, thread_id, limit)
    if run_err then return nil, sql_boundary.rollback(tx, run_err, "thread cleanup rollback failed") end
    local discarded_json, discarded_err = json.encode((result :: table).discarded)
    local unresolved_json, unresolved_err = json.encode((result :: table).unresolved)
    if discarded_err then return nil, sql_boundary.rollback(tx,
        errors.wrap(discarded_err, "thread cleanup count encoding failed"), "thread cleanup rollback failed") end
    if type(discarded_json) ~= "string" then return nil, sql_boundary.rollback(tx,
        response_error("discarded.encoded"), "thread cleanup rollback failed") end
    if unresolved_err then return nil, sql_boundary.rollback(tx,
        errors.wrap(unresolved_err, "thread cleanup unresolved encoding failed"), "thread cleanup rollback failed") end
    if type(unresolved_json) ~= "string" then return nil, sql_boundary.rollback(tx,
        response_error("unresolved.encoded"), "thread cleanup rollback failed") end
    local now = clock.now(dbtype)
    local insert, insert_err = tx:execute("INSERT INTO " .. RECEIPT
        .. "(thread_id,page_seq,processed,done,discarded_json,unresolved_json,created_at)"
        .. " VALUES($1,$2,$3,$4,$5,$6,$7)", { thread_id, page_seq, (result :: table).processed,
            (result :: table).done, discarded_json, unresolved_json, now })
    if insert_err then return nil, sql_boundary.rollback(tx, errors.wrap(insert_err, "thread cleanup receipt insert failed"), "thread cleanup rollback failed") end
    local _, insert_proof = affected(insert, "thread cleanup receipt insert", 1)
    if insert_proof then return nil, sql_boundary.rollback(tx, insert_proof, "thread cleanup rollback failed") end
    local started = dbtype == sql.type.POSTGRES and true or 1
    local update, update_err = tx:execute("UPDATE kickside_job_thread_cleanup SET started=$1,"
        .. "next_page_seq=$2 WHERE thread_id=$3",
        { started, page_seq + 1, thread_id })
    if update_err then return nil, sql_boundary.rollback(tx, errors.wrap(update_err, "thread cleanup state update failed"), "thread cleanup rollback failed") end
    local _, state_proof = affected(update, "thread cleanup state update", 1)
    if state_proof then return nil, sql_boundary.rollback(tx, state_proof, "thread cleanup rollback failed") end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "thread cleanup page commit failed") end
    local page_result = result :: table
    page_result.thread_id = thread_id
    page_result.page_seq = page_seq
    return page_result, nil
end

-- Remove the jobs and runs a thread still owns after its cleanup completed.
-- Thread teardown removes every owned row before it completes, so such rows
-- were left by a teardown that missed them; each owner's rows go in one bounded
-- transaction under its cleanup fence. Returns the number of rows removed.
function M.reclaim_completed(db: sql.DB, dbtype: string, limit: integer): (integer?, error?)
    local rows, read_err = db:query([[SELECT f.thread_id FROM kickside_job_thread_cleanup f
        WHERE f.completed_at IS NOT NULL
          AND (EXISTS (SELECT 1 FROM kickside_job j WHERE j.owner_kind='thread' AND j.owner_id=f.thread_id)
            OR EXISTS (SELECT 1 FROM kickside_job_run r WHERE r.owner_kind='thread' AND r.owner_id=f.thread_id))
        ORDER BY f.thread_id LIMIT $1]], { limit })
    if read_err then return nil, errors.wrap(read_err, "completed cleanup leftover read failed") end
    if type(rows) ~= "table" then return nil, response_error("owners.rows") end
    local total = 0
    for _, row in ipairs(rows) do
        local thread_id = tostring(row.thread_id)
        local tx, begin_err = sql_boundary.begin(db, "completed cleanup leftover transaction failed", "transaction", response_error)
        if begin_err then return nil, begin_err end
        if not tx then return nil, response_error("transaction") end
        local _, lock_err = thread_fence.lock(tx, thread_id)
        if lock_err then return nil, sql_boundary.rollback(tx, lock_err, "thread cleanup rollback failed") end
        local result, run_err = run_page(tx, dbtype, thread_id, limit)
        if run_err then return nil, sql_boundary.rollback(tx, run_err, "thread cleanup rollback failed") end
        local _, commit_err = tx:commit()
        if commit_err then return nil, errors.wrap(commit_err, "completed cleanup leftover commit failed") end
        total = total + (result :: table).processed
    end
    return total, nil
end

function M.ack(db: sql.DB, dbtype: string, thread_id: string, page_seq: integer,
        thread_done: boolean): (boolean?, error?)
    local tx, begin_err = sql_boundary.begin(db, "thread cleanup acknowledgment transaction failed", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local _, fence_err = thread_fence.lock(tx, thread_id)
    if fence_err then return nil, sql_boundary.rollback(tx, fence_err, "thread cleanup rollback failed") end
    local rows, read_err = tx:query("SELECT acknowledged_at,done FROM " .. RECEIPT
        .. " WHERE thread_id=$1 AND page_seq=$2", { thread_id, page_seq })
    if read_err then return nil, sql_boundary.rollback(tx,
        errors.wrap(read_err, "thread cleanup acknowledgment receipt read failed"), "thread cleanup rollback failed") end
    if type(rows) ~= "table" or not rows[1] then return nil, sql_boundary.rollback(tx,
        response_error("receipt.rows"), "thread cleanup rollback failed") end
    if thread_done and not (rows[1].done == true or rows[1].done == 1) then
        local unfinished = errors.new({ message = "unfinished thread cleanup page cannot complete its owner",
            kind = errors.CONFLICT, retryable = true })
        return nil, sql_boundary.rollback(tx, unfinished, "thread cleanup rollback failed")
    end
    if rows[1].acknowledged_at == nil then
        local result, update_err = tx:execute("UPDATE " .. RECEIPT
            .. " SET acknowledged_at=$1 WHERE thread_id=$2 AND page_seq=$3 AND acknowledged_at IS NULL",
            { clock.now(dbtype), thread_id, page_seq })
        if update_err then return nil, sql_boundary.rollback(tx, errors.wrap(update_err, "thread cleanup receipt acknowledgment failed"), "thread cleanup rollback failed") end
        local _, proof_err = affected(result, "thread cleanup receipt acknowledgment", 1)
        if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "thread cleanup rollback failed") end
    end
    if thread_done then
        local done = dbtype == sql.type.POSTGRES and true or 1
        local result, update_err = tx:execute("UPDATE kickside_job_thread_cleanup"
            .. " SET completed_at=$1 WHERE thread_id=$2"
            .. " AND started=$3", { clock.now(dbtype), thread_id, done })
        if update_err then return nil, sql_boundary.rollback(tx, errors.wrap(update_err, "thread cleanup completion stamp failed"), "thread cleanup rollback failed") end
        local _, proof_err = affected(result, "thread cleanup completion stamp", 1)
        if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "thread cleanup rollback failed") end
    end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "thread cleanup acknowledgment commit failed") end
    return true, nil
end

return M
