-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local json = require("json")
local fields = require("secret_fields")
local document = require("secrets_document")
local types = require("component_types")
local persisted_json = require("persisted_json")
local cleanup = require("error_envelope").cleanup

type Report = {converted: integer, invalid: integer, needs_continue: boolean}
type Candidate = {component_id: string, impl_id: string, private_context: unknown,
    encrypted_secrets: string?, secrets_generation: integer?, secrets_incarnation: string?}
type Change = {id: string, context: string?, secret: types.SecretWrite?}
type Scan = {cursor: string?, upper: string?, complete: boolean, revision: string}
type Parameter = string | integer
local M = {}

local scan_revision: string? = nil
local scans: {[string]: Scan} = {}
local next_kind = 1

local function prepare(row: Candidate, kind: types.SecretKind): (Change?, error?)
    local raw = row.private_context
    if raw == nil or raw == "" then raw = "{}" end
    local context, decode_err = persisted_json.decode_table(raw, "component.private_context")
    if decode_err then return nil, decode_err end
    if row.encrypted_secrets ~= nil then
        local stored, paths_err = document.paths(row.encrypted_secrets, row.secrets_generation, row.secrets_incarnation)
        if paths_err then return nil, paths_err end
        local effective, declaration_err = fields.combine(kind.meta.secret_fields, stored :: types.SecretField[])
        if declaration_err then return nil, declaration_err end
        if #effective == #stored and fields.complete(effective, context :: types.JsonMap) then
            return {id = row.component_id}, nil
        end
        local secrets, decrypt_err = document.decode(row.component_id, row.encrypted_secrets, row.secrets_generation, row.secrets_incarnation)
        if decrypt_err then return nil, decrypt_err end
        local merged, merge_err = fields.merge(stored :: types.SecretField[], context :: types.JsonMap, secrets :: types.JsonMap)
        if merge_err then return nil, merge_err end
        context = merged
    end
    local visible, secret_write, prepare_err = document.prepare(row.component_id, row.impl_id, context :: types.JsonMap,
        row.encrypted_secrets, row.secrets_generation, row.secrets_incarnation)
    if prepare_err then return nil, prepare_err end
    local encoded, encode_err = json.encode(visible)
    if encode_err then return nil, encode_err end
    return {id = row.component_id, context = encoded, secret = secret_write}, nil
end

local function invalid_row(err: error): boolean
    local details = err:details()
    local code = type(details) == "table" and details.code or nil
    return code == "component_secrets_integrity" or code == "component_secrets_envelope"
        or code == "component_secrets_cannot_decrypt" or code == "component_secrets_inconsistent"
        or code == "component_secret_field" or code == "persisted_data"
end

