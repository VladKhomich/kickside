-- Read side of the projection engine. Lists a thread's projections and cursors,
-- loads one projection, and resolves a cursor by id or by its natural address
-- (kind + projection_key + cursor_key). Every call takes the caller's db or tx
-- handle. Payload reads can authorize the owner and kind joined to the rows.

local trim = require("text_trim").trim
local sql = require("sql")
local types = require("types")
local event_access = require("event_access")

local reader = {}
local PENDING_SEQUENCE_WINDOW = 512

-- A pooled connection or open transaction.
type Executor = sql.DB | sql.Transaction
type Authorize = table

local function missing_thread(): error
    return errors.new({kind = errors.NOT_FOUND, message = "thread not found", retryable = false,
        details = {code = "thread_access_not_found"}})
end

-- A cursor row as resolved by find_cursor (the columns a lifecycle action needs).
type CursorRef = {
    id: string,
    projection_id: string,
    thread_id: string,
    status: string,
    generation: integer,
}

-- Resolve the dialect's row-lock clause for a builder :suffix (empty on sqlite).
local function lock_clause(db_or_tx: Executor): (string?, error?)
    local dbtype, err = (db_or_tx :: sql.DB):type()
    if err then
        return nil, (errors.wrap(err, "failed to resolve db type") :: error)
    end
    if dbtype == sql.type.SQLITE then
        return "", nil
    end
    return "FOR UPDATE", nil
end

local function read_payload(db: Executor, thread_id: string, page: any, limit: integer, authorize: Authorize?,
    order: {string}, row_key: string, operation: string, after_id: string?): (table[]?, error?, number?, boolean?)
    if not authorize then
        local rows, err = page:limit(limit):run_with(db):query()
        if err then return nil, errors.wrap(err, operation) end
        return rows, nil
    end
    local query, build_err = event_access.authorized_query(db, thread_id, page, sql.builder.select("t.event_count"), authorize, limit)
    if build_err then return nil, build_err, nil, authorize.missing end
    for _, column in ipairs(order) do query = query:order_by("payload." .. column) end
    if after_id then
        query = query:columns("a.id AS cursor_anchor")
            :left_join("kickside_projection_cursor a ON a.id = ? AND a.thread_id = t.id", after_id)
    end
    local rows, err = event_access.execute(db, thread_id, query, authorize)
    if err then return nil, errors.wrap(err, operation) end
    if type(rows) ~= "table" then
        return nil, errors.new({kind = errors.INTERNAL, message = "invalid projection payload response"})
    end
    local thread = rows[1]
    local access_err = event_access.verify(authorize, thread)
    if access_err then return nil, access_err end
    local event_count = tonumber(thread.event_count) or 0
    local anchor_exists = thread.cursor_anchor ~= nil
    if thread[row_key] == nil then return {}, nil, event_count, anchor_exists end
    for _, row in ipairs(rows) do
        event_access.clear_binding(row)
        row.event_count, row.cursor_anchor = nil, nil
    end
    return rows, nil, event_count, anchor_exists
end

