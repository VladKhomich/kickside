# kickside/component

Owned resources, component hierarchy, metadata, and access grants.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add kickside/component
wippy install
```

Apply host bindings and migrations through the application install plan.
Review the manifest and registry requirements before enabling the module.
Host resources and security groups bind through the install plan.


## Requirements

For repository validation, use the Wippy release pinned in
[CI](https://github.com/kicksideai/kickside/blob/main/.github/workflows/ci.yml). Use current Hub dependencies
for the contracts declared by the module.
The standalone harness uses SQLite and declares a PostgreSQL test profile.
Development uses Make and the Wippy CLI.

## Development

From this module directory:

```sh
make lockrefresh
make lint
make test
(cd test && wippy test --profile postgres --set vars.pg_database=kickside_readme_test)
```

Create a dedicated PostgreSQL database before the profile run and drop it
afterward. Set the `pg_host`, `pg_port`, `pg_username`, and `pg_password`
variables in the harness configuration for your test server.

## Use

Use Component for independently owned, shared, placed, or deleted resources. Open instances through the actor-bound client with the required READ, WRITE, DELETE, or ADMIN mask. Keep configuration private and safe display state in public metadata; delete through the owning lifecycle.

Closed kinds require owning-module admission for creation, context, and public
metadata changes. Owners can still move them, move their containing folders, and
delete a parent with `reparent_root` under ordinary Component access and placement
rules. See the [kind mutation specification](src/README.md#kind-mutation-admission-spec).

## Reference

- [Module reference](src/README.md)

### Contracts

| Definition | Methods |
| --- | --- |
| [`kickside.component:lifecycle`](src/_index.yaml) | `created`, `updated`, `deleted` |
| [`kickside.component:declaration_owner`](src/_index.yaml) | `verify_identity_command` |
| [`kickside.component:component_service`](src/registry/service_contract/_index.yaml) | `register`, `export`, `import`, `get`, `get_access_context_by_meta`, `get_access_context`, `list_access`, `set_meta`, `update`, `list`, `query`, `count`, `delete`, `set_placement`, `list_children`, `grant_subtree`, `revoke_subtree`, `adopt` |

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan. Existing explicit bindings take precedence over defaults.

| Requirement | Declared default |
| --- | --- |
| [`kickside.component:target_db`](src/_index.yaml) | Host supplies the value |
| [`kickside.component:lifecycle_impl`](src/_index.yaml) | `kickside.component:component_lifecycle_unwired` |
| [`kickside.component:api_router`](src/registry/host_requirements/_index.yaml) | Host supplies the value |
| [`kickside.component.security:user_security_scope`](src/security/module_access/_index.yaml) | `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/kickside/component)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.

## Declared credentials

A binding declares string-valued credential paths in `meta.secret_fields`:

```yaml
secret_fields:
  - {path: [api_key], type: string}
  - {path: [auth, password], type: string}
```

Component validates declarations at boot. Context SET and PATCH partition declared
credentials into the same row's authenticated `encrypted_secrets` document. The
plaintext context carries only `{set: true}` or `{set: false}` at those paths.
Empty strings clear a credential; PATCH omissions preserve it, and SET keeps its
replacement semantics. Existing context revisions and execution identity remain
unchanged. List, query and ordinary context reads never decrypt credentials.
The versioned envelope records its exact paths in a base64 metadata header;
AES-GCM authenticates that header together with the component id and version.
The header binds a random `secrets_incarnation`, created with each new component
row, and `secrets_generation`, a monotonic row counter advanced
atomically on each secret write. Reads verify it against the same row, including
masked reads, and reject replayed envelopes with `component_secrets_integrity`.
Changing the header to match cannot bypass AES-GCM authentication. Non-secret
writes preserve ciphertext, incarnation and generation. Deleting and recreating
the same component id assigns a fresh incarnation, so ciphertext from the deleted
row cannot authenticate. Existing rows gain their incarnation atomically with
secret conversion, without changing revisions or timestamps. Restoring the entire row,
including its incarnation and counter, from an older backup is outside this replay protection.
Path names are public schema metadata. Masked readers of encrypted rows use this
stored header without registry lookup or access to the installation key. External
service surfaces also consult the component-owned declaration reader, so newly
declared legacy fields remain masked while migration is pending. Internal direct
library reads preserve legacy plaintext behavior until their row migrates; once
encrypted, they mask the document's stored paths without declaration authority.
Trusted credential consumers use the explicit component service reads.

