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
local dead_outcome = require("dead_outcome")

local no_live_outcome = [[ AND (status <> 'dead' OR (SELECT 1 FROM kickside_job outcome
    WHERE outcome.status IN ('pending','running') AND outcome.job_identity=]]
    .. dead_outcome.identity_sql("kickside_job.id") .. [[) IS NULL)]]

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
        limit: integer?, all_threads: boolean?, cursor: table?, job_type: string?): (integer?, error?, table?, integer?)
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
    if job_type ~= nil then
        params[#params + 1] = job_type
        predicate = predicate .. " AND job_type = $" .. tostring(#params)
    end
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
    local unreferenced = runs and ""
        or " AND NOT EXISTS (SELECT 1 FROM kickside_job_run r WHERE r.job_id=kickside_job.id)" .. no_live_outcome
    local cols = runs and "id,job_id,owner_kind,owner_id"
        or "id,owner_kind,owner_id,finished_at," .. key .. " AS retention_key"
    local source = table_name
    local ordered = "finished_at,id"
    if dbtype == sql.type.SQLITE and all_threads == true then
        -- The global ordered read stays bounded before planner statistics exist.
        ordered = "finished_at,rowid"
        local index = job_type ~= nil and "type_retention" or "global_retention"
        source = source .. " INDEXED BY " .. (runs and "idx_job_run_" or "idx_job_") .. index
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
    local thread_ids: { string } = {}
    for _, row in ipairs(rows) do
        if row.owner_kind == "thread" then
            if type(row.owner_id) ~= "string" or row.owner_id == "" then
                return nil, sql_boundary.rollback(tx, response_error("candidates.owner"), "retention rollback failed")
            end
            thread_ids[#thread_ids + 1] = row.owner_id
        end
    end
    -- Match claim/cleanup lock order before retiring any thread-owned row.
    -- A candidate may be gone after waiting; the bounded DELETE counts reality.
    local fences: { [string]: table } = {}
    if #thread_ids > 0 then
        local locked, fence_err = thread_fence.lock_many(tx, thread_ids)
        if fence_err then return nil, sql_boundary.rollback(tx, fence_err, "retention rollback failed") end
        if type(locked) ~= "table" then return nil, sql_boundary.rollback(tx,
            response_error("thread_fences"), "retention rollback failed") end
        fences = locked
    end
    local job_ids: { string } = {}
    local run_ids: { string } = {}
    for _, row in ipairs(rows) do
        -- Reclamation uses owned rows to discover completed threads and drain
        -- surviving links. Ordinary expiry must leave those rows to that page.
        local fence = row.owner_kind == "thread" and fences[row.owner_id] or nil
        if not fence or fence.completed_at == nil then
            if runs then
                job_ids[#job_ids + 1] = tostring(row.job_id)
                run_ids[#run_ids + 1] = tostring(row.id)
            else
                job_ids[#job_ids + 1] = tostring(row.id)
            end
        end
    end
    local ids = runs and run_ids or job_ids
    local total: integer? = 0
    if #ids > 0 then
        local job_lock_err = prelock_ids(tx, tostring(dbtype), "kickside_job", job_ids)
        if job_lock_err then return nil, sql_boundary.rollback(tx, job_lock_err, "retention rollback failed") end
        local run_lock_err = prelock_ids(tx, tostring(dbtype), "kickside_job_run", run_ids)
        if run_lock_err then return nil, sql_boundary.rollback(tx, run_lock_err, "retention rollback failed") end

        local args: { any } = { cutoff }
        for _, id in ipairs(ids) do args[#args + 1] = id end
        local delete_source = table_name
        local selected = "id IN (" .. placeholders(2, #ids) .. ")"
        if dbtype == sql.type.SQLITE then
            -- Resolve the bounded selection to rowids rather than scanning the status index.
            delete_source = delete_source .. " NOT INDEXED"
            selected = "rowid IN (SELECT rowid FROM " .. table_name .. " WHERE " .. selected .. ")"
        end
        local deleted, delete_err = tx:execute("DELETE FROM " .. delete_source .. " WHERE finished_at < $1"
            .. " AND " .. settled .. " AND " .. selected .. unreferenced, args)
        if delete_err then return nil, sql_boundary.rollback(tx, errors.wrap(delete_err, "job prune delete"), "retention rollback failed") end
        local proof_err: error?
        total, proof_err = affected(deleted, "job prune delete", #ids)
        if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "retention rollback failed") end
    end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "job prune commit") end
    local next_cursor: table? = nil
    if not runs and #rows == batch then
        local last = rows[#rows]
        next_cursor = {finished_at = last.finished_at, key = last.retention_key}
    end
    return total :: integer, nil, next_cursor, #rows
end

function M.prune_runs(db: any, thread_id: string?, cutoff: string, limit: integer?,
        all_threads: boolean?): (integer?, error?)
    local count, err = prune_owned(db, thread_id, cutoff, true, limit, all_threads)
    return count, err
end

function M.prune_jobs(db: any, thread_id: string?, cutoff: string, limit: integer?,
        all_threads: boolean?, cursor: table?): (integer?, error?, table?)
    local count, err, next_cursor = prune_owned(db, thread_id, cutoff, false, limit, all_threads, cursor)
    return count, err, next_cursor
end

-- Worker identities are process-local; a worker whose heartbeat is older than
-- the lease timeout is not live (the window jobs.health reports) and cannot
-- resume. The existing last_seen_at index bounds
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

local function before(dbtype: string, duration_ms: integer): string
    return clock.format(time.now():add(-duration_ms * time.MILLISECOND), dbtype)
end

-- Use a bounded, ordered merge of the heads of the two type-leading indexes.
-- A running job may have settled runs even when its type has no settled jobs.
local function settled_types(db: any, dbtype: string, first_type: string?, limit: integer): ({ string }?, error?)
    local job_source = "kickside_job"
    local run_source = "kickside_job_run"
    if dbtype == sql.type.SQLITE then
        job_source = job_source .. " INDEXED BY idx_job_type_retention"
        run_source = run_source .. " INDEXED BY idx_job_run_type_retention"
    end
    local function first_in_either(qualifier: string): string
        return "(SELECT MIN(head) FROM ("
            .. "SELECT MIN(job_type) AS head FROM " .. job_source
            .. " WHERE status IN ('done','dead','cancelled') AND finished_at IS NOT NULL" .. qualifier
            .. " UNION ALL SELECT MIN(job_type) FROM " .. run_source
            .. " WHERE " .. run_status.terminal_predicate() .. " AND finished_at IS NOT NULL" .. qualifier
            .. ") heads)"
    end
    local start = first_type and " AND job_type >= $1" or ""
    local limit_arg = first_type and "$2" or "$1"
    local params = first_type and {first_type, limit} or {limit}
    local rows, err = db:query("WITH RECURSIVE types(job_type,step) AS ("
        .. "SELECT " .. first_in_either(start) .. ",1 UNION ALL SELECT "
        .. first_in_either(" AND job_type > types.job_type")
        .. ",step+1 FROM types WHERE job_type IS NOT NULL AND step < " .. limit_arg
        .. ") SELECT job_type FROM types WHERE job_type IS NOT NULL ORDER BY step", params)
    if err then return nil, errors.wrap(err, "job prune types") end
    if type(rows) ~= "table" or #rows > limit then return nil, response_error("types.rows") end
    local types: { string } = {}
    for _, row in ipairs(rows) do
        if type(row.job_type) ~= "string" or row.job_type == "" then return nil, response_error("types.job_type") end
        types[#types + 1] = row.job_type
    end
    return types, nil
end

-- Jobs and their runs share a type. Finish the run pass for a type before
-- deleting its jobs. A cursor names either the next type or a partially
-- visited job page. The row budgets and type-page budget each bound one sweep.
local function prune_by_type(db: any, dbtype: string, policy: any, cursor: table?): (integer?, integer?, table?, error?)
    local batch = policy.retention_batch :: integer
    local type_page = math.min(batch, 64)
    local types, types_err = settled_types(db, dbtype, cursor and cursor.job_type, type_page + 1)
    if types_err or not types then return nil, nil, nil, types_err end

    local global = {jobs_ms = policy.retention_jobs_ms, job_runs_ms = policy.retention_job_runs_ms}
    local jobs, runs = 0, 0
    local jobs_budget, runs_budget = batch, batch
    for index = 1, math.min(#types, type_page) do
        local job_type = types[index]
        local window = policy.retention_by_type[job_type] or global
        local after = cursor and cursor.job_type == job_type and cursor.key ~= nil and cursor or nil
        if not after then
            local count, err, _, selected = prune_owned(db, nil, before(dbtype, window.job_runs_ms),
                true, runs_budget, true, nil, job_type)
            if err then return nil, nil, nil, err end
            runs = runs + (count :: integer)
            runs_budget = runs_budget - (selected or 0)
        end

        local cutoff = before(dbtype, math.max(window.jobs_ms, window.job_runs_ms))
        local count, err, next_cursor, selected = prune_owned(db, nil, cutoff,
            false, jobs_budget, true, after, job_type)
        if err then return nil, nil, nil, err end
        jobs = jobs + (count :: integer)
        if runs_budget == 0 then
            -- A full run page cannot claim the next turn. Start with the
            -- following type, or wrap so a full page in the last type drains.
            return jobs, runs, {job_type = types[index + 1] or ""}, nil
        end
        if next_cursor then
            next_cursor.job_type = job_type
            return jobs, runs, next_cursor, nil
        end
        jobs_budget = jobs_budget - (selected or 0)
    end
    local next_type = types[type_page + 1]
    return jobs, runs, next_type and {job_type = next_type} or nil, nil
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

local function prune_completed_thread_fences(db: any, cutoff: string, limit: integer,
        dbtype: string): (integer?, error?)
    local tx, begin_err = sql_boundary.begin(db, "thread cleanup fence prune begin failed", "transaction", response_error)
    if begin_err then return nil, begin_err end
    if not tx then return nil, response_error("transaction") end
    local lock = dbtype == sql.type.POSTGRES and " FOR UPDATE SKIP LOCKED" or ""
    local rows, read_err = tx:query([[SELECT f.thread_id FROM kickside_job_thread_cleanup f
        WHERE f.completed_at < $1
          AND NOT EXISTS (SELECT 1 FROM kickside_job_thread_cleanup_receipt r
              WHERE r.thread_id=f.thread_id AND r.acknowledged_at IS NULL)
          AND NOT EXISTS (SELECT 1 FROM kickside_job j WHERE j.owner_kind='thread' AND j.owner_id=f.thread_id)
          AND NOT EXISTS (SELECT 1 FROM kickside_job_run r WHERE r.owner_kind='thread' AND r.owner_id=f.thread_id)
        ORDER BY f.completed_at,f.thread_id LIMIT $2]] .. lock, { cutoff, limit })
    if read_err then return nil, sql_boundary.rollback(tx,
        errors.wrap(read_err, "thread cleanup fence prune selection failed"), "retention rollback failed") end
    if type(rows) ~= "table" then return nil, sql_boundary.rollback(tx,
        response_error("candidates.rows"), "retention rollback failed") end
    local total = 0
    for _, row in ipairs(rows) do
        local result, delete_err = tx:execute([[DELETE FROM kickside_job_thread_cleanup
            WHERE thread_id=$1 AND completed_at < $2
              AND NOT EXISTS (SELECT 1 FROM kickside_job_thread_cleanup_receipt r
                  WHERE r.thread_id=$1 AND r.acknowledged_at IS NULL)]], { row.thread_id, cutoff })
        if delete_err then return nil, sql_boundary.rollback(tx, errors.wrap(delete_err, "thread cleanup fence prune delete failed"), "retention rollback failed") end
        local count, proof_err = affected(result, "thread cleanup fence prune", 1)
        if proof_err then return nil, sql_boundary.rollback(tx, proof_err, "retention rollback failed") end
        total = total + (count :: integer)
    end
    local _, commit_err = tx:commit()
    if commit_err then return nil, errors.wrap(commit_err, "thread cleanup fence prune commit failed") end
    return total, nil
end

-- One bounded pass over each Jobs-owned retained table. Full batch counts
-- keep the worker pool retention deadline due until the backlog drains.
function M.sweep(db: any, dbtype: string, cursor: table?, completed_fence_cursor: table | boolean | nil): (table?, error?)
    local policy, policy_err = cfg.policy()
    if policy_err or not policy then return nil, policy_err end
    local batch = (policy :: any).retention_batch :: integer
    local receipt_cutoff = before(dbtype, (policy :: any).retention_thread_cleanup_receipts_ms)
    local liveness_seconds = cfg.worker_liveness(policy)
    local liveness_cutoff = before(dbtype, liveness_seconds * 1000)
    local per_type = next((policy :: any).retention_by_type) ~= nil
    if cursor and per_type ~= (cursor.job_type ~= nil) then cursor = nil end
    local runs: integer? = 0
    local jobs: integer? = 0
    local job_cursor: table? = nil
    if per_type then
        local history_err: error?
        jobs, runs, job_cursor, history_err = prune_by_type(db, dbtype, policy, cursor)
        if history_err then return nil, history_err end
    else
        local run_cutoff = before(dbtype, (policy :: any).retention_job_runs_ms)
        if not cursor then
            local runs_err: error?
            runs, runs_err = M.prune_runs(db, nil, run_cutoff, batch, true)
            if runs_err then return nil, runs_err end
        end
        if runs < batch then
            -- A job stays retained while either window protects its history.
            local job_candidate_cutoff = before(dbtype, math.max((policy :: any).retention_jobs_ms,
                (policy :: any).retention_job_runs_ms))
            local jobs_err: error?
            jobs, jobs_err, job_cursor = M.prune_jobs(db, nil, job_candidate_cutoff, batch, true, cursor)
            if jobs_err then return nil, jobs_err end
        end
        -- Keep run deletion between complete job rounds: unblocking an
        -- earlier job cannot restart a round with candidates still ahead.
        if cursor and not job_cursor then
            local runs_err: error?
            runs, runs_err = M.prune_runs(db, nil, run_cutoff, batch, true)
            if runs_err then return nil, runs_err end
        end
    end
    local workers, workers_err = M.prune_workers(db, liveness_cutoff, batch)
    if workers_err then return nil, workers_err end
    local pulses, pulses_err = prune_worker_pulses(db, liveness_cutoff, batch)
    if pulses_err then return nil, pulses_err end
    local wake_rows, wake_err = M.prune_wake_fanout(db, batch)
    if wake_err then return nil, wake_err end
    local cleanup_receipts, receipts_err = prune_thread_cleanup_receipts(db, receipt_cutoff, batch, dbtype)
    if receipts_err then return nil, receipts_err end
    local leftovers: integer? = 0
    local next_completed_fence_cursor: table? = nil
    if completed_fence_cursor ~= false then
        local leftovers_err: error?
        leftovers, leftovers_err, next_completed_fence_cursor = thread_teardown.reclaim_completed(
            db, dbtype, (policy :: any).thread_cleanup_batch, completed_fence_cursor :: table?)
        if leftovers_err then return nil, leftovers_err end
    end
    local cleanup_fences, fences_err = prune_completed_thread_fences(db, receipt_cutoff, batch, dbtype)
    if fences_err then return nil, fences_err end
    return {
        jobs = jobs :: integer, job_runs = runs :: integer, job_cursor = job_cursor,
        workers = workers :: integer, worker_pulses = pulses :: integer, wake_rows = wake_rows :: integer,
        thread_cleanup_receipts = cleanup_receipts :: integer,
        thread_cleanup_fences = cleanup_fences :: integer,
        thread_cleanup_leftovers = leftovers :: integer,
        completed_fence_cursor = next_completed_fence_cursor,
    }, nil
end

return M
