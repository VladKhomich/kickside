-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Admission fixtures acknowledge the supplied range without materializing documents.
local function run(input: table): table
    return {body = input.projection.body, last_seq = input.range.to_seq}
end

return {run = run}
