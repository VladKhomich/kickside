import { a as te, u as ae, b as se, W as ie } from "./wc-runtime-BJD-5iaH.js";
import { P as le } from "./primevue-plugin-CaP7wV_M.js";
import { defineComponent as ne, ref as p, computed as oe, onMounted as re, onBeforeUnmount as ce, withDirectives as ue, openBlock as S, createElementBlock as A, createElementVNode as i, createVNode as I, unref as m, withCtx as F, toDisplayString as w, normalizeClass as L, createTextVNode as G, createCommentVNode as $, vShow as fe } from "vue";
import { Icon as E } from "@iconify/vue";
import { on as H, define as de } from "@wippy-fe/proxy";
import ve from "primevue/select";
import { a as y } from "./artifactPresentation-Dgf5Fs_k.js";
import { s as K, a as pe, l as me, e as ye, b as be, A as he } from "./hostRoute-CHFKAd6h.js";
import { u as ke } from "./useHostRoute-BCkMq4pd.js";
import { u as _e } from "./useSessionsApi-BQAm970o.js";
import { s as xe } from "./styles-BfuGB-97.js";
const Ce = {
  class: "kx-artifact-panel",
  "aria-label": "Artifact preview"
}, we = { class: "kx-artifact-panel-head" }, ge = { class: "kx-artifact-panel-title" }, Se = { class: "kx-artifact-select-option" }, Ae = { class: "kx-artifact-select-option-title" }, Ie = { class: "kx-artifact-select-option-sub" }, Te = { class: "kx-artifact-panel-actions" }, Ee = ["disabled"], Ve = ["disabled"], Pe = {
  key: 0,
  class: "kx-artifact-panel-error",
  role: "alert"
}, Le = ["disabled"], Ne = {
  class: "sr-only",
  "aria-live": "polite"
}, Re = {
  key: 1,
  class: "kx-artifact-panel-body"
}, Ue = ["id"], je = {
  key: 2,
  class: "kx-artifact-panel-empty"
}, qe = /* @__PURE__ */ ne({
  __name: "ArtifactPanel",
  setup(W) {
    const V = _e(), N = te(), R = ae(), u = p([]), a = p(""), U = ke(R, (e) => B(K(e))), c = p(K(U.initialPath)), f = p(!!c.value), o = p(""), l = p(""), v = p(!1), T = [], P = /* @__PURE__ */ new Set();
    let d = null, b = 0, h = 0, k = "";
    const _ = oe(() => u.value.find((e) => y(e) === a.value));
    async function j() {
      const e = c.value, t = ++b;
      if (!e) {
        u.value = [], a.value = "", f.value = !1, l.value = "";
        return;
      }
      f.value = !0, l.value = "";
      try {
        const s = await V.artifacts({ sessionId: e, limit: 100 });
        if (t !== b || e !== c.value) return;
        const r = _.value, n = s.artifacts.filter((C) => !C.session_id || C.session_id === e), x = r?.session_id === e && !n.some((C) => y(C) === a.value) ? [r, ...n] : n;
        u.value = x, !x.some((C) => y(C) === a.value) && !k && (a.value = x[0] ? y(x[0]) : "");
      } catch (s) {
        if (t !== b || e !== c.value) return;
        a.value || (l.value = s.message || "Could not load artifacts");
      } finally {
        t === b && (f.value = !1);
      }
    }
    function g() {
      c.value && (d && clearTimeout(d), d = setTimeout(() => {
        j();
      }, 150));
    }
    async function q(e) {
      if (!e) return;
      const t = c.value;
      if (!t) return;
      if (v.value = !1, l.value = "", u.value.some((n) => y(n) === e)) {
        h++, k = "", a.value = e;
        return;
      }
      if (P.has(e)) return;
      const s = ++h;
      k = e;
      const r = a.value;
      a.value = "", P.add(e);
      try {
        const n = await V.artifact(e);
        if (s !== h || t !== c.value) {
          a.value || (a.value = r);
          return;
        }
        if (n.session_id && n.session_id !== t) {
          a.value = r;
          return;
        }
        u.value = [n, ...u.value.filter((x) => y(x) !== e)], a.value = e;
      } catch (n) {
        s === h && (a.value || (a.value = r), l.value = n.message || "Could not load artifact details");
      } finally {
        P.delete(e), k === e && (k = "");
      }
    }
    function B(e) {
      e !== c.value && (c.value = e, b++, h++, d && (clearTimeout(d), d = null), u.value = [], a.value = "", k = "", v.value = !1, l.value = "", f.value = !!e, e && g());
    }
    function z(e) {
      if (e.channel === "kickside:artifact-session") {
        if (!pe(e.sourcePanelId, me(R), U.hostPath())) return;
        B(ye(e.payload));
        return;
      }
      if (e.channel !== "kickside:artifact-open") return;
      const t = be(e.payload);
      t && (q(t), g());
    }
    function M(e) {
      if (!e) return "Generation time unavailable";
      const t = new Date(e);
      return Number.isNaN(t.getTime()) ? "Generation time unavailable" : `Generated ${new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(t)}`;
    }
    function J(e) {
      const t = String(e || "").toLowerCase();
      return t.includes("markdown") ? "md" : t.includes("html") ? "html" : t.includes("json") ? "json" : t.includes("javascript") ? "js" : t.includes("css") ? "css" : "txt";
    }
    function Q(e) {
      return `${String(e || "artifact").trim().replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "-").replace(/[. ]+$/g, "") || "artifact"}.${J(_.value?.content_type)}`;
    }
    async function D() {
      if (!a.value) throw new Error("Select an artifact first");
      return V.artifactContent(a.value);
    }
    async function X() {
      o.value = "copy", l.value = "";
      try {
        await navigator.clipboard.writeText(await D()), v.value = !0, window.setTimeout(() => {
          v.value = !1;
        }, 1600);
      } catch (e) {
        l.value = e.message || "Could not copy artifact";
      } finally {
        o.value = "";
      }
    }
    async function Y() {
      o.value = "save", l.value = "";
      try {
        const e = await D(), t = new Blob([e], { type: _.value?.content_type || "text/plain;charset=utf-8" }), s = URL.createObjectURL(t), r = document.createElement("a");
        r.href = s, r.download = Q(_.value?.title), r.click(), URL.revokeObjectURL(s);
      } catch (e) {
        l.value = e.message || "Could not save artifact";
      } finally {
        o.value = "";
      }
    }
    function Z() {
      N?.broadcast("kickside:artifact-close", { panelId: he });
    }
    const ee = se(g);
    return re(() => {
      const e = N?.subscribe(z);
      e && T.push(e), T.push(H("artifact:*", g)), T.push(H("session:*", g));
    }), ce(() => {
      T.forEach((e) => e()), b++, h++, d && clearTimeout(d);
    }), (e, t) => ue((S(), A("section", Ce, [
      i("header", we, [
        i("div", ge, [
          t[2] || (t[2] = i("label", {
            class: "sr-only",
            for: "artifact-panel-selector"
          }, "Artifact", -1)),
          I(m(ve), {
            "input-id": "artifact-panel-selector",
            modelValue: a.value,
            "onUpdate:modelValue": [
              t[0] || (t[0] = (s) => a.value = s),
              t[1] || (t[1] = (s) => q(s))
            ],
            class: "kx-artifact-panel-select",
            "overlay-class": "kx-artifact-panel-select-overlay",
            options: u.value,
            "option-label": "title",
            "option-value": m(y),
            placeholder: f.value ? "Loading artifacts…" : "Select an artifact",
            disabled: f.value
          }, {
            value: F(() => [
              i("span", {
                class: L(["kx-artifact-select-value", { "is-placeholder": !_.value }])
              }, w(_.value?.title || (f.value ? "Loading artifacts…" : "Select an artifact")), 3)
            ]),
            option: F(({ option: s }) => [
              i("span", Se, [
                i("span", Ae, w(s.title || "Untitled artifact"), 1),
                i("span", Ie, w(M(s.created_at)), 1)
              ])
            ]),
            _: 1
          }, 8, ["modelValue", "options", "option-value", "placeholder", "disabled"])
        ]),
        i("div", Te, [
          i("button", {
            type: "button",
            class: "kx-panel-action",
            disabled: !a.value || !!o.value,
            onClick: X
          }, [
            I(m(E), {
              icon: o.value === "copy" ? "tabler:loader-2" : v.value ? "tabler:check" : "tabler:copy",
              class: L({ spin: o.value === "copy" }),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            G(" " + w(v.value ? "Copied" : "Copy"), 1)
          ], 8, Ee),
          i("button", {
            type: "button",
            class: "kx-panel-action",
            disabled: !a.value || !!o.value,
            onClick: Y
          }, [
            I(m(E), {
              icon: o.value === "save" ? "tabler:loader-2" : "tabler:download",
              class: L({ spin: o.value === "save" }),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            t[3] || (t[3] = G(" Save ", -1))
          ], 8, Ve),
          i("button", {
            type: "button",
            class: "kx-panel-close",
            "aria-label": "Close artifact panel",
            onClick: Z
          }, [
            I(m(E), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ])
      ]),
      l.value ? (S(), A("div", Pe, [
        i("span", null, w(l.value), 1),
        a.value ? $("", !0) : (S(), A("button", {
          key: 0,
          type: "button",
          class: "kx-artifact-panel-retry",
          disabled: f.value,
          onClick: j
        }, "Retry", 8, Le))
      ])) : $("", !0),
      i("span", Ne, w(v.value ? "Artifact copied to clipboard" : ""), 1),
      a.value ? (S(), A("div", Re, [
        i("w-artifact", { id: a.value }, null, 8, Ue)
      ])) : (S(), A("div", je, [
        I(m(E), {
          icon: "tabler:file-description",
          "aria-hidden": "true"
        }),
        t[4] || (t[4] = i("span", null, "Select an artifact to preview it.", -1))
      ]))
    ], 512)), [
      [fe, m(ee) !== !1]
    ]);
  }
});
class O extends ie {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: xe
    };
  }
  static get vueConfig() {
    return { rootComponent: qe, plugins: [le] };
  }
}
async function Qe() {
  return O;
}
de(import.meta.url, O);
export {
  Qe as webComponent
};
//# sourceMappingURL=artifact_panel.js.map
