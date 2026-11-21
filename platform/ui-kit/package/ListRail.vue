<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ title: string; count?: number; settings?: boolean }>()

const titleId = useId()
</script>

<template>
  <aside class="kx-rail" :class="{ 'kx-settings-list-rail': settings }" :aria-labelledby="titleId">
    <div class="kx-railhead">
      <span :id="titleId" class="kx-railhead-title">{{ title }}<b v-if="count !== undefined">{{ count }}</b></span>
      <div class="kx-railhead-acts"><slot name="actions" /></div>
    </div>
    <slot name="toolbar" />
    <div class="kx-rail-body"><slot /></div>
  </aside>
</template>
