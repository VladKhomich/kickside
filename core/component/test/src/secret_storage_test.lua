-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local time = require("time")
local json = require("json")
local context_ops = require("context_ops")
local component = require("component")
local reader = require("reader")
local placement = require("placement")
local deletion = require("deletion")
local rollback = require("lifecycle_rollback")

local fields = require("secret_fields")
local SENTINEL = "component-storage-credential-sentinel"

return {run = test.run_cases(function()
    test.describe("separate component secret storage", function()
        test.it("upgrades rollback state without rewriting encrypted credentials", function()
            local db = assert(sql.get("app:db"))
            local id = uuid.v7()
            local timestamp = time.now():utc():format_rfc3339()
            test.is_nil(select(2, db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,position,created_at,updated_at,context_revision)
                VALUES ($1,'app:secret_kind','{}','n',$2,$2,0)]], {id, timestamp})))
            local tx = assert(db:begin())
            local written, write_err = context_ops.set_context(tx, {component_id = id,
                private_context = {api_key = SENTINEL, cursor = 5}})
            if write_err then tx:rollback() else tx:commit() end
            test.is_nil(write_err)
            test.is_true(written.changes_made)
            local before = assert(db:query("SELECT * FROM kickside_components WHERE component_id=$1", {id}))[1]
            local upgrade_tx = assert(db:begin())
            local upgraded, upgrade_err = rollback.upgrade_tx(upgrade_tx, id, function()
                return {{target = "example:cleanup", args = {}}}, true
            end)
            if upgrade_err then upgrade_tx:rollback() else upgrade_tx:commit() end
            test.is_nil(upgrade_err)
            test.is_true(upgraded.changes_made)
            local after = assert(db:query("SELECT * FROM kickside_components WHERE component_id=$1", {id}))[1]
            test.eq(after.encrypted_secrets, before.encrypted_secrets)
            test.eq(tonumber(after.secrets_generation), tonumber(before.secrets_generation))
            test.eq(tonumber(after.context_revision), assert(tonumber(before.context_revision)) + 1)
            test.is_nil((assert(json.encode(after)):find(SENTINEL, 1, true)))
            local context = assert(component.get_private_runtime_context(id))
            test.eq(context.api_key, SENTINEL)
            test.eq(context.cursor, 5)
            test.eq(context._rollback[1].target, "example:cleanup")
            local repeat_tx = assert(db:begin())
            local repeated, repeat_err = rollback.upgrade_tx(repeat_tx, id, function(chain) return chain, false end)
            if repeat_err then repeat_tx:rollback() else repeat_tx:commit() end
            test.is_nil(repeat_err)
            test.is_false(repeated.changes_made)
            local repeated_row = assert(db:query("SELECT context_revision FROM kickside_components WHERE component_id=$1", {id}))[1]
            test.eq(tonumber(repeated_row.context_revision), tonumber(after.context_revision))
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id})))
            test.is_nil(select(2, db:release()))
        end)
        test.it("rejects ciphertext from a deleted incarnation of the same component", function()
            local db = assert(sql.get("app:db"))
            local id, actor_id = uuid.v7(), uuid.v7()
            local old
            for _, credential in ipairs({"deleted-incarnation-secret", "current-incarnation-secret"}) do
                local tx = assert(db:begin())
                local result, create_err = placement.create_component(tx, db, {type = "CREATE_COMPONENT",
                    payload = {component_id = id, impl_id = "app:secret_kind", actor_id = actor_id,
                        private_context = {api_key = credential, cursor = 7}}})
                if create_err then tx:rollback() else tx:commit() end
                test.is_nil(create_err)
                test.is_true(result.changes_made)
                test.eq(assert(component.get_private_runtime_context(id)).api_key, credential)
                local row = assert(db:query("SELECT * FROM kickside_components WHERE component_id=$1", {id}))[1]
                test.eq(tonumber(row.secrets_generation), 1)
                if old == nil then
                    old = row
                    local delete_tx = assert(db:begin())
                    local deleted, delete_err = deletion.delete_component(delete_tx, db,
                        {type = "DELETE_COMPONENT", payload = {component_id = id}})
                    if delete_err then delete_tx:rollback() else delete_tx:commit() end
                    test.is_nil(delete_err)
                    test.is_true(deleted.deleted)
                else
                    test.is_nil(select(2, db:execute("UPDATE kickside_components SET encrypted_secrets=$1 WHERE component_id=$2", {old.encrypted_secrets, id})))
                    local value, read_err = component.get_private_runtime_context(id)
                    test.is_nil(value)
                    test.eq(read_err:details().code, "component_secrets_integrity")
                    local masked, masked_err = reader.new():with_components(id)
                        :include_options({private_context = true, meta = false}):one()
                    test.is_nil(masked)
                    test.eq(masked_err:details().code, "component_secrets_integrity")
                    local refused_tx = assert(db:begin())
                    local refused, write_err = context_ops.set_context(refused_tx,
                        {component_id = id, private_context = {api_key = "refused-replacement"}})
                    test.is_nil(select(2, refused_tx:rollback()))
                    test.is_nil(refused)
                    test.eq(write_err:details().code, "component_secrets_integrity")
                    test.is_nil(select(2, db:execute("UPDATE kickside_components SET encrypted_secrets=$1 WHERE component_id=$2", {row.encrypted_secrets, id})))
                    test.eq(assert(component.get_private_runtime_context(id)).api_key, credential)
                    test.not_nil(row.secrets_incarnation)
                    test.is_true(row.secrets_incarnation ~= old.secrets_incarnation)
                    local delete_tx = assert(db:begin())
                    local deleted, delete_err = deletion.delete_component(delete_tx, db,
                        {type = "DELETE_COMPONENT", payload = {component_id = id}})
                    if delete_err then delete_tx:rollback() else delete_tx:commit() end
                    test.is_nil(delete_err)
                    test.is_true(deleted.deleted)
                end
            end
            test.is_nil(select(2, db:release()))
        end)
        test.it("partitions credentials in the existing write and preserves revisions", function()
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            db = assert(db)
            local id = uuid.v7()
            local timestamp = time.now():utc():format_rfc3339()
            local _, seed_err = db:execute([[INSERT INTO kickside_components
                (component_id,impl_id,private_context,position,created_at,updated_at,context_revision)
                VALUES ($1,'app:secret_kind','{}','n',$2,$2,7)]], {id, timestamp})
            test.is_nil(seed_err)
            local tx, begin_err = db:begin()
            test.is_nil(begin_err)
            local result, write_err = context_ops.set_context(tx, {component_id = id,
                private_context = {api_key = SENTINEL, cursor = 9}})
            if write_err then tx:rollback() else tx:commit() end
            test.is_nil(write_err)
            test.is_true(result.changes_made)
            local rows, read_err = db:query("SELECT * FROM kickside_components WHERE component_id=$1", {id})
            test.is_nil(read_err)
            local visible, decode_err = json.decode(rows[1].private_context)
            test.is_nil(decode_err)
            test.is_nil((json.encode(rows[1]):find(SENTINEL, 1, true)))
            test.eq(visible.cursor, 9)
            test.eq(visible.api_key.set, true)
            test.eq(tonumber(rows[1].context_revision), 8)
            test.eq(type(rows[1].encrypted_secrets), "string")
            test.eq(rows[1].secrets_revision, assert(fields.revision({{path = {"api_key"}, type = "string"}})))
            local context, context_err = component.get_private_runtime_context(id)
            test.is_nil(context_err)
            test.eq(context.api_key, SENTINEL)
            test.eq(context.cursor, 9)
            local external, external_err = reader.new():with_components(id)
                :include_options({private_context = true, meta = false}):one()
            test.is_nil(external_err)
            test.eq(external.private_context.api_key.set, true)
            test.is_nil((json.encode(external):find(SENTINEL, 1, true)))
            local listed, list_err = component.list_system({component_ids = {id},
                include = {private_context = true, meta = false}})
            test.is_nil(list_err)
            test.eq(listed[1].private_context.api_key.set, true)
            test.is_nil((assert(json.encode(listed)):find(SENTINEL, 1, true)))
            local runtime_rows, runtime_err = component.list_runtime_context({component_ids = {id},
                include = {private_context = true, meta = false}})
            test.is_nil(runtime_err)
            test.eq(runtime_rows[1].private_context.api_key, SENTINEL)
            local after, after_err = component.list_system({component_ids = {id}, after_component_id = id,
                order_by = {field = "component_id", direction = "ASC"},
                include = {private_context = true, meta = false}})
            test.is_nil(after_err)
            test.eq(#after, 0)
            local runtime_after, runtime_after_err = component.list_runtime_context({component_ids = {id}, after_component_id = id,
                order_by = {field = "component_id", direction = "ASC"},
                include = {private_context = true, meta = false}})
            test.is_nil(runtime_after_err)
            test.eq(#runtime_after, 0)
            local instance, open_err = component.open_private(id)
            test.is_nil(open_err)
            local status, status_err = assert(instance):get_status({})
            test.is_nil(status_err)
            test.is_true(status.credential_present)
            local encrypted = rows[1].encrypted_secrets
            local patch_tx, patch_begin_err = db:begin()
            test.is_nil(patch_begin_err)
            local patched, patch_err = context_ops.patch_context(patch_tx, {component_id = id, patch = {cursor = 10}})
            if patch_err then patch_tx:rollback() else patch_tx:commit() end
            test.is_nil(patch_err)
            test.is_true(patched.changes_made)
            local after_patch, patch_read_err = db:query("SELECT encrypted_secrets,context_revision,secrets_revision FROM kickside_components WHERE component_id=$1", {id})
            test.is_nil(patch_read_err)
            test.eq(after_patch[1].encrypted_secrets, encrypted)
            test.eq(after_patch[1].secrets_revision, rows[1].secrets_revision)
            test.eq(tonumber(after_patch[1].context_revision), 9)
            local clear_tx, clear_begin_err = db:begin()
            test.is_nil(clear_begin_err)
            local cleared, clear_err = context_ops.patch_context(clear_tx, {component_id = id, patch = {}, delete_keys = {"api_key"}})
            if clear_err then clear_tx:rollback() else clear_tx:commit() end
            test.is_nil(clear_err)
            test.is_true(cleared.changes_made)
            local empty, empty_err = component.get_private_runtime_context(id)
            test.is_nil(empty_err)
            test.is_nil(empty.api_key)
            test.eq(empty.cursor, 10)
            local replace_tx = assert(db:begin())
            local replaced, replace_err = context_ops.patch_context(replace_tx, {component_id = id, patch = {},
                secret_changes = {{path = {"api_key"}, value = "replacement-secret-sentinel"}}})
            if replace_err then replace_tx:rollback() else replace_tx:commit() end
            test.is_nil(replace_err)
            test.is_true(replaced.changes_made)
            local replaced_context, replaced_read_err = component.get_private_runtime_context(id)
            test.is_nil(replaced_read_err)
            test.eq(replaced_context.api_key, "replacement-secret-sentinel")
            test.eq(replaced_context.cursor, 10)
            local rotated = assert(db:query("SELECT encrypted_secrets,secrets_generation,secrets_incarnation,context_revision FROM kickside_components WHERE component_id=$1", {id}))[1]
            test.eq(tonumber(rotated.secrets_generation), 3)
            test.eq(rotated.secrets_incarnation, rows[1].secrets_incarnation)
            test.is_nil(select(2, db:execute("UPDATE kickside_components SET encrypted_secrets=$1 WHERE component_id=$2", {encrypted, id})))
            local replayed, replay_err = component.get_private_runtime_context(id)
            test.is_nil(replayed)
            test.eq(replay_err:details().code, "component_secrets_integrity")
            local masked_replay, masked_err = reader.new():with_components(id)
                :include_options({private_context = true, meta = false}):one()
            test.is_nil(masked_replay)
            test.eq(masked_err:details().code, "component_secrets_integrity")
            local refused_tx = assert(db:begin())
            local refused, refused_err = context_ops.set_context(refused_tx,
                {component_id = id, private_context = {api_key = "cannot-overwrite-replay"}})
            test.is_nil(select(2, refused_tx:rollback()))
            test.is_nil(refused)
            test.eq(refused_err:details().code, "component_secrets_integrity")
            test.is_nil(select(2, db:execute("UPDATE kickside_components SET encrypted_secrets=$1 WHERE component_id=$2", {rotated.encrypted_secrets, id})))
            local recovered, recovered_err = component.get_private_runtime_context(id)
            test.is_nil(recovered_err)
            test.eq(recovered.api_key, "replacement-secret-sentinel")
            local _, remove_err = db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id})
            test.is_nil(remove_err)
            local _, release_err = db:release()
            test.is_nil(release_err)
        end)
    end)
end)}
