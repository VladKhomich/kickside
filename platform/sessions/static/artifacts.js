import { W as o, m as r } from "./wc-runtime-DRNaOAbU.js";
import { l as i } from "./lazy-DX8B4FNv.js";
import { s } from "./styles-BfuGB-97.js";
import "@iconify/vue";
import { define as n } from "@wippy-fe/proxy";
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: s
    };
  }
  static get vueConfig() {
    return {
      lazyConfig: i(
        () => import("./artifacts-mount-C6QOQqrO.js").then((t) => t.mountConfig),
        "Could not load the artifact gallery. Reload the page to try again.",
        r
      )
    };
  }
}
async function u() {
  return e;
}
n(import.meta.url, e);
export {
  u as webComponent
};
//# sourceMappingURL=artifacts.js.map
