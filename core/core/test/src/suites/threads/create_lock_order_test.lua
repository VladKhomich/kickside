-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Concurrent creates of one child thread id under a shared parent. The winner's
-- completion writes the child component's meta while the losers repeat its
-- registration; every create either succeeds or reports the existing component.
local test = require("test")
local uuid = require("uuid")
local fixture = require("fixture")

local ROUNDS = 20
local WRITERS = 12

local function define_tests()
    test.describe("thread create lock order", function()
        local context = fixture.new()
        local as_owner = context.as_owner

        local function outcome(err: any): string
            if not err then return "" end
            local details = (err :: any):details() or {}
            if errors.is(err, errors.CONFLICT) and details.code == "component_already_exists" then return "" end
            return tostring(err)
        end

        local function race(parent_id: string, id: string): { string }
            local done = channel.new(WRITERS)
            for writer = 1, WRITERS do
                coroutine.spawn(function()
                    local args: { [string]: any } = { title = "child", parent_id = parent_id }
                    if writer % 4 ~= 0 then args.id = id end
                    local ok, result = pcall(function(): string
                        local _, err = as_owner("create", args)
                        return outcome(err)
                    end)
                    done:send(ok and result or tostring(result))
                end)
            end
            local failures: { string } = {}
            for _ = 1, WRITERS do
                local failure = done:receive()
                if failure ~= "" then failures[#failures + 1] = failure end
            end
            return failures
        end

        for round = 1, ROUNDS do
            test.it("creates one child id under a shared parent, round " .. round, function()
                local parent, parent_err = as_owner("create", { title = "parent" })
                test.is_nil(parent_err)
                local id = uuid.v7()
                test.eq(table.concat(race(parent.thread_id, id), "\n"), "")
                local found, find_err = as_owner("find", { thread_id = id })
                test.is_nil(find_err)
                test.eq(found.id, id)
            end)
        end
    end)
end

return { run = test.run_cases(define_tests) }