Credentials are write-only on every external surface. HTTP, UI, agent tools,
exports, events and history never return credential values. Each declared path
returns exactly `{set: true|false}`. Writes accept strings; an empty string or a
PATCH `delete_keys` entry clears the path. A PATCH omission preserves it; a SET
replaces the document. PATCH also accepts `secret_changes`, an array of
`{path: ["auth", "password"], value: "replacement"}` or
`{path: ["auth", "password"], clear: true}` operations. Only declared paths are
accepted; sibling non-secret fields remain intact. Presence objects are read
results and cannot be written back as credentials.

The server-only `component_service:get_secrets({component_id, access_mask?})`
returns `{success, component_id, secrets, context_revision}`. `secrets` contains
only declared string paths. It requires component access (READ by default) and
`component.secrets.read` on the exact binding id; ownership alone is insufficient.
No HTTP route or agent tool exposes this method. `component.get_secrets(request)`
provides the same contract to trusted Lua executions.

Trusted server execution uses `kickside.component.system:read_runtime_context`
with component access validation, or the existing trusted-system read through
`kickside.component.system:read_private_context`. Dispatch permission alone does
not authorize a credential read: the execution also needs `component.secrets.read`
on the exact owning binding id. Attach these grants to the owning runtime
functions, never member bundles. The explicit runtime library methods preserve the internal merged
view under these authorities.
`read_runtime_context` returns the merged context and its revision for a
compare-and-set write. `component.get_context_snapshot(id, access, true)` and
ordinary service context reads remain masked regardless of an execution's secret
authority.

The defaulted `encryption_key` requirement names `ENCRYPTION_KEY`. Only Component's
cipher functions receive its exact environment grant. Each worker derives its key
once; changing the variable takes effect after restart. Missing or malformed keys
produce `component_secrets_key`; authentication failures produce
`component_secrets_cannot_decrypt`. Non-secret reads remain available without a key.

On update, the existing retention sweep converts declared kinds in bounded
batches, with one transaction and batch update per selected kind window. Each row
records the digest of the secret paths it was converted under; changes to unrelated
registry entries do not make that row a candidate again. A changed secret-path set
makes older rows candidates for conversion. Windows use the existing implementation
and component-id index, rotate fairly across kinds and capture a finite upper bound.
Removing plaintext, writing ciphertext and recording the declaration revision commit
together without changing context revisions or timestamps. Interrupted conversion
resumes; malformed rows remain intact, are counted, and do not prevent the cursor
from advancing. Install Component's storage
capability first, then bindings' declarations and trusted runtime grants together.
Undeclared kinds retain their existing storage behavior until their declaration ships.

Backups containing encrypted credentials require the original installation key.
Changing a key does not rotate existing ciphertext. Older backups can still contain
plaintext credentials. Older module versions cannot use the credential presence
objects as credentials; downgrade requires a matching earlier backup and key.

Server-side consumers that require credential plaintext use `component.get_private_runtime_context(id)` or
`component.list_runtime_context(filter)`. Access-checked consumers use `component.get_runtime_context(id, component.ACCESS.READ)`
or `component.get_runtime_context_by_meta(meta, component.ACCESS.READ)`. These explicit reads call the existing Component service
entries and require their exact dispatch authority plus owning-kind secret authority. Ordinary
`get_private_context`, `list_system` and `open_private` reads stay in the caller's frame, return
masked migrated fields, and perform no credential-dispatch permission check. Non-secret rows
retain the existing JSON decode path without declaration lookup, environment access or decryption.

### Implementation deletion admission

A component kind may declare `meta.delete_admission`, naming a library import on
`kickside.component:delete_admission`. Its module wires that import declaratively
with an `ns.requirement` targeting `.imports.<alias>`, whose default is its
validator `library.lua`. Kinds without the declaration retain their behavior. Declaration lookup uses the
existing trusted kind reader after deletion is authorized.
The library exports `validate(payload) -> error?` (nil admits deletion).

`begin_delete` validates access and child policy, then calls the validator before
opening its delete transaction. The payload contains `component_id`, `impl_id`,
`child_policy` and `options`. The validator reads its implementation's configured
database and releases its connection; no cleanup or external side effect belongs
here. A typed error refuses admission before marking deletion or enrolling a job
and reaches both secured deletion and trusted owner deletion. Component rechecks
access and child policy under its existing placement lock before committing the
delete intent. Implementation admission is not atomic with concurrent writes;
opening an independent read before the transaction also supports colocated SQLite
storage, whose application connection is serialized by the runtime.
A declared but unwired or malformed validator fails closed. Already accepted
deletions resume their original intent without rerunning admission.

The seam runs only on deletion admission and reads committed implementation state.
It adds no locks or checks to implementation write paths; each
implementation documents any race with concurrent writes. The seam admits one
component at a time; a cascade can already have accepted parents or unrelated
siblings when a child refuses.
