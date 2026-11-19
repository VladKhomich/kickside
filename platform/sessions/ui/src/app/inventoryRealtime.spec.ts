// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import type { ArtifactSummary, Session } from '../types.ts'
import ArtifactsGallery from './ArtifactsGallery.vue'
import Sessions from './sessions.vue'

type Event = { topic: string; data: Record<string, unknown> }

const { listeners, api } = vi.hoisted(() => ({
  listeners: new Map<string, Set<(message: Event) => void>>(),
  api: {
    list: vi.fn(),
    session: vi.fn(),
    agentTitles: vi.fn(),
    providerBadges: vi.fn(),
    artifacts: vi.fn(),
    artifact: vi.fn(),
  },
}))

vi.mock('@wippy-fe/proxy', () => ({
  host: {},
  on(topic: string, callback: (message: Event) => void) {
    const callbacks = listeners.get(topic) ?? new Set()
    listeners.set(topic, callbacks)
    callbacks.add(callback)
    return () => callbacks.delete(callback)
  },
}))

vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { onMounted, ref } = await import('vue')
  return {
    useProps: () => ref({ mode: 'manager' }),
    useEvents: () => vi.fn(),
    useHostVisibilityRefresh: (load: () => Promise<void>) => {
      onMounted(load)
      return ref(true)
    },
  }
})

vi.mock('./useSessionsApi.ts', () => ({ useSessionsApi: () => api }))
vi.mock('@iconify/vue', () => ({ Icon: { render: () => null } }))

const Button = defineComponent({
  props: { label: String, disabled: Boolean, loading: Boolean },
  setup(props, { attrs }) {
    return () => h('button', { ...attrs, disabled: props.disabled || props.loading }, props.label)
  },
})

const options = { global: { stubs: { Button, MessagesDrawer: true } } }

function publish(topic: string, data: Record<string, unknown> = {}) {
  const parts = topic.split(':')
  for (const [subscription, callbacks] of listeners) {
    const pattern = subscription.split(':')
    if (pattern.length === parts.length && pattern.every((part, i) => part === '*' || part === parts[i])) {
      callbacks.forEach(callback => callback({ topic, data }))
    }
  }
}

function session(id: string, title: string): Session {
  return { session_id: id, title, current_agent: '', current_model: '', status: 'idle' }
}

function artifact(id: string, title: string, day: string): ArtifactSummary {
  return {
    uuid: id, artifact_id: id, session_id: 'session-a', title, kind: 'artifact', type: 'artifact',
    created_at: `2026-11-${day}T00:00:00Z`,
  }
}

async function applyUpdates() {
  await vi.runAllTimersAsync()
  await flushPromises()
}

enableAutoUnmount(afterEach)
beforeEach(() => {
  vi.resetAllMocks()
  listeners.clear()
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  api.list.mockResolvedValue({ sessions: [session('session-a', 'Existing session')], total: 1 })
  api.agentTitles.mockResolvedValue({})
  api.providerBadges.mockResolvedValue({})
})
afterEach(() => vi.useRealTimers())

describe('Sessions live updates', () => {
  it('patches the existing row, without reading lists or details for status bursts, chunks, and artifact hints', async () => {
    const wrapper = mount(Sessions, options)
    await flushPromises()
    const row = wrapper.get('.kx-row').element

    for (let i = 0; i < 5; i++) {
      publish('session:session-a', { type: 'update', status: 'running' })
      publish('session:session-a:message:response-a', { type: 'chunk', content: 'next token' })
      publish('session:session-a', { type: 'update', artifact_added: `artifact-${i}` })
    }
    publish('session:session-a', { type: 'update', title: 'Renamed session', status: 'idle' })
    await applyUpdates()

    expect(wrapper.get('.kx-row').element).toBe(row)
    expect(wrapper.get('.kx-row').text()).toContain('Renamed session')
    expect(api.list).toHaveBeenCalledTimes(1)
    expect(api.session).not.toHaveBeenCalled()
  })

  it('reads a newly opened session once when several events name it', async () => {
    api.session.mockResolvedValue(session('session-b', 'New session'))
    const wrapper = mount(Sessions, options)
    await flushPromises()

    publish('session.opened', { session_id: 'session-b' })
    publish('session:session-b', { type: 'update', status: 'running' })
    publish('session.opened', { session_id: 'session-b' })
    await applyUpdates()
    publish('session.opened', { session_id: 'session-b' })
    await applyUpdates()

    expect(wrapper.findAll('.kx-row').map(row => row.text())).toEqual([
      expect.stringContaining('Existing session'),
      expect.stringContaining('New session'),
    ])
    expect(api.session.mock.calls).toEqual([['session-b']])
    expect(api.list).toHaveBeenCalledTimes(1)
  })

  it('keeps an update that arrives while a reconnect snapshot is pending', async () => {
    const wrapper = mount(Sessions, options)
    await flushPromises()
    type Snapshot = { sessions: Session[]; total: number }
    let resolveSnapshot!: (value: Snapshot) => void
    const snapshot = new Promise<Snapshot>(resolve => { resolveSnapshot = resolve })
    api.list.mockReturnValueOnce(snapshot)

    publish('@reconnect')
    expect(api.list).toHaveBeenCalledTimes(2)
    publish('session:session-a', { type: 'update', title: 'Live title' })
    resolveSnapshot({ sessions: [session('session-a', 'Snapshot title')], total: 1 })
    await applyUpdates()

    expect(wrapper.get('.kx-row').text()).toContain('Live title')
    expect(api.list).toHaveBeenCalledTimes(2)
    expect(api.session).not.toHaveBeenCalled()
  })

  it('reads one inactive session on refresh and removes it on a tombstone', async () => {
    const wrapper = mount(Sessions, options)
    await flushPromises()
    api.session.mockResolvedValue(session('session-a', 'Renamed while inactive'))
    publish('session:session-a', { type: 'update', session_id: 'session-a', refresh: true })
    await applyUpdates()
    expect(wrapper.get('.kx-row').text()).toContain('Renamed while inactive')

    publish('session:session-a', { type: 'update', session_id: 'session-a', deleted: true })
    await applyUpdates()
    expect(wrapper.find('.kx-row').exists()).toBe(false)
    expect(api.session.mock.calls).toEqual([['session-a']])
    expect(api.list).toHaveBeenCalledTimes(1)
  })
})

