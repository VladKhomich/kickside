// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { api } from '@wippy-fe/proxy'
import { flushPromises } from '@vue/test-utils'
import { useUploadArtifacts } from './useUploadArtifacts'
import type { Upload, UploadArtifact } from './uploads.types'
vi.mock('@wippy-fe/proxy', () => ({ api: { get: vi.fn() } }))
const get = vi.mocked(api.get)
const original = { uuid: 'file', filename: 'report.pdf', mime_type: 'application/pdf', status: 'completed', size: 9, created_at: 0,
  content_description: { kind: 'application', mime_type: 'application/pdf', text_available: false, inline: true },
  raw_url: 'https://objects.example/file?signature=original' } as Upload
const part = { artifact_id: 'page', upload_id: 'file', kind: 'image', role: 'part', mime_type: 'image/png', label: 'page.png',
  content_description: { kind: 'image', mime_type: 'image/png', text_available: false, inline: true },
  raw_url: 'https://objects.example/page?signature=part' } as UploadArtifact

afterEach(() => { vi.restoreAllMocks(); get.mockReset() })
describe('upload delivery URLs', () => {
  it.each(['', '   '])('uses the unnamed-file label for preview and download when filename is %j', async filename => {
    const state = useUploadArtifacts(ref(''))
    const upload = { ...original, filename }
    state.preview.value = upload
    expect(state.activePreviewSource(upload).filename).toBe('Untitled file')
    get.mockResolvedValue({data: new Blob(['bytes'])} as never)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function(this: HTMLAnchorElement) {
      expect(this.download).toBe('Untitled file')
    })
    await state.downloadActive()
    expect(click).toHaveBeenCalledOnce()
  })
  it('previews the original and artifacts using their API delivery URLs', () => {
    const state = useUploadArtifacts(ref(''))
    state.preview.value = original
    expect(state.activePreviewSource(original).sourceUrl).toBe(original.raw_url)
    state.viewArtifact(part)
    expect(state.activePreviewSource(original).sourceUrl).toBe(part.raw_url)
    state.viewOriginal()
    expect(state.activePreviewSource(original).sourceUrl).toBe(original.raw_url)
    const local = { ...original, raw_url: '/api/v1/uploads/file/raw' }
    expect(state.activePreviewSource(local).sourceUrl).toBe(local.raw_url)
  })
  it.each(['HTTP error', 'unsuccessful response'])('keeps the original preview through an artifact %s and reloads on reopen', async failure => {
    const state = useUploadArtifacts(ref(''))
    const upload = { ...original, content_description: {
      kind: 'application', mime_type: 'application/pdf', inline: true, text_available: false,
    } }
    if (failure === 'HTTP error') get.mockRejectedValueOnce(new Error('Unavailable'))
    else get.mockResolvedValueOnce({ data: { success: false, error: 'Unavailable' } } as never)
    state.openPreview(upload)
    expect(state.activePreviewSource(upload)).toMatchObject({ contentType: 'application/pdf', sourceUrl: upload.raw_url })
    await flushPromises()
    expect(state.artifactStateFor(upload.uuid).error).toBe('Unavailable')
    expect(state.activePreviewSource(upload)).toMatchObject({ contentType: 'application/pdf', sourceUrl: upload.raw_url })

    state.closePreview()
    get.mockResolvedValueOnce({ data: {
      success: true, primary: { ...part, role: 'primary' }, artifacts: [], content_description: upload.content_description,
    } } as never)
    state.openPreview(upload)
    await flushPromises()
    expect(get).toHaveBeenCalledTimes(2)
    expect(state.activePreviewSource(upload)).toMatchObject({ contentType: 'application/pdf', sourceUrl: upload.raw_url })
  })
  it('refines a generic upload from the description of the original bytes', async () => {
    const state = useUploadArtifacts(ref(''))
    const upload = { ...original, filename: 'report', mime_type: 'application/octet-stream', content_description: {
      kind: 'application', mime_type: 'application/octet-stream', inline: false, text_available: false,
    } }
    const refined = { kind: 'text', mime_type: 'text/plain', inline: true, text_available: true }
    const primary = { ...part, role: 'primary', locator: { type: 'upload.original' }, content_description: refined }
    get.mockResolvedValueOnce({ data: { success: true, primary, artifacts: [], content_description: refined } } as never)
    state.openPreview(upload)
    expect(state.activePreviewSource(upload).sourceUrl).toBe('')
    await flushPromises()
    expect(state.activePreviewSource(upload)).toMatchObject({ contentType: 'text/plain', sourceUrl: upload.raw_url })
  })
  it.each(['csv', 'tsv'])('caps text/plain %s before and after artifact metadata loads', async extension => {
    const state = useUploadArtifacts(ref(''))
    const description = { kind: 'table', mime_type: 'text/plain', inline: true, text_available: true }
    const upload = { ...original, filename: `inventory.${extension}`, mime_type: 'text/plain', size: 64 * 1024 + 1,
      content_description: description }
    get.mockResolvedValueOnce({ data: { success: true, artifacts: [], content_description: description } } as never)
    state.openPreview(upload)
    expect(state.activePreviewSource(upload)).toMatchObject({ contentType: 'text/plain', sourceUrl: '' })
    await flushPromises()
    expect(state.activePreviewSource(upload)).toMatchObject({ contentType: 'text/plain', sourceUrl: '' })
    expect(state.activePreviewSource({ ...upload, size: 64 * 1024 }).sourceUrl).toBe(upload.raw_url)
  })
  it('uses the stored table preview for both views without fetching the full original', async () => {
    const state = useUploadArtifacts(ref(''))
    const upload = { ...original, filename: 'inventory.tsv', mime_type: 'application/octet-stream', size: 100 * 1024 * 1024 }
    const previewText = 'item\tquantity\nPencils\t12\n'
    const description = { kind: 'table', mime_type: 'text/tab-separated-values', text_available: true, inline: true,
      text_preview: previewText, preview_truncated: true }
    const primary = {
      ...part, kind: 'table', role: 'primary', mime_type: 'application/octet-stream',
      locator: { type: 'upload.original' },
      metadata: { text_preview: previewText, preview_truncated: true },
      content_description: description,
    }
    get.mockResolvedValue({ data: { success: true, primary, artifacts: [],
      content_description: description,
    } } as never)
    state.openPreview(upload)
    await vi.waitFor(() => expect(state.activePreviewSource(upload)).toMatchObject({
      contentType: 'text/tab-separated-values', sourceUrl: '', previewText, previewTruncated: true,
    }))
    state.viewPrimary()
    expect(state.activePreviewSource(upload)).toMatchObject({
      contentType: 'text/tab-separated-values', sourceUrl: '', previewText, previewTruncated: true,
    })
    expect(get).toHaveBeenCalledOnce()

    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:table')
    const bytes = new Blob(['original rows'], { type: 'application/octet-stream' })
    get.mockResolvedValue({ data: bytes } as never)
    vi.spyOn(window, 'open').mockReturnValue(null)
    state.viewOriginal()
    await state.openActive()
    expect(get).toHaveBeenLastCalledWith(original.raw_url, { responseType: 'blob' })
    expect(createUrl.mock.calls[0][0]).toMatchObject({ type: 'text/plain', size: bytes.size })
  })
  it('uses a derived table preview only for the derived bytes', async () => {
    const state = useUploadArtifacts(ref(''))
    const description = { kind: 'table', mime_type: 'text/csv', text_available: true, inline: true }
    const upload = { ...original, filename: 'inventory.csv', mime_type: 'text/csv', content_description: description }
    const previewText = 'Derived rows'
    const primary = {
      ...part, role: 'primary', kind: 'table', locator: { type: 'upload.original' },
      content_description: { ...description, text_preview: previewText }, metadata: { text_preview: previewText },
    }
    get.mockResolvedValueOnce({ data: { success: true, primary, artifacts: [], content_description: description } } as never)
    state.openPreview(upload)
    await flushPromises()
    expect(state.activePreviewSource(upload)).toMatchObject({ sourceUrl: upload.raw_url, previewText: undefined })
    state.viewPrimary()
    expect(state.activePreviewSource(upload)).toMatchObject({ sourceUrl: '', previewText })
  })
  it('caps a stored table preview at 64 KiB without splitting a multibyte character', async () => {
    const state = useUploadArtifacts(ref(''))
    const description = { kind: 'table', mime_type: 'text/plain', text_available: true, inline: true }
    const upload = { ...original, filename: 'inventory.tsv', mime_type: 'text/plain', content_description: description }
    const prefix = 'é'.repeat(32 * 1024 - 1)
    const source = { ...description, text_preview: prefix + '🌱' }
    const primary = { ...part, role: 'primary', locator: { type: 'upload.original' },
      metadata: { text_preview: prefix + '🌱' }, content_description: source }
    get.mockResolvedValueOnce({ data: { success: true, primary, artifacts: [], content_description: source } } as never)
    state.openPreview(upload)
    await flushPromises()
    expect(state.activePreviewSource(upload)).toMatchObject({ sourceUrl: '', previewText: prefix, previewTruncated: true })
  })
  it('leaves large tables without a stored preview available for explicit download', async () => {
    const state = useUploadArtifacts(ref(''))
    const upload = { ...original, filename: 'inventory.tsv', size: 10 * 1024 * 1024 }
    get.mockResolvedValue({ data: { success: true, artifacts: [],
      content_description: { kind: 'table', mime_type: 'text/tab-separated-values', text_available: true, inline: true },
    } } as never)
    state.openPreview(upload)
    await vi.waitFor(() => expect(state.activePreviewSource(upload)).toMatchObject({
      contentType: 'text/tab-separated-values', sourceUrl: '',
    }))
    expect(get).toHaveBeenCalledOnce()
    get.mockResolvedValue({ data: new Blob(['original rows']) } as never)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:table')
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    await state.downloadActive()
    expect(get).toHaveBeenLastCalledWith(upload.raw_url, { responseType: 'blob' })
  })
  it.each(['text/html', 'image/svg+xml', 'application/xhtml+xml', 'application/xml'])('opens %s as inert text', async mime => {
    const state = useUploadArtifacts(ref(''))
    state.preview.value = { ...original, mime_type: mime, content_description: {
      kind: 'file', mime_type: mime, text_available: mime.startsWith('text/'), inline: true,
    } }
    const raw = new Blob(['document bytes'], { type: mime })
    get.mockResolvedValue({ data: raw } as never)
    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:document')
    vi.spyOn(window, 'open').mockReturnValue(null)
    await state.openActive()
    const opened = createUrl.mock.calls[0][0] as Blob
    expect(opened.type).toBe('text/plain')
    expect(await opened.text()).toBe('document bytes')
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    await state.downloadActive()
    expect(createUrl.mock.calls[1][0]).toBe(raw)
  })
  it('downloads derived content with the artifact record label', async () => {
    const state = useUploadArtifacts(ref(''))
    state.preview.value = original
    state.viewArtifact({ ...part, kind: 'markdown', role: 'primary', mime_type: 'text/markdown', label: 'report.md' })
    get.mockResolvedValue({data: new Blob(['markdown'])} as never)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:markdown')
    let filename = ''
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function(this: HTMLAnchorElement) {
      filename = this.download
    })
    await state.downloadActive()
    expect(filename).toBe('report.md')
    expect(get).toHaveBeenLastCalledWith(part.raw_url, {responseType: 'blob'})
  })
  it('downloads and opens the API URL with the record filename', async () => {
    const state = useUploadArtifacts(ref(''))
    state.preview.value = original
    get.mockResolvedValue({data: new Blob(['bytes'])} as never)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function(this: HTMLAnchorElement) {
      expect(this.download).toBe('report.pdf')
      expect(this.href).toBe('blob:test')
    })
    await state.downloadActive()
    expect(get).toHaveBeenLastCalledWith(original.raw_url, {responseType: 'blob'})
    expect(click).toHaveBeenCalledOnce()
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    await state.openActive()
    expect(get).toHaveBeenLastCalledWith(original.raw_url, {responseType: 'blob'})
    expect(open).toHaveBeenCalledWith('blob:test', '_blank', 'noopener')
    state.viewArtifact(part)
    await state.openActive()
    expect(get).toHaveBeenLastCalledWith(part.raw_url, {responseType: 'blob'})
  })
})
