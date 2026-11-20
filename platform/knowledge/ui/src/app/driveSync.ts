// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export const DRIVE_FOLDER_SOURCE = 'kickside.google.source:drive_folder'
export const KNOWLEDGE_UPLOAD_SINK = 'kickside.knowledge.sink:kb_upload'
export const DATA_SYNC_TYPE = 'kickside.sync:sync'

export interface DriveSyncStatus {
  drives?: {
    drive_key: string
    source_kind?: string
    enabled?: boolean
    last_round_at?: string | null
    last_error?: { message?: string } | null
  }[]
  delivery_failures?: {
    count: number
    last_error?: { item_key?: string; message?: string }
  }
}

export interface DriveSync {
  id: string
  type: string
  title?: string
  access_level?: number
  deleting_at?: string
  availability?: unknown
  drive_status?: DriveSyncStatus
}
