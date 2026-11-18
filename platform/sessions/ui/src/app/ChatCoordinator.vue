<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { config, getLayoutManager, on } from '@wippy-fe/proxy'
import type { host as proxyHost } from '@wippy-fe/proxy'
import { useHost, useLayoutBus } from '@wippy-fe/webcomponent-vue'
import { bindChatDraftComposer } from '@widgets/chatDraftComposer'
import { createChatDrafts } from './chatDrafts'
import {
  ARTIFACT_PANEL_ID,
  CHAT_PANEL_ID,
  MAIN_PANEL_ID,
  isBareSessions,
  isDrawerSlot,
  isPanelDrawerOpen,
  isPanelOpen,
  isRecord,
  isSessionsPath,
  layoutName,
  layoutSnapshot,
  mainAppRoute,
  panelProps,
  parseRoute,
  pathSection,
  sessionIdFromPath,
  sessionPath,
  slotFor,
} from './hostRoute.ts'
import type { HostRoute, LayoutEvent, LayoutLike } from './hostRoute.ts'
import { closeStartedSession, exchangeStartToken } from './chatStart.ts'

/**
 * Kickside's chat routing for the host `chat` panel (@HOST/chat-wrapper).
 *
 * The chat panel lives in the host layout, so it works whatever page the
 * `main` panel shows. This coordinator owns every decision about it: where a
 * chat request goes, how `/sessions` (which keeps its own inline chat) and the
 * drawer hand a session to each other, and how the panel behaves across
 * breakpoints. It is eager because it is headless and must hear the first
 * intent.
 */

/** Bus channel on which this coordinator tells the chat empty state whether a start is in flight. */
const START_CHANNEL = 'kickside:chat-start'

const CHAT_TAB_ID = 'chat-tab'
const CHAT_TAB = {
  kind: 'builtin',
  id: '@HOST/panel-tab',
  chrome: false,
  anchor: { right: 0, top: '50%' },
  position: { x: 0, y: 0 },
  size: { width: 48, height: 80 },
  props: { target: CHAT_PANEL_ID, mode: 'auto', label: 'Open chat' },
} as const

interface IntentContext {
  context: Record<string, unknown>
  source?: { type: 'page' | 'artifact', uuid: string, instanceUUID?: string }
}

interface ChatIntent {
  intent?: string
  uuid?: string
  startToken?: string
  sidebar?: boolean
  context?: IntentContext
}

/** A token start whose session has not been announced yet. */
interface PendingStart {
  token: string
  request: number
  /** Show the new session on /sessions/<id> instead of in the panel. */
  fullPage: boolean
  context?: IntentContext
  /** First path segment of the page the start was requested on. */
  section: string
  /** The session the panel held before this start, put back if the start is cancelled. */
  previousSessionId: string
  /**
   * A layout clear cancels only a start whose request marker has arrived.
   */
  seen: boolean
}

const host = useHost<typeof proxyHost>()
const bus = useLayoutBus()
const manager = host ? getLayoutManager(host) : null
const drafts = createChatDrafts(() => config.auth?.token)
const DRAFT_CHANNEL = 'kickside:chat-draft'
const DRAWER_COMPOSER = '[data-wippy-panel-mount="chat"] .layout-chat-wrapper'
let drawerRoot: HTMLElement | null = null
let drawerObserver: MutationObserver | undefined
let drawerDraft: ReturnType<typeof bindChatDraftComposer> | undefined

const stops: Array<() => void> = []

const browserRoute = () => window.location.pathname + window.location.search + window.location.hash
let hostPath = browserRoute()
let route: HostRoute = parseRoute(hostPath)
/** Layout name (not breakpoint name) the panel state was last applied to. */
let activeLayout = 'default'
let lastPropsKey = '|'
let requestSequence = 0
let lastChatDrawer = false
let lastArtifactDrawer = false
let lastSyncKey = ''
let pending: PendingStart | null = null
/**
 * The session this coordinator's latest patch gave the panel, until the
 * snapshot shows it. A patch applies in a later task, so until then the
 * snapshot still holds the session from before it.
 */
