-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local component = require("component")
local ops = require("ops")
local placement = require("placement")

return {run = test.run_cases(function()
    test.describe("Direct authorizer grant visibility", function()
        for _, commit in ipairs({false, true}) do
            test.it("retains ADMIN during unrelated component deletion and creation / commit=" .. tostring(commit), function()
                local root, removed, created, owner = uuid.v7(), uuid.v7(), uuid.v7(), uuid.v4()
                local db = assert(sql.get("app:db"))
                for _, id in ipairs({root, removed}) do
                    test.is_nil(select(2, db:execute("INSERT INTO kickside_components (component_id,impl_id,path,position) VALUES ($1,$2,$3,'n')",
                        {id, "app:placement_root", placement.build_path(db, id, nil)})))
                    test.is_nil(placement.link_node(db, id, nil))
                    test.not_nil((ops.dispatch(db, db, {type = "GRANT_ACCESS", payload = {component_id = id,
                        subject_type = "user", subject_id = owner, access_mask = 15}})))
                end
                db:release()
                local started, finish, done = channel.new(1), channel.new(1), channel.new(1)
                coroutine.spawn(function()
                    local writer = assert(sql.get("app:db"))
                    local tx = assert(writer:begin())
                    local ok, failure = pcall(function()
                        local deleted = assert(ops.dispatch(tx, writer, {type = "DELETE_COMPONENT", payload = {component_id = removed}}))
                        assert(deleted.deleted == true)
                        assert(ops.dispatch(tx, writer, {type = "CREATE_COMPONENT", payload = {component_id = created,
                            impl_id = "app:placement_root", actor_id = owner}}))
                        -- Read from inside the exact transaction that changes the
                        -- other components; no implementation visibility gate.
                        local allowed, err = ops.check_user_access(tx, owner, root, 8,
                            {{subject_type = "user", subject_id = owner}}, nil, true, true)
                        assert(not err, tostring(err)); assert(allowed == true)
                    end)
                    started:send(ok and "" or tostring(failure))
                    finish:receive()
                    local _, err
                    if ok and commit then _, err = tx:commit() else _, err = tx:rollback() end
                    writer:release()
                    done:send(err and tostring(err) or "")
                end)
                local writer_error = started:receive()
                db = assert(sql.get("app:db"))
                local postgres = tostring(db:type()) == sql.type.POSTGRES
                db:release()
                local allowed, access_err = true, nil
                -- PostgreSQL permits an independent read while the writer is
                -- held. SQLite serializes this pool's transactions, so its
                -- independent read follows the explicit commit/rollback below.
                if postgres and writer_error == "" then
                    allowed, access_err = component.validate_identity_authorizer_admin(root,
                        {kind = "user", id = owner}, {})
                end
                finish:send(true)
                test.eq(done:receive(), "")
                test.eq(writer_error, "")
                test.is_nil(access_err); test.is_true(allowed)
                for _, groups in ipairs({{}, {"unrelated-live-group"}}) do
                    local retained, retained_err = component.validate_identity_authorizer_admin(root,
                        {kind = "user", id = owner}, groups)
                    test.is_nil(retained_err); test.is_true(retained)
                end
                db = assert(sql.get("app:db"))
                local grants = assert(db:query("SELECT access_mask FROM kickside_component_access WHERE component_id=$1 AND subject_id=$2", {root, owner}))
                test.eq(#grants, 1); test.eq(tonumber(grants[1].access_mask), 15)
                for _, id in ipairs({root, removed, created}) do
                    test.is_nil(select(2, db:execute("DELETE FROM kickside_execution_identity_audit WHERE component_id=$1", {id})))
                    test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {id})))
                end
                db:release()
            end)
        end

        test.it("reads direct ADMIN independently of missing ancestry rows", function()
            local root, owner = uuid.v7(), uuid.v4()
            local db = assert(sql.get("app:db"))
            test.is_nil(select(2, db:execute("INSERT INTO kickside_components (component_id,impl_id,position) VALUES ($1,$2,'n')",
                {root, "app:placement_root"})))
            test.not_nil((ops.dispatch(db, db, {type = "GRANT_ACCESS", payload = {component_id = root,
                subject_type = "user", subject_id = owner, access_mask = 15}})))
            test.eq(#assert(db:query("SELECT component_id FROM kickside_component_ancestor WHERE component_id=$1", {root})), 0)
            db:release()
            local allowed, err = component.validate_identity_authorizer_admin(root, {kind = "user", id = owner}, {})
            db = assert(sql.get("app:db"))
            test.is_nil(select(2, db:execute("DELETE FROM kickside_components WHERE component_id=$1", {root})))
            db:release()
            test.is_nil(err); test.is_true(allowed)
        end)
    end)
end)}
