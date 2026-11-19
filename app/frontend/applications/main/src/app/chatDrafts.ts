// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { ChatDrafts } from '@widgets/chatDraftComposer'
import type { HostApi } from '../types'

const CHANNEL = 'kickside:chat-draft'
const COORDINATOR = '@COORDINATOR/chat'

/** Use the existing directed layout bus for the app's inline surface. */
export function useInlineChatDrafts(host: HostApi): ChatDrafts & { dispose: () => void } {
  let receive: ((draft: string | undefined) => void) | undefined
  let request = 0
  const stop = host.layout.on(CHANNEL, ({ sourcePanelId, payload }) => {
    if (sourcePanelId !== COORDINATOR || !payload || typeof payload !== 'object') return
    const { requestId, draft } = payload as { requestId?: unknown; draft?: unknown }
    if (requestId !== request || typeof draft !== 'string') return
    receive?.(draft)
    receive = undefined
  })
  return {
    read(sessionId) {
      receive?.(undefined)
      return new Promise(resolve => {
        receive = resolve
        host.layout.send(COORDINATOR, CHANNEL, { kind: 'read', sessionId, requestId: ++request })
      })
    },
    write(sessionId, draft) {
      host.layout.send(COORDINATOR, CHANNEL, { kind: 'write', sessionId, draft })
    },
    dispose() {
      receive?.(undefined)
      stop?.()
    },
  }
}
