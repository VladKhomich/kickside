import { onBeforeUnmount, ref } from 'vue'

export function useInventoryRefresh(fetchInventory: () => Promise<void>, applyUpdates: () => Promise<void>) {
  const refreshing = ref(false)
  const syncing = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let refreshPending = false
  let updatesPending = false
  let disposed = false

  function schedule() {
    if (disposed || syncing.value || timer !== undefined || (!refreshPending && !updatesPending)) return
    timer = setTimeout(() => {
      timer = undefined
      void sync()
    }, 100)
  }

  async function sync() {
    if (disposed || syncing.value) return
    clearTimeout(timer)
    timer = undefined
    syncing.value = true
    try {
      if (refreshPending) {
        refreshPending = false
        refreshing.value = true
        try {
          await fetchInventory()
        } finally {
          refreshing.value = false
        }
      }
      // Apply events queued during a snapshot to its result.
      if (updatesPending && !disposed) {
        updatesPending = false
        await applyUpdates()
      }
    } finally {
      syncing.value = false
      schedule()
    }
  }

  function refresh() {
    refreshPending = true
    return sync()
  }

  function queueUpdates() {
    updatesPending = true
    schedule()
  }

  onBeforeUnmount(() => {
    disposed = true
    clearTimeout(timer)
  })

  return { refreshing, syncing, refresh, queueUpdates }
}
