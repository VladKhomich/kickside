import { B as Y, R as qe, s as le, f as fe, k as Tt, b as Q, Q as ue, z as be, a as Ze, c as ge, T as Bt, C as Lt, K as ce, v as Pt, V as De, L as Vt, d as te, e as Et, U as Ot, I as Ne, g as It, h as At, r as Je, i as Dt, j as Nt, x as $e, l as Ft, m as Rt, P as zt } from "./wc-runtime-CHL0PH8L.js";
import { mergeProps as B, resolveDirective as Be, withDirectives as X, openBlock as l, createBlock as S, resolveDynamicComponent as ae, withCtx as k, renderSlot as O, normalizeClass as U, createElementBlock as f, createElementVNode as u, createCommentVNode as $, defineComponent as I, unref as o, createVNode as b, Fragment as R, renderList as j, createTextVNode as T, toDisplayString as y, getCurrentInstance as jt, computed as w, ref as A, withModifiers as Ge, vModelText as Qe, createSlots as Xe, resolveComponent as Fe, Transition as Mt, normalizeStyle as Kt, reactive as Ye, toRef as Ut, watch as Le } from "vue";
import { host as Re } from "@wippy-fe/proxy";
import { Icon as D } from "@iconify/vue";
import { s as Pe, _ as Ve, a as oe, b as F, c as M, d as ze, e as Ht, i as Wt, f as qt } from "./ProviderProfileEditor.vue_vue_type_script_setup_true_lang-DiTfn-yc.js";
import { s as Zt, p as Jt, h as Gt, a as Qt, b as Xt, m as Ee, o as Yt, c as en, d as tn, e as nn, f as pe, _ as ne, i as je, g as Me, j as _e, u as an, k as on, l as sn } from "./useModelsApi-Bk1pY9iW.js";
var rn = {
  root: function(t) {
    var n = t.instance, a = t.props;
    return ["p-tab", {
      "p-tab-active": n.active,
      "p-disabled": a.disabled
    }];
  }
}, ln = Y.extend({
  name: "tab",
  classes: rn
}), dn = {
  name: "BaseTab",
  extends: le,
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
  style: ln,
  provide: function() {
    return {
      $pcTab: this,
      $parentInstance: this
    };
  }
}, et = {
  name: "Tab",
  extends: dn,
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
      return a ? ue(a, "data-p-disabled") || ue(a, "data-pc-section") === "activebar" ? this.findNextTab(a) : be(a, '[data-pc-name="tab"]') : null;
    },
    findPrevTab: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, a = n ? t : t.previousElementSibling;
      return a ? ue(a, "data-p-disabled") || ue(a, "data-pc-section") === "activebar" ? this.findPrevTab(a) : be(a, '[data-pc-name="tab"]') : null;
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
      Q(n), this.scrollInView(n);
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
      return Tt((t = this.$pcTabs) === null || t === void 0 ? void 0 : t.d_value, this.value);
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
      return B(this.asAttrs, this.a11yAttrs, this.ptmi("root", this.ptParams));
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
      return fe({
        active: this.active
      });
    }
  },
  directives: {
    ripple: qe
  }
};
function un(e, t, n, a, d, i) {
  var s = Be("ripple");
  return e.asChild ? O(e.$slots, "default", {
    key: 1,
    dataP: i.dataP,
    class: U(e.cx("root")),
    active: i.active,
    a11yAttrs: i.a11yAttrs,
    onClick: i.onClick
  }) : X((l(), S(ae(e.as), B({
    key: 0,
    class: e.cx("root"),
    "data-p": i.dataP,
    onClick: i.onClick
  }, i.attrs), {
    default: k(function() {
      return [O(e.$slots, "default")];
    }),
    _: 3
  }, 16, ["class", "data-p", "onClick"])), [[s]]);
}
et.render = un;
var tt = {
  name: "ChevronLeftIcon",
  extends: Ze
};
function cn(e) {
  return vn(e) || fn(e) || bn(e) || pn();
}
function pn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bn(e, t) {
  if (e) {
    if (typeof e == "string") return Se(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Se(e, t) : void 0;
  }
}
function fn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function vn(e) {
  if (Array.isArray(e)) return Se(e);
}
function Se(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, a = Array(t); n < t; n++) a[n] = e[n];
  return a;
}
function mn(e, t, n, a, d, i) {
  return l(), f("svg", B({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), cn(t[0] || (t[0] = [u("path", {
    d: "M9.61296 13C9.50997 13.0005 9.40792 12.9804 9.3128 12.9409C9.21767 12.9014 9.13139 12.8433 9.05902 12.7701L3.83313 7.54416C3.68634 7.39718 3.60388 7.19795 3.60388 6.99022C3.60388 6.78249 3.68634 6.58325 3.83313 6.43628L9.05902 1.21039C9.20762 1.07192 9.40416 0.996539 9.60724 1.00012C9.81032 1.00371 10.0041 1.08597 10.1477 1.22959C10.2913 1.37322 10.3736 1.56698 10.3772 1.77005C10.3808 1.97313 10.3054 2.16968 10.1669 2.31827L5.49496 6.99022L10.1669 11.6622C10.3137 11.8091 10.3962 12.0084 10.3962 12.2161C10.3962 12.4238 10.3137 12.6231 10.1669 12.7701C10.0945 12.8433 10.0083 12.9014 9.91313 12.9409C9.81801 12.9804 9.71596 13.0005 9.61296 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
tt.render = mn;
var nt = {
  name: "ChevronRightIcon",
  extends: Ze
};
function hn(e) {
  return $n(e) || gn(e) || kn(e) || yn();
}
function yn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function kn(e, t) {
  if (e) {
    if (typeof e == "string") return xe(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? xe(e, t) : void 0;
  }
}
function gn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function $n(e) {
  if (Array.isArray(e)) return xe(e);
}
function xe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, a = Array(t); n < t; n++) a[n] = e[n];
  return a;
}
function wn(e, t, n, a, d, i) {
  return l(), f("svg", B({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), hn(t[0] || (t[0] = [u("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
nt.render = wn;
var Cn = {
  root: "p-tablist",
  content: "p-tablist-content p-tablist-viewport",
  tabList: "p-tablist-tab-list",
  activeBar: "p-tablist-active-bar",
  prevButton: "p-tablist-prev-button p-tablist-nav-button",
  nextButton: "p-tablist-next-button p-tablist-nav-button"
}, _n = Y.extend({
  name: "tablist",
  classes: Cn
}), Sn = {
  name: "BaseTabList",
  extends: le,
  props: {},
  style: _n,
  provide: function() {
    return {
      $pcTabList: this,
      $parentInstance: this
    };
  }
}, at = {
  name: "TabList",
  extends: Sn,
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
      var t = this.$refs.content, n = this.getVisibleButtonWidths(), a = ge(t) - n, d = Math.abs(t.scrollLeft), i = a * 0.8, s = d - i, m = Math.max(s, 0);
      t.scrollLeft = De(t) ? -1 * m : m;
    },
    onNextButtonClick: function() {
      var t = this.$refs.content, n = this.getVisibleButtonWidths(), a = ge(t) - n, d = Math.abs(t.scrollLeft), i = a * 0.8, s = d + i, m = t.scrollWidth - a, h = Math.min(s, m);
      t.scrollLeft = De(t) ? -1 * h : h;
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
      var n = this.$refs.content, a = be(n, '[data-pc-name="tab"][data-p-active="true"]');
      a && (this.inkBarObserver = new ResizeObserver(function() {
        return t.updateInkBar();
      }), this.inkBarObserver.observe(a));
    },
    unbindInkBarObserver: function() {
      var t;
      (t = this.inkBarObserver) === null || t === void 0 || t.disconnect(), this.inkBarObserver = void 0;
    },
    updateInkBar: function() {
      var t = this.$refs, n = t.content, a = t.inkbar, d = t.tabs;
      if (a) {
        var i = be(n, '[data-pc-name="tab"][data-p-active="true"]');
        this.$pcTabs.isVertical() ? (a.style.height = Lt(i) + "px", a.style.top = ce(i).top - ce(d).top + "px") : (a.style.width = Pt(i) + "px", a.style.left = ce(i).left - ce(d).left + "px");
      }
    },
    updateButtonState: function() {
      var t = this.$refs, n = t.list, a = t.content, d = a.scrollTop, i = a.scrollWidth, s = a.scrollHeight, m = a.offsetWidth, h = a.offsetHeight, x = Math.abs(a.scrollLeft), g = [ge(a), Bt(a)], c = g[0], r = g[1];
      this.$pcTabs.isVertical() ? (this.isPrevButtonEnabled = d !== 0, this.isNextButtonEnabled = n.offsetHeight >= h && parseInt(d) !== s - r) : (this.isPrevButtonEnabled = x !== 0, this.isNextButtonEnabled = n.offsetWidth >= m && parseInt(x) !== i - c);
    },
    getVisibleButtonWidths: function() {
      var t = this.$refs, n = t.prevButton, a = t.nextButton, d = 0;
      return this.showNavigators && (d = (n?.offsetWidth || 0) + (a?.offsetWidth || 0)), d;
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
      return fe({
        scrollable: this.$pcTabs.scrollable
      });
    }
  },
  components: {
    ChevronLeftIcon: tt,
    ChevronRightIcon: nt
  },
  directives: {
    ripple: qe
  }
}, xn = ["data-p"], Tn = ["aria-label", "tabindex"], Bn = ["data-p"], Ln = ["aria-orientation"], Pn = ["aria-label", "tabindex"];
function Vn(e, t, n, a, d, i) {
  var s = Be("ripple");
  return l(), f("div", B({
    ref: "list",
    class: e.cx("root"),
    "data-p": i.dataP
  }, e.ptmi("root")), [i.showNavigators && d.isPrevButtonEnabled ? X((l(), f("button", B({
    key: 0,
    ref: "prevButton",
    type: "button",
    class: e.cx("prevButton"),
    "aria-label": i.prevButtonAriaLabel,
    tabindex: i.$pcTabs.tabindex,
    onClick: t[0] || (t[0] = function() {
      return i.onPrevButtonClick && i.onPrevButtonClick.apply(i, arguments);
    })
  }, e.ptm("prevButton"), {
    "data-pc-group-section": "navigator"
  }), [(l(), S(ae(i.templates.previcon || "ChevronLeftIcon"), B({
    "aria-hidden": "true"
  }, e.ptm("prevIcon")), null, 16))], 16, Tn)), [[s]]) : $("", !0), u("div", B({
    ref: "content",
    class: e.cx("content"),
    onScroll: t[1] || (t[1] = function() {
      return i.onScroll && i.onScroll.apply(i, arguments);
    }),
    "data-p": i.dataP
  }, e.ptm("content")), [u("div", B({
    ref: "tabs",
    class: e.cx("tabList"),
    role: "tablist",
    "aria-orientation": i.$pcTabs.orientation || "horizontal"
  }, e.ptm("tabList")), [O(e.$slots, "default"), u("span", B({
    ref: "inkbar",
    class: e.cx("activeBar"),
    role: "presentation",
    "aria-hidden": "true"
  }, e.ptm("activeBar")), null, 16)], 16, Ln)], 16, Bn), i.showNavigators && d.isNextButtonEnabled ? X((l(), f("button", B({
    key: 1,
    ref: "nextButton",
    type: "button",
    class: e.cx("nextButton"),
    "aria-label": i.nextButtonAriaLabel,
    tabindex: i.$pcTabs.tabindex,
    onClick: t[2] || (t[2] = function() {
      return i.onNextButtonClick && i.onNextButtonClick.apply(i, arguments);
    })
  }, e.ptm("nextButton"), {
    "data-pc-group-section": "navigator"
  }), [(l(), S(ae(i.templates.nexticon || "ChevronRightIcon"), B({
    "aria-hidden": "true"
  }, e.ptm("nextIcon")), null, 16))], 16, Pn)), [[s]]) : $("", !0)], 16, xn);
}
at.render = Vn;
var En = `
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
`, On = {
  root: function(t) {
    var n = t.props;
    return ["p-tabs p-component", {
      "p-tabs-scrollable": n.scrollable
    }];
  }
}, In = Y.extend({
  name: "tabs",
  style: En,
  classes: On
}), An = {
  name: "BaseTabs",
  extends: le,
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
  style: In,
  provide: function() {
    return {
      $pcTabs: this,
      $parentInstance: this
    };
  }
}, ot = {
  name: "Tabs",
  extends: An,
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
function Dn(e, t, n, a, d, i) {
  return l(), f("div", B({
    class: e.cx("root")
  }, e.ptmi("root")), [O(e.$slots, "default")], 16);
}
ot.render = Dn;
const Nn = {
  key: 0,
  class: "kx-system-tab-count"
}, Fn = /* @__PURE__ */ I({
  __name: "SystemTabs",
  props: {
    value: {},
    label: {},
    items: {}
  },
  emits: ["update:value"],
  setup(e) {
    return (t, n) => (l(), S(o(ot), {
      class: "kx-system-tabs",
      "data-kx-separator": "surface",
      value: e.value,
      "onUpdate:value": n[0] || (n[0] = (a) => t.$emit("update:value", String(a)))
    }, {
      default: k(() => [
        b(o(at), {
          pt: { tabList: { "aria-label": e.label } }
        }, {
          default: k(() => [
            (l(!0), f(R, null, j(e.items, (a) => (l(), S(o(et), B({
              key: a.value,
              value: a.value
            }, { ref_for: !0 }, a.controls ? { "aria-controls": a.controls } : {}), {
              default: k(() => [
                T(y(a.label), 1),
                a.count !== void 0 ? (l(), f("b", Nn, y(a.count), 1)) : $("", !0)
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
}), Rn = { class: "kx-shell" }, zn = { class: "kx-rail" }, jn = { class: "kx-main" }, Mn = /* @__PURE__ */ I({
  __name: "Shell",
  setup(e) {
    return (t, n) => (l(), f("div", Rn, [
      u("aside", zn, [
        O(t.$slots, "rail")
      ]),
      u("main", jn, [
        O(t.$slots, "default")
      ])
    ]));
  }
}), Kn = { class: "kx-railhead" }, Un = { class: "kx-railhead-title" }, Hn = { key: 0 }, Wn = { class: "kx-railhead-acts" }, qn = /* @__PURE__ */ I({
  __name: "RailHeader",
  props: {
    title: {},
    count: {}
  },
  setup(e) {
    return (t, n) => (l(), f("div", Kn, [
      u("span", Un, [
        T(y(e.title), 1),
        e.count !== void 0 ? (l(), f("b", Hn, y(e.count), 1)) : $("", !0)
      ]),
      u("div", Wn, [
        O(t.$slots, "actions")
      ])
    ]));
  }
}), z = /* @__PURE__ */ I({
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
    const n = e, a = t, d = jt(), i = w(
      () => Object.prototype.hasOwnProperty.call(d?.vnode.props ?? {}, "active")
    ), s = w(() => {
      if (n.severity) return n.severity;
      if (n.variant === "danger") return "danger";
      if (n.variant === "bordered") return "secondary";
    }), m = w(
      () => n.size === "sm" ? "small" : n.size === "lg" ? "large" : void 0
    );
    return (h, x) => (l(), S(o(Pe), {
      severity: s.value,
      text: e.variant !== "bordered" && !e.active,
      outlined: e.variant === "bordered",
      size: m.value,
      loading: e.spin,
      disabled: e.disabled || e.spin,
      pt: {
        root: {
          "aria-label": e.label,
          "aria-pressed": i.value ? String(e.active) : void 0,
          title: e.label
        }
      },
      onClick: x[0] || (x[0] = (g) => a("click"))
    }, {
      icon: k(() => [
        b(o(D), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      _: 1
    }, 8, ["severity", "text", "outlined", "size", "loading", "disabled", "pt"]));
  }
}), Zn = { class: "km-search" }, Jn = ["value", "placeholder"], Gn = /* @__PURE__ */ I({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, d) => (l(), f("div", Zn, [
      b(o(D), {
        icon: "tabler:search",
        class: "km-search-ico",
        "aria-hidden": "true"
      }),
      u("input", {
        class: "km-search-input",
        value: e.modelValue,
        placeholder: e.placeholder || "Search",
        onInput: d[0] || (d[0] = (i) => n("update:modelValue", i.target.value))
      }, null, 40, Jn),
      e.modelValue ? (l(), f("button", {
        key: 0,
        class: "km-search-clear",
        "aria-label": "Clear search",
        onClick: d[1] || (d[1] = (i) => n("update:modelValue", ""))
      }, [
        b(o(D), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : $("", !0)
    ]));
  }
}), Qn = { class: "km-taginput-wrap" }, Xn = { class: "km-tag-label" }, Yn = ["title", "aria-label", "disabled", "onClick"], ea = ["placeholder", "disabled"], ta = {
  key: 0,
  class: "km-tag-sug"
}, na = ["disabled", "onClick"], Ke = /* @__PURE__ */ I({
  __name: "TagInput",
  props: {
    modelValue: {},
    suggestions: { default: () => [] },
    placeholder: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, d = A(""), i = A(null), s = w(() => {
      const g = d.value.trim().toLowerCase();
      return n.suggestions.filter((c) => !n.modelValue.includes(c)).filter((c) => !g || c.toLowerCase().includes(g));
    });
    function m(g) {
      const c = g.trim();
      if (!c || n.modelValue.includes(c)) {
        d.value = "";
        return;
      }
      a("update:modelValue", [...n.modelValue, c]), d.value = "", i.value?.focus();
    }
    function h(g) {
      a("update:modelValue", n.modelValue.filter((c) => c !== g));
    }
    function x(g) {
      g.key === "Enter" || g.key === "," ? (g.preventDefault(), m(d.value || s.value[0] || "")) : g.key === "Backspace" && !d.value && n.modelValue.length && h(n.modelValue[n.modelValue.length - 1]);
    }
    return (g, c) => (l(), f("div", Qn, [
      u("div", {
        class: U(["km-taginput", { disabled: e.disabled }]),
        onClick: c[1] || (c[1] = (r) => i.value?.focus())
      }, [
        (l(!0), f(R, null, j(e.modelValue, (r) => (l(), f("span", {
          key: r,
          class: "km-tag"
        }, [
          u("span", Xn, y(r), 1),
          u("button", {
            type: "button",
            class: "km-tag-x",
            title: `Remove ${r}`,
            "aria-label": `Remove ${r}`,
            disabled: e.disabled,
            onClick: Ge((p) => h(r), ["stop"])
          }, [
            b(o(D), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ], 8, Yn)
        ]))), 128)),
        X(u("input", {
          ref_key: "inputEl",
          ref: i,
          "onUpdate:modelValue": c[0] || (c[0] = (r) => d.value = r),
          class: "km-tag-field",
          type: "text",
          placeholder: e.modelValue.length ? "" : e.placeholder || "Add…",
          disabled: e.disabled,
          spellcheck: "false",
          autocomplete: "off",
          onKeydown: x
        }, null, 40, ea), [
          [Qe, d.value]
        ])
      ], 2),
      s.value.length ? (l(), f("div", ta, [
        (l(!0), f(R, null, j(s.value, (r) => (l(), f("button", {
          key: r,
          type: "button",
          class: "km-tag-sug-item",
          disabled: e.disabled,
          onClick: (p) => m(r)
        }, [
          b(o(D), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          T(" " + y(r), 1)
        ], 8, na))), 128))
      ])) : $("", !0)
    ]));
  }
});
var aa = `
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
`, oa = {
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
}, ia = Y.extend({
  name: "tag",
  style: aa,
  classes: oa
}), sa = {
  name: "BaseTag",
  extends: le,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: ia,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
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
function ra(e, t, n) {
  return (t = la(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function la(e) {
  var t = da(e, "string");
  return ie(t) == "symbol" ? t : t + "";
}
function da(e, t) {
  if (ie(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(e, t);
    if (ie(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var it = {
  name: "Tag",
  extends: sa,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return fe(ra({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, ua = ["data-p"];
function ca(e, t, n, a, d, i) {
  return l(), f("span", B({
    class: e.cx("root"),
    "data-p": i.dataP
  }, e.ptmi("root")), [e.$slots.icon ? (l(), S(ae(e.$slots.icon), B({
    key: 0,
    class: e.cx("icon")
  }, e.ptm("icon")), null, 16, ["class"])) : e.icon ? (l(), f("span", B({
    key: 1,
    class: [e.cx("icon"), e.icon]
  }, e.ptm("icon")), null, 16)) : $("", !0), e.value != null || e.$slots.default ? O(e.$slots, "default", {
    key: 2
  }, function() {
    return [u("span", B({
      class: e.cx("label")
    }, e.ptm("label")), y(e.value), 17)];
  }) : $("", !0)], 16, ua);
}
it.render = ca;
const pa = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, K = /* @__PURE__ */ I({
  __name: "Pill",
  props: {
    severity: { default: "secondary" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(e) {
    return (t, n) => (l(), S(o(it), {
      severity: e.severity || void 0,
      class: "km-pill kx-tag-sm"
    }, {
      default: k(() => [
        e.dot ? (l(), f("span", pa)) : e.icon ? (l(), S(o(D), {
          key: 1,
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : $("", !0),
        O(t.$slots, "default")
      ]),
      _: 3
    }, 8, ["severity"]));
  }
}), ba = { class: "kx-empty" }, fa = { class: "kx-empty-ico" }, va = { class: "kx-empty-title" }, ma = {
  key: 0,
  class: "kx-empty-sub"
}, Te = /* @__PURE__ */ I({
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
    return (t, n) => (l(), f("div", ba, [
      u("div", fa, [
        b(o(D), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      u("div", va, y(e.title), 1),
      e.hint || t.$slots.hint ? (l(), f("p", ma, [
        O(t.$slots, "hint", {}, () => [
          T(y(e.hint), 1)
        ])
      ])) : $("", !0),
      e.cta ? (l(), S(o(Pe), {
        key: 1,
        label: e.cta,
        onClick: n[0] || (n[0] = (a) => t.$emit("cta"))
      }, Xe({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: k(({ class: a }) => [
            b(o(D), {
              icon: e.ctaIcon,
              class: U(a),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : $("", !0)
    ]));
  }
});
var ha = Y.extend({
  name: "focustrap-directive"
}), ya = Et.extend({
  style: ha
});
function se(e) {
  "@babel/helpers - typeof";
  return se = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, se(e);
}
function Ue(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    t && (a = a.filter(function(d) {
      return Object.getOwnPropertyDescriptor(e, d).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function He(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ue(Object(n), !0).forEach(function(a) {
      ka(e, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ue(Object(n)).forEach(function(a) {
      Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return e;
}
function ka(e, t, n) {
  return (t = ga(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ga(e) {
  var t = $a(e, "string");
  return se(t) == "symbol" ? t : t + "";
}
function $a(e, t) {
  if (se(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(e, t);
    if (se(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var wa = ya.extend("focustrap", {
  mounted: function(t, n) {
    var a = n.value || {}, d = a.disabled;
    d || (this.createHiddenFocusableElements(t, n), this.bind(t, n), this.autoElementFocus(t, n)), t.setAttribute("data-pd-focustrap", !0), this.$el = t;
  },
  updated: function(t, n) {
    var a = n.value || {}, d = a.disabled;
    d && this.unbind(t);
  },
  unmounted: function(t) {
    this.unbind(t);
  },
  methods: {
    getComputedSelector: function(t) {
      return ':not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])'.concat(t ?? "");
    },
    bind: function(t, n) {
      var a = this, d = n.value || {}, i = d.onFocusIn, s = d.onFocusOut;
      t.$_pfocustrap_mutationobserver = new MutationObserver(function(m) {
        m.forEach(function(h) {
          if (h.type === "childList" && !t.contains(document.activeElement)) {
            var x = function(c) {
              var r = Ne(c) ? Ne(c, a.getComputedSelector(t.$_pfocustrap_focusableselector)) ? c : te(t, a.getComputedSelector(t.$_pfocustrap_focusableselector)) : te(c);
              return It(r) ? r : c.nextSibling && x(c.nextSibling);
            };
            Q(x(h.nextSibling));
          }
        });
      }), t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_mutationobserver.observe(t, {
        childList: !0
      }), t.$_pfocustrap_focusinlistener = function(m) {
        return i && i(m);
      }, t.$_pfocustrap_focusoutlistener = function(m) {
        return s && s(m);
      }, t.addEventListener("focusin", t.$_pfocustrap_focusinlistener), t.addEventListener("focusout", t.$_pfocustrap_focusoutlistener);
    },
    unbind: function(t) {
      t.$_pfocustrap_mutationobserver && t.$_pfocustrap_mutationobserver.disconnect(), t.$_pfocustrap_focusinlistener && t.removeEventListener("focusin", t.$_pfocustrap_focusinlistener) && (t.$_pfocustrap_focusinlistener = null), t.$_pfocustrap_focusoutlistener && t.removeEventListener("focusout", t.$_pfocustrap_focusoutlistener) && (t.$_pfocustrap_focusoutlistener = null);
    },
    autoFocus: function(t) {
      this.autoElementFocus(this.$el, {
        value: He(He({}, t), {}, {
          autoFocus: !0
        })
      });
    },
    autoElementFocus: function(t, n) {
      var a = n.value || {}, d = a.autoFocusSelector, i = d === void 0 ? "" : d, s = a.firstFocusableSelector, m = s === void 0 ? "" : s, h = a.autoFocus, x = h === void 0 ? !1 : h, g = te(t, "[autofocus]".concat(this.getComputedSelector(i)));
      x && !g && (g = te(t, this.getComputedSelector(m))), Q(g);
    },
    onFirstHiddenElementFocus: function(t) {
      var n, a = t.currentTarget, d = t.relatedTarget, i = d === a.$_pfocustrap_lasthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(d)) ? te(a.parentElement, this.getComputedSelector(a.$_pfocustrap_focusableselector)) : a.$_pfocustrap_lasthiddenfocusableelement;
      Q(i);
    },
    onLastHiddenElementFocus: function(t) {
      var n, a = t.currentTarget, d = t.relatedTarget, i = d === a.$_pfocustrap_firsthiddenfocusableelement || !((n = this.$el) !== null && n !== void 0 && n.contains(d)) ? Vt(a.parentElement, this.getComputedSelector(a.$_pfocustrap_focusableselector)) : a.$_pfocustrap_firsthiddenfocusableelement;
      Q(i);
    },
    createHiddenFocusableElements: function(t, n) {
      var a = this, d = n.value || {}, i = d.tabIndex, s = i === void 0 ? 0 : i, m = d.firstFocusableSelector, h = m === void 0 ? "" : m, x = d.lastFocusableSelector, g = x === void 0 ? "" : x, c = function(V) {
        return Ot("span", {
          class: "p-hidden-accessible p-hidden-focusable",
          tabIndex: s,
          role: "presentation",
          "aria-hidden": !0,
          "data-p-hidden-accessible": !0,
          "data-p-hidden-focusable": !0,
          onFocus: V?.bind(a)
        });
      }, r = c(this.onFirstHiddenElementFocus), p = c(this.onLastHiddenElementFocus);
      r.$_pfocustrap_lasthiddenfocusableelement = p, r.$_pfocustrap_focusableselector = h, r.setAttribute("data-pc-section", "firstfocusableelement"), p.$_pfocustrap_firsthiddenfocusableelement = r, p.$_pfocustrap_focusableselector = g, p.setAttribute("data-pc-section", "lastfocusableelement"), t.prepend(r), t.append(p);
    }
  }
});
function Ca() {
  Dt({
    variableName: Je("scrollbar.width").name
  });
}
function _a() {
  At({
    variableName: Je("scrollbar.width").name
  });
}
var Sa = `
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
`, xa = {
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
}, Ta = {
  mask: function(t) {
    var n = t.instance, a = t.props, d = ["left", "right", "top", "bottom"], i = d.find(function(s) {
      return s === a.position;
    });
    return ["p-drawer-mask", {
      "p-overlay-mask p-overlay-mask-enter-active": a.modal,
      "p-drawer-open": n.containerVisible,
      "p-drawer-full": n.fullScreen
    }, i ? "p-drawer-".concat(i) : ""];
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
}, Ba = Y.extend({
  name: "drawer",
  style: Sa,
  classes: Ta,
  inlineStyles: xa
}), La = {
  name: "BaseDrawer",
  extends: le,
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
  style: Ba,
  provide: function() {
    return {
      $pcDrawer: this,
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
function we(e, t, n) {
  return (t = Pa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Pa(e) {
  var t = Va(e, "string");
  return re(t) == "symbol" ? t : t + "";
}
function Va(e, t) {
  if (re(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(e, t);
    if (re(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var st = {
  name: "Drawer",
  extends: La,
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
    this.disableDocumentSettings(), this.mask && this.autoZIndex && $e.clear(this.mask), this.container = null, this.mask = null;
  },
  methods: {
    hide: function() {
      this.$emit("update:visible", !1);
    },
    onEnter: function() {
      this.$emit("show"), this.focus(), this.bindDocumentKeyDownListener(), this.autoZIndex && $e.set("modal", this.mask, this.baseZIndex || this.$primevue.config.zIndex.modal);
    },
    onAfterEnter: function() {
      this.enableDocumentSettings(), this.$emit("after-show");
    },
    onBeforeLeave: function() {
      this.modal && !this.isUnstyled && Ft(this.mask, "p-overlay-mask-leave-active"), this.$emit("before-hide");
    },
    onLeave: function() {
      this.$emit("hide");
    },
    onAfterLeave: function() {
      this.autoZIndex && $e.clear(this.mask), this.unbindDocumentKeyDownListener(), this.containerVisible = !1, this.disableDocumentSettings(), this.$emit("after-hide");
    },
    onMaskClick: function(t) {
      this.dismissable && this.modal && this.mask === t.target && this.hide();
    },
    focus: function() {
      var t = function(d) {
        return d && d.querySelector("[autofocus]");
      }, n = this.$slots.header && t(this.headerContainer);
      n || (n = this.$slots.default && t(this.container), n || (n = this.$slots.footer && t(this.footerContainer), n || (n = this.closeButton))), n && Q(n);
    },
    enableDocumentSettings: function() {
      this.dismissable && !this.modal && this.bindOutsideClickListener(), this.blockScroll && Ca();
    },
    disableDocumentSettings: function() {
      this.unbindOutsideClickListener(), this.blockScroll && _a();
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
      return fe(we(we(we({
        "full-screen": this.position === "full"
      }, this.position, this.position), "open", this.containerVisible), "modal", this.modal));
    }
  },
  directives: {
    focustrap: wa
  },
  components: {
    Button: Pe,
    Portal: Nt,
    TimesIcon: Zt
  }
}, Ea = ["data-p"], Oa = ["role", "aria-modal", "data-p"];
function Ia(e, t, n, a, d, i) {
  var s = Fe("Button"), m = Fe("Portal"), h = Be("focustrap");
  return l(), S(m, null, {
    default: k(function() {
      return [d.containerVisible ? (l(), f("div", B({
        key: 0,
        ref: i.maskRef,
        onMousedown: t[0] || (t[0] = function() {
          return i.onMaskClick && i.onMaskClick.apply(i, arguments);
        }),
        class: e.cx("mask"),
        style: e.sx("mask", !0, {
          position: e.position,
          modal: e.modal
        }),
        "data-p": i.dataP
      }, e.ptm("mask")), [b(Mt, B({
        name: "p-drawer",
        onEnter: i.onEnter,
        onAfterEnter: i.onAfterEnter,
        onBeforeLeave: i.onBeforeLeave,
        onLeave: i.onLeave,
        onAfterLeave: i.onAfterLeave,
        appear: ""
      }, e.ptm("transition")), {
        default: k(function() {
          return [e.visible ? X((l(), f("div", B({
            key: 0,
            ref: i.containerRef,
            class: e.cx("root"),
            style: e.sx("root"),
            role: e.modal ? "dialog" : "complementary",
            "aria-modal": e.modal ? !0 : void 0,
            "data-p": i.dataP
          }, e.ptmi("root")), [e.$slots.container ? O(e.$slots, "container", {
            key: 0,
            closeCallback: i.hide
          }) : (l(), f(R, {
            key: 1
          }, [u("div", B({
            ref: i.headerContainerRef,
            class: e.cx("header")
          }, e.ptm("header")), [O(e.$slots, "header", {
            class: U(e.cx("title"))
          }, function() {
            return [e.header ? (l(), f("div", B({
              key: 0,
              class: e.cx("title")
            }, e.ptm("title")), y(e.header), 17)) : $("", !0)];
          }), e.showCloseIcon ? O(e.$slots, "closebutton", {
            key: 0,
            closeCallback: i.hide
          }, function() {
            return [b(s, B({
              ref: i.closeButtonRef,
              type: "button",
              class: e.cx("pcCloseButton"),
              "aria-label": i.closeAriaLabel,
              unstyled: e.unstyled,
              onClick: i.hide
            }, e.closeButtonProps, {
              pt: e.ptm("pcCloseButton"),
              "data-pc-group-section": "iconcontainer"
            }), {
              icon: k(function(x) {
                return [O(e.$slots, "closeicon", {}, function() {
                  return [(l(), S(ae(e.closeIcon ? "span" : "TimesIcon"), B({
                    class: [e.closeIcon, x.class]
                  }, e.ptm("pcCloseButton").icon), null, 16, ["class"]))];
                })];
              }),
              _: 3
            }, 16, ["class", "aria-label", "unstyled", "onClick", "pt"])];
          }) : $("", !0)], 16), u("div", B({
            ref: i.contentRef,
            class: e.cx("content")
          }, e.ptm("content")), [O(e.$slots, "default")], 16), e.$slots.footer ? (l(), f("div", B({
            key: 0,
            ref: i.footerContainerRef,
            class: e.cx("footer")
          }, e.ptm("footer")), [O(e.$slots, "footer")], 16)) : $("", !0)], 64))], 16, Oa)), [[h]]) : $("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])], 16, Ea)) : $("", !0)];
    }),
    _: 3
  });
}
st.render = Ia;
const Aa = { class: "km-drawer-title" }, Da = /* @__PURE__ */ I({
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
    const n = e, a = t, d = w(() => n.wide ? "min(720px, calc(100vw - 36px))" : "min(560px, calc(100vw - 36px))");
    function i(s) {
      s || a("close");
    }
    return (s, m) => (l(), S(o(st), {
      visible: e.open,
      position: "right",
      modal: !0,
      pt: { content: { class: "km-drawer-content" } },
      dismissable: !0,
      "close-on-escape": !0,
      style: Kt({ width: d.value }),
      "aria-label": e.title,
      "onUpdate:visible": i
    }, Xe({
      header: k(() => [
        e.back ? (l(), S(z, {
          key: 0,
          icon: "tabler:chevron-left",
          label: "Back",
          onClick: m[0] || (m[0] = (h) => a("back"))
        })) : $("", !0),
        u("span", Aa, [
          e.icon ? (l(), S(o(D), {
            key: 0,
            icon: e.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : $("", !0),
          T(y(e.title), 1)
        ])
      ]),
      default: k(() => [
        O(s.$slots, "default")
      ]),
      _: 2
    }, [
      s.$slots.footer ? {
        name: "footer",
        fn: k(() => [
          O(s.$slots, "footer")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["visible", "style", "aria-label"]));
  }
});
function Na(e) {
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
function Fa(e) {
  const t = Na(e);
  return t === null ? "" : new Date(t).toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
const Ra = ["title"], za = { class: "km-prow-text" }, ja = { class: "km-prow-name" }, Ma = ["title"], Ka = { class: "km-prow-sub" }, Ua = { class: "km-prow-acts" }, Ha = {
  key: 0,
  class: "km-prow-msg"
}, Wa = /* @__PURE__ */ I({
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
    const n = e, a = t, d = w(() => {
      if (!n.discoverable) return "Automatic model discovery is not available for this provider";
      const i = Fa(n.profile.last_discovered_at);
      return i ? `Discover models (last ${i})` : "Discover models";
    });
    return (i, s) => (l(), f("div", {
      class: U(["km-prow", { on: e.selected }])
    }, [
      u("button", {
        class: "km-prow-main",
        title: o(Jt)(e.profile),
        onClick: s[0] || (s[0] = (m) => a("select"))
      }, [
        b(o(Ve), {
          icon: e.providerIcon,
          size: "sm"
        }, null, 8, ["icon"]),
        u("span", za, [
          u("span", ja, [
            u("span", null, y(e.profile.name), 1),
            o(Gt)(e.profile) ? (l(), S(o(D), {
              key: 0,
              icon: "tabler:key",
              class: "km-prow-cred",
              title: "Credentials stored",
              "aria-hidden": "true"
            })) : $("", !0),
            u("span", {
              class: U(["km-prow-dot", o(Xt)(e.profile.status)]),
              title: o(Qt)(e.profile.status),
              "aria-hidden": "true"
            }, null, 10, Ma)
          ]),
          u("span", Ka, y(e.adapterTitle), 1)
        ]),
        e.profile.enabled ? $("", !0) : (l(), S(o(K), {
          key: 0,
          severity: "warn"
        }, {
          default: k(() => [...s[4] || (s[4] = [
            T("off", -1)
          ])]),
          _: 1
        }))
      ], 8, Ra),
      u("div", Ua, [
        b(o(z), {
          icon: "tabler:radar-2",
          label: d.value,
          size: "sm",
          disabled: !e.discoverable || e.discovering || e.busy,
          spin: e.discovering,
          onClick: s[1] || (s[1] = (m) => a("discover"))
        }, null, 8, ["label", "disabled", "spin"]),
        b(o(z), {
          icon: "tabler:edit",
          label: "Edit provider",
          size: "sm",
          disabled: e.busy,
          onClick: s[2] || (s[2] = (m) => a("edit"))
        }, null, 8, ["disabled"]),
        b(o(z), {
          icon: "tabler:trash",
          label: "Delete provider",
          size: "sm",
          variant: "danger",
          disabled: e.busy,
          onClick: s[3] || (s[3] = (m) => a("delete"))
        }, null, 8, ["disabled"])
      ]),
      e.profile.message ? (l(), f("div", Ha, y(e.profile.message), 1)) : $("", !0)
    ], 2));
  }
}), qa = { class: "km-plist" }, Za = {
  key: 0,
  class: "km-plist-empty"
}, Ja = /* @__PURE__ */ I({
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
    const n = e, a = t, d = Ee(() => n.adapters, () => n.profiles, () => n.presets);
    return (i, s) => (l(), f("div", qa, [
      u("button", {
        class: U(["km-plist-all", { on: e.selectedId === "all" }]),
        onClick: s[0] || (s[0] = (m) => a("select", "all"))
      }, " All providers ", 2),
      e.profiles.length ? $("", !0) : (l(), f("div", Za, [
        s[3] || (s[3] = u("p", null, "No providers connected.", -1)),
        b(o(oe), {
          small: "",
          icon: "tabler:plus",
          onClick: s[1] || (s[1] = (m) => a("add"))
        }, {
          default: k(() => [...s[2] || (s[2] = [
            T("Add provider", -1)
          ])]),
          _: 1
        })
      ])),
      (l(!0), f(R, null, j(e.profiles, (m) => (l(), S(Wa, {
        key: m.id,
        profile: m,
        "provider-icon": o(d).providerIcon(m.provider_id),
        "adapter-title": o(d).adapterTitle(m.provider_id),
        selected: e.selectedId === m.id,
        discoverable: o(d).isDiscoverable(m),
        discovering: e.discovering === m.id,
        busy: e.busy,
        onSelect: (h) => a("select", m.id),
        onEdit: (h) => a("edit", m),
        onDiscover: (h) => a("discover", m),
        onDelete: (h) => a("delete", m)
      }, null, 8, ["profile", "provider-icon", "adapter-title", "selected", "discoverable", "discovering", "busy", "onSelect", "onEdit", "onDiscover", "onDelete"]))), 128))
    ]));
  }
}), Ga = { class: "km-mrow-id" }, Qa = { class: "km-mrow-title" }, Xa = { class: "km-mrow-title-text" }, Ya = { class: "km-mrow-sub" }, eo = { class: "km-mrow-prov" }, to = { class: "km-mrow-mono" }, no = { class: "km-mrow-tags" }, ao = {
  key: 0,
  class: "km-tag-group km-tag-classes"
}, oo = { class: "km-tag-group km-tag-caps" }, io = { class: "km-mrow-limits" }, so = {
  class: "km-mrow-limit-chips",
  "aria-label": "Token limits"
}, ro = { class: "km-mrow-acts" }, lo = { class: "km-mrow-probe-head" }, uo = { class: "km-mrow-probe-msg" }, co = {
  key: 0,
  class: "km-probe-time"
}, po = {
  key: 0,
  class: "km-mrow-probe-body"
}, bo = {
  key: 0,
  class: "km-probe-tokens"
}, fo = {
  key: 1,
  class: "km-probe-out"
}, vo = {
  key: 2,
  class: "km-probe-out"
}, We = 5, mo = /* @__PURE__ */ I({
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
    const n = e, a = t, d = w(() => n.model.capabilities ?? []), i = w(() => d.value.slice(0, We)), s = w(() => Math.max(0, d.value.length - We)), m = w(() => d.value.includes("reasoning") || d.value.includes("extended_thinking") || Yt(n.model, "reasoning_model_request") === "true"), h = w(() => n.model.enabled !== !1 && (d.value.includes("generate") || d.value.includes("tool_use"))), x = w(() => n.probeState?.model === n.model.name ? n.probeState : null), g = w(() => x.value?.status || "idle"), c = w(() => g.value === "ok" || g.value === "fail"), r = w(() => g.value === "ok" ? "tabler:circle-check" : g.value === "fail" ? "tabler:circle-x" : "tabler:activity-heartbeat"), p = w(() => {
      if (g.value === "ok") return "success";
      if (g.value === "fail") return "danger";
    }), E = w(() => n.probing ? `Checking ${n.model.title || n.model.name}` : g.value === "ok" ? "Model check succeeded. View details" : g.value === "fail" ? "Model check failed. View details" : "Run model check"), V = w(() => {
      const N = x.value?.data?.tokens;
      if (!N) return [];
      const C = ["prompt_tokens", "completion_tokens", "total_tokens", "thinking_tokens"], L = /* @__PURE__ */ new Set(), H = [], W = (q) => {
        const J = N[q];
        typeof J == "number" && J > 0 && !L.has(q) && (L.add(q), H.push({ label: q.replace(/_tokens$/, "").replace(/_input$/, "").replace(/_/g, " "), value: J }));
      };
      return C.forEach(W), Object.keys(N).forEach(W), H;
    });
    function Z() {
      c.value ? a("toggle-probe-details") : a("probe");
    }
    return (N, C) => (l(), f("div", {
      class: U(["km-mrow", { "km-mrow-off": e.model.enabled === !1 }])
    }, [
      b(o(Ve), { icon: e.providerIcon }, null, 8, ["icon"]),
      u("div", Ga, [
        u("div", Qa, [
          u("span", Xa, y(e.model.title || e.model.name), 1),
          b(o(K), {
            severity: o(en)(e.model.source)
          }, {
            default: k(() => [
              T(y(o(tn)(e.model.source)), 1)
            ]),
            _: 1
          }, 8, ["severity"]),
          e.model.enabled === !1 ? (l(), S(o(K), {
            key: 0,
            severity: "secondary",
            icon: "tabler:ban"
          }, {
            default: k(() => [...C[4] || (C[4] = [
              T("disabled", -1)
            ])]),
            _: 1
          })) : $("", !0)
        ]),
        u("div", Ya, [
          u("span", eo, y(e.providerTitle || "—"), 1),
          e.model.provider_profile_id ? (l(), f(R, { key: 0 }, [
            T(" · " + y(e.profileTitle), 1)
          ], 64)) : $("", !0),
          u("span", to, " · " + y(e.model.name), 1)
        ])
      ]),
      u("div", no, [
        (e.model.class || []).length ? (l(), f("span", ao, [
          (l(!0), f(R, null, j(e.model.class || [], (L) => (l(), S(o(K), {
            key: `k-${L}`,
            severity: "",
            icon: "tabler:category-2"
          }, {
            default: k(() => [
              T(y(L), 1)
            ]),
            _: 2
          }, 1024))), 128))
        ])) : $("", !0),
        u("span", oo, [
          m.value ? (l(), S(o(K), {
            key: 0,
            severity: "info",
            icon: "tabler:bulb"
          }, {
            default: k(() => [...C[5] || (C[5] = [
              T("reasoning", -1)
            ])]),
            _: 1
          })) : $("", !0),
          (l(!0), f(R, null, j(i.value, (L) => (l(), S(o(K), {
            key: `c-${L}`,
            severity: "secondary",
            icon: o(nn)(L) || void 0
          }, {
            default: k(() => [
              T(y(L), 1)
            ]),
            _: 2
          }, 1032, ["icon"]))), 128)),
          s.value ? (l(), S(o(K), {
            key: 1,
            severity: "secondary"
          }, {
            default: k(() => [
              T("+" + y(s.value), 1)
            ]),
            _: 1
          })) : $("", !0)
        ])
      ]),
      u("div", io, [
        u("span", null, [
          u("b", null, y(o(pe)(e.model.max_tokens)), 1),
          C[6] || (C[6] = T(" ctx", -1))
        ]),
        u("span", null, [
          u("b", null, y(o(pe)(e.model.output_tokens)), 1),
          C[7] || (C[7] = T(" out", -1))
        ])
      ]),
      u("div", so, [
        u("span", null, [
          u("b", null, y(o(pe)(e.model.max_tokens)), 1),
          C[8] || (C[8] = T(" ctx", -1))
        ]),
        u("span", null, [
          u("b", null, y(o(pe)(e.model.output_tokens)), 1),
          C[9] || (C[9] = T(" out", -1))
        ])
      ]),
      u("div", ro, [
        h.value ? (l(), S(o(z), {
          key: 0,
          icon: r.value,
          label: E.value,
          size: "sm",
          variant: "bordered",
          severity: p.value,
          active: c.value && e.probeDetailsOpen,
          spin: e.probing,
          disabled: e.probing || !c.value && e.busy,
          onClick: Z
        }, null, 8, ["icon", "label", "severity", "active", "spin", "disabled"])) : $("", !0),
        b(o(z), {
          icon: e.model.enabled === !1 ? "tabler:circle-check" : "tabler:circle-minus",
          label: e.model.enabled === !1 ? "Enable model" : "Disable model",
          size: "sm",
          variant: "bordered",
          disabled: e.busy,
          onClick: C[0] || (C[0] = (L) => a("toggle-enabled"))
        }, null, 8, ["icon", "label", "disabled"]),
        b(o(z), {
          icon: "tabler:adjustments",
          label: "Edit model",
          size: "sm",
          variant: "bordered",
          onClick: C[1] || (C[1] = (L) => a("edit"))
        }),
        e.model.source !== "registry" ? (l(), S(o(z), {
          key: 1,
          icon: "tabler:trash",
          label: "Delete model",
          size: "sm",
          variant: "bordered",
          severity: "danger",
          onClick: C[2] || (C[2] = (L) => a("delete"))
        })) : $("", !0)
      ]),
      e.probeDetailsOpen && c.value ? (l(), f("div", {
        key: 0,
        class: U(["km-mrow-probe", g.value])
      }, [
        u("div", lo, [
          b(o(D), {
            icon: g.value === "ok" ? "tabler:circle-check" : "tabler:circle-x",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          u("span", uo, y(g.value === "ok" ? "Model works" : "Model check failed"), 1),
          x.value?.data && x.value.data.elapsed_ms != null ? (l(), f("span", co, y(x.value.data.elapsed_ms) + " ms", 1)) : $("", !0),
          b(o(oe), {
            icon: "tabler:activity-heartbeat",
            variant: "ghost",
            small: "",
            disabled: e.probing || e.busy,
            onClick: C[3] || (C[3] = (L) => a("probe"))
          }, {
            default: k(() => [...C[10] || (C[10] = [
              T(" Run again ", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        x.value?.data ? (l(), f("div", po, [
          V.value.length ? (l(), f("div", bo, [
            C[11] || (C[11] = u("span", { class: "km-probe-tokens-l" }, "Tokens", -1)),
            (l(!0), f(R, null, j(V.value, (L) => (l(), f("span", {
              key: L.label,
              class: "km-probe-tok"
            }, [
              u("b", null, y(L.value), 1),
              T(" " + y(L.label), 1)
            ]))), 128))
          ])) : $("", !0),
          x.value.data.output ? (l(), f("div", fo, [
            C[12] || (C[12] = u("span", null, "Output", -1)),
            u("pre", null, y(x.value.data.output), 1)
          ])) : $("", !0),
          x.value.data.error ? (l(), f("div", vo, [
            C[13] || (C[13] = u("span", null, "Error", -1)),
            u("pre", null, y(x.value.data.error), 1)
          ])) : $("", !0)
        ])) : $("", !0)
      ], 2)) : $("", !0)
    ], 2));
  }
}), Ce = 120;
function ho(e) {
  const t = Ye({
    search: "",
    source: "all",
    capability: "all",
    klass: "all",
    profile: "all",
    provider: "all",
    limit: Ce
  }), n = w(() => {
    const c = /* @__PURE__ */ new Set();
    for (const r of e.value) for (const p of r.capabilities ?? []) c.add(p);
    return Array.from(c).sort();
  }), a = w(() => {
    const c = /* @__PURE__ */ new Set();
    for (const r of e.value) for (const p of r.class ?? []) c.add(p);
    return Array.from(c).sort();
  }), d = w(() => {
    const c = /* @__PURE__ */ new Set();
    for (const r of e.value) r.provider_id && c.add(r.provider_id);
    return Array.from(c).sort();
  }), i = w(() => {
    const c = t.search.trim().toLowerCase();
    return e.value.filter((r) => t.source !== "all" && r.source !== t.source || t.capability !== "all" && !(r.capabilities ?? []).includes(t.capability) || t.klass !== "all" && !(r.class ?? []).includes(t.klass) || t.profile !== "all" && (r.provider_profile_id || "") !== t.profile || t.provider !== "all" && (r.provider_id || "") !== t.provider ? !1 : c ? [
      r.name,
      r.title,
      r.provider_model,
      r.provider_id,
      r.provider_profile_id,
      ...r.capabilities ?? [],
      ...r.class ?? []
    ].filter(Boolean).some((p) => String(p).toLowerCase().includes(c)) : !0);
  }), s = w(() => i.value.slice(0, t.limit)), m = w(() => s.value.length < i.value.length), h = w(
    () => (t.source !== "all" ? 1 : 0) + (t.capability !== "all" ? 1 : 0) + (t.klass !== "all" ? 1 : 0) + (t.profile !== "all" ? 1 : 0) + (t.provider !== "all" ? 1 : 0) + (t.search.trim() ? 1 : 0)
  );
  function x() {
    t.limit += Ce;
  }
  function g() {
    t.search = "", t.source = "all", t.capability = "all", t.klass = "all", t.profile = "all", t.provider = "all", t.limit = Ce;
  }
  return {
    state: t,
    capabilityOptions: n,
    classOptions: a,
    providerOptions: d,
    filtered: i,
    visible: s,
    hasMore: m,
    activeCount: h,
    more: x,
    reset: g
  };
}
const yo = { class: "km-pool kx-system-pane" }, ko = { class: "km-pool-head kx-system-tools" }, go = { class: "km-pool-head-top" }, $o = { class: "km-pool-title" }, wo = { class: "km-pool-counts" }, Co = { class: "km-pool-filters" }, _o = {
  key: 0,
  class: "km-pool-body kx-system-body"
}, So = {
  key: 1,
  class: "km-pool-body kx-system-body"
}, xo = {
  key: 2,
  class: "km-pool-table kx-system-body"
}, To = {
  key: 0,
  class: "km-pool-more"
}, Bo = /* @__PURE__ */ I({
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
    const n = e, a = t, d = Ee(() => n.adapters, () => n.profiles, () => n.presets), i = ho(Ut(n, "models")), s = [
      { label: "All sources", value: "all" },
      { label: "Built-in", value: "registry" },
      { label: "Discovered", value: "discovered" },
      { label: "Overlay", value: "overlay" }
    ], m = w(() => [
      { label: "All providers", value: "all" },
      ...i.providerOptions.value.map((c) => ({ label: d.adapterTitle(c), value: c }))
    ]), h = w(() => [
      { label: "All capabilities", value: "all" },
      ...i.capabilityOptions.value.map((c) => ({ label: c, value: c }))
    ]), x = w(() => [
      { label: "All classes", value: "all" },
      ...i.classOptions.value.map((c) => ({ label: c, value: c }))
    ]), g = w(() => {
      let c = 0, r = 0, p = 0;
      for (const E of n.models)
        E.source === "registry" ? c++ : E.source === "discovered" ? r++ : p++;
      return { registry: c, discovered: r, overlay: p };
    });
    return Le(() => n.selectedProfileId, (c) => {
      i.state.profile = c || "all";
    }, { immediate: !0 }), (c, r) => (l(), f("div", yo, [
      u("header", ko, [
        u("div", go, [
          u("div", $o, [
            r[8] || (r[8] = u("span", null, "Model pool", -1)),
            u("span", wo, [
              b(o(K), { severity: "info" }, {
                default: k(() => [
                  T(y(g.value.registry) + " built-in", 1)
                ]),
                _: 1
              }),
              b(o(K), { severity: "success" }, {
                default: k(() => [
                  T(y(g.value.discovered) + " discovered", 1)
                ]),
                _: 1
              }),
              b(o(K), { severity: "warn" }, {
                default: k(() => [
                  T(y(g.value.overlay) + " overlay", 1)
                ]),
                _: 1
              })
            ])
          ]),
          b(o(Gn), {
            modelValue: o(i).state.search,
            "onUpdate:modelValue": r[0] || (r[0] = (p) => o(i).state.search = p),
            placeholder: "Search models"
          }, null, 8, ["modelValue"])
        ]),
        u("div", Co, [
          b(o(ne), {
            modelValue: o(i).state.source,
            "onUpdate:modelValue": r[1] || (r[1] = (p) => o(i).state.source = p),
            options: s,
            "aria-label": "Source"
          }, null, 8, ["modelValue"]),
          b(o(ne), {
            modelValue: o(i).state.provider,
            "onUpdate:modelValue": r[2] || (r[2] = (p) => o(i).state.provider = p),
            options: m.value,
            "aria-label": "Provider"
          }, null, 8, ["modelValue", "options"]),
          b(o(ne), {
            modelValue: o(i).state.capability,
            "onUpdate:modelValue": r[3] || (r[3] = (p) => o(i).state.capability = p),
            options: h.value,
            "aria-label": "Capability"
          }, null, 8, ["modelValue", "options"]),
          b(o(ne), {
            modelValue: o(i).state.klass,
            "onUpdate:modelValue": r[4] || (r[4] = (p) => o(i).state.klass = p),
            options: x.value,
            "aria-label": "Class"
          }, null, 8, ["modelValue", "options"]),
          o(i).activeCount.value ? (l(), S(o(z), {
            key: 0,
            icon: "tabler:filter-off",
            label: "Clear filters",
            variant: "bordered",
            onClick: r[5] || (r[5] = (p) => o(i).reset())
          })) : $("", !0)
        ])
      ]),
      e.models.length ? o(i).filtered.value.length ? (l(), f("div", xo, [
        r[9] || (r[9] = u("div", { class: "km-pool-cols" }, [
          u("span"),
          u("span", null, "Model"),
          u("span", null, "Capabilities & classes"),
          u("span", { class: "km-pool-cols-r" }, "Limits"),
          u("span")
        ], -1)),
        (l(!0), f(R, null, j(o(i).visible.value, (p) => (l(), S(mo, {
          key: p.name,
          model: p,
          "provider-icon": o(d).providerIcon(p.provider_id),
          "provider-title": o(d).adapterTitle(p.provider_id),
          "profile-title": o(d).profileTitle(p.provider_profile_id),
          probing: e.probingModel === p.name,
          "probe-state": e.probeState,
          "probe-details-open": e.probeDetailsModel === p.name,
          busy: e.busy,
          onEdit: (E) => a("edit", p),
          onDelete: (E) => a("delete", p),
          onProbe: (E) => a("probe", p),
          onToggleProbeDetails: (E) => a("toggle-probe-details", p),
          onToggleEnabled: (E) => a("toggle-enabled", p)
        }, null, 8, ["model", "provider-icon", "provider-title", "profile-title", "probing", "probe-state", "probe-details-open", "busy", "onEdit", "onDelete", "onProbe", "onToggleProbeDetails", "onToggleEnabled"]))), 128)),
        o(i).hasMore.value ? (l(), f("div", To, [
          b(o(oe), {
            variant: "ghost",
            icon: "tabler:chevron-down",
            onClick: r[7] || (r[7] = (p) => o(i).more())
          }, {
            default: k(() => [
              T(" Show more (" + y(o(i).filtered.value.length - o(i).visible.value.length) + ") ", 1)
            ]),
            _: 1
          })
        ])) : $("", !0)
      ])) : (l(), f("div", So, [
        b(o(Te), {
          icon: "tabler:search-off",
          title: "No models match",
          hint: "Adjust the search or filters."
        })
      ])) : (l(), f("div", _o, [
        b(o(Te), {
          icon: "tabler:cpu",
          title: "No models yet",
          hint: "Connect a provider and discover its models, or add one manually.",
          cta: "Add provider",
          "cta-icon": "tabler:plus",
          onCta: r[6] || (r[6] = (p) => a("add"))
        })
      ]))
    ]));
  }
}), Lo = { class: "km-classes kx-system-pane" }, Po = {
  key: 0,
  class: "km-pool-body kx-system-body"
}, Vo = {
  key: 1,
  class: "km-pool-table km-classes-list kx-system-body"
}, Eo = { class: "km-class-head" }, Oo = { class: "km-class-head-text" }, Io = { class: "km-class-title" }, Ao = {
  key: 0,
  class: "km-class-desc"
}, Do = { class: "km-class-meta" }, No = { class: "km-class-count" }, Fo = {
  key: 0,
  class: "km-class-members"
}, Ro = {
  key: 1,
  class: "km-class-rank"
}, zo = { class: "km-class-member-name" }, jo = { class: "km-class-member-pri" }, Mo = {
  key: 1,
  class: "km-class-empty"
}, Ko = /* @__PURE__ */ I({
  __name: "ModelClasses",
  props: {
    classes: {}
  },
  setup(e) {
    return (t, n) => (l(), f("div", Lo, [
      e.classes.length ? (l(), f("div", Vo, [
        (l(!0), f(R, null, j(e.classes, (a) => (l(), f("article", {
          key: a.name,
          class: "km-class"
        }, [
          u("div", Eo, [
            b(o(Ve), {
              icon: a.icon || "tabler:category",
              size: "sm"
            }, null, 8, ["icon"]),
            u("div", Oo, [
              u("div", Io, y(a.title || a.name), 1),
              a.description ? (l(), f("div", Ao, y(a.description), 1)) : $("", !0)
            ]),
            u("div", Do, [
              u("span", No, y(a.models.length) + " model" + y(a.models.length === 1 ? "" : "s"), 1)
            ])
          ]),
          a.models.length ? (l(), f("div", Fo, [
            (l(!0), f(R, null, j(a.models, (d, i) => (l(), f("div", {
              key: d.name,
              class: U(["km-class-member", { top: i === 0 }])
            }, [
              i === 0 ? (l(), S(o(K), {
                key: 0,
                severity: "success",
                icon: "tabler:check"
              }, {
                default: k(() => [...n[0] || (n[0] = [
                  T("active", -1)
                ])]),
                _: 1
              })) : (l(), f("span", Ro, y(i + 1), 1)),
              u("span", zo, y(d.title || d.name), 1),
              u("span", jo, "priority " + y(d.priority ?? 0), 1)
            ], 2))), 128))
          ])) : (l(), f("div", Mo, "No models assigned to this class yet."))
        ]))), 128))
      ])) : (l(), f("div", Po, [
        b(o(Te), {
          icon: "tabler:category-2",
          title: "No model classes",
          hint: "Classes group models by purpose. The highest-priority model in each class is selected automatically."
        })
      ]))
    ]));
  }
}), Uo = { class: "km-picker" }, Ho = {
  key: 0,
  class: "km-picker-sec"
}, Wo = { class: "km-picker-list" }, qo = ["onClick"], Zo = { class: "km-picker-ico" }, Jo = { class: "km-picker-body" }, Go = { class: "km-picker-name" }, Qo = { class: "km-picker-desc" }, Xo = {
  key: 1,
  class: "km-picker-sec"
}, Yo = { class: "km-picker-list" }, ei = ["onClick"], ti = { class: "km-picker-ico" }, ni = { class: "km-picker-body" }, ai = { class: "km-picker-name" }, oi = { class: "km-picker-desc" }, ii = /* @__PURE__ */ I({
  __name: "ProviderPicker",
  props: {
    presets: {}
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, d = w(() => n.presets.filter((s) => !je(s))), i = w(() => n.presets.filter(je));
    return (s, m) => (l(), f("div", Uo, [
      d.value.length ? (l(), f("section", Ho, [
        m[0] || (m[0] = u("div", { class: "km-picker-sec-title" }, "Native providers", -1)),
        u("div", Wo, [
          (l(!0), f(R, null, j(d.value, (h) => (l(), f("button", {
            key: h.id,
            class: "km-picker-item",
            onClick: (x) => a("pick", h)
          }, [
            u("span", Zo, [
              b(o(D), {
                icon: o(Me)(h),
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            u("span", Jo, [
              u("span", Go, y(h.title), 1),
              u("span", Qo, y(h.description), 1)
            ]),
            b(o(D), {
              icon: "tabler:chevron-right",
              class: "km-picker-go",
              "aria-hidden": "true"
            })
          ], 8, qo))), 128))
        ])
      ])) : $("", !0),
      i.value.length ? (l(), f("section", Xo, [
        m[1] || (m[1] = u("div", { class: "km-picker-sec-title" }, "OpenAI-compatible", -1)),
        u("div", Yo, [
          (l(!0), f(R, null, j(i.value, (h) => (l(), f("button", {
            key: h.id,
            class: "km-picker-item",
            onClick: (x) => a("pick", h)
          }, [
            u("span", ti, [
              b(o(D), {
                icon: o(Me)(h),
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            u("span", ni, [
              u("span", ai, y(h.title), 1),
              u("span", oi, y(h.config?.base_url || h.description), 1)
            ]),
            b(o(D), {
              icon: "tabler:chevron-right",
              class: "km-picker-go",
              "aria-hidden": "true"
            })
          ], 8, ei))), 128))
        ])
      ])) : $("", !0)
    ]));
  }
}), si = { class: "km-form-sec" }, ri = { class: "km-form-id" }, li = { class: "km-form-sec" }, di = { class: "km-form-grid" }, ui = { class: "km-form-sec" }, ci = { class: "km-form-sec" }, pi = { class: "km-form-grid" }, bi = { class: "km-form-grid" }, fi = { class: "km-form-sec" }, vi = {
  key: 0,
  class: "km-adv-body"
}, mi = { class: "km-form-grid" }, hi = ["disabled"], yi = { class: "km-form-foot" }, ki = /* @__PURE__ */ I({
  __name: "ModelEditor",
  props: {
    model: {},
    profiles: {},
    saving: { type: Boolean },
    capabilityOptions: {},
    classOptions: {}
  },
  emits: ["save", "cancel"],
  setup(e, { emit: t }) {
    const n = e, a = t, d = A(""), i = A(!1), s = Ye({
      name: "",
      title: "",
      description: "",
      provider_id: "",
      provider_profile_id: "",
      provider_model: "",
      capabilities: [],
      classes: [],
      priority: 10,
      max_tokens: 0,
      output_tokens: 0,
      dimensions: 0,
      reasoning_model_request: !1,
      thinking_effort: "",
      temperature: "",
      options_json: "{}",
      source: "overlay",
      enabled: !0
    });
    Le(() => n.model, (c) => {
      if (d.value = "", i.value = !1, !c) return;
      const r = c.options ?? {};
      s.name = c.name, s.title = c.title || c.name, s.description = c.description || "", s.provider_id = c.provider_id || "", s.provider_profile_id = c.provider_profile_id || "", s.provider_model = c.provider_model || c.name, s.capabilities = [...c.capabilities ?? []], s.classes = [...c.class ?? []], s.priority = Number(c.priority ?? 10), s.max_tokens = Number(c.max_tokens ?? 0), s.output_tokens = Number(c.output_tokens ?? 0), s.dimensions = Number(c.dimensions ?? 0), s.reasoning_model_request = r.reasoning_model_request === !0, s.thinking_effort = typeof r.thinking_effort == "string" || typeof r.thinking_effort == "number" ? r.thinking_effort : "", s.temperature = r.temperature === void 0 ? "" : String(r.temperature), s.options_json = JSON.stringify(r, null, 2), s.source = c.source === "registry" ? "overlay" : c.source || "overlay", s.enabled = c.enabled !== !1;
    }, { immediate: !0 });
    const m = w(() => n.capabilityOptions ?? []), h = w(() => n.classOptions ?? []), x = w(() => [
      { label: "Registry default", value: "" },
      ...n.profiles.map((c) => ({ label: c.name, value: c.id }))
    ]);
    function g() {
      d.value = "";
      let c = {};
      try {
        c = JSON.parse(s.options_json || "{}");
      } catch {
        d.value = "model options JSON is invalid", i.value = !0;
        return;
      }
      s.reasoning_model_request ? c.reasoning_model_request = !0 : delete c.reasoning_model_request;
      const r = String(s.thinking_effort).trim(), p = Number(r);
      if (r === "" || Number.isFinite(p) && p <= 0 ? delete c.thinking_effort : c.thinking_effort = Number.isFinite(p) ? p : r, s.temperature !== "") {
        const E = Number(s.temperature);
        if (!Number.isFinite(E) || E < 0 || E > 2) {
          d.value = "temperature must be between 0 and 2";
          return;
        }
        c.temperature = E;
      } else
        delete c.temperature;
      a("save", {
        name: s.name,
        title: s.title,
        description: s.description,
        provider_id: s.provider_id,
        provider_profile_id: s.provider_profile_id || void 0,
        provider_model: s.provider_model,
        capabilities: [...s.capabilities],
        classes: [...s.classes],
        priority: Number(s.priority),
        max_tokens: Number(s.max_tokens),
        output_tokens: Number(s.output_tokens),
        dimensions: Number(s.dimensions),
        options: c,
        source: s.source,
        enabled: s.enabled
      });
    }
    return (c, r) => (l(), f("form", {
      class: "km-form",
      onSubmit: Ge(g, ["prevent"])
    }, [
      d.value ? (l(), S(o(_e), {
        key: 0,
        severity: "danger",
        onDismiss: r[0] || (r[0] = (p) => d.value = "")
      }, {
        default: k(() => [
          T(y(d.value), 1)
        ]),
        _: 1
      })) : $("", !0),
      u("section", si, [
        r[20] || (r[20] = u("div", { class: "km-form-sec-title" }, "Identity", -1)),
        b(o(F), { label: "Title" }, {
          default: k(() => [
            b(o(M), {
              modelValue: s.title,
              "onUpdate:modelValue": r[1] || (r[1] = (p) => s.title = p),
              disabled: e.saving
            }, null, 8, ["modelValue", "disabled"])
          ]),
          _: 1
        }),
        b(o(F), { label: "Description" }, {
          default: k(() => [
            b(o(M), {
              modelValue: s.description,
              "onUpdate:modelValue": r[2] || (r[2] = (p) => s.description = p),
              disabled: e.saving
            }, null, 8, ["modelValue", "disabled"])
          ]),
          _: 1
        }),
        u("div", ri, y(s.name), 1)
      ]),
      u("section", li, [
        r[21] || (r[21] = u("div", { class: "km-form-sec-title" }, "Routing", -1)),
        u("div", di, [
          b(o(F), { label: "Provider profile" }, {
            default: k(() => [
              b(o(ne), {
                modelValue: s.provider_profile_id,
                "onUpdate:modelValue": r[3] || (r[3] = (p) => s.provider_profile_id = p),
                options: x.value,
                "aria-label": "Provider profile"
              }, null, 8, ["modelValue", "options"])
            ]),
            _: 1
          }),
          b(o(F), { label: "Provider model" }, {
            default: k(() => [
              b(o(M), {
                modelValue: s.provider_model,
                "onUpdate:modelValue": r[4] || (r[4] = (p) => s.provider_model = p),
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          })
        ])
      ]),
      u("section", ui, [
        r[22] || (r[22] = u("div", { class: "km-form-sec-title" }, "Capabilities & classes", -1)),
        b(o(F), { label: "Capabilities" }, {
          default: k(() => [
            b(o(Ke), {
              modelValue: s.capabilities,
              "onUpdate:modelValue": r[5] || (r[5] = (p) => s.capabilities = p),
              suggestions: m.value,
              placeholder: "Add a capability…",
              disabled: e.saving
            }, null, 8, ["modelValue", "suggestions", "disabled"])
          ]),
          _: 1
        }),
        b(o(F), { label: "Classes" }, {
          default: k(() => [
            b(o(Ke), {
              modelValue: s.classes,
              "onUpdate:modelValue": r[6] || (r[6] = (p) => s.classes = p),
              suggestions: h.value,
              placeholder: "Add a class…",
              disabled: e.saving
            }, null, 8, ["modelValue", "suggestions", "disabled"])
          ]),
          _: 1
        })
      ]),
      u("section", ci, [
        r[23] || (r[23] = u("div", { class: "km-form-sec-title" }, "Request options", -1)),
        b(o(ze), {
          modelValue: s.reasoning_model_request,
          "onUpdate:modelValue": r[7] || (r[7] = (p) => s.reasoning_model_request = p),
          label: "Reasoning model",
          disabled: e.saving
        }, null, 8, ["modelValue", "disabled"]),
        u("div", pi, [
          b(o(F), { label: "Thinking effort" }, {
            default: k(() => [
              b(o(M), {
                modelValue: s.thinking_effort,
                "onUpdate:modelValue": r[8] || (r[8] = (p) => s.thinking_effort = p),
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          }),
          b(o(F), {
            label: "Temperature",
            help: "0–2; blank to leave unset."
          }, {
            default: k(() => [
              b(o(M), {
                modelValue: s.temperature,
                "onUpdate:modelValue": r[9] || (r[9] = (p) => s.temperature = p),
                type: "number",
                min: 0,
                max: 2,
                step: 0.1,
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          })
        ]),
        u("div", bi, [
          b(o(F), { label: "Context" }, {
            default: k(() => [
              b(o(M), {
                modelValue: s.max_tokens,
                "onUpdate:modelValue": r[10] || (r[10] = (p) => s.max_tokens = p),
                type: "number",
                min: 0,
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          }),
          b(o(F), { label: "Output" }, {
            default: k(() => [
              b(o(M), {
                modelValue: s.output_tokens,
                "onUpdate:modelValue": r[11] || (r[11] = (p) => s.output_tokens = p),
                type: "number",
                min: 0,
                disabled: e.saving
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _: 1
          })
        ])
      ]),
      u("section", fi, [
        u("button", {
          type: "button",
          class: U(["km-adv-toggle", { open: i.value }]),
          onClick: r[12] || (r[12] = (p) => i.value = !i.value)
        }, [
          b(o(D), {
            icon: "tabler:chevron-right",
            class: "km-adv-chev",
            "aria-hidden": "true"
          }),
          r[24] || (r[24] = T(" Advanced ", -1))
        ], 2),
        i.value ? (l(), f("div", vi, [
          u("div", mi, [
            b(o(F), { label: "Provider id" }, {
              default: k(() => [
                b(o(M), {
                  modelValue: s.provider_id,
                  "onUpdate:modelValue": r[13] || (r[13] = (p) => s.provider_id = p),
                  disabled: e.saving
                }, null, 8, ["modelValue", "disabled"])
              ]),
              _: 1
            }),
            b(o(F), { label: "Source" }, {
              default: k(() => [
                b(o(M), {
                  modelValue: s.source,
                  "onUpdate:modelValue": r[14] || (r[14] = (p) => s.source = p),
                  disabled: e.saving
                }, null, 8, ["modelValue", "disabled"])
              ]),
              _: 1
            }),
            b(o(F), { label: "Priority" }, {
              default: k(() => [
                b(o(M), {
                  modelValue: s.priority,
                  "onUpdate:modelValue": r[15] || (r[15] = (p) => s.priority = p),
                  type: "number",
                  disabled: e.saving
                }, null, 8, ["modelValue", "disabled"])
              ]),
              _: 1
            }),
            b(o(F), { label: "Dimensions" }, {
              default: k(() => [
                b(o(M), {
                  modelValue: s.dimensions,
                  "onUpdate:modelValue": r[16] || (r[16] = (p) => s.dimensions = p),
                  type: "number",
                  min: 0,
                  disabled: e.saving
                }, null, 8, ["modelValue", "disabled"])
              ]),
              _: 1
            })
          ]),
          b(o(F), {
            label: "Options JSON",
            help: "Raw provider options; merged with the controls above."
          }, {
            default: k(() => [
              X(u("textarea", {
                "onUpdate:modelValue": r[17] || (r[17] = (p) => s.options_json = p),
                class: "km-input mono km-textarea",
                disabled: e.saving
              }, null, 8, hi), [
                [Qe, s.options_json]
              ])
            ]),
            _: 1
          })
        ])) : $("", !0)
      ]),
      b(o(ze), {
        modelValue: s.enabled,
        "onUpdate:modelValue": r[18] || (r[18] = (p) => s.enabled = p),
        label: "Enabled",
        disabled: e.saving
      }, null, 8, ["modelValue", "disabled"]),
      u("div", yi, [
        b(o(oe), {
          variant: "ghost",
          disabled: e.saving,
          onClick: r[19] || (r[19] = (p) => a("cancel"))
        }, {
          default: k(() => [...r[25] || (r[25] = [
            T("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(o(oe), {
          type: "submit",
          icon: "tabler:device-floppy",
          loading: e.saving
        }, {
          default: k(() => [
            T(y(e.saving ? "Saving" : "Save model"), 1)
          ]),
          _: 1
        }, 8, ["loading"])
      ])
    ], 32));
  }
}), gi = { class: "km" }, $i = { class: "kx-rail-body" }, wi = "kickside-model-provider-openai-compatible", Ci = "wippy.llm.openai_compat:provider", _i = /* @__PURE__ */ I({
  __name: "models",
  setup(e) {
    const t = an(), { adapters: n, presets: a, profiles: d, models: i, classes: s, loading: m, saving: h, discovering: x, probing: g, error: c } = t, r = A("models"), p = Ee(() => n.value, () => d.value), E = A("all"), V = A("none"), Z = A("create"), N = A(null), C = A(null), L = A(null), H = A({ status: "idle" }), W = A({ status: "idle" }), q = A(""), J = A(null), ee = A("");
    function rt(v) {
      const _ = /* @__PURE__ */ new Set();
      for (const P of i.value) for (const de of v(P) ?? []) _.add(de);
      return Array.from(_).sort();
    }
    const lt = w(() => rt((v) => v.capabilities)), dt = w(() => {
      const v = /* @__PURE__ */ new Set();
      for (const _ of s.value) _.name && v.add(_.name);
      for (const _ of i.value) for (const P of _.class ?? []) v.add(P);
      return Array.from(v).sort();
    }), ut = w(
      () => C.value?.provider_id || N.value?.provider_id || Ci
    ), ve = w(() => p.adapterFor(ut.value)), me = w(
      () => N.value?.profile_editor_tag || ve.value?.profile_editor_tag || wi
    ), ct = w(() => Ht(me.value)), pt = w(() => Wt(me.value)), bt = w(() => V.value !== "none"), he = w(() => V.value === "pick" ? { title: "Add provider", icon: "tabler:plug-connected", back: !1 } : V.value === "provider" ? Z.value === "edit" ? { title: C.value?.name || "Edit provider", icon: "tabler:plug-connected", back: !1 } : { title: N.value?.title || "Add provider", icon: "tabler:plug-connected", back: !0 } : V.value === "model" ? { title: L.value?.title || L.value?.name || "Edit model", icon: "tabler:adjustments", back: !1 } : { title: "", icon: "", back: !1 });
    function G() {
      h.value || (V.value = "none", N.value = null, C.value = null, L.value = null, H.value = { status: "idle" });
    }
    function ye() {
      Z.value = "create", N.value = null, C.value = null, V.value = "pick";
    }
    function ft(v) {
      N.value = v, V.value = "provider";
    }
    function vt() {
      N.value = null, V.value = "pick";
    }
    function mt(v) {
      Z.value = "edit", N.value = null, C.value = v, H.value = { status: "idle" }, V.value = "provider";
    }
    async function Oe() {
      if (!C.value) return;
      H.value = { status: "testing" };
      const v = await t.testProfile(C.value.id);
      H.value = { status: v.ok ? "ok" : "fail", message: v.message };
    }
    function ht(v) {
      L.value = v, V.value = "model";
    }
    async function Ie(v) {
      const _ = v?.detail ?? v;
      await t.saveProfile(Z.value, C.value?.id || "", _) && G();
    }
    async function yt(v) {
      await t.saveCard(v) && G();
    }
    function kt(v) {
      return {
        name: v.name,
        title: v.title || v.name,
        description: v.description || "",
        provider_id: v.provider_id,
        provider_profile_id: v.provider_profile_id || void 0,
        provider_model: v.provider_model || v.name,
        capabilities: [...v.capabilities ?? []],
        classes: [...v.class ?? []],
        priority: Number(v.priority ?? 10),
        max_tokens: Number(v.max_tokens ?? 0),
        output_tokens: Number(v.output_tokens ?? 0),
        dimensions: Number(v.dimensions ?? 0),
        pricing: v.pricing ?? {},
        options: v.options ?? {},
        metadata: v.metadata ?? {},
        source: v.source === "registry" ? "overlay" : v.source || "overlay",
        enabled: v.enabled === !1
      };
    }
    async function gt(v) {
      await t.saveCard(kt(v));
    }
    async function $t(v) {
      q.value = "", W.value = { status: "testing", model: v.name, message: `Probing ${v.title || v.name}` };
      const _ = await t.testModel(v.name);
      W.value = {
        status: _.ok ? "ok" : "fail",
        model: v.name,
        message: _.message,
        data: _.data
      };
    }
    function wt(v) {
      W.value.model === v.name && (W.value.status !== "ok" && W.value.status !== "fail" || (q.value = q.value === v.name ? "" : v.name));
    }
    async function Ct() {
      const v = await t.exportSetup();
      if (!v) return;
      const _ = URL.createObjectURL(new Blob([JSON.stringify(v, null, 2)], { type: "application/json" })), P = document.createElement("a");
      P.href = _, P.download = "models-export.json", P.click(), URL.revokeObjectURL(_);
    }
    function Ae(v, _) {
      return `${v}: ${_.created.length} created, ${_.updated.length} updated, ${_.unchanged.length} unchanged`;
    }
    async function _t(v) {
      const _ = v.target, P = _.files?.[0];
      if (_.value = "", !P) return;
      ee.value = "";
      let de;
      try {
        de = JSON.parse(await P.text());
      } catch {
        c.value = `${P.name} is not valid JSON`;
        return;
      }
      const ke = await t.importSetup(de);
      ke && (ee.value = `${Ae("Providers", ke.profiles)}. ${Ae("Models", ke.cards)}.`);
    }
    async function St(v) {
      await Re.confirm({
        header: "Delete provider",
        message: `Remove “${v.name}”? This cannot be undone.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await t.deleteProfile(v.id);
    }
    async function xt(v) {
      if (v.source === "registry") return;
      const _ = v.title || v.name;
      await Re.confirm({
        header: "Delete model",
        message: `Remove “${_}”? This cannot be undone.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await t.deleteCard(v.name);
    }
    return Le(r, (v) => {
      v === "classes" && t.loadClasses();
    }), Rt(async () => {
      await Promise.all([t.load(), t.loadClasses()]);
    }), (v, _) => (l(), f("div", gi, [
      b(Fn, {
        value: r.value,
        label: "Model sections",
        items: [
          { value: "models", label: "Models", count: o(i).length },
          { value: "classes", label: "Classes", count: o(s).length }
        ],
        "onUpdate:value": _[0] || (_[0] = (P) => r.value = P)
      }, null, 8, ["value", "items"]),
      o(c) ? (l(), S(o(_e), {
        key: 0,
        severity: "danger",
        class: "km-top-notice",
        onDismiss: _[1] || (_[1] = (P) => c.value = "")
      }, {
        default: k(() => [
          T(y(o(c)), 1)
        ]),
        _: 1
      })) : $("", !0),
      ee.value ? (l(), S(o(_e), {
        key: 1,
        class: "km-top-notice",
        onDismiss: _[2] || (_[2] = (P) => ee.value = "")
      }, {
        default: k(() => [
          T(y(ee.value), 1)
        ]),
        _: 1
      })) : $("", !0),
      o(m) && !o(i).length && !o(d).length ? (l(), S(o(on), {
        key: 2,
        label: "Loading models…"
      })) : (l(), S(o(Mn), { key: 3 }, {
        rail: k(() => [
          b(o(qn), {
            title: "Providers",
            count: o(d).length
          }, {
            actions: k(() => [
              b(o(z), {
                icon: "tabler:plus",
                label: "Add provider",
                disabled: o(h),
                onClick: ye
              }, null, 8, ["disabled"]),
              b(o(z), {
                icon: "tabler:refresh",
                label: "Refresh",
                disabled: o(m),
                spin: o(m),
                onClick: o(t).load
              }, null, 8, ["disabled", "spin", "onClick"]),
              b(o(z), {
                icon: "tabler:download",
                label: "Export models",
                disabled: o(h),
                onClick: Ct
              }, null, 8, ["disabled"]),
              b(o(z), {
                icon: "tabler:upload",
                label: "Import models",
                disabled: o(h),
                onClick: _[3] || (_[3] = (P) => J.value?.click())
              }, null, 8, ["disabled"]),
              u("input", {
                ref_key: "importInput",
                ref: J,
                type: "file",
                accept: "application/json,.json",
                hidden: "",
                onChange: _t
              }, null, 544)
            ]),
            _: 1
          }, 8, ["count"]),
          u("div", $i, [
            b(Ja, {
              profiles: o(d),
              adapters: o(n),
              presets: o(a),
              "selected-id": E.value,
              discovering: o(x),
              busy: o(h),
              onSelect: _[4] || (_[4] = (P) => E.value = P),
              onAdd: ye,
              onEdit: mt,
              onDiscover: _[5] || (_[5] = (P) => o(t).discover(P.id)),
              onDelete: St
            }, null, 8, ["profiles", "adapters", "presets", "selected-id", "discovering", "busy"])
          ])
        ]),
        default: k(() => [
          r.value === "models" ? (l(), S(Bo, {
            key: 0,
            "selected-profile-id": E.value,
            models: o(i),
            profiles: o(d),
            adapters: o(n),
            presets: o(a),
            "probing-model": o(g),
            "probe-state": W.value,
            "probe-details-model": q.value,
            busy: o(h),
            onEdit: ht,
            onDelete: xt,
            onProbe: $t,
            onToggleProbeDetails: wt,
            onToggleEnabled: gt,
            onAdd: ye
          }, null, 8, ["selected-profile-id", "models", "profiles", "adapters", "presets", "probing-model", "probe-state", "probe-details-model", "busy"])) : (l(), S(Ko, {
            key: 1,
            classes: o(s)
          }, null, 8, ["classes"]))
        ]),
        _: 1
      })),
      b(o(Da), {
        open: bt.value,
        title: he.value.title,
        icon: he.value.icon,
        back: he.value.back,
        onClose: G,
        onBack: vt
      }, {
        default: k(() => [
          V.value === "pick" ? (l(), S(ii, {
            key: 0,
            presets: o(a),
            onPick: ft
          }, null, 8, ["presets"])) : V.value === "provider" && pt.value ? (l(), S(qt, {
            key: 1,
            "spec-key": ct.value,
            mode: Z.value,
            adapter: ve.value || void 0,
            preset: N.value || void 0,
            profile: C.value,
            saving: o(h),
            "test-state": H.value,
            onSave: Ie,
            onCancel: G,
            onTest: Oe
          }, null, 8, ["spec-key", "mode", "adapter", "preset", "profile", "saving", "test-state"])) : V.value === "provider" ? (l(), S(sn, {
            key: 2,
            tag: me.value,
            mode: Z.value,
            adapter: ve.value || void 0,
            preset: N.value || void 0,
            profile: C.value,
            saving: o(h),
            "test-state": H.value,
            onSave: Ie,
            onCancel: G,
            onTest: Oe
          }, null, 8, ["tag", "mode", "adapter", "preset", "profile", "saving", "test-state"])) : V.value === "model" ? (l(), S(ki, {
            key: 3,
            model: L.value,
            profiles: o(d),
            saving: o(h),
            "capability-options": lt.value,
            "class-options": dt.value,
            onSave: yt,
            onCancel: G
          }, null, 8, ["model", "profiles", "saving", "capability-options", "class-options"])) : $("", !0)
        ]),
        _: 1
      }, 8, ["open", "title", "icon", "back"])
    ]));
  }
}), Vi = {
  rootComponent: _i,
  plugins: [zt]
};
export {
  Vi as mountConfig
};
//# sourceMappingURL=lazy-mount-BtBjRiuv.js.map
