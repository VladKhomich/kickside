local test = require("test")
local uuid = require("uuid")
local sql = require("sql")
local time = require("time")
local process = require("process")
local contract = require("contract")
local security = require("security")
local funcs = require("funcs")
local json = require("json")
local env = require("env")
local fs = require("fs")
local provision = require("provision")
local notifier = require("retention_notifier")
local upload_types = require("types")
local upload_tokens = require("upload_tokens")
local secret_cipher = require("secret_cipher")
local upload_query_repo = require("upload_query_repo")
local jobs_retention = require("jobs_retention")

local DB = "app:db"
local WAIT_MS = 15000

local function exec(statement: string, params: { any }): ()
    local db = assert(sql.get(DB))
    local _, err = db:execute(statement, params)
    db:release()
    test.is_nil(err, tostring(err))
end

local function query(statement: string, params: { any }): { table }
    local db = assert(sql.get(DB))
    local rows, err = db:query(statement, params)
    db:release()
    test.is_nil(err, tostring(err))
    return rows
end

local function count(id: string): integer
    return tonumber(query("SELECT COUNT(*) AS n FROM kickside_upload_read_model WHERE upload_id=$1", { id })[1].n) :: integer
end

local function sweeper_pid(): string?
    local pid = process.registry.lookup(notifier.NAME)
    return pid
end

local function await_sweeper(): string
    local deadline = time.now():unix_nano() + WAIT_MS * 1000000
    while time.now():unix_nano() < deadline do
        local pid = sweeper_pid()
        if pid then return pid :: string end
        time.sleep("50ms")
    end
    error("the Core retention sweeper service is not running")
end

local function stamp(days: integer): string
    return time.now():utc():add(days * 24 * time.HOUR):format_rfc3339()
end

local function user_container(): (string, string)
    local owner = "uploads-retention-sweeper-" .. uuid.v4()
    exec([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$1,'test-only','active')]], { owner, owner .. "@uploads.test" })
    for _, group_id in ipairs({ "app:uploads_test", "wippy.security:process" }) do
        exec("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", { owner, group_id })
    end
    local actor = security.new_actor(owner, { security_groups = { "app:uploads_test" } })
    local scope = security.named_scope("wippy.security:process")
    local _, ensure_err = provision.ensure_user(actor, scope, owner)
    test.is_nil(ensure_err, tostring(ensure_err))
    return assert(upload_types.component_id_for_owner(owner)), owner
end

local function model(component_id: string, seq: integer): string
    local id = uuid.v4()
    exec([[INSERT INTO kickside_upload_read_model
        (upload_id,component_id,status,deleted_at,last_event_seq)
        VALUES ($1,$2,'deleted',$3,$4)]], { id, component_id, stamp(-40), seq })
    return id
end

local function checkpoint(component_id: string, owner: string, upload_id: string, job_id: string, metadata: string, state: string?)
    exec([[INSERT INTO kickside_uploads
        (uuid,actor_id,mime_type,size,storage_id,storage_path,type_id,storage_state,metadata,
            processing_intent_state,processing_job_id)
        VALUES ($1,$2,'text/plain',1,'app:uploads',$1,'text',$3,$4,'acknowledged',$5)]],
        { upload_id, owner, state or "completed", metadata, job_id })
    exec([[INSERT INTO kickside_upload_read_model (upload_id,component_id,status)
        VALUES ($1,$2,'processing')]], { upload_id, component_id })
end

