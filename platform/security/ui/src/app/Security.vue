<script setup lang="ts">
import SystemTabs from '@kickside/ui-kit/SystemTabs.vue'
import { computed, nextTick, onUnmounted, ref, shallowRef } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import type { Policy, Scope, ScopeDraft } from '../types.ts'
import { Button, EmptyState, FormField, IconButton, Notice, Pill, RailHeader, SearchField, Shell, Spinner, TextInput } from './shared'
import Delegations from './Delegations.vue'
import PolicyCard from './PolicyCard.vue'
import { messageOf, useSecurityApi } from './useSecurityApi.ts'

// kickside-security — roles/scopes admin. Rail lists scopes (built-in groups +
// registry scopes read-only, DB-backed custom scopes editable). Selecting a
// custom scope (or New) opens the two-pane builder: drag assignable permissions from the
// palette into the scope, reorder, remove. Saving writes the DB row; the projection
// service materializes it as a security.scope registry entry.
const store = useSecurityApi()
const { scopes, assignablePolicies, loading, saving, error } = store

const railSearch = ref('')
const paletteSearch = ref('')
const selectedId = ref<string | null>(null)
const draft = ref<ScopeDraft | null>(null)
const technicalDetails = ref<HTMLDetailsElement | null>(null)
const composition = shallowRef<{ scope: Scope | null; loading: boolean; error: string } | null>(null)
const openingOverlay = ref(false)
const lockedPolicyIds = shallowRef(new Set<string>())
let selection = 0

const activeTab = ref('scopes')
const delegationPanel = ref<InstanceType<typeof Delegations> | null>(null)
const delegationsOpened = ref(false)
async function selectTab(value: string | number) {
  activeTab.value = String(value)
  if (value !== 'delegations') return
  delegationsOpened.value = true
  await nextTick()
  await delegationPanel.value?.load()
}
async function refreshRoles() {
  resetComposition()
  await store.load()
}

useHostVisibilityRefresh(async () => {
  await refreshRoles()
  if (activeTab.value === 'delegations') await delegationPanel.value?.load()
})

const filteredScopes = computed(() => {
  const q = railSearch.value.trim().toLowerCase()
  const match = (s: Scope) => !q || s.label.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
  return {
    custom: scopes.value.filter(s => s.source === 'custom' && match(s)),
    builtin: scopes.value.filter(s => s.source !== 'custom' && match(s)),
  }
})

const selectedScope = computed(() => scopes.value.find(s => s.id === selectedId.value) || null)
const readOnlyScope = computed(() => (selectedScope.value && selectedScope.value.source !== 'custom') ? selectedScope.value : null)
const isOverlay = computed(() => !!draft.value?.target)
const originalPolicies = computed(() => readOnlyScope.value?.policies ?? [])
const basePolicies = computed(() => isOverlay.value ? originalPolicies.value : [])

const assignableById = computed(() => new Map(assignablePolicies.value.map(policy => [policy.id, policy])))
const draftPolicies = computed(() => {
  const role = selectedScope.value
  const stored = isOverlay.value ? role?.overlay_policies : role?.policies
  return new Map((stored ?? []).map(policy => [policy.id, policy]))
})
const selectedPolicies = computed(() => (draft.value?.policyIds ?? [])
  .map(id => draftPolicies.value.get(id) ?? assignableById.value.get(id) ?? { id, available: false }))

function resetComposition() {
  selection++
  openingOverlay.value = false
  composition.value = null
  if (technicalDetails.value) technicalDetails.value.open = false
}

async function showComposition(event: Event) {
  const details = event.currentTarget as HTMLDetailsElement
  const role = readOnlyScope.value
  if (!details.open || !role || (composition.value && !composition.value.error)) return
  const pending = { scope: null, loading: true, error: '' }
  composition.value = pending
  try {
    const full = await store.loadComposition(role.id)
    if (composition.value !== pending) return
    composition.value = { scope: full, loading: false, error: '' }
  }
  catch (e) {
    if (composition.value !== pending) return
    composition.value = { scope: null, loading: false, error: messageOf(e, 'Failed to load technical policies') }
  }
}

