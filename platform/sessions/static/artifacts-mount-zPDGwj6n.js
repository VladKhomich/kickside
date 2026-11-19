import { l as P, P as z } from "./wc-runtime-RWZ7nf8c.js";
import { defineComponent as F, ref as c, computed as G, onMounted as H, onBeforeUnmount as W, openBlock as l, createElementBlock as n, createElementVNode as s, createVNode as o, unref as a, withDirectives as M, vModelText as j, createCommentVNode as w, vModelSelect as J, withCtx as S, normalizeClass as V, toDisplayString as b, createTextVNode as K, Fragment as O, renderList as Q, createBlock as $ } from "vue";
import { Icon as r } from "@iconify/vue";
import { u as X, s as E } from "./constants-DYhCMW32.js";
import { on as I } from "@wippy-fe/proxy";
import { u as Y } from "./useSessionsApi-BQAm970o.js";
import { a as x, b as R } from "./artifactPresentation-Dgf5Fs_k.js";
const Z = { class: "kx kx-artifacts-page" }, ee = { class: "kx-head" }, te = { class: "kx-head-actions" }, se = { class: "kx-search" }, ae = { class: "kx-select-label" }, le = { class: "kx-body kx-artifacts-body" }, ie = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, oe = {
  key: 1,
  class: "kx-loading"
}, ne = {
  key: 2,
  class: "kx-empty"
}, re = { class: "kx-empty-ico" }, ce = { class: "kx-empty-sub" }, ue = {
  key: 3,
  class: "kx-empty"
}, de = { class: "kx-empty-ico" }, ve = {
  key: 4,
  class: "kx-empty"
}, pe = {
  key: 5,
  class: "kx-artifact-grid",
  role: "list",
  "aria-label": "Artifacts"
}, fe = ["disabled", "onClick"], me = {
  class: "kx-artifact-preview",
  "aria-hidden": "true"
}, ke = ["id"], ye = { class: "kx-artifact-copy" }, he = ["title"], be = { class: "kx-artifact-meta" }, xe = { key: 0 }, _e = {
  key: 6,
  class: "kx-more"
}, ge = /* @__PURE__ */ F({
  __name: "ArtifactsGallery",
  setup(Ce) {
    const U = Y(), B = X(), _ = c([]), d = c(!0), v = c(!1), p = c(""), f = c(""), N = c(""), T = c(!1), m = c(""), g = c("all"), C = c(""), A = [];
    let k = null, y = 0;
    const q = G(() => {
      const i = m.value.trim().toLowerCase();
      return _.value.filter((e) => g.value !== "all" && e.display_type !== g.value ? !1 : i ? [e.title, e.preview, e.description, e.content_type, e.kind].some((t) => String(t || "").toLowerCase().includes(i)) : !0);
    });
    async function h(i = !0) {
      const e = ++y, t = i ? "" : N.value;
      i ? (d.value = !0, p.value = "") : v.value = !0;
      try {
        const u = await U.artifacts({ limit: 48, cursor: t });
        if (e !== y) return;
        _.value = i ? u.artifacts : [..._.value, ...u.artifacts], N.value = u.nextCursor, T.value = u.hasMore;
      } catch (u) {
        if (e !== y) return;
        p.value = u.message;
      } finally {
        e === y && (d.value = !1, v.value = !1);
      }
    }
    function L() {
      k && clearTimeout(k), k = setTimeout(() => {
        h(!0);
      }, 150);
    }
    async function D(i) {
      const e = x(i);
      if (e) {
        C.value = e, f.value = "";
        try {
          if (!i.session_id) throw new Error("This artifact is not linked to a session.");
          B("artifact-select", { artifactId: e, sessionId: i.session_id });
        } catch (t) {
          f.value = t.message || "Could not open artifact";
        } finally {
          C.value = "";
        }
      }
    }
    return P(() => h(!0)), H(() => {
      A.push(I("artifact:*", L)), A.push(I("session:*", L));
    }), W(() => {
      A.forEach((i) => i()), y++, k && clearTimeout(k);
    }), (i, e) => (l(), n("div", Z, [
      s("header", ee, [
        e[10] || (e[10] = s("div", { class: "kx-head-text" }, [
          s("h1", { class: "kx-title" }, "Artifacts")
        ], -1)),
        s("div", te, [
          s("label", se, [
            e[7] || (e[7] = s("span", { class: "sr-only" }, "Search artifacts", -1)),
            o(a(r), {
              icon: "tabler:search",
              class: "kx-search-ico",
              "aria-hidden": "true"
            }),
            M(s("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (t) => m.value = t),
              class: "kx-search-input",
              type: "search",
              placeholder: "Search artifacts"
            }, null, 512), [
              [j, m.value]
            ]),
            m.value ? (l(), n("button", {
              key: 0,
              class: "kx-search-clear",
              "aria-label": "Clear search",
              onClick: e[1] || (e[1] = (t) => m.value = "")
            }, [
              o(a(r), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ])) : w("", !0)
          ]),
          s("label", ae, [
            e[9] || (e[9] = s("span", { class: "sr-only" }, "Artifact placement", -1)),
            M(s("select", {
              "onUpdate:modelValue": e[2] || (e[2] = (t) => g.value = t),
              class: "kx-select"
            }, [...e[8] || (e[8] = [
              s("option", { value: "all" }, "All artifacts", -1),
              s("option", { value: "standalone" }, "Standalone", -1),
              s("option", { value: "inline" }, "Inline", -1)
            ])], 512), [
              [J, g.value]
            ])
          ]),
          o(a(E), {
            type: "button",
            severity: "secondary",
            outlined: "",
            title: "Refresh",
            "aria-label": "Refresh artifacts",
            loading: d.value,
            disabled: d.value,
            onClick: e[3] || (e[3] = (t) => h(!0))
          }, {
            icon: S(({ class: t }) => [
              o(a(r), {
                icon: "tabler:refresh",
                class: V(t),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["loading", "disabled"])
        ])
      ]),
      s("div", le, [
        f.value ? (l(), n("div", ie, [
          o(a(r), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          s("span", null, b(f.value), 1),
          s("button", {
            class: "kx-err-x",
            "aria-label": "Dismiss",
            onClick: e[4] || (e[4] = (t) => f.value = "")
          }, [
            o(a(r), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ])) : w("", !0),
        d.value ? (l(), n("div", oe, [
          o(a(r), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          e[11] || (e[11] = K(" Loading artifacts…", -1))
        ])) : p.value ? (l(), n("div", ne, [
          s("div", re, [
            o(a(r), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            })
          ]),
          e[12] || (e[12] = s("div", { class: "kx-empty-title" }, "Couldn’t load artifacts", -1)),
          s("div", ce, b(p.value), 1),
          o(a(E), {
            type: "button",
            label: "Retry",
            onClick: e[5] || (e[5] = (t) => h(!0))
          }, {
            icon: S(({ class: t }) => [
              o(a(r), {
                icon: "tabler:refresh",
                class: V(t),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          })
        ])) : _.value.length ? q.value.length ? (l(), n("div", pe, [
          (l(!0), n(O, null, Q(q.value, (t) => (l(), n("article", {
            key: a(x)(t),
            class: "kx-artifact-card",
            role: "listitem"
          }, [
            s("button", {
              type: "button",
              class: "kx-artifact-open",
              disabled: C.value === a(x)(t),
              onClick: (u) => D(t)
            }, [
              s("span", me, [
                s("w-artifact", {
                  id: a(x)(t)
                }, null, 8, ke)
              ]),
              s("span", ye, [
                s("strong", {
                  title: t.title || "Untitled artifact"
                }, b(t.title || "Untitled artifact"), 9, he),
                s("span", be, [
                  s("span", null, b(t.display_type || "artifact"), 1),
                  a(R)(t) ? (l(), n("span", xe, b(a(R)(t)), 1)) : w("", !0)
                ])
              ]),
              C.value === a(x)(t) ? (l(), $(a(r), {
                key: 0,
                icon: "tabler:loader-2",
                class: "spin kx-artifact-open-icon",
                "aria-hidden": "true"
              })) : (l(), $(a(r), {
                key: 1,
                icon: "tabler:arrow-up-right",
                class: "kx-artifact-open-icon",
                "aria-hidden": "true"
              }))
            ], 8, fe)
          ]))), 128))
        ])) : (l(), n("div", ve, [...e[15] || (e[15] = [
          s("div", { class: "kx-empty-title" }, "No matches", -1),
          s("div", { class: "kx-empty-sub" }, "No loaded artifacts match the current search and placement filter.", -1)
        ])])) : (l(), n("div", ue, [
          s("div", de, [
            o(a(r), {
              icon: "tabler:binary-tree-2",
              "aria-hidden": "true"
            })
          ]),
          e[13] || (e[13] = s("div", { class: "kx-empty-title" }, "No artifacts yet", -1)),
          e[14] || (e[14] = s("div", { class: "kx-empty-sub" }, "Enable the Artifacts capability on an agent, then ask it to create a document, component, or rich response.", -1))
        ])),
        !d.value && !p.value && T.value ? (l(), n("div", _e, [
          o(a(E), {
            type: "button",
            severity: "secondary",
            outlined: "",
            label: v.value ? "Loading…" : "Load more",
            loading: v.value,
            disabled: v.value,
            onClick: e[6] || (e[6] = (t) => h(!1))
          }, {
            icon: S(({ class: t }) => [
              o(a(r), {
                icon: "tabler:chevron-down",
                class: V(t),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["label", "loading", "disabled"])
        ])) : w("", !0)
      ])
    ]));
  }
}), qe = {
  rootComponent: ge,
  plugins: [z]
};
export {
  qe as mountConfig
};
//# sourceMappingURL=artifacts-mount-zPDGwj6n.js.map
