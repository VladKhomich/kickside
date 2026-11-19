import { W as o, m as i } from "./wc-runtime-RWZ7nf8c.js";
import { s as n } from "./styles-BHCP8M7N.js";
import { define as r } from "@wippy-fe/proxy";
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: n
    };
  }
  static get vueConfig() {
    return i(
      () => import("./chat_empty_state-mount-B-LCYZD0.js").then((t) => t.mountConfig),
      {
        surface: "page",
        loading: "Loading…",
        failed: "Could not load the chat start screen. Reload the page to try again.",
        timeout: 3e4
      }
    );
  }
}
async function l() {
  return e;
}
r(import.meta.url, e);
export {
  l as webComponent
};
//# sourceMappingURL=chat_empty_state.js.map
