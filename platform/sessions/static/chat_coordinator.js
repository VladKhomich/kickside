import { u as At, a as Dt, W as Rt } from "./wc-runtime-C6gaf4iX.js";
import { defineComponent as Ot, onMounted as Tt, onBeforeUnmount as qt, openBlock as Et, createElementBlock as xt, nextTick as Bt } from "vue";
import { getLayoutManager as Lt, on as Mt, config as Nt, define as $t } from "@wippy-fe/proxy";
import { p as ot, f as at, A as G, C as r, g as E, l as Ft, d as Ht, h as x, j as rt, k as it, n as ct, i as B, o as U, M as ut, s as V, c as Q, q as lt, r as ft } from "./hostRoute-uRovXTvG.js";
import { e as Kt, c as jt } from "./chatStart-Bxe6JK-R.js";
function Wt(g, S, o) {
  let a = null, i = "", u = "", p = 0;
  function d() {
    !a || !i || i !== S() || u === a.value || (u = a.value, p++, o.write(i, u));
  }
  function w() {
    const l = g.querySelector("textarea.chat-input__textarea"), f = S();
    if (l === a && f === i) {
      d();
      return;
    }
    const A = i;
    a = l, i = f;
    const R = ++p;
    if (!l || !f) return;
    u = l.value, A && A !== f && L(""), o.read(f).then((v) => {
      R === p && f === S() && v !== void 0 && L(v);
    });
    function L(v) {
      !l || l.value === v || (u = l.value = v, l.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })));
    }
  }
  const m = (l) => {
    l.target === a && d();
  };
  g.addEventListener("input", m);
  const D = new MutationObserver(w);
  return D.observe(g, { subtree: !0, childList: !0, attributes: !0, attributeFilter: ["disabled"] }), w(), {
    sync: w,
    dispose() {
      p++, D.disconnect(), g.removeEventListener("input", m);
    }
  };
}
const zt = 65536, Jt = 100;
function Xt(g) {
  const S = g();
  let o = !!S;
  const a = /* @__PURE__ */ new Map();
  function i() {
    return o && S !== g() && (a.clear(), o = !1), o;
  }
  return {
    async read(u) {
      return i() ? a.get(u) ?? "" : void 0;
    },
    write(u, p) {
      if (!(!i() || p.length > zt) && (a.delete(u), p && a.set(u, p), a.size > Jt)) {
        const d = a.keys().next().value;
        d && a.delete(d);
      }
    }
  };
}
const Gt = { "aria-hidden": "true" }, Ut = "kickside:chat-start", dt = "chat-tab", pt = "kickside:chat-draft", Vt = '[data-wippy-panel-mount="chat"] .layout-chat-wrapper', Qt = /* @__PURE__ */ Ot({
  __name: "ChatCoordinator",
  setup(g) {
    const S = {
      kind: "builtin",
      id: "@HOST/panel-tab",
      chrome: !1,
      anchor: { right: 0, top: "50%" },
      position: { x: 0, y: 0 },
      size: { width: 48, height: 80 },
      props: { target: r, mode: "auto", label: "Open chat" }
    }, o = At(), a = Dt(), i = o ? Lt(o) : null, u = Xt(() => Nt.auth?.token);
    let p = null, d, w;
    const m = [], D = () => window.location.pathname + window.location.search + window.location.hash;
    let l = D(), f = ot(l), A = "default", R = "|", L = 0, v = !1, N = !1, $ = "", c = null, O = null;
    const T = /* @__PURE__ */ new Map();
    function b(t) {
      return typeof t == "string" ? t : "";
    }
    function y() {
      return Ft(o);
    }
    function k() {
      if (!i) throw new Error("[kickside-chat-coordinator] used before it started");
      return i;
    }
    function C(t) {
      const e = Ht(t);
      return ot(e ?? l);
    }
    function F(t) {
      return `${t.path}${t.search}${t.hash}`;
    }
    function H(t) {
      const e = x(t, r);
      return `${b(e.sessionId)}|${e.startRequest ?? ""}`;
    }
    function I(t) {
      "sessionId" in t && (O = b(t.sessionId)), o?.layout.updatePanel(r, { props: t });
    }
    function yt(t) {
      const e = x(t, r);
      c && e.startRequest === c.request && !b(e.sessionId) && (c.seen = !0), O !== null && b(e.sessionId) === O && (O = null);
    }
    function K(t) {
      if (!t) return;
      const e = k();
      rt(it(t, e.activeBreakpoint, r)) ? e.openDrawer(r) : e.expandPanel(r);
    }
    function q(t) {
      if (!t) return;
      const e = k();
      rt(it(t, e.activeBreakpoint, r)) ? e.closeDrawer(r) : e.collapsePanel(r);
    }
    function j(t) {
      const e = k().activeBreakpoint;
      return {
        chat: ct(t, e, r),
        artifact: ct(t, e, G)
      };
    }
    function gt(t) {
      const { chat: e, artifact: n } = j(t);
      if (e && n) {
        const s = !v;
        !N && !s ? k().closeDrawer(r) : s && k().closeDrawer(G);
      }
      v = e, N = n;
    }
    function Y(t) {
      for (const [e, n] of Object.entries(t?.floating ?? {}))
        !B(n) || !B(n.props) || n.props.target !== r || T.has(e) || (T.set(e, JSON.parse(JSON.stringify(n))), o?.layout.removeFloating(e));
    }
    function W() {
      for (const [t, e] of T) o?.layout.addFloating(t, e);
      T.clear();
    }
    function Z(t, e) {
      o?.navigate(`${Q(t)}${e.search}${e.hash}`, { replace: !0 });
    }
    function tt(t, e) {
      !t || !B(t.context) || o?.setContext(t.context, e, t.source);
    }
    function et(t, e) {
      return E(e.path) || t.sidebar === !1;
    }
    function _(t) {
      const e = c !== null != (t !== null);
      c = t, e && a?.broadcast(Ut, { pending: t !== null });
    }
    function M() {
      const t = c;
      t && (_(null), I({ startRequest: null, sessionId: t.previousSessionId || null }));
    }
    function wt(t, e) {
      const n = y(), s = C(n);
      if (tt(t.context, e), et(t, s)) {
        M(), o?.navigate(Q(e));
        return;
      }
      _(null), I({ sessionId: e, startRequest: null }), K(n);
    }
    async function mt(t) {
      let e;
      try {
        e = await Kt(t.token);
      } catch {
        if (c !== t) return;
        M(), o?.toast({ severity: "error", summary: "Could not start chat" });
        return;
      }
      if (c !== t) {
        jt(e);
        return;
      }
      if (_(null), tt(t.context, e), t.fullPage) {
        I({ sessionId: t.previousSessionId || null, startRequest: null }), o?.navigate(Q(e));
        return;
      }
      I({ sessionId: e, startRequest: null });
      const n = C(y());
      ft(n) && Z(e, n);
    }
    function vt(t, e) {
      const n = y(), s = C(n), h = et(t, s), P = lt(s.path);
      if (h && n && U(n, k().activeBreakpoint, r) && q(n), c?.token === e && c)
        Object.assign(c, { fullPage: h, context: t.context, section: P });
      else {
        const Pt = c?.previousSessionId ?? O ?? b(x(n, r).sessionId), X = {
          token: e,
          request: ++L,
          fullPage: h,
          context: t.context,
          section: P,
          previousSessionId: Pt,
          seen: !1
        };
        _(X), I({ startRequest: X.request, sessionId: null }), mt(X);
      }
      h || K(n);
    }
    function bt() {
      return b(x(y(), r).sessionId);
    }
    function z(t) {
      const e = U(t, k().activeBreakpoint, r), n = e ? document.querySelector(Vt) : null;
      n !== p && (w?.dispose(), p = n, w = n ? Wt(n, bt, u) : void 0), !e || n ? (d?.disconnect(), d = void 0) : d || (d = new MutationObserver(() => {
        const s = y();
        s && z(s);
      }), d.observe(document.body, { childList: !0, subtree: !0 })), w?.sync();
    }
    async function St(t) {
      if (t.sourcePanelId !== ut || !B(t.payload)) return;
      const { kind: e, sessionId: n, requestId: s, draft: h } = t.payload;
      if (!(typeof n != "string" || !n || V(C(y()).path) !== n) && (e === "write" && typeof h == "string" && u.write(n, h), e === "read" && typeof s == "number")) {
        const P = await u.read(n);
        V(C(y()).path) === n && a?.send(ut, pt, { requestId: s, draft: P });
      }
    }
    function kt(t) {
      if (t.channel === pt) {
        St(t);
        return;
      }
      if (t.channel !== "@HOST/intent" || !B(t.payload)) return;
      const e = t.payload, n = b(e.uuid), s = b(e.startToken);
      if (e.intent === "openSession" && n) {
        t.sourcePanelId === r ? (c && (_(null), I({ sessionId: n, startRequest: null })), Bt(() => w?.sync())) : wt(e, n);
        return;
      }
      e.intent === "startChat" && s && vt(e, s);
    }
    function Ct(t, e, n) {
      let s = b(x(n, r).sessionId);
      c?.fullPage && lt(e.path) !== c.section && (s = c.previousSessionId, M());
      const h = E(t.path), P = E(e.path);
      if (P && !h)
        q(n), Y(n), s && ft(e) && Z(s, e);
      else if (!P && h) {
        const J = V(t.path);
        J && (_(null), I({ sessionId: J, startRequest: null })), q(n), W();
      }
    }
    function It(t) {
      const e = H(t);
      e !== R && (e === "|" && c?.seen && _(null), R = e), gt(t);
    }
    function nt(t) {
      const { chat: e, artifact: n } = j(t);
      return `${F(C(t))}#${H(t)}#${e}#${n}`;
    }
    function st() {
      const t = y();
      if (!t) return;
      yt(t), z(t);
      const e = nt(t);
      if (e === $) return;
      $ = e;
      const n = f;
      f = C(t), F(n) !== F(f) && Ct(n, f, t), It(t);
    }
    function _t() {
      const t = y();
      if (!t) return;
      const e = at(t, k().activeBreakpoint), n = A;
      e !== n && (A = e, U(t, n, r) && !E(f.path) ? K(t) : q(t));
    }
    return Tt(() => {
      const t = y();
      if (!o || !i || !a || !t) {
        console.error("[kickside-chat-coordinator] not started: needs a managed layout host with a layout manager, a layout bus and a layout snapshot", {
          host: !!o,
          manager: !!i,
          bus: !!a,
          snapshot: !!t
        });
        return;
      }
      f = C(t), A = at(t, i.activeBreakpoint), R = H(t);
      const { chat: e, artifact: n } = j(t);
      e && n && i.closeDrawer(G), v = e, N = n && !e, $ = nt(t), t.floating?.[dt] || T.set(dt, S), E(f.path) ? (q(t), Y(t)) : W(), z(t), m.push(a.subscribe(kt)), m.push(i.on("change", st)), m.push(i.on("breakpoint", _t)), m.push(Mt("@history", ({ path: s }) => {
        l = s === window.location.pathname ? D() : s, st();
      }));
    }), qt(() => {
      m.forEach((t) => t()), m.length = 0, d?.disconnect(), w?.dispose(), M(), W();
    }), (t, e) => (Et(), xt("span", Gt));
  }
});
class ht extends Rt {
  static get wippyConfig() {
    return { propsSchema: { type: "object", properties: {} } };
  }
  static get vueConfig() {
    return { rootComponent: Qt };
  }
}
async function se() {
  return ht;
}
$t(import.meta.url, ht);
export {
  se as webComponent
};
//# sourceMappingURL=chat_coordinator.js.map
