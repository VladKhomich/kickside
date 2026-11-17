import { B as G, R as Ve, s as ne, f as de, k as bt, b as q, Q as ae, z as ie, a as ze, c as fe, T as ft, C as vt, K as oe, v as mt, V as Be, L as ht, d as J, e as yt, U as kt, I as Le, g as gt, h as wt, r as Ne, i as $t, j as Ct, x as ve, l as St, m as xt, P as _t } from "./wc-runtime-CHL0PH8L.js";
import { mergeProps as _, resolveDirective as we, withDirectives as le, openBlock as s, createBlock as $, resolveDynamicComponent as X, withCtx as S, renderSlot as E, normalizeClass as H, createElementBlock as d, createElementVNode as l, createCommentVNode as g, defineComponent as I, unref as r, createVNode as y, Fragment as V, renderList as K, createTextVNode as B, toDisplayString as m, getCurrentInstance as Tt, computed as w, createSlots as Re, resolveComponent as Pe, Transition as Bt, normalizeStyle as Lt, reactive as Pt, toRef as Et, watch as Ke, ref as R } from "vue";
import { host as Ee } from "@wippy-fe/proxy";
import { Icon as D } from "@iconify/vue";
import { s as $e, _ as Ce, a as Se, b as At, i as It, c as Ot } from "./ProviderProfileEditor.vue_vue_type_script_setup_true_lang-CIcOG-gh.js";
import { s as Dt, p as Ft, h as Vt, a as zt, b as Nt, m as xe, o as Rt, c as Kt, d as Mt, e as jt, f as re, _ as se, i as Ae, g as Ie, u as Ut, j as Ht, k as Wt, l as Zt, n as qt } from "./useModelsApi-BP0pW0Lf.js";
var Gt = {
  root: function(t) {
    var n = t.instance, a = t.props;
    return ["p-tab", {
      "p-tab-active": n.active,
      "p-disabled": a.disabled
    }];
  }
}, Qt = G.extend({
  name: "tab",
  classes: Gt
}), Jt = {
  name: "BaseTab",
  extends: ne,
  props: {
    value: {
      type: [String, Number],
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    }
  },
  style: Qt,
  provide: function() {
    return {
      $pcTab: this,
      $parentInstance: this
    };
  }
}, Me = {
  name: "Tab",
  extends: Jt,
  inheritAttrs: !1,
  inject: ["$pcTabs", "$pcTabList"],
  methods: {
    onFocus: function() {
      this.$pcTabs.selectOnFocus && this.changeActiveValue();
    },
    onClick: function() {
      this.changeActiveValue();
    },
    onKeydown: function(t) {
      switch (t.code) {
        case "ArrowRight":
          this.onArrowRightKey(t);
          break;
        case "ArrowLeft":
          this.onArrowLeftKey(t);
          break;
        case "Home":
          this.onHomeKey(t);
          break;
        case "End":
          this.onEndKey(t);
          break;
        case "PageDown":
          this.onPageDownKey(t);
          break;
        case "PageUp":
          this.onPageUpKey(t);
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
          this.onEnterKey(t);
          break;
      }
    },
    onArrowRightKey: function(t) {
      var n = this.findNextTab(t.currentTarget);
      n ? this.changeFocusedTab(t, n) : this.onHomeKey(t), t.preventDefault();
    },
    onArrowLeftKey: function(t) {
      var n = this.findPrevTab(t.currentTarget);
      n ? this.changeFocusedTab(t, n) : this.onEndKey(t), t.preventDefault();
    },
    onHomeKey: function(t) {
      var n = this.findFirstTab();
      this.changeFocusedTab(t, n), t.preventDefault();
    },
    onEndKey: function(t) {
      var n = this.findLastTab();
      this.changeFocusedTab(t, n), t.preventDefault();
    },
    onPageDownKey: function(t) {
      this.scrollInView(this.findLastTab()), t.preventDefault();
    },
    onPageUpKey: function(t) {
      this.scrollInView(this.findFirstTab()), t.preventDefault();
    },
    onEnterKey: function(t) {
      this.changeActiveValue();
    },
    findNextTab: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, a = n ? t : t.nextElementSibling;
      return a ? ae(a, "data-p-disabled") || ae(a, "data-pc-section") === "activebar" ? this.findNextTab(a) : ie(a, '[data-pc-name="tab"]') : null;
    },
    findPrevTab: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, a = n ? t : t.previousElementSibling;
      return a ? ae(a, "data-p-disabled") || ae(a, "data-pc-section") === "activebar" ? this.findPrevTab(a) : ie(a, '[data-pc-name="tab"]') : null;
    },
    findFirstTab: function() {
      return this.findNextTab(this.$pcTabList.$refs.tabs.firstElementChild, !0);
    },
    findLastTab: function() {
      return this.findPrevTab(this.$pcTabList.$refs.tabs.lastElementChild, !0);
    },
    changeActiveValue: function() {
      this.$pcTabs.updateValue(this.value);
    },
    changeFocusedTab: function(t, n) {
      q(n), this.scrollInView(n);
    },
    scrollInView: function(t) {
      var n;
      t == null || (n = t.scrollIntoView) === null || n === void 0 || n.call(t, {
        block: "nearest"
      });
    }
  },
  computed: {
    active: function() {
      var t;
      return bt((t = this.$pcTabs) === null || t === void 0 ? void 0 : t.d_value, this.value);
    },
    id: function() {
      var t;
      return "".concat((t = this.$pcTabs) === null || t === void 0 ? void 0 : t.$id, "_tab_").concat(this.value);
    },
    ariaControls: function() {
      var t;
      return "".concat((t = this.$pcTabs) === null || t === void 0 ? void 0 : t.$id, "_tabpanel_").concat(this.value);
    },
    attrs: function() {
      return _(this.asAttrs, this.a11yAttrs, this.ptmi("root", this.ptParams));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        id: this.id,
        tabindex: this.active ? this.$pcTabs.tabindex : -1,
        role: "tab",
        "aria-selected": this.active,
        "aria-controls": this.ariaControls,
        "data-pc-name": "tab",
        "data-p-disabled": this.disabled,
        "data-p-active": this.active,
        onFocus: this.onFocus,
        onKeydown: this.onKeydown
      };
    },
    ptParams: function() {
      return {
        context: {
          active: this.active
        }
      };
    },
    dataP: function() {
      return de({
        active: this.active
      });
    }
  },
  directives: {
    ripple: Ve
  }
};
function Xt(e, t, n, a, i, o) {
  var c = we("ripple");
  return e.asChild ? E(e.$slots, "default", {
    key: 1,
    dataP: o.dataP,
    class: H(e.cx("root")),
    active: o.active,
    a11yAttrs: o.a11yAttrs,
    onClick: o.onClick
  }) : le((s(), $(X(e.as), _({
    key: 0,
    class: e.cx("root"),
    "data-p": o.dataP,
    onClick: o.onClick
  }, o.attrs), {
    default: S(function() {
      return [E(e.$slots, "default")];
    }),
    _: 3
  }, 16, ["class", "data-p", "onClick"])), [[c]]);
}
Me.render = Xt;
var je = {
  name: "ChevronLeftIcon",
  extends: ze
};
function Yt(e) {
  return an(e) || nn(e) || tn(e) || en();
}
function en() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function tn(e, t) {
  if (e) {
    if (typeof e == "string") return ye(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ye(e, t) : void 0;
  }
}
function nn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function an(e) {
  if (Array.isArray(e)) return ye(e);
}
function ye(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, a = Array(t); n < t; n++) a[n] = e[n];
  return a;
}
function on(e, t, n, a, i, o) {
  return s(), d("svg", _({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Yt(t[0] || (t[0] = [l("path", {
    d: "M9.61296 13C9.50997 13.0005 9.40792 12.9804 9.3128 12.9409C9.21767 12.9014 9.13139 12.8433 9.05902 12.7701L3.83313 7.54416C3.68634 7.39718 3.60388 7.19795 3.60388 6.99022C3.60388 6.78249 3.68634 6.58325 3.83313 6.43628L9.05902 1.21039C9.20762 1.07192 9.40416 0.996539 9.60724 1.00012C9.81032 1.00371 10.0041 1.08597 10.1477 1.22959C10.2913 1.37322 10.3736 1.56698 10.3772 1.77005C10.3808 1.97313 10.3054 2.16968 10.1669 2.31827L5.49496 6.99022L10.1669 11.6622C10.3137 11.8091 10.3962 12.0084 10.3962 12.2161C10.3962 12.4238 10.3137 12.6231 10.1669 12.7701C10.0945 12.8433 10.0083 12.9014 9.91313 12.9409C9.81801 12.9804 9.71596 13.0005 9.61296 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
je.render = on;
var Ue = {
  name: "ChevronRightIcon",
  extends: ze
};
function rn(e) {
  return cn(e) || dn(e) || ln(e) || sn();
}
function sn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ln(e, t) {
  if (e) {
    if (typeof e == "string") return ke(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ke(e, t) : void 0;
  }
}
function dn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function cn(e) {
  if (Array.isArray(e)) return ke(e);
}
function ke(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, a = Array(t); n < t; n++) a[n] = e[n];
  return a;
}
function un(e, t, n, a, i, o) {
  return s(), d("svg", _({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), rn(t[0] || (t[0] = [l("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ue.render = un;
var pn = {
  root: "p-tablist",
  content: "p-tablist-content p-tablist-viewport",
  tabList: "p-tablist-tab-list",
  activeBar: "p-tablist-active-bar",
  prevButton: "p-tablist-prev-button p-tablist-nav-button",
  nextButton: "p-tablist-next-button p-tablist-nav-button"
}, bn = G.extend({
  name: "tablist",
  classes: pn
}), fn = {
  name: "BaseTabList",
  extends: ne,
  props: {},
  style: bn,
  provide: function() {
    return {
      $pcTabList: this,
      $parentInstance: this
    };
  }
}, He = {
  name: "TabList",
  extends: fn,
  inheritAttrs: !1,
  inject: ["$pcTabs"],
  data: function() {
    return {
      isPrevButtonEnabled: !1,
      isNextButtonEnabled: !0
    };
  },
  resizeObserver: void 0,
  inkBarObserver: void 0,
  watch: {
    showNavigators: function(t) {
      t ? this.bindResizeObserver() : this.unbindResizeObserver();
    },
    activeValue: {
      flush: "post",
      handler: function() {
        this.updateInkBar(), this.bindInkBarObserver();
      }
    }
  },
  mounted: function() {
    var t = this;
    setTimeout(function() {
      t.updateInkBar(), t.bindInkBarObserver();
    }, 150), this.showNavigators && (this.updateButtonState(), this.bindResizeObserver());
  },
  updated: function() {
    this.showNavigators && this.updateButtonState();
  },
  beforeUnmount: function() {
    this.unbindResizeObserver(), this.unbindInkBarObserver();
  },
  methods: {
    onScroll: function(t) {
      this.showNavigators && this.updateButtonState(), t.preventDefault();
    },
    onPrevButtonClick: function() {
      var t = this.$refs.content, n = this.getVisibleButtonWidths(), a = fe(t) - n, i = Math.abs(t.scrollLeft), o = a * 0.8, c = i - o, b = Math.max(c, 0);
      t.scrollLeft = Be(t) ? -1 * b : b;
    },
    onNextButtonClick: function() {
      var t = this.$refs.content, n = this.getVisibleButtonWidths(), a = fe(t) - n, i = Math.abs(t.scrollLeft), o = a * 0.8, c = i + o, b = t.scrollWidth - a, f = Math.min(c, b);
      t.scrollLeft = Be(t) ? -1 * f : f;
    },
    bindResizeObserver: function() {
      var t = this;
      this.resizeObserver = new ResizeObserver(function() {
        return t.updateButtonState();
      }), this.resizeObserver.observe(this.$refs.list);
    },
    unbindResizeObserver: function() {
      var t;
      (t = this.resizeObserver) === null || t === void 0 || t.unobserve(this.$refs.list), this.resizeObserver = void 0;
    },
    bindInkBarObserver: function() {
      var t = this;
      this.unbindInkBarObserver();
      var n = this.$refs.content, a = ie(n, '[data-pc-name="tab"][data-p-active="true"]');
      a && (this.inkBarObserver = new ResizeObserver(function() {
        return t.updateInkBar();
      }), this.inkBarObserver.observe(a));
    },
    unbindInkBarObserver: function() {
      var t;
      (t = this.inkBarObserver) === null || t === void 0 || t.disconnect(), this.inkBarObserver = void 0;
    },
    updateInkBar: function() {
      var t = this.$refs, n = t.content, a = t.inkbar, i = t.tabs;
      if (a) {
        var o = ie(n, '[data-pc-name="tab"][data-p-active="true"]');
        this.$pcTabs.isVertical() ? (a.style.height = vt(o) + "px", a.style.top = oe(o).top - oe(i).top + "px") : (a.style.width = mt(o) + "px", a.style.left = oe(o).left - oe(i).left + "px");
      }
    },
    updateButtonState: function() {
      var t = this.$refs, n = t.list, a = t.content, i = a.scrollTop, o = a.scrollWidth, c = a.scrollHeight, b = a.offsetWidth, f = a.offsetHeight, C = Math.abs(a.scrollLeft), x = [fe(a), ft(a)], v = x[0], p = x[1];
      this.$pcTabs.isVertical() ? (this.isPrevButtonEnabled = i !== 0, this.isNextButtonEnabled = n.offsetHeight >= f && parseInt(i) !== c - p) : (this.isPrevButtonEnabled = C !== 0, this.isNextButtonEnabled = n.offsetWidth >= b && parseInt(C) !== o - v);
    },
    getVisibleButtonWidths: function() {
      var t = this.$refs, n = t.prevButton, a = t.nextButton, i = 0;
      return this.showNavigators && (i = (n?.offsetWidth || 0) + (a?.offsetWidth || 0)), i;
    }
  },
  computed: {
    templates: function() {
      return this.$pcTabs.$slots;
    },
    activeValue: function() {
      return this.$pcTabs.d_value;
    },
    showNavigators: function() {
      return this.$pcTabs.showNavigators;
    },
    prevButtonAriaLabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.previous : void 0;
    },
    nextButtonAriaLabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.next : void 0;
    },
    dataP: function() {
      return de({
        scrollable: this.$pcTabs.scrollable
      });
    }
  },
  components: {
    ChevronLeftIcon: je,
    ChevronRightIcon: Ue
  },
  directives: {
    ripple: Ve
  }
}, vn = ["data-p"], mn = ["aria-label", "tabindex"], hn = ["data-p"], yn = ["aria-orientation"], kn = ["aria-label", "tabindex"];
function gn(e, t, n, a, i, o) {
  var c = we("ripple");
  return s(), d("div", _({
    ref: "list",
    class: e.cx("root"),
    "data-p": o.dataP
  }, e.ptmi("root")), [o.showNavigators && i.isPrevButtonEnabled ? le((s(), d("button", _({
    key: 0,
    ref: "prevButton",
    type: "button",
    class: e.cx("prevButton"),
    "aria-label": o.prevButtonAriaLabel,
    tabindex: o.$pcTabs.tabindex,
    onClick: t[0] || (t[0] = function() {
      return o.onPrevButtonClick && o.onPrevButtonClick.apply(o, arguments);
    })
  }, e.ptm("prevButton"), {
    "data-pc-group-section": "navigator"
  }), [(s(), $(X(o.templates.previcon || "ChevronLeftIcon"), _({
    "aria-hidden": "true"
  }, e.ptm("prevIcon")), null, 16))], 16, mn)), [[c]]) : g("", !0), l("div", _({
    ref: "content",
    class: e.cx("content"),
    onScroll: t[1] || (t[1] = function() {
      return o.onScroll && o.onScroll.apply(o, arguments);
    }),
    "data-p": o.dataP
  }, e.ptm("content")), [l("div", _({
    ref: "tabs",
    class: e.cx("tabList"),
    role: "tablist",
    "aria-orientation": o.$pcTabs.orientation || "horizontal"
  }, e.ptm("tabList")), [E(e.$slots, "default"), l("span", _({
    ref: "inkbar",
    class: e.cx("activeBar"),
    role: "presentation",
    "aria-hidden": "true"
  }, e.ptm("activeBar")), null, 16)], 16, yn)], 16, hn), o.showNavigators && i.isNextButtonEnabled ? le((s(), d("button", _({
    key: 1,
    ref: "nextButton",
    type: "button",
    class: e.cx("nextButton"),
    "aria-label": o.nextButtonAriaLabel,
    tabindex: o.$pcTabs.tabindex,
    onClick: t[2] || (t[2] = function() {
      return o.onNextButtonClick && o.onNextButtonClick.apply(o, arguments);
    })
  }, e.ptm("nextButton"), {
    "data-pc-group-section": "navigator"
  }), [(s(), $(X(o.templates.nexticon || "ChevronRightIcon"), _({
    "aria-hidden": "true"
  }, e.ptm("nextIcon")), null, 16))], 16, kn)), [[c]]) : g("", !0)], 16, vn);
}
He.render = gn;
var wn = `
    .p-tabs {
        display: flex;
        flex-direction: column;
    }

    .p-tablist {
        display: flex;
        position: relative;
        overflow: hidden;
        background: dt('tabs.tablist.background');
    }

    .p-tablist-viewport {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        overscroll-behavior: contain auto;
    }

    .p-tablist-viewport::-webkit-scrollbar {
        display: none;
    }

    .p-tablist-tab-list {
        position: relative;
        display: flex;
        border-style: solid;
        border-color: dt('tabs.tablist.border.color');
        border-width: dt('tabs.tablist.border.width');
    }

    .p-tablist-content {
        flex-grow: 1;
    }

    .p-tablist-nav-button {
        all: unset;
        position: absolute !important;
        flex-shrink: 0;
        inset-block-start: 0;
        z-index: 2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: dt('tabs.nav.button.background');
        color: dt('tabs.nav.button.color');
        width: dt('tabs.nav.button.width');
        transition:
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        box-shadow: dt('tabs.nav.button.shadow');
        outline-color: transparent;
        cursor: pointer;
    }

    .p-tablist-nav-button:focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.nav.button.focus.ring.shadow');
        outline: dt('tabs.nav.button.focus.ring.width') dt('tabs.nav.button.focus.ring.style') dt('tabs.nav.button.focus.ring.color');
        outline-offset: dt('tabs.nav.button.focus.ring.offset');
    }

    .p-tablist-nav-button:hover {
        color: dt('tabs.nav.button.hover.color');
    }

    .p-tablist-prev-button {
        inset-inline-start: 0;
    }

    .p-tablist-next-button {
        inset-inline-end: 0;
    }

    .p-tablist-prev-button:dir(rtl),
    .p-tablist-next-button:dir(rtl) {
        transform: rotate(180deg);
    }

    .p-tab {
        flex-shrink: 0;
        cursor: pointer;
        user-select: none;
        position: relative;
        border-style: solid;
        white-space: nowrap;
        gap: dt('tabs.tab.gap');
        background: dt('tabs.tab.background');
        border-width: dt('tabs.tab.border.width');
        border-color: dt('tabs.tab.border.color');
        color: dt('tabs.tab.color');
        padding: dt('tabs.tab.padding');
        font-weight: dt('tabs.tab.font.weight');
        transition:
            background dt('tabs.transition.duration'),
            border-color dt('tabs.transition.duration'),
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        margin: dt('tabs.tab.margin');
        outline-color: transparent;
    }

    .p-tab:not(.p-disabled):focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.tab.focus.ring.shadow');
        outline: dt('tabs.tab.focus.ring.width') dt('tabs.tab.focus.ring.style') dt('tabs.tab.focus.ring.color');
        outline-offset: dt('tabs.tab.focus.ring.offset');
    }

    .p-tab:not(.p-tab-active):not(.p-disabled):hover {
        background: dt('tabs.tab.hover.background');
        border-color: dt('tabs.tab.hover.border.color');
        color: dt('tabs.tab.hover.color');
    }

    .p-tab-active {
        background: dt('tabs.tab.active.background');
        border-color: dt('tabs.tab.active.border.color');
        color: dt('tabs.tab.active.color');
    }

    .p-tabpanels {
        background: dt('tabs.tabpanel.background');
        color: dt('tabs.tabpanel.color');
        padding: dt('tabs.tabpanel.padding');
        outline: 0 none;
    }

    .p-tabpanel:focus-visible {
        box-shadow: dt('tabs.tabpanel.focus.ring.shadow');
        outline: dt('tabs.tabpanel.focus.ring.width') dt('tabs.tabpanel.focus.ring.style') dt('tabs.tabpanel.focus.ring.color');
        outline-offset: dt('tabs.tabpanel.focus.ring.offset');
    }

    .p-tablist-active-bar {
        z-index: 1;
        display: block;
        position: absolute;
        inset-block-end: dt('tabs.active.bar.bottom');
        height: dt('tabs.active.bar.height');
        background: dt('tabs.active.bar.background');
        transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
    }
`, $n = {
  root: function(t) {
    var n = t.props;
    return ["p-tabs p-component", {
      "p-tabs-scrollable": n.scrollable
    }];
  }
}, Cn = G.extend({
  name: "tabs",
  style: wn,
  classes: $n
}), Sn = {
  name: "BaseTabs",
  extends: ne,
  props: {
    value: {
      type: [String, Number],
      default: void 0
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    scrollable: {
      type: Boolean,
      default: !1
    },
    showNavigators: {
      type: Boolean,
      default: !0
    },
    tabindex: {
      type: Number,
      default: 0
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    }
  },
  style: Cn,
  provide: function() {
    return {
      $pcTabs: this,
      $parentInstance: this
    };
  }
}, We = {
  name: "Tabs",
  extends: Sn,
  inheritAttrs: !1,
  emits: ["update:value"],
  data: function() {
    return {
      d_value: this.value
    };
  },
  watch: {
    value: function(t) {
      this.d_value = t;
    }
  },
  methods: {
    updateValue: function(t) {
      this.d_value !== t && (this.d_value = t, this.$emit("update:value", t));
    },
    isVertical: function() {
      return this.orientation === "vertical";
    }
  }
};
function xn(e, t, n, a, i, o) {
  return s(), d("div", _({
    class: e.cx("root")
  }, e.ptmi("root")), [E(e.$slots, "default")], 16);
}
We.render = xn;
const _n = {
  key: 0,
  class: "kx-system-tab-count"
}, Tn = /* @__PURE__ */ I({
  __name: "SystemTabs",
  props: {
    value: {},
    label: {},
    items: {}
  },
  emits: ["update:value"],
  setup(e) {
    return (t, n) => (s(), $(r(We), {
      class: "kx-system-tabs",
      "data-kx-separator": "surface",
      value: e.value,
      "onUpdate:value": n[0] || (n[0] = (a) => t.$emit("update:value", String(a)))
    }, {
      default: S(() => [
        y(r(He), {
          pt: { tabList: { "aria-label": e.label } }
        }, {
          default: S(() => [
            (s(!0), d(V, null, K(e.items, (a) => (s(), $(r(Me), _({
              key: a.value,
              value: a.value
            }, { ref_for: !0 }, a.controls ? { "aria-controls": a.controls } : {}), {
              default: S(() => [
                B(m(a.label), 1),
                a.count !== void 0 ? (s(), d("b", _n, m(a.count), 1)) : g("", !0)
              ]),
              _: 2
            }, 1040, ["value"]))), 128))
          ]),
          _: 1
        }, 8, ["pt"])
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Bn = { class: "kx-shell" }, Ln = { class: "kx-rail" }, Pn = { class: "kx-main" }, En = /* @__PURE__ */ I({
  __name: "Shell",
  setup(e) {
    return (t, n) => (s(), d("div", Bn, [
      l("aside", Ln, [
        E(t.$slots, "rail")
      ]),
      l("main", Pn, [
        E(t.$slots, "default")
      ])
    ]));
  }
}), An = { class: "kx-railhead" }, In = { class: "kx-railhead-title" }, On = { key: 0 }, Dn = { class: "kx-railhead-acts" }, Fn = /* @__PURE__ */ I({
  __name: "RailHeader",
  props: {
    title: {},
    count: {}
  },
  setup(e) {
    return (t, n) => (s(), d("div", An, [
      l("span", In, [
        B(m(e.title), 1),
        e.count !== void 0 ? (s(), d("b", On, m(e.count), 1)) : g("", !0)
      ]),
      l("div", Dn, [
        E(t.$slots, "actions")
      ])
    ]));
  }
}), N = /* @__PURE__ */ I({
  __name: "IconButton",
  props: {
    icon: {},
    label: {},
    active: { type: Boolean },
    disabled: { type: Boolean },
    variant: { default: "plain" },
    severity: {},
    size: { default: "md" },
    spin: { type: Boolean }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, a = t, i = Tt(), o = w(
      () => Object.prototype.hasOwnProperty.call(i?.vnode.props ?? {}, "active")
    ), c = w(() => {
      if (n.severity) return n.severity;
      if (n.variant === "danger") return "danger";
      if (n.variant === "bordered") return "secondary";
    }), b = w(
      () => n.size === "sm" ? "small" : n.size === "lg" ? "large" : void 0
    );
    return (f, C) => (s(), $(r($e), {
      severity: c.value,
      text: e.variant !== "bordered" && !e.active,
      outlined: e.variant === "bordered",
      size: b.value,
      loading: e.spin,
      disabled: e.disabled || e.spin,
      pt: {
        root: {
          "aria-label": e.label,
          "aria-pressed": o.value ? String(e.active) : void 0,
          title: e.label
        }
      },
      onClick: C[0] || (C[0] = (x) => a("click"))
    }, {
      icon: S(() => [
        y(r(D), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      _: 1
    }, 8, ["severity", "text", "outlined", "size", "loading", "disabled", "pt"]));
  }
}), Vn = { class: "km-search" }, zn = ["value", "placeholder"], Nn = /* @__PURE__ */ I({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, i) => (s(), d("div", Vn, [
      y(r(D), {
        icon: "tabler:search",
        class: "km-search-ico",
        "aria-hidden": "true"
      }),
      l("input", {
        class: "km-search-input",
        value: e.modelValue,
        placeholder: e.placeholder || "Search",
        onInput: i[0] || (i[0] = (o) => n("update:modelValue", o.target.value))
      }, null, 40, zn),
      e.modelValue ? (s(), d("button", {
        key: 0,
        class: "km-search-clear",
        "aria-label": "Clear search",
        onClick: i[1] || (i[1] = (o) => n("update:modelValue", ""))
      }, [
        y(r(D), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : g("", !0)
    ]));
  }
});
var Rn = `
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
`, Kn = {
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
}, Mn = G.extend({
  name: "tag",
  style: Rn,
  classes: Kn
}), jn = {
  name: "BaseTag",
  extends: ne,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: Mn,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function Y(e) {
  "@babel/helpers - typeof";
  return Y = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Y(e);
}
function Un(e, t, n) {
  return (t = Hn(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Hn(e) {
  var t = Wn(e, "string");
  return Y(t) == "symbol" ? t : t + "";
}
function Wn(e, t) {
  if (Y(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(e, t);
    if (Y(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ze = {
  name: "Tag",
  extends: jn,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return de(Un({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, Zn = ["data-p"];
function qn(e, t, n, a, i, o) {
  return s(), d("span", _({
    class: e.cx("root"),
    "data-p": o.dataP
  }, e.ptmi("root")), [e.$slots.icon ? (s(), $(X(e.$slots.icon), _({
    key: 0,
    class: e.cx("icon")
  }, e.ptm("icon")), null, 16, ["class"])) : e.icon ? (s(), d("span", _({
    key: 1,
    class: [e.cx("icon"), e.icon]
  }, e.ptm("icon")), null, 16)) : g("", !0), e.value != null || e.$slots.default ? E(e.$slots, "default", {
    key: 2
  }, function() {
    return [l("span", _({
      class: e.cx("label")
    }, e.ptm("label")), m(e.value), 17)];
  }) : g("", !0)], 16, Zn);
}
Ze.render = qn;
const Gn = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, z = /* @__PURE__ */ I({
  __name: "Pill",
  props: {
    severity: { default: "secondary" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(e) {
    return (t, n) => (s(), $(r(Ze), {
      severity: e.severity || void 0,
      class: "km-pill kx-tag-sm"
    }, {
      default: S(() => [
        e.dot ? (s(), d("span", Gn)) : e.icon ? (s(), $(r(D), {
          key: 1,
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : g("", !0),
        E(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["severity"]));
  }
}), Qn = { class: "kx-empty" }, Jn = { class: "kx-empty-ico" }, Xn = { class: "kx-empty-title" }, Yn = {
  key: 0,
  class: "kx-empty-sub"
}, ge = /* @__PURE__ */ I({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(e) {
    return (t, n) => (s(), d("div", Qn, [
      l("div", Jn, [
        y(r(D), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      l("div", Xn, m(e.title), 1),
      e.hint || t.$slots.hint ? (s(), d("p", Yn, [
        E(t.$slots, "hint", {}, () => [
          B(m(e.hint), 1)
        ])
      ])) : g("", !0),
      e.cta ? (s(), $(r($e), {
        key: 1,
        label: e.cta,
        onClick: n[0] || (n[0] = (a) => t.$emit("cta"))
      }, Re({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: S(({ class: a }) => [
            y(r(D), {
              icon: e.ctaIcon,
              class: H(a),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : g("", !0)
    ]));
  }
});
var ea = G.extend({
  name: "focustrap-directive"
}), ta = yt.extend({
  style: ea
});
function ee(e) {
  "@babel/helpers - typeof";
  return ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ee(e);
}
function Oe(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    t && (a = a.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function De(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Oe(Object(n), !0).forEach(function(a) {
      na(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Oe(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function na(e, t, n) {
  return (t = aa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function aa(e) {
  var t = oa(e, "string");
  return ee(t) == "symbol" ? t : t + "";
}
function oa(e, t) {
  if (ee(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(e, t);
    if (ee(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ra = ta.extend("focustrap", {
  mounted: function(t, n) {
    var a = n.value || {}, i = a.disabled;
    i || (this.createHiddenFocusableElements(t, n), this.bind(t, n), this.autoElementFocus(t, n)), t.setAttribute("data-pd-focustrap", !0), this.$el = t;
  },
  updated: function(t, n) {
    var a = n.value || {}, i = a.disabled;
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
      var a = this, i = n.value || {}, o = i.onFocusIn, c = i.onFocusOut;
      t.$_pfocustrap_mutationobserver = new MutationObserver(function(b) {
        b.forEach(function(f) {
          if (f.type === "childList" && !t.contains(document.activeElement)) {
            var C = function(v) {
              var p = Le(v) ? Le(v, a.getComputedSelector(t.$_pfocustrap_focusableselector)) ? v : J(t, a.getComputedSelector(t.$_pfocustrap_focusableselector)) : J(v);
              return gt(p) ? p : v.nextSibling && C(v.nextSibling);
            };
            q(C(f.nextSibling));
          }
        });
      }), t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_mutationobserver.observe(t, {
        childList: !0
      }), t.$_pfocustrap_focusinlistener = function(b) {
        return o && o(b);
      }, t.$_pfocustrap_focusoutlistener = function(b) {
        return c && c(b);
      }, t.addEventListener("focusin", t.$_pfocustrap_focusinlistener), t.addEventListener("focusout", t.$_pfocustrap_focusoutlistener);
    },
    unbind: function(t) {
      t.$_pfocustrap_mutationobserver && t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_focusinlistener && t.removeEventListener("focusin", t.$_pfocustrap_focusinlistener) && (t.$_pfocustrap_focusinlistener = null), t.$_pfocustrap_focusoutlistener && t.removeEventListener("focusout", t.$_pfocustrap_focusoutlistener) && (t.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(t) {
      this.autoElementFocus(this.$el, {
        value: De(De({}, t), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(t, n) {
      var a = n.value || {}, i = a.autoFocusSelector, o = i === void 0 ? "" : i, c = a.firstFocusableSelector, b = c === void 0 ? "" : c, f = a.autoFocus, C = f === void 0 ? !1 : f, x = J(t, "[autofocus]".concat(this.getComputedSelector(o)));
      C && !x && (x = J(t, this.getComputedSelector(b))), q(x);
    },
    onFirstHiddenElementFocus: function(t) {
      var n, a = t.currentTarget, i = t.relatedTarget, o = i === a.$_pfocustrap_lasthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? J(a.parentElement, this.getComputedSelector(a.$_pfocustrap_focusableselector)) : a.$_pfocustrap_lasthiddenfocusableelement;
      q(o);
    },
    onLastHiddenElementFocus: function(t) {
      var n, a = t.currentTarget, i = t.relatedTarget, o = i === a.$_pfocustrap_firsthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(i)) ? ht(a.parentElement, this.getComputedSelector(a.$_pfocustrap_focusableselector)) : a.$_pfocustrap_firsthiddenfocusableelement;
      q(o);
    },
    createHiddenFocusableElements: function(t, n) {
      var a = this, i = n.value || {}, o = i.tabIndex, c = o === void 0 ? 0 : o, b = i.firstFocusableSelector, f = b === void 0 ? "" : b, C = i.lastFocusableSelector, x = C === void 0 ? "" : C, v = function(P) {
        return kt("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: c,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: P?.bind(a)
        });
      }, p = v(this.onFirstHiddenElementFocus), h = v(this.onLastHiddenElementFocus);
      p.$_pfocustrap_lasthiddenfocusableelement = h, p.$_pfocustrap_focusableselector = f, p.setAttribute("data-pc-section", "firstfocusableelement"), h.$_pfocustrap_firsthiddenfocusableelement = p, h.$_pfocustrap_focusableselector = x, h.setAttribute("data-pc-section", "lastfocusableelement"), t.prepend(p), t.append(h);
    }
  }
});
function sa() {
  $t({
    variableName: Ne("scrollbar.width").name
  });
}
function ia() {
  wt({
    variableName: Ne("scrollbar.width").name
  });
}
var la = `
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
`, da = {
  mask: function(t) {
    var n = t.position, a = t.modal;
    return {
      position: "fixed",
      height: "100%",
      width: "100%",
      left: 0,
      top: 0,
      display: "flex",
      justifyContent: n === "left" ? "flex-start" : n === "right" ? "flex-end" : "center",
      alignItems: n === "top" ? "flex-start" : n === "bottom" ? "flex-end" : "center",
      pointerEvents: a ? "auto" : "none"
    };
  },
  root: {
    pointerEvents: "auto"
  }
}, ca = {
  mask: function(t) {
    var n = t.instance, a = t.props, i = ["left", "right", "top", "bottom"], o = i.find(function(c) {
      return c === a.position;
    });
    return ["p-drawer-mask", {
      "p-overlay-mask p-overlay-mask-enter-active": a.modal,
      "p-drawer-open": n.containerVisible,
      "p-drawer-full": n.fullScreen
    }, o ? "p-drawer-".concat(o) : ""];
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
}, ua = G.extend({
  name: "drawer",
  style: la,
  classes: ca,
  inlineStyles: da
}), pa = {
  name: "BaseDrawer",
  extends: ne,
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
  style: ua,
  provide: function() {
    return {
      $pcDrawer: this,
      $parentInstance: this
    };
  }
};
function te(e) {
  "@babel/helpers - typeof";
  return te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, te(e);
}
function me(e, t, n) {
  return (t = ba(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ba(e) {
  var t = fa(e, "string");
  return te(t) == "symbol" ? t : t + "";
}
function fa(e, t) {
  if (te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(e, t);
    if (te(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var qe = {
  name: "Drawer",
  extends: pa,
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
    this.disableDocumentSettings(), this.mask && this.autoZIndex && ve.clear(this.mask), this.container = null, this.mask = null;
  },
  methods: {
    hide: function() {
      this.$emit("update:visible", !1);
    },
    onEnter: function() {
      this.$emit("show"), this.focus(), this.bindDocumentKeyDownListener(), this.autoZIndex && ve.set("modal", this.mask, this.baseZIndex || this.$primevue.config.zIndex.modal);
    },
    onAfterEnter: function() {
      this.enableDocumentSettings(), this.$emit("after-show");
    },
    onBeforeLeave: function() {
      this.modal && !this.isUnstyled && St(this.mask, "p-overlay-mask-leave-active"), this.$emit("before-hide");
    },
    onLeave: function() {
      this.$emit("hide");
    },
    onAfterLeave: function() {
      this.autoZIndex && ve.clear(this.mask), this.unbindDocumentKeyDownListener(), this.containerVisible = !1, this.disableDocumentSettings(), this.$emit("after-hide");
    },
    onMaskClick: function(t) {
      this.dismissable && this.modal && this.mask === t.target && this.hide();
    },
    focus: function() {
      var t = function(i) {
        return i && i.querySelector("[autofocus]");
      }, n = this.$slots.header && t(this.headerContainer);
      n || (n = this.$slots.default && t(this.container), n || (n = this.$slots.footer && t(this.footerContainer), n || (n = this.closeButton))), n && q(n);
    },
    enableDocumentSettings: function() {
      this.dismissable && !this.modal && this.bindOutsideClickListener(), this.blockScroll && sa();
    },
    disableDocumentSettings: function() {
      this.unbindOutsideClickListener(), this.blockScroll && ia();
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
      return de(me(me(me({
        "full-screen": this.position === "full"
      }, this.position, this.position), "open", this.containerVisible), "modal", this.modal));
    }
  },
  directives: {
    focustrap: ra
  },
  components: {
    Button: $e,
    Portal: Ct,
    TimesIcon: Dt
  }
}, va = ["data-p"], ma = ["role", "aria-modal", "data-p"];
function ha(e, t, n, a, i, o) {
  var c = Pe("Button"), b = Pe("Portal"), f = we("focustrap");
  return s(), $(b, null, {
    default: S(function() {
      return [i.containerVisible ? (s(), d("div", _({
        key: 0,
        ref: o.maskRef,
        onMousedown: t[0] || (t[0] = function() {
          return o.onMaskClick && o.onMaskClick.apply(o, arguments);
        }),
        class: e.cx("mask"),
        style: e.sx("mask", !0, {
          position: e.position,
          modal: e.modal
        }),
        "data-p": o.dataP
      }, e.ptm("mask")), [y(Bt, _({
        name: "p-drawer",
        onEnter: o.onEnter,
        onAfterEnter: o.onAfterEnter,
        onBeforeLeave: o.onBeforeLeave,
        onLeave: o.onLeave,
        onAfterLeave: o.onAfterLeave,
        appear: ""
      }, e.ptm("transition")), {
        default: S(function() {
          return [e.visible ? le((s(), d("div", _({
            key: 0,
            ref: o.containerRef,
            class: e.cx("root"),
            style: e.sx("root"),
            role: e.modal ? "dialog" : "complementary",
            "aria-modal": e.modal ? !0 : void 0,
            "data-p": o.dataP
          }, e.ptmi("root")), [e.$slots.container ? E(e.$slots, "container", {
            key: 0,
            closeCallback: o.hide
          }) : (s(), d(V, {
            key: 1
          }, [l("div", _({
            ref: o.headerContainerRef,
            class: e.cx("header")
          }, e.ptm("header")), [E(e.$slots, "header", {
            class: H(e.cx("title"))
          }, function() {
            return [e.header ? (s(), d("div", _({
              key: 0,
              class: e.cx("title")
            }, e.ptm("title")), m(e.header), 17)) : g("", !0)];
          }), e.showCloseIcon ? E(e.$slots, "closebutton", {
            key: 0,
            closeCallback: o.hide
          }, function() {
            return [y(c, _({
              ref: o.closeButtonRef,
              type: "button",
              class: e.cx("pcCloseButton"),
              "aria-label": o.closeAriaLabel,
              unstyled: e.unstyled,
              onClick: o.hide
            }, e.closeButtonProps, {
              pt: e.ptm("pcCloseButton"),
              "data-pc-group-section": "iconcontainer"
            }), {
              icon: S(function(C) {
                return [E(e.$slots, "closeicon", {}, function() {
                  return [(s(), $(X(e.closeIcon ? "span" : "TimesIcon"), _({
                    class: [e.closeIcon, C.class]
                  }, e.ptm("pcCloseButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["class", "aria-label", "unstyled", "onClick", "pt"])];
          }) : g("", !0)], 16), l("div", _({
            ref: o.contentRef,
            class: e.cx("content")
          }, e.ptm("content")), [E(e.$slots, "default")], 16), e.$slots.footer ? (s(), d("div", _({
            key: 0,
            ref: o.footerContainerRef,
            class: e.cx("footer")
          }, e.ptm("footer")), [E(e.$slots, "footer")], 16)) : g("", !0)], 64))], 16, ma)), [[f]]) : g("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])], 16, va)) : g("", !0)];
    }),
    _: 3
  });
}
qe.render = ha;
const ya = { class: "km-drawer-title" }, ka = /* @__PURE__ */ I({
  __name: "Drawer",
  props: {
    open: { type: Boolean },
    title: {},
    icon: {},
    wide: { type: Boolean },
    back: { type: Boolean }
  },
  emits: ["close", "back"],
  setup(e, { emit: t }) {
    const n = e, a = t, i = w(() => n.wide ? "min(720px, calc(100vw - 36px))" : "min(560px, calc(100vw - 36px))");
    function o(c) {
      c || a("close");
    }
    return (c, b) => (s(), $(r(qe), {
      visible: e.open,
      position: "right",
      modal: !0,
      pt: { content: { class: "km-drawer-content" } },
      dismissable: !0,
      "close-on-escape": !0,
      style: Lt({ width: i.value }),
      "aria-label": e.title,
      "onUpdate:visible": o
    }, Re({
      header: S(() => [
        e.back ? (s(), $(N, {
          key: 0,
          icon: "tabler:chevron-left",
          label: "Back",
          onClick: b[0] || (b[0] = (f) => a("back"))
        })) : g("", !0),
        l("span", ya, [
          e.icon ? (s(), $(r(D), {
            key: 0,
            icon: e.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : g("", !0),
          B(m(e.title), 1)
        ])
      ]),
      default: S(() => [
        E(c.$slots, "default")
      ]),
      _: 2
    }, [
      c.$slots.footer ? {
        name: "footer",
        fn: S(() => [
          E(c.$slots, "footer")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["visible", "style", "aria-label"]));
  }
});
function ga(e) {
  if (!e) return null;
  let t;
  if (typeof e == "number")
    t = e;
  else {
    const n = e.trim();
    if (/^\d+$/.test(n))
      t = Number(n);
    else {
      const a = Date.parse(n);
      return Number.isNaN(a) ? null : a;
    }
  }
  return Number.isFinite(t) ? t < 1e12 ? t * 1e3 : t : null;
}
function wa(e) {
  const t = ga(e);
  return t === null ? "" : new Date(t).toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
const $a = ["title"], Ca = { class: "km-prow-text" }, Sa = { class: "km-prow-name" }, xa = ["title"], _a = { class: "km-prow-sub" }, Ta = { class: "km-prow-acts" }, Ba = {
  key: 0,
  class: "km-prow-msg"
}, La = /* @__PURE__ */ I({
  __name: "ProviderRow",
  props: {
    profile: {},
    providerIcon: {},
    adapterTitle: {},
    selected: { type: Boolean },
    discoverable: { type: Boolean },
    discovering: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["select", "edit", "discover", "delete"],
  setup(e, { emit: t }) {
    const n = e, a = t, i = w(() => {
      if (!n.discoverable) return "Automatic model discovery is not available for this provider";
      const o = wa(n.profile.last_discovered_at);
      return o ? `Discover models (last ${o})` : "Discover models";
    });
    return (o, c) => (s(), d("div", {
      class: H(["km-prow", { on: e.selected }])
    }, [
      l("button", {
        class: "km-prow-main",
        title: r(Ft)(e.profile),
        onClick: c[0] || (c[0] = (b) => a("select"))
      }, [
        y(r(Ce), {
          icon: e.providerIcon,
          size: "sm"
        }, null, 8, ["icon"]),
        l("span", Ca, [
          l("span", Sa, [
            l("span", null, m(e.profile.name), 1),
            r(Vt)(e.profile) ? (s(), $(r(D), {
              key: 0,
              icon: "tabler:key",
              class: "km-prow-cred",
              title: "Credentials stored",
              "aria-hidden": "true"
            })) : g("", !0),
            l("span", {
              class: H(["km-prow-dot", r(Nt)(e.profile.status)]),
              title: r(zt)(e.profile.status),
              "aria-hidden": "true"
            }, null, 10, xa)
          ]),
          l("span", _a, m(e.adapterTitle), 1)
        ]),
        e.profile.enabled ? g("", !0) : (s(), $(r(z), {
          key: 0,
          severity: "warn"
        }, {
          default: S(() => [...c[4] || (c[4] = [
            B("off", -1)
          ])]),
          _: 1
        }))
      ], 8, $a),
      l("div", Ta, [
        y(r(N), {
          icon: "tabler:radar-2",
          label: i.value,
          size: "sm",
          disabled: !e.discoverable || e.discovering || e.busy,
          spin: e.discovering,
          onClick: c[1] || (c[1] = (b) => a("discover"))
        }, null, 8, ["label", "disabled", "spin"]),
        y(r(N), {
          icon: "tabler:edit",
          label: "Edit provider",
          size: "sm",
          disabled: e.busy,
          onClick: c[2] || (c[2] = (b) => a("edit"))
        }, null, 8, ["disabled"]),
        y(r(N), {
          icon: "tabler:trash",
          label: "Delete provider",
          size: "sm",
          variant: "danger",
          disabled: e.busy,
          onClick: c[3] || (c[3] = (b) => a("delete"))
        }, null, 8, ["disabled"])
      ]),
      e.profile.message ? (s(), d("div", Ba, m(e.profile.message), 1)) : g("", !0)
    ], 2));
  }
}), Pa = { class: "km-plist" }, Ea = {
  key: 0,
  class: "km-plist-empty"
}, Aa = /* @__PURE__ */ I({
  __name: "ProviderList",
  props: {
    profiles: {},
    adapters: {},
    presets: {},
    selectedId: {},
    discovering: {},
    busy: { type: Boolean }
  },
  emits: ["select", "edit", "discover", "delete", "add"],
  setup(e, { emit: t }) {
    const n = e, a = t, i = xe(() => n.adapters, () => n.profiles, () => n.presets);
    return (o, c) => (s(), d("div", Pa, [
      l("button", {
        class: H(["km-plist-all", { on: e.selectedId === "all" }]),
        onClick: c[0] || (c[0] = (b) => a("select", "all"))
      }, " All providers ", 2),
      e.profiles.length ? g("", !0) : (s(), d("div", Ea, [
        c[3] || (c[3] = l("p", null, "No providers connected.", -1)),
        y(r(Se), {
          small: "",
          icon: "tabler:plus",
          onClick: c[1] || (c[1] = (b) => a("add"))
        }, {
          default: S(() => [...c[2] || (c[2] = [
            B("Add provider", -1)
          ])]),
          _: 1
        })
      ])),
      (s(!0), d(V, null, K(e.profiles, (b) => (s(), $(La, {
        key: b.id,
        profile: b,
        "provider-icon": r(i).providerIcon(b.provider_id),
        "adapter-title": r(i).adapterTitle(b.provider_id),
        selected: e.selectedId === b.id,
        discoverable: r(i).isDiscoverable(b),
        discovering: e.discovering === b.id,
        busy: e.busy,
        onSelect: (f) => a("select", b.id),
        onEdit: (f) => a("edit", b),
        onDiscover: (f) => a("discover", b),
        onDelete: (f) => a("delete", b)
      }, null, 8, ["profile", "provider-icon", "adapter-title", "selected", "discoverable", "discovering", "busy", "onSelect", "onEdit", "onDiscover", "onDelete"]))), 128))
    ]));
  }
}), Ia = { class: "km-mrow-id" }, Oa = { class: "km-mrow-title" }, Da = { class: "km-mrow-title-text" }, Fa = { class: "km-mrow-sub" }, Va = { class: "km-mrow-prov" }, za = { class: "km-mrow-mono" }, Na = { class: "km-mrow-tags" }, Ra = {
  key: 0,
  class: "km-tag-group km-tag-classes"
}, Ka = { class: "km-tag-group km-tag-caps" }, Ma = { class: "km-mrow-limits" }, ja = {
  class: "km-mrow-limit-chips",
  "aria-label": "Token limits"
}, Ua = { class: "km-mrow-acts" }, Ha = { class: "km-mrow-probe-head" }, Wa = { class: "km-mrow-probe-msg" }, Za = {
  key: 0,
  class: "km-probe-time"
}, qa = {
  key: 0,
  class: "km-mrow-probe-body"
}, Ga = {
  key: 0,
  class: "km-probe-tokens"
}, Qa = {
  key: 1,
  class: "km-probe-out"
}, Ja = {
  key: 2,
  class: "km-probe-out"
}, Fe = 5, Xa = /* @__PURE__ */ I({
  __name: "ModelRow",
  props: {
    model: {},
    providerIcon: {},
    providerTitle: {},
    profileTitle: {},
    probing: { type: Boolean },
    probeState: {},
    probeDetailsOpen: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["edit", "delete", "probe", "toggle-probe-details", "toggle-enabled"],
  setup(e, { emit: t }) {
    const n = e, a = t, i = w(() => n.model.capabilities ?? []), o = w(() => i.value.slice(0, Fe)), c = w(() => Math.max(0, i.value.length - Fe)), b = w(() => i.value.includes("reasoning") || i.value.includes("extended_thinking") || Rt(n.model, "reasoning_model_request") === "true"), f = w(() => n.model.enabled !== !1 && (i.value.includes("generate") || i.value.includes("tool_use"))), C = w(() => n.probeState?.model === n.model.name ? n.probeState : null), x = w(() => C.value?.status || "idle"), v = w(() => x.value === "ok" || x.value === "fail"), p = w(() => x.value === "ok" ? "tabler:circle-check" : x.value === "fail" ? "tabler:circle-x" : "tabler:activity-heartbeat"), h = w(() => {
      if (x.value === "ok") return "success";
      if (x.value === "fail") return "danger";
    }), O = w(() => n.probing ? `Checking ${n.model.title || n.model.name}` : x.value === "ok" ? "Model check succeeded. View details" : x.value === "fail" ? "Model check failed. View details" : "Run model check"), P = w(() => {
      const A = C.value?.data?.tokens;
      if (!A) return [];
      const k = ["prompt_tokens", "completion_tokens", "total_tokens", "thinking_tokens"], L = /* @__PURE__ */ new Set(), M = [], j = (U) => {
        const Q = A[U];
        typeof Q == "number" && Q > 0 && !L.has(U) && (L.add(U), M.push({ label: U.replace(/_tokens$/, "").replace(/_input$/, "").replace(/_/g, " "), value: Q }));
      };
      return k.forEach(j), Object.keys(A).forEach(j), M;
    });
    function W() {
      v.value ? a("toggle-probe-details") : a("probe");
    }
    return (A, k) => (s(), d("div", {
      class: H(["km-mrow", { "km-mrow-off": e.model.enabled === !1 }])
    }, [
      y(r(Ce), { icon: e.providerIcon }, null, 8, ["icon"]),
      l("div", Ia, [
        l("div", Oa, [
          l("span", Da, m(e.model.title || e.model.name), 1),
          y(r(z), {
            severity: r(Kt)(e.model.source)
          }, {
            default: S(() => [
              B(m(r(Mt)(e.model.source)), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          e.model.enabled === !1 ? (s(), $(r(z), {
            key: 0,
            severity: "secondary",
            icon: "tabler:ban"
          }, {
            default: S(() => [...k[4] || (k[4] = [
              B("disabled", -1)
            ])]),
            _: 1
          })) : g("", !0)
        ]),
        l("div", Fa, [
          l("span", Va, m(e.providerTitle || "—"), 1),
          e.model.provider_profile_id ? (s(), d(V, { key: 0 }, [
            B(" · " + m(e.profileTitle), 1)
          ], 64)) : g("", !0),
          l("span", za, " · " + m(e.model.name), 1)
        ])
      ]),
      l("div", Na, [
        (e.model.class || []).length ? (s(), d("span", Ra, [
          (s(!0), d(V, null, K(e.model.class || [], (L) => (s(), $(r(z), {
            key: `k-${L}`,
            severity: "",
            icon: "tabler:category-2"
          }, {
            default: S(() => [
              B(m(L), 1)
            ]),
            _: 2
          }, 1024))), 128))
        ])) : g("", !0),
        l("span", Ka, [
          b.value ? (s(), $(r(z), {
            key: 0,
            severity: "info",
            icon: "tabler:bulb"
          }, {
            default: S(() => [...k[5] || (k[5] = [
              B("reasoning", -1)
            ])]),
            _: 1
          })) : g("", !0),
          (s(!0), d(V, null, K(o.value, (L) => (s(), $(r(z), {
            key: `c-${L}`,
            severity: "secondary",
            icon: r(jt)(L) || void 0
          }, {
            default: S(() => [
              B(m(L), 1)
            ]),
            _: 2
          }, 1032, ["icon"]))), 128)),
          c.value ? (s(), $(r(z), {
            key: 1,
            severity: "secondary"
          }, {
            default: S(() => [
              B("+" + m(c.value), 1)
            ]),
            _: 1
          })) : g("", !0)
        ])
      ]),
      l("div", Ma, [
        l("span", null, [
          l("b", null, m(r(re)(e.model.max_tokens)), 1),
          k[6] || (k[6] = B(" ctx", -1))
        ]),
        l("span", null, [
          l("b", null, m(r(re)(e.model.output_tokens)), 1),
          k[7] || (k[7] = B(" out", -1))
        ])
      ]),
      l("div", ja, [
        l("span", null, [
          l("b", null, m(r(re)(e.model.max_tokens)), 1),
          k[8] || (k[8] = B(" ctx", -1))
        ]),
        l("span", null, [
          l("b", null, m(r(re)(e.model.output_tokens)), 1),
          k[9] || (k[9] = B(" out", -1))
        ])
      ]),
      l("div", Ua, [
        f.value ? (s(), $(r(N), {
          key: 0,
          icon: p.value,
          label: O.value,
          size: "sm",
          variant: "bordered",
          severity: h.value,
          active: v.value && e.probeDetailsOpen,
          spin: e.probing,
          disabled: e.probing || !v.value && e.busy,
          onClick: W
        }, null, 8, ["icon", "label", "severity", "active", "spin", "disabled"])) : g("", !0),
        y(r(N), {
          icon: e.model.enabled === !1 ? "tabler:circle-check" : "tabler:circle-minus",
          label: e.model.enabled === !1 ? "Enable model" : "Disable model",
          size: "sm",
          variant: "bordered",
          disabled: e.busy,
          onClick: k[0] || (k[0] = (L) => a("toggle-enabled"))
        }, null, 8, ["icon", "label", "disabled"]),
        y(r(N), {
          icon: "tabler:adjustments",
          label: "Edit model",
          size: "sm",
          variant: "bordered",
          onClick: k[1] || (k[1] = (L) => a("edit"))
        }),
        e.model.source !== "registry" ? (s(), $(r(N), {
          key: 1,
          icon: "tabler:trash",
          label: "Delete model",
          size: "sm",
          variant: "bordered",
          severity: "danger",
          onClick: k[2] || (k[2] = (L) => a("delete"))
        })) : g("", !0)
      ]),
      e.probeDetailsOpen && v.value ? (s(), d("div", {
        key: 0,
        class: H(["km-mrow-probe", x.value])
      }, [
        l("div", Ha, [
          y(r(D), {
            icon: x.value === "ok" ? "tabler:circle-check" : "tabler:circle-x",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          l("span", Wa, m(x.value === "ok" ? "Model works" : "Model check failed"), 1),
          C.value?.data && C.value.data.elapsed_ms != null ? (s(), d("span", Za, m(C.value.data.elapsed_ms) + " ms", 1)) : g("", !0),
          y(r(Se), {
            icon: "tabler:activity-heartbeat",
            variant: "ghost",
            small: "",
            disabled: e.probing || e.busy,
            onClick: k[3] || (k[3] = (L) => a("probe"))
          }, {
            default: S(() => [...k[10] || (k[10] = [
              B(" Run again ", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        C.value?.data ? (s(), d("div", qa, [
          P.value.length ? (s(), d("div", Ga, [
            k[11] || (k[11] = l("span", { class: "km-probe-tokens-l" }, "Tokens", -1)),
            (s(!0), d(V, null, K(P.value, (L) => (s(), d("span", {
              key: L.label,
              class: "km-probe-tok"
            }, [
              l("b", null, m(L.value), 1),
              B(" " + m(L.label), 1)
            ]))), 128))
          ])) : g("", !0),
          C.value.data.output ? (s(), d("div", Qa, [
            k[12] || (k[12] = l("span", null, "Output", -1)),
            l("pre", null, m(C.value.data.output), 1)
          ])) : g("", !0),
          C.value.data.error ? (s(), d("div", Ja, [
            k[13] || (k[13] = l("span", null, "Error", -1)),
            l("pre", null, m(C.value.data.error), 1)
          ])) : g("", !0)
        ])) : g("", !0)
      ], 2)) : g("", !0)
    ], 2));
  }
}), he = 120;
function Ya(e) {
  const t = Pt({
    search: "",
    source: "all",
    capability: "all",
    klass: "all",
    profile: "all",
    provider: "all",
    limit: he
  }), n = w(() => {
    const v = /* @__PURE__ */ new Set();
    for (const p of e.value) for (const h of p.capabilities ?? []) v.add(h);
    return Array.from(v).sort();
  }), a = w(() => {
    const v = /* @__PURE__ */ new Set();
    for (const p of e.value) for (const h of p.class ?? []) v.add(h);
    return Array.from(v).sort();
  }), i = w(() => {
    const v = /* @__PURE__ */ new Set();
    for (const p of e.value) p.provider_id && v.add(p.provider_id);
    return Array.from(v).sort();
  }), o = w(() => {
    const v = t.search.trim().toLowerCase();
    return e.value.filter((p) => t.source !== "all" && p.source !== t.source || t.capability !== "all" && !(p.capabilities ?? []).includes(t.capability) || t.klass !== "all" && !(p.class ?? []).includes(t.klass) || t.profile !== "all" && (p.provider_profile_id || "") !== t.profile || t.provider !== "all" && (p.provider_id || "") !== t.provider ? !1 : v ? [
      p.name,
      p.title,
      p.provider_model,
      p.provider_id,
      p.provider_profile_id,
      ...p.capabilities ?? [],
      ...p.class ?? []
    ].filter(Boolean).some((h) => String(h).toLowerCase().includes(v)) : !0);
  }), c = w(() => o.value.slice(0, t.limit)), b = w(() => c.value.length < o.value.length), f = w(
    () => (t.source !== "all" ? 1 : 0) + (t.capability !== "all" ? 1 : 0) + (t.klass !== "all" ? 1 : 0) + (t.profile !== "all" ? 1 : 0) + (t.provider !== "all" ? 1 : 0) + (t.search.trim() ? 1 : 0)
  );
  function C() {
    t.limit += he;
  }
  function x() {
    t.search = "", t.source = "all", t.capability = "all", t.klass = "all", t.profile = "all", t.provider = "all", t.limit = he;
  }
  return {
    state: t,
    capabilityOptions: n,
    classOptions: a,
    providerOptions: i,
    filtered: o,
    visible: c,
    hasMore: b,
    activeCount: f,
    more: C,
    reset: x
  };
}
const eo = { class: "km-pool kx-system-pane" }, to = { class: "km-pool-head kx-system-tools" }, no = { class: "km-pool-head-top" }, ao = { class: "km-pool-title" }, oo = { class: "km-pool-counts" }, ro = { class: "km-pool-filters" }, so = {
  key: 0,
  class: "km-pool-body kx-system-body"
}, io = {
  key: 1,
  class: "km-pool-body kx-system-body"
}, lo = {
  key: 2,
  class: "km-pool-table kx-system-body"
}, co = {
  key: 0,
  class: "km-pool-more"
}, uo = /* @__PURE__ */ I({
  __name: "ModelPool",
  props: {
    models: {},
    profiles: {},
    adapters: {},
    presets: {},
    selectedProfileId: {},
    probingModel: {},
    probeState: {},
    probeDetailsModel: {},
    busy: { type: Boolean }
  },
  emits: ["edit", "delete", "probe", "toggle-probe-details", "toggle-enabled", "add"],
  setup(e, { emit: t }) {
    const n = e, a = t, i = xe(() => n.adapters, () => n.profiles, () => n.presets), o = Ya(Et(n, "models")), c = [
      { label: "All sources", value: "all" },
      { label: "Built-in", value: "registry" },
      { label: "Discovered", value: "discovered" },
      { label: "Overlay", value: "overlay" }
    ], b = w(() => [
      { label: "All providers", value: "all" },
      ...o.providerOptions.value.map((v) => ({ label: i.adapterTitle(v), value: v }))
    ]), f = w(() => [
      { label: "All capabilities", value: "all" },
      ...o.capabilityOptions.value.map((v) => ({ label: v, value: v }))
    ]), C = w(() => [
      { label: "All classes", value: "all" },
      ...o.classOptions.value.map((v) => ({ label: v, value: v }))
    ]), x = w(() => {
      let v = 0, p = 0, h = 0;
      for (const O of n.models)
        O.source === "registry" ? v++ : O.source === "discovered" ? p++ : h++;
      return { registry: v, discovered: p, overlay: h };
    });
    return Ke(() => n.selectedProfileId, (v) => {
      o.state.profile = v || "all";
    }, { immediate: !0 }), (v, p) => (s(), d("div", eo, [
      l("header", to, [
        l("div", no, [
          l("div", ao, [
            p[8] || (p[8] = l("span", null, "Model pool", -1)),
            l("span", oo, [
              y(r(z), { severity: "info" }, {
                default: S(() => [
                  B(m(x.value.registry) + " built-in", 1)
                ]),
                _: 1
              }),
              y(r(z), { severity: "success" }, {
                default: S(() => [
                  B(m(x.value.discovered) + " discovered", 1)
                ]),
                _: 1
              }),
              y(r(z), { severity: "warn" }, {
                default: S(() => [
                  B(m(x.value.overlay) + " overlay", 1)
                ]),
                _: 1
              })
            ])
          ]),
          y(r(Nn), {
            modelValue: r(o).state.search,
            "onUpdate:modelValue": p[0] || (p[0] = (h) => r(o).state.search = h),
            placeholder: "Search models"
          }, null, 8, ["modelValue"])
        ]),
        l("div", ro, [
          y(r(se), {
            modelValue: r(o).state.source,
            "onUpdate:modelValue": p[1] || (p[1] = (h) => r(o).state.source = h),
            options: c,
            "aria-label": "Source"
          }, null, 8, ["modelValue"]),
          y(r(se), {
            modelValue: r(o).state.provider,
            "onUpdate:modelValue": p[2] || (p[2] = (h) => r(o).state.provider = h),
            options: b.value,
            "aria-label": "Provider"
          }, null, 8, ["modelValue", "options"]),
          y(r(se), {
            modelValue: r(o).state.capability,
            "onUpdate:modelValue": p[3] || (p[3] = (h) => r(o).state.capability = h),
            options: f.value,
            "aria-label": "Capability"
          }, null, 8, ["modelValue", "options"]),
          y(r(se), {
            modelValue: r(o).state.klass,
            "onUpdate:modelValue": p[4] || (p[4] = (h) => r(o).state.klass = h),
            options: C.value,
            "aria-label": "Class"
          }, null, 8, ["modelValue", "options"]),
          r(o).activeCount.value ? (s(), $(r(N), {
            key: 0,
            icon: "tabler:filter-off",
            label: "Clear filters",
            variant: "bordered",
            onClick: p[5] || (p[5] = (h) => r(o).reset())
          })) : g("", !0)
        ])
      ]),
      e.models.length ? r(o).filtered.value.length ? (s(), d("div", lo, [
        p[9] || (p[9] = l("div", { class: "km-pool-cols" }, [
          l("span"),
          l("span", null, "Model"),
          l("span", null, "Capabilities & classes"),
          l("span", { class: "km-pool-cols-r" }, "Limits"),
          l("span")
        ], -1)),
        (s(!0), d(V, null, K(r(o).visible.value, (h) => (s(), $(Xa, {
          key: h.name,
          model: h,
          "provider-icon": r(i).providerIcon(h.provider_id),
          "provider-title": r(i).adapterTitle(h.provider_id),
          "profile-title": r(i).profileTitle(h.provider_profile_id),
          probing: e.probingModel === h.name,
          "probe-state": e.probeState,
          "probe-details-open": e.probeDetailsModel === h.name,
          busy: e.busy,
          onEdit: (O) => a("edit", h),
          onDelete: (O) => a("delete", h),
          onProbe: (O) => a("probe", h),
          onToggleProbeDetails: (O) => a("toggle-probe-details", h),
          onToggleEnabled: (O) => a("toggle-enabled", h)
        }, null, 8, ["model", "provider-icon", "provider-title", "profile-title", "probing", "probe-state", "probe-details-open", "busy", "onEdit", "onDelete", "onProbe", "onToggleProbeDetails", "onToggleEnabled"]))), 128)),
        r(o).hasMore.value ? (s(), d("div", co, [
          y(r(Se), {
            variant: "ghost",
            icon: "tabler:chevron-down",
            onClick: p[7] || (p[7] = (h) => r(o).more())
          }, {
            default: S(() => [
              B(" Show more (" + m(r(o).filtered.value.length - r(o).visible.value.length) + ") ", 1)
            ]),
            _: 1
          })
        ])) : g("", !0)
      ])) : (s(), d("div", io, [
        y(r(ge), {
          icon: "tabler:search-off",
          title: "No models match",
          hint: "Adjust the search or filters."
        })
      ])) : (s(), d("div", so, [
        y(r(ge), {
          icon: "tabler:cpu",
          title: "No models yet",
          hint: "Connect a provider and discover its models, or add one manually.",
          cta: "Add provider",
          "cta-icon": "tabler:plus",
          onCta: p[6] || (p[6] = (h) => a("add"))
        })
      ]))
    ]));
  }
}), po = { class: "km-classes kx-system-pane" }, bo = {
  key: 0,
  class: "km-pool-body kx-system-body"
}, fo = {
  key: 1,
  class: "km-pool-table km-classes-list kx-system-body"
}, vo = { class: "km-class-head" }, mo = { class: "km-class-head-text" }, ho = { class: "km-class-title" }, yo = {
  key: 0,
  class: "km-class-desc"
}, ko = { class: "km-class-meta" }, go = { class: "km-class-count" }, wo = {
  key: 0,
  class: "km-class-members"
}, $o = {
  key: 1,
  class: "km-class-rank"
}, Co = { class: "km-class-member-name" }, So = { class: "km-class-member-pri" }, xo = {
  key: 1,
  class: "km-class-empty"
}, _o = /* @__PURE__ */ I({
  __name: "ModelClasses",
  props: {
    classes: {}
  },
  setup(e) {
    return (t, n) => (s(), d("div", po, [
      e.classes.length ? (s(), d("div", fo, [
        (s(!0), d(V, null, K(e.classes, (a) => (s(), d("article", {
          key: a.name,
          class: "km-class"
        }, [
          l("div", vo, [
            y(r(Ce), {
              icon: a.icon || "tabler:category",
              size: "sm"
            }, null, 8, ["icon"]),
            l("div", mo, [
              l("div", ho, m(a.title || a.name), 1),
              a.description ? (s(), d("div", yo, m(a.description), 1)) : g("", !0)
            ]),
            l("div", ko, [
              l("span", go, m(a.models.length) + " model" + m(a.models.length === 1 ? "" : "s"), 1)
            ])
          ]),
          a.models.length ? (s(), d("div", wo, [
            (s(!0), d(V, null, K(a.models, (i, o) => (s(), d("div", {
              key: i.name,
              class: H(["km-class-member", { top: o === 0 }])
            }, [
              o === 0 ? (s(), $(r(z), {
                key: 0,
                severity: "success",
                icon: "tabler:check"
              }, {
                default: S(() => [...n[0] || (n[0] = [
                  B("active", -1)
                ])]),
                _: 1
              })) : (s(), d("span", $o, m(o + 1), 1)),
              l("span", Co, m(i.title || i.name), 1),
              l("span", So, "priority " + m(i.priority ?? 0), 1)
            ], 2))), 128))
          ])) : (s(), d("div", xo, "No models assigned to this class yet."))
        ]))), 128))
      ])) : (s(), d("div", bo, [
        y(r(ge), {
          icon: "tabler:category-2",
          title: "No model classes",
          hint: "Classes group models by purpose. The highest-priority model in each class is selected automatically."
        })
      ]))
    ]));
  }
}), To = { class: "km-picker" }, Bo = {
  key: 0,
  class: "km-picker-sec"
}, Lo = { class: "km-picker-list" }, Po = ["onClick"], Eo = { class: "km-picker-ico" }, Ao = { class: "km-picker-body" }, Io = { class: "km-picker-name" }, Oo = { class: "km-picker-desc" }, Do = {
  key: 1,
  class: "km-picker-sec"
}, Fo = { class: "km-picker-list" }, Vo = ["onClick"], zo = { class: "km-picker-ico" }, No = { class: "km-picker-body" }, Ro = { class: "km-picker-name" }, Ko = { class: "km-picker-desc" }, Mo = /* @__PURE__ */ I({
  __name: "ProviderPicker",
  props: {
    presets: {}
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, i = w(() => n.presets.filter((c) => !Ae(c))), o = w(() => n.presets.filter(Ae));
    return (c, b) => (s(), d("div", To, [
      i.value.length ? (s(), d("section", Bo, [
        b[0] || (b[0] = l("div", { class: "km-picker-sec-title" }, "Native providers", -1)),
        l("div", Lo, [
          (s(!0), d(V, null, K(i.value, (f) => (s(), d("button", {
            key: f.id,
            class: "km-picker-item",
            onClick: (C) => a("pick", f)
          }, [
            l("span", Eo, [
              y(r(D), {
                icon: r(Ie)(f),
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            l("span", Ao, [
              l("span", Io, m(f.title), 1),
              l("span", Oo, m(f.description), 1)
            ]),
            y(r(D), {
              icon: "tabler:chevron-right",
              class: "km-picker-go",
              "aria-hidden": "true"
            })
          ], 8, Po))), 128))
        ])
      ])) : g("", !0),
      o.value.length ? (s(), d("section", Do, [
        b[1] || (b[1] = l("div", { class: "km-picker-sec-title" }, "OpenAI-compatible", -1)),
        l("div", Fo, [
          (s(!0), d(V, null, K(o.value, (f) => (s(), d("button", {
            key: f.id,
            class: "km-picker-item",
            onClick: (C) => a("pick", f)
          }, [
            l("span", zo, [
              y(r(D), {
                icon: r(Ie)(f),
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            l("span", No, [
              l("span", Ro, m(f.title), 1),
              l("span", Ko, m(f.config?.base_url || f.description), 1)
            ]),
            y(r(D), {
              icon: "tabler:chevron-right",
              class: "km-picker-go",
              "aria-hidden": "true"
            })
          ], 8, Vo))), 128))
        ])
      ])) : g("", !0)
    ]));
  }
}), jo = { class: "km" }, Uo = { class: "kx-rail-body" }, Ho = "kickside-model-provider-openai-compatible", Wo = "wippy.llm.openai_compat:provider", Zo = /* @__PURE__ */ I({
  __name: "models",
  setup(e) {
    const t = Ut(), { adapters: n, presets: a, profiles: i, models: o, classes: c, loading: b, saving: f, discovering: C, probing: x, error: v } = t, p = R("models"), h = xe(() => n.value, () => i.value), O = R("all"), P = R("none"), W = R("create"), A = R(null), k = R(null), L = R(null), M = R({ status: "idle" }), j = R({ status: "idle" }), U = R("");
    function Q(u) {
      const T = /* @__PURE__ */ new Set();
      for (const F of o.value) for (const pt of u(F) ?? []) T.add(pt);
      return Array.from(T).sort();
    }
    const Ge = w(() => Q((u) => u.capabilities)), Qe = w(() => {
      const u = /* @__PURE__ */ new Set();
      for (const T of c.value) T.name && u.add(T.name);
      for (const T of o.value) for (const F of T.class ?? []) u.add(F);
      return Array.from(u).sort();
    }), Je = w(
      () => k.value?.provider_id || A.value?.provider_id || Wo
    ), ce = w(() => h.adapterFor(Je.value)), ue = w(
      () => A.value?.profile_editor_tag || ce.value?.profile_editor_tag || Ho
    ), Xe = w(() => At(ue.value)), Ye = w(() => It(ue.value)), et = w(() => P.value !== "none"), pe = w(() => P.value === "pick" ? { title: "Add provider", icon: "tabler:plug-connected", back: !1 } : P.value === "provider" ? W.value === "edit" ? { title: k.value?.name || "Edit provider", icon: "tabler:plug-connected", back: !1 } : { title: A.value?.title || "Add provider", icon: "tabler:plug-connected", back: !0 } : P.value === "model" ? { title: L.value?.title || L.value?.name || "Edit model", icon: "tabler:adjustments", back: !1 } : { title: "", icon: "", back: !1 });
    function Z() {
      f.value || (P.value = "none", A.value = null, k.value = null, L.value = null, M.value = { status: "idle" });
    }
    function be() {
      W.value = "create", A.value = null, k.value = null, P.value = "pick";
    }
    function tt(u) {
      A.value = u, P.value = "provider";
    }
    function nt() {
      A.value = null, P.value = "pick";
    }
    function at(u) {
      W.value = "edit", A.value = null, k.value = u, M.value = { status: "idle" }, P.value = "provider";
    }
    async function _e() {
      if (!k.value) return;
      M.value = { status: "testing" };
      const u = await t.testProfile(k.value.id);
      M.value = { status: u.ok ? "ok" : "fail", message: u.message };
    }
    function ot(u) {
      L.value = u, P.value = "model";
    }
    async function Te(u) {
      const T = u?.detail ?? u;
      await t.saveProfile(W.value, k.value?.id || "", T) && Z();
    }
    async function rt(u) {
      await t.saveCard(u) && Z();
    }
    function st(u) {
      return {
        name: u.name,
        title: u.title || u.name,
        description: u.description || "",
        provider_id: u.provider_id,
        provider_profile_id: u.provider_profile_id || void 0,
        provider_model: u.provider_model || u.name,
        capabilities: [...u.capabilities ?? []],
        classes: [...u.class ?? []],
        priority: Number(u.priority ?? 10),
        max_tokens: Number(u.max_tokens ?? 0),
        output_tokens: Number(u.output_tokens ?? 0),
        dimensions: Number(u.dimensions ?? 0),
        pricing: u.pricing ?? {},
        options: u.options ?? {},
        metadata: u.metadata ?? {},
        source: u.source === "registry" ? "overlay" : u.source || "overlay",
        enabled: u.enabled === !1
      };
    }
    async function it(u) {
      await t.saveCard(st(u));
    }
    async function lt(u) {
      U.value = "", j.value = { status: "testing", model: u.name, message: `Probing ${u.title || u.name}` };
      const T = await t.testModel(u.name);
      j.value = {
        status: T.ok ? "ok" : "fail",
        model: u.name,
        message: T.message,
        data: T.data
      };
    }
    function dt(u) {
      j.value.model === u.name && (j.value.status !== "ok" && j.value.status !== "fail" || (U.value = U.value === u.name ? "" : u.name));
    }
    async function ct(u) {
      await Ee.confirm({
        header: "Delete provider",
        message: `Remove “${u.name}”? This cannot be undone.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await t.deleteProfile(u.id);
    }
    async function ut(u) {
      if (u.source === "registry") return;
      const T = u.title || u.name;
      await Ee.confirm({
        header: "Delete model",
        message: `Remove “${T}”? This cannot be undone.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await t.deleteCard(u.name);
    }
    return Ke(p, (u) => {
      u === "classes" && t.loadClasses();
    }), xt(async () => {
      await Promise.all([t.load(), t.loadClasses()]);
    }), (u, T) => (s(), d("div", jo, [
      y(Tn, {
        value: p.value,
        label: "Model sections",
        items: [
          { value: "models", label: "Models", count: r(o).length },
          { value: "classes", label: "Classes", count: r(c).length }
        ],
        "onUpdate:value": T[0] || (T[0] = (F) => p.value = F)
      }, null, 8, ["value", "items"]),
      r(v) ? (s(), $(r(Ht), {
        key: 0,
        severity: "danger",
        class: "km-top-notice",
        onDismiss: T[1] || (T[1] = (F) => v.value = "")
      }, {
        default: S(() => [
          B(m(r(v)), 1)
        ]),
        _: 1
      })) : g("", !0),
      r(b) && !r(o).length && !r(i).length ? (s(), $(r(Wt), {
        key: 1,
        label: "Loading models…"
      })) : (s(), $(r(En), { key: 2 }, {
        rail: S(() => [
          y(r(Fn), {
            title: "Providers",
            count: r(i).length
          }, {
            actions: S(() => [
              y(r(N), {
                icon: "tabler:plus",
                label: "Add provider",
                disabled: r(f),
                onClick: be
              }, null, 8, ["disabled"]),
              y(r(N), {
                icon: "tabler:refresh",
                label: "Refresh",
                disabled: r(b),
                spin: r(b),
                onClick: r(t).load
              }, null, 8, ["disabled", "spin", "onClick"])
            ]),
            _: 1
          }, 8, ["count"]),
          l("div", Uo, [
            y(Aa, {
              profiles: r(i),
              adapters: r(n),
              presets: r(a),
              "selected-id": O.value,
              discovering: r(C),
              busy: r(f),
              onSelect: T[2] || (T[2] = (F) => O.value = F),
              onAdd: be,
              onEdit: at,
              onDiscover: T[3] || (T[3] = (F) => r(t).discover(F.id)),
              onDelete: ct
            }, null, 8, ["profiles", "adapters", "presets", "selected-id", "discovering", "busy"])
          ])
        ]),
        default: S(() => [
          p.value === "models" ? (s(), $(uo, {
            key: 0,
            "selected-profile-id": O.value,
            models: r(o),
            profiles: r(i),
            adapters: r(n),
            presets: r(a),
            "probing-model": r(x),
            "probe-state": j.value,
            "probe-details-model": U.value,
            busy: r(f),
            onEdit: ot,
            onDelete: ut,
            onProbe: lt,
            onToggleProbeDetails: dt,
            onToggleEnabled: it,
            onAdd: be
          }, null, 8, ["selected-profile-id", "models", "profiles", "adapters", "presets", "probing-model", "probe-state", "probe-details-model", "busy"])) : (s(), $(_o, {
            key: 1,
            classes: r(c)
          }, null, 8, ["classes"]))
        ]),
        _: 1
      })),
      y(r(ka), {
        open: et.value,
        title: pe.value.title,
        icon: pe.value.icon,
        back: pe.value.back,
        onClose: Z,
        onBack: nt
      }, {
        default: S(() => [
          P.value === "pick" ? (s(), $(Mo, {
            key: 0,
            presets: r(a),
            onPick: tt
          }, null, 8, ["presets"])) : P.value === "provider" && Ye.value ? (s(), $(Ot, {
            key: 1,
            "spec-key": Xe.value,
            mode: W.value,
            adapter: ce.value || void 0,
            preset: A.value || void 0,
            profile: k.value,
            saving: r(f),
            "test-state": M.value,
            onSave: Te,
            onCancel: Z,
            onTest: _e
          }, null, 8, ["spec-key", "mode", "adapter", "preset", "profile", "saving", "test-state"])) : P.value === "provider" ? (s(), $(Zt, {
            key: 2,
            tag: ue.value,
            mode: W.value,
            adapter: ce.value || void 0,
            preset: A.value || void 0,
            profile: k.value,
            saving: r(f),
            "test-state": M.value,
            onSave: Te,
            onCancel: Z,
            onTest: _e
          }, null, 8, ["tag", "mode", "adapter", "preset", "profile", "saving", "test-state"])) : P.value === "model" ? (s(), $(qt, {
            key: 3,
            model: L.value,
            profiles: r(i),
            saving: r(f),
            "capability-options": Ge.value,
            "class-options": Qe.value,
            onSave: rt,
            onCancel: Z
          }, null, 8, ["model", "profiles", "saving", "capability-options", "class-options"])) : g("", !0)
        ]),
        _: 1
      }, 8, ["open", "title", "icon", "back"])
    ]));
  }
}), er = {
  rootComponent: Zo,
  plugins: [_t]
};
export {
  er as mountConfig
};
//# sourceMappingURL=lazy-mount-CNN2-ziW.js.map
