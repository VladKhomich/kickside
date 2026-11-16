import { u as M, a as C, W as E } from "./wc-runtime-DRNaOAbU.js";
import { defineComponent as D, ref as L, onMounted as B, onBeforeUnmount as x, openBlock as T, createElementBlock as H } from "vue";
import { getLayoutManager as O, on as j, define as q } from "@wippy-fe/proxy";
import { s as S, a as F, l as R, e as W, b as z, A as i } from "./hostRoute-CHFKAd6h.js";
import { u as K } from "./useHostRoute-BCkMq4pd.js";
import { u as N } from "./useSessionsApi-BQAm970o.js";
import "@iconify/vue";
const U = { "aria-hidden": "true" }, l = "artifact-modal", V = /* @__PURE__ */ D({
  __name: "ArtifactCoordinator",
  setup(w) {
    const b = { width: "80vw", height: "80vh" }, n = M(), f = C(), g = N(), s = n ? O(n) : null, c = [], p = K(n, (t) => A(S(t))), r = L(S(p.initialPath));
    let u = 0;
    function k() {
      s?.expandPanel(i), s?.openDrawer(i);
    }
    function d() {
      s?.closeDrawer(i), s?.collapsePanel(i);
    }
    function m() {
      u++, n?.layout?.closeModal(l);
    }
    async function h(t) {
      const o = ++u;
      let e = "Artifact";
      try {
        const a = await g.artifact(t);
        a?.title && (e = a.title);
      } catch {
      }
      o === u && (n?.layout?.closeModal(l), n?.layout?.openModal(l, {
        kind: "artifact",
        id: t,
        title: e,
        dismissable: !0,
        size: b
      }));
    }
    function y(t, o, e) {
      if (o?.target === "modal") {
        h(t);
        return;
      }
      if (!(!!r.value && e !== i)) {
        if (o?.reason === "arrival") return;
        h(t);
        return;
      }
      k(), window.setTimeout(() => f?.broadcast("kickside:artifact-open", { uuid: t }), 0);
    }
    function A(t) {
      m(), t !== r.value && (r.value = t, d());
    }
    function P(t) {
      if (t.channel === "kickside:artifact-session") {
        if (!F(t.sourcePanelId, R(n), p.hostPath())) return;
        A(W(t.payload));
        return;
      }
      if (t.channel === "@HOST/intent") {
        const o = t.payload, e = z(o);
        o?.intent === "openArtifact" && e && y(e, o, t.sourcePanelId);
        return;
      }
      t.channel === "kickside:artifact-close" && (m(), d());
    }
    function I(t) {
      if (!t || typeof t != "object") return;
      const o = t, [, e] = String(o.topic || "").split(":");
      if (e !== "sidebar") return;
      const a = String(o.data?.artifact_uuid || "");
      if (!a) return;
      const _ = String(o.data?.session_id || "");
      _ && _ !== r.value || y(a, { reason: "arrival" });
    }
    return B(() => {
      const t = f?.subscribe(P);
      t && c.push(t), c.push(j("action:*", I));
    }), x(() => c.forEach((t) => t())), (t, o) => (T(), H("span", U));
  }
});
class v extends E {
  static get wippyConfig() {
    return { propsSchema: { type: "object", properties: {} } };
  }
  static get vueConfig() {
    return { rootComponent: V };
  }
}
async function tt() {
  return v;
}
q(import.meta.url, v);
export {
  tt as webComponent
};
//# sourceMappingURL=artifact_coordinator.js.map
