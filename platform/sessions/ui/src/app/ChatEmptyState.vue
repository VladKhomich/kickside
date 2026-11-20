<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh, useLayoutBus, useProps } from '@wippy-fe/webcomponent-vue'
import { defaultChatScreen, type ChatSurface } from '@widgets/chatAppearance'
import { followChatIntroLink, renderChatIntro } from '@widgets/chatIntroMarkdown'
import type { ChatAgent, ChatAgentGroup } from '../types.ts'
import { isRecord } from './hostRoute.ts'
import type { LayoutEvent } from './hostRoute.ts'
import { useSessionsApi } from './useSessionsApi.ts'
import { CHAT_START_COORDINATOR, CHAT_START_REQUEST, CHAT_START_RESULT, CHAT_START_STATE } from './chatStart.ts'

const api = useSessionsApi()
const bus = useLayoutBus()
const props = useProps<{ surface?: ChatSurface }>()
const surface = computed(() => props.value?.surface === 'sessions' ? 'sessions' : 'sidebar')
const screen = ref(defaultChatScreen(surface.value))
const introHtml = computed(() => screen.value.intro === 'markdown' ? renderChatIntro(screen.value.markdown) : '')
const message = ref('')
const groups = ref<ChatAgentGroup[]>([])
const selectedId = ref('')
const loading = ref(true)
const error = ref('')
const open = ref(false)
const query = ref('')
/**
 * A start is in flight. Both controls stay locked until the chat coordinator
 * reports that the start finished, was cancelled, or failed, or this element is
 * removed, which the drawer does once a session exists.
 */
const pendingId = ref('')
const coordinatorBusy = ref(false)
const completed = ref(false)
const starting = computed(() => Boolean(pendingId.value) || coordinatorBusy.value || completed.value)
const startError = ref('')
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
let requestSequence = 0
let replyTimer: ReturnType<typeof setTimeout> | undefined
const stops: (() => void)[] = []

const selected = computed(() => groups.value
  .flatMap(group => group.agents)
  .find(agent => agent.name === (screen.value.show_agent_picker ? selectedId.value : screen.value.default_agent)))
const canStart = computed(() => !!selected.value && !loading.value && !error.value && !starting.value)

const hasAgents = computed(() => groups.value.length > 0)

const visibleGroups = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return groups.value
  return groups.value
    .map(group => ({
      title: group.title,
      agents: group.agents.filter(agent =>
        agent.title.toLowerCase().includes(needle) || (agent.comment || '').toLowerCase().includes(needle)),
    }))
    .filter(group => group.agents.length > 0)
})

async function load() {
  const sequence = ++requestSequence
  loading.value = true
  error.value = ''
  try {
    const result = await api.chatAgents(surface.value)
    if (sequence === requestSequence) {
      groups.value = result.groups
      screen.value = result.screen
      if (!result.screen.show_agent_picker) closeMenu()
      if (!result.groups.some(group => group.agents.some(agent => agent.name === selectedId.value))) selectedId.value = ''
    }
  } catch (cause) {
    if (sequence === requestSequence) error.value = (cause as Error).message || 'Could not load agents'
  } finally {
    if (sequence === requestSequence) loading.value = false
  }
}

function toggleMenu() {
  if (starting.value || !hasAgents.value) return
  if (open.value) closeMenu()
  else open.value = true
}

function closeMenu(returnFocus = false) {
  if (!open.value) return
  open.value = false
  query.value = ''
  if (returnFocus) void nextTick(() => trigger.value?.focus())
}

function choose(agent: ChatAgent) {
  selectedId.value = agent.name
  closeMenu(true)
}

function startChat() {
  const token = selected.value?.start_token
  if (!canStart.value || !token) return
  const id = crypto.getRandomValues(new Uint32Array(4)).join('-')
  pendingId.value = id
  startError.value = ''
  closeMenu()
  replyTimer = setTimeout(() => {
    if (pendingId.value !== id) return
    pendingId.value = ''
    startError.value = 'Chat did not respond. Please try again.'
  }, 5000)
  const payload = { id, token, message: screen.value.show_message ? message.value : '' }
  if (bus) bus.send(CHAT_START_COORDINATOR, CHAT_START_REQUEST, payload)
  else host.layout.send(CHAT_START_COORDINATOR, CHAT_START_REQUEST, payload)
}

function onLayoutEvent(event: LayoutEvent) {
  if (event.sourcePanelId !== CHAT_START_COORDINATOR || !isRecord(event.payload)) return
  if (event.channel === CHAT_START_STATE) coordinatorBusy.value = event.payload.pending === true
  if (event.channel !== CHAT_START_RESULT || event.payload.id !== pendingId.value) return
  clearTimeout(replyTimer)
  if (event.payload.state === 'accepted') return
  pendingId.value = ''
  if (event.payload.state === 'finished') {
    completed.value = true
    message.value = ''
  }
  if (typeof event.payload.error === 'string') startError.value = event.payload.error
}

// A press outside the menu closes it. `composedPath` because a press inside
// this shadow root is retargeted to the host element at the document.
function onDocumentPointerDown(event: Event) {
  if (open.value && root.value && !event.composedPath().includes(root.value)) closeMenu()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    closeMenu(true)
  }
}

