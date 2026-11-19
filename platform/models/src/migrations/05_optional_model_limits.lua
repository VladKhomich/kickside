-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return require("migration").define(function()
    migration("store unknown model limits as null", function()
        for _, engine in ipairs({ "sqlite", "postgres" }) do
            database(engine, function()
                up(function(db)
                    local function execute(statement)
                        local _, err = db:execute(statement)
                        if err then error(err) end
                    end
                    execute("ALTER TABLE kickside_model_cards ALTER COLUMN max_tokens DROP NOT NULL")
                    execute("ALTER TABLE kickside_model_cards ALTER COLUMN output_tokens DROP NOT NULL")
                    execute([[UPDATE kickside_model_cards
                        SET max_tokens = NULLIF(max_tokens, 0), output_tokens = NULLIF(output_tokens, 0),
                            dimensions = NULLIF(dimensions, 0)
                        WHERE max_tokens = 0 OR output_tokens = 0 OR dimensions = 0]])
                    return true
                end)
            end)
        end
    end)
end)
