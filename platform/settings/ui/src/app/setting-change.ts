// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { host } from '@wippy-fe/proxy'

export interface DestructiveSetting {
  value_type: string
  value: unknown
  // A numeric zero may select a finite window rather than mean zero days.
  confirm_decrease?: boolean | { zero: number }
}

// Wippy durations use Go's duration syntax: signed, compound decimal quantities
// in ns/us/µs/μs/ms/s/m/h. Compare quantities, never their display strings.
function duration(value: unknown): number {
  const text = String(value)
  if (/^[+-]?0$/.test(text)) return 0
  const sign = text.startsWith('-') ? -1 : 1
  const body = text.replace(/^[+-]/, '')
  const part = /(\d+(?:\.\d*)?|\.\d+)(ns|us|µs|μs|ms|s|m|h)/gy
  const units: Record<string, number> = { ns: 1e-9, us: 1e-6, µs: 1e-6, μs: 1e-6, ms: 1e-3, s: 1, m: 60, h: 3600 }
  let total = 0, end = 0, match: RegExpExecArray | null
  while ((match = part.exec(body))) {
    total += Number(match[1]) * units[match[2]]
    end = part.lastIndex
  }
  if (!end || end !== body.length || !Number.isFinite(total)) throw new Error('Invalid retention duration')
  return sign * total
}

export async function confirmSettingChange(s: DestructiveSetting, value: unknown, title: string, action: string): Promise<boolean> {
  if (!s.confirm_decrease) return true
  const window = (v: unknown) => {
    if (s.value_type === 'duration') return duration(v)
    const n = Number(v)
    if (s.value_type !== 'int' || !Number.isFinite(n)) throw new Error('Retention confirmation requires an integer or duration')
    return n === 0 && typeof s.confirm_decrease === 'object' ? s.confirm_decrease.zero : n
  }
  const before = window(s.value), after = window(value)
  if (after >= before) return true
  const display = (raw: unknown, effective: number) => s.value_type === 'int' && Number(raw) !== effective
    ? `${raw} (${effective} effective)` : String(raw)
  return host.confirm({
    header: `Reduce ${title}?`,
    message: `${title}: ${display(s.value, before)} → ${display(value, after)}. Existing data outside the shorter retention window may be permanently deleted. This cannot be undone.`,
    icon: 'tabler:alert-triangle', acceptLabel: action, rejectLabel: 'Cancel', acceptClass: 'p-button-danger',
  })
}
