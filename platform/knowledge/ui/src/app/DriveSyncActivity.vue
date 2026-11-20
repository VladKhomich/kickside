<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Button from 'primevue/button'
import { api } from '@wippy-fe/proxy'
import { subscribeComponentMeta } from '@kickside/ui-kit/componentRealtime'
import { errMsg } from '@kickside/ui-kit/errMsg'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import type { DriveSync, DriveSyncStatus } from './driveSync'

const props = defineProps<{ sync: DriveSync }>()
const endpoint = computed(() => `/api/v1/automations/${encodeURIComponent(props.sync.id)}`)
const status = ref(props.sync.drive_status)
const collection = computed(() => status.value?.drives?.find(row => row.source_kind === 'collection'))
const lastSync = computed(() => collection.value?.last_round_at)
const failureCount = computed(() => status.value?.delivery_failures?.count || 0)
const lastFailure = computed(() => status.value?.delivery_failures?.last_error)
const canRun = computed(() => !props.sync.deleting_at && ((props.sync.access_level || 0) & 2) !== 0 && !!collection.value?.drive_key && collection.value.enabled !== false)
const canReadHistory = computed(() => ((props.sync.access_level || 0) & 8) !== 0)

const loadingStatus = ref(false)
const statusError = ref('')
const controlError = ref('')
const requestPending = ref(false)
const queued = ref(false)
const running = ref(false)
const nextStatusRequest = latestRequest()
let requestId = ''
let disposed = false

async function refreshStatus() {
  const current = nextStatusRequest()
  loadingStatus.value = true
  statusError.value = ''
  try {
    const { data } = await api.get<DriveSyncStatus & { success: boolean; error?: unknown }>(`${endpoint.value}/status`)
    if (!data.success) throw new Error(errMsg({ response: { data } }, 'Could not refresh sync status'))
    if (current()) status.value = data
  } catch (cause) {
    if (current()) statusError.value = errMsg(cause, 'Could not refresh sync status')
  } finally {
    if (current()) loadingStatus.value = false
  }
}

async function runNow() {
  const drive = collection.value
  if (!drive || !canRun.value || running.value) return
  requestId ||= crypto.randomUUID()
  running.value = true
  queued.value = false
  controlError.value = ''
  try {
    const { data } = await api.post<{ success: boolean; state?: string; error?: unknown }>(`${endpoint.value}/control`, {
      control: 'run_now', drive_key: drive.drive_key, request_id: requestId,
    })
    if (disposed) return
    if (!data.success) throw new Error(errMsg({ response: { data } }, 'Could not start the sync'))
    if (data.state !== 'succeeded' && data.state !== 'pending') throw new Error('Sync request was not accepted')
    requestPending.value = data.state === 'pending'
    queued.value = !requestPending.value
    if (queued.value) requestId = ''
    await refreshStatus()
  } catch (cause) {
    if (!disposed) controlError.value = errMsg(cause, 'Could not start the sync')
  } finally {
    if (!disposed) running.value = false
  }
}

interface Delivery {
  item_key: string
  round_at: string
  state: string
  error?: string | { message?: string }
}
const historyOpen = ref(false)
const historyRows = ref<Delivery[]>([])
const historyCursor = ref('')
const loadingHistory = ref(false)
const historyError = ref('')
const nextHistoryRequest = latestRequest()
const failed = computed(() => historyRows.value.filter(row => row.state === 'dead' || row.state === 'failed' || row.state === 'uncertain'))

function fileId(key: string) { return /^google:drive:([\w-]+)$/.exec(key)?.[1] }
function fileUrl(id: string) { return `https://drive.google.com/open?id=${encodeURIComponent(id)}` }
function failureMessage(e: Delivery['error']) { return typeof e === 'string' ? e : e?.message || 'No reason recorded' }
function formatTime(value: string) { return new Date(value).toLocaleString() }

