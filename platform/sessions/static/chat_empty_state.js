import { W as o, m as r } from "./wc-runtime-DRNaOAbU.js";
import { l as s } from "./lazy-DX8B4FNv.js";
import { s as i } from "./styles-BfuGB-97.js";
import "@iconify/vue";
import { define as n } from "@wippy-fe/proxy";
class t extends o {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: i
    };
  }
  static get vueConfig() {
    return {
      lazyConfig: s(
        () => import("./chat_empty_state-mount-BimZKFKP.js").then((e) => e.mountConfig),
        "Could not load the chat start screen. Reload the page to try again.",
        r
      )
    };
  }
}
async function C() {
  return t;
}
n(import.meta.url, t);
export {
  C as webComponent
};
//# sourceMappingURL=chat_empty_state.js.map
