import { W as o, m as s } from "./wc-runtime-C6gaf4iX.js";
import { l as r } from "./lazy-DX8B4FNv.js";
import { s as n } from "./styles-BfuGB-97.js";
import { define as i } from "@wippy-fe/proxy";
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: n
    };
  }
  static get vueConfig() {
    return {
      lazyConfig: r(
        () => import("./chat_empty_state-mount-Cz8BC94Q.js").then((t) => t.mountConfig),
        "Could not load the chat start screen. Reload the page to try again.",
        s
      )
    };
  }
}
async function u() {
  return e;
}
i(import.meta.url, e);
export {
  u as webComponent
};
//# sourceMappingURL=chat_empty_state.js.map
