import { u as E, a as P, W as D } from "./wc-runtime-RWZ7nf8c.js";
import { defineComponent as L, ref as B, onMounted as j, onBeforeUnmount as x, openBlock as O, createElementBlock as W } from "vue";
import { getLayoutManager as q, on as F, define as H } from "@wippy-fe/proxy";
import { u as T } from "./useSessionsApi-P7vRdJK6.js";
const U = { "aria-hidden": "true" }, r = "artifact", d = "artifact-modal", z = /* @__PURE__ */ L({
  __name: "ArtifactCoordinator",
  setup(w) {
    const S = { width: "80vw", height: "80vh" }, i = E(), c = P(), g = T(), s = i ? q(i) : null, u = [], a = B(k(window.location.pathname));
    let f = 0;
    function k(t) {
      if (!t.startsWith("/sessions/")) return "";
      const n = t.slice(10).split("/")[0] || "";
      try {
        return decodeURIComponent(n);
      } catch {
        return "";
      }
    }
    function b(t) {
      if (!t || typeof t != "object") return "";
      const n = t;
      return String(n.uuid || n.artifactId || "");
    }
    function A(t) {
      if (!t || typeof t != "object") return "";
      const n = t;
      return String(n.sessionId || n.session_id || "");
    }
    function v() {
      s?.expandPanel(r), s?.openDrawer(r);
    }
    function l() {
      s?.closeDrawer(r), s?.collapsePanel(r);
    }
    function p() {
      f++, i?.layout?.closeModal(d);
    }
    async function m(t) {
      const n = ++f;
      let e = "Artifact";
      try {
        const o = await g.artifact(t);
        o?.title && (e = o.title);
      } catch {
      }
      n === f && (i?.layout?.closeModal(d), i?.layout?.openModal(d, {
        kind: "artifact",
        id: t,
        title: e,
        dismissable: !0,
        size: S
      }));
    }
    function h(t, n, e) {
      if (n?.target === "modal") {
        m(t);
        return;
      }
      if (!(!!a.value && e !== r)) {
        if (n?.reason === "arrival") return;
        m(t);
        return;
      }
      v(), window.setTimeout(() => c?.broadcast("kickside:artifact-open", { uuid: t }), 0);
    }
    function I(t) {
      p(), t !== a.value && (a.value = t, l());
    }
    function C(t) {
      if (t.channel === "kickside:artifact-session") {
        I(A(t.payload));
        return;
      }
      if (t.channel === "@HOST/intent") {
        const n = t.payload;
        if (n?.intent === "startChat" || n?.intent === "openSession") {
          c?.send("main", "kickside:chat-open", n);
          return;
        }
        const e = b(n);
        n?.intent === "openArtifact" && e && h(e, n, t.sourcePanelId);
        return;
      }
      t.channel === "kickside:artifact-close" && (p(), l());
    }
    function M(t) {
      if (!t || typeof t != "object") return;
      const n = t, [, e] = String(n.topic || "").split(":");
      if (e !== "sidebar") return;
      const o = String(n.data?.artifact_uuid || "");
      if (!o) return;
      const y = String(n.data?.session_id || "");
      y && y !== a.value || h(o, { reason: "arrival" });
    }
    return j(() => {
      const t = c?.subscribe(C);
      t && u.push(t), u.push(F("action:*", M));
    }), x(() => u.forEach((t) => t())), (t, n) => (O(), W("span", U));
  }
});
class _ extends D {
  static get wippyConfig() {
    return { propsSchema: { type: "object", properties: {} } };
  }
  static get vueConfig() {
    return { rootComponent: z };
  }
}
async function Z() {
  return _;
}
H(import.meta.url, _);
export {
  Z as webComponent
};
//# sourceMappingURL=artifact_coordinator.js.map
