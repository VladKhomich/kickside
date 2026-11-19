// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onBeforeUnmount, onMounted } from 'vue'
import { getLayoutManager, on } from '@wippy-fe/proxy'
import type { host as proxyHost } from '@wippy-fe/proxy'
import { layoutSnapshot, mainAppRoute, parseRoute } from './hostRoute'
import type { HostRoute } from './hostRoute'

/** Follow the app route reported by the layout, or the outer host's history. */
export function useHostRoute(host: typeof proxyHost | null | undefined, changed: (route: HostRoute) => void) {
  const manager = host ? getLayoutManager(host) : null
  const stops: Array<() => void> = []
  const address = () => window.location.pathname + window.location.search + window.location.hash
  let hostPath = address()
  const currentRoute = () => mainAppRoute(layoutSnapshot(host)) ?? hostPath
  let lastRoute = currentRoute()

  function followRoute(route = currentRoute()) {
    if (route === lastRoute) return
    lastRoute = route
    changed(parseRoute(route))
  }

  function followHistory() {
    hostPath = address()
    // A popstate reaches the Host before the app panel has reported its route.
    followRoute(hostPath)
  }

  onMounted(() => {
    stops.push(on('@history', ({ path }) => {
      hostPath = path === window.location.pathname ? address() : path
      followRoute()
    }))
    if (manager) stops.push(manager.on('change', () => followRoute()))
    window.addEventListener('popstate', followHistory)
  })
  onBeforeUnmount(() => {
    stops.forEach(stop => stop())
    window.removeEventListener('popstate', followHistory)
  })
  return { initialPath: parseRoute(lastRoute).path, hostPath: () => hostPath }
}
