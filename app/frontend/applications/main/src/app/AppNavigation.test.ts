// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppNavigation from './AppNavigation.vue'

vi.mock('@kickside/ui-kit/componentRealtime', () => ({ subscribeComponentMeta: vi.fn() }))

const system = {
  id: 'system', path: '/system', label: 'System', icon: 'tabler:settings',
  route_name: 'system', category: '', order: 0, surface: 'system',
}

describe('New chat navigation', () => {
  it.each(['vertical', 'horizontal'] as const)('uses keyboard and DOM order in the %s layout', async (layout) => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div />' } }] })
    await router.push('/')
    const wrapper = mount(AppNavigation, {
      global: { plugins: [router] },
      props: {
        layout, appTitle: 'Kickside', markUrl: '/logo.svg', isNewChatRoute: false,
        renderableCategories: [{ key: '', label: '', order: 0, collapsed: false, items: [system] }],
        navItems: [system], loaded: true, navError: null, railCollapsed: false,
        collapsedCats: new Set<string>(), currentUser: null, accountItems: [],
      },
    })
    const buttonLabels = () => wrapper.findAll('nav button').map(button => button.text())
    expect(buttonLabels()).toEqual(['New chat', 'System'])
    await wrapper.setProps({ newChat: { visible: true, placement: 'last' } })
    expect(buttonLabels()).toEqual(['System', 'New chat'])
    await wrapper.findAll('nav button')[1].trigger('click')
    expect(wrapper.emitted('new-chat')).toHaveLength(1)
    await wrapper.setProps({ newChat: { visible: false, placement: 'last' } })
    expect(buttonLabels()).toEqual(['System'])
    wrapper.unmount()
  })
})
