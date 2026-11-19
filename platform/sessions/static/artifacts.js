import { W as o, m as i } from "./wc-runtime-RWZ7nf8c.js";
import { s as r } from "./styles-BHCP8M7N.js";
import { define as n } from "@wippy-fe/proxy";
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: r
    };
  }
  static get vueConfig() {
    return {
      ...i(() => import("./artifacts-mount-zPDGwj6n.js").then((t) => t.mountConfig), { surface: "page", loading: "Loading…", failed: "Could not load the artifact gallery. Reload the page to try again.", timeout: 3e4 })
    };
  }
}
async function l() {
  return e;
}
n(import.meta.url, e);
export {
  l as webComponent
};
//# sourceMappingURL=artifacts.js.map
