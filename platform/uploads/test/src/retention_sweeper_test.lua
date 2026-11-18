local test = require("test")
local uuid = require("uuid")
local sql = require("sql")
local time = require("time")
local process = require("process")
local contract = require("contract")
local security = require("security")
local funcs = require("funcs")
local json = require("json")
local provision = require("provision")
local notifier = require("retention_notifier")
local upload_types = require("types")
local upload_tokens = require("upload_tokens")

local DB = "app:db"
local WAIT_MS = 15000

local function exec(statement: string, params: { any }): ()
    local db = assert(sql.get(DB))
    local _, err = db:execute(statement, params)
    db:release()
    test.is_nil(err, tostring(err))
end

local function count(id: string): integer
    local db = assert(sql.get(DB))
    local rows, err = db:query("SELECT COUNT(*) AS n FROM kickside_upload_read_model WHERE upload_id=$1", { id })
    db:release()
    test.is_nil(err, tostring(err))
    return tonumber(rows[1].n) :: integer
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

return test.run_cases(function()
    test.describe("uploads retention under the Core retention sweeper service", function()
        test.it("publishes a completed checkpoint whose processing job was already dead at upgrade", function()
            local component_id, owner = user_container()
            local function completed(upload_id: string): { table }
                local handle = assert(sql.get(DB))
                local rows, err = handle:query([[SELECT external_version FROM kickside_event
                    WHERE thread_id=$1 AND external_source='uploads' AND external_id=$2 AND type=$3]],
                    { component_id, upload_id, upload_types.EVENT.COMPLETED })
                handle:release()
                test.is_nil(err, tostring(err))
                return rows
            end
            local checkpoints = {}
            for _, fixture in ipairs({
                { acknowledged = true },
                { acknowledged = false },
                { acknowledged = true, outcome = "pending" },
                { acknowledged = true, outcome = "dead" },
            }) do
                local upload_id, job_id = uuid.v4(), uuid.v4()
                checkpoints[#checkpoints + 1] = { upload_id = upload_id, job_id = job_id, outcome = fixture.outcome }
                exec([[INSERT INTO kickside_job
                    (id,thread_id,job_type,payload,job_identity,owner_kind,owner_id,status,finished_at,last_error)
                    VALUES ($1,$2,'kickside.uploads.service:process_job_proc',$3,$4,'user',$5,'dead',$6,
                        'publication interrupted')]], { job_id, component_id, '{"upload_id":"' .. upload_id .. '"}',
                    "7:uploads" .. #upload_id .. ":" .. upload_id .. "7:process", owner, stamp(0) })
                exec([[INSERT INTO kickside_upload_read_model (upload_id,component_id,status)
                    VALUES ($1,$2,'processing')]], { upload_id, component_id })
                local metadata = "{}"
                if fixture.acknowledged and not fixture.outcome then
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
                exec([[INSERT INTO kickside_uploads
                    (uuid,actor_id,mime_type,size,storage_id,storage_path,type_id,storage_state,metadata,
                        processing_intent_state,processing_job_id)
                    VALUES ($1,$2,'text/plain',1,'app:uploads',$1,'text','completed',$3,NULLIF($4,''),NULLIF($5,''))]],
                    { upload_id, owner, metadata, fixture.acknowledged and "acknowledged" or "",
                        fixture.acknowledged and job_id or "" })
                test.eq(#completed(upload_id), 0)
            end

            await_sweeper()
            local _, wake_err = notifier.notify({ kind = "uploads_retention_test" })
            test.is_nil(wake_err, tostring(wake_err))
            local deadline = time.now():unix_nano() + WAIT_MS * 1000000
            for _, checkpoint in ipairs(checkpoints) do
                if not checkpoint.outcome then
                    local events = completed(checkpoint.upload_id)
                    while #events == 0 and time.now():unix_nano() < deadline do
                        time.sleep("50ms")
                        events = completed(checkpoint.upload_id)
                    end
                    test.eq(#events, 1, "normal recovery publishes the stored completion")
                    test.eq(events[1].external_version, checkpoint.job_id)
                end
            end
            local repeated, repeat_err = funcs.call("kickside.uploads:retention", {})
            test.is_nil(repeat_err, tostring(repeat_err))
            test.is_true(repeated.success, tostring(repeated.error))
            local handle = assert(sql.get(DB))
            local outcome_jobs = assert(handle:query([[SELECT id FROM kickside_job WHERE thread_id=$1 AND
                job_type='kickside.uploads.service:process_dead']], { component_id }))
            local failures = assert(handle:query("SELECT id FROM kickside_event WHERE thread_id=$1 AND type=$2",
                { component_id, upload_types.EVENT.FAILED }))
            local callbacks = assert(handle:query([[SELECT id FROM kickside_job WHERE thread_id=$1 AND
                job_type='kickside.uploads.service:callback_job']], { component_id }))
            handle:release()
            test.eq(#outcome_jobs, 2, "recovery creates no dead outcomes")
            test.eq(#failures, 0)
            test.eq(#callbacks, 1)
            for _, checkpoint in ipairs(checkpoints) do
                test.eq(#completed(checkpoint.upload_id), checkpoint.outcome and 0 or 1)
            end

            local projected = checkpoints[1].upload_id
            exec("UPDATE kickside_upload_read_model SET status='completed' WHERE upload_id=$1", { projected })
            exec("DELETE FROM kickside_event WHERE thread_id=$1 AND external_id=$2", { component_id, projected })
            local after_prune, prune_err = funcs.call("kickside.uploads:retention", {})
            test.is_nil(prune_err, tostring(prune_err))
            test.is_true(after_prune.success, tostring(after_prune.error))
            test.eq(#completed(projected), 0, "a projected completion is not republished after event retention")
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
