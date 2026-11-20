<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import Button from 'primevue/button'
import { api } from '@wippy-fe/proxy'
import { errMsg } from '@kickside/ui-kit/errMsg'
import { useComponentDeletion } from '@kickside/ui-kit/useComponentDeletion'
import DriveSyncActivity from './DriveSyncActivity.vue'
import { DATA_SYNC_TYPE, DRIVE_FOLDER_SOURCE, KNOWLEDGE_UPLOAD_SINK, type DriveSync } from './driveSync'

const props = defineProps<{ kbId: string; linkedFolder: string }>()
const syncs = ref<DriveSync[]>([])
const loading = ref(false)
const error = ref('')
const hasMore = ref(false)
const PAGE_SIZE = 20
let offset = 0
let generation = 0

interface Config {
  source?: { port?: string }
  sink?: { port?: string; config?: { kb_id?: string } }
}

async function belongsToDrive(sync: DriveSync, kbId: string) {
  try {
    const { data } = await api.get<{ success: boolean; config?: Config; error?: unknown }>(
      `/api/v1/automations/${encodeURIComponent(sync.id)}/config`,
    )
    if (!data.success) throw new Error(errMsg({ response: { data } }, 'Could not read sync settings'))
    return data.config?.source?.port === DRIVE_FOLDER_SOURCE && data.config.sink?.port === KNOWLEDGE_UPLOAD_SINK
      && data.config.sink.config?.kb_id === kbId
  } catch (cause) {
    const status = (cause as { response?: { status?: number } })?.response?.status
    if (status === 403 || status === 404) return false
    throw cause
  }
}

async function load(more = false) {
  if (more && loading.value) return
  const current = ++generation
  const kbId = props.kbId
  const start = more ? offset : 0
  if (!more) {
    syncs.value = []
    hasMore.value = false
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get<{ success: boolean; automations?: DriveSync[]; error?: unknown }>('/api/v1/automations', {
      params: { parent_id: kbId, limit: PAGE_SIZE, offset: start },
    })
    if (current !== generation) return
    if (!data.success) throw new Error(errMsg({ response: { data } }, 'Could not list Drive syncs'))
    const rows: DriveSync[] = Array.isArray(data.automations) ? data.automations : []
    const candidates = rows.filter(row => row.type === DATA_SYNC_TYPE && !row.deleting_at && !row.availability)
    const matches = await Promise.all(candidates.map(row => belongsToDrive(row, kbId)))
    if (current !== generation) return
    const visible = new Map(syncs.value.map(row => [row.id, row]))
    for (const [index, row] of candidates.entries()) {
      if (matches[index]) visible.set(row.id, row)
    }
    syncs.value = [...visible.values()]
    offset = start + rows.length
    hasMore.value = rows.length === PAGE_SIZE
  } catch (cause) {
    if (current === generation) error.value = errMsg(cause, 'Could not list Drive syncs')
  } finally {
    if (current === generation) loading.value = false
  }
}

useComponentDeletion(syncs, row => row.id, undefined, () => { void load() })
watch(() => [props.kbId, props.linkedFolder], () => { void load() }, { immediate: true })
onBeforeUnmount(() => { generation += 1 })
</script>

<template>
  <div v-if="syncs.length || loading || error || hasMore" class="kx-form">
    <DriveSyncActivity v-for="sync in syncs" :key="sync.id" :sync="sync" />
    <p v-if="loading" role="status" class="kx-2p-r-note">Loading linked folders…</p>
    <p v-if="error" role="alert" class="kx-err inline">{{ error }}</p>
    <div v-if="hasMore || error" class="kx-drive-actions">
      <Button v-if="error" type="button" label="Try again" severity="secondary" size="small" outlined @click="load()" />
      <Button v-else type="button" label="More linked folders" severity="secondary" size="small" outlined :disabled="loading" @click="load(true)" />
    </div>
  </div>
</template>
