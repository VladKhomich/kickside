-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply = require("apply")

return {run = function(input)
    local assignment = input.checkpoint
    local cursor = assignment.cursor
    local manifest = {}
    for _, event in ipairs(input.events) do
        assert(event.type == "kickside.test.threads:trigger")
        manifest[#manifest + 1] = {id = event.id, seq = event.seq}
    end
    local body = cursor.body
    local output = {last_seq = input.range.to_seq, patch = {
        publications = (body.publications or 0) + 1, offered = #manifest,
        reset_generation = cursor.reset_generation}}
    local function commit(items, write)
        return apply.checkpoint("app:db", assignment.job, cursor, assignment.prefetched_last, output, write, items)
    end
    if #manifest > 1 then
        local called = false
        local incomplete, err = commit({manifest[1]}, function() called = true; return true end)
        assert(not incomplete and err and not called)
    end
    assert(commit(manifest, function() return true end))
    return {checkpointed = true}
end}
