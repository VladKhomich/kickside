// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useModuleUpdates } from './useModuleUpdates.ts'
import type { InstalledRow } from './modules-page.types.ts'
import type { keeperHub } from '../keeper-hub.ts'

function fixture(withCycle = false) {
  const rows: InstalledRow[] = [{ id: 'app.deps:independent', namespace: 'app.deps', name: 'independent',
    component: 'example/independent', version: '1.0.0', is_root: true, used_by: [] }]
  if (withCycle) {
    for (const [name, dependent] of [['alpha', 'beta'], ['beta', 'alpha']]) {
      rows.push({ id: `app.deps:${name}`, namespace: 'app.deps', name,
        component: `example/${name}`, version: '1.0.0', is_root: true, used_by: [`example/${dependent}`] })
    }
  }
  for (const row of rows) row.dependencyId = row.id
  const payload = { dependencies: rows.map(row => ({ id: row.id, component: row.component,
    version: '>=1.1.0', parameters: [{ name: 'storage', value: 'app:storage' }] })),
    run_migrations: true, migration_policy: 'up' as const }
  const plan = { success: true, applicable: true,
    plans: rows.map(row => ({ dependency: row, applicable: true })), install_payload: payload }
  const hub = { planBatchInstall: vi.fn().mockResolvedValue(plan),
    planInstall: vi.fn(),
    install: vi.fn().mockResolvedValue({ success: true }) }
  const refreshAll = vi.fn(async () => {})
  const refreshSelectedDetail = vi.fn(async () => {})
  const showToast = vi.fn()
  // The test supplies only the two Hub operations this update path invokes.
  const updates = useModuleUpdates({ hub: hub as unknown as ReturnType<typeof keeperHub>,
    installed: ref(rows), installedError: ref(null), installedCanUpdate: () => true,
    installedIsRoot: () => true, notifyModulesChanged: vi.fn(), showToast,
    refreshAll, refreshSelectedDetail })
  for (const row of rows) updates.updateScan.value[row.component] = {
    component: row.component, currentVersion: '1.0.0', latestVersion: '1.1.0', status: 'available',
  }
  return { updates, hub, plan, payload, refreshAll, refreshSelectedDetail, showToast }
}