const technicalPolicies = computed(() => {
  const full = composition.value?.scope
  if (!full) return []
  const visible = new Set(originalPolicies.value.map(policy => policy.id))
  return (full.base_policies ?? full.policies).filter(policy => !visible.has(policy.id))
})

function copyablePolicyIds(role: Scope): string[] {
  return [...new Set([...role.policies, ...(role.overlay_policies ?? [])]
    .filter(policy => policy.available !== false && assignableById.value.has(policy.id))
    .map(policy => policy.id))]
}
const canCopy = computed(() => selectedScope.value && copyablePolicyIds(selectedScope.value).length > 0)

const palettePolicies = computed<Policy[]>(() => {
  if (!draft.value) return []
  // Exclude already-chosen extensions and, for an overlay, the locked base
  // policies (base can't be re-added).
  const chosen = new Set([...draft.value.policyIds, ...(isOverlay.value ? lockedPolicyIds.value : [])])
  const q = paletteSearch.value.trim().toLowerCase()
  return assignablePolicies.value.filter(p => !chosen.has(p.id)
    && (!q || (p.title || '').toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || (p.comment || '').toLowerCase().includes(q)))
})

function selectScope(s: Scope) {
  resetComposition()
  paletteSearch.value = ''
  selectedId.value = s.id
  draft.value = s.source === 'custom'
    ? { slug: s.slug || '', label: s.label, description: s.description, policyIds: s.policies.map(p => p.id), enabled: s.enabled, isNew: false, target: '' }
    : null
}

function newScope() {
  resetComposition()
  paletteSearch.value = ''
  selectedId.value = null
  draft.value = { slug: Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join(''), label: '', description: '', policyIds: [], enabled: true, isNew: true, target: '' }
}

function copyScope(s: Scope) {
  const policyIds = copyablePolicyIds(s)
  if (!policyIds.length) return
  newScope()
  Object.assign(draft.value!, {
    label: s.label ? `Copy of ${s.label}` : '',
    description: s.description,
    policyIds,
  })
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '')
}

// Extend a built-in/registry scope via an overlay: base policies stay locked
// (can't be removed), the admin adds extra policies that union onto the default.
async function openOverlay(s: Scope) {
  const started = selection
  openingOverlay.value = true
  try {
    const full = composition.value?.scope ?? await store.loadComposition(s.id)
    if (started !== selection) return
    resetComposition()
    paletteSearch.value = ''
    lockedPolicyIds.value = new Set((full.base_policies ?? full.policies).map(policy => policy.id))
    draft.value = {
      slug: s.overlay_slug || sanitizeId(s.id),
      label: s.label || shortId(s.id),
      description: s.description,
      policyIds: (s.overlay_policies ?? []).map(p => p.id),
      enabled: true,
      isNew: !s.overlay_slug,
      target: s.id,
    }
  }
  catch (e) {
    if (started === selection) error.value = messageOf(e, 'Failed to open the role extension')
  }
  finally {
    if (started === selection) openingOverlay.value = false
  }
}

function addPolicy(id: string, index?: number) {
  if (!draft.value || draft.value.policyIds.includes(id) || (isOverlay.value && lockedPolicyIds.value.has(id))) return
  if (assignableById.value.has(id)) draft.value.policyIds.splice(index ?? draft.value.policyIds.length, 0, id)
}
function removePolicy(id: string) {
  if (draft.value) draft.value.policyIds = draft.value.policyIds.filter(policyId => policyId !== id)
}

function onPaneDrop(e: DragEvent) {
  const id = e.dataTransfer?.getData('text/plain')
  if (id) addPolicy(id)
}
function onRowDrop(e: DragEvent, targetId: string) {
  e.stopPropagation()
  const id = e.dataTransfer?.getData('text/plain')
  if (!id || !draft.value || id === targetId) return
  const selected = draft.value.policyIds
  const from = selected.indexOf(id)
  if (from === -1) {
    addPolicy(id, selected.indexOf(targetId))
    return
  }
  selected.splice(from, 1)
  selected.splice(selected.indexOf(targetId), 0, id)
}

