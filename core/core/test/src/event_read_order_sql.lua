-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
return {get = require("fixture").get, builder = sql.builder}
