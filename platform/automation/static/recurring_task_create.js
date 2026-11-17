import { defineComponent as t, openBlock as n, createBlock as o } from "vue";
import "@iconify/vue";
import { define as m } from "@wippy-fe/proxy";
import { P as i } from "./wc-runtime-DSY_UkLU.js";
import { _ as a, T as s } from "./TaskCreate.vue_vue_type_script_setup_true_lang-CpicNOG5.js";
const c = /* @__PURE__ */ t({
  __name: "RecurringTaskCreate",
  setup(r) {
    return (p, u) => (n(), o(a, { recurring: !0 }));
  }
});
class e extends s {
  static get vueConfig() {
    return { rootComponent: c, plugins: [i] };
  }
}
async function k() {
  return e;
}
m(import.meta.url, e);
export {
  k as webComponent
};
//# sourceMappingURL=recurring_task_create.js.map
