-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Preserve the original table DDL, rowids, indexes and triggers. Limit the
-- edits to constraints in the published schemas. SQLite cannot alter them in place.
local sql = require("retained_sql")
local M = {}

local function ident(name)
    return '"' .. name:gsub('"', '""') .. '"'
end

local function replace_once(ddl, pattern, value)
    local updated, count = ddl:gsub(pattern, value)
    if count ~= 1 then sql.refuse("unrecognized SQLite constraint " .. pattern) end
    return updated
end

local function schema(db, name, oldest)
    local ddl = sql.rows(db, "SELECT sql FROM main.sqlite_schema WHERE name='" .. name .. "' AND type='table'")[1].sql
    if oldest then
        ddl = replace_once(ddl, "thread_id%s+TEXT%s+NOT NULL%s+REFERENCES%s+kickside_thread%(id%)%s+ON DELETE CASCADE", "thread_id TEXT")
        if name == "kickside_job" then
            ddl = replace_once(ddl, "scheduled_at%s+TEXT%s+NOT NULL%s+DEFAULT%s+%(datetime%('now'%)%)", "scheduled_at TEXT")
            return replace_once(ddl, "%)%s*$", [[,
                job_identity TEXT NOT NULL CHECK(job_identity<>''),
                slot INTEGER NOT NULL DEFAULT 0 CHECK(slot IN (0,1)),
                wake_key TEXT, wake_enabled INTEGER NOT NULL DEFAULT 1 CHECK(wake_enabled IN (0,1)),
                wake_demand_at TEXT, wake_generation INTEGER NOT NULL DEFAULT 0,
                wake_control_pending INTEGER NOT NULL DEFAULT 0 CHECK(wake_control_pending IN (0,1)),
                execution_seq INTEGER NOT NULL DEFAULT 0, registry_version TEXT,
                owner_kind TEXT NOT NULL, owner_id TEXT NOT NULL)]])
        end
        ddl = replace_once(ddl, "'lease_lost',%s*'skipped'%s*%)", "'lease_lost','skipped','completed','parked')")
        return replace_once(ddl, "UNIQUE%s*%(%s*job_id%s*,%s*attempt_no%s*%)",
            "execution_seq INTEGER NOT NULL, owner_kind TEXT NOT NULL, owner_id TEXT NOT NULL, UNIQUE(job_id,execution_seq)")
    end
    -- The pre-squash owner migration populated these columns using ALTER ADD.
    ddl = replace_once(ddl, "owner_kind%s+TEXT(%s*[,)])", "owner_kind TEXT NOT NULL%1")
    return replace_once(ddl, "owner_id%s+TEXT(%s*[,)])", "owner_id TEXT NOT NULL%1")
end

