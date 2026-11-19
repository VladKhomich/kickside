local test = require("test")
local native_pool = require("worker_pool")
local time = require("time")
local fixed = assert(time.parse(time.RFC3339, "2026-10-10T00:00:00Z"))
local worker_pool = native_pool.new({time = {now = function() return fixed end}})
local sql = require("sql")
local function executor(rows: any, source: error?): any
    return {query = function(_, query, args)
        test.eq(#args, 1)
        test.eq(args[1], "2026-10-10T00:00:00Z")
        return rows, source
    end}
end
return {run = test.run_cases(function()
    test.describe("native worker deadline errors", function()
        for _, dialect in ipairs({sql.type.SQLITE, sql.type.POSTGRES}) do
            for _, kind in ipairs({errors.NOT_FOUND, errors.ALREADY_EXISTS, errors.INVALID, errors.PERMISSION_DENIED,
                errors.UNAVAILABLE, errors.INTERNAL, errors.CANCELED, errors.CONFLICT, errors.TIMEOUT,
                errors.RATE_LIMITED, errors.UNKNOWN}) do
                for _, options in ipairs({{}, {retryable = false}, {retryable = true}}) do
                    for _, detailed in ipairs({false, true}) do
                        test.it(dialect .. "/" .. kind .. "/" .. tostring(options.retryable) .. "/" .. tostring(detailed), function()
                            local source = errors.new({kind = kind, message = "deadline query refusal", retryable = options.retryable,
                                details = detailed and {code = "deadline_dependency", nested = {marker = "kept"}} or nil})
                            local delay, deadline_kind, err = worker_pool.next_deadline(executor(nil, source), dialect, "2026-10-10T00:00:00Z")
                            test.is_nil(delay)
                            test.is_nil(deadline_kind)
                            test.not_nil(err)
                            test.eq(err:kind(), source:kind())
                            test.eq(err:retryable(), source:retryable())
                            if detailed then
                                test.eq(err:details().code, "deadline_dependency")
                                test.eq(err:details().nested.marker, "kept")
                                test.eq(source:details().nested.marker, "kept")
                            else test.is_nil(err:details()) end
                        end)
                    end
                end
            end
            for _, row in ipairs({{ms = 12.1, kind = "due"}, {ms = 0, kind = "lease"}, {ms = -5, kind = "due"}}) do
                test.it("successful exact deadline/" .. dialect .. "/" .. tostring(row.ms), function()
                    local delay, kind, err = worker_pool.next_deadline(executor({{deadline = fixed:add(row.ms * time.MILLISECOND):format("2006-01-02T15:04:05.000000Z07:00"), kind = row.kind}}, nil), dialect, "2026-10-10T00:00:00Z")
                    test.is_nil(err)
                    test.eq(delay, math.max(row.kind == "lease" and 0 or 1, math.ceil(row.ms)))
                    test.eq(kind, row.kind)
                end)
            end
            test.it("empty exact deadline/" .. dialect, function()
                local delay, kind, err = worker_pool.next_deadline(executor({}, nil), dialect, "2026-10-10T00:00:00Z")
                test.is_nil(delay)
                test.is_nil(kind)
                test.is_nil(err)
            end)
        end
    end)
end)}
