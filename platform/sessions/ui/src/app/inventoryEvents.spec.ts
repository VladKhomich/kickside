// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import type { ArtifactSummary, Session } from '../types.ts'
import {
  compareArtifactsNewest,
  compareSessionsNewest,
  readArtifactUpdate,
  readSessionOpened,
  readSessionUpdate,
  readStoredSessionMessage,
} from './inventoryEvents.ts'

const SESSION_TOPIC = 'session:session-a'
const MESSAGE_TOPIC = 'session:session-a:message:response-a'
const ARTIFACT_TOPIC = 'artifact:artifact-a'

function event(topic: string, data: Record<string, unknown>) {
  return { topic, data }
}

describe('session inventory updates', () => {
  it('maps sparse session updates and keeps explicit empty values', () => {
    expect(readSessionUpdate(event(SESSION_TOPIC, {
      type: 'update',
      session_id: 'session-a',
      title: '',
      kind: 'chat',
      status: 'idle',
      agent: null,
      model: 'model-a',
      last_message_date: '2026-11-19T10:01:00.000000009Z',
      public_meta: { favorite: false },
      interaction: { can_send: true },
    }))).toEqual({
      sessionId: 'session-a',
      patch: {
        title: '',
        kind: 'chat',
        status: 'idle',
        current_agent: '',
        current_model: 'model-a',
        last_message_date: '2026-11-19T10:01:00.000000009Z',
        public_meta: { favorite: false },
      },
      deleted: false,
    })
  })

  it('leaves favorite metadata alone when the update carries public links', () => {
    for (const publicMeta of [[{ id: 'docs', title: 'Docs' }], [], null, { favorite: 'yes' }]) {
      expect(readSessionUpdate(event(SESSION_TOPIC, {
        type: 'update',
        status: 'idle',
        public_meta: publicMeta,
      }))?.patch).toEqual({ status: 'idle' })
    }
    expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'update', public_meta: {} }))?.patch)
      .toEqual({ public_meta: {} })
  })

  it('reports deletion and artifact creation with a typed event for the affected session', () => {
    expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'update', deleted: true }))).toEqual({
      sessionId: 'session-a', patch: {}, deleted: true,
    })
    expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'update', artifact_added: 'artifact-a' }))).toEqual({
      sessionId: 'session-a', patch: {}, deleted: false, artifactId: 'artifact-a',
    })
  })

  it('rejects invalid routing, non-inventory fields, and command responses', () => {
    expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'update', session_id: 'session-b', title: 'Wrong row' })))
      .toBeNull()
    expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'update', title: [1], last_message_date: 'invalid', deleted: 'true' })))
      .toBeNull()
    expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'update', request_id: 'request-a' }))).toBeNull()
    expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'command_response', title: 'Wrong event' }))).toBeNull()
    expect(readSessionUpdate(event(MESSAGE_TOPIC, { type: 'update', title: 'Wrong scope' }))).toBeNull()
    expect(readSessionUpdate(event('session:bad%2', { type: 'update', title: 'Bad encoding' }))).toBeNull()
  })

  it('accepts Unix seconds and milliseconds without changing the represented time', () => {
    const iso = '2026-11-19T10:01:00.000Z'
    for (const timestamp of [Date.parse(iso), Date.parse(iso) / 1000]) {
      expect(readSessionUpdate(event(SESSION_TOPIC, { type: 'update', last_message_date: timestamp }))?.patch)
        .toEqual({ last_message_date: iso })
    }
  })

  it('reads the session ID only from a session opened event', () => {
    expect(readSessionOpened(event('session.opened', { session_id: 'session-a', active_session_ids: ['session-a'] })))
      .toBe('session-a')
    expect(readSessionOpened(event('session.closed', { session_id: 'session-a' }))).toBeUndefined()
    expect(readSessionOpened(event('session.opened', { session_id: '\n' }))).toBeUndefined()
    expect(readSessionOpened({ topic: 'session.opened', data: ['session-a'] })).toBeUndefined()
  })

  it('recognizes stored input and final content while ignoring streaming and tool events', () => {
    expect(readStoredSessionMessage(event(MESSAGE_TOPIC, {
      type: 'received', session_id: 'session-a', message_id: 'response-a',
    }))).toBe('session-a')
    expect(readStoredSessionMessage(event(MESSAGE_TOPIC, { type: 'content', session_id: 'session-a' })))
      .toBe('session-a')
    for (const type of ['chunk', 'tool_call', 'tool_success', 'error', 'update', 'artifact']) {
      expect(readStoredSessionMessage(event(MESSAGE_TOPIC, { type }))).toBeUndefined()
    }
    expect(readStoredSessionMessage(event(MESSAGE_TOPIC, { type: 'received', message_id: 'wrong-message' })))
      .toBeUndefined()
    expect(readStoredSessionMessage(event(MESSAGE_TOPIC, { type: 'content', session_id: 'session-b' })))
      .toBeUndefined()
    expect(readStoredSessionMessage(event(SESSION_TOPIC, { type: 'content' }))).toBeUndefined()
  })
})

