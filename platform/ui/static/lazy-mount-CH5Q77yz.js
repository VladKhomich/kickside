import { s as lt, a as Ee, B as at, b as st, O as ut, Y as dt, C as ct, c as Te, P as pt, I as ft, D as ht, x as we, d as vt, e as mt } from "./wc-runtime-asymqT3f.js";
import { defineComponent as Ge, ref as C, onMounted as Xe, watch as He, onBeforeUnmount as Ke, openBlock as m, createElementBlock as k, resolveComponent as bt, mergeProps as U, createCommentVNode as S, createVNode as g, withCtx as Oe, Transition as gt, createElementVNode as l, computed as O, toDisplayString as I, unref as r, normalizeClass as P, createTextVNode as L, withDirectives as Re, vModelText as Fe, createBlock as fe, Fragment as W, renderList as he, withModifiers as q } from "vue";
import { Icon as y } from "@iconify/vue";
import { loadByTagName as yt, api as Le, host as Ce, on as kt } from "@wippy-fe/proxy";
const _e = /* @__PURE__ */ Ge({
  __name: "IconField",
  props: {
    modelValue: {},
    fallback: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, c = C(null);
    let a = null;
    function b(w) {
      i("update:modelValue", w.detail || "");
    }
    async function h() {
      if (c.value) {
        a && a.removeEventListener("select", b), c.value.innerHTML = "";
        try {
          customElements.get("wc-icon-picker") || await yt("wc-icon-picker", { timeoutMs: 8e3 });
        } catch {
        }
        c.value && (a = document.createElement("wc-icon-picker"), a.setAttribute("value", t.modelValue || ""), t.fallback && a.setAttribute("fallback", t.fallback), a.addEventListener("select", b), c.value.appendChild(a));
      }
    }
    return Xe(h), He(() => t.modelValue, (w) => {
      a && a.getAttribute("value") !== w && a.setAttribute("value", w || "");
    }), Ke(() => {
      a && a.removeEventListener("select", b);
    }), (w, x) => (m(), k("div", {
      ref_key: "host",
      ref: c,
      class: "wc-iconfield"
    }, null, 512));
  }
});
var wt = {
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
        var t, i;
        this.formField = ((t = this.$pcForm) === null || t === void 0 || (i = t.register) === null || i === void 0 ? void 0 : i.call(t, e, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(e) {
        var t, i;
        this.formField = ((t = this.$pcForm) === null || t === void 0 || (i = t.register) === null || i === void 0 ? void 0 : i.call(t, this.$formName, e)) || {};
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
      var i, c;
      this.controlled && (this.d_value = e, this.$emit("update:modelValue", e)), this.$emit("value-change", e), (i = (c = this.formField).onChange) === null || i === void 0 || i.call(c, {
        originalEvent: t,
        value: e
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      return t.find(Ee);
    }
  },
  computed: {
    $filled: function() {
      return Ee(this.d_value);
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
}, Ct = `
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
`, Ht = {
  root: "p-colorpicker p-component",
  preview: function(e) {
    var t = e.props;
    return ["p-colorpicker-preview", {
      "p-disabled": t.disabled
    }];
  },
  panel: function(e) {
    var t = e.instance, i = e.props;
    return ["p-colorpicker-panel", {
      "p-colorpicker-panel-inline": i.inline,
      "p-disabled": i.disabled,
      "p-invalid": t.$invalid
    }];
  },
  colorSelector: "p-colorpicker-color-selector",
  colorBackground: "p-colorpicker-color-background",
  colorHandle: "p-colorpicker-color-handle",
  hue: "p-colorpicker-hue",
  hueHandle: "p-colorpicker-hue-handle"
}, Lt = at.extend({
  name: "colorpicker",
  style: Ct,
  classes: Ht
}), $t = {
  name: "BaseColorPicker",
  extends: wt,
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
  style: Lt,
  provide: function() {
    return {
      $pcColorPicker: this,
      $parentInstance: this
    };
  }
}, Ye = {
  name: "ColorPicker",
  extends: $t,
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
    this.unbindOutsideClickListener(), this.unbindDragListeners(), this.unbindResizeListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.picker && this.autoZIndex && we.clear(this.picker), this.clearRefs();
  },
  mounted: function() {
    this.updateUI();
  },
  methods: {
    pickColor: function(e) {
      var t = this.colorSelector.getBoundingClientRect(), i = t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), c = t.left + document.body.scrollLeft, a = Math.floor(100 * Math.max(0, Math.min(150, (e.pageX || e.changedTouches[0].pageX) - c)) / 150), b = Math.floor(100 * (150 - Math.max(0, Math.min(150, (e.pageY || e.changedTouches[0].pageY) - i))) / 150);
      this.hsbValue = this.validateHSB({
        h: this.localHue,
        s: a,
        b
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
        for (var i = [], c = 0; c < t; c++)
          i.push("0");
        i.push(e), e = i.join("");
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
      }, i = Math.min(e.r, e.g, e.b), c = Math.max(e.r, e.g, e.b), a = c - i;
      return t.b = c, t.s = c !== 0 ? 255 * a / c : 0, t.s !== 0 ? e.r === c ? t.h = (e.g - e.b) / a : e.g === c ? t.h = 2 + (e.b - e.r) / a : t.h = 4 + (e.r - e.g) / a : t.h = -1, t.h *= 60, t.h < 0 && (t.h += 360), t.s *= 100 / 255, t.b *= 100 / 255, t;
    },
    HSBtoRGB: function(e) {
      var t = {
        r: null,
        g: null,
        b: null
      }, i = Math.round(e.h), c = Math.round(e.s * 255 / 100), a = Math.round(e.b * 255 / 100);
      if (c === 0)
        t = {
          r: a,
          g: a,
          b: a
        };
      else {
        var b = a, h = (255 - c) * a / 255, w = (b - h) * (i % 60) / 60;
        i === 360 && (i = 0), i < 60 ? (t.r = b, t.b = h, t.g = h + w) : i < 120 ? (t.g = b, t.b = h, t.r = b - w) : i < 180 ? (t.g = b, t.r = h, t.b = h + w) : i < 240 ? (t.b = b, t.r = h, t.g = b - w) : i < 300 ? (t.b = b, t.g = h, t.r = h + w) : i < 360 ? (t.r = b, t.g = h, t.b = b - w) : (t.r = 0, t.g = 0, t.b = 0);
      }
      return {
        r: Math.round(t.r),
        g: Math.round(t.g),
        b: Math.round(t.b)
      };
    },
    RGBtoHEX: function(e) {
      var t = [e.r.toString(16), e.g.toString(16), e.b.toString(16)];
      for (var i in t)
        t[i].length === 1 && (t[i] = "0" + t[i]);
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
      this.updateUI(), this.alignOverlay(), this.bindOutsideClickListener(), this.bindScrollListener(), this.bindResizeListener(), this.autoZIndex && we.set("overlay", e, this.baseZIndex || this.$primevue.config.zIndex.overlay), this.$attrSelector && e.setAttribute(this.$attrSelector, ""), this.$emit("show");
    },
    onOverlayLeave: function() {
      this.unbindOutsideClickListener(), this.unbindScrollListener(), this.unbindResizeListener(), this.clearRefs(), this.$emit("hide");
    },
    onOverlayAfterLeave: function(e) {
      this.autoZIndex && we.clear(e);
    },
    alignOverlay: function() {
      this.appendTo === "self" ? ft(this.picker, this.$refs.input) : ht(this.picker, this.$refs.input);
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
      var t, i;
      (t = (i = this.formField).onBlur) === null || t === void 0 || t.call(i);
    },
    onColorMousedown: function(e) {
      this.disabled || (this.bindDragListeners(), this.onColorDragStart(e));
    },
    onColorDragStart: function(e) {
      this.disabled || (this.colorDragging = !0, this.pickColor(e), this.$el.setAttribute("p-colorpicker-dragging", "true"), !this.isUnstyled && Te(this.$el, "p-colorpicker-dragging"), e.preventDefault());
    },
    onDrag: function(e) {
      this.colorDragging && (this.pickColor(e), e.preventDefault()), this.hueDragging && (this.pickHue(e), e.preventDefault());
    },
    onDragEnd: function() {
      this.colorDragging = !1, this.hueDragging = !1, this.$el.setAttribute("p-colorpicker-dragging", "false"), !this.isUnstyled && pt(this.$el, "p-colorpicker-dragging"), this.unbindDragListeners();
    },
    onHueMousedown: function(e) {
      this.disabled || (this.bindDragListeners(), this.onHueDragStart(e));
    },
    onHueDragStart: function(e) {
      this.disabled || (this.hueDragging = !0, this.pickHue(e), !this.isUnstyled && Te(this.$el, "p-colorpicker-dragging"), e.preventDefault());
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
      this.scrollHandler || (this.scrollHandler = new ct(this.$refs.container, function() {
        e.overlayVisible && (e.overlayVisible = !1);
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var e = this;
      this.resizeListener || (this.resizeListener = function() {
        e.overlayVisible && !dt() && (e.overlayVisible = !1);
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
      ut.emit("overlay-click", {
        originalEvent: e,
        target: this.$el
      });
    }
  },
  components: {
    Portal: st
  }
};
function ae(n) {
  "@babel/helpers - typeof";
  return ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ae(n);
}
function Ue(n, e) {
  var t = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(n);
    e && (i = i.filter(function(c) {
      return Object.getOwnPropertyDescriptor(n, c).enumerable;
    })), t.push.apply(t, i);
  }
  return t;
}
function Ae(n) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ue(Object(t), !0).forEach(function(i) {
      St(n, i, t[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t)) : Ue(Object(t)).forEach(function(i) {
      Object.defineProperty(n, i, Object.getOwnPropertyDescriptor(t, i));
    });
  }
  return n;
}
function St(n, e, t) {
  return (e = Dt(e)) in n ? Object.defineProperty(n, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : n[e] = t, n;
}
function Dt(n) {
  var e = Mt(n, "string");
  return ae(e) == "symbol" ? e : e + "";
}
function Mt(n, e) {
  if (ae(n) != "object" || !n) return n;
  var t = n[Symbol.toPrimitive];
  if (t !== void 0) {
    var i = t.call(n, e);
    if (ae(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(n);
}
var Vt = ["id", "tabindex", "disabled"];
function xt(n, e, t, i, c, a) {
  var b = bt("Portal");
  return m(), k("div", U({
    ref: "container",
    class: n.cx("root")
  }, n.ptmi("root")), [n.inline ? S("", !0) : (m(), k("input", U({
    key: 0,
    ref: "input",
    id: n.inputId,
    type: "text",
    class: n.cx("preview"),
    readonly: "",
    tabindex: n.tabindex,
    disabled: n.disabled,
    onClick: e[0] || (e[0] = function() {
      return a.onInputClick && a.onInputClick.apply(a, arguments);
    }),
    onKeydown: e[1] || (e[1] = function() {
      return a.onInputKeydown && a.onInputKeydown.apply(a, arguments);
    }),
    onBlur: e[2] || (e[2] = function() {
      return a.onInputBlur && a.onInputBlur.apply(a, arguments);
    })
  }, n.ptm("preview")), null, 16, Vt)), g(b, {
    appendTo: n.appendTo,
    disabled: n.inline
  }, {
    default: Oe(function() {
      return [g(gt, U({
        name: "p-anchored-overlay",
        onEnter: a.onOverlayEnter,
        onLeave: a.onOverlayLeave,
        onAfterLeave: a.onOverlayAfterLeave
      }, n.ptm("transition")), {
        default: Oe(function() {
          return [n.inline || c.overlayVisible ? (m(), k("div", U({
            key: 0,
            ref: a.pickerRef,
            class: [n.cx("panel"), n.panelClass, n.overlayClass],
            onClick: e[11] || (e[11] = function() {
              return a.onOverlayClick && a.onOverlayClick.apply(a, arguments);
            })
          }, Ae(Ae({}, n.ptm("panel")), n.ptm("overlay"))), [l("div", U({
            class: n.cx("content")
          }, n.ptm("content")), [l("div", U({
            ref: a.colorSelectorRef,
            class: n.cx("colorSelector"),
            onMousedown: e[3] || (e[3] = function(h) {
              return a.onColorMousedown(h);
            }),
            onTouchstart: e[4] || (e[4] = function(h) {
              return a.onColorDragStart(h);
            }),
            onTouchmove: e[5] || (e[5] = function(h) {
              return a.onDrag(h);
            }),
            onTouchend: e[6] || (e[6] = function(h) {
              return a.onDragEnd();
            })
          }, n.ptm("colorSelector")), [l("div", U({
            class: n.cx("colorBackground")
          }, n.ptm("colorBackground")), [l("div", U({
            ref: a.colorHandleRef,
            class: n.cx("colorHandle")
          }, n.ptm("colorHandle")), null, 16)], 16)], 16), l("div", U({
            ref: a.hueViewRef,
            class: n.cx("hue"),
            onMousedown: e[7] || (e[7] = function(h) {
              return a.onHueMousedown(h);
            }),
            onTouchstart: e[8] || (e[8] = function(h) {
              return a.onHueDragStart(h);
            }),
            onTouchmove: e[9] || (e[9] = function(h) {
              return a.onDrag(h);
            }),
            onTouchend: e[10] || (e[10] = function(h) {
              return a.onDragEnd();
            })
          }, n.ptm("hue")), [l("div", U({
            ref: a.hueHandleRef,
            class: n.cx("hueHandle")
          }, n.ptm("hueHandle")), null, 16)], 16)], 16)], 16)) : S("", !0)];
        }),
        _: 1
      }, 16, ["onEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 1
  }, 8, ["appendTo", "disabled"])], 16);
}
Ye.render = xt;
const Ne = "#d63a22", Se = "--p-primary";
function Bt(n) {
  const e = /^rgba?\(([^)]+)\)/i.exec((n || "").trim());
  if (!e) return null;
  const t = e[1].split(",").map((c) => parseFloat(c.trim()));
  if (t.length < 3 || t.slice(0, 3).some((c) => Number.isNaN(c))) return null;
  const i = (c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
  return `#${i(t[0])}${i(t[1])}${i(t[2])}`;
}
function De(n) {
  let e = (n || "").trim().replace(/^#/, "");
  return e.length === 3 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), /^[0-9a-fA-F]{6}$/.test(e) ? `#${e.toLowerCase()}` : null;
}
function Pe(n) {
  const e = De(n);
  if (!e) return null;
  const t = e.slice(1);
  return {
    r: parseInt(t.slice(0, 2), 16),
    g: parseInt(t.slice(2, 4), 16),
    b: parseInt(t.slice(4, 6), 16)
  };
}
function $e(n, e) {
  const t = De(n);
  if (!t) return "";
  const i = `${Se}: ${t};`;
  return e === ":host" ? `:host { ${i} }` : [
    `:root { ${i} }`,
    `@media (prefers-color-scheme: dark) { :root:not(.w-theme-light) { ${i} } }`,
    `:root.w-theme-dark, .w-theme-dark { ${i} }`,
    `@media (prefers-color-scheme: light) { :root:not(.w-theme-dark) { ${i} } }`,
    `:root.w-theme-light, .w-theme-light { ${i} }`
  ].join(`
`);
}
function It(n, e) {
  if (!n || typeof n != "object") return "";
  const t = n[Se];
  return typeof t == "string" ? $e(t, e) : "";
}
const Et = { r: 255, g: 255, b: 255 }, Tt = { r: 12, g: 14, b: 18 }, Ot = 2, Rt = 2;
function je(n) {
  const e = (t) => {
    const i = t / 255;
    return i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * e(n.r) + 0.7152 * e(n.g) + 0.0722 * e(n.b);
}
function ze(n, e) {
  const t = je(n), i = je(e);
  return (Math.max(t, i) + 0.05) / (Math.min(t, i) + 0.05);
}
function Ft(n, e = typeof document < "u" ? document : void 0) {
  const t = De(n);
  if (!t) return null;
  if (!e || !e.body || !e.defaultView) return Pe(t);
  const i = e.createElement("span");
  i.style.setProperty(Se, t), i.style.color = "var(--p-primary-color)", i.style.display = "none", e.body.appendChild(i);
  const c = e.defaultView.getComputedStyle(i).color;
  return i.remove(), Pe(Bt(c) || t);
}
function _t(n) {
  const e = Ft(n);
  if (!e) return null;
  const t = ze(e, Et), i = ze(e, Tt), c = t >= Ot, a = i >= Rt;
  let b = "";
  return !c && !a ? b = "This tone is too low-contrast - buttons and accents would be unreadable in both light and dark mode." : c ? a || (b = "This tone is too dark - accents would be invisible against the dark background.") : b = "This tone is too light - white button text and accents would be unreadable in light mode.", { ok: c && a, onLight: t, onDark: i, reason: b };
}
function Ut({ items: n, categories: e, overrides: t, home: i }) {
  const c = (s) => s.route_name || s.id;
  function a(s, u) {
    const f = c(s), $ = { ...t.value[f] || {} };
    for (const [B, V] of Object.entries(u))
      V === void 0 || V === "" ? delete $[B] : $[B] = V;
    t.value = { ...t.value, [f]: $ };
  }
  function b(s, u) {
    a(s, { hidden: u || void 0 }), s.hidden = u;
  }
  function h(s, u) {
    a(s, { category: u }), s.category = u;
  }
  function w(s, u) {
    a(s, { order: u }), s.order = u;
  }
  function x(s, u) {
    const f = u.replace(/^\s+/, "");
    s.label = f, a(s, { label: f || void 0 });
  }
  function E(s, u) {
    const f = (u || "").trim();
    s.icon = f, a(s, { icon: f || void 0 });
  }
  function G(s) {
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
  }), me = O(() => n.value.filter((s) => s.hidden)), J = (s) => e.value.find((u) => u.key === s), M = C(null), X = C(null), Q = C(null), H = (s) => n.value.find((u) => u.id === s);
  function ee(s, u) {
    M.value = s.id, u.dataTransfer && (u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", s.id));
  }
  function T() {
    M.value = null, X.value = null, Q.value = null;
  }
  function be(s) {
    const u = M.value ? H(M.value) : null;
    if (!u || u.id === s.id) return T();
    const f = s.category || "", $ = R(f).filter((V) => V.id !== u.id), B = $.indexOf(s);
    $.splice(B < 0 ? $.length : B, 0, u), h(u, f), $.forEach((V, A) => w(V, A * 10)), T();
  }
  function ge(s) {
    const u = M.value ? H(M.value) : null;
    if (!u) return T();
    const f = R(s).filter(($) => $.id !== u.id);
    f.push(u), h(u, s), f.forEach(($, B) => w($, B * 10)), T();
  }
  function j(s, u) {
    X.value = s, u.dataTransfer && (u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", "cat:" + s));
  }
  function te(s) {
    const u = X.value;
    if (!u || u === s) return T();
    const f = [...D.value], $ = f.findIndex((A) => A.key === u), B = f.findIndex((A) => A.key === s);
    if ($ < 0 || B < 0) return T();
    const [V] = f.splice($, 1);
    f.splice(B, 0, V), f.forEach((A, ie) => {
      const re = e.value.find((ye) => ye.key === A.key);
      re && (re.order = ie * 10);
    }), T();
  }
  let K = 0;
  function se() {
    K += 1;
    const s = D.value[D.value.length - 1];
    e.value.push({ key: "cat_" + Date.now().toString(36) + "_" + K, label: "New category", icon: "tabler:folder", order: (s?.order ?? 0) + 10 });
  }
  function Y(s) {
    for (const u of n.value) u.category === s && h(u, "");
    e.value = e.value.filter((u) => u.key !== s);
  }
  function ne(s, u) {
    const f = J(s);
    f && (f.label = u);
  }
  function oe(s, u) {
    const f = J(s);
    f && (f.icon = (u || "").trim() || void 0);
  }
  function z(s) {
    return !!i.value && i.value === s.path;
  }
  function ue(s) {
    i.value = z(s) ? "" : s.path;
  }
  return {
    itemKey: c,
    patchOverride: a,
    setHidden: b,
    setCategory: h,
    setOrder: w,
    setLabel: x,
    setIcon: E,
    hasOverride: G,
    orderedCats: D,
    itemsOf: R,
    editorGroups: ve,
    hiddenItems: me,
    catByKey: J,
    dragItemId: M,
    dragCatKey: X,
    overGroup: Q,
    onItemDragStart: ee,
    endDrag: T,
    onItemDrop: be,
    onGroupDrop: ge,
    onCatDragStart: j,
    onCatDrop: te,
    addCategory: se,
    removeCategory: Y,
    renameCategory: ne,
    setCatIcon: oe,
    isHome: z,
    setHome: ue
  };
}
function At({ logoUrl: n, error: e, apiError: t }) {
  const i = C(!1);
  async function c(b) {
    const h = b.target, w = h.files && h.files[0];
    if (w) {
      if (!w.type.startsWith("image/")) {
        e.value = "Logo must be an image", h.value = "";
        return;
      }
      if (w.size > 2 * 1024 * 1024) {
        e.value = "Logo too large (max 2 MB)", h.value = "";
        return;
      }
      i.value = !0, e.value = "";
      try {
        const x = new FormData();
        x.append("logo", w);
        const { data: E } = await Le.post("/api/v1/nav/logo", x, { headers: { "Content-Type": "multipart/form-data" } });
        if (!E.success || !E.url) throw new Error(E.error || "upload failed");
        n.value = E.url;
      } catch (x) {
        e.value = t(x, "upload failed");
      } finally {
        i.value = !1, h.value = "";
      }
    }
  }
  function a() {
    n.value = "";
  }
  return { uploadingLogo: i, uploadLogo: c, removeLogo: a };
}
const Nt = { class: "ap" }, Pt = { class: "ap-body" }, jt = { class: "ap-bar" }, zt = {
  key: 0,
  class: "ap-dirty ap-dirty-warn"
}, Gt = {
  key: 1,
  class: "ap-dirty"
}, Xt = ["disabled"], Kt = ["disabled"], Yt = {
  key: 0,
  class: "ap-msg ap-err"
}, Zt = {
  key: 1,
  class: "ap-loading"
}, Wt = {
  key: 2,
  class: "ap-grid"
}, qt = { class: "ap-side" }, Jt = { class: "ap-card" }, Qt = { class: "ap-h" }, en = { class: "ap-logo" }, tn = { class: "ap-logo-prev" }, nn = ["src"], on = { class: "ap-logo-actions" }, rn = ["accept", "disabled"], ln = { class: "ap-hint" }, an = { class: "ap-tone" }, sn = ["placeholder"], un = {
  key: 0,
  class: "ap-tone-warn",
  role: "alert"
}, dn = {
  class: "ap-theme-modes",
  role: "group",
  "aria-label": "Color scheme"
}, cn = ["aria-pressed", "onClick"], pn = { class: "ap-card" }, fn = { class: "ap-h" }, hn = { class: "ap-layouts" }, vn = { class: "ap-lo-name" }, mn = { class: "ap-lo-name" }, bn = { class: "ap-card ap-legend" }, gn = { class: "ap-h" }, yn = { class: "ap-tips" }, kn = { class: "ap-card ap-structure" }, wn = { class: "ap-h" }, Cn = ["onDragover", "onDragleave", "onDrop"], Hn = ["onDrop"], Ln = ["onDragstart"], $n = {
  key: 1,
  class: "ap-grip ap-grip-ghost",
  "aria-hidden": "true"
}, Sn = ["value", "onInput"], Dn = { class: "ap-tile ap-tile-muted" }, Mn = { class: "ap-field ap-field-strong ap-field-static" }, Vn = { class: "ap-count" }, xn = ["onClick"], Bn = {
  key: 0,
  class: "ap-drop-hint"
}, In = ["onDrop"], En = ["onDragstart"], Tn = ["value", "onInput"], On = { class: "ap-path" }, Rn = {
  key: 0,
  class: "ap-pill kx-tag-sm"
}, Fn = {
  key: 1,
  class: "ap-pill kx-tag-sm ap-pill-home"
}, _n = ["aria-label", "title", "onClick"], Un = ["onClick"], An = {
  key: 0,
  class: "ap-hidden"
}, Nn = {
  key: 0,
  class: "ap-hidden-list"
}, Pn = { class: "ap-tile" }, jn = { class: "ap-field ap-field-strong ap-field-static" }, zn = ["onClick"], Gn = /* @__PURE__ */ Ge({
  __name: "appearance",
  setup(n) {
    const e = C(!0), t = C(!1), i = C("");
    function c(p, o) {
      return p?.response?.data?.error || p?.message || o;
    }
    const a = C("vertical"), b = C(Ce.getThemeMode?.() ?? "auto"), h = C([]), w = C([]), x = C({}), E = C(!1), G = C(""), D = C(""), R = C(), ve = O(() => R.value?.formats.flatMap((p) => [p.mime, ...p.extensions.map((o) => `.${o}`)]).join(",")), me = O(() => R.value ? `${R.value.formats.map((p) => p.label).join(", ")} · up to ${R.value.max_bytes / 1048576} MB.` : ""), J = At({ logoUrl: D, error: i, apiError: c }), { uploadingLogo: M, uploadLogo: X, removeLogo: Q } = J, H = C(""), ee = C(Ne), T = O({
      // PrimeVue's <ColorPicker format="hex"> exchanges a BARE rrggbb string, while the stored
      // setting and the hex text field both keep the #-prefixed form — so strip on the way in
      // and re-add on the way out. Falling back to defaultTone keeps the swatch showing the live
      // theme tone while the setting is unset.
      get: () => (H.value || ee.value).trim().replace(/^#/, ""),
      set: (p) => {
        const o = String(p ?? "").replace(/^#/, "");
        H.value = o ? `#${o}` : "";
      }
    });
    function be() {
      H.value = "";
    }
    function ge(p) {
      b.value = p, Ce.setThemeMode(p);
    }
    const j = O(() => H.value.trim() ? _t(H.value) : null), te = O(() => !!H.value.trim() && j.value === null), K = O(() => te.value || !!j.value && !j.value.ok), se = O(() => te.value ? "Enter a valid hex color, e.g. #2563eb." : j.value && !j.value.ok ? j.value.reason : ""), Y = C(""), ne = C(""), oe = () => JSON.stringify({
      layout: a.value,
      cats: w.value,
      overrides: x.value,
      title: G.value,
      logo: D.value,
      home: Y.value,
      tone: H.value,
      pos: h.value.map((p) => [p.id, p.category, p.order, !!p.hidden])
    }), z = O(() => oe() !== ne.value);
    async function ue() {
      e.value = !0, i.value = "";
      try {
        const { data: p } = await Le.get("/api/v1/nav/list?manage=1");
        if (!p.success) throw new Error(p.error || "failed to load nav");
        R.value = p.logo_upload, h.value = (p.items ?? []).map((v) => ({ ...v })), a.value = p.layout === "horizontal" ? "horizontal" : "vertical";
        const o = p.config ?? {};
        w.value = Array.isArray(o.categories) ? o.categories.map((v) => ({ ...v })) : [], x.value = o.overrides && typeof o.overrides == "object" ? structuredClone(o.overrides) : {}, G.value = typeof o.title == "string" ? o.title : "", D.value = typeof o.logo_url == "string" ? o.logo_url : "";
        const d = typeof o.primary_color == "string" ? o.primary_color : "";
        F = d, H.value = d, Y.value = typeof p.home == "string" ? p.home : typeof o.home == "string" ? o.home : "", ne.value = oe();
      } catch (p) {
        i.value = c(p, "failed to load");
      } finally {
        e.value = !1;
      }
    }
    const s = Ut({ items: h, categories: w, overrides: x, home: Y }), {
      setHidden: u,
      setLabel: f,
      setIcon: $,
      hasOverride: B,
      itemsOf: V,
      editorGroups: A,
      hiddenItems: ie,
      catByKey: re,
      dragItemId: ye,
      overGroup: de,
      onItemDragStart: Ze,
      endDrag: ce,
      onItemDrop: We,
      onGroupDrop: Me,
      onCatDragStart: qe,
      onCatDrop: Je,
      addCategory: Ve,
      removeCategory: Qe,
      renameCategory: et,
      setCatIcon: tt,
      isHome: le,
      setHome: nt
    } = s;
    let N = null, ke = !1, F = null, xe = null;
    async function ot() {
      try {
        const p = await fetch("/app/css-variables.facade.json", { cache: "no-store" });
        if (!p.ok) return;
        const o = await p.json();
        if (o && typeof o == "object") {
          xe = o;
          const d = o["--p-primary"];
          typeof d == "string" && (ee.value = d), F !== null && !ke && !H.value.trim() && pe.value !== !1 && Z("");
        }
      } catch {
      }
    }
    function Be(p, o) {
      return $e(p, o) || It(xe, o) || $e(Ne, o);
    }
    function Z(p) {
      window.dispatchEvent(new CustomEvent("kickside:tone-apply", {
        detail: { hostCss: Be(p, ":root"), shadowCss: Be(p, ":host") }
      }));
    }
    Ke(() => {
      ke = !0, N && clearTimeout(N), F !== null && Z(F), Ie?.();
    });
    async function it() {
      if (K.value) return;
      const p = oe(), o = H.value;
      t.value = !0, i.value = "";
      try {
        const { data: d } = await Le.put("/api/v1/nav/config", {
          layout: a.value,
          overrides: x.value,
          categories: w.value,
          title: G.value,
          logo_url: D.value,
          home: Y.value,
          primary_color: H.value
        });
        if (!d.success) throw new Error(d.error || "save failed");
        ne.value = p, F = o, Z(ke || pe.value === !1 ? F : H.value);
      } catch (d) {
        i.value = c(d, "save failed");
      } finally {
        t.value = !1;
      }
    }
    let Ie = null;
    Xe(() => {
      b.value = Ce.getThemeMode?.() ?? "auto", Ie = kt("@theme", (p) => {
        b.value = p;
      }), ot();
    });
    async function rt() {
      F !== null && z.value || await ue();
    }
    const pe = vt(rt);
    return He(H, (p) => {
      N && clearTimeout(N), N = null, !(F === null || pe.value === !1) && (N = setTimeout(() => Z(p), 90));
    }), He(pe, (p, o) => {
      F !== null && (o === !0 && p === !1 ? (N && clearTimeout(N), N = null, Z(F)) : o === !1 && p === !0 && z.value && Z(H.value));
    }), (p, o) => (m(), k("div", Nt, [
      l("div", Pt, [
        l("header", jt, [
          K.value ? (m(), k("span", zt, I(te.value ? "Invalid color" : "Tone unreadable"), 1)) : z.value ? (m(), k("span", Gt, "Unsaved changes")) : S("", !0),
          l("button", {
            class: "ap-btn ap-btn-ghost",
            disabled: !z.value || t.value,
            onClick: ue
          }, "Discard", 8, Xt),
          l("button", {
            class: "ap-btn ap-btn-primary",
            disabled: !z.value || t.value || K.value,
            onClick: it
          }, [
            g(r(y), {
              icon: t.value ? "tabler:loader-2" : "tabler:device-floppy",
              class: P(t.value && "spin"),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            L(" " + I(t.value ? "Saving…" : "Save"), 1)
          ], 8, Kt)
        ]),
        i.value ? (m(), k("div", Yt, I(i.value), 1)) : S("", !0),
        e.value ? (m(), k("div", Zt, [
          g(r(y), {
            icon: "tabler:loader-2",
            class: "spin"
          }),
          o[13] || (o[13] = L(" Loading…", -1))
        ])) : (m(), k("div", Wt, [
          l("aside", qt, [
            l("section", Jt, [
              l("header", Qt, [
                g(r(y), {
                  icon: "tabler:photo",
                  "aria-hidden": "true"
                }),
                o[14] || (o[14] = L(" Branding", -1))
              ]),
              o[17] || (o[17] = l("p", { class: "ap-sub" }, "Title and logo apply to everyone on this installation — header, login page, and browser tab.", -1)),
              o[18] || (o[18] = l("label", { class: "ap-blabel" }, "Title", -1)),
              Re(l("input", {
                "onUpdate:modelValue": o[0] || (o[0] = (d) => G.value = d),
                class: "ap-binput",
                type: "text",
                maxlength: "60",
                placeholder: "KickSide"
              }, null, 512), [
                [Fe, G.value]
              ]),
              o[19] || (o[19] = l("label", { class: "ap-blabel" }, "Logo", -1)),
              l("div", en, [
                l("span", tn, [
                  D.value ? (m(), k("img", {
                    key: 0,
                    src: D.value,
                    alt: "Logo preview"
                  }, null, 8, nn)) : (m(), fe(r(y), {
                    key: 1,
                    icon: "tabler:photo",
                    "aria-hidden": "true"
                  }))
                ]),
                l("div", on, [
                  l("label", {
                    class: P(["ap-btn ap-btn-ghost", r(M) && "ap-btn-busy"])
                  }, [
                    g(r(y), {
                      icon: r(M) ? "tabler:loader-2" : "tabler:upload",
                      class: P(r(M) && "spin"),
                      "aria-hidden": "true"
                    }, null, 8, ["icon", "class"]),
                    L(" " + I(r(M) ? "Uploading…" : "Upload") + " ", 1),
                    l("input", {
                      type: "file",
                      accept: ve.value,
                      class: "ap-file",
                      disabled: r(M) || !R.value,
                      onChange: o[1] || (o[1] = //@ts-ignore
                      (...d) => r(X) && r(X)(...d))
                    }, null, 40, rn)
                  ], 2),
                  D.value ? (m(), k("button", {
                    key: 0,
                    class: "ap-btn ap-btn-ghost ap-danger",
                    onClick: o[2] || (o[2] = //@ts-ignore
                    (...d) => r(Q) && r(Q)(...d))
                  }, [
                    g(r(y), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    }),
                    o[15] || (o[15] = L(" Remove ", -1))
                  ])) : S("", !0)
                ])
              ]),
              l("p", ln, I(me.value), 1),
              o[20] || (o[20] = l("label", { class: "ap-blabel" }, "Base tone", -1)),
              l("div", an, [
                g(r(Ye), {
                  modelValue: T.value,
                  "onUpdate:modelValue": o[3] || (o[3] = (d) => T.value = d),
                  format: "hex",
                  class: "ap-tone-swatch",
                  pt: { preview: { class: "ap-tone-preview", "aria-label": "Base tone color", "data-testid": "appearance-base-tone-picker" } }
                }, null, 8, ["modelValue"]),
                Re(l("input", {
                  "onUpdate:modelValue": o[4] || (o[4] = (d) => H.value = d),
                  class: "ap-binput ap-tone-hex",
                  type: "text",
                  maxlength: "7",
                  placeholder: ee.value,
                  "aria-label": "Base tone hex"
                }, null, 8, sn), [
                  [Fe, H.value]
                ]),
                H.value ? (m(), k("button", {
                  key: 0,
                  class: "ap-btn ap-btn-ghost",
                  onClick: be
                }, [
                  g(r(y), {
                    icon: "tabler:rotate",
                    "aria-hidden": "true"
                  }),
                  o[16] || (o[16] = L(" Reset", -1))
                ])) : S("", !0)
              ]),
              se.value ? (m(), k("p", un, [
                g(r(y), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                L(" " + I(se.value), 1)
              ])) : S("", !0),
              o[21] || (o[21] = l("p", { class: "ap-hint" }, "Primary color for buttons, links and accents. Applies across the app instantly.", -1)),
              o[22] || (o[22] = l("label", { class: "ap-blabel" }, "Color scheme", -1)),
              l("div", dn, [
                (m(), k(W, null, he([
                  { mode: "auto", label: "Auto", icon: "tabler:device-desktop" },
                  { mode: "light", label: "Light", icon: "tabler:sun" },
                  { mode: "dark", label: "Dark", icon: "tabler:moon" }
                ], (d) => l("button", {
                  key: d.mode,
                  type: "button",
                  class: P(["ap-theme-mode", b.value === d.mode && "ap-theme-mode-on"]),
                  "aria-pressed": b.value === d.mode,
                  onClick: (v) => ge(d.mode)
                }, [
                  g(r(y), {
                    icon: d.icon,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  L(" " + I(d.label), 1)
                ], 10, cn)), 64))
              ]),
              o[23] || (o[23] = l("p", { class: "ap-hint" }, "Auto follows your browser or operating system setting. Changes apply immediately.", -1))
            ]),
            l("section", pn, [
              l("header", fn, [
                g(r(y), {
                  icon: "tabler:layout-2",
                  "aria-hidden": "true"
                }),
                o[24] || (o[24] = L(" Layout", -1))
              ]),
              o[31] || (o[31] = l("p", { class: "ap-sub" }, "Where navigation sits.", -1)),
              l("div", hn, [
                l("button", {
                  class: P(["ap-lo", a.value === "vertical" && "ap-lo-on"]),
                  onClick: o[5] || (o[5] = (d) => a.value = "vertical")
                }, [
                  o[26] || (o[26] = l("span", { class: "mock mock-v" }, [
                    l("span", { class: "mock-rail" }, [
                      l("i"),
                      l("i"),
                      l("i")
                    ]),
                    l("span", { class: "mock-fill" })
                  ], -1)),
                  l("span", vn, [
                    o[25] || (o[25] = L("Vertical ", -1)),
                    a.value === "vertical" ? (m(), fe(r(y), {
                      key: 0,
                      icon: "tabler:circle-check-filled",
                      "aria-hidden": "true"
                    })) : S("", !0)
                  ]),
                  o[27] || (o[27] = l("span", { class: "ap-lo-desc" }, "Sidebar rail", -1))
                ], 2),
                l("button", {
                  class: P(["ap-lo", a.value === "horizontal" && "ap-lo-on"]),
                  onClick: o[6] || (o[6] = (d) => a.value = "horizontal")
                }, [
                  o[29] || (o[29] = l("span", { class: "mock mock-h" }, [
                    l("span", { class: "mock-top" }, [
                      l("i"),
                      l("i"),
                      l("i")
                    ]),
                    l("span", { class: "mock-fill" })
                  ], -1)),
                  l("span", mn, [
                    o[28] || (o[28] = L("Horizontal ", -1)),
                    a.value === "horizontal" ? (m(), fe(r(y), {
                      key: 0,
                      icon: "tabler:circle-check-filled",
                      "aria-hidden": "true"
                    })) : S("", !0)
                  ]),
                  o[30] || (o[30] = l("span", { class: "ap-lo-desc" }, "Top bar", -1))
                ], 2)
              ])
            ]),
            l("section", bn, [
              l("header", gn, [
                g(r(y), {
                  icon: "tabler:info-circle",
                  "aria-hidden": "true"
                }),
                o[32] || (o[32] = L(" How it works", -1))
              ]),
              l("ul", yn, [
                l("li", null, [
                  g(r(y), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  }),
                  o[33] || (o[33] = L(" Drag to reorder or move between categories.", -1))
                ]),
                l("li", null, [
                  g(r(y), {
                    icon: "tabler:cursor-text",
                    "aria-hidden": "true"
                  }),
                  o[34] || (o[34] = L(" Click a label to rename it.", -1))
                ]),
                l("li", null, [
                  g(r(y), {
                    icon: "tabler:mood-smile",
                    "aria-hidden": "true"
                  }),
                  o[35] || (o[35] = L(" Click an icon to pick a new Tabler glyph.", -1))
                ]),
                l("li", null, [
                  g(r(y), {
                    icon: "tabler:eye-off",
                    "aria-hidden": "true"
                  }),
                  o[36] || (o[36] = L(" Hide a surface without removing its module.", -1))
                ])
              ])
            ])
          ]),
          l("section", kn, [
            l("header", wn, [
              g(r(y), {
                icon: "tabler:sitemap",
                "aria-hidden": "true"
              }),
              o[38] || (o[38] = L(" Structure ", -1)),
              l("button", {
                class: "ap-btn ap-btn-ghost ap-add",
                onClick: o[7] || (o[7] = //@ts-ignore
                (...d) => r(Ve) && r(Ve)(...d))
              }, [
                g(r(y), {
                  icon: "tabler:folder-plus",
                  "aria-hidden": "true"
                }),
                o[37] || (o[37] = L(" Add category", -1))
              ])
            ]),
            (m(!0), k(W, null, he(r(A), (d) => (m(), k("div", {
              key: d.key || "_root",
              class: P(["ap-group", r(de) === d.key && "ap-group-over"]),
              onDragover: q((v) => de.value = d.key, ["prevent"]),
              onDragleave: (v) => r(de) === d.key && (de.value = null),
              onDrop: q((v) => r(Me)(d.key), ["prevent"])
            }, [
              l("div", {
                class: "ap-group-head",
                onDragover: o[9] || (o[9] = q(() => {
                }, ["prevent"])),
                onDrop: q((v) => d.real ? r(Je)(d.key) : r(Me)(d.key), ["prevent", "stop"])
              }, [
                d.real ? (m(), k("span", {
                  key: 0,
                  class: "ap-grip ap-grip-cat",
                  draggable: "true",
                  title: "Drag to reorder category",
                  onDragstart: (v) => r(qe)(d.key, v),
                  onDragend: o[8] || (o[8] = //@ts-ignore
                  (...v) => r(ce) && r(ce)(...v))
                }, [
                  g(r(y), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ], 40, Ln)) : (m(), k("span", $n)),
                d.real ? (m(), k(W, { key: 2 }, [
                  g(_e, {
                    "model-value": r(re)(d.key)?.icon || "",
                    fallback: "tabler:folder",
                    "onUpdate:modelValue": (v) => r(tt)(d.key, v)
                  }, null, 8, ["model-value", "onUpdate:modelValue"]),
                  l("input", {
                    value: r(re)(d.key)?.label,
                    class: "ap-field ap-field-strong",
                    "aria-label": "Category name",
                    placeholder: "Category name",
                    onInput: (v) => r(et)(d.key, v.target.value)
                  }, null, 40, Sn)
                ], 64)) : (m(), k(W, { key: 3 }, [
                  l("span", Dn, [
                    g(r(y), {
                      icon: "tabler:layout-list",
                      "aria-hidden": "true"
                    })
                  ]),
                  l("span", Mn, I(d.label), 1)
                ], 64)),
                l("span", Vn, I(r(V)(d.key).length), 1),
                d.real ? (m(), k("button", {
                  key: 4,
                  class: "ap-icon-btn ap-danger",
                  "aria-label": "Remove category",
                  title: "Remove category",
                  onClick: (v) => r(Qe)(d.key)
                }, [
                  g(r(y), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ], 8, xn)) : S("", !0)
              ], 40, Hn),
              r(V)(d.key).length === 0 ? (m(), k("div", Bn, "Drag a surface here")) : S("", !0),
              (m(!0), k(W, null, he(r(V)(d.key), (v) => (m(), k("div", {
                key: v.id,
                class: P(["ap-row", r(ye) === v.id && "ap-row-dragging"]),
                onDragover: o[11] || (o[11] = q(() => {
                }, ["prevent", "stop"])),
                onDrop: q((_) => r(We)(v), ["prevent", "stop"])
              }, [
                l("span", {
                  class: "ap-grip",
                  draggable: "true",
                  title: "Drag to reorder or move",
                  onDragstart: (_) => r(Ze)(v, _),
                  onDragend: o[10] || (o[10] = //@ts-ignore
                  (..._) => r(ce) && r(ce)(..._))
                }, [
                  g(r(y), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ], 40, En),
                g(_e, {
                  "model-value": v.icon || "",
                  fallback: "tabler:square",
                  "onUpdate:modelValue": (_) => r($)(v, _)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                l("input", {
                  value: v.label,
                  class: "ap-field ap-field-strong",
                  "aria-label": "Surface label",
                  placeholder: "Label",
                  onInput: (_) => r(f)(v, _.target.value)
                }, null, 40, Tn),
                l("span", On, I(v.path), 1),
                v.source === "custom" ? (m(), k("span", Rn, "custom")) : S("", !0),
                r(le)(v) ? (m(), k("span", Fn, [
                  g(r(y), {
                    icon: "tabler:home",
                    "aria-hidden": "true"
                  }),
                  o[39] || (o[39] = L(" home", -1))
                ])) : S("", !0),
                r(B)(v) ? (m(), fe(r(y), {
                  key: 2,
                  icon: "tabler:pencil",
                  class: "ap-edited",
                  title: "Customized — reset the field to revert",
                  "aria-hidden": "true"
                })) : S("", !0),
                l("button", {
                  class: P(["ap-icon-btn", r(le)(v) && "ap-home-on"]),
                  "aria-label": r(le)(v) ? "Home page (click to unset)" : "Set as home page",
                  title: r(le)(v) ? "Home page — click to unset" : "Set as home page",
                  onClick: (_) => r(nt)(v)
                }, [
                  g(r(y), {
                    icon: r(le)(v) ? "tabler:home-filled" : "tabler:home",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ], 10, _n),
                l("button", {
                  class: "ap-icon-btn",
                  "aria-label": "Hide",
                  title: "Hide",
                  onClick: (_) => r(u)(v, !0)
                }, [
                  g(r(y), {
                    icon: "tabler:eye",
                    "aria-hidden": "true"
                  })
                ], 8, Un)
              ], 42, In))), 128))
            ], 42, Cn))), 128)),
            r(ie).length ? (m(), k("div", An, [
              l("button", {
                class: "ap-hidden-h",
                onClick: o[12] || (o[12] = (d) => E.value = !E.value)
              }, [
                g(r(y), {
                  icon: E.value ? "tabler:chevron-down" : "tabler:chevron-right",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                g(r(y), {
                  icon: "tabler:eye-off",
                  "aria-hidden": "true"
                }),
                L(" Hidden (" + I(r(ie).length) + ") ", 1)
              ]),
              E.value ? (m(), k("div", Nn, [
                (m(!0), k(W, null, he(r(ie), (d) => (m(), k("div", {
                  key: d.id,
                  class: "ap-row ap-row-off"
                }, [
                  o[40] || (o[40] = l("span", {
                    class: "ap-grip ap-grip-ghost",
                    "aria-hidden": "true"
                  }, null, -1)),
                  l("span", Pn, [
                    g(r(y), {
                      icon: d.icon || "tabler:square",
                      "aria-hidden": "true"
                    }, null, 8, ["icon"])
                  ]),
                  l("span", jn, I(d.label), 1),
                  l("button", {
                    class: "ap-icon-btn",
                    "aria-label": "Show",
                    title: "Show",
                    onClick: (v) => r(u)(d, !1)
                  }, [
                    g(r(y), {
                      icon: "tabler:eye-plus",
                      "aria-hidden": "true"
                    })
                  ], 8, zn)
                ]))), 128))
              ])) : S("", !0)
            ])) : S("", !0)
          ])
        ]))
      ])
    ]));
  }
}), Wn = {
  rootComponent: Gn,
  plugins: [mt]
};
export {
  Wn as mountConfig
};
//# sourceMappingURL=lazy-mount-CH5Q77yz.js.map
