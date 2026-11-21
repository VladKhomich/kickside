// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Plugin } from 'vite'

export function requireRendererEntryRegistration(entries: readonly string[]): Plugin {
  return {
    name: 'renderer-entry-registration',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const entry of entries) {
        const filename = `${entry}.js`
        const chunk = bundle[filename]
        if (!chunk || chunk.type !== 'chunk' || !chunk.isEntry) {
          this.error(`Missing renderer entry ${filename}`)
        }

        // Web Host passes the declared tag in the entry URL. A generated chunk
        // imported by the entry cannot register with its own import.meta.url.
        const { body } = this.parse(chunk.code)
        const defineNames = new Set<string>()
        for (const node of body) {
          if (node.type !== 'ImportDeclaration' || node.source.value !== '@wippy-fe/proxy') continue
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.type === 'Identifier' && specifier.imported.name === 'define') {
              defineNames.add(specifier.local.name)
            }
          }
        }

        const registers = body.some(node => {
          if (node.type !== 'ExpressionStatement') return false
          const expression = node.expression
          const calls = expression.type === 'SequenceExpression' ? expression.expressions : [expression]
          return calls.some(call => {
            if (call.type !== 'CallExpression' || call.callee.type !== 'Identifier' || !defineNames.has(call.callee.name)) return false
            const [url] = call.arguments
            return url?.type === 'MemberExpression' && !url.computed &&
              url.object.type === 'MetaProperty' && url.object.meta.name === 'import' && url.object.property.name === 'meta' &&
              url.property.type === 'Identifier' && url.property.name === 'url'
          })
        })
        if (!registers) this.error(`${filename} must call the Wippy proxy define(import.meta.url, …) from its entry`)
      }
    },
  }
}
