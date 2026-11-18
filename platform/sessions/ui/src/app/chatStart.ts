// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { ws } from '@wippy-fe/proxy'

/** Exchange a reserved host intent in the Host's authenticated WebSocket. */
export async function exchangeStartToken(token: string): Promise<string> {
  const response = await ws.sendWithResponse({ type: 'session_open', start_token: token })
  if (response.topic === 'session.opened' && response.data.session_id) return response.data.session_id
  throw new Error('The start request did not return a chat session')
}

export function closeStartedSession(sessionId: string) {
  ws.send({ type: 'session_close', session_id: sessionId })
}
