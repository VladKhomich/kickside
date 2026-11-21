// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { fileURLToPath } from 'node:url'
import MagicString from 'magic-string'
import { normalizePath, type Plugin } from 'vite'

const dependencyEntry = '/node_modules/docx-preview/dist/docx-preview.mjs'
const numberingStyle = [
  '                styleText += this.styleToString(`${selector}:before`, {',
  '                    "content": this.levelTextToContent(num.levelText, num.suff, num.id, this.numFormatToCssValue(num.format)),',
  '                    "counter-increment": counter,',
  '                    ...num.rStyle,',
  '                });',
].join('\n')
const portableNumberingStyle = [
  '                const { text, style } = num.format === "bullet"',
  '                    ? symbolFontBullet(num.levelText, num.rStyle)',
  '                    : { text: num.levelText, style: num.rStyle };',
  '                styleText += this.styleToString(`${selector}:before`, {',
  '                    "content": this.levelTextToContent(text, num.suff, num.id, this.numFormatToCssValue(num.format)),',
  '                    "counter-increment": counter,',
  '                    ...style,',
  '                });',
].join('\n')

// Apply docxjs #241 to the locked distribution until a release ships it.
export function docxPreviewSymbolBullets(): Plugin {
  const helper = normalizePath(fileURLToPath(new URL('./src/docx/symbol-bullets.ts', import.meta.url)))
  return {
    name: 'docx-preview-symbol-bullets',
    enforce: 'pre',
    config: () => ({ optimizeDeps: { exclude: ['docx-preview'] } }),
    transform(code, id) {
      if (!normalizePath(id).endsWith(dependencyEntry)) return null

      const start = code.indexOf(numberingStyle)
      if (start < 0 || code.indexOf(numberingStyle, start + numberingStyle.length) !== -1) {
        this.error('The docx-preview numbering source changed. Recheck the backport of docxjs #241.')
      }

      const patched = new MagicString(code)
      patched.prepend(`import { symbolFontBullet } from ${JSON.stringify(helper)};\n`)
      patched.overwrite(start, start + numberingStyle.length, portableNumberingStyle)
      return { code: patched.toString(), map: patched.generateMap({ hires: true }) }
    },
  }
}
