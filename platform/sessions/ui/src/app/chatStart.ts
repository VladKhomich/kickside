// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { on, ws } from '@wippy-fe/proxy'

function waitForWelcome(signal: AbortSignal) {
  signal.throwIfAborted()
  return new Promise<void>((resolve, reject) => {
    const off = on('welcome', () => {
      off()
      signal.removeEventListener('abort', abort)
      resolve()
    })
    function abort() {
      off()
      reject(signal.reason)
    }
    signal.addEventListener('abort', abort, { once: true })
  })
}

/** Exchange a reserved host intent in the Host's authenticated WebSocket. */
export async function exchangeStartToken(token: string, signal: AbortSignal): Promise<string> {
  const command = { type: 'session_open', start_token: token } as const
  const response = await ws.sendWithResponse(command).catch(async error => {
    // This transport error occurs before the command is sent. A lost reply
    // can follow a successful send, so only a disconnected send can be retried.
    if (!(error instanceof Error) || error.message !== 'WebSocket is not connected') throw error
    await waitForWelcome(signal)
    signal.throwIfAborted()
    return ws.sendWithResponse(command)
  })
  if (response.topic === 'session.opened' && response.data.session_id) return response.data.session_id
  throw new Error('The start request did not return a chat session')
}

export function closeStartedSession(sessionId: string) {
  ws.send({ type: 'session_close', session_id: sessionId })
}
