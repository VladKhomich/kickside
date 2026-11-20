-- Jobs-owned retention cadence and retry state for the worker pool.
local logger = require("logger")
local time = require("time")

local schedule = {}

function schedule.new(dependencies: any): any
    local read_policy = dependencies.policy
    local sweep = dependencies.sweep
    local now = dependencies.now or time.now
    local log = dependencies.logger or logger
    local fallback_retry_ms = dependencies.fallback_retry_ms
    local deadline_ns: number? = now():unix_nano()
    local retry_count = 0
    local active_policy: any = nil
    local driver = {}
    local job_cursor: table? = nil
    local wake_scan_at = deadline_ns :: number
    -- nil starts a round. Keep an exhausted fence scan closed while other
    -- retention work still needs another pass.
    local completed_fence_cursor: table | boolean | nil = nil

    local function retry_delay_ms(policy: any): number
        retry_count = retry_count + 1
        if policy then
            return math.min(policy.slot_retry_after_ms * (2 ^ math.min(retry_count - 1, 20)),
                policy.slot_retry_max_delay_ms)
        end
        local fallback = fallback_retry_ms and fallback_retry_ms() or nil
        return tonumber(fallback) or 0
    end

    function driver.deadline(): number?
        return deadline_ns
    end

    function driver.run(now_ns: number): ()
        local policy, policy_err = read_policy()
        if policy_err or not policy then
            log:error("job_worker retention policy unavailable: " .. tostring(policy_err))
            deadline_ns = now_ns + retry_delay_ms(active_policy) * 1000000
            return
        end
        active_policy = policy

        local scan_wake = wake_scan_at <= now_ns
        local stats, sweep_err = sweep(job_cursor, completed_fence_cursor, scan_wake)
        if sweep_err then
            log:error("job_worker retention sweep failed: " .. tostring(sweep_err))
            deadline_ns = now_ns + retry_delay_ms(policy) * 1000000
            return
        end
        retry_count = 0
        job_cursor = stats.job_cursor
        completed_fence_cursor = stats.completed_fence_cursor or false
        local interval = policy.retention_interval_ms * 1000000
        local wake_full = scan_wake and stats.wake_rows >= policy.retention_batch
        -- Other retention lanes can drain immediately without rescanning idle
        -- wake keys. A full deletion page still gets another pass.
        if scan_wake and not wake_full then wake_scan_at = now_ns + interval end
        local full = job_cursor ~= nil or completed_fence_cursor ~= false
            or stats.jobs >= policy.retention_batch or stats.job_runs > 0
            or stats.workers >= policy.retention_batch or stats.worker_pulses >= policy.retention_batch
            or wake_full
            or stats.thread_cleanup_receipts >= policy.retention_batch
            or stats.thread_cleanup_fences >= policy.retention_batch
            or stats.thread_cleanup_leftovers > 0
        -- Each pass yields to the pool's dispatch and message handling before
        -- another bounded pass. The idle interval starts only after draining.
        if not full then completed_fence_cursor = nil end
        deadline_ns = full and now_ns or math.min(now_ns + interval, wake_scan_at)
    end

    return driver
end

return schedule
