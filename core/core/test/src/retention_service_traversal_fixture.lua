-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local native = require("native")
local seed = require("prune_scaffold")

local M = { candidates = 0, candidate_rows = 0, hooks = 0, continuations = 0,
    before_candidate = nil, before_select = nil, continuation = nil }

function M.reset()
    native.reset("", nil)
    M.candidates, M.candidate_rows, M.hooks, M.continuations = 0, 0, 0, 0
    M.before_candidate, M.before_select, M.continuation = nil, nil, nil
end

function M.get(id: string): (any, error?)
    local db = seed.open_db()
    return {
        type = function(_: any): any return db:type() end,
        release = function(_: any): any return db:release() end,
        begin = function(_: any): any return db:begin() end,
        query = function(_: any, statement: string, params: any): (any, error?)
            -- Count candidate page SQL, excluding prune transactions and deadline reads.
            local candidate = statement:find("AS head_created_at", 1, true) ~= nil
            if candidate then
                M.candidates = M.candidates + 1
                if M.before_candidate then
                    local err = M.before_candidate()
                    if err then return nil, err end
                end
            end
            local rows, err = db:query(statement, params)
            if candidate and rows then M.candidate_rows = M.candidate_rows + #rows end
            return rows, err
        end,
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
        local change = M.before_select()
        if change then return {channel = cases[3].channel, value = change, ok = true} end
    end
    return {channel = native.process_events, value = {kind = "cancel"}, ok = true}
end

return M
