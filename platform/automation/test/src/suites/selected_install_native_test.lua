-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
local component = require("component")
local contract = require("contract")
local automations = require("automations")
local execution_identity = require("execution_identity")

local M = {}
local PROBE = "kickside.automation:selected_install_native_probe"
local INSTALL = "kickside.automation:selected_install_native_install"
local KIND = "kickside.automation:selected_install_native_kind"

function M.prepare(input)
    return {state = {title = input.title}, metadata = {title = input.title}, source = {source_kind = "none"}}
end

function M.install(args)
    return automations.install_type_selected(KIND, {title = args.title}, args)
end

function M.probe(input)
    local identity = assert(execution_identity.capture())
    local parent_id
    if input.rooted then
        local service = assert(assert(contract.get("kickside.component:component_service")):open())
        local parent, err = service:register({impl_id = "kickside.automation.round.fixture:round_source_kind"})
        test.is_nil(err, tostring(err))
        parent_id = parent.component_id
        identity = assert(component.get_identity_receipt(parent_id)).execution_identity
    end
    local args = {component_id = uuid.v7(), request_id = "selected/" .. uuid.v7(),
        parent_id = parent_id, principal = identity.principal, title = "Selected child"}
    local function install()
        if input.rooted then return execution_identity.run_as(identity, INSTALL, args) end
        return funcs.call(INSTALL, args)
    end
    local installed, install_err = install()
    test.is_nil(install_err, tostring(install_err))
    test.eq(installed.id, args.component_id)
    local first = assert(component.get_identity_receipt(installed.id))
    test.eq(first.execution_identity.component_id, parent_id or installed.id)
    test.eq(first.execution_identity.principal.id, identity.principal.id)
    test.eq(first.execution_identity.authorized_by.id, identity.authorized_by.id)
    test.eq(first.execution_identity.credential_id, identity.credential_id)
    test.eq(first.execution_identity.link_id, identity.link_id)
    local rows = assert(component.query({component_ids = {installed.id}, parent_id = parent_id, limit = 1}))
    test.eq(#rows, 1)
    local replay, replay_err = install()
    test.is_nil(replay_err, tostring(replay_err))
    test.eq(replay.id, installed.id)
    local repeated = assert(component.get_identity_receipt(installed.id))
    test.eq(repeated.identity_generation, first.identity_generation)
    test.eq(repeated.identity_hash, first.identity_hash)
    args.title = "Changed child"
    local changed, changed_err = install()
    test.is_nil(changed)
    test.is_true(errors.is(changed_err, errors.CONFLICT), tostring(changed_err))
    return true
end

M.run = test.run_cases(function()
    test.describe("native selected installation", function()
        for _, rooted in ipairs({true, false}) do
            local title = rooted and "selected child keeps its board-like caller's root across replay"
                or "unrooted selected install roots at its new component across replay"
            test.it(title, function()
                local actor = security.new_actor("selected_native_" .. uuid.v7(), {security_groups = {"automation_test"}})
                local scope = assert(security.named_scope("wippy.security:process"))
                local result, err = funcs.new():with_actor(actor):with_scope(scope):call(PROBE, {rooted = rooted})
                test.is_nil(err, tostring(err))
                test.is_true(result)
            end)
        end
    end)
end)

return M
