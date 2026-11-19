import { B as ue, s as J, f as pt, a as Re, p as bn, M as wt, l as kt, b as et, R as Fe, c as vn, _ as yn, L as wn, d as Ie, v as xe, e as kn, U as Pn, I as Pt, g as xn, r as Et, h as Cn, i as $n, x as Qe, j as Sn, k as In, u as Ln, m as Tn, P as An } from "./wc-runtime-Crg81w4N.js";
import { openBlock as l, createElementBlock as m, mergeProps as k, createBlock as $, resolveDynamicComponent as q, createCommentVNode as C, renderSlot as F, createElementVNode as y, toDisplayString as A, resolveComponent as K, createVNode as w, normalizeStyle as Dn, normalizeClass as L, toHandlers as Ue, resolveDirective as ye, withDirectives as de, createSlots as Rt, withCtx as D, Fragment as ee, renderList as ve, createTextVNode as be, normalizeProps as Bn, Transition as En, defineComponent as Ft, computed as z, unref as u, vShow as Rn, ref as R, watch as Ve, onMounted as Fn, onBeforeUnmount as On, withModifiers as xt, withKeys as Ct, isRef as Mn } from "vue";
import { Icon as T } from "@iconify/vue";
import { s as Ot, a as Mt, b as _n, c as ft, d as U } from "./index-D-sSYkIL.js";
import { on as Nn, api as le, loadByTagName as jn, host as Un } from "@wippy-fe/proxy";
var Vn = `
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
`, zn = {
  root: function(t) {
    var n = t.props;
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
}, Kn = ue.extend({
  name: "tag",
  style: Vn,
  classes: zn
}), Gn = {
  name: "BaseTag",
  extends: J,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: Kn,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Le(e);
}
function Wn(e, t, n) {
  return (t = Jn(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Jn(e) {
  var t = Hn(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function Hn(e, t) {
  if (Le(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Le(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var _t = {
  name: "Tag",
  extends: Gn,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return pt(Wn({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, qn = ["data-p"];
function Zn(e, t, n, r, i, a) {
  return l(), m("span", k({
    class: e.cx("root"),
    "data-p": a.dataP
  }, e.ptmi("root")), [e.$slots.icon ? (l(), $(q(e.$slots.icon), k({
    key: 0,
    class: e.cx("icon")
  }, e.ptm("icon")), null, 16, ["class"])) : e.icon ? (l(), m("span", k({
    key: 1,
    class: [e.cx("icon"), e.icon]
  }, e.ptm("icon")), null, 16)) : C("", !0), e.value != null || e.$slots.default ? F(e.$slots, "default", {
    key: 2
  }, function() {
    return [y("span", k({
      class: e.cx("label")
    }, e.ptm("label")), A(e.value), 17)];
  }) : C("", !0)], 16, qn);
}
_t.render = Zn;
var Qn = `
    .p-inputgroup,
    .p-inputgroup .p-iconfield,
    .p-inputgroup .p-floatlabel,
    .p-inputgroup .p-iftalabel {
        display: flex;
        align-items: stretch;
        width: 100%;
    }

    .p-inputgroup .p-floatlabel .p-inputwrapper,
    .p-inputgroup .p-iftalabel .p-inputwrapper {
        display: inline-flex;
    }

    .p-inputgroup .p-inputtext,
    .p-inputgroup .p-inputwrapper {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-inputgroupaddon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: dt('inputgroup.addon.padding');
        background: dt('inputgroup.addon.background');
        color: dt('inputgroup.addon.color');
        border-block-start: 1px solid dt('inputgroup.addon.border.color');
        border-block-end: 1px solid dt('inputgroup.addon.border.color');
        min-width: dt('inputgroup.addon.min.width');
    }

    .p-inputgroupaddon:first-child,
    .p-inputgroupaddon + .p-inputgroupaddon {
        border-inline-start: 1px solid dt('inputgroup.addon.border.color');
    }

    .p-inputgroupaddon:last-child {
        border-inline-end: 1px solid dt('inputgroup.addon.border.color');
    }

    .p-inputgroupaddon:has(.p-button) {
        padding: 0;
        overflow: hidden;
    }

    .p-inputgroupaddon .p-button {
        border-radius: 0;
    }

    .p-inputgroup > .p-component,
    .p-inputgroup > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iconfield > .p-component,
    .p-inputgroup > .p-floatlabel > .p-component,
    .p-inputgroup > .p-floatlabel > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel > .p-component,
    .p-inputgroup > .p-iftalabel > .p-inputwrapper > .p-component {
        border-radius: 0;
        margin: 0;
    }

    .p-inputgroupaddon:first-child,
    .p-inputgroup > .p-component:first-child,
    .p-inputgroup > .p-inputwrapper:first-child > .p-component,
    .p-inputgroup > .p-iconfield:first-child > .p-component,
    .p-inputgroup > .p-floatlabel:first-child > .p-component,
    .p-inputgroup > .p-floatlabel:first-child > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel:first-child > .p-component,
    .p-inputgroup > .p-iftalabel:first-child > .p-inputwrapper > .p-component {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroupaddon:last-child,
    .p-inputgroup > .p-component:last-child,
    .p-inputgroup > .p-inputwrapper:last-child > .p-component,
    .p-inputgroup > .p-iconfield:last-child > .p-component,
    .p-inputgroup > .p-floatlabel:last-child > .p-component,
    .p-inputgroup > .p-floatlabel:last-child > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel:last-child > .p-component,
    .p-inputgroup > .p-iftalabel:last-child > .p-inputwrapper > .p-component {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroup .p-component:focus,
    .p-inputgroup .p-component.p-focus,
    .p-inputgroup .p-inputwrapper-focus,
    .p-inputgroup .p-component:focus ~ label,
    .p-inputgroup .p-component.p-focus ~ label,
    .p-inputgroup .p-inputwrapper-focus ~ label,
    .p-inputgroup .p-floatlabel .p-inputwrapper ~ label,
    .p-inputgroup .p-iftalabel .p-inputwrapper ~ label {
        z-index: 1;
    }

    .p-inputgroup > .p-button:not(.p-button-icon-only) {
        width: auto;
    }

    .p-inputgroup .p-iconfield + .p-iconfield .p-inputtext {
        border-inline-start: 0;
    }
`, Yn = {
  root: "p-inputgroup"
}, Xn = ue.extend({
  name: "inputgroup",
  style: Qn,
  classes: Yn
}), er = {
  name: "BaseInputGroup",
  extends: J,
  style: Xn,
  provide: function() {
    return {
      $pcInputGroup: this,
      $parentInstance: this
    };
  }
}, Nt = {
  name: "InputGroup",
  extends: er,
  inheritAttrs: !1
};
function tr(e, t, n, r, i, a) {
  return l(), m("div", k({
    class: e.cx("root")
  }, e.ptmi("root")), [F(e.$slots, "default")], 16);
}
Nt.render = tr;
var nr = {
  root: "p-inputgroupaddon"
}, rr = ue.extend({
  name: "inputgroupaddon",
  classes: nr
}), ar = {
  name: "BaseInputGroupAddon",
  extends: J,
  style: rr,
  provide: function() {
    return {
      $pcInputGroupAddon: this,
      $parentInstance: this
    };
  }
}, tt = {
  name: "InputGroupAddon",
  extends: ar,
  inheritAttrs: !1
};
function ir(e, t, n, r, i, a) {
  return l(), m("div", k({
    class: e.cx("root")
  }, e.ptmi("root")), [F(e.$slots, "default")], 16);
}
tt.render = ir;
var or = `
    .p-paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        background: dt('paginator.background');
        color: dt('paginator.color');
        padding: dt('paginator.padding');
        border-radius: dt('paginator.border.radius');
        gap: dt('paginator.gap');
    }

    .p-paginator-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: dt('paginator.gap');
    }

    .p-paginator-content-start {
        margin-inline-end: auto;
    }

    .p-paginator-content-end {
        margin-inline-start: auto;
    }

    .p-paginator-page,
    .p-paginator-next,
    .p-paginator-last,
    .p-paginator-first,
    .p-paginator-prev {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        user-select: none;
        overflow: hidden;
        position: relative;
        background: dt('paginator.nav.button.background');
        border: 0 none;
        color: dt('paginator.nav.button.color');
        min-width: dt('paginator.nav.button.width');
        height: dt('paginator.nav.button.height');
        transition:
            background dt('paginator.transition.duration'),
            color dt('paginator.transition.duration'),
            outline-color dt('paginator.transition.duration'),
            box-shadow dt('paginator.transition.duration');
        border-radius: dt('paginator.nav.button.border.radius');
        padding: 0;
        margin: 0;
    }

    .p-paginator-page:focus-visible,
    .p-paginator-next:focus-visible,
    .p-paginator-last:focus-visible,
    .p-paginator-first:focus-visible,
    .p-paginator-prev:focus-visible {
        box-shadow: dt('paginator.nav.button.focus.ring.shadow');
        outline: dt('paginator.nav.button.focus.ring.width') dt('paginator.nav.button.focus.ring.style') dt('paginator.nav.button.focus.ring.color');
        outline-offset: dt('paginator.nav.button.focus.ring.offset');
    }

    .p-paginator-page:not(.p-disabled):not(.p-paginator-page-selected):hover,
    .p-paginator-first:not(.p-disabled):hover,
    .p-paginator-prev:not(.p-disabled):hover,
    .p-paginator-next:not(.p-disabled):hover,
    .p-paginator-last:not(.p-disabled):hover {
        background: dt('paginator.nav.button.hover.background');
        color: dt('paginator.nav.button.hover.color');
    }

    .p-paginator-page.p-paginator-page-selected {
        background: dt('paginator.nav.button.selected.background');
        color: dt('paginator.nav.button.selected.color');
    }

    .p-paginator-current {
        color: dt('paginator.current.page.report.color');
    }

    .p-paginator-pages {
        display: flex;
        align-items: center;
        gap: dt('paginator.gap');
    }

    .p-paginator-jtp-input .p-inputtext {
        max-width: dt('paginator.jump.to.page.input.max.width');
    }

    .p-paginator-first:dir(rtl),
    .p-paginator-prev:dir(rtl),
    .p-paginator-next:dir(rtl),
    .p-paginator-last:dir(rtl) {
        transform: rotate(180deg);
    }
`;
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
function sr(e, t, n) {
  return (t = lr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function lr(e) {
  var t = ur(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function ur(e, t) {
  if (Te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Te(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var dr = {
  paginator: function(t) {
    var n = t.instance, r = t.key;
    return ["p-paginator p-component", sr({
      "p-paginator-default": !n.hasBreakpoints()
    }, "p-paginator-".concat(r), n.hasBreakpoints())];
  },
  content: "p-paginator-content",
  contentStart: "p-paginator-content-start",
  contentEnd: "p-paginator-content-end",
  first: function(t) {
    var n = t.instance;
    return ["p-paginator-first", {
      "p-disabled": n.$attrs.disabled
    }];
  },
  firstIcon: "p-paginator-first-icon",
  prev: function(t) {
    var n = t.instance;
    return ["p-paginator-prev", {
      "p-disabled": n.$attrs.disabled
    }];
  },
  prevIcon: "p-paginator-prev-icon",
  next: function(t) {
    var n = t.instance;
    return ["p-paginator-next", {
      "p-disabled": n.$attrs.disabled
    }];
  },
  nextIcon: "p-paginator-next-icon",
  last: function(t) {
    var n = t.instance;
    return ["p-paginator-last", {
      "p-disabled": n.$attrs.disabled
    }];
  },
  lastIcon: "p-paginator-last-icon",
  pages: "p-paginator-pages",
  page: function(t) {
    var n = t.props, r = t.pageLink;
    return ["p-paginator-page", {
      "p-paginator-page-selected": r - 1 === n.page
    }];
  },
  current: "p-paginator-current",
  pcRowPerPageDropdown: "p-paginator-rpp-dropdown",
  pcJumpToPageDropdown: "p-paginator-jtp-dropdown",
  pcJumpToPageInputText: "p-paginator-jtp-input"
}, cr = ue.extend({
  name: "paginator",
  style: or,
  classes: dr
}), jt = {
  name: "AngleDoubleLeftIcon",
  extends: Re
};
function pr(e) {
  return hr(e) || gr(e) || mr(e) || fr();
}
function fr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function mr(e, t) {
  if (e) {
    if (typeof e == "string") return nt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? nt(e, t) : void 0;
  }
}
function gr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function hr(e) {
  if (Array.isArray(e)) return nt(e);
}
function nt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function br(e, t, n, r, i, a) {
  return l(), m("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), pr(t[0] || (t[0] = [y("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
jt.render = br;
var Ut = {
  name: "AngleDownIcon",
  extends: Re
};
function vr(e) {
  return Pr(e) || kr(e) || wr(e) || yr();
}
function yr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wr(e, t) {
  if (e) {
    if (typeof e == "string") return rt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? rt(e, t) : void 0;
  }
}
function kr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Pr(e) {
  if (Array.isArray(e)) return rt(e);
}
function rt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function xr(e, t, n, r, i, a) {
  return l(), m("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), vr(t[0] || (t[0] = [y("path", {
    d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ut.render = xr;
var Vt = {
  name: "AngleUpIcon",
  extends: Re
};
function Cr(e) {
  return Lr(e) || Ir(e) || Sr(e) || $r();
}
function $r() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Sr(e, t) {
  if (e) {
    if (typeof e == "string") return at(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? at(e, t) : void 0;
  }
}
function Ir(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Lr(e) {
  if (Array.isArray(e)) return at(e);
}
function at(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Tr(e, t, n, r, i, a) {
  return l(), m("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Cr(t[0] || (t[0] = [y("path", {
    d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Vt.render = Tr;
var Ar = `
    .p-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .p-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .p-inputnumber-button:disabled {
        cursor: auto;
    }

    .p-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .p-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .p-inputnumber-stacked .p-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .p-inputnumber-stacked .p-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .p-inputnumber-stacked .p-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-horizontal .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .p-inputnumber-horizontal .p-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .p-inputnumber-horizontal .p-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .p-floatlabel:has(.p-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .p-inputnumber-vertical {
        flex-direction: column;
    }

    .p-inputnumber-vertical .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .p-inputnumber-vertical .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .p-inputnumber-vertical .p-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .p-inputnumber-vertical .p-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .p-inputnumber-input {
        flex: 1 1 auto;
    }

    .p-inputnumber-fluid {
        width: 100%;
    }

    .p-inputnumber-fluid .p-inputnumber-input {
        width: 1%;
    }

    .p-inputnumber-fluid.p-inputnumber-vertical .p-inputnumber-input {
        width: 100%;
    }

    .p-inputnumber:has(.p-inputtext-sm) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-inputnumber:has(.p-inputtext-lg) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .p-inputnumber:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-stacked .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-stacked:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + (dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-horizontal .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`, Dr = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-inputnumber p-component p-inputwrapper", {
      "p-invalid": n.$invalid,
      "p-inputwrapper-filled": n.$filled || r.allowEmpty === !1,
      "p-inputwrapper-focus": n.focused,
      "p-inputnumber-stacked": r.showButtons && r.buttonLayout === "stacked",
      "p-inputnumber-horizontal": r.showButtons && r.buttonLayout === "horizontal",
      "p-inputnumber-vertical": r.showButtons && r.buttonLayout === "vertical",
      "p-inputnumber-fluid": n.$fluid
    }];
  },
  pcInputText: "p-inputnumber-input",
  clearIcon: "p-inputnumber-clear-icon",
  buttonGroup: "p-inputnumber-button-group",
  incrementButton: function(t) {
    var n = t.instance, r = t.props;
    return ["p-inputnumber-button p-inputnumber-increment-button", {
      "p-disabled": r.showButtons && r.max !== null && n.maxBoundry()
    }];
  },
  decrementButton: function(t) {
    var n = t.instance, r = t.props;
    return ["p-inputnumber-button p-inputnumber-decrement-button", {
      "p-disabled": r.showButtons && r.min !== null && n.minBoundry()
    }];
  }
}, Br = ue.extend({
  name: "inputnumber",
  style: Ar,
  classes: Dr
}), Er = {
  name: "BaseInputNumber",
  extends: _n,
  props: {
    format: {
      type: Boolean,
      default: !0
    },
    showButtons: {
      type: Boolean,
      default: !1
    },
    buttonLayout: {
      type: String,
      default: "stacked"
    },
    incrementButtonClass: {
      type: String,
      default: null
    },
    decrementButtonClass: {
      type: String,
      default: null
    },
    incrementButtonIcon: {
      type: String,
      default: void 0
    },
    incrementIcon: {
      type: String,
      default: void 0
    },
    decrementButtonIcon: {
      type: String,
      default: void 0
    },
    decrementIcon: {
      type: String,
      default: void 0
    },
    locale: {
      type: String,
      default: void 0
    },
    localeMatcher: {
      type: String,
      default: void 0
    },
    mode: {
      type: String,
      default: "decimal"
    },
    prefix: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: void 0
    },
    currencyDisplay: {
      type: String,
      default: void 0
    },
    useGrouping: {
      type: Boolean,
      default: !0
    },
    minFractionDigits: {
      type: Number,
      default: void 0
    },
    maxFractionDigits: {
      type: Number,
      default: void 0
    },
    roundingMode: {
      type: String,
      default: "halfExpand",
      validator: function(t) {
        return ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"].includes(t);
      }
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    allowEmpty: {
      type: Boolean,
      default: !0
    },
    highlightOnFocus: {
      type: Boolean,
      default: !1
    },
    showClear: {
      type: Boolean,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    placeholder: {
      type: String,
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
    },
    required: {
      type: Boolean,
      default: !1
    }
  },
  style: Br,
  provide: function() {
    return {
      $pcInputNumber: this,
      $parentInstance: this
    };
  }
};
function Ae(e) {
  "@babel/helpers - typeof";
  return Ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ae(e);
}
function $t(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function St(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $t(Object(n), !0).forEach(function(r) {
      it(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : $t(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function it(e, t, n) {
  return (t = Rr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Rr(e) {
  var t = Fr(e, "string");
  return Ae(t) == "symbol" ? t : t + "";
}
function Fr(e, t) {
  if (Ae(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ae(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Or(e) {
  return jr(e) || Nr(e) || _r(e) || Mr();
}
function Mr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _r(e, t) {
  if (e) {
    if (typeof e == "string") return ot(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ot(e, t) : void 0;
  }
}
function Nr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function jr(e) {
  if (Array.isArray(e)) return ot(e);
}
function ot(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
var zt = {
  name: "InputNumber",
  extends: Er,
  inheritAttrs: !1,
  emits: ["input", "focus", "blur"],
  inject: {
    $pcFluid: {
      default: null
    }
  },
  numberFormat: null,
  _numeral: null,
  _decimal: null,
  _group: null,
  _minusSign: null,
  _currency: null,
  _suffix: null,
  _prefix: null,
  _index: null,
  groupChar: "",
  isSpecialChar: null,
  prefixChar: null,
  suffixChar: null,
  timer: null,
  data: function() {
    return {
      // @deprecated
      d_modelValue: this.d_value,
      focused: !1
    };
  },
  watch: {
    d_value: {
      immediate: !0,
      handler: function(t) {
        var n;
        this.d_modelValue = t, (n = this.$refs.clearIcon) !== null && n !== void 0 && (n = n.$el) !== null && n !== void 0 && n.style && (this.$refs.clearIcon.$el.style.display = kt(t) ? "none" : "block");
      }
    },
    locale: function(t, n) {
      this.updateConstructParser(t, n);
    },
    localeMatcher: function(t, n) {
      this.updateConstructParser(t, n);
    },
    mode: function(t, n) {
      this.updateConstructParser(t, n);
    },
    currency: function(t, n) {
      this.updateConstructParser(t, n);
    },
    currencyDisplay: function(t, n) {
      this.updateConstructParser(t, n);
    },
    useGrouping: function(t, n) {
      this.updateConstructParser(t, n);
    },
    minFractionDigits: function(t, n) {
      this.updateConstructParser(t, n);
    },
    maxFractionDigits: function(t, n) {
      this.updateConstructParser(t, n);
    },
    suffix: function(t, n) {
      this.updateConstructParser(t, n);
    },
    prefix: function(t, n) {
      this.updateConstructParser(t, n);
    }
  },
  created: function() {
    this.constructParser();
  },
  mounted: function() {
    var t;
    (t = this.$refs.clearIcon) !== null && t !== void 0 && (t = t.$el) !== null && t !== void 0 && t.style && (this.$refs.clearIcon.$el.style.display = this.$filled ? "block" : "none");
  },
  methods: {
    getOptions: function() {
      return {
        localeMatcher: this.localeMatcher,
        style: this.mode,
        currency: this.currency,
        currencyDisplay: this.currencyDisplay,
        useGrouping: this.useGrouping,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits,
        roundingMode: this.roundingMode
      };
    },
    constructParser: function() {
      this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
      var t = Or(new Intl.NumberFormat(this.locale, {
        useGrouping: !1
      }).format(9876543210)).reverse(), n = new Map(t.map(function(r, i) {
        return [r, i];
      }));
      this._numeral = new RegExp("[".concat(t.join(""), "]"), "g"), this._group = this.getGroupingExpression(), this._minusSign = this.getMinusSignExpression(), this._currency = this.getCurrencyExpression(), this._decimal = this.getDecimalExpression(), this._suffix = this.getSuffixExpression(), this._prefix = this.getPrefixExpression(), this._index = function(r) {
        return n.get(r);
      };
    },
    updateConstructParser: function(t, n) {
      t !== n && this.constructParser();
    },
    escapeRegExp: function(t) {
      return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    getDecimalExpression: function() {
      var t = new Intl.NumberFormat(this.locale, St(St({}, this.getOptions()), {}, {
        useGrouping: !1
      })), n = t.format(1.1);
      return n === t.format(1) ? new RegExp("[]", "g") : new RegExp("[".concat(n.replace(this._currency, "").trim().replace(this._numeral, ""), "]"), "g");
    },
    getGroupingExpression: function() {
      var t = new Intl.NumberFormat(this.locale, {
        useGrouping: !0
      });
      return this.groupChar = t.format(1e6).trim().replace(this._numeral, "").charAt(0), new RegExp("[".concat(this.groupChar, "]"), "g");
    },
    getMinusSignExpression: function() {
      var t = new Intl.NumberFormat(this.locale, {
        useGrouping: !1
      });
      return new RegExp("[".concat(t.format(-1).trim().replace(this._numeral, ""), "]"), "g");
    },
    getCurrencyExpression: function() {
      if (this.currency) {
        var t = new Intl.NumberFormat(this.locale, {
          style: "currency",
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        return new RegExp("[".concat(t.format(1).replace(/\s/g, "").replace(this._numeral, "").replace(this._group, ""), "]"), "g");
      }
      return new RegExp("[]", "g");
    },
    getPrefixExpression: function() {
      if (this.prefix)
        this.prefixChar = this.prefix;
      else {
        var t = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay
        });
        this.prefixChar = t.format(1).split("1")[0];
      }
      return new RegExp("".concat(this.escapeRegExp(this.prefixChar || "")), "g");
    },
    getSuffixExpression: function() {
      if (this.suffix)
        this.suffixChar = this.suffix;
      else {
        var t = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        this.suffixChar = t.format(1).split("1")[1];
      }
      return new RegExp("".concat(this.escapeRegExp(this.suffixChar || "")), "g");
    },
    formatValue: function(t) {
      if (t != null) {
        if (t === "-")
          return t;
        if (this.format) {
          var n = new Intl.NumberFormat(this.locale, this.getOptions()), r = n.format(t);
          return this.prefix && (r = this.prefix + r), this.suffix && (r = r + this.suffix), r;
        }
        return t.toString();
      }
      return "";
    },
    parseValue: function(t) {
      var n = t.replace(this._suffix, "").replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "").replace(this._group, "").replace(this._minusSign, "-").replace(this._decimal, ".").replace(this._numeral, this._index);
      if (n) {
        if (n === "-")
          return n;
        var r = +n;
        return isNaN(r) ? null : r;
      }
      return null;
    },
    repeat: function(t, n, r) {
      var i = this;
      if (!this.readonly) {
        var a = n || 500;
        this.clearTimer(), this.timer = setTimeout(function() {
          i.repeat(t, 40, r);
        }, a), this.spin(t, r);
      }
    },
    addWithPrecision: function(t, n) {
      var r = t.toString(), i = n.toString(), a = r.includes(".") ? r.split(".")[1].length : 0, o = i.includes(".") ? i.split(".")[1].length : 0, s = Math.max(a, o), v = Math.pow(10, s);
      return Math.round((t + n) * v) / v;
    },
    spin: function(t, n) {
      if (this.$refs.input) {
        var r = this.step * n, i = this.parseValue(this.$refs.input.$el.value) || 0, a = this.validateValue(this.addWithPrecision(i, r));
        this.updateInput(a, null, "spin"), this.updateModel(t, a), this.handleOnInput(t, i, a);
      }
    },
    onUpButtonMouseDown: function(t) {
      this.disabled || (this.$refs.input.$el.focus(), this.repeat(t, null, 1), t.preventDefault());
    },
    onUpButtonMouseUp: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonMouseLeave: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonKeyUp: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonKeyDown: function(t) {
      (t.code === "Space" || t.code === "Enter" || t.code === "NumpadEnter") && this.repeat(t, null, 1);
    },
    onDownButtonMouseDown: function(t) {
      this.disabled || (this.$refs.input.$el.focus(), this.repeat(t, null, -1), t.preventDefault());
    },
    onDownButtonMouseUp: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonMouseLeave: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonKeyUp: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonKeyDown: function(t) {
      (t.code === "Space" || t.code === "Enter" || t.code === "NumpadEnter") && this.repeat(t, null, -1);
    },
    onUserInput: function() {
      this.isSpecialChar && (this.$refs.input.$el.value = this.lastValue), this.isSpecialChar = !1;
    },
    onInputKeyDown: function(t) {
      if (!this.readonly && !t.isComposing) {
        if (t.altKey || t.ctrlKey || t.metaKey) {
          this.isSpecialChar = !0, this.lastValue = this.$refs.input.$el.value;
          return;
        }
        this.lastValue = t.target.value;
        var n = t.target.selectionStart, r = t.target.selectionEnd, i = r - n, a = t.target.value, o = null, s = t.code || t.key;
        switch (s) {
          case "ArrowUp":
            this.spin(t, 1), t.preventDefault();
            break;
          case "ArrowDown":
            this.spin(t, -1), t.preventDefault();
            break;
          case "ArrowLeft":
            if (i > 1) {
              var v = this.isNumeralChar(a.charAt(n)) ? n + 1 : n + 2;
              this.$refs.input.$el.setSelectionRange(v, v);
            } else this.isNumeralChar(a.charAt(n - 1)) || t.preventDefault();
            break;
          case "ArrowRight":
            if (i > 1) {
              var p = r - 1;
              this.$refs.input.$el.setSelectionRange(p, p);
            } else this.isNumeralChar(a.charAt(n)) || t.preventDefault();
            break;
          case "Tab":
          case "Enter":
          case "NumpadEnter":
            o = this.validateValue(this.parseValue(a)), this.$refs.input.$el.value = this.formatValue(o), this.$refs.input.$el.setAttribute("aria-valuenow", o), this.updateModel(t, o);
            break;
          case "Backspace": {
            if (t.preventDefault(), n === r) {
              n >= a.length && this.suffixChar !== null && (n = a.length - this.suffixChar.length, this.$refs.input.$el.setSelectionRange(n, n));
              var c = a.charAt(n - 1), P = this.getDecimalCharIndexes(a), g = P.decimalCharIndex, x = P.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(c)) {
                var E = this.getDecimalLength(a);
                if (this._group.test(c))
                  this._group.lastIndex = 0, o = a.slice(0, n - 2) + a.slice(n - 1);
                else if (this._decimal.test(c))
                  this._decimal.lastIndex = 0, E ? this.$refs.input.$el.setSelectionRange(n - 1, n - 1) : o = a.slice(0, n - 1) + a.slice(n);
                else if (g > 0 && n > g) {
                  var O = this.isDecimalMode() && (this.minFractionDigits || 0) < E ? "" : "0";
                  o = a.slice(0, n - 1) + O + a.slice(n);
                } else x === 1 ? (o = a.slice(0, n - 1) + "0" + a.slice(n), o = this.parseValue(o) > 0 ? o : "") : o = a.slice(0, n - 1) + a.slice(n);
              }
              this.updateValue(t, o, null, "delete-single");
            } else
              o = this.deleteRange(a, n, r), this.updateValue(t, o, null, "delete-range");
            break;
          }
          case "Delete":
            if (t.preventDefault(), n === r) {
              var M = a.charAt(n), I = this.getDecimalCharIndexes(a), S = I.decimalCharIndex, Z = I.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(M)) {
                var Q = this.getDecimalLength(a);
                if (this._group.test(M))
                  this._group.lastIndex = 0, o = a.slice(0, n) + a.slice(n + 2);
                else if (this._decimal.test(M))
                  this._decimal.lastIndex = 0, Q ? this.$refs.input.$el.setSelectionRange(n + 1, n + 1) : o = a.slice(0, n) + a.slice(n + 1);
                else if (S > 0 && n > S) {
                  var se = this.isDecimalMode() && (this.minFractionDigits || 0) < Q ? "" : "0";
                  o = a.slice(0, n) + se + a.slice(n + 1);
                } else Z === 1 ? (o = a.slice(0, n) + "0" + a.slice(n + 1), o = this.parseValue(o) > 0 ? o : "") : o = a.slice(0, n) + a.slice(n + 1);
              }
              this.updateValue(t, o, null, "delete-back-single");
            } else
              o = this.deleteRange(a, n, r), this.updateValue(t, o, null, "delete-range");
            break;
          case "Home":
            t.preventDefault(), et(this.min) && this.updateModel(t, this.min);
            break;
          case "End":
            t.preventDefault(), et(this.max) && this.updateModel(t, this.max);
            break;
        }
      }
    },
    onInputKeyPress: function(t) {
      if (!this.readonly) {
        var n = t.key, r = this.isDecimalSign(n), i = this.isMinusSign(n);
        t.code !== "Enter" && t.preventDefault(), (Number(n) >= 0 && Number(n) <= 9 || i || r) && this.insert(t, n, {
          isDecimalSign: r,
          isMinusSign: i
        });
      }
    },
    onPaste: function(t) {
      if (!(this.readonly || this.disabled)) {
        t.preventDefault();
        var n = (t.clipboardData || window.clipboardData).getData("Text");
        if (!(this.inputId === "integeronly" && /[^\d-]/.test(n)) && n) {
          var r = this.parseValue(n);
          r != null && this.insert(t, r.toString());
        }
      }
    },
    onClearClick: function(t) {
      this.updateModel(t, null), this.$refs.input.$el.focus();
    },
    allowMinusSign: function() {
      return this.min === null || this.min < 0;
    },
    isMinusSign: function(t) {
      return this._minusSign.test(t) || t === "-" ? (this._minusSign.lastIndex = 0, !0) : !1;
    },
    isDecimalSign: function(t) {
      var n;
      return (n = this.locale) !== null && n !== void 0 && n.includes("fr") && [".", ","].includes(t) || this._decimal.test(t) ? (this._decimal.lastIndex = 0, !0) : !1;
    },
    isDecimalMode: function() {
      return this.mode === "decimal";
    },
    getDecimalCharIndexes: function(t) {
      var n = t.search(this._decimal);
      this._decimal.lastIndex = 0;
      var r = t.replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, ""), i = r.search(this._decimal);
      return this._decimal.lastIndex = 0, {
        decimalCharIndex: n,
        decimalCharIndexWithoutPrefix: i
      };
    },
    getCharIndexes: function(t) {
      var n = t.search(this._decimal);
      this._decimal.lastIndex = 0;
      var r = t.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      var i = t.search(this._suffix);
      this._suffix.lastIndex = 0;
      var a = t.search(this._currency);
      return this._currency.lastIndex = 0, {
        decimalCharIndex: n,
        minusCharIndex: r,
        suffixCharIndex: i,
        currencyCharIndex: a
      };
    },
    insert: function(t, n) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        isDecimalSign: !1,
        isMinusSign: !1
      }, i = n.search(this._minusSign);
      if (this._minusSign.lastIndex = 0, !(!this.allowMinusSign() && i !== -1)) {
        var a = this.$refs.input.$el.selectionStart, o = this.$refs.input.$el.selectionEnd, s = this.$refs.input.$el.value.trim(), v = this.getCharIndexes(s), p = v.decimalCharIndex, c = v.minusCharIndex, P = v.suffixCharIndex, g = v.currencyCharIndex, x;
        if (r.isMinusSign) {
          var E = c === -1;
          (a === 0 || a === g + 1) && (x = s, (E || o !== 0) && (x = this.insertText(s, n, 0, o)), this.updateValue(t, x, n, "insert"));
        } else if (r.isDecimalSign)
          p > 0 && a === p ? this.updateValue(t, s, n, "insert") : p > a && p < o ? (x = this.insertText(s, n, a, o), this.updateValue(t, x, n, "insert")) : p === -1 && this.maxFractionDigits && (x = this.insertText(s, n, a, o), this.updateValue(t, x, n, "insert"));
        else {
          var O = this.numberFormat.resolvedOptions().maximumFractionDigits, M = a !== o ? "range-insert" : "insert";
          if (p > 0 && a > p) {
            if (a + n.length - (p + 1) <= O) {
              var I = g >= a ? g - 1 : P >= a ? P : s.length;
              x = s.slice(0, a) + n + s.slice(a + n.length, I) + s.slice(I), this.updateValue(t, x, n, M);
            }
          } else
            x = this.insertText(s, n, a, o), this.updateValue(t, x, n, M);
        }
      }
    },
    insertText: function(t, n, r, i) {
      var a = n === "." ? n : n.split(".");
      if (a.length === 2) {
        var o = t.slice(r, i).search(this._decimal);
        return this._decimal.lastIndex = 0, o > 0 ? t.slice(0, r) + this.formatValue(n) + t.slice(i) : this.formatValue(n) || t;
      } else return i - r === t.length ? this.formatValue(n) : r === 0 ? n + t.slice(i) : i === t.length ? t.slice(0, r) + n : t.slice(0, r) + n + t.slice(i);
    },
    deleteRange: function(t, n, r) {
      var i;
      return r - n === t.length ? i = "" : n === 0 ? i = t.slice(r) : r === t.length ? i = t.slice(0, n) : i = t.slice(0, n) + t.slice(r), i;
    },
    initCursor: function() {
      var t = this.$refs.input.$el.selectionStart, n = this.$refs.input.$el.value, r = n.length, i = null, a = (this.prefixChar || "").length;
      n = n.replace(this._prefix, ""), t = t - a;
      var o = n.charAt(t);
      if (this.isNumeralChar(o))
        return t + a;
      for (var s = t - 1; s >= 0; )
        if (o = n.charAt(s), this.isNumeralChar(o)) {
          i = s + a;
          break;
        } else
          s--;
      if (i !== null)
        this.$refs.input.$el.setSelectionRange(i + 1, i + 1);
      else {
        for (s = t; s < r; )
          if (o = n.charAt(s), this.isNumeralChar(o)) {
            i = s + a;
            break;
          } else
            s++;
        i !== null && this.$refs.input.$el.setSelectionRange(i, i);
      }
      return i || 0;
    },
    onInputClick: function() {
      var t = this.$refs.input.$el.value;
      !this.readonly && t !== wt() && this.initCursor();
    },
    isNumeralChar: function(t) {
      return t.length === 1 && (this._numeral.test(t) || this._decimal.test(t) || this._group.test(t) || this._minusSign.test(t)) ? (this.resetRegex(), !0) : !1;
    },
    resetRegex: function() {
      this._numeral.lastIndex = 0, this._decimal.lastIndex = 0, this._group.lastIndex = 0, this._minusSign.lastIndex = 0;
    },
    updateValue: function(t, n, r, i) {
      var a = this.$refs.input.$el.value, o = null;
      n != null && (o = this.parseValue(n), o = !o && !this.allowEmpty ? 0 : o, this.updateInput(o, r, i, n), this.handleOnInput(t, a, o));
    },
    handleOnInput: function(t, n, r) {
      if (this.isValueChanged(n, r)) {
        var i, a;
        this.$emit("input", {
          originalEvent: t,
          value: r,
          formattedValue: n
        }), (i = (a = this.formField).onInput) === null || i === void 0 || i.call(a, {
          originalEvent: t,
          value: r
        });
      }
    },
    isValueChanged: function(t, n) {
      if (n === null && t !== null)
        return !0;
      if (n != null) {
        var r = typeof t == "string" ? this.parseValue(t) : t;
        return n !== r;
      }
      return !1;
    },
    validateValue: function(t) {
      return t === "-" || t == null ? null : this.min != null && t < this.min ? this.min : this.max != null && t > this.max ? this.max : t;
    },
    updateInput: function(t, n, r, i) {
      var a;
      n = n || "";
      var o = this.$refs.input.$el.value, s = this.formatValue(t), v = o.length;
      if (s !== i && (s = this.concatValues(s, i)), v === 0) {
        this.$refs.input.$el.value = s, this.$refs.input.$el.setSelectionRange(0, 0);
        var p = this.initCursor(), c = p + n.length;
        this.$refs.input.$el.setSelectionRange(c, c);
      } else {
        var P = this.$refs.input.$el.selectionStart, g = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = s;
        var x = s.length;
        if (r === "range-insert") {
          var E = this.parseValue((o || "").slice(0, P)), O = E !== null ? E.toString() : "", M = O.split("").join("(".concat(this.groupChar, ")?")), I = new RegExp(M, "g");
          I.test(s);
          var S = n.split("").join("(".concat(this.groupChar, ")?")), Z = new RegExp(S, "g");
          Z.test(s.slice(I.lastIndex)), g = I.lastIndex + Z.lastIndex, this.$refs.input.$el.setSelectionRange(g, g);
        } else if (x === v)
          r === "insert" || r === "delete-back-single" ? this.$refs.input.$el.setSelectionRange(g + 1, g + 1) : r === "delete-single" ? this.$refs.input.$el.setSelectionRange(g - 1, g - 1) : (r === "delete-range" || r === "spin") && this.$refs.input.$el.setSelectionRange(g, g);
        else if (r === "delete-back-single") {
          var Q = o.charAt(g - 1), se = o.charAt(g), pe = v - x, ne = this._group.test(se);
          ne && pe === 1 ? g += 1 : !ne && this.isNumeralChar(Q) && (g += -1 * pe + 1), this._group.lastIndex = 0, this.$refs.input.$el.setSelectionRange(g, g);
        } else if (o === "-" && r === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          var fe = this.initCursor(), me = fe + n.length + 1;
          this.$refs.input.$el.setSelectionRange(me, me);
        } else
          g = g + (x - v), this.$refs.input.$el.setSelectionRange(g, g);
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", t), (a = this.$refs.clearIcon) !== null && a !== void 0 && (a = a.$el) !== null && a !== void 0 && a.style && (this.$refs.clearIcon.$el.style.display = kt(s) ? "none" : "block");
    },
    concatValues: function(t, n) {
      if (t && n) {
        var r = n.search(this._decimal);
        return this._decimal.lastIndex = 0, this.suffixChar ? r !== -1 ? t.replace(this.suffixChar, "").split(this._decimal)[0] + n.replace(this.suffixChar, "").slice(r) + this.suffixChar : t : r !== -1 ? t.split(this._decimal)[0] + n.slice(r) : t;
      }
      return t;
    },
    getDecimalLength: function(t) {
      if (t) {
        var n = t.split(this._decimal);
        if (n.length === 2)
          return n[1].replace(this._suffix, "").trim().replace(/\s/g, "").replace(this._currency, "").length;
      }
      return 0;
    },
    updateModel: function(t, n) {
      this.writeValue(n, t);
    },
    onInputFocus: function(t) {
      this.focused = !0, !this.disabled && !this.readonly && this.$refs.input.$el.value !== wt() && this.highlightOnFocus && t.target.select(), this.$emit("focus", t);
    },
    onInputBlur: function(t) {
      var n, r;
      this.focused = !1;
      var i = t.target, a = this.validateValue(this.parseValue(i.value));
      this.$emit("blur", {
        originalEvent: t,
        value: i.value
      }), (n = (r = this.formField).onBlur) === null || n === void 0 || n.call(r, t), i.value = this.formatValue(a), i.setAttribute("aria-valuenow", a), this.updateModel(t, a), !this.disabled && !this.readonly && this.highlightOnFocus && bn();
    },
    clearTimer: function() {
      this.timer && clearTimeout(this.timer);
    },
    maxBoundry: function() {
      return this.d_value >= this.max;
    },
    minBoundry: function() {
      return this.d_value <= this.min;
    }
  },
  computed: {
    upButtonListeners: function() {
      var t = this;
      return {
        mousedown: function(r) {
          return t.onUpButtonMouseDown(r);
        },
        mouseup: function(r) {
          return t.onUpButtonMouseUp(r);
        },
        mouseleave: function(r) {
          return t.onUpButtonMouseLeave(r);
        },
        keydown: function(r) {
          return t.onUpButtonKeyDown(r);
        },
        keyup: function(r) {
          return t.onUpButtonKeyUp(r);
        }
      };
    },
    downButtonListeners: function() {
      var t = this;
      return {
        mousedown: function(r) {
          return t.onDownButtonMouseDown(r);
        },
        mouseup: function(r) {
          return t.onDownButtonMouseUp(r);
        },
        mouseleave: function(r) {
          return t.onDownButtonMouseLeave(r);
        },
        keydown: function(r) {
          return t.onDownButtonKeyDown(r);
        },
        keyup: function(r) {
          return t.onDownButtonKeyUp(r);
        }
      };
    },
    formattedValue: function() {
      var t = !this.d_value && !this.allowEmpty ? 0 : this.d_value;
      return this.formatValue(t);
    },
    getFormatter: function() {
      return this.numberFormat;
    },
    dataP: function() {
      return pt(it(it({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size), this.buttonLayout, this.showButtons && this.buttonLayout));
    }
  },
  components: {
    InputText: Mt,
    AngleUpIcon: Vt,
    AngleDownIcon: Ut,
    TimesIcon: Ot
  }
}, Ur = ["data-p"], Vr = ["data-p"], zr = ["disabled", "data-p"], Kr = ["disabled", "data-p"], Gr = ["disabled", "data-p"], Wr = ["disabled", "data-p"];
function Jr(e, t, n, r, i, a) {
  var o = K("InputText"), s = K("TimesIcon");
  return l(), m("span", k({
    class: e.cx("root")
  }, e.ptmi("root"), {
    "data-p": a.dataP
  }), [w(o, {
    ref: "input",
    id: e.inputId,
    name: e.$formName,
    role: "spinbutton",
    class: L([e.cx("pcInputText"), e.inputClass]),
    style: Dn(e.inputStyle),
    defaultValue: a.formattedValue,
    "aria-valuemin": e.min,
    "aria-valuemax": e.max,
    "aria-valuenow": e.d_value,
    inputmode: e.mode === "decimal" && !e.minFractionDigits ? "numeric" : "decimal",
    disabled: e.disabled,
    readonly: e.readonly,
    placeholder: e.placeholder,
    "aria-labelledby": e.ariaLabelledby,
    "aria-label": e.ariaLabel,
    required: e.required,
    size: e.size,
    invalid: e.invalid,
    variant: e.variant,
    onInput: a.onUserInput,
    onKeydown: a.onInputKeyDown,
    onKeypress: a.onInputKeyPress,
    onPaste: a.onPaste,
    onClick: a.onInputClick,
    onFocus: a.onInputFocus,
    onBlur: a.onInputBlur,
    pt: e.ptm("pcInputText"),
    unstyled: e.unstyled,
    "data-p": a.dataP
  }, null, 8, ["id", "name", "class", "style", "defaultValue", "aria-valuemin", "aria-valuemax", "aria-valuenow", "inputmode", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "required", "size", "invalid", "variant", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur", "pt", "unstyled", "data-p"]), e.showClear && e.buttonLayout !== "vertical" ? F(e.$slots, "clearicon", {
    key: 0,
    class: L(e.cx("clearIcon")),
    clearCallback: a.onClearClick
  }, function() {
    return [w(s, k({
      ref: "clearIcon",
      class: [e.cx("clearIcon")],
      onClick: a.onClearClick
    }, e.ptm("clearIcon")), null, 16, ["class", "onClick"])];
  }) : C("", !0), e.showButtons && e.buttonLayout === "stacked" ? (l(), m("span", k({
    key: 1,
    class: e.cx("buttonGroup")
  }, e.ptm("buttonGroup"), {
    "data-p": a.dataP
  }), [F(e.$slots, "incrementbutton", {
    listeners: a.upButtonListeners
  }, function() {
    return [y("button", k({
      class: [e.cx("incrementButton"), e.incrementButtonClass]
    }, Ue(a.upButtonListeners, !0), {
      disabled: e.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, e.ptm("incrementButton"), {
      "data-p": a.dataP
    }), [F(e.$slots, e.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(l(), $(q(e.incrementIcon || e.incrementButtonIcon ? "span" : "AngleUpIcon"), k({
        class: [e.incrementIcon, e.incrementButtonIcon]
      }, e.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, zr)];
  }), F(e.$slots, "decrementbutton", {
    listeners: a.downButtonListeners
  }, function() {
    return [y("button", k({
      class: [e.cx("decrementButton"), e.decrementButtonClass]
    }, Ue(a.downButtonListeners, !0), {
      disabled: e.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, e.ptm("decrementButton"), {
      "data-p": a.dataP
    }), [F(e.$slots, e.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(l(), $(q(e.decrementIcon || e.decrementButtonIcon ? "span" : "AngleDownIcon"), k({
        class: [e.decrementIcon, e.decrementButtonIcon]
      }, e.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Kr)];
  })], 16, Vr)) : C("", !0), F(e.$slots, "incrementbutton", {
    listeners: a.upButtonListeners
  }, function() {
    return [e.showButtons && e.buttonLayout !== "stacked" ? (l(), m("button", k({
      key: 0,
      class: [e.cx("incrementButton"), e.incrementButtonClass]
    }, Ue(a.upButtonListeners, !0), {
      disabled: e.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, e.ptm("incrementButton"), {
      "data-p": a.dataP
    }), [F(e.$slots, e.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(l(), $(q(e.incrementIcon || e.incrementButtonIcon ? "span" : "AngleUpIcon"), k({
        class: [e.incrementIcon, e.incrementButtonIcon]
      }, e.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, Gr)) : C("", !0)];
  }), F(e.$slots, "decrementbutton", {
    listeners: a.downButtonListeners
  }, function() {
    return [e.showButtons && e.buttonLayout !== "stacked" ? (l(), m("button", k({
      key: 0,
      class: [e.cx("decrementButton"), e.decrementButtonClass]
    }, Ue(a.downButtonListeners, !0), {
      disabled: e.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, e.ptm("decrementButton"), {
      "data-p": a.dataP
    }), [F(e.$slots, e.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(l(), $(q(e.decrementIcon || e.decrementButtonIcon ? "span" : "AngleDownIcon"), k({
        class: [e.decrementIcon, e.decrementButtonIcon]
      }, e.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Wr)) : C("", !0)];
  })], 16, Ur);
}
zt.render = Jr;
var Kt = {
  name: "AngleDoubleRightIcon",
  extends: Re
};
function Hr(e) {
  return Yr(e) || Qr(e) || Zr(e) || qr();
}
function qr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Zr(e, t) {
  if (e) {
    if (typeof e == "string") return st(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? st(e, t) : void 0;
  }
}
function Qr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Yr(e) {
  if (Array.isArray(e)) return st(e);
}
function st(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Xr(e, t, n, r, i, a) {
  return l(), m("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Hr(t[0] || (t[0] = [y("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Kt.render = Xr;
var Gt = {
  name: "AngleLeftIcon",
  extends: Re
};
function ea(e) {
  return aa(e) || ra(e) || na(e) || ta();
}
function ta() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function na(e, t) {
  if (e) {
    if (typeof e == "string") return lt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? lt(e, t) : void 0;
  }
}
function ra(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function aa(e) {
  if (Array.isArray(e)) return lt(e);
}
function lt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ia(e, t, n, r, i, a) {
  return l(), m("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), ea(t[0] || (t[0] = [y("path", {
    d: "M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Gt.render = ia;
var oa = {
  name: "BasePaginator",
  extends: J,
  props: {
    totalRecords: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    pageLinkSize: {
      type: Number,
      default: 5
    },
    rowsPerPageOptions: {
      type: Array,
      default: null
    },
    template: {
      type: [Object, String],
      default: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    },
    currentPageReportTemplate: {
      type: null,
      default: "({currentPage} of {totalPages})"
    },
    alwaysShow: {
      type: Boolean,
      default: !0
    }
  },
  style: cr,
  provide: function() {
    return {
      $pcPaginator: this,
      $parentInstance: this
    };
  }
}, Wt = {
  name: "CurrentPageReport",
  hostName: "Paginator",
  extends: J,
  props: {
    pageCount: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    template: {
      type: String,
      default: "({currentPage} of {totalPages})"
    }
  },
  computed: {
    text: function() {
      var t = this.template.replace("{currentPage}", this.currentPage).replace("{totalPages}", this.pageCount).replace("{first}", this.pageCount > 0 ? this.first + 1 : 0).replace("{last}", Math.min(this.first + this.rows, this.totalRecords)).replace("{rows}", this.rows).replace("{totalRecords}", this.totalRecords);
      return t;
    }
  }
};
function sa(e, t, n, r, i, a) {
  return l(), m("span", k({
    class: e.cx("current")
  }, e.ptm("current")), A(a.text), 17);
}
Wt.render = sa;
var Jt = {
  name: "FirstPageLink",
  hostName: "Paginator",
  extends: J,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      return this.ptm(t, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleDoubleLeftIcon: jt
  },
  directives: {
    ripple: Fe
  }
};
function la(e, t, n, r, i, a) {
  var o = ye("ripple");
  return de((l(), m("button", k({
    class: e.cx("first"),
    type: "button"
  }, a.getPTOptions("first"), {
    "data-pc-group-section": "pagebutton"
  }), [(l(), $(q(n.template || "AngleDoubleLeftIcon"), k({
    class: e.cx("firstIcon")
  }, a.getPTOptions("firstIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
Jt.render = la;
var Ht = {
  name: "JumpToPageDropdown",
  hostName: "Paginator",
  extends: J,
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean,
    templates: null
  },
  methods: {
    onChange: function(t) {
      this.$emit("page-change", t);
    }
  },
  computed: {
    pageOptions: function() {
      for (var t = [], n = 0; n < this.pageCount; n++)
        t.push({
          label: String(n + 1),
          value: n
        });
      return t;
    }
  },
  components: {
    JTPSelect: ft
  }
};
function ua(e, t, n, r, i, a) {
  var o = K("JTPSelect");
  return l(), $(o, {
    modelValue: n.page,
    options: a.pageOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": t[0] || (t[0] = function(s) {
      return a.onChange(s);
    }),
    class: L(e.cx("pcJumpToPageDropdown")),
    disabled: n.disabled,
    unstyled: e.unstyled,
    pt: e.ptm("pcJumpToPageDropdown"),
    "data-pc-group-section": "pagedropdown"
  }, Rt({
    _: 2
  }, [n.templates.jumptopagedropdownicon ? {
    name: "dropdownicon",
    fn: D(function(s) {
      return [(l(), $(q(n.templates.jumptopagedropdownicon), {
        class: L(s.class)
      }, null, 8, ["class"]))];
    }),
    key: "0"
  } : void 0]), 1032, ["modelValue", "options", "class", "disabled", "unstyled", "pt"]);
}
Ht.render = ua;
var qt = {
  name: "JumpToPageInput",
  hostName: "Paginator",
  extends: J,
  inheritAttrs: !1,
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean
  },
  data: function() {
    return {
      d_page: this.page
    };
  },
  watch: {
    page: function(t) {
      this.d_page = t;
    }
  },
  methods: {
    onChange: function(t) {
      t !== this.page && (this.d_page = t, this.$emit("page-change", t - 1));
    }
  },
  computed: {
    inputArialabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.jumpToPageInputLabel : void 0;
    }
  },
  components: {
    JTPInput: zt
  }
};
function da(e, t, n, r, i, a) {
  var o = K("JTPInput");
  return l(), $(o, {
    ref: "jtpInput",
    modelValue: i.d_page,
    class: L(e.cx("pcJumpToPageInputText")),
    "aria-label": a.inputArialabel,
    disabled: n.disabled,
    "onUpdate:modelValue": a.onChange,
    unstyled: e.unstyled,
    pt: e.ptm("pcJumpToPageInputText")
  }, null, 8, ["modelValue", "class", "aria-label", "disabled", "onUpdate:modelValue", "unstyled", "pt"]);
}
qt.render = da;
var Zt = {
  name: "LastPageLink",
  hostName: "Paginator",
  extends: J,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      return this.ptm(t, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleDoubleRightIcon: Kt
  },
  directives: {
    ripple: Fe
  }
};
function ca(e, t, n, r, i, a) {
  var o = ye("ripple");
  return de((l(), m("button", k({
    class: e.cx("last"),
    type: "button"
  }, a.getPTOptions("last"), {
    "data-pc-group-section": "pagebutton"
  }), [(l(), $(q(n.template || "AngleDoubleRightIcon"), k({
    class: e.cx("lastIcon")
  }, a.getPTOptions("lastIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
Zt.render = ca;
var Qt = {
  name: "NextPageLink",
  hostName: "Paginator",
  extends: J,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      return this.ptm(t, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleRightIcon: vn
  },
  directives: {
    ripple: Fe
  }
};
function pa(e, t, n, r, i, a) {
  var o = ye("ripple");
  return de((l(), m("button", k({
    class: e.cx("next"),
    type: "button"
  }, a.getPTOptions("next"), {
    "data-pc-group-section": "pagebutton"
  }), [(l(), $(q(n.template || "AngleRightIcon"), k({
    class: e.cx("nextIcon")
  }, a.getPTOptions("nextIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
Qt.render = pa;
var Yt = {
  name: "PageLinks",
  hostName: "Paginator",
  extends: J,
  inheritAttrs: !1,
  emits: ["click"],
  props: {
    value: Array,
    page: Number
  },
  methods: {
    getPTOptions: function(t, n) {
      return this.ptm(n, {
        context: {
          active: t === this.page
        }
      });
    },
    onPageLinkClick: function(t, n) {
      this.$emit("click", {
        originalEvent: t,
        value: n
      });
    },
    ariaPageLabel: function(t) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.pageLabel.replace(/{page}/g, t) : void 0;
    }
  },
  directives: {
    ripple: Fe
  }
}, fa = ["aria-label", "aria-current", "onClick", "data-p-active"];
function ma(e, t, n, r, i, a) {
  var o = ye("ripple");
  return l(), m("span", k({
    class: e.cx("pages")
  }, e.ptm("pages")), [(l(!0), m(ee, null, ve(n.value, function(s) {
    return de((l(), m("button", k({
      key: s,
      class: e.cx("page", {
        pageLink: s
      }),
      type: "button",
      "aria-label": a.ariaPageLabel(s),
      "aria-current": s - 1 === n.page ? "page" : void 0,
      onClick: function(p) {
        return a.onPageLinkClick(p, s);
      }
    }, {
      ref_for: !0
    }, a.getPTOptions(s - 1, "page"), {
      "data-p-active": s - 1 === n.page
    }), [be(A(s), 1)], 16, fa)), [[o]]);
  }), 128))], 16);
}
Yt.render = ma;
var Xt = {
  name: "PrevPageLink",
  hostName: "Paginator",
  extends: J,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      return this.ptm(t, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  components: {
    AngleLeftIcon: Gt
  },
  directives: {
    ripple: Fe
  }
};
function ga(e, t, n, r, i, a) {
  var o = ye("ripple");
  return de((l(), m("button", k({
    class: e.cx("prev"),
    type: "button"
  }, a.getPTOptions("prev"), {
    "data-pc-group-section": "pagebutton"
  }), [(l(), $(q(n.template || "AngleLeftIcon"), k({
    class: e.cx("prevIcon")
  }, a.getPTOptions("prevIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
Xt.render = ga;
var en = {
  name: "RowsPerPageDropdown",
  hostName: "Paginator",
  extends: J,
  emits: ["rows-change"],
  props: {
    options: Array,
    rows: Number,
    disabled: Boolean,
    templates: null
  },
  methods: {
    onChange: function(t) {
      this.$emit("rows-change", t);
    }
  },
  computed: {
    rowsOptions: function() {
      var t = [];
      if (this.options)
        for (var n = 0; n < this.options.length; n++)
          t.push({
            label: String(this.options[n]),
            value: this.options[n]
          });
      return t;
    }
  },
  components: {
    RPPSelect: ft
  }
};
function ha(e, t, n, r, i, a) {
  var o = K("RPPSelect");
  return l(), $(o, {
    modelValue: n.rows,
    options: a.rowsOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": t[0] || (t[0] = function(s) {
      return a.onChange(s);
    }),
    class: L(e.cx("pcRowPerPageDropdown")),
    disabled: n.disabled,
    unstyled: e.unstyled,
    pt: e.ptm("pcRowPerPageDropdown"),
    "data-pc-group-section": "pagedropdown"
  }, Rt({
    _: 2
  }, [n.templates.rowsperpagedropdownicon ? {
    name: "dropdownicon",
    fn: D(function(s) {
      return [(l(), $(q(n.templates.rowsperpagedropdownicon), {
        class: L(s.class)
      }, null, 8, ["class"]))];
    }),
    key: "0"
  } : void 0]), 1032, ["modelValue", "options", "class", "disabled", "unstyled", "pt"]);
}
en.render = ha;
function ut(e) {
  "@babel/helpers - typeof";
  return ut = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ut(e);
}
function It(e, t) {
  return wa(e) || ya(e, t) || va(e, t) || ba();
}
function ba() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function va(e, t) {
  if (e) {
    if (typeof e == "string") return Lt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Lt(e, t) : void 0;
  }
}
function Lt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ya(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, i, a, o, s = [], v = !0, p = !1;
    try {
      if (a = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        v = !1;
      } else for (; !(v = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); v = !0) ;
    } catch (c) {
      p = !0, i = c;
    } finally {
      try {
        if (!v && n.return != null && (o = n.return(), Object(o) !== o)) return;
      } finally {
        if (p) throw i;
      }
    }
    return s;
  }
}
function wa(e) {
  if (Array.isArray(e)) return e;
}
var tn = {
  name: "Paginator",
  extends: oa,
  inheritAttrs: !1,
  emits: ["update:first", "update:rows", "page"],
  data: function() {
    return {
      d_first: this.first,
      d_rows: this.rows
    };
  },
  watch: {
    first: function(t) {
      this.d_first = t;
    },
    rows: function(t) {
      this.d_rows = t;
    },
    totalRecords: function(t) {
      this.page > 0 && t && this.d_first >= t && this.changePage(this.pageCount - 1);
    }
  },
  mounted: function() {
    this.createStyle();
  },
  methods: {
    changePage: function(t) {
      var n = this.pageCount;
      if (t >= 0 && t < n) {
        this.d_first = this.d_rows * t;
        var r = {
          page: t,
          first: this.d_first,
          rows: this.d_rows,
          pageCount: n
        };
        this.$emit("update:first", this.d_first), this.$emit("update:rows", this.d_rows), this.$emit("page", r);
      }
    },
    changePageToFirst: function(t) {
      this.isFirstPage || this.changePage(0), t.preventDefault();
    },
    changePageToPrev: function(t) {
      this.changePage(this.page - 1), t.preventDefault();
    },
    changePageLink: function(t) {
      this.changePage(t.value - 1), t.originalEvent.preventDefault();
    },
    changePageToNext: function(t) {
      this.changePage(this.page + 1), t.preventDefault();
    },
    changePageToLast: function(t) {
      this.isLastPage || this.changePage(this.pageCount - 1), t.preventDefault();
    },
    onRowChange: function(t) {
      this.d_rows = t, this.changePage(this.page);
    },
    createStyle: function() {
      var t = this;
      if (this.hasBreakpoints() && !this.isUnstyled) {
        var n;
        this.styleElement = document.createElement("style"), this.styleElement.type = "text/css", yn(this.styleElement, "nonce", (n = this.$primevue) === null || n === void 0 || (n = n.config) === null || n === void 0 || (n = n.csp) === null || n === void 0 ? void 0 : n.nonce), document.body.appendChild(this.styleElement);
        var r = "", i = Object.keys(this.template), a = {};
        i.sort(function(E, O) {
          return parseInt(E) - parseInt(O);
        }).forEach(function(E) {
          a[E] = t.template[E];
        });
        for (var o = 0, s = Object.entries(Object.entries(a)); o < s.length; o++) {
          var v = It(s[o], 2), p = v[0], c = It(v[1], 1), P = c[0], g = void 0, x = void 0;
          P !== "default" && typeof Object.keys(a)[p - 1] == "string" ? x = Number(Object.keys(a)[p - 1].slice(0, -2)) + 1 + "px" : x = Object.keys(a)[p - 1], g = Object.entries(a)[p - 1] ? "and (min-width:".concat(x, ")") : "", P === "default" ? r += `
                            @media screen `.concat(g, ` {
                                .p-paginator[`).concat(this.$attrSelector, `],
                                    display: flex;
                                }
                            }
                        `) : r += `
.p-paginator-`.concat(P, ` {
    display: none;
}
@media screen `).concat(g, " and (max-width: ").concat(P, `) {
    .p-paginator-`).concat(P, ` {
        display: flex;
    }

    .p-paginator-default{
        display: none;
    }
}
                    `);
        }
        this.styleElement.innerHTML = r;
      }
    },
    hasBreakpoints: function() {
      return ut(this.template) === "object";
    },
    getAriaLabel: function(t) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria[t] : void 0;
    }
  },
  computed: {
    templateItems: function() {
      var t = {};
      if (this.hasBreakpoints()) {
        t = this.template, t.default || (t.default = "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown");
        for (var n in t)
          t[n] = this.template[n].split(" ").map(function(r) {
            return r.trim();
          });
        return t;
      }
      return t.default = this.template.split(" ").map(function(r) {
        return r.trim();
      }), t;
    },
    page: function() {
      return Math.floor(this.d_first / this.d_rows);
    },
    pageCount: function() {
      return Math.ceil(this.totalRecords / this.d_rows);
    },
    isFirstPage: function() {
      return this.page === 0;
    },
    isLastPage: function() {
      return this.page === this.pageCount - 1;
    },
    calculatePageLinkBoundaries: function() {
      var t = this.pageCount, n = Math.min(this.pageLinkSize, t), r = Math.max(0, Math.ceil(this.page - n / 2)), i = Math.min(t - 1, r + n - 1), a = this.pageLinkSize - (i - r + 1);
      return r = Math.max(0, r - a), [r, i];
    },
    pageLinks: function() {
      for (var t = [], n = this.calculatePageLinkBoundaries, r = n[0], i = n[1], a = r; a <= i; a++)
        t.push(a + 1);
      return t;
    },
    currentState: function() {
      return {
        page: this.page,
        first: this.d_first,
        rows: this.d_rows
      };
    },
    empty: function() {
      return this.pageCount === 0;
    },
    currentPage: function() {
      return this.pageCount > 0 ? this.page + 1 : 0;
    },
    last: function() {
      return Math.min(this.d_first + this.rows, this.totalRecords);
    }
  },
  components: {
    CurrentPageReport: Wt,
    FirstPageLink: Jt,
    LastPageLink: Zt,
    NextPageLink: Qt,
    PageLinks: Yt,
    PrevPageLink: Xt,
    RowsPerPageDropdown: en,
    JumpToPageDropdown: Ht,
    JumpToPageInput: qt
  }
};
function ka(e, t, n, r, i, a) {
  var o = K("FirstPageLink"), s = K("PrevPageLink"), v = K("NextPageLink"), p = K("LastPageLink"), c = K("PageLinks"), P = K("CurrentPageReport"), g = K("RowsPerPageDropdown"), x = K("JumpToPageDropdown"), E = K("JumpToPageInput");
  return e.alwaysShow || a.pageLinks && a.pageLinks.length > 1 ? (l(), m("nav", Bn(k({
    key: 0
  }, e.ptmi("paginatorContainer"))), [(l(!0), m(ee, null, ve(a.templateItems, function(O, M) {
    return l(), m("div", k({
      key: M,
      ref_for: !0,
      ref: "paginator",
      class: e.cx("paginator", {
        key: M
      })
    }, {
      ref_for: !0
    }, e.ptm("root")), [e.$slots.container ? F(e.$slots, "container", {
      key: 0,
      first: i.d_first + 1,
      last: a.last,
      rows: i.d_rows,
      page: a.page,
      pageCount: a.pageCount,
      pageLinks: a.pageLinks,
      totalRecords: e.totalRecords,
      firstPageCallback: a.changePageToFirst,
      lastPageCallback: a.changePageToLast,
      prevPageCallback: a.changePageToPrev,
      nextPageCallback: a.changePageToNext,
      rowChangeCallback: a.onRowChange,
      changePageCallback: a.changePage
    }) : (l(), m(ee, {
      key: 1
    }, [e.$slots.start ? (l(), m("div", k({
      key: 0,
      class: e.cx("contentStart")
    }, {
      ref_for: !0
    }, e.ptm("contentStart")), [F(e.$slots, "start", {
      state: a.currentState
    })], 16)) : C("", !0), y("div", k({
      class: e.cx("content")
    }, {
      ref_for: !0
    }, e.ptm("content")), [(l(!0), m(ee, null, ve(O, function(I) {
      return l(), m(ee, {
        key: I
      }, [I === "FirstPageLink" ? (l(), $(o, {
        key: 0,
        "aria-label": a.getAriaLabel("firstPageLabel"),
        template: e.$slots.firsticon || e.$slots.firstpagelinkicon,
        onClick: t[0] || (t[0] = function(S) {
          return a.changePageToFirst(S);
        }),
        disabled: a.isFirstPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "PrevPageLink" ? (l(), $(s, {
        key: 1,
        "aria-label": a.getAriaLabel("prevPageLabel"),
        template: e.$slots.previcon || e.$slots.prevpagelinkicon,
        onClick: t[1] || (t[1] = function(S) {
          return a.changePageToPrev(S);
        }),
        disabled: a.isFirstPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "NextPageLink" ? (l(), $(v, {
        key: 2,
        "aria-label": a.getAriaLabel("nextPageLabel"),
        template: e.$slots.nexticon || e.$slots.nextpagelinkicon,
        onClick: t[2] || (t[2] = function(S) {
          return a.changePageToNext(S);
        }),
        disabled: a.isLastPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "LastPageLink" ? (l(), $(p, {
        key: 3,
        "aria-label": a.getAriaLabel("lastPageLabel"),
        template: e.$slots.lasticon || e.$slots.lastpagelinkicon,
        onClick: t[3] || (t[3] = function(S) {
          return a.changePageToLast(S);
        }),
        disabled: a.isLastPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "PageLinks" ? (l(), $(c, {
        key: 4,
        "aria-label": a.getAriaLabel("pageLabel"),
        value: a.pageLinks,
        page: a.page,
        onClick: t[4] || (t[4] = function(S) {
          return a.changePageLink(S);
        }),
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "value", "page", "unstyled", "pt"])) : I === "CurrentPageReport" ? (l(), $(P, {
        key: 5,
        "aria-live": "polite",
        template: e.currentPageReportTemplate,
        currentPage: a.currentPage,
        page: a.page,
        pageCount: a.pageCount,
        first: i.d_first,
        rows: i.d_rows,
        totalRecords: e.totalRecords,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["template", "currentPage", "page", "pageCount", "first", "rows", "totalRecords", "unstyled", "pt"])) : I === "RowsPerPageDropdown" && e.rowsPerPageOptions ? (l(), $(g, {
        key: 6,
        "aria-label": a.getAriaLabel("rowsPerPageLabel"),
        rows: i.d_rows,
        options: e.rowsPerPageOptions,
        onRowsChange: t[5] || (t[5] = function(S) {
          return a.onRowChange(S);
        }),
        disabled: a.empty,
        templates: e.$slots,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "rows", "options", "disabled", "templates", "unstyled", "pt"])) : I === "JumpToPageDropdown" ? (l(), $(x, {
        key: 7,
        "aria-label": a.getAriaLabel("jumpToPageDropdownLabel"),
        page: a.page,
        pageCount: a.pageCount,
        onPageChange: t[6] || (t[6] = function(S) {
          return a.changePage(S);
        }),
        disabled: a.empty,
        templates: e.$slots,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "page", "pageCount", "disabled", "templates", "unstyled", "pt"])) : I === "JumpToPageInput" ? (l(), $(E, {
        key: 8,
        page: a.currentPage,
        onPageChange: t[7] || (t[7] = function(S) {
          return a.changePage(S);
        }),
        disabled: a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["page", "disabled", "unstyled", "pt"])) : C("", !0)], 64);
    }), 128))], 16), e.$slots.end ? (l(), m("div", k({
      key: 1,
      class: e.cx("contentEnd")
    }, {
      ref_for: !0
    }, e.ptm("contentEnd")), [F(e.$slots, "end", {
      state: a.currentState
    })], 16)) : C("", !0)], 64))], 16);
  }), 128))], 16)) : C("", !0);
}
tn.render = ka;
function Ce(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Pa(e, t) {
  return e;
}
function xa(e, t, n) {
  if (t !== void 0 && !t) return null;
  const r = Ce(e) ? e : {}, i = [
    r,
    Ce(r.data) ? r.data : null,
    Ce(r.payload) ? r.payload : null,
    Ce(r.detail) ? r.detail : null
  ].filter(Boolean);
  for (const a of i) {
    if (a.event !== "component.meta.changed" && a.event !== "component.deleting" && a.event !== "component.deleted") continue;
    const o = String(a.component_id || ""), s = String(r.topic || a.topic || "");
    if (t === void 0) {
      if (!o && (!s.startsWith("component.") || s === "component.")) continue;
    } else if (o && o !== t || !o && s !== `component.${t}`) continue;
    const v = o || t || s.slice(10);
    return a.event === "component.deleting" && typeof a.deletion_job_id == "string" && a.deletion_job_id ? { event: a.event, component_id: v, deletion_job_id: a.deletion_job_id } : a.event !== "component.meta.changed" ? { event: a.event, component_id: v } : {
      event: "component.meta.changed",
      component_id: v,
      meta: Pa(Ce(a.meta) ? a.meta : {}),
      deleted: Array.isArray(a.deleted) ? a.deleted.map(String) : []
    };
  }
  return null;
}
function Ca(e, t, n) {
  const r = xa(e, t);
  return r?.event === "component.meta.changed" ? r : null;
}
function $a(e, t, n) {
  if (!e) return null;
  const r = Nn(`component.${e}`, (i) => {
    const a = Ca(i, e);
    a && t(a);
  });
  return typeof r == "function" ? r : null;
}
function Sa(e) {
  if (!e) return null;
  let t;
  if (typeof e == "number")
    t = e;
  else {
    const n = e.trim();
    if (/^\d+$/.test(n))
      t = Number(n);
    else {
      const r = Date.parse(n);
      return Number.isNaN(r) ? null : r;
    }
  }
  return Number.isFinite(t) ? t < 1e12 ? t * 1e3 : t : null;
}
function nn(e) {
  const t = Sa(e);
  return t === null ? "" : new Date(t).toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
var Ia = ue.extend({
  name: "focustrap-directive"
}), La = kn.extend({
  style: Ia
});
function De(e) {
  "@babel/helpers - typeof";
  return De = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, De(e);
}
function Tt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function At(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Tt(Object(n), !0).forEach(function(r) {
      Ta(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Tt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Ta(e, t, n) {
  return (t = Aa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Aa(e) {
  var t = Da(e, "string");
  return De(t) == "symbol" ? t : t + "";
}
function Da(e, t) {
  if (De(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (De(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ba = La.extend("focustrap", {
  mounted: function(t, n) {
    var r = n.value || {}, i = r.disabled;
    i || (this.createHiddenFocusableElements(t, n), this.bind(t, n), this.autoElementFocus(t, n)), t.setAttribute("data-pd-focustrap", !0), this.$el = t;
  },
  updated: function(t, n) {
    var r = n.value || {}, i = r.disabled;
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
      var r = this, i = n.value || {}, a = i.onFocusIn, o = i.onFocusOut;
      t.$_pfocustrap_mutationobserver = new MutationObserver(function(s) {
        s.forEach(function(v) {
          if (v.type === "childList" && !t.contains(document.activeElement)) {
            var p = function(P) {
              var g = Pt(P) ? Pt(P, r.getComputedSelector(t.$_pfocustrap_focusableselector)) ? P : xe(t, r.getComputedSelector(t.$_pfocustrap_focusableselector)) : xe(P);
              return et(g) ? g : P.nextSibling && p(P.nextSibling);
            };
            Ie(p(v.nextSibling));
          }
        });
      }), t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_mutationobserver.observe(t, {
        childList: !0
      }), t.$_pfocustrap_focusinlistener = function(s) {
        return a && a(s);
      }, t.$_pfocustrap_focusoutlistener = function(s) {
        return o && o(s);
      }, t.addEventListener("focusin", t.$_pfocustrap_focusinlistener), t.addEventListener("focusout", t.$_pfocustrap_focusoutlistener);
    },
    unbind: function(t) {
      t.$_pfocustrap_mutationobserver && t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_focusinlistener && t.removeEventListener("focusin", t.$_pfocustrap_focusinlistener) && (t.$_pfocustrap_focusinlistener = null), t.$_pfocustrap_focusoutlistener && t.removeEventListener("focusout", t.$_pfocustrap_focusoutlistener) && (t.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(t) {
      this.autoElementFocus(this.$el, {
        value: At(At({}, t), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(t, n) {
      var r = n.value || {}, i = r.autoFocusSelector, a = i === void 0 ? "" : i, o = r.firstFocusableSelector, s = o === void 0 ? "" : o, v = r.autoFocus, p = v === void 0 ? !1 : v, c = xe(t, "[autofocus]".concat(this.getComputedSelector(a)));
      p && !c && (c = xe(t, this.getComputedSelector(s))), Ie(c);
    },
    onFirstHiddenElementFocus: function(t) {
      var n, r = t.currentTarget, i = t.relatedTarget, a = i === r.$_pfocustrap_lasthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? xe(r.parentElement, this.getComputedSelector(r.$_pfocustrap_focusableselector)) : r.$_pfocustrap_lasthiddenfocusableelement;
      Ie(a);
    },
    onLastHiddenElementFocus: function(t) {
      var n, r = t.currentTarget, i = t.relatedTarget, a = i === r.$_pfocustrap_firsthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? wn(r.parentElement, this.getComputedSelector(r.$_pfocustrap_focusableselector)) : r.$_pfocustrap_firsthiddenfocusableelement;
      Ie(a);
    },
    createHiddenFocusableElements: function(t, n) {
      var r = this, i = n.value || {}, a = i.tabIndex, o = a === void 0 ? 0 : a, s = i.firstFocusableSelector, v = s === void 0 ? "" : s, p = i.lastFocusableSelector, c = p === void 0 ? "" : p, P = function(O) {
        return Pn("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: o,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: O?.bind(r)
        });
      }, g = P(this.onFirstHiddenElementFocus), x = P(this.onLastHiddenElementFocus);
      g.$_pfocustrap_lasthiddenfocusableelement = x, g.$_pfocustrap_focusableselector = v, g.setAttribute("data-pc-section", "firstfocusableelement"), x.$_pfocustrap_firsthiddenfocusableelement = g, x.$_pfocustrap_focusableselector = c, x.setAttribute("data-pc-section", "lastfocusableelement"), t.prepend(g), t.append(x);
    }
  }
});
function Ea() {
  Cn({
    variableName: Et("scrollbar.width").name
  });
}
function Ra() {
  xn({
    variableName: Et("scrollbar.width").name
  });
}
var Fa = `
    .p-drawer {
        display: flex;
        flex-direction: column;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
        transition: transform 0.3s;
        background: dt('drawer.background');
        color: dt('drawer.color');
        border-style: solid;
        border-color: dt('drawer.border.color');
        box-shadow: dt('drawer.shadow');
    }

    .p-drawer-content {
        overflow-y: auto;
        flex-grow: 1;
        padding: dt('drawer.content.padding');
    }

    .p-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('drawer.header.padding');
    }

    .p-drawer-footer {
        padding: dt('drawer.footer.padding');
    }

    .p-drawer-title {
        font-weight: dt('drawer.title.font.weight');
        font-size: dt('drawer.title.font.size');
    }

    .p-drawer-full .p-drawer {
        transition: none;
        transform: none;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100%;
        top: 0px !important;
        left: 0px !important;
        border-width: 1px;
    }

    .p-drawer-left .p-drawer-enter-active {
        animation: p-animate-drawer-enter-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-left .p-drawer-leave-active {
        animation: p-animate-drawer-leave-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-right .p-drawer-enter-active {
        animation: p-animate-drawer-enter-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-right .p-drawer-leave-active {
        animation: p-animate-drawer-leave-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-top .p-drawer-enter-active {
        animation: p-animate-drawer-enter-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-top .p-drawer-leave-active {
        animation: p-animate-drawer-leave-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-bottom .p-drawer-enter-active {
        animation: p-animate-drawer-enter-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-bottom .p-drawer-leave-active {
        animation: p-animate-drawer-leave-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-full .p-drawer-enter-active {
        animation: p-animate-drawer-enter-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-full .p-drawer-leave-active {
        animation: p-animate-drawer-leave-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-left .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-end-width: 1px;
    }

    .p-drawer-right .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-start-width: 1px;
    }

    .p-drawer-top .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-end-width: 1px;
    }

    .p-drawer-bottom .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-start-width: 1px;
    }

    .p-drawer-left .p-drawer-content,
    .p-drawer-right .p-drawer-content,
    .p-drawer-top .p-drawer-content,
    .p-drawer-bottom .p-drawer-content {
        width: 100%;
        height: 100%;
    }

    .p-drawer-open {
        display: flex;
    }

    .p-drawer-mask:dir(rtl) {
        flex-direction: row-reverse;
    }

    @keyframes p-animate-drawer-enter-left {
        from {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-left {
        to {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-right {
        from {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-right {
        to {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-top {
        from {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-top {
        to {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-bottom {
        from {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-bottom {
        to {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-full {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-drawer-leave-full {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`, Oa = {
  mask: function(t) {
    var n = t.position, r = t.modal;
    return {
      position: "fixed",
      height: "100%",
      width: "100%",
      left: 0,
      top: 0,
      display: "flex",
      justifyContent: n === "left" ? "flex-start" : n === "right" ? "flex-end" : "center",
      alignItems: n === "top" ? "flex-start" : n === "bottom" ? "flex-end" : "center",
      pointerEvents: r ? "auto" : "none"
    };
  },
  root: {
    pointerEvents: "auto"
  }
}, Ma = {
  mask: function(t) {
    var n = t.instance, r = t.props, i = ["left", "right", "top", "bottom"], a = i.find(function(o) {
      return o === r.position;
    });
    return ["p-drawer-mask", {
      "p-overlay-mask p-overlay-mask-enter-active": r.modal,
      "p-drawer-open": n.containerVisible,
      "p-drawer-full": n.fullScreen
    }, a ? "p-drawer-".concat(a) : ""];
  },
  root: function(t) {
    var n = t.instance;
    return ["p-drawer p-component", {
      "p-drawer-full": n.fullScreen
    }];
  },
  header: "p-drawer-header",
  title: "p-drawer-title",
  pcCloseButton: "p-drawer-close-button",
  content: "p-drawer-content",
  footer: "p-drawer-footer"
}, _a = ue.extend({
  name: "drawer",
  style: Fa,
  classes: Ma,
  inlineStyles: Oa
}), Na = {
  name: "BaseDrawer",
  extends: J,
  props: {
    visible: {
      type: Boolean,
      default: !1
    },
    position: {
      type: String,
      default: "left"
    },
    header: {
      type: null,
      default: null
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    autoZIndex: {
      type: Boolean,
      default: !0
    },
    dismissable: {
      type: Boolean,
      default: !0
    },
    showCloseIcon: {
      type: Boolean,
      default: !0
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
    closeIcon: {
      type: String,
      default: void 0
    },
    modal: {
      type: Boolean,
      default: !0
    },
    blockScroll: {
      type: Boolean,
      default: !1
    },
    closeOnEscape: {
      type: Boolean,
      default: !0
    }
  },
  style: _a,
  provide: function() {
    return {
      $pcDrawer: this,
      $parentInstance: this
    };
  }
};
function Be(e) {
  "@babel/helpers - typeof";
  return Be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Be(e);
}
function Ye(e, t, n) {
  return (t = ja(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ja(e) {
  var t = Ua(e, "string");
  return Be(t) == "symbol" ? t : t + "";
}
function Ua(e, t) {
  if (Be(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Be(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var rn = {
  name: "Drawer",
  extends: Na,
  inheritAttrs: !1,
  emits: ["update:visible", "show", "after-show", "hide", "after-hide", "before-hide"],
  data: function() {
    return {
      containerVisible: this.visible
    };
  },
  container: null,
  mask: null,
  content: null,
  headerContainer: null,
  footerContainer: null,
  closeButton: null,
  outsideClickListener: null,
  documentKeydownListener: null,
  watch: {
    dismissable: function(t) {
      t && !this.modal ? this.bindOutsideClickListener() : this.unbindOutsideClickListener();
    }
  },
  updated: function() {
    this.visible && (this.containerVisible = this.visible);
  },
  beforeUnmount: function() {
    this.disableDocumentSettings(), this.mask && this.autoZIndex && Qe.clear(this.mask), this.container = null, this.mask = null;
  },
  methods: {
    hide: function() {
      this.$emit("update:visible", !1);
    },
    onEnter: function() {
      this.$emit("show"), this.focus(), this.bindDocumentKeyDownListener(), this.autoZIndex && Qe.set("modal", this.mask, this.baseZIndex || this.$primevue.config.zIndex.modal);
    },
    onAfterEnter: function() {
      this.enableDocumentSettings(), this.$emit("after-show");
    },
    onBeforeLeave: function() {
      this.modal && !this.isUnstyled && Sn(this.mask, "p-overlay-mask-leave-active"), this.$emit("before-hide");
    },
    onLeave: function() {
      this.$emit("hide");
    },
    onAfterLeave: function() {
      this.autoZIndex && Qe.clear(this.mask), this.unbindDocumentKeyDownListener(), this.containerVisible = !1, this.disableDocumentSettings(), this.$emit("after-hide");
    },
    onMaskClick: function(t) {
      this.dismissable && this.modal && this.mask === t.target && this.hide();
    },
    focus: function() {
      var t = function(i) {
        return i && i.querySelector("[autofocus]");
      }, n = this.$slots.header && t(this.headerContainer);
      n || (n = this.$slots.default && t(this.container), n || (n = this.$slots.footer && t(this.footerContainer), n || (n = this.closeButton))), n && Ie(n);
    },
    enableDocumentSettings: function() {
      this.dismissable && !this.modal && this.bindOutsideClickListener(), this.blockScroll && Ea();
    },
    disableDocumentSettings: function() {
      this.unbindOutsideClickListener(), this.blockScroll && Ra();
    },
    onKeydown: function(t) {
      t.code === "Escape" && this.closeOnEscape && this.hide();
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
    closeButtonRef: function(t) {
      this.closeButton = t ? t.$el : void 0;
    },
    bindDocumentKeyDownListener: function() {
      this.documentKeydownListener || (this.documentKeydownListener = this.onKeydown, document.addEventListener("keydown", this.documentKeydownListener));
    },
    unbindDocumentKeyDownListener: function() {
      this.documentKeydownListener && (document.removeEventListener("keydown", this.documentKeydownListener), this.documentKeydownListener = null);
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        t.isOutsideClicked(n) && t.hide();
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    isOutsideClicked: function(t) {
      return this.container && !this.container.contains(t.target);
    }
  },
  computed: {
    fullScreen: function() {
      return this.position === "full";
    },
    closeAriaLabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : void 0;
    },
    dataP: function() {
      return pt(Ye(Ye(Ye({
        "full-screen": this.position === "full"
      }, this.position, this.position), "open", this.containerVisible), "modal", this.modal));
    }
  },
  directives: {
    focustrap: Ba
  },
  components: {
    Button: U,
    Portal: $n,
    TimesIcon: Ot
  }
}, Va = ["data-p"], za = ["role", "aria-modal", "data-p"];
function Ka(e, t, n, r, i, a) {
  var o = K("Button"), s = K("Portal"), v = ye("focustrap");
  return l(), $(s, null, {
    default: D(function() {
      return [i.containerVisible ? (l(), m("div", k({
        key: 0,
        ref: a.maskRef,
        onMousedown: t[0] || (t[0] = function() {
          return a.onMaskClick && a.onMaskClick.apply(a, arguments);
        }),
        class: e.cx("mask"),
        style: e.sx("mask", !0, {
          position: e.position,
          modal: e.modal
        }),
        "data-p": a.dataP
      }, e.ptm("mask")), [w(En, k({
        name: "p-drawer",
        onEnter: a.onEnter,
        onAfterEnter: a.onAfterEnter,
        onBeforeLeave: a.onBeforeLeave,
        onLeave: a.onLeave,
        onAfterLeave: a.onAfterLeave,
        appear: ""
      }, e.ptm("transition")), {
        default: D(function() {
          return [e.visible ? de((l(), m("div", k({
            key: 0,
            ref: a.containerRef,
            class: e.cx("root"),
            style: e.sx("root"),
            role: e.modal ? "dialog" : "complementary",
            "aria-modal": e.modal ? !0 : void 0,
            "data-p": a.dataP
          }, e.ptmi("root")), [e.$slots.container ? F(e.$slots, "container", {
            key: 0,
            closeCallback: a.hide
          }) : (l(), m(ee, {
            key: 1
          }, [y("div", k({
            ref: a.headerContainerRef,
            class: e.cx("header")
          }, e.ptm("header")), [F(e.$slots, "header", {
            class: L(e.cx("title"))
          }, function() {
            return [e.header ? (l(), m("div", k({
              key: 0,
              class: e.cx("title")
            }, e.ptm("title")), A(e.header), 17)) : C("", !0)];
          }), e.showCloseIcon ? F(e.$slots, "closebutton", {
            key: 0,
            closeCallback: a.hide
          }, function() {
            return [w(o, k({
              ref: a.closeButtonRef,
              type: "button",
              class: e.cx("pcCloseButton"),
              "aria-label": a.closeAriaLabel,
              unstyled: e.unstyled,
              onClick: a.hide
            }, e.closeButtonProps, {
              pt: e.ptm("pcCloseButton"),
              "data-pc-group-section": "iconcontainer"
            }), {
              icon: D(function(p) {
                return [F(e.$slots, "closeicon", {}, function() {
                  return [(l(), $(q(e.closeIcon ? "span" : "TimesIcon"), k({
                    class: [e.closeIcon, p.class]
                  }, e.ptm("pcCloseButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["class", "aria-label", "unstyled", "onClick", "pt"])];
          }) : C("", !0)], 16), y("div", k({
            ref: a.contentRef,
            class: e.cx("content")
          }, e.ptm("content")), [F(e.$slots, "default")], 16), e.$slots.footer ? (l(), m("div", k({
            key: 0,
            ref: a.footerContainerRef,
            class: e.cx("footer")
          }, e.ptm("footer")), [F(e.$slots, "footer")], 16)) : C("", !0)], 64))], 16, za)), [[v]]) : C("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])], 16, Va)) : C("", !0)];
    }),
    _: 3
  });
}
rn.render = Ka;
function dt(e) {
  const t = e || "";
  return t.startsWith("image/") ? "tabler:photo" : t === "application/pdf" ? "tabler:file-type-pdf" : t.includes("word") || t.includes("opendocument.text") || t === "application/rtf" ? "tabler:file-type-doc" : t.includes("sheet") || t.includes("excel") || t.includes("spreadsheet") || t === "text/csv" ? "tabler:file-type-xls" : t.includes("presentation") || t.includes("powerpoint") ? "tabler:file-type-ppt" : t === "application/epub+zip" ? "tabler:book" : t.startsWith("text/") || t === "application/json" || t === "application/xml" ? "tabler:file-text" : "tabler:file";
}
function Ee(e) {
  if (!e) return "0 B";
  const t = ["B", "KB", "MB", "GB"], n = Math.min(Math.floor(Math.log(e) / Math.log(1024)), t.length - 1);
  return `${(e / Math.pow(1024, n)).toFixed(n ? 1 : 0)} ${t[n]}`;
}
function Dt(e, t) {
  if (e && typeof e == "object") {
    const n = e, r = n.response?.data?.error;
    if (typeof r == "string") return r;
    if (r && typeof r == "object" && typeof r.message == "string")
      return r.message;
    if (typeof n.message == "string" && n.message) return n.message;
  }
  return t;
}
function ce(e) {
  return e === "failed" ? "error" : e || "uploaded";
}
function an(e) {
  return ce(e.status) === "error";
}
function Ga(e) {
  switch (ce(e)) {
    case "completed":
      return "success";
    case "error":
      return "danger";
    case "processing":
      return "info";
    default:
      return "warn";
  }
}
function Wa(e) {
  const t = ce(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function X(e) {
  return (e.filename || "").trim() || "Untitled file";
}
function ze(e, t, n) {
  const r = t?.response, i = r?.data, a = typeof i == "string" ? i.trim() : Dt({ response: r }, "").trim(), o = r?.status, s = o && o >= 400 ? r?.statusText?.trim() || `HTTP ${o}` : "", v = a || s || Dt(t, n);
  return `${e || "File"} · ${v}`;
}
function on(e) {
  const t = e.mime_type || "";
  if (t.startsWith("image/")) return t.slice(6).toUpperCase() + " image";
  if (t === "application/pdf") return "PDF";
  if (t.includes("word") || t.includes("opendocument.text")) return "Word";
  if (t.includes("sheet") || t.includes("excel") || t.includes("spreadsheet")) return "Spreadsheet";
  if (t.includes("presentation") || t.includes("powerpoint")) return "Presentation";
  if (t === "application/rtf") return "Rich text";
  if (t === "application/epub+zip") return "EPUB";
  if (t === "text/markdown") return "Markdown";
  if (t === "text/csv") return "CSV";
  if (t === "application/json") return "JSON";
  if (t.startsWith("text/")) return "Text";
  const n = (e.filename || "").split(".").pop();
  return n && n !== e.filename ? n.toUpperCase() : t || "File";
}
function ct(e) {
  let t = e.trim().replace(/^[\w.]+:[\w.]+:\d+:\s*/, "");
  return t = t.replace(/(\d{4,})\s*bytes/g, (n, r) => Ee(Number(r))), t = t.replace(/\(max\s+(\d{4,})\)/g, (n, r) => `(max ${Ee(Number(r))})`), t && t.charAt(0).toUpperCase() + t.slice(1);
}
const Ja = ["ocr_error", "asr_error", "conversion_error"], Xe = {
  transcription_failed: "Text recognition failed.",
  persist_failed: "The recognized text could not be saved.",
  storage_unavailable: "The stored file could not be read.",
  storage_stat_failed: "The stored file could not be read.",
  storage_read_failed: "The stored file could not be read.",
  storage_pointer_missing: "The stored file is missing.",
  no_text_detected: "No text was found in this file.",
  too_large: "The file is too large for transcription.",
  transcript_too_large: "The transcript is too large to keep."
}, Ha = /* @__PURE__ */ new Set(["no_text_detected", "too_large", "transcript_too_large"]);
function qa(e) {
  for (const t of Ja) {
    const n = e.meta?.[t];
    if (typeof n == "string" && n) return n;
  }
  return "";
}
function Za(e) {
  const t = qa(e);
  return an(e) ? { tone: "error", text: Xe[t] || (t ? "Text recognition failed." : e.error ? ct(e.error) : "Upload processing failed.") } : !t || ce(e.status) !== "completed" ? null : Ha.has(t) ? { tone: "info", text: Xe[t] } : { tone: "info", text: `${Xe[t] || "Text recognition did not complete."} The extracted text is shown.` };
}
function Qa(e) {
  const t = ce(e.status);
  return t === "completed" || t === "error";
}
const Ya = /* @__PURE__ */ new Set(["completed", "error"]);
function Xa(e) {
  return !Ya.has(ce(e.status));
}
function sn(e) {
  return e.role === "primary" && (e.kind === "markdown" || e.mime_type === "text/markdown");
}
function ln(e) {
  return sn(e) ? "Markdown" : e.role === "extracted-image" ? e.label || "Image" : e.label || e.role || e.kind || e.artifact_id;
}
function ei(e) {
  const t = typeof e.metadata?.width == "number" && typeof e.metadata?.height == "number" ? `${e.metadata.width}×${e.metadata.height}` : null;
  return [
    sn(e) ? "Converted markdown" : e.role === "extracted-image" ? "Extracted image" : e.kind,
    e.mime_type,
    e.size ? Ee(e.size) : null,
    t,
    e.occurrence_count && e.occurrence_count > 1 ? `${e.occurrence_count} occurrences` : null
  ].filter(Boolean).join(" · ");
}
const ti = {
  key: 0,
  class: "kx-side"
}, ni = { class: "kx-pv-head" }, ri = { class: "kx-ficon" }, ai = { class: "kx-pv-id" }, ii = ["title"], oi = { class: "kx-pv-sub" }, si = ["role"], li = { class: "kx-views" }, ui = {
  key: 0,
  role: "status"
}, di = ["content-type", "source", "source-url", "filename", "alt"], ci = { key: 2 }, pi = { class: "kx-parts-head" }, fi = { class: "kx-parts-range" }, mi = { class: "kx-parts-pager" }, gi = { class: "kx-parts-pageno" }, hi = {
  id: "uploads-extracted-parts",
  class: "kx-parts-list",
  role: "region",
  "aria-label": "Extracted parts"
}, bi = {
  key: 0,
  class: "kx-part-loading"
}, vi = /* @__PURE__ */ Ft({
  __name: "UploadPreviewDrawer",
  props: {
    preview: {},
    artifactView: {},
    busyAction: { type: Boolean },
    partsExpanded: { type: Boolean },
    currentArtifacts: {},
    partsTotal: {},
    partsPage: {},
    partsPages: {},
    partsRangeStart: {},
    partsRangeEnd: {},
    hasPrimary: { type: Boolean },
    primaryKind: {},
    artifactsLoading: { type: Boolean },
    activePreviewSource: { type: Function },
    downloadActive: { type: Function },
    openActive: { type: Function },
    closePreview: { type: Function },
    viewOriginal: { type: Function },
    viewPrimary: { type: Function },
    viewArtifact: { type: Function },
    gotoPartsPage: { type: Function },
    retrying: { type: Boolean },
    requestError: {},
    retryUpload: { type: Function }
  },
  emits: ["update:partsExpanded"],
  setup(e, { emit: t }) {
    const n = e, r = z(() => n.preview ? n.activePreviewSource(n.preview) : null), i = z(() => n.artifactView?.role === "primary"), a = z(() => n.preview ? Za(n.preview) : null), o = z(() => n.preview ? [on(n.preview), Ee(n.preview.size), nn(n.preview.created_at)].filter(Boolean).join(" · ") : ""), s = t;
    return (v, p) => (l(), $(u(rn), {
      visible: !!e.preview,
      position: "right",
      modal: !0,
      dismissable: !0,
      "close-on-escape": !0,
      "show-close-icon": !1,
      class: "kx-side-drawer",
      pt: { root: { style: "width: min(1400px, 82vw)" }, content: { class: "kx-side-drawer-content" } },
      "aria-label": "File preview",
      "onUpdate:visible": p[4] || (p[4] = (c) => {
        c || e.closePreview();
      })
    }, {
      default: D(() => [
        e.preview ? (l(), m("div", ti, [
          y("header", ni, [
            y("span", ri, [
              w(u(T), {
                icon: u(dt)(e.preview.mime_type),
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            y("div", ai, [
              y("div", {
                class: "kx-pv-name",
                title: u(X)(e.preview)
              }, A(u(X)(e.preview)), 9, ii),
              y("div", oi, A(o.value), 1)
            ]),
            w(u(U), {
              type: "button",
              text: "",
              rounded: "",
              size: "small",
              "data-testid": "uploads-preview-download",
              disabled: e.busyAction,
              "aria-label": "Download",
              onClick: e.downloadActive
            }, {
              icon: D(({ class: c }) => [
                w(u(T), {
                  icon: e.busyAction ? "tabler:loader-2" : "tabler:download",
                  class: L([c, e.busyAction && "spin"]),
                  "aria-hidden": "true"
                }, null, 8, ["icon", "class"])
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            w(u(U), {
              type: "button",
              text: "",
              rounded: "",
              size: "small",
              "data-testid": "uploads-preview-open",
              disabled: e.busyAction,
              "aria-label": "Open in new tab",
              onClick: e.openActive
            }, {
              icon: D(({ class: c }) => [
                w(u(T), {
                  icon: "tabler:external-link",
                  class: L(c),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            w(u(U), {
              type: "button",
              text: "",
              rounded: "",
              size: "small",
              "data-testid": "uploads-preview-close",
              "aria-label": "Close preview",
              onClick: e.closePreview
            }, {
              icon: D(({ class: c }) => [
                w(u(T), {
                  icon: "tabler:x",
                  class: L(c),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          a.value ? (l(), m("div", {
            key: 0,
            class: L(["kx-pv-fail", { "kx-pv-info": a.value.tone === "info" }]),
            role: a.value.tone === "error" ? "alert" : "status",
            "data-testid": "uploads-preview-error"
          }, [
            w(u(T), {
              icon: a.value.tone === "error" ? "tabler:alert-triangle" : "tabler:info-circle",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            y("span", null, A(e.requestError || a.value.text), 1),
            a.value.tone === "error" ? (l(), $(u(U), {
              key: 0,
              type: "button",
              class: "kx-pv-retry",
              size: "small",
              severity: "danger",
              outlined: "",
              label: "Retry",
              "data-testid": "uploads-preview-retry",
              loading: e.retrying,
              disabled: e.retrying,
              onClick: p[0] || (p[0] = (c) => e.retryUpload(e.preview))
            }, {
              icon: D(({ class: c }) => [
                w(u(T), {
                  icon: "tabler:refresh",
                  class: L(c),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["loading", "disabled"])) : C("", !0)
          ], 10, si)) : C("", !0),
          y("div", li, [
            w(u(U), {
              type: "button",
              class: "kx-part",
              size: "small",
              rounded: "",
              outlined: !!e.artifactView,
              label: "File",
              "data-testid": "uploads-view-file",
              "aria-pressed": !e.artifactView,
              pt: { label: { class: "kx-part-label" } },
              onClick: e.viewOriginal
            }, {
              icon: D(({ class: c }) => [
                w(u(T), {
                  icon: "tabler:file",
                  class: L(c),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["outlined", "aria-pressed", "onClick"]),
            e.hasPrimary ? (l(), $(u(U), {
              key: 0,
              type: "button",
              class: "kx-part",
              size: "small",
              rounded: "",
              outlined: !i.value,
              label: e.primaryKind === "markdown" ? "Markdown" : "Extracted text",
              "data-testid": e.primaryKind === "markdown" ? "uploads-view-markdown" : "uploads-view-primary",
              "aria-pressed": i.value,
              pt: { label: { class: "kx-part-label" } },
              onClick: e.viewPrimary
            }, {
              icon: D(({ class: c }) => [
                w(u(T), {
                  icon: e.primaryKind === "markdown" ? "tabler:markdown" : "tabler:file-text",
                  class: L(c),
                  "aria-hidden": "true"
                }, null, 8, ["icon", "class"])
              ]),
              _: 1
            }, 8, ["outlined", "label", "data-testid", "aria-pressed", "onClick"])) : C("", !0)
          ]),
          r.value?.contentType ? (l(), m("div", {
            key: 1,
            class: L(["kx-pv-view", { "kx-pv-padded": r.value.textAvailable }])
          }, [
            r.value.previewTruncated ? (l(), m("p", ui, "Showing the first rows. Download the file to view all rows.")) : C("", !0),
            r.value.sourceUrl || r.value.previewText !== void 0 ? (l(), m("wc-resource-view", {
              key: e.artifactView ? `${e.preview.uuid}:${e.artifactView.artifact_id}` : e.preview.uuid,
              class: "kx-pv-rv",
              "content-type": r.value.contentType,
              source: r.value.previewText,
              "source-url": r.value.sourceUrl,
              filename: r.value.filename,
              alt: r.value.filename
            }, null, 8, di)) : (l(), m("p", ci, "Inline preview is unavailable. Download the file to view its contents."))
          ], 2)) : C("", !0),
          e.partsTotal || e.artifactsLoading ? (l(), m("div", {
            key: 2,
            class: L(["kx-parts-panel", { open: e.partsExpanded }])
          }, [
            y("div", pi, [
              w(u(U), {
                type: "button",
                text: "",
                size: "small",
                label: "Parts",
                badge: String(e.partsTotal),
                "badge-severity": "secondary",
                "data-testid": "uploads-parts-toggle",
                "aria-expanded": e.partsExpanded,
                "aria-controls": "uploads-extracted-parts",
                onClick: p[1] || (p[1] = (c) => s("update:partsExpanded", !e.partsExpanded))
              }, {
                icon: D(({ class: c }) => [
                  w(u(T), {
                    icon: e.partsExpanded ? "tabler:chevron-down" : "tabler:chevron-right",
                    class: L(c),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }, 8, ["badge", "aria-expanded"]),
              e.partsExpanded && e.partsPages > 1 ? (l(), m(ee, { key: 0 }, [
                y("span", fi, A(e.partsRangeStart) + "–" + A(e.partsRangeEnd), 1),
                y("div", mi, [
                  w(u(U), {
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    "data-testid": "uploads-parts-previous",
                    disabled: e.partsPage <= 1,
                    "aria-label": "Previous parts",
                    onClick: p[2] || (p[2] = (c) => e.gotoPartsPage(e.partsPage - 1))
                  }, {
                    icon: D(({ class: c }) => [
                      w(u(T), {
                        icon: "tabler:chevron-left",
                        class: L(c),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  y("span", gi, A(e.partsPage) + " / " + A(e.partsPages), 1),
                  w(u(U), {
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    "data-testid": "uploads-parts-next",
                    disabled: e.partsPage >= e.partsPages,
                    "aria-label": "Next parts",
                    onClick: p[3] || (p[3] = (c) => e.gotoPartsPage(e.partsPage + 1))
                  }, {
                    icon: D(({ class: c }) => [
                      w(u(T), {
                        icon: "tabler:chevron-right",
                        class: L(c),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ], 64)) : C("", !0)
            ]),
            de(y("div", hi, [
              (l(!0), m(ee, null, ve(e.currentArtifacts, (c) => (l(), $(u(U), {
                key: c.artifact_id,
                type: "button",
                class: "kx-part",
                size: "small",
                rounded: "",
                outlined: e.artifactView?.artifact_id !== c.artifact_id,
                label: u(ln)(c),
                disabled: !c.raw_url,
                title: u(ei)(c),
                "data-testid": "uploads-view-artifact",
                "data-artifact-id": c.artifact_id,
                "aria-pressed": e.artifactView?.artifact_id === c.artifact_id,
                pt: { label: { class: "kx-part-label" } },
                onClick: (P) => e.viewArtifact(c)
              }, {
                icon: D(({ class: P }) => [
                  w(u(T), {
                    icon: u(dt)(c.mime_type),
                    class: L(P),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 2
              }, 1032, ["outlined", "label", "disabled", "title", "data-artifact-id", "aria-pressed", "onClick"]))), 128)),
              e.artifactsLoading ? (l(), m("span", bi, [
                w(u(T), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                })
              ])) : C("", !0)
            ], 512), [
              [Rn, e.partsExpanded]
            ])
          ], 2)) : C("", !0)
        ])) : C("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), $e = 30, Bt = 64 * 1024, yi = /* @__PURE__ */ new Set([
  "image/apng",
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  "image/x-icon"
]);
function wi(e) {
  return e.toLowerCase().split(";", 1)[0].trim();
}
function ki(e, t) {
  const n = wi(e.contentType || t);
  return e.textAvailable || n.startsWith("text/") || n === "application/xml" || n.endsWith("+xml") ? "text/plain" : n === "application/pdf" || yi.has(n) || /^(audio|video)\//.test(n) ? n : "application/octet-stream";
}
function Pi(e) {
  const t = R(null), n = R(null), r = R({}), i = R(!1), a = R(!1);
  function o(h) {
    return r.value[h] || {
      loaded: !1,
      loading: !1,
      error: "",
      primary: null,
      parts: [],
      total: 0,
      page: 1
    };
  }
  function s(h, _) {
    r.value = { ...r.value, [h]: _ };
  }
  function v(h) {
    return h.role === "source" || h.locator?.type === "upload.original";
  }
  function p(h) {
    const _ = o(h).primary;
    return _?.raw_url ? _ : null;
  }
  function c(h) {
    t.value?.uuid !== h.uuid || n.value || (o(h.uuid).source ?? h.content_description)?.inline === !1 && (n.value = p(h.uuid));
  }
  function P(h) {
    const _ = o(h.uuid), j = n.value, N = j ? j.content_description : _.source ?? h.content_description, ae = N?.mime_type || "", Y = N?.kind === "table", te = Y ? N.text_preview : void 0, ge = te === void 0 ? 0 : new TextEncoder().encodeInto(te, new Uint8Array(Bt)).read, G = te?.slice(0, ge), V = j ? j.size : h.size, H = !Y || typeof V == "number" && V >= 0 && V <= Bt, he = j ? j.raw_url : h.raw_url;
    return {
      contentType: ae,
      textAvailable: N?.text_available,
      sourceUrl: N?.inline && G === void 0 && H && he || "",
      previewText: G,
      previewTruncated: te !== void 0 && (N?.preview_truncated === !0 || ge < te.length),
      filename: j ? ln(j) : X(h)
    };
  }
  function g(h) {
    n.value && t.value?.uuid !== h.uuid && (n.value = null), t.value = h, c(h), _e(h);
  }
  function x() {
    t.value = null, n.value = null;
  }
  function E() {
    n.value = null;
  }
  function O() {
    const h = t.value ? p(t.value.uuid) : null;
    h && (n.value = h);
  }
  function M(h) {
    h.raw_url && (n.value = h);
  }
  const I = z(() => t.value ? o(t.value.uuid).parts : []), S = z(() => t.value ? o(t.value.uuid).total : 0), Z = z(() => t.value ? o(t.value.uuid).page : 1), Q = z(() => Math.max(1, Math.ceil(S.value / $e))), se = z(() => S.value ? (Z.value - 1) * $e + 1 : 0), pe = z(() => Math.min(S.value, (Z.value - 1) * $e + I.value.length)), ne = z(() => t.value ? p(t.value.uuid) : null), fe = z(() => !!ne.value && !v(ne.value)), me = z(() => ne.value?.content_description?.kind), Ke = z(() => !!(t.value && o(t.value.uuid).loading));
  function Ge(h) {
    if (!t.value) return;
    const _ = Math.min(Math.max(1, h), Q.value);
    _ !== Z.value && _e(t.value, !0, _);
  }
  function Oe() {
    return (n.value ? n.value.raw_url : t.value?.raw_url) || "";
  }
  function We() {
    return n.value ? n.value.label || n.value.artifact_id : t.value ? X(t.value) : "download";
  }
  async function Me(h, _) {
    if (!h) return null;
    try {
      const N = (await le.get(h, { responseType: "blob" })).data;
      return URL.createObjectURL(_ ? N.slice(0, N.size, ki(_, N.type)) : N);
    } catch (j) {
      return e.value = j instanceof Error ? j.message : "failed to fetch file", null;
    }
  }
  async function Je() {
    if (!a.value) {
      a.value = !0;
      try {
        const h = await Me(Oe());
        if (!h) return;
        const _ = document.createElement("a");
        _.href = h, _.download = We(), _.click(), setTimeout(() => URL.revokeObjectURL(h), 1e4);
      } finally {
        a.value = !1;
      }
    }
  }
  async function He() {
    if (!(a.value || !t.value)) {
      a.value = !0;
      try {
        const h = await Me(Oe(), P(t.value));
        h && (window.open(h, "_blank", "noopener"), setTimeout(() => URL.revokeObjectURL(h), 6e4));
      } finally {
        a.value = !1;
      }
    }
  }
  async function _e(h, _ = !1, j = 1) {
    const N = o(h.uuid);
    if (!((N.loaded || N.loading) && !_)) {
      s(h.uuid, { ...N, loading: !0, error: "" });
      try {
        const ae = (j - 1) * $e, { data: Y } = await le.get(`/api/v1/uploads/${h.uuid}/artifacts`, { params: { limit: $e, offset: ae } });
        if (!Y.success) {
          s(h.uuid, { ...N, loaded: !1, loading: !1, error: Y.error || "failed to load artifacts" });
          return;
        }
        const te = Y.artifacts || [], ge = Y.primary || te.find((V) => V.role === "primary" && !!V.raw_url) || null, G = te.filter((V) => !v(V) && V.role !== "primary");
        s(h.uuid, {
          loaded: !0,
          loading: !1,
          error: "",
          source: Y.content_description,
          primary: ge,
          parts: G,
          total: Number(Y.meta?.total ?? G.length),
          page: j
        }), j === 1 && c(h);
      } catch (ae) {
        s(h.uuid, { ...N, loaded: !1, loading: !1, error: ae instanceof Error ? ae.message : "failed to load artifacts" });
      }
    }
  }
  return {
    preview: t,
    artifactView: n,
    artifactsByUpload: r,
    partsExpanded: i,
    busyAction: a,
    artifactStateFor: o,
    isSourceArtifact: v,
    activePreviewSource: P,
    openPreview: g,
    closePreview: x,
    viewOriginal: E,
    viewPrimary: O,
    viewArtifact: M,
    currentArtifacts: I,
    partsTotal: S,
    partsPage: Z,
    partsPages: Q,
    partsRangeStart: se,
    partsRangeEnd: pe,
    hasPrimary: fe,
    primaryKind: me,
    artifactsLoading: Ke,
    gotoPartsPage: Ge,
    downloadActive: Je,
    openActive: He
  };
}
const xi = () => In(), Ci = () => Ln(), $i = { class: "kx" }, Si = { class: "kx-head" }, Ii = { class: "kx-head-icon" }, Li = { class: "kx-head-actions" }, Ti = { class: "kx-count" }, Ai = {
  key: 0,
  class: "kx-count kx-pending"
}, Di = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Bi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ei = {
  key: 2,
  class: "kx-err",
  role: "alert",
  "data-testid": "uploads-link-error"
}, Ri = { class: "kx-body" }, Fi = { class: "kx-main" }, Oi = { class: "kx-drop-title" }, Mi = {
  key: 0,
  class: "kx-err kx-upload-errors",
  role: "alert"
}, _i = {
  key: 1,
  class: "kx-loading"
}, Ni = {
  key: 2,
  class: "kx-empty"
}, ji = { class: "kx-empty-ico" }, Ui = {
  key: 3,
  class: "kx-empty"
}, Vi = { class: "kx-list" }, zi = { class: "kx-ficon" }, Ki = { class: "kx-id" }, Gi = ["title"], Wi = { class: "kx-sub" }, Ji = { class: "kx-type" }, Hi = ["title"], qi = {
  key: 1,
  class: "kx-err-reason",
  role: "alert"
}, Zi = { class: "kx-date" }, Qi = { class: "kx-actions" }, Yi = {
  key: 0,
  class: "kx-progress",
  "aria-hidden": "true"
}, Se = 30, Xi = /* @__PURE__ */ Ft({
  __name: "uploads",
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "error"]), n = [
      { label: "All status", value: "all" },
      { label: "Uploaded", value: "uploaded" },
      { label: "Processing", value: "processing" },
      { label: "Completed", value: "completed" },
      { label: "Error", value: "error" }
    ], r = R([]), i = R(0), a = R(!1), o = R(""), s = R([]), v = R(!1), p = R(0), c = R(""), P = R("all"), g = R(1), x = R({});
    let E = null, O = !1, M = !1;
    const I = R(!1), {
      preview: S,
      artifactView: Z,
      partsExpanded: Q,
      busyAction: se,
      activePreviewSource: pe,
      openPreview: ne,
      closePreview: fe,
      viewOriginal: me,
      viewPrimary: Ke,
      viewArtifact: Ge,
      currentArtifacts: Oe,
      partsTotal: We,
      partsPage: Me,
      partsPages: Je,
      partsRangeStart: He,
      partsRangeEnd: _e,
      hasPrimary: h,
      primaryKind: _,
      artifactsLoading: j,
      gotoPartsPage: N,
      downloadActive: ae,
      openActive: Y
    } = Pi(o), te = xi(), ge = Ci(), G = R(""), V = R(!1);
    let H = 0, he = null;
    function mt(b = "") {
      he = b, ge("navigate", { path: b });
    }
    function un(b) {
      H++, G.value = "", V.value = !1, ne(b), mt(b.uuid);
    }
    function we() {
      H++, G.value = "", V.value = !1, fe(), mt();
    }
    Ve(() => te.value.route, async (b) => {
      const f = String(b ?? "").replace(/^\/+|\/+$/g, "");
      if (he !== null && f !== he || (he = null, f === S.value?.uuid)) return;
      const d = ++H;
      if (G.value = "", V.value = !1, fe(), !f) return;
      V.value = !0;
      let B;
      try {
        const W = await le.get(`/api/v1/uploads/${encodeURIComponent(f)}`);
        if (d !== H) return;
        if (W.data.success && W.data.upload) {
          const Ze = W.data.upload;
          ne({ ...Ze, filename: Ze.filename || String(Ze.meta?.filename || "") });
          return;
        }
        B = { response: W };
      } catch (W) {
        B = W;
      } finally {
        d === H && (V.value = !1);
      }
      if (d !== H) return;
      const re = r.value.find((W) => W.uuid === f);
      G.value = ze(re && X(re), B, "Failed to load upload");
    }, { immediate: !0 });
    const qe = R(""), Ne = R({});
    let ie = null, je = "";
    const gt = z(() => typeof Ne.value.pending_count == "number" ? Ne.value.pending_count : r.value.filter((b) => !t.has(ce(b.status))).length), ht = z(() => Math.max(1, Math.ceil(i.value / Se)));
    function oe() {
      return M ? Promise.resolve() : (O = !0, E || (a.value = !0, E = Promise.resolve().then(async () => {
        try {
          for (; O && !M; ) {
            O = !1;
            const b = g.value, f = c.value.trim(), d = P.value, B = () => !M && b === g.value && f === c.value.trim() && d === P.value;
            o.value = "";
            try {
              const re = { limit: Se, offset: (b - 1) * Se };
              f && (re.q = f), d !== "all" && (re.status = d);
              const { data: W } = await le.get("/api/v1/uploads/list", { params: re });
              if (!B()) continue;
              W.success ? (r.value = W.uploads || [], i.value = Number(W.meta?.total ?? r.value.length), typeof W.component_id == "string" && (qe.value = W.component_id)) : (r.value = [], i.value = 0);
            } catch (re) {
              if (!B()) continue;
              r.value = [], i.value = 0, o.value = re instanceof Error ? re.message : "failed to load uploads";
            }
          }
        } finally {
          E = null, M || (a.value = !1);
        }
      }), E));
    }
    function dn(b) {
      const f = Math.max(1, Math.min(ht.value, b));
      f !== g.value && (g.value = f, oe());
    }
    let ke = null;
    Ve(c, () => {
      ke && clearTimeout(ke), ke = setTimeout(() => {
        g.value = 1, oe();
      }, 300);
    }), Ve(P, () => {
      g.value = 1, oe();
    });
    function bt() {
      if (M) return;
      const b = qe.value;
      !b || je === b || (ie && ie(), ie = null, je = "", ie = $a(b, (f) => {
        Ne.value = { ...Ne.value, ...f.meta }, oe();
      }), ie && (je = b));
    }
    Ve(qe, () => {
      bt();
    });
    async function cn(b) {
      const f = new FormData();
      f.append("file", b), f.append("metadata", JSON.stringify({ target_parent_id: "", filename: b.name }));
      let d;
      try {
        const B = await le.post("/api/v1/uploads", f, { headers: { "Content-Type": "multipart/form-data" } });
        if (B.data.success) return;
        d = { response: B };
      } catch (B) {
        d = B;
      }
      s.value.push(ze(b.name, d, "Upload failed"));
    }
    async function vt(b) {
      const f = Array.from(b);
      if (f.length) {
        o.value = "", p.value === 0 && (s.value = []), p.value += f.length;
        try {
          for (const d of f) await cn(d);
        } finally {
          p.value = Math.max(0, p.value - f.length), g.value = 1, await oe();
        }
      }
    }
    function Pe() {
      const b = document.createElement("input");
      b.type = "file", b.multiple = !0, b.onchange = () => {
        b.files?.length && vt(b.files);
      }, b.click();
    }
    function pn(b) {
      b.preventDefault(), v.value = !1, b.dataTransfer?.files?.length && vt(b.dataTransfer.files);
    }
    async function fn(b) {
      await Un.confirm({
        header: "Delete upload",
        message: "Deletes the file everywhere; workspace links are removed.",
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await mn(b);
    }
    async function mn(b) {
      delete x.value[b.uuid];
      let f;
      try {
        const d = await le.delete(`/api/v1/uploads/${b.uuid}`);
        if (d.data.success) {
          S.value?.uuid === b.uuid && we(), r.value.length === 1 && g.value > 1 && (g.value -= 1), await oe();
          return;
        }
        f = { response: d };
      } catch (d) {
        f = d;
      }
      x.value[b.uuid] = ze(X(b), f, "Failed to delete upload");
    }
    async function gn(b) {
      if (I.value) return;
      const f = H;
      I.value = !0, G.value = "";
      let d;
      try {
        const B = await le.post(`/api/v1/uploads/${b.uuid}/retry`);
        if (B.data.success) {
          f === H && we(), await oe();
          return;
        }
        d = { response: B };
      } catch (B) {
        d = B;
      } finally {
        I.value = !1;
      }
      f === H && (G.value = ze(X(b), d, "Failed to retry upload"));
    }
    function yt(b) {
      b.key === "Escape" && S.value && we();
    }
    async function hn() {
      try {
        await oe(), bt();
      } catch (b) {
        o.value = b instanceof Error ? b.message : "host API unavailable";
      }
    }
    return Tn(hn), Fn(() => {
      window.addEventListener("keydown", yt), jn("wc-resource-view", { timeoutMs: 1e4 }).catch(() => {
      });
    }), On(() => {
      M = !0, O = !1, H++, window.removeEventListener("keydown", yt), ke && clearTimeout(ke), ie && ie(), ie = null, je = "";
    }), (b, f) => (l(), m("div", $i, [
      y("header", Si, [
        y("div", Ii, [
          w(u(T), {
            icon: "tabler:files",
            "aria-hidden": "true"
          })
        ]),
        f[10] || (f[10] = y("div", { class: "kx-head-text" }, [
          y("h1", { class: "kx-title" }, "Uploads"),
          y("p", { class: "kx-head-sub" }, "Files your agents can read and process.")
        ], -1)),
        y("div", Li, [
          y("span", Ti, A(i.value) + " file" + A(i.value !== 1 ? "s" : ""), 1),
          gt.value ? (l(), m("span", Ai, [
            w(u(T), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            be(" " + A(gt.value) + " processing", 1)
          ])) : C("", !0),
          w(u(Nt), { class: "kx-search" }, {
            default: D(() => [
              w(u(tt), null, {
                default: D(() => [
                  w(u(T), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              w(u(Mt), {
                modelValue: c.value,
                "onUpdate:modelValue": f[0] || (f[0] = (d) => c.value = d),
                placeholder: "Search files…",
                "aria-label": "Search files",
                "data-testid": "uploads-search-input"
              }, null, 8, ["modelValue"]),
              c.value ? (l(), $(u(tt), { key: 0 }, {
                default: D(() => [
                  w(u(U), {
                    type: "button",
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": "Clear search",
                    "data-testid": "uploads-search-clear",
                    onClick: f[1] || (f[1] = (d) => c.value = "")
                  }, {
                    icon: D(({ class: d }) => [
                      w(u(T), {
                        icon: "tabler:x",
                        class: L(d),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : C("", !0)
            ]),
            _: 1
          }),
          w(u(ft), {
            modelValue: P.value,
            "onUpdate:modelValue": f[2] || (f[2] = (d) => P.value = d),
            class: "kx-select",
            options: n,
            "option-label": "label",
            "option-value": "value",
            "aria-label": "Filter by status"
          }, null, 8, ["modelValue"]),
          w(u(U), {
            type: "button",
            "data-testid": "uploads-header-upload",
            label: p.value > 0 ? "Uploading…" : "Upload",
            loading: p.value > 0,
            disabled: p.value > 0,
            onClick: Pe
          }, {
            icon: D(({ class: d }) => [
              w(u(T), {
                icon: "tabler:upload",
                class: L(d),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["label", "loading", "disabled"])
        ])
      ]),
      o.value ? (l(), m("div", Di, A(o.value), 1)) : C("", !0),
      V.value ? (l(), m("div", Bi, "Loading file…")) : C("", !0),
      G.value && !u(S) ? (l(), m("div", Ei, [
        be(A(G.value) + " ", 1),
        w(u(U), {
          label: "Close preview",
          text: "",
          severity: "secondary",
          onClick: we
        })
      ])) : C("", !0),
      y("div", Ri, [
        y("div", Fi, [
          y("div", {
            class: L(["kx-drop", { dragover: v.value, busy: p.value > 0 }]),
            role: "button",
            tabindex: "0",
            "aria-label": "Upload files",
            onClick: f[3] || (f[3] = (d) => p.value === 0 && Pe()),
            onKeydown: [
              f[4] || (f[4] = Ct((d) => p.value === 0 && Pe(), ["enter"])),
              f[5] || (f[5] = Ct(xt((d) => p.value === 0 && Pe(), ["prevent"]), ["space"]))
            ],
            onDragover: f[6] || (f[6] = xt((d) => v.value = !0, ["prevent"])),
            onDragleave: f[7] || (f[7] = (d) => v.value = !1),
            onDrop: pn
          }, [
            w(u(T), {
              icon: p.value > 0 ? "tabler:loader-2" : "tabler:cloud-upload",
              class: L(["kx-drop-ico", p.value > 0 && "spin"]),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            y("p", Oi, A(p.value > 0 ? "Uploading…" : "Drop files or click to browse"), 1),
            f[11] || (f[11] = y("p", { class: "kx-drop-sub" }, "Documents convert to markdown; images and text are stored for agents.", -1))
          ], 34),
          s.value.length ? (l(), m("div", Mi, [
            y("ul", null, [
              (l(!0), m(ee, null, ve(s.value, (d, B) => (l(), m("li", { key: B }, A(d), 1))), 128))
            ])
          ])) : C("", !0),
          a.value && !r.value.length ? (l(), m("div", _i, [
            w(u(T), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            f[12] || (f[12] = be(" Loading…", -1))
          ])) : !i.value && !c.value && P.value === "all" ? (l(), m("div", Ni, [
            y("div", ji, [
              w(u(T), {
                icon: "tabler:cloud-upload",
                "aria-hidden": "true"
              })
            ]),
            f[13] || (f[13] = y("div", { class: "kx-empty-title" }, "No uploads yet", -1)),
            f[14] || (f[14] = y("div", { class: "kx-empty-sub" }, "Upload a document, image, or text file to make it available to your agents.", -1)),
            w(u(U), {
              type: "button",
              class: "kx-empty-cta",
              "data-testid": "uploads-empty-upload",
              label: "Upload files",
              onClick: Pe
            }, {
              icon: D(({ class: d }) => [
                w(u(T), {
                  icon: "tabler:upload",
                  class: L(d),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            })
          ])) : r.value.length ? (l(), m(ee, { key: 4 }, [
            y("div", Vi, [
              (l(!0), m(ee, null, ve(r.value, (d) => (l(), m("div", {
                key: d.uuid,
                class: "kx-row"
              }, [
                y("span", zi, [
                  w(u(T), {
                    icon: u(dt)(d.mime_type),
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                y("div", Ki, [
                  y("div", {
                    class: "kx-name",
                    title: u(X)(d)
                  }, A(u(X)(d)), 9, Gi),
                  y("div", Wi, [
                    y("span", Ji, A(u(on)(d)), 1),
                    be(" · " + A(u(Ee)(d.size)), 1)
                  ]),
                  u(an)(d) && d.error ? (l(), m("div", {
                    key: 0,
                    class: "kx-err-reason",
                    title: u(ct)(d.error)
                  }, A(u(ct)(d.error)), 9, Hi)) : C("", !0),
                  x.value[d.uuid] ? (l(), m("div", qi, A(x.value[d.uuid]), 1)) : C("", !0)
                ]),
                w(u(_t), {
                  severity: u(Ga)(d.status),
                  class: "kx-badge kx-tag-sm"
                }, {
                  default: D(() => [
                    u(t).has(d.status) ? C("", !0) : (l(), $(u(T), {
                      key: 0,
                      icon: "tabler:loader-2",
                      class: "spin",
                      "aria-hidden": "true"
                    })),
                    be(" " + A(u(Wa)(d.status)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"]),
                y("span", Zi, A(u(nn)(d.created_at)), 1),
                y("div", Qi, [
                  u(Qa)(d) ? (l(), $(u(U), {
                    key: 0,
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    "data-testid": "uploads-row-preview",
                    "data-upload-id": d.uuid,
                    "aria-label": `Preview ${u(X)(d)}`,
                    onClick: (B) => un(d)
                  }, {
                    icon: D(({ class: B }) => [
                      w(u(T), {
                        icon: "tabler:eye",
                        class: L(B),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["data-upload-id", "aria-label", "onClick"])) : C("", !0),
                  w(u(U), {
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    severity: "danger",
                    "data-testid": "uploads-row-delete",
                    "data-upload-id": d.uuid,
                    "aria-label": `Delete ${u(X)(d)}`,
                    onClick: (B) => fn(d)
                  }, {
                    icon: D(({ class: B }) => [
                      w(u(T), {
                        icon: "tabler:trash",
                        class: L(B),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["data-upload-id", "aria-label", "onClick"])
                ]),
                u(Xa)(d) ? (l(), m("span", Yi)) : C("", !0)
              ]))), 128))
            ]),
            ht.value > 1 ? (l(), $(u(tn), {
              key: 0,
              first: (g.value - 1) * Se,
              rows: Se,
              "total-records": i.value,
              "page-link-size": 5,
              template: "CurrentPageReport PrevPageLink PageLinks NextPageLink",
              "current-page-report-template": "{first}–{last} of {totalRecords}",
              "data-testid": "uploads-pager",
              "aria-label": "Pagination",
              pt: {
                prev: { "data-testid": "uploads-pager-previous" },
                next: { "data-testid": "uploads-pager-next" }
              },
              onPage: f[8] || (f[8] = (d) => dn(d.page + 1))
            }, null, 8, ["first", "total-records"])) : C("", !0)
          ], 64)) : (l(), m("div", Ui, [...f[15] || (f[15] = [
            y("div", { class: "kx-empty-title" }, "No matches", -1),
            y("div", { class: "kx-empty-sub" }, "No files match the current search or filter.", -1)
          ])]))
        ])
      ]),
      w(vi, {
        "parts-expanded": u(Q),
        "onUpdate:partsExpanded": f[9] || (f[9] = (d) => Mn(Q) ? Q.value = d : null),
        preview: u(S),
        "artifact-view": u(Z),
        "busy-action": u(se),
        "current-artifacts": u(Oe),
        "parts-total": u(We),
        "parts-page": u(Me),
        "parts-pages": u(Je),
        "parts-range-start": u(He),
        "parts-range-end": u(_e),
        "has-primary": u(h),
        "primary-kind": u(_),
        "artifacts-loading": u(j),
        "active-preview-source": u(pe),
        "download-active": u(ae),
        "open-active": u(Y),
        "close-preview": we,
        "view-original": u(me),
        "view-primary": u(Ke),
        "view-artifact": u(Ge),
        "goto-parts-page": u(N),
        retrying: I.value,
        "request-error": G.value,
        "retry-upload": gn
      }, null, 8, ["parts-expanded", "preview", "artifact-view", "busy-action", "current-artifacts", "parts-total", "parts-page", "parts-pages", "parts-range-start", "parts-range-end", "has-primary", "primary-kind", "artifacts-loading", "active-preview-source", "download-active", "open-active", "view-original", "view-primary", "view-artifact", "goto-parts-page", "retrying", "request-error"])
    ]));
  }
}), io = {
  rootComponent: Xi,
  plugins: [An]
};
export {
  io as mountConfig
};
//# sourceMappingURL=lazy-mount-Djka2box.js.map
