import { W as e, P as o, u as n } from "./wc-runtime-C2f1ro5W.js";
import { l as i } from "./lazy-Cfv2E3SG.js";
import { s as r } from "./styles-C5MTfWEG.js";
import "@iconify/vue";
import { define as s } from "@wippy-fe/proxy";
const p = {
  type: "object",
  properties: {
    route: { type: "string" },
    "parent-id": { type: "string" },
    "component-id": { type: "string" },
    "entry-id": { type: "string" },
    mode: { type: "string" }
  }
}, a = i(
  () => import("./AgentEdit-DZwRc21J.js"),
  { loading: "Loading agent editor…", failed: "Could not load the agent editor. Reload the page to try again." },
  n
);
class t extends e {
  static get wippyConfig() {
    return {
      propsSchema: p,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: r
    };
  }
  static get vueConfig() {
    return { rootComponent: a, plugins: [o] };
  }
}
async function c() {
  return t;
}
s(import.meta.url, t);
export {
  c as webComponent
};
//# sourceMappingURL=agent_edit.js.map