local function source_columns(db, name)
    local names = {}
    for _, col in ipairs(sql.rows(db, "PRAGMA main.table_xinfo(" .. name .. ")")) do
        if tonumber(col.hidden) ~= 0 or col.name:lower() == "rowid" or col.name:lower() == "saved_rowid" then
            sql.refuse("unsupported staging column " .. col.name)
        end
        names[#names + 1] = ident(col.name)
    end
    return table.concat(names, ",")
end

local function check_links(db, oldest)
    sql.require_empty(db, [[SELECT m.name AS id FROM main.sqlite_schema m, pragma_foreign_key_list(m.name) fk
        WHERE m.type='table' AND fk."table" IN ('kickside_job','kickside_job_run')
          AND NOT (m.name='kickside_job_run' AND fk."table"='kickside_job'
                   AND fk."from"='job_id' AND fk."to"='id' AND fk.on_delete='CASCADE') LIMIT 1]],
        "unrecognized incoming foreign key from")
    for _, name in ipairs({"kickside_job","kickside_job_run"}) do
        local expected = (oldest and 1 or 0) + (name == "kickside_job_run" and 1 or 0)
        local edges = sql.rows(db, "PRAGMA main.foreign_key_list(" .. name .. ")")
        if #edges ~= expected then sql.refuse("unexpected SQLite foreign key count on " .. name) end
        local seen = {}
        for _, edge in ipairs(edges) do
            local parent = edge["table"]
            local column = edge["from"]
            local historical_thread = oldest and parent == "kickside_thread" and column == "thread_id"
            local run_parent = name == "kickside_job_run" and parent == "kickside_job" and column == "job_id"
            if seen[column] or not (historical_thread or run_parent) or edge.to ~= "id" or edge.on_delete ~= "CASCADE" then
                sql.refuse("unrecognized SQLite foreign key on " .. name .. "." .. column)
            end
            seen[column] = true
        end
        sql.require_empty(db, "SELECT [table] AS id FROM pragma_foreign_key_check('" .. name .. "') LIMIT 1",
            "SQLite foreign key violation in")
    end
end

function M.rebuild(db, oldest)
    check_links(db, oldest)
    local job, run = "kickside_job", "kickside_job_run"
    local job_ddl, run_ddl = schema(db, job, oldest), schema(db, run, oldest)
    local jobs, runs = source_columns(db, job), source_columns(db, run)
    local objects = sql.rows(db, [[SELECT name,sql FROM main.sqlite_schema
        WHERE tbl_name IN ('kickside_job','kickside_job_run') AND type IN ('index','trigger')
          AND sql IS NOT NULL ORDER BY type,name]])
    sql.exec(db, "CREATE TEMP TABLE jobs_06_jobs AS SELECT rowid AS saved_rowid,* FROM main.kickside_job")
    sql.exec(db, "CREATE TEMP TABLE jobs_06_runs AS SELECT rowid AS saved_rowid,* FROM main.kickside_job_run")
    sql.exec(db, "DROP TABLE main.kickside_job_run")
    sql.exec(db, "DROP TABLE main.kickside_job")
    sql.exec(db, job_ddl)
    sql.exec(db, run_ddl)
    if oldest then
        -- Qualify table columns explicitly so a later historical column of the
        -- same name in a grouping query cannot change their meaning.
        sql.exec(db, "INSERT INTO main.kickside_job(rowid," .. jobs .. [[,job_identity,execution_seq,owner_kind,owner_id)
            SELECT saved_rowid,]] .. jobs .. [[,
            CASE WHEN idempotency_key IS NOT NULL AND idempotency_key<>'' THEN
                '6:thread'||length(CAST(thread_id AS BLOB))||':'||thread_id||
                length(CAST(idempotency_key AS BLOB))||':'||idempotency_key
            ELSE '7:oneshot'||length(CAST(id AS BLOB))||':'||id||length(CAST(id AS BLOB))||':'||id END,
            COALESCE(history.total,0),'thread',thread_id
            FROM temp.jobs_06_jobs j LEFT JOIN
              (SELECT job_id,count(*) AS total FROM temp.jobs_06_runs GROUP BY job_id) history ON history.job_id=j.id]])
        sql.exec(db, "INSERT INTO main.kickside_job_run(rowid," .. runs .. [[,execution_seq,owner_kind,owner_id)
            SELECT saved_rowid,]] .. runs .. [[,row_number() OVER(PARTITION BY job_id ORDER BY started_at,id),
            'thread',(SELECT j.owner_id FROM main.kickside_job j WHERE j.id=r.job_id)
            FROM temp.jobs_06_runs r]])
    else
        sql.exec(db, "INSERT INTO main.kickside_job(rowid," .. jobs .. ") SELECT saved_rowid," .. jobs .. " FROM temp.jobs_06_jobs")
        sql.exec(db, "INSERT INTO main.kickside_job_run(rowid," .. runs .. ") SELECT saved_rowid," .. runs .. " FROM temp.jobs_06_runs")
    end
    for _, object in ipairs(objects) do
        if not (oldest and object.name == "uq_kickside_job_active_idempotency") then sql.exec(db, object.sql) end
    end
    -- Primary keys make each row unique. Compare every original column as well as the rowid.
    for _, pair in ipairs({{job, "jobs_06_jobs", jobs}, {run, "jobs_06_runs", runs}}) do
        local copied = "SELECT rowid," .. pair[3] .. " FROM main." .. pair[1]
        local staged = "SELECT saved_rowid," .. pair[3] .. " FROM temp." .. pair[2]
        sql.require_empty(db, "SELECT id FROM (" .. staged .. " EXCEPT " .. copied .. ") LIMIT 1", "row changed during SQLite copy")
        sql.require_empty(db, "SELECT id FROM (" .. copied .. " EXCEPT " .. staged .. ") LIMIT 1", "extra row during SQLite copy")
        sql.exec(db, "DROP TABLE temp." .. pair[2])
    end
    check_links(db, false)
end

return M
