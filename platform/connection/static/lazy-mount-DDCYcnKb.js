import { B as Ee, s as Pe, b as Me, P as Oe } from "./wc-runtime-Bcuhsx-0.js";
import { openBlock as _, createElementBlock as m, mergeProps as ne, createElementVNode as r, defineComponent as ue, computed as Z, withModifiers as oe, Fragment as W, createTextVNode as se, toDisplayString as P, createCommentVNode as M, createVNode as y, unref as c, watch as Te, onBeforeUnmount as pe, ref as j, withDirectives as De, vModelText as Le, withCtx as ce, renderList as de, normalizeClass as G, createBlock as Ae, nextTick as Re } from "vue";
import { s as ie, _ as Be } from "./ConnectionPicker.vue_vue_type_script_setup_true_lang-Bjb0l3Et.js";
import { on as fe, api as J, loadByTagName as Ie } from "@wippy-fe/proxy";
import { Icon as $ } from "@iconify/vue";
import { C as Ve, b as Ue, r as ze, a as Y, c as He } from "./status-vqwfu--5.js";
var Ke = `
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`, We = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
}, qe = Ee.extend({
  name: "progressspinner",
  style: Ke,
  classes: We
}), Fe = {
  name: "BaseProgressSpinner",
  extends: Pe,
  props: {
    strokeWidth: {
      type: String,
      default: "2"
    },
    fill: {
      type: String,
      default: "none"
    },
    animationDuration: {
      type: String,
      default: "2s"
    }
  },
  style: qe,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, ve = {
  name: "ProgressSpinner",
  extends: Fe,
  inheritAttrs: !1,
  computed: {
    svgStyle: function() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
}, Ge = ["fill", "stroke-width"];
function Je(i, n, p, f, u, l) {
  return _(), m("div", ne({
    class: i.cx("root"),
    role: "progressbar"
  }, i.ptmi("root")), [(_(), m("svg", ne({
    class: i.cx("spin"),
    viewBox: "25 25 50 50",
    style: l.svgStyle
  }, i.ptm("spin")), [r("circle", ne({
    class: i.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: i.fill,
    "stroke-width": i.strokeWidth,
    strokeMiterlimit: "10"
  }, i.ptm("circle")), null, 16, Ge)], 16))], 16);
}
ve.render = Je;
const Ye = { key: 0 }, Ze = /* @__PURE__ */ ue({
  __name: "ComponentDeletion",
  props: {
    state: {}
  },
  emits: ["retry"],
  setup(i) {
    const n = i, p = Z(() => n.state.deletion_job === null || ["dead", "cancelled"].includes(n.state.deletion_job?.status || ""));
    return (f, u) => i.state.deleting_at ? (_(), m("span", {
      key: 0,
      class: "component-deletion",
      role: "status",
      onClick: u[1] || (u[1] = oe(() => {
      }, ["stop"])),
      onKeydown: u[2] || (u[2] = oe(() => {
      }, ["stop"]))
    }, [
      p.value ? (_(), m(W, { key: 0 }, [
        r("span", null, [
          u[3] || (u[3] = se("Deletion failed", -1)),
          i.state.deletion_job?.last_error ? (_(), m("span", Ye, ": " + P(i.state.deletion_job.last_error), 1)) : M("", !0)
        ]),
        y(c(ie), {
          label: "Retry deletion",
          severity: "secondary",
          size: "small",
          outlined: "",
          onClick: u[0] || (u[0] = oe((l) => f.$emit("retry"), ["stop"]))
        })
      ], 64)) : (_(), m(W, { key: 1 }, [
        y(c(ve), {
          class: "component-deletion-spinner",
          "aria-label": "Deletion in progress"
        }),
        u[4] || (u[4] = r("span", null, "Deleting…", -1))
      ], 64))
    ], 32)) : M("", !0);
  }
});
function K(i) {
  return !!i && typeof i == "object" && !Array.isArray(i);
}
function Qe(i, n) {
  if (n == null) return n;
  switch (i) {
    case "boolean":
    case "checkbox":
      return typeof n == "boolean" ? n : n === "true" ? !0 : n === "false" ? !1 : n;
    case "number":
    case "integer": {
      if (typeof n == "number") return n;
      if (typeof n == "string" && n.trim() !== "") {
        const p = Number(n);
        if (!Number.isNaN(p)) return p;
      }
      return n;
    }
    case "object":
    case "array":
      if (typeof n == "string")
        try {
          const p = JSON.parse(n);
          if (p && typeof p == "object") return p;
        } catch {
        }
      return n;
    default:
      return n;
  }
}
function Xe(i, n) {
  if (!n) return i;
  const p = {};
  for (const [f, u] of Object.entries(i))
    p[f] = Qe(n[f], u);
  return p;
}
function _e(i, n, p) {
  if (n !== void 0 && !n) return null;
  const f = K(i) ? i : {}, u = [
    f,
    K(f.data) ? f.data : null,
    K(f.payload) ? f.payload : null,
    K(f.detail) ? f.detail : null
  ].filter(Boolean);
  for (const l of u) {
    if (l.event !== "component.meta.changed" && l.event !== "component.deleting" && l.event !== "component.deleted") continue;
    const w = String(l.component_id || ""), C = String(f.topic || l.topic || "");
    if (n === void 0) {
      if (!w && (!C.startsWith("component.") || C === "component.")) continue;
    } else if (w && w !== n || !w && C !== `component.${n}`) continue;
    const S = w || n || C.slice(10);
    return l.event === "component.deleting" && typeof l.deletion_job_id == "string" && l.deletion_job_id ? { event: l.event, component_id: S, deletion_job_id: l.deletion_job_id } : l.event !== "component.meta.changed" ? { event: l.event, component_id: S } : {
      event: "component.meta.changed",
      component_id: S,
      meta: Xe(K(l.meta) ? l.meta : {}, p),
      deleted: Array.isArray(l.deleted) ? l.deleted.map(String) : []
    };
  }
  return null;
}
function et(i, n, p) {
  const f = _e(i, n, p);
  return f?.event === "component.meta.changed" ? f : null;
}
function tt(i, n) {
  const p = _e(i, n);
  return p && p.event !== "component.meta.changed" ? p : null;
}
function nt(i, n, p) {
  if (!i) return null;
  const f = fe(`component.${i}`, (u) => {
    const l = et(u, i, p);
    l && n(l);
  });
  return typeof f == "function" ? f : null;
}
function ot(i, n, p, f) {
  const u = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map();
  function w(N, h) {
    const g = i.value.find((O) => n(O) === N), d = l.get(N), b = h?.job_id || d?.state.deletion_job_id || g?.deletion_job_id, E = d ? d.state.deletion_job_id : g?.deleting_at ? g.deletion_job_id : void 0;
    if ((d || g?.deleting_at) && b === E || b && d?.superseded.has(b)) return;
    const x = {
      deleting_at: d?.state.deleting_at || g?.deleting_at || (/* @__PURE__ */ new Date()).toISOString(),
      deletion_job_id: b
    }, D = new Set(d?.superseded);
    for (const O of [d?.state.deletion_job_id, g?.deletion_job_id])
      O && O !== b && D.add(O);
    l.set(N, { state: x, superseded: D }), g && (Object.assign(g, x), g.deletion_job = void 0);
  }
  const C = Te(() => i.value, (N, h = []) => {
    const g = N.filter((d) => !u.has(n(d)));
    for (const d of h)
      u.has(n(d)) || g.some((b) => n(b) === n(d)) || d.deleting_at && f?.(n(d));
    if (g.length !== N.length) {
      i.value = g;
      return;
    }
    for (const d of N) {
      d.deleting_at && d.deletion_job === void 0 && !h.includes(d) && (d.deletion_job = null);
      const b = l.get(n(d));
      if (b) {
        const x = d.deletion_job_id;
        d.deleting_at && x && x !== b.state.deletion_job_id && !b.superseded.has(x) && (b.state.deletion_job_id && b.superseded.add(b.state.deletion_job_id), b.state.deletion_job_id = x), x !== b.state.deletion_job_id && (d.deletion_job = void 0), Object.assign(d, b.state);
      }
      const E = h.find((x) => n(x) === n(d));
      d.deletion_job === void 0 && E?.deletion_job_id === d.deletion_job_id && (d.deletion_job = E?.deletion_job);
    }
  }, { immediate: !0 }), S = fe("@message", (N) => {
    const h = tt(N);
    if (!h) return;
    const g = i.value.find((d) => n(d) === h.component_id);
    h.event === "component.deleted" ? (g && !u.has(h.component_id) && f?.(h.component_id), u.add(h.component_id), l.delete(h.component_id), i.value = i.value.filter((d) => n(d) !== h.component_id)) : g && w(h.component_id, { job_id: h.deletion_job_id });
  });
  return pe(() => {
    C(), typeof S == "function" && S();
  }), { acceptDeletion: w };
}
function st() {
  let i = 0;
  return () => {
    const n = ++i;
    return () => n === i;
  };
}
function it({ providers: i, connections: n, search: p, confirmId: f }) {
  const u = (o) => o.provider ?? "", l = (o) => o.title ?? o.name ?? o.oauth_provider ?? "Provider", w = (o) => o.icon || "tabler:plug", C = Z(() => {
    const o = {};
    for (const a of i.value) {
      const k = u(a);
      k && (o[k] = a);
    }
    return o;
  });
  function S(o) {
    return o.icon || C.value[o.provider || ""]?.icon || "tabler:plug-connected";
  }
  function N(o) {
    return o.provider ? C.value[o.provider] : void 0;
  }
  function h(o) {
    return new Set((o.scopes_granted ?? []).filter((a) => typeof a == "string" && a.length > 0));
  }
  function g(o) {
    return new Set((o?.default_scopes ?? []).filter((a) => typeof a == "string" && a.length > 0));
  }
  function d(o) {
    return (o?.available_scopes ?? []).map((a) => a.scope).filter((a) => typeof a == "string" && a.length > 0);
  }
  function b(o) {
    const a = g(o);
    return d(o).some((k) => !a.has(k));
  }
  function E(o) {
    if (!o.oauth) return !1;
    const a = N(o);
    if (!b(a)) return !1;
    const k = h(o), A = g(a);
    if (k.size === 0 || A.size === 0) return !1;
    for (const Q of k)
      if (!A.has(Q)) return !1;
    return !0;
  }
  function x(o) {
    return ze(o.connection_state, o.expires_at);
  }
  function D(o) {
    const a = x(o);
    return a === "connected" && E(o) ? "warn" : Ue[a];
  }
  function O(o) {
    const a = x(o);
    return a === "connected" && E(o) ? "Limited access" : Ve[a];
  }
  function V(o) {
    const a = Number(o.expires_at || 0);
    if (!a) return "";
    const k = a - Math.floor(Date.now() / 1e3);
    return k <= 0 ? "token expired" : k < 3600 ? `expires in ${Math.max(1, Math.floor(k / 60))}m` : k < 86400 ? `expires in ${Math.floor(k / 3600)}h` : `expires in ${Math.floor(k / 86400)}d`;
  }
  function U(o) {
    const a = [];
    if (o.provider && a.push(o.provider), o.oauth) {
      E(o) && a.push("sign-in only");
      const k = V(o);
      k && a.push(k), Number(o.scope_count || 0) > 0 && a.push(`${o.scope_count} scope${o.scope_count === 1 ? "" : "s"}`);
    }
    return a.join(" · ");
  }
  function L(o) {
    if (f.value === o.component_id) return "Click the check again to remove this connection.";
    const a = x(o);
    return a === "expired" ? "The stored access token is expired; reconnect or wait for refresh." : a === "needs_reauth" ? `Reauthorize this connection to restore access.${o.reauth_reason ? " " + o.reauth_reason : ""}` : a === "disabled" ? "This connection is disabled and will not be used." : E(o) ? "Reauthorize this connection to grant service scopes." : o.oauth ? "OAuth connection available for agents and automations." : "Connection available for agents and automations.";
  }
  function T(o) {
    const a = p.value.trim().toLowerCase();
    return !a || o.toLowerCase().includes(a);
  }
  const R = Z(() => i.value.filter((o) => T(`${l(o)} ${o.description ?? ""} ${(o.classes ?? []).join(" ")}`))), q = Z(() => n.value.filter((o) => T(`${o.name ?? ""} ${o.provider ?? ""}`)));
  return {
    providerKey: u,
    providerLabel: l,
    providerIcon: w,
    connIcon: S,
    providerForConnection: N,
    grantedScopeSet: h,
    defaultScopeSet: g,
    availableScopeValues: d,
    hasOptionalProviderScopes: b,
    hasSignInOnlyScopes: E,
    connectionState: x,
    statusClass: D,
    statusLabel: O,
    expiryText: V,
    statusDetail: U,
    connectionDescription: L,
    filteredProviders: R,
    filteredConnections: q
  };
}
const rt = { class: "conn-page" }, at = { class: "kx-head" }, lt = { class: "kx-head-icon" }, ct = { class: "kx-head-actions" }, dt = {
  class: "kx-search",
  role: "search"
}, ut = { class: "conn-body" }, pt = {
  key: 0,
  class: "conn-loading"
}, ft = {
  key: 1,
  class: "conn-empty au d1"
}, vt = { class: "lt-empty-hero is-danger" }, _t = { class: "e-sub" }, ht = {
  key: 0,
  class: "msg err au"
}, mt = {
  key: 1,
  class: "block au d1"
}, gt = { class: "live-grid" }, bt = { class: "lc-top" }, yt = { class: "lc-ico" }, kt = { class: "lc-top-r" }, Ct = ["title", "aria-label", "onClick", "disabled"], St = ["title", "aria-label", "onClick", "disabled"], xt = ["title", "aria-label", "onClick", "disabled"], $t = { class: "lc-name" }, jt = { class: "lc-desc" }, wt = { class: "lc-primary" }, Nt = {
  key: 0,
  class: "lc-secondary"
}, Et = {
  key: 0,
  class: "list-foot"
}, Pt = ["disabled"], Mt = {
  key: 2,
  class: "conn-empty au d1"
}, Ot = { class: "lt-empty-hero is-success" }, Tt = {
  key: 3,
  class: "block au d2"
}, Dt = { class: "block-head" }, Lt = { class: "lt-section-header" }, At = { class: "setup-grid" }, Rt = ["data-provider-key", "onClick"], Bt = { class: "setup-ico" }, It = { class: "setup-text" }, Vt = { class: "setup-name" }, Ut = { class: "setup-desc" }, zt = {
  key: 4,
  class: "conn-empty au d1"
}, Ht = { class: "lt-empty-hero is-info" }, Kt = { class: "e-title" }, Wt = {
  key: 5,
  class: "conn-empty au d2"
}, qt = { class: "lt-empty-hero is-info" }, Ft = 100, Gt = /* @__PURE__ */ ue({
  __name: "connections",
  setup(i) {
    const n = j([]), p = j([]), f = j(!0), u = j(!1), l = j(""), w = j(""), C = j(""), S = j(""), N = it({ providers: p, connections: n, search: S, confirmId: C }), {
      providerKey: h,
      providerLabel: g,
      providerIcon: d,
      connIcon: b,
      statusClass: E,
      statusLabel: x,
      statusDetail: D,
      connectionDescription: O,
      filteredProviders: V,
      filteredConnections: U
    } = N, L = j(0), T = j(!1), R = j(!1), q = j(void 0), o = j(void 0), a = j(!1), k = j(null), A = j(null);
    function Q(s) {
      return `/api/v1/connections?${new URLSearchParams({
        limit: String(Ft),
        offset: String(s)
      }).toString()}`;
    }
    async function re(s) {
      const { data: e } = await J.get(Q(s));
      if (!e?.success) throw Object.assign(new Error("Could not load connections."), { response: { data: e } });
      return e;
    }
    const ae = st();
    async function z() {
      const s = ae();
      f.value = !0, u.value = !1, l.value = "", w.value = "";
      try {
        const [e, t, v] = await Promise.all([
          re(0),
          J.get("/api/v1/oauth/providers/discover"),
          J.get("/api/v1/connections/providers/discover")
        ]);
        if (!s()) return;
        n.value = e.connections ?? [], L.value = Number(e.total_count ?? n.value.length), T.value = !!e.has_more, ee(), p.value = me([
          ...t.data?.providers ?? [],
          ...v.data?.providers ?? []
        ]);
      } catch (e) {
        if (!s()) return;
        n.value.length ? l.value = Y(e) : w.value = Y(e), ee();
      } finally {
        s() && (f.value = !1);
      }
    }
    async function he() {
      if (f.value || u.value || !T.value) return;
      const s = ae();
      u.value = !0, l.value = "";
      try {
        const e = await re(n.value.length);
        if (!s()) return;
        const t = e.connections ?? [];
        n.value = [...n.value, ...t], L.value = Number(e.total_count ?? L.value), T.value = !!e.has_more, ee();
      } catch (e) {
        s() && (l.value = Y(e));
      } finally {
        s() && (u.value = !1);
      }
    }
    function me(s) {
      const e = {};
      for (const t of s) {
        const v = h(t);
        v && (e[v] = e[v] ? { ...t, ...e[v] } : t);
      }
      return Object.values(e);
    }
    function ge(s) {
      return Array.isArray(s) ? s.filter((e) => typeof e == "string" && e.length > 0) : typeof s != "string" ? [] : s.split(/\s+/).filter(Boolean);
    }
    function be(s, e, t = []) {
      const v = {};
      if (typeof e.title == "string" && (v.name = e.title), typeof e.provider == "string" && (v.provider = e.provider), typeof e.icon == "string" && (v.icon = e.icon), typeof e.connection_state == "string" && (v.connection_state = e.connection_state), typeof e.reauth_reason == "string" && (v.reauth_reason = e.reauth_reason), typeof e.expires_at == "number" && (v.expires_at = e.expires_at), typeof e.refresh_expires_at == "number" && (v.refresh_expires_at = e.refresh_expires_at), typeof e.last_token_refresh == "string" && (v.last_token_refresh = e.last_token_refresh), typeof e.scopes_granted == "string") {
        const H = ge(e.scopes_granted);
        v.scopes_granted = H, v.scope_count = H.length;
      }
      typeof e.oauth_connection == "boolean" && (v.oauth = e.oauth_connection);
      const I = { ...s, ...v };
      for (const H of t) {
        const Ne = H === "title" ? "name" : H;
        delete I[Ne];
      }
      return I;
    }
    const B = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Set();
    let X = 0;
    function ye(s, e) {
      n.value = n.value.map((t) => t.component_id === s ? be(t, e.meta || {}, e.deleted || []) : t);
    }
    function ke() {
      X++, F.clear();
      for (const s of B.values()) s();
      B.clear();
    }
    function ee() {
      const s = new Set(n.value.map((t) => t.component_id).filter(Boolean));
      for (const [t, v] of B)
        s.has(t) || (v(), B.delete(t));
      const e = X;
      for (const t of s) {
        if (B.has(t) || F.has(t)) continue;
        F.add(t);
        const v = nt(t, (I) => ye(t, I), He);
        if (F.delete(t), !!v) {
          if (e !== X || !n.value.some((I) => I.component_id === t)) {
            v();
            continue;
          }
          B.set(t, v);
        }
      }
    }
    function te(s, e) {
      q.value = s, o.value = e, R.value = !0;
    }
    async function Ce(s) {
      k.value = s, a.value = !0, await Re(), await xe();
    }
    function Se() {
      a.value = !1, k.value = null;
    }
    async function xe() {
      const s = k.value;
      if (!A.value || !s) return;
      if (A.value.innerHTML = "", !customElements.get("kickside-share"))
        try {
          await Ie("kickside-share", { timeoutMs: 8e3 });
        } catch {
        }
      const e = document.createElement("kickside-share");
      e.setAttribute("config", JSON.stringify({
        resource_id: s.component_id,
        access_url: `/api/v1/component-access/grants/${encodeURIComponent(s.component_id)}`,
        share_url: `/api/v1/component-access/share/${encodeURIComponent(s.component_id)}`,
        title: s.name || s.provider || "Connection"
      })), e.style.display = "block", e.addEventListener("close", Se), A.value.appendChild(e);
    }
    function $e(s) {
      if (!s.provider) return;
      const e = p.value.find((t) => h(t) === s.provider);
      te(s.provider, s.oauth || e?.create_ui_id ? { componentId: s.component_id, name: s.name } : void 0);
    }
    function je() {
      R.value = !1, o.value = void 0, n.value = [], z();
    }
    async function le(s) {
      if (C.value !== s.component_id) {
        C.value = s.component_id;
        return;
      }
      C.value = "", l.value = "";
      try {
        const { data: e } = await J.delete(`/api/v1/connections/${encodeURIComponent(s.component_id)}`);
        if (!e?.success) throw new Error(e?.error || "delete failed");
        we(s.component_id, e), await z();
      } catch (e) {
        l.value = Y(e);
      }
    }
    Me(z), pe(ke);
    const { acceptDeletion: we } = ot(n, (s) => s.component_id, void 0, z);
    return (s, e) => (_(), m("div", rt, [
      r("header", at, [
        r("div", lt, [
          y(c($), {
            icon: "tabler:plug-connected",
            "aria-hidden": "true"
          })
        ]),
        e[4] || (e[4] = r("div", { class: "kx-head-text" }, [
          r("h1", { class: "kx-title" }, "Connections"),
          r("p", { class: "kx-head-sub" }, "Connect external services and manage them here.")
        ], -1)),
        r("div", ct, [
          r("label", dt, [
            y(c($), {
              icon: "tabler:search",
              class: "kx-search-ico",
              "aria-hidden": "true"
            }),
            De(r("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (t) => S.value = t),
              class: "kx-search-input",
              type: "search",
              placeholder: "Search services",
              "aria-label": "Search services"
            }, null, 512), [
              [Le, S.value]
            ]),
            S.value ? (_(), m("button", {
              key: 0,
              class: "kx-search-clear",
              onClick: e[1] || (e[1] = (t) => S.value = ""),
              "aria-label": "Clear search"
            }, [
              y(c($), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ])) : M("", !0)
          ]),
          y(c(ie), {
            label: "Connect app",
            onClick: e[2] || (e[2] = (t) => te())
          }, {
            icon: ce(() => [
              y(c($), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ]),
      r("div", ut, [
        f.value && !n.value.length ? (_(), m("div", pt, "Loading…")) : w.value ? (_(), m("section", ft, [
          r("div", vt, [
            y(c($), { icon: "tabler:plug-x" })
          ]),
          e[5] || (e[5] = r("div", { class: "e-title" }, "Couldn't load connections", -1)),
          r("div", _t, P(w.value), 1),
          y(c(ie), {
            label: "Try again",
            class: "conn-retry",
            onClick: z
          }, {
            icon: ce(() => [
              y(c($), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])) : (_(), m(W, { key: 2 }, [
          l.value ? (_(), m("div", ht, [
            y(c($), { icon: "tabler:alert-circle" }),
            se(P(l.value), 1)
          ])) : M("", !0),
          c(U).length ? (_(), m("section", mt, [
            e[8] || (e[8] = r("div", { class: "block-head" }, [
              r("h2", { class: "lt-section-header" }, "Your connections")
            ], -1)),
            r("div", gt, [
              (_(!0), m(W, null, de(c(U), (t) => (_(), m("div", {
                key: t.component_id,
                class: G(["live-card s-live", `state-${c(E)(t)}`])
              }, [
                y(Ze, {
                  state: t,
                  onRetry: (v) => {
                    C.value = t.component_id, le(t);
                  }
                }, null, 8, ["state", "onRetry"]),
                r("div", bt, [
                  r("div", yt, [
                    y(c($), {
                      icon: c(b)(t),
                      "aria-hidden": "true"
                    }, null, 8, ["icon"])
                  ]),
                  r("div", kt, [
                    r("button", {
                      class: "lc-add",
                      title: `Share ${t.name || t.provider}`,
                      "aria-label": `Share ${t.name || t.provider}`,
                      onClick: (v) => Ce(t),
                      disabled: !!t.deleting_at
                    }, [
                      y(c($), { icon: "tabler:share" })
                    ], 8, Ct),
                    r("button", {
                      class: "lc-add",
                      title: `Reconnect ${t.name || t.provider}`,
                      "aria-label": `Reconnect ${t.name || t.provider}`,
                      onClick: (v) => $e(t),
                      disabled: !!t.deleting_at
                    }, [
                      y(c($), { icon: "tabler:refresh" })
                    ], 8, St),
                    r("button", {
                      class: G(["lc-add lc-danger", C.value === t.component_id && "armed"]),
                      title: C.value === t.component_id ? "Click again to remove" : `Remove ${t.name || t.provider}`,
                      "aria-label": `Remove ${t.name || t.provider}`,
                      onClick: (v) => le(t),
                      disabled: !!t.deleting_at
                    }, [
                      y(c($), {
                        icon: C.value === t.component_id ? "tabler:check" : "tabler:trash"
                      }, null, 8, ["icon"])
                    ], 10, xt)
                  ])
                ]),
                r("div", $t, P(t.name || t.provider || "Connection"), 1),
                r("div", jt, P(c(O)(t)), 1),
                r("div", {
                  class: G(["lc-status", `state-${c(E)(t)}`])
                }, [
                  e[6] || (e[6] = r("span", { class: "dot" }, null, -1)),
                  r("span", wt, P(c(x)(t)), 1),
                  c(D)(t) ? (_(), m("span", Nt, "· " + P(c(D)(t)), 1)) : M("", !0)
                ], 2)
              ], 2))), 128))
            ]),
            L.value || T.value ? (_(), m("div", Et, [
              r("span", null, P(n.value.length) + " of " + P(L.value || n.value.length) + " loaded", 1),
              T.value ? (_(), m("button", {
                key: 0,
                class: "ghost-action",
                disabled: f.value || u.value,
                onClick: he
              }, [
                y(c($), {
                  icon: u.value ? "tabler:loader-2" : "tabler:chevron-down",
                  class: G(u.value && "spin")
                }, null, 8, ["icon", "class"]),
                e[7] || (e[7] = se(" Load more ", -1))
              ], 8, Pt)) : M("", !0)
            ])) : M("", !0)
          ])) : !S.value && p.value.length ? (_(), m("section", Mt, [
            r("div", Ot, [
              y(c($), { icon: "tabler:plug-connected" })
            ]),
            e[9] || (e[9] = r("div", { class: "e-title" }, "Connect your first app", -1)),
            e[10] || (e[10] = r("div", { class: "e-sub" }, "Pick a service below — your agents and automations will read events and act through it.", -1))
          ])) : M("", !0),
          c(V).length ? (_(), m("section", Tt, [
            r("div", Dt, [
              r("h2", Lt, P(c(U).length ? "Add another" : "Available services"), 1)
            ]),
            r("div", At, [
              (_(!0), m(W, null, de(c(V), (t) => (_(), m("button", {
                key: c(h)(t),
                "data-provider-key": c(h)(t),
                class: "setup-card",
                onClick: (v) => te(c(h)(t))
              }, [
                r("div", Bt, [
                  y(c($), {
                    icon: c(d)(t),
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                r("div", It, [
                  r("div", Vt, P(c(g)(t)), 1),
                  r("div", Ut, P(t.description || `Set up ${c(g)(t)}`), 1)
                ]),
                y(c($), {
                  icon: "tabler:arrow-right",
                  class: "setup-arrow",
                  "aria-hidden": "true"
                })
              ], 8, Rt))), 128))
            ])
          ])) : S.value ? (_(), m("section", zt, [
            r("div", Ht, [
              y(c($), { icon: "tabler:search-off" })
            ]),
            r("div", Kt, "No services match “" + P(S.value) + "”", 1)
          ])) : !p.value.length && !n.value.length ? (_(), m("section", Wt, [
            r("div", qt, [
              y(c($), { icon: "tabler:plug-x" })
            ]),
            e[11] || (e[11] = r("div", { class: "e-title" }, "No providers available", -1)),
            e[12] || (e[12] = r("div", { class: "e-sub" }, "Install a provider module to add a connection here.", -1))
          ])) : M("", !0)
        ], 64))
      ]),
      R.value ? (_(), Ae(Be, {
        key: 0,
        providers: p.value,
        provider: q.value,
        reauth: o.value,
        onClose: e[3] || (e[3] = (t) => R.value = !1),
        onConnected: je
      }, null, 8, ["providers", "provider", "reauth"])) : M("", !0),
      a.value ? (_(), m("div", {
        key: 1,
        ref_key: "shareHost",
        ref: A
      }, null, 512)) : M("", !0)
    ]));
  }
}), tn = {
  rootComponent: Gt,
  plugins: [Oe]
};
export {
  tn as mountConfig
};
//# sourceMappingURL=lazy-mount-DDCYcnKb.js.map
