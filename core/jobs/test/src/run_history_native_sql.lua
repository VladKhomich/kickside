local sql = require("sql")
local fixture = require("fixture")
type DB = sql.DB
type Transaction = sql.Transaction
return {type = sql.type, builder = {insert = fixture.builder, update = fixture.builder,
    dollar = sql.builder.dollar, expr = sql.builder.expr, eq = function(...) return {} end}}
