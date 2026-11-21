-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local funcs = require("funcs")
local database = "app:retained_queue_db"
local thread = "00000000-0000-0000-0000-000000000011"
local job = "00000000-0000-0000-0000-000000000022"

local function migrate(name, receipt)
    local response, err = funcs.call("kickside.core.jobs.migrations:" .. name,
        {database_id = database, id = "jobs_test:" .. receipt, direction = "up"})
    if err then error(err) end
    return response
end

local function result(result)
    test.eq(result.status, "complete", tostring(result.error))
end

local function seed(db, pg)
    local key = pg and "UUID" or "TEXT"
    local schedule = pg and "timestamptz NOT NULL DEFAULT NOW()" or "TEXT NOT NULL DEFAULT (datetime('now'))"
    assert(db:execute("CREATE TABLE kickside_thread(id " .. key .. " PRIMARY KEY)"))
    assert(db:execute("INSERT INTO kickside_thread VALUES ($1)", {thread}))
    assert(db:execute("CREATE TABLE kickside_job(id " .. key .. " PRIMARY KEY,thread_id " .. key
        .. " NOT NULL REFERENCES kickside_thread(id) ON DELETE CASCADE, job_type TEXT, status TEXT, idempotency_key TEXT,"
        .. "finished_at TEXT, queue_tier TEXT, lease_until " .. (pg and "timestamptz" or "TEXT")
        .. ", scheduled_at " .. schedule .. ")"))
    assert(db:execute("CREATE TABLE kickside_job_run(id " .. key .. " PRIMARY KEY,job_id " .. key
        .. " REFERENCES kickside_job(id) ON DELETE CASCADE, thread_id " .. key
        .. " NOT NULL REFERENCES kickside_thread(id) ON DELETE CASCADE,attempt_no integer,started_at TEXT,finished_at TEXT,"
        .. "status TEXT CONSTRAINT kickside_job_run_status_ck CHECK(status IN ('running','success','failed','lease_lost','skipped')),"
        .. (pg and "CONSTRAINT uq_kickside_job_run_attempt " or "") .. "UNIQUE(job_id,attempt_no))"))
    assert(db:execute("CREATE UNIQUE INDEX uq_kickside_job_active_idempotency ON kickside_job(thread_id,idempotency_key)"))
    if pg then
        assert(db:execute("CREATE FUNCTION fixture_touch() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN RETURN NEW; END'"))
        assert(db:execute("CREATE TRIGGER trg_kickside_job_updated_at BEFORE UPDATE ON kickside_job FOR EACH ROW EXECUTE FUNCTION fixture_touch()"))
    end
    assert(db:execute("CREATE TABLE kickside_retention_policy(thread_id " .. key
        .. ",job_retention_days integer,job_run_retention_days integer,effect_retention_days integer,enabled "
        .. (pg and "boolean" or "integer") .. ")"))
    assert(db:execute("INSERT INTO kickside_retention_policy VALUES ($1,9,12,14,false)", {thread}))
    assert(db:execute("CREATE TABLE kickside_effect_intent(id text,thread_id text,finished_at text,status text)"))
    assert(db:execute([[INSERT INTO kickside_job(id,thread_id,job_type,status,idempotency_key,lease_until)
        VALUES ($1,$2,'chestor.journal.health','running','a:é','2099-01-01')]], {job, thread}))
    for seq = 1, 2 do
        assert(db:execute([[INSERT INTO kickside_job_run(id,job_id,thread_id,attempt_no,started_at,status)
            VALUES ($1,$2,$3,$4,'2026-01-01',$5)]],
            {"00000000-0000-0000-0000-00000000000" .. tostring(seq), job, thread, seq, seq == 1 and "failed" or "running"}))
    end
end

