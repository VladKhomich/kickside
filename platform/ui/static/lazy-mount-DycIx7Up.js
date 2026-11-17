import { s as lt, a as Te, B as st, b as ut, O as dt, Y as ct, C as pt, c as Oe, P as ft, I as ht, D as vt, x as ke, d as mt, e as bt } from "./wc-runtime-asymqT3f.js";
import { defineComponent as Xe, ref as H, onMounted as Ke, watch as Ce, onBeforeUnmount as Ye, openBlock as v, createElementBlock as k, resolveComponent as gt, mergeProps as _, createCommentVNode as S, createVNode as g, withCtx as Re, Transition as yt, createElementVNode as a, computed as O, toDisplayString as I, unref as i, normalizeClass as N, createTextVNode as L, withDirectives as Fe, vModelText as _e, createBlock as fe, Fragment as Z, renderList as he, withModifiers as W } from "vue";
import { Icon as y } from "@iconify/vue";
import { loadByTagName as kt, api as He, host as we, on as wt } from "@wippy-fe/proxy";
const Ue = /* @__PURE__ */ Xe({
  __name: "IconField",
  props: {
    modelValue: {},
    fallback: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, c = H(null);
    let l = null;
    function m(w) {
      r("update:modelValue", w.detail || "");
    }
    async function h() {
      if (c.value) {
        l && l.removeEventListener("select", m), c.value.innerHTML = "";
        try {
          customElements.get("wc-icon-picker") || await kt("wc-icon-picker", { timeoutMs: 8e3 });
        } catch {
        }
        c.value && (l = document.createElement("wc-icon-picker"), l.setAttribute("value", t.modelValue || ""), t.fallback && l.setAttribute("fallback", t.fallback), l.addEventListener("select", m), c.value.appendChild(l));
      }
    }
    return Ke(h), Ce(() => t.modelValue, (w) => {
      l && l.getAttribute("value") !== w && l.setAttribute("value", w || "");
    }), Ye(() => {
      l && l.removeEventListener("select", m);
    }), (w, x) => (v(), k("div", {
      ref_key: "host",
      ref: c,
      class: "wc-iconfield"
    }, null, 512));
  }
});
var Ct = {
  name: "BaseEditableHolder",
  extends: lt,
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
      handler: function(e) {
        this.d_value = e;
      }
    },
    defaultValue: function(e) {
      this.d_value = e;
    },
    $formName: {
      immediate: !0,
      handler: function(e) {
        var t, r;
        this.formField = ((t = this.$pcForm) === null || t === void 0 || (r = t.register) === null || r === void 0 ? void 0 : r.call(t, e, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(e) {
        var t, r;
        this.formField = ((t = this.$pcForm) === null || t === void 0 || (r = t.register) === null || r === void 0 ? void 0 : r.call(t, this.$formName, e)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(e) {
        this.d_value !== e && (this.d_value = e);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(e) {
        var t;
        (t = this.$pcForm) !== null && t !== void 0 && t.getFieldState(this.$formName) && e !== this.d_value && (this.d_value = e);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(e, t) {
      var r, c;
      this.controlled && (this.d_value = e, this.$emit("update:modelValue", e)), this.$emit("value-change", e), (r = (c = this.formField).onChange) === null || r === void 0 || r.call(c, {
        originalEvent: t,
        value: e
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
        t[r] = arguments[r];
      return t.find(Te);
    }
  },
  computed: {
    $filled: function() {
      return Te(this.d_value);
    },
    $invalid: function() {
      var e, t;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (e = this.$pcFormField) === null || e === void 0 || (e = e.$field) === null || e === void 0 ? void 0 : e.invalid, (t = this.$pcForm) === null || t === void 0 || (t = t.getFieldState(this.$formName)) === null || t === void 0 ? void 0 : t.invalid);
    },
    $formName: function() {
      var e;
      return this.$formNovalidate ? void 0 : this.name || ((e = this.$formControl) === null || e === void 0 ? void 0 : e.name);
    },
    $formControl: function() {
      var e;
      return this.formControl || ((e = this.$pcFormField) === null || e === void 0 ? void 0 : e.formControl);
    },
    $formNovalidate: function() {
      var e;
      return (e = this.$formControl) === null || e === void 0 ? void 0 : e.novalidate;
    },
    $formDefaultValue: function() {
      var e, t;
      return this.findNonEmpty(this.d_value, (e = this.$pcFormField) === null || e === void 0 ? void 0 : e.initialValue, (t = this.$pcForm) === null || t === void 0 || (t = t.initialValues) === null || t === void 0 ? void 0 : t[this.$formName]);
    },
    $formValue: function() {
      var e, t;
      return this.findNonEmpty((e = this.$pcFormField) === null || e === void 0 || (e = e.$field) === null || e === void 0 ? void 0 : e.value, (t = this.$pcForm) === null || t === void 0 || (t = t.getFieldState(this.$formName)) === null || t === void 0 ? void 0 : t.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, Ht = `
    .p-colorpicker {
        display: inline-block;
        position: relative;
    }

    .p-colorpicker-dragging {
        cursor: pointer;
    }

    .p-colorpicker-preview {
        width: dt('colorpicker.preview.width');
        height: dt('colorpicker.preview.height');
        padding: 0;
        border: 0 none;
        border-radius: dt('colorpicker.preview.border.radius');
        transition:
            background dt('colorpicker.transition.duration'),
            color dt('colorpicker.transition.duration'),
            border-color dt('colorpicker.transition.duration'),
            outline-color dt('colorpicker.transition.duration'),
            box-shadow dt('colorpicker.transition.duration');
        outline-color: transparent;
        cursor: pointer;
    }

    .p-colorpicker-preview:enabled:focus-visible {
        border-color: dt('colorpicker.preview.focus.border.color');
        box-shadow: dt('colorpicker.preview.focus.ring.shadow');
        outline: dt('colorpicker.preview.focus.ring.width') dt('colorpicker.preview.focus.ring.style') dt('colorpicker.preview.focus.ring.color');
        outline-offset: dt('colorpicker.preview.focus.ring.offset');
    }

    .p-colorpicker-panel {
        background: dt('colorpicker.panel.background');
        border: 1px solid dt('colorpicker.panel.border.color');
        border-radius: dt('colorpicker.panel.border.radius');
        box-shadow: dt('colorpicker.panel.shadow');
        width: 193px;
        height: 166px;
        position: absolute;
        top: 0;
        left: 0;
    }

    .p-colorpicker-panel-inline {
        box-shadow: none;
        position: static;
    }

    .p-colorpicker-content {
        position: relative;
    }

    .p-colorpicker-color-selector {
        width: 150px;
        height: 150px;
        inset-block-start: 8px;
        inset-inline-start: 8px;
        position: absolute;
    }

    .p-colorpicker-color-background {
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    }

    .p-colorpicker-color-handle {
        position: absolute;
        inset-block-start: 0px;
        inset-inline-start: 150px;
        border-radius: 100%;
        width: 10px;
        height: 10px;
        border-width: 1px;
        border-style: solid;
        margin: -5px 0 0 -5px;
        cursor: pointer;
        opacity: 0.85;
        border-color: dt('colorpicker.handle.color');
    }

    .p-colorpicker-hue {
        width: 17px;
        height: 150px;
        inset-block-start: 8px;
        inset-inline-start: 167px;
        position: absolute;
        opacity: 0.85;
        background: linear-gradient(0deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
    }

    .p-colorpicker-hue-handle {
        position: absolute;
        inset-block-start: 150px;
        inset-inline-start: 0px;
        width: 21px;
        margin-inline-start: -2px;
        margin-block-start: -5px;
        height: 10px;
        border-width: 2px;
        border-style: solid;
        opacity: 0.85;
        cursor: pointer;
        border-color: dt('colorpicker.handle.color');
    }
`, Lt = {
  root: "p-colorpicker p-component",
  preview: function(e) {
    var t = e.props;
    return ["p-colorpicker-preview", {
      "p-disabled": t.disabled
    }];
  },
  panel: function(e) {
    var t = e.instance, r = e.props;
    return ["p-colorpicker-panel", {
      "p-colorpicker-panel-inline": r.inline,
      "p-disabled": r.disabled,
      "p-invalid": t.$invalid
    }];
  },
  colorSelector: "p-colorpicker-color-selector",
  colorBackground: "p-colorpicker-color-background",
  colorHandle: "p-colorpicker-color-handle",
  hue: "p-colorpicker-hue",
  hueHandle: "p-colorpicker-hue-handle"
}, $t = st.extend({
  name: "colorpicker",
  style: Ht,
  classes: Lt
}), St = {
  name: "BaseColorPicker",
  extends: Ct,
  props: {
    defaultColor: {
      type: null,
      default: "ff0000"
    },
    inline: {
      type: Boolean,
      default: !1
    },
    format: {
      type: String,
      default: "hex"
    },
    tabindex: {
      type: String,
      default: null
    },
    autoZIndex: {
      type: Boolean,
      default: !0
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    inputId: {
      type: String,
      default: null
    },
    panelClass: null,
    overlayClass: null
  },
  style: $t,
  provide: function() {
    return {
      $pcColorPicker: this,
      $parentInstance: this
    };
  }
}, Ze = {
  name: "ColorPicker",
  extends: St,
  inheritAttrs: !1,
  emits: ["change", "show", "hide"],
  data: function() {
    return {
      overlayVisible: !1
    };
  },
  hsbValue: null,
  localHue: null,
  outsideClickListener: null,
  documentMouseMoveListener: null,
  documentMouseUpListener: null,
  scrollHandler: null,
  resizeListener: null,
  hueDragging: null,
  colorDragging: null,
  selfUpdate: null,
  picker: null,
  colorSelector: null,
  colorHandle: null,
  hueView: null,
  hueHandle: null,
  watch: {
    modelValue: {
      immediate: !0,
      handler: function(e) {
        this.hsbValue = this.toHSB(e), this.selfUpdate ? this.selfUpdate = !1 : this.updateUI();
      }
    }
  },
  beforeUnmount: function() {
    this.unbindOutsideClickListener(), this.unbindDragListeners(), this.unbindResizeListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.picker && this.autoZIndex && ke.clear(this.picker), this.clearRefs();
  },
  mounted: function() {
    this.updateUI();
  },
  methods: {
    pickColor: function(e) {
      var t = this.colorSelector.getBoundingClientRect(), r = t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), c = t.left + document.body.scrollLeft, l = Math.floor(100 * Math.max(0, Math.min(150, (e.pageX || e.changedTouches[0].pageX) - c)) / 150), m = Math.floor(100 * (150 - Math.max(0, Math.min(150, (e.pageY || e.changedTouches[0].pageY) - r))) / 150);
      this.hsbValue = this.validateHSB({
        h: this.localHue,
        s: l,
        b: m
      }), this.selfUpdate = !0, this.updateColorHandle(), this.updateInput(), this.updateModel(e);
    },
    pickHue: function(e) {
      var t = this.hueView.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
      this.localHue = Math.floor(360 * (150 - Math.max(0, Math.min(150, (e.pageY || e.changedTouches[0].pageY) - t))) / 150), this.hsbValue = this.validateHSB({
        h: this.localHue,
        s: this.hsbValue.s,
        b: this.hsbValue.b
      }), this.selfUpdate = !0, this.updateColorSelector(), this.updateHue(), this.updateModel(e), this.updateInput();
    },
    updateModel: function(e) {
      var t = this.d_value;
      switch (this.format) {
        case "hex":
          t = this.HSBtoHEX(this.hsbValue);
          break;
        case "rgb":
          t = this.HSBtoRGB(this.hsbValue);
          break;
        case "hsb":
          t = this.hsbValue;
          break;
      }
      this.writeValue(t, e), this.$emit("change", {
        event: e,
        value: t
      });
    },
    updateColorSelector: function() {
      if (this.colorSelector) {
        var e = this.validateHSB({
          h: this.hsbValue.h,
          s: 100,
          b: 100
        });
        this.colorSelector.style.backgroundColor = "#" + this.HSBtoHEX(e);
      }
    },
    updateColorHandle: function() {
      this.colorHandle && (this.colorHandle.style.left = Math.floor(150 * this.hsbValue.s / 100) + "px", this.colorHandle.style.top = Math.floor(150 * (100 - this.hsbValue.b) / 100) + "px");
    },
    updateHue: function() {
      this.hueHandle && (this.hueHandle.style.top = Math.floor(150 - 150 * this.hsbValue.h / 360) + "px");
    },
    updateInput: function() {
      this.$refs.input && (this.$refs.input.style.backgroundColor = "#" + this.HSBtoHEX(this.hsbValue));
    },
    updateUI: function() {
      this.updateHue(), this.updateColorHandle(), this.updateInput(), this.updateColorSelector();
    },
    validateHSB: function(e) {
      return {
        h: Math.min(360, Math.max(0, e.h)),
        s: Math.min(100, Math.max(0, e.s)),
        b: Math.min(100, Math.max(0, e.b))
      };
    },
    validateRGB: function(e) {
      return {
        r: Math.min(255, Math.max(0, e.r)),
        g: Math.min(255, Math.max(0, e.g)),
        b: Math.min(255, Math.max(0, e.b))
      };
    },
    validateHEX: function(e) {
      var t = 6 - e.length;
      if (t > 0) {
        for (var r = [], c = 0; c < t; c++)
          r.push("0");
        r.push(e), e = r.join("");
      }
      return e;
    },
    HEXtoRGB: function(e) {
      var t = parseInt(e.indexOf("#") > -1 ? e.substring(1) : e, 16);
      return {
        r: t >> 16,
        g: (t & 65280) >> 8,
        b: t & 255
      };
    },
    HEXtoHSB: function(e) {
      return this.RGBtoHSB(this.HEXtoRGB(e));
    },
    RGBtoHSB: function(e) {
      var t = {
        h: 0,
        s: 0,
        b: 0
      }, r = Math.min(e.r, e.g, e.b), c = Math.max(e.r, e.g, e.b), l = c - r;
      return t.b = c, t.s = c !== 0 ? 255 * l / c : 0, t.s !== 0 ? e.r === c ? t.h = (e.g - e.b) / l : e.g === c ? t.h = 2 + (e.b - e.r) / l : t.h = 4 + (e.r - e.g) / l : t.h = -1, t.h *= 60, t.h < 0 && (t.h += 360), t.s *= 100 / 255, t.b *= 100 / 255, t;
    },
    HSBtoRGB: function(e) {
      var t = {
        r: null,
        g: null,
        b: null
      }, r = Math.round(e.h), c = Math.round(e.s * 255 / 100), l = Math.round(e.b * 255 / 100);
      if (c === 0)
        t = {
          r: l,
          g: l,
          b: l
        };
      else {
        var m = l, h = (255 - c) * l / 255, w = (m - h) * (r % 60) / 60;
        r === 360 && (r = 0), r < 60 ? (t.r = m, t.b = h, t.g = h + w) : r < 120 ? (t.g = m, t.b = h, t.r = m - w) : r < 180 ? (t.g = m, t.r = h, t.b = h + w) : r < 240 ? (t.b = m, t.r = h, t.g = m - w) : r < 300 ? (t.b = m, t.g = h, t.r = h + w) : r < 360 ? (t.r = m, t.g = h, t.b = m - w) : (t.r = 0, t.g = 0, t.b = 0);
      }
      return {
        r: Math.round(t.r),
        g: Math.round(t.g),
        b: Math.round(t.b)
      };
    },
    RGBtoHEX: function(e) {
      var t = [e.r.toString(16), e.g.toString(16), e.b.toString(16)];
      for (var r in t)
        t[r].length === 1 && (t[r] = "0" + t[r]);
      return t.join("");
    },
    HSBtoHEX: function(e) {
      return this.RGBtoHEX(this.HSBtoRGB(e));
    },
    toHSB: function(e) {
      var t;
      if (e)
        switch (this.format) {
          case "hex":
            t = this.HEXtoHSB(e);
            break;
          case "rgb":
            t = this.RGBtoHSB(e);
            break;
          case "hsb":
            t = e;
            break;
        }
      else
        t = this.HEXtoHSB(this.defaultColor);
      return t.s === 0 || t.b === 0 ? t.h = this.localHue : this.localHue = t.h, t;
    },
    onOverlayEnter: function(e) {
      this.updateUI(), this.alignOverlay(), this.bindOutsideClickListener(), this.bindScrollListener(), this.bindResizeListener(), this.autoZIndex && ke.set("overlay", e, this.baseZIndex || this.$primevue.config.zIndex.overlay), this.$attrSelector && e.setAttribute(this.$attrSelector, ""), this.$emit("show");
    },
    onOverlayLeave: function() {
      this.unbindOutsideClickListener(), this.unbindScrollListener(), this.unbindResizeListener(), this.clearRefs(), this.$emit("hide");
    },
    onOverlayAfterLeave: function(e) {
      this.autoZIndex && ke.clear(e);
    },
    alignOverlay: function() {
      this.appendTo === "self" ? ht(this.picker, this.$refs.input) : vt(this.picker, this.$refs.input);
    },
    onInputClick: function() {
      this.disabled || (this.overlayVisible = !this.overlayVisible);
    },
    onInputKeydown: function(e) {
      switch (e.code) {
        case "Space":
          this.overlayVisible = !this.overlayVisible, e.preventDefault();
          break;
        case "Escape":
        case "Tab":
          this.overlayVisible = !1;
          break;
      }
    },
    onInputBlur: function(e) {
      var t, r;
      (t = (r = this.formField).onBlur) === null || t === void 0 || t.call(r);
    },
    onColorMousedown: function(e) {
      this.disabled || (this.bindDragListeners(), this.onColorDragStart(e));
    },
    onColorDragStart: function(e) {
      this.disabled || (this.colorDragging = !0, this.pickColor(e), this.$el.setAttribute("p-colorpicker-dragging", "true"), !this.isUnstyled && Oe(this.$el, "p-colorpicker-dragging"), e.preventDefault());
    },
    onDrag: function(e) {
      this.colorDragging && (this.pickColor(e), e.preventDefault()), this.hueDragging && (this.pickHue(e), e.preventDefault());
    },
    onDragEnd: function() {
      this.colorDragging = !1, this.hueDragging = !1, this.$el.setAttribute("p-colorpicker-dragging", "false"), !this.isUnstyled && ft(this.$el, "p-colorpicker-dragging"), this.unbindDragListeners();
    },
    onHueMousedown: function(e) {
      this.disabled || (this.bindDragListeners(), this.onHueDragStart(e));
    },
    onHueDragStart: function(e) {
      this.disabled || (this.hueDragging = !0, this.pickHue(e), !this.isUnstyled && Oe(this.$el, "p-colorpicker-dragging"), e.preventDefault());
    },
    isInputClicked: function(e) {
      return this.$refs.input && this.$refs.input.isSameNode(e.target);
    },
    bindDragListeners: function() {
      this.bindDocumentMouseMoveListener(), this.bindDocumentMouseUpListener();
    },
    unbindDragListeners: function() {
      this.unbindDocumentMouseMoveListener(), this.unbindDocumentMouseUpListener();
    },
    bindOutsideClickListener: function() {
      var e = this;
      this.outsideClickListener || (this.outsideClickListener = function(t) {
        e.overlayVisible && e.picker && !e.picker.contains(t.target) && !e.isInputClicked(t) && (e.overlayVisible = !1);
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var e = this;
      this.scrollHandler || (this.scrollHandler = new pt(this.$refs.container, function() {
        e.overlayVisible && (e.overlayVisible = !1);
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var e = this;
      this.resizeListener || (this.resizeListener = function() {
        e.overlayVisible && !ct() && (e.overlayVisible = !1);
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    bindDocumentMouseMoveListener: function() {
      this.documentMouseMoveListener || (this.documentMouseMoveListener = this.onDrag.bind(this), document.addEventListener("mousemove", this.documentMouseMoveListener));
    },
    unbindDocumentMouseMoveListener: function() {
      this.documentMouseMoveListener && (document.removeEventListener("mousemove", this.documentMouseMoveListener), this.documentMouseMoveListener = null);
    },
    bindDocumentMouseUpListener: function() {
      this.documentMouseUpListener || (this.documentMouseUpListener = this.onDragEnd.bind(this), document.addEventListener("mouseup", this.documentMouseUpListener));
    },
    unbindDocumentMouseUpListener: function() {
      this.documentMouseUpListener && (document.removeEventListener("mouseup", this.documentMouseUpListener), this.documentMouseUpListener = null);
    },
    pickerRef: function(e) {
      this.picker = e;
    },
    colorSelectorRef: function(e) {
      this.colorSelector = e;
    },
    colorHandleRef: function(e) {
      this.colorHandle = e;
    },
    hueViewRef: function(e) {
      this.hueView = e;
    },
    hueHandleRef: function(e) {
      this.hueHandle = e;
    },
    clearRefs: function() {
      this.picker = null, this.colorSelector = null, this.colorHandle = null, this.hueView = null, this.hueHandle = null;
    },
    onOverlayClick: function(e) {
      dt.emit("overlay-click", {
        originalEvent: e,
        target: this.$el
      });
    }
  },
  components: {
    Portal: ut
  }
};
function le(n) {
  "@babel/helpers - typeof";
  return le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, le(n);
}
function Ae(n, e) {
  var t = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(n);
    e && (r = r.filter(function(c) {
      return Object.getOwnPropertyDescriptor(n, c).enumerable;
    })), t.push.apply(t, r);
  }
  return t;
}
function Ne(n) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ae(Object(t), !0).forEach(function(r) {
      Dt(n, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t)) : Ae(Object(t)).forEach(function(r) {
      Object.defineProperty(n, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return n;
}
function Dt(n, e, t) {
  return (e = Mt(e)) in n ? Object.defineProperty(n, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : n[e] = t, n;
}
function Mt(n) {
  var e = Vt(n, "string");
  return le(e) == "symbol" ? e : e + "";
}
function Vt(n, e) {
  if (le(n) != "object" || !n) return n;
  var t = n[Symbol.toPrimitive];
  if (t !== void 0) {
    var r = t.call(n, e);
    if (le(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(n);
}
var xt = ["id", "tabindex", "disabled"];
function Bt(n, e, t, r, c, l) {
  var m = gt("Portal");
  return v(), k("div", _({
    ref: "container",
    class: n.cx("root")
  }, n.ptmi("root")), [n.inline ? S("", !0) : (v(), k("input", _({
    key: 0,
    ref: "input",
    id: n.inputId,
    type: "text",
    class: n.cx("preview"),
    readonly: "",
    tabindex: n.tabindex,
    disabled: n.disabled,
    onClick: e[0] || (e[0] = function() {
      return l.onInputClick && l.onInputClick.apply(l, arguments);
    }),
    onKeydown: e[1] || (e[1] = function() {
      return l.onInputKeydown && l.onInputKeydown.apply(l, arguments);
    }),
    onBlur: e[2] || (e[2] = function() {
      return l.onInputBlur && l.onInputBlur.apply(l, arguments);
    })
  }, n.ptm("preview")), null, 16, xt)), g(m, {
    appendTo: n.appendTo,
    disabled: n.inline
  }, {
    default: Re(function() {
      return [g(yt, _({
        name: "p-anchored-overlay",
        onEnter: l.onOverlayEnter,
        onLeave: l.onOverlayLeave,
        onAfterLeave: l.onOverlayAfterLeave
      }, n.ptm("transition")), {
        default: Re(function() {
          return [n.inline || c.overlayVisible ? (v(), k("div", _({
            key: 0,
            ref: l.pickerRef,
            class: [n.cx("panel"), n.panelClass, n.overlayClass],
            onClick: e[11] || (e[11] = function() {
              return l.onOverlayClick && l.onOverlayClick.apply(l, arguments);
            })
          }, Ne(Ne({}, n.ptm("panel")), n.ptm("overlay"))), [a("div", _({
            class: n.cx("content")
          }, n.ptm("content")), [a("div", _({
            ref: l.colorSelectorRef,
            class: n.cx("colorSelector"),
            onMousedown: e[3] || (e[3] = function(h) {
              return l.onColorMousedown(h);
            }),
            onTouchstart: e[4] || (e[4] = function(h) {
              return l.onColorDragStart(h);
            }),
            onTouchmove: e[5] || (e[5] = function(h) {
              return l.onDrag(h);
            }),
            onTouchend: e[6] || (e[6] = function(h) {
              return l.onDragEnd();
            })
          }, n.ptm("colorSelector")), [a("div", _({
            class: n.cx("colorBackground")
          }, n.ptm("colorBackground")), [a("div", _({
            ref: l.colorHandleRef,
            class: n.cx("colorHandle")
          }, n.ptm("colorHandle")), null, 16)], 16)], 16), a("div", _({
            ref: l.hueViewRef,
            class: n.cx("hue"),
            onMousedown: e[7] || (e[7] = function(h) {
              return l.onHueMousedown(h);
            }),
            onTouchstart: e[8] || (e[8] = function(h) {
              return l.onHueDragStart(h);
            }),
            onTouchmove: e[9] || (e[9] = function(h) {
              return l.onDrag(h);
            }),
            onTouchend: e[10] || (e[10] = function(h) {
              return l.onDragEnd();
            })
          }, n.ptm("hue")), [a("div", _({
            ref: l.hueHandleRef,
            class: n.cx("hueHandle")
          }, n.ptm("hueHandle")), null, 16)], 16)], 16)], 16)) : S("", !0)];
        }),
        _: 1
      }, 16, ["onEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 1
  }, 8, ["appendTo", "disabled"])], 16);
}
Ze.render = Bt;
const Pe = "#d63a22", $e = "--p-primary";
function It(n) {
  const e = /^rgba?\(([^)]+)\)/i.exec((n || "").trim());
  if (!e) return null;
  const t = e[1].split(",").map((c) => parseFloat(c.trim()));
  if (t.length < 3 || t.slice(0, 3).some((c) => Number.isNaN(c))) return null;
  const r = (c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
  return `#${r(t[0])}${r(t[1])}${r(t[2])}`;
}
function Se(n) {
  let e = (n || "").trim().replace(/^#/, "");
  return e.length === 3 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), /^[0-9a-fA-F]{6}$/.test(e) ? `#${e.toLowerCase()}` : null;
}
function je(n) {
  const e = Se(n);
  if (!e) return null;
  const t = e.slice(1);
  return {
    r: parseInt(t.slice(0, 2), 16),
    g: parseInt(t.slice(2, 4), 16),
    b: parseInt(t.slice(4, 6), 16)
  };
}
function Le(n, e) {
  const t = Se(n);
  if (!t) return "";
  const r = `${$e}: ${t};`;
  return e === ":host" ? `:host { ${r} }` : [
    `:root { ${r} }`,
    `@media (prefers-color-scheme: dark) { :root:not(.w-theme-light) { ${r} } }`,
    `:root.w-theme-dark, .w-theme-dark { ${r} }`,
    `@media (prefers-color-scheme: light) { :root:not(.w-theme-dark) { ${r} } }`,
    `:root.w-theme-light, .w-theme-light { ${r} }`
  ].join(`
`);
}
function Et(n, e) {
  if (!n || typeof n != "object") return "";
  const t = n[$e];
  return typeof t == "string" ? Le(t, e) : "";
}
const Tt = { r: 255, g: 255, b: 255 }, Ot = { r: 12, g: 14, b: 18 }, Rt = 2, Ft = 2;
function ze(n) {
  const e = (t) => {
    const r = t / 255;
    return r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * e(n.r) + 0.7152 * e(n.g) + 0.0722 * e(n.b);
}
function Ge(n, e) {
  const t = ze(n), r = ze(e);
  return (Math.max(t, r) + 0.05) / (Math.min(t, r) + 0.05);
}
function _t(n, e = typeof document < "u" ? document : void 0) {
  const t = Se(n);
  if (!t) return null;
  if (!e || !e.body || !e.defaultView) return je(t);
  const r = e.createElement("span");
  r.style.setProperty($e, t), r.style.color = "var(--p-primary-color)", r.style.display = "none", e.body.appendChild(r);
  const c = e.defaultView.getComputedStyle(r).color;
  return r.remove(), je(It(c) || t);
}
function Ut(n) {
  const e = _t(n);
  if (!e) return null;
  const t = Ge(e, Tt), r = Ge(e, Ot), c = t >= Rt, l = r >= Ft;
  let m = "";
  return !c && !l ? m = "This tone is too low-contrast - buttons and accents would be unreadable in both light and dark mode." : c ? l || (m = "This tone is too dark - accents would be invisible against the dark background.") : m = "This tone is too light - white button text and accents would be unreadable in light mode.", { ok: c && l, onLight: t, onDark: r, reason: m };
}
function At({ items: n, categories: e, overrides: t, home: r }) {
  const c = (s) => s.route_name || s.id;
  function l(s, u) {
    const f = c(s), $ = { ...t.value[f] || {} };
    for (const [B, V] of Object.entries(u))
      V === void 0 || V === "" ? delete $[B] : $[B] = V;
    t.value = { ...t.value, [f]: $ };
  }
  function m(s, u) {
    l(s, { hidden: u || void 0 }), s.hidden = u;
  }
  function h(s, u) {
    l(s, { category: u }), s.category = u;
  }
  function w(s, u) {
    l(s, { order: u }), s.order = u;
  }
  function x(s, u) {
    const f = u.replace(/^\s+/, "");
    s.label = f, l(s, { label: f || void 0 });
  }
  function E(s, u) {
    const f = (u || "").trim();
    s.icon = f, l(s, { icon: f || void 0 });
  }
  function z(s) {
    const u = t.value[c(s)];
    return !!u && (u.label !== void 0 || u.icon !== void 0);
  }
  const D = O(() => [...e.value].sort((s, u) => s.order - u.order));
  function R(s) {
    return n.value.filter((u) => !u.hidden && (u.category || "") === s).sort((u, f) => u.order - f.order || u.label.localeCompare(f.label));
  }
  const ve = O(() => {
    const s = [];
    s.push({ key: "", label: "Ungrouped", real: !1 });
    for (const f of D.value) s.push({ key: f.key, label: f.label || f.key, real: !0 });
    const u = /* @__PURE__ */ new Set(["", ...e.value.map((f) => f.key)]);
    for (const f of n.value)
      f.category && !u.has(f.category) && (u.add(f.category), s.push({ key: f.category, label: f.category, real: !1 }));
    return s;
  }), me = O(() => n.value.filter((s) => s.hidden)), q = (s) => e.value.find((u) => u.key === s), M = H(null), G = H(null), J = H(null), C = (s) => n.value.find((u) => u.id === s);
  function Q(s, u) {
    M.value = s.id, u.dataTransfer && (u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", s.id));
  }
  function T() {
    M.value = null, G.value = null, J.value = null;
  }
  function be(s) {
    const u = M.value ? C(M.value) : null;
    if (!u || u.id === s.id) return T();
    const f = s.category || "", $ = R(f).filter((V) => V.id !== u.id), B = $.indexOf(s);
    $.splice(B < 0 ? $.length : B, 0, u), h(u, f), $.forEach((V, U) => w(V, U * 10)), T();
  }
  function ge(s) {
    const u = M.value ? C(M.value) : null;
    if (!u) return T();
    const f = R(s).filter(($) => $.id !== u.id);
    f.push(u), h(u, s), f.forEach(($, B) => w($, B * 10)), T();
  }
  function P(s, u) {
    G.value = s, u.dataTransfer && (u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", "cat:" + s));
  }
  function ee(s) {
    const u = G.value;
    if (!u || u === s) return T();
    const f = [...D.value], $ = f.findIndex((U) => U.key === u), B = f.findIndex((U) => U.key === s);
    if ($ < 0 || B < 0) return T();
    const [V] = f.splice($, 1);
    f.splice(B, 0, V), f.forEach((U, oe) => {
      const re = e.value.find((ye) => ye.key === U.key);
      re && (re.order = oe * 10);
    }), T();
  }
  let X = 0;
  function se() {
    X += 1;
    const s = D.value[D.value.length - 1];
    e.value.push({ key: "cat_" + Date.now().toString(36) + "_" + X, label: "New category", icon: "tabler:folder", order: (s?.order ?? 0) + 10 });
  }
  function K(s) {
    for (const u of n.value) u.category === s && h(u, "");
    e.value = e.value.filter((u) => u.key !== s);
  }
  function te(s, u) {
    const f = q(s);
    f && (f.label = u);
  }
  function ne(s, u) {
    const f = q(s);
    f && (f.icon = (u || "").trim() || void 0);
  }
  function j(s) {
    return !!r.value && r.value === s.path;
  }
  function ue(s) {
    r.value = j(s) ? "" : s.path;
  }
  return {
    itemKey: c,
    patchOverride: l,
    setHidden: m,
    setCategory: h,
    setOrder: w,
    setLabel: x,
    setIcon: E,
    hasOverride: z,
    orderedCats: D,
    itemsOf: R,
    editorGroups: ve,
    hiddenItems: me,
    catByKey: q,
    dragItemId: M,
    dragCatKey: G,
    overGroup: J,
    onItemDragStart: Q,
    endDrag: T,
    onItemDrop: be,
    onGroupDrop: ge,
    onCatDragStart: P,
    onCatDrop: ee,
    addCategory: se,
    removeCategory: K,
    renameCategory: te,
    setCatIcon: ne,
    isHome: j,
    setHome: ue
  };
}
function Nt({ logoUrl: n, error: e, apiError: t }) {
  const r = H(!1);
  async function c(m) {
    const h = m.target, w = h.files && h.files[0];
    if (w) {
      if (!w.type.startsWith("image/")) {
        e.value = "Logo must be an image", h.value = "";
        return;
      }
      if (w.size > 2 * 1024 * 1024) {
        e.value = "Logo too large (max 2 MB)", h.value = "";
        return;
      }
      r.value = !0, e.value = "";
      try {
        const x = new FormData();
        x.append("logo", w);
        const { data: E } = await He.post("/api/v1/nav/logo", x, { headers: { "Content-Type": "multipart/form-data" } });
        if (!E.success || !E.url) throw new Error(E.error || "upload failed");
        n.value = E.url;
      } catch (x) {
        e.value = t(x, "upload failed");
      } finally {
        r.value = !1, h.value = "";
      }
    }
  }
  function l() {
    n.value = "";
  }
  return { uploadingLogo: r, uploadLogo: c, removeLogo: l };
}
const Pt = { class: "ap" }, jt = { class: "ap-body" }, zt = { class: "ap-bar" }, Gt = {
  key: 0,
  class: "ap-dirty ap-dirty-warn"
}, Xt = {
  key: 1,
  class: "ap-dirty"
}, Kt = ["disabled"], Yt = ["disabled"], Zt = {
  key: 0,
  class: "ap-msg ap-err"
}, Wt = {
  key: 1,
  class: "ap-loading"
}, qt = {
  key: 2,
  class: "ap-grid"
}, Jt = { class: "ap-side" }, Qt = { class: "ap-card" }, en = { class: "ap-h" }, tn = { class: "ap-logo" }, nn = { class: "ap-logo-prev" }, on = ["src"], rn = { class: "ap-logo-actions" }, an = ["accept", "disabled"], ln = { class: "ap-hint" }, sn = { class: "ap-tone" }, un = ["placeholder"], dn = {
  key: 0,
  class: "ap-tone-warn",
  role: "alert"
}, cn = {
  class: "ap-theme-modes",
  role: "group",
  "aria-label": "Color scheme"
}, pn = ["aria-pressed", "onClick"], fn = { class: "ap-card" }, hn = { class: "ap-h" }, vn = { class: "ap-layouts" }, mn = { class: "ap-lo-name" }, bn = { class: "ap-lo-name" }, gn = { class: "ap-card ap-legend" }, yn = { class: "ap-h" }, kn = { class: "ap-tips" }, wn = { class: "ap-card ap-structure" }, Cn = { class: "ap-h" }, Hn = ["onDragover", "onDragleave", "onDrop"], Ln = ["onDrop"], $n = ["onDragstart"], Sn = {
  key: 1,
  class: "ap-grip ap-grip-ghost",
  "aria-hidden": "true"
}, Dn = ["value", "onInput"], Mn = { class: "ap-tile ap-tile-muted" }, Vn = { class: "ap-field ap-field-strong ap-field-static" }, xn = { class: "ap-count" }, Bn = ["onClick"], In = {
  key: 0,
  class: "ap-drop-hint"
}, En = ["onDrop"], Tn = ["onDragstart"], On = ["value", "onInput"], Rn = { class: "ap-path" }, Fn = {
  key: 0,
  class: "ap-pill kx-tag-sm"
}, _n = {
  key: 1,
  class: "ap-pill kx-tag-sm ap-pill-home"
}, Un = ["aria-label", "title", "onClick"], An = ["onClick"], Nn = {
  key: 0,
  class: "ap-hidden"
}, Pn = {
  key: 0,
  class: "ap-hidden-list"
}, jn = { class: "ap-tile" }, zn = { class: "ap-field ap-field-strong ap-field-static" }, Gn = ["onClick"], Xn = /* @__PURE__ */ Xe({
  __name: "appearance",
  setup(n) {
    const e = H(!0), t = H(!1), r = H("");
    function c(p, o) {
      return p?.response?.data?.error || p?.message || o;
    }
    const l = H("vertical"), m = H(we.getThemeMode?.() ?? "auto"), h = H([]), w = H([]), x = H({}), E = H(!1), z = H(""), D = H(""), R = H(), ve = O(() => R.value?.formats.flatMap((p) => [p.mime, ...p.extensions.map((o) => `.${o}`)]).join(",")), me = O(() => R.value ? `${R.value.formats.map((p) => p.label).join(", ")} · up to ${R.value.max_bytes / 1048576} MB.` : ""), q = Nt({ logoUrl: D, error: r, apiError: c }), { uploadingLogo: M, uploadLogo: G, removeLogo: J } = q, C = H(""), Q = H(Pe), T = O({
      // PrimeVue's <ColorPicker format="hex"> exchanges a BARE rrggbb string, while the stored
      // setting and the hex text field both keep the #-prefixed form — so strip on the way in
      // and re-add on the way out. Falling back to defaultTone keeps the swatch showing the live
      // theme tone while the setting is unset.
      get: () => (C.value || Q.value).trim().replace(/^#/, ""),
      set: (p) => {
        const o = String(p ?? "").replace(/^#/, "");
        C.value = o ? `#${o}` : "";
      }
    });
    function be() {
      C.value = "";
    }
    function ge(p) {
      m.value = p, we.setThemeMode(p);
    }
    const P = O(() => C.value.trim() ? Ut(C.value) : null), ee = O(() => !!C.value.trim() && P.value === null), X = O(() => ee.value || !!P.value && !P.value.ok), se = O(() => ee.value ? "Enter a valid hex color, e.g. #2563eb." : P.value && !P.value.ok ? P.value.reason : ""), K = H(""), te = H(""), ne = () => JSON.stringify({
      layout: l.value,
      cats: w.value,
      overrides: x.value,
      title: z.value,
      logo: D.value,
      home: K.value,
      tone: C.value,
      pos: h.value.map((p) => [p.id, p.category, p.order, !!p.hidden])
    }), j = O(() => ne() !== te.value);
    async function ue() {
      e.value = !0, r.value = "";
      try {
        const { data: p } = await He.get("/api/v1/nav/list?manage=1");
        if (!p.success) throw new Error(p.error || "failed to load nav");
        R.value = p.logo_upload, h.value = (p.items ?? []).map((d) => ({ ...d })), l.value = p.layout === "horizontal" ? "horizontal" : "vertical";
        const o = p.config ?? {};
        return w.value = Array.isArray(o.categories) ? o.categories.map((d) => ({ ...d })) : [], x.value = o.overrides && typeof o.overrides == "object" ? structuredClone(o.overrides) : {}, z.value = typeof o.title == "string" ? o.title : "", D.value = typeof o.logo_url == "string" ? o.logo_url : "", C.value = typeof o.primary_color == "string" ? o.primary_color : "", ae = C.value, K.value = typeof p.home == "string" ? p.home : typeof o.home == "string" ? o.home : "", te.value = ne(), !0;
      } catch (p) {
        return r.value = c(p, "failed to load"), !1;
      } finally {
        e.value = !1;
      }
    }
    const s = At({ items: h, categories: w, overrides: x, home: K }), {
      setHidden: u,
      setLabel: f,
      setIcon: $,
      hasOverride: B,
      itemsOf: V,
      editorGroups: U,
      hiddenItems: oe,
      catByKey: re,
      dragItemId: ye,
      overGroup: de,
      onItemDragStart: We,
      endDrag: ce,
      onItemDrop: qe,
      onGroupDrop: De,
      onCatDragStart: Je,
      onCatDrop: Qe,
      addCategory: Me,
      removeCategory: et,
      renameCategory: tt,
      setCatIcon: nt,
      isHome: ie,
      setHome: ot
    } = s;
    let A = null, Ve = !1, ae = "", xe = null;
    async function rt() {
      try {
        const p = await fetch("/app/css-variables.facade.json", { cache: "no-store" });
        if (!p.ok) return;
        const o = await p.json();
        if (o && typeof o == "object") {
          xe = o;
          const d = o["--p-primary"];
          typeof d == "string" && (Q.value = d), !C.value.trim() && pe.value !== !1 && Y("");
        }
      } catch {
      }
    }
    function Be(p, o) {
      return Le(p, o) || Et(xe, o) || Le(Pe, o);
    }
    function Y(p) {
      window.dispatchEvent(new CustomEvent("kickside:tone-apply", {
        detail: { hostCss: Be(p, ":root"), shadowCss: Be(p, ":host") }
      }));
    }
    Ye(() => {
      Ve = !0, A && clearTimeout(A), Y(ae), Ie?.();
    });
    async function it() {
      if (X.value) return;
      const p = ne(), o = C.value;
      t.value = !0, r.value = "";
      try {
        const { data: d } = await He.put("/api/v1/nav/config", {
          layout: l.value,
          overrides: x.value,
          categories: w.value,
          title: z.value,
          logo_url: D.value,
          home: K.value,
          primary_color: C.value
        });
        if (!d.success) throw new Error(d.error || "save failed");
        te.value = p, ae = o, Y(Ve || pe.value === !1 ? ae : C.value);
      } catch (d) {
        r.value = c(d, "save failed");
      } finally {
        t.value = !1;
      }
    }
    let Ie = null;
    Ke(() => {
      m.value = we.getThemeMode?.() ?? "auto", Ie = wt("@theme", (p) => {
        m.value = p;
      }), rt();
    });
    let Ee = !1;
    async function at() {
      Ee && j.value || await ue() && (Ee = !0);
    }
    const pe = mt(at);
    return Ce(C, (p) => {
      A && clearTimeout(A), A = null, pe.value !== !1 && (A = setTimeout(() => Y(p), 90));
    }), Ce(pe, (p, o) => {
      o === !0 && p === !1 ? (A && clearTimeout(A), A = null, Y(ae)) : o === !1 && p === !0 && j.value && Y(C.value);
    }), (p, o) => (v(), k("div", Pt, [
      a("div", jt, [
        a("header", zt, [
          X.value ? (v(), k("span", Gt, I(ee.value ? "Invalid color" : "Tone unreadable"), 1)) : j.value ? (v(), k("span", Xt, "Unsaved changes")) : S("", !0),
          a("button", {
            class: "ap-btn ap-btn-ghost",
            disabled: !j.value || t.value,
            onClick: ue
          }, "Discard", 8, Kt),
          a("button", {
            class: "ap-btn ap-btn-primary",
            disabled: !j.value || t.value || X.value,
            onClick: it
          }, [
            g(i(y), {
              icon: t.value ? "tabler:loader-2" : "tabler:device-floppy",
              class: N(t.value && "spin"),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            L(" " + I(t.value ? "Saving…" : "Save"), 1)
          ], 8, Yt)
        ]),
        r.value ? (v(), k("div", Zt, I(r.value), 1)) : S("", !0),
        e.value ? (v(), k("div", Wt, [
          g(i(y), {
            icon: "tabler:loader-2",
            class: "spin"
          }),
          o[13] || (o[13] = L(" Loading…", -1))
        ])) : (v(), k("div", qt, [
          a("aside", Jt, [
            a("section", Qt, [
              a("header", en, [
                g(i(y), {
                  icon: "tabler:photo",
                  "aria-hidden": "true"
                }),
                o[14] || (o[14] = L(" Branding", -1))
              ]),
              o[17] || (o[17] = a("p", { class: "ap-sub" }, "Title and logo apply to everyone on this installation — header, login page, and browser tab.", -1)),
              o[18] || (o[18] = a("label", { class: "ap-blabel" }, "Title", -1)),
              Fe(a("input", {
                "onUpdate:modelValue": o[0] || (o[0] = (d) => z.value = d),
                class: "ap-binput",
                type: "text",
                maxlength: "60",
                placeholder: "KickSide"
              }, null, 512), [
                [_e, z.value]
              ]),
              o[19] || (o[19] = a("label", { class: "ap-blabel" }, "Logo", -1)),
              a("div", tn, [
                a("span", nn, [
                  D.value ? (v(), k("img", {
                    key: 0,
                    src: D.value,
                    alt: "Logo preview"
                  }, null, 8, on)) : (v(), fe(i(y), {
                    key: 1,
                    icon: "tabler:photo",
                    "aria-hidden": "true"
                  }))
                ]),
                a("div", rn, [
                  a("label", {
                    class: N(["ap-btn ap-btn-ghost", i(M) && "ap-btn-busy"])
                  }, [
                    g(i(y), {
                      icon: i(M) ? "tabler:loader-2" : "tabler:upload",
                      class: N(i(M) && "spin"),
                      "aria-hidden": "true"
                    }, null, 8, ["icon", "class"]),
                    L(" " + I(i(M) ? "Uploading…" : "Upload") + " ", 1),
                    a("input", {
                      type: "file",
                      accept: ve.value,
                      class: "ap-file",
                      disabled: i(M) || !R.value,
                      onChange: o[1] || (o[1] = //@ts-ignore
                      (...d) => i(G) && i(G)(...d))
                    }, null, 40, an)
                  ], 2),
                  D.value ? (v(), k("button", {
                    key: 0,
                    class: "ap-btn ap-btn-ghost ap-danger",
                    onClick: o[2] || (o[2] = //@ts-ignore
                    (...d) => i(J) && i(J)(...d))
                  }, [
                    g(i(y), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    }),
                    o[15] || (o[15] = L(" Remove ", -1))
                  ])) : S("", !0)
                ])
              ]),
              a("p", ln, I(me.value), 1),
              o[20] || (o[20] = a("label", { class: "ap-blabel" }, "Base tone", -1)),
              a("div", sn, [
                g(i(Ze), {
                  modelValue: T.value,
                  "onUpdate:modelValue": o[3] || (o[3] = (d) => T.value = d),
                  format: "hex",
                  class: "ap-tone-swatch",
                  pt: { preview: { class: "ap-tone-preview", "aria-label": "Base tone color", "data-testid": "appearance-base-tone-picker" } }
                }, null, 8, ["modelValue"]),
                Fe(a("input", {
                  "onUpdate:modelValue": o[4] || (o[4] = (d) => C.value = d),
                  class: "ap-binput ap-tone-hex",
                  type: "text",
                  maxlength: "7",
                  placeholder: Q.value,
                  "aria-label": "Base tone hex"
                }, null, 8, un), [
                  [_e, C.value]
                ]),
                C.value ? (v(), k("button", {
                  key: 0,
                  class: "ap-btn ap-btn-ghost",
                  onClick: be
                }, [
                  g(i(y), {
                    icon: "tabler:rotate",
                    "aria-hidden": "true"
                  }),
                  o[16] || (o[16] = L(" Reset", -1))
                ])) : S("", !0)
              ]),
              se.value ? (v(), k("p", dn, [
                g(i(y), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                L(" " + I(se.value), 1)
              ])) : S("", !0),
              o[21] || (o[21] = a("p", { class: "ap-hint" }, "Primary color for buttons, links and accents. Applies across the app instantly.", -1)),
              o[22] || (o[22] = a("label", { class: "ap-blabel" }, "Color scheme", -1)),
              a("div", cn, [
                (v(), k(Z, null, he([
                  { mode: "auto", label: "Auto", icon: "tabler:device-desktop" },
                  { mode: "light", label: "Light", icon: "tabler:sun" },
                  { mode: "dark", label: "Dark", icon: "tabler:moon" }
                ], (d) => a("button", {
                  key: d.mode,
                  type: "button",
                  class: N(["ap-theme-mode", m.value === d.mode && "ap-theme-mode-on"]),
                  "aria-pressed": m.value === d.mode,
                  onClick: (b) => ge(d.mode)
                }, [
                  g(i(y), {
                    icon: d.icon,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  L(" " + I(d.label), 1)
                ], 10, pn)), 64))
              ]),
              o[23] || (o[23] = a("p", { class: "ap-hint" }, "Auto follows your browser or operating system setting. Changes apply immediately.", -1))
            ]),
            a("section", fn, [
              a("header", hn, [
                g(i(y), {
                  icon: "tabler:layout-2",
                  "aria-hidden": "true"
                }),
                o[24] || (o[24] = L(" Layout", -1))
              ]),
              o[31] || (o[31] = a("p", { class: "ap-sub" }, "Where navigation sits.", -1)),
              a("div", vn, [
                a("button", {
                  class: N(["ap-lo", l.value === "vertical" && "ap-lo-on"]),
                  onClick: o[5] || (o[5] = (d) => l.value = "vertical")
                }, [
                  o[26] || (o[26] = a("span", { class: "mock mock-v" }, [
                    a("span", { class: "mock-rail" }, [
                      a("i"),
                      a("i"),
                      a("i")
                    ]),
                    a("span", { class: "mock-fill" })
                  ], -1)),
                  a("span", mn, [
                    o[25] || (o[25] = L("Vertical ", -1)),
                    l.value === "vertical" ? (v(), fe(i(y), {
                      key: 0,
                      icon: "tabler:circle-check-filled",
                      "aria-hidden": "true"
                    })) : S("", !0)
                  ]),
                  o[27] || (o[27] = a("span", { class: "ap-lo-desc" }, "Sidebar rail", -1))
                ], 2),
                a("button", {
                  class: N(["ap-lo", l.value === "horizontal" && "ap-lo-on"]),
                  onClick: o[6] || (o[6] = (d) => l.value = "horizontal")
                }, [
                  o[29] || (o[29] = a("span", { class: "mock mock-h" }, [
                    a("span", { class: "mock-top" }, [
                      a("i"),
                      a("i"),
                      a("i")
                    ]),
                    a("span", { class: "mock-fill" })
                  ], -1)),
                  a("span", bn, [
                    o[28] || (o[28] = L("Horizontal ", -1)),
                    l.value === "horizontal" ? (v(), fe(i(y), {
                      key: 0,
                      icon: "tabler:circle-check-filled",
                      "aria-hidden": "true"
                    })) : S("", !0)
                  ]),
                  o[30] || (o[30] = a("span", { class: "ap-lo-desc" }, "Top bar", -1))
                ], 2)
              ])
            ]),
            a("section", gn, [
              a("header", yn, [
                g(i(y), {
                  icon: "tabler:info-circle",
                  "aria-hidden": "true"
                }),
                o[32] || (o[32] = L(" How it works", -1))
              ]),
              a("ul", kn, [
                a("li", null, [
                  g(i(y), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  }),
                  o[33] || (o[33] = L(" Drag to reorder or move between categories.", -1))
                ]),
                a("li", null, [
                  g(i(y), {
                    icon: "tabler:cursor-text",
                    "aria-hidden": "true"
                  }),
                  o[34] || (o[34] = L(" Click a label to rename it.", -1))
                ]),
                a("li", null, [
                  g(i(y), {
                    icon: "tabler:mood-smile",
                    "aria-hidden": "true"
                  }),
                  o[35] || (o[35] = L(" Click an icon to pick a new Tabler glyph.", -1))
                ]),
                a("li", null, [
                  g(i(y), {
                    icon: "tabler:eye-off",
                    "aria-hidden": "true"
                  }),
                  o[36] || (o[36] = L(" Hide a surface without removing its module.", -1))
                ])
              ])
            ])
          ]),
          a("section", wn, [
            a("header", Cn, [
              g(i(y), {
                icon: "tabler:sitemap",
                "aria-hidden": "true"
              }),
              o[38] || (o[38] = L(" Structure ", -1)),
              a("button", {
                class: "ap-btn ap-btn-ghost ap-add",
                onClick: o[7] || (o[7] = //@ts-ignore
                (...d) => i(Me) && i(Me)(...d))
              }, [
                g(i(y), {
                  icon: "tabler:folder-plus",
                  "aria-hidden": "true"
                }),
                o[37] || (o[37] = L(" Add category", -1))
              ])
            ]),
            (v(!0), k(Z, null, he(i(U), (d) => (v(), k("div", {
              key: d.key || "_root",
              class: N(["ap-group", i(de) === d.key && "ap-group-over"]),
              onDragover: W((b) => de.value = d.key, ["prevent"]),
              onDragleave: (b) => i(de) === d.key && (de.value = null),
              onDrop: W((b) => i(De)(d.key), ["prevent"])
            }, [
              a("div", {
                class: "ap-group-head",
                onDragover: o[9] || (o[9] = W(() => {
                }, ["prevent"])),
                onDrop: W((b) => d.real ? i(Qe)(d.key) : i(De)(d.key), ["prevent", "stop"])
              }, [
                d.real ? (v(), k("span", {
                  key: 0,
                  class: "ap-grip ap-grip-cat",
                  draggable: "true",
                  title: "Drag to reorder category",
                  onDragstart: (b) => i(Je)(d.key, b),
                  onDragend: o[8] || (o[8] = //@ts-ignore
                  (...b) => i(ce) && i(ce)(...b))
                }, [
                  g(i(y), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ], 40, $n)) : (v(), k("span", Sn)),
                d.real ? (v(), k(Z, { key: 2 }, [
                  g(Ue, {
                    "model-value": i(re)(d.key)?.icon || "",
                    fallback: "tabler:folder",
                    "onUpdate:modelValue": (b) => i(nt)(d.key, b)
                  }, null, 8, ["model-value", "onUpdate:modelValue"]),
                  a("input", {
                    value: i(re)(d.key)?.label,
                    class: "ap-field ap-field-strong",
                    "aria-label": "Category name",
                    placeholder: "Category name",
                    onInput: (b) => i(tt)(d.key, b.target.value)
                  }, null, 40, Dn)
                ], 64)) : (v(), k(Z, { key: 3 }, [
                  a("span", Mn, [
                    g(i(y), {
                      icon: "tabler:layout-list",
                      "aria-hidden": "true"
                    })
                  ]),
                  a("span", Vn, I(d.label), 1)
                ], 64)),
                a("span", xn, I(i(V)(d.key).length), 1),
                d.real ? (v(), k("button", {
                  key: 4,
                  class: "ap-icon-btn ap-danger",
                  "aria-label": "Remove category",
                  title: "Remove category",
                  onClick: (b) => i(et)(d.key)
                }, [
                  g(i(y), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ], 8, Bn)) : S("", !0)
              ], 40, Ln),
              i(V)(d.key).length === 0 ? (v(), k("div", In, "Drag a surface here")) : S("", !0),
              (v(!0), k(Z, null, he(i(V)(d.key), (b) => (v(), k("div", {
                key: b.id,
                class: N(["ap-row", i(ye) === b.id && "ap-row-dragging"]),
                onDragover: o[11] || (o[11] = W(() => {
                }, ["prevent", "stop"])),
                onDrop: W((F) => i(qe)(b), ["prevent", "stop"])
              }, [
                a("span", {
                  class: "ap-grip",
                  draggable: "true",
                  title: "Drag to reorder or move",
                  onDragstart: (F) => i(We)(b, F),
                  onDragend: o[10] || (o[10] = //@ts-ignore
                  (...F) => i(ce) && i(ce)(...F))
                }, [
                  g(i(y), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ], 40, Tn),
                g(Ue, {
                  "model-value": b.icon || "",
                  fallback: "tabler:square",
                  "onUpdate:modelValue": (F) => i($)(b, F)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                a("input", {
                  value: b.label,
                  class: "ap-field ap-field-strong",
                  "aria-label": "Surface label",
                  placeholder: "Label",
                  onInput: (F) => i(f)(b, F.target.value)
                }, null, 40, On),
                a("span", Rn, I(b.path), 1),
                b.source === "custom" ? (v(), k("span", Fn, "custom")) : S("", !0),
                i(ie)(b) ? (v(), k("span", _n, [
                  g(i(y), {
                    icon: "tabler:home",
                    "aria-hidden": "true"
                  }),
                  o[39] || (o[39] = L(" home", -1))
                ])) : S("", !0),
                i(B)(b) ? (v(), fe(i(y), {
                  key: 2,
                  icon: "tabler:pencil",
                  class: "ap-edited",
                  title: "Customized — reset the field to revert",
                  "aria-hidden": "true"
                })) : S("", !0),
                a("button", {
                  class: N(["ap-icon-btn", i(ie)(b) && "ap-home-on"]),
                  "aria-label": i(ie)(b) ? "Home page (click to unset)" : "Set as home page",
                  title: i(ie)(b) ? "Home page — click to unset" : "Set as home page",
                  onClick: (F) => i(ot)(b)
                }, [
                  g(i(y), {
                    icon: i(ie)(b) ? "tabler:home-filled" : "tabler:home",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ], 10, Un),
                a("button", {
                  class: "ap-icon-btn",
                  "aria-label": "Hide",
                  title: "Hide",
                  onClick: (F) => i(u)(b, !0)
                }, [
                  g(i(y), {
                    icon: "tabler:eye",
                    "aria-hidden": "true"
                  })
                ], 8, An)
              ], 42, En))), 128))
            ], 42, Hn))), 128)),
            i(oe).length ? (v(), k("div", Nn, [
              a("button", {
                class: "ap-hidden-h",
                onClick: o[12] || (o[12] = (d) => E.value = !E.value)
              }, [
                g(i(y), {
                  icon: E.value ? "tabler:chevron-down" : "tabler:chevron-right",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                g(i(y), {
                  icon: "tabler:eye-off",
                  "aria-hidden": "true"
                }),
                L(" Hidden (" + I(i(oe).length) + ") ", 1)
              ]),
              E.value ? (v(), k("div", Pn, [
                (v(!0), k(Z, null, he(i(oe), (d) => (v(), k("div", {
                  key: d.id,
                  class: "ap-row ap-row-off"
                }, [
                  o[40] || (o[40] = a("span", {
                    class: "ap-grip ap-grip-ghost",
                    "aria-hidden": "true"
                  }, null, -1)),
                  a("span", jn, [
                    g(i(y), {
                      icon: d.icon || "tabler:square",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"])
                  ]),
                  a("span", zn, I(d.label), 1),
                  a("button", {
                    class: "ap-icon-btn",
                    "aria-label": "Show",
                    title: "Show",
                    onClick: (b) => i(u)(d, !1)
                  }, [
                    g(i(y), {
                      icon: "tabler:eye-plus",
                      "aria-hidden": "true"
                    })
                  ], 8, Gn)
                ]))), 128))
              ])) : S("", !0)
            ])) : S("", !0)
          ])
        ]))
      ])
    ]));
  }
}), qn = {
  rootComponent: Xn,
  plugins: [bt]
};
export {
  qn as mountConfig
};
//# sourceMappingURL=lazy-mount-DycIx7Up.js.map
