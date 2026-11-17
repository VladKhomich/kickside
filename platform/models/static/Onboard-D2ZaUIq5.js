import { defineComponent as Ae, ref as N, computed as p, onMounted as Ve, openBlock as a, createElementBlock as l, unref as s, createBlock as j, withCtx as Z, createTextVNode as q, toDisplayString as k, createCommentVNode as M, Fragment as P, createVNode as m, createElementVNode as n, renderList as G, normalizeClass as De } from "vue";
import { Icon as O } from "@iconify/vue";
import { u as Oe } from "./wc-runtime-CHL0PH8L.js";
import { u as xe, j as Fe, k as ve, l as Te, n as Be, p as Le, a as Re, b as ze, _ as pe, m as Ue } from "./useModelsApi-BizaAH5J.js";
import { d as je, i as qe, c as Ge, a as be, _ as He } from "./ProviderProfileEditor.vue_vue_type_script_setup_true_lang-CIcOG-gh.js";
const Ke = () => Oe();
function We(x, h, u) {
  const I = x.filter((c) => c.enabled !== !1 && c.status !== "unhealthy");
  if (!I.length) return null;
  const A = u.find((c) => c.declared && c.name === "fast")?.models?.[0]?.name;
  if (!A) return null;
  const i = h.find((c) => c.name === A && c.enabled !== !1 && !Ye(c));
  if (!i) return null;
  const f = i.provider_profile_id ? I.find((c) => c.id === i.provider_profile_id) : I.find((c) => !!i.provider_id && c.provider_id === i.provider_id);
  return !f || i.provider_id && i.provider_id !== f.provider_id ? null : {
    class: "fast",
    model: i.name,
    title: i.title || i.name,
    provider_id: i.provider_id || f.provider_id
  };
}
function Ye(x) {
  const h = (x.capabilities ?? []).map((u) => u.toLowerCase());
  return h.length > 0 && h.every((u) => u === "embed" || u === "embedding" || u === "embeddings");
}
const Je = { class: "ob" }, Qe = {
  key: 0,
  class: "ob-model-warning",
  role: "note"
}, Xe = {
  key: 1,
  class: "ob-stage"
}, Ze = { class: "ob-grid" }, et = ["onClick"], tt = { class: "ob-tile-ico" }, ot = { class: "ob-tile-name" }, nt = {
  key: 0,
  class: "ob-tile-desc"
}, st = { class: "ob-foot" }, at = {
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
}, ht = { class: "ob-block-head" }, Ct = { class: "ob-classes" }, wt = ["title"], Mt = { class: "ob-class-top" }, St = { class: "ob-class-ico" }, Et = { class: "ob-class-name" }, $t = { class: "ob-foot" }, Nt = ["disabled"], Pt = "kickside-model-provider-openai-compatible", It = "wippy.llm.openai_compat:provider", Ft = /* @__PURE__ */ Ae({
  __name: "Onboard",
  setup(x) {
    const h = Ke(), u = xe(), { adapters: I, presets: A, profiles: i, models: f, classes: c, loading: me, saving: F, error: V } = u, ee = Ue(() => I.value, () => i.value, () => A.value), g = N("pick"), S = N(null), y = N(null), E = N(""), C = N(""), $ = N(!1), fe = p(() => A.value.filter((e) => e.onboarding !== !1)), ge = p(() => S.value?.provider_id || It), H = p(() => ee.adapterFor(ge.value)), K = p(
      () => S.value?.profile_editor_tag || H.value?.profile_editor_tag || Pt
    ), _e = p(() => je(K.value)), ke = p(() => qe(K.value));
    function W(e, t) {
      return (e.capabilities ?? []).some((o) => o.toLowerCase() === t);
    }
    function ye(e) {
      const t = (e.capabilities ?? []).map((o) => o.toLowerCase());
      return t.length > 0 && t.every((o) => o === "embed" || o === "embedding" || o === "embeddings");
    }
    const T = p(() => f.value.filter((e) => e.enabled !== !1 && !ye(e))), te = p(() => f.value.filter((e) => e.enabled !== !1 && (W(e, "embed") || W(e, "embedding") || W(e, "embeddings")))), Y = p(() => f.value.filter((e) => e.source === "discovered")), B = p(() => c.value.filter((e) => e.declared && e.capability !== "embed")), oe = p(() => c.value.filter((e) => e.declared && e.capability === "embed"));
    function L(e) {
      return c.value.find((t) => t.name === e)?.models?.[0]?.name ?? "";
    }
    function ne(e) {
      return e.map((t) => ({ label: t.title || t.name, value: t.name }));
    }
    function he(e) {
      y.value = Y.value.find((t) => t.name === e) ?? null;
    }
    async function Ce(e) {
      await u.saveCard(e) && (await u.loadClasses(), await U(!1), y.value = null);
    }
    const se = p(() => [
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
      C.value = e, V.value = "";
    }
    function re() {
      S.value = null, E.value = "", C.value = "", g.value = "pick";
    }
    function we(e) {
      S.value = e, C.value = "", g.value = "connect";
    }
    function de() {
      i.value.length ? g.value = "review" : re();
    }
    async function ue(e) {
      if (!$.value) {
        $.value = !0, C.value = "";
        try {
          e.enabled = !0;
          const t = new Set(i.value.map((d) => d.id));
          if (E.value = "Saving connection…", !await u.saveProfile("create", "", e)) {
            ie(V.value || "Could not save the connection.");
            return;
          }
          const r = i.value.find((d) => !t.has(d.id));
          if (r) {
            E.value = "Verifying key and importing models…";
            const d = await u.discover(r.id);
            await u.loadClasses(), d.ok ? (E.value = "Selecting sensible defaults…", await U(!1)) : ie(d.message);
          }
          g.value = "review";
        } finally {
          $.value = !1, E.value = "";
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
        const D = d.has(v.name) ? 1e3 : Number(v.priority ?? 10);
        b.push(Me(v, [...w], D));
      }
      b.length && (await u.saveCards(b), await u.loadClasses());
    }
    async function Se(e, t) {
      t && await ce([{ cls: e, model: t }]);
    }
    const Ee = /* @__PURE__ */ new Set([
      "wippy.llm.openai:provider",
      "wippy.llm.claude:provider",
      "wippy.llm.google.generative_ai:provider",
      "wippy.llm.google.vertex:provider",
      "wippy.llm.bedrock:provider"
    ]);
    function Q(e) {
      return Ee.has(e.provider_id || "");
    }
    const $e = /embed|whisper|tts|audio|image|imagen|dall-?e|lyria|veo|sora|music|\baqa\b|moderation|rerank|guard|realtime|transcribe|speech|\bsearch\b|vision-?only/i;
    function z(e) {
      const t = e.pricing, o = Number(t?.completion ?? t?.output ?? t?.prompt ?? 0);
      return Number.isFinite(o) && o > 0 ? o : (Number(e.max_tokens) || 0) / 1e6;
    }
    function Ne() {
      const e = T.value.filter((o) => !$e.test(o.name)), t = e.filter(Q);
      return t.length ? t : e.length ? e : T.value;
    }
    function Pe(e) {
      const t = /* @__PURE__ */ new Map(), o = Ne();
      if (!o.length || !e.length) return t;
      const r = [...o].sort((b, v) => z(b) - z(v)), d = r.length - 1;
      return e.forEach((b, v) => {
        const _ = o.filter((D) => (D.class ?? []).includes(b.name)).sort((D, X) => z(X) - z(D));
        if (_.length) {
          t.set(b.name, _[0].name);
          return;
        }
        const w = e.length <= 1 ? d : Math.round(v * d / (e.length - 1));
        t.set(b.name, r[Math.min(w, d)].name);
      }), t;
    }
    function Ie() {
      return [...te.value].sort((t, o) => (Q(o) ? 1 : 0) - (Q(t) ? 1 : 0) || (Number(o.dimensions) || 0) - (Number(t.dimensions) || 0))[0]?.name || "";
    }
    async function U(e = !1) {
      const t = [], o = Pe(B.value);
      for (const d of B.value) {
        if (!e && L(d.name)) continue;
        const b = o.get(d.name);
        b && t.push({ cls: d.name, model: b });
      }
      const r = Ie();
      for (const d of oe.value)
        !e && L(d.name) || r && t.push({ cls: d.name, model: r });
      await ce(t);
    }
    return Ve(async () => {
      await Promise.all([u.load(), u.loadClasses()]), g.value = i.value.length ? "review" : "pick", i.value.length && T.value.length && B.value.every((e) => !L(e.name)) && await U(!1);
    }), (e, t) => (a(), l("div", Je, [
      s(V) && g.value !== "connect" ? (a(), j(s(Fe), {
        key: 0,
        severity: "danger",
        onDismiss: t[0] || (t[0] = (o) => V.value = "")
      }, {
        default: Z(() => [
          q(k(s(V)), 1)
        ]),
        _: 1
      })) : M("", !0),
      s(me) && !s(i).length && !s(f).length ? (a(), j(s(ve), {
        key: 1,
        label: "Loading…"
      })) : (a(), l(P, { key: 2 }, [
        g.value === "pick" && !R.value ? (a(), l("div", Qe, [
          m(s(O), {
            icon: "tabler:brain",
            "aria-hidden": "true"
          }),
          t[6] || (t[6] = n("span", null, [
            n("strong", null, "KickSide works without an AI model, but it is better with one."),
            q(" Recommendations and AI-powered automations will be unavailable until you connect a provider. You can skip this step and finish it later under System → Models.")
          ], -1))
        ])) : M("", !0),
        g.value === "pick" ? (a(), l("section", Xe, [
          n("div", Ze, [
            (a(!0), l(P, null, G(fe.value, (o) => (a(), l("button", {
              key: o.id,
              type: "button",
              class: "ob-tile",
              onClick: (r) => we(o)
            }, [
              n("span", tt, [
                m(s(O), {
                  icon: o.icon || "tabler:plug",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              n("span", ot, k(o.title), 1),
              o.description ? (a(), l("span", nt, k(o.description), 1)) : M("", !0)
            ], 8, et))), 128))
          ]),
          n("div", st, [
            n("button", {
              type: "button",
              class: "ob-btn ob-ghost",
              onClick: t[1] || (t[1] = (o) => s(h)("back", void 0))
            }, "‹ Back"),
            t[7] || (t[7] = n("span", { class: "ob-foot-sp" }, null, -1)),
            s(i).length ? (a(), l("button", {
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
          $.value ? (a(), l("div", lt, [
            m(s(ve), {
              label: E.value || "Connecting…"
            }, null, 8, ["label"]),
            t[8] || (t[8] = n("p", { class: "ob-connecting-note" }, "Importing the provider's models — this can take up to a minute. Please don't close this.", -1))
          ])) : (a(), l(P, { key: 1 }, [
            ke.value ? (a(), j(Ge, {
              key: 0,
              "spec-key": _e.value.key,
              preset: S.value || void 0,
              adapter: H.value || void 0,
              mode: "create",
              saving: $.value,
              onSave: ue,
              onCancel: de
            }, null, 8, ["spec-key", "preset", "adapter", "saving"])) : (a(), j(Te, {
              key: 1,
              tag: K.value,
              mode: "create",
              preset: S.value || void 0,
              adapter: H.value || void 0,
              saving: $.value,
              onSave: ue,
              onCancel: de
            }, null, 8, ["tag", "preset", "adapter", "saving"])),
            C.value ? (a(), l("div", it, [
              m(s(O), {
                icon: "tabler:circle-x",
                "aria-hidden": "true"
              }),
              n("span", null, k(C.value), 1)
            ])) : M("", !0)
          ], 64))
        ])) : y.value ? (a(), l("section", rt, [
          n("h3", dt, "Configure " + k(y.value.title || y.value.name), 1),
          m(Be, {
            "aria-label": `Configure ${y.value.title || y.value.name}`,
            model: y.value,
            profiles: s(i),
            saving: s(F),
            onSave: Ce,
            onCancel: t[3] || (t[3] = (o) => y.value = null)
          }, null, 8, ["aria-label", "model", "profiles", "saving"])
        ])) : (a(), l("section", ut, [
          C.value ? (a(), l("div", ct, [
            m(s(O), {
              icon: "tabler:circle-x",
              "aria-hidden": "true"
            }),
            n("span", null, k(C.value), 1)
          ])) : M("", !0),
          n("div", vt, [
            n("div", pt, [
              t[10] || (t[10] = n("span", null, "Connected", -1)),
              m(s(be), {
                variant: "soft",
                small: "",
                icon: "tabler:plus",
                disabled: s(F),
                onClick: re
              }, {
                default: Z(() => [...t[9] || (t[9] = [
                  q("Add provider", -1)
                ])]),
                _: 1
              }, 8, ["disabled"])
            ]),
            n("div", bt, [
              (a(!0), l(P, null, G(s(i), (o) => (a(), l("div", {
                key: o.id,
                class: "ob-prov"
              }, [
                m(s(He), {
                  icon: s(ee).providerIcon(o.provider_id),
                  size: "sm"
                }, null, 8, ["icon"]),
                n("div", mt, [
                  n("div", ft, k(o.name), 1),
                  n("div", gt, k(s(Le)(o)), 1)
                ]),
                n("span", {
                  class: De(["ob-dot", s(ze)(o.status)]),
                  title: s(Re)(o.status)
                }, null, 10, _t)
              ]))), 128))
            ])
          ]),
          Y.value.length ? (a(), l("div", kt, [
            t[11] || (t[11] = n("div", { class: "ob-block-head" }, [
              n("span", null, "Model settings")
            ], -1)),
            m(s(pe), {
              "model-value": "",
              options: ne(Y.value),
              placeholder: "Choose a model to configure",
              "aria-label": "Model to configure",
              "onUpdate:modelValue": he
            }, null, 8, ["options"])
          ])) : M("", !0),
          se.value.length ? (a(), l("div", yt, [
            t[13] || (t[13] = n("span", { class: "ob-auto-hint" }, "Defaults are picked for you — adjust any below.", -1)),
            m(s(be), {
              variant: "soft",
              small: "",
              icon: "tabler:wand",
              disabled: s(F),
              onClick: t[4] || (t[4] = (o) => U(!0))
            }, {
              default: Z(() => [...t[12] || (t[12] = [
                q("Auto-select", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])) : M("", !0),
          (a(!0), l(P, null, G(se.value, (o) => (a(), l("div", {
            key: o.key,
            class: "ob-block"
          }, [
            n("div", ht, [
              n("span", null, k(o.title), 1)
            ]),
            n("div", Ct, [
              (a(!0), l(P, null, G(o.classes, (r) => (a(), l("div", {
                key: r.name,
                class: "ob-class",
                title: r.description || ""
              }, [
                n("div", Mt, [
                  n("span", St, [
                    m(s(O), {
                      icon: r.icon || "tabler:layers-subtract",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"])
                  ]),
                  n("span", Et, k(r.title || r.name), 1)
                ]),
                m(s(pe), {
                  "model-value": L(r.name),
                  options: ne(o.models),
                  placeholder: o.models.length ? "Select a model" : "No models yet",
                  "aria-label": `Model for ${r.title || r.name}`,
                  "onUpdate:modelValue": (d) => Se(r.name, d)
                }, null, 8, ["model-value", "options", "placeholder", "aria-label", "onUpdate:modelValue"])
              ], 8, wt))), 128))
            ])
          ]))), 128)),
          n("div", $t, [
            n("button", {
              type: "button",
              class: "ob-btn ob-ghost",
              onClick: t[5] || (t[5] = (o) => s(h)("back", void 0))
            }, "‹ Back"),
            t[14] || (t[14] = n("span", { class: "ob-foot-sp" }, null, -1)),
            R.value ? (a(), l("button", {
              key: 0,
              type: "button",
              class: "ob-btn ob-primary",
              disabled: s(F),
              onClick: ae
            }, "Continue ›", 8, Nt)) : (a(), l("button", {
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
//# sourceMappingURL=Onboard-D2ZaUIq5.js.map
