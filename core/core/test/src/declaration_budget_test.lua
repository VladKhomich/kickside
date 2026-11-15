-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local json = require("json")
local register = require("register")
local registry = require("registry")
local lifecycle = require("lifecycle")
local counter = require("counter")
local plan = require("plan")
local provision = require("provision")
return {run = test.run_cases(function()
    test.describe("declaration maintenance budget", function()
        local original: any = nil
        local owned: {string} = {}
        local population = false
        test.after_each(function()
            if #owned > 0 or population then
                local db = assert(sql.get("app:db"))
                local tx = assert(db:begin())
                local ids: {string} = {}
                for _, id in ipairs(owned) do
                    ids[#ids + 1] = "'" .. id .. "'"
                    ids[#ids + 1] = "'" .. require("lifecycle_log").thread_id(id) .. "'"
                end
                local threads = #ids > 0 and "id IN (" .. table.concat(ids, ",") .. ")" or "1=0"
                if population then threads = "(" .. threads .. " OR id IN (SELECT component_id FROM kickside_components WHERE impl_id='test.window.plan'))" end
                assert(tx:execute("DELETE FROM kickside_job WHERE id IN (SELECT job_id FROM kickside_projection_cursor WHERE thread_id IN (SELECT id FROM kickside_thread WHERE " .. threads .. "))"))
                assert(tx:execute("DELETE FROM kickside_thread WHERE " .. threads))
                local components = #owned > 0 and "component_id IN ('" .. table.concat(owned, "','") .. "')" or "1=0"
                if population then components = "(" .. components .. " OR impl_id='test.window.plan')" end
                assert(tx:execute("DELETE FROM kickside_component_meta WHERE component_id IN (SELECT component_id FROM kickside_components WHERE " .. components .. ")"))
                assert(tx:execute("DELETE FROM kickside_components WHERE " .. components))
                assert(tx:commit())
                assert(db:release())
                owned, population = {}, false
            end
            if original then assert(registry.apply_version(original)); original = nil end
        end)
        test.it("reads lifecycle declarations without revision checks or repeated hashing", function()
            original = assert(registry.current_version())
            local db = assert(sql.get("app:db"))
            local id = uuid.v7()
            owned[#owned + 1] = id
            local impl = "app:lifecycle_convergence_kind"
            assert(db:execute("INSERT INTO kickside_components(component_id,impl_id) VALUES ($1,$2)", {id,impl}))
            local function update()
                local tx = assert(db:begin())
                local result, err = lifecycle.updated({tx = tx, dbtype = assert(db:type()), component_id = id, impl_id = impl})
                if err then assert(tx:rollback()); assert(db:release()); error(err) end
                test.not_nil(result)
                assert(tx:commit())
            end
            update()
            local before = counter.calls
            update()
            test.eq(counter.calls, before, "unchanged lifecycle input reuses its prepared declaration")
            local binding = assert(registry.get(impl))
            binding.meta.projections[1].worker_config = {revision = 2}
            local changes = assert(registry.snapshot()):changes()
            changes:update({id = binding.id, kind = binding.kind, meta = binding.meta, data = binding.data})
            assert(changes:apply())
            update()
            test.eq(counter.calls, before + 1, "a new registry revision prepares exactly one new digest")
            local rows = assert(db:query("SELECT body,declaration_revision FROM kickside_projection WHERE kind='test.lifecycle.converge' AND thread_id=$1", {require("lifecycle_log").thread_id(id)}))
            test.eq(assert(json.decode(rows[1].body)).worker_config.revision, 2)
            test.eq(tonumber(rows[1].declaration_revision), 2)
            assert(db:release())
        end)
        test.it("reuses the stored digest for unchanged lifecycle registration", function()
            local db = assert(sql.get("app:db"))
            local id = uuid.v7()
            owned[#owned + 1] = id
            assert(db:execute("INSERT INTO kickside_thread(id,component_id,thread_class) VALUES ($1,$2,'digest')", {id,id}))
            local params = {kind = "digest", worker_ref = "func://app:test_count_worker", system_identity = true, ensure = true}
            assert(register.register_projection(db, id, params))
            local before = counter.calls
            assert(register.register_projection(db, id, params))
            test.eq(counter.calls, before, "an unchanged event performs no canonicalization or hashing")
            assert(db:release())
        end)
        test.it("seeks only divergent declaration rows in a healthy population", function()
            local db = assert(sql.get("app:db"))
            population = true
            local seed = uuid.v4()
            owned[#owned + 1] = seed
            assert(db:execute("INSERT INTO kickside_thread(id,component_id,thread_class) VALUES($1,$2,'plan')", {seed,seed}))
            local registered = assert(register.register_projection(db, seed, {kind = "plan", worker_ref = "func://app:test_count_worker", system_identity = true}))
            local template = assert(db:query("SELECT body,declaration_digest FROM kickside_projection WHERE id=$1", {registered.projection_id}))[1]
            local function q(value: string): string return "'" .. value:gsub("'", "''") .. "'" end
            for batch = 1, 40 do
                local components, threads, projections, cursors, meta = {}, {}, {}, {}, {}
                for index = 1, 250 do
                    local id, pid = uuid.v4(), uuid.v4()
                    components[index] = "(" .. q(id) .. ",'test.window.plan')"
                    threads[index] = "(" .. q(id) .. "," .. q(id) .. ",'plan')"
                    projections[index] = "(" .. q(pid) .. "," .. q(id) .. ",'plan'," .. q(template.body) .. "," .. q(template.declaration_digest) .. ")"
                    cursors[index] = "(" .. q(uuid.v4()) .. "," .. q(pid) .. "," .. q(id) .. "," .. q(registered.job_id) .. ")"
                    meta[#meta + 1] = "(" .. q(uuid.v4()) .. "," .. q(id) .. ",'type','thread')"
                    meta[#meta + 1] = "(" .. q(uuid.v4()) .. "," .. q(id) .. ",'thread_class','plan')"
                end
                local tx = assert(db:begin())
                assert(tx:execute("INSERT INTO kickside_components(component_id,impl_id) VALUES " .. table.concat(components, ",")))
                assert(tx:execute("INSERT INTO kickside_thread(id,component_id,thread_class) VALUES " .. table.concat(threads, ",")))
                assert(tx:execute("INSERT INTO kickside_projection(id,thread_id,kind,body,declaration_digest) VALUES " .. table.concat(projections, ",")))
                assert(tx:execute("INSERT INTO kickside_projection_cursor(id,projection_id,thread_id,job_id) VALUES " .. table.concat(cursors, ",")))
                assert(tx:execute("INSERT INTO kickside_component_meta(meta_id,component_id,key,value) VALUES " .. table.concat(meta, ",")))
                assert(tx:commit())
            end
            assert(db:execute("ANALYZE"))
            assert(db:release())
            local page = assert(provision.converge({}, {}))
            test.eq(page.checked, 0)
            test.is_nil(page.continuation, "unchanged population completes without visiting component windows")
            test.eq(plan.plans, 1)
        end)
        test.it("replaces the projection kind index with bounded digest range seeks", function()
            local db = assert(sql.get("app:db"))
            local dialect = assert(db:type())
            local prefix = dialect == "sqlite" and "EXPLAIN QUERY PLAN " or "EXPLAIN "
            for _, predicate in ipairs({"declaration_digest < 'middle'", "declaration_digest > 'middle'", "declaration_digest IS NULL"}) do
                local order = "declaration_digest,id"
                local plan = assert(db:query(prefix .. "SELECT id,thread_id,declaration_digest FROM kickside_projection "
                    .. "WHERE kind='plan' AND projection_key='default' AND " .. predicate .. " ORDER BY " .. order .. " LIMIT 256"))
                local encoded = assert(json.encode(plan))
                test.is_true(encoded:find("idx_projection_declaration_digest", 1, true) ~= nil, encoded)
                test.is_nil(encoded:find("Sort", 1, true), encoded)
                test.is_nil(encoded:find("TEMP B-TREE", 1, true), encoded)
            end
            local superseded = assert(db:query(dialect == "sqlite"
                and "SELECT name FROM sqlite_master WHERE type='index' AND name='idx_kickside_projection_kind'"
                or "SELECT indexname AS name FROM pg_indexes WHERE schemaname=current_schema() AND indexname='idx_kickside_projection_kind'"))
            test.eq(#superseded, 0, "the declaration index replaces its single-column kind prefix")
            assert(db:release())
        end)
    end)
end)}
