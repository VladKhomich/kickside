-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local casefold = require("casefold")

local function define_tests()
    test.describe("Unicode case folding", function()
        test.it("folds ASCII and preserves punctuation, NUL and the empty string", function()
            local folded, err = casefold.fold("AB cd-09_\0X\127")
            test.is_nil(err)
            test.eq(folded, "ab cd-09_\0x\127")
            test.eq((casefold.fold("")), "")
        end)

        test.it("folds sharp S, final sigma and Cyrillic in mixed strings", function()
            test.eq((casefold.fold("École Straße ΟΣ")), "école strasse οσ")
            test.eq((casefold.fold("STRASSE ος")), "strasse οσ")
            test.eq((casefold.fold("CAFÉ ΜΠΟΤΑ БОТИНОК")), "café μποτα ботинок")
            test.eq((casefold.fold("ẞ Σσς")), "ss σσσ")
        end)

        test.it("applies default full mappings for Turkish I and ligatures", function()
            test.eq((casefold.fold("IİıiK ﬃﬄ")), "ii\204\135ıik ffiffl")
            test.eq((casefold.fold(string.rep("K", 256))), string.rep("k", 256))
        end)

        test.it("preserves combining marks and handles supplementary code points", function()
            test.eq((casefold.fold("É E\204\129 𐐀 😀\0X")), "é e\204\129 𐐨 😀\0x")
            test.eq((casefold.fold("\239\191\189\244\143\191\191")), "\239\191\189\244\143\191\191")
        end)

        test.it("returns a native INVALID error for malformed UTF-8", function()
            local malformed = {
                "\128", "\192\128", "\226\130", "\237\160\128",
                "\244\144\128\128", "\245\128\128\128", "ABC\255",
            }
            for _, value in ipairs(malformed) do
                local folded, err = casefold.fold(value)
                test.is_nil(folded)
                test.is_true(errors.is(err, errors.INVALID))
            end
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(options) return run_cases(options) end }
