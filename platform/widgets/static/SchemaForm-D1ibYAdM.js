import { defineComponent as P, ref as q, watch as V, openBlock as u, createElementBlock as p, computed as I, useId as Y, onMounted as ee, withModifiers as te, Fragment as T, renderList as U, createBlock as $, resolveDynamicComponent as B, normalizeClass as R, withCtx as D, createCommentVNode as A, createElementVNode as re, createTextVNode as ne, toDisplayString as L, unref as ae, mergeProps as O } from "vue";
import { a as se, u as oe } from "./wc-runtime-BOOCbdbY.js";
import { _ as ie } from "./WcMount.vue_vue_type_script_setup_true_lang-CNWT59Oh.js";
function y(s, a) {
  if (Object.is(s, a)) return !0;
  if (!s || !a || typeof s != "object" || typeof a != "object") return !1;
  if (Array.isArray(s) || Array.isArray(a))
    return Array.isArray(s) && Array.isArray(a) && s.length === a.length && s.every((m, _) => y(m, a[_]));
  const l = s, i = a, h = Object.keys(l);
  return h.length === Object.keys(i).length && h.every((m) => Object.hasOwn(i, m) && y(l[m], i[m]));
}
const ue = ["rows", "value"], ce = /* @__PURE__ */ P({
  __name: "StructuredValueField",
  props: {
    value: {},
    fallback: {},
    kind: {},
    rows: { default: 7 }
  },
  emits: ["change", "error"],
  setup(s, { emit: a }) {
    const l = s, i = a;
    function h() {
      return l.kind === "array" ? [] : {};
    }
    function m(f) {
      return l.kind === "array" ? Array.isArray(f) : !!f && typeof f == "object" && !Array.isArray(f);
    }
    function _() {
      return m(l.value) ? l.value : m(l.fallback) ? l.fallback : h();
    }
    function S(f) {
      try {
        return JSON.stringify(f, null, 2);
      } catch {
        return JSON.stringify(h(), null, 2);
      }
    }
    const E = q(S(_()));
    let d = _();
    V(() => [l.value, l.fallback, l.kind], () => {
      const f = _();
      y(f, d) || (d = f, E.value = S(f), i("error", ""));
    });
    function g(f) {
      E.value = f;
      let v;
      try {
        v = JSON.parse(f);
      } catch {
        i("error", "That isn’t valid JSON. Check commas, quotes, and brackets.");
        return;
      }
      if (!m(v)) {
        i("error", `Enter a JSON ${l.kind}.`);
        return;
      }
      i("error", ""), !y(v, d) && (d = v, i("change", v));
    }
    return (f, v) => (u(), p("textarea", {
      class: "sf-input sf-textarea sf-structured",
      rows: s.rows,
      value: E.value,
      spellcheck: "false",
      onInput: v[0] || (v[0] = (b) => g(b.target.value))
    }, null, 40, ue));
  }
});
function z(s, a, l) {
  if (a == null || a === "" && l) return l ? "A value is required." : "";
  if (s.enum) return s.enum.some((i) => i === a) ? "" : "Choose one of the available values.";
  switch (s.type) {
    case "integer":
    case "number":
      return typeof a != "number" || !Number.isFinite(a) || s.type === "integer" && !Number.isInteger(a) ? s.type === "integer" ? "Enter a whole number." : "Enter a number." : s.minimum !== void 0 && a < s.minimum ? `Enter at least ${s.minimum}.` : s.maximum !== void 0 && a > s.maximum ? `Enter at most ${s.maximum}.` : "";
    case "boolean":
      return typeof a == "boolean" ? "" : "Choose on or off.";
    case "array":
      if (!Array.isArray(a)) return "Enter a JSON array.";
      if (s.minItems !== void 0 && a.length < s.minItems) return `Use at least ${s.minItems} entries.`;
      if (s.maxItems !== void 0 && a.length > s.maxItems) return `Use at most ${s.maxItems} entries.`;
      if (s.uniqueItems && a.some((i, h) => a.slice(0, h).some((m) => y(i, m))))
        return "Remove duplicate entries.";
      if (s.items)
        for (const [i, h] of a.entries()) {
          const m = z(s.items, h, !0);
          if (m) return `Entry ${i + 1}: ${m}`;
        }
      return "";
    case "object":
      return typeof a == "object" && !Array.isArray(a) ? "" : "Enter a JSON object.";
  }
  if (typeof a != "string") return "Enter text.";
  if (s.minLength !== void 0 && a.length < s.minLength) return `Enter at least ${s.minLength} characters.`;
  if (s.maxLength !== void 0 && a.length > s.maxLength) return `Enter at most ${s.maxLength} characters.`;
  if (s.pattern)
    try {
      if (!new RegExp(s.pattern).test(a)) return "Use the required format.";
    } catch {
      return "The declared format is unavailable.";
    }
  if (s.format === "date" && a) {
    const i = /* @__PURE__ */ new Date(a + "T00:00:00Z");
    if (!Number.isFinite(i.getTime()) || i.toISOString().split("T")[0] !== a) return "Enter a valid date.";
  }
  return "";
}
const le = {
  key: 0,
  class: "sf-advanced-summary"
}, me = {
  key: 0,
  class: "sf-req",
  "aria-hidden": "true"
}, de = ["value", "onChange"], pe = {
  key: 0,
  value: ""
}, fe = ["value"], ve = ["minlength", "maxlength", "rows", "value", "onInput"], he = ["checked", "onChange"], ge = ["min", "max", "step", "value", "onInput"], be = ["type", "minlength", "maxlength", "value", "onInput"], ye = ["id"], _e = ["id"], Ie = /* @__PURE__ */ P({
  __name: "SchemaForm",
  setup(s) {
    const a = se(), l = oe(), i = I(() => {
      const e = a.value.schema;
      if (typeof e == "string")
        try {
          return JSON.parse(e);
        } catch {
          return {};
        }
      return e || {};
    }), h = I(() => Object.entries(i.value.properties || {})), m = I(() => [
      { advanced: !1, fields: h.value.filter(([, e]) => e.group !== "advanced") },
      { advanced: !0, fields: h.value.filter(([, e]) => e.group === "advanced") }
    ].filter((e) => e.fields.length)), _ = Y(), S = I(() => new Map(h.value.map(([e], r) => [e, r]))), E = q(), d = q({}), g = q(/* @__PURE__ */ new Map()), f = I(() => new Set(i.value.required || []));
    V(() => a.value.config, (e) => {
      const r = { ...e };
      for (const o of g.value.keys())
        y(r[o], d.value[o]) || g.value.delete(o);
      d.value = r;
    }, { immediate: !0, flush: "sync" }), V(() => a.value.schema, (e, r) => {
      y(e, r) || g.value.clear();
    });
    function v(e, r) {
      return (Object.hasOwn(d.value, e) ? d.value[e] : void 0) ?? r.default;
    }
    const b = I(() => {
      const e = /* @__PURE__ */ new Map(), r = a.value.fieldErrors ?? {};
      for (const { fields: o } of m.value)
        for (const [n, t] of o) {
          const c = a.value.allowUnset && (!Object.hasOwn(d.value, n) || d.value[n] == null), N = g.value.get(n) || Object.hasOwn(r, n) && r[n] || (c ? "" : z(t, v(n, t), J(n, t)));
          N && e.set(n, N);
        }
      return e;
    });
    ee(() => {
      V(() => Object.fromEntries(b.value), (e, r) => {
        y(e, r) || l("validity-changed", { valid: !b.value.size, errors: e });
      }, { immediate: !0, flush: "post" });
    });
    function j(e, r) {
      if (a.value.allowUnset && r === "" && (r = void 0), y(d.value[e], r)) return;
      const o = { ...d.value, [e]: r };
      r === void 0 && a.value.allowUnset && delete o[e], d.value = o, l("config-changed", o);
    }
    function k(e, r, o = !1) {
      if (r.validity.badInput) {
        g.value.set(e, o ? "Enter a number." : "Enter a valid date.");
        return;
      }
      g.value.delete(e), j(e, o ? r.value === "" ? void 0 : Number(r.value) : r.value);
    }
    function x(e) {
      return _ + "-field-" + S.value.get(e);
    }
    function w(e, r) {
      const o = x(e), n = [r.description ? o + "-help" : "", b.value.has(e) ? o + "-error" : ""].filter(Boolean);
      return {
        id: o,
        "aria-describedby": n.join(" ") || void 0,
        "aria-invalid": b.value.has(e) ? !0 : void 0,
        "aria-required": !a.value.allowUnset && J(e, r) ? !0 : void 0
      };
    }
    function F(e) {
      const r = b.value.keys().next().value;
      if (r === void 0) return;
      e?.preventDefault();
      const n = E.value?.getRootNode()?.getElementById(x(r)), t = n?.closest("details");
      t && (t.open = !0), n?.focus();
    }
    function Z(e) {
      return e.format === "password" ? "password" : e.format === "date" ? "date" : "text";
    }
    function J(e, r) {
      return f.value.has(e) || r.required === !0;
    }
    function M(e) {
      const r = Number(e.rows);
      return Number.isFinite(r) && r >= 1 ? Math.floor(r) : 4;
    }
    function C(e) {
      const r = typeof e.picker == "string" ? e.picker.trim() : "";
      return r === "wc-schema-form" ? "" : r;
    }
    function G(e, r) {
      return { properties: { [e]: r } };
    }
    function H(e) {
      return {
        ...e.class ? { thread_class: e.class } : {},
        ...e.title ? { title: e.title } : {}
      };
    }
    function K(e) {
      return typeof e.provider == "string" ? e.provider.trim() : "";
    }
    function Q(e) {
      return typeof e.title == "string" ? e.title.trim() : "";
    }
    function W(e) {
      return i.value.properties?.[e]?.value_field ? { [e]: d.value[e] } : { thread_id: d.value[e] ?? "" };
    }
    function X(e, r) {
      if (r && typeof r == "object") {
        const o = r;
        return o[e] ?? o.thread_id ?? o.id ?? o.value ?? "";
      }
      return r ?? "";
    }
    return (e, r) => (u(), p("form", {
      ref_key: "form",
      ref: E,
      class: "sf",
      novalidate: "",
      onSubmit: r[0] || (r[0] = te((o) => F(), ["prevent"])),
      onSchemaFormReport: F
    }, [
      (u(!0), p(T, null, U(m.value, (o) => (u(), $(B(o.advanced ? "details" : "div"), {
        key: String(o.advanced),
        class: R(o.advanced ? "sf-advanced" : "sf-primary")
      }, {
        default: D(() => [
          o.advanced ? (u(), p("summary", le, "Advanced")) : A("", !0),
          re("div", {
            class: R(o.advanced ? "sf-advanced-body" : "sf-primary")
          }, [
            (u(!0), p(T, null, U(o.fields, ([n, t]) => (u(), p("div", {
              key: n,
              class: "sf-field"
            }, [
              (u(), $(B(C(t) ? "span" : "label"), {
                id: x(n) + "-label",
                for: C(t) ? void 0 : x(n),
                class: "sf-lbl"
              }, {
                default: D(() => [
                  ne(L(t.title || n), 1),
                  !ae(a).allowUnset && J(n, t) ? (u(), p("span", me, " *")) : A("", !0)
                ]),
                _: 2
              }, 1032, ["id", "for"])),
              C(t) ? (u(), $(ie, {
                key: 0,
                tag: C(t),
                schema: G(n, t),
                config: W(n),
                meta: H(t),
                provider: K(t),
                label: Q(t),
                attrs: { ...w(n, t), "aria-labelledby": x(n) + "-label", role: "group", tabindex: -1 },
                onChange: (c) => j(n, X(n, c))
              }, null, 8, ["tag", "schema", "config", "meta", "provider", "label", "attrs", "onChange"])) : t.enum ? (u(), p("select", O({
                key: 1,
                ref_for: !0
              }, w(n, t), {
                class: "sf-input",
                value: v(n, t) ?? "",
                onChange: (c) => j(n, t.enum[c.target.selectedIndex - (t.enum.includes("") ? 0 : 1)])
              }), [
                t.enum.includes("") ? A("", !0) : (u(), p("option", pe, "Choose a value")),
                (u(!0), p(T, null, U(t.enum, (c, N) => (u(), p("option", {
                  key: N,
                  value: c
                }, L(c), 9, fe))), 128))
              ], 16, de)) : t.format === "textarea" ? (u(), p("textarea", O({
                key: 2,
                ref_for: !0
              }, w(n, t), {
                class: "sf-input sf-textarea",
                minlength: t.minLength,
                maxlength: t.maxLength,
                rows: M(t),
                value: String(v(n, t) ?? ""),
                onInput: (c) => k(n, c.target)
              }), null, 16, ve)) : t.type === "object" || t.type === "array" ? (u(), $(ce, O({
                key: 3,
                ref_for: !0
              }, w(n, t), {
                value: d.value[n],
                fallback: t.default,
                kind: t.type,
                rows: M(t),
                onChange: (c) => j(n, c),
                onError: (c) => g.value.set(n, c)
              }), null, 16, ["value", "fallback", "kind", "rows", "onChange", "onError"])) : t.type === "boolean" ? (u(), p("input", O({
                key: 4,
                ref_for: !0
              }, w(n, t), {
                class: "sf-check",
                type: "checkbox",
                checked: !!v(n, t),
                onChange: (c) => j(n, c.target.checked)
              }), null, 16, he)) : t.type === "number" || t.type === "integer" ? (u(), p("input", O({
                key: 5,
                ref_for: !0
              }, w(n, t), {
                class: "sf-input",
                type: "number",
                min: t.minimum,
                max: t.maximum,
                step: t.type === "integer" ? 1 : "any",
                value: v(n, t) ?? "",
                onInput: (c) => k(n, c.target, !0)
              }), null, 16, ge)) : (u(), p("input", O({
                key: 6,
                ref_for: !0
              }, w(n, t), {
                class: "sf-input",
                type: Z(t),
                minlength: t.minLength,
                maxlength: t.maxLength,
                value: v(n, t) ?? "",
                onInput: (c) => k(n, c.target)
              }), null, 16, be)),
              t.description ? (u(), p("span", {
                key: 7,
                id: x(n) + "-help",
                class: "sf-hint"
              }, L(t.description), 9, ye)) : A("", !0),
              b.value.get(n) ? (u(), p("span", {
                key: 8,
                id: x(n) + "-error",
                class: "sf-error",
                role: "alert"
              }, L(b.value.get(n)), 9, _e)) : A("", !0)
            ]))), 128))
          ], 2)
        ]),
        _: 2
      }, 1032, ["class"]))), 128))
    ], 544));
  }
});
export {
  Ie as default
};
//# sourceMappingURL=SchemaForm-D1ibYAdM.js.map
