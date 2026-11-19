import { B as Z, R as Ut, s as Y, f as rt, k as Yt, b as wn, Q as xt, z as St, a as At, c as Nt, T as xn, C as Cn, K as Ct, v as Sn, V as Gt, l as tn, d as Vt, e as Bn, P as In } from "./wc-runtime-E4NYBaIN.js";
import { mergeProps as k, resolveDirective as Mt, withDirectives as ct, openBlock as a, createBlock as $, resolveDynamicComponent as lt, withCtx as C, renderSlot as N, normalizeClass as X, createElementBlock as c, createElementVNode as l, createCommentVNode as y, defineComponent as D, unref as i, createVNode as m, Fragment as et, renderList as ot, createTextVNode as I, toDisplayString as x, resolveComponent as qt, getCurrentInstance as Tn, computed as F, createSlots as Pn, ref as z, onMounted as An, watch as Ot, onBeforeUnmount as zn, nextTick as nn, useId as Ln, withModifiers as ft, onUnmounted as _n, vShow as Zt } from "vue";
import { Icon as O } from "@iconify/vue";
import { loadByTagName as Nn, api as at, host as en } from "@wippy-fe/proxy";
var Fn = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-tab", {
      "p-tab-active": e.active,
      "p-disabled": o.disabled
    }];
  }
}, Vn = Z.extend({
  name: "tab",
  classes: Fn
}), On = {
  name: "BaseTab",
  extends: Y,
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
  style: Vn,
  provide: function() {
    return {
      $pcTab: this,
      $parentInstance: this
    };
  }
}, on = {
  name: "Tab",
  extends: On,
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
      return o ? xt(o, "data-p-disabled") || xt(o, "data-pc-section") === "activebar" ? this.findNextTab(o) : St(o, '[data-pc-name="tab"]') : null;
    },
    findPrevTab: function(n) {
      var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = e ? n : n.previousElementSibling;
      return o ? xt(o, "data-p-disabled") || xt(o, "data-pc-section") === "activebar" ? this.findPrevTab(o) : St(o, '[data-pc-name="tab"]') : null;
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
      wn(e), this.scrollInView(e);
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
      return Yt((n = this.$pcTabs) === null || n === void 0 ? void 0 : n.d_value, this.value);
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
      return k(this.asAttrs, this.a11yAttrs, this.ptmi("root", this.ptParams));
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
      return rt({
        active: this.active
      });
    }
  },
  directives: {
    ripple: Ut
  }
};
function Rn(t, n, e, o, u, r) {
  var h = Mt("ripple");
  return t.asChild ? N(t.$slots, "default", {
    key: 1,
    dataP: r.dataP,
    class: X(t.cx("root")),
    active: r.active,
    a11yAttrs: r.a11yAttrs,
    onClick: r.onClick
  }) : ct((a(), $(lt(t.as), k({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP,
    onClick: r.onClick
  }, r.attrs), {
    default: C(function() {
      return [N(t.$slots, "default")];
    }),
    _: 3
  }, 16, ["class", "data-p", "onClick"])), [[h]]);
}
on.render = Rn;
var rn = {
  name: "ChevronLeftIcon",
  extends: At
};
function En(t) {
  return Un(t) || Kn(t) || Dn(t) || jn();
}
function jn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Dn(t, n) {
  if (t) {
    if (typeof t == "string") return Rt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Rt(t, n) : void 0;
  }
}
function Kn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Un(t) {
  if (Array.isArray(t)) return Rt(t);
}
function Rt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Mn(t, n, e, o, u, r) {
  return a(), c("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), En(n[0] || (n[0] = [l("path", {
    d: "M9.61296 13C9.50997 13.0005 9.40792 12.9804 9.3128 12.9409C9.21767 12.9014 9.13139 12.8433 9.05902 12.7701L3.83313 7.54416C3.68634 7.39718 3.60388 7.19795 3.60388 6.99022C3.60388 6.78249 3.68634 6.58325 3.83313 6.43628L9.05902 1.21039C9.20762 1.07192 9.40416 0.996539 9.60724 1.00012C9.81032 1.00371 10.0041 1.08597 10.1477 1.22959C10.2913 1.37322 10.3736 1.56698 10.3772 1.77005C10.3808 1.97313 10.3054 2.16968 10.1669 2.31827L5.49496 6.99022L10.1669 11.6622C10.3137 11.8091 10.3962 12.0084 10.3962 12.2161C10.3962 12.4238 10.3137 12.6231 10.1669 12.7701C10.0945 12.8433 10.0083 12.9014 9.91313 12.9409C9.81801 12.9804 9.71596 13.0005 9.61296 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
rn.render = Mn;
var an = {
  name: "ChevronRightIcon",
  extends: At
};
function Wn(t) {
  return Zn(t) || qn(t) || Gn(t) || Hn();
}
function Hn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Gn(t, n) {
  if (t) {
    if (typeof t == "string") return Et(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Et(t, n) : void 0;
  }
}
function qn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Zn(t) {
  if (Array.isArray(t)) return Et(t);
}
function Et(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Jn(t, n, e, o, u, r) {
  return a(), c("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Wn(n[0] || (n[0] = [l("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
an.render = Jn;
var Qn = {
  root: "p-tablist",
  content: "p-tablist-content p-tablist-viewport",
  tabList: "p-tablist-tab-list",
  activeBar: "p-tablist-active-bar",
  prevButton: "p-tablist-prev-button p-tablist-nav-button",
  nextButton: "p-tablist-next-button p-tablist-nav-button"
}, Xn = Z.extend({
  name: "tablist",
  classes: Qn
}), Yn = {
  name: "BaseTabList",
  extends: Y,
  props: {},
  style: Xn,
  provide: function() {
    return {
      $pcTabList: this,
      $parentInstance: this
    };
  }
}, ln = {
  name: "TabList",
  extends: Yn,
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
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = Nt(n) - e, u = Math.abs(n.scrollLeft), r = o * 0.8, h = u - r, w = Math.max(h, 0);
      n.scrollLeft = Gt(n) ? -1 * w : w;
    },
    onNextButtonClick: function() {
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = Nt(n) - e, u = Math.abs(n.scrollLeft), r = o * 0.8, h = u + r, w = n.scrollWidth - o, A = Math.min(h, w);
      n.scrollLeft = Gt(n) ? -1 * A : A;
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
      var e = this.$refs.content, o = St(e, '[data-pc-name="tab"][data-p-active="true"]');
      o && (this.inkBarObserver = new ResizeObserver(function() {
        return n.updateInkBar();
      }), this.inkBarObserver.observe(o));
    },
    unbindInkBarObserver: function() {
      var n;
      (n = this.inkBarObserver) === null || n === void 0 || n.disconnect(), this.inkBarObserver = void 0;
    },
    updateInkBar: function() {
      var n = this.$refs, e = n.content, o = n.inkbar, u = n.tabs;
      if (o) {
        var r = St(e, '[data-pc-name="tab"][data-p-active="true"]');
        this.$pcTabs.isVertical() ? (o.style.height = Cn(r) + "px", o.style.top = Ct(r).top - Ct(u).top + "px") : (o.style.width = Sn(r) + "px", o.style.left = Ct(r).left - Ct(u).left + "px");
      }
    },
    updateButtonState: function() {
      var n = this.$refs, e = n.list, o = n.content, u = o.scrollTop, r = o.scrollWidth, h = o.scrollHeight, w = o.offsetWidth, A = o.offsetHeight, B = Math.abs(o.scrollLeft), s = [Nt(o), xn(o)], S = s[0], R = s[1];
      this.$pcTabs.isVertical() ? (this.isPrevButtonEnabled = u !== 0, this.isNextButtonEnabled = e.offsetHeight >= A && parseInt(u) !== h - R) : (this.isPrevButtonEnabled = B !== 0, this.isNextButtonEnabled = e.offsetWidth >= w && parseInt(B) !== r - S);
    },
    getVisibleButtonWidths: function() {
      var n = this.$refs, e = n.prevButton, o = n.nextButton, u = 0;
      return this.showNavigators && (u = (e?.offsetWidth || 0) + (o?.offsetWidth || 0)), u;
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
      return rt({
        scrollable: this.$pcTabs.scrollable
      });
    }
  },
  components: {
    ChevronLeftIcon: rn,
    ChevronRightIcon: an
  },
  directives: {
    ripple: Ut
  }
}, te = ["data-p"], ne = ["aria-label", "tabindex"], ee = ["data-p"], oe = ["aria-orientation"], re = ["aria-label", "tabindex"];
function ae(t, n, e, o, u, r) {
  var h = Mt("ripple");
  return a(), c("div", k({
    ref: "list",
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [r.showNavigators && u.isPrevButtonEnabled ? ct((a(), c("button", k({
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
  }), [(a(), $(lt(r.templates.previcon || "ChevronLeftIcon"), k({
    "aria-hidden": "true"
  }, t.ptm("prevIcon")), null, 16))], 16, ne)), [[h]]) : y("", !0), l("div", k({
    ref: "content",
    class: t.cx("content"),
    onScroll: n[1] || (n[1] = function() {
      return r.onScroll && r.onScroll.apply(r, arguments);
    }),
    "data-p": r.dataP
  }, t.ptm("content")), [l("div", k({
    ref: "tabs",
    class: t.cx("tabList"),
    role: "tablist",
    "aria-orientation": r.$pcTabs.orientation || "horizontal"
  }, t.ptm("tabList")), [N(t.$slots, "default"), l("span", k({
    ref: "inkbar",
    class: t.cx("activeBar"),
    role: "presentation",
    "aria-hidden": "true"
  }, t.ptm("activeBar")), null, 16)], 16, oe)], 16, ee), r.showNavigators && u.isNextButtonEnabled ? ct((a(), c("button", k({
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
  }), [(a(), $(lt(r.templates.nexticon || "ChevronRightIcon"), k({
    "aria-hidden": "true"
  }, t.ptm("nextIcon")), null, 16))], 16, re)), [[h]]) : y("", !0)], 16, te);
}
ln.render = ae;
var ie = `
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
`, le = {
  root: function(n) {
    var e = n.props;
    return ["p-tabs p-component", {
      "p-tabs-scrollable": e.scrollable
    }];
  }
}, se = Z.extend({
  name: "tabs",
  style: ie,
  classes: le
}), de = {
  name: "BaseTabs",
  extends: Y,
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
  style: se,
  provide: function() {
    return {
      $pcTabs: this,
      $parentInstance: this
    };
  }
}, sn = {
  name: "Tabs",
  extends: de,
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
function ue(t, n, e, o, u, r) {
  return a(), c("div", k({
    class: t.cx("root")
  }, t.ptmi("root")), [N(t.$slots, "default")], 16);
}
sn.render = ue;
const ce = {
  key: 0,
  class: "kx-system-tab-count"
}, be = /* @__PURE__ */ D({
  __name: "SystemTabs",
  props: {
    value: {},
    label: {},
    items: {}
  },
  emits: ["update:value"],
  setup(t) {
    return (n, e) => (a(), $(i(sn), {
      class: "kx-system-tabs",
      "data-kx-separator": "surface",
      value: t.value,
      "onUpdate:value": e[0] || (e[0] = (o) => n.$emit("update:value", String(o)))
    }, {
      default: C(() => [
        m(i(ln), {
          pt: { tabList: { "aria-label": t.label } }
        }, {
          default: C(() => [
            (a(!0), c(et, null, ot(t.items, (o) => (a(), $(i(on), k({
              key: o.value,
              value: o.value
            }, { ref_for: !0 }, o.controls ? { "aria-controls": o.controls } : {}), {
              default: C(() => [
                I(x(o.label), 1),
                o.count !== void 0 ? (a(), c("b", ce, x(o.count), 1)) : y("", !0)
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
}), pe = { class: "kx-shell" }, ve = { class: "kx-rail" }, fe = { class: "kx-main kx-system-pane" }, he = /* @__PURE__ */ D({
  __name: "Shell",
  setup(t) {
    return (n, e) => (a(), c("div", pe, [
      l("aside", ve, [
        N(n.$slots, "rail")
      ]),
      l("main", fe, [
        N(n.$slots, "default")
      ])
    ]));
  }
}), ge = { class: "kx-railhead" }, me = { class: "kx-railhead-title" }, ye = { key: 0 }, ke = { class: "kx-railhead-acts" }, $e = /* @__PURE__ */ D({
  __name: "RailHeader",
  props: {
    title: {},
    count: {}
  },
  setup(t) {
    return (n, e) => (a(), c("div", ge, [
      l("span", me, [
        I(x(t.title), 1),
        t.count !== void 0 ? (a(), c("b", ye, x(t.count), 1)) : y("", !0)
      ]),
      l("div", ke, [
        N(n.$slots, "actions")
      ])
    ]));
  }
});
var Wt = {
  name: "SpinnerIcon",
  extends: At
};
function we(t) {
  return Be(t) || Se(t) || Ce(t) || xe();
}
function xe() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ce(t, n) {
  if (t) {
    if (typeof t == "string") return jt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? jt(t, n) : void 0;
  }
}
function Se(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Be(t) {
  if (Array.isArray(t)) return jt(t);
}
function jt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Ie(t, n, e, o, u, r) {
  return a(), c("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), we(n[0] || (n[0] = [l("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Wt.render = Ie;
var Te = `
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
`, Pe = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Vt(e.value) && String(e.value).length === 1,
      "p-badge-dot": tn(e.value) && !o.$slots.default,
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
}, Ae = Z.extend({
  name: "badge",
  style: Te,
  classes: Pe
}), ze = {
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
  style: Ae,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function ht(t) {
  "@babel/helpers - typeof";
  return ht = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, ht(t);
}
function Jt(t, n, e) {
  return (n = Le(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Le(t) {
  var n = _e(t, "string");
  return ht(n) == "symbol" ? n : n + "";
}
function _e(t, n) {
  if (ht(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (ht(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var dn = {
  name: "Badge",
  extends: ze,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return rt(Jt(Jt({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ne = ["data-p"];
function Fe(t, n, e, o, u, r) {
  return a(), c("span", k({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [N(t.$slots, "default", {}, function() {
    return [I(x(t.value), 1)];
  })], 16, Ne);
}
dn.render = Fe;
var Ve = `
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
function gt(t) {
  "@babel/helpers - typeof";
  return gt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, gt(t);
}
function nt(t, n, e) {
  return (n = Oe(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Oe(t) {
  var n = Re(t, "string");
  return gt(n) == "symbol" ? n : n + "";
}
function Re(t, n) {
  if (gt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (gt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ee = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-button p-component", nt(nt(nt(nt(nt(nt(nt(nt(nt({
      "p-button-icon-only": e.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", e.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(n) {
    var e = n.props;
    return ["p-button-icon", nt({}, "p-button-icon-".concat(e.iconPos), e.label)];
  },
  label: "p-button-label"
}, je = Z.extend({
  name: "button",
  style: Ve,
  classes: Ee
}), De = {
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
  style: je,
  provide: function() {
    return {
      $pcButton: this,
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
function M(t, n, e) {
  return (n = Ke(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ke(t) {
  var n = Ue(t, "string");
  return mt(n) == "symbol" ? n : n + "";
}
function Ue(t, n) {
  if (mt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (mt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var wt = {
  name: "Button",
  extends: De,
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
      return k(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return tn(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return rt(M(M(M(M(M(M(M(M(M(M({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return rt(M(M({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return rt(M(M({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Wt,
    Badge: dn
  },
  directives: {
    ripple: Ut
  }
}, Me = ["data-p"], We = ["data-p"];
function He(t, n, e, o, u, r) {
  var h = qt("SpinnerIcon"), w = qt("Badge"), A = Mt("ripple");
  return t.asChild ? N(t.$slots, "default", {
    key: 1,
    class: X(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : ct((a(), $(lt(t.as), k({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: C(function() {
      return [N(t.$slots, "default", {}, function() {
        return [t.loading ? N(t.$slots, "loadingicon", k({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (a(), c("span", k({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (a(), $(h, k({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : N(t.$slots, "icon", k({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (a(), c("span", k({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, Me)) : y("", !0)];
        }), t.label ? (a(), c("span", k({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), x(t.label), 17, We)) : y("", !0), t.badge ? (a(), $(w, {
          key: 3,
          value: t.badge,
          class: X(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : y("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[A]]);
}
wt.render = He;
const Bt = /* @__PURE__ */ D({
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
    const e = t, o = n, u = Tn(), r = F(
      () => Object.prototype.hasOwnProperty.call(u?.vnode.props ?? {}, "active")
    ), h = F(
      () => e.variant === "danger" ? "danger" : e.variant === "bordered" ? "secondary" : void 0
    ), w = F(
      () => e.size === "sm" ? "small" : e.size === "lg" ? "large" : void 0
    );
    return (A, B) => (a(), $(i(wt), {
      type: "button",
      severity: h.value,
      text: t.variant !== "bordered" && !t.active,
      outlined: t.variant === "bordered",
      size: w.value,
      loading: t.spin,
      disabled: t.disabled || t.spin,
      pt: {
        root: {
          "aria-label": t.label,
          "aria-pressed": r.value ? String(t.active) : void 0,
          title: t.label
        }
      },
      onClick: B[0] || (B[0] = (s) => o("click"))
    }, {
      icon: C(() => [
        m(i(O), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      _: 1
    }, 8, ["severity", "text", "outlined", "size", "loading", "disabled", "pt"]));
  }
}), Q = /* @__PURE__ */ D({
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
    const e = t, o = n, u = F(
      () => e.variant === "danger" ? "danger" : e.variant === "primary" ? void 0 : "secondary"
    );
    return (r, h) => (a(), $(i(wt), {
      type: t.type,
      severity: u.value,
      outlined: t.variant === "ghost",
      loading: t.loading,
      disabled: t.disabled || t.loading,
      size: t.small ? "small" : void 0,
      onClick: h[0] || (h[0] = (w) => o("click"))
    }, {
      default: C(() => [
        t.loading ? (a(), $(i(Wt), {
          key: 0,
          class: "p-button-loading-icon p-button-icon",
          spin: ""
        })) : y("", !0),
        t.icon && !t.loading ? (a(), $(i(O), {
          key: 1,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        N(r.$slots, "default")
      ]),
      _: 3
    }, 8, ["type", "severity", "outlined", "loading", "disabled", "size"]));
  }
});
var Ge = {
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
      var o, u;
      this.controlled && (this.d_value = n, this.$emit("update:modelValue", n)), this.$emit("value-change", n), (o = (u = this.formField).onChange) === null || o === void 0 || o.call(u, {
        originalEvent: e,
        value: n
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var n = arguments.length, e = new Array(n), o = 0; o < n; o++)
        e[o] = arguments[o];
      return e.find(Vt);
    }
  },
  computed: {
    $filled: function() {
      return Vt(this.d_value);
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
}, un = {
  name: "BaseInput",
  extends: Ge,
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
}, qe = `
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
`, Ze = {
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
}, Je = Z.extend({
  name: "inputtext",
  style: qe,
  classes: Ze
}), Qe = {
  name: "BaseInputText",
  extends: un,
  style: Je,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function yt(t) {
  "@babel/helpers - typeof";
  return yt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, yt(t);
}
function Xe(t, n, e) {
  return (n = Ye(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ye(t) {
  var n = to(t, "string");
  return yt(n) == "symbol" ? n : n + "";
}
function to(t, n) {
  if (yt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (yt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ht = {
  name: "InputText",
  extends: Qe,
  inheritAttrs: !1,
  methods: {
    onInput: function(n) {
      this.writeValue(n.target.value, n);
    }
  },
  computed: {
    attrs: function() {
      return k(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return rt(Xe({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, no = ["value", "name", "disabled", "aria-invalid", "data-p"];
function eo(t, n, e, o, u, r) {
  return a(), c("input", k({
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
  }, r.attrs), null, 16, no);
}
Ht.render = eo;
var oo = `
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
`, ro = {
  root: "p-iconfield"
}, ao = Z.extend({
  name: "iconfield",
  style: oo,
  classes: ro
}), io = {
  name: "BaseIconField",
  extends: Y,
  style: ao,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, cn = {
  name: "IconField",
  extends: io,
  inheritAttrs: !1
};
function lo(t, n, e, o, u, r) {
  return a(), c("div", k({
    class: t.cx("root")
  }, t.ptmi("root")), [N(t.$slots, "default")], 16);
}
cn.render = lo;
var so = {
  root: "p-inputicon"
}, uo = Z.extend({
  name: "inputicon",
  classes: so
}), co = {
  name: "BaseInputIcon",
  extends: Y,
  style: uo,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, bn = {
  name: "InputIcon",
  extends: co,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function bo(t, n, e, o, u, r) {
  return a(), c("span", k({
    class: r.containerClass
  }, t.ptmi("root"), {
    "aria-hidden": "true"
  }), [N(t.$slots, "default")], 16);
}
bn.render = bo;
const Qt = /* @__PURE__ */ D({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(t, { emit: n }) {
    const e = n;
    return (o, u) => (a(), $(i(cn), { class: "km-search" }, {
      default: C(() => [
        m(i(bn), null, {
          default: C(() => [
            m(i(O), {
              icon: "tabler:search",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        m(i(Ht), {
          class: "km-search-input",
          "aria-label": t.placeholder || "Search",
          "model-value": t.modelValue,
          placeholder: t.placeholder || "Search",
          "onUpdate:modelValue": u[0] || (u[0] = (r) => e("update:modelValue", r ?? ""))
        }, null, 8, ["aria-label", "model-value", "placeholder"]),
        t.modelValue ? (a(), $(i(wt), {
          key: 0,
          text: "",
          severity: "secondary",
          class: "km-search-clear",
          "aria-label": "Clear search",
          onClick: u[1] || (u[1] = (r) => e("update:modelValue", ""))
        }, {
          icon: C(() => [
            m(i(O), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })) : y("", !0)
      ]),
      _: 1
    }));
  }
}), po = { class: "km-field" }, vo = { class: "km-field-label" }, fo = {
  key: 0,
  class: "km-field-help"
}, It = /* @__PURE__ */ D({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(t) {
    return (n, e) => (a(), c("label", po, [
      l("span", vo, x(t.label), 1),
      N(n.$slots, "default"),
      t.help ? (a(), c("small", fo, x(t.help), 1)) : y("", !0)
    ]));
  }
}), Xt = /* @__PURE__ */ D({
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
    return (o, u) => (a(), $(i(Ht), {
      class: X(["km-input", t.mono && "mono"]),
      type: t.type,
      "model-value": String(t.modelValue),
      placeholder: t.placeholder,
      readonly: t.readonly,
      disabled: t.disabled,
      autocomplete: t.autocomplete,
      min: t.min,
      max: t.max,
      step: t.step,
      "onUpdate:modelValue": u[0] || (u[0] = (r) => e("update:modelValue", r ?? ""))
    }, null, 8, ["class", "type", "model-value", "placeholder", "readonly", "disabled", "autocomplete", "min", "max", "step"]));
  }
});
var ho = `
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
`, go = {
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
}, mo = Z.extend({
  name: "tag",
  style: ho,
  classes: go
}), yo = {
  name: "BaseTag",
  extends: Y,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: mo,
  provide: function() {
    return {
      $pcTag: this,
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
function ko(t, n, e) {
  return (n = $o(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function $o(t) {
  var n = wo(t, "string");
  return kt(n) == "symbol" ? n : n + "";
}
function wo(t, n) {
  if (kt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (kt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var pn = {
  name: "Tag",
  extends: yo,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return rt(ko({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, xo = ["data-p"];
function Co(t, n, e, o, u, r) {
  return a(), c("span", k({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (a(), $(lt(t.$slots.icon), k({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), c("span", k({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : y("", !0), t.value != null || t.$slots.default ? N(t.$slots, "default", {
    key: 2
  }, function() {
    return [l("span", k({
      class: t.cx("label")
    }, t.ptm("label")), x(t.value), 17)];
  }) : y("", !0)], 16, xo);
}
pn.render = Co;
const So = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, Tt = /* @__PURE__ */ D({
  __name: "Pill",
  props: {
    severity: { default: "secondary" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(t) {
    return (n, e) => (a(), $(i(pn), {
      severity: t.severity || void 0,
      class: "km-pill kx-tag-sm"
    }, {
      default: C(() => [
        t.dot ? (a(), c("span", So)) : t.icon ? (a(), $(i(O), {
          key: 1,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        N(n.$slots, "default")
      ]),
      _: 3
    }, 8, ["severity"]));
  }
}), Bo = { class: "km-notice-text" }, Pt = /* @__PURE__ */ D({
  __name: "Notice",
  props: {
    severity: { default: "info" }
  },
  emits: ["dismiss"],
  setup(t, { emit: n }) {
    const e = n, o = (u) => u === "danger" ? "tabler:alert-triangle" : u === "success" ? "tabler:circle-check" : "tabler:info-circle";
    return (u, r) => (a(), c("div", {
      class: X(["km-notice", `is-${t.severity}`]),
      role: "status"
    }, [
      m(i(O), {
        icon: o(t.severity),
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      l("span", Bo, [
        N(u.$slots, "default")
      ]),
      l("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: r[0] || (r[0] = (h) => e("dismiss"))
      }, [
        m(i(O), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
});
var Io = `
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
`, To = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
}, Po = Z.extend({
  name: "progressspinner",
  style: Io,
  classes: To
}), Ao = {
  name: "BaseProgressSpinner",
  extends: Y,
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
  style: Po,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, vn = {
  name: "ProgressSpinner",
  extends: Ao,
  inheritAttrs: !1,
  computed: {
    svgStyle: function() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
}, zo = ["fill", "stroke-width"];
function Lo(t, n, e, o, u, r) {
  return a(), c("div", k({
    class: t.cx("root"),
    role: "progressbar"
  }, t.ptmi("root")), [(a(), c("svg", k({
    class: t.cx("spin"),
    viewBox: "25 25 50 50",
    style: r.svgStyle
  }, t.ptm("spin")), [l("circle", k({
    class: t.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: t.fill,
    "stroke-width": t.strokeWidth,
    strokeMiterlimit: "10"
  }, t.ptm("circle")), null, 16, zo)], 16))], 16);
}
vn.render = Lo;
const _o = { class: "km-loading" }, No = { key: 0 }, fn = /* @__PURE__ */ D({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(t) {
    return (n, e) => (a(), c("div", _o, [
      m(i(vn), {
        style: { width: "22px", height: "22px", margin: "0" },
        "aria-label": t.label || "Loading"
      }, null, 8, ["aria-label"]),
      t.label ? (a(), c("span", No, x(t.label), 1)) : y("", !0)
    ]));
  }
}), Fo = { class: "kx-empty" }, Vo = { class: "kx-empty-ico" }, Oo = { class: "kx-empty-title" }, Ro = {
  key: 0,
  class: "kx-empty-sub"
}, hn = /* @__PURE__ */ D({
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
    return (n, e) => (a(), c("div", Fo, [
      l("div", Vo, [
        m(i(O), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      l("div", Oo, x(t.title), 1),
      t.hint || n.$slots.hint ? (a(), c("p", Ro, [
        N(n.$slots, "hint", {}, () => [
          I(x(t.hint), 1)
        ])
      ])) : y("", !0),
      t.cta ? (a(), $(i(wt), {
        key: 1,
        label: t.cta,
        onClick: e[0] || (e[0] = (o) => n.$emit("cta"))
      }, Pn({ _: 2 }, [
        t.ctaIcon ? {
          name: "icon",
          fn: C(({ class: o }) => [
            m(i(O), {
              icon: t.ctaIcon,
              class: X(o),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : y("", !0)
    ]));
  }
});
var gn = {
  name: "TimesCircleIcon",
  extends: At
};
function Eo(t) {
  return Uo(t) || Ko(t) || Do(t) || jo();
}
function jo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Do(t, n) {
  if (t) {
    if (typeof t == "string") return Dt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Dt(t, n) : void 0;
  }
}
function Ko(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Uo(t) {
  if (Array.isArray(t)) return Dt(t);
}
function Dt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Mo(t, n, e, o, u, r) {
  return a(), c("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Eo(n[0] || (n[0] = [l("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
gn.render = Mo;
var Wo = `
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
`, Ho = {
  root: "p-chip p-component",
  image: "p-chip-image",
  icon: "p-chip-icon",
  label: "p-chip-label",
  removeIcon: "p-chip-remove-icon"
}, Go = Z.extend({
  name: "chip",
  style: Wo,
  classes: Ho
}), qo = {
  name: "BaseChip",
  extends: Y,
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
  style: Go,
  provide: function() {
    return {
      $pcChip: this,
      $parentInstance: this
    };
  }
}, mn = {
  name: "Chip",
  extends: qo,
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
      return rt({
        removable: this.removable
      });
    }
  },
  components: {
    TimesCircleIcon: gn
  }
}, Zo = ["aria-label", "data-p"], Jo = ["src"];
function Qo(t, n, e, o, u, r) {
  return u.visible ? (a(), c("div", k({
    key: 0,
    class: t.cx("root"),
    "aria-label": t.label
  }, t.ptmi("root"), {
    "data-p": r.dataP
  }), [N(t.$slots, "default", {}, function() {
    return [t.image ? (a(), c("img", k({
      key: 0,
      src: t.image
    }, t.ptm("image"), {
      class: t.cx("image")
    }), null, 16, Jo)) : t.$slots.icon ? (a(), $(lt(t.$slots.icon), k({
      key: 1,
      class: t.cx("icon")
    }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), c("span", k({
      key: 2,
      class: [t.cx("icon"), t.icon]
    }, t.ptm("icon")), null, 16)) : y("", !0), t.label !== null ? (a(), c("div", k({
      key: 3,
      class: t.cx("label")
    }, t.ptm("label")), x(t.label), 17)) : y("", !0)];
  }), t.removable ? N(t.$slots, "removeicon", {
    key: 0,
    removeCallback: r.close,
    keydownCallback: r.onKeydown
  }, function() {
    return [(a(), $(lt(t.removeIcon ? "span" : "TimesCircleIcon"), k({
      class: [t.cx("removeIcon"), t.removeIcon],
      onClick: r.close,
      onKeydown: r.onKeydown
    }, t.ptm("removeIcon")), null, 16, ["class", "onClick", "onKeydown"]))];
  }) : y("", !0)], 16, Zo)) : y("", !0);
}
mn.render = Qo;
var Xo = `
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
`, Yo = {
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
}, tr = Z.extend({
  name: "radiobutton",
  style: Xo,
  classes: Yo
}), nr = {
  name: "BaseRadioButton",
  extends: un,
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
  style: tr,
  provide: function() {
    return {
      $pcRadioButton: this,
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
function er(t, n, e) {
  return (n = or(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function or(t) {
  var n = rr(t, "string");
  return $t(n) == "symbol" ? n : n + "";
}
function rr(t, n) {
  if ($t(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if ($t(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Kt = {
  name: "RadioButton",
  extends: nr,
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
      return n != null && (this.binary ? !!n : Yt(n, this.value));
    },
    dataP: function() {
      return rt(er({
        invalid: this.$invalid,
        checked: this.checked,
        disabled: this.disabled,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, ar = ["data-p-checked", "data-p-disabled", "data-p"], ir = ["id", "value", "name", "checked", "tabindex", "disabled", "readonly", "aria-labelledby", "aria-label", "aria-invalid"], lr = ["data-p"], sr = ["data-p"];
function dr(t, n, e, o, u, r) {
  return a(), c("div", k({
    class: t.cx("root")
  }, r.getPTOptions("root"), {
    "data-p-checked": r.checked,
    "data-p-disabled": t.disabled,
    "data-p": r.dataP
  }), [l("input", k({
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
  }, r.getPTOptions("input")), null, 16, ir), l("div", k({
    class: t.cx("box")
  }, r.getPTOptions("box"), {
    "data-p": r.dataP
  }), [l("div", k({
    class: t.cx("icon")
  }, r.getPTOptions("icon"), {
    "data-p": r.dataP
  }), null, 16, sr)], 16, lr)], 16, ar);
}
Kt.render = dr;
const ur = { class: "kx-wcmount" }, cr = {
  key: 0,
  class: "kx-wcmount-fail",
  role: "alert"
}, Ft = /* @__PURE__ */ D({
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
    const e = t, o = n, u = z(null), r = z(!1);
    let h = null, w = 0;
    const A = /* @__PURE__ */ new Set();
    function B(g) {
      g.composedPath()[0] === h && (g.stopPropagation(), o("change", g.detail));
    }
    function s(g) {
      return g.composedPath()[0] !== h ? !1 : (g.stopPropagation(), !0);
    }
    function S(g) {
      s(g) && o("select", g.detail);
    }
    function R(g) {
      s(g) && o("created", g.detail);
    }
    function G(g) {
      s(g) && o("close", g.detail);
    }
    function W(g) {
      s(g) && o("error", g.detail);
    }
    function K(g) {
      if (typeof g == "string") return g;
      try {
        return JSON.stringify(g ?? {});
      } catch {
        return null;
      }
    }
    function V() {
      if (!h) return;
      const g = K(e.config);
      if (g !== null && h.setAttribute("config", g), e.schema !== void 0 && e.schema !== null) {
        const L = K(e.schema);
        L !== null && h.setAttribute("schema", L);
      }
      if (e.meta !== void 0 && e.meta !== null) {
        const L = K(e.meta);
        L !== null && h.setAttribute("meta", L);
      }
      e.provider && h.setAttribute("provider", e.provider), e.label && h.setAttribute("label", e.label);
      const j = e.attrs || {};
      for (const L of [...A])
        (!(L in j) || j[L] == null) && (h.removeAttribute(L), A.delete(L));
      for (const [L, _] of Object.entries(j)) {
        if (_ == null) continue;
        const it = typeof _ == "object" ? K(_) : String(_);
        it !== null && (h.setAttribute(L, it), A.add(L));
      }
    }
    function P(g = h) {
      g && (g.removeEventListener("config-changed", B), g.removeEventListener("change", B), g.removeEventListener("select", S), g.removeEventListener("created", R), g.removeEventListener("close", G), g.removeEventListener("error", W), g === h && (h = null), A.clear());
    }
    async function E(g) {
      if (!customElements.get(g))
        try {
          await Nn(g, { timeoutMs: 8e3 });
        } catch {
        }
    }
    async function q() {
      const g = ++w, j = u.value, L = e.tag;
      if (r.value = !1, !!j && (P(), j.innerHTML = "", !!L))
        try {
          if (await E(L), g !== w || u.value !== j || e.tag !== L) return;
          const _ = document.createElement(L);
          _.classList.add("kx-wcmount-surface"), h = _, V(), _.addEventListener("config-changed", B), _.addEventListener("change", B), _.addEventListener("select", S), _.addEventListener("created", R), _.addEventListener("close", G), _.addEventListener("error", W), _.style.display = "block", j.appendChild(_), r.value = !customElements.get(L);
        } catch {
          g === w && (r.value = !0);
        }
    }
    async function tt() {
      r.value = !1, await nn(), await q();
    }
    return An(q), Ot(() => e.tag, q), Ot(() => [e.config, e.schema, e.meta, e.provider, e.label, e.attrs], V, { deep: !0 }), zn(() => {
      w += 1, P();
    }), (g, j) => (a(), c("div", ur, [
      r.value ? (a(), c("div", cr, [
        j[0] || (j[0] = l("span", null, "This setup panel couldn’t load.", -1)),
        l("button", {
          type: "button",
          onClick: tt
        }, "Try again")
      ])) : (a(), c("div", {
        key: 1,
        ref_key: "host",
        ref: u
      }, null, 512))
    ]));
  }
});
function vt(t, n) {
  const e = t?.response?.data ?? t?.data;
  return typeof e?.error == "string" && e.error ? e.error : typeof e?.message == "string" && e.message ? e.message : t instanceof Error ? t.message : n;
}
function br() {
  const t = z([]), n = z([]), e = z(!0), o = z(!1), u = z("");
  let r = 0;
  async function h() {
    const B = ++r;
    e.value = !0, u.value = "";
    try {
      const [s, S] = await Promise.all([
        at.get("/api/v1/security/scopes?include_unavailable=true"),
        at.get("/api/v1/security/policies?assignable=true")
      ]);
      if (B !== r) return;
      t.value = s.data?.scopes ?? [], n.value = S.data?.policies ?? [];
    } catch (s) {
      B === r && (u.value = vt(s, "failed to load security"));
    } finally {
      B === r && (e.value = !1);
    }
  }
  async function w(B) {
    o.value = !0, u.value = "";
    try {
      return await at.post("/api/v1/security/scopes", B), await h(), !0;
    } catch (s) {
      return u.value = vt(s, "failed to save scope"), !1;
    } finally {
      o.value = !1;
    }
  }
  async function A(B) {
    o.value = !0, u.value = "";
    try {
      return await at.delete(`/api/v1/security/scopes?slug=${encodeURIComponent(B)}`), await h(), !0;
    } catch (s) {
      return u.value = vt(s, "failed to delete scope"), !1;
    } finally {
      o.value = !1;
    }
  }
  return { scopes: t, policies: n, loading: e, saving: o, error: u, load: h, saveScope: w, deleteScope: A };
}
function pr() {
  const t = z([]), n = z(!1), e = z(!1), o = z(""), u = z(""), r = z(null);
  let h = 0;
  async function w() {
    const s = ++h;
    n.value = !0, o.value = "";
    try {
      const { data: S } = await at.get("/api/v1/security/delegations");
      if (S?.success !== !0 || !Array.isArray(S.delegations))
        throw new Error(S?.error || "Delegation inventory is unconfirmed");
      s === h && (t.value = S.delegations);
    } catch (S) {
      s === h && (o.value = vt(S, "Could not load run-as permissions"));
    } finally {
      s === h && (n.value = !1);
    }
  }
  async function A() {
    if (!r.value || e.value) return;
    const s = r.value;
    e.value = !0, o.value = "", u.value = "";
    try {
      const { data: S } = s.method === "save" ? await at.post("/api/v1/security/delegations", s.request) : await at.delete("/api/v1/security/delegations", { data: s.request });
      if (S?.success !== !0) throw new Error(S?.error || "Run-as request is unconfirmed");
      r.value = null, u.value = s.method === "save" ? "Run-as permission saved" : "Run-as permission revoked", await w();
    } catch (S) {
      o.value = vt(S, "Could not confirm run-as request");
      const R = S?.response?.status;
      R && R >= 400 && R < 500 && (r.value = null);
    } finally {
      e.value = !1;
    }
  }
  async function B(s, S) {
    r.value || e.value || (r.value = { method: s, request: {
      ...S,
      principal: { ...S.principal },
      ...S.groups ? { groups: [...S.groups].sort() } : {}
    } }, await A());
  }
  return { delegations: t, loading: n, saving: e, error: o, confirmation: u, pending: r, load: w, mutate: B, submit: A };
}
const vr = {
  class: "ks-runas kx-system-pane",
  "aria-label": "Run-as permissions"
}, fr = { class: "kx-system-tools" }, hr = { class: "ks-runas-head kx-system-toolbar" }, gr = { class: "ks-runas-count" }, mr = { class: "ks-runas-acts" }, yr = { class: "kx-system-body ks-runas-body" }, kr = {
  key: 0,
  role: "alert"
}, $r = { class: "ks-runas-form-head" }, wr = ["disabled", "inert"], xr = { class: "ks-runas-steps" }, Cr = {
  key: 0,
  class: "ks-runas-chips",
  "aria-label": "Selected groups"
}, Sr = { class: "ks-runas-component-options" }, Br = ["for"], Ir = ["for"], Tr = { class: "ks-runas-form-foot" }, Pr = {
  key: 3,
  class: "ks-runas-pending"
}, Ar = {
  key: 6,
  class: "ks-runas-list"
}, zr = { class: "ks-runas-grant-body" }, Lr = { class: "ks-runas-grant-line" }, _r = {
  key: 0,
  class: "ks-runas-who"
}, Nr = { class: "ks-runas-verb" }, Fr = { class: "ks-runas-who" }, Vr = { class: "ks-runas-grant-meta" }, Or = { key: 0 }, Rr = { key: 1 }, Er = { key: 2 }, jr = /* @__PURE__ */ D({
  __name: "Delegations",
  props: {
    scopes: {}
  },
  setup(t, { expose: n }) {
    const e = t, o = pr(), { delegations: u, loading: r, saving: h, error: w, confirmation: A, pending: B } = o, s = z(!1), S = z(!1), R = z(""), G = z(""), W = z(!0), K = Ln(), V = z([]), P = F(() => h.value || !!B.value), E = F(() => !!R.value && V.value.length > 0 && (W.value || !!G.value)), q = F(() => {
      const T = {};
      for (const v of e.scopes) T[v.id] = v.label || "Group unavailable";
      return T;
    }), tt = z({});
    Ot(u, async (T) => {
      const v = [...new Set(T.map((f) => f.principal.id))].filter((f) => !tt.value[f]);
      if (v.length)
        try {
          const { data: f } = await at.post("/api/v1/principals/resolve", { refs: v.map((U) => ({ type: "user", id: U })) }), J = { ...tt.value };
          for (const U of Array.isArray(f?.principals) ? f.principals : [])
            U && typeof U.id == "string" && typeof U.label == "string" && (J[U.id] = U.label);
          tt.value = J;
        } catch (f) {
          w.value = f && typeof f == "object" && "message" in f ? String(f.message) : "Could not resolve account names";
        }
    });
    const g = F(() => u.value.filter((T) => T.active)), j = F(() => u.value.filter((T) => !T.active)), L = F(() => S.value ? [...g.value, ...j.value] : g.value);
    function _(T, v) {
      if (!T || typeof T != "object") return;
      const f = T;
      P.value || f.type !== v || typeof f.id != "string" || (v === "user" ? R.value = f.id : f.id && !V.value.some((J) => J.id === f.id) && V.value.push({ id: f.id, label: typeof f.label == "string" ? f.label : f.id }));
    }
    function it(T) {
      const v = T && typeof T == "object" ? T.thread_id : void 0;
      !P.value && typeof v == "string" && (G.value = v);
    }
    function st(T) {
      w.value = T && typeof T == "object" && "message" in T ? String(T.message) : "Could not load the picker";
    }
    function zt() {
      R.value = "", G.value = "", W.value = !0, V.value = [], s.value = !0;
    }
    async function dt() {
      E.value && (await o.mutate("save", {
        principal: { kind: "user", id: R.value },
        root: W.value ? "*" : G.value,
        groups: V.value.map((T) => T.id)
      }), !w.value && !B.value && (s.value = !1));
    }
    async function Lt(T) {
      await en.confirm({
        header: "Revoke run-as permission?",
        message: `Members of ${T.groups.map((f) => q.value[f] || "Group unavailable").join(", ")} can no longer choose ${tt.value[T.principal.id] || "Account unavailable"} in the Run as setting.`,
        icon: "tabler:user-off",
        acceptLabel: "Revoke",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await o.mutate("revoke", { principal: T.principal, root: T.root });
    }
    return n({ load: o.load }), (T, v) => (a(), c("section", vr, [
      l("div", fr, [
        l("header", hr, [
          l("span", gr, x(g.value.length) + " active " + x(g.value.length === 1 ? "permission" : "permissions"), 1),
          l("div", mr, [
            m(i(Bt), {
              icon: "tabler:refresh",
              label: "Refresh",
              disabled: i(r) || P.value,
              spin: i(r),
              onClick: i(o).load
            }, null, 8, ["disabled", "spin", "onClick"]),
            s.value ? y("", !0) : (a(), $(i(Q), {
              key: 0,
              variant: "primary",
              icon: "tabler:plus",
              disabled: P.value,
              onClick: zt
            }, {
              default: C(() => [...v[9] || (v[9] = [
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
      l("div", yr, [
        i(w) ? (a(), c("div", kr, [
          m(i(Pt), {
            severity: "danger",
            onDismiss: v[0] || (v[0] = (f) => w.value = "")
          }, {
            default: C(() => [
              I(x(i(w)), 1)
            ]),
            _: 1
          })
        ])) : y("", !0),
        i(A) ? (a(), $(i(Pt), {
          key: 1,
          "data-test": "delegation-confirmation",
          severity: "success",
          onDismiss: v[1] || (v[1] = (f) => A.value = "")
        }, {
          default: C(() => [
            I(x(i(A)), 1)
          ]),
          _: 1
        })) : y("", !0),
        s.value ? (a(), c("form", {
          key: 2,
          class: "ks-runas-form",
          onSubmit: ft(dt, ["prevent"])
        }, [
          l("div", $r, [
            v[11] || (v[11] = l("span", null, "New run-as permission", -1)),
            m(i(Bt), {
              icon: "tabler:x",
              label: "Cancel",
              disabled: P.value,
              onClick: v[2] || (v[2] = (f) => s.value = !1)
            }, null, 8, ["disabled"])
          ]),
          l("fieldset", {
            disabled: P.value,
            inert: P.value
          }, [
            l("ol", xr, [
              l("li", null, [
                m(i(It), {
                  label: "Account to run as",
                  help: "The account whose access the component uses. Its group memberships decide what the component can do."
                }, {
                  default: C(() => [
                    m(Ft, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "user", placeholder: "Choose an account…" },
                      config: { principal_id: R.value },
                      onChange: v[3] || (v[3] = (f) => _(f, "user")),
                      onError: st
                    }, null, 8, ["config"])
                  ]),
                  _: 1
                })
              ]),
              l("li", null, [
                m(i(It), {
                  label: "Who may choose it",
                  help: "Members of these groups see this account in the Run as setting. Nobody's group membership changes."
                }, {
                  default: C(() => [
                    m(Ft, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "group", placeholder: "Add a group…" },
                      config: {},
                      onChange: v[4] || (v[4] = (f) => _(f, "group")),
                      onError: st
                    })
                  ]),
                  _: 1
                }),
                V.value.length ? (a(), c("div", Cr, [
                  (a(!0), c(et, null, ot(V.value, (f) => (a(), $(i(mn), {
                    key: f.id,
                    label: f.label,
                    removable: !P.value,
                    pt: { removeIcon: { "aria-label": `Remove group ${f.label}` } },
                    onRemove: (J) => V.value = V.value.filter((U) => U.id !== f.id)
                  }, null, 8, ["label", "removable", "pt", "onRemove"]))), 128))
                ])) : y("", !0)
              ]),
              l("li", null, [
                l("fieldset", null, [
                  v[14] || (v[14] = l("legend", { class: "km-field-label" }, "On which components", -1)),
                  l("div", Sr, [
                    l("label", {
                      class: "ks-runas-component-option",
                      for: `${i(K)}-any`
                    }, [
                      m(i(Kt), {
                        modelValue: W.value,
                        "onUpdate:modelValue": v[5] || (v[5] = (f) => W.value = f),
                        "input-id": `${i(K)}-any`,
                        name: i(K),
                        value: !0,
                        disabled: P.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[12] || (v[12] = I(" Any component ", -1))
                    ], 8, Br),
                    l("label", {
                      class: "ks-runas-component-option",
                      for: `${i(K)}-one`
                    }, [
                      m(i(Kt), {
                        modelValue: W.value,
                        "onUpdate:modelValue": v[6] || (v[6] = (f) => W.value = f),
                        "input-id": `${i(K)}-one`,
                        name: i(K),
                        value: !1,
                        disabled: P.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[13] || (v[13] = I(" One component ", -1))
                    ], 8, Ir)
                  ]),
                  v[15] || (v[15] = l("small", { class: "km-field-help" }, "The person choosing the account must also be able to manage the component.", -1))
                ]),
                W.value ? y("", !0) : (a(), $(Ft, {
                  key: 0,
                  class: "ks-runas-component",
                  tag: "wc-component-picker",
                  attrs: { source: "/api/v1/security/delegations/roots", title: "Component", placeholder: "Choose a component you manage…" },
                  config: G.value ? { thread_id: G.value } : {},
                  onChange: it,
                  onError: st
                }, null, 8, ["config"]))
              ])
            ])
          ], 8, wr),
          l("div", Tr, [
            m(i(Q), {
              variant: "ghost",
              small: "",
              disabled: P.value,
              onClick: v[7] || (v[7] = (f) => s.value = !1)
            }, {
              default: C(() => [...v[16] || (v[16] = [
                I("Cancel", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            m(i(Q), {
              variant: "primary",
              small: "",
              icon: "tabler:device-floppy",
              disabled: !E.value || P.value,
              loading: i(h),
              onClick: dt
            }, {
              default: C(() => [...v[17] || (v[17] = [
                I("Save permission", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)) : y("", !0),
        i(B) && !i(h) ? (a(), c("div", Pr, [
          v[19] || (v[19] = l("span", null, "We could not confirm whether the permission changed. Select Retry to check before making another change.", -1)),
          m(i(Q), {
            small: "",
            onClick: i(o).submit
          }, {
            default: C(() => [...v[18] || (v[18] = [
              I("Retry", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ])) : y("", !0),
        j.value.length ? (a(), $(i(Q), {
          key: 4,
          class: "ks-runas-history",
          variant: "ghost",
          small: "",
          "aria-expanded": S.value,
          onClick: v[8] || (v[8] = (f) => S.value = !S.value)
        }, {
          default: C(() => [
            I(x(S.value ? "Hide revoked permissions" : "Show revoked permissions"), 1)
          ]),
          _: 1
        }, 8, ["aria-expanded"])) : y("", !0),
        i(r) && !i(u).length ? (a(), $(i(fn), {
          key: 5,
          label: "Loading run-as permissions…"
        })) : L.value.length ? (a(), c("div", Ar, [
          (a(!0), c(et, null, ot(L.value, (f) => (a(), c("article", {
            key: f.policy_id,
            class: X(["kx-card ks-runas-grant", { revoked: !f.active }])
          }, [
            m(i(O), {
              class: "ks-runas-grant-icon",
              icon: "tabler:user-shield",
              "aria-hidden": "true"
            }),
            l("div", zr, [
              l("div", Lr, [
                f.active ? (a(), c("span", _r, x(f.groups.map((J) => q.value[J] || "Group unavailable").join(", ")), 1)) : y("", !0),
                l("span", Nr, x(f.active ? "can run as" : "Permission to run as"), 1),
                l("span", Fr, x(tt.value[f.principal.id] || "Account unavailable"), 1)
              ]),
              l("div", Vr, [
                f.root === "*" ? (a(), c("span", Or, "on any component they manage")) : f.root_label ? (a(), c("span", Rr, [
                  v[20] || (v[20] = I("on ", -1)),
                  l("b", null, x(f.root_label), 1)
                ])) : (a(), c("span", Er, "on an unavailable component"))
              ])
            ]),
            f.active ? (a(), $(i(Q), {
              key: 1,
              variant: "ghost",
              small: "",
              icon: "tabler:user-off",
              disabled: P.value,
              "aria-label": `Revoke run-as permission for ${tt.value[f.principal.id] || "Account unavailable"}`,
              onClick: (J) => Lt(f)
            }, {
              default: C(() => [...v[22] || (v[22] = [
                I("Revoke", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])) : (a(), $(i(Tt), {
              key: 0,
              severity: "secondary"
            }, {
              default: C(() => [...v[21] || (v[21] = [
                I("revoked", -1)
              ])]),
              _: 1
            }))
          ], 2))), 128))
        ])) : !i(w) && !s.value ? (a(), $(i(hn), {
          key: 7,
          icon: "tabler:user-shield",
          title: "No active run-as permissions"
        }, {
          hint: C(() => [...v[23] || (v[23] = [
            I("Without an active permission, the Run as setting offers only ", -1),
            l("b", null, "Me", -1),
            I(".", -1)
          ])]),
          _: 1
        })) : y("", !0)
      ])
    ]));
  }
}), Dr = ["draggable"], Kr = { class: "ks-pcard-row" }, Ur = { class: "ks-pcard-body" }, Mr = { class: "ks-pcard-head" }, Wr = ["title"], Hr = {
  key: 0,
  class: "ks-pcard-comment"
}, Gr = {
  key: 1,
  class: "ks-pcard-comment"
}, qr = ["aria-label"], Zr = ["aria-label"], pt = /* @__PURE__ */ D({
  __name: "PolicyCard",
  props: {
    policy: {},
    mode: {}
  },
  emits: ["add", "remove"],
  setup(t, { emit: n }) {
    const e = t, o = n, u = F(() => e.policy.available === !1 ? e.policy.id : e.policy.title && e.policy.title !== e.policy.id ? e.policy.title : "Unnamed permission");
    function r(h) {
      e.mode === "locked" || !h.dataTransfer || (h.dataTransfer.setData("text/plain", e.policy.id), h.dataTransfer.effectAllowed = e.mode === "palette" ? "copy" : "move");
    }
    return (h, w) => (a(), c("div", {
      class: X(["kx-card ks-pcard", t.mode]),
      draggable: t.mode !== "locked",
      onDragstart: r,
      onDblclick: w[2] || (w[2] = (A) => t.mode === "palette" && o("add"))
    }, [
      l("div", Kr, [
        t.mode === "locked" ? (a(), $(i(O), {
          key: 0,
          icon: "tabler:lock",
          class: "ks-pcard-grip locked",
          "aria-hidden": "true"
        })) : (a(), $(i(O), {
          key: 1,
          icon: "tabler:grip-vertical",
          class: "ks-pcard-grip",
          "aria-hidden": "true"
        })),
        l("div", Ur, [
          l("div", Mr, [
            t.policy.effect === "allow" || t.policy.effect === "deny" ? (a(), $(Tt, {
              key: 0,
              severity: t.policy.effect === "allow" ? "success" : "danger"
            }, {
              default: C(() => [
                I(x(t.policy.effect === "deny" ? "Blocks" : "Allows"), 1)
              ]),
              _: 1
            }, 8, ["severity"])) : y("", !0),
            l("span", {
              class: "ks-pcard-title",
              title: u.value
            }, x(u.value), 9, Wr)
          ]),
          t.policy.available === !1 ? (a(), c("div", Hr, "No longer available")) : t.policy.comment ? (a(), c("div", Gr, x(t.policy.comment), 1)) : y("", !0)
        ]),
        t.mode === "palette" ? (a(), c("button", {
          key: 2,
          class: "ks-pcard-act add",
          "aria-label": `Add permission ${u.value}`,
          onClick: w[0] || (w[0] = ft((A) => o("add"), ["stop"]))
        }, [
          m(i(O), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ], 8, qr)) : t.mode === "selected" ? (a(), c("button", {
          key: 3,
          class: "ks-pcard-act remove",
          "aria-label": `Remove permission ${u.value}`,
          onClick: w[1] || (w[1] = ft((A) => o("remove"), ["stop"]))
        }, [
          m(i(O), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ], 8, Zr)) : y("", !0)
      ])
    ], 42, Dr));
  }
}), Jr = { class: "ks" }, Qr = { class: "ks-rail-search" }, Xr = { class: "ks-rail-list" }, Yr = {
  key: 0,
  class: "ks-rail-group"
}, ta = ["onClick"], na = { class: "ks-scope-name" }, ea = ["onClick"], oa = { class: "ks-scope-name" }, ra = {
  key: 0,
  class: "ks-builder"
}, aa = { class: "ks-builder-head" }, ia = { class: "ks-builder-title" }, la = { class: "ks-builder-acts" }, sa = {
  key: 0,
  class: "ks-overlay-warn"
}, da = {
  key: 1,
  class: "ks-view-note"
}, ua = { class: "ks-fields" }, ca = {
  key: 0,
  class: "ks-pane locked-pane"
}, ba = { class: "ks-pane-head" }, pa = { class: "ks-pane-sub" }, va = { class: "ks-pane-body" }, fa = {
  key: 0,
  class: "ks-pane-empty"
}, ha = { class: "ks-pane" }, ga = { class: "ks-pane-search" }, ma = { class: "ks-pane-body" }, ya = {
  key: 0,
  class: "ks-pane-empty"
}, ka = { class: "ks-pane-head" }, $a = { class: "ks-pane-sub" }, wa = { class: "ks-pane-body" }, xa = ["onDrop"], Ca = {
  key: 0,
  class: "ks-drop-hint"
}, Sa = {
  key: 1,
  class: "ks-view"
}, Ba = { class: "ks-builder-head" }, Ia = { class: "ks-builder-title" }, Ta = { class: "ks-builder-acts" }, Pa = { class: "ks-pane-body ks-view-list" }, Aa = {
  key: 0,
  class: "ks-pane-empty"
}, za = {
  key: 0,
  class: "ks-ext-block"
}, La = { class: "ks-ext-head" }, _a = { class: "ks-pane-body ks-view-list" }, Na = {
  key: 2,
  class: "kx-system-body"
}, Fa = /* @__PURE__ */ D({
  __name: "Security",
  setup(t) {
    const n = br(), { scopes: e, policies: o, loading: u, saving: r, error: h } = n, w = z(""), A = z(""), B = z(null), s = z(null), S = z("scopes"), R = z(null), G = z(!1);
    async function W(p) {
      S.value = String(p), p === "delegations" && (G.value = !0, await nn(), await R.value?.load());
    }
    Bn(async () => {
      await n.load(), S.value === "delegations" && await R.value?.load();
    });
    const K = F(() => {
      const p = w.value.trim().toLowerCase(), d = (b) => !p || b.label.toLowerCase().includes(p) || b.id.toLowerCase().includes(p);
      return {
        custom: e.value.filter((b) => b.source === "custom" && d(b)),
        builtin: e.value.filter((b) => b.source !== "custom" && d(b))
      };
    }), V = F(() => e.value.find((p) => p.id === B.value) || null), P = F(() => V.value && V.value.source !== "custom" ? V.value : null), E = F(() => !!s.value?.target), q = F(() => E.value ? P.value?.policies ?? [] : []), tt = F(() => {
      const p = /* @__PURE__ */ new Map();
      for (const d of e.value)
        for (const b of [...d.policies, ...d.overlay_policies ?? []])
          b.available !== !1 && p.set(b.id, b);
      for (const d of o.value) p.set(d.id, d);
      return p;
    }), g = F(() => (s.value?.policyIds ?? []).map((p) => tt.value.get(p) ?? { id: p, available: !1 })), j = F(() => {
      if (!s.value) return [];
      const p = /* @__PURE__ */ new Set([...s.value.policyIds, ...q.value.map((b) => b.id)]), d = A.value.trim().toLowerCase();
      return o.value.filter((b) => !p.has(b.id) && (!d || (b.title || "").toLowerCase().includes(d) || b.id.toLowerCase().includes(d) || (b.comment || "").toLowerCase().includes(d)));
    });
    function L(p) {
      B.value = p.id, s.value = p.source === "custom" ? { slug: p.slug || "", label: p.label, description: p.description, policyIds: p.policies.map((d) => d.id), enabled: p.enabled, isNew: !1, target: "" } : null;
    }
    function _() {
      B.value = null, s.value = { slug: Array.from(crypto.getRandomValues(new Uint8Array(16)), (p) => p.toString(16).padStart(2, "0")).join(""), label: "", description: "", policyIds: [], enabled: !0, isNew: !0, target: "" };
    }
    function it(p) {
      _(), Object.assign(s.value, {
        label: p.label ? `Copy of ${p.label}` : "",
        description: p.description,
        policyIds: [...p.policies, ...p.overlay_policies ?? []].filter((d) => d.available !== !1).map((d) => d.id)
      });
    }
    function st(p) {
      return p.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
    }
    function zt(p) {
      B.value = p.id, s.value = {
        slug: p.overlay_slug || st(p.id),
        label: p.label || ut(p.id),
        description: p.description,
        policyIds: (p.overlay_policies ?? []).map((d) => d.id),
        enabled: !0,
        isNew: !p.overlay_slug,
        target: p.id
      };
    }
    function dt(p, d) {
      !s.value || s.value.policyIds.includes(p) || q.value.some((b) => b.id === p) || o.value.some((b) => b.id === p) && s.value.policyIds.splice(d ?? s.value.policyIds.length, 0, p);
    }
    function Lt(p) {
      s.value && (s.value.policyIds = s.value.policyIds.filter((d) => d !== p));
    }
    function T(p) {
      const d = p.dataTransfer?.getData("text/plain");
      d && dt(d);
    }
    function v(p, d) {
      p.stopPropagation();
      const b = p.dataTransfer?.getData("text/plain");
      if (!b || !s.value || b === d) return;
      const H = s.value.policyIds, _t = H.indexOf(b);
      if (_t === -1) {
        dt(b, H.indexOf(d));
        return;
      }
      H.splice(_t, 1), H.splice(H.indexOf(d), 0, b);
    }
    const f = F(() => s.value ? !s.value.isNew || s.value.target ? s.value.slug : `${st(s.value.label.normalize("NFKD").replace(/\p{M}/gu, "")).toLowerCase() || "role"}_${s.value.slug}` : ""), J = F(() => !!s.value && s.value.label.trim() !== "" && (!s.value.isNew || s.value.policyIds.length > 0)), U = z("");
    let bt = null;
    _n(() => {
      bt && clearTimeout(bt);
    });
    function yn(p) {
      U.value = p, bt && clearTimeout(bt), bt = setTimeout(() => {
        U.value = "";
      }, 3e3);
    }
    async function kn() {
      if (!s.value || !J.value) return;
      const p = s.value, d = f.value, b = s.value.target, H = s.value.label.trim() || d;
      await n.saveScope({
        slug: d,
        target: b,
        label: s.value.label.trim(),
        description: s.value.description.trim(),
        policies: [...s.value.policyIds],
        enabled: s.value.enabled
      }) && (p.slug = d, p.isNew = !1, s.value === p && (B.value = b || `kickside.security.scopes:${d}`), yn(`Saved “${H}”. The role will be available when assigning users.`));
    }
    async function $n() {
      if (!s.value || s.value.isNew) return;
      const p = E.value;
      if (!await en.confirm({
        header: p ? "Remove extension?" : "Delete role?",
        message: p ? "This removes the added permissions. Users keep the role’s original permissions." : "This removes the custom role and its permissions.",
        icon: "tabler:trash",
        acceptLabel: p ? "Remove extension" : "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      await n.deleteScope(s.value.slug) && (s.value = null, B.value = null);
    }
    function ut(p) {
      return p.includes(":") ? p.split(":").slice(-1)[0] : p;
    }
    return (p, d) => (a(), c("div", Jr, [
      m(be, {
        value: S.value,
        label: "Security administration",
        items: [
          { value: "scopes", label: "Roles" },
          { value: "delegations", label: "Run as" }
        ],
        "onUpdate:value": W
      }, null, 8, ["value"]),
      G.value ? ct((a(), $(jr, {
        key: 0,
        ref_key: "delegationPanel",
        ref: R,
        scopes: i(e)
      }, null, 8, ["scopes"])), [
        [Zt, S.value === "delegations"]
      ]) : y("", !0),
      i(h) ? (a(), $(i(Pt), {
        key: 1,
        severity: "danger",
        class: "ks-top-notice",
        onDismiss: d[0] || (d[0] = (b) => h.value = "")
      }, {
        default: C(() => [
          I(x(i(h)), 1)
        ]),
        _: 1
      })) : U.value ? (a(), $(i(Pt), {
        key: 2,
        severity: "success",
        class: "ks-top-notice",
        onDismiss: d[1] || (d[1] = (b) => U.value = "")
      }, {
        default: C(() => [
          I(x(U.value), 1)
        ]),
        _: 1
      })) : y("", !0),
      S.value === "scopes" && i(u) && !i(e).length ? (a(), $(i(fn), {
        key: 3,
        label: "Loading security…"
      })) : ct((a(), $(i(he), { key: 4 }, {
        rail: C(() => [
          m(i($e), {
            title: "Roles",
            count: i(e).length
          }, {
            actions: C(() => [
              m(i(Bt), {
                icon: "tabler:plus",
                label: "New role",
                disabled: i(r),
                onClick: _
              }, null, 8, ["disabled"]),
              m(i(Bt), {
                icon: "tabler:refresh",
                label: "Refresh",
                disabled: i(u),
                spin: i(u),
                onClick: i(n).load
              }, null, 8, ["disabled", "spin", "onClick"])
            ]),
            _: 1
          }, 8, ["count"]),
          l("div", Qr, [
            m(i(Qt), {
              modelValue: w.value,
              "onUpdate:modelValue": d[2] || (d[2] = (b) => w.value = b),
              placeholder: "Find a role…"
            }, null, 8, ["modelValue"])
          ]),
          l("div", Xr, [
            K.value.custom.length ? (a(), c("div", Yr, "Custom")) : y("", !0),
            (a(!0), c(et, null, ot(K.value.custom, (b) => (a(), c("button", {
              key: b.id,
              class: X(["ks-scope-row", { active: b.id === B.value }]),
              onClick: (H) => L(b)
            }, [
              l("span", na, x(b.label || ut(b.id)), 1)
            ], 10, ta))), 128)),
            d[11] || (d[11] = l("div", { class: "ks-rail-group" }, "Default", -1)),
            (a(!0), c(et, null, ot(K.value.builtin, (b) => (a(), c("button", {
              key: b.id,
              class: X(["ks-scope-row", { active: b.id === B.value }]),
              onClick: (H) => L(b)
            }, [
              l("span", oa, x(b.label || ut(b.id)), 1)
            ], 10, ea))), 128))
          ])
        ]),
        default: C(() => [
          s.value ? (a(), c("div", ra, [
            l("div", aa, [
              l("div", ia, [
                m(i(O), {
                  icon: E.value ? "tabler:stack-2" : "tabler:shield-lock",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                l("span", null, x(E.value ? `Extend ${s.value.label || ut(s.value.target)}` : s.value.isNew ? "New role" : s.value.label || s.value.slug), 1),
                E.value ? (a(), $(i(Tt), {
                  key: 0,
                  severity: "warn"
                }, {
                  default: C(() => [...d[12] || (d[12] = [
                    I("Additional permissions", -1)
                  ])]),
                  _: 1
                })) : y("", !0)
              ]),
              l("div", la, [
                !s.value.isNew && !E.value && V.value ? (a(), $(i(Q), {
                  key: 0,
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  disabled: i(r),
                  onClick: d[3] || (d[3] = (b) => it(V.value))
                }, {
                  default: C(() => [...d[13] || (d[13] = [
                    I("Duplicate", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : y("", !0),
                s.value.isNew ? y("", !0) : (a(), $(i(Q), {
                  key: 1,
                  variant: "danger",
                  small: "",
                  icon: "tabler:trash",
                  disabled: i(r),
                  onClick: $n
                }, {
                  default: C(() => [
                    I(x(E.value ? "Remove extension" : "Delete"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])),
                m(i(Q), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:device-floppy",
                  loading: i(r),
                  disabled: !J.value,
                  onClick: kn
                }, {
                  default: C(() => [
                    I(x(E.value ? "Save extension" : "Save role"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            E.value ? (a(), c("div", sa, [
              m(i(O), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              l("span", null, [
                d[14] || (d[14] = I("Adding permissions grants them to ", -1)),
                l("b", null, "everyone assigned " + x(V.value?.label || ut(s.value.target)), 1),
                d[15] || (d[15] = I(". Original permissions cannot be removed here. To restrict access, create a new role with only the permissions needed.", -1))
              ])
            ])) : (a(), c("p", da, "Choose the permissions this role grants, then assign it in System → Users. To restrict a Member, assign this role instead of Member; other assigned roles may still grant access.")),
            l("div", ua, [
              m(i(It), { label: "Name" }, {
                default: C(() => [
                  m(i(Xt), {
                    modelValue: s.value.label,
                    "onUpdate:modelValue": d[4] || (d[4] = (b) => s.value.label = b),
                    placeholder: "Reviewer"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              m(i(It), { label: "Description" }, {
                default: C(() => [
                  m(i(Xt), {
                    modelValue: s.value.description,
                    "onUpdate:modelValue": d[5] || (d[5] = (b) => s.value.description = b),
                    placeholder: "Read-only reviewer role"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            l("div", {
              class: X(["ks-panes", { three: E.value }])
            }, [
              E.value ? (a(), c("section", ca, [
                l("header", ba, [
                  d[16] || (d[16] = l("span", null, "Original permissions", -1)),
                  l("span", pa, x(q.value.length) + " · locked", 1)
                ]),
                l("div", va, [
                  (a(!0), c(et, null, ot(q.value, (b) => (a(), $(pt, {
                    key: b.id,
                    policy: b,
                    mode: "locked"
                  }, null, 8, ["policy"]))), 128)),
                  q.value.length ? y("", !0) : (a(), c("div", fa, "No original permissions."))
                ])
              ])) : y("", !0),
              l("section", ha, [
                d[17] || (d[17] = l("header", { class: "ks-pane-head" }, [
                  l("span", null, "Available permissions"),
                  l("span", { class: "ks-pane-sub" }, "Click + to add")
                ], -1)),
                l("div", ga, [
                  m(i(Qt), {
                    modelValue: A.value,
                    "onUpdate:modelValue": d[6] || (d[6] = (b) => A.value = b),
                    placeholder: "Search permissions…"
                  }, null, 8, ["modelValue"])
                ]),
                l("div", ma, [
                  (a(!0), c(et, null, ot(j.value, (b) => (a(), $(pt, {
                    key: b.id,
                    policy: b,
                    mode: "palette",
                    onAdd: (H) => dt(b.id)
                  }, null, 8, ["policy", "onAdd"]))), 128)),
                  j.value.length ? y("", !0) : (a(), c("div", ya, "No matching permissions."))
                ])
              ]),
              l("section", {
                class: "ks-pane drop",
                onDragover: d[8] || (d[8] = ft(() => {
                }, ["prevent"])),
                onDrop: T
              }, [
                l("header", ka, [
                  l("span", null, x(E.value ? "Added by you" : "In this role"), 1),
                  l("span", $a, x(g.value.length) + " " + x(g.value.length === 1 ? "permission" : "permissions"), 1)
                ]),
                l("div", wa, [
                  (a(!0), c(et, null, ot(g.value, (b) => (a(), c("div", {
                    key: b.id,
                    onDragover: d[7] || (d[7] = ft(() => {
                    }, ["prevent"])),
                    onDrop: (H) => v(H, b.id)
                  }, [
                    m(pt, {
                      policy: b,
                      mode: "selected",
                      onRemove: (H) => Lt(b.id)
                    }, null, 8, ["policy", "onRemove"])
                  ], 40, xa))), 128)),
                  g.value.length ? y("", !0) : (a(), c("div", Ca, [
                    m(i(O), {
                      icon: "tabler:drag-drop",
                      "aria-hidden": "true"
                    }),
                    d[18] || (d[18] = l("span", null, "Use + on an available permission, or drag it here.", -1))
                  ]))
                ])
              ], 32)
            ], 2)
          ])) : P.value ? (a(), c("div", Sa, [
            l("div", Ba, [
              l("div", Ia, [
                m(i(O), {
                  icon: "tabler:shield",
                  "aria-hidden": "true"
                }),
                l("span", null, x(P.value.label || ut(P.value.id)), 1)
              ]),
              l("div", Ta, [
                m(i(Q), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:stack-2",
                  onClick: d[9] || (d[9] = (b) => zt(P.value))
                }, {
                  default: C(() => [
                    I(x(P.value.overlay_slug ? "Edit extension" : "Add permissions"), 1)
                  ]),
                  _: 1
                }),
                m(i(Q), {
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  onClick: d[10] || (d[10] = (b) => it(P.value))
                }, {
                  default: C(() => [...d[19] || (d[19] = [
                    I("Copy role", -1)
                  ])]),
                  _: 1
                })
              ])
            ]),
            d[21] || (d[21] = l("p", { class: "ks-view-note" }, " Included with the application. Adding permissions affects everyone with this role. For restricted access, create a new role with only the permissions needed and assign it in System → Users instead of this role. Other assigned roles may still grant access. ", -1)),
            l("div", Pa, [
              (a(!0), c(et, null, ot(P.value.policies, (b) => (a(), $(pt, {
                key: b.id,
                policy: b,
                mode: "locked"
              }, null, 8, ["policy"]))), 128)),
              P.value.policies.length ? y("", !0) : (a(), c("div", Aa, "No permissions in this role."))
            ]),
            P.value.overlay_policies && P.value.overlay_policies.length ? (a(), c("div", za, [
              l("div", La, [
                m(i(O), {
                  icon: "tabler:stack-2",
                  "aria-hidden": "true"
                }),
                d[20] || (d[20] = l("span", null, "Additional permissions", -1)),
                m(i(Tt), { severity: "warn" }, {
                  default: C(() => [
                    I(x(P.value.overlay_policies.length), 1)
                  ]),
                  _: 1
                })
              ]),
              l("div", _a, [
                (a(!0), c(et, null, ot(P.value.overlay_policies, (b) => (a(), $(pt, {
                  key: b.id,
                  policy: b,
                  mode: "locked"
                }, null, 8, ["policy"]))), 128))
              ])
            ])) : y("", !0)
          ])) : (a(), c("div", Na, [
            m(i(hn), {
              icon: "tabler:shield-lock",
              title: "Roles",
              hint: "Choose a role to view its permissions, or create one with the permissions your team needs. Assign roles in System → Users.",
              cta: "New role",
              "cta-icon": "tabler:plus",
              onCta: _
            })
          ]))
        ]),
        _: 1
      }, 512)), [
        [Zt, S.value === "scopes"]
      ])
    ]));
  }
}), ja = {
  rootComponent: Fa,
  plugins: [In]
};
export {
  ja as mountConfig
};
//# sourceMappingURL=lazy-mount-CMtHzOvV.js.map
