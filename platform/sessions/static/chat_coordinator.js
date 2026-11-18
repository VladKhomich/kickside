import { u as Et, a as Tt, W as Bt } from "./wc-runtime-C6gaf4iX.js";
import { defineComponent as Lt, onMounted as xt, onBeforeUnmount as Mt, openBlock as Nt, createElementBlock as $t, nextTick as Ft } from "vue";
import { getLayoutManager as Ht, on as Kt, config as jt, define as Wt } from "@wippy-fe/proxy";
import { p as ct, f as ut, A as G, C as a, g as B, l as zt, d as Jt, h as L, j as lt, k as ft, n as dt, i as x, o as Q, M as Y, m as pt, c as Z, q as ht, r as tt, s as yt } from "./hostRoute-uRovXTvG.js";
import { e as Ut, c as Vt } from "./chatStart-BRbzaCmr.js";
function Xt(m, I, s) {
  let r = null, i = "", u = "", h = 0;
  function d() {
    !r || !i || i !== I() || u === r.value || (u = r.value, h++, s.write(i, u));
  }
  function w() {
    const l = m.querySelector("textarea.chat-input__textarea"), f = I();
    if (l === r && f === i) {
      d();
      return;
    }
    const O = i;
    r = l, i = f;
    const y = ++h;
    if (!l || !f) return;
    u = l.value, O && O !== f && D(""), s.read(f).then((b) => {
      y === h && f === I() && b !== void 0 && D(b);
    });
    function D(b) {
      !l || l.value === b || (u = l.value = b, l.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })));
    }
  }
  const v = (l) => {
    l.target === r && d();
  };
  m.addEventListener("input", v);
  const R = new MutationObserver(w);
  return R.observe(m, { subtree: !0, childList: !0, attributes: !0, attributeFilter: ["disabled"] }), w(), {
    sync: w,
    dispose() {
      h++, R.disconnect(), m.removeEventListener("input", v);
    }
  };
}
const Gt = 100;
function Qt(m) {
  const I = m();
  let s = !!I;
  const r = /* @__PURE__ */ new Map();
  function i() {
    return s && I !== m() && (r.clear(), s = !1), s;
  }
  return {
    async read(u) {
      return i() ? r.get(u) ?? "" : void 0;
    },
    write(u, h) {
      if (i() && (r.delete(u), h && r.set(u, h), r.size > Gt)) {
        const d = r.keys().next().value;
        d && r.delete(d);
      }
    }
  };
}
const Yt = { "aria-hidden": "true" }, Zt = "kickside:chat-start", gt = "chat-tab", mt = "kickside:chat-draft", te = '[data-wippy-panel-mount="chat"] .layout-chat-wrapper', ee = /* @__PURE__ */ Lt({
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
    }, s = Et(), r = Tt(), i = s ? Ht(s) : null, u = Qt(() => jt.auth?.token);
    let h = null, d, w;
    const v = [], R = () => window.location.pathname + window.location.search + window.location.hash;
    let l = R(), f = ct(l), O = "", y = null, D = "default", b = "|", vt = 0, F = !1, H = !1, K = "", c = null, q = null;
    const E = /* @__PURE__ */ new Map();
    function S(t) {
      return typeof t == "string" ? t : "";
    }
    function g() {
      return zt(s);
    }
    function k() {
      if (!i) throw new Error("[kickside-chat-coordinator] used before it started");
      return i;
    }
    function C(t) {
      const e = Jt(t);
      return ct(e ?? l);
    }
    function M(t) {
      return `${t.path}${t.search}${t.hash}`;
    }
    function j(t) {
      const e = L(t, a);
      return `${S(e.sessionId)}|${e.startRequest ?? ""}`;
    }
    function P(t) {
      "sessionId" in t && (q = S(t.sessionId)), s?.layout.updatePanel(a, { props: t });
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
    function T(t) {
      if (!t) return;
      const e = k();
      lt(ft(t, e.activeBreakpoint, a)) ? e.closeDrawer(a) : e.collapsePanel(a);
    }
    function z(t) {
      const e = k().activeBreakpoint;
      return {
        chat: dt(t, e, a),
        artifact: dt(t, e, G)
      };
    }
    function St(t) {
      const { chat: e, artifact: n } = z(t);
      if (e && n) {
        const o = !F;
        !H && !o ? k().closeDrawer(a) : o && k().closeDrawer(G);
      }
      F = e, H = n;
    }
    function et(t) {
      for (const [e, n] of Object.entries(t?.floating ?? {}))
        !x(n) || !x(n.props) || n.props.target !== a || E.has(e) || (E.set(e, JSON.parse(JSON.stringify(n))), s?.layout.removeFloating(e));
    }
    function J() {
      for (const [t, e] of E) s?.layout.addFloating(t, e);
      E.clear();
    }
    function nt(t, e) {
      y = { sessionId: t, from: e }, N();
    }
    function N() {
      if (!y) return;
      const { sessionId: t, from: e } = y, n = M(e);
      R() !== n || O !== n || (y = null, s?.navigate(`${Z(t)}${e.search}${e.hash}`, { replace: !0 }));
    }
    function ot(t, e) {
      !t || !x(t.context) || s?.setContext(t.context, e, t.source);
    }
    function st(t, e) {
      return B(e.path) || t.sidebar === !1;
    }
    function _(t) {
      const e = c !== null != (t !== null);
      c?.controller.abort(), c = t, e && r?.broadcast(Zt, { pending: t !== null });
    }
    function $() {
      const t = c;
      t && (_(null), P({ startRequest: null, sessionId: t.previousSessionId || null }));
    }
    function It(t, e) {
      const n = g(), o = C(n);
      if (ot(t.context, e), st(t, o)) {
        $(), s?.navigate(Z(e));
        return;
      }
      _(null), P({ sessionId: e, startRequest: null }), W(n);
    }
    async function kt(t) {
      let e;
      try {
        e = await Ut(t.token, t.controller.signal);
      } catch {
        if (c !== t) return;
        $(), s?.toast({ severity: "error", summary: "Could not start chat" });
        return;
      }
      if (c !== t) {
        Vt(e);
        return;
      }
      if (_(null), ot(t.context, e), t.fullPage) {
        P({ sessionId: t.previousSessionId || null, startRequest: null }), s?.navigate(Z(e));
        return;
      }
      P({ sessionId: e, startRequest: null });
      const n = C(g());
      tt(n) && nt(e, n);
    }
    function Ct(t, e) {
      const n = g(), o = C(n), p = st(t, o), A = ht(o.path);
      if (p && n && Q(n, k().activeBreakpoint, a) && T(n), c?.token === e && c)
        Object.assign(c, { fullPage: p, context: t.context, section: A });
      else {
        const qt = c?.previousSessionId ?? q ?? S(L(n, a).sessionId), X = {
          token: e,
          controller: new AbortController(),
          request: ++vt,
          fullPage: p,
          context: t.context,
          section: A,
          previousSessionId: qt,
          seen: !1
        };
        _(X), P({ startRequest: X.request, sessionId: null }), kt(X);
      }
      p || W(n);
    }
    function Pt() {
      return S(L(g(), a).sessionId);
    }
    function U(t) {
      const e = Q(t, k().activeBreakpoint, a), n = e ? document.querySelector(te) : null;
      n !== h && (w?.dispose(), h = n, w = n ? Xt(n, Pt, u) : void 0), !e || n ? (d?.disconnect(), d = void 0) : d || (d = new MutationObserver(() => {
        const o = g();
        o && U(o);
      }), d.observe(document.body, { childList: !0, subtree: !0 })), w?.sync();
    }
    function rt(t) {
      const e = g();
      return pt(e) && yt(C(e).path) === t;
    }
    async function _t(t) {
      if (t.sourcePanelId !== Y || !x(t.payload)) return;
      const { kind: e, sessionId: n, requestId: o, draft: p } = t.payload;
      if (!(typeof n != "string" || !n || !rt(n)) && (e === "write" && typeof p == "string" && u.write(n, p), e === "read" && typeof o == "number")) {
        const A = await u.read(n);
        rt(n) && r?.send(Y, mt, { requestId: o, draft: A });
      }
    }
    function At(t) {
      if (t.channel === mt) {
        _t(t);
        return;
      }
      if (t.channel !== "@HOST/intent" || !x(t.payload)) return;
      if (t.payload.intent === "routeChanged" && t.sourcePanelId === Y && pt(g()) && typeof t.payload.route == "string") {
        O = t.payload.route, N();
        return;
      }
      const e = t.payload, n = S(e.uuid), o = S(e.startToken);
      if (e.intent === "openSession" && n) {
        t.sourcePanelId === a ? (c && (_(null), P({ sessionId: n, startRequest: null })), Ft(() => w?.sync())) : It(e, n);
        return;
      }
      e.intent === "startChat" && o && Ct(e, o);
    }
    function Rt(t, e, n) {
      y && (tt(e) ? y.from = e : y = null);
      let o = S(L(n, a).sessionId);
      c?.fullPage && ht(e.path) !== c.section && (o = c.previousSessionId, $());
      const p = B(t.path), A = B(e.path);
      if (A && !p)
        T(n), et(n), o && tt(e) && nt(o, e);
      else if (!A && p) {
        const V = yt(t.path);
        V && (_(null), P({ sessionId: V, startRequest: null })), T(n), J();
      }
    }
    function Dt(t) {
      const e = j(t);
      e !== b && (e === "|" && (c?.seen && _(null), y = null), b = e), St(t);
    }
    function at(t) {
      const { chat: e, artifact: n } = z(t);
      return `${M(C(t))}#${j(t)}#${e}#${n}`;
    }
    function it() {
      const t = g();
      if (!t) return;
      bt(t), U(t);
      const e = at(t);
      if (e === K) {
        N();
        return;
      }
      K = e;
      const n = f;
      f = C(t), M(n) !== M(f) && Rt(n, f, t), Dt(t), N();
    }
    function Ot() {
      const t = g();
      if (!t) return;
      const e = ut(t, k().activeBreakpoint), n = D;
      e !== n && (D = e, Q(t, n, a) && !B(f.path) ? W(t) : T(t));
    }
    return xt(() => {
      const t = g();
      if (!s || !i || !r || !t) {
        console.error("[kickside-chat-coordinator] not started: needs a managed layout host with a layout manager, a layout bus and a layout snapshot", {
          host: !!s,
          manager: !!i,
          bus: !!r,
          snapshot: !!t
        });
        return;
      }
      f = C(t), D = ut(t, i.activeBreakpoint), b = j(t);
      const { chat: e, artifact: n } = z(t);
      e && n && i.closeDrawer(G), F = e, H = n && !e, K = at(t), t.floating?.[gt] || E.set(gt, I), B(f.path) ? (T(t), et(t)) : J(), U(t), v.push(r.subscribe(At)), v.push(i.on("change", it)), v.push(i.on("breakpoint", Ot)), v.push(Kt("@history", ({ path: o }) => {
        l = o === window.location.pathname ? R() : o, it();
      }));
    }), Mt(() => {
      v.forEach((t) => t()), v.length = 0, d?.disconnect(), w?.dispose(), $(), J();
    }), (t, e) => (Nt(), $t("span", Yt));
  }
});
class wt extends Bt {
  static get wippyConfig() {
    return { propsSchema: { type: "object", properties: {} } };
  }
  static get vueConfig() {
    return { rootComponent: ee };
  }
}
async function ie() {
  return wt;
}
Wt(import.meta.url, wt);
export {
  ie as webComponent
};
//# sourceMappingURL=chat_coordinator.js.map
