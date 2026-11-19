// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import InputText from 'primevue/inputtext'
import Paginator from 'primevue/paginator'
import Select from 'primevue/select'
import Uploads from './uploads.vue'
import { formatUploadRequestError } from './uploads.format'
import type { Upload } from './uploads.types'

const { get, post, remove } = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), remove: vi.fn() }))
const props = ref({ route: '' })
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span />' } }))
vi.mock('../constants', () => ({ useComponentProps: () => props, useComponentEvents: () => vi.fn() }))
vi.mock('@wippy-fe/proxy', () => ({
  api: { get, post, delete: remove },
  host: { confirm: async () => true },
  loadByTagName: () => Promise.resolve(),
}))
vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { onMounted } = await import('vue')
  return { useHostVisibilityRefresh: (refresh: () => void) => onMounted(refresh) }
})
vi.mock('@kickside/ui-kit/componentRealtime', () => ({ subscribeComponentMeta: vi.fn() }))

beforeEach(() => {
  props.value = { route: '' }
  vi.resetAllMocks()
})

const dropFiles = (wrapper: ReturnType<typeof shallowMount>, names: string[]) => wrapper.get('.kx-drop').trigger('drop', {
  dataTransfer: { files: names.map(name => new File(['sample'], name)) },
})

it('identifies every rejected file after refreshing the list and clears failures on the next batch', async () => {
  get.mockResolvedValue({ data: { success: true, uploads: [] } })
  post.mockRejectedValueOnce(Object.assign(new Error('Request failed with status code 400'), {
    response: { status: 400, data: { success: false, error: 'Empty file' } },
  }))
    .mockRejectedValueOnce(Object.assign(new Error('Request failed with status code 409'), {
      response: { status: 409, data: { success: false, error: 'Failed to upload file', details: 'upload already exists' } },
    }))
    .mockRejectedValueOnce(Object.assign(new Error('Request failed with status code 502'), {
      response: { status: 502, data: '' },
    }))
    .mockRejectedValueOnce(new Error('Network Error'))
    .mockRejectedValueOnce(Object.assign(new Error('Request failed with status code 500'), {
      response: { status: 500, data: { success: false } },
    }))
    .mockResolvedValueOnce({ data: { success: false, error: 'Invalid file' } })
    .mockResolvedValue({ data: { success: true } })
  const wrapper = shallowMount(Uploads)
  try {
    await flushPromises()
    const filenames = ['empty.txt', 'conflict.txt', 'bodyless.txt', 'offline.txt', 'missing-reason.txt', 'invalid.txt', 'accepted.txt']
    await dropFiles(wrapper, filenames)
    await flushPromises()

    expect(post.mock.calls.map(([, form]) => form.get('file').name)).toEqual(filenames)
    expect(get).toHaveBeenCalledTimes(2)
    const errors = wrapper.get('[role="alert"]').findAll('li').map(row => row.text())
    expect(errors).toEqual([
      'empty.txt · Empty file',
      'conflict.txt · Failed to upload file',
      'bodyless.txt · HTTP 502',
      'offline.txt · Network Error',
      'missing-reason.txt · HTTP 500',
      'invalid.txt · Invalid file',
    ])

    await dropFiles(wrapper, ['another.txt'])
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  } finally {
    wrapper.unmount()
  }
})

const file = {
  uuid: 'a5544a30-d59a-4d70-8edc-023a5f4adeb8', filename: 'report.txt', size: 5,
  mime_type: 'text/plain', status: 'error', created_at: 0,
}

describe.each([
  { kind: 'JSON', status: 409, statusText: 'Conflict', data: { error: 'File is locked', details: 'internal detail' }, reason: 'File is locked' },
  { kind: 'plain text', status: 500, statusText: 'Internal Server Error', data: 'no response sent\n', reason: 'no response sent' },
  { kind: 'empty body', status: 502, statusText: 'Bad Gateway', data: '', reason: 'Bad Gateway' },
])('$kind response', ({ status, statusText, data, reason }) => {
  const failure = Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status, statusText, data },
  })
  const expected = `${file.filename} · ${reason}`

  beforeEach(() => {
    get.mockImplementation(async (url: string) => {
      if (url.endsWith('/list')) return { data: { success: true, uploads: [file] } }
      if (url.endsWith('/artifacts')) return { data: { success: true, artifacts: [] } }
      throw failure
    })
    post.mockRejectedValue(failure)
    remove.mockRejectedValue(failure)
  })

  it.each(['upload', 'batch', 'retry', 'delete', 'preview load'])('shows the reason at the %s action', async action => {
    const wrapper = shallowMount(Uploads, { global: { stubs: {
      UploadPreviewDrawer: false,
      Drawer: { props: ['visible'], template: '<section v-if="visible"><slot /></section>' },
    } } })
    try {
      await flushPromises()
      let alert = '[role="alert"]'
      if (action === 'upload' || action === 'batch') {
        await dropFiles(wrapper, action === 'upload' ? [file.filename] : ['first.txt', file.filename])
      } else if (action === 'retry') {
        await wrapper.get('[data-testid="uploads-row-preview"]').trigger('click')
        await wrapper.get('[data-testid="uploads-preview-retry"]').trigger('click')
        await flushPromises()
        props.value = { route: file.uuid }
        alert = '.kx-side [role="alert"]'
      } else if (action === 'delete') {
        await wrapper.get('[data-testid="uploads-row-delete"]').trigger('click')
        alert = '.kx-row [role="alert"]'
      } else {
        props.value = { route: file.uuid }
      }
      await flushPromises()

      expect(wrapper.findAll(alert).map(element => element.text()).join('\n')).toContain(expected)
    } finally {
      wrapper.unmount()
    }
  })
})

