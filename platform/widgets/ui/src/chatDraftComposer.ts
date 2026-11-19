// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

export interface ChatDrafts {
  read(sessionId: string): Promise<string | undefined>
  write(sessionId: string, draft: string): void
}

/**
 * Adapt the Web Host chat composer on both surfaces. Its textarea is managed
 * by Vue, so restoring its value must also update the composer's input model.
 */
export function bindChatDraftComposer(root: HTMLElement | ShadowRoot, sessionId: () => string, drafts: ChatDrafts) {
  let textarea: HTMLTextAreaElement | null = null
  let owner = ''
  let value = ''
  let revision = 0

  function save() {
    if (!textarea || !owner || owner !== sessionId() || value === textarea.value) return
    value = textarea.value
    revision++
    drafts.write(owner, value)
  }

  function sync() {
    const candidate = root.querySelector<HTMLTextAreaElement>('textarea.chat-input__textarea')
    const id = sessionId()
    if (candidate === textarea && id === owner) {
      // The composer clears the model after it takes ownership of a send.
      save()
      return
    }
    const previousOwner = owner
    textarea = candidate
    owner = id
    const current = ++revision
    if (!candidate || !id) return
    value = candidate.value
    if (previousOwner && previousOwner !== id) restore('')
    void drafts.read(id).then(draft => {
      if (current === revision && id === sessionId() && draft !== undefined) restore(draft)
    })

    function restore(draft: string) {
      if (!candidate || candidate.value === draft) return
      value = candidate.value = draft
      candidate.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    }
  }

  const input = (event: Event) => {
    if (event.target === textarea) save()
  }
  root.addEventListener('input', input)
  const observer = new MutationObserver(sync)
  observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled'] })
  sync()
  return {
    sync,
    dispose() {
      revision++
      observer.disconnect()
      root.removeEventListener('input', input)
    },
  }
}
