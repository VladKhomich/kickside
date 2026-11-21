local M = {}

local function invalid(message: string): error
    return (errors.new({ message = message, kind = errors.INVALID, retryable = false }) :: error)
end

local function response_error(field: string): error
    return errors.new({message = "subject version response is invalid", kind = errors.INTERNAL,
        retryable = false, details = {code = "subject_version_response", field = field}})
end

function M.validate_subject(value: any): error?
    if value == nil then return nil end
    if type(value) ~= "string" or #value == 0 or #value > 256 or value:find("[%c]") then
        return invalid("subject must be a non-empty string of at most 256 bytes without control characters")
    end
    return nil
end

local function is_version(value: any): boolean
    return type(value) == "number" and value >= 0 and value < math.huge and value == math.floor(value)
end

function M.validate_expect(value: any): error?
    if value == nil then return nil end
    if type(value) ~= "table" then return invalid("expect must be an object") end
    for key in pairs(value) do
        if key ~= "head" and key ~= "subject" and key ~= "version" and key ~= "also" then
            return invalid("unknown expect field: " .. tostring(key))
        end
    end
    if value.head == nil and value.subject == nil then return invalid("expect requires head or subject and version") end
    if value.head ~= nil and not is_version(value.head) then
        return invalid("expect.head must be a non-negative integer")
    end
    if value.subject ~= nil or value.version ~= nil then
        if value.subject == nil or value.version == nil then return invalid("expect requires subject and version together") end
        local subject_err = M.validate_subject(value.subject)
        if subject_err then return subject_err end
        if not is_version(value.version) then
            return invalid("expect.version must be a non-negative integer")
        end
    end
    local also = value.also
    if also ~= nil then
        if value.subject == nil then return invalid("expect.also requires a primary subject and version") end
        if type(also) ~= "table" then return invalid("expect.also must be an object") end
        for key in pairs(also) do
            if key ~= "subject" and key ~= "version" then
                return invalid("expect.also accepts only subject and version")
            end
        end
        if also.subject == nil or also.version == nil then
            return invalid("expect.also requires subject and version together")
        end
        local subject_err = M.validate_subject(also.subject)
        if subject_err then return subject_err end
        if also.subject == value.subject then return invalid("expect.also.subject must differ from expect.subject") end
        if not is_version(also.version) then return invalid("expect.also.version must be a non-negative integer") end
    end
    return nil
end

local function read_version(row: any): (integer?, error?)
    if type(row) ~= "table" or (type(row.version) ~= "number" and type(row.version) ~= "string") then
        return nil, response_error("version")
    end
    local version = math.tointeger(row.version)
    if version == nil or version < 0 then return nil, response_error("version") end
    return version, nil
end

function M.version(tx: any, thread_id: string, subject: string): (integer?, error?)
    local rows, err = tx:query("SELECT version FROM kickside_thread_subject WHERE thread_id=$1 AND subject=$2",
        { thread_id, subject })
    if err then
        return nil, errors.wrap(err, "subject version read failed")
    end
    if type(rows) ~= "table" then return nil, response_error("rows") end
    if #rows == 0 then return 0, nil end
    return read_version(rows[1])
end

local function versions(tx: any, thread_id: string, subject: string, also: string): (integer?, integer?, error?)
    local rows, err = tx:query("SELECT subject, version FROM kickside_thread_subject WHERE thread_id=$1 AND subject IN ($2, $3)",
        { thread_id, subject, also })
    if err then return nil, nil, errors.wrap(err, "subject version read failed") end
    if type(rows) ~= "table" or (rows[2] ~= nil and rows[1] == nil) then
        return nil, nil, response_error("rows")
    end
    local found: { [string]: integer } = {}
    for index, row in pairs(rows) do
        if (index ~= 1 and index ~= 2) or type(row) ~= "table" then
            return nil, nil, response_error("rows")
        end
        local key = row.subject
        if (key ~= subject and key ~= also) or found[key] ~= nil then
            return nil, nil, response_error("subject")
        end
        local version, version_err = read_version(row)
        if version_err then return nil, nil, version_err end
        found[key] = version :: integer
    end
    return found[subject] or 0, found[also] or 0, nil
end

local function version_mismatch(subject: string, version: integer?, expected: integer): error
    return (errors.new({ message = "subject version mismatch", kind = errors.CONFLICT, retryable = false,
        details = { reason = "version_mismatch", subject = subject, version = version, expected = expected } }) :: error)
end

function M.check(tx: any, thread_id: string, head: integer, expect: any): error?
    if expect == nil then return nil end
    if expect.head ~= nil and head ~= expect.head then
        return (errors.new({ message = "thread head mismatch", kind = errors.CONFLICT, retryable = false,
            details = { reason = "head_mismatch", head = head, expected_head = expect.head } }) :: error)
    end
    if expect.subject ~= nil then
        local version, also_version, read_err
        local also = expect.also
        if also ~= nil then
            version, also_version, read_err = versions(tx, thread_id, expect.subject, also.subject)
        else
            version, read_err = M.version(tx, thread_id, expect.subject)
        end
        if read_err then return read_err end
        if version ~= expect.version then
            return version_mismatch(expect.subject, version, expect.version)
        end
        if also ~= nil and also_version ~= also.version then
            return version_mismatch(also.subject, also_version, also.version)
        end
    end
    return nil
end

return M
