import { s as At, B as $t, a as Lo, b as zt, c as qt, f as pt, R as eo, L as zo, d as Le, v as Jt, e as oi, U as ii, I as ao, g as si, r as Ao, h as ai, i as Mo, j as Po, C as li, k as ri, S as Fo, _ as ui, x as Qt, m as di, z as To, n as zn, o as an, T as ln, F as ci, M as lo, p as pi, q as fi, Y as mi, t as hi, u as bi, D as vi, O as gi, $ as yi, J as ki, w as Xt, y as wi, P as Si } from "./wc-runtime-Chhe4T5p.js";
import { openBlock as a, createElementBlock as u, mergeProps as W, createElementVNode as l, renderSlot as ie, createTextVNode as P, toDisplayString as c, resolveComponent as Oe, resolveDirective as to, withDirectives as De, createBlock as ce, resolveDynamicComponent as pn, withCtx as ee, createCommentVNode as h, normalizeClass as ne, computed as q, createVNode as m, Transition as Eo, Fragment as X, renderList as se, normalizeProps as $i, createSlots as Ci, withModifiers as _n, defineComponent as nn, ref as H, watch as Ne, nextTick as fn, onBeforeUnmount as Vo, normalizeStyle as Nt, onUnmounted as no, onMounted as oo, unref as o, useId as Ii, vModelText as xn, vShow as rn, vModelCheckbox as _i, isRef as Lt, withKeys as xi } from "vue";
import { Icon as C } from "@iconify/vue";
import { m as mn, r as ft, a as An, b as en, c as Mn, K as Kt, d as ro, e as ze, f as Hn, i as uo, g as co, h as Oi, j as Pn, s as Li, k as zi, l as Ai, n as Mi, o as Pi, p as Do, q as tn, t as hn, u as Ro, v as Fi, w as On, x as ue, y as Ti, z as Ei, A as Vi, B as Di, C as Ri, D as dn, E as bn, F as Fn, G as cn } from "./requiredSetup-CKaPvMvx.js";
import { api as io, loadByTagName as Bo, host as Ho, on as Bi } from "@wippy-fe/proxy";
var En = {
  name: "SpinnerIcon",
  extends: At
};
function Hi(e) {
  return Ki(e) || Ni(e) || Ui(e) || ji();
}
function ji() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ui(e, t) {
  if (e) {
    if (typeof e == "string") return jn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? jn(e, t) : void 0;
  }
}
function Ni(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ki(e) {
  if (Array.isArray(e)) return jn(e);
}
function jn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function qi(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Hi(t[0] || (t[0] = [l("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
En.render = qi;
var Gi = `
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`, Wi = {
  root: function(t) {
    var n = t.props, s = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": zt(n.value) && String(n.value).length === 1,
      "p-badge-dot": Lo(n.value) && !s.$slots.default,
      "p-badge-sm": n.size === "small",
      "p-badge-lg": n.size === "large",
      "p-badge-xl": n.size === "xlarge",
      "p-badge-info": n.severity === "info",
      "p-badge-success": n.severity === "success",
      "p-badge-warn": n.severity === "warn",
      "p-badge-danger": n.severity === "danger",
      "p-badge-secondary": n.severity === "secondary",
      "p-badge-contrast": n.severity === "contrast"
    }];
  }
}, Zi = $t.extend({
  name: "badge",
  style: Gi,
  classes: Wi
}), Yi = {
  name: "BaseBadge",
  extends: qt,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  style: Zi,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function vn(e) {
  "@babel/helpers - typeof";
  return vn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, vn(e);
}
function po(e, t, n) {
  return (t = Xi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Xi(e) {
  var t = Ji(e, "string");
  return vn(t) == "symbol" ? t : t + "";
}
function Ji(e, t) {
  if (vn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if (vn(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var jo = {
  name: "Badge",
  extends: Yi,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return pt(po(po({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Qi = ["data-p"];
function es(e, t, n, s, i, r) {
  return a(), u("span", W({
    class: e.cx("root"),
    "data-p": r.dataP
  }, e.ptmi("root")), [ie(e.$slots, "default", {}, function() {
    return [P(c(e.value), 1)];
  })], 16, Qi);
}
jo.render = es;
var ts = `
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: " ";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`;
function gn(e) {
  "@babel/helpers - typeof";
  return gn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, gn(e);
}
function ct(e, t, n) {
  return (t = ns(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ns(e) {
  var t = os(e, "string");
  return gn(t) == "symbol" ? t : t + "";
}
function os(e, t) {
  if (gn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if (gn(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var is = {
  root: function(t) {
    var n = t.instance, s = t.props;
    return ["p-button p-component", ct(ct(ct(ct(ct(ct(ct(ct(ct({
      "p-button-icon-only": n.hasIcon && !s.label && !s.badge,
      "p-button-vertical": (s.iconPos === "top" || s.iconPos === "bottom") && s.label,
      "p-button-loading": s.loading,
      "p-button-link": s.link || s.variant === "link"
    }, "p-button-".concat(s.severity), s.severity), "p-button-raised", s.raised), "p-button-rounded", s.rounded), "p-button-text", s.text || s.variant === "text"), "p-button-outlined", s.outlined || s.variant === "outlined"), "p-button-sm", s.size === "small"), "p-button-lg", s.size === "large"), "p-button-plain", s.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", ct({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, ss = $t.extend({
  name: "button",
  style: ts,
  classes: is
}), as = {
  name: "BaseButton",
  extends: qt,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: [String, Object],
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: [String, Object],
      default: null
    },
    badgeSeverity: {
      type: String,
      default: "secondary"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    },
    link: {
      type: Boolean,
      default: !1
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: !1
    },
    rounded: {
      type: Boolean,
      default: !1
    },
    text: {
      type: Boolean,
      default: !1
    },
    outlined: {
      type: Boolean,
      default: !1
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: !1
    },
    fluid: {
      type: Boolean,
      default: null
    }
  },
  style: ss,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function yn(e) {
  "@babel/helpers - typeof";
  return yn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, yn(e);
}
function Fe(e, t, n) {
  return (t = ls(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ls(e) {
  var t = rs(e, "string");
  return yn(t) == "symbol" ? t : t + "";
}
function rs(e, t) {
  if (yn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if (yn(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var le = {
  name: "Button",
  extends: as,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      var n = t === "root" ? this.ptmi : this.ptm;
      return n(t, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function() {
      return this.icon || this.$slots.icon;
    },
    attrs: function() {
      return W(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        "aria-label": this.defaultAriaLabel,
        "data-pc-name": "button",
        "data-p-disabled": this.disabled,
        "data-p-severity": this.severity
      };
    },
    hasFluid: function() {
      return Lo(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return pt(Fe(Fe(Fe(Fe(Fe(Fe(Fe(Fe(Fe(Fe({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return pt(Fe(Fe({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return pt(Fe(Fe({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: En,
    Badge: jo
  },
  directives: {
    ripple: eo
  }
}, us = ["data-p"], ds = ["data-p"];
function cs(e, t, n, s, i, r) {
  var f = Oe("SpinnerIcon"), g = Oe("Badge"), v = to("ripple");
  return e.asChild ? ie(e.$slots, "default", {
    key: 1,
    class: ne(e.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : De((a(), ce(pn(e.as), W({
    key: 0,
    class: e.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: ee(function() {
      return [ie(e.$slots, "default", {}, function() {
        return [e.loading ? ie(e.$slots, "loadingicon", W({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (a(), u("span", W({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (a(), ce(f, W({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : ie(e.$slots, "icon", W({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (a(), u("span", W({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": r.dataIconP
          }, e.ptm("icon")), null, 16, us)) : h("", !0)];
        }), e.label ? (a(), u("span", W({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": r.dataLabelP
        }), c(e.label), 17, ds)) : h("", !0), e.badge ? (a(), ce(g, {
          key: 3,
          value: e.badge,
          class: ne(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : h("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[v]]);
}
le.render = cs;
var so = {
  name: "TimesIcon",
  extends: At
};
function ps(e) {
  return bs(e) || hs(e) || ms(e) || fs();
}
function fs() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ms(e, t) {
  if (e) {
    if (typeof e == "string") return Un(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Un(e, t) : void 0;
  }
}
function hs(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function bs(e) {
  if (Array.isArray(e)) return Un(e);
}
function Un(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function vs(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), ps(t[0] || (t[0] = [l("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
so.render = vs;
var Uo = {
  name: "WindowMaximizeIcon",
  extends: At
};
function gs(e) {
  return Ss(e) || ws(e) || ks(e) || ys();
}
function ys() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ks(e, t) {
  if (e) {
    if (typeof e == "string") return Nn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Nn(e, t) : void 0;
  }
}
function ws(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ss(e) {
  if (Array.isArray(e)) return Nn(e);
}
function Nn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function $s(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), gs(t[0] || (t[0] = [l("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Uo.render = $s;
var No = {
  name: "WindowMinimizeIcon",
  extends: At
};
function Cs(e) {
  return Os(e) || xs(e) || _s(e) || Is();
}
function Is() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _s(e, t) {
  if (e) {
    if (typeof e == "string") return Kn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Kn(e, t) : void 0;
  }
}
function xs(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Os(e) {
  if (Array.isArray(e)) return Kn(e);
}
function Kn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function Ls(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Cs(t[0] || (t[0] = [l("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0ZM6.368 7.952C6.44137 7.98326 6.52025 7.99958 6.6 8H9.8C9.95913 8 10.1117 7.93678 10.2243 7.82426C10.3368 7.71174 10.4 7.55913 10.4 7.4C10.4 7.24087 10.3368 7.08826 10.2243 6.97574C10.1117 6.86321 9.95913 6.8 9.8 6.8H8.048L10.624 4.224C10.73 4.11026 10.7877 3.95982 10.7849 3.80438C10.7822 3.64894 10.7192 3.50063 10.6093 3.3907C10.4994 3.28077 10.3511 3.2178 10.1956 3.21506C10.0402 3.21232 9.88974 3.27002 9.776 3.376L7.2 5.952V4.2C7.2 4.04087 7.13679 3.88826 7.02426 3.77574C6.91174 3.66321 6.75913 3.6 6.6 3.6C6.44087 3.6 6.28826 3.66321 6.17574 3.77574C6.06321 3.88826 6 4.04087 6 4.2V7.4C6.00042 7.47975 6.01674 7.55862 6.048 7.632C6.07656 7.70442 6.11971 7.7702 6.17475 7.82524C6.2298 7.88029 6.29558 7.92344 6.368 7.952ZM1.4 8.80005H3.8C4.17066 8.80215 4.52553 8.95032 4.78763 9.21242C5.04973 9.47452 5.1979 9.82939 5.2 10.2V12.6C5.1979 12.9707 5.04973 13.3256 4.78763 13.5877C4.52553 13.8498 4.17066 13.9979 3.8 14H1.4C1.02934 13.9979 0.674468 13.8498 0.412371 13.5877C0.150274 13.3256 0.00210008 12.9707 0 12.6V10.2C0.00210008 9.82939 0.150274 9.47452 0.412371 9.21242C0.674468 8.95032 1.02934 8.80215 1.4 8.80005ZM3.94142 12.7415C3.97893 12.704 4 12.6531 4 12.6V10.2C4 10.147 3.97893 10.0961 3.94142 10.0586C3.90391 10.0211 3.85304 10 3.8 10H1.4C1.34696 10 1.29609 10.0211 1.25858 10.0586C1.22107 10.0961 1.2 10.147 1.2 10.2V12.6C1.2 12.6531 1.22107 12.704 1.25858 12.7415C1.29609 12.779 1.34696 12.8 1.4 12.8H3.8C3.85304 12.8 3.90391 12.779 3.94142 12.7415Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
No.render = Ls;
var zs = $t.extend({
  name: "focustrap-directive"
}), As = oi.extend({
  style: zs
});
function kn(e) {
  "@babel/helpers - typeof";
  return kn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, kn(e);
}
function fo(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    t && (s = s.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, s);
  }
  return n;
}
function mo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? fo(Object(n), !0).forEach(function(s) {
      Ms(e, s, n[s]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : fo(Object(n)).forEach(function(s) {
      Object.defineProperty(e, s, Object.getOwnPropertyDescriptor(n, s));
    });
  }
  return e;
}
function Ms(e, t, n) {
  return (t = Ps(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ps(e) {
  var t = Fs(e, "string");
  return kn(t) == "symbol" ? t : t + "";
}
function Fs(e, t) {
  if (kn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if (kn(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ts = As.extend("focustrap", {
  mounted: function(t, n) {
    var s = n.value || {}, i = s.disabled;
    i || (this.createHiddenFocusableElements(t, n), this.bind(t, n), this.autoElementFocus(t, n)), t.setAttribute("data-pd-focustrap", !0), this.$el = t;
  },
  updated: function(t, n) {
    var s = n.value || {}, i = s.disabled;
    i && this.unbind(t);
  },
  unmounted: function(t) {
    this.unbind(t);
  },
  methods: {
    getComputedSelector: function(t) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(t ?? "");
    },
    bind: function(t, n) {
      var s = this, i = n.value || {}, r = i.onFocusIn, f = i.onFocusOut;
      t.$_pfocustrap_mutationobserver = new MutationObserver(function(g) {
        g.forEach(function(v) {
          if (v.type === "childList" && !t.contains(document.activeElement)) {
            var w = function(_) {
              var F = ao(_) ? ao(_, s.getComputedSelector(t.$_pfocustrap_focusableselector)) ? _ : Jt(t, s.getComputedSelector(t.$_pfocustrap_focusableselector)) : Jt(_);
              return zt(F) ? F : _.nextSibling && w(_.nextSibling);
            };
            Le(w(v.nextSibling));
          }
        });
      }), t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_mutationobserver.observe(t, {
        childList: !0
      }), t.$_pfocustrap_focusinlistener = function(g) {
        return r && r(g);
      }, t.$_pfocustrap_focusoutlistener = function(g) {
        return f && f(g);
      }, t.addEventListener("focusin", t.$_pfocustrap_focusinlistener), t.addEventListener("focusout", t.$_pfocustrap_focusoutlistener);
    },
    unbind: function(t) {
      t.$_pfocustrap_mutationobserver && t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_focusinlistener && t.removeEventListener("focusin", t.$_pfocustrap_focusinlistener) && (t.$_pfocustrap_focusinlistener = null), t.$_pfocustrap_focusoutlistener && t.removeEventListener("focusout", t.$_pfocustrap_focusoutlistener) && (t.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(t) {
      this.autoElementFocus(this.$el, {
        value: mo(mo({}, t), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(t, n) {
      var s = n.value || {}, i = s.autoFocusSelector, r = i === void 0 ? "" : i, f = s.firstFocusableSelector, g = f === void 0 ? "" : f, v = s.autoFocus, w = v === void 0 ? !1 : v, S = Jt(t, "[autofocus]".concat(this.getComputedSelector(r)));
      w && !S && (S = Jt(t, this.getComputedSelector(g))), Le(S);
    },
    onFirstHiddenElementFocus: function(t) {
      var n, s = t.currentTarget, i = t.relatedTarget, r = i === s.$_pfocustrap_lasthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? Jt(s.parentElement, this.getComputedSelector(s.$_pfocustrap_focusableselector)) : s.$_pfocustrap_lasthiddenfocusableelement;
      Le(r);
    },
    onLastHiddenElementFocus: function(t) {
      var n, s = t.currentTarget, i = t.relatedTarget, r = i === s.$_pfocustrap_firsthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? zo(s.parentElement, this.getComputedSelector(s.$_pfocustrap_focusableselector)) : s.$_pfocustrap_firsthiddenfocusableelement;
      Le(r);
    },
    createHiddenFocusableElements: function(t, n) {
      var s = this, i = n.value || {}, r = i.tabIndex, f = r === void 0 ? 0 : r, g = i.firstFocusableSelector, v = g === void 0 ? "" : g, w = i.lastFocusableSelector, S = w === void 0 ? "" : w, _ = function(N) {
        return ii("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: f,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: N?.bind(s)
        });
      }, F = _(this.onFirstHiddenElementFocus), B = _(this.onLastHiddenElementFocus);
      F.$_pfocustrap_lasthiddenfocusableelement = B, F.$_pfocustrap_focusableselector = v, F.setAttribute("data-pc-section", "firstfocusableelement"), B.$_pfocustrap_firsthiddenfocusableelement = F, B.$_pfocustrap_focusableselector = S, B.setAttribute("data-pc-section", "lastfocusableelement"), t.prepend(F), t.append(B);
    }
  }
});
function ho() {
  ai({
    variableName: Ao("scrollbar.width").name
  });
}
function bo() {
  si({
    variableName: Ao("scrollbar.width").name
  });
}
var Es = `
    .p-dialog {
        max-height: 90%;
        transform: scale(1);
        border-radius: dt('dialog.border.radius');
        box-shadow: dt('dialog.shadow');
        background: dt('dialog.background');
        border: 1px solid dt('dialog.border.color');
        color: dt('dialog.color');
        will-change: transform;
    }

    .p-dialog-content {
        overflow-y: auto;
        padding: dt('dialog.content.padding');
        flex-grow: 1;
    }

    .p-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('dialog.header.padding');
    }

    .p-dialog-title {
        font-weight: dt('dialog.title.font.weight');
        font-size: dt('dialog.title.font.size');
    }

    .p-dialog-footer {
        flex-shrink: 0;
        padding: dt('dialog.footer.padding');
        display: flex;
        justify-content: flex-end;
        gap: dt('dialog.footer.gap');
    }

    .p-dialog-header-actions {
        display: flex;
        align-items: center;
        gap: dt('dialog.header.gap');
    }

    .p-dialog-top .p-dialog,
    .p-dialog-bottom .p-dialog,
    .p-dialog-left .p-dialog,
    .p-dialog-right .p-dialog,
    .p-dialog-topleft .p-dialog,
    .p-dialog-topright .p-dialog,
    .p-dialog-bottomleft .p-dialog,
    .p-dialog-bottomright .p-dialog {
        margin: 1rem;
    }

    .p-dialog-maximized {
        width: 100vw !important;
        height: 100vh !important;
        top: 0px !important;
        left: 0px !important;
        max-height: 100%;
        height: 100%;
        border-radius: 0;
    }

    .p-dialog .p-resizable-handle {
        position: absolute;
        font-size: 0.1px;
        display: block;
        cursor: se-resize;
        width: 12px;
        height: 12px;
        right: 1px;
        bottom: 1px;
    }

    .p-dialog-enter-active {
        animation: p-animate-dialog-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-dialog-leave-active {
        animation: p-animate-dialog-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-dialog-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-dialog-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`, Vs = {
  mask: function(t) {
    var n = t.position, s = t.modal;
    return {
      position: "fixed",
      height: "100%",
      width: "100%",
      left: 0,
      top: 0,
      display: "flex",
      justifyContent: n === "left" || n === "topleft" || n === "bottomleft" ? "flex-start" : n === "right" || n === "topright" || n === "bottomright" ? "flex-end" : "center",
      alignItems: n === "top" || n === "topleft" || n === "topright" ? "flex-start" : n === "bottom" || n === "bottomleft" || n === "bottomright" ? "flex-end" : "center",
      pointerEvents: s ? "auto" : "none"
    };
  },
  root: {
    display: "flex",
    flexDirection: "column",
    pointerEvents: "auto"
  }
}, Ds = {
  mask: function(t) {
    var n = t.props, s = ["left", "right", "top", "topleft", "topright", "bottom", "bottomleft", "bottomright"], i = s.find(function(r) {
      return r === n.position;
    });
    return ["p-dialog-mask", {
      "p-overlay-mask p-overlay-mask-enter-active": n.modal
    }, i ? "p-dialog-".concat(i) : ""];
  },
  root: function(t) {
    var n = t.props, s = t.instance;
    return ["p-dialog p-component", {
      "p-dialog-maximized": n.maximizable && s.maximized
    }];
  },
  header: "p-dialog-header",
  title: "p-dialog-title",
  headerActions: "p-dialog-header-actions",
  pcMaximizeButton: "p-dialog-maximize-button",
  pcCloseButton: "p-dialog-close-button",
  content: "p-dialog-content",
  footer: "p-dialog-footer"
}, Rs = $t.extend({
  name: "dialog",
  style: Es,
  classes: Ds,
  inlineStyles: Vs
}), Bs = {
  name: "BaseDialog",
  extends: qt,
  props: {
    header: {
      type: null,
      default: null
    },
    footer: {
      type: null,
      default: null
    },
    visible: {
      type: Boolean,
      default: !1
    },
    modal: {
      type: Boolean,
      default: null
    },
    contentStyle: {
      type: null,
      default: null
    },
    contentClass: {
      type: String,
      default: null
    },
    contentProps: {
      type: null,
      default: null
    },
    maximizable: {
      type: Boolean,
      default: !1
    },
    dismissableMask: {
      type: Boolean,
      default: !1
    },
    closable: {
      type: Boolean,
      default: !0
    },
    closeOnEscape: {
      type: Boolean,
      default: !0
    },
    showHeader: {
      type: Boolean,
      default: !0
    },
    blockScroll: {
      type: Boolean,
      default: !1
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    autoZIndex: {
      type: Boolean,
      default: !0
    },
    position: {
      type: String,
      default: "center"
    },
    breakpoints: {
      type: Object,
      default: null
    },
    draggable: {
      type: Boolean,
      default: !0
    },
    keepInViewport: {
      type: Boolean,
      default: !0
    },
    minX: {
      type: Number,
      default: 0
    },
    minY: {
      type: Number,
      default: 0
    },
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    closeIcon: {
      type: String,
      default: void 0
    },
    maximizeIcon: {
      type: String,
      default: void 0
    },
    minimizeIcon: {
      type: String,
      default: void 0
    },
    closeButtonProps: {
      type: Object,
      default: function() {
        return {
          severity: "secondary",
          text: !0,
          rounded: !0
        };
      }
    },
    maximizeButtonProps: {
      type: Object,
      default: function() {
        return {
          severity: "secondary",
          text: !0,
          rounded: !0
        };
      }
    },
    _instance: null
  },
  style: Rs,
  provide: function() {
    return {
      $pcDialog: this,
      $parentInstance: this
    };
  }
}, Ko = {
  name: "Dialog",
  extends: Bs,
  inheritAttrs: !1,
  emits: ["update:visible", "show", "hide", "after-hide", "maximize", "unmaximize", "dragstart", "dragend"],
  provide: function() {
    var t = this;
    return {
      dialogRef: q(function() {
        return t._instance;
      })
    };
  },
  data: function() {
    return {
      containerVisible: this.visible,
      maximized: !1,
      focusableMax: null,
      focusableClose: null,
      target: null
    };
  },
  documentKeydownListener: null,
  container: null,
  mask: null,
  content: null,
  headerContainer: null,
  footerContainer: null,
  maximizableButton: null,
  closeButton: null,
  styleElement: null,
  dragging: null,
  documentDragListener: null,
  documentDragEndListener: null,
  lastPageX: null,
  lastPageY: null,
  maskMouseDownTarget: null,
  updated: function() {
    this.visible && (this.containerVisible = this.visible);
  },
  beforeUnmount: function() {
    this.unbindDocumentState(), this.unbindGlobalListeners(), this.destroyStyle(), this.mask && this.autoZIndex && Qt.clear(this.mask), this.container = null, this.mask = null;
  },
  mounted: function() {
    this.breakpoints && this.createStyle();
  },
  methods: {
    close: function() {
      this.$emit("update:visible", !1);
    },
    onEnter: function() {
      this.$emit("show"), this.target = document.activeElement, this.enableDocumentSettings(), this.bindGlobalListeners(), this.autoZIndex && Qt.set("modal", this.mask, this.baseZIndex || this.$primevue.config.zIndex.modal);
    },
    onAfterEnter: function() {
      this.focus();
    },
    onBeforeLeave: function() {
      this.modal && !this.isUnstyled && di(this.mask, "p-overlay-mask-leave-active"), this.dragging && this.documentDragEndListener && this.documentDragEndListener();
    },
    onLeave: function() {
      this.$emit("hide"), Le(this.target), this.target = null, this.focusableClose = null, this.focusableMax = null;
    },
    onAfterLeave: function() {
      this.autoZIndex && Qt.clear(this.mask), this.containerVisible = !1, this.unbindDocumentState(), this.unbindGlobalListeners(), this.$emit("after-hide");
    },
    onMaskMouseDown: function(t) {
      this.maskMouseDownTarget = t.target;
    },
    onMaskMouseUp: function() {
      this.dismissableMask && this.modal && this.mask === this.maskMouseDownTarget && this.close();
    },
    focus: function() {
      var t = function(i) {
        return i && i.querySelector("[autofocus]");
      }, n = this.$slots.footer && t(this.footerContainer);
      n || (n = this.$slots.header && t(this.headerContainer), n || (n = this.$slots.default && t(this.content), n || (this.maximizable ? (this.focusableMax = !0, n = this.maximizableButton) : (this.focusableClose = !0, n = this.closeButton)))), n && Le(n, {
        focusVisible: !0
      });
    },
    maximize: function(t) {
      this.maximized ? (this.maximized = !1, this.$emit("unmaximize", t)) : (this.maximized = !0, this.$emit("maximize", t)), this.modal || (this.maximized ? ho() : bo());
    },
    enableDocumentSettings: function() {
      (this.modal || !this.modal && this.blockScroll || this.maximizable && this.maximized) && ho();
    },
    unbindDocumentState: function() {
      (this.modal || !this.modal && this.blockScroll || this.maximizable && this.maximized) && bo();
    },
    onKeyDown: function(t) {
      t.code === "Escape" && this.closeOnEscape && !t.isComposing && this.close();
    },
    bindDocumentKeyDownListener: function() {
      this.documentKeydownListener || (this.documentKeydownListener = this.onKeyDown.bind(this), window.document.addEventListener("keydown", this.documentKeydownListener));
    },
    unbindDocumentKeyDownListener: function() {
      this.documentKeydownListener && (window.document.removeEventListener("keydown", this.documentKeydownListener), this.documentKeydownListener = null);
    },
    containerRef: function(t) {
      this.container = t;
    },
    maskRef: function(t) {
      this.mask = t;
    },
    contentRef: function(t) {
      this.content = t;
    },
    headerContainerRef: function(t) {
      this.headerContainer = t;
    },
    footerContainerRef: function(t) {
      this.footerContainer = t;
    },
    maximizableRef: function(t) {
      this.maximizableButton = t ? t.$el : void 0;
    },
    closeButtonRef: function(t) {
      this.closeButton = t ? t.$el : void 0;
    },
    createStyle: function() {
      if (!this.styleElement && !this.isUnstyled) {
        var t;
        this.styleElement = document.createElement("style"), this.styleElement.type = "text/css", ui(this.styleElement, "nonce", (t = this.$primevue) === null || t === void 0 || (t = t.config) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce), document.head.appendChild(this.styleElement);
        var n = "";
        for (var s in this.breakpoints)
          n += `
                        @media screen and (max-width: `.concat(s, `) {
                            .p-dialog[`).concat(this.$attrSelector, `] {
                                width: `).concat(this.breakpoints[s], ` !important;
                            }
                        }
                    `);
        this.styleElement.innerHTML = n;
      }
    },
    destroyStyle: function() {
      this.styleElement && (document.head.removeChild(this.styleElement), this.styleElement = null);
    },
    initDrag: function(t) {
      t.target.closest("div").getAttribute("data-pc-section") !== "headeractions" && this.draggable && (this.dragging = !0, this.lastPageX = t.pageX, this.lastPageY = t.pageY, this.container.style.margin = "0", document.body.setAttribute("data-p-unselectable-text", "true"), !this.isUnstyled && Fo(document.body, {
        "user-select": "none"
      }), this.$emit("dragstart", t));
    },
    bindGlobalListeners: function() {
      this.draggable && (this.bindDocumentDragListener(), this.bindDocumentDragEndListener()), this.closeOnEscape && this.bindDocumentKeyDownListener();
    },
    unbindGlobalListeners: function() {
      this.unbindDocumentDragListener(), this.unbindDocumentDragEndListener(), this.unbindDocumentKeyDownListener();
    },
    bindDocumentDragListener: function() {
      var t = this;
      this.documentDragListener = function(n) {
        if (t.dragging) {
          var s = Po(t.container), i = li(t.container), r = n.pageX - t.lastPageX, f = n.pageY - t.lastPageY, g = t.container.getBoundingClientRect(), v = g.left + r, w = g.top + f, S = ri(), _ = getComputedStyle(t.container), F = parseFloat(_.marginLeft), B = parseFloat(_.marginTop);
          t.container.style.position = "fixed", t.keepInViewport ? (v >= t.minX && v + s < S.width && (t.lastPageX = n.pageX, t.container.style.left = v - F + "px"), w >= t.minY && w + i < S.height && (t.lastPageY = n.pageY, t.container.style.top = w - B + "px")) : (t.lastPageX = n.pageX, t.container.style.left = v - F + "px", t.lastPageY = n.pageY, t.container.style.top = w - B + "px");
        }
      }, window.document.addEventListener("mousemove", this.documentDragListener);
    },
    unbindDocumentDragListener: function() {
      this.documentDragListener && (window.document.removeEventListener("mousemove", this.documentDragListener), this.documentDragListener = null);
    },
    bindDocumentDragEndListener: function() {
      var t = this;
      this.documentDragEndListener = function(n) {
        t.dragging && (t.dragging = !1, document.body.removeAttribute("data-p-unselectable-text"), !t.isUnstyled && (document.body.style["user-select"] = ""), t.$emit("dragend", n));
      }, window.document.addEventListener("mouseup", this.documentDragEndListener);
    },
    unbindDocumentDragEndListener: function() {
      this.documentDragEndListener && (window.document.removeEventListener("mouseup", this.documentDragEndListener), this.documentDragEndListener = null);
    }
  },
  computed: {
    maximizeIconComponent: function() {
      return this.maximized ? this.minimizeIcon ? "span" : "WindowMinimizeIcon" : this.maximizeIcon ? "span" : "WindowMaximizeIcon";
    },
    ariaLabelledById: function() {
      return this.header != null || this.$attrs["aria-labelledby"] !== null ? this.$id + "_header" : null;
    },
    closeAriaLabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : void 0;
    },
    dataP: function() {
      return pt({
        maximized: this.maximized,
        modal: this.modal
      });
    }
  },
  directives: {
    ripple: eo,
    focustrap: Ts
  },
  components: {
    Button: le,
    Portal: Mo,
    WindowMinimizeIcon: No,
    WindowMaximizeIcon: Uo,
    TimesIcon: so
  }
};
function wn(e) {
  "@babel/helpers - typeof";
  return wn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, wn(e);
}
function vo(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    t && (s = s.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, s);
  }
  return n;
}
function go(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? vo(Object(n), !0).forEach(function(s) {
      Hs(e, s, n[s]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : vo(Object(n)).forEach(function(s) {
      Object.defineProperty(e, s, Object.getOwnPropertyDescriptor(n, s));
    });
  }
  return e;
}
function Hs(e, t, n) {
  return (t = js(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function js(e) {
  var t = Us(e, "string");
  return wn(t) == "symbol" ? t : t + "";
}
function Us(e, t) {
  if (wn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if (wn(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ns = ["data-p"], Ks = ["aria-labelledby", "aria-modal", "data-p"], qs = ["id"], Gs = ["data-p"];
function Ws(e, t, n, s, i, r) {
  var f = Oe("Button"), g = Oe("Portal"), v = to("focustrap");
  return a(), ce(g, {
    appendTo: e.appendTo
  }, {
    default: ee(function() {
      return [i.containerVisible ? (a(), u("div", W({
        key: 0,
        ref: r.maskRef,
        class: e.cx("mask"),
        style: e.sx("mask", !0, {
          position: e.position,
          modal: e.modal
        }),
        onMousedown: t[1] || (t[1] = function() {
          return r.onMaskMouseDown && r.onMaskMouseDown.apply(r, arguments);
        }),
        onMouseup: t[2] || (t[2] = function() {
          return r.onMaskMouseUp && r.onMaskMouseUp.apply(r, arguments);
        }),
        "data-p": r.dataP
      }, e.ptm("mask")), [m(Eo, W({
        name: "p-dialog",
        onEnter: r.onEnter,
        onAfterEnter: r.onAfterEnter,
        onBeforeLeave: r.onBeforeLeave,
        onLeave: r.onLeave,
        onAfterLeave: r.onAfterLeave,
        appear: ""
      }, e.ptm("transition")), {
        default: ee(function() {
          return [e.visible ? De((a(), u("div", W({
            key: 0,
            ref: r.containerRef,
            class: e.cx("root"),
            style: e.sx("root"),
            role: "dialog",
            "aria-labelledby": r.ariaLabelledById,
            "aria-modal": e.modal,
            "data-p": r.dataP
          }, e.ptmi("root")), [e.$slots.container ? ie(e.$slots, "container", {
            key: 0,
            closeCallback: r.close,
            maximizeCallback: function(S) {
              return r.maximize(S);
            },
            initDragCallback: r.initDrag
          }) : (a(), u(X, {
            key: 1
          }, [e.showHeader ? (a(), u("div", W({
            key: 0,
            ref: r.headerContainerRef,
            class: e.cx("header"),
            onMousedown: t[0] || (t[0] = function() {
              return r.initDrag && r.initDrag.apply(r, arguments);
            })
          }, e.ptm("header")), [ie(e.$slots, "header", {
            class: ne(e.cx("title"))
          }, function() {
            return [e.header ? (a(), u("span", W({
              key: 0,
              id: r.ariaLabelledById,
              class: e.cx("title")
            }, e.ptm("title")), c(e.header), 17, qs)) : h("", !0)];
          }), l("div", W({
            class: e.cx("headerActions")
          }, e.ptm("headerActions")), [e.maximizable ? ie(e.$slots, "maximizebutton", {
            key: 0,
            maximized: i.maximized,
            maximizeCallback: function(S) {
              return r.maximize(S);
            }
          }, function() {
            return [m(f, W({
              ref: r.maximizableRef,
              autofocus: i.focusableMax,
              class: e.cx("pcMaximizeButton"),
              onClick: r.maximize,
              tabindex: e.maximizable ? "0" : "-1",
              unstyled: e.unstyled
            }, e.maximizeButtonProps, {
              pt: e.ptm("pcMaximizeButton"),
              "data-pc-group-section": "headericon"
            }), {
              icon: ee(function(w) {
                return [ie(e.$slots, "maximizeicon", {
                  maximized: i.maximized
                }, function() {
                  return [(a(), ce(pn(r.maximizeIconComponent), W({
                    class: [w.class, i.maximized ? e.minimizeIcon : e.maximizeIcon]
                  }, e.ptm("pcMaximizeButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["autofocus", "class", "onClick", "tabindex", "unstyled", "pt"])];
          }) : h("", !0), e.closable ? ie(e.$slots, "closebutton", {
            key: 1,
            closeCallback: r.close
          }, function() {
            return [m(f, W({
              ref: r.closeButtonRef,
              autofocus: i.focusableClose,
              class: e.cx("pcCloseButton"),
              onClick: r.close,
              "aria-label": r.closeAriaLabel,
              unstyled: e.unstyled
            }, e.closeButtonProps, {
              pt: e.ptm("pcCloseButton"),
              "data-pc-group-section": "headericon"
            }), {
              icon: ee(function(w) {
                return [ie(e.$slots, "closeicon", {}, function() {
                  return [(a(), ce(pn(e.closeIcon ? "span" : "TimesIcon"), W({
                    class: [e.closeIcon, w.class]
                  }, e.ptm("pcCloseButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["autofocus", "class", "onClick", "aria-label", "unstyled", "pt"])];
          }) : h("", !0)], 16)], 16)) : h("", !0), l("div", W({
            ref: r.contentRef,
            class: [e.cx("content"), e.contentClass],
            style: e.contentStyle,
            "data-p": r.dataP
          }, go(go({}, e.contentProps), e.ptm("content"))), [ie(e.$slots, "default")], 16, Gs), e.footer || e.$slots.footer ? (a(), u("div", W({
            key: 1,
            ref: r.footerContainerRef,
            class: e.cx("footer")
          }, e.ptm("footer")), [ie(e.$slots, "footer", {}, function() {
            return [P(c(e.footer), 1)];
          })], 16)) : h("", !0)], 64))], 16, Ks)), [[v, {
            disabled: !e.modal
          }]]) : h("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])], 16, Ns)) : h("", !0)];
    }),
    _: 3
  }, 8, ["appendTo"]);
}
Ko.render = Ws;
var qo = {
  name: "BlankIcon",
  extends: At
};
function Zs(e) {
  return Qs(e) || Js(e) || Xs(e) || Ys();
}
function Ys() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xs(e, t) {
  if (e) {
    if (typeof e == "string") return qn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? qn(e, t) : void 0;
  }
}
function Js(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Qs(e) {
  if (Array.isArray(e)) return qn(e);
}
function qn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function ea(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Zs(t[0] || (t[0] = [l("rect", {
    width: "1",
    height: "1",
    fill: "currentColor",
    "fill-opacity": "0"
  }, null, -1)])), 16);
}
qo.render = ea;
var Go = {
  name: "CheckIcon",
  extends: At
};
function ta(e) {
  return sa(e) || ia(e) || oa(e) || na();
}
function na() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function oa(e, t) {
  if (e) {
    if (typeof e == "string") return Gn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Gn(e, t) : void 0;
  }
}
function ia(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function sa(e) {
  if (Array.isArray(e)) return Gn(e);
}
function Gn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function aa(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), ta(t[0] || (t[0] = [l("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Go.render = aa;
var Wo = {
  name: "ChevronDownIcon",
  extends: At
};
function la(e) {
  return ca(e) || da(e) || ua(e) || ra();
}
function ra() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ua(e, t) {
  if (e) {
    if (typeof e == "string") return Wn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Wn(e, t) : void 0;
  }
}
function da(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ca(e) {
  if (Array.isArray(e)) return Wn(e);
}
function Wn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function pa(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), la(t[0] || (t[0] = [l("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Wo.render = pa;
var Zo = {
  name: "SearchIcon",
  extends: At
};
function fa(e) {
  return va(e) || ba(e) || ha(e) || ma();
}
function ma() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ha(e, t) {
  if (e) {
    if (typeof e == "string") return Zn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Zn(e, t) : void 0;
  }
}
function ba(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function va(e) {
  if (Array.isArray(e)) return Zn(e);
}
function Zn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function ga(e, t, n, s, i, r) {
  return a(), u("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), fa(t[0] || (t[0] = [l("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Zo.render = ga;
var ya = `
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`, ka = {
  root: "p-iconfield"
}, wa = $t.extend({
  name: "iconfield",
  style: ya,
  classes: ka
}), Sa = {
  name: "BaseIconField",
  extends: qt,
  style: wa,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, Yo = {
  name: "IconField",
  extends: Sa,
  inheritAttrs: !1
};
function $a(e, t, n, s, i, r) {
  return a(), u("div", W({
    class: e.cx("root")
  }, e.ptmi("root")), [ie(e.$slots, "default")], 16);
}
Yo.render = $a;
var Ca = {
  root: "p-inputicon"
}, Ia = $t.extend({
  name: "inputicon",
  classes: Ca
}), _a = {
  name: "BaseInputIcon",
  extends: qt,
  style: Ia,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, Xo = {
  name: "InputIcon",
  extends: _a,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function xa(e, t, n, s, i, r) {
  return a(), u("span", W({
    class: r.containerClass
  }, e.ptmi("root"), {
    "aria-hidden": "true"
  }), [ie(e.$slots, "default")], 16);
}
Xo.render = xa;
var Oa = {
  name: "BaseEditableHolder",
  extends: qt,
  emits: ["update:modelValue", "value-change"],
  props: {
    modelValue: {
      type: null,
      default: void 0
    },
    defaultValue: {
      type: null,
      default: void 0
    },
    name: {
      type: String,
      default: void 0
    },
    invalid: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    formControl: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcForm: {
      default: void 0
    },
    $pcFormField: {
      default: void 0
    }
  },
  data: function() {
    return {
      d_value: this.defaultValue !== void 0 ? this.defaultValue : this.modelValue
    };
  },
  watch: {
    modelValue: {
      deep: !0,
      handler: function(t) {
        this.d_value = t;
      }
    },
    defaultValue: function(t) {
      this.d_value = t;
    },
    $formName: {
      immediate: !0,
      handler: function(t) {
        var n, s;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (s = n.register) === null || s === void 0 ? void 0 : s.call(n, t, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(t) {
        var n, s;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (s = n.register) === null || s === void 0 ? void 0 : s.call(n, this.$formName, t)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(t) {
        this.d_value !== t && (this.d_value = t);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(t) {
        var n;
        (n = this.$pcForm) !== null && n !== void 0 && n.getFieldState(this.$formName) && t !== this.d_value && (this.d_value = t);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(t, n) {
      var s, i;
      this.controlled && (this.d_value = t, this.$emit("update:modelValue", t)), this.$emit("value-change", t), (s = (i = this.formField).onChange) === null || s === void 0 || s.call(i, {
        originalEvent: n,
        value: t
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var t = arguments.length, n = new Array(t), s = 0; s < t; s++)
        n[s] = arguments[s];
      return n.find(zt);
    }
  },
  computed: {
    $filled: function() {
      return zt(this.d_value);
    },
    $invalid: function() {
      var t, n;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.invalid, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.invalid);
    },
    $formName: function() {
      var t;
      return this.$formNovalidate ? void 0 : this.name || ((t = this.$formControl) === null || t === void 0 ? void 0 : t.name);
    },
    $formControl: function() {
      var t;
      return this.formControl || ((t = this.$pcFormField) === null || t === void 0 ? void 0 : t.formControl);
    },
    $formNovalidate: function() {
      var t;
      return (t = this.$formControl) === null || t === void 0 ? void 0 : t.novalidate;
    },
    $formDefaultValue: function() {
      var t, n;
      return this.findNonEmpty(this.d_value, (t = this.$pcFormField) === null || t === void 0 ? void 0 : t.initialValue, (n = this.$pcForm) === null || n === void 0 || (n = n.initialValues) === null || n === void 0 ? void 0 : n[this.$formName]);
    },
    $formValue: function() {
      var t, n;
      return this.findNonEmpty((t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.value, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, Jo = {
  name: "BaseInput",
  extends: Oa,
  props: {
    size: {
      type: String,
      default: null
    },
    fluid: {
      type: Boolean,
      default: null
    },
    variant: {
      type: String,
      default: null
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcFluid: {
      default: void 0
    }
  },
  computed: {
    $variant: function() {
      var t;
      return (t = this.variant) !== null && t !== void 0 ? t : this.$primevue.config.inputStyle || this.$primevue.config.inputVariant;
    },
    $fluid: function() {
      var t;
      return (t = this.fluid) !== null && t !== void 0 ? t : !!this.$pcFluid;
    },
    // @deprecated use $fluid instead
    hasFluid: function() {
      return this.$fluid;
    }
  }
}, La = `
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`, za = {
  root: function(t) {
    var n = t.instance, s = t.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": s.size === "small",
      "p-inputtext-lg p-inputfield-lg": s.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, Aa = $t.extend({
  name: "inputtext",
  style: La,
  classes: za
}), Ma = {
  name: "BaseInputText",
  extends: Jo,
  style: Aa,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function Sn(e) {
  "@babel/helpers - typeof";
  return Sn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Sn(e);
}
function Pa(e, t, n) {
  return (t = Fa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Fa(e) {
  var t = Ta(e, "string");
  return Sn(t) == "symbol" ? t : t + "";
}
function Ta(e, t) {
  if (Sn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if (Sn(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Qo = {
  name: "InputText",
  extends: Ma,
  inheritAttrs: !1,
  methods: {
    onInput: function(t) {
      this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return W(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return pt(Pa({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, Ea = ["value", "name", "disabled", "aria-invalid", "data-p"];
function Va(e, t, n, s, i, r) {
  return a(), u("input", W({
    type: "text",
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.$invalid || void 0,
    "data-p": r.dataP,
    onInput: t[0] || (t[0] = function() {
      return r.onInput && r.onInput.apply(r, arguments);
    })
  }, r.attrs), null, 16, Ea);
}
Qo.render = Va;
var Da = `
    .p-virtualscroller-loader {
        background: dt('virtualscroller.loader.mask.background');
        color: dt('virtualscroller.loader.mask.color');
    }

    .p-virtualscroller-loading-icon {
        font-size: dt('virtualscroller.loader.icon.size');
        width: dt('virtualscroller.loader.icon.size');
        height: dt('virtualscroller.loader.icon.size');
    }
`, Ra = `
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}

.p-virtualscroller .p-virtualscroller-loading {
    transform: none !important;
    min-height: 0;
    position: sticky;
    inset-block-start: 0;
    inset-inline-start: 0;
}
`, yo = $t.extend({
  name: "virtualscroller",
  css: Ra,
  style: Da
}), Ba = {
  name: "BaseVirtualScroller",
  extends: qt,
  props: {
    id: {
      type: String,
      default: null
    },
    style: null,
    class: null,
    items: {
      type: Array,
      default: null
    },
    itemSize: {
      type: [Number, Array],
      default: 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      default: "vertical"
    },
    numToleratedItems: {
      type: Number,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    resizeDelay: {
      type: Number,
      default: 10
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    loaderDisabled: {
      type: Boolean,
      default: !1
    },
    columns: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: !1
    },
    showSpacer: {
      type: Boolean,
      default: !0
    },
    showLoader: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    inline: {
      type: Boolean,
      default: !1
    },
    step: {
      type: Number,
      default: 0
    },
    appendOnly: {
      type: Boolean,
      default: !1
    },
    autoSize: {
      type: Boolean,
      default: !1
    }
  },
  style: yo,
  provide: function() {
    return {
      $pcVirtualScroller: this,
      $parentInstance: this
    };
  },
  beforeMount: function() {
    var t;
    yo.loadCSS({
      nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
    });
  }
};
function $n(e) {
  "@babel/helpers - typeof";
  return $n = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $n(e);
}
function ko(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    t && (s = s.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, s);
  }
  return n;
}
function un(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ko(Object(n), !0).forEach(function(s) {
      ei(e, s, n[s]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ko(Object(n)).forEach(function(s) {
      Object.defineProperty(e, s, Object.getOwnPropertyDescriptor(n, s));
    });
  }
  return e;
}
function ei(e, t, n) {
  return (t = Ha(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ha(e) {
  var t = ja(e, "string");
  return $n(t) == "symbol" ? t : t + "";
}
function ja(e, t) {
  if ($n(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if ($n(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ti = {
  name: "VirtualScroller",
  extends: Ba,
  inheritAttrs: !1,
  emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
  data: function() {
    var t = this.isBoth();
    return {
      first: t ? {
        rows: 0,
        cols: 0
      } : 0,
      last: t ? {
        rows: 0,
        cols: 0
      } : 0,
      page: t ? {
        rows: 0,
        cols: 0
      } : 0,
      numItemsInViewport: t ? {
        rows: 0,
        cols: 0
      } : 0,
      lastScrollPos: t ? {
        top: 0,
        left: 0
      } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },
  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  resizeTimeout: null,
  defaultWidth: 0,
  defaultHeight: 0,
  defaultContentWidth: 0,
  defaultContentHeight: 0,
  isRangeChanged: !1,
  lazyLoadState: {},
  resizeListener: null,
  resizeObserver: null,
  initialized: !1,
  watch: {
    numToleratedItems: function(t) {
      this.d_numToleratedItems = t;
    },
    loading: function(t, n) {
      this.lazy && t !== n && t !== this.d_loading && (this.d_loading = t);
    },
    items: {
      handler: function(t, n) {
        (!n || n.length !== (t || []).length) && (this.init(), this.calculateAutoSize());
      },
      deep: !0
    },
    itemSize: function() {
      this.init(), this.calculateAutoSize();
    },
    orientation: function() {
      this.lastScrollPos = this.isBoth() ? {
        top: 0,
        left: 0
      } : 0;
    },
    scrollHeight: function() {
      this.init(), this.calculateAutoSize();
    },
    scrollWidth: function() {
      this.init(), this.calculateAutoSize();
    }
  },
  mounted: function() {
    this.viewInit(), this.lastScrollPos = this.isBoth() ? {
      top: 0,
      left: 0
    } : 0, this.lazyLoadState = this.lazyLoadState || {};
  },
  updated: function() {
    !this.initialized && this.viewInit();
  },
  unmounted: function() {
    this.unbindResizeListener(), this.initialized = !1;
  },
  methods: {
    viewInit: function() {
      zn(this.element) && (this.setContentEl(this.content), this.init(), this.calculateAutoSize(), this.defaultWidth = an(this.element), this.defaultHeight = ln(this.element), this.defaultContentWidth = an(this.content), this.defaultContentHeight = ln(this.content), this.initialized = !0), this.element && this.bindResizeListener();
    },
    init: function() {
      this.disabled || (this.setSize(), this.calculateOptions(), this.setSpacerSize());
    },
    isVertical: function() {
      return this.orientation === "vertical";
    },
    isHorizontal: function() {
      return this.orientation === "horizontal";
    },
    isBoth: function() {
      return this.orientation === "both";
    },
    scrollTo: function(t) {
      this.element && this.element.scrollTo(t);
    },
    scrollToIndex: function(t) {
      var n = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto", i = this.isBoth(), r = this.isHorizontal(), f = i ? t.every(function(p) {
        return p > -1;
      }) : t > -1;
      if (f) {
        var g = this.first, v = this.element, w = v.scrollTop, S = w === void 0 ? 0 : w, _ = v.scrollLeft, F = _ === void 0 ? 0 : _, B = this.calculateNumItems(), T = B.numToleratedItems, N = this.getContentPosition(), z = this.itemSize, K = function() {
          var k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, A = arguments.length > 1 ? arguments[1] : void 0;
          return k <= A ? 0 : k;
        }, j = function(k, A, re) {
          return k * A + re;
        }, M = function() {
          var k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.scrollTo({
            left: k,
            top: A,
            behavior: s
          });
        }, R = i ? {
          rows: 0,
          cols: 0
        } : 0, d = !1, Q = !1;
        i ? (R = {
          rows: K(t[0], T[0]),
          cols: K(t[1], T[1])
        }, M(j(R.cols, z[1], N.left), j(R.rows, z[0], N.top)), Q = this.lastScrollPos.top !== S || this.lastScrollPos.left !== F, d = R.rows !== g.rows || R.cols !== g.cols) : (R = K(t, T), r ? M(j(R, z, N.left), S) : M(F, j(R, z, N.top)), Q = this.lastScrollPos !== (r ? F : S), d = R !== g), this.isRangeChanged = d, Q && (this.first = R);
      }
    },
    scrollInView: function(t, n) {
      var s = this, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
      if (n) {
        var r = this.isBoth(), f = this.isHorizontal(), g = r ? t.every(function(z) {
          return z > -1;
        }) : t > -1;
        if (g) {
          var v = this.getRenderedRange(), w = v.first, S = v.viewport, _ = function() {
            var K = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, j = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return s.scrollTo({
              left: K,
              top: j,
              behavior: i
            });
          }, F = n === "to-start", B = n === "to-end";
          if (F) {
            if (r)
              S.first.rows - w.rows > t[0] ? _(S.first.cols * this.itemSize[1], (S.first.rows - 1) * this.itemSize[0]) : S.first.cols - w.cols > t[1] && _((S.first.cols - 1) * this.itemSize[1], S.first.rows * this.itemSize[0]);
            else if (S.first - w > t) {
              var T = (S.first - 1) * this.itemSize;
              f ? _(T, 0) : _(0, T);
            }
          } else if (B) {
            if (r)
              S.last.rows - w.rows <= t[0] + 1 ? _(S.first.cols * this.itemSize[1], (S.first.rows + 1) * this.itemSize[0]) : S.last.cols - w.cols <= t[1] + 1 && _((S.first.cols + 1) * this.itemSize[1], S.first.rows * this.itemSize[0]);
            else if (S.last - w <= t + 1) {
              var N = (S.first + 1) * this.itemSize;
              f ? _(N, 0) : _(0, N);
            }
          }
        }
      } else
        this.scrollToIndex(t, i);
    },
    getRenderedRange: function() {
      var t = function(_, F) {
        return Math.floor(_ / (F || _));
      }, n = this.first, s = 0;
      if (this.element) {
        var i = this.isBoth(), r = this.isHorizontal(), f = this.element, g = f.scrollTop, v = f.scrollLeft;
        if (i)
          n = {
            rows: t(g, this.itemSize[0]),
            cols: t(v, this.itemSize[1])
          }, s = {
            rows: n.rows + this.numItemsInViewport.rows,
            cols: n.cols + this.numItemsInViewport.cols
          };
        else {
          var w = r ? v : g;
          n = t(w, this.itemSize), s = n + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: n,
          last: s
        }
      };
    },
    calculateNumItems: function() {
      var t = this.isBoth(), n = this.isHorizontal(), s = this.itemSize, i = this.getContentPosition(), r = this.element ? this.element.offsetWidth - i.left : 0, f = this.element ? this.element.offsetHeight - i.top : 0, g = function(F, B) {
        return Math.ceil(F / (B || F));
      }, v = function(F) {
        return Math.ceil(F / 2);
      }, w = t ? {
        rows: g(f, s[0]),
        cols: g(r, s[1])
      } : g(n ? r : f, s), S = this.d_numToleratedItems || (t ? [v(w.rows), v(w.cols)] : v(w));
      return {
        numItemsInViewport: w,
        numToleratedItems: S
      };
    },
    calculateOptions: function() {
      var t = this, n = this.isBoth(), s = this.first, i = this.calculateNumItems(), r = i.numItemsInViewport, f = i.numToleratedItems, g = function(S, _, F) {
        var B = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        return t.getLast(S + _ + (S < F ? 2 : 3) * F, B);
      }, v = n ? {
        rows: g(s.rows, r.rows, f[0]),
        cols: g(s.cols, r.cols, f[1], !0)
      } : g(s, r, f);
      this.last = v, this.numItemsInViewport = r, this.d_numToleratedItems = f, this.$emit("update:numToleratedItems", this.d_numToleratedItems), this.showLoader && (this.loaderArr = n ? Array.from({
        length: r.rows
      }).map(function() {
        return Array.from({
          length: r.cols
        });
      }) : Array.from({
        length: r
      })), this.lazy && Promise.resolve().then(function() {
        var w;
        t.lazyLoadState = {
          first: t.step ? n ? {
            rows: 0,
            cols: s.cols
          } : 0 : s,
          last: Math.min(t.step ? t.step : v, ((w = t.items) === null || w === void 0 ? void 0 : w.length) || 0)
        }, t.$emit("lazy-load", t.lazyLoadState);
      });
    },
    calculateAutoSize: function() {
      var t = this;
      this.autoSize && !this.d_loading && Promise.resolve().then(function() {
        if (t.content) {
          var n = t.isBoth(), s = t.isHorizontal(), i = t.isVertical();
          t.content.style.minHeight = t.content.style.minWidth = "auto", t.content.style.position = "relative", t.element.style.contain = "none";
          var r = [an(t.element), ln(t.element)], f = r[0], g = r[1];
          (n || s) && (t.element.style.width = f < t.defaultWidth ? f + "px" : t.scrollWidth || t.defaultWidth + "px"), (n || i) && (t.element.style.height = g < t.defaultHeight ? g + "px" : t.scrollHeight || t.defaultHeight + "px"), t.content.style.minHeight = t.content.style.minWidth = "", t.content.style.position = "", t.element.style.contain = "";
        }
      });
    },
    getLast: function() {
      var t, n, s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, i = arguments.length > 1 ? arguments[1] : void 0;
      return this.items ? Math.min(i ? ((t = this.columns || this.items[0]) === null || t === void 0 ? void 0 : t.length) || 0 : ((n = this.items) === null || n === void 0 ? void 0 : n.length) || 0, s) : 0;
    },
    getContentPosition: function() {
      if (this.content) {
        var t = getComputedStyle(this.content), n = parseFloat(t.paddingLeft) + Math.max(parseFloat(t.left) || 0, 0), s = parseFloat(t.paddingRight) + Math.max(parseFloat(t.right) || 0, 0), i = parseFloat(t.paddingTop) + Math.max(parseFloat(t.top) || 0, 0), r = parseFloat(t.paddingBottom) + Math.max(parseFloat(t.bottom) || 0, 0);
        return {
          left: n,
          right: s,
          top: i,
          bottom: r,
          x: n + s,
          y: i + r
        };
      }
      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        x: 0,
        y: 0
      };
    },
    setSize: function() {
      var t = this;
      if (this.element) {
        var n = this.isBoth(), s = this.isHorizontal(), i = this.element.parentElement, r = this.scrollWidth || "".concat(this.element.offsetWidth || i.offsetWidth, "px"), f = this.scrollHeight || "".concat(this.element.offsetHeight || i.offsetHeight, "px"), g = function(w, S) {
          return t.element.style[w] = S;
        };
        n || s ? (g("height", f), g("width", r)) : g("height", f);
      }
    },
    setSpacerSize: function() {
      var t = this, n = this.items;
      if (n) {
        var s = this.isBoth(), i = this.isHorizontal(), r = this.getContentPosition(), f = function(v, w, S) {
          var _ = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          return t.spacerStyle = un(un({}, t.spacerStyle), ei({}, "".concat(v), (w || []).length * S + _ + "px"));
        };
        s ? (f("height", n, this.itemSize[0], r.y), f("width", this.columns || n[1], this.itemSize[1], r.x)) : i ? f("width", this.columns || n, this.itemSize, r.x) : f("height", n, this.itemSize, r.y);
      }
    },
    setContentPosition: function(t) {
      var n = this;
      if (this.content && !this.appendOnly) {
        var s = this.isBoth(), i = this.isHorizontal(), r = t ? t.first : this.first, f = function(S, _) {
          return S * _;
        }, g = function() {
          var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, _ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.contentStyle = un(un({}, n.contentStyle), {
            transform: "translate3d(".concat(S, "px, ").concat(_, "px, 0)")
          });
        };
        if (s)
          g(f(r.cols, this.itemSize[1]), f(r.rows, this.itemSize[0]));
        else {
          var v = f(r, this.itemSize);
          i ? g(v, 0) : g(0, v);
        }
      }
    },
    onScrollPositionChange: function(t) {
      var n = this, s = t.target, i = this.isBoth(), r = this.isHorizontal(), f = this.getContentPosition(), g = function(b, I) {
        return b ? b > I ? b - I : b : 0;
      }, v = function(b, I) {
        return Math.floor(b / (I || b));
      }, w = function(b, I, L, E, J, te) {
        return b <= J ? J : te ? L - E - J : I + J - 1;
      }, S = function(b, I, L, E, J, te, oe, me) {
        if (b <= te) return 0;
        var Ae = Math.max(0, oe ? b < I ? L : b - te : b > I ? L : b - 2 * te), ge = n.getLast(Ae, me);
        return Ae > ge ? ge - J : Ae;
      }, _ = function(b, I, L, E, J, te) {
        var oe = I + E + 2 * J;
        return b >= J && (oe += J + 1), n.getLast(oe, te);
      }, F = g(s.scrollTop, f.top), B = g(s.scrollLeft, f.left), T = i ? {
        rows: 0,
        cols: 0
      } : 0, N = this.last, z = !1, K = this.lastScrollPos;
      if (i) {
        var j = this.lastScrollPos.top <= F, M = this.lastScrollPos.left <= B;
        if (!this.appendOnly || this.appendOnly && (j || M)) {
          var R = {
            rows: v(F, this.itemSize[0]),
            cols: v(B, this.itemSize[1])
          }, d = {
            rows: w(R.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], j),
            cols: w(R.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], M)
          };
          T = {
            rows: S(R.rows, d.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], j),
            cols: S(R.cols, d.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], M, !0)
          }, N = {
            rows: _(R.rows, T.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: _(R.cols, T.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], !0)
          }, z = T.rows !== this.first.rows || N.rows !== this.last.rows || T.cols !== this.first.cols || N.cols !== this.last.cols || this.isRangeChanged, K = {
            top: F,
            left: B
          };
        }
      } else {
        var Q = r ? B : F, p = this.lastScrollPos <= Q;
        if (!this.appendOnly || this.appendOnly && p) {
          var k = v(Q, this.itemSize), A = w(k, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, p);
          T = S(k, A, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, p), N = _(k, T, this.last, this.numItemsInViewport, this.d_numToleratedItems), z = T !== this.first || N !== this.last || this.isRangeChanged, K = Q;
        }
      }
      return {
        first: T,
        last: N,
        isRangeChanged: z,
        scrollPos: K
      };
    },
    onScrollChange: function(t) {
      var n = this.onScrollPositionChange(t), s = n.first, i = n.last, r = n.isRangeChanged, f = n.scrollPos;
      if (r) {
        var g = {
          first: s,
          last: i
        };
        if (this.setContentPosition(g), this.first = s, this.last = i, this.lastScrollPos = f, this.$emit("scroll-index-change", g), this.lazy && this.isPageChanged(s)) {
          var v, w, S = {
            first: this.step ? Math.min(this.getPageByFirst(s) * this.step, (((v = this.items) === null || v === void 0 ? void 0 : v.length) || 0) - this.step) : s,
            last: Math.min(this.step ? (this.getPageByFirst(s) + 1) * this.step : i, ((w = this.items) === null || w === void 0 ? void 0 : w.length) || 0)
          }, _ = this.lazyLoadState.first !== S.first || this.lazyLoadState.last !== S.last;
          _ && this.$emit("lazy-load", S), this.lazyLoadState = S;
        }
      }
    },
    onScroll: function(t) {
      var n = this;
      if (this.$emit("scroll", t), this.delay) {
        if (this.scrollTimeout && clearTimeout(this.scrollTimeout), this.isPageChanged()) {
          if (!this.d_loading && this.showLoader) {
            var s = this.onScrollPositionChange(t), i = s.isRangeChanged, r = i || (this.step ? this.isPageChanged() : !1);
            r && (this.d_loading = !0);
          }
          this.scrollTimeout = setTimeout(function() {
            n.onScrollChange(t), n.d_loading && n.showLoader && (!n.lazy || n.loading === void 0) && (n.d_loading = !1, n.page = n.getPageByFirst());
          }, this.delay);
        }
      } else
        this.onScrollChange(t);
    },
    onResize: function() {
      var t = this;
      this.resizeTimeout && clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
        if (zn(t.element)) {
          var n = t.isBoth(), s = t.isVertical(), i = t.isHorizontal(), r = [an(t.element), ln(t.element)], f = r[0], g = r[1], v = f !== t.defaultWidth, w = g !== t.defaultHeight, S = n ? v || w : i ? v : s ? w : !1;
          S && (t.d_numToleratedItems = t.numToleratedItems, t.defaultWidth = f, t.defaultHeight = g, t.defaultContentWidth = an(t.content), t.defaultContentHeight = ln(t.content), t.init());
        }
      }, this.resizeDelay);
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = this.onResize.bind(this), window.addEventListener("resize", this.resizeListener), window.addEventListener("orientationchange", this.resizeListener), this.resizeObserver = new ResizeObserver(function() {
        t.onResize();
      }), this.resizeObserver.observe(this.element));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), window.removeEventListener("orientationchange", this.resizeListener), this.resizeListener = null), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null);
    },
    getOptions: function(t) {
      var n = (this.items || []).length, s = this.isBoth() ? this.first.rows + t : this.first + t;
      return {
        index: s,
        count: n,
        first: s === 0,
        last: s === n - 1,
        even: s % 2 === 0,
        odd: s % 2 !== 0
      };
    },
    getLoaderOptions: function(t, n) {
      var s = this.loaderArr.length;
      return un({
        index: t,
        count: s,
        first: t === 0,
        last: t === s - 1,
        even: t % 2 === 0,
        odd: t % 2 !== 0
      }, n);
    },
    getPageByFirst: function(t) {
      return Math.floor(((t ?? this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
    },
    isPageChanged: function(t) {
      return this.step && !this.lazy ? this.page !== this.getPageByFirst(t ?? this.first) : !0;
    },
    setContentEl: function(t) {
      this.content = t || this.content || To(this.element, '[data-pc-section="content"]');
    },
    elementRef: function(t) {
      this.element = t;
    },
    contentRef: function(t) {
      this.content = t;
    }
  },
  computed: {
    containerClass: function() {
      return ["p-virtualscroller", this.class, {
        "p-virtualscroller-inline": this.inline,
        "p-virtualscroller-both p-both-scroll": this.isBoth(),
        "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
      }];
    },
    contentClass: function() {
      return ["p-virtualscroller-content", {
        "p-virtualscroller-loading": this.d_loading
      }];
    },
    loaderClass: function() {
      return ["p-virtualscroller-loader", {
        "p-virtualscroller-loader-mask": !this.$slots.loader
      }];
    },
    loadedItems: function() {
      var t = this;
      return this.items && !this.d_loading ? this.isBoth() ? this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map(function(n) {
        return t.columns ? n : n.slice(t.appendOnly ? 0 : t.first.cols, t.last.cols);
      }) : this.isHorizontal() && this.columns ? this.items : this.items.slice(this.appendOnly ? 0 : this.first, this.last) : [];
    },
    loadedRows: function() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },
    loadedColumns: function() {
      if (this.columns) {
        var t = this.isBoth(), n = this.isHorizontal();
        if (t || n)
          return this.d_loading && this.loaderDisabled ? t ? this.loaderArr[0] : this.loaderArr : this.columns.slice(t ? this.first.cols : this.first, t ? this.last.cols : this.last);
      }
      return this.columns;
    }
  },
  components: {
    SpinnerIcon: En
  }
}, Ua = ["tabindex"];
function Na(e, t, n, s, i, r) {
  var f = Oe("SpinnerIcon");
  return e.disabled ? (a(), u(X, {
    key: 1
  }, [ie(e.$slots, "default"), ie(e.$slots, "content", {
    items: e.items,
    rows: e.items,
    columns: r.loadedColumns
  })], 64)) : (a(), u("div", W({
    key: 0,
    ref: r.elementRef,
    class: r.containerClass,
    tabindex: e.tabindex,
    style: e.style,
    onScroll: t[0] || (t[0] = function() {
      return r.onScroll && r.onScroll.apply(r, arguments);
    })
  }, e.ptmi("root")), [ie(e.$slots, "content", {
    styleClass: r.contentClass,
    items: r.loadedItems,
    getItemOptions: r.getOptions,
    loading: i.d_loading,
    getLoaderOptions: r.getLoaderOptions,
    itemSize: e.itemSize,
    rows: r.loadedRows,
    columns: r.loadedColumns,
    contentRef: r.contentRef,
    spacerStyle: i.spacerStyle,
    contentStyle: i.contentStyle,
    vertical: r.isVertical(),
    horizontal: r.isHorizontal(),
    both: r.isBoth()
  }, function() {
    return [l("div", W({
      ref: r.contentRef,
      class: r.contentClass,
      style: i.contentStyle
    }, e.ptm("content")), [(a(!0), u(X, null, se(r.loadedItems, function(g, v) {
      return ie(e.$slots, "item", {
        key: v,
        item: g,
        options: r.getOptions(v)
      });
    }), 128))], 16)];
  }), e.showSpacer ? (a(), u("div", W({
    key: 0,
    class: "p-virtualscroller-spacer",
    style: i.spacerStyle
  }, e.ptm("spacer")), null, 16)) : h("", !0), !e.loaderDisabled && e.showLoader && i.d_loading ? (a(), u("div", W({
    key: 1,
    class: r.loaderClass
  }, e.ptm("loader")), [e.$slots && e.$slots.loader ? (a(!0), u(X, {
    key: 0
  }, se(i.loaderArr, function(g, v) {
    return ie(e.$slots, "loader", {
      key: v,
      options: r.getLoaderOptions(v, r.isBoth() && {
        numCols: e.d_numItemsInViewport.cols
      })
    });
  }), 128)) : h("", !0), ie(e.$slots, "loadingicon", {}, function() {
    return [m(f, W({
      spin: "",
      class: "p-virtualscroller-loading-icon"
    }, e.ptm("loadingIcon")), null, 16)];
  })], 16)) : h("", !0)], 16, Ua));
}
ti.render = Na;
var Ka = `
    .p-select {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('select.background');
        border: 1px solid dt('select.border.color');
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            outline-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration');
        border-radius: dt('select.border.radius');
        outline-color: transparent;
        box-shadow: dt('select.shadow');
    }

    .p-select:not(.p-disabled):hover {
        border-color: dt('select.hover.border.color');
    }

    .p-select:not(.p-disabled).p-focus {
        border-color: dt('select.focus.border.color');
        box-shadow: dt('select.focus.ring.shadow');
        outline: dt('select.focus.ring.width') dt('select.focus.ring.style') dt('select.focus.ring.color');
        outline-offset: dt('select.focus.ring.offset');
    }

    .p-select.p-variant-filled {
        background: dt('select.filled.background');
    }

    .p-select.p-variant-filled:not(.p-disabled):hover {
        background: dt('select.filled.hover.background');
    }

    .p-select.p-variant-filled:not(.p-disabled).p-focus {
        background: dt('select.filled.focus.background');
    }

    .p-select.p-invalid {
        border-color: dt('select.invalid.border.color');
    }

    .p-select.p-disabled {
        opacity: 1;
        background: dt('select.disabled.background');
    }

    .p-select-clear-icon {
        align-self: center;
        color: dt('select.clear.icon.color');
        inset-inline-end: dt('select.dropdown.width');
    }

    .p-select-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('select.dropdown.color');
        width: dt('select.dropdown.width');
        border-start-end-radius: dt('select.border.radius');
        border-end-end-radius: dt('select.border.radius');
    }

    .p-select-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        padding: dt('select.padding.y') dt('select.padding.x');
        text-overflow: ellipsis;
        cursor: pointer;
        color: dt('select.color');
        background: transparent;
        border: 0 none;
        outline: 0 none;
        font-size: 1rem;
    }

    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.p-invalid .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }

    .p-select.p-disabled .p-select-label {
        color: dt('select.disabled.color');
    }

    .p-select-label-empty {
        overflow: hidden;
        opacity: 0;
    }

    input.p-select-label {
        cursor: default;
    }

    .p-select-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('select.overlay.background');
        color: dt('select.overlay.color');
        border: 1px solid dt('select.overlay.border.color');
        border-radius: dt('select.overlay.border.radius');
        box-shadow: dt('select.overlay.shadow');
        min-width: 100%;
        transform-origin: inherit;
        will-change: transform;
    }

    .p-select-header {
        padding: dt('select.list.header.padding');
    }

    .p-select-filter {
        width: 100%;
    }

    .p-select-list-container {
        overflow: auto;
    }

    .p-select-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('select.option.group.padding');
        background: dt('select.option.group.background');
        color: dt('select.option.group.color');
        font-weight: dt('select.option.group.font.weight');
    }

    .p-select-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('select.list.padding');
        gap: dt('select.list.gap');
        display: flex;
        flex-direction: column;
    }

    .p-select-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('select.option.padding');
        border: 0 none;
        color: dt('select.option.color');
        background: transparent;
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration'),
            outline-color dt('select.transition.duration');
        border-radius: dt('select.option.border.radius');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled):hover {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option.p-select-option-selected {
        background: dt('select.option.selected.background');
        color: dt('select.option.selected.color');
    }

    .p-select-option.p-select-option-selected.p-focus {
        background: dt('select.option.selected.focus.background');
        color: dt('select.option.selected.focus.color');
    }
   
    .p-select-option-blank-icon {
        flex-shrink: 0;
    }

    .p-select-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('select.checkmark.gutter.start');
        margin-inline-end: dt('select.checkmark.gutter.end');
        color: dt('select.checkmark.color');
    }

    .p-select-empty-message {
        padding: dt('select.empty.message.padding');
    }

    .p-select-fluid {
        display: flex;
        width: 100%;
    }

    .p-select-sm .p-select-label {
        font-size: dt('select.sm.font.size');
        padding-block: dt('select.sm.padding.y');
        padding-inline: dt('select.sm.padding.x');
    }

    .p-select-sm .p-select-dropdown .p-icon {
        font-size: dt('select.sm.font.size');
        width: dt('select.sm.font.size');
        height: dt('select.sm.font.size');
    }

    .p-select-lg .p-select-label {
        font-size: dt('select.lg.font.size');
        padding-block: dt('select.lg.padding.y');
        padding-inline: dt('select.lg.padding.x');
    }

    .p-select-lg .p-select-dropdown .p-icon {
        font-size: dt('select.lg.font.size');
        width: dt('select.lg.font.size');
        height: dt('select.lg.font.size');
    }

    .p-floatlabel-in .p-select-filter {
        padding-block-start: dt('select.padding.y');
        padding-block-end: dt('select.padding.y');
    }
`, qa = {
  root: function(t) {
    var n = t.instance, s = t.props, i = t.state;
    return ["p-select p-component p-inputwrapper", {
      "p-disabled": s.disabled,
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-focus": i.focused,
      "p-inputwrapper-filled": n.$filled,
      "p-inputwrapper-focus": i.focused || i.overlayVisible,
      "p-select-open": i.overlayVisible,
      "p-select-fluid": n.$fluid,
      "p-select-sm p-inputfield-sm": s.size === "small",
      "p-select-lg p-inputfield-lg": s.size === "large"
    }];
  },
  label: function(t) {
    var n, s = t.instance, i = t.props;
    return ["p-select-label", {
      "p-placeholder": !i.editable && s.label === i.placeholder,
      "p-select-label-empty": !i.editable && !s.$slots.value && (s.label === "p-emptylabel" || ((n = s.label) === null || n === void 0 ? void 0 : n.length) === 0)
    }];
  },
  clearIcon: "p-select-clear-icon",
  dropdown: "p-select-dropdown",
  loadingicon: "p-select-loading-icon",
  dropdownIcon: "p-select-dropdown-icon",
  overlay: "p-select-overlay p-component",
  header: "p-select-header",
  pcFilter: "p-select-filter",
  listContainer: "p-select-list-container",
  list: "p-select-list",
  optionGroup: "p-select-option-group",
  optionGroupLabel: "p-select-option-group-label",
  option: function(t) {
    var n = t.instance, s = t.props, i = t.state, r = t.option, f = t.focusedOption;
    return ["p-select-option", {
      "p-select-option-selected": n.isSelected(r) && s.highlightOnSelect,
      "p-focus": i.focusedOptionIndex === f,
      "p-disabled": n.isOptionDisabled(r)
    }];
  },
  optionLabel: "p-select-option-label",
  optionCheckIcon: "p-select-option-check-icon",
  optionBlankIcon: "p-select-option-blank-icon",
  emptyMessage: "p-select-empty-message"
}, Ga = $t.extend({
  name: "select",
  style: Ka,
  classes: qa
}), Wa = {
  name: "BaseSelect",
  extends: Jo,
  props: {
    options: Array,
    optionLabel: [String, Function],
    optionValue: [String, Function],
    optionDisabled: [String, Function],
    optionGroupLabel: [String, Function],
    optionGroupChildren: [String, Function],
    scrollHeight: {
      type: String,
      default: "14rem"
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: "contains"
    },
    filterFields: {
      type: Array,
      default: null
    },
    editable: Boolean,
    placeholder: {
      type: String,
      default: null
    },
    dataKey: null,
    showClear: {
      type: Boolean,
      default: !1
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    labelId: {
      type: String,
      default: null
    },
    labelClass: {
      type: [String, Object],
      default: null
    },
    labelStyle: {
      type: Object,
      default: null
    },
    panelClass: {
      type: [String, Object],
      default: null
    },
    overlayStyle: {
      type: Object,
      default: null
    },
    overlayClass: {
      type: [String, Object],
      default: null
    },
    panelStyle: {
      type: Object,
      default: null
    },
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    clearIcon: {
      type: String,
      default: void 0
    },
    dropdownIcon: {
      type: String,
      default: void 0
    },
    filterIcon: {
      type: String,
      default: void 0
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    resetFilterOnHide: {
      type: Boolean,
      default: !1
    },
    resetFilterOnClear: {
      type: Boolean,
      default: !1
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: !1
    },
    autoFilterFocus: {
      type: Boolean,
      default: !1
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    },
    focusOnHover: {
      type: Boolean,
      default: !0
    },
    highlightOnSelect: {
      type: Boolean,
      default: !0
    },
    checkmark: {
      type: Boolean,
      default: !1
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
    },
    tabindex: {
      type: Number,
      default: 0
    },
    ariaLabel: {
      type: String,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    }
  },
  style: Ga,
  provide: function() {
    return {
      $pcSelect: this,
      $parentInstance: this
    };
  }
};
function Cn(e) {
  "@babel/helpers - typeof";
  return Cn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Cn(e);
}
function Za(e) {
  return Qa(e) || Ja(e) || Xa(e) || Ya();
}
function Ya() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xa(e, t) {
  if (e) {
    if (typeof e == "string") return Yn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Yn(e, t) : void 0;
  }
}
function Ja(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Qa(e) {
  if (Array.isArray(e)) return Yn(e);
}
function Yn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, s = Array(t); n < t; n++) s[n] = e[n];
  return s;
}
function wo(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    t && (s = s.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, s);
  }
  return n;
}
function So(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? wo(Object(n), !0).forEach(function(s) {
      Ut(e, s, n[s]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wo(Object(n)).forEach(function(s) {
      Object.defineProperty(e, s, Object.getOwnPropertyDescriptor(n, s));
    });
  }
  return e;
}
function Ut(e, t, n) {
  return (t = el(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function el(e) {
  var t = tl(e, "string");
  return Cn(t) == "symbol" ? t : t + "";
}
function tl(e, t) {
  if (Cn(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var s = n.call(e, t);
    if (Cn(s) != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ln = {
  name: "Select",
  extends: Wa,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur", "before-show", "before-hide", "show", "hide", "filter"],
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  labelClickListener: null,
  matchMediaOrientationListener: null,
  overlay: null,
  list: null,
  virtualScroller: null,
  searchTimeout: null,
  searchValue: null,
  isModelValueChanged: !1,
  data: function() {
    return {
      clicked: !1,
      focused: !1,
      focusedOptionIndex: -1,
      filterValue: null,
      overlayVisible: !1,
      queryOrientation: null
    };
  },
  watch: {
    modelValue: function() {
      this.isModelValueChanged = !0;
    },
    options: function() {
      this.autoUpdateModel();
    }
  },
  mounted: function() {
    this.autoUpdateModel(), this.bindLabelClickListener(), this.bindMatchMediaOrientationListener();
  },
  updated: function() {
    this.overlayVisible && this.isModelValueChanged && this.scrollInView(this.findSelectedOptionIndex()), this.isModelValueChanged = !1;
  },
  beforeUnmount: function() {
    this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindLabelClickListener(), this.unbindMatchMediaOrientationListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.overlay && (Qt.clear(this.overlay), this.overlay = null);
  },
  methods: {
    getOptionIndex: function(t, n) {
      return this.virtualScrollerDisabled ? t : n && n(t).index;
    },
    getOptionLabel: function(t) {
      return this.optionLabel ? Xt(t, this.optionLabel) : t;
    },
    getOptionValue: function(t) {
      return this.optionValue ? Xt(t, this.optionValue) : t;
    },
    getOptionRenderKey: function(t, n) {
      return (this.dataKey ? Xt(t, this.dataKey) : this.getOptionLabel(t)) + "_" + n;
    },
    getPTItemOptions: function(t, n, s, i) {
      return this.ptm(i, {
        context: {
          option: t,
          index: s,
          selected: this.isSelected(t),
          focused: this.focusedOptionIndex === this.getOptionIndex(s, n),
          disabled: this.isOptionDisabled(t)
        }
      });
    },
    isOptionDisabled: function(t) {
      return this.optionDisabled ? Xt(t, this.optionDisabled) : !1;
    },
    isOptionGroup: function(t) {
      return this.optionGroupLabel && t.optionGroup && t.group;
    },
    getOptionGroupLabel: function(t) {
      return Xt(t, this.optionGroupLabel);
    },
    getOptionGroupChildren: function(t) {
      return Xt(t, this.optionGroupChildren);
    },
    getAriaPosInset: function(t) {
      var n = this;
      return (this.optionGroupLabel ? t - this.visibleOptions.slice(0, t).filter(function(s) {
        return n.isOptionGroup(s);
      }).length : t) + 1;
    },
    show: function(t) {
      this.$emit("before-show"), this.overlayVisible = !0, this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), t && Le(this.$refs.focusInput);
    },
    hide: function(t) {
      var n = this, s = function() {
        n.$emit("before-hide"), n.overlayVisible = !1, n.clicked = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.resetFilterOnHide && (n.filterValue = null), t && Le(n.$refs.focusInput);
      };
      setTimeout(function() {
        s();
      }, 0);
    },
    onFocus: function(t) {
      this.disabled || (this.focused = !0, this.overlayVisible && (this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), this.scrollInView(this.focusedOptionIndex)), this.$emit("focus", t));
    },
    onBlur: function(t) {
      var n = this;
      setTimeout(function() {
        var s, i;
        n.focused = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.$emit("blur", t), (s = (i = n.formField).onBlur) === null || s === void 0 || s.call(i, t);
      }, 100);
    },
    onKeyDown: function(t) {
      var n = this;
      if (this.disabled) {
        t.preventDefault();
        return;
      }
      if (yi())
        switch (t.code) {
          case "Backspace":
            this.onBackspaceKey(t, this.editable);
            break;
          case "Enter":
          case "NumpadDecimal":
            this.onEnterKey(t);
            break;
          default:
            t.preventDefault();
            return;
        }
      var s = t.metaKey || t.ctrlKey;
      switch (t.code) {
        case "ArrowDown":
          this.onArrowDownKey(t);
          break;
        case "ArrowUp":
          this.onArrowUpKey(t, this.editable);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(t, this.editable);
          break;
        case "Home":
          this.onHomeKey(t, this.editable);
          break;
        case "End":
          this.onEndKey(t, this.editable);
          break;
        case "PageDown":
          this.onPageDownKey(t);
          break;
        case "PageUp":
          this.onPageUpKey(t);
          break;
        case "Space":
          this.onSpaceKey(t, this.editable);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(t);
          break;
        case "Escape":
          this.onEscapeKey(t);
          break;
        case "Tab":
          this.onTabKey(t);
          break;
        case "Backspace":
          this.onBackspaceKey(t, this.editable);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          !s && ki(t.key) && (!this.overlayVisible && this.show(), !this.editable && this.searchOptions(t, t.key), this.filter && this.$nextTick(function() {
            n.$refs.filterInput && Le(n.$refs.filterInput.$el);
          }));
          break;
      }
      this.clicked = !1;
    },
    onEditableInput: function(t) {
      var n = t.target.value;
      this.searchValue = "";
      var s = this.searchOptions(t, n);
      !s && (this.focusedOptionIndex = -1), this.updateModel(t, n), !this.overlayVisible && zt(n) && this.show();
    },
    onContainerClick: function(t) {
      this.disabled || this.loading || t.target.tagName === "INPUT" || t.target.getAttribute("data-pc-section") === "clearicon" || t.target.closest('[data-pc-section="clearicon"]') || ((!this.overlay || !this.overlay.contains(t.target)) && (this.overlayVisible ? this.hide(!0) : this.show(!0)), this.clicked = !0);
    },
    onClearClick: function(t) {
      this.updateModel(t, null), this.resetFilterOnClear && (this.filterValue = null);
    },
    onFirstHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? Jt(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      Le(n);
    },
    onLastHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? zo(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      Le(n);
    },
    onOptionSelect: function(t, n) {
      var s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
      if (this.overlayVisible) {
        var i = this.getOptionValue(n);
        this.updateModel(t, i), s && this.hide(!0);
      }
    },
    onOptionMouseMove: function(t, n) {
      this.focusOnHover && this.changeFocusedOptionIndex(t, n);
    },
    onFilterChange: function(t) {
      var n = t.target.value;
      this.filterValue = n, this.focusedOptionIndex = -1, this.$emit("filter", {
        originalEvent: t,
        value: n
      }), !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
    },
    onFilterKeyDown: function(t) {
      if (!t.isComposing)
        switch (t.code) {
          case "ArrowDown":
            this.onArrowDownKey(t);
            break;
          case "ArrowUp":
            this.onArrowUpKey(t, !0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
            this.onArrowLeftKey(t, !0);
            break;
          case "Home":
            this.onHomeKey(t, !0);
            break;
          case "End":
            this.onEndKey(t, !0);
            break;
          case "Enter":
          case "NumpadEnter":
            this.onEnterKey(t);
            break;
          case "Escape":
            this.onEscapeKey(t);
            break;
          case "Tab":
            this.onTabKey(t);
            break;
        }
    },
    onFilterBlur: function() {
      this.focusedOptionIndex = -1;
    },
    onFilterUpdated: function() {
      this.overlayVisible && this.alignOverlay();
    },
    onOverlayClick: function(t) {
      gi.emit("overlay-click", {
        originalEvent: t,
        target: this.$el
      });
    },
    onOverlayKeyDown: function(t) {
      switch (t.code) {
        case "Escape":
          this.onEscapeKey(t);
          break;
      }
    },
    onArrowDownKey: function(t) {
      if (!this.overlayVisible)
        this.show(), this.editable && this.changeFocusedOptionIndex(t, this.findSelectedOptionIndex());
      else {
        var n = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();
        this.changeFocusedOptionIndex(t, n);
      }
      t.preventDefault();
    },
    onArrowUpKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (t.altKey && !n)
        this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(), t.preventDefault();
      else {
        var s = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(t, s), !this.overlayVisible && this.show(), t.preventDefault();
      }
    },
    onArrowLeftKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var s = t.currentTarget;
        t.shiftKey ? s.setSelectionRange(0, t.target.selectionStart) : (s.setSelectionRange(0, 0), this.focusedOptionIndex = -1);
      } else
        this.changeFocusedOptionIndex(t, this.findFirstOptionIndex()), !this.overlayVisible && this.show();
      t.preventDefault();
    },
    onEndKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var s = t.currentTarget;
        if (t.shiftKey)
          s.setSelectionRange(t.target.selectionStart, s.value.length);
        else {
          var i = s.value.length;
          s.setSelectionRange(i, i), this.focusedOptionIndex = -1;
        }
      } else
        this.changeFocusedOptionIndex(t, this.findLastOptionIndex()), !this.overlayVisible && this.show();
      t.preventDefault();
    },
    onPageUpKey: function(t) {
      this.scrollInView(0), t.preventDefault();
    },
    onPageDownKey: function(t) {
      this.scrollInView(this.visibleOptions.length - 1), t.preventDefault();
    },
    onEnterKey: function(t) {
      this.overlayVisible ? (this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.hide(!0)) : (this.focusedOptionIndex = -1, this.onArrowDownKey(t)), t.preventDefault();
    },
    onSpaceKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      !n && this.onEnterKey(t);
    },
    onEscapeKey: function(t) {
      this.overlayVisible && this.hide(!0), t.preventDefault(), t.stopPropagation();
    },
    onTabKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n || (this.overlayVisible && this.hasFocusableElements() ? (Le(this.$refs.firstHiddenFocusableElementOnOverlay), t.preventDefault()) : (this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(this.filter)));
    },
    onBackspaceKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && !this.overlayVisible && this.show();
    },
    onOverlayEnter: function(t) {
      var n = this;
      Qt.set("overlay", t, this.$primevue.config.zIndex.overlay), Fo(t, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.scrollInView(), this.$attrSelector && t.setAttribute(this.$attrSelector, ""), setTimeout(function() {
        n.autoFilterFocus && n.filter && Le(n.$refs.filterInput.$el), n.autoUpdateModel();
      }, 1);
    },
    onOverlayAfterEnter: function() {
      this.bindOutsideClickListener(), this.bindScrollListener(), this.bindResizeListener(), this.$emit("show");
    },
    onOverlayLeave: function(t) {
      var n = this;
      t.style.pointerEvents = "none", this.unbindOutsideClickListener(), this.unbindScrollListener(), this.unbindResizeListener(), this.autoFilterFocus && this.filter && !this.editable && this.$nextTick(function() {
        n.$refs.filterInput && Le(n.$refs.filterInput.$el);
      }), this.$emit("hide"), this.overlay = null;
    },
    onOverlayAfterLeave: function(t) {
      Qt.clear(t);
    },
    alignOverlay: function() {
      this.appendTo === "self" ? bi(this.overlay, this.$el) : this.overlay && (this.overlay.style.minWidth = Po(this.$el) + "px", vi(this.overlay, this.$el));
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var s = n.composedPath();
        t.overlayVisible && t.overlay && !s.includes(t.$el) && !s.includes(t.overlay) && t.hide();
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var t = this;
      this.scrollHandler || (this.scrollHandler = new hi(this.$refs.container, function() {
        t.overlayVisible && t.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = function() {
        t.overlayVisible && !mi() && t.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    bindLabelClickListener: function() {
      var t = this;
      if (!this.editable && !this.labelClickListener) {
        var n = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        n && zn(n) && (this.labelClickListener = function() {
          Le(t.$refs.focusInput);
        }, n.addEventListener("click", this.labelClickListener));
      }
    },
    unbindLabelClickListener: function() {
      if (this.labelClickListener) {
        var t = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        t && zn(t) && t.removeEventListener("click", this.labelClickListener);
      }
    },
    bindMatchMediaOrientationListener: function() {
      var t = this;
      if (!this.matchMediaOrientationListener) {
        var n = matchMedia("(orientation: portrait)");
        this.queryOrientation = n, this.matchMediaOrientationListener = function() {
          t.alignOverlay();
        }, this.queryOrientation.addEventListener("change", this.matchMediaOrientationListener);
      }
    },
    unbindMatchMediaOrientationListener: function() {
      this.matchMediaOrientationListener && (this.queryOrientation.removeEventListener("change", this.matchMediaOrientationListener), this.queryOrientation = null, this.matchMediaOrientationListener = null);
    },
    hasFocusableElements: function() {
      return fi(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
    },
    isOptionExactMatched: function(t) {
      var n;
      return this.isValidOption(t) && typeof this.getOptionLabel(t) == "string" && ((n = this.getOptionLabel(t)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale)) == this.searchValue.toLocaleLowerCase(this.filterLocale);
    },
    isOptionStartsWith: function(t) {
      var n;
      return this.isValidOption(t) && typeof this.getOptionLabel(t) == "string" && ((n = this.getOptionLabel(t)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)));
    },
    isValidOption: function(t) {
      return zt(t) && !(this.isOptionDisabled(t) || this.isOptionGroup(t));
    },
    isValidSelectedOption: function(t) {
      return this.isValidOption(t) && this.isSelected(t);
    },
    isSelected: function(t) {
      return pi(this.d_value, this.getOptionValue(t), this.equalityKey);
    },
    findFirstOptionIndex: function() {
      var t = this;
      return this.visibleOptions.findIndex(function(n) {
        return t.isValidOption(n);
      });
    },
    findLastOptionIndex: function() {
      var t = this;
      return lo(this.visibleOptions, function(n) {
        return t.isValidOption(n);
      });
    },
    findNextOptionIndex: function(t) {
      var n = this, s = t < this.visibleOptions.length - 1 ? this.visibleOptions.slice(t + 1).findIndex(function(i) {
        return n.isValidOption(i);
      }) : -1;
      return s > -1 ? s + t + 1 : t;
    },
    findPrevOptionIndex: function(t) {
      var n = this, s = t > 0 ? lo(this.visibleOptions.slice(0, t), function(i) {
        return n.isValidOption(i);
      }) : -1;
      return s > -1 ? s : t;
    },
    findSelectedOptionIndex: function() {
      var t = this;
      return this.visibleOptions.findIndex(function(n) {
        return t.isValidSelectedOption(n);
      });
    },
    findFirstFocusedOptionIndex: function() {
      var t = this.findSelectedOptionIndex();
      return t < 0 ? this.findFirstOptionIndex() : t;
    },
    findLastFocusedOptionIndex: function() {
      var t = this.findSelectedOptionIndex();
      return t < 0 ? this.findLastOptionIndex() : t;
    },
    searchOptions: function(t, n) {
      var s = this;
      this.searchValue = (this.searchValue || "") + n;
      var i = -1, r = !1;
      return zt(this.searchValue) && (i = this.visibleOptions.findIndex(function(f) {
        return s.isOptionExactMatched(f);
      }), i === -1 && (i = this.visibleOptions.findIndex(function(f) {
        return s.isOptionStartsWith(f);
      })), i !== -1 && (r = !0), i === -1 && this.focusedOptionIndex === -1 && (i = this.findFirstFocusedOptionIndex()), i !== -1 && this.changeFocusedOptionIndex(t, i)), this.searchTimeout && clearTimeout(this.searchTimeout), this.searchTimeout = setTimeout(function() {
        s.searchValue = "", s.searchTimeout = null;
      }, 500), r;
    },
    changeFocusedOptionIndex: function(t, n) {
      this.focusedOptionIndex !== n && (this.focusedOptionIndex = n, this.scrollInView(), this.selectOnFocus && this.onOptionSelect(t, this.visibleOptions[n], !1));
    },
    scrollInView: function() {
      var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var s = n !== -1 ? "".concat(t.$id, "_").concat(n) : t.focusedOptionId, i = To(t.list, 'li[id="'.concat(s, '"]'));
        i ? i.scrollIntoView && i.scrollIntoView({
          block: "nearest",
          inline: "nearest"
        }) : t.virtualScrollerDisabled || t.virtualScroller && t.virtualScroller.scrollToIndex(n !== -1 ? n : t.focusedOptionIndex);
      });
    },
    autoUpdateModel: function() {
      this.autoOptionFocus && (this.focusedOptionIndex = this.findFirstFocusedOptionIndex()), this.selectOnFocus && this.autoOptionFocus && !this.$filled && this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], !1);
    },
    updateModel: function(t, n) {
      this.writeValue(n, t), this.$emit("change", {
        originalEvent: t,
        value: n
      });
    },
    flatOptions: function(t) {
      var n = this;
      return (t || []).reduce(function(s, i, r) {
        s.push({
          optionGroup: i,
          group: !0,
          index: r
        });
        var f = n.getOptionGroupChildren(i);
        return f && f.forEach(function(g) {
          return s.push(g);
        }), s;
      }, []);
    },
    overlayRef: function(t) {
      this.overlay = t;
    },
    listRef: function(t, n) {
      this.list = t, n && n(t);
    },
    virtualScrollerRef: function(t) {
      this.virtualScroller = t;
    }
  },
  computed: {
    visibleOptions: function() {
      var t = this, n = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
      if (this.filterValue) {
        var s = ci.filter(n, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          var i = this.options || [], r = [];
          return i.forEach(function(f) {
            var g = t.getOptionGroupChildren(f), v = g.filter(function(w) {
              return s.includes(w);
            });
            v.length > 0 && r.push(So(So({}, f), {}, Ut({}, typeof t.optionGroupChildren == "string" ? t.optionGroupChildren : "items", Za(v))));
          }), this.flatOptions(r);
        }
        return s;
      }
      return n;
    },
    // @deprecated use $filled instead
    hasSelectedOption: function() {
      return this.$filled;
    },
    label: function() {
      var t = this.findSelectedOptionIndex();
      return t !== -1 ? this.getOptionLabel(this.visibleOptions[t]) : this.placeholder || "p-emptylabel";
    },
    editableInputValue: function() {
      var t = this.findSelectedOptionIndex();
      return t !== -1 ? this.getOptionLabel(this.visibleOptions[t]) : this.d_value || "";
    },
    equalityKey: function() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields: function() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText: function() {
      return zt(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText: function() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText: function() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText: function() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText: function() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText: function() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText: function() {
      return this.$filled ? this.selectionMessageText.replaceAll("{0}", "1") : this.emptySelectionMessageText;
    },
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? "".concat(this.$id, "_").concat(this.focusedOptionIndex) : null;
    },
    ariaSetSize: function() {
      var t = this;
      return this.visibleOptions.filter(function(n) {
        return !t.isOptionGroup(n);
      }).length;
    },
    isClearIconVisible: function() {
      return this.showClear && this.d_value != null && !this.disabled && !this.loading;
    },
    virtualScrollerDisabled: function() {
      return !this.virtualScrollerOptions;
    },
    containerDataP: function() {
      return pt(Ut({
        invalid: this.$invalid,
        disabled: this.disabled,
        focus: this.focused,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    },
    labelDataP: function() {
      return pt(Ut(Ut({
        placeholder: !this.editable && this.label === this.placeholder,
        clearable: this.showClear,
        disabled: this.disabled,
        editable: this.editable
      }, this.size, this.size), "empty", !this.editable && !this.$slots.value && (this.label === "p-emptylabel" || this.label.length === 0)));
    },
    dropdownIconDataP: function() {
      return pt(Ut({}, this.size, this.size));
    },
    overlayDataP: function() {
      return pt(Ut({}, "portal-" + this.appendTo, "portal-" + this.appendTo));
    }
  },
  directives: {
    ripple: eo
  },
  components: {
    InputText: Qo,
    VirtualScroller: ti,
    Portal: Mo,
    InputIcon: Xo,
    IconField: Yo,
    TimesIcon: so,
    ChevronDownIcon: Wo,
    SpinnerIcon: En,
    SearchIcon: Zo,
    CheckIcon: Go,
    BlankIcon: qo
  }
}, nl = ["id", "data-p"], ol = ["name", "id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "data-p"], il = ["name", "id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "aria-disabled", "data-p"], sl = ["data-p"], al = ["id"], ll = ["id"], rl = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onMousedown", "onMousemove", "data-p-selected", "data-p-focused", "data-p-disabled"];
function ul(e, t, n, s, i, r) {
  var f = Oe("SpinnerIcon"), g = Oe("InputText"), v = Oe("SearchIcon"), w = Oe("InputIcon"), S = Oe("IconField"), _ = Oe("CheckIcon"), F = Oe("BlankIcon"), B = Oe("VirtualScroller"), T = Oe("Portal"), N = to("ripple");
  return a(), u("div", W({
    ref: "container",
    id: e.$id,
    class: e.cx("root"),
    onClick: t[12] || (t[12] = function() {
      return r.onContainerClick && r.onContainerClick.apply(r, arguments);
    }),
    "data-p": r.containerDataP
  }, e.ptmi("root")), [e.editable ? (a(), u("input", W({
    key: 0,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    type: "text",
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    value: r.editableInputValue,
    placeholder: e.placeholder,
    tabindex: e.disabled ? -1 : e.tabindex,
    disabled: e.disabled,
    autocomplete: "off",
    role: "combobox",
    "aria-label": e.ariaLabel,
    "aria-labelledby": e.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": i.overlayVisible,
    "aria-controls": i.overlayVisible ? e.$id + "_list" : void 0,
    "aria-activedescendant": i.focused ? r.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    onFocus: t[0] || (t[0] = function() {
      return r.onFocus && r.onFocus.apply(r, arguments);
    }),
    onBlur: t[1] || (t[1] = function() {
      return r.onBlur && r.onBlur.apply(r, arguments);
    }),
    onKeydown: t[2] || (t[2] = function() {
      return r.onKeyDown && r.onKeyDown.apply(r, arguments);
    }),
    onInput: t[3] || (t[3] = function() {
      return r.onEditableInput && r.onEditableInput.apply(r, arguments);
    }),
    "data-p": r.labelDataP
  }, e.ptm("label")), null, 16, ol)) : (a(), u("span", W({
    key: 1,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    tabindex: e.disabled ? -1 : e.tabindex,
    role: "combobox",
    "aria-label": e.ariaLabel || (r.label === "p-emptylabel" ? void 0 : r.label),
    "aria-labelledby": e.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": i.overlayVisible,
    "aria-controls": e.$id + "_list",
    "aria-activedescendant": i.focused ? r.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    "aria-disabled": e.disabled,
    onFocus: t[4] || (t[4] = function() {
      return r.onFocus && r.onFocus.apply(r, arguments);
    }),
    onBlur: t[5] || (t[5] = function() {
      return r.onBlur && r.onBlur.apply(r, arguments);
    }),
    onKeydown: t[6] || (t[6] = function() {
      return r.onKeyDown && r.onKeyDown.apply(r, arguments);
    }),
    "data-p": r.labelDataP
  }, e.ptm("label")), [ie(e.$slots, "value", {
    value: e.d_value,
    placeholder: e.placeholder
  }, function() {
    var z;
    return [P(c(r.label === "p-emptylabel" ? " " : (z = r.label) !== null && z !== void 0 ? z : "empty"), 1)];
  })], 16, il)), r.isClearIconVisible ? ie(e.$slots, "clearicon", {
    key: 2,
    class: ne(e.cx("clearIcon")),
    clearCallback: r.onClearClick
  }, function() {
    return [(a(), ce(pn(e.clearIcon ? "i" : "TimesIcon"), W({
      ref: "clearIcon",
      class: [e.cx("clearIcon"), e.clearIcon],
      onClick: r.onClearClick
    }, e.ptm("clearIcon"), {
      "data-pc-section": "clearicon"
    }), null, 16, ["class", "onClick"]))];
  }) : h("", !0), l("div", W({
    class: e.cx("dropdown")
  }, e.ptm("dropdown")), [e.loading ? ie(e.$slots, "loadingicon", {
    key: 0,
    class: ne(e.cx("loadingIcon"))
  }, function() {
    return [e.loadingIcon ? (a(), u("span", W({
      key: 0,
      class: [e.cx("loadingIcon"), "pi-spin", e.loadingIcon],
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16)) : (a(), ce(f, W({
      key: 1,
      class: e.cx("loadingIcon"),
      spin: "",
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16, ["class"]))];
  }) : ie(e.$slots, "dropdownicon", {
    key: 1,
    class: ne(e.cx("dropdownIcon"))
  }, function() {
    return [(a(), ce(pn(e.dropdownIcon ? "span" : "ChevronDownIcon"), W({
      class: [e.cx("dropdownIcon"), e.dropdownIcon],
      "aria-hidden": "true",
      "data-p": r.dropdownIconDataP
    }, e.ptm("dropdownIcon")), null, 16, ["class", "data-p"]))];
  })], 16), m(T, {
    appendTo: e.appendTo
  }, {
    default: ee(function() {
      return [m(Eo, W({
        name: "p-anchored-overlay",
        onEnter: r.onOverlayEnter,
        onAfterEnter: r.onOverlayAfterEnter,
        onLeave: r.onOverlayLeave,
        onAfterLeave: r.onOverlayAfterLeave
      }, e.ptm("transition")), {
        default: ee(function() {
          return [i.overlayVisible ? (a(), u("div", W({
            key: 0,
            ref: r.overlayRef,
            class: [e.cx("overlay"), e.panelClass, e.overlayClass],
            style: [e.panelStyle, e.overlayStyle],
            onClick: t[10] || (t[10] = function() {
              return r.onOverlayClick && r.onOverlayClick.apply(r, arguments);
            }),
            onKeydown: t[11] || (t[11] = function() {
              return r.onOverlayKeyDown && r.onOverlayKeyDown.apply(r, arguments);
            }),
            "data-p": r.overlayDataP
          }, e.ptm("overlay")), [l("span", W({
            ref: "firstHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[7] || (t[7] = function() {
              return r.onFirstHiddenFocus && r.onFirstHiddenFocus.apply(r, arguments);
            })
          }, e.ptm("hiddenFirstFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16), ie(e.$slots, "header", {
            value: e.d_value,
            options: r.visibleOptions
          }), e.filter ? (a(), u("div", W({
            key: 0,
            class: e.cx("header")
          }, e.ptm("header")), [m(S, {
            unstyled: e.unstyled,
            pt: e.ptm("pcFilterContainer")
          }, {
            default: ee(function() {
              return [m(g, {
                ref: "filterInput",
                type: "text",
                value: i.filterValue,
                onVnodeMounted: r.onFilterUpdated,
                onVnodeUpdated: r.onFilterUpdated,
                class: ne(e.cx("pcFilter")),
                placeholder: e.filterPlaceholder,
                variant: e.variant,
                unstyled: e.unstyled,
                role: "searchbox",
                autocomplete: "off",
                "aria-owns": e.$id + "_list",
                "aria-activedescendant": r.focusedOptionId,
                onKeydown: r.onFilterKeyDown,
                onBlur: r.onFilterBlur,
                onInput: r.onFilterChange,
                pt: e.ptm("pcFilter"),
                formControl: {
                  novalidate: !0
                }
              }, null, 8, ["value", "onVnodeMounted", "onVnodeUpdated", "class", "placeholder", "variant", "unstyled", "aria-owns", "aria-activedescendant", "onKeydown", "onBlur", "onInput", "pt"]), m(w, {
                unstyled: e.unstyled,
                pt: e.ptm("pcFilterIconContainer")
              }, {
                default: ee(function() {
                  return [ie(e.$slots, "filtericon", {}, function() {
                    return [e.filterIcon ? (a(), u("span", W({
                      key: 0,
                      class: e.filterIcon
                    }, e.ptm("filterIcon")), null, 16)) : (a(), ce(v, $i(W({
                      key: 1
                    }, e.ptm("filterIcon"))), null, 16))];
                  })];
                }),
                _: 3
              }, 8, ["unstyled", "pt"])];
            }),
            _: 3
          }, 8, ["unstyled", "pt"]), l("span", W({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenFilterResult"), {
            "data-p-hidden-accessible": !0
          }), c(r.filterResultMessageText), 17)], 16)) : h("", !0), l("div", W({
            class: e.cx("listContainer"),
            style: {
              "max-height": r.virtualScrollerDisabled ? e.scrollHeight : ""
            }
          }, e.ptm("listContainer")), [m(B, W({
            ref: r.virtualScrollerRef
          }, e.virtualScrollerOptions, {
            items: r.visibleOptions,
            style: {
              height: e.scrollHeight
            },
            tabindex: -1,
            disabled: r.virtualScrollerDisabled,
            pt: e.ptm("virtualScroller")
          }), Ci({
            content: ee(function(z) {
              var K = z.styleClass, j = z.contentRef, M = z.items, R = z.getItemOptions, d = z.contentStyle, Q = z.itemSize;
              return [l("ul", W({
                ref: function(k) {
                  return r.listRef(k, j);
                },
                id: e.$id + "_list",
                class: [e.cx("list"), K],
                style: d,
                role: "listbox"
              }, e.ptm("list")), [(a(!0), u(X, null, se(M, function(p, k) {
                return a(), u(X, {
                  key: r.getOptionRenderKey(p, r.getOptionIndex(k, R))
                }, [r.isOptionGroup(p) ? (a(), u("li", W({
                  key: 0,
                  id: e.$id + "_" + r.getOptionIndex(k, R),
                  style: {
                    height: Q ? Q + "px" : void 0
                  },
                  class: e.cx("optionGroup"),
                  role: "option"
                }, {
                  ref_for: !0
                }, e.ptm("optionGroup")), [ie(e.$slots, "optiongroup", {
                  option: p.optionGroup,
                  index: r.getOptionIndex(k, R)
                }, function() {
                  return [l("span", W({
                    class: e.cx("optionGroupLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionGroupLabel")), c(r.getOptionGroupLabel(p.optionGroup)), 17)];
                })], 16, ll)) : De((a(), u("li", W({
                  key: 1,
                  id: e.$id + "_" + r.getOptionIndex(k, R),
                  class: e.cx("option", {
                    option: p,
                    focusedOption: r.getOptionIndex(k, R)
                  }),
                  style: {
                    height: Q ? Q + "px" : void 0
                  },
                  role: "option",
                  "aria-label": r.getOptionLabel(p),
                  "aria-selected": r.isSelected(p),
                  "aria-disabled": r.isOptionDisabled(p),
                  "aria-setsize": r.ariaSetSize,
                  "aria-posinset": r.getAriaPosInset(r.getOptionIndex(k, R)),
                  onMousedown: function(re) {
                    return r.onOptionSelect(re, p);
                  },
                  onMousemove: function(re) {
                    return r.onOptionMouseMove(re, r.getOptionIndex(k, R));
                  },
                  onClick: t[8] || (t[8] = _n(function() {
                  }, ["stop"])),
                  "data-p-selected": !e.checkmark && r.isSelected(p),
                  "data-p-focused": i.focusedOptionIndex === r.getOptionIndex(k, R),
                  "data-p-disabled": r.isOptionDisabled(p)
                }, {
                  ref_for: !0
                }, r.getPTItemOptions(p, R, k, "option")), [e.checkmark ? (a(), u(X, {
                  key: 0
                }, [r.isSelected(p) ? (a(), ce(_, W({
                  key: 0,
                  class: e.cx("optionCheckIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionCheckIcon")), null, 16, ["class"])) : (a(), ce(F, W({
                  key: 1,
                  class: e.cx("optionBlankIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionBlankIcon")), null, 16, ["class"]))], 64)) : h("", !0), ie(e.$slots, "option", {
                  option: p,
                  selected: r.isSelected(p),
                  index: r.getOptionIndex(k, R)
                }, function() {
                  return [l("span", W({
                    class: e.cx("optionLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionLabel")), c(r.getOptionLabel(p)), 17)];
                })], 16, rl)), [[N]])], 64);
              }), 128)), i.filterValue && (!M || M && M.length === 0) ? (a(), u("li", W({
                key: 0,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [ie(e.$slots, "emptyfilter", {}, function() {
                return [P(c(r.emptyFilterMessageText), 1)];
              })], 16)) : !e.options || e.options && e.options.length === 0 ? (a(), u("li", W({
                key: 1,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [ie(e.$slots, "empty", {}, function() {
                return [P(c(r.emptyMessageText), 1)];
              })], 16)) : h("", !0)], 16, al)];
            }),
            _: 2
          }, [e.$slots.loader ? {
            name: "loader",
            fn: ee(function(z) {
              var K = z.options;
              return [ie(e.$slots, "loader", {
                options: K
              })];
            }),
            key: "0"
          } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), ie(e.$slots, "footer", {
            value: e.d_value,
            options: r.visibleOptions
          }), !e.options || e.options && e.options.length === 0 ? (a(), u("span", W({
            key: 1,
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenEmptyMessage"), {
            "data-p-hidden-accessible": !0
          }), c(r.emptyMessageText), 17)) : h("", !0), l("span", W({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenSelectedMessage"), {
            "data-p-hidden-accessible": !0
          }), c(r.selectedMessageText), 17), l("span", W({
            ref: "lastHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[9] || (t[9] = function() {
              return r.onLastHiddenFocus && r.onLastHiddenFocus.apply(r, arguments);
            })
          }, e.ptm("hiddenLastFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16)], 16, sl)) : h("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo"])], 16, nl);
}
Ln.render = ul;
const dl = 2e3;
function $o(e) {
  const t = e.margin ?? 8, n = e.gap ?? 4, s = Math.max(0, e.viewportWidth), i = Math.max(0, e.viewportHeight), r = Math.max(0, s - t * 2), f = Math.min(Math.max(0, e.requestedWidth), r), g = e.align === "right" ? e.anchor.right - f : e.anchor.left, v = Math.max(t, Math.min(g, s - t - f)), w = Math.max(0, i - e.anchor.bottom - n - t), S = Math.max(0, e.anchor.top - n - t), _ = w < e.requestedMaxHeight && S > w ? "above" : "below", F = _ === "above" ? S : w, B = Math.round(Math.min(Math.max(0, e.requestedMaxHeight), F)), T = Math.min(Math.max(0, e.panelHeight ?? B), B), N = _ === "above" ? e.anchor.top - n - T : e.anchor.bottom + n, z = e.containingBlockOrigin ?? { left: 0, top: 0 };
  return {
    left: Math.round(v - z.left),
    width: Math.round(f),
    maxHeight: B,
    side: _,
    top: Math.round(N - z.top)
  };
}
const ni = /* @__PURE__ */ nn({
  __name: "AnchoredPanel",
  props: {
    open: { type: Boolean },
    anchor: {},
    align: { default: "left" },
    width: { default: "anchor" },
    minWidth: { default: 0 },
    maxHeight: { default: 340 },
    gap: { default: 4 },
    zIndex: { default: dl }
  },
  emits: ["update:open"],
  setup(e, { emit: t }) {
    const n = e, s = t, i = H(null), r = H({ position: "fixed", visibility: "hidden" });
    function f() {
      const N = n.anchor, z = i.value;
      if (!N || !z) return;
      const K = N.getBoundingClientRect(), j = n.width === "anchor" ? Math.max(n.minWidth, K.width) : Math.max(n.minWidth, n.width), M = {
        anchor: K,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        requestedWidth: j,
        requestedMaxHeight: n.maxHeight,
        align: n.align,
        gap: n.gap
      }, R = $o(M);
      Object.assign(z.style, {
        position: "fixed",
        left: "0px",
        top: "0px",
        right: "auto",
        bottom: "auto",
        width: `${R.width}px`,
        maxHeight: `${R.maxHeight}px`,
        visibility: "hidden"
      });
      const d = z.getBoundingClientRect(), Q = $o({
        ...M,
        containingBlockOrigin: { left: d.left, top: d.top },
        panelHeight: d.height
      }), p = {
        position: "fixed",
        left: `${Q.left}px`,
        top: `${Q.top}px`,
        width: `${Q.width}px`,
        maxHeight: `${Q.maxHeight}px`,
        "--anchored-panel-available-height": `${Q.maxHeight}px`,
        margin: "0",
        zIndex: String(n.zIndex),
        visibility: "visible"
      };
      r.value = p;
    }
    let g = null, v = !1;
    function w() {
      v || !n.open || (v = !0, requestAnimationFrame(() => {
        v = !1, n.open && f();
      }));
    }
    function S() {
      typeof ResizeObserver > "u" || (g = new ResizeObserver(w), i.value && g.observe(i.value), n.anchor && g.observe(n.anchor));
    }
    function _() {
      g?.disconnect(), g = null, v = !1;
    }
    Ne(() => n.open, async (N) => {
      _(), N && (r.value = { position: "fixed", visibility: "hidden" }, await fn(), f(), S());
    }, { immediate: !0 });
    function F(N) {
      if (!n.open) return;
      const z = N.composedPath();
      i.value && z.includes(i.value) || n.anchor && z.includes(n.anchor) || s("update:open", !1);
    }
    function B(N) {
      !n.open || N.key !== "Escape" || (N.preventDefault(), N.stopImmediatePropagation(), s("update:open", !1));
    }
    function T() {
      n.open && f();
    }
    return document.addEventListener("click", F), document.addEventListener("keydown", B, !0), window.addEventListener("resize", T), window.addEventListener("scroll", T, !0), Vo(() => {
      _(), document.removeEventListener("click", F), document.removeEventListener("keydown", B, !0), window.removeEventListener("resize", T), window.removeEventListener("scroll", T, !0);
    }), (N, z) => e.open ? (a(), u("div", {
      key: 0,
      ref_key: "panel",
      ref: i,
      class: "anchored-panel",
      style: Nt(r.value)
    }, [
      ie(N.$slots, "default")
    ], 4)) : h("", !0);
  }
});
function cl(e) {
  if (!e) return null;
  let t;
  if (typeof e == "number")
    t = e;
  else {
    const n = e.trim();
    if (/^\d+$/.test(n))
      t = Number(n);
    else {
      const s = Date.parse(n);
      return Number.isNaN(s) ? null : s;
    }
  }
  return Number.isFinite(t) ? t < 1e12 ? t * 1e3 : t : null;
}
function Tn(e, t) {
  const n = cl(e);
  if (n === null) return "";
  const s = t?.now ?? Date.now(), i = t?.suffix ?? !0, r = t?.maxUnit ?? "day", f = t?.future ?? !1, g = 6e4, v = 60 * g, w = 24 * v, S = 30 * w, _ = 365 * w, F = s - n;
  if (f && F < 0) {
    const N = -F;
    return N < g ? "in <1m" : N < v ? `in ${Math.floor(N / g)}m` : N < w ? `in ${Math.floor(N / v)}h` : `in ${Math.floor(N / w)}d`;
  }
  const B = Math.max(0, F);
  if (B < g) return "just now";
  const T = i ? " ago" : "";
  return B < v ? `${Math.floor(B / g)}m${T}` : B < w ? `${Math.floor(B / v)}h${T}` : r === "year" ? B < S ? `${Math.floor(B / w)}d${T}` : B < _ ? `${Math.floor(B / S)}mo${T}` : `${Math.floor(B / _)}y${T}` : `${Math.floor(B / w)}d${T}`;
}
const Xn = {
  tool: { label: "Tools", icon: "tabler:tool" },
  "agent.trait": { label: "Agent capabilities", icon: "tabler:robot" },
  "contract.binding": { label: "Contract bindings", icon: "tabler:plug-connected" },
  "contract.definition": { label: "Contracts", icon: "tabler:file-description" },
  "view.page": { label: "Pages", icon: "tabler:browser" },
  "view.component": { label: "Components", icon: "tabler:components" }
};
function pl(e) {
  const t = e.meta?.type || "";
  return t && Xn[t] ? t : e.kind;
}
function fl(e) {
  return String(e.id).split(":").pop() || e.id;
}
function ml(e) {
  const t = e.meta || {};
  return String(t.comment || t.title || "");
}
function hl(e, t) {
  return String(e.meta?.icon || t);
}
function tt(e, t) {
  const n = t instanceof Error ? t.message : String(t);
  console.error(`[${e}]`, n, t);
}
function Jn() {
  window.dispatchEvent(new CustomEvent("kickside:modules-changed")), window.dispatchEvent(new CustomEvent("kickside:nav-changed"));
}
function bl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.dependencies || []) {
    const s = String(n.component || n.name || n.id || "");
    s && t.set(s, {
      ...n,
      dependencyId: n.id,
      component: s,
      is_root: n.is_root ?? !0,
      used_by: n.used_by || [],
      used_by_count: n.used_by_count || 0,
      source: n.source || "hub"
    });
  }
  for (const n of e.modules || []) {
    const s = String(n.name || "");
    if (!s) continue;
    const i = t.get(s);
    if (i)
      t.set(s, {
        ...i,
        version: i.version || n.version || "",
        is_root: i.is_root ?? n.is_root ?? !n.transitive,
        used_by: i.used_by || n.used_by || [],
        used_by_count: i.used_by_count ?? n.used_by_count ?? 0,
        source: i.source || n.source || "hub"
      });
    else {
      const r = n.used_by || [], f = n.used_by_count || r.length || 0;
      if (n.is_root !== !0 && n.transitive === !0 && f === 0) continue;
      const g = s.split("/");
      t.set(s, {
        id: s,
        namespace: g.length > 1 ? g[0] : "",
        name: g[g.length - 1] || s,
        component: s,
        version: n.version || "",
        is_root: n.is_root ?? !n.transitive,
        used_by: r,
        used_by_count: f,
        source: n.source || "local"
      });
    }
  }
  return Array.from(t.values()).filter((n) => n.installed !== !1);
}
function Co(e) {
  const t = e.migrations || [];
  if (t.length === 0) return "";
  const n = t.filter((r) => r.status === "applied").length, s = t.filter((r) => r.status === "pending").length, i = [];
  return n > 0 && i.push(`${n} applied`), s > 0 && i.push(`${s} pending`), i.join(", ") || `${t.length} migrations`;
}
function vl({ hub: e, installed: t, catalog: n, installedDepFor: s, installedCanUpdate: i, installedUpdateDisabledReason: r, installedCanUninstall: f, installedIsPrivate: g }) {
  const v = H(null), w = H(null), S = H(""), _ = H([]), F = H(!1), B = H("readme"), T = H([]), N = q(() => _.value.filter((L) => L.kind === "env.variable")), z = q(() => _.value.filter((L) => L.kind === "ns.requirement")), K = q(() => {
    const L = {};
    for (const E of _.value) {
      if (E.kind === "env.variable" || E.kind === "ns.requirement") continue;
      const J = pl(E);
      (L[J] ||= []).push(E);
    }
    return Object.entries(L).map(([E, J]) => ({
      key: E,
      label: Xn[E]?.label || E,
      icon: Xn[E]?.icon || "tabler:point",
      items: J
    })).sort((E, J) => J.items.length - E.items.length);
  }), j = q(() => T.value.find((L) => L.version === v.value?.version) || T.value[0]), M = q(() => v.value ? s(v.value.component) : void 0), R = q(() => !!(M.value && i(M.value))), d = q(() => M.value && !i(M.value) ? r(M.value) : ""), Q = q(() => !!(M.value && f(M.value))), p = q(() => mn(w.value) || !!(M.value && g(M.value)));
  async function k(L) {
    try {
      const E = t.value.find((oe) => oe.component === L);
      return E?.entries ? E.entries : ((await e.listDependencies({ component: L, includeMigrations: !1 })).dependencies || []).find((oe) => oe.component === L)?.entries || [];
    } catch (E) {
      return tt("modules:entries", E), [];
    }
  }
  async function A(L, E) {
    if (E && E.full_name) return E;
    const J = n.value.find((te) => Mn(te, L));
    if (J) return J;
    try {
      const te = L.split("/").pop() || L, me = ((await e.browseModules({ query: te, pageSize: 50 })).items || []).find((Ae) => Mn(Ae, L));
      if (me) return me;
    } catch {
    }
    return { full_name: L, component: L, latest_version: "", type: "library" };
  }
  async function re(L) {
    const E = "component" in L && typeof L.component == "string" && !("full_name" in L) ? L.component : An(L), J = s(E), te = "full_name" in L ? L : void 0;
    v.value = {
      component: E,
      label: te ? en(te) : E,
      description: te?.description || "",
      version: J ? ft(J) : String(te?.latest_version || ""),
      installed: !!J,
      installedId: J?.id
    }, w.value = te || null, S.value = "", _.value = [], T.value = [], B.value = "readme", F.value = !0;
    try {
      const [oe, me, Ae, ge] = await Promise.all([
        A(E, te),
        e.getReadme(E).then((Ke) => Ke.content || "").catch(() => ""),
        J ? k(E) : Promise.resolve([]),
        e.listVersions(E).then((Ke) => Ke.items || []).catch(() => [])
      ]);
      w.value = oe, S.value = me, _.value = Ae, T.value = ge, v.value && (v.value = {
        ...v.value,
        label: en(oe),
        description: oe.description || v.value.description,
        version: J ? ft(J) : String(oe.latest_version || v.value.version)
      }), me || (B.value = "overview");
    } finally {
      F.value = !1;
    }
  }
  function b() {
    v.value = null;
  }
  async function I() {
    if (!v.value) return;
    const L = v.value.component, E = s(L);
    v.value = {
      ...v.value,
      installed: !!E,
      installedId: E?.id,
      version: E ? ft(E) : v.value.version
    }, _.value = E ? await k(L) : [];
  }
  return {
    selected: v,
    selectedModule: w,
    detailReadme: S,
    detailEntries: _,
    detailLoading: F,
    detailTab: B,
    detailVersions: T,
    envVars: N,
    requirements: z,
    detailGroups: K,
    versionMeta: j,
    selectedInstalledDep: M,
    selectedCanUpdate: R,
    selectedUpdateDisabledReason: d,
    selectedCanUninstall: Q,
    selectedIsPrivate: p,
    loadEntriesFor: k,
    findModule: A,
    openDetail: re,
    closeDetail: b,
    refreshSelectedDetail: I
  };
}
const gl = [
  { until: 1e3, label: "Planning uninstall" },
  { until: 4e3, label: "Stopping services" },
  { until: 6e3, label: "Removing entries" },
  { until: 8e3, label: "Updating lock" },
  { until: 1 / 0, label: "Finalizing" }
];
function yl(e, t) {
  const n = H(0);
  let s = 0, i = null;
  function r() {
    i && (clearInterval(i), i = null);
  }
  Ne(e, (v) => {
    r(), v ? (s = Date.now(), n.value = 0, i = setInterval(() => {
      n.value = Date.now() - s;
    }, 200)) : n.value = 0;
  }), no(r);
  const f = q(() => t.find((v) => n.value < v.until)?.label || t[t.length - 1].label), g = q(() => Math.floor(n.value / 1e3));
  return { phase: f, elapsedSec: g };
}
function kl({ hub: e, selected: t, selectedInstalledDep: n, installedIsRoot: s, installedUninstallDisabledReason: i, installedCanUninstall: r, refreshAll: f, refreshSelectedDetail: g, showToast: v, notifyModulesChanged: w }) {
  const S = H(!1), _ = H(null), F = H("block"), B = H(!1), T = H(!1), N = H(null), z = H([]), K = H(null), j = H(null), M = H([]), { phase: R, elapsedSec: d } = yl(B, gl), Q = q(() => {
    const I = n.value;
    return !t.value?.installed || !I || s(I) ? "" : i(I);
  }), p = q(() => _.value ? B.value ? "Uninstall is running." : T.value ? "Waiting for uninstall preview to finish." : M.value.length > 0 ? `Still required by: ${M.value.join(", ")}. Uninstall those root modules first.` : K.value === "MIGRATIONS_APPLIED" ? 'Applied migrations exist. Choose "Leave applied migrations" or "Revert (down)", then preview again.' : j.value && !N.value ? j.value : N.value ? "" : "Run Preview first so Keeper can show what will be removed." : ""), k = q(() => _.value ? B.value ? "Uninstall is running." : T.value ? "Waiting for uninstall preview to finish." : M.value.length > 0 ? `Still required by: ${M.value.join(", ")}. Uninstall those root modules first.` : K.value === "MIGRATIONS_APPLIED" ? 'Applied migrations exist. Choose "Leave applied migrations" or "Revert (down)", then preview again.' : "" : "No module selected.");
  async function A(I) {
    r(I) && (_.value = I, F.value = "block", K.value = null, j.value = null, M.value = [], N.value = null, z.value = [], S.value = !0, re());
  }
  async function re() {
    const I = _.value;
    if (I) {
      T.value = !0, K.value = null, j.value = null, M.value = [], N.value = null, z.value = [];
      try {
        const L = await e.uninstall({ id: I.id, component: I.component, dry_run: !0, migration_policy: F.value });
        N.value = L.preview || L.payload?.preview || null, N.value || (j.value = "Uninstall preview returned no preview data.");
      } catch (L) {
        if (tt("modules:uninstall-preview", L), L instanceof Kt && (K.value = L.code, M.value = ro(L.details), L.code === "NOT_FOUND")) {
          S.value = !1, _.value = null, v("ok", "Module already removed; refreshed installed modules"), await f(), await g();
          return;
        }
        j.value = ze(L, "uninstall preview failed");
      } finally {
        T.value = !1;
      }
    }
  }
  async function b() {
    const I = _.value;
    if (!(!I || k.value)) {
      B.value = !0, K.value = null, j.value = null, z.value = [];
      try {
        const L = await e.uninstall({ id: I.id, component: I.component, migration_policy: F.value });
        z.value = Hn(L), v("ok", `Module uninstalled: ${I.id}`), w(), await f(), await g();
      } catch (L) {
        if (tt("modules:uninstall", L), L instanceof Kt && (K.value = L.code, M.value = ro(L.details), z.value = Hn(L.details), L.code === "NOT_FOUND")) {
          S.value = !1, _.value = null, v("ok", "Module already removed; refreshed installed modules"), await f(), await g();
          return;
        }
        j.value = ze(L, "uninstall failed");
      } finally {
        B.value = !1;
      }
    }
  }
  return Ne(F, () => {
    S.value && _.value && !B.value && re();
  }), {
    uninstallDialogOpen: S,
    uninstallDep: _,
    uninstallPolicy: F,
    uninstallRunning: B,
    uninstallPreviewLoading: T,
    uninstallPreview: N,
    uninstallExecution: z,
    uninstallCode: K,
    uninstallError: j,
    uninstallRequiredBy: M,
    uninstallPhase: R,
    uninstallElapsedSec: d,
    selectedUninstallBlockedReason: Q,
    uninstallBlockedReason: p,
    uninstallActionBlockedReason: k,
    openUninstallDialog: A,
    previewUninstall: re,
    runUninstall: b
  };
}
function wl({ hub: e, installed: t, installedError: n, installedCanUpdate: s, installedIsRoot: i, showToast: r, notifyModulesChanged: f, refreshAll: g, refreshSelectedDetail: v }) {
  const w = H({}), S = H(!1), _ = H(!1), F = q(() => t.value.filter((b) => {
    const I = j(b);
    return s(b) && i(b) && I && ["available", "failed", "blocked", "skipped"].includes(I.status) && z(I.latestVersion, ft(b));
  }));
  function B(b) {
    return (String(b || "").trim().replace(/^[^\d]*/, "").match(/\d+(?:\.\d+)*/)?.[0] || "").split(".").filter(Boolean).map(Number);
  }
  function T(b, I) {
    const L = B(b), E = B(I), J = Math.max(L.length, E.length);
    for (let te = 0; te < J; te++) {
      const oe = L[te] || 0, me = E[te] || 0;
      if (oe !== me) return oe > me ? 1 : -1;
    }
    return String(b || "").localeCompare(String(I || ""));
  }
  function N(b = []) {
    const I = b.find((L) => L.is_latest) || b[0];
    return String(I?.version || "");
  }
  function z(b, I) {
    return !!(b && I && b !== I && T(b, I) > 0);
  }
  function K(b) {
    const I = String(b || "").trim().replace(/^[>=<~^]+v?/, "");
    return I ? `>=${I}` : ">=v0.0.0";
  }
  function j(b) {
    return b?.component && w.value[b.component] || null;
  }
  function M(b, I) {
    const L = w.value[b];
    w.value = {
      ...w.value,
      [b]: {
        component: b,
        currentVersion: I.currentVersion ?? L?.currentVersion ?? "",
        latestVersion: I.latestVersion ?? L?.latestVersion ?? "",
        status: I.status ?? L?.status ?? "current",
        message: I.message
      }
    };
  }
  function R(b) {
    const I = j(b);
    return I ? I.status === "available" ? `${I.currentVersion || "?"} → ${I.latestVersion || "?"}` : I.status === "queued" ? "queued" : I.status === "skipped" ? "skipped" : I.status === "planning" ? "planning" : I.status === "updating" ? "updating" : I.status === "updated" ? "updated" : I.status === "blocked" ? "blocked" : I.status === "failed" ? "failed" : "" : "";
  }
  function d(b) {
    const I = j(b)?.status;
    return I === "planning" || I === "updating" ? "tabler:loader-2" : I === "updated" ? "tabler:check" : I === "queued" ? "tabler:clock" : I === "skipped" ? "tabler:player-skip-forward" : I === "blocked" ? "tabler:lock" : I === "failed" ? "tabler:alert-triangle" : "tabler:arrow-up-circle";
  }
  function Q(b) {
    const I = j(b)?.status;
    return I === "planning" || I === "updating";
  }
  async function p() {
    if (!e || S.value) return;
    S.value = !0, n.value = null;
    const b = {};
    let I = 0, L = 0;
    try {
      for (const E of t.value) {
        if (!s(E) || !i(E)) continue;
        const J = ft(E);
        try {
          const te = await e.listVersions(E.component), oe = N(te.items), me = z(oe, J) ? "available" : "current";
          me === "available" && I++, b[E.component] = { component: E.component, currentVersion: J, latestVersion: oe, status: me }, w.value = { ...b };
        } catch (te) {
          L++, b[E.component] = {
            component: E.component,
            currentVersion: J,
            latestVersion: "",
            status: "failed",
            message: ze(te, "version scan failed")
          }, w.value = { ...b };
        }
      }
      r("ok", `Found ${I} update${I === 1 ? "" : "s"}${L ? `, ${L} failed` : ""}`);
    } finally {
      S.value = !1;
    }
  }
  async function k(b, I) {
    M(b, { status: "planning", message: void 0 });
    try {
      const L = await e.planInstall({ component: b, version: I, run_migrations: !0 }), E = L.missing_requirements || [];
      if (E.length) {
        const J = `Missing required settings: ${E.join(", ")}`;
        return M(b, { status: "blocked", message: J }), null;
      }
      return L;
    } catch (L) {
      const E = ze(L, "update plan failed");
      return M(b, { status: "failed", message: E }), null;
    }
  }
  async function A(b) {
    if (!e || !b.component) return !1;
    let I = j(b);
    if (!I) {
      const L = ft(b);
      try {
        const E = await e.listVersions(b.component), J = N(E.items);
        I = {
          component: b.component,
          currentVersion: L,
          latestVersion: J,
          status: z(J, L) ? "available" : "current"
        }, M(b.component, I);
      } catch (E) {
        return M(b.component, { status: "failed", message: ze(E, "version scan failed") }), !1;
      }
    }
    if (!I.latestVersion || !z(I.latestVersion, ft(b))) return !0;
    try {
      const L = K(I.latestVersion), E = await k(b.component, L);
      if (!E) return !1;
      const J = e.install({
        ...E.install_payload,
        component: b.component,
        version: L,
        run_migrations: !0,
        migration_policy: "up"
      });
      return M(b.component, { status: "updating" }), await J, M(b.component, {
        status: "updated",
        currentVersion: I.latestVersion,
        latestVersion: I.latestVersion,
        message: void 0
      }), f(), !0;
    } catch (L) {
      return M(b.component, { status: "failed", message: ze(L, "update failed") }), !1;
    }
  }
  async function re() {
    if (_.value || F.value.length === 0) return;
    _.value = !0;
    const b = [...F.value];
    try {
      for (const E of b) M(E.component, { status: "planning" });
      const I = await e.planBatchInstall({
        dependencies: b.map((E) => ({
          id: E.dependencyId,
          component: E.component,
          version: K(j(E).latestVersion)
        })),
        run_migrations: !0,
        migration_policy: "up"
      }), L = /* @__PURE__ */ new Map();
      for (const E of I.plans) {
        const J = E.missing_requirements || [], te = (E.requirements || []).filter((oe) => oe.invalid).map((oe) => `${oe.id || oe.parameter_name}: ${oe.invalid_reason || "invalid value"}`);
        if (E.applicable === !1 || J.length || te.length) {
          const oe = [
            J.length ? `Missing required settings: ${J.join(", ")}` : "",
            te.length ? `Invalid settings: ${te.join(", ")}` : ""
          ].filter(Boolean).join(". ") || "Update plan cannot be applied";
          L.set(E.dependency?.component || "Unknown module", oe);
        }
      }
      if (!I.applicable || L.size) {
        for (const E of b) M(E.component, {
          status: L.has(E.component) ? "blocked" : "skipped",
          message: L.get(E.component) || "Batch not applied because its plan is blocked"
        });
        r("error", L.size ? [...L].map(([E, J]) => `${E}: ${J}`).join("; ") : "Update plan cannot be applied. No modules were changed.");
        return;
      }
      if (!I.install_payload?.dependencies?.length) throw new Error("Update plan returned no install payload");
      for (const E of b) M(E.component, { status: "updating" });
      await e.install(I.install_payload);
      for (const E of b) M(E.component, { status: "updated" });
      f(), r("ok", `Updated ${b.length} module${b.length === 1 ? "" : "s"}`);
    } catch (I) {
      const L = ze(I, "update failed");
      for (const E of b) M(E.component, { status: "failed", message: L });
      r("error", L);
    } finally {
      try {
        await g(), await v();
      } catch (I) {
        r("error", `Module status could not be refreshed: ${ze(I, "refresh failed")}`);
      } finally {
        _.value = !1;
      }
    }
  }
  return {
    updateScan: w,
    updateScanLoading: S,
    updateAllRunning: _,
    availableUpdates: F,
    updateInfoForDep: j,
    updateStatusLabel: R,
    updateStatusIcon: d,
    updateStatusBusy: Q,
    scanInstalledUpdates: p,
    updateInstalledDependency: A,
    updateAllAvailable: re
  };
}
function Sl({ hub: e, loadCatalog: t }) {
  const n = H(!1), s = H(!1), i = H(!1), r = H(!1), f = H(null), g = H(""), v = H(!1), w = H(!1), S = H(null), _ = q(() => f.value?.orgs || []), F = q(() => f.value?.username || f.value?.user_id || ""), B = q(() => !!f.value?.authenticated), T = q(() => !!(f.value?.authenticated && f.value?.expired)), N = q(() => i.value ? "tabler:key" : T.value ? "tabler:alert-triangle" : "tabler:key-off"), z = q(() => i.value ? "Hub token set" : T.value ? "Hub token expired" : "Set Hub token"), K = q(() => {
    const p = f.value?.expires_at;
    if (!p) return "";
    const k = new Date(p);
    return isNaN(k.getTime()) ? "" : k.toLocaleDateString();
  });
  function j(p) {
    f.value = p?.authenticated ? p : null;
    const k = uo(p);
    i.value = k, r.value = k;
  }
  async function M() {
    try {
      const { data: p } = await io.get("/api/v1/user/me");
      n.value = !!(p?.success && p?.security?.is_admin);
    } catch (p) {
      tt("modules:auth", p), n.value = !1;
    } finally {
      s.value = !0;
    }
  }
  async function R() {
    try {
      const p = await e.authStatus();
      j(p);
    } catch (p) {
      tt("modules:hub-auth", p);
    }
  }
  async function d() {
    const p = g.value.trim();
    if (!p) {
      S.value = "Paste a Hub token first.";
      return;
    }
    S.value = null, w.value = !0;
    try {
      const k = await e.authenticate(p);
      j(k), uo(k) ? (g.value = "", v.value = !1, await t()) : S.value = "That token is invalid or expired.";
    } catch (k) {
      S.value = ze(k, "failed to save Hub token");
    } finally {
      w.value = !1;
    }
  }
  async function Q() {
    S.value = null;
    try {
      await e.logout();
    } catch (p) {
      S.value = ze(p, "failed to clear Hub token");
      return;
    }
    j(null), await t();
  }
  return {
    isAdmin: n,
    authLoaded: s,
    hubConnected: i,
    hubUsable: r,
    hubStatus: f,
    hubToken: g,
    showTokenPanel: v,
    hubConnecting: w,
    hubError: S,
    hubOrgs: _,
    hubIdentity: F,
    hubTokenStored: B,
    hubTokenExpired: T,
    hubTokenIcon: N,
    hubTokenButtonLabel: z,
    hubExpiry: K,
    applyHubAuthStatus: j,
    loadAuth: M,
    loadHubAuth: R,
    saveHubToken: d,
    clearHubToken: Q
  };
}
const $l = ["kickside", "kickside-plugin"], Io = "kickside", Cl = "https://portal.wippy.ai/account/tokens", Il = [
  { label: "Block if any applied", value: "block" },
  { label: "Leave applied migrations", value: "leave" },
  { label: "Revert (down) - may lose data", value: "down" }
];
function _l() {
  const e = Ro(io), t = H(!0), n = H(null), s = Sl({ hub: e, loadCatalog: In }), {
    isAdmin: i,
    authLoaded: r,
    hubConnected: f,
    hubUsable: g,
    hubStatus: v,
    hubToken: w,
    showTokenPanel: S,
    hubConnecting: _,
    hubError: F,
    hubOrgs: B,
    hubIdentity: T,
    hubTokenStored: N,
    hubTokenExpired: z,
    hubTokenIcon: K,
    hubTokenButtonLabel: j,
    hubExpiry: M,
    loadAuth: R,
    loadHubAuth: d,
    saveHubToken: Q,
    clearHubToken: p
  } = s, k = H([]), A = H(""), re = H("all"), b = H(!1), I = H(null), L = H(!0), E = H([]), J = H(!1), te = H(null), oe = H(""), me = H("downloads"), Ae = vl({
    hub: e,
    installed: k,
    catalog: E,
    installedDepFor: _e,
    installedCanUpdate: wt,
    installedUpdateDisabledReason: Yt,
    installedCanUninstall: Ot,
    installedIsPrivate: xt
  }), {
    selected: ge,
    selectedModule: Ke,
    detailReadme: Re,
    detailEntries: mt,
    detailLoading: qe,
    detailTab: ht,
    detailVersions: Mt,
    envVars: Pt,
    requirements: Se,
    detailGroups: Gt,
    versionMeta: nt,
    selectedInstalledDep: Ge,
    selectedCanUpdate: bt,
    selectedUpdateDisabledReason: ot,
    selectedCanUninstall: We,
    selectedIsPrivate: Be,
    openDetail: Te,
    closeDetail: $e,
    refreshSelectedDetail: Ze
  } = Ae, Ye = kl({
    hub: e,
    selected: ge,
    selectedInstalledDep: Ge,
    installedIsRoot: Ie,
    installedUninstallDisabledReason: Zt,
    installedCanUninstall: Ot,
    refreshAll: Ht,
    refreshSelectedDetail: Ze,
    showToast: O,
    notifyModulesChanged: Jn
  }), {
    uninstallDialogOpen: Ft,
    uninstallDep: it,
    uninstallPolicy: Xe,
    uninstallRunning: He,
    uninstallPreviewLoading: Tt,
    uninstallPreview: $,
    uninstallExecution: x,
    uninstallCode: D,
    uninstallError: U,
    uninstallRequiredBy: Z,
    uninstallPhase: Y,
    uninstallElapsedSec: de,
    selectedUninstallBlockedReason: ke,
    uninstallBlockedReason: st,
    uninstallActionBlockedReason: Et,
    openUninstallDialog: fe,
    previewUninstall: Ee,
    runUninstall: at
  } = Ye, vt = wl({
    hub: e,
    installed: k,
    installedError: I,
    installedCanUpdate: wt,
    installedIsRoot: Ie,
    showToast: O,
    notifyModulesChanged: Jn,
    refreshAll: Ht,
    refreshSelectedDetail: Ze
  }), {
    updateScanLoading: gt,
    updateAllRunning: ve,
    availableUpdates: Me,
    updateInfoForDep: lt,
    updateStatusLabel: Je,
    updateStatusIcon: on,
    updateStatusBusy: Vt,
    scanInstalledUpdates: Ct,
    updateInstalledDependency: Ve,
    updateAllAvailable: je
  } = vt, yt = q(() => {
    const V = /* @__PURE__ */ new Set();
    for (const ae of k.value)
      if (ae.installed !== !1)
        for (const jt of co(ae)) V.add(jt);
    return V;
  }), kt = q(() => Oi(E.value, oe.value)), we = q(() => kt.value.filter((V) => !St(V))), rt = q(() => oe.value.trim() || we.value.length < 7 ? [] : [...we.value].sort((V, ae) => (ae.total_downloads || 0) - (V.total_downloads || 0)).slice(0, 6)), sn = q(() => new Set(rt.value.map(Pn))), It = q(() => Li(we.value.filter((V) => !sn.value.has(Pn(V))), me.value)), ut = q(() => k.value.filter((V) => V.installed !== !1).length), dt = q(() => {
    const V = A.value.trim().toLowerCase(), ae = re.value, jt = k.value.filter((Pe) => Pe.installed === !1 || ae === "root" && !Ie(Pe) || ae === "transitive" && Ie(Pe) || ae === "local" && Pe.source !== "local" ? !1 : V ? [
      Pe.component,
      Pe.id,
      Pe.name,
      Pe.namespace,
      Pe.version,
      Pe.source,
      Rt(Pe),
      Bt(Pe),
      Co(Pe),
      ft(Pe)
    ].filter(Boolean).join(" ").toLowerCase().includes(V) : !0);
    return zi(jt, Ce);
  }), Qe = q(() => k.value.filter((V) => V.installed !== !1 && !!Ce(V.component)).length), ye = q(() => dt.value.filter((V) => !!Ce(V.component)).length), et = q(() => r.value && !i.value), be = H(null), Wt = q(() => be.value !== null);
  function Ce(V) {
    return E.value.find((ae) => Mn(ae, V));
  }
  function _t(V) {
    return hn({ full_name: V.component });
  }
  function Dt(V) {
    const ae = Ce(V.component);
    return ae ? tn(ae) : "tabler:package";
  }
  function xt(V) {
    return mn(Ce(V.component)) || mn(V);
  }
  function Ie(V) {
    return Ai(V || {});
  }
  function Rt(V) {
    return Mi(V);
  }
  function Bt(V) {
    return Pi(V);
  }
  function Zt(V) {
    if (Ie(V)) return "";
    const ae = Bt(V);
    return ae ? `Installed as a dependency; ${ae}` : "Installed as a dependency of another module";
  }
  function wt(V) {
    return !!(V?.component && V.source !== "local");
  }
  function Yt(V) {
    return V.source === "local" ? "Local replacement; update from source" : "No Hub dependency update action available";
  }
  function Ot(V) {
    return !!(V && Ie(V));
  }
  function St(V) {
    return co(V).some((ae) => yt.value.has(ae));
  }
  function _e(V) {
    return k.value.find((ae) => Mn(ae, V));
  }
  function O(V, ae) {
    const jt = Ho?.toast;
    typeof jt == "function" ? jt({ severity: V === "ok" ? "success" : "error", summary: ae }) : (n.value = { kind: V, message: ae }, setTimeout(() => {
      n.value?.message === ae && (n.value = null);
    }, 5e3));
  }
  function y() {
    ge.value && G({
      full_name: ge.value.component,
      latest_version: ge.value.version,
      description: ge.value.description
    });
  }
  function Ue() {
    const V = ge.value && _e(ge.value.component);
    V && wt(V) && he(V);
  }
  function Vn() {
    const V = ge.value && _e(ge.value.component);
    V && Ot(V) && fe(V);
  }
  async function Dn() {
    b.value = !0, I.value = null;
    try {
      k.value = bl(await e.listDependencies());
    } catch (V) {
      k.value = [], tt("modules:listDependencies", V), I.value = ze(V, "dependency graph unavailable");
    }
    b.value = !1;
  }
  async function In() {
    J.value = !0, te.value = null;
    try {
      E.value = (await e.fetchAllByKeyword($l)).filter(Fi);
    } catch (V) {
      tt("modules:catalog", V), V instanceof Kt && (V.code === "UNAUTHORIZED" || V.code === "FORBIDDEN") ? g.value = !1 : te.value = ze(V, `failed to load ${Io} catalog`);
    } finally {
      J.value = !1;
    }
  }
  async function Ht() {
    await Promise.all([Dn(), In()]);
  }
  function G(V) {
    const ae = An(V);
    be.value = {
      mode: "install",
      component: ae,
      version: V.latest_version ? String(V.latest_version) : "",
      currentId: null,
      catalogItem: Ce(ae) || V,
      installedDep: null
    };
  }
  function he(V) {
    wt(V) && (be.value = {
      mode: "update",
      component: V.component,
      // Let the dialog load and select the newest published release. Seeding
      // this with the resolved version re-submits the current package while
      // presenting the operation as an update.
      version: "",
      currentId: V.dependencyId || null,
      catalogItem: Ce(V.component) || null,
      installedDep: V
    });
  }
  function pe() {
    be.value = null;
  }
  async function xe() {
    await Ht(), await Ze(), pe();
  }
  return oo(() => {
    Bo("wc-render-markdown", { timeoutMs: 8e3 }).catch(() => {
    });
  }), wi(async () => {
    try {
      if (await R(), !i.value) return;
      await d(), await Ht();
    } finally {
      t.value = !1;
    }
  }), {
    LABEL: Io,
    HUB_PORTAL: Cl,
    UNINSTALL_MIGRATION_OPTIONS: Il,
    initialLoading: t,
    accessDenied: et,
    statusBanner: n,
    hubConnected: f,
    hubStatus: v,
    hubToken: w,
    showTokenPanel: S,
    hubConnecting: _,
    hubError: F,
    hubOrgs: B,
    hubIdentity: T,
    hubTokenStored: N,
    hubTokenExpired: z,
    hubTokenIcon: K,
    hubTokenButtonLabel: j,
    hubExpiry: M,
    selected: ge,
    selectedModule: Ke,
    detailReadme: Re,
    detailEntries: mt,
    detailLoading: qe,
    detailTab: ht,
    detailVersions: Mt,
    envVars: Pt,
    requirements: Se,
    detailGroups: Gt,
    versionMeta: nt,
    selectedCanUpdate: bt,
    selectedUpdateDisabledReason: ot,
    selectedCanUninstall: We,
    selectedIsPrivate: Be,
    selectedUninstallBlockedReason: ke,
    entryName: fl,
    entryDesc: ml,
    entryIcon: hl,
    installed: k,
    installedFilter: A,
    installedKindFilter: re,
    installedTotal: ut,
    updateScanLoading: gt,
    updateAllRunning: ve,
    availableUpdates: Me,
    installedLoading: b,
    installedError: I,
    installedOpen: L,
    catalog: E,
    catalogLoading: J,
    catalogError: te,
    catalogInstalledTotal: Qe,
    visibleCatalogInstalled: ye,
    browseFilter: oe,
    sortBy: me,
    availableItems: we,
    featured: rt,
    sortedItems: It,
    visibleInstalled: dt,
    catalogItemFor: Ce,
    installedAccent: _t,
    installedIcon: Dt,
    installedIsPrivate: xt,
    installedIsRoot: Ie,
    installedRole: Rt,
    installedUsedBy: Bt,
    installedCanUpdate: wt,
    installedUpdateDisabledReason: Yt,
    installedCanUninstall: Ot,
    installedMigrationSummary: Co,
    updateInfoForDep: lt,
    updateStatusLabel: Je,
    updateStatusIcon: on,
    updateStatusBusy: Vt,
    scanInstalledUpdates: Ct,
    updateInstalledDependency: Ve,
    updateAllAvailable: je,
    installDialogOpen: Wt,
    installTarget: be,
    closeInstallDialog: pe,
    onInstallChanged: xe,
    uninstallDialogOpen: Ft,
    uninstallDep: it,
    uninstallPolicy: Xe,
    uninstallRunning: He,
    uninstallPreviewLoading: Tt,
    uninstallPreview: $,
    uninstallExecution: x,
    uninstallCode: D,
    uninstallError: U,
    uninstallRequiredBy: Z,
    uninstallBlockedReason: st,
    uninstallActionBlockedReason: Et,
    uninstallPhase: Y,
    uninstallElapsedSec: de,
    previewUninstall: Ee,
    executionStepLabel: Do,
    openDetail: Te,
    closeDetail: $e,
    detailInstall: y,
    detailUpdate: Ue,
    detailUninstall: Vn,
    refreshAll: Ht,
    saveHubToken: Q,
    clearHubToken: p,
    openUpdateDialog: he,
    openUninstallDialog: fe,
    installedUninstallDisabledReason: Zt,
    runUninstall: at
  };
}
const xl = ["aria-label", "aria-busy"], Ol = /* @__PURE__ */ nn({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    busy: { type: Boolean },
    label: {},
    headerClass: {},
    contentClass: {},
    footerClass: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, i = H(null);
    async function r() {
      await fn();
      const g = i.value;
      g && (n.visible && !g.open ? g.showModal() : !n.visible && g.open && g.close());
    }
    function f(g) {
      g.preventDefault(), n.busy || s("close");
    }
    return Ne(() => n.visible, r), oo(r), Vo(() => {
      i.value?.open && i.value.close();
    }), (g, v) => (a(), u("dialog", {
      ref_key: "dialog",
      ref: i,
      class: "kx-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: f,
      onClose: v[1] || (v[1] = () => {
        e.visible && !e.busy && s("close");
      })
    }, [
      l("header", {
        class: ne(e.headerClass)
      }, [
        ie(g.$slots, "header"),
        m(o(le), {
          type: "button",
          text: "",
          severity: "secondary",
          "aria-label": "Close dialog",
          disabled: e.busy,
          onClick: v[0] || (v[0] = (w) => s("close"))
        }, {
          default: ee(() => [...v[2] || (v[2] = [
            P("×", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 2),
      l("div", {
        class: ne(e.contentClass)
      }, [
        ie(g.$slots, "default")
      ], 2),
      g.$slots.footer ? (a(), u("footer", {
        key: 0,
        class: ne(e.footerClass)
      }, [
        ie(g.$slots, "footer")
      ], 2)) : h("", !0)
    ], 40, xl));
  }
}), Ll = ["aria-expanded", "aria-controls", "aria-label", "disabled"], zl = { class: "p-select-label" }, Al = {
  key: 0,
  class: "kx-ps-val"
}, Ml = { class: "kx-ps-val-label" }, Pl = {
  key: 1,
  class: "kx-ps-ph"
}, Fl = { class: "p-select-dropdown" }, Tl = { class: "p-select-overlay kx-ps-panel" }, El = { class: "p-select-header" }, Vl = ["aria-label", "aria-controls", "aria-activedescendant"], Dl = ["id", "aria-label"], Rl = {
  class: "p-select-option-group",
  role: "presentation"
}, Bl = ["id", "aria-selected", "onClick", "onMousemove"], Hl = { class: "kx-ps-opt-body" }, jl = { class: "kx-ps-opt-title" }, Ul = {
  key: 0,
  class: "kx-ps-opt-sub"
}, Nl = {
  key: 0,
  class: "p-select-empty-message",
  role: "status"
}, Kl = {
  key: 1,
  class: "p-select-empty-message",
  role: "presentation"
}, ql = {
  key: 0,
  class: "p-select-empty-message",
  role: "alert"
}, Gl = ["disabled"], _o = /* @__PURE__ */ nn({
  __name: "PickerSelect",
  props: {
    items: {},
    modelValue: {},
    placeholder: {},
    ariaLabel: {},
    disabled: { type: Boolean },
    remote: { type: Boolean },
    loading: { type: Boolean },
    more: { type: Boolean },
    error: {}
  },
  emits: ["update:modelValue", "search", "more"],
  setup(e, { emit: t }) {
    const n = e, s = t, i = H(null), r = H(null), f = H(!1), g = H(""), v = H(0), w = Ii(), S = q(() => {
      const z = g.value.trim().toLowerCase(), K = /* @__PURE__ */ new Map();
      for (const M of n.items) {
        if (!n.remote && z && ![M.title, M.subtitle, M.id, M.group].some((Q) => Q?.toLowerCase().includes(z))) continue;
        const R = M.group || "Other", d = K.get(R);
        d ? d.push(M) : K.set(R, [M]);
      }
      let j = 0;
      return [...K.entries()].sort((M, R) => M[0].localeCompare(R[0])).map(([M, R]) => ({ group: M, items: R.map((d) => ({ item: d, index: j++ })) }));
    }), _ = q(() => S.value.flatMap((z) => z.items)), F = q(() => n.items.find((z) => z.id === n.modelValue)), B = q(() => _.value[v.value] ? `${w}-${v.value}` : void 0);
    Ne(g, () => {
      v.value = 0;
    }), Ne([f, g], ([z, K]) => {
      z && n.remote && s("search", K);
    }), Ne(() => n.disabled, (z) => {
      z && (f.value = !1);
    }), Ne(f, async (z) => {
      if (!z) {
        i.value?.focus();
        return;
      }
      g.value = "", v.value = Math.max(0, _.value.findIndex(({ item: K }) => K.id === n.modelValue)), await fn(), r.value?.focus();
    });
    function T(z) {
      n.disabled || n.loading || (s("update:modelValue", z.id), f.value = !1);
    }
    async function N(z) {
      if (z.key === "Escape" && f.value) {
        z.preventDefault(), z.stopPropagation(), f.value = !1;
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End", "Enter"].includes(z.key)) return;
      if (z.preventDefault(), !f.value) {
        f.value = !0;
        return;
      }
      if (z.key === "Enter") {
        const M = _.value[v.value];
        M && T(M.item);
        return;
      }
      const K = _.value.length - 1;
      v.value = z.key === "Home" ? 0 : z.key === "End" ? K : Math.max(0, Math.min(K, v.value + (z.key === "ArrowDown" ? 1 : -1))), await fn(), i.value?.getRootNode()?.querySelector(`[id="${B.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    return (z, K) => (a(), u(X, null, [
      l("button", {
        ref_key: "anchor",
        ref: i,
        type: "button",
        class: "kx-ps p-select",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": f.value,
        "aria-controls": o(w),
        "aria-label": e.ariaLabel,
        disabled: e.disabled,
        onClick: K[0] || (K[0] = (j) => f.value = !f.value),
        onKeydown: N
      }, [
        l("span", zl, [
          F.value ? (a(), u("span", Al, [
            m(o(C), {
              icon: F.value.icon || "tabler:point",
              class: "kx-ps-val-ico",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            l("span", Ml, c(F.value.title), 1)
          ])) : (a(), u("span", Pl, c(e.placeholder || "Select…"), 1))
        ]),
        l("span", Fl, [
          m(o(C), {
            icon: "tabler:chevron-down",
            "aria-hidden": "true"
          })
        ])
      ], 40, Ll),
      m(ni, {
        open: f.value,
        "onUpdate:open": K[3] || (K[3] = (j) => f.value = j),
        anchor: i.value
      }, {
        default: ee(() => [
          l("div", Tl, [
            l("div", El, [
              De(l("input", {
                ref_key: "search",
                ref: r,
                "onUpdate:modelValue": K[1] || (K[1] = (j) => g.value = j),
                type: "search",
                class: "p-inputtext p-select-filter",
                "aria-label": `Search ${e.ariaLabel || e.placeholder || "options"}`,
                "aria-controls": o(w),
                "aria-activedescendant": B.value,
                onKeydown: N
              }, null, 40, Vl), [
                [xn, g.value]
              ])
            ]),
            l("ul", {
              id: o(w),
              class: "p-select-list kx-ps-options",
              role: "listbox",
              "aria-label": e.ariaLabel || e.placeholder || "Options"
            }, [
              (a(!0), u(X, null, se(S.value, (j) => (a(), u(X, {
                key: j.group
              }, [
                l("li", Rl, c(j.group), 1),
                (a(!0), u(X, null, se(j.items, ({ item: M, index: R }) => (a(), u("li", {
                  id: `${o(w)}-${R}`,
                  key: M.id,
                  class: ne(["p-select-option kx-ps-option", { "p-select-option-selected": M.id === e.modelValue, "p-focus": R === v.value }]),
                  role: "option",
                  "aria-selected": M.id === e.modelValue,
                  onClick: (d) => T(M),
                  onMousemove: (d) => v.value = R
                }, [
                  m(o(C), {
                    icon: M.icon || "tabler:point",
                    class: "kx-ps-opt-ico",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  l("span", Hl, [
                    l("span", jl, c(M.title), 1),
                    M.subtitle ? (a(), u("span", Ul, c(M.subtitle), 1)) : h("", !0)
                  ])
                ], 42, Bl))), 128))
              ], 64))), 128)),
              e.loading ? (a(), u("li", Nl, "Loading…")) : !_.value.length && !e.error ? (a(), u("li", Kl, "No matches")) : h("", !0)
            ], 8, Dl),
            e.error ? (a(), u("div", ql, c(e.error), 1)) : h("", !0),
            e.more ? (a(), u("button", {
              key: 1,
              type: "button",
              class: "p-button p-button-secondary",
              "data-testid": "picker-more",
              disabled: e.loading || e.disabled,
              onClick: K[2] || (K[2] = (j) => s("more"))
            }, "Load more", 8, Gl)) : h("", !0)
          ])
        ]),
        _: 1
      }, 8, ["open", "anchor"])
    ], 64));
  }
});
function Qn() {
  return { status: "idle", modules: [], findings: [], scanned: 0, total: 0 };
}
function Wl(e) {
  return e.some((t) => t.severity === "critical") ? "critical" : e.length > 0 ? "warnings" : "clean";
}
const xo = {
  info: { label: "Info", icon: "tabler:info-circle", tone: "info" },
  warning: { label: "Warning", icon: "tabler:alert-triangle", tone: "warn" },
  critical: { label: "Critical", icon: "tabler:shield-x", tone: "danger" }
};
function Zl(e) {
  return e.severity !== "critical";
}
const Yl = ["clean", "warnings", "critical", "error", "unavailable", "skipped"];
function Oo(e) {
  return Yl.includes(e) ? e : "clean";
}
function Xl(e) {
  return e === "critical" ? "critical" : e === "warning" ? "warning" : "info";
}
function Jl(e) {
  const t = e && typeof e == "object" ? e : {}, n = [], s = [];
  for (const g of t.modules || []) {
    const v = String(g.module || ""), w = g.version ? String(g.version) : void 0, S = (g.findings || []).map((_, F) => ({
      id: `${v}#${F}`,
      module: v,
      version: w,
      severity: Xl(_.severity),
      title: String(_.title || "Issue"),
      detail: _.detail ? String(_.detail) : void 0,
      location: _.location ? String(_.location) : void 0
    }));
    for (const _ of S) s.push(_);
    n.push({
      module: v,
      version: w,
      status: Oo(g.status),
      summary: g.summary ? String(g.summary) : void 0,
      findings: S
    });
  }
  const i = typeof t.total == "number" ? t.total : n.length, r = typeof t.scanned == "number" ? t.scanned : n.length;
  return {
    status: t.overall_status ? Oo(t.overall_status) : Wl(s),
    summary: t.overall_summary ? String(t.overall_summary) : void 0,
    modules: n,
    findings: s,
    scanned: r,
    total: i
  };
}
function Ql({ props: e, hub: t, plan: n, activeSection: s, versionArg: i, requirementPayload: r, invalidatePlan: f, refreshPlan: g, planCurrent: v }) {
  const w = H([]), S = H({}), _ = H({}), F = q(() => {
    const $ = /* @__PURE__ */ new Map();
    for (const x of w.value) {
      const D = String(x.module || "");
      $.has(D) || $.set(D, []), $.get(D).push(x);
    }
    return Array.from($.entries()).map(([x, D]) => ({ module: x, items: D, direct: !D.every((U) => On(U, e.component)) })).sort((x, D) => x.direct === D.direct ? x.module.localeCompare(D.module) : x.direct ? -1 : 1);
  }), B = q(() => w.value.filter(($) => !On($, e.component))), T = q(() => w.value.filter(($) => !Re($))), N = q(() => w.value.length - B.value.length), z = q(() => {
    const $ = [];
    for (const x of w.value) {
      const D = ue(x);
      !D || !x.required && !x.missing || b(S.value[D]) && $.push(D);
    }
    return $;
  }), K = q(() => w.value.filter(($) => !b(S.value[ue($)])).length), j = q(() => nt().length), M = H(!1), R = H(null);
  let d = null;
  const Q = H(0), p = H({}), k = q(() => Object.keys(p.value).length);
  let A = 0;
  const re = /* @__PURE__ */ new Set();
  function b($) {
    return $ == null || $ === "" || typeof $ == "string" && !$.trim() || Array.isArray($) && $.length === 0 || typeof $ == "object" && Object.keys($).length === 0;
  }
  function I($) {
    return $ == null ? "" : typeof $ == "object" ? JSON.stringify($) : String($);
  }
  function L($) {
    if ($.expected_type) return $.expected_type;
    const x = [$.value, $.default, ...($.suggestions || []).map((D) => D.value)];
    for (const D of x) {
      if (typeof D == "boolean" || typeof D == "number") return typeof D;
      if (Array.isArray(D)) return "array";
      if (D && typeof D == "object") return "object";
    }
    return "string";
  }
  function E($, x) {
    if (typeof x != "string") return x;
    const D = x.trim(), U = L($);
    if (U === "boolean") return /^(true|false)$/.test(D) ? D === "true" : x;
    if (U === "number" || U === "integer") return D && Number.isFinite(Number(D)) ? Number(D) : x;
    if (U === "array" || U === "object")
      try {
        return JSON.parse(D);
      } catch {
        return x;
      }
    return x;
  }
  function J($, x) {
    const D = L($);
    return D === "array" ? Array.isArray(x) : D === "object" ? x !== null && typeof x == "object" && !Array.isArray(x) : D === "integer" ? typeof x == "number" && Number.isInteger(x) : typeof x === D && (D !== "number" || Number.isFinite(x));
  }
  function te($, x) {
    const D = ue($);
    if (!D || Re($)) return;
    const U = E($, x ?? "");
    JSON.stringify(S.value[D]) !== JSON.stringify(U) && (re.add(D), S.value = { ...S.value, [D]: U }, f());
  }
  function oe($) {
    const x = S.value[ue($)];
    return !Re($) && !b(x) && !J($, x);
  }
  function me($) {
    const x = L($);
    return x === "boolean" ? "expects true or false" : `expects ${x === "integer" || x === "object" || x === "array" ? "an" : "a"} ${x}`;
  }
  const Ae = q(() => w.value.filter(oe).map(ue).filter(Boolean));
  function ge($) {
    return I(S.value[ue($)]);
  }
  function Ke($) {
    return ($.required || $.missing) === !0 && b(S.value[ue($)]);
  }
  function Re($) {
    return On($, e.component) && $.missing !== !0 && !re.has(ue($));
  }
  function mt($) {
    const x = /* @__PURE__ */ new Set(), D = [];
    for (const U of $.suggestions || []) {
      const Z = I(U.value).trim();
      if (!Z || x.has(Z)) continue;
      x.add(Z);
      const Y = String(U.label || Z).trim(), de = [U.kind, U.source, U.description].filter(Boolean).map(String).join(" | ");
      D.push({ label: Y && Y !== Z ? `${Y} (${Z})` : Z, value: Z, title: de });
    }
    return D;
  }
  function qe() {
    const $ = {}, x = (U, Z) => {
      if (U = String(U || "").trim(), !U) return;
      $[U] = Z;
      const Y = U.includes(":") && U.split(":").pop() || "";
      Y && $[Y] === void 0 && ($[Y] = $[U]);
    }, D = e.installedDep?.parameters;
    if (Array.isArray(D))
      for (const U of D)
        x(U.name, U.value);
    else if (D && typeof D == "object")
      for (const [U, Z] of Object.entries(D)) x(U, Z);
    return $;
  }
  async function ht() {
    if (_.value = {}, !!t)
      try {
        const $ = await t.listDependencies({ includeEntries: !1, includeMigrations: !1 }), x = {}, D = (U, Z) => {
          U = String(U || "").trim();
          const Y = String(Z ?? "").trim();
          if (!U || !Y || x[U] !== void 0) return;
          x[U] = Z;
          const de = U.includes(":") && U.split(":").pop() || "";
          de && x[de] === void 0 && (x[de] = x[U]);
        };
        for (const U of $.dependencies || []) {
          const Z = U.parameters;
          if (Array.isArray(Z))
            for (const Y of Z) D(Y.name, Y.value);
          else if (Z && typeof Z == "object")
            for (const [Y, de] of Object.entries(Z)) D(Y, de);
        }
        _.value = x;
      } catch ($) {
        tt("install:dependency-parameters", $);
      }
  }
  function Mt($) {
    for (const x of n.value?.recommended_parameters || [])
      if (x.name === $ && I(x.value).trim() !== "") return I(x.value);
    return "";
  }
  function Pt($) {
    const x = [
      ue($),
      String($.parameter_name || ""),
      String($.full_id || ""),
      String($.name || ""),
      String($.short_name || "")
    ].map((D) => D.trim()).filter(Boolean);
    for (const D of x) {
      const U = I(_.value[D]).trim();
      if (U) return U;
      const Z = D.includes(":") && D.split(":").pop() || "";
      if (Z) {
        const Y = I(_.value[Z]).trim();
        if (Y) return Y;
      }
    }
    return "";
  }
  function Se($) {
    const x = ue($);
    if (!x || Re($) || String(S.value[x] ?? "").trim()) return "";
    const U = Mt(x).trim();
    if (U) return U;
    const Z = Pt($);
    if (Z) return Z;
    const Y = I($.default).trim();
    if (Y) return Y;
    const de = mt($).map((st) => st.value).filter(Boolean);
    if (de.length === 1) return de[0];
    const ke = Gt($);
    return ke.length && ke[0].score > 0 && (ke.length === 1 || ke[0].score > ke[1].score) ? ke[0].value : "";
  }
  function Gt($) {
    return String($.expected_kind || "").trim() !== "security.scope" ? [] : ($.suggestions || []).map((x) => {
      const D = I(x.value).trim(), U = String(x.label || "").toLowerCase(), Z = String(x.description || "").toLowerCase();
      let Y = 0;
      return D || (Y -= 1e3), (U.includes("system") || Z.includes("system") || Z.includes("internal")) && (Y -= 50), (U.includes("admin") || Z.includes("full access") || Z.includes("assign sparingly")) && (Y -= 50), (Z.includes("signed-in") || Z.includes("authenticated")) && (Y += 30), (U === "user" || U === "member") && (Y += 20), { value: D, score: Y };
    }).filter((x) => x.value).sort((x, D) => D.score - x.score || x.value.localeCompare(D.value));
  }
  function nt() {
    const $ = [];
    for (const x of T.value) {
      if (!Ke(x)) continue;
      const D = ue(x), U = Se(x);
      D && U && $.push({ name: D, value: U });
    }
    return $;
  }
  function Ge($) {
    return Se($) !== "";
  }
  function bt($) {
    const x = ue($), D = Se($);
    if (!x || !D) {
      s.value = "requirements", Q.value++;
      return;
    }
    te($, D);
  }
  function ot() {
    const $ = nt();
    if (!$.length) {
      s.value = "requirements", Q.value++;
      return;
    }
    for (const x of $) {
      const D = w.value.find((U) => ue(U) === x.name);
      D && te(D, String(x.value));
    }
  }
  function We() {
    return T.value.filter(($) => b(S.value[ue($)]) && ($.missing || $.value_source === "conflict" || $.expected_type || mt($).length)).map(($) => ({ name: $.full_id || ue($) }));
  }
  const Be = q(() => We().length);
  function Te($, x) {
    return b(x) || !J($, x) ? !1 : !$.expected_kind || !!$.suggestions?.some((D) => D.value === x);
  }
  function $e($) {
    const x = { ...p.value }, D = { ...S.value };
    for (const U of $) {
      const Z = x[U];
      Z?.value !== void 0 && (D[U] = Z.value, re.add(U), delete x[U]);
    }
    return S.value = D, f(), x;
  }
  async function Ze($) {
    if (!v.value || M.value) return;
    const x = $e($), D = A;
    if (await g(), D !== A || !v.value) return;
    const U = {};
    for (const Z of T.value) {
      const Y = ue(Z), de = x[Y];
      de && b(S.value[Y]) && Z.expected_type === de.expected_type && Z.expected_kind === de.expected_kind && Te(Z, de.value) && (U[Y] = de);
    }
    p.value = U;
  }
  function Ye($) {
    const x = { ...p.value };
    for (const D of $) delete x[D];
    p.value = x;
  }
  function Ft($) {
    !v.value || M.value || $e($);
  }
  async function it($) {
    const x = We();
    if (!v.value || !x.length || M.value) return;
    He();
    const D = A, U = new AbortController();
    d = U, M.value = !0, R.value = null, p.value = {}, await new Promise((Z) => {
      let Y = !1, de = !1;
      const ke = (fe) => {
        if (Y) return;
        if (Y = !0, clearTimeout(st), U.signal.aborted || D !== A || d !== U) {
          Z();
          return;
        }
        d = null;
        const Ee = fe && typeof fe == "object" ? fe : {};
        if (Ee.success === !0) {
          const at = new Set(x.map((ve) => ve.name)), vt = {}, gt = new Map((Ee.requirements || []).map((ve) => [ve.full_id, ve]));
          w.value = w.value.map((ve) => ({
            ...ve,
            resolution_error: gt.get(ve.full_id)?.resolution_error
          }));
          for (const ve of Ee.parameters || []) {
            const Me = w.value.find((lt) => (lt.full_id || ue(lt)) === ve.name || ue(lt) === ve.name);
            if (!Me || !at.has(Me.full_id || ue(Me)) || !Te(Me, ve.value) || typeof ve.reason != "string" || !ve.reason.trim()) {
              R.value = { tone: "warning", code: "INVALID_CHOICE", message: "AI returns an invalid planned value or omits its reason. Choose a value manually." };
              continue;
            }
            vt[ue(Me)] = { ...Me, value: ve.value, choice_reason: ve.reason };
          }
          p.value = vt, Object.keys(vt).length ? R.value = { tone: "success", message: "Review AI suggestions before applying." } : R.value || (R.value = { tone: "warning", message: "No valid AI suggestion is available. Choose a value manually." });
        } else
          R.value = {
            tone: "warning",
            code: Ee.code,
            kind: Ee.kind,
            details: Ee.details,
            message: Ee.error || "AI could not resolve these settings. Choose a value manually."
          };
        M.value = !1, Z();
      }, st = setTimeout(() => {
        ke({ success: !1, code: "TIMEOUT", error: "AI requirement resolution timed out." }), U.abort();
      }, 2e4);
      U.signal.addEventListener("abort", () => {
        Y || (Y = !0, clearTimeout(st), Z());
      }, { once: !0 });
      const Et = {
        component: e.component,
        ...i() ? { version: i() } : {},
        ...e.mode === "update" && e.currentId ? { current_id: e.currentId } : {},
        ...r(),
        requirements: x,
        signal: U.signal,
        accept: () => {
          Y || (de = !0);
        },
        respond: ke
      };
      $?.dispatchEvent(new CustomEvent("instrumentRequirementResolution", { detail: Et, bubbles: !0, composed: !0 })), de || ke({ success: !1, code: "MODEL_UNAVAILABLE", error: "Configure an AI model to suggest settings, or choose values manually." });
    });
  }
  function Xe($, x) {
    n.value = $, w.value = ($.requirements || []).filter((Z) => Z.name !== "required_setup" && Z.short_name !== "required_setup");
    const D = qe(), U = {};
    for (const Z of w.value) {
      const Y = ue(Z);
      if (!Y) continue;
      const de = String(Z.name || Z.short_name || Y.split(":").pop() || "");
      U[Y] = (re.has(Y) ? x[Y] : b(x[Y]) ? void 0 : x[Y]) ?? D[Y] ?? D[de] ?? _.value[Y] ?? _.value[de] ?? Z.value ?? Z.default ?? "";
    }
    S.value = U;
    for (const Z of re)
      Z in U || re.delete(Z);
  }
  function He() {
    d?.abort(), d = null, M.value = !1, A++, p.value = {}, R.value = null;
  }
  function Tt() {
    He(), w.value = [], S.value = {}, re.clear(), _.value = {}, M.value = !1, R.value = null;
  }
  return {
    pendingSuggestions: p,
    pendingCount: k,
    acceptSuggestions: Ze,
    rejectSuggestions: Ye,
    editSuggestions: Ft,
    displayValue: I,
    requirements: w,
    parameterValues: S,
    installedParameterHints: _,
    requirementGroups: F,
    rootRequirements: B,
    editableRequirements: T,
    transitiveRequirementCount: N,
    missingRequirements: z,
    boundRequirementCount: K,
    autoFitCount: j,
    aiResolving: M,
    aiResolutionNotice: R,
    typeInvalidRequirements: Ae,
    highlightTick: Q,
    aiResolvableCount: Be,
    setParameter: te,
    requirementTypeInvalid: oe,
    requirementTypeHint: me,
    requirementValue: ge,
    requirementMissing: Ke,
    requirementReadOnly: Re,
    requirementOptions: mt,
    loadInstalledParameterHints: ht,
    applyPlan: Xe,
    recommendedValueFor: Mt,
    hintedValueFor: Pt,
    autoFitValue: Se,
    canAutoFitRequirement: Ge,
    autoFitRequirement: bt,
    autoFitRequirements: ot,
    resolveRequirementsWithAI: it,
    abortAI: He,
    resetRequirements: Tt
  };
}
function Rn(e) {
  return e.map((t) => [t.module, t.version || ""].join("\0")).sort().join("");
}
function er({ props: e, hub: t, plan: n, planCurrent: s, versionArg: i }) {
  const r = H(Qn()), f = H(/* @__PURE__ */ new Set()), g = H(!1);
  let v = 0, w = null;
  const S = q(() => r.value.findings.filter(Zl)), _ = q(() => S.value.filter((j) => !f.value.has(j.id)));
  function F(j) {
    const M = new Set(f.value);
    M.add(j.id), f.value = M;
  }
  function B() {
    const j = new Set(f.value);
    for (const M of S.value) j.add(M.id);
    f.value = j;
  }
  function T(j) {
    const M = j ? Rn(j) : null;
    M !== w && (v++, w = M, r.value = { ...Qn(), total: j?.length || 0 }, f.value = /* @__PURE__ */ new Set(), g.value = !1);
  }
  async function N() {
    if (!t || !e.component || !s.value) return;
    const j = n.value?.graph || [], M = Rn(j), R = ++v;
    f.value = /* @__PURE__ */ new Set(), g.value = !1, r.value = { status: "scanning", modules: [], findings: [], scanned: 0, total: j.length };
    try {
      const d = await t.scan({ component: e.component, version: i() });
      if (R !== v) return;
      const Q = Jl(d);
      if (Rn(Q.modules) !== M)
        throw new Error("Security scan resolved different module versions. Refresh the install plan and scan again.");
      r.value = Q;
    } catch (d) {
      if (R === v) {
        const Q = d instanceof Kt && (d.status === 404 || d.code === "UNKNOWN" || d.code === "NETWORK");
        r.value = Q ? { status: "unavailable", modules: [], findings: [], scanned: 0, total: j.length, error: "Security scan unavailable" } : { status: "error", modules: [], findings: [], scanned: 0, total: j.length, error: ze(d, "scan failed") };
      }
    }
  }
  function z() {
    const j = n.value?.graph || [];
    v++, r.value = {
      status: "skipped",
      modules: [],
      findings: [],
      scanned: 0,
      total: j.length,
      summary: "Security scan skipped by operator."
    }, f.value = /* @__PURE__ */ new Set(), g.value = !1;
  }
  function K() {
    v++;
  }
  return { scan: r, acknowledged: f, criticalConfirmed: g, softFindings: S, unacknowledgedSoft: _, acknowledge: F, acknowledgeAllSoft: B, resetScanForPlan: T, runScanNow: N, skipScan: z, cancelScan: K };
}
const tr = {
  "hub.install.started": "Publishing changeset",
  "hub.install.finished": "Finalizing",
  "hub.migrations.started": "Running migrations",
  "hub.migrations.finished": "Migrations applied",
  "hub.uninstall.started": "Removing entries"
}, Bn = [
  { label: "Run migrations (up)", value: "up" },
  { label: "Skip migrations (none)", value: "none" }
];
function nr(e) {
  if (!e || typeof e != "object") return "";
  const t = [e, e.data, e.payload, e.detail];
  for (const n of t)
    if (n && typeof n == "object" && typeof n.event == "string")
      return String(n.event);
  return "";
}
function or(e, t) {
  const n = Ro(io), s = H("overview"), i = H(""), r = H("pin"), f = H([]), g = H(!1), v = q(() => [
    { label: "latest", value: "" },
    ...f.value.map((G) => String(G.version || "")).filter(Boolean).map((G) => ({ label: G, value: G }))
  ]), w = q(() => f.value.find((G) => G.version === i.value) || f.value[0]);
  function S() {
    const G = i.value.trim().replace(/^>=?/, "");
    if (G)
      return r.value === "track" ? `>=${G}` : G;
  }
  const _ = q(() => e.installedDep ? ft(e.installedDep) : ""), F = H(""), B = H(!1), T = H(null), N = H(!1), z = H(!1), K = H(null), j = H(null), M = H(null), R = q(() => (T.value?.graph || []).filter((G) => G.direct || G.module === e.component)), d = q(() => (T.value?.graph || []).filter((G) => !G.direct && G.module !== e.component)), Q = q(() => Ti(T.value?.graph || [])), p = q(() => {
    const G = [], he = (pe, xe) => {
      for (const V of pe)
        G.push({ ...V, level: xe }), he(V.children, xe + 1);
    };
    return he(Q.value, 0), G;
  }), k = q(() => T.value?.module_count || T.value?.graph?.length || 0), A = q(() => (T.value?.graph || []).reduce((G, he) => G + (he.size_bytes || 0), 0));
  function re(G) {
    return Di(G, { currentVersion: _.value, targetModule: e.component });
  }
  const b = Ql({ props: e, hub: n, plan: T, activeSection: s, versionArg: S, requirementPayload: _t, invalidatePlan: O, refreshPlan: St, planCurrent: z }), {
    pendingSuggestions: I,
    pendingCount: L,
    acceptSuggestions: E,
    rejectSuggestions: J,
    editSuggestions: te,
    displayValue: oe,
    requirements: me,
    requirementGroups: Ae,
    rootRequirements: ge,
    transitiveRequirementCount: Ke,
    parameterValues: Re,
    editableRequirements: mt,
    missingRequirements: qe,
    boundRequirementCount: ht,
    autoFitCount: Mt,
    aiResolvableCount: Pt,
    aiResolving: Se,
    aiResolutionNotice: Gt,
    resolveRequirementsWithAI: nt,
    highlightTick: Ge,
    setParameter: bt,
    requirementValue: ot,
    requirementMissing: We,
    requirementReadOnly: Be,
    requirementOptions: Te,
    typeInvalidRequirements: $e,
    requirementTypeInvalid: Ze,
    requirementTypeHint: Ye,
    canAutoFitRequirement: Ft,
    autoFitRequirement: it,
    autoFitRequirements: Xe,
    loadInstalledParameterHints: He,
    applyPlan: Tt,
    resetRequirements: $,
    abortAI: x
  } = b, D = H("up"), U = H([]), Z = q(() => U.value.length > 0), Y = q({
    get: () => Z.value ? "up" : D.value,
    set: (G) => {
      D.value = G;
    }
  }), de = q(() => Z.value ? [Bn[0]] : Bn), ke = q(() => T.value?.migrations || []), st = q(() => T.value?.dependency?.id || T.value?.install_payload?.id || ""), Et = er({ props: e, hub: n, plan: T, planCurrent: z, versionArg: S }), {
    scan: fe,
    acknowledged: Ee,
    criticalConfirmed: at,
    softFindings: vt,
    unacknowledgedSoft: gt,
    acknowledge: ve,
    acknowledgeAllSoft: Me,
    resetScanForPlan: lt,
    runScanNow: Je,
    skipScan: on,
    cancelScan: Vt
  } = Et, Ct = q(() => {
    const G = N.value || Se.value ? { tone: "loading" } : L.value ? { tone: "warn", badge: String(L.value) } : qe.value.length || $e.value.length ? { tone: "danger", badge: String(qe.value.length + $e.value.length) } : me.value.length ? { tone: "ok" } : { tone: "none" }, he = {
      scanning: "loading",
      clean: "ok",
      warnings: "warn",
      critical: "danger",
      error: "danger",
      unavailable: "none",
      idle: "none",
      skipped: "none"
    }[fe.value.status] || "none";
    return {
      overview: { tone: "none" },
      modules: N.value ? { tone: "loading" } : T.value ? { tone: "none", badge: String(k.value) } : { tone: "none" },
      requirements: G,
      scan: { tone: he, badge: fe.value.findings.length ? String(fe.value.findings.length) : void 0 },
      review: ke.value.length ? { tone: "none", badge: String(ke.value.length) } : { tone: "none" }
    };
  }), Ve = H(!1), je = H(!1), yt = H(null), kt = H(null), we = H(null), rt = H(null), sn = q(() => Hn(yt.value || rt.value)), It = H(""), ut = H(0);
  let dt = null, Qe = null, ye = 0, et = 0, be = 0;
  function Wt() {
    It.value = "", ut.value = 0;
    const G = Date.now();
    dt = setInterval(() => {
      ut.value = Math.floor((Date.now() - G) / 1e3);
    }, 250);
    try {
      const he = Bi("keeper.hub", (pe) => {
        const xe = tr[nr(pe)];
        xe && (It.value = xe);
      });
      Qe = typeof he == "function" ? he : null;
    } catch {
      Qe = null;
    }
  }
  function Ce() {
    if (dt && (clearInterval(dt), dt = null), Qe) {
      try {
        Qe();
      } catch {
      }
      Qe = null;
    }
  }
  function _t() {
    const G = [], he = [];
    for (const pe of mt.value) {
      const xe = ue(pe);
      if (!xe) continue;
      const V = Re.value[xe], ae = typeof V == "string" ? V.trim() : V;
      if (ae == null || ae === "") continue;
      (On(pe, e.component) ? he : G).push({ name: xe, value: ae });
    }
    return {
      parameters: G.length ? G : void 0,
      requirement_bindings: he.length ? he : void 0
    };
  }
  function Dt(G, he) {
    const pe = Ho?.toast;
    typeof pe == "function" && pe({ severity: G === "ok" ? "success" : "error", summary: he });
  }
  async function xt(G) {
    if (!n || !e.component || !z.value || T.value?.applicable === !1 || L.value || Se.value) return;
    const he = ++be, pe = () => he === be && e.open;
    G ? je.value = !0 : Ve.value = !0, yt.value = null, we.value = null, kt.value = null, rt.value = null, G || Wt();
    let xe = !1;
    try {
      const V = await n.install({
        component: e.component,
        version: S(),
        id: e.mode === "update" && e.currentId ? e.currentId : void 0,
        dry_run: G || void 0,
        migration_policy: Y.value,
        ..._t()
      });
      if (!pe()) return;
      if (V.success !== !0) throw new Kt("INSTALL_INCOMPLETE", "Keeper does not confirm a successful install.", void 0, V);
      if (G || await Ri(n, U.value, {
        isCurrent: pe,
        onPhase: (ae) => {
          It.value = ae;
        }
      }), !pe()) return;
      if (yt.value = V, !G) {
        const ae = e.mode === "update" ? "updated" : "installed";
        Dt("ok", `Module ${ae}: ${V.dependency?.id || e.component}`), Jn(), xe = !0;
      }
    } catch (V) {
      if (!pe()) return;
      tt("install:run", V), V instanceof Kt && (we.value = V.code, rt.value = V.details), kt.value = ze(V, G ? "preview failed" : "install failed"), Dt("error", kt.value);
    } finally {
      he === be && (G ? je.value = !1 : (Ve.value = !1, Ce()));
    }
    xe && t("changed");
  }
  const Ie = q(() => !T.value || K.value ? "modules" : L.value || Se.value || qe.value.length || $e.value.length || !z.value || T.value.applicable === !1 || me.value.some((G) => G.invalid) ? "requirements" : fe.value.status === "idle" || fe.value.status === "scanning" || fe.value.status === "critical" && !at.value || gt.value.length ? "scan" : null), Rt = q(() => Ve.value || je.value || N.value || !T.value || !!K.value || !z.value || L.value > 0 || Se.value || fe.value.status === "scanning" || s.value === "scan" && fe.value.status === "idle"), Bt = q(() => {
    if (L.value) return `Review ${L.value} AI suggestion${L.value === 1 ? "" : "s"}`;
    if (Se.value) return "Resolving settings…";
    if (!z.value) return "Validating settings…";
    const G = qe.value.length;
    return G ? `${G} required setting${G === 1 ? "" : "s"} missing` : "Review requirement errors";
  }), Zt = q(() => Ve.value || je.value || N.value || !T.value || !!K.value || !z.value || L.value > 0 || Se.value), wt = q(() => Ve.value ? e.mode === "update" ? "Updating…" : "Installing…" : Ie.value === "scan" && fe.value.status === "idle" ? s.value === "scan" ? "Choose scan option" : "Review scan choice" : Ie.value === "scan" && s.value === "scan" && (fe.value.status === "warnings" || fe.value.status === "critical") ? "Install anyway" : e.mode === "update" ? "Update" : "Install");
  function Yt() {
    if (Rt.value) return;
    const G = Ie.value;
    if (G === "requirements") {
      s.value = "requirements", Ge.value++;
      return;
    }
    if (G === "scan") {
      if (s.value !== "scan") {
        s.value = "scan";
        return;
      }
      if (fe.value.status === "idle" || fe.value.status === "scanning" || fe.value.status === "critical" && !at.value || (Me(), Ie.value)) return;
    }
    if (G === "modules") {
      s.value = "modules";
      return;
    }
    xt(!1);
  }
  function Ot() {
    if (!z.value || T.value?.applicable === !1 || L.value || Se.value || me.value.some((G) => G.invalid) || qe.value.length || $e.value.length) {
      s.value = "requirements", Ge.value++;
      return;
    }
    s.value = "review", xt(!0);
  }
  async function St() {
    if (!n || !e.component) return;
    _e && (clearTimeout(_e), _e = null);
    const G = ++ye;
    z.value = !1, N.value = !0, K.value = null, j.value = null, M.value = null;
    const he = { ...Re.value };
    try {
      const pe = await n.planInstall({
        component: e.component,
        version: S(),
        id: e.mode === "update" && e.currentId ? e.currentId : void 0,
        run_migrations: Y.value === "up",
        ..._t()
      });
      if (G !== ye || !e.open) return;
      const xe = Vi(pe.requirements || []);
      U.value = xe, Tt(pe, he), z.value = !0, lt(pe.graph || []);
    } catch (pe) {
      if (G !== ye || !e.open) return;
      tt("install:plan", pe), T.value = null, fe.value = Qn(), K.value = ze(pe, "failed to plan install"), pe instanceof Kt && (j.value = pe.code, M.value = pe.details);
    } finally {
      G === ye && (N.value = !1);
    }
  }
  let _e = null;
  function O() {
    ye++, z.value = !1, x(), y();
  }
  function y() {
    _e && clearTimeout(_e), _e = setTimeout(() => {
      St();
    }, 350);
  }
  async function Ue() {
    if (f.value = [], !(!n || !e.component)) {
      g.value = !0;
      try {
        const G = await n.listVersions(e.component);
        f.value = G.items || [];
      } catch (G) {
        tt("install:versions", G);
      } finally {
        g.value = !1;
      }
    }
  }
  async function Vn() {
    if (F.value = "", !(!n || !e.component)) {
      B.value = !0;
      try {
        const G = await n.getReadme(e.component);
        F.value = G.content || "";
      } catch {
      } finally {
        B.value = !1;
      }
    }
  }
  function Dn() {
    ye++, s.value = "overview", T.value = null, z.value = !1, U.value = [], Ve.value = !1, je.value = !1, K.value = null, j.value = null, M.value = null, Y.value = "up", yt.value = null, kt.value = null, we.value = null, rt.value = null, $(), lt(), F.value = "", f.value = [];
  }
  async function In() {
    const G = ++et;
    Dn(), i.value = e.mode === "update" ? "" : e.version || "", r.value = "track", await Promise.all([Ue(), Vn(), He()]), !(!e.open || G !== et) && (e.mode === "update" && !i.value && f.value.length && (i.value = String(f.value[0].version || "")), await St());
  }
  Ne(() => e.open, (G) => {
    if (G) {
      In();
      return;
    }
    x(), Ce(), be++, Ve.value = !1, je.value = !1, et++, ye++, Vt(), _e && (clearTimeout(_e), _e = null);
  }, { immediate: !0 }), Ne([i, r], () => {
    e.open && n && O();
  }, { flush: "sync" }), Ne(Y, () => {
    e.open && n && T.value && O();
  }, { flush: "sync" }), no(() => {
    be++, x(), Ce(), et++, ye++, Vt(), _e && clearTimeout(_e);
  });
  function Ht() {
    x(), be++, Ve.value = !1, je.value = !1, Ce(), t("close");
  }
  return {
    // nav
    activeSection: s,
    sectionStatus: Ct,
    blockingSection: Ie,
    // version
    version: i,
    versionMode: r,
    versionOptions: v,
    versionsLoading: g,
    versionMeta: w,
    currentVersion: _,
    // overview
    readme: F,
    readmeLoading: B,
    // plan
    plan: T,
    planCurrent: z,
    planLoading: N,
    planError: K,
    planCode: j,
    planErrorDetails: M,
    directModules: R,
    transitiveModules: d,
    planTree: Q,
    planRows: p,
    moduleCount: k,
    totalSize: A,
    badgesForNode: re,
    // requirements
    requirements: me,
    requirementGroups: Ae,
    rootRequirements: ge,
    editableRequirements: mt,
    transitiveRequirementCount: Ke,
    parameterValues: Re,
    missingRequirements: qe,
    boundRequirementCount: ht,
    autoFitCount: Mt,
    aiResolvableCount: Pt,
    aiResolving: Se,
    aiResolutionNotice: Gt,
    resolveRequirementsWithAI: nt,
    pendingSuggestions: I,
    pendingCount: L,
    acceptSuggestions: E,
    rejectSuggestions: J,
    editSuggestions: te,
    displayValue: oe,
    highlightTick: Ge,
    setParameter: bt,
    requirementValue: ot,
    requirementMissing: We,
    requirementReadOnly: Be,
    requirementOptions: Te,
    requirementConfiguredBy: Ei,
    typeInvalidRequirements: $e,
    requirementTypeInvalid: Ze,
    requirementTypeHint: Ye,
    canAutoFitRequirement: Ft,
    autoFitRequirement: it,
    autoFitRequirements: Xe,
    // review / options
    requiredSetup: Z,
    migrationPolicy: Y,
    migrationOptions: de,
    migrations: ke,
    destinationId: st,
    INSTALL_MIGRATION_OPTIONS: Bn,
    // scan
    scan: fe,
    acknowledged: Ee,
    criticalConfirmed: at,
    softFindings: vt,
    unacknowledgedSoft: gt,
    acknowledge: ve,
    acknowledgeAllSoft: Me,
    runScanNow: Je,
    skipScan: on,
    // execution
    running: Ve,
    dryRunning: je,
    result: yt,
    resultError: kt,
    resultCode: we,
    resultErrorDetails: rt,
    resultExecution: sn,
    executionStepLabel: Do,
    progressPhase: It,
    elapsedSec: ut,
    requirementStatusMessage: Bt,
    primaryDisabled: Rt,
    previewDisabled: Zt,
    primaryLabel: wt,
    primaryAction: Yt,
    preview: Ot,
    refreshPlan: St,
    close: Ht
  };
}
const ir = { class: "km-2p-head-icon" }, sr = { class: "km-2p-head-text" }, ar = { class: "km-2p-head-title" }, lr = { class: "km-2p-head-sub" }, rr = { class: "km-dim km-mono" }, ur = { class: "km-2p" }, dr = {
  class: "km-2p-nav",
  "aria-label": "Install steps"
}, cr = ["onClick"], pr = { class: "km-2p-navlabel" }, fr = { class: "km-2p-navstatus" }, mr = {
  key: 2,
  class: "km-dot km-dot-danger",
  "aria-hidden": "true"
}, hr = {
  key: 3,
  class: "km-dot km-dot-warn",
  "aria-hidden": "true"
}, br = {
  key: 4,
  class: "km-navbadge"
}, vr = { class: "km-sec" }, gr = { class: "km-ov-hero" }, yr = { class: "km-ov-icon" }, kr = { class: "km-grow km-min0" }, wr = { class: "km-row-wrap" }, Sr = { class: "km-ov-name" }, $r = {
  key: 0,
  class: "badge-app kx-tag-caps"
}, Cr = {
  key: 1,
  class: "badge-warn kx-tag-caps"
}, Ir = { class: "km-ov-org km-mono" }, _r = {
  key: 0,
  class: "km-ov-desc"
}, xr = {
  key: 1,
  class: "km-hint"
}, Or = { class: "km-field" }, Lr = {
  class: "km-seg",
  role: "group",
  "aria-label": "Version mode"
}, zr = ["aria-pressed"], Ar = ["aria-pressed"], Mr = { class: "km-hint" }, Pr = { class: "km-ov-meta" }, Fr = { class: "km-meta-row" }, Tr = {
  key: 0,
  class: "km-meta-row"
}, Er = {
  key: 1,
  class: "km-meta-row"
}, Vr = ["title"], Dr = {
  key: 2,
  class: "km-meta-row"
}, Rr = {
  key: 3,
  class: "km-meta-row"
}, Br = {
  key: 4,
  class: "km-meta-row"
}, Hr = {
  key: 5,
  class: "km-meta-row"
}, jr = {
  key: 2,
  class: "km-loading"
}, Ur = {
  key: 3,
  class: "km-ov-readme"
}, Nr = { class: "km-sec" }, Kr = {
  key: 1,
  class: "km-msg km-msg-err"
}, qr = {
  key: 0,
  class: "km-code"
}, Gr = { class: "km-sec-title" }, Wr = {
  key: 0,
  class: "km-dim"
}, Zr = {
  key: 1,
  class: "km-tree-spacer",
  "aria-hidden": "true"
}, Yr = { class: "km-mrow-badge kx-tag-caps" }, Xr = { class: "km-mrow-name km-mono" }, Jr = {
  key: 2,
  class: "km-mrow-ver km-mono"
}, Qr = {
  key: 3,
  class: "km-dim km-mono"
}, eu = {
  key: 4,
  class: "km-dim"
}, tu = { class: "km-sec" }, nu = {
  key: 1,
  class: "km-empty-inline"
}, ou = { class: "km-sec-title" }, iu = { class: "km-dim" }, su = { class: "km-req-toolbar" }, au = {
  key: 0,
  class: "km-code"
}, lu = {
  key: 1,
  class: "km-code"
}, ru = {
  key: 2,
  class: "km-mono"
}, uu = {
  key: 1,
  class: "km-req-toolbar",
  role: "status"
}, du = { class: "km-grow" }, cu = { class: "km-req-group-head" }, pu = { class: "km-mono" }, fu = {
  key: 0,
  class: "km-dim"
}, mu = { class: "km-req-meta" }, hu = { class: "km-mono km-req-name" }, bu = {
  key: 0,
  class: "km-req-flag"
}, vu = {
  key: 1,
  class: "km-chip km-mono"
}, gu = ["aria-label", "disabled", "value", "list", "placeholder", "onInput"], yu = ["id"], ku = ["value", "title"], wu = {
  key: 1,
  class: "km-readonly-field km-mono"
}, Su = { class: "km-req-foot" }, $u = {
  key: 0,
  class: "km-req-src"
}, Cu = {
  key: 1,
  class: "km-req-invalid"
}, Iu = {
  key: 2,
  class: "km-req-invalid"
}, _u = {
  key: 3,
  class: "km-req-info"
}, xu = {
  key: 4,
  class: "km-req-info"
}, Ou = ["aria-label"], Lu = { class: "km-mono" }, zu = { class: "km-row-gap" }, Au = {
  key: 3,
  class: "km-msg km-msg-err",
  role: "alert"
}, Mu = { class: "km-code" }, Pu = { key: 0 }, Fu = {
  key: 4,
  class: "km-req-desc"
}, Tu = { class: "km-sec" }, Eu = { class: "km-sec-title" }, Vu = {
  key: 0,
  class: "km-scan-run"
}, Du = {
  key: 1,
  class: "km-msg km-msg-info"
}, Ru = {
  key: 2,
  class: "km-scan-run"
}, Bu = { class: "km-grow" }, Hu = {
  key: 3,
  class: "km-empty-inline"
}, ju = {
  key: 4,
  class: "km-msg km-msg-err"
}, Uu = {
  key: 5,
  class: "km-msg km-msg-info"
}, Nu = {
  key: 0,
  class: "km-scan-overall"
}, Ku = {
  key: 1,
  class: "km-msg km-msg-err"
}, qu = { class: "km-scan-mod-head" }, Gu = { class: "km-mono km-scan-mod-name" }, Wu = { class: "km-chip" }, Zu = {
  key: 0,
  class: "km-scan-mod-sum"
}, Yu = { class: "km-grow km-min0" }, Xu = { class: "km-finding-head" }, Ju = { class: "km-finding-title" }, Qu = {
  key: 0,
  class: "km-finding-detail"
}, ed = {
  key: 1,
  class: "km-finding-loc km-mono"
}, td = ["onClick"], nd = {
  key: 1,
  class: "km-dim km-scan-mod-clean"
}, od = {
  key: 2,
  class: "km-check km-mt"
}, id = { class: "km-sec" }, sd = { class: "km-sec-title" }, ad = { class: "km-review-grid" }, ld = { class: "km-review-tile" }, rd = { class: "km-review-tile" }, ud = { class: "km-review-tile" }, dd = { class: "km-review-tile" }, cd = { class: "km-field" }, pd = {
  key: 0,
  class: "km-hint"
}, fd = {
  key: 1,
  class: "km-mig-list"
}, md = { class: "km-mono km-trunc" }, hd = { class: "km-chip" }, bd = { class: "km-hint" }, vd = { class: "km-adv" }, gd = { class: "km-adv-body" }, yd = { class: "km-meta-row" }, kd = { class: "km-mono" }, wd = { class: "km-meta-row" }, Sd = { class: "km-mono" }, $d = {
  key: 0,
  class: "km-panel km-panel-ok"
}, Cd = { class: "km-panel-title" }, Id = {
  key: 0,
  class: "km-dim"
}, _d = {
  key: 1,
  class: "km-dim"
}, xd = {
  key: 0,
  class: "km-dim"
}, Od = {
  key: 1,
  class: "km-ledger"
}, Ld = { class: "km-ledger-step" }, zd = { class: "km-grow" }, Ad = { class: "km-chip" }, Md = {
  key: 0,
  class: "km-ledger-msg"
}, Pd = {
  key: 2,
  class: "km-msg km-msg-err"
}, Fd = {
  key: 0,
  class: "km-code"
}, Td = {
  key: 0,
  class: "km-running km-2p-progress"
}, Ed = { class: "km-grow km-running-label" }, Vd = { class: "km-dim" }, Dd = {
  key: 0,
  class: "km-foot-note"
}, Rd = /* @__PURE__ */ nn({
  __name: "InstallDialog",
  props: {
    open: { type: Boolean },
    mode: {},
    component: {},
    version: {},
    currentId: {},
    catalogItem: {},
    installedDep: {}
  },
  emits: ["close", "changed"],
  setup(e, { emit: t }) {
    const n = e, i = or(n, t), r = [
      { key: "overview", label: "Overview", icon: "tabler:info-circle" },
      { key: "modules", label: "Modules", icon: "tabler:hierarchy-2" },
      { key: "requirements", label: "Requirements", icon: "tabler:adjustments" },
      { key: "scan", label: "Security scan", icon: "tabler:shield-check" },
      { key: "review", label: "Review & install", icon: "tabler:checklist" }
    ], f = q(() => n.catalogItem || { full_name: n.component, component: n.component }), g = q(() => hn(f.value)), v = q(() => n.mode === "update" ? "Update module" : "Install module");
    function w(R) {
      const d = i.requirementOptions(R), Q = i.requirementValue(R);
      return Q && !d.some((p) => p.value === Q) ? [{ label: `${Q} (current)`, value: Q }, ...d] : d;
    }
    function S(R) {
      return `km-req-options-${ue(R).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    }
    function _(R) {
      return {
        provided: "you set this",
        provided_bare: "you set this",
        existing: "auto-detected",
        existing_bare: "auto-detected",
        default: "package default",
        registry: "from registry",
        conflict: "multiple candidates — pick one"
      }[String(R.value_source || "")] || "";
    }
    const F = H(null), B = H(!1);
    let T;
    no(() => clearTimeout(T)), Ne(() => i.highlightTick.value, async (R, d, Q) => {
      let p = !0;
      if (Q(() => {
        p = !1;
      }), i.activeSection.value !== "requirements" || (await fn(), !p)) return;
      F.value?.querySelector(".km-req.is-missing, .km-req.is-invalid")?.scrollIntoView({ block: "center", behavior: "smooth" }), B.value = !0, clearTimeout(T), T = setTimeout(() => {
        B.value = !1;
      }, 1200);
    });
    function N(R) {
      return xo[R.severity].tone;
    }
    function z(R) {
      return R === "critical" || R === "error" ? "km-dot-danger" : R === "warnings" ? "km-dot-warn" : "km-dot-ok";
    }
    function K(R) {
      return `km-plan-badge kx-tag-caps km-plan-badge-${R}`;
    }
    function j(R) {
      return R === "failed" || R === "rollback_failed" ? "km-ledger-bad" : R === "rolled_back" ? "km-ledger-warn" : "km-ledger-ok";
    }
    const M = q(() => i.progressPhase.value || (n.mode === "update" ? "Updating…" : "Installing…"));
    return oo(() => {
      Bo("wc-render-markdown", { timeoutMs: 8e3 }).catch(() => {
      });
    }), (R, d) => {
      const Q = Oe("wc-render-markdown");
      return a(), ce(Ol, {
        visible: e.open,
        busy: o(i).running.value || o(i).dryRunning.value,
        label: v.value,
        class: "km-dialog km-dialog-2p",
        "header-class": "km-modal-head km-2p-head",
        "content-class": "km-dialog-content km-dialog-content-2p",
        "footer-class": "km-modal-foot km-2p-foot",
        style: Nt({ "--accent": g.value }),
        onClose: d[19] || (d[19] = (p) => o(i).close())
      }, {
        header: ee(() => [
          l("span", ir, [
            m(o(C), {
              icon: o(tn)(f.value),
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          l("span", sr, [
            l("span", ar, c(v.value), 1),
            l("span", lr, [
              P(c(o(en)(f.value)) + " ", 1),
              l("span", rr, c(n.component), 1)
            ])
          ])
        ]),
        footer: ee(() => [
          o(i).running.value ? (a(), u("div", Td, [
            m(o(C), {
              icon: "tabler:loader-2",
              class: "km-i spin km-accent",
              "aria-hidden": "true"
            }),
            l("span", Ed, c(M.value), 1),
            l("span", Vd, c(o(i).elapsedSec.value) + "s", 1)
          ])) : (a(), u(X, { key: 1 }, [
            o(i).blockingSection.value === "requirements" ? (a(), u("span", Dd, [
              m(o(C), {
                icon: "tabler:alert-triangle",
                class: "km-i-sm",
                "aria-hidden": "true"
              }),
              P(" " + c(o(i).requirementStatusMessage.value), 1)
            ])) : h("", !0),
            o(i).blockingSection.value === "requirements" ? (a(), ce(o(le), {
              key: 1,
              size: "small",
              severity: "secondary",
              outlined: "",
              disabled: o(i).autoFitCount.value === 0,
              onClick: d[15] || (d[15] = (p) => o(i).autoFitRequirements())
            }, {
              default: ee(() => [
                m(o(C), {
                  icon: "tabler:wand",
                  class: "km-i",
                  "aria-hidden": "true"
                }),
                d[75] || (d[75] = P(" Auto-fit ", -1))
              ]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            d[78] || (d[78] = l("span", { class: "km-grow" }, null, -1)),
            m(o(le), {
              size: "small",
              severity: "secondary",
              text: "",
              onClick: d[16] || (d[16] = (p) => o(i).close())
            }, {
              default: ee(() => [...d[76] || (d[76] = [
                P("Cancel", -1)
              ])]),
              _: 1
            }),
            m(o(le), {
              size: "small",
              severity: "secondary",
              outlined: "",
              disabled: o(i).previewDisabled.value,
              onClick: d[17] || (d[17] = (p) => o(i).preview())
            }, {
              default: ee(() => [
                m(o(C), {
                  icon: o(i).dryRunning.value ? "tabler:loader-2" : "tabler:eye",
                  class: ne(["km-i", o(i).dryRunning.value && "spin"]),
                  "aria-hidden": "true"
                }, null, 8, ["icon", "class"]),
                d[77] || (d[77] = P(" Preview changes ", -1))
              ]),
              _: 1
            }, 8, ["disabled"]),
            m(o(le), {
              size: "small",
              disabled: o(i).primaryDisabled.value,
              onClick: d[18] || (d[18] = (p) => o(i).primaryAction())
            }, {
              default: ee(() => [
                m(o(C), {
                  icon: n.mode === "update" ? "tabler:refresh-dot" : "tabler:download",
                  class: "km-i",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                P(" " + c(o(i).primaryLabel.value), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ], 64))
        ]),
        default: ee(() => [
          l("div", ur, [
            l("nav", dr, [
              (a(), u(X, null, se(r, (p) => l("button", {
                key: p.key,
                class: ne(["km-2p-navitem", { active: o(i).activeSection.value === p.key }]),
                onClick: (k) => o(i).activeSection.value = p.key
              }, [
                m(o(C), {
                  icon: p.icon,
                  class: "km-i",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                l("span", pr, c(p.label), 1),
                l("span", fr, [
                  o(i).sectionStatus.value[p.key].tone === "loading" ? (a(), ce(o(C), {
                    key: 0,
                    icon: "tabler:loader-2",
                    class: "km-i-sm spin km-dim",
                    "aria-hidden": "true"
                  })) : o(i).sectionStatus.value[p.key].tone === "ok" ? (a(), ce(o(C), {
                    key: 1,
                    icon: "tabler:circle-check-filled",
                    class: "km-i-sm km-sev-ok-fg",
                    "aria-hidden": "true"
                  })) : o(i).sectionStatus.value[p.key].tone === "danger" ? (a(), u("span", mr)) : o(i).sectionStatus.value[p.key].tone === "warn" ? (a(), u("span", hr)) : h("", !0),
                  o(i).sectionStatus.value[p.key].badge ? (a(), u("span", br, c(o(i).sectionStatus.value[p.key].badge), 1)) : h("", !0)
                ])
              ], 10, cr)), 64))
            ]),
            l("div", {
              ref_key: "mainRef",
              ref: F,
              class: "km-2p-main"
            }, [
              De(l("section", vr, [
                l("div", gr, [
                  l("span", yr, [
                    m(o(C), {
                      icon: o(tn)(f.value),
                      class: "km-i-lg",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"])
                  ]),
                  l("div", kr, [
                    l("div", wr, [
                      l("span", Sr, c(o(en)(f.value)), 1),
                      o(dn)(f.value) ? (a(), u("span", $r, "app")) : h("", !0),
                      f.value.deprecated ? (a(), u("span", Cr, "deprecated")) : h("", !0)
                    ]),
                    l("div", Ir, c(n.component), 1)
                  ])
                ]),
                f.value.description ? (a(), u("p", _r, c(f.value.description), 1)) : h("", !0),
                n.mode === "update" && !n.currentId ? (a(), u("p", xr, " Updating this module creates an application root dependency for the selected version. This version also applies to modules that depend on it; the plan shows any conflicts. ")) : h("", !0),
                l("div", Or, [
                  d[21] || (d[21] = l("label", { class: "km-label" }, "Version", -1)),
                  m(_o, {
                    modelValue: o(i).version.value,
                    "onUpdate:modelValue": d[0] || (d[0] = (p) => o(i).version.value = p),
                    items: o(i).versionOptions.value.map((p) => ({ id: p.value, title: p.label })),
                    placeholder: "latest",
                    "aria-label": "Version"
                  }, null, 8, ["modelValue", "items"]),
                  l("div", Lr, [
                    l("button", {
                      class: ne(["km-seg-btn", { active: o(i).versionMode.value === "pin" }]),
                      "aria-pressed": o(i).versionMode.value === "pin",
                      onClick: d[1] || (d[1] = (p) => o(i).versionMode.value = "pin")
                    }, [
                      m(o(C), {
                        icon: "tabler:pin",
                        class: "km-i-sm",
                        "aria-hidden": "true"
                      }),
                      P(" Pin " + c(o(i).version.value || "latest"), 1)
                    ], 10, zr),
                    l("button", {
                      class: ne(["km-seg-btn", { active: o(i).versionMode.value === "track" }]),
                      "aria-pressed": o(i).versionMode.value === "track",
                      onClick: d[2] || (d[2] = (p) => o(i).versionMode.value = "track")
                    }, [
                      m(o(C), {
                        icon: "tabler:arrow-up-circle",
                        class: "km-i-sm",
                        "aria-hidden": "true"
                      }),
                      d[20] || (d[20] = P(" Track updates ", -1))
                    ], 10, Ar)
                  ]),
                  l("p", Mr, c(o(i).versionMode.value === "pin" ? "Locks to this exact version; future updates are manual." : `Tracks ${o(i).version.value ? "≥ " + o(i).version.value : "all"} releases on the next resolve.`), 1)
                ]),
                l("div", Pr, [
                  l("div", Fr, [
                    m(o(C), {
                      icon: "tabler:download",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    d[22] || (d[22] = l("span", null, "Downloads", -1)),
                    l("b", null, c(o(bn)(f.value.total_downloads)), 1)
                  ]),
                  f.value.favorites_count ? (a(), u("div", Tr, [
                    m(o(C), {
                      icon: "tabler:star",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    d[23] || (d[23] = l("span", null, "Favorites", -1)),
                    l("b", null, c(f.value.favorites_count), 1)
                  ])) : h("", !0),
                  f.value.license ? (a(), u("div", Er, [
                    m(o(C), {
                      icon: "tabler:license",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    d[24] || (d[24] = l("span", null, "License", -1)),
                    l("b", {
                      title: f.value.license
                    }, c(o(Fn)(f.value.license)), 9, Vr)
                  ])) : h("", !0),
                  f.value.type ? (a(), u("div", Dr, [
                    m(o(C), {
                      icon: "tabler:category",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    d[25] || (d[25] = l("span", null, "Type", -1)),
                    l("b", null, c(f.value.type), 1)
                  ])) : h("", !0),
                  o(i).versionMeta.value?.entry_count ? (a(), u("div", Rr, [
                    m(o(C), {
                      icon: "tabler:list-numbers",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    d[26] || (d[26] = l("span", null, "Entries", -1)),
                    l("b", null, c(o(i).versionMeta.value.entry_count), 1)
                  ])) : h("", !0),
                  o(i).versionMeta.value?.size_bytes ? (a(), u("div", Br, [
                    m(o(C), {
                      icon: "tabler:weight",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    d[27] || (d[27] = l("span", null, "Size", -1)),
                    l("b", null, c(o(cn)(o(i).versionMeta.value.size_bytes)), 1)
                  ])) : h("", !0),
                  f.value.update_time ? (a(), u("div", Hr, [
                    m(o(C), {
                      icon: "tabler:clock",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    d[28] || (d[28] = l("span", null, "Updated", -1)),
                    l("b", null, c(o(Tn)(f.value.update_time, { maxUnit: "year" })), 1)
                  ])) : h("", !0)
                ]),
                o(i).readmeLoading.value ? (a(), u("div", jr, [
                  m(o(C), {
                    icon: "tabler:loader-2",
                    class: "km-i spin",
                    "aria-hidden": "true"
                  }),
                  d[29] || (d[29] = P(" Loading README…", -1))
                ])) : o(i).readme.value ? (a(), u("article", Ur, [
                  m(Q, {
                    source: o(i).readme.value
                  }, null, 8, ["source"])
                ])) : h("", !0)
              ], 512), [
                [rn, o(i).activeSection.value === "overview"]
              ]),
              De(l("section", Nr, [
                o(i).planLoading.value ? (a(), u(X, { key: 0 }, [
                  d[30] || (d[30] = l("div", {
                    class: "km-skel km-skel-line",
                    style: { width: "40%" }
                  }, null, -1)),
                  (a(), u(X, null, se(4, (p) => l("div", {
                    class: "km-skel km-skel-card",
                    key: p
                  })), 64))
                ], 64)) : o(i).planError.value ? (a(), u("div", Kr, [
                  o(i).planCode.value ? (a(), u("span", qr, c(o(i).planCode.value), 1)) : h("", !0),
                  P(c(o(i).planError.value), 1)
                ])) : o(i).plan.value ? (a(), u(X, { key: 2 }, [
                  l("div", Gr, [
                    m(o(C), {
                      icon: "tabler:hierarchy-2",
                      class: "km-i km-accent",
                      "aria-hidden": "true"
                    }),
                    P(" Installs " + c(o(i).moduleCount.value) + " module" + c(o(i).moduleCount.value === 1 ? "" : "s") + " ", 1),
                    o(i).totalSize.value ? (a(), u("span", Wr, "· " + c(o(cn)(o(i).totalSize.value)), 1)) : h("", !0)
                  ]),
                  d[32] || (d[32] = l("p", { class: "km-hint" }, "Includes these dependencies at the versions shown.", -1)),
                  (a(!0), u(X, null, se(o(i).planRows.value, (p) => (a(), u("div", {
                    key: p.path || p.module,
                    class: ne(["km-mrow", { "km-mrow-direct": p.direct || p.module === n.component, "km-mrow-transitive": !(p.direct || p.module === n.component) }]),
                    style: Nt({ "--tree-level": p.level })
                  }, [
                    p.level > 0 ? (a(), ce(o(C), {
                      key: 0,
                      icon: "tabler:corner-down-right",
                      class: "km-i-sm km-dim",
                      "aria-hidden": "true"
                    })) : (a(), u("span", Zr)),
                    l("span", Yr, c(p.direct || p.module === n.component ? "direct" : "transitive"), 1),
                    l("span", Xr, c(p.module), 1),
                    p.version ? (a(), u("span", Jr, c(p.version), 1)) : h("", !0),
                    p.constraint ? (a(), u("span", Qr, c(p.constraint), 1)) : h("", !0),
                    d[31] || (d[31] = l("span", { class: "km-grow" }, null, -1)),
                    (a(!0), u(X, null, se(o(i).badgesForNode(p), (k) => (a(), u("span", {
                      key: k.label,
                      class: ne(K(k.tone))
                    }, c(k.label), 3))), 128)),
                    p.size_bytes ? (a(), u("span", eu, c(o(cn)(p.size_bytes)), 1)) : h("", !0)
                  ], 6))), 128))
                ], 64)) : h("", !0)
              ], 512), [
                [rn, o(i).activeSection.value === "modules"]
              ]),
              De(l("section", tu, [
                o(i).planLoading.value ? (a(), u(X, { key: 0 }, [
                  d[33] || (d[33] = l("div", {
                    class: "km-skel km-skel-line",
                    style: { width: "30%" }
                  }, null, -1)),
                  (a(), u(X, null, se(3, (p) => l("div", {
                    class: "km-skel km-skel-field",
                    key: p
                  })), 64))
                ], 64)) : o(i).requirements.value.length ? (a(), u(X, { key: 2 }, [
                  l("div", ou, [
                    m(o(C), {
                      icon: "tabler:adjustments",
                      class: "km-i km-accent",
                      "aria-hidden": "true"
                    }),
                    d[35] || (d[35] = P(" Configuration ", -1)),
                    l("span", iu, "(" + c(o(i).boundRequirementCount.value) + "/" + c(o(i).requirements.value.length) + " set)", 1)
                  ]),
                  l("div", su, [
                    d[37] || (d[37] = l("p", { class: "km-hint km-grow" }, "Connect required resources. Resources already configured by a dependency are shown for review.", -1)),
                    o(i).aiResolvableCount.value ? (a(), ce(o(le), {
                      key: 0,
                      size: "small",
                      severity: "secondary",
                      outlined: "",
                      disabled: o(i).aiResolving.value || !o(i).planCurrent.value,
                      onClick: d[3] || (d[3] = (p) => o(i).resolveRequirementsWithAI(F.value))
                    }, {
                      default: ee(() => [
                        m(o(C), {
                          icon: o(i).aiResolving.value ? "tabler:loader-2" : "tabler:sparkles",
                          class: ne(["km-i", o(i).aiResolving.value && "spin"]),
                          "aria-hidden": "true"
                        }, null, 8, ["icon", "class"]),
                        P(" " + c(o(i).aiResolving.value ? "Resolving…" : "Resolve with AI"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])) : h("", !0),
                    o(i).missingRequirements.value.length ? (a(), ce(o(le), {
                      key: 1,
                      size: "small",
                      severity: "secondary",
                      outlined: "",
                      disabled: o(i).autoFitCount.value === 0,
                      onClick: d[4] || (d[4] = (p) => o(i).autoFitRequirements())
                    }, {
                      default: ee(() => [
                        m(o(C), {
                          icon: "tabler:wand",
                          class: "km-i",
                          "aria-hidden": "true"
                        }),
                        d[36] || (d[36] = P(" Auto-fit ", -1))
                      ]),
                      _: 1
                    }, 8, ["disabled"])) : h("", !0)
                  ]),
                  o(i).aiResolutionNotice.value ? (a(), u("div", {
                    key: 0,
                    class: ne(["km-msg", o(i).aiResolutionNotice.value.tone === "success" ? "km-msg-ok" : "km-msg-warn"]),
                    role: "status"
                  }, [
                    o(i).aiResolutionNotice.value.code ? (a(), u("span", au, c(o(i).aiResolutionNotice.value.code), 1)) : h("", !0),
                    o(i).aiResolutionNotice.value.kind ? (a(), u("span", lu, c(o(i).aiResolutionNotice.value.kind), 1)) : h("", !0),
                    P(" " + c(o(i).aiResolutionNotice.value.message) + " ", 1),
                    o(i).aiResolutionNotice.value.details ? (a(), u("pre", ru, c(JSON.stringify(o(i).aiResolutionNotice.value.details, null, 2)), 1)) : h("", !0)
                  ], 2)) : h("", !0),
                  o(i).pendingCount.value ? (a(), u("div", uu, [
                    l("span", du, "Review " + c(o(i).pendingCount.value) + " AI suggestion" + c(o(i).pendingCount.value === 1 ? "" : "s") + " before applying.", 1),
                    m(o(le), {
                      size: "small",
                      disabled: !o(i).planCurrent.value,
                      onClick: d[5] || (d[5] = (p) => o(i).acceptSuggestions(Object.keys(o(i).pendingSuggestions.value)))
                    }, {
                      default: ee(() => [...d[38] || (d[38] = [
                        P("Accept all", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled"]),
                    m(o(le), {
                      size: "small",
                      severity: "secondary",
                      onClick: d[6] || (d[6] = (p) => o(i).rejectSuggestions(Object.keys(o(i).pendingSuggestions.value)))
                    }, {
                      default: ee(() => [...d[39] || (d[39] = [
                        P("Reject all", -1)
                      ])]),
                      _: 1
                    }),
                    m(o(le), {
                      size: "small",
                      severity: "secondary",
                      disabled: !o(i).planCurrent.value,
                      onClick: d[7] || (d[7] = (p) => o(i).editSuggestions(Object.keys(o(i).pendingSuggestions.value)))
                    }, {
                      default: ee(() => [...d[40] || (d[40] = [
                        P("Edit all", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled"])
                  ])) : h("", !0),
                  (a(!0), u(X, null, se(o(i).requirementGroups.value, (p) => (a(), u("div", {
                    key: p.module,
                    class: "km-req-group"
                  }, [
                    l("div", cu, [
                      m(o(C), {
                        icon: p.direct ? "tabler:package" : "tabler:corner-down-right",
                        class: "km-i-sm",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"]),
                      l("span", pu, c(p.module), 1),
                      p.direct ? h("", !0) : (a(), u("span", fu, "dependency"))
                    ]),
                    (a(!0), u(X, null, se(p.items, (k) => (a(), u("div", {
                      key: o(ue)(k),
                      class: ne(["km-req", { "is-missing": o(i).requirementMissing(k), "is-invalid": o(i).requirementTypeInvalid(k), "is-flash": B.value && (o(i).requirementMissing(k) || o(i).requirementTypeInvalid(k)) }])
                    }, [
                      l("div", mu, [
                        l("span", hu, c(k.name || o(ue)(k)), 1),
                        k.required || k.missing ? (a(), u("span", bu, "required")) : h("", !0),
                        k.expected_kind ? (a(), u("span", vu, c(k.expected_kind), 1)) : h("", !0),
                        d[42] || (d[42] = l("span", { class: "km-grow" }, null, -1)),
                        o(i).requirementMissing(k) && o(i).canAutoFitRequirement(k) ? (a(), ce(o(le), {
                          key: 2,
                          size: "small",
                          severity: "secondary",
                          outlined: "",
                          class: "km-req-fit",
                          onClick: (A) => o(i).autoFitRequirement(k)
                        }, {
                          default: ee(() => [
                            m(o(C), {
                              icon: "tabler:wand",
                              class: "km-i-sm",
                              "aria-hidden": "true"
                            }),
                            d[41] || (d[41] = P(" Auto-fit ", -1))
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : h("", !0)
                      ]),
                      o(i).requirementReadOnly(k) ? (a(), u("div", wu, c(o(i).requirementValue(k) || o(i).displayValue(k.default) || "not set"), 1)) : (a(), u(X, { key: 0 }, [
                        l("input", {
                          class: "km-input km-w-full",
                          "aria-label": k.name || o(ue)(k),
                          disabled: o(i).running.value || o(i).dryRunning.value,
                          value: o(i).requirementValue(k),
                          list: w(k).length ? S(k) : void 0,
                          placeholder: o(i).displayValue(k.default) || (k.expected_kind ? `Enter ${k.expected_kind} id` : "Enter registry id or value"),
                          onInput: (A) => o(i).setParameter(k, A.target.value)
                        }, null, 40, gu),
                        w(k).length ? (a(), u("datalist", {
                          key: 0,
                          id: S(k)
                        }, [
                          (a(!0), u(X, null, se(w(k), (A) => (a(), u("option", {
                            key: A.value,
                            value: A.value,
                            title: A.title
                          }, c(A.label), 9, ku))), 128))
                        ], 8, yu)) : h("", !0)
                      ], 64)),
                      l("div", Su, [
                        _(k) ? (a(), u("span", $u, [
                          m(o(C), {
                            icon: "tabler:wand",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(_(k)), 1)
                        ])) : h("", !0),
                        o(i).requirementTypeInvalid(k) ? (a(), u("span", Cu, [
                          m(o(C), {
                            icon: "tabler:alert-triangle",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(o(i).requirementTypeHint(k)), 1)
                        ])) : k.invalid ? (a(), u("span", Iu, [
                          m(o(C), {
                            icon: "tabler:alert-triangle",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(k.invalid_reason || "invalid value"), 1)
                        ])) : h("", !0),
                        o(i).requirementMissing(k) && !o(i).canAutoFitRequirement(k) ? (a(), u("span", _u, [
                          m(o(C), {
                            icon: "tabler:hand-click",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          d[43] || (d[43] = P(" choose a value to continue ", -1))
                        ])) : h("", !0),
                        o(i).requirementReadOnly(k) ? (a(), u("span", xu, [
                          m(o(C), {
                            icon: "tabler:lock",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" configured by " + c(o(i).requirementConfiguredBy(k)) + "; install it directly to override ", 1)
                        ])) : h("", !0)
                      ]),
                      o(i).pendingSuggestions.value[o(ue)(k)] ? (a(), u("div", {
                        key: 2,
                        class: "km-ai-proposal",
                        role: "group",
                        "aria-label": `AI suggestion for ${k.name || o(ue)(k)}`
                      }, [
                        l("div", Lu, "Suggested value: " + c(o(i).displayValue(o(i).pendingSuggestions.value[o(ue)(k)].value)), 1),
                        l("p", null, c(o(i).pendingSuggestions.value[o(ue)(k)].choice_reason), 1),
                        l("div", zu, [
                          m(o(le), {
                            size: "small",
                            disabled: !o(i).planCurrent.value,
                            onClick: (A) => o(i).acceptSuggestions([o(ue)(k)])
                          }, {
                            default: ee(() => [...d[44] || (d[44] = [
                              P("Accept", -1)
                            ])]),
                            _: 1
                          }, 8, ["disabled", "onClick"]),
                          m(o(le), {
                            size: "small",
                            severity: "secondary",
                            onClick: (A) => o(i).rejectSuggestions([o(ue)(k)])
                          }, {
                            default: ee(() => [...d[45] || (d[45] = [
                              P("Reject", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick"]),
                          m(o(le), {
                            size: "small",
                            severity: "secondary",
                            onClick: (A) => o(i).editSuggestions([o(ue)(k)])
                          }, {
                            default: ee(() => [...d[46] || (d[46] = [
                              P("Edit", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ], 8, Ou)) : h("", !0),
                      k.resolution_error ? (a(), u("div", Au, [
                        l("span", Mu, c(k.resolution_error.kind || k.resolution_error.code), 1),
                        P(" " + c(k.resolution_error.message) + " ", 1),
                        k.resolution_error.details ? (a(), u("pre", Pu, c(JSON.stringify(k.resolution_error.details, null, 2)), 1)) : h("", !0)
                      ])) : h("", !0),
                      k.description ? (a(), u("div", Fu, c(k.description), 1)) : h("", !0)
                    ], 2))), 128))
                  ]))), 128))
                ], 64)) : (a(), u("div", nu, [
                  m(o(C), {
                    icon: "tabler:circle-check",
                    class: "km-i-lg km-sev-ok-fg",
                    "aria-hidden": "true"
                  }),
                  d[34] || (d[34] = l("p", null, "Nothing to configure — this module needs no additional resources.", -1))
                ]))
              ], 512), [
                [rn, o(i).activeSection.value === "requirements"]
              ]),
              De(l("section", Tu, [
                l("div", Eu, [
                  m(o(C), {
                    icon: "tabler:shield-check",
                    class: "km-i km-accent",
                    "aria-hidden": "true"
                  }),
                  d[47] || (d[47] = P(" Security scan", -1))
                ]),
                d[60] || (d[60] = l("p", { class: "km-hint" }, "An agent reviews the code of every module being installed. Heuristic, not a guarantee — review flagged items before proceeding.", -1)),
                o(i).scan.value.status === "idle" ? (a(), u("div", Vu, [
                  m(o(C), {
                    icon: "tabler:shield-question",
                    class: "km-i km-accent",
                    "aria-hidden": "true"
                  }),
                  d[50] || (d[50] = l("span", { class: "km-grow" }, "Security scan not run. Running the reviewer may spend LLM tokens.", -1)),
                  m(o(le), {
                    size: "small",
                    severity: "secondary",
                    outlined: "",
                    onClick: d[8] || (d[8] = (p) => o(i).skipScan())
                  }, {
                    default: ee(() => [
                      m(o(C), {
                        icon: "tabler:player-skip-forward",
                        class: "km-i",
                        "aria-hidden": "true"
                      }),
                      d[48] || (d[48] = P(" Skip scan ", -1))
                    ]),
                    _: 1
                  }),
                  m(o(le), {
                    size: "small",
                    disabled: !o(i).planCurrent.value,
                    onClick: d[9] || (d[9] = (p) => o(i).runScanNow())
                  }, {
                    default: ee(() => [
                      m(o(C), {
                        icon: "tabler:shield-check",
                        class: "km-i",
                        "aria-hidden": "true"
                      }),
                      d[49] || (d[49] = P(" Run scan ", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])) : o(i).scan.value.status === "skipped" ? (a(), u("div", Du, [
                  m(o(C), {
                    icon: "tabler:shield-off",
                    class: "km-i",
                    "aria-hidden": "true"
                  }),
                  d[52] || (d[52] = P(" Security scan skipped. Install can continue without spending reviewer tokens. ", -1)),
                  m(o(le), {
                    size: "small",
                    severity: "secondary",
                    outlined: "",
                    class: "km-mt",
                    disabled: !o(i).planCurrent.value,
                    onClick: d[10] || (d[10] = (p) => o(i).runScanNow())
                  }, {
                    default: ee(() => [
                      m(o(C), {
                        icon: "tabler:shield-check",
                        class: "km-i",
                        "aria-hidden": "true"
                      }),
                      d[51] || (d[51] = P(" Run scan", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])) : o(i).scan.value.status === "scanning" ? (a(), u("div", Ru, [
                  m(o(C), {
                    icon: "tabler:loader-2",
                    class: "km-i spin km-accent",
                    "aria-hidden": "true"
                  }),
                  l("span", Bu, [
                    P("Scanning " + c(o(i).scan.value.total || "") + " module" + c(o(i).scan.value.total === 1 ? "" : "s") + "… ", 1),
                    d[53] || (d[53] = l("span", { class: "km-dim" }, "this can take a moment", -1))
                  ])
                ])) : o(i).scan.value.status === "clean" ? (a(), u("div", Hu, [
                  m(o(C), {
                    icon: "tabler:shield-check-filled",
                    class: "km-i-lg km-sev-ok-fg",
                    "aria-hidden": "true"
                  }),
                  l("p", null, "No issues found across " + c(o(i).scan.value.scanned) + " module" + c(o(i).scan.value.scanned === 1 ? "" : "s") + ".", 1)
                ])) : o(i).scan.value.status === "error" ? (a(), u("div", ju, [
                  P(" Scan failed: " + c(o(i).scan.value.error) + " ", 1),
                  m(o(le), {
                    size: "small",
                    severity: "secondary",
                    outlined: "",
                    class: "km-mt",
                    disabled: !o(i).planCurrent.value,
                    onClick: d[11] || (d[11] = (p) => o(i).runScanNow())
                  }, {
                    default: ee(() => [
                      m(o(C), {
                        icon: "tabler:refresh",
                        class: "km-i",
                        "aria-hidden": "true"
                      }),
                      d[54] || (d[54] = P(" Retry", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])) : o(i).scan.value.status === "unavailable" ? (a(), u("div", Uu, [
                  m(o(C), {
                    icon: "tabler:shield-off",
                    class: "km-i",
                    "aria-hidden": "true"
                  }),
                  d[56] || (d[56] = P(" Security scan unavailable ", -1)),
                  m(o(le), {
                    size: "small",
                    severity: "secondary",
                    outlined: "",
                    class: "km-mt",
                    disabled: !o(i).planCurrent.value,
                    onClick: d[12] || (d[12] = (p) => o(i).runScanNow())
                  }, {
                    default: ee(() => [
                      m(o(C), {
                        icon: "tabler:refresh",
                        class: "km-i",
                        "aria-hidden": "true"
                      }),
                      d[55] || (d[55] = P(" Retry", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])) : (a(), u(X, { key: 6 }, [
                  o(i).scan.value.summary ? (a(), u("p", Nu, c(o(i).scan.value.summary), 1)) : h("", !0),
                  o(i).scan.value.status === "critical" ? (a(), u("div", Ku, [
                    m(o(C), {
                      icon: "tabler:shield-x",
                      class: "km-i",
                      "aria-hidden": "true"
                    }),
                    d[57] || (d[57] = P(" Critical findings must be reviewed and confirmed before install.", -1))
                  ])) : h("", !0),
                  (a(!0), u(X, null, se(o(i).scan.value.modules, (p) => (a(), u("div", {
                    key: p.module,
                    class: "km-scan-mod"
                  }, [
                    l("div", qu, [
                      l("span", {
                        class: ne(["km-dot", z(p.status)]),
                        "aria-hidden": "true"
                      }, null, 2),
                      l("span", Gu, [
                        P(c(p.module), 1),
                        p.version ? (a(), u(X, { key: 0 }, [
                          P("@" + c(p.version), 1)
                        ], 64)) : h("", !0)
                      ]),
                      d[58] || (d[58] = l("span", { class: "km-grow" }, null, -1)),
                      l("span", Wu, c(p.status), 1)
                    ]),
                    p.summary ? (a(), u("p", Zu, c(p.summary), 1)) : h("", !0),
                    (a(!0), u(X, null, se(p.findings, (k) => (a(), u("div", {
                      key: k.id,
                      class: ne(["km-finding", `km-sev-${N(k)}`])
                    }, [
                      m(o(C), {
                        icon: o(xo)[k.severity].icon,
                        class: "km-i km-finding-icon",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"]),
                      l("div", Yu, [
                        l("div", Xu, [
                          l("span", Ju, c(k.title), 1)
                        ]),
                        k.detail ? (a(), u("div", Qu, c(k.detail), 1)) : h("", !0),
                        k.location ? (a(), u("div", ed, c(k.location), 1)) : h("", !0),
                        k.severity !== "critical" ? (a(), u("button", {
                          key: 2,
                          class: ne(["km-ack", { done: o(i).acknowledged.value.has(k.id) }]),
                          onClick: (A) => o(i).acknowledge(k)
                        }, [
                          m(o(C), {
                            icon: o(i).acknowledged.value.has(k.id) ? "tabler:check" : "tabler:eye",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          P(" " + c(o(i).acknowledged.value.has(k.id) ? "Acknowledged" : "Acknowledge"), 1)
                        ], 10, td)) : h("", !0)
                      ])
                    ], 2))), 128)),
                    p.findings.length ? h("", !0) : (a(), u("p", nd, "No issues in this module."))
                  ]))), 128)),
                  o(i).scan.value.status === "critical" ? (a(), u("label", od, [
                    De(l("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": d[13] || (d[13] = (p) => o(i).criticalConfirmed.value = p)
                    }, null, 512), [
                      [_i, o(i).criticalConfirmed.value]
                    ]),
                    d[59] || (d[59] = l("span", null, "I understand the critical findings and want to install anyway.", -1))
                  ])) : h("", !0)
                ], 64))
              ], 512), [
                [rn, o(i).activeSection.value === "scan"]
              ]),
              De(l("section", id, [
                l("div", sd, [
                  m(o(C), {
                    icon: "tabler:checklist",
                    class: "km-i km-accent",
                    "aria-hidden": "true"
                  }),
                  d[61] || (d[61] = P(" Review & install", -1))
                ]),
                l("div", ad, [
                  l("div", ld, [
                    m(o(C), {
                      icon: "tabler:package",
                      class: "km-i km-accent",
                      "aria-hidden": "true"
                    }),
                    l("b", null, c(o(i).moduleCount.value), 1),
                    d[62] || (d[62] = l("span", null, "modules", -1))
                  ]),
                  l("div", rd, [
                    m(o(C), {
                      icon: "tabler:adjustments",
                      class: "km-i km-accent",
                      "aria-hidden": "true"
                    }),
                    l("b", null, c(o(i).boundRequirementCount.value) + "/" + c(o(i).requirements.value.length), 1),
                    d[63] || (d[63] = l("span", null, "configured", -1))
                  ]),
                  l("div", ud, [
                    m(o(C), {
                      icon: "tabler:database",
                      class: "km-i km-accent",
                      "aria-hidden": "true"
                    }),
                    l("b", null, c(o(i).migrations.value.length), 1),
                    d[64] || (d[64] = l("span", null, "migrations", -1))
                  ]),
                  l("div", dd, [
                    m(o(C), {
                      icon: o(i).scan.value.status === "clean" ? "tabler:shield-check" : o(i).scan.value.status === "critical" ? "tabler:shield-x" : o(i).scan.value.status === "skipped" ? "tabler:shield-off" : "tabler:shield",
                      class: "km-i km-accent",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    l("b", null, c(o(i).scan.value.status === "scanning" ? "…" : o(i).scan.value.status === "skipped" || o(i).scan.value.status === "idle" ? "—" : o(i).scan.value.findings.length), 1),
                    d[65] || (d[65] = l("span", null, "scan findings", -1))
                  ])
                ]),
                l("div", cd, [
                  d[68] || (d[68] = l("label", { class: "km-label" }, "Migration policy", -1)),
                  m(_o, {
                    modelValue: o(i).migrationPolicy.value,
                    "onUpdate:modelValue": d[14] || (d[14] = (p) => o(i).migrationPolicy.value = p),
                    items: o(i).migrationOptions.value.map((p) => ({ id: p.value, title: p.label })),
                    "aria-label": "Migration policy"
                  }, null, 8, ["modelValue", "items"]),
                  o(i).requiredSetup.value ? (a(), u("p", pd, "This module requires setup. Installation completes after migrations and setup pass verification.")) : h("", !0),
                  o(i).migrations.value.length ? (a(), u("div", fd, [
                    (a(!0), u(X, null, se(o(i).migrations.value, (p) => (a(), u("div", {
                      key: p.id,
                      class: "km-mig-row"
                    }, [
                      m(o(C), {
                        icon: "tabler:database-import",
                        class: "km-i-xs km-dim",
                        "aria-hidden": "true"
                      }),
                      l("span", md, c(p.id), 1),
                      d[66] || (d[66] = l("span", { class: "km-grow" }, null, -1)),
                      l("span", hd, c(p.status), 1)
                    ]))), 128))
                  ])) : h("", !0),
                  l("p", bd, [
                    m(o(C), {
                      icon: "tabler:shield-lock",
                      class: "km-i-xs",
                      "aria-hidden": "true"
                    }),
                    d[67] || (d[67] = P(" Changes are transactional — if any step fails, the registry, lock and migrations are rolled back.", -1))
                  ])
                ]),
                l("details", vd, [
                  d[71] || (d[71] = l("summary", null, "Advanced", -1)),
                  l("div", gd, [
                    l("div", yd, [
                      d[69] || (d[69] = l("span", null, "Installs as", -1)),
                      l("b", kd, c(o(i).destinationId.value || "—"), 1)
                    ]),
                    l("div", wd, [
                      d[70] || (d[70] = l("span", null, "Version", -1)),
                      l("b", Sd, c(o(i).versionMode.value === "pin" ? o(i).version.value || "latest" : "≥ " + (o(i).version.value || "0.0.0")), 1)
                    ])
                  ])
                ]),
                o(i).result.value ? (a(), u("div", $d, [
                  l("div", Cd, c(o(i).result.value.dry_run ? "Dry-run preview" : "Applied"), 1),
                  o(i).result.value.dry_run ? (a(), u(X, { key: 0 }, [
                    d[72] || (d[72] = l("div", { class: "km-dim" }, "No changes were applied.", -1)),
                    o(i).resultExecution.value.length ? (a(), u("div", Id, c(o(i).resultExecution.value.length) + " planned step" + c(o(i).resultExecution.value.length === 1 ? "" : "s") + " below.", 1)) : (a(), u("div", _d, "No install steps are available for this preview."))
                  ], 64)) : (a(), u(X, { key: 1 }, [
                    d[73] || (d[73] = l("div", { class: "km-dim" }, "Changes applied successfully.", -1)),
                    o(i).result.value.apply?.message ? (a(), u("div", xd, c(o(i).result.value.apply.message), 1)) : h("", !0)
                  ], 64))
                ])) : h("", !0),
                o(i).resultExecution.value.length ? (a(), u("div", Od, [
                  d[74] || (d[74] = l("div", { class: "km-panel-title" }, "Install steps", -1)),
                  (a(!0), u(X, null, se(o(i).resultExecution.value, (p, k) => (a(), u("div", {
                    key: `${p.step}-${k}`,
                    class: ne(["km-ledger-row", j(p.status)])
                  }, [
                    l("span", Ld, c(k + 1), 1),
                    l("span", zd, c(o(i).executionStepLabel(p)), 1),
                    l("span", Ad, c(p.status), 1),
                    p.message ? (a(), u("span", Md, c(p.message), 1)) : h("", !0)
                  ], 2))), 128))
                ])) : h("", !0),
                o(i).resultError.value ? (a(), u("div", Pd, [
                  o(i).resultCode.value ? (a(), u("span", Fd, c(o(i).resultCode.value), 1)) : h("", !0),
                  P(c(o(i).resultError.value), 1)
                ])) : h("", !0)
              ], 512), [
                [rn, o(i).activeSection.value === "review"]
              ])
            ], 512)
          ])
        ]),
        _: 1
      }, 8, ["visible", "busy", "label", "style"]);
    };
  }
}), Bd = { class: "d-hero" }, Hd = { class: "d-hero-icon" }, jd = { class: "km-grow km-min0" }, Ud = { class: "km-row-wrap" }, Nd = { class: "d-hero-name" }, Kd = { class: "d-ver" }, qd = {
  key: 0,
  class: "badge-app kx-tag-caps"
}, Gd = {
  key: 1,
  class: "badge-installed kx-tag-caps"
}, Wd = {
  key: 2,
  class: "badge-private kx-tag-caps",
  title: "Private Hub module"
}, Zd = {
  key: 3,
  class: "badge-warn kx-tag-caps"
}, Yd = { class: "d-hero-org" }, Xd = {
  key: 0,
  class: "d-hero-desc"
}, Jd = { class: "d-hero-actions" }, Qd = ["href"], ec = ["href"], tc = { class: "d-grid" }, nc = { class: "d-side" }, oc = { class: "d-block" }, ic = { class: "d-row" }, sc = { class: "d-row-v" }, ac = {
  key: 0,
  class: "d-row"
}, lc = { class: "d-row-v" }, rc = {
  key: 1,
  class: "d-row"
}, uc = ["title"], dc = {
  key: 2,
  class: "d-row"
}, cc = { class: "d-row-v" }, pc = {
  key: 3,
  class: "d-row"
}, fc = {
  key: 4,
  class: "d-row"
}, mc = { class: "d-row-v" }, hc = {
  key: 5,
  class: "d-row"
}, bc = { class: "d-row-v" }, vc = {
  key: 6,
  class: "d-row"
}, gc = { class: "d-row-v" }, yc = {
  key: 0,
  class: "d-block"
}, kc = { class: "km-pills" }, wc = {
  key: 1,
  class: "d-block"
}, Sc = { class: "km-dep-list" }, $c = { class: "km-trunc" }, Cc = { class: "km-dim" }, Ic = {
  key: 2,
  class: "d-block"
}, _c = { class: "km-pills" }, xc = { class: "d-main" }, Oc = { class: "d-tabs" }, Lc = ["disabled"], zc = {
  key: 0,
  class: "km-dim"
}, Ac = { class: "d-tab-body" }, Mc = {
  key: 0,
  class: "km-loading"
}, Pc = {
  key: 0,
  class: "d-empty"
}, Fc = {
  key: 1,
  class: "rm"
}, Tc = {
  key: 2,
  class: "km-stack-lg"
}, Ec = { key: 0 }, Vc = { class: "d-block-title d-accent" }, Dc = { class: "km-dim" }, Rc = { class: "km-2col" }, Bc = { class: "d-field-i" }, Hc = { class: "km-grow km-min0" }, jc = { class: "d-cfg-name" }, Uc = {
  key: 0,
  class: "d-cfg-desc"
}, Nc = { key: 1 }, Kc = { class: "d-block-title" }, qc = { class: "km-2col" }, Gc = { class: "d-field-i d-field-i-req" }, Wc = { class: "km-grow km-min0" }, Zc = { class: "d-cfg-name" }, Yc = {
  key: 0,
  class: "d-cfg-desc"
}, Xc = { class: "d-field-i d-field-i-req" }, Jc = { class: "km-grow km-min0" }, Qc = { class: "d-cfg-name" }, ep = {
  key: 0,
  class: "d-cfg-desc"
}, tp = {
  key: 1,
  class: "d-cfg-desc km-mono"
}, np = { class: "d-block-title" }, op = { key: 0 }, ip = { class: "d-sub" }, sp = { class: "km-pills" }, ap = {
  key: 1,
  class: "km-muted"
}, lp = {
  key: 1,
  class: "km-muted"
}, rp = {
  key: 2,
  class: "km-stack"
}, up = { class: "km-group-head" }, dp = { class: "km-dim" }, cp = { class: "km-2col" }, pp = { class: "d-entry-name" }, fp = { class: "d-entry-id" }, mp = {
  key: 0,
  class: "km-muted"
}, hp = {
  key: 1,
  class: "d-vers"
}, bp = { class: "d-ver-tag" }, vp = {
  key: 0,
  class: "km-dim"
}, gp = {
  key: 1,
  class: "km-dim km-inline"
}, yp = {
  key: 2,
  class: "km-dim"
}, kp = /* @__PURE__ */ nn({
  __name: "ModuleDetailView",
  props: {
    page: {}
  },
  setup(e) {
    const t = e, {
      selectedModule: n,
      selectedIsPrivate: s,
      selectedCanUpdate: i,
      selectedUpdateDisabledReason: r,
      selectedCanUninstall: f,
      selectedUninstallBlockedReason: g,
      detailUpdate: v,
      detailUninstall: w,
      detailInstall: S,
      closeDetail: _,
      versionMeta: F,
      detailTab: B,
      detailReadme: T,
      detailLoading: N,
      detailVersions: z,
      envVars: K,
      requirements: j,
      entryIcon: M,
      entryName: R,
      entryDesc: d,
      detailGroups: Q
    } = t.page, p = q(() => t.page.selected.value);
    return (k, A) => {
      const re = Oe("wc-render-markdown");
      return a(), u("div", {
        class: "d-page",
        style: Nt({ "--accent": o(n) ? o(hn)(o(n)) : "var(--p-primary-color)" })
      }, [
        l("button", {
          class: "d-back",
          onClick: A[0] || (A[0] = //@ts-ignore
          (...b) => o(_) && o(_)(...b))
        }, [
          m(o(C), {
            icon: "tabler:arrow-left",
            class: "km-i-sm",
            "aria-hidden": "true"
          }),
          A[4] || (A[4] = P(" Back to modules ", -1))
        ]),
        l("header", Bd, [
          l("div", Hd, [
            m(o(C), {
              icon: o(n) ? o(tn)(o(n)) : "tabler:package",
              class: "km-i-lg",
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          l("div", jd, [
            l("div", Ud, [
              l("h2", Nd, c(p.value.label), 1),
              l("span", Kd, c(p.value.version || "—"), 1),
              o(dn)(o(n)) ? (a(), u("span", qd, "app")) : h("", !0),
              p.value.installed ? (a(), u("span", Gd, "installed")) : h("", !0),
              o(s) ? (a(), u("span", Wd, [
                m(o(C), {
                  icon: "tabler:lock",
                  class: "km-i-xs",
                  "aria-hidden": "true"
                }),
                A[5] || (A[5] = P(" private", -1))
              ])) : h("", !0),
              o(n)?.deprecated ? (a(), u("span", Zd, "deprecated")) : h("", !0)
            ]),
            l("div", Yd, c(p.value.component), 1),
            p.value.description ? (a(), u("p", Xd, c(p.value.description), 1)) : h("", !0),
            l("div", Jd, [
              p.value.installed ? (a(), u(X, { key: 0 }, [
                o(i) ? (a(), ce(o(le), {
                  key: 0,
                  size: "small",
                  severity: "secondary",
                  outlined: "",
                  onClick: o(v)
                }, {
                  default: ee(() => [
                    m(o(C), {
                      icon: "tabler:refresh-dot",
                      class: "km-i",
                      "aria-hidden": "true"
                    }),
                    A[6] || (A[6] = P(" Update ", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])) : (a(), ce(o(le), {
                  key: 1,
                  size: "small",
                  severity: "secondary",
                  outlined: "",
                  disabled: "",
                  title: o(r) || void 0
                }, {
                  default: ee(() => [
                    m(o(C), {
                      icon: "tabler:refresh-off",
                      class: "km-i",
                      "aria-hidden": "true"
                    }),
                    A[7] || (A[7] = P(" Update ", -1))
                  ]),
                  _: 1
                }, 8, ["title"])),
                o(f) ? (a(), ce(o(le), {
                  key: 2,
                  size: "small",
                  severity: "danger",
                  text: "",
                  onClick: o(w)
                }, {
                  default: ee(() => [
                    m(o(C), {
                      icon: "tabler:trash",
                      class: "km-i",
                      "aria-hidden": "true"
                    }),
                    A[8] || (A[8] = P(" Uninstall ", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])) : o(g) ? (a(), ce(o(le), {
                  key: 3,
                  size: "small",
                  severity: "danger",
                  text: "",
                  disabled: "",
                  title: o(g)
                }, {
                  default: ee(() => [
                    m(o(C), {
                      icon: "tabler:trash-off",
                      class: "km-i",
                      "aria-hidden": "true"
                    }),
                    A[9] || (A[9] = P(" Uninstall ", -1))
                  ]),
                  _: 1
                }, 8, ["title"])) : h("", !0)
              ], 64)) : (a(), ce(o(le), {
                key: 1,
                size: "small",
                onClick: o(S)
              }, {
                default: ee(() => [
                  m(o(C), {
                    icon: "tabler:download",
                    class: "km-i",
                    "aria-hidden": "true"
                  }),
                  A[10] || (A[10] = P(" Install ", -1))
                ]),
                _: 1
              }, 8, ["onClick"])),
              o(n)?.repository ? (a(), u("a", {
                key: 2,
                href: String(o(n).repository),
                target: "_blank",
                rel: "noopener",
                class: "d-link"
              }, [
                m(o(C), {
                  icon: "tabler:brand-github",
                  class: "km-i-sm",
                  "aria-hidden": "true"
                }),
                A[11] || (A[11] = P(" Repository", -1))
              ], 8, Qd)) : h("", !0),
              o(n)?.homepage ? (a(), u("a", {
                key: 3,
                href: String(o(n).homepage),
                target: "_blank",
                rel: "noopener",
                class: "d-link"
              }, [
                m(o(C), {
                  icon: "tabler:home",
                  class: "km-i-sm",
                  "aria-hidden": "true"
                }),
                A[12] || (A[12] = P(" Homepage", -1))
              ], 8, ec)) : h("", !0)
            ])
          ])
        ]),
        l("div", tc, [
          l("aside", nc, [
            l("section", oc, [
              l("div", ic, [
                m(o(C), {
                  icon: "tabler:download",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[13] || (A[13] = l("span", { class: "d-row-k" }, "Downloads", -1)),
                l("span", sc, c(o(bn)(o(n)?.total_downloads)), 1)
              ]),
              o(n)?.favorites_count ? (a(), u("div", ac, [
                m(o(C), {
                  icon: "tabler:star",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[14] || (A[14] = l("span", { class: "d-row-k" }, "Favorites", -1)),
                l("span", lc, c(o(n).favorites_count), 1)
              ])) : h("", !0),
              o(n)?.license ? (a(), u("div", rc, [
                m(o(C), {
                  icon: "tabler:license",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[15] || (A[15] = l("span", { class: "d-row-k" }, "License", -1)),
                l("span", {
                  class: "d-row-v",
                  title: o(n).license
                }, c(o(Fn)(o(n).license)), 9, uc)
              ])) : h("", !0),
              o(n)?.type ? (a(), u("div", dc, [
                m(o(C), {
                  icon: "tabler:category",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[16] || (A[16] = l("span", { class: "d-row-k" }, "Type", -1)),
                l("span", cc, c(o(n).type), 1)
              ])) : h("", !0),
              o(s) ? (a(), u("div", pc, [
                m(o(C), {
                  icon: "tabler:lock",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[17] || (A[17] = l("span", { class: "d-row-k" }, "Visibility", -1)),
                A[18] || (A[18] = l("span", { class: "d-row-v" }, "Private", -1))
              ])) : h("", !0),
              o(n)?.update_time ? (a(), u("div", fc, [
                m(o(C), {
                  icon: "tabler:clock",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[19] || (A[19] = l("span", { class: "d-row-k" }, "Updated", -1)),
                l("span", mc, c(o(Tn)(o(n).update_time, { maxUnit: "year" })), 1)
              ])) : h("", !0),
              o(F)?.entry_count ? (a(), u("div", hc, [
                m(o(C), {
                  icon: "tabler:list-numbers",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[20] || (A[20] = l("span", { class: "d-row-k" }, "Entries", -1)),
                l("span", bc, c(o(F).entry_count), 1)
              ])) : h("", !0),
              o(F)?.size_bytes ? (a(), u("div", vc, [
                m(o(C), {
                  icon: "tabler:weight",
                  class: "d-row-i",
                  "aria-hidden": "true"
                }),
                A[21] || (A[21] = l("span", { class: "d-row-k" }, "Size", -1)),
                l("span", gc, c(o(cn)(o(F).size_bytes)), 1)
              ])) : h("", !0)
            ]),
            (o(n)?.keywords || []).length ? (a(), u("section", yc, [
              A[22] || (A[22] = l("div", { class: "d-block-title" }, "Keywords", -1)),
              l("div", kc, [
                (a(!0), u(X, null, se(o(n).keywords, (b) => (a(), u("span", {
                  key: b,
                  class: "provides-pill"
                }, c(b), 1))), 128))
              ])
            ])) : h("", !0),
            (o(F)?.dependencies || []).length ? (a(), u("section", wc, [
              A[23] || (A[23] = l("div", { class: "d-block-title" }, "Dependencies", -1)),
              l("div", Sc, [
                (a(!0), u(X, null, se(o(F).dependencies, (b, I) => (a(), u("div", {
                  key: I,
                  class: "km-dep"
                }, [
                  l("span", $c, c(b.org) + "/" + c(b.name), 1),
                  l("span", Cc, c(b.version_constraint), 1)
                ]))), 128))
              ])
            ])) : h("", !0),
            (o(F)?.lua_modules || []).length ? (a(), u("section", Ic, [
              A[24] || (A[24] = l("div", { class: "d-block-title" }, "Lua modules", -1)),
              l("div", _c, [
                (a(!0), u(X, null, se(o(F).lua_modules, (b) => (a(), u("span", {
                  key: b,
                  class: "provides-pill"
                }, c(b), 1))), 128))
              ])
            ])) : h("", !0)
          ]),
          l("main", xc, [
            l("div", Oc, [
              l("button", {
                class: ne(["d-tab", { active: o(B) === "readme" }]),
                disabled: !o(T) && !o(N),
                onClick: A[1] || (A[1] = (b) => B.value = "readme")
              }, "Readme", 10, Lc),
              l("button", {
                class: ne(["d-tab", { active: o(B) === "overview" }]),
                onClick: A[2] || (A[2] = (b) => B.value = "overview")
              }, "Overview", 2),
              l("button", {
                class: ne(["d-tab", { active: o(B) === "versions" }]),
                onClick: A[3] || (A[3] = (b) => B.value = "versions")
              }, [
                A[25] || (A[25] = P("Versions ", -1)),
                o(z).length ? (a(), u("span", zc, c(o(z).length), 1)) : h("", !0)
              ], 2)
            ]),
            l("div", Ac, [
              o(N) ? (a(), u("div", Mc, [
                m(o(C), {
                  icon: "tabler:loader-2",
                  class: "km-i spin",
                  "aria-hidden": "true"
                }),
                A[26] || (A[26] = P(" Loading… ", -1))
              ])) : o(B) === "readme" ? (a(), u(X, { key: 1 }, [
                o(T) ? (a(), u("article", Fc, [
                  m(re, { source: o(T) }, null, 8, ["source"])
                ])) : (a(), u("div", Pc, [
                  m(o(C), {
                    icon: "tabler:file-off",
                    class: "km-i-xl km-dim",
                    "aria-hidden": "true"
                  }),
                  A[27] || (A[27] = l("p", { class: "km-mt" }, "No README provided.", -1))
                ]))
              ], 64)) : o(B) === "overview" ? (a(), u("div", Tc, [
                o(K).length ? (a(), u("section", Ec, [
                  l("div", Vc, [
                    m(o(C), {
                      icon: "tabler:settings-2",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    A[28] || (A[28] = P(" Environment ", -1)),
                    l("span", Dc, c(o(K).length), 1)
                  ]),
                  A[29] || (A[29] = l("p", { class: "d-sub" }, "Variables this module reads — set them in your environment.", -1)),
                  l("div", Rc, [
                    (a(!0), u(X, null, se(o(K), (b) => (a(), u("div", {
                      key: b.id,
                      class: "d-field d-field-env"
                    }, [
                      l("span", Bc, [
                        m(o(C), {
                          icon: o(M)(b, "tabler:variable"),
                          class: "km-i",
                          "aria-hidden": "true"
                        }, null, 8, ["icon"])
                      ]),
                      l("span", Hc, [
                        l("span", jc, c(o(R)(b)), 1),
                        o(d)(b) ? (a(), u("span", Uc, c(o(d)(b)), 1)) : h("", !0)
                      ])
                    ]))), 128))
                  ])
                ])) : h("", !0),
                o(j).length || (o(F)?.requirements || []).length ? (a(), u("section", Nc, [
                  l("div", Kc, [
                    m(o(C), {
                      icon: "tabler:plug-connected",
                      class: "km-i-sm",
                      "aria-hidden": "true"
                    }),
                    A[30] || (A[30] = P(" Requires", -1))
                  ]),
                  A[31] || (A[31] = l("p", { class: "d-sub" }, "Host resources this module is wired to at install.", -1)),
                  l("div", qc, [
                    o(j).length ? (a(!0), u(X, { key: 0 }, se(o(j), (b) => (a(), u("div", {
                      key: b.id,
                      class: "d-field d-field-req"
                    }, [
                      l("span", Gc, [
                        m(o(C), {
                          icon: "tabler:link",
                          class: "km-i",
                          "aria-hidden": "true"
                        })
                      ]),
                      l("span", Wc, [
                        l("span", Zc, c(o(R)(b)), 1),
                        o(d)(b) ? (a(), u("span", Yc, c(o(d)(b)), 1)) : h("", !0)
                      ])
                    ]))), 128)) : (a(!0), u(X, { key: 1 }, se(o(F).requirements, (b, I) => (a(), u("div", {
                      key: I,
                      class: "d-field d-field-req"
                    }, [
                      l("span", Xc, [
                        m(o(C), {
                          icon: "tabler:link",
                          class: "km-i",
                          "aria-hidden": "true"
                        })
                      ]),
                      l("span", Jc, [
                        l("span", Qc, c(b.name), 1),
                        b.description ? (a(), u("span", ep, c(b.description), 1)) : h("", !0),
                        b.default ? (a(), u("span", tp, "default: " + c(b.default), 1)) : h("", !0)
                      ])
                    ]))), 128))
                  ])
                ])) : h("", !0),
                l("section", null, [
                  l("div", np, [
                    m(o(C), {
                      icon: "tabler:package",
                      class: "km-i-sm d-accent-i",
                      "aria-hidden": "true"
                    }),
                    A[32] || (A[32] = P(" Provides", -1))
                  ]),
                  p.value.installed ? o(Q).length ? (a(), u("div", rp, [
                    (a(!0), u(X, null, se(o(Q), (b) => (a(), u("div", {
                      key: b.key
                    }, [
                      l("div", up, [
                        m(o(C), {
                          icon: b.icon,
                          class: "km-i-sm d-accent-i",
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        P(" " + c(b.label) + " ", 1),
                        l("span", dp, c(b.items.length), 1)
                      ]),
                      l("div", cp, [
                        (a(!0), u(X, null, se(b.items, (I) => (a(), u("div", {
                          key: I.id,
                          class: "d-entry"
                        }, [
                          l("div", pp, c(I.meta && I.meta.title || o(R)(I)), 1),
                          l("div", fp, c(I.id), 1)
                        ]))), 128))
                      ])
                    ]))), 128))
                  ])) : (a(), u("p", lp, "No registry entries.")) : (a(), u("div", op, [
                    (o(F)?.entry_kinds || []).length ? (a(), u(X, { key: 0 }, [
                      l("p", ip, "Publishes " + c(o(F).entry_count || o(F).entry_kinds.length) + " entries; per-entry detail resolves after install.", 1),
                      l("div", sp, [
                        (a(!0), u(X, null, se(o(F).entry_kinds, (b) => (a(), u("span", {
                          key: b,
                          class: "provides-pill"
                        }, c(b), 1))), 128))
                      ])
                    ], 64)) : (a(), u("p", ap, [...A[33] || (A[33] = [
                      P("See the ", -1),
                      l("strong", null, "Readme", -1),
                      P(" tab for details.", -1)
                    ])]))
                  ]))
                ])
              ])) : (a(), u(X, { key: 3 }, [
                o(z).length ? (a(), u("div", hp, [
                  (a(!0), u(X, null, se(o(z), (b) => (a(), u("div", {
                    key: b.version,
                    class: "d-ver-row"
                  }, [
                    l("span", bp, c(b.version), 1),
                    b.create_time ? (a(), u("span", vp, c(o(Tn)(b.create_time, { maxUnit: "year" })), 1)) : h("", !0),
                    A[34] || (A[34] = l("span", { class: "km-grow" }, null, -1)),
                    b.download_count ? (a(), u("span", gp, [
                      m(o(C), {
                        icon: "tabler:download",
                        class: "km-i-xs",
                        "aria-hidden": "true"
                      }),
                      P(" " + c(o(bn)(b.download_count)), 1)
                    ])) : h("", !0),
                    b.size_bytes ? (a(), u("span", yp, c(o(cn)(b.size_bytes)), 1)) : h("", !0)
                  ]))), 128))
                ])) : (a(), u("p", mp, "No published versions."))
              ], 64))
            ])
          ])
        ])
      ], 4);
    };
  }
}), wp = { class: "km" }, Sp = {
  key: 1,
  class: "km-loading km-center km-initial-loading",
  role: "status",
  "aria-live": "polite"
}, $p = {
  key: 2,
  class: "km-denied"
}, Cp = { class: "km-denied-box" }, Ip = {
  key: 3,
  class: "km-scroll"
}, _p = {
  key: 1,
  class: "km-list"
}, xp = { class: "km-sec-bar km-sec-bar-toolbar" }, Op = { class: "km-controls" }, Lp = {
  key: 0,
  class: "km-btn-count"
}, zp = { class: "km-hub-auth-panel" }, Ap = { class: "km-hub-auth-row" }, Mp = {
  key: 0,
  class: "km-hub-auth-meta"
}, Pp = {
  key: 1,
  class: "km-hub-auth-meta"
}, Fp = {
  key: 2,
  class: "km-hub-auth-orgs"
}, Tp = { class: "km-hub-auth-org-name" }, Ep = {
  key: 0,
  class: "km-hub-auth-org-role"
}, Vp = { class: "km-hub-auth-hint" }, Dp = ["href"], Rp = { class: "km-hub-auth-actions" }, Bp = {
  key: 0,
  class: "km-msg km-msg-err"
}, Hp = {
  key: 1,
  class: "km-msg"
}, jp = {
  key: 2,
  class: "km-msg km-msg-err"
}, Up = {
  key: 3,
  class: "km-loading km-center"
}, Np = { key: 0 }, Kp = { class: "hub-section-head" }, qp = { class: "feat-grid" }, Gp = ["onClick"], Wp = { class: "feat-icon" }, Zp = { class: "feat-body" }, Yp = { class: "km-row-wrap" }, Xp = { class: "feat-name" }, Jp = {
  key: 0,
  class: "badge-app kx-tag-caps"
}, Qp = {
  key: 1,
  class: "badge-private kx-tag-caps",
  title: "Private Hub module"
}, ef = {
  key: 2,
  class: "badge-warn kx-tag-caps"
}, tf = { class: "feat-org" }, nf = {
  key: 0,
  class: "feat-desc"
}, of = { class: "feat-meta" }, sf = { class: "meta-pill" }, af = { class: "meta-pill" }, lf = ["title"], rf = { class: "hub-section-head" }, uf = { class: "hub-section-title" }, df = { class: "hub-section-sub" }, cf = { class: "mod-grid" }, pf = ["onClick"], ff = { class: "mod-icon" }, mf = { class: "mod-body" }, hf = { class: "km-row-wrap" }, bf = { class: "mod-name" }, vf = { class: "mod-version" }, gf = {
  key: 0,
  class: "badge-app kx-tag-caps"
}, yf = {
  key: 1,
  class: "badge-private kx-tag-caps",
  title: "Private Hub module"
}, kf = {
  key: 2,
  class: "badge-warn kx-tag-caps"
}, wf = { class: "mod-org" }, Sf = {
  key: 0,
  class: "mod-desc"
}, $f = { class: "mod-foot" }, Cf = { class: "foot-stat" }, If = {
  key: 0,
  class: "foot-stat"
}, _f = ["title"], xf = {
  key: 2,
  class: "foot-stat km-dim km-ml-auto"
}, Of = {
  key: 5,
  class: "km-empty"
}, Lf = { class: "km-muted" }, zf = { class: "km-mono" }, Af = {
  key: 6,
  class: "km-empty"
}, Mf = {
  key: 7,
  class: "km-empty"
}, Pf = { class: "km-muted" }, Ff = { class: "km-mono" }, Tf = {
  key: 0,
  class: "km-installed"
}, Ef = ["aria-expanded"], Vf = { class: "km-sub" }, Df = {
  key: 0,
  class: "km-update-count"
}, Rf = {
  key: 1,
  class: "km-update-count"
}, Bf = {
  key: 0,
  class: "km-msg km-msg-err km-mb"
}, Hf = {
  key: 1,
  class: "inst-toolbar"
}, jf = {
  key: 2,
  class: "inst-list"
}, Uf = ["onClick"], Nf = { class: "inst-icon" }, Kf = { class: "km-grow km-min0" }, qf = { class: "km-row-tight" }, Gf = { class: "inst-name" }, Wf = {
  key: 0,
  class: "badge-app kx-tag-caps"
}, Zf = {
  key: 1,
  class: "badge-private kx-tag-caps",
  title: "Private Hub module"
}, Yf = {
  key: 2,
  class: "km-chip"
}, Xf = ["title"], Jf = { class: "inst-id" }, Qf = {
  key: 0,
  class: "km-dim"
}, em = {
  key: 0,
  class: "inst-update-msg"
}, tm = { class: "inst-ver" }, nm = { class: "inst-migs" }, om = { class: "inst-actions" }, im = ["disabled", "aria-label", "onClick"], sm = ["disabled", "aria-label", "onClick"], am = ["title", "aria-label"], lm = ["aria-label", "onClick"], rm = ["title", "aria-label"], um = {
  key: 3,
  class: "km-empty inst-empty"
}, dm = { class: "km-modal-body" }, cm = { class: "km-uninstall-target" }, pm = { class: "km-mono" }, fm = { class: "km-dim" }, mm = {
  key: 0,
  class: "km-msg km-msg-err"
}, hm = {
  key: 0,
  class: "km-code"
}, bm = {
  key: 1,
  class: "km-mt"
}, vm = {
  key: 1,
  class: "km-msg km-msg-info"
}, gm = {
  key: 2,
  class: "km-running"
}, ym = {
  key: 3,
  class: "km-uninstall-preview"
}, km = {
  key: 0,
  class: "km-msg"
}, wm = {
  key: 1,
  class: "km-preview-block"
}, Sm = { class: "km-mono" }, $m = { class: "km-dim" }, Cm = {
  key: 2,
  class: "km-preview-block"
}, Im = { class: "km-mono" }, _m = { class: "km-dim" }, xm = {
  key: 3,
  class: "km-preview-block"
}, Om = { class: "km-mono" }, Lm = { class: "km-dim" }, zm = {
  key: 4,
  class: "km-ledger"
}, Am = { class: "km-ledger-step" }, Mm = { class: "km-grow" }, Pm = { class: "km-chip" }, Fm = {
  key: 0,
  class: "km-ledger-msg"
}, Tm = {
  key: 5,
  class: "km-running"
}, Em = { class: "km-grow km-running-label" }, Vm = { class: "km-dim" }, Dm = /* @__PURE__ */ nn({
  __name: "modules",
  setup(e) {
    const t = _l(), {
      LABEL: n,
      HUB_PORTAL: s,
      UNINSTALL_MIGRATION_OPTIONS: i,
      initialLoading: r,
      accessDenied: f,
      statusBanner: g,
      hubConnected: v,
      hubStatus: w,
      hubToken: S,
      showTokenPanel: _,
      hubConnecting: F,
      hubError: B,
      hubOrgs: T,
      hubIdentity: N,
      hubTokenStored: z,
      hubTokenExpired: K,
      hubTokenIcon: j,
      hubTokenButtonLabel: M,
      hubExpiry: R,
      saveHubToken: d,
      clearHubToken: Q,
      selected: p,
      selectedModule: k,
      detailReadme: A,
      detailLoading: re,
      detailTab: b,
      detailVersions: I,
      envVars: L,
      requirements: E,
      detailGroups: J,
      versionMeta: te,
      selectedCanUpdate: oe,
      selectedUpdateDisabledReason: me,
      selectedCanUninstall: Ae,
      selectedIsPrivate: ge,
      selectedUninstallBlockedReason: Ke,
      entryName: Re,
      entryDesc: mt,
      entryIcon: qe,
      openDetail: ht,
      closeDetail: Mt,
      detailInstall: Pt,
      detailUpdate: Se,
      detailUninstall: Gt,
      installed: nt,
      installedFilter: Ge,
      installedKindFilter: bt,
      installedTotal: ot,
      updateScanLoading: We,
      updateAllRunning: Be,
      availableUpdates: Te,
      installedLoading: $e,
      installedError: Ze,
      installedOpen: Ye,
      catalog: Ft,
      catalogLoading: it,
      catalogError: Xe,
      catalogInstalledTotal: He,
      visibleCatalogInstalled: Tt,
      browseFilter: $,
      sortBy: x,
      availableItems: D,
      featured: U,
      sortedItems: Z,
      visibleInstalled: Y,
      catalogItemFor: de,
      installedAccent: ke,
      installedIcon: st,
      installedIsRoot: Et,
      installedIsPrivate: fe,
      installedRole: Ee,
      installedUsedBy: at,
      installedCanUpdate: vt,
      installedUpdateDisabledReason: gt,
      installedCanUninstall: ve,
      installedUninstallDisabledReason: Me,
      installedMigrationSummary: lt,
      updateInfoForDep: Je,
      updateStatusLabel: on,
      updateStatusIcon: Vt,
      updateStatusBusy: Ct,
      scanInstalledUpdates: Ve,
      updateInstalledDependency: je,
      updateAllAvailable: yt,
      refreshAll: kt,
      installTarget: we,
      closeInstallDialog: rt,
      onInstallChanged: sn,
      openUpdateDialog: It,
      uninstallDialogOpen: ut,
      uninstallDep: dt,
      uninstallPolicy: Qe,
      uninstallRunning: ye,
      uninstallPreviewLoading: et,
      uninstallPreview: be,
      uninstallExecution: Wt,
      uninstallCode: Ce,
      uninstallError: _t,
      uninstallRequiredBy: Dt,
      uninstallBlockedReason: xt,
      uninstallActionBlockedReason: Ie,
      uninstallPhase: Rt,
      uninstallElapsedSec: Bt,
      openUninstallDialog: Zt,
      previewUninstall: wt,
      executionStepLabel: Yt,
      runUninstall: Ot
    } = t, St = H(null);
    return (_e, O) => (a(), u("div", wp, [
      o(g) ? (a(), u("div", {
        key: 0,
        class: ne(["km-banner", o(g).kind === "ok" ? "km-banner-ok" : "km-banner-err"])
      }, c(o(g).message), 3)) : h("", !0),
      o(r) ? (a(), u("div", Sp, [
        m(o(C), {
          icon: "tabler:loader-2",
          class: "km-i spin",
          "aria-hidden": "true"
        }),
        O[12] || (O[12] = P(" Loading modules… ", -1))
      ])) : o(f) ? (a(), u("div", $p, [
        l("div", Cp, [
          m(o(C), {
            icon: "tabler:lock",
            class: "km-denied-icon",
            "aria-hidden": "true"
          }),
          O[13] || (O[13] = l("p", { class: "km-denied-title" }, "Admins only", -1)),
          O[14] || (O[14] = l("p", { class: "km-denied-sub" }, "You need admin access to manage modules.", -1))
        ])
      ])) : (a(), u("div", Ip, [
        o(p) ? (a(), ce(kp, {
          key: 0,
          page: o(t)
        }, null, 8, ["page"])) : (a(), u("div", _p, [
          l("section", null, [
            l("div", xp, [
              l("div", Op, [
                m(o(le), {
                  size: "small",
                  severity: "secondary",
                  outlined: "",
                  disabled: o($e) || o(it),
                  onClick: o(kt)
                }, {
                  default: ee(() => [
                    m(o(C), {
                      icon: o($e) || o(it) ? "tabler:loader-2" : "tabler:refresh",
                      class: ne(["km-i", (o($e) || o(it)) && "spin"]),
                      "aria-hidden": "true"
                    }, null, 8, ["icon", "class"]),
                    O[15] || (O[15] = P(" Refresh ", -1))
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"]),
                m(o(le), {
                  size: "small",
                  severity: "secondary",
                  outlined: "",
                  disabled: o(We) || o(Be) || o($e) || o(ot) === 0,
                  onClick: o(Ve)
                }, {
                  default: ee(() => [
                    m(o(C), {
                      icon: o(We) ? "tabler:loader-2" : "tabler:refresh-dot",
                      class: ne(["km-i", o(We) && "spin"]),
                      "aria-hidden": "true"
                    }, null, 8, ["icon", "class"]),
                    O[16] || (O[16] = P(" Scan updates ", -1))
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"]),
                m(o(le), {
                  size: "small",
                  disabled: o(Be) || o(We) || o(Te).length === 0,
                  onClick: o(yt)
                }, {
                  default: ee(() => [
                    m(o(C), {
                      icon: o(Be) ? "tabler:loader-2" : "tabler:download",
                      class: ne(["km-i", o(Be) && "spin"]),
                      "aria-hidden": "true"
                    }, null, 8, ["icon", "class"]),
                    O[17] || (O[17] = P(" Update all ", -1)),
                    o(Te).length ? (a(), u("span", Lp, c(o(Te).length), 1)) : h("", !0)
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"]),
                De(l("input", {
                  "onUpdate:modelValue": O[0] || (O[0] = (y) => Lt($) ? $.value = y : null),
                  class: "km-input km-filter",
                  placeholder: "Filter…"
                }, null, 512), [
                  [xn, o($)]
                ]),
                m(o(Ln), {
                  modelValue: o(x),
                  "onUpdate:modelValue": O[1] || (O[1] = (y) => Lt(x) ? x.value = y : null),
                  class: "km-sort",
                  options: [
                    { label: "Top downloads", value: "downloads" },
                    { label: "Name A→Z", value: "name" },
                    { label: "Recently updated", value: "recent" }
                  ],
                  "option-label": "label",
                  "option-value": "value",
                  "aria-label": "Sort modules"
                }, null, 8, ["modelValue"]),
                l("div", {
                  ref_key: "anchorEl",
                  ref: St,
                  class: "km-hub-auth"
                }, [
                  m(o(le), {
                    size: "small",
                    severity: o(v) ? "secondary" : o(K) ? "warn" : void 0,
                    outlined: o(v) || o(K),
                    disabled: o(F),
                    onClick: O[2] || (O[2] = (y) => _.value = !o(_))
                  }, {
                    default: ee(() => [
                      m(o(C), {
                        icon: o(j),
                        class: "km-i",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"]),
                      P(" " + c(o(M)) + " ", 1),
                      m(o(C), {
                        icon: "tabler:chevron-down",
                        class: "km-i-sm",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["severity", "outlined", "disabled"]),
                  m(ni, {
                    open: o(_),
                    "onUpdate:open": O[5] || (O[5] = (y) => Lt(_) ? _.value = y : null),
                    anchor: St.value,
                    align: "right",
                    width: 300
                  }, {
                    default: ee(() => [
                      l("div", zp, [
                        O[21] || (O[21] = l("div", { class: "km-hub-auth-title" }, "Wippy Hub token", -1)),
                        o(z) ? (a(), u("div", {
                          key: 0,
                          class: ne(["km-hub-auth-active", o(K) && "is-expired"])
                        }, [
                          l("div", Ap, [
                            m(o(C), {
                              icon: o(K) ? "tabler:alert-triangle" : "tabler:circle-check-filled",
                              class: ne(["km-i-sm", o(K) ? "km-hub-warn" : "km-hub-ok"]),
                              "aria-hidden": "true"
                            }, null, 8, ["icon", "class"]),
                            l("span", null, [
                              P(c(o(K) ? "Token expired" : "Token active"), 1),
                              o(N) ? (a(), u(X, { key: 0 }, [
                                O[18] || (O[18] = P(" — ", -1)),
                                l("strong", null, c(o(N)), 1)
                              ], 64)) : h("", !0)
                            ])
                          ]),
                          o(w)?.registry ? (a(), u("div", Mp, c(o(w).registry), 1)) : h("", !0),
                          o(R) ? (a(), u("div", Pp, "Expires " + c(o(R)), 1)) : h("", !0),
                          o(T).length ? (a(), u("div", Fp, [
                            O[19] || (O[19] = l("div", { class: "km-hub-auth-orgs-label" }, "Organizations", -1)),
                            (a(!0), u(X, null, se(o(T), (y) => (a(), u("div", {
                              key: y.id || y.name,
                              class: "km-hub-auth-org"
                            }, [
                              m(o(C), {
                                icon: "tabler:building",
                                class: "km-i-sm",
                                "aria-hidden": "true"
                              }),
                              l("span", Tp, c(y.display_name || y.name), 1),
                              y.role ? (a(), u("span", Ep, c(y.role), 1)) : h("", !0)
                            ]))), 128))
                          ])) : h("", !0)
                        ], 2)) : h("", !0),
                        l("p", Vp, [
                          P(c(o(z) ? "Replace the token, or" : "Paste a Hub registry token to browse and install private modules.") + " ", 1),
                          o(z) ? (a(), u(X, { key: 0 }, [
                            P("create a new one")
                          ], 64)) : h("", !0),
                          l("a", {
                            href: o(s),
                            target: "_blank",
                            rel: "noopener"
                          }, c(o(z) ? "↗" : "Create one →"), 9, Dp)
                        ]),
                        De(l("input", {
                          "onUpdate:modelValue": O[3] || (O[3] = (y) => Lt(S) ? S.value = y : null),
                          type: "password",
                          class: "km-input km-hub-auth-input",
                          placeholder: "wpy_…",
                          autocomplete: "off",
                          onKeyup: O[4] || (O[4] = xi(
                            //@ts-ignore
                            (...y) => o(d) && o(d)(...y),
                            ["enter"]
                          ))
                        }, null, 544), [
                          [xn, o(S)]
                        ]),
                        l("div", Rp, [
                          m(o(le), {
                            size: "small",
                            disabled: o(F),
                            onClick: o(d)
                          }, {
                            default: ee(() => [
                              m(o(C), {
                                icon: o(F) ? "tabler:loader-2" : "tabler:device-floppy",
                                class: ne(["km-i", o(F) && "spin"]),
                                "aria-hidden": "true"
                              }, null, 8, ["icon", "class"]),
                              P(" " + c(o(F) ? "Saving…" : o(z) ? "Replace token" : "Save token"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled", "onClick"]),
                          o(z) ? (a(), ce(o(le), {
                            key: 0,
                            size: "small",
                            severity: "secondary",
                            outlined: "",
                            onClick: o(Q)
                          }, {
                            default: ee(() => [
                              m(o(C), {
                                icon: "tabler:trash",
                                class: "km-i",
                                "aria-hidden": "true"
                              }),
                              O[20] || (O[20] = P(" Clear ", -1))
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : h("", !0)
                        ])
                      ])
                    ]),
                    _: 1
                  }, 8, ["open", "anchor"])
                ], 512)
              ])
            ]),
            o(B) ? (a(), u("div", Bp, c(o(B)), 1)) : h("", !0),
            !o(v) && o(K) ? (a(), u("div", Hp, "Your Wippy Hub token is expired.")) : h("", !0),
            o(Xe) ? (a(), u("div", jp, c(o(Xe)), 1)) : h("", !0),
            o(it) || o($e) ? (a(), u("div", Up, [
              m(o(C), {
                icon: "tabler:loader-2",
                class: "km-i spin",
                "aria-hidden": "true"
              }),
              O[22] || (O[22] = P(" Loading modules… ", -1))
            ])) : o(D).length > 0 ? (a(), u(X, { key: 4 }, [
              o(U).length ? (a(), u("div", Np, [
                l("div", Kp, [
                  m(o(C), {
                    icon: "tabler:flame",
                    class: "km-i km-flame",
                    "aria-hidden": "true"
                  }),
                  O[23] || (O[23] = l("span", { class: "hub-section-title" }, "Most popular", -1)),
                  O[24] || (O[24] = l("span", { class: "hub-section-sub" }, "by downloads", -1))
                ]),
                l("div", qp, [
                  (a(!0), u(X, null, se(o(U), (y) => (a(), u("button", {
                    key: "f" + o(Pn)(y),
                    class: "feat-card",
                    style: Nt({ "--accent": o(hn)(y) }),
                    onClick: (Ue) => o(ht)(y)
                  }, [
                    O[26] || (O[26] = l("span", { class: "feat-strip" }, null, -1)),
                    l("span", Wp, [
                      m(o(C), {
                        icon: o(tn)(y),
                        class: "km-i-lg",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    l("span", Zp, [
                      l("span", Yp, [
                        l("span", Xp, c(o(en)(y)), 1),
                        o(dn)(y) ? (a(), u("span", Jp, "app")) : h("", !0),
                        o(mn)(y) ? (a(), u("span", Qp, [
                          m(o(C), {
                            icon: "tabler:lock",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          O[25] || (O[25] = P(" private", -1))
                        ])) : h("", !0),
                        y.deprecated ? (a(), u("span", ef, "deprecated")) : h("", !0)
                      ]),
                      l("span", tf, c(o(An)(y)), 1),
                      y.description ? (a(), u("span", nf, c(y.description), 1)) : h("", !0),
                      l("span", of, [
                        l("span", sf, [
                          m(o(C), {
                            icon: "tabler:tag",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(y.latest_version || "?"), 1)
                        ]),
                        l("span", af, [
                          m(o(C), {
                            icon: "tabler:download",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(o(bn)(y.total_downloads)), 1)
                        ]),
                        y.license ? (a(), u("span", {
                          key: 0,
                          class: "meta-pill",
                          title: y.license
                        }, [
                          m(o(C), {
                            icon: "tabler:license",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(o(Fn)(y.license)), 1)
                        ], 8, lf)) : h("", !0)
                      ])
                    ])
                  ], 12, Gp))), 128))
                ])
              ])) : h("", !0),
              l("div", {
                class: ne(o(U).length ? "km-mt-sm" : "")
              }, [
                l("div", rf, [
                  m(o(C), {
                    icon: "tabler:apps",
                    class: "km-i km-accent",
                    "aria-hidden": "true"
                  }),
                  l("span", uf, c(o(U).length ? "All modules" : "Available"), 1),
                  l("span", df, c(o(D).length) + " available", 1)
                ]),
                l("div", cf, [
                  (a(!0), u(X, null, se(o(Z), (y) => (a(), u("button", {
                    key: o(Pn)(y),
                    class: "mod-card",
                    style: Nt({ "--accent": o(hn)(y) }),
                    onClick: (Ue) => o(ht)(y)
                  }, [
                    l("span", ff, [
                      m(o(C), {
                        icon: o(tn)(y),
                        class: "km-i",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    l("span", mf, [
                      l("span", hf, [
                        l("span", bf, c(o(en)(y)), 1),
                        l("span", vf, c(y.latest_version || "—"), 1),
                        o(dn)(y) ? (a(), u("span", gf, "app")) : h("", !0),
                        o(mn)(y) ? (a(), u("span", yf, [
                          m(o(C), {
                            icon: "tabler:lock",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          O[27] || (O[27] = P(" private", -1))
                        ])) : h("", !0),
                        y.deprecated ? (a(), u("span", kf, "deprecated")) : h("", !0)
                      ]),
                      l("span", wf, c(o(An)(y)), 1),
                      y.description ? (a(), u("span", Sf, c(y.description), 1)) : h("", !0),
                      l("span", $f, [
                        l("span", Cf, [
                          m(o(C), {
                            icon: "tabler:download",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(o(bn)(y.total_downloads)), 1)
                        ]),
                        y.favorites_count ? (a(), u("span", If, [
                          m(o(C), {
                            icon: "tabler:star",
                            class: "km-i-xs",
                            "aria-hidden": "true"
                          }),
                          P(" " + c(y.favorites_count), 1)
                        ])) : h("", !0),
                        y.license ? (a(), u("span", {
                          key: 1,
                          class: "foot-stat km-dim",
                          title: y.license
                        }, c(o(Fn)(y.license)), 9, _f)) : h("", !0),
                        y.update_time ? (a(), u("span", xf, c(o(Tn)(y.update_time, { maxUnit: "year" })), 1)) : h("", !0)
                      ])
                    ])
                  ], 12, pf))), 128))
                ])
              ], 2)
            ], 64)) : !o(Xe) && o(Ft).length === 0 ? (a(), u("div", Of, [
              m(o(C), {
                icon: "tabler:package-off",
                class: "km-i-xl km-dim km-block",
                "aria-hidden": "true"
              }),
              l("p", Lf, [
                O[28] || (O[28] = P(" No modules tagged ", -1)),
                l("code", zf, c(o(n)), 1),
                O[29] || (O[29] = P(" are published yet. ", -1))
              ])
            ])) : !o(Xe) && o($) ? (a(), u("div", Af, [...O[30] || (O[30] = [
              l("p", { class: "km-muted" }, "No available modules match this filter.", -1)
            ])])) : o(Xe) ? h("", !0) : (a(), u("div", Mf, [
              m(o(C), {
                icon: "tabler:circle-check",
                class: "km-i-xl km-dim km-block",
                "aria-hidden": "true"
              }),
              l("p", Pf, [
                O[31] || (O[31] = P(" All ", -1)),
                l("code", Ff, c(o(n)), 1),
                O[32] || (O[32] = P(" modules are installed — manage them under Installed below. ", -1))
              ])
            ]))
          ]),
          o(nt).length > 0 || o(Ze) ? (a(), u("section", Tf, [
            l("button", {
              class: "km-collapse-head",
              "aria-expanded": o(Ye),
              onClick: O[6] || (O[6] = (y) => Ye.value = !o(Ye))
            }, [
              m(o(C), {
                icon: o(Ye) ? "tabler:chevron-down" : "tabler:chevron-right",
                class: "km-i",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              O[33] || (O[33] = l("span", { class: "km-h2" }, "Installed", -1)),
              l("span", Vf, [
                P(c(o(Y).length), 1),
                o(Y).length !== o(ot) ? (a(), u(X, { key: 0 }, [
                  P(" of " + c(o(ot)), 1)
                ], 64)) : h("", !0),
                P(" module" + c(o(Y).length === 1 ? "" : "s"), 1)
              ]),
              o(He) > 0 && o(He) !== o(ot) ? (a(), u("span", Df, c(o(Tt)) + " of " + c(o(He)) + " hub module" + c(o(He) === 1 ? "" : "s"), 1)) : h("", !0),
              o(Te).length ? (a(), u("span", Rf, c(o(Te).length) + " update" + c(o(Te).length === 1 ? "" : "s"), 1)) : h("", !0)
            ], 8, Ef),
            o(Ye) ? (a(), u(X, { key: 0 }, [
              o(Ze) ? (a(), u("div", Bf, c(o(Ze)), 1)) : h("", !0),
              o(nt).length > 0 ? (a(), u("div", Hf, [
                De(l("input", {
                  "onUpdate:modelValue": O[7] || (O[7] = (y) => Lt(Ge) ? Ge.value = y : null),
                  class: "km-input km-filter inst-filter",
                  placeholder: "Search installed…",
                  "aria-label": "Search installed modules"
                }, null, 512), [
                  [xn, o(Ge)]
                ]),
                m(o(Ln), {
                  modelValue: o(bt),
                  "onUpdate:modelValue": O[8] || (O[8] = (y) => Lt(bt) ? bt.value = y : null),
                  class: "km-sort",
                  options: [
                    { label: "All installed", value: "all" },
                    { label: "Root only", value: "root" },
                    { label: "Transitive only", value: "transitive" },
                    { label: "Local replacements", value: "local" }
                  ],
                  "option-label": "label",
                  "option-value": "value",
                  "aria-label": "Filter installed modules"
                }, null, 8, ["modelValue"])
              ])) : h("", !0),
              o(Y).length > 0 ? (a(), u("div", jf, [
                (a(!0), u(X, null, se(o(Y), (y) => (a(), u("button", {
                  key: y.id,
                  class: "inst-row",
                  style: Nt({ "--accent": o(ke)(y) }),
                  onClick: (Ue) => o(ht)(y)
                }, [
                  O[35] || (O[35] = l("span", {
                    class: "inst-strip",
                    "aria-hidden": "true"
                  }, null, -1)),
                  l("div", Nf, [
                    m(o(C), {
                      icon: o(st)(y),
                      class: "km-i",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"])
                  ]),
                  l("div", Kf, [
                    l("div", qf, [
                      l("span", Gf, c(y.component), 1),
                      o(dn)(o(de)(y.component)) ? (a(), u("span", Wf, "app")) : h("", !0),
                      l("span", {
                        class: ne(o(Et)(y) ? "badge-installed kx-tag-caps" : "km-chip")
                      }, c(o(Ee)(y)), 3),
                      o(fe)(y) ? (a(), u("span", Zf, [
                        m(o(C), {
                          icon: "tabler:lock",
                          class: "km-i-xs",
                          "aria-hidden": "true"
                        }),
                        O[34] || (O[34] = P(" private", -1))
                      ])) : h("", !0),
                      y.source ? (a(), u("span", Yf, c(y.source), 1)) : h("", !0),
                      o(Je)(y) && o(Je)(y)?.status !== "current" ? (a(), u("span", {
                        key: 3,
                        class: ne(["inst-update", o(Je)(y)?.status]),
                        title: o(Je)(y)?.message || ""
                      }, [
                        m(o(C), {
                          icon: o(Vt)(y),
                          class: ne(["km-i-xs", o(Ct)(y) && "spin"]),
                          "aria-hidden": "true"
                        }, null, 8, ["icon", "class"]),
                        P(" " + c(o(on)(y)), 1)
                      ], 10, Xf)) : h("", !0)
                    ]),
                    l("div", Jf, [
                      P(c(y.id) + " ", 1),
                      o(at)(y) ? (a(), u("span", Qf, " · " + c(o(at)(y)), 1)) : h("", !0)
                    ]),
                    o(Je)(y)?.message ? (a(), u("div", em, c(o(Je)(y)?.message), 1)) : h("", !0)
                  ]),
                  l("span", tm, c(o(ft)(y)), 1),
                  l("span", nm, c(o(lt)(y)), 1),
                  l("div", om, [
                    o(Je)(y)?.status === "available" || o(Ct)(y) ? (a(), u("button", {
                      key: 0,
                      class: "km-icon-btn",
                      disabled: o(Ct)(y) || o(Be),
                      "aria-label": `Update ${y.component}`,
                      onClick: _n((Ue) => o(je)(y), ["stop"])
                    }, [
                      m(o(C), {
                        icon: o(Vt)(y),
                        class: ne(["km-i", o(Ct)(y) && "spin"]),
                        "aria-hidden": "true"
                      }, null, 8, ["icon", "class"])
                    ], 8, im)) : o(vt)(y) ? (a(), u("button", {
                      key: 1,
                      class: "km-icon-btn",
                      disabled: o(Be),
                      "aria-label": `Open update planner for ${y.component}`,
                      onClick: _n((Ue) => o(It)(y), ["stop"])
                    }, [
                      m(o(C), {
                        icon: "tabler:refresh-dot",
                        class: "km-i",
                        "aria-hidden": "true"
                      })
                    ], 8, sm)) : (a(), u("button", {
                      key: 2,
                      class: "km-icon-btn",
                      disabled: "",
                      title: o(gt)(y),
                      "aria-label": `Cannot update ${y.component}: ${o(gt)(y)}`
                    }, [
                      m(o(C), {
                        icon: "tabler:refresh-off",
                        class: "km-i",
                        "aria-hidden": "true"
                      })
                    ], 8, am)),
                    o(ve)(y) ? (a(), u("button", {
                      key: 3,
                      class: "km-icon-btn km-danger",
                      "aria-label": `Uninstall ${y.component}`,
                      onClick: _n((Ue) => o(Zt)(y), ["stop"])
                    }, [
                      m(o(C), {
                        icon: "tabler:trash",
                        class: "km-i",
                        "aria-hidden": "true"
                      })
                    ], 8, lm)) : (a(), u("button", {
                      key: 4,
                      class: "km-icon-btn",
                      disabled: "",
                      title: o(Me)(y),
                      "aria-label": `Cannot uninstall ${y.component}: ${o(Me)(y)}`
                    }, [
                      m(o(C), {
                        icon: "tabler:trash-off",
                        class: "km-i",
                        "aria-hidden": "true"
                      })
                    ], 8, rm))
                  ]),
                  m(o(C), {
                    icon: "tabler:chevron-right",
                    class: "km-i km-chev",
                    "aria-hidden": "true"
                  })
                ], 12, Uf))), 128))
              ])) : o(nt).length > 0 ? (a(), u("div", um, [
                m(o(C), {
                  icon: "tabler:filter-off",
                  class: "km-i-xl km-dim km-block",
                  "aria-hidden": "true"
                }),
                O[36] || (O[36] = l("p", { class: "km-muted" }, "No installed modules match this filter.", -1))
              ])) : h("", !0)
            ], 64)) : h("", !0)
          ])) : h("", !0)
        ]))
      ])),
      o(we) ? (a(), ce(Rd, {
        key: 4,
        open: !0,
        mode: o(we).mode,
        component: o(we).component,
        version: o(we).version,
        "current-id": o(we).currentId,
        "catalog-item": o(we).catalogItem,
        "installed-dep": o(we).installedDep,
        onClose: o(rt),
        onChanged: o(sn)
      }, null, 8, ["mode", "component", "version", "current-id", "catalog-item", "installed-dep", "onClose", "onChanged"])) : h("", !0),
      m(o(Ko), {
        visible: o(ut),
        "onUpdate:visible": O[11] || (O[11] = (y) => Lt(ut) ? ut.value = y : null),
        modal: "",
        closable: !o(ye),
        "dismissable-mask": !o(ye),
        "close-on-escape": !o(ye),
        class: "km-dialog",
        pt: { header: { class: "km-modal-head" }, content: { class: "km-dialog-content" }, footer: { class: "km-modal-foot" } },
        style: { width: "min(560px, calc(100vw - 40px))" }
      }, {
        header: ee(() => [...O[37] || (O[37] = [
          l("span", null, "Uninstall module", -1)
        ])]),
        footer: ee(() => [
          m(o(le), {
            size: "small",
            severity: "secondary",
            text: "",
            disabled: o(ye),
            onClick: O[10] || (O[10] = (y) => ut.value = !1)
          }, {
            default: ee(() => [...O[50] || (O[50] = [
              P("Cancel", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m(o(le), {
            size: "small",
            severity: "secondary",
            outlined: "",
            disabled: o(ye) || o(et),
            onClick: o(wt)
          }, {
            default: ee(() => [
              m(o(C), {
                icon: o(et) ? "tabler:loader-2" : "tabler:eye",
                class: ne(["km-i", o(et) && "spin"]),
                "aria-hidden": "true"
              }, null, 8, ["icon", "class"]),
              O[51] || (O[51] = P(" Preview ", -1))
            ]),
            _: 1
          }, 8, ["disabled", "onClick"]),
          m(o(le), {
            size: "small",
            severity: "danger",
            disabled: !!o(Ie),
            title: o(Ie) || void 0,
            onClick: o(Ot)
          }, {
            default: ee(() => [
              m(o(C), {
                icon: o(ye) ? "tabler:loader-2" : "tabler:trash",
                class: ne(["km-i", o(ye) && "spin"]),
                "aria-hidden": "true"
              }, null, 8, ["icon", "class"]),
              O[52] || (O[52] = P(" Uninstall ", -1))
            ]),
            _: 1
          }, 8, ["disabled", "title", "onClick"])
        ]),
        default: ee(() => [
          l("div", dm, [
            l("p", cm, [
              O[38] || (O[38] = P(" Uninstall ", -1)),
              l("code", pm, c(o(dt)?.component), 1),
              l("span", fm, "(" + c(o(dt)?.id) + ")", 1)
            ]),
            l("div", null, [
              O[39] || (O[39] = l("label", { class: "km-label" }, "Migration policy", -1)),
              m(o(Ln), {
                modelValue: o(Qe),
                "onUpdate:modelValue": O[9] || (O[9] = (y) => Lt(Qe) ? Qe.value = y : null),
                class: "km-sort km-w-full",
                options: o(i),
                "option-label": "label",
                "option-value": "value",
                "aria-label": "Uninstall migration policy"
              }, null, 8, ["modelValue", "options"]),
              O[40] || (O[40] = l("p", { class: "km-req-desc" }, [
                P("Default "),
                l("code", { class: "km-mono" }, "block"),
                P(". Choose "),
                l("code", { class: "km-mono" }, "down"),
                P(" only if the module's down migrations are safe; data loss is possible.")
              ], -1))
            ]),
            o(_t) ? (a(), u("div", mm, [
              o(Ce) ? (a(), u("span", hm, c(o(Ce)), 1)) : h("", !0),
              P(c(o(_t)) + " ", 1),
              o(Dt).length ? (a(), u("div", bm, "required by: " + c(o(Dt).join(", ")), 1)) : h("", !0)
            ])) : h("", !0),
            o(xt) ? (a(), u("div", vm, [
              O[41] || (O[41] = l("strong", null, "Uninstall blocked:", -1)),
              P(" " + c(o(xt)), 1)
            ])) : h("", !0),
            o(et) ? (a(), u("div", gm, [
              m(o(C), {
                icon: "tabler:loader-2",
                class: "km-i spin km-accent",
                "aria-hidden": "true"
              }),
              O[42] || (O[42] = l("span", { class: "km-grow km-running-label" }, "Previewing uninstall", -1))
            ])) : o(be) ? (a(), u("div", ym, [
              o(be).warnings?.length ? (a(), u("div", km, [
                (a(!0), u(X, null, se(o(be).warnings, (y) => (a(), u("div", { key: y }, c(y), 1))), 128))
              ])) : h("", !0),
              o(be).removed?.length ? (a(), u("div", wm, [
                O[44] || (O[44] = l("div", { class: "km-preview-title" }, "Removed", -1)),
                (a(!0), u(X, null, se(o(be).removed, (y) => (a(), u("div", {
                  key: y.name || y.component,
                  class: "km-preview-row"
                }, [
                  m(o(C), {
                    icon: "tabler:minus",
                    class: "km-i-xs km-danger-fg",
                    "aria-hidden": "true"
                  }),
                  l("span", Sm, c(y.name || y.component), 1),
                  O[43] || (O[43] = l("span", { class: "km-grow" }, null, -1)),
                  l("span", $m, c(y.version), 1)
                ]))), 128))
              ])) : h("", !0),
              o(be).kept?.length ? (a(), u("div", Cm, [
                O[46] || (O[46] = l("div", { class: "km-preview-title" }, "Kept, still needed", -1)),
                (a(!0), u(X, null, se(o(be).kept, (y) => (a(), u("div", {
                  key: y.name || y.component,
                  class: "km-preview-row"
                }, [
                  m(o(C), {
                    icon: "tabler:lock",
                    class: "km-i-xs km-dim",
                    "aria-hidden": "true"
                  }),
                  l("span", Im, c(y.name || y.component), 1),
                  O[45] || (O[45] = l("span", { class: "km-grow" }, null, -1)),
                  l("span", _m, c(y.version), 1)
                ]))), 128))
              ])) : h("", !0),
              o(be).kept_under_uncertainty?.length ? (a(), u("div", xm, [
                O[48] || (O[48] = l("div", { class: "km-preview-title" }, "Kept because usage is unclear", -1)),
                (a(!0), u(X, null, se(o(be).kept_under_uncertainty, (y) => (a(), u("div", {
                  key: y.name || y.component,
                  class: "km-preview-row"
                }, [
                  m(o(C), {
                    icon: "tabler:help",
                    class: "km-i-xs km-dim",
                    "aria-hidden": "true"
                  }),
                  l("span", Om, c(y.name || y.component), 1),
                  O[47] || (O[47] = l("span", { class: "km-grow" }, null, -1)),
                  l("span", Lm, c(y.reason || y.version), 1)
                ]))), 128))
              ])) : h("", !0)
            ])) : h("", !0),
            o(Wt).length ? (a(), u("div", zm, [
              O[49] || (O[49] = l("div", { class: "km-panel-title" }, "Uninstall steps", -1)),
              (a(!0), u(X, null, se(o(Wt), (y, Ue) => (a(), u("div", {
                key: `${y.step}-${Ue}`,
                class: ne(["km-ledger-row", y.status === "failed" || y.status === "rollback_failed" ? "km-ledger-bad" : y.status === "rolled_back" ? "km-ledger-warn" : "km-ledger-ok"])
              }, [
                l("span", Am, c(Ue + 1), 1),
                l("span", Mm, c(o(Yt)(y)), 1),
                l("span", Pm, c(y.status), 1),
                y.message ? (a(), u("span", Fm, c(y.message), 1)) : h("", !0)
              ], 2))), 128))
            ])) : h("", !0),
            o(ye) ? (a(), u("div", Tm, [
              m(o(C), {
                icon: "tabler:loader-2",
                class: "km-i spin km-accent",
                "aria-hidden": "true"
              }),
              l("span", Em, c(o(Rt)), 1),
              l("span", Vm, c(o(Bt)) + "s", 1)
            ])) : h("", !0)
          ])
        ]),
        _: 1
      }, 8, ["visible", "closable", "dismissable-mask", "close-on-escape"])
    ]));
  }
}), Km = {
  rootComponent: Dm,
  plugins: [Si]
};
export {
  Km as mountConfig
};
//# sourceMappingURL=lazy-mount-CN8yCrPq.js.map
