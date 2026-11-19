-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local test = require("test")
local trim = require("text_trim").trim
local unfence = require("unfence").unfence
local fence = "```"

local function define_tests()
    test.describe("text trim", function()
        test.it("strips only Lua whitespace at the edges", function()
            local space = " \t\n\v\f\r"
            local body = "first\t\0\nlast"
            test.eq(trim(space .. body .. space), body)
            local nonbreaking_space = "\194\160"
            test.eq(trim(nonbreaking_space .. "text" .. nonbreaking_space),
                nonbreaking_space .. "text" .. nonbreaking_space)
            test.eq(trim(""), "")
            test.eq(trim(nil), "")
        end)

        test.it("preserves long internal whitespace and trims long edges", function()
            local space = string.rep(" ", 1024 * 1024)
            local body = "first" .. space .. "last"
            test.eq(trim(space .. body .. space), body)
            test.eq(trim(space), "")
        end)
    end)

    test.describe("model response fences", function()
        test.it("preserves the existing fence and language-tag rules", function()
            local expression = "(input.value or 0) + 1"
            test.eq(unfence(" \t" .. fence .. "lua\n " .. expression .. "\n" .. fence .. " "), expression)
            test.eq(unfence(fence .. "\n" .. expression .. fence), expression)
            test.eq(unfence(" " .. expression .. " "), expression)
            test.eq(unfence(fence .. "lua\n" .. expression), fence .. "lua\n" .. expression)
            test.eq(unfence(fence .. fence), "")
        end)

        test.it("handles long fenced content and language tags", function()
            local body = "first" .. string.rep(" ", 1024 * 1024) .. "last"
            local tag = string.rep("A", 1024 * 1024)
            test.eq(unfence(fence .. tag .. "\n" .. body .. "\n" .. fence), body)
        end)
    end)
end

return { run = test.run_cases(define_tests) }
