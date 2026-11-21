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
const embeddedHtml = [
  '        var result = this.h({ tagName: "iframe" });',
  '        this.tasks.push(this.document.loadAltChunk(elem.id, this.currentPart).then(x => {',
  '            result.srcdoc = x;',
  '        }));',
].join('\n')
// Keep the docxjs #241 backport and accept only sanitized, confined HTML parts.
export function docxPreviewCompatibility(): Plugin {
  const symbolBullets = normalizePath(fileURLToPath(new URL('./src/docx/symbol-bullets.ts', import.meta.url)))
  const embeddedSanitizer = normalizePath(fileURLToPath(new URL('./src/docx/embedded-html.ts', import.meta.url)))
  const confinedHtml = [
    '        var result = this.h({ tagName: "iframe" });',
    '        result.setAttribute("sandbox", "");',
    '        result.title = "Embedded Word content";',
    '        this.tasks.push(this.document.loadAltChunk(elem.id, this.currentPart).then(async html => {',
    '            if (typeof html !== "string") return;',
    `            const { sanitizeEmbeddedDocumentHtml } = await import(${JSON.stringify(embeddedSanitizer)});`,
    '            result.srcdoc = sanitizeEmbeddedDocumentHtml(html);',
    '        }));',
  ].join('\n')
  return {
    name: 'docx-preview-compatibility',
    enforce: 'pre',
    config: () => ({ optimizeDeps: { exclude: ['docx-preview'] } }),
    transform(code, id) {
      if (!normalizePath(id).endsWith(dependencyEntry)) return null

      const patched = new MagicString(code)
      for (const [feature, original, replacement] of [
        ['numbering', numberingStyle, portableNumberingStyle],
        ['embedded HTML', embeddedHtml, confinedHtml],
      ]) {
        const start = code.indexOf(original)
        if (start < 0 || code.indexOf(original, start + original.length) !== -1) {
          this.error(`The docx-preview ${feature} source changed. Recheck the renderer compatibility patch.`)
        }
        patched.overwrite(start, start + original.length, replacement)
      }
      patched.prepend(`import { symbolFontBullet } from ${JSON.stringify(symbolBullets)};\n`)
      return { code: patched.toString(), map: patched.generateMap({ hires: true }) }
    },
  }
}
