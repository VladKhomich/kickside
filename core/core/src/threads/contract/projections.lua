-- kickside.core:threads projection management: register, list, catch up,
-- pause, resume, remove, attach and detach. Each method checks the caller's
-- access on the thread and delegates to the projections slice.

local sql = require("sql")
local time = require("time")
local writer = require("threads_writer")
local reader = require("threads_reader")
local proj_writer = require("proj_writer")
local proj_reader = require("proj_reader")
local page_cursor = require("page_cursor")
local proj_worker = require("proj_worker")
local masks = require("core_types")
local common = require("contract_common")
local error_envelope = require("error_envelope")
local committed_error = require("committed_error")
local is_str = common.is_str
local trim = common.trim
local normalize_int_arg = common.normalize_int_arg
local declared_identity = common.declared_identity
local open_db = common.open_db
local CATCH_UP_MS_PER_TICK = 1500

local M = {}

local function release(db: sql.DB, primary: error?, committed: boolean?): (error?, boolean)
    local _, err = db:release()
    if err then
        if primary then return error_envelope.wrap_secondary(err, primary, "projection DB release failed"), false end
        local source: error = err
        if committed then source = committed_error.new(source) end
        return errors.wrap(source, "projection DB release failed"), false
    end
    return primary, true
end

-- Confirm WRITE before a projection control mutation.
local function gate_thread_write(thread_id: string): (sql.DB?, error?)
    local db, db_err = open_db()
    if db_err then return nil, db_err end
    local _db = db :: sql.DB
    local _, gate_err = reader.gate_read(_db, thread_id, (masks.ACCESS.WRITE :: integer))
    if gate_err then return nil, (release(_db, gate_err)) end
    return _db, nil
end

