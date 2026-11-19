-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local funcs = require("funcs")
local fs = require("fs")
local process = require("process")
local security = require("security")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")

local attachments = require("attachment_ingest")
local provision = require("provision")
local test = require("test")

local M = {}
local PROCESS_JOB = "kickside.uploads.service:process_job_proc"

local function query(statement, args)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query(statement, args)
    db:release()
    assert(not err, tostring(err))
    return rows
end

local function execute(statement, args)
    local db = assert(sql.get("app:db"))
    local _, err = db:execute(statement, args)
    db:release()
    assert(not err, tostring(err))
end

local function call_count(id)
    return tonumber(query("SELECT COUNT(*) AS n FROM attachment_delivery_calls WHERE fixture_id = $1", {id})[1].n)
end

local function attachment_errors(request)
    local actor = security.actor()
    if not actor or actor:id() ~= request.component_id then
        return errors.new({kind = errors.PERMISSION_DENIED, retryable = false, message = "Fixture connection access denied"})
    end
    return nil
end

function M.fetch(request)
    local auth_err = attachment_errors(request)
    if auth_err then return nil, auth_err end
    local ref = request.ref
    execute("INSERT INTO attachment_delivery_calls (fixture_id) VALUES ($1)", {ref.id})
    if ref.race then
        for _ = 1, 100 do
            if call_count(ref.id) >= 2 then break end
            time.sleep("30ms")
        end
        assert(call_count(ref.id) == 2, "both provider requests must arrive before either returns bytes")
    elseif ref.retry and call_count(ref.id) == 1 then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true, message = "Retry this attachment"})
    end
    return {bytes = "the same attachment bytes", filename = "fixture." .. ref.id, content_type = "application/octet-stream"}, nil
end

function M.verify(request)
    local auth_err = attachment_errors(request)
    if auth_err then return nil, auth_err end
    return {current = request.ref.version == "1"}, nil
end

function M.admit(request)
    local upload, err = attachments.admit(request.attachment, request.key, request.resume == true)
    if err then return nil, err end
    return upload.uuid, nil
end

function M.admit_process(request)
    local id, err = M.admit(request)
    assert(id, tostring(err))
    return id
end

function M.verify_attachment(request)
    local err = attachments.verify(request.attachment)
    if err then return nil, err end
    return true, nil
end

local function owner()
    local id = uuid.v4()
    execute("INSERT INTO app_users (user_id,email,full_name,password_hash,status) VALUES ($1,$2,$1,'test-only','active')",
        {id, id .. "@uploads.test"})
    for _, group in ipairs({"app:uploads_test", "wippy.security:process"}) do
        execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group})
    end
    local actor = assert(security.new_actor(id, {security_groups = {"app:uploads_test"}}))
    local scope = assert(security.named_scope("wippy.security:process"))
    assert(provision.ensure_user(actor, scope, id))
    return id, actor, scope
end

local function new_request(owner_id)
    return {key = "fixture-delivery", attachment = {source = "versioned-fixture", component_id = owner_id,
        ref = {id = (uuid.v4():gsub("%-", "")), version = "1"}}}
end

local function upload_count(owner_id)
    return tonumber(query("SELECT COUNT(*) AS n FROM kickside_uploads WHERE actor_id = $1", {owner_id})[1].n)
end

local function job_count(owner_id)
    return tonumber(query("SELECT COUNT(*) AS n FROM kickside_job WHERE owner_kind = 'user' AND owner_id = $1 AND job_type = $2",
        {owner_id, PROCESS_JOB})[1].n)
end

