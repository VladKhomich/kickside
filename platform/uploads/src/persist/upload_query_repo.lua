local binding_errors = require("binding_errors")
local sql = require("sql")

local resources = require("uploads_resources")
local persisted_json = require("persisted_json")
local trim = require("text_trim").trim

local upload_query_repo = {}

upload_query_repo.INTENTLESS_SQL = "processing_intent_state IS NULL AND processing_job_id IS NULL"

function upload_query_repo.processing_job_identity_sql(upload: string): string
    return "'7:uploads' || CAST(length(" .. upload .. "uuid) AS TEXT) || ':' || " .. upload .. "uuid || '7:process'"
end

function upload_query_repo.processing_job_owner_sql(): string
    return [[EXISTS (SELECT 1 FROM kickside_job j WHERE j.id = ? AND
        ((processing_intent_state = 'acknowledged' AND processing_job_id = CAST(j.id AS TEXT))
         OR (]] .. upload_query_repo.INTENTLESS_SQL .. [[ AND j.job_identity = ]]
             .. upload_query_repo.processing_job_identity_sql("kickside_uploads.") .. ")))"
end

local function select_upload_columns()
    return sql.builder.select(
        "uuid", "actor_id", "size", "mime_type",
        "storage_state", "storage_id", "storage_path", "type_id", "created_at",
        "updated_at", "metadata", "trace_context", "content_sha256",
        "processing_intent_state", "processing_job_id", "processing_max_execution_ms"
    )
end

function upload_query_repo.parse_upload_row(upload)
    local metadata, metadata_err = persisted_json.decode_table(upload.metadata, "kickside_uploads.metadata")
    if metadata_err then return nil, metadata_err end
    local trace, trace_err = persisted_json.decode_table(upload.trace_context,
        "kickside_uploads.trace_context", true)
    if trace_err then return nil, trace_err end
    upload.metadata, upload.trace_context = metadata, trace
    return upload, nil
end

-- Look up a live upload for an account by content hash. Hard deletes remove the row,
-- so a returned record is always a live, non-deleted upload. Takes an open db handle
-- so the dedup check and a racing insert can observe the same connection state.
local function find_by_content_hash(db, actor_id, content_sha256, dedup_scope)
    local query = select_upload_columns()
        :from("kickside_uploads")
        :where("actor_id = ? AND content_sha256 = ?", actor_id, content_sha256)
        :limit(1)
    if dedup_scope ~= nil then query = query:where("dedup_scope = ?", dedup_scope) end

    local rows, query_err = query:run_with(db):query()
    if query_err then return nil, query_err end
    if #rows == 0 then return nil, nil end

    local upload = rows[1]
    return upload_query_repo.parse_upload_row(upload)
end

-- Resolve an existing upload for an account by content hash, opening its own db handle.
function upload_query_repo.find_by_content_hash(actor_id, content_sha256, dedup_scope)
    if not actor_id or actor_id == "" then
        return nil, "Actor ID is required"
    end
    if not content_sha256 or content_sha256 == "" then
        return nil, "Content hash is required"
    end

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    local upload, read_err = find_by_content_hash(db, actor_id, content_sha256, dedup_scope)
    db:release()
    return upload, read_err
end

-- Get an upload by ID
local function get_upload(uuid, query)
    if not uuid or uuid == "" then
        return nil, errors.new({kind = errors.INVALID, message = "Upload ID is required",
            retryable = false, details = {code = "upload_id_required"}})
    end

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    -- Build the SELECT query
    query = query:from("kickside_uploads")
        :where("uuid = ?", uuid)
        :limit(1)

    -- Execute the query
    local executor = query:run_with(db)
    local uploads, err = executor:query()

    db:release()

    if err then
        return nil, binding_errors.from(err, errors.UNAVAILABLE, "upload_lookup_failed", "Failed to get upload")
    end

    if #uploads == 0 then
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "Upload not found",
            retryable = false, details = {code = "upload_not_found"} })
    end

    return uploads[1], nil
end

function upload_query_repo.get(uuid)
    local upload, err = get_upload(uuid, select_upload_columns())
    if err then return nil, err end
    return upload_query_repo.parse_upload_row(upload)
end

-- The upload of an account whose acknowledged processing intent names job_id,
-- or nil when none does.
function upload_query_repo.find_by_processing_job(actor_id: string, job_id: string, upload_id: string): (any?, any?)
    if not actor_id or actor_id == "" or not job_id or job_id == "" or not upload_id or upload_id == "" then
        return nil, errors.new({kind = errors.INVALID, message = "Actor ID, job ID and upload ID are required",
            retryable = false, details = {code = "upload_processing_job_required"}})
    end
    local db, err = resources.get_db()
    if err then return nil, err end
    local query = select_upload_columns():from("kickside_uploads"):where("uuid = ?", upload_id)
    local statement, params, build_err = query
        :where("actor_id = ?", actor_id)
        :where(upload_query_repo.processing_job_owner_sql(), job_id)
        :limit(1)
        :placeholder_format(sql.builder.dollar):to_sql()
    if build_err then db:release(); return nil, build_err end
    local rows, query_err = db:query(statement, params)
    db:release()
    if query_err then
        return nil, binding_errors.from(query_err, errors.UNAVAILABLE, "upload_lookup_failed", "Failed to get upload")
    end
    if #rows == 0 then return nil, nil end
    local upload, decode_err = upload_query_repo.parse_upload_row(rows[1])
    return upload or rows[1], decode_err
end

-- A newer queue event fences a terminal event or projection from an earlier
-- attempt. Released retries can share a queue event, so an earlier legacy
-- failure cannot witness a completed checkpoint. The projection also survives event pruning.
local terminal_projection = "r.status = CASE u.storage_state WHEN 'completed' THEN 'completed' ELSE 'error' END"
local checkpoint_published = [[(
    SELECT COALESCE(r.status = 'deleted', FALSE) OR COALESCE((
        SELECT CASE WHEN e.type = 'kickside.uploads.events:upload.queued'
            THEN e.seq <= r.last_event_seq AND ]] .. terminal_projection .. [[
            ELSE e.seq >= COALESCE(r.last_event_seq, 0) END
        FROM kickside_event e
        WHERE e.external_source = 'uploads' AND e.external_id = u.uuid
          AND (r.component_id IS NULL OR CAST(e.thread_id AS TEXT) = r.component_id)
          AND (e.type = 'kickside.uploads.events:upload.queued'
            OR (e.type IN ('kickside.uploads.events:upload.completed', 'kickside.uploads.events:upload.failed')
              AND (e.external_version = u.processing_job_id
                OR ((u.processing_job_id IS NULL OR e.external_version = e.type)
                  AND e.type = CASE u.storage_state WHEN 'completed' THEN 'kickside.uploads.events:upload.completed'
                    ELSE 'kickside.uploads.events:upload.failed' END))))
        ORDER BY e.seq DESC LIMIT 1
    ), ]] .. terminal_projection .. [[, FALSE)
    FROM (SELECT 1) anchor LEFT JOIN kickside_upload_read_model r ON r.upload_id = u.uuid
)]]

function upload_query_repo.checkpoint_published_tx(tx, uuid: string): (boolean?, any?)
    local rows, err = tx:query("SELECT " .. checkpoint_published .. " AS published FROM kickside_uploads u WHERE u.uuid = $1",
        { uuid })
    if err then return nil, err end
    local published = rows[1].published
    return published == true or published == 1, nil
end

-- Select a bounded index page and check publication without filtering away cursor positions.
function upload_query_repo.list_checkpoints(limit: integer, cursor: string?, db: any): (table?, any?, string?)
    local after, limit_arg, params = "", "$1", { limit }
    if cursor then after, limit_arg, params = " AND u.uuid > $1", "$2", { cursor, limit } end
    local dbtype, type_err = db:type()
    if type_err then return nil, type_err end
    local index = dbtype == sql.type.SQLITE and " INDEXED BY idx_upload_checkpoint_candidates" or ""
    local rows, err = db:query("SELECT u.*, NOT " .. checkpoint_published .. " AS unpublished FROM kickside_uploads u"
        .. index .. [[
        WHERE u.storage_state IN ('completed', 'failed')
          AND ((u.processing_intent_state = 'acknowledged' AND u.processing_job_id IS NOT NULL)
            OR (]] .. upload_query_repo.INTENTLESS_SQL .. "))" .. after .. " ORDER BY u.uuid LIMIT " .. limit_arg, params)
    if err then return nil, err end
    local checkpoints = {}
    for _, row in ipairs(rows) do
        if row.unpublished == true or row.unpublished == 1 then checkpoints[#checkpoints + 1] = row end
    end
    return checkpoints, nil, #rows == limit and tostring(rows[#rows].uuid) or nil
end

-- Authorization needs the stored owner, without loading content metadata.
function upload_query_repo.get_read_ref(uuid)
    return get_upload(uuid, sql.builder.select("uuid", "actor_id"))
end

-- Intent is committed on the upload record before enqueue. The jobs enqueue
-- response decides whether an active job already exists.
function upload_query_repo.list_processing_enqueue_intents(limit)
    if type(limit) ~= "number" or limit ~= math.floor(limit) or limit < 1 or limit > 500 then
        return nil, errors.new({ message = "intent batch must be an integer in [1, 500]", kind = errors.INVALID })
    end

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    local rows, query_err = db:query([[
        SELECT
            u.uuid, u.actor_id, u.size, u.mime_type,
            u.storage_state, u.storage_id, u.storage_path, u.type_id, u.created_at,
            u.updated_at, u.metadata, u.trace_context, u.content_sha256,
            u.processing_intent_state, u.processing_job_id, u.processing_max_execution_ms
        FROM kickside_uploads u
        WHERE u.storage_state = 'uploaded'
            AND u.processing_intent_state = 'pending'
        ORDER BY u.created_at ASC, u.uuid ASC
        LIMIT $1
    ]], { limit })
    db:release()
    if query_err then return nil, query_err end

    for _, row in ipairs(rows or {}) do
        local _, decode_err = upload_query_repo.parse_upload_row(row)
        if decode_err then return nil, decode_err end
    end
    return rows or {}, nil
end

-- List uploads by actor ID
-- Apply optional list filters to a user-scoped query. `storage_state` is the row's
-- byte-reservation state (pending/uploaded), not lifecycle status. Lifecycle
-- filtering is handled by the uploads read model.
local function apply_list_filters(query, opts)
    opts = type(opts) == "table" and opts or {}
    local ids = opts.ids
    if type(ids) == "table" then
        if #ids == 0 then
            query = query:where("1 = 0")
        else
            local marks: { string } = {}
            local values: { any } = {}
            for _, id in ipairs(ids) do
                if type(id) == "string" and id ~= "" then
                    marks[#marks + 1] = "?"
                    values[#values + 1] = id
                end
            end
            if #values == 0 then
                query = query:where("1 = 0")
            else
                query = query:where("uuid IN (" .. table.concat(marks, ", ") .. ")", table.unpack(values))
            end
        end
    end

    local storage_state = opts.storage_state
    if type(storage_state) == "string" and storage_state ~= "" and storage_state ~= "all" then
        query = query:where("storage_state = ?", storage_state)
    end
    local q = opts.q
    if type(q) == "string" then
        q = trim(q)
        if q ~= "" then
            local like = "%" .. q .. "%"
            query = query:where("(mime_type LIKE ? OR metadata LIKE ?)", like, like)
        end
    end
    return query
end

function upload_query_repo.list_by_actor(actor_id, limit, offset, opts)
    if not actor_id or actor_id == "" then
        return nil, "Actor ID is required"
    end

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    limit = limit or 100
    offset = offset or 0

    -- Build the SELECT query
    local query = select_upload_columns()
        :from("kickside_uploads")
        :where("actor_id = ?", actor_id)
    query = apply_list_filters(query, opts)
    query = query
        :order_by("created_at DESC")
        :limit(limit)
        :offset(offset)

    -- Execute the query
    local executor = query:run_with(db)
    local uploads, err = executor:query()

    db:release()

    if err then
        return nil, binding_errors.from(err, errors.UNAVAILABLE, "upload_list_failed", "Failed to list uploads")
    end

    for _, upload in ipairs(uploads) do
        local _, decode_err = upload_query_repo.parse_upload_row(upload)
        if decode_err then return nil, decode_err end
    end

    return uploads
end

-- List uploads by type ID
function upload_query_repo.list_by_type(type_id, limit, offset)
    if not type_id or type_id == "" then
        return nil, "Type ID is required"
    end

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    limit = limit or 100
    offset = offset or 0

    -- Build the SELECT query
    local query = select_upload_columns()
        :from("kickside_uploads")
        :where("type_id = ?", type_id)
        :order_by("created_at DESC")
        :limit(limit)
        :offset(offset)

    -- Execute the query
    local executor = query:run_with(db)
    local uploads, err = executor:query()

    db:release()

    if err then
        return nil, "Failed to list uploads by type: " .. err
    end

    for _, upload in ipairs(uploads) do
        local _, decode_err = upload_query_repo.parse_upload_row(upload)
        if decode_err then return nil, decode_err end
    end

    return uploads
end

-- Count total uploads for a user (matching the same optional row filters as the
-- list, so pagination totals stay consistent with a search/storage query).
function upload_query_repo.count_by_actor(actor_id, opts)
    if not actor_id or actor_id == "" then
        return nil, "Actor ID is required"
    end

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    -- Build the COUNT query
    local query = sql.builder.select("COUNT(*) as count")
        :from("kickside_uploads")
        :where("actor_id = ?", actor_id)
    query = apply_list_filters(query, opts)

    -- Execute the query
    local executor = query:run_with(db)
    local result, err = executor:query()

    db:release()

    if err then
        return nil, "Failed to count uploads: " .. err
    end

    return result[1].count
end

function upload_query_repo.list_with_filters(options)
    options = options or {}

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    local query = select_upload_columns()
        :from("kickside_uploads")

    if options.actor_id then
        query = query:where("actor_id = ?", options.actor_id)
    end

    if options.filters and options.filters.content_types and #options.filters.content_types > 0 then
        local content_conditions = {}
        for _, content_type in ipairs(options.filters.content_types) do
            if string.find(tostring(content_type), "*") then
                local pattern = string.gsub(tostring(content_type), "%*", "%%")
                query = query:where("mime_type LIKE ?", pattern)
            else
                table.insert(content_conditions, sql.builder.eq({ mime_type = content_type }))
            end
        end

        if #content_conditions > 0 then
            if #content_conditions == 1 then
                query = query:where(content_conditions[1])
            else
                query = query:where(sql.builder.or_(content_conditions))
            end
        end
    end

    if options.filters and options.filters.created_after then
        query = query:where("created_at >= ?", options.filters.created_after)
    end

    if options.filters and options.filters.created_before then
        query = query:where("created_at <= ?", options.filters.created_before)
    end

    local sort_column = "created_at"
    if options.sort == "size" then
        sort_column = "size"
    end

    local order = "DESC"
    if options.sort_order == "asc" then
        order = "ASC"
    end

    if options.after_id then
        -- The cursor must use the same compound order as the result. Its
        -- timestamp/size comes from the stored row, within the caller's scope.
        local anchor = "(SELECT " .. sort_column .. " FROM kickside_uploads WHERE uuid = ?"
        local anchor_params = { options.after_id }
        if options.actor_id then
            anchor = anchor .. " AND actor_id = ?"
            anchor_params[#anchor_params + 1] = options.actor_id
        end
        anchor = anchor .. ")"
        local cursor_params = {}
        for _ = 1, 2 do
            for _, value in ipairs(anchor_params) do cursor_params[#cursor_params + 1] = value end
        end
        cursor_params[#cursor_params + 1] = options.after_id
        local comparison = order == "ASC" and ">" or "<"
        query = query:where("(" .. sort_column .. " " .. comparison .. " " .. anchor
            .. " OR (" .. sort_column .. " = " .. anchor .. " AND uuid > ?))",
            table.unpack(cursor_params))
    end

    query = query:order_by(sort_column .. " " .. order .. ", uuid ASC")

    if options.limit then
        query = query:limit(options.limit)
    end

    local executor = query:run_with(db)
    local uploads, err = executor:query()

    db:release()

    if err then
        return nil, binding_errors.from(err, errors.UNAVAILABLE, "upload_list_failed", "Failed to list uploads")
    end

    for _, upload in ipairs(uploads) do
        local _, decode_err = upload_query_repo.parse_upload_row(upload)
        if decode_err then return nil, decode_err end
    end

    return uploads
end

function upload_query_repo.count_with_filters(options)
    options = options or {}

    local db, err = resources.get_db()
    if err then
        return nil, err
    end

    local query = sql.builder.select("COUNT(*) as count")
        :from("kickside_uploads")

    if options.actor_id then
        query = query:where("actor_id = ?", options.actor_id)
    end

    if options.filters and options.filters.content_types and #options.filters.content_types > 0 then
        local content_conditions = {}
        for _, content_type in ipairs(options.filters.content_types) do
            if string.find(tostring(content_type), "*") then
                local pattern = string.gsub(tostring(content_type), "%*", "%%")
                query = query:where("mime_type LIKE ?", pattern)
            else
                table.insert(content_conditions, sql.builder.eq({ mime_type = content_type }))
            end
        end

        if #content_conditions > 0 then
            if #content_conditions == 1 then
                query = query:where(content_conditions[1])
            else
                query = query:where(sql.builder.or_(content_conditions))
            end
        end
    end

    if options.filters and options.filters.created_after then
        query = query:where("created_at >= ?", options.filters.created_after)
    end

    if options.filters and options.filters.created_before then
        query = query:where("created_at <= ?", options.filters.created_before)
    end

    local executor = query:run_with(db)
    local result, err = executor:query()

    db:release()

    if err then
        return nil, binding_errors.from(err, errors.UNAVAILABLE, "upload_count_failed", "Failed to count uploads")
    end

    return result[1].count
end

return upload_query_repo
