<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { api } from '@wippy-fe/proxy'
import { errMsg } from '@kickside/ui-kit/errMsg'
import WcMount from '@widgets/app/WcMount.vue'

const props = defineProps<{ kbId: string }>()

interface Folder { id: string; name: string }
interface Location {
  action: 'list_folders' | 'list_shared_drives'
  label: string
  drive_id?: string
  parent_id?: string
}
interface FolderPage {
  success: boolean
  items?: Folder[]
  parent?: Folder
  next_cursor?: Record<string, unknown>
  error?: string
}

const endpoint = computed(() => `/api/v1/knowledge/${encodeURIComponent(props.kbId)}/drive-folders`)
const actorId = ref('')
const connectionId = ref('')
const locations = ref<Location[]>([])
const location = computed(() => locations.value.at(-1))
const parent = ref<Folder>()
const items = ref<Folder[]>([])
const cursor = ref<FolderPage['next_cursor']>()
const loading = ref(false)
const linking = ref(false)
const browseError = ref('')
const linkError = ref('')
const linkedFolder = ref('')
let generation = 0
let install: { component_id: string; request_id: string } | undefined

onMounted(async () => {
  try {
    const { data } = await api.get<{ available: boolean; actor_id?: string }>(endpoint.value)
    if (data.available && data.actor_id) actorId.value = data.actor_id
  } catch { /* The source controls are optional and require write access. */ }
})
onBeforeUnmount(() => { generation += 1 })

function resetPage() {
  generation += 1
  parent.value = undefined
  items.value = []
  cursor.value = undefined
  loading.value = false
  browseError.value = ''
  linkError.value = ''
  install = undefined
}

function chooseConnection(value: unknown) {
  const id = (value as { connection_id?: unknown } | undefined)?.connection_id
  const next = typeof id === 'string' ? id : ''
  if (linking.value || next === connectionId.value) return
  connectionId.value = next
  locations.value = []
  resetPage()
}

async function loadPage(append = false) {
  const target = location.value
  if (!target || !connectionId.value || loading.value) return
  const request = ++generation
  loading.value = true
  browseError.value = ''
  try {
    const { data } = await api.post<FolderPage>(endpoint.value, {
      connection_id: connectionId.value,
      action: target.action,
      drive_id: target.drive_id,
      parent_id: target.parent_id,
      cursor: append ? cursor.value : undefined,
    })
    if (request !== generation) return
    if (!data.success) throw new Error(data.error || 'Could not load Drive folders')
    parent.value = data.parent
    const rows = new Map((append ? items.value : []).map(folder => [folder.id, folder]))
    for (const folder of Array.isArray(data.items) ? data.items : []) rows.set(folder.id, folder)
    items.value = [...rows.values()]
    cursor.value = data.next_cursor
  } catch (cause) {
    if (request === generation) browseError.value = errMsg(cause, 'Could not load Drive folders')
  } finally {
    if (request === generation) loading.value = false
  }
}

function navigate(next?: Location) {
  if (linking.value) return
  resetPage()
  if (next) locations.value.push(next)
  else locations.value.pop()
  void loadPage()
}

function openFolder(folder: Folder) {
  if (location.value?.action === 'list_shared_drives') {
    navigate({ action: 'list_folders', label: folder.name, drive_id: folder.id })
  } else {
    navigate({ action: 'list_folders', label: folder.name, drive_id: location.value?.drive_id, parent_id: folder.id })
  }
}

async function linkFolder() {
  const folder = parent.value
  if (linking.value || loading.value || !folder || !connectionId.value) return
  install ||= { component_id: crypto.randomUUID(), request_id: crypto.randomUUID() }
  const request = generation
  linking.value = true
  linkError.value = ''
  try {
    const { data } = await api.post<{ success: boolean; id?: string; error?: string }>('/api/v1/automations/selected', {
      ...install,
      principal: { kind: 'user', id: actorId.value },
      type: 'kickside.sync:sync',
      parent_id: props.kbId,
      input: {
        title: `Google Drive · ${folder.name}`,
        enabled: true,
        reconcile: true,
        trigger: {
          v: 2,
          source: 'kickside.google.source:drive_folder',
          backfill: 'all',
          schedule: { type: 'interval', expression: '15m' },
          config: { connection_id: connectionId.value, folder_id: folder.id },
        },
        sink_port: 'kickside.knowledge.sink:kb_upload',
        sink_config: { kb_id: props.kbId },
        transform: { kind: 'none' },
      },
    })
    if (request !== generation) return
    if (!data.success || data.id !== install.component_id) {
      throw new Error(errMsg({ response: { data } }, 'Could not confirm the Drive folder link'))
    }
    linkedFolder.value = folder.name
  } catch (cause) {
    if (request === generation) linkError.value = errMsg(cause, 'Could not link the Drive folder')
  } finally {
    if (request === generation) linking.value = false
  }
}
</script>

<template>
  <section v-if="actorId" class="kx-form kx-drive-source" aria-label="Google Drive source">
    <h3 class="kx-field-lbl">Google Drive source</h3>
    <p v-if="linkedFolder" role="status">
      {{ linkedFolder }} is linked and will sync every 15 minutes. Manage the sync in Automations.
    </p>
    <template v-else>
      <div :inert="linking">
        <WcMount
          tag="wc-connection-picker"
          provider="google"
          label="Google Drive connection"
          :config="{ connection_id: connectionId }"
          :attrs="{ 'reply-only': 'false' }"
          @change="chooseConnection"
        />
      </div>
      <div v-if="connectionId && !location" class="kx-drive-actions">
        <Button type="button" label="My Drive" size="small" outlined @click="navigate({ action: 'list_folders', label: 'My Drive' })" />
        <Button type="button" label="Shared drives" size="small" outlined @click="navigate({ action: 'list_shared_drives', label: 'Shared drives' })" />
      </div>
      <template v-if="location">
        <div class="kx-drive-actions">
          <Button type="button" label="Back" severity="secondary" size="small" text :disabled="linking" @click="navigate()" />
          <span>{{ location.label }}</span>
        </div>
        <p v-if="loading" role="status">Loading Drive folders…</p>
        <p v-if="browseError" role="alert" class="kx-err inline">{{ browseError }}</p>
        <p v-else-if="!loading && !items.length && !cursor" class="kx-2p-r-note">
          {{ location.action === 'list_shared_drives' ? 'No shared drives found.' : 'No subfolders found.' }}
        </p>
        <ul v-if="items.length" class="kx-drive-folders">
          <li v-for="folder in items" :key="folder.id">
            <Button type="button" :label="folder.name" size="small" text :disabled="linking" @click="openFolder(folder)" />
          </li>
        </ul>
        <div class="kx-drive-actions">
          <Button v-if="browseError || cursor" type="button" :label="browseError ? 'Try again' : 'Load more'" size="small" outlined :disabled="loading || linking" @click="loadPage(!!cursor)" />
          <Button v-if="parent" type="button" :label="linkError ? 'Retry linking folder' : 'Link this folder'" size="small" :loading="linking" :disabled="loading" @click="linkFolder" />
        </div>
        <p v-if="parent" class="kx-2p-r-note">Files directly in this folder will sync every 15 minutes.</p>
        <p v-if="linkError" role="alert" class="kx-err inline">{{ linkError }}</p>
      </template>
    </template>
  </section>
</template>
