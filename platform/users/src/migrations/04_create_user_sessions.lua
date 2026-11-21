local schema = require("session_schema")

return require("migration").define(function()
    migration("04 create user sessions", function()
        for _, engine in ipairs({ "postgres", "sqlite" }) do
            database(engine, function()
                up(function(db) schema.create(db, engine) end)
                down(function(db) schema.execute(db, "DROP TABLE kickside_user_sessions") end)
            end)
        end
    end)
end)
