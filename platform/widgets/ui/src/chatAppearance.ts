// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

export type ChatSurface = 'sessions' | 'sidebar'
export type ChatIntro = 'default' | 'markdown' | 'hidden'
export type ChatMarkdownAlignment = 'left' | 'center' | 'right'

export interface ChatScreen {
  intro: ChatIntro
  markdown: string
  markdown_alignment: ChatMarkdownAlignment
  show_message: boolean
  show_agent_picker: boolean
  default_agent?: string
}

export interface ChatProfile extends ChatScreen {
  allowed_agents?: string[]
}

export interface ChatAppearance {
  navigation: { visible: boolean, placement: 'first' | 'last' }
  sessions: ChatProfile
  sidebar: ChatProfile
}

export function defaultChatScreen(surface: ChatSurface): ChatScreen {
  return { intro: 'default', markdown: '', markdown_alignment: 'left', show_message: surface === 'sessions', show_agent_picker: true }
}

export function loadChatAppearance(saved?: Partial<ChatAppearance>): ChatAppearance {
  return {
    navigation: { visible: true, placement: 'first', ...saved?.navigation },
    sessions: { ...defaultChatScreen('sessions'), ...saved?.sessions },
    sidebar: { ...defaultChatScreen('sidebar'), ...saved?.sidebar },
  }
}

export function chatAppearanceError(appearance: ChatAppearance): string {
  for (const [label, profile] of [['Sessions page', appearance.sessions], ['Sidebar chat', appearance.sidebar]] as const) {
    if (profile.intro === 'markdown' && !profile.markdown.trim()) return label + ' needs a Markdown intro.'
    if (new TextEncoder().encode(profile.markdown).byteLength > 32768) return label + ' intro exceeds 32 KiB.'
    if (profile.allowed_agents && (profile.allowed_agents.length === 0 || profile.allowed_agents.length > 100)) {
      return label + ' needs between 1 and 100 selected agents.'
    }
    if (!profile.show_agent_picker) {
      if (!profile.default_agent) return label + ' needs a default agent.'
      if (profile.allowed_agents && !profile.allowed_agents.includes(profile.default_agent)) {
        return label + ' must include the default agent in its selected agents.'
      }
    }
  }
  return ''
}
