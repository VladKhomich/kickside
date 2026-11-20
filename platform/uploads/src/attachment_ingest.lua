-- Shared provider-attachment ingest.
--
-- A file dropped in any connected channel (Discord/Telegram/...) is pulled into
-- the SAME upload pipeline a web upload uses: download the bytes, hand them to
-- kickside.uploads:uploads, and tag the upload with the thread it came from.
-- The upload is the satellite that references the thread (via metadata); the
-- kickside_event is never modified. Conversion and storage are reused unchanged
-- downstream.

local funcs = require("funcs")
local http_client = require("http_client")
local registry = require("registry")
local canonical_json = require("canonical_json")
local security = require("security")
local hash = require("hash")
local upload_lib = require("upload_lib")
local metadata_sanitizer = require("metadata_sanitizer")

local M = {}

-- Skip anything larger than the document pipeline cap so we never pull a huge
-- blob just to have the processor reject it.
M.MAX_BYTES = 50 * 1024 * 1024
local FETCHER_META = "attachment.fetcher"

M.deps = { registry = registry, funcs = funcs, http = http_client, uploads = upload_lib }

local function attachment_url(att: any): string
    if type(att.url) == "string" and att.url ~= "" then return att.url end
    if type(att.ref) == "string" and att.ref ~= "" then return att.ref end
    return ""
end

local function attachment_content_type(att: any): string?
    if att.content_type ~= nil then
        if type(att.content_type) ~= "string" then return nil end
        if att.content_type ~= "" then return att.content_type end
    end
    if att.mime ~= nil then
        if type(att.mime) ~= "string" then return nil end
        if att.mime ~= "" then return att.mime end
    end
    return nil
end

-- Decide whether an attachment is ingestable. Pure; returns (ok, reason).
function M.should_ingest(att: any, max: number?): (boolean, string?)
    if type(att) ~= "table" then return false, "no attachment" end
    local a: any = att
    if attachment_url(a) == "" then return false, "no url" end
    if type(a.actor_id) ~= "string" or a.actor_id == "" then return false, "no actor" end
    if (a.content_type ~= nil and type(a.content_type) ~= "string")
        or (a.mime ~= nil and type(a.mime) ~= "string")
    then
        return false, "invalid content type"
    end
    local limit = tonumber(max) or M.MAX_BYTES
    if type(a.size) == "number" and a.size > limit then return false, "too large" end
    return true, nil
end

-- Download an attachment and push it into the upload pipeline, tagged with its
-- thread. Returns the upload record (with .uuid) or (nil, err). Best-effort —
-- callers log the error and continue (a failed attachment must not break
-- message ingestion).
local function fetcher_for(provider: string, method: string?): (string?, string?)
    if provider == "" then return "", nil end

    local entries, err = M.deps.registry.find({ [".kind"] = "registry.entry", ["meta.type"] = FETCHER_META })
    if err then return nil, "attachment fetcher registry unavailable: " .. tostring(err) end
    if type(entries) ~= "table" then return nil, "attachment fetcher registry returned invalid data" end

    local found = ""
    local versioned_fetch = nil
    local versioned_verify = nil
    for _, entry in ipairs(entries :: { any }) do
        local declared: any = (entry :: any).data or entry
        if tostring(declared.provider or "") == provider then
            if method then
                -- A legacy attachment fetcher does not opt into versioned delivery.
                local fetch, verify = declared.fetch_func, declared.verify_func
                if type(fetch) == "string" and fetch ~= "" and type(verify) == "string" and verify ~= "" then
                    if versioned_fetch and (versioned_fetch ~= fetch or versioned_verify ~= verify) then
                        return nil, "multiple versioned attachment fetchers declared for provider " .. provider
                    end
                    versioned_fetch, versioned_verify = fetch, verify
                    found = declared[method]
                end
            else
                local func = tostring(declared.fetch_func or "")
                if func ~= "" then
                    if found ~= "" and found ~= func then
                        return nil, "multiple attachment fetchers declared for provider " .. provider
                    end
                    found = func
                end
            end
        end
    end
    return found, nil
end

local function invalid(message: string): error
    return errors.new({kind = errors.INVALID, retryable = false, message = message})
end

local function attachment_identity(att: any): (string?, error?)
    if type(att) ~= "table" or type(att.source) ~= "string" or att.source == ""
        or type(att.component_id) ~= "string" or att.component_id == "" or type(att.ref) ~= "table" then
        return nil, invalid("An attachment requires a provider, connection and versioned reference")
    end
    local encoded, err = canonical_json.encode({att.source, att.component_id, att.ref})
    if err or not encoded or #encoded > 4096 then return nil, invalid("Invalid attachment reference") end
    return hash.sha256(encoded), nil
end

local function provider_call(att: any, method: string): (any?, error?)
    local target, find_err = fetcher_for(att.source, method)
    if find_err then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true, message = find_err})
    end
    if not target or target == "" then return nil, invalid("Attachment provider does not support versioned delivery") end
    return M.deps.funcs.call(target, {ref = att.ref, component_id = att.component_id})
end

