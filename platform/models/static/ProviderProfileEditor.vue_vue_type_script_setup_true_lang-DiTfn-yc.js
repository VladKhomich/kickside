import { openBlock as l, createElementBlock as p, mergeProps as v, createElementVNode as c, renderSlot as P, createTextVNode as N, toDisplayString as S, resolveComponent as q, resolveDirective as st, withDirectives as ut, createBlock as k, resolveDynamicComponent as ct, withCtx as y, createCommentVNode as m, normalizeClass as A, defineComponent as F, computed as $, unref as u, createVNode as g, ref as bt, reactive as pt, watch as gt, withModifiers as ht, Fragment as L, renderList as U } from "vue";
import { Icon as j } from "@iconify/vue";
import { E as vt } from "./provider-tags-C0mtMONl.js";
import { a as mt, B as W, y as Z, g as G, s as Y, f as O, R as ft } from "./wc-runtime-CHL0PH8L.js";
var Q = {
  name: "SpinnerIcon",
  extends: mt
};
function yt(t) {
  return xt(t) || $t(t) || wt(t) || kt();
}
function kt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wt(t, n) {
  if (t) {
    if (typeof t == "string") return K(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? K(t, n) : void 0;
  }
}
function $t(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function xt(t) {
  if (Array.isArray(t)) return K(t);
}
function K(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function St(t, n, e, o, b, a) {
  return l(), p("svg", v({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), yt(n[0] || (n[0] = [c("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Q.render = St;
var _t = `
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
`, Pt = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": G(e.value) && String(e.value).length === 1,
      "p-badge-dot": Z(e.value) && !o.$slots.default,
      "p-badge-sm": e.size === "small",
      "p-badge-lg": e.size === "large",
      "p-badge-xl": e.size === "xlarge",
      "p-badge-info": e.severity === "info",
      "p-badge-success": e.severity === "success",
      "p-badge-warn": e.severity === "warn",
      "p-badge-danger": e.severity === "danger",
      "p-badge-secondary": e.severity === "secondary",
      "p-badge-contrast": e.severity === "contrast"
    }];
  }
}, Ct = W.extend({
  name: "badge",
  style: _t,
  classes: Pt
}), It = {
  name: "BaseBadge",
  extends: Y,
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
  style: Ct,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function T(t) {
  "@babel/helpers - typeof";
  return T = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, T(t);
}
function X(t, n, e) {
  return (n = Vt(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Vt(t) {
  var n = At(t, "string");
  return T(n) == "symbol" ? n : n + "";
}
function At(t, n) {
  if (T(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (T(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var tt = {
  name: "Badge",
  extends: It,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return O(X(X({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ft = ["data-p"];
function Bt(t, n, e, o, b, a) {
  return l(), p("span", v({
    class: t.cx("root"),
    "data-p": a.dataP
  }, t.ptmi("root")), [P(t.$slots, "default", {}, function() {
    return [N(S(t.value), 1)];
  })], 16, Ft);
}
tt.render = Bt;
var Ot = `
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
function z(t) {
  "@babel/helpers - typeof";
  return z = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, z(t);
}
function w(t, n, e) {
  return (n = Tt(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Tt(t) {
  var n = zt(t, "string");
  return z(n) == "symbol" ? n : n + "";
}
function zt(t, n) {
  if (z(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (z(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Et = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-button p-component", w(w(w(w(w(w(w(w(w({
      "p-button-icon-only": e.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", e.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(n) {
    var e = n.props;
    return ["p-button-icon", w({}, "p-button-icon-".concat(e.iconPos), e.label)];
  },
  label: "p-button-label"
}, Nt = W.extend({
  name: "button",
  style: Ot,
  classes: Et
}), jt = {
  name: "BaseButton",
  extends: Y,
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
  style: Nt,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function E(t) {
  "@babel/helpers - typeof";
  return E = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, E(t);
}
function h(t, n, e) {
  return (n = Rt(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Rt(t) {
  var n = Lt(t, "string");
  return E(n) == "symbol" ? n : n + "";
}
function Lt(t, n) {
  if (E(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (E(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var nt = {
  name: "Button",
  extends: jt,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(n) {
      var e = n === "root" ? this.ptmi : this.ptm;
      return e(n, {
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
      return v(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return Z(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return O(h(h(h(h(h(h(h(h(h(h({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return O(h(h({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return O(h(h({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Q,
    Badge: tt
  },
  directives: {
    ripple: ft
  }
}, Ut = ["data-p"], Dt = ["data-p"];
function Gt(t, n, e, o, b, a) {
  var x = q("SpinnerIcon"), _ = q("Badge"), C = st("ripple");
  return t.asChild ? P(t.$slots, "default", {
    key: 1,
    class: A(t.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : ut((l(), k(ct(t.as), v({
    key: 0,
    class: t.cx("root"),
    "data-p": a.dataP
  }, a.attrs), {
    default: y(function() {
      return [P(t.$slots, "default", {}, function() {
        return [t.loading ? P(t.$slots, "loadingicon", v({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (l(), p("span", v({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (l(), k(x, v({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : P(t.$slots, "icon", v({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (l(), p("span", v({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": a.dataIconP
          }, t.ptm("icon")), null, 16, Ut)) : m("", !0)];
        }), t.label ? (l(), p("span", v({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": a.dataLabelP
        }), S(t.label), 17, Dt)) : m("", !0), t.badge ? (l(), k(_, {
          key: 3,
          value: t.badge,
          class: A(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : m("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[C]]);
}
nt.render = Gt;
const D = /* @__PURE__ */ F({
  __name: "Button",
  props: {
    icon: {},
    variant: { default: "primary" },
    type: { default: "button" },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    small: { type: Boolean }
  },
  emits: ["click"],
  setup(t, { emit: n }) {
    const e = t, o = n, b = $(
      () => e.variant === "danger" ? "danger" : e.variant === "primary" ? void 0 : "secondary"
    );
    return (a, x) => (l(), k(u(nt), {
      type: t.type,
      severity: b.value,
      outlined: t.variant === "ghost",
      loading: t.loading,
      disabled: t.disabled || t.loading,
      size: t.small ? "small" : void 0,
      onClick: x[0] || (x[0] = (_) => o("click"))
    }, {
      default: y(() => [
        t.icon && !t.loading ? (l(), k(u(j), {
          key: 0,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : m("", !0),
        P(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["type", "severity", "outlined", "loading", "disabled", "size"]));
  }
});
var Kt = {
  name: "BaseEditableHolder",
  extends: Y,
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
      handler: function(n) {
        this.d_value = n;
      }
    },
    defaultValue: function(n) {
      this.d_value = n;
    },
    $formName: {
      immediate: !0,
      handler: function(n) {
        var e, o;
        this.formField = ((e = this.$pcForm) === null || e === void 0 || (o = e.register) === null || o === void 0 ? void 0 : o.call(e, n, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(n) {
        var e, o;
        this.formField = ((e = this.$pcForm) === null || e === void 0 || (o = e.register) === null || o === void 0 ? void 0 : o.call(e, this.$formName, n)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(n) {
        this.d_value !== n && (this.d_value = n);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(n) {
        var e;
        (e = this.$pcForm) !== null && e !== void 0 && e.getFieldState(this.$formName) && n !== this.d_value && (this.d_value = n);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(n, e) {
      var o, b;
      this.controlled && (this.d_value = n, this.$emit("update:modelValue", n)), this.$emit("value-change", n), (o = (b = this.formField).onChange) === null || o === void 0 || o.call(b, {
        originalEvent: e,
        value: n
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var n = arguments.length, e = new Array(n), o = 0; o < n; o++)
        e[o] = arguments[o];
      return e.find(G);
    }
  },
  computed: {
    $filled: function() {
      return G(this.d_value);
    },
    $invalid: function() {
      var n, e;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (n = this.$pcFormField) === null || n === void 0 || (n = n.$field) === null || n === void 0 ? void 0 : n.invalid, (e = this.$pcForm) === null || e === void 0 || (e = e.getFieldState(this.$formName)) === null || e === void 0 ? void 0 : e.invalid);
    },
    $formName: function() {
      var n;
      return this.$formNovalidate ? void 0 : this.name || ((n = this.$formControl) === null || n === void 0 ? void 0 : n.name);
    },
    $formControl: function() {
      var n;
      return this.formControl || ((n = this.$pcFormField) === null || n === void 0 ? void 0 : n.formControl);
    },
    $formNovalidate: function() {
      var n;
      return (n = this.$formControl) === null || n === void 0 ? void 0 : n.novalidate;
    },
    $formDefaultValue: function() {
      var n, e;
      return this.findNonEmpty(this.d_value, (n = this.$pcFormField) === null || n === void 0 ? void 0 : n.initialValue, (e = this.$pcForm) === null || e === void 0 || (e = e.initialValues) === null || e === void 0 ? void 0 : e[this.$formName]);
    },
    $formValue: function() {
      var n, e;
      return this.findNonEmpty((n = this.$pcFormField) === null || n === void 0 || (n = n.$field) === null || n === void 0 ? void 0 : n.value, (e = this.$pcForm) === null || e === void 0 || (e = e.getFieldState(this.$formName)) === null || e === void 0 ? void 0 : e.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
};
const Mt = { class: "km-field" }, Wt = { class: "km-field-label" }, Yt = {
  key: 0,
  class: "km-field-help"
}, I = /* @__PURE__ */ F({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(t) {
    return (n, e) => (l(), p("label", Mt, [
      c("span", Wt, S(t.label), 1),
      P(n.$slots, "default"),
      t.help ? (l(), p("small", Yt, S(t.help), 1)) : m("", !0)
    ]));
  }
}), Jt = ["type", "value", "placeholder", "readonly", "disabled", "autocomplete", "min", "max", "step"], V = /* @__PURE__ */ F({
  __name: "TextInput",
  props: {
    modelValue: {},
    type: { default: "text" },
    placeholder: {},
    readonly: { type: Boolean },
    disabled: { type: Boolean },
    autocomplete: {},
    min: {},
    max: {},
    step: {},
    mono: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: n }) {
    const e = n;
    function o(b) {
      const a = b.target;
      e("update:modelValue", a.value);
    }
    return (b, a) => (l(), p("input", {
      class: A(["km-input", t.mono && "mono"]),
      type: t.type,
      value: t.modelValue,
      placeholder: t.placeholder,
      readonly: t.readonly,
      disabled: t.disabled,
      autocomplete: t.autocomplete,
      min: t.min,
      max: t.max,
      step: t.step,
      onInput: o
    }, null, 42, Jt));
  }
});
var Ht = `
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`, qt = {
  root: {
    position: "relative"
  }
}, Xt = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-toggleswitch p-component", {
      "p-toggleswitch-checked": e.checked,
      "p-disabled": o.disabled,
      "p-invalid": e.$invalid
    }];
  },
  input: "p-toggleswitch-input",
  slider: "p-toggleswitch-slider",
  handle: "p-toggleswitch-handle"
}, Zt = W.extend({
  name: "toggleswitch",
  style: Ht,
  classes: Xt,
  inlineStyles: qt
}), Qt = {
  name: "BaseToggleSwitch",
  extends: Kt,
  props: {
    trueValue: {
      type: null,
      default: !0
    },
    falseValue: {
      type: null,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: null
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
    ariaLabelledby: {
      type: String,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    }
  },
  style: Zt,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, et = {
  name: "ToggleSwitch",
  extends: Qt,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur"],
  methods: {
    getPTOptions: function(n) {
      var e = n === "root" ? this.ptmi : this.ptm;
      return e(n, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function(n) {
      if (!this.disabled && !this.readonly) {
        var e = this.checked ? this.falseValue : this.trueValue;
        this.writeValue(e, n), this.$emit("change", n);
      }
    },
    onFocus: function(n) {
      this.$emit("focus", n);
    },
    onBlur: function(n) {
      var e, o;
      this.$emit("blur", n), (e = (o = this.formField).onBlur) === null || e === void 0 || e.call(o, n);
    }
  },
  computed: {
    checked: function() {
      return this.d_value === this.trueValue;
    },
    dataP: function() {
      return O({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, tn = ["data-p-checked", "data-p-disabled", "data-p"], nn = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], en = ["data-p"], on = ["data-p"];
function rn(t, n, e, o, b, a) {
  return l(), p("div", v({
    class: t.cx("root"),
    style: t.sx("root")
  }, a.getPTOptions("root"), {
    "data-p-checked": a.checked,
    "data-p-disabled": t.disabled,
    "data-p": a.dataP
  }), [c("input", v({
    id: t.inputId,
    type: "checkbox",
    role: "switch",
    class: [t.cx("input"), t.inputClass],
    style: t.inputStyle,
    checked: a.checked,
    tabindex: t.tabindex,
    disabled: t.disabled,
    readonly: t.readonly,
    "aria-checked": a.checked,
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel,
    "aria-invalid": t.invalid || void 0,
    onFocus: n[0] || (n[0] = function() {
      return a.onFocus && a.onFocus.apply(a, arguments);
    }),
    onBlur: n[1] || (n[1] = function() {
      return a.onBlur && a.onBlur.apply(a, arguments);
    }),
    onChange: n[2] || (n[2] = function() {
      return a.onChange && a.onChange.apply(a, arguments);
    })
  }, a.getPTOptions("input")), null, 16, nn), c("div", v({
    class: t.cx("slider")
  }, a.getPTOptions("slider"), {
    "data-p": a.dataP
  }), [c("div", v({
    class: t.cx("handle")
  }, a.getPTOptions("handle"), {
    "data-p": a.dataP
  }), [P(t.$slots, "handle", {
    checked: a.checked
  })], 16, on)], 16, en)], 16, tn);
}
et.render = rn;
const dn = {
  key: 0,
  class: "km-switch-label"
}, an = /* @__PURE__ */ F({
  __name: "Toggle",
  props: {
    modelValue: { type: Boolean },
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: n }) {
    const e = t, o = n, b = $({
      get: () => e.modelValue,
      set: (a) => o("update:modelValue", a)
    });
    return (a, x) => (l(), p("label", {
      class: A(["km-switch", { disabled: t.disabled }])
    }, [
      g(u(et), {
        modelValue: b.value,
        "onUpdate:modelValue": x[0] || (x[0] = (_) => b.value = _),
        disabled: t.disabled
      }, null, 8, ["modelValue", "disabled"]),
      t.label ? (l(), p("span", dn, S(t.label), 1)) : m("", !0)
    ], 2));
  }
}), ln = /* @__PURE__ */ F({
  __name: "Avatar",
  props: {
    icon: {},
    size: { default: "md" }
  },
  setup(t) {
    return (n, e) => (l(), p("span", {
      class: A(["km-avatar", t.size !== "md" && t.size])
    }, [
      g(u(j), {
        icon: t.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])
    ], 2));
  }
}), M = {
  openai_compat: {
    key: "openai_compat",
    title: "OpenAI Compatible",
    subtitle: "Chat Completions compatible endpoints, including local and hosted providers.",
    defaultProviderId: "wippy.llm.openai_compat:provider",
    icon: "tabler:plug",
    fields: [
      { key: "base_url", label: "Base URL", placeholder: "http://localhost:11434/v1", section: "endpoint", help: "Your endpoint v1 root." },
      { key: "api_key", label: "API key", type: "password", section: "auth", secret: !0, help: "Optional for local endpoints." },
      { key: "test_model", label: "Test model", placeholder: "gemma-4-12b", section: "advanced", help: "Probe model for Test connection; auto-picked from discovery when blank." },
      { key: "api_key_env", label: "API key env", placeholder: "OPENROUTER_API_KEY", section: "advanced" },
      { key: "organization", label: "Organization", section: "advanced" },
      { key: "timeout", label: "Timeout", type: "number", section: "advanced" }
    ]
  },
  openai: {
    key: "openai",
    title: "OpenAI",
    subtitle: "Native OpenAI Responses and embeddings provider.",
    defaultProviderId: "wippy.llm.openai:provider",
    icon: "tabler:brand-openai",
    fields: [
      { key: "api_key", label: "API key", type: "password", section: "auth", secret: !0 },
      { key: "base_url", label: "Base URL", placeholder: "https://api.openai.com/v1", section: "advanced" },
      { key: "test_model", label: "Test model", placeholder: "gpt-4o-mini", section: "advanced", help: "Probe model for Test connection; auto-picked when blank." },
      { key: "api_key_env", label: "API key env", placeholder: "OPENAI_API_KEY", section: "advanced" },
      { key: "organization", label: "Organization", section: "advanced" },
      { key: "timeout", label: "Timeout", type: "number", section: "advanced" }
    ]
  },
  anthropic: {
    key: "anthropic",
    title: "Anthropic",
    subtitle: "Claude Messages API provider with model discovery.",
    defaultProviderId: "wippy.llm.claude:provider",
    icon: "tabler:hexagon-letter-c",
    fields: [
      { key: "api_key", label: "API key", type: "password", section: "auth", secret: !0 },
      { key: "base_url", label: "Base URL", placeholder: "https://api.anthropic.com", section: "advanced" },
      { key: "api_key_env", label: "API key env", placeholder: "ANTHROPIC_API_KEY", section: "advanced" },
      { key: "api_version", label: "API version", placeholder: "2023-06-01", section: "advanced" },
      { key: "timeout", label: "Timeout", type: "number", section: "advanced" }
    ]
  },
  google_genai: {
    key: "google_genai",
    title: "Google Gemini",
    subtitle: "Gemini Developer API using API-key auth and models.list discovery.",
    defaultProviderId: "wippy.llm.google.generative_ai:provider",
    icon: "tabler:brand-google",
    fields: [
      { key: "api_key", label: "API key", type: "password", section: "auth", secret: !0 },
      { key: "base_url", label: "Base URL", placeholder: "https://generativelanguage.googleapis.com/v1beta/models", section: "advanced" },
      { key: "api_key_env", label: "API key env", placeholder: "GEMINI_API_KEY", section: "advanced" },
      { key: "timeout", label: "Timeout", type: "number", section: "advanced" }
    ]
  },
  google_vertex: {
    key: "google_vertex",
    title: "Google Vertex AI",
    subtitle: "Vertex context for explicit model overlays using project, location, and Google credentials.",
    defaultProviderId: "wippy.llm.google.vertex:provider",
    icon: "tabler:cloud",
    fields: [
      { key: "project", label: "Project", placeholder: "my-gcp-project", section: "endpoint", help: "Required unless the service-account JSON has project_id." },
      { key: "location", label: "Location", placeholder: "us-central1", section: "endpoint", help: "Required for Vertex model calls." },
      { key: "google_credentials", label: "Service account JSON/base64", type: "password", section: "auth", secret: !0, help: "Refreshable by the models token supervisor." },
      { key: "project_env", label: "Project env", placeholder: "GOOGLE_CLOUD_PROJECT", section: "advanced" },
      { key: "location_env", label: "Location env", placeholder: "VERTEX_AI_LOCATION", section: "advanced" },
      { key: "google_credentials_env", label: "Credentials env", placeholder: "GOOGLE_CREDENTIALS", section: "advanced", help: "Optional pointer to service-account JSON/base64." },
      { key: "access_token", label: "Access token", type: "password", section: "advanced", secret: !0, help: "For externally rotated tokens only." },
      { key: "access_token_env", label: "Access token env", placeholder: "GOOGLE_ACCESS_TOKEN", section: "advanced", help: "The supervisor does not refresh direct access tokens." },
      { key: "base_url", label: "Base URL override", placeholder: "https://us-central1-aiplatform.googleapis.com/v1", section: "advanced" },
      { key: "timeout", label: "Timeout", type: "number", section: "advanced" }
    ]
  },
  bedrock: {
    key: "bedrock",
    title: "AWS Bedrock",
    subtitle: "Bedrock Converse and InvokeModel through AWS SigV4.",
    defaultProviderId: "wippy.llm.bedrock:provider",
    icon: "tabler:brand-aws",
    fields: [
      { key: "region", label: "Region", placeholder: "us-east-1", section: "endpoint" },
      { key: "access_key", label: "Access key", type: "password", section: "auth", secret: !0 },
      { key: "secret_key", label: "Secret key", type: "password", section: "auth", secret: !0 },
      { key: "region_env", label: "Region env", placeholder: "AWS_REGION", section: "advanced" },
      { key: "access_key_env", label: "Access key env", placeholder: "AWS_ACCESS_KEY_ID", section: "advanced" },
      { key: "secret_key_env", label: "Secret key env", placeholder: "AWS_SECRET_ACCESS_KEY", section: "advanced" },
      { key: "session_token", label: "Session token", type: "password", section: "advanced", secret: !0 },
      { key: "session_token_env", label: "Session token env", placeholder: "AWS_SESSION_TOKEN", section: "advanced" },
      { key: "bedrock_provider", label: "Discovery provider filter", placeholder: "Anthropic", section: "advanced" },
      { key: "base_url", label: "Base URL override", placeholder: "https://bedrock.us-east-1.amazonaws.com", section: "advanced" },
      { key: "timeout", label: "Timeout", type: "number", section: "advanced" }
    ]
  }
}, ot = vt;
function sn(t) {
  return t && ot[t] || "openai_compat";
}
function Vn(t) {
  return !!(t && ot[t]);
}
function An(t) {
  return M[sn(t)];
}
const un = { class: "km-editor-head" }, cn = { class: "km-editor-head-text" }, bn = { class: "km-editor-head-title" }, pn = { class: "km-editor-head-sub" }, gn = { class: "km-form-sec" }, hn = { class: "km-form-grid" }, vn = {
  key: 0,
  class: "km-form-sec"
}, mn = { class: "km-form-grid" }, fn = {
  key: 1,
  class: "km-form-sec"
}, yn = { class: "km-form-grid" }, kn = ["aria-expanded"], wn = {
  key: 2,
  class: "km-form-sec"
}, $n = { class: "km-form-grid" }, xn = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, Sn = { class: "km-form-foot" }, Fn = /* @__PURE__ */ F({
  __name: "ProviderProfileEditor",
  props: {
    mode: {},
    adapter: {},
    preset: {},
    profile: {},
    saving: { type: Boolean },
    testState: {},
    specKey: {}
  },
  emits: ["save", "cancel", "test"],
  setup(t, { emit: n }) {
    const e = t, o = n, b = $(() => M[e.specKey] ?? M.openai_compat), a = $(() => e.mode === "edit"), x = $(() => a.value), _ = $(() => e.testState?.status === "testing"), C = $(() => b.value.fields), R = (s) => s.section ?? "endpoint", J = $(() => C.value.filter((s) => R(s) === "endpoint")), H = $(() => C.value.filter((s) => R(s) === "auth")), rt = $(() => C.value.filter((s) => R(s) === "advanced")), B = bt(!1), i = pt({
      id: "",
      name: "",
      provider_id: "",
      retry_attempts: 0,
      retry_backoff_ms: 0,
      enabled: !0
    });
    function dt(s, d) {
      if (s.secret) return "";
      const r = d[s.key];
      return s.type === "number" ? Number(r || 0) : r || "";
    }
    function at() {
      const s = e.profile?.config || e.preset?.config || {};
      i.id = e.profile?.id || "", i.name = e.profile?.name || e.preset?.title || b.value.title, i.provider_id = e.profile?.provider_id || e.preset?.provider_id || e.adapter?.id || b.value.defaultProviderId, i.retry_attempts = Number(s.retry?.attempts || 0), i.retry_backoff_ms = Number(s.retry?.backoff_ms || 0), i.enabled = e.profile?.enabled !== !1;
      for (const d of C.value) i[d.key] = dt(d, s);
    }
    gt(() => [e.profile, e.preset, e.adapter, e.mode, e.specKey], at, { immediate: !0 });
    function lt(s, d) {
      const r = i[d.key];
      if (d.secret) {
        typeof r == "string" && r.trim() && (s[d.key] = r);
        return;
      }
      if (d.type === "number") {
        const f = Number(r);
        Number.isFinite(f) && f > 0 && (s[d.key] = f);
        return;
      }
      if (typeof r == "string") {
        const f = r.trim();
        f && (s[d.key] = f);
        return;
      }
      r != null && r !== "" && (s[d.key] = r);
    }
    function it() {
      const s = {
        id: i.id || void 0,
        name: i.name,
        provider_id: i.provider_id,
        enabled: i.enabled
      };
      for (const d of C.value) lt(s, d);
      s.retry = {
        attempts: Math.max(0, Math.floor(Number(i.retry_attempts) || 0)),
        backoff_ms: Math.max(0, Math.floor(Number(i.retry_backoff_ms) || 0))
      }, o("save", s);
    }
    return (s, d) => (l(), p("form", {
      class: "km-form",
      onSubmit: ht(it, ["prevent"])
    }, [
      c("div", un, [
        g(u(ln), {
          icon: b.value.icon
        }, null, 8, ["icon"]),
        c("div", cn, [
          c("div", bn, S(e.preset?.title || b.value.title), 1),
          c("div", pn, S(b.value.subtitle), 1)
        ])
      ]),
      c("section", gn, [
        d[8] || (d[8] = c("div", { class: "km-form-sec-title" }, "Identity", -1)),
        c("div", hn, [
          g(u(I), { label: "Name" }, {
            default: y(() => [
              g(u(V), {
                modelValue: i.name,
                "onUpdate:modelValue": d[0] || (d[0] = (r) => i.name = r),
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          })
        ])
      ]),
      J.value.length ? (l(), p("section", vn, [
        d[9] || (d[9] = c("div", { class: "km-form-sec-title" }, "Endpoint", -1)),
        c("div", mn, [
          (l(!0), p(L, null, U(J.value, (r) => (l(), k(u(I), {
            key: r.key,
            label: r.label,
            help: r.help
          }, {
            default: y(() => [
              g(u(V), {
                modelValue: i[r.key],
                "onUpdate:modelValue": (f) => i[r.key] = f,
                type: r.type === "number" ? "number" : "text",
                placeholder: r.placeholder,
                disabled: e.saving
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "placeholder", "disabled"])
            ]),
            _: 2
          }, 1032, ["label", "help"]))), 128))
        ])
      ])) : m("", !0),
      H.value.length ? (l(), p("section", fn, [
        d[10] || (d[10] = c("div", { class: "km-form-sec-title" }, "Authentication", -1)),
        c("div", yn, [
          (l(!0), p(L, null, U(H.value, (r) => (l(), k(u(I), {
            key: r.key,
            label: r.label,
            help: r.help
          }, {
            default: y(() => [
              g(u(V), {
                modelValue: i[r.key],
                "onUpdate:modelValue": (f) => i[r.key] = f,
                type: r.type === "password" ? "password" : "text",
                placeholder: r.placeholder,
                autocomplete: r.secret ? "new-password" : void 0,
                disabled: e.saving
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "placeholder", "autocomplete", "disabled"])
            ]),
            _: 2
          }, 1032, ["label", "help"]))), 128))
        ])
      ])) : m("", !0),
      c("button", {
        type: "button",
        class: "km-adv-toggle",
        "aria-expanded": B.value,
        onClick: d[1] || (d[1] = (r) => B.value = !B.value)
      }, [
        g(u(j), {
          icon: B.value ? "tabler:chevron-down" : "tabler:chevron-right",
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        d[11] || (d[11] = c("span", null, "Advanced settings", -1))
      ], 8, kn),
      B.value ? (l(), p("section", wn, [
        c("div", $n, [
          a.value ? m("", !0) : (l(), k(u(I), {
            key: 0,
            label: "ID",
            help: "Optional; generated when left blank."
          }, {
            default: y(() => [
              g(u(V), {
                modelValue: i.id,
                "onUpdate:modelValue": d[2] || (d[2] = (r) => i.id = r),
                disabled: e.saving,
                placeholder: "auto"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          })),
          (l(!0), p(L, null, U(rt.value, (r) => (l(), k(u(I), {
            key: r.key,
            label: r.label,
            help: r.help
          }, {
            default: y(() => [
              g(u(V), {
                modelValue: i[r.key],
                "onUpdate:modelValue": (f) => i[r.key] = f,
                type: r.type === "number" ? "number" : r.type === "password" ? "password" : "text",
                placeholder: r.placeholder,
                autocomplete: r.secret ? "new-password" : void 0,
                disabled: e.saving
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "placeholder", "autocomplete", "disabled"])
            ]),
            _: 2
          }, 1032, ["label", "help"]))), 128)),
          g(u(I), { label: "Retry attempts" }, {
            default: y(() => [
              g(u(V), {
                modelValue: i.retry_attempts,
                "onUpdate:modelValue": d[3] || (d[3] = (r) => i.retry_attempts = r),
                type: "number",
                min: 0,
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          }),
          g(u(I), { label: "Retry backoff (ms)" }, {
            default: y(() => [
              g(u(V), {
                modelValue: i.retry_backoff_ms,
                "onUpdate:modelValue": d[4] || (d[4] = (r) => i.retry_backoff_ms = r),
                type: "number",
                min: 0,
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          })
        ])
      ])) : m("", !0),
      a.value ? (l(), k(u(an), {
        key: 3,
        modelValue: i.enabled,
        "onUpdate:modelValue": d[5] || (d[5] = (r) => i.enabled = r),
        label: "Enabled",
        disabled: e.saving
      }, null, 8, ["modelValue", "disabled"])) : m("", !0),
      e.testState && e.testState.status !== "idle" ? (l(), p("div", {
        key: 4,
        class: A(["km-test-result", e.testState.status])
      }, [
        _.value ? (l(), p("span", xn)) : (l(), k(u(j), {
          key: 1,
          icon: e.testState.status === "ok" ? "tabler:circle-check" : "tabler:circle-x",
          "aria-hidden": "true"
        }, null, 8, ["icon"])),
        c("span", null, S(_.value ? "Testing connection…" : e.testState.message), 1)
      ], 2)) : m("", !0),
      c("div", Sn, [
        x.value ? (l(), k(u(D), {
          key: 0,
          variant: "soft",
          icon: "tabler:plug-connected",
          loading: _.value,
          disabled: e.saving,
          onClick: d[6] || (d[6] = (r) => o("test"))
        }, {
          default: y(() => [...d[12] || (d[12] = [
            N(" Test connection ", -1)
          ])]),
          _: 1
        }, 8, ["loading", "disabled"])) : m("", !0),
        d[14] || (d[14] = c("span", { class: "km-form-foot-sp" }, null, -1)),
        g(u(D), {
          variant: "ghost",
          disabled: e.saving,
          onClick: d[7] || (d[7] = (r) => o("cancel"))
        }, {
          default: y(() => [...d[13] || (d[13] = [
            N("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        g(u(D), {
          type: "submit",
          icon: "tabler:device-floppy",
          loading: e.saving
        }, {
          default: y(() => [
            N(S(e.saving ? "Saving" : "Save provider"), 1)
          ]),
          _: 1
        }, 8, ["loading"])
      ])
    ], 32));
  }
});
export {
  ln as _,
  D as a,
  I as b,
  V as c,
  an as d,
  sn as e,
  Fn as f,
  An as g,
  Kt as h,
  Vn as i,
  Q as j,
  nt as s
};
//# sourceMappingURL=ProviderProfileEditor.vue_vue_type_script_setup_true_lang-DiTfn-yc.js.map
