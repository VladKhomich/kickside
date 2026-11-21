local sql = require("sql")
local time = require("time")
local job_types = require("job_types")
local M: any = {WORKER_FAILED = "worker_failed"}
M.is_lease_lost_error = job_types.is_lease_lost_error
function M.reset(stage: string, source: any)
    M.stage, M.source, M.release_source, M.rollback_source = stage, source, nil, nil
    M.record_failure = false
    M.proof, M.missing = nil, false
    M.releases, M.rollbacks, M.commits, M.calls, M.advances = 0, 0, 0, 0, 0
    M.failures, M.deterministic = 0, nil
    M.previous_error, M.forwarded_error = nil, nil
    M.dialect_reads = 0
    M.owned = stage:sub(1, 6) == "owned_"
    M.admissions, M.owned_checks = 0, 0
    M.debounce = stage == "first" or stage == "latest" or stage == "type" or stage == "begin"
        or stage == "complete" or stage == "commit" or stage == "time"
    M.proc = stage == "process_host" or stage == "proc"
end
function M.outcome(stage: string, value: any): (any, error?)
    if M.stage == stage then
        if M.missing then return M.proof, nil end
        return nil, M.source
    end
    return value, nil
end
function M.parse_time(layout: string, raw: string): (any, error?)
    if M.stage == "time" then return M.outcome("time", nil) end
    return time.parse(layout, raw)
end
function M.id(): string return "app:db" end
function M.policy(): (any, error?) return M.outcome("policy", {apply_batch_size = 10}) end
function M.get(_id: any): (any, error?) return M.outcome("get", M.database()) end
function M.decode(_raw: any): (any, error?) return M.outcome("decode", {meta = {worker_ref = "func://app:worker"}}) end
function M.from_row(_actor: any, _raw: any): (any, error?) return M.outcome("identity", {}) end
function M.parse(_ref: any, _system: any): (any, error?) return M.outcome("parse", {}) end
function M.validate(_parsed: any, _system: any): (any, error?)
    return M.outcome("validate", {worker_runtime = M.proc and "proc" or "func", target_id = "app:worker",
        component_owned = M.owned})
end
function M.requires_checkpoint_declaration(_err: any): boolean return false end
function M.requires_owned_declaration(_err: any): boolean return false end
function M.core_lifecycle(...: any): boolean return false end
function M.snapshot(): (any, error?)
    return {version = function(): any return {id = function(): string return "registry-revision" end} end}, nil
end
function M.current_version(): (any, error?)
    return {id = function(): string
        return M.stage == "owned_before_dispatch" and M.admissions == 1 and "changed-revision" or "registry-revision"
    end}, nil
end
function M.check(...: any): (boolean?, error?)
    M.owned_checks = M.owned_checks + 1
    if M.stage == "owned_replaced" and M.owned_checks == 2 then
        return nil, errors.new({kind = errors.PERMISSION_DENIED, message = "installed declaration no longer matches"})
    end
    return true, nil
end
function M.frame(row: any): (any, any, error?)
    return {}, {component_id = row.component_id, generation = row.component_identity_generation}, nil
end
local function rollover(): error
    return errors.new({kind = errors.CONFLICT, retryable = true, message = "projection declaration changed before dispatch"})
end
function M.admit_owned(_binding: any, _system: any, _revision: any): (any, error?, boolean?)
    M.admissions = M.admissions + 1
    if M.stage == "owned_churn" or (M.admissions == 1 and (M.stage == "owned_admission" or M.stage == "owned_replaced")) then
        return nil, rollover(), true
    end
    return {worker_runtime = "func", target_id = "app:worker", component_owned = true}, nil
end
function M.post_commit_binding(_binding: any): (any, error?)
    return M.outcome("post_binding", (M.stage == "post_run" or M.stage == "stale_callback" or M.stage == "next_claim") and {} or nil)
