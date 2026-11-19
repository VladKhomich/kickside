-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Event and projection payloads carry their component binding from the same SQL statement.
local sql = require("sql")
local event_declaration = require("event_declaration")
local uuid = require("uuid")
local consts = require("threads_consts")
local component_query = require("component_query")
local masks = require("core_types")

local M = {}

M.binding_columns = {"t.component_id", "c.impl_id AS component_impl_id",
    "CAST(c.created_at AS TEXT) AS component_incarnation",
    "CAST(t.created_at AS TEXT) AS thread_incarnation"}

-- The thread's link is text on both engines and can contain historical non-UUID
-- values. Cast the link on PostgreSQL, keeping the component primary key usable.
function M.component_key(db: any, dbtype: string?): (string?, error?)
    local dialect, err = dbtype, nil
    if not dialect then
        if db.db_type then dialect, err = db:db_type()
        else dialect, err = db:type() end
    end
    if err then return nil, err end
    if dialect == sql.type.SQLITE then return "t.component_id", nil end
    if dialect == sql.type.POSTGRES then
        return [[CASE WHEN t.component_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                 THEN CAST(t.component_id AS UUID) END]], nil
    end
    return nil, errors.new({kind = errors.INTERNAL, message = "thread component lookup requires a database type"})
end

function M.clear_binding(row: table)
    row.component_id, row.component_impl_id, row.component_incarnation, row.thread_incarnation = nil, nil, nil, nil
    row.payload_allowed = nil
end

function M.component_join(key: string): string
    return "kickside_components c ON c.component_id = " .. key
        .. " AND NOT EXISTS (SELECT 1 FROM kickside_component_thread_reap r WHERE r.component_id=CAST(c.component_id AS TEXT))"
end

function M.same_binding(a: table, b: table): boolean
    return a.component_id == b.component_id and a.component_impl_id == b.component_impl_id
        and a.component_incarnation == b.component_incarnation and a.thread_incarnation == b.thread_incarnation
end

function M.restricted(impl_id: any, snapshot: any?): (boolean, error?)
    if impl_id == nil or impl_id == consts.THREAD_IMPL_ID then return false, nil end
    if type(impl_id) ~= "string" or impl_id == "" then
        return false, errors.new({kind = errors.INTERNAL, message = "thread component kind is invalid"})
    end
    local restricted, err = event_declaration.read_policy(impl_id, snapshot)
    if err then return false, err end
    if type(restricted) ~= "boolean" then
        return false, errors.new({kind = errors.INTERNAL, message = "thread declaration returned no event policy"})
    end
    return restricted, nil
end

function M.binding_query(db: any, thread_id: string, query: any): (any?, error?)
    local key, err = M.component_key(db)
    if err then return nil, err end
    query = query:columns(table.unpack(M.binding_columns))
        :from("kickside_thread t")
        :left_join(M.component_join(key :: string))
    return query:where("t.id = ?", thread_id), nil
end

local function source_query(db: any, thread_id: string, query: any, lazy: boolean?): (any?, error?)
    if not lazy then return M.binding_query(db, thread_id, query) end
    local key, err = M.component_key(db)
    if err then return nil, err end
    -- An addressed read model also supports a Component with no primary thread
    -- yet. A populated thread link never falls back to the address.
    local fallback = uuid.validate(thread_id) and "?" or "NULL"
    local from = query:from("(SELECT 1) address")
        :left_join("kickside_thread t ON t.id = ?", thread_id)
        :columns("COALESCE(NULLIF(t.component_id,''), CAST(c.component_id AS TEXT)) AS component_id",
            table.unpack(M.binding_columns, 2))
    local join = M.component_join("CASE WHEN t.component_id IS NULL OR t.component_id = '' THEN "
        .. fallback .. " ELSE " .. (key :: string) .. " END")
    if fallback == "?" then return from:left_join(join, thread_id), nil end
    return from:left_join(join), nil
end

local function changed(): error
    return errors.new({kind = errors.CONFLICT, retryable = true, message = "thread payload binding changed"})
end

function M.denied(): error
    return errors.new({kind = errors.PERMISSION_DENIED, retryable = false, message = "access denied",
        details = {code = "thread_event_read_denied"}})
end

function M.read_mask(restricted: boolean): integer
    return restricted and masks.ACCESS.ADMIN or masks.ACCESS.READ
end

function M.component_matches(query: any, binding: table): any
    return query:where("c.impl_id = ? AND CAST(c.created_at AS TEXT) = ?",
        binding.component_impl_id, binding.component_incarnation)
end

