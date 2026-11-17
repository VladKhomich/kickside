-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local json = require("json")
local registry = require("registry")
local writable_module = require("run_writable")
local maintenance_module = require("maintenance")
local admission = require("admission")
local store = require("store")
local scaffold = require("admission_scaffold")

local function fixture(): any
    local sc = scaffold.new({ test = test, uuid = uuid, run_writable = writable_module,
        maintenance = maintenance_module, admission = admission, store = store })
    local engine, calls, faults, cli = sc.new_engine()
    local appender, append = sc.new_appender()
    sc.install(cli, append)
    local target = uuid.v4()
    local state: any = { callbacks = {}, opens = 0, commits = 0, live = true, exists = true }
    local selected_component: any = { ACCESS = { WRITE = 2 } }
    function selected_component.open(id: string, access: any, contract_id: string): (any?, any?)
        state.opens = state.opens + 1
        test.eq(id, target)
        test.eq(access, 2)
        test.eq(contract_id, "kickside.workflows:run_completion")
        if state.denied then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "target denied" }) end
        if state.unsupported then return nil, errors.new({ kind = errors.INVALID, message = "unsupported contract" }) end
        return { complete = function(_self: any, envelope: any): (any?, any?)
            test.eq(appender.physical[envelope.run_id], 1, "audit must commit before callback")
            state.callbacks[#state.callbacks + 1] = envelope
            if state.callback_error then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "callback unavailable" }) end
            if state.no_ack then return nil, nil end
            if not state.committed then state.committed = true; state.commits = state.commits + 1 end
            if state.crash_after_commit then
                state.crash_after_commit = false
                return nil, errors.new({ kind = errors.UNAVAILABLE, message = "commit before ack crash" })
            end
            return { acknowledged = true }, nil
        end }, nil
    end
    function selected_component.get_private_context(_id: string): (any?, any?)
        if state.lookup_error then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "lookup unavailable" }) end
        if not state.exists then return nil, errors.new({ kind = errors.NOT_FOUND, message = "deleted" }) end
        return {}, nil
    end
    sc.writable._component = selected_component
    sc.maintenance._component = selected_component
    -- The deterministic driver exercises publication with the same identity
    -- boundary as production; live authority is independently covered below.
    sc.maintenance._execution_identity = {
        from_row = function(_key: any, encoded: string) return json.decode(encoded) end,
        actor_key = function(principal: any) return principal.id end,
        run_as = function(identity: any, fn: string, args: any): (any?, any?)
            test.eq(identity.principal.id, sc.TEST_IDENTITY.principal.id)
            test.eq(fn, "kickside.workflows.runs:maintenance_complete")
            if not state.live then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "live authority revoked" }) end
            return sc.maintenance.complete(args)
        end,
    }
    local req = sc.build_request("automation-" .. uuid.v4(), uuid.v4(), uuid.v4())
    req.input = { board_id = uuid.v4(), item = uuid.v4(), visit = 1, attempt = 2, private = "secret" }
    req.config.completion = { component_id = target, token_fields = { "board_id", "item", "visit", "attempt" } }
    local function row(run_id: string): any
        return sc.query_row("SELECT * FROM workflow_runs WHERE run_id=$1", { run_id })
    end
    local function tick(run_id: string): any
        sc.force_due(req.automation_ref.id)
        local result, err = sc.maintenance.tick(1, run_id)
        test.is_nil(err)
        return result
    end
    return { sc = sc, req = req, state = state, engine = engine, calls = calls, faults = faults,
        target = target, row = row, tick = tick, appender = appender }
end

