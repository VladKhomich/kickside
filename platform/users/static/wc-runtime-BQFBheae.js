import { hasInjectionContext as Qn, inject as Be, effectScope as Zn, ref as H, markRaw as Xn, createApp as er, onMounted as Jt, onUnmounted as tr, watch as me, readonly as nr, getCurrentInstance as pt, nextTick as rr, reactive as or, renderSlot as Ie, openBlock as Qt, createBlock as ir, Teleport as Zt, createCommentVNode as Xt, useId as sr, mergeProps as ge, createElementBlock as ar, createElementVNode as lr, h as ur } from "vue";
import { addCollection as dr } from "@iconify/vue";
import { config as ft, addIcons as cr, on as mr, applyThemeMode as Ee, host as pr, hostCss as fr, loadCss as hr } from "@wippy-fe/proxy";
var ze = "data-wippy-visible";
function ht(e) {
  const t = e.getAttribute(ze);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var gr = Object.defineProperty, vr = (e, t, n) => t in e ? gr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, x = (e, t, n) => vr(e, typeof t != "symbol" ? t + "" : t, n), yr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], br = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function gt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function _r(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [r, o] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [a, l] of Object.entries(o)) {
            const s = typeof l == "string" ? gt(a) : null;
            s && t.add(s);
          }
          continue;
        }
        const i = typeof o == "string" ? gt(r) : null;
        i && t.add(i);
      }
  return [...t].sort();
}
function Sr(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${br} {
${t}
}`;
}
function $r(e, t) {
  const n = Sr(t);
  n && en(e, n, "@wippy-fe/css-variables-bridge");
}
function wr(e, t) {
  const r = (t ?? yr).map(async (o) => {
    const i = fr[o];
    if (!i)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await hr(i);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${i}):`, a), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const i of o) {
      if (!i)
        continue;
      const a = document.createElement("style");
      a.textContent = i, a.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(a);
    }
  });
}
function Tr(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function en(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = t, e.appendChild(r);
}
function Cr(e, t) {
  en(e, t, "@wippy-fe/custom-css");
}
function tn(e) {
  return e.__wippyHost ?? null;
}
function Pr(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Or(e, t, n) {
  switch (n.type) {
    case "string":
      return { value: t };
    case "number": {
      const r = Number.parseFloat(t);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: r };
    }
    case "integer": {
      const r = Number.parseInt(t, 10);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: r };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const r = JSON.parse(t);
        return n.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function We(e, t) {
  const n = {}, r = [];
  for (const [o, i] of Object.entries(t.properties)) {
    const a = e.getAttribute(o), l = Pr(o);
    if (a === null) {
      i.default !== void 0 && (n[l] = i.default);
      continue;
    }
    const s = Or(o, a, i);
    s.error ? r.push(s.error) : n[l] = s.value;
  }
  return { props: n, errors: r };
}
var xr = class {
  constructor(e, t) {
    x(this, "_props"), x(this, "_errors"), x(this, "_content"), x(this, "_hostVisibility"), x(this, "_propsListeners", /* @__PURE__ */ new Set()), x(this, "_contentListeners", /* @__PURE__ */ new Set()), x(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), x(this, "_disposed", !1), x(this, "_emitToDom"), x(this, "props"), x(this, "events"), x(this, "content"), x(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(r, o) {
        return n._subscribeProps(r, o);
      }
    }, this.events = {
      emit(r, o) {
        n._disposed || n._emitToDom(r, o);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(r, o) {
        return n._subscribeContent(r, o);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(r, o) {
        return n._subscribeHostVisibility(r, o);
      }
    };
  }
  /** @internal */
  notifyProps(e, t) {
    if (!this._disposed) {
      this._props = e, this._errors = t;
      for (const n of this._propsListeners)
        n(e, t);
    }
  }
  /** @internal */
  notifyContent(e) {
    if (!this._disposed) {
      this._content = e;
      for (const t of this._contentListeners)
        t(e);
    }
  }
  /** @internal */
  notifyHostVisibility(e, t) {
    if (!(this._disposed || e === t)) {
      this._hostVisibility = e;
      for (const n of this._hostVisibilityListeners)
        n(e, t);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(e), t?.immediate && e(this._props, this._errors);
    const n = () => {
      this._propsListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeContent(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(e), t?.immediate && e(this._content);
    const n = () => {
      this._contentListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeHostVisibility(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(e), t?.immediate && e(this._hostVisibility, this._hostVisibility);
    const n = () => {
      this._hostVisibilityListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
}, kr = class extends HTMLElement {
  constructor() {
    super(), x(this, "_internals"), x(this, "_contentObserver", null), x(this, "_initialized", !1), x(this, "_container", null), x(this, "_reactive", null), x(this, "_lastProps", null), x(this, "_lastErrors", []), x(this, "_lastContent", null), x(this, "_themeUnsub", null), x(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = ht(this);
  }
  /**
   * Override to provide the component's configuration.
   * Must be static because `observedAttributes` reads it before construction.
   *
   * Specify the generic to get typed `validateProps`:
   * ```ts
   * static get wippyConfig(): WippyElementConfig<MyProps> { ... }
   * ```
   */
  static get wippyConfig() {
    return { propsSchema: { properties: {} } };
  }
  /**
   * Derived from the props schema + any `extraObservedAttributes`.
   */
  static get observedAttributes() {
    const e = this.wippyConfig, t = Object.keys(e.propsSchema.properties), n = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...t, ...n, ze])];
  }
  /**
   * Host-owned logical activity. `null` means no host manages this element.
   * It is not CSS visibility or viewport intersection.
   */
  get hostVisible() {
    return this._hostVisible;
  }
  /**
   * Panel-scoped `host` wrapper attached by the managed-layout shell's
   * content resolvers (`ComponentResolver` / `WebComponentPackageLoader`).
   *
   * Inside a managed-layout panel, this is a wrapper around the universal
   * `host` API where context-aware calls (`layout.broadcast / send / on`)
   * are routed through the panel-bound bus — so `sourcePanelId` is
   * attributed correctly without postMessage indirection. Layout
   * mutations and other host methods pass through unchanged.
   *
   * `null` outside a managed-layout context (compat shell, chat sidebar,
   * standalone playground). Subclass code that needs a host in those
   * cases can fall back to `import { host } from '@wippy-fe/proxy'`.
   */
  get host() {
    return tn(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(e, t) {
    this.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      detail: t
    }));
  }
  /**
   * Opt-in reactive adapter — framework-agnostic. Subscribe to prop
   * changes, content changes, or emit typed events from a non-Vue
   * consumer without re-rolling reactivity.
   *
   * ```ts
   * class MyEl extends WippyElement<{ count: number }, { tick: { n: number } }> {
   *   protected onMount() {
   *     const ctrl = new AbortController()
   *     this.reactive.props.subscribe(({ count }) => {
   *       this.shadowRoot!.querySelector('.n')!.textContent = String(count)
   *     }, { signal: ctrl.signal, immediate: true })
   *   }
   *   tick(n: number) { this.reactive.events.emit('tick', { n }) }
   * }
   * ```
   *
   * Allocation cost is zero unless this getter is touched. Disposed on
   * `disconnectedCallback`; a fresh adapter is allocated on the next
   * access after reconnect.
   */
  get reactive() {
    if (!this._reactive) {
      const e = this.constructor.wippyConfig, t = !!e.contentTemplate;
      let n, r;
      if (this._lastProps !== null)
        n = this._lastProps, r = this._lastErrors;
      else {
        const i = We(this, e.propsSchema);
        e.validateProps && i.errors.push(...e.validateProps(i.props)), n = i.props, r = i.errors, this._lastProps = n, this._lastErrors = r;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new xr(
        { props: n, errors: r, content: o, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, t = this._initialized, n = this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" });
      let r;
      if (t)
        r = this._container;
      else {
        this.onInit(n), e.inlineCss && Tr(n, e.inlineCss);
        try {
          const u = ft?.theming, d = _r(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          $r(n, d);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const u = ft?.theming, d = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            d && Cr(n, d);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && wr(n, e.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const s = e.containerClasses ?? [];
        s.length > 0 && r.classList.add(...s), n.appendChild(r), this._container = r, cr(dr);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = mr("@theme", (s) => this._applyTheme(s)));
      const { props: o, errors: i } = We(this, e.propsSchema);
      e.validateProps && i.push(...e.validateProps(o));
      const a = o;
      this._lastProps = a, this._lastErrors = i;
      let l = null;
      e.contentTemplate && (l = this._extractContent(e.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const s = this._extractContent(e.contentTemplate);
        this._lastContent = s, this._reactive?.notifyContent(s), this.onContentChanged(s);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, r, a, i, l, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (e) {
      this.onError(e), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: e instanceof Error ? e.message : String(e),
        error: e
      });
    }
  }
  /**
   * Applies a forced theme mode to this host element AND the shadow container.
   * The container class drives in-shadow selectors (Tailwind `dark:` utilities,
   * `.w-theme-dark &`); the host-element class drives `:host(.w-theme-*)`
   * selectors. On `@theme` broadcasts the resolved `mode` is passed in directly
   * (don't re-read `getThemeMode()` — the proxy's config-vs-emit order isn't a
   * contract); on the initial connect it defaults to the host's current mode.
   * No-op for an older proxy without `getThemeMode` — `applyThemeMode` clamps
   * `undefined` to 'auto'.
   */
  _applyTheme(e = pr.getThemeMode?.()) {
    Ee(e, this), this._container && Ee(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Ee("auto", this), this._container && Ee("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === ze) {
      const l = this._hostVisible, s = ht(this);
      if (s === l)
        return;
      this._hostVisible = s, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(s, l), this.onHostVisibilityChanged(s, l));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: i } = We(this, r.propsSchema);
    r.validateProps && i.push(...r.validateProps(o));
    const a = o;
    this._lastProps = a, this._lastErrors = i, this._reactive?.notifyProps(a, i), this.onPropsChanged(a, i);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(e) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(e) {
    console.error(`${this.constructor.name} initialization failed:`, e);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(e, t) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(e, t) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(e) {
    return this.querySelector(`template[data-type="${e}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(e) {
  }
};
function Er(e) {
  return e.__wippyHostBus ?? null;
}
function Ar(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let nn;
const rn = (e) => nn = e, Lr = () => Qn() && Be(on) || nn, on = (
  /* istanbul ignore next */
  Symbol()
);
function jr() {
  const e = Zn(!0), t = e.run(() => H({}));
  let n = [], r = [];
  const o = Xn({
    install(i) {
      rn(o), o._a = i, i.provide(on, o), i.config.globalProperties.$pinia = o, r.forEach((a) => n.push(a)), r = [];
    },
    use(i) {
      return this._a ? n.push(i) : r.push(i), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return o;
}
var Nr = Object.defineProperty, Ir = (e, t, n) => t in e ? Nr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, de = (e, t, n) => Ir(e, typeof t != "symbol" ? t + "" : t, n), sn = /* @__PURE__ */ Symbol("wippy:emit"), an = /* @__PURE__ */ Symbol("wippy:props"), Rr = /* @__PURE__ */ Symbol("wippy:props_error"), Vr = /* @__PURE__ */ Symbol("wippy:content"), Dr = /* @__PURE__ */ Symbol("wippy:panel-id"), Mr = /* @__PURE__ */ Symbol("wippy:layout-bus"), Br = /* @__PURE__ */ Symbol("wippy:host"), ln = /* @__PURE__ */ Symbol("wippy:host-visibility");
function ps() {
  const e = Be(an);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function fs() {
  const e = Be(sn);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function Ur() {
  const e = Be(ln);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function hs(e) {
  const t = Ur();
  let n = !1, r = null, o = !1;
  function i() {
    if (r)
      return o = !0, r;
    let a;
    try {
      a = Promise.resolve(e());
    } catch (s) {
      a = Promise.reject(s);
    }
    const l = a.finally(() => {
      if (r === l && (r = null, n && o))
        return o = !1, i();
    });
    return r = l, l;
  }
  return Jt(() => (n = !0, i())), tr(() => {
    n = !1, o = !1;
  }), me(t, (a, l) => {
    if (n && l === !1 && a === !0)
      return i();
  }), t;
}
var gs = class extends kr {
  constructor() {
    super(...arguments), de(this, "_vueApp", null), de(this, "_propsRef", H({})), de(this, "_errorsRef", H([])), de(this, "_contentRef", H(null)), de(this, "_hostVisibilityRef", H(null)), de(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, r, o, i) {
    const a = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of r)
      this.emitEvent("invalid", { message: u });
    const l = new AbortController();
    this._bridgeAbort = l, this.reactive.props.subscribe((u, d) => {
      this._propsRef.value = u, this._errorsRef.value = [...d];
      for (const c of d)
        this.emitEvent("invalid", { message: c });
    }, { signal: l.signal }), this.reactive.content && this.reactive.content.subscribe((u) => {
      this._contentRef.value = u;
    }, { signal: l.signal }), this.reactive.hostVisibility.subscribe((u) => {
      this._hostVisibilityRef.value = u;
    }, { signal: l.signal });
    const s = (u) => {
      if (l.signal.aborted)
        return;
      const d = Lr(), c = er(u.rootComponent);
      this._vueApp = c;
      const m = jr();
      if (u.piniaPlugins)
        for (const p of u.piniaPlugins)
          m.use(p);
      if (c.use(m), u.plugins)
        for (const p of u.plugins)
          c.use(p);
      c.provide(an, this._propsRef), c.provide(Rr, this._errorsRef), c.provide(sn, this.emitEvent.bind(this)), c.provide(Vr, this._contentRef), c.provide(ln, this._hostVisibilityRef), c.provide(Dr, Ar(this)), c.provide(Mr, Er(this)), c.provide(Br, tn(this)), u.providers && u.providers(c, this), c.mount(t), d && rn(d);
    };
    if (a.rootComponent)
      s(a);
    else if (a.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), t.appendChild(u), a.lazyConfig().then((d) => {
        l.signal.aborted || (u.remove(), s(d));
      }).catch((d) => {
        if (l.signal.aborted)
          return;
        const c = d instanceof Error ? d.message : String(d), m = document.createElement("wippy-error");
        m.setAttribute("title", "Failed to load"), m.setAttribute("message", c), u.replaceWith(m), this.emitEvent("error", { message: c });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, Wr = Object.defineProperty, vt = Object.getOwnPropertySymbols, Hr = Object.prototype.hasOwnProperty, Fr = Object.prototype.propertyIsEnumerable, yt = (e, t, n) => t in e ? Wr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, zr = (e, t) => {
  for (var n in t || (t = {})) Hr.call(t, n) && yt(e, n, t[n]);
  if (vt) for (var n of vt(t)) Fr.call(t, n) && yt(e, n, t[n]);
  return e;
};
function F(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function Kr(e, t, n, r = 1) {
  let o = -1, i = F(e), a = F(t);
  return i && a ? o = 0 : i ? o = r : a ? o = -r : typeof e == "string" && typeof t == "string" ? o = n(e, t) : o = e < t ? -1 : e > t ? 1 : 0, o;
}
function Ke(e, t, n = /* @__PURE__ */ new WeakSet()) {
  if (e === t) return !0;
  if (!e || !t || typeof e != "object" || typeof t != "object" || n.has(e) || n.has(t)) return !1;
  n.add(e).add(t);
  let r = Array.isArray(e), o = Array.isArray(t), i, a, l;
  if (r && o) {
    if (a = e.length, a != t.length) return !1;
    for (i = a; i-- !== 0; ) if (!Ke(e[i], t[i], n)) return !1;
    return !0;
  }
  if (r != o) return !1;
  let s = e instanceof Date, u = t instanceof Date;
  if (s != u) return !1;
  if (s && u) return e.getTime() == t.getTime();
  let d = e instanceof RegExp, c = t instanceof RegExp;
  if (d != c) return !1;
  if (d && c) return e.toString() == t.toString();
  let m = Object.keys(e);
  if (a = m.length, a !== Object.keys(t).length) return !1;
  for (i = a; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t, m[i])) return !1;
  for (i = a; i-- !== 0; ) if (l = m[i], !Ke(e[l], t[l], n)) return !1;
  return !0;
}
function Yr(e, t) {
  return Ke(e, t);
}
function Ue(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function C(e) {
  return !F(e);
}
function Ye(e, t) {
  if (!e || !t) return null;
  try {
    let n = e[t];
    if (C(n)) return n;
  } catch {
  }
  if (Object.keys(e).length) {
    if (Ue(t)) return t(e);
    if (t.indexOf(".") === -1) return e[t];
    {
      let n = t.split("."), r = e;
      for (let o = 0, i = n.length; o < i; ++o) {
        if (r == null) return null;
        r = r[n[o]];
      }
      return r;
    }
  }
  return null;
}
function un(e, t, n) {
  return n ? Ye(e, n) === Ye(t, n) : Yr(e, t);
}
function vs(e, t) {
  if (e != null && t && t.length) {
    for (let n of t) if (un(e, n)) return !0;
  }
  return !1;
}
function B(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function dn(e = {}, t = {}) {
  let n = zr({}, e);
  return Object.keys(t).forEach((r) => {
    let o = r;
    B(t[o]) && o in e && B(e[o]) ? n[o] = dn(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function qr(...e) {
  return e.reduce((t, n, r) => r === 0 ? n : dn(t, n), {});
}
function ys(e, t) {
  let n = -1;
  if (t) {
    for (let r = 0; r < t.length; r++) if (t[r] === e) {
      n = r;
      break;
    }
  }
  return n;
}
function bs(e, t) {
  let n = -1;
  if (C(e)) try {
    n = e.findLastIndex(t);
  } catch {
    n = e.lastIndexOf([...e].reverse().find(t));
  }
  return n;
}
function j(e, ...t) {
  return Ue(e) ? e(...t) : e;
}
function L(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function M(e) {
  return L(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function st(e, t = "", n = {}) {
  let r = M(t).split("."), o = r.shift();
  if (o) {
    if (B(e)) {
      let i = Object.keys(e).find((a) => M(a) === o) || "";
      return st(j(e[i], n), r.join("."), n);
    }
    return;
  }
  return j(e, n);
}
function cn(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function Gr(e) {
  return C(e) && !isNaN(e);
}
function _s(e = "") {
  return C(e) && e.length === 1 && !!e.match(/\S| /);
}
function Ss() {
  return new Intl.Collator(void 0, { numeric: !0 }).compare;
}
function re(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function Jr(...e) {
  return qr(...e);
}
function ve(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function I(e) {
  if (e && /[\xC0-\xFF\u0100-\u017E]/.test(e)) {
    let t = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let n in t) e = e.replace(t[n], n);
  }
  return e;
}
function $s(e, t, n) {
  e && t !== n && (n >= e.length && (n %= e.length, t %= e.length), e.splice(n, 0, e.splice(t, 1)[0]));
}
function ws(e, t, n = 1, r, o = 1) {
  let i = Kr(e, t, r, n), a = n;
  return (F(e) || F(t)) && (a = o === 1 ? n : o), a * i;
}
function Qr(e) {
  return L(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function mn(e) {
  return L(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function at() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let r = e.get(t);
    return r ? r.push(n) : r = [n], e.set(t, r), this;
  }, off(t, n) {
    let r = e.get(t);
    return r && r.splice(r.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let r = e.get(t);
    r && r.forEach((o) => {
      o(n);
    });
  }, clear() {
    e.clear();
  } };
}
function Zr(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (!r) continue;
      let o = typeof r;
      if (o === "string" || o === "number") t.push(r);
      else if (o === "object") {
        let i = Array.isArray(r) ? [Zr(...r)] : Object.entries(r).map(([a, l]) => l ? a : void 0);
        t = i.length ? t.concat(i.filter((a) => !!a)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function Xr(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function qe(e, t) {
  if (e && t) {
    let n = (r) => {
      Xr(e, r) || (e.classList ? e.classList.add(r) : e.className += " " + r);
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function eo() {
  return window.innerWidth - document.documentElement.offsetWidth;
}
function Ts(e) {
  typeof e == "string" ? qe(document.body, e || "p-overflow-hidden") : (e != null && e.variableName && document.body.style.setProperty(e.variableName, eo() + "px"), qe(document.body, e?.className || "p-overflow-hidden"));
}
function to(e) {
  if (e) {
    let t = document.createElement("a");
    if (t.download !== void 0) {
      let { name: n, src: r } = e;
      return t.setAttribute("href", r), t.setAttribute("download", n), t.style.display = "none", document.body.appendChild(t), t.click(), document.body.removeChild(t), !0;
    }
  }
  return !1;
}
function Cs(e, t) {
  let n = new Blob([e], { type: "application/csv;charset=utf-8;" });
  window.navigator.msSaveOrOpenBlob ? navigator.msSaveOrOpenBlob(n, t + ".csv") : to({ name: t + ".csv", src: URL.createObjectURL(n) }) || (e = "data:text/csv;charset=utf-8," + e, window.open(encodeURI(e)));
}
function ye(e, t) {
  if (e && t) {
    let n = (r) => {
      e.classList ? e.classList.remove(r) : e.className = e.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Ps(e) {
  typeof e == "string" ? ye(document.body, e || "p-overflow-hidden") : (e != null && e.variableName && document.body.style.removeProperty(e.variableName), ye(document.body, e?.className || "p-overflow-hidden"));
}
function Ge(e) {
  for (let t of document?.styleSheets) try {
    for (let n of t?.cssRules) for (let r of n?.style) if (e.test(r)) return { name: r, value: n.style.getPropertyValue(r).trim() };
  } catch {
  }
  return null;
}
function pn(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [n, r] = [e.style.visibility, e.style.display], o = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = o.width || e.offsetWidth, t.height = o.height || e.offsetHeight, e.style.display = r, e.style.visibility = n;
  }
  return t;
}
function fn() {
  let e = window, t = document, n = t.documentElement, r = t.getElementsByTagName("body")[0], o = e.innerWidth || n.clientWidth || r.clientWidth, i = e.innerHeight || n.clientHeight || r.clientHeight;
  return { width: o, height: i };
}
function Je(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function no() {
  let e = document.documentElement;
  return (window.pageXOffset || Je(e)) - (e.clientLeft || 0);
}
function ro() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function oo(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function Os(e, t, n = !0) {
  var r, o, i, a;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : pn(e), s = l.height, u = l.width, d = t.offsetHeight, c = t.offsetWidth, m = t.getBoundingClientRect(), p = ro(), f = no(), v = fn(), g, y, _ = "top";
    m.top + d + s > v.height ? (g = m.top + p - s, _ = "bottom", g < 0 && (g = p)) : g = d + m.top + p, m.left + u > v.width ? y = Math.max(0, m.left + f + c - u) : y = m.left + f, oo(e) ? e.style.insetInlineEnd = y + "px" : e.style.insetInlineStart = y + "px", e.style.top = g + "px", e.style.transformOrigin = _, n && (e.style.marginTop = _ === "bottom" ? `calc(${(o = (r = Ge(/-anchor-gutter$/)) == null ? void 0 : r.value) != null ? o : "2px"} * -1)` : (a = (i = Ge(/-anchor-gutter$/)) == null ? void 0 : i.value) != null ? a : "");
  }
}
function xs(e, t) {
  e && (typeof t == "string" ? e.style.cssText = t : Object.entries(t || {}).forEach(([n, r]) => e.style[n] = r));
}
function io(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function ks(e, t, n = !0, r = void 0) {
  var o;
  if (e) {
    let i = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : pn(e), a = t.offsetHeight, l = t.getBoundingClientRect(), s = fn(), u, d, c = r ?? "top";
    if (!r && l.top + a + i.height > s.height ? (u = -1 * i.height, c = "bottom", l.top + u < 0 && (u = -1 * l.top)) : u = a, i.width > s.width ? d = l.left * -1 : l.left + i.width > s.width ? d = (l.left + i.width - s.width) * -1 : d = 0, e.style.top = u + "px", e.style.insetInlineStart = d + "px", e.style.transformOrigin = c, n) {
      let m = (o = Ge(/-anchor-gutter$/)) == null ? void 0 : o.value;
      e.style.marginTop = c === "bottom" ? `calc(${m ?? "2px"} * -1)` : m ?? "";
    }
  }
}
function lt(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function so(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && lt(e));
}
function ie(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Es() {
  if (window.getSelection) {
    let e = window.getSelection() || {};
    e.empty ? e.empty() : e.removeAllRanges && e.rangeCount > 0 && e.getRangeAt(0).getClientRects().length > 0 && e.removeAllRanges();
  }
}
function Re(e, t = {}) {
  if (ie(e)) {
    let n = (r, o) => {
      var i, a;
      let l = (i = e?.$attrs) != null && i[r] ? [(a = e?.$attrs) == null ? void 0 : a[r]] : [];
      return [o].flat().reduce((s, u) => {
        if (u != null) {
          let d = typeof u;
          if (d === "string" || d === "number") s.push(u);
          else if (d === "object") {
            let c = Array.isArray(u) ? n(r, u) : Object.entries(u).map(([m, p]) => r === "style" && (p || p === 0) ? `${m.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${p}` : p ? m : void 0);
            s = c.length ? s.concat(c.filter((m) => !!m)) : s;
          }
        }
        return s;
      }, l);
    };
    Object.entries(t).forEach(([r, o]) => {
      if (o != null) {
        let i = r.match(/^on(.+)/);
        i ? e.addEventListener(i[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? Re(e, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = o), e.setAttribute(r, o));
      }
    });
  }
}
function ao(e, t = {}, ...n) {
  {
    let r = document.createElement(e);
    return Re(r, t), r.append(...n), r;
  }
}
function lo(e, t) {
  return ie(e) ? Array.from(e.querySelectorAll(t)) : [];
}
function hn(e, t) {
  return ie(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function As(e, t) {
  e && document.activeElement !== e && e.focus(t);
}
function uo(e, t) {
  if (ie(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function gn(e, t = "") {
  let n = lo(e, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`), r = [];
  for (let o of n) getComputedStyle(o).display != "none" && getComputedStyle(o).visibility != "hidden" && r.push(o);
  return r;
}
function Ls(e, t) {
  let n = gn(e, t);
  return n.length > 0 ? n[0] : null;
}
function bt(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function js(e) {
  if (e) {
    let [t, n] = [e.style.visibility, e.style.display];
    e.style.visibility = "hidden", e.style.display = "block";
    let r = e.offsetHeight;
    return e.style.display = n, e.style.visibility = t, r;
  }
  return 0;
}
function Ns(e) {
  if (e) {
    let [t, n] = [e.style.visibility, e.style.display];
    e.style.visibility = "hidden", e.style.display = "block";
    let r = e.offsetWidth;
    return e.style.display = n, e.style.visibility = t, r;
  }
  return 0;
}
function Is(e) {
  var t;
  if (e) {
    let n = (t = lt(e)) == null ? void 0 : t.childNodes, r = 0;
    if (n) for (let o = 0; o < n.length; o++) {
      if (n[o] === e) return r;
      n[o].nodeType === 1 && r++;
    }
  }
  return -1;
}
function Rs(e, t) {
  let n = gn(e, t);
  return n.length > 0 ? n[n.length - 1] : null;
}
function Vs(e, t) {
  let n = e.nextElementSibling;
  for (; n; ) {
    if (n.matches(t)) return n;
    n = n.nextElementSibling;
  }
  return null;
}
function co(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || Je(document.documentElement) || Je(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function mo(e, t) {
  return e ? e.offsetHeight : 0;
}
function vn(e, t = []) {
  let n = lt(e);
  return n === null ? t : vn(n, t.concat([n]));
}
function Ds(e, t) {
  let n = e.previousElementSibling;
  for (; n; ) {
    if (n.matches(t)) return n;
    n = n.previousElementSibling;
  }
  return null;
}
function po(e) {
  let t = [];
  if (e) {
    let n = vn(e), r = /(auto|scroll)/, o = (i) => {
      try {
        let a = window.getComputedStyle(i, null);
        return r.test(a.getPropertyValue("overflow")) || r.test(a.getPropertyValue("overflowX")) || r.test(a.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let i of n) {
      let a = i.nodeType === 1 && i.dataset.scrollselectors;
      if (a) {
        let l = a.split(",");
        for (let s of l) {
          let u = hn(i, s);
          u && o(u) && t.push(u);
        }
      }
      i.nodeType !== 9 && o(i) && t.push(i);
    }
  }
  return t;
}
function Ms() {
  if (window.getSelection) return window.getSelection().toString();
  if (document.getSelection) return document.getSelection().toString();
}
function _t(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function Bs(e, t, n) {
  let r = e[t];
  typeof r == "function" && r.apply(e, []);
}
function Us() {
  return /(android)/i.test(navigator.userAgent);
}
function Ws(e) {
  if (e) {
    let t = e.nodeName, n = e.parentElement && e.parentElement.nodeName;
    return t === "INPUT" || t === "TEXTAREA" || t === "BUTTON" || t === "A" || n === "INPUT" || n === "TEXTAREA" || n === "BUTTON" || n === "A" || !!e.closest(".p-button, .p-checkbox, .p-radiobutton");
  }
  return !1;
}
function yn() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Hs(e, t = "") {
  return ie(e) ? e.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`) : !1;
}
function Fs(e) {
  return !!(e && e.offsetParent != null);
}
function zs() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function fo(e, t = "", n) {
  ie(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Ae = {};
function ho(e = "pui_id_") {
  return Object.hasOwn(Ae, e) || (Ae[e] = 0), Ae[e]++, `${e}${Ae[e]}`;
}
function go() {
  let e = [], t = (a, l, s = 999) => {
    let u = o(a, l, s), d = u.value + (u.key === a ? 0 : s) + 1;
    return e.push({ key: a, value: d }), d;
  }, n = (a) => {
    e = e.filter((l) => l.value !== a);
  }, r = (a, l) => o(a).value, o = (a, l, s = 0) => [...e].reverse().find((u) => !0) || { key: a, value: s }, i = (a) => a && parseInt(a.style.zIndex, 10) || 0;
  return { get: i, set: (a, l, s) => {
    l && (l.style.zIndex = String(t(a, !0, s)));
  }, clear: (a) => {
    a && (n(i(a)), a.style.zIndex = "");
  }, getCurrent: (a) => r(a) };
}
var Ks = go(), vo = Object.defineProperty, yo = Object.defineProperties, bo = Object.getOwnPropertyDescriptors, Ve = Object.getOwnPropertySymbols, bn = Object.prototype.hasOwnProperty, _n = Object.prototype.propertyIsEnumerable, St = (e, t, n) => t in e ? vo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, V = (e, t) => {
  for (var n in t || (t = {})) bn.call(t, n) && St(e, n, t[n]);
  if (Ve) for (var n of Ve(t)) _n.call(t, n) && St(e, n, t[n]);
  return e;
}, He = (e, t) => yo(e, bo(t)), W = (e, t) => {
  var n = {};
  for (var r in e) bn.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Ve) for (var r of Ve(e)) t.indexOf(r) < 0 && _n.call(e, r) && (n[r] = e[r]);
  return n;
}, _o = at(), E = _o, be = /{([^}]*)}/g, Sn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, $n = /var\([^)]+\)/g;
function $t(e) {
  return L(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function So(e) {
  return B(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function $o(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Qe(e = "", t = "") {
  return $o(`${L(e, !1) && L(t, !1) ? `${e}-` : e}${t}`);
}
function wn(e = "", t = "") {
  return `--${Qe(e, t)}`;
}
function wo(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function Tn(e, t = "", n = "", r = [], o) {
  if (L(e)) {
    let i = e.trim();
    if (wo(i)) return;
    if (re(i, be)) {
      let a = i.replaceAll(be, (l) => {
        let s = l.replace(/{|}/g, "").split(".").filter((u) => !r.some((d) => re(u, d)));
        return `var(${wn(n, mn(s.join("-")))}${C(o) ? `, ${o}` : ""})`;
      });
      return re(a.replace($n, "0"), Sn) ? `calc(${a})` : a;
    }
    return i;
  } else if (Gr(e)) return e;
}
function To(e, t, n) {
  L(t, !1) && e.push(`${t}:${n};`);
}
function ce(e, t) {
  return e ? `${e}{${t}}` : "";
}
function Cn(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(a, l) {
    let s = [], u = 0, d = "", c = null, m = 0;
    for (; u <= a.length; ) {
      let p = a[u];
      if ((p === '"' || p === "'" || p === "`") && a[u - 1] !== "\\" && (c = c === p ? null : p), !c && (p === "(" && m++, p === ")" && m--, (p === "," || u === a.length) && m === 0)) {
        let f = d.trim();
        f.startsWith("dt(") ? s.push(Cn(f, l)) : s.push(r(f)), d = "", u++;
        continue;
      }
      p !== void 0 && (d += p), u++;
    }
    return s;
  }
  function r(a) {
    let l = a[0];
    if ((l === '"' || l === "'" || l === "`") && a[a.length - 1] === l) return a.slice(1, -1);
    let s = Number(a);
    return isNaN(s) ? a : s;
  }
  let o = [], i = [];
  for (let a = 0; a < e.length; a++) if (e[a] === "d" && e.slice(a, a + 3) === "dt(") i.push(a), a += 2;
  else if (e[a] === ")" && i.length > 0) {
    let l = i.pop();
    i.length === 0 && o.push([l, a]);
  }
  if (!o.length) return e;
  for (let a = o.length - 1; a >= 0; a--) {
    let [l, s] = o[a], u = e.slice(l + 3, s), d = n(u, t), c = t(...d);
    e = e.slice(0, l) + c + e.slice(s + 1);
  }
  return e;
}
var Ys = (e) => {
  var t;
  let n = T.getTheme(), r = Ze(n, e, void 0, "variable"), o = (t = r?.match(/--[\w-]+/g)) == null ? void 0 : t[0], i = Ze(n, e, void 0, "value");
  return { name: o, variable: r, value: i };
}, oe = (...e) => Ze(T.getTheme(), ...e), Ze = (e = {}, t, n, r) => {
  if (t) {
    let { variable: o, options: i } = T.defaults || {}, { prefix: a, transform: l } = e?.options || i || {}, s = re(t, be) ? t : `{${t}}`;
    return r === "value" || F(r) && l === "strict" ? T.getTokenValue(t) : Tn(s, void 0, a, [o.excludedKeyRegex], n);
  }
  return "";
};
function Le(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((r, o, i) => {
      var a;
      return r + o + ((a = j(t[i], { dt: oe })) != null ? a : "");
    }, "");
    return Cn(n, oe);
  }
  return j(e, { dt: oe });
}
function Co(e, t = {}) {
  let n = T.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: i = n.excludedKeyRegex } = t, a = [], l = [], s = [{ node: e, path: r }];
  for (; s.length; ) {
    let { node: d, path: c } = s.pop();
    for (let m in d) {
      let p = d[m], f = So(p), v = re(m, i) ? Qe(c) : Qe(c, mn(m));
      if (B(f)) s.push({ node: f, path: v });
      else {
        let g = wn(v), y = Tn(f, v, r, [i]);
        To(l, g, y);
        let _ = v;
        r && _.startsWith(r + "-") && (_ = _.slice(r.length + 1)), a.push(_.replace(/-/g, "."));
      }
    }
  }
  let u = l.join("");
  return { value: l, tokens: a, declarations: u, css: ce(o, u) };
}
var R = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
  return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(e) {
  return { type: "attr", selector: `:root${e},:host${e}`, matched: this.pattern.test(e.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(e) {
  return { type: "media", selector: e, matched: this.pattern.test(e.trim()) };
} }, system: { pattern: /^system$/, resolve(e) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(e.trim()) };
} }, custom: { resolve(e) {
  return { type: "custom", selector: e, matched: !0 };
} } }, resolve(e) {
  let t = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [e].flat().map((n) => {
    var r;
    return (r = t.map((o) => o.resolve(n)).find((o) => o.matched)) != null ? r : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Co(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var i, a, l, s, u, d, c;
  let { preset: m, options: p } = t, f, v, g, y, _, P, h;
  if (C(m) && p.transform !== "strict") {
    let { primitive: S, semantic: k, extend: N } = m, z = k || {}, { colorScheme: K } = z, Q = W(z, ["colorScheme"]), Y = N || {}, { colorScheme: Z } = Y, X = W(Y, ["colorScheme"]), q = K || {}, { dark: ee } = q, se = W(q, ["dark"]), te = Z || {}, { dark: ae } = te, le = W(te, ["dark"]), U = C(S) ? this._toVariables({ primitive: S }, p) : {}, D = C(Q) ? this._toVariables({ semantic: Q }, p) : {}, ne = C(se) ? this._toVariables({ light: se }, p) : {}, ke = C(ee) ? this._toVariables({ dark: ee }, p) : {}, ue = C(X) ? this._toVariables({ semantic: X }, p) : {}, ct = C(le) ? this._toVariables({ light: le }, p) : {}, mt = C(ae) ? this._toVariables({ dark: ae }, p) : {}, [jn, Nn] = [(i = U.declarations) != null ? i : "", U.tokens], [In, Rn] = [(a = D.declarations) != null ? a : "", D.tokens || []], [Vn, Dn] = [(l = ne.declarations) != null ? l : "", ne.tokens || []], [Mn, Bn] = [(s = ke.declarations) != null ? s : "", ke.tokens || []], [Un, Wn] = [(u = ue.declarations) != null ? u : "", ue.tokens || []], [Hn, Fn] = [(d = ct.declarations) != null ? d : "", ct.tokens || []], [zn, Kn] = [(c = mt.declarations) != null ? c : "", mt.tokens || []];
    f = this.transformCSS(e, jn, "light", "variable", p, r, o), v = Nn;
    let Yn = this.transformCSS(e, `${In}${Vn}`, "light", "variable", p, r, o), qn = this.transformCSS(e, `${Mn}`, "dark", "variable", p, r, o);
    g = `${Yn}${qn}`, y = [.../* @__PURE__ */ new Set([...Rn, ...Dn, ...Bn])];
    let Gn = this.transformCSS(e, `${Un}${Hn}color-scheme:light`, "light", "variable", p, r, o), Jn = this.transformCSS(e, `${zn}color-scheme:dark`, "dark", "variable", p, r, o);
    _ = `${Gn}${Jn}`, P = [.../* @__PURE__ */ new Set([...Wn, ...Fn, ...Kn])], h = j(m.css, { dt: oe });
  }
  return { primitive: { css: f, tokens: v }, semantic: { css: g, tokens: y }, global: { css: _, tokens: P }, style: h };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: r, set: o, defaults: i, selector: a }) {
  var l, s, u;
  let d, c, m;
  if (C(t) && n.transform !== "strict") {
    let p = e.replace("-directive", ""), f = t, { colorScheme: v, extend: g, css: y } = f, _ = W(f, ["colorScheme", "extend", "css"]), P = g || {}, { colorScheme: h } = P, S = W(P, ["colorScheme"]), k = v || {}, { dark: N } = k, z = W(k, ["dark"]), K = h || {}, { dark: Q } = K, Y = W(K, ["dark"]), Z = C(_) ? this._toVariables({ [p]: V(V({}, _), S) }, n) : {}, X = C(z) ? this._toVariables({ [p]: V(V({}, z), Y) }, n) : {}, q = C(N) ? this._toVariables({ [p]: V(V({}, N), Q) }, n) : {}, [ee, se] = [(l = Z.declarations) != null ? l : "", Z.tokens || []], [te, ae] = [(s = X.declarations) != null ? s : "", X.tokens || []], [le, U] = [(u = q.declarations) != null ? u : "", q.tokens || []], D = this.transformCSS(p, `${ee}${te}`, "light", "variable", n, o, i, a), ne = this.transformCSS(p, le, "dark", "variable", n, o, i, a);
    d = `${D}${ne}`, c = [.../* @__PURE__ */ new Set([...se, ...ae, ...U])], m = j(y, { dt: oe });
  }
  return { css: d, tokens: c, style: m };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var i;
  let { preset: a, options: l } = t, s = (i = a?.components) == null ? void 0 : i[e];
  return this.getPreset({ name: e, preset: s, options: l, params: n, set: r, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var i, a;
  let l = e.replace("-directive", ""), { preset: s, options: u } = t, d = ((i = s?.components) == null ? void 0 : i[l]) || ((a = s?.directives) == null ? void 0 : a[l]);
  return this.getPreset({ name: l, preset: d, options: u, params: n, set: r, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${j(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: i }) {
  let a = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: i }), l = Object.entries(r).reduce((s, [u, d]) => s.push(`${u}="${d}"`) && s, []).join(" ");
  return Object.entries(a || {}).reduce((s, [u, d]) => {
    if (B(d) && Object.hasOwn(d, "css")) {
      let c = ve(d.css), m = `${u}-variables`;
      s.push(`<style type="text/css" data-primevue-style-id="${m}" ${l}>${c}</style>`);
    }
    return s;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: i }) {
  var a;
  let l = { name: e, theme: t, params: n, set: o, defaults: i }, s = (a = e.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : a.css, u = Object.entries(r).reduce((d, [c, m]) => d.push(`${c}="${m}"`) && d, []).join(" ");
  return s ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${u}>${ve(s)}</style>` : "";
}, createTokens(e = {}, t, n = "", r = "", o = {}) {
  let i = function(l, s = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: s, value: void 0 };
    u.push(this.path), s.name = this.path, s.binding || (s.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && be.test(this.value)) {
      let c = this.value.trim().replace(be, (m) => {
        var p;
        let f = m.slice(1, -1), v = this.tokens[f];
        if (!v) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
        let g = v.computed(l, s, u);
        return Array.isArray(g) && g.length === 2 ? `light-dark(${g[0].value},${g[1].value})` : (p = g?.value) != null ? p : "__UNRESOLVED__";
      });
      d = Sn.test(c.replace($n, "0")) ? `calc(${c})` : c;
    }
    return F(s.binding) && delete s.binding, u.pop(), { colorScheme: l, path: this.path, paths: s, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, a = (l, s, u) => {
    Object.entries(l).forEach(([d, c]) => {
      let m = re(d, t.variable.excludedKeyRegex) ? s : s ? `${s}.${$t(d)}` : $t(d), p = u ? `${u}.${d}` : d;
      B(c) ? a(c, m, p) : (o[m] || (o[m] = { paths: [], computed: (f, v = {}, g = []) => {
        if (o[m].paths.length === 1) return o[m].paths[0].computed(o[m].paths[0].scheme, v.binding, g);
        if (f && f !== "none") for (let y = 0; y < o[m].paths.length; y++) {
          let _ = o[m].paths[y];
          if (_.scheme === f) return _.computed(f, v.binding, g);
        }
        return o[m].paths.map((y) => y.computed(y.scheme, v[y.scheme], g));
      } }), o[m].paths.push({ path: p, value: c, scheme: p.includes("colorScheme.light") ? "light" : p.includes("colorScheme.dark") ? "dark" : "none", computed: i, tokens: o }));
    });
  };
  return a(e, n, r), o;
}, getTokenValue(e, t, n) {
  var r;
  let o = ((l) => l.split(".").filter((s) => !re(s.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), i = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, a = [(r = e[o]) == null ? void 0 : r.computed(i)].flat().filter((l) => l);
  return a.length === 1 ? a[0].value : a.reduce((l = {}, s) => {
    let u = s, { colorScheme: d } = u, c = W(u, ["colorScheme"]);
    return l[d] = c, l;
  }, void 0);
}, getSelectorRule(e, t, n, r) {
  return n === "class" || n === "attr" ? ce(C(t) ? `${e}${t},${e} ${t}` : e, r) : ce(e, ce(t ?? ":root,:host", r));
}, transformCSS(e, t, n, r, o = {}, i, a, l) {
  if (C(t)) {
    let { cssLayer: s } = o;
    if (r !== "style") {
      let u = this.getColorSchemeOption(o, a);
      t = n === "dark" ? u.reduce((d, { type: c, selector: m }) => (C(m) && (d += m.includes("[CSS]") ? m.replace("[CSS]", t) : this.getSelectorRule(m, l, c, t)), d), "") : ce(l ?? ":root,:host", t);
    }
    if (s) {
      let u = { name: "primeui" };
      B(s) && (u.name = j(s.name, { name: e, type: r })), C(u.name) && (t = ce(`@layer ${u.name}`, t), i?.layerNames(u.name));
    }
    return t;
  }
  return "";
} }, T = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = He(V({}, t), { options: V(V({}, this.defaults.options), t.options) }), this._tokens = R.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.preset) || {};
}, get options() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(e) {
  this.update({ theme: e }), E.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = He(V({}, this.theme), { preset: e }), this._tokens = R.createTokens(e, this.defaults), this.clearLoadedStyleNames(), E.emit("preset:change", e), E.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = He(V({}, this.theme), { options: e }), this.clearLoadedStyleNames(), E.emit("options:change", e), E.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(e) {
  this._layerNames.add(e);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(e) {
  return this._loadedStyleNames.has(e);
}, setLoadedStyleName(e) {
  this._loadedStyleNames.add(e);
}, deleteLoadedStyleName(e) {
  this._loadedStyleNames.delete(e);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(e) {
  return R.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return R.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPresetD(n);
}, getCustomPreset(e = "", t, n, r) {
  let o = { name: e, preset: t, options: this.options, selector: n, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return R.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", r) {
  return R.transformCSS(e, t, r, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return R.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return R.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), E.emit(`theme:${t}:load`, e), !this._loadingStyles.size && E.emit("theme:load"));
} }, A = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
}, qs = {
  AND: "and",
  OR: "or"
};
function wt(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (!n) {
    if (Array.isArray(e) || (n = Po(e)) || t) {
      n && (e = n);
      var r = 0, o = function() {
      };
      return { s: o, n: function() {
        return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
      }, e: function(u) {
        throw u;
      }, f: o };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var i, a = !0, l = !1;
  return { s: function() {
    n = n.call(e);
  }, n: function() {
    var u = n.next();
    return a = u.done, u;
  }, e: function(u) {
    l = !0, i = u;
  }, f: function() {
    try {
      a || n.return == null || n.return();
    } finally {
      if (l) throw i;
    }
  } };
}
function Po(e, t) {
  if (e) {
    if (typeof e == "string") return Tt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Tt(e, t) : void 0;
  }
}
function Tt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
var Gs = {
  filter: function(t, n, r, o, i) {
    var a = [];
    if (!t)
      return a;
    var l = wt(t), s;
    try {
      for (l.s(); !(s = l.n()).done; ) {
        var u = s.value;
        if (typeof u == "string") {
          if (this.filters[o](u, r, i)) {
            a.push(u);
            continue;
          }
        } else {
          var d = wt(n), c;
          try {
            for (d.s(); !(c = d.n()).done; ) {
              var m = c.value, p = Ye(u, m);
              if (this.filters[o](p, r, i)) {
                a.push(u);
                break;
              }
            }
          } catch (f) {
            d.e(f);
          } finally {
            d.f();
          }
        }
      }
    } catch (f) {
      l.e(f);
    } finally {
      l.f();
    }
    return a;
  },
  filters: {
    startsWith: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = I(n.toString()).toLocaleLowerCase(r), i = I(t.toString()).toLocaleLowerCase(r);
      return i.slice(0, o.length) === o;
    },
    contains: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = I(n.toString()).toLocaleLowerCase(r), i = I(t.toString()).toLocaleLowerCase(r);
      return i.indexOf(o) !== -1;
    },
    notContains: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = I(n.toString()).toLocaleLowerCase(r), i = I(t.toString()).toLocaleLowerCase(r);
      return i.indexOf(o) === -1;
    },
    endsWith: function(t, n, r) {
      if (n == null || n === "")
        return !0;
      if (t == null)
        return !1;
      var o = I(n.toString()).toLocaleLowerCase(r), i = I(t.toString()).toLocaleLowerCase(r);
      return i.indexOf(o, i.length - o.length) !== -1;
    },
    equals: function(t, n, r) {
      return n == null || n === "" ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() === n.getTime() : I(t.toString()).toLocaleLowerCase(r) == I(n.toString()).toLocaleLowerCase(r);
    },
    notEquals: function(t, n, r) {
      return n == null || n === "" ? !1 : t == null ? !0 : t.getTime && n.getTime ? t.getTime() !== n.getTime() : I(t.toString()).toLocaleLowerCase(r) != I(n.toString()).toLocaleLowerCase(r);
    },
    in: function(t, n) {
      if (n == null || n.length === 0)
        return !0;
      for (var r = 0; r < n.length; r++)
        if (un(t, n[r]))
          return !0;
      return !1;
    },
    between: function(t, n) {
      return n == null || n[0] == null || n[1] == null ? !0 : t == null ? !1 : t.getTime ? n[0].getTime() <= t.getTime() && t.getTime() <= n[1].getTime() : n[0] <= t && t <= n[1];
    },
    lt: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() < n.getTime() : t < n;
    },
    lte: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() <= n.getTime() : t <= n;
    },
    gt: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() > n.getTime() : t > n;
    },
    gte: function(t, n) {
      return n == null ? !0 : t == null ? !1 : t.getTime && n.getTime ? t.getTime() >= n.getTime() : t >= n;
    },
    dateIs: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.toDateString() === n.toDateString());
    },
    dateIsNot: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.toDateString() !== n.toDateString());
    },
    dateBefore: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.getTime() < n.getTime());
    },
    dateAfter: function(t, n) {
      return n == null ? !0 : t == null ? !1 : (typeof t == "string" && (t = new Date(t)), typeof n == "string" && (n = new Date(n)), t.getTime() > n.getTime());
    }
  },
  register: function(t, n) {
    this.filters[t] = n;
  }
}, Oo = `
    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    .p-collapsible-enter-active {
        animation: p-animate-collapsible-expand 0.2s ease-out;
        overflow: hidden;
    }

    .p-collapsible-leave-active {
        animation: p-animate-collapsible-collapse 0.2s ease-out;
        overflow: hidden;
    }

    @keyframes p-animate-collapsible-expand {
        from {
            grid-template-rows: 0fr;
        }
        to {
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-collapsible-collapse {
        from {
            grid-template-rows: 1fr;
        }
        to {
            grid-template-rows: 0fr;
        }
    }

    .p-disabled,
    .p-disabled * {
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    .p-disabled,
    .p-component:disabled {
        opacity: dt('disabled.opacity');
    }

    .pi {
        font-size: dt('icon.size');
    }

    .p-icon {
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .p-overlay-mask {
        background: var(--px-mask-background, dt('mask.background'));
        color: dt('mask.color');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .p-overlay-mask-enter-active {
        animation: p-animate-overlay-mask-enter dt('mask.transition.duration') forwards;
    }

    .p-overlay-mask-leave-active {
        animation: p-animate-overlay-mask-leave dt('mask.transition.duration') forwards;
    }

    @keyframes p-animate-overlay-mask-enter {
        from {
            background: transparent;
        }
        to {
            background: var(--px-mask-background, dt('mask.background'));
        }
    }
    @keyframes p-animate-overlay-mask-leave {
        from {
            background: var(--px-mask-background, dt('mask.background'));
        }
        to {
            background: transparent;
        }
    }

    .p-anchored-overlay-enter-active {
        animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-anchored-overlay-leave-active {
        animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-anchored-overlay-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-anchored-overlay-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
function _e(e) {
  "@babel/helpers - typeof";
  return _e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _e(e);
}
function Ct(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Pt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ct(Object(n), !0).forEach(function(r) {
      xo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ct(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function xo(e, t, n) {
  return (t = ko(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ko(e) {
  var t = Eo(e, "string");
  return _e(t) == "symbol" ? t : t + "";
}
function Eo(e, t) {
  if (_e(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (_e(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ao(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  pt() && pt().components ? Jt(e) : t ? e() : rr(e);
}
var Lo = 0;
function jo(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = H(!1), r = H(e), o = H(null), i = yn() ? window.document : void 0, a = t.document, l = a === void 0 ? i : a, s = t.immediate, u = s === void 0 ? !0 : s, d = t.manual, c = d === void 0 ? !1 : d, m = t.name, p = m === void 0 ? "style_".concat(++Lo) : m, f = t.id, v = f === void 0 ? void 0 : f, g = t.media, y = g === void 0 ? void 0 : g, _ = t.nonce, P = _ === void 0 ? void 0 : _, h = t.first, S = h === void 0 ? !1 : h, k = t.onMounted, N = k === void 0 ? void 0 : k, z = t.onUpdated, K = z === void 0 ? void 0 : z, Q = t.onLoad, Y = Q === void 0 ? void 0 : Q, Z = t.props, X = Z === void 0 ? {} : Z, q = function() {
  }, ee = function(ae) {
    var le = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var U = Pt(Pt({}, X), le), D = U.name || p, ne = U.id || v, ke = U.nonce || P;
      o.value = l.querySelector('style[data-primevue-style-id="'.concat(D, '"]')) || l.getElementById(ne) || l.createElement("style"), o.value.isConnected || (r.value = ae || e, Re(o.value, {
        type: "text/css",
        id: ne,
        media: y,
        nonce: ke
      }), S ? l.head.prepend(o.value) : l.head.appendChild(o.value), fo(o.value, "data-primevue-style-id", D), Re(o.value, U), o.value.onload = function(ue) {
        return Y?.(ue, {
          name: D
        });
      }, N?.(D)), !n.value && (q = me(r, function(ue) {
        o.value.textContent = ue, K?.(D);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, se = function() {
    !l || !n.value || (q(), so(o.value) && l.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return u && !c && Ao(ee), {
    id: v,
    name: p,
    el: o,
    css: r,
    unload: se,
    load: ee,
    isLoaded: nr(n)
  };
}
function Se(e) {
  "@babel/helpers - typeof";
  return Se = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Se(e);
}
var Ot, xt, kt, Et;
function At(e, t) {
  return Vo(e) || Ro(e, t) || Io(e, t) || No();
}
function No() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Io(e, t) {
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
function Ro(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, i, a, l = [], s = !0, u = !1;
    try {
      if (i = (n = n.call(e)).next, t !== 0) for (; !(s = (r = i.call(n)).done) && (l.push(r.value), l.length !== t); s = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return l;
  }
}
function Vo(e) {
  if (Array.isArray(e)) return e;
}
function jt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Fe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jt(Object(n), !0).forEach(function(r) {
      Do(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : jt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Do(e, t, n) {
  return (t = Mo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Mo(e) {
  var t = Bo(e, "string");
  return Se(t) == "symbol" ? t : t + "";
}
function Bo(e, t) {
  if (Se(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Se(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function je(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Uo = function(t) {
  var n = t.dt;
  return `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    padding: 0;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: `.concat(n("scrollbar.width"), `;
}
`);
}, Wo = {}, Ho = {}, O = {
  name: "base",
  css: Uo,
  style: Oo,
  classes: Wo,
  inlineStyles: Ho,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(i) {
      return i;
    }, o = r(Le(Ot || (Ot = je(["", ""])), t));
    return C(o) ? jo(ve(o), Fe({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return T.transformCSS(n.name || t.name, "".concat(o).concat(Le(xt || (xt = je(["", ""])), r)));
    });
  },
  getCommonTheme: function(t) {
    return T.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return T.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return T.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, r) {
    return T.getCustomPreset(this.name, t, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return T.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = j(this.css, {
        dt: oe
      }) || "", o = ve(Le(kt || (kt = je(["", "", ""])), r, t)), i = Object.entries(n).reduce(function(a, l) {
        var s = At(l, 2), u = s[0], d = s[1];
        return a.push("".concat(u, '="').concat(d, '"')) && a;
      }, []).join(" ");
      return C(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(i, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return T.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [T.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), i = Le(Et || (Et = je(["", ""])), j(this.style, {
        dt: oe
      })), a = ve(T.transformCSS(o, i)), l = Object.entries(n).reduce(function(s, u) {
        var d = At(u, 2), c = d[0], m = d[1];
        return s.push("".concat(c, '="').concat(m, '"')) && s;
      }, []).join(" ");
      C(a) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(l, ">").concat(a, "</style>"));
    }
    return r.join("");
  },
  extend: function(t) {
    return Fe(Fe({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, J = at();
function $e(e) {
  "@babel/helpers - typeof";
  return $e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $e(e);
}
function Nt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Ne(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Nt(Object(n), !0).forEach(function(r) {
      Fo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Nt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Fo(e, t, n) {
  return (t = zo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function zo(e) {
  var t = Ko(e, "string");
  return $e(t) == "symbol" ? t : t + "";
}
function Ko(e, t) {
  if ($e(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if ($e(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Yo = {
  ripple: !1,
  inputStyle: null,
  inputVariant: null,
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: !1,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    fileChosenMessage: "{0} files",
    noFileChosenMessage: "No file chosen",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List"
    }
  },
  filterMatchModeOptions: {
    text: [A.STARTS_WITH, A.CONTAINS, A.NOT_CONTAINS, A.ENDS_WITH, A.EQUALS, A.NOT_EQUALS],
    numeric: [A.EQUALS, A.NOT_EQUALS, A.LESS_THAN, A.LESS_THAN_OR_EQUAL_TO, A.GREATER_THAN, A.GREATER_THAN_OR_EQUAL_TO],
    date: [A.DATE_IS, A.DATE_IS_NOT, A.DATE_BEFORE, A.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  theme: void 0,
  unstyled: !1,
  pt: void 0,
  ptOptions: {
    mergeSections: !0,
    mergeProps: !1
  },
  csp: {
    nonce: void 0
  }
}, qo = Symbol();
function Go(e, t) {
  var n = {
    config: or(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(qo, n), Jo(), Qo(e, n), n;
}
var pe = [];
function Jo() {
  E.clear(), pe.forEach(function(e) {
    return e?.();
  }), pe = [];
}
function Qo(e, t) {
  var n = H(!1), r = function() {
    var u;
    if (((u = t.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !T.isStyleNameLoaded("common")) {
      var d, c, m = ((d = O.getCommonTheme) === null || d === void 0 ? void 0 : d.call(O)) || {}, p = m.primitive, f = m.semantic, v = m.global, g = m.style, y = {
        nonce: (c = t.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      O.load(p?.css, Ne({
        name: "primitive-variables"
      }, y)), O.load(f?.css, Ne({
        name: "semantic-variables"
      }, y)), O.load(v?.css, Ne({
        name: "global-variables"
      }, y)), O.loadStyle(Ne({
        name: "global-style"
      }, y), g), T.setLoadedStyleName("common");
    }
  };
  E.on("theme:change", function(s) {
    n.value || (e.config.globalProperties.$primevue.config.theme = s, n.value = !0);
  });
  var o = me(t.config, function(s, u) {
    J.emit("config:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), i = me(function() {
    return t.config.ripple;
  }, function(s, u) {
    J.emit("config:ripple:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = me(function() {
    return t.config.theme;
  }, function(s, u) {
    n.value || T.setTheme(s), t.config.unstyled || r(), n.value = !1, J.emit("config:theme:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = me(function() {
    return t.config.unstyled;
  }, function(s, u) {
    !s && t.config.theme && r(), J.emit("config:unstyled:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  pe.push(o), pe.push(i), pe.push(a), pe.push(l);
}
var Zo = {
  install: function(t, n) {
    var r = Jr(Yo, n);
    Go(t, r);
  }
}, Pn = {
  name: "Portal",
  props: {
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    disabled: {
      type: Boolean,
      default: !1
    }
  },
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = yn();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function Xo(e, t, n, r, o, i) {
  return i.inline ? Ie(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (Qt(), ir(Zt, {
    key: 1,
    to: n.appendTo
  }, [Ie(e.$slots, "default")], 8, ["to"])) : Xt("", !0);
}
Pn.render = Xo;
var G = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(t) {
    return this._loadedStyleNames.has(t);
  },
  setLoadedStyleName: function(t) {
    this._loadedStyleNames.add(t);
  },
  deleteLoadedStyleName: function(t) {
    this._loadedStyleNames.delete(t);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function ei() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = sr();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var It = O.extend({
  name: "common"
});
function we(e) {
  "@babel/helpers - typeof";
  return we = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, we(e);
}
function ti(e) {
  return kn(e) || ni(e) || xn(e) || On();
}
function ni(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function fe(e, t) {
  return kn(e) || ri(e, t) || xn(e, t) || On();
}
function On() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xn(e, t) {
  if (e) {
    if (typeof e == "string") return Xe(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Xe(e, t) : void 0;
  }
}
function Xe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ri(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, i, a, l = [], s = !0, u = !1;
    try {
      if (i = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        s = !1;
      } else for (; !(s = (r = i.call(n)).done) && (l.push(r.value), l.length !== t); s = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return l;
  }
}
function kn(e) {
  if (Array.isArray(e)) return e;
}
function Rt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function $(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Rt(Object(n), !0).forEach(function(r) {
      he(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Rt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function he(e, t, n) {
  return (t = oi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function oi(e) {
  var t = ii(e, "string");
  return we(t) == "symbol" ? t : t + "";
}
function ii(e, t) {
  if (we(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (we(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var si = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      default: void 0
    },
    ptOptions: {
      type: Object,
      default: void 0
    },
    unstyled: {
      type: Boolean,
      default: void 0
    },
    dt: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: !0,
      handler: function(t) {
        E.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var r = this;
        E.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return r._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, r, o, i, a, l, s, u, d, c, m = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, p = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, f = m ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = f || p) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (i = o.onBeforeCreate) === null || i === void 0 || i.call(o);
    var v = (a = this.$primevueConfig) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a._usept, g = v ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, y = v ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = y || g) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = ei(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = hn(ie(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = $({
      name: this.$.type.name,
      attrSelector: this.$attrSelector
    }, this.$params)), this._loadStyles(), this._hook("onBeforeMount");
  },
  mounted: function() {
    this._hook("onMounted");
  },
  beforeUpdate: function() {
    this._hook("onBeforeUpdate");
  },
  updated: function() {
    this._hook("onUpdated");
  },
  beforeUnmount: function() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function() {
    this._removeThemeListeners(), this._unloadScopedThemeStyles(), this._hook("onUnmounted");
  },
  methods: {
    _hook: function(t) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), r = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), r?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return Ue(t) ? t.apply(void 0, r) : ge.apply(void 0, r);
    },
    _load: function() {
      G.isStyleNameLoaded("base") || (O.loadCSS(this.$styleOptions), this._loadGlobalStyles(), G.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !G.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (It.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), G.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      C(t) && O.load(t, $({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!T.isStyleNameLoaded("common")) {
          var r, o, i = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, a = i.primitive, l = i.semantic, s = i.global, u = i.style;
          O.load(a?.css, $({
            name: "primitive-variables"
          }, this.$styleOptions)), O.load(l?.css, $({
            name: "semantic-variables"
          }, this.$styleOptions)), O.load(s?.css, $({
            name: "global-variables"
          }, this.$styleOptions)), O.loadStyle($({
            name: "global-style"
          }, this.$styleOptions), u), T.setLoadedStyleName("common");
        }
        if (!T.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, m, p, f = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, v = f.css, g = f.style;
          (m = this.$style) === null || m === void 0 || m.load(v, $({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (p = this.$style) === null || p === void 0 || p.loadStyle($({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), g), T.setLoadedStyleName(this.$style.name);
        }
        if (!T.isStyleNameLoaded("layer-order")) {
          var y, _, P = (y = this.$style) === null || y === void 0 || (_ = y.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(y);
          O.load(P, $({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), T.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, r, o, i = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, a = i.css, l = (o = this.$style) === null || o === void 0 ? void 0 : o.load(a, $({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = l.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      G.clearLoadedStyleNames(), E.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      E.off("theme:change", this._loadCoreStyles), E.off("theme:change", this._load), E.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return st(t, n, r);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, a = /./g.test(r) && !!o[r.split(".")[0]], l = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, m = i ? a ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, p = a ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, $($({}, o), {}, {
        global: m || {}
      })), f = this._getPTDatasets(r);
      return u || !u && p ? c ? this._mergeProps(c, m, p, f) : $($($({}, m), p), f) : $($({}, p), f);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return ge(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", i = r === "root" && C((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return r !== "transition" && $($({}, r === "root" && $($(he({}, "".concat(o, "name"), M(i ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), i && he({}, "".concat(o, "extend"), M(this.$.type.name))), {}, he({}, "".concat(this.$attrSelector), ""))), {}, he({}, "".concat(o, "section"), M(r)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return L(t) || cn(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, i = function(l) {
        var s, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = o ? o(l) : l, c = M(r), m = M(n.$name);
        return (s = u ? c !== m ? d?.[c] : void 0 : d?.[c]) !== null && s !== void 0 ? s : d;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: i(t.originalValue),
        value: i(t.value)
      } : i(t, !0);
    },
    _usePT: function(t, n, r, o) {
      var i = function(v) {
        return n(v, r, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var a, l = t._usept || ((a = this.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, m = i(t.originalValue), p = i(t.value);
        return m === void 0 && p === void 0 ? void 0 : L(p) ? p : L(m) ? m : u || !u && p ? c ? this._mergeProps(c, m, p) : $($({}, m), p) : p;
      }
      return i(t);
    },
    _useGlobalPT: function(t, n, r) {
      return this._usePT(this.globalPT, t, n, r);
    },
    _useDefaultPT: function(t, n, r) {
      return this._usePT(this.defaultPT, t, n, r);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, $($({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = ge(this.$_attrsWithoutPT, this.ptm(n, r));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, $({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, $($({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, $($({}, this.$params), r)), i = this._getOptionValue(It.inlineStyles, t, $($({}, this.$params), r));
        return [i, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return j(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, $({}, n.$params)) || j(r, $({}, n.$params));
      });
    },
    isUnstyled: function() {
      var t;
      return this.unstyled !== void 0 ? this.unstyled : (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var t, n = Object.keys(((t = this.$.vnode) === null || t === void 0 ? void 0 : t.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(r) {
        var o = fe(r, 1), i = o[0];
        return n?.includes(i);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return $($({
        classes: void 0,
        inlineStyles: void 0,
        load: function() {
        },
        loadCSS: function() {
        },
        loadStyle: function() {
        }
      }, (this._getHostInstance(this) || {}).$style), this.$options.style);
    },
    $styleOptions: function() {
      var t;
      return {
        nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
      };
    },
    $primevueConfig: function() {
      var t;
      return (t = this.$primevue) === null || t === void 0 ? void 0 : t.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var t = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: t,
          props: t?.$props,
          state: t?.$data,
          attrs: t?.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = fe(t, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(t, n) {
        var r = fe(n, 2), o = r[0], i = r[1], a = o.split(":"), l = ti(a), s = Xe(l).slice(1);
        return s?.reduce(function(u, d, c, m) {
          return !u[d] && (u[d] = c === m.length - 1 ? i : {}), u[d];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = fe(t, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(t, n) {
        var r = fe(n, 2), o = r[0], i = r[1];
        return t[o] = i, t;
      }, {});
    }
  }
}, ai = `
    .p-contextmenu {
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
        min-width: 12.5rem;
    }

    .p-contextmenu-root-list,
    .p-contextmenu-submenu {
        margin: 0;
        padding: dt('contextmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('contextmenu.list.gap');
    }

    .p-contextmenu-submenu {
        position: absolute;
        display: flex;
        flex-direction: column;
        min-width: 100%;
        z-index: 1;
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
    }

    .p-contextmenu-item {
        position: relative;
    }

    .p-contextmenu-item-content {
        transition:
            background dt('contextmenu.transition.duration'),
            color dt('contextmenu.transition.duration');
        border-radius: dt('contextmenu.item.border.radius');
        color: dt('contextmenu.item.color');
    }

    .p-contextmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('contextmenu.item.padding');
        gap: dt('contextmenu.item.gap');
        user-select: none;
    }

    .p-contextmenu-item-label {
        line-height: 1;
    }

    .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.color');
    }

    .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('contextmenu.submenu.icon.size');
        width: dt('contextmenu.submenu.icon.size');
        height: dt('contextmenu.submenu.icon.size');
    }

    .p-contextmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content {
        color: dt('contextmenu.item.active.color');
        background: dt('contextmenu.item.active.background');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.active.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.active.color');
    }

    .p-contextmenu-separator {
        border-block-start: 1px solid dt('contextmenu.separator.border.color');
    }

    .p-contextmenu-mobile .p-contextmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .p-contextmenu-mobile .p-contextmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-contextmenu-mobile .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`, li = {
  root: function(t) {
    var n = t.instance;
    return ["p-contextmenu p-component", {
      "p-contextmenu-mobile": n.queryMatches
    }];
  },
  rootList: "p-contextmenu-root-list",
  item: function(t) {
    var n = t.instance, r = t.processedItem;
    return ["p-contextmenu-item", {
      "p-contextmenu-item-active": n.isItemActive(r),
      "p-focus": n.isItemFocused(r),
      "p-disabled": n.isItemDisabled(r)
    }];
  },
  itemContent: "p-contextmenu-item-content",
  itemLink: "p-contextmenu-item-link",
  itemIcon: "p-contextmenu-item-icon",
  itemLabel: "p-contextmenu-item-label",
  submenuIcon: "p-contextmenu-submenu-icon",
  submenu: "p-contextmenu-submenu",
  separator: "p-contextmenu-separator"
};
O.extend({
  name: "contextmenu",
  style: ai,
  classes: li
});
var ui = `
.p-icon {
    display: inline-block;
    vertical-align: baseline;
    flex-shrink: 0;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`, di = O.extend({
  name: "baseicon",
  css: ui
});
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
function Vt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Dt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Vt(Object(n), !0).forEach(function(r) {
      ci(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Vt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ci(e, t, n) {
  return (t = mi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function mi(e) {
  var t = pi(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function pi(e, t) {
  if (Te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Te(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var fi = {
  name: "BaseIcon",
  extends: si,
  props: {
    label: {
      type: String,
      default: void 0
    },
    spin: {
      type: Boolean,
      default: !1
    }
  },
  style: di,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = F(this.label);
      return Dt(Dt({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: t ? void 0 : "img",
        "aria-label": t ? void 0 : this.label,
        "aria-hidden": t
      });
    }
  }
}, hi = {
  name: "AngleRightIcon",
  extends: fi
};
function gi(e) {
  return _i(e) || bi(e) || yi(e) || vi();
}
function vi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function yi(e, t) {
  if (e) {
    if (typeof e == "string") return et(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? et(e, t) : void 0;
  }
}
function bi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function _i(e) {
  if (Array.isArray(e)) return et(e);
}
function et(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Si(e, t, n, r, o, i) {
  return Qt(), ar("svg", ge({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), gi(t[0] || (t[0] = [lr("path", {
    d: "M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
hi.render = Si;
function Ce(e) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ce(e);
}
function Mt(e, t) {
  return Ci(e) || Ti(e, t) || wi(e, t) || $i();
}
function $i() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wi(e, t) {
  if (e) {
    if (typeof e == "string") return Bt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Bt(e, t) : void 0;
  }
}
function Bt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Ti(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, i, a, l = [], s = !0, u = !1;
    try {
      if (i = (n = n.call(e)).next, t !== 0) for (; !(s = (r = i.call(n)).done) && (l.push(r.value), l.length !== t); s = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return l;
  }
}
function Ci(e) {
  if (Array.isArray(e)) return e;
}
function Ut(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function w(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ut(Object(n), !0).forEach(function(r) {
      tt(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ut(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function tt(e, t, n) {
  return (t = Pi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Pi(e) {
  var t = Oi(e, "string");
  return Ce(t) == "symbol" ? t : t + "";
}
function Oi(e, t) {
  if (Ce(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ce(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var b = {
  _getMeta: function() {
    return [B(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], j(B(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var r, o, i;
    return (r = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (i = n.ctx) === null || i === void 0 || (i = i.appContext) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.globalProperties) === null || i === void 0 ? void 0 : i.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: st,
  _getPTValue: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, s = function() {
      var _ = b._getOptionValue.apply(b, arguments);
      return L(_) || cn(_) ? {
        class: _
      } : _;
    }, u = ((t = r.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, m = u.mergeProps, p = m === void 0 ? !1 : m, f = l ? b._useDefaultPT(r, r.defaultPT(), s, i, a) : void 0, v = b._usePT(r, b._getPT(o, r.$name), s, i, w(w({}, a), {}, {
      global: f || {}
    })), g = b._getPTDatasets(r, i);
    return c || !c && v ? p ? b._mergeProps(r, p, f, v, g) : w(w(w({}, f), v), g) : w(w({}, v), g);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return w(w({}, n === "root" && tt({}, "".concat(r, "name"), M(t.$name))), {}, tt({}, "".concat(r, "section"), M(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(a) {
      var l, s = r ? r(a) : a, u = M(n);
      return (l = s?.[u]) !== null && l !== void 0 ? l : s;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0, a = function(g) {
      return r(g, o, i);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, s = n._usept || ((l = t.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, u = s.mergeSections, d = u === void 0 ? !0 : u, c = s.mergeProps, m = c === void 0 ? !1 : c, p = a(n.originalValue), f = a(n.value);
      return p === void 0 && f === void 0 ? void 0 : L(f) ? f : L(p) ? p : d || !d && f ? m ? b._mergeProps(t, m, p, f) : w(w({}, p), f) : f;
    }
    return a(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0;
    return b._usePT(t, n, r, o, i);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, i = b._getConfig(r, o), a = {
      nonce: i == null || (t = i.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    b._loadCoreStyles(n, a), b._loadThemeStyles(n, a), b._loadScopedThemeStyles(n, a), b._removeThemeListeners(n), n.$loadStyles = function() {
      return b._loadThemeStyles(n, a);
    }, b._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!G.isStyleNameLoaded((t = r.$style) === null || t === void 0 ? void 0 : t.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var i;
      O.loadCSS(o), (i = r.$style) === null || i === void 0 || i.loadCSS(o), G.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!T.isStyleNameLoaded("common")) {
        var a, l, s = ((a = o.$style) === null || a === void 0 || (l = a.getCommonTheme) === null || l === void 0 ? void 0 : l.call(a)) || {}, u = s.primitive, d = s.semantic, c = s.global, m = s.style;
        O.load(u?.css, w({
          name: "primitive-variables"
        }, i)), O.load(d?.css, w({
          name: "semantic-variables"
        }, i)), O.load(c?.css, w({
          name: "global-variables"
        }, i)), O.loadStyle(w({
          name: "global-style"
        }, i), m), T.setLoadedStyleName("common");
      }
      if (!T.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var p, f, v, g, y = ((p = o.$style) === null || p === void 0 || (f = p.getDirectiveTheme) === null || f === void 0 ? void 0 : f.call(p)) || {}, _ = y.css, P = y.style;
        (v = o.$style) === null || v === void 0 || v.load(_, w({
          name: "".concat(o.$style.name, "-variables")
        }, i)), (g = o.$style) === null || g === void 0 || g.loadStyle(w({
          name: "".concat(o.$style.name, "-style")
        }, i), P), T.setLoadedStyleName(o.$style.name);
      }
      if (!T.isStyleNameLoaded("layer-order")) {
        var h, S, k = (h = o.$style) === null || h === void 0 || (S = h.getLayerOrderThemeCSS) === null || S === void 0 ? void 0 : S.call(h);
        O.load(k, w({
          name: "layer-order",
          first: !0
        }, i)), T.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = t.preset();
    if (r && t.$attrSelector) {
      var o, i, a, l = ((o = t.$style) === null || o === void 0 || (i = o.getPresetTheme) === null || i === void 0 ? void 0 : i.call(o, r, "[".concat(t.$attrSelector, "]"))) || {}, s = l.css, u = (a = t.$style) === null || a === void 0 ? void 0 : a.load(s, w({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    G.clearLoadedStyleNames(), E.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    E.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, r, o, i, a) {
    var l, s, u = "on".concat(Qr(n)), d = b._getConfig(o, i), c = r?.$instance, m = b._usePT(c, b._getPT(o == null || (l = o.value) === null || l === void 0 ? void 0 : l.pt, t), b._getOptionValue, "hooks.".concat(u)), p = b._useDefaultPT(c, d == null || (s = d.pt) === null || s === void 0 || (s = s.directives) === null || s === void 0 ? void 0 : s[t], b._getOptionValue, "hooks.".concat(u)), f = {
      el: r,
      binding: o,
      vnode: i,
      prevVnode: a
    };
    m?.(c, f), p?.(c, f);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return Ue(t) ? t.apply(void 0, r) : ge.apply(void 0, r);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(l, s, u, d, c) {
      var m, p, f, v;
      s._$instances = s._$instances || {};
      var g = b._getConfig(u, d), y = s._$instances[t] || {}, _ = F(y) ? w(w({}, n), n?.methods) : {};
      s._$instances[t] = w(w({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: s,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: y.$el || s || void 0,
        $style: w({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: g,
        $attrSelector: (m = s.$pd) === null || m === void 0 || (m = m[t]) === null || m === void 0 ? void 0 : m.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return b._getPT(g?.pt, void 0, function(h) {
            var S;
            return h == null || (S = h.directives) === null || S === void 0 ? void 0 : S[t];
          });
        },
        isUnstyled: function() {
          var h, S;
          return ((h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (S = s._$instances[t]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.unstyled : g?.unstyled;
        },
        theme: function() {
          var h;
          return (h = s._$instances[t]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return b._getPTValue(s._$instances[t], (h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, S, w({}, k));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", k = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return b._getPTValue(s._$instances[t], h, S, k, !1);
        },
        cx: function() {
          var h, S, k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", N = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = s._$instances[t]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : b._getOptionValue((S = s._$instances[t]) === null || S === void 0 || (S = S.$style) === null || S === void 0 ? void 0 : S.classes, k, w({}, N));
        },
        sx: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, N = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return k ? b._getOptionValue((h = s._$instances[t]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, S, w({}, N)) : void 0;
        }
      }, _), s.$instance = s._$instances[t], (p = (f = s.$instance)[l]) === null || p === void 0 || p.call(f, s, u, d, c), s["$".concat(t)] = s.$instance, b._hook(t, l, s, u, d, c), s.$pd || (s.$pd = {}), s.$pd[t] = w(w({}, (v = s.$pd) === null || v === void 0 ? void 0 : v[t]), {}, {
        name: t,
        instance: s._$instances[t]
      });
    }, o = function(l) {
      var s, u, d, c = l._$instances[t], m = c?.watch, p = function(g) {
        var y, _ = g.newValue, P = g.oldValue;
        return m == null || (y = m.config) === null || y === void 0 ? void 0 : y.call(c, _, P);
      }, f = function(g) {
        var y, _ = g.newValue, P = g.oldValue;
        return m == null || (y = m["config.ripple"]) === null || y === void 0 ? void 0 : y.call(c, _, P);
      };
      c.$watchersCallback = {
        config: p,
        "config.ripple": f
      }, m == null || (s = m.config) === null || s === void 0 || s.call(c, c?.$primevueConfig), J.on("config:change", p), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), J.on("config:ripple:change", f);
    }, i = function(l) {
      var s = l._$instances[t].$watchersCallback;
      s && (J.off("config:change", s.config), J.off("config:ripple:change", s["config.ripple"]), l._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(l, s, u, d) {
        l.$pd || (l.$pd = {}), l.$pd[t] = {
          name: t,
          attrSelector: ho("pd")
        }, r("created", l, s, u, d);
      },
      beforeMount: function(l, s, u, d) {
        var c;
        b._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), r("beforeMount", l, s, u, d), o(l);
      },
      mounted: function(l, s, u, d) {
        var c;
        b._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), r("mounted", l, s, u, d);
      },
      beforeUpdate: function(l, s, u, d) {
        r("beforeUpdate", l, s, u, d);
      },
      updated: function(l, s, u, d) {
        var c;
        b._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), r("updated", l, s, u, d);
      },
      beforeUnmount: function(l, s, u, d) {
        var c;
        i(l), b._removeThemeListeners((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance), r("beforeUnmount", l, s, u, d);
      },
      unmounted: function(l, s, u, d) {
        var c;
        (c = l.$pd[t]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), r("unmounted", l, s, u, d);
      }
    };
  },
  extend: function() {
    var t = b._getMeta.apply(b, arguments), n = Mt(t, 2), r = n[0], o = n[1];
    return w({
      extend: function() {
        var a = b._getMeta.apply(b, arguments), l = Mt(a, 2), s = l[0], u = l[1];
        return b.extend(s, w(w(w({}, o), o?.methods), u));
      }
    }, b._extend(r, o));
  }
}, xi = `
    .p-ink {
        display: block;
        position: absolute;
        background: dt('ripple.background');
        border-radius: 100%;
        transform: scale(0);
        pointer-events: none;
    }

    .p-ink-active {
        animation: ripple 0.4s linear;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`, ki = {
  root: "p-ink"
}, Ei = O.extend({
  name: "ripple-directive",
  style: xi,
  classes: ki
}), Ai = b.extend({
  style: Ei
});
function Pe(e) {
  "@babel/helpers - typeof";
  return Pe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pe(e);
}
function Li(e) {
  return Ri(e) || Ii(e) || Ni(e) || ji();
}
function ji() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ni(e, t) {
  if (e) {
    if (typeof e == "string") return nt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? nt(e, t) : void 0;
  }
}
function Ii(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ri(e) {
  if (Array.isArray(e)) return nt(e);
}
function nt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Wt(e, t, n) {
  return (t = Vi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Vi(e) {
  var t = Di(e, "string");
  return Pe(t) == "symbol" ? t : t + "";
}
function Di(e, t) {
  if (Pe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Pe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Js = Ai.extend("ripple", {
  watch: {
    "config.ripple": function(t) {
      t ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(t) {
    this.remove(t);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(t) {
      t.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(t) {
      t.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(t) {
      var n = this.getInk(t);
      n || (n = ao("span", Wt(Wt({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), t.appendChild(n), this.$el = n);
    },
    remove: function(t) {
      var n = this.getInk(t);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(t), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(t) {
      var n = this, r = t.currentTarget, o = this.getInk(r);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && ye(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !bt(o) && !_t(o)) {
          var i = Math.max(io(r), mo(r));
          o.style.height = i + "px", o.style.width = i + "px";
        }
        var a = co(r), l = t.pageX - a.left + document.body.scrollTop - _t(o) / 2, s = t.pageY - a.top + document.body.scrollLeft - bt(o) / 2;
        o.style.top = s + "px", o.style.left = l + "px", !this.isUnstyled() && qe(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && ye(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && ye(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? Li(t.children).find(function(n) {
        return uo(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function Oe(e) {
  "@babel/helpers - typeof";
  return Oe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Oe(e);
}
function Mi(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Bi(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, Wi(r.key), r);
  }
}
function Ui(e, t, n) {
  return t && Bi(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Wi(e) {
  var t = Hi(e, "string");
  return Oe(t) == "symbol" ? t : t + "";
}
function Hi(e, t) {
  if (Oe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Oe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Qs = /* @__PURE__ */ (function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    Mi(this, e), this.element = t, this.listener = n;
  }
  return Ui(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = po(this.element);
      for (var n = 0; n < this.scrollableParents.length; n++)
        this.scrollableParents[n].addEventListener("scroll", this.listener);
    }
  }, {
    key: "unbindScrollListener",
    value: function() {
      if (this.scrollableParents)
        for (var n = 0; n < this.scrollableParents.length; n++)
          this.scrollableParents[n].removeEventListener("scroll", this.listener);
    }
  }, {
    key: "destroy",
    value: function() {
      this.unbindScrollListener(), this.element = null, this.listener = null, this.scrollableParents = null;
    }
  }]);
})();
function xe(e) {
  "@babel/helpers - typeof";
  return xe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xe(e);
}
function Fi(e) {
  return qi(e) || Yi(e) || Ki(e) || zi();
}
function zi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ki(e, t) {
  if (e) {
    if (typeof e == "string") return rt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? rt(e, t) : void 0;
  }
}
function Yi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function qi(e) {
  if (Array.isArray(e)) return rt(e);
}
function rt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Gi(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Ji(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, En(r.key), r);
  }
}
function Qi(e, t, n) {
  return t && Ji(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Ht(e, t, n) {
  return (t = En(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function En(e) {
  var t = Zi(e, "string");
  return xe(t) == "symbol" ? t : t + "";
}
function Zi(e, t) {
  if (xe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (xe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Zs = /* @__PURE__ */ (function() {
  function e(t) {
    var n = t.init, r = t.type;
    Gi(this, e), Ht(this, "helpers", void 0), Ht(this, "type", void 0), this.helpers = new Set(n), this.type = r;
  }
  return Qi(e, [{
    key: "add",
    value: function(n) {
      this.helpers.add(n);
    }
  }, {
    key: "update",
    value: function() {
    }
  }, {
    key: "delete",
    value: function(n) {
      this.helpers.delete(n);
    }
  }, {
    key: "clear",
    value: function() {
      this.helpers.clear();
    }
  }, {
    key: "get",
    value: function(n, r) {
      var o = this._get(n, r), i = o ? this._recursive(Fi(this.helpers), o) : null;
      return C(i) ? i : null;
    }
  }, {
    key: "_isMatched",
    value: function(n, r) {
      var o, i = n?.parent;
      return (i == null || (o = i.vnode) === null || o === void 0 ? void 0 : o.key) === r || i && this._isMatched(i, r) || !1;
    }
  }, {
    key: "_get",
    value: function(n, r) {
      var o, i;
      return ((o = r || n?.$slots) === null || o === void 0 || (i = o.default) === null || i === void 0 ? void 0 : i.call(o)) || null;
    }
  }, {
    key: "_recursive",
    value: function() {
      var n = this, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], i = [];
      return o.forEach(function(a) {
        a.children instanceof Array ? i = i.concat(n._recursive(r, a.children)) : a.type.name === n.type ? i.push(a) : C(a.key) && (i = i.concat(r.filter(function(l) {
          return n._isMatched(l, a.key);
        }).map(function(l) {
          return l.vnode;
        })));
      }), i;
    }
  }]);
})();
function Xs(e, t) {
  if (e) {
    var n = e.props;
    if (n) {
      var r = t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), o = Object.prototype.hasOwnProperty.call(n, r) ? r : t;
      return e.type.extends.props[t].type === Boolean && n[o] === "" ? !0 : n[o];
    }
  }
  return null;
}
var ea = at(), Xi = `
    .p-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .p-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .p-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .p-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-menu-item-label {
        line-height: 1;
    }

    .p-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .p-menu-item.p-focus .p-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item.p-focus .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .p-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .p-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`, es = {
  root: function(t) {
    var n = t.props;
    return ["p-menu p-component", {
      "p-menu-overlay": n.popup
    }];
  },
  start: "p-menu-start",
  list: "p-menu-list",
  submenuLabel: "p-menu-submenu-label",
  separator: "p-menu-separator",
  end: "p-menu-end",
  item: function(t) {
    var n = t.instance;
    return ["p-menu-item", {
      "p-focus": n.id === n.focusedOptionId,
      "p-disabled": n.disabled()
    }];
  },
  itemContent: "p-menu-item-content",
  itemLink: "p-menu-item-link",
  itemIcon: "p-menu-item-icon",
  itemLabel: "p-menu-item-label"
};
O.extend({
  name: "menu",
  style: Xi,
  classes: es
});
const ts = "data-wippy-overlay-layer";
function An() {
  return typeof window < "u" && typeof window.document < "u";
}
function Ln() {
  return An() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ns() {
  return Ln() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const rs = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let os = 0;
const De = /* @__PURE__ */ new WeakMap();
function Ft(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function is(e, t) {
  if (!rs.test(e.className))
    return;
  const n = e.style.cssText;
  Ft(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!De.has(e)) {
    const r = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && Ft(e, t);
    });
    r.observe(e, { attributes: !0, attributeFilter: ["style"] }), De.set(e, r);
  }
}
function ut(e) {
  const t = De.get(e);
  t && (t.disconnect(), De.delete(e));
}
function ss(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function ot(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Me = /* @__PURE__ */ new Set(), dt = /* @__PURE__ */ new WeakMap();
let zt = !1, it = !1;
function as() {
  it = !1;
  for (const e of Me) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && ut(t);
      Me.delete(e), dt.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && ot(e);
  }
}
function Kt() {
  it || (it = !0, requestAnimationFrame(as));
}
function ls(e) {
  const t = document.createElement("div");
  t.setAttribute(ts, "");
  const n = Ln();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  ot(t);
  const r = new MutationObserver((o) => {
    const i = t.__wippyAnchorName;
    for (const a of o) {
      if (i)
        for (const l of Array.from(a.addedNodes))
          l instanceof HTMLElement && is(l, i);
      for (const l of Array.from(a.removedNodes))
        l instanceof HTMLElement && ut(l);
    }
    t.isConnected && t.childElementCount > 0 && ot(t);
  });
  return r.observe(t, { childList: !0 }), dt.set(t, r), Me.add(t), zt || (zt = !0, window.addEventListener("scroll", Kt, { capture: !0, passive: !0 }), window.addEventListener("resize", Kt, { passive: !0 })), t;
}
function Yt(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = ls(e.hostRoot), ns())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++os}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function qt(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && ut(t);
    Me.delete(e.layer), dt.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let Gt = !1;
function us() {
  if (Gt)
    return;
  Gt = !0;
  const e = Pn;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    An() && (this.hostRoot = ss(this.$el), this.mounted = !0, this.hostRoot && (this.inline || Yt(this), this.$watch("inline", (t) => {
      t ? qt(this) : Yt(this);
    })));
  }, e.render = function() {
    return this.inline ? Ie(this.$slots, "default", { key: 0 }) : this.mounted ? ur(Zt, { key: 1, to: this.resolvedTarget || document.body }, [
      Ie(this.$slots, "default")
    ]) : Xt("", !0);
  }, e.unmounted = function() {
    qt(this);
  };
}
const ta = {
  install: (e) => {
    us(), e.use(Zo, { theme: "none" });
  }
};
export {
  Us as $,
  qe as A,
  O as B,
  mo as C,
  Os as D,
  Ns as E,
  Gs as F,
  js as G,
  Is as H,
  ks as I,
  _s as J,
  co as K,
  Rs as L,
  bs as M,
  Cs as N,
  ea as O,
  ta as P,
  uo as Q,
  Js as R,
  xs as S,
  bt as T,
  ys as U,
  oo as V,
  gs as W,
  Ws as X,
  zs as Y,
  A as Z,
  fo as _,
  ps as a,
  qs as a0,
  Ss as a1,
  ws as a2,
  Xs as a3,
  Zs as a4,
  Vs as a5,
  Ds as a6,
  Bs as a7,
  hs as a8,
  b as a9,
  ao as aa,
  Hs as ab,
  Ps as ac,
  Ys as ad,
  Ts as ae,
  fn as af,
  As as b,
  fi as c,
  _t as d,
  C as e,
  Zr as f,
  Fs as g,
  Pn as h,
  gn as i,
  Qs as j,
  un as k,
  Ls as l,
  Es as m,
  Ms as n,
  F as o,
  Ye as p,
  hi as q,
  vs as r,
  si as s,
  lo as t,
  fs as u,
  io as v,
  $s as w,
  Ks as x,
  ye as y,
  hn as z
};
//# sourceMappingURL=wc-runtime-BQFBheae.js.map
