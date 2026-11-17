import { defineComponent as r, openBlock as t, createBlock as o } from "vue";
import "@iconify/vue";
import { define as a } from "@wippy-fe/proxy";
import { P as m } from "./wc-runtime-DSY_UkLU.js";
import { _ as s, T as i } from "./TaskCreate.vue_vue_type_script_setup_true_lang-CpicNOG5.js";
const p = /* @__PURE__ */ r({
  __name: "ManualTaskCreate",
  setup(n) {
    return (c, u) => (t(), o(s, { recurring: !1 }));
  }
});
class e extends i {
  static get vueConfig() {
    return { rootComponent: p, plugins: [m] };
  }
}
async function k() {
  return e;
}
a(import.meta.url, e);
export {
  k as webComponent
};
//# sourceMappingURL=manual_task_create.js.map
