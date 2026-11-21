-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local function execute(db: any, statement: string)
    local _, err = db:execute(statement)
    if err then error(tostring(err)) end
end

local function upload_columns(db: any, engine: string): { [string]: boolean }
    local statement = "PRAGMA table_info(kickside_uploads)"
    if engine == "postgres" then
        statement = [[SELECT attname AS name FROM pg_attribute
            WHERE attrelid = 'kickside_uploads'::regclass AND attnum > 0 AND NOT attisdropped]]
    end
    local rows, err = db:query(statement)
    if err then error(tostring(err)) end
    local columns = {}
    for _, column in ipairs(rows) do columns[column.name] = true end
    return columns
end

local function upgrade(db: any, engine: string)
    local columns = upload_columns(db, engine)
    -- NULL preserves the existing uploads' processing ownership. Migration 06
    -- already recognizes a terminal upload with no persisted processing intent.
    if not columns.processing_intent_state then
        execute(db, [[ALTER TABLE kickside_uploads ADD COLUMN processing_intent_state TEXT
            CONSTRAINT kickside_uploads_processing_intent_state_check
            CHECK (processing_intent_state IN ('pending', 'acknowledged'))]])
    end
    if not columns.processing_job_id then
        execute(db, "ALTER TABLE kickside_uploads ADD COLUMN processing_job_id TEXT")
    end
    if not columns.processing_max_execution_ms then
        local integer = engine == "postgres" and "BIGINT" or "INTEGER"
        execute(db, "ALTER TABLE kickside_uploads ADD COLUMN processing_max_execution_ms " .. integer)
    end

    execute(db, [[CREATE INDEX IF NOT EXISTS idx_kickside_uploads_processing_intent
        ON kickside_uploads (created_at, uuid)
        WHERE storage_state = 'uploaded' AND processing_intent_state = 'pending']])
    execute(db, [[CREATE INDEX IF NOT EXISTS idx_upload_artifact_blob_orphan_retention
        ON kickside_upload_artifact_blobs (created_at, blob_id)]])
    execute(db, [[CREATE INDEX IF NOT EXISTS idx_upload_read_model_deleted_retention
        ON kickside_upload_read_model (deleted_at, upload_id)
        WHERE status = 'deleted' AND deleted_at IS NOT NULL]])
end

return require("migration").define(function()
    migration("05 complete historical upload schema", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db) upgrade(db, engine) end)
                down(function() error("Cannot roll back the retained Uploads schema") end)
            end)
        end
    end)
end)