let patchedSession: string | null = null
/** Tabs this coordinator took away under /sessions, to put back afterwards. */
const removedTabs = new Map<string, unknown>()

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function readLayout(): LayoutLike | null {
  return layoutSnapshot(host)
}

type LayoutManager = NonNullable<typeof manager>

/**
 * The layout manager. onMounted subscribes every handler only after it found
 * one, so none can run without it; this is the single place that says so.
 */
function requireManager(): LayoutManager {
  if (!manager) throw new Error('[kickside-chat-coordinator] used before it started')
  return manager
}

/**
 * The route the reader is on. While the main panel shows the Kickside app page
 * its full route (query and hash included) is the live truth; otherwise only
 * the host path, from the address bar and `@history`, is known.
 */
function readRoute(layout: LayoutLike | null): HostRoute {
  const appRoute = mainAppRoute(layout)
  return parseRoute(appRoute ?? hostPath)
}

function routeKey(value: HostRoute): string {
  return `${value.path}${value.search}${value.hash}`
}

function propsKey(layout: LayoutLike | null): string {
  const props = panelProps(layout, CHAT_PANEL_ID)
  return `${text(props.sessionId)}|${props.startRequest ?? ''}`
}

function patchChat(props: Record<string, unknown>) {
  if ('sessionId' in props) patchedSession = text(props.sessionId)
  host?.layout.updatePanel(CHAT_PANEL_ID, { props })
}

/**
 * Record what the snapshot now shows of the pending start and of the latest
 * patch. Only the non-secret request marker is written to the layout.
 */
function noteSnapshot(layout: LayoutLike) {
  const props = panelProps(layout, CHAT_PANEL_ID)
  if (pending && props.startRequest === pending.request && !text(props.sessionId)) pending.seen = true
  if (patchedSession !== null && text(props.sessionId) === patchedSession) patchedSession = null
}

/**
 * Show the panel by the type of slot it has at this breakpoint. A drawer
 * opens, a column expands; never both, so a flag set for one slot type cannot
 * outlive a change of breakpoint.
 */
function reveal(layout: LayoutLike | null) {
  if (!layout) return
  const layoutManager = requireManager()
  if (isDrawerSlot(slotFor(layout, layoutManager.activeBreakpoint, CHAT_PANEL_ID)))
    layoutManager.openDrawer(CHAT_PANEL_ID)
  else
    layoutManager.expandPanel(CHAT_PANEL_ID)
}

function hide(layout: LayoutLike | null) {
  if (!layout) return
  const layoutManager = requireManager()
  if (isDrawerSlot(slotFor(layout, layoutManager.activeBreakpoint, CHAT_PANEL_ID)))
    layoutManager.closeDrawer(CHAT_PANEL_ID)
  else
    layoutManager.collapsePanel(CHAT_PANEL_ID)
}

function drawersOpen(layout: LayoutLike): { chat: boolean, artifact: boolean } {
  const breakpoint = requireManager().activeBreakpoint
  return {
    chat: isPanelDrawerOpen(layout, breakpoint, CHAT_PANEL_ID),
    artifact: isPanelDrawerOpen(layout, breakpoint, ARTIFACT_PANEL_ID),
  }
}

/**
 * On a narrow screen the chat and artifact drawers must not stack, however the
 * second one was opened: by a coordinator, by the chat tab, or by any panel
 * calling `host.layout.openDrawer`. This reads the layout, so it sees all of
 * them. Whichever drawer just opened stays; the other closes. When both opened
 * in one change (a breakpoint switch), the chat stays. Both found open when the
 * coordinator starts are settled the same way, once, at mount; after that only
 * an opening is acted on.
 */
