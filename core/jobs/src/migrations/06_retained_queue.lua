-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The published 04 and 19 receipts identify multiple physical schemas.
-- Boot owns the transaction. Old workers and enqueue writers must be stopped.
local sql = require("retained_sql")
local sqlite = require("retained_sqlite")
local postgres = require("retained_postgres")

local function columns(db, pg, name)
    local rows
    if pg then
        rows = sql.rows(db, [[SELECT attname AS name,attnotnull AS required FROM pg_attribute
            WHERE attrelid=to_regclass(']] .. name .. [[') AND attnum>0 AND NOT attisdropped]])
    else
        rows = sql.rows(db, "SELECT name,\"notnull\" AS required FROM pragma_table_info('" .. name .. "')")
    end
    local result = {}
    for _, row in ipairs(rows) do result[row.name] = row.required == true or tonumber(row.required) == 1 end
    return result
end

local function indexes(db)
    local statements = {
        [[CREATE UNIQUE INDEX uq_kickside_job_active_identity ON kickside_job(job_identity) WHERE status IN ('pending','running')]],
        [[CREATE INDEX idx_kickside_job_due_tier ON kickside_job(queue_tier,scheduled_at,id) WHERE status='pending' AND scheduled_at IS NOT NULL]],
        [[CREATE INDEX idx_kickside_job_wake_key ON kickside_job(wake_key,id) WHERE status IN ('pending','running') AND wake_enabled]],
        [[CREATE INDEX idx_kickside_job_wake_remaining ON kickside_job(wake_key,wake_generation,id) WHERE status IN ('pending','running') AND wake_enabled]],
        [[CREATE INDEX idx_kickside_job_wake_subscriber ON kickside_job(wake_key,id) WHERE status IN ('pending','running') AND wake_key IS NOT NULL]],
        [[CREATE INDEX idx_job_owner_scope ON kickside_job(owner_kind,owner_id,id)]],
        [[CREATE INDEX idx_job_run_owner_scope ON kickside_job_run(owner_kind,owner_id,id)]],
        [[CREATE INDEX idx_kickside_job_retention ON kickside_job(thread_id,finished_at,id)
          WHERE status IN ('done','dead','cancelled') AND finished_at IS NOT NULL]],
    }
    for _, statement in ipairs(statements) do sql.exec(db, statement) end
end

local function retention(db, pg)
    -- The same database has the historical Core source. Leave both its rows and
    -- the effect/cursor graph intact. Missing source columns abort the transaction.
    sql.exec(db, "CREATE TABLE kickside_job_retention_policy (thread_id " .. (pg and "uuid" or "text")
        .. " PRIMARY KEY,job_retention_days integer NOT NULL,job_run_retention_days integer NOT NULL,"
        .. "effect_retention_days integer NOT NULL,enabled " .. (pg and "boolean" or "integer") .. " NOT NULL)")
    sql.exec(db, [[INSERT INTO kickside_job_retention_policy(thread_id,job_retention_days,job_run_retention_days,effect_retention_days,enabled)
        SELECT thread_id,job_retention_days,job_run_retention_days,effect_retention_days,enabled FROM kickside_retention_policy]])
    sql.exec(db, [[CREATE INDEX idx_kickside_effect_intent_retention ON kickside_effect_intent(thread_id,finished_at,id)
        WHERE status IN ('done','dead') AND finished_at IS NOT NULL]])
end

local function cleanup(db, pg)
    -- Old 19 stored the fence in the owner's usage row. Page receipts already
    -- have their current identity and payload. Retention may have pruned earlier pages.
    sql.require_empty(db, [[SELECT owner_id AS id FROM kickside_job_owner_usage WHERE
        (thread_cleanup_started OR thread_cleanup_next_page_seq<>0 OR thread_cleanup_completed_at IS NOT NULL)
        AND (owner_kind<>'thread' OR owner_id='' OR NOT thread_cleanup_started OR thread_cleanup_next_page_seq<0) LIMIT 1]],
        "unprovable historical cleanup owner")
    sql.require_empty(db, [[SELECT r.thread_id AS id FROM kickside_job_thread_cleanup_receipt r
        WHERE NOT EXISTS (SELECT 1 FROM kickside_job_owner_usage u
            WHERE u.owner_kind='thread' AND u.owner_id=r.thread_id AND u.thread_cleanup_started
              AND r.page_seq<u.thread_cleanup_next_page_seq) LIMIT 1]], "cleanup receipt disagrees with its thread usage row")
    sql.exec(db, "CREATE TABLE kickside_job_thread_cleanup (thread_id text PRIMARY KEY,started "
        .. (pg and "boolean NOT NULL DEFAULT false" or "integer NOT NULL DEFAULT 0")
        .. ",next_page_seq bigint NOT NULL DEFAULT 0 CHECK(next_page_seq>=0),completed_at text)")
    sql.exec(db, [[INSERT INTO kickside_job_thread_cleanup(thread_id,started,next_page_seq,completed_at)
        SELECT owner_id,thread_cleanup_started,thread_cleanup_next_page_seq,thread_cleanup_completed_at
        FROM kickside_job_owner_usage WHERE owner_kind='thread']])