local function file_count(ref_id)
    local storage = assert(fs.get("app:uploads"))
    local count = 0
    for entry in assert(storage:readdir(".")) do
        if entry.name:sub(-#ref_id - 1) == "." .. ref_id then count = count + 1 end
    end
    return count
end

local function prevent_enqueue(owner_id)
    local db = assert(sql.get("app:db"))
    local postgres = db:type() == "postgres"
    db:release()
    local match = "NEW.owner_id = '" .. owner_id .. "' AND NEW.job_type = '" .. PROCESS_JOB .. "'"
    if postgres then
        execute([[CREATE FUNCTION reject_attachment_enqueue() RETURNS trigger LANGUAGE plpgsql AS $$
            BEGIN RAISE EXCEPTION 'fixture rejected attachment enqueue'; END; $$]])
        execute("CREATE TRIGGER reject_attachment_enqueue BEFORE INSERT ON kickside_job FOR EACH ROW WHEN ("
            .. match .. ") EXECUTE FUNCTION reject_attachment_enqueue()")
        return function()
            execute("DROP TRIGGER reject_attachment_enqueue ON kickside_job")
            execute("DROP FUNCTION reject_attachment_enqueue()")
        end
    end
    execute("CREATE TRIGGER reject_attachment_enqueue BEFORE INSERT ON kickside_job WHEN " .. match
        .. " BEGIN SELECT RAISE(ABORT, 'fixture rejected attachment enqueue'); END")
    return function() execute("DROP TRIGGER reject_attachment_enqueue") end
end

M.run = test.run_cases(function()
    test.describe("versioned upload delivery", function()
        test.before_each(function()
            execute("CREATE TABLE IF NOT EXISTS attachment_delivery_calls (fixture_id TEXT NOT NULL)")
        end)

        test.it("commits one upload, one Jobs row and one stored file after both requests fetched", function()
            local id, actor, scope = owner()
            local request = new_request(id)
            request.attachment.ref.race = true
            local spawn = process.with_context({}):with_actor(actor):with_scope(scope)
            local waiting = {}
            for _ = 1, 2 do
                local pid = assert(spawn:spawn_monitored("app:attachment_delivery_process", "app:processes", request))
                waiting[tostring(pid)] = true
            end
            local events = process.events()
            local deadline = time.after("15s")
            local first
            while next(waiting) do
                local selected = channel.select({events:case_receive(), deadline:case_receive()})
                assert(selected.channel == events, "both attachment processes must complete")
                local event = selected.value
                local pid = tostring(event.from)
                if event.kind == process.event.EXIT and waiting[pid] then
                    waiting[pid] = nil
                    assert(not event.result.error, tostring(event.result.error))
                    test.eq(type(event.result.value), "string")
                    first = first or event.result.value
                    test.eq(event.result.value, first)
                end
            end
            test.eq(call_count(request.attachment.ref.id), 2)
            test.eq(upload_count(id), 1)
            test.eq(job_count(id), 1)
            test.eq(file_count(request.attachment.ref.id), 1)
            local caller = funcs.new():with_actor(actor):with_scope(scope)
            request.resume = true
            test.eq(assert(caller:call("app:attachment_delivery_admit", request)), first)
            test.eq(call_count(request.attachment.ref.id), 2)
            request.attachment.ref.version = "2"
            local _, err = caller:call("app:attachment_delivery_admit", request)
            test.is_true(errors.is(err, errors.CONFLICT), tostring(err))
            test.eq(call_count(request.attachment.ref.id), 2)
        end)

        test.it("retries a provider failure without residue or duplicate delivery", function()
            local id, actor, scope = owner()
            local request = new_request(id)
            request.attachment.ref.retry = true
            local caller = funcs.new():with_actor(actor):with_scope(scope)
            request.resume = true
            local _, missing = caller:call("app:attachment_delivery_admit", request)
            test.is_true(errors.is(missing, errors.NOT_FOUND), tostring(missing))
            test.eq(call_count(request.attachment.ref.id), 0)
            request.resume = false
            local _, transient = caller:call("app:attachment_delivery_admit", request)
            test.is_true(errors.is(transient, errors.UNAVAILABLE), tostring(transient))
            test.is_true(transient:retryable())
            test.eq(upload_count(id), 0)
            test.eq(job_count(id), 0)
            test.eq(file_count(request.attachment.ref.id), 0)
            local committed = assert(caller:call("app:attachment_delivery_admit", request))
            test.eq(assert(caller:call("app:attachment_delivery_admit", request)), committed)
            test.eq(call_count(request.attachment.ref.id), 2)
            test.eq(upload_count(id), 1)
            test.eq(job_count(id), 1)
            test.eq(file_count(request.attachment.ref.id), 1)
            request.key = "independent-delivery"
            local independent = assert(caller:call("app:attachment_delivery_admit", request))
            test.is_true(independent ~= committed)
            test.eq(call_count(request.attachment.ref.id), 3)
            test.eq(upload_count(id), 2)
            test.eq(job_count(id), 2)
            test.eq(file_count(request.attachment.ref.id), 2)
        end)

        test.it("rolls back a rejected Jobs insertion and removes the staged file before retry", function()
            local id, actor, scope = owner()
            local request = new_request(id)
            local caller = funcs.new():with_actor(actor):with_scope(scope)
            local lift_failure = prevent_enqueue(id)
            local ok, uploaded, err = pcall(function()
                return caller:call("app:attachment_delivery_admit", request)
            end)
            lift_failure()
            assert(ok, tostring(uploaded))
            test.is_nil(uploaded)
            test.not_nil(err)
            test.eq(call_count(request.attachment.ref.id), 1)
            test.eq(upload_count(id), 0)
            test.eq(job_count(id), 0)
            test.eq(file_count(request.attachment.ref.id), 0)
            test.not_nil(assert(caller:call("app:attachment_delivery_admit", request)))
            test.eq(call_count(request.attachment.ref.id), 2)
            test.eq(upload_count(id), 1)
            test.eq(job_count(id), 1)
            test.eq(file_count(request.attachment.ref.id), 1)
        end)

        test.it("rejects foreign owners and fetch-only registrations without upload residue", function()
            local id, actor, scope = owner()
            local foreign, foreign_actor, foreign_scope = owner()
            local request = new_request(id)
            local caller = funcs.new():with_actor(actor):with_scope(scope)
            local outsider = funcs.new():with_actor(foreign_actor):with_scope(foreign_scope)
            local _, denied = outsider:call("app:attachment_delivery_admit", request)
            test.is_true(errors.is(denied, errors.PERMISSION_DENIED), tostring(denied))
            local _, hidden = outsider:call("app:attachment_delivery_verify", request)
            test.is_true(errors.is(hidden, errors.PERMISSION_DENIED), tostring(hidden))
            request.attachment.source = "fetch-only-fixture"
            local _, unversioned = caller:call("app:attachment_delivery_admit", request)
            test.is_true(errors.is(unversioned, errors.INVALID), tostring(unversioned))
            request.attachment.source = "versioned-fixture"
            test.is_true(assert(caller:call("app:attachment_delivery_verify", request)))
            request.attachment.ref.version = "2"
            local _, stale = caller:call("app:attachment_delivery_verify", request)
            test.is_true(errors.is(stale, errors.INVALID), tostring(stale))
            test.eq(call_count(request.attachment.ref.id), 0)
            test.eq(upload_count(id), 0)
            test.eq(upload_count(foreign), 0)
            test.eq(job_count(id), 0)
            test.eq(job_count(foreign), 0)
            test.eq(file_count(request.attachment.ref.id), 0)
        end)
    end)
end)

return M