function keepOneDrawer(layout: LayoutLike) {
  const { chat, artifact } = drawersOpen(layout)
  if (chat && artifact) {
    const chatOpened = !lastChatDrawer
    const artifactOpened = !lastArtifactDrawer
    if (artifactOpened && !chatOpened) requireManager().closeDrawer(CHAT_PANEL_ID)
    else if (chatOpened) requireManager().closeDrawer(ARTIFACT_PANEL_ID)
  }
  lastChatDrawer = chat
  lastArtifactDrawer = artifact
}

/**
 * Edge tabs that open the chat panel. Under /sessions the page has its own
 * chat and the panel stays closed. A tab in `mode: auto` shows whenever its
 * panel is closed, so it would stay on screen offering a chat that never opens
 * there; it is removed, and put back on leaving /sessions.
 */
function removeChatTabs(layout: LayoutLike | null) {
  for (const [id, def] of Object.entries(layout?.floating ?? {})) {
    if (!isRecord(def) || !isRecord(def.props) || def.props.target !== CHAT_PANEL_ID) continue
    if (removedTabs.has(id)) continue
    // Cached first: once removed, the snapshot no longer has the definition.
    removedTabs.set(id, JSON.parse(JSON.stringify(def)))
    host?.layout.removeFloating(id)
  }
}

function restoreChatTabs() {
  for (const [id, def] of removedTabs) host?.layout.addFloating(id, def as never)
  removedTabs.clear()
}

function carryIn(sessionId: string, current: HostRoute) {
  host?.navigate(`${sessionPath(sessionId)}${current.search}${current.hash}`, { replace: true })
}

function applyContext(context: IntentContext | undefined, sessionId: string) {
  if (!context || !isRecord(context.context)) return
  host?.setContext(context.context, sessionId, context.source)
}

function isFullPage(intent: ChatIntent, current: HostRoute): boolean {
  return isSessionsPath(current.path) || intent.sidebar === false
}

/**
 * Set or clear the start in flight. The chat empty state locks its picker
 * while one is, so a second pick cannot race the first.
 */
function setPending(next: PendingStart | null) {
  const changed = (pending !== null) !== (next !== null)
  pending = next
  if (changed) bus?.broadcast(START_CHANNEL, { pending: next !== null })
}

function cancelPending() {
  const start = pending
  if (!start) return
  setPending(null)
  patchChat({ startRequest: null, sessionId: start.previousSessionId || null })
}

function openSession(intent: ChatIntent, sessionId: string) {
  const layout = readLayout()
  const current = readRoute(layout)
  applyContext(intent.context, sessionId)
  if (isFullPage(intent, current)) {
    cancelPending()
    host?.navigate(sessionPath(sessionId))
    return
  }
  setPending(null)
  patchChat({ sessionId, startRequest: null })
  reveal(layout)
}

async function finishStart(start: PendingStart) {
  let sessionId: string
  try {
    sessionId = await exchangeStartToken(start.token)
  } catch {
    if (pending !== start) return
    cancelPending()
    host?.toast({ severity: 'error', summary: 'Could not start chat' })
    return
  }
  if (pending !== start) {
    closeStartedSession(sessionId)
    return
  }
  setPending(null)
  applyContext(start.context, sessionId)
  if (start.fullPage) {
    patchChat({ sessionId: start.previousSessionId || null, startRequest: null })
    host?.navigate(sessionPath(sessionId))
    return
  }
  patchChat({ sessionId, startRequest: null })
  const current = readRoute(readLayout())
  if (isBareSessions(current)) carryIn(sessionId, current)
}

function startChat(intent: ChatIntent, token: string) {
  const layout = readLayout()
  const current = readRoute(layout)
  const fullPage = isFullPage(intent, current)
  const section = pathSection(current.path)
  if (fullPage && layout && isPanelOpen(layout, requireManager().activeBreakpoint, CHAT_PANEL_ID)) hide(layout)
  const merged = pending?.token === token
  if (merged && pending) {
    Object.assign(pending, { fullPage, context: intent.context, section })
  } else {
    const previousSessionId = pending?.previousSessionId
      ?? patchedSession ?? text(panelProps(layout, CHAT_PANEL_ID).sessionId)
    const start: PendingStart = {
      token, request: ++requestSequence, fullPage, context: intent.context, section, previousSessionId, seen: false,
    }
    setPending(start)
    patchChat({ startRequest: start.request, sessionId: null })
    void finishStart(start)
  }
  if (!fullPage) reveal(layout)
}

