-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("retained_sql")
local M = {}

function M.expand(db)
    -- Extra enabled triggers could write outside the Jobs transaction's intended
    -- data set during the owner and history backfill.
    sql.require_empty(db, [[SELECT tgname AS id FROM pg_trigger WHERE
        tgrelid IN ('kickside_job'::regclass,'kickside_job_run'::regclass) AND NOT tgisinternal
        AND tgenabled<>'D' AND NOT (tgrelid='kickside_job'::regclass
            AND tgname='trg_kickside_job_updated_at' AND tgenabled='O') LIMIT 1]], "unrecognized queue trigger")
    if #sql.rows(db, [[SELECT 1 FROM pg_trigger WHERE tgrelid='kickside_job'::regclass
        AND tgname='trg_kickside_job_updated_at' AND tgenabled='O']]) ~= 1 then
        sql.refuse("missing enabled historical updated_at trigger")
    end
    sql.exec(db, [[ALTER TABLE kickside_job
        ALTER COLUMN thread_id DROP NOT NULL, ALTER COLUMN scheduled_at DROP NOT NULL, ALTER COLUMN scheduled_at DROP DEFAULT,
        ADD COLUMN job_identity text, ADD COLUMN slot boolean NOT NULL DEFAULT false,
        ADD COLUMN wake_key text, ADD COLUMN wake_enabled boolean NOT NULL DEFAULT true, ADD COLUMN wake_demand_at timestamptz,
        ADD COLUMN wake_generation bigint NOT NULL DEFAULT 0, ADD COLUMN wake_control_pending boolean NOT NULL DEFAULT false,
        ADD COLUMN execution_seq bigint NOT NULL DEFAULT 0, ADD COLUMN registry_version text,
        ADD COLUMN owner_kind text, ADD COLUMN owner_id text]])
    sql.exec(db, [[ALTER TABLE kickside_job_run ALTER COLUMN thread_id DROP NOT NULL,
        ADD COLUMN execution_seq bigint, ADD COLUMN owner_kind text, ADD COLUMN owner_id text,
        DROP CONSTRAINT uq_kickside_job_run_attempt, DROP CONSTRAINT kickside_job_run_status_ck,
        ADD CONSTRAINT kickside_job_run_status_ck CHECK (status IN ('running','success','failed','lease_lost','skipped','completed','parked'))]])
    -- Preserve updated_at during the historical backfill. The trigger change is
    -- transactional, and the exclusive queue lock prevents concurrent writes.
    sql.exec(db, "ALTER TABLE kickside_job DISABLE TRIGGER trg_kickside_job_updated_at")
    sql.exec(db, [[UPDATE kickside_job SET owner_kind='thread',owner_id=thread_id::text,
        job_identity=CASE WHEN idempotency_key IS NOT NULL AND idempotency_key<>'' THEN
          '6:thread'||octet_length(thread_id::text)||':'||thread_id::text||octet_length(idempotency_key)||':'||idempotency_key
          ELSE '7:oneshot'||octet_length(id::text)||':'||id::text||octet_length(id::text)||':'||id::text END]])
    sql.exec(db, [[WITH ranked AS (
          SELECT id,row_number() OVER(PARTITION BY job_id ORDER BY started_at,id) AS seq FROM kickside_job_run)
        UPDATE kickside_job_run r SET execution_seq=ranked.seq,owner_kind=j.owner_kind,owner_id=j.owner_id
        FROM ranked,kickside_job j WHERE ranked.id=r.id AND j.id=r.job_id]])
    sql.exec(db, [[UPDATE kickside_job j SET execution_seq=h.total FROM
        (SELECT job_id,count(*) AS total FROM kickside_job_run GROUP BY job_id) h WHERE h.job_id=j.id]])
    sql.exec(db, "ALTER TABLE kickside_job ENABLE TRIGGER trg_kickside_job_updated_at")
    sql.exec(db, [[ALTER TABLE kickside_job ALTER COLUMN job_identity SET NOT NULL,
        ADD CONSTRAINT kickside_job_identity_ck CHECK(job_identity<>''),
        ALTER COLUMN owner_kind SET NOT NULL, ALTER COLUMN owner_id SET NOT NULL]])
    sql.exec(db, [[ALTER TABLE kickside_job_run ALTER COLUMN execution_seq SET NOT NULL,
        ALTER COLUMN owner_kind SET NOT NULL, ALTER COLUMN owner_id SET NOT NULL]])
    sql.exec(db, "DROP INDEX uq_kickside_job_active_idempotency")
    sql.exec(db, "CREATE UNIQUE INDEX uq_kickside_job_run_execution ON kickside_job_run(job_id,execution_seq)")
    -- Migration 31 removes every recognized legacy thread CASCADE by catalog identity.
end

return M
