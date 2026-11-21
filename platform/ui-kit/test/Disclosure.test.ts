// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import PrimeVue from 'primevue/config'
import Disclosure from '../package/Disclosure.vue'

it('uses an accessible PrimeVue toggle and preserves the collapsed content', async () => {
  const view = mount(Disclosure, {
    attachTo: document.body,
    props: { label: 'Advanced options' },
    slots: { default: () => h('input') },
    global: { plugins: [PrimeVue] },
  })
  const toggle = view.get('button')
  const region = view.get('[role=region]')
  expect(toggle.text()).toBe('Advanced options')
  expect(toggle.attributes('type')).toBe('button')
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(toggle.attributes('aria-controls')).toBe(region.attributes('id'))
  expect(region.attributes('aria-labelledby')).toBe(toggle.attributes('id'))
  expect(toggle.get('svg').attributes('aria-hidden')).toBe('true')
  expect(region.isVisible()).toBe(false)

  await toggle.trigger('keydown', { code: 'Enter' })
  expect(toggle.attributes('aria-expanded')).toBe('true')
  expect(view.emitted('update:open')).toEqual([[true]])
  expect(region.isVisible()).toBe(true)
  await region.get('input').setValue('edited')
  await toggle.trigger('click')
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(view.emitted('update:open')).toEqual([[true], [false]])
  await toggle.trigger('click')
  expect(region.get('input').element.value).toBe('edited')
  view.unmount()
})

it('supports host-controlled opening and closing', async () => {
  const open = ref(true)
  const view = mount(defineComponent({
    components: { Disclosure },
    setup: () => ({ open }),
    template: '<Disclosure label="Advanced options" v-model:open="open" />',
  }), { global: { plugins: [PrimeVue] } })
  const toggle = view.get('button')
  expect(toggle.attributes('aria-expanded')).toBe('true')
  await toggle.trigger('click')
  expect(open.value).toBe(false)
  open.value = true
  await view.vm.$nextTick()
  expect(toggle.attributes('aria-expanded')).toBe('true')
  view.unmount()
})