local function current_actor_id(): (string?, error?)
    local actor = security.actor()
    if not actor or actor:id() == "" then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, retryable = false, message = "Authentication required"})
    end
    return actor:id(), nil
end

-- Unlike ordinary URL ingestion, Sync delivery requires a registered
-- authenticated provider. Lookup precedes every download.
function M.admit(att: any, delivery_key: string, resume_effect: boolean): (any?, error?)
    local actor_id, auth_err = current_actor_id()
    if auth_err or not actor_id then return nil, auth_err end
    if type(delivery_key) ~= "string" or delivery_key == "" or type(resume_effect) ~= "boolean" then
        return nil, invalid("A delivery key and resume flag are required")
    end
    local signature, signature_err = attachment_identity(att)
    if signature_err or not signature then return nil, signature_err end
    local existing, lookup_err = M.deps.uploads.find_delivery_upload(actor_id, delivery_key, signature)
    if lookup_err or existing then return existing, lookup_err end
    if resume_effect then
        return nil, errors.new({kind = errors.NOT_FOUND, retryable = false, message = "Attachment upload is no longer retained"})
    end
    local fetched, fetch_err = provider_call(att, "fetch_func")
    if fetch_err then return nil, fetch_err end
    if type(fetched) ~= "table" or type(fetched.bytes) ~= "string" or #fetched.bytes == 0
        or #fetched.bytes > M.MAX_BYTES or type(fetched.filename) ~= "string" or fetched.filename == "" then
        return nil, invalid("Attachment provider returned invalid file data")
    end
    return M.deps.uploads.upload_delivery_file(actor_id, delivery_key, signature,
        fetched.bytes, fetched.filename, fetched.content_type,
        {source = att.source, source_url = fetched.source_url})
end

function M.verify(att: any): error?
    local _, auth_err = current_actor_id()
    if auth_err then return auth_err end
    local _, signature_err = attachment_identity(att)
    if signature_err then return signature_err end
    local found, err = provider_call(att, "verify_func")
    if err then return err end
    if type(found) ~= "table" or found.current ~= true then return invalid("Attachment version is no longer current") end
    return nil
end

-- Returns the bytes and, for a declared provider fetcher, its whole answer
-- (filename and content_type when the provider knows them).
local function fetch_bytes(a: any): (string?, string?, any?)
    local fetch, lookup_err = fetcher_for(tostring(a.source or ""))
    if lookup_err then return nil, lookup_err end

    local bytes: string? = nil
    local fetched_result: any = nil
    if fetch == "" then
        local resp, derr = M.deps.http.get(attachment_url(a), {})
        if derr then return nil, "download failed: " .. tostring(derr) end
        if not resp or resp.status_code ~= 200 or type(resp.body) ~= "string" or resp.body == "" then
            return nil, "download status " .. tostring(resp and resp.status_code)
        end
        bytes = resp.body
    else
        local result, ferr = M.deps.funcs.call(fetch :: string, { ref = a.ref, component_id = a.component_id })
        if ferr then return nil, "fetch failed: " .. tostring(ferr) end
        if type(result) ~= "table" then return nil, "fetch returned no bytes" end
        local reported = tostring((result :: any).error or "")
        if reported ~= "" then return nil, "fetch failed: " .. reported end
        local fetched = (result :: any).bytes
        if type(fetched) ~= "string" or fetched == "" then return nil, "fetch returned no bytes" end
        bytes = fetched
        fetched_result = result
    end

    if #(bytes :: string) > M.MAX_BYTES then return nil, "too large" end
    return bytes, nil, fetched_result
end

local function non_empty(value: any): string?
    if type(value) == "string" and value ~= "" then return value end
    return nil
end

-- Caller metadata excludes private operational keys except completion tokens.
-- The owned thread routing keys are set last.
local function upload_metadata(a: any): { [string]: any }
    local metadata: { [string]: any } = metadata_sanitizer.public_locator(a.metadata)
    if type(a.metadata) == "table" then
        metadata.__upload_token = a.metadata.__upload_token
        metadata.__upload_tokens = a.metadata.__upload_tokens
    end
    metadata.source = a.source
    metadata.thread_id = a.thread_id
    metadata.external_message_id = a.external_message_id
    return metadata
end

function M.ingest(att: any): (any?, any?)
    local ok, reason = M.should_ingest(att, M.MAX_BYTES)
    if not ok then return nil, reason end
    local a: any = att

    local bytes, berr, fetched = fetch_bytes(a)
    if berr ~= nil or bytes == nil then return nil, berr end
    fetched = type(fetched) == "table" and fetched or {}
    local content_type = attachment_content_type(a) or non_empty(fetched.content_type)
    local filename = non_empty(a.filename) or non_empty(fetched.filename) or "attachment"

    local upload, uerr = M.deps.uploads.upload_file(
        tostring(a.actor_id),
        bytes :: string,
        filename,
        #(bytes :: string),
        content_type,
        nil,
        upload_metadata(a)
    )
    if uerr then return nil, uerr end
    if not upload then
        return nil, errors.new({ message = "upload returned no record", kind = errors.INTERNAL })
    end
    return upload
end

return M
