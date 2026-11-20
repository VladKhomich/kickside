// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { on, ws } from '@wippy-fe/proxy'

export const CHAT_START_COORDINATOR = '@COORDINATOR/chat'
export const CHAT_START_REQUEST = 'kickside:chat-start-request'
export const CHAT_START_RESULT = 'kickside:chat-start-result'
export const CHAT_START_STATE = 'kickside:chat-start'

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

export async function sendFirstMessage(sessionId: string, message: string): Promise<'sent' | 'rejected' | 'unconfirmed'> {
  try {
    const response = await ws.sendWithResponse({ type: 'session_message', session_id: sessionId, data: { text: message } })
    const data = response.data
    const kind = data && 'type' in data ? data.type : undefined
    if (response.topic.startsWith('session:' + sessionId + ':message:') && kind === 'received') return 'sent'
    if (response.topic === 'error' || kind === 'error') return 'rejected'
    if (data && kind === 'command_response' && 'success' in data && data.success === false) return 'rejected'
  } catch {
    // A lost reply can follow a committed message. Never send it again here.
  }
  return 'unconfirmed'
}