describe('Update all status refresh', () => {
  it('plans the whole graph once and applies exactly the returned bindings', async () => {
    const f = fixture(true)
    await f.updates.updateAllAvailable()
    expect(f.hub.planBatchInstall).toHaveBeenCalledTimes(1)
    expect(f.hub.planBatchInstall).toHaveBeenCalledWith({ dependencies: f.payload.dependencies.map(
      ({ parameters: _parameters, ...dependency }) => dependency), run_migrations: true, migration_policy: 'up' })
    expect(f.hub.planInstall).not.toHaveBeenCalled()
    expect(f.hub.install).toHaveBeenCalledTimes(1)
    expect(f.hub.install.mock.calls[0][0]).toBe(f.payload)
    expect(f.updates.updateScan.value['example/alpha'].status).toBe('updated')
    expect(f.refreshAll).toHaveBeenCalledTimes(1)
    expect(f.refreshSelectedDetail).toHaveBeenCalledTimes(1)
    expect(f.updates.updateAllRunning.value).toBe(false)
  })

  it('changes nothing when any root needs settings and names the blocked module', async () => {
    const f = fixture(true)
    f.hub.planBatchInstall.mockResolvedValueOnce({ ...f.plan, applicable: false,
      plans: f.plan.plans.map((plan, index) => index === 1 ? { ...plan, applicable: false,
        missing_requirements: ['example.alpha:storage'] } : plan) })
    await f.updates.updateAllAvailable()
    expect(f.hub.install).not.toHaveBeenCalled()
    expect(f.updates.updateScan.value['example/alpha'].status).toBe('blocked')
    expect(f.updates.updateScan.value['example/independent'].status).toBe('skipped')
    expect(f.showToast).toHaveBeenCalledWith('error', expect.stringContaining('example/alpha: Missing required settings: example.alpha:storage'))
  })

  it('does not apply a plan that refuses without missing settings', async () => {
    const f = fixture()
    f.hub.planBatchInstall.mockResolvedValueOnce({ ...f.plan, applicable: false })
    await f.updates.updateAllAvailable()
    expect(f.hub.install).not.toHaveBeenCalled()
    expect(f.showToast).toHaveBeenCalledWith('error', expect.stringContaining('No modules were changed'))
  })

  it('blocks invalid settings even if the plan incorrectly reports applicability', async () => {
    const f = fixture()
    f.hub.planBatchInstall.mockResolvedValueOnce({ ...f.plan, plans: [{ ...f.plan.plans[0],
      requirements: [{ id: 'example:storage', invalid: true, invalid_reason: 'wrong resource kind' }] }] })
    await f.updates.updateAllAvailable()
    expect(f.hub.install).not.toHaveBeenCalled()
    expect(f.showToast).toHaveBeenCalledWith('error', expect.stringContaining('example:storage: wrong resource kind'))
  })

  it('does not reconstruct an absent install payload', async () => {
    const f = fixture()
    f.hub.planBatchInstall.mockResolvedValueOnce({ ...f.plan, install_payload: undefined })
    await f.updates.updateAllAvailable()
    expect(f.hub.install).not.toHaveBeenCalled()
    expect(f.showToast).toHaveBeenCalledWith('error', 'Update plan returned no install payload')
  })

  it('waits for the batch plan and ignores a second click while it is pending', async () => {
    const f = fixture(true)
    let complete!: (plan: typeof f.plan) => void
    f.hub.planBatchInstall.mockImplementationOnce(() => new Promise(resolve => { complete = resolve }))
    const running = f.updates.updateAllAvailable()
    await f.updates.updateAllAvailable()
    expect(f.hub.planBatchInstall).toHaveBeenCalledTimes(1)
    expect(f.hub.install).not.toHaveBeenCalled()
    complete(f.plan)
    await running
    expect(f.hub.install).toHaveBeenCalledTimes(1)
  })

  it('leaves destination resolution to Keeper for a row without a dependency entry', async () => {
    const f = fixture()
    f.plan.plans[0].dependency.dependencyId = undefined
    f.plan.plans[0].dependency.id = 'example/independent'
    await f.updates.updateAllAvailable()
    expect(f.hub.planBatchInstall.mock.calls[0][0].dependencies[0].id).toBeUndefined()
  })

  it('does not install when planning fails', async () => {
    const f = fixture()
    f.hub.planBatchInstall.mockRejectedValueOnce(new Error('dependency conflict'))
    await f.updates.updateAllAvailable()
    expect(f.hub.install).not.toHaveBeenCalled()
    expect(f.showToast).toHaveBeenCalledWith('error', 'dependency conflict')
    expect(f.updates.updateAllRunning.value).toBe(false)
  })

  it('refreshes after an apply timeout without automatically retrying', async () => {
    const f = fixture()
    f.hub.install.mockRejectedValueOnce(new Error('gateway timeout'))
    await f.updates.updateAllAvailable()
    expect(f.hub.install).toHaveBeenCalledTimes(1)
    expect(f.refreshAll).toHaveBeenCalledTimes(1)
    expect(f.updates.updateScan.value['example/independent'].status).toBe('failed')
  })

  it('reports a refresh failure without replaying or reclassifying committed installs', async () => {
    const f = fixture()
    f.refreshAll.mockRejectedValueOnce(new Error('list unavailable'))
    await f.updates.updateAllAvailable()
    expect(f.hub.install).toHaveBeenCalledTimes(1)
    expect(f.updates.updateScan.value['example/independent'].status).toBe('updated')
    expect(f.showToast).toHaveBeenLastCalledWith('error', expect.stringContaining('status could not be refreshed'))
    expect(f.updates.updateAllRunning.value).toBe(false)
  })
})

