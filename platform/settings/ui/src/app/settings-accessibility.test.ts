// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { api, host } from '@wippy-fe/proxy'
import SettingsForm from './SettingsForm.vue'
import Provider from './provider.vue'

vi.mock('@wippy-fe/proxy', () => ({
  api: { get: vi.fn(), put: vi.fn() }, host: { confirm: vi.fn() },
  loadByTagName: vi.fn(async (tag: string) => {
    if (!customElements.get(tag)) customElements.define(tag, class extends HTMLElement {})
  }),
}))
vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { ref } = await import('vue')
  return { useProps: () => ref({ config: { namespace: 'test.preferences', title: 'Preferences' } }) }
})
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span />' } }))

let wrapper: VueWrapper
let setting: Record<string, any>
beforeEach(() => {
  vi.clearAllMocks()
  setting = { namespace: 'test.preferences', key: 'retention', title: 'History retention',
    description: 'How long existing history is kept.', value_type: 'duration', value: '720h',
    default: '24h', is_default: false, confirm_decrease: true }
  vi.mocked(api.get).mockImplementation(async () => ({ data: { success: true, settings: [{ ...setting }] } }))
  vi.mocked(api.put).mockResolvedValue({ data: { success: true } })
  vi.mocked(host.confirm).mockResolvedValue(false)
})
afterEach(() => wrapper?.unmount())
async function render(view: string) {
  wrapper = mount(view === 'provider' ? Provider : SettingsForm, {
    props: view === 'provider' ? {} : { namespace: 'test.preferences', all: view === 'all' },
    global: { plugins: [PrimeVuePlugin] }, attachTo: document.body,
  })
  await flushPromises()
}
function button(action: string) {
  return wrapper.findAll('button').find(b => b.text() === action || b.attributes('aria-label')?.startsWith(action))!
}
function referencedText(element: Element, attribute: string) {
  return (element.getAttribute(attribute) || '').split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ')
}

