-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local native = require("native")
local seed = require("prune_scaffold")
local time = require("time")

local M = { candidates = 0, candidate_rows = 0, hooks = 0, continuations = 0,
    before_candidate = nil, before_select = nil, continuation = nil }

function M.reset()
    native.reset("", nil)
    M.candidates, M.candidate_rows, M.hooks, M.continuations = 0, 0, 0, 0
    M.before_candidate, M.before_select, M.continuation = nil, nil, nil
    M.at, M.delay, M.event_deadline_queries = nil, nil, 0
    M.before_owner, M.before_commit, M.isolated_ids, M.receipt_sink = nil, nil, nil, nil
end

M.MILLISECOND, M.RFC3339, M.utc, M.parse = time.MILLISECOND, time.RFC3339, time.utc, time.parse

function M.now(): any return M.at or time.now() end

function M.timer(delay: string): any
    M.delay = tonumber(delay:match("^(%d+)ms$"))
    local response = {case_receive = function(self: any): table return {channel = self} end}
    return {response = function(): table return response end, stop = function() end}
end

function M.get(id: string): (any, error?)
    local db = seed.open_db()
    local function query(handle: any, statement: string, params: any): (any, error?)
        -- Count candidate pages and detect the old global event deadline query.
        if statement:find("AS pin_floor", 1, true) then
            M.event_deadline_queries = M.event_deadline_queries + 1
        end
        local candidate = statement:find("AS head_created_at", 1, true) ~= nil
        if candidate then
            M.candidates = M.candidates + 1
            if M.before_candidate then
                local err = M.before_candidate()
                if err then return nil, err end
            end
        end
        if candidate and M.isolated_ids then
            local schema = tostring(db:type()) == "postgres" and "public" or "main"
            local placeholders = {}
            params = params or {}
            for _, id in ipairs(M.isolated_ids) do
                params[#params + 1] = id
                placeholders[#placeholders + 1] = "$" .. tostring(#params)
            end
            -- SQLite binds numbered names in order of appearance.
            if schema == "main" then
                for index = #M.isolated_ids, 1, -1 do
                    table.insert(params, 1, table.remove(params, #params - #M.isolated_ids + index))
                end
            end
            statement = "WITH kickside_thread AS (SELECT * FROM " .. schema .. ".kickside_thread WHERE id IN ("
                .. table.concat(placeholders, ",") .. ")) " .. statement
        end
        if M.receipt_sink and statement:find("SELECT completed_at FROM kickside_write_receipt", 1, true) then
            statement = statement:gsub("WHERE status=", "WHERE sink_id=$1 AND status=", 1)
            params = { M.receipt_sink }
        end
        local rows, err = handle:query(statement, params)
        if candidate and rows then M.candidate_rows = M.candidate_rows + #rows end
        return rows, err
    end
    return {
        type = function(_: any): any return db:type() end,
        release = function(_: any): any return db:release() end,
        begin = function(_: any): (any, error?)
            local tx, err = db:begin()
            if err or not tx then return nil, err end
            return {
                db_type = function(_: any): any return tx:db_type() end,
                commit = function(_: any): (any, error?)
                    if M.before_commit then M.before_commit(tx) end
                    return tx:commit()
                end,
                rollback = function(_: any): (any, error?) return tx:rollback() end,
                query = function(_: any, statement: string, params: any): (any, error?) return query(tx, statement, params) end,
                execute = function(_: any, statement: string, params: any): (any, error?) return tx:execute(statement, params) end,
            }, nil
        end,
        query = function(_: any, statement: string, params: any): (any, error?) return query(db, statement, params) end,
    }, nil
end

function M.send(pid: string, topic: string, value: table): (boolean, error?)
    if topic == "kickside.core.retention.changed" and value.kind == "continue" then
        M.continuations = M.continuations + 1
        M.continuation = value
    end
    return true, nil
end

function M.select(cases: table): table
    if cases.default then return {default = true} end
    if M.before_select then
        local change = M.before_select(cases[5] and M.delay or nil)
        if change == "timer" then
            assert(cases[5], "no timer armed")
            return {channel = cases[5].channel, ok = true}
        end
        if change then return {channel = cases[3].channel, value = change, ok = true} end
    end
    return {channel = native.process_events, value = {kind = "cancel"}, ok = true}
end

return M
