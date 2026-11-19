export interface ComponentProps {}

// A permission summary from the assignable catalog or an existing role.
export interface Policy {
  id: string
  title?: string
  surface?: string
  intent?: string
  comment?: string
  effect?: string
  actions?: unknown
  resources?: unknown
  private?: boolean
  available?: boolean
}

// A scope/role in the catalog. Built-in (implicit group), registry security.scope,
// or a DB-backed custom scope. Mirrors the backend CatalogScope.
export interface Scope {
  id: string
  slug?: string
  label: string
  description: string
  source: 'builtin' | 'registry' | 'custom'
  internal: boolean
  built_in: boolean
  enabled: boolean
  policies: Policy[]
  // For a built-in/registry scope an admin has extended via an overlay.
  base_policies?: Policy[]
  overlay_slug?: string
  overlay_policies?: Policy[]
}

// An extension's target is the original role, and its policy IDs are the added grants.
export interface ScopeDraft {
  slug: string
  label: string
  description: string
  policyIds: string[]
  enabled: boolean
  isNew: boolean
  target: string
}
