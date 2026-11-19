import { W as o, m as r } from "./wc-runtime-C6gaf4iX.js";
import { l as s } from "./lazy-DX8B4FNv.js";
import { s as i } from "./styles-BfuGB-97.js";
import { define as n } from "@wippy-fe/proxy";
class e extends o {
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
        () => import("./artifacts-mount-DRis2PBA.js").then((t) => t.mountConfig),
        "Could not load the artifact gallery. Reload the page to try again.",
        r
      )
    };
  }
}
async function g() {
  return e;
}
n(import.meta.url, e);
export {
  g as webComponent
};
//# sourceMappingURL=artifacts.js.map