-- Each selected valid row is updated once, with ciphertext/plaintext and the
-- declaration revision in the same batch statement. Context revisions stay put.
local function write_batch(tx: sql.Transaction, changes: {Change}, revision: string): error?
    if #changes == 0 then return nil end
    local parameters: {Parameter} = {revision}
    local ids: {string} = {}
    local references: {[string]: string} = {}
    local function bind(value: Parameter): string
        parameters[#parameters + 1] = value
        return "$" .. tostring(#parameters)
    end
    local function reference(id: string): string
        if not references[id] then references[id] = bind(id) end
        return references[id]
    end
    local assignments: {string} = {"secrets_revision=$1"}
    -- SQLite assigns named parameter positions in SQL occurrence order.
    for _, column in ipairs({"private_context", "encrypted_secrets", "secrets_generation", "secrets_incarnation"}) do
        local cases: {string} = {}
        for _, change in ipairs(changes) do
            if change.secret then
                local value: Parameter
                if column == "private_context" then value = change.context :: string
                elseif column == "encrypted_secrets" then value = change.secret.encrypted :: string
                elseif column == "secrets_generation" then value = change.secret.generation
                else value = change.secret.incarnation end
                local id = reference(change.id)
                cases[#cases + 1] = "WHEN " .. id .. " THEN " .. bind(value)
            end
        end
        if #cases > 0 then
            assignments[#assignments + 1] = column .. "=CASE component_id "
                .. table.concat(cases, " ") .. " ELSE " .. column .. " END"
        end
    end
    for _, change in ipairs(changes) do ids[#ids + 1] = reference(change.id) end
    local _, write_err = tx:execute("UPDATE kickside_components SET " .. table.concat(assignments, ",")
        .. " WHERE component_id IN (" .. table.concat(ids, ",") .. ")", parameters)
    return write_err
end

local function unfinished(): boolean
    for _, scan in pairs(scans) do if not scan.complete then return true end end
    return false
end

-- The existing (impl_id, component_id) index bounds each kind's traversal.
-- Registry churn alone never makes converted rows candidates again.
local function begin_pass(db: sql.DB, kinds: types.SecretKind[], fresh: boolean): error?
    local updated: {[string]: Scan} = {}
    for _, kind in ipairs(kinds) do
        local prior = scans[kind.id]
        if not fresh and prior and prior.revision == kind.revision then
            updated[kind.id] = prior
        else
            local rows, err = db:query("SELECT component_id FROM kickside_components WHERE impl_id=$1 ORDER BY component_id DESC LIMIT 1", {kind.id})
            if err then return err end
            updated[kind.id] = {upper = rows[1] and rows[1].component_id or nil,
                complete = #rows == 0, revision = kind.revision :: string}
        end
    end
    scans = updated
    return nil
end

local function window(db: sql.DB, engine: string, kind: types.SecretKind, scan: Scan,
    limit: integer): (integer?, integer?, integer?, error?)
    local tx, begin_err = db:begin()
    if begin_err then return nil, nil, nil, begin_err end
    local parameters: {Parameter} = {kind.id, scan.upper :: string, kind.revision :: string}
    local filter = ""
    if scan.cursor then parameters[4] = scan.cursor; filter = " AND component_id > $4" end
    local rows, primary = tx:query([[SELECT component_id,impl_id,private_context,encrypted_secrets,secrets_generation,secrets_incarnation
        FROM kickside_components WHERE impl_id=$1 AND component_id <= $2
        AND (secrets_revision IS NULL OR secrets_revision <> $3)]] .. filter
        .. " ORDER BY component_id LIMIT " .. tostring(limit + 1)
        .. (engine == sql.type.POSTGRES and " FOR UPDATE" or ""), parameters)
    local changes: {Change} = {}
    local converted, invalid, processed = 0, 0, 0
    local cursor = scan.cursor
    if not primary then
        processed = math.min(limit, #rows)
        for index = 1, processed do
            local row = rows[index] :: Candidate
            local change, prepare_err = prepare(row, kind)
            if prepare_err then
                if invalid_row(prepare_err) then invalid = invalid + 1
                else primary = prepare_err; break end
            elseif change then
                changes[#changes + 1] = change
                if change.secret then converted = converted + 1 end
            end
            cursor = row.component_id
        end
    end
    if not primary then primary = write_batch(tx, changes, kind.revision :: string) end
    if primary then
        return nil, nil, nil, cleanup(function(): (boolean?, error?) return tx:rollback() end,
            primary, "rollback component secret migration batch")
    end
    local _, commit_err = tx:commit()
    if commit_err then return nil, nil, nil, commit_err end
    scan.cursor = cursor
    scan.complete = #rows <= limit
    return converted, invalid, processed, nil
end

function M.run(limit: integer): (Report?, error?)
    if limit < 1 or limit > 50 or limit % 1 ~= 0 then
        return nil, errors.new({kind = errors.INVALID, message = "component secret migration batch must be 1..50"})
    end
    local kinds, revision, declaration_err = fields.declarations()
    if declaration_err then return nil, declaration_err end
    if revision == nil then return nil, errors.new({kind = errors.INTERNAL, retryable = false,
        message = "component secret declaration revision is unavailable"}) end
    local declared = kinds or {}
    local db, db_err = sql.get(types.db_id())
    if db_err then return nil, db_err end
    local engine, primary = db:type()
    if not primary and (scan_revision ~= revision or not unfinished()) then
        primary = begin_pass(db, declared, not unfinished())
        if not primary then scan_revision = revision end
    end
    local report: Report = {converted = 0, invalid = 0, needs_continue = false}
    local attempted = 0
    local first = next_kind
    for offset = 0, #declared - 1 do
        if primary or attempted == limit then break end
        local index = (first - 1 + offset) % #declared + 1
        local kind = declared[index]
        local scan = scans[kind.id]
        next_kind = index % #declared + 1
        if scan and not scan.complete then
            local converted, invalid, processed, window_err = window(db, engine :: string, kind, scan, limit - attempted)
            primary = window_err
            if not primary then
                attempted = attempted + (processed :: integer)
                report.converted = report.converted + (converted :: integer)
                report.invalid = report.invalid + (invalid :: integer)
            end
        end
    end
    report.needs_continue = unfinished()
    primary = cleanup(function(): (boolean?, error?) return db:release() end, primary, "release component secret migration database")
    if primary then return nil, primary end
    return report, nil
end

return M
