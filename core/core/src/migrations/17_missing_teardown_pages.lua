-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migrator = require("migration")
local core_db = require("core_db")
local jobs_config = require("jobs_config")
local logger = require("logger"):named("kickside.core.migrations")

local function reconcile(tx, postgres)
    local lock_thread = postgres and " FOR UPDATE OF t" or ""
    local lock_fence = postgres and " FOR UPDATE OF f" or ""
    -- Keep exact replay available. A missing page cannot supply counts, so
    -- resume the remaining work at the next unused page without importing any
    -- other receipt. Lock in the same order as the Core teardown transaction.
    local result, err = tx:execute([[
        WITH marked AS MATERIALIZED (
            SELECT t.id,t.teardown_page_seq FROM kickside_thread t
            WHERE t.deleting_at IS NOT NULL
              AND EXISTS (
                  SELECT 1 FROM kickside_job_thread_cleanup f
                  WHERE f.thread_id=CAST(t.id AS TEXT) AND f.started=TRUE
                    AND f.completed_at IS NULL AND f.next_page_seq>t.teardown_page_seq)
            ORDER BY t.id]] .. lock_thread .. [[
        ), gaps AS MATERIALIZED (
            SELECT t.id,f.next_page_seq FROM marked t
            JOIN kickside_job_thread_cleanup f ON f.thread_id=CAST(t.id AS TEXT)
            WHERE f.started=TRUE AND f.completed_at IS NULL AND f.next_page_seq>t.teardown_page_seq
              AND NOT EXISTS (
                  SELECT 1 FROM kickside_job_thread_cleanup_receipt r
                  WHERE r.thread_id=f.thread_id AND r.page_seq=t.teardown_page_seq)
              AND NOT EXISTS (
                  SELECT 1 FROM kickside_job_thread_cleanup_receipt r
                  WHERE r.thread_id=f.thread_id AND r.page_seq>=f.next_page_seq)
            ORDER BY f.thread_id]] .. lock_fence .. [[
        )
        UPDATE kickside_thread AS t SET teardown_page_seq=gaps.next_page_seq
        FROM gaps WHERE t.id=gaps.id
    ]])
    if err then error(err) end
    return result.rows_affected
end

return function(options)
    local report = {advanced = 0, shared_database = false}
    local result = migrator.run(function()
        migration("17 reconcile missing thread teardown pages", function()
            for _, dialect in ipairs({ "postgres", "sqlite" }) do
                database(dialect, function()
                    up(function(tx)
                        report.shared_database = core_db.id() == jobs_config.db_id()
                        if report.shared_database then
                            report.advanced = reconcile(tx, dialect == "postgres")
                        end
                    end)
                end)
            end
        end)
    end, options)
    if result.status == "complete" and result.applied > 0 then
        logger:info("legacy thread teardown migration", report)
    end
    result.thread_teardown = report
    return result
end
