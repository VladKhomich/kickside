import { hasInjectionContext as An, inject as qe, effectScope as Nn, ref as W, markRaw as jn, createApp as Rn, onMounted as Rt, onUnmounted as Vn, watch as ue, readonly as In, getCurrentInstance as rt, nextTick as Mn, reactive as Dn, renderSlot as Ee, openBlock as Un, createBlock as Hn, Teleport as Vt, createCommentVNode as It, useId as Wn, mergeProps as ke, h as Bn } from "vue";
import { addCollection as Fn } from "@iconify/vue";
import { config as ot, addIcons as zn, on as Kn, applyThemeMode as Pe, host as Yn, hostCss as Gn, loadCss as qn } from "@wippy-fe/proxy";
var Ue = "data-wippy-visible";
function it(e) {
  const t = e.getAttribute(Ue);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Qn = Object.defineProperty, Jn = (e, t, n) => t in e ? Qn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, x = (e, t, n) => Jn(e, typeof t != "symbol" ? t + "" : t, n), Zn = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Xn = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function st(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function er(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [r, o] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [s, a] of Object.entries(o)) {
            const i = typeof a == "string" ? st(s) : null;
            i && t.add(i);
          }
          continue;
        }
        const l = typeof o == "string" ? st(r) : null;
        l && t.add(l);
      }
  return [...t].sort();
}
function tr(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Xn} {
${t}
}`;
}
function nr(e, t) {
  const n = tr(t);
  n && Mt(e, n, "@wippy-fe/css-variables-bridge");
}
function rr(e, t) {
  const r = (t ?? Zn).map(async (o) => {
    const l = Gn[o];
    if (!l)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await qn(l);
    } catch (s) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${l}):`, s), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const l of o) {
      if (!l)
        continue;
      const s = document.createElement("style");
      s.textContent = l, s.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(s);
    }
  });
}
function or(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function Mt(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = t, e.appendChild(r);
}
function ir(e, t) {
  Mt(e, t, "@wippy-fe/custom-css");
}
function Dt(e) {
  return e.__wippyHost ?? null;
}
function sr(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function ar(e, t, n) {
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
function Ve(e, t) {
  const n = {}, r = [];
  for (const [o, l] of Object.entries(t.properties)) {
    const s = e.getAttribute(o), a = sr(o);
    if (s === null) {
      l.default !== void 0 && (n[a] = l.default);
      continue;
    }
    const i = ar(o, s, l);
    i.error ? r.push(i.error) : n[a] = i.value;
  }
  return { props: n, errors: r };
}
var lr = class {
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
}, ur = class extends HTMLElement {
  constructor() {
    super(), x(this, "_internals"), x(this, "_contentObserver", null), x(this, "_initialized", !1), x(this, "_container", null), x(this, "_reactive", null), x(this, "_lastProps", null), x(this, "_lastErrors", []), x(this, "_lastContent", null), x(this, "_themeUnsub", null), x(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = it(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...n, Ue])];
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
    return Dt(this);
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
        const l = Ve(this, e.propsSchema);
        e.validateProps && l.errors.push(...e.validateProps(l.props)), n = l.props, r = l.errors, this._lastProps = n, this._lastErrors = r;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new lr(
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
        this.onInit(n), e.inlineCss && or(n, e.inlineCss);
        try {
          const u = ot?.theming, c = er(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          nr(n, c);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const u = ot?.theming, c = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            c && ir(n, c);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && rr(n, e.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const i = e.containerClasses ?? [];
        i.length > 0 && r.classList.add(...i), n.appendChild(r), this._container = r, zn(Fn);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Kn("@theme", (i) => this._applyTheme(i)));
      const { props: o, errors: l } = Ve(this, e.propsSchema);
      e.validateProps && l.push(...e.validateProps(o));
      const s = o;
      this._lastProps = s, this._lastErrors = l;
      let a = null;
      e.contentTemplate && (a = this._extractContent(e.contentTemplate), this._lastContent = a, this._contentObserver = new MutationObserver(() => {
        const i = this._extractContent(e.contentTemplate);
        this._lastContent = i, this._reactive?.notifyContent(i), this.onContentChanged(i);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, r, s, l, a, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Yn.getThemeMode?.()) {
    Pe(e, this), this._container && Pe(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Pe("auto", this), this._container && Pe("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === Ue) {
      const a = this._hostVisible, i = it(this);
      if (i === a)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, a), this.onHostVisibilityChanged(i, a));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: l } = Ve(this, r.propsSchema);
    r.validateProps && l.push(...r.validateProps(o));
    const s = o;
    this._lastProps = s, this._lastErrors = l, this._reactive?.notifyProps(s, l), this.onPropsChanged(s, l);
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
function cr(e) {
  return e.__wippyHostBus ?? null;
}
function dr(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let Ut;
const Ht = (e) => Ut = e, mr = () => An() && qe(Wt) || Ut, Wt = (
  /* istanbul ignore next */
  Symbol()
);
function pr() {
  const e = Nn(!0), t = e.run(() => W({}));
  let n = [], r = [];
  const o = jn({
    install(l) {
      Ht(o), o._a = l, l.provide(Wt, o), l.config.globalProperties.$pinia = o, r.forEach((s) => n.push(s)), r = [];
    },
    use(l) {
      return this._a ? n.push(l) : r.push(l), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return o;
}
var fr = Object.defineProperty, hr = (e, t, n) => t in e ? fr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ae = (e, t, n) => hr(e, typeof t != "symbol" ? t + "" : t, n), Bt = /* @__PURE__ */ Symbol("wippy:emit"), vr = /* @__PURE__ */ Symbol("wippy:props"), gr = /* @__PURE__ */ Symbol("wippy:props_error"), yr = /* @__PURE__ */ Symbol("wippy:content"), br = /* @__PURE__ */ Symbol("wippy:panel-id"), _r = /* @__PURE__ */ Symbol("wippy:layout-bus"), Sr = /* @__PURE__ */ Symbol("wippy:host"), Ft = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Si() {
  const e = qe(Bt);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function $r() {
  const e = qe(Ft);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function $i(e) {
  const t = $r();
  let n = !1, r = null, o = !1;
  function l() {
    if (r)
      return o = !0, r;
    let s;
    try {
      s = Promise.resolve(e());
    } catch (i) {
      s = Promise.reject(i);
    }
    const a = s.finally(() => {
      if (r === a && (r = null, n && o))
        return o = !1, l();
    });
    return r = a, a;
  }
  return Rt(() => (n = !0, l())), Vn(() => {
    n = !1, o = !1;
  }), ue(t, (s, a) => {
    if (n && a === !1 && s === !0)
      return l();
  }), t;
}
var wi = class extends ur {
  constructor() {
    super(...arguments), ae(this, "_vueApp", null), ae(this, "_propsRef", W({})), ae(this, "_errorsRef", W([])), ae(this, "_contentRef", W(null)), ae(this, "_hostVisibilityRef", W(null)), ae(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, r, o, l) {
    const s = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of r)
      this.emitEvent("invalid", { message: u });
    const a = new AbortController();
    this._bridgeAbort = a, this.reactive.props.subscribe((u, c) => {
      this._propsRef.value = u, this._errorsRef.value = [...c];
      for (const d of c)
        this.emitEvent("invalid", { message: d });
    }, { signal: a.signal }), this.reactive.content && this.reactive.content.subscribe((u) => {
      this._contentRef.value = u;
    }, { signal: a.signal }), this.reactive.hostVisibility.subscribe((u) => {
      this._hostVisibilityRef.value = u;
    }, { signal: a.signal });
    const i = (u) => {
      if (a.signal.aborted)
        return;
      const c = mr(), d = Rn(u.rootComponent);
      this._vueApp = d;
      const m = pr();
      if (u.piniaPlugins)
        for (const p of u.piniaPlugins)
          m.use(p);
      if (d.use(m), u.plugins)
        for (const p of u.plugins)
          d.use(p);
      d.provide(vr, this._propsRef), d.provide(gr, this._errorsRef), d.provide(Bt, this.emitEvent.bind(this)), d.provide(yr, this._contentRef), d.provide(Ft, this._hostVisibilityRef), d.provide(br, dr(this)), d.provide(_r, cr(this)), d.provide(Sr, Dt(this)), u.providers && u.providers(d, this), d.mount(t), c && Ht(c);
    };
    if (s.rootComponent)
      i(s);
    else if (s.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), t.appendChild(u), s.lazyConfig().then((c) => {
        a.signal.aborted || (u.remove(), i(c));
      }).catch((c) => {
        if (a.signal.aborted)
          return;
        const d = c instanceof Error ? c.message : String(c), m = document.createElement("wippy-error");
        m.setAttribute("title", "Failed to load"), m.setAttribute("message", d), u.replaceWith(m), this.emitEvent("error", { message: d });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, wr = Object.defineProperty, at = Object.getOwnPropertySymbols, Pr = Object.prototype.hasOwnProperty, Tr = Object.prototype.propertyIsEnumerable, lt = (e, t, n) => t in e ? wr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Or = (e, t) => {
  for (var n in t || (t = {})) Pr.call(t, n) && lt(e, n, t[n]);
  if (at) for (var n of at(t)) Tr.call(t, n) && lt(e, n, t[n]);
  return e;
};
function Re(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function Qe(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function C(e) {
  return !Re(e);
}
function D(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function zt(e = {}, t = {}) {
  let n = Or({}, e);
  return Object.keys(t).forEach((r) => {
    let o = r;
    D(t[o]) && o in e && D(e[o]) ? n[o] = zt(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function Cr(...e) {
  return e.reduce((t, n, r) => r === 0 ? n : zt(t, n), {});
}
function N(e, ...t) {
  return Qe(e) ? e(...t) : e;
}
function A(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function M(e) {
  return A(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function Je(e, t = "", n = {}) {
  let r = M(t).split("."), o = r.shift();
  if (o) {
    if (D(e)) {
      let l = Object.keys(e).find((s) => M(s) === o) || "";
      return Je(N(e[l], n), r.join("."), n);
    }
    return;
  }
  return N(e, n);
}
function Kt(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function xr(e) {
  return C(e) && !isNaN(e);
}
function te(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function kr(...e) {
  return Cr(...e);
}
function pe(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function Er(e) {
  return A(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Yt(e) {
  return A(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function Ze() {
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
function Lr(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Ar(e, t) {
  if (e && t) {
    let n = (r) => {
      Lr(e, r) || (e.classList ? e.classList.add(r) : e.className += " " + r);
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Ie(e, t) {
  if (e && t) {
    let n = (r) => {
      e.classList ? e.classList.remove(r) : e.className = e.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function He(e) {
  for (let t of document?.styleSheets) try {
    for (let n of t?.cssRules) for (let r of n?.style) if (e.test(r)) return { name: r, value: n.style.getPropertyValue(r).trim() };
  } catch {
  }
  return null;
}
function Gt(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [n, r] = [e.style.visibility, e.style.display], o = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = o.width || e.offsetWidth, t.height = o.height || e.offsetHeight, e.style.display = r, e.style.visibility = n;
  }
  return t;
}
function qt() {
  let e = window, t = document, n = t.documentElement, r = t.getElementsByTagName("body")[0], o = e.innerWidth || n.clientWidth || r.clientWidth, l = e.innerHeight || n.clientHeight || r.clientHeight;
  return { width: o, height: l };
}
function We(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function Nr() {
  let e = document.documentElement;
  return (window.pageXOffset || We(e)) - (e.clientLeft || 0);
}
function jr() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function Rr(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function Pi(e, t, n = !0) {
  var r, o, l, s;
  if (e) {
    let a = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : Gt(e), i = a.height, u = a.width, c = t.offsetHeight, d = t.offsetWidth, m = t.getBoundingClientRect(), p = jr(), f = Nr(), g = qt(), v, y, _ = "top";
    m.top + c + i > g.height ? (v = m.top + p - i, _ = "bottom", v < 0 && (v = p)) : v = c + m.top + p, m.left + u > g.width ? y = Math.max(0, m.left + f + d - u) : y = m.left + f, Rr(e) ? e.style.insetInlineEnd = y + "px" : e.style.insetInlineStart = y + "px", e.style.top = v + "px", e.style.transformOrigin = _, n && (e.style.marginTop = _ === "bottom" ? `calc(${(o = (r = He(/-anchor-gutter$/)) == null ? void 0 : r.value) != null ? o : "2px"} * -1)` : (s = (l = He(/-anchor-gutter$/)) == null ? void 0 : l.value) != null ? s : "");
  }
}
function Vr(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function Ti(e, t, n = !0, r = void 0) {
  var o;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : Gt(e), s = t.offsetHeight, a = t.getBoundingClientRect(), i = qt(), u, c, d = r ?? "top";
    if (!r && a.top + s + l.height > i.height ? (u = -1 * l.height, d = "bottom", a.top + u < 0 && (u = -1 * a.top)) : u = s, l.width > i.width ? c = a.left * -1 : a.left + l.width > i.width ? c = (a.left + l.width - i.width) * -1 : c = 0, e.style.top = u + "px", e.style.insetInlineStart = c + "px", e.style.transformOrigin = d, n) {
      let m = (o = He(/-anchor-gutter$/)) == null ? void 0 : o.value;
      e.style.marginTop = d === "bottom" ? `calc(${m ?? "2px"} * -1)` : m ?? "";
    }
  }
}
function Qt(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Ir(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && Qt(e));
}
function $e(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Le(e, t = {}) {
  if ($e(e)) {
    let n = (r, o) => {
      var l, s;
      let a = (l = e?.$attrs) != null && l[r] ? [(s = e?.$attrs) == null ? void 0 : s[r]] : [];
      return [o].flat().reduce((i, u) => {
        if (u != null) {
          let c = typeof u;
          if (c === "string" || c === "number") i.push(u);
          else if (c === "object") {
            let d = Array.isArray(u) ? n(r, u) : Object.entries(u).map(([m, p]) => r === "style" && (p || p === 0) ? `${m.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${p}` : p ? m : void 0);
            i = d.length ? i.concat(d.filter((m) => !!m)) : i;
          }
        }
        return i;
      }, a);
    };
    Object.entries(t).forEach(([r, o]) => {
      if (o != null) {
        let l = r.match(/^on(.+)/);
        l ? e.addEventListener(l[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? Le(e, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = o), e.setAttribute(r, o));
      }
    });
  }
}
function Mr(e, t = {}, ...n) {
  {
    let r = document.createElement(e);
    return Le(r, t), r.append(...n), r;
  }
}
function Jt(e, t) {
  return $e(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Dr(e, t) {
  if ($e(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function ut(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Ur(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || We(document.documentElement) || We(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Hr(e, t) {
  return e ? e.offsetHeight : 0;
}
function Zt(e, t = []) {
  let n = Qt(e);
  return n === null ? t : Zt(n, t.concat([n]));
}
function Wr(e) {
  let t = [];
  if (e) {
    let n = Zt(e), r = /(auto|scroll)/, o = (l) => {
      try {
        let s = window.getComputedStyle(l, null);
        return r.test(s.getPropertyValue("overflow")) || r.test(s.getPropertyValue("overflowX")) || r.test(s.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let l of n) {
      let s = l.nodeType === 1 && l.dataset.scrollselectors;
      if (s) {
        let a = s.split(",");
        for (let i of a) {
          let u = Jt(l, i);
          u && o(u) && t.push(u);
        }
      }
      l.nodeType !== 9 && o(l) && t.push(l);
    }
  }
  return t;
}
function ct(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function Xt() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Oi() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Br(e, t = "", n) {
  $e(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Te = {};
function Fr(e = "pui_id_") {
  return Object.hasOwn(Te, e) || (Te[e] = 0), Te[e]++, `${e}${Te[e]}`;
}
function zr() {
  let e = [], t = (s, a, i = 999) => {
    let u = o(s, a, i), c = u.value + (u.key === s ? 0 : i) + 1;
    return e.push({ key: s, value: c }), c;
  }, n = (s) => {
    e = e.filter((a) => a.value !== s);
  }, r = (s, a) => o(s).value, o = (s, a, i = 0) => [...e].reverse().find((u) => !0) || { key: s, value: i }, l = (s) => s && parseInt(s.style.zIndex, 10) || 0;
  return { get: l, set: (s, a, i) => {
    a && (a.style.zIndex = String(t(s, !0, i)));
  }, clear: (s) => {
    s && (n(l(s)), s.style.zIndex = "");
  }, getCurrent: (s) => r(s) };
}
var Ci = zr(), Kr = Object.defineProperty, Yr = Object.defineProperties, Gr = Object.getOwnPropertyDescriptors, Ae = Object.getOwnPropertySymbols, en = Object.prototype.hasOwnProperty, tn = Object.prototype.propertyIsEnumerable, dt = (e, t, n) => t in e ? Kr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, V = (e, t) => {
  for (var n in t || (t = {})) en.call(t, n) && dt(e, n, t[n]);
  if (Ae) for (var n of Ae(t)) tn.call(t, n) && dt(e, n, t[n]);
  return e;
}, Me = (e, t) => Yr(e, Gr(t)), H = (e, t) => {
  var n = {};
  for (var r in e) en.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Ae) for (var r of Ae(e)) t.indexOf(r) < 0 && tn.call(e, r) && (n[r] = e[r]);
  return n;
}, qr = Ze(), E = qr, fe = /{([^}]*)}/g, nn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, rn = /var\([^)]+\)/g;
function mt(e) {
  return A(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Qr(e) {
  return D(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Jr(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Be(e = "", t = "") {
  return Jr(`${A(e, !1) && A(t, !1) ? `${e}-` : e}${t}`);
}
function on(e = "", t = "") {
  return `--${Be(e, t)}`;
}
function Zr(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function sn(e, t = "", n = "", r = [], o) {
  if (A(e)) {
    let l = e.trim();
    if (Zr(l)) return;
    if (te(l, fe)) {
      let s = l.replaceAll(fe, (a) => {
        let i = a.replace(/{|}/g, "").split(".").filter((u) => !r.some((c) => te(u, c)));
        return `var(${on(n, Yt(i.join("-")))}${C(o) ? `, ${o}` : ""})`;
      });
      return te(s.replace(rn, "0"), nn) ? `calc(${s})` : s;
    }
    return l;
  } else if (xr(e)) return e;
}
function Xr(e, t, n) {
  A(t, !1) && e.push(`${t}:${n};`);
}
function le(e, t) {
  return e ? `${e}{${t}}` : "";
}
function an(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(s, a) {
    let i = [], u = 0, c = "", d = null, m = 0;
    for (; u <= s.length; ) {
      let p = s[u];
      if ((p === '"' || p === "'" || p === "`") && s[u - 1] !== "\\" && (d = d === p ? null : p), !d && (p === "(" && m++, p === ")" && m--, (p === "," || u === s.length) && m === 0)) {
        let f = c.trim();
        f.startsWith("dt(") ? i.push(an(f, a)) : i.push(r(f)), c = "", u++;
        continue;
      }
      p !== void 0 && (c += p), u++;
    }
    return i;
  }
  function r(s) {
    let a = s[0];
    if ((a === '"' || a === "'" || a === "`") && s[s.length - 1] === a) return s.slice(1, -1);
    let i = Number(s);
    return isNaN(i) ? s : i;
  }
  let o = [], l = [];
  for (let s = 0; s < e.length; s++) if (e[s] === "d" && e.slice(s, s + 3) === "dt(") l.push(s), s += 2;
  else if (e[s] === ")" && l.length > 0) {
    let a = l.pop();
    l.length === 0 && o.push([a, s]);
  }
  if (!o.length) return e;
  for (let s = o.length - 1; s >= 0; s--) {
    let [a, i] = o[s], u = e.slice(a + 3, i), c = n(u, t), d = t(...c);
    e = e.slice(0, a) + d + e.slice(i + 1);
  }
  return e;
}
var ne = (...e) => eo(P.getTheme(), ...e), eo = (e = {}, t, n, r) => {
  if (t) {
    let { variable: o, options: l } = P.defaults || {}, { prefix: s, transform: a } = e?.options || l || {}, i = te(t, fe) ? t : `{${t}}`;
    return r === "value" || Re(r) && a === "strict" ? P.getTokenValue(t) : sn(i, void 0, s, [o.excludedKeyRegex], n);
  }
  return "";
};
function Oe(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((r, o, l) => {
      var s;
      return r + o + ((s = N(t[l], { dt: ne })) != null ? s : "");
    }, "");
    return an(n, ne);
  }
  return N(e, { dt: ne });
}
function to(e, t = {}) {
  let n = P.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: l = n.excludedKeyRegex } = t, s = [], a = [], i = [{ node: e, path: r }];
  for (; i.length; ) {
    let { node: c, path: d } = i.pop();
    for (let m in c) {
      let p = c[m], f = Qr(p), g = te(m, l) ? Be(d) : Be(d, Yt(m));
      if (D(f)) i.push({ node: f, path: g });
      else {
        let v = on(g), y = sn(f, g, r, [l]);
        Xr(a, v, y);
        let _ = g;
        r && _.startsWith(r + "-") && (_ = _.slice(r.length + 1)), s.push(_.replace(/-/g, "."));
      }
    }
  }
  let u = a.join("");
  return { value: a, tokens: s, declarations: u, css: le(o, u) };
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
  return to(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l, s, a, i, u, c, d;
  let { preset: m, options: p } = t, f, g, v, y, _, T, h;
  if (C(m) && p.transform !== "strict") {
    let { primitive: S, semantic: k, extend: j } = m, B = k || {}, { colorScheme: F } = B, q = H(B, ["colorScheme"]), z = j || {}, { colorScheme: Q } = z, J = H(z, ["colorScheme"]), K = F || {}, { dark: Z } = K, re = H(K, ["dark"]), X = Q || {}, { dark: oe } = X, ie = H(X, ["dark"]), U = C(S) ? this._toVariables({ primitive: S }, p) : {}, I = C(q) ? this._toVariables({ semantic: q }, p) : {}, ee = C(re) ? this._toVariables({ light: re }, p) : {}, we = C(Z) ? this._toVariables({ dark: Z }, p) : {}, se = C(J) ? this._toVariables({ semantic: J }, p) : {}, tt = C(ie) ? this._toVariables({ light: ie }, p) : {}, nt = C(oe) ? this._toVariables({ dark: oe }, p) : {}, [fn, hn] = [(l = U.declarations) != null ? l : "", U.tokens], [vn, gn] = [(s = I.declarations) != null ? s : "", I.tokens || []], [yn, bn] = [(a = ee.declarations) != null ? a : "", ee.tokens || []], [_n, Sn] = [(i = we.declarations) != null ? i : "", we.tokens || []], [$n, wn] = [(u = se.declarations) != null ? u : "", se.tokens || []], [Pn, Tn] = [(c = tt.declarations) != null ? c : "", tt.tokens || []], [On, Cn] = [(d = nt.declarations) != null ? d : "", nt.tokens || []];
    f = this.transformCSS(e, fn, "light", "variable", p, r, o), g = hn;
    let xn = this.transformCSS(e, `${vn}${yn}`, "light", "variable", p, r, o), kn = this.transformCSS(e, `${_n}`, "dark", "variable", p, r, o);
    v = `${xn}${kn}`, y = [.../* @__PURE__ */ new Set([...gn, ...bn, ...Sn])];
    let En = this.transformCSS(e, `${$n}${Pn}color-scheme:light`, "light", "variable", p, r, o), Ln = this.transformCSS(e, `${On}color-scheme:dark`, "dark", "variable", p, r, o);
    _ = `${En}${Ln}`, T = [.../* @__PURE__ */ new Set([...wn, ...Tn, ...Cn])], h = N(m.css, { dt: ne });
  }
  return { primitive: { css: f, tokens: g }, semantic: { css: v, tokens: y }, global: { css: _, tokens: T }, style: h };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: r, set: o, defaults: l, selector: s }) {
  var a, i, u;
  let c, d, m;
  if (C(t) && n.transform !== "strict") {
    let p = e.replace("-directive", ""), f = t, { colorScheme: g, extend: v, css: y } = f, _ = H(f, ["colorScheme", "extend", "css"]), T = v || {}, { colorScheme: h } = T, S = H(T, ["colorScheme"]), k = g || {}, { dark: j } = k, B = H(k, ["dark"]), F = h || {}, { dark: q } = F, z = H(F, ["dark"]), Q = C(_) ? this._toVariables({ [p]: V(V({}, _), S) }, n) : {}, J = C(B) ? this._toVariables({ [p]: V(V({}, B), z) }, n) : {}, K = C(j) ? this._toVariables({ [p]: V(V({}, j), q) }, n) : {}, [Z, re] = [(a = Q.declarations) != null ? a : "", Q.tokens || []], [X, oe] = [(i = J.declarations) != null ? i : "", J.tokens || []], [ie, U] = [(u = K.declarations) != null ? u : "", K.tokens || []], I = this.transformCSS(p, `${Z}${X}`, "light", "variable", n, o, l, s), ee = this.transformCSS(p, ie, "dark", "variable", n, o, l, s);
    c = `${I}${ee}`, d = [.../* @__PURE__ */ new Set([...re, ...oe, ...U])], m = N(y, { dt: ne });
  }
  return { css: c, tokens: d, style: m };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l;
  let { preset: s, options: a } = t, i = (l = s?.components) == null ? void 0 : l[e];
  return this.getPreset({ name: e, preset: i, options: a, params: n, set: r, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l, s;
  let a = e.replace("-directive", ""), { preset: i, options: u } = t, c = ((l = i?.components) == null ? void 0 : l[a]) || ((s = i?.directives) == null ? void 0 : s[a]);
  return this.getPreset({ name: a, preset: c, options: u, params: n, set: r, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${N(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: l }) {
  let s = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: l }), a = Object.entries(r).reduce((i, [u, c]) => i.push(`${u}="${c}"`) && i, []).join(" ");
  return Object.entries(s || {}).reduce((i, [u, c]) => {
    if (D(c) && Object.hasOwn(c, "css")) {
      let d = pe(c.css), m = `${u}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${m}" ${a}>${d}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: l }) {
  var s;
  let a = { name: e, theme: t, params: n, set: o, defaults: l }, i = (s = e.includes("-directive") ? this.getPresetD(a) : this.getPresetC(a)) == null ? void 0 : s.css, u = Object.entries(r).reduce((c, [d, m]) => c.push(`${d}="${m}"`) && c, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${u}>${pe(i)}</style>` : "";
}, createTokens(e = {}, t, n = "", r = "", o = {}) {
  let l = function(a, i = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: a, path: this.path, paths: i, value: void 0 };
    u.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let c = this.value;
    if (typeof this.value == "string" && fe.test(this.value)) {
      let d = this.value.trim().replace(fe, (m) => {
        var p;
        let f = m.slice(1, -1), g = this.tokens[f];
        if (!g) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
        let v = g.computed(a, i, u);
        return Array.isArray(v) && v.length === 2 ? `light-dark(${v[0].value},${v[1].value})` : (p = v?.value) != null ? p : "__UNRESOLVED__";
      });
      c = nn.test(d.replace(rn, "0")) ? `calc(${d})` : d;
    }
    return Re(i.binding) && delete i.binding, u.pop(), { colorScheme: a, path: this.path, paths: i, value: c.includes("__UNRESOLVED__") ? void 0 : c };
  }, s = (a, i, u) => {
    Object.entries(a).forEach(([c, d]) => {
      let m = te(c, t.variable.excludedKeyRegex) ? i : i ? `${i}.${mt(c)}` : mt(c), p = u ? `${u}.${c}` : c;
      D(d) ? s(d, m, p) : (o[m] || (o[m] = { paths: [], computed: (f, g = {}, v = []) => {
        if (o[m].paths.length === 1) return o[m].paths[0].computed(o[m].paths[0].scheme, g.binding, v);
        if (f && f !== "none") for (let y = 0; y < o[m].paths.length; y++) {
          let _ = o[m].paths[y];
          if (_.scheme === f) return _.computed(f, g.binding, v);
        }
        return o[m].paths.map((y) => y.computed(y.scheme, g[y.scheme], v));
      } }), o[m].paths.push({ path: p, value: d, scheme: p.includes("colorScheme.light") ? "light" : p.includes("colorScheme.dark") ? "dark" : "none", computed: l, tokens: o }));
    });
  };
  return s(e, n, r), o;
}, getTokenValue(e, t, n) {
  var r;
  let o = ((a) => a.split(".").filter((i) => !te(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), l = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, s = [(r = e[o]) == null ? void 0 : r.computed(l)].flat().filter((a) => a);
  return s.length === 1 ? s[0].value : s.reduce((a = {}, i) => {
    let u = i, { colorScheme: c } = u, d = H(u, ["colorScheme"]);
    return a[c] = d, a;
  }, void 0);
}, getSelectorRule(e, t, n, r) {
  return n === "class" || n === "attr" ? le(C(t) ? `${e}${t},${e} ${t}` : e, r) : le(e, le(t ?? ":root,:host", r));
}, transformCSS(e, t, n, r, o = {}, l, s, a) {
  if (C(t)) {
    let { cssLayer: i } = o;
    if (r !== "style") {
      let u = this.getColorSchemeOption(o, s);
      t = n === "dark" ? u.reduce((c, { type: d, selector: m }) => (C(m) && (c += m.includes("[CSS]") ? m.replace("[CSS]", t) : this.getSelectorRule(m, a, d, t)), c), "") : le(a ?? ":root,:host", t);
    }
    if (i) {
      let u = { name: "primeui" };
      D(i) && (u.name = N(i.name, { name: e, type: r })), C(u.name) && (t = le(`@layer ${u.name}`, t), l?.layerNames(u.name));
    }
    return t;
  }
  return "";
} }, P = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = Me(V({}, t), { options: V(V({}, this.defaults.options), t.options) }), this._tokens = R.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this._theme = Me(V({}, this.theme), { preset: e }), this._tokens = R.createTokens(e, this.defaults), this.clearLoadedStyleNames(), E.emit("preset:change", e), E.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = Me(V({}, this.theme), { options: e }), this.clearLoadedStyleNames(), E.emit("options:change", e), E.emit("theme:change", this.theme);
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
} }, L = {
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
}, no = `
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
function he(e) {
  "@babel/helpers - typeof";
  return he = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, he(e);
}
function pt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function ft(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? pt(Object(n), !0).forEach(function(r) {
      ro(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ro(e, t, n) {
  return (t = oo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function oo(e) {
  var t = io(e, "string");
  return he(t) == "symbol" ? t : t + "";
}
function io(e, t) {
  if (he(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (he(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function so(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  rt() && rt().components ? Rt(e) : t ? e() : Mn(e);
}
var ao = 0;
function lo(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = W(!1), r = W(e), o = W(null), l = Xt() ? window.document : void 0, s = t.document, a = s === void 0 ? l : s, i = t.immediate, u = i === void 0 ? !0 : i, c = t.manual, d = c === void 0 ? !1 : c, m = t.name, p = m === void 0 ? "style_".concat(++ao) : m, f = t.id, g = f === void 0 ? void 0 : f, v = t.media, y = v === void 0 ? void 0 : v, _ = t.nonce, T = _ === void 0 ? void 0 : _, h = t.first, S = h === void 0 ? !1 : h, k = t.onMounted, j = k === void 0 ? void 0 : k, B = t.onUpdated, F = B === void 0 ? void 0 : B, q = t.onLoad, z = q === void 0 ? void 0 : q, Q = t.props, J = Q === void 0 ? {} : Q, K = function() {
  }, Z = function(oe) {
    var ie = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (a) {
      var U = ft(ft({}, J), ie), I = U.name || p, ee = U.id || g, we = U.nonce || T;
      o.value = a.querySelector('style[data-primevue-style-id="'.concat(I, '"]')) || a.getElementById(ee) || a.createElement("style"), o.value.isConnected || (r.value = oe || e, Le(o.value, {
        type: "text/css",
        id: ee,
        media: y,
        nonce: we
      }), S ? a.head.prepend(o.value) : a.head.appendChild(o.value), Br(o.value, "data-primevue-style-id", I), Le(o.value, U), o.value.onload = function(se) {
        return z?.(se, {
          name: I
        });
      }, j?.(I)), !n.value && (K = ue(r, function(se) {
        o.value.textContent = se, F?.(I);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, re = function() {
    !a || !n.value || (K(), Ir(o.value) && a.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return u && !d && so(Z), {
    id: g,
    name: p,
    el: o,
    css: r,
    unload: re,
    load: Z,
    isLoaded: In(n)
  };
}
function ve(e) {
  "@babel/helpers - typeof";
  return ve = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ve(e);
}
var ht, vt, gt, yt;
function bt(e, t) {
  return po(e) || mo(e, t) || co(e, t) || uo();
}
function uo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function co(e, t) {
  if (e) {
    if (typeof e == "string") return _t(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _t(e, t) : void 0;
  }
}
function _t(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function mo(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, s, a = [], i = !0, u = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(i = (r = l.call(n)).done) && (a.push(r.value), a.length !== t); i = !0) ;
    } catch (c) {
      u = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (u) throw o;
      }
    }
    return a;
  }
}
function po(e) {
  if (Array.isArray(e)) return e;
}
function St(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function De(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? St(Object(n), !0).forEach(function(r) {
      fo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : St(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function fo(e, t, n) {
  return (t = ho(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ho(e) {
  var t = vo(e, "string");
  return ve(t) == "symbol" ? t : t + "";
}
function vo(e, t) {
  if (ve(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ve(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ce(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var go = function(t) {
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
}, yo = {}, bo = {}, O = {
  name: "base",
  css: go,
  style: no,
  classes: yo,
  inlineStyles: bo,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(l) {
      return l;
    }, o = r(Oe(ht || (ht = Ce(["", ""])), t));
    return C(o) ? lo(pe(o), De({
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
      return P.transformCSS(n.name || t.name, "".concat(o).concat(Oe(vt || (vt = Ce(["", ""])), r)));
    });
  },
  getCommonTheme: function(t) {
    return P.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return P.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return P.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, r) {
    return P.getCustomPreset(this.name, t, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return P.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = N(this.css, {
        dt: ne
      }) || "", o = pe(Oe(gt || (gt = Ce(["", "", ""])), r, t)), l = Object.entries(n).reduce(function(s, a) {
        var i = bt(a, 2), u = i[0], c = i[1];
        return s.push("".concat(u, '="').concat(c, '"')) && s;
      }, []).join(" ");
      return C(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(l, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return P.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [P.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), l = Oe(yt || (yt = Ce(["", ""])), N(this.style, {
        dt: ne
      })), s = pe(P.transformCSS(o, l)), a = Object.entries(n).reduce(function(i, u) {
        var c = bt(u, 2), d = c[0], m = c[1];
        return i.push("".concat(d, '="').concat(m, '"')) && i;
      }, []).join(" ");
      C(s) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(a, ">").concat(s, "</style>"));
    }
    return r.join("");
  },
  extend: function(t) {
    return De(De({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, G = Ze();
function ge(e) {
  "@babel/helpers - typeof";
  return ge = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ge(e);
}
function $t(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function xe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $t(Object(n), !0).forEach(function(r) {
      _o(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : $t(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function _o(e, t, n) {
  return (t = So(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function So(e) {
  var t = $o(e, "string");
  return ge(t) == "symbol" ? t : t + "";
}
function $o(e, t) {
  if (ge(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ge(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var wo = {
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
    text: [L.STARTS_WITH, L.CONTAINS, L.NOT_CONTAINS, L.ENDS_WITH, L.EQUALS, L.NOT_EQUALS],
    numeric: [L.EQUALS, L.NOT_EQUALS, L.LESS_THAN, L.LESS_THAN_OR_EQUAL_TO, L.GREATER_THAN, L.GREATER_THAN_OR_EQUAL_TO],
    date: [L.DATE_IS, L.DATE_IS_NOT, L.DATE_BEFORE, L.DATE_AFTER]
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
}, Po = Symbol();
function To(e, t) {
  var n = {
    config: Dn(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(Po, n), Oo(), Co(e, n), n;
}
var ce = [];
function Oo() {
  E.clear(), ce.forEach(function(e) {
    return e?.();
  }), ce = [];
}
function Co(e, t) {
  var n = W(!1), r = function() {
    var u;
    if (((u = t.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !P.isStyleNameLoaded("common")) {
      var c, d, m = ((c = O.getCommonTheme) === null || c === void 0 ? void 0 : c.call(O)) || {}, p = m.primitive, f = m.semantic, g = m.global, v = m.style, y = {
        nonce: (d = t.config) === null || d === void 0 || (d = d.csp) === null || d === void 0 ? void 0 : d.nonce
      };
      O.load(p?.css, xe({
        name: "primitive-variables"
      }, y)), O.load(f?.css, xe({
        name: "semantic-variables"
      }, y)), O.load(g?.css, xe({
        name: "global-variables"
      }, y)), O.loadStyle(xe({
        name: "global-style"
      }, y), v), P.setLoadedStyleName("common");
    }
  };
  E.on("theme:change", function(i) {
    n.value || (e.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var o = ue(t.config, function(i, u) {
    G.emit("config:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = ue(function() {
    return t.config.ripple;
  }, function(i, u) {
    G.emit("config:ripple:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = ue(function() {
    return t.config.theme;
  }, function(i, u) {
    n.value || P.setTheme(i), t.config.unstyled || r(), n.value = !1, G.emit("config:theme:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), a = ue(function() {
    return t.config.unstyled;
  }, function(i, u) {
    !i && t.config.theme && r(), G.emit("config:unstyled:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ce.push(o), ce.push(l), ce.push(s), ce.push(a);
}
var xo = {
  install: function(t, n) {
    var r = kr(wo, n);
    To(t, r);
  }
}, ln = {
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
    this.mounted = Xt();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function ko(e, t, n, r, o, l) {
  return l.inline ? Ee(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (Un(), Hn(Vt, {
    key: 1,
    to: n.appendTo
  }, [Ee(e.$slots, "default")], 8, ["to"])) : It("", !0);
}
ln.render = ko;
var Y = {
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
function Eo() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = Wn();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var wt = O.extend({
  name: "common"
});
function ye(e) {
  "@babel/helpers - typeof";
  return ye = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ye(e);
}
function Lo(e) {
  return dn(e) || Ao(e) || cn(e) || un();
}
function Ao(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function de(e, t) {
  return dn(e) || No(e, t) || cn(e, t) || un();
}
function un() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function cn(e, t) {
  if (e) {
    if (typeof e == "string") return Fe(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Fe(e, t) : void 0;
  }
}
function Fe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function No(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, s, a = [], i = !0, u = !1;
    try {
      if (l = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        i = !1;
      } else for (; !(i = (r = l.call(n)).done) && (a.push(r.value), a.length !== t); i = !0) ;
    } catch (c) {
      u = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (u) throw o;
      }
    }
    return a;
  }
}
function dn(e) {
  if (Array.isArray(e)) return e;
}
function Pt(e, t) {
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
    t % 2 ? Pt(Object(n), !0).forEach(function(r) {
      me(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Pt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function me(e, t, n) {
  return (t = jo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function jo(e) {
  var t = Ro(e, "string");
  return ye(t) == "symbol" ? t : t + "";
}
function Ro(e, t) {
  if (ye(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ye(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var xi = {
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
    var t, n, r, o, l, s, a, i, u, c, d, m = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, p = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, f = m ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = f || p) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (l = o.onBeforeCreate) === null || l === void 0 || l.call(o);
    var g = (s = this.$primevueConfig) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s._usept, v = g ? (a = this.$primevue) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a.originalValue : void 0, y = g ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (c = y || v) === null || c === void 0 || (c = c[this.$.type.name]) === null || c === void 0 || (c = c.hooks) === null || c === void 0 || (d = c.onBeforeCreate) === null || d === void 0 || d.call(c), this.$attrSelector = Eo(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = Jt($e(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = $({
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
      return Qe(t) ? t.apply(void 0, r) : ke.apply(void 0, r);
    },
    _load: function() {
      Y.isStyleNameLoaded("base") || (O.loadCSS(this.$styleOptions), this._loadGlobalStyles(), Y.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !Y.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (wt.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), Y.setLoadedStyleName(this.$style.name));
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
        if (!P.isStyleNameLoaded("common")) {
          var r, o, l = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, s = l.primitive, a = l.semantic, i = l.global, u = l.style;
          O.load(s?.css, $({
            name: "primitive-variables"
          }, this.$styleOptions)), O.load(a?.css, $({
            name: "semantic-variables"
          }, this.$styleOptions)), O.load(i?.css, $({
            name: "global-variables"
          }, this.$styleOptions)), O.loadStyle($({
            name: "global-style"
          }, this.$styleOptions), u), P.setLoadedStyleName("common");
        }
        if (!P.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var c, d, m, p, f = ((c = this.$style) === null || c === void 0 || (d = c.getComponentTheme) === null || d === void 0 ? void 0 : d.call(c)) || {}, g = f.css, v = f.style;
          (m = this.$style) === null || m === void 0 || m.load(g, $({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (p = this.$style) === null || p === void 0 || p.loadStyle($({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), v), P.setLoadedStyleName(this.$style.name);
        }
        if (!P.isStyleNameLoaded("layer-order")) {
          var y, _, T = (y = this.$style) === null || y === void 0 || (_ = y.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(y);
          O.load(T, $({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), P.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, r, o, l = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, s = l.css, a = (o = this.$style) === null || o === void 0 ? void 0 : o.load(s, $({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = a.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      Y.clearLoadedStyleNames(), E.on("theme:change", t);
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
      return Je(t, n, r);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, s = /./g.test(r) && !!o[r.split(".")[0]], a = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, i = a.mergeSections, u = i === void 0 ? !0 : i, c = a.mergeProps, d = c === void 0 ? !1 : c, m = l ? s ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, p = s ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, $($({}, o), {}, {
        global: m || {}
      })), f = this._getPTDatasets(r);
      return u || !u && p ? d ? this._mergeProps(d, m, p, f) : $($($({}, m), p), f) : $($({}, p), f);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return ke(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", l = r === "root" && C((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return r !== "transition" && $($({}, r === "root" && $($(me({}, "".concat(o, "name"), M(l ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), l && me({}, "".concat(o, "extend"), M(this.$.type.name))), {}, me({}, "".concat(this.$attrSelector), ""))), {}, me({}, "".concat(o, "section"), M(r)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return A(t) || Kt(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, l = function(a) {
        var i, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, c = o ? o(a) : a, d = M(r), m = M(n.$name);
        return (i = u ? d !== m ? c?.[d] : void 0 : c?.[d]) !== null && i !== void 0 ? i : c;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: l(t.originalValue),
        value: l(t.value)
      } : l(t, !0);
    },
    _usePT: function(t, n, r, o) {
      var l = function(g) {
        return n(g, r, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var s, a = t._usept || ((s = this.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, i = a.mergeSections, u = i === void 0 ? !0 : i, c = a.mergeProps, d = c === void 0 ? !1 : c, m = l(t.originalValue), p = l(t.value);
        return m === void 0 && p === void 0 ? void 0 : A(p) ? p : A(m) ? m : u || !u && p ? d ? this._mergeProps(d, m, p) : $($({}, m), p) : p;
      }
      return l(t);
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
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = ke(this.$_attrsWithoutPT, this.ptm(n, r));
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
        var o = this._getOptionValue(this.$style.inlineStyles, t, $($({}, this.$params), r)), l = this._getOptionValue(wt.inlineStyles, t, $($({}, this.$params), r));
        return [l, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return N(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, $({}, n.$params)) || N(r, $({}, n.$params));
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
        var o = de(r, 1), l = o[0];
        return n?.includes(l);
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
        var n = de(t, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(t, n) {
        var r = de(n, 2), o = r[0], l = r[1], s = o.split(":"), a = Lo(s), i = Fe(a).slice(1);
        return i?.reduce(function(u, c, d, m) {
          return !u[c] && (u[c] = d === m.length - 1 ? l : {}), u[c];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = de(t, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(t, n) {
        var r = de(n, 2), o = r[0], l = r[1];
        return t[o] = l, t;
      }, {});
    }
  }
}, Vo = `
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
`, Io = {
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
  style: Vo,
  classes: Io
});
var Mo = `
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
`;
O.extend({
  name: "baseicon",
  css: Mo
});
function be(e) {
  "@babel/helpers - typeof";
  return be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, be(e);
}
function Tt(e, t) {
  return Wo(e) || Ho(e, t) || Uo(e, t) || Do();
}
function Do() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Uo(e, t) {
  if (e) {
    if (typeof e == "string") return Ot(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ot(e, t) : void 0;
  }
}
function Ot(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Ho(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, s, a = [], i = !0, u = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(i = (r = l.call(n)).done) && (a.push(r.value), a.length !== t); i = !0) ;
    } catch (c) {
      u = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (u) throw o;
      }
    }
    return a;
  }
}
function Wo(e) {
  if (Array.isArray(e)) return e;
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
function w(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ct(Object(n), !0).forEach(function(r) {
      ze(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ct(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ze(e, t, n) {
  return (t = Bo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Bo(e) {
  var t = Fo(e, "string");
  return be(t) == "symbol" ? t : t + "";
}
function Fo(e, t) {
  if (be(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (be(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var b = {
  _getMeta: function() {
    return [D(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], N(D(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var r, o, l;
    return (r = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (l = n.ctx) === null || l === void 0 || (l = l.appContext) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.globalProperties) === null || l === void 0 ? void 0 : l.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: Je,
  _getPTValue: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var _ = b._getOptionValue.apply(b, arguments);
      return A(_) || Kt(_) ? {
        class: _
      } : _;
    }, u = ((t = r.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, c = u.mergeSections, d = c === void 0 ? !0 : c, m = u.mergeProps, p = m === void 0 ? !1 : m, f = a ? b._useDefaultPT(r, r.defaultPT(), i, l, s) : void 0, g = b._usePT(r, b._getPT(o, r.$name), i, l, w(w({}, s), {}, {
      global: f || {}
    })), v = b._getPTDatasets(r, l);
    return d || !d && g ? p ? b._mergeProps(r, p, f, g, v) : w(w(w({}, f), g), v) : w(w({}, g), v);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return w(w({}, n === "root" && ze({}, "".concat(r, "name"), M(t.$name))), {}, ze({}, "".concat(r, "section"), M(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(s) {
      var a, i = r ? r(s) : s, u = M(n);
      return (a = i?.[u]) !== null && a !== void 0 ? a : i;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0, s = function(v) {
      return r(v, o, l);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var a, i = n._usept || ((a = t.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, u = i.mergeSections, c = u === void 0 ? !0 : u, d = i.mergeProps, m = d === void 0 ? !1 : d, p = s(n.originalValue), f = s(n.value);
      return p === void 0 && f === void 0 ? void 0 : A(f) ? f : A(p) ? p : c || !c && f ? m ? b._mergeProps(t, m, p, f) : w(w({}, p), f) : f;
    }
    return s(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0;
    return b._usePT(t, n, r, o, l);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, l = b._getConfig(r, o), s = {
      nonce: l == null || (t = l.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    b._loadCoreStyles(n, s), b._loadThemeStyles(n, s), b._loadScopedThemeStyles(n, s), b._removeThemeListeners(n), n.$loadStyles = function() {
      return b._loadThemeStyles(n, s);
    }, b._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!Y.isStyleNameLoaded((t = r.$style) === null || t === void 0 ? void 0 : t.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var l;
      O.loadCSS(o), (l = r.$style) === null || l === void 0 || l.loadCSS(o), Y.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, l = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!P.isStyleNameLoaded("common")) {
        var s, a, i = ((s = o.$style) === null || s === void 0 || (a = s.getCommonTheme) === null || a === void 0 ? void 0 : a.call(s)) || {}, u = i.primitive, c = i.semantic, d = i.global, m = i.style;
        O.load(u?.css, w({
          name: "primitive-variables"
        }, l)), O.load(c?.css, w({
          name: "semantic-variables"
        }, l)), O.load(d?.css, w({
          name: "global-variables"
        }, l)), O.loadStyle(w({
          name: "global-style"
        }, l), m), P.setLoadedStyleName("common");
      }
      if (!P.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var p, f, g, v, y = ((p = o.$style) === null || p === void 0 || (f = p.getDirectiveTheme) === null || f === void 0 ? void 0 : f.call(p)) || {}, _ = y.css, T = y.style;
        (g = o.$style) === null || g === void 0 || g.load(_, w({
          name: "".concat(o.$style.name, "-variables")
        }, l)), (v = o.$style) === null || v === void 0 || v.loadStyle(w({
          name: "".concat(o.$style.name, "-style")
        }, l), T), P.setLoadedStyleName(o.$style.name);
      }
      if (!P.isStyleNameLoaded("layer-order")) {
        var h, S, k = (h = o.$style) === null || h === void 0 || (S = h.getLayerOrderThemeCSS) === null || S === void 0 ? void 0 : S.call(h);
        O.load(k, w({
          name: "layer-order",
          first: !0
        }, l)), P.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = t.preset();
    if (r && t.$attrSelector) {
      var o, l, s, a = ((o = t.$style) === null || o === void 0 || (l = o.getPresetTheme) === null || l === void 0 ? void 0 : l.call(o, r, "[".concat(t.$attrSelector, "]"))) || {}, i = a.css, u = (s = t.$style) === null || s === void 0 ? void 0 : s.load(i, w({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    Y.clearLoadedStyleNames(), E.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    E.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, r, o, l, s) {
    var a, i, u = "on".concat(Er(n)), c = b._getConfig(o, l), d = r?.$instance, m = b._usePT(d, b._getPT(o == null || (a = o.value) === null || a === void 0 ? void 0 : a.pt, t), b._getOptionValue, "hooks.".concat(u)), p = b._useDefaultPT(d, c == null || (i = c.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[t], b._getOptionValue, "hooks.".concat(u)), f = {
      el: r,
      binding: o,
      vnode: l,
      prevVnode: s
    };
    m?.(d, f), p?.(d, f);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return Qe(t) ? t.apply(void 0, r) : ke.apply(void 0, r);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(a, i, u, c, d) {
      var m, p, f, g;
      i._$instances = i._$instances || {};
      var v = b._getConfig(u, c), y = i._$instances[t] || {}, _ = Re(y) ? w(w({}, n), n?.methods) : {};
      i._$instances[t] = w(w({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: i,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: y.$el || i || void 0,
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
        $primevueConfig: v,
        $attrSelector: (m = i.$pd) === null || m === void 0 || (m = m[t]) === null || m === void 0 ? void 0 : m.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return b._getPT(v?.pt, void 0, function(h) {
            var S;
            return h == null || (S = h.directives) === null || S === void 0 ? void 0 : S[t];
          });
        },
        isUnstyled: function() {
          var h, S;
          return ((h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (S = i._$instances[t]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.unstyled : v?.unstyled;
        },
        theme: function() {
          var h;
          return (h = i._$instances[t]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return b._getPTValue(i._$instances[t], (h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, S, w({}, k));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", k = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return b._getPTValue(i._$instances[t], h, S, k, !1);
        },
        cx: function() {
          var h, S, k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", j = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = i._$instances[t]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : b._getOptionValue((S = i._$instances[t]) === null || S === void 0 || (S = S.$style) === null || S === void 0 ? void 0 : S.classes, k, w({}, j));
        },
        sx: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, j = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return k ? b._getOptionValue((h = i._$instances[t]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, S, w({}, j)) : void 0;
        }
      }, _), i.$instance = i._$instances[t], (p = (f = i.$instance)[a]) === null || p === void 0 || p.call(f, i, u, c, d), i["$".concat(t)] = i.$instance, b._hook(t, a, i, u, c, d), i.$pd || (i.$pd = {}), i.$pd[t] = w(w({}, (g = i.$pd) === null || g === void 0 ? void 0 : g[t]), {}, {
        name: t,
        instance: i._$instances[t]
      });
    }, o = function(a) {
      var i, u, c, d = a._$instances[t], m = d?.watch, p = function(v) {
        var y, _ = v.newValue, T = v.oldValue;
        return m == null || (y = m.config) === null || y === void 0 ? void 0 : y.call(d, _, T);
      }, f = function(v) {
        var y, _ = v.newValue, T = v.oldValue;
        return m == null || (y = m["config.ripple"]) === null || y === void 0 ? void 0 : y.call(d, _, T);
      };
      d.$watchersCallback = {
        config: p,
        "config.ripple": f
      }, m == null || (i = m.config) === null || i === void 0 || i.call(d, d?.$primevueConfig), G.on("config:change", p), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(d, d == null || (c = d.$primevueConfig) === null || c === void 0 ? void 0 : c.ripple), G.on("config:ripple:change", f);
    }, l = function(a) {
      var i = a._$instances[t].$watchersCallback;
      i && (G.off("config:change", i.config), G.off("config:ripple:change", i["config.ripple"]), a._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(a, i, u, c) {
        a.$pd || (a.$pd = {}), a.$pd[t] = {
          name: t,
          attrSelector: Fr("pd")
        }, r("created", a, i, u, c);
      },
      beforeMount: function(a, i, u, c) {
        var d;
        b._loadStyles((d = a.$pd[t]) === null || d === void 0 ? void 0 : d.instance, i, u), r("beforeMount", a, i, u, c), o(a);
      },
      mounted: function(a, i, u, c) {
        var d;
        b._loadStyles((d = a.$pd[t]) === null || d === void 0 ? void 0 : d.instance, i, u), r("mounted", a, i, u, c);
      },
      beforeUpdate: function(a, i, u, c) {
        r("beforeUpdate", a, i, u, c);
      },
      updated: function(a, i, u, c) {
        var d;
        b._loadStyles((d = a.$pd[t]) === null || d === void 0 ? void 0 : d.instance, i, u), r("updated", a, i, u, c);
      },
      beforeUnmount: function(a, i, u, c) {
        var d;
        l(a), b._removeThemeListeners((d = a.$pd[t]) === null || d === void 0 ? void 0 : d.instance), r("beforeUnmount", a, i, u, c);
      },
      unmounted: function(a, i, u, c) {
        var d;
        (d = a.$pd[t]) === null || d === void 0 || (d = d.instance) === null || d === void 0 || (d = d.scopedStyleEl) === null || d === void 0 || (d = d.value) === null || d === void 0 || d.remove(), r("unmounted", a, i, u, c);
      }
    };
  },
  extend: function() {
    var t = b._getMeta.apply(b, arguments), n = Tt(t, 2), r = n[0], o = n[1];
    return w({
      extend: function() {
        var s = b._getMeta.apply(b, arguments), a = Tt(s, 2), i = a[0], u = a[1];
        return b.extend(i, w(w(w({}, o), o?.methods), u));
      }
    }, b._extend(r, o));
  }
}, zo = `
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
`, Ko = {
  root: "p-ink"
}, Yo = O.extend({
  name: "ripple-directive",
  style: zo,
  classes: Ko
}), Go = b.extend({
  style: Yo
});
function _e(e) {
  "@babel/helpers - typeof";
  return _e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _e(e);
}
function qo(e) {
  return Xo(e) || Zo(e) || Jo(e) || Qo();
}
function Qo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Jo(e, t) {
  if (e) {
    if (typeof e == "string") return Ke(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ke(e, t) : void 0;
  }
}
function Zo(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Xo(e) {
  if (Array.isArray(e)) return Ke(e);
}
function Ke(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function xt(e, t, n) {
  return (t = ei(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ei(e) {
  var t = ti(e, "string");
  return _e(t) == "symbol" ? t : t + "";
}
function ti(e, t) {
  if (_e(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (_e(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
Go.extend("ripple", {
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
      n || (n = Mr("span", xt(xt({
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
        if (!this.isUnstyled() && Ie(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !ut(o) && !ct(o)) {
          var l = Math.max(Vr(r), Hr(r));
          o.style.height = l + "px", o.style.width = l + "px";
        }
        var s = Ur(r), a = t.pageX - s.left + document.body.scrollTop - ct(o) / 2, i = t.pageY - s.top + document.body.scrollLeft - ut(o) / 2;
        o.style.top = i + "px", o.style.left = a + "px", !this.isUnstyled() && Ar(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && Ie(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Ie(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? qo(t.children).find(function(n) {
        return Dr(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function Se(e) {
  "@babel/helpers - typeof";
  return Se = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Se(e);
}
function ni(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function ri(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, ii(r.key), r);
  }
}
function oi(e, t, n) {
  return t && ri(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function ii(e) {
  var t = si(e, "string");
  return Se(t) == "symbol" ? t : t + "";
}
function si(e, t) {
  if (Se(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Se(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var ki = /* @__PURE__ */ (function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    ni(this, e), this.element = t, this.listener = n;
  }
  return oi(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = Wr(this.element);
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
})(), Ei = Ze(), ai = `
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
`, li = {
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
  style: ai,
  classes: li
});
const ui = "data-wippy-overlay-layer";
function mn() {
  return typeof window < "u" && typeof window.document < "u";
}
function pn() {
  return mn() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ci() {
  return pn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const di = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let mi = 0;
const Ne = /* @__PURE__ */ new WeakMap();
function kt(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function pi(e, t) {
  if (!di.test(e.className))
    return;
  const n = e.style.cssText;
  kt(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!Ne.has(e)) {
    const r = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && kt(e, t);
    });
    r.observe(e, { attributes: !0, attributeFilter: ["style"] }), Ne.set(e, r);
  }
}
function Xe(e) {
  const t = Ne.get(e);
  t && (t.disconnect(), Ne.delete(e));
}
function fi(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function Ye(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const je = /* @__PURE__ */ new Set(), et = /* @__PURE__ */ new WeakMap();
let Et = !1, Ge = !1;
function hi() {
  Ge = !1;
  for (const e of je) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && Xe(t);
      je.delete(e), et.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && Ye(e);
  }
}
function Lt() {
  Ge || (Ge = !0, requestAnimationFrame(hi));
}
function vi(e) {
  const t = document.createElement("div");
  t.setAttribute(ui, "");
  const n = pn();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Ye(t);
  const r = new MutationObserver((o) => {
    const l = t.__wippyAnchorName;
    for (const s of o) {
      if (l)
        for (const a of Array.from(s.addedNodes))
          a instanceof HTMLElement && pi(a, l);
      for (const a of Array.from(s.removedNodes))
        a instanceof HTMLElement && Xe(a);
    }
    t.isConnected && t.childElementCount > 0 && Ye(t);
  });
  return r.observe(t, { childList: !0 }), et.set(t, r), je.add(t), Et || (Et = !0, window.addEventListener("scroll", Lt, { capture: !0, passive: !0 }), window.addEventListener("resize", Lt, { passive: !0 })), t;
}
function At(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = vi(e.hostRoot), ci())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++mi}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function Nt(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && Xe(t);
    je.delete(e.layer), et.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let jt = !1;
function gi() {
  if (jt)
    return;
  jt = !0;
  const e = ln;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    mn() && (this.hostRoot = fi(this.$el), this.mounted = !0, this.hostRoot && (this.inline || At(this), this.$watch("inline", (t) => {
      t ? Nt(this) : At(this);
    })));
  }, e.render = function() {
    return this.inline ? Ee(this.$slots, "default", { key: 0 }) : this.mounted ? Bn(Vt, { key: 1, to: this.resolvedTarget || document.body }, [
      Ee(this.$slots, "default")
    ]) : It("", !0);
  }, e.unmounted = function() {
    Nt(this);
  };
}
const Li = {
  install: (e) => {
    gi(), e.use(xo, { theme: "none" });
  }
};
export {
  O as B,
  ki as C,
  Pi as D,
  Ti as I,
  Ei as O,
  Ie as P,
  wi as W,
  Oi as Y,
  C as a,
  ln as b,
  Ar as c,
  $i as d,
  Li as e,
  xi as s,
  Si as u,
  Ci as x
};
//# sourceMappingURL=wc-runtime-asymqT3f.js.map