function M.refresh_access(request: table, binding: table): error?
    local restricted, policy_err = M.restricted(binding.component_impl_id)
    if policy_err then return policy_err end
    local mask = M.read_mask(restricted)
    if request.write then mask = restricted and (masks.ACCESS.WRITE + masks.ACCESS.ADMIN) or masks.ACCESS.WRITE end
    if request.admin then mask = masks.ACCESS.ADMIN end
    local acl, acl_err = component_query.snapshot_access(binding.component_id, mask)
    if acl_err then return acl_err end
    request.binding = binding
    request.acl = acl
    return nil
end

function M.bind(db: any, thread_id: string, request: table): error?
    if request.binding then return nil end
    local query, build_err = source_query(db, thread_id, sql.builder.select(), request.lazy)
    if build_err then return build_err end
    local rows, err = M.raw_with(db, "", {}, query)
    if err then return errors.wrap(err, "failed to resolve thread payload binding") end
    if type(rows) ~= "table" then
        return errors.new({kind = errors.INTERNAL, retryable = false, message = "thread binding query returned no rows result",
            details = {code = "thread_payload_binding_response"}})
    end
    local binding = rows[1]
    if not binding then
        request.missing = true
        return errors.new({kind = errors.NOT_FOUND, message = "thread not found",
            details = {code = "thread_access_not_found"}})
    end
    if type(binding.component_incarnation) ~= "string" then return M.denied() end
    return M.refresh_access(request, binding)
end

-- The source is selected before consulting the registry. All exposed rows,
-- including empty results, then use one statement with a fresh binding and ACL
-- proof. A zero limit skips the payload query entirely when eligibility fails,
-- including the event index walk on SQLite.
function M.limit_payload(payload: any, limit: integer): any
    return payload:suffix("LIMIT CASE WHEN EXISTS (SELECT 1 FROM eligible) THEN ? ELSE 0 END", limit)
end

function M.authorized_query(db: any, thread_id: string, payload: any, query: any, request: table,
    limit: integer?): (any?, error?)
    local bind_err = M.bind(db, thread_id, request)
    if bind_err then return nil, bind_err end
    query, bind_err = source_query(db, thread_id, query, request.lazy)
    if bind_err then return nil, bind_err end
    query = query:columns("CASE WHEN EXISTS (SELECT 1 FROM eligible) THEN 1 ELSE 0 END AS payload_allowed")
    if payload then
        local statement, args = M.limit_payload(payload, limit :: integer):to_sql()
        query = query:columns("payload.*"):left_join("(" .. statement .. ") payload ON TRUE", table.unpack(args or {}))
    end
    return query, nil
end

function M.raw_with(db: any, cte: string, cte_args: table, query: any): (any?, error?)
    local statement, args = query:to_sql()
    local params = {}
    for _, value in ipairs(cte_args) do params[#params + 1] = value end
    for _, value in ipairs(args or {}) do params[#params + 1] = value end
    local index = 0
    local numbered = (cte == "" and statement or cte .. " " .. statement):gsub("%?", function()
        index = index + 1
        return "$" .. tostring(index)
    end)
    return db:query(numbered, params)
end

function M.execute(db: any, thread_id: string, query: any, request: table): (any?, error?)
    local binding = request.binding
    local acl_statement, acl_args = request.acl:to_sql()
    local proof, err = source_query(db, thread_id, sql.builder.select("1"), request.lazy)
    if err then return nil, err end
    proof = M.component_matches(proof, binding)
        :where("c.component_id IN (" .. acl_statement .. ")", table.unpack(acl_args))
    if binding.thread_incarnation then
        proof = proof:where("CAST(t.created_at AS TEXT) = ?", binding.thread_incarnation)
    else
        proof = proof:where("t.id IS NULL")
    end
    local sql_text, args = proof:to_sql()
    return M.raw_with(db, "WITH eligible AS MATERIALIZED (" .. sql_text .. ")", args, query)
end

function M.verify(request: table, row: table?): error?
    if not row or not M.same_binding(request.binding, row) then return changed() end
    if row.payload_allowed ~= 1 then return M.denied() end
    return nil
end

function M.check(db: any, thread_id: string, request: table): error?
    local query, err = M.authorized_query(db, thread_id, nil, sql.builder.select(), request)
    if err then return err end
    local rows, read_err = M.execute(db, thread_id, query, request)
    if read_err then return read_err end
    if type(rows) ~= "table" then
        return errors.new({kind = errors.INTERNAL, message = "thread authorization returned no rows result"})
    end
    return M.verify(request, rows[1])
end

return M
