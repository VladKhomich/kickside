-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local test = require("test")
local uuid = require("uuid")
local scratch = require("migration_scratch")

local PREFIX = "kickside.core.migrations:"
local ADOPT = PREFIX .. "21_legacy_thread_schema"
local LINK_SLOTS = PREFIX .. "22_legacy_projection_slots"
local exec, query = scratch.exec, scratch.query

local function base()
    scratch.reset()
    for _, name in ipairs({"01_thread", "02_projection", "06_graph", "07_retention_pins"}) do
        scratch.migrate(PREFIX .. name)
    end
end

local function legacy_schema()
    exec("DROP INDEX idx_thread_deleting")
    exec("DROP INDEX idx_kickside_event_retention_fresh")
    for _, column in ipairs({"max_pruned_seq", "deleting_at", "teardown_fence_cursor", "teardown_fence_done",
        "teardown_counts_json", "teardown_page_seq"}) do
        exec("ALTER TABLE kickside_thread DROP COLUMN " .. column)
    end
    exec("DROP TABLE kickside_projection_cursor")
    local ref = scratch.postgres() and "UUID" or "TEXT"
    exec(([[CREATE TABLE kickside_projection_cursor (
        id %s PRIMARY KEY, projection_id %s NOT NULL REFERENCES kickside_projection(id) ON DELETE CASCADE,
        thread_id %s NOT NULL REFERENCES kickside_thread(id) ON DELETE CASCADE,
        cursor_key TEXT NOT NULL DEFAULT 'default', last_seq INTEGER NOT NULL DEFAULT 0, target_seq INTEGER,
        batch_size INTEGER NOT NULL DEFAULT 200, status TEXT NOT NULL DEFAULT 'pending',
        locked_by TEXT, locked_at TEXT, last_error TEXT, attempts INTEGER NOT NULL DEFAULT 0, dead_at TEXT,
        generation BIGINT NOT NULL DEFAULT 1, dispatch_after TEXT, coalesce_key TEXT NOT NULL DEFAULT 'default',
        window_max_events INTEGER NOT NULL DEFAULT 1, window_idle_timeout_ms INTEGER NOT NULL DEFAULT 0,
        window_max_duration_ms INTEGER NOT NULL DEFAULT 0, window_opened_at_ms INTEGER,
        window_last_event_at_ms INTEGER, trigger_state TEXT, worker_runtime TEXT, dispatch_token TEXT,
        created_at TEXT NOT NULL DEFAULT '2026-09-23 00:00:00', updated_at TEXT NOT NULL DEFAULT '2026-09-23 00:00:00',
        UNIQUE(projection_id,cursor_key),
        CONSTRAINT kickside_projection_cursor_status_ck CHECK(status IN ('pending','running','live','caught_up','failed','paused','invalid')),
        CONSTRAINT kickside_projection_cursor_window_idle_ms_ck CHECK(window_idle_timeout_ms >= 0),
        CONSTRAINT kickside_projection_cursor_window_max_duration_ms_ck CHECK(window_max_duration_ms >= 0))]]):format(ref, ref, ref))
    exec("CREATE TABLE kickside_effect_intent (id TEXT PRIMARY KEY, cursor_id " .. ref
        .. " REFERENCES kickside_projection_cursor(id) ON DELETE SET NULL)")
end

local function jobs_schema()
    for _, name in ipairs({"04_jobs", "07_job_slots", "19_thread_cleanup", "22_capacity_groups", "24_lease_policy",
        "27_disabled_slots", "29_demand_rearm"}) do
        scratch.migrate("kickside.core.jobs.migrations:" .. name)
    end
end