end
function M.query_event_rows(...: any): (any, error?) return M.outcome("events", {{seq = 1}}) end
function M.common(_batch: any): any return nil end
function M.run(_binding: any, input: any, before_dispatch: (() -> error?)?): (any, error?, boolean?)
    if M.stage == "owned_worker_validation" and M.admissions == 1 then return nil, rollover(), true end
    local fence_err = before_dispatch and before_dispatch()
    if fence_err then return nil, fence_err end
    M.calls = M.calls + 1
    if M.stage == "owned_worker_conflict" then return nil, rollover() end
    M.forwarded_error = input.cursor.last_error
    if M.stage == "failure" then return nil, errors.new({kind = errors.INVALID, message = "worker refusal",
        retryable = false, details = {reason = "worker_failed", code = "worker_refusal"}}) end
    return M.outcome(M.calls == 2 and "post_run" or "run", {})
end
function M.run_proc_supervised(...: any): (any, error?) return M.outcome("proc", {}) end
function M.process_host(): (any, error?) return M.outcome("process_host", "app:host") end
function M.is_deterministic_kind(kind: any): boolean
    return kind == errors.INVALID or kind == errors.PERMISSION_DENIED
        or kind == errors.NOT_FOUND or kind == errors.ALREADY_EXISTS
end
function M.fail(_db: any, _job: any, _snapshot: any, _failure: any, deterministic: boolean): (any, error?)
    M.failures, M.deterministic = M.failures + 1, deterministic
    if M.record_failure then return deterministic and {self_completed = true, invalid = true} or nil, nil end
    return M.outcome("failure", nil)
end
function M.advance(...: any): (any, error?)
    M.empty_scan = select(6, ...)
    M.advances = M.advances + 1
    return M.outcome("advance", {last_seq = 1})
end
function M.format(_due: any, _dialect: any): string return "2099-01-01T00:00:00Z" end
function M.complete_tx(...: any): (any, error?) return M.outcome("complete", {}) end
function M.database(): any
    return {
        query = function(_self: any, statement: string, _args: any): (any, error?)
            if statement:find("ORDER BY seq ASC", 1, true) then
                return M.outcome("first", {{created_at = "2099-01-01T00:00:00Z"}})
            elseif statement:find("ORDER BY seq DESC", 1, true) then
                return M.outcome("latest", {{created_at = "2099-01-01T00:00:00Z"}})
            end
            local row: any = {id = "cursor", job_id = "job", projection_id = "projection", thread_id = "thread",
                body = "body", status = "active", event_count = 1, last_seq = M.advances > 0 and 1 or 0,
                generation = M.stage == "stale_callback" and M.advances > 0 and 2 or 1,
                thread_incarnation = "test-thread",
                slot_execution_seq = M.stage == "next_claim" and M.advances > 0 and 2 or 1,
                debounce_idle_ms = M.debounce and 1000 or 0, debounce_max_ms = 10000}
            if statement:find("k.last_error", 1, true) then row.last_error = M.previous_error end
            if M.stage == "identity" then row.actor_id, row.execution_identity_json = "actor", "identity" end
            if M.owned then
                row.component_id, row.component_impl_id, row.component_incarnation = "thread", "app:component", "component"
                row.component_owned_candidate, row.component_identity_generation = 1, 1
            end
            if M.stage == "position" then row.last_seq = nil end
            return M.outcome("snapshot", {row})
        end,
        type = function(_self: any): (any, error?)
            M.dialect_reads = (M.dialect_reads or 0) + 1
            if M.dialect_reads == 2 then return M.outcome("type", sql.type.SQLITE) end
            return sql.type.SQLITE, nil
        end,
        release = function(_self: any): (any, error?)
            M.releases = M.releases + 1
            if M.release_source then return nil, M.release_source end
            return M.outcome("release", true)
        end,
        begin = function(_self: any): (any, error?) return M.outcome("begin", M.transaction()) end,
    }
end
function M.transaction(): any
    return {
        rollback = function(_self: any): (any, error?)
            M.rollbacks = M.rollbacks + 1
            return true, M.rollback_source
        end,
        commit = function(_self: any): (any, error?)
            M.commits = M.commits + 1
            return M.outcome("commit", true)
        end,
    }
end
return M
