-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local lifecycle = require("lifecycle")
local uuid = require("uuid")
local time = require("time")
local http = require("http")
local presign_api = require("presign_api")
local upload_mime = require("upload_mime")
local records = require("records")
local uploads = require("uploads")
return {
	run = test.run_cases(function()
		test.describe("presigned packed locations", function()
			test.it("persists the cloud location and resolves the upload MIME at admission", function()
				local signed_mime
				local api: any = {}
				local s3 = {}
				function s3:presigned_put_url(key, options)
					signed_mime = options.content_type
					return "https://storage.example/" .. key, nil
				end
				function s3:release() end
				lifecycle.attach(api, {
					uuid = uuid,
					time = time,
					resources = {
						get_s3 = function()
							return s3
						end,
						get_s3_id = function()
							return "app:objects"
						end,
						get_storage_id = function()
							return "app:uploads"
						end,
					},
					upload_types = { DEFAULT_PRESIGN_EXPIRES_SECONDS = 300 },
					token_flow = { bound_token_upload_id = function() end, take_trace_context = function() end },
					determine_upload_type = upload_mime.determine_upload_type,
					freeze_current_identity = function() end,
					upload_record_repo = records,
				})
				local actor_id = uuid.v4()
				local body, status, response
				local handler = presign_api.new({
					upload_lib = api,
					http = {
						CONTENT = http.CONTENT,
						STATUS = http.STATUS,
						request = function() return {
							body_json = function() return body end,
							is_content_type = function() return true end,
						} end,
						response = function() return {
							set_content_type = function() end,
							set_status = function(_, value) status = value end,
							write_json = function(_, value) response = value end,
						} end,
					},
					security = {actor = function() return {id = function() return actor_id end} end},
				}).handler
				for _, case in ipairs({
					{filename = "note.txt", input = "text/plain", stored = "text/plain"},
					{filename = "inventory.TSV", stored = "text/tab-separated-values"},
					{filename = "inventory.tsv", input = "application/octet-stream", stored = "text/tab-separated-values"},
					{filename = "inventory.tsv", input = "text/csv", stored = "text/csv"},
					{filename = "data.unknown", stored = "application/octet-stream"},
				}) do
					body, status, response = {filename = case.filename, size = 5, content_type = case.input}, nil, nil
					handler()
					test.eq(status, http.STATUS.OK, response and response.details)
					test.is_true(response.success)
					local saved = assert(uploads.get(response.upload_id))
					test.eq("app:uploads", saved.storage_id)
					test.eq("s3://app:objects/" .. actor_id .. "/" .. saved.uuid .. "/" .. case.filename, saved.storage_path)
					test.eq(saved.mime_type, case.stored)
					test.eq(signed_mime, case.input or "application/octet-stream")
				end
			end)
		end)
	end),
}
