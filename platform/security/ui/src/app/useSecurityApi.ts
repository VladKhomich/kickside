import { ref } from 'vue'
import { api } from '@wippy-fe/proxy'
import type { Policy, Scope } from '../types.ts'

export function messageOf(e: unknown, fallback: string): string {
  const data = (e as any)?.response?.data ?? (e as any)?.data
  if (typeof data?.error === 'string' && data.error) return data.error
  if (typeof data?.message === 'string' && data.message) return data.message
  return e instanceof Error ? e.message : fallback
}

export function useSecurityApi() {
  const scopes = ref<Scope[]>([])
  const assignablePolicies = ref<Policy[]>([])
  const loading = ref(true)
  const saving = ref(false)
  const error = ref('')

  let loadSeq = 0

  async function load(): Promise<void> {
    const seq = ++loadSeq
    loading.value = true
    error.value = ''
    try {
      const [scopeRes, assignableRes] = await Promise.all([
        api.get('/api/v1/security/scopes?view=permissions&include_unavailable=true'),
        api.get('/api/v1/security/policies?assignable=true'),
      ])
      if (seq !== loadSeq) return
      scopes.value = (scopeRes.data?.scopes ?? []) as Scope[]
      assignablePolicies.value = (assignableRes.data?.policies ?? []) as Policy[]
    }
    catch (e) {
      if (seq === loadSeq) error.value = messageOf(e, 'failed to load security')
    }
    finally {
      if (seq === loadSeq) loading.value = false
    }
  }

  async function loadComposition(id: string): Promise<Scope> {
    const response = await api.get(`/api/v1/security/scopes?id=${encodeURIComponent(id)}`)
    const scope = response.data?.scopes?.[0] as Scope | undefined
    if (!scope) throw new Error('Role no longer available')
    return scope
  }

  // Persist a custom scope (create or update). The backend writes the DB row; the
  // projection service projects it into a security.scope registry entry shortly after.
  async function saveScope(payload: { slug: string, target: string, label: string, description: string, policies: string[], enabled: boolean }): Promise<boolean> {
    saving.value = true
    error.value = ''
    try {
      await api.post('/api/v1/security/scopes', payload)
      await load()
      return true
    }
    catch (e) {
      error.value = messageOf(e, 'failed to save scope')
      return false
    }
    finally {
      saving.value = false
    }
  }

  async function deleteScope(slug: string): Promise<boolean> {
    saving.value = true
    error.value = ''
    try {
      await api.delete(`/api/v1/security/scopes?slug=${encodeURIComponent(slug)}`)
      await load()
      return true
    }
    catch (e) {
      error.value = messageOf(e, 'failed to delete scope')
      return false
    }
    finally {
      saving.value = false
    }
  }

  return { scopes, assignablePolicies, loading, saving, error, load, loadComposition, saveScope, deleteScope }
}
