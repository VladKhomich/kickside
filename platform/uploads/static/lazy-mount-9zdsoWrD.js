import { B as se, s as U, f as ct, a as Be, p as pn, M as yt, l as wt, b as Xe, R as Ee, c as fn, _ as mn, L as gn, d as xe, v as we, e as hn, U as bn, I as kt, g as vn, r as Tt, h as yn, i as wn, x as Ze, j as kn, k as Pn, u as Cn, m as xn, P as $n } from "./wc-runtime-Crg81w4N.js";
import { openBlock as d, createElementBlock as g, mergeProps as y, createBlock as C, resolveDynamicComponent as W, createCommentVNode as x, renderSlot as F, createElementVNode as b, toDisplayString as B, resolveComponent as _, createVNode as v, normalizeStyle as Sn, normalizeClass as L, toHandlers as Ue, resolveDirective as me, withDirectives as le, createSlots as Dt, withCtx as D, Fragment as H, renderList as $e, createTextVNode as fe, normalizeProps as In, Transition as Ln, defineComponent as Bt, computed as G, unref as l, vShow as An, ref as O, watch as Ve, onMounted as Tn, onBeforeUnmount as Dn, withModifiers as Pt, withKeys as Ct, isRef as Bn } from "vue";
import { Icon as A } from "@iconify/vue";
import { s as Et, a as Rt, b as En, c as pt, d as j } from "./index-D-sSYkIL.js";
import { on as Rn, api as ie, loadByTagName as Fn, host as On } from "@wippy-fe/proxy";
var Mn = `
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
`, Nn = {
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
}, jn = se.extend({
  name: "tag",
  style: Mn,
  classes: Nn
}), _n = {
  name: "BaseTag",
  extends: U,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: jn,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function Se(e) {
  "@babel/helpers - typeof";
  return Se = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Se(e);
}
function Un(e, t, n) {
  return (t = Vn(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Vn(e) {
  var t = zn(e, "string");
  return Se(t) == "symbol" ? t : t + "";
}
function zn(e, t) {
  if (Se(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Se(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ft = {
  name: "Tag",
  extends: _n,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ct(Un({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, Kn = ["data-p"];
function Gn(e, t, n, r, i, a) {
  return d(), g("span", y({
    class: e.cx("root"),
    "data-p": a.dataP
  }, e.ptmi("root")), [e.$slots.icon ? (d(), C(W(e.$slots.icon), y({
    key: 0,
    class: e.cx("icon")
  }, e.ptm("icon")), null, 16, ["class"])) : e.icon ? (d(), g("span", y({
    key: 1,
    class: [e.cx("icon"), e.icon]
  }, e.ptm("icon")), null, 16)) : x("", !0), e.value != null || e.$slots.default ? F(e.$slots, "default", {
    key: 2
  }, function() {
    return [b("span", y({
      class: e.cx("label")
    }, e.ptm("label")), B(e.value), 17)];
  }) : x("", !0)], 16, Kn);
}
Ft.render = Gn;
var Wn = `
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
`, Jn = {
  root: "p-inputgroup"
}, Hn = se.extend({
  name: "inputgroup",
  style: Wn,
  classes: Jn
}), Zn = {
  name: "BaseInputGroup",
  extends: U,
  style: Hn,
  provide: function() {
    return {
      $pcInputGroup: this,
      $parentInstance: this
    };
  }
}, Ot = {
  name: "InputGroup",
  extends: Zn,
  inheritAttrs: !1
};
function qn(e, t, n, r, i, a) {
  return d(), g("div", y({
    class: e.cx("root")
  }, e.ptmi("root")), [F(e.$slots, "default")], 16);
}
Ot.render = qn;
var Qn = {
  root: "p-inputgroupaddon"
}, Xn = se.extend({
  name: "inputgroupaddon",
  classes: Qn
}), Yn = {
  name: "BaseInputGroupAddon",
  extends: U,
  style: Xn,
  provide: function() {
    return {
      $pcInputGroupAddon: this,
      $parentInstance: this
    };
  }
}, Ye = {
  name: "InputGroupAddon",
  extends: Yn,
  inheritAttrs: !1
};
function er(e, t, n, r, i, a) {
  return d(), g("div", y({
    class: e.cx("root")
  }, e.ptmi("root")), [F(e.$slots, "default")], 16);
}
Ye.render = er;
var tr = `
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
function Ie(e) {
  "@babel/helpers - typeof";
  return Ie = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ie(e);
}
function nr(e, t, n) {
  return (t = rr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function rr(e) {
  var t = ar(e, "string");
  return Ie(t) == "symbol" ? t : t + "";
}
function ar(e, t) {
  if (Ie(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ie(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ir = {
  paginator: function(t) {
    var n = t.instance, r = t.key;
    return ["p-paginator p-component", nr({
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
}, or = se.extend({
  name: "paginator",
  style: tr,
  classes: ir
}), Mt = {
  name: "AngleDoubleLeftIcon",
  extends: Be
};
function sr(e) {
  return cr(e) || dr(e) || ur(e) || lr();
}
function lr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ur(e, t) {
  if (e) {
    if (typeof e == "string") return et(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? et(e, t) : void 0;
  }
}
function dr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function cr(e) {
  if (Array.isArray(e)) return et(e);
}
function et(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function pr(e, t, n, r, i, a) {
  return d(), g("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), sr(t[0] || (t[0] = [b("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Mt.render = pr;
var Nt = {
  name: "AngleDownIcon",
  extends: Be
};
function fr(e) {
  return br(e) || hr(e) || gr(e) || mr();
}
function mr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function gr(e, t) {
  if (e) {
    if (typeof e == "string") return tt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? tt(e, t) : void 0;
  }
}
function hr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function br(e) {
  if (Array.isArray(e)) return tt(e);
}
function tt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function vr(e, t, n, r, i, a) {
  return d(), g("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), fr(t[0] || (t[0] = [b("path", {
    d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Nt.render = vr;
var jt = {
  name: "AngleUpIcon",
  extends: Be
};
function yr(e) {
  return Cr(e) || Pr(e) || kr(e) || wr();
}
function wr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function kr(e, t) {
  if (e) {
    if (typeof e == "string") return nt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? nt(e, t) : void 0;
  }
}
function Pr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Cr(e) {
  if (Array.isArray(e)) return nt(e);
}
function nt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function xr(e, t, n, r, i, a) {
  return d(), g("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), yr(t[0] || (t[0] = [b("path", {
    d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
jt.render = xr;
var $r = `
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
`, Sr = {
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
}, Ir = se.extend({
  name: "inputnumber",
  style: $r,
  classes: Sr
}), Lr = {
  name: "BaseInputNumber",
  extends: En,
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
  style: Ir,
  provide: function() {
    return {
      $pcInputNumber: this,
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
function xt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function $t(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? xt(Object(n), !0).forEach(function(r) {
      rt(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : xt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function rt(e, t, n) {
  return (t = Ar(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ar(e) {
  var t = Tr(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function Tr(e, t) {
  if (Le(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Le(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Dr(e) {
  return Fr(e) || Rr(e) || Er(e) || Br();
}
function Br() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Er(e, t) {
  if (e) {
    if (typeof e == "string") return at(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? at(e, t) : void 0;
  }
}
function Rr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Fr(e) {
  if (Array.isArray(e)) return at(e);
}
function at(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
var _t = {
  name: "InputNumber",
  extends: Lr,
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
        this.d_modelValue = t, (n = this.$refs.clearIcon) !== null && n !== void 0 && (n = n.$el) !== null && n !== void 0 && n.style && (this.$refs.clearIcon.$el.style.display = wt(t) ? "none" : "block");
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
      var t = Dr(new Intl.NumberFormat(this.locale, {
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
      var t = new Intl.NumberFormat(this.locale, $t($t({}, this.getOptions()), {}, {
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
      var r = t.toString(), i = n.toString(), a = r.includes(".") ? r.split(".")[1].length : 0, o = i.includes(".") ? i.split(".")[1].length : 0, s = Math.max(a, o), u = Math.pow(10, s);
      return Math.round((t + n) * u) / u;
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
              var u = this.isNumeralChar(a.charAt(n)) ? n + 1 : n + 2;
              this.$refs.input.$el.setSelectionRange(u, u);
            } else this.isNumeralChar(a.charAt(n - 1)) || t.preventDefault();
            break;
          case "ArrowRight":
            if (i > 1) {
              var m = r - 1;
              this.$refs.input.$el.setSelectionRange(m, m);
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
              var $ = a.charAt(n - 1), k = this.getDecimalCharIndexes(a), w = k.decimalCharIndex, P = k.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar($)) {
                var E = this.getDecimalLength(a);
                if (this._group.test($))
                  this._group.lastIndex = 0, o = a.slice(0, n - 2) + a.slice(n - 1);
                else if (this._decimal.test($))
                  this._decimal.lastIndex = 0, E ? this.$refs.input.$el.setSelectionRange(n - 1, n - 1) : o = a.slice(0, n - 1) + a.slice(n);
                else if (w > 0 && n > w) {
                  var R = this.isDecimalMode() && (this.minFractionDigits || 0) < E ? "" : "0";
                  o = a.slice(0, n - 1) + R + a.slice(n);
                } else P === 1 ? (o = a.slice(0, n - 1) + "0" + a.slice(n), o = this.parseValue(o) > 0 ? o : "") : o = a.slice(0, n - 1) + a.slice(n);
              }
              this.updateValue(t, o, null, "delete-single");
            } else
              o = this.deleteRange(a, n, r), this.updateValue(t, o, null, "delete-range");
            break;
          }
          case "Delete":
            if (t.preventDefault(), n === r) {
              var M = a.charAt(n), I = this.getDecimalCharIndexes(a), T = I.decimalCharIndex, V = I.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(M)) {
                var J = this.getDecimalLength(a);
                if (this._group.test(M))
                  this._group.lastIndex = 0, o = a.slice(0, n) + a.slice(n + 2);
                else if (this._decimal.test(M))
                  this._decimal.lastIndex = 0, J ? this.$refs.input.$el.setSelectionRange(n + 1, n + 1) : o = a.slice(0, n) + a.slice(n + 1);
                else if (T > 0 && n > T) {
                  var q = this.isDecimalMode() && (this.minFractionDigits || 0) < J ? "" : "0";
                  o = a.slice(0, n) + q + a.slice(n + 1);
                } else V === 1 ? (o = a.slice(0, n) + "0" + a.slice(n + 1), o = this.parseValue(o) > 0 ? o : "") : o = a.slice(0, n) + a.slice(n + 1);
              }
              this.updateValue(t, o, null, "delete-back-single");
            } else
              o = this.deleteRange(a, n, r), this.updateValue(t, o, null, "delete-range");
            break;
          case "Home":
            t.preventDefault(), Xe(this.min) && this.updateModel(t, this.min);
            break;
          case "End":
            t.preventDefault(), Xe(this.max) && this.updateModel(t, this.max);
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
        var a = this.$refs.input.$el.selectionStart, o = this.$refs.input.$el.selectionEnd, s = this.$refs.input.$el.value.trim(), u = this.getCharIndexes(s), m = u.decimalCharIndex, $ = u.minusCharIndex, k = u.suffixCharIndex, w = u.currencyCharIndex, P;
        if (r.isMinusSign) {
          var E = $ === -1;
          (a === 0 || a === w + 1) && (P = s, (E || o !== 0) && (P = this.insertText(s, n, 0, o)), this.updateValue(t, P, n, "insert"));
        } else if (r.isDecimalSign)
          m > 0 && a === m ? this.updateValue(t, s, n, "insert") : m > a && m < o ? (P = this.insertText(s, n, a, o), this.updateValue(t, P, n, "insert")) : m === -1 && this.maxFractionDigits && (P = this.insertText(s, n, a, o), this.updateValue(t, P, n, "insert"));
        else {
          var R = this.numberFormat.resolvedOptions().maximumFractionDigits, M = a !== o ? "range-insert" : "insert";
          if (m > 0 && a > m) {
            if (a + n.length - (m + 1) <= R) {
              var I = w >= a ? w - 1 : k >= a ? k : s.length;
              P = s.slice(0, a) + n + s.slice(a + n.length, I) + s.slice(I), this.updateValue(t, P, n, M);
            }
          } else
            P = this.insertText(s, n, a, o), this.updateValue(t, P, n, M);
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
      !this.readonly && t !== yt() && this.initCursor();
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
      var o = this.$refs.input.$el.value, s = this.formatValue(t), u = o.length;
      if (s !== i && (s = this.concatValues(s, i)), u === 0) {
        this.$refs.input.$el.value = s, this.$refs.input.$el.setSelectionRange(0, 0);
        var m = this.initCursor(), $ = m + n.length;
        this.$refs.input.$el.setSelectionRange($, $);
      } else {
        var k = this.$refs.input.$el.selectionStart, w = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = s;
        var P = s.length;
        if (r === "range-insert") {
          var E = this.parseValue((o || "").slice(0, k)), R = E !== null ? E.toString() : "", M = R.split("").join("(".concat(this.groupChar, ")?")), I = new RegExp(M, "g");
          I.test(s);
          var T = n.split("").join("(".concat(this.groupChar, ")?")), V = new RegExp(T, "g");
          V.test(s.slice(I.lastIndex)), w = I.lastIndex + V.lastIndex, this.$refs.input.$el.setSelectionRange(w, w);
        } else if (P === u)
          r === "insert" || r === "delete-back-single" ? this.$refs.input.$el.setSelectionRange(w + 1, w + 1) : r === "delete-single" ? this.$refs.input.$el.setSelectionRange(w - 1, w - 1) : (r === "delete-range" || r === "spin") && this.$refs.input.$el.setSelectionRange(w, w);
        else if (r === "delete-back-single") {
          var J = o.charAt(w - 1), q = o.charAt(w), te = u - P, ne = this._group.test(q);
          ne && te === 1 ? w += 1 : !ne && this.isNumeralChar(J) && (w += -1 * te + 1), this._group.lastIndex = 0, this.$refs.input.$el.setSelectionRange(w, w);
        } else if (o === "-" && r === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          var ge = this.initCursor(), de = ge + n.length + 1;
          this.$refs.input.$el.setSelectionRange(de, de);
        } else
          w = w + (P - u), this.$refs.input.$el.setSelectionRange(w, w);
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", t), (a = this.$refs.clearIcon) !== null && a !== void 0 && (a = a.$el) !== null && a !== void 0 && a.style && (this.$refs.clearIcon.$el.style.display = wt(s) ? "none" : "block");
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
      this.focused = !0, !this.disabled && !this.readonly && this.$refs.input.$el.value !== yt() && this.highlightOnFocus && t.target.select(), this.$emit("focus", t);
    },
    onInputBlur: function(t) {
      var n, r;
      this.focused = !1;
      var i = t.target, a = this.validateValue(this.parseValue(i.value));
      this.$emit("blur", {
        originalEvent: t,
        value: i.value
      }), (n = (r = this.formField).onBlur) === null || n === void 0 || n.call(r, t), i.value = this.formatValue(a), i.setAttribute("aria-valuenow", a), this.updateModel(t, a), !this.disabled && !this.readonly && this.highlightOnFocus && pn();
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
      return ct(rt(rt({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size), this.buttonLayout, this.showButtons && this.buttonLayout));
    }
  },
  components: {
    InputText: Rt,
    AngleUpIcon: jt,
    AngleDownIcon: Nt,
    TimesIcon: Et
  }
}, Or = ["data-p"], Mr = ["data-p"], Nr = ["disabled", "data-p"], jr = ["disabled", "data-p"], _r = ["disabled", "data-p"], Ur = ["disabled", "data-p"];
function Vr(e, t, n, r, i, a) {
  var o = _("InputText"), s = _("TimesIcon");
  return d(), g("span", y({
    class: e.cx("root")
  }, e.ptmi("root"), {
    "data-p": a.dataP
  }), [v(o, {
    ref: "input",
    id: e.inputId,
    name: e.$formName,
    role: "spinbutton",
    class: L([e.cx("pcInputText"), e.inputClass]),
    style: Sn(e.inputStyle),
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
    return [v(s, y({
      ref: "clearIcon",
      class: [e.cx("clearIcon")],
      onClick: a.onClearClick
    }, e.ptm("clearIcon")), null, 16, ["class", "onClick"])];
  }) : x("", !0), e.showButtons && e.buttonLayout === "stacked" ? (d(), g("span", y({
    key: 1,
    class: e.cx("buttonGroup")
  }, e.ptm("buttonGroup"), {
    "data-p": a.dataP
  }), [F(e.$slots, "incrementbutton", {
    listeners: a.upButtonListeners
  }, function() {
    return [b("button", y({
      class: [e.cx("incrementButton"), e.incrementButtonClass]
    }, Ue(a.upButtonListeners, !0), {
      disabled: e.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, e.ptm("incrementButton"), {
      "data-p": a.dataP
    }), [F(e.$slots, e.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(d(), C(W(e.incrementIcon || e.incrementButtonIcon ? "span" : "AngleUpIcon"), y({
        class: [e.incrementIcon, e.incrementButtonIcon]
      }, e.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, Nr)];
  }), F(e.$slots, "decrementbutton", {
    listeners: a.downButtonListeners
  }, function() {
    return [b("button", y({
      class: [e.cx("decrementButton"), e.decrementButtonClass]
    }, Ue(a.downButtonListeners, !0), {
      disabled: e.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, e.ptm("decrementButton"), {
      "data-p": a.dataP
    }), [F(e.$slots, e.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(d(), C(W(e.decrementIcon || e.decrementButtonIcon ? "span" : "AngleDownIcon"), y({
        class: [e.decrementIcon, e.decrementButtonIcon]
      }, e.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, jr)];
  })], 16, Mr)) : x("", !0), F(e.$slots, "incrementbutton", {
    listeners: a.upButtonListeners
  }, function() {
    return [e.showButtons && e.buttonLayout !== "stacked" ? (d(), g("button", y({
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
      return [(d(), C(W(e.incrementIcon || e.incrementButtonIcon ? "span" : "AngleUpIcon"), y({
        class: [e.incrementIcon, e.incrementButtonIcon]
      }, e.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, _r)) : x("", !0)];
  }), F(e.$slots, "decrementbutton", {
    listeners: a.downButtonListeners
  }, function() {
    return [e.showButtons && e.buttonLayout !== "stacked" ? (d(), g("button", y({
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
      return [(d(), C(W(e.decrementIcon || e.decrementButtonIcon ? "span" : "AngleDownIcon"), y({
        class: [e.decrementIcon, e.decrementButtonIcon]
      }, e.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Ur)) : x("", !0)];
  })], 16, Or);
}
_t.render = Vr;
var Ut = {
  name: "AngleDoubleRightIcon",
  extends: Be
};
function zr(e) {
  return Jr(e) || Wr(e) || Gr(e) || Kr();
}
function Kr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Gr(e, t) {
  if (e) {
    if (typeof e == "string") return it(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? it(e, t) : void 0;
  }
}
function Wr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Jr(e) {
  if (Array.isArray(e)) return it(e);
}
function it(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Hr(e, t, n, r, i, a) {
  return d(), g("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), zr(t[0] || (t[0] = [b("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ut.render = Hr;
var Vt = {
  name: "AngleLeftIcon",
  extends: Be
};
function Zr(e) {
  return Yr(e) || Xr(e) || Qr(e) || qr();
}
function qr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Qr(e, t) {
  if (e) {
    if (typeof e == "string") return ot(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ot(e, t) : void 0;
  }
}
function Xr(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Yr(e) {
  if (Array.isArray(e)) return ot(e);
}
function ot(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ea(e, t, n, r, i, a) {
  return d(), g("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Zr(t[0] || (t[0] = [b("path", {
    d: "M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Vt.render = ea;
var ta = {
  name: "BasePaginator",
  extends: U,
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
  style: or,
  provide: function() {
    return {
      $pcPaginator: this,
      $parentInstance: this
    };
  }
}, zt = {
  name: "CurrentPageReport",
  hostName: "Paginator",
  extends: U,
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
function na(e, t, n, r, i, a) {
  return d(), g("span", y({
    class: e.cx("current")
  }, e.ptm("current")), B(a.text), 17);
}
zt.render = na;
var Kt = {
  name: "FirstPageLink",
  hostName: "Paginator",
  extends: U,
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
    AngleDoubleLeftIcon: Mt
  },
  directives: {
    ripple: Ee
  }
};
function ra(e, t, n, r, i, a) {
  var o = me("ripple");
  return le((d(), g("button", y({
    class: e.cx("first"),
    type: "button"
  }, a.getPTOptions("first"), {
    "data-pc-group-section": "pagebutton"
  }), [(d(), C(W(n.template || "AngleDoubleLeftIcon"), y({
    class: e.cx("firstIcon")
  }, a.getPTOptions("firstIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
Kt.render = ra;
var Gt = {
  name: "JumpToPageDropdown",
  hostName: "Paginator",
  extends: U,
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
    JTPSelect: pt
  }
};
function aa(e, t, n, r, i, a) {
  var o = _("JTPSelect");
  return d(), C(o, {
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
  }, Dt({
    _: 2
  }, [n.templates.jumptopagedropdownicon ? {
    name: "dropdownicon",
    fn: D(function(s) {
      return [(d(), C(W(n.templates.jumptopagedropdownicon), {
        class: L(s.class)
      }, null, 8, ["class"]))];
    }),
    key: "0"
  } : void 0]), 1032, ["modelValue", "options", "class", "disabled", "unstyled", "pt"]);
}
Gt.render = aa;
var Wt = {
  name: "JumpToPageInput",
  hostName: "Paginator",
  extends: U,
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
    JTPInput: _t
  }
};
function ia(e, t, n, r, i, a) {
  var o = _("JTPInput");
  return d(), C(o, {
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
Wt.render = ia;
var Jt = {
  name: "LastPageLink",
  hostName: "Paginator",
  extends: U,
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
    AngleDoubleRightIcon: Ut
  },
  directives: {
    ripple: Ee
  }
};
function oa(e, t, n, r, i, a) {
  var o = me("ripple");
  return le((d(), g("button", y({
    class: e.cx("last"),
    type: "button"
  }, a.getPTOptions("last"), {
    "data-pc-group-section": "pagebutton"
  }), [(d(), C(W(n.template || "AngleDoubleRightIcon"), y({
    class: e.cx("lastIcon")
  }, a.getPTOptions("lastIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
Jt.render = oa;
var Ht = {
  name: "NextPageLink",
  hostName: "Paginator",
  extends: U,
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
    AngleRightIcon: fn
  },
  directives: {
    ripple: Ee
  }
};
function sa(e, t, n, r, i, a) {
  var o = me("ripple");
  return le((d(), g("button", y({
    class: e.cx("next"),
    type: "button"
  }, a.getPTOptions("next"), {
    "data-pc-group-section": "pagebutton"
  }), [(d(), C(W(n.template || "AngleRightIcon"), y({
    class: e.cx("nextIcon")
  }, a.getPTOptions("nextIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
Ht.render = sa;
var Zt = {
  name: "PageLinks",
  hostName: "Paginator",
  extends: U,
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
    ripple: Ee
  }
}, la = ["aria-label", "aria-current", "onClick", "data-p-active"];
function ua(e, t, n, r, i, a) {
  var o = me("ripple");
  return d(), g("span", y({
    class: e.cx("pages")
  }, e.ptm("pages")), [(d(!0), g(H, null, $e(n.value, function(s) {
    return le((d(), g("button", y({
      key: s,
      class: e.cx("page", {
        pageLink: s
      }),
      type: "button",
      "aria-label": a.ariaPageLabel(s),
      "aria-current": s - 1 === n.page ? "page" : void 0,
      onClick: function(m) {
        return a.onPageLinkClick(m, s);
      }
    }, {
      ref_for: !0
    }, a.getPTOptions(s - 1, "page"), {
      "data-p-active": s - 1 === n.page
    }), [fe(B(s), 1)], 16, la)), [[o]]);
  }), 128))], 16);
}
Zt.render = ua;
var qt = {
  name: "PrevPageLink",
  hostName: "Paginator",
  extends: U,
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
    AngleLeftIcon: Vt
  },
  directives: {
    ripple: Ee
  }
};
function da(e, t, n, r, i, a) {
  var o = me("ripple");
  return le((d(), g("button", y({
    class: e.cx("prev"),
    type: "button"
  }, a.getPTOptions("prev"), {
    "data-pc-group-section": "pagebutton"
  }), [(d(), C(W(n.template || "AngleLeftIcon"), y({
    class: e.cx("prevIcon")
  }, a.getPTOptions("prevIcon")), null, 16, ["class"]))], 16)), [[o]]);
}
qt.render = da;
var Qt = {
  name: "RowsPerPageDropdown",
  hostName: "Paginator",
  extends: U,
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
    RPPSelect: pt
  }
};
function ca(e, t, n, r, i, a) {
  var o = _("RPPSelect");
  return d(), C(o, {
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
  }, Dt({
    _: 2
  }, [n.templates.rowsperpagedropdownicon ? {
    name: "dropdownicon",
    fn: D(function(s) {
      return [(d(), C(W(n.templates.rowsperpagedropdownicon), {
        class: L(s.class)
      }, null, 8, ["class"]))];
    }),
    key: "0"
  } : void 0]), 1032, ["modelValue", "options", "class", "disabled", "unstyled", "pt"]);
}
Qt.render = ca;
function st(e) {
  "@babel/helpers - typeof";
  return st = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, st(e);
}
function St(e, t) {
  return ga(e) || ma(e, t) || fa(e, t) || pa();
}
function pa() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function fa(e, t) {
  if (e) {
    if (typeof e == "string") return It(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? It(e, t) : void 0;
  }
}
function It(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ma(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, i, a, o, s = [], u = !0, m = !1;
    try {
      if (a = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        u = !1;
      } else for (; !(u = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); u = !0) ;
    } catch ($) {
      m = !0, i = $;
    } finally {
      try {
        if (!u && n.return != null && (o = n.return(), Object(o) !== o)) return;
      } finally {
        if (m) throw i;
      }
    }
    return s;
  }
}
function ga(e) {
  if (Array.isArray(e)) return e;
}
var Xt = {
  name: "Paginator",
  extends: ta,
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
        this.styleElement = document.createElement("style"), this.styleElement.type = "text/css", mn(this.styleElement, "nonce", (n = this.$primevue) === null || n === void 0 || (n = n.config) === null || n === void 0 || (n = n.csp) === null || n === void 0 ? void 0 : n.nonce), document.body.appendChild(this.styleElement);
        var r = "", i = Object.keys(this.template), a = {};
        i.sort(function(E, R) {
          return parseInt(E) - parseInt(R);
        }).forEach(function(E) {
          a[E] = t.template[E];
        });
        for (var o = 0, s = Object.entries(Object.entries(a)); o < s.length; o++) {
          var u = St(s[o], 2), m = u[0], $ = St(u[1], 1), k = $[0], w = void 0, P = void 0;
          k !== "default" && typeof Object.keys(a)[m - 1] == "string" ? P = Number(Object.keys(a)[m - 1].slice(0, -2)) + 1 + "px" : P = Object.keys(a)[m - 1], w = Object.entries(a)[m - 1] ? "and (min-width:".concat(P, ")") : "", k === "default" ? r += `
                            @media screen `.concat(w, ` {
                                .p-paginator[`).concat(this.$attrSelector, `],
                                    display: flex;
                                }
                            }
                        `) : r += `
.p-paginator-`.concat(k, ` {
    display: none;
}
@media screen `).concat(w, " and (max-width: ").concat(k, `) {
    .p-paginator-`).concat(k, ` {
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
      return st(this.template) === "object";
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
    CurrentPageReport: zt,
    FirstPageLink: Kt,
    LastPageLink: Jt,
    NextPageLink: Ht,
    PageLinks: Zt,
    PrevPageLink: qt,
    RowsPerPageDropdown: Qt,
    JumpToPageDropdown: Gt,
    JumpToPageInput: Wt
  }
};
function ha(e, t, n, r, i, a) {
  var o = _("FirstPageLink"), s = _("PrevPageLink"), u = _("NextPageLink"), m = _("LastPageLink"), $ = _("PageLinks"), k = _("CurrentPageReport"), w = _("RowsPerPageDropdown"), P = _("JumpToPageDropdown"), E = _("JumpToPageInput");
  return e.alwaysShow || a.pageLinks && a.pageLinks.length > 1 ? (d(), g("nav", In(y({
    key: 0
  }, e.ptmi("paginatorContainer"))), [(d(!0), g(H, null, $e(a.templateItems, function(R, M) {
    return d(), g("div", y({
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
    }) : (d(), g(H, {
      key: 1
    }, [e.$slots.start ? (d(), g("div", y({
      key: 0,
      class: e.cx("contentStart")
    }, {
      ref_for: !0
    }, e.ptm("contentStart")), [F(e.$slots, "start", {
      state: a.currentState
    })], 16)) : x("", !0), b("div", y({
      class: e.cx("content")
    }, {
      ref_for: !0
    }, e.ptm("content")), [(d(!0), g(H, null, $e(R, function(I) {
      return d(), g(H, {
        key: I
      }, [I === "FirstPageLink" ? (d(), C(o, {
        key: 0,
        "aria-label": a.getAriaLabel("firstPageLabel"),
        template: e.$slots.firsticon || e.$slots.firstpagelinkicon,
        onClick: t[0] || (t[0] = function(T) {
          return a.changePageToFirst(T);
        }),
        disabled: a.isFirstPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "PrevPageLink" ? (d(), C(s, {
        key: 1,
        "aria-label": a.getAriaLabel("prevPageLabel"),
        template: e.$slots.previcon || e.$slots.prevpagelinkicon,
        onClick: t[1] || (t[1] = function(T) {
          return a.changePageToPrev(T);
        }),
        disabled: a.isFirstPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "NextPageLink" ? (d(), C(u, {
        key: 2,
        "aria-label": a.getAriaLabel("nextPageLabel"),
        template: e.$slots.nexticon || e.$slots.nextpagelinkicon,
        onClick: t[2] || (t[2] = function(T) {
          return a.changePageToNext(T);
        }),
        disabled: a.isLastPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "LastPageLink" ? (d(), C(m, {
        key: 3,
        "aria-label": a.getAriaLabel("lastPageLabel"),
        template: e.$slots.lasticon || e.$slots.lastpagelinkicon,
        onClick: t[3] || (t[3] = function(T) {
          return a.changePageToLast(T);
        }),
        disabled: a.isLastPage || a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "template", "disabled", "unstyled", "pt"])) : I === "PageLinks" ? (d(), C($, {
        key: 4,
        "aria-label": a.getAriaLabel("pageLabel"),
        value: a.pageLinks,
        page: a.page,
        onClick: t[4] || (t[4] = function(T) {
          return a.changePageLink(T);
        }),
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "value", "page", "unstyled", "pt"])) : I === "CurrentPageReport" ? (d(), C(k, {
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
      }, null, 8, ["template", "currentPage", "page", "pageCount", "first", "rows", "totalRecords", "unstyled", "pt"])) : I === "RowsPerPageDropdown" && e.rowsPerPageOptions ? (d(), C(w, {
        key: 6,
        "aria-label": a.getAriaLabel("rowsPerPageLabel"),
        rows: i.d_rows,
        options: e.rowsPerPageOptions,
        onRowsChange: t[5] || (t[5] = function(T) {
          return a.onRowChange(T);
        }),
        disabled: a.empty,
        templates: e.$slots,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "rows", "options", "disabled", "templates", "unstyled", "pt"])) : I === "JumpToPageDropdown" ? (d(), C(P, {
        key: 7,
        "aria-label": a.getAriaLabel("jumpToPageDropdownLabel"),
        page: a.page,
        pageCount: a.pageCount,
        onPageChange: t[6] || (t[6] = function(T) {
          return a.changePage(T);
        }),
        disabled: a.empty,
        templates: e.$slots,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["aria-label", "page", "pageCount", "disabled", "templates", "unstyled", "pt"])) : I === "JumpToPageInput" ? (d(), C(E, {
        key: 8,
        page: a.currentPage,
        onPageChange: t[7] || (t[7] = function(T) {
          return a.changePage(T);
        }),
        disabled: a.empty,
        unstyled: e.unstyled,
        pt: e.pt
      }, null, 8, ["page", "disabled", "unstyled", "pt"])) : x("", !0)], 64);
    }), 128))], 16), e.$slots.end ? (d(), g("div", y({
      key: 1,
      class: e.cx("contentEnd")
    }, {
      ref_for: !0
    }, e.ptm("contentEnd")), [F(e.$slots, "end", {
      state: a.currentState
    })], 16)) : x("", !0)], 64))], 16);
  }), 128))], 16)) : x("", !0);
}
Xt.render = ha;
function ke(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function ba(e, t) {
  return e;
}
function va(e, t, n) {
  if (t !== void 0 && !t) return null;
  const r = ke(e) ? e : {}, i = [
    r,
    ke(r.data) ? r.data : null,
    ke(r.payload) ? r.payload : null,
    ke(r.detail) ? r.detail : null
  ].filter(Boolean);
  for (const a of i) {
    if (a.event !== "component.meta.changed" && a.event !== "component.deleting" && a.event !== "component.deleted") continue;
    const o = String(a.component_id || ""), s = String(r.topic || a.topic || "");
    if (t === void 0) {
      if (!o && (!s.startsWith("component.") || s === "component.")) continue;
    } else if (o && o !== t || !o && s !== `component.${t}`) continue;
    const u = o || t || s.slice(10);
    return a.event === "component.deleting" && typeof a.deletion_job_id == "string" && a.deletion_job_id ? { event: a.event, component_id: u, deletion_job_id: a.deletion_job_id } : a.event !== "component.meta.changed" ? { event: a.event, component_id: u } : {
      event: "component.meta.changed",
      component_id: u,
      meta: ba(ke(a.meta) ? a.meta : {}),
      deleted: Array.isArray(a.deleted) ? a.deleted.map(String) : []
    };
  }
  return null;
}
function ya(e, t, n) {
  const r = va(e, t);
  return r?.event === "component.meta.changed" ? r : null;
}
function wa(e, t, n) {
  if (!e) return null;
  const r = Rn(`component.${e}`, (i) => {
    const a = ya(i, e);
    a && t(a);
  });
  return typeof r == "function" ? r : null;
}
function ka(e) {
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
function Yt(e) {
  const t = ka(e);
  return t === null ? "" : new Date(t).toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
var Pa = se.extend({
  name: "focustrap-directive"
}), Ca = hn.extend({
  style: Pa
});
function Ae(e) {
  "@babel/helpers - typeof";
  return Ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ae(e);
}
function Lt(e, t) {
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
    t % 2 ? Lt(Object(n), !0).forEach(function(r) {
      xa(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Lt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function xa(e, t, n) {
  return (t = $a(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function $a(e) {
  var t = Sa(e, "string");
  return Ae(t) == "symbol" ? t : t + "";
}
function Sa(e, t) {
  if (Ae(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ae(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ia = Ca.extend("focustrap", {
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
        s.forEach(function(u) {
          if (u.type === "childList" && !t.contains(document.activeElement)) {
            var m = function(k) {
              var w = kt(k) ? kt(k, r.getComputedSelector(t.$_pfocustrap_focusableselector)) ? k : we(t, r.getComputedSelector(t.$_pfocustrap_focusableselector)) : we(k);
              return Xe(w) ? w : k.nextSibling && m(k.nextSibling);
            };
            xe(m(u.nextSibling));
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
      var r = n.value || {}, i = r.autoFocusSelector, a = i === void 0 ? "" : i, o = r.firstFocusableSelector, s = o === void 0 ? "" : o, u = r.autoFocus, m = u === void 0 ? !1 : u, $ = we(t, "[autofocus]".concat(this.getComputedSelector(a)));
      m && !$ && ($ = we(t, this.getComputedSelector(s))), xe($);
    },
    onFirstHiddenElementFocus: function(t) {
      var n, r = t.currentTarget, i = t.relatedTarget, a = i === r.$_pfocustrap_lasthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? we(r.parentElement, this.getComputedSelector(r.$_pfocustrap_focusableselector)) : r.$_pfocustrap_lasthiddenfocusableelement;
      xe(a);
    },
    onLastHiddenElementFocus: function(t) {
      var n, r = t.currentTarget, i = t.relatedTarget, a = i === r.$_pfocustrap_firsthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? gn(r.parentElement, this.getComputedSelector(r.$_pfocustrap_focusableselector)) : r.$_pfocustrap_firsthiddenfocusableelement;
      xe(a);
    },
    createHiddenFocusableElements: function(t, n) {
      var r = this, i = n.value || {}, a = i.tabIndex, o = a === void 0 ? 0 : a, s = i.firstFocusableSelector, u = s === void 0 ? "" : s, m = i.lastFocusableSelector, $ = m === void 0 ? "" : m, k = function(R) {
        return bn("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: o,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: R?.bind(r)
        });
      }, w = k(this.onFirstHiddenElementFocus), P = k(this.onLastHiddenElementFocus);
      w.$_pfocustrap_lasthiddenfocusableelement = P, w.$_pfocustrap_focusableselector = u, w.setAttribute("data-pc-section", "firstfocusableelement"), P.$_pfocustrap_firsthiddenfocusableelement = w, P.$_pfocustrap_focusableselector = $, P.setAttribute("data-pc-section", "lastfocusableelement"), t.prepend(w), t.append(P);
    }
  }
});
function La() {
  yn({
    variableName: Tt("scrollbar.width").name
  });
}
function Aa() {
  vn({
    variableName: Tt("scrollbar.width").name
  });
}
var Ta = `
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
`, Da = {
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
}, Ba = {
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
}, Ea = se.extend({
  name: "drawer",
  style: Ta,
  classes: Ba,
  inlineStyles: Da
}), Ra = {
  name: "BaseDrawer",
  extends: U,
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
  style: Ea,
  provide: function() {
    return {
      $pcDrawer: this,
      $parentInstance: this
    };
  }
};
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
function qe(e, t, n) {
  return (t = Fa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Fa(e) {
  var t = Oa(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function Oa(e, t) {
  if (Te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Te(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var en = {
  name: "Drawer",
  extends: Ra,
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
    this.disableDocumentSettings(), this.mask && this.autoZIndex && Ze.clear(this.mask), this.container = null, this.mask = null;
  },
  methods: {
    hide: function() {
      this.$emit("update:visible", !1);
    },
    onEnter: function() {
      this.$emit("show"), this.focus(), this.bindDocumentKeyDownListener(), this.autoZIndex && Ze.set("modal", this.mask, this.baseZIndex || this.$primevue.config.zIndex.modal);
    },
    onAfterEnter: function() {
      this.enableDocumentSettings(), this.$emit("after-show");
    },
    onBeforeLeave: function() {
      this.modal && !this.isUnstyled && kn(this.mask, "p-overlay-mask-leave-active"), this.$emit("before-hide");
    },
    onLeave: function() {
      this.$emit("hide");
    },
    onAfterLeave: function() {
      this.autoZIndex && Ze.clear(this.mask), this.unbindDocumentKeyDownListener(), this.containerVisible = !1, this.disableDocumentSettings(), this.$emit("after-hide");
    },
    onMaskClick: function(t) {
      this.dismissable && this.modal && this.mask === t.target && this.hide();
    },
    focus: function() {
      var t = function(i) {
        return i && i.querySelector("[autofocus]");
      }, n = this.$slots.header && t(this.headerContainer);
      n || (n = this.$slots.default && t(this.container), n || (n = this.$slots.footer && t(this.footerContainer), n || (n = this.closeButton))), n && xe(n);
    },
    enableDocumentSettings: function() {
      this.dismissable && !this.modal && this.bindOutsideClickListener(), this.blockScroll && La();
    },
    disableDocumentSettings: function() {
      this.unbindOutsideClickListener(), this.blockScroll && Aa();
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
      return ct(qe(qe(qe({
        "full-screen": this.position === "full"
      }, this.position, this.position), "open", this.containerVisible), "modal", this.modal));
    }
  },
  directives: {
    focustrap: Ia
  },
  components: {
    Button: j,
    Portal: wn,
    TimesIcon: Et
  }
}, Ma = ["data-p"], Na = ["role", "aria-modal", "data-p"];
function ja(e, t, n, r, i, a) {
  var o = _("Button"), s = _("Portal"), u = me("focustrap");
  return d(), C(s, null, {
    default: D(function() {
      return [i.containerVisible ? (d(), g("div", y({
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
      }, e.ptm("mask")), [v(Ln, y({
        name: "p-drawer",
        onEnter: a.onEnter,
        onAfterEnter: a.onAfterEnter,
        onBeforeLeave: a.onBeforeLeave,
        onLeave: a.onLeave,
        onAfterLeave: a.onAfterLeave,
        appear: ""
      }, e.ptm("transition")), {
        default: D(function() {
          return [e.visible ? le((d(), g("div", y({
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
          }) : (d(), g(H, {
            key: 1
          }, [b("div", y({
            ref: a.headerContainerRef,
            class: e.cx("header")
          }, e.ptm("header")), [F(e.$slots, "header", {
            class: L(e.cx("title"))
          }, function() {
            return [e.header ? (d(), g("div", y({
              key: 0,
              class: e.cx("title")
            }, e.ptm("title")), B(e.header), 17)) : x("", !0)];
          }), e.showCloseIcon ? F(e.$slots, "closebutton", {
            key: 0,
            closeCallback: a.hide
          }, function() {
            return [v(o, y({
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
              icon: D(function(m) {
                return [F(e.$slots, "closeicon", {}, function() {
                  return [(d(), C(W(e.closeIcon ? "span" : "TimesIcon"), y({
                    class: [e.closeIcon, m.class]
                  }, e.ptm("pcCloseButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["class", "aria-label", "unstyled", "onClick", "pt"])];
          }) : x("", !0)], 16), b("div", y({
            ref: a.contentRef,
            class: e.cx("content")
          }, e.ptm("content")), [F(e.$slots, "default")], 16), e.$slots.footer ? (d(), g("div", y({
            key: 0,
            ref: a.footerContainerRef,
            class: e.cx("footer")
          }, e.ptm("footer")), [F(e.$slots, "footer")], 16)) : x("", !0)], 64))], 16, Na)), [[u]]) : x("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])], 16, Ma)) : x("", !0)];
    }),
    _: 3
  });
}
en.render = ja;
function lt(e) {
  const t = e || "";
  return t.startsWith("image/") ? "tabler:photo" : t === "application/pdf" ? "tabler:file-type-pdf" : t.includes("word") || t.includes("opendocument.text") || t === "application/rtf" ? "tabler:file-type-doc" : t.includes("sheet") || t.includes("excel") || t.includes("spreadsheet") || t === "text/csv" ? "tabler:file-type-xls" : t.includes("presentation") || t.includes("powerpoint") ? "tabler:file-type-ppt" : t === "application/epub+zip" ? "tabler:book" : t.startsWith("text/") || t === "application/json" || t === "application/xml" ? "tabler:file-text" : "tabler:file";
}
function De(e) {
  if (!e) return "0 B";
  const t = ["B", "KB", "MB", "GB"], n = Math.min(Math.floor(Math.log(e) / Math.log(1024)), t.length - 1);
  return `${(e / Math.pow(1024, n)).toFixed(n ? 1 : 0)} ${t[n]}`;
}
function ue(e) {
  return e === "failed" ? "error" : e || "uploaded";
}
function tn(e) {
  return ue(e.status) === "error";
}
function _a(e) {
  switch (ue(e)) {
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
function Ua(e) {
  const t = ue(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function ee(e) {
  return (e.filename || "").trim() || "Untitled file";
}
function nn(e) {
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
function ut(e) {
  let t = e.trim().replace(/^[\w.]+:[\w.]+:\d+:\s*/, "");
  return t = t.replace(/(\d{4,})\s*bytes/g, (n, r) => De(Number(r))), t = t.replace(/\(max\s+(\d{4,})\)/g, (n, r) => `(max ${De(Number(r))})`), t && t.charAt(0).toUpperCase() + t.slice(1);
}
const Va = ["image/", "audio/", "video/", "text/"], za = /* @__PURE__ */ new Set([
  "application/pdf",
  "application/json",
  "application/xml",
  "application/javascript",
  "application/x-yaml",
  "application/sql",
  "application/xhtml+xml"
]);
function ze(e) {
  const t = (e || "").toLowerCase();
  return Va.some((n) => t.startsWith(n)) || za.has(t);
}
const Ka = ["ocr_error", "asr_error", "conversion_error"], Qe = {
  transcription_failed: "Text recognition failed.",
  persist_failed: "The recognized text could not be saved.",
  storage_unavailable: "The stored file could not be read.",
  storage_stat_failed: "The stored file could not be read.",
  storage_read_failed: "The stored file could not be read.",
  storage_pointer_missing: "The stored file is missing.",
  no_text_detected: "No text was found in this file.",
  too_large: "The file is too large for transcription.",
  transcript_too_large: "The transcript is too large to keep."
}, Ga = /* @__PURE__ */ new Set(["no_text_detected", "too_large", "transcript_too_large"]);
function Wa(e) {
  for (const t of Ka) {
    const n = e.meta?.[t];
    if (typeof n == "string" && n) return n;
  }
  return "";
}
function Ja(e) {
  const t = Wa(e);
  return tn(e) ? { tone: "error", text: Qe[t] || (t ? "Text recognition failed." : e.error ? ut(e.error) : "Upload processing failed.") } : !t || ue(e.status) !== "completed" ? null : Ga.has(t) ? { tone: "info", text: Qe[t] } : { tone: "info", text: `${Qe[t] || "Text recognition did not complete."} The extracted text is shown.` };
}
function Ha(e) {
  const t = ue(e.status);
  return t === "completed" || t === "error" || t === "processing";
}
const Za = /* @__PURE__ */ new Set(["completed", "error"]);
function qa(e) {
  return !Za.has(ue(e.status));
}
function oe(e) {
  return e.role === "primary" && (e.kind === "markdown" || e.mime_type === "text/markdown");
}
function dt(e) {
  return oe(e) ? "Markdown" : e.role === "extracted-image" ? e.label || "Image" : e.label || e.role || e.kind || e.artifact_id;
}
function Qa(e) {
  const t = typeof e.metadata?.width == "number" && typeof e.metadata?.height == "number" ? `${e.metadata.width}×${e.metadata.height}` : null;
  return [
    oe(e) ? "Converted markdown" : e.role === "extracted-image" ? "Extracted image" : e.kind,
    e.mime_type,
    e.size ? De(e.size) : null,
    t,
    e.occurrence_count && e.occurrence_count > 1 ? `${e.occurrence_count} occurrences` : null
  ].filter(Boolean).join(" · ");
}
function Xa(e) {
  const t = (e || "").toLowerCase();
  return t.startsWith("text/") || t.includes("markdown");
}
const Ya = {
  key: 0,
  class: "kx-side"
}, ei = { class: "kx-pv-head" }, ti = { class: "kx-ficon" }, ni = { class: "kx-pv-id" }, ri = ["title"], ai = { class: "kx-pv-sub" }, ii = ["role"], oi = { class: "kx-views" }, si = ["content-type", "source-url", "filename", "alt"], li = { class: "kx-parts-head" }, ui = { class: "kx-parts-range" }, di = { class: "kx-parts-pager" }, ci = { class: "kx-parts-pageno" }, pi = {
  id: "uploads-extracted-parts",
  class: "kx-parts-list",
  role: "region",
  "aria-label": "Extracted parts"
}, fi = {
  key: 0,
  class: "kx-part-loading"
}, mi = /* @__PURE__ */ Bt({
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
    retryUpload: { type: Function }
  },
  emits: ["update:partsExpanded"],
  setup(e, { emit: t }) {
    const n = e, r = G(() => n.preview ? Ja(n.preview) || (n.preview.status === "processing" ? { tone: "info", text: "Processing. Retry is available if the job has stopped." } : null) : null), i = G(() => n.preview ? [nn(n.preview), De(n.preview.size), Yt(n.preview.created_at)].filter(Boolean).join(" · ") : ""), a = t;
    return (o, s) => (d(), C(l(en), {
      visible: !!e.preview,
      position: "right",
      modal: !0,
      dismissable: !0,
      "close-on-escape": !0,
      "show-close-icon": !1,
      class: "kx-side-drawer",
      pt: { root: { style: "width: min(1400px, 82vw)" }, content: { class: "kx-side-drawer-content" } },
      "aria-label": "File preview",
      "onUpdate:visible": s[4] || (s[4] = (u) => {
        u || e.closePreview();
      })
    }, {
      default: D(() => [
        e.preview ? (d(), g("div", Ya, [
          b("header", ei, [
            b("span", ti, [
              v(l(A), {
                icon: l(lt)(e.preview.mime_type),
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            b("div", ni, [
              b("div", {
                class: "kx-pv-name",
                title: l(ee)(e.preview)
              }, B(l(ee)(e.preview)), 9, ri),
              b("div", ai, B(i.value), 1)
            ]),
            v(l(j), {
              type: "button",
              text: "",
              rounded: "",
              size: "small",
              "data-testid": "uploads-preview-download",
              disabled: e.busyAction,
              "aria-label": "Download",
              onClick: e.downloadActive
            }, {
              icon: D(({ class: u }) => [
                v(l(A), {
                  icon: e.busyAction ? "tabler:loader-2" : "tabler:download",
                  class: L([u, e.busyAction && "spin"]),
                  "aria-hidden": "true"
                }, null, 8, ["icon", "class"])
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            v(l(j), {
              type: "button",
              text: "",
              rounded: "",
              size: "small",
              "data-testid": "uploads-preview-open",
              disabled: e.busyAction,
              "aria-label": "Open in new tab",
              onClick: e.openActive
            }, {
              icon: D(({ class: u }) => [
                v(l(A), {
                  icon: "tabler:external-link",
                  class: L(u),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            v(l(j), {
              type: "button",
              text: "",
              rounded: "",
              size: "small",
              "data-testid": "uploads-preview-close",
              "aria-label": "Close preview",
              onClick: e.closePreview
            }, {
              icon: D(({ class: u }) => [
                v(l(A), {
                  icon: "tabler:x",
                  class: L(u),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          r.value ? (d(), g("div", {
            key: 0,
            class: L(["kx-pv-fail", { "kx-pv-info": r.value.tone === "info" }]),
            role: r.value.tone === "error" ? "alert" : "status",
            "data-testid": "uploads-preview-error"
          }, [
            v(l(A), {
              icon: r.value.tone === "error" ? "tabler:alert-triangle" : "tabler:info-circle",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            b("span", null, B(r.value.text), 1),
            r.value.tone === "error" || e.preview.status === "processing" ? (d(), C(l(j), {
              key: 0,
              type: "button",
              class: "kx-pv-retry",
              size: "small",
              severity: r.value.tone === "error" ? "danger" : "secondary",
              outlined: "",
              label: "Retry",
              "data-testid": "uploads-preview-retry",
              loading: e.retrying,
              disabled: e.retrying,
              onClick: s[0] || (s[0] = (u) => e.retryUpload(e.preview))
            }, {
              icon: D(({ class: u }) => [
                v(l(A), {
                  icon: "tabler:refresh",
                  class: L(u),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["severity", "loading", "disabled"])) : x("", !0)
          ], 10, ii)) : x("", !0),
          b("div", oi, [
            v(l(j), {
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
              icon: D(({ class: u }) => [
                v(l(A), {
                  icon: "tabler:file",
                  class: L(u),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["outlined", "aria-pressed", "onClick"]),
            e.hasPrimary ? (d(), C(l(j), {
              key: 0,
              type: "button",
              class: "kx-part",
              size: "small",
              rounded: "",
              outlined: !(e.artifactView && l(oe)(e.artifactView)),
              label: "Markdown",
              "data-testid": "uploads-view-markdown",
              "aria-pressed": !!e.artifactView && l(oe)(e.artifactView),
              pt: { label: { class: "kx-part-label" } },
              onClick: e.viewPrimary
            }, {
              icon: D(({ class: u }) => [
                v(l(A), {
                  icon: "tabler:markdown",
                  class: L(u),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            }, 8, ["outlined", "aria-pressed", "onClick"])) : x("", !0)
          ]),
          b("div", {
            class: L(["kx-pv-view", { "kx-pv-padded": l(Xa)(e.activePreviewSource(e.preview).contentType) }])
          }, [
            (d(), g("wc-resource-view", {
              key: e.artifactView ? `${e.preview.uuid}:${e.artifactView.artifact_id}` : e.preview.uuid,
              class: "kx-pv-rv",
              "content-type": e.activePreviewSource(e.preview).contentType,
              "source-url": e.activePreviewSource(e.preview).sourceUrl,
              filename: e.activePreviewSource(e.preview).filename,
              alt: e.activePreviewSource(e.preview).filename
            }, null, 8, si))
          ], 2),
          e.partsTotal || e.artifactsLoading ? (d(), g("div", {
            key: 1,
            class: L(["kx-parts-panel", { open: e.partsExpanded }])
          }, [
            b("div", li, [
              v(l(j), {
                type: "button",
                text: "",
                size: "small",
                label: "Parts",
                badge: String(e.partsTotal),
                "badge-severity": "secondary",
                "data-testid": "uploads-parts-toggle",
                "aria-expanded": e.partsExpanded,
                "aria-controls": "uploads-extracted-parts",
                onClick: s[1] || (s[1] = (u) => a("update:partsExpanded", !e.partsExpanded))
              }, {
                icon: D(({ class: u }) => [
                  v(l(A), {
                    icon: e.partsExpanded ? "tabler:chevron-down" : "tabler:chevron-right",
                    class: L(u),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }, 8, ["badge", "aria-expanded"]),
              e.partsExpanded && e.partsPages > 1 ? (d(), g(H, { key: 0 }, [
                b("span", ui, B(e.partsRangeStart) + "–" + B(e.partsRangeEnd), 1),
                b("div", di, [
                  v(l(j), {
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    "data-testid": "uploads-parts-previous",
                    disabled: e.partsPage <= 1,
                    "aria-label": "Previous parts",
                    onClick: s[2] || (s[2] = (u) => e.gotoPartsPage(e.partsPage - 1))
                  }, {
                    icon: D(({ class: u }) => [
                      v(l(A), {
                        icon: "tabler:chevron-left",
                        class: L(u),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  b("span", ci, B(e.partsPage) + " / " + B(e.partsPages), 1),
                  v(l(j), {
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    "data-testid": "uploads-parts-next",
                    disabled: e.partsPage >= e.partsPages,
                    "aria-label": "Next parts",
                    onClick: s[3] || (s[3] = (u) => e.gotoPartsPage(e.partsPage + 1))
                  }, {
                    icon: D(({ class: u }) => [
                      v(l(A), {
                        icon: "tabler:chevron-right",
                        class: L(u),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ], 64)) : x("", !0)
            ]),
            le(b("div", pi, [
              (d(!0), g(H, null, $e(e.currentArtifacts, (u) => (d(), C(l(j), {
                key: u.artifact_id,
                type: "button",
                class: "kx-part",
                size: "small",
                rounded: "",
                outlined: e.artifactView?.artifact_id !== u.artifact_id,
                label: l(dt)(u),
                disabled: !u.raw_url,
                title: l(Qa)(u),
                "data-testid": "uploads-view-artifact",
                "data-artifact-id": u.artifact_id,
                "aria-pressed": e.artifactView?.artifact_id === u.artifact_id,
                pt: { label: { class: "kx-part-label" } },
                onClick: (m) => e.viewArtifact(u)
              }, {
                icon: D(({ class: m }) => [
                  v(l(A), {
                    icon: l(lt)(u.mime_type),
                    class: L(m),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 2
              }, 1032, ["outlined", "label", "disabled", "title", "data-artifact-id", "aria-pressed", "onClick"]))), 128)),
              e.artifactsLoading ? (d(), g("span", fi, [
                v(l(A), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                })
              ])) : x("", !0)
            ], 512), [
              [An, e.partsExpanded]
            ])
          ], 2)) : x("", !0)
        ])) : x("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), Pe = 30;
function gi(e) {
  const t = O(null), n = O(null), r = O({}), i = O(!1), a = O(!1);
  function o(p) {
    return r.value[p] || {
      loaded: !1,
      loading: !1,
      error: "",
      primary: null,
      parts: [],
      total: 0,
      page: 1
    };
  }
  function s(p, S) {
    r.value = { ...r.value, [p]: S };
  }
  function u(p) {
    return p.role === "source" || p.locator?.type === "upload.original";
  }
  function m(p) {
    const S = o(p).primary;
    return S && oe(S) && S.raw_url ? S : null;
  }
  function $(p) {
    if (t.value?.uuid !== p.uuid || n.value || ze(p.mime_type)) return;
    const S = m(p.uuid);
    S && (n.value = S);
  }
  function k(p) {
    return { contentType: p.mime_type, sourceUrl: p.raw_url || "", filename: ee(p) };
  }
  function w(p) {
    if (n.value?.raw_url)
      return {
        contentType: n.value.mime_type || "application/octet-stream",
        sourceUrl: n.value.raw_url,
        filename: dt(n.value)
      };
    if (!ze(p.mime_type)) {
      const S = m(p.uuid);
      if (S?.raw_url)
        return {
          contentType: S.mime_type || "text/markdown",
          sourceUrl: S.raw_url,
          filename: dt(S)
        };
    }
    return k(p);
  }
  function P(p) {
    n.value && t.value?.uuid !== p.uuid && (n.value = null), t.value = p, Oe(p);
  }
  function E() {
    t.value = null, n.value = null;
  }
  function R() {
    n.value = null;
  }
  function M() {
    const p = t.value ? m(t.value.uuid) : null;
    p && (n.value = p);
  }
  function I(p) {
    p.raw_url && (n.value = p);
  }
  const T = G(() => t.value ? o(t.value.uuid).parts : []), V = G(() => t.value ? o(t.value.uuid).total : 0), J = G(() => t.value ? o(t.value.uuid).page : 1), q = G(() => Math.max(1, Math.ceil(V.value / Pe))), te = G(() => V.value ? (J.value - 1) * Pe + 1 : 0), ne = G(() => Math.min(V.value, (J.value - 1) * Pe + T.value.length)), ge = G(() => !!(t.value && m(t.value.uuid))), de = G(() => !!(t.value && o(t.value.uuid).loading));
  function Ke(p) {
    if (!t.value) return;
    const S = Math.min(Math.max(1, p), q.value);
    S !== J.value && Oe(t.value, !0, S);
  }
  function Re() {
    if (n.value?.raw_url) return n.value.raw_url;
    if (t.value && !ze(t.value.mime_type)) {
      const p = m(t.value.uuid);
      if (p?.raw_url) return p.raw_url;
    }
    return t.value?.raw_url || "";
  }
  function Ge() {
    if (n.value) return n.value.label || n.value.artifact_id;
    if (t.value && !ze(t.value.mime_type)) {
      const p = m(t.value.uuid);
      if (p) return p.label || p.artifact_id;
    }
    return t.value ? ee(t.value) : "download";
  }
  async function Fe(p) {
    if (!p) return null;
    try {
      const S = await ie.get(p, { responseType: "blob" });
      return URL.createObjectURL(S.data);
    } catch (S) {
      return e.value = S instanceof Error ? S.message : "failed to fetch file", null;
    }
  }
  async function We() {
    if (!a.value) {
      a.value = !0;
      try {
        const p = await Fe(Re());
        if (!p) return;
        const S = document.createElement("a");
        S.href = p, S.download = Ge(), S.click(), setTimeout(() => URL.revokeObjectURL(p), 1e4);
      } finally {
        a.value = !1;
      }
    }
  }
  async function Je() {
    if (!a.value) {
      a.value = !0;
      try {
        const p = await Fe(Re());
        p && (window.open(p, "_blank", "noopener"), setTimeout(() => URL.revokeObjectURL(p), 6e4));
      } finally {
        a.value = !1;
      }
    }
  }
  async function Oe(p, S = !1, ce = 1) {
    const re = o(p.uuid);
    if (!((re.loaded || re.loading) && !S)) {
      s(p.uuid, { ...re, loading: !0, error: "" });
      try {
        const pe = (ce - 1) * Pe, { data: ae } = await ie.get(`/api/v1/uploads/${p.uuid}/artifacts`, { params: { limit: Pe, offset: pe } });
        if (!ae.success) {
          s(p.uuid, { ...re, loaded: !0, loading: !1, error: ae.error || "failed to load artifacts", primary: null, parts: [], total: 0, page: ce });
          return;
        }
        const Me = ae.artifacts || [], Q = ae.primary || Me.find((z) => oe(z) && !!z.raw_url) || null, Z = Me.filter((z) => !u(z) && !oe(z));
        s(p.uuid, {
          loaded: !0,
          loading: !1,
          error: "",
          primary: Q,
          parts: Z,
          total: Number(ae.meta?.total ?? Z.length),
          page: ce
        }), ce === 1 && $(p);
      } catch (pe) {
        s(p.uuid, { ...re, loaded: !0, loading: !1, error: pe instanceof Error ? pe.message : "failed to load artifacts" });
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
    isSourceArtifact: u,
    primaryMarkdownFor: m,
    activePreviewSource: w,
    openPreview: P,
    closePreview: E,
    viewOriginal: R,
    viewPrimary: M,
    viewArtifact: I,
    currentArtifacts: T,
    partsTotal: V,
    partsPage: J,
    partsPages: q,
    partsRangeStart: te,
    partsRangeEnd: ne,
    hasPrimary: ge,
    artifactsLoading: de,
    gotoPartsPage: Ke,
    downloadActive: We,
    openActive: Je
  };
}
const hi = () => Pn(), bi = () => Cn(), vi = { class: "kx" }, yi = { class: "kx-head" }, wi = { class: "kx-head-icon" }, ki = { class: "kx-head-actions" }, Pi = { class: "kx-count" }, Ci = {
  key: 0,
  class: "kx-count kx-pending"
}, xi = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, $i = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Si = {
  key: 2,
  class: "kx-err",
  role: "alert",
  "data-testid": "uploads-link-error"
}, Ii = { class: "kx-body" }, Li = { class: "kx-main" }, Ai = { class: "kx-drop-title" }, Ti = {
  key: 0,
  class: "kx-loading"
}, Di = {
  key: 1,
  class: "kx-empty"
}, Bi = { class: "kx-empty-ico" }, Ei = {
  key: 2,
  class: "kx-empty"
}, Ri = { class: "kx-list" }, Fi = { class: "kx-ficon" }, Oi = { class: "kx-id" }, Mi = ["title"], Ni = { class: "kx-sub" }, ji = { class: "kx-type" }, _i = ["title"], Ui = { class: "kx-date" }, Vi = { class: "kx-actions" }, zi = {
  key: 0,
  class: "kx-progress",
  "aria-hidden": "true"
}, Ce = 30, Ki = /* @__PURE__ */ Bt({
  __name: "uploads",
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "error"]), n = [
      { label: "All status", value: "all" },
      { label: "Uploaded", value: "uploaded" },
      { label: "Processing", value: "processing" },
      { label: "Completed", value: "completed" },
      { label: "Error", value: "error" }
    ], r = O([]), i = O(0), a = O(!1), o = O(""), s = O(!1), u = O(0), m = O(""), $ = O("all"), k = O(1), w = O(!1);
    let P = null, E = !1, R = !1;
    const M = O(!1), {
      preview: I,
      artifactView: T,
      partsExpanded: V,
      busyAction: J,
      activePreviewSource: q,
      openPreview: te,
      closePreview: ne,
      viewOriginal: ge,
      viewPrimary: de,
      viewArtifact: Ke,
      currentArtifacts: Re,
      partsTotal: Ge,
      partsPage: Fe,
      partsPages: We,
      partsRangeStart: Je,
      partsRangeEnd: Oe,
      hasPrimary: p,
      artifactsLoading: S,
      gotoPartsPage: ce,
      downloadActive: re,
      openActive: pe
    } = gi(o), ae = hi(), Me = bi(), Q = O(""), Z = O(!1);
    let z = 0, Ne = null;
    function ft(h = "") {
      Ne = h, Me("navigate", { path: h });
    }
    function rn(h) {
      z++, Q.value = "", Z.value = !1, te(h), ft(h.uuid);
    }
    function he() {
      z++, Q.value = "", Z.value = !1, ne(), ft();
    }
    Ve(() => ae.value.route, async (h) => {
      const c = String(h ?? "").replace(/^\/+|\/+$/g, "");
      if (Ne !== null && c !== Ne) return;
      Ne = null;
      const f = ++z;
      if (Q.value = "", Z.value = !1, c !== I.value?.uuid && (ne(), !!c)) {
        Z.value = !0;
        try {
          const { data: N } = await ie.get(`/api/v1/uploads/${encodeURIComponent(c)}`);
          if (f !== z) return;
          if (!N.success || !N.upload) throw new Error(N.error || "Failed to load upload");
          const K = N.upload;
          te({ ...K, filename: K.filename || String(K.meta?.filename || "") });
        } catch (N) {
          if (f !== z) return;
          const K = N?.response?.status;
          Q.value = K === 403 || K === 404 ? "File not found or you do not have permission to view it." : N instanceof Error ? N.message : "Failed to load upload.";
        } finally {
          f === z && (Z.value = !1);
        }
      }
    }, { immediate: !0 });
    const He = O(""), je = O({});
    let X = null, _e = "";
    const mt = G(() => typeof je.value.pending_count == "number" ? je.value.pending_count : r.value.filter((h) => !t.has(ue(h.status))).length), gt = G(() => Math.max(1, Math.ceil(i.value / Ce)));
    function Y() {
      return R ? Promise.resolve() : (E = !0, P || (a.value = !0, P = Promise.resolve().then(async () => {
        try {
          for (; E && !R; ) {
            E = !1;
            const h = k.value, c = m.value.trim(), f = $.value, N = () => !R && h === k.value && c === m.value.trim() && f === $.value;
            o.value = "";
            try {
              const K = { limit: Ce, offset: (h - 1) * Ce };
              c && (K.q = c), f !== "all" && (K.status = f);
              const { data: ye } = await ie.get("/api/v1/uploads/list", { params: K });
              if (!N()) continue;
              ye.success ? (r.value = ye.uploads || [], i.value = Number(ye.meta?.total ?? r.value.length), typeof ye.component_id == "string" && (He.value = ye.component_id)) : (r.value = [], i.value = 0);
            } catch (K) {
              if (!N()) continue;
              r.value = [], i.value = 0, o.value = K instanceof Error ? K.message : "failed to load uploads";
            }
          }
        } finally {
          P = null, R || (a.value = !1);
        }
      }), P));
    }
    function an(h) {
      const c = Math.max(1, Math.min(gt.value, h));
      c !== k.value && (k.value = c, Y());
    }
    let be = null;
    Ve(m, () => {
      be && clearTimeout(be), be = setTimeout(() => {
        k.value = 1, Y();
      }, 300);
    }), Ve($, () => {
      k.value = 1, Y();
    });
    function ht() {
      if (R) return;
      const h = He.value;
      !h || _e === h || (X && X(), X = null, _e = "", X = wa(h, (c) => {
        je.value = { ...je.value, ...c.meta }, Y();
      }), X && (_e = h));
    }
    Ve(He, () => {
      ht();
    });
    async function on(h) {
      const c = new FormData();
      c.append("file", h), c.append("metadata", JSON.stringify({ target_parent_id: "", filename: h.name }));
      try {
        const { data: f } = await ie.post("/api/v1/uploads", c, { headers: { "Content-Type": "multipart/form-data" } });
        f.success || (o.value = f.error || `failed to upload "${h.name}"`);
      } catch (f) {
        o.value = f instanceof Error ? f.message : `failed to upload "${h.name}"`;
      }
    }
    async function bt(h) {
      const c = Array.from(h);
      if (c.length) {
        o.value = "", u.value += c.length;
        try {
          for (const f of c) await on(f);
        } finally {
          u.value = Math.max(0, u.value - c.length), k.value = 1, await Y();
        }
      }
    }
    function ve() {
      const h = document.createElement("input");
      h.type = "file", h.multiple = !0, h.onchange = () => {
        h.files?.length && bt(h.files);
      }, h.click();
    }
    function sn(h) {
      h.preventDefault(), s.value = !1, h.dataTransfer?.files?.length && bt(h.dataTransfer.files);
    }
    async function ln(h) {
      await On.confirm({
        header: "Delete upload",
        message: "Deletes the file everywhere; workspace links are removed.",
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await un(h);
    }
    async function un(h) {
      w.value = !0, o.value = "";
      try {
        const { data: c } = await ie.delete(`/api/v1/uploads/${h.uuid}`);
        c.success ? (I.value?.uuid === h.uuid && he(), r.value.length === 1 && k.value > 1 && (k.value -= 1), await Y()) : o.value = c.error || "failed to delete upload";
      } catch (c) {
        o.value = c instanceof Error ? c.message : "failed to delete upload";
      } finally {
        w.value = !1;
      }
    }
    async function dn(h) {
      if (!M.value) {
        M.value = !0, o.value = "";
        try {
          const { data: c } = await ie.post(`/api/v1/uploads/${h.uuid}/retry`);
          c.success ? (I.value?.uuid === h.uuid && he(), await Y()) : o.value = c.error || "failed to retry upload";
        } catch (c) {
          o.value = c instanceof Error ? c.message : "failed to retry upload";
        } finally {
          M.value = !1;
        }
      }
    }
    function vt(h) {
      h.key === "Escape" && I.value && he();
    }
    async function cn() {
      try {
        await Y(), ht();
      } catch (h) {
        o.value = h instanceof Error ? h.message : "host API unavailable";
      }
    }
    return xn(cn), Tn(() => {
      window.addEventListener("keydown", vt), Fn("wc-resource-view", { timeoutMs: 1e4 }).catch(() => {
      });
    }), Dn(() => {
      R = !0, E = !1, z++, window.removeEventListener("keydown", vt), be && clearTimeout(be), X && X(), X = null, _e = "";
    }), (h, c) => (d(), g("div", vi, [
      b("header", yi, [
        b("div", wi, [
          v(l(A), {
            icon: "tabler:files",
            "aria-hidden": "true"
          })
        ]),
        c[10] || (c[10] = b("div", { class: "kx-head-text" }, [
          b("h1", { class: "kx-title" }, "Uploads"),
          b("p", { class: "kx-head-sub" }, "Files your agents can read and process.")
        ], -1)),
        b("div", ki, [
          b("span", Pi, B(i.value) + " file" + B(i.value !== 1 ? "s" : ""), 1),
          mt.value ? (d(), g("span", Ci, [
            v(l(A), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            fe(" " + B(mt.value) + " processing", 1)
          ])) : x("", !0),
          v(l(Ot), { class: "kx-search" }, {
            default: D(() => [
              v(l(Ye), null, {
                default: D(() => [
                  v(l(A), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              v(l(Rt), {
                modelValue: m.value,
                "onUpdate:modelValue": c[0] || (c[0] = (f) => m.value = f),
                placeholder: "Search files…",
                "aria-label": "Search files",
                "data-testid": "uploads-search-input"
              }, null, 8, ["modelValue"]),
              m.value ? (d(), C(l(Ye), { key: 0 }, {
                default: D(() => [
                  v(l(j), {
                    type: "button",
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": "Clear search",
                    "data-testid": "uploads-search-clear",
                    onClick: c[1] || (c[1] = (f) => m.value = "")
                  }, {
                    icon: D(({ class: f }) => [
                      v(l(A), {
                        icon: "tabler:x",
                        class: L(f),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : x("", !0)
            ]),
            _: 1
          }),
          v(l(pt), {
            modelValue: $.value,
            "onUpdate:modelValue": c[2] || (c[2] = (f) => $.value = f),
            class: "kx-select",
            options: n,
            "option-label": "label",
            "option-value": "value",
            "aria-label": "Filter by status"
          }, null, 8, ["modelValue"]),
          v(l(j), {
            type: "button",
            "data-testid": "uploads-header-upload",
            label: u.value > 0 ? "Uploading…" : "Upload",
            loading: u.value > 0,
            disabled: u.value > 0,
            onClick: ve
          }, {
            icon: D(({ class: f }) => [
              v(l(A), {
                icon: "tabler:upload",
                class: L(f),
                "aria-hidden": "true"
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["label", "loading", "disabled"])
        ])
      ]),
      o.value ? (d(), g("div", xi, B(o.value), 1)) : x("", !0),
      Z.value ? (d(), g("div", $i, "Loading file…")) : x("", !0),
      Q.value ? (d(), g("div", Si, [
        fe(B(Q.value) + " ", 1),
        v(l(j), {
          label: "Close preview",
          text: "",
          severity: "secondary",
          onClick: he
        })
      ])) : x("", !0),
      b("div", Ii, [
        b("div", Li, [
          b("div", {
            class: L(["kx-drop", { dragover: s.value, busy: u.value > 0 }]),
            role: "button",
            tabindex: "0",
            "aria-label": "Upload files",
            onClick: c[3] || (c[3] = (f) => u.value === 0 && ve()),
            onKeydown: [
              c[4] || (c[4] = Ct((f) => u.value === 0 && ve(), ["enter"])),
              c[5] || (c[5] = Ct(Pt((f) => u.value === 0 && ve(), ["prevent"]), ["space"]))
            ],
            onDragover: c[6] || (c[6] = Pt((f) => s.value = !0, ["prevent"])),
            onDragleave: c[7] || (c[7] = (f) => s.value = !1),
            onDrop: sn
          }, [
            v(l(A), {
              icon: u.value > 0 ? "tabler:loader-2" : "tabler:cloud-upload",
              class: L(["kx-drop-ico", u.value > 0 && "spin"]),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            b("p", Ai, B(u.value > 0 ? "Uploading…" : "Drop files or click to browse"), 1),
            c[11] || (c[11] = b("p", { class: "kx-drop-sub" }, "Documents convert to markdown; images and text are stored for agents.", -1))
          ], 34),
          a.value && !r.value.length ? (d(), g("div", Ti, [
            v(l(A), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            c[12] || (c[12] = fe(" Loading…", -1))
          ])) : !i.value && !m.value && $.value === "all" ? (d(), g("div", Di, [
            b("div", Bi, [
              v(l(A), {
                icon: "tabler:cloud-upload",
                "aria-hidden": "true"
              })
            ]),
            c[13] || (c[13] = b("div", { class: "kx-empty-title" }, "No uploads yet", -1)),
            c[14] || (c[14] = b("div", { class: "kx-empty-sub" }, "Upload a document, image, or text file to make it available to your agents.", -1)),
            v(l(j), {
              type: "button",
              class: "kx-empty-cta",
              "data-testid": "uploads-empty-upload",
              label: "Upload files",
              onClick: ve
            }, {
              icon: D(({ class: f }) => [
                v(l(A), {
                  icon: "tabler:upload",
                  class: L(f),
                  "aria-hidden": "true"
                }, null, 8, ["class"])
              ]),
              _: 1
            })
          ])) : r.value.length ? (d(), g(H, { key: 3 }, [
            b("div", Ri, [
              (d(!0), g(H, null, $e(r.value, (f) => (d(), g("div", {
                key: f.uuid,
                class: "kx-row"
              }, [
                b("span", Fi, [
                  v(l(A), {
                    icon: l(lt)(f.mime_type),
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                b("div", Oi, [
                  b("div", {
                    class: "kx-name",
                    title: l(ee)(f)
                  }, B(l(ee)(f)), 9, Mi),
                  b("div", Ni, [
                    b("span", ji, B(l(nn)(f)), 1),
                    fe(" · " + B(l(De)(f.size)), 1)
                  ]),
                  l(tn)(f) && f.error ? (d(), g("div", {
                    key: 0,
                    class: "kx-err-reason",
                    title: l(ut)(f.error)
                  }, B(l(ut)(f.error)), 9, _i)) : x("", !0)
                ]),
                v(l(Ft), {
                  severity: l(_a)(f.status),
                  class: "kx-badge kx-tag-sm"
                }, {
                  default: D(() => [
                    l(t).has(f.status) ? x("", !0) : (d(), C(l(A), {
                      key: 0,
                      icon: "tabler:loader-2",
                      class: "spin",
                      "aria-hidden": "true"
                    })),
                    fe(" " + B(l(Ua)(f.status)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"]),
                b("span", Ui, B(l(Yt)(f.created_at)), 1),
                b("div", Vi, [
                  l(Ha)(f) ? (d(), C(l(j), {
                    key: 0,
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    "data-testid": "uploads-row-preview",
                    "data-upload-id": f.uuid,
                    "aria-label": `Preview ${l(ee)(f)}`,
                    onClick: (N) => rn(f)
                  }, {
                    icon: D(({ class: N }) => [
                      v(l(A), {
                        icon: "tabler:eye",
                        class: L(N),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["data-upload-id", "aria-label", "onClick"])) : x("", !0),
                  v(l(j), {
                    type: "button",
                    text: "",
                    rounded: "",
                    size: "small",
                    severity: "danger",
                    "data-testid": "uploads-row-delete",
                    "data-upload-id": f.uuid,
                    "aria-label": `Delete ${l(ee)(f)}`,
                    onClick: (N) => ln(f)
                  }, {
                    icon: D(({ class: N }) => [
                      v(l(A), {
                        icon: "tabler:trash",
                        class: L(N),
                        "aria-hidden": "true"
                      }, null, 8, ["class"])
                    ]),
                    _: 1
                  }, 8, ["data-upload-id", "aria-label", "onClick"])
                ]),
                l(qa)(f) ? (d(), g("span", zi)) : x("", !0)
              ]))), 128))
            ]),
            gt.value > 1 ? (d(), C(l(Xt), {
              key: 0,
              first: (k.value - 1) * Ce,
              rows: Ce,
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
              onPage: c[8] || (c[8] = (f) => an(f.page + 1))
            }, null, 8, ["first", "total-records"])) : x("", !0)
          ], 64)) : (d(), g("div", Ei, [...c[15] || (c[15] = [
            b("div", { class: "kx-empty-title" }, "No matches", -1),
            b("div", { class: "kx-empty-sub" }, "No files match the current search or filter.", -1)
          ])]))
        ])
      ]),
      v(mi, {
        "parts-expanded": l(V),
        "onUpdate:partsExpanded": c[9] || (c[9] = (f) => Bn(V) ? V.value = f : null),
        preview: l(I),
        "artifact-view": l(T),
        "busy-action": l(J),
        "current-artifacts": l(Re),
        "parts-total": l(Ge),
        "parts-page": l(Fe),
        "parts-pages": l(We),
        "parts-range-start": l(Je),
        "parts-range-end": l(Oe),
        "has-primary": l(p),
        "artifacts-loading": l(S),
        "active-preview-source": l(q),
        "download-active": l(re),
        "open-active": l(pe),
        "close-preview": he,
        "view-original": l(ge),
        "view-primary": l(de),
        "view-artifact": l(Ke),
        "goto-parts-page": l(ce),
        retrying: M.value,
        "retry-upload": dn
      }, null, 8, ["parts-expanded", "preview", "artifact-view", "busy-action", "current-artifacts", "parts-total", "parts-page", "parts-pages", "parts-range-start", "parts-range-end", "has-primary", "artifacts-loading", "active-preview-source", "download-active", "open-active", "view-original", "view-primary", "view-artifact", "goto-parts-page", "retrying"])
    ]));
  }
}), qi = {
  rootComponent: Ki,
  plugins: [$n]
};
export {
  qi as mountConfig
};
//# sourceMappingURL=lazy-mount-9zdsoWrD.js.map