const draftSlug = computed(() => {
  if (!draft.value) return ''
  if (!draft.value.isNew || draft.value.target) return draft.value.slug
  const base = sanitizeId(draft.value.label.normalize('NFKD').replace(/\p{M}/gu, '')).toLowerCase() || 'role'
  return `${base}_${draft.value.slug}`
})
const canSave = computed(() => !!draft.value && draft.value.label.trim() !== ''
  && (!draft.value.isNew || draft.value.policyIds.length > 0))

// Transient confirmation after a successful save — the save button's spinner
// alone left it ambiguous whether the change persisted.
const savedMsg = ref('')
let savedTimer: ReturnType<typeof setTimeout> | null = null
onUnmounted(() => { if (savedTimer) clearTimeout(savedTimer) })
function flashSaved(msg: string) {
  savedMsg.value = msg
  if (savedTimer) clearTimeout(savedTimer)
  savedTimer = setTimeout(() => { savedMsg.value = '' }, 3000)
}

async function save() {
  if (!draft.value || !canSave.value) return
  const savedDraft = draft.value
  const slug = draftSlug.value
  const target = draft.value.target
  const label = draft.value.label.trim() || slug
  const ok = await store.saveScope({
    slug,
    target,
    label: draft.value.label.trim(),
    description: draft.value.description.trim(),
    policies: [...draft.value.policyIds],
    enabled: draft.value.enabled,
  })
  if (ok) {
    savedDraft.slug = slug
    savedDraft.isNew = false
    if (draft.value === savedDraft) selectedId.value = target || `kickside.security.scopes:${slug}`
    flashSaved(`Saved “${label}”. The role will be available when assigning users.`)
  }
}

async function askDelete() {
  if (!draft.value || draft.value.isNew) return
  const overlay = isOverlay.value
  const ok = await host.confirm({
    header: overlay ? 'Remove extension?' : 'Delete role?',
    message: overlay
      ? 'This removes the added permissions. Users keep the role’s original permissions.'
      : 'This removes the custom role and its permissions.',
    icon: 'tabler:trash',
    acceptLabel: overlay ? 'Remove extension' : 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
  })
  if (!ok) return
  const deleted = await store.deleteScope(draft.value.slug)
  if (deleted) { draft.value = null; selectedId.value = null }
}

function shortId(id: string): string {
  return id.includes(':') ? id.split(':').slice(-1)[0]! : id
}
</script>

