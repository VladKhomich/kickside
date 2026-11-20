-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local uuid = require("uuid")
local security = require("security")
local funcs = require("funcs")
local sql = require("sql")
local fs = require("fs")
local registry = require("registry")
local http_client = require("http_client")
local json = require("json")
local env = require("env")
local provision = require("provision")
local types = require("types")
local secret_cipher = require("secret_cipher")
local upload_tokens = require("upload_tokens")

local function provision_uploader()
    local owner = uuid.v4()
    local db = assert(sql.get("app:db"))
    local _, user_err = db:execute([[INSERT INTO app_users
        (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$1,'test-only','active')]], { owner, owner .. "@uploads.test" })
    test.is_nil(user_err, tostring(user_err))
    for _, group_id in ipairs({ "app:uploads_test", "wippy.security:process" }) do
        local _, group_err = db:execute([[INSERT INTO app_user_groups (user_id,group_id)
            VALUES ($1,$2)]], { owner, group_id })
        test.is_nil(group_err, tostring(group_err))
    end
    db:release()
    local actor = security.new_actor(owner, { security_groups = { "app:uploads_test" } })
    local scope = security.named_scope("wippy.security:process")
    local _, provision_err = provision.ensure_user(actor, scope, owner)
    test.is_nil(provision_err, tostring(provision_err))
    return owner, actor, scope
end

local function count_uploads(owner)
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT COUNT(*) AS n FROM kickside_uploads WHERE actor_id = $1", { owner })
    db:release()
    test.is_nil(err, tostring(err))
    return tonumber(rows[1].n)
end

local function stored_files(storage)
    local names = {}
    for entry in assert(storage:readdir(".")) do
        names[#names + 1] = entry.name
    end
    table.sort(names)
    return table.concat(names, "\n")
end

return { run = test.run_cases(function()
    test.describe("Upload HTTP deduplication response", function()
        test.it("returns the existing UUID and deduped only for identical bytes uploaded again by the same user", function()
            local owner, actor, scope = provision_uploader()
            local bytes = "HTTP upload content " .. uuid.v4()
            local function upload(filename)
                local response, err = funcs.new():with_actor(actor):with_scope(scope)
                    :with_context({ upload_bytes = bytes, upload_filename = filename })
                    :call("app:upload_create_probe")
                test.is_nil(err, tostring(err))
                test.not_nil(response)
                test.eq(response.status, 200)
                test.is_true(response.body.success)
                test.eq(response.body.component_id, types.component_id_for_owner(owner))
                test.not_nil(response.body.uuid)
                return response.body
            end

            local first = upload("first.txt")
            test.is_nil(first.deduped)
            local second = upload("second.txt")
            test.eq(second.uuid, first.uuid)
            test.is_true(second.deduped, "duplicate HTTP response includes deduped = true")
        end)
    end)

    test.describe("Multipart completion tokens", function()
        test.it("rejects malformed and expired tokens without creating uploads or storing files", function()
            local owner, actor, scope = provision_uploader()
            local auth_store = assert(security.token_store("kickside.users.security:tokens"))
            local bearer = assert(auth_store:create(actor, scope, {expiration = "1h"}))
            auth_store:close()
            local gateway = assert(registry.get("app:gateway"))
            local port = assert(tostring(gateway.data.addr):match(":(%d+)$"))
            local url = "http://127.0.0.1:" .. port .. "/reference/uploads"
            local boundary = "upload-token-fixture-" .. uuid.v4()
            local file = '--' .. boundary .. '\r\nContent-Disposition: form-data; name="file"; filename="token.txt"'
                .. '\r\nContent-Type: text/plain\r\n\r\nfixture ' .. uuid.v4() .. '\r\n'
            local function upload(fields)
                local body = file
                for _, field in ipairs(fields) do
                    body = body .. '--' .. boundary .. '\r\nContent-Disposition: form-data; name="upload_token"'
                        .. '\r\n\r\n' .. field .. '\r\n'
                end
                local response, err = http_client.post(url, {
                    timeout = 10,
                    headers = {Authorization = "Bearer " .. bearer,
                        ["Content-Type"] = "multipart/form-data; boundary=" .. boundary},
                    body = body .. '--' .. boundary .. '--\r\n',
                })
                test.is_nil(err, tostring(err))
                return response.status_code, assert(json.decode(response.body))
            end

            local key = assert(secret_cipher.load_key(assert(env.get("kickside.uploads.env:encryption_key"))))
            local issued_id = uuid.v4()
            local declaration = {upload_id = issued_id, function_id = "app:callback_probe",
                actor_id = owner, actor_context = "{}"}
            local valid = assert(upload_tokens.pack(declaration))
            declaration.issued_at = os.time() - 86401
            local expired = assert(secret_cipher.seal(assert(json.encode(declaration)), key))
            local storage = assert(fs.get("app:uploads"))
            local before = stored_files(storage)
            for _, fields in ipairs({{""}, {"not a token"}, {expired}, {valid, valid}}) do
                local status, body = upload(fields)
                test.eq(status, 400)
                test.is_false(body.success)
                test.is_nil(body.uuid)
                test.eq(count_uploads(owner), 0)
                test.eq(stored_files(storage), before)
            end

            local status, accepted = upload({valid})
            test.eq(status, 200, tostring(accepted.details or accepted.error))
            test.is_true(accepted.success)
            test.eq(accepted.uuid, issued_id)
            test.eq(count_uploads(owner), 1)
            local admitted_files = stored_files(storage)
            test.is_true(admitted_files ~= before)
            local duplicate_status, duplicate = upload({valid})
            test.eq(duplicate_status, 409)
            test.is_false(duplicate.success)
            test.eq(count_uploads(owner), 1)
            test.eq(stored_files(storage), admitted_files)
        end)
    end)
end) }
