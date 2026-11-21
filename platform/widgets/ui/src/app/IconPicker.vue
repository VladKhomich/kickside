<script setup lang="ts">
import { ref, watch, nextTick, computed, shallowRef } from 'vue'
import { Icon, listIcons } from '@iconify/vue'
import tablerFingerprint from 'virtual:tabler-icon-names/fingerprint'
import { useComponentProps, useComponentEvents } from '../constants.ts'
import AnchoredPanel from './AnchoredPanel.vue'
import { iconNamesFingerprint, searchIconNames } from './iconSearch'

// Shared Tabler icon picker: a trigger showing the current glyph, opening a
// searchable popover. Default view shows common icons; typing searches Tabler
// names from the shared Iconify store and the bundled name index. The popover
// renders inside the shadow root (so its styles apply)
// and is fixed-positioned via place(), so surrounding scroll/overflow containers
// never clip it — it is not teleported to <body> (that would leave the shadow
// root and lose styling). Selection is reported via the `select` event.
const props = useComponentProps()
const emit = useComponentEvents()
const PREFIX = 'tabler'

const COMMON = [
  'tabler:home', 'tabler:layout-dashboard', 'tabler:inbox', 'tabler:bell', 'tabler:robot',
  'tabler:bolt', 'tabler:bulb', 'tabler:files', 'tabler:folder', 'tabler:books',
  'tabler:database', 'tabler:plug', 'tabler:settings', 'tabler:adjustments', 'tabler:users',
  'tabler:user', 'tabler:message-circle', 'tabler:messages', 'tabler:search', 'tabler:chart-bar',
  'tabler:chart-line', 'tabler:calendar', 'tabler:clock', 'tabler:star', 'tabler:heart',
  'tabler:flag', 'tabler:tag', 'tabler:bookmark', 'tabler:rocket', 'tabler:flask',
  'tabler:brain', 'tabler:cloud', 'tabler:world', 'tabler:link', 'tabler:mail',
  'tabler:device-laptop', 'tabler:terminal', 'tabler:code', 'tabler:package', 'tabler:packages',
  'tabler:shield', 'tabler:lock', 'tabler:key', 'tabler:eye', 'tabler:list',
  'tabler:layout-list', 'tabler:apps', 'tabler:grid-dots', 'tabler:check', 'tabler:circle',
]

const open = ref(false)
const query = ref('')
const catalogue = shallowRef<string[]>([])
const loading = ref(false)
const catalogueReady = ref(false)
const catalogueUnavailable = ref(false)
const trigger = ref<HTMLElement | null>(null)
const searchEl = ref<HTMLInputElement | null>(null)

// useProps() returns a ref whose .value is the props object, so the bound props
// are props.value.<name>.
const current = computed(() => { const v = props.value?.value; return typeof v === 'string' ? v : '' })
const fallback = computed(() => { const f = props.value?.fallback; return typeof f === 'string' ? f : '' })
const searching = computed(() => Boolean(query.value.trim()))
const results = computed(() => {
  if (!searching.value) return COMMON
  return searchIconNames([...listIcons('', PREFIX), ...catalogue.value], PREFIX, query.value)
})

watch(searching, async (active) => {
  if (!active || catalogueReady.value || loading.value || catalogueUnavailable.value) return
  loading.value = true
  try {
    const registered = listIcons('', PREFIX)
    if (await iconNamesFingerprint(registered, PREFIX) !== tablerFingerprint) {
      const { default: names } = await import('virtual:tabler-icon-names')
      catalogue.value = names.split('\n').map(name => PREFIX + ':' + name)
    }
    catalogueReady.value = true
  } catch {
    catalogueUnavailable.value = true
  } finally {
    loading.value = false
  }
})

// Placement, outside-click and Escape are owned by AnchoredPanel.
function toggle() {
  if (open.value) { open.value = false; return }
  open.value = true
  nextTick(() => searchEl.value?.focus())
}
function pick(name: string) { emit('select', name); open.value = false }
function reset() { emit('select', ''); open.value = false }
</script>

<template>
  <!-- Single root: WippyVueElement mounts one root node. The trigger and the
       fixed popover live inside a display:contents wrapper so the layout is
       unchanged but the component still has exactly one root. -->
  <div class="ip-root">
    <button
      ref="trigger"
      type="button"
      class="ip-trigger"
      :class="open && 'ip-on'"
      title="Choose icon"
      aria-label="Choose icon"
      @click.stop="toggle"
    >
      <Icon :icon="current || fallback || 'tabler:mood-smile'" aria-hidden="true" />
      <Icon icon="tabler:chevron-down" class="ip-caret" aria-hidden="true" />
    </button>

    <AnchoredPanel v-model:open="open" :anchor="trigger" :width="304" :max-height="360" :gap="6">
      <div class="ip-pop" @click.stop>
        <div class="ip-search">
          <Icon icon="tabler:search" aria-hidden="true" />
          <input ref="searchEl" v-model="query" placeholder="Search Tabler icons…" spellcheck="false" />
          <button v-if="current" type="button" class="ip-reset" @click="reset">Reset</button>
        </div>
        <div v-if="searching && catalogueUnavailable" class="ip-state" role="status">Some icons are unavailable.</div>
        <div v-if="searching && loading && !results.length" class="ip-state" role="status">Loading icon names…</div>
        <div v-else-if="searching && !results.length && !catalogueUnavailable" class="ip-state">No icons for “{{ query }}”.</div>
        <div v-else-if="results.length" class="ip-grid">
          <button
            v-for="name in results"
            :key="name"
            type="button"
            class="ip-cell"
            :class="name === current && 'ip-cell-on'"
            :title="name.replace('tabler:', '')"
            :aria-label="name.replace('tabler:', '')"
            @click="pick(name)"
          ><Icon :icon="name" aria-hidden="true" /></button>
        </div>
      </div>
    </AnchoredPanel>
  </div>
</template>