describe('artifact inventory updates', () => {
  it('uses the topic ID and retains a valid session hint when present', () => {
    expect(readArtifactUpdate(event(ARTIFACT_TOPIC, { session_id: 'session-a', uuid: 'artifact-a' }))).toEqual({
      artifactId: 'artifact-a', sessionId: 'session-a', deleted: false,
    })
    expect(readArtifactUpdate(event(ARTIFACT_TOPIC, { deleted: true }))).toEqual({
      artifactId: 'artifact-a', deleted: true,
    })
    expect(readArtifactUpdate(event('artifact:encoded%3Aid', { uuid: 'encoded:id' }))).toEqual({
      artifactId: 'encoded:id', deleted: false,
    })
  })

  it('rejects mismatched IDs, malformed topics, and unstructured envelopes', () => {
    expect(readArtifactUpdate(event(ARTIFACT_TOPIC, { artifact_id: 'artifact-b' }))).toBeNull()
    expect(readArtifactUpdate(event(ARTIFACT_TOPIC, { uuid: 'artifact-b' }))).toBeNull()
    expect(readArtifactUpdate(event('artifact:artifact-a:message', {}))).toBeNull()
    expect(readArtifactUpdate(event('artifact:', {}))).toBeNull()
    expect(readArtifactUpdate({ topic: ARTIFACT_TOPIC, data: 'garbage' })).toBeNull()
    expect(readArtifactUpdate(null)).toBeNull()
  })
})

function session(id: string, timestamp?: string): Session {
  return { session_id: id, title: '', current_agent: '', current_model: '', last_message_date: timestamp }
}

function artifact(id: string, timestamp?: string, updatedAt?: string): ArtifactSummary {
  return { uuid: id, artifact_id: id, kind: 'text', type: 'text', title: '', created_at: timestamp, updated_at: updatedAt }
}

describe('inventory order', () => {
  it('keeps exact session date fractions and leaves ties in server order', () => {
    const second = '2026-11-19T10:01:00'
    const rows = [
      session('tie-a', second + '.000000010Z'),
      session('older', second + '.000000009Z'),
      session('tie-b', second + '.00000001Z'),
      session('missing'),
      session('oldest', second + 'Z'),
    ]
    expect(rows.sort(compareSessionsNewest).map(row => row.session_id))
      .toEqual(['tie-a', 'tie-b', 'older', 'oldest', 'missing'])
  })

  it('orders artifacts by creation then ID even if an old artifact has changed', () => {
    const earlier = '2026-11-19T10:01:00Z'
    const latest = '2026-11-19T10:02:00Z'
    const rows = [artifact('c', earlier, latest), artifact('a', latest), artifact('b', latest)]
    expect(rows.sort(compareArtifactsNewest).map(row => row.uuid)).toEqual(['b', 'a', 'c'])
  })
})
