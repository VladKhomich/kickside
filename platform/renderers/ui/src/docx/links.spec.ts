// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { sanitizeEmbeddedDocumentHtml } from './embedded-html'
import { approvedDocumentHref } from './links'

it.each([
  'https://example.test/guide#summary',
  'HTTP://example.test/guide',
  'mailto:reviewer@example.test',
  '#chapter%202',
  '/files/reference',
  '../reference',
  '?tab=files',
])('preserves an approved document link %s', href => {
  expect(approvedDocumentHref(href)).toBe(href)
})

it.each([
  undefined,
  '',
  'ftp://example.test/reference',
  'tel:+15550100',
  '//example.test/reference',
  'folder\\reference',
  'https://[',
])('omits an unsupported document destination %s', href => {
  expect(approvedDocumentHref(href)).toBeUndefined()
})

it('retains readable embedded content and applies the same policy to its links', () => {
  const html = sanitizeEmbeddedDocumentHtml(
    '<h2 id="chapter">Import notes</h2><ol start="3"><li>Read the notes</li></ol>' +
    '<table><tr><td colspan="2">Summary</td></tr></table>' +
    '<p><a href="#chapter">Jump to heading</a> <a href="mailto:reviewer@example.test">Contact</a> ' +
    '<a href="ftp://example.test/reference">Download reference</a></p>',
  )
  expect(html).toContain('<h2 id="chapter">Import notes</h2>')
  expect(html).toContain('<ol start="3"><li>Read the notes</li></ol>')
  expect(html).toContain('<td colspan="2">Summary</td>')
  expect(html).toContain('<a href="#chapter">Jump to heading</a>')
  expect(html).toContain('<a href="mailto:reviewer@example.test">Contact</a>')
  expect(html).toContain('<a>Download reference</a>')
})