return test.run_cases(function()
    test.describe("uploads retention under the Core retention sweeper service", function()
        test.it("settles permanent callback errors as failures and continues recovery and cleanup in the same pass", function()
            local component_id, owner = user_container()
            local expired, invalid, good = uuid.v4(), uuid.v4(), uuid.v4()
            local key = assert(secret_cipher.load_key(assert(env.get("kickside.uploads.env:encryption_key"))))
            local function metadata(upload_id, issued_at, trace_context)
                local token = assert(secret_cipher.seal(assert(json.encode({ upload_id = upload_id,
                    function_id = "app:callback_probe", actor_id = owner, actor_context = "{}",
                    issued_at = issued_at, trace_context = trace_context })), key))
                return assert(json.encode({ __upload_token = token }))
            end
            local fixtures = {
                { expired, "00000000-0000-4000-8000-000000000001", "Token expired" },
                { invalid, "00000000-0000-4000-8000-000000000002", "is not canonical" },
            }
            checkpoint(component_id, owner, expired, fixtures[1][2], metadata(expired, os.time() - 86401, nil))
            checkpoint(component_id, owner, invalid, fixtures[2][2], metadata(invalid, os.time(), { unknown = "field" }))
            checkpoint(component_id, owner, good, "00000000-0000-4000-8000-000000000003", "{}")
            exec("UPDATE kickside_thread SET max_pruned_seq=5 WHERE id=$1", { component_id })
            local tombstone = model(component_id, 3)
            local blob_id = uuid.v4()
            local storage = assert(fs.get("app:uploads"))
            local _, write_err = storage:writefile(blob_id, "bytes")
            test.is_nil(write_err, tostring(write_err))
            exec([[INSERT INTO kickside_upload_artifact_blobs
                (blob_id,checksum,mime_type,size,storage_id,storage_path,created_at,updated_at)
                VALUES ($1,$2,'text/plain',5,'app:uploads',$2,$3,$3)]], { blob_id, blob_id, stamp(-40) })

            local result, err = funcs.call("kickside.uploads:retention", {})
            test.is_nil(err, tostring(err))
            test.is_true(result.success, tostring(result.error))
            local again = assert(funcs.call("kickside.uploads:retention", {}))
            test.is_true(again.success, tostring(again.error))
            for _, fixture in ipairs(fixtures) do
                local failure = query([[SELECT body,external_version FROM kickside_event
                    WHERE thread_id=$1 AND external_id=$2 AND type=$3]], { component_id, fixture[1], upload_types.EVENT.FAILED })
                test.eq(#failure, 1)
                test.eq(failure[1].external_version, fixture[2])
                local body = type(failure[1].body) == "table" and failure[1].body or assert(json.decode(failure[1].body))
                test.contains(body.error, fixture[3])
                test.eq(assert(upload_query_repo.get(fixture[1])).storage_state, "failed")
            end
            test.eq(#query("SELECT id FROM kickside_event WHERE thread_id=$1 AND external_id=$2 AND type=$3",
                { component_id, good, upload_types.EVENT.COMPLETED }), 1)
            test.eq(count(tombstone), 0)
            test.eq(#query("SELECT blob_id FROM kickside_upload_artifact_blobs WHERE blob_id=$1", { blob_id }), 0)
        end)

        test.it("bounds candidate discovery across 10000 terminal uploads", function()
            local component_id, owner = user_container()
            local db = assert(sql.get(DB))
            local postgres = tostring(db:type()) == sql.type.POSTGRES
            local prefix = "10000000-0000-4000-8000-"
            local ident = postgres and "($1 || LPAD(CAST(n AS TEXT),12,'0'))"
                or "($1 || PRINTF('%012d', n))"
            local ids = "WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<10000) "
            exec(ids .. [[INSERT INTO kickside_uploads
                (uuid,actor_id,mime_type,size,storage_id,storage_path,type_id,storage_state,metadata,
                    processing_intent_state,processing_job_id)
                SELECT ]] .. ident .. ",$2,'text/plain',1,'app:uploads'," .. ident
                .. ",'text','completed','{}','acknowledged'," .. ident .. " FROM seq", { prefix, owner })
            exec(ids .. [[INSERT INTO kickside_upload_read_model (upload_id,component_id,status)
                SELECT ]] .. ident .. ",$2,'completed' FROM seq", { prefix, component_id })
            local last_job, last_upload = uuid.v4(), prefix .. "000000010001"
            checkpoint(component_id, owner, last_upload, last_job, "{}")

            local batch = 500
            local cursor = prefix .. "000000000000"
            local found, examined = nil, 0
            local probe = {
                type = function() return db:type() end,
                query = function(_, statement, params)
                    local plan = assert(db:query((postgres and "EXPLAIN (ANALYZE, BUFFERS) " or "EXPLAIN QUERY PLAN ")
                        .. statement, params))
                    local seek = false
                    for _, row in ipairs(plan) do
                        local detail = tostring(postgres and row["QUERY PLAN"] or row.detail)
                        if postgres then
                            local rows, loops = detail:match("actual time=[^ ]+ rows=(%d+) loops=(%d+)")
                            if rows and loops then
                                test.is_true(assert(tonumber(rows)) * assert(tonumber(loops)) <= batch, detail)
                            end
                            local removed = detail:match("Rows Removed by [%a ]+: (%d+)")
                            if removed then test.is_true(assert(tonumber(removed)) <= batch, detail) end
                            seek = seek or detail:find("Index Cond:", 1, true) ~= nil
                        else
                            seek = seek or (detail:find("SEARCH", 1, true) ~= nil and detail:find("uuid>?", 1, true) ~= nil)
                            test.is_false(detail:find("USE TEMP B-TREE FOR ORDER BY", 1, true) ~= nil, detail)
                        end
                    end
                    test.is_true(seek, "candidate discovery advances by an indexed seek")
                    local rows, err = db:query(statement, params)
                    if rows then examined = examined + #rows end
                    return rows, err
                end,
            }
            for page = 1, 21 do
                local rows, err, next_cursor = upload_query_repo.list_checkpoints(batch, cursor, probe)
                test.is_nil(err, tostring(err))
                if page <= 20 then
                    test.eq(#rows, 0)
                    test.eq(next_cursor, prefix .. string.format("%012d", page * batch))
                    test.eq(examined, page * batch)
                    cursor = next_cursor
                else
                    found = rows[1] and rows[1].uuid
                end
            end
            test.eq(found, last_upload)
            db:release()
            local _, wake_err = notifier.notify({ kind = "uploads_retention_test" })
            test.is_nil(wake_err, tostring(wake_err))
            local events = {}
            local deadline = time.now():unix_nano() + WAIT_MS * 1000000
            while #events == 0 and time.now():unix_nano() < deadline do
                events = query("SELECT external_version FROM kickside_event WHERE thread_id=$1 AND external_id=$2 AND type=$3",
                    { component_id, last_upload, upload_types.EVENT.COMPLETED })
                if #events == 0 then time.sleep("50ms") end
            end
            test.eq(#events, 1, "the retention owner advances past empty pages")
            test.eq(events[1].external_version, last_job)
            exec("DELETE FROM kickside_upload_read_model WHERE component_id=$1", { component_id })
            exec("DELETE FROM kickside_uploads WHERE actor_id=$1", { owner })
        end)

        test.it("publishes legacy terminal checkpoints after Jobs prunes their parents", function()
            local component_id, owner = user_container()
            local function outcomes(upload_id: string): { table }
                return query([[SELECT type,external_version FROM kickside_event
                    WHERE thread_id=$1 AND external_source='uploads' AND external_id=$2 AND type IN ($3,$4)]],
                    { component_id, upload_id, upload_types.EVENT.COMPLETED, upload_types.EVENT.FAILED })
            end
            local checkpoints = {}
            for _, fixture in ipairs({
                {},
                { failed = true },
                { outcome = "pending" },
                { outcome = "dead" },
            }) do
                local upload_id, job_id = uuid.v4(), uuid.v4()
                checkpoints[#checkpoints + 1] = { upload_id = upload_id, job_id = job_id, failed = fixture.failed }
                exec([[INSERT INTO kickside_job
                    (id,thread_id,job_type,payload,job_identity,owner_kind,owner_id,status,finished_at,last_error)
                    VALUES ($1,$2,'kickside.uploads.service:process_job_proc',$3,$4,'user',$5,'dead',$6,
                        'publication interrupted')]], { job_id, component_id, '{"upload_id":"' .. upload_id .. '"}',
                    "7:uploads" .. #upload_id .. ":" .. upload_id .. "7:process", owner, stamp(fixture.outcome and 0 or -40) })
                local metadata = "{}"
                if not fixture.failed and not fixture.outcome then
                    local token = assert(upload_tokens.pack({ upload_id = upload_id, function_id = "app:callback_probe",
                        actor_id = owner, actor_context = "{}" }))
                    metadata = assert(json.encode({ __upload_token = token }))
                end
                if fixture.outcome then
                    exec([[INSERT INTO kickside_job
                        (id,thread_id,job_type,payload,job_identity,owner_kind,owner_id,status)
                        VALUES ($1,$2,'kickside.uploads.service:process_dead',$3,$4,'user',$5,$6)]],
                        { uuid.v4(), component_id, assert(json.encode({ job_id = job_id })),
                            "18:kickside.jobs.dead" .. #job_id .. ":" .. job_id .. "7:outcome", owner, fixture.outcome })
                end
                checkpoint(component_id, owner, upload_id, job_id, metadata, fixture.failed and "failed" or "completed")
                test.eq(#outcomes(upload_id), 0)
            end

            local db = assert(sql.get(DB))
            assert(jobs_retention.sweep(db, tostring(db:type())))
            db:release()
            for i = 1, 2 do
                test.eq(#query("SELECT id FROM kickside_job WHERE id=$1", {checkpoints[i].job_id}), 0)
            end

            await_sweeper()
            local _, wake_err = notifier.notify({ kind = "uploads_retention_test" })
            test.is_nil(wake_err, tostring(wake_err))
            local deadline = time.now():unix_nano() + WAIT_MS * 1000000
            for _, checkpoint in ipairs(checkpoints) do
                local event_type = checkpoint.failed and upload_types.EVENT.FAILED or upload_types.EVENT.COMPLETED
                local events = outcomes(checkpoint.upload_id)
                while #events == 0 and time.now():unix_nano() < deadline do
                    time.sleep("50ms")
                    events = outcomes(checkpoint.upload_id)
                end
                test.eq(#events, 1, "normal recovery publishes the stored outcome")
                test.eq(events[1].external_version, checkpoint.job_id)
                test.eq(events[1].type, event_type)
            end
            local repeated = assert(funcs.call("kickside.uploads:retention", {}))
            test.is_true(repeated.success, tostring(repeated.error))
            for _, checkpoint in ipairs(checkpoints) do test.eq(#outcomes(checkpoint.upload_id), 1) end
            local jobs = query("SELECT job_type FROM kickside_job WHERE thread_id=$1 AND job_type IN ($2,$3)",
                { component_id, "kickside.uploads.service:process_dead", "kickside.uploads.service:callback_job" })
            local outcomes_count = 0
            for _, job in ipairs(jobs) do
                if job.job_type == "kickside.uploads.service:process_dead" then outcomes_count = outcomes_count + 1 end
            end
            test.eq(outcomes_count, 2, "recovery creates no outcome jobs")
            test.eq(#jobs - outcomes_count, 1, "recovery enqueues one callback")

            local projected = checkpoints[1].upload_id
            exec("UPDATE kickside_upload_read_model SET status='completed' WHERE upload_id=$1", { projected })
            exec("DELETE FROM kickside_event WHERE thread_id=$1 AND external_id=$2", { component_id, projected })
            local after_prune, prune_err = funcs.call("kickside.uploads:retention", {})
            test.is_nil(prune_err, tostring(prune_err))
            test.is_true(after_prune.success, tostring(after_prune.error))
            test.eq(#outcomes(projected), 0, "a projected completion is not republished after event retention")
        end)

        test.it("reclaims a user container's pruned tombstone and keeps the sweeper running", function()
            local component_id = user_container()
            local db = assert(sql.get(DB))
            local threads, thread_err = db:query("SELECT id FROM kickside_thread WHERE id=$1", { component_id })
            db:release()
            test.is_nil(thread_err, tostring(thread_err))
            test.eq(#(threads :: table), 1, "the user's uploads container is a Core thread")
            exec("UPDATE kickside_thread SET max_pruned_seq=5 WHERE id=$1", { component_id })
            local pruned = model(component_id, 3)
            local retained = model(component_id, 9)

            local before = await_sweeper()
            local woken, wake_err = notifier.notify({ kind = "uploads_retention_test" })
            test.is_nil(wake_err, tostring(wake_err))
            test.is_true(woken == true, "the sweeper service receives the wake")

            local deadline = time.now():unix_nano() + WAIT_MS * 1000000
            while count(pruned) > 0 and time.now():unix_nano() < deadline do time.sleep("100ms") end
            test.eq(count(pruned), 0, "a tombstone below the Core prune boundary is reclaimed by the sweeper")
            test.eq(count(retained), 1, "a tombstone above the Core prune boundary stays as a replay fence")
            test.eq(sweeper_pid(), before, "the sweeper process survives the uploads owner pass")

            exec("DELETE FROM kickside_upload_read_model WHERE upload_id=$1", { retained })
        end)

        test.it("grants the uploads owner's policies the boundary of uploads containers only", function()
            -- The uploads boundary grant plus runtime reads, without the caller's allow-all scope.
            local policies = {}
            for _, id in ipairs({ "app:retention_runtime_read",
                "kickside.uploads.security:retention_prune_boundary" }) do
                local policy, policy_err = security.policy(id)
                test.is_nil(policy_err, tostring(policy_err))
                policies[#policies + 1] = policy
            end
            local definition, definition_err = contract.get("kickside.core:threads")
            test.is_nil(definition_err, tostring(definition_err))
            local threads, open_err = (definition :: any):with_scope(security.new_scope(policies)):open()
            test.is_nil(open_err, tostring(open_err))

            local component_id = user_container()
            exec("UPDATE kickside_thread SET max_pruned_seq=5 WHERE id=$1", { component_id })
            local boundary, boundary_err = threads:prune_boundary({ thread_id = component_id })
            test.is_nil(boundary_err, tostring(boundary_err))
            test.eq((boundary :: table).max_pruned_seq, 5)

            local foreign = uuid.v4()
            exec([[INSERT INTO kickside_thread (id,thread_class,component_id,event_count,max_pruned_seq)
                VALUES ($1,'uploads_retention_foreign','',0,5)]], { foreign })
            local refused, refused_err = threads:prune_boundary({ thread_id = foreign })
            exec("DELETE FROM kickside_thread WHERE id=$1", { foreign })
            test.is_nil(refused)
            test.not_nil(refused_err)
            test.is_true(errors.is(refused_err, errors.PERMISSION_DENIED), tostring(refused_err))

            local _, missing_err = threads:prune_boundary({ thread_id = uuid.v4() })
            test.is_true(errors.is(missing_err, errors.NOT_FOUND), tostring(missing_err))
        end)
    end)
end)
