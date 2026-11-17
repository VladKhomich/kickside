import { B as yt, l as Ee, s as Ie, b as jt, f as ht, R as Ae, c as Le, L as Pn, d as vt, v as $t, e as Dn, U as zn, I as ve, g as En, r as Me, h as In, i as An, j as Ln, C as Mn, k as jn, S as Rn, _ as Tn, x as Xt, m as Bn, a as On, u as Fn, n as Nn, P as Un } from "./wc-runtime-DSY_UkLU.js";
import { openBlock as l, createElementBlock as c, mergeProps as T, renderSlot as J, createTextVNode as at, toDisplayString as C, resolveComponent as Bt, resolveDirective as je, withDirectives as ct, createBlock as N, resolveDynamicComponent as Ot, withCtx as O, createCommentVNode as $, normalizeClass as V, createElementVNode as u, defineComponent as ft, computed as L, withModifiers as Jt, Fragment as W, createVNode as D, unref as r, watch as Ft, onBeforeUnmount as se, Transition as Hn, isRef as Vn, vModelText as ee, renderList as ot, vModelCheckbox as Re, vModelDynamic as Kn, ref as R, nextTick as Qt } from "vue";
import { s as qn, a as Wn, b as Yn } from "./index-DpQM1LsO.js";
import { on as Te, api as bt, host as ne, loadByTagName as Zn } from "@wippy-fe/proxy";
import { Icon as j } from "@iconify/vue";
import { e as nt, _ as Nt } from "./WcMount.vue_vue_type_script_setup_true_lang-DeFg3QZK.js";
import { a as Gn, e as Xn, b as Jn, f as Qn, d as he, v as to, c as eo, u as no, i as oo } from "./install-form-6s2z0ljk.js";
import { _ as ro } from "./AnchoredPanel.vue_vue_type_script_setup_true_lang-CU5LLZRq.js";
import { r as ao } from "./principals-Bury5BH3.js";
var io = `
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
`, so = {
  root: function(e) {
    var n = e.props, o = e.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Ie(n.value) && String(n.value).length === 1,
      "p-badge-dot": Ee(n.value) && !o.$slots.default,
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
}, lo = yt.extend({
  name: "badge",
  style: io,
  classes: so
}), uo = {
  name: "BaseBadge",
  extends: jt,
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
  style: lo,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function Dt(t) {
  "@babel/helpers - typeof";
  return Dt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Dt(t);
}
function ye(t, e, n) {
  return (e = co(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function co(t) {
  var e = bo(t, "string");
  return Dt(e) == "symbol" ? e : e + "";
}
function bo(t, e) {
  if (Dt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Dt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Be = {
  name: "Badge",
  extends: uo,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ht(ye(ye({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, po = ["data-p"];
function fo(t, e, n, o, i, a) {
  return l(), c("span", T({
    class: t.cx("root"),
    "data-p": a.dataP
  }, t.ptmi("root")), [J(t.$slots, "default", {}, function() {
    return [at(C(t.value), 1)];
  })], 16, po);
}
Be.render = fo;
var mo = `
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
function zt(t) {
  "@babel/helpers - typeof";
  return zt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, zt(t);
}
function lt(t, e, n) {
  return (e = go(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function go(t) {
  var e = vo(t, "string");
  return zt(e) == "symbol" ? e : e + "";
}
function vo(t, e) {
  if (zt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (zt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ho = {
  root: function(e) {
    var n = e.instance, o = e.props;
    return ["p-button p-component", lt(lt(lt(lt(lt(lt(lt(lt(lt({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(e) {
    var n = e.props;
    return ["p-button-icon", lt({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, yo = yt.extend({
  name: "button",
  style: mo,
  classes: ho
}), ko = {
  name: "BaseButton",
  extends: jt,
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
  style: yo,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Et(t) {
  "@babel/helpers - typeof";
  return Et = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Et(t);
}
function X(t, e, n) {
  return (e = xo(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function xo(t) {
  var e = _o(t, "string");
  return Et(e) == "symbol" ? e : e + "";
}
function _o(t, e) {
  if (Et(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Et(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Z = {
  name: "Button",
  extends: ko,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(e) {
      var n = e === "root" ? this.ptmi : this.ptm;
      return n(e, {
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
      return T(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return Ee(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return ht(X(X(X(X(X(X(X(X(X(X({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return ht(X(X({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return ht(X(X({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: qn,
    Badge: Be
  },
  directives: {
    ripple: Ae
  }
}, wo = ["data-p"], $o = ["data-p"];
function Co(t, e, n, o, i, a) {
  var f = Bt("SpinnerIcon"), g = Bt("Badge"), k = je("ripple");
  return t.asChild ? J(t.$slots, "default", {
    key: 1,
    class: V(t.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : ct((l(), N(Ot(t.as), T({
    key: 0,
    class: t.cx("root"),
    "data-p": a.dataP
  }, a.attrs), {
    default: O(function() {
      return [J(t.$slots, "default", {}, function() {
        return [t.loading ? J(t.$slots, "loadingicon", T({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (l(), c("span", T({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (l(), N(f, T({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : J(t.$slots, "icon", T({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (l(), c("span", T({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": a.dataIconP
          }, t.ptm("icon")), null, 16, wo)) : $("", !0)];
        }), t.label ? (l(), c("span", T({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": a.dataLabelP
        }), C(t.label), 17, $o)) : $("", !0), t.badge ? (l(), N(g, {
          key: 3,
          value: t.badge,
          class: V(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : $("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[k]]);
}
Z.render = Co;
var So = `
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
`, Po = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
}, Do = yt.extend({
  name: "progressspinner",
  style: So,
  classes: Po
}), zo = {
  name: "BaseProgressSpinner",
  extends: jt,
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
  style: Do,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, Oe = {
  name: "ProgressSpinner",
  extends: zo,
  inheritAttrs: !1,
  computed: {
    svgStyle: function() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
}, Eo = ["fill", "stroke-width"];
function Io(t, e, n, o, i, a) {
  return l(), c("div", T({
    class: t.cx("root"),
    role: "progressbar"
  }, t.ptmi("root")), [(l(), c("svg", T({
    class: t.cx("spin"),
    viewBox: "25 25 50 50",
    style: a.svgStyle
  }, t.ptm("spin")), [u("circle", T({
    class: t.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: t.fill,
    "stroke-width": t.strokeWidth,
    strokeMiterlimit: "10"
  }, t.ptm("circle")), null, 16, Eo)], 16))], 16);
}
Oe.render = Io;
const Ao = { key: 0 }, Lo = /* @__PURE__ */ ft({
  __name: "ComponentDeletion",
  props: {
    state: {}
  },
  emits: ["retry"],
  setup(t) {
    const e = t, n = L(() => e.state.deletion_job === null || ["dead", "cancelled"].includes(e.state.deletion_job?.status || ""));
    return (o, i) => t.state.deleting_at ? (l(), c("span", {
      key: 0,
      class: "component-deletion",
      role: "status",
      onClick: i[1] || (i[1] = Jt(() => {
      }, ["stop"])),
      onKeydown: i[2] || (i[2] = Jt(() => {
      }, ["stop"]))
    }, [
      n.value ? (l(), c(W, { key: 0 }, [
        u("span", null, [
          i[3] || (i[3] = at("Deletion failed", -1)),
          t.state.deletion_job?.last_error ? (l(), c("span", Ao, ": " + C(t.state.deletion_job.last_error), 1)) : $("", !0)
        ]),
        D(r(Z), {
          label: "Retry deletion",
          severity: "secondary",
          size: "small",
          outlined: "",
          onClick: i[0] || (i[0] = Jt((a) => o.$emit("retry"), ["stop"]))
        })
      ], 64)) : (l(), c(W, { key: 1 }, [
        D(r(Oe), {
          class: "component-deletion-spinner",
          "aria-label": "Deletion in progress"
        }),
        i[4] || (i[4] = u("span", null, "Deleting…", -1))
      ], 64))
    ], 32)) : $("", !0);
  }
});
function Ct(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function Mo(t, e) {
  if (e == null) return e;
  switch (t) {
    case "boolean":
    case "checkbox":
      return typeof e == "boolean" ? e : e === "true" ? !0 : e === "false" ? !1 : e;
    case "number":
    case "integer": {
      if (typeof e == "number") return e;
      if (typeof e == "string" && e.trim() !== "") {
        const n = Number(e);
        if (!Number.isNaN(n)) return n;
      }
      return e;
    }
    case "object":
    case "array":
      if (typeof e == "string")
        try {
          const n = JSON.parse(e);
          if (n && typeof n == "object") return n;
        } catch {
        }
      return e;
    default:
      return e;
  }
}
function jo(t, e) {
  if (!e) return t;
  const n = {};
  for (const [o, i] of Object.entries(t))
    n[o] = Mo(e[o], i);
  return n;
}
function Fe(t, e, n) {
  if (e !== void 0 && !e) return null;
  const o = Ct(t) ? t : {}, i = [
    o,
    Ct(o.data) ? o.data : null,
    Ct(o.payload) ? o.payload : null,
    Ct(o.detail) ? o.detail : null
  ].filter(Boolean);
  for (const a of i) {
    if (a.event !== "component.meta.changed" && a.event !== "component.deleting" && a.event !== "component.deleted") continue;
    const f = String(a.component_id || ""), g = String(o.topic || a.topic || "");
    if (e === void 0) {
      if (!f && (!g.startsWith("component.") || g === "component.")) continue;
    } else if (f && f !== e || !f && g !== `component.${e}`) continue;
    const k = f || e || g.slice(10);
    return a.event === "component.deleting" && typeof a.deletion_job_id == "string" && a.deletion_job_id ? { event: a.event, component_id: k, deletion_job_id: a.deletion_job_id } : a.event !== "component.meta.changed" ? { event: a.event, component_id: k } : {
      event: "component.meta.changed",
      component_id: k,
      meta: jo(Ct(a.meta) ? a.meta : {}, n),
      deleted: Array.isArray(a.deleted) ? a.deleted.map(String) : []
    };
  }
  return null;
}
function Ro(t, e, n) {
  const o = Fe(t, e, n);
  return o?.event === "component.meta.changed" ? o : null;
}
function To(t, e) {
  const n = Fe(t, e);
  return n && n.event !== "component.meta.changed" ? n : null;
}
function Bo(t, e, n) {
  if (!t) return null;
  const o = Te(`component.${t}`, (i) => {
    const a = Ro(i, t, n);
    a && e(a);
  });
  return typeof o == "function" ? o : null;
}
function Oo(t, e, n, o) {
  const i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
  function f(p, h) {
    const v = t.value.find((B) => e(B) === p), m = a.get(p), d = h?.job_id || m?.state.deletion_job_id || v?.deletion_job_id, w = m ? m.state.deletion_job_id : v?.deleting_at ? v.deletion_job_id : void 0;
    if ((m || v?.deleting_at) && d === w || d && m?.superseded.has(d)) return;
    const P = {
      deleting_at: m?.state.deleting_at || v?.deleting_at || (/* @__PURE__ */ new Date()).toISOString(),
      deletion_job_id: d
    }, U = new Set(m?.superseded);
    for (const B of [m?.state.deletion_job_id, v?.deletion_job_id])
      B && B !== d && U.add(B);
    a.set(p, { state: P, superseded: U }), v && (Object.assign(v, P), v.deletion_job = void 0);
  }
  const g = Ft(() => t.value, (p, h = []) => {
    const v = p.filter((m) => !i.has(e(m)));
    for (const m of h)
      i.has(e(m)) || v.some((d) => e(d) === e(m)) || m.deleting_at && o?.(e(m));
    if (v.length !== p.length) {
      t.value = v;
      return;
    }
    for (const m of p) {
      m.deleting_at && m.deletion_job === void 0 && !h.includes(m) && (m.deletion_job = null);
      const d = a.get(e(m));
      if (d) {
        const P = m.deletion_job_id;
        m.deleting_at && P && P !== d.state.deletion_job_id && !d.superseded.has(P) && (d.state.deletion_job_id && d.superseded.add(d.state.deletion_job_id), d.state.deletion_job_id = P), P !== d.state.deletion_job_id && (m.deletion_job = void 0), Object.assign(m, d.state);
      }
      const w = h.find((P) => e(P) === e(m));
      m.deletion_job === void 0 && w?.deletion_job_id === m.deletion_job_id && (m.deletion_job = w?.deletion_job);
    }
  }, { immediate: !0 }), k = Te("@message", (p) => {
    const h = To(p);
    if (!h) return;
    const v = t.value.find((m) => e(m) === h.component_id);
    h.event === "component.deleted" ? (v && !i.has(h.component_id) && o?.(h.component_id), i.add(h.component_id), a.delete(h.component_id), t.value = t.value.filter((m) => e(m) !== h.component_id)) : v && f(h.component_id, { job_id: h.deletion_job_id });
  });
  return se(() => {
    g(), typeof k == "function" && k();
  }), { acceptDeletion: f };
}
var Ne = {
  name: "WindowMaximizeIcon",
  extends: Le
};
function Fo(t) {
  return Vo(t) || Ho(t) || Uo(t) || No();
}
function No() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Uo(t, e) {
  if (t) {
    if (typeof t == "string") return oe(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? oe(t, e) : void 0;
  }
}
function Ho(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Vo(t) {
  if (Array.isArray(t)) return oe(t);
}
function oe(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Ko(t, e, n, o, i, a) {
  return l(), c("svg", T({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Fo(e[0] || (e[0] = [u("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ne.render = Ko;
var Ue = {
  name: "WindowMinimizeIcon",
  extends: Le
};
function qo(t) {
  return Go(t) || Zo(t) || Yo(t) || Wo();
}
function Wo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Yo(t, e) {
  if (t) {
    if (typeof t == "string") return re(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? re(t, e) : void 0;
  }
}
function Zo(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Go(t) {
  if (Array.isArray(t)) return re(t);
}
function re(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Xo(t, e, n, o, i, a) {
  return l(), c("svg", T({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), qo(e[0] || (e[0] = [u("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0ZM6.368 7.952C6.44137 7.98326 6.52025 7.99958 6.6 8H9.8C9.95913 8 10.1117 7.93678 10.2243 7.82426C10.3368 7.71174 10.4 7.55913 10.4 7.4C10.4 7.24087 10.3368 7.08826 10.2243 6.97574C10.1117 6.86321 9.95913 6.8 9.8 6.8H8.048L10.624 4.224C10.73 4.11026 10.7877 3.95982 10.7849 3.80438C10.7822 3.64894 10.7192 3.50063 10.6093 3.3907C10.4994 3.28077 10.3511 3.2178 10.1956 3.21506C10.0402 3.21232 9.88974 3.27002 9.776 3.376L7.2 5.952V4.2C7.2 4.04087 7.13679 3.88826 7.02426 3.77574C6.91174 3.66321 6.75913 3.6 6.6 3.6C6.44087 3.6 6.28826 3.66321 6.17574 3.77574C6.06321 3.88826 6 4.04087 6 4.2V7.4C6.00042 7.47975 6.01674 7.55862 6.048 7.632C6.07656 7.70442 6.11971 7.7702 6.17475 7.82524C6.2298 7.88029 6.29558 7.92344 6.368 7.952ZM1.4 8.80005H3.8C4.17066 8.80215 4.52553 8.95032 4.78763 9.21242C5.04973 9.47452 5.1979 9.82939 5.2 10.2V12.6C5.1979 12.9707 5.04973 13.3256 4.78763 13.5877C4.52553 13.8498 4.17066 13.9979 3.8 14H1.4C1.02934 13.9979 0.674468 13.8498 0.412371 13.5877C0.150274 13.3256 0.00210008 12.9707 0 12.6V10.2C0.00210008 9.82939 0.150274 9.47452 0.412371 9.21242C0.674468 8.95032 1.02934 8.80215 1.4 8.80005ZM3.94142 12.7415C3.97893 12.704 4 12.6531 4 12.6V10.2C4 10.147 3.97893 10.0961 3.94142 10.0586C3.90391 10.0211 3.85304 10 3.8 10H1.4C1.34696 10 1.29609 10.0211 1.25858 10.0586C1.22107 10.0961 1.2 10.147 1.2 10.2V12.6C1.2 12.6531 1.22107 12.704 1.25858 12.7415C1.29609 12.779 1.34696 12.8 1.4 12.8H3.8C3.85304 12.8 3.90391 12.779 3.94142 12.7415Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ue.render = Xo;
var Jo = yt.extend({
  name: "focustrap-directive"
}), Qo = Dn.extend({
  style: Jo
});
function It(t) {
  "@babel/helpers - typeof";
  return It = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, It(t);
}
function ke(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function xe(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ke(Object(n), !0).forEach(function(o) {
      tr(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : ke(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function tr(t, e, n) {
  return (e = er(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function er(t) {
  var e = nr(t, "string");
  return It(e) == "symbol" ? e : e + "";
}
function nr(t, e) {
  if (It(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (It(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var or = Qo.extend("focustrap", {
  mounted: function(e, n) {
    var o = n.value || {}, i = o.disabled;
    i || (this.createHiddenFocusableElements(e, n), this.bind(e, n), this.autoElementFocus(e, n)), e.setAttribute("data-pd-focustrap", !0), this.$el = e;
  },
  updated: function(e, n) {
    var o = n.value || {}, i = o.disabled;
    i && this.unbind(e);
  },
  unmounted: function(e) {
    this.unbind(e);
  },
  methods: {
    getComputedSelector: function(e) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(e ?? "");
    },
    bind: function(e, n) {
      var o = this, i = n.value || {}, a = i.onFocusIn, f = i.onFocusOut;
      e.$_pfocustrap_mutationobserver = new MutationObserver(function(g) {
        g.forEach(function(k) {
          if (k.type === "childList" && !e.contains(document.activeElement)) {
            var p = function(v) {
              var m = ve(v) ? ve(v, o.getComputedSelector(e.$_pfocustrap_focusableselector)) ? v : $t(e, o.getComputedSelector(e.$_pfocustrap_focusableselector)) : $t(v);
              return Ie(m) ? m : v.nextSibling && p(v.nextSibling);
            };
            vt(p(k.nextSibling));
          }
        });
      }), e.$_pfocustrap_mutationobserver.disconnect(), e.$_pfocustrap_mutationobserver.observe(e, {
        childList: !0
      }), e.$_pfocustrap_focusinlistener = function(g) {
        return a && a(g);
      }, e.$_pfocustrap_focusoutlistener = function(g) {
        return f && f(g);
      }, e.addEventListener("focusin", e.$_pfocustrap_focusinlistener), e.addEventListener("focusout", e.$_pfocustrap_focusoutlistener);
    },
    unbind: function(e) {
      e.$_pfocustrap_mutationobserver && e.$_pfocustrap_mutationobserver.disconnect(), e.$_pfocustrap_focusinlistener && e.removeEventListener("focusin", e.$_pfocustrap_focusinlistener) && (e.$_pfocustrap_focusinlistener = null), e.$_pfocustrap_focusoutlistener && e.removeEventListener("focusout", e.$_pfocustrap_focusoutlistener) && (e.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(e) {
      this.autoElementFocus(this.$el, {
        value: xe(xe({}, e), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(e, n) {
      var o = n.value || {}, i = o.autoFocusSelector, a = i === void 0 ? "" : i, f = o.firstFocusableSelector, g = f === void 0 ? "" : f, k = o.autoFocus, p = k === void 0 ? !1 : k, h = $t(e, "[autofocus]".concat(this.getComputedSelector(a)));
      p && !h && (h = $t(e, this.getComputedSelector(g))), vt(h);
    },
    onFirstHiddenElementFocus: function(e) {
      var n, o = e.currentTarget, i = e.relatedTarget, a = i === o.$_pfocustrap_lasthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? $t(o.parentElement, this.getComputedSelector(o.$_pfocustrap_focusableselector)) : o.$_pfocustrap_lasthiddenfocusableelement;
      vt(a);
    },
    onLastHiddenElementFocus: function(e) {
      var n, o = e.currentTarget, i = e.relatedTarget, a = i === o.$_pfocustrap_firsthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? Pn(o.parentElement, this.getComputedSelector(o.$_pfocustrap_focusableselector)) : o.$_pfocustrap_firsthiddenfocusableelement;
      vt(a);
    },
    createHiddenFocusableElements: function(e, n) {
      var o = this, i = n.value || {}, a = i.tabIndex, f = a === void 0 ? 0 : a, g = i.firstFocusableSelector, k = g === void 0 ? "" : g, p = i.lastFocusableSelector, h = p === void 0 ? "" : p, v = function(P) {
        return zn("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: f,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: P?.bind(o)
        });
      }, m = v(this.onFirstHiddenElementFocus), d = v(this.onLastHiddenElementFocus);
      m.$_pfocustrap_lasthiddenfocusableelement = d, m.$_pfocustrap_focusableselector = k, m.setAttribute("data-pc-section", "firstfocusableelement"), d.$_pfocustrap_firsthiddenfocusableelement = m, d.$_pfocustrap_focusableselector = h, d.setAttribute("data-pc-section", "lastfocusableelement"), e.prepend(m), e.append(d);
    }
  }
});
function _e() {
  In({
    variableName: Me("scrollbar.width").name
  });
}
function we() {
  En({
    variableName: Me("scrollbar.width").name
  });
}
var rr = `
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
`, ar = {
  mask: function(e) {
    var n = e.position, o = e.modal;
    return {
      position: "fixed",
      height: "100%",
      width: "100%",
      left: 0,
      top: 0,
      display: "flex",
      justifyContent: n === "left" || n === "topleft" || n === "bottomleft" ? "flex-start" : n === "right" || n === "topright" || n === "bottomright" ? "flex-end" : "center",
      alignItems: n === "top" || n === "topleft" || n === "topright" ? "flex-start" : n === "bottom" || n === "bottomleft" || n === "bottomright" ? "flex-end" : "center",
      pointerEvents: o ? "auto" : "none"
    };
  },
  root: {
    display: "flex",
    flexDirection: "column",
    pointerEvents: "auto"
  }
}, ir = {
  mask: function(e) {
    var n = e.props, o = ["left", "right", "top", "topleft", "topright", "bottom", "bottomleft", "bottomright"], i = o.find(function(a) {
      return a === n.position;
    });
    return ["p-dialog-mask", {
      "p-overlay-mask p-overlay-mask-enter-active": n.modal
    }, i ? "p-dialog-".concat(i) : ""];
  },
  root: function(e) {
    var n = e.props, o = e.instance;
    return ["p-dialog p-component", {
      "p-dialog-maximized": n.maximizable && o.maximized
    }];
  },
  header: "p-dialog-header",
  title: "p-dialog-title",
  headerActions: "p-dialog-header-actions",
  pcMaximizeButton: "p-dialog-maximize-button",
  pcCloseButton: "p-dialog-close-button",
  content: "p-dialog-content",
  footer: "p-dialog-footer"
}, sr = yt.extend({
  name: "dialog",
  style: rr,
  classes: ir,
  inlineStyles: ar
}), lr = {
  name: "BaseDialog",
  extends: jt,
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
  style: sr,
  provide: function() {
    return {
      $pcDialog: this,
      $parentInstance: this
    };
  }
}, Pt = {
  name: "Dialog",
  extends: lr,
  inheritAttrs: !1,
  emits: ["update:visible", "show", "hide", "after-hide", "maximize", "unmaximize", "dragstart", "dragend"],
  provide: function() {
    var e = this;
    return {
      dialogRef: L(function() {
        return e._instance;
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
    this.unbindDocumentState(), this.unbindGlobalListeners(), this.destroyStyle(), this.mask && this.autoZIndex && Xt.clear(this.mask), this.container = null, this.mask = null;
  },
  mounted: function() {
    this.breakpoints && this.createStyle();
  },
  methods: {
    close: function() {
      this.$emit("update:visible", !1);
    },
    onEnter: function() {
      this.$emit("show"), this.target = document.activeElement, this.enableDocumentSettings(), this.bindGlobalListeners(), this.autoZIndex && Xt.set("modal", this.mask, this.baseZIndex || this.$primevue.config.zIndex.modal);
    },
    onAfterEnter: function() {
      this.focus();
    },
    onBeforeLeave: function() {
      this.modal && !this.isUnstyled && Bn(this.mask, "p-overlay-mask-leave-active"), this.dragging && this.documentDragEndListener && this.documentDragEndListener();
    },
    onLeave: function() {
      this.$emit("hide"), vt(this.target), this.target = null, this.focusableClose = null, this.focusableMax = null;
    },
    onAfterLeave: function() {
      this.autoZIndex && Xt.clear(this.mask), this.containerVisible = !1, this.unbindDocumentState(), this.unbindGlobalListeners(), this.$emit("after-hide");
    },
    onMaskMouseDown: function(e) {
      this.maskMouseDownTarget = e.target;
    },
    onMaskMouseUp: function() {
      this.dismissableMask && this.modal && this.mask === this.maskMouseDownTarget && this.close();
    },
    focus: function() {
      var e = function(i) {
        return i && i.querySelector("[autofocus]");
      }, n = this.$slots.footer && e(this.footerContainer);
      n || (n = this.$slots.header && e(this.headerContainer), n || (n = this.$slots.default && e(this.content), n || (this.maximizable ? (this.focusableMax = !0, n = this.maximizableButton) : (this.focusableClose = !0, n = this.closeButton)))), n && vt(n, {
        focusVisible: !0
      });
    },
    maximize: function(e) {
      this.maximized ? (this.maximized = !1, this.$emit("unmaximize", e)) : (this.maximized = !0, this.$emit("maximize", e)), this.modal || (this.maximized ? _e() : we());
    },
    enableDocumentSettings: function() {
      (this.modal || !this.modal && this.blockScroll || this.maximizable && this.maximized) && _e();
    },
    unbindDocumentState: function() {
      (this.modal || !this.modal && this.blockScroll || this.maximizable && this.maximized) && we();
    },
    onKeyDown: function(e) {
      e.code === "Escape" && this.closeOnEscape && !e.isComposing && this.close();
    },
    bindDocumentKeyDownListener: function() {
      this.documentKeydownListener || (this.documentKeydownListener = this.onKeyDown.bind(this), window.document.addEventListener("keydown", this.documentKeydownListener));
    },
    unbindDocumentKeyDownListener: function() {
      this.documentKeydownListener && (window.document.removeEventListener("keydown", this.documentKeydownListener), this.documentKeydownListener = null);
    },
    containerRef: function(e) {
      this.container = e;
    },
    maskRef: function(e) {
      this.mask = e;
    },
    contentRef: function(e) {
      this.content = e;
    },
    headerContainerRef: function(e) {
      this.headerContainer = e;
    },
    footerContainerRef: function(e) {
      this.footerContainer = e;
    },
    maximizableRef: function(e) {
      this.maximizableButton = e ? e.$el : void 0;
    },
    closeButtonRef: function(e) {
      this.closeButton = e ? e.$el : void 0;
    },
    createStyle: function() {
      if (!this.styleElement && !this.isUnstyled) {
        var e;
        this.styleElement = document.createElement("style"), this.styleElement.type = "text/css", Tn(this.styleElement, "nonce", (e = this.$primevue) === null || e === void 0 || (e = e.config) === null || e === void 0 || (e = e.csp) === null || e === void 0 ? void 0 : e.nonce), document.head.appendChild(this.styleElement);
        var n = "";
        for (var o in this.breakpoints)
          n += `
                        @media screen and (max-width: `.concat(o, `) {
                            .p-dialog[`).concat(this.$attrSelector, `] {
                                width: `).concat(this.breakpoints[o], ` !important;
                            }
                        }
                    `);
        this.styleElement.innerHTML = n;
      }
    },
    destroyStyle: function() {
      this.styleElement && (document.head.removeChild(this.styleElement), this.styleElement = null);
    },
    initDrag: function(e) {
      e.target.closest("div").getAttribute("data-pc-section") !== "headeractions" && this.draggable && (this.dragging = !0, this.lastPageX = e.pageX, this.lastPageY = e.pageY, this.container.style.margin = "0", document.body.setAttribute("data-p-unselectable-text", "true"), !this.isUnstyled && Rn(document.body, {
        "user-select": "none"
      }), this.$emit("dragstart", e));
    },
    bindGlobalListeners: function() {
      this.draggable && (this.bindDocumentDragListener(), this.bindDocumentDragEndListener()), this.closeOnEscape && this.bindDocumentKeyDownListener();
    },
    unbindGlobalListeners: function() {
      this.unbindDocumentDragListener(), this.unbindDocumentDragEndListener(), this.unbindDocumentKeyDownListener();
    },
    bindDocumentDragListener: function() {
      var e = this;
      this.documentDragListener = function(n) {
        if (e.dragging) {
          var o = Ln(e.container), i = Mn(e.container), a = n.pageX - e.lastPageX, f = n.pageY - e.lastPageY, g = e.container.getBoundingClientRect(), k = g.left + a, p = g.top + f, h = jn(), v = getComputedStyle(e.container), m = parseFloat(v.marginLeft), d = parseFloat(v.marginTop);
          e.container.style.position = "fixed", e.keepInViewport ? (k >= e.minX && k + o < h.width && (e.lastPageX = n.pageX, e.container.style.left = k - m + "px"), p >= e.minY && p + i < h.height && (e.lastPageY = n.pageY, e.container.style.top = p - d + "px")) : (e.lastPageX = n.pageX, e.container.style.left = k - m + "px", e.lastPageY = n.pageY, e.container.style.top = p - d + "px");
        }
      }, window.document.addEventListener("mousemove", this.documentDragListener);
    },
    unbindDocumentDragListener: function() {
      this.documentDragListener && (window.document.removeEventListener("mousemove", this.documentDragListener), this.documentDragListener = null);
    },
    bindDocumentDragEndListener: function() {
      var e = this;
      this.documentDragEndListener = function(n) {
        e.dragging && (e.dragging = !1, document.body.removeAttribute("data-p-unselectable-text"), !e.isUnstyled && (document.body.style["user-select"] = ""), e.$emit("dragend", n));
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
      return ht({
        maximized: this.maximized,
        modal: this.modal
      });
    }
  },
  directives: {
    ripple: Ae,
    focustrap: or
  },
  components: {
    Button: Z,
    Portal: An,
    WindowMinimizeIcon: Ue,
    WindowMaximizeIcon: Ne,
    TimesIcon: Wn
  }
};
function At(t) {
  "@babel/helpers - typeof";
  return At = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, At(t);
}
function $e(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ce(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? $e(Object(n), !0).forEach(function(o) {
      ur(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : $e(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function ur(t, e, n) {
  return (e = dr(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function dr(t) {
  var e = cr(t, "string");
  return At(e) == "symbol" ? e : e + "";
}
function cr(t, e) {
  if (At(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (At(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var br = ["data-p"], pr = ["aria-labelledby", "aria-modal", "data-p"], fr = ["id"], mr = ["data-p"];
function gr(t, e, n, o, i, a) {
  var f = Bt("Button"), g = Bt("Portal"), k = je("focustrap");
  return l(), N(g, {
    appendTo: t.appendTo
  }, {
    default: O(function() {
      return [i.containerVisible ? (l(), c("div", T({
        key: 0,
        ref: a.maskRef,
        class: t.cx("mask"),
        style: t.sx("mask", !0, {
          position: t.position,
          modal: t.modal
        }),
        onMousedown: e[1] || (e[1] = function() {
          return a.onMaskMouseDown && a.onMaskMouseDown.apply(a, arguments);
        }),
        onMouseup: e[2] || (e[2] = function() {
          return a.onMaskMouseUp && a.onMaskMouseUp.apply(a, arguments);
        }),
        "data-p": a.dataP
      }, t.ptm("mask")), [D(Hn, T({
        name: "p-dialog",
        onEnter: a.onEnter,
        onAfterEnter: a.onAfterEnter,
        onBeforeLeave: a.onBeforeLeave,
        onLeave: a.onLeave,
        onAfterLeave: a.onAfterLeave,
        appear: ""
      }, t.ptm("transition")), {
        default: O(function() {
          return [t.visible ? ct((l(), c("div", T({
            key: 0,
            ref: a.containerRef,
            class: t.cx("root"),
            style: t.sx("root"),
            role: "dialog",
            "aria-labelledby": a.ariaLabelledById,
            "aria-modal": t.modal,
            "data-p": a.dataP
          }, t.ptmi("root")), [t.$slots.container ? J(t.$slots, "container", {
            key: 0,
            closeCallback: a.close,
            maximizeCallback: function(h) {
              return a.maximize(h);
            },
            initDragCallback: a.initDrag
          }) : (l(), c(W, {
            key: 1
          }, [t.showHeader ? (l(), c("div", T({
            key: 0,
            ref: a.headerContainerRef,
            class: t.cx("header"),
            onMousedown: e[0] || (e[0] = function() {
              return a.initDrag && a.initDrag.apply(a, arguments);
            })
          }, t.ptm("header")), [J(t.$slots, "header", {
            class: V(t.cx("title"))
          }, function() {
            return [t.header ? (l(), c("span", T({
              key: 0,
              id: a.ariaLabelledById,
              class: t.cx("title")
            }, t.ptm("title")), C(t.header), 17, fr)) : $("", !0)];
          }), u("div", T({
            class: t.cx("headerActions")
          }, t.ptm("headerActions")), [t.maximizable ? J(t.$slots, "maximizebutton", {
            key: 0,
            maximized: i.maximized,
            maximizeCallback: function(h) {
              return a.maximize(h);
            }
          }, function() {
            return [D(f, T({
              ref: a.maximizableRef,
              autofocus: i.focusableMax,
              class: t.cx("pcMaximizeButton"),
              onClick: a.maximize,
              tabindex: t.maximizable ? "0" : "-1",
              unstyled: t.unstyled
            }, t.maximizeButtonProps, {
              pt: t.ptm("pcMaximizeButton"),
              "data-pc-group-section": "headericon"
            }), {
              icon: O(function(p) {
                return [J(t.$slots, "maximizeicon", {
                  maximized: i.maximized
                }, function() {
                  return [(l(), N(Ot(a.maximizeIconComponent), T({
                    class: [p.class, i.maximized ? t.minimizeIcon : t.maximizeIcon]
                  }, t.ptm("pcMaximizeButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["autofocus", "class", "onClick", "tabindex", "unstyled", "pt"])];
          }) : $("", !0), t.closable ? J(t.$slots, "closebutton", {
            key: 1,
            closeCallback: a.close
          }, function() {
            return [D(f, T({
              ref: a.closeButtonRef,
              autofocus: i.focusableClose,
              class: t.cx("pcCloseButton"),
              onClick: a.close,
              "aria-label": a.closeAriaLabel,
              unstyled: t.unstyled
            }, t.closeButtonProps, {
              pt: t.ptm("pcCloseButton"),
              "data-pc-group-section": "headericon"
            }), {
              icon: O(function(p) {
                return [J(t.$slots, "closeicon", {}, function() {
                  return [(l(), N(Ot(t.closeIcon ? "span" : "TimesIcon"), T({
                    class: [t.closeIcon, p.class]
                  }, t.ptm("pcCloseButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["autofocus", "class", "onClick", "aria-label", "unstyled", "pt"])];
          }) : $("", !0)], 16)], 16)) : $("", !0), u("div", T({
            ref: a.contentRef,
            class: [t.cx("content"), t.contentClass],
            style: t.contentStyle,
            "data-p": a.dataP
          }, Ce(Ce({}, t.contentProps), t.ptm("content"))), [J(t.$slots, "default")], 16, mr), t.footer || t.$slots.footer ? (l(), c("div", T({
            key: 1,
            ref: a.footerContainerRef,
            class: t.cx("footer")
          }, t.ptm("footer")), [J(t.$slots, "footer", {}, function() {
            return [at(C(t.footer), 1)];
          })], 16)) : $("", !0)], 64))], 16, pr)), [[k, {
            disabled: !t.modal
          }]]) : $("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])], 16, br)) : $("", !0)];
    }),
    _: 3
  }, 8, ["appendTo"]);
}
Pt.render = gr;
var vr = `
    .p-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: dt('tag.primary.background');
        color: dt('tag.primary.color');
        font-size: dt('tag.font.size');
        font-weight: dt('tag.font.weight');
        padding: dt('tag.padding');
        border-radius: dt('tag.border.radius');
        gap: dt('tag.gap');
    }

    .p-tag-icon {
        font-size: dt('tag.icon.size');
        width: dt('tag.icon.size');
        height: dt('tag.icon.size');
    }

    .p-tag-rounded {
        border-radius: dt('tag.rounded.border.radius');
    }

    .p-tag-success {
        background: dt('tag.success.background');
        color: dt('tag.success.color');
    }

    .p-tag-info {
        background: dt('tag.info.background');
        color: dt('tag.info.color');
    }

    .p-tag-warn {
        background: dt('tag.warn.background');
        color: dt('tag.warn.color');
    }

    .p-tag-danger {
        background: dt('tag.danger.background');
        color: dt('tag.danger.color');
    }

    .p-tag-secondary {
        background: dt('tag.secondary.background');
        color: dt('tag.secondary.color');
    }

    .p-tag-contrast {
        background: dt('tag.contrast.background');
        color: dt('tag.contrast.color');
    }
`, hr = {
  root: function(e) {
    var n = e.props;
    return ["p-tag p-component", {
      "p-tag-info": n.severity === "info",
      "p-tag-success": n.severity === "success",
      "p-tag-warn": n.severity === "warn",
      "p-tag-danger": n.severity === "danger",
      "p-tag-secondary": n.severity === "secondary",
      "p-tag-contrast": n.severity === "contrast",
      "p-tag-rounded": n.rounded
    }];
  },
  icon: "p-tag-icon",
  label: "p-tag-label"
}, yr = yt.extend({
  name: "tag",
  style: vr,
  classes: hr
}), kr = {
  name: "BaseTag",
  extends: jt,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: yr,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function Lt(t) {
  "@babel/helpers - typeof";
  return Lt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Lt(t);
}
function xr(t, e, n) {
  return (e = _r(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function _r(t) {
  var e = wr(t, "string");
  return Lt(e) == "symbol" ? e : e + "";
}
function wr(t, e) {
  if (Lt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Lt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var le = {
  name: "Tag",
  extends: kr,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ht(xr({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, $r = ["data-p"];
function Cr(t, e, n, o, i, a) {
  return l(), c("span", T({
    class: t.cx("root"),
    "data-p": a.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (l(), N(Ot(t.$slots.icon), T({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (l(), c("span", T({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : $("", !0), t.value != null || t.$slots.default ? J(t.$slots, "default", {
    key: 2
  }, function() {
    return [u("span", T({
      class: t.cx("label")
    }, t.ptm("label")), C(t.value), 17)];
  }) : $("", !0)], 16, $r);
}
le.render = Cr;
function Sr(t) {
  if (!t) return null;
  let e;
  if (typeof t == "number")
    e = t;
  else {
    const n = t.trim();
    if (/^\d+$/.test(n))
      e = Number(n);
    else {
      const o = Date.parse(n);
      return Number.isNaN(o) ? null : o;
    }
  }
  return Number.isFinite(e) ? e < 1e12 ? e * 1e3 : e : null;
}
function pt(t, e) {
  const n = Sr(t);
  if (n === null) return "";
  const o = e?.now ?? Date.now(), i = e?.suffix ?? !0, a = e?.maxUnit ?? "day", f = e?.future ?? !1, g = 6e4, k = 60 * g, p = 24 * k, h = 30 * p, v = 365 * p, m = o - n;
  if (f && m < 0) {
    const P = -m;
    return P < g ? "in <1m" : P < k ? `in ${Math.floor(P / g)}m` : P < p ? `in ${Math.floor(P / k)}h` : `in ${Math.floor(P / p)}d`;
  }
  const d = Math.max(0, m);
  if (d < g) return "just now";
  const w = i ? " ago" : "";
  return d < k ? `${Math.floor(d / g)}m${w}` : d < p ? `${Math.floor(d / k)}h${w}` : a === "year" ? d < h ? `${Math.floor(d / p)}d${w}` : d < v ? `${Math.floor(d / h)}mo${w}` : `${Math.floor(d / v)}y${w}` : `${Math.floor(d / p)}d${w}`;
}
function ae(t) {
  return String(t.description || "").trim();
}
function He(t) {
  const e = t?.tag_name;
  return typeof e == "string" ? e.trim() : "";
}
function Ve(t) {
  const e = typeof t?.base_path == "string" ? t.base_path.trim() : "", n = typeof t?.entry_point == "string" ? t.entry_point.trim() : "";
  return e && n ? `/${e}/${n}` : typeof t?.url == "string" ? t.url.trim() : "";
}
function ie(t) {
  return He(t?.component?.create_ui);
}
function Pr(t) {
  return Ve(t?.component?.create_ui);
}
function ue(t) {
  return He(t?.component?.manage_ui);
}
function Ke(t) {
  return Ve(t?.component?.manage_ui);
}
function qe(t, e) {
  return { id: t.id, automation: t, public_state: t.public_state || {}, type: e };
}
let Se = 0;
function Dr(t) {
  t && (Se += 1, t.setAttribute("submit-nonce", String(Se)));
}
const zr = { class: "kx-modal-head-icon" }, Er = { class: "kx-modal-head-text" }, Ir = { class: "kx-modal-head-title" }, Ar = {
  key: 0,
  class: "kx-2p-l"
}, Lr = { class: "kx-cat-search" }, Mr = {
  key: 0,
  class: "kx-cat-empty"
}, jr = {
  key: 1,
  class: "kx-cat"
}, Rr = ["onClick"], Tr = { class: "kx-cat-ico" }, Br = { class: "kx-cat-text" }, Or = { class: "kx-cat-name" }, Fr = {
  key: 0,
  class: "kx-cat-desc"
}, Nr = { class: "kx-2p-r" }, Ur = {
  key: 0,
  class: "kx-2p-r-head"
}, Hr = { class: "kx-2p-r-body" }, Vr = {
  key: 0,
  class: "kx-2p-r-note"
}, Kr = {
  key: 1,
  class: "kx-2p-r-note"
}, qr = {
  key: 2,
  class: "kx-form"
}, Wr = { class: "kx-field-lbl" }, Yr = {
  key: 0,
  class: "kx-req",
  "aria-hidden": "true"
}, Zr = ["onUpdate:modelValue"], Gr = ["onUpdate:modelValue"], Xr = ["onUpdate:modelValue", "type", "placeholder"], Jr = {
  key: 4,
  class: "kx-field-hint"
}, Qr = {
  key: 5,
  class: "kx-field-hint"
}, ta = {
  key: 0,
  class: "kx-err inline kx-foot-err"
}, ea = /* @__PURE__ */ ft({
  __name: "InstallDialog",
  props: {
    flow: {},
    componentMode: { type: Boolean },
    dialogPt: {}
  },
  setup(t) {
    const e = t, {
      showTypeCatalog: n,
      installFields: o,
      showInstall: i,
      installType: a,
      installForm: f,
      installing: g,
      customSaving: k,
      installError: p,
      customInstallHost: h,
      installSearchInput: v,
      typeSearch: m,
      filteredTypes: d,
      chooseType: w,
      closeInstall: P,
      focusInstallDialog: U,
      onCreate: B
    } = e.flow;
    return (rt, Y) => (l(), N(r(Pt), {
      visible: r(i),
      modal: !0,
      "block-scroll": !0,
      "dismissable-mask": !0,
      pt: t.dialogPt,
      class: V(["kx-modal kx-modal-2p", { "kx-modal-solo": !r(n) }]),
      "aria-label": "Add an automation",
      "onUpdate:visible": Y[1] || (Y[1] = (A) => {
        A || r(P)();
      }),
      onShow: r(U)
    }, {
      header: O(() => [
        u("span", zr, [
          D(r(j), {
            icon: r(a) && r(a).icon || "tabler:bolt",
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        u("span", Er, [
          u("span", Ir, C(r(a) ? r(a).title || r(a).name : "Add an automation"), 1),
          Y[2] || (Y[2] = u("span", { class: "kx-modal-head-sub" }, "Configure an automation.", -1))
        ])
      ]),
      footer: O(() => [
        r(p) ? (l(), c("div", ta, C(r(p)), 1)) : $("", !0),
        D(r(Z), {
          type: "button",
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: r(g) || r(k),
          onClick: r(P)
        }, null, 8, ["disabled", "onClick"]),
        r(a) ? (l(), N(r(Z), {
          key: 1,
          type: "button",
          "data-testid": "automations-install-create",
          label: r(g) || r(k) ? "Creating…" : "Create",
          loading: r(g) || r(k),
          disabled: r(g) || r(k),
          onClick: r(B)
        }, {
          icon: O(({ class: A }) => [
            D(r(j), {
              icon: "tabler:plus",
              class: V(A),
              "aria-hidden": "true"
            }, null, 8, ["class"])
          ]),
          _: 1
        }, 8, ["label", "loading", "disabled", "onClick"])) : $("", !0)
      ]),
      default: O(() => [
        u("div", {
          class: V(["kx-2p", { "kx-2p-solo": !r(n) }])
        }, [
          r(n) ? (l(), c("div", Ar, [
            u("div", Lr, [
              D(r(j), {
                icon: "tabler:search",
                "aria-hidden": "true"
              }),
              ct(u("input", {
                ref_key: "installSearchInput",
                ref: v,
                "onUpdate:modelValue": Y[0] || (Y[0] = (A) => Vn(m) ? m.value = A : null),
                "data-modal-initial": "",
                type: "text",
                placeholder: "Search types…",
                "aria-label": "Search automation types"
              }, null, 512), [
                [ee, r(m)]
              ])
            ]),
            r(d).length ? (l(), c("div", jr, [
              (l(!0), c(W, null, ot(r(d), (A) => (l(), c("button", {
                key: A.id,
                class: V(["kx-cat-card", r(a)?.id === A.id && "sel"]),
                onClick: (F) => r(w)(A)
              }, [
                u("span", Tr, [
                  D(r(j), {
                    icon: A.icon || "tabler:sparkles",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                u("span", Br, [
                  u("span", Or, C(A.title || A.name), 1),
                  r(ae)(A) ? (l(), c("span", Fr, C(r(ae)(A)), 1)) : $("", !0)
                ]),
                D(r(j), {
                  icon: "tabler:check",
                  class: "kx-cat-check",
                  "aria-hidden": "true"
                })
              ], 10, Rr))), 128))
            ])) : (l(), c("div", Mr, "No setups match “" + C(r(m)) + "”.", 1))
          ])) : $("", !0),
          u("div", Nr, [
            r(n) ? (l(), c("div", Ur, "Setup")) : $("", !0),
            u("div", Hr, [
              r(a) ? (l(), c(W, { key: 1 }, [
                r(ie)(r(a)) ? (l(), c("div", {
                  key: 0,
                  ref_key: "customInstallHost",
                  ref: h,
                  class: "kx-custom-host"
                }, null, 512)) : r(o).length ? (l(), c("div", qr, [
                  (l(!0), c(W, null, ot(r(o), ([A, F]) => (l(), c("label", {
                    key: A,
                    class: "kx-field"
                  }, [
                    u("span", Wr, [
                      at(C(F.title || A) + " ", 1),
                      r(Gn)(r(a), A) ? (l(), c("span", Yr, "*")) : $("", !0)
                    ]),
                    F.enum ? (l(), N(r(Yn), {
                      key: 0,
                      class: "kx-select",
                      "model-value": r(f)[A],
                      options: r(Xn)(r(a), A, F),
                      "option-label": "label",
                      "option-value": "value",
                      placeholder: "—",
                      "aria-label": F.title || A,
                      "onUpdate:modelValue": (K) => r(f)[A] = K
                    }, null, 8, ["model-value", "options", "aria-label", "onUpdate:modelValue"])) : F.type === "boolean" ? ct((l(), c("input", {
                      key: 1,
                      "onUpdate:modelValue": (K) => r(f)[A] = K,
                      class: "kx-check",
                      type: "checkbox"
                    }, null, 8, Zr)), [
                      [Re, r(f)[A]]
                    ]) : F.type === "number" || F.type === "integer" ? ct((l(), c("input", {
                      key: 2,
                      "onUpdate:modelValue": (K) => r(f)[A] = K,
                      class: "kx-input",
                      type: "number"
                    }, null, 8, Gr)), [
                      [
                        ee,
                        r(f)[A],
                        void 0,
                        { number: !0 }
                      ]
                    ]) : ct((l(), c("input", {
                      key: 3,
                      "onUpdate:modelValue": (K) => r(f)[A] = K,
                      class: "kx-input",
                      type: r(Jn)(F),
                      placeholder: F.description || ""
                    }, null, 8, Xr)), [
                      [Kn, r(f)[A]]
                    ]),
                    F.description && !(F.type !== "boolean" && !F.enum) ? (l(), c("span", Jr, C(F.description), 1)) : F.description && F.enum ? (l(), c("span", Qr, C(F.description), 1)) : $("", !0)
                  ]))), 128))
                ])) : (l(), c("div", Kr, "This automation needs no configuration."))
              ], 64)) : (l(), c("p", Vr, "Select an automation type to configure it."))
            ])
          ])
        ], 2)
      ]),
      _: 1
    }, 8, ["visible", "pt", "class", "onShow"]));
  }
}), na = {
  key: 0,
  class: "kx-metrics"
}, oa = { class: "kx-metric-k" }, ra = ["title"], aa = {
  key: 1,
  class: "kx-metric-details"
}, ia = { class: "kx-metrics kx-metrics-detail" }, sa = { class: "kx-metric-k" }, la = ["title"], ua = /* @__PURE__ */ ft({
  __name: "RowMetrics",
  props: {
    face: { default: () => [] },
    detail: { default: () => [] }
  },
  setup(t) {
    return (e, n) => (l(), c(W, null, [
      t.face.length ? (l(), c("div", na, [
        (l(!0), c(W, null, ot(t.face, (o) => (l(), c("span", {
          key: o.label,
          class: "kx-metric"
        }, [
          o.icon ? (l(), N(r(j), {
            key: 0,
            icon: o.icon,
            class: "kx-metric-i",
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : $("", !0),
          u("span", oa, C(o.label), 1),
          u("span", {
            class: "kx-metric-v",
            title: o.title
          }, C(o.value), 9, ra)
        ]))), 128))
      ])) : $("", !0),
      t.detail.length ? (l(), c("details", aa, [
        n[0] || (n[0] = u("summary", { class: "kx-metric-more" }, "Details", -1)),
        u("div", ia, [
          (l(!0), c(W, null, ot(t.detail, (o) => (l(), c("span", {
            key: o.label,
            class: "kx-metric"
          }, [
            o.icon ? (l(), N(r(j), {
              key: 0,
              icon: o.icon,
              class: "kx-metric-i",
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : $("", !0),
            u("span", sa, C(o.label), 1),
            u("span", {
              class: "kx-metric-v",
              title: o.title
            }, C(o.value), 9, la)
          ]))), 128))
        ])
      ])) : $("", !0)
    ], 64));
  }
}), da = /* @__PURE__ */ new Set(["pause", "resume"]), ca = /* @__PURE__ */ new Set(["reconfigure"]), Pe = /* @__PURE__ */ new Set(["run_now", "trigger", "execute", "run"]), te = {
  run_now: { label: "Run now", description: "Wake the drive to process available work. Paused drives stay paused.", group: "run", icon: "tabler:player-play" },
  discard: { label: "Discard", description: "Select uncertain item keys to discard them.", group: "recovery", icon: "tabler:trash" },
  trigger: { label: "Run now", description: "Run this automation immediately.", group: "run", icon: "tabler:player-play" },
  execute: { label: "Run now", description: "Run this automation immediately.", group: "run", icon: "tabler:player-play" },
  run: { label: "Run now", description: "Run this automation immediately.", group: "run", icon: "tabler:player-play" },
  rewind: { label: "Rewind & reprocess", description: "Reset progress to the start and re-drain every item.", group: "recovery", icon: "tabler:rotate-clockwise-2", warn: !0 },
  resync: { label: "Resync", description: "Reset source progress and reconcile from scratch.", group: "recovery", icon: "tabler:refresh", warn: !0 },
  replay: { label: "Replay", description: "Retry failed, uncertain, or waiting items.", group: "recovery", icon: "tabler:player-track-next", warn: !0 },
  reconcile: { label: "Reconcile", description: "Recompute state against the source of truth.", group: "recovery", icon: "tabler:adjustments-check" },
  status: { label: "Refresh status", description: "Fetch the latest run status now.", group: "recovery", icon: "tabler:activity-heartbeat" }
};
function We(t) {
  return t.has("run_now") ? "run_now" : t.has("trigger") ? "trigger" : t.has("execute") ? "execute" : "";
}
function ba(t) {
  return t.replace(/[._-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
function De(t) {
  return { label: ba(t), description: "Run this action.", group: "recovery", icon: "tabler:bolt" };
}
function Ye(t) {
  return new Set([...t?.controls || [], ...t?.actions || []].map((e) => e.name).filter(Boolean));
}
function Ze(t) {
  const e = [...Ye(t)], n = !!ue(t);
  return {
    declared: e,
    requiresKeys: t?.controls?.filter((o) => o.keys_required).map((o) => o.name),
    runNow: We(new Set(e)),
    canReconfigure: n,
    // An automation is a component, so it shares through the generic component
    // access endpoints; the server is the authority on who may grant.
    canShare: !0,
    canExport: t?.exportable === !0,
    canDelete: !0
  };
}
function Ge(t) {
  const e = t instanceof Set ? t : new Set(t);
  return e.has("rewind") ? "rewind" : e.has("resync") ? "resync" : "";
}
function Xe(t) {
  const e = [];
  if (t.runNow) {
    const o = te[t.runNow] || te.trigger;
    e.push({ method: t.runNow, ...o, kind: "call" });
  }
  const n = /* @__PURE__ */ new Set();
  for (const o of t.declared) {
    if (da.has(o) || o === t.runNow || t.runNow !== "run_now" && Pe.has(o) || ca.has(o) || n.has(o)) continue;
    n.add(o);
    const i = t.runNow === "run_now" && Pe.has(o) ? { ...De(o), group: "run" } : te[o] || De(o);
    e.push({ method: o, ...i, kind: "call", disabled: t.requiresKeys?.includes(o) });
  }
  return t.canReconfigure && e.push({ method: "reconfigure", label: "Reconfigure", description: "Change how this automation is set up.", group: "edit", icon: "tabler:settings", kind: "reconfigure" }), t.canShare && e.push({ method: "share", label: "Share", description: "Give other people access to this automation.", group: "edit", icon: "tabler:users", kind: "share" }), t.canExport && e.push({ method: "export", label: "Export", description: "Download a portable copy to import elsewhere.", group: "edit", icon: "tabler:download", kind: "export" }), t.canDelete && e.push({ method: "delete", label: "Delete", description: "Stop it and remove its setup. This cannot be undone.", group: "delete", icon: "tabler:trash", kind: "delete", danger: !0 }), e;
}
const pa = ["run", "recovery", "edit", "delete"], fa = {
  run: "Run",
  recovery: "Recovery",
  edit: "Edit",
  delete: ""
};
function ma(t) {
  return pa.map((e) => ({ group: e, label: fa[e], items: t.filter((n) => n.group === e) })).filter((e) => e.items.length > 0);
}
function ga(t, e) {
  return t.group === "run" ? `Run ${e} now` : t.method === "reconfigure" ? `Edit ${e}` : `${t.label} ${e}`;
}
const va = ["aria-label"], ha = {
  key: 1,
  class: "kx-menu-sep",
  role: "separator"
}, ya = ["data-testid", "aria-label", "disabled", "onClick"], ka = { class: "kx-menu-item-body" }, xa = { class: "kx-menu-item-label" }, _a = { class: "kx-menu-item-desc" }, Je = /* @__PURE__ */ ft({
  __name: "ActionMenu",
  props: {
    items: {},
    name: {},
    busy: { type: Boolean },
    disabled: { type: Boolean },
    size: {},
    triggerLabel: {}
  },
  emits: ["select"],
  setup(t, { emit: e }) {
    const n = t, o = e, i = R(!1), a = R(null), f = L(() => ma(n.items));
    function g() {
      i.value = !i.value;
    }
    function k() {
      i.value = !1;
    }
    function p(h) {
      n.disabled || h.disabled || (k(), o("select", h.method));
    }
    return (h, v) => (l(), c("span", {
      ref_key: "trigger",
      ref: a,
      class: "kx-menu"
    }, [
      D(r(Z), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: t.size === "normal" ? void 0 : "small",
        class: V(["kx-menu-trigger", i.value && "is-active"]),
        "aria-haspopup": !0,
        "aria-expanded": i.value,
        "aria-label": t.triggerLabel || `More actions for ${t.name}`,
        title: "More actions",
        disabled: t.disabled,
        onClick: g
      }, {
        icon: O(({ class: m }) => [
          D(r(j), {
            icon: "tabler:dots",
            "aria-hidden": "true",
            class: V(m)
          }, null, 8, ["class"])
        ]),
        _: 1
      }, 8, ["size", "class", "aria-expanded", "aria-label", "disabled"]),
      D(ro, {
        open: i.value,
        "onUpdate:open": v[0] || (v[0] = (m) => i.value = m),
        anchor: a.value,
        align: "right",
        width: 264,
        "max-height": 460,
        gap: 6
      }, {
        default: O(() => [
          u("div", {
            class: "kx-menu-panel",
            role: "menu",
            "aria-label": `Actions for ${t.name}`
          }, [
            (l(!0), c(W, null, ot(f.value, (m, d) => (l(), c(W, {
              key: m.group
            }, [
              m.label ? (l(), c("div", {
                key: 0,
                class: V(["kx-menu-group", d === 0 && "is-first"])
              }, C(m.label), 3)) : d > 0 ? (l(), c("div", ha)) : $("", !0),
              (l(!0), c(W, null, ot(m.items, (w) => (l(), c("button", {
                key: w.method,
                type: "button",
                role: "menuitem",
                class: V(["kx-menu-item", [w.danger && "is-danger", w.warn && "is-warn"]]),
                "data-testid": `action-${w.method}`,
                "aria-label": r(ga)(w, t.name),
                disabled: t.disabled || w.disabled || t.busy && w.kind === "call",
                onClick: (P) => p(w)
              }, [
                D(r(j), {
                  icon: w.icon,
                  class: "kx-menu-item-ico",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                u("span", ka, [
                  u("span", xa, [
                    at(C(w.label) + " ", 1),
                    w.warn ? (l(), N(r(j), {
                      key: 0,
                      icon: "tabler:alert-triangle",
                      class: "kx-menu-item-warn",
                      "aria-hidden": "true"
                    })) : $("", !0)
                  ]),
                  u("span", _a, C(w.description), 1)
                ])
              ], 10, ya))), 128))
            ], 64))), 128))
          ], 8, va)
        ]),
        _: 1
      }, 8, ["open", "anchor"])
    ], 512));
  }
}), wa = {
  "aria-label": "History",
  class: "kx-history"
}, $a = {
  key: 0,
  role: "status",
  class: "kx-dnote"
}, Ca = {
  key: 1,
  role: "alert",
  class: "kx-dnote kx-dnote-err"
}, Sa = {
  key: 0,
  class: "kx-dnote"
}, Pa = { class: "kx-history-head" }, Da = ["datetime"], za = { class: "kx-history-state" }, Ea = { class: "kx-history-kv" }, Ia = { class: "kx-dfact-k" }, Aa = ["aria-label"], La = {
  class: "kx-history-v",
  "aria-label": "Authorized by"
}, Ma = {
  key: 0,
  class: "kx-dmsg is-err"
}, ja = /* @__PURE__ */ ft({
  __name: "ExecutionHistory",
  props: {
    root: {}
  },
  emits: ["error"],
  setup(t, { emit: e }) {
    const n = t, o = e, i = R([]), a = R([]), f = R([]), g = R(""), k = R(""), p = R(!1), h = R("");
    let v = 0;
    function m() {
      i.value = [], a.value = [], f.value = [], g.value = "", k.value = "";
    }
    function d(y) {
      return f.value.find((M) => M.type === y?.kind && M.id === y?.id)?.label || "Account unavailable";
    }
    function w(y, M) {
      const s = d(M);
      return y.evidence_status === "inferred" ? `${s} (unverified)` : s;
    }
    function P(y) {
      return y.evidence_status === "absent" ? "Account not recorded" : y.evidence_status === "unresolved" ? "Account unavailable" : w(y, y.evidence?.identity?.principal);
    }
    function U(y) {
      return {
        resolved: "Completed",
        waiting: "Waiting to retry",
        uncertain: "Needs attention",
        failed: "Failed",
        filtered: "Skipped",
        superseded: "Replaced",
        succeeded: "Accepted",
        pending: "Updating…"
      }[y] || "Outcome unavailable";
    }
    const B = L(() => [
      ...i.value.map((y) => ({
        key: rt(y),
        at: y.round_at,
        state: y.state,
        account: P(y),
        role: "Run by",
        authorizer: y.evidence?.identity?.authorized_by ? w(y, y.evidence.identity.authorized_by) : void 0,
        error: Y(y.error)
      })),
      ...a.value.map((y) => ({
        key: `${y.generation}:${y.request_id}`,
        at: y.created_at,
        state: y.state,
        account: y.initiation ? d({ kind: "user", id: y.initiation.actor_id }) : "Account not recorded",
        role: "Requested by",
        authorizer: void 0,
        error: ""
      }))
    ].sort((y, M) => M.at.localeCompare(y.at) || y.key.localeCompare(M.key)));
    function rt(y) {
      return JSON.stringify([y.drive_key, y.round_token, y.source_port, y.item_key, y.identity_key]);
    }
    function Y(y) {
      return nt(y, typeof y == "string" ? y : "");
    }
    async function A(y, M, s = "") {
      const { data: S } = await bt.get(
        "/api/v1/automations/" + encodeURIComponent(y) + "/history",
        { params: { kind: M, page_size: 25, ...s ? { page_token: s } : {} } }
      );
      if (!S.success || S.kind !== M || !Array.isArray(S.entries)) throw new Error(S.error?.message || "Could not read execution history");
      if (S.next_page_token && S.next_page_token === s) throw new Error("History page repeats its cursor");
      return S;
    }
    async function F(y, M) {
      const s = /* @__PURE__ */ new Map();
      function S(z) {
        z && (z.kind === "user" || z.kind === "group") && s.set(z.kind + ":" + z.id, { type: z.kind, id: z.id });
      }
      for (const z of y)
        S(z.evidence?.identity?.principal), S(z.evidence?.identity?.authorized_by);
      for (const z of M)
        z.initiation && S({ kind: "user", id: z.initiation.actor_id });
      return ao([...s.values()]);
    }
    function K(y) {
      m(), h.value = nt(y, "Could not read execution history"), o("error", { message: h.value, error: y });
    }
    async function G() {
      const y = ++v, M = n.root;
      if (m(), h.value = "", p.value = !1, !!M) {
        p.value = !0;
        try {
          const [s, S] = await Promise.all([A(M, "deliveries"), A(M, "controls")]), z = await F(s.entries, S.entries);
          if (y !== v) return;
          i.value = s.entries, a.value = S.entries, f.value = z, g.value = s.next_page_token || "", k.value = S.next_page_token || "";
        } catch (s) {
          y === v && K(s);
        } finally {
          y === v && (p.value = !1);
        }
      }
    }
    async function it() {
      if (p.value || !g.value && !k.value) return;
      const y = v, M = n.root;
      p.value = !0, h.value = "";
      try {
        const [s, S] = await Promise.all([
          g.value ? A(M, "deliveries", g.value) : null,
          k.value ? A(M, "controls", k.value) : null
        ]), z = [...i.value, ...s?.entries || []], Q = [...a.value, ...S?.entries || []], kt = await F(z, Q);
        if (y !== v) return;
        i.value = z, a.value = Q, f.value = kt, g.value = s?.next_page_token || "", k.value = S?.next_page_token || "";
      } catch (s) {
        y === v && K(s);
      } finally {
        y === v && (p.value = !1);
      }
    }
    return Ft(() => n.root, () => {
      G();
    }, { immediate: !0 }), se(() => {
      v += 1;
    }), (y, M) => (l(), c("section", wa, [
      M[1] || (M[1] = u("h3", { class: "kx-dsub-lbl" }, "History", -1)),
      p.value ? (l(), c("p", $a, "Loading history…")) : $("", !0),
      h.value ? (l(), c("p", Ca, C(h.value), 1)) : (l(), c(W, { key: 2 }, [
        !p.value && !B.value.length ? (l(), c("p", Sa, "No history yet.")) : $("", !0),
        (l(!0), c(W, null, ot(B.value, (s) => (l(), c("article", {
          key: s.key,
          class: "kx-history-entry"
        }, [
          u("div", Pa, [
            u("time", {
              class: "kx-history-meta",
              datetime: s.at
            }, C(r(pt)(s.at, { future: !0 })), 9, Da),
            u("span", za, C(U(s.state)), 1)
          ]),
          u("dl", Ea, [
            u("dt", Ia, C(s.role), 1),
            u("dd", {
              class: "kx-history-v",
              "aria-label": s.role
            }, C(s.account), 9, Aa),
            s.authorizer ? (l(), c(W, { key: 0 }, [
              M[0] || (M[0] = u("dt", { class: "kx-dfact-k" }, "Authorized by", -1)),
              u("dd", La, C(s.authorizer), 1)
            ], 64)) : $("", !0)
          ]),
          s.error ? (l(), c("p", Ma, C(s.error), 1)) : $("", !0)
        ]))), 128)),
        g.value || k.value ? (l(), N(r(Z), {
          key: 1,
          label: "More history",
          severity: "secondary",
          disabled: p.value,
          onClick: it
        }, null, 8, ["disabled"])) : $("", !0)
      ], 64))
    ]));
  }
});
function Mt(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function Ra(t) {
  return Mt(t) && typeof t.code == "string" && typeof t.message == "string" && typeof t.at == "string" && (t.item_key === void 0 || typeof t.item_key == "string");
}
function Ta(t) {
  if (!Mt(t) || typeof t.drive_key != "string") return !1;
  for (const e of ["source_kind", "phase"])
    if (t[e] !== void 0 && typeof t[e] != "string") return !1;
  if (t.enabled !== void 0 && typeof t.enabled != "boolean") return !1;
  for (const e of ["next_run_at", "last_run_at", "last_round_at"])
    if (t[e] !== void 0 && t[e] !== null && typeof t[e] != "string") return !1;
  for (const e of ["unresolved_count", "uncertain_count"])
    if (t[e] !== void 0 && (typeof t[e] != "number" || !Number.isInteger(t[e]) || t[e] < 0)) return !1;
  return !(t.last_error !== void 0 && t.last_error !== null && (!Mt(t.last_error) || t.last_error.message !== void 0 && typeof t.last_error.message != "string"));
}
function Ba(t) {
  if (!Mt(t) || t.success !== !0 || !Array.isArray(t.drives) || !t.drives.every(Ta) || t.next_page_token !== void 0 && t.next_page_token !== null && (typeof t.next_page_token != "string" || !t.next_page_token)) return !1;
  const e = t.delivery_failures;
  return e === void 0 || Mt(e) && typeof e.count == "number" && Number.isInteger(e.count) && e.count >= 0 && (e.last_error === void 0 || Ra(e.last_error));
}
const Qe = {
  blocked_identity: "The account this automation runs as needs to be confirmed.",
  blocked_access: "This automation lost access to something it uses.",
  blocked_declaration: "This automation's settings need to be fixed."
};
function Ht(t) {
  return (t?.drives || []).filter((e) => e.source_kind !== "none");
}
function Tt(t) {
  return t.enabled === !1 || t.phase === "paused";
}
function ze(t) {
  return (t.source_kind === "timer" || t.source_kind === "collection") && (t.phase === "pending" || t.phase === "active") && typeof t.next_run_at == "string" && Date.parse(t.next_run_at) > Date.now();
}
function Oa(t) {
  const e = Ht(t), n = (t?.delivery_failures?.count || 0) > 0;
  if (!e.length) return n ? { kind: "warn", label: "Needs attention" } : null;
  if (e.some((i) => (i.phase || "") in Qe)) return { kind: "warn", label: "Needs attention" };
  if (e.every(Tt)) return { kind: "off", label: "Paused" };
  if (n) return { kind: "warn", label: "Needs attention" };
  if (e.some((i) => i.phase === "degraded")) return { kind: "warn", label: "Retrying" };
  if (e.some((i) => i.phase === "backpressure")) return { kind: "live", label: "Catching up" };
  if (e.some((i) => !Tt(i) && i.phase === "pending" && !ze(i))) return { kind: "neutral", label: "Starting" };
  const o = e.filter((i) => !Tt(i) && i.source_kind !== "reconcile");
  return o.length && o.every(ze) ? { kind: "on", label: "Scheduled" } : { kind: "on", label: "Active" };
}
function Fa(t) {
  const e = t?.delivery_failures?.last_error;
  if (e) return `${e.code}: ${e.message}`;
  const n = Ht(t);
  for (const o of n) {
    const i = Qe[o.phase || ""];
    if (i) return i;
  }
  for (const o of n) {
    if (o.phase !== "degraded") continue;
    return (typeof o.last_error?.message == "string" ? o.last_error.message.trim() : "") || "The last run failed; it is retrying.";
  }
  return "";
}
function Na(t) {
  const e = Ht(t), n = [], o = St(t).next;
  o && n.push({ label: "Next run", value: o, time: !0 });
  const i = e.reduce((a, f) => a + (f.unresolved_count || 0), 0);
  return i > 0 && n.push({ label: "Waiting to retry", value: `${i} ${i === 1 ? "item" : "items"}` }), n;
}
function St(t) {
  const e = Ht(t), n = e.map((i) => i.last_run_at).filter((i) => typeof i == "string" && !!i).sort().at(-1), o = e.filter((i) => !Tt(i)).map((i) => i.next_run_at).filter((i) => typeof i == "string" && !!i).sort()[0];
  return { last: n, next: o };
}
const Ua = /* @__PURE__ */ new Set(["status", "enabled", "last_error", "last_run_at", "next_run_at"]);
function Ha(t) {
  return t.replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
function Va(t) {
  return t.replace(/\b\w/g, (e) => e.toUpperCase());
}
function Ka(t) {
  return t && t.charAt(0).toUpperCase() + t.slice(1);
}
function qa(t, e) {
  if (t.type === "boolean") return e === !0 ? "Yes" : "No";
  const n = String(e);
  return t.key.endsWith("_at") || /^\d{4}-\d{2}-\d{2}T/.test(n) ? pt(n, { future: !0 }) || n : t.type === "text" ? Ka(n) : n;
}
function tn(t) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t) || /^[0-9A-HJKMNP-TV-Z]{26}$/i.test(t) ? !0 : /^[a-z][a-z0-9_-]*:[a-z0-9][a-z0-9:_-]*$/i.test(t) && /:[0-9a-f-]{6,}/i.test(t);
}
function Wa(t) {
  return tn(t) ? { text: t.length > 12 ? `${t.slice(0, 8)}…` : t, title: t } : { text: t };
}
const Ya = [
  { match: /component_id not in scope|not in scope/i, text: "Not part of this workspace" },
  { match: /transform output must be an object/i, text: "Item format not recognized" },
  { match: /trigger events dropped/i, text: "Incoming events were dropped" },
  { match: /requires dest_ref/i, text: "Missing a destination reference" },
  { match: /does not declare sink operation|accepts source payloads only/i, text: "Destination cannot accept this item" },
  { match: /sink write (returned a non-object|did not acknowledge)/i, text: "Destination did not confirm the save" },
  { match: /(sink|source) resolve/i, text: "Source or destination unavailable" }
];
function Za(t) {
  const e = t.trim();
  if (!e) return { text: "" };
  for (const n of Ya)
    if (n.match.test(e)) return { text: n.text, title: e };
  return { text: "Skipped", title: e };
}
function en(t) {
  return /reason/i.test(t);
}
function Ga(t, e) {
  return en(t.key) || /(^|_)item(_key)?$/i.test(t.key) ? !0 : typeof e == "string" && tn(e);
}
function Xa(t, e) {
  const n = Va(t.label || Ha(t.key));
  if (en(t.key)) {
    const { text: a, title: f } = Za(String(e));
    return { label: n, value: a, title: f, icon: t.icon };
  }
  const { text: o, title: i } = Wa(qa(t, e));
  return { label: n, value: o, title: i, icon: t.icon };
}
function Ut(t, e, n) {
  const o = e;
  if (!t || !o) return [];
  const i = [];
  for (const a of t) {
    if (!a?.key || Ua.has(a.key) || a.role === "subtitle") continue;
    const f = o[a.key];
    f == null || f === "" || a.hidden || a.hide_zero && f === 0 || Ga(a, f) === n && i.push(Xa(a, f));
  }
  return i;
}
function de(t) {
  return String(t?.status || "").toLowerCase();
}
function Ja(t) {
  return typeof t == "string" && /\b(completed|succeeded|successfully)\b/i.test(t);
}
function nn(t) {
  const e = de(t);
  return e === "completed" || e === "failed";
}
function ce(t) {
  const e = de(t);
  return e === "failed" || e === "failing" ? !0 : !!t?.last_error && !Ja(t.last_error);
}
function on(t, e) {
  if (e?.code === "unavailable") return { tone: "error", text: "Its module is unavailable. Reinstall its module to use this automation." };
  const n = typeof t?.last_error == "string" ? t.last_error.trim() : "";
  return n ? ce(t) ? { tone: "error", text: n } : { tone: "success", text: n } : null;
}
function rn(t, e, n, o) {
  if (o?.code === "unavailable") return { kind: "warn", label: "Unavailable" };
  const i = Oa(n);
  if (i) return i;
  if (!t)
    return e ? { kind: "neutral", label: "…" } : { kind: "neutral", label: "Installed" };
  const a = de(t);
  return ce(t) ? { kind: "warn", label: a === "failed" ? "Failed" : "Failing" } : a === "completed" ? { kind: "done", label: "Completed" } : a === "paused" || t.enabled === !1 ? { kind: "off", label: "Paused" } : a === "running" ? { kind: "live", label: "Running" } : { kind: "on", label: "Active" };
}
function an(t) {
  switch (t) {
    case "on":
    case "live":
    case "done":
      return "success";
    case "warn":
      return "danger";
    case "off":
      return "warn";
    default:
      return "secondary";
  }
}
function sn(t, e) {
  const n = (t || []).find((i) => i?.role === "subtitle"), o = n ? e?.[n.key] : void 0;
  return typeof o == "string" ? o.trim() : "";
}
async function ln(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  let o, i;
  do {
    const a = o ? `?page_token=${encodeURIComponent(o)}` : "", { data: f } = await bt.get(`/api/v1/automations/${encodeURIComponent(t)}/status${a}`);
    if (!Ba(f)) throw new Error("Invalid automation status response");
    if (e.push(...f.drives), i = f.delivery_failures, o = f.next_page_token || void 0, o && n.has(o)) throw new Error("Automation status repeated a page token");
    o && n.add(o);
  } while (o);
  return { drives: e, delivery_failures: i };
}
const Qa = ["aria-label"], ti = { class: "kx-drawer-head" }, ei = { class: "kx-ficon" }, ni = { class: "kx-drawer-id" }, oi = ["title"], ri = { class: "kx-drawer-sub" }, ai = { class: "kx-drawer-controls" }, ii = {
  class: "kx-tabs",
  role: "tablist"
}, si = ["aria-selected", "data-testid", "onClick"], li = { class: "kx-drawer-body" }, ui = {
  key: 0,
  class: "kx-dsec"
}, di = {
  key: 0,
  class: "kx-errcard",
  "data-testid": "drawer-error-card"
}, ci = { class: "kx-errcard-head" }, bi = { class: "kx-errcard-cause" }, pi = { class: "kx-dgrid" }, fi = { class: "kx-dfact-k" }, mi = { class: "kx-dfact-v" }, gi = {
  key: 1,
  class: "kx-dsub"
}, vi = { class: "kx-metrics" }, hi = { class: "kx-metric-k" }, yi = ["title"], ki = {
  key: 1,
  class: "kx-dsec",
  "data-testid": "drawer-config"
}, xi = {
  key: 2,
  class: "kx-dnote"
}, _i = {
  key: 2,
  class: "kx-dsec"
}, wi = { class: "kx-dgrid" }, $i = { class: "kx-dfact" }, Ci = { class: "kx-dfact-v" }, Si = { class: "kx-dfact" }, Pi = { class: "kx-dfact-v" }, Di = { class: "kx-dfact" }, zi = { class: "kx-dfact-v" }, Ei = {
  key: 0,
  class: "kx-dsub"
}, Ii = /* @__PURE__ */ ft({
  __name: "DetailDrawer",
  props: {
    automation: { default: () => ({ id: "" }) },
    type: {}
  },
  emits: ["close", "action", "recover", "changed"],
  setup(t, { emit: e }) {
    const n = t, o = e, i = R("overview"), a = [
      { id: "overview", label: "Overview", icon: "tabler:layout-dashboard" },
      { id: "config", label: "Config", icon: "tabler:settings" },
      { id: "activity", label: "Activity", icon: "tabler:history" }
    ], f = L(() => n.automation.title || n.automation.id), g = L(() => n.automation.icon || n.type?.icon || "tabler:bolt"), k = L(() => n.type?.title || "Automation"), p = L(() => n.automation.public_state), h = L(() => Ze(n.type)), v = L(() => Xe(h.value)), m = L(() => h.value.declared.includes("status")), d = R(null);
    let w = 0;
    async function P(H) {
      const I = ++w;
      if (!H || !n.automation.drive_status || n.automation.availability) {
        d.value = null;
        return;
      }
      d.value = n.automation.drive_status;
      const E = await ln(H);
      I === w && n.automation.id === H && (d.value = E);
    }
    Ft(() => [n.automation.id, n.automation.drive_status, n.automation.availability], ([H]) => {
      P(H).catch((I) => ne.handleError("other", { message: String(I) }));
    }, { immediate: !0 });
    const U = L(() => rn(p.value, m.value, d.value, n.automation.availability)), B = L(() => U.value.kind === "off"), rt = L(() => nn(p.value)), Y = L(() => (h.value.declared.includes("pause") || h.value.declared.includes("resume")) && !rt.value), A = L(() => ce(p.value)), F = L(() => Ge(h.value.declared)), K = L(() => {
      if (n.automation.availability) return on(p.value, n.automation.availability)?.text || "";
      const H = Fa(d.value);
      if (H) return H;
      const I = typeof p.value?.last_error == "string" ? p.value.last_error.trim() : "";
      return A.value ? I : "";
    }), G = L(() => sn(n.type?.public_state_schema?.fields, p.value)), it = L(() => {
      const H = n.type?.public_state_schema?.fields;
      return [...Ut(H, p.value, !1), ...Ut(H, p.value, !0)];
    }), y = L(() => {
      const H = p.value, I = [];
      G.value && I.push({ label: "When", value: G.value });
      const E = Na(d.value);
      H?.next_run_at && !E.some((ut) => ut.label === "Next run") && I.push({ label: "Next run", value: pt(H.next_run_at, { future: !0 }) });
      for (const ut of E)
        I.push({ label: ut.label, value: ut.time ? pt(ut.value, { future: !0 }) : ut.value });
      return I;
    }), M = L(() => {
      const H = d.value?.drives.flatMap((E) => typeof E.last_round_at == "string" ? [E.last_round_at] : []) || [], I = d.value?.delivery_failures?.last_error?.at;
      return I && H.push(I), H.sort().at(-1) || p.value?.last_run_at;
    }), s = L(() => d.value?.delivery_failures), S = L(() => {
      const H = s.value?.last_error;
      return H ? `${H.code}: ${H.message}` : p.value?.last_error;
    }), z = L(() => ue(n.type)), Q = L(() => qe(n.automation, n.type)), kt = L(() => ({ location: Ke(n.type) }));
    return Ft(() => n.automation.id, () => {
      i.value = "overview";
    }), (H, I) => (l(), c(W, null, [
      u("div", {
        class: "kx-drawer-scrim",
        onClick: I[0] || (I[0] = (E) => o("close"))
      }),
      u("aside", {
        class: "kx-drawer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": f.value,
        "data-testid": "detail-drawer"
      }, [
        u("header", ti, [
          u("span", ei, [
            D(r(j), {
              icon: g.value,
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          u("div", ni, [
            u("div", {
              class: "kx-drawer-name",
              title: f.value
            }, C(f.value), 9, oi),
            u("div", ri, C(k.value), 1)
          ]),
          D(r(le), {
            severity: r(an)(U.value.kind),
            class: "kx-badge kx-tag-sm"
          }, {
            default: O(() => [
              U.value.kind === "live" ? (l(), N(r(j), {
                key: 0,
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              })) : $("", !0),
              at(" " + C(U.value.label), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          u("div", ai, [
            Y.value ? (l(), N(r(Z), {
              key: 0,
              type: "button",
              severity: "secondary",
              outlined: "",
              size: "small",
              "aria-label": `${B.value ? "Resume" : "Pause"} ${f.value}`,
              title: B.value ? "Resume" : "Pause",
              disabled: !!t.automation.deleting_at,
              onClick: I[1] || (I[1] = (E) => !t.automation.deleting_at && o("action", B.value ? "resume" : "pause"))
            }, {
              icon: O(({ class: E }) => [
                D(r(j), {
                  icon: B.value ? "tabler:player-play-filled" : "tabler:player-pause",
                  "aria-hidden": "true",
                  class: V(E)
                }, null, 8, ["icon", "class"])
              ]),
              _: 1
            }, 8, ["aria-label", "title", "disabled"])) : $("", !0),
            D(Je, {
              items: v.value,
              name: f.value,
              disabled: !!t.automation.deleting_at,
              onSelect: I[2] || (I[2] = (E) => !t.automation.deleting_at && o("action", E))
            }, null, 8, ["items", "name", "disabled"]),
            D(r(Z), {
              type: "button",
              severity: "secondary",
              text: "",
              size: "small",
              class: "kx-drawer-close",
              "aria-label": "Close details",
              title: "Close",
              onClick: I[3] || (I[3] = (E) => o("close"))
            }, {
              icon: O(({ class: E }) => [
                D(r(j), {
                  icon: "tabler:x",
                  "aria-hidden": "true",
                  class: V(E)
                }, null, 8, ["class"])
              ]),
              _: 1
            })
          ])
        ]),
        u("nav", ii, [
          (l(), c(W, null, ot(a, (E) => u("button", {
            key: E.id,
            type: "button",
            role: "tab",
            class: V(["kx-tab", i.value === E.id && "is-active"]),
            "aria-selected": i.value === E.id,
            "data-testid": `drawer-tab-${E.id}`,
            onClick: (ut) => i.value = E.id
          }, [
            D(r(j), {
              icon: E.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            at(" " + C(E.label), 1)
          ], 10, si)), 64))
        ]),
        u("div", li, [
          i.value === "overview" ? (l(), c("section", ui, [
            K.value ? (l(), c("div", di, [
              u("div", ci, [
                D(r(j), {
                  icon: "tabler:alert-circle",
                  "aria-hidden": "true"
                }),
                u("span", null, C(n.automation.availability ? "This automation is unavailable" : "This automation is failing"), 1)
              ]),
              u("p", bi, C(K.value), 1),
              F.value ? (l(), N(r(Z), {
                key: 0,
                type: "button",
                size: "small",
                severity: "danger",
                "aria-label": `Recover ${f.value}`,
                "data-testid": "drawer-recover",
                label: "Recover",
                disabled: !!t.automation.deleting_at,
                onClick: I[4] || (I[4] = (E) => !t.automation.deleting_at && o("recover"))
              }, {
                icon: O(({ class: E }) => [
                  D(r(j), {
                    icon: "tabler:rotate-clockwise-2",
                    "aria-hidden": "true",
                    class: V(E)
                  }, null, 8, ["class"])
                ]),
                _: 1
              }, 8, ["aria-label", "disabled"])) : $("", !0)
            ])) : $("", !0),
            u("div", pi, [
              (l(!0), c(W, null, ot(y.value, (E) => (l(), c("div", {
                key: E.label,
                class: "kx-dfact"
              }, [
                u("span", fi, C(E.label), 1),
                u("strong", mi, C(E.value), 1)
              ]))), 128))
            ]),
            it.value.length ? (l(), c("div", gi, [
              I[9] || (I[9] = u("div", { class: "kx-dsub-lbl" }, "Progress", -1)),
              u("div", vi, [
                (l(!0), c(W, null, ot(it.value, (E) => (l(), c("span", {
                  key: E.label,
                  class: "kx-metric"
                }, [
                  E.icon ? (l(), N(r(j), {
                    key: 0,
                    icon: E.icon,
                    class: "kx-metric-i",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])) : $("", !0),
                  u("span", hi, C(E.label), 1),
                  u("span", {
                    class: "kx-metric-v",
                    title: E.title
                  }, C(E.value), 9, yi)
                ]))), 128))
              ])
            ])) : $("", !0)
          ])) : i.value === "config" ? (l(), c("section", ki, [
            !t.automation.deleting_at && !t.automation.availability && ((t.automation.access_level || 0) & 8) !== 0 ? (l(), N(Nt, {
              key: 0,
              tag: "wc-execution-identity-editor",
              attrs: { root: t.automation.id },
              onChange: I[5] || (I[5] = (E) => o("changed"))
            }, null, 8, ["attrs"])) : $("", !0),
            z.value && !t.automation.deleting_at ? (l(), N(Nt, {
              key: 1,
              class: "kx-manage-host",
              tag: z.value,
              config: Q.value,
              meta: kt.value,
              onChange: I[6] || (I[6] = (E) => o("changed")),
              onClose: I[7] || (I[7] = (E) => i.value = "overview")
            }, null, 8, ["tag", "config", "meta"])) : (l(), c("div", xi, "This automation type declares no settings view."))
          ])) : (l(), c("section", _i, [
            u("div", wi, [
              u("div", $i, [
                I[10] || (I[10] = u("span", { class: "kx-dfact-k" }, "Last run", -1)),
                u("strong", Ci, C(M.value ? r(pt)(M.value, { future: !0 }) : "Never"), 1)
              ]),
              u("div", Si, [
                I[11] || (I[11] = u("span", { class: "kx-dfact-k" }, "Last outcome", -1)),
                u("strong", Pi, C(s.value?.count ? "Failed delivery" : p.value?.status || "—"), 1)
              ]),
              u("div", Di, [
                I[12] || (I[12] = u("span", { class: "kx-dfact-k" }, "Failed deliveries", -1)),
                u("strong", zi, C(s.value?.count ?? 0), 1)
              ])
            ]),
            typeof S.value == "string" && S.value.trim() ? (l(), c("div", Ei, [
              I[13] || (I[13] = u("div", { class: "kx-dsub-lbl" }, "Last message", -1)),
              u("p", {
                class: V(["kx-dmsg", A.value || s.value?.count ? "is-err" : "is-ok"])
              }, C(S.value), 3)
            ])) : $("", !0),
            !t.automation.availability && ((t.automation.access_level || 0) & 8) !== 0 ? (l(), N(ja, {
              key: 1,
              root: t.automation.id,
              onError: I[8] || (I[8] = (E) => r(ne).handleError("other", { message: E.message }))
            }, null, 8, ["root"])) : $("", !0)
          ]))
        ])
      ], 8, Qa)
    ], 64));
  }
});
function Ai(t) {
  const e = R(!1), n = R(null), o = R({}), i = R(!1), a = R(!1), f = R(""), g = R(null), k = R(null);
  let p = null;
  const h = R(""), v = L(() => t.types.value.filter(
    (s) => s.installable !== !1 && Object.entries(t.inputPreset.value).every(([S, z]) => {
      const Q = s.inputs?.properties?.[S];
      return !!Q && (!Q.enum || typeof z == "string" && Q.enum.includes(z));
    })
  )), m = L(() => !t.componentMode.value || !t.preferredTypeId.value || n.value?.id !== t.preferredTypeId.value), d = L(() => n.value ? Qn(n.value).filter(([s]) => !(s in t.inputPreset.value)) : []), w = L(() => {
    const s = h.value.trim().toLowerCase();
    return s ? v.value.filter(
      (S) => (S.title || "").toLowerCase().includes(s) || (S.name || "").toLowerCase().includes(s) || ae(S).toLowerCase().includes(s)
    ) : v.value;
  });
  function P(s) {
    G(), h.value = "", n.value = s || null, o.value = s ? { ...he(s), ...t.inputPreset.value } : {}, f.value = "", e.value = !0, Qt(Y);
  }
  function U(s) {
    G(), n.value = s, o.value = { ...he(s), ...t.inputPreset.value }, f.value = "", Qt(Y);
  }
  function B() {
    G(), e.value = !1, n.value = null, o.value = {}, f.value = "", a.value = !1, t.createMode.value && t.emitHost("close", {});
  }
  function rt() {
    !m.value || n.value || Qt(() => k.value?.focus({ preventScroll: !0 }));
  }
  async function Y() {
    const s = n.value, S = ie(s);
    if (!(!S || !s || !g.value))
      try {
        if (await Zn(S, { timeoutMs: 8e3 }), n.value?.id !== s.id || !g.value) return;
        const z = document.createElement(S);
        z.setAttribute("type-id", s.id), z.setAttribute("input", JSON.stringify(t.inputPreset.value)), t.effectiveParentId.value && z.setAttribute("parent-id", t.effectiveParentId.value), z.setAttribute("embedded", "true"), z.addEventListener("automation-installed", K), z.addEventListener("submit-state", A), g.value.innerHTML = "", g.value.appendChild(z), p = z;
      } catch (z) {
        const Q = Pr(s);
        f.value = `Failed to load setup UI (${S}${Q ? ` at ${Q}` : ""}): ` + (z instanceof Error ? z.message : String(z));
      }
  }
  function A(s) {
    a.value = !!s.detail?.saving;
  }
  function F() {
    ie(n.value) ? Dr(p) : M();
  }
  async function K(s) {
    const S = s.detail;
    if (S?.success === !1) {
      f.value = S?.error || "Could not create the automation.", a.value = !1;
      return;
    }
    if (t.createMode.value) {
      t.emitHost("created", { id: S?.id });
      return;
    }
    B(), await t.reload();
  }
  function G() {
    p && (p.removeEventListener("automation-installed", K), p.removeEventListener("submit-state", A), p.remove(), p = null), g.value && (g.value.innerHTML = "");
  }
  function it() {
    const s = t.preferredTypeId.value;
    return s ? v.value.find((S) => S.id === s) : void 0;
  }
  function y() {
    P(it());
  }
  async function M() {
    const s = n.value;
    if (!s) return;
    const S = to(s, o.value);
    if (S) {
      f.value = S;
      return;
    }
    i.value = !0, f.value = "";
    try {
      const { data: z } = await bt.post("/api/v1/automations", {
        type: s.id,
        input: eo(s, o.value),
        parent_id: t.effectiveParentId.value || void 0
      });
      if (z?.success) {
        if (t.createMode.value) {
          t.emitHost("created", { id: z.id });
          return;
        }
        B(), await t.reload();
      } else
        f.value = nt({ response: { data: z } }, "install failed");
    } catch (z) {
      f.value = nt(z, "install failed");
    } finally {
      i.value = !1;
    }
  }
  return {
    showTypeCatalog: m,
    installFields: d,
    showInstall: e,
    installType: n,
    installForm: o,
    installing: i,
    customSaving: a,
    installError: f,
    customInstallHost: g,
    installSearchInput: k,
    typeSearch: h,
    filteredTypes: w,
    openInstall: P,
    openPreferredInstall: y,
    chooseType: U,
    closeInstall: B,
    focusInstallDialog: rt,
    onCreate: F,
    unmountCustomInstallUi: G
  };
}
function Li({ automations: t, types: e, query: n, drawerId: o }) {
  const i = L(() => {
    const s = {};
    for (const S of e.value) s[S.id] = S;
    return s;
  }), a = L(() => {
    const s = n.value.trim().toLowerCase();
    return s ? t.value.filter(
      (S) => (S.title || "").toLowerCase().includes(s) || (S.description || "").toLowerCase().includes(s) || (S.type || "").toLowerCase().includes(s)
    ) : t.value;
  });
  function f(s) {
    return s.title || s.id;
  }
  function g(s) {
    return s.type ? i.value[s.type] : void 0;
  }
  function k(s) {
    return s.icon ? s.icon : g(s)?.icon || "tabler:bolt";
  }
  function p(s) {
    return Ye(g(s));
  }
  function h(s, S) {
    return p(s).has(S);
  }
  function v(s) {
    return We(p(s));
  }
  function m(s) {
    return Xe(Ze(g(s)));
  }
  function d(s) {
    return Ge(p(s));
  }
  function w(s) {
    return ue(g(s));
  }
  function P(s) {
    return Ke(g(s));
  }
  function U(s) {
    return s ? qe(s, g(s)) : {};
  }
  function B(s) {
    return s.public_state;
  }
  function rt(s) {
    return Ut(g(s)?.public_state_schema?.fields, B(s), !1);
  }
  function Y(s) {
    return Ut(g(s)?.public_state_schema?.fields, B(s), !0);
  }
  function A(s) {
    return nn(B(s));
  }
  function F(s) {
    return on(B(s), s.availability);
  }
  function K(s) {
    return rn(B(s), h(s, "status"), s.drive_status, s.availability);
  }
  function G(s) {
    return K(s).kind === "off";
  }
  function it(s) {
    return sn(g(s)?.public_state_schema?.fields, B(s));
  }
  const y = L(() => t.value.find((s) => s.id === o.value) || null), M = L(() => y.value ? g(y.value) : void 0);
  return {
    typeById: i,
    filtered: a,
    pretty: f,
    typeFor: g,
    iconFor: k,
    declaredActions: p,
    hasAction: h,
    runNowFor: v,
    actionItemsFor: m,
    recoverFor: d,
    manageTag: w,
    manageLocation: P,
    manageConfig: U,
    statusFor: B,
    metrics: rt,
    detailMetrics: Y,
    isTerminal: A,
    rowMessage: F,
    statusOf: K,
    isPaused: G,
    subtitleLine: it,
    drawerAutomation: y,
    drawerType: M
  };
}
function Mi(t, e) {
  const n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = 0;
  const a = /* @__PURE__ */ new Map();
  function f(v, m) {
    const d = m.meta, w = t.value.find((P) => P.id === v);
    w && (w.public_state = { ...w.public_state || {}, ...d }, typeof d.title == "string" && (w.title = d.title), typeof d.comment == "string" && (w.description = d.comment), g(v).catch((P) => ne.handleError("other", { message: String(P) })));
  }
  async function g(v) {
    if (!t.value.some((P) => P.id === v && P.drive_status)) return;
    const m = Symbol(v);
    a.set(v, m);
    const d = await ln(v);
    if (a.get(v) !== m) return;
    a.delete(v);
    const w = t.value.find((P) => P.id === v);
    w && (w.drive_status = d);
  }
  function k(v) {
    const m = {};
    for (const d of e(v)?.public_state_schema?.fields || [])
      d?.key && d.type && (m[d.key] = d.type);
    return m;
  }
  function p() {
    i++, o.clear(), a.clear();
    for (const v of n.values()) v();
    n.clear();
  }
  function h() {
    const v = new Set(t.value.map((d) => d.id).filter(Boolean));
    for (const [d, w] of n)
      v.has(d) || (w(), n.delete(d), a.delete(d));
    const m = i;
    for (const d of v) {
      if (n.has(d) || o.has(d)) continue;
      o.add(d);
      const w = t.value.find((U) => U.id === d), P = Bo(d, (U) => f(d, U), w ? k(w) : void 0);
      if (o.delete(d), !!P) {
        if (m !== i || !t.value.some((U) => U.id === d)) {
          P();
          continue;
        }
        n.set(d, P);
      }
    }
  }
  return { syncRealtimeSubscriptions: h, clearRealtimeSubscriptions: p, refreshDriveStatus: g };
}
function ji() {
  let t = 0;
  return () => {
    const e = ++t;
    return () => e === t;
  };
}
function Ri({ automations: t, types: e, loading: n, error: o, parentId: i, syncRealtimeSubscriptions: a }) {
  async function f() {
    try {
      const { data: h } = await bt.get("/api/v1/automations/types");
      e.value = h?.success ? h.types || [] : [];
    } catch {
      e.value = [];
    }
  }
  const g = ji();
  async function k() {
    const h = g();
    n.value = !0, o.value = "";
    try {
      const { data: v } = await bt.get("/api/v1/automations", { params: { class: "automation", parent_id: i() } });
      if (!v?.success) throw new Error(nt(v?.error, "failed to load automations"));
      if (!h()) return;
      t.value = v.automations || [], a();
    } catch (v) {
      if (!h()) return;
      a(), o.value = nt(v, "failed to load automations");
    } finally {
      h() && (n.value = !1);
    }
  }
  async function p() {
    await f(), await k();
  }
  return { fetchTypes: f, fetchAutomations: k, reload: p };
}
function Ti(t, e, n) {
  async function o(i) {
    t.value = i.id, e.value = "";
    try {
      const { data: a } = await bt.get(`/api/v1/automations/${encodeURIComponent(i.id)}/export`);
      if (!a?.success || !a.artifact)
        throw new Error(a?.error?.message || a?.error || "Automation export failed.");
      const f = n(i).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "automation", g = new Blob([`${JSON.stringify(a.artifact, null, 2)}
`], { type: "application/json" }), k = URL.createObjectURL(g), p = document.createElement("a");
      p.href = k, p.download = `${f}.automation.json`, document.body.appendChild(p), p.click(), p.remove(), URL.revokeObjectURL(k);
    } catch (a) {
      e.value = nt(a, "Automation export failed.");
    } finally {
      t.value = "";
    }
  }
  return { exportAutomation: o };
}
const Bi = { class: "kx" }, Oi = {
  key: 0,
  class: "kx-head"
}, Fi = { class: "kx-head-icon" }, Ni = { class: "kx-head-actions" }, Ui = { class: "kx-count" }, Hi = { class: "kx-search" }, Vi = {
  key: 1,
  class: "kx-err"
}, Ki = {
  key: 2,
  class: "kx-body"
}, qi = {
  key: 0,
  class: "kx-loading"
}, Wi = {
  key: 1,
  class: "kx-empty"
}, Yi = { class: "kx-empty-ico" }, Zi = {
  key: 2,
  class: "kx-empty"
}, Gi = {
  key: 3,
  class: "kx-list"
}, Xi = ["aria-label", "onClick", "disabled"], Ji = { class: "kx-ficon" }, Qi = { class: "kx-id" }, ts = ["title"], es = { class: "kx-sub" }, ns = { key: 0 }, os = { key: 1 }, rs = { key: 2 }, as = { class: "kx-actions" }, is = {
  key: 0,
  class: "kx-rowfoot"
}, ss = ["title"], ls = { class: "kx-modal-head-icon" }, us = { class: "kx-modal-head-text" }, ds = { class: "kx-modal-head-title" }, cs = { class: "kx-modal-head-sub" }, bs = { class: "kx-modal-body" }, ps = { class: "kx-modal-head-icon" }, fs = { class: "kx-modal-head-text" }, ms = { class: "kx-modal-head-title" }, gs = { class: "kx-modal-head-sub" }, vs = { class: "kx-modal-body" }, hs = { class: "kx-modal-body" }, ys = {
  key: 0,
  class: "kx-delopts"
}, ks = ["onUpdate:modelValue"], xs = { class: "kx-delopt-copy" }, _s = { class: "kx-delopt-t" }, ws = {
  key: 0,
  class: "kx-delopt-d"
}, $s = /* @__PURE__ */ ft({
  __name: "automations",
  setup(t) {
    const e = {
      header: { class: "kx-dialog-header" },
      content: { class: "kx-dialog-content" },
      footer: { class: "kx-dialog-footer" }
    }, n = R([]), o = R([]), i = R(!1), a = R(""), f = R(""), g = R(""), k = /* @__PURE__ */ new Map(), p = R(""), h = R(""), v = Li({ automations: n, types: o, query: f, drawerId: h }), {
      filtered: m,
      pretty: d,
      typeFor: w,
      iconFor: P,
      hasAction: U,
      actionItemsFor: B,
      recoverFor: rt,
      manageTag: Y,
      manageLocation: A,
      manageConfig: F,
      metrics: K,
      detailMetrics: G,
      isTerminal: it,
      rowMessage: y,
      statusOf: M,
      isPaused: s,
      subtitleLine: S,
      drawerAutomation: z,
      drawerType: Q
    } = v, kt = Mi(n, w), { syncRealtimeSubscriptions: H, clearRealtimeSubscriptions: I, refreshDriveStatus: E } = kt, ut = Ti(p, a, d), { exportAutomation: un } = ut, mt = On(), dn = Fn(), xt = L(() => mt.value?.mode === "create"), Vt = L(() => mt.value?.mode === "component"), cn = no(mt), be = L(() => String(mt.value?.componentId || "").trim()), bn = L(() => String(mt.value?.typeId || "").trim()), pn = L(() => be.value || cn.value), fn = Ri({
      automations: n,
      types: o,
      loading: i,
      error: a,
      parentId: () => be.value || void 0,
      syncRealtimeSubscriptions: H
    }), { fetchAutomations: gt, reload: Kt } = fn, _t = Ai({
      types: o,
      createMode: xt,
      componentMode: Vt,
      effectiveParentId: pn,
      preferredTypeId: bn,
      inputPreset: L(() => oo(mt.value?.input)),
      emitHost: (x, _) => dn(x, _),
      reload: () => Kt()
    }), st = R(null), Rt = R({}), wt = R(!1), tt = R(null), dt = R(null);
    function mn(x) {
      dt.value = x;
    }
    function pe() {
      dt.value = null;
    }
    function gn(x) {
      const _ = x?.id || "";
      return {
        resource_id: _,
        access_url: `/api/v1/component-access/grants/${encodeURIComponent(_)}`,
        share_url: `/api/v1/component-access/share/${encodeURIComponent(_)}`,
        title: x ? d(x) : ""
      };
    }
    function fe(x, _) {
      if (!x.deleting_at)
        switch (_) {
          case "reconfigure":
            $n(x);
            break;
          case "share":
            mn(x);
            break;
          case "export":
            un(x);
            break;
          case "delete":
            Wt(x);
            break;
          default:
            qt(x, _);
        }
    }
    function me(x) {
      if (x.deleting_at) return;
      const _ = rt(x);
      _ && qt(x, _);
    }
    function vn(x) {
      h.value = x.id, gt();
    }
    function hn() {
      h.value = "";
    }
    function yn(x) {
      const _ = z.value;
      _ && fe(_, x);
    }
    function kn() {
      const x = z.value;
      x && me(x);
    }
    async function qt(x, _) {
      if (x.deleting_at || g.value) return;
      g.value = x.id, a.value = "";
      const b = w(x)?.controls?.some((et) => et.name === _) === !0, q = `${x.id}:${_}`, ge = b ? k.get(q) || crypto.randomUUID() : "";
      b && k.set(q, ge);
      try {
        const { data: et } = await bt.post(
          `/api/v1/automations/${x.id}/actions/${_}`,
          b ? { request_id: ge } : {}
        );
        if (!et?.success) {
          a.value = nt({ response: { data: et } }, `${_} failed`);
          return;
        }
        if (b && et.result?.state === "succeeded" && k.delete(q), et.result && typeof et.result == "object") {
          const { success: Gt, ...Sn } = et.result;
          x.public_state = { ...x.public_state || {}, ...Sn };
        }
        if (x.drive_status?.drives?.length)
          await E(x.id);
        else if (_ === "pause" || _ === "resume") {
          const Gt = typeof et.result?.paused == "boolean" ? et.result.paused : _ === "pause";
          x.public_state = {
            ...x.public_state || {},
            enabled: !Gt,
            status: et.result?.status || (Gt ? "paused" : "active")
          };
        }
      } catch (et) {
        a.value = nt(et, `${_} failed`);
      } finally {
        g.value = "";
      }
    }
    async function xn(x) {
      await qt(x, s(x) ? "resume" : "pause");
    }
    function Wt(x) {
      st.value = x;
      const _ = w(x), b = {};
      for (const q of _?.delete_options || []) b[q.key] = !!q.default;
      Rt.value = b;
    }
    function Yt(x) {
      return x ? w(x)?.delete_options || [] : [];
    }
    function _n(x) {
      tt.value = null, Wt(x);
    }
    async function wn() {
      const x = st.value;
      if (x) {
        wt.value = !0, a.value = "";
        try {
          const b = Yt(x).length ? { options: { ...Rt.value } } : {}, { data: q } = await bt.delete(`/api/v1/automations/${x.id}`, { data: b });
          q?.success ? (Cn(x.id, q), st.value = null, await gt()) : a.value = nt({ response: { data: q } }, "failed to delete automation");
        } catch (_) {
          a.value = nt(_, "failed to delete automation");
        } finally {
          wt.value = !1;
        }
      }
    }
    function $n(x) {
      Y(x) && (tt.value = x);
    }
    async function Zt(x = !0) {
      tt.value = null, x && await Kt();
    }
    Nn(async () => {
      try {
        await Kt(), xt.value && _t.openPreferredInstall();
      } catch (x) {
        a.value = nt(x, "host API unavailable");
      }
    }), se(() => {
      _t.unmountCustomInstallUi(), I();
    });
    const { acceptDeletion: Cn } = Oo(n, (x) => x.id, void 0, gt);
    return (x, _) => (l(), c("div", Bi, [
      xt.value ? $("", !0) : (l(), c("header", Oi, [
        Vt.value ? $("", !0) : (l(), c(W, { key: 0 }, [
          u("div", Fi, [
            D(r(j), {
              icon: "tabler:bolt",
              "aria-hidden": "true"
            })
          ]),
          _[10] || (_[10] = u("div", { class: "kx-head-text" }, [
            u("h1", { class: "kx-head-title" }, "Automations"),
            u("p", { class: "kx-head-sub" }, "Scheduled and event-driven jobs that run on their own.")
          ], -1))
        ], 64)),
        u("div", Ni, [
          u("span", Ui, C(n.value.length) + " automation" + C(n.value.length !== 1 ? "s" : ""), 1),
          u("div", Hi, [
            D(r(j), {
              icon: "tabler:search",
              class: "kx-search-ico",
              "aria-hidden": "true"
            }),
            ct(u("input", {
              "onUpdate:modelValue": _[0] || (_[0] = (b) => f.value = b),
              class: "kx-search-input",
              type: "text",
              placeholder: "Search automations…"
            }, null, 512), [
              [ee, f.value]
            ])
          ]),
          D(r(Z), {
            type: "button",
            "data-testid": "automations-add",
            label: "Add automation",
            onClick: _[1] || (_[1] = (b) => r(_t).openPreferredInstall())
          }, {
            icon: O(({ class: b }) => [
              D(r(j), {
                icon: "tabler:plus",
                class: V(b),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          })
        ])
      ])),
      !xt.value && a.value ? (l(), c("div", Vi, C(a.value), 1)) : $("", !0),
      xt.value ? $("", !0) : (l(), c("div", Ki, [
        i.value && !n.value.length ? (l(), c("div", qi, [
          D(r(j), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          _[11] || (_[11] = at(" Loading… ", -1))
        ])) : n.value.length ? r(m).length ? (l(), c("div", Gi, [
          (l(!0), c(W, null, ot(r(m), (b) => (l(), c("div", {
            key: b.id,
            class: V(["kx-row", h.value === b.id && "is-open"])
          }, [
            u("button", {
              type: "button",
              class: "kx-open",
              "aria-label": `Open ${r(d)(b)} details`,
              onClick: (q) => !b.deleting_at && vn(b),
              disabled: !!b.deleting_at
            }, [
              u("span", Ji, [
                D(r(j), {
                  icon: r(P)(b),
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              u("span", Qi, [
                u("span", {
                  class: "kx-name",
                  title: r(d)(b)
                }, C(r(d)(b)), 9, ts),
                u("span", es, [
                  u("span", null, C(r(w)(b)?.title || "Automation"), 1),
                  r(S)(b) ? (l(), c("span", ns, " · " + C(r(S)(b)), 1)) : $("", !0),
                  r(St)(b.drive_status).last ? (l(), c("span", os, " · last ran " + C(r(pt)(r(St)(b.drive_status).last, { future: !0 })), 1)) : $("", !0),
                  r(St)(b.drive_status).next ? (l(), c("span", rs, " · next " + C(r(pt)(r(St)(b.drive_status).next, { future: !0 })), 1)) : $("", !0)
                ])
              ])
            ], 8, Xi),
            D(r(le), {
              severity: r(an)(r(M)(b).kind),
              class: "kx-badge kx-tag-sm"
            }, {
              default: O(() => [
                r(M)(b).kind === "live" ? (l(), N(r(j), {
                  key: 0,
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                })) : $("", !0),
                at(" " + C(r(M)(b).label), 1)
              ]),
              _: 2
            }, 1032, ["severity"]),
            u("div", as, [
              (r(U)(b, "pause") || r(U)(b, "resume")) && !r(it)(b) ? (l(), N(r(Z), {
                key: 0,
                type: "button",
                severity: "secondary",
                outlined: "",
                size: "small",
                disabled: !!b.deleting_at || g.value === b.id,
                "aria-label": `${r(s)(b) ? "Resume" : "Pause"} ${r(d)(b)}`,
                title: r(s)(b) ? "Resume" : "Pause",
                onClick: (q) => xn(b)
              }, {
                icon: O(({ class: q }) => [
                  D(r(j), {
                    icon: r(s)(b) ? "tabler:player-play-filled" : "tabler:player-pause",
                    "aria-hidden": "true",
                    class: V(q)
                  }, null, 8, ["icon", "class"])
                ]),
                _: 2
              }, 1032, ["disabled", "aria-label", "title", "onClick"])) : $("", !0),
              D(Je, {
                items: r(B)(b),
                name: r(d)(b),
                busy: !!b.deleting_at || g.value === b.id,
                onSelect: (q) => fe(b, q)
              }, null, 8, ["items", "name", "busy", "onSelect"])
            ]),
            b.deleting_at || r(y)(b) || r(G)(b).length || r(K)(b).length ? (l(), c("div", is, [
              D(Lo, {
                state: b,
                onRetry: (q) => Wt(b)
              }, null, 8, ["state", "onRetry"]),
              r(y)(b) ? (l(), c("div", {
                key: 0,
                class: V(["kx-rowmsg", `kx-rowmsg-${r(y)(b)?.tone}`])
              }, [
                D(r(j), {
                  icon: r(y)(b)?.tone === "error" ? "tabler:alert-circle" : "tabler:circle-check",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                u("span", {
                  class: "kx-rowmsg-txt",
                  title: r(y)(b)?.text
                }, C(r(y)(b)?.text), 9, ss),
                r(y)(b)?.tone === "error" && r(rt)(b) ? (l(), N(r(Z), {
                  key: 0,
                  type: "button",
                  severity: "danger",
                  text: "",
                  size: "small",
                  class: "kx-recover",
                  "data-testid": "row-recover",
                  "aria-label": `Recover ${r(d)(b)}`,
                  disabled: !!b.deleting_at || g.value === b.id,
                  label: "Recover",
                  onClick: (q) => me(b)
                }, {
                  icon: O(({ class: q }) => [
                    D(r(j), {
                      icon: "tabler:rotate-clockwise-2",
                      "aria-hidden": "true",
                      class: V(q)
                    }, null, 8, ["class"])
                  ]),
                  _: 1
                }, 8, ["aria-label", "disabled", "onClick"])) : $("", !0)
              ], 2)) : $("", !0),
              D(ua, {
                face: r(K)(b),
                detail: r(G)(b)
              }, null, 8, ["face", "detail"])
            ])) : $("", !0)
          ], 2))), 128))
        ])) : (l(), c("div", Zi, [..._[14] || (_[14] = [
          u("div", { class: "kx-empty-title" }, "No matches", -1),
          u("div", { class: "kx-empty-sub" }, "No automations match the current search.", -1)
        ])])) : (l(), c("div", Wi, [
          u("div", Yi, [
            D(r(j), {
              icon: "tabler:bolt",
              "aria-hidden": "true"
            })
          ]),
          _[12] || (_[12] = u("div", { class: "kx-empty-title" }, "No automations yet", -1)),
          _[13] || (_[13] = u("div", { class: "kx-empty-sub" }, "Choose an automation type to get started.", -1)),
          D(r(Z), {
            type: "button",
            "data-testid": "automations-add",
            label: "Add automation",
            onClick: _[2] || (_[2] = (b) => r(_t).openPreferredInstall())
          }, {
            icon: O(({ class: b }) => [
              D(r(j), {
                icon: "tabler:plus",
                class: V(b),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          })
        ]))
      ])),
      r(z) ? (l(), N(Ii, {
        key: 3,
        automation: r(z),
        type: r(Q),
        onClose: hn,
        onAction: yn,
        onRecover: kn,
        onChanged: r(gt)
      }, null, 8, ["automation", "type", "onChanged"])) : $("", !0),
      D(ea, {
        flow: r(_t),
        "component-mode": Vt.value,
        "dialog-pt": e
      }, null, 8, ["flow", "component-mode"]),
      tt.value ? (l(), N(r(Pt), {
        key: 4,
        visible: !!tt.value,
        modal: !0,
        "dismissable-mask": !0,
        pt: e,
        class: "kx-modal kx-modal-manage",
        "aria-label": r(d)(tt.value),
        "onUpdate:visible": _[6] || (_[6] = (b) => {
          b || Zt(!1);
        })
      }, {
        header: O(() => [
          u("span", ls, [
            D(r(j), {
              icon: r(P)(tt.value),
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          u("span", us, [
            u("span", ds, C(r(d)(tt.value)), 1),
            u("span", cs, C(r(w)(tt.value)?.title || "Automation"), 1)
          ])
        ]),
        footer: O(() => [
          D(r(Z), {
            type: "button",
            class: "kx-foot-delete",
            severity: "danger",
            outlined: "",
            label: "Delete",
            onClick: _[5] || (_[5] = (b) => _n(tt.value))
          }, {
            icon: O(({ class: b }) => [
              D(r(j), {
                icon: "tabler:trash",
                "aria-hidden": "true",
                class: V(b)
              }, null, 8, ["class"])
            ]),
            _: 1
          })
        ]),
        default: O(() => [
          u("div", bs, [
            D(Nt, {
              class: "kx-manage-host",
              tag: r(Y)(tt.value),
              config: r(F)(tt.value),
              meta: { location: r(A)(tt.value) },
              onCreated: _[3] || (_[3] = (b) => Zt(!0)),
              onClose: _[4] || (_[4] = (b) => Zt(!0)),
              onChange: r(gt)
            }, null, 8, ["tag", "config", "meta", "onChange"])
          ])
        ]),
        _: 1
      }, 8, ["visible", "aria-label"])) : $("", !0),
      dt.value ? (l(), N(r(Pt), {
        key: 5,
        visible: !!dt.value,
        modal: "",
        pt: e,
        class: "kx-modal",
        "aria-label": `Share ${r(d)(dt.value)}`,
        "onUpdate:visible": _[7] || (_[7] = (b) => {
          b || pe();
        })
      }, {
        header: O(() => [
          u("span", ps, [
            D(r(j), {
              icon: "tabler:users",
              "aria-hidden": "true"
            })
          ]),
          u("span", fs, [
            u("span", ms, "Share " + C(r(d)(dt.value)), 1),
            u("span", gs, C(r(w)(dt.value)?.title || "Automation"), 1)
          ])
        ]),
        default: O(() => [
          u("div", vs, [
            D(Nt, {
              class: "kx-manage-host",
              tag: "kickside-share",
              config: gn(dt.value),
              onClose: pe,
              onChange: r(gt)
            }, null, 8, ["config", "onChange"])
          ])
        ]),
        _: 1
      }, 8, ["visible", "aria-label"])) : $("", !0),
      st.value ? (l(), N(r(Pt), {
        key: 6,
        visible: !!st.value,
        modal: !0,
        "dismissable-mask": !0,
        pt: e,
        class: "kx-modal",
        header: "Delete automation",
        "aria-label": "Delete automation",
        "onUpdate:visible": _[9] || (_[9] = (b) => {
          b || (st.value = null);
        })
      }, {
        footer: O(() => [
          D(r(Z), {
            type: "button",
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            disabled: wt.value,
            onClick: _[8] || (_[8] = (b) => st.value = null)
          }, null, 8, ["disabled"]),
          D(r(Z), {
            type: "button",
            "data-testid": "automations-confirm-delete",
            severity: "danger",
            label: "Delete",
            loading: wt.value,
            disabled: wt.value,
            onClick: wn
          }, {
            icon: O(({ class: b }) => [
              D(r(j), {
                icon: "tabler:trash",
                class: V(b),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["loading", "disabled"])
        ]),
        default: O(() => [
          u("div", hs, [
            u("p", null, [
              _[15] || (_[15] = at(" Delete ", -1)),
              u("strong", null, C(r(d)(st.value)), 1),
              _[16] || (_[16] = at("? It will stop running and its setup will be removed. This can't be undone. ", -1))
            ]),
            Yt(st.value).length ? (l(), c("div", ys, [
              (l(!0), c(W, null, ot(Yt(st.value), (b) => (l(), c("label", {
                key: b.key,
                class: "kx-delopt"
              }, [
                ct(u("input", {
                  "onUpdate:modelValue": (q) => Rt.value[b.key] = q,
                  type: "checkbox"
                }, null, 8, ks), [
                  [Re, Rt.value[b.key]]
                ]),
                u("span", xs, [
                  u("span", _s, C(b.title || b.key), 1),
                  b.description ? (l(), c("span", ws, C(b.description), 1)) : $("", !0)
                ])
              ]))), 128))
            ])) : $("", !0)
          ])
        ]),
        _: 1
      }, 8, ["visible"])) : $("", !0)
    ]));
  }
}), Ms = {
  rootComponent: $s,
  plugins: [Un]
};
export {
  Ms as mountConfig
};
//# sourceMappingURL=lazy-mount-C4h7wnTi.js.map
