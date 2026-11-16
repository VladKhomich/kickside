local test = require("test")
local sql = require("sql")
local time = require("time")
local sweeper = require("sweeper")

local function define_tests()
    test.describe("retention exact eligibility deadlines", function()
        test.it("interprets unzoned storage timestamps as UTC and preserves explicit offsets", function()
            local db = assert(sql.get("app:db"))
            local dbtype = tostring(db:type())
            db:release()
            local instant = assert(time.parse(time.RFC3339NANO, "2026-01-01T00:00:00.123456Z"))
            local expected = math.floor(instant:unix_nano() / 1000000) + 101
            local stamps = {
                "2026-01-01 00:00:00.123456",
                "2026-01-01T00:00:00.123456Z",
                "2026-01-01 05:30:00.123456+05:30",
                "2025-12-31T17:00:00.123456-07:00",
            }
            if dbtype == sql.type.POSTGRES then
                table.insert(stamps, "2025-12-31 17:00:00.123456-07")
            end
            for _, stamp in ipairs(stamps) do
                local deadline, err = sweeper.deadline_ms(stamp, 100, dbtype)
                test.is_nil(err, tostring(err))
                test.eq(deadline, expected, stamp)
            end
        end)
        test.it("uses the retention window from the event's stored timestamp", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            local dbtype = tostring(db:type())
            local layout = dbtype == sql.type.SQLITE and "2006-01-02 15:04:05.000000"
                or "2006-01-02T15:04:05.000000Z07:00"
            local created_at = time.now():add(-12 * time.HOUR):utc():format(layout)
            local parsed, parse_err = time.parse(layout, created_at, time.utc)
            test.is_nil(parse_err)
            local expected = math.floor((parsed:unix_nano() / 1000000)) + 86400000 + 1
            local deadline, deadline_err = sweeper.deadline_ms(created_at, 86400000, dbtype)
            test.is_nil(deadline_err)
            test.eq(deadline, expected)

            local exact_stamp = dbtype == sql.type.SQLITE
                and "2026-01-01 00:00:00.000000" or "2026-01-01T00:00:00.000000Z"
            local exact_time, exact_err = time.parse(layout, exact_stamp, time.utc)
            test.is_nil(exact_err)
            local exact_deadline, exact_deadline_err = sweeper.deadline_ms(exact_stamp, 100, dbtype)
            test.is_nil(exact_deadline_err)
            test.eq(exact_deadline, math.floor(exact_time:unix_nano() / 1000000) + 101)
            db:release()
        end)
    end)
end

return test.run_cases(define_tests)
