// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import sanitizeHtml from 'sanitize-html'
import { approvedDocumentHref, documentLinkSchemes } from './links'

export function sanitizeEmbeddedDocumentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedAttributes: {
      '*': ['id'],
      a: ['href', 'name'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
      ol: ['start'],
    },
    allowedSchemes: documentLinkSchemes,
    transformTags: {
      a: (tagName, { href, ...attribs }) => {
        const approved = approvedDocumentHref(href)
        return { tagName, attribs: approved ? { ...attribs, href: approved } : attribs }
      },
    },
  })
}
