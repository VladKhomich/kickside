local run_status = require("run_status")
-- Bounded owner-local retention. The Jobs worker pool supplies the exact
-- policy deadline; every delete remains in the Jobs persistence owner.
local M = {}
local sql = require("sql")
local time = require("time")
local cfg = require("config")
local clock = require("clock")
local thread_teardown = require("thread_teardown")
local sql_boundary = require("sql_boundary")
local thread_fence = require("thread_fence")

local function bounded(limit: integer?, maximum: integer): integer
    return math.max(0, math.min(maximum, limit or maximum))
end

local function response_error(field: string): error
    return errors.new({message = "retention response is invalid", kind = errors.INTERNAL,
        retryable = false, details = {code = "job_retention_response", field = field}})
end

local function affected(result: any, name: string, maximum: integer): (integer?, error?)
    return sql_boundary.bounded_row_count(result, nil, name, name .. ".count", maximum, response_error)
end

local function scope(thread_id: string?, first: integer, all_threads: boolean?): (string, { any })
    if all_threads == true then return "1=1", {} end
    if thread_id == nil then return "owner_kind <> 'thread'", {} end
    return "owner_kind = 'thread' AND owner_id = $" .. tostring(first), { thread_id }
end

local function placeholders(first: integer, n: integer): string
    local out: { string } = {}
    for i = 1, n do out[i] = "$" .. tostring(first + i - 1) end
    return table.concat(out, ",")
end

