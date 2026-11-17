-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local clock = require("clock")
local instant = assert(time.parse("2006-01-02T15:04:05.000000Z07:00", "2040-01-02T03:04:05.500000Z"))
return {
    now = function(dialect: string?): any
        if dialect then return clock.format(instant, dialect) end
        return instant
    end,
    db_id = function(): string return "app:private_queue_runtime_clock" end,
}
