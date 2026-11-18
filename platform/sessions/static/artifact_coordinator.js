import { u as T, a as D, W as B } from "./wc-runtime-C6gaf4iX.js";
import { defineComponent as q, ref as H, onMounted as N, onBeforeUnmount as R, openBlock as O, createElementBlock as j } from "vue";
import { getLayoutManager as F, on as W, define as z } from "@wippy-fe/proxy";
import { s as C, a as K, l as m, e as U, i as l, C as V, b as Z, m as G, M as J, c as Q, A as i } from "./hostRoute-uRovXTvG.js";
import { e as X, c as Y } from "./chatStart-Bxe6JK-R.js";
import { u as $ } from "./useHostRoute-Bxm2JrjL.js";
import { u as tt } from "./useSessionsApi-BQAm970o.js";
const et = { "aria-hidden": "true" }, h = "artifact-modal", ot = /* @__PURE__ */ q({
  __name: "ArtifactCoordinator",
  setup(I) {
    const P = { width: "80vw", height: "80vh" }, n = T(), p = D(), w = tt(), r = n ? F(n) : null, d = [], y = $(n, ({ path: t }) => k(C(t))), c = H(C(y.initialPath));
    let u = 0, f = 0;
    function b() {
      r?.expandPanel(i), r?.openDrawer(i);
    }
    function A() {
      r?.closeDrawer(i), r?.collapsePanel(i);
    }
    function g() {
      u++, n?.layout?.closeModal(h);
    }
    async function _(t) {
      const e = ++u;
      let o = "Artifact";
      try {
        const a = await w.artifact(t);
        a?.title && (o = a.title);
      } catch {
      }
      e === u && (n?.layout?.closeModal(h), n?.layout?.openModal(h, {
        kind: "artifact",
        id: t,
        title: o,
        dismissable: !0,
        size: P
      }));
    }
    function S(t, e, o) {
      if (e?.target === "modal") {
        _(t);
        return;
      }
      if (!(!!c.value && o !== i)) {
        if (e?.reason === "arrival") return;
        _(t);
        return;
      }
      b(), window.setTimeout(() => p?.broadcast("kickside:artifact-open", { uuid: t }), 0);
    }
    function k(t) {
      g(), t !== c.value && (c.value = t, A());
    }
    async function M(t) {
      const e = ++f;
      let o = typeof t.uuid == "string" ? t.uuid : "";
      if (t.intent === "startChat") {
        if (typeof t.startToken != "string" || !t.startToken) return;
        try {
          o = await X(t.startToken);
        } catch {
          e === f && n?.toast({ severity: "error", summary: "Could not start chat" });
          return;
        }
        if (e !== f) {
          Y(o);
          return;
        }
      }
      if (!o) return;
      const a = t.context;
      if (l(a) && l(a.context)) {
        const s = a.source, L = l(s) && typeof s.uuid == "string" && (s.type === "page" || s.type === "artifact") ? { type: s.type, uuid: s.uuid } : void 0;
        n?.setContext(a.context, o, L);
      }
      G(m(n)) ? p?.send(J, "kickside:chat-open", {
        intent: "openSession",
        uuid: o,
        sidebar: t.sidebar === !0
      }) : n?.navigate(Q(o));
    }
    function x(t) {
      if (t.channel === "kickside:artifact-session") {
        if (!K(t.sourcePanelId, m(n), y.hostPath())) return;
        k(U(t.payload));
        return;
      }
      if (t.channel === "@HOST/intent") {
        if (!l(t.payload)) return;
        const e = t.payload;
        if (e.intent === "startChat" || e.intent === "openSession") {
          m(n)?.panels?.[V] || M(e);
          return;
        }
        const o = Z(e);
        e?.intent === "openArtifact" && o && S(o, e, t.sourcePanelId);
        return;
      }
      t.channel === "kickside:artifact-close" && (g(), A());
    }
    function E(t) {
      if (!t || typeof t != "object") return;
      const e = t, [, o] = String(e.topic || "").split(":");
      if (o !== "sidebar") return;
      const a = String(e.data?.artifact_uuid || "");
      if (!a) return;
      const s = String(e.data?.session_id || "");
      s && s !== c.value || S(a, { reason: "arrival" });
    }
    return N(() => {
      const t = p?.subscribe(x);
      t && d.push(t), d.push(W("action:*", E));
    }), R(() => {
      f++, u++, d.forEach((t) => t());
    }), (t, e) => (O(), j("span", et));
  }
});
class v extends B {
  static get wippyConfig() {
    return { propsSchema: { type: "object", properties: {} } };
  }
  static get vueConfig() {
    return { rootComponent: ot };
  }
}
async function ft() {
  return v;
}
z(import.meta.url, v);
export {
  ft as webComponent
};
//# sourceMappingURL=artifact_coordinator.js.map
