<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

export interface SettingsRailItem {
  value: string
  label: string
  icon?: string
}

export interface SettingsRailGroup {
  heading?: string
  items: readonly SettingsRailItem[]
}

const props = defineProps<{
  label: string
  value: string
  groups: readonly SettingsRailGroup[]
  leadingItem?: SettingsRailItem
}>()

defineEmits<{ 'update:value': [value: string] }>()

const groups = computed(() => props.leadingItem
  ? [{ items: [props.leadingItem] }, ...props.groups]
  : props.groups)

function moveFocus(event: KeyboardEvent) {
  const items = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('.kx-settings-rail-item')]
  const index = items.indexOf(event.target as HTMLButtonElement)
  if (index < 0) return

  let next: number
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      next = (index + 1) % items.length
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      next = (index + items.length - 1) % items.length
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = items.length - 1
      break
    default:
      return
  }

  event.preventDefault()
  items[next]?.focus()
}
</script>

<template>
  <nav class="kx-settings-rail" :aria-label="label" @keydown="moveFocus">
    <div v-for="(group, groupIndex) in groups" :key="group.items[0]?.value ?? groupIndex"
      class="kx-settings-rail-section" :class="{ 'kx-settings-rail-leading': leadingItem && groupIndex === 0 }">
      <div v-if="group.heading" class="kx-settings-rail-group">{{ group.heading }}</div>
      <button v-for="item in group.items" :key="item.value" type="button"
        class="kx-settings-rail-item" :aria-current="item.value === value ? 'true' : undefined"
        @click="$emit('update:value', item.value)">
        <Icon v-if="item.icon" class="kx-settings-rail-icon" :icon="item.icon" aria-hidden="true" />
        <span class="kx-settings-rail-label">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>