-- list_projections returns a thread's projection definitions, ordered by
-- (kind, projection_key).
function reader.list_projections(db_or_tx: Executor, thread_id: string, limit: integer?, after: table?,
    authorize: Authorize?): (table[]?, error?, table?, number?, boolean?)
    local page_limit = limit or 200
    local query = sql.builder.select(
        "id", "thread_id", "kind", "projection_key", "body", "state",
        "last_event_seq", "actor_id",
        "CASE WHEN actor_id IS NOT NULL AND actor_id <> '' AND actor_context IS NOT NULL AND actor_context <> '' THEN 1 ELSE 0 END AS has_execution_identity",
        "created_at", "updated_at"
    )
        :from("kickside_projection")
        :where(sql.builder.eq({ thread_id = thread_id }))
        :order_by("kind ASC")
        :order_by("projection_key ASC")
    if after then
        query = query:where("(kind > ? OR (kind = ? AND projection_key > ?))", after.kind, after.kind, after.projection_key)
    end
    local rows, err, event_count, absent = read_payload(db_or_tx, thread_id, query, page_limit + 1, authorize,
        {"kind ASC", "projection_key ASC"}, "id", "failed to list projections")
    if err then return nil, err, nil, nil, absent end
    if authorize and event_count == nil then return nil, missing_thread(), nil, nil, true end
    local result = rows or {}
    local more = #result > page_limit
    if more then table.remove(result) end
    local last = result[#result]
    return result, nil, { has_more = more, next_after = more and { kind = last.kind, projection_key = last.projection_key } or nil }, event_count
end

-- get_projection loads a single projection by id (scoped to its thread).
function reader.get_projection(db_or_tx: Executor, thread_id: string, projection_id: string): (table?, error?)
    local rows, err = sql.builder.select(
        "id", "thread_id", "kind", "projection_key", "body", "state",
        "last_event_seq", "created_at", "updated_at"
    )
        :from("kickside_projection")
        :where(sql.builder.eq({ id = projection_id, thread_id = thread_id }))
        :limit(1)
        :run_with(db_or_tx)
        :query()
    if err then
        return nil, (errors.wrap(err, "failed to load projection") :: error)
    end
    if not rows or #rows == 0 then
        return nil, (errors.new({ message = "projection not found", kind = errors.NOT_FOUND }) :: error)
    end
    return rows[1], nil
end

-- list_cursors returns a thread's projection cursors joined to their projection's
-- addressing, newest first.
function reader.list_cursors(db_or_tx: Executor, thread_id: string, limit: integer?, after: table?,
    authorize: Authorize?): (table[]?, error?, table?, number?)
    local page_limit = limit or 200
    local query = sql.builder.select(
        "c.id", "c.projection_id", "c.thread_id", "c.cursor_key",
        "c.generation", "c.last_seq", "c.status", "c.last_error",
        "c.debounce_idle_ms", "c.debounce_max_ms", "c.job_id",
        "c.created_at", "c.updated_at",
        "p.kind", "p.projection_key"
    )
        :from("kickside_projection_cursor c")
        :inner_join("kickside_projection p ON p.id = c.projection_id")
        :where("c.thread_id = ?", thread_id)
        :order_by("c.created_at DESC")
        :order_by("c.id DESC")
    if after then
        local anchor = "(SELECT created_at FROM kickside_projection_cursor WHERE id = ? AND thread_id = ?)"
        query = query:where("(c.created_at < " .. anchor .. " OR (c.created_at = " .. anchor .. " AND c.id < ?))",
            after.id, thread_id, after.id, thread_id, after.id)
    end
    local rows, err, event_count, anchor_exists = read_payload(db_or_tx, thread_id, query, page_limit + 1, authorize,
        {"created_at DESC", "id DESC"}, "id", "failed to list projection cursors", after and after.id)
    if err then return nil, err end
    if authorize and event_count == nil then return nil, missing_thread() end
    local result = rows or {}
    if after and #result == 0 and not authorize then
        local anchors, anchor_err = sql.builder.select("id"):from("kickside_projection_cursor")
            :where(sql.builder.eq({ id = after.id, thread_id = thread_id }))
            :limit(1):run_with(db_or_tx):query()
        if anchor_err then
            return nil, (errors.wrap(anchor_err, "failed to resolve cursor anchor") :: error), nil
        end
        anchor_exists = anchors and #anchors > 0
    end
    if after and #result == 0 and not anchor_exists then
        return nil, errors.new({message = "cursors_cursor anchor no longer exists", kind = errors.INVALID})
    end
    local more = #result > page_limit
    if more then table.remove(result) end
    local last = result[#result]
    return result, nil, { has_more = more, next_after = more and { id = last.id } or nil }, event_count
end

function reader.find_projection_cursor(db_or_tx: Executor, thread_id: string, params: table,
    authorize: Authorize?): (table?, error?, table?)
    local kind = trim(params.kind)
    if kind == "" then
        return nil, (errors.new({ message = "kind is required", kind = errors.INVALID }) :: error)
    end
    local projection_key, cursor_key = trim(params.projection_key), trim(params.cursor_key)
    if projection_key == "" then projection_key = types.KEY_DEFAULT end
    if cursor_key == "" then cursor_key = types.KEY_DEFAULT end
    local query = sql.builder.select(
        "p.id AS projection_id", "p.body", "p.state", "p.last_event_seq", "p.actor_id",
        "p.created_at AS projection_created_at", "p.updated_at AS projection_updated_at",
        "CASE WHEN p.actor_id IS NOT NULL AND p.actor_id <> '' AND p.actor_context IS NOT NULL AND p.actor_context <> '' THEN 1 ELSE 0 END AS has_execution_identity",
        "c.id AS cursor_id", "c.thread_id", "c.cursor_key", "c.generation", "c.last_seq", "c.status",
        "c.last_error", "c.debounce_idle_ms", "c.debounce_max_ms", "c.job_id", "c.created_at", "c.updated_at",
        "p.kind", "p.projection_key")
        :from("kickside_projection_cursor c")
        :inner_join("kickside_projection p ON p.id = c.projection_id AND p.thread_id = c.thread_id")
        :where("c.thread_id = ?", thread_id)
        :where("p.kind = ?", kind)
        :where("p.projection_key = ?", projection_key)
        :where("c.cursor_key = ?", cursor_key)
    if params.pending_event_types then
        query = query:inner_join("kickside_thread source ON source.id = c.thread_id")
            :columns("source.event_count AS pending_head", "source.max_pruned_seq AS pending_pruned")
    end
    local rows, err, event_count = read_payload(db_or_tx, thread_id, query, 1, authorize, {}, "cursor_id", "failed to load projection cursor")
    if err then return nil, err end
    if authorize and event_count == nil then return nil, missing_thread() end
    if not rows or not rows[1] then
        return nil, (errors.new({ message = "projection cursor not found", kind = errors.NOT_FOUND }) :: error)
    end
    local row = rows[1]
    return { thread_id = thread_id,
        projection = { id = row.projection_id, thread_id = row.thread_id, kind = row.kind,
            projection_key = row.projection_key, body = row.body, state = row.state,
            last_event_seq = row.last_event_seq, actor_id = row.actor_id,
            has_execution_identity = row.has_execution_identity,
            created_at = row.projection_created_at, updated_at = row.projection_updated_at },
        cursor = { id = row.cursor_id, projection_id = row.projection_id, thread_id = row.thread_id,
            kind = row.kind, projection_key = row.projection_key, cursor_key = row.cursor_key,
            generation = row.generation, last_seq = row.last_seq, status = row.status,
            last_error = row.last_error, debounce_idle_ms = row.debounce_idle_ms,
            debounce_max_ms = row.debounce_max_ms, job_id = row.job_id,
            created_at = row.created_at, updated_at = row.updated_at },
    }, nil, params.pending_event_types and {event_count = row.pending_head, max_pruned_seq = row.pending_pruned} or nil
end

-- Count only a fixed sequence window. The thread/sequence index keeps this
-- bounded even when unrelated event types dominate a long pending backlog.
function reader.pending_events(db_or_tx: Executor, thread_id: string, thread: table, cursor: table,
    event_types: { string }, authorize: Authorize): (table?, error?)
    local last_seq = tonumber(cursor.last_seq)
    local head = tonumber(thread.event_count)
    if not last_seq or not head then
        return nil, errors.new({ message = "projection position is unavailable", kind = errors.INTERNAL })
    end
    local after = math.max(last_seq, tonumber(thread.max_pruned_seq) or 0)
    if head <= after then return { count = 0, truncated = false }, nil end

    local upper = math.min(head, after + PENDING_SEQUENCE_WINDOW)
    local window = sql.builder.select("type"):from("kickside_event")
        :where("thread_id = ? AND seq > ? AND seq <= ?", thread_id, after, upper)
        :order_by("seq ASC"):limit(PENDING_SEQUENCE_WINDOW)
    local window_sql, window_args = window:to_sql()
    local markers: { string } = {}
    for i = 1, #event_types do markers[i] = "?" end
    local count_query = sql.builder.select("COUNT(*) AS pending_count"):from("(SELECT 1) address")
        :inner_join("(" .. window_sql .. ") pending ON TRUE", table.unpack(window_args))
        :where("pending.type IN (" .. table.concat(markers, ",") .. ")", table.unpack(event_types))
    local query, build_err = event_access.authorized_query(db_or_tx, thread_id, count_query,
        sql.builder.select(), authorize, 1)
    if build_err then return nil, build_err end
    local rows, err = event_access.execute(db_or_tx, thread_id, query, authorize)
    if err then return nil, errors.wrap(err, "failed to count pending projection events") end
    local row = type(rows) == "table" and rows[1] or nil
    local access_err = event_access.verify(authorize, row)
    if access_err then return nil, access_err end
    local count = row and tonumber(row.pending_count)
    if not count then
        return nil, errors.new({ message = "pending projection event count is unavailable", kind = errors.INTERNAL })
    end
    return { count = count, truncated = upper < head }, nil
end

function reader.select_projection_cursor(db_or_tx: Executor, thread_id: string, params: table,
    authorize: Authorize?): (table?, error?, number?)
    local projection_query = sql.builder.select("id"):from("kickside_projection")
        :where(sql.builder.eq({ thread_id = thread_id, kind = trim(params.kind) }))
        :order_by("projection_key ASC"):limit(1)
    if type(params.projection_key) == "string" and params.projection_key ~= "" then
        projection_query = projection_query:where("projection_key = ?", trim(params.projection_key))
    end
    local cursor_query = sql.builder.select("id", "projection_id", "thread_id", "cursor_key", "status", "last_seq", "job_id", "generation")
        :from("kickside_projection_cursor")
        :where("thread_id = ?", thread_id)
        :order_by("created_at DESC"):order_by("id DESC")
    if type(params.cursor_key) == "string" and params.cursor_key ~= "" then
        cursor_query = cursor_query:where("cursor_key = ?", trim(params.cursor_key))
    end
    if authorize then
        local statement, args = projection_query:to_sql()
        cursor_query = cursor_query:where("projection_id = (" .. statement .. ")", table.unpack(args))
        local rows, err, event_count = read_payload(db_or_tx, thread_id, cursor_query, 1, authorize,
            {}, "id", "failed to select catch-up cursor")
        if err then return nil, err end
        if event_count == nil then return nil, missing_thread() end
        if not rows or not rows[1] then
            return nil, errors.new({message = "projection cursor not found", kind = errors.NOT_FOUND})
        end
        return rows[1], nil, event_count
    end
    local projections, projection_err = projection_query:run_with(db_or_tx):query()
    if projection_err then
        return nil, (errors.wrap(projection_err, "failed to select catch-up projection") :: error)
    end
    local projection = projections and projections[1]
    if not projection then
        return nil, (errors.new({ message = "projection not found", kind = errors.NOT_FOUND }) :: error)
    end
    cursor_query = cursor_query:where("projection_id = ?", projection.id)
    local cursors, cursor_err = cursor_query:limit(1):run_with(db_or_tx):query()
    if cursor_err then
        return nil, (errors.wrap(cursor_err, "failed to select catch-up cursor") :: error)
    end
    if not cursors or not cursors[1] then
        return nil, (errors.new({ message = "projection cursor not found", kind = errors.NOT_FOUND }) :: error)
    end
    return cursors[1], nil
end

function reader.catch_up_progress(db: Executor, thread_id: string, selected: table, authorize: Authorize): (table?, error?)
    -- Keep the selected source binding and resolve its live policy for this observation.
    if authorize.binding then
        local refresh_err = event_access.refresh_access(authorize, authorize.binding)
        if refresh_err then return nil, refresh_err end
    end
    local page = sql.builder.select("id", "last_seq", "status", "generation", "job_id")
        :from("kickside_projection_cursor"):where("id = ? AND thread_id = ?", selected.id, thread_id)
    local rows, err = read_payload(db, thread_id, page, 1, authorize, {}, "id", "projection cursor progress read failed")
    if err then return nil, err end
    local row = rows and rows[1]
    if not row or tonumber(row.generation) ~= tonumber(selected.generation) or row.job_id ~= selected.job_id then
        return nil, errors.new({kind = errors.CONFLICT, retryable = true, message = "projection catch-up cursor changed"})
    end
    return row, nil
end

-- find_cursor resolves one cursor for a thread. With a cursor_id it looks up
-- directly; otherwise it addresses the cursor by kind + projection_key +
-- cursor_key (KEY_DEFAULT filling the omitted keys). It takes a row lock so a
-- lifecycle action can mutate the resolved cursor in the same transaction.
function reader.find_cursor(db_or_tx: Executor, thread_id: string, params: table): (CursorRef?, error?)
    local lock, lock_err = lock_clause(db_or_tx)
    if lock_err then
        return nil, lock_err
    end
    local _lock = lock :: string

    local cursor_id = trim(params.cursor_id)
    if cursor_id ~= "" then
        local query = sql.builder.select("c.id", "c.projection_id", "c.thread_id", "c.status", "c.generation")
            :from("kickside_projection_cursor c")
            :where("c.id = ?", cursor_id)
            :where("c.thread_id = ?", thread_id)
        if _lock ~= "" then
            query = query:suffix(_lock)
        end
        local rows, err = query:run_with(db_or_tx):query()
        if err then
            return nil, (errors.wrap(err, "failed to load cursor") :: error)
        end
        if not rows or #rows == 0 then
            return nil, (errors.new({ message = "cursor not found", kind = errors.NOT_FOUND }) :: error)
        end
        return rows[1] :: CursorRef, nil
    end

    local kind = trim(params.kind)
    if kind == "" then
        return nil, (errors.new({ message = "kind or cursor_id is required", kind = errors.INVALID }) :: error)
    end
    local projection_key = trim(params.projection_key)
    if projection_key == "" then
        projection_key = types.KEY_DEFAULT
    end
    local cursor_key = trim(params.cursor_key)
    if cursor_key == "" then
        cursor_key = types.KEY_DEFAULT
    end

    local query = sql.builder.select("c.id", "c.projection_id", "c.thread_id", "c.status", "c.generation")
        :from("kickside_projection_cursor c")
        :inner_join("kickside_projection p ON p.id = c.projection_id")
        :where("c.thread_id = ?", thread_id)
        :where("p.kind = ?", kind)
        :where("p.projection_key = ?", projection_key)
        :where("c.cursor_key = ?", cursor_key)
    if _lock ~= "" then
        query = query:suffix(_lock)
    end
    local rows, err = query:run_with(db_or_tx):query()
    if err then
        return nil, (errors.wrap(err, "failed to load cursor") :: error)
    end
    if not rows or #rows == 0 then
        return nil, (errors.new({ message = "cursor not found", kind = errors.NOT_FOUND }) :: error)
    end
    return rows[1] :: CursorRef, nil
end

return reader