end

local function adopt(db, pg)
    local job = columns(db, pg, "kickside_job")
    local run = columns(db, pg, "kickside_job_run")
    local oldest = job.job_identity == nil
    if job.id == nil or run.id == nil or (job.owner_kind == nil) ~= oldest or
        (job.owner_id == nil) ~= oldest or (run.owner_kind == nil) ~= oldest or
        (run.owner_id == nil) ~= oldest or (job.execution_seq == nil) ~= oldest or (run.execution_seq == nil) ~= oldest then
        sql.refuse("unrecognized job/run layout")
    end
    local usage = columns(db, pg, "kickside_job_owner_usage")
    local old_cleanup = usage.thread_cleanup_started ~= nil and columns(db, pg, "kickside_job_thread_cleanup").thread_id == nil
    local nullable = not oldest and not (job.owner_kind and job.owner_id and run.owner_kind and run.owner_id)
    if not oldest and not old_cleanup and not nullable then return end

    if pg then
        sql.exec(db, "LOCK TABLE kickside_thread,kickside_job,kickside_job_run IN ACCESS EXCLUSIVE MODE NOWAIT")
        if old_cleanup then sql.exec(db, "LOCK TABLE kickside_job_owner_usage,kickside_job_thread_cleanup_receipt IN ACCESS EXCLUSIVE MODE NOWAIT") end
    else
        sql.exec(db, "UPDATE kickside_job SET id=id WHERE 0")
    end
    local invalid_lease = pg and "lease_until>=CURRENT_TIMESTAMP"
        or "julianday(lease_until) IS NULL OR julianday(lease_until)>=julianday('now')"
    sql.require_empty(db, "SELECT id FROM kickside_job WHERE status='running' AND (lease_until IS NULL OR "
        .. invalid_lease .. ") LIMIT 1", "live or unprovable lease")
    if oldest then
        sql.require_empty(db, [[SELECT id FROM kickside_job WHERE thread_id IS NULL OR job_type IN
            ('kickside.uploads.service:callback_job','kickside.uploads.service:process_job_proc') LIMIT 1]], "no provable Jobs owner")
        if pg then postgres.expand(db) else sqlite.rebuild(db, true) end
        indexes(db)
        retention(db, pg)
    elseif nullable then
        sql.require_empty(db, [[SELECT id FROM kickside_job WHERE owner_kind IS NULL OR owner_kind='' OR owner_id IS NULL OR owner_id=''
            UNION ALL SELECT id FROM kickside_job_run WHERE owner_kind IS NULL OR owner_kind='' OR owner_id IS NULL OR owner_id='' LIMIT 1]],
            "missing historical owner")
        if pg then
            for _, name in ipairs({"kickside_job","kickside_job_run"}) do
                sql.exec(db, "ALTER TABLE " .. name .. " ALTER COLUMN owner_kind SET NOT NULL, ALTER COLUMN owner_id SET NOT NULL")
            end
        else sqlite.rebuild(db, false) end
    end
    if old_cleanup then cleanup(db, pg) end
    if oldest or old_cleanup then
        -- The old 11 predicate omitted some terminal history states.
        sql.exec(db, "DROP INDEX IF EXISTS idx_kickside_job_run_retention")
        sql.exec(db, [[CREATE INDEX idx_kickside_job_run_retention ON kickside_job_run(thread_id,finished_at,id)
            WHERE status IN ('success','failed','lease_lost','skipped','completed','parked') AND finished_at IS NOT NULL]])
    end
end

return require("migration").define(function()
    migration("06 adopt retained Jobs queues and cleanup progress", function()
        database("sqlite", function()
            up(function(db) adopt(db, false) end)
            down(function(_db) end)
        end)
        database("postgres", function()
            up(function(db) adopt(db, true) end)
            down(function(_db) end)
        end)
    end)
end)
