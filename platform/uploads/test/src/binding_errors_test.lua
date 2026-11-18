-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local contract = require("contract")
local security = require("security")
local sql = require("sql")
local uuid = require("uuid")
local fs = require("fs")
local records = require("records")
local provision = require("provision")
local types = require("types")
local artifacts = require("artifacts")
local artifact_parts = require("artifact_parts")

local owner, stranger, delete_owner, corrupt_owner, cleanup_owner
local owner_component, delete_component, corrupt_component, cleanup_component
local uploads = {}
local seeded = {}
local volume

local function actor(id)
    return assert(security.new_actor(id, {security_groups = {"app:uploads_test"}}))
end

local function scope(policy)
    local policies = {assert(security.policy("app:test_scope_policy"))}
    if policy then policies[#policies + 1] = assert(security.policy(policy)) end
    return assert(security.new_scope(policies))
end

local function open(definition, context, options)
    options = options or {}
    local def = assert(contract.get(definition)):with_scope(scope(options.policy))
        :with_context(context or {})
    def = def:with_actor(actor(options.actor or owner))
    local binding = definition == "wippy.session:file_provider" and "kickside.uploads:file_provider"
        or definition == "kickside.contract:deletable" and "kickside.uploads:uploads_component"
        or "kickside.uploads:content_provider"
    return def:open(binding)
end

local function check(err, kind, code)
    test.not_nil(err)
    test.is_true(errors.is(err, kind), tostring(err))
    if code then test.eq((err:details() or {}).code, code) end
end

local function invoke(method, context, options, args)
    local provider, err = open("kickside.contract:content_provider", context, options)
    if err then return nil, err end
    return provider[method](provider, args or {})
end

local function provision_owner(id)
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users
        (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$1,'test-only','active')]], {id, id .. "@uploads.test"}))
    for _, group in ipairs({"app:uploads_test", "wippy.security:process"}) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group}))
    end
    db:release()
    local result, err = provision.ensure_user(actor(id), security.named_scope("wippy.security:process"), id)
    test.is_nil(err, tostring(err))
    test.not_nil(result)
    return assert(types.component_id_for_owner(id))
end