local cases = test.run_cases(function()
    test.describe("launch carried run completion", function()
        test.it("declares a typed complete callback and optional sink configuration", function()
            local entry = registry.get("kickside.workflows:run_completion")
            test.not_nil(entry)
            local data = entry.data or entry
            test.eq(data.methods[1].name, "complete")
            test.not_nil(data.methods[1].input_schemas)
            test.not_nil(data.methods[1].output_schemas)
            local sink = registry.get("kickside.workflows:run_sink")
            test.not_nil((sink.data or sink).config_schema.completion)
        end)
        for _, status in ipairs({ "completed", "failed", "cancelled", "terminated" }) do
            test.it("delivers authoritative " .. status .. " completion without publishing Start input", function()
                local f = fixture()
                local result = f.sc.writable.write(f.req)
                test.is_true(result.success)
                local id = result.dest_ref.run_id
                local before = f.row(id)
                local payload = json.decode(before.creation_payload_json)
                test.not_nil(payload.completion)
                test.eq(payload.completion.token.item, f.req.input.item)
                test.is_nil(payload.options.metadata.completion)
                f.req.input.item = uuid.v4()
                f.engine[before.dataflow_id].status = status
                f.engine[before.dataflow_id].error = string.rep("e", 5000)
                local tick = f.tick(id)
                test.eq(tick.failures, 0, tostring(tick.last_error))
                test.eq(#f.state.callbacks, 1)
                local envelope = f.state.callbacks[1]
                test.eq(envelope.status, status)
                test.eq(envelope.run_id, id)
                test.eq(envelope.dataflow_id, before.dataflow_id)
                test.eq(envelope.flow_ref.id, f.req.config.flow_ref.id)
                test.eq(envelope.flow_ref.version, 1)
                test.eq(envelope.token.item, payload.completion.token.item)
                test.is_nil(envelope.token.private)
                test.is_nil(envelope.input)
                test.not_nil(envelope.ended_at)
                if status ~= "completed" then test.is_true(#envelope.error.message <= 4096) end
                test.eq(tonumber(f.sc.pending_count(f.req.automation_ref.id)), 0)
            end)
        end
        test.it("bounds the encoded callback error even for escaped and multibyte messages", function()
            for _, message in ipairs({string.rep("e", 5000), string.rep("\\\"\n", 2000), string.rep("🌱", 2000)}) do
                local f = fixture()
                local result = f.sc.writable.write(f.req)
                local id = result.dest_ref.run_id
                local _, err = admission.merge(f.row(id), {status = "failed", error = message})
                test.is_nil(err)
                test.eq(f.tick(id).failures, 0)
                local encoded, encode_err = json.encode(f.state.callbacks[1].error)
                test.is_nil(encode_err)
                test.is_true(#encoded <= 4096, "encoded error bytes: " .. tostring(#encoded))
            end
        end)
        for _, message in ipairs({"é", "失败", "failure 🌱"}) do
            test.it("preserves complete UTF-8 error text: " .. message, function()
                local f = fixture()
                local result = f.sc.writable.write(f.req)
                local id = result.dest_ref.run_id
                local _, err = admission.merge(f.row(id), {status = "failed", error = message})
                test.is_nil(err)
                test.eq(f.tick(id).failures, 0)
                test.eq(f.state.callbacks[1].error.message, message)
            end)
        end
        test.it("trims only a multibyte sequence cut by the encoded error limit", function()
            local overhead = #json.encode({code = "failed", message = ""})
            for _, character in ipairs({"é", "败", "🌱"}) do
                for remaining = 1, #character do
                    local f = fixture()
                    local result = f.sc.writable.write(f.req)
                    local id = result.dest_ref.run_id
                    local prefix = "é" .. string.rep("x", 4096 - overhead - #"é" - remaining)
                    local _, err = admission.merge(f.row(id), {status = "failed", error = prefix .. character .. "x"})
                    test.is_nil(err)
                    test.eq(f.tick(id).failures, 0)
                    test.eq(f.state.callbacks[1].error.message,
                        prefix .. (remaining == #character and character or ""))
                end
            end
        end)
        test.it("an immediate start failure is completed by existing recovery", function()
            local f = fixture()
            f.sc.writable._client_new = function()
                local cli: any = {}
                function cli:get_status(id: string) return f.engine[id] and f.engine[id].status, nil end
                function cli:create_workflow(_commands: any, opts: any)
                    f.engine[opts.dataflow_id] = { status = "pending" }; return opts.dataflow_id, nil
                end
                function cli:start(id: string)
                    f.engine[id].status = "failed"; return nil, "immediate Flow failure"
                end
                function cli:execute() return nil, "unused" end
                function cli:output() return {}, nil end
                return cli, nil
            end
            local result = f.sc.writable.write(f.req)
            local row = f.sc.query_row("SELECT * FROM workflow_runs WHERE trigger_id=$1", { f.req.automation_ref.id })
            test.not_nil(row)
            f.tick(row.run_id)
            test.eq(#f.state.callbacks, 1)
            test.eq(f.state.callbacks[1].status, "failed")
            test.eq(f.sc.pending_count(f.req.automation_ref.id), 0)
        end)
        for _, fault in ipairs({ "crash_after_commit", "callback_error", "no_ack", "denied" }) do
            test.it("keeps publication pending after " .. fault .. " and recovers with one logical completion", function()
                local f = fixture()
                local result = f.sc.writable.write(f.req)
                local id = result.dest_ref.run_id
                f.sc.mark_terminal(f.engine, id)
                f.state[fault] = true
                local failed = f.tick(id)
                test.eq(failed.failures, 1)
                test.eq(f.sc.pending_count(f.req.automation_ref.id), 1)
                f.state[fault] = false
                local recovered = f.tick(id)
                test.eq(recovered.failures, 0, tostring(recovered.last_error))
                test.eq(f.sc.pending_count(f.req.automation_ref.id), 0)
                test.eq(f.state.commits, 1)
                test.eq(f.appender.physical[id], 1)
                local calls = #f.state.callbacks
                f.tick(id)
                test.eq(#f.state.callbacks, calls)
            end)
        end
        test.it("denies a revoked launch identity until live authority is repaired", function()
            local f = fixture()
            local result = f.sc.writable.write(f.req)
            local id = result.dest_ref.run_id
            f.sc.mark_terminal(f.engine, id)
            f.state.live = false
            test.eq(f.tick(id).failures, 1)
            test.eq(#f.state.callbacks, 0)
            test.eq(f.sc.pending_count(f.req.automation_ref.id), 1)
            f.state.live = true
            test.eq(f.tick(id).failures, 0)
            test.eq(#f.state.callbacks, 1)
        end)
        test.it("acknowledges proven target deletion but retains an uncertain target lookup", function()
            local f = fixture()
            local result = f.sc.writable.write(f.req)
            local id = result.dest_ref.run_id
            f.sc.mark_terminal(f.engine, id)
            f.state.lookup_error = true
            test.eq(f.tick(id).failures, 1)
            test.eq(f.sc.pending_count(f.req.automation_ref.id), 1)
            f.state.lookup_error, f.state.exists = false, false
            test.eq(f.tick(id).failures, 0)
            test.eq(#f.state.callbacks, 0)
            test.eq(f.sc.pending_count(f.req.automation_ref.id), 0)
        end)
        for _, denial in ipairs({ "denied", "unsupported" }) do
            test.it("refuses " .. denial .. " targets before reservation", function()
                local f = fixture()
                f.state[denial] = true
                local result = f.sc.writable.write(f.req)
                test.is_false(result.success)
                test.is_false(result.error.retriable)
                test.eq(f.calls.create, 0)
                test.is_nil(f.sc.query_row("SELECT run_id FROM workflow_runs WHERE trigger_id=$1", { f.req.automation_ref.id }))
            end)
        end
        test.it("includes the declaration in admission identity and preserves callers without completion", function()
            local f = fixture()
            local result = f.sc.writable.write(f.req)
            test.is_true(result.success)
            local again = f.sc.writable.write(f.req)
            test.eq(again.dest_ref.run_id, result.dest_ref.run_id)
            f.req.config.completion.token_fields = { "item" }
            local conflict = f.sc.writable.write(f.req)
            test.is_false(conflict.success)
            test.eq(conflict.error.code, "idempotency_conflict")
            local legacy = fixture()
            legacy.req.config.completion = nil
            local old = legacy.sc.writable.write(legacy.req)
            test.is_true(old.success)
            legacy.sc.mark_terminal(legacy.engine, old.dest_ref.run_id)
            test.eq(legacy.tick(old.dest_ref.run_id).failures, 0)
            test.eq(#legacy.state.callbacks, 0)
            test.eq(legacy.state.opens, 0)
        end)
        local many: any = {}
        for i = 1, 17 do many[i] = "f" .. tostring(i) end
        for index, invalid in ipairs({ false, {}, { component_id = "bad", token_fields = { "item" } },
            { component_id = false, token_fields = { "item" } }, { fields = { "item" } }, { url = "https://example.test" },
            { token_fields = {} }, { token_fields = many }, { token_fields = { "item", "item" } },
            { token_fields = { string.rep("x", 129) } }, { token_fields = { "" } },
            { token_fields = { [1] = "item", [3] = "visit" } }, { token_fields = { named = "item" } },
            { token_fields = "item" } }) do
            test.it("rejects invalid completion declaration " .. tostring(index), function()
                local f = fixture()
                if type(invalid) == "table" and invalid.component_id == nil then invalid.component_id = f.target end
                f.req.config.completion = invalid
                local result = f.sc.writable.write(f.req)
                test.is_false(result.success)
                test.eq(result.error.code, "invalid_config")
                test.eq(f.calls.create, 0)
            end)
        end
        for index, value in ipairs({ {}, { nested = true }, string.rep("x", 4097), math.huge, -math.huge, 0/0 }) do
            test.it("rejects invalid selected token value " .. tostring(index) .. " before reservation", function()
                local f = fixture()
                f.req.input.item = value
                local result = f.sc.writable.write(f.req)
                test.is_false(result.success)
                test.eq(result.error.code, "invalid_request")
                test.eq(f.calls.create, 0)
            end)
        end
        test.it("bounds the whole encoded token and requires every selected field", function()
            local f = fixture()
            f.req.input.board_id, f.req.input.item = string.rep("x", 2500), string.rep("y", 2500)
            local oversized = f.sc.writable.write(f.req)
            test.is_false(oversized.success)
            test.eq(oversized.error.code, "invalid_request")
            f.req.input.item = nil
            local missing = f.sc.writable.write(f.req)
            test.is_false(missing.success)
            test.eq(missing.error.code, "invalid_request")
        end)
    end)
end)
return { run = function(options: any): any return cases(options) end }
