import { a as K, l as j, P as z } from "./wc-runtime-C6gaf4iX.js";
import { defineComponent as J, ref as r, computed as x, watch as O, nextTick as A, onMounted as Q, onBeforeUnmount as W, openBlock as s, createElementBlock as n, createVNode as y, unref as u, createElementVNode as a, toDisplayString as b, withDirectives as X, vModelText as Y, Fragment as S, renderList as D, createCommentVNode as d, createBlock as Z, createTextVNode as I } from "vue";
import { Icon as v } from "@iconify/vue";
import { host as tt } from "@wippy-fe/proxy";
import { i as et } from "./hostRoute-uRovXTvG.js";
import { u as at } from "./useSessionsApi-BQAm970o.js";
const st = { class: "kx-chat-start-controls" }, nt = { class: "kx-chat-start-agent" }, ot = ["aria-expanded", "disabled"], rt = {
  key: 0,
  id: "chat-start-agents",
  class: "kx-chat-start-menu"
}, lt = { class: "kx-chat-start-search" }, it = { class: "kx-chat-start-list" }, ct = {
  key: 0,
  class: "kx-chat-start-group"
}, ut = ["aria-current", "onClick"], dt = { class: "kx-chat-start-item-title" }, vt = {
  key: 0,
  class: "kx-chat-start-item-comment"
}, pt = {
  key: 0,
  class: "kx-chat-start-empty"
}, ht = ["disabled"], ft = {
  key: 0,
  class: "kx-chat-start-note is-error",
  role: "alert"
}, mt = {
  key: 1,
  class: "kx-chat-start-note"
}, kt = /* @__PURE__ */ J({
  __name: "ChatEmptyState",
  setup(yt) {
    const R = at(), T = K(), p = r([]), L = r(""), h = r(!0), f = r(""), l = r(!1), _ = r(""), c = r(!1), C = r(null), P = r(null), E = r(null);
    let g = 0, N;
    const m = x(() => p.value.flatMap((t) => t.agents).find((t) => t.name === L.value)), V = x(() => !!m.value && !h.value && !f.value && !c.value), w = x(() => p.value.length > 0), B = x(() => {
      const t = _.value.trim().toLowerCase();
      return t ? p.value.map((e) => ({
        title: e.title,
        agents: e.agents.filter((o) => o.title.toLowerCase().includes(t) || (o.comment || "").toLowerCase().includes(t))
      })).filter((e) => e.agents.length > 0) : p.value;
    });
    async function M() {
      const t = ++g;
      h.value = !0, f.value = "";
      try {
        const e = await R.chatAgents();
        t === g && (p.value = e);
      } catch (e) {
        t === g && (f.value = e.message || "Could not load agents");
      } finally {
        t === g && (h.value = !1);
      }
    }
    function $() {
      c.value || !w.value || (l.value ? k() : l.value = !0);
    }
    function k(t = !1) {
      l.value && (l.value = !1, _.value = "", t && A(() => E.value?.focus()));
    }
    function U(t) {
      L.value = t.name, k(!0);
    }
    function F() {
      const t = m.value?.start_token;
      !V.value || !t || (c.value = !0, k(), tt.startChat(t, { sidebar: !0 }));
    }
    function G(t) {
      t.channel !== "kickside:chat-start" || !et(t.payload) || t.payload.pending === !1 && (c.value = !1);
    }
    function q(t) {
      l.value && C.value && !t.composedPath().includes(C.value) && k();
    }
    function H(t) {
      t.key === "Escape" && l.value && (t.stopPropagation(), k(!0));
    }
    return O(l, (t) => {
      t && A(() => P.value?.focus());
    }), j(M), Q(() => {
      N = T?.subscribe(G), document.addEventListener("pointerdown", q, !0);
    }), W(() => {
      N?.(), document.removeEventListener("pointerdown", q, !0);
    }), (t, e) => (s(), n("section", {
      ref_key: "root",
      ref: C,
      class: "kx-chat-start",
      "aria-label": "Start a chat",
      onKeydown: H
    }, [
      y(u(v), {
        class: "kx-chat-start-icon",
        icon: "tabler:message-circle",
        "aria-hidden": "true"
      }),
      e[4] || (e[4] = a("h3", { class: "kx-chat-start-title" }, "No chat session selected", -1)),
      e[5] || (e[5] = a("p", { class: "kx-chat-start-text" }, "Please select a session from the dropdown above or start a new conversation.", -1)),
      a("div", st, [
        a("div", nt, [
          a("button", {
            ref_key: "trigger",
            ref: E,
            type: "button",
            class: "p-button p-button-secondary",
            "aria-controls": "chat-start-agents",
            "aria-expanded": l.value,
            disabled: h.value || c.value || !w.value,
            onClick: $
          }, [
            y(u(v), {
              icon: "wippy:agent",
              "aria-hidden": "true"
            }),
            a("span", null, b(m.value ? m.value.title : "Select Agent"), 1),
            y(u(v), {
              icon: "tabler:caret-down-filled",
              class: "kx-chat-start-caret",
              "aria-hidden": "true"
            })
          ], 8, ot),
          l.value ? (s(), n("div", rt, [
            a("div", lt, [
              e[1] || (e[1] = a("label", {
                class: "sr-only",
                for: "chat-start-search"
              }, "Search agents", -1)),
              X(a("input", {
                id: "chat-start-search",
                ref_key: "searchInput",
                ref: P,
                "onUpdate:modelValue": e[0] || (e[0] = (o) => _.value = o),
                type: "search",
                class: "p-inputtext",
                placeholder: "Search agents...",
                autocomplete: "off"
              }, null, 512), [
                [Y, _.value]
              ])
            ]),
            a("div", it, [
              (s(!0), n(S, null, D(B.value, (o) => (s(), n(S, {
                key: o.title
              }, [
                o.title ? (s(), n("div", ct, b(o.title), 1)) : d("", !0),
                (s(!0), n(S, null, D(o.agents, (i) => (s(), n("button", {
                  key: `${o.title}:${i.name}`,
                  type: "button",
                  class: "kx-chat-start-item",
                  "aria-current": m.value?.name === i.name ? "true" : void 0,
                  onClick: (bt) => U(i)
                }, [
                  a("span", dt, [
                    y(u(v), {
                      icon: i.icon || "wippy:agent",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    a("span", null, b(i.title || i.name), 1)
                  ]),
                  i.comment ? (s(), n("span", vt, b(i.comment), 1)) : d("", !0)
                ], 8, ut))), 128))
              ], 64))), 128)),
              B.value.length === 0 ? (s(), n("p", pt, "No agents match.")) : d("", !0)
            ])
          ])) : d("", !0)
        ]),
        a("button", {
          type: "button",
          class: "p-button p-button-primary",
          disabled: !V.value,
          onClick: F
        }, [
          c.value ? (s(), Z(u(v), {
            key: 0,
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          })) : d("", !0),
          e[2] || (e[2] = a("span", null, "Start Chat", -1))
        ], 8, ht)
      ]),
      f.value ? (s(), n("p", ft, [
        I(b(f.value) + " ", 1),
        a("button", {
          type: "button",
          class: "kx-chat-start-retry",
          onClick: M
        }, "Retry")
      ])) : !h.value && !w.value ? (s(), n("p", mt, [
        y(u(v), {
          icon: "tabler:alert-circle",
          "aria-hidden": "true"
        }),
        e[3] || (e[3] = I(" No agents available. Please contact your administrator. ", -1))
      ])) : d("", !0)
    ], 544));
  }
}), Lt = {
  rootComponent: kt,
  plugins: [z]
};
export {
  Lt as mountConfig
};
//# sourceMappingURL=chat_empty_state-mount-Cz8BC94Q.js.map
