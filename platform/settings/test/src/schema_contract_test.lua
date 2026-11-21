-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local contract = require("contract")
local security = require("security")
local sql = require("sql")
local store = require("store")
local json = require("json")
local writer = require("writer")

local NS = "kickside.settings.schema_fixture"

local function open_settings(): any
    local policy = assert(security.policy("app:settings_admin_policy"))
    local scope = assert(security.new_scope({ policy }))
    local actor = assert(security.new_actor("schema-fixture-admin", {}))
    local definition = assert(contract.get("kickside.settings:settings"))
    return assert(definition:with_actor(actor):with_scope(scope):open())
end

local function set(settings: any, key: string, value: any): any
    return settings:set({ namespace = NS, key = key, value = value })
end

local function stored(key: string): any
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT value, updated_by FROM kickside_settings WHERE namespace=$1 AND key=$2", { NS, key })
    db:release()
    test.is_nil(err, tostring(err))
    return rows[1]
end

local function listed(settings: any, key: string): any
    local result = settings:list({ namespace = NS })
    test.is_true(result.success, tostring(result.error))
    for _, row in ipairs(result.settings) do
        if row.key == key then return row end
    end
    error("schema fixture setting missing from listing")
end

local function seed_legacy_override(settings: any, key: string, raw: string): ()
    test.is_true(set(settings, key, key == "labels" and {"valid"} or {enabled = true}).success)
    local db = assert(sql.get("app:db"))
    local _, err = db:execute("UPDATE kickside_settings SET value=$1 WHERE namespace=$2 AND key=$3", {raw, NS, key})
    db:release()
    test.is_nil(err, tostring(err))
    assert(writer.reload())
end

return test.run_cases(function()
    test.describe("Settings declared JSON schemas", function()
        local settings: any = nil
        test.before_each(function()
            settings = open_settings()
        end)
        test.after_each(function()
            for _, key in ipairs({ "labels", "rules" }) do
                test.is_true(settings:unset({ namespace = NS, key = key }).success)
            end
        end)

        test.it("rejects invalid array items without writing or advancing the revision", function()
            test.is_true(set(settings, "labels", {"valid"}).success)
            local before = assert(stored("labels")).value
            local revision = assert(writer.stored_revision())
            for _, case in ipairs({
                { value = { { lane = "wrong type" } }, path = "/0" },
                { value = { "" }, path = "/0" },
                { value = { good = "not an array" }, path = "/: type" },
                { value = { "valid", json.null }, path = "/1" },
            }) do
                local rejected = set(settings, "labels", case.value)
                test.is_false(rejected.success)
                test.contains(rejected.error, case.path)
                test.eq(stored("labels").value, before)
                test.eq(writer.stored_revision(), revision)
            end
            test.eq(settings:get({ namespace = NS, key = "labels" }).value[1], "valid")
        end)

        test.it("rejects missing, invalid, and additional object properties before persistence", function()
            local revision = assert(writer.stored_revision())
            for _, value in ipairs({ { lanes = {} }, { enabled = "yes" }, { enabled = true, extra = 1 },
                    { enabled = false, lanes = { { name = "" } } }, { true } }) do
                local rejected = set(settings, "rules", value)
                test.is_false(rejected.success)
                test.not_nil(rejected.error)
                test.is_nil(stored("rules"))
                test.eq(writer.stored_revision(), revision)
            end
        end)

        test.it("stores valid containers and reads the same values back through a refreshed cache", function()
            local valid_rules = assert(json.decode('{"enabled":false,"lanes":[{"name":"main"}],"options":{}}'))
            local labels = set(settings, "labels", { "main", "return" })
            local rules = set(settings, "rules", valid_rules)
            test.is_true(labels.success, tostring(labels.error))
            test.is_true(rules.success, tostring(rules.error))
            test.eq(stored("rules").value, '{"enabled":false,"lanes":[{"name":"main"}],"options":{}}')
            assert(writer.reload())
            local namespace = settings:get_namespace({ namespace = NS })
            test.is_true(namespace.success, tostring(namespace.error))
            test.eq(namespace.values.labels[2], "return")
            test.eq(namespace.values.rules.enabled, false)
            test.eq(namespace.values.rules.lanes[1].name, "main")
            test.is_nil(listed(settings, "rules").error)
            test.is_true(set(settings, "labels", {}).success)
            test.eq(stored("labels").value, '[]')
        end)

        test.it("reports old schema-invalid values without dropping neighboring settings or their override data", function()
            seed_legacy_override(settings, "labels", '[{"lane":"legacy"}]')
            test.is_false(settings:get({ namespace = NS, key = "labels" }).success)
            local good = listed(settings, "rules")
            test.is_true(good.value.enabled)
            test.is_nil(good.error)

            seed_legacy_override(settings, "labels", '["legacy",null]')
            seed_legacy_override(settings, "rules", '{"enabled":"legacy"}')
            local revision = assert(writer.stored_revision())

            for _, key in ipairs({ "labels", "rules" }) do
                local read = settings:get({ namespace = NS, key = key })
                test.is_false(read.success)
                test.contains(read.error, key == "labels" and "/1" or "/enabled")
                local row = listed(settings, key)
                test.eq(row.error, read.error)
                test.is_nil(row.value)
                test.is_false(row.is_default)
                test.eq(row.updated_by, "schema-fixture-admin")
                test.not_nil(stored(key))
            end
            local namespace = settings:get_namespace({ namespace = NS })
            test.is_false(namespace.success)
            test.not_nil(namespace.error)
            test.eq(writer.stored_revision(), revision)

            test.is_true(set(settings, "labels", { "replacement" }).success)
            test.eq(listed(settings, "labels").value[1], "replacement")
            test.is_nil(listed(settings, "labels").error)
            test.is_true(settings:unset({ namespace = NS, key = "rules" }).success)
            local reset = listed(settings, "rules")
            test.is_true(reset.is_default)
            test.is_true(reset.value.enabled)
            test.is_nil(reset.error)
        end)

        test.it("warms from persisted JSON when an earlier snapshot omitted a trailing null", function()
            seed_legacy_override(settings, "labels", '["legacy",null]')
            local revision = assert(writer.stored_revision())
            local memory = assert(store.get("kickside.settings:cache"))
            local old_snapshot = assert(json.encode({ revision = revision, overrides = {
                [NS .. "\0labels"] = { value_type = "json", value = {"legacy"} },
            } }))
            assert(memory:set("snapshot", old_snapshot, 0))
            assert(memory:delete("snapshot-v2"))
            memory:release()

            local read = settings:get({ namespace = NS, key = "labels" })
            test.is_false(read.success)
            test.contains(read.error, "/1")
            test.eq(stored("labels").value, '["legacy",null]')
            test.eq(writer.stored_revision(), revision)
        end)
    end)
end)
