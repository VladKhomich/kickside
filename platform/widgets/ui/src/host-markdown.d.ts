// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

declare module 'markdown-it' {
  export default class MarkdownIt {
    constructor(options: { html: boolean, linkify: boolean })
    validateLink(url: string): boolean
    render(source: string): string
  }
}
