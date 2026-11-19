local fixture = require("fixture")
return {get = fixture.get, type = {SQLITE = "sqlite", POSTGRES = "postgres"}}
