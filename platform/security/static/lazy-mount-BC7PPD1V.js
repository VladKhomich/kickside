import { B as J, R as Gt, s as nt, f as ot, k as rn, b as Nn, Q as Tt, z as Pt, a as Nt, c as Ot, T as Fn, C as Vn, K as It, v as On, V as Xt, l as ln, d as Et, e as Rn, P as En } from "./wc-runtime-E4NYBaIN.js";
import { mergeProps as $, resolveDirective as qt, withDirectives as bt, openBlock as a, createBlock as k, resolveDynamicComponent as st, withCtx as S, renderSlot as V, normalizeClass as tt, createElementBlock as u, createElementVNode as l, createCommentVNode as m, defineComponent as U, unref as i, createVNode as y, Fragment as Q, renderList as Y, createTextVNode as I, toDisplayString as w, resolveComponent as tn, getCurrentInstance as jn, computed as N, createSlots as Dn, ref as A, onMounted as Kn, watch as jt, onBeforeUnmount as Un, nextTick as sn, useId as Mn, withModifiers as gt, shallowRef as Wn, onUnmounted as Hn, vShow as nn } from "vue";
import { Icon as E } from "@iconify/vue";
import { loadByTagName as Gn, api as at, host as dn } from "@wippy-fe/proxy";
var qn = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-tab", {
      "p-tab-active": e.active,
      "p-disabled": o.disabled
    }];
  }
}, Zn = J.extend({
  name: "tab",
  classes: qn
}), Jn = {
  name: "BaseTab",
  extends: nt,
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
  style: Zn,
  provide: function() {
    return {
      $pcTab: this,
      $parentInstance: this
    };
  }
}, un = {
  name: "Tab",
  extends: Jn,
  inheritAttrs: !1,
  inject: ["$pcTabs", "$pcTabList"],
  methods: {
    onFocus: function() {
      this.$pcTabs.selectOnFocus && this.changeActiveValue();
    },
    onClick: function() {
      this.changeActiveValue();
    },
    onKeydown: function(n) {
      switch (n.code) {
        case "ArrowRight":
          this.onArrowRightKey(n);
          break;
        case "ArrowLeft":
          this.onArrowLeftKey(n);
          break;
        case "Home":
          this.onHomeKey(n);
          break;
        case "End":
          this.onEndKey(n);
          break;
        case "PageDown":
          this.onPageDownKey(n);
          break;
        case "PageUp":
          this.onPageUpKey(n);
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
          this.onEnterKey(n);
          break;
      }
    },
    onArrowRightKey: function(n) {
      var e = this.findNextTab(n.currentTarget);
      e ? this.changeFocusedTab(n, e) : this.onHomeKey(n), n.preventDefault();
    },
    onArrowLeftKey: function(n) {
      var e = this.findPrevTab(n.currentTarget);
      e ? this.changeFocusedTab(n, e) : this.onEndKey(n), n.preventDefault();
    },
    onHomeKey: function(n) {
      var e = this.findFirstTab();
      this.changeFocusedTab(n, e), n.preventDefault();
    },
    onEndKey: function(n) {
      var e = this.findLastTab();
      this.changeFocusedTab(n, e), n.preventDefault();
    },
    onPageDownKey: function(n) {
      this.scrollInView(this.findLastTab()), n.preventDefault();
    },
    onPageUpKey: function(n) {
      this.scrollInView(this.findFirstTab()), n.preventDefault();
    },
    onEnterKey: function(n) {
      this.changeActiveValue();
    },
    findNextTab: function(n) {
      var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = e ? n : n.nextElementSibling;
      return o ? Tt(o, "data-p-disabled") || Tt(o, "data-pc-section") === "activebar" ? this.findNextTab(o) : Pt(o, '[data-pc-name="tab"]') : null;
    },
    findPrevTab: function(n) {
      var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = e ? n : n.previousElementSibling;
      return o ? Tt(o, "data-p-disabled") || Tt(o, "data-pc-section") === "activebar" ? this.findPrevTab(o) : Pt(o, '[data-pc-name="tab"]') : null;
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
    changeFocusedTab: function(n, e) {
      Nn(e), this.scrollInView(e);
    },
    scrollInView: function(n) {
      var e;
      n == null || (e = n.scrollIntoView) === null || e === void 0 || e.call(n, {
        block: "nearest"
      });
    }
  },
  computed: {
    active: function() {
      var n;
      return rn((n = this.$pcTabs) === null || n === void 0 ? void 0 : n.d_value, this.value);
    },
    id: function() {
      var n;
      return "".concat((n = this.$pcTabs) === null || n === void 0 ? void 0 : n.$id, "_tab_").concat(this.value);
    },
    ariaControls: function() {
      var n;
      return "".concat((n = this.$pcTabs) === null || n === void 0 ? void 0 : n.$id, "_tabpanel_").concat(this.value);
    },
    attrs: function() {
      return $(this.asAttrs, this.a11yAttrs, this.ptmi("root", this.ptParams));
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
      return ot({
        active: this.active
      });
    }
  },
  directives: {
    ripple: Gt
  }
};
function Qn(t, n, e, o, c, r) {
  var g = qt("ripple");
  return t.asChild ? V(t.$slots, "default", {
    key: 1,
    dataP: r.dataP,
    class: tt(t.cx("root")),
    active: r.active,
    a11yAttrs: r.a11yAttrs,
    onClick: r.onClick
  }) : bt((a(), k(st(t.as), $({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP,
    onClick: r.onClick
  }, r.attrs), {
    default: S(function() {
      return [V(t.$slots, "default")];
    }),
    _: 3
  }, 16, ["class", "data-p", "onClick"])), [[g]]);
}
un.render = Qn;
var cn = {
  name: "ChevronLeftIcon",
  extends: Nt
};
function Yn(t) {
  return ee(t) || ne(t) || te(t) || Xn();
}
function Xn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function te(t, n) {
  if (t) {
    if (typeof t == "string") return Dt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Dt(t, n) : void 0;
  }
}
function ne(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function ee(t) {
  if (Array.isArray(t)) return Dt(t);
}
function Dt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function oe(t, n, e, o, c, r) {
  return a(), u("svg", $({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Yn(n[0] || (n[0] = [l("path", {
    d: "M9.61296 13C9.50997 13.0005 9.40792 12.9804 9.3128 12.9409C9.21767 12.9014 9.13139 12.8433 9.05902 12.7701L3.83313 7.54416C3.68634 7.39718 3.60388 7.19795 3.60388 6.99022C3.60388 6.78249 3.68634 6.58325 3.83313 6.43628L9.05902 1.21039C9.20762 1.07192 9.40416 0.996539 9.60724 1.00012C9.81032 1.00371 10.0041 1.08597 10.1477 1.22959C10.2913 1.37322 10.3736 1.56698 10.3772 1.77005C10.3808 1.97313 10.3054 2.16968 10.1669 2.31827L5.49496 6.99022L10.1669 11.6622C10.3137 11.8091 10.3962 12.0084 10.3962 12.2161C10.3962 12.4238 10.3137 12.6231 10.1669 12.7701C10.0945 12.8433 10.0083 12.9014 9.91313 12.9409C9.81801 12.9804 9.71596 13.0005 9.61296 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
cn.render = oe;
var pn = {
  name: "ChevronRightIcon",
  extends: Nt
};
function ae(t) {
  return se(t) || le(t) || ie(t) || re();
}
function re() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ie(t, n) {
  if (t) {
    if (typeof t == "string") return Kt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Kt(t, n) : void 0;
  }
}
function le(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function se(t) {
  if (Array.isArray(t)) return Kt(t);
}
function Kt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function de(t, n, e, o, c, r) {
  return a(), u("svg", $({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ae(n[0] || (n[0] = [l("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
pn.render = de;
var ue = {
  root: "p-tablist",
  content: "p-tablist-content p-tablist-viewport",
  tabList: "p-tablist-tab-list",
  activeBar: "p-tablist-active-bar",
  prevButton: "p-tablist-prev-button p-tablist-nav-button",
  nextButton: "p-tablist-next-button p-tablist-nav-button"
}, ce = J.extend({
  name: "tablist",
  classes: ue
}), pe = {
  name: "BaseTabList",
  extends: nt,
  props: {},
  style: ce,
  provide: function() {
    return {
      $pcTabList: this,
      $parentInstance: this
    };
  }
}, bn = {
  name: "TabList",
  extends: pe,
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
    showNavigators: function(n) {
      n ? this.bindResizeObserver() : this.unbindResizeObserver();
    },
    activeValue: {
      flush: "post",
      handler: function() {
        this.updateInkBar(), this.bindInkBarObserver();
      }
    }
  },
  mounted: function() {
    var n = this;
    setTimeout(function() {
      n.updateInkBar(), n.bindInkBarObserver();
    }, 150), this.showNavigators && (this.updateButtonState(), this.bindResizeObserver());
  },
  updated: function() {
    this.showNavigators && this.updateButtonState();
  },
  beforeUnmount: function() {
    this.unbindResizeObserver(), this.unbindInkBarObserver();
  },
  methods: {
    onScroll: function(n) {
      this.showNavigators && this.updateButtonState(), n.preventDefault();
    },
    onPrevButtonClick: function() {
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = Ot(n) - e, c = Math.abs(n.scrollLeft), r = o * 0.8, g = c - r, C = Math.max(g, 0);
      n.scrollLeft = Xt(n) ? -1 * C : C;
    },
    onNextButtonClick: function() {
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = Ot(n) - e, c = Math.abs(n.scrollLeft), r = o * 0.8, g = c + r, C = n.scrollWidth - o, P = Math.min(g, C);
      n.scrollLeft = Xt(n) ? -1 * P : P;
    },
    bindResizeObserver: function() {
      var n = this;
      this.resizeObserver = new ResizeObserver(function() {
        return n.updateButtonState();
      }), this.resizeObserver.observe(this.$refs.list);
    },
    unbindResizeObserver: function() {
      var n;
      (n = this.resizeObserver) === null || n === void 0 || n.unobserve(this.$refs.list), this.resizeObserver = void 0;
    },
    bindInkBarObserver: function() {
      var n = this;
      this.unbindInkBarObserver();
      var e = this.$refs.content, o = Pt(e, '[data-pc-name="tab"][data-p-active="true"]');
      o && (this.inkBarObserver = new ResizeObserver(function() {
        return n.updateInkBar();
      }), this.inkBarObserver.observe(o));
    },
    unbindInkBarObserver: function() {
      var n;
      (n = this.inkBarObserver) === null || n === void 0 || n.disconnect(), this.inkBarObserver = void 0;
    },
    updateInkBar: function() {
      var n = this.$refs, e = n.content, o = n.inkbar, c = n.tabs;
      if (o) {
        var r = Pt(e, '[data-pc-name="tab"][data-p-active="true"]');
        this.$pcTabs.isVertical() ? (o.style.height = Vn(r) + "px", o.style.top = It(r).top - It(c).top + "px") : (o.style.width = On(r) + "px", o.style.left = It(r).left - It(c).left + "px");
      }
    },
    updateButtonState: function() {
      var n = this.$refs, e = n.list, o = n.content, c = o.scrollTop, r = o.scrollWidth, g = o.scrollHeight, C = o.offsetWidth, P = o.offsetHeight, _ = Math.abs(o.scrollLeft), s = [Ot(o), Fn(o)], x = s[0], B = s[1];
      this.$pcTabs.isVertical() ? (this.isPrevButtonEnabled = c !== 0, this.isNextButtonEnabled = e.offsetHeight >= P && parseInt(c) !== g - B) : (this.isPrevButtonEnabled = _ !== 0, this.isNextButtonEnabled = e.offsetWidth >= C && parseInt(_) !== r - x);
    },
    getVisibleButtonWidths: function() {
      var n = this.$refs, e = n.prevButton, o = n.nextButton, c = 0;
      return this.showNavigators && (c = (e?.offsetWidth || 0) + (o?.offsetWidth || 0)), c;
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
      return ot({
        scrollable: this.$pcTabs.scrollable
      });
    }
  },
  components: {
    ChevronLeftIcon: cn,
    ChevronRightIcon: pn
  },
  directives: {
    ripple: Gt
  }
}, be = ["data-p"], ve = ["aria-label", "tabindex"], fe = ["data-p"], he = ["aria-orientation"], ge = ["aria-label", "tabindex"];
function me(t, n, e, o, c, r) {
  var g = qt("ripple");
  return a(), u("div", $({
    ref: "list",
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [r.showNavigators && c.isPrevButtonEnabled ? bt((a(), u("button", $({
    key: 0,
    ref: "prevButton",
    type: "button",
    class: t.cx("prevButton"),
    "aria-label": r.prevButtonAriaLabel,
    tabindex: r.$pcTabs.tabindex,
    onClick: n[0] || (n[0] = function() {
      return r.onPrevButtonClick && r.onPrevButtonClick.apply(r, arguments);
    })
  }, t.ptm("prevButton"), {
    "data-pc-group-section": "navigator"
  }), [(a(), k(st(r.templates.previcon || "ChevronLeftIcon"), $({
    "aria-hidden": "true"
  }, t.ptm("prevIcon")), null, 16))], 16, ve)), [[g]]) : m("", !0), l("div", $({
    ref: "content",
    class: t.cx("content"),
    onScroll: n[1] || (n[1] = function() {
      return r.onScroll && r.onScroll.apply(r, arguments);
    }),
    "data-p": r.dataP
  }, t.ptm("content")), [l("div", $({
    ref: "tabs",
    class: t.cx("tabList"),
    role: "tablist",
    "aria-orientation": r.$pcTabs.orientation || "horizontal"
  }, t.ptm("tabList")), [V(t.$slots, "default"), l("span", $({
    ref: "inkbar",
    class: t.cx("activeBar"),
    role: "presentation",
    "aria-hidden": "true"
  }, t.ptm("activeBar")), null, 16)], 16, he)], 16, fe), r.showNavigators && c.isNextButtonEnabled ? bt((a(), u("button", $({
    key: 1,
    ref: "nextButton",
    type: "button",
    class: t.cx("nextButton"),
    "aria-label": r.nextButtonAriaLabel,
    tabindex: r.$pcTabs.tabindex,
    onClick: n[2] || (n[2] = function() {
      return r.onNextButtonClick && r.onNextButtonClick.apply(r, arguments);
    })
  }, t.ptm("nextButton"), {
    "data-pc-group-section": "navigator"
  }), [(a(), k(st(r.templates.nexticon || "ChevronRightIcon"), $({
    "aria-hidden": "true"
  }, t.ptm("nextIcon")), null, 16))], 16, ge)), [[g]]) : m("", !0)], 16, be);
}
bn.render = me;
var ye = `
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
`, ke = {
  root: function(n) {
    var e = n.props;
    return ["p-tabs p-component", {
      "p-tabs-scrollable": e.scrollable
    }];
  }
}, $e = J.extend({
  name: "tabs",
  style: ye,
  classes: ke
}), we = {
  name: "BaseTabs",
  extends: nt,
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
  style: $e,
  provide: function() {
    return {
      $pcTabs: this,
      $parentInstance: this
    };
  }
}, vn = {
  name: "Tabs",
  extends: we,
  inheritAttrs: !1,
  emits: ["update:value"],
  data: function() {
    return {
      d_value: this.value
    };
  },
  watch: {
    value: function(n) {
      this.d_value = n;
    }
  },
  methods: {
    updateValue: function(n) {
      this.d_value !== n && (this.d_value = n, this.$emit("update:value", n));
    },
    isVertical: function() {
      return this.orientation === "vertical";
    }
  }
};
function xe(t, n, e, o, c, r) {
  return a(), u("div", $({
    class: t.cx("root")
  }, t.ptmi("root")), [V(t.$slots, "default")], 16);
}
vn.render = xe;
const Ce = {
  key: 0,
  class: "kx-system-tab-count"
}, Se = /* @__PURE__ */ U({
  __name: "SystemTabs",
  props: {
    value: {},
    label: {},
    items: {}
  },
  emits: ["update:value"],
  setup(t) {
    return (n, e) => (a(), k(i(vn), {
      class: "kx-system-tabs",
      "data-kx-separator": "surface",
      value: t.value,
      "onUpdate:value": e[0] || (e[0] = (o) => n.$emit("update:value", String(o)))
    }, {
      default: S(() => [
        y(i(bn), {
          pt: { tabList: { "aria-label": t.label } }
        }, {
          default: S(() => [
            (a(!0), u(Q, null, Y(t.items, (o) => (a(), k(i(un), $({
              key: o.value,
              value: o.value
            }, { ref_for: !0 }, o.controls ? { "aria-controls": o.controls } : {}), {
              default: S(() => [
                I(w(o.label), 1),
                o.count !== void 0 ? (a(), u("b", Ce, w(o.count), 1)) : m("", !0)
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
}), Be = { class: "kx-shell" }, Te = { class: "kx-rail" }, Ie = { class: "kx-main kx-system-pane" }, Pe = /* @__PURE__ */ U({
  __name: "Shell",
  setup(t) {
    return (n, e) => (a(), u("div", Be, [
      l("aside", Te, [
        V(n.$slots, "rail")
      ]),
      l("main", Ie, [
        V(n.$slots, "default")
      ])
    ]));
  }
}), Ae = { class: "kx-railhead" }, ze = { class: "kx-railhead-title" }, _e = { key: 0 }, Le = { class: "kx-railhead-acts" }, Ne = /* @__PURE__ */ U({
  __name: "RailHeader",
  props: {
    title: {},
    count: {}
  },
  setup(t) {
    return (n, e) => (a(), u("div", Ae, [
      l("span", ze, [
        I(w(t.title), 1),
        t.count !== void 0 ? (a(), u("b", _e, w(t.count), 1)) : m("", !0)
      ]),
      l("div", Le, [
        V(n.$slots, "actions")
      ])
    ]));
  }
});
var Zt = {
  name: "SpinnerIcon",
  extends: Nt
};
function Fe(t) {
  return Ee(t) || Re(t) || Oe(t) || Ve();
}
function Ve() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Oe(t, n) {
  if (t) {
    if (typeof t == "string") return Ut(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Ut(t, n) : void 0;
  }
}
function Re(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Ee(t) {
  if (Array.isArray(t)) return Ut(t);
}
function Ut(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function je(t, n, e, o, c, r) {
  return a(), u("svg", $({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Fe(n[0] || (n[0] = [l("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Zt.render = je;
var De = `
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
`, Ke = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Et(e.value) && String(e.value).length === 1,
      "p-badge-dot": ln(e.value) && !o.$slots.default,
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
}, Ue = J.extend({
  name: "badge",
  style: De,
  classes: Ke
}), Me = {
  name: "BaseBadge",
  extends: nt,
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
  style: Ue,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function mt(t) {
  "@babel/helpers - typeof";
  return mt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, mt(t);
}
function en(t, n, e) {
  return (n = We(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function We(t) {
  var n = He(t, "string");
  return mt(n) == "symbol" ? n : n + "";
}
function He(t, n) {
  if (mt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (mt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var fn = {
  name: "Badge",
  extends: Me,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ot(en(en({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ge = ["data-p"];
function qe(t, n, e, o, c, r) {
  return a(), u("span", $({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [V(t.$slots, "default", {}, function() {
    return [I(w(t.value), 1)];
  })], 16, Ge);
}
fn.render = qe;
var Ze = `
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
function yt(t) {
  "@babel/helpers - typeof";
  return yt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, yt(t);
}
function et(t, n, e) {
  return (n = Je(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Je(t) {
  var n = Qe(t, "string");
  return yt(n) == "symbol" ? n : n + "";
}
function Qe(t, n) {
  if (yt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (yt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ye = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-button p-component", et(et(et(et(et(et(et(et(et({
      "p-button-icon-only": e.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", e.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(n) {
    var e = n.props;
    return ["p-button-icon", et({}, "p-button-icon-".concat(e.iconPos), e.label)];
  },
  label: "p-button-label"
}, Xe = J.extend({
  name: "button",
  style: Ze,
  classes: Ye
}), to = {
  name: "BaseButton",
  extends: nt,
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
  style: Xe,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function kt(t) {
  "@babel/helpers - typeof";
  return kt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, kt(t);
}
function G(t, n, e) {
  return (n = no(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function no(t) {
  var n = eo(t, "string");
  return kt(n) == "symbol" ? n : n + "";
}
function eo(t, n) {
  if (kt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (kt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ct = {
  name: "Button",
  extends: to,
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
      return $(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return ln(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return ot(G(G(G(G(G(G(G(G(G(G({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return ot(G(G({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return ot(G(G({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Zt,
    Badge: fn
  },
  directives: {
    ripple: Gt
  }
}, oo = ["data-p"], ao = ["data-p"];
function ro(t, n, e, o, c, r) {
  var g = tn("SpinnerIcon"), C = tn("Badge"), P = qt("ripple");
  return t.asChild ? V(t.$slots, "default", {
    key: 1,
    class: tt(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : bt((a(), k(st(t.as), $({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: S(function() {
      return [V(t.$slots, "default", {}, function() {
        return [t.loading ? V(t.$slots, "loadingicon", $({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (a(), u("span", $({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (a(), k(g, $({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : V(t.$slots, "icon", $({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (a(), u("span", $({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, oo)) : m("", !0)];
        }), t.label ? (a(), u("span", $({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), w(t.label), 17, ao)) : m("", !0), t.badge ? (a(), k(C, {
          key: 3,
          value: t.badge,
          class: tt(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : m("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[P]]);
}
Ct.render = ro;
const At = /* @__PURE__ */ U({
  __name: "IconButton",
  props: {
    icon: {},
    label: {},
    active: { type: Boolean },
    disabled: { type: Boolean },
    variant: { default: "plain" },
    size: { default: "md" },
    spin: { type: Boolean }
  },
  emits: ["click"],
  setup(t, { emit: n }) {
    const e = t, o = n, c = jn(), r = N(
      () => Object.prototype.hasOwnProperty.call(c?.vnode.props ?? {}, "active")
    ), g = N(
      () => e.variant === "danger" ? "danger" : e.variant === "bordered" ? "secondary" : void 0
    ), C = N(
      () => e.size === "sm" ? "small" : e.size === "lg" ? "large" : void 0
    );
    return (P, _) => (a(), k(i(Ct), {
      type: "button",
      severity: g.value,
      text: t.variant !== "bordered" && !t.active,
      outlined: t.variant === "bordered",
      size: C.value,
      loading: t.spin,
      disabled: t.disabled || t.spin,
      pt: {
        root: {
          "aria-label": t.label,
          "aria-pressed": r.value ? String(t.active) : void 0,
          title: t.label
        }
      },
      onClick: _[0] || (_[0] = (s) => o("click"))
    }, {
      icon: S(() => [
        y(i(E), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      _: 1
    }, 8, ["severity", "text", "outlined", "size", "loading", "disabled", "pt"]));
  }
}), X = /* @__PURE__ */ U({
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
    const e = t, o = n, c = N(
      () => e.variant === "danger" ? "danger" : e.variant === "primary" ? void 0 : "secondary"
    );
    return (r, g) => (a(), k(i(Ct), {
      type: t.type,
      severity: c.value,
      outlined: t.variant === "ghost",
      loading: t.loading,
      disabled: t.disabled || t.loading,
      size: t.small ? "small" : void 0,
      onClick: g[0] || (g[0] = (C) => o("click"))
    }, {
      default: S(() => [
        t.loading ? (a(), k(i(Zt), {
          key: 0,
          class: "p-button-loading-icon p-button-icon",
          spin: ""
        })) : m("", !0),
        t.icon && !t.loading ? (a(), k(i(E), {
          key: 1,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : m("", !0),
        V(r.$slots, "default")
      ]),
      _: 3
    }, 8, ["type", "severity", "outlined", "loading", "disabled", "size"]));
  }
});
var io = {
  name: "BaseEditableHolder",
  extends: nt,
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
      var o, c;
      this.controlled && (this.d_value = n, this.$emit("update:modelValue", n)), this.$emit("value-change", n), (o = (c = this.formField).onChange) === null || o === void 0 || o.call(c, {
        originalEvent: e,
        value: n
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var n = arguments.length, e = new Array(n), o = 0; o < n; o++)
        e[o] = arguments[o];
      return e.find(Et);
    }
  },
  computed: {
    $filled: function() {
      return Et(this.d_value);
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
}, hn = {
  name: "BaseInput",
  extends: io,
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
      var n;
      return (n = this.variant) !== null && n !== void 0 ? n : this.$primevue.config.inputStyle || this.$primevue.config.inputVariant;
    },
    $fluid: function() {
      var n;
      return (n = this.fluid) !== null && n !== void 0 ? n : !!this.$pcFluid;
    },
    // @deprecated use $fluid instead
    hasFluid: function() {
      return this.$fluid;
    }
  }
}, lo = `
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
`, so = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-inputtext p-component", {
      "p-filled": e.$filled,
      "p-inputtext-sm p-inputfield-sm": o.size === "small",
      "p-inputtext-lg p-inputfield-lg": o.size === "large",
      "p-invalid": e.$invalid,
      "p-variant-filled": e.$variant === "filled",
      "p-inputtext-fluid": e.$fluid
    }];
  }
}, uo = J.extend({
  name: "inputtext",
  style: lo,
  classes: so
}), co = {
  name: "BaseInputText",
  extends: hn,
  style: uo,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function $t(t) {
  "@babel/helpers - typeof";
  return $t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, $t(t);
}
function po(t, n, e) {
  return (n = bo(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function bo(t) {
  var n = vo(t, "string");
  return $t(n) == "symbol" ? n : n + "";
}
function vo(t, n) {
  if ($t(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if ($t(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Jt = {
  name: "InputText",
  extends: co,
  inheritAttrs: !1,
  methods: {
    onInput: function(n) {
      this.writeValue(n.target.value, n);
    }
  },
  computed: {
    attrs: function() {
      return $(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return ot(po({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, fo = ["value", "name", "disabled", "aria-invalid", "data-p"];
function ho(t, n, e, o, c, r) {
  return a(), u("input", $({
    type: "text",
    class: t.cx("root"),
    value: t.d_value,
    name: t.name,
    disabled: t.disabled,
    "aria-invalid": t.$invalid || void 0,
    "data-p": r.dataP,
    onInput: n[0] || (n[0] = function() {
      return r.onInput && r.onInput.apply(r, arguments);
    })
  }, r.attrs), null, 16, fo);
}
Jt.render = ho;
var go = `
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
`, mo = {
  root: "p-iconfield"
}, yo = J.extend({
  name: "iconfield",
  style: go,
  classes: mo
}), ko = {
  name: "BaseIconField",
  extends: nt,
  style: yo,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, gn = {
  name: "IconField",
  extends: ko,
  inheritAttrs: !1
};
function $o(t, n, e, o, c, r) {
  return a(), u("div", $({
    class: t.cx("root")
  }, t.ptmi("root")), [V(t.$slots, "default")], 16);
}
gn.render = $o;
var wo = {
  root: "p-inputicon"
}, xo = J.extend({
  name: "inputicon",
  classes: wo
}), Co = {
  name: "BaseInputIcon",
  extends: nt,
  style: xo,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, mn = {
  name: "InputIcon",
  extends: Co,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function So(t, n, e, o, c, r) {
  return a(), u("span", $({
    class: r.containerClass
  }, t.ptmi("root"), {
    "aria-hidden": "true"
  }), [V(t.$slots, "default")], 16);
}
mn.render = So;
const on = /* @__PURE__ */ U({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(t, { emit: n }) {
    const e = n;
    return (o, c) => (a(), k(i(gn), { class: "km-search" }, {
      default: S(() => [
        y(i(mn), null, {
          default: S(() => [
            y(i(E), {
              icon: "tabler:search",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        y(i(Jt), {
          class: "km-search-input",
          "aria-label": t.placeholder || "Search",
          "model-value": t.modelValue,
          placeholder: t.placeholder || "Search",
          "onUpdate:modelValue": c[0] || (c[0] = (r) => e("update:modelValue", r ?? ""))
        }, null, 8, ["aria-label", "model-value", "placeholder"]),
        t.modelValue ? (a(), k(i(Ct), {
          key: 0,
          text: "",
          severity: "secondary",
          class: "km-search-clear",
          "aria-label": "Clear search",
          onClick: c[1] || (c[1] = (r) => e("update:modelValue", ""))
        }, {
          icon: S(() => [
            y(i(E), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })) : m("", !0)
      ]),
      _: 1
    }));
  }
}), Bo = { class: "km-field" }, To = { class: "km-field-label" }, Io = {
  key: 0,
  class: "km-field-help"
}, zt = /* @__PURE__ */ U({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(t) {
    return (n, e) => (a(), u("label", Bo, [
      l("span", To, w(t.label), 1),
      V(n.$slots, "default"),
      t.help ? (a(), u("small", Io, w(t.help), 1)) : m("", !0)
    ]));
  }
}), an = /* @__PURE__ */ U({
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
    return (o, c) => (a(), k(i(Jt), {
      class: tt(["km-input", t.mono && "mono"]),
      type: t.type,
      "model-value": String(t.modelValue),
      placeholder: t.placeholder,
      readonly: t.readonly,
      disabled: t.disabled,
      autocomplete: t.autocomplete,
      min: t.min,
      max: t.max,
      step: t.step,
      "onUpdate:modelValue": c[0] || (c[0] = (r) => e("update:modelValue", r ?? ""))
    }, null, 8, ["class", "type", "model-value", "placeholder", "readonly", "disabled", "autocomplete", "min", "max", "step"]));
  }
});
var Po = `
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
`, Ao = {
  root: function(n) {
    var e = n.props;
    return ["p-tag p-component", {
      "p-tag-info": e.severity === "info",
      "p-tag-success": e.severity === "success",
      "p-tag-warn": e.severity === "warn",
      "p-tag-danger": e.severity === "danger",
      "p-tag-secondary": e.severity === "secondary",
      "p-tag-contrast": e.severity === "contrast",
      "p-tag-rounded": e.rounded
    }];
  },
  icon: "p-tag-icon",
  label: "p-tag-label"
}, zo = J.extend({
  name: "tag",
  style: Po,
  classes: Ao
}), _o = {
  name: "BaseTag",
  extends: nt,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: zo,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function wt(t) {
  "@babel/helpers - typeof";
  return wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, wt(t);
}
function Lo(t, n, e) {
  return (n = No(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function No(t) {
  var n = Fo(t, "string");
  return wt(n) == "symbol" ? n : n + "";
}
function Fo(t, n) {
  if (wt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (wt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var yn = {
  name: "Tag",
  extends: _o,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ot(Lo({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, Vo = ["data-p"];
function Oo(t, n, e, o, c, r) {
  return a(), u("span", $({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (a(), k(st(t.$slots.icon), $({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), u("span", $({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : m("", !0), t.value != null || t.$slots.default ? V(t.$slots, "default", {
    key: 2
  }, function() {
    return [l("span", $({
      class: t.cx("label")
    }, t.ptm("label")), w(t.value), 17)];
  }) : m("", !0)], 16, Vo);
}
yn.render = Oo;
const Ro = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, _t = /* @__PURE__ */ U({
  __name: "Pill",
  props: {
    severity: { default: "secondary" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(t) {
    return (n, e) => (a(), k(i(yn), {
      severity: t.severity || void 0,
      class: "km-pill kx-tag-sm"
    }, {
      default: S(() => [
        t.dot ? (a(), u("span", Ro)) : t.icon ? (a(), k(i(E), {
          key: 1,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : m("", !0),
        V(n.$slots, "default")
      ]),
      _: 3
    }, 8, ["severity"]));
  }
}), Eo = { class: "km-notice-text" }, Lt = /* @__PURE__ */ U({
  __name: "Notice",
  props: {
    severity: { default: "info" }
  },
  emits: ["dismiss"],
  setup(t, { emit: n }) {
    const e = n, o = (c) => c === "danger" ? "tabler:alert-triangle" : c === "success" ? "tabler:circle-check" : "tabler:info-circle";
    return (c, r) => (a(), u("div", {
      class: tt(["km-notice", `is-${t.severity}`]),
      role: "status"
    }, [
      y(i(E), {
        icon: o(t.severity),
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      l("span", Eo, [
        V(c.$slots, "default")
      ]),
      l("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: r[0] || (r[0] = (g) => e("dismiss"))
      }, [
        y(i(E), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
});
var jo = `
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
`, Do = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
}, Ko = J.extend({
  name: "progressspinner",
  style: jo,
  classes: Do
}), Uo = {
  name: "BaseProgressSpinner",
  extends: nt,
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
  style: Ko,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, kn = {
  name: "ProgressSpinner",
  extends: Uo,
  inheritAttrs: !1,
  computed: {
    svgStyle: function() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
}, Mo = ["fill", "stroke-width"];
function Wo(t, n, e, o, c, r) {
  return a(), u("div", $({
    class: t.cx("root"),
    role: "progressbar"
  }, t.ptmi("root")), [(a(), u("svg", $({
    class: t.cx("spin"),
    viewBox: "25 25 50 50",
    style: r.svgStyle
  }, t.ptm("spin")), [l("circle", $({
    class: t.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: t.fill,
    "stroke-width": t.strokeWidth,
    strokeMiterlimit: "10"
  }, t.ptm("circle")), null, 16, Mo)], 16))], 16);
}
kn.render = Wo;
const Ho = { class: "km-loading" }, Go = { key: 0 }, Mt = /* @__PURE__ */ U({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(t) {
    return (n, e) => (a(), u("div", Ho, [
      y(i(kn), {
        style: { width: "22px", height: "22px", margin: "0" },
        "aria-label": t.label || "Loading"
      }, null, 8, ["aria-label"]),
      t.label ? (a(), u("span", Go, w(t.label), 1)) : m("", !0)
    ]));
  }
}), qo = { class: "kx-empty" }, Zo = { class: "kx-empty-ico" }, Jo = { class: "kx-empty-title" }, Qo = {
  key: 0,
  class: "kx-empty-sub"
}, $n = /* @__PURE__ */ U({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(t) {
    return (n, e) => (a(), u("div", qo, [
      l("div", Zo, [
        y(i(E), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      l("div", Jo, w(t.title), 1),
      t.hint || n.$slots.hint ? (a(), u("p", Qo, [
        V(n.$slots, "hint", {}, () => [
          I(w(t.hint), 1)
        ])
      ])) : m("", !0),
      t.cta ? (a(), k(i(Ct), {
        key: 1,
        label: t.cta,
        onClick: e[0] || (e[0] = (o) => n.$emit("cta"))
      }, Dn({ _: 2 }, [
        t.ctaIcon ? {
          name: "icon",
          fn: S(({ class: o }) => [
            y(i(E), {
              icon: t.ctaIcon,
              class: tt(o),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : m("", !0)
    ]));
  }
});
var wn = {
  name: "TimesCircleIcon",
  extends: Nt
};
function Yo(t) {
  return ea(t) || na(t) || ta(t) || Xo();
}
function Xo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ta(t, n) {
  if (t) {
    if (typeof t == "string") return Wt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Wt(t, n) : void 0;
  }
}
function na(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function ea(t) {
  if (Array.isArray(t)) return Wt(t);
}
function Wt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function oa(t, n, e, o, c, r) {
  return a(), u("svg", $({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Yo(n[0] || (n[0] = [l("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
wn.render = oa;
var aa = `
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`, ra = {
  root: "p-chip p-component",
  image: "p-chip-image",
  icon: "p-chip-icon",
  label: "p-chip-label",
  removeIcon: "p-chip-remove-icon"
}, ia = J.extend({
  name: "chip",
  style: aa,
  classes: ra
}), la = {
  name: "BaseChip",
  extends: nt,
  props: {
    label: {
      type: [String, Number],
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    removable: {
      type: Boolean,
      default: !1
    },
    removeIcon: {
      type: String,
      default: void 0
    }
  },
  style: ia,
  provide: function() {
    return {
      $pcChip: this,
      $parentInstance: this
    };
  }
}, xn = {
  name: "Chip",
  extends: la,
  inheritAttrs: !1,
  emits: ["remove"],
  data: function() {
    return {
      visible: !0
    };
  },
  methods: {
    onKeydown: function(n) {
      (n.key === "Enter" || n.key === "Backspace") && this.close(n);
    },
    close: function(n) {
      this.visible = !1, this.$emit("remove", n);
    }
  },
  computed: {
    dataP: function() {
      return ot({
        removable: this.removable
      });
    }
  },
  components: {
    TimesCircleIcon: wn
  }
}, sa = ["aria-label", "data-p"], da = ["src"];
function ua(t, n, e, o, c, r) {
  return c.visible ? (a(), u("div", $({
    key: 0,
    class: t.cx("root"),
    "aria-label": t.label
  }, t.ptmi("root"), {
    "data-p": r.dataP
  }), [V(t.$slots, "default", {}, function() {
    return [t.image ? (a(), u("img", $({
      key: 0,
      src: t.image
    }, t.ptm("image"), {
      class: t.cx("image")
    }), null, 16, da)) : t.$slots.icon ? (a(), k(st(t.$slots.icon), $({
      key: 1,
      class: t.cx("icon")
    }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), u("span", $({
      key: 2,
      class: [t.cx("icon"), t.icon]
    }, t.ptm("icon")), null, 16)) : m("", !0), t.label !== null ? (a(), u("div", $({
      key: 3,
      class: t.cx("label")
    }, t.ptm("label")), w(t.label), 17)) : m("", !0)];
  }), t.removable ? V(t.$slots, "removeicon", {
    key: 0,
    removeCallback: r.close,
    keydownCallback: r.onKeydown
  }, function() {
    return [(a(), k(st(t.removeIcon ? "span" : "TimesCircleIcon"), $({
      class: [t.cx("removeIcon"), t.removeIcon],
      onClick: r.close,
      onKeydown: r.onKeydown
    }, t.ptm("removeIcon")), null, 16, ["class", "onClick", "onKeydown"]))];
  }) : m("", !0)], 16, sa)) : m("", !0);
}
xn.render = ua;
var ca = `
    .p-radiobutton {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
    }

    .p-radiobutton-input {
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
        border: 1px solid transparent;
        border-radius: 50%;
    }

    .p-radiobutton-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 1px solid dt('radiobutton.border.color');
        background: dt('radiobutton.background');
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
        transition:
            background dt('radiobutton.transition.duration'),
            color dt('radiobutton.transition.duration'),
            border-color dt('radiobutton.transition.duration'),
            box-shadow dt('radiobutton.transition.duration'),
            outline-color dt('radiobutton.transition.duration');
        outline-color: transparent;
        box-shadow: dt('radiobutton.shadow');
    }

    .p-radiobutton-icon {
        transition-duration: dt('radiobutton.transition.duration');
        background: transparent;
        font-size: dt('radiobutton.icon.size');
        width: dt('radiobutton.icon.size');
        height: dt('radiobutton.icon.size');
        border-radius: 50%;
        backface-visibility: hidden;
        transform: translateZ(0) scale(0.1);
    }

    .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:hover) .p-radiobutton-box {
        border-color: dt('radiobutton.hover.border.color');
    }

    .p-radiobutton-checked .p-radiobutton-box {
        border-color: dt('radiobutton.checked.border.color');
        background: dt('radiobutton.checked.background');
    }

    .p-radiobutton-checked .p-radiobutton-box .p-radiobutton-icon {
        background: dt('radiobutton.icon.checked.color');
        transform: translateZ(0) scale(1, 1);
        visibility: visible;
    }

    .p-radiobutton-checked:not(.p-disabled):has(.p-radiobutton-input:hover) .p-radiobutton-box {
        border-color: dt('radiobutton.checked.hover.border.color');
        background: dt('radiobutton.checked.hover.background');
    }

    .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:hover).p-radiobutton-checked .p-radiobutton-box .p-radiobutton-icon {
        background: dt('radiobutton.icon.checked.hover.color');
    }

    .p-radiobutton:not(.p-disabled):has(.p-radiobutton-input:focus-visible) .p-radiobutton-box {
        border-color: dt('radiobutton.focus.border.color');
        box-shadow: dt('radiobutton.focus.ring.shadow');
        outline: dt('radiobutton.focus.ring.width') dt('radiobutton.focus.ring.style') dt('radiobutton.focus.ring.color');
        outline-offset: dt('radiobutton.focus.ring.offset');
    }

    .p-radiobutton-checked:not(.p-disabled):has(.p-radiobutton-input:focus-visible) .p-radiobutton-box {
        border-color: dt('radiobutton.checked.focus.border.color');
    }

    .p-radiobutton.p-invalid > .p-radiobutton-box {
        border-color: dt('radiobutton.invalid.border.color');
    }

    .p-radiobutton.p-variant-filled .p-radiobutton-box {
        background: dt('radiobutton.filled.background');
    }

    .p-radiobutton.p-variant-filled.p-radiobutton-checked .p-radiobutton-box {
        background: dt('radiobutton.checked.background');
    }

    .p-radiobutton.p-variant-filled:not(.p-disabled):has(.p-radiobutton-input:hover).p-radiobutton-checked .p-radiobutton-box {
        background: dt('radiobutton.checked.hover.background');
    }

    .p-radiobutton.p-disabled {
        opacity: 1;
    }

    .p-radiobutton.p-disabled .p-radiobutton-box {
        background: dt('radiobutton.disabled.background');
        border-color: dt('radiobutton.checked.disabled.border.color');
    }

    .p-radiobutton-checked.p-disabled .p-radiobutton-box .p-radiobutton-icon {
        background: dt('radiobutton.icon.disabled.color');
    }

    .p-radiobutton-sm,
    .p-radiobutton-sm .p-radiobutton-box {
        width: dt('radiobutton.sm.width');
        height: dt('radiobutton.sm.height');
    }

    .p-radiobutton-sm .p-radiobutton-icon {
        font-size: dt('radiobutton.icon.sm.size');
        width: dt('radiobutton.icon.sm.size');
        height: dt('radiobutton.icon.sm.size');
    }

    .p-radiobutton-lg,
    .p-radiobutton-lg .p-radiobutton-box {
        width: dt('radiobutton.lg.width');
        height: dt('radiobutton.lg.height');
    }

    .p-radiobutton-lg .p-radiobutton-icon {
        font-size: dt('radiobutton.icon.lg.size');
        width: dt('radiobutton.icon.lg.size');
        height: dt('radiobutton.icon.lg.size');
    }
`, pa = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-radiobutton p-component", {
      "p-radiobutton-checked": e.checked,
      "p-disabled": o.disabled,
      "p-invalid": e.$pcRadioButtonGroup ? e.$pcRadioButtonGroup.$invalid : e.$invalid,
      "p-variant-filled": e.$variant === "filled",
      "p-radiobutton-sm p-inputfield-sm": o.size === "small",
      "p-radiobutton-lg p-inputfield-lg": o.size === "large"
    }];
  },
  box: "p-radiobutton-box",
  input: "p-radiobutton-input",
  icon: "p-radiobutton-icon"
}, ba = J.extend({
  name: "radiobutton",
  style: ca,
  classes: pa
}), va = {
  name: "BaseRadioButton",
  extends: hn,
  props: {
    value: null,
    binary: Boolean,
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
  style: ba,
  provide: function() {
    return {
      $pcRadioButton: this,
      $parentInstance: this
    };
  }
};
function xt(t) {
  "@babel/helpers - typeof";
  return xt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, xt(t);
}
function fa(t, n, e) {
  return (n = ha(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function ha(t) {
  var n = ga(t, "string");
  return xt(n) == "symbol" ? n : n + "";
}
function ga(t, n) {
  if (xt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (xt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ht = {
  name: "RadioButton",
  extends: va,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur"],
  inject: {
    $pcRadioButtonGroup: {
      default: void 0
    }
  },
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
        var e = this.binary ? !this.checked : this.value;
        this.$pcRadioButtonGroup ? this.$pcRadioButtonGroup.writeValue(e, n) : this.writeValue(e, n), this.$emit("change", n);
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
    groupName: function() {
      return this.$pcRadioButtonGroup ? this.$pcRadioButtonGroup.groupName : this.$formName;
    },
    checked: function() {
      var n = this.$pcRadioButtonGroup ? this.$pcRadioButtonGroup.d_value : this.d_value;
      return n != null && (this.binary ? !!n : rn(n, this.value));
    },
    dataP: function() {
      return ot(fa({
        invalid: this.$invalid,
        checked: this.checked,
        disabled: this.disabled,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, ma = ["data-p-checked", "data-p-disabled", "data-p"], ya = ["id", "value", "name", "checked", "tabindex", "disabled", "readonly", "aria-labelledby", "aria-label", "aria-invalid"], ka = ["data-p"], $a = ["data-p"];
function wa(t, n, e, o, c, r) {
  return a(), u("div", $({
    class: t.cx("root")
  }, r.getPTOptions("root"), {
    "data-p-checked": r.checked,
    "data-p-disabled": t.disabled,
    "data-p": r.dataP
  }), [l("input", $({
    id: t.inputId,
    type: "radio",
    class: [t.cx("input"), t.inputClass],
    style: t.inputStyle,
    value: t.value,
    name: r.groupName,
    checked: r.checked,
    tabindex: t.tabindex,
    disabled: t.disabled,
    readonly: t.readonly,
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel,
    "aria-invalid": t.invalid || void 0,
    onFocus: n[0] || (n[0] = function() {
      return r.onFocus && r.onFocus.apply(r, arguments);
    }),
    onBlur: n[1] || (n[1] = function() {
      return r.onBlur && r.onBlur.apply(r, arguments);
    }),
    onChange: n[2] || (n[2] = function() {
      return r.onChange && r.onChange.apply(r, arguments);
    })
  }, r.getPTOptions("input")), null, 16, ya), l("div", $({
    class: t.cx("box")
  }, r.getPTOptions("box"), {
    "data-p": r.dataP
  }), [l("div", $({
    class: t.cx("icon")
  }, r.getPTOptions("icon"), {
    "data-p": r.dataP
  }), null, 16, $a)], 16, ka)], 16, ma);
}
Ht.render = wa;
const xa = { class: "kx-wcmount" }, Ca = {
  key: 0,
  class: "kx-wcmount-fail",
  role: "alert"
}, Rt = /* @__PURE__ */ U({
  __name: "WcMount",
  props: {
    tag: {},
    config: {},
    schema: {},
    meta: {},
    provider: {},
    label: {},
    attrs: {}
  },
  emits: ["change", "select", "created", "close", "error"],
  setup(t, { emit: n }) {
    const e = t, o = n, c = A(null), r = A(!1);
    let g = null, C = 0;
    const P = /* @__PURE__ */ new Set();
    function _(f) {
      f.composedPath()[0] === g && (f.stopPropagation(), o("change", f.detail));
    }
    function s(f) {
      return f.composedPath()[0] !== g ? !1 : (f.stopPropagation(), !0);
    }
    function x(f) {
      s(f) && o("select", f.detail);
    }
    function B(f) {
      s(f) && o("created", f.detail);
    }
    function D(f) {
      s(f) && o("close", f.detail);
    }
    function M(f) {
      s(f) && o("error", f.detail);
    }
    function W(f) {
      if (typeof f == "string") return f;
      try {
        return JSON.stringify(f ?? {});
      } catch {
        return null;
      }
    }
    function H() {
      if (!g) return;
      const f = W(e.config);
      if (f !== null && g.setAttribute("config", f), e.schema !== void 0 && e.schema !== null) {
        const z = W(e.schema);
        z !== null && g.setAttribute("schema", z);
      }
      if (e.meta !== void 0 && e.meta !== null) {
        const z = W(e.meta);
        z !== null && g.setAttribute("meta", z);
      }
      e.provider && g.setAttribute("provider", e.provider), e.label && g.setAttribute("label", e.label);
      const R = e.attrs || {};
      for (const z of [...P])
        (!(z in R) || R[z] == null) && (g.removeAttribute(z), P.delete(z));
      for (const [z, F] of Object.entries(R)) {
        if (F == null) continue;
        const dt = typeof F == "object" ? W(F) : String(F);
        dt !== null && (g.setAttribute(z, dt), P.add(z));
      }
    }
    function O(f = g) {
      f && (f.removeEventListener("config-changed", _), f.removeEventListener("change", _), f.removeEventListener("select", x), f.removeEventListener("created", B), f.removeEventListener("close", D), f.removeEventListener("error", M), f === g && (g = null), P.clear());
    }
    async function rt(f) {
      if (!customElements.get(f))
        try {
          await Gn(f, { timeoutMs: 8e3 });
        } catch {
        }
    }
    async function K() {
      const f = ++C, R = c.value, z = e.tag;
      if (r.value = !1, !!R && (O(), R.innerHTML = "", !!z))
        try {
          if (await rt(z), f !== C || c.value !== R || e.tag !== z) return;
          const F = document.createElement(z);
          F.classList.add("kx-wcmount-surface"), g = F, H(), F.addEventListener("config-changed", _), F.addEventListener("change", _), F.addEventListener("select", x), F.addEventListener("created", B), F.addEventListener("close", D), F.addEventListener("error", M), F.style.display = "block", R.appendChild(F), r.value = !customElements.get(z);
        } catch {
          f === C && (r.value = !0);
        }
    }
    async function L() {
      r.value = !1, await sn(), await K();
    }
    return Kn(K), jt(() => e.tag, K), jt(() => [e.config, e.schema, e.meta, e.provider, e.label, e.attrs], H, { deep: !0 }), Un(() => {
      C += 1, O();
    }), (f, R) => (a(), u("div", xa, [
      r.value ? (a(), u("div", Ca, [
        R[0] || (R[0] = l("span", null, "This setup panel couldn’t load.", -1)),
        l("button", {
          type: "button",
          onClick: L
        }, "Try again")
      ])) : (a(), u("div", {
        key: 1,
        ref_key: "host",
        ref: c
      }, null, 512))
    ]));
  }
});
function pt(t, n) {
  const e = t?.response?.data ?? t?.data;
  return typeof e?.error == "string" && e.error ? e.error : typeof e?.message == "string" && e.message ? e.message : t instanceof Error ? t.message : n;
}
function Sa() {
  const t = A([]), n = A([]), e = A(!0), o = A(!1), c = A("");
  let r = 0;
  async function g() {
    const s = ++r;
    e.value = !0, c.value = "";
    try {
      const [x, B] = await Promise.all([
        at.get("/api/v1/security/scopes?view=permissions&include_unavailable=true"),
        at.get("/api/v1/security/policies?assignable=true")
      ]);
      if (s !== r) return;
      t.value = x.data?.scopes ?? [], n.value = B.data?.policies ?? [];
    } catch (x) {
      s === r && (c.value = pt(x, "failed to load security"));
    } finally {
      s === r && (e.value = !1);
    }
  }
  async function C(s) {
    const B = (await at.get(`/api/v1/security/scopes?id=${encodeURIComponent(s)}`)).data?.scopes?.[0];
    if (!B) throw new Error("Role no longer available");
    return B;
  }
  async function P(s) {
    o.value = !0, c.value = "";
    try {
      return await at.post("/api/v1/security/scopes", s), await g(), !0;
    } catch (x) {
      return c.value = pt(x, "failed to save scope"), !1;
    } finally {
      o.value = !1;
    }
  }
  async function _(s) {
    o.value = !0, c.value = "";
    try {
      return await at.delete(`/api/v1/security/scopes?slug=${encodeURIComponent(s)}`), await g(), !0;
    } catch (x) {
      return c.value = pt(x, "failed to delete scope"), !1;
    } finally {
      o.value = !1;
    }
  }
  return { scopes: t, assignablePolicies: n, loading: e, saving: o, error: c, load: g, loadComposition: C, saveScope: P, deleteScope: _ };
}
function Ba() {
  const t = A([]), n = A(!1), e = A(!1), o = A(""), c = A(""), r = A(null);
  let g = 0;
  async function C() {
    const s = ++g;
    n.value = !0, o.value = "";
    try {
      const { data: x } = await at.get("/api/v1/security/delegations");
      if (x?.success !== !0 || !Array.isArray(x.delegations))
        throw new Error(x?.error || "Delegation inventory is unconfirmed");
      s === g && (t.value = x.delegations);
    } catch (x) {
      s === g && (o.value = pt(x, "Could not load run-as permissions"));
    } finally {
      s === g && (n.value = !1);
    }
  }
  async function P() {
    if (!r.value || e.value) return;
    const s = r.value;
    e.value = !0, o.value = "", c.value = "";
    try {
      const { data: x } = s.method === "save" ? await at.post("/api/v1/security/delegations", s.request) : await at.delete("/api/v1/security/delegations", { data: s.request });
      if (x?.success !== !0) throw new Error(x?.error || "Run-as request is unconfirmed");
      r.value = null, c.value = s.method === "save" ? "Run-as permission saved" : "Run-as permission revoked", await C();
    } catch (x) {
      o.value = pt(x, "Could not confirm run-as request");
      const B = x?.response?.status;
      B && B >= 400 && B < 500 && (r.value = null);
    } finally {
      e.value = !1;
    }
  }
  async function _(s, x) {
    r.value || e.value || (r.value = { method: s, request: {
      ...x,
      principal: { ...x.principal },
      ...x.groups ? { groups: [...x.groups].sort() } : {}
    } }, await P());
  }
  return { delegations: t, loading: n, saving: e, error: o, confirmation: c, pending: r, load: C, mutate: _, submit: P };
}
const Ta = {
  class: "ks-runas kx-system-pane",
  "aria-label": "Run-as permissions"
}, Ia = { class: "kx-system-tools" }, Pa = { class: "ks-runas-head kx-system-toolbar" }, Aa = { class: "ks-runas-count" }, za = { class: "ks-runas-acts" }, _a = { class: "kx-system-body ks-runas-body" }, La = {
  key: 0,
  role: "alert"
}, Na = { class: "ks-runas-form-head" }, Fa = ["disabled", "inert"], Va = { class: "ks-runas-steps" }, Oa = {
  key: 0,
  class: "ks-runas-chips",
  "aria-label": "Selected groups"
}, Ra = { class: "ks-runas-component-options" }, Ea = ["for"], ja = ["for"], Da = { class: "ks-runas-form-foot" }, Ka = {
  key: 3,
  class: "ks-runas-pending"
}, Ua = {
  key: 6,
  class: "ks-runas-list"
}, Ma = { class: "ks-runas-grant-body" }, Wa = { class: "ks-runas-grant-line" }, Ha = {
  key: 0,
  class: "ks-runas-who"
}, Ga = { class: "ks-runas-verb" }, qa = { class: "ks-runas-who" }, Za = { class: "ks-runas-grant-meta" }, Ja = { key: 0 }, Qa = { key: 1 }, Ya = { key: 2 }, Xa = /* @__PURE__ */ U({
  __name: "Delegations",
  props: {
    scopes: {}
  },
  setup(t, { expose: n }) {
    const e = t, o = Ba(), { delegations: c, loading: r, saving: g, error: C, confirmation: P, pending: _ } = o, s = A(!1), x = A(!1), B = A(""), D = A(""), M = A(!0), W = Mn(), H = A([]), O = N(() => g.value || !!_.value), rt = N(() => !!B.value && H.value.length > 0 && (M.value || !!D.value)), K = N(() => {
      const T = {};
      for (const v of e.scopes) T[v.id] = v.label || "Group unavailable";
      return T;
    }), L = A({});
    jt(c, async (T) => {
      const v = [...new Set(T.map((h) => h.principal.id))].filter((h) => !L.value[h]);
      if (v.length)
        try {
          const { data: h } = await at.post("/api/v1/principals/resolve", { refs: v.map((Z) => ({ type: "user", id: Z })) }), q = { ...L.value };
          for (const Z of Array.isArray(h?.principals) ? h.principals : [])
            Z && typeof Z.id == "string" && typeof Z.label == "string" && (q[Z.id] = Z.label);
          L.value = q;
        } catch (h) {
          C.value = h && typeof h == "object" && "message" in h ? String(h.message) : "Could not resolve account names";
        }
    });
    const f = N(() => c.value.filter((T) => T.active)), R = N(() => c.value.filter((T) => !T.active)), z = N(() => x.value ? [...f.value, ...R.value] : f.value);
    function F(T, v) {
      if (!T || typeof T != "object") return;
      const h = T;
      O.value || h.type !== v || typeof h.id != "string" || (v === "user" ? B.value = h.id : h.id && !H.value.some((q) => q.id === h.id) && H.value.push({ id: h.id, label: typeof h.label == "string" ? h.label : h.id }));
    }
    function dt(T) {
      const v = T && typeof T == "object" ? T.thread_id : void 0;
      !O.value && typeof v == "string" && (D.value = v);
    }
    function it(T) {
      C.value = T && typeof T == "object" && "message" in T ? String(T.message) : "Could not load the picker";
    }
    function ut() {
      B.value = "", D.value = "", M.value = !0, H.value = [], s.value = !0;
    }
    async function St() {
      rt.value && (await o.mutate("save", {
        principal: { kind: "user", id: B.value },
        root: M.value ? "*" : D.value,
        groups: H.value.map((T) => T.id)
      }), !C.value && !_.value && (s.value = !1));
    }
    async function Bt(T) {
      await dn.confirm({
        header: "Revoke run-as permission?",
        message: `Members of ${T.groups.map((h) => K.value[h] || "Group unavailable").join(", ")} can no longer choose ${L.value[T.principal.id] || "Account unavailable"} in the Run as setting.`,
        icon: "tabler:user-off",
        acceptLabel: "Revoke",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await o.mutate("revoke", { principal: T.principal, root: T.root });
    }
    return n({ load: o.load }), (T, v) => (a(), u("section", Ta, [
      l("div", Ia, [
        l("header", Pa, [
          l("span", Aa, w(f.value.length) + " active " + w(f.value.length === 1 ? "permission" : "permissions"), 1),
          l("div", za, [
            y(i(At), {
              icon: "tabler:refresh",
              label: "Refresh",
              disabled: i(r) || O.value,
              spin: i(r),
              onClick: i(o).load
            }, null, 8, ["disabled", "spin", "onClick"]),
            s.value ? m("", !0) : (a(), k(i(X), {
              key: 0,
              variant: "primary",
              icon: "tabler:plus",
              disabled: O.value,
              onClick: ut
            }, {
              default: S(() => [...v[9] || (v[9] = [
                I("New permission", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]))
          ])
        ]),
        v[10] || (v[10] = l("p", { class: "ks-runas-lede" }, [
          I(" Agents, automations and workflows run with the access of the account set in their "),
          l("b", null, "Run as"),
          I(" setting. A permission lets members of a group choose a specific account there, typically a bot account, so the component works with that account's access instead of their own. ")
        ], -1))
      ]),
      l("div", _a, [
        i(C) ? (a(), u("div", La, [
          y(i(Lt), {
            severity: "danger",
            onDismiss: v[0] || (v[0] = (h) => C.value = "")
          }, {
            default: S(() => [
              I(w(i(C)), 1)
            ]),
            _: 1
          })
        ])) : m("", !0),
        i(P) ? (a(), k(i(Lt), {
          key: 1,
          "data-test": "delegation-confirmation",
          severity: "success",
          onDismiss: v[1] || (v[1] = (h) => P.value = "")
        }, {
          default: S(() => [
            I(w(i(P)), 1)
          ]),
          _: 1
        })) : m("", !0),
        s.value ? (a(), u("form", {
          key: 2,
          class: "ks-runas-form",
          onSubmit: gt(St, ["prevent"])
        }, [
          l("div", Na, [
            v[11] || (v[11] = l("span", null, "New run-as permission", -1)),
            y(i(At), {
              icon: "tabler:x",
              label: "Cancel",
              disabled: O.value,
              onClick: v[2] || (v[2] = (h) => s.value = !1)
            }, null, 8, ["disabled"])
          ]),
          l("fieldset", {
            disabled: O.value,
            inert: O.value
          }, [
            l("ol", Va, [
              l("li", null, [
                y(i(zt), {
                  label: "Account to run as",
                  help: "The account whose access the component uses. Its group memberships decide what the component can do."
                }, {
                  default: S(() => [
                    y(Rt, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "user", placeholder: "Choose an account…" },
                      config: { principal_id: B.value },
                      onChange: v[3] || (v[3] = (h) => F(h, "user")),
                      onError: it
                    }, null, 8, ["config"])
                  ]),
                  _: 1
                })
              ]),
              l("li", null, [
                y(i(zt), {
                  label: "Who may choose it",
                  help: "Members of these groups see this account in the Run as setting. Nobody's group membership changes."
                }, {
                  default: S(() => [
                    y(Rt, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "group", placeholder: "Add a group…" },
                      config: {},
                      onChange: v[4] || (v[4] = (h) => F(h, "group")),
                      onError: it
                    })
                  ]),
                  _: 1
                }),
                H.value.length ? (a(), u("div", Oa, [
                  (a(!0), u(Q, null, Y(H.value, (h) => (a(), k(i(xn), {
                    key: h.id,
                    label: h.label,
                    removable: !O.value,
                    pt: { removeIcon: { "aria-label": `Remove group ${h.label}` } },
                    onRemove: (q) => H.value = H.value.filter((Z) => Z.id !== h.id)
                  }, null, 8, ["label", "removable", "pt", "onRemove"]))), 128))
                ])) : m("", !0)
              ]),
              l("li", null, [
                l("fieldset", null, [
                  v[14] || (v[14] = l("legend", { class: "km-field-label" }, "On which components", -1)),
                  l("div", Ra, [
                    l("label", {
                      class: "ks-runas-component-option",
                      for: `${i(W)}-any`
                    }, [
                      y(i(Ht), {
                        modelValue: M.value,
                        "onUpdate:modelValue": v[5] || (v[5] = (h) => M.value = h),
                        "input-id": `${i(W)}-any`,
                        name: i(W),
                        value: !0,
                        disabled: O.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[12] || (v[12] = I(" Any component ", -1))
                    ], 8, Ea),
                    l("label", {
                      class: "ks-runas-component-option",
                      for: `${i(W)}-one`
                    }, [
                      y(i(Ht), {
                        modelValue: M.value,
                        "onUpdate:modelValue": v[6] || (v[6] = (h) => M.value = h),
                        "input-id": `${i(W)}-one`,
                        name: i(W),
                        value: !1,
                        disabled: O.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[13] || (v[13] = I(" One component ", -1))
                    ], 8, ja)
                  ]),
                  v[15] || (v[15] = l("small", { class: "km-field-help" }, "The person choosing the account must also be able to manage the component.", -1))
                ]),
                M.value ? m("", !0) : (a(), k(Rt, {
                  key: 0,
                  class: "ks-runas-component",
                  tag: "wc-component-picker",
                  attrs: { source: "/api/v1/security/delegations/roots", title: "Component", placeholder: "Choose a component you manage…" },
                  config: D.value ? { thread_id: D.value } : {},
                  onChange: dt,
                  onError: it
                }, null, 8, ["config"]))
              ])
            ])
          ], 8, Fa),
          l("div", Da, [
            y(i(X), {
              variant: "ghost",
              small: "",
              disabled: O.value,
              onClick: v[7] || (v[7] = (h) => s.value = !1)
            }, {
              default: S(() => [...v[16] || (v[16] = [
                I("Cancel", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            y(i(X), {
              variant: "primary",
              small: "",
              icon: "tabler:device-floppy",
              disabled: !rt.value || O.value,
              loading: i(g),
              onClick: St
            }, {
              default: S(() => [...v[17] || (v[17] = [
                I("Save permission", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)) : m("", !0),
        i(_) && !i(g) ? (a(), u("div", Ka, [
          v[19] || (v[19] = l("span", null, "We could not confirm whether the permission changed. Select Retry to check before making another change.", -1)),
          y(i(X), {
            small: "",
            onClick: i(o).submit
          }, {
            default: S(() => [...v[18] || (v[18] = [
              I("Retry", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ])) : m("", !0),
        R.value.length ? (a(), k(i(X), {
          key: 4,
          class: "ks-runas-history",
          variant: "ghost",
          small: "",
          "aria-expanded": x.value,
          onClick: v[8] || (v[8] = (h) => x.value = !x.value)
        }, {
          default: S(() => [
            I(w(x.value ? "Hide revoked permissions" : "Show revoked permissions"), 1)
          ]),
          _: 1
        }, 8, ["aria-expanded"])) : m("", !0),
        i(r) && !i(c).length ? (a(), k(i(Mt), {
          key: 5,
          label: "Loading run-as permissions…"
        })) : z.value.length ? (a(), u("div", Ua, [
          (a(!0), u(Q, null, Y(z.value, (h) => (a(), u("article", {
            key: h.policy_id,
            class: tt(["kx-card ks-runas-grant", { revoked: !h.active }])
          }, [
            y(i(E), {
              class: "ks-runas-grant-icon",
              icon: "tabler:user-shield",
              "aria-hidden": "true"
            }),
            l("div", Ma, [
              l("div", Wa, [
                h.active ? (a(), u("span", Ha, w(h.groups.map((q) => K.value[q] || "Group unavailable").join(", ")), 1)) : m("", !0),
                l("span", Ga, w(h.active ? "can run as" : "Permission to run as"), 1),
                l("span", qa, w(L.value[h.principal.id] || "Account unavailable"), 1)
              ]),
              l("div", Za, [
                h.root === "*" ? (a(), u("span", Ja, "on any component they manage")) : h.root_label ? (a(), u("span", Qa, [
                  v[20] || (v[20] = I("on ", -1)),
                  l("b", null, w(h.root_label), 1)
                ])) : (a(), u("span", Ya, "on an unavailable component"))
              ])
            ]),
            h.active ? (a(), k(i(X), {
              key: 1,
              variant: "ghost",
              small: "",
              icon: "tabler:user-off",
              disabled: O.value,
              "aria-label": `Revoke run-as permission for ${L.value[h.principal.id] || "Account unavailable"}`,
              onClick: (q) => Bt(h)
            }, {
              default: S(() => [...v[22] || (v[22] = [
                I("Revoke", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])) : (a(), k(i(_t), {
              key: 0,
              severity: "secondary"
            }, {
              default: S(() => [...v[21] || (v[21] = [
                I("revoked", -1)
              ])]),
              _: 1
            }))
          ], 2))), 128))
        ])) : !i(C) && !s.value ? (a(), k(i($n), {
          key: 7,
          icon: "tabler:user-shield",
          title: "No active run-as permissions"
        }, {
          hint: S(() => [...v[23] || (v[23] = [
            I("Without an active permission, the Run as setting offers only ", -1),
            l("b", null, "Me", -1),
            I(".", -1)
          ])]),
          _: 1
        })) : m("", !0)
      ])
    ]));
  }
}), tr = ["draggable"], nr = { class: "ks-pcard-row" }, er = { class: "ks-pcard-body" }, or = { class: "ks-pcard-head" }, ar = ["title"], rr = {
  key: 0,
  class: "ks-pcard-comment"
}, ir = {
  key: 1,
  class: "ks-pcard-comment"
}, lr = ["aria-label"], sr = ["aria-label"], ht = /* @__PURE__ */ U({
  __name: "PolicyCard",
  props: {
    policy: {},
    mode: {}
  },
  emits: ["add", "remove"],
  setup(t, { emit: n }) {
    const e = t, o = n, c = N(() => e.policy.title || e.policy.id);
    function r(g) {
      e.mode === "locked" || !g.dataTransfer || (g.dataTransfer.setData("text/plain", e.policy.id), g.dataTransfer.effectAllowed = e.mode === "palette" ? "copy" : "move");
    }
    return (g, C) => (a(), u("div", {
      class: tt(["kx-card ks-pcard", t.mode]),
      draggable: t.mode !== "locked",
      onDragstart: r,
      onDblclick: C[2] || (C[2] = (P) => t.mode === "palette" && o("add"))
    }, [
      l("div", nr, [
        t.mode === "locked" ? (a(), k(i(E), {
          key: 0,
          icon: "tabler:lock",
          class: "ks-pcard-grip locked",
          "aria-hidden": "true"
        })) : (a(), k(i(E), {
          key: 1,
          icon: "tabler:grip-vertical",
          class: "ks-pcard-grip",
          "aria-hidden": "true"
        })),
        l("div", er, [
          l("div", or, [
            t.policy.effect === "allow" || t.policy.effect === "deny" ? (a(), k(_t, {
              key: 0,
              severity: t.policy.effect === "allow" ? "success" : "danger"
            }, {
              default: S(() => [
                I(w(t.policy.effect === "deny" ? "Blocks" : "Allows"), 1)
              ]),
              _: 1
            }, 8, ["severity"])) : m("", !0),
            l("span", {
              class: "ks-pcard-title",
              title: c.value
            }, w(c.value), 9, ar)
          ]),
          t.policy.available === !1 ? (a(), u("div", rr, "No longer available")) : t.policy.comment ? (a(), u("div", ir, w(t.policy.comment), 1)) : m("", !0)
        ]),
        t.mode === "palette" ? (a(), u("button", {
          key: 2,
          class: "ks-pcard-act add",
          "aria-label": `Add permission ${c.value}`,
          onClick: C[0] || (C[0] = gt((P) => o("add"), ["stop"]))
        }, [
          y(i(E), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ], 8, lr)) : t.mode === "selected" ? (a(), u("button", {
          key: 3,
          class: "ks-pcard-act remove",
          "aria-label": `Remove permission ${c.value}`,
          onClick: C[1] || (C[1] = gt((P) => o("remove"), ["stop"]))
        }, [
          y(i(E), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ], 8, sr)) : m("", !0)
      ])
    ], 42, tr));
  }
}), dr = { class: "ks" }, ur = { class: "ks-rail-search" }, cr = { class: "ks-rail-list" }, pr = {
  key: 0,
  class: "ks-rail-group"
}, br = ["onClick"], vr = { class: "ks-scope-name" }, fr = ["onClick"], hr = { class: "ks-scope-name" }, gr = {
  key: 0,
  class: "ks-builder"
}, mr = { class: "ks-builder-head" }, yr = { class: "ks-builder-title" }, kr = { class: "ks-builder-acts" }, $r = {
  key: 0,
  class: "ks-overlay-warn"
}, wr = {
  key: 1,
  class: "ks-view-note"
}, xr = { class: "ks-fields" }, Cr = {
  key: 0,
  class: "ks-pane locked-pane"
}, Sr = { class: "ks-pane-head" }, Br = { class: "ks-pane-sub" }, Tr = { class: "ks-pane-body" }, Ir = {
  key: 0,
  class: "ks-pane-empty"
}, Pr = { class: "ks-pane" }, Ar = { class: "ks-pane-search" }, zr = { class: "ks-pane-body" }, _r = {
  key: 0,
  class: "ks-pane-empty"
}, Lr = { class: "ks-pane-head" }, Nr = { class: "ks-pane-sub" }, Fr = { class: "ks-pane-body" }, Vr = ["onDrop"], Or = {
  key: 0,
  class: "ks-drop-hint"
}, Rr = {
  key: 1,
  class: "ks-view"
}, Er = { class: "ks-builder-head" }, jr = { class: "ks-builder-title" }, Dr = { class: "ks-builder-acts" }, Kr = {
  key: 0,
  class: "ks-view-note"
}, Ur = { class: "ks-view-list" }, Mr = { class: "ks-pane-body" }, Wr = {
  key: 0,
  class: "ks-pane-empty"
}, Hr = {
  key: 1,
  class: "ks-view-note",
  role: "alert"
}, Gr = {
  key: 2,
  class: "ks-technical-list"
}, qr = {
  key: 3,
  class: "ks-view-note"
}, Zr = {
  key: 1,
  class: "ks-ext-block"
}, Jr = { class: "ks-ext-head" }, Qr = { class: "ks-pane-body ks-view-list" }, Yr = {
  key: 2,
  class: "kx-system-body"
}, Xr = /* @__PURE__ */ U({
  __name: "Security",
  setup(t) {
    const n = Sa(), { scopes: e, assignablePolicies: o, loading: c, saving: r, error: g } = n, C = A(""), P = A(""), _ = A(null), s = A(null), x = A(null), B = Wn(null), D = A("scopes"), M = A(null), W = A(!1);
    async function H(p) {
      D.value = String(p), p === "delegations" && (W.value = !0, await sn(), await M.value?.load());
    }
    async function O() {
      ut(), await n.load();
    }
    Rn(async () => {
      await O(), D.value === "delegations" && await M.value?.load();
    });
    const rt = N(() => {
      const p = C.value.trim().toLowerCase(), d = (b) => !p || b.label.toLowerCase().includes(p) || b.id.toLowerCase().includes(p);
      return {
        custom: e.value.filter((b) => b.source === "custom" && d(b)),
        builtin: e.value.filter((b) => b.source !== "custom" && d(b))
      };
    }), K = N(() => e.value.find((p) => p.id === _.value) || null), L = N(() => K.value && K.value.source !== "custom" ? K.value : null), f = N(() => !!s.value?.target), R = N(() => L.value?.policies ?? []), z = N(() => f.value ? R.value : []), F = N(() => new Map(o.value.map((p) => [p.id, p]))), dt = N(() => {
      const p = K.value, d = f.value ? p?.overlay_policies : p?.policies;
      return new Map((d ?? []).map((b) => [b.id, b]));
    }), it = N(() => (s.value?.policyIds ?? []).map((p) => dt.value.get(p) ?? F.value.get(p) ?? { id: p, available: !1 }));
    function ut() {
      B.value = null, x.value && (x.value.open = !1);
    }
    async function St(p) {
      const d = p.currentTarget, b = L.value;
      if (!d.open || !b || B.value && !B.value.error) return;
      const j = { policies: [], loading: !0, error: "" };
      B.value = j;
      try {
        const lt = await n.loadComposition(b.id);
        if (B.value !== j) return;
        const _n = new Set(R.value.map((Vt) => Vt.id)), Ln = (lt.base_policies ?? lt.policies).filter((Vt) => !_n.has(Vt.id));
        B.value = { policies: Ln, loading: !1, error: "" };
      } catch (lt) {
        if (B.value !== j) return;
        B.value = { policies: [], loading: !1, error: pt(lt, "Failed to load technical policies") };
      }
    }
    function Bt(p) {
      return [...new Set([...p.policies, ...p.overlay_policies ?? []].filter((d) => d.available !== !1 && F.value.has(d.id)).map((d) => d.id))];
    }
    const T = N(() => K.value && Bt(K.value).length > 0), v = N(() => {
      if (!s.value) return [];
      const p = /* @__PURE__ */ new Set([...s.value.policyIds, ...z.value.map((b) => b.id)]), d = P.value.trim().toLowerCase();
      return o.value.filter((b) => !p.has(b.id) && (!d || (b.title || "").toLowerCase().includes(d) || b.id.toLowerCase().includes(d) || (b.comment || "").toLowerCase().includes(d)));
    });
    function h(p) {
      ut(), P.value = "", _.value = p.id, s.value = p.source === "custom" ? { slug: p.slug || "", label: p.label, description: p.description, policyIds: p.policies.map((d) => d.id), enabled: p.enabled, isNew: !1, target: "" } : null;
    }
    function q() {
      ut(), P.value = "", _.value = null, s.value = { slug: Array.from(crypto.getRandomValues(new Uint8Array(16)), (p) => p.toString(16).padStart(2, "0")).join(""), label: "", description: "", policyIds: [], enabled: !0, isNew: !0, target: "" };
    }
    function Z(p) {
      const d = Bt(p);
      d.length && (q(), Object.assign(s.value, {
        label: p.label ? `Copy of ${p.label}` : "",
        description: p.description,
        policyIds: d
      }));
    }
    function Qt(p) {
      return p.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
    }
    function Cn(p) {
      ut(), P.value = "", _.value = p.id, s.value = {
        slug: p.overlay_slug || Qt(p.id),
        label: p.label || ct(p.id),
        description: p.description,
        policyIds: (p.overlay_policies ?? []).map((d) => d.id),
        enabled: !0,
        isNew: !p.overlay_slug,
        target: p.id
      };
    }
    function Ft(p, d) {
      !s.value || s.value.policyIds.includes(p) || z.value.some((b) => b.id === p) || F.value.has(p) && s.value.policyIds.splice(d ?? s.value.policyIds.length, 0, p);
    }
    function Sn(p) {
      s.value && (s.value.policyIds = s.value.policyIds.filter((d) => d !== p));
    }
    function Bn(p) {
      const d = p.dataTransfer?.getData("text/plain");
      d && Ft(d);
    }
    function Tn(p, d) {
      p.stopPropagation();
      const b = p.dataTransfer?.getData("text/plain");
      if (!b || !s.value || b === d) return;
      const j = s.value.policyIds, lt = j.indexOf(b);
      if (lt === -1) {
        Ft(b, j.indexOf(d));
        return;
      }
      j.splice(lt, 1), j.splice(j.indexOf(d), 0, b);
    }
    const In = N(() => s.value ? !s.value.isNew || s.value.target ? s.value.slug : `${Qt(s.value.label.normalize("NFKD").replace(/\p{M}/gu, "")).toLowerCase() || "role"}_${s.value.slug}` : ""), Yt = N(() => !!s.value && s.value.label.trim() !== "" && (!s.value.isNew || s.value.policyIds.length > 0)), vt = A("");
    let ft = null;
    Hn(() => {
      ft && clearTimeout(ft);
    });
    function Pn(p) {
      vt.value = p, ft && clearTimeout(ft), ft = setTimeout(() => {
        vt.value = "";
      }, 3e3);
    }
    async function An() {
      if (!s.value || !Yt.value) return;
      const p = s.value, d = In.value, b = s.value.target, j = s.value.label.trim() || d;
      await n.saveScope({
        slug: d,
        target: b,
        label: s.value.label.trim(),
        description: s.value.description.trim(),
        policies: [...s.value.policyIds],
        enabled: s.value.enabled
      }) && (p.slug = d, p.isNew = !1, s.value === p && (_.value = b || `kickside.security.scopes:${d}`), Pn(`Saved “${j}”. The role will be available when assigning users.`));
    }
    async function zn() {
      if (!s.value || s.value.isNew) return;
      const p = f.value;
      if (!await dn.confirm({
        header: p ? "Remove extension?" : "Delete role?",
        message: p ? "This removes the added permissions. Users keep the role’s original permissions." : "This removes the custom role and its permissions.",
        icon: "tabler:trash",
        acceptLabel: p ? "Remove extension" : "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      await n.deleteScope(s.value.slug) && (s.value = null, _.value = null);
    }
    function ct(p) {
      return p.includes(":") ? p.split(":").slice(-1)[0] : p;
    }
    return (p, d) => (a(), u("div", dr, [
      y(Se, {
        value: D.value,
        label: "Security administration",
        items: [
          { value: "scopes", label: "Roles" },
          { value: "delegations", label: "Run as" }
        ],
        "onUpdate:value": H
      }, null, 8, ["value"]),
      W.value ? bt((a(), k(Xa, {
        key: 0,
        ref_key: "delegationPanel",
        ref: M,
        scopes: i(e)
      }, null, 8, ["scopes"])), [
        [nn, D.value === "delegations"]
      ]) : m("", !0),
      i(g) ? (a(), k(i(Lt), {
        key: 1,
        severity: "danger",
        class: "ks-top-notice",
        onDismiss: d[0] || (d[0] = (b) => g.value = "")
      }, {
        default: S(() => [
          I(w(i(g)), 1)
        ]),
        _: 1
      })) : vt.value ? (a(), k(i(Lt), {
        key: 2,
        severity: "success",
        class: "ks-top-notice",
        onDismiss: d[1] || (d[1] = (b) => vt.value = "")
      }, {
        default: S(() => [
          I(w(vt.value), 1)
        ]),
        _: 1
      })) : m("", !0),
      D.value === "scopes" && i(c) && !i(e).length ? (a(), k(i(Mt), {
        key: 3,
        label: "Loading security…"
      })) : bt((a(), k(i(Pe), { key: 4 }, {
        rail: S(() => [
          y(i(Ne), {
            title: "Roles",
            count: i(e).length
          }, {
            actions: S(() => [
              y(i(At), {
                icon: "tabler:plus",
                label: "New role",
                disabled: i(r),
                onClick: q
              }, null, 8, ["disabled"]),
              y(i(At), {
                icon: "tabler:refresh",
                label: "Refresh",
                disabled: i(c),
                spin: i(c),
                onClick: O
              }, null, 8, ["disabled", "spin"])
            ]),
            _: 1
          }, 8, ["count"]),
          l("div", ur, [
            y(i(on), {
              modelValue: C.value,
              "onUpdate:modelValue": d[2] || (d[2] = (b) => C.value = b),
              placeholder: "Find a role…"
            }, null, 8, ["modelValue"])
          ]),
          l("div", cr, [
            rt.value.custom.length ? (a(), u("div", pr, "Custom")) : m("", !0),
            (a(!0), u(Q, null, Y(rt.value.custom, (b) => (a(), u("button", {
              key: b.id,
              class: tt(["ks-scope-row", { active: b.id === _.value }]),
              onClick: (j) => h(b)
            }, [
              l("span", vr, w(b.label || ct(b.id)), 1)
            ], 10, br))), 128)),
            d[11] || (d[11] = l("div", { class: "ks-rail-group" }, "Default", -1)),
            (a(!0), u(Q, null, Y(rt.value.builtin, (b) => (a(), u("button", {
              key: b.id,
              class: tt(["ks-scope-row", { active: b.id === _.value }]),
              onClick: (j) => h(b)
            }, [
              l("span", hr, w(b.label || ct(b.id)), 1)
            ], 10, fr))), 128))
          ])
        ]),
        default: S(() => [
          s.value ? (a(), u("div", gr, [
            l("div", mr, [
              l("div", yr, [
                y(i(E), {
                  icon: f.value ? "tabler:stack-2" : "tabler:shield-lock",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                l("span", null, w(f.value ? `Extend ${s.value.label || ct(s.value.target)}` : s.value.isNew ? "New role" : s.value.label || s.value.slug), 1),
                f.value ? (a(), k(i(_t), {
                  key: 0,
                  severity: "warn"
                }, {
                  default: S(() => [...d[12] || (d[12] = [
                    I("Additional permissions", -1)
                  ])]),
                  _: 1
                })) : m("", !0)
              ]),
              l("div", kr, [
                !s.value.isNew && !f.value && K.value ? (a(), k(i(X), {
                  key: 0,
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  disabled: i(r) || !T.value,
                  onClick: d[3] || (d[3] = (b) => Z(K.value))
                }, {
                  default: S(() => [...d[13] || (d[13] = [
                    I("Copy permissions", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : m("", !0),
                s.value.isNew ? m("", !0) : (a(), k(i(X), {
                  key: 1,
                  variant: "danger",
                  small: "",
                  icon: "tabler:trash",
                  disabled: i(r),
                  onClick: zn
                }, {
                  default: S(() => [
                    I(w(f.value ? "Remove extension" : "Delete"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])),
                y(i(X), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:device-floppy",
                  loading: i(r),
                  disabled: !Yt.value,
                  onClick: An
                }, {
                  default: S(() => [
                    I(w(f.value ? "Save extension" : "Save role"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            f.value ? (a(), u("div", $r, [
              y(i(E), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              l("span", null, [
                d[14] || (d[14] = I("Adding permissions grants them to ", -1)),
                l("b", null, "everyone assigned " + w(K.value?.label || ct(s.value.target)), 1),
                d[15] || (d[15] = I(". You can remove permissions added by this extension. To restrict access, create a new role with only the permissions needed.", -1))
              ])
            ])) : (a(), u("p", wr, "Choose the permissions this role grants, then assign it in System → Users. To restrict a Member, assign this role instead of Member; other assigned roles may still grant access.")),
            l("div", xr, [
              y(i(zt), { label: "Name" }, {
                default: S(() => [
                  y(i(an), {
                    modelValue: s.value.label,
                    "onUpdate:modelValue": d[4] || (d[4] = (b) => s.value.label = b),
                    placeholder: "Reviewer"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              y(i(zt), { label: "Description" }, {
                default: S(() => [
                  y(i(an), {
                    modelValue: s.value.description,
                    "onUpdate:modelValue": d[5] || (d[5] = (b) => s.value.description = b),
                    placeholder: "Read-only reviewer role"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            l("div", {
              class: tt(["ks-panes", { three: f.value }])
            }, [
              f.value ? (a(), u("section", Cr, [
                l("header", Sr, [
                  d[16] || (d[16] = l("span", null, "Original assignable permissions", -1)),
                  l("span", Br, w(z.value.length) + " · locked", 1)
                ]),
                l("div", Tr, [
                  (a(!0), u(Q, null, Y(z.value, (b) => (a(), k(ht, {
                    key: b.id,
                    policy: b,
                    mode: "locked"
                  }, null, 8, ["policy"]))), 128)),
                  z.value.length ? m("", !0) : (a(), u("div", Ir, "No original permissions available to assign."))
                ])
              ])) : m("", !0),
              l("section", Pr, [
                d[17] || (d[17] = l("header", { class: "ks-pane-head" }, [
                  l("span", null, "Available permissions"),
                  l("span", { class: "ks-pane-sub" }, "Click + to add")
                ], -1)),
                l("div", Ar, [
                  y(i(on), {
                    modelValue: P.value,
                    "onUpdate:modelValue": d[6] || (d[6] = (b) => P.value = b),
                    placeholder: "Search permissions…"
                  }, null, 8, ["modelValue"])
                ]),
                l("div", zr, [
                  (a(!0), u(Q, null, Y(v.value, (b) => (a(), k(ht, {
                    key: b.id,
                    policy: b,
                    mode: "palette",
                    onAdd: (j) => Ft(b.id)
                  }, null, 8, ["policy", "onAdd"]))), 128)),
                  v.value.length ? m("", !0) : (a(), u("div", _r, "No matching permissions."))
                ])
              ]),
              l("section", {
                class: "ks-pane drop",
                onDragover: d[8] || (d[8] = gt(() => {
                }, ["prevent"])),
                onDrop: Bn
              }, [
                l("header", Lr, [
                  l("span", null, w(f.value ? "Added by you" : "In this role"), 1),
                  l("span", Nr, w(it.value.length) + " " + w(it.value.length === 1 ? "permission" : "permissions"), 1)
                ]),
                l("div", Fr, [
                  (a(!0), u(Q, null, Y(it.value, (b) => (a(), u("div", {
                    key: b.id,
                    onDragover: d[7] || (d[7] = gt(() => {
                    }, ["prevent"])),
                    onDrop: (j) => Tn(j, b.id)
                  }, [
                    y(ht, {
                      policy: b,
                      mode: "selected",
                      onRemove: (j) => Sn(b.id)
                    }, null, 8, ["policy", "onRemove"])
                  ], 40, Vr))), 128)),
                  it.value.length ? m("", !0) : (a(), u("div", Or, [
                    y(i(E), {
                      icon: "tabler:drag-drop",
                      "aria-hidden": "true"
                    }),
                    d[18] || (d[18] = l("span", null, "Use + on an available permission, or drag it here.", -1))
                  ]))
                ])
              ], 32)
            ], 2)
          ])) : L.value ? (a(), u("div", Rr, [
            l("div", Er, [
              l("div", jr, [
                y(i(E), {
                  icon: "tabler:shield",
                  "aria-hidden": "true"
                }),
                l("span", null, w(L.value.label || ct(L.value.id)), 1)
              ]),
              l("div", Dr, [
                y(i(X), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:stack-2",
                  onClick: d[9] || (d[9] = (b) => Cn(L.value))
                }, {
                  default: S(() => [
                    I(w(L.value.overlay_slug ? "Edit extension" : "Add permissions"), 1)
                  ]),
                  _: 1
                }),
                y(i(X), {
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  disabled: !T.value,
                  onClick: d[10] || (d[10] = (b) => Z(L.value))
                }, {
                  default: S(() => [...d[19] || (d[19] = [
                    I("Copy permissions", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ]),
            L.value.description ? (a(), u("p", Kr, w(L.value.description), 1)) : m("", !0),
            d[23] || (d[23] = l("p", { class: "ks-view-note" }, " Adding permissions affects everyone with this role. Copy permissions starts a custom role with the permissions available to assign. ", -1)),
            l("section", Ur, [
              d[20] || (d[20] = l("header", { class: "ks-pane-head" }, "Assignable permissions", -1)),
              l("div", Mr, [
                (a(!0), u(Q, null, Y(R.value, (b) => (a(), k(ht, {
                  key: b.id,
                  policy: b,
                  mode: "locked"
                }, null, 8, ["policy"]))), 128)),
                R.value.length ? m("", !0) : (a(), u("div", Wr, "No assignable permissions in the original role."))
              ])
            ]),
            (a(), u("details", {
              key: L.value.id,
              ref_key: "technicalDetails",
              ref: x,
              class: "ks-technical",
              onToggle: St
            }, [
              d[21] || (d[21] = l("summary", null, "Technical policies", -1)),
              B.value?.loading ? (a(), k(i(Mt), {
                key: 0,
                label: "Loading technical policies…"
              })) : B.value?.error ? (a(), u("p", Hr, w(B.value.error) + ". Reopen to try again.", 1)) : B.value?.policies.length ? (a(), u("ul", Gr, [
                (a(!0), u(Q, null, Y(B.value.policies, (b) => (a(), u("li", {
                  key: b.id
                }, [
                  l("code", null, w(b.id), 1)
                ]))), 128))
              ])) : B.value ? (a(), u("p", qr, "No additional technical policies.")) : m("", !0)
            ], 32)),
            L.value.overlay_policies && L.value.overlay_policies.length ? (a(), u("div", Zr, [
              l("div", Jr, [
                y(i(E), {
                  icon: "tabler:stack-2",
                  "aria-hidden": "true"
                }),
                d[22] || (d[22] = l("span", null, "Additional permissions", -1)),
                y(i(_t), { severity: "warn" }, {
                  default: S(() => [
                    I(w(L.value.overlay_policies.length), 1)
                  ]),
                  _: 1
                })
              ]),
              l("div", Qr, [
                (a(!0), u(Q, null, Y(L.value.overlay_policies, (b) => (a(), k(ht, {
                  key: b.id,
                  policy: b,
                  mode: "locked"
                }, null, 8, ["policy"]))), 128))
              ])
            ])) : m("", !0)
          ])) : (a(), u("div", Yr, [
            y(i($n), {
              icon: "tabler:shield-lock",
              title: "Roles",
              hint: "Choose a role to view its permissions, or create one with the permissions your team needs. Assign roles in System → Users.",
              cta: "New role",
              "cta-icon": "tabler:plus",
              onCta: q
            })
          ]))
        ]),
        _: 1
      }, 512)), [
        [nn, D.value === "scopes"]
      ])
    ]));
  }
}), ai = {
  rootComponent: Xr,
  plugins: [En]
};
export {
  ai as mountConfig
};
//# sourceMappingURL=lazy-mount-BC7PPD1V.js.map
