local test = require("test")
local funcs = require("funcs")
local security = require("security")
local sql = require("sql")
local uuid = require("uuid")
local artifact_content_repo = require("artifact_content_repo")
local upload_types = require("upload_types")
local contract = require("contract")
local fs = require("fs")
local json = require("json")
local execution_identity = require("execution_identity")
local fixture_cleanup = require("fixture_cleanup")
local fixtures: { string } = {}
local upload_fixtures: { string } = {}
local stored_upload_fixtures: { string } = {}

local DB = "app:db"
local CALLBACK = "kickside.knowledge.injection:on_upload_complete"
local EMBED_TOOL = "kickside.knowledge.traits:kb_embed_tool"

local function db()
    local d, err = sql.get(DB)
    if err then error("db connect failed: " .. tostring(err)) end
    return d
end

local function scope()
    local pol, err = security.policy("app:user")
    if not pol then error("test policy missing: " .. tostring(err)) end
    return security.new_scope({ pol })
end

local function insert_meta(d: any, component_id: string, key: string, value: string): ()
    local _, err = sql.builder.insert("kickside_component_meta")
        :set_map({
            meta_id = uuid.v7(),
            component_id = component_id,
            key = key,
            value = value,
            created_at = 0,
            updated_at = 0,
        })
        :run_with(d):exec()
    if err then error("meta insert failed: " .. tostring(err)) end
end

local function meta_value(d: any, component_id: string, key: string): any
    local rows, err = sql.builder.select("value")
        :from("kickside_component_meta")
        :where("component_id = ?", component_id)
        :where("key = ?", key)
        :run_with(d):query()
    if err then error("meta read failed: " .. tostring(err)) end
    return rows and rows[1] and rows[1].value or nil
end

local function seed_kb(component_id: string, owner: string, impl_id: string?): ()
    local d = db()
    local identity, identity_err = json.encode({
        [execution_identity.CONTEXT_KEY] = {
            version = execution_identity.VERSION,
            principal = { kind = "user", id = owner },
            authorized_by = { kind = "user", id = owner },
            captured_at = execution_identity.utc_now(),
        },
    })
    if identity_err then error(tostring(identity_err)) end
    local _, comp_err = sql.builder.insert("kickside_components")
        :set_map({
            component_id = component_id,
            impl_id = impl_id or "kickside.knowledge:knowledge_base",
            private_context = identity,
            created_at = 0,
            updated_at = 0,
        })
        :run_with(d):exec()
    if comp_err then
        d:release()
        error("component insert failed: " .. tostring(comp_err))
    end

    local _, access_err = sql.builder.insert("kickside_component_access")
        :set_map({
            access_id = uuid.v7(),
            subject_id = owner,
            subject_type = "user",
            component_id = component_id,
            source_component_id = component_id,
            access_mask = 15,
            inherited = 0,
            created_at = 0,
        })
        :run_with(d):exec()
    if access_err then
        d:release()
        error("access insert failed: " .. tostring(access_err))
    end

    insert_meta(d, component_id, "class", "knowledge_base")
    insert_meta(d, component_id, "status", "ready")
    insert_meta(d, component_id, "document_count", "2")
    insert_meta(d, component_id, "embedding_count", "92")
    insert_meta(d, component_id, "last_error", "")
    d:release()
end

local function cleanup(component_id: string): ()
    local d = db()
    sql.builder.delete("kickside_component_access"):where("component_id = ?", component_id):run_with(d):exec()
    sql.builder.delete("kickside_component_meta"):where("component_id = ?", component_id):run_with(d):exec()
    sql.builder.delete("kickside_components"):where("component_id = ?", component_id):run_with(d):exec()
    d:release()
end

local function cleanup_upload(upload_id: string): ()
    local d = db()
    sql.builder.delete("kickside_uploads"):where("uuid = ?", upload_id):run_with(d):exec()
    d:release()
end

