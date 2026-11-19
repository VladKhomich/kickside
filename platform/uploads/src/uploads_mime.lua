local upload_type = require("upload_type")
local registry = require("registry")
local artifact_schema = require("artifact_schema")

local function get_file_extension(filename)
    if type(filename) ~= "string" then return "" end
    return filename:match("%.([^%.]+)$") or ""
end

local function get_mime_type_from_extension(filename)
    local mime, err = upload_type.mime_for_extension(get_file_extension(filename))
    if err then return nil, err end
    return mime or "application/octet-stream"
end

local TEXT_MIME = {
    ["application/javascript"] = true,
    ["application/json"] = true,
    ["application/sql"] = true,
    ["application/x-yaml"] = true,
    ["application/xml"] = true,
}

local ARTIFACT_TEXT_MIME = {
    markdown = "text/markdown",
    table = "text/plain",
    text = "text/plain",
}

local TABLE_MIME = {
    ["application/csv"] = true,
    ["text/csv"] = true,
    ["text/tab-separated-values"] = true,
    ["text/tsv"] = true,
}

local function base_mime(mime_type)
    return (mime_type or ""):lower():match("^%s*([^;%s]+)") or ""
end

local function is_text(mime_type)
    return mime_type:sub(1, 5) == "text/" or TEXT_MIME[mime_type] == true or TABLE_MIME[mime_type] == true
        or (mime_type:sub(1, 12) == "application/"
            and (mime_type:match("%+json$") ~= nil or mime_type:match("%+xml$") ~= nil))
end

local function is_generic(mime)
    return mime == "" or mime == "application/octet-stream"
end

local function has_inline_renderer(mime, family)
    local renderers, err = registry.find({[".kind"] = "registry.entry", ["meta.type"] = "kickside.renderer"})
    if err then return nil, err end
    local wildcard = family and family .. "/*"
    for _, entry in ipairs(renderers or {}) do
        local metadata = entry.meta or {}
        if type(metadata.component_tag) == "string" and type(metadata.content_types) == "table" then
            for _, content_type in ipairs(metadata.content_types) do
                if type(content_type) == "string" then
                    local pattern = base_mime(content_type)
                    if pattern == mime or pattern == wildcard or pattern == "*/*" then return true end
                end
            end
        end
    end
    return false
end

local function describe(mime_type, filename, artifact)
    local original = artifact_schema.references_original(artifact)
    local mime = mime_type
    if artifact and not original then mime = artifact.mime_type end
    local base = base_mime(mime)
    local generic = is_generic(base)
    local mapped
    if generic or base == "text/plain" then
        local name = filename
        if artifact and not original then
            name = artifact.label
            if ARTIFACT_TEXT_MIME[artifact.kind] and get_file_extension(name) == "" then name = filename end
        end
        local err
        mapped, err = get_mime_type_from_extension(name)
        if err then return nil, err end
    end
    local artifact_kind
    if generic then
        mime = mapped
        -- A linked artifact can identify original bytes only when the upload still has no type.
        if artifact and (not original or is_generic(base_mime(mapped))) then
            artifact_kind = artifact.kind
            local default_text_mime = ARTIFACT_TEXT_MIME[artifact_kind]
            if original and not is_generic(base_mime(artifact.mime_type)) then
                mime = artifact.mime_type
            elseif default_text_mime and (artifact_kind == "markdown" or not is_text(base_mime(mapped))) then
                mime = default_text_mime
            end
        end
    end

    base = base_mime(mime)
    local text_available = is_text(base)
    local family = base:match("^([^/]+)/")
    local kind = family or "binary"
    if text_available then
        if base == "text/markdown" or base == "text/x-markdown" then
            kind = "markdown"
        elseif TABLE_MIME[base] or (base == "text/plain" and (TABLE_MIME[base_mime(mapped)] or artifact_kind == "table")) then
            kind = "table"
        else
            kind = "text"
        end
    end
    local inline = text_available or family == "image" or family == "audio" or family == "video" or base == "application/pdf"
    if not inline then
        local err
        inline, err = has_inline_renderer(base, family)
        if err then return nil, err end
    end
    return {
        kind = kind,
        mime_type = mime or "application/octet-stream",
        text_available = text_available,
        inline = inline,
    }, nil
end

local function determine_upload_type(mime_type, filename)
    local ext = get_file_extension(filename)
    local type_entry, err = upload_type.find_by_mime_or_ext(mime_type, ext)
    if not type_entry then
        return nil, "Unsupported file type: " .. (err or "unknown error")
    end
    return type_entry.id
end


return {
    get_file_extension = get_file_extension,
    get_mime_type_from_extension = get_mime_type_from_extension,
    describe = describe,
    determine_upload_type = determine_upload_type,
}
