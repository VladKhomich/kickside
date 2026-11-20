// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { WippyVueElement, define, useEvents } from '@wippy-fe/webcomponent-vue'
import type { WippyElementConfig, WippyPropsSchema } from '@wippy-fe/webcomponent-vue'
import { lazyPage } from '@widgets/lazy'
import type { Events } from './constants.ts'
import stylesText from './styles.css?inline'
import type { ChatSurface } from '@widgets/chatAppearance'

interface ChatEmptyStateProps { surface?: ChatSurface }

class KicksideChatEmptyStateElement extends WippyVueElement<ChatEmptyStateProps, Events> {
  static get wippyConfig(): WippyElementConfig<ChatEmptyStateProps> {
    return {
      propsSchema: {
        type: 'object',
        properties: {
          surface: {
            type: 'string',
            enum: ['sessions', 'sidebar'],
            default: 'sidebar',
            description: 'Selects the empty-chat profile for the Sessions page or the host sidebar.',
          },
        },
      } as WippyPropsSchema,
      hostCssKeys: ['themeConfigUrl', 'primeVueCssUrl'] as const,
      inlineCss: stylesText,
    }
  }

  static get vueConfig() {
    return {
      lazyConfig: lazyPage(
        () => import('./chat_empty_state-mount').then((module) => module.mountConfig),
        'Could not load the chat start screen. Reload the page to try again.',
        useEvents,
      ),
    }
  }
}

export async function webComponent() {
  return KicksideChatEmptyStateElement
}

define(import.meta.url, KicksideChatEmptyStateElement)
