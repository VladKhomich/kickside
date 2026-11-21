<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

defineProps<{ busy?: boolean; discardDisabled?: boolean; reviewDisabled?: boolean }>()
defineEmits<{ discard: []; review: [opener: HTMLElement] }>()
</script>

<template>
  <Tag severity="warn" value="Unsaved changes" />
  <Button label="Discard" type="button" severity="secondary" outlined :disabled="busy || discardDisabled" @click="$emit('discard')">
    <template #icon><Icon icon="tabler:restore" aria-hidden="true" /></template>
  </Button>
  <Button label="Review changes" type="button" :disabled="busy || reviewDisabled" :loading="busy"
    @click="$emit('review', $event.currentTarget as HTMLElement)" />
</template>
