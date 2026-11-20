-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local lifecycle_log = require("lifecycle_log")
local uuid = require("uuid")
local sql = require("sql")
local security = require("security")
local contract = require("contract")
local funcs = require("funcs")
local http_client = require("http_client")
local system = require("system")
local json = require("json")
local process = require("process")
local channel = require("channel")
local time = require("time")
local registry = require("registry")
local notify = require("notify")
local provision = require("provision")
local autoinit = require("autoinit")
local crud = require("crud")
local deletion_worker = require("deletion_worker")
local claim = require("claim")
local invoke = require("invoke")
local event_access = require("event_access")
local projection_reader = require("projection_reader")

local OWNER = "event-read-admin"
local READER = "event-read-reader"
local WRITER = "event-read-writer"
local ADMIN = "event-read-only-admin"
local ids: { string } = {}

local function scope()
    return assert(security.named_scope("wippy.security:process"))
end
local function actor(id: string)
    return security.new_actor(id, {security_groups = {}})
end
local function service(name: string, id: string)
    return assert(assert(contract.get(name)):with_actor(actor(id)):with_scope(scope()):open())
end
local function threads(id: string)
    return service("kickside.core:threads", id)
end
local function call(id: string, target: string, args: table)
    return funcs.new():with_actor(actor(id)):with_scope(scope()):call(target, args)
