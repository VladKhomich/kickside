// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import type { Plugin } from 'vite'

// Standalone hosts can have a partially populated Iconify store. Emit only the
// name index for searches there, leaving all glyph loading to Iconify.
export function tablerIconNames(): Plugin {
  const moduleId = 'virtual:tabler-icon-names'
  const fingerprintId = moduleId + '/fingerprint'
  const tabler = createRequire(import.meta.url)('@iconify-json/tabler/icons.json')
  const names = [...Object.keys(tabler.icons), ...Object.keys(tabler.aliases)].sort().join('\n')
  const fingerprint = createHash('sha256').update(names).digest('hex')
  return {
    name: 'tabler-icon-names',
    resolveId: (id) => id === moduleId || id === fingerprintId ? '\0' + id : undefined,
    load(id) {
      if (id === '\0' + moduleId) return `export default ${JSON.stringify(names)}`
      if (id === '\0' + fingerprintId) return `export default ${JSON.stringify(fingerprint)}`
    },
  }
}
