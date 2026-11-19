import { computed, ref, type Ref } from 'vue'
import { api } from '@wippy-fe/proxy'
import type { ArtifactState, PreviewSource, Upload, UploadArtifact } from './uploads.types.ts'
import {
  artifactLabel,
  formatUploadRequestError,
  uploadLabel,
} from './uploads.format.ts'

const PARTS_PER_PAGE = 30
const TABLE_PREVIEW_LIMIT = 64 * 1024
const RASTER_MIME_TYPES = new Set([
  'image/apng', 'image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/tiff',
  'image/vnd.microsoft.icon', 'image/webp', 'image/x-icon',
])

function baseMime(value: string) {
  return value.toLowerCase().split(';', 1)[0].trim()
}

function inertOpenType(source: PreviewSource, responseType: string) {
  const mime = baseMime(source.contentType || responseType)
  if (source.textAvailable || mime.startsWith('text/') || mime === 'application/xml' || mime.endsWith('+xml')) {
    return 'text/plain'
  }
  if (mime === 'application/pdf' || RASTER_MIME_TYPES.has(mime) || /^(audio|video)\//.test(mime)) return mime
  return 'application/octet-stream'
}

export function useUploadArtifacts(deliveryError: Ref<string>) {
  // Preview opens as a right-side overlay drawer; artifactView selects which file
  // the viewer shows (the original, or one extracted part).
  const preview = ref<Upload | null>(null)
  const artifactView = ref<UploadArtifact | null>(null)
  const artifactsByUpload = ref<Record<string, ArtifactState>>({})
  const partsExpanded = ref(false)
  const busyAction = ref(false)

  function artifactStateFor(uploadId: string): ArtifactState {
    return artifactsByUpload.value[uploadId] || {
      loaded: false,
      loading: false,
      error: '',
      primary: null,
      parts: [],
      total: 0,
      page: 1,
    }
  }

  function setArtifactState(uploadId: string, state: ArtifactState) {
    artifactsByUpload.value = { ...artifactsByUpload.value, [uploadId]: state }
  }

  function isSourceArtifact(artifact: UploadArtifact): boolean {
    return artifact.role === 'source' || artifact.locator?.type === 'upload.original'
  }

  function primaryArtifact(uploadId: string): UploadArtifact | null {
    const primary = artifactStateFor(uploadId).primary
    return primary?.raw_url ? primary : null
  }

  function maybeSelectDefaultArtifact(upload: Upload) {
    if (preview.value?.uuid !== upload.uuid || artifactView.value) return
    if ((artifactStateFor(upload.uuid).source ?? upload.content_description)?.inline === false) {
      artifactView.value = primaryArtifact(upload.uuid)
    }
  }

  function activePreviewSource(upload: Upload): PreviewSource {
    const state = artifactStateFor(upload.uuid)
    const artifact = artifactView.value
    const description = artifact ? artifact.content_description : state.source ?? upload.content_description
    const contentType = description?.mime_type || ''
    const table = description?.kind === 'table'
    const storedPreview = table ? description.text_preview : undefined
    const previewLength = storedPreview === undefined ? 0
      : new TextEncoder().encodeInto(storedPreview, new Uint8Array(TABLE_PREVIEW_LIMIT)).read
    const previewText = storedPreview?.slice(0, previewLength)
    const size = artifact ? artifact.size : upload.size
    const canReadWhole = !table || (typeof size === 'number' && size >= 0 && size <= TABLE_PREVIEW_LIMIT)
    const rawUrl = artifact ? artifact.raw_url : upload.raw_url
    return {
      contentType,
      textAvailable: description?.text_available,
      sourceUrl: description?.inline && previewText === undefined && canReadWhole ? rawUrl || '' : '',
      previewText,
      previewTruncated: storedPreview !== undefined && (description?.preview_truncated === true || previewLength < storedPreview.length),
      filename: artifact ? artifactLabel(artifact) : uploadLabel(upload),
    }
  }

  function openPreview(upload: Upload) {
    if (preview.value?.uuid !== upload.uuid) {
      artifactView.value = null
      deliveryError.value = ''
    }
    preview.value = upload
    maybeSelectDefaultArtifact(upload)
    // Load the extracted parts up front so their chips appear alongside the file;
    // clicking a chip swaps the viewer (no hidden tab).
    void loadArtifacts(upload)
  }

  function closePreview() {
    preview.value = null
    artifactView.value = null
    deliveryError.value = ''
  }

  function viewOriginal() {
    artifactView.value = null
  }

  function viewPrimary() {
    const primary = preview.value ? primaryArtifact(preview.value.uuid) : null
    if (primary) artifactView.value = primary
  }

  function viewArtifact(artifact: UploadArtifact) {
    if (!artifact.raw_url) return
    artifactView.value = artifact
  }

  const currentArtifacts = computed(() => preview.value
    ? artifactStateFor(preview.value.uuid).parts
    : [])
  const partsTotal = computed(() => preview.value ? artifactStateFor(preview.value.uuid).total : 0)
  const partsPage = computed(() => preview.value ? artifactStateFor(preview.value.uuid).page : 1)
  const partsPages = computed(() => Math.max(1, Math.ceil(partsTotal.value / PARTS_PER_PAGE)))
  const partsRangeStart = computed(() => partsTotal.value ? (partsPage.value - 1) * PARTS_PER_PAGE + 1 : 0)
  const partsRangeEnd = computed(() => Math.min(partsTotal.value, (partsPage.value - 1) * PARTS_PER_PAGE + currentArtifacts.value.length))
  const currentPrimary = computed(() => preview.value ? primaryArtifact(preview.value.uuid) : null)
  const hasPrimary = computed(() => !!currentPrimary.value && !isSourceArtifact(currentPrimary.value))
  const primaryKind = computed(() => currentPrimary.value?.content_description?.kind)
  const artifactsLoading = computed(() => !!(preview.value && artifactStateFor(preview.value.uuid).loading))
  const artifactsError = computed(() => preview.value ? artifactStateFor(preview.value.uuid).error : '')

  function gotoPartsPage(page: number) {
    if (!preview.value) return
    const nextPage = Math.min(Math.max(1, page), partsPages.value)
    if (nextPage === partsPage.value) return
    void loadArtifacts(preview.value, true, nextPage)
  }

  function activeRawUrl(): string {
    return (artifactView.value ? artifactView.value.raw_url : preview.value?.raw_url) || ''
  }

  function activeName(): string {
    if (artifactView.value) return artifactView.value.label || artifactView.value.artifact_id
    return preview.value ? uploadLabel(preview.value) : 'download'
  }

  // Blob URLs let downloads use the record's filename across storage origins.
  async function fetchBlobUrl(url: string, filename: string, openSource?: PreviewSource): Promise<string | null> {
    const upload = preview.value
    if (!url || !upload) return null
    deliveryError.value = ''
    try {
      const response = await api.get<Blob>(url, { responseType: 'blob' })
      const blob = response.data
      return URL.createObjectURL(openSource ? blob.slice(0, blob.size, inertOpenType(openSource, blob.type)) : blob)
    } catch (cause) {
      const message = await formatUploadRequestError(filename, cause, 'Failed to fetch file')
      if (preview.value?.uuid === upload.uuid) deliveryError.value = message
      return null
    }
  }

  async function downloadActive() {
    if (busyAction.value) return
    busyAction.value = true
    try {
      const filename = activeName()
      const url = await fetchBlobUrl(activeRawUrl(), filename)
      if (!url) return
      const anchor = document.createElement('a')
      anchor.href = url; anchor.download = filename; anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } finally { busyAction.value = false }
  }

  async function openActive() {
    if (busyAction.value || !preview.value) return
    busyAction.value = true
    try {
      const url = await fetchBlobUrl(activeRawUrl(), activeName(), activePreviewSource(preview.value))
      if (url) {
        window.open(url, '_blank', 'noopener')
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      }
    } finally { busyAction.value = false }
  }

  async function loadArtifacts(upload: Upload, force = false, toPage = 1) {
    const current = artifactStateFor(upload.uuid)
    if (current.loading || (current.loaded && !force)) return
    setArtifactState(upload.uuid, { ...current, loading: true, error: '' })
    try {
      const offset = (toPage - 1) * PARTS_PER_PAGE
      const response = await api.get(`/api/v1/uploads/${upload.uuid}/artifacts`, { params: { limit: PARTS_PER_PAGE, offset } })
      const { data } = response
      if (!data.success) throw { response }
      const raw: UploadArtifact[] = data.artifacts || []
      const primary = data.primary || raw.find((artifact) => artifact.role === 'primary' && !!artifact.raw_url) || null
      const parts = raw.filter((artifact) => !isSourceArtifact(artifact) && artifact.role !== 'primary')
      setArtifactState(upload.uuid, {
        loaded: true, loading: false, error: '',
        source: data.content_description,
        primary,
        parts,
        total: Number(data.meta?.total ?? parts.length),
        page: toPage,
      })
      if (toPage === 1) maybeSelectDefaultArtifact(upload)
    } catch (cause) {
      const error = await formatUploadRequestError(uploadLabel(upload), cause, 'Failed to load artifacts')
      setArtifactState(upload.uuid, { ...current, loaded: false, loading: false, error })
    }
  }

  return {
    preview, artifactView, artifactsByUpload, partsExpanded, busyAction,
    artifactStateFor, isSourceArtifact, activePreviewSource,
    openPreview, closePreview, viewOriginal, viewPrimary, viewArtifact,
    currentArtifacts, partsTotal, partsPage, partsPages, partsRangeStart, partsRangeEnd,
    hasPrimary, primaryKind, artifactsLoading, artifactsError, gotoPartsPage, downloadActive, openActive,
  }
}
