import { createAppRouter as createWippyRouter } from '@wippy-fe/router'
import type { CreateAppRouterOptions } from '@wippy-fe/router'
import { host as defaultHost } from '@wippy-fe/proxy'
import { isNavigationFailure, NavigationFailureType } from 'vue-router'
import type { RouteRecordRaw, Router } from 'vue-router'
import SurfaceHost from '../app/SurfaceHost.vue'

// Every navigable path renders through SurfaceHost, which resolves the active
// path to its owning nav_item and renders by the item's declared kind (a bundle
// surface or a module web component). Module-owned surfaces need no route here —
// they fall through the catch-all to SurfaceHost — so adding or removing one is a
// registry change, not a page-list edit. The named routes below are the app-owned
// surfaces (System keeps :tab for deep-linkable tabs).
export { normalizePath, resolveInitialPath } from './path'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: SurfaceHost },
  { path: '/sessions', name: 'sessions', component: SurfaceHost },
  { path: '/sessions/:sessionId', name: 'session', component: SurfaceHost },
  { path: '/system/:tab?/:sectionPath*', name: 'system', component: SurfaceHost },
  { path: '/connections', name: 'connections', component: SurfaceHost },
  { path: '/inbox', name: 'inbox', component: SurfaceHost },
  { path: '/:pathMatch(.*)*', name: 'surface', component: SurfaceHost },
]

export function createAppRouter(
  initialPath: string,
  options: Omit<CreateAppRouterOptions, 'initialPath'> = {},
): Router {
  const host = options.host ?? defaultHost
  const router = createWippyRouter(routes, {
    ...options,
    initialPath,
    host: {
      ...host,
      onRouteChanged(path, navId) {
        if (path === router.currentRoute.value.fullPath) host.onRouteChanged(path, navId)
      },
    },
  })
  router.afterEach((_to, from, failure) => {
    // On browser Back the Web Host has already moved its address bar before the
    // child guard runs. Navigate the host back to the committed route on cancel.
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) host.navigate(from.fullPath)
  })
  return router
}