function drawerSessionId(): string {
  return text(panelProps(readLayout(), CHAT_PANEL_ID).sessionId)
}

function syncDrawerDraft(layout: LayoutLike) {
  const open = isPanelOpen(layout, requireManager().activeBreakpoint, CHAT_PANEL_ID)
  const candidate = open ? document.querySelector<HTMLElement>(DRAWER_COMPOSER) : null
  if (candidate !== drawerRoot) {
    drawerDraft?.dispose()
    drawerRoot = candidate
    drawerDraft = candidate ? bindChatDraftComposer(candidate, drawerSessionId, drafts) : undefined
  }
  if (!open || candidate) {
    drawerObserver?.disconnect()
    drawerObserver = undefined
  } else if (!drawerObserver) {
    drawerObserver = new MutationObserver(() => {
      const current = readLayout()
      if (current) syncDrawerDraft(current)
    })
    drawerObserver.observe(document.body, { childList: true, subtree: true })
  }
  drawerDraft?.sync()
}

async function onDraft(event: LayoutEvent) {
  if (event.sourcePanelId !== MAIN_PANEL_ID || !isRecord(event.payload)) return
  const { kind, sessionId, requestId, draft } = event.payload
  if (typeof sessionId !== 'string' || !sessionId || sessionIdFromPath(readRoute(readLayout()).path) !== sessionId) return
  if (kind === 'write' && typeof draft === 'string') drafts.write(sessionId, draft)
  if (kind === 'read' && typeof requestId === 'number') {
    const value = await drafts.read(sessionId)
    if (sessionIdFromPath(readRoute(readLayout()).path) === sessionId)
      bus?.send(MAIN_PANEL_ID, DRAFT_CHANNEL, { requestId, draft: value })
  }
}

function onLayoutEvent(event: LayoutEvent) {
  if (event.channel === DRAFT_CHANNEL) {
    void onDraft(event)
    return
  }
  if (event.channel !== '@HOST/intent' || !isRecord(event.payload)) return
  const intent = event.payload as ChatIntent
  const sessionId = text(intent.uuid)
  const token = text(intent.startToken)
  // The panel's own announcements first: they are not requests, and treating
  // one as a request would navigate to the page it is already showing.
  if (intent.intent === 'openSession' && sessionId) {
    if (event.sourcePanelId === CHAT_PANEL_ID) {
      // The drawer selector supersedes an in-flight start, including a layout
      // patch that has been queued but hasn't reached the panel.
      if (pending) {
        setPending(null)
        patchChat({ sessionId, startRequest: null })
      }
      void nextTick(() => drawerDraft?.sync())
    } else openSession(intent, sessionId)
    return
  }
  if (intent.intent === 'startChat' && token) startChat(intent, token)
}

function onNavigated(prev: HostRoute, next: HostRoute, layout: LayoutLike) {
  let held = text(panelProps(layout, CHAT_PANEL_ID).sessionId)
  // A full-page start belongs to the page section it was requested on
  // (`/keeper`, `/git`, `/sessions`, ...). Moving within the section, to
  // another sub-route, query or hash, keeps it, so `/sessions` to
  // `/sessions?view=artifacts` still opens the new chat on completion. A drawer
  // start is not tied to any page and is never cancelled by navigation.
  if (pending?.fullPage && pathSection(next.path) !== pending.section) {
    held = pending.previousSessionId
    cancelPending()
  }
  const wasSessions = isSessionsPath(prev.path)
  const isSessions = isSessionsPath(next.path)
  if (isSessions && !wasSessions) {
    hide(layout)
    removeChatTabs(layout)
    // Bare /sessions is a blank chat; a session held in the panel moves inline.
    // A panel cleared by "New chat" holds none, so it is left blank.
    if (held && isBareSessions(next)) carryIn(held, next)
  }
  else if (!isSessions && wasSessions) {
    const left = sessionIdFromPath(prev.path)
    if (left) {
      // The session left behind takes over; any late start result is closed.
      setPending(null)
      patchChat({ sessionId: left, startRequest: null })
    }
    hide(layout)
    restoreChatTabs()
  }
}

