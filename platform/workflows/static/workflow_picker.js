import { W as t, P as o, u as r } from "./wc-runtime-Tr5oXE7R.js";
import { l as s } from "./lazy-Cfv2E3SG.js";
import { p as n, w as i } from "./wc-mount-N7h56Ydz.js";
import { s as p } from "./workflow-embed-Cq35e5M9.js";
import "@iconify/vue";
import { define as a } from "@wippy-fe/proxy";
const m = s(
  () => import("./WorkflowPicker-DZKCKv2U.js"),
  { loading: "Loading the Workflow picker…", failed: "Could not load the Workflow picker. Reload the page to try again." },
  r
), l = {
  type: "object",
  properties: {
    config: { type: "string", default: "{}" },
    schema: { type: "string", default: "" },
    "source-context": { type: "string" },
    "source-schema": { type: "string" },
    "return-route": { type: "string" }
  }
};
class e extends t {
  static get wippyConfig() {
    return {
      propsSchema: l,
      hostCssKeys: ["themeConfigUrl", "markdownCssUrl", "primeVueCssUrl"],
      inlineCss: [n, i, p].join(`
`)
    };
  }
  static get vueConfig() {
    return { rootComponent: m, plugins: [o] };
  }
}
async function h() {
  return e;
}
a(import.meta.url, e);
export {
  h as webComponent
};
