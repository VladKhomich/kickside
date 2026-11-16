import { defineComponent as C, ref as c, onMounted as W, onBeforeUnmount as B, openBlock as r, createElementBlock as l, createElementVNode as o, createVNode as v, unref as u, createBlock as N, withCtx as x, createTextVNode as I, toDisplayString as L, createCommentVNode as T, nextTick as w } from "vue";
import { Icon as V } from "@iconify/vue";
import { loadByTagName as S } from "@wippy-fe/proxy";
import { a as A, u as H } from "./wc-runtime-Tr5oXE7R.js";
import { s as M } from "./index-CSqVKKCx.js";
import { s as j } from "./index-3cGXfEXf.js";
const q = { class: "cw-root" }, D = { class: "cw-head" }, O = { class: "cw-head-icon" }, P = {
  key: 1,
  class: "cw-state"
}, U = {
  key: 2,
  class: "cw-section",
  "aria-label": "Event Workflows"
}, R = /* @__PURE__ */ C({
  __name: "ComponentWorkflows",
  setup($) {
    const d = A(), k = H(), m = c(null), a = c(!0), s = c("");
    let i = null;
    function f() {
      return String(d.value?.componentInstanceId || d.value?.["component-instance-id"] || "").trim();
    }
    function p(t) {
      const e = t.detail;
      e?.route && k("navigate", { route: e.route });
    }
    async function y(t, e, g) {
      if (!t) return null;
      await S(e, { timeoutMs: 8e3 });
      const n = document.createElement(e);
      for (const [b, E] of Object.entries(g)) n.setAttribute(b, E);
      return n.addEventListener("navigate", p), n.style.display = "block", t.replaceChildren(n), n;
    }
    async function _() {
      if (!f()) {
        s.value = "Component is required.", a.value = !1;
        return;
      }
      a.value = !1, await w(), await h();
    }
    async function h() {
      const t = f();
      if (!(!t || a.value))
        try {
          await w(), i || (i = await y(m.value, "kickside-automation-manager", {
            "component-id": t,
            mode: "component"
          }));
        } catch {
          s.value = "Workflow controls could not load. Try refreshing this page.";
        }
    }
    return W(_), B(() => {
      i?.removeEventListener("navigate", p);
    }), (t, e) => (r(), l("div", q, [
      o("header", D, [
        o("span", O, [
          v(u(V), {
            icon: "tabler:route",
            "aria-hidden": "true"
          })
        ]),
        e[0] || (e[0] = o("span", { class: "cw-head-copy" }, [
          o("h1", null, "Workflows"),
          o("p", null, "Connect component events to typed Blocks or published Workflows.")
        ], -1))
      ]),
      s.value ? (r(), N(u(M), {
        key: 0,
        class: "cw-feedback",
        severity: "error",
        closable: !1
      }, {
        default: x(() => [
          I(L(s.value), 1)
        ]),
        _: 1
      })) : T("", !0),
      a.value ? (r(), l("div", P, [
        v(u(j), {
          class: "cw-spinner",
          "stroke-width": "4",
          "aria-label": "Loading Workflows"
        }),
        e[1] || (e[1] = o("span", null, "Loading Workflows…", -1))
      ])) : (r(), l("section", U, [
        o("div", {
          ref_key: "automationsHost",
          ref: m,
          class: "cw-host"
        }, null, 512)
      ]))
    ]));
  }
});
export {
  R as default
};
