import { W as t, P as o, u as r } from "./wc-runtime-C2f1ro5W.js";
import { l as i } from "./lazy-Cfv2E3SG.js";
import { s as n } from "./styles-C5MTfWEG.js";
import "@iconify/vue";
import { define as s } from "@wippy-fe/proxy";
const a = {
  type: "object",
  properties: {
    selected: { type: "array", items: { type: "string" }, default: [] },
    multi: { type: "boolean", default: !0 },
    placeholder: { type: "string" },
    config: { type: "string", default: "" },
    schema: { type: "string", default: "" }
  }
}, p = i(
  () => import("./AgentPicker-i4Ig0DWg.js"),
  { loading: "Loading agent picker…", failed: "Could not load the agent picker. Reload the page to try again.", iconOnly: !0 },
  r
);
class e extends t {
  static get wippyConfig() {
    return {
      propsSchema: a,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: n
    };
  }
  static get vueConfig() {
    return { rootComponent: p, plugins: [o] };
  }
}
async function d() {
  return e;
}
s(import.meta.url, e);
export {
  d as webComponent
};
//# sourceMappingURL=agent_picker.js.map
