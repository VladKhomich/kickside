-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
type DB = sql.DB
return {get = require("fixture").get}