describe('Artifacts live updates', () => {
  it('reads only the changed session catalog and keeps the global load-more cursor', async () => {
    const first = artifact('first', 'Existing artifact', '18')
    const newest = artifact('newest', 'New artifact', '19')
    const older = artifact('older', 'Older artifact', '17')
    const page = Array.from({ length: 47 }, (_, i) => artifact(`page-${i}`, `Artifact ${i}`, '18'))
    api.artifacts
      .mockResolvedValueOnce({ artifacts: [...page, first], hasMore: true, nextCursor: 'v1:first' })
      .mockResolvedValueOnce({ artifacts: [newest, first], hasMore: false, nextCursor: '' })
      .mockResolvedValueOnce({ artifacts: [older], hasMore: false, nextCursor: '' })
    const wrapper = mount(ArtifactsGallery, options)
    await flushPromises()
    const preview = wrapper.get('w-artifact[id="first"]').element

    for (let i = 0; i < 5; i++) {
      publish('session:session-a', { type: 'update', status: 'running' })
      publish('session:session-a:message:response-a', { type: 'chunk' })
      publish('session:session-a', { type: 'update', artifact_added: newest.uuid })
    }
    await applyUpdates()

    expect(api.artifacts.mock.calls).toEqual([
      [{ limit: 48, cursor: '' }],
      [{ sessionId: 'session-a', limit: 48, cursor: '' }],
    ])
    expect(wrapper.findAll('.kx-artifact-card')).toHaveLength(49)
    expect(wrapper.get('.kx-artifact-card strong').text()).toBe('New artifact')
    expect(wrapper.get('w-artifact[id="first"]').element).toBe(preview)

    await wrapper.get('.kx-more button').trigger('click')
    await flushPromises()

    expect(api.artifacts.mock.calls.at(-1)).toEqual([{ limit: 48, cursor: 'v1:first' }])
    const titles = wrapper.findAll('.kx-artifact-card strong').map(card => card.text())
    expect(titles).toHaveLength(50)
    expect(titles.at(-1)).toBe('Older artifact')
  })

  it('reads one edited artifact and preserves its preview element', async () => {
    const first = artifact('first', 'Original title', '18')
    api.artifacts.mockResolvedValue({ artifacts: [first], hasMore: false, nextCursor: '' })
    api.artifact.mockResolvedValue({ ...first, title: 'Edited title', preview: 'Searchable edit' })
    const wrapper = mount(ArtifactsGallery, options)
    await flushPromises()
    const preview = wrapper.get('w-artifact[id="first"]').element

    publish('artifact:first', { uuid: 'first', session_id: 'session-a', content_version: 2 })
    await applyUpdates()
    expect(wrapper.get('.kx-artifact-card strong').text()).toBe('Edited title')
    expect(wrapper.get('w-artifact[id="first"]').element).toBe(preview)
    await wrapper.get('input[type="search"]').setValue('Searchable edit')
    expect(wrapper.findAll('.kx-artifact-card')).toHaveLength(1)

    publish('artifact:first', { uuid: 'first', session_id: 'session-a', deleted: true })
    await applyUpdates()
    expect(wrapper.find('.kx-artifact-card').exists()).toBe(false)
    expect(api.artifact.mock.calls).toEqual([['first']])
    expect(api.artifacts).toHaveBeenCalledTimes(1)
  })
})
