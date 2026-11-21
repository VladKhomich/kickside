// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Options } from 'docx-preview'

export const documentLinkSchemes = ['http', 'https', 'mailto']

export function approvedDocumentHref(href: unknown): string | undefined {
  if (typeof href !== 'string') return
  const value = href.trim()
  if (!value || value.startsWith('//') || /[\u0000-\u001f\u007f\\]/.test(value)) return

  // Parse relative links and fragments against a fixed web base. Leave their
  // actual resolution to the viewer's hosting document.
  try {
    const protocol = new URL(value, 'https://document.invalid/').protocol
    if (documentLinkSchemes.includes(protocol.slice(0, -1))) return value
  } catch {
    return
  }
}

function followDocumentBookmark(event: MouseEvent, fragment: string, container: HTMLElement): void {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
  event.preventDefault()
  if (!fragment) return

  let id = fragment
  try { id = decodeURIComponent(fragment) } catch { /* Keep a literal bookmark name. */ }
  container.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView()
}

export function documentLinkFactory(create: Options['h'], container: HTMLElement): Options['h'] {
  return (element) => {
    if (typeof element === 'string' || element instanceof Node || element.tagName !== 'a') return create(element)

    const href = approvedDocumentHref(element.href)
    const link = create({ ...element, href })
    if (href?.startsWith('#') && link instanceof HTMLAnchorElement) {
      link.addEventListener('click', event => followDocumentBookmark(event, href.slice(1), container))
    }
    return link
  }
}
