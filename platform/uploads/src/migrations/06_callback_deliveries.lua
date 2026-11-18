-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("06 callback deliveries", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local _, err = db:execute("ALTER TABLE kickside_uploads ADD COLUMN callback_deliveries TEXT")
                    if err then error(tostring(err)) end
                    _, err = db:execute([[CREATE INDEX IF NOT EXISTS idx_upload_checkpoint_candidates
                        ON kickside_uploads (uuid)
                        WHERE storage_state IN ('completed', 'failed')
                          AND ((processing_intent_state = 'acknowledged' AND processing_job_id IS NOT NULL)
                            OR (processing_intent_state IS NULL AND processing_job_id IS NULL))]])
                    if err then error(tostring(err)) end
                end)
                down(function()
                    error("Upload callback deliveries cannot be removed")
                end)
            end)
        end
    end)
end)
