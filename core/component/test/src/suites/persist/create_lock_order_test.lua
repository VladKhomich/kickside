-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A registration that repeats an existing child component id and a writer of
-- that child lock in one order: the child row, then its parent row. The writer
-- holds the child row and re-locks its parent through the parent_id foreign key
-- on its next update; the registration must resolve the existing id before it
-- locks the parent, so neither waits on the other in a cycle.
local sql = require("sql")
local test = require("test")
local uuid = require("uuid")
local time = require("time")
local ops = require("ops")
local placement_ops = require("placement_ops")

local OWNER = "create-lock-owner"

local function db(): any
    local d, e = sql.get("app:db")
    if e then error("db connect failed: " .. tostring(e)) end
    return d
end

local function create(tx: any, d: any, id: string, parent_id: string?): (any?, error?)
    return placement_ops.create_component(tx, d, {
        type = ops.COMMAND_TYPES.CREATE_COMPONENT,
        payload = { component_id = id, impl_id = "kickside.test:security", actor_id = OWNER, parent_id = parent_id },
    })
end

local function seed(id: string, parent_id: string?)
    local d = db()
    local tx = assert(d:begin())
    local _, err = create(tx, d, id, parent_id)
    if err then tx:rollback(); d:release(); error("seed failed: " .. tostring(err)) end
    assert(tx:commit())
    d:release()
end

local function lock_waiters(): integer
    local d = db()
    local rows, err = d:query(
        "SELECT count(*) AS n FROM pg_stat_activity WHERE datname = current_database() AND wait_event_type = 'Lock'")
    d:release()
    if err then error("lock probe failed: " .. tostring(err)) end
    return math.floor(tonumber(rows and rows[1] and (rows[1] :: any).n) or 0)
end

local function define_tests()
    test.describe("component registration lock order", function()
        test.it("resolves an existing child id before locking its parent while a writer holds the child", function()
            local parent_id, child_id = uuid.v7(), uuid.v7()
            seed(parent_id, nil)
            seed(child_id, parent_id)

            local d1 = db()
            local dialect = tostring(d1:type())
            local tx1 = assert(d1:begin())
            local lock_err = ops.lock_component_tx(tx1, child_id)
            if lock_err then tx1:rollback(); d1:release(); error("child lock failed: " .. tostring(lock_err)) end

            local registration: { done: boolean, err: any } = { done = false, err = nil }
            local done = channel.new(1)
            coroutine.spawn(function()
                local d2 = db()
                local tx2 = assert(d2:begin())
                local _, err = create(tx2, d2, child_id, parent_id)
                tx2:rollback()
                d2:release()
                registration.done = true
                registration.err = err
                done:send(true)
            end)

            -- On PostgreSQL the registration runs on its own pooled connection; let it
            -- reach either its result or a lock wait behind the child writer. SQLite
            -- serializes it behind the writer's transaction on its one connection.
            if dialect == sql.type.POSTGRES then
                for _ = 1, 500 do
                    if registration.done or lock_waiters() > 0 then break end
                    time.sleep("10ms")
                end
            end

            local _, _, meta_err = ops.set_public_meta(tx1 :: sql.Transaction, child_id, { title = "renamed" }, nil)
            if meta_err then tx1:rollback() else
                local _, commit_err = tx1:commit()
                meta_err = commit_err
            end
            d1:release()
            done:receive()

            test.is_nil(meta_err, tostring(meta_err))
            test.not_nil(registration.err)
            test.is_true(errors.is(registration.err, errors.CONFLICT), tostring(registration.err))
            test.eq(((registration.err :: any):details() or {}).code, "component_already_exists", tostring(registration.err))

            local d = db()
            local rows = assert(d:query("SELECT component_id, parent_id FROM kickside_components WHERE component_id = $1",
                { child_id }))
            local meta = assert(d:query("SELECT value FROM kickside_component_meta WHERE component_id = $1 AND key = 'title'",
                { child_id }))
            d:release()
            test.eq(#rows, 1)
            test.eq(rows[1].parent_id, parent_id)
            test.eq(meta[1] and meta[1].value, "renamed")
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
