# kickside/workflows

Optional visual authoring, versioning, and execution of Block-based Flows.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add kickside/workflows
wippy install
```

Apply host bindings and migrations through the application install plan.
Review the manifest and registry requirements before enabling the module.
Host resources and security groups bind through the install plan.


Undo and redo history belongs to each workflow and is shared by its editors.
The definition writer commits each forward/inverse batch and its definition
events in one transaction. History retains the latest 50 edit batches across
module updates and process restarts; a new edit clears redo. Workflow access
gates history reads and edits, and workflow deletion removes its history.

## Requirements

For repository validation, use the Wippy release pinned in
[CI](https://github.com/kicksideai/kickside/blob/main/.github/workflows/ci.yml). Use current Hub dependencies
for the contracts declared by the module.
The standalone harness uses SQLite and declares a PostgreSQL test profile.
Frontend development also uses Node.js 22, npm, and Make.

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
Edit frontend source under `ui/` and run `make -C ../../ build MOD=workflows` from this directory;
commit regenerated tracked assets with the source.

## Use

Create a Workflow draft, add and connect Blocks, validate, and publish an immutable version. Launch or trigger that exact version and inspect its run history. A durable wait resumes under the run’s saved execution identity; the reviewer supplies a decision rather than becoming its executor.

For an Automation source, `POST /api/v1/workflows` and `WorkflowsManage`
`action=create` accept optional `source_context: {source, config, filter}`.
`source` is the source port ID; `config` selects its instance, including
`thread_id` when required; `filter` uses the trigger's `{expr}` shape.
The server resolves the source's declared item schema through Automation and
creates Start and Finish, with Start's `input_schema` set to that schema.
Schemas inside `source_context` are rejected; a top-level client `input_schema`
does not override the source contract. Creation without source context retains
its existing behavior.

Read the selected source with `AutomationsRead action=catalog_entry`,
`direction=source`, `id=<source port>`, and `config`. Create the Workflow with
that context, read its draft before adding steps, build and publish it, then
install Data Sync with the same trigger and the Run Workflow sink's exact
`flow_ref: {kind: flow, id, version}`. Agents, MCP, and the UI use these same
contracts. The destination picker offers **New workflow** for the selected
source and returns to setup after publication with its binding selected.

The `kickside.workflows:run_sink` configuration can optionally select terminal
correlation from the admitted Start input:

```yaml
flow_ref: {kind: flow, id: <workflow UUID>, version: 1}
correlation_fields: [board_id, item, visit, attempt]
```

`correlation_fields` is a dense array of 1–16 distinct top-level field names,
each 1–128 bytes. Invalid or oversized selections return `invalid_config` at
the sink boundary before access or admission. Each selected input value must
be present and be a string, finite number, or boolean; missing, composite, or
oversized values return `invalid_request` before reservation. The complete
encoded correlation record is limited to 4096 JSON bytes. Selection happens
once when the run is reserved and is saved in its existing durable creation
payload. Changing a selection for the same delivery conflicts with its
admission identity. No selection preserves the existing behavior.

Terminal events carry this record unchanged as optional `body.correlation`,
alongside authoritative `body.run_id` and `body.status`. Success uses status
`completed` on `kickside.workflows.runs.events:finished` through
`kickside.workflows:flow_run_finished`; `failed`, `cancelled`, and `terminated`
use `kickside.workflows.runs.events:failed` through
`kickside.workflows:flow_run_failed`. This includes failure before the first
node executes and recovered or repeated publication after a crash. The event
contains only the selected values; the complete Start input is never copied
into the terminal event. `flow_run_started` retains its existing event shape.

The run sink also accepts optional private completion configuration:

```yaml
completion:
  component_id: <target component UUID>
  token_fields: [board_id, item, visit, attempt]
```

The target binding must implement `kickside.workflows:run_completion.complete`.
Workflows checks the launch principal's WRITE access and target capability before
reservation. Only `component_id` and `token_fields` are accepted. Token selection
uses the correlation limits above, independently of `correlation_fields`, and is
included in admission identity. The resolved target and immutable token stay in
the existing private creation payload, outside engine metadata and audit events.
The receiver owns domain validation of its token (for Work: board/item UUIDs and
positive integer visit/attempt).

For every terminal status (`completed`, `failed`, `cancelled`, `terminated`), the
existing publisher appends the deduplicated audit event, calls `complete` under
the stored run identity with live authorization in a function with no added
maintenance policies, and then clears the existing publication flag. The callback
receives `token`, authoritative `run_id`,
`dataflow_id`, exact `flow_ref`, `status`, optional `started_at`, `ended_at`, and
an error bounded to 4096 encoded JSON bytes for non-success outcomes. It never
receives full Start input, progress, or outputs; outputs continue through report.
Claim, append, and acknowledgement bookkeeping stay outside the callback frame.
Complete UTF-8 error characters are preserved; byte cuts discard only an
incomplete final sequence. The receiver returns `{acknowledged: true}` or a typed
native error.

Completion is one logical outcome delivered at least once. Receivers must fence
repeated tokens, including a crash after their commit but before acknowledgement.
Any callback or authorization failure remains pending for existing maintenance
retry until repaired. Only an unfiltered point lookup proving target deletion
acknowledges a no-op; a denied or unavailable lookup remains pending. Idle Flow
references are not deletion pins. Deletion protection for unpublished terminal
rows is a release prerequisite (PR #512); the concurrent admission/delete race
remains known. Callers omitting completion retain their existing behavior.

Binding assist accepts optional `source_root` to lower its expression for the
consumer's environment, such as `payload` for Data Sync. Omitting it preserves
the Workflow authoring expression contract.

## Reference

- [Module reference](src/README.md)

### Agent tools

Tool names link to their input/output schemas. Capabilities and the caller’s
resource access determine which tools are available.

| Tool | Selection and paging inputs |
| --- | --- |
| [`RunFlow`](src/agent/_index.yaml) | See the operation schema |
| [`WorkflowsRead`](src/agent/_index.yaml) | `limit`, `offset` |
| [`WorkflowsManage`](src/agent/_index.yaml) | See the operation schema |

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan. Existing explicit bindings take precedence over defaults.

| Requirement | Declared default |
| --- | --- |
| [`kickside.workflows:target_db`](src/_index.yaml) | Host supplies the value |
| [`kickside.workflows:api_router`](src/_index.yaml) | Host supplies the value |
| [`kickside.workflows:ui_server`](src/_index.yaml) | Host supplies the value |
| [`kickside.workflows:process_host`](src/_index.yaml) | Host supplies the value |
| [`kickside.workflows.security:user_security_scope`](src/security/_index.yaml) | `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/kickside/workflows)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.

