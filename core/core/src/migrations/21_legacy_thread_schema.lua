-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local function execute(db: any, statement: string)
    local _, err = db:execute(statement)
    if err then error(err) end
end

local function query(db: any, statement: string, args: {any}?): {any}
    local rows, err = db:query(statement, args or {})
    if err then error(err) end
    return rows
end

local function columns_of(db: any, postgres: boolean, table_name: string): {[string]: boolean}
    local columns = query(db, postgres and [[SELECT column_name AS name FROM information_schema.columns
        WHERE table_schema=current_schema() AND table_name=$1]] or "SELECT name FROM pragma_table_info($1)", {table_name})
    local present = {}
    for _, column in ipairs(columns) do
        present[column.name] = true
    end
    return present
end

local function ensure_thread_schema(db: any, postgres: boolean)
    local present = columns_of(db, postgres, "kickside_thread")
    local sequence_type = postgres and "BIGINT" or "INTEGER"
    local done_type = postgres and "BOOLEAN NOT NULL DEFAULT FALSE" or "INTEGER NOT NULL DEFAULT 0"
    local definitions = {
        { "max_pruned_seq", sequence_type .. " NOT NULL DEFAULT 0 CHECK (max_pruned_seq >= 0)" },
        { "deleting_at", "TEXT" },
        { "teardown_fence_cursor", "TEXT NOT NULL DEFAULT ''" },
        { "teardown_fence_done", done_type },
        { "teardown_counts_json", "TEXT NOT NULL DEFAULT '{}'" },
        { "teardown_page_seq", sequence_type .. " NOT NULL DEFAULT 0" },
    }
    for _, definition in ipairs(definitions) do
        if not present[definition[1]] then
            execute(db, "ALTER TABLE kickside_thread ADD COLUMN " .. definition[1] .. " " .. definition[2])
        end
    end

    if not present.max_pruned_seq then
        -- The historical sweeper could remove the prefix without recording its
        -- end. Keep the first surviving sequence readable, even if later rows
        -- also have gaps. A thread with no surviving events still has a head.
        execute(db, [[UPDATE kickside_thread AS t SET max_pruned_seq=COALESCE(
            (SELECT MIN(e.seq)-1 FROM kickside_event e WHERE e.thread_id=t.id AND e.seq>0),t.event_count)
            WHERE t.event_count>0 AND NOT EXISTS (
                SELECT 1 FROM kickside_event e WHERE e.thread_id=t.id AND e.seq=1)]])
    end

    execute(db, [[CREATE INDEX IF NOT EXISTS idx_thread_deleting
        ON kickside_thread(deleting_at,id) WHERE deleting_at IS NOT NULL]])
    execute(db, [[CREATE INDEX IF NOT EXISTS idx_kickside_event_retention_fresh
        ON kickside_event(thread_id,created_at,seq)]])
end

local CURSOR_STATUS = [[CASE WHEN status IN ('pending','running','live','caught_up') THEN 'active'
    WHEN status='failed' THEN 'paused' ELSE status END]]

local function convert_postgres_cursors(db: any)
    execute(db, [[ALTER TABLE kickside_projection_cursor
        DROP CONSTRAINT kickside_projection_cursor_status_ck,
        ADD COLUMN job_id UUID,
        ADD COLUMN actor_id TEXT,
        ADD COLUMN execution_identity_json TEXT]])
    execute(db, [[UPDATE kickside_projection_cursor c SET status=]] .. CURSOR_STATUS .. [[,
        actor_id=p.actor_id,execution_identity_json=p.actor_context
        FROM kickside_projection p WHERE p.id=c.projection_id]])
    execute(db, [[ALTER TABLE kickside_projection_cursor
        RENAME COLUMN window_idle_timeout_ms TO debounce_idle_ms]])
    execute(db, [[ALTER TABLE kickside_projection_cursor
        RENAME COLUMN window_max_duration_ms TO debounce_max_ms]])
    execute(db, [[ALTER TABLE kickside_projection_cursor
        RENAME CONSTRAINT kickside_projection_cursor_window_idle_ms_ck TO kickside_projection_cursor_debounce_idle_ck]])
    execute(db, [[ALTER TABLE kickside_projection_cursor
        RENAME CONSTRAINT kickside_projection_cursor_window_max_duration_ms_ck TO kickside_projection_cursor_debounce_max_ck]])
    execute(db, [[ALTER TABLE kickside_projection_cursor
        ALTER COLUMN status SET DEFAULT 'active',
        ADD CONSTRAINT kickside_projection_cursor_status_ck CHECK(status IN ('active','paused','invalid')),
        DROP COLUMN target_seq, DROP COLUMN batch_size, DROP COLUMN locked_by, DROP COLUMN locked_at,
        DROP COLUMN attempts, DROP COLUMN dead_at, DROP COLUMN dispatch_after, DROP COLUMN coalesce_key,
        DROP COLUMN window_max_events, DROP COLUMN window_opened_at_ms, DROP COLUMN window_last_event_at_ms,
        DROP COLUMN trigger_state, DROP COLUMN worker_runtime, DROP COLUMN dispatch_token]])
end

