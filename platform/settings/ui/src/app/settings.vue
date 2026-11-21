<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import SettingsRail, { type SettingsRailItem } from '@kickside/ui-kit/SettingsRail.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { useComponentProps } from '../constants'
import SettingsForm from './SettingsForm.vue'
import WcMount from '@widgets/app/WcMount.vue'
import { api } from '@wippy-fe/proxy'

// The Settings page: a declarative left-nav of settings blocks + a content pane.
// A block is a kickside.settings:block registry entry; the /settings/blocks
// endpoint returns the declared blocks plus auto-blocks for every settings
// namespace with a visible definition. A block with a component_tag renders that
// bespoke editor by tag; a block with a namespace renders the generic
// per-value_type settings form scoped to that namespace. Renders inside shadow
// DOM, styled with the universal --p-* theme.

interface Block {
  key: string
  title: string
  icon?: string
  order?: number
  group?: string
  component_tag?: string
  namespace?: string
  config?: Record<string, unknown>
}

const hostProps = useComponentProps()
// Optional deep-link: a host-supplied `route` selects the block with that key.
const routeKey = computed(() => {
  const r = hostProps.value?.route
  return typeof r === 'string' && r.length ? r : ''
})

const blocks = ref<Block[]>([])
const loading = ref(true)
const error = ref('')
const selectedKey = ref('')
const showingAll = ref(false)
const allSettings = { value: '', label: 'All settings', icon: 'tabler:table' }

// Sidebar sections: consecutive blocks sharing a group become one section with a
// heading; ungrouped blocks form a heading-less section. The backend already
// orders by (group, order, title), so a single pass preserves that order.
const sections = computed(() => {
  const out: { heading: string; items: SettingsRailItem[] }[] = []
  for (const b of blocks.value) {
    const heading = b.group || ''
    const item = { value: b.key, label: b.title, icon: b.icon || 'tabler:adjustments' }
    const last = out[out.length - 1]
    if (last && last.heading === heading) last.items.push(item)
    else out.push({ heading, items: [item] })
  }
  return out
})

const selected = computed(() => blocks.value.find(b => b.key === selectedKey.value) || null)

function select(key: string) {
  showingAll.value = key === allSettings.value
  if (!showingAll.value) selectedKey.value = key
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/api/v1/settings/blocks')
    if (!data?.success) throw new Error(data?.error || 'failed to load settings blocks')
    blocks.value = Array.isArray(data.blocks) ? (data.blocks as Block[]) : []
    const preferred = routeKey.value && blocks.value.some(b => b.key === routeKey.value)
      ? routeKey.value
      : blocks.value.some(b => b.key === selectedKey.value)
        ? selectedKey.value
        : (blocks.value[0]?.key || '')
    selectedKey.value = preferred
    if (routeKey.value === 'all-settings' && !blocks.value.some(block => block.key === routeKey.value)) showingAll.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

useHostVisibilityRefresh(load)
</script>

<template>
  <div class="ks">
    <div v-if="error" class="ks-err">{{ error }}</div>
    <div v-if="loading" class="ks-loading">Loading…</div>
    <div v-else-if="!blocks.length" class="ks-empty">No settings declared.</div>

    <div v-else class="ks-shell">
      <SettingsRail label="Settings sections" :value="showingAll ? allSettings.value : selectedKey"
        :groups="sections" :leading-item="allSettings" @update:value="select" />

      <section class="ks-pane" :class="{ 'ks-pane-flush': !showingAll && selected && selected.component_tag }">
        <template v-if="showingAll">
          <header class="ks-pane-head"><h1>All settings</h1></header>
          <SettingsForm key="all-settings-table" namespace="" all :blocks="blocks" />
        </template>
        <template v-else-if="selected">
          <WcMount v-if="selected.component_tag" :key="selected.key" :tag="selected.component_tag" :config="selected.config" />
          <template v-else-if="selected.namespace">
            <header class="ks-pane-head">
              <span class="ks-pane-ico"><Icon :icon="selected.icon || 'tabler:adjustments'" aria-hidden="true" /></span>
              <div class="ks-pane-head-text">
                <h1>{{ selected.title }}</h1>
                <p v-if="typeof selected.config?.description === 'string'">{{ selected.config.description }}</p>
              </div>
            </header>
            <SettingsForm :key="selected.key" :namespace="selected.namespace" />
          </template>
          <div v-else class="ks-empty">This block has no editor.</div>
        </template>
      </section>
    </div>
  </div>
</template>
