// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import { defaultChatScreen, type ChatScreen } from '@widgets/chatAppearance'
import ChatEmptyState from './ChatEmptyState.vue'
import { sendFirstMessage } from './chatStart'

const mocks = vi.hoisted(() => ({
  load: vi.fn(),
  get: vi.fn(),
  send: vi.fn(),
  sendWithResponse: vi.fn(),
}))

vi.mock('./useSessionsApi', () => ({ useSessionsApi: () => ({ chatAgents: mocks.load }) }))
vi.mock('@widgets/chatIntroMarkdown', () => ({ renderChatIntro: () => '', followChatIntroLink: vi.fn() }))
vi.mock('@wippy-fe/proxy', () => ({
  api: { get: mocks.get },
  host: { navigate: vi.fn() },
  on: () => () => undefined,
  ws: { sendWithResponse: mocks.sendWithResponse },
}))
vi.mock('@iconify/vue', () => ({ Icon: { template: '<svg />' } }))
vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { onMounted, ref } = await import('vue')
  return {
    useProps: () => ref({ surface: 'sessions' }),
    useHostVisibilityRefresh: (load: () => void) => onMounted(load),
    useLayoutBus: () => ({ send: mocks.send, subscribe: () => () => undefined }),
  }
})

enableAutoUnmount(afterEach)
afterEach(() => vi.clearAllMocks())

const agent = { name: 'app:agent', title: 'Researcher', start_token: 'fixture-token' }
const groups = [{ title: 'Agents', agents: [agent] }]

async function renderScreen(screen: Partial<ChatScreen>) {
  mocks.load.mockResolvedValue({
    screen: { ...defaultChatScreen('sessions'), show_agent_picker: false, default_agent: agent.name, ...screen },
    groups,
  })
  const wrapper = mount(ChatEmptyState, { global: { plugins: [PrimeVue] } })
  await flushPromises()
  return wrapper
}

describe('empty chat start', () => {
  it('sends the first message through one directed start request', async () => {
    const wrapper = await renderScreen({})
    expect(mocks.load).toHaveBeenCalledWith('sessions')
    await wrapper.get('textarea').setValue('Look up this topic')
    const start = wrapper.get('button.kx-chat-start-submit')
    await start.trigger('click')
    await start.trigger('click')
    expect(mocks.send).toHaveBeenCalledTimes(1)
    expect(mocks.send).toHaveBeenCalledWith('@COORDINATOR/chat', 'kickside:chat-start-request', {
      id: expect.any(String), token: 'fixture-token', message: 'Look up this topic',
    })
  })

  it.each([true, false])('starts without a message when the empty field visibility is %s', async (show_message) => {
    const wrapper = await renderScreen({ show_message })
    expect(wrapper.find('textarea').exists()).toBe(show_message)
    await wrapper.get('button.kx-chat-start-submit').trigger('click')
    expect(mocks.send.mock.calls[0]?.[2].message).toBe('')
  })

  it('keeps Start Chat disabled if the hidden picker has no permitted default', async () => {
    const wrapper = await renderScreen({ default_agent: undefined })
    expect(wrapper.find('.kx-chat-start-agent').exists()).toBe(false)
    expect(wrapper.get('button.kx-chat-start-submit').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('The default agent is unavailable for your account.')
  })

  it('reads an empty Lua catalog and keeps the surface profile', async () => {
    const { useSessionsApi } = await vi.importActual<typeof import('./useSessionsApi')>('./useSessionsApi')
    const screen = { ...defaultChatScreen('sidebar'), show_agent_picker: false }
    mocks.get.mockResolvedValue({ data: { success: true, agents: {}, grouped: {}, chat_screen: screen } })
    await expect(useSessionsApi().chatAgents('sidebar')).resolves.toEqual({ groups: [], screen })
    expect(mocks.get).toHaveBeenCalledWith('/api/v1/agents/list?surface=sidebar')
  })

  it.each(['left', 'center', 'right'] as const)('applies %s alignment to custom Markdown', async (markdown_alignment) => {
    const wrapper = await renderScreen({ intro: 'markdown', markdown: 'Hello', markdown_alignment })
    expect(wrapper.get('.kx-chat-intro-markdown').attributes('data-alignment')).toBe(markdown_alignment)
  })

  it('uses left alignment when an older server omits the setting', async () => {
    const { useSessionsApi } = await vi.importActual<typeof import('./useSessionsApi')>('./useSessionsApi')
    mocks.get.mockResolvedValue({ data: { success: true, agents: [], chat_screen: { intro: 'markdown', markdown: 'Hello' } } })
    const { screen } = await useSessionsApi().chatAgents('sessions')
    expect(screen).toMatchObject({ intro: 'markdown', markdown: 'Hello', markdown_alignment: 'left' })
  })
})

describe('first message delivery', () => {
  it('accepts the Session receipt for the new session', async () => {
    mocks.sendWithResponse.mockResolvedValue({
      topic: 'session:new:message:persisted',
      data: { type: 'received' },
    })
    await expect(sendFirstMessage('new', 'Hello')).resolves.toBe('sent')
    expect(mocks.sendWithResponse).toHaveBeenCalledExactlyOnceWith({
      type: 'session_message', session_id: 'new', data: { text: 'Hello' },
    })
  })

  it('distinguishes an explicit rejection from a lost receipt without resending', async () => {
    mocks.sendWithResponse
      .mockResolvedValueOnce({ topic: 'error', data: { message: 'Input blocked' } })
      .mockRejectedValueOnce(new Error('Connection lost'))
    await expect(sendFirstMessage('new', 'Hello')).resolves.toBe('rejected')
    await expect(sendFirstMessage('new', 'Hello')).resolves.toBe('unconfirmed')
    expect(mocks.sendWithResponse).toHaveBeenCalledTimes(2)
  })
})
