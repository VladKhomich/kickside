<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'

defineProps<{ createLabel: string }>()
defineEmits<{ create: []; defaults: [] }>()
</script>

<template>
  <Button type="button" text :aria-label="createLabel" :title="createLabel" @click="$emit('create')">
    <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
  </Button>
  <Button type="button" text aria-label="Application defaults" title="Application defaults" @click="$emit('defaults')">
    <template #icon><Icon icon="tabler:settings" aria-hidden="true" /></template>
  </Button>
</template>
