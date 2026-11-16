import { B as J, R as Kt, s as Y, f as rt, k as Yt, b as wn, Q as xt, z as St, a as At, c as _t, T as xn, C as Cn, K as Ct, v as Sn, V as Gt, l as tn, d as Ft, e as Bn, P as Tn } from "./wc-runtime-E4NYBaIN.js";
import { mergeProps as k, resolveDirective as Ut, withDirectives as ut, openBlock as a, createBlock as $, resolveDynamicComponent as lt, withCtx as C, renderSlot as _, normalizeClass as X, createElementBlock as u, createElementVNode as s, createCommentVNode as y, defineComponent as D, unref as i, createVNode as m, Fragment as et, renderList as ot, createTextVNode as T, toDisplayString as x, resolveComponent as qt, getCurrentInstance as Pn, computed as F, createSlots as In, ref as A, onMounted as An, watch as Vt, onBeforeUnmount as zn, nextTick as nn, useId as Ln, withModifiers as pt, onUnmounted as _n, vShow as Zt } from "vue";
import { Icon as V } from "@iconify/vue";
import { loadByTagName as Nn, api as it, host as en } from "@wippy-fe/proxy";
var Fn = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-tab", {
      "p-tab-active": e.active,
      "p-disabled": o.disabled
    }];
  }
}, Vn = J.extend({
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
    ripple: Kt
  }
};
function Rn(t, n, e, o, d, r) {
  var h = Ut("ripple");
  return t.asChild ? _(t.$slots, "default", {
    key: 1,
    dataP: r.dataP,
    class: X(t.cx("root")),
    active: r.active,
    a11yAttrs: r.a11yAttrs,
    onClick: r.onClick
  }) : ut((a(), $(lt(t.as), k({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP,
    onClick: r.onClick
  }, r.attrs), {
    default: C(function() {
      return [_(t.$slots, "default")];
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
    if (typeof t == "string") return Ot(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Ot(t, n) : void 0;
  }
}
function Kn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Un(t) {
  if (Array.isArray(t)) return Ot(t);
}
function Ot(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Mn(t, n, e, o, d, r) {
  return a(), u("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), En(n[0] || (n[0] = [s("path", {
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
    if (typeof t == "string") return Rt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Rt(t, n) : void 0;
  }
}
function qn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Zn(t) {
  if (Array.isArray(t)) return Rt(t);
}
function Rt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Jn(t, n, e, o, d, r) {
  return a(), u("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Wn(n[0] || (n[0] = [s("path", {
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
}, Xn = J.extend({
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
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = _t(n) - e, d = Math.abs(n.scrollLeft), r = o * 0.8, h = d - r, w = Math.max(h, 0);
      n.scrollLeft = Gt(n) ? -1 * w : w;
    },
    onNextButtonClick: function() {
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = _t(n) - e, d = Math.abs(n.scrollLeft), r = o * 0.8, h = d + r, w = n.scrollWidth - o, I = Math.min(h, w);
      n.scrollLeft = Gt(n) ? -1 * I : I;
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
      var n = this.$refs, e = n.content, o = n.inkbar, d = n.tabs;
      if (o) {
        var r = St(e, '[data-pc-name="tab"][data-p-active="true"]');
        this.$pcTabs.isVertical() ? (o.style.height = Cn(r) + "px", o.style.top = Ct(r).top - Ct(d).top + "px") : (o.style.width = Sn(r) + "px", o.style.left = Ct(r).left - Ct(d).left + "px");
      }
    },
    updateButtonState: function() {
      var n = this.$refs, e = n.list, o = n.content, d = o.scrollTop, r = o.scrollWidth, h = o.scrollHeight, w = o.offsetWidth, I = o.offsetHeight, B = Math.abs(o.scrollLeft), l = [_t(o), xn(o)], S = l[0], O = l[1];
      this.$pcTabs.isVertical() ? (this.isPrevButtonEnabled = d !== 0, this.isNextButtonEnabled = e.offsetHeight >= I && parseInt(d) !== h - O) : (this.isPrevButtonEnabled = B !== 0, this.isNextButtonEnabled = e.offsetWidth >= w && parseInt(B) !== r - S);
    },
    getVisibleButtonWidths: function() {
      var n = this.$refs, e = n.prevButton, o = n.nextButton, d = 0;
      return this.showNavigators && (d = (e?.offsetWidth || 0) + (o?.offsetWidth || 0)), d;
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
    ripple: Kt
  }
}, te = ["data-p"], ne = ["aria-label", "tabindex"], ee = ["data-p"], oe = ["aria-orientation"], re = ["aria-label", "tabindex"];
function ae(t, n, e, o, d, r) {
  var h = Ut("ripple");
  return a(), u("div", k({
    ref: "list",
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [r.showNavigators && d.isPrevButtonEnabled ? ut((a(), u("button", k({
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
  }, t.ptm("prevIcon")), null, 16))], 16, ne)), [[h]]) : y("", !0), s("div", k({
    ref: "content",
    class: t.cx("content"),
    onScroll: n[1] || (n[1] = function() {
      return r.onScroll && r.onScroll.apply(r, arguments);
    }),
    "data-p": r.dataP
  }, t.ptm("content")), [s("div", k({
    ref: "tabs",
    class: t.cx("tabList"),
    role: "tablist",
    "aria-orientation": r.$pcTabs.orientation || "horizontal"
  }, t.ptm("tabList")), [_(t.$slots, "default"), s("span", k({
    ref: "inkbar",
    class: t.cx("activeBar"),
    role: "presentation",
    "aria-hidden": "true"
  }, t.ptm("activeBar")), null, 16)], 16, oe)], 16, ee), r.showNavigators && d.isNextButtonEnabled ? ut((a(), u("button", k({
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
}, se = J.extend({
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
function ue(t, n, e, o, d, r) {
  return a(), u("div", k({
    class: t.cx("root")
  }, t.ptmi("root")), [_(t.$slots, "default")], 16);
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
            (a(!0), u(et, null, ot(t.items, (o) => (a(), $(i(on), k({
              key: o.value,
              value: o.value
            }, { ref_for: !0 }, o.controls ? { "aria-controls": o.controls } : {}), {
              default: C(() => [
                T(x(o.label), 1),
                o.count !== void 0 ? (a(), u("b", ce, x(o.count), 1)) : y("", !0)
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
    return (n, e) => (a(), u("div", pe, [
      s("aside", ve, [
        _(n.$slots, "rail")
      ]),
      s("main", fe, [
        _(n.$slots, "default")
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
    return (n, e) => (a(), u("div", ge, [
      s("span", me, [
        T(x(t.title), 1),
        t.count !== void 0 ? (a(), u("b", ye, x(t.count), 1)) : y("", !0)
      ]),
      s("div", ke, [
        _(n.$slots, "actions")
      ])
    ]));
  }
});
var Mt = {
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
    if (typeof t == "string") return Et(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Et(t, n) : void 0;
  }
}
function Se(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Be(t) {
  if (Array.isArray(t)) return Et(t);
}
function Et(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Te(t, n, e, o, d, r) {
  return a(), u("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), we(n[0] || (n[0] = [s("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Mt.render = Te;
var Pe = `
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
`, Ie = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Ft(e.value) && String(e.value).length === 1,
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
}, Ae = J.extend({
  name: "badge",
  style: Pe,
  classes: Ie
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
function vt(t) {
  "@babel/helpers - typeof";
  return vt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, vt(t);
}
function Jt(t, n, e) {
  return (n = Le(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Le(t) {
  var n = _e(t, "string");
  return vt(n) == "symbol" ? n : n + "";
}
function _e(t, n) {
  if (vt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (vt(o) != "object") return o;
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
function Fe(t, n, e, o, d, r) {
  return a(), u("span", k({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [_(t.$slots, "default", {}, function() {
    return [T(x(t.value), 1)];
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
function ft(t) {
  "@babel/helpers - typeof";
  return ft = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, ft(t);
}
function nt(t, n, e) {
  return (n = Oe(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Oe(t) {
  var n = Re(t, "string");
  return ft(n) == "symbol" ? n : n + "";
}
function Re(t, n) {
  if (ft(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (ft(o) != "object") return o;
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
}, je = J.extend({
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
function ht(t) {
  "@babel/helpers - typeof";
  return ht = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, ht(t);
}
function W(t, n, e) {
  return (n = Ke(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ke(t) {
  var n = Ue(t, "string");
  return ht(n) == "symbol" ? n : n + "";
}
function Ue(t, n) {
  if (ht(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (ht(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var kt = {
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
      return rt(W(W(W(W(W(W(W(W(W(W({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return rt(W(W({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return rt(W(W({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Mt,
    Badge: dn
  },
  directives: {
    ripple: Kt
  }
}, Me = ["data-p"], We = ["data-p"];
function He(t, n, e, o, d, r) {
  var h = qt("SpinnerIcon"), w = qt("Badge"), I = Ut("ripple");
  return t.asChild ? _(t.$slots, "default", {
    key: 1,
    class: X(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : ut((a(), $(lt(t.as), k({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: C(function() {
      return [_(t.$slots, "default", {}, function() {
        return [t.loading ? _(t.$slots, "loadingicon", k({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (a(), u("span", k({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (a(), $(h, k({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : _(t.$slots, "icon", k({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (a(), u("span", k({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, Me)) : y("", !0)];
        }), t.label ? (a(), u("span", k({
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
  }, 16, ["class", "data-p"])), [[I]]);
}
kt.render = He;
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
    const e = t, o = n, d = Pn(), r = F(
      () => Object.prototype.hasOwnProperty.call(d?.vnode.props ?? {}, "active")
    ), h = F(
      () => e.variant === "danger" ? "danger" : e.variant === "bordered" ? "secondary" : void 0
    ), w = F(
      () => e.size === "sm" ? "small" : e.size === "lg" ? "large" : void 0
    );
    return (I, B) => (a(), $(i(kt), {
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
      onClick: B[0] || (B[0] = (l) => o("click"))
    }, {
      icon: C(() => [
        m(i(V), {
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
    const e = t, o = n, d = F(
      () => e.variant === "danger" ? "danger" : e.variant === "primary" ? void 0 : "secondary"
    );
    return (r, h) => (a(), $(i(kt), {
      type: t.type,
      severity: d.value,
      outlined: t.variant === "ghost",
      loading: t.loading,
      disabled: t.disabled || t.loading,
      size: t.small ? "small" : void 0,
      onClick: h[0] || (h[0] = (w) => o("click"))
    }, {
      default: C(() => [
        t.loading ? (a(), $(i(Mt), {
          key: 0,
          class: "p-button-loading-icon p-button-icon",
          spin: ""
        })) : y("", !0),
        t.icon && !t.loading ? (a(), $(i(V), {
          key: 1,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        _(r.$slots, "default")
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
      var o, d;
      this.controlled && (this.d_value = n, this.$emit("update:modelValue", n)), this.$emit("value-change", n), (o = (d = this.formField).onChange) === null || o === void 0 || o.call(d, {
        originalEvent: e,
        value: n
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var n = arguments.length, e = new Array(n), o = 0; o < n; o++)
        e[o] = arguments[o];
      return e.find(Ft);
    }
  },
  computed: {
    $filled: function() {
      return Ft(this.d_value);
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
}, Je = J.extend({
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
function gt(t) {
  "@babel/helpers - typeof";
  return gt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, gt(t);
}
function Xe(t, n, e) {
  return (n = Ye(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ye(t) {
  var n = to(t, "string");
  return gt(n) == "symbol" ? n : n + "";
}
function to(t, n) {
  if (gt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (gt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Wt = {
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
function eo(t, n, e, o, d, r) {
  return a(), u("input", k({
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
Wt.render = eo;
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
}, ao = J.extend({
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
function lo(t, n, e, o, d, r) {
  return a(), u("div", k({
    class: t.cx("root")
  }, t.ptmi("root")), [_(t.$slots, "default")], 16);
}
cn.render = lo;
var so = {
  root: "p-inputicon"
}, uo = J.extend({
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
function bo(t, n, e, o, d, r) {
  return a(), u("span", k({
    class: r.containerClass
  }, t.ptmi("root"), {
    "aria-hidden": "true"
  }), [_(t.$slots, "default")], 16);
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
    return (o, d) => (a(), $(i(cn), { class: "km-search" }, {
      default: C(() => [
        m(i(bn), null, {
          default: C(() => [
            m(i(V), {
              icon: "tabler:search",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        m(i(Wt), {
          class: "km-search-input",
          "aria-label": t.placeholder || "Search",
          "model-value": t.modelValue,
          placeholder: t.placeholder || "Search",
          "onUpdate:modelValue": d[0] || (d[0] = (r) => e("update:modelValue", r ?? ""))
        }, null, 8, ["aria-label", "model-value", "placeholder"]),
        t.modelValue ? (a(), $(i(kt), {
          key: 0,
          text: "",
          severity: "secondary",
          class: "km-search-clear",
          "aria-label": "Clear search",
          onClick: d[1] || (d[1] = (r) => e("update:modelValue", ""))
        }, {
          icon: C(() => [
            m(i(V), {
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
}, Tt = /* @__PURE__ */ D({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(t) {
    return (n, e) => (a(), u("label", po, [
      s("span", vo, x(t.label), 1),
      _(n.$slots, "default"),
      t.help ? (a(), u("small", fo, x(t.help), 1)) : y("", !0)
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
    return (o, d) => (a(), $(i(Wt), {
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
      "onUpdate:modelValue": d[0] || (d[0] = (r) => e("update:modelValue", r ?? ""))
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
}, mo = J.extend({
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
function mt(t) {
  "@babel/helpers - typeof";
  return mt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, mt(t);
}
function ko(t, n, e) {
  return (n = $o(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function $o(t) {
  var n = wo(t, "string");
  return mt(n) == "symbol" ? n : n + "";
}
function wo(t, n) {
  if (mt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (mt(o) != "object") return o;
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
function Co(t, n, e, o, d, r) {
  return a(), u("span", k({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (a(), $(lt(t.$slots.icon), k({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), u("span", k({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : y("", !0), t.value != null || t.$slots.default ? _(t.$slots, "default", {
    key: 2
  }, function() {
    return [s("span", k({
      class: t.cx("label")
    }, t.ptm("label")), x(t.value), 17)];
  }) : y("", !0)], 16, xo);
}
pn.render = Co;
const So = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, Pt = /* @__PURE__ */ D({
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
        t.dot ? (a(), u("span", So)) : t.icon ? (a(), $(i(V), {
          key: 1,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        _(n.$slots, "default")
      ]),
      _: 3
    }, 8, ["severity"]));
  }
}), Bo = { class: "km-notice-text" }, It = /* @__PURE__ */ D({
  __name: "Notice",
  props: {
    severity: { default: "info" }
  },
  emits: ["dismiss"],
  setup(t, { emit: n }) {
    const e = n, o = (d) => d === "danger" ? "tabler:alert-triangle" : d === "success" ? "tabler:circle-check" : "tabler:info-circle";
    return (d, r) => (a(), u("div", {
      class: X(["km-notice", `is-${t.severity}`]),
      role: "status"
    }, [
      m(i(V), {
        icon: o(t.severity),
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      s("span", Bo, [
        _(d.$slots, "default")
      ]),
      s("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: r[0] || (r[0] = (h) => e("dismiss"))
      }, [
        m(i(V), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
});
var To = `
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
}, Io = J.extend({
  name: "progressspinner",
  style: To,
  classes: Po
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
  style: Io,
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
function Lo(t, n, e, o, d, r) {
  return a(), u("div", k({
    class: t.cx("root"),
    role: "progressbar"
  }, t.ptmi("root")), [(a(), u("svg", k({
    class: t.cx("spin"),
    viewBox: "25 25 50 50",
    style: r.svgStyle
  }, t.ptm("spin")), [s("circle", k({
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
    return (n, e) => (a(), u("div", _o, [
      m(i(vn), {
        style: { width: "22px", height: "22px", margin: "0" },
        "aria-label": t.label || "Loading"
      }, null, 8, ["aria-label"]),
      t.label ? (a(), u("span", No, x(t.label), 1)) : y("", !0)
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
    return (n, e) => (a(), u("div", Fo, [
      s("div", Vo, [
        m(i(V), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      s("div", Oo, x(t.title), 1),
      t.hint || n.$slots.hint ? (a(), u("p", Ro, [
        _(n.$slots, "hint", {}, () => [
          T(x(t.hint), 1)
        ])
      ])) : y("", !0),
      t.cta ? (a(), $(i(kt), {
        key: 1,
        label: t.cta,
        onClick: e[0] || (e[0] = (o) => n.$emit("cta"))
      }, In({ _: 2 }, [
        t.ctaIcon ? {
          name: "icon",
          fn: C(({ class: o }) => [
            m(i(V), {
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
    if (typeof t == "string") return jt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? jt(t, n) : void 0;
  }
}
function Ko(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Uo(t) {
  if (Array.isArray(t)) return jt(t);
}
function jt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Mo(t, n, e, o, d, r) {
  return a(), u("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Eo(n[0] || (n[0] = [s("path", {
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
}, Go = J.extend({
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
function Qo(t, n, e, o, d, r) {
  return d.visible ? (a(), u("div", k({
    key: 0,
    class: t.cx("root"),
    "aria-label": t.label
  }, t.ptmi("root"), {
    "data-p": r.dataP
  }), [_(t.$slots, "default", {}, function() {
    return [t.image ? (a(), u("img", k({
      key: 0,
      src: t.image
    }, t.ptm("image"), {
      class: t.cx("image")
    }), null, 16, Jo)) : t.$slots.icon ? (a(), $(lt(t.$slots.icon), k({
      key: 1,
      class: t.cx("icon")
    }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), u("span", k({
      key: 2,
      class: [t.cx("icon"), t.icon]
    }, t.ptm("icon")), null, 16)) : y("", !0), t.label !== null ? (a(), u("div", k({
      key: 3,
      class: t.cx("label")
    }, t.ptm("label")), x(t.label), 17)) : y("", !0)];
  }), t.removable ? _(t.$slots, "removeicon", {
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
}, tr = J.extend({
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
function yt(t) {
  "@babel/helpers - typeof";
  return yt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, yt(t);
}
function er(t, n, e) {
  return (n = or(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function or(t) {
  var n = rr(t, "string");
  return yt(n) == "symbol" ? n : n + "";
}
function rr(t, n) {
  if (yt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (yt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Dt = {
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
function dr(t, n, e, o, d, r) {
  return a(), u("div", k({
    class: t.cx("root")
  }, r.getPTOptions("root"), {
    "data-p-checked": r.checked,
    "data-p-disabled": t.disabled,
    "data-p": r.dataP
  }), [s("input", k({
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
  }, r.getPTOptions("input")), null, 16, ir), s("div", k({
    class: t.cx("box")
  }, r.getPTOptions("box"), {
    "data-p": r.dataP
  }), [s("div", k({
    class: t.cx("icon")
  }, r.getPTOptions("icon"), {
    "data-p": r.dataP
  }), null, 16, sr)], 16, lr)], 16, ar);
}
Dt.render = dr;
const ur = { class: "kx-wcmount" }, cr = {
  key: 0,
  class: "kx-wcmount-fail",
  role: "alert"
}, Nt = /* @__PURE__ */ D({
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
    const e = t, o = n, d = A(null), r = A(!1);
    let h = null, w = 0;
    const I = /* @__PURE__ */ new Set();
    function B(g) {
      g.composedPath()[0] === h && (g.stopPropagation(), o("change", g.detail));
    }
    function l(g) {
      return g.composedPath()[0] !== h ? !1 : (g.stopPropagation(), !0);
    }
    function S(g) {
      l(g) && o("select", g.detail);
    }
    function O(g) {
      l(g) && o("created", g.detail);
    }
    function Z(g) {
      l(g) && o("close", g.detail);
    }
    function H(g) {
      l(g) && o("error", g.detail);
    }
    function G(g) {
      if (typeof g == "string") return g;
      try {
        return JSON.stringify(g ?? {});
      } catch {
        return null;
      }
    }
    function j() {
      if (!h) return;
      const g = G(e.config);
      if (g !== null && h.setAttribute("config", g), e.schema !== void 0 && e.schema !== null) {
        const z = G(e.schema);
        z !== null && h.setAttribute("schema", z);
      }
      if (e.meta !== void 0 && e.meta !== null) {
        const z = G(e.meta);
        z !== null && h.setAttribute("meta", z);
      }
      e.provider && h.setAttribute("provider", e.provider), e.label && h.setAttribute("label", e.label);
      const R = e.attrs || {};
      for (const z of [...I])
        (!(z in R) || R[z] == null) && (h.removeAttribute(z), I.delete(z));
      for (const [z, N] of Object.entries(R)) {
        if (N == null) continue;
        const st = typeof N == "object" ? G(N) : String(N);
        st !== null && (h.setAttribute(z, st), I.add(z));
      }
    }
    function L(g = h) {
      g && (g.removeEventListener("config-changed", B), g.removeEventListener("change", B), g.removeEventListener("select", S), g.removeEventListener("created", O), g.removeEventListener("close", Z), g.removeEventListener("error", H), g === h && (h = null), I.clear());
    }
    async function E(g) {
      if (!customElements.get(g))
        try {
          await Nn(g, { timeoutMs: 8e3 });
        } catch {
        }
    }
    async function at() {
      const g = ++w, R = d.value, z = e.tag;
      if (r.value = !1, !!R && (L(), R.innerHTML = "", !!z))
        try {
          if (await E(z), g !== w || d.value !== R || e.tag !== z) return;
          const N = document.createElement(z);
          N.classList.add("kx-wcmount-surface"), h = N, j(), N.addEventListener("config-changed", B), N.addEventListener("change", B), N.addEventListener("select", S), N.addEventListener("created", O), N.addEventListener("close", Z), N.addEventListener("error", H), N.style.display = "block", R.appendChild(N), r.value = !customElements.get(z);
        } catch {
          g === w && (r.value = !0);
        }
    }
    async function tt() {
      r.value = !1, await nn(), await at();
    }
    return An(at), Vt(() => e.tag, at), Vt(() => [e.config, e.schema, e.meta, e.provider, e.label, e.attrs], j, { deep: !0 }), zn(() => {
      w += 1, L();
    }), (g, R) => (a(), u("div", ur, [
      r.value ? (a(), u("div", cr, [
        R[0] || (R[0] = s("span", null, "This setup panel couldn’t load.", -1)),
        s("button", {
          type: "button",
          onClick: tt
        }, "Try again")
      ])) : (a(), u("div", {
        key: 1,
        ref_key: "host",
        ref: d
      }, null, 512))
    ]));
  }
});
function bt(t, n) {
  const e = t?.response?.data ?? t?.data;
  return typeof e?.error == "string" && e.error ? e.error : typeof e?.message == "string" && e.message ? e.message : t instanceof Error ? t.message : n;
}
function br() {
  const t = A([]), n = A([]), e = A(!0), o = A(!1), d = A("");
  let r = 0;
  async function h() {
    const B = ++r;
    e.value = !0, d.value = "";
    try {
      const [l, S] = await Promise.all([
        it.get("/api/v1/security/scopes"),
        it.get("/api/v1/security/policies")
      ]);
      if (B !== r) return;
      t.value = l.data?.scopes ?? [], n.value = S.data?.policies ?? [];
    } catch (l) {
      B === r && (d.value = bt(l, "failed to load security"));
    } finally {
      B === r && (e.value = !1);
    }
  }
  async function w(B) {
    o.value = !0, d.value = "";
    try {
      return await it.post("/api/v1/security/scopes", B), await h(), !0;
    } catch (l) {
      return d.value = bt(l, "failed to save scope"), !1;
    } finally {
      o.value = !1;
    }
  }
  async function I(B) {
    o.value = !0, d.value = "";
    try {
      return await it.delete(`/api/v1/security/scopes?slug=${encodeURIComponent(B)}`), await h(), !0;
    } catch (l) {
      return d.value = bt(l, "failed to delete scope"), !1;
    } finally {
      o.value = !1;
    }
  }
  return { scopes: t, policies: n, loading: e, saving: o, error: d, load: h, saveScope: w, deleteScope: I };
}
function pr() {
  const t = A([]), n = A(!1), e = A(!1), o = A(""), d = A(""), r = A(null);
  let h = 0;
  async function w() {
    const l = ++h;
    n.value = !0, o.value = "";
    try {
      const { data: S } = await it.get("/api/v1/security/delegations");
      if (S?.success !== !0 || !Array.isArray(S.delegations))
        throw new Error(S?.error || "Delegation inventory is unconfirmed");
      l === h && (t.value = S.delegations);
    } catch (S) {
      l === h && (o.value = bt(S, "Could not load run-as permissions"));
    } finally {
      l === h && (n.value = !1);
    }
  }
  async function I() {
    if (!r.value || e.value) return;
    const l = r.value;
    e.value = !0, o.value = "", d.value = "";
    try {
      const { data: S } = l.method === "save" ? await it.post("/api/v1/security/delegations", l.request) : await it.delete("/api/v1/security/delegations", { data: l.request });
      if (S?.success !== !0) throw new Error(S?.error || "Run-as request is unconfirmed");
      r.value = null, d.value = l.method === "save" ? "Run-as permission saved" : "Run-as permission revoked", await w();
    } catch (S) {
      o.value = bt(S, "Could not confirm run-as request");
      const O = S?.response?.status;
      O && O >= 400 && O < 500 && (r.value = null);
    } finally {
      e.value = !1;
    }
  }
  async function B(l, S) {
    r.value || e.value || (r.value = { method: l, request: {
      ...S,
      principal: { ...S.principal },
      ...S.groups ? { groups: [...S.groups].sort() } : {}
    } }, await I());
  }
  return { delegations: t, loading: n, saving: e, error: o, confirmation: d, pending: r, load: w, mutate: B, submit: I };
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
}, Sr = { class: "ks-runas-component-options" }, Br = ["for"], Tr = ["for"], Pr = { class: "ks-runas-form-foot" }, Ir = {
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
    const e = t, o = pr(), { delegations: d, loading: r, saving: h, error: w, confirmation: I, pending: B } = o, l = A(!1), S = A(!1), O = A(""), Z = A(""), H = A(!0), G = Ln(), j = A([]), L = F(() => h.value || !!B.value), E = F(() => !!O.value && j.value.length > 0 && (H.value || !!Z.value)), at = F(() => {
      const P = {};
      for (const v of e.scopes) P[v.id] = v.label || "Group unavailable";
      return P;
    }), tt = A({});
    Vt(d, async (P) => {
      const v = [...new Set(P.map((f) => f.principal.id))].filter((f) => !tt.value[f]);
      if (v.length)
        try {
          const { data: f } = await it.post("/api/v1/principals/resolve", { refs: v.map((U) => ({ type: "user", id: U })) }), M = { ...tt.value };
          for (const U of Array.isArray(f?.principals) ? f.principals : [])
            U && typeof U.id == "string" && typeof U.label == "string" && (M[U.id] = U.label);
          tt.value = M;
        } catch (f) {
          w.value = f && typeof f == "object" && "message" in f ? String(f.message) : "Could not resolve account names";
        }
    });
    const g = F(() => d.value.filter((P) => P.active)), R = F(() => d.value.filter((P) => !P.active)), z = F(() => S.value ? [...g.value, ...R.value] : g.value);
    function N(P, v) {
      if (!P || typeof P != "object") return;
      const f = P;
      L.value || f.type !== v || typeof f.id != "string" || (v === "user" ? O.value = f.id : f.id && !j.value.some((M) => M.id === f.id) && j.value.push({ id: f.id, label: typeof f.label == "string" ? f.label : f.id }));
    }
    function st(P) {
      const v = P && typeof P == "object" ? P.thread_id : void 0;
      !L.value && typeof v == "string" && (Z.value = v);
    }
    function K(P) {
      w.value = P && typeof P == "object" && "message" in P ? String(P.message) : "Could not load the picker";
    }
    function $t() {
      O.value = "", Z.value = "", H.value = !0, j.value = [], l.value = !0;
    }
    async function wt() {
      E.value && (await o.mutate("save", {
        principal: { kind: "user", id: O.value },
        root: H.value ? "*" : Z.value,
        groups: j.value.map((P) => P.id)
      }), !w.value && !B.value && (l.value = !1));
    }
    async function zt(P) {
      await en.confirm({
        header: "Revoke run-as permission?",
        message: `Members of ${P.groups.map((f) => at.value[f] || "Group unavailable").join(", ")} can no longer choose ${tt.value[P.principal.id] || "Account unavailable"} in the Run as setting.`,
        icon: "tabler:user-off",
        acceptLabel: "Revoke",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await o.mutate("revoke", { principal: P.principal, root: P.root });
    }
    return n({ load: o.load }), (P, v) => (a(), u("section", vr, [
      s("div", fr, [
        s("header", hr, [
          s("span", gr, x(g.value.length) + " active " + x(g.value.length === 1 ? "permission" : "permissions"), 1),
          s("div", mr, [
            m(i(Bt), {
              icon: "tabler:refresh",
              label: "Refresh",
              disabled: i(r) || L.value,
              spin: i(r),
              onClick: i(o).load
            }, null, 8, ["disabled", "spin", "onClick"]),
            l.value ? y("", !0) : (a(), $(i(Q), {
              key: 0,
              variant: "primary",
              icon: "tabler:plus",
              disabled: L.value,
              onClick: $t
            }, {
              default: C(() => [...v[9] || (v[9] = [
                T("New permission", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]))
          ])
        ]),
        v[10] || (v[10] = s("p", { class: "ks-runas-lede" }, [
          T(" Agents, automations and workflows run with the access of the account set in their "),
          s("b", null, "Run as"),
          T(" setting. A permission lets members of a group choose a specific account there, typically a bot account, so the component works with that account's access instead of their own. ")
        ], -1))
      ]),
      s("div", yr, [
        i(w) ? (a(), u("div", kr, [
          m(i(It), {
            severity: "danger",
            onDismiss: v[0] || (v[0] = (f) => w.value = "")
          }, {
            default: C(() => [
              T(x(i(w)), 1)
            ]),
            _: 1
          })
        ])) : y("", !0),
        i(I) ? (a(), $(i(It), {
          key: 1,
          "data-test": "delegation-confirmation",
          severity: "success",
          onDismiss: v[1] || (v[1] = (f) => I.value = "")
        }, {
          default: C(() => [
            T(x(i(I)), 1)
          ]),
          _: 1
        })) : y("", !0),
        l.value ? (a(), u("form", {
          key: 2,
          class: "ks-runas-form",
          onSubmit: pt(wt, ["prevent"])
        }, [
          s("div", $r, [
            v[11] || (v[11] = s("span", null, "New run-as permission", -1)),
            m(i(Bt), {
              icon: "tabler:x",
              label: "Cancel",
              disabled: L.value,
              onClick: v[2] || (v[2] = (f) => l.value = !1)
            }, null, 8, ["disabled"])
          ]),
          s("fieldset", {
            disabled: L.value,
            inert: L.value
          }, [
            s("ol", xr, [
              s("li", null, [
                m(i(Tt), {
                  label: "Account to run as",
                  help: "The account whose access the component uses. Its group memberships decide what the component can do."
                }, {
                  default: C(() => [
                    m(Nt, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "user", placeholder: "Choose an account…" },
                      config: { principal_id: O.value },
                      onChange: v[3] || (v[3] = (f) => N(f, "user")),
                      onError: K
                    }, null, 8, ["config"])
                  ]),
                  _: 1
                })
              ]),
              s("li", null, [
                m(i(Tt), {
                  label: "Who may choose it",
                  help: "Members of these groups see this account in the Run as setting. Nobody's group membership changes."
                }, {
                  default: C(() => [
                    m(Nt, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "group", placeholder: "Add a group…" },
                      config: {},
                      onChange: v[4] || (v[4] = (f) => N(f, "group")),
                      onError: K
                    })
                  ]),
                  _: 1
                }),
                j.value.length ? (a(), u("div", Cr, [
                  (a(!0), u(et, null, ot(j.value, (f) => (a(), $(i(mn), {
                    key: f.id,
                    label: f.label,
                    removable: !L.value,
                    pt: { removeIcon: { "aria-label": `Remove group ${f.label}` } },
                    onRemove: (M) => j.value = j.value.filter((U) => U.id !== f.id)
                  }, null, 8, ["label", "removable", "pt", "onRemove"]))), 128))
                ])) : y("", !0)
              ]),
              s("li", null, [
                s("fieldset", null, [
                  v[14] || (v[14] = s("legend", { class: "km-field-label" }, "On which components", -1)),
                  s("div", Sr, [
                    s("label", {
                      class: "ks-runas-component-option",
                      for: `${i(G)}-any`
                    }, [
                      m(i(Dt), {
                        modelValue: H.value,
                        "onUpdate:modelValue": v[5] || (v[5] = (f) => H.value = f),
                        "input-id": `${i(G)}-any`,
                        name: i(G),
                        value: !0,
                        disabled: L.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[12] || (v[12] = T(" Any component ", -1))
                    ], 8, Br),
                    s("label", {
                      class: "ks-runas-component-option",
                      for: `${i(G)}-one`
                    }, [
                      m(i(Dt), {
                        modelValue: H.value,
                        "onUpdate:modelValue": v[6] || (v[6] = (f) => H.value = f),
                        "input-id": `${i(G)}-one`,
                        name: i(G),
                        value: !1,
                        disabled: L.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[13] || (v[13] = T(" One component ", -1))
                    ], 8, Tr)
                  ]),
                  v[15] || (v[15] = s("small", { class: "km-field-help" }, "The person choosing the account must also be able to manage the component.", -1))
                ]),
                H.value ? y("", !0) : (a(), $(Nt, {
                  key: 0,
                  class: "ks-runas-component",
                  tag: "wc-component-picker",
                  attrs: { source: "/api/v1/security/delegations/roots", title: "Component", placeholder: "Choose a component you manage…" },
                  config: Z.value ? { thread_id: Z.value } : {},
                  onChange: st,
                  onError: K
                }, null, 8, ["config"]))
              ])
            ])
          ], 8, wr),
          s("div", Pr, [
            m(i(Q), {
              variant: "ghost",
              small: "",
              disabled: L.value,
              onClick: v[7] || (v[7] = (f) => l.value = !1)
            }, {
              default: C(() => [...v[16] || (v[16] = [
                T("Cancel", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            m(i(Q), {
              variant: "primary",
              small: "",
              icon: "tabler:device-floppy",
              disabled: !E.value || L.value,
              loading: i(h),
              onClick: wt
            }, {
              default: C(() => [...v[17] || (v[17] = [
                T("Save permission", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)) : y("", !0),
        i(B) && !i(h) ? (a(), u("div", Ir, [
          v[19] || (v[19] = s("span", null, "We could not confirm whether the permission changed. Select Retry to check before making another change.", -1)),
          m(i(Q), {
            small: "",
            onClick: i(o).submit
          }, {
            default: C(() => [...v[18] || (v[18] = [
              T("Retry", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ])) : y("", !0),
        R.value.length ? (a(), $(i(Q), {
          key: 4,
          class: "ks-runas-history",
          variant: "ghost",
          small: "",
          "aria-expanded": S.value,
          onClick: v[8] || (v[8] = (f) => S.value = !S.value)
        }, {
          default: C(() => [
            T(x(S.value ? "Hide revoked permissions" : "Show revoked permissions"), 1)
          ]),
          _: 1
        }, 8, ["aria-expanded"])) : y("", !0),
        i(r) && !i(d).length ? (a(), $(i(fn), {
          key: 5,
          label: "Loading run-as permissions…"
        })) : z.value.length ? (a(), u("div", Ar, [
          (a(!0), u(et, null, ot(z.value, (f) => (a(), u("article", {
            key: f.policy_id,
            class: X(["kx-card ks-runas-grant", { revoked: !f.active }])
          }, [
            m(i(V), {
              class: "ks-runas-grant-icon",
              icon: "tabler:user-shield",
              "aria-hidden": "true"
            }),
            s("div", zr, [
              s("div", Lr, [
                f.active ? (a(), u("span", _r, x(f.groups.map((M) => at.value[M] || "Group unavailable").join(", ")), 1)) : y("", !0),
                s("span", Nr, x(f.active ? "can run as" : "Permission to run as"), 1),
                s("span", Fr, x(tt.value[f.principal.id] || "Account unavailable"), 1)
              ]),
              s("div", Vr, [
                f.root === "*" ? (a(), u("span", Or, "on any component they manage")) : f.root_label ? (a(), u("span", Rr, [
                  v[20] || (v[20] = T("on ", -1)),
                  s("b", null, x(f.root_label), 1)
                ])) : (a(), u("span", Er, "on an unavailable component"))
              ])
            ]),
            f.active ? (a(), $(i(Q), {
              key: 1,
              variant: "ghost",
              small: "",
              icon: "tabler:user-off",
              disabled: L.value,
              "aria-label": `Revoke run-as permission for ${tt.value[f.principal.id] || "Account unavailable"}`,
              onClick: (M) => zt(f)
            }, {
              default: C(() => [...v[22] || (v[22] = [
                T("Revoke", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])) : (a(), $(i(Pt), {
              key: 0,
              severity: "secondary"
            }, {
              default: C(() => [...v[21] || (v[21] = [
                T("revoked", -1)
              ])]),
              _: 1
            }))
          ], 2))), 128))
        ])) : !i(w) && !l.value ? (a(), $(i(hn), {
          key: 7,
          icon: "tabler:user-shield",
          title: "No active run-as permissions"
        }, {
          hint: C(() => [...v[23] || (v[23] = [
            T("Without an active permission, the Run as setting offers only ", -1),
            s("b", null, "Me", -1),
            T(".", -1)
          ])]),
          _: 1
        })) : y("", !0)
      ])
    ]));
  }
}), Dr = ["draggable"], Kr = { class: "ks-pcard-row" }, Ur = { class: "ks-pcard-body" }, Mr = { class: "ks-pcard-head" }, Wr = ["title"], Hr = {
  key: 0,
  class: "ks-pcard-comment"
}, Gr = ["aria-label"], qr = ["aria-label"], ct = /* @__PURE__ */ D({
  __name: "PolicyCard",
  props: {
    policy: {},
    mode: {}
  },
  emits: ["add", "remove"],
  setup(t, { emit: n }) {
    const e = t, o = n, d = F(() => e.policy.title && e.policy.title !== e.policy.id ? e.policy.title : "Unnamed permission");
    function r(h) {
      e.mode === "locked" || !h.dataTransfer || (h.dataTransfer.setData("text/plain", e.policy.id), h.dataTransfer.effectAllowed = e.mode === "palette" ? "copy" : "move");
    }
    return (h, w) => (a(), u("div", {
      class: X(["kx-card ks-pcard", t.mode]),
      draggable: t.mode !== "locked",
      onDragstart: r,
      onDblclick: w[2] || (w[2] = (I) => t.mode === "palette" && o("add"))
    }, [
      s("div", Kr, [
        t.mode === "locked" ? (a(), $(i(V), {
          key: 0,
          icon: "tabler:lock",
          class: "ks-pcard-grip locked",
          "aria-hidden": "true"
        })) : (a(), $(i(V), {
          key: 1,
          icon: "tabler:grip-vertical",
          class: "ks-pcard-grip",
          "aria-hidden": "true"
        })),
        s("div", Ur, [
          s("div", Mr, [
            t.policy.effect === "allow" || t.policy.effect === "deny" ? (a(), $(Pt, {
              key: 0,
              severity: t.policy.effect === "allow" ? "success" : "danger"
            }, {
              default: C(() => [
                T(x(t.policy.effect === "deny" ? "Blocks" : "Allows"), 1)
              ]),
              _: 1
            }, 8, ["severity"])) : y("", !0),
            s("span", {
              class: "ks-pcard-title",
              title: d.value
            }, x(d.value), 9, Wr)
          ]),
          t.policy.comment ? (a(), u("div", Hr, x(t.policy.comment), 1)) : y("", !0)
        ]),
        t.mode === "palette" ? (a(), u("button", {
          key: 2,
          class: "ks-pcard-act add",
          "aria-label": `Add permission ${d.value}`,
          onClick: w[0] || (w[0] = pt((I) => o("add"), ["stop"]))
        }, [
          m(i(V), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ], 8, Gr)) : t.mode === "selected" ? (a(), u("button", {
          key: 3,
          class: "ks-pcard-act remove",
          "aria-label": `Remove permission ${d.value}`,
          onClick: w[1] || (w[1] = pt((I) => o("remove"), ["stop"]))
        }, [
          m(i(V), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ], 8, qr)) : y("", !0)
      ])
    ], 42, Dr));
  }
}), Zr = { class: "ks" }, Jr = { class: "ks-rail-search" }, Qr = { class: "ks-rail-list" }, Xr = {
  key: 0,
  class: "ks-rail-group"
}, Yr = ["onClick"], ta = { class: "ks-scope-name" }, na = ["onClick"], ea = { class: "ks-scope-name" }, oa = {
  key: 0,
  class: "ks-builder"
}, ra = { class: "ks-builder-head" }, aa = { class: "ks-builder-title" }, ia = { class: "ks-builder-acts" }, la = {
  key: 0,
  class: "ks-overlay-warn"
}, sa = {
  key: 1,
  class: "ks-view-note"
}, da = { class: "ks-fields" }, ua = {
  key: 0,
  class: "ks-pane locked-pane"
}, ca = { class: "ks-pane-head" }, ba = { class: "ks-pane-sub" }, pa = { class: "ks-pane-body" }, va = {
  key: 0,
  class: "ks-pane-empty"
}, fa = { class: "ks-pane" }, ha = { class: "ks-pane-search" }, ga = { class: "ks-pane-body" }, ma = {
  key: 0,
  class: "ks-pane-empty"
}, ya = { class: "ks-pane-head" }, ka = { class: "ks-pane-sub" }, $a = { class: "ks-pane-body" }, wa = ["onDrop"], xa = {
  key: 0,
  class: "ks-drop-hint"
}, Ca = {
  key: 1,
  class: "ks-view"
}, Sa = { class: "ks-builder-head" }, Ba = { class: "ks-builder-title" }, Ta = { class: "ks-builder-acts" }, Pa = { class: "ks-pane-body ks-view-list" }, Ia = {
  key: 0,
  class: "ks-pane-empty"
}, Aa = {
  key: 0,
  class: "ks-ext-block"
}, za = { class: "ks-ext-head" }, La = { class: "ks-pane-body ks-view-list" }, _a = {
  key: 2,
  class: "kx-system-body"
}, Na = /* @__PURE__ */ D({
  __name: "Security",
  setup(t) {
    const n = br(), { scopes: e, policies: o, loading: d, saving: r, error: h } = n, w = A(""), I = A(""), B = A(null), l = A(null), S = A("scopes"), O = A(null), Z = A(!1);
    async function H(b) {
      S.value = String(b), b === "delegations" && (Z.value = !0, await nn(), await O.value?.load());
    }
    Bn(async () => {
      await n.load(), S.value === "delegations" && await O.value?.load();
    });
    const G = F(() => {
      const b = {};
      for (const c of o.value) b[c.id] = c;
      return b;
    }), j = F(() => {
      const b = w.value.trim().toLowerCase(), c = (p) => !b || p.label.toLowerCase().includes(b) || p.id.toLowerCase().includes(b);
      return {
        custom: e.value.filter((p) => p.source === "custom" && c(p)),
        builtin: e.value.filter((p) => p.source !== "custom" && c(p))
      };
    }), L = F(() => e.value.find((b) => b.id === B.value) || null), E = F(() => L.value && L.value.source !== "custom" ? L.value : null), at = F(() => {
      if (!l.value) return [];
      const b = /* @__PURE__ */ new Set([...l.value.policies, ...l.value.base.map((p) => p.id)]), c = I.value.trim().toLowerCase();
      return o.value.filter((p) => !b.has(p.id) && (!c || (p.title || "").toLowerCase().includes(c) || p.id.toLowerCase().includes(c) || (p.comment || "").toLowerCase().includes(c)));
    }), tt = F(
      () => l.value ? l.value.policies.map((b) => G.value[b] || { id: b }) : []
    );
    function g(b) {
      B.value = b.id, l.value = b.source === "custom" ? { slug: b.slug || "", label: b.label, description: b.description, policies: b.policies.map((c) => c.id), enabled: b.enabled, isNew: !1, target: "", base: [] } : null;
    }
    function R() {
      B.value = null, l.value = { slug: Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join(""), label: "", description: "", policies: [], enabled: !0, isNew: !0, target: "", base: [] };
    }
    function z(b) {
      R(), Object.assign(l.value, {
        label: b.label ? `Copy of ${b.label}` : "",
        description: b.description,
        policies: [...b.policies.map((c) => c.id), ...(b.overlay_policies ?? []).map((c) => c.id)]
      });
    }
    function N(b) {
      return b.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
    }
    function st(b) {
      B.value = b.id, l.value = {
        slug: b.overlay_slug || N(b.id),
        label: b.label || dt(b.id),
        description: b.description,
        policies: (b.overlay_policies ?? []).map((c) => c.id),
        enabled: !0,
        isNew: !b.overlay_slug,
        target: b.id,
        base: b.policies
      };
    }
    const K = F(() => !!l.value && l.value.target !== "");
    function $t(b) {
      l.value && !l.value.policies.includes(b) && l.value.policies.push(b);
    }
    function wt(b) {
      l.value && (l.value.policies = l.value.policies.filter((c) => c !== b));
    }
    function zt(b) {
      const c = b.dataTransfer?.getData("text/plain");
      c && $t(c);
    }
    function P(b, c) {
      b.stopPropagation();
      const p = b.dataTransfer?.getData("text/plain");
      if (!p || !l.value || p === c) return;
      const q = l.value.policies, Lt = q.indexOf(p);
      Lt !== -1 && q.splice(Lt, 1);
      const Ht = q.indexOf(c);
      q.splice(Ht === -1 ? q.length : Ht, 0, p);
    }
    const v = F(() => l.value ? !l.value.isNew || l.value.target ? l.value.slug : `${N(l.value.label.normalize("NFKD").replace(/\p{M}/gu, "")).toLowerCase() || "role"}_${l.value.slug}` : ""), f = F(() => !!l.value && l.value.label.trim() !== "" && l.value.policies.length > 0), M = A("");
    let U = null;
    _n(() => {
      U && clearTimeout(U);
    });
    function yn(b) {
      M.value = b, U && clearTimeout(U), U = setTimeout(() => {
        M.value = "";
      }, 3e3);
    }
    async function kn() {
      if (!l.value || !f.value) return;
      const b = l.value, c = v.value, p = l.value.target, q = l.value.label.trim() || c;
      await n.saveScope({
        slug: c,
        target: p,
        label: l.value.label.trim(),
        description: l.value.description.trim(),
        policies: l.value.policies,
        enabled: l.value.enabled
      }) && (b.slug = c, b.isNew = !1, l.value === b && (B.value = p || `kickside.security.scopes:${c}`), yn(`Saved “${q}”. The role will be available when assigning users.`));
    }
    async function $n() {
      if (!l.value || l.value.isNew) return;
      const b = K.value;
      if (!await en.confirm({
        header: b ? "Remove extension?" : "Delete role?",
        message: b ? "This removes the added permissions. Users keep the role’s original permissions." : "This removes the custom role and its permissions.",
        icon: "tabler:trash",
        acceptLabel: b ? "Remove extension" : "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      await n.deleteScope(l.value.slug) && (l.value = null, B.value = null);
    }
    function dt(b) {
      return b.includes(":") ? b.split(":").slice(-1)[0] : b;
    }
    return (b, c) => (a(), u("div", Zr, [
      m(be, {
        value: S.value,
        label: "Security administration",
        items: [
          { value: "scopes", label: "Roles" },
          { value: "delegations", label: "Run as" }
        ],
        "onUpdate:value": H
      }, null, 8, ["value"]),
      Z.value ? ut((a(), $(jr, {
        key: 0,
        ref_key: "delegationPanel",
        ref: O,
        scopes: i(e)
      }, null, 8, ["scopes"])), [
        [Zt, S.value === "delegations"]
      ]) : y("", !0),
      i(h) ? (a(), $(i(It), {
        key: 1,
        severity: "danger",
        class: "ks-top-notice",
        onDismiss: c[0] || (c[0] = (p) => h.value = "")
      }, {
        default: C(() => [
          T(x(i(h)), 1)
        ]),
        _: 1
      })) : M.value ? (a(), $(i(It), {
        key: 2,
        severity: "success",
        class: "ks-top-notice",
        onDismiss: c[1] || (c[1] = (p) => M.value = "")
      }, {
        default: C(() => [
          T(x(M.value), 1)
        ]),
        _: 1
      })) : y("", !0),
      S.value === "scopes" && i(d) && !i(e).length ? (a(), $(i(fn), {
        key: 3,
        label: "Loading security…"
      })) : ut((a(), $(i(he), { key: 4 }, {
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
                onClick: R
              }, null, 8, ["disabled"]),
              m(i(Bt), {
                icon: "tabler:refresh",
                label: "Refresh",
                disabled: i(d),
                spin: i(d),
                onClick: i(n).load
              }, null, 8, ["disabled", "spin", "onClick"])
            ]),
            _: 1
          }, 8, ["count"]),
          s("div", Jr, [
            m(i(Qt), {
              modelValue: w.value,
              "onUpdate:modelValue": c[2] || (c[2] = (p) => w.value = p),
              placeholder: "Find a role…"
            }, null, 8, ["modelValue"])
          ]),
          s("div", Qr, [
            j.value.custom.length ? (a(), u("div", Xr, "Custom")) : y("", !0),
            (a(!0), u(et, null, ot(j.value.custom, (p) => (a(), u("button", {
              key: p.id,
              class: X(["ks-scope-row", { active: p.id === B.value }]),
              onClick: (q) => g(p)
            }, [
              s("span", ta, x(p.label || dt(p.id)), 1)
            ], 10, Yr))), 128)),
            c[11] || (c[11] = s("div", { class: "ks-rail-group" }, "Default", -1)),
            (a(!0), u(et, null, ot(j.value.builtin, (p) => (a(), u("button", {
              key: p.id,
              class: X(["ks-scope-row", { active: p.id === B.value }]),
              onClick: (q) => g(p)
            }, [
              s("span", ea, x(p.label || dt(p.id)), 1)
            ], 10, na))), 128))
          ])
        ]),
        default: C(() => [
          l.value ? (a(), u("div", oa, [
            s("div", ra, [
              s("div", aa, [
                m(i(V), {
                  icon: K.value ? "tabler:stack-2" : "tabler:shield-lock",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                s("span", null, x(K.value ? `Extend ${l.value.label || dt(l.value.target)}` : l.value.isNew ? "New role" : l.value.label || l.value.slug), 1),
                K.value ? (a(), $(i(Pt), {
                  key: 0,
                  severity: "warn"
                }, {
                  default: C(() => [...c[12] || (c[12] = [
                    T("Additional permissions", -1)
                  ])]),
                  _: 1
                })) : y("", !0)
              ]),
              s("div", ia, [
                !l.value.isNew && !K.value && L.value ? (a(), $(i(Q), {
                  key: 0,
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  disabled: i(r),
                  onClick: c[3] || (c[3] = (p) => z(L.value))
                }, {
                  default: C(() => [...c[13] || (c[13] = [
                    T("Duplicate", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : y("", !0),
                l.value.isNew ? y("", !0) : (a(), $(i(Q), {
                  key: 1,
                  variant: "danger",
                  small: "",
                  icon: "tabler:trash",
                  disabled: i(r),
                  onClick: $n
                }, {
                  default: C(() => [
                    T(x(K.value ? "Remove extension" : "Delete"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])),
                m(i(Q), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:device-floppy",
                  loading: i(r),
                  disabled: !f.value,
                  onClick: kn
                }, {
                  default: C(() => [
                    T(x(K.value ? "Save extension" : "Save role"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            K.value ? (a(), u("div", la, [
              m(i(V), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              s("span", null, [
                c[14] || (c[14] = T("Adding permissions grants them to ", -1)),
                s("b", null, "everyone assigned " + x(L.value?.label || dt(l.value.target)), 1),
                c[15] || (c[15] = T(". Original permissions cannot be removed here. To restrict access, create a new role with only the permissions needed.", -1))
              ])
            ])) : (a(), u("p", sa, "Choose the permissions this role grants, then assign it in System → Users. To restrict a Member, assign this role instead of Member; other assigned roles may still grant access.")),
            s("div", da, [
              m(i(Tt), { label: "Name" }, {
                default: C(() => [
                  m(i(Xt), {
                    modelValue: l.value.label,
                    "onUpdate:modelValue": c[4] || (c[4] = (p) => l.value.label = p),
                    placeholder: "Reviewer"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              m(i(Tt), { label: "Description" }, {
                default: C(() => [
                  m(i(Xt), {
                    modelValue: l.value.description,
                    "onUpdate:modelValue": c[5] || (c[5] = (p) => l.value.description = p),
                    placeholder: "Read-only reviewer role"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            s("div", {
              class: X(["ks-panes", { three: K.value }])
            }, [
              K.value ? (a(), u("section", ua, [
                s("header", ca, [
                  c[16] || (c[16] = s("span", null, "Original permissions", -1)),
                  s("span", ba, x(l.value.base.length) + " · locked", 1)
                ]),
                s("div", pa, [
                  (a(!0), u(et, null, ot(l.value.base, (p) => (a(), $(ct, {
                    key: p.id,
                    policy: p,
                    mode: "locked"
                  }, null, 8, ["policy"]))), 128)),
                  l.value.base.length ? y("", !0) : (a(), u("div", va, "No original permissions."))
                ])
              ])) : y("", !0),
              s("section", fa, [
                c[17] || (c[17] = s("header", { class: "ks-pane-head" }, [
                  s("span", null, "Available permissions"),
                  s("span", { class: "ks-pane-sub" }, "Click + to add")
                ], -1)),
                s("div", ha, [
                  m(i(Qt), {
                    modelValue: I.value,
                    "onUpdate:modelValue": c[6] || (c[6] = (p) => I.value = p),
                    placeholder: "Search permissions…"
                  }, null, 8, ["modelValue"])
                ]),
                s("div", ga, [
                  (a(!0), u(et, null, ot(at.value, (p) => (a(), $(ct, {
                    key: p.id,
                    policy: p,
                    mode: "palette",
                    onAdd: (q) => $t(p.id)
                  }, null, 8, ["policy", "onAdd"]))), 128)),
                  at.value.length ? y("", !0) : (a(), u("div", ma, "No matching permissions."))
                ])
              ]),
              s("section", {
                class: "ks-pane drop",
                onDragover: c[8] || (c[8] = pt(() => {
                }, ["prevent"])),
                onDrop: zt
              }, [
                s("header", ya, [
                  s("span", null, x(K.value ? "Added by you" : "In this role"), 1),
                  s("span", ka, x(l.value.policies.length) + " " + x(l.value.policies.length === 1 ? "permission" : "permissions"), 1)
                ]),
                s("div", $a, [
                  (a(!0), u(et, null, ot(tt.value, (p) => (a(), u("div", {
                    key: p.id,
                    onDragover: c[7] || (c[7] = pt(() => {
                    }, ["prevent"])),
                    onDrop: (q) => P(q, p.id)
                  }, [
                    m(ct, {
                      policy: p,
                      mode: "selected",
                      onRemove: (q) => wt(p.id)
                    }, null, 8, ["policy", "onRemove"])
                  ], 40, wa))), 128)),
                  l.value.policies.length ? y("", !0) : (a(), u("div", xa, [
                    m(i(V), {
                      icon: "tabler:drag-drop",
                      "aria-hidden": "true"
                    }),
                    c[18] || (c[18] = s("span", null, "Use + on an available permission, or drag it here.", -1))
                  ]))
                ])
              ], 32)
            ], 2)
          ])) : E.value ? (a(), u("div", Ca, [
            s("div", Sa, [
              s("div", Ba, [
                m(i(V), {
                  icon: "tabler:shield",
                  "aria-hidden": "true"
                }),
                s("span", null, x(E.value.label || dt(E.value.id)), 1)
              ]),
              s("div", Ta, [
                m(i(Q), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:stack-2",
                  onClick: c[9] || (c[9] = (p) => st(E.value))
                }, {
                  default: C(() => [
                    T(x(E.value.overlay_slug ? "Edit extension" : "Add permissions"), 1)
                  ]),
                  _: 1
                }),
                m(i(Q), {
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  onClick: c[10] || (c[10] = (p) => z(E.value))
                }, {
                  default: C(() => [...c[19] || (c[19] = [
                    T("Copy role", -1)
                  ])]),
                  _: 1
                })
              ])
            ]),
            c[21] || (c[21] = s("p", { class: "ks-view-note" }, " Included with the application. Adding permissions affects everyone with this role. For restricted access, create a new role with only the permissions needed and assign it in System → Users instead of this role. Other assigned roles may still grant access. ", -1)),
            s("div", Pa, [
              (a(!0), u(et, null, ot(E.value.policies, (p) => (a(), $(ct, {
                key: p.id,
                policy: p,
                mode: "locked"
              }, null, 8, ["policy"]))), 128)),
              E.value.policies.length ? y("", !0) : (a(), u("div", Ia, "No permissions in this role."))
            ]),
            E.value.overlay_policies && E.value.overlay_policies.length ? (a(), u("div", Aa, [
              s("div", za, [
                m(i(V), {
                  icon: "tabler:stack-2",
                  "aria-hidden": "true"
                }),
                c[20] || (c[20] = s("span", null, "Additional permissions", -1)),
                m(i(Pt), { severity: "warn" }, {
                  default: C(() => [
                    T(x(E.value.overlay_policies.length), 1)
                  ]),
                  _: 1
                })
              ]),
              s("div", La, [
                (a(!0), u(et, null, ot(E.value.overlay_policies, (p) => (a(), $(ct, {
                  key: p.id,
                  policy: p,
                  mode: "locked"
                }, null, 8, ["policy"]))), 128))
              ])
            ])) : y("", !0)
          ])) : (a(), u("div", _a, [
            m(i(hn), {
              icon: "tabler:shield-lock",
              title: "Roles",
              hint: "Choose a role to view its permissions, or create one with the permissions your team needs. Assign roles in System → Users.",
              cta: "New role",
              "cta-icon": "tabler:plus",
              onCta: R
            })
          ]))
        ]),
        _: 1
      }, 512)), [
        [Zt, S.value === "scopes"]
      ])
    ]));
  }
}), Ea = {
  rootComponent: Na,
  plugins: [Tn]
};
export {
  Ea as mountConfig
};
//# sourceMappingURL=lazy-mount-B5iLzLvg.js.map
