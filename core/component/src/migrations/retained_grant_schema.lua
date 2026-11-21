-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
local ACCESS = "kickside_component_access"
local TYPED = "subject_type,subject_id,component_id,source_component_id"
local UNTYPED = "subject_id,component_id,source_component_id"
local indexes = {
    idx_kickside_component_access_subject_id = "subject_type,subject_id",
    idx_kickside_component_access_subject_component = "subject_type,subject_id,component_id",
    idx_kickside_component_access_subject_mask = "subject_type,subject_id,access_mask",
}

function M.query(tx, statement)
    local rows, err = tx:query(statement)
    if err then error(err) end
    return rows
end

function M.execute(tx, statement)
    local _, err = tx:execute(statement)
    if err then error(err) end
end

local function pg_key(tx)
    local keys = M.query(tx, [[SELECT con.conname AS name, string_agg(a.attname, ',' ORDER BY k.ord) AS cols
        FROM pg_constraint con CROSS JOIN LATERAL unnest(con.conkey) WITH ORDINALITY AS k(attnum,ord)
        JOIN pg_attribute a ON a.attrelid=con.conrelid AND a.attnum=k.attnum
        WHERE con.conrelid='kickside_component_access'::regclass AND con.contype='u' GROUP BY con.conname]])
    if #keys ~= 1 then error("unrecognized Component ACL uniqueness constraint") end
    return keys[1]
end

local function sqlite_key(tx)
    local keys = M.query(tx, [[SELECT i.name, (SELECT group_concat(name, ',') FROM
        (SELECT name FROM pragma_index_info(i.name) ORDER BY seqno)) AS cols
        FROM pragma_index_list('kickside_component_access') i WHERE i.origin='u']])
    if #keys ~= 1 then error("unrecognized Component ACL uniqueness constraint") end
    return keys[1]
end

function M.shape(tx, pg)
    local key = pg and pg_key(tx) or sqlite_key(tx)
    if key.cols ~= TYPED and key.cols ~= UNTYPED then error("unrecognized Component ACL key columns") end
    local rows = M.query(tx, pg and [[SELECT column_default AS value FROM information_schema.columns
        WHERE table_schema=current_schema() AND table_name='kickside_component_access' AND column_name='subject_type']]
        or [[SELECT dflt_value AS value FROM pragma_table_info('kickside_component_access') WHERE name='subject_type']])
    if #rows ~= 1 then error("missing Component ACL subject type") end
    local default = rows[1].value
    if default ~= nil and default ~= "'user'" and default ~= "'user'::text" then
        error("unrecognized Component ACL subject type default")
    end
    return key, key.cols == UNTYPED or default ~= nil
end

local function quote(name)
    return '"' .. name:gsub('"', '""') .. '"'
end

function M.postgres(tx, key)
    if #M.query(tx, [[SELECT 1 FROM pg_constraint WHERE contype='f'
        AND confrelid='kickside_component_access'::regclass LIMIT 1]]) > 0 then
        error("Component ACL conversion has an incoming foreign key")
    end
    M.execute(tx, "DELETE FROM " .. ACCESS .. " WHERE inherited<>0 OR subject_type='agent'")
    if key.cols == UNTYPED then
        M.execute(tx, "ALTER TABLE " .. ACCESS .. " DROP CONSTRAINT " .. quote(key.name)
            .. ", ADD CONSTRAINT uq_kickside_component_access_subject UNIQUE (" .. TYPED .. ")")
    end
    M.execute(tx, "ALTER TABLE " .. ACCESS .. " ALTER COLUMN subject_type DROP DEFAULT,"
        .. " DROP CONSTRAINT chk_kickside_component_access_subject_type,"
        .. " ADD CONSTRAINT chk_kickside_component_access_subject_type CHECK (subject_type IN ('user','group','service'))")
    for name, cols in pairs(indexes) do
        M.execute(tx, "DROP INDEX " .. name)
        M.execute(tx, "CREATE INDEX " .. name .. " ON " .. ACCESS .. "(" .. cols .. ")")
    end
end

function M.sqlite(tx, key)
    -- DROP TABLE may cascade into an extension table even with no explicit DELETE.
    if #M.query(tx, [[SELECT 1 FROM sqlite_schema s JOIN pragma_foreign_key_list(s.name) f
        WHERE s.type='table' AND f."table"='kickside_component_access' COLLATE NOCASE LIMIT 1]]) > 0 then
        error("Component ACL rebuild has an incoming foreign key")
    end
    local columns = "access_id,subject_id,component_id,source_component_id,access_mask,inherited,subject_type,created_at"
    if #M.query(tx, "PRAGMA table_xinfo(kickside_component_access)") ~= 8 then
        error("unrecognized Component ACL columns")
    end
    local objects = M.query(tx, [[SELECT name,sql FROM sqlite_schema WHERE tbl_name='kickside_component_access'
        AND type IN ('index','trigger') AND sql IS NOT NULL ORDER BY type,name]])
    local ddl = M.query(tx, "SELECT sql FROM sqlite_schema WHERE type='table' AND name='" .. ACCESS .. "'")[1].sql
    local renamed, n = ddl:gsub('^CREATE TABLE "?kickside_component_access"?', "CREATE TABLE kickside_acl_upgrade")
    if n ~= 1 then error("unrecognized Component ACL table definition") end
    local typed, checks = renamed:gsub("subject_type TEXT NOT NULL%s*(.-)CHECK%s*(%b())", function(default, check)
        local values = check:gsub("%s+", "")
        if not (default == "" or default:match("^DEFAULT%s+'user'%s*$")) or
            (values ~= "(subject_typeIN('user','group','agent'))" and values ~= "(subject_typeIN('user','group','service','agent'))"
            and values ~= "(subject_typeIN('user','group','service'))") then error("unrecognized Component ACL type check") end
        return "subject_type TEXT NOT NULL CHECK (subject_type IN ('user','group','service'))"
    end)
    if checks ~= 1 then error("missing Component ACL type check") end
    if key.cols == UNTYPED then
        typed, n = typed:gsub("UNIQUE%s*%(%s*subject_id%s*,%s*component_id%s*,%s*source_component_id%s*%)", "UNIQUE(" .. TYPED .. ")")
        if n ~= 1 then error("missing legacy Component ACL key") end
    end
    M.execute(tx, typed)
    M.execute(tx, "INSERT INTO kickside_acl_upgrade(rowid," .. columns .. ") SELECT rowid," .. columns
        .. " FROM " .. ACCESS .. " WHERE inherited=0 AND subject_type<>'agent'")
    M.execute(tx, "DROP TABLE " .. ACCESS)
    M.execute(tx, "ALTER TABLE kickside_acl_upgrade RENAME TO " .. ACCESS)
    for _, object in ipairs(objects) do
        local cols = indexes[object.name]
        M.execute(tx, cols and ("CREATE INDEX " .. object.name .. " ON " .. ACCESS .. "(" .. cols .. ")") or object.sql)
    end
end

return M
