# Workflows source

This package implements the optional visual Workflow definition, publish, and run lifecycle.
Its architecture and canonical vocabulary are documented in [`../README.md`](../README.md).

Workflow and Workflows are the product terms. Internal wire compatibility remains
`kickside.flow/v1`, `kind: "flow"`, `flow_ref`, `flow-id`, and `.flow.json`; these
identifiers must not be renamed or removed without an explicit versioned migration.

Reusable executable steps belong to the `kickside.block/v1` registry declaration contract.
Workflows consumes that contract; it does not define private node extension systems.

Block providers own their execution adapters and any configuration web components.
Workflows discovers those declarations at runtime and remains installable without any
particular provider.

## Run completion

`run_sink.config.completion = {component_id, token_fields}` selects a typed
`kickside.workflows:run_completion.complete` receiver with launch-principal WRITE
authority before reservation. The declaration participates in admission hashing;
the resolved scalar token (1–16 distinct names of 1–128 bytes, finite values,
4096 encoded bytes total) is private in the existing creation payload.

The existing terminal publisher appends its deduplicated audit event, delivers
completion under the stored identity with live authorization through a function
with no added policies, and clears `terminal_event_pending` only after
`{acknowledged: true}`. Every terminal status
is delivered at least once, including immediate failures and recovered runs.
Claim, audit append, and acknowledgement stay outside the receiver frame.
Error byte cuts preserve complete UTF-8 characters and trim only an incomplete
final sequence. Failures remain pending; an unfiltered point lookup proving
target deletion is
an acknowledged no-op. Receivers fence duplicates and validate domain token
fields. No new persistence, service, or reservation path is introduced. See the
module README for the exact callback envelope and deletion release prerequisite.
