import { b as ie, u as ue, P as ce } from "./wc-runtime-56DLhE4T.js";
import { defineComponent as ee, ref as C, computed as q, watch as me, onMounted as de, openBlock as l, createElementBlock as r, toDisplayString as b, createCommentVNode as _, Fragment as L, withDirectives as pe, vModelText as fe, renderList as J, createElementVNode as m, createBlock as A, resolveDynamicComponent as D, normalizeClass as S, withCtx as U, createTextVNode as W, unref as j, createVNode as R } from "vue";
import { Icon as F } from "@iconify/vue";
import { _ as G, s as ve, a as ye, b as X } from "./WcMount.vue_vue_type_script_setup_true_lang-I7TtWkSp.js";
import { api as H } from "@wippy-fe/proxy";
const he = () => ie();
function ke(h) {
  if (!h) return null;
  let f;
  if (typeof h == "number")
    f = h;
  else {
    const k = h.trim();
    if (/^\d+$/.test(k))
      f = Number(k);
    else {
      const g = Date.parse(k);
      return Number.isNaN(g) ? null : g;
    }
  }
  return Number.isFinite(f) ? f < 1e12 ? f * 1e3 : f : null;
}
function ge(h, f) {
  const k = ke(h);
  if (k === null) return "";
  const g = f?.now ?? Date.now(), w = f?.suffix ?? !0, $ = f?.maxUnit ?? "day", x = f?.future ?? !1, u = 6e4, c = 60 * u, a = 24 * c, V = 30 * a, M = 365 * a, N = g - k;
  if (x && N < 0) {
    const p = -N;
    return p < u ? "in <1m" : p < c ? `in ${Math.floor(p / u)}m` : p < a ? `in ${Math.floor(p / c)}h` : `in ${Math.floor(p / a)}d`;
  }
  const i = Math.max(0, N);
  if (i < u) return "just now";
  const d = w ? " ago" : "";
  return i < c ? `${Math.floor(i / u)}m${d}` : i < a ? `${Math.floor(i / c)}h${d}` : $ === "year" ? i < V ? `${Math.floor(i / a)}d${d}` : i < M ? `${Math.floor(i / V)}mo${d}` : `${Math.floor(i / M)}y${d}` : `${Math.floor(i / a)}d${d}`;
}
const _e = { class: "ks-form" }, be = {
  key: 0,
  class: "ks-err"
}, $e = {
  key: 1,
  class: "ks-loading"
}, we = {
  key: 2,
  class: "ks-empty"
}, xe = {
  key: 0,
  class: "ks-group-head"
}, Me = { class: "ks-group-title" }, Ae = { class: "ks-group-count" }, Ce = { key: 0 }, Se = {
  key: 0,
  class: "ks-owner"
}, Ne = { class: "ks-row-head" }, je = { class: "ks-title" }, Le = { class: "ks-key" }, Oe = {
  key: 0,
  class: "ks-tag kx-tag-caps ks-tag-on"
}, Ee = {
  key: 1,
  class: "ks-tag kx-tag-caps ks-tag-on"
}, Ie = {
  key: 0,
  class: "ks-field-err",
  role: "alert"
}, Ue = {
  key: 1,
  class: "ks-desc"
}, Ve = {
  key: 2,
  class: "ks-hint"
}, De = {
  key: 3,
  class: "ks-prov"
}, Re = { key: 0 }, Te = { class: "ks-field" }, qe = {
  key: 0,
  class: "ks-static"
}, Pe = ["min", "max", "value", "onInput"], Be = ["value", "onInput"], Fe = ["placeholder", "value", "onInput"], He = ["minlength", "maxlength", "value", "onInput"], Je = {
  key: 7,
  class: "ks-saved"
}, Ke = {
  key: 0,
  class: "ks-field-err"
}, K = "General", Z = /* @__PURE__ */ ee({
  __name: "SettingsForm",
  props: {
    namespace: {},
    all: { type: Boolean, default: !1 },
    blocks: { default: () => [] }
  },
  setup(h) {
    const f = h, k = C([]), g = C(!0), w = C(""), $ = C(""), x = C(""), u = C({}), c = C({}), a = (e) => `${e.namespace} ${e.key}`;
    function V(e) {
      const n = e.split(/[._\-\s]+/).filter(Boolean);
      return n.length ? n.map((o, t) => t === 0 ? o.charAt(0).toUpperCase() + o.slice(1) : o).join(" ") : e;
    }
    const M = (e) => e.title && e.title.length ? e.title : V(e.key), N = C(""), i = (e) => e.owner ? e.owner : f.blocks.find((o) => o.namespace === e.namespace || o.namespaces?.includes(e.namespace))?.title || e.namespace, d = q(() => {
      if (f.all) {
        const t = N.value.trim().toLowerCase(), s = k.value.filter((v) => !t || [
          M(v),
          v.key,
          v.namespace,
          i(v),
          v.description || ""
        ].some((y) => y.toLowerCase().includes(t)));
        return s.sort((v, y) => i(v).localeCompare(i(y)) || (v.order ?? 100) - (y.order ?? 100) || M(v).localeCompare(M(y))), [{ name: K, items: s }];
      }
      const e = /* @__PURE__ */ new Map();
      for (const t of k.value) {
        const s = t.category && t.category.length ? t.category : K;
        e.has(s) || e.set(s, []), e.get(s).push(t);
      }
      const n = (t) => typeof t.order == "number" ? t.order : 100, o = [];
      for (const [t, s] of e)
        s.sort((v, y) => n(v) - n(y) || M(v).localeCompare(M(y))), o.push({ name: t, items: s });
      return o.sort((t, s) => {
        const v = Math.min(...t.items.map(n)), y = Math.min(...s.items.map(n));
        return v - y || t.name.localeCompare(s.name);
      }), o;
    }), p = q(() => d.value.length === 1 && d.value[0].name === K), O = (e) => Array.isArray(e.schema?.enum) ? e.schema.enum : null;
    function E(e) {
      return {
        namespace: e.namespace,
        key: e.key,
        value: e.value,
        value_type: e.value_type,
        default: e.default,
        has_value: e.has_value,
        is_secret: e.is_secret,
        description: e.description,
        title: M(e),
        schema: e.schema ?? null
      };
    }
    function P(e, n, o = "") {
      if (!e) return "";
      const t = (s) => o ? `${o}: ${s}` : s;
      if (e.type === "array" && !Array.isArray(n)) return t("Must be an array");
      if (e.type === "object" && (n === null || typeof n != "object" || Array.isArray(n))) return t("Must be an object");
      if (e.type === "boolean" && typeof n != "boolean") return t("Must be a boolean");
      if (e.type === "null" && n !== null) return t("Must be null");
      if (e.type === "integer" || e.type === "number") {
        if (typeof n != "number" || !Number.isFinite(n)) return t("Must be a number");
        if (e.type === "integer" && !Number.isInteger(n)) return t("Must be a whole number");
      }
      if (e.type === "string" && typeof n != "string") return t("Must be a string");
      if (typeof n == "number") {
        if (typeof e.minimum == "number" && n < e.minimum) return t(`Must be ≥ ${e.minimum}`);
        if (typeof e.maximum == "number" && n > e.maximum) return t(`Must be ≤ ${e.maximum}`);
      }
      if (typeof n == "string") {
        if (typeof e.minLength == "number" && n.length < e.minLength) return t(`Must be at least ${e.minLength} characters`);
        if (typeof e.maxLength == "number" && n.length > e.maxLength) return t(`Must be at most ${e.maxLength} characters`);
        if (e.pattern && !new RegExp(e.pattern).test(n)) return t("Does not match the required format");
      }
      if (Array.isArray(e.enum) && !e.enum.includes(n))
        return t(`Must be one of: ${e.enum.join(", ")}`);
      if (Array.isArray(n) && e.items)
        for (let s = 0; s < n.length; s++) {
          const v = P(e.items, n[s], `${o}[${s}]`);
          if (v) return v;
        }
      if (n !== null && typeof n == "object" && !Array.isArray(n)) {
        const s = n, v = (y) => o ? `${o}.${y}` : y;
        for (const y of e.required ?? [])
          if (!Object.hasOwn(s, y)) return `${v(y)}: Required`;
        for (const [y, re] of Object.entries(e.properties ?? {})) {
          if (!Object.hasOwn(s, y)) continue;
          const Q = P(re, s[y], v(y));
          if (Q) return Q;
        }
      }
      return "";
    }
    function B(e) {
      if (!e) return "";
      const n = [];
      if (e.type && n.push(e.type), typeof e.minimum == "number" || typeof e.maximum == "number") {
        const o = typeof e.minimum == "number" ? e.minimum : "−∞", t = typeof e.maximum == "number" ? e.maximum : "∞";
        n.push(`range ${o}–${t}`);
      }
      (typeof e.minLength == "number" || typeof e.maxLength == "number") && n.push(`length ${e.minLength ?? 0}–${e.maxLength ?? "∞"}`), e.pattern && n.push(`pattern ${e.pattern}`), Array.isArray(e.enum) && n.push(`one of ${e.enum.join(", ")}`), e.required?.length && n.push(`required: ${e.required.join(", ")}`), e.items && n.push(`items: ${B(e.items)}`);
      for (const [o, t] of Object.entries(e.properties ?? {}))
        n.push(`${o}: ${B(t)}`);
      return n.join(" · ");
    }
    function I(e) {
      const n = a(e);
      if (e.value_type === "secret" && !String(u.value[n] ?? "").length)
        return delete c.value[n], "";
      let o = u.value[n], t;
      try {
        e.value_type === "json" ? o = JSON.parse(String(o)) : ((e.value_type === "int" || e.schema?.type === "integer" || e.schema?.type === "number") && (o = Number(o)), e.schema?.type === "string" && (o = String(o))), t = P(e.schema, o);
      } catch (s) {
        t = s instanceof Error ? s.message : String(s);
      }
      return t ? c.value[n] = t : delete c.value[n], t;
    }
    function Y(e, n) {
      u.value[a(e)] = e.value_type === "json" ? JSON.stringify(n, null, 2) : n;
    }
    function te(e) {
      Y(e, e.value_type === "secret" ? "" : e.value);
    }
    function ne(e, n) {
      Y(e, n), I(e);
    }
    async function T() {
      g.value = !0, w.value = "";
      try {
        const e = f.all ? "/api/v1/settings" : `/api/v1/settings?namespace=${encodeURIComponent(f.namespace)}`, { data: n } = await H.get(e);
        if (!n?.success) throw new Error(n?.error || "failed to load settings");
        k.value = Array.isArray(n.settings) ? n.settings : [];
        for (const o of k.value) te(o);
      } catch (e) {
        w.value = e instanceof Error ? e.message : String(e);
      } finally {
        g.value = !1;
      }
    }
    function z(e, n) {
      switch (e.value_type) {
        case "int":
          return Math.trunc(Number(n));
        case "bool":
          return !!n;
        case "json":
          return JSON.parse(String(n));
        default:
          return String(n);
      }
    }
    const ae = (e) => {
      const n = u.value[a(e)];
      return e.value_type === "secret" ? String(n ?? "").length > 0 : e.value_type === "json" ? n !== JSON.stringify(e.value, null, 2) : n !== e.value;
    };
    async function le(e) {
      const n = a(e);
      if (!I(e)) {
        $.value = n, w.value = "";
        try {
          const o = z(e, u.value[n]), { data: t } = await H.put("/api/v1/settings", { namespace: e.namespace, key: e.key, value: o });
          if (!t?.success) {
            c.value[n] = t?.error || "save failed";
            return;
          }
          delete c.value[n], x.value = n, setTimeout(() => {
            x.value === n && (x.value = "");
          }, 2e3), await T();
        } catch (o) {
          c.value[n] = o instanceof Error ? o.message : String(o);
        } finally {
          $.value = "";
        }
      }
    }
    async function oe(e) {
      const n = a(e);
      $.value = n, w.value = "";
      try {
        const { data: o } = await H.put("/api/v1/settings", { namespace: e.namespace, key: e.key, value: null });
        if (!o?.success) throw new Error(o?.error || "reset failed");
        await T();
      } catch (o) {
        w.value = o instanceof Error ? o.message : String(o);
      } finally {
        $.value = "";
      }
    }
    async function se() {
      await T();
    }
    return me(() => [f.namespace, f.all], T), de(T), (e, n) => (l(), r("div", _e, [
      w.value ? (l(), r("div", be, b(w.value), 1)) : _("", !0),
      g.value ? (l(), r("div", $e, "Loading…")) : k.value.length ? (l(), r(L, { key: 3 }, [
        h.all ? pe((l(), r("input", {
          key: 0,
          "onUpdate:modelValue": n[0] || (n[0] = (o) => N.value = o),
          type: "search",
          class: "ks-input ks-all-search",
          "aria-label": "Search settings",
          placeholder: "Search settings"
        }, null, 512)), [
          [fe, N.value]
        ]) : _("", !0),
        (l(!0), r(L, null, J(d.value, (o) => (l(), r("section", {
          key: o.name,
          class: "ks-group"
        }, [
          p.value ? _("", !0) : (l(), r("div", xe, [
            m("h2", Me, b(o.name), 1),
            m("span", Ae, b(o.items.length), 1)
          ])),
          (l(), A(D(h.all ? "table" : "div"), {
            class: S(["ks-list", { "ks-all-table": h.all }])
          }, {
            default: U(() => [
              h.all ? (l(), r("thead", Ce, [...n[1] || (n[1] = [
                m("tr", null, [
                  m("th", { scope: "col" }, "Owner"),
                  m("th", { scope: "col" }, "Setting"),
                  m("th", { scope: "col" }, "Value")
                ], -1)
              ])])) : _("", !0),
              (l(), A(D(h.all ? "tbody" : "div"), null, {
                default: U(() => [
                  (l(!0), r(L, null, J(o.items, (t) => (l(), A(D(h.all ? "tr" : "div"), {
                    key: a(t),
                    class: S(["ks-row", { "ks-row-invalid": t.error || c.value[a(t)], "ks-row-wc": t.ui }])
                  }, {
                    default: U(() => [
                      h.all ? (l(), r("td", Se, b(i(t)), 1)) : _("", !0),
                      (l(), A(D(h.all ? "td" : "div"), { class: "ks-row-main" }, {
                        default: U(() => [
                          m("div", Ne, [
                            m("span", je, b(M(t)), 1),
                            m("code", Le, b(t.key), 1),
                            t.is_secret && t.has_value ? (l(), r("span", Oe, "set")) : !t.is_default && !t.is_secret ? (l(), r("span", Ee, "overridden")) : _("", !0)
                          ]),
                          t.error ? (l(), r("p", Ie, b(t.error), 1)) : _("", !0),
                          t.description ? (l(), r("p", Ue, b(t.description), 1)) : _("", !0),
                          B(t.schema) ? (l(), r("p", Ve, b(B(t.schema)), 1)) : _("", !0),
                          !t.is_default && t.updated_by ? (l(), r("p", De, [
                            W("by " + b(t.updated_by), 1),
                            t.updated_at ? (l(), r("span", Re, " · " + b(j(ge)(t.updated_at)), 1)) : _("", !0)
                          ])) : _("", !0)
                        ]),
                        _: 2
                      }, 1024)),
                      t.ui ? (l(), A(D(h.all ? "td" : "div"), {
                        key: 1,
                        class: "ks-wc-slot"
                      }, {
                        default: U(() => [
                          (l(), A(G, {
                            key: a(t),
                            tag: t.ui,
                            config: E(t),
                            onChange: se
                          }, null, 8, ["tag", "config"]))
                        ]),
                        _: 2
                      }, 1024)) : (l(), A(D(h.all ? "td" : "div"), {
                        key: 2,
                        class: "ks-control"
                      }, {
                        default: U(() => [
                          m("div", Te, [
                            t.editable === !1 ? (l(), r("span", qe, b(t.value), 1)) : (l(), r(L, { key: 1 }, [
                              t.control ? (l(), A(G, {
                                key: 0,
                                tag: t.control.tag,
                                attrs: { ...t.control.props, value: z(t, u.value[a(t)]) },
                                onSelect: (s) => ne(t, s)
                              }, null, 8, ["tag", "attrs", "onSelect"])) : t.value_type === "bool" ? (l(), A(j(ve), {
                                key: 1,
                                "model-value": !!u.value[a(t)],
                                "aria-label": M(t),
                                "onUpdate:modelValue": (s) => u.value[a(t)] = s
                              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"])) : O(t) ? (l(), A(j(ye), {
                                key: 2,
                                class: S(["ks-select", { "ks-select-invalid": c.value[a(t)] }]),
                                "model-value": u.value[a(t)],
                                options: O(t),
                                "onUpdate:modelValue": (s) => {
                                  u.value[a(t)] = s, I(t);
                                }
                              }, null, 8, ["class", "model-value", "options", "onUpdate:modelValue"])) : t.value_type === "int" ? (l(), r("input", {
                                key: 3,
                                type: "number",
                                class: S(["ks-input", { "ks-input-invalid": c.value[a(t)] }]),
                                min: t.schema?.minimum,
                                max: t.schema?.maximum,
                                value: u.value[a(t)],
                                onInput: (s) => {
                                  u.value[a(t)] = Number(s.target.value), I(t);
                                }
                              }, null, 42, Pe)) : t.value_type === "json" ? (l(), r("textarea", {
                                key: 4,
                                rows: "4",
                                class: S(["ks-input", { "ks-input-invalid": c.value[a(t)] }]),
                                value: u.value[a(t)],
                                onInput: (s) => {
                                  u.value[a(t)] = s.target.value, I(t);
                                }
                              }, null, 42, Be)) : t.value_type === "secret" ? (l(), r("input", {
                                key: 5,
                                type: "password",
                                autocomplete: "off",
                                class: S(["ks-input", { "ks-input-invalid": c.value[a(t)] }]),
                                placeholder: t.has_value ? "•••••••• set — type to replace" : "Not set",
                                value: u.value[a(t)],
                                onInput: (s) => {
                                  u.value[a(t)] = s.target.value, I(t);
                                }
                              }, null, 42, Fe)) : (l(), r("input", {
                                key: 6,
                                type: "text",
                                class: S(["ks-input", { "ks-input-invalid": c.value[a(t)] }]),
                                minlength: t.schema?.minLength,
                                maxlength: t.schema?.maxLength,
                                value: u.value[a(t)],
                                onInput: (s) => {
                                  u.value[a(t)] = s.target.value, I(t);
                                }
                              }, null, 42, He)),
                              x.value === a(t) ? (l(), r("span", Je, [...n[2] || (n[2] = [
                                m("span", { class: "ks-saved-tick" }, "✓", -1),
                                W(" Saved", -1)
                              ])])) : _("", !0),
                              R(j(X), {
                                type: "button",
                                label: $.value === a(t) ? "Saving…" : "Save",
                                loading: $.value === a(t),
                                disabled: $.value === a(t) || !!c.value[a(t)] || t.value_type !== "bool" && !ae(t),
                                onClick: (s) => le(t)
                              }, null, 8, ["label", "loading", "disabled", "onClick"]),
                              t.is_default ? _("", !0) : (l(), A(j(X), {
                                key: 8,
                                type: "button",
                                severity: "secondary",
                                text: "",
                                rounded: "",
                                disabled: $.value === a(t),
                                title: "Reset to default",
                                "aria-label": "Reset to default",
                                onClick: (s) => oe(t)
                              }, {
                                icon: U(() => [
                                  R(j(F), {
                                    icon: "tabler:rotate",
                                    "aria-hidden": "true"
                                  })
                                ]),
                                _: 1
                              }, 8, ["disabled", "onClick"]))
                            ], 64))
                          ]),
                          c.value[a(t)] ? (l(), r("p", Ke, b(c.value[a(t)]), 1)) : _("", !0)
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
      ], 64)) : (l(), r("div", we, "No settings declared."))
    ]));
  }
}), Ge = { class: "ks" }, Ye = {
  key: 0,
  class: "ks-err"
}, ze = {
  key: 1,
  class: "ks-loading"
}, Qe = {
  key: 2,
  class: "ks-empty"
}, We = {
  key: 3,
  class: "ks-shell"
}, Xe = {
  class: "ks-nav",
  "aria-label": "Settings sections"
}, Ze = {
  key: 0,
  class: "ks-nav-group"
}, et = ["onClick"], tt = { class: "ks-nav-label" }, nt = { class: "ks-pane-head" }, at = { class: "ks-pane-ico" }, lt = { class: "ks-pane-head-text" }, ot = { key: 0 }, st = {
  key: 2,
  class: "ks-empty"
}, rt = /* @__PURE__ */ ee({
  __name: "settings",
  setup(h) {
    const f = he(), k = q(() => {
      const i = f.value?.route;
      return typeof i == "string" && i.length ? i : "";
    }), g = C([]), w = C(!0), $ = C(""), x = C(""), u = C(!1), c = q(() => {
      const i = [];
      for (const d of g.value) {
        const p = d.group || "", O = i[i.length - 1];
        O && O.group === p ? O.items.push(d) : i.push({ group: p, items: [d] });
      }
      return i;
    }), a = q(() => g.value.find((i) => i.key === x.value) || null);
    function V(i) {
      u.value = !1, x.value = i;
    }
    function M() {
      u.value = !0;
    }
    async function N() {
      w.value = !0, $.value = "";
      try {
        const { data: i } = await H.get("/api/v1/settings/blocks");
        if (!i?.success) throw new Error(i?.error || "failed to load settings blocks");
        g.value = Array.isArray(i.blocks) ? i.blocks : [];
        const d = k.value && g.value.some((p) => p.key === k.value) ? k.value : g.value.some((p) => p.key === x.value) ? x.value : g.value[0]?.key || "";
        x.value = d, k.value === "all-settings" && !g.value.some((p) => p.key === k.value) && (u.value = !0);
      } catch (i) {
        $.value = i instanceof Error ? i.message : String(i);
      } finally {
        w.value = !1;
      }
    }
    return ue(N), (i, d) => (l(), r("div", Ge, [
      $.value ? (l(), r("div", Ye, b($.value), 1)) : _("", !0),
      w.value ? (l(), r("div", ze, "Loading…")) : g.value.length ? (l(), r("div", We, [
        m("nav", Xe, [
          m("button", {
            type: "button",
            class: S(["ks-nav-item", { "ks-nav-item-active": u.value }]),
            onClick: M
          }, [
            R(j(F), {
              class: "ks-nav-ico",
              icon: "tabler:table",
              "aria-hidden": "true"
            }),
            d[0] || (d[0] = m("span", { class: "ks-nav-label" }, "All settings", -1))
          ], 2),
          (l(!0), r(L, null, J(c.value, (p, O) => (l(), r("div", {
            key: O,
            class: "ks-nav-section"
          }, [
            p.group ? (l(), r("div", Ze, b(p.group), 1)) : _("", !0),
            (l(!0), r(L, null, J(p.items, (E) => (l(), r("button", {
              key: E.key,
              type: "button",
              class: S(["ks-nav-item", { "ks-nav-item-active": !u.value && E.key === x.value }]),
              onClick: (P) => V(E.key)
            }, [
              R(j(F), {
                class: "ks-nav-ico",
                icon: E.icon || "tabler:adjustments",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              m("span", tt, b(E.title), 1)
            ], 10, et))), 128))
          ]))), 128))
        ]),
        m("section", {
          class: S(["ks-pane", { "ks-pane-flush": !u.value && a.value && a.value.component_tag }])
        }, [
          u.value ? (l(), r(L, { key: 0 }, [
            d[1] || (d[1] = m("header", { class: "ks-pane-head" }, [
              m("h1", null, "All settings")
            ], -1)),
            R(Z, {
              key: "all-settings-table",
              namespace: "",
              all: "",
              blocks: g.value
            }, null, 8, ["blocks"])
          ], 64)) : a.value ? (l(), r(L, { key: 1 }, [
            a.value.component_tag ? (l(), A(G, {
              key: a.value.key,
              tag: a.value.component_tag,
              config: a.value.config
            }, null, 8, ["tag", "config"])) : a.value.namespace ? (l(), r(L, { key: 1 }, [
              m("header", nt, [
                m("span", at, [
                  R(j(F), {
                    icon: a.value.icon || "tabler:adjustments",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                m("div", lt, [
                  m("h1", null, b(a.value.title), 1),
                  typeof a.value.config?.description == "string" ? (l(), r("p", ot, b(a.value.config.description), 1)) : _("", !0)
                ])
              ]),
              (l(), A(Z, {
                key: a.value.key,
                namespace: a.value.namespace
              }, null, 8, ["namespace"]))
            ], 64)) : (l(), r("div", st, "This block has no editor."))
          ], 64)) : _("", !0)
        ], 2)
      ])) : (l(), r("div", Qe, "No settings declared."))
    ]));
  }
}), pt = {
  rootComponent: rt,
  plugins: [ce]
};
export {
  pt as mountConfig
};
//# sourceMappingURL=lazy-mount-Pt1wsnO_.js.map
