import { computed, ref, type Ref } from 'vue'
import { keeperHub, type HubInstallPlan } from '../keeper-hub.ts'
import { errorMessage, resolvedDependencyVersion } from '../lib.ts'
import type { InstalledRow, UpdateInfo, UpdateStatus } from './modules-page.types.ts'
import {
  APP_COMPONENT, KEEPER_COMPONENT, activateKeeperForAppUpdate, legacyKeeperForAppUpdate, updatePlanBlocker,
} from './app-update-prerequisite.ts'

interface ModuleUpdatesOptions {
  hub: ReturnType<typeof keeperHub>
  installed: Ref<InstalledRow[]>
  installedError: Ref<string | null>
  installedCanUpdate: (dep?: InstalledRow | null) => boolean
  installedIsRoot: (dep?: InstalledRow | null) => boolean
  showToast: (kind: 'ok' | 'error', message: string) => void
  notifyModulesChanged: () => void
  refreshAll: () => Promise<void>
  refreshSelectedDetail: () => Promise<void>
}

export function useModuleUpdates({ hub, installed, installedError, installedCanUpdate, installedIsRoot, showToast, notifyModulesChanged, refreshAll, refreshSelectedDetail }: ModuleUpdatesOptions) {
  const updateScan = ref<Record<string, UpdateInfo>>({})
  const updateScanLoading = ref(false)
  const updateAllRunning = ref(false)
  let updatingRoot = false
  const availableUpdates = computed(() => installed.value.filter(dep => {
    const info = updateInfoForDep(dep)
    return installedCanUpdate(dep) && installedIsRoot(dep) && info
      && ['available', 'failed', 'blocked', 'skipped'].includes(info.status)
      && isNewerVersion(info.latestVersion, resolvedDependencyVersion(dep))
  }))

function versionParts(v: string): number[] {
  const cleaned = String(v || '').trim().replace(/^[^\d]*/, '')
  const match = cleaned.match(/\d+(?:\.\d+)*/)
  return (match?.[0] || '').split('.').filter(Boolean).map(Number)
}

function compareVersions(a: string, b: string): number {
  const aa = versionParts(a)
  const bb = versionParts(b)
  const n = Math.max(aa.length, bb.length)
  for (let i = 0; i < n; i++) {
    const av = aa[i] || 0
    const bv = bb[i] || 0
    if (av !== bv) return av > bv ? 1 : -1
  }
  return String(a || '').localeCompare(String(b || ''))
}

function latestVersionFrom(items: { version?: string; is_latest?: boolean }[] = []): string {
  const latest = items.find(v => v.is_latest) || items[0]
  return String(latest?.version || '')
}

function isNewerVersion(latest: string, current: string): boolean {
  return Boolean(latest && current && latest !== current && compareVersions(latest, current) > 0)
}

// Updating must never turn a tracking root into an exact pin. The Hub
// planner resolves this lower-bound constraint to the selected release now,
// while subsequent resolves remain eligible for newer releases.
function trackingConstraint(version: string): string {
  const normalized = String(version || '').trim().replace(/^[>=<~^]+v?/, '')
  return normalized ? `>=${normalized}` : '>=v0.0.0'
}

function updateInfoForDep(dep?: InstalledRow | null): UpdateInfo | null {
  if (!dep?.component) return null
  return updateScan.value[dep.component] || null
}

function setUpdateInfo(component: string, patch: Partial<UpdateInfo>) {
  const current = updateScan.value[component]
  updateScan.value = {
    ...updateScan.value,
    [component]: {
      component,
      currentVersion: patch.currentVersion ?? current?.currentVersion ?? '',
      latestVersion: patch.latestVersion ?? current?.latestVersion ?? '',
      status: patch.status ?? current?.status ?? 'current',
      message: patch.message,
    },
  }
}

function updateStatusLabel(dep: InstalledRow): string {
  const info = updateInfoForDep(dep)
  if (!info) return ''
  if (info.status === 'available') return `${info.currentVersion || '?'} → ${info.latestVersion || '?'}`
  if (info.status === 'queued') return 'queued'
  if (info.status === 'skipped') return 'skipped'
  if (info.status === 'planning') return 'planning'
  if (info.status === 'updating') return 'updating'
  if (info.status === 'updated') return 'updated'
  if (info.status === 'blocked') return 'blocked'
  if (info.status === 'failed') return 'failed'
  return ''
}

function updateStatusIcon(dep: InstalledRow): string {
  const status = updateInfoForDep(dep)?.status
  if (status === 'planning' || status === 'updating') return 'tabler:loader-2'
  if (status === 'updated') return 'tabler:check'
  if (status === 'queued') return 'tabler:clock'
  if (status === 'skipped') return 'tabler:player-skip-forward'
  if (status === 'blocked') return 'tabler:lock'
  if (status === 'failed') return 'tabler:alert-triangle'
  return 'tabler:arrow-up-circle'
}

function updateStatusBusy(dep: InstalledRow): boolean {
  const status = updateInfoForDep(dep)?.status
  return status === 'planning' || status === 'updating'
}

async function scanInstalledUpdates() {
  if (!hub || updateScanLoading.value) return
  updateScanLoading.value = true
  installedError.value = null
  const next: Record<string, UpdateInfo> = {}
  let found = 0
  let failed = 0
  try {
    for (const dep of installed.value) {
      if (!installedCanUpdate(dep) || !installedIsRoot(dep)) continue
      const currentVersion = resolvedDependencyVersion(dep)
      try {
        const versions = await hub.listVersions(dep.component)
        const latestVersion = latestVersionFrom(versions.items)
        const status: UpdateStatus = isNewerVersion(latestVersion, currentVersion) ? 'available' : 'current'
        if (status === 'available') found++
        next[dep.component] = { component: dep.component, currentVersion, latestVersion, status }
        updateScan.value = { ...next }
      } catch (e: unknown) {
        failed++
        next[dep.component] = {
          component: dep.component,
          currentVersion,
          latestVersion: '',
          status: 'failed',
          message: errorMessage(e, 'version scan failed'),
        }
        updateScan.value = { ...next }
      }
    }
    showToast('ok', `Found ${found} update${found === 1 ? '' : 's'}${failed ? `, ${failed} failed` : ''}`)
  } finally {
    updateScanLoading.value = false
  }
}

// Plan one installed root's update to `version`. Marks the row planning while
// the planner runs and records why it cannot proceed; the caller decides what
// a refusal means for the rest of its batch.
async function planRootUpdate(component: string, version: string): Promise<HubInstallPlan | null> {
  setUpdateInfo(component, { status: 'planning', message: undefined })
  try {
    const plan = await hub!.planInstall({ component, version, run_migrations: true })
    const message = component === APP_COMPONENT
      ? updatePlanBlocker(plan)
      : (plan.missing_requirements?.length ? `Missing required settings: ${plan.missing_requirements.join(', ')}` : null)
    if (message) {
      setUpdateInfo(component, { status: 'blocked', message })
      return null
    }
    return plan
  } catch (e: unknown) {
    const message = errorMessage(e, 'update plan failed')
    setUpdateInfo(component, { status: 'failed', message })
    return null
  }
}

async function stageKeeper(legacy: NonNullable<Awaited<ReturnType<typeof legacyKeeperForAppUpdate>>>) {
  const offered = updateScan.value[KEEPER_COMPONENT]?.latestVersion
  setUpdateInfo(KEEPER_COMPONENT, { currentVersion: legacy.active, status: 'planning' })
  try {
    const version = await activateKeeperForAppUpdate(hub!, legacy, offered)
    setUpdateInfo(KEEPER_COMPONENT, { status: 'updated', currentVersion: version, latestVersion: version })
  } catch (e: unknown) {
    setUpdateInfo(KEEPER_COMPONENT, { status: 'failed', message: errorMessage(e, 'Keeper update failed') })
    throw e
  }
}

async function updateInstalledDependency(dep: InstalledRow): Promise<boolean> {
  if (!hub || !dep.component || updateAllRunning.value || updatingRoot) return false
  updatingRoot = true
  let keeperUpdated = false
  try {
    let info = updateInfoForDep(dep)
    if (!info) {
      const currentVersion = resolvedDependencyVersion(dep)
      const versions = await hub.listVersions(dep.component)
      const latestVersion = latestVersionFrom(versions.items)
      info = {
        component: dep.component,
        currentVersion,
        latestVersion,
        status: isNewerVersion(latestVersion, currentVersion) ? 'available' : 'current',
      }
      setUpdateInfo(dep.component, info)
    }
    if (!info.latestVersion || !isNewerVersion(info.latestVersion, resolvedDependencyVersion(dep))) return true

    const version = trackingConstraint(info.latestVersion)
    const legacy = dep.component === APP_COMPONENT ? await legacyKeeperForAppUpdate(hub) : null
    let planned = await planRootUpdate(dep.component, version)
    if (!planned) return false
    if (legacy) {
      await stageKeeper(legacy)
      keeperUpdated = true
      planned = await planRootUpdate(dep.component, version)
      if (!planned) {
        const message = updateInfoForDep(dep)?.message || 'KickSide update paused'
        setUpdateInfo(dep.component, { message: `Keeper was updated. ${message}` })
        return false
      }
    }

    setUpdateInfo(dep.component, { status: 'updating' })
    await hub.install({
      ...planned.install_payload,
      component: dep.component,
      version,
      run_migrations: true,
      migration_policy: 'up',
    })
    setUpdateInfo(dep.component, {
      status: 'updated',
      currentVersion: info.latestVersion,
      latestVersion: info.latestVersion,
    })
    if (!keeperUpdated) notifyModulesChanged()
    return true
  } catch (e: unknown) {
    const message = errorMessage(e, 'update failed')
    setUpdateInfo(dep.component, { status: 'failed', message: keeperUpdated ? `Keeper was updated. ${message}` : message })
    return false
  } finally {
    try {
      if (keeperUpdated) {
        notifyModulesChanged()
        await refreshUpdateStatus()
      }
    } finally {
      updatingRoot = false
    }
  }
}

async function refreshUpdateStatus() {
  try {
    await refreshAll()
    await refreshSelectedDetail()
  } catch (e: unknown) {
    showToast('error', `Module status could not be refreshed: ${errorMessage(e, 'refresh failed')}`)
  }
}

async function planAvailableUpdates(pending: InstalledRow[], keeperUpdated: boolean) {
  for (const dep of pending) setUpdateInfo(dep.component, { status: 'planning' })
  const plan = await hub!.planBatchInstall({
    dependencies: pending.map(dep => ({
      id: dep.dependencyId,
      component: dep.component,
      version: trackingConstraint(updateInfoForDep(dep)!.latestVersion),
    })),
    run_migrations: true,
    migration_policy: 'up',
  })
  const blockers = new Map<string, string>()
  for (const root of plan.plans) {
    const blocker = updatePlanBlocker(root)
    if (blocker) blockers.set(root.dependency?.component || 'Unknown module', blocker)
  }
  if (!plan.applicable || blockers.size) {
    for (const dep of pending) setUpdateInfo(dep.component, {
      status: blockers.has(dep.component) ? 'blocked' : 'skipped',
      message: blockers.get(dep.component) || 'Batch not applied because its plan is blocked',
    })
    const message = blockers.size
      ? [...blockers].map(([component, text]) => `${component}: ${text}`).join('. ')
      : keeperUpdated ? 'Update plan cannot be applied.' : 'Update plan cannot be applied. No modules were changed.'
    showToast('error', keeperUpdated ? `Keeper was updated. ${message}` : message)
    return null
  }
  if (!plan.install_payload?.dependencies?.length) throw new Error('Update plan returned no install payload')
  return plan.install_payload
}

async function updateAllAvailable() {
  if (updateAllRunning.value || updatingRoot || availableUpdates.value.length === 0) return
  updateAllRunning.value = true
  let pending = [...availableUpdates.value]
  let keeperUpdated = false
  let batchUpdated = false
  try {
    const legacy = pending.some(dep => dep.component === APP_COMPONENT) ? await legacyKeeperForAppUpdate(hub!) : null
    let payload = await planAvailableUpdates(pending, false)
    if (!payload) return
    if (legacy) {
      await stageKeeper(legacy)
      keeperUpdated = true
      pending = pending.filter(dep => dep.component !== KEEPER_COMPONENT)
      payload = await planAvailableUpdates(pending, true)
      if (!payload) return
    }
    const count = pending.length + (keeperUpdated ? 1 : 0)
    for (const dep of pending) setUpdateInfo(dep.component, { status: 'updating' })
    await hub!.install(payload)
    batchUpdated = true
    for (const dep of pending) setUpdateInfo(dep.component, { status: 'updated' })
    showToast('ok', `Updated ${count} module${count === 1 ? '' : 's'}`)
  } catch (e: unknown) {
    const error = errorMessage(e, 'update failed')
    const message = keeperUpdated ? `Keeper was updated. ${error}` : error
    for (const dep of pending) setUpdateInfo(dep.component, { status: 'failed', message })
    showToast('error', message)
  } finally {
    try {
      if (keeperUpdated || batchUpdated) notifyModulesChanged()
      await refreshUpdateStatus()
    } finally {
      updateAllRunning.value = false
    }
  }
}


  return {
    updateScan, updateScanLoading, updateAllRunning, availableUpdates,
    updateInfoForDep, updateStatusLabel, updateStatusIcon, updateStatusBusy,
    scanInstalledUpdates, updateInstalledDependency, updateAllAvailable,
  }
}
