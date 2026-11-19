-- Jobs-owned bounded thread cleanup with durable page receipts.
local sql = require("sql")
local json = require("json")
local clock = require("clock")
local thread_fence = require("thread_fence")
local cfg = require("config")
local wake = require("wake")
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
    local rows, err = tx:query(mutation .. " WHERE " .. scope .. " AND " .. selected .. " RETURNING status,id", args)
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
        limit: integer, wake_keys: { string }?): (table?, error?)
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
    local function mutate_locked(snapshots: { [string]: table }?): error?
        for index, ids in ipairs(pages) do
            if #ids > 0 then
                local slice = SLICES[index] :: table
                local rows, mutation_err = mutate(tx, dbtype, slice, thread_id, ids)
                if mutation_err then return mutation_err end
                local changed = rows :: { any }
                result.processed = result.processed + #changed
                if not slice.detach and #changed > 0 then
                    result.discarded[slice.name] = #changed
                    for _, row in ipairs(changed) do
                        if type(row.status) ~= "string" then return response_error("cleanup.status") end
                        if row.status == "running" or (slice.name == JOB and row.status == "pending") then
                            result.unresolved[slice.name] = (result.unresolved[slice.name] or 0) + 1
                        end
                    end
                end
                if snapshots and slice.name == JOB then
                    for _, row in ipairs(changed) do
                        if slice.detach then
                            local snapshot = snapshots[row.id]
                            if snapshot then snapshot.thread_id = nil end
                        else
                            snapshots[row.id] = nil
                        end
                    end
                end
            end
        end
        return nil
    end

    -- Lock all parents before touching any run, including another owner's
    -- links. A drop's wake shares this order with the deletion.
    if wake_keys and #wake_keys > 0 then
        local _, wake_err = wake.wake_multi(tx, wake_keys, dbtype, nil,
            { ids = parent_ids, apply = mutate_locked })
        if wake_err then return nil, wake_err end
    else
        if dbtype == sql.type.POSTGRES and #parent_ids > 0 then
            local rows, err = tx:query("SELECT id FROM kickside_job WHERE id IN ("
                .. placeholders(1, #parent_ids) .. ") ORDER BY id FOR UPDATE", parent_ids)
            if err then return nil, errors.wrap(err, "thread cleanup parent lock failed") end
            if type(rows) ~= "table" then return nil, response_error("parents.rows") end
        end
        local mutation_err = mutate_locked(nil)
        if mutation_err then return nil, mutation_err end
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

local function replacement_conflict(): error
    return errors.new({ message = "prior Jobs cleanup must finish before replacing its thread owner",
        kind = errors.CONFLICT, retryable = true, details = { code = "prior_thread_cleanup_pending" } })
end

local function retained_sequence(tx: sql.Transaction, thread_id: string): (integer?, error?)
    local rows, err = tx:query("SELECT page_seq FROM " .. RECEIPT
        .. " WHERE thread_id=$1 ORDER BY page_seq DESC LIMIT 1", { thread_id })
    if err then return nil, errors.wrap(err, "latest thread cleanup receipt read failed") end
    if type(rows) ~= "table" then return nil, response_error("replacement.receipts") end
    if not rows[1] then return 0, nil end
    local value = tonumber(rows[1].page_seq)
    local seq = value and math.tointeger(value)
    if not seq or seq < 0 then return nil, response_error("replacement.receipt_sequence") end
    return seq + 1, nil
end

-- The caller has just inserted a new Core thread in the same transaction.
-- Only a completed fence can pass ownership to that replacement.
function M.prepare_replacement_tx(tx: sql.Transaction, dbtype: string, thread_id: string): (integer?, error?)
    local fence, lock_err = thread_fence.lock_existing(tx, dbtype, thread_id)
    if lock_err then return nil, lock_err end
    if not fence then
        local retained, read_err = retained_sequence(tx, thread_id)
        if read_err or retained == 0 then return retained, read_err end
        fence, lock_err = thread_fence.lock(tx, thread_id)
        if lock_err then return nil, lock_err end
        if not fence then return nil, response_error("replacement.fence") end
    end
    local value = tonumber(fence.next_page_seq)
    local next_seq = value and math.tointeger(value)
    if not next_seq or next_seq < 0 then
        return nil, response_error("replacement.fence_sequence")
    end
    if fence.started and fence.completed_at == nil then return nil, replacement_conflict() end
    local retained, read_err = retained_sequence(tx, thread_id)
    if read_err then return nil, read_err end
    local start = math.tointeger(math.max(next_seq, retained :: integer)) :: integer
    if start == 0 then return 0, nil end

    local blockers, blocker_err = tx:query("SELECT 1 WHERE EXISTS (SELECT 1 FROM " .. RECEIPT
        .. " WHERE thread_id=$1 AND acknowledged_at IS NULL) OR EXISTS (SELECT 1 FROM " .. JOB
        .. " WHERE " .. OWNED .. ") OR EXISTS (SELECT 1 FROM " .. RUN .. " WHERE " .. OWNED .. ")", { thread_id })
    if blocker_err then return nil, errors.wrap(blocker_err, "prior thread cleanup proof read failed") end
    if type(blockers) ~= "table" then return nil, response_error("replacement.blockers") end
    if #blockers ~= 0 then return nil, replacement_conflict() end
    local updated, update_err = tx:execute("UPDATE " .. thread_fence.TABLE
        .. " SET started=FALSE,completed_at=NULL,next_page_seq=$1 WHERE thread_id=$2", { start, thread_id })
    if update_err then return nil, errors.wrap(update_err, "thread cleanup replacement fence update failed") end
    local _, proof_err = affected(updated, "thread cleanup replacement", 1)
    if proof_err then return nil, proof_err end
    return start, nil
end

function M.page_tx(tx: sql.Transaction, dbtype: string, thread_id: string, page_seq: integer,
        wake_keys: { string }?, standalone: boolean?): (table?, error?)
    if type(thread_id) ~= "string" or thread_id == "" or type(page_seq) ~= "number"
        or page_seq < 0 or page_seq ~= math.floor(page_seq) then
        return nil, (errors.new({ message = "invalid thread cleanup page identity", kind = errors.INVALID }) :: error)
    end
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local fence, lock_err = thread_fence.lock(tx, thread_id)
    if lock_err then return nil, lock_err end
    if type(fence) ~= "table" then return nil, response_error("fence") end
    local next_seq_value = tonumber(fence.next_page_seq)
    local next_seq = next_seq_value and math.tointeger(next_seq_value)
    if next_seq == nil or next_seq < 0 then return nil, response_error("fence.next_page_seq") end
    if page_seq < next_seq then
        local rows, receipt_err = tx:query("SELECT thread_id,page_seq,processed,done,discarded_json,unresolved_json"
            .. " FROM " .. RECEIPT .. " WHERE thread_id=$1 AND page_seq=$2", { thread_id, page_seq })
        if receipt_err then return nil, errors.wrap(receipt_err, "thread cleanup retry receipt read failed") end
        if type(rows) ~= "table" or not rows[1] then return nil, response_error("receipt.rows") end
        local value, value_err = read_receipt(rows[1])
        if value_err then return nil, value_err end
        if wake_keys and #wake_keys > 0 then
            local _, wake_err = wake.wake_multi(tx, wake_keys, dbtype)
            if wake_err then return nil, wake_err end
        end
        return value, nil
    end
    if page_seq ~= next_seq then
        return nil, sequence_error(next_seq, page_seq)
    end
    if standalone and next_seq > 0 and not fence.started then
        return nil, errors.new({ message = "standalone cleanup cannot start a replacement Core thread's page",
            kind = errors.CONFLICT, retryable = false })
    end
    local link_err = thread_fence.lock_link(tx, dbtype, thread_id, true)
    if link_err then return nil, link_err end
    if page_seq > 0 then
        -- Older Core writers and standalone callers can advance without
        -- acknowledging their previous page.
        local previous, previous_err = tx:query("SELECT acknowledged_at FROM " .. RECEIPT
            .. " WHERE thread_id=$1 AND page_seq=$2", { thread_id, page_seq - 1 })
        if previous_err then return nil, errors.wrap(previous_err, "prior thread cleanup receipt read failed") end
        if type(previous) ~= "table" then return nil, response_error("previous.rows") end
        if previous[1] and previous[1].acknowledged_at == nil then
            local acknowledged, acknowledge_err = tx:execute("UPDATE " .. RECEIPT
                .. " SET acknowledged_at=$1 WHERE thread_id=$2 AND page_seq=$3 AND acknowledged_at IS NULL",
                { clock.now(dbtype), thread_id, page_seq - 1 })
            if acknowledge_err then return nil, errors.wrap(acknowledge_err, "prior thread cleanup acknowledgment failed") end
            local _, acknowledge_proof = affected(acknowledged, "prior thread cleanup acknowledgment", 1)
            if acknowledge_proof then return nil, acknowledge_proof end
        end
    end
    local limit = (policy :: any).thread_cleanup_batch :: integer
    local result, run_err = run_page(tx, dbtype, thread_id, limit, wake_keys)
    if run_err then return nil, run_err end
    local discarded_json, discarded_err = json.encode((result :: table).discarded)
    local unresolved_json, unresolved_err = json.encode((result :: table).unresolved)
    if discarded_err then return nil, errors.wrap(discarded_err, "thread cleanup count encoding failed") end
    if type(discarded_json) ~= "string" then return nil, response_error("discarded.encoded") end
    if unresolved_err then return nil, errors.wrap(unresolved_err, "thread cleanup unresolved encoding failed") end
    if type(unresolved_json) ~= "string" then return nil, response_error("unresolved.encoded") end
    local now = clock.now(dbtype)
    local insert, insert_err = tx:execute("INSERT INTO " .. RECEIPT
        .. "(thread_id,page_seq,processed,done,discarded_json,unresolved_json,created_at)"
        .. " VALUES($1,$2,$3,$4,$5,$6,$7)", { thread_id, page_seq, (result :: table).processed,
            (result :: table).done, discarded_json, unresolved_json, now })
    if insert_err then return nil, errors.wrap(insert_err, "thread cleanup receipt insert failed") end
    local _, insert_proof = affected(insert, "thread cleanup receipt insert", 1)
    if insert_proof then return nil, insert_proof end
    local started = dbtype == sql.type.POSTGRES and true or 1
    local update, update_err = tx:execute("UPDATE kickside_job_thread_cleanup SET started=$1,"
        .. "next_page_seq=$2 WHERE thread_id=$3",
        { started, page_seq + 1, thread_id })
    if update_err then return nil, errors.wrap(update_err, "thread cleanup state update failed") end
    local _, state_proof = affected(update, "thread cleanup state update", 1)
    if state_proof then return nil, state_proof end
    local page_result = result :: table
    page_result.thread_id = thread_id
    page_result.page_seq = page_seq
    return page_result, nil
end

function M.page(db: sql.DB, dbtype: string, thread_id: string, page_seq: integer): (table?, error?)
    local tx, begin_err = sql_boundary.begin(db, "thread cleanup transaction failed", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local result, err = M.page_tx(tx, dbtype, thread_id, page_seq, nil, true)
    if err then return nil, sql_boundary.rollback(tx, err, "thread cleanup rollback failed") end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "thread cleanup page commit failed") end
    return result, nil
end

local function has_owned_rows(thread_id_sql: string): string
    return "((SELECT 1 FROM " .. JOB .. " j WHERE j.owner_kind='thread' AND j.owner_id=" .. thread_id_sql
        .. " LIMIT 1) IS NOT NULL OR (SELECT 1 FROM " .. RUN .. " r WHERE r.owner_kind='thread' AND r.owner_id="
        .. thread_id_sql .. " LIMIT 1) IS NOT NULL)"
end

function M.completed_fence_clear(thread_id_sql: string): string
    return "NOT " .. has_owned_rows(thread_id_sql) .. " AND (SELECT 1 FROM " .. RECEIPT
        .. " r WHERE r.thread_id=" .. thread_id_sql .. " AND r.acknowledged_at IS NULL LIMIT 1) IS NULL"
end

function M.fence_position(row: table): table
    return { completed_at = row.completed_at, thread_id = row.thread_id }
end

-- Select the bounded window before probing eligibility. The final examined key
-- belongs to the scan even when none of its rows satisfies the probe.
function M.completed_window(db: any, dbtype: string, limit: integer, after: table?, cutoff: string?): (any, error?)
    local source = thread_fence.TABLE
    if dbtype == sql.type.SQLITE then source = source .. " INDEXED BY idx_job_cleanup_completed_order" end
    local predicate, params = "completed_at IS NOT NULL", {}
    if cutoff then
        params[1] = cutoff
        predicate = predicate .. " AND completed_at < $1"
    end
    if after and after.thread_id then
        local key = #params + 1
        predicate = predicate .. " AND (completed_at,thread_id) > ($" .. key .. ",$" .. (key + 1) .. ")"
        params[key], params[key + 1] = after.completed_at, after.thread_id
    end
    params[#params + 1] = limit
    local eligible = cutoff and M.completed_fence_clear("f.thread_id") or has_owned_rows("f.thread_id")
    return db:query("SELECT f.thread_id,f.completed_at,(" .. eligible .. ") AS eligible"
        .. " FROM (SELECT thread_id,completed_at FROM " .. source .. " WHERE " .. predicate
        .. " ORDER BY completed_at,thread_id LIMIT $" .. #params .. ") f ORDER BY f.completed_at,f.thread_id", params)
end

-- Reclaim owned jobs and runs under the fence that was found in the window.
function M.reclaim_completed(db: sql.DB, dbtype: string, limit: integer, after: table?): (integer?, error?, table?)
    local rows, read_err = M.completed_window(db, dbtype, limit, after)
    local window, window_err = sql_boundary.bounded_rows(rows, read_err, "completed cleanup leftover read failed",
        "owners.rows", 0, limit, response_error)
    if window_err or not window then return nil, window_err end
    local retry: table? = nil
    local total = 0
    for index, row in ipairs(window) do
        if type(row) ~= "table" or type(row.thread_id) ~= "string" or type(row.completed_at) ~= "string" then
            return nil, response_error("owners.key")
        end
        local thread_id = row.thread_id
        if row.eligible == true or row.eligible == 1 then
            local tx, begin_err = sql_boundary.begin(db, "completed cleanup leftover transaction failed", "transaction", response_error)
            if begin_err then return nil, begin_err end
            if not tx then return nil, response_error("transaction") end
            local fence, lock_err = thread_fence.lock_existing(tx, dbtype, thread_id)
            if lock_err then return nil, sql_boundary.rollback(tx, lock_err, "thread cleanup rollback failed") end
            if fence and fence.completed_at ~= nil then
                local result, run_err = run_page(tx, dbtype, thread_id, limit)
                if run_err then return nil, sql_boundary.rollback(tx, run_err, "thread cleanup rollback failed") end
                total = total + (result :: table).processed
                -- Resume before the first owner whose cleanup still needs a page.
                if not (result :: table).done and not retry then
                    retry = index > 1 and M.fence_position(window[index - 1]) or after or {}
                end
            end
            local _, commit_err = tx:commit()
            if commit_err then return nil, errors.wrap(commit_err, "completed cleanup leftover commit failed") end
        end
    end
    local last = window[#window]
    return total, nil, retry or (last and #window == limit and M.fence_position(last) or nil)
end

-- The caller holds the fence from page_tx or the standalone acknowledgment.
function M.ack_tx(tx: sql.Transaction, dbtype: string, thread_id: string, page_seq: integer,
        thread_done: boolean, skip_completion: boolean?): (boolean?, error?)
    local rows, read_err = tx:query("SELECT acknowledged_at,done FROM " .. RECEIPT
        .. " WHERE thread_id=$1 AND page_seq=$2", { thread_id, page_seq })
    if read_err then return nil, errors.wrap(read_err, "thread cleanup acknowledgment receipt read failed") end
    if type(rows) ~= "table" or not rows[1] then return nil, response_error("receipt.rows") end
    if thread_done and not (rows[1].done == true or rows[1].done == 1) then
        local unfinished = errors.new({ message = "unfinished thread cleanup page cannot complete its owner",
            kind = errors.CONFLICT, retryable = true })
        return nil, unfinished
    end
    if rows[1].acknowledged_at == nil then
        local result, update_err = tx:execute("UPDATE " .. RECEIPT
            .. " SET acknowledged_at=$1 WHERE thread_id=$2 AND page_seq=$3 AND acknowledged_at IS NULL",
            { clock.now(dbtype), thread_id, page_seq })
        if update_err then return nil, errors.wrap(update_err, "thread cleanup receipt acknowledgment failed") end
        local _, proof_err = affected(result, "thread cleanup receipt acknowledgment", 1)
        if proof_err then return nil, proof_err end
    end
    if thread_done and not skip_completion then
        local done = dbtype == sql.type.POSTGRES and true or 1
        local result, update_err = tx:execute("UPDATE kickside_job_thread_cleanup"
            .. " SET completed_at=$1 WHERE thread_id=$2"
            .. " AND started=$3", { clock.now(dbtype), thread_id, done })
        if update_err then return nil, errors.wrap(update_err, "thread cleanup completion stamp failed") end
        local _, proof_err = affected(result, "thread cleanup completion stamp", 1)
        if proof_err then return nil, proof_err end
    end
    return true, nil
end

function M.ack(db: sql.DB, dbtype: string, thread_id: string, page_seq: integer,
        thread_done: boolean): (boolean?, error?)
    local tx, begin_err = sql_boundary.begin(db, "thread cleanup acknowledgment transaction failed", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local fence, fence_err = thread_fence.lock_existing(tx, dbtype, thread_id)
    if fence_err then return nil, sql_boundary.rollback(tx, fence_err, "thread cleanup rollback failed") end
    local next_seq = fence and tonumber(fence.next_page_seq) or 0
    -- Older exact acknowledgments cannot change the current owner's fence.
    local skip_completion = not fence or not fence.started or page_seq + 1 < next_seq
    local result, err = M.ack_tx(tx, dbtype, thread_id, page_seq, thread_done, skip_completion)
    if err then return nil, sql_boundary.rollback(tx, err, "thread cleanup rollback failed") end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "thread cleanup acknowledgment commit failed") end
    return result, nil
end

return M
