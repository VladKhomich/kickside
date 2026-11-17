import { a as fe, u as ve, P as ye } from "./wc-runtime-4lROyJyk.js";
import { defineComponent as oe, ref as S, useId as he, computed as T, watch as ke, onMounted as ge, openBlock as o, createElementBlock as s, toDisplayString as _, createCommentVNode as b, Fragment as O, withDirectives as be, vModelText as _e, renderList as K, createElementVNode as m, createBlock as M, resolveDynamicComponent as R, normalizeClass as D, withCtx as E, createTextVNode as ee, unref as L, mergeProps as F, createVNode as V } from "vue";
import { Icon as H } from "@iconify/vue";
import { _ as z, s as $e, a as we, b as te, c as ae } from "./setting-change-Dp6CFrHB.js";
import { api as J } from "@wippy-fe/proxy";
const xe = () => fe();
function Ce(y) {
  if (!y) return null;
  let p;
  if (typeof y == "number")
    p = y;
  else {
    const k = y.trim();
    if (/^\d+$/.test(k))
      p = Number(k);
    else {
      const g = Date.parse(k);
      return Number.isNaN(g) ? null : g;
    }
  }
  return Number.isFinite(p) ? p < 1e12 ? p * 1e3 : p : null;
}
function Me(y, p) {
  const k = Ce(y);
  if (k === null) return "";
  const g = p?.now ?? Date.now(), x = p?.suffix ?? !0, $ = p?.maxUnit ?? "day", C = p?.future ?? !1, c = 6e4, d = 60 * c, n = 24 * d, U = 30 * n, w = 365 * n, j = g - k;
  if (C && j < 0) {
    const u = -j;
    return u < c ? "in <1m" : u < d ? `in ${Math.floor(u / c)}m` : u < n ? `in ${Math.floor(u / d)}h` : `in ${Math.floor(u / n)}d`;
  }
  const i = Math.max(0, j);
  if (i < c) return "just now";
  const h = x ? " ago" : "";
  return i < d ? `${Math.floor(i / c)}m${h}` : i < n ? `${Math.floor(i / d)}h${h}` : $ === "year" ? i < U ? `${Math.floor(i / n)}d${h}` : i < w ? `${Math.floor(i / U)}mo${h}` : `${Math.floor(i / w)}y${h}` : `${Math.floor(i / n)}d${h}`;
}
const Se = { class: "ks-form" }, Ae = {
  key: 0,
  class: "ks-err"
}, je = {
  key: 1,
  class: "ks-loading"
}, Ne = {
  key: 2,
  class: "ks-empty"
}, Le = {
  key: 0,
  class: "ks-group-head"
}, Oe = { class: "ks-group-title" }, Ie = { class: "ks-group-count" }, Ee = { key: 0 }, Ue = {
  key: 0,
  class: "ks-owner"
}, Re = { class: "ks-row-head" }, Ve = ["id"], De = { class: "ks-key" }, Be = {
  key: 0,
  class: "ks-tag kx-tag-caps ks-tag-on"
}, Pe = {
  key: 1,
  class: "ks-tag kx-tag-caps ks-tag-on"
}, Te = ["id"], qe = ["id"], Fe = ["id"], He = {
  key: 3,
  class: "ks-prov"
}, Je = { key: 0 }, Ke = { class: "ks-field" }, Ge = {
  key: 0,
  class: "ks-static"
}, Ye = ["min", "max", "value", "onInput"], ze = ["value", "onInput"], Qe = ["placeholder", "value", "onInput"], We = ["minlength", "maxlength", "value", "onInput"], Xe = {
  key: 7,
  class: "ks-saved"
}, Ze = ["id"], Y = "General", ne = /* @__PURE__ */ oe({
  __name: "SettingsForm",
  props: {
    namespace: {},
    all: { type: Boolean, default: !1 },
    blocks: { default: () => [] }
  },
  setup(y) {
    const p = y, k = S([]), g = S(!0), x = S(""), $ = S(""), C = S(""), c = S({}), d = S({}), n = (e) => `${e.namespace} ${e.key}`, U = he(), w = (e, a) => `${U}-${encodeURIComponent(e.namespace)}-${encodeURIComponent(e.key)}-${a}`, j = (e) => [
      e.description && w(e, "description"),
      B(e.schema) && w(e, "hint"),
      e.error && w(e, "error"),
      d.value[n(e)] && w(e, "validation")
    ].filter(Boolean).join(" ") || void 0, i = (e) => ({
      "aria-labelledby": w(e, "title"),
      "aria-describedby": j(e),
      "aria-invalid": !!(e.error || d.value[n(e)]) || void 0
    });
    function h(e) {
      const a = e.split(/[._\-\s]+/).filter(Boolean);
      return a.length ? a.map((r, t) => t === 0 ? r.charAt(0).toUpperCase() + r.slice(1) : r).join(" ") : e;
    }
    const u = (e) => e.title && e.title.length ? e.title : h(e.key), N = S(""), A = (e) => e.owner ? e.owner : p.blocks.find((r) => r.namespace === e.namespace || r.namespaces?.includes(e.namespace))?.title || e.namespace, q = T(() => {
      if (p.all) {
        const t = N.value.trim().toLowerCase(), l = k.value.filter((f) => !t || [
          u(f),
          f.key,
          f.namespace,
          A(f),
          f.description || ""
        ].some((v) => v.toLowerCase().includes(t)));
        return l.sort((f, v) => A(f).localeCompare(A(v)) || (f.order ?? 100) - (v.order ?? 100) || u(f).localeCompare(u(v))), [{ name: Y, items: l }];
      }
      const e = /* @__PURE__ */ new Map();
      for (const t of k.value) {
        const l = t.category && t.category.length ? t.category : Y;
        e.has(l) || e.set(l, []), e.get(l).push(t);
      }
      const a = (t) => typeof t.order == "number" ? t.order : 100, r = [];
      for (const [t, l] of e)
        l.sort((f, v) => a(f) - a(v) || u(f).localeCompare(u(v))), r.push({ name: t, items: l });
      return r.sort((t, l) => {
        const f = Math.min(...t.items.map(a)), v = Math.min(...l.items.map(a));
        return f - v || t.name.localeCompare(l.name);
      }), r;
    }), re = T(() => q.value.length === 1 && q.value[0].name === Y), Q = (e) => Array.isArray(e.schema?.enum) ? e.schema.enum : null;
    function le(e) {
      return {
        namespace: e.namespace,
        key: e.key,
        value: e.value,
        value_type: e.value_type,
        default: e.default,
        has_value: e.has_value,
        is_secret: e.is_secret,
        description: e.description,
        title: u(e),
        schema: e.schema ?? null
      };
    }
    function G(e, a, r = "") {
      if (!e) return "";
      const t = (l) => r ? `${r}: ${l}` : l;
      if (e.type === "array" && !Array.isArray(a)) return t("Must be an array");
      if (e.type === "object" && (a === null || typeof a != "object" || Array.isArray(a))) return t("Must be an object");
      if (e.type === "boolean" && typeof a != "boolean") return t("Must be a boolean");
      if (e.type === "null" && a !== null) return t("Must be null");
      if (e.type === "integer" || e.type === "number") {
        if (typeof a != "number" || !Number.isFinite(a)) return t("Must be a number");
        if (e.type === "integer" && !Number.isInteger(a)) return t("Must be a whole number");
      }
      if (e.type === "string" && typeof a != "string") return t("Must be a string");
      if (typeof a == "number") {
        if (typeof e.minimum == "number" && a < e.minimum) return t(`Must be ≥ ${e.minimum}`);
        if (typeof e.maximum == "number" && a > e.maximum) return t(`Must be ≤ ${e.maximum}`);
      }
      if (typeof a == "string") {
        if (typeof e.minLength == "number" && a.length < e.minLength) return t(`Must be at least ${e.minLength} characters`);
        if (typeof e.maxLength == "number" && a.length > e.maxLength) return t(`Must be at most ${e.maxLength} characters`);
        if (e.pattern && !new RegExp(e.pattern).test(a)) return t("Does not match the required format");
      }
      if (Array.isArray(e.enum) && !e.enum.includes(a))
        return t(`Must be one of: ${e.enum.join(", ")}`);
      if (Array.isArray(a) && e.items)
        for (let l = 0; l < a.length; l++) {
          const f = G(e.items, a[l], `${r}[${l}]`);
          if (f) return f;
        }
      if (a !== null && typeof a == "object" && !Array.isArray(a)) {
        const l = a, f = (v) => r ? `${r}.${v}` : v;
        for (const v of e.required ?? [])
          if (!Object.hasOwn(l, v)) return `${f(v)}: Required`;
        for (const [v, pe] of Object.entries(e.properties ?? {})) {
          if (!Object.hasOwn(l, v)) continue;
          const Z = G(pe, l[v], f(v));
          if (Z) return Z;
        }
      }
      return "";
    }
    function B(e) {
      if (!e) return "";
      const a = [];
      if (e.type && a.push(e.type), typeof e.minimum == "number" || typeof e.maximum == "number") {
        const r = typeof e.minimum == "number" ? e.minimum : "−∞", t = typeof e.maximum == "number" ? e.maximum : "∞";
        a.push(`range ${r}–${t}`);
      }
      (typeof e.minLength == "number" || typeof e.maxLength == "number") && a.push(`length ${e.minLength ?? 0}–${e.maxLength ?? "∞"}`), e.pattern && a.push(`pattern ${e.pattern}`), Array.isArray(e.enum) && a.push(`one of ${e.enum.join(", ")}`), e.required?.length && a.push(`required: ${e.required.join(", ")}`), e.items && a.push(`items: ${B(e.items)}`);
      for (const [r, t] of Object.entries(e.properties ?? {}))
        a.push(`${r}: ${B(t)}`);
      return a.join(" · ");
    }
    function I(e) {
      const a = n(e);
      if (e.value_type === "secret" && !String(c.value[a] ?? "").length)
        return delete d.value[a], "";
      let r = c.value[a], t;
      try {
        e.value_type === "json" ? r = JSON.parse(String(r)) : ((e.value_type === "int" || e.schema?.type === "integer" || e.schema?.type === "number") && (r = Number(r)), e.schema?.type === "string" && (r = String(r))), t = G(e.schema, r);
      } catch (l) {
        t = l instanceof Error ? l.message : String(l);
      }
      return t ? d.value[a] = t : delete d.value[a], t;
    }
    function W(e, a) {
      c.value[n(e)] = e.value_type === "json" ? JSON.stringify(a, null, 2) : a;
    }
    function ie(e) {
      W(e, e.value_type === "secret" ? "" : e.value);
    }
    function se(e, a) {
      W(e, a), I(e);
    }
    async function P() {
      g.value = !0, x.value = "";
      try {
        const e = p.all ? "/api/v1/settings" : `/api/v1/settings?namespace=${encodeURIComponent(p.namespace)}`, { data: a } = await J.get(e);
        if (!a?.success) throw new Error(a?.error || "failed to load settings");
        k.value = Array.isArray(a.settings) ? a.settings : [];
        for (const r of k.value) ie(r);
      } catch (e) {
        x.value = e instanceof Error ? e.message : String(e);
      } finally {
        g.value = !1;
      }
    }
    function X(e, a) {
      switch (e.value_type) {
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
    const ue = (e) => {
      const a = c.value[n(e)];
      return e.value_type === "secret" ? String(a ?? "").length > 0 : e.value_type === "json" ? a !== JSON.stringify(e.value, null, 2) : a !== e.value;
    };
    async function ce(e) {
      const a = n(e);
      if (!I(e) && !$.value) {
        $.value = a, x.value = "";
        try {
          const r = X(e, c.value[a]);
          if (!await ae(e, r, u(e), "Save")) return;
          const { data: t } = await J.put("/api/v1/settings", { namespace: e.namespace, key: e.key, value: r });
          if (!t?.success) {
            d.value[a] = t?.error || "save failed";
            return;
          }
          delete d.value[a], C.value = a, setTimeout(() => {
            C.value === a && (C.value = "");
          }, 2e3), await P();
        } catch (r) {
          d.value[a] = r instanceof Error ? r.message : String(r);
        } finally {
          $.value = "";
        }
      }
    }
    async function de(e) {
      if ($.value) return;
      const a = n(e);
      $.value = a, x.value = "";
      try {
        if (!await ae(e, e.default, u(e), "Reset to default")) return;
        const { data: r } = await J.put("/api/v1/settings", { namespace: e.namespace, key: e.key, value: null });
        if (!r?.success) throw new Error(r?.error || "reset failed");
        await P();
      } catch (r) {
        x.value = r instanceof Error ? r.message : String(r);
      } finally {
        $.value = "";
      }
    }
    async function me() {
      await P();
    }
    return ke(() => [p.namespace, p.all], P), ge(P), (e, a) => (o(), s("div", Se, [
      x.value ? (o(), s("div", Ae, _(x.value), 1)) : b("", !0),
      g.value ? (o(), s("div", je, "Loading…")) : k.value.length ? (o(), s(O, { key: 3 }, [
        y.all ? be((o(), s("input", {
          key: 0,
          "onUpdate:modelValue": a[0] || (a[0] = (r) => N.value = r),
          type: "search",
          class: "ks-input ks-all-search",
          "aria-label": "Search settings",
          placeholder: "Search settings"
        }, null, 512)), [
          [_e, N.value]
        ]) : b("", !0),
        (o(!0), s(O, null, K(q.value, (r) => (o(), s("section", {
          key: r.name,
          class: "ks-group"
        }, [
          re.value ? b("", !0) : (o(), s("div", Le, [
            m("h2", Oe, _(r.name), 1),
            m("span", Ie, _(r.items.length), 1)
          ])),
          (o(), M(R(y.all ? "table" : "div"), {
            class: D(["ks-list", { "ks-all-table": y.all }])
          }, {
            default: E(() => [
              y.all ? (o(), s("thead", Ee, [...a[1] || (a[1] = [
                m("tr", null, [
                  m("th", { scope: "col" }, "Owner"),
                  m("th", { scope: "col" }, "Setting"),
                  m("th", { scope: "col" }, "Value")
                ], -1)
              ])])) : b("", !0),
              (o(), M(R(y.all ? "tbody" : "div"), null, {
                default: E(() => [
                  (o(!0), s(O, null, K(r.items, (t) => (o(), M(R(y.all ? "tr" : "div"), {
                    key: n(t),
                    class: D(["ks-row", { "ks-row-invalid": t.error || d.value[n(t)], "ks-row-wc": t.ui }])
                  }, {
                    default: E(() => [
                      y.all ? (o(), s("td", Ue, _(A(t)), 1)) : b("", !0),
                      (o(), M(R(y.all ? "td" : "div"), { class: "ks-row-main" }, {
                        default: E(() => [
                          m("div", Re, [
                            m("span", {
                              id: w(t, "title"),
                              class: "ks-title"
                            }, _(u(t)), 9, Ve),
                            m("code", De, _(t.key), 1),
                            t.is_secret && t.has_value ? (o(), s("span", Be, "set")) : !t.is_default && !t.is_secret ? (o(), s("span", Pe, "overridden")) : b("", !0)
                          ]),
                          t.error ? (o(), s("p", {
                            key: 0,
                            id: w(t, "error"),
                            class: "ks-field-err",
                            role: "alert"
                          }, _(t.error), 9, Te)) : b("", !0),
                          t.description ? (o(), s("p", {
                            key: 1,
                            id: w(t, "description"),
                            class: "ks-desc"
                          }, _(t.description), 9, qe)) : b("", !0),
                          B(t.schema) ? (o(), s("p", {
                            key: 2,
                            id: w(t, "hint"),
                            class: "ks-hint"
                          }, _(B(t.schema)), 9, Fe)) : b("", !0),
                          !t.is_default && t.updated_by ? (o(), s("p", He, [
                            ee("by " + _(t.updated_by), 1),
                            t.updated_at ? (o(), s("span", Je, " · " + _(L(Me)(t.updated_at)), 1)) : b("", !0)
                          ])) : b("", !0)
                        ]),
                        _: 2
                      }, 1024)),
                      t.ui ? (o(), M(R(y.all ? "td" : "div"), {
                        key: 1,
                        class: "ks-wc-slot"
                      }, {
                        default: E(() => [
                          (o(), M(z, {
                            key: n(t),
                            tag: t.ui,
                            config: le(t),
                            label: u(t),
                            attrs: { role: "group", ...i(t) },
                            onChange: me
                          }, null, 8, ["tag", "config", "label", "attrs"]))
                        ]),
                        _: 2
                      }, 1024)) : (o(), M(R(y.all ? "td" : "div"), {
                        key: 2,
                        class: "ks-control"
                      }, {
                        default: E(() => [
                          m("div", Ke, [
                            t.editable === !1 ? (o(), s("span", Ge, _(t.value), 1)) : (o(), s(O, { key: 1 }, [
                              t.control ? (o(), M(z, {
                                key: 0,
                                tag: t.control.tag,
                                label: u(t),
                                attrs: { ...t.control.props, role: "group", description: t.description, ...i(t), value: X(t, c.value[n(t)]) },
                                onSelect: (l) => se(t, l)
                              }, null, 8, ["tag", "label", "attrs", "onSelect"])) : t.value_type === "bool" ? (o(), M(L($e), {
                                key: 1,
                                pt: { input: i(t) },
                                "model-value": !!c.value[n(t)],
                                "onUpdate:modelValue": (l) => c.value[n(t)] = l
                              }, null, 8, ["pt", "model-value", "onUpdate:modelValue"])) : Q(t) ? (o(), M(L(we), {
                                key: 2,
                                class: D(["ks-select", { "ks-select-invalid": d.value[n(t)] }]),
                                pt: { label: i(t) },
                                "model-value": c.value[n(t)],
                                options: Q(t),
                                "onUpdate:modelValue": (l) => {
                                  c.value[n(t)] = l, I(t);
                                }
                              }, null, 8, ["pt", "class", "model-value", "options", "onUpdate:modelValue"])) : t.value_type === "int" ? (o(), s("input", F({
                                key: 3,
                                ref_for: !0
                              }, i(t), {
                                type: "number",
                                class: ["ks-input", { "ks-input-invalid": d.value[n(t)] }],
                                min: t.schema?.minimum,
                                max: t.schema?.maximum,
                                value: c.value[n(t)],
                                onInput: (l) => {
                                  c.value[n(t)] = Number(l.target.value), I(t);
                                }
                              }), null, 16, Ye)) : t.value_type === "json" ? (o(), s("textarea", F({
                                key: 4,
                                ref_for: !0
                              }, i(t), {
                                rows: "4",
                                class: ["ks-input", { "ks-input-invalid": d.value[n(t)] }],
                                value: c.value[n(t)],
                                onInput: (l) => {
                                  c.value[n(t)] = l.target.value, I(t);
                                }
                              }), null, 16, ze)) : t.value_type === "secret" ? (o(), s("input", F({
                                key: 5,
                                ref_for: !0
                              }, i(t), {
                                type: "password",
                                autocomplete: "off",
                                class: ["ks-input", { "ks-input-invalid": d.value[n(t)] }],
                                placeholder: t.has_value ? "•••••••• set — type to replace" : "Not set",
                                value: c.value[n(t)],
                                onInput: (l) => {
                                  c.value[n(t)] = l.target.value, I(t);
                                }
                              }), null, 16, Qe)) : (o(), s("input", F({
                                key: 6,
                                ref_for: !0
                              }, i(t), {
                                type: "text",
                                class: ["ks-input", { "ks-input-invalid": d.value[n(t)] }],
                                minlength: t.schema?.minLength,
                                maxlength: t.schema?.maxLength,
                                value: c.value[n(t)],
                                onInput: (l) => {
                                  c.value[n(t)] = l.target.value, I(t);
                                }
                              }), null, 16, We)),
                              C.value === n(t) ? (o(), s("span", Xe, [...a[2] || (a[2] = [
                                m("span", { class: "ks-saved-tick" }, "✓", -1),
                                ee(" Saved", -1)
                              ])])) : b("", !0),
                              V(L(te), {
                                type: "button",
                                label: $.value === n(t) ? "Saving…" : "Save",
                                "aria-label": `Save ${u(t)}`,
                                "aria-describedby": j(t),
                                loading: $.value === n(t),
                                disabled: $.value === n(t) || !!d.value[n(t)] || t.value_type !== "bool" && !ue(t),
                                onClick: (l) => ce(t)
                              }, null, 8, ["label", "aria-label", "aria-describedby", "loading", "disabled", "onClick"]),
                              t.is_default ? b("", !0) : (o(), M(L(te), {
                                key: 8,
                                type: "button",
                                severity: "secondary",
                                text: "",
                                rounded: "",
                                disabled: $.value === n(t),
                                title: "Reset to default",
                                "aria-label": `Reset ${u(t)} to default`,
                                "aria-describedby": j(t),
                                onClick: (l) => de(t)
                              }, {
                                icon: E(() => [
                                  V(L(H), {
                                    icon: "tabler:rotate",
                                    "aria-hidden": "true"
                                  })
                                ]),
                                _: 1
                              }, 8, ["disabled", "aria-label", "aria-describedby", "onClick"]))
                            ], 64))
                          ]),
                          d.value[n(t)] ? (o(), s("p", {
                            key: 0,
                            id: w(t, "validation"),
                            role: "alert",
                            class: "ks-field-err"
                          }, _(d.value[n(t)]), 9, Ze)) : b("", !0)
                        ]),
                        _: 2
                      }, 1024))
                    ]),
                    _: 2
                  }, 1032, ["class"]))), 128))
                ]),
                _: 2
              }, 1024))
            ]),
            _: 2
          }, 1032, ["class"]))
        ]))), 128))
      ], 64)) : (o(), s("div", Ne, "No settings declared."))
    ]));
  }
}), et = { class: "ks" }, tt = {
  key: 0,
  class: "ks-err"
}, at = {
  key: 1,
  class: "ks-loading"
}, nt = {
  key: 2,
  class: "ks-empty"
}, ot = {
  key: 3,
  class: "ks-shell"
}, rt = {
  class: "ks-nav",
  "aria-label": "Settings sections"
}, lt = {
  key: 0,
  class: "ks-nav-group"
}, it = ["onClick"], st = { class: "ks-nav-label" }, ut = { class: "ks-pane-head" }, ct = { class: "ks-pane-ico" }, dt = { class: "ks-pane-head-text" }, mt = { key: 0 }, pt = {
  key: 2,
  class: "ks-empty"
}, ft = /* @__PURE__ */ oe({
  __name: "settings",
  setup(y) {
    const p = xe(), k = T(() => {
      const i = p.value?.route;
      return typeof i == "string" && i.length ? i : "";
    }), g = S([]), x = S(!0), $ = S(""), C = S(""), c = S(!1), d = T(() => {
      const i = [];
      for (const h of g.value) {
        const u = h.group || "", N = i[i.length - 1];
        N && N.group === u ? N.items.push(h) : i.push({ group: u, items: [h] });
      }
      return i;
    }), n = T(() => g.value.find((i) => i.key === C.value) || null);
    function U(i) {
      c.value = !1, C.value = i;
    }
    function w() {
      c.value = !0;
    }
    async function j() {
      x.value = !0, $.value = "";
      try {
        const { data: i } = await J.get("/api/v1/settings/blocks");
        if (!i?.success) throw new Error(i?.error || "failed to load settings blocks");
        g.value = Array.isArray(i.blocks) ? i.blocks : [];
        const h = k.value && g.value.some((u) => u.key === k.value) ? k.value : g.value.some((u) => u.key === C.value) ? C.value : g.value[0]?.key || "";
        C.value = h, k.value === "all-settings" && !g.value.some((u) => u.key === k.value) && (c.value = !0);
      } catch (i) {
        $.value = i instanceof Error ? i.message : String(i);
      } finally {
        x.value = !1;
      }
    }
    return ve(j), (i, h) => (o(), s("div", et, [
      $.value ? (o(), s("div", tt, _($.value), 1)) : b("", !0),
      x.value ? (o(), s("div", at, "Loading…")) : g.value.length ? (o(), s("div", ot, [
        m("nav", rt, [
          m("button", {
            type: "button",
            class: D(["ks-nav-item", { "ks-nav-item-active": c.value }]),
            onClick: w
          }, [
            V(L(H), {
              class: "ks-nav-ico",
              icon: "tabler:table",
              "aria-hidden": "true"
            }),
            h[0] || (h[0] = m("span", { class: "ks-nav-label" }, "All settings", -1))
          ], 2),
          (o(!0), s(O, null, K(d.value, (u, N) => (o(), s("div", {
            key: N,
            class: "ks-nav-section"
          }, [
            u.group ? (o(), s("div", lt, _(u.group), 1)) : b("", !0),
            (o(!0), s(O, null, K(u.items, (A) => (o(), s("button", {
              key: A.key,
              type: "button",
              class: D(["ks-nav-item", { "ks-nav-item-active": !c.value && A.key === C.value }]),
              onClick: (q) => U(A.key)
            }, [
              V(L(H), {
                class: "ks-nav-ico",
                icon: A.icon || "tabler:adjustments",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              m("span", st, _(A.title), 1)
            ], 10, it))), 128))
          ]))), 128))
        ]),
        m("section", {
          class: D(["ks-pane", { "ks-pane-flush": !c.value && n.value && n.value.component_tag }])
        }, [
          c.value ? (o(), s(O, { key: 0 }, [
            h[1] || (h[1] = m("header", { class: "ks-pane-head" }, [
              m("h1", null, "All settings")
            ], -1)),
            V(ne, {
              key: "all-settings-table",
              namespace: "",
              all: "",
              blocks: g.value
            }, null, 8, ["blocks"])
          ], 64)) : n.value ? (o(), s(O, { key: 1 }, [
            n.value.component_tag ? (o(), M(z, {
              key: n.value.key,
              tag: n.value.component_tag,
              config: n.value.config
            }, null, 8, ["tag", "config"])) : n.value.namespace ? (o(), s(O, { key: 1 }, [
              m("header", ut, [
                m("span", ct, [
                  V(L(H), {
                    icon: n.value.icon || "tabler:adjustments",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                m("div", dt, [
                  m("h1", null, _(n.value.title), 1),
                  typeof n.value.config?.description == "string" ? (o(), s("p", mt, _(n.value.config.description), 1)) : b("", !0)
                ])
              ]),
              (o(), M(ne, {
                key: n.value.key,
                namespace: n.value.namespace
              }, null, 8, ["namespace"]))
            ], 64)) : (o(), s("div", pt, "This block has no editor."))
          ], 64)) : b("", !0)
        ], 2)
      ])) : (o(), s("div", nt, "No settings declared."))
    ]));
  }
}), bt = {
  rootComponent: ft,
  plugins: [ye]
};
export {
  bt as mountConfig
};
//# sourceMappingURL=lazy-mount-BLEPbWYE.js.map
