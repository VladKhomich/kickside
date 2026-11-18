// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { api } from '@wippy-fe/proxy'
import AgentForm from './AgentForm.vue'

vi.mock('@wippy-fe/proxy', () => ({
  api: { post: vi.fn() },
  loadByTagName: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span aria-hidden="true" />' } }))

it('derives the new agent budget from the model catalog and preserves a user-entered cap', async () => {
  const wrapper = mount(AgentForm, {
    props: { open: true, embedded: true, agentId: null, traits: [], tools: [], models: [], agents: [] },
    global: { plugins: [PrimeVuePlugin] },
  })
  vi.mocked(api.post).mockResolvedValue({ data: { success: true, component_id: 'agent' } } as never)
  try {
    await wrapper.get('[aria-label="Agent name"]').setValue('Workshop assistant')
    await wrapper.setProps({
      models: [
        { name: 'fast-primary', class: ['fast'], output_tokens: 6144 },
        { name: 'fast-secondary', class: ['fast'], output_tokens: 4096.5 },
        { name: 'larger-output', output_tokens: 16000 },
      ],
    })
    const save = wrapper.get<HTMLButtonElement>('[data-testid="agent-form-save"]')
    expect(save.element.disabled).toBe(false)
    const modelTab = wrapper.findAll('[role="tab"]').find(tab => tab.text() === 'Model')
    expect(modelTab).toBeDefined()
    await modelTab!.trigger('click')
    const tokens = wrapper.get<HTMLInputElement>('input[type="number"]')
    expect(tokens.element.value).toBe('4096')

    const picker = wrapper.get('wc-model-picker')
    const select = (detail: string) => picker.element.dispatchEvent(new CustomEvent('select', { detail }))
    select('larger-output')
    await flushPromises()
    expect(tokens.element.value).toBe('8000')

    await tokens.setValue('')
    expect(save.element.disabled).toBe(true)
    await tokens.setValue('3000')
    select('class:fast')
    await flushPromises()
    expect(tokens.element.value).toBe('3000')
    await save.trigger('click')
    await flushPromises()
    expect(api.post).toHaveBeenCalledWith('/api/v1/user-agents', expect.objectContaining({
      model: 'class:fast',
      max_tokens: 3000,
    }))
  } finally {
    wrapper.unmount()
  }
})