watch(open, (isOpen) => {
  if (isOpen) void nextTick(() => root.value?.querySelector<HTMLInputElement>('#chat-start-search')?.focus())
})

// Runs the first load, and again when the drawer is revealed after being hidden.
useHostVisibilityRefresh(load)
onMounted(() => {
  if (bus) stops.push(bus.subscribe(onLayoutEvent))
  else {
    stops.push(host.layout.on(CHAT_START_STATE, onLayoutEvent), host.layout.on(CHAT_START_RESULT, onLayoutEvent))
  }
  stops.push(on('nav.changed', () => { void load() }), on('welcome', () => { void load() }))
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
})
onBeforeUnmount(() => {
  requestSequence++
  clearTimeout(replyTimer)
  stops.forEach(stop => stop())
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <section ref="root" class="kx-chat-start" :class="{ 'kx-chat-start--sessions': surface === 'sessions' }" aria-label="Start a chat" @keydown="onKeydown">
    <div class="kx-chat-start-body">
      <div v-if="screen.intro === 'default'" class="kx-chat-start-intro">
        <h2 v-if="surface === 'sessions'" class="kx-chat-start-title">What can I help you with?</h2>
        <template v-else>
          <span class="kx-chat-start-icon"><Icon icon="tabler:message-circle" aria-hidden="true" /></span>
          <h2 class="kx-chat-start-title">Start a chat</h2>
          <p class="kx-chat-start-text">You can also open a previous session above.</p>
        </template>
      </div>
      <div
        v-else-if="screen.intro === 'markdown'"
        class="kx-chat-start-intro kx-chat-intro-markdown"
        :data-alignment="screen.markdown_alignment"
        v-html="introHtml"
        @click="followChatIntroLink($event, host.navigate)"
      />
      <div class="kx-chat-start-compose">
        <label v-if="screen.show_message" class="kx-chat-start-field">
          <span>Message <span class="kx-chat-start-optional">(optional)</span></span>
          <Textarea
            v-model="message"
            placeholder="Type a message…"
            :readonly="!!pendingId"
            rows="3"
            fluid
          />
        </label>
        <div class="kx-chat-start-controls">
          <div v-if="screen.show_agent_picker" class="kx-chat-start-agent">
            <button
              ref="trigger"
              type="button"
              class="kx-btn kx-btn-ghost kx-chat-start-picker"
              aria-controls="chat-start-agents"
              :aria-expanded="open"
              :disabled="loading || starting || !hasAgents"
              @click="toggleMenu"
            >
              <Icon :icon="selected?.icon || 'wippy:agent'" aria-hidden="true" />
              <span>{{ selected ? selected.title : 'Select agent' }}</span>
              <Icon icon="tabler:chevron-down" aria-hidden="true" />
            </button>
            <div v-if="open" id="chat-start-agents" class="kx-chat-start-menu">
              <div class="kx-chat-start-search">
                <label class="sr-only" for="chat-start-search">Search agents</label>
                <InputText
                  id="chat-start-search"
                  v-model="query"
                  type="search"
                  placeholder="Search agents…"
                  autocomplete="off"
                  fluid
                />
              </div>
              <div class="kx-chat-start-list">
                <template v-for="group in visibleGroups" :key="group.title">
                  <div v-if="group.title" class="kx-chat-start-group">{{ group.title }}</div>
                  <button
                    v-for="agent in group.agents"
                    :key="`${group.title}:${agent.name}`"
                    type="button"
                    class="kx-chat-start-item"
                    :aria-current="selected?.name === agent.name ? 'true' : undefined"
                    @click="choose(agent)"
                  >
                    <span class="kx-chat-start-item-title">
                      <Icon :icon="agent.icon || 'wippy:agent'" aria-hidden="true" />
                      <span>{{ agent.title || agent.name }}</span>
                    </span>
                    <span v-if="agent.comment" class="kx-chat-start-item-comment">{{ agent.comment }}</span>
                  </button>
                </template>
                <p v-if="visibleGroups.length === 0" class="kx-chat-start-empty">No agents match.</p>
              </div>
            </div>
          </div>
          <div v-else-if="selected" class="kx-chat-start-default">
            <Icon :icon="selected.icon || 'wippy:agent'" aria-hidden="true" />
            <span>{{ selected.title || selected.name }}</span>
          </div>
          <button type="button" class="kx-btn kx-btn-primary kx-chat-start-submit" :disabled="!canStart" @click="startChat">
            <Icon v-if="starting" icon="tabler:loader-2" class="spin" aria-hidden="true" />
            <span>Start chat</span>
          </button>
        </div>
      </div>
      <p v-if="error" class="kx-chat-start-note is-error" role="alert">
        {{ error }}
        <button type="button" class="kx-chat-start-retry" @click="load">Retry</button>
      </p>
      <p v-else-if="loading" class="kx-chat-start-note" role="status">Loading agents…</p>
      <p v-else-if="!screen.show_agent_picker && !selected" class="kx-chat-start-note" role="status">
        The default agent is unavailable for your account.
      </p>
      <p v-else-if="!hasAgents" class="kx-chat-start-note" role="status">
        <Icon icon="tabler:alert-circle" aria-hidden="true" />
        No agents available. Please contact your administrator.
      </p>
      <p v-if="startError" class="kx-chat-start-note is-error" role="alert">{{ startError }}</p>
    </div>
  </section>
</template>
