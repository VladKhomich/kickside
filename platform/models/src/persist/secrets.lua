local crypto = require("crypto")
local env = require("env")
local canonical = require("canonical")
local secret_cipher = require("secret_cipher")

local M = {}

local function key(): (string?, string?)
    local variable, variable_err = env.get("kickside.models.env:encryption_key")
    if variable_err then return nil, tostring(variable_err) end
    local key, err = secret_cipher.load_key(variable)
    if err then return nil, tostring(err) end
    return key
end

-- Computed in the existing key-owning profile decoder. Only this profile's
-- configuration contributes to the private seed used to identify a dispatch.
function M.profile_signer(): ((string, any, any) -> string?)?
    local k = key()
    if not k then return nil end
    return function(id: string, config: any, secret_config: any): string?
        local encoded = canonical.encode({"kickside.models/profile/v1", id, config, secret_config})
        if not encoded then return nil end
        return crypto.hmac.sha256(k, encoded)
    end
end

function M.encrypt(plaintext: any): (string?, string?)
    local k, kerr = key()
    if not k then return nil, kerr end
    local enc, err = secret_cipher.seal(tostring(plaintext), k)
    if err then return nil, "encrypt failed: " .. tostring(err) end
    return enc
end

function M.decrypt(ciphertext: any): (string?, string?)
    if ciphertext == nil or ciphertext == "" then return "" end
    local k, kerr = key()
    if not k then return nil, kerr end
    local dec, err = secret_cipher.open(tostring(ciphertext), k)
    if err then return nil, "decrypt failed: " .. tostring(err) end
    return dec
end

return M