function watchPanel(layout: LayoutLike) {
  const key = propsKey(layout)
  if (key !== lastPropsKey) {
    // "New chat" clears both fields. A start whose marker hasn't arrived
    // still has its own patch queued behind that clear.
    if (key === '|' && pending?.seen) setPending(null)
    lastPropsKey = key
  }
  keepOneDrawer(layout)
}

/**
 * What the sync reacts to: the route, the chat panel's session and request marker, and
 * whether the chat or artifact drawer is open. A splitter drag changes the
 * layout many times without touching any of them.
 */
function syncKey(layout: LayoutLike): string {
  const { chat, artifact } = drawersOpen(layout)
  return `${routeKey(readRoute(layout))}#${propsKey(layout)}#${chat}#${artifact}`
}

function sync() {
  const layout = readLayout()
  if (!layout) return
  noteSnapshot(layout)
  syncDrawerDraft(layout)
  const key = syncKey(layout)
  if (key === lastSyncKey) return
  lastSyncKey = key
  const prev = route
  route = readRoute(layout)
  if (routeKey(prev) !== routeKey(route)) onNavigated(prev, route, layout)
  watchPanel(layout)
}

/**
 * The panel is a drawer at one width and a column at another. Its logical
 * state, open or closed, carries over; the destination slot's default does not.
 */
function onBreakpoint() {
  const layout = readLayout()
  if (!layout) return
  const next = layoutName(layout, requireManager().activeBreakpoint)
  const prev = activeLayout
  if (next === prev) return
  activeLayout = next
  if (isPanelOpen(layout, prev, CHAT_PANEL_ID) && !isSessionsPath(route.path)) reveal(layout)
  else hide(layout)
}

onMounted(() => {
  const layout = readLayout()
  if (!host || !manager || !bus || !layout) {
    console.error('[kickside-chat-coordinator] not started: needs a managed layout host with a layout manager, a layout bus and a layout snapshot', {
      host: !!host,
      manager: !!manager,
      bus: !!bus,
      snapshot: !!layout,
    })
    return
  }
  route = readRoute(layout)
  activeLayout = layoutName(layout, manager.activeBreakpoint)
  lastPropsKey = propsKey(layout)
  const { chat, artifact } = drawersOpen(layout)
  if (chat && artifact) manager.closeDrawer(ARTIFACT_PANEL_ID)
  lastChatDrawer = chat
  lastArtifactDrawer = artifact && !chat
  lastSyncKey = syncKey(layout)
  if (!layout.floating?.[CHAT_TAB_ID]) removedTabs.set(CHAT_TAB_ID, CHAT_TAB)
  if (isSessionsPath(route.path)) {
    hide(layout)
    removeChatTabs(layout)
  } else {
    restoreChatTabs()
  }
  syncDrawerDraft(layout)
  stops.push(bus.subscribe(onLayoutEvent))
  stops.push(manager.on('change', sync))
  stops.push(manager.on('breakpoint', onBreakpoint))
  stops.push(on('@history', ({ path }) => {
    hostPath = path === window.location.pathname ? browserRoute() : path
    sync()
  }))
})

onBeforeUnmount(() => {
  stops.forEach(stop => stop())
  stops.length = 0
  drawerObserver?.disconnect()
  drawerDraft?.dispose()
  cancelPending()
  restoreChatTabs()
})
</script>

<template><span aria-hidden="true" /></template>
