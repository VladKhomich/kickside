<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import { on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { useComponentEvents } from '../constants.ts'
import type { ArtifactSummary } from '../types.ts'
import { useSessionsApi } from './useSessionsApi.ts'
import { artifactId, artifactWhen } from './artifactPresentation.ts'
import { compareArtifactsNewest, readArtifactUpdate, readSessionUpdate } from './inventoryEvents.ts'
import { useInventoryRefresh } from './useInventoryRefresh.ts'

const PAGE_SIZE = 48
const MAX_API_PAGE_SIZE = 100
const api = useSessionsApi()
const emit = useComponentEvents()
const artifacts = ref<ArtifactSummary[]>([])
const loaded = ref(false)
const loadingMore = ref(false)
const error = ref('')
const actionError = ref('')
const cursor = ref('')
const hasMore = ref(false)
const search = ref('')
const display = ref<'all' | 'standalone' | 'inline'>('all')
const opening = ref('')
const unsubscribe: (() => void)[] = []
let nextPage: Promise<void> | undefined
type ArtifactUpdate = NonNullable<ReturnType<typeof readArtifactUpdate>>
const changes = new Map<string, ArtifactUpdate & { readDetail: boolean }>()
const sessionDeletes = new Set<string>()

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  return artifacts.value.filter((artifact) => {
    if (display.value !== 'all' && artifact.display_type !== display.value) return false
    if (!query) return true
    return [artifact.title, artifact.preview, artifact.description, artifact.content_type, artifact.kind]
      .some(value => String(value || '').toLowerCase().includes(query))
  })
})

async function loadPage(reset: boolean) {
  error.value = ''
  try {
    const limit = reset ? Math.max(PAGE_SIZE, artifacts.value.length) : PAGE_SIZE
    const rows = reset ? [] : [...artifacts.value]
    const target = rows.length + limit
    let nextCursor = reset ? '' : cursor.value
    let more = false
    do {
      const page = await api.artifacts({ limit: Math.min(target - rows.length, MAX_API_PAGE_SIZE), cursor: nextCursor })
      rows.push(...page.artifacts)
      nextCursor = page.nextCursor
      more = page.hasMore
    } while (more && nextCursor && rows.length < target)
    artifacts.value = [...new Map(rows.filter(row => !row.session_id || !sessionDeletes.has(row.session_id))
      .map(row => [artifactId(row), row])).values()].sort(compareArtifactsNewest)
    cursor.value = nextCursor
    hasMore.value = more
    loaded.value = true
  } catch (cause) {
    const response = (cause as { response?: { status?: number; data?: { error?: string } } } | null)?.response
    if (!reset && response?.status === 400 && response.data?.error === 'Invalid artifact cursor') {
      await loadPage(true)
      return
    }
    error.value = (cause as Error).message
  }
}

async function refreshGallery() {
  if (nextPage) await nextPage
  await loadPage(true)
}

function queueArtifact(change: ArtifactUpdate, readDetail = false) {
  const previous = changes.get(change.artifactId)
  changes.set(change.artifactId, {
    artifactId: change.artifactId,
    sessionId: change.sessionId || previous?.sessionId,
    deleted: change.deleted || previous?.deleted === true,
    readDetail: readDetail || previous?.readDetail === true,
  })
  queueUpdates()
}

async function readChangedArtifacts(sessionId: string, ids: Set<string>) {
  const matches = new Map<string, ArtifactSummary>()
  let cursor = ''
  do {
    const page = await api.artifacts({ sessionId, limit: PAGE_SIZE, cursor })
    for (const row of page.artifacts) {
      const id = artifactId(row)
      if (row.session_id === sessionId && ids.has(id)) matches.set(id, row)
    }
    if (!page.hasMore || page.nextCursor === cursor || matches.size === ids.size) break
    cursor = page.nextCursor
  } while (cursor)
  return matches
}

