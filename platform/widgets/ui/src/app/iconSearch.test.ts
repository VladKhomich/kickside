// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

import { describe, expect, it } from 'vitest'
import catalogue from 'virtual:tabler-icon-names'
import catalogueFingerprint from 'virtual:tabler-icon-names/fingerprint'
import { iconNamesFingerprint, searchIconNames } from './iconSearch'

const tablerNames = catalogue.split('\n').map(name => `tabler:${name}`)

describe('icon name search', () => {
  it('finds shipped glyphs and aliases beyond a partially populated store', () => {
    expect(tablerNames.length).toBeGreaterThan(6000)
    expect(searchIconNames(['tabler:home', ...tablerNames], 'tabler', 'windmill')[0]).toBe('tabler:windmill')
    expect(searchIconNames(tablerNames, 'tabler', '3d rotate')[0]).toBe('tabler:3d-rotate')
  })

  it('recognizes the full registered collection independently of registration order', async () => {
    expect(await iconNamesFingerprint([...tablerNames].reverse(), 'tabler')).toBe(catalogueFingerprint)
    expect(await iconNamesFingerprint(tablerNames.slice(0, 50), 'tabler')).not.toBe(catalogueFingerprint)
  })

  it('includes newly registered names and preserves namespaced IDs', () => {
    const names = ['tabler:lab-rocket', 'tabler:rocket', 'tabler:rocket', 'mdi:rocket', 'tabler:rocket-off']
    expect(searchIconNames(names, 'tabler', '  TABLER:Rocket  ')).toEqual([
      'tabler:rocket', 'tabler:rocket-off', 'tabler:lab-rocket',
    ])
    expect(searchIconNames(names, 'mdi', 'rocket')).toEqual(['mdi:rocket'])
  })

  it('matches multiple search words and handles empty or missing matches', () => {
    expect(searchIconNames(tablerNames, 'tabler', 'device desktop')[0]).toBe('tabler:device-desktop')
    expect(searchIconNames(tablerNames, 'tabler', ' ')).toEqual([])
    expect(searchIconNames(tablerNames, 'tabler', 'no such icon fixture')).toEqual([])
  })

  it('retains the result limit for broad queries', () => {
    expect(searchIconNames(tablerNames, 'tabler', 'a')).toHaveLength(120)
  })
})
