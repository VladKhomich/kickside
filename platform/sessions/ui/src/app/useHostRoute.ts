// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onBeforeUnmount, onMounted } from 'vue'
import { getLayoutManager, on } from '@wippy-fe/proxy'
import type { host as proxyHost } from '@wippy-fe/proxy'
import { layoutSnapshot, mainAppRoute, parseRoute } from './hostRoute'

/** Follow the app route reported by the layout, or the outer host's history. */
export function useHostRoute(host: typeof proxyHost | null | undefined, changed: (path: string) => void) {
  const manager = host ? getLayoutManager(host) : null
  const stops: Array<() => void> = []
  let hostPath = window.location.pathname
  const currentPath = () => parseRoute(mainAppRoute(layoutSnapshot(host)) ?? hostPath).path
  let lastPath = currentPath()
  const initialPath = lastPath

  function followRoute() {
    const path = currentPath()
    if (path === lastPath) return
    lastPath = path
    changed(path)
  }

  onMounted(() => {
    stops.push(on('@history', ({ path }) => {
      hostPath = path
      followRoute()
    }))
    if (manager) stops.push(manager.on('change', followRoute))
  })
  onBeforeUnmount(() => stops.forEach(stop => stop()))
  return { initialPath, hostPath: () => hostPath }
}