end
local function fixture(kind: string): string
    local created, err = threads(OWNER):create({id = uuid.v4(), impl_id = kind})
    test.is_nil(err)
    local id = created.thread_id
    ids[#ids + 1] = id
    for _, grant in ipairs({{id = READER, mask = 1}, {id = WRITER, mask = 3}, {id = ADMIN, mask = 8}}) do
        local _, grant_err = service("kickside.component:component_service", OWNER):grant_subtree({
            root_component_id = id, subject = {subject_type = "user", subject_id = grant.id}, access_mask = grant.mask,
        })
        test.is_nil(grant_err)
    end
    local _, append_err = threads(OWNER):append_event({thread_id = id, event = {
        type = "kickside.threads:message.created", body = {text = "authoritative"},
        external = {external_source = "actor:" .. OWNER, external_id = "source"},
    }})
    test.is_nil(append_err)
    return id
end
local function http(id: string, user: string, path: string?, method: string?, body: table?)
    local gateway = assert(system.supervisor.state("app:gateway"))
    local port = assert(gateway.details:match(":(%d+)$"))
    local response, err = http_client.request(method or "GET", "http://127.0.0.1:" .. port
        .. "/api/event-read/" .. user .. "/" .. id .. (path or "/events"), {
            headers = {["Content-Type"] = "application/json"}, body = body and assert(json.encode(body)) or nil,
        })
    test.is_nil(err)
    local raw_body = assert(response.body)
    local decoded, decode_err = json.decode(raw_body)
    test.is_nil(decode_err, tostring(response.status_code) .. ": " .. response.body)
    return response.status_code, decoded
end
local function denied(value: table?, err: error?)
    test.is_nil(value)
    test.not_nil(err)
    test.is_true(errors.is(err, errors.PERMISSION_DENIED))
end
local routes = {
    {name = "contract", read = function(id: string, user: string)
        return threads(user):list_events({thread_id = id})
    end},
    {name = "external identity", read = function(id: string, user: string)
        return threads(user):find_event_by_external({thread_id = id, event_type = "kickside.threads:message.created",
            external_source = "actor:" .. OWNER, external_id = "source"})
    end},
    {name = "pullable", read = function(id: string, user: string)
        return call(user, "kickside.core.threads:events_pullable", {config = {thread_id = id}, cursor = 0, limit = 10, idempotency_key = "read"})
    end},
}
local function execute(query: string, args: table)
    local db = assert(sql.get("app:db"))
    local _, err = db:execute(query, args)
    db:release()
    test.is_nil(err)
end
local function claim_projection(registration: table): table
    local db = assert(sql.get("app:db"))
    local dialect = assert(db:type())
    local tx = assert(db:begin())
    local token = uuid.v4()
    local now = time.now():utc()
    local lease = assert(claim.lease_row(tx, dialect, registration.job_id, token,
        now:add("45s"):format_rfc3339(), now:format_rfc3339()))
    assert(tx:commit())
    assert(db:release())
    return {
        job = {id = registration.job_id, lease_token = token, execution_seq = tonumber(lease.execution_seq)},
        payload = {cursor_id = registration.cursor_id},
    }
end
local function run_projection(registration: table): (table?, error?)
    return invoke.run(claim_projection(registration))
end
local function grant_reader(id: string)
    local _, err = service("kickside.component:component_service", OWNER):grant_subtree({
        root_component_id = id, subject = {subject_type = "user", subject_id = READER}, access_mask = 1,
    })
    test.is_nil(err)
end
local function assert_read_policy(id: string, restricted: boolean)
    local page, err = threads(READER):list_events({thread_id = id})
    if restricted then denied(page, err)
    else test.is_nil(err); test.not_nil(page) end
end
local function realtime_binding(id: string): table
    local db = assert(sql.get("app:db"))
    local query = assert(event_access.binding_query(db, id, sql.builder.select()))
    local rows = assert(query:run_with(db):query())
    assert(db:release())
    return assert(rows[1])
end
local function realtime(id: string, binding: table?): (table?, error?, table?)
    local topic = "event-read-" .. uuid.v4()
    local mailbox = assert(process.listen(topic))
    local hub = "user." .. OWNER
    local _, register_err = process.registry.register(hub)
    test.is_nil(register_err)
    local result, err = call(OWNER, "kickside.core.threads:emit_update", {
        thread_id = id, topic = topic, event = {body = {secret = true}},
        data = {secret = true}, thread = {secret = true}, binding = binding,
    })
    local selected = channel.select({mailbox:case_receive(), time.after("1s"):case_receive()})
    process.registry.unregister(hub)
    process.unlisten(mailbox)
    return result, err, selected.channel == mailbox and selected.value or nil
end
return {run = test.run_cases(function()
    test.describe("Thread event read access", function()
        test.after_all(function()
            for _, id in ipairs(ids) do
                local deleted, err = threads(OWNER):delete({thread_id = id})
                test.is_nil(err)
                if deleted.in_progress then
                    local finished, finish_err = deletion_worker.run(deleted.component_id)
                    test.is_nil(finish_err); test.is_true(finished.deleted)
                end
                execute("DELETE FROM kickside_thread WHERE id=$1", {lifecycle_log.thread_id(deleted.component_id)})
            end
        end)
        for _, route in ipairs(routes) do
            test.it(route.name .. " denies READ and permits ADMIN on declared kinds", function()
                local id = fixture("event.read.test:admin_kind")
                local value, err = route.read(id, READER)
                if route.name == "pullable" then
                    test.is_nil(err)
                    test.is_false(value.success)
                    test.eq(value.error.kind, errors.PERMISSION_DENIED)
                else denied(value, err) end
                for _, user in ipairs({OWNER, ADMIN}) do
                    value, err = route.read(id, user)
                    test.is_nil(err)
                    test.not_nil(value)
                    if route.name == "pullable" then test.is_true(value.success); test.eq(value.items[1].payload.text, "authoritative")
                    elseif route.name == "contract" then test.eq(#value.events, 1)
                    else test.eq(json.decode(value.event.body).text, "authoritative") end
                end
            end)
            for _, kind in ipairs({"event.read.test:public_kind", "kickside.core:thread"}) do
                test.it(route.name .. " keeps READ for " .. kind, function()
                    local id = fixture(kind)
                    local value, err = route.read(id, READER)
                    test.is_nil(err)
                    test.not_nil(value)
                    if route.name == "pullable" then test.is_true(value.success) end
                    value, err = route.read(id, ADMIN)
                    if route.name == "pullable" then
                        test.is_nil(err); test.is_false(value.success); test.eq(value.error.kind, errors.PERMISSION_DENIED)
                    else denied(value, err) end
                end)
            end
        end
        test.it("unregistered stored kinds keep READ across every event and projection reader", function()
            local id = fixture("event.read.test:public_kind")
            local _, register_err = threads(OWNER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker", debounce_idle_ms = 600000, debounce_max_ms = 600000})
            test.is_nil(register_err)
            execute("UPDATE kickside_components SET impl_id=$1 WHERE component_id=$2", {"event.read.test:retired_kind", id})
            for _, route in ipairs(routes) do
                local value, err = route.read(id, READER)
                test.is_nil(err); test.not_nil(value)
                if route.name == "pullable" then
                    test.is_true(value.success); test.eq(value.items[1].payload.text, "authoritative")
                elseif route.name == "contract" then test.eq(json.decode(value.events[1].body).text, "authoritative")
                else test.eq(json.decode(value.event.body).text, "authoritative") end
            end
            local status, body = http(id, "reader")
            test.eq(status, 200); test.eq(json.decode(body.events[1].body).text, "authoritative")
            local value, err = threads(READER):list_projections({thread_id = id})
            test.is_nil(err); test.eq(#value.projections, 1)
            value, err = threads(READER):get_projection_cursor({thread_id = id, kind = "count"})
            test.is_nil(err); test.not_nil(value.projection.body)
            value, err = service("kickside.core:read_models", READER):get({owner_id = id, kind = "count"})
            test.is_nil(err); test.not_nil(value.body)
            status, body = http(id, "reader", "/projections")
            test.eq(status, 200); test.eq(#body.projections, 1)
            value, err = threads(OWNER):append_event({thread_id = id,
                event = {type = "kickside.threads:message.created", body = {text = "refused"}}})
            test.is_nil(value); test.is_true(errors.is(err, errors.INVALID))
            test.eq(err:details().code, "thread_event_invalid")
            local page, read_err = threads(READER):list_events({thread_id = id})
            test.is_nil(read_err); test.eq(#page.events, 1)
        end)
        test.it("unregistered stored kinds need a matching publisher binding for realtime bodies", function()
            local id = fixture("event.read.test:public_kind")
            local old_binding = realtime_binding(id)
            execute("UPDATE kickside_components SET impl_id=$1 WHERE component_id=$2", {"event.read.test:retired_kind", id})
            local result, err, message = realtime(id, old_binding)
            test.is_nil(err); test.not_nil(result); test.not_nil(message)
            test.is_nil(message.event); test.is_nil(message.data); test.is_nil(message.thread)
            result, err, message = realtime(id, realtime_binding(id))
            test.is_nil(err); test.not_nil(result); test.not_nil(message)
            test.is_true(message.event.body.secret)
        end)
        for _, component_id in ipairs({"", uuid.v4(), "legacy-text-component"}) do
            test.it("realtime retains bodies only for explicitly unbound legacy threads/" .. (component_id == "" and "empty"
                or (component_id == "legacy-text-component" and "legacy text" or "absent UUID")), function()
                local id = uuid.v4()
                execute("INSERT INTO kickside_thread(id,component_id,attrs) VALUES($1,$2,$3)",
                    {id, component_id, assert(json.encode({user_ids = {OWNER}}))})
                local result, err, message = realtime(id)
                execute("DELETE FROM kickside_thread WHERE id=$1", {id})
                test.is_nil(err); test.not_nil(result); test.not_nil(message)
                if component_id == "" then
                    test.is_true(message.event.body.secret); test.is_true(message.data.secret); test.is_true(message.thread.secret)
                else
                    test.is_nil(message.event); test.is_nil(message.data); test.is_nil(message.thread)
                end
            end)
        end
        test.it("realtime strips bodies when thread and component ids differ", function()
            local id = fixture("event.read.test:public_kind")
            local component_id = fixture("event.read.test:admin_kind")
            -- This fixture constructs a thread whose component id differs from its id.
            execute("UPDATE kickside_thread SET component_id=$1 WHERE id=$2", {component_id, id})
            local result, err, message = realtime(id)
            execute("UPDATE kickside_thread SET component_id=$1 WHERE id=$1", {id})
            test.is_nil(err); test.not_nil(result); test.not_nil(message)
            test.is_nil(message.event); test.is_nil(message.data); test.is_nil(message.thread)
        end)
        test.it("realtime resolves the thread kind once across recipients and topics", function()
            local reads, sends = 0, 0
            local binding = {component_id = uuid.v4(), component_impl_id = "event.read.test:public_kind",
                component_incarnation = uuid.v4(), thread_incarnation = "created-at"}
            local instance = notify.new({
                load_thread = function(_thread_id: string): (table?, error?)
                    reads = reads + 1
                    local row = {}
                    for key, value in pairs(binding) do row[key] = value end
                    row.attrs = {user_ids = {OWNER, READER}}
                    return row, nil
                end,
                lookup = function(name: string): (any?, error?) return name, nil end,
                send = function(_pid: any, _topic: string, message: any): (any?, error?)
                    sends = sends + 1
                    test.eq(message.event.body.text, "authoritative")
                    return true, nil
                end,
            })
            local result, err = instance.emit_thread_update({
                thread_id = uuid.v4(), event = {body = {text = "authoritative"}}, binding = binding})
            test.is_nil(err); test.eq(reads, 1)
            test.eq(result.recipients, 2); test.eq(sends, result.topic_count * 2)
        end)
        test.it("HTTP GET events enforces the current declaration", function()
            local id = fixture("event.read.test:admin_kind")
            local status, body = http(id, "reader")
            test.eq(status, 403); test.is_false(body.success); test.is_nil(body.events)
            status, body = http(id, "admin")
            test.eq(status, 200); test.eq(#body.events, 1)
            id = fixture("event.read.test:public_kind")
            status, body = http(id, "reader")
            test.eq(status, 200); test.eq(#body.events, 1)
        end)
        test.it("message response listing enforces event access after the write", function()
            local id = fixture("event.read.test:admin_kind")
            local status, body = http(id, "writer", "/messages", "POST", {text = "appended"})
            test.eq(status, 403); test.is_nil(body.event)
            test.is_false(body.retryable)
            local page, err = threads(OWNER):list_events({thread_id = id})
            test.is_nil(err); test.eq(#page.events, 2)
        end)
        test.it("metadata reads stay available to READ holders", function()
            local id = fixture("event.read.test:admin_kind")
            for _, method in ipairs({"find", "list_children", "list_edges"}) do
                local value, err = threads(READER)[method](threads(READER), {thread_id = id})
                test.is_nil(err); test.not_nil(value); test.is_nil(value.events); test.is_nil(value.body)
            end
            local value, err = threads(READER):list({})
            test.is_nil(err); test.not_nil(value)
        end)
        test.it("thread responses keep policy lookup fields internal", function()
            local id = fixture("event.read.test:admin_kind")
            local value, err = threads(READER):find({thread_id = id})
            test.is_nil(err); test.is_nil(value.event_read)
            value, err = threads(READER):list({})
            test.is_nil(err)
            for _, row in ipairs(value.threads) do test.is_nil(row.event_read) end
            value, err = threads(OWNER):update({thread_id = id, state = "open"})
            test.is_nil(err); test.is_nil(value.thread.event_read)
            grant_reader(id)
            assert_read_policy(id, true)
        end)
        test.it("projection body reads honour event access", function()
            local id = fixture("event.read.test:admin_kind")
            local _, err = threads(OWNER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker", debounce_idle_ms = 600000, debounce_max_ms = 600000})
            test.is_nil(err)
            local value, read_err = threads(READER):list_projections({thread_id = id})
            denied(value, read_err)
            value, read_err = threads(READER):get_projection_cursor({thread_id = id, kind = "count"})
            denied(value, read_err)
            value, read_err = service("kickside.core:read_models", READER):get({owner_id = id, kind = "count"})
            denied(value, read_err)
            value, read_err = service("kickside.core:read_models", OWNER):get({owner_id = id, kind = "count"})
            test.is_nil(read_err); test.not_nil(value.body)
            value, read_err = service("kickside.core:read_models", ADMIN):get({owner_id = id, kind = "count"})
            test.is_nil(read_err); test.not_nil(value.body)
            for _, user in ipairs({OWNER, ADMIN}) do
                value, read_err = threads(user):list_projections({thread_id = id})
                test.is_nil(read_err); test.eq(#value.projections, 1)
                value, read_err = threads(user):get_projection_cursor({thread_id = id, kind = "count"})
                test.is_nil(read_err); test.not_nil(value.projection.body)
            end
            local status, body = http(id, "reader", "/projections")
            test.eq(status, 403); test.is_nil(body.projections)
            status, body = http(id, "admin", "/projections")
            test.eq(status, 200); test.eq(#body.projections, 1)
        end)
        test.it("realtime keeps restricted event bodies behind refetch", function()
            for _, kind in ipairs({"admin_kind", "public_kind"}) do
                local id = fixture("event.read.test:" .. kind)
                local topic = "event-read-" .. uuid.v4()
                local mailbox = assert(process.listen(topic))
                local hub = "user." .. OWNER
                local _, register_err = process.registry.register(hub)
                test.is_nil(register_err)
                local result, err = call(OWNER, "kickside.core.threads:emit_update", {
                    thread_id = id, topic = topic, event = {body = {secret = true}},
                    data = {secret = true}, thread = {secret = true}, binding = realtime_binding(id),
                })
                local selected = channel.select({mailbox:case_receive(), time.after("1s"):case_receive()})
                process.registry.unregister(hub)
                process.unlisten(mailbox)
                test.is_nil(err); test.not_nil(result)
                test.eq(selected.channel, mailbox)
                if kind == "admin_kind" then
                    test.is_nil(selected.value.event); test.is_nil(selected.value.data); test.is_nil(selected.value.thread)
                else test.is_true(selected.value.event.body.secret); test.is_true(selected.value.data.secret) end
            end
        end)
        test.it("realtime creation forwards unrestricted thread records and invalidates restricted threads", function()
            local mailbox = assert(process.listen("kickside.thread.update"))
            local hub = "user." .. OWNER
            assert(process.registry.register(hub))
            local client = threads(OWNER)
            local creates = {
                function() return client:create({id = uuid.v4(), impl_id = "event.read.test:public_kind"}) end,
                function()
                    local id = uuid.v4()
                    assert(service("kickside.component:component_service", OWNER):register({
                        component_id = id, impl_id = "event.read.test:public_kind"}))
                    return client:ensure_thread({component_id = id, impl_id = "event.read.test:public_kind"})
                end,
                function() return client:upsert({thread_class = "conversation", external_ref = uuid.v4()}) end,
                function() return client:create({id = uuid.v4(), impl_id = "event.read.test:admin_kind"}) end,
            }
            local results = {}
            for index, create in ipairs(creates) do
                local value, err = create()
                if value then ids[#ids + 1] = value.thread_id end
                local timeout = time.after("1s")
                local message: table? = nil
                while not message do
                    local selected = channel.select({mailbox:case_receive(), timeout:case_receive()})
                    if selected.channel ~= mailbox then break end
                    if selected.value.event_type == "kickside.threads:thread.created" then message = selected.value end
                end
                results[index] = {value = value, err = err, message = message}
            end
            process.registry.unregister(hub)
            process.unlisten(mailbox)
            for index, result in ipairs(results) do
                test.is_nil(result.err)
                test.not_nil(result.message)
                test.eq(result.message.event_type, "kickside.threads:thread.created")
                test.eq(result.message.thread_id, result.value.thread_id)
                if index == #results then test.is_nil(result.message.thread)
                else test.eq(result.message.thread.id, result.value.thread_id) end
            end
        end)
        test.it("drop notifications contain subscriber declarations and follow the target read policy", function()
            for _, kind in ipairs({"public_kind", "admin_kind"}) do
                local source = fixture("event.read.test:admin_kind")
                local target = fixture("event.read.test:" .. kind)
                local _, register_err = threads(OWNER):register_projection({thread_id = source, kind = "count",
                    worker_ref = "func://app:test_count_worker",
                    drop_notify = {thread_id = target, type = "kickside.threads:message.created", body = {reason = "dropped"}}})
                test.is_nil(register_err)
                local deleted, delete_err = threads(OWNER):delete({thread_id = source})
                test.is_nil(delete_err)
                local finished, finish_err = deletion_worker.run(deleted.component_id)
                test.is_nil(finish_err); test.is_true(finished.deleted)
                for index, id in ipairs(ids) do if id == source then table.remove(ids, index); break end end
                local value, err = threads(READER):list_events({thread_id = target})
                if kind == "admin_kind" then denied(value, err)
                else
                    test.is_nil(err)
                    local body = assert(json.decode(value.events[1].body))
                    test.eq(body.reason, "dropped"); test.eq(body.source_thread_id, source); test.is_nil(body.text)
                end
            end
        end)
        test.it("binding an unregistered kind keeps READ", function()
            local value, err = threads(OWNER):create({id = uuid.v4(), impl_id = "event.read.test:missing_kind"})
            test.is_nil(err); test.not_nil(value)
            ids[#ids + 1] = value.thread_id
            grant_reader(value.thread_id)
            assert_read_policy(value.thread_id, false)
            test.is_nil(value.thread.event_read)
        end)
        test.it("a binding with an absent event block keeps READ", function()
            local created, create_err = threads(OWNER):create({id = uuid.v4(), impl_id = "event.read.test:empty_kind"})
            test.is_nil(create_err)
            local id = created.thread_id
            ids[#ids + 1] = id
            local _, grant_err = service("kickside.component:component_service", OWNER):grant_subtree({
                root_component_id = id, subject = {subject_type = "user", subject_id = READER}, access_mask = 1})
            test.is_nil(grant_err)
            local value, err = threads(READER):list_events({thread_id = id})
            test.is_nil(err); test.eq(#value.events, 0)
        end)
        test.it("implementation entries with an absent declaration keep READ", function()
            local id = uuid.v4()
            local _, register_err = service("kickside.component:component_service", OWNER):register({
                component_id = id, impl_id = "event.read.test:legacy_impl"})
            test.is_nil(register_err)
            local _, ensure_err = threads(OWNER):ensure_thread({component_id = id, impl_id = "event.read.test:empty_kind"})
            test.is_nil(ensure_err)
            ids[#ids + 1] = id
            local _, grant_err = service("kickside.component:component_service", OWNER):grant_subtree({
                root_component_id = id, subject = {subject_type = "user", subject_id = READER}, access_mask = 1})
            test.is_nil(grant_err)
            local page, err = threads(READER):list_events({thread_id = id})
            test.is_nil(err); test.eq(#page.events, 0)
        end)
        test.it("an unrestricted kind honors a READ grant without registry access to the kind", function()
            local id = fixture("event.read.test:public_kind")
            local restricted = assert(security.new_scope({assert(security.policy("event.read.test:reader_scope")),
                assert(security.policy("event.read.test:reader_config")),
                assert(security.policy("event.read.test:reader_deny_policy_function"))}))
            test.is_true(restricted:evaluate(actor(READER), "registry.get", "event.read.test:public_kind") ~= "allow")
            local executor = funcs.new():with_actor(actor(READER)):with_scope(restricted)
            local base, base_err = executor:call("event.read.test:component_read_access", {component_id = id})
            test.is_nil(base_err); test.is_false(base.success)
            test.eq(base.kind, errors.PERMISSION_DENIED)
            local value, err = assert(assert(contract.get("kickside.core:threads"))
                :with_actor(actor(READER)):with_scope(restricted):open()):list_events({thread_id = id})
            test.is_nil(err); test.eq(#value.events, 1)
            local ungranted = assert(assert(contract.get("kickside.core:threads"))
                :with_actor(actor("event-read-ungranted")):with_scope(restricted):open())
            denied(ungranted:list_events({thread_id = id}))
        end)
        for _, kind in ipairs({"invalid_kind", "false_kind", "number_kind"}) do
            test.it("binding refuses an invalid read declaration/" .. kind, function()
                local id = uuid.v4()
                local value, err = threads(OWNER):create({id = id, impl_id = "event.read.test:" .. kind})
                test.is_nil(value); test.is_true(errors.is(err, errors.INVALID))
                test.eq(err:details().code, "thread_event_invalid")
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT id FROM kickside_thread WHERE id=$1", {id}))
                db:release()
                test.eq(#rows, 0)
            end)
        end
        test.it("read models authorize the stored component when a restricted owner differs", function()
            local id = fixture("event.read.test:public_kind")
            local target = fixture("event.read.test:admin_kind")
            local _, grant_err = service("kickside.component:component_service", OWNER):grant_subtree({
                root_component_id = target, subject = {subject_type = "user", subject_id = WRITER}, access_mask = 9})
            test.is_nil(grant_err)
            local _, projection_err = threads(OWNER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker", debounce_idle_ms = 600000, debounce_max_ms = 600000})
            test.is_nil(projection_err)
            -- This fixture constructs a thread whose component id differs from its id.
            execute("UPDATE kickside_thread SET component_id=$1 WHERE id=$2", {target, id})
            local value, err = service("kickside.core:read_models", WRITER):get({owner_id = id, kind = "count"})
            test.is_nil(err); test.not_nil(value.body)
            value, err = service("kickside.core:read_models", READER):get({owner_id = id, kind = "count"})
            denied(value, err)
            execute("UPDATE kickside_thread SET component_id=$1 WHERE id=$1", {id})
        end)
        test.it("existing thread access follows its current kind in both directions", function()
            local id = fixture("event.read.test:public_kind")
            local function assert_policy(kind: string, restricted: boolean)
                execute("UPDATE kickside_components SET impl_id=$1 WHERE component_id=$2", {"event.read.test:" .. kind, id})
                for _, route in ipairs(routes) do
                    local value, err = route.read(id, READER)
                    if route.name == "pullable" then
                        test.is_nil(err); test.eq(value.success, not restricted)
                    elseif restricted then denied(value, err)
                    else test.is_nil(err); test.not_nil(value) end
                end
                local status, body = http(id, "reader")
                test.eq(status, restricted and 403 or 200)
                if restricted then test.is_nil(body.events) else test.eq(#body.events, 1) end
                local result, err, message = realtime(id, realtime_binding(id))
                test.is_nil(err); test.not_nil(result)
                if restricted then test.is_nil(message.event)
                else test.is_true(message.event.body.secret) end
            end
            assert_policy("admin_kind", true)
            assert_policy("public_kind", false)
        end)
        test.it("existing-component attach uses the stored kind instead of supplied attrs or kind", function()
            local id = uuid.v4()
            local value, err = service("kickside.component:component_service", OWNER):register({
                component_id = id, impl_id = "event.read.test:admin_kind"})
            test.is_nil(err); test.is_true(value.success)
            value, err = threads(OWNER):ensure_thread({component_id = id, impl_id = "event.read.test:public_kind",
                event_read = "", attrs = {event_read = ""}})
            test.is_nil(err); test.not_nil(value)
            ids[#ids + 1] = id
            grant_reader(id)
            assert_read_policy(id, true)
        end)
        test.it("public component-first attachment keeps the component's declared access", function()
            local id = uuid.v4()
            local component = service("kickside.component:component_service", OWNER)
            local registered, register_err = component:register({component_id = id, impl_id = "event.read.test:admin_kind"})
            test.is_nil(register_err); test.is_true(registered.success)
            ids[#ids + 1] = id
            local _, grant_err = component:grant_subtree({
                root_component_id = id, subject = {subject_type = "user", subject_id = READER}, access_mask = 1,
            })
            test.is_nil(grant_err)
            local attached, attach_err = threads(OWNER):ensure_thread({
                component_id = id, impl_id = "event.read.test:public_kind", trusted_audit = true,
            })
            test.is_nil(attach_err); test.eq(attached.thread_id, id)
            denied(threads(READER):list_events({thread_id = id}))
        end)
        test.it("restricts caller-selected projection workers to writers with ADMIN", function()
            local id = fixture("event.read.test:admin_kind")
            local spec = {thread_id = id, kind = "count", worker_ref = "func://app:test_count_worker",
                worker_input_mode = "prefetch_events", start_at_head = true}
            denied(threads(WRITER):register_projection(spec))
            denied(threads(ADMIN):register_projection(spec))
            local registered, err = threads(OWNER):register_projection(spec)
            test.is_nil(err); test.not_nil(registered.projection_id)
            spec.worker_input_mode = "cursor_only"
            denied(threads(WRITER):register_projection(spec))
            local selected, read_err = threads(ADMIN):get_projection_cursor({thread_id = id, kind = "count"})
            test.is_nil(read_err)
            test.eq(json.decode(selected.projection.body).meta.worker_input_mode, "prefetch_events")
        end)
        test.it("restricted convergence only applies the component's own declaration", function()
            local id = fixture("event.read.test:admin_kind")
            local attached, err = threads(WRITER):ensure_thread({component_id = id, impl_id = "app:provision_test_decl"})
            test.is_nil(err); test.eq(attached.thread_id, id)
            local page, read_err = threads(ADMIN):list_projections({thread_id = id})
            test.is_nil(read_err); test.eq(#page.projections, 0)
        end)
        test.it("restricted convergence requires ADMIN to register the kind's worker", function()
            local kind = "event.read.test:admin_kind"
            local id = fixture(kind)
            local original = assert(registry.get(kind))
            local change = assert(registry.snapshot()):changes()
            change:update({id = kind, kind = original.kind, data = original.data, meta = {
                events = original.meta.events,
                projections = {{kind = "count", worker_ref = "func://app:test_count_worker",
                    input_mode = "prefetch_events"}},
            }})
            assert(change:apply())
            local refused, refuse_err = threads(WRITER):ensure_thread({component_id = id, impl_id = kind})
            local existing = assert(threads(ADMIN):list_projections({thread_id = id}))
            local registered, register_err = threads(OWNER):ensure_thread({component_id = id, impl_id = kind})
            local configured = assert(threads(ADMIN):list_projections({thread_id = id}))
            local restore = assert(registry.snapshot()):changes()
            restore:update(original)
            assert(restore:apply())
            denied(refused, refuse_err)
            test.eq(#existing.projections, 0)
            test.is_nil(register_err)
            test.eq(registered.thread_id, id)
            test.eq(#configured.projections, 1)
        end)
        test.it("applies the policy of the component joined to existing payloads", function()
            local id = fixture("event.read.test:public_kind")
            local _, register_err = threads(OWNER):register_projection({
                thread_id = id, kind = "count", worker_ref = "func://app:test_count_worker",
            })
            test.is_nil(register_err)
            execute("UPDATE kickside_components SET impl_id=$1 WHERE component_id=$2", {"event.read.test:admin_kind", id})
            local client = threads(READER)
            denied(client:list_events({thread_id = id}))
            local lookup = {thread_id = id, event_type = "kickside.threads:message.created",
                external_source = "actor:" .. OWNER, external_id = "source"}
            denied(client:find_event_by_external(lookup))
            lookup.latest = true
            denied(client:find_event_by_external(lookup))
            denied(client:list_projections({thread_id = id}))
            denied(client:get_projection_cursor({thread_id = id, kind = "count"}))
        end)
        for _, repair in ipairs({"restore grant", "relax policy"}) do
            test.it("re-registers a denied projection from its saved position/" .. repair, function()
                local kind = "event.read.test:live_kind"
                local id = fixture(kind)
                local spec = {thread_id = id, kind = "count", worker_ref = "func://app:test_count_worker",
                    worker_input_mode = "prefetch_events"}
                local initial = assert(threads(WRITER):register_projection(spec)).projection
                local first = assert(run_projection(initial))
                test.eq(tonumber(first.last_seq), 1)
                local grants = service("kickside.component:component_service", ADMIN)
                local grant = {root_component_id = id, subject = {subject_type = "user", subject_id = OWNER}, access_mask = 7}
                test.is_true(assert(grants:grant_subtree(grant)).success)
                grant.access_mask = 15
                local original = assert(registry.get(kind))
                local function replace(entry: table)
                    local changes = assert(registry.snapshot()):changes()
                    changes:update(entry)
                    assert(changes:apply())
                end
                replace({id = kind, kind = original.kind, data = original.data,
                    meta = {events = {read = "admin", input = original.meta.events.input}}})
                local _, append_err = threads(OWNER):append_event({thread_id = id,
                    event = {type = "kickside.threads:message.created", body = {text = "after opt-in"}}})
                local held, hold_err = run_projection(initial)
                local saved = assert(threads(ADMIN):get_projection_cursor({thread_id = id, kind = "count"}))
                if repair == "restore grant" then
                    test.is_true(assert(grants:grant_subtree(grant)).success)
                else
                    replace(original)
                end
                local registered, register_err = threads(OWNER):register_projection(spec)
                local folded, fold_err
                if registered then folded, fold_err = run_projection(registered.projection) end
                if repair == "restore grant" then replace(original)
                else test.is_true(assert(grants:grant_subtree(grant)).success) end
                test.is_nil(append_err)
                test.is_nil(hold_err)
                test.is_true(held.invalid)
                test.eq(saved.cursor.status, "invalid")
                test.contains(saved.cursor.last_error, "thread_event_read_denied")
                test.eq(tonumber(saved.cursor.last_seq), 1)
                test.is_nil(register_err)
                test.eq(registered.projection.cursor_id, initial.cursor_id)
                test.is_nil(fold_err)
                test.eq(tonumber(folded.last_seq), 2)
            end)
        end
        test.it("reserves component identities while their primary thread is pending reap", function()
            local id = uuid.v4()
            execute("INSERT INTO kickside_component_thread_reap(component_id,created_at) VALUES ($1,$2)",
                {id, time.now():utc():format_rfc3339()})
            local client = service("kickside.component:component_service", OWNER)
            local value, err = client:register({component_id = id, impl_id = "event.read.test:public_kind"})
            execute("DELETE FROM kickside_component_thread_reap WHERE component_id=$1", {id})
            -- The component-only fixture has no primary thread for suite cleanup.
            if value and value.success then assert(client:delete({component_id = id})) end
            test.is_nil(err)
            test.is_false(value.success)
            test.eq(value.kind, errors.CONFLICT)
            test.is_true(value.retryable)
            assert(client:register({component_id = id, impl_id = "event.read.test:public_kind"}))
            local deleted = assert(client:delete({component_id = id}))
            if deleted.in_progress then assert(deletion_worker.run(id)) end
        end)
        test.it("an allowed run-as identity keeps its cursor through a policy opt-in", function()
            local kind = "event.read.test:live_kind"
            local id = fixture(kind)
            local projection = assert(threads(WRITER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker", worker_input_mode = "prefetch_events"})).projection
            local original = assert(registry.get(kind))
            local change = assert(registry.snapshot()):changes()
            change:update({id = kind, kind = original.kind, data = original.data,
                meta = {events = {read = "admin", input = original.meta.events.input}}})
            assert(change:apply())
            local advanced, advance_err = run_projection(projection)
            local restore = assert(registry.snapshot()):changes()
            restore:update(original)
            assert(restore:apply())
            test.is_nil(advance_err)
            test.eq(tonumber(advanced.last_seq), 1)
        end)
        test.it("an actorless cursor on a member projection cannot inherit framework read access", function()
            local id = fixture("event.read.test:public_kind")
            local projection = assert(threads(OWNER):register_projection({thread_id = id, kind = "lifecycle.reap",
                worker_ref = "func://app:test_count_worker", worker_input_mode = "prefetch_events"})).projection
            execute("UPDATE kickside_projection_cursor SET actor_id=NULL, execution_identity_json=NULL WHERE id=$1",
                {projection.cursor_id})
            local held, err = run_projection(projection)
            test.is_nil(err)
            test.is_true(held.invalid)
            local saved = assert(threads(OWNER):get_projection_cursor({thread_id = id, kind = "lifecycle.reap"}))
            test.eq(tonumber(saved.cursor.last_seq), 0)
            test.contains(saved.cursor.last_error, "thread_event_read_denied")
        end)
        local maintenance = "system:core.owned.fixture"

        local function owned_fixture(kind: string): (string, any)
            local service = threads(maintenance)
            local created = assert(service:create({id = uuid.v4(), impl_id = kind}))
            local id = created.thread_id
            assert(service:append_event({thread_id = id,
                event = {type = "kickside.threads:message.created", body = {text = "owned input"}}}))
            local cursor = assert(service:get_projection_cursor({thread_id = id, kind = "owned.fixture"})).cursor
            return id, {cursor_id = cursor.id, job_id = cursor.job_id}
        end

        test.it("dispatches an installed component fold without the Jobs actor or authority", function()
            local id, registration = owned_fixture("core.owned.fixture:kind")
            local value, err = funcs.call("kickside.core.projections:advance", claim_projection(registration))
            test.is_nil(err, tostring(err))
            test.eq(value and tonumber(value.last_seq), 1)
            local slot = assert(threads(maintenance):get_projection_cursor({thread_id = id, kind = "owned.fixture"}))
            test.eq(slot.projection.body.count, 1)
            test.eq(slot.projection.body.effect, "fixture effect ran")
            test.eq(slot.projection.body.ambient_permission, false)
            test.eq(slot.projection.body.actor, "kickside.core:component_projection")
        end)

        test.it("rejects returned event writes in the component fold", function()
            local id, registration = owned_fixture("core.owned.fixture:returning_kind")
            local result, err = funcs.call("kickside.core.projections:advance", claim_projection(registration))
            test.is_nil(err, tostring(err))
            test.is_true(result and result.invalid)
            local slot = assert(threads(maintenance):get_projection_cursor({thread_id = id, kind = "owned.fixture"}))
            test.eq(tonumber(slot.cursor.last_seq), 0)
            test.contains(slot.cursor.last_error, "component-owned projection cannot return append_events")
        end)

        for _, kind in ipairs({"unmarked_kind", "wrong_mode_kind"}) do
            test.it("refuses invalid component fold provisioning/" .. kind, function()
                local id = uuid.v4()
                local created, err = threads(maintenance):create({id = id, impl_id = "core.owned.fixture:" .. kind})
                test.is_nil(created)
                test.is_true(errors.is(err, errors.INVALID), tostring(err))
                test.eq(err:details().code, "thread_declaration_owned_worker_required")
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT id FROM kickside_projection_cursor WHERE thread_id=$1", {id}))
                assert(db:release())
                test.eq(#rows, 0)
            end)
        end

        test.it("refuses a member-selected private fold on another primary thread", function()
            local id = fixture("event.read.test:public_kind")
            denied(threads(OWNER):register_projection({thread_id = id, kind = "not_the_installed_fold",
                worker_ref = "func://core.owned.fixture:fold", worker_input_mode = "prefetch_events"}))
        end)

        for _, scenario in ipairs({
            {name = "revoked run-as access", delivered = false},
            {name = "an unrelated registry edit", edit = "event.read.test:invalid_kind", delivered = true},
            {name = "a changed source declaration", edit = "event.read.test:admin_kind", delivered = false},
        }) do
            test.it("post-commit callback delivery after " .. scenario.name, function()
                local id = fixture("event.read.test:admin_kind")
                local grants = service("kickside.component:component_service", ADMIN)
                local grant = {root_component_id = id, subject = {subject_type = "user", subject_id = OWNER},
                    access_mask = 7}
                local topic = "post-commit-" .. uuid.v4()
                local folding = assert(process.listen(topic .. ":fold"))
                local mailbox = assert(process.listen(topic))
                local original = scenario.edit and assert(registry.get(scenario.edit))
                local projection = assert(threads(OWNER):register_projection({thread_id = id, kind = "count",
                    worker_ref = "func://event.read.test:callback_fold", worker_input_mode = "prefetch_events",
                    worker_config = {receiver = tostring(process.pid()), topic = topic}})).projection
                local future = assert(funcs.new():async("kickside.core.projections:advance", claim_projection(projection)))
                local started = channel.select({folding:case_receive(), future:response():case_receive(),
                    time.after("5s"):case_receive()})
                process.unlisten(folding)
                test.eq(started.channel, folding, "the fold starts with access to the prefetched event")
                if original then
                    local snapshot = assert(registry.snapshot())
                    local changed = assert(snapshot:get(scenario.edit))
                    changed.meta.comment = "changed during the fold"
                    local change = snapshot:changes()
                    change:update(changed)
                    assert(change:apply())
                else
                    test.is_true(assert(grants:grant_subtree(grant)).success)
                end
                assert(process.send(started.value, topic .. ":resume", true))
                assert(select(2, future:response():receive()))
                local payload, err = future:result()
                local selected = channel.select({mailbox:case_receive(), time.after("250ms"):case_receive()})
                process.unlisten(mailbox)
                if original then
                    local restore = assert(registry.snapshot()):changes()
                    restore:update(original)
                    assert(restore:apply())
                else
                    local page, read_err = threads(OWNER):list_events({thread_id = id})
                    grant.access_mask = 15
                    test.is_true(assert(grants:grant_subtree(grant)).success)
                    denied(page, read_err)
                end
                test.is_nil(err, tostring(err))
                local advanced = assert(payload:data())
                test.eq(tonumber(advanced.last_seq), 1)
                test.eq(selected.channel == mailbox, scenario.delivered)
                if scenario.delivered then test.eq(selected.value, "authoritative") end
            end)
        end
        test.it("first credential encryption preserves restricted projection access", function()
            local kind = "event.read.test:admin_kind"
            local id = fixture(kind)
            -- Published rows can predate the secrets incarnation column.
            execute("UPDATE kickside_components SET secrets_incarnation=NULL WHERE component_id=$1", {id})
            local function secrets_incarnation(): string?
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT secrets_incarnation FROM kickside_components WHERE component_id=$1", {id}))
                assert(db:release())
                return rows[1].secrets_incarnation
            end
            test.is_nil(secrets_incarnation())
            local projection = assert(threads(OWNER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker", worker_input_mode = "prefetch_events"})).projection
            local original = assert(registry.get(kind))
            local change = assert(registry.snapshot()):changes()
            change:update({id = kind, kind = original.kind, data = original.data,
                meta = {events = original.meta.events, secret_fields = {{path = {"api_key"}, type = "string"}}}})
            assert(change:apply())
            local encrypted, encrypt_err = service("kickside.component:component_service", OWNER):update({
                component_id = id, commands = {{type = "SET_CONTEXT", payload = {private_context = {api_key = "fixture"}}}},
            })
            local reader_result, reader_err = threads(READER):list_events({thread_id = id})
            local advanced, advance_err = run_projection(projection)
            local restore = assert(registry.snapshot()):changes()
            restore:update(original)
            assert(restore:apply())
            test.is_nil(encrypt_err)
            test.is_true(encrypted.success)
            denied(reader_result, reader_err)
            test.is_nil(advance_err)
            test.eq(tonumber(advanced.last_seq), 1)
            test.not_nil(secrets_incarnation())
        end)
        test.it("an existing thread follows an update to its registry declaration", function()
            local kind = "event.read.test:live_kind"
            local id = fixture(kind)
            local arguments = {thread_id = id}
            local original = assert(registry.get(kind))
            local function replace(entry: table)
                local changes = assert(registry.snapshot()):changes()
                changes:update(entry)
                assert(changes:apply())
            end
            local first, first_err = threads(READER):list_events(arguments)
            test.is_nil(first_err); test.eq(#first.events, 1)
            replace({id = kind, kind = original.kind, data = original.data,
                meta = {events = {read = "admin", input = original.meta.events.input}}})
            local reader_page, reader_err = threads(READER):list_events(arguments)
            local admin_page, admin_err = threads(ADMIN):list_events(arguments)
            replace(original)
            denied(reader_page, reader_err)
            test.is_nil(admin_err); test.eq(admin_page.events[1].id, first.events[1].id)
            local restored, restore_err = threads(READER):list_events(arguments)
            test.is_nil(restore_err); test.eq(restored.events[1].body, first.events[1].body)
        end)
        test.it("authorizes an empty read model before revealing availability", function()
            local id = fixture("event.read.test:admin_kind")
            denied(service("kickside.core:read_models", READER):get({owner_id = id, kind = "count"}))
            local model, err = service("kickside.core:read_models", ADMIN):get({owner_id = id, kind = "count"})
            test.is_nil(err); test.eq(next(model.body), nil)
        end)
        test.it("gates catch-up progress on the same policy as cursor reads", function()
            local id = fixture("event.read.test:admin_kind")
            local _, register_err = threads(OWNER):register_projection({
                thread_id = id, kind = "count", worker_ref = "func://app:test_count_worker", start_at_head = true,
            })
            test.is_nil(register_err)
            denied(threads(READER):catch_up_projection({thread_id = id, kind = "count"}))
            denied(threads(READER):catch_up_projection({thread_id = id, kind = "count", target_seq = 1000}))
            local progress, err = threads(ADMIN):catch_up_projection({thread_id = id, kind = "count"})
            test.is_nil(err); test.is_true(progress.done)
        end)
        test.it("catch-up progress rechecks grants and the captured source binding", function()
            local id = fixture("event.read.test:admin_kind")
            assert(threads(OWNER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker", start_at_head = true}))
            local caller = assert(security.actor()):id()
            local client = service("kickside.component:component_service", OWNER)
            local subject = {subject_type = "user", subject_id = caller}
            assert(client:grant_subtree({root_component_id = id, subject = subject, access_mask = 8}))
            local db = assert(sql.get("app:db"))
            local request = {}
            local selected = assert(projection_reader.select_projection_cursor(db, id, {kind = "count"}, request))
            assert(db:release())
            assert(client:revoke_subtree({root_component_id = id, subject = subject, access_mask = 8}))
            db = assert(sql.get("app:db"))
            local progress, err = projection_reader.catch_up_progress(db, id, selected, request)
            assert(db:release())
            denied(progress, err)
            assert(client:grant_subtree({root_component_id = id, subject = subject, access_mask = 8}))
            execute("UPDATE kickside_projection_cursor SET generation=generation+1 WHERE id=$1", {selected.id})
            db = assert(sql.get("app:db"))
            progress, err = projection_reader.catch_up_progress(db, id, selected, request)
            assert(db:release())
            test.is_nil(progress)
            test.is_true(errors.is(err, errors.CONFLICT))
            test.is_true(err:retryable())
        end)
        test.it("catch-up progress rechecks the read policy after selection", function()
            local kind = "event.read.test:live_kind"
            local id = fixture(kind)
            assert(threads(OWNER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker"}))
            local client = service("kickside.component:component_service", OWNER)
            local subject = {subject_type = "user", subject_id = assert(security.actor()):id()}
            test.is_true(assert(client:grant_subtree({root_component_id = id, subject = subject, access_mask = 1})).success)
            local request = {}
            local db = assert(sql.get("app:db"))
            local selected = assert(projection_reader.select_projection_cursor(db, id, {kind = "count"}, request))
            assert(db:release())

            local original = assert(registry.get(kind))
            local change = assert(registry.snapshot()):changes()
            change:update({id = kind, kind = original.kind, data = original.data,
                meta = {events = {read = "admin", input = original.meta.events.input}}})
            assert(change:apply())
            db = assert(sql.get("app:db"))
            local progress, err = projection_reader.catch_up_progress(db, id, selected, request)
            assert(db:release())
            local restore = assert(registry.snapshot()):changes()
            restore:update(original)
            assert(restore:apply())
            denied(progress, err)
        end)
        test.it("requires ADMIN before exposing or waking a restricted cursor through controls", function()
            local id = fixture("event.read.test:admin_kind")
            assert(threads(OWNER):register_projection({thread_id = id, kind = "count",
                worker_ref = "func://app:test_count_worker", start_at_head = true}))
            local args = {thread_id = id, kind = "count"}
            denied(threads(WRITER):pause_projection(args))
            denied(threads(WRITER):resume_projection(args))
            test.eq(assert(threads(OWNER):pause_projection(args)).status, "paused")
            test.eq(assert(threads(OWNER):resume_projection(args)).status, "active")
        end)
        test.it("preserves retry outcomes while withholding restricted event receipts", function()
            local id = fixture("event.read.test:admin_kind")
            local function append(client: any, thread_id: string, event: table, expect: table?): (any?, error?)
                return client:append_event({thread_id = thread_id, event = event, expect = expect})
            end
            local event = {type = "kickside.threads:message.created", id = uuid.v4(), subject = "saved", body = {}}
            assert(append(threads(OWNER), id, event))
            local reader = assert(append(threads(WRITER), id, event))
            test.eq(reader.duplicates, 1)
            test.is_nil(reader.events[1].event_id); test.is_nil(reader.events[1].seq)
            test.is_nil(reader.events[1].subject); test.is_nil(reader.events[1].subject_version)
            test.eq(assert(append(threads(OWNER), id, event)).events[1].event_id, event.id)
            event.subject = "requested"
            local outcome, err = append(threads(WRITER), id, event, {head = 0})
            test.is_nil(outcome); test.is_true(errors.is(err, errors.CONFLICT))
            test.is_nil(err:details().stored_subject); test.is_nil(err:details().event_id)
            local other = fixture("event.read.test:public_kind")
            outcome, err = append(threads(OWNER), other, event)
            test.is_nil(outcome); test.is_true(errors.is(err, errors.CONFLICT))
        end)
        test.it("a denied event page reaches Core without any payload rows or bytes", function()
            local id = fixture("event.read.test:admin_kind")
            local db = assert(sql.get("app:db"))
            local request = {}
            local page = sql.builder.select("body"):from("kickside_event")
                :where("thread_id = ?", id):order_by("seq")
            local query = assert(event_access.authorized_query(db, id, page, sql.builder.select(), request, 1000))
            local rows, err = event_access.execute(db, id, query, request)
            assert(db:release())
            test.is_nil(err)
            test.eq(#rows, 1)
            test.eq(rows[1].payload_allowed, 0)
            test.is_nil(rows[1].body)
        end)
        test.it("keeps event policy out of published storage", function()
            local id = fixture("event.read.test:admin_kind")
            local db = assert(sql.get("app:db"))
            local rows, err = db:query("SELECT * FROM kickside_thread WHERE id=$1", {id})
            db:release()
            test.is_nil(err); test.eq(#rows, 1); test.is_nil(rows[1].event_read)
        end)
        for _, mode in ipairs({"maintenance", "trusted_audit"}) do
            for _, stored in ipairs({"admin_kind", "missing_kind"}) do
                test.it(mode .. " attachment reads its component declaration/" .. stored, function()
                    local supplied = stored == "admin_kind" and "missing_kind" or "admin_kind"
                    local id = uuid.v4()
                    local value, err = service("kickside.component:component_service", OWNER):register({
                        component_id = id, impl_id = "event.read.test:" .. stored})
                    test.is_nil(err); test.is_true(value.success)
                    ids[#ids + 1] = id
                    local db = assert(sql.get("app:db"))
                    local attach = mode == "trusted_audit" and crud.create_audit or crud.create
                    value, err = attach(db, {component_id = id, impl_id = "event.read.test:" .. supplied},
                        OWNER, {system = true}, nil, mode == "maintenance")
                    test.is_nil(select(2, db:release()))
                    test.is_nil(err); test.eq(value.thread.id, id)
                    grant_reader(id)
                    assert_read_policy(id, stored == "admin_kind")
                end)
            end
        end
        for _, natural in ipairs({false, true}) do
            test.it("upsert binds the declared level/" .. tostring(natural), function()
                local args = {impl_id = "event.read.test:admin_kind", thread_id = uuid.v4()}
                if natural then
                    args = {impl_id = "event.read.test:admin_kind", thread_class = "event-read-natural", external_ref = uuid.v4()}
                end
                local value, err = threads(OWNER):upsert(args)
                test.is_nil(err); test.not_nil(value)
                ids[#ids + 1] = value.thread_id
                grant_reader(value.thread_id)
                assert_read_policy(value.thread_id, true)
                local repeated, repeat_err = threads(OWNER):upsert(args)
                test.is_nil(repeat_err); test.eq(repeated.thread_id, value.thread_id)
                assert_read_policy(value.thread_id, true)
            end)
        end
        test.it("provisioned threads use the declared admin level", function()
            local provisioned, err = provision.ensure_user(actor(OWNER), scope(), OWNER)
            test.is_nil(err)
            local expected = autoinit.component_id(OWNER, "event_read_provision")
            local found = false
            for _, id in ipairs(provisioned) do
                ids[#ids + 1] = id
                if id == expected then found = true end
            end
            test.is_true(found)
            grant_reader(expected)
            assert_read_policy(expected, true)
            local repeated, repeat_err = provision.ensure_user(actor(OWNER), scope(), OWNER)
            test.is_nil(repeat_err); test.eq(#repeated, #provisioned)
            assert_read_policy(expected, true)
        end)
        test.it("PATCH and update leave the declaration authoritative", function()
            for _, kind in ipairs({"public_kind", "admin_kind"}) do
                local id = fixture("event.read.test:" .. kind)
                local expected = kind == "admin_kind" and "admin" or ""
                local attempted = expected == "" and "admin" or ""
                local value, err = threads(OWNER):update({thread_id = id, state = "open", event_read = attempted,
                    attrs = {event_read = attempted, user_ids = {OWNER}}})
                test.is_nil(err); test.not_nil(value)
                assert_read_policy(id, expected == "admin")
                local status = http(id, "admin", "", "PATCH", {event_read = attempted, state = "open", attrs = {event_read = attempted}})
                test.eq(status, 200); assert_read_policy(id, expected == "admin")
            end
        end)
    end)
end)}