local function prelock_ids(tx: any, dbtype: string, table_name: string, ids: { string }): error?
    if dbtype ~= sql.type.POSTGRES then return nil end
    if #ids == 0 then return nil end
    local _, err = tx:query("SELECT id FROM " .. table_name .. " WHERE id IN ("
        .. placeholders(1, #ids) .. ") ORDER BY id FOR UPDATE", ids)
    if err then return errors.wrap(err, table_name .. " prune prelock") end
    return nil
end

local function prune_owned(db: any, thread_id: string?, cutoff: string, runs: boolean,
        limit: integer?, all_threads: boolean?, cursor: table?): (integer?, error?, table?)
    if limit == 0 then return 0, nil end
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local batch = bounded(limit, (policy :: any).retention_batch)
    if batch == 0 then return 0, nil end
    local dbtype, type_err = db:type()
    if type_err then return nil, errors.wrap(type_err, "job prune dialect") end
    local table_name = runs and "kickside_job_run" or "kickside_job"
    local settled = runs and run_status.terminal_predicate()
        or "status IN ('done','dead','cancelled')"
    local predicate, params = scope(thread_id, 1, all_threads)
    params[#params + 1] = cutoff
    local cutoff_arg = "$" .. tostring(#params)
    local key = dbtype == sql.type.SQLITE and all_threads == true and "rowid" or "id"
    local after = ""
    if not runs and cursor then
        params[#params + 1] = cursor.finished_at
        params[#params + 1] = cursor.key
        after = " AND (finished_at," .. key .. ") > ($" .. tostring(#params - 1)
            .. ",$" .. tostring(#params) .. ")"
    end
    params[#params + 1] = batch
    local limit_arg = "$" .. tostring(#params)
    local no_runs = runs and "" or " AND NOT EXISTS (SELECT 1 FROM kickside_job_run r WHERE r.job_id=kickside_job.id)"
    local cols = runs and "id,job_id,owner_kind,owner_id"
        or "id,owner_kind,owner_id,finished_at," .. key .. " AS retention_key"
    local source = table_name
    local ordered = "finished_at,id"
    if dbtype == sql.type.SQLITE and all_threads == true then
        -- The global ordered read stays bounded before planner statistics exist.
        ordered = "finished_at,rowid"
        source = source .. " INDEXED BY " .. (runs and "idx_job_run_global_retention" or "idx_job_global_retention")
    end
    local candidates = "SELECT " .. cols .. " FROM " .. source .. " WHERE " .. predicate
        .. " AND " .. settled .. " AND finished_at IS NOT NULL AND finished_at < " .. cutoff_arg
    local statement = candidates .. after .. " ORDER BY " .. ordered .. " LIMIT " .. limit_arg
    if not runs and cursor and dbtype == sql.type.SQLITE and all_threads == true then
        -- Separate the equal-timestamp suffix so SQLite seeks the implicit rowid
        -- instead of walking earlier ties to evaluate a tuple comparison.
        local stamp = "$" .. tostring(#params - 2)
        local row = "$" .. tostring(#params - 1)
        statement = candidates .. " AND finished_at = " .. stamp .. " AND rowid > " .. row
            .. " UNION ALL " .. candidates .. " AND finished_at > " .. stamp
            .. " ORDER BY finished_at,retention_key LIMIT " .. limit_arg
    end
    local rows, read_err = db:query(statement, params)
    if read_err then return nil, errors.wrap(read_err, "job prune candidates") end
    if type(rows) ~= "table" then return nil, response_error("candidates.rows") end
    if #rows == 0 then return 0, nil end
    local tx, begin_err = sql_boundary.begin(db, "job prune transaction", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local job_ids: { string } = {}
    local run_ids: { string } = {}
    local thread_ids: { string } = {}
    for _, row in ipairs(rows) do
        if row.owner_kind == "thread" then
            if type(row.owner_id) ~= "string" or row.owner_id == "" then
                return nil, sql_boundary.rollback(tx, response_error("candidates.owner"), "retention rollback failed")
            end
            thread_ids[#thread_ids + 1] = row.owner_id
        end
        if runs then
            job_ids[#job_ids + 1] = tostring(row.job_id)
            run_ids[#run_ids + 1] = tostring(row.id)
        else
            job_ids[#job_ids + 1] = tostring(row.id)
        end
    end
    -- Match claim/cleanup lock order before retiring any thread-owned row.
    -- A candidate may be gone after waiting; the bounded DELETE counts reality.
    if #thread_ids > 0 then
        local fences, fence_err = thread_fence.lock_many(tx, thread_ids)
        if fence_err then return nil, sql_boundary.rollback(tx, fence_err, "retention rollback failed") end
        if type(fences) ~= "table" then return nil, sql_boundary.rollback(tx,
            response_error("thread_fences"), "retention rollback failed") end
    end
    local job_lock_err = prelock_ids(tx, tostring(dbtype), "kickside_job", job_ids)
    if job_lock_err then return nil, sql_boundary.rollback(tx, job_lock_err, "retention rollback failed") end
    local run_lock_err = prelock_ids(tx, tostring(dbtype), "kickside_job_run", run_ids)
    if run_lock_err then return nil, sql_boundary.rollback(tx, run_lock_err, "retention rollback failed") end

    local args: { any } = { cutoff }
    for _, row in ipairs(rows) do args[#args + 1] = row.id end
    local delete_source = table_name
    local selected = "id IN (" .. placeholders(2, #rows) .. ")"
    if dbtype == sql.type.SQLITE then
        -- Selected rowids keep the DELETE off scans of every terminal row
        -- through the status index.
        delete_source = delete_source .. " NOT INDEXED"
        selected = "rowid IN (SELECT rowid FROM " .. table_name .. " WHERE " .. selected .. ")"
    end
    local deleted, delete_err = tx:execute("DELETE FROM " .. delete_source .. " WHERE finished_at < $1"
        .. " AND " .. settled .. " AND " .. selected .. no_runs, args)
    if delete_err then return nil, sql_boundary.rollback(tx, errors.wrap(delete_err, "job prune delete"), "retention rollback failed") end
    local total, proof_err = affected(deleted, "job prune delete", batch)
    if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "retention rollback failed") end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "job prune commit") end
    local next_cursor: table? = nil
    if not runs and #rows == batch then
        local last = rows[#rows]
        next_cursor = {finished_at = last.finished_at, key = last.retention_key}
    end
    return total :: integer, nil, next_cursor
end

function M.prune_runs(db: any, thread_id: string?, cutoff: string, limit: integer?,
        all_threads: boolean?): (integer?, error?)
    return prune_owned(db, thread_id, cutoff, true, limit, all_threads)
end

function M.prune_jobs(db: any, thread_id: string?, cutoff: string, limit: integer?,
        all_threads: boolean?, cursor: table?): (integer?, error?, table?)
    return prune_owned(db, thread_id, cutoff, false, limit, all_threads, cursor)
end

-- Worker identities are process-local; an absent heartbeat older than the
-- default jobs window cannot resume. The existing last_seen_at index bounds
-- candidate selection even after many process restarts.
local function prune_worker_pulses(db: any, cutoff: string, limit: integer?): (integer?, error?)
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local batch = math.min((policy :: any).retention_batch,
        math.max(1, math.floor(tonumber(limit) or (policy :: any).retention_batch)))
    local result, err = db:execute([[WITH expired AS (
        SELECT worker_id FROM kickside_job_worker_pulse WHERE last_seen_at < $1
        ORDER BY last_seen_at LIMIT $2
    ) DELETE FROM kickside_job_worker_pulse WHERE worker_id IN (SELECT worker_id FROM expired)
      AND last_seen_at < $1]], {cutoff, batch})
    if err then return nil, errors.wrap(err, "stale worker heartbeats") end
    return affected(result, "stale worker heartbeats", batch)
end

function M.prune_workers(db: any, cutoff: string, limit: integer?): (integer?, error?)
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local batch = math.min((policy :: any).retention_batch,
        math.max(1, math.floor(tonumber(limit) or (policy :: any).retention_batch)))
    local dbtype, type_err = db:type()
    if type_err then return nil, errors.wrap(type_err, "stale worker dialect") end
    local eligibility = "last_seen_at < $1 AND NOT EXISTS (SELECT 1 FROM kickside_job_worker_pulse p"
        .. " WHERE p.worker_id=kickside_job_worker.id AND p.last_seen_at >= $1)"
    local rows, read_err = db:query("SELECT id FROM kickside_job_worker WHERE " .. eligibility
        .. " ORDER BY last_seen_at LIMIT $2", {cutoff, batch})
    if read_err then return nil, errors.wrap(read_err, "stale worker selection") end
    if type(rows) ~= "table" then return nil, response_error("candidates.rows") end
    if #rows == 0 then return 0, nil end
    local tx, begin_err = sql_boundary.begin(db, "stale worker prune begin", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local args: {any} = {cutoff}
    local worker_ids: {string} = {}
    for _, row in ipairs(rows) do
        args[#args + 1] = row.id
        worker_ids[#worker_ids + 1] = row.id
    end
    local lock_err = prelock_ids(tx, tostring(dbtype), "kickside_job_worker", worker_ids)
    if lock_err then return nil, sql_boundary.rollback(tx, lock_err, "retention rollback failed") end
    -- Registration locks worker then pulse. Recheck pulse age under its
    -- write lock so a heartbeat that renews after selection stays live.
    local ids = " IN (" .. placeholders(2, #rows) .. ")"
    local pulses, pulse_err = tx:execute("DELETE FROM kickside_job_worker_pulse WHERE last_seen_at < $1 AND worker_id" .. ids, args)
    if pulse_err then return nil, sql_boundary.rollback(tx,
        errors.wrap(pulse_err, "stale worker pulse delete"), "retention rollback failed") end
    local _, proof_err = affected(pulses, "stale worker pulse delete", batch)
    if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "retention rollback failed") end
    local workers, worker_err = tx:execute("DELETE FROM kickside_job_worker WHERE " .. eligibility .. " AND id" .. ids, args)
    if worker_err then return nil, sql_boundary.rollback(tx,
        errors.wrap(worker_err, "stale worker delete"), "retention rollback failed") end
    local total, count_err = affected(workers, "stale worker delete", batch)
    if count_err then return nil, sql_boundary.rollback(tx, count_err, "retention rollback failed") end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "stale worker prune commit") end
    return total, nil
end

-- A wake row has no deliverable demand after its last pending/running
-- subscriber leaves. An unacknowledged generation with no subscriber and no
-- continuation has no recovery target; keeping it would leak one row per key.
function M.prune_wake_fanout(db: any, limit: integer?): (integer?, error?)
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local batch = math.min((policy :: any).retention_batch,
        math.max(1, math.floor(tonumber(limit) or (policy :: any).retention_batch)))
    local dbtype, type_err = db:type()
    if type_err then return nil, errors.wrap(type_err, "orphan wake dialect") end
    -- A wake publisher locks the same row before it can queue its continuation.
    -- Skip rows it owns so a stale candidate snapshot cannot delete new demand.
    local lock = dbtype == sql.type.POSTGRES and " FOR UPDATE OF f SKIP LOCKED" or ""
    local result, err = db:execute([[WITH expired AS (
        SELECT f.key FROM kickside_wake_fanout f
        WHERE NOT EXISTS (SELECT 1 FROM kickside_job j WHERE j.wake_key = f.key
            AND j.status IN ('pending','running'))
        ORDER BY f.key LIMIT $1]] .. lock .. [[
    ) DELETE FROM kickside_wake_fanout WHERE key IN (SELECT key FROM expired)
      AND NOT EXISTS (SELECT 1 FROM kickside_job j
        WHERE j.wake_key = kickside_wake_fanout.key
          AND j.status IN ('pending','running'))]], { batch })
    if err then return nil, errors.wrap(err, "orphan wake rows") end
    return affected(result, "orphan wake rows", batch)
end

local function days_before(dbtype: string, duration_ms: integer): string
    return clock.format(time.now():add(-duration_ms * time.MILLISECOND), dbtype)
end

local function prune_thread_cleanup_receipts(db: any, cutoff: string, limit: integer,
        dbtype: string): (integer?, error?)
    local tx, begin_err = sql_boundary.begin(db, "thread cleanup receipt prune begin failed", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local lock = dbtype == sql.type.POSTGRES and " FOR UPDATE SKIP LOCKED" or ""
    local rows, read_err = tx:query("SELECT thread_id,page_seq FROM kickside_job_thread_cleanup_receipt"
        .. " WHERE acknowledged_at IS NOT NULL AND acknowledged_at < $1"
        .. " ORDER BY acknowledged_at,thread_id,page_seq LIMIT $2" .. lock, { cutoff, limit })
    if read_err then return nil, sql_boundary.rollback(tx,
        errors.wrap(read_err, "thread cleanup receipt prune selection failed"), "retention rollback failed") end
    if type(rows) ~= "table" then return nil, sql_boundary.rollback(tx,
        response_error("candidates.rows"), "retention rollback failed") end
    local total = 0
    for _, row in ipairs(rows) do
        local result, delete_err = tx:execute([[DELETE FROM kickside_job_thread_cleanup_receipt
            WHERE thread_id=$1 AND page_seq=$2 AND acknowledged_at IS NOT NULL AND acknowledged_at < $3]],
            { row.thread_id, row.page_seq, cutoff })
        if delete_err then return nil, sql_boundary.rollback(tx, errors.wrap(delete_err, "thread cleanup receipt prune delete failed"), "retention rollback failed") end
        local count, proof_err = affected(result, "thread cleanup receipt prune", 1)
        if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "retention rollback failed") end
        total = total + (count :: integer)
    end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "thread cleanup receipt prune commit failed") end
    return total, nil
end

local UNUSED_FENCE = "started=FALSE AND next_page_seq=0 AND completed_at IS NULL"
local FENCE_EMPTY = [[
    (SELECT 1 FROM kickside_job_thread_cleanup_receipt r
        WHERE r.thread_id=f.thread_id AND r.acknowledged_at IS NULL LIMIT 1) IS NULL
    AND (SELECT 1 FROM kickside_job j WHERE j.owner_kind='thread' AND j.owner_id=f.thread_id LIMIT 1) IS NULL
    AND (SELECT 1 FROM kickside_job_run r WHERE r.owner_kind='thread' AND r.owner_id=f.thread_id LIMIT 1) IS NULL]]

local function unused_fence_predicate(db: sql.DB, dbtype: string): (string?, error?)
    local postgres = dbtype == sql.type.POSTGRES
    -- Jobs can run without the Core schema.
    local statement = postgres and "SELECT to_regclass('kickside_thread') IS NOT NULL AS present"
        or "SELECT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='kickside_thread') AS present"
    local rows, err = db:query(statement)
    if err then return nil, errors.wrap(err, "thread cleanup owner schema lookup failed") end
    if type(rows) ~= "table" or not rows[1] then return nil, response_error("thread_schema.rows") end
    local present = rows[1].present
    if present == false or present == 0 then return FENCE_EMPTY, nil end
    if present ~= true and present ~= 1 then return nil, response_error("thread_schema.present") end
    local id = thread_fence.owner_key(dbtype, "f.thread_id")
    return "(SELECT 1 FROM kickside_thread t WHERE t.id=" .. id .. " LIMIT 1) IS NULL AND " .. FENCE_EMPTY, nil
end

local function prune_fences(db: sql.DB, dbtype: string, limit: integer, after: any,
        eligible: string, cutoff: string?): (integer?, error?, any)
    local source = thread_fence.TABLE
    if dbtype == sql.type.SQLITE then
        source = source .. " INDEXED BY " .. (cutoff and "idx_job_cleanup_completed_order" or "idx_job_cleanup_unused_fence")
    end
    local predicate = cutoff and "completed_at IS NOT NULL AND completed_at < $1" or UNUSED_FENCE
    local keys = cutoff and {"completed_at", "thread_id"} or {"thread_id"}
    local rows, read_err, position = thread_fence.ordered_window(db, source, "f", keys, predicate,
        eligible, after, cutoff and {"", ""} or {""}, limit, cutoff and {cutoff} or nil)
    if read_err then return nil, errors.wrap(read_err, "thread cleanup fence prune selection failed") end
    if not rows then return nil, response_error("candidates.rows") end
    local total = 0
    for _, row in ipairs(rows) do
        local tx, begin_err = sql_boundary.begin(db, "thread cleanup fence prune begin failed", "transaction", response_error)
        if begin_err or not tx then return nil, begin_err end
        local fence, lock_err = thread_fence.lock_existing(tx, dbtype, row.thread_id)
        if lock_err then return nil, sql_boundary.rollback(tx, lock_err, "retention rollback failed") end
        if fence then
            local deleted, delete_err = tx:execute("DELETE FROM " .. thread_fence.TABLE
                .. " AS f WHERE " .. predicate .. " AND f.thread_id=" .. (cutoff and "$2" or "$1")
                .. " AND " .. eligible, cutoff and {cutoff, row.thread_id} or {row.thread_id})
            local count, proof_err = sql_boundary.single_row_count(deleted, delete_err,
                "thread cleanup fence prune", "fence.count", response_error)
            if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "retention rollback failed") end
            total = total + (count :: integer)
        end
        local _, commit_err = tx:commit()
        if commit_err then return nil, errors.wrap(commit_err, "thread cleanup fence prune commit failed") end
    end
    return total, nil, position
end

-- One bounded pass over each Jobs-owned retained table. Full batch counts
-- keep the worker pool retention deadline due until the backlog drains.
function M.sweep(db: any, dbtype: string, cursor: table?, cleanup_cursors: table?): (table?, error?)
    local positions = cleanup_cursors or {}
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local batch = (policy :: any).retention_batch :: integer
    local job_cutoff = days_before(dbtype, (policy :: any).retention_jobs_ms)
    local run_cutoff = days_before(dbtype, (policy :: any).retention_job_runs_ms)
    -- Jobs retain their runs, so skip the index range still protected by
    -- either window before checking for remaining runs.
    local job_candidate_cutoff = job_cutoff < run_cutoff and job_cutoff or run_cutoff
    local receipt_cutoff = days_before(dbtype, (policy :: any).retention_thread_cleanup_receipts_ms)
    local runs: integer? = 0
    if not cursor then
        local runs_err: error?
        runs, runs_err = M.prune_runs(db, nil, run_cutoff, batch, true)
        if runs_err then return nil, runs_err end
    end
    local jobs: integer? = 0
    local job_cursor: table? = nil
    if runs < batch then
        local jobs_err: error?
        jobs, jobs_err, job_cursor = M.prune_jobs(db, nil, job_candidate_cutoff, batch, true, cursor)
        if jobs_err then return nil, jobs_err end
    end
    -- Keep run deletion between complete job rounds: unblocking an earlier
    -- job cannot restart a round that still has later candidates to examine.
    if cursor and not job_cursor then
        local runs_err: error?
        runs, runs_err = M.prune_runs(db, nil, run_cutoff, batch, true)
        if runs_err then return nil, runs_err end
    end
    local workers, workers_err = M.prune_workers(db, job_cutoff, batch)
    if workers_err then return nil, workers_err end
    local pulses, pulses_err = prune_worker_pulses(db, job_cutoff, batch)
    if pulses_err then return nil, pulses_err end
    local wake_rows, wake_err = M.prune_wake_fanout(db, batch)
    if wake_err then return nil, wake_err end
    local cleanup_receipts, receipts_err = prune_thread_cleanup_receipts(db, receipt_cutoff, batch, dbtype)
    if receipts_err then return nil, receipts_err end
    local leftovers, leftovers_err, completed_position = thread_teardown.reclaim_completed(
        db, dbtype, (policy :: any).thread_cleanup_batch, positions.completed)
    if leftovers_err then return nil, leftovers_err end
    local cleanup_fences, fences_err, expired_position = prune_fences(
        db, dbtype, batch, positions.expired, FENCE_EMPTY, receipt_cutoff)
    if fences_err then return nil, fences_err end
    local unused, schema_err = unused_fence_predicate(db, dbtype)
    if schema_err then return nil, schema_err end
    local unused_fences, unused_err, unused_position = prune_fences(db, dbtype, batch, positions.unused, unused)
    if unused_err then return nil, unused_err end
    return {
        jobs = jobs :: integer, job_runs = runs :: integer, job_cursor = job_cursor,
        workers = workers :: integer, worker_pulses = pulses :: integer, wake_rows = wake_rows :: integer,
        thread_cleanup_receipts = cleanup_receipts :: integer,
        thread_cleanup_fences = (cleanup_fences :: integer) + (unused_fences :: integer),
        thread_cleanup_leftovers = leftovers :: integer,
        thread_cleanup_cursors = {unused = unused_position, completed = completed_position, expired = expired_position},
    }, nil
end

return M
