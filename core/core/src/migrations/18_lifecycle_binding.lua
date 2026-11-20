-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local lifecycle = require("lifecycle")
local threads_consts = require("threads_consts")
local threads_writer = require("threads_writer")
local retention_pin = require("retention_pin")
local persisted_json = require("persisted_json")
local clock = require("clock")
local sql = require("sql")

local function upgrade(tx: sql.Transaction, dialect: string)
    local id = lifecycle.thread_id()
    local locked, lock_err = threads_writer.lock_thread_rows_tx(tx, dialect, { id })
    if lock_err then error(lock_err) end
    if not locked or not locked[id] then return end

    local updated, binding_err = tx:execute([[UPDATE kickside_components AS c SET impl_id=$1
        WHERE c.component_id=$2 AND c.impl_id=$3
          AND EXISTS (SELECT 1 FROM kickside_thread t WHERE t.id=c.component_id
              AND t.component_id=CAST(c.component_id AS TEXT) AND t.thread_class=$4 AND t.deleting_at IS NULL)
          AND EXISTS (SELECT 1 FROM kickside_component_meta m WHERE m.component_id=c.component_id
              AND m.key=$5 AND m.value=$6)
          AND EXISTS (SELECT 1 FROM kickside_component_access g WHERE g.component_id=c.component_id
              AND g.subject_type='user' AND g.subject_id=$6 AND g.access_mask=15 AND g.inherited=0
              AND g.source_component_id=CAST(c.component_id AS TEXT))
          AND NOT EXISTS (SELECT 1 FROM kickside_component_thread_reap r
              WHERE r.component_id=CAST(c.component_id AS TEXT))]],
        { "kickside.core.lifecycle:system_lifecycle", id, threads_consts.THREAD_IMPL_ID,
            lifecycle.CLASS, lifecycle.OWNER_META_KEY, lifecycle.SYSTEM_ACTOR })
    if binding_err then error(binding_err) end
    if not updated then error("lifecycle binding update returned no result") end
    if updated.rows_affected == 0 then return end
    if updated.rows_affected ~= 1 then error("invalid lifecycle binding update count") end

    local rows, cursor_err = tx:query([[SELECT p.id AS projection_id,p.body,k.id,k.generation,k.status
        FROM kickside_projection p
        JOIN kickside_projection_cursor k ON k.projection_id=p.id AND k.thread_id=p.thread_id
        JOIN kickside_thread t ON t.id=p.thread_id
        WHERE p.thread_id=$1 AND p.kind='lifecycle.reap' AND p.projection_key='default' AND k.cursor_key='default'
          AND p.actor_id IS NULL AND p.actor_context IS NULL
          AND k.actor_id IS NULL AND k.execution_identity_json IS NULL
          AND k.last_seq>=t.max_pruned_seq
          AND (k.status='active' OR (k.status='invalid' AND k.last_error='thread_event_read_denied: access denied'))]], { id })
    if cursor_err then error(cursor_err) end
    local reaper = rows and rows[1]
    if not reaper then return end
    local body, body_err = persisted_json.decode_table(reaper.body, "lifecycle reaper declaration")
    if body_err then error(body_err) end
    local meta = body and body.meta
    if type(meta) ~= "table" or meta.worker_ref ~= "func://kickside.core.lifecycle:reaper"
        or meta.worker_input_mode ~= "prefetch_events" then return end

    local now = clock.now(dialect)
    if reaper.status == "invalid" then
        local consumer_key = "projection:" .. tostring(reaper.id)
        local held, read_err = retention_pin.read(tx, id, consumer_key)
        if read_err then error(read_err) end
        if held then
            local _, release_err = retention_pin.release_tx(tx, { thread_id = id, consumer_key = consumer_key,
                expected_pin_generation = held.generation,
                terminal_op_id = tostring(reaper.id) .. ":lifecycle-binding:" .. tostring(reaper.generation) })
            if release_err then error(release_err) end
        end
        local _, state_err = tx:execute([[UPDATE kickside_projection SET state='pending',updated_at=$1
            WHERE id=$2 AND state='invalid']], { now, reaper.projection_id })
        if state_err then error(state_err) end
    end

    -- Fence snapshots of the legacy binding. After commit lifecycle
    -- convergence rearms the disabled Jobs slot at the saved checkpoint.
    local recovered, recover_err = tx:execute([[UPDATE kickside_projection_cursor
        SET status='active',generation=generation+1,
            last_error=CASE WHEN status='invalid' THEN NULL ELSE last_error END,updated_at=$1
        WHERE id=$2 AND generation=$3]], { now, reaper.id, reaper.generation })
    if recover_err then error(recover_err) end
    if not recovered or recovered.rows_affected ~= 1 then error("lifecycle reaper cursor recovery affected an unexpected row count") end
end

return require("migration").define(function()
    migration("18 repair the lifecycle singleton binding", function()
        database("postgres", function()
            up(function(tx) upgrade(tx, sql.type.POSTGRES) end)
        end)
        database("sqlite", function()
            up(function(tx) upgrade(tx, sql.type.SQLITE) end)
        end)
    end)
end)