return {run = test.run_cases(function()
    test.describe("retained Jobs schema", function()
        test.it("adopts historical queue rows, lifetime history and existing cleanup receipts", function()
            local shared = assert(sql.get("app:db"))
            local pg = assert(shared:type()) == sql.type.POSTGRES
            if pg then
                assert(shared:execute("DROP SCHEMA IF EXISTS jobs_retained_migration_test CASCADE"))
                assert(shared:execute("CREATE SCHEMA jobs_retained_migration_test"))
            end
            shared:release()
            local db = assert(sql.get(database))
            seed(db, pg)
            db:release()
            local blocked = migrate("06_retained_queue", "historical")
            test.eq(blocked.failed, 1)
            test.is_true(string.find(tostring(blocked.error), "live or unprovable lease", 1, true) ~= nil)
            db = assert(sql.get(database))
            assert(db:execute("UPDATE kickside_job SET lease_until='2026-01-02',job_type='kickside.uploads.service:callback_job'"))
            db:release()
            blocked = migrate("06_retained_queue", "historical")
            test.eq(blocked.failed, 1)
            test.is_true(string.find(tostring(blocked.error), "no provable Jobs owner", 1, true) ~= nil)
            db = assert(sql.get(database))
            assert(db:execute("UPDATE kickside_job SET job_type='chestor.journal.health'"))
            db:release()
            result(migrate("06_retained_queue", "historical"))
            result(migrate("31_legacy_thread_cascades", "remove_cascades"))
            db = assert(sql.get(database))
            local row = assert(db:query("SELECT * FROM kickside_job"))[1]
            test.eq(tostring(row.id), job)
            test.eq(row.job_identity, "6:thread36:" .. thread .. "4:a:é")
            test.eq(tonumber(row.execution_seq), 2)
            test.eq(tostring(row.owner_id), thread)
            local runs = assert(db:query("SELECT execution_seq,attempt_no,status FROM kickside_job_run ORDER BY id"))
            test.eq(#runs, 2)
            test.eq(tonumber(runs[1].execution_seq), 1)
            test.eq(tonumber(runs[2].execution_seq), 2)
            test.eq(runs[1].status, "failed")
            test.eq(runs[2].status, "running")
            test.eq(tonumber(assert(db:query("SELECT effect_retention_days FROM kickside_job_retention_policy"))[1].effect_retention_days), 14)
            -- A pre-squash 19 receipt had already created the receipts table, but stored
            -- the live fence on the owner usage row. The next page is still outstanding.
            assert(db:execute("CREATE TABLE kickside_job_owner_usage(owner_kind text,owner_id text,thread_cleanup_started "
                .. (pg and "boolean" or "integer") .. ",thread_cleanup_next_page_seq bigint,thread_cleanup_completed_at text)"))
            assert(db:execute("INSERT INTO kickside_job_owner_usage VALUES ('thread',$1,true,2,NULL)", {thread}))
            assert(db:execute("CREATE TABLE kickside_job_thread_cleanup_receipt(thread_id text,page_seq bigint,unresolved_json text)"))
            assert(db:execute("INSERT INTO kickside_job_thread_cleanup_receipt VALUES($1,2,'[1]')", {thread}))
            assert(db:execute("UPDATE kickside_job SET status='done'"))
            db:release()
            blocked = migrate("06_retained_queue", "intermediate")
            test.eq(blocked.failed, 1)
            test.is_true(string.find(tostring(blocked.error), "cleanup receipt disagrees", 1, true) ~= nil)
            db = assert(sql.get(database))
            assert(db:execute("UPDATE kickside_job_thread_cleanup_receipt SET page_seq=1"))
            db:release()
            result(migrate("06_retained_queue", "intermediate"))
            result(migrate("06_retained_queue", "intermediate"))
            db = assert(sql.get(database))
            local fence = assert(db:query("SELECT thread_id,next_page_seq FROM kickside_job_thread_cleanup"))[1]
            test.eq(fence.thread_id, thread)
            test.eq(tonumber(fence.next_page_seq), 2)
            test.eq(assert(db:query("SELECT unresolved_json FROM kickside_job_thread_cleanup_receipt"))[1].unresolved_json, "[1]")
            db:release()
        end)
    end)
end)}
