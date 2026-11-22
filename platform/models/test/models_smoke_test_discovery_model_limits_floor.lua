local test = require("test")
local registry = require("registry")
local models_repo = require("models_repo")
local catalog_policy = require("catalog_policy")
local catalog_card_policy = require("catalog_card_policy")
local provider_read_model = require("provider_read_model")
local model_catalog = require("model_catalog")
local model_mapper = require("model_mapper")
local models_types = require("models_types")
local provider_registry = require("provider_registry")
local provider_openai_like = require("provider_openai_like")

local function value(entry: any, key: string): any
    if type(entry) ~= "table" then return nil end
    if entry[key] ~= nil then return entry[key] end
    if type(entry.data) == "table" then return entry.data[key] end
    return nil
end

local function has_process_scope(entry: any): boolean
    local lifecycle = value(entry, "lifecycle")
    if type(lifecycle) ~= "table" or type(lifecycle.security) ~= "table" then
        return false
    end
    local groups = lifecycle.security.groups
    if type(groups) ~= "table" then
        return false
    end
    for _, group_id in ipairs(groups) do
        if group_id == "wippy.security:process" then return true end
    end
    return false
end

local function meta(entry: any): any
    return type(entry) == "table" and (entry.meta or (entry.data and entry.data.meta)) or nil
end

local function has(list: any, expected: string): boolean
    if type(list) ~= "table" then return false end
    for _, item in ipairs(list) do
        if item == expected then return true end
    end
    return false
end

local function allowed_class(name: string): boolean
    return name == "fast"
        or name == "nano"
        or name == "balanced"
        or name == "premium"
        or name == "embed"
end

local function define_tests()

    test.describe("discovery model limits", function()
        test.it("leaves unadvertised limits unset and keeps advertised limits", function()
            local mx, out = model_mapper.model_limits({})
            test.is_nil(mx)
            test.is_nil(out)
            local mx2, out2 = model_mapper.model_limits({ context_length = 200000, max_output_tokens = 8192 })
            test.eq(mx2, 200000)
            test.eq(out2, 8192)
        end)

        test.it("leaves unadvertised embedding dimensions unset", function()
            local _, _, dims = model_mapper.model_limits({ capabilities = { "embed" } })
            test.is_nil(dims)
        end)

        test.it("leaves unadvertised generation dimensions unset", function()
            local _, _, dims = model_mapper.model_limits({ capabilities = { "generate" } })
            test.is_nil(dims)
        end)

        test.it("uses positive advertised dimensions", function()
            local _, _, dims = model_mapper.model_limits({ dimensions = 3072 })
            test.eq(dims, 3072)
            local _, _, unknown = model_mapper.model_limits({ dimensions = 0 })
            test.is_nil(unknown)
        end)
    end)

end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