const report = { ...file, status: 'completed', raw_url: '/api/v1/uploads/report/raw' }
const list = (uploads: Upload[] = [report], total = uploads.length) => ({ data: { success: true, uploads, meta: { total } } })
const noArtifacts = { data: { success: true, artifacts: [] } }
const drawerStubs = {
  UploadPreviewDrawer: false,
  Drawer: { props: ['visible'], template: '<section v-if="visible"><slot /></section>' },
}

const requestFailure = (data: unknown) => Object.assign(new Error('Request failed with status code 503'), {
  response: { status: 503, statusText: 'Service Unavailable', data },
})

it.each(['rejected', 'resolved'])('shows a %s artifact failure and fetches parts when the drawer reopens', async outcome => {
  const reason = 'Extracted parts are unavailable'
  get.mockResolvedValueOnce(list())
  if (outcome === 'rejected') get.mockRejectedValueOnce(requestFailure({ error: reason }))
  else get.mockResolvedValueOnce({ data: { success: false, error: reason } })
  get.mockResolvedValueOnce({ data: { success: true, artifacts: [
    { artifact_id: 'page-one', kind: 'image', role: 'extracted-image', label: 'Page one', raw_url: '/page-one' },
  ] } })
  const wrapper = shallowMount(Uploads, { global: { stubs: drawerStubs } })
  try {
    await flushPromises()
    await wrapper.get('[data-testid="uploads-row-preview"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('.kx-side [role="alert"]').text()).toBe(`report.txt · ${reason}`)
    await wrapper.get('[data-testid="uploads-preview-close"]').trigger('click')
    await wrapper.get('[data-testid="uploads-row-preview"]').trigger('click')
    await flushPromises()
    expect(get.mock.calls.filter(([url]) => url.endsWith('/artifacts'))).toHaveLength(2)
    expect(wrapper.find('.kx-side [role="alert"]').exists()).toBe(false)
    await wrapper.get('[data-testid="uploads-parts-toggle"]').trigger('click')
    expect(wrapper.get('[data-artifact-id="page-one"]').attributes('label')).toBe('Page one')
  } finally {
    wrapper.unmount()
  }
})

it.each([
  { action: 'download', type: 'application/json', body: '{"error":{"message":"Stored file is missing"}}', reason: 'Stored file is missing' },
  { action: 'open', type: 'text/plain', body: 'Storage connection is unavailable\n', reason: 'Storage connection is unavailable' },
  { action: 'open', type: 'application/json', body: '', reason: 'Service Unavailable' },
  { action: 'download', type: 'application/json', body: '{"error":"Stored part is missing"}', reason: 'Stored part is missing', part: true },
])('shows the file and server reason in the drawer when $action receives a $type blob', async ({ action, type, body, reason, part }) => {
  const artifact = { artifact_id: 'page-one', kind: 'image', role: 'extracted-image', label: 'page-one.png', raw_url: '/page-one' }
  get.mockResolvedValueOnce(list())
    .mockResolvedValueOnce(part ? { data: { success: true, artifacts: [artifact] } } : noArtifacts)
    .mockRejectedValueOnce(requestFailure(new Blob([body], { type })))
  const wrapper = shallowMount(Uploads, { global: { stubs: drawerStubs } })
  try {
    await flushPromises()
    await wrapper.get('[data-testid="uploads-row-preview"]').trigger('click')
    await flushPromises()
    if (part) {
      await wrapper.get('[data-testid="uploads-parts-toggle"]').trigger('click')
      await wrapper.get('[data-artifact-id="page-one"]').trigger('click')
    }
    await wrapper.get(`[data-testid="uploads-preview-${action}"]`).trigger('click')
    await flushPromises()
    expect(get).toHaveBeenLastCalledWith(part ? artifact.raw_url : report.raw_url, { responseType: 'blob' })
    expect(wrapper.get('.kx-side [role="alert"]').text()).toBe(`${part ? artifact.label : report.filename} · ${reason}`)
  } finally {
    wrapper.unmount()
  }
})

it('limits the amount read and displayed from a large plain-text response', async () => {
  const blob = new Blob(['Storage unavailable. '.repeat(5000)], { type: 'text/plain' })
  const read = vi.spyOn(blob, 'text')
  const slice = vi.spyOn(blob, 'slice')
  const message = await formatUploadRequestError('report.txt', requestFailure(blob), 'Fetch failed')
  expect(read).not.toHaveBeenCalled()
  expect(slice).toHaveBeenCalledWith(0, 4096)
  expect(message).toMatch(/^report\.txt · Storage unavailable\./)
  expect(message).toMatch(/…$/)
  expect(message.length).toBeLessThanOrEqual('report.txt · '.length + 320)
})

it.each([
  new Blob(['{"error":"' + 'x'.repeat(5000) + '"}'], { type: 'application/problem+json' }),
  new Blob(['<!doctype html><html>Internal server response</html>'], { type: 'text/html' }),
  new Blob([new Uint8Array(8192)], { type: 'application/octet-stream' }),
])('uses HTTP status without reading a structured, HTML, or binary body outside the diagnostic limit', async blob => {
  const slice = vi.spyOn(blob, 'slice')
  const read = vi.spyOn(blob, 'text')
  await expect(formatUploadRequestError('report.txt', requestFailure(blob), 'Fetch failed'))
    .resolves.toBe('report.txt · Service Unavailable')
  expect(slice).not.toHaveBeenCalled()
  expect(read).not.toHaveBeenCalled()
})

it('shows a late retry failure after the drawer closes', async () => {
  get.mockResolvedValueOnce(list([file])).mockResolvedValueOnce(noArtifacts)
  let reject!: (reason: unknown) => void
  post.mockReturnValueOnce(new Promise((_, fail) => { reject = fail }))
  const wrapper = shallowMount(Uploads, { global: { stubs: drawerStubs } })
  try {
    await flushPromises()
    await wrapper.get('[data-testid="uploads-row-preview"]').trigger('click')
    await wrapper.get('[data-testid="uploads-preview-retry"]').trigger('click')
    await wrapper.get('[data-testid="uploads-preview-close"]').trigger('click')
    reject(requestFailure({ error: 'Processing is unavailable' }))
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toBe('report.txt · Processing is unavailable')
  } finally {
    wrapper.unmount()
  }
})

it('shows a late delete failure on another filtered page and keeps it through a list refresh', async () => {
  get.mockResolvedValueOnce(list()).mockResolvedValue(list([]))
  let resolve!: (response: unknown) => void
  remove.mockReturnValueOnce(new Promise(done => { resolve = done }))
  const wrapper = shallowMount(Uploads)
  try {
    await flushPromises()
    await wrapper.get('[data-testid="uploads-row-delete"]').trigger('click')
    wrapper.getComponent(Select).vm.$emit('update:modelValue', 'error')
    await flushPromises()
    expect(wrapper.find('.kx-row').exists()).toBe(false)
    resolve({ data: { success: false, error: 'File has a dependent record' } })
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toBe('report.txt · File has a dependent record')
    wrapper.getComponent(Select).vm.$emit('update:modelValue', 'processing')
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toBe('report.txt · File has a dependent record')
  } finally {
    wrapper.unmount()
  }
})

describe.each(['rejected', 'resolved'])('%s list failures', outcome => {
  it.each([
    ['search', { q: 'quarterly', limit: 30, offset: 0 }],
    ['filter', { status: 'error', limit: 30, offset: 0 }],
    ['pagination', { limit: 30, offset: 30 }],
  ])('shows the server reason after %s and suppresses the empty state', async (action, params) => {
    const reason = 'Upload index is unavailable'
    get.mockResolvedValueOnce(list([report], 31))
    if (outcome === 'rejected') get.mockRejectedValueOnce(requestFailure({ error: reason }))
    else get.mockResolvedValueOnce({ data: { success: false, error: reason } })
    const wrapper = shallowMount(Uploads, { global: { stubs: { InputGroup: { template: '<div><slot /></div>' } } } })
    try {
      await flushPromises()
      if (action === 'search') {
        wrapper.getComponent(InputText).vm.$emit('update:modelValue', 'quarterly')
      } else if (action === 'filter') {
        wrapper.getComponent(Select).vm.$emit('update:modelValue', 'error')
      } else {
        wrapper.getComponent(Paginator).vm.$emit('page', { page: 1 })
      }
      await vi.waitFor(() => expect(get).toHaveBeenLastCalledWith('/api/v1/uploads/list', { params }))
      await flushPromises()
      expect(wrapper.get('[role="alert"]').text()).toBe(`Uploads · ${reason}`)
      expect(wrapper.find('.kx-empty').exists()).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })
})
