-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = { ACCESS = { READ = 1 } }

function M.open_db()
    return {
        query = function()
            return {{ run_id = "run", workflow_id = "workflow", execution_identity_json = "{}" }}
        end,
        release = function() end,
    }
end

function M.get()
    return { actor_id = "owner", metadata = { run_id = "run" } }
end

function M.from_row(actor_id)
    return { principal = actor_id }
end

function M.authorize(identity)
    return identity
end

function M.validate_principal_access()
    return true
end

function M.run_as(identity, target, args)
    return { owner = identity.principal, target = target, args = args }
end

return M
