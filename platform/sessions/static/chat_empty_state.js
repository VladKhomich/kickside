import { W as s, m as o } from "./wc-runtime-enaNScz7.js";
import { l as r } from "./lazy-DX8B4FNv.js";
import { s as i } from "./styles-urvsV3uf.js";
import { define as n } from "@wippy-fe/proxy";
class e extends s {
  static get wippyConfig() {
    return {
      propsSchema: {
        type: "object",
        properties: {
          surface: {
            type: "string",
            enum: ["sessions", "sidebar"],
            default: "sidebar",
            description: "Selects the empty-chat profile for the Sessions page or the host sidebar."
          }
        }
      },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: i
    };
  }
  static get vueConfig() {
    return {
      lazyConfig: r(
        () => import("./chat_empty_state-mount-QqBf09S8.js").then((t) => t.mountConfig),
        "Could not load the chat start screen. Reload the page to try again.",
        o
      )
    };
  }
}
async function c() {
  return e;
}
n(import.meta.url, e);
export {
  c as webComponent
};
//# sourceMappingURL=chat_empty_state.js.map
