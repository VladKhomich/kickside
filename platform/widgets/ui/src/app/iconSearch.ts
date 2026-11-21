// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

export async function iconNamesFingerprint(ids: string[], prefix: string): Promise<string | undefined> {
  if (!globalThis.crypto?.subtle) return
  const names = ids.map(id => id.slice(prefix.length + 1)).sort().join('\n')
  const hash = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(names))
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')
}

export function searchIconNames(names: Iterable<string>, prefix: string, input: string, limit = 120): string[] {
  const namespace = prefix + ':'
  const query = input.trim().toLowerCase()
  const term = (query.startsWith(namespace) ? query.slice(namespace.length) : query).replace(/[\s_]+/g, '-')
  const words = term.split('-').filter(Boolean)
  if (!words.length) return []

  const matches = new Map<string, number>()
  for (const id of names) {
    if (!id.startsWith(namespace)) continue
    const name = id.slice(namespace.length)
    if (words.every(word => name.includes(word))) {
      matches.set(id, name === term ? 0 : name.startsWith(term) ? 1 : 2)
    }
  }
  return [...matches]
    .sort(([left, leftRank], [right, rightRank]) => leftRank - rightRank || left.localeCompare(right))
    .slice(0, limit)
    .map(([id]) => id)
}
