// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { api } from '@wippy-fe/proxy'
import ModelPicker from './ModelPicker.vue'

const pickerProps = vi.hoisted(() => ({ value: 'class:fast', capability: 'vision' }))
vi.mock('@wippy-fe/proxy', () => ({ api: { get: vi.fn() } }))
vi.mock('../constants.ts', () => ({
  useComponentProps: () => ref(pickerProps),
  useComponentEvents: () => vi.fn(),
}))
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span />' } }))
vi.mock('primevue/select', () => ({
  default: { name: 'Select', props: ['options', 'modelValue', 'loading'], emits: ['before-show'], template: '<div />' },
}))

describe('capability-filtered class selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pickerProps.capability = 'vision'
  })

  it('offers models and classes whose resolved model has the requested capability', async () => {
    vi.mocked(api.get).mockImplementation(async (url: string) => ({ data: url.includes('/classes')
      ? { success: true, classes: [
          { name: 'fast', capability: 'generate', models: [{ name: 'image-model', title: 'Image model' }] },
          { name: 'text', capability: 'generate', models: [{ name: 'text-model', title: 'Text model' }] },
          { name: 'mixed', capability: 'generate', models: [{ name: 'text-model', title: 'Text model' }, { name: 'image-model', title: 'Image model' }] },
          { name: 'empty', capability: 'generate', models: [] },
        ] }
      : { success: true, models: [{ name: 'image-model', title: 'Image model', class: ['fast', 'mixed'] }] },
    }))
    const wrapper = mount(ModelPicker)
    await flushPromises()
    expect(api.get).toHaveBeenCalledWith('/api/v1/models/list?capability=vision')
    expect(wrapper.findComponent({ name: 'Select' }).props('options')).toEqual([
      expect.objectContaining({ group: 'Classes', items: [expect.objectContaining({ value: 'class:fast' })] }),
      expect.objectContaining({ group: 'Models', items: [expect.objectContaining({ value: 'image-model' })] }),
    ])
    wrapper.unmount()
  })

  it('keeps embedding selection model-only without requesting classes', async () => {
    pickerProps.capability = 'embed'
    vi.mocked(api.get).mockResolvedValue({ data: { success: true, models: [
      { name: 'embedding-model', title: 'Embedding model' },
    ] } })
    const wrapper = mount(ModelPicker)
    await flushPromises()
    expect(api.get).toHaveBeenCalledExactlyOnceWith('/api/v1/models/list?capability=embed')
    expect(wrapper.findComponent({ name: 'Select' }).props('options')).toEqual([
      expect.objectContaining({ group: 'Models', items: [expect.objectContaining({ value: 'embedding-model' })] }),
    ])
    wrapper.unmount()
  })

  it('keeps concrete vision models selectable when class discovery fails', async () => {
    vi.mocked(api.get).mockImplementation(async (url: string) => {
      if (url.includes('/classes')) throw new Error('Class discovery unavailable')
      return { data: { success: true, models: [{ name: 'image-model', title: 'Image model' }] } }
    })
    const wrapper = mount(ModelPicker)
    await flushPromises()
    expect(wrapper.findComponent({ name: 'Select' }).props('options')).toEqual([
      expect.objectContaining({ group: 'Models', items: [expect.objectContaining({ value: 'image-model' })] }),
    ])
    wrapper.unmount()
  })

  it('uses published provider and class presentation with generic icons for older catalogue rows', async () => {
    pickerProps.capability = 'generate'
    vi.mocked(api.get).mockImplementation(async (url: string) => ({ data: url.includes('/classes')
      ? { success: true, classes: [{ name: 'fast', title: 'Fast response', icon: 'tabler:bolt', capability: 'generate',
          models: [{ name: 'gemma', title: 'Gemma' }] }] }
      : { success: true, models: [
          { name: 'gemma', title: 'Gemma', provider: 'openai_compat', provider_title: 'vLLM', provider_icon: 'tabler:server' },
          { name: 'legacy', title: 'Legacy', provider: 'openai_compat' },
        ] },
    }))
    const wrapper = mount(ModelPicker)
    await flushPromises()
    expect(wrapper.findComponent({ name: 'Select' }).props('options')).toEqual([
      { group: 'Classes', items: [{ value: 'class:fast', title: 'Fast response', subtitle: 'Gemma', icon: 'tabler:bolt' }] },
      { group: 'Models', items: [
        { value: 'gemma', title: 'Gemma', subtitle: 'vLLM', icon: 'tabler:server' },
        { value: 'legacy', title: 'Legacy', subtitle: '', icon: 'tabler:cpu' },
      ] },
    ])
    wrapper.unmount()
  })

  it('shares the first request with opening and keeps loaded choices through a failed refresh', async () => {
    pickerProps.capability = 'embed'
    const response = { data: { success: true, models: [{ name: 'embed-model', title: 'Embedding model' }] } }
    let resolveInitial!: (value: typeof response) => void
    vi.mocked(api.get).mockImplementationOnce(() => new Promise(resolve => { resolveInitial = resolve }))
    const wrapper = mount(ModelPicker)
    const select = wrapper.findComponent({ name: 'Select' })
    select.vm.$emit('before-show')
    select.vm.$emit('before-show')
    expect(api.get).toHaveBeenCalledExactlyOnceWith('/api/v1/models/list?capability=embed')
    expect(select.props('loading')).toBeFalsy()
    resolveInitial(response)
    await flushPromises()
    const options = select.props('options')
    expect(options).toEqual([expect.objectContaining({ group: 'Models' })])
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Catalogue unavailable'))
    select.vm.$emit('before-show')
    expect(api.get).toHaveBeenCalledTimes(2)
    expect(select.props('options')).toBe(options)
    await flushPromises()
    expect(select.props('options')).toBe(options)
    wrapper.unmount()
  })
})