function appFixture(version: string, offerKeeper = false) {
  const app = { id: 'app.deps:kickside', namespace: 'app.deps', name: 'kickside',
    component: 'kickside/kickside', version: '0.2.46', dependencyId: 'app.deps:kickside', is_root: true, used_by: [] }
  const keeper = { id: 'app.deps:keeper', namespace: 'app.deps', name: 'keeper', component: 'keeper/keeper',
    version, dependencyId: 'app.deps:keeper', is_root: true, used_by: [],
    parameters: [{ name: 'keeper.hub:api_router', value: 'app:api' }] }
  const state = {
    success: true, dependencies: [keeper, app],
    modules: [{ name: keeper.component, version }, { name: app.component, version: app.version }],
  }
  const payload = { dependencies: [{ id: keeper.id, component: keeper.component,
    version: '>=0.5.116', parameters: keeper.parameters }], run_migrations: true, migration_policy: 'up' as const }
  const appPayload = { component: app.component, version: '>=0.2.47', parameters: [{ name: 'title', value: 'Local title' }] }
  const appPlan = { success: true, applicable: true, dependency: app, install_payload: appPayload }
  const events: string[] = []
  const hub = {
    listDependencies: vi.fn(async () => state),
    securityProjectionStatus: vi.fn(async () => ({ current: true })),
    planInstall: vi.fn(async () => {
      events.push('plan-app')
      return appPlan
    }),
    planBatchInstall: vi.fn(async (body: { dependencies: { component: string }[] }) => {
      events.push('plan-' + body.dependencies.map(row => row.component).join(','))
      if (body.dependencies.length === 1 && body.dependencies[0].component === keeper.component) {
        return { success: true, applicable: true, install_payload: payload,
          plans: [{ success: true, dependency: keeper, graph: [{ module: keeper.component, version: '0.5.116' }] }] }
      }
      return { success: true, applicable: true, install_payload: body, plans: [appPlan] }
    }),
    install: vi.fn(async (body: { component?: string, dependencies?: { component: string }[] }) => {
      if (body.dependencies?.length === 1 && body.dependencies[0].component === keeper.component) {
        events.push('apply-keeper')
        state.modules[0].version = '0.5.116'
      } else {
        events.push('apply-app')
      }
      return { success: true }
    }),
  }
  const showToast = vi.fn()
  const updates = useModuleUpdates({ hub: hub as unknown as ReturnType<typeof keeperHub>,
    installed: ref([app, keeper]), installedError: ref(null), installedCanUpdate: () => true,
    installedIsRoot: () => true, notifyModulesChanged: vi.fn(), showToast,
    refreshAll: async () => {}, refreshSelectedDetail: async () => {} })
  updates.updateScan.value[app.component] = { component: app.component, currentVersion: app.version,
    latestVersion: '0.2.47', status: 'available' }
  if (offerKeeper) updates.updateScan.value[keeper.component] = { component: keeper.component, currentVersion: version,
    latestVersion: '0.5.116', status: 'available' }
  return { app, keeper, state, payload, appPlan, appPayload, events, hub, updates, showToast }
}

describe('KickSide updates across the Keeper safety floor', () => {
  it('stages and verifies Keeper before replanning a single App update, even with only App offered', async () => {
    const f = appFixture('0.5.115')
    expect(f.updates.availableUpdates.value.map(row => row.component)).toEqual(['kickside/kickside'])
    expect(await f.updates.updateInstalledDependency(f.app)).toBe(true)
    expect(f.events).toEqual(['plan-app', 'plan-keeper/keeper', 'apply-keeper', 'plan-app', 'apply-app'])
    expect(f.hub.install.mock.calls[0][0]).toBe(f.payload)
    expect(f.hub.install.mock.calls[1][0]).toMatchObject(f.appPayload)
    expect(f.hub.listDependencies).toHaveBeenCalledTimes(2)
    expect(f.hub.securityProjectionStatus).toHaveBeenCalledTimes(1)
  })

  it('preflights all roots and discards the old batch after staging Keeper', async () => {
    const f = appFixture('0.5.114', true)
    await f.updates.updateAllAvailable()
    expect(f.events).toEqual(['plan-kickside/kickside,keeper/keeper', 'plan-keeper/keeper',
      'apply-keeper', 'plan-kickside/kickside', 'apply-app'])
    expect(f.hub.install.mock.calls[0][0]).toBe(f.payload)
    expect(f.hub.install.mock.calls[1][0].dependencies?.map(row => row.component)).toEqual(['kickside/kickside'])
    expect(f.showToast).toHaveBeenCalledWith('ok', 'Updated 2 modules')
  })

  it('blocks known missing App settings before staging Keeper', async () => {
    const f = appFixture('0.5.114')
    f.hub.planInstall.mockResolvedValueOnce({ ...f.appPlan, applicable: false,
      missing_requirements: ['app:storage'] } as typeof f.appPlan)
    expect(await f.updates.updateInstalledDependency(f.app)).toBe(false)
    expect(f.hub.planBatchInstall).not.toHaveBeenCalled()
    expect(f.hub.install).not.toHaveBeenCalled()
    expect(f.updates.updateScan.value[f.app.component].message).toContain('app:storage')
  })

  it('leaves a completed Keeper prerequisite in place if the new App plan is blocked', async () => {
    const f = appFixture('0.5.115')
    f.hub.planInstall.mockResolvedValueOnce(f.appPlan).mockResolvedValueOnce({ ...f.appPlan, applicable: false })
    expect(await f.updates.updateInstalledDependency(f.app)).toBe(false)
    expect(f.events).toEqual(['plan-keeper/keeper', 'apply-keeper'])
    expect(f.updates.updateScan.value[f.keeper.component].status).toBe('updated')
    expect(f.updates.updateScan.value[f.app.component].message).toContain('Keeper was updated')
  })

  it('uses the ordinary batch path once the actual Keeper is safe', async () => {
    const f = appFixture('0.5.116')
    f.state.dependencies[0].version = '>=0.5.114'
    await f.updates.updateAllAvailable()
    expect(f.events).toEqual(['plan-kickside/kickside', 'apply-app'])
    expect(f.hub.securityProjectionStatus).not.toHaveBeenCalled()
  })
})
