# KickSide Core

Append-only thread/event engine for Wippy. Threads are immutable event logs;
projections derive views over them. Retention sweeps expired events, the lifecycle reaper tears down owned
subtrees, and thread notifications fan out changes. Core owns projection advancement and cursor state. The sibling
`kickside/jobs` module owns durable dispatch, leases, retries, and wake demand.

Access control is delegated entirely to the `kickside.component:component_service`
contract (group resolution included). Component writes use that contract;
provisioning reads existing component rows to reconcile declared kinds. The `threads` slice registers each thread as a component, gates every
read/write on the contract's access context, and removes the component on delete.

## Slices (`src/`)

| Slice | Responsibility |
|---|---|
| `threads` | Thread + event aggregate; implements the `kickside.core:threads` contract; access via the component contract. |
| `projections` | Derived views, cursors, catch-up, projection-worker execution (function + supervised process). |
| `retention` | Per-thread retention policy and sweeper. |
| `lifecycle` | Owner-delete cascade reaper. |

## Dependency interface

The host wires these `ns.requirement`s via `ns.dependency`:

- `target_db` — required SQL database for all `kickside_*` tables and
  all runtime persistence, routed through the module's injected `db_config`.
  Bind Core and Jobs to the same SQL database and schema. Thread appends and
  teardown pass the open Core transaction to Jobs.

Child slices declare their own required process-host, router, and security-scope
requirements where needed.

The `threads` slice additionally consumes the `kickside.component:component_service`
contract (the component module is a sibling dependency) for ownership, access, and
hierarchy.

## Projection worker attempts

The worker input carries the previous cursor diagnostic in `cursor.last_error`
when one exists. Supervised process workers also receive
`execution_deadline_ns`, the Unix nanosecond deadline enforced by Core.
The budget starts immediately before process spawn. A worker can stop before
that deadline and return the last sequence whose effects are complete as
`last_seq`.

## Unicode case folding

Import `kickside.core:casefold` and call `fold(s)` to build case-insensitive
keys or search text. It applies the Unicode 17.0.0 default full mappings
independently of Unicode normalization. Malformed UTF-8 returns `nil` and a
native `INVALID` error.

## Per-user provisioning

A declared user singleton created by `provision.ensure_user` or first-touch
singleton emission receives its own execution root, authorized by its owning
user, only in the user's own frame (no inherited identity, or an inherited
`authorized_by` equal to that user). A delegated frame retains its inherited root
and authorizer unchanged, so revoking the authorizer's live delegation still stops
deferred work. Provisioning derives the singleton key from the authenticated
actor; the private entry refuses caller-supplied keys. Ordinary first-touch
creation does not require permission to call that entry.
Core selects the owner identity through its private provisioning function; its
actor/scope construction capabilities are removed before registration and declared
callbacks. Callers need no general actor-creation grant. Credential and link
restrictions remain attached. The caller's frame and
ordinary component registration retain their existing identity semantics.
Provisioning is idempotent and does not replace existing singleton identities;
existing installations use the normal owner-authorized identity recovery.

## Module-owned retention

Each Core retention pass reads one page of up to 256 thread IDs in order,
checks their event heads, and shares the configured event deletion cap across
the page. It then runs receipt cleanup and owner hooks. An append wake on a
sparse installation still reads only one candidate page.

Boot recovery starts a rotation immediately. The service keeps the last
visited ID and the rotation's highest ID in memory. It schedules the next
page immediately until it reaches the endpoint. For a stable set of threads,
one rotation takes `ceil(threads / 256)` passes when the deletion and projection
budgets allow each page to finish. A pass that reaches a budget resumes from
its last processed thread ID, even if that thread has since been deleted.

Each page contributes the earliest eligibility time among the event heads it
visits. Core uses the inherited or per-thread retention window and skips heads
blocked by a pin or a non-invalid projection cursor. The candidate page samples
up to five cursors from each head's indexed thread range before checking their
sequences. If more cursors could protect a head, the service checks up to 256
additional cursor rows per pass and continues immediately while the check is
unfinished. PostgreSQL resumes at the thread's projection key and then at the
cursor key within that projection. It opens at most 16 projection ranges per
pass and releases the read connection before receipt and owner work. SQLite
resumes by row ID within the thread and status. The prune transaction rechecks
protections before deleting events. A PostgreSQL head dated `infinity` has no
age deadline, and one dated `-infinity` satisfies the age cutoff.

Background PostgreSQL event pruning commits each bounded delete and its prune
boundary atomically without waiting for a synchronous WAL flush. A database
crash can restore an unflushed batch. Core rechecks the recovered boundary on
startup and prunes any eligible events again. Appends, explicit per-thread
pruning and receipt cleanup use their configured commit mode.

