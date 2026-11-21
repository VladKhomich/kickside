// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import SettingsRail from '../package/SettingsRail.vue'

let view: VueWrapper
afterEach(() => view?.unmount())

function render() {
  view = mount(SettingsRail, {
    attachTo: document.body,
    props: {
      label: 'Settings sections',
      value: 'images',
      leadingItem: { value: 'all', label: 'All settings' },
      groups: [
        { heading: 'Runtime', items: [{ value: 'images', label: 'Images', icon: 'tabler:photo' }] },
        { items: [{ value: 'accounts', label: 'Accounts' }] },
      ],
    },
  })
  return view
}

it('renders ordered groups with optional headings and a named navigation landmark', () => {
  const rail = render()
  expect(rail.get('nav').attributes('aria-label')).toBe('Settings sections')
  expect(rail.findAll('.kx-settings-rail-group').map(heading => heading.text())).toEqual(['Runtime'])
  const buttons = rail.findAll('button')
  expect(buttons.map(button => button.text())).toEqual(['All settings', 'Images', 'Accounts'])
  expect(buttons[1].attributes('aria-current')).toBe('true')
})

it('moves focus across groups without selecting and emits a key for the host to commit', async () => {
  const rail = render()
  const [all, images, accounts] = rail.findAll('button')
  images.element.focus()
  await images.trigger('keydown', { key: 'ArrowDown' })
  expect(document.activeElement).toBe(accounts.element)
  await accounts.trigger('keydown', { key: 'ArrowRight' })
  expect(document.activeElement).toBe(all.element)
  await all.trigger('keydown', { key: 'End' })
  expect(document.activeElement).toBe(accounts.element)
  await accounts.trigger('keydown', { key: 'Home' })
  expect(document.activeElement).toBe(all.element)
  await all.trigger('keydown', { key: 'ArrowUp' })
  expect(document.activeElement).toBe(accounts.element)
  expect(rail.emitted('update:value')).toBeUndefined()

  await accounts.trigger('click')
  expect(rail.emitted('update:value')).toEqual([['accounts']])
  expect(images.attributes('aria-current')).toBe('true')
  await rail.setProps({ value: 'accounts' })
  expect(accounts.attributes('aria-current')).toBe('true')
  expect(images.attributes('aria-current')).toBeUndefined()
})
