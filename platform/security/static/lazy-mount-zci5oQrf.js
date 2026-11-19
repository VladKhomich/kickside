import { B as J, R as Mt, s as Y, f as rt, k as tn, b as xn, Q as Bt, z as Pt, a as _t, c as Ft, T as Cn, C as Sn, K as It, v as Bn, V as qt, l as nn, d as Ot, e as In, P as Pn } from "./wc-runtime-E4NYBaIN.js";
import { mergeProps as k, resolveDirective as Wt, withDirectives as ut, openBlock as a, createBlock as $, resolveDynamicComponent as lt, withCtx as S, renderSlot as N, normalizeClass as X, createElementBlock as d, createElementVNode as l, createCommentVNode as y, defineComponent as K, unref as i, createVNode as m, Fragment as et, renderList as ot, createTextVNode as B, toDisplayString as C, resolveComponent as Zt, getCurrentInstance as Tn, computed as V, createSlots as An, ref as P, onMounted as zn, watch as Rt, onBeforeUnmount as Ln, nextTick as en, useId as _n, withModifiers as ht, onUnmounted as Nn, vShow as Jt } from "vue";
import { Icon as E } from "@iconify/vue";
import { loadByTagName as Fn, api as at, host as on } from "@wippy-fe/proxy";
var Vn = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-tab", {
      "p-tab-active": e.active,
      "p-disabled": o.disabled
    }];
  }
}, On = J.extend({
  name: "tab",
  classes: Vn
}), Rn = {
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
  style: On,
  provide: function() {
    return {
      $pcTab: this,
      $parentInstance: this
    };
  }
}, rn = {
  name: "Tab",
  extends: Rn,
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
      return o ? Bt(o, "data-p-disabled") || Bt(o, "data-pc-section") === "activebar" ? this.findNextTab(o) : Pt(o, '[data-pc-name="tab"]') : null;
    },
    findPrevTab: function(n) {
      var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = e ? n : n.previousElementSibling;
      return o ? Bt(o, "data-p-disabled") || Bt(o, "data-pc-section") === "activebar" ? this.findPrevTab(o) : Pt(o, '[data-pc-name="tab"]') : null;
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
      xn(e), this.scrollInView(e);
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
      return tn((n = this.$pcTabs) === null || n === void 0 ? void 0 : n.d_value, this.value);
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
    ripple: Mt
  }
};
function En(t, n, e, o, u, r) {
  var f = Wt("ripple");
  return t.asChild ? N(t.$slots, "default", {
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
    default: S(function() {
      return [N(t.$slots, "default")];
    }),
    _: 3
  }, 16, ["class", "data-p", "onClick"])), [[f]]);
}
rn.render = En;
var an = {
  name: "ChevronLeftIcon",
  extends: _t
};
function jn(t) {
  return Mn(t) || Un(t) || Kn(t) || Dn();
}
function Dn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Kn(t, n) {
  if (t) {
    if (typeof t == "string") return Et(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Et(t, n) : void 0;
  }
}
function Un(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Mn(t) {
  if (Array.isArray(t)) return Et(t);
}
function Et(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Wn(t, n, e, o, u, r) {
  return a(), d("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), jn(n[0] || (n[0] = [l("path", {
    d: "M9.61296 13C9.50997 13.0005 9.40792 12.9804 9.3128 12.9409C9.21767 12.9014 9.13139 12.8433 9.05902 12.7701L3.83313 7.54416C3.68634 7.39718 3.60388 7.19795 3.60388 6.99022C3.60388 6.78249 3.68634 6.58325 3.83313 6.43628L9.05902 1.21039C9.20762 1.07192 9.40416 0.996539 9.60724 1.00012C9.81032 1.00371 10.0041 1.08597 10.1477 1.22959C10.2913 1.37322 10.3736 1.56698 10.3772 1.77005C10.3808 1.97313 10.3054 2.16968 10.1669 2.31827L5.49496 6.99022L10.1669 11.6622C10.3137 11.8091 10.3962 12.0084 10.3962 12.2161C10.3962 12.4238 10.3137 12.6231 10.1669 12.7701C10.0945 12.8433 10.0083 12.9014 9.91313 12.9409C9.81801 12.9804 9.71596 13.0005 9.61296 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
an.render = Wn;
var ln = {
  name: "ChevronRightIcon",
  extends: _t
};
function Hn(t) {
  return Jn(t) || Zn(t) || qn(t) || Gn();
}
function Gn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qn(t, n) {
  if (t) {
    if (typeof t == "string") return jt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? jt(t, n) : void 0;
  }
}
function Zn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Jn(t) {
  if (Array.isArray(t)) return jt(t);
}
function jt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Qn(t, n, e, o, u, r) {
  return a(), d("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Hn(n[0] || (n[0] = [l("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
ln.render = Qn;
var Xn = {
  root: "p-tablist",
  content: "p-tablist-content p-tablist-viewport",
  tabList: "p-tablist-tab-list",
  activeBar: "p-tablist-active-bar",
  prevButton: "p-tablist-prev-button p-tablist-nav-button",
  nextButton: "p-tablist-next-button p-tablist-nav-button"
}, Yn = J.extend({
  name: "tablist",
  classes: Xn
}), te = {
  name: "BaseTabList",
  extends: Y,
  props: {},
  style: Yn,
  provide: function() {
    return {
      $pcTabList: this,
      $parentInstance: this
    };
  }
}, sn = {
  name: "TabList",
  extends: te,
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
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = Ft(n) - e, u = Math.abs(n.scrollLeft), r = o * 0.8, f = u - r, x = Math.max(f, 0);
      n.scrollLeft = qt(n) ? -1 * x : x;
    },
    onNextButtonClick: function() {
      var n = this.$refs.content, e = this.getVisibleButtonWidths(), o = Ft(n) - e, u = Math.abs(n.scrollLeft), r = o * 0.8, f = u + r, x = n.scrollWidth - o, T = Math.min(f, x);
      n.scrollLeft = qt(n) ? -1 * T : T;
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
      var n = this.$refs, e = n.content, o = n.inkbar, u = n.tabs;
      if (o) {
        var r = Pt(e, '[data-pc-name="tab"][data-p-active="true"]');
        this.$pcTabs.isVertical() ? (o.style.height = Sn(r) + "px", o.style.top = It(r).top - It(u).top + "px") : (o.style.width = Bn(r) + "px", o.style.left = It(r).left - It(u).left + "px");
      }
    },
    updateButtonState: function() {
      var n = this.$refs, e = n.list, o = n.content, u = o.scrollTop, r = o.scrollWidth, f = o.scrollHeight, x = o.offsetWidth, T = o.offsetHeight, _ = Math.abs(o.scrollLeft), w = [Ft(o), Cn(o)], s = w[0], z = w[1];
      this.$pcTabs.isVertical() ? (this.isPrevButtonEnabled = u !== 0, this.isNextButtonEnabled = e.offsetHeight >= T && parseInt(u) !== f - z) : (this.isPrevButtonEnabled = _ !== 0, this.isNextButtonEnabled = e.offsetWidth >= x && parseInt(_) !== r - s);
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
    ChevronLeftIcon: an,
    ChevronRightIcon: ln
  },
  directives: {
    ripple: Mt
  }
}, ne = ["data-p"], ee = ["aria-label", "tabindex"], oe = ["data-p"], re = ["aria-orientation"], ae = ["aria-label", "tabindex"];
function ie(t, n, e, o, u, r) {
  var f = Wt("ripple");
  return a(), d("div", k({
    ref: "list",
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [r.showNavigators && u.isPrevButtonEnabled ? ut((a(), d("button", k({
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
  }, t.ptm("prevIcon")), null, 16))], 16, ee)), [[f]]) : y("", !0), l("div", k({
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
  }, t.ptm("activeBar")), null, 16)], 16, re)], 16, oe), r.showNavigators && u.isNextButtonEnabled ? ut((a(), d("button", k({
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
  }, t.ptm("nextIcon")), null, 16))], 16, ae)), [[f]]) : y("", !0)], 16, ne);
}
sn.render = ie;
var le = `
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
`, se = {
  root: function(n) {
    var e = n.props;
    return ["p-tabs p-component", {
      "p-tabs-scrollable": e.scrollable
    }];
  }
}, de = J.extend({
  name: "tabs",
  style: le,
  classes: se
}), ue = {
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
  style: de,
  provide: function() {
    return {
      $pcTabs: this,
      $parentInstance: this
    };
  }
}, dn = {
  name: "Tabs",
  extends: ue,
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
function ce(t, n, e, o, u, r) {
  return a(), d("div", k({
    class: t.cx("root")
  }, t.ptmi("root")), [N(t.$slots, "default")], 16);
}
dn.render = ce;
const be = {
  key: 0,
  class: "kx-system-tab-count"
}, pe = /* @__PURE__ */ K({
  __name: "SystemTabs",
  props: {
    value: {},
    label: {},
    items: {}
  },
  emits: ["update:value"],
  setup(t) {
    return (n, e) => (a(), $(i(dn), {
      class: "kx-system-tabs",
      "data-kx-separator": "surface",
      value: t.value,
      "onUpdate:value": e[0] || (e[0] = (o) => n.$emit("update:value", String(o)))
    }, {
      default: S(() => [
        m(i(sn), {
          pt: { tabList: { "aria-label": t.label } }
        }, {
          default: S(() => [
            (a(!0), d(et, null, ot(t.items, (o) => (a(), $(i(rn), k({
              key: o.value,
              value: o.value
            }, { ref_for: !0 }, o.controls ? { "aria-controls": o.controls } : {}), {
              default: S(() => [
                B(C(o.label), 1),
                o.count !== void 0 ? (a(), d("b", be, C(o.count), 1)) : y("", !0)
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
}), ve = { class: "kx-shell" }, fe = { class: "kx-rail" }, he = { class: "kx-main kx-system-pane" }, ge = /* @__PURE__ */ K({
  __name: "Shell",
  setup(t) {
    return (n, e) => (a(), d("div", ve, [
      l("aside", fe, [
        N(n.$slots, "rail")
      ]),
      l("main", he, [
        N(n.$slots, "default")
      ])
    ]));
  }
}), me = { class: "kx-railhead" }, ye = { class: "kx-railhead-title" }, ke = { key: 0 }, $e = { class: "kx-railhead-acts" }, we = /* @__PURE__ */ K({
  __name: "RailHeader",
  props: {
    title: {},
    count: {}
  },
  setup(t) {
    return (n, e) => (a(), d("div", me, [
      l("span", ye, [
        B(C(t.title), 1),
        t.count !== void 0 ? (a(), d("b", ke, C(t.count), 1)) : y("", !0)
      ]),
      l("div", $e, [
        N(n.$slots, "actions")
      ])
    ]));
  }
});
var Ht = {
  name: "SpinnerIcon",
  extends: _t
};
function xe(t) {
  return Ie(t) || Be(t) || Se(t) || Ce();
}
function Ce() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Se(t, n) {
  if (t) {
    if (typeof t == "string") return Dt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Dt(t, n) : void 0;
  }
}
function Be(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Ie(t) {
  if (Array.isArray(t)) return Dt(t);
}
function Dt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Pe(t, n, e, o, u, r) {
  return a(), d("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), xe(n[0] || (n[0] = [l("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ht.render = Pe;
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
`, Ae = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Ot(e.value) && String(e.value).length === 1,
      "p-badge-dot": nn(e.value) && !o.$slots.default,
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
}, ze = J.extend({
  name: "badge",
  style: Te,
  classes: Ae
}), Le = {
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
  style: ze,
  provide: function() {
    return {
      $pcBadge: this,
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
function Qt(t, n, e) {
  return (n = _e(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function _e(t) {
  var n = Ne(t, "string");
  return gt(n) == "symbol" ? n : n + "";
}
function Ne(t, n) {
  if (gt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (gt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var un = {
  name: "Badge",
  extends: Le,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return rt(Qt(Qt({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Fe = ["data-p"];
function Ve(t, n, e, o, u, r) {
  return a(), d("span", k({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [N(t.$slots, "default", {}, function() {
    return [B(C(t.value), 1)];
  })], 16, Fe);
}
un.render = Ve;
var Oe = `
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
function mt(t) {
  "@babel/helpers - typeof";
  return mt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, mt(t);
}
function nt(t, n, e) {
  return (n = Re(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Re(t) {
  var n = Ee(t, "string");
  return mt(n) == "symbol" ? n : n + "";
}
function Ee(t, n) {
  if (mt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (mt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var je = {
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
}, De = J.extend({
  name: "button",
  style: Oe,
  classes: je
}), Ke = {
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
  style: De,
  provide: function() {
    return {
      $pcButton: this,
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
function H(t, n, e) {
  return (n = Ue(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ue(t) {
  var n = Me(t, "string");
  return yt(n) == "symbol" ? n : n + "";
}
function Me(t, n) {
  if (yt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (yt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var xt = {
  name: "Button",
  extends: Ke,
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
      return nn(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return rt(H(H(H(H(H(H(H(H(H(H({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return rt(H(H({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return rt(H(H({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Ht,
    Badge: un
  },
  directives: {
    ripple: Mt
  }
}, We = ["data-p"], He = ["data-p"];
function Ge(t, n, e, o, u, r) {
  var f = Zt("SpinnerIcon"), x = Zt("Badge"), T = Wt("ripple");
  return t.asChild ? N(t.$slots, "default", {
    key: 1,
    class: X(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : ut((a(), $(lt(t.as), k({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: S(function() {
      return [N(t.$slots, "default", {}, function() {
        return [t.loading ? N(t.$slots, "loadingicon", k({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (a(), d("span", k({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (a(), $(f, k({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : N(t.$slots, "icon", k({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (a(), d("span", k({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, We)) : y("", !0)];
        }), t.label ? (a(), d("span", k({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), C(t.label), 17, He)) : y("", !0), t.badge ? (a(), $(x, {
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
  }, 16, ["class", "data-p"])), [[T]]);
}
xt.render = Ge;
const Tt = /* @__PURE__ */ K({
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
    const e = t, o = n, u = Tn(), r = V(
      () => Object.prototype.hasOwnProperty.call(u?.vnode.props ?? {}, "active")
    ), f = V(
      () => e.variant === "danger" ? "danger" : e.variant === "bordered" ? "secondary" : void 0
    ), x = V(
      () => e.size === "sm" ? "small" : e.size === "lg" ? "large" : void 0
    );
    return (T, _) => (a(), $(i(xt), {
      type: "button",
      severity: f.value,
      text: t.variant !== "bordered" && !t.active,
      outlined: t.variant === "bordered",
      size: x.value,
      loading: t.spin,
      disabled: t.disabled || t.spin,
      pt: {
        root: {
          "aria-label": t.label,
          "aria-pressed": r.value ? String(t.active) : void 0,
          title: t.label
        }
      },
      onClick: _[0] || (_[0] = (w) => o("click"))
    }, {
      icon: S(() => [
        m(i(E), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      _: 1
    }, 8, ["severity", "text", "outlined", "size", "loading", "disabled", "pt"]));
  }
}), Q = /* @__PURE__ */ K({
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
    const e = t, o = n, u = V(
      () => e.variant === "danger" ? "danger" : e.variant === "primary" ? void 0 : "secondary"
    );
    return (r, f) => (a(), $(i(xt), {
      type: t.type,
      severity: u.value,
      outlined: t.variant === "ghost",
      loading: t.loading,
      disabled: t.disabled || t.loading,
      size: t.small ? "small" : void 0,
      onClick: f[0] || (f[0] = (x) => o("click"))
    }, {
      default: S(() => [
        t.loading ? (a(), $(i(Ht), {
          key: 0,
          class: "p-button-loading-icon p-button-icon",
          spin: ""
        })) : y("", !0),
        t.icon && !t.loading ? (a(), $(i(E), {
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
var qe = {
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
      return e.find(Ot);
    }
  },
  computed: {
    $filled: function() {
      return Ot(this.d_value);
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
}, cn = {
  name: "BaseInput",
  extends: qe,
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
}, Ze = `
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
`, Je = {
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
}, Qe = J.extend({
  name: "inputtext",
  style: Ze,
  classes: Je
}), Xe = {
  name: "BaseInputText",
  extends: cn,
  style: Qe,
  provide: function() {
    return {
      $pcInputText: this,
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
function Ye(t, n, e) {
  return (n = to(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function to(t) {
  var n = no(t, "string");
  return kt(n) == "symbol" ? n : n + "";
}
function no(t, n) {
  if (kt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (kt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Gt = {
  name: "InputText",
  extends: Xe,
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
      return rt(Ye({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, eo = ["value", "name", "disabled", "aria-invalid", "data-p"];
function oo(t, n, e, o, u, r) {
  return a(), d("input", k({
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
  }, r.attrs), null, 16, eo);
}
Gt.render = oo;
var ro = `
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
`, ao = {
  root: "p-iconfield"
}, io = J.extend({
  name: "iconfield",
  style: ro,
  classes: ao
}), lo = {
  name: "BaseIconField",
  extends: Y,
  style: io,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, bn = {
  name: "IconField",
  extends: lo,
  inheritAttrs: !1
};
function so(t, n, e, o, u, r) {
  return a(), d("div", k({
    class: t.cx("root")
  }, t.ptmi("root")), [N(t.$slots, "default")], 16);
}
bn.render = so;
var uo = {
  root: "p-inputicon"
}, co = J.extend({
  name: "inputicon",
  classes: uo
}), bo = {
  name: "BaseInputIcon",
  extends: Y,
  style: co,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, pn = {
  name: "InputIcon",
  extends: bo,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function po(t, n, e, o, u, r) {
  return a(), d("span", k({
    class: r.containerClass
  }, t.ptmi("root"), {
    "aria-hidden": "true"
  }), [N(t.$slots, "default")], 16);
}
pn.render = po;
const Xt = /* @__PURE__ */ K({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(t, { emit: n }) {
    const e = n;
    return (o, u) => (a(), $(i(bn), { class: "km-search" }, {
      default: S(() => [
        m(i(pn), null, {
          default: S(() => [
            m(i(E), {
              icon: "tabler:search",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        m(i(Gt), {
          class: "km-search-input",
          "aria-label": t.placeholder || "Search",
          "model-value": t.modelValue,
          placeholder: t.placeholder || "Search",
          "onUpdate:modelValue": u[0] || (u[0] = (r) => e("update:modelValue", r ?? ""))
        }, null, 8, ["aria-label", "model-value", "placeholder"]),
        t.modelValue ? (a(), $(i(xt), {
          key: 0,
          text: "",
          severity: "secondary",
          class: "km-search-clear",
          "aria-label": "Clear search",
          onClick: u[1] || (u[1] = (r) => e("update:modelValue", ""))
        }, {
          icon: S(() => [
            m(i(E), {
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
}), vo = { class: "km-field" }, fo = { class: "km-field-label" }, ho = {
  key: 0,
  class: "km-field-help"
}, At = /* @__PURE__ */ K({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(t) {
    return (n, e) => (a(), d("label", vo, [
      l("span", fo, C(t.label), 1),
      N(n.$slots, "default"),
      t.help ? (a(), d("small", ho, C(t.help), 1)) : y("", !0)
    ]));
  }
}), Yt = /* @__PURE__ */ K({
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
    return (o, u) => (a(), $(i(Gt), {
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
var go = `
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
`, mo = {
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
}, yo = J.extend({
  name: "tag",
  style: go,
  classes: mo
}), ko = {
  name: "BaseTag",
  extends: Y,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: yo,
  provide: function() {
    return {
      $pcTag: this,
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
function $o(t, n, e) {
  return (n = wo(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function wo(t) {
  var n = xo(t, "string");
  return $t(n) == "symbol" ? n : n + "";
}
function xo(t, n) {
  if ($t(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if ($t(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var vn = {
  name: "Tag",
  extends: ko,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return rt($o({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, Co = ["data-p"];
function So(t, n, e, o, u, r) {
  return a(), d("span", k({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (a(), $(lt(t.$slots.icon), k({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), d("span", k({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : y("", !0), t.value != null || t.$slots.default ? N(t.$slots, "default", {
    key: 2
  }, function() {
    return [l("span", k({
      class: t.cx("label")
    }, t.ptm("label")), C(t.value), 17)];
  }) : y("", !0)], 16, Co);
}
vn.render = So;
const Bo = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, zt = /* @__PURE__ */ K({
  __name: "Pill",
  props: {
    severity: { default: "secondary" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(t) {
    return (n, e) => (a(), $(i(vn), {
      severity: t.severity || void 0,
      class: "km-pill kx-tag-sm"
    }, {
      default: S(() => [
        t.dot ? (a(), d("span", Bo)) : t.icon ? (a(), $(i(E), {
          key: 1,
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        N(n.$slots, "default")
      ]),
      _: 3
    }, 8, ["severity"]));
  }
}), Io = { class: "km-notice-text" }, Lt = /* @__PURE__ */ K({
  __name: "Notice",
  props: {
    severity: { default: "info" }
  },
  emits: ["dismiss"],
  setup(t, { emit: n }) {
    const e = n, o = (u) => u === "danger" ? "tabler:alert-triangle" : u === "success" ? "tabler:circle-check" : "tabler:info-circle";
    return (u, r) => (a(), d("div", {
      class: X(["km-notice", `is-${t.severity}`]),
      role: "status"
    }, [
      m(i(E), {
        icon: o(t.severity),
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      l("span", Io, [
        N(u.$slots, "default")
      ]),
      l("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: r[0] || (r[0] = (f) => e("dismiss"))
      }, [
        m(i(E), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
});
var Po = `
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
}, Ao = J.extend({
  name: "progressspinner",
  style: Po,
  classes: To
}), zo = {
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
  style: Ao,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, fn = {
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
}, Lo = ["fill", "stroke-width"];
function _o(t, n, e, o, u, r) {
  return a(), d("div", k({
    class: t.cx("root"),
    role: "progressbar"
  }, t.ptmi("root")), [(a(), d("svg", k({
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
  }, t.ptm("circle")), null, 16, Lo)], 16))], 16);
}
fn.render = _o;
const No = { class: "km-loading" }, Fo = { key: 0 }, hn = /* @__PURE__ */ K({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(t) {
    return (n, e) => (a(), d("div", No, [
      m(i(fn), {
        style: { width: "22px", height: "22px", margin: "0" },
        "aria-label": t.label || "Loading"
      }, null, 8, ["aria-label"]),
      t.label ? (a(), d("span", Fo, C(t.label), 1)) : y("", !0)
    ]));
  }
}), Vo = { class: "kx-empty" }, Oo = { class: "kx-empty-ico" }, Ro = { class: "kx-empty-title" }, Eo = {
  key: 0,
  class: "kx-empty-sub"
}, gn = /* @__PURE__ */ K({
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
    return (n, e) => (a(), d("div", Vo, [
      l("div", Oo, [
        m(i(E), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      l("div", Ro, C(t.title), 1),
      t.hint || n.$slots.hint ? (a(), d("p", Eo, [
        N(n.$slots, "hint", {}, () => [
          B(C(t.hint), 1)
        ])
      ])) : y("", !0),
      t.cta ? (a(), $(i(xt), {
        key: 1,
        label: t.cta,
        onClick: e[0] || (e[0] = (o) => n.$emit("cta"))
      }, An({ _: 2 }, [
        t.ctaIcon ? {
          name: "icon",
          fn: S(({ class: o }) => [
            m(i(E), {
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
var mn = {
  name: "TimesCircleIcon",
  extends: _t
};
function jo(t) {
  return Mo(t) || Uo(t) || Ko(t) || Do();
}
function Do() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ko(t, n) {
  if (t) {
    if (typeof t == "string") return Kt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Kt(t, n) : void 0;
  }
}
function Uo(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Mo(t) {
  if (Array.isArray(t)) return Kt(t);
}
function Kt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Wo(t, n, e, o, u, r) {
  return a(), d("svg", k({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), jo(n[0] || (n[0] = [l("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
mn.render = Wo;
var Ho = `
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
`, Go = {
  root: "p-chip p-component",
  image: "p-chip-image",
  icon: "p-chip-icon",
  label: "p-chip-label",
  removeIcon: "p-chip-remove-icon"
}, qo = J.extend({
  name: "chip",
  style: Ho,
  classes: Go
}), Zo = {
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
  style: qo,
  provide: function() {
    return {
      $pcChip: this,
      $parentInstance: this
    };
  }
}, yn = {
  name: "Chip",
  extends: Zo,
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
    TimesCircleIcon: mn
  }
}, Jo = ["aria-label", "data-p"], Qo = ["src"];
function Xo(t, n, e, o, u, r) {
  return u.visible ? (a(), d("div", k({
    key: 0,
    class: t.cx("root"),
    "aria-label": t.label
  }, t.ptmi("root"), {
    "data-p": r.dataP
  }), [N(t.$slots, "default", {}, function() {
    return [t.image ? (a(), d("img", k({
      key: 0,
      src: t.image
    }, t.ptm("image"), {
      class: t.cx("image")
    }), null, 16, Qo)) : t.$slots.icon ? (a(), $(lt(t.$slots.icon), k({
      key: 1,
      class: t.cx("icon")
    }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), d("span", k({
      key: 2,
      class: [t.cx("icon"), t.icon]
    }, t.ptm("icon")), null, 16)) : y("", !0), t.label !== null ? (a(), d("div", k({
      key: 3,
      class: t.cx("label")
    }, t.ptm("label")), C(t.label), 17)) : y("", !0)];
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
  }) : y("", !0)], 16, Jo)) : y("", !0);
}
yn.render = Xo;
var Yo = `
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
`, tr = {
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
}, nr = J.extend({
  name: "radiobutton",
  style: Yo,
  classes: tr
}), er = {
  name: "BaseRadioButton",
  extends: cn,
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
  style: nr,
  provide: function() {
    return {
      $pcRadioButton: this,
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
function or(t, n, e) {
  return (n = rr(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function rr(t) {
  var n = ar(t, "string");
  return wt(n) == "symbol" ? n : n + "";
}
function ar(t, n) {
  if (wt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (wt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ut = {
  name: "RadioButton",
  extends: er,
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
      return n != null && (this.binary ? !!n : tn(n, this.value));
    },
    dataP: function() {
      return rt(or({
        invalid: this.$invalid,
        checked: this.checked,
        disabled: this.disabled,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, ir = ["data-p-checked", "data-p-disabled", "data-p"], lr = ["id", "value", "name", "checked", "tabindex", "disabled", "readonly", "aria-labelledby", "aria-label", "aria-invalid"], sr = ["data-p"], dr = ["data-p"];
function ur(t, n, e, o, u, r) {
  return a(), d("div", k({
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
  }, r.getPTOptions("input")), null, 16, lr), l("div", k({
    class: t.cx("box")
  }, r.getPTOptions("box"), {
    "data-p": r.dataP
  }), [l("div", k({
    class: t.cx("icon")
  }, r.getPTOptions("icon"), {
    "data-p": r.dataP
  }), null, 16, dr)], 16, sr)], 16, ir);
}
Ut.render = ur;
const cr = { class: "kx-wcmount" }, br = {
  key: 0,
  class: "kx-wcmount-fail",
  role: "alert"
}, Vt = /* @__PURE__ */ K({
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
    const e = t, o = n, u = P(null), r = P(!1);
    let f = null, x = 0;
    const T = /* @__PURE__ */ new Set();
    function _(g) {
      g.composedPath()[0] === f && (g.stopPropagation(), o("change", g.detail));
    }
    function w(g) {
      return g.composedPath()[0] !== f ? !1 : (g.stopPropagation(), !0);
    }
    function s(g) {
      w(g) && o("select", g.detail);
    }
    function z(g) {
      w(g) && o("created", g.detail);
    }
    function U(g) {
      w(g) && o("close", g.detail);
    }
    function M(g) {
      w(g) && o("error", g.detail);
    }
    function G(g) {
      if (typeof g == "string") return g;
      try {
        return JSON.stringify(g ?? {});
      } catch {
        return null;
      }
    }
    function D() {
      if (!f) return;
      const g = G(e.config);
      if (g !== null && f.setAttribute("config", g), e.schema !== void 0 && e.schema !== null) {
        const A = G(e.schema);
        A !== null && f.setAttribute("schema", A);
      }
      if (e.meta !== void 0 && e.meta !== null) {
        const A = G(e.meta);
        A !== null && f.setAttribute("meta", A);
      }
      e.provider && f.setAttribute("provider", e.provider), e.label && f.setAttribute("label", e.label);
      const R = e.attrs || {};
      for (const A of [...T])
        (!(A in R) || R[A] == null) && (f.removeAttribute(A), T.delete(A));
      for (const [A, F] of Object.entries(R)) {
        if (F == null) continue;
        const it = typeof F == "object" ? G(F) : String(F);
        it !== null && (f.setAttribute(A, it), T.add(A));
      }
    }
    function L(g = f) {
      g && (g.removeEventListener("config-changed", _), g.removeEventListener("change", _), g.removeEventListener("select", s), g.removeEventListener("created", z), g.removeEventListener("close", U), g.removeEventListener("error", M), g === f && (f = null), T.clear());
    }
    async function j(g) {
      if (!customElements.get(g))
        try {
          await Fn(g, { timeoutMs: 8e3 });
        } catch {
        }
    }
    async function O() {
      const g = ++x, R = u.value, A = e.tag;
      if (r.value = !1, !!R && (L(), R.innerHTML = "", !!A))
        try {
          if (await j(A), g !== x || u.value !== R || e.tag !== A) return;
          const F = document.createElement(A);
          F.classList.add("kx-wcmount-surface"), f = F, D(), F.addEventListener("config-changed", _), F.addEventListener("change", _), F.addEventListener("select", s), F.addEventListener("created", z), F.addEventListener("close", U), F.addEventListener("error", M), F.style.display = "block", R.appendChild(F), r.value = !customElements.get(A);
        } catch {
          g === x && (r.value = !0);
        }
    }
    async function W() {
      r.value = !1, await en(), await O();
    }
    return zn(O), Rt(() => e.tag, O), Rt(() => [e.config, e.schema, e.meta, e.provider, e.label, e.attrs], D, { deep: !0 }), Ln(() => {
      x += 1, L();
    }), (g, R) => (a(), d("div", cr, [
      r.value ? (a(), d("div", br, [
        R[0] || (R[0] = l("span", null, "This setup panel couldn’t load.", -1)),
        l("button", {
          type: "button",
          onClick: W
        }, "Try again")
      ])) : (a(), d("div", {
        key: 1,
        ref_key: "host",
        ref: u
      }, null, 512))
    ]));
  }
});
function ft(t, n) {
  const e = t?.response?.data ?? t?.data;
  return typeof e?.error == "string" && e.error ? e.error : typeof e?.message == "string" && e.message ? e.message : t instanceof Error ? t.message : n;
}
function pr() {
  const t = P([]), n = P([]), e = P([]), o = P(!0), u = P(!1), r = P("");
  let f = 0;
  async function x() {
    const w = ++f;
    o.value = !0, r.value = "";
    try {
      const [s, z, U] = await Promise.all([
        at.get("/api/v1/security/scopes?include_unavailable=true"),
        at.get("/api/v1/security/policies?assignable=true"),
        at.get("/api/v1/security/policies?include_private=true")
      ]);
      if (w !== f) return;
      t.value = s.data?.scopes ?? [], n.value = z.data?.policies ?? [], e.value = U.data?.policies ?? [];
    } catch (s) {
      w === f && (r.value = ft(s, "failed to load security"));
    } finally {
      w === f && (o.value = !1);
    }
  }
  async function T(w) {
    u.value = !0, r.value = "";
    try {
      return await at.post("/api/v1/security/scopes", w), await x(), !0;
    } catch (s) {
      return r.value = ft(s, "failed to save scope"), !1;
    } finally {
      u.value = !1;
    }
  }
  async function _(w) {
    u.value = !0, r.value = "";
    try {
      return await at.delete(`/api/v1/security/scopes?slug=${encodeURIComponent(w)}`), await x(), !0;
    } catch (s) {
      return r.value = ft(s, "failed to delete scope"), !1;
    } finally {
      u.value = !1;
    }
  }
  return { scopes: t, assignablePolicies: n, installedPolicies: e, loading: o, saving: u, error: r, load: x, saveScope: T, deleteScope: _ };
}
function vr() {
  const t = P([]), n = P(!1), e = P(!1), o = P(""), u = P(""), r = P(null);
  let f = 0;
  async function x() {
    const w = ++f;
    n.value = !0, o.value = "";
    try {
      const { data: s } = await at.get("/api/v1/security/delegations");
      if (s?.success !== !0 || !Array.isArray(s.delegations))
        throw new Error(s?.error || "Delegation inventory is unconfirmed");
      w === f && (t.value = s.delegations);
    } catch (s) {
      w === f && (o.value = ft(s, "Could not load run-as permissions"));
    } finally {
      w === f && (n.value = !1);
    }
  }
  async function T() {
    if (!r.value || e.value) return;
    const w = r.value;
    e.value = !0, o.value = "", u.value = "";
    try {
      const { data: s } = w.method === "save" ? await at.post("/api/v1/security/delegations", w.request) : await at.delete("/api/v1/security/delegations", { data: w.request });
      if (s?.success !== !0) throw new Error(s?.error || "Run-as request is unconfirmed");
      r.value = null, u.value = w.method === "save" ? "Run-as permission saved" : "Run-as permission revoked", await x();
    } catch (s) {
      o.value = ft(s, "Could not confirm run-as request");
      const z = s?.response?.status;
      z && z >= 400 && z < 500 && (r.value = null);
    } finally {
      e.value = !1;
    }
  }
  async function _(w, s) {
    r.value || e.value || (r.value = { method: w, request: {
      ...s,
      principal: { ...s.principal },
      ...s.groups ? { groups: [...s.groups].sort() } : {}
    } }, await T());
  }
  return { delegations: t, loading: n, saving: e, error: o, confirmation: u, pending: r, load: x, mutate: _, submit: T };
}
const fr = {
  class: "ks-runas kx-system-pane",
  "aria-label": "Run-as permissions"
}, hr = { class: "kx-system-tools" }, gr = { class: "ks-runas-head kx-system-toolbar" }, mr = { class: "ks-runas-count" }, yr = { class: "ks-runas-acts" }, kr = { class: "kx-system-body ks-runas-body" }, $r = {
  key: 0,
  role: "alert"
}, wr = { class: "ks-runas-form-head" }, xr = ["disabled", "inert"], Cr = { class: "ks-runas-steps" }, Sr = {
  key: 0,
  class: "ks-runas-chips",
  "aria-label": "Selected groups"
}, Br = { class: "ks-runas-component-options" }, Ir = ["for"], Pr = ["for"], Tr = { class: "ks-runas-form-foot" }, Ar = {
  key: 3,
  class: "ks-runas-pending"
}, zr = {
  key: 6,
  class: "ks-runas-list"
}, Lr = { class: "ks-runas-grant-body" }, _r = { class: "ks-runas-grant-line" }, Nr = {
  key: 0,
  class: "ks-runas-who"
}, Fr = { class: "ks-runas-verb" }, Vr = { class: "ks-runas-who" }, Or = { class: "ks-runas-grant-meta" }, Rr = { key: 0 }, Er = { key: 1 }, jr = { key: 2 }, Dr = /* @__PURE__ */ K({
  __name: "Delegations",
  props: {
    scopes: {}
  },
  setup(t, { expose: n }) {
    const e = t, o = vr(), { delegations: u, loading: r, saving: f, error: x, confirmation: T, pending: _ } = o, w = P(!1), s = P(!1), z = P(""), U = P(""), M = P(!0), G = _n(), D = P([]), L = V(() => f.value || !!_.value), j = V(() => !!z.value && D.value.length > 0 && (M.value || !!U.value)), O = V(() => {
      const I = {};
      for (const v of e.scopes) I[v.id] = v.label || "Group unavailable";
      return I;
    }), W = P({});
    Rt(u, async (I) => {
      const v = [...new Set(I.map((h) => h.principal.id))].filter((h) => !W.value[h]);
      if (v.length)
        try {
          const { data: h } = await at.post("/api/v1/principals/resolve", { refs: v.map((Z) => ({ type: "user", id: Z })) }), tt = { ...W.value };
          for (const Z of Array.isArray(h?.principals) ? h.principals : [])
            Z && typeof Z.id == "string" && typeof Z.label == "string" && (tt[Z.id] = Z.label);
          W.value = tt;
        } catch (h) {
          x.value = h && typeof h == "object" && "message" in h ? String(h.message) : "Could not resolve account names";
        }
    });
    const g = V(() => u.value.filter((I) => I.active)), R = V(() => u.value.filter((I) => !I.active)), A = V(() => s.value ? [...g.value, ...R.value] : g.value);
    function F(I, v) {
      if (!I || typeof I != "object") return;
      const h = I;
      L.value || h.type !== v || typeof h.id != "string" || (v === "user" ? z.value = h.id : h.id && !D.value.some((tt) => tt.id === h.id) && D.value.push({ id: h.id, label: typeof h.label == "string" ? h.label : h.id }));
    }
    function it(I) {
      const v = I && typeof I == "object" ? I.thread_id : void 0;
      !L.value && typeof v == "string" && (U.value = v);
    }
    function st(I) {
      x.value = I && typeof I == "object" && "message" in I ? String(I.message) : "Could not load the picker";
    }
    function Ct() {
      z.value = "", U.value = "", M.value = !0, D.value = [], w.value = !0;
    }
    async function St() {
      j.value && (await o.mutate("save", {
        principal: { kind: "user", id: z.value },
        root: M.value ? "*" : U.value,
        groups: D.value.map((I) => I.id)
      }), !x.value && !_.value && (w.value = !1));
    }
    async function ct(I) {
      await on.confirm({
        header: "Revoke run-as permission?",
        message: `Members of ${I.groups.map((h) => O.value[h] || "Group unavailable").join(", ")} can no longer choose ${W.value[I.principal.id] || "Account unavailable"} in the Run as setting.`,
        icon: "tabler:user-off",
        acceptLabel: "Revoke",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await o.mutate("revoke", { principal: I.principal, root: I.root });
    }
    return n({ load: o.load }), (I, v) => (a(), d("section", fr, [
      l("div", hr, [
        l("header", gr, [
          l("span", mr, C(g.value.length) + " active " + C(g.value.length === 1 ? "permission" : "permissions"), 1),
          l("div", yr, [
            m(i(Tt), {
              icon: "tabler:refresh",
              label: "Refresh",
              disabled: i(r) || L.value,
              spin: i(r),
              onClick: i(o).load
            }, null, 8, ["disabled", "spin", "onClick"]),
            w.value ? y("", !0) : (a(), $(i(Q), {
              key: 0,
              variant: "primary",
              icon: "tabler:plus",
              disabled: L.value,
              onClick: Ct
            }, {
              default: S(() => [...v[9] || (v[9] = [
                B("New permission", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]))
          ])
        ]),
        v[10] || (v[10] = l("p", { class: "ks-runas-lede" }, [
          B(" Agents, automations and workflows run with the access of the account set in their "),
          l("b", null, "Run as"),
          B(" setting. A permission lets members of a group choose a specific account there, typically a bot account, so the component works with that account's access instead of their own. ")
        ], -1))
      ]),
      l("div", kr, [
        i(x) ? (a(), d("div", $r, [
          m(i(Lt), {
            severity: "danger",
            onDismiss: v[0] || (v[0] = (h) => x.value = "")
          }, {
            default: S(() => [
              B(C(i(x)), 1)
            ]),
            _: 1
          })
        ])) : y("", !0),
        i(T) ? (a(), $(i(Lt), {
          key: 1,
          "data-test": "delegation-confirmation",
          severity: "success",
          onDismiss: v[1] || (v[1] = (h) => T.value = "")
        }, {
          default: S(() => [
            B(C(i(T)), 1)
          ]),
          _: 1
        })) : y("", !0),
        w.value ? (a(), d("form", {
          key: 2,
          class: "ks-runas-form",
          onSubmit: ht(St, ["prevent"])
        }, [
          l("div", wr, [
            v[11] || (v[11] = l("span", null, "New run-as permission", -1)),
            m(i(Tt), {
              icon: "tabler:x",
              label: "Cancel",
              disabled: L.value,
              onClick: v[2] || (v[2] = (h) => w.value = !1)
            }, null, 8, ["disabled"])
          ]),
          l("fieldset", {
            disabled: L.value,
            inert: L.value
          }, [
            l("ol", Cr, [
              l("li", null, [
                m(i(At), {
                  label: "Account to run as",
                  help: "The account whose access the component uses. Its group memberships decide what the component can do."
                }, {
                  default: S(() => [
                    m(Vt, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "user", placeholder: "Choose an account…" },
                      config: { principal_id: z.value },
                      onChange: v[3] || (v[3] = (h) => F(h, "user")),
                      onError: st
                    }, null, 8, ["config"])
                  ]),
                  _: 1
                })
              ]),
              l("li", null, [
                m(i(At), {
                  label: "Who may choose it",
                  help: "Members of these groups see this account in the Run as setting. Nobody's group membership changes."
                }, {
                  default: S(() => [
                    m(Vt, {
                      tag: "wc-principal-picker",
                      attrs: { kinds: "group", placeholder: "Add a group…" },
                      config: {},
                      onChange: v[4] || (v[4] = (h) => F(h, "group")),
                      onError: st
                    })
                  ]),
                  _: 1
                }),
                D.value.length ? (a(), d("div", Sr, [
                  (a(!0), d(et, null, ot(D.value, (h) => (a(), $(i(yn), {
                    key: h.id,
                    label: h.label,
                    removable: !L.value,
                    pt: { removeIcon: { "aria-label": `Remove group ${h.label}` } },
                    onRemove: (tt) => D.value = D.value.filter((Z) => Z.id !== h.id)
                  }, null, 8, ["label", "removable", "pt", "onRemove"]))), 128))
                ])) : y("", !0)
              ]),
              l("li", null, [
                l("fieldset", null, [
                  v[14] || (v[14] = l("legend", { class: "km-field-label" }, "On which components", -1)),
                  l("div", Br, [
                    l("label", {
                      class: "ks-runas-component-option",
                      for: `${i(G)}-any`
                    }, [
                      m(i(Ut), {
                        modelValue: M.value,
                        "onUpdate:modelValue": v[5] || (v[5] = (h) => M.value = h),
                        "input-id": `${i(G)}-any`,
                        name: i(G),
                        value: !0,
                        disabled: L.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[12] || (v[12] = B(" Any component ", -1))
                    ], 8, Ir),
                    l("label", {
                      class: "ks-runas-component-option",
                      for: `${i(G)}-one`
                    }, [
                      m(i(Ut), {
                        modelValue: M.value,
                        "onUpdate:modelValue": v[6] || (v[6] = (h) => M.value = h),
                        "input-id": `${i(G)}-one`,
                        name: i(G),
                        value: !1,
                        disabled: L.value
                      }, null, 8, ["modelValue", "input-id", "name", "disabled"]),
                      v[13] || (v[13] = B(" One component ", -1))
                    ], 8, Pr)
                  ]),
                  v[15] || (v[15] = l("small", { class: "km-field-help" }, "The person choosing the account must also be able to manage the component.", -1))
                ]),
                M.value ? y("", !0) : (a(), $(Vt, {
                  key: 0,
                  class: "ks-runas-component",
                  tag: "wc-component-picker",
                  attrs: { source: "/api/v1/security/delegations/roots", title: "Component", placeholder: "Choose a component you manage…" },
                  config: U.value ? { thread_id: U.value } : {},
                  onChange: it,
                  onError: st
                }, null, 8, ["config"]))
              ])
            ])
          ], 8, xr),
          l("div", Tr, [
            m(i(Q), {
              variant: "ghost",
              small: "",
              disabled: L.value,
              onClick: v[7] || (v[7] = (h) => w.value = !1)
            }, {
              default: S(() => [...v[16] || (v[16] = [
                B("Cancel", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            m(i(Q), {
              variant: "primary",
              small: "",
              icon: "tabler:device-floppy",
              disabled: !j.value || L.value,
              loading: i(f),
              onClick: St
            }, {
              default: S(() => [...v[17] || (v[17] = [
                B("Save permission", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "loading"])
          ])
        ], 32)) : y("", !0),
        i(_) && !i(f) ? (a(), d("div", Ar, [
          v[19] || (v[19] = l("span", null, "We could not confirm whether the permission changed. Select Retry to check before making another change.", -1)),
          m(i(Q), {
            small: "",
            onClick: i(o).submit
          }, {
            default: S(() => [...v[18] || (v[18] = [
              B("Retry", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ])) : y("", !0),
        R.value.length ? (a(), $(i(Q), {
          key: 4,
          class: "ks-runas-history",
          variant: "ghost",
          small: "",
          "aria-expanded": s.value,
          onClick: v[8] || (v[8] = (h) => s.value = !s.value)
        }, {
          default: S(() => [
            B(C(s.value ? "Hide revoked permissions" : "Show revoked permissions"), 1)
          ]),
          _: 1
        }, 8, ["aria-expanded"])) : y("", !0),
        i(r) && !i(u).length ? (a(), $(i(hn), {
          key: 5,
          label: "Loading run-as permissions…"
        })) : A.value.length ? (a(), d("div", zr, [
          (a(!0), d(et, null, ot(A.value, (h) => (a(), d("article", {
            key: h.policy_id,
            class: X(["kx-card ks-runas-grant", { revoked: !h.active }])
          }, [
            m(i(E), {
              class: "ks-runas-grant-icon",
              icon: "tabler:user-shield",
              "aria-hidden": "true"
            }),
            l("div", Lr, [
              l("div", _r, [
                h.active ? (a(), d("span", Nr, C(h.groups.map((tt) => O.value[tt] || "Group unavailable").join(", ")), 1)) : y("", !0),
                l("span", Fr, C(h.active ? "can run as" : "Permission to run as"), 1),
                l("span", Vr, C(W.value[h.principal.id] || "Account unavailable"), 1)
              ]),
              l("div", Or, [
                h.root === "*" ? (a(), d("span", Rr, "on any component they manage")) : h.root_label ? (a(), d("span", Er, [
                  v[20] || (v[20] = B("on ", -1)),
                  l("b", null, C(h.root_label), 1)
                ])) : (a(), d("span", jr, "on an unavailable component"))
              ])
            ]),
            h.active ? (a(), $(i(Q), {
              key: 1,
              variant: "ghost",
              small: "",
              icon: "tabler:user-off",
              disabled: L.value,
              "aria-label": `Revoke run-as permission for ${W.value[h.principal.id] || "Account unavailable"}`,
              onClick: (tt) => ct(h)
            }, {
              default: S(() => [...v[22] || (v[22] = [
                B("Revoke", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])) : (a(), $(i(zt), {
              key: 0,
              severity: "secondary"
            }, {
              default: S(() => [...v[21] || (v[21] = [
                B("revoked", -1)
              ])]),
              _: 1
            }))
          ], 2))), 128))
        ])) : !i(x) && !w.value ? (a(), $(i(gn), {
          key: 7,
          icon: "tabler:user-shield",
          title: "No active run-as permissions"
        }, {
          hint: S(() => [...v[23] || (v[23] = [
            B("Without an active permission, the Run as setting offers only ", -1),
            l("b", null, "Me", -1),
            B(".", -1)
          ])]),
          _: 1
        })) : y("", !0)
      ])
    ]));
  }
}), Kr = ["draggable"], Ur = { class: "ks-pcard-row" }, Mr = { class: "ks-pcard-body" }, Wr = { class: "ks-pcard-head" }, Hr = ["title"], Gr = {
  key: 0,
  class: "ks-pcard-comment"
}, qr = {
  key: 1,
  class: "ks-pcard-comment"
}, Zr = ["aria-label"], Jr = ["aria-label"], vt = /* @__PURE__ */ K({
  __name: "PolicyCard",
  props: {
    policy: {},
    mode: {}
  },
  emits: ["add", "remove"],
  setup(t, { emit: n }) {
    const e = t, o = n, u = V(() => e.policy.available === !1 ? e.policy.id : e.policy.title && e.policy.title !== e.policy.id ? e.policy.title : "Unnamed permission");
    function r(f) {
      e.mode === "locked" || !f.dataTransfer || (f.dataTransfer.setData("text/plain", e.policy.id), f.dataTransfer.effectAllowed = e.mode === "palette" ? "copy" : "move");
    }
    return (f, x) => (a(), d("div", {
      class: X(["kx-card ks-pcard", t.mode]),
      draggable: t.mode !== "locked",
      onDragstart: r,
      onDblclick: x[2] || (x[2] = (T) => t.mode === "palette" && o("add"))
    }, [
      l("div", Ur, [
        t.mode === "locked" ? (a(), $(i(E), {
          key: 0,
          icon: "tabler:lock",
          class: "ks-pcard-grip locked",
          "aria-hidden": "true"
        })) : (a(), $(i(E), {
          key: 1,
          icon: "tabler:grip-vertical",
          class: "ks-pcard-grip",
          "aria-hidden": "true"
        })),
        l("div", Mr, [
          l("div", Wr, [
            t.policy.effect === "allow" || t.policy.effect === "deny" ? (a(), $(zt, {
              key: 0,
              severity: t.policy.effect === "allow" ? "success" : "danger"
            }, {
              default: S(() => [
                B(C(t.policy.effect === "deny" ? "Blocks" : "Allows"), 1)
              ]),
              _: 1
            }, 8, ["severity"])) : y("", !0),
            l("span", {
              class: "ks-pcard-title",
              title: u.value
            }, C(u.value), 9, Hr)
          ]),
          t.policy.available === !1 ? (a(), d("div", Gr, "No longer available")) : t.policy.comment ? (a(), d("div", qr, C(t.policy.comment), 1)) : y("", !0)
        ]),
        t.mode === "palette" ? (a(), d("button", {
          key: 2,
          class: "ks-pcard-act add",
          "aria-label": `Add permission ${u.value}`,
          onClick: x[0] || (x[0] = ht((T) => o("add"), ["stop"]))
        }, [
          m(i(E), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ], 8, Zr)) : t.mode === "selected" ? (a(), d("button", {
          key: 3,
          class: "ks-pcard-act remove",
          "aria-label": `Remove permission ${u.value}`,
          onClick: x[1] || (x[1] = ht((T) => o("remove"), ["stop"]))
        }, [
          m(i(E), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ], 8, Jr)) : y("", !0)
      ])
    ], 42, Kr));
  }
}), Qr = { class: "ks" }, Xr = { class: "ks-rail-search" }, Yr = { class: "ks-rail-list" }, ta = {
  key: 0,
  class: "ks-rail-group"
}, na = ["onClick"], ea = { class: "ks-scope-name" }, oa = ["onClick"], ra = { class: "ks-scope-name" }, aa = {
  key: 0,
  class: "ks-builder"
}, ia = { class: "ks-builder-head" }, la = { class: "ks-builder-title" }, sa = { class: "ks-builder-acts" }, da = {
  key: 0,
  class: "ks-overlay-warn"
}, ua = {
  key: 1,
  class: "ks-view-note"
}, ca = { class: "ks-fields" }, ba = {
  key: 0,
  class: "ks-pane locked-pane"
}, pa = { class: "ks-pane-head" }, va = { class: "ks-pane-sub" }, fa = { class: "ks-pane-body" }, ha = {
  key: 0,
  class: "ks-pane-empty"
}, ga = { class: "ks-pane" }, ma = { class: "ks-pane-search" }, ya = { class: "ks-pane-body" }, ka = {
  key: 0,
  class: "ks-pane-empty"
}, $a = { class: "ks-pane-head" }, wa = { class: "ks-pane-sub" }, xa = { class: "ks-pane-body" }, Ca = ["onDrop"], Sa = {
  key: 0,
  class: "ks-drop-hint"
}, Ba = {
  key: 1,
  class: "ks-view"
}, Ia = { class: "ks-builder-head" }, Pa = { class: "ks-builder-title" }, Ta = { class: "ks-builder-acts" }, Aa = { class: "ks-pane-body ks-view-list" }, za = {
  key: 0,
  class: "ks-pane-empty"
}, La = {
  key: 0,
  class: "ks-ext-block"
}, _a = { class: "ks-ext-head" }, Na = { class: "ks-pane-body ks-view-list" }, Fa = {
  key: 2,
  class: "kx-system-body"
}, Va = /* @__PURE__ */ K({
  __name: "Security",
  setup(t) {
    const n = pr(), { scopes: e, assignablePolicies: o, installedPolicies: u, loading: r, saving: f, error: x } = n, T = P(""), _ = P(""), w = P(null), s = P(null), z = P("scopes"), U = P(null), M = P(!1);
    async function G(b) {
      z.value = String(b), b === "delegations" && (M.value = !0, await en(), await U.value?.load());
    }
    In(async () => {
      await n.load(), z.value === "delegations" && await U.value?.load();
    });
    const D = V(() => {
      const b = T.value.trim().toLowerCase(), c = (p) => !b || p.label.toLowerCase().includes(b) || p.id.toLowerCase().includes(b);
      return {
        custom: e.value.filter((p) => p.source === "custom" && c(p)),
        builtin: e.value.filter((p) => p.source !== "custom" && c(p))
      };
    }), L = V(() => e.value.find((b) => b.id === w.value) || null), j = V(() => L.value && L.value.source !== "custom" ? L.value : null), O = V(() => !!s.value?.target), W = V(() => O.value ? j.value?.policies ?? [] : []), g = V(() => new Map(u.value.map((b) => [b.id, b]))), R = V(() => (s.value?.policyIds ?? []).map((b) => g.value.get(b) ?? { id: b, available: !1 })), A = V(() => {
      if (!s.value) return [];
      const b = /* @__PURE__ */ new Set([...s.value.policyIds, ...W.value.map((p) => p.id)]), c = _.value.trim().toLowerCase();
      return o.value.filter((p) => !b.has(p.id) && (!c || (p.title || "").toLowerCase().includes(c) || p.id.toLowerCase().includes(c) || (p.comment || "").toLowerCase().includes(c)));
    });
    function F(b) {
      w.value = b.id, s.value = b.source === "custom" ? { slug: b.slug || "", label: b.label, description: b.description, policyIds: b.policies.map((c) => c.id), enabled: b.enabled, isNew: !1, target: "" } : null;
    }
    function it() {
      w.value = null, s.value = { slug: Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join(""), label: "", description: "", policyIds: [], enabled: !0, isNew: !0, target: "" };
    }
    function st(b) {
      it(), Object.assign(s.value, {
        label: b.label ? `Copy of ${b.label}` : "",
        description: b.description,
        policyIds: [...b.policies, ...b.overlay_policies ?? []].filter((c) => c.available !== !1).map((c) => c.id)
      });
    }
    function Ct(b) {
      return b.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
    }
    function St(b) {
      w.value = b.id, s.value = {
        slug: b.overlay_slug || Ct(b.id),
        label: b.label || dt(b.id),
        description: b.description,
        policyIds: (b.overlay_policies ?? []).map((c) => c.id),
        enabled: !0,
        isNew: !b.overlay_slug,
        target: b.id
      };
    }
    function ct(b, c) {
      !s.value || s.value.policyIds.includes(b) || W.value.some((p) => p.id === b) || o.value.some((p) => p.id === b) && s.value.policyIds.splice(c ?? s.value.policyIds.length, 0, b);
    }
    function I(b) {
      s.value && (s.value.policyIds = s.value.policyIds.filter((c) => c !== b));
    }
    function v(b) {
      const c = b.dataTransfer?.getData("text/plain");
      c && ct(c);
    }
    function h(b, c) {
      b.stopPropagation();
      const p = b.dataTransfer?.getData("text/plain");
      if (!p || !s.value || p === c) return;
      const q = s.value.policyIds, Nt = q.indexOf(p);
      if (Nt === -1) {
        ct(p, q.indexOf(c));
        return;
      }
      q.splice(Nt, 1), q.splice(q.indexOf(c), 0, p);
    }
    const tt = V(() => s.value ? !s.value.isNew || s.value.target ? s.value.slug : `${Ct(s.value.label.normalize("NFKD").replace(/\p{M}/gu, "")).toLowerCase() || "role"}_${s.value.slug}` : ""), Z = V(() => !!s.value && s.value.label.trim() !== "" && (!s.value.isNew || s.value.policyIds.length > 0)), bt = P("");
    let pt = null;
    Nn(() => {
      pt && clearTimeout(pt);
    });
    function kn(b) {
      bt.value = b, pt && clearTimeout(pt), pt = setTimeout(() => {
        bt.value = "";
      }, 3e3);
    }
    async function $n() {
      if (!s.value || !Z.value) return;
      const b = s.value, c = tt.value, p = s.value.target, q = s.value.label.trim() || c;
      await n.saveScope({
        slug: c,
        target: p,
        label: s.value.label.trim(),
        description: s.value.description.trim(),
        policies: [...s.value.policyIds],
        enabled: s.value.enabled
      }) && (b.slug = c, b.isNew = !1, s.value === b && (w.value = p || `kickside.security.scopes:${c}`), kn(`Saved “${q}”. The role will be available when assigning users.`));
    }
    async function wn() {
      if (!s.value || s.value.isNew) return;
      const b = O.value;
      if (!await on.confirm({
        header: b ? "Remove extension?" : "Delete role?",
        message: b ? "This removes the added permissions. Users keep the role’s original permissions." : "This removes the custom role and its permissions.",
        icon: "tabler:trash",
        acceptLabel: b ? "Remove extension" : "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      await n.deleteScope(s.value.slug) && (s.value = null, w.value = null);
    }
    function dt(b) {
      return b.includes(":") ? b.split(":").slice(-1)[0] : b;
    }
    return (b, c) => (a(), d("div", Qr, [
      m(pe, {
        value: z.value,
        label: "Security administration",
        items: [
          { value: "scopes", label: "Roles" },
          { value: "delegations", label: "Run as" }
        ],
        "onUpdate:value": G
      }, null, 8, ["value"]),
      M.value ? ut((a(), $(Dr, {
        key: 0,
        ref_key: "delegationPanel",
        ref: U,
        scopes: i(e)
      }, null, 8, ["scopes"])), [
        [Jt, z.value === "delegations"]
      ]) : y("", !0),
      i(x) ? (a(), $(i(Lt), {
        key: 1,
        severity: "danger",
        class: "ks-top-notice",
        onDismiss: c[0] || (c[0] = (p) => x.value = "")
      }, {
        default: S(() => [
          B(C(i(x)), 1)
        ]),
        _: 1
      })) : bt.value ? (a(), $(i(Lt), {
        key: 2,
        severity: "success",
        class: "ks-top-notice",
        onDismiss: c[1] || (c[1] = (p) => bt.value = "")
      }, {
        default: S(() => [
          B(C(bt.value), 1)
        ]),
        _: 1
      })) : y("", !0),
      z.value === "scopes" && i(r) && !i(e).length ? (a(), $(i(hn), {
        key: 3,
        label: "Loading security…"
      })) : ut((a(), $(i(ge), { key: 4 }, {
        rail: S(() => [
          m(i(we), {
            title: "Roles",
            count: i(e).length
          }, {
            actions: S(() => [
              m(i(Tt), {
                icon: "tabler:plus",
                label: "New role",
                disabled: i(f),
                onClick: it
              }, null, 8, ["disabled"]),
              m(i(Tt), {
                icon: "tabler:refresh",
                label: "Refresh",
                disabled: i(r),
                spin: i(r),
                onClick: i(n).load
              }, null, 8, ["disabled", "spin", "onClick"])
            ]),
            _: 1
          }, 8, ["count"]),
          l("div", Xr, [
            m(i(Xt), {
              modelValue: T.value,
              "onUpdate:modelValue": c[2] || (c[2] = (p) => T.value = p),
              placeholder: "Find a role…"
            }, null, 8, ["modelValue"])
          ]),
          l("div", Yr, [
            D.value.custom.length ? (a(), d("div", ta, "Custom")) : y("", !0),
            (a(!0), d(et, null, ot(D.value.custom, (p) => (a(), d("button", {
              key: p.id,
              class: X(["ks-scope-row", { active: p.id === w.value }]),
              onClick: (q) => F(p)
            }, [
              l("span", ea, C(p.label || dt(p.id)), 1)
            ], 10, na))), 128)),
            c[11] || (c[11] = l("div", { class: "ks-rail-group" }, "Default", -1)),
            (a(!0), d(et, null, ot(D.value.builtin, (p) => (a(), d("button", {
              key: p.id,
              class: X(["ks-scope-row", { active: p.id === w.value }]),
              onClick: (q) => F(p)
            }, [
              l("span", ra, C(p.label || dt(p.id)), 1)
            ], 10, oa))), 128))
          ])
        ]),
        default: S(() => [
          s.value ? (a(), d("div", aa, [
            l("div", ia, [
              l("div", la, [
                m(i(E), {
                  icon: O.value ? "tabler:stack-2" : "tabler:shield-lock",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                l("span", null, C(O.value ? `Extend ${s.value.label || dt(s.value.target)}` : s.value.isNew ? "New role" : s.value.label || s.value.slug), 1),
                O.value ? (a(), $(i(zt), {
                  key: 0,
                  severity: "warn"
                }, {
                  default: S(() => [...c[12] || (c[12] = [
                    B("Additional permissions", -1)
                  ])]),
                  _: 1
                })) : y("", !0)
              ]),
              l("div", sa, [
                !s.value.isNew && !O.value && L.value ? (a(), $(i(Q), {
                  key: 0,
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  disabled: i(f),
                  onClick: c[3] || (c[3] = (p) => st(L.value))
                }, {
                  default: S(() => [...c[13] || (c[13] = [
                    B("Duplicate", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])) : y("", !0),
                s.value.isNew ? y("", !0) : (a(), $(i(Q), {
                  key: 1,
                  variant: "danger",
                  small: "",
                  icon: "tabler:trash",
                  disabled: i(f),
                  onClick: wn
                }, {
                  default: S(() => [
                    B(C(O.value ? "Remove extension" : "Delete"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])),
                m(i(Q), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:device-floppy",
                  loading: i(f),
                  disabled: !Z.value,
                  onClick: $n
                }, {
                  default: S(() => [
                    B(C(O.value ? "Save extension" : "Save role"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ]),
            O.value ? (a(), d("div", da, [
              m(i(E), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              l("span", null, [
                c[14] || (c[14] = B("Adding permissions grants them to ", -1)),
                l("b", null, "everyone assigned " + C(L.value?.label || dt(s.value.target)), 1),
                c[15] || (c[15] = B(". Original permissions cannot be removed here. To restrict access, create a new role with only the permissions needed.", -1))
              ])
            ])) : (a(), d("p", ua, "Choose the permissions this role grants, then assign it in System → Users. To restrict a Member, assign this role instead of Member; other assigned roles may still grant access.")),
            l("div", ca, [
              m(i(At), { label: "Name" }, {
                default: S(() => [
                  m(i(Yt), {
                    modelValue: s.value.label,
                    "onUpdate:modelValue": c[4] || (c[4] = (p) => s.value.label = p),
                    placeholder: "Reviewer"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              m(i(At), { label: "Description" }, {
                default: S(() => [
                  m(i(Yt), {
                    modelValue: s.value.description,
                    "onUpdate:modelValue": c[5] || (c[5] = (p) => s.value.description = p),
                    placeholder: "Read-only reviewer role"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            l("div", {
              class: X(["ks-panes", { three: O.value }])
            }, [
              O.value ? (a(), d("section", ba, [
                l("header", pa, [
                  c[16] || (c[16] = l("span", null, "Original permissions", -1)),
                  l("span", va, C(W.value.length) + " · locked", 1)
                ]),
                l("div", fa, [
                  (a(!0), d(et, null, ot(W.value, (p) => (a(), $(vt, {
                    key: p.id,
                    policy: p,
                    mode: "locked"
                  }, null, 8, ["policy"]))), 128)),
                  W.value.length ? y("", !0) : (a(), d("div", ha, "No original permissions."))
                ])
              ])) : y("", !0),
              l("section", ga, [
                c[17] || (c[17] = l("header", { class: "ks-pane-head" }, [
                  l("span", null, "Available permissions"),
                  l("span", { class: "ks-pane-sub" }, "Click + to add")
                ], -1)),
                l("div", ma, [
                  m(i(Xt), {
                    modelValue: _.value,
                    "onUpdate:modelValue": c[6] || (c[6] = (p) => _.value = p),
                    placeholder: "Search permissions…"
                  }, null, 8, ["modelValue"])
                ]),
                l("div", ya, [
                  (a(!0), d(et, null, ot(A.value, (p) => (a(), $(vt, {
                    key: p.id,
                    policy: p,
                    mode: "palette",
                    onAdd: (q) => ct(p.id)
                  }, null, 8, ["policy", "onAdd"]))), 128)),
                  A.value.length ? y("", !0) : (a(), d("div", ka, "No matching permissions."))
                ])
              ]),
              l("section", {
                class: "ks-pane drop",
                onDragover: c[8] || (c[8] = ht(() => {
                }, ["prevent"])),
                onDrop: v
              }, [
                l("header", $a, [
                  l("span", null, C(O.value ? "Added by you" : "In this role"), 1),
                  l("span", wa, C(R.value.length) + " " + C(R.value.length === 1 ? "permission" : "permissions"), 1)
                ]),
                l("div", xa, [
                  (a(!0), d(et, null, ot(R.value, (p) => (a(), d("div", {
                    key: p.id,
                    onDragover: c[7] || (c[7] = ht(() => {
                    }, ["prevent"])),
                    onDrop: (q) => h(q, p.id)
                  }, [
                    m(vt, {
                      policy: p,
                      mode: "selected",
                      onRemove: (q) => I(p.id)
                    }, null, 8, ["policy", "onRemove"])
                  ], 40, Ca))), 128)),
                  R.value.length ? y("", !0) : (a(), d("div", Sa, [
                    m(i(E), {
                      icon: "tabler:drag-drop",
                      "aria-hidden": "true"
                    }),
                    c[18] || (c[18] = l("span", null, "Use + on an available permission, or drag it here.", -1))
                  ]))
                ])
              ], 32)
            ], 2)
          ])) : j.value ? (a(), d("div", Ba, [
            l("div", Ia, [
              l("div", Pa, [
                m(i(E), {
                  icon: "tabler:shield",
                  "aria-hidden": "true"
                }),
                l("span", null, C(j.value.label || dt(j.value.id)), 1)
              ]),
              l("div", Ta, [
                m(i(Q), {
                  variant: "primary",
                  small: "",
                  icon: "tabler:stack-2",
                  onClick: c[9] || (c[9] = (p) => St(j.value))
                }, {
                  default: S(() => [
                    B(C(j.value.overlay_slug ? "Edit extension" : "Add permissions"), 1)
                  ]),
                  _: 1
                }),
                m(i(Q), {
                  variant: "soft",
                  small: "",
                  icon: "tabler:copy",
                  onClick: c[10] || (c[10] = (p) => st(j.value))
                }, {
                  default: S(() => [...c[19] || (c[19] = [
                    B("Copy role", -1)
                  ])]),
                  _: 1
                })
              ])
            ]),
            c[21] || (c[21] = l("p", { class: "ks-view-note" }, " Included with the application. Adding permissions affects everyone with this role. For restricted access, create a new role with only the permissions needed and assign it in System → Users instead of this role. Other assigned roles may still grant access. ", -1)),
            l("div", Aa, [
              (a(!0), d(et, null, ot(j.value.policies, (p) => (a(), $(vt, {
                key: p.id,
                policy: p,
                mode: "locked"
              }, null, 8, ["policy"]))), 128)),
              j.value.policies.length ? y("", !0) : (a(), d("div", za, "No permissions in this role."))
            ]),
            j.value.overlay_policies && j.value.overlay_policies.length ? (a(), d("div", La, [
              l("div", _a, [
                m(i(E), {
                  icon: "tabler:stack-2",
                  "aria-hidden": "true"
                }),
                c[20] || (c[20] = l("span", null, "Additional permissions", -1)),
                m(i(zt), { severity: "warn" }, {
                  default: S(() => [
                    B(C(j.value.overlay_policies.length), 1)
                  ]),
                  _: 1
                })
              ]),
              l("div", Na, [
                (a(!0), d(et, null, ot(j.value.overlay_policies, (p) => (a(), $(vt, {
                  key: p.id,
                  policy: p,
                  mode: "locked"
                }, null, 8, ["policy"]))), 128))
              ])
            ])) : y("", !0)
          ])) : (a(), d("div", Fa, [
            m(i(gn), {
              icon: "tabler:shield-lock",
              title: "Roles",
              hint: "Choose a role to view its permissions, or create one with the permissions your team needs. Assign roles in System → Users.",
              cta: "New role",
              "cta-icon": "tabler:plus",
              onCta: it
            })
          ]))
        ]),
        _: 1
      }, 512)), [
        [Jt, z.value === "scopes"]
      ])
    ]));
  }
}), Da = {
  rootComponent: Va,
  plugins: [Pn]
};
export {
  Da as mountConfig
};
//# sourceMappingURL=lazy-mount-zci5oQrf.js.map