<template>
  <div class="ks">
    <SystemTabs :value="activeTab" label="Security administration" :items="[
      { value: 'scopes', label: 'Roles' },
      { value: 'delegations', label: 'Run as' },
    ]" @update:value="selectTab" />
    <Delegations v-if="delegationsOpened" v-show="activeTab === 'delegations'" ref="delegationPanel" :scopes="scopes" />
    <Notice v-if="error" severity="danger" class="ks-top-notice" @dismiss="error = ''">{{ error }}</Notice>
    <Notice v-else-if="savedMsg" severity="success" class="ks-top-notice" @dismiss="savedMsg = ''">{{ savedMsg }}</Notice>

    <Spinner v-if="activeTab === 'scopes' && loading && !scopes.length" label="Loading security…" />

    <Shell v-else v-show="activeTab === 'scopes'">
      <template #rail>
        <RailHeader title="Roles" :count="scopes.length">
          <template #actions>
            <IconButton icon="tabler:plus" label="New role" :disabled="saving" @click="newScope" />
            <IconButton icon="tabler:refresh" label="Refresh" :disabled="loading" :spin="loading" @click="refreshRoles" />
          </template>
        </RailHeader>

        <div class="ks-rail-search">
          <SearchField v-model="railSearch" placeholder="Find a role…" />
        </div>

        <div class="ks-rail-list">
          <div v-if="filteredScopes.custom.length" class="ks-rail-group">Custom</div>
          <button
            v-for="s in filteredScopes.custom"
            :key="s.id"
            class="ks-scope-row"
            :class="{ active: s.id === selectedId }"
            @click="selectScope(s)"
          >
            <span class="ks-scope-name">{{ s.label || shortId(s.id) }}</span>
          </button>

          <div class="ks-rail-group">Default</div>
          <button
            v-for="s in filteredScopes.builtin"
            :key="s.id"
            class="ks-scope-row"
            :class="{ active: s.id === selectedId }"
            @click="selectScope(s)"
          >
            <span class="ks-scope-name">{{ s.label || shortId(s.id) }}</span>
          </button>
        </div>
      </template>

      <!-- Builder: new/custom scope, or an overlay extending a platform scope -->
      <div v-if="draft" class="ks-builder">
        <div class="ks-builder-head">
          <div class="ks-builder-title">
            <Icon :icon="isOverlay ? 'tabler:stack-2' : 'tabler:shield-lock'" aria-hidden="true" />
            <span>{{ isOverlay ? `Extend ${draft.label || shortId(draft.target)}` : (draft.isNew ? 'New role' : draft.label || draft.slug) }}</span>
            <Pill v-if="isOverlay" severity="warn">Additional permissions</Pill>
          </div>
          <div class="ks-builder-acts">
            <Button v-if="!draft.isNew && !isOverlay && selectedScope" variant="soft" small icon="tabler:copy" :disabled="saving || !canCopy" @click="copyScope(selectedScope)">Copy permissions</Button>
            <Button v-if="!draft.isNew" variant="danger" small icon="tabler:trash" :disabled="saving" @click="askDelete">{{ isOverlay ? 'Remove extension' : 'Delete' }}</Button>
            <Button variant="primary" small icon="tabler:device-floppy" :loading="saving" :disabled="!canSave" @click="save">{{ isOverlay ? 'Save extension' : 'Save role' }}</Button>
          </div>
        </div>

        <div v-if="isOverlay" class="ks-overlay-warn">
          <Icon icon="tabler:alert-triangle" aria-hidden="true" />
          <span>Adding permissions grants them to <b>everyone assigned {{ selectedScope?.label || shortId(draft.target) }}</b>. You can remove permissions added by this extension. To restrict access, create a new role with only the permissions needed.</span>
        </div>
        <p v-else class="ks-view-note">Choose the permissions this role grants, then assign it in System → Users. To restrict a Member, assign this role instead of Member; other assigned roles may still grant access.</p>

        <div class="ks-fields">
          <FormField label="Name">
            <TextInput v-model="draft.label" placeholder="Reviewer" />
          </FormField>
          <FormField label="Description">
            <TextInput v-model="draft.description" placeholder="Read-only reviewer role" />
          </FormField>
        </div>

        <div class="ks-panes" :class="{ three: isOverlay }">
          <section v-if="isOverlay" class="ks-pane locked-pane">
            <header class="ks-pane-head">
              <span>Original assignable permissions</span>
              <span class="ks-pane-sub">{{ basePolicies.length }} · locked</span>
            </header>
            <div class="ks-pane-body">
              <PolicyCard v-for="p in basePolicies" :key="p.id" :policy="p" mode="locked" />
              <div v-if="!basePolicies.length" class="ks-pane-empty">No original permissions available to assign.</div>
            </div>
          </section>

          <section class="ks-pane">
            <header class="ks-pane-head">
              <span>Available permissions</span>
              <span class="ks-pane-sub">Click + to add</span>
            </header>
            <div class="ks-pane-search"><SearchField v-model="paletteSearch" placeholder="Search permissions…" /></div>
            <div class="ks-pane-body">
              <PolicyCard
                v-for="p in palettePolicies"
                :key="p.id"
                :policy="p"
                mode="palette"
                @add="addPolicy(p.id)"
              />
              <div v-if="!palettePolicies.length" class="ks-pane-empty">No matching permissions.</div>
            </div>
          </section>

          <section class="ks-pane drop" @dragover.prevent @drop="onPaneDrop">
            <header class="ks-pane-head">
              <span>{{ isOverlay ? 'Added by you' : 'In this role' }}</span>
              <span class="ks-pane-sub">{{ selectedPolicies.length }} {{ selectedPolicies.length === 1 ? 'permission' : 'permissions' }}</span>
            </header>
            <div class="ks-pane-body">
              <div
                v-for="p in selectedPolicies"
                :key="p.id"
                @dragover.prevent
                @drop="onRowDrop($event, p.id)"
              >
                <PolicyCard :policy="p" mode="selected" @remove="removePolicy(p.id)" />
              </div>
              <div v-if="!selectedPolicies.length" class="ks-drop-hint">
                <Icon icon="tabler:drag-drop" aria-hidden="true" />
                <span>Use + on an available permission, or drag it here.</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Read-only view for a built-in / registry scope -->
      <div v-else-if="readOnlyScope" class="ks-view">
        <div class="ks-builder-head">
          <div class="ks-builder-title">
            <Icon icon="tabler:shield" aria-hidden="true" />
            <span>{{ readOnlyScope.label || shortId(readOnlyScope.id) }}</span>
          </div>
          <div class="ks-builder-acts">
            <Button variant="primary" small icon="tabler:stack-2" :loading="openingOverlay" :disabled="composition?.loading" @click="openOverlay(readOnlyScope)">{{ readOnlyScope.overlay_slug ? 'Edit extension' : 'Add permissions' }}</Button>
            <Button variant="soft" small icon="tabler:copy" :disabled="!canCopy" @click="copyScope(readOnlyScope)">Copy permissions</Button>
          </div>
        </div>
        <p v-if="readOnlyScope.description" class="ks-view-note">{{ readOnlyScope.description }}</p>
        <p class="ks-view-note">
          Adding permissions affects everyone with this role. Copy permissions starts a custom role with the permissions available to assign.
        </p>
        <section class="ks-view-list">
          <header class="ks-pane-head">Assignable permissions</header>
          <div class="ks-pane-body">
            <PolicyCard v-for="p in originalPolicies" :key="p.id" :policy="p" mode="locked" />
            <div v-if="!originalPolicies.length" class="ks-pane-empty">No assignable permissions in the original role.</div>
          </div>
        </section>
        <details :key="readOnlyScope.id" ref="technicalDetails" class="ks-technical" @toggle="showComposition">
          <summary>Technical policies</summary>
          <Spinner v-if="composition?.loading" label="Loading technical policies…" />
          <p v-else-if="composition?.error" class="ks-view-note" role="alert">{{ composition.error }}. Reopen to try again.</p>
          <ul v-else-if="technicalPolicies.length" class="ks-technical-list">
            <li v-for="p in technicalPolicies" :key="p.id"><code>{{ p.id }}</code></li>
          </ul>
          <p v-else-if="composition" class="ks-view-note">No additional technical policies.</p>
        </details>

        <div v-if="readOnlyScope.overlay_policies && readOnlyScope.overlay_policies.length" class="ks-ext-block">
          <div class="ks-ext-head">
            <Icon icon="tabler:stack-2" aria-hidden="true" />
            <span>Additional permissions</span>
            <Pill severity="warn">{{ readOnlyScope.overlay_policies.length }}</Pill>
          </div>
          <div class="ks-pane-body ks-view-list">
            <PolicyCard v-for="p in readOnlyScope.overlay_policies" :key="p.id" :policy="p" mode="locked" />
          </div>
        </div>
      </div>

      <div v-else class="kx-system-body">
      <EmptyState
        icon="tabler:shield-lock"
        title="Roles"
        hint="Choose a role to view its permissions, or create one with the permissions your team needs. Assign roles in System → Users."
        cta="New role"
        cta-icon="tabler:plus"
        @cta="newScope"
      />
      </div>
    </Shell>
  </div>
</template>