for (const view of ['namespace', 'all', 'provider']) {
  describe(`${view} settings accessibility`, () => {
    for (const [type, selector, value, extra] of [
      ['string', 'input[type=text]', 'hello', {}],
      ['duration', 'input[type=text]', '24h', {}],
      ['int', 'input[type=number]', 3, { schema: { type: 'integer', minimum: 1 } }],
      ['json', 'textarea', { hello: 'world' }, {}],
      ['secret', 'input[type=password]', '', {}],
      ['bool', 'input[role=switch]', true, {}],
      ['string', '[role=combobox]', 'one', { schema: { enum: ['one', 'two'] } }],
      ['string', 'wc-a11y-picker', 'one', { control: { tag: 'wc-a11y-picker', props: {} } }],
    ] as const) {
      it(`names and describes ${type} ${selector} and its reset action`, async () => {
        Object.assign(setting, { value_type: type, value }, extra)
        await render(view)
        const el = wrapper.get(selector).element
        // PrimeVue's inputProps must reach the actual focusable input.
        expect(referencedText(el, 'aria-labelledby')).toBe('History retention')
        expect(referencedText(el, 'aria-describedby')).toContain(setting.description)
        if (selector === 'wc-a11y-picker') {
          expect(el.getAttribute('label')).toBe(setting.title)
          expect(el.getAttribute('description')).toBe(setting.description)
          expect(el.getAttribute('role')).toBe('group')
        }
        expect(button('Reset').attributes('aria-label')).toBe('Reset History retention to default')
        expect(referencedText(button('Reset').element, 'aria-describedby')).toContain(setting.description)
        if (view !== 'provider') expect(button('Save').attributes('aria-label')).toBe('Save History retention')
      })
    }
  })
  describe(`${view} destructive settings`, () => {
    it('does not write a shorter duration until confirmation accepts the exact value', async () => {
      await render(view)
      await wrapper.get('input[type=text]').setValue('1h30m')
      await button('Save').trigger('click'); await flushPromises()
      expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('720h'), acceptLabel: 'Save', rejectLabel: 'Cancel',
      }))
      expect(vi.mocked(host.confirm).mock.calls[0][0].message).toContain('1h30m')
      expect(vi.mocked(host.confirm).mock.calls[0][0].message).toContain('permanently deleted')
      expect(api.put).not.toHaveBeenCalled()
      vi.mocked(host.confirm).mockResolvedValueOnce(true)
      await button('Save').trigger('click'); await flushPromises()
      expect(api.put).toHaveBeenCalledExactlyOnceWith('/api/v1/settings', { namespace: setting.namespace, key: setting.key, value: '1h30m' })
    })
    it('confirms a reset that restores a shorter effective window', async () => {
      await render(view)
      await button('Reset').trigger('click'); await flushPromises()
      expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('24h') }))
      expect(api.put).not.toHaveBeenCalled()
      vi.mocked(host.confirm).mockResolvedValueOnce(true)
      await button('Reset').trigger('click'); await flushPromises()
      expect(api.put).toHaveBeenCalledExactlyOnceWith('/api/v1/settings', { namespace: setting.namespace, key: setting.key, value: null })
    })
    for (const value of ['43200m', '800h']) {
      it(`does not confirm an equal or greater duration (${value})`, async () => {
        await render(view)
        await wrapper.get('input[type=text]').setValue(value)
        await button('Save').trigger('click')
        await flushPromises()
        expect(host.confirm).not.toHaveBeenCalled()
        expect(api.put).toHaveBeenCalledTimes(1)
      })
    }
    it('treats zero as a finite integer retention window', async () => {
      Object.assign(setting, { value_type: 'int', value: 365, default: 365, schema: { type: 'integer', minimum: 0 } })
      await render(view)
      await wrapper.get('input[type=number]').setValue(0)
      await button('Save').trigger('click'); await flushPromises()
      expect(host.confirm).toHaveBeenCalledTimes(1)
      expect(api.put).not.toHaveBeenCalled()
    })
    for (const [before, after, confirms] of [[0, 1, true], [1, 0, false], [365, 0, false]] as const) {
      it(`compares a finite zero default (${before} → ${after})`, async () => {
        Object.assign(setting, { value_type: 'int', value: before, default: 365, confirm_decrease: { zero: 365 } })
        await render(view)
        await wrapper.get('input[type=number]').setValue(after)
        await button('Save').trigger('click'); await flushPromises()
        expect(host.confirm).toHaveBeenCalledTimes(confirms ? 1 : 0)
        expect(api.put).toHaveBeenCalledTimes(confirms ? 0 : 1)
        if (confirms) expect(vi.mocked(host.confirm).mock.calls[0][0].message).toContain('365 effective')
      })
    }
    it('resets to a greater window without confirmation', async () => {
      setting.default = '800h'
      await render(view)
      await button('Reset').trigger('click'); await flushPromises()
      expect(host.confirm).not.toHaveBeenCalled()
      expect(api.put).toHaveBeenCalledTimes(1)
    })
    it('keeps the confirmed value fixed while waiting and prevents duplicate saves', async () => {
      let accept!: (ok: boolean) => void
      vi.mocked(host.confirm).mockImplementationOnce(() => new Promise(resolve => { accept = resolve }))
      await render(view)
      await wrapper.get('input[type=text]').setValue('1h')
      await button('Save').trigger('click'); await flushPromises()
      expect(api.put).not.toHaveBeenCalled()
      await wrapper.get('input[type=text]').setValue('2h')
      await button('Save').trigger('click'); await flushPromises()
      expect(host.confirm).toHaveBeenCalledTimes(1)
      accept(true); await flushPromises()
      expect(api.put).toHaveBeenCalledExactlyOnceWith('/api/v1/settings', { namespace: setting.namespace, key: setting.key, value: '1h' })
    })
    it('leaves unmarked numeric settings on the ordinary save path', async () => {
      Object.assign(setting, { value_type: 'int', value: 365, confirm_decrease: undefined })
      await render(view)
      await wrapper.get('input[type=number]').setValue(1)
      await button('Save').trigger('click'); await flushPromises()
      expect(host.confirm).not.toHaveBeenCalled()
      expect(api.put).toHaveBeenCalledTimes(1)
    })
  })
}

it('associates schema and server errors with the invalid input', async () => {
  Object.assign(setting, { value_type: 'int', value: 3, schema: { type: 'integer', minimum: 1 } })
  await render('namespace')
  const input = wrapper.get('input[type=number]')
  await input.setValue(0)
  expect(input.attributes('aria-invalid')).toBe('true')
  expect(referencedText(input.element, 'aria-describedby')).toContain('Must be ≥ 1')
  await input.setValue(2)
  vi.mocked(host.confirm).mockResolvedValueOnce(true)
  vi.mocked(api.put).mockResolvedValueOnce({ data: { success: false, error: 'Cannot keep this window' } })
  await button('Save').trigger('click'); await flushPromises()
  expect(input.attributes('aria-invalid')).toBe('true')
  expect(referencedText(input.element, 'aria-describedby')).toContain('Cannot keep this window')
})

it('labels the bespoke editor boundary with its setting title and description', async () => {
  setting.ui = 'wc-a11y-editor'
  await render('namespace')
  const editor = wrapper.get('wc-a11y-editor')
  expect(editor.attributes('label')).toBe(setting.title)
  expect(editor.attributes('role')).toBe('group')
  expect(referencedText(editor.element, 'aria-labelledby')).toBe(setting.title)
  expect(referencedText(editor.element, 'aria-describedby')).toBe(setting.description)
})

it('confirms all provider changes before issuing any writes', async () => {
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, settings: [
    { ...setting, key: 'ordinary', value_type: 'int', value: 20, confirm_decrease: undefined }, setting,
  ] } })
  await render('provider')
  await wrapper.get('input[type=number]').setValue(10)
  await wrapper.get('input[type=text]').setValue('1h')
  await button('Save').trigger('click'); await flushPromises()
  expect(host.confirm).toHaveBeenCalledTimes(1)
  expect(api.put).not.toHaveBeenCalled()
})