async function applyArtifactChanges() {
  if (nextPage) await nextPage
  const batch = [...changes.values()]
  changes.clear()
  const tail = artifacts.value.at(-1)
  const rows = new Map(artifacts.value.map(row => [artifactId(row), row]))
  const bySession = new Map<string, Set<string>>()
  const edits: Promise<void>[] = []

  function accept(id: string, row: ArtifactSummary | undefined) {
    if (!row || changes.get(id)?.deleted) rows.delete(id)
    else if (rows.has(id) || !hasMore.value || !tail || compareArtifactsNewest(row, tail) <= 0) rows.set(id, row)
  }

  async function readEdit(id: string, sessionId?: string) {
    try {
      const row = await api.artifact(id)
      accept(id, { ...row, session_id: row.session_id || sessionId })
    } catch (cause) {
      const status = (cause as { response?: { status?: number } } | null)?.response?.status
      if (status === 404 || status === 403) accept(id, undefined)
      else actionError.value = (cause as Error).message
    }
  }

  for (const change of batch) {
    const id = change.artifactId
    const sessionId = change.sessionId || rows.get(id)?.session_id
    if (change.deleted || (sessionId && sessionDeletes.has(sessionId))) {
      rows.delete(id)
    } else if (change.readDetail) {
      edits.push(readEdit(id, sessionId))
    } else if (sessionId) {
      const ids = bySession.get(sessionId) ?? new Set<string>()
      ids.add(id)
      bySession.set(sessionId, ids)
    }
  }

  const additions = [...bySession].map(async ([sessionId, ids]) => {
    try {
      // The catalog includes preview text and the session link used by the card.
      const matches = await readChangedArtifacts(sessionId, ids)
      for (const id of ids) accept(id, matches.get(id))
    } catch (cause) {
      actionError.value = (cause as Error).message
    }
  })
  await Promise.all([...edits, ...additions])

  artifacts.value = [...rows.values()]
    .filter(row => !row.session_id || !sessionDeletes.has(row.session_id))
    .sort(compareArtifactsNewest)
}

const { refreshing, syncing, refresh: load, queueUpdates } = useInventoryRefresh(refreshGallery, applyArtifactChanges)

async function loadMore() {
  if (syncing.value || nextPage || !hasMore.value) return
  loadingMore.value = true
  nextPage = loadPage(false)
  try {
    await nextPage
  } finally {
    nextPage = undefined
    loadingMore.value = false
  }
}

async function openArtifact(artifact: ArtifactSummary) {
  const id = artifactId(artifact)
  if (!id) return
  opening.value = id
  actionError.value = ''
  try {
    if (!artifact.session_id) throw new Error('This artifact is not linked to a session.')
    emit('artifact-select', { artifactId: id, sessionId: artifact.session_id })
  } catch (cause) {
    actionError.value = (cause as Error).message || 'Could not open artifact'
  } finally {
    opening.value = ''
  }
}

onMounted(() => {
  unsubscribe.push(on('artifact:*', (message) => {
    const change = readArtifactUpdate(message)
    if (change) queueArtifact(change, true)
  }))
  unsubscribe.push(on('session:*', (message) => {
    const change = readSessionUpdate(message)
    if (!change) return
    if (change.deleted) {
      sessionDeletes.add(change.sessionId)
      queueUpdates()
    } else if (change.artifactId) {
      queueArtifact({ artifactId: change.artifactId, sessionId: change.sessionId, deleted: false })
    }
  }))
  unsubscribe.push(on('@reconnect', load))
})
useHostVisibilityRefresh(load)
onBeforeUnmount(() => {
  unsubscribe.forEach(stop => stop())
})
</script>

