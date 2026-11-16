-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local source = require("source")
local fixture = require("fixture")
local uuid = require("uuid")
return {run = test.run_cases(function()
    test.describe("component owner key loading", function()
        test.it("reads the declared alias and invokes Contract's loader once per worker", function()
            local id, incarnation = uuid.v7(), uuid.v4()
            for generation = 1, 3 do
                local sealed, seal_err = source.encode(id, {api_key = "key-cache-sentinel"},
                    {{path = {"api_key"}, type = "string"}}, generation, incarnation)
                test.is_nil(seal_err)
                test.is_nil((sealed:find("key-cache-sentinel", 1, true)))
                local value, open_err = source.decode(id, sealed, generation, incarnation)
                test.is_nil(open_err)
                test.eq(value.api_key, "key-cache-sentinel")
                test.eq(fixture.alias_reads, 1)
                test.eq(fixture.key_loads, 1)
            end
        end)
    end)
end)}
