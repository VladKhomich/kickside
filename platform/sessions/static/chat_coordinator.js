import { u as Tt, a as Et, W as Bt } from "./wc-runtime-C6gaf4iX.js";
import { defineComponent as Lt, onMounted as Mt, onBeforeUnmount as Nt, openBlock as xt, createElementBlock as $t, nextTick as Ft } from "vue";
import { getLayoutManager as Ht, on as Kt, config as jt, define as Wt } from "@wippy-fe/proxy";
import { p as ct, f as ut, A as V, C as a, g as B, l as zt, d as Jt, h as L, j as lt, k as ft, n as pt, i as M, o as Q, M as Y, m as dt, c as Z, q as ht, r as tt, s as yt } from "./hostRoute-uRovXTvG.js";
import { e as Xt, c as Gt } from "./chatStart-Bxe6JK-R.js";
function Ut(m, I, o) {
  let r = null, i = "", u = "", d = 0;
  function p() {
    !r || !i || i !== I() || u === r.value || (u = r.value, d++, o.write(i, u));
  }
  function w() {
    const l = m.querySelector("textarea.chat-input__textarea"), f = I();
    if (l === r && f === i) {
      p();
      return;
    }
    const O = i;
    r = l, i = f;
    const y = ++d;
    if (!l || !f) return;
    u = l.value, O && O !== f && D(""), o.read(f).then((b) => {
      y === d && f === I() && b !== void 0 && D(b);
    });
    function D(b) {
      !l || l.value === b || (u = l.value = b, l.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })));
    }
  }
  const v = (l) => {
    l.target === r && p();
  };
  m.addEventListener("input", v);
  const R = new MutationObserver(w);
  return R.observe(m, { subtree: !0, childList: !0, attributes: !0, attributeFilter: ["disabled"] }), w(), {
    sync: w,
    dispose() {
      d++, R.disconnect(), m.removeEventListener("input", v);
    }
  };
}
const Vt = 65536, Qt = 100;
function Yt(m) {
  const I = m();
  let o = !!I;
  const r = /* @__PURE__ */ new Map();
  function i() {
    return o && I !== m() && (r.clear(), o = !1), o;
  }
  return {
    async read(u) {
      return i() ? r.get(u) ?? "" : void 0;
    },
    write(u, d) {
      if (!(!i() || d.length > Vt) && (r.delete(u), d && r.set(u, d), r.size > Qt)) {
        const p = r.keys().next().value;
        p && r.delete(p);
      }
    }
  };
}
const Zt = { "aria-hidden": "true" }, te = "kickside:chat-start", gt = "chat-tab", mt = "kickside:chat-draft", ee = '[data-wippy-panel-mount="chat"] .layout-chat-wrapper', ne = /* @__PURE__ */ Lt({
  __name: "ChatCoordinator",
  setup(m) {
    const I = {
      kind: "builtin",
      id: "@HOST/panel-tab",
      chrome: !1,
      anchor: { right: 0, top: "50%" },
      position: { x: 0, y: 0 },
      size: { width: 48, height: 80 },
      props: { target: a, mode: "auto", label: "Open chat" }
    }, o = Tt(), r = Et(), i = o ? Ht(o) : null, u = Yt(() => jt.auth?.token);
    let d = null, p, w;
    const v = [], R = () => window.location.pathname + window.location.search + window.location.hash;
    let l = R(), f = ct(l), O = "", y = null, D = "default", b = "|", vt = 0, F = !1, H = !1, K = "", c = null, q = null;
    const T = /* @__PURE__ */ new Map();
    function S(t) {
      return typeof t == "string" ? t : "";
    }
    function g() {
      return zt(o);
    }
    function k() {
      if (!i) throw new Error("[kickside-chat-coordinator] used before it started");
      return i;
    }
    function C(t) {
      const e = Jt(t);
      return ct(e ?? l);
    }
    function N(t) {
      return `${t.path}${t.search}${t.hash}`;
    }
    function j(t) {
      const e = L(t, a);
      return `${S(e.sessionId)}|${e.startRequest ?? ""}`;
    }
    function _(t) {
      "sessionId" in t && (q = S(t.sessionId)), o?.layout.updatePanel(a, { props: t });
    }
    function bt(t) {
      const e = L(t, a);
      c && e.startRequest === c.request && !S(e.sessionId) && (c.seen = !0), q !== null && S(e.sessionId) === q && (q = null);
    }
    function W(t) {
      if (!t) return;
      const e = k();
      lt(ft(t, e.activeBreakpoint, a)) ? e.openDrawer(a) : e.expandPanel(a);
    }
    function E(t) {
      if (!t) return;
      const e = k();
      lt(ft(t, e.activeBreakpoint, a)) ? e.closeDrawer(a) : e.collapsePanel(a);
    }
    function z(t) {
      const e = k().activeBreakpoint;
      return {
        chat: pt(t, e, a),
        artifact: pt(t, e, V)
      };
    }
    function St(t) {
      const { chat: e, artifact: n } = z(t);
      if (e && n) {
        const s = !F;
        !H && !s ? k().closeDrawer(a) : s && k().closeDrawer(V);
      }
      F = e, H = n;
    }
    function et(t) {
      for (const [e, n] of Object.entries(t?.floating ?? {}))
        !M(n) || !M(n.props) || n.props.target !== a || T.has(e) || (T.set(e, JSON.parse(JSON.stringify(n))), o?.layout.removeFloating(e));
    }
    function J() {
      for (const [t, e] of T) o?.layout.addFloating(t, e);
      T.clear();
    }
    function nt(t, e) {
      y = { sessionId: t, from: e }, x();
    }
    function x() {
      if (!y) return;
      const { sessionId: t, from: e } = y, n = N(e);
      R() !== n || O !== n || (y = null, o?.navigate(`${Z(t)}${e.search}${e.hash}`, { replace: !0 }));
    }
    function st(t, e) {
      !t || !M(t.context) || o?.setContext(t.context, e, t.source);
    }
    function ot(t, e) {
      return B(e.path) || t.sidebar === !1;
    }
    function P(t) {
      const e = c !== null != (t !== null);
      c = t, e && r?.broadcast(te, { pending: t !== null });
    }
    function $() {
      const t = c;
      t && (P(null), _({ startRequest: null, sessionId: t.previousSessionId || null }));
    }
    function It(t, e) {
      const n = g(), s = C(n);
      if (st(t.context, e), ot(t, s)) {
        $(), o?.navigate(Z(e));
        return;
      }
      P(null), _({ sessionId: e, startRequest: null }), W(n);
    }
    async function kt(t) {
      let e;
      try {
        e = await Xt(t.token);
      } catch {
        if (c !== t) return;
        $(), o?.toast({ severity: "error", summary: "Could not start chat" });
        return;
      }
      if (c !== t) {
        Gt(e);
        return;
      }
      if (P(null), st(t.context, e), t.fullPage) {
        _({ sessionId: t.previousSessionId || null, startRequest: null }), o?.navigate(Z(e));
        return;
      }
      _({ sessionId: e, startRequest: null });
      const n = C(g());
      tt(n) && nt(e, n);
    }
    function Ct(t, e) {
      const n = g(), s = C(n), h = ot(t, s), A = ht(s.path);
      if (h && n && Q(n, k().activeBreakpoint, a) && E(n), c?.token === e && c)
        Object.assign(c, { fullPage: h, context: t.context, section: A });
      else {
        const qt = c?.previousSessionId ?? q ?? S(L(n, a).sessionId), U = {
          token: e,
          request: ++vt,
          fullPage: h,
          context: t.context,
          section: A,
          previousSessionId: qt,
          seen: !1
        };
        P(U), _({ startRequest: U.request, sessionId: null }), kt(U);
      }
      h || W(n);
    }
    function _t() {
      return S(L(g(), a).sessionId);
    }
    function X(t) {
      const e = Q(t, k().activeBreakpoint, a), n = e ? document.querySelector(ee) : null;
      n !== d && (w?.dispose(), d = n, w = n ? Ut(n, _t, u) : void 0), !e || n ? (p?.disconnect(), p = void 0) : p || (p = new MutationObserver(() => {
        const s = g();
        s && X(s);
      }), p.observe(document.body, { childList: !0, subtree: !0 })), w?.sync();
    }
    function rt(t) {
      const e = g();
      return dt(e) && yt(C(e).path) === t;
    }
    async function Pt(t) {
      if (t.sourcePanelId !== Y || !M(t.payload)) return;
      const { kind: e, sessionId: n, requestId: s, draft: h } = t.payload;
      if (!(typeof n != "string" || !n || !rt(n)) && (e === "write" && typeof h == "string" && u.write(n, h), e === "read" && typeof s == "number")) {
        const A = await u.read(n);
        rt(n) && r?.send(Y, mt, { requestId: s, draft: A });
      }
    }
    function At(t) {
      if (t.channel === mt) {
        Pt(t);
        return;
      }
      if (t.channel !== "@HOST/intent" || !M(t.payload)) return;
      if (t.payload.intent === "routeChanged" && t.sourcePanelId === Y && dt(g()) && typeof t.payload.route == "string") {
        O = t.payload.route, x();
        return;
      }
      const e = t.payload, n = S(e.uuid), s = S(e.startToken);
      if (e.intent === "openSession" && n) {
        t.sourcePanelId === a ? (c && (P(null), _({ sessionId: n, startRequest: null })), Ft(() => w?.sync())) : It(e, n);
        return;
      }
      e.intent === "startChat" && s && Ct(e, s);
    }
    function Rt(t, e, n) {
      y && (tt(e) ? y.from = e : y = null);
      let s = S(L(n, a).sessionId);
      c?.fullPage && ht(e.path) !== c.section && (s = c.previousSessionId, $());
      const h = B(t.path), A = B(e.path);
      if (A && !h)
        E(n), et(n), s && tt(e) && nt(s, e);
      else if (!A && h) {
        const G = yt(t.path);
        G && (P(null), _({ sessionId: G, startRequest: null })), E(n), J();
      }
    }
    function Dt(t) {
      const e = j(t);
      e !== b && (e === "|" && (c?.seen && P(null), y = null), b = e), St(t);
    }
    function at(t) {
      const { chat: e, artifact: n } = z(t);
      return `${N(C(t))}#${j(t)}#${e}#${n}`;
    }
    function it() {
      const t = g();
      if (!t) return;
      bt(t), X(t);
      const e = at(t);
      if (e === K) {
        x();
        return;
      }
      K = e;
      const n = f;
      f = C(t), N(n) !== N(f) && Rt(n, f, t), Dt(t), x();
    }
    function Ot() {
      const t = g();
      if (!t) return;
      const e = ut(t, k().activeBreakpoint), n = D;
      e !== n && (D = e, Q(t, n, a) && !B(f.path) ? W(t) : E(t));
    }
    return Mt(() => {
      const t = g();
      if (!o || !i || !r || !t) {
        console.error("[kickside-chat-coordinator] not started: needs a managed layout host with a layout manager, a layout bus and a layout snapshot", {
          host: !!o,
          manager: !!i,
          bus: !!r,
          snapshot: !!t
        });
        return;
      }
      f = C(t), D = ut(t, i.activeBreakpoint), b = j(t);
      const { chat: e, artifact: n } = z(t);
      e && n && i.closeDrawer(V), F = e, H = n && !e, K = at(t), t.floating?.[gt] || T.set(gt, I), B(f.path) ? (E(t), et(t)) : J(), X(t), v.push(r.subscribe(At)), v.push(i.on("change", it)), v.push(i.on("breakpoint", Ot)), v.push(Kt("@history", ({ path: s }) => {
        l = s === window.location.pathname ? R() : s, it();
      }));
    }), Nt(() => {
      v.forEach((t) => t()), v.length = 0, p?.disconnect(), w?.dispose(), $(), J();
    }), (t, e) => (xt(), $t("span", Zt));
  }
});
class wt extends Bt {
  static get wippyConfig() {
    return { propsSchema: { type: "object", properties: {} } };
  }
  static get vueConfig() {
    return { rootComponent: ne };
  }
}
async function ce() {
  return wt;
}
Wt(import.meta.url, wt);
export {
  ce as webComponent
};
//# sourceMappingURL=chat_coordinator.js.map