local function seed(name, storage_id, upload_owner)
    local id = uuid.v4()
    local row, err = records.create(id, upload_owner or owner, 5, "text/plain", storage_id or "app:uploads",
        id, "kickside.uploads:types.generic", {filename = "notes.txt"}, "completed")
    test.is_nil(err, tostring(err))
    test.not_nil(row)
    uploads[name] = id
    seeded[#seeded + 1] = id
end

local function update(id, column, value)
    local db = assert(sql.get("app:db"))
    local _, err = db:execute("UPDATE kickside_uploads SET " .. column .. "=$1 WHERE uuid=$2", {value, id})
    db:release()
    test.is_nil(err, tostring(err))
end

return {run = test.run_cases(function()
    test.describe("published uploads contract errors", function()
        test.before_all(function()
            owner, stranger, delete_owner = uuid.v4(), uuid.v4(), uuid.v4()
            corrupt_owner, cleanup_owner = uuid.v4(), uuid.v4()
            owner_component = provision_owner(owner)
            delete_component = provision_owner(delete_owner)
            corrupt_component = provision_owner(corrupt_owner)
            cleanup_component = provision_owner(cleanup_owner)
            volume = assert(fs.get("app:uploads"))
            seed("normal")
            assert(volume:writefile(uploads.normal, "bytes"))
            seed("invalid_owner")
            update(uploads.invalid_owner, "actor_id", "")
            seed("missing_path")
            update(uploads.missing_path, "storage_path", "")
            seed("missing_file")
            seed("unavailable_storage", "app.upload_errors:unavailable_storage")
            seed("unreadable_storage", "app.upload_errors:unreadable_storage")
            seed("delete_failure", "app.upload_errors:unavailable_storage", delete_owner)
            update(uploads.delete_failure, "type_id", "")
            seed("corrupt_metadata", nil, corrupt_owner)
            update(uploads.corrupt_metadata, "metadata", "{")
            seed("legacy_storage", "app.upload_errors:legacy_storage")
            local db = assert(sql.get("app:db"))
            for _ = 1, 101 do
                assert(db:execute([[INSERT INTO kickside_upload_read_model
                    (upload_id,component_id,status) VALUES ($1,$2,'completed')]], {uuid.v4(), cleanup_component}))
            end
            db:release()
        end)
        test.after_all(function()
            if not volume then return end
            if uploads.normal then volume:remove(uploads.normal) end
            local db = assert(sql.get("app:db"))
            for _, id in ipairs(seeded) do
                local _, err = db:execute("DELETE FROM kickside_uploads WHERE uuid=$1", {id})
                test.is_nil(err, tostring(err))
            end
            db:release()
        end)
        for _, method in ipairs({"get_info", "get_content"}) do
            test.it(method .. " reports missing uploads", function()
                local value, err = invoke(method, {upload_id = uuid.v4()})
                test.is_nil(value)
                check(err, errors.NOT_FOUND, "upload_not_found")
                test.eq(err:message(), "Upload not found")
                test.is_false(err:retryable())
            end)
            test.it(method .. " refuses another owner's upload", function()
                local value, err = invoke(method, {upload_id = uploads.normal}, {actor = stranger})
                test.is_nil(value)
                check(err, errors.PERMISSION_DENIED)
                test.not_nil((err:details() or {}).code)
            end)
            for _, context in ipairs({{}, {upload_id = ""}, {upload_id = 123}}) do
                local name = context.upload_id == nil and "missing" or context.upload_id == "" and "empty" or "invalid"
                test.it(method .. " rejects " .. name .. " context", function()
                    local provider, open_err = open("kickside.contract:content_provider", context)
                    if open_err then check(open_err, errors.INVALID); return end
                    local value, err = provider[method](provider, {})
                    test.is_nil(value)
                    check(err, errors.INVALID, context.upload_id ~= nil and "upload_id_required" or nil)
                end)
            end
            test.it(method .. " reports invalid owner data", function()
                local value, err = invoke(method, {upload_id = uploads.invalid_owner})
                test.is_nil(value)
                check(err, errors.INTERNAL, "upload_owner_invalid")
                test.eq(err:message(), "Upload owner is invalid")
            end)
            test.it(method .. " preserves corrupt persisted metadata errors", function()
                local value, err = invoke(method, {upload_id = uploads.corrupt_metadata})
                test.is_nil(value)
                check(err, errors.INTERNAL, "persisted_data")
                test.is_false(err:retryable())
                test.eq(err:details().field, "kickside_uploads.metadata")
            end)
            test.it(method .. " preserves database acquisition refusals", function()
                local value, err = invoke(method, {upload_id = uploads.normal}, {policy = "app.upload_errors:deny_database"})
                test.is_nil(value)
                check(err, errors.PERMISSION_DENIED, "database_unavailable")
                test.eq(err:details().cause.kind, errors.PERMISSION_DENIED)
            end)
        end
        for _, method in ipairs({"list", "count"}) do
            test.it(method .. " preserves database acquisition refusals", function()
                local provider = assert(open("kickside.contract:resource_registry", {}, {policy = "app.upload_errors:deny_database"}))
                local value, err = provider[method](provider, {})
                test.is_nil(value)
                check(err, errors.PERMISSION_DENIED, "database_unavailable")
                test.eq(err:details().cause.kind, errors.PERMISSION_DENIED)
                test.is_true(err:message():find("Failed to " .. method .. " uploads: ", 1, true) == 1)
            end)
            test.it(method .. " excludes another owner's uploads", function()
                local provider = assert(open("kickside.contract:resource_registry", {}, {
                    actor = stranger, policy = "app.upload_errors:owner_only"}))
                local value, err = provider[method](provider, {})
                test.is_nil(err, tostring(err))
                if method == "list" then test.eq(#value.items, 0) else test.eq(value.total_count, 0) end
            end)
        end
        for _, limit in ipairs({0, 101, "bad", 1.5, false}) do
            test.it("list rejects limit " .. tostring(limit), function()
                local provider = assert(open("kickside.contract:resource_registry"))
                local value, err = provider:list({limit = limit})
                test.is_nil(value)
                check(err, errors.INVALID, "invalid_limit")
                test.eq(err:message(), "Limit must be between 1 and 100")
            end)
        end
        test.it("content reports missing original paths", function()
            local value, err = invoke("get_content", {upload_id = uploads.missing_path})
            test.is_nil(err, tostring(err))
            test.is_false(value.success)
            check(value.error, errors.INTERNAL, "upload_storage_path_missing")
            test.eq(value.error:message(), "Original upload storage path is missing")
        end)
        test.it("content reports missing original bytes", function()
            local value, err = invoke("get_content", {upload_id = uploads.missing_file})
            test.is_nil(err, tostring(err))
            test.is_false(value.success)
            check(value.error, errors.NOT_FOUND, "upload_content_read_failed")
            test.eq(value.error:message(), "Failed to read original upload content")
            test.eq(value.error:details().cause.kind, errors.NOT_FOUND)
        end)
        for _, row in ipairs({{"unavailable_storage", "acquire"}, {"unreadable_storage", "read"}}) do
            test.it("content preserves storage " .. row[2] .. " failures", function()
                local value, err = invoke("get_content", {upload_id = uploads[row[1]]})
                local failure = err or (value and value.error)
                check(failure, errors.UNAVAILABLE, "upload_test_storage_unavailable")
                test.is_true(failure:retryable())
                test.eq(failure:details().operation, row[2])
                test.eq(failure:details().cause.kind, errors.UNAVAILABLE)
                test.eq(failure:details().cause.details.code, "upload_test_storage_unavailable")
                if row[2] == "acquire" then
                    test.is_nil(value)
                    test.eq(failure:message(), "Failed to get upload storage: upload test storage unavailable")
                else
                    test.is_false(value.success)
                    test.eq(failure:message(), "Failed to read original upload content")
                end
            end)
        end
        test.it("content classifies legacy storage dependency errors", function()
            local value, err = invoke("get_content", {upload_id = uploads.legacy_storage})
            test.is_nil(value)
            check(err, errors.UNAVAILABLE, "storage_unavailable")
            test.is_true(err:retryable())
            test.eq(err:message(), "Failed to get upload storage: upload test legacy storage failure")
        end)
        test.it("list preserves corrupt persisted metadata errors", function()
            local provider = assert(open("kickside.contract:resource_registry", {}, {
                actor = corrupt_owner, policy = "app.upload_errors:owner_only"}))
            local value, err = provider:list({})
            test.is_nil(value)
            check(err, errors.INTERNAL, "persisted_data")
            test.is_false(err:retryable())
            test.eq(err:details().field, "kickside_uploads.metadata")
        end)
        test.it("content reports absent extracted artifacts", function()
            local value, err = invoke("get_content", {upload_id = uploads.normal}, nil, {extracted_only = true})
            test.is_nil(err, tostring(err))
            test.is_false(value.success)
            test.eq(value.state, "unreadable")
            check(value.error, errors.NOT_FOUND, "artifact_read_failed")
            test.eq(value.error:message(), "extracted text is not available: primary content artifact not found")
            test.is_nil(value.error:retryable())
            test.eq(value.error:details().cause.details.code, "primary_artifact_missing")
        end)
        test.it("keeps native database errors when artifact queries fail", function()
            local id = uploads.normal
            local db = assert(sql.get("app:db"))
            assert(db:execute("ALTER TABLE kickside_upload_artifact_blobs RENAME TO unavailable_artifact_blobs"))
            local _, native = db:query("SELECT blob_id FROM kickside_upload_artifact_blobs")
            local primary_ok, primary, primary_err = pcall(artifact_parts.read_primary_content, id)
            local blob_ok, blob, blob_err = pcall(artifacts.read_blob, id)
            local artifact_ok, artifact, artifact_err = pcall(artifacts.read_artifact_content, id, id)
            assert(db:execute("ALTER TABLE unavailable_artifact_blobs RENAME TO kickside_upload_artifact_blobs"))
            db:release()

            test.not_nil(native)
            test.is_true(primary_ok, tostring(primary))
            test.is_true(blob_ok, tostring(blob))
            test.is_true(artifact_ok, tostring(artifact))
            test.is_nil(primary)
            test.is_nil(blob)
            test.is_nil(artifact)
            for _, failure in ipairs({
                {operation = "primary", error = primary_err},
                {operation = "blob", error = blob_err},
                {operation = "artifact", error = artifact_err},
            }) do
                local err = failure.error
                test.eq(type(err), "userdata", failure.operation .. ": " .. tostring(err))
                check(err, native:kind())
                test.eq(err:retryable(), native:retryable())
                test.contains(tostring(err), "kickside_upload_artifact_blobs")
            end
        end)
        for _, backing in ipairs({"blob", "locator"}) do
            test.describe(backing .. " artifact reads", function()
                local id, artifact, path
                local bytes = "artifact bytes"

                local function set_location(storage_id, storage_path)
                    if artifact.blob_id then
                        local db = assert(sql.get("app:db"))
                        local _, err = db:execute([[UPDATE kickside_upload_artifact_blobs
                            SET storage_id=$1, storage_path=$2 WHERE blob_id=$3]],
                            {storage_id, storage_path, artifact.blob_id})
                        db:release()
                        test.is_nil(err, tostring(err))
                    else
                        update(id, "storage_id", storage_id)
                        update(id, "storage_path", storage_path)
                    end
                end

                test.before_each(function()
                    seed(backing .. " read")
                    id = uploads[backing .. " read"]
                    artifact = assert(artifacts.create_artifact({
                        upload_id = id, kind = "text", role = "primary", mime_type = "text/plain",
                        content = backing == "blob" and bytes or nil,
                        locator = {type = "upload.original"},
                    }))
                    if artifact.blob_id then
                        path = assert(artifacts.get_blob(artifact.blob_id)).storage_path
                    else
                        path = id
                        assert(volume:writefile(path, bytes))
                    end
                end)

                test.after_each(function()
                    local db = assert(sql.get("app:db"))
                    assert(db:execute("DELETE FROM kickside_upload_artifacts WHERE artifact_id=$1", {artifact.artifact_id}))
                    if artifact.blob_id then
                        assert(db:execute("DELETE FROM kickside_upload_artifact_blobs WHERE blob_id=$1", {artifact.blob_id}))
                    end
                    db:release()
                    assert(volume:remove(path))
                end)

                test.it("preserves the storage fault and reads the bytes after it clears", function()
                    set_location("app.upload_errors:unreadable_storage", path)
                    local content, err = artifacts.read_artifact_content(id, artifact.artifact_id)
                    set_location("app:uploads", path)
                    local recovered, recovery_err = artifacts.read_artifact_content(id, artifact.artifact_id)
                    test.is_nil(recovery_err, tostring(recovery_err))
                    test.eq(recovered, bytes)
                    test.is_nil(content)
                    check(err, errors.UNAVAILABLE)
                    test.is_true(err:retryable())
                    test.contains(tostring(err), "upload test storage read failed")
                end)

                test.it("preserves storage kinds independently of diagnostic text", function()
                    local function read_failure(storage_id, storage_path)
                        set_location(storage_id, storage_path)
                        local content, err = artifacts.read_artifact_content(id, artifact.artifact_id)
                        test.is_nil(content)
                        test.not_nil(err)
                        return err
                    end
                    local unavailable = read_failure("app.upload_errors:unreadable_storage", path)
                    local invalid = read_failure("app.upload_errors:invalid_storage", path)
                    local other = read_failure("app.upload_errors:unreadable_storage", path .. ".different")
                    test.eq(unavailable:message(), invalid:message())
                    test.is_true(unavailable:message() ~= other:message())
                    check(unavailable, errors.UNAVAILABLE, "upload_test_storage_unavailable")
                    check(other, errors.UNAVAILABLE, "upload_test_storage_unavailable")
                    check(invalid, errors.INVALID, "upload_test_storage_invalid")
                    test.is_true(unavailable:retryable())
                    test.is_true(other:retryable())
                    test.is_false(invalid:retryable())
                end)

                test.it("reports missing backing bytes as not found", function()
                    set_location("app:uploads", path .. ".missing")
                    local content, err = artifacts.read_artifact_content(id, artifact.artifact_id)
                    test.is_nil(content)
                    check(err, errors.NOT_FOUND)
                    test.is_false(err:retryable() == true)

                    local _, foreign = artifacts.read_artifact_content(uploads.normal, artifact.artifact_id)
                    local _, absent = artifacts.read_artifact_content(id, uuid.v4())
                    check(foreign, errors.NOT_FOUND, "artifact_reference_not_found")
                    check(absent, errors.NOT_FOUND, "artifact_reference_not_found")
                    test.is_true((err:details() or {}).code ~= "artifact_reference_not_found")
                end)

                test.it("reports malformed stored locations as invalid", function()
                    set_location("app:uploads", backing == "blob" and "fs://" or "")
                    local content, err = artifacts.read_artifact_content(id, artifact.artifact_id)
                    test.is_nil(content)
                    check(err, errors.INVALID)
                    if backing == "blob" then
                        test.is_false(err:retryable())
                    else
                        test.is_nil(err:retryable())
                    end
                end)

                for _, fixture in ipairs({
                    {name = "invalid storage path", kind = errors.INVALID, path = "fs://", retryable = false,
                        cause_code = "invalid_storage_path", diagnostic = "Packed storage path requires an entry id and path"},
                    {name = "missing backing bytes", kind = errors.NOT_FOUND, path = "private/missing.txt",
                        diagnostic = "private/missing.txt"},
                    {name = "unavailable storage", kind = errors.UNAVAILABLE, path = "private/unavailable.txt", retryable = true,
                        storage_id = "app.upload_errors:unreadable_storage", cause_code = "upload_test_storage_unavailable",
                        diagnostic = "private/unavailable.txt"},
                }) do
                    test.it("extracted-only content preserves the public error for " .. fixture.name, function()
                        set_location(fixture.storage_id or "app:uploads", fixture.path)
                        local value, err = invoke("get_content", {upload_id = id}, nil, {extracted_only = true})
                        test.is_nil(err, tostring(err))
                        test.is_false(value.success)
                        test.eq(value.state, "unreadable")
                        check(value.error, fixture.kind, "artifact_read_failed")
                        local target = backing == "blob" and "blob" or "bytes"
                        test.eq(value.error:message(), "extracted text is not available: failed to read artifact " .. target)
                        test.eq(value.error:retryable(), fixture.retryable)
                        local native = value.error:details().cause
                        test.eq(native.kind, fixture.kind)
                        test.eq(native.retryable, fixture.retryable)
                        if fixture.cause_code then test.eq(native.details.code, fixture.cause_code) end
                        test.contains(native.message, fixture.diagnostic)
                        test.is_nil(value.error:details().operation)
                    end)
                end
            end)
        end
        for _, fixture in ipairs({
            { name = "blob", content = "derived bytes", metadata = {size = 101, original_size = 102, file_size = 103} },
            { name = "empty blob", content = "", metadata = {size = 101} },
            { name = "blobless size", metadata = {size = 101} },
            { name = "blobless original_size", metadata = {original_size = 102} },
            { name = "blobless file_size", metadata = {file_size = 103} },
            { name = "blobless absent size", metadata = {} },
        }) do
            test.it("content metadata uses canonical fields for " .. fixture.name, function()
                seed(fixture.name)
                local id = uploads[fixture.name]
                assert(volume:writefile(id, "bytes"))
                update(id, "mime_type", "application/pdf")
                fixture.metadata.mime_type = "image/png"
                fixture.metadata.checksum = string.rep("0", 64)
                local artifact = assert(artifacts.create_artifact({
                    upload_id = id, kind = "text", role = "primary", mime_type = "text/plain",
                    content = fixture.content, locator = {type = "upload.original"},
                    metadata = fixture.metadata,
                }))
                local info, info_err = invoke("get_info", {upload_id = id})
                test.is_nil(info_err, tostring(info_err))
                test.eq(info.artifact_id, artifact.artifact_id)
                test.eq(info.content_type, artifact.mime_type)
                test.eq(info.checksum, artifact.checksum)
                if fixture.content ~= nil then
                    test.eq(info.size, #fixture.content)
                else
                    test.is_nil(info.size, "blobless artifacts have no recorded byte size")
                end
                for _, args in ipairs({{}, {extracted_only = true}}) do
                    local content, content_err = invoke("get_content", {upload_id = id}, nil, args)
                    test.is_nil(content_err, tostring(content_err))
                    test.is_true(content.success)
                    test.eq(content.content_type, artifact.mime_type)
                    if fixture.content ~= nil then
                        test.eq(content.content, fixture.content)
                    else
                        test.eq(content.content, "bytes")
                    end
                    if not args.extracted_only then test.eq(content.checksum, artifact.checksum) end
                end
                local blob
                if artifact.blob_id then blob = assert(artifacts.get_blob(artifact.blob_id)) end
                local db = assert(sql.get("app:db"))
                assert(db:execute("DELETE FROM kickside_upload_artifacts WHERE artifact_id=$1", {artifact.artifact_id}))
                if blob then
                    assert(db:execute("DELETE FROM kickside_upload_artifact_blobs WHERE blob_id=$1", {blob.blob_id}))
                end
                db:release()
                if blob then assert(volume:remove(blob.storage_path)) end
                assert(volume:remove(id))
            end)
        end
        test.it("session file provider keeps invalid and absent attachments optional", function()
            local provider = assert(open("wippy.session:file_provider"))
            for _, args in ipairs({{}, {file_uuid = ""}, {file_uuid = 123}, {file_uuid = uuid.v4()}}) do
                local value, err = provider:get_info(args)
                test.is_nil(value)
                test.is_nil(err, tostring(err))
            end
        end)
        test.it("session file provider resolves an existing upload", function()
            local provider = assert(open("wippy.session:file_provider"))
            local value, err = provider:get_info({file_uuid = uploads.normal})
            test.is_nil(err, tostring(err))
            test.eq(value.file_uuid, uploads.normal)
            test.eq(value.filename, "notes.txt")
        end)
        test.it("session file provider preserves corrupt persisted metadata errors", function()
            local provider = assert(open("wippy.session:file_provider"))
            local value, err = provider:get_info({file_uuid = uploads.corrupt_metadata})
            test.is_nil(value)
            check(err, errors.INTERNAL, "persisted_data")
            test.is_false(err:retryable())
            test.eq(err:details().field, "kickside_uploads.metadata")
        end)
        test.it("session file provider preserves database acquisition refusals", function()
            local provider = assert(open("wippy.session:file_provider", {}, {policy = "app.upload_errors:deny_database"}))
            local value, err = provider:get_info({file_uuid = uploads.normal})
            test.is_nil(value)
            check(err, errors.PERMISSION_DENIED, "database_unavailable")
            test.eq(err:details().cause.kind, errors.PERMISSION_DENIED)
        end)
        for _, context in ipairs({{}, {component_id = ""}, {component_id = 123}}) do
            local name = context.component_id == nil and "missing" or context.component_id == "" and "empty" or "invalid"
            test.it("delete rejects " .. name .. " context", function()
                local provider, open_err = open("kickside.contract:deletable", context)
                if open_err then check(open_err, errors.INVALID); return end
                local value, err = provider:delete({})
                if context.component_id == nil then
                    test.is_nil(value)
                    check(err, errors.INVALID)
                else
                    test.is_nil(err, tostring(err))
                    test.is_false(value.success)
                    check(value.error, errors.INVALID, "component_context_required")
                end
            end)
        end
        test.it("delete preserves component-owner dependency refusals", function()
            local provider = assert(open("kickside.contract:deletable", {component_id = owner_component}, {
                policy = "app.upload_errors:deny_database"}))
            local value, err = provider:delete({})
            test.is_nil(err, tostring(err))
            test.is_false(value.success)
            check(value.error, errors.PERMISSION_DENIED, "component_owner_failed")
            test.is_true(value.error:message():find("resolve actor: ", 1, true) == 1)
        end)
        test.it("delete preserves storage failures and retains the upload", function()
            local provider = assert(open("kickside.contract:deletable", {component_id = delete_component}))
            local value, err = provider:delete({})
            test.is_nil(err, tostring(err))
            test.is_false(value.success)
            test.eq(value.deleted, 0)
            check(value.error, errors.UNAVAILABLE, "upload_test_storage_unavailable")
            test.is_true(value.error:retryable())
            test.eq(value.error:details().operation, "acquire")
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT uuid FROM kickside_uploads WHERE uuid=$1", {uploads.delete_failure}))
            db:release()
            test.eq(#rows, 1)
        end)
        test.it("delete preserves errors from listing owner uploads", function()
            local provider = assert(open("kickside.contract:deletable", {component_id = corrupt_component}))
            local value, err = provider:delete({})
            test.is_nil(err, tostring(err))
            test.is_false(value.success)
            test.eq(value.deleted, 0)
            check(value.error, errors.INTERNAL, "persisted_data")
            test.is_false(value.error:retryable())
            test.eq(value.error:details().field, "kickside_uploads.metadata")
            test.is_true(value.error:message():find("list uploads: ", 1, true) == 1)
        end)
        test.it("delete retains read-model cleanup failures for retry", function()
            local provider = assert(open("kickside.contract:deletable", {component_id = cleanup_component}))
            local value, err = provider:delete({})
            test.is_nil(err, tostring(err))
            test.is_false(value.success)
            test.eq(value.deleted, 0)
            check(value.error, errors.CONFLICT, "read_model_cleanup_failed")
            test.is_true(value.error:retryable())
            test.eq(value.error:message(), "upload read-model cleanup needs another page")
            test.eq(value.error:details().cause.kind, errors.CONFLICT)
            local retried, retry_err = provider:delete({})
            test.is_nil(retry_err, tostring(retry_err))
            test.is_true(retried.success)
            test.eq(retried.read_rows_deleted, 1)
        end)
        test.it("delete is idempotent for an absent component owner", function()
            local provider = assert(open("kickside.contract:deletable", {component_id = uuid.v4()}))
            local value, err = provider:delete({})
            test.is_nil(err, tostring(err))
            test.is_true(value.success)
            test.eq(value.deleted, 0)
        end)
    end)
end)}
