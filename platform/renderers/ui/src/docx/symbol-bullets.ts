// SPDX-License-Identifier: Apache-2.0
// Adapted from Jeroen van Menen's docxjs #241 (e29b54338da8d73de0c05809113c616ef9d71823).

// Word's legacy symbol fonts use private-use code points for these bullets.
const symbolFontBullets: Record<string, Record<string, string>> = {
  symbol: { '\uf0b7': '\u2022' },
  wingdings: {
    '\uf06c': '\u25cf',
    '\uf06e': '\u25a0',
    '\uf071': '\u2751',
    '\uf075': '\u25c6',
    '\uf076': '\u2756',
    '\uf0a7': '\u25aa',
    '\uf0d8': '\u27a2',
    '\uf0e8': '\u2794',
    '\uf0fb': '\u2717',
    '\uf0fc': '\u2713',
  },
}

export function symbolFontBullet(text: string, style: Record<string, string> | undefined) {
  const font = (style?.['font-family'] ?? '').split(',')[0].replace(/['"]/g, '').trim().toLowerCase()
  const map = symbolFontBullets[font]
  if (!style || !map || ![...text].some(character => map[character])) return { text, style }

  const { 'font-family': _fontFamily, ...remainingStyle } = style
  return { text: [...text].map(character => map[character] ?? character).join(''), style: remainingStyle }
}
