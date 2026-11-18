return require("migration").define(function()
    migration("28 unused thread fences", function()
        for _, dialect in ipairs({ "postgres", "sqlite" }) do
            database(dialect, function()
                up(function(db)
                    local _, err = db:execute([[CREATE INDEX IF NOT EXISTS idx_job_cleanup_unused_fence
                        ON kickside_job_thread_cleanup(thread_id)
                        WHERE started=FALSE AND next_page_seq=0 AND completed_at IS NULL]])
                    if err then error(err) end
                end)
            end)
        end
    end)
end)
