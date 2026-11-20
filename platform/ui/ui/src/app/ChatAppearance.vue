<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import ToggleSwitch from 'primevue/toggleswitch'
import { host } from '@wippy-fe/proxy'
import type { ChatAppearance, ChatProfile } from '@widgets/chatAppearance'
import { followChatIntroLink, renderChatIntro } from '@widgets/chatIntroMarkdown'

const appearance = defineModel<ChatAppearance>({ required: true })
const profiles = [
  { key: 'sessions', label: 'Sessions page', icon: 'tabler:messages' },
  { key: 'sidebar', label: 'Sidebar chat', icon: 'tabler:layout-sidebar-right' },
] as const
const placements = [{ label: 'First', value: 'first' }, { label: 'Last', value: 'last' }]
const intros = [
  { label: 'Default', value: 'default' },
  { label: 'Custom Markdown', value: 'markdown' },
  { label: 'Hidden', value: 'hidden' },
]
const alignments = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]
const agentScopes = [{ label: 'All available agents', value: 'all' }, { label: 'Selected agents', value: 'selected' }]
const previews = computed(() => Object.fromEntries(profiles.map(({ key }) => {
  const profile = appearance.value[key]
  return [key, profile.intro === 'markdown' ? renderChatIntro(profile.markdown) : '']
})))

function selectedAgents(event: Event): string[] | undefined {
  const selected = (event as CustomEvent<{ selected?: string[] }>).detail?.selected
  return Array.isArray(selected) ? selected.filter(id => typeof id === 'string') : undefined
}

function setRestriction(profile: ChatProfile, restricted: boolean) {
  if (restricted) profile.allowed_agents = profile.default_agent ? [profile.default_agent] : []
  else delete profile.allowed_agents
}

function changeAllowed(profile: ChatProfile, event: Event) {
  const ids = selectedAgents(event)
  if (ids) profile.allowed_agents = ids
}

function changeDefault(profile: ChatProfile, event: Event) {
  const ids = selectedAgents(event)
  if (ids?.[0]) profile.default_agent = ids[0]
  else if (ids) delete profile.default_agent
}
</script>

<template>
  <section class="ap-card chat-appearance" aria-labelledby="chat-appearance-heading">
    <h2 id="chat-appearance-heading" class="ap-h">Chat</h2>

    <fieldset class="chat-settings chat-nav-settings">
      <legend class="chat-settings-legend">Main navigation</legend>
      <div class="chat-settings-title" aria-hidden="true">
        <span class="chat-settings-icon"><Icon icon="tabler:menu-2" /></span>
        Main navigation
      </div>
      <div class="chat-nav-controls">
        <div class="chat-nav-visibility">
          <ToggleSwitch v-model="appearance.navigation.visible" input-id="chat-nav-visible" />
          <label for="chat-nav-visible">Show New chat</label>
        </div>
        <div class="chat-field chat-placement">
          <span id="chat-placement-label">Placement</span>
          <Select v-model="appearance.navigation.placement" :options="placements" option-label="label" option-value="value"
            :disabled="!appearance.navigation.visible" aria-labelledby="chat-placement-label" fluid />
        </div>
      </div>
    </fieldset>

    <div class="chat-profile-grid">
      <fieldset v-for="{ key, label, icon } in profiles" :key="key" class="chat-settings">
        <legend class="chat-settings-legend">{{ label }}</legend>
        <div class="chat-settings-title" aria-hidden="true">
          <span class="chat-settings-icon"><Icon :icon="icon" /></span>
          {{ label }}
        </div>

        <div class="chat-setting-toggles">
          <div class="chat-setting-toggle">
            <label :for="`chat-${key}-message`">Show message field</label>
            <ToggleSwitch v-model="appearance[key].show_message" :input-id="`chat-${key}-message`" />
          </div>
          <div class="chat-setting-toggle">
            <label :for="`chat-${key}-picker`">Show agent picker</label>
            <ToggleSwitch v-model="appearance[key].show_agent_picker" :input-id="`chat-${key}-picker`" />
          </div>
        </div>

        <div class="chat-intro-options">
          <div class="chat-field">
            <span :id="`chat-${key}-intro-label`">Intro</span>
            <Select v-model="appearance[key].intro" :options="intros" option-label="label" option-value="value"
              :aria-labelledby="`chat-${key}-intro-label`" fluid />
          </div>
          <div v-if="appearance[key].intro === 'markdown'" class="chat-field">
            <span :id="`chat-${key}-alignment-label`">Text alignment</span>
            <Select v-model="appearance[key].markdown_alignment" :options="alignments" option-label="label" option-value="value"
              :aria-labelledby="`chat-${key}-alignment-label`" fluid />
          </div>
        </div>
        <template v-if="appearance[key].intro === 'markdown'">
          <label class="chat-field">
            <span>Intro Markdown</span>
            <Textarea v-model="appearance[key].markdown" rows="4" fluid />
          </label>
          <details class="chat-preview">
            <summary>Preview intro</summary>
            <div
              class="kx-chat-intro-markdown"
              :data-alignment="appearance[key].markdown_alignment"
              v-html="previews[key]"
              @click="followChatIntroLink($event, host.navigate)"
            />
          </details>
        </template>

        <div class="chat-field">
          <span :id="`chat-${key}-available-label`">Available agents</span>
          <Select
            :model-value="appearance[key].allowed_agents === undefined ? 'all' : 'selected'"
            :options="agentScopes"
            option-label="label"
            option-value="value"
            :aria-labelledby="`chat-${key}-available-label`"
            fluid
            @update:model-value="setRestriction(appearance[key], $event === 'selected')"
          />
        </div>
        <div v-if="appearance[key].allowed_agents" class="chat-field">
          <span>Allowed agents</span>
          <wc-agent-picker
            :selected.attr="JSON.stringify(appearance[key].allowed_agents)"
            placeholder="Search for agents to allow"
            @change.stop="changeAllowed(appearance[key], $event)"
          />
        </div>

        <div v-if="!appearance[key].show_agent_picker" class="chat-field">
          <span>Default agent</span>
          <wc-agent-picker
            multi="false"
            :selected.attr="JSON.stringify(appearance[key].default_agent ? [appearance[key].default_agent] : [])"
            placeholder="Select the default agent"
            @change.stop="changeDefault(appearance[key], $event)"
          />
        </div>
      </fieldset>
    </div>
  </section>
</template>
