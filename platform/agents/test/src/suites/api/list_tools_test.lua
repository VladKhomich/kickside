local test = require("test")
local list_tools = require("list_tools")

local function entry(id: string): any
    return {
        id = id,
        kind = "function.lua",
        meta = { title = id, type = "tool", public = true, input_schema = "{}" },
    }
end

local function define_tests()
    test.describe("agent tool catalog paging", function()
        test.it("returns stable bounded pages and a cursor for the next page", function()
            test.is_true(list_tools.entry_visible(entry("tool:a")))
            local page, next_cursor = list_tools.page({ entry("tool:c"), entry("tool:a"), entry("tool:b") }, {
                limit = 2,
                offset = 0,
            })
            test.eq(#page, 2)
            test.eq(page[1].id, "tool:a")
            test.eq(page[2].id, "tool:b")
            test.eq(next_cursor, "2")

            local final, final_cursor = list_tools.page({ entry("tool:c"), entry("tool:a"), entry("tool:b") }, {
                limit = 2,
                offset = tonumber(next_cursor),
            })
            test.eq(#final, 1)
            test.eq(final[1].id, "tool:c")
            test.is_nil(final_cursor)
        end)

        test.it("resolves public tool titles by tool name or exact registry id", function()
            local public = entry("tools:public")
            public.meta.llm_alias = "PublicAlias"
            local private = entry("tools:private")
            private.meta.private = true
            local duplicate = entry("other:public")
            duplicate.meta.llm_alias = "PublicAlias"
            local plain = entry("tools:plain")
            local wanted = {
                PublicAlias = true, plain = true, private = true,
                ["tools:public"] = true, ["tools:private"] = true,
            }
            local titles = list_tools.resolve_names({public, private, plain}, wanted)
            test.eq(titles.PublicAlias.name, "PublicAlias")
            test.eq(titles["tools:public"].title, "tools:public")
            test.eq(titles.plain.title, "tools:plain")
            test.is_nil(titles.private)
            test.is_nil(titles["tools:private"])
            local ambiguous = list_tools.resolve_names({public, duplicate}, wanted)
            test.is_nil(ambiguous.PublicAlias)
            test.eq(ambiguous["tools:public"].title, "tools:public")
        end)
    end)
end

return { run = test.run_cases(define_tests) }
