local test = require("test")
local subjects = require("subjects")
local function executor(rows: any, err: error?, calls: {table}?): any
    return {query = function(_self: any, statement: string, args: {string}): (any, error?)
        if calls then calls[#calls + 1] = {statement = statement, args = args} end
        return rows, err
    end}
end
local function call(mode: string, rows: any, err: error?): (any, error?)
    local tx = executor(rows, err)
    if mode == "version" then return subjects.version(tx, "thread", "subject") end
    if mode == "dual" then
        return nil, subjects.check(tx, "thread", 1, {subject = "subject", version = 1,
            also = {subject = "schema", version = 1}})
    end
    return nil, subjects.check(tx, "thread", 1, {subject = "subject", version = 1})
end
local function define()
    for _, mode in ipairs({"version", "check", "dual"}) do
        for _, kind in ipairs({errors.NOT_FOUND, errors.ALREADY_EXISTS, errors.INVALID, errors.PERMISSION_DENIED,
            errors.UNAVAILABLE, errors.INTERNAL, errors.CANCELED, errors.CONFLICT, errors.TIMEOUT,
            errors.RATE_LIMITED, errors.UNKNOWN}) do
            for _, options in ipairs({{}, {retryable = false}, {retryable = true}}) do
                test.it(mode .. "/" .. kind .. "/" .. tostring(options.retryable), function()
                    local source = errors.new({kind = kind, message = "subject read refusal", retryable = options.retryable,
                        details = {code = "subject_dependency", nested = {version = "kept"}}})
                    local value, err = call(mode, nil, source)
                    test.is_nil(value)
                    test.eq(type(err), "userdata")
                    test.eq(err:kind(), source:kind())
                    test.eq(err:retryable(), source:retryable())
                    test.eq(err:details().code, "subject_dependency")
                    test.eq(err:details().nested.version, "kept")
                    test.eq(source:details().nested.version, "kept")
                end)
            end
        end
    end
    for _, mode in ipairs({"version", "check"}) do
        for _, proof in ipairs({{label = "missing rows", field = "rows"},
            {label = "false rows", value = false, field = "rows"},
            {label = "number rows", value = 7, field = "rows"},
            {label = "scalar row", value = {7}, field = "version"},
            {label = "missing version", value = {{}}, field = "version"},
            {label = "false version", value = {{version = false}}, field = "version"},
            {label = "invalid version", value = {{version = "invalid"}}, field = "version"},
            {label = "negative version", value = {{version = -1}}, field = "version"},
            {label = "fractional version", value = {{version = 0.5}}, field = "version"},
            {label = "table version", value = {{version = {}}}, field = "version"},
            {label = "infinite version", value = {{version = math.huge}}, field = "version"}}) do
            test.it("malformed response/" .. mode .. "/" .. proof.label, function()
                local value, err = call(mode, proof.value, nil)
                test.is_nil(value)
                test.is_true(errors.is(err, errors.INTERNAL))
                test.is_false(err:retryable())
                test.eq(err:details().code, "subject_version_response")
                test.eq(err:details().field, proof.field)
            end)
        end
    end
    for _, valid in ipairs({{label = "absent", rows = {}, expected = 0},
        {label = "zero", rows = {{version = 0}}, expected = 0},
        {label = "integer", rows = {{version = 23}}, expected = 23},
        {label = "numeric text", rows = {{version = "23"}}, expected = 23}}) do
        test.it("valid version/" .. valid.label, function()
            local value, err = subjects.version(executor(valid.rows, nil), "thread", "subject")
            test.is_nil(err)
            test.eq(value, valid.expected)
        end)
    end
    test.it("retains permanent mismatch fields", function()
        local err = subjects.check(executor({{version = 23}}, nil), "thread", 1, {subject = "subject", version = 1})
        test.is_true(errors.is(err, errors.CONFLICT))
        test.is_false(err:retryable())
        test.eq(err:details().reason, "version_mismatch")
        test.eq(err:details().subject, "subject")
        test.eq(err:details().version, 23)
        test.eq(err:details().expected, 1)
    end)
    test.it("accepts matching subject and head", function()
        test.is_nil(subjects.check(executor({{version = 1}}, nil), "thread", 1, {subject = "subject", version = 1, head = 1}))
    end)
    test.it("retains optional absence and head-only checks", function()
        test.is_nil(subjects.check(executor(nil, nil), "thread", 1, nil))
        test.is_nil(subjects.check(executor(nil, nil), "thread", 1, {head = 1}))
        local err = subjects.check(executor(nil, nil), "thread", 2, {head = 1})
        test.is_true(errors.is(err, errors.CONFLICT))
        test.is_false(err:retryable())
        test.eq(err:details().reason, "head_mismatch")
        test.eq(err:details().head, 2)
        test.eq(err:details().expected_head, 1)
    end)
    test.it("uses one indexed lookup for either expectation shape", function()
        local calls: {table} = {}
        local tx = executor({{subject = "schema", version = "9"}, {subject = "subject", version = 4}}, nil, calls)
        test.is_nil(subjects.check(tx, "thread", 7, {head = 7, subject = "subject", version = 4,
            also = {subject = "schema", version = 9}}))
        test.eq(#calls, 1)
        test.eq(calls[1].statement, "SELECT subject, version FROM kickside_thread_subject WHERE thread_id=$1 AND subject IN ($2, $3)")
        test.eq(#calls[1].args, 3)
        test.eq(calls[1].args[1], "thread")
        test.eq(calls[1].args[2], "subject")
        test.eq(calls[1].args[3], "schema")

        tx = executor({{version = 4}}, nil, calls)
        test.is_nil(subjects.check(tx, "thread", 7, {subject = "subject", version = 4}))
        test.eq(#calls, 2)
        test.eq(calls[2].statement, "SELECT version FROM kickside_thread_subject WHERE thread_id=$1 AND subject=$2")
        test.eq(#calls[2].args, 2)
        test.eq(calls[2].args[1], "thread")
        test.eq(calls[2].args[2], "subject")
        test.is_nil(subjects.check(tx, "thread", 7, {head = 7}))
        test.is_nil(subjects.check(tx, "thread", 7, nil))
        test.eq(#calls, 2)
    end)
    test.it("checks the head first and compares versions in expectation order", function()
        local calls: {table} = {}
        local tx = executor({{subject = "schema", version = 9}, {subject = "subject", version = 4}}, nil, calls)
        local expect: any = {head = 6, subject = "subject", version = 3, also = {subject = "schema", version = 8}}
        local head = subjects.check(tx, "thread", 7, expect)
        test.is_true(errors.is(head, errors.CONFLICT))
        test.eq(head:details().reason, "head_mismatch")
        test.eq(#calls, 0)

        expect.head = 7
        for _, failing in ipairs({{subject = "subject", version = 4, expected = 3},
            {subject = "schema", version = 9, expected = 8}}) do
            local err = subjects.check(tx, "thread", 7, expect)
            test.is_true(errors.is(err, errors.CONFLICT))
            test.is_false(err:retryable())
            test.eq(err:details().reason, "version_mismatch")
            test.eq(err:details().subject, failing.subject)
            test.eq(err:details().version, failing.version)
            test.eq(err:details().expected, failing.expected)
            expect.version = 4
        end
        test.eq(#calls, 2)
    end)
    test.it("defaults each missing version independently", function()
        local expect: any = {subject = "subject", version = 0, also = {subject = "schema", version = 0}}
        test.is_nil(subjects.check(executor({}, nil), "thread", 1, expect))
        expect.also.version = 1
        test.is_nil(subjects.check(executor({{subject = "schema", version = 1}}, nil), "thread", 1, expect))
        expect.version, expect.also.version = 1, 0
        test.is_nil(subjects.check(executor({{subject = "subject", version = 1}}, nil), "thread", 1, expect))
    end)
    for _, proof in ipairs({
        {label = "missing rows", field = "rows"},
        {label = "non-table rows", value = false, field = "rows"},
        {label = "non-table row", value = {7}, field = "rows"},
        {label = "sparse rows", value = {[2] = {subject = "schema", version = 1}}, field = "rows"},
        {label = "map rows", value = {schema = {subject = "schema", version = 1}}, field = "rows"},
        {label = "missing subject", value = {{version = 1}}, field = "subject"},
        {label = "unexpected subject", value = {{subject = "other", version = 1}}, field = "subject"},
        {label = "duplicate subjects", value = {{subject = "schema", version = 1}, {subject = "schema", version = 1}},
            field = "subject"},
        {label = "missing version", value = {{subject = "schema"}}, field = "version"},
        {label = "invalid version", value = {{subject = "subject", version = 1}, {subject = "schema", version = "bad"}},
            field = "version"},
    }) do
        test.it("malformed dual response/" .. proof.label, function()
            local _, err = call("dual", proof.value, nil)
            test.is_true(errors.is(err, errors.INTERNAL))
            test.is_false(err:retryable())
            test.eq(err:details().code, "subject_version_response")
            test.eq(err:details().field, proof.field)
        end)
    end
end
return {run = test.run_cases(function() test.describe("native subject versions", define) end)}
