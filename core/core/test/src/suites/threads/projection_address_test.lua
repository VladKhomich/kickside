local test = require("test")
local uuid = require("uuid")
local sql = require("sql")
local fixture = require("fixture")

return { run = test.run_cases(function()
    test.describe("Threads addressed projection read", function()
        local context = fixture.new()
        local owned, fillers = {}, {}
        test.after_all(function()
            for _, row in ipairs(fillers) do
                local _, err = context.as_owner("remove_projection", { thread_id = row.thread_id, projection_id = row.id })
                test.is_nil(err)
            end
            for _, id in ipairs(owned) do
                local _, err = context.as_owner("delete", { thread_id = id })
                test.is_nil(err)
            end
        end)
        local function thread(impl_id)
            local created, err = context.as_owner("create", { thread_class = "address_" .. context.suffix, impl_id = impl_id })
            test.is_nil(err)
            owned[#owned + 1] = created.thread_id
            return created.thread_id
        end
        local function register(id, key, cursor)
            local result, err = context.as_owner("register_projection", { thread_id = id, kind = "z.source",
                projection_key = key, cursor_key = cursor, worker_ref = "func://app:test_count_worker" })
            test.is_nil(err)
            return result
        end
        test.it("reads the full pair at its declared address beyond a listing page", function()
            local id = thread()
            local registered = register(id, "source", "ingest")
            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            for i = 1, 205 do
                local filler_id = uuid.v7()
                local _, err = sql.builder.insert("kickside_projection"):set_map({ id = filler_id,
                    thread_id = id, kind = string.format("a.filler.%04d", i), projection_key = "default",
                    body = "{}", state = "valid", last_event_seq = 0 }):run_with(db):exec()
                if err then db:release(); error(tostring(err)) end
                fillers[#fillers + 1] = { thread_id = id, id = filler_id }
            end
            db:release()
            local pair, err = context.as_owner("get_projection_cursor", {
                thread_id = id, kind = "z.source", projection_key = "source", cursor_key = "ingest" })
            test.is_nil(err)
            test.not_nil(pair)
            test.eq(pair.projection.id, registered.projection_id)
            test.eq(pair.cursor.projection_id, registered.projection_id)
            test.eq(pair.cursor.cursor_key, "ingest")
            test.eq(pair.cursor.status, "active")
            test.eq(tonumber(pair.cursor.last_seq), 0)
            test.not_nil(pair.cursor.job_id)
            test.is_nil(pair.projection.actor_context)
            test.is_nil(pair.cursor.actor_context)
        end)
        test.it("resolves default keys and keeps distinct projection keys separate", function()
            local id = thread()
            local default = register(id, nil, nil)
            register(id, "other", "other")
            local pair, err = context.as_owner("get_projection_cursor", { thread_id = id, kind = "z.source" })
            test.is_nil(err)
            test.eq(pair.projection.id, default.projection_id)
            test.eq(pair.cursor.cursor_key, "default")
        end)
        test.it("bounds optional pending work by cursor position and event type", function()
            local id = thread("kickside.test.threads:thread_kind")
            local registered = register(id, nil, nil)
            local params = { thread_id = id, kind = "z.source" }
            local trigger = { type = "kickside.test.threads:trigger", role = "user", body = {} }
            local other = { type = "kickside.test.threads:attested", role = "user", body = {} }
            local function append(events)
                local result, err = context.as_owner("append_events", { thread_id = id, events = events })
                test.is_nil(err)
                return result.max_seq
            end
            local function pending(count, truncated)
                local pair, err = context.as_owner("get_projection_cursor", params)
                test.is_nil(err)
                test.eq(pair.pending_events.count, count)
                test.eq(pair.pending_events.truncated, truncated)
                return pair.cursor.id
            end

            append({ trigger, other, trigger })
            local plain, plain_err = context.as_owner("get_projection_cursor", params)
            test.is_nil(plain_err)
            test.is_nil(plain.pending_events)
            params.pending_event_types = { trigger.type }
            local cursor_id = pending(2, false)
            local interleaved = {}
            for _ = 1, 512 do interleaved[#interleaved + 1] = other end
            append(interleaved)
            local head = append({ trigger })
            pending(2, true)

            local db, db_err = sql.get("app:db")
            test.is_nil(db_err)
            local _, advance_err = db:execute(
                "UPDATE kickside_projection_cursor SET last_seq=$1 WHERE id=$2 AND projection_id=$3",
                { head - 1, cursor_id, registered.projection_id })
            db:release()
            test.is_nil(advance_err)
            pending(1, false)
        end)
        test.it("returns typed absence for an absent thread or pair", function()
            for _, id in ipairs({ uuid.v7(), thread() }) do
                local pair, err = context.as_owner("get_projection_cursor", { thread_id = id, kind = "missing" })
                test.is_nil(pair)
                test.not_nil(err)
                test.eq(err:kind(), errors.NOT_FOUND)
            end
        end)
        test.it("checks READ access before disclosing the pair", function()
            local id = thread()
            register(id, nil, nil)
            local pair, err = context.run_as(context.stranger, "get_projection_cursor", {
                thread_id = id, kind = "z.source" })
            test.is_nil(pair)
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
        end)
        test.it("rejects incomplete addresses", function()
            for _, args in ipairs({ {}, { thread_id = uuid.v7() }, { thread_id = uuid.v7(), kind = " " } }) do
                local pair, err = context.as_owner("get_projection_cursor", args)
                test.is_nil(pair)
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
            end
        end)
    end)
end) }
