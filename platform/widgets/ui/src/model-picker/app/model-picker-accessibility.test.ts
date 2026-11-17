// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import ModelPicker from './ModelPicker.vue'

const pickerProps = vi.hoisted(() => ({ value: 'class:fast', capability: 'generate', label: 'Default model', description: 'Model used for new conversations.' }))
vi.mock('@wippy-fe/proxy', () => ({ api: { get: vi.fn(async () => ({ data: { success: true, models: [], classes: [] } })) } }))
vi.mock('../constants.ts', () => ({ useComponentProps: () => ref(pickerProps), useComponentEvents: () => vi.fn() }))
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span />' } }))
let wrapper: VueWrapper
afterEach(() => wrapper?.unmount())
describe('setting names across the picker shadow boundary', () => {
  it('uses the supplied setting name and description on the focused combobox', async () => {
    wrapper = mount(ModelPicker, { global: { plugins: [PrimeVuePlugin] } })
    await flushPromises()
    const input = wrapper.get('[role=combobox]')
    expect(input.attributes('aria-label')).toBe('Default model')
    expect(input.attributes('aria-description')).toBe('Model used for new conversations.')
  })
})
