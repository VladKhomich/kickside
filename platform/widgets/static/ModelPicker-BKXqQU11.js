import { defineComponent as U, ref as g, computed as u, watch as I, onMounted as M, onBeforeUnmount as L, openBlock as v, createBlock as q, unref as o, withCtx as f, createElementVNode as n, createElementBlock as y, Fragment as B, createVNode as _, createTextVNode as P, toDisplayString as C, createCommentVNode as z, normalizeClass as A } from "vue";
import { Icon as k } from "@iconify/vue";
import { s as F } from "./index-BejYQJPF.js";
import { api as S } from "@wippy-fe/proxy";
import { u as G, a as O } from "./wc-runtime-Vcu3yWjv.js";
const R = () => G(), T = () => O(), W = { class: "mp-val" }, j = { class: "mp-opt" }, H = { class: "mp-opt-body" }, J = { class: "mp-opt-title" }, K = {
  key: 0,
  class: "mp-opt-sub"
}, Q = { class: "mp-empty" }, ae = /* @__PURE__ */ U({
  __name: "ModelPicker",
  setup(X) {
    const c = R(), V = T(), p = g(!1), s = g([]), m = g([]);
    let i = 0, b = !1;
    const r = u(() => c.value?.capability || "generate"), N = u(() => c.value?.mode === "classes"), d = u(() => {
      const e = c.value?.value;
      return typeof e == "string" ? e : "";
    });
    function $(e) {
      return typeof e == "string" && e.startsWith("class:");
    }
    function w(e) {
      return e && e.charAt(0).toUpperCase() + e.slice(1);
    }
    const x = u(() => {
      const e = d.value;
      return e ? $(e) ? w(e.slice(6)) : s.value.find((l) => l.name === e)?.title || e : "Default model";
    }), D = u(() => $(d.value) ? "tabler:category" : "tabler:cpu"), E = u(() => {
      const e = [], l = new Set(s.value.map((t) => t.name)), a = r.value === "embed" ? [] : m.value.filter((t) => t.capability === r.value || t.models[0] && l.has(t.models[0].name));
      return a.length && e.push({
        group: "Classes",
        items: a.map((t) => ({
          value: `class:${t.name}`,
          title: w(t.name),
          subtitle: `${t.models.length} model${t.models.length === 1 ? "" : "s"}${t.models[0] ? ` · ${t.models[0].title}` : ""}`,
          icon: "tabler:category"
        }))
      }), s.value.length && !N.value && e.push({
        group: "Models",
        items: s.value.map((t) => ({ value: t.name, title: t.title, subtitle: t.provider || "", icon: "tabler:cpu" }))
      }), e;
    });
    async function h() {
      const e = ++i, l = r.value;
      p.value = !0;
      try {
        const [a, t] = await Promise.all([
          S.get(`/api/v1/models/list?capability=${encodeURIComponent(l)}`),
          // Embedding selection remains model-only. Classes enrich the other
          // pickers; their availability must not hide a successful model list.
          l === "embed" ? Promise.resolve(null) : S.get("/api/v1/models/classes").catch(() => null)
        ]);
        if (e !== i || l !== r.value) return;
        s.value = a?.data?.success ? a.data.models || [] : [], m.value = t?.data?.success ? t.data.classes || [] : [];
      } catch {
        e === i && l === r.value && (s.value = [], m.value = []);
      } finally {
        e === i && (p.value = !1);
      }
    }
    return I(r, () => {
      i += 1, s.value = [], m.value = [], p.value = !1, b && h();
    }), M(() => {
      b = !0, h();
    }), L(() => {
      b = !1, i += 1;
    }), (e, l) => (v(), q(o(F), {
      class: "mp-select",
      "model-value": d.value,
      options: E.value,
      "option-group-label": "group",
      "option-group-children": "items",
      "option-label": "title",
      "option-value": "value",
      "filter-fields": ["title", "subtitle", "value"],
      filter: "",
      checkmark: "",
      "filter-placeholder": N.value ? "Search classes…" : "Search models…",
      placeholder: "Default model",
      loading: p.value,
      "aria-label": o(c).label || "Choose model",
      pt: { label: { "aria-description": o(c).description || void 0 } },
      onBeforeShow: h,
      "onUpdate:modelValue": l[0] || (l[0] = (a) => o(V)("select", a ?? ""))
    }, {
      value: f(() => [
        n("span", W, [
          _(o(k), {
            icon: D.value,
            class: "mp-val-ico",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          n("span", {
            class: A(["mp-val-label", !d.value && "mp-muted"])
          }, C(x.value), 3)
        ])
      ]),
      option: f(({ option: a }) => [
        n("span", j, [
          _(o(k), {
            icon: a.icon,
            class: "mp-opt-ico",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          n("span", H, [
            n("span", J, C(a.title), 1),
            a.subtitle ? (v(), y("span", K, C(a.subtitle), 1)) : z("", !0)
          ])
        ])
      ]),
      empty: f(() => [
        n("span", Q, [
          p.value ? (v(), y(B, { key: 0 }, [
            _(o(k), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            l[1] || (l[1] = P(" Loading…", -1))
          ], 64)) : (v(), y(B, { key: 1 }, [
            P("No models…")
          ], 64))
        ])
      ]),
      emptyfilter: f(() => [...l[2] || (l[2] = [
        n("span", { class: "mp-empty" }, "No models…", -1)
      ])]),
      _: 1
    }, 8, ["model-value", "options", "filter-placeholder", "loading", "aria-label", "pt"]));
  }
});
export {
  ae as default
};
//# sourceMappingURL=ModelPicker-BKXqQU11.js.map
