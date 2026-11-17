import { defineComponent as Ie, ref as $, computed as p, onMounted as xe, openBlock as a, createElementBlock as l, unref as n, createBlock as j, withCtx as Z, createTextVNode as q, toDisplayString as k, createCommentVNode as M, Fragment as P, createVNode as m, createElementVNode as s, renderList as G, normalizeClass as Ae } from "vue";
import { Icon as V } from "@iconify/vue";
import { u as Ve } from "./wc-runtime-CHL0PH8L.js";
import { u as Oe, j as Fe, k as ve, l as Te, n as Be, p as Le, a as Re, b as ze, _ as pe, m as Ue } from "./useModelsApi-BP0pW0Lf.js";
import { d as je, i as qe, c as Ge, a as be, _ as He } from "./ProviderProfileEditor.vue_vue_type_script_setup_true_lang-CIcOG-gh.js";
const Ke = () => Ve();
function We(O, h, u) {
  const D = O.filter((c) => c.enabled !== !1 && c.status !== "unhealthy");
  if (!D.length) return null;
  const I = u.find((c) => c.declared && c.name === "fast")?.models?.[0]?.name;
  if (!I) return null;
  const i = h.find((c) => c.name === I && c.enabled !== !1 && !Ye(c));
  if (!i) return null;
  const f = i.provider_profile_id ? D.find((c) => c.id === i.provider_profile_id) : D.find((c) => !!i.provider_id && c.provider_id === i.provider_id);
  return !f || i.provider_id && i.provider_id !== f.provider_id ? null : {
    class: "fast",
    model: i.name,
    title: i.title || i.name,
    provider_id: i.provider_id || f.provider_id
  };
}
function Ye(O) {
  const h = (O.capabilities ?? []).map((u) => u.toLowerCase());
  return h.length > 0 && h.every((u) => u === "embed" || u === "embedding" || u === "embeddings");
}
const Je = { class: "ob" }, Qe = {
  key: 0,
  class: "ob-model-warning",
  role: "note"
}, Xe = {
  key: 1,
  class: "ob-stage"
}, Ze = { class: "ob-grid" }, et = ["onClick"], tt = { class: "ob-tile-ico" }, ot = { class: "ob-tile-name" }, st = {
  key: 0,
  class: "ob-tile-desc"
}, nt = { class: "ob-foot" }, at = {
  key: 2,
  class: "ob-stage"
}, lt = {
  key: 0,
  class: "ob-connecting"
}, it = {
  key: 2,
  class: "ob-result fail"
}, rt = {
  key: 3,
  class: "ob-stage"
}, dt = { class: "km-editor-head-title" }, ut = {
  key: 4,
  class: "ob-stage"
}, ct = {
  key: 0,
  class: "ob-result fail"
}, vt = { class: "ob-block" }, pt = { class: "ob-block-head" }, bt = { class: "ob-providers" }, mt = { class: "ob-prov-body" }, ft = { class: "ob-prov-name" }, gt = { class: "ob-prov-sub" }, _t = ["title"], kt = {
  key: 1,
  class: "ob-block"
}, yt = {
  key: 2,
  class: "ob-autobar"
}, ht = { class: "ob-block-head" }, Ct = { class: "ob-classes" }, wt = ["title"], Mt = { class: "ob-class-top" }, St = { class: "ob-class-ico" }, Nt = { class: "ob-class-name" }, Et = { class: "ob-foot" }, $t = ["disabled"], Pt = "kickside-model-provider-openai-compatible", Dt = "wippy.llm.openai_compat:provider", Ft = /* @__PURE__ */ Ie({
  __name: "Onboard",
  setup(O) {
    const h = Ke(), u = Oe(), { adapters: D, presets: I, profiles: i, models: f, classes: c, loading: me, saving: F, error: x } = u, ee = Ue(() => D.value, () => i.value, () => I.value), g = $("pick"), S = $(null), y = $(null), N = $(""), C = $(""), E = $(!1), fe = p(() => I.value.filter((e) => e.onboarding !== !1)), ge = p(() => S.value?.provider_id || Dt), H = p(() => ee.adapterFor(ge.value)), K = p(
      () => S.value?.profile_editor_tag || H.value?.profile_editor_tag || Pt
    ), _e = p(() => je(K.value)), ke = p(() => qe(K.value));
    function W(e, t) {
      return (e.capabilities ?? []).some((o) => o.toLowerCase() === t);
    }
    function ye(e) {
      const t = (e.capabilities ?? []).map((o) => o.toLowerCase());
      return t.length > 0 && t.every((o) => o === "embed" || o === "embedding" || o === "embeddings");
    }
    const T = p(() => f.value.filter((e) => e.enabled !== !1 && !ye(e))), te = p(() => f.value.filter((e) => e.enabled !== !1 && (W(e, "embed") || W(e, "embedding") || W(e, "embeddings")))), Y = p(() => f.value.filter((e) => e.source === "discovered" && e.enabled === !1)), B = p(() => c.value.filter((e) => e.declared && e.capability !== "embed")), oe = p(() => c.value.filter((e) => e.declared && e.capability === "embed"));
    function L(e) {
      return c.value.find((t) => t.name === e)?.models?.[0]?.name ?? "";
    }
    function se(e) {
      return e.map((t) => ({ label: t.title || t.name, value: t.name }));
    }
    function he(e) {
      y.value = Y.value.find((t) => t.name === e) ?? null;
    }
    async function Ce(e) {
      await u.saveCard(e) && (await u.loadClasses(), await U(!1), y.value = null);
    }
    const ne = p(() => [
      { key: "generate", title: "Default model per capability", classes: B.value, models: T.value },
      { key: "embed", title: "Embeddings", classes: oe.value, models: te.value }
    ].filter((e) => e.classes.length)), J = p(() => We(i.value, f.value, c.value)), R = p(() => J.value !== null);
    function ae() {
      h("done", {
        status: R.value ? "completed" : "skipped",
        model_configured: R.value,
        ...J.value ? { model: J.value } : {}
      });
    }
    function le() {
      ae();
    }
    function ie(e) {
      C.value = e, x.value = "";
    }
    function re() {
      S.value = null, N.value = "", C.value = "", g.value = "pick";
    }
    function we(e) {
      S.value = e, C.value = "", g.value = "connect";
    }
    function de() {
      i.value.length ? g.value = "review" : re();
    }
    async function ue(e) {
      if (!E.value) {
        E.value = !0, C.value = "";
        try {
          e.enabled = !0;
          const t = new Set(i.value.map((d) => d.id));
          if (N.value = "Saving connection…", !await u.saveProfile("create", "", e)) {
            ie(x.value || "Could not save the connection.");
            return;
          }
          const r = i.value.find((d) => !t.has(d.id));
          if (r) {
            N.value = "Verifying key and importing models…";
            const d = await u.discover(r.id);
            await u.loadClasses(), d.ok ? (N.value = "Selecting sensible defaults…", await U(!1)) : ie(d.message);
          }
          g.value = "review";
        } finally {
          E.value = !1, N.value = "";
        }
      }
    }
    function Me(e, t, o) {
      return {
        name: e.name,
        title: e.title || e.name,
        description: e.description || "",
        provider_id: e.provider_id,
        provider_profile_id: e.provider_profile_id || void 0,
        provider_model: e.provider_model || e.name,
        capabilities: [...e.capabilities ?? []],
        classes: t,
        priority: o,
        max_tokens: Number(e.max_tokens ?? 0),
        output_tokens: Number(e.output_tokens ?? 0),
        dimensions: Number(e.dimensions ?? 0),
        pricing: e.pricing ?? {},
        options: e.options ?? {},
        metadata: e.metadata ?? {},
        source: e.source === "registry" ? "overlay" : e.source || "overlay"
      };
    }
    async function ce(e) {
      const t = /* @__PURE__ */ new Map();
      for (const v of e) v.model && t.set(v.cls, v.model);
      if (!t.size) return;
      const o = new Set(t.keys()), r = /* @__PURE__ */ new Map();
      for (const v of f.value) {
        const _ = new Set(v.class ?? []);
        for (const w of o) _.delete(w);
        r.set(v.name, _);
      }
      for (const [v, _] of t) r.get(_)?.add(v);
      const d = new Set(t.values()), b = [];
      for (const v of f.value) {
        const _ = new Set(v.class ?? []), w = r.get(v.name);
        if (_.size === w.size && [...w].every((X) => _.has(X))) continue;
        const A = d.has(v.name) ? 1e3 : Number(v.priority ?? 10);
        b.push(Me(v, [...w], A));
      }
      b.length && (await u.saveCards(b), await u.loadClasses());
    }
    async function Se(e, t) {
      t && await ce([{ cls: e, model: t }]);
    }
    const Ne = /* @__PURE__ */ new Set([
      "wippy.llm.openai:provider",
      "wippy.llm.claude:provider",
      "wippy.llm.google.generative_ai:provider",
      "wippy.llm.google.vertex:provider",
      "wippy.llm.bedrock:provider"
    ]);
    function Q(e) {
      return Ne.has(e.provider_id || "");
    }
    const Ee = /embed|whisper|tts|audio|image|imagen|dall-?e|lyria|veo|sora|music|\baqa\b|moderation|rerank|guard|realtime|transcribe|speech|\bsearch\b|vision-?only/i;
    function z(e) {
      const t = e.pricing, o = Number(t?.completion ?? t?.output ?? t?.prompt ?? 0);
      return Number.isFinite(o) && o > 0 ? o : (Number(e.max_tokens) || 0) / 1e6;
    }
    function $e() {
      const e = T.value.filter((o) => !Ee.test(o.name)), t = e.filter(Q);
      return t.length ? t : e.length ? e : T.value;
    }
    function Pe(e) {
      const t = /* @__PURE__ */ new Map(), o = $e();
      if (!o.length || !e.length) return t;
      const r = [...o].sort((b, v) => z(b) - z(v)), d = r.length - 1;
      return e.forEach((b, v) => {
        const _ = o.filter((A) => (A.class ?? []).includes(b.name)).sort((A, X) => z(X) - z(A));
        if (_.length) {
          t.set(b.name, _[0].name);
          return;
        }
        const w = e.length <= 1 ? d : Math.round(v * d / (e.length - 1));
        t.set(b.name, r[Math.min(w, d)].name);
      }), t;
    }
    function De() {
      return [...te.value].sort((t, o) => (Q(o) ? 1 : 0) - (Q(t) ? 1 : 0) || (Number(o.dimensions) || 0) - (Number(t.dimensions) || 0))[0]?.name || "";
    }
    async function U(e = !1) {
      const t = [], o = Pe(B.value);
      for (const d of B.value) {
        if (!e && L(d.name)) continue;
        const b = o.get(d.name);
        b && t.push({ cls: d.name, model: b });
      }
      const r = De();
      for (const d of oe.value)
        !e && L(d.name) || r && t.push({ cls: d.name, model: r });
      await ce(t);
    }
    return xe(async () => {
      await Promise.all([u.load(), u.loadClasses()]), g.value = i.value.length ? "review" : "pick", i.value.length && T.value.length && B.value.every((e) => !L(e.name)) && await U(!1);
    }), (e, t) => (a(), l("div", Je, [
      n(x) && g.value !== "connect" ? (a(), j(n(Fe), {
        key: 0,
        severity: "danger",
        onDismiss: t[0] || (t[0] = (o) => x.value = "")
      }, {
        default: Z(() => [
          q(k(n(x)), 1)
        ]),
        _: 1
      })) : M("", !0),
      n(me) && !n(i).length && !n(f).length ? (a(), j(n(ve), {
        key: 1,
        label: "Loading…"
      })) : (a(), l(P, { key: 2 }, [
        g.value === "pick" && !R.value ? (a(), l("div", Qe, [
          m(n(V), {
            icon: "tabler:brain",
            "aria-hidden": "true"
          }),
          t[6] || (t[6] = s("span", null, [
            s("strong", null, "KickSide works without an AI model, but it is better with one."),
            q(" Recommendations and AI-powered automations will be unavailable until you connect a provider. You can skip this step and finish it later under System → Models.")
          ], -1))
        ])) : M("", !0),
        g.value === "pick" ? (a(), l("section", Xe, [
          s("div", Ze, [
            (a(!0), l(P, null, G(fe.value, (o) => (a(), l("button", {
              key: o.id,
              type: "button",
              class: "ob-tile",
              onClick: (r) => we(o)
            }, [
              s("span", tt, [
                m(n(V), {
                  icon: o.icon || "tabler:plug",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              s("span", ot, k(o.title), 1),
              o.description ? (a(), l("span", st, k(o.description), 1)) : M("", !0)
            ], 8, et))), 128))
          ]),
          s("div", nt, [
            s("button", {
              type: "button",
              class: "ob-btn ob-ghost",
              onClick: t[1] || (t[1] = (o) => n(h)("back", void 0))
            }, "‹ Back"),
            t[7] || (t[7] = s("span", { class: "ob-foot-sp" }, null, -1)),
            n(i).length ? (a(), l("button", {
              key: 0,
              type: "button",
              class: "ob-btn ob-ghost",
              onClick: t[2] || (t[2] = (o) => g.value = "review")
            }, "Skip — already connected")) : (a(), l("button", {
              key: 1,
              type: "button",
              class: "ob-btn ob-ghost",
              onClick: le
            }, "Skip for now"))
          ])
        ])) : g.value === "connect" ? (a(), l("section", at, [
          E.value ? (a(), l("div", lt, [
            m(n(ve), {
              label: N.value || "Connecting…"
            }, null, 8, ["label"]),
            t[8] || (t[8] = s("p", { class: "ob-connecting-note" }, "Importing the provider's models — this can take up to a minute. Please don't close this.", -1))
          ])) : (a(), l(P, { key: 1 }, [
            ke.value ? (a(), j(Ge, {
              key: 0,
              "spec-key": _e.value.key,
              preset: S.value || void 0,
              adapter: H.value || void 0,
              mode: "create",
              saving: E.value,
              onSave: ue,
              onCancel: de
            }, null, 8, ["spec-key", "preset", "adapter", "saving"])) : (a(), j(Te, {
              key: 1,
              tag: K.value,
              mode: "create",
              preset: S.value || void 0,
              adapter: H.value || void 0,
              saving: E.value,
              onSave: ue,
              onCancel: de
            }, null, 8, ["tag", "preset", "adapter", "saving"])),
            C.value ? (a(), l("div", it, [
              m(n(V), {
                icon: "tabler:circle-x",
                "aria-hidden": "true"
              }),
              s("span", null, k(C.value), 1)
            ])) : M("", !0)
          ], 64))
        ])) : y.value ? (a(), l("section", rt, [
          s("h3", dt, "Configure " + k(y.value.title || y.value.name), 1),
          m(Be, {
            "aria-label": `Configure ${y.value.title || y.value.name}`,
            model: y.value,
            profiles: n(i),
            saving: n(F),
            onSave: Ce,
            onCancel: t[3] || (t[3] = (o) => y.value = null)
          }, null, 8, ["aria-label", "model", "profiles", "saving"])
        ])) : (a(), l("section", ut, [
          C.value ? (a(), l("div", ct, [
            m(n(V), {
              icon: "tabler:circle-x",
              "aria-hidden": "true"
            }),
            s("span", null, k(C.value), 1)
          ])) : M("", !0),
          s("div", vt, [
            s("div", pt, [
              t[10] || (t[10] = s("span", null, "Connected", -1)),
              m(n(be), {
                variant: "soft",
                small: "",
                icon: "tabler:plus",
                disabled: n(F),
                onClick: re
              }, {
                default: Z(() => [...t[9] || (t[9] = [
                  q("Add provider", -1)
                ])]),
                _: 1
              }, 8, ["disabled"])
            ]),
            s("div", bt, [
              (a(!0), l(P, null, G(n(i), (o) => (a(), l("div", {
                key: o.id,
                class: "ob-prov"
              }, [
                m(n(He), {
                  icon: n(ee).providerIcon(o.provider_id),
                  size: "sm"
                }, null, 8, ["icon"]),
                s("div", mt, [
                  s("div", ft, k(o.name), 1),
                  s("div", gt, k(n(Le)(o)), 1)
                ]),
                s("span", {
                  class: Ae(["ob-dot", n(ze)(o.status)]),
                  title: n(Re)(o.status)
                }, null, 10, _t)
              ]))), 128))
            ])
          ]),
          Y.value.length ? (a(), l("div", kt, [
            t[11] || (t[11] = s("div", { class: "ob-block-head" }, [
              s("span", null, "Disabled models")
            ], -1)),
            t[12] || (t[12] = s("p", { class: "ob-auto-hint" }, "Choose a model to enable it and enter any token limits its provider leaves unset.", -1)),
            m(n(pe), {
              "model-value": "",
              options: se(Y.value),
              placeholder: "Choose a model to configure",
              "aria-label": "Model to configure",
              "onUpdate:modelValue": he
            }, null, 8, ["options"])
          ])) : M("", !0),
          ne.value.length ? (a(), l("div", yt, [
            t[14] || (t[14] = s("span", { class: "ob-auto-hint" }, "Defaults are picked for you — adjust any below.", -1)),
            m(n(be), {
              variant: "soft",
              small: "",
              icon: "tabler:wand",
              disabled: n(F),
              onClick: t[4] || (t[4] = (o) => U(!0))
            }, {
              default: Z(() => [...t[13] || (t[13] = [
                q("Auto-select", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])) : M("", !0),
          (a(!0), l(P, null, G(ne.value, (o) => (a(), l("div", {
            key: o.key,
            class: "ob-block"
          }, [
            s("div", ht, [
              s("span", null, k(o.title), 1)
            ]),
            s("div", Ct, [
              (a(!0), l(P, null, G(o.classes, (r) => (a(), l("div", {
                key: r.name,
                class: "ob-class",
                title: r.description || ""
              }, [
                s("div", Mt, [
                  s("span", St, [
                    m(n(V), {
                      icon: r.icon || "tabler:layers-subtract",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"])
                  ]),
                  s("span", Nt, k(r.title || r.name), 1)
                ]),
                m(n(pe), {
                  "model-value": L(r.name),
                  options: se(o.models),
                  placeholder: o.models.length ? "Select a model" : "No models yet",
                  "aria-label": `Model for ${r.title || r.name}`,
                  "onUpdate:modelValue": (d) => Se(r.name, d)
                }, null, 8, ["model-value", "options", "placeholder", "aria-label", "onUpdate:modelValue"])
              ], 8, wt))), 128))
            ])
          ]))), 128)),
          s("div", Et, [
            s("button", {
              type: "button",
              class: "ob-btn ob-ghost",
              onClick: t[5] || (t[5] = (o) => n(h)("back", void 0))
            }, "‹ Back"),
            t[15] || (t[15] = s("span", { class: "ob-foot-sp" }, null, -1)),
            R.value ? (a(), l("button", {
              key: 0,
              type: "button",
              class: "ob-btn ob-primary",
              disabled: n(F),
              onClick: ae
            }, "Continue ›", 8, $t)) : (a(), l("button", {
              key: 1,
              type: "button",
              class: "ob-btn ob-ghost",
              onClick: le
            }, "Skip for now"))
          ])
        ]))
      ], 64))
    ]));
  }
});
export {
  Ft as default
};
//# sourceMappingURL=Onboard-B4OcWFYa.js.map
