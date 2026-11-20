// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { ArtifactSummary, Session } from '../types.ts'
import { artifactId } from './artifactPresentation.ts'

type SessionPatch = Partial<Pick<Session,
  'title' | 'status' | 'kind' | 'current_agent' | 'current_model' | 'public_meta' | 'last_message_date'>>

interface SessionUpdate {
  sessionId: string
  patch: SessionPatch
  deleted: boolean
  artifactId?: string
  refresh?: true
}

interface ArtifactUpdate {
  artifactId: string
  sessionId?: string
  deleted: boolean
}

const SESSION_TEXT_FIELDS = {
  title: 'title',
  status: 'status',
  kind: 'kind',
  agent: 'current_agent',
  model: 'current_model',
} as const

const RFC3339_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.(\d{1,9}))?(?:Z|[+-]\d{2}:\d{2})$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readEvent(message: unknown) {
  if (!isRecord(message) || typeof message.topic !== 'string' || !isRecord(message.data)) return
  return { topic: message.topic, parts: message.topic.split(':'), data: message.data }
}

function readId(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value || /[\s\u0000-\u001F\u007F]/.test(value)) return
  return value
}

function readTopicId(segment: string): string | undefined {
  try {
    return readId(decodeURIComponent(segment))
  } catch {
    return undefined
  }
}

function matchesId(value: unknown, id: string): boolean {
  return value === undefined || value === id
}

function timestampMilliseconds(value: unknown): number {
  if (typeof value === 'string') return Date.parse(value)
  if (typeof value !== 'number' || !Number.isFinite(value)) return NaN
  // Older session rows use Unix seconds. Web Host events can use milliseconds.
  return Math.abs(value) < 1e11 ? value * 1000 : value
}

function readSessionDate(value: unknown): string | undefined {
  if (value === '' || value === null) return ''
  if (typeof value === 'string' && RFC3339_DATE.test(value) && Number.isFinite(Date.parse(value))) return value
  if (typeof value === 'number') {
    const date = new Date(timestampMilliseconds(value))
    if (Number.isFinite(date.getTime())) return date.toISOString()
  }
}

function isSessionPublicMeta(value: unknown): value is NonNullable<Session['public_meta']> {
  // The runtime also sends arrays of public links. They carry no favorite state.
  return isRecord(value) && (value.favorite === undefined || typeof value.favorite === 'boolean')
}

export function readSessionUpdate(message: unknown): SessionUpdate | null {
  const event = readEvent(message)
  if (!event || event.parts.length !== 2 || event.parts[0] !== 'session' || event.data.type !== 'update') {
    return null
  }

  const sessionId = readTopicId(event.parts[1])
  const { data } = event
  if (!sessionId || !matchesId(data.session_id, sessionId)) return null

  const patch: SessionPatch = {}
  for (const [field, property] of Object.entries(SESSION_TEXT_FIELDS)) {
    const value = data[field]
    if (typeof value === 'string' || value === null) patch[property] = value ?? ''
  }
  const lastMessageDate = readSessionDate(data.last_message_date)
  if (lastMessageDate !== undefined) patch.last_message_date = lastMessageDate
  if (isSessionPublicMeta(data.public_meta)) patch.public_meta = data.public_meta

  const deleted = data.deleted === true
  const artifactId = readId(data.artifact_added)
  const refresh = data.refresh === true
  if (!deleted && !artifactId && !refresh && Object.keys(patch).length === 0) return null
  return { sessionId, patch, deleted, ...(artifactId && { artifactId }), ...(refresh && { refresh: true }) }
}

export function readSessionOpened(message: unknown): string | undefined {
  const event = readEvent(message)
  if (event?.topic === 'session.opened') return readId(event.data.session_id)
}

export function readStoredSessionMessage(message: unknown): string | undefined {
  const event = readEvent(message)
  if (!event || event.parts.length !== 4 || event.parts[0] !== 'session' || event.parts[2] !== 'message') return
  const { data } = event
  if (data.type !== 'received' && data.type !== 'content') return
  const sessionId = readTopicId(event.parts[1])
  const messageId = readTopicId(event.parts[3])
  if (!sessionId || !messageId || !matchesId(data.session_id, sessionId)) return
  // Assistant content uses a response ID in the topic. A received input uses
  // the persisted message ID in the topic and payload.
  if (data.type === 'received' && !matchesId(data.message_id, messageId)) return
  return sessionId
}

export function readArtifactUpdate(message: unknown): ArtifactUpdate | null {
  const event = readEvent(message)
  if (!event || event.parts.length !== 2 || event.parts[0] !== 'artifact') return null
  const id = readTopicId(event.parts[1])
  const { data } = event
  if (!id || !matchesId(data.artifact_id, id) || !matchesId(data.uuid, id)) return null

  const sessionId = readId(data.session_id)
  return { artifactId: id, deleted: data.deleted === true, ...(sessionId && { sessionId }) }
}

function compareDescending<T extends string | number>(a: T, b: T): number {
  return a > b ? -1 : a < b ? 1 : 0
}

function compareDatesNewest(a: unknown, b: unknown): number {
  const timeA = timestampMilliseconds(a)
  const timeB = timestampMilliseconds(b)
  if (!Number.isFinite(timeA)) return Number.isFinite(timeB) ? 1 : 0
  if (!Number.isFinite(timeB)) return -1
  if (timeA !== timeB) return compareDescending(timeA, timeB)

  // Date.parse drops fractions below milliseconds. Preserve the server's order
  // for persisted messages that share a millisecond.
  const fractionA = (typeof a === 'string' ? RFC3339_DATE.exec(a)?.[1] : undefined) ?? ''
  const fractionB = (typeof b === 'string' ? RFC3339_DATE.exec(b)?.[1] : undefined) ?? ''
  return compareDescending(fractionA.padEnd(9, '0').slice(3), fractionB.padEnd(9, '0').slice(3))
}

export function compareArtifactsNewest(a: ArtifactSummary, b: ArtifactSummary): number {
  return compareDatesNewest(a.created_at, b.created_at) || compareDescending(artifactId(a), artifactId(b))
}

export function compareSessionsNewest(a: Session, b: Session): number {
  return compareDatesNewest(a.last_message_date, b.last_message_date)
}
