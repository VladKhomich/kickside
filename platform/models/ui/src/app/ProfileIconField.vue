<script setup lang="ts">
import IconField from '@widgets/app/IconField.vue'
import { FormField } from './shared'

const icon = defineModel<string>({ required: true })
defineProps<{ fallback?: string; disabled?: boolean }>()
</script>

<template>
  <FormField label="Provider icon">
    <IconField v-model="icon" :fallback="fallback || 'tabler:cpu'" :inert="disabled" />
  </FormField>
</template>
