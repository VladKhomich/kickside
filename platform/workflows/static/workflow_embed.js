import { W as e, P as o, u as s } from "./wc-runtime-Tr5oXE7R.js";
import { l as n } from "./lazy-Cfv2E3SG.js";
import { p as r, w as i } from "./wc-mount-N7h56Ydz.js";
import { s as p } from "./workflow-embed-Cq35e5M9.js";
import "@iconify/vue";
import { define as l } from "@wippy-fe/proxy";
const a = [r, i, p].join(`
`), m = n(
  () => import("./EmbedWorkflow-DJzajW_c.js"),
  { loading: "Loading the Workflow panel…", failed: "Could not load the Workflow panel. Reload the page to try again." },
  s
), u = {
  type: "object",
  properties: {
    "flow-id": { type: "string" },
    input: { type: "string" },
    mode: { type: "string" },
    label: { type: "string" }
  }
};
class t extends e {
  static get wippyConfig() {
    return {
      propsSchema: u,
      hostCssKeys: ["themeConfigUrl", "markdownCssUrl", "primeVueCssUrl"],
      inlineCss: a
    };
  }
  static get vueConfig() {
    return { rootComponent: m, plugins: [o] };
  }
}
async function h() {
  return t;
}
l(import.meta.url, t);
export {
  h as webComponent
};
