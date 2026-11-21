// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { api } from '@wippy-fe/proxy'
import { expect, it, vi } from 'vitest'
import Settings from './settings.vue'

const { host } = vi.hoisted(() => ({ host: { route: '' } }))
vi.mock('@wippy-fe/proxy', () => ({ api: { get: vi.fn() } }))
vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { onMounted, ref } = await import('vue')
  return {
    useProps: () => ref(host),
    useHostVisibilityRefresh: (load: () => Promise<void>) => onMounted(load),
  }
})
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span />' } }))
vi.mock('./SettingsForm.vue', () => ({
  default: { props: { namespace: String, all: Boolean }, template: '<div>{{ all ? "All values" : namespace }}</div>' },
}))
vi.mock('@widgets/app/WcMount.vue', () => ({
  default: { props: ['tag'], template: '<div>{{ tag }}</div>' },
}))

const blocks = [
  { key: 'general', title: 'General', namespace: 'test.general' },
  { key: 'uploads', title: 'Uploads', group: 'Storage', component_tag: 'test-uploads' },
]

async function render(route: string, entries = blocks) {
  host.route = route
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, blocks: entries } })
  const view = mount(Settings)
  await flushPromises()
  return view
}

it('uses the host route and switches between grouped sections and All settings', async () => {
  const view = await render('uploads')
  const nav = view.get('nav')
  const [all, general, uploads] = nav.findAll('button')
  expect(nav.attributes('aria-label')).toBe('Settings sections')
  expect(nav.text()).toContain('Storage')
  expect(uploads.attributes('aria-current')).toBe('true')
  expect(view.get('.ks-pane').text()).toBe('test-uploads')
  expect(view.get('.ks-pane').classes()).toContain('ks-pane-flush')

  await all.trigger('click')
  expect(all.attributes('aria-current')).toBe('true')
  expect(view.get('.ks-pane').text()).toBe('All settingsAll values')
  expect(view.get('.ks-pane').classes()).not.toContain('ks-pane-flush')

  await general.trigger('click')
  expect(general.attributes('aria-current')).toBe('true')
  expect(view.get('.ks-pane').text()).toBe('Generaltest.general')
  view.unmount()
})

it.each([
  ['unknown', blocks, 'General', 'Generaltest.general'],
  ['all-settings', blocks, 'All settings', 'All settingsAll values'],
  ['all-settings', [...blocks, { key: 'all-settings', title: 'Declared block', namespace: 'test.declared' }],
    'Declared block', 'Declared blocktest.declared'],
] as const)('resolves route %s using the declared blocks and All settings shortcut', async (route, entries, label, content) => {
  const view = await render(route, [...entries])
  expect(view.get('nav button[aria-current=true]').text()).toBe(label)
  expect(view.get('.ks-pane').text()).toBe(content)
  view.unmount()
})
