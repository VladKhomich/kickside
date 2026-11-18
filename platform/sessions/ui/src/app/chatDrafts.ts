// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { ChatDrafts } from '@widgets/chatDraftComposer'

const MAX_SESSIONS = 100

/** Owned by a single authenticated Host. A credential change discards its drafts. */
export function createChatDrafts(token: () => string | undefined): ChatDrafts {
  const owner = token()
  let active = !!owner
  const drafts = new Map<string, string>()
  function isAuthenticated() {
    if (active && owner !== token()) {
      drafts.clear()
      active = false
    }
    return active
  }
  return {
    async read(sessionId) {
      return isAuthenticated() ? drafts.get(sessionId) ?? '' : undefined
    },
    write(sessionId, draft) {
      if (!isAuthenticated()) return
      drafts.delete(sessionId)
      if (draft) drafts.set(sessionId, draft)
      if (drafts.size > MAX_SESSIONS) {
        const oldest = drafts.keys().next().value
        if (oldest) drafts.delete(oldest)
      }
    },
  }
}
