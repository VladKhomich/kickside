return require("migration").define(function()
    migration("06 callback deliveries", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local _, err = db:execute("ALTER TABLE kickside_uploads ADD COLUMN callback_deliveries TEXT")
                    if err then error(tostring(err)) end
                end)
                down(function()
                    error("Upload callback deliveries cannot be removed")
                end)
            end)
        end
    end)
end)
