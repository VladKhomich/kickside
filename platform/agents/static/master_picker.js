import { W as t, P as i, u as o } from "./wc-runtime-C2f1ro5W.js";
import { l as a } from "./lazy-Cfv2E3SG.js";
import { s } from "./styles-C5MTfWEG.js";
import "@iconify/vue";
import { define as r } from "@wippy-fe/proxy";
const n = {
  type: "object",
  properties: {
    schema: {
      type: "object",
      description: "Capability context schema; controls the available configuration fields."
    },
    config: {
      type: "object",
      description: "Capability context: { namespaces: string[], trait_ids: string[], inject_trait_catalog: boolean }"
    }
  }
}, p = a(
  () => import("./MasterNamespacePicker-BobihwZE.js"),
  { loading: "Loading capability scope picker…", failed: "Could not load the capability scope picker. Reload the page to try again." },
  o
);
class e extends t {
  static get wippyConfig() {
    return {
      propsSchema: n,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: s
    };
  }
  static get vueConfig() {
    return { rootComponent: p, plugins: [i] };
  }
}
async function d() {
  return e;
}
r(import.meta.url, e);
export {
  d as webComponent
};
//# sourceMappingURL=master_picker.js.map
