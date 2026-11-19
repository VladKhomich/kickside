import { l as ne, P as oe } from "./wc-runtime-C6gaf4iX.js";
import { defineComponent as le, ref as m, computed as re, onMounted as ce, onBeforeUnmount as de, openBlock as l, createElementBlock as f, createElementVNode as s, createVNode as r, unref as i, withDirectives as J, vModelText as ue, createCommentVNode as M, vModelSelect as fe, withCtx as B, normalizeClass as G, toDisplayString as w, createTextVNode as pe, Fragment as ve, renderList as he, createBlock as K } from "vue";
import { Icon as d } from "@iconify/vue";
import { u as me, a as ye, r as ke, b as xe, s as $, c as q } from "./useInventoryRefresh-CTkkCQa5.js";
import { on as z } from "@wippy-fe/proxy";
import { u as be } from "./useSessionsApi-BuC8McBv.js";
import { a as _, b as O } from "./artifactPresentation-EN-MoFvy.js";
const _e = { class: "kx kx-artifacts-page" }, ge = { class: "kx-head" }, we = { class: "kx-head-actions" }, Ce = { class: "kx-search" }, Ie = { class: "kx-select-label" }, Ae = { class: "kx-body kx-artifacts-body" }, Me = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Se = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ee = {
  key: 2,
  class: "kx-loading"
}, Pe = {
  key: 3,
  class: "kx-empty"
}, De = { class: "kx-empty-ico" }, Ne = { class: "kx-empty-sub" }, Ue = {
  key: 4,
  class: "kx-empty"
}, Ve = { class: "kx-empty-ico" }, Le = {
  key: 5,
  class: "kx-empty"
}, Re = {
  key: 6,
  class: "kx-artifact-grid",
  role: "list",
  "aria-label": "Artifacts"
}, Be = ["disabled", "onClick"], Ge = {
  class: "kx-artifact-preview",
  "aria-hidden": "true"
}, $e = ["id"], qe = { class: "kx-artifact-copy" }, ze = ["title"], Te = { class: "kx-artifact-meta" }, Ze = { key: 0 }, Fe = {
  key: 7,
  class: "kx-more"
}, T = 48, He = 100, We = /* @__PURE__ */ le({
  __name: "ArtifactsGallery",
  setup(Xe) {
    const L = be(), Q = me(), y = m([]), S = m(!1), C = m(!1), k = m(""), g = m(""), Z = m(""), E = m(!1), I = m(""), P = m("all"), D = m(""), N = [];
    let x;
    const A = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Set(), F = re(() => {
      const a = I.value.trim().toLowerCase();
      return y.value.filter((e) => P.value !== "all" && e.display_type !== P.value ? !1 : a ? [e.title, e.preview, e.description, e.content_type, e.kind].some((t) => String(t || "").toLowerCase().includes(a)) : !0);
    });
    async function R(a) {
      k.value = "";
      try {
        const e = a ? Math.max(T, y.value.length) : T, t = a ? [] : [...y.value], p = t.length + e;
        let v = a ? "" : Z.value, h = !1;
        do {
          const c = await L.artifacts({ limit: Math.min(p - t.length, He), cursor: v });
          t.push(...c.artifacts), v = c.nextCursor, h = c.hasMore;
        } while (h && v && t.length < p);
        y.value = [...new Map(t.filter((c) => !c.session_id || !U.has(c.session_id)).map((c) => [_(c), c])).values()].sort(q), Z.value = v, E.value = h, S.value = !0;
      } catch (e) {
        const t = e?.response;
        if (!a && t?.status === 400 && t.data?.error === "Invalid artifact cursor") {
          await R(!0);
          return;
        }
        k.value = e.message;
      }
    }
    async function Y() {
      x && await x, await R(!0);
    }
    function H(a, e = !1) {
      const t = A.get(a.artifactId);
      A.set(a.artifactId, {
        artifactId: a.artifactId,
        sessionId: a.sessionId || t?.sessionId,
        deleted: a.deleted || t?.deleted === !0,
        readDetail: e || t?.readDetail === !0
      }), j();
    }
    async function ee(a, e) {
      const t = /* @__PURE__ */ new Map();
      let p = "";
      do {
        const v = await L.artifacts({ sessionId: a, limit: T, cursor: p });
        for (const h of v.artifacts) {
          const c = _(h);
          h.session_id === a && e.has(c) && t.set(c, h);
        }
        if (!v.hasMore || v.nextCursor === p || t.size === e.size) break;
        p = v.nextCursor;
      } while (p);
      return t;
    }
    async function te() {
      x && await x;
      const a = [...A.values()];
      A.clear();
      const e = y.value.at(-1), t = new Map(y.value.map((n) => [_(n), n])), p = /* @__PURE__ */ new Map(), v = [];
      function h(n, u) {
        !u || A.get(n)?.deleted ? t.delete(n) : (t.has(n) || !E.value || !e || q(u, e) <= 0) && t.set(n, u);
      }
      async function c(n, u) {
        try {
          const o = await L.artifact(n);
          h(n, { ...o, session_id: o.session_id || u });
        } catch (o) {
          const b = o?.response?.status;
          b === 404 || b === 403 ? h(n, void 0) : g.value = o.message;
        }
      }
      for (const n of a) {
        const u = n.artifactId, o = n.sessionId || t.get(u)?.session_id;
        if (n.deleted || o && U.has(o))
          t.delete(u);
        else if (n.readDetail)
          v.push(c(u, o));
        else if (o) {
          const b = p.get(o) ?? /* @__PURE__ */ new Set();
          b.add(u), p.set(o, b);
        }
      }
      const ie = [...p].map(async ([n, u]) => {
        try {
          const o = await ee(n, u);
          for (const b of u) h(b, o.get(b));
        } catch (o) {
          g.value = o.message;
        }
      });
      await Promise.all([...v, ...ie]), y.value = [...t.values()].filter((n) => !n.session_id || !U.has(n.session_id)).sort(q);
    }
    const { refreshing: W, syncing: X, refresh: V, queueUpdates: j } = ye(Y, te);
    async function se() {
      if (!(X.value || x || !E.value)) {
        C.value = !0, x = R(!1);
        try {
          await x;
        } finally {
          x = void 0, C.value = !1;
        }
      }
    }
    async function ae(a) {
      const e = _(a);
      if (e) {
        D.value = e, g.value = "";
        try {
          if (!a.session_id) throw new Error("This artifact is not linked to a session.");
          Q("artifact-select", { artifactId: e, sessionId: a.session_id });
        } catch (t) {
          g.value = t.message || "Could not open artifact";
        } finally {
          D.value = "";
        }
      }
    }
    return ce(() => {
      N.push(z("artifact:*", (a) => {
        const e = ke(a);
        e && H(e, !0);
      })), N.push(z("session:*", (a) => {
        const e = xe(a);
        e && (e.deleted ? (U.add(e.sessionId), j()) : e.artifactId && H({ artifactId: e.artifactId, sessionId: e.sessionId, deleted: !1 }));
      })), N.push(z("@reconnect", V));
    }), ne(V), de(() => {
      N.forEach((a) => a());
    }), (a, e) => (l(), f("div", _e, [
      s("header", ge, [
        e[8] || (e[8] = s("div", { class: "kx-head-text" }, [
          s("h1", { class: "kx-title" }, "Artifacts")
        ], -1)),
        s("div", we, [
          s("label", Ce, [
            e[5] || (e[5] = s("span", { class: "sr-only" }, "Search artifacts", -1)),
            r(i(d), {
              icon: "tabler:search",
              class: "kx-search-ico",
              "aria-hidden": "true"
            }),
            J(s("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (t) => I.value = t),
              class: "kx-search-input",
              type: "search",
              placeholder: "Search artifacts"
            }, null, 512), [
              [ue, I.value]
            ]),
            I.value ? (l(), f("button", {
              key: 0,
              class: "kx-search-clear",
              "aria-label": "Clear search",
              onClick: e[1] || (e[1] = (t) => I.value = "")
            }, [
              r(i(d), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ])) : M("", !0)
          ]),
          s("label", Ie, [
            e[7] || (e[7] = s("span", { class: "sr-only" }, "Artifact placement", -1)),
            J(s("select", {
              "onUpdate:modelValue": e[2] || (e[2] = (t) => P.value = t),
              class: "kx-select"
            }, [...e[6] || (e[6] = [
              s("option", { value: "all" }, "All artifacts", -1),
              s("option", { value: "standalone" }, "Standalone", -1),
              s("option", { value: "inline" }, "Inline", -1)
            ])], 512), [
              [fe, P.value]
            ])
          ]),
          r(i($), {
            type: "button",
            severity: "secondary",
            outlined: "",
            title: "Refresh",
            "aria-label": "Refresh artifacts",
            loading: i(W),
            disabled: i(W),
            onClick: i(V)
          }, {
            icon: B(({ class: t }) => [
              r(i(d), {
                icon: "tabler:refresh",
                class: G(t),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["loading", "disabled", "onClick"])
        ])
      ]),
      s("div", Ae, [
        g.value ? (l(), f("div", Me, [
          r(i(d), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          s("span", null, w(g.value), 1),
          s("button", {
            class: "kx-err-x",
            "aria-label": "Dismiss",
            onClick: e[3] || (e[3] = (t) => g.value = "")
          }, [
            r(i(d), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ])) : M("", !0),
        S.value && k.value ? (l(), f("div", Se, [
          r(i(d), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          s("span", null, w(k.value), 1),
          s("button", {
            class: "kx-err-x",
            "aria-label": "Dismiss",
            onClick: e[4] || (e[4] = (t) => k.value = "")
          }, [
            r(i(d), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ])) : M("", !0),
        !S.value && !k.value ? (l(), f("div", Ee, [
          r(i(d), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          e[9] || (e[9] = pe(" Loading artifacts…", -1))
        ])) : !S.value && k.value ? (l(), f("div", Pe, [
          s("div", De, [
            r(i(d), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            })
          ]),
          e[10] || (e[10] = s("div", { class: "kx-empty-title" }, "Couldn’t load artifacts", -1)),
          s("div", Ne, w(k.value), 1),
          r(i($), {
            type: "button",
            label: "Retry",
            onClick: i(V)
          }, {
            icon: B(({ class: t }) => [
              r(i(d), {
                icon: "tabler:refresh",
                class: G(t),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["onClick"])
        ])) : y.value.length ? F.value.length ? (l(), f("div", Re, [
          (l(!0), f(ve, null, he(F.value, (t) => (l(), f("article", {
            key: i(_)(t),
            class: "kx-artifact-card",
            role: "listitem"
          }, [
            s("button", {
              type: "button",
              class: "kx-artifact-open",
              disabled: D.value === i(_)(t),
              onClick: (p) => ae(t)
            }, [
              s("span", Ge, [
                s("w-artifact", {
                  id: i(_)(t)
                }, null, 8, $e)
              ]),
              s("span", qe, [
                s("strong", {
                  title: t.title || "Untitled artifact"
                }, w(t.title || "Untitled artifact"), 9, ze),
                s("span", Te, [
                  s("span", null, w(t.display_type || "artifact"), 1),
                  i(O)(t) ? (l(), f("span", Ze, w(i(O)(t)), 1)) : M("", !0)
                ])
              ]),
              D.value === i(_)(t) ? (l(), K(i(d), {
                key: 0,
                icon: "tabler:loader-2",
                class: "spin kx-artifact-open-icon",
                "aria-hidden": "true"
              })) : (l(), K(i(d), {
                key: 1,
                icon: "tabler:arrow-up-right",
                class: "kx-artifact-open-icon",
                "aria-hidden": "true"
              }))
            ], 8, Be)
          ]))), 128))
        ])) : (l(), f("div", Le, [...e[13] || (e[13] = [
          s("div", { class: "kx-empty-title" }, "No matches", -1),
          s("div", { class: "kx-empty-sub" }, "No loaded artifacts match the current search and placement filter.", -1)
        ])])) : (l(), f("div", Ue, [
          s("div", Ve, [
            r(i(d), {
              icon: "tabler:binary-tree-2",
              "aria-hidden": "true"
            })
          ]),
          e[11] || (e[11] = s("div", { class: "kx-empty-title" }, "No artifacts yet", -1)),
          e[12] || (e[12] = s("div", { class: "kx-empty-sub" }, "Enable the Artifacts capability on an agent, then ask it to create a document, component, or rich response.", -1))
        ])),
        E.value ? (l(), f("div", Fe, [
          r(i($), {
            type: "button",
            severity: "secondary",
            outlined: "",
            label: C.value ? "Loading…" : "Load more",
            loading: C.value,
            disabled: C.value || i(X),
            onClick: se
          }, {
            icon: B(({ class: t }) => [
              r(i(d), {
                icon: "tabler:chevron-down",
                class: G(t),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["label", "loading", "disabled"])
        ])) : M("", !0)
      ])
    ]));
  }
}), tt = {
  rootComponent: We,
  plugins: [oe]
};
export {
  tt as mountConfig
};
//# sourceMappingURL=artifacts-mount-CyUpesAb.js.map
