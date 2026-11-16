-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return {current_version = function(): (any, error?)
    return nil, errors.new({kind = errors.INTERNAL, message = "lifecycle mutations do not check registry revisions"})
end}
