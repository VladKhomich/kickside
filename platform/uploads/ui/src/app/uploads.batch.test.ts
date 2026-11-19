// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Uploads from './uploads.vue'

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