async function readHistory(more = false) {
  const current = nextHistoryRequest()
  const token = more ? historyCursor.value : ''
  if (!more) {
    historyRows.value = []
    historyCursor.value = ''
  }
  loadingHistory.value = true
  historyError.value = ''
  try {
    const { data } = await api.get<{ success: boolean; entries?: Delivery[]; next_page_token?: string; error?: unknown }>(`${endpoint.value}/history`, {
      params: { kind: 'deliveries', page_size: 25, ...(token ? { page_token: token } : {}) },
    })
    if (!data.success) throw new Error(errMsg({ response: { data } }, 'Could not read failed files'))
    if (token && data.next_page_token === token) throw new Error('Delivery history repeated its page')
    if (!current()) return
    const latest = new Map(historyRows.value.map(row => [row.item_key, row]))
    // Newest delivery first. A successful retry supersedes an older failure in this view.
    for (const row of Array.isArray(data.entries) ? data.entries : []) {
      if (fileId(row.item_key) && !latest.has(row.item_key)) latest.set(row.item_key, row)
    }
    historyRows.value = [...latest.values()]
    historyCursor.value = data.next_page_token || ''
  } catch (cause) {
    if (current()) historyError.value = errMsg(cause, 'Could not read failed files')
  } finally {
    if (current()) loadingHistory.value = false
  }
}

function toggleHistory() {
  historyOpen.value = !historyOpen.value
  if (historyOpen.value) void readHistory()
}

watch(() => props.sync.drive_status, current => { status.value = current })
watch(() => lastSync.value, (current, previous) => {
  if (current !== previous) {
    queued.value = false
    if (historyOpen.value) void readHistory()
  }
})
const unsubscribe = subscribeComponentMeta(props.sync.id, () => { void refreshStatus() })
onBeforeUnmount(() => {
  disposed = true
  nextStatusRequest()
  nextHistoryRequest()
  unsubscribe?.()
})
</script>

<template>
  <section class="kx-drive-sync" :aria-label="sync.title || 'Linked Drive folder'">
    <h4 class="kx-field-lbl">{{ sync.title || 'Linked Drive folder' }}</h4>
    <p class="kx-2p-r-note">Last sync <time v-if="lastSync" :datetime="lastSync">{{ formatTime(lastSync) }}</time><span v-else>Never</span></p>
    <div class="kx-drive-actions">
      <Button v-if="canRun" type="button" size="small" :label="requestPending ? 'Check sync request' : 'Sync now'" :loading="running" @click="runNow" />
      <Button type="button" size="small" severity="secondary" text label="Refresh status" :disabled="loadingStatus" @click="refreshStatus" />
    </div>
    <p v-if="requestPending" role="status">Sync request pending.</p>
    <p v-else-if="queued" role="status">Sync requested.</p>
    <p v-if="controlError || statusError" role="alert" class="kx-err inline">{{ controlError || statusError }}</p>
    <p v-if="collection?.last_error?.message" class="kx-err inline">{{ collection.last_error.message }}</p>
    <p v-if="failureCount" class="kx-2p-r-note">{{ failureCount }} failed file {{ failureCount === 1 ? 'delivery' : 'deliveries' }}</p>
    <p v-if="lastFailure?.message && !failed.some(row => historyOpen && row.item_key === lastFailure?.item_key)" class="kx-2p-r-note">
      <a v-if="lastFailure.item_key && fileId(lastFailure.item_key)" :href="fileUrl(fileId(lastFailure.item_key)!)" target="_blank" rel="noopener noreferrer">Drive file {{ fileId(lastFailure.item_key) }}</a>
      {{ lastFailure.message }}
    </p>
    <Button v-if="canReadHistory && failureCount" type="button" size="small" severity="secondary" text
      :label="historyOpen ? 'Hide failed files' : 'Show failed files'" :aria-expanded="historyOpen" @click="toggleHistory" />
    <template v-if="canReadHistory && historyOpen">
      <p v-if="loadingHistory" role="status">Loading failed files…</p>
      <p v-if="historyError" role="alert" class="kx-err inline">{{ historyError }}</p>
      <ul v-if="failed.length" class="kx-drive-failures">
        <li v-for="row in failed" :key="row.item_key">
          <a :href="fileUrl(fileId(row.item_key)!)" target="_blank" rel="noopener noreferrer">Drive file {{ fileId(row.item_key) }}</a>
          <p>{{ failureMessage(row.error) }}</p>
        </li>
      </ul>
      <p v-else-if="!loadingHistory && !historyError" class="kx-2p-r-note">No failed files on this delivery history page.</p>
      <Button v-if="historyError" type="button" size="small" severity="secondary" outlined label="Retry failed files" @click="readHistory()" />
      <Button v-else-if="historyCursor" type="button" size="small" severity="secondary" outlined label="More delivery history" :disabled="loadingHistory" @click="readHistory(true)" />
    </template>
  </section>
</template>