local function define_tests()
    test.describe("historical Core schema adoption", function()
        test.it("preserves events, relationships, and projection fences across cursor cutover", function()
            base()
            legacy_schema()
            local thread, target, event, edge, projection = uuid.v7(), uuid.v7(), uuid.v7(), uuid.v7(), uuid.v7()
            exec("INSERT INTO kickside_thread (id,event_count) VALUES ($1,1),($2,3)", {thread,target})
            exec("INSERT INTO kickside_event (id,thread_id,type,seq,external_id) VALUES ($1,$2,'historical',1,'journal:fact')", {event,thread})
            local retained = uuid.v7()
            exec("INSERT INTO kickside_event (id,thread_id,type,seq) VALUES ($1,$2,'after-prune',3)", {retained,target})
            exec([[INSERT INTO kickside_thread_edge (id,from_thread_id,to_thread_id,edge_type,source_event_id)
                VALUES ($1,$2,$3,'related',$4)]], {edge,thread,target,event})
            exec([[INSERT INTO kickside_projection (id,thread_id,kind,actor_id,actor_context,last_event_seq)
                VALUES ($1,$2,'historical','owner','legacy-identity-bytes',1)]], {projection,thread})
            local cursors = {live=uuid.v7(), failed=uuid.v7(), invalid=uuid.v7()}
            for status, id in pairs(cursors) do
                exec([[INSERT INTO kickside_projection_cursor (id,projection_id,thread_id,cursor_key,status,last_seq,target_seq,generation,
                    window_idle_timeout_ms,window_max_duration_ms,last_error)
                    VALUES ($1,$2,$3,$4,$5,1,1,3,13,29,'retained')]], {id,projection,thread,status,status})
            end
            exec("INSERT INTO kickside_effect_intent (id,cursor_id) VALUES ('stored-effect',$1)", {cursors.live})

            scratch.migrate(ADOPT)
            scratch.migrate(ADOPT)
            local stored_event = query("SELECT id,seq,external_id FROM kickside_event WHERE thread_id=$1", {thread})[1]
            test.eq(stored_event.id,event)
            test.eq(tonumber(stored_event.seq),1)
            test.eq(stored_event.external_id,"journal:fact")
            test.eq(query("SELECT source_event_id FROM kickside_thread_edge WHERE id=$1", {edge})[1].source_event_id,event)
            test.eq(query("SELECT cursor_id FROM kickside_effect_intent WHERE id='stored-effect'")[1].cursor_id,cursors.live)
            for before, after in pairs({live="active",failed="paused",invalid="invalid"}) do
                local row = query("SELECT * FROM kickside_projection_cursor WHERE id=$1", {cursors[before]})[1]
                test.eq(row.projection_id,projection)
                test.eq(row.status,after)
                test.eq(tonumber(row.last_seq),1)
                test.eq(tonumber(row.generation),3)
                test.eq(tonumber(row.debounce_idle_ms),13)
                test.eq(tonumber(row.debounce_max_ms),29)
                test.eq(row.actor_id,"owner")
                test.eq(row.execution_identity_json,"legacy-identity-bytes")
                test.eq(row.last_error,"retained")
            end
            local thread_row = query("SELECT max_pruned_seq,teardown_page_seq,deleting_at FROM kickside_thread WHERE id=$1", {thread})[1]
            test.eq(tonumber(thread_row.max_pruned_seq),0)
            test.eq(tonumber(thread_row.teardown_page_seq),0)
            test.is_nil(thread_row.deleting_at)
            test.eq(tonumber(query("SELECT max_pruned_seq FROM kickside_thread WHERE id=$1", {target})[1].max_pruned_seq),2)
            test.eq(query("SELECT id FROM kickside_event WHERE thread_id=$1", {target})[1].id,retained)

            jobs_schema()
            scratch.migrate(LINK_SLOTS)
            scratch.migrate(LINK_SLOTS)
            for _, id in pairs(cursors) do
                local slot = query([[SELECT j.id,j.job_type,j.owner_id,j.scheduled_at FROM kickside_job j
                    JOIN kickside_projection_cursor c ON c.job_id=j.id WHERE c.id=$1]], {id})[1]
                test.not_nil(slot)
                test.eq(slot.job_type,"kickside.core.projections:advance")
                test.eq(slot.owner_id,thread)
                test.is_nil(slot.scheduled_at)
            end
            test.eq(tonumber(query("SELECT COUNT(*) AS n FROM kickside_job")[1].n),3)
            scratch.drop()
        end)

        test.it("preserves a current prune boundary and pin when run on the fresh schema", function()
            base()
            local thread = uuid.v7()
            exec("INSERT INTO kickside_thread (id,event_count,max_pruned_seq) VALUES ($1,7,5)", {thread})
            exec("INSERT INTO kickside_retention_pin (thread_id,consumer_key,cursor_seq) VALUES ($1,'held',6)", {thread})
            scratch.migrate(ADOPT)
            scratch.migrate(LINK_SLOTS)
            test.eq(tonumber(query("SELECT max_pruned_seq FROM kickside_thread WHERE id=$1", {thread})[1].max_pruned_seq),5)
            test.eq(tonumber(query("SELECT cursor_seq FROM kickside_retention_pin WHERE thread_id=$1", {thread})[1].cursor_seq),6)
            scratch.drop()
        end)
    end)
end

return test.run_cases(define_tests)
