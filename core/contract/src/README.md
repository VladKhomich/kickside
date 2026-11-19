# kickside/contract

KickSide base contracts.

## Contracts

- **component** - Base interface all components must implement
- **content_provider** - Content retrieval with storage access
- **deletable** - Optional cleanup interface for components
- **resource_registry** - Resource listing and counting with pagination
- **scope_resolver** - Subject-to-scope-params seam returning serializable scope parameters

## Text helpers

`kickside.contract:text_trim` exports `trim(value)`. It removes Lua ASCII whitespace
at the edges of a string and preserves the interior bytes. Non-string values return
an empty string.

`kickside.contract:unfence` exports `unfence(text)` for model responses. It trims the
surrounding whitespace and strips a matching pair of triple-backtick fences with
an optional alphanumeric language tag. Consumers declare a direct Contract
dependency starting with the release that exports the helper they import.

## HTTP error classification

`kickside.contract:http_errors` exports `classify(err)` returning an integer HTTP
status and `{ kind, retryable, details }`. It identifies runtime errors through
`errors.is`; plain strings, lookalike tables, unrelated userdata, nil and unknown
kinds return 500 with absent metadata. Identified UNKNOWN errors retain metadata.

INVALID maps to 400, PERMISSION_DENIED to 403, NOT_FOUND to 404, CONFLICT and
ALREADY_EXISTS to 409, RATE_LIMITED to 429, UNAVAILABLE to 503, and TIMEOUT to 504.
CANCELED, INTERNAL and UNKNOWN map to 500. Retryability is exactly the error's
metadata, including nil; details remain intact. Endpoints own response envelopes,
message rendering, explicit authentication/input decisions and domain result DTOs.
Each consuming package declares a direct unpinned dependency on `kickside/contract`.
Consumers require this export to be available before deployment.

## Member HTTP endpoints

Each module declares its HTTP endpoints in its `api` namespace and grants
member access through policies listing the exact endpoint ids. Endpoint names
do not determine authority. Separate audiences use separate policies with their
own endpoint lists.

`kickside.contract.http:user_endpoint_access` lists the Core member endpoints.
The host binds `kickside.contract.http:user_security_scope` on its Contract
dependency through the existing member-group composition. Modules keep their
own endpoint lists and direct unpinned Contract dependencies.

Component permissions, schema mutation, runtime capabilities, static serving,
administration, public callbacks, and scoped credentials retain their own
boundaries.
