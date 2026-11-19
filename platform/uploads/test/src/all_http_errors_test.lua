local test = require("test")
local http = require("http")
local canonical_json = require("canonical_json")
local function encode(value: any): string
    local encoded, err = canonical_json.encode(value)
    test.is_nil(err)
    test.not_nil(encoded)
    return encoded :: string
end
local function context(body: string): (any, any, any)
    local captured = {}
    local request = {
        param = function(_, key) return key == "n" and "1" or "addressed-id" end,
        query = function() return "1" end,
        body = function() return body end,
        body_json = function() return { upload_id = "upload", filename = "file", size = 1 } end,
        is_content_type = function() return true end,
        parse_multipart = function() return { values = {}, files = { file = { {
            name = function() return "file" end, header = function() return "text/plain" end,
            size = function() return 1 end, stream = function() return {} end,
        } } } } end,
    }
    local response = {
        set_content_type = function() end,
        set_status = function(_, value) captured.status = value end,
        write_json = function(_, value) captured.body = value end,
    }
    return { request = function() return request end, response = function() return response end,
        STATUS = http.STATUS, CONTENT = http.CONTENT },
        { actor = function() return { id = function() return "actor" end } end }, captured
end
local create_api = require("create_api")
local complete_api = require("complete_api")
local presign_api = require("presign_api")
local function exercise(adapter, message, failure, status, stream)
    local runtime, security, captured = context('{}')
    local warnings = {}
    if stream then
        local req = runtime.request()
        req.parse_multipart = function() return { files = { file = { {
            name = function() return "file" end, header = function() return "text/plain" end,
            size = function() return 1 end, stream = function() return nil, failure end,
        } } } } end
    end
    adapter.new({ http = runtime, security = security, log = {
        warn = function(_, text, fields) warnings[#warnings + 1] = { text = text, fields = fields } end,
    }, upload_lib = {
        upload_file = function() return nil, failure end,
        complete_presigned_url = function() return nil, failure end,
        generate_presigned_url = function() return nil, failure end,
    } }).handler()
    test.eq(captured.status, status)
    test.eq(encode(captured.body), encode({ success = false, error = message, details = tostring(failure) }))
    return warnings
end
return test.run_cases(function()
    test.describe("All Uploads fixed error envelopes", function()
        for _, row in ipairs({ { errors.INVALID, 400 }, { errors.PERMISSION_DENIED, 403 }, { errors.NOT_FOUND, 404 },
{ errors.CONFLICT, 409 }, { errors.ALREADY_EXISTS, 409 }, { errors.UNAVAILABLE, 503 },
{ errors.RATE_LIMITED, 429 }, { errors.TIMEOUT, 504 }, { errors.CANCELED, 500 },
{ errors.INTERNAL, 500 }, { errors.UNKNOWN, 500 } }) do
            test.it("classifies all handlers for " .. row[1], function()
                local failure = errors.new({ kind = row[1], message = "opaque" })
                exercise(create_api, "Failed to upload file", failure, row[2])
                exercise(complete_api, "Failed to complete upload", failure, row[2])
                exercise(presign_api, "Failed to generate presigned URL", failure, row[2])
                exercise(create_api, "Failed to create file stream", failure, row[2], true)
            end)
        end
        test.it("logs a retryable SQL conflict once with only bounded fields", function()
            local failure = errors.wrap(errors.new({
                kind = errors.CONFLICT, retryable = true, message = "private SQL error and parameters",
                details = { sqlstate = "40P01", table = "private table", operation = "private operation" },
            }), "private wake context")
            local warnings = exercise(create_api, "Failed to upload file", failure, 409)
            test.eq(encode(warnings), encode({ {
                text = "upload creation failed",
                fields = { operation = "create_upload", status = 409, kind = errors.CONFLICT,
                    retryable = true, sqlstate = "40P01" },
            } }))
            test.eq(#exercise(create_api, "Failed to create file stream", failure, 409, true), 0)
        end)

        test.it("logs a native SQLite write conflict with its bounded busy code", function()
            local failure = errors.new({
                kind = errors.CONFLICT, retryable = true, message = "database is busy",
                details = { sqlite_code = 5, sqlite_extended_code = 517 },
            })
            local warnings = exercise(create_api, "Failed to upload file", failure, 409)
            test.eq(encode(warnings), encode({ {
                text = "upload creation failed",
                fields = { operation = "create_upload", status = 409, kind = errors.CONFLICT,
                    retryable = true, sqlite_code = 5 },
            } }))
        end)

        test.it("keeps ordinary and nonretryable conflicts quiet", function()
            for _, failure in ipairs({
                errors.new({ kind = errors.CONFLICT, message = "upload already exists" }),
                errors.new({ kind = errors.CONFLICT, retryable = true, message = "upload state changed" }),
                errors.new({ kind = errors.CONFLICT, retryable = false, message = "unique value already exists",
                    details = { sqlstate = "23505" } }),
            }) do
                test.eq(#exercise(create_api, "Failed to upload file", failure, 409), 0)
            end
        end)

        test.it("logs a server failure without copying unsafe SQL fields", function()
            local failure = errors.new({
                kind = errors.INTERNAL, message = "private storage reference",
                details = { sqlstate = "x\n9!A", filename = "private.txt", sqlite_code = "5" },
            })
            local warnings = exercise(create_api, "Failed to upload file", failure, 500)
            test.eq(encode(warnings), encode({ {
                text = "upload creation failed",
                fields = { operation = "create_upload", status = 500, kind = errors.INTERNAL, retryable = false },
            } }))
        end)

        test.it("keeps plain failures internal in all handlers", function()
            for _, row in ipairs({ { create_api, "Failed to upload file" }, { complete_api, "Failed to complete upload" },
                { presign_api, "Failed to generate presigned URL" } }) do exercise(row[1], row[2], "not_found", 500) end
        end)
    end)
end)
