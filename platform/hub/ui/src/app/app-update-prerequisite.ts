// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { HubInstallPlan, HubListDependenciesResponse, HubParameter, keeperHub } from '../keeper-hub.ts'

export const APP_COMPONENT = 'kickside/kickside'
export const KEEPER_COMPONENT = 'keeper/keeper'
const MINIMUM_KEEPER = '0.5.116'
const KEEPER_FLOOR = `>=${MINIMUM_KEEPER}`
const inventoryOptions = { includeEntries: false, includeMigrations: false }

type Hub = ReturnType<typeof keeperHub>
type KeeperRoot = HubListDependenciesResponse['dependencies'][number]
type Parameters = KeeperRoot['parameters']

function releaseVersion(version?: string): string | undefined {
  return version?.match(/^v?(\d+\.\d+\.\d+)(?:\+[\w.-]+)?$/)?.[1]
}

function keeperIsReady(version?: string): boolean {
  const release = releaseVersion(version)
  if (!release) return false
  const [major, minor, patch] = release.split('.').map(Number)
  return major > 0 || minor > 5 || (minor === 5 && patch >= 116)
}

function installedKeeper(state: HubListDependenciesResponse) {
  return state.modules?.find(row => row.name === KEEPER_COMPONENT && row.installed !== false)
}

export async function legacyKeeperForAppUpdate(hub: Hub) {
  const state = await hub.listDependencies(inventoryOptions)
  const active = installedKeeper(state)
  if (keeperIsReady(active?.version)) return null
  const root = state.dependencies.find(row => row.component === KEEPER_COMPONENT && row.installed !== false && row.is_root !== false)
  if (!active?.version || !root?.id || active.source === 'local' || root.source === 'local') {
    throw new Error(`Verify an active Hub-installed Keeper ${MINIMUM_KEEPER} or newer before updating KickSide.`)
  }
  return { active: active.version, root, state }
}

export function updatePlanBlocker(plan: HubInstallPlan): string | null {
  const missing = plan.missing_requirements || []
  const invalid = (plan.requirements || []).filter(requirement => requirement.invalid)
    .map(requirement => `${requirement.id || requirement.parameter_name}: ${requirement.invalid_reason || 'invalid value'}`)
  if (missing.length || invalid.length) {
    return [
      missing.length ? `Missing required settings: ${missing.join(', ')}` : '',
      invalid.length ? `Invalid settings: ${invalid.join(', ')}` : '',
    ].filter(Boolean).join('. ')
  }
  return plan.applicable === false ? 'Update plan cannot be applied' : null
}

function parametersAsList(parameters: Parameters): HubParameter[] {
  if (!parameters) return []
  return Array.isArray(parameters) ? parameters : Object.entries(parameters).map(([name, value]) => ({
    name, value: value as HubParameter['value'],
  }))
}

function stableValue(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return item
    return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
  })
}

function sameBindings(before: Parameters, after: Parameters): boolean {
  const saved = parametersAsList(before)
  const planned = parametersAsList(after)
  if (saved.length !== planned.length) return false
  const matched = new Set<string>()
  for (const binding of saved) {
    const matches = planned.filter(item => item.name === binding.name ||
      (!binding.name.includes(':') && item.name.split(':').at(-1) === binding.name))
    if (matches.length !== 1 || matched.has(matches[0].name) ||
        stableValue(matches[0].value) !== stableValue(binding.value)) return false
    matched.add(matches[0].name)
  }
  return true
}

export const keeperFirstMessage = `Update Keeper to ${MINIMUM_KEEPER} or newer first, then retry the KickSide update.`

export async function activateKeeperForAppUpdate(
  hub: Hub,
  legacy: NonNullable<Awaited<ReturnType<typeof legacyKeeperForAppUpdate>>>,
  requestedVersion?: string,
): Promise<string> {
  const root = legacy.root
  const version = keeperIsReady(requestedVersion) ? `>=${releaseVersion(requestedVersion)}` : KEEPER_FLOOR
  const plan = await hub.planBatchInstall({
    dependencies: [{ id: root.id, component: KEEPER_COMPONENT, version, parameters: parametersAsList(root.parameters) }],
    run_migrations: true,
    migration_policy: 'up',
  })
  const keeperPlan = plan.plans?.[0]
  const blocker = keeperPlan && updatePlanBlocker(keeperPlan)
  if (blocker) throw new Error(`Keeper: ${blocker}`)
  const dependencies = plan.install_payload?.dependencies
  const prepared = dependencies?.[0]
  const plannedVersion = keeperPlan?.graph?.find(row => row.module === KEEPER_COMPONENT)?.version
  const currentVersions = new Map(legacy.state.modules?.map(row => [row.name, row.version]))
  if (!plan.applicable || plan.plans?.length !== 1 || dependencies?.length !== 1 ||
      prepared?.component !== KEEPER_COMPONENT || prepared.id !== root.id || prepared.version !== version ||
      !sameBindings(root.parameters, prepared.parameters) || !keeperIsReady(plannedVersion) ||
      keeperPlan?.graph?.some(row => row.module !== KEEPER_COMPONENT && currentVersions.get(row.module) !== row.version)) {
    throw new Error(`The Keeper prerequisite needs a separate review. ${keeperFirstMessage}`)
  }

  const applied = await hub.install(plan.install_payload)
  if (applied.success !== true) {
    throw new Error('Keeper did not confirm the prerequisite install. Check the installed modules before retrying.')
  }
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const state = await hub.listDependencies(inventoryOptions)
      const active = installedKeeper(state)
      const projection = await hub.securityProjectionStatus()
      if (active?.version && keeperIsReady(active.version) && projection.current) return active.version
    } catch {
      // The old endpoint can briefly disappear while the new Keeper takes over.
    }
    if (attempt < 11) await new Promise(resolve => setTimeout(resolve, 750))
  }
  throw new Error('Keeper was installed but its active version could not be verified. Check the installed modules before retrying.')
}
