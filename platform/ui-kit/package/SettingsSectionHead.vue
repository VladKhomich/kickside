<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>

<template>
  <header class="system-section-head">
    <div class="system-section-head-text">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="kx-head-actions"><slot name="actions" /></div>
  </header>
</template>
