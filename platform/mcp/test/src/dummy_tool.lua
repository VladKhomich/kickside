-- A harness tool (meta.type=tool) the suite grants to a credential so the surface
-- has something to expose + call. Echoes its args back; runs under the synthesized
-- MCP principal, proving the dispatcher invokes a surfaced tool.
local ctx = require("ctx")

local function handler(args)
    if type(args) == "table" and args.fail == true then
        return nil, errors.new({
            message = "requested fixture failure " .. tostring(args.kind or errors.INVALID),
            kind = args.kind or errors.INVALID,
            retryable = args.retryable,
            details = { code = "PROBE_MCP", nested = { marker = "kept" } },
        })
    end
    if type(args) == "table" and args.reject == true then
        return { success = false, error = "fixture access denied", code = "fixture_denied" }
    end
    if type(args) == "table" and args.unserializable == true then
        local result = { ok = true }
        result.loop = result
        return result
    end
    if type(args) == "table" and type(args.images) == "number" then
        local images = {}
        local png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aU2sAAAAASUVORK5CYII="
        local data = args.large and string.rep("A", 4 * 1024 * 1024 + 4) or png
        for i = 1, args.images do
            images[i] = { type = "image", source = { type = "base64", mime_type = "image/png",
                data = args.invalid and "not_base64!!" or data } }
        end
        if args.image_error then return { success = false, error = "image fixture failed", _images = images } end
        return { ok = true, _images = images }
    end
    return { ok = true, echoed = args or {}, fixture_context = ctx.get("fixture_context"), configured_tool_ids = ctx.get("tool_ids"), connection_id = ctx.get("connection_id"), mcp_session_id = ctx.get("mcp_session_id") }
end

return { handler = handler }