local function seed_upload_without_primary(upload_id: string, owner: string, mime_type: string?, storage_path: string?): ()
    local uploads_component_id = upload_types.component_id_for_owner(owner)
    if not uploads_component_id then error("Upload owner component ID is required") end
    local registered, register_err = funcs.new():with_actor(security.new_actor(owner, {})):with_scope(scope())
        :call("kickside.component.binding:register_component_func", {
            component_id = uploads_component_id, impl_id = upload_types.IMPL,
        })
    test.is_nil(register_err, tostring(register_err))
    test.not_nil(registered)
    test.is_true(registered.success, tostring(registered.error))
    fixtures[#fixtures + 1] = uploads_component_id
    local d = db()
    local _, err = sql.builder.insert("kickside_uploads")
        :set_map({
            uuid = upload_id,
            actor_id = owner,
            size = 12,
            mime_type = mime_type or "application/octet-stream",
            storage_state = "uploaded",
            storage_id = "app:uploads",
            storage_path = storage_path or "missing-primary.bin",
            type_id = "binary",
            created_at = 0,
            updated_at = 0,
            metadata = "{}",
        })
        :run_with(d):exec()
    d:release()
    if err then error("upload insert failed: " .. tostring(err)) end
end

local function seed_upload_with_empty_primary(upload_id: string, owner: string): ()
    seed_upload_without_primary(upload_id, owner)
    local artifact, err = artifact_content_repo.create_artifact({
        upload_id = upload_id,
        kind = "markdown",
        role = "primary",
        mime_type = "text/markdown",
        label = "empty.md",
        ordinal = 1,
        content = "",
        storage_id = "app:uploads",
        metadata = { filename = "empty-primary.pdf" },
    })
    if err or not artifact then error("artifact insert failed: " .. tostring(err)) end
end

local function seed_upload_delivery(owner: string, storage_id: string, path: string?, original_only: boolean?): (string, string)
    local kb_id, upload_id = uuid.v7(), uuid.v7()
    fixtures[#fixtures + 1] = kb_id
    upload_fixtures[#upload_fixtures + 1] = upload_id
    seed_kb(kb_id, owner, "app:test_engine_files")
    local actor = security.new_actor(owner, {})
    local def = assert(contract.get("kickside.core:threads"))
    local threads = assert(def:with_actor(actor):with_scope(scope()):open())
    local _, ensure_err = threads:ensure_thread({ component_id = kb_id,
        impl_id = "app:test_engine_files", thread_class = "kickside.knowledge.injection" })
    test.is_nil(ensure_err, tostring(ensure_err))
    seed_upload_without_primary(upload_id, owner, "text/plain", path or upload_id)
    local d = db()
    local _, update_err = d:execute("UPDATE kickside_uploads SET storage_state=$1, storage_id=$2 WHERE uuid=$3",
        {"completed", storage_id, upload_id})
    d:release()
    test.is_nil(update_err, tostring(update_err))
    if original_only then return kb_id, upload_id end
    local _, artifact_err = artifact_content_repo.create_artifact({
        upload_id = upload_id, kind = "text", role = "primary", mime_type = "text/plain",
        locator = { type = "upload.original" }, metadata = { filename = "fixture.txt" },
    })
    test.is_nil(artifact_err, tostring(artifact_err))
    return kb_id, upload_id
end

local function define_tests()
    test.describe("Knowledge upload/meta boundary", function()
        test.after_each(function()
            for _, id in ipairs(stored_upload_fixtures) do assert(assert(fs.get("app:uploads")):remove(id)) end
            stored_upload_fixtures = {}
            for _, id in ipairs(upload_fixtures) do cleanup_upload(id) end
            upload_fixtures = {}
            for _, id in ipairs(fixtures) do fixture_cleanup.cleanup(id) end
            fixtures = {}
        end)

        for _, case in ipairs({
            { label = "temporary storage outage", storage = "app:temporarily_unavailable_upload_storage",
                kind = errors.UNAVAILABLE, sink_code = "provider_unavailable", retryable = true },
            { label = "missing stored bytes", storage = "app:uploads",
                kind = errors.NOT_FOUND, sink_code = "not_found", retryable = false },
        }) do
            test.it("keeps the upload sink outcome for " .. case.label, function()
                local owner = uuid.v4()
                local kb_id, upload_id = seed_upload_delivery(owner, case.storage)
                local actor = security.new_actor(owner, {})
                local provider = assert(assert(contract.get("kickside.contract:content_provider"))
                    :with_actor(actor):with_scope(scope()):with_context({ upload_id = upload_id })
                    :open("kickside.uploads:content_provider"))
                local _, provider_err = provider:get_content({})
                test.is_true(errors.is(provider_err, case.kind), tostring(provider_err))
                test.eq(provider_err:retryable() == true, case.retryable)

                local sink = assert(assert(contract.get("kickside.data:writable")):with_actor(actor):with_scope(scope())
                    :open("kickside.knowledge.sink:kb_upload_sink"))
                local request = { origin = "fixture", config = { kb_id = kb_id },
                    sink_op = "upsert", identity_key = "fixture-document", idempotency_key = "fixture-delivery",
                    resume_effect = false, input = { upload_id = upload_id } }
                local result, call_err = sink:write(request)
                test.is_nil(call_err, tostring(call_err))
                test.eq(result.success, false)
                test.eq(result.error.code, case.sink_code, result.error.message)
                test.eq(result.error.retriable, case.retryable)

                if case.retryable then
                    local storage = assert(fs.get("app:uploads"))
                    assert(storage:writefile(upload_id, "Fictional upload bytes"))
                    stored_upload_fixtures[#stored_upload_fixtures + 1] = upload_id
                    local d = db()
                    local _, restore_err = d:execute("UPDATE kickside_uploads SET storage_id=$1 WHERE uuid=$2",
                        {"app:uploads", upload_id})
                    d:release()
                    test.is_nil(restore_err, tostring(restore_err))

                    local recovered, recovery_err = sink:write(request)
                    test.is_nil(recovery_err, tostring(recovery_err))
                    test.eq(recovered.success, true, tostring(recovered.error and recovered.error.message))
                    test.eq(recovered.result, "created")
                    local replay, replay_err = sink:write(request)
                    test.is_nil(replay_err, tostring(replay_err))
                    test.eq(replay.result, "noop")
                    test.eq(replay.dest_ref.publication_id, recovered.dest_ref.publication_id)
                end
            end)

            test.it("keeps the upload callback outcome for " .. case.label, function()
                local owner = uuid.v4()
                local kb_id, upload_id = seed_upload_delivery(owner, case.storage)
                local actor = security.new_actor(owner, {})
                local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                    upload_id = upload_id, status = "completed", params = { kb_id = kb_id },
                })
                if case.retryable then
                    test.is_nil(result)
                    test.is_true(errors.is(call_err, errors.UNAVAILABLE), tostring(call_err))
                    test.is_true(call_err:retryable())
                    test.eq(call_err:details().code, "storage_unavailable")
                else
                    test.is_nil(call_err, tostring(call_err))
                    test.eq(result.success, true)
                    test.eq(result.skipped, true)
                    test.is_nil(result.cancelled)
                end
            end)

            test.it("keeps the EmbedToKB upload error for " .. case.label, function()
                local owner = uuid.v4()
                local kb_id, upload_id = seed_upload_delivery(owner, case.storage)
                local actor = security.new_actor(owner, {})
                local provider = assert(assert(contract.get("kickside.contract:content_provider"))
                    :with_actor(actor):with_scope(scope()):with_context({ upload_id = upload_id })
                    :open("kickside.uploads:content_provider"))
                local _, provider_err = provider:get_content({})
                test.is_true(errors.is(provider_err, case.kind), tostring(provider_err))

                local result, tool_err = funcs.new():with_actor(actor):with_scope(scope())
                    :with_context({ kb_ids = { kb_id } }):call(EMBED_TOOL, { upload_id = upload_id })
                test.is_nil(result)
                test.is_true(errors.is(tool_err, case.kind), tostring(tool_err))
                test.eq(tool_err:retryable() == true, case.retryable)
                test.eq(tool_err:message(), provider_err:message())
                test.eq(tool_err:details().code, provider_err:details().code)
            end)
        end

        test.it("returns the same EmbedToKB error for foreign and unknown upload IDs", function()
            local owner, foreign_owner = uuid.v4(), uuid.v4()
            local kb_id = seed_upload_delivery(owner, "app:uploads")
            local foreign_upload = uuid.v7()
            upload_fixtures[#upload_fixtures + 1] = foreign_upload
            seed_upload_without_primary(foreign_upload, foreign_owner, "text/plain")

            local exec = funcs.new():with_actor(security.new_actor(owner, {})):with_scope(scope())
                :with_context({ kb_ids = { kb_id } })
            local hidden, hidden_err = exec:call(EMBED_TOOL, { upload_id = foreign_upload })
            local unknown, unknown_err = exec:call(EMBED_TOOL, { upload_id = uuid.v7() })
            test.is_nil(hidden)
            test.is_nil(unknown)
            test.is_true(errors.is(hidden_err, errors.NOT_FOUND), tostring(hidden_err))
            test.is_true(errors.is(unknown_err, errors.NOT_FOUND), tostring(unknown_err))
            test.eq(hidden_err:message(), "upload not found")
            test.eq(hidden_err:message(), unknown_err:message())
            test.eq(hidden_err:retryable(), unknown_err:retryable())
            test.is_nil(next(hidden_err:details() or {}))
            test.is_nil(next(unknown_err:details() or {}))
        end)

        for _, mode in ipairs({"original", "primary"}) do
            test.it("keeps private storage locators out of " .. mode .. " EmbedToKB errors", function()
                local owner = uuid.v4()
                local marker = "private-locator-fixture-" .. uuid.v4()
                local kb_id, upload_id = seed_upload_delivery(owner, "app:uploads", marker .. "/file.txt", mode == "original")
                local exec = funcs.new():with_actor(security.new_actor(owner, {})):with_scope(scope())
                    :with_context({ kb_ids = { kb_id } })
                local result, err = exec:call(EMBED_TOOL, { upload_id = upload_id })
                test.is_nil(result)
                test.is_true(errors.is(err, errors.NOT_FOUND), tostring(err))
                test.is_false(err:retryable() == true)
                local serialized = assert(json.encode({
                    message = err:message(), kind = err:kind(), retryable = err:retryable(), details = err:details(),
                }))
                test.is_true(serialized:find(marker, 1, true) == nil, mode .. " read exposes a private storage locator")
                test.is_nil(err:details().cause)
                test.eq(err:details().code, mode == "original" and "upload_content_read_failed" or "artifact_read_failed")
            end)
        end

        test.it("queues a member's processed upload through EmbedToKB", function()
            local owner = uuid.v4()
            local kb_id, upload_id = seed_upload_delivery(owner, "app:uploads")
            local content = "Fictional member upload bytes"
            assert(assert(fs.get("app:uploads")):writefile(upload_id, content))
            stored_upload_fixtures[#stored_upload_fixtures + 1] = upload_id

            local result, tool_err = funcs.new():with_actor(security.new_actor(owner, {})):with_scope(scope())
                :with_context({ kb_ids = { kb_id } }):call(EMBED_TOOL, { upload_id = upload_id })
            test.is_nil(tool_err, tostring(tool_err))
            test.is_true(result.success)
            test.eq(result.status, "queued")
            test.eq(result.kb_id, kb_id)
            test.eq(result.upload_id, upload_id)

            local d = db()
            local events, read_err = d:query("SELECT body FROM kickside_event WHERE thread_id = $1 AND type = $2",
                { kb_id, "kickside.knowledge.events:content.upserted" })
            d:release()
            test.is_nil(read_err, tostring(read_err))
            test.eq(#events, 1)
            local body = assert(json.decode(events[1].body))
            test.eq(body.content, content)
            test.eq(body.source_ref.upload_id, upload_id)
        end)

        test.it("does not mutate KB public meta when an upload callback reports failure", function()
            local owner = uuid.v4()
            local component_id = uuid.v7()
            cleanup(component_id)
            seed_kb(component_id, owner)

            local actor = security.new_actor(owner, {})
            local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                upload_id = "missing-primary-" .. uuid.v4(),
                status = "error",
                error = "primary content artifact not found",
                params = { kb_id = component_id },
            })
            test.is_nil(call_err)
            test.not_nil(result)
            test.is_true(result.success == true)
            test.is_true(result.skipped == true)
            test.is_true(result.terminal_upload_error == true)

            local d = db()
            test.eq("ready", meta_value(d, component_id, "status"))
            test.eq("2", meta_value(d, component_id, "document_count"))
            test.eq("92", meta_value(d, component_id, "embedding_count"))
            test.eq("", meta_value(d, component_id, "last_error"))
            d:release()

            cleanup(component_id)
        end)

        test.it("acks terminal upload failures even when a response target is provided", function()
            local owner = uuid.v4()
            local component_id = uuid.v7()
            local topic = "kb.upload.failed." .. uuid.v4()
            cleanup(component_id)
            seed_kb(component_id, owner)

            local actor = security.new_actor(owner, {})
            local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                upload_id = "failed-upload-" .. uuid.v4(),
                status = "error",
                error = "converter crashed",
                params = { kb_id = component_id, respond_to = topic },
            })
            test.is_nil(call_err)
            test.not_nil(result)
            test.is_true(result.success == true)
            test.is_true(result.skipped == true)
            test.is_true(result.terminal_upload_error == true)
            test.eq("converter crashed", result.error)

            local d = db()
            test.eq("ready", meta_value(d, component_id, "status"))
            test.eq("2", meta_value(d, component_id, "document_count"))
            test.eq("92", meta_value(d, component_id, "embedding_count"))
            test.eq("", meta_value(d, component_id, "last_error"))
            d:release()

            cleanup(component_id)
        end)

        test.it("acks completed uploads with no primary content artifact without touching KB meta", function()
            local owner = uuid.v4()
            local component_id = uuid.v7()
            local upload_id = "no-primary-" .. uuid.v4()
            cleanup(component_id)
            cleanup_upload(upload_id)
            seed_kb(component_id, owner)
            seed_upload_without_primary(upload_id, owner)

            local storage = assert(fs.get("app:uploads"))
            local _, write_err = storage:writefile("missing-primary.bin", string.rep("\0", 12))
            test.is_nil(write_err, tostring(write_err))
            local actor = security.new_actor(owner, {})
            local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                upload_id = upload_id,
                status = "completed",
                mime_type = "application/octet-stream",
                size = 12,
                metadata = { filename = "missing-primary.bin" },
                params = { kb_id = component_id },
            })

            local _, remove_err = storage:remove("missing-primary.bin")
            test.is_nil(remove_err, tostring(remove_err))
            test.is_nil(call_err)
            test.not_nil(result)
            test.is_true(result.success == true)
            test.is_true(result.skipped == true)

            local d = db()
            test.eq("ready", meta_value(d, component_id, "status"))
            test.eq("2", meta_value(d, component_id, "document_count"))
            test.eq("92", meta_value(d, component_id, "embedding_count"))
            test.eq("", meta_value(d, component_id, "last_error"))
            d:release()

            cleanup_upload(upload_id)
            cleanup(component_id)
        end)

        test.it("acks completed uploads with empty primary content without touching KB meta", function()
            local owner = uuid.v4()
            local component_id = uuid.v7()
            local upload_id = "empty-primary-" .. uuid.v4()
            cleanup(component_id)
            cleanup_upload(upload_id)
            seed_kb(component_id, owner)
            seed_upload_with_empty_primary(upload_id, owner)

            local actor = security.new_actor(owner, {})
            local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                upload_id = upload_id,
                status = "completed",
                mime_type = "application/pdf",
                size = 12,
                metadata = { filename = "empty-primary.pdf" },
                params = { kb_id = component_id },
            })

            test.is_nil(call_err)
            test.not_nil(result)
            test.is_true(result.success == true)
            test.is_true(result.skipped == true)

            local d = db()
            test.eq("ready", meta_value(d, component_id, "status"))
            test.eq("2", meta_value(d, component_id, "document_count"))
            test.eq("92", meta_value(d, component_id, "embedding_count"))
            test.eq("", meta_value(d, component_id, "last_error"))
            d:release()

            cleanup_upload(upload_id)
            cleanup(component_id)
        end)

        test.it("rejects binary primary artifacts before document ingestion", function()
            local owner = uuid.v4()
            local component_id = uuid.v7()
            local upload_id = "binary-primary-" .. uuid.v4()
            seed_kb(component_id, owner)
            seed_upload_without_primary(upload_id, owner)
            local actor = security.new_actor(owner, {})
            local artifact, artifact_err = artifact_content_repo.create_artifact({
                upload_id = upload_id, kind = "markdown", role = "primary", mime_type = "image/png",
                label = "binary.png", ordinal = 1, content = "binary image bytes", storage_id = "app:uploads", metadata = {},
            })
            test.is_nil(artifact_err)
            test.not_nil(artifact)
            local refusal, probe_err = funcs.new():with_actor(actor):with_scope(scope()):call("app:ingest_upload_probe", {
                upload_id = upload_id, kb_id = component_id,
            })
            test.is_nil(probe_err)
            test.eq(refusal.invalid, true)
            test.contains(refusal.error, "no text was extracted")
            local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                upload_id = upload_id, status = "completed", params = { kb_id = component_id },
            })
            test.is_nil(call_err)
            test.eq(result.success, true)
            test.eq(result.skipped, true)
            local d = db()
            test.eq("2", meta_value(d, component_id, "document_count"))
            d:release()
            cleanup_upload(upload_id)
            cleanup(component_id)
        end)


        test.it("requires both an opted-in engine and an upload reference for textless appends", function()
            for _, entry in ipairs({
                { impl_id = "test.kb:embeddable", source_ref = { kind = "upload", upload_id = "file" } },
                { impl_id = "app:test_engine_files", source_ref = {} },
            }) do
                local owner, component_id = uuid.v4(), uuid.v7()
                fixtures[#fixtures + 1] = component_id
                seed_kb(component_id, owner, entry.impl_id)
                local result, err = funcs.new():with_actor(security.new_actor(owner, {})):with_scope(scope())
                    :call("app:thread_ingest_append_probe", { kb_id = component_id, content = "", source_ref = entry.source_ref })
                test.is_nil(result)
                test.contains(tostring(err), "content is required")
            end
        end)

        for _, case in ipairs({
            { name = "image", kind = "image", mime = "image/png", content = "binary image bytes" },
            { name = "archive", kind = "archive", mime = "application/zip", content = "archive bytes" },
            { name = "original image without extraction", mime = "image/png", content = "image bytes", original = true },
            { name = "original archive without extraction", mime = "application/zip", content = "archive bytes", original = true },
            { name = "empty original file", mime = "application/octet-stream", content = "", original = true },
            { name = "empty extraction", mime = "text/markdown", content = "" },
            { name = "extracted text", mime = "text/markdown", content = "# Extracted text", has_text = true },
        }) do
            test.it("admits " .. case.name .. " through the canonical upload event for a file engine", function()
                local owner = uuid.v4()
                local component_id, upload_id = uuid.v7(), uuid.v7()
                fixtures[#fixtures + 1] = component_id
                seed_kb(component_id, owner, "app:test_engine_files")
                local original_mime = case.original and case.mime or "application/octet-stream"
                seed_upload_without_primary(upload_id, owner, original_mime, upload_id)
                local artifact = nil
                if case.original then
                    local storage, storage_err = fs.get("app:uploads")
                    test.is_nil(storage_err)
                    local written, write_err = storage:writefile(upload_id, case.content)
                    test.is_nil(write_err)
                    test.is_true(written)
                else
                    local created, artifact_err = artifact_content_repo.create_artifact({
                        upload_id = upload_id, kind = case.kind or "markdown", role = "primary", mime_type = case.mime,
                        label = "attachment", ordinal = 1, content = case.content,
                        storage_id = "app:uploads", metadata = { filename = "attachment" },
                    })
                    test.is_nil(artifact_err)
                    test.not_nil(created)
                    artifact = created
                end
                local actor, actor_scope = security.new_actor(owner, {}), scope()
                local def, get_err = contract.get("kickside.core:threads")
                test.is_nil(get_err)
                local threads, open_err = def:with_actor(actor):with_scope(actor_scope):open()
                test.is_nil(open_err)
                local _, ensure_err = threads:ensure_thread({ component_id = component_id,
                    impl_id = "app:test_engine_files", thread_class = "kickside.knowledge.injection" })
                test.is_nil(ensure_err)

                local admission, admission_err = funcs.new():with_actor(actor):with_scope(actor_scope):call("app:ingest_upload_probe", {
                    upload_id = upload_id, kb_id = component_id,
                    file = { mime_type = original_mime, size = 12, metadata = { filename = "attachment", relative_path = "records/attachment" } },
                })
                test.is_nil(admission_err)
                test.not_nil(admission.result, admission.error)
                local result, call_err = funcs.new():with_actor(actor):with_scope(actor_scope):call(CALLBACK, {
                    upload_id = upload_id, status = "completed", mime_type = original_mime,
                    size = 12, metadata = { filename = "attachment", relative_path = "records/attachment" }, params = { kb_id = component_id },
                })
                test.is_nil(call_err)
                test.eq(result.success, true)
                test.is_nil(result.skipped)
                test.eq(result.external_id, "upload:" .. upload_id)
                local page, pull_err = funcs.new():with_actor(actor):with_scope(actor_scope)
                    :call("kickside.core.threads:events_pullable", {
                        config = { thread_id = component_id, event_type = "kickside.knowledge.events:content.upserted" },
                        cursor = 0, limit = 10, idempotency_key = "file-admission",
                    })
                test.is_nil(pull_err)
                test.eq(#page.items, 1)
                local body = page.items[1].payload
                if case.has_text then
                    test.eq(body.content, case.content)
                    test.is_nil(body.has_text)
                else
                    test.is_nil(body.content)
                    test.eq(body.has_text, false)
                    test.is_nil(body.content_omitted)
                    test.contains(body.source_ref.external_version, "file:")
                    test.eq(body.metadata.content_hash, artifact and artifact.checksum or nil)
                end
                test.eq(body.content_type, case.mime)
                test.eq(body.source_ref.kind, "upload")
                test.eq(body.source_ref.upload_id, upload_id)
                test.eq(body.source_ref.artifact_id, artifact and artifact.artifact_id or nil)
                test.eq(body.metadata.filename, "attachment")
                test.eq(body.metadata.original_mime_type, original_mime)
                test.eq(body.metadata.original_size, 12)
                test.eq(body.metadata.relative_path, "records/attachment")
                test.is_nil(body.metadata.storage_path)
                test.is_nil(body.source_ref.storage_id)
                if case.original then
                    local storage, storage_err = fs.get("app:uploads")
                    test.is_nil(storage_err)
                    local removed, remove_err = storage:remove(upload_id)
                    test.is_nil(remove_err)
                    test.is_true(removed)
                end
                cleanup_upload(upload_id)
            end)
        end

        test.it("treats upload callbacks for a deleted KB as a handled cancellation", function()
            local owner = uuid.v4()
            local deleted_kb = uuid.v7()

            local actor = security.new_actor(owner, {})
            local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                upload_id = "stale-upload-" .. uuid.v4(),
                status = "completed",
                mime_type = "text/plain",
                size = 12,
                metadata = { filename = "stale.txt" },
                params = { kb_id = deleted_kb },
            })

            test.is_nil(call_err)
            test.not_nil(result)
            test.is_true(result.success == true)
            test.is_true(result.cancelled == true)
            test.eq(deleted_kb, result.kb_id)
        end)

        test.it("returns a component database read failure without cancelling the callback", function()
            local owner = uuid.v4()
            local kb_id, upload_id = seed_upload_delivery(owner, "app:uploads")
            local restricted = security.new_scope({assert(security.policy("app:user")),
                assert(security.policy("app:deny_upload_callback_database"))})
            local result, call_err = funcs.new():with_actor(security.new_actor(owner, {})):with_scope(restricted)
                :call(CALLBACK, { upload_id = upload_id, status = "completed", params = { kb_id = kb_id } })
            test.is_nil(result)
            test.is_true(errors.is(call_err, errors.PERMISSION_DENIED), tostring(call_err))
        end)

        test.it("keeps the callback's READ requirement for a WRITE-only actor", function()
            local owner = uuid.v4()
            local kb_id, upload_id = seed_upload_delivery(owner, "app:uploads")
            local d = db()
            local _, update_err = d:execute([[UPDATE kickside_component_access SET access_mask=$1
                WHERE subject_id=$2 AND component_id=$3]], {2, owner, kb_id})
            d:release()
            test.is_nil(update_err, tostring(update_err))

            local actor = security.new_actor(owner, {})
            local service = assert(assert(contract.get("kickside.component:component_service"))
                :with_actor(actor):with_scope(scope()):open())
            local writable, write_err = service:get_access_context({ component_id = kb_id, access_mask = 2 })
            test.is_nil(write_err, tostring(write_err))
            test.eq(writable.success, true)
            local readable, read_err = service:get({ component_id = kb_id })
            test.is_nil(read_err, tostring(read_err))
            test.eq(readable.success, false)
            test.eq(readable.kind, errors.PERMISSION_DENIED)

            local result, call_err = funcs.new():with_actor(actor):with_scope(scope()):call(CALLBACK, {
                upload_id = upload_id, status = "completed", params = { kb_id = kb_id },
            })
            test.is_nil(call_err, tostring(call_err))
            test.eq(result.cancelled, true)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)

return { run = function(options) return run_cases(options) end }
