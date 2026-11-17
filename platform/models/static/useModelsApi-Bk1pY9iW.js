import { openBlock as h, createElementBlock as g, mergeProps as p, createElementVNode as L, renderSlot as k, resolveComponent as D, Fragment as Z, renderList as ve, createCommentVNode as P, createVNode as H, resolveDirective as Ye, createTextVNode as he, toDisplayString as K, normalizeClass as ee, createBlock as U, resolveDynamicComponent as Ce, withCtx as N, Transition as Je, normalizeProps as Qe, createSlots as Xe, withDirectives as $e, withModifiers as _e, defineComponent as ce, unref as de, ref as A, onMounted as et, watch as ke, onBeforeUnmount as tt, vShow as nt } from "vue";
import { a as se, B as Y, s as pe, f as te, z as Me, o as ue, c as Q, T as X, j as it, R as rt, g as ae, F as st, M as Le, k as ot, p as lt, b as R, Y as at, q as dt, t as ut, v as ct, D as pt, x as me, S as ft, O as ht, L as mt, d as vt, $ as gt, J as yt, w as W } from "./wc-runtime-CHL0PH8L.js";
import { h as bt, j as Ae } from "./ProviderProfileEditor.vue_vue_type_script_setup_true_lang-DiTfn-yc.js";
import { Icon as ze } from "@iconify/vue";
import { loadByTagName as It, api as M } from "@wippy-fe/proxy";
var Pe = {
  name: "BlankIcon",
  extends: se
};
function Ot(e) {
  return kt(e) || Ct(e) || St(e) || wt();
}
function wt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function St(e, t) {
  if (e) {
    if (typeof e == "string") return ge(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ge(e, t) : void 0;
  }
}
function Ct(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function kt(e) {
  if (Array.isArray(e)) return ge(e);
}
function ge(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Lt(e, t, n, r, s, i) {
  return h(), g("svg", p({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Ot(t[0] || (t[0] = [L("rect", {
    width: "1",
    height: "1",
    fill: "currentColor",
    "fill-opacity": "0"
  }, null, -1)])), 16);
}
Pe.render = Lt;
var Ee = {
  name: "CheckIcon",
  extends: se
};
function zt(e) {
  return Vt(e) || Ft(e) || Tt(e) || xt();
}
function xt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Tt(e, t) {
  if (e) {
    if (typeof e == "string") return ye(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ye(e, t) : void 0;
  }
}
function Ft(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Vt(e) {
  if (Array.isArray(e)) return ye(e);
}
function ye(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function $t(e, t, n, r, s, i) {
  return h(), g("svg", p({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), zt(t[0] || (t[0] = [L("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ee.render = $t;
var Be = {
  name: "ChevronDownIcon",
  extends: se
};
function Mt(e) {
  return Bt(e) || Et(e) || Pt(e) || At();
}
function At() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Pt(e, t) {
  if (e) {
    if (typeof e == "string") return be(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? be(e, t) : void 0;
  }
}
function Et(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Bt(e) {
  if (Array.isArray(e)) return be(e);
}
function be(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Dt(e, t, n, r, s, i) {
  return h(), g("svg", p({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Mt(t[0] || (t[0] = [L("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Be.render = Dt;
var De = {
  name: "SearchIcon",
  extends: se
};
function Kt(e) {
  return Ut(e) || jt(e) || Rt(e) || Ht();
}
function Ht() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Rt(e, t) {
  if (e) {
    if (typeof e == "string") return Ie(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ie(e, t) : void 0;
  }
}
function jt(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ut(e) {
  if (Array.isArray(e)) return Ie(e);
}
function Ie(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Gt(e, t, n, r, s, i) {
  return h(), g("svg", p({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Kt(t[0] || (t[0] = [L("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
De.render = Gt;
var Ke = {
  name: "TimesIcon",
  extends: se
};
function Nt(e) {
  return Yt(e) || Zt(e) || qt(e) || Wt();
}
function Wt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qt(e, t) {
  if (e) {
    if (typeof e == "string") return Oe(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Oe(e, t) : void 0;
  }
}
function Zt(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Yt(e) {
  if (Array.isArray(e)) return Oe(e);
}
function Oe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Jt(e, t, n, r, s, i) {
  return h(), g("svg", p({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Nt(t[0] || (t[0] = [L("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ke.render = Jt;
var Qt = `
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
`, Xt = {
  root: "p-iconfield"
}, _t = Y.extend({
  name: "iconfield",
  style: Qt,
  classes: Xt
}), en = {
  name: "BaseIconField",
  extends: pe,
  style: _t,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, He = {
  name: "IconField",
  extends: en,
  inheritAttrs: !1
};
function tn(e, t, n, r, s, i) {
  return h(), g("div", p({
    class: e.cx("root")
  }, e.ptmi("root")), [k(e.$slots, "default")], 16);
}
He.render = tn;
var nn = {
  root: "p-inputicon"
}, rn = Y.extend({
  name: "inputicon",
  classes: nn
}), sn = {
  name: "BaseInputIcon",
  extends: pe,
  style: rn,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, Re = {
  name: "InputIcon",
  extends: sn,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function on(e, t, n, r, s, i) {
  return h(), g("span", p({
    class: i.containerClass
  }, e.ptmi("root"), {
    "aria-hidden": "true"
  }), [k(e.$slots, "default")], 16);
}
Re.render = on;
var je = {
  name: "BaseInput",
  extends: bt,
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
}, ln = `
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
`, an = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": r.size === "small",
      "p-inputtext-lg p-inputfield-lg": r.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, dn = Y.extend({
  name: "inputtext",
  style: ln,
  classes: an
}), un = {
  name: "BaseInputText",
  extends: je,
  style: dn,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function ne(e) {
  "@babel/helpers - typeof";
  return ne = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ne(e);
}
function cn(e, t, n) {
  return (t = pn(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function pn(e) {
  var t = fn(e, "string");
  return ne(t) == "symbol" ? t : t + "";
}
function fn(e, t) {
  if (ne(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ne(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ue = {
  name: "InputText",
  extends: un,
  inheritAttrs: !1,
  methods: {
    onInput: function(t) {
      this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return p(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return te(cn({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, hn = ["value", "name", "disabled", "aria-invalid", "data-p"];
function mn(e, t, n, r, s, i) {
  return h(), g("input", p({
    type: "text",
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.$invalid || void 0,
    "data-p": i.dataP,
    onInput: t[0] || (t[0] = function() {
      return i.onInput && i.onInput.apply(i, arguments);
    })
  }, i.attrs), null, 16, hn);
}
Ue.render = mn;
var vn = `
    .p-virtualscroller-loader {
        background: dt('virtualscroller.loader.mask.background');
        color: dt('virtualscroller.loader.mask.color');
    }

    .p-virtualscroller-loading-icon {
        font-size: dt('virtualscroller.loader.icon.size');
        width: dt('virtualscroller.loader.icon.size');
        height: dt('virtualscroller.loader.icon.size');
    }
`, gn = `
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
`, xe = Y.extend({
  name: "virtualscroller",
  css: gn,
  style: vn
}), yn = {
  name: "BaseVirtualScroller",
  extends: pe,
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
  style: xe,
  provide: function() {
    return {
      $pcVirtualScroller: this,
      $parentInstance: this
    };
  },
  beforeMount: function() {
    var t;
    xe.loadCSS({
      nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
    });
  }
};
function ie(e) {
  "@babel/helpers - typeof";
  return ie = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ie(e);
}
function Te(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(s) {
      return Object.getOwnPropertyDescriptor(e, s).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function _(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Te(Object(n), !0).forEach(function(r) {
      Ge(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Te(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Ge(e, t, n) {
  return (t = bn(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function bn(e) {
  var t = In(e, "string");
  return ie(t) == "symbol" ? t : t + "";
}
function In(e, t) {
  if (ie(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ie(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ne = {
  name: "VirtualScroller",
  extends: yn,
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
      ue(this.element) && (this.setContentEl(this.content), this.init(), this.calculateAutoSize(), this.defaultWidth = Q(this.element), this.defaultHeight = X(this.element), this.defaultContentWidth = Q(this.content), this.defaultContentHeight = X(this.content), this.initialized = !0), this.element && this.bindResizeListener();
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
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto", s = this.isBoth(), i = this.isHorizontal(), o = s ? t.every(function(w) {
        return w > -1;
      }) : t > -1;
      if (o) {
        var l = this.first, u = this.element, a = u.scrollTop, d = a === void 0 ? 0 : a, m = u.scrollLeft, b = m === void 0 ? 0 : m, z = this.calculateNumItems(), O = z.numToleratedItems, S = this.getContentPosition(), v = this.itemSize, x = function() {
          var C = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, f = arguments.length > 1 ? arguments[1] : void 0;
          return C <= f ? 0 : C;
        }, T = function(C, f, c) {
          return C * f + c;
        }, F = function() {
          var C = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.scrollTo({
            left: C,
            top: f,
            behavior: r
          });
        }, I = s ? {
          rows: 0,
          cols: 0
        } : 0, E = !1, V = !1;
        s ? (I = {
          rows: x(t[0], O[0]),
          cols: x(t[1], O[1])
        }, F(T(I.cols, v[1], S.left), T(I.rows, v[0], S.top)), V = this.lastScrollPos.top !== d || this.lastScrollPos.left !== b, E = I.rows !== l.rows || I.cols !== l.cols) : (I = x(t, O), i ? F(T(I, v, S.left), d) : F(b, T(I, v, S.top)), V = this.lastScrollPos !== (i ? b : d), E = I !== l), this.isRangeChanged = E, V && (this.first = I);
      }
    },
    scrollInView: function(t, n) {
      var r = this, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
      if (n) {
        var i = this.isBoth(), o = this.isHorizontal(), l = i ? t.every(function(v) {
          return v > -1;
        }) : t > -1;
        if (l) {
          var u = this.getRenderedRange(), a = u.first, d = u.viewport, m = function() {
            var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, T = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return r.scrollTo({
              left: x,
              top: T,
              behavior: s
            });
          }, b = n === "to-start", z = n === "to-end";
          if (b) {
            if (i)
              d.first.rows - a.rows > t[0] ? m(d.first.cols * this.itemSize[1], (d.first.rows - 1) * this.itemSize[0]) : d.first.cols - a.cols > t[1] && m((d.first.cols - 1) * this.itemSize[1], d.first.rows * this.itemSize[0]);
            else if (d.first - a > t) {
              var O = (d.first - 1) * this.itemSize;
              o ? m(O, 0) : m(0, O);
            }
          } else if (z) {
            if (i)
              d.last.rows - a.rows <= t[0] + 1 ? m(d.first.cols * this.itemSize[1], (d.first.rows + 1) * this.itemSize[0]) : d.last.cols - a.cols <= t[1] + 1 && m((d.first.cols + 1) * this.itemSize[1], d.first.rows * this.itemSize[0]);
            else if (d.last - a <= t + 1) {
              var S = (d.first + 1) * this.itemSize;
              o ? m(S, 0) : m(0, S);
            }
          }
        }
      } else
        this.scrollToIndex(t, s);
    },
    getRenderedRange: function() {
      var t = function(m, b) {
        return Math.floor(m / (b || m));
      }, n = this.first, r = 0;
      if (this.element) {
        var s = this.isBoth(), i = this.isHorizontal(), o = this.element, l = o.scrollTop, u = o.scrollLeft;
        if (s)
          n = {
            rows: t(l, this.itemSize[0]),
            cols: t(u, this.itemSize[1])
          }, r = {
            rows: n.rows + this.numItemsInViewport.rows,
            cols: n.cols + this.numItemsInViewport.cols
          };
        else {
          var a = i ? u : l;
          n = t(a, this.itemSize), r = n + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: n,
          last: r
        }
      };
    },
    calculateNumItems: function() {
      var t = this.isBoth(), n = this.isHorizontal(), r = this.itemSize, s = this.getContentPosition(), i = this.element ? this.element.offsetWidth - s.left : 0, o = this.element ? this.element.offsetHeight - s.top : 0, l = function(b, z) {
        return Math.ceil(b / (z || b));
      }, u = function(b) {
        return Math.ceil(b / 2);
      }, a = t ? {
        rows: l(o, r[0]),
        cols: l(i, r[1])
      } : l(n ? i : o, r), d = this.d_numToleratedItems || (t ? [u(a.rows), u(a.cols)] : u(a));
      return {
        numItemsInViewport: a,
        numToleratedItems: d
      };
    },
    calculateOptions: function() {
      var t = this, n = this.isBoth(), r = this.first, s = this.calculateNumItems(), i = s.numItemsInViewport, o = s.numToleratedItems, l = function(d, m, b) {
        var z = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        return t.getLast(d + m + (d < b ? 2 : 3) * b, z);
      }, u = n ? {
        rows: l(r.rows, i.rows, o[0]),
        cols: l(r.cols, i.cols, o[1], !0)
      } : l(r, i, o);
      this.last = u, this.numItemsInViewport = i, this.d_numToleratedItems = o, this.$emit("update:numToleratedItems", this.d_numToleratedItems), this.showLoader && (this.loaderArr = n ? Array.from({
        length: i.rows
      }).map(function() {
        return Array.from({
          length: i.cols
        });
      }) : Array.from({
        length: i
      })), this.lazy && Promise.resolve().then(function() {
        var a;
        t.lazyLoadState = {
          first: t.step ? n ? {
            rows: 0,
            cols: r.cols
          } : 0 : r,
          last: Math.min(t.step ? t.step : u, ((a = t.items) === null || a === void 0 ? void 0 : a.length) || 0)
        }, t.$emit("lazy-load", t.lazyLoadState);
      });
    },
    calculateAutoSize: function() {
      var t = this;
      this.autoSize && !this.d_loading && Promise.resolve().then(function() {
        if (t.content) {
          var n = t.isBoth(), r = t.isHorizontal(), s = t.isVertical();
          t.content.style.minHeight = t.content.style.minWidth = "auto", t.content.style.position = "relative", t.element.style.contain = "none";
          var i = [Q(t.element), X(t.element)], o = i[0], l = i[1];
          (n || r) && (t.element.style.width = o < t.defaultWidth ? o + "px" : t.scrollWidth || t.defaultWidth + "px"), (n || s) && (t.element.style.height = l < t.defaultHeight ? l + "px" : t.scrollHeight || t.defaultHeight + "px"), t.content.style.minHeight = t.content.style.minWidth = "", t.content.style.position = "", t.element.style.contain = "";
        }
      });
    },
    getLast: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, s = arguments.length > 1 ? arguments[1] : void 0;
      return this.items ? Math.min(s ? ((t = this.columns || this.items[0]) === null || t === void 0 ? void 0 : t.length) || 0 : ((n = this.items) === null || n === void 0 ? void 0 : n.length) || 0, r) : 0;
    },
    getContentPosition: function() {
      if (this.content) {
        var t = getComputedStyle(this.content), n = parseFloat(t.paddingLeft) + Math.max(parseFloat(t.left) || 0, 0), r = parseFloat(t.paddingRight) + Math.max(parseFloat(t.right) || 0, 0), s = parseFloat(t.paddingTop) + Math.max(parseFloat(t.top) || 0, 0), i = parseFloat(t.paddingBottom) + Math.max(parseFloat(t.bottom) || 0, 0);
        return {
          left: n,
          right: r,
          top: s,
          bottom: i,
          x: n + r,
          y: s + i
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
        var n = this.isBoth(), r = this.isHorizontal(), s = this.element.parentElement, i = this.scrollWidth || "".concat(this.element.offsetWidth || s.offsetWidth, "px"), o = this.scrollHeight || "".concat(this.element.offsetHeight || s.offsetHeight, "px"), l = function(a, d) {
          return t.element.style[a] = d;
        };
        n || r ? (l("height", o), l("width", i)) : l("height", o);
      }
    },
    setSpacerSize: function() {
      var t = this, n = this.items;
      if (n) {
        var r = this.isBoth(), s = this.isHorizontal(), i = this.getContentPosition(), o = function(u, a, d) {
          var m = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          return t.spacerStyle = _(_({}, t.spacerStyle), Ge({}, "".concat(u), (a || []).length * d + m + "px"));
        };
        r ? (o("height", n, this.itemSize[0], i.y), o("width", this.columns || n[1], this.itemSize[1], i.x)) : s ? o("width", this.columns || n, this.itemSize, i.x) : o("height", n, this.itemSize, i.y);
      }
    },
    setContentPosition: function(t) {
      var n = this;
      if (this.content && !this.appendOnly) {
        var r = this.isBoth(), s = this.isHorizontal(), i = t ? t.first : this.first, o = function(d, m) {
          return d * m;
        }, l = function() {
          var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.contentStyle = _(_({}, n.contentStyle), {
            transform: "translate3d(".concat(d, "px, ").concat(m, "px, 0)")
          });
        };
        if (r)
          l(o(i.cols, this.itemSize[1]), o(i.rows, this.itemSize[0]));
        else {
          var u = o(i, this.itemSize);
          s ? l(u, 0) : l(0, u);
        }
      }
    },
    onScrollPositionChange: function(t) {
      var n = this, r = t.target, s = this.isBoth(), i = this.isHorizontal(), o = this.getContentPosition(), l = function(y, $) {
        return y ? y > $ ? y - $ : y : 0;
      }, u = function(y, $) {
        return Math.floor(y / ($ || y));
      }, a = function(y, $, J, oe, B, j) {
        return y <= B ? B : j ? J - oe - B : $ + B - 1;
      }, d = function(y, $, J, oe, B, j, le, Ze) {
        if (y <= j) return 0;
        var fe = Math.max(0, le ? y < $ ? J : y - j : y > $ ? J : y - 2 * j), Se = n.getLast(fe, Ze);
        return fe > Se ? Se - B : fe;
      }, m = function(y, $, J, oe, B, j) {
        var le = $ + oe + 2 * B;
        return y >= B && (le += B + 1), n.getLast(le, j);
      }, b = l(r.scrollTop, o.top), z = l(r.scrollLeft, o.left), O = s ? {
        rows: 0,
        cols: 0
      } : 0, S = this.last, v = !1, x = this.lastScrollPos;
      if (s) {
        var T = this.lastScrollPos.top <= b, F = this.lastScrollPos.left <= z;
        if (!this.appendOnly || this.appendOnly && (T || F)) {
          var I = {
            rows: u(b, this.itemSize[0]),
            cols: u(z, this.itemSize[1])
          }, E = {
            rows: a(I.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], T),
            cols: a(I.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], F)
          };
          O = {
            rows: d(I.rows, E.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], T),
            cols: d(I.cols, E.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], F, !0)
          }, S = {
            rows: m(I.rows, O.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: m(I.cols, O.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], !0)
          }, v = O.rows !== this.first.rows || S.rows !== this.last.rows || O.cols !== this.first.cols || S.cols !== this.last.cols || this.isRangeChanged, x = {
            top: b,
            left: z
          };
        }
      } else {
        var V = i ? z : b, w = this.lastScrollPos <= V;
        if (!this.appendOnly || this.appendOnly && w) {
          var C = u(V, this.itemSize), f = a(C, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, w);
          O = d(C, f, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, w), S = m(C, O, this.last, this.numItemsInViewport, this.d_numToleratedItems), v = O !== this.first || S !== this.last || this.isRangeChanged, x = V;
        }
      }
      return {
        first: O,
        last: S,
        isRangeChanged: v,
        scrollPos: x
      };
    },
    onScrollChange: function(t) {
      var n = this.onScrollPositionChange(t), r = n.first, s = n.last, i = n.isRangeChanged, o = n.scrollPos;
      if (i) {
        var l = {
          first: r,
          last: s
        };
        if (this.setContentPosition(l), this.first = r, this.last = s, this.lastScrollPos = o, this.$emit("scroll-index-change", l), this.lazy && this.isPageChanged(r)) {
          var u, a, d = {
            first: this.step ? Math.min(this.getPageByFirst(r) * this.step, (((u = this.items) === null || u === void 0 ? void 0 : u.length) || 0) - this.step) : r,
            last: Math.min(this.step ? (this.getPageByFirst(r) + 1) * this.step : s, ((a = this.items) === null || a === void 0 ? void 0 : a.length) || 0)
          }, m = this.lazyLoadState.first !== d.first || this.lazyLoadState.last !== d.last;
          m && this.$emit("lazy-load", d), this.lazyLoadState = d;
        }
      }
    },
    onScroll: function(t) {
      var n = this;
      if (this.$emit("scroll", t), this.delay) {
        if (this.scrollTimeout && clearTimeout(this.scrollTimeout), this.isPageChanged()) {
          if (!this.d_loading && this.showLoader) {
            var r = this.onScrollPositionChange(t), s = r.isRangeChanged, i = s || (this.step ? this.isPageChanged() : !1);
            i && (this.d_loading = !0);
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
        if (ue(t.element)) {
          var n = t.isBoth(), r = t.isVertical(), s = t.isHorizontal(), i = [Q(t.element), X(t.element)], o = i[0], l = i[1], u = o !== t.defaultWidth, a = l !== t.defaultHeight, d = n ? u || a : s ? u : r ? a : !1;
          d && (t.d_numToleratedItems = t.numToleratedItems, t.defaultWidth = o, t.defaultHeight = l, t.defaultContentWidth = Q(t.content), t.defaultContentHeight = X(t.content), t.init());
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
      var n = (this.items || []).length, r = this.isBoth() ? this.first.rows + t : this.first + t;
      return {
        index: r,
        count: n,
        first: r === 0,
        last: r === n - 1,
        even: r % 2 === 0,
        odd: r % 2 !== 0
      };
    },
    getLoaderOptions: function(t, n) {
      var r = this.loaderArr.length;
      return _({
        index: t,
        count: r,
        first: t === 0,
        last: t === r - 1,
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
      this.content = t || this.content || Me(this.element, '[data-pc-section="content"]');
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
    SpinnerIcon: Ae
  }
}, On = ["tabindex"];
function wn(e, t, n, r, s, i) {
  var o = D("SpinnerIcon");
  return e.disabled ? (h(), g(Z, {
    key: 1
  }, [k(e.$slots, "default"), k(e.$slots, "content", {
    items: e.items,
    rows: e.items,
    columns: i.loadedColumns
  })], 64)) : (h(), g("div", p({
    key: 0,
    ref: i.elementRef,
    class: i.containerClass,
    tabindex: e.tabindex,
    style: e.style,
    onScroll: t[0] || (t[0] = function() {
      return i.onScroll && i.onScroll.apply(i, arguments);
    })
  }, e.ptmi("root")), [k(e.$slots, "content", {
    styleClass: i.contentClass,
    items: i.loadedItems,
    getItemOptions: i.getOptions,
    loading: s.d_loading,
    getLoaderOptions: i.getLoaderOptions,
    itemSize: e.itemSize,
    rows: i.loadedRows,
    columns: i.loadedColumns,
    contentRef: i.contentRef,
    spacerStyle: s.spacerStyle,
    contentStyle: s.contentStyle,
    vertical: i.isVertical(),
    horizontal: i.isHorizontal(),
    both: i.isBoth()
  }, function() {
    return [L("div", p({
      ref: i.contentRef,
      class: i.contentClass,
      style: s.contentStyle
    }, e.ptm("content")), [(h(!0), g(Z, null, ve(i.loadedItems, function(l, u) {
      return k(e.$slots, "item", {
        key: u,
        item: l,
        options: i.getOptions(u)
      });
    }), 128))], 16)];
  }), e.showSpacer ? (h(), g("div", p({
    key: 0,
    class: "p-virtualscroller-spacer",
    style: s.spacerStyle
  }, e.ptm("spacer")), null, 16)) : P("", !0), !e.loaderDisabled && e.showLoader && s.d_loading ? (h(), g("div", p({
    key: 1,
    class: i.loaderClass
  }, e.ptm("loader")), [e.$slots && e.$slots.loader ? (h(!0), g(Z, {
    key: 0
  }, ve(s.loaderArr, function(l, u) {
    return k(e.$slots, "loader", {
      key: u,
      options: i.getLoaderOptions(u, i.isBoth() && {
        numCols: e.d_numItemsInViewport.cols
      })
    });
  }), 128)) : P("", !0), k(e.$slots, "loadingicon", {}, function() {
    return [H(o, p({
      spin: "",
      class: "p-virtualscroller-loading-icon"
    }, e.ptm("loadingIcon")), null, 16)];
  })], 16)) : P("", !0)], 16, On));
}
Ne.render = wn;
var Sn = `
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
`, Cn = {
  root: function(t) {
    var n = t.instance, r = t.props, s = t.state;
    return ["p-select p-component p-inputwrapper", {
      "p-disabled": r.disabled,
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-focus": s.focused,
      "p-inputwrapper-filled": n.$filled,
      "p-inputwrapper-focus": s.focused || s.overlayVisible,
      "p-select-open": s.overlayVisible,
      "p-select-fluid": n.$fluid,
      "p-select-sm p-inputfield-sm": r.size === "small",
      "p-select-lg p-inputfield-lg": r.size === "large"
    }];
  },
  label: function(t) {
    var n, r = t.instance, s = t.props;
    return ["p-select-label", {
      "p-placeholder": !s.editable && r.label === s.placeholder,
      "p-select-label-empty": !s.editable && !r.$slots.value && (r.label === "p-emptylabel" || ((n = r.label) === null || n === void 0 ? void 0 : n.length) === 0)
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
    var n = t.instance, r = t.props, s = t.state, i = t.option, o = t.focusedOption;
    return ["p-select-option", {
      "p-select-option-selected": n.isSelected(i) && r.highlightOnSelect,
      "p-focus": s.focusedOptionIndex === o,
      "p-disabled": n.isOptionDisabled(i)
    }];
  },
  optionLabel: "p-select-option-label",
  optionCheckIcon: "p-select-option-check-icon",
  optionBlankIcon: "p-select-option-blank-icon",
  emptyMessage: "p-select-empty-message"
}, kn = Y.extend({
  name: "select",
  style: Sn,
  classes: Cn
}), Ln = {
  name: "BaseSelect",
  extends: je,
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
  style: kn,
  provide: function() {
    return {
      $pcSelect: this,
      $parentInstance: this
    };
  }
};
function re(e) {
  "@babel/helpers - typeof";
  return re = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, re(e);
}
function zn(e) {
  return Vn(e) || Fn(e) || Tn(e) || xn();
}
function xn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Tn(e, t) {
  if (e) {
    if (typeof e == "string") return we(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? we(e, t) : void 0;
  }
}
function Fn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Vn(e) {
  if (Array.isArray(e)) return we(e);
}
function we(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Fe(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(s) {
      return Object.getOwnPropertyDescriptor(e, s).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Ve(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fe(Object(n), !0).forEach(function(r) {
      G(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Fe(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function G(e, t, n) {
  return (t = $n(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function $n(e) {
  var t = Mn(e, "string");
  return re(t) == "symbol" ? t : t + "";
}
function Mn(e, t) {
  if (re(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (re(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var We = {
  name: "Select",
  extends: Ln,
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
    this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindLabelClickListener(), this.unbindMatchMediaOrientationListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.overlay && (me.clear(this.overlay), this.overlay = null);
  },
  methods: {
    getOptionIndex: function(t, n) {
      return this.virtualScrollerDisabled ? t : n && n(t).index;
    },
    getOptionLabel: function(t) {
      return this.optionLabel ? W(t, this.optionLabel) : t;
    },
    getOptionValue: function(t) {
      return this.optionValue ? W(t, this.optionValue) : t;
    },
    getOptionRenderKey: function(t, n) {
      return (this.dataKey ? W(t, this.dataKey) : this.getOptionLabel(t)) + "_" + n;
    },
    getPTItemOptions: function(t, n, r, s) {
      return this.ptm(s, {
        context: {
          option: t,
          index: r,
          selected: this.isSelected(t),
          focused: this.focusedOptionIndex === this.getOptionIndex(r, n),
          disabled: this.isOptionDisabled(t)
        }
      });
    },
    isOptionDisabled: function(t) {
      return this.optionDisabled ? W(t, this.optionDisabled) : !1;
    },
    isOptionGroup: function(t) {
      return this.optionGroupLabel && t.optionGroup && t.group;
    },
    getOptionGroupLabel: function(t) {
      return W(t, this.optionGroupLabel);
    },
    getOptionGroupChildren: function(t) {
      return W(t, this.optionGroupChildren);
    },
    getAriaPosInset: function(t) {
      var n = this;
      return (this.optionGroupLabel ? t - this.visibleOptions.slice(0, t).filter(function(r) {
        return n.isOptionGroup(r);
      }).length : t) + 1;
    },
    show: function(t) {
      this.$emit("before-show"), this.overlayVisible = !0, this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), t && R(this.$refs.focusInput);
    },
    hide: function(t) {
      var n = this, r = function() {
        n.$emit("before-hide"), n.overlayVisible = !1, n.clicked = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.resetFilterOnHide && (n.filterValue = null), t && R(n.$refs.focusInput);
      };
      setTimeout(function() {
        r();
      }, 0);
    },
    onFocus: function(t) {
      this.disabled || (this.focused = !0, this.overlayVisible && (this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), this.scrollInView(this.focusedOptionIndex)), this.$emit("focus", t));
    },
    onBlur: function(t) {
      var n = this;
      setTimeout(function() {
        var r, s;
        n.focused = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.$emit("blur", t), (r = (s = n.formField).onBlur) === null || r === void 0 || r.call(s, t);
      }, 100);
    },
    onKeyDown: function(t) {
      var n = this;
      if (this.disabled) {
        t.preventDefault();
        return;
      }
      if (gt())
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
      var r = t.metaKey || t.ctrlKey;
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
          !r && yt(t.key) && (!this.overlayVisible && this.show(), !this.editable && this.searchOptions(t, t.key), this.filter && this.$nextTick(function() {
            n.$refs.filterInput && R(n.$refs.filterInput.$el);
          }));
          break;
      }
      this.clicked = !1;
    },
    onEditableInput: function(t) {
      var n = t.target.value;
      this.searchValue = "";
      var r = this.searchOptions(t, n);
      !r && (this.focusedOptionIndex = -1), this.updateModel(t, n), !this.overlayVisible && ae(n) && this.show();
    },
    onContainerClick: function(t) {
      this.disabled || this.loading || t.target.tagName === "INPUT" || t.target.getAttribute("data-pc-section") === "clearicon" || t.target.closest('[data-pc-section="clearicon"]') || ((!this.overlay || !this.overlay.contains(t.target)) && (this.overlayVisible ? this.hide(!0) : this.show(!0)), this.clicked = !0);
    },
    onClearClick: function(t) {
      this.updateModel(t, null), this.resetFilterOnClear && (this.filterValue = null);
    },
    onFirstHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? vt(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      R(n);
    },
    onLastHiddenFocus: function(t) {
      var n = t.relatedTarget === this.$refs.focusInput ? mt(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      R(n);
    },
    onOptionSelect: function(t, n) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
      if (this.overlayVisible) {
        var s = this.getOptionValue(n);
        this.updateModel(t, s), r && this.hide(!0);
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
      ht.emit("overlay-click", {
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
        var r = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(t, r), !this.overlayVisible && this.show(), t.preventDefault();
      }
    },
    onArrowLeftKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var r = t.currentTarget;
        t.shiftKey ? r.setSelectionRange(0, t.target.selectionStart) : (r.setSelectionRange(0, 0), this.focusedOptionIndex = -1);
      } else
        this.changeFocusedOptionIndex(t, this.findFirstOptionIndex()), !this.overlayVisible && this.show();
      t.preventDefault();
    },
    onEndKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var r = t.currentTarget;
        if (t.shiftKey)
          r.setSelectionRange(t.target.selectionStart, r.value.length);
        else {
          var s = r.value.length;
          r.setSelectionRange(s, s), this.focusedOptionIndex = -1;
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
      n || (this.overlayVisible && this.hasFocusableElements() ? (R(this.$refs.firstHiddenFocusableElementOnOverlay), t.preventDefault()) : (this.focusedOptionIndex !== -1 && this.onOptionSelect(t, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(this.filter)));
    },
    onBackspaceKey: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && !this.overlayVisible && this.show();
    },
    onOverlayEnter: function(t) {
      var n = this;
      me.set("overlay", t, this.$primevue.config.zIndex.overlay), ft(t, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.scrollInView(), this.$attrSelector && t.setAttribute(this.$attrSelector, ""), setTimeout(function() {
        n.autoFilterFocus && n.filter && R(n.$refs.filterInput.$el), n.autoUpdateModel();
      }, 1);
    },
    onOverlayAfterEnter: function() {
      this.bindOutsideClickListener(), this.bindScrollListener(), this.bindResizeListener(), this.$emit("show");
    },
    onOverlayLeave: function(t) {
      var n = this;
      t.style.pointerEvents = "none", this.unbindOutsideClickListener(), this.unbindScrollListener(), this.unbindResizeListener(), this.autoFilterFocus && this.filter && !this.editable && this.$nextTick(function() {
        n.$refs.filterInput && R(n.$refs.filterInput.$el);
      }), this.$emit("hide"), this.overlay = null;
    },
    onOverlayAfterLeave: function(t) {
      me.clear(t);
    },
    alignOverlay: function() {
      this.appendTo === "self" ? ut(this.overlay, this.$el) : this.overlay && (this.overlay.style.minWidth = ct(this.$el) + "px", pt(this.overlay, this.$el));
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var r = n.composedPath();
        t.overlayVisible && t.overlay && !r.includes(t.$el) && !r.includes(t.overlay) && t.hide();
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var t = this;
      this.scrollHandler || (this.scrollHandler = new dt(this.$refs.container, function() {
        t.overlayVisible && t.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = function() {
        t.overlayVisible && !at() && t.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    bindLabelClickListener: function() {
      var t = this;
      if (!this.editable && !this.labelClickListener) {
        var n = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        n && ue(n) && (this.labelClickListener = function() {
          R(t.$refs.focusInput);
        }, n.addEventListener("click", this.labelClickListener));
      }
    },
    unbindLabelClickListener: function() {
      if (this.labelClickListener) {
        var t = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        t && ue(t) && t.removeEventListener("click", this.labelClickListener);
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
      return lt(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
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
      return ae(t) && !(this.isOptionDisabled(t) || this.isOptionGroup(t));
    },
    isValidSelectedOption: function(t) {
      return this.isValidOption(t) && this.isSelected(t);
    },
    isSelected: function(t) {
      return ot(this.d_value, this.getOptionValue(t), this.equalityKey);
    },
    findFirstOptionIndex: function() {
      var t = this;
      return this.visibleOptions.findIndex(function(n) {
        return t.isValidOption(n);
      });
    },
    findLastOptionIndex: function() {
      var t = this;
      return Le(this.visibleOptions, function(n) {
        return t.isValidOption(n);
      });
    },
    findNextOptionIndex: function(t) {
      var n = this, r = t < this.visibleOptions.length - 1 ? this.visibleOptions.slice(t + 1).findIndex(function(s) {
        return n.isValidOption(s);
      }) : -1;
      return r > -1 ? r + t + 1 : t;
    },
    findPrevOptionIndex: function(t) {
      var n = this, r = t > 0 ? Le(this.visibleOptions.slice(0, t), function(s) {
        return n.isValidOption(s);
      }) : -1;
      return r > -1 ? r : t;
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
      var r = this;
      this.searchValue = (this.searchValue || "") + n;
      var s = -1, i = !1;
      return ae(this.searchValue) && (s = this.visibleOptions.findIndex(function(o) {
        return r.isOptionExactMatched(o);
      }), s === -1 && (s = this.visibleOptions.findIndex(function(o) {
        return r.isOptionStartsWith(o);
      })), s !== -1 && (i = !0), s === -1 && this.focusedOptionIndex === -1 && (s = this.findFirstFocusedOptionIndex()), s !== -1 && this.changeFocusedOptionIndex(t, s)), this.searchTimeout && clearTimeout(this.searchTimeout), this.searchTimeout = setTimeout(function() {
        r.searchValue = "", r.searchTimeout = null;
      }, 500), i;
    },
    changeFocusedOptionIndex: function(t, n) {
      this.focusedOptionIndex !== n && (this.focusedOptionIndex = n, this.scrollInView(), this.selectOnFocus && this.onOptionSelect(t, this.visibleOptions[n], !1));
    },
    scrollInView: function() {
      var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var r = n !== -1 ? "".concat(t.$id, "_").concat(n) : t.focusedOptionId, s = Me(t.list, 'li[id="'.concat(r, '"]'));
        s ? s.scrollIntoView && s.scrollIntoView({
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
      return (t || []).reduce(function(r, s, i) {
        r.push({
          optionGroup: s,
          group: !0,
          index: i
        });
        var o = n.getOptionGroupChildren(s);
        return o && o.forEach(function(l) {
          return r.push(l);
        }), r;
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
        var r = st.filter(n, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          var s = this.options || [], i = [];
          return s.forEach(function(o) {
            var l = t.getOptionGroupChildren(o), u = l.filter(function(a) {
              return r.includes(a);
            });
            u.length > 0 && i.push(Ve(Ve({}, o), {}, G({}, typeof t.optionGroupChildren == "string" ? t.optionGroupChildren : "items", zn(u))));
          }), this.flatOptions(i);
        }
        return r;
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
      return ae(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
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
      return te(G({
        invalid: this.$invalid,
        disabled: this.disabled,
        focus: this.focused,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    },
    labelDataP: function() {
      return te(G(G({
        placeholder: !this.editable && this.label === this.placeholder,
        clearable: this.showClear,
        disabled: this.disabled,
        editable: this.editable
      }, this.size, this.size), "empty", !this.editable && !this.$slots.value && (this.label === "p-emptylabel" || this.label.length === 0)));
    },
    dropdownIconDataP: function() {
      return te(G({}, this.size, this.size));
    },
    overlayDataP: function() {
      return te(G({}, "portal-" + this.appendTo, "portal-" + this.appendTo));
    }
  },
  directives: {
    ripple: rt
  },
  components: {
    InputText: Ue,
    VirtualScroller: Ne,
    Portal: it,
    InputIcon: Re,
    IconField: He,
    TimesIcon: Ke,
    ChevronDownIcon: Be,
    SpinnerIcon: Ae,
    SearchIcon: De,
    CheckIcon: Ee,
    BlankIcon: Pe
  }
}, An = ["id", "data-p"], Pn = ["name", "id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "data-p"], En = ["name", "id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "aria-disabled", "data-p"], Bn = ["data-p"], Dn = ["id"], Kn = ["id"], Hn = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onMousedown", "onMousemove", "data-p-selected", "data-p-focused", "data-p-disabled"];
function Rn(e, t, n, r, s, i) {
  var o = D("SpinnerIcon"), l = D("InputText"), u = D("SearchIcon"), a = D("InputIcon"), d = D("IconField"), m = D("CheckIcon"), b = D("BlankIcon"), z = D("VirtualScroller"), O = D("Portal"), S = Ye("ripple");
  return h(), g("div", p({
    ref: "container",
    id: e.$id,
    class: e.cx("root"),
    onClick: t[12] || (t[12] = function() {
      return i.onContainerClick && i.onContainerClick.apply(i, arguments);
    }),
    "data-p": i.containerDataP
  }, e.ptmi("root")), [e.editable ? (h(), g("input", p({
    key: 0,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    type: "text",
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    value: i.editableInputValue,
    placeholder: e.placeholder,
    tabindex: e.disabled ? -1 : e.tabindex,
    disabled: e.disabled,
    autocomplete: "off",
    role: "combobox",
    "aria-label": e.ariaLabel,
    "aria-labelledby": e.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": s.overlayVisible,
    "aria-controls": s.overlayVisible ? e.$id + "_list" : void 0,
    "aria-activedescendant": s.focused ? i.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    onFocus: t[0] || (t[0] = function() {
      return i.onFocus && i.onFocus.apply(i, arguments);
    }),
    onBlur: t[1] || (t[1] = function() {
      return i.onBlur && i.onBlur.apply(i, arguments);
    }),
    onKeydown: t[2] || (t[2] = function() {
      return i.onKeyDown && i.onKeyDown.apply(i, arguments);
    }),
    onInput: t[3] || (t[3] = function() {
      return i.onEditableInput && i.onEditableInput.apply(i, arguments);
    }),
    "data-p": i.labelDataP
  }, e.ptm("label")), null, 16, Pn)) : (h(), g("span", p({
    key: 1,
    ref: "focusInput",
    name: e.name,
    id: e.labelId || e.inputId,
    class: [e.cx("label"), e.inputClass, e.labelClass],
    style: [e.inputStyle, e.labelStyle],
    tabindex: e.disabled ? -1 : e.tabindex,
    role: "combobox",
    "aria-label": e.ariaLabel || (i.label === "p-emptylabel" ? void 0 : i.label),
    "aria-labelledby": e.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": s.overlayVisible,
    "aria-controls": e.$id + "_list",
    "aria-activedescendant": s.focused ? i.focusedOptionId : void 0,
    "aria-invalid": e.invalid || void 0,
    "aria-disabled": e.disabled,
    onFocus: t[4] || (t[4] = function() {
      return i.onFocus && i.onFocus.apply(i, arguments);
    }),
    onBlur: t[5] || (t[5] = function() {
      return i.onBlur && i.onBlur.apply(i, arguments);
    }),
    onKeydown: t[6] || (t[6] = function() {
      return i.onKeyDown && i.onKeyDown.apply(i, arguments);
    }),
    "data-p": i.labelDataP
  }, e.ptm("label")), [k(e.$slots, "value", {
    value: e.d_value,
    placeholder: e.placeholder
  }, function() {
    var v;
    return [he(K(i.label === "p-emptylabel" ? " " : (v = i.label) !== null && v !== void 0 ? v : "empty"), 1)];
  })], 16, En)), i.isClearIconVisible ? k(e.$slots, "clearicon", {
    key: 2,
    class: ee(e.cx("clearIcon")),
    clearCallback: i.onClearClick
  }, function() {
    return [(h(), U(Ce(e.clearIcon ? "i" : "TimesIcon"), p({
      ref: "clearIcon",
      class: [e.cx("clearIcon"), e.clearIcon],
      onClick: i.onClearClick
    }, e.ptm("clearIcon"), {
      "data-pc-section": "clearicon"
    }), null, 16, ["class", "onClick"]))];
  }) : P("", !0), L("div", p({
    class: e.cx("dropdown")
  }, e.ptm("dropdown")), [e.loading ? k(e.$slots, "loadingicon", {
    key: 0,
    class: ee(e.cx("loadingIcon"))
  }, function() {
    return [e.loadingIcon ? (h(), g("span", p({
      key: 0,
      class: [e.cx("loadingIcon"), "pi-spin", e.loadingIcon],
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16)) : (h(), U(o, p({
      key: 1,
      class: e.cx("loadingIcon"),
      spin: "",
      "aria-hidden": "true"
    }, e.ptm("loadingIcon")), null, 16, ["class"]))];
  }) : k(e.$slots, "dropdownicon", {
    key: 1,
    class: ee(e.cx("dropdownIcon"))
  }, function() {
    return [(h(), U(Ce(e.dropdownIcon ? "span" : "ChevronDownIcon"), p({
      class: [e.cx("dropdownIcon"), e.dropdownIcon],
      "aria-hidden": "true",
      "data-p": i.dropdownIconDataP
    }, e.ptm("dropdownIcon")), null, 16, ["class", "data-p"]))];
  })], 16), H(O, {
    appendTo: e.appendTo
  }, {
    default: N(function() {
      return [H(Je, p({
        name: "p-anchored-overlay",
        onEnter: i.onOverlayEnter,
        onAfterEnter: i.onOverlayAfterEnter,
        onLeave: i.onOverlayLeave,
        onAfterLeave: i.onOverlayAfterLeave
      }, e.ptm("transition")), {
        default: N(function() {
          return [s.overlayVisible ? (h(), g("div", p({
            key: 0,
            ref: i.overlayRef,
            class: [e.cx("overlay"), e.panelClass, e.overlayClass],
            style: [e.panelStyle, e.overlayStyle],
            onClick: t[10] || (t[10] = function() {
              return i.onOverlayClick && i.onOverlayClick.apply(i, arguments);
            }),
            onKeydown: t[11] || (t[11] = function() {
              return i.onOverlayKeyDown && i.onOverlayKeyDown.apply(i, arguments);
            }),
            "data-p": i.overlayDataP
          }, e.ptm("overlay")), [L("span", p({
            ref: "firstHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[7] || (t[7] = function() {
              return i.onFirstHiddenFocus && i.onFirstHiddenFocus.apply(i, arguments);
            })
          }, e.ptm("hiddenFirstFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16), k(e.$slots, "header", {
            value: e.d_value,
            options: i.visibleOptions
          }), e.filter ? (h(), g("div", p({
            key: 0,
            class: e.cx("header")
          }, e.ptm("header")), [H(d, {
            unstyled: e.unstyled,
            pt: e.ptm("pcFilterContainer")
          }, {
            default: N(function() {
              return [H(l, {
                ref: "filterInput",
                type: "text",
                value: s.filterValue,
                onVnodeMounted: i.onFilterUpdated,
                onVnodeUpdated: i.onFilterUpdated,
                class: ee(e.cx("pcFilter")),
                placeholder: e.filterPlaceholder,
                variant: e.variant,
                unstyled: e.unstyled,
                role: "searchbox",
                autocomplete: "off",
                "aria-owns": e.$id + "_list",
                "aria-activedescendant": i.focusedOptionId,
                onKeydown: i.onFilterKeyDown,
                onBlur: i.onFilterBlur,
                onInput: i.onFilterChange,
                pt: e.ptm("pcFilter"),
                formControl: {
                  novalidate: !0
                }
              }, null, 8, ["value", "onVnodeMounted", "onVnodeUpdated", "class", "placeholder", "variant", "unstyled", "aria-owns", "aria-activedescendant", "onKeydown", "onBlur", "onInput", "pt"]), H(a, {
                unstyled: e.unstyled,
                pt: e.ptm("pcFilterIconContainer")
              }, {
                default: N(function() {
                  return [k(e.$slots, "filtericon", {}, function() {
                    return [e.filterIcon ? (h(), g("span", p({
                      key: 0,
                      class: e.filterIcon
                    }, e.ptm("filterIcon")), null, 16)) : (h(), U(u, Qe(p({
                      key: 1
                    }, e.ptm("filterIcon"))), null, 16))];
                  })];
                }),
                _: 3
              }, 8, ["unstyled", "pt"])];
            }),
            _: 3
          }, 8, ["unstyled", "pt"]), L("span", p({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenFilterResult"), {
            "data-p-hidden-accessible": !0
          }), K(i.filterResultMessageText), 17)], 16)) : P("", !0), L("div", p({
            class: e.cx("listContainer"),
            style: {
              "max-height": i.virtualScrollerDisabled ? e.scrollHeight : ""
            }
          }, e.ptm("listContainer")), [H(z, p({
            ref: i.virtualScrollerRef
          }, e.virtualScrollerOptions, {
            items: i.visibleOptions,
            style: {
              height: e.scrollHeight
            },
            tabindex: -1,
            disabled: i.virtualScrollerDisabled,
            pt: e.ptm("virtualScroller")
          }), Xe({
            content: N(function(v) {
              var x = v.styleClass, T = v.contentRef, F = v.items, I = v.getItemOptions, E = v.contentStyle, V = v.itemSize;
              return [L("ul", p({
                ref: function(C) {
                  return i.listRef(C, T);
                },
                id: e.$id + "_list",
                class: [e.cx("list"), x],
                style: E,
                role: "listbox"
              }, e.ptm("list")), [(h(!0), g(Z, null, ve(F, function(w, C) {
                return h(), g(Z, {
                  key: i.getOptionRenderKey(w, i.getOptionIndex(C, I))
                }, [i.isOptionGroup(w) ? (h(), g("li", p({
                  key: 0,
                  id: e.$id + "_" + i.getOptionIndex(C, I),
                  style: {
                    height: V ? V + "px" : void 0
                  },
                  class: e.cx("optionGroup"),
                  role: "option"
                }, {
                  ref_for: !0
                }, e.ptm("optionGroup")), [k(e.$slots, "optiongroup", {
                  option: w.optionGroup,
                  index: i.getOptionIndex(C, I)
                }, function() {
                  return [L("span", p({
                    class: e.cx("optionGroupLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionGroupLabel")), K(i.getOptionGroupLabel(w.optionGroup)), 17)];
                })], 16, Kn)) : $e((h(), g("li", p({
                  key: 1,
                  id: e.$id + "_" + i.getOptionIndex(C, I),
                  class: e.cx("option", {
                    option: w,
                    focusedOption: i.getOptionIndex(C, I)
                  }),
                  style: {
                    height: V ? V + "px" : void 0
                  },
                  role: "option",
                  "aria-label": i.getOptionLabel(w),
                  "aria-selected": i.isSelected(w),
                  "aria-disabled": i.isOptionDisabled(w),
                  "aria-setsize": i.ariaSetSize,
                  "aria-posinset": i.getAriaPosInset(i.getOptionIndex(C, I)),
                  onMousedown: function(c) {
                    return i.onOptionSelect(c, w);
                  },
                  onMousemove: function(c) {
                    return i.onOptionMouseMove(c, i.getOptionIndex(C, I));
                  },
                  onClick: t[8] || (t[8] = _e(function() {
                  }, ["stop"])),
                  "data-p-selected": !e.checkmark && i.isSelected(w),
                  "data-p-focused": s.focusedOptionIndex === i.getOptionIndex(C, I),
                  "data-p-disabled": i.isOptionDisabled(w)
                }, {
                  ref_for: !0
                }, i.getPTItemOptions(w, I, C, "option")), [e.checkmark ? (h(), g(Z, {
                  key: 0
                }, [i.isSelected(w) ? (h(), U(m, p({
                  key: 0,
                  class: e.cx("optionCheckIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionCheckIcon")), null, 16, ["class"])) : (h(), U(b, p({
                  key: 1,
                  class: e.cx("optionBlankIcon")
                }, {
                  ref_for: !0
                }, e.ptm("optionBlankIcon")), null, 16, ["class"]))], 64)) : P("", !0), k(e.$slots, "option", {
                  option: w,
                  selected: i.isSelected(w),
                  index: i.getOptionIndex(C, I)
                }, function() {
                  return [L("span", p({
                    class: e.cx("optionLabel")
                  }, {
                    ref_for: !0
                  }, e.ptm("optionLabel")), K(i.getOptionLabel(w)), 17)];
                })], 16, Hn)), [[S]])], 64);
              }), 128)), s.filterValue && (!F || F && F.length === 0) ? (h(), g("li", p({
                key: 0,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [k(e.$slots, "emptyfilter", {}, function() {
                return [he(K(i.emptyFilterMessageText), 1)];
              })], 16)) : !e.options || e.options && e.options.length === 0 ? (h(), g("li", p({
                key: 1,
                class: e.cx("emptyMessage"),
                role: "option"
              }, e.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [k(e.$slots, "empty", {}, function() {
                return [he(K(i.emptyMessageText), 1)];
              })], 16)) : P("", !0)], 16, Dn)];
            }),
            _: 2
          }, [e.$slots.loader ? {
            name: "loader",
            fn: N(function(v) {
              var x = v.options;
              return [k(e.$slots, "loader", {
                options: x
              })];
            }),
            key: "0"
          } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), k(e.$slots, "footer", {
            value: e.d_value,
            options: i.visibleOptions
          }), !e.options || e.options && e.options.length === 0 ? (h(), g("span", p({
            key: 1,
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenEmptyMessage"), {
            "data-p-hidden-accessible": !0
          }), K(i.emptyMessageText), 17)) : P("", !0), L("span", p({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, e.ptm("hiddenSelectedMessage"), {
            "data-p-hidden-accessible": !0
          }), K(i.selectedMessageText), 17), L("span", p({
            ref: "lastHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: t[9] || (t[9] = function() {
              return i.onLastHiddenFocus && i.onLastHiddenFocus.apply(i, arguments);
            })
          }, e.ptm("hiddenLastFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16)], 16, Bn)) : P("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo"])], 16, An);
}
We.render = Rn;
const ai = /* @__PURE__ */ ce({
  __name: "SelectField",
  props: {
    modelValue: {},
    options: {},
    ariaLabel: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = t;
    return (r, s) => (h(), U(de(We), {
      class: "km-select",
      "model-value": e.modelValue,
      options: e.options,
      "option-label": "label",
      "option-value": "value",
      "aria-label": e.ariaLabel,
      placeholder: e.placeholder,
      "onUpdate:modelValue": s[0] || (s[0] = (i) => n("update:modelValue", i))
    }, null, 8, ["model-value", "options", "aria-label", "placeholder"]));
  }
}), jn = { class: "km-notice-text" }, di = /* @__PURE__ */ ce({
  __name: "Notice",
  props: {
    severity: { default: "info" }
  },
  emits: ["dismiss"],
  setup(e, { emit: t }) {
    const n = t;
    return (r, s) => (h(), g("div", {
      class: ee(["km-notice", `is-${e.severity}`]),
      role: "status"
    }, [
      H(de(ze), {
        icon: e.severity === "danger" ? "tabler:alert-triangle" : "tabler:info-circle",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      L("span", jn, [
        k(r.$slots, "default")
      ]),
      L("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: s[0] || (s[0] = (i) => n("dismiss"))
      }, [
        H(de(ze), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
});
var Un = `
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
`, Gn = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
}, Nn = Y.extend({
  name: "progressspinner",
  style: Un,
  classes: Gn
}), Wn = {
  name: "BaseProgressSpinner",
  extends: pe,
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
  style: Nn,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, qe = {
  name: "ProgressSpinner",
  extends: Wn,
  inheritAttrs: !1,
  computed: {
    svgStyle: function() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
}, qn = ["fill", "stroke-width"];
function Zn(e, t, n, r, s, i) {
  return h(), g("div", p({
    class: e.cx("root"),
    role: "progressbar"
  }, e.ptmi("root")), [(h(), g("svg", p({
    class: e.cx("spin"),
    viewBox: "25 25 50 50",
    style: i.svgStyle
  }, e.ptm("spin")), [L("circle", p({
    class: e.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: e.fill,
    "stroke-width": e.strokeWidth,
    strokeMiterlimit: "10"
  }, e.ptm("circle")), null, 16, qn)], 16))], 16);
}
qe.render = Zn;
const Yn = { class: "km-loading" }, Jn = { key: 0 }, ui = /* @__PURE__ */ ce({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(e) {
    return (t, n) => (h(), g("div", Yn, [
      H(de(qe), {
        style: { width: "2rem", height: "2rem", margin: "0" },
        "aria-label": e.label || "Loading"
      }, null, 8, ["aria-label"]),
      e.label ? (h(), g("span", Jn, K(e.label), 1)) : P("", !0)
    ]));
  }
}), Qn = "wippy.llm.openai_compat:provider";
function ci(e) {
  return e === "healthy" ? "success" : e === "unhealthy" ? "danger" : e === "degraded" ? "warn" : "secondary";
}
const Xn = {
  healthy: "Healthy",
  unhealthy: "Unhealthy",
  degraded: "Degraded"
};
function pi(e) {
  return e && Xn[e] || "Unknown";
}
function fi(e) {
  return e === "registry" ? "info" : e === "discovered" ? "success" : e === "overlay" ? "warn" : "secondary";
}
function hi(e) {
  return e === "registry" ? "built-in" : e || "model";
}
function mi(e) {
  return !e || e <= 0 ? "—" : e >= 1e3 ? `${Math.round(e / 1e3)}k` : String(e);
}
function vi(e) {
  return e.icon || "tabler:plug";
}
const _n = {
  tools: "tabler:tool",
  tool_use: "tabler:tool",
  function_calling: "tabler:tool",
  vision: "tabler:eye",
  image: "tabler:photo",
  images: "tabler:photo",
  multimodal: "tabler:photo",
  embed: "tabler:vector",
  embedding: "tabler:vector",
  embeddings: "tabler:vector",
  audio: "tabler:microphone",
  speech: "tabler:microphone",
  reasoning: "tabler:bulb",
  thinking: "tabler:bulb"
};
function gi(e) {
  return _n[e.toLowerCase()] || "";
}
function yi(e) {
  return e.provider_id === Qn;
}
function bi(e) {
  const t = e.config || {};
  return t.base_url || t.region || t.location || "default endpoint";
}
function Ii(e) {
  return !!(e.has_api_key || e.has_api_key_env || e.secret_fields?.length);
}
function Oi(e, t) {
  const n = e.options?.[t];
  return n == null || n === "" ? "" : String(n);
}
function wi(e, t, n = () => []) {
  const r = (o) => e().find((l) => l.id === o), s = (o) => t().find((l) => l.id === o);
  return {
    adapterFor: r,
    profileFor: s,
    adapterTitle: (o) => r(o)?.title || o || "",
    profileTitle: (o) => s(o)?.name || o || "",
    isDiscoverable: (o) => r(o.provider_id)?.discoverable === !0,
    providerIcon: (o) => {
      if (!o) return "tabler:cpu";
      for (const l of n()) if (l.provider_id === o && l.icon) return l.icon;
      return "tabler:cpu";
    }
  };
}
const ei = { class: "km-external-editor" }, ti = {
  key: 0,
  class: "km-empty"
}, ni = {
  key: 1,
  class: "km-test-result fail"
}, Si = /* @__PURE__ */ ce({
  __name: "ExternalProviderEditor",
  props: {
    tag: {},
    mode: {},
    adapter: {},
    preset: {},
    profile: {},
    saving: { type: Boolean },
    testState: {}
  },
  emits: ["save", "cancel", "test"],
  setup(e, { emit: t }) {
    const n = e, r = t, s = A(null), i = A(!1), o = A("");
    let l = null, u = 0;
    function a(S) {
      r("save", S.detail || {});
    }
    function d() {
      r("cancel");
    }
    function m() {
      r("test");
    }
    function b() {
      l && (l.removeEventListener("save", a), l.removeEventListener("cancel", d), l.removeEventListener("test", m), l.remove(), l = null);
    }
    function z() {
      l && Object.assign(l, {
        mode: n.mode,
        adapter: n.adapter,
        preset: n.preset,
        profile: n.profile,
        saving: n.saving === !0,
        testState: n.testState
      });
    }
    async function O() {
      const S = ++u;
      if (b(), o.value = "", !(!s.value || !n.tag)) {
        i.value = !0;
        try {
          if (await It(n.tag, { timeoutMs: 8e3 }), S !== u || !s.value) return;
          const v = document.createElement(n.tag);
          v.addEventListener("save", a), v.addEventListener("cancel", d), v.addEventListener("test", m), l = v, z(), s.value.replaceChildren(v);
        } catch (v) {
          S === u && (o.value = v instanceof Error ? v.message : String(v));
        } finally {
          S === u && (i.value = !1);
        }
      }
    }
    return et(O), ke(() => n.tag, O), ke(() => [n.mode, n.adapter, n.preset, n.profile, n.saving, n.testState], z), tt(() => {
      u++, b();
    }), (S, v) => (h(), g("div", ei, [
      i.value ? (h(), g("div", ti, "Loading provider editor…")) : P("", !0),
      o.value ? (h(), g("div", ni, [
        L("span", null, "Provider editor failed to load: " + K(o.value), 1),
        L("button", {
          type: "button",
          class: "km-adv-toggle",
          onClick: O
        }, "Retry")
      ])) : P("", !0),
      $e(L("div", {
        ref_key: "host",
        ref: s
      }, null, 512), [
        [nt, !i.value && !o.value]
      ])
    ]));
  }
});
function q(e, t) {
  const n = e?.response?.data ?? e?.data;
  return typeof n?.error == "string" && n.error ? n.error : typeof n?.message == "string" && n.message ? n.message : e instanceof Error ? e.message : t;
}
function Ci() {
  const e = A([]), t = A([]), n = A([]), r = A([]), s = A([]), i = A(!0), o = A(!1), l = A(""), u = A(""), a = A("");
  let d = 0, m = 0;
  async function b() {
    const f = ++d;
    i.value = !0, a.value = "";
    try {
      const { data: c } = await M.get("/api/v1/models/admin");
      if (f !== d) return;
      e.value = c.adapters ?? [], t.value = c.presets ?? [], n.value = c.profiles ?? [], r.value = c.models ?? [];
    } catch (c) {
      f === d && (a.value = q(c, "failed to load models"));
    } finally {
      f === d && (i.value = !1);
    }
  }
  async function z() {
    const f = ++m;
    try {
      const { data: c } = await M.get("/api/v1/models/classes");
      f === m && (s.value = c.classes ?? []);
    } catch {
      f === m && (s.value = []);
    }
  }
  async function O(f, c) {
    o.value = !0, a.value = "";
    try {
      return await f(), await b(), !0;
    } catch (y) {
      return a.value = q(y, c), !1;
    } finally {
      o.value = !1;
    }
  }
  function S(f, c, y) {
    return O(async () => {
      f === "edit" ? await M.put(`/api/v1/models/provider-profiles/${encodeURIComponent(c)}`, y) : await M.post("/api/v1/models/provider-profiles", y);
    }, "failed to save profile");
  }
  function v(f) {
    return O(() => M.delete(`/api/v1/models/provider-profiles/${encodeURIComponent(f)}`).then(() => {
    }), "failed to delete profile");
  }
  function x(f) {
    return O(() => M.put("/api/v1/models/cards", f).then(() => {
    }), "failed to save model");
  }
  function T(f) {
    return f.length ? O(async () => {
      for (const c of f) await M.put("/api/v1/models/cards", c);
    }, "failed to save models") : Promise.resolve(!0);
  }
  function F(f) {
    return O(() => M.delete(`/api/v1/models/cards?name=${encodeURIComponent(f)}`).then(() => {
    }), "failed to delete model");
  }
  async function I() {
    a.value = "";
    try {
      const { data: f } = await M.get("/api/v1/models/export");
      return f;
    } catch (f) {
      return a.value = q(f, "failed to export models"), null;
    }
  }
  async function E(f) {
    let c = null;
    return await O(async () => {
      const { data: $ } = await M.post("/api/v1/models/import", f);
      c = $;
    }, "failed to import models") ? c : null;
  }
  async function V(f) {
    l.value = f, a.value = "";
    try {
      const { data: c } = await M.post(`/api/v1/models/provider-profiles/${encodeURIComponent(f)}/discover`, {});
      return await b(), c && c.success === !1 ? (a.value = c.error || "connection failed", { ok: !1, message: a.value }) : { ok: !0, message: "Connection succeeded" };
    } catch (c) {
      return a.value = q(c, "connection failed"), { ok: !1, message: a.value };
    } finally {
      l.value = "";
    }
  }
  async function w(f) {
    a.value = "";
    try {
      const { data: c } = await M.post(`/api/v1/models/provider-profiles/${encodeURIComponent(f)}/test`, {});
      return await b(), c && c.success === !1 ? (a.value = c.error || "connection test failed", { ok: !1, message: a.value }) : { ok: !0, message: c?.message || "Connection test succeeded" };
    } catch (c) {
      const y = q(c, "connection test failed");
      return await b(), a.value = y, { ok: !1, message: y };
    }
  }
  async function C(f) {
    u.value = f, a.value = "";
    try {
      const { data: c } = await M.post("/api/v1/models/cards/test", { name: f });
      if (c && c.success === !1) {
        const y = c.error || c.message || "model probe failed";
        return { ok: !1, message: y, data: { ...c, error: c.error || c.message || y } };
      }
      return { ok: !0, message: "Model works", data: c };
    } catch (c) {
      const y = q(c, "model probe failed");
      return { ok: !1, message: y, data: { success: !1, model: f, error: y } };
    } finally {
      u.value = "";
    }
  }
  return {
    adapters: e,
    presets: t,
    profiles: n,
    models: r,
    classes: s,
    loading: i,
    saving: o,
    discovering: l,
    probing: u,
    error: a,
    load: b,
    loadClasses: z,
    saveProfile: S,
    deleteProfile: v,
    saveCard: x,
    saveCards: T,
    deleteCard: F,
    discover: V,
    testProfile: w,
    testModel: C,
    exportSetup: I,
    importSetup: E
  };
}
export {
  ai as _,
  pi as a,
  ci as b,
  fi as c,
  hi as d,
  gi as e,
  mi as f,
  vi as g,
  Ii as h,
  yi as i,
  di as j,
  ui as k,
  Si as l,
  wi as m,
  Oi as o,
  bi as p,
  Ke as s,
  Ci as u
};
//# sourceMappingURL=useModelsApi-Bk1pY9iW.js.map
