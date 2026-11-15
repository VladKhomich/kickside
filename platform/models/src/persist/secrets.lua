local crypto = require("crypto")
local base64 = require("base64")
local secret_cipher = require("secret_cipher")
local models_types = require("models_types")

local M = {}

local function key(): (string?, string?)
    local bytes, err = secret_cipher.load_key(models_types.encryption_key())
    if err or not bytes then return nil, "failed to read ENCRYPTION_KEY: " .. tostring(err) end
    return bytes
end

function M.encrypt(plaintext: any): (string?, string?)
    local k, kerr = key()
    if not k then return nil, kerr end
    local enc, err = crypto.encrypt.aes(tostring(plaintext), k)
    if err then return nil, "encrypt failed: " .. tostring(err) end
    -- base64 so the ciphertext is valid UTF-8 text on both SQLite and Postgres
    -- (PG rejects invalid byte sequences in text columns).
    return base64.encode(enc)
end

function M.decrypt(ciphertext: any): (string?, string?)
    if ciphertext == nil or ciphertext == "" then return "" end
    local k, kerr = key()
    if not k then return nil, kerr end
    local decoded, derr = base64.decode(tostring(ciphertext))
    if derr then return nil, "decrypt failed: invalid base64: " .. tostring(derr) end
    local dec, err = crypto.decrypt.aes(decoded, k)
    if err then return nil, "decrypt failed: " .. tostring(err) end
    return dec
end

return M
