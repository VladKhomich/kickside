-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local sql = require("sql")
local uuid = require("uuid")
local writer = require("writer")
local apply = require("apply")
local claim = require("claim")
local clock = require("clock")
local time = require("time")
local invoke = require("invoke")
local pin = require("pin")
local prune = require("prune")
local teardown = require("teardown")
local fence = require("fence")

local function query(db: sql.DB, statement: string, params: table): table
    local rows, err = db:query(statement, params)
    if err then error(tostring(err)) end
    return rows
end
local function execute(db: sql.DB, statement: string, params: table)
    local _, err = db:execute(statement, params)
    if err then error(tostring(err)) end
end
local function registration(db: sql.DB, thread: string): table
    local result, err = writer.register_projection(db, thread, {
        kind = "retained-input", worker_ref = "func://app:test_count_worker",
        worker_input_mode = "prefetch_events", system_identity = true,
    })
    if err then error(tostring(err)) end
    return result
end
local function fixture(): (string, table)
    local db = assert(sql.get("app:db"))
    local thread = uuid.v7()
    execute(db, "INSERT INTO kickside_thread (id,thread_class,component_id,event_count) VALUES ($1,'test','',3)", {thread})
    for seq = 1, 3 do
        execute(db, [[INSERT INTO kickside_event (id,thread_id,type,role,body,seq,created_at)
            VALUES ($1,$2,'test:event','user','{}',$3,'2000-01-01T00:00:00Z')]], { uuid.v7(), thread, seq })
    end
    local registered = registration(db, thread)
    execute(db, "UPDATE kickside_projection_cursor SET last_seq=1 WHERE id=$1", { registered.cursor_id })
    db:release()
    return thread, registered
end
local function claim_slot(db: sql.DB, job_id: string): table
    local dbtype = assert(db:type())
    local tx = assert(db:begin())
    local token = uuid.v7()
    local leased, err = claim.lease_row(tx, dbtype, job_id, token,
        clock.format(time.now():add("1m"), dbtype), clock.now(dbtype))
    if not leased then
        tx:rollback()
        error(err and tostring(err) or "projection slot is not pending")
    end
    assert(tx:commit())
    return {id = job_id, lease_token = token, execution_seq = leased.execution_seq, attempts = leased.attempts}
end

local function block(registered: table): table
    local db = assert(sql.get("app:db"))
    local job = claim_slot(db, registered.job_id)
    local snapshot = query(db, "SELECT * FROM kickside_projection_cursor WHERE id=$1", { registered.cursor_id })[1]
    db:release()
    local result, failure = apply.fail("app:db", job, snapshot,
        errors.new({kind = errors.INVALID, message = "invalid declaration", retryable = false}), true)
    test.is_nil(failure)
    test.is_true(result.invalid)
    return snapshot
end
local function sweep(db: sql.DB, thread: string): table
    local result, err = prune.prune_thread(db, thread, {cutoff = "2001-01-01T00:00:00Z"})
    if err then error(tostring(err)) end
    return result
end

