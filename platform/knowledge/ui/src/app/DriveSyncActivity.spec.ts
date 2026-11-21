// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DriveSyncActivity from './DriveSyncActivity.vue'

const { get } = vi.hoisted(() => ({ get: vi.fn() }))
vi.mock('@wippy-fe/proxy', () => ({ api: { get }, on: vi.fn(), host: {} }))

function entry(id: string, state: string, reason?: string, indexing?: { status: 'pending' | 'indexed' | 'failed' | 'superseded'; reason?: string }) {
  return { item_key: `google:drive:${id}`, round_at: '2026-11-19T22:00:00Z', state, error: reason && { message: reason }, indexing }
}

describe('Drive sync activity', () => {
  it('shows retained terminal delivery reasons and omits a failure superseded by success', async () => {
    get.mockResolvedValue({ data: { success: true, entries: [
      entry('recovered', 'resolved'),
      entry('failed-file', 'dead', 'Drive file type cannot be exported for Knowledge'),
      entry('recovered', 'dead', 'Earlier temporary failure'),
    ] } })
    const wrapper = mount(DriveSyncActivity, {
      props: { sync: {
        id: 'sync', type: 'kickside.sync:sync', access_level: 8,
        drive_status: { delivery_failures: { count: 1 } },
      } },
    })
    const button = wrapper.findAll('button').find(row => row.text() === 'Show file activity')
    expect(button).toBeDefined()
    await button?.trigger('click')
    await flushPromises()
    expect(get).toHaveBeenCalledWith('/api/v1/automations/sync/history', { params: { kind: 'deliveries', page_size: 25 } })
    expect(wrapper.findAll('.kx-drive-failures li')).toHaveLength(2)
    const failedRow = wrapper.findAll('.kx-drive-failures li').find(row => row.text().includes('failed-file'))
    expect(failedRow?.text()).toContain('Drive file type cannot be exported for Knowledge')
    expect(failedRow?.find('a').attributes('href')).toBe('https://drive.google.com/open?id=failed-file')
    expect(wrapper.text()).not.toContain('Earlier temporary failure')
    wrapper.unmount()
  })

  it('keeps delivered separate from a failed Knowledge indexing result', async () => {
    get.mockResolvedValue({ data: { success: true, entries: [
      entry('utf8-file', 'resolved', undefined, { status: 'failed', reason: 'Indexing rejected malformed UTF-8' }),
    ] } })
    const wrapper = mount(DriveSyncActivity, {
      props: { sync: {
        id: 'sync', type: 'kickside.sync:sync', access_level: 8,
        drive_status: { delivery_failures: { count: 0 } },
      } },
    })
    await wrapper.findAll('button').find(row => row.text() === 'Show file activity')?.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Delivery: Delivered')
    expect(wrapper.text()).toContain('Indexing: Failed')
    expect(wrapper.text()).toContain('Indexing rejected malformed UTF-8')
    expect(wrapper.text()).not.toContain('failed file delivery')
    wrapper.unmount()
  })

  it('shows only the latest source revision when a later delivery supersedes a failed publication', async () => {
    get.mockResolvedValue({ data: { success: true, entries: [
      entry('same-file', 'resolved', undefined, { status: 'indexed' }),
      entry('same-file', 'resolved', undefined, { status: 'failed', reason: 'Older revision rejected' }),
    ] } })
    const wrapper = mount(DriveSyncActivity, {
      props: { sync: {
        id: 'sync', type: 'kickside.sync:sync', access_level: 8,
        drive_status: { delivery_failures: { count: 0 } },
      } },
    })
    await wrapper.findAll('button').find(row => row.text() === 'Show file activity')?.trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.kx-drive-failures li')).toHaveLength(1)
    expect(wrapper.text()).toContain('Indexing: Indexed')
    expect(wrapper.text()).not.toContain('Older revision rejected')
    wrapper.unmount()
  })
})
