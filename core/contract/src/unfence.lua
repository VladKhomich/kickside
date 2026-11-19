-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

local trim = require("text_trim").trim

local function unfence(value: string): string
    local text = trim(value)
    if #text < 6 or text:sub(1, 3) ~= "```" or text:sub(-3) ~= "```" then
        return text
    end
    local body_start = text:find("[^%w]", 4) or 4
    return trim(text:sub(body_start, -4))
end

return { unfence = unfence }
