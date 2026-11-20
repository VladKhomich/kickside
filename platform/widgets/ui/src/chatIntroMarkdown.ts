// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
/// <reference path="./host-markdown.d.ts" />

import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({ html: false, linkify: true })
const markdownAllowsLink = markdown.validateLink.bind(markdown)

markdown.validateLink = (url) => {
  // Only allow web links, mail links, and relative URLs. Exclude protocol-relative
  // URLs and backslashes so browsers cannot reinterpret the destination.
  if (url.startsWith('//') || url.includes('\\') || !markdownAllowsLink(url)) return false
  const scheme = /^[a-z][a-z0-9+.-]*:/i.exec(url)?.[0].toLowerCase()
  return scheme === undefined || scheme === 'http:' || scheme === 'https:' || scheme === 'mailto:'
}

export function renderChatIntro(source: string): string {
  return markdown.render(source)
}

export function followChatIntroLink(event: MouseEvent, navigate: (path: string) => unknown): void {
  if (event.button !== 0 || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
  const target = event.target instanceof Element ? event.target.closest('a[href]') : null
  const path = target?.getAttribute('href')
  if (path?.startsWith('/') && !path.startsWith('//')) {
    event.preventDefault()
    navigate(path)
  }
}
