import { defineComponent as H, computed as v, ref as g, onMounted as K, openBlock as n, createElementBlock as l, createElementVNode as y, createCommentVNode as u, createVNode as _, unref as c, withCtx as M, createBlock as w, toDisplayString as p, createTextVNode as D, Fragment as C, renderList as F } from "vue";
import { Icon as N } from "@iconify/vue";
import { b as U, _ as Q, s as W, a as X } from "./WcMount.vue_vue_type_script_setup_true_lang-I7TtWkSp.js";
import { b as Z } from "./wc-runtime-56DLhE4T.js";
import { api as V } from "@wippy-fe/proxy";
const ee = { class: "ap" }, te = { class: "ap-body" }, ae = { class: "ap-bar" }, ne = {
  key: 0,
  class: "ap-dirty"
}, le = {
  key: 0,
  class: "ap-msg ap-err"
}, oe = {
  key: 1,
  class: "ap-loading"
}, se = {
  key: 2,
  class: "ap-cards"
}, re = { class: "ap-card" }, ie = { class: "ap-h" }, ue = {
  key: 0,
  class: "ap-sub"
}, ce = {
  key: 1,
  class: "ks-empty"
}, pe = {
  key: 0,
  class: "pv-group-title"
}, de = { class: "pv-field-head" }, ve = { class: "ap-blabel" }, ye = {
  key: 0,
  class: "ks-tag kx-tag-caps ks-tag-on"
}, me = {
  key: 1,
  class: "ks-tag kx-tag-caps ks-tag-on"
}, _e = { key: 0 }, he = {
  key: 2,
  class: "ap-hint"
}, ge = {
  key: 1,
  class: "ap-toggle-row pv-toggle"
}, fe = { class: "ap-toggle-text" }, ke = {
  key: 0,
  class: "ap-toggle-desc"
}, be = ["min", "max", "value", "onInput"], xe = ["placeholder", "value", "onInput"], Se = ["value", "onInput"], we = ["minlength", "maxlength", "value", "onInput"], Ce = {
  key: 5,
  class: "ap-hint"
}, R = "General", Oe = /* @__PURE__ */ H({
  __name: "provider",
  setup(Ne) {
    const G = Z(), f = v(() => G.value?.config || null), A = v(() => f.value?.namespace || ""), J = v(() => f.value?.title || "Provider"), T = v(() => f.value?.icon || "tabler:plug-connected"), O = v(() => f.value?.help || ""), k = g(!0), i = g(!1), d = g(""), m = g([]), s = g({});
    function P(t) {
      const a = t.split(/[._\-\s]+/).filter(Boolean);
      return a.length ? a.map((r, e) => e === 0 ? r.charAt(0).toUpperCase() + r.slice(1) : r).join(" ") : t;
    }
    const h = (t) => t.title && t.title.length ? t.title : P(t.key), $ = (t) => Array.isArray(t.schema?.enum) ? t.schema.enum : null, E = v(() => {
      const t = /* @__PURE__ */ new Map();
      for (const e of m.value) {
        const o = e.category && e.category.length ? e.category : R;
        t.has(o) || t.set(o, []), t.get(o).push(e);
      }
      const a = (e) => typeof e.order == "number" ? e.order : 100, r = [];
      for (const [e, o] of t)
        o.sort((x, S) => a(x) - a(S) || h(x).localeCompare(h(S))), r.push({ name: e, items: o });
      return r.sort((e, o) => {
        const x = Math.min(...e.items.map(a)), S = Math.min(...o.items.map(a));
        return x - S || e.name.localeCompare(o.name);
      }), r;
    }), z = v(() => E.value.length === 1 && E.value[0].name === R);
    function j(t, a) {
      s.value[t.key] = t.value_type === "json" ? JSON.stringify(a, null, 2) : a;
    }
    function B(t) {
      const a = s.value[t.key];
      return t.value_type === "secret" ? String(a ?? "").length > 0 : t.value_type === "json" ? a !== JSON.stringify(t.value, null, 2) : a !== t.value;
    }
    const I = v(() => m.value.some(B));
    function L(t, a) {
      switch (t.value_type) {
        case "int":
          return Math.trunc(Number(a));
        case "bool":
          return !!a;
        case "json":
          return JSON.parse(String(a));
        default:
          return String(a);
      }
    }
    async function b() {
      if (!A.value) {
        k.value = !1;
        return;
      }
      k.value = !0, d.value = "";
      try {
        const { data: t } = await V.get(`/api/v1/settings?namespace=${encodeURIComponent(A.value)}`);
        if (!t?.success) throw new Error(t?.error || "failed to load settings");
        m.value = Array.isArray(t.settings) ? t.settings : [], s.value = {};
        for (const a of m.value) j(a, a.value_type === "secret" ? "" : a.value);
      } catch (t) {
        d.value = t instanceof Error ? t.message : String(t);
      } finally {
        k.value = !1;
      }
    }
    async function Y() {
      i.value = !0, d.value = "";
      try {
        for (const t of m.value) {
          if (!B(t)) continue;
          const a = L(t, s.value[t.key]), { data: r } = await V.put("/api/v1/settings", { namespace: t.namespace, key: t.key, value: a });
          if (!r?.success) throw new Error(r?.error || `could not save ${h(t)}`);
        }
        await b();
      } catch (t) {
        d.value = t instanceof Error ? t.message : String(t);
      } finally {
        i.value = !1;
      }
    }
    async function q(t) {
      i.value = !0, d.value = "";
      try {
        const { data: a } = await V.put("/api/v1/settings", { namespace: t.namespace, key: t.key, value: null });
        if (!a?.success) throw new Error(a?.error || "reset failed");
        await b();
      } catch (a) {
        d.value = a instanceof Error ? a.message : String(a);
      } finally {
        i.value = !1;
      }
    }
    return K(b), (t, a) => (n(), l("div", ee, [
      y("div", te, [
        y("header", ae, [
          I.value ? (n(), l("span", ne, "Unsaved changes")) : u("", !0),
          _(c(U), {
            type: "button",
            label: "Discard",
            severity: "secondary",
            outlined: "",
            disabled: !I.value || i.value,
            onClick: b
          }, null, 8, ["disabled"]),
          _(c(U), {
            type: "button",
            label: i.value ? "Saving…" : "Save",
            loading: i.value,
            disabled: !I.value || i.value,
            onClick: Y
          }, {
            icon: M(() => [
              i.value ? u("", !0) : (n(), w(c(N), {
                key: 0,
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              }))
            ]),
            _: 1
          }, 8, ["label", "loading", "disabled"])
        ]),
        d.value ? (n(), l("div", le, p(d.value), 1)) : u("", !0),
        k.value ? (n(), l("div", oe, [
          _(c(N), {
            icon: "tabler:loader-2",
            class: "spin"
          }),
          a[0] || (a[0] = D(" Loading…", -1))
        ])) : (n(), l("div", se, [
          y("section", re, [
            y("header", ie, [
              _(c(N), {
                icon: T.value,
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              D(" " + p(J.value), 1)
            ]),
            O.value ? (n(), l("p", ue, p(O.value), 1)) : u("", !0),
            m.value.length ? (n(!0), l(C, { key: 2 }, F(E.value, (r) => (n(), l("div", {
              key: r.name,
              class: "pv-group"
            }, [
              z.value ? u("", !0) : (n(), l("h3", pe, p(r.name), 1)),
              (n(!0), l(C, null, F(r.items, (e) => (n(), l("div", {
                key: e.key,
                class: "pv-field"
              }, [
                y("div", de, [
                  y("label", ve, p(h(e)), 1),
                  e.is_secret && e.has_value ? (n(), l("span", ye, "set")) : !e.is_default && !e.is_secret ? (n(), l("span", me, "overridden")) : u("", !0),
                  e.is_default ? u("", !0) : (n(), w(c(U), {
                    key: 2,
                    class: "pv-reset",
                    type: "button",
                    severity: "secondary",
                    text: "",
                    rounded: "",
                    title: "Reset to default",
                    "aria-label": "Reset to default",
                    disabled: i.value,
                    onClick: (o) => q(e)
                  }, {
                    icon: M(() => [
                      _(c(N), {
                        icon: "tabler:rotate",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]))
                ]),
                e.control ? (n(), l(C, { key: 0 }, [
                  e.editable === !1 ? (n(), l("span", _e, p(e.value), 1)) : (n(), w(Q, {
                    key: 1,
                    tag: e.control.tag,
                    attrs: { ...e.control.props, value: L(e, s.value[e.key]) },
                    onSelect: (o) => j(e, o)
                  }, null, 8, ["tag", "attrs", "onSelect"])),
                  e.description ? (n(), l("p", he, p(e.description), 1)) : u("", !0)
                ], 64)) : e.value_type === "bool" ? (n(), l("div", ge, [
                  y("div", fe, [
                    e.description ? (n(), l("span", ke, p(e.description), 1)) : u("", !0)
                  ]),
                  _(c(W), {
                    "model-value": !!s.value[e.key],
                    "aria-label": h(e),
                    "onUpdate:modelValue": (o) => s.value[e.key] = o
                  }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"])
                ])) : (n(), l(C, { key: 2 }, [
                  $(e) ? (n(), w(c(X), {
                    key: 0,
                    class: "ap-select",
                    "model-value": s.value[e.key],
                    options: $(e),
                    "onUpdate:modelValue": (o) => s.value[e.key] = o
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])) : e.value_type === "int" ? (n(), l("input", {
                    key: 1,
                    class: "ap-binput",
                    type: "number",
                    min: e.schema?.minimum,
                    max: e.schema?.maximum,
                    value: s.value[e.key],
                    onInput: (o) => s.value[e.key] = Number(o.target.value)
                  }, null, 40, be)) : e.value_type === "secret" ? (n(), l("input", {
                    key: 2,
                    class: "ap-binput",
                    type: "password",
                    autocomplete: "off",
                    placeholder: e.has_value ? "•••••••• set — type to replace" : "Not set",
                    value: s.value[e.key],
                    onInput: (o) => s.value[e.key] = o.target.value
                  }, null, 40, xe)) : e.value_type === "json" ? (n(), l("textarea", {
                    key: 3,
                    class: "ap-binput pv-textarea",
                    rows: "4",
                    value: s.value[e.key],
                    onInput: (o) => s.value[e.key] = o.target.value
                  }, null, 40, Se)) : (n(), l("input", {
                    key: 4,
                    class: "ap-binput",
                    type: "text",
                    minlength: e.schema?.minLength,
                    maxlength: e.schema?.maxLength,
                    value: s.value[e.key],
                    onInput: (o) => s.value[e.key] = o.target.value
                  }, null, 40, we)),
                  e.description ? (n(), l("p", Ce, p(e.description), 1)) : u("", !0)
                ], 64))
              ]))), 128))
            ]))), 128)) : (n(), l("div", ce, "No settings declared."))
          ])
        ]))
      ])
    ]));
  }
});
export {
  Oe as default
};
//# sourceMappingURL=provider-CuHZAedJ.js.map
