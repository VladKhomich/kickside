// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api, define, loadByTagName, on, ws } from '@wippy-fe/proxy'

const INTENT_CHANNEL = '@HOST/intent'
const CHAT_TAG = 'kickside-chat-coordinator'
const PICKER_TAG = 'kickside-chat-empty-state'
const ARTIFACT_TAG = 'kickside-artifact-coordinator'

function isChatIntent({ channel, payload }) {
  return channel === INTENT_CHANNEL && (payload?.intent === 'startChat' || payload?.intent === 'openSession')
}

function artifactBus(bus) {
  return {
    ...bus,
    // Older Sessions coordinators relay every chat intent to the main frame.
    // The app-owned chat coordinator is already the owner on this layout.
    subscribe: (handler, channel) => bus.subscribe(event => {
      if (!isChatIntent(event)) handler(event)
    }, channel),
  }
}

/** @returns {Promise<{kind: 'drawer'} | {kind: 'drawer-unavailable'}>} */
async function drawerAvailability() {
  try {
    if (![CHAT_TAG, PICKER_TAG].every(tag => customElements.get(tag))) {
      const { data } = await api.get('/api/v1/views/components/list', { params: { auto_register: true } })
      const registered = new Set(data?.components?.map(component => component.wippy?.tagName))
      if (![CHAT_TAG, PICKER_TAG].every(tag => registered.has(tag)))
        return { kind: 'drawer-unavailable' }
      await Promise.all([loadByTagName(CHAT_TAG), loadByTagName(PICKER_TAG)])
    }
    return { kind: 'drawer' }
  } catch {
    return { kind: 'drawer-unavailable' }
  }
}

function waitForWelcome(signal) {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const off = on('welcome', () => {
      off()
      signal.removeEventListener('abort', abort)
      resolve()
    })
    function abort() {
      off()
      reject(signal.reason)
    }
    signal.addEventListener('abort', abort, { once: true })
  })
}

export class KicksideManagedCoordinator extends HTMLElement {
  #mount
  #unsubscribe
  #request = 0
  #start

  connectedCallback() {
    const mount = {}
    this.#mount = mount
    void this.#connect(mount).catch(error => {
      if (this.#mount === mount) console.error('[kickside-managed-coordinator] could not mount', error)
    })
  }

  disconnectedCallback() {
    this.#mount = undefined
    this.#start?.abort()
    this.#unsubscribe?.()
    this.#unsubscribe = undefined
    this.replaceChildren()
  }

  async #connect(mount) {
    const bus = this.__wippyHostBus
    const host = this.__wippyHost
    if (!bus || !host) return

    if (this.getAttribute('component') === 'artifact') {
      await loadByTagName(ARTIFACT_TAG)
      if (this.#mount === mount) this.#mountChild(ARTIFACT_TAG, host, artifactBus(bus))
      return
    }

    const availability = await drawerAvailability()
    if (this.#mount !== mount) return
    if (availability.kind === 'drawer') {
      this.#mountChild(CHAT_TAG, host, bus)
      return
    }
    // The reserved intent queue waits for this subscription, including requests
    // raised before component discovery completed.
    const unsubscribe = bus.subscribe(event => {
      if (isChatIntent(event)) void this.#openInline(mount, host, event.payload)
    }, INTENT_CHANNEL)
    if (this.#mount === mount) this.#unsubscribe = unsubscribe
    else unsubscribe()
  }

  #mountChild(tag, host, bus) {
    const child = document.createElement(tag)
    child.dataset.wippyPanelId = this.dataset.wippyPanelId
    child.__wippyHost = host
    child.__wippyHostBus = bus
    this.replaceChildren(child)
  }

  async #openInline(mount, host, { intent, uuid, startToken, context }) {
    const request = ++this.#request
    this.#start?.abort()
    let sessionId = uuid
    if (intent === 'startChat') {
      if (typeof startToken !== 'string' || !startToken) return
      this.#start = new AbortController()
      const { signal } = this.#start
      const command = { type: 'session_open', start_token: startToken }
      try {
        const response = await ws.sendWithResponse(command).catch(async error => {
          if (!(error instanceof Error) || error.message !== 'WebSocket is not connected') throw error
          await waitForWelcome(signal)
          signal.throwIfAborted()
          return ws.sendWithResponse(command)
        })
        if (response.topic !== 'session.opened' || !response.data?.session_id) throw new Error()
        sessionId = response.data.session_id
      } catch {
        if (this.#mount === mount && request === this.#request)
          host.toast({ severity: 'error', summary: 'Could not start chat' })
        return
      }
      if (this.#mount !== mount || request !== this.#request) {
        ws.send({ type: 'session_close', session_id: sessionId })
        return
      }
    }
    if (typeof sessionId !== 'string' || !sessionId) return
    if (context?.context) host.setContext(context.context, sessionId, context.source)
    host.navigate('/sessions/' + encodeURIComponent(sessionId))
  }
}

define(import.meta.url, KicksideManagedCoordinator)