At the end of a rotation, after owner hooks, Core reads the oldest committed
receipt using its index. It waits for the earliest of the observed event,
receipt or owner deadlines, or a change wake. Committed component lifecycle
appends wake retention even when the thread has no projections. A due head
can trigger an early follow-up rotation to discover its
successor after pruning. A change wake during a rotation also brings the next
rotation forward so changes to earlier IDs and newly created higher IDs are
seen before the service sleeps. Each new rotation starts at the first ID.

An installed module registers its maintenance function with
`meta.type: kickside.retention.owner`. Core invokes ready owners on recovery,
eligibility deadlines and change hints. Each owner retains its SQL, policy and
bounded batch, returning `{success = true, deleted = count}` with optional
`needs_continue`, `blocked` and `deadline_ms` fields.

A failed callback remains in `owner_failures`. If its native error is retryable,
Core schedules a retry in 30 seconds through the existing timer. A failed result
may supply `deadline_ms` between one second and one hour ahead instead. An invalid
retry deadline is reported alongside the original failure and arms no timer.
Permanent errors are reported without an automatic retry, even if they supply a
deadline. Failure retries never request an immediate continuation.

`deadline_ms` is the owner's earliest remaining eligibility time as a finite,
nonnegative integer of UTC Unix milliseconds that the runtime timer can represent.
Recompute the global owner deadline
on every invocation, including scoped hints; omit it when no owned rows need a
future wake. Core combines healthy owners' deadlines with its own next deadline
and uses the existing timer. Successful owners that omit the field keep their
existing behavior. Invalid deadlines are reported as owner failures without preventing
other owners from running. The field adds no registry scan or SQL query in Core.

Import `kickside.core.retention:notifier` and call its
`notify({kind = "owner_eligibility_changed"})` method after committing an
eligibility change. Grant the producer the existing
`kickside.core.retention:notify_access` policy; it needs no process messaging
authority. The notification lets a new earlier deadline rearm an idle sweeper;
a missing sweeper discovers durable work on its boot recovery pass.

## Testing

From the module root:

```sh
make test
```

The standalone application harness (`test/`) provisions an in-memory database,
a process host, a permissive scope, and the component module, then runs its
harness-owned suites. Suites also run against PostgreSQL by pointing
`target_db` at a `db.sql.postgres` resource.

## Projection failure and recovery

Once the slot's cursor is read, binding, stored-identity, worker and apply failures
are recorded on that cursor through the same fenced failure transition.
Deterministic failures invalidate the cursor and projection, preserve the error and failed run, and disable event
wakes until a corrected declaration is registered. Infrastructure failures keep
the cursor active with its error and use Jobs' existing slot retries. Lease loss
returns without publishing a projection failure; infrastructure errors publish
only while the attempt still owns the running slot's lease token.

Resume sends a control wake even when the cursor is already active, so an active
cursor with a disabled slot can recover without resetting or skipping events.
An already-active resume preserves the cursor generation and position. Invalid
cursors still require a corrected declaration through registration. Boot and
installation convergence also restore disabled active slots through bounded
keyset pages of the Jobs disabled-slot index, without changing cursor progress.
Paused and invalid cursors keep their existing state.

Thread deletion removes its own projection cursors and their blocked-input pins;
those local pins do not require a surviving consumer's deletion fence. The fence
pages raw pins before checking local cursor ownership by primary key, so pages
advance through local pins with bounded work.

## Declared projection convergence

After Core's migrations are current, lifecycle boot checks declared projections
on the component's primary thread or, for `on: lifecycle`, its lifecycle thread.
Child lifecycle projections attach when the child emits its lifecycle events.
A new lifecycle projection begins at the last pruned sequence and consumes the
remaining events. If its projection row still holds a fold, a replacement
cursor resumes at the later of the fold's checkpoint and the retention boundary.

Each pass examines up to 256 owners by indexed key range. Disabled Jobs slots
are restored in pages of up to 100. Boot resumes these pages between service
events. Each repair commits before convergence moves to another projection or
owner.

Boot and ordinary declaration attachment refuse drift against a stored cursor
with `projection_declaration_requires_registration`. Boot logs the code,
thread ID, projection address and cursor key as structured fields. Explicitly
re-register to resume at the committed sequence, activate the cursor and clear
its error. Request a reset to rebuild from a retained sequence. For a
per-component lifecycle thread, the existing registration control requires
ADMIN on the system lifecycle component or a framework maintenance actor.