return test.run_cases(function()
    test.describe("local projection pin paging", function()
        for _, population in ipairs({201, 1201}) do
            test.it("seeks bounded raw pin pages at " .. population .. " pins", function()
                local thread, registered = fixture()
                local db = assert(sql.get("app:db"))
                local tx = assert(db:begin())
                -- A tiny table can legitimately make a sequential scan cheaper.
                -- Qualify point lookups against background cursors without pins;
                -- those rows must not increase the fence's paging/lookup counts.
                for i = 1, 1000 do
                    execute(tx, [[INSERT INTO kickside_projection_cursor
                        (id,thread_id,projection_id,cursor_key,status) VALUES ($1,$2,$3,$4,'invalid')]],
                        {uuid.v7(), thread, registered.projection_id, "background:" .. tostring(i)})
                end
                for i = 1, population do
                    local cursor_id = uuid.v7()
                    execute(tx, [[INSERT INTO kickside_projection_cursor
                        (id,thread_id,projection_id,cursor_key,status) VALUES ($1,$2,$3,$4,'invalid')]],
                        {cursor_id, thread, registered.projection_id, tostring(i)})
                    execute(tx, [[INSERT INTO kickside_retention_pin
                        (thread_id,consumer_key,cursor_seq,generation) VALUES ($1,$2,0,1)]],
                        {thread, "projection:" .. cursor_id})
                end
                test.is_true(tx:commit())
                execute(db, "ANALYZE kickside_projection_cursor", {})
                test.is_nil(fence.mark(db, thread))
                local pages: integer = 0
                local examined: integer = 0
                local lookups: integer = 0
                local counted = {
                    type = function(self) return db:type() end,
                    execute = function(self, statement, args) return db:execute(statement, args) end,
                    query = function(self, statement, args)
                        local rows, err = db:query(statement, args)
                        if statement:find("SELECT consumer_key", 1, true) then
                            pages = pages + 1
                            test.is_nil((statement:find("NOT EXISTS", 1, true)))
                            test.is_true(#rows <= 101)
                            examined = examined + #rows
                        elseif statement:find("kickside_projection_cursor", 1, true) then
                            lookups = lookups + 1
                            test.is_true(#rows <= 1)
                            if lookups == 1 then
                                local explain = tostring(db:type()) == sql.type.SQLITE and "EXPLAIN QUERY PLAN " or "EXPLAIN ANALYZE "
                                local plan_rows, plan_err = db:query(explain .. statement, args)
                                test.is_nil(plan_err)
                                local parts = {}
                                for _, step in ipairs(plan_rows) do
                                    for _, value in pairs(step) do parts[#parts + 1] = tostring(value) end
                                end
                                local plan = table.concat(parts, " "):lower()
                                test.not_nil((plan:find("index", 1, true)), plan)
                                test.is_nil((plan:find("seq scan", 1, true)))
                                test.is_nil((plan:find("scan kickside_projection_cursor", 1, true)))
                            end
                        end
                        return rows, err
                    end,
                }
                for _ = 1, math.ceil(population / 100) do
                    local done, err = fence.fence_page(counted, thread)
                    if err then
                        test.is_true(err:details().needs_continue)
                    else test.is_true(done) end
                end
                test.eq(pages, math.ceil(population / 100))
                test.eq(lookups, population)
                test.eq(examined, population + pages - 1)
                local done = query(db, "SELECT teardown_fence_done AS done FROM kickside_thread WHERE id=$1", {thread})[1].done
                test.is_true(done == true or done == 1)
                local removed = false
                for _ = 1, population + 10 do
                    local result, err = teardown.purge_thread(db, thread)
                    if err then test.is_true(err:details().needs_continue)
                    else
                        test.is_true(result.purged)
                        removed = true
                        break
                    end
                end
                test.is_true(removed)
                db:release()
            end)
        end
    end)
    test.describe("blocked projection retention", function()
        local competing_owner: string? = nil
        test.after_each(function()
            if competing_owner then
                local db = assert(sql.get("app:db"))
                execute(db, "DELETE FROM kickside_job WHERE owner_kind='test' AND owner_id=$1", {competing_owner})
                db:release()
                competing_owner = nil
            end
        end)
        test.it("deletes a thread that owns an invalid projection retention pin", function()
            local thread, registered = fixture()
            competing_owner = thread
            local db = assert(sql.get("app:db"))
            -- Fill a batch of 16 with older eligible jobs ahead of the projection slot.
            for _ = 1, 16 do
                local id = uuid.v7()
                execute(db, [[INSERT INTO kickside_job (id,job_type,job_identity,owner_kind,owner_id,scheduled_at)
                    VALUES ($1,'kickside.core.projections:advance',$2,'test',$3,'2000-01-01 00:00:00')]], {id, id, thread})
            end
            db:release()
            block(registered)
            db = assert(sql.get("app:db"))
            local pending = query(db, [[SELECT COUNT(*) AS n FROM kickside_job
                WHERE owner_kind='test' AND owner_id=$1 AND status='pending' AND attempts=0 AND lease_token IS NULL]], {thread})
            local result, err = teardown.purge_thread(db, thread, nil)
            db:release()
            test.eq(tonumber(pending[1].n), 16)
            test.is_nil(err, tostring(err))
            test.is_true(result.purged)
        end)
        test.it("retains unread events through a deterministic block and releases protection on correction", function()
            local thread, registered = fixture()
            block(registered)
            local db = assert(sql.get("app:db"))
            local held, read_err = pin.read(db, thread, "projection:" .. registered.cursor_id)
            test.is_nil(read_err)
            test.not_nil(held)
            test.eq(tonumber(held.cursor_seq), 1)
            test.eq(sweep(db, thread).deleted, 1)
            test.eq(#query(db, "SELECT seq FROM kickside_event WHERE thread_id=$1", {thread}), 2)
            registration(db, thread)
            test.is_nil(select(1, pin.read(db, thread, "projection:" .. registered.cursor_id)))
            test.eq(sweep(db, thread).deleted, 0, "the corrected cursor protects the same input")
            local job = claim_slot(db, registered.job_id)
            db:release()
            local folded, fold_err = invoke.run({job = job, payload = {cursor_id = registered.cursor_id}})
            test.is_nil(fold_err)
            test.eq(folded.last_seq, 3)
            db = assert(sql.get("app:db"))
            test.eq(sweep(db, thread).deleted, 2)
            test.is_nil(select(2, writer.remove_projection(db, thread, {projection_id = registered.projection_id})))
            db:release()
        end)
        test.it("transfers protection to a paused cursor and can block again after resume", function()
            local thread, registered = fixture()
            block(registered)
            local db = assert(sql.get("app:db"))
            test.is_nil(select(2, writer.pause(db, thread, {cursor_id = registered.cursor_id})))
            test.is_nil(select(1, pin.read(db, thread, "projection:" .. registered.cursor_id)))
            test.eq(sweep(db, thread).deleted, 1)
            test.is_nil(select(2, writer.resume(db, thread, {cursor_id = registered.cursor_id})))
            db:release()
            block(registered)
            db = assert(sql.get("app:db"))
            local held, read_err = pin.read(db, thread, "projection:" .. registered.cursor_id)
            test.is_nil(read_err)
            test.not_nil(held)
            test.eq(tonumber(held.cursor_seq), 1)
            test.eq(sweep(db, thread).deleted, 0)
            test.is_nil(select(2, writer.remove_projection(db, thread, {projection_id = registered.projection_id})))
            db:release()
        end)
        test.it("leaves no pin when an old failure loses the cursor generation fence", function()
            local thread, registered = fixture()
            local snapshot = block(registered)
            local db = assert(sql.get("app:db"))
            registration(db, thread)
            db:release()
            local result, err = apply.fail("app:db", {id = registered.job_id}, snapshot,
                errors.new({kind = errors.INVALID, message = "old failure"}), true)
            test.is_nil(err)
            test.is_nil(result)
            db = assert(sql.get("app:db"))
            test.is_nil(select(1, pin.read(db, thread, "projection:" .. registered.cursor_id)))
            test.eq(sweep(db, thread).deleted, 1)
            test.is_nil(select(2, writer.remove_projection(db, thread, {projection_id = registered.projection_id})))
            db:release()
        end)
        test.it("releases the blocked pin when its projection is removed", function()
            local thread, registered = fixture()
            block(registered)
            local db = assert(sql.get("app:db"))
            test.eq(sweep(db, thread).deleted, 1)
            local removed, err = writer.remove_projection(db, thread, {projection_id = registered.projection_id})
            test.is_nil(err)
            test.eq(removed.removed_cursors, 1)
            test.is_nil(select(1, pin.read(db, thread, "projection:" .. registered.cursor_id)))
            test.eq(sweep(db, thread).deleted, 2)
            db:release()
        end)
    end)
end)