Synchronous execution results and run detail responses expose optional `error_details` from Dataflow alongside the existing error message. Run detail reads these diagnostics from its existing engine snapshot and applies the same secret redaction. Stored run rows and routed Error output shapes remain unchanged.

## Retry policies and execution timeouts

Function Blocks accept optional `execution.retry_policy`,
`execution.start_to_close_timeout`, and `execution.schedule_to_close_timeout`.
Agent and wait executions reject these fields. Dataflow's shared retry library owns
validation and execution; without a policy a function makes one attempt.

```lua
execution = {
    kind = "function", function_id = "example:run",
    retry_policy = {
        initial_interval = "1s", backoff_coefficient = 2,
        maximum_interval = "30s", maximum_attempts = 3,
        non_retryable_error_types = { "Invalid" },
    },
    start_to_close_timeout = "10s",
    schedule_to_close_timeout = "2m",
}
```

Durations accept positive duration strings or milliseconds. With a policy, omitted
values default to a 1s initial interval, coefficient 2, a maximum interval 100 times
the initial interval, three attempts (including the first attempt), and no excluded
error kinds. Cancellation and errors explicitly
marked non-retryable stop retries. The per-attempt timeout limits each call; the
total window includes attempts and backoff. An explicit `maximum_attempts = 0`
removes the count limit only when a positive `schedule_to_close_timeout` bounds the
overall retry window.

Opting into retries can repeat external side effects after a lost response or
interrupted call. Retry-enabled function context includes `attempt` and a stable
`idempotency_key`; functions that write externally should use that key to deduplicate
repeated attempts. Calls without a retry policy retain their existing context.

A canvas `block` node carries these three optional fields at the top level, beside
`ref` and `config`. They never enter the Block's `config_schema`. Function and tool
steps support them; agent, wait, and structural steps reject retry configuration.
`node.add` and `node.update` carry the fields through WorkflowsManage and the HTTP
command API. In commands, `false` clears an override and restores the Block default;
omitting a field retains its current value. The stored document omits cleared fields.

The inspector's Retries section shows the Block defaults and lets authors override
or reset the policy and each timeout separately. Invalid policies refuse publication
with Dataflow's validation message attached to the node. Publication freezes the
policy and timeouts into the native commands; each run retains those values when
it assigns fresh node ids. Existing published versions remain unchanged. An
idempotent forward migration adds optional draft-node storage without rewriting
existing definitions, publications, events, or runs.

### Deleting a Workflow with runs

Deletion returns HTTP 409 (`kind: Conflict`, `details.code: workflow_runs_active`,
`retryable: false`) while any run is pending or running, or a terminal run's event
has not been acknowledged as published. The Workflow, its Automations and runs
remain intact; work stages and Inbox decisions continue normally. Delete again
after runs finish and their terminal events are acknowledged.

Migration `08_delete_admission_index` adds one partial index on `(workflow_id, run_id)`
containing only pending/running runs and runs with unpublished terminal events.
Apply this migration in a maintenance window: PostgreSQL briefly blocks run writes while the index builds (measured on test-2 at 0.057 s for 100,000 retained runs plus 1,000 active runs and 0.349 s for 1,000,000 retained runs plus 10,000 active runs; build plus commit took 0.060 s and 0.544 s respectively), and holds the lock until migration commit; allow extra time for lock waits and larger installations.
The delete-time existence check orders by `run_id` and stops at the first
matching index entry, so it does not scan retained, acknowledged terminal history
before Component opens its delete transaction.

This rule is enforced at Component deletion admission, including direct Component
and trusted owner deletion, reading Workflows' configured database even when
Component uses a separate database. Run admission keeps its existing behavior: a run
starting at the same instant as deletion may pass the check before its reservation
is visible. This rare race retains today's deletion behavior; admission and
deletion are not serialized against each other.

The separate-database regression uses fresh databases and the existing test profile:
`cd test && wippy test --config .wippy.yaml --config .split-db.yaml test app:delete_admission_storage_test`
(add `--profile postgres` and dedicated `pg_database` / `pg_upgrade_database` values for PostgreSQL).