-- register_projection defines a projection on a thread (reversible via
-- remove_projection). Component-backed threads require WRITE and, for restricted event kinds, ADMIN. Component lifecycle
-- threads require lifecycle ADMIN or a maintenance actor and use system identity.
function M.register_projection(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if not is_str(args.thread_id) then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end

    local binding, parse_err = proj_worker.parse(args.worker_ref :: string?, true)
    if parse_err or not binding then
        return nil, parse_err
    end

    local db, db_err = open_db()
    if db_err then return nil, db_err end
    local _db = db :: sql.DB
    local source, gate_err = reader.gate_projection_registration(_db, args.thread_id :: string)
    if gate_err then return nil, (release(_db, gate_err)) end
    local lifecycle_thread = source.lifecycle == true

    local identity, identity_load_err
    if lifecycle_thread then
        identity = {system = true}
    else
        identity, identity_load_err = declared_identity(args.thread_id :: string)
    end
    if identity_load_err or not identity then
        return nil, (release(_db, identity_load_err))
    end
    if identity.system == true and not lifecycle_thread and not common.is_maintenance_actor() then
        local err = errors.new({ message = "system projection identity requires a framework actor",
            kind = errors.PERMISSION_DENIED })
        return nil, (release(_db, err))
    end

    local validated, validate_err = proj_worker.validate(binding, identity.system == true)
    if validate_err or not validated then
        return nil, (release(_db, validate_err))
    end

    local register_args: { [string]: any } = {}
    for key, value in pairs(args :: table) do register_args[key] = value end
    register_args.worker_ref = (validated :: any).worker_ref
    register_args.execution_identity_row = nil
    register_args.execution_identity = nil
    register_args.system_identity = nil
    register_args.execution_identity_row = identity.row
    register_args.system_identity = identity.system == true

    local result, register_err = proj_writer.register_projection(_db, args.thread_id :: string, register_args, nil, nil, not lifecycle_thread and source or nil)
    register_err = release(_db, register_err, register_err == nil and result ~= nil)
    if register_err or not result then
        return nil, register_err
    end

    local projection_id = (result :: any).projection_id
    return {
        thread_id = args.thread_id,
        projection_id = projection_id,
        projection = result,
        rollback = is_str(projection_id) and {
            method = "remove_projection",
            args = { thread_id = args.thread_id, projection_id = projection_id },
        } or nil,
    }, nil
end

-- list_projections exposes projections and cursors under the event read policy.
-- This is the control-plane view automations use to inspect and clean
-- managed projections without importing persistence modules.
function M.list_projections(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if not is_str(args.thread_id) then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end
    local limit, limit_err = normalize_int_arg(args.limit, "limit", 1, 1000)
    if limit_err then return nil, limit_err end
    local projections_after, projections_after_err = page_cursor.decode(args.projections_cursor, args.thread_id, "projections")
    if projections_after_err then return nil, projections_after_err end
    local cursors_after, cursors_after_err = page_cursor.decode(args.cursors_cursor, args.thread_id, "cursors")
    if cursors_after_err then return nil, cursors_after_err end

    local db, db_err = open_db()
    if db_err then return nil, db_err end
    local _db = db :: sql.DB
    local authorize = {}
    local projections, projections_err, projections_page, event_count, missing =
        proj_reader.list_projections(_db, args.thread_id :: string, limit, projections_after, authorize)
    if projections_err then
        local err, released = release(_db, projections_err)
        if not missing or not released then return nil, err end
        -- Component-first lazy threads have no projections before their first attachment.
        return {thread_id = args.thread_id, event_count = 0, projections = {}, cursors = {}, count = 0,
            projections_has_more = false, cursors_has_more = false}, nil
    end
    local cursors, cursors_err, cursors_page =
        proj_reader.list_cursors(_db, args.thread_id :: string, limit, cursors_after, authorize)
    cursors_err = release(_db, cursors_err)
    if cursors_err then return nil, cursors_err end
    local result, page_err = page_cursor.response(args.thread_id, projections or {}, cursors or {}, projections_page, cursors_page)
    if page_err or not result then return nil, page_err end
    result.event_count = event_count
    return result, nil
end

function M.get_projection_cursor(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if not is_str(args.thread_id) or trim(args.thread_id) == "" then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end
    if not is_str(args.kind) or trim(args.kind) == "" then
        return nil, (errors.new({ message = "kind is required", kind = errors.INVALID }) :: error)
    end
    for _, key in ipairs({ "projection_key", "cursor_key" }) do
        if args[key] ~= nil and type(args[key]) ~= "string" then
            return nil, (errors.new({ message = key .. " must be a string", kind = errors.INVALID }) :: error)
        end
    end
    local pending_types = args.pending_event_types
    if pending_types ~= nil then
        if type(pending_types) ~= "table" or #pending_types < 1 or #pending_types > 16 then
            return nil, errors.new({ message = "pending_event_types requires 1 to 16 event types", kind = errors.INVALID })
        end
        for _, event_type in ipairs(pending_types) do
            if type(event_type) ~= "string" or trim(event_type) == "" or #event_type > 256 then
                return nil, errors.new({ message = "invalid pending event type", kind = errors.INVALID })
            end
        end
    end
    local db, db_err = open_db()
    if db_err then return nil, db_err end
    local authorize = {}
    local thread_id = args.thread_id :: string
    local pair, find_err, source = proj_reader.find_projection_cursor(db :: sql.DB, thread_id, args, authorize)
    if pair and not find_err and pending_types then
        pair.pending_events, find_err = proj_reader.pending_events(db :: sql.DB, thread_id, source :: table,
            pair.cursor, pending_types, authorize)
    end
    find_err = release(db :: sql.DB, find_err)
    if find_err then return nil, find_err end
    return pair, nil
end

local function deadline_passed(position: string): error
    return (errors.new({ message = "projection catch-up reached the caller's deadline before the cursor reached " .. position,
        kind = errors.UNAVAILABLE, retryable = true }) :: error)
end

-- catch_up_projection asks the supervised Jobs pool to advance one projection
-- cursor, then observes its committed progress under the event read policy. This is the
-- read-after-write consistency seam for components whose public read model is a
-- projection body: callers do not replay events or query private tables.
-- The caller's deadline (an RFC3339 instant), parsed at the contract boundary.
local function parse_deadline(value: any): (any?, error?)
    if value == nil then return nil, nil end
    if type(value) ~= "string" then
        return nil, (errors.new({ message = "deadline must be an RFC3339 instant", kind = errors.INVALID }) :: error)
    end
    local parsed, err = time.parse(time.RFC3339, value)
    if err or not parsed then
        return nil, (errors.new({ message = "deadline must be an RFC3339 instant", kind = errors.INVALID }) :: error)
    end
    return parsed, nil
end

-- A caller waits on the cursor's jobs slot (the pool runs awaited slots on
-- their own reserved capacity) at most until its own deadline when it names
-- one, else for max_ticks observation periods.
function M.catch_up_projection(args: any): (any?, error?)
    local cursor_waiters = require("cursor_waiters")
    args = type(args) == "table" and args or {}
    if not is_str(args.thread_id) then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end
    if not is_str(args.kind) then
        return nil, (errors.new({ message = "kind is required", kind = errors.INVALID }) :: error)
    end
    local max_ticks, max_err = normalize_int_arg(args.max_ticks, "max_ticks", 1, 1000)
    if max_err then return nil, max_err end
    max_ticks = max_ticks or 20
    local deadline, deadline_err = parse_deadline(args.deadline)
    if deadline_err then return nil, deadline_err end
    local target_seq: integer? = nil
    if args.target_seq ~= nil then
        target_seq = type(args.target_seq) == "number" and math.tointeger(args.target_seq) or nil
        if target_seq == nil or target_seq < 0 then
            return nil, (errors.new({ message = "target_seq must be a non-negative integer", kind = errors.INVALID }) :: error)
        end
    end

    local db, db_err = open_db()
    if db_err then return nil, db_err end
    local _db = db :: sql.DB

    local authorize = {}
    local selected, select_err, event_count =
        proj_reader.select_projection_cursor(_db, args.thread_id :: string, args, authorize)
    select_err = release(_db, select_err)
    if select_err or not selected then return nil, select_err end
    local head = math.floor(event_count or 0)
    if target_seq and target_seq > head then
        return nil, (errors.new({ message = "target_seq exceeds the thread head", kind = errors.INVALID }) :: error)
    end
    local projection_id = tostring(selected.projection_id)
    local cursor_id = tostring(selected.id)
    local job_id = selected.job_id
    local current_status = selected.status
    local initial_seq = tonumber(selected.last_seq)
    if current_status ~= "active" then
        return nil, (errors.new({ message = "projection cursor is not active", kind = errors.CONFLICT }) :: error)
    end
    if type(job_id) ~= "string" or job_id == "" then
        return nil, (errors.new({ message = "projection cursor has no jobs slot", kind = errors.INTERNAL }) :: error)
    end
    if initial_seq == nil then
        return nil, (errors.new({ message = "projection cursor sequence missing", kind = errors.INTERNAL }) :: error)
    end
    local target = target_seq or head
    local position = target_seq and "the target sequence" or "the thread head"
    local tick_limit = max_ticks :: integer
    local bound_ms = tick_limit * CATCH_UP_MS_PER_TICK
    local bounded_by_deadline = false
    if deadline then
        local remaining_ms = math.floor(((deadline :: any):sub(time.now()) :: any):milliseconds())
        if remaining_ms < 1 then return nil, deadline_passed(position) end
        if remaining_ms < bound_ms then bound_ms, bounded_by_deadline = remaining_ms, true end
    end
    if initial_seq >= target then
        return {
            thread_id = args.thread_id, projection_id = projection_id, cursor_id = cursor_id,
            event_count = head, target_seq = target_seq, last_seq = initial_seq, status = current_status,
            ticks = 0, max_ticks = max_ticks, processed = 0, done = true,
        }, nil
    end
    local waiter, waiter_err = cursor_waiters.begin_wait(cursor_id, target, bound_ms)
    if waiter_err or not waiter then return nil, waiter_err end
    local function close_wait(): () cursor_waiters.close_wait(waiter :: table) end
    local observations = 0
    local wake = true
    while true do
        -- Registration is acknowledged before this authoritative snapshot, so
        -- a commit racing the read is either visible here or queued to waiter.
        local progress_db, progress_db_err = open_db()
        if progress_db_err or not progress_db then
            close_wait()
            return nil, progress_db_err
        end
        local current, read_err
        if wake then
            local _, wake_err = proj_writer.wake_catch_up(progress_db, args.thread_id, selected, authorize)
            read_err = wake_err
            wake = false
        end
        if not read_err then current, read_err = proj_reader.catch_up_progress(progress_db, args.thread_id, selected, authorize) end
        read_err = release(progress_db :: sql.DB, read_err)
        if read_err then close_wait(); return nil, read_err end
        if not current then
            close_wait()
            return nil, (errors.new({ message = "projection cursor was removed", kind = errors.NOT_FOUND }) :: error)
        end
        local last_seq = tonumber(current.last_seq) or 0
        if last_seq >= target then
            close_wait()
            return {
                thread_id = args.thread_id, projection_id = projection_id, cursor_id = cursor_id,
                event_count = head, target_seq = target_seq, last_seq = last_seq, status = current.status,
                ticks = observations, max_ticks = max_ticks,
                processed = last_seq - initial_seq,
                done = true,
            }, nil
        end
        if current.status ~= "active" then
            close_wait()
            return nil, (errors.new({ message = "projection cursor stopped before reaching " .. position, kind = errors.CONFLICT }) :: error)
        end
        if observations >= tick_limit then
            close_wait()
            return nil, (errors.new({ message = "projection cursor did not reach " .. position .. " within the observation bound", kind = errors.INTERNAL, retryable = true }) :: error)
        end

        local _, timed_out, wait_err = cursor_waiters.wait_until_reached(waiter :: table)
        if wait_err then close_wait(); return nil, wait_err end
        if timed_out then
            close_wait()
            if bounded_by_deadline then return nil, deadline_passed(position) end
            return nil, (errors.new({ message = "projection cursor did not reach " .. position .. " within the wait bound", kind = errors.INTERNAL, retryable = true }) :: error)
        end
        observations = observations + 1
    end
end

function M.pause_projection(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if not is_str(args.thread_id) then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end

    local db, gate_err = gate_thread_write(args.thread_id :: string)
    if gate_err then return nil, gate_err end
    local _db = db :: sql.DB

    local result, pause_err = proj_writer.pause(_db, args.thread_id :: string, args, true)
    pause_err = release(_db, pause_err, pause_err == nil and result ~= nil)
    if pause_err or not result then
        return nil, pause_err
    end
    return {
        thread_id = args.thread_id,
        cursor_id = (result :: any).cursor_id,
        projection_id = (result :: any).projection_id,
        status = (result :: any).status,
        already_paused = (result :: any).already_paused,
    }, nil
end

function M.resume_projection(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if not is_str(args.thread_id) then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end

    local db, gate_err = gate_thread_write(args.thread_id :: string)
    if gate_err then return nil, gate_err end
    local _db = db :: sql.DB

    local result, resume_err = proj_writer.resume(_db, args.thread_id :: string, args, true)
    resume_err = release(_db, resume_err, resume_err == nil and result ~= nil)
    if resume_err or not result then
        return nil, resume_err
    end
    return {
        thread_id = args.thread_id,
        cursor_id = (result :: any).cursor_id,
        projection_id = (result :: any).projection_id,
        status = (result :: any).status,
        already_active = (result :: any).already_active,
    }, nil
end

-- remove_projection deletes a projection definition and its cursors after a WRITE
-- check. Returns { thread_id, projection_id }.
function M.remove_projection(args: any): (any?, error?)
    args = type(args) == "table" and args or {}
    if not is_str(args.thread_id) then
        return nil, (errors.new({ message = "thread_id is required", kind = errors.INVALID }) :: error)
    end

    local db, gate_err = gate_thread_write(args.thread_id :: string)
    if gate_err then return nil, gate_err end
    local _db = db :: sql.DB

    local result, remove_err = proj_writer.remove_projection(_db, args.thread_id :: string, {
        projection_id = args.projection_id,
        kind = args.kind,
        projection_key = args.projection_key,
    })
    remove_err = release(_db, remove_err, remove_err == nil and result ~= nil)
    if remove_err or not result then
        return nil, remove_err
    end
    return {
        thread_id = args.thread_id,
        projection_id = (result :: any).projection_id,
        removed_cursors = (result :: any).removed_cursors,
    }, nil
end

return M
