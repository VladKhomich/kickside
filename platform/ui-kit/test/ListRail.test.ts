// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ListRail from '../package/ListRail.vue'

it('names the list and keeps its heading, actions and toolbar outside the scroll body', async () => {
  const rail = mount(ListRail, {
    props: { title: 'Providers', count: 0 },
    slots: {
      actions: '<button>Add provider</button>',
      toolbar: '<input aria-label="Find a provider">',
      default: '<button>All providers</button>',
    },
  })
  const region = rail.get('aside.kx-rail')
  const heading = rail.get('.kx-railhead-title')
  expect(region.attributes('aria-labelledby')).toBe(heading.attributes('id'))
  expect(heading.text()).toBe('Providers0')
  expect(rail.get('.kx-railhead-acts').text()).toBe('Add provider')
  expect(rail.get('.kx-railhead + input + .kx-rail-body').text()).toBe('All providers')
  await rail.setProps({ count: undefined })
  expect(heading.text()).toBe('Providers')
})