<template>
  <div class="kx kx-artifacts-page">
    <header class="kx-head">
      <div class="kx-head-text">
        <h1 class="kx-title">Artifacts</h1>
      </div>
      <div class="kx-head-actions">
        <label class="kx-search">
          <span class="sr-only">Search artifacts</span>
          <Icon icon="tabler:search" class="kx-search-ico" aria-hidden="true" />
          <input v-model="search" class="kx-search-input" type="search" placeholder="Search artifacts" />
          <button v-if="search" class="kx-search-clear" aria-label="Clear search" @click="search = ''">
            <Icon icon="tabler:x" aria-hidden="true" />
          </button>
        </label>
        <label class="kx-select-label">
          <span class="sr-only">Artifact placement</span>
          <select v-model="display" class="kx-select">
            <option value="all">All artifacts</option>
            <option value="standalone">Standalone</option>
            <option value="inline">Inline</option>
          </select>
        </label>
        <Button type="button" severity="secondary" outlined title="Refresh" aria-label="Refresh artifacts" :loading="refreshing" :disabled="refreshing" @click="load">
          <template #icon="{ class: iconClass }"><Icon icon="tabler:refresh" :class="iconClass" aria-hidden="true" /></template>
        </Button>
      </div>
    </header>

    <div class="kx-body kx-artifacts-body">
      <div v-if="actionError" class="kx-err" role="alert">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" />
        <span>{{ actionError }}</span>
        <button class="kx-err-x" aria-label="Dismiss" @click="actionError = ''"><Icon icon="tabler:x" aria-hidden="true" /></button>
      </div>
      <div v-if="loaded && error" class="kx-err" role="alert">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" />
        <span>{{ error }}</span>
        <button class="kx-err-x" aria-label="Dismiss" @click="error = ''"><Icon icon="tabler:x" aria-hidden="true" /></button>
      </div>

      <div v-if="!loaded && !error" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading artifacts…</div>
      <div v-else-if="!loaded && error" class="kx-empty">
        <div class="kx-empty-ico"><Icon icon="tabler:alert-triangle" aria-hidden="true" /></div>
        <div class="kx-empty-title">Couldn’t load artifacts</div>
        <div class="kx-empty-sub">{{ error }}</div>
        <Button type="button" label="Retry" @click="load">
          <template #icon="{ class: iconClass }"><Icon icon="tabler:refresh" :class="iconClass" aria-hidden="true" /></template>
        </Button>
      </div>
      <div v-else-if="!artifacts.length" class="kx-empty">
        <div class="kx-empty-ico"><Icon icon="tabler:binary-tree-2" aria-hidden="true" /></div>
        <div class="kx-empty-title">No artifacts yet</div>
        <div class="kx-empty-sub">Enable the Artifacts capability on an agent, then ask it to create a document, component, or rich response.</div>
      </div>
      <div v-else-if="!filtered.length" class="kx-empty">
        <div class="kx-empty-title">No matches</div>
        <div class="kx-empty-sub">No loaded artifacts match the current search and placement filter.</div>
      </div>
      <template v-else>
        <div class="kx-artifact-grid" role="list" aria-label="Artifacts">
          <article v-for="artifact in filtered" :key="artifactId(artifact)" class="kx-artifact-card" role="listitem">
            <button type="button" class="kx-artifact-open" :disabled="opening === artifactId(artifact)" @click="openArtifact(artifact)">
              <span class="kx-artifact-preview" aria-hidden="true">
                <w-artifact :id="artifactId(artifact)" />
              </span>
              <span class="kx-artifact-copy">
                <strong :title="artifact.title || 'Untitled artifact'">{{ artifact.title || 'Untitled artifact' }}</strong>
                <span class="kx-artifact-meta">
                  <span>{{ artifact.display_type || 'artifact' }}</span>
                  <span v-if="artifactWhen(artifact)">{{ artifactWhen(artifact) }}</span>
                </span>
              </span>
              <Icon v-if="opening === artifactId(artifact)" icon="tabler:loader-2" class="spin kx-artifact-open-icon" aria-hidden="true" />
              <Icon v-else icon="tabler:arrow-up-right" class="kx-artifact-open-icon" aria-hidden="true" />
            </button>
          </article>
        </div>
      </template>
      <div v-if="hasMore" class="kx-more">
        <Button
          type="button"
          severity="secondary"
          outlined
          :label="loadingMore ? 'Loading…' : 'Load more'"
          :loading="loadingMore"
          :disabled="loadingMore || syncing"
          @click="loadMore">
          <template #icon="{ class: iconClass }"><Icon icon="tabler:chevron-down" :class="iconClass" aria-hidden="true" /></template>
        </Button>
      </div>
    </div>
  </div>
</template>
