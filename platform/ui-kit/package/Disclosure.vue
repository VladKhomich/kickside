<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'

defineProps<{ label: string }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Accordion class="kx-disclosure" :value="open ? 'content' : undefined" @update:value="open = $event === 'content'">
    <AccordionPanel class="kx-disclosure-panel" value="content">
      <AccordionHeader class="kx-disclosure-toggle">{{ label }}</AccordionHeader>
      <AccordionContent :pt="{
        transition: { name: 'kx-disclosure-motion' },
        contentWrapper: { class: 'kx-disclosure-content' },
      }"><slot /></AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
