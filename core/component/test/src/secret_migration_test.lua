-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local json = require("json")
local time = require("time")
local migration = require("secrets_migration")
local component = require("component")
local funcs = require("funcs")
local security = require("security")
local context_ops = require("context_ops")
local reader = require("reader")
local fields = require("secret_fields")
local INCARNATION = "11111111-1111-4111-8111-111111111111"

return {run = test.run_cases(function()
    test.describe("existing component secrets migration", function()
        test.it("never parses up-to-date rows while draining an older declaration revision", function()
            local db = assert(sql.get("app:db"))
            local current, stale = uuid.v7(), uuid.v7()
            local revision = assert(fields.revision({{path = {"api_key"}, type = "string"}}))
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,encrypted_secrets,secrets_revision)
                VALUES ($1,'app:secret_kind',$2,'invalid-envelope',$3)]],
                {current, assert(json.encode({api_key = 42})), revision})))
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,secrets_revision)
                VALUES ($1,'app:secret_kind',$2,'older-declaration')]],
                {stale, assert(json.encode({api_key = "revision-conversion-secret"}))})))
            local report = assert(migration.run(2))
            test.eq(report.invalid, 0)
            test.eq(report.converted, 1)
            local row = assert(db:query("SELECT secrets_revision,private_context FROM kickside_components WHERE component_id=$1", {stale}))[1]
            test.eq(row.secrets_revision, revision)
            test.is_nil((assert(json.encode(row.private_context)):find("revision-conversion-secret", 1, true)))
            test.eq(assert(migration.run(2)).invalid, 0)
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id IN ($1,$2)", {current, stale})))
            test.is_nil(select(2, db:release()))
        end)
        test.it("advances bounded windows across malformed rows", function()
            local db = assert(sql.get("app:db"))
            local ids = {}
            for i = 1, 7 do
                local id = uuid.v7()
                ids[#ids + 1] = id
                local value = i < 7 and {api_key = 42} or {api_key = "bounded-valid-secret"}
                test.is_nil(select(2, db:execute("INSERT INTO kickside_components(component_id,impl_id,private_context) VALUES ($1,'app:secret_kind',$2)",
                    {id, assert(json.encode(value))})))
            end
            local invalid, converted = 0, 0
            for i = 1, 10 do
                local report = assert(migration.run(2))
                test.is_true(report.invalid + report.converted <= 2)
                invalid, converted = invalid + report.invalid, converted + report.converted
                if not report.needs_continue then break end
                test.is_true(i < 10)
            end
            test.eq(invalid, 6)
            test.eq(converted, 1)
            for _, id in ipairs(ids) do test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id}))) end
            test.is_nil(select(2, db:release()))
        end)
        test.it("finishes captured windows and serves other kinds while one kind keeps growing", function()
            local db = assert(sql.get("app:db"))
            local ids = {}
            local function seed(kind: string): string
                local id = uuid.v7()
                ids[#ids + 1] = id
                test.is_nil(select(2, db:execute("INSERT INTO kickside_components(component_id,impl_id,private_context) VALUES ($1,$2,$3)",
                    {id, kind, assert(json.encode({api_key = "fair-secret"}))})))
                return id
            end
            for _ = 1, 4 do seed("app:secret_kind") end
            local other = seed("app:evolving_secret_kind")
            local finished = false
            for _ = 1, 20 do
                seed("app:secret_kind")
                local report = assert(migration.run(1))
                local row = assert(db:query("SELECT encrypted_secrets FROM kickside_components WHERE component_id=$1", {other}))[1]
                if not report.needs_continue then
                    test.not_nil(row.encrypted_secrets)
                    finished = true
                    break
                end
            end
            test.is_true(finished)
            for _, id in ipairs(ids) do test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id}))) end
            test.is_nil(select(2, db:release()))
        end)
        test.it("migrates new secret declarations on previously encrypted rows without changing existing secrets", function()
            local db = assert(sql.get("app:db"))
            local bad, id = uuid.v7(), uuid.v7()
            local bad_context = assert(json.encode({api_key = {set = true}, auth = {password = "retained-legacy"}}))
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,encrypted_secrets,context_revision,secrets_incarnation)
                VALUES ($1,'app:evolving_secret_kind',$2,'invalid-envelope',7,$3)]], {bad, bad_context, INCARNATION})))
            local encrypted = assert(funcs.call("kickside.component.system:seal_secrets", id, {api_key = "original-secret", retired_token = "retained-encrypted-secret"}, {{path = {"api_key"}, type = "string"}, {path = {"retired_token"}, type = "string"}}, 0, INCARNATION))
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,encrypted_secrets,context_revision,secrets_incarnation)
                VALUES ($1,'app:evolving_secret_kind',$2,$3,7,$4)]], {id,
                assert(json.encode({api_key = {set = true}, retired_token = {set = true}, auth = {password = "newly-declared-secret", user = "kept"}})), encrypted, INCARNATION})))
            local malformed = {}
            for _, present in ipairs({true, false}) do
                local malformed_id = uuid.v7()
                local previous = assert(funcs.call("kickside.component.system:seal_secrets", malformed_id,
                    {api_key = "retained-secret"}, {{path = {"api_key"}, type = "string"}}, 0, INCARNATION))
                test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                    (component_id,impl_id,private_context,encrypted_secrets,secrets_incarnation)
                    VALUES ($1,'app:evolving_secret_kind',$2,$3,$4)]], {malformed_id,
                    assert(json.encode({api_key = {set = true}, auth = {password = {set = present}}})), previous, INCARNATION})))
                malformed[#malformed + 1] = {id = malformed_id, encrypted = previous, present = present}
            end
            local complete_id = uuid.v7()
            local complete_envelope = assert(funcs.call("kickside.component.system:seal_secrets", complete_id,
                {api_key = "unchanged-secret", auth = {password = "unchanged-password"}},
                {{path = {"api_key"}, type = "string"}, {path = {"auth", "password"}, type = "string"}}, 0, INCARNATION))
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,encrypted_secrets,secrets_incarnation)
                VALUES ($1,'app:evolving_secret_kind',$2,$3,$4)]], {complete_id,
                assert(json.encode({api_key = {set = true}, auth = {password = {set = true}}})), complete_envelope, INCARNATION})))
            local before, before_err = component.get_private_runtime_context(id)
            test.is_nil(before_err)
            test.eq(before.api_key, "original-secret")
            test.eq(before.auth.password, "newly-declared-secret")
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_component_access
                (access_id,component_id,source_component_id,subject_id,subject_type,access_mask)
                VALUES ($1,$2,$3,$4,'user',15)]], {uuid.v7(), id, id, assert(security.actor()):id()})))
            local external, external_err = funcs.call("kickside.component.binding:get_access_context_func",
                {component_id = id, include_context = true})
            test.is_nil(external_err)
            test.is_true(external.success, assert(json.encode(external)))
            local report, err = migration.run(5)
            test.is_nil(err)
            test.is_true(report.converted == 1, assert(json.encode(report)))
            test.eq(report.invalid, 3)
            test.eq(assert(db:query("SELECT encrypted_secrets FROM kickside_components WHERE component_id=$1", {complete_id}))[1].encrypted_secrets, complete_envelope)
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {complete_id})))
            for _, invalid in ipairs(malformed) do
                local retained = assert(db:query("SELECT private_context,encrypted_secrets FROM kickside_components WHERE component_id=$1", {invalid.id}))[1]
                test.eq(retained.encrypted_secrets, invalid.encrypted)
                test.eq(assert(json.decode(retained.private_context)).auth.password.set, invalid.present)
                test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {invalid.id})))
            end
            local invalid_row = assert(db:query("SELECT private_context,encrypted_secrets,context_revision,secrets_incarnation FROM kickside_components WHERE component_id=$1", {bad}))[1]
            test.eq(assert(json.decode(invalid_row.private_context)).auth.password, "retained-legacy")
            test.eq(invalid_row.encrypted_secrets, "invalid-envelope")
            test.eq(tonumber(invalid_row.context_revision), 7)
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {bad})))
            local row = assert(db:query("SELECT * FROM kickside_components WHERE component_id=$1", {id}))[1]
            test.is_nil((assert(json.encode(row)):find("newly-declared-secret", 1, true)))
            test.eq(tonumber(row.context_revision), 7)
            local after = assert(component.get_private_runtime_context(id))
            test.eq(after.api_key, "original-secret")
            test.eq(after.retired_token, "retained-encrypted-secret")
            test.eq(after.auth.password, "newly-declared-secret")
            test.eq(after.auth.user, "kept")
            test.eq(assert(migration.run(2)).converted, 0)
            local tx = assert(db:begin())
            local patched, patch_err = context_ops.patch_context(tx, {component_id = id, patch = {auth = {user = "changed"}}})
            if patch_err then tx:rollback() else tx:commit() end
            test.is_nil(patch_err)
            test.is_true(patched.changes_made)
            local context = assert(component.get_private_runtime_context(id))
            test.eq(context.auth.password, "newly-declared-secret")
            test.eq(context.auth.user, "changed")
            test.eq(context.retired_token, "retained-encrypted-secret")
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id})))
            test.is_nil(select(2, db:release()))
            test.eq(external.context.auth.password.set, true)
            test.is_nil((assert(json.encode(external)):find("newly-declared-secret", 1, true)))
        end)
        test.it("reports malformed legacy fields without changing the row or hiding the error", function()
            local db = assert(sql.get("app:db"))
            local id = uuid.v7()
            local raw = assert(json.encode({api_key = {set = false, unexpected = "malformed-credential-sentinel"}}))
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,context_revision)
                VALUES ($1,'app:secret_kind',$2,7)]], {id, raw})))
            local before = assert(db:query("SELECT private_context FROM kickside_components WHERE component_id=$1", {id}))[1].private_context
            local report, err = migration.run(2)
            test.is_nil(err)
            test.eq(report.converted, 0)
            test.eq(report.invalid, 1)
            test.is_false(report.needs_continue)
            local after = assert(db:query("SELECT private_context,encrypted_secrets,context_revision,secrets_incarnation FROM kickside_components WHERE component_id=$1", {id}))[1]
            test.eq(after.private_context, before)
            test.eq(tonumber(after.context_revision), 7)
            test.is_nil(after.secrets_incarnation)
            test.is_nil(after.encrypted_secrets)
            local value, read_err = component.get_private_runtime_context(id)
            test.is_nil(value)
            test.is_true(errors.is(read_err, errors.INVALID))
            test.is_nil((tostring(read_err):find("malformed-credential-sentinel", 1, true)))
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id})))
            test.is_nil(select(2, db:release()))
        end)
        test.it("migrates a JSON-null declared secret as absent", function()
            local db = assert(sql.get("app:db"))
            local id = uuid.v7()
            local raw = '{"api_key":null,"cursor":3}'
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,context_revision)
                VALUES ($1,'app:secret_kind',$2,7)]], {id, raw})))
            local report, err = migration.run(2)
            test.is_nil(err)
            test.eq(report.converted, 1)
            test.eq(report.invalid, 0)
            local row = assert(db:query("SELECT private_context,encrypted_secrets,context_revision,secrets_incarnation FROM kickside_components WHERE component_id=$1", {id}))[1]
            test.not_nil(row.encrypted_secrets)
            test.eq(tonumber(row.context_revision), 7)
            local visible = assert(json.decode(tostring(row.private_context)))
            test.eq(visible.api_key.set, false)
            test.eq(visible.cursor, 3)
            local value, read_err = component.get_private_runtime_context(id)
            test.is_nil(read_err)
            test.is_nil(value.api_key)
            test.eq(value.cursor, 3)
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id})))
            test.is_nil(select(2, db:release()))
        end)
        test.it("commits bounded rows, resumes and preserves context revisions and timestamps", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            db = assert(db)
            local ids: {string} = {}
            local timestamp = time.now():utc():format_rfc3339()
            for i = 1, 5 do
                local id = uuid.v7()
                ids[#ids + 1] = id
                local raw, encode_err = json.encode({api_key = "legacy-credential-" .. tostring(i), cursor = i})
                test.is_nil(encode_err)
                local _, insert_err = db:execute([[INSERT INTO kickside_components
                    (component_id,impl_id,private_context,created_at,updated_at,context_revision)
                    VALUES ($1,'app:secret_kind',$2,$3,$3,7)]], {id, raw, timestamp})
                test.is_nil(insert_err)
            end
            local first, first_err = migration.run(2)
            test.is_nil(first_err)
            test.eq(first.converted, 2)
            test.is_true(first.needs_continue)
            local second, second_err = migration.run(2)
            test.is_nil(second_err)
            test.eq(second.converted, 2)
            local last, last_err = migration.run(2)
            test.is_nil(last_err)
            test.eq(last.converted, 1)
            test.is_false(last.needs_continue)
            local incarnations = {}
            for _, id in ipairs(ids) do
                incarnations[id] = assert(db:query("SELECT secrets_incarnation FROM kickside_components WHERE component_id=$1", {id}))[1].secrets_incarnation
            end
            local again, again_err = migration.run(2)
            test.is_nil(again_err)
            test.eq(again.converted, 0)
            for i, id in ipairs(ids) do
                local rows, read_err = db:query("SELECT * FROM kickside_components WHERE component_id=$1", {id})
                test.is_nil(read_err)
                test.eq(tonumber(rows[1].secrets_generation), 1)
                local valid, validate_err = uuid.validate(rows[1].secrets_incarnation)
                test.is_nil(validate_err)
                test.is_true(valid)
                test.eq(rows[1].secrets_incarnation, incarnations[id])
                if i > 1 then test.is_true(rows[1].secrets_incarnation ~= incarnations[ids[i - 1]]) end
                test.eq(tonumber(rows[1].context_revision), 7)
                test.eq(rows[1].updated_at, timestamp)
                test.is_nil((json.encode(rows[1]):find("legacy-credential", 1, true)))
                local context, context_err = component.get_private_runtime_context(id)
                test.is_nil(context_err)
                test.eq(context.api_key, "legacy-credential-" .. tostring(i))
                test.eq(context.cursor, i)
                local _, delete_err = db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id})
                test.is_nil(delete_err)
            end
            local _, release_err = db:release()
            test.is_nil(release_err)
        end)
    end)
end)}
