import { u as _, W as k } from "./wc-runtime-soyJW63L.js";
import { defineComponent as x, ref as u, onMounted as C, watch as w, onBeforeUnmount as b, openBlock as l, createElementBlock as d, createVNode as f, unref as m, createElementVNode as p, toDisplayString as L, createCommentVNode as U } from "vue";
import { Icon as h } from "@iconify/vue";
import { api as D, define as E } from "@wippy-fe/proxy";
import { s as N } from "./styles-HTuIrRec.js";
const R = ["http", "https", "mailto"];
function S(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (!(!t || t.startsWith("//") || /[\u0000-\u001f\u007f\\]/.test(t)))
    try {
      const o = new URL(t, "https://document.invalid/").protocol;
      if (R.includes(o.slice(0, -1))) return t;
    } catch {
      return;
    }
}
function W(e, t, o) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || (e.preventDefault(), !t)) return;
  let r = t;
  try {
    r = decodeURIComponent(t);
  } catch {
  }
  o.querySelector(`#${CSS.escape(r)}`)?.scrollIntoView();
}
function H(e, t) {
  return (o) => {
    if (typeof o == "string" || o instanceof Node || o.tagName !== "a") return e(o);
    const r = S(o.href), n = e({ ...o, href: r });
    return r?.startsWith("#") && n instanceof HTMLAnchorElement && n.addEventListener("click", (a) => W(a, r.slice(1), t)), n;
  };
}
const K = { class: "docxv" }, T = {
  key: 0,
  class: "rv-state"
}, V = {
  key: 1,
  class: "rv-state err"
}, B = /* @__PURE__ */ x({
  __name: "RenderDocx",
  setup(e) {
    const t = _(), o = u(!1), r = u(""), n = u(null);
    async function a() {
      r.value = "";
      const c = t.value?.sourceUrl, s = n.value;
      if (s && (s.innerHTML = ""), !(!c || !s)) {
        o.value = !0;
        try {
          const { defaultOptions: i, renderAsync: v } = await import("./docx-preview-Bulzlcpk.js"), { data: g } = await D.get(c, { responseType: "blob" });
          await v(g, s, void 0, {
            className: "docx",
            inWrapper: !0,
            ignoreWidth: !1,
            ignoreHeight: !1,
            breakPages: !0,
            experimental: !0,
            h: H(i.h, s)
          });
        } catch (i) {
          r.value = i?.response?.data?.error || i?.message || "could not render document";
        } finally {
          o.value = !1;
        }
      }
    }
    return C(a), w(() => t.value?.sourceUrl, a), b(() => {
      n.value && (n.value.innerHTML = "");
    }), (c, s) => (l(), d("div", K, [
      o.value ? (l(), d("div", T, [
        f(m(h), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        s[0] || (s[0] = p("span", null, "Rendering document…", -1))
      ])) : r.value ? (l(), d("div", V, [
        f(m(h), {
          icon: "tabler:alert-circle",
          "aria-hidden": "true"
        }),
        p("span", null, L(r.value), 1)
      ])) : U("", !0),
      p("div", {
        ref_key: "host",
        ref: n,
        class: "docxv-host"
      }, null, 512)
    ]));
  }
}), M = {
  type: "object",
  properties: {
    "source-url": { type: "string", default: "", description: "URL to fetch the .docx bytes from (auth via proxy)." }
  }
};
class y extends k {
  static get wippyConfig() {
    return {
      propsSchema: M,
      hostCssKeys: ["themeConfigUrl"],
      inlineCss: N
    };
  }
  static get vueConfig() {
    return { rootComponent: B };
  }
}
async function F() {
  return y;
}
E(import.meta.url, y);
export {
  S as a,
  R as d,
  F as w
};
//# sourceMappingURL=render-docx-D1Y2cSWP.js.map