local function sqlite_cursor_references(db: any): boolean
    local rows = query(db, [[SELECT s.name AS name,f."from" AS source,f."to" AS target,f.on_delete AS action
        FROM sqlite_schema s JOIN pragma_foreign_key_list(s.name) f
        WHERE s.type='table' AND lower(f."table")='kickside_projection_cursor']])
    for _, row in ipairs(rows) do
        if row.name ~= "kickside_effect_intent" or row.source ~= "cursor_id"
            or row.target ~= "id" or row.action ~= "SET NULL" then
            error("unexpected SQLite projection cursor reference: " .. tostring(row.name))
        end
    end
    return #rows > 0
end

local function convert_sqlite_cursors(db: any)
    local has_effect_links = sqlite_cursor_references(db)
    if has_effect_links then
        execute(db, [[CREATE TEMP TABLE legacy_projection_effect_links AS
            SELECT id,cursor_id FROM kickside_effect_intent WHERE cursor_id IS NOT NULL]])
    end

    execute(db, [[CREATE TABLE kickside_projection_cursor_bridge (
        id TEXT PRIMARY KEY,
        projection_id TEXT NOT NULL REFERENCES kickside_projection(id) ON DELETE CASCADE,
        thread_id TEXT NOT NULL REFERENCES kickside_thread(id) ON DELETE CASCADE,
        cursor_key TEXT NOT NULL DEFAULT 'default',
        last_seq INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','paused','invalid')),
        generation INTEGER NOT NULL DEFAULT 1,
        last_error TEXT,
        debounce_idle_ms INTEGER NOT NULL DEFAULT 0 CHECK(debounce_idle_ms >= 0),
        debounce_max_ms INTEGER NOT NULL DEFAULT 0 CHECK(debounce_max_ms >= 0),
        job_id TEXT,
        actor_id TEXT,
        execution_identity_json TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(projection_id,cursor_key))]])
    execute(db, [[INSERT INTO kickside_projection_cursor_bridge
        (id,projection_id,thread_id,cursor_key,last_seq,status,generation,last_error,
         debounce_idle_ms,debounce_max_ms,actor_id,execution_identity_json,created_at,updated_at)
        SELECT c.id,c.projection_id,c.thread_id,c.cursor_key,c.last_seq,]] .. CURSOR_STATUS .. [[,
         c.generation,c.last_error,c.window_idle_timeout_ms,c.window_max_duration_ms,
         p.actor_id,p.actor_context,c.created_at,c.updated_at
        FROM kickside_projection_cursor c JOIN kickside_projection p ON p.id=c.projection_id]])
    if #query(db, [[SELECT 1 FROM kickside_projection_cursor c WHERE NOT EXISTS
        (SELECT 1 FROM kickside_projection_cursor_bridge b WHERE b.id=c.id) LIMIT 1]]) > 0 then
        error("projection cursor copy omitted a historical row")
    end

    execute(db, "DROP TABLE kickside_projection_cursor")
    execute(db, "ALTER TABLE kickside_projection_cursor_bridge RENAME TO kickside_projection_cursor")
    execute(db, [[CREATE INDEX idx_kickside_projection_cursor_thread
        ON kickside_projection_cursor(thread_id,status)]])
    execute(db, [[CREATE INDEX idx_kickside_projection_cursor_projection
        ON kickside_projection_cursor(projection_id)]])
    execute(db, [[CREATE INDEX idx_kickside_projection_cursor_gen
        ON kickside_projection_cursor(projection_id,cursor_key,generation)]])
    execute(db, [[CREATE TRIGGER trg_kickside_projection_cursor_updated_at
        AFTER UPDATE ON kickside_projection_cursor FOR EACH ROW
        BEGIN UPDATE kickside_projection_cursor SET updated_at=datetime('now') WHERE id=NEW.id; END]])

    if has_effect_links then
        execute(db, [[UPDATE kickside_effect_intent AS e SET cursor_id=l.cursor_id
            FROM legacy_projection_effect_links l WHERE l.id=e.id]])
        if #query(db, [[SELECT 1 FROM legacy_projection_effect_links l
            LEFT JOIN kickside_effect_intent e ON e.id=l.id WHERE e.cursor_id IS NOT l.cursor_id LIMIT 1]]) > 0 then
            error("historical effect cursor links changed during migration")
        end
        execute(db, "DROP TABLE legacy_projection_effect_links")
    end
end

local function adopt_legacy_schema(db: any, postgres: boolean)
    ensure_thread_schema(db, postgres)
    local columns = columns_of(db, postgres, "kickside_projection_cursor")
    if columns.job_id then return end
    if postgres then
        convert_postgres_cursors(db)
    else
        convert_sqlite_cursors(db)
    end
    execute(db, "CREATE INDEX idx_kickside_projection_cursor_job ON kickside_projection_cursor(job_id)")
end

return require("migration").define(function()
    migration("Adopt historical thread and projection cursor schema", function()
        database("postgres", function()
            up(function(db) adopt_legacy_schema(db, true) end)
        end)
        database("sqlite", function()
            up(function(db) adopt_legacy_schema(db, false) end)
        end)
    end)
end)
