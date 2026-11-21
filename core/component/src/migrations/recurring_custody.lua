-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local component_types = require("component_types")
local execution_identity = require("execution_identity")
local identity_ops = require("identity_ops")

local PAGE = 200
local RECURRING_TASK = "kickside.automation.recurring:task"

local function user_id(row, receipt)
    local context = json.decode(row.private_context)
    local identity = type(context) == "table" and context._execution_identity
    if not execution_identity.validate(identity) or identity.version ~= execution_identity.VERSION
        or identity.component_id ~= row.component_id then
        return nil
    end
    local principal, authorizer = identity.principal, identity.authorized_by
    if principal.kind ~= "user" or authorizer.kind ~= "user" or principal.id ~= authorizer.id then
        return nil
    end
    local canonical = identity_ops.canonical_identity(principal, authorizer, identity.component_id,
        identity.captured_at, identity.credential_id, identity.link_id)
    local initial_audit = identity_ops.audit_record("none", principal, authorizer,
        "initial:" .. row.component_id, "initial", 0, "initial", canonical)
    if row.identity_hash ~= canonical or receipt.record_json ~= initial_audit then return nil end

    -- The ordinary install outcome has exactly these fields. Its shape also
    -- distinguishes selected installs with caller-chosen request ids.
    local outcome = json.decode(receipt.outcome_json)
    if type(outcome) ~= "table" or outcome.component_id ~= row.component_id or outcome.generation ~= 1 then
        return nil
    end
    for key in pairs(outcome) do
        if key ~= "component_id" and key ~= "generation" then return nil end
    end
    return principal.id
end

local function enroll(tx, row, postgres)
    -- Keep a pending or later producer command from changing the proof while
    -- this page commits. Command writers lock this row before their receipts.
    local commands, command_err = tx:query([[
        SELECT automation_id FROM kickside_automation_command
         WHERE automation_id=$1 AND generation=1 AND pending_request_id IS NULL
        ]] .. (postgres and " FOR SHARE" or ""), {row.component_id})
    if command_err then error(command_err) end
    if not commands[1] then return end

    local receipts, read_err = tx:query([[
        SELECT a.record_json, o.outcome_json
          FROM kickside_component_declaration_fence f
          JOIN kickside_execution_identity_audit a ON a.component_id=f.component_id
          JOIN kickside_automation_op o ON o.automation_id=f.automation_id AND o.request_id=f.command_id
         WHERE f.component_id=$1 AND f.automation_id=$2
           AND f.command_id='install:' || f.automation_id AND f.applied_command_generation=1
           AND f.declaration_hash <> '' AND o.digest=f.declaration_hash
           AND o.generation=1 AND o.state='succeeded' AND o.completed_at IS NOT NULL AND o.outcome_json IS NOT NULL
           AND a.identity_generation=0 AND a.request_id='initial:' || f.automation_id
           AND NOT EXISTS (SELECT 1 FROM kickside_component_declaration_fence other
                            WHERE other.component_id=f.component_id AND other.automation_id<>f.automation_id)
        ]] .. (postgres and " FOR SHARE OF f,a,o" or ""), {row.component_id, row.component_id})
    if read_err then error(read_err) end
    local receipt = receipts[1]
    local owner_id = receipt and user_id(row, receipt)
    if not owner_id then return end
    local result, write_err = tx:execute([[
        UPDATE kickside_components SET owner_type='principal',owner_kind='user',owner_id=$1
         WHERE component_id=$2 AND secrets_incarnation=$3 AND owner_type='unresolved'
           AND custody_legacy=1 AND deleting_at IS NULL AND identity_generation=0 AND identity_hash=$4
        ]], {owner_id, row.component_id, row.secrets_incarnation, row.identity_hash})
    if write_err then error(write_err) end
    if tonumber(result.rows_affected) ~= 1 then error("recurring task custody update lost its component fence") end
end

-- The migration runner supplies the active transaction for the producer's
-- configured database. A shared resource lets Component lock the live row and
-- confirm both owners' records before writing the typed owner on that transaction.
return function(tx, cursor, postgres, producer_db_id)
    if producer_db_id ~= component_types.db_id() then return nil end
    local after = cursor and " AND component_id>$2 ORDER BY component_id LIMIT $3" or " ORDER BY component_id LIMIT $2"
    local args = cursor and {RECURRING_TASK, cursor, PAGE} or {RECURRING_TASK, PAGE}
    local rows, err = tx:query([[
        SELECT component_id,secrets_incarnation,CAST(private_context AS TEXT) AS private_context,identity_hash
          FROM kickside_components
         WHERE owner_type='unresolved' AND custody_legacy=1 AND impl_id=$1 AND deleting_at IS NULL
           AND secrets_incarnation IS NOT NULL AND identity_generation=0 AND identity_hash IS NOT NULL
        ]] .. after .. (postgres and " FOR UPDATE" or ""), args)
    if err then error(err) end
    for _, row in ipairs(rows) do enroll(tx, row, postgres) end
    return #rows == PAGE and rows[PAGE].component_id or nil
end
