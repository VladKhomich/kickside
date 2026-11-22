// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { api, host } from '@wippy-fe/proxy'
import Share from './share.vue'

const { config, emit } = vi.hoisted(() => ({
  config: {
    resource_id: 'release-board',
    title: 'Release board',
    access_url: '/access/release-board',
    share_url: '/share/release-board',
  },
  emit: vi.fn(),
}))

vi.mock('@wippy-fe/proxy', () => ({
  api: { get: vi.fn(), post: vi.fn() },
  host: { confirm: vi.fn() },
}))
vi.mock('@wippy-fe/webcomponent-vue', () => ({
  useProps: () => ({ value: { config } }),
  useEvents: () => emit,
}))
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span aria-hidden="true" />' } }))
vi.mock('./PrincipalPicker.vue', () => ({ default: { template: '<div />' } }))
vi.mock('primevue/dialog', () => ({
  default: {
    props: ['visible'],
    template: '<section v-if="visible"><slot name="header" /><slot /></section>',
  },
}))

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  vi.resetAllMocks()
})

const capabilities = [
  { bit: 1, key: 'read', label: 'Read', description: 'View the selected resource' },
  { bit: 8, key: 'admin', label: 'Admin', description: 'Manage who can access the resource' },
  { bit: 16, key: 'export', label: 'Export' },
]

async function openShare(accessMask: number, declared = capabilities.slice(0, 2)) {
  const owner = { subject_id: 'owner', full_name: 'Jordan Fox', access_mask: 15, owner: true }
  const member = { subject_id: 'riley', full_name: 'Riley Chen', access_mask: accessMask }
  let access = [owner, member]
  vi.mocked(api.get).mockImplementation(async (url: string) => ({
    data: url === '/api/v1/components/access-model'
      ? { success: true, capabilities: declared }
      : { success: true, access },
  }) as Awaited<ReturnType<typeof api.get>>)
  vi.mocked(api.post).mockImplementation(async (_url: string, body: unknown) => {
    if ((body as { action?: string }).action === 'revoke') access = [owner]
    return { data: { success: true } } as Awaited<ReturnType<typeof api.post>>
  })
  const view = mount(Share)
  wrapper = view
  await flushPromises()
  return view
}

it('shows each declared permission effect next to its choice and describes both toggle locations', async () => {
  const view = await openShare(9, capabilities)
  const choices = view.findAll<HTMLButtonElement>('.kxs-caps-new button')
  const existing = view.findAll<HTMLButtonElement>('.kxs-row:last-child .kxs-cap')
  expect(choices.map(choice => choice.text())).toEqual(capabilities.map(cap => cap.label))

  capabilities.forEach((cap, index) => {
    const choice = choices[index]
    const id = choice.attributes('aria-describedby')
    if (!cap.description) {
      expect(id).toBeUndefined()
      expect(existing[index].attributes('aria-describedby')).toBeUndefined()
      return
    }
    expect(choice.element.parentElement?.textContent).toContain(cap.description)
    expect(id).toBeTruthy()
    const effect = view.get(`[id="${id}"]`)
    expect(effect.isVisible()).toBe(true)
    expect(effect.text()).toBe(cap.description)
    expect(choice.element.parentElement?.contains(effect.element)).toBe(true)
    expect(existing[index].attributes('aria-describedby')).toBe(id)
  })

  expect(choices.map(choice => choice.attributes('aria-pressed'))).toEqual(['true', 'false', 'false'])
  expect(existing.map(choice => choice.attributes('aria-pressed'))).toEqual(['true', 'true', 'false'])
  await choices[1].trigger('click')
  expect(choices[1].attributes('aria-pressed')).toBe('true')
  expect(api.post).not.toHaveBeenCalled()
})

it.each([
  { action: 'the remove button', mask: 9, selector: 'button[aria-label="Remove Riley Chen"]' },
  { action: 'the last selected Admin permission', mask: 8, selector: '.kxs-row:last-child .kxs-cap-on' },
  { action: 'the last selected Read permission', mask: 1, selector: '.kxs-row:last-child .kxs-cap-on' },
])('waits for a named confirmation when using $action', async ({ mask, selector }) => {
  const view = await openShare(mask)
  let decide!: (accepted: boolean) => void
  vi.mocked(host.confirm).mockImplementationOnce(() => new Promise(resolve => { decide = resolve }))

  await view.get(selector).trigger('click')
  expect(api.post).not.toHaveBeenCalled()
  expect(host.confirm).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
    message: expect.stringMatching(/Riley Chen.*Release board/),
    acceptLabel: 'Remove access',
    rejectLabel: 'Cancel',
  }))
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  await flushPromises()
  expect(view.find(selector).exists()).toBe(true)

  decide(false)
  await flushPromises()
  expect(view.get('.kxs-row:last-child').text()).toContain('Riley Chen')
  expect(view.find('.kxs-row:last-child .kxs-cap-on').exists()).toBe(true)
  expect(api.post).not.toHaveBeenCalled()
  expect(emit).not.toHaveBeenCalledWith('changed', expect.anything())

  vi.mocked(host.confirm).mockResolvedValueOnce(true)
  await view.get(selector).trigger('click')
  await flushPromises()
  expect(api.post).toHaveBeenCalledExactlyOnceWith(config.share_url, {
    subject_id: 'riley', subject_type: 'user', action: 'revoke',
  })
  expect(view.text()).not.toContain('Riley Chen')
  expect(emit).toHaveBeenCalledExactlyOnceWith('changed', { resource_id: config.resource_id })
})

it('updates a grant directly when a permission remains selected', async () => {
  const view = await openShare(9)
  await view.get('.kxs-row:last-child .kxs-cap-on:last-child').trigger('click')
  await flushPromises()
  expect(host.confirm).not.toHaveBeenCalled()
  expect(api.post).toHaveBeenCalledExactlyOnceWith(config.share_url, {
    subject_id: 'riley', subject_type: 'user', access_mask: 1,
  })
})

it('closes Share when Escape is pressed inside it', async () => {
  const view = await openShare(9)
  await view.get('.kxs').trigger('keydown', { key: 'Escape' })
  expect(view.find('.kxs').exists()).toBe(false)
  expect(emit).toHaveBeenCalledExactlyOnceWith('close', undefined)
})
