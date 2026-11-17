import { hasInjectionContext as Un, inject as Ut, effectScope as Wn, ref as z, markRaw as zn, createApp as Bn, onMounted as Wt, onUnmounted as Fn, watch as ue, readonly as Kn, getCurrentInstance as st, nextTick as Yn, reactive as Gn, renderSlot as Ne, openBlock as qn, createBlock as Qn, Teleport as zt, createCommentVNode as Bt, useId as Jn, mergeProps as Le, h as Zn } from "vue";
import { addCollection as Xn } from "@iconify/vue";
import { config as at, addIcons as er, on as tr, applyThemeMode as Te, host as nr, hostCss as rr, loadCss as or } from "@wippy-fe/proxy";
var ze = "data-wippy-visible";
function lt(e) {
  const t = e.getAttribute(ze);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var ir = Object.defineProperty, Ft = (e) => {
  throw TypeError(e);
}, sr = (e, t, n) => t in e ? ir(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t, n) => sr(e, typeof t != "symbol" ? t + "" : t, n), Kt = (e, t, n) => t.has(e) || Ft("Cannot " + n), ar = (e, t, n) => (Kt(e, t, "read from private field"), n ? n.call(e) : t.get(e)), lr = (e, t, n) => t.has(e) ? Ft("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), ur = (e, t, n, r) => (Kt(e, t, "write to private field"), t.set(e, n), n), cr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], dr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function ut(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function mr(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [r, o] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [a, s] of Object.entries(o)) {
            const i = typeof s == "string" ? ut(a) : null;
            i && t.add(i);
          }
          continue;
        }
        const l = typeof o == "string" ? ut(r) : null;
        l && t.add(l);
      }
  return [...t].sort();
}
function pr(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${dr} {
${t}
}`;
}
function fr(e, t) {
  const n = pr(t);
  n && Yt(e, n, "@wippy-fe/css-variables-bridge");
}
function hr(e, t) {
  const r = (t ?? cr).map(async (o) => {
    const l = rr[o];
    if (!l)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await or(l);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${l}):`, a), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const l of o) {
      if (!l)
        continue;
      const a = document.createElement("style");
      a.textContent = l, a.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(a);
    }
  });
}
function vr(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function Yt(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = t, e.appendChild(r);
}
function gr(e, t) {
  Yt(e, t, "@wippy-fe/custom-css");
}
function Gt(e) {
  return e.__wippyHost ?? null;
}
function yr(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function br(e, t, n) {
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
function De(e, t) {
  const n = {}, r = [];
  for (const [o, l] of Object.entries(t.properties)) {
    const a = e.getAttribute(o), s = yr(o);
    if (a === null) {
      l.default !== void 0 && (n[s] = l.default);
      continue;
    }
    const i = br(o, a, l);
    i.error ? r.push(i.error) : n[s] = i.value;
  }
  return { props: n, errors: r };
}
var _r = class {
  constructor(e, t) {
    C(this, "_props"), C(this, "_errors"), C(this, "_content"), C(this, "_hostVisibility"), C(this, "_propsListeners", /* @__PURE__ */ new Set()), C(this, "_contentListeners", /* @__PURE__ */ new Set()), C(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), C(this, "_disposed", !1), C(this, "_emitToDom"), C(this, "props"), C(this, "events"), C(this, "content"), C(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
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
}, Ae, Sr = class extends HTMLElement {
  constructor() {
    super(), C(this, "_internals"), C(this, "_contentObserver", null), C(this, "_initialized", !1), C(this, "_container", null), lr(this, Ae, null), C(this, "_attachment", 0), C(this, "_reactive", null), C(this, "_lastProps", null), C(this, "_lastErrors", []), C(this, "_lastContent", null), C(this, "_themeUnsub", null), C(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = lt(this);
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
    return Gt(this);
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
        const l = De(this, e.propsSchema);
        e.validateProps && l.errors.push(...e.validateProps(l.props)), n = l.props, r = l.errors, this._lastProps = n, this._lastErrors = r;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new _r(
        { props: n, errors: r, content: o, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    const e = ++this._attachment;
    this._internals.states.add("loading");
    try {
      const t = this.constructor.wippyConfig, n = this._initialized, r = ar(this, Ae) ?? ur(this, Ae, this.shadowRoot ?? this.attachShadow({ mode: t.shadowMode ?? "open" }));
      let o;
      if (this._container)
        o = this._container;
      else {
        if (this.onInit(r), e !== this._attachment)
          return;
        t.inlineCss && vr(r, t.inlineCss);
        try {
          const d = at?.theming, c = mr(
            d?.global?.cssVariables,
            d?.children?.cssVariables
          );
          fr(r, c);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const d = at?.theming, c = [d?.global?.customCSS, d?.children?.customCSS].filter(Boolean).join(`
`);
            c && gr(r, c);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && hr(r, t.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const u = t.containerClasses ?? [];
        u.length > 0 && o.classList.add(...u), r.appendChild(o), this._container = o, er(Xn);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = tr("@theme", (u) => this._applyTheme(u)));
      const { props: l, errors: a } = De(this, t.propsSchema);
      t.validateProps && a.push(...t.validateProps(l));
      const s = l;
      this._lastProps = s, this._lastErrors = a;
      let i = null;
      if (t.contentTemplate && (i = this._extractContent(t.contentTemplate), this._lastContent = i, this._contentObserver = new MutationObserver(() => {
        const u = this._extractContent(t.contentTemplate);
        this._lastContent = u, this._reactive?.notifyContent(u), this.onContentChanged(u);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, o, s, a, i, n), e !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), n || (this._initialized = !0), this.onReady(), e === this._attachment && this.emitEvent("load");
    } catch (t) {
      if (e !== this._attachment || (this.onError(t), e !== this._attachment))
        return;
      this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: t instanceof Error ? t.message : String(t),
        error: t
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
  _applyTheme(e = nr.getThemeMode?.()) {
    Te(e, this), this._container && Te(e, this._container);
  }
  disconnectedCallback() {
    const e = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Te("auto", this), this._container && Te("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), e === this._attachment && (this.emitEvent("unload"), e === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === ze) {
      const s = this._hostVisible, i = lt(this);
      if (i === s)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, s), this.onHostVisibilityChanged(i, s));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: l } = De(this, r.propsSchema);
    r.validateProps && l.push(...r.validateProps(o));
    const a = o;
    this._lastProps = a, this._lastErrors = l, this._reactive?.notifyProps(a, l), this.onPropsChanged(a, l);
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
   *
   * A template keeps its children in one of two places. Parsed HTML (page
   * markup, `innerHTML`) puts them in `template.content`, a DocumentFragment.
   * DOM APIs add them as the template element's own child nodes and leave
   * `template.content` empty: that is how a Vue SFC sets
   * `<template data-type="...">{{ text }}</template>`. The content fragment is
   * read first, then the element's own children. Only text is returned, never
   * markup, in both cases.
   */
  _extractContent(e) {
    const t = this.querySelector(`template[data-type="${e}"]`);
    return t ? t.content.textContent?.trim() || t.textContent?.trim() || "" : null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(e) {
  }
};
Ae = /* @__PURE__ */ new WeakMap();
function $r(e) {
  return e.__wippyHostBus ?? null;
}
function wr(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let qt;
const Qt = (e) => qt = e, Tr = () => Un() && Ut(Jt) || qt, Jt = (
  /* istanbul ignore next */
  Symbol()
);
function Pr() {
  const e = Wn(!0), t = e.run(() => z({}));
  let n = [], r = [];
  const o = zn({
    install(l) {
      Qt(o), o._a = l, l.provide(Jt, o), l.config.globalProperties.$pinia = o, r.forEach((a) => n.push(a)), r = [];
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
var Cr = Object.defineProperty, Or = (e, t, n) => t in e ? Cr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, U = (e, t, n) => Or(e, typeof t != "symbol" ? t + "" : t, n);
function Vi(e, t) {
  return { lazyConfig: e, mountLifecycle: !0, lazyUi: t };
}
function ct(e, t, n) {
  const r = e.createElement("div"), o = n ? t.failed : t.loading;
  r.dataset.lazyState = n ? "failed" : "loading", r.setAttribute("role", n ? "alert" : "status"), r.setAttribute("aria-label", o), r.style.cssText = "display:grid;place-items:center;text-align:center;";
  const l = t.surface === "page";
  if (r.style.cssText += l ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", n)
    r.style.color = "var(--p-danger-500, currentColor)", r.textContent = !l && t.iconOnly ? "⚠" : o, !l && t.iconOnly && (r.title = o);
  else {
    const a = e.createElement("style");
    a.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const s = e.createElement("span");
    s.dataset.wippySpinner = "", s.setAttribute("aria-hidden", "true"), s.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", s.style.fontSize = l ? "2rem" : "1em", r.append(a, s);
  }
  return r;
}
var xr = /* @__PURE__ */ Symbol("wippy:emit"), kr = /* @__PURE__ */ Symbol("wippy:props"), Er = /* @__PURE__ */ Symbol("wippy:props_error"), Lr = /* @__PURE__ */ Symbol("wippy:content"), Ar = /* @__PURE__ */ Symbol("wippy:panel-id"), Nr = /* @__PURE__ */ Symbol("wippy:layout-bus"), jr = /* @__PURE__ */ Symbol("wippy:host"), Zt = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Rr() {
  const e = Ut(Zt);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function Ii(e) {
  const t = Rr();
  let n = !1, r = null, o = !1;
  function l() {
    if (r)
      return o = !0, r;
    let a;
    try {
      a = Promise.resolve(e());
    } catch (i) {
      a = Promise.reject(i);
    }
    const s = a.finally(() => {
      if (r === s && (r = null, n && o))
        return o = !1, l();
    });
    return r = s, s;
  }
  return Wt(() => (n = !0, l())), Fn(() => {
    n = !1, o = !1;
  }), ue(t, (a, s) => {
    if (n && s === !1 && a === !0)
      return l();
  }), t;
}
var Pe = /* @__PURE__ */ new WeakMap();
function dt(e, t) {
  const n = Pe.get(e);
  if (n)
    return n;
  const r = Promise.resolve().then(t);
  return Pe.set(e, r), r.catch(() => {
    Pe.get(e) === r && Pe.delete(e);
  }), r;
}
var Mi = class extends Sr {
  constructor() {
    super(...arguments), U(this, "_vueApp", null), U(this, "_mountingApp", !1), U(this, "_mountState", "idle"), U(this, "_feedback", null), U(this, "_propsRef", z({})), U(this, "_errorsRef", z([])), U(this, "_contentRef", z(null)), U(this, "_hostVisibilityRef", z(null)), U(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  /** Prepare the implementation without creating a Vue or Pinia instance. */
  static async preloadImplementation() {
    const e = this.vueConfig;
    e.mountLifecycle && !e.rootComponent && e.lazyConfig && await dt(this, e.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(e, t, n, r, o, l) {
    const a = this.constructor, s = a.vueConfig, i = new AbortController();
    this._bridgeAbort = i;
    const u = () => !i.signal.aborted && this._bridgeAbort === i;
    this._mountState = "mounting", this._propsRef.value = n, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const c of r)
      if (this.emitEvent("invalid", { message: c }), !u())
        return;
    this.reactive.props.subscribe((c, m) => {
      this._propsRef.value = c, this._errorsRef.value = [...m];
      for (const p of m)
        this.emitEvent("invalid", { message: p });
    }, { signal: i.signal }), this.reactive.content && this.reactive.content.subscribe((c) => {
      this._contentRef.value = c;
    }, { signal: i.signal }), this.reactive.hostVisibility.subscribe((c) => {
      this._hostVisibilityRef.value = c;
    }, { signal: i.signal });
    const d = (c) => {
      if (!u())
        return;
      const m = Tr(), p = Bn(c.rootComponent);
      let f = !1, g = !1, v, y;
      this._mountingApp = !0;
      try {
        const _ = Pr();
        if (c.piniaPlugins)
          for (const $ of c.piniaPlugins)
            _.use($);
        p.use(_);
        for (const $ of c.plugins ?? [])
          p.use($);
        if (p.provide(kr, this._propsRef), p.provide(Er, this._errorsRef), p.provide(xr, this.emitEvent.bind(this)), p.provide(Lr, this._contentRef), p.provide(Zt, this._hostVisibilityRef), p.provide(Ar, wr(this)), p.provide(Nr, $r(this)), p.provide(jr, Gt(this)), c.providers?.(p, this), !u())
          return;
        if (y = p.config.errorHandler, s.mountLifecycle && (p.config.errorHandler = ($, h, b) => {
          g || (v = $), g = !0, y?.($, h, b);
        }), p.mount(t), f = !0, g)
          throw v;
        u() && (this._vueApp = p);
      } finally {
        s.mountLifecycle && f && (p.config.errorHandler = y);
        try {
          f && (g || !u()) && p.unmount();
        } finally {
          Qt(m), this._mountingApp = !1;
        }
      }
      s.mountLifecycle && queueMicrotask(() => {
        u() && this.isConnected && (this._mountState = "mounted", this.dispatchEvent(new Event("wippy-mounted")));
      });
    };
    if (s.rootComponent) {
      if (this._mountingApp && s.mountLifecycle) {
        queueMicrotask(() => {
          try {
            d(s);
          } catch (c) {
            u() && (this._mountState = "failed", this.emitEvent("error", { message: c instanceof Error ? c.message : String(c), error: c }));
          }
        });
        return;
      }
      try {
        d(s);
      } catch (c) {
        if (u())
          throw this._mountState = "failed", c;
      }
    } else if (s.lazyConfig) {
      const c = t.ownerDocument, m = s.lazyUi;
      m?.surface === "page" && (t.style.blockSize = "100%", t.style.minBlockSize = "0");
      let p = !1, f, g;
      const v = () => {
        clearTimeout(f), clearTimeout(g), this._feedback?.remove(), this._feedback = null;
      };
      i.signal.addEventListener("abort", v, { once: !0 });
      const y = () => {
        if (!u() || p)
          return;
        const b = m ? ct(c, m, !1) : c.createElement("wippy-loading");
        b.setAttribute("no-bg", ""), this._feedback = b, t.appendChild(b);
      }, _ = (b) => {
        if (!u())
          return;
        p = !0, v(), this._mountState = "failed";
        const k = m?.failed ?? (b instanceof Error ? b.message : String(b)), E = m ? ct(c, m, !0) : c.createElement("wippy-error");
        m || (E.setAttribute("title", "Failed to load"), E.setAttribute("message", k)), this._feedback = E, t.appendChild(E), this.emitEvent("error", m ? { message: k, error: b } : { message: k });
      }, $ = m?.delay ?? (m?.surface === "compact" ? 200 : 0);
      $ > 0 ? f = setTimeout(y, $) : y(), m && (g = setTimeout(() => _(new Error("The component did not load in time.")), m.timeout ?? 3e4)), (s.mountLifecycle ? dt(a, s.lazyConfig) : s.lazyConfig()).then((b) => {
        !u() || p || (p = !0, v(), d(b));
      }, (b) => {
        p || _(b);
      }).catch(_);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const e = this._vueApp;
    this._vueApp = null, e?.unmount();
  }
}, Vr = Object.defineProperty, mt = Object.getOwnPropertySymbols, Ir = Object.prototype.hasOwnProperty, Mr = Object.prototype.propertyIsEnumerable, pt = (e, t, n) => t in e ? Vr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Dr = (e, t) => {
  for (var n in t || (t = {})) Ir.call(t, n) && pt(e, n, t[n]);
  if (mt) for (var n of mt(t)) Mr.call(t, n) && pt(e, n, t[n]);
  return e;
};
function Me(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function Xe(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function x(e) {
  return !Me(e);
}
function D(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Xt(e = {}, t = {}) {
  let n = Dr({}, e);
  return Object.keys(t).forEach((r) => {
    let o = r;
    D(t[o]) && o in e && D(e[o]) ? n[o] = Xt(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function Hr(...e) {
  return e.reduce((t, n, r) => r === 0 ? n : Xt(t, n), {});
}
function j(e, ...t) {
  return Xe(e) ? e(...t) : e;
}
function N(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function M(e) {
  return N(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function et(e, t = "", n = {}) {
  let r = M(t).split("."), o = r.shift();
  if (o) {
    if (D(e)) {
      let l = Object.keys(e).find((a) => M(a) === o) || "";
      return et(j(e[l], n), r.join("."), n);
    }
    return;
  }
  return j(e, n);
}
function en(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function Ur(e) {
  return x(e) && !isNaN(e);
}
function ne(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function Wr(...e) {
  return Hr(...e);
}
function pe(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function zr(e) {
  return N(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function tn(e) {
  return N(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function tt() {
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
function Br(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Fr(e, t) {
  if (e && t) {
    let n = (r) => {
      Br(e, r) || (e.classList ? e.classList.add(r) : e.className += " " + r);
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function He(e, t) {
  if (e && t) {
    let n = (r) => {
      e.classList ? e.classList.remove(r) : e.className = e.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Be(e) {
  for (let t of document?.styleSheets) try {
    for (let n of t?.cssRules) for (let r of n?.style) if (e.test(r)) return { name: r, value: n.style.getPropertyValue(r).trim() };
  } catch {
  }
  return null;
}
function nn(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [n, r] = [e.style.visibility, e.style.display], o = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = o.width || e.offsetWidth, t.height = o.height || e.offsetHeight, e.style.display = r, e.style.visibility = n;
  }
  return t;
}
function rn() {
  let e = window, t = document, n = t.documentElement, r = t.getElementsByTagName("body")[0], o = e.innerWidth || n.clientWidth || r.clientWidth, l = e.innerHeight || n.clientHeight || r.clientHeight;
  return { width: o, height: l };
}
function Fe(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function Kr() {
  let e = document.documentElement;
  return (window.pageXOffset || Fe(e)) - (e.clientLeft || 0);
}
function Yr() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function Gr(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function Di(e, t, n = !0) {
  var r, o, l, a;
  if (e) {
    let s = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : nn(e), i = s.height, u = s.width, d = t.offsetHeight, c = t.offsetWidth, m = t.getBoundingClientRect(), p = Yr(), f = Kr(), g = rn(), v, y, _ = "top";
    m.top + d + i > g.height ? (v = m.top + p - i, _ = "bottom", v < 0 && (v = p)) : v = d + m.top + p, m.left + u > g.width ? y = Math.max(0, m.left + f + c - u) : y = m.left + f, Gr(e) ? e.style.insetInlineEnd = y + "px" : e.style.insetInlineStart = y + "px", e.style.top = v + "px", e.style.transformOrigin = _, n && (e.style.marginTop = _ === "bottom" ? `calc(${(o = (r = Be(/-anchor-gutter$/)) == null ? void 0 : r.value) != null ? o : "2px"} * -1)` : (a = (l = Be(/-anchor-gutter$/)) == null ? void 0 : l.value) != null ? a : "");
  }
}
function qr(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function Hi(e, t, n = !0, r = void 0) {
  var o;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : nn(e), a = t.offsetHeight, s = t.getBoundingClientRect(), i = rn(), u, d, c = r ?? "top";
    if (!r && s.top + a + l.height > i.height ? (u = -1 * l.height, c = "bottom", s.top + u < 0 && (u = -1 * s.top)) : u = a, l.width > i.width ? d = s.left * -1 : s.left + l.width > i.width ? d = (s.left + l.width - i.width) * -1 : d = 0, e.style.top = u + "px", e.style.insetInlineStart = d + "px", e.style.transformOrigin = c, n) {
      let m = (o = Be(/-anchor-gutter$/)) == null ? void 0 : o.value;
      e.style.marginTop = c === "bottom" ? `calc(${m ?? "2px"} * -1)` : m ?? "";
    }
  }
}
function on(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Qr(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && on(e));
}
function $e(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function je(e, t = {}) {
  if ($e(e)) {
    let n = (r, o) => {
      var l, a;
      let s = (l = e?.$attrs) != null && l[r] ? [(a = e?.$attrs) == null ? void 0 : a[r]] : [];
      return [o].flat().reduce((i, u) => {
        if (u != null) {
          let d = typeof u;
          if (d === "string" || d === "number") i.push(u);
          else if (d === "object") {
            let c = Array.isArray(u) ? n(r, u) : Object.entries(u).map(([m, p]) => r === "style" && (p || p === 0) ? `${m.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${p}` : p ? m : void 0);
            i = c.length ? i.concat(c.filter((m) => !!m)) : i;
          }
        }
        return i;
      }, s);
    };
    Object.entries(t).forEach(([r, o]) => {
      if (o != null) {
        let l = r.match(/^on(.+)/);
        l ? e.addEventListener(l[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? je(e, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = o), e.setAttribute(r, o));
      }
    });
  }
}
function Jr(e, t = {}, ...n) {
  {
    let r = document.createElement(e);
    return je(r, t), r.append(...n), r;
  }
}
function sn(e, t) {
  return $e(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Zr(e, t) {
  if ($e(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function ft(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Xr(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || Fe(document.documentElement) || Fe(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function eo(e, t) {
  return e ? e.offsetHeight : 0;
}
function an(e, t = []) {
  let n = on(e);
  return n === null ? t : an(n, t.concat([n]));
}
function to(e) {
  let t = [];
  if (e) {
    let n = an(e), r = /(auto|scroll)/, o = (l) => {
      try {
        let a = window.getComputedStyle(l, null);
        return r.test(a.getPropertyValue("overflow")) || r.test(a.getPropertyValue("overflowX")) || r.test(a.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let l of n) {
      let a = l.nodeType === 1 && l.dataset.scrollselectors;
      if (a) {
        let s = a.split(",");
        for (let i of s) {
          let u = sn(l, i);
          u && o(u) && t.push(u);
        }
      }
      l.nodeType !== 9 && o(l) && t.push(l);
    }
  }
  return t;
}
function ht(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function ln() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Ui() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function no(e, t = "", n) {
  $e(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Ce = {};
function ro(e = "pui_id_") {
  return Object.hasOwn(Ce, e) || (Ce[e] = 0), Ce[e]++, `${e}${Ce[e]}`;
}
function oo() {
  let e = [], t = (a, s, i = 999) => {
    let u = o(a, s, i), d = u.value + (u.key === a ? 0 : i) + 1;
    return e.push({ key: a, value: d }), d;
  }, n = (a) => {
    e = e.filter((s) => s.value !== a);
  }, r = (a, s) => o(a).value, o = (a, s, i = 0) => [...e].reverse().find((u) => !0) || { key: a, value: i }, l = (a) => a && parseInt(a.style.zIndex, 10) || 0;
  return { get: l, set: (a, s, i) => {
    s && (s.style.zIndex = String(t(a, !0, i)));
  }, clear: (a) => {
    a && (n(l(a)), a.style.zIndex = "");
  }, getCurrent: (a) => r(a) };
}
var Wi = oo(), io = Object.defineProperty, so = Object.defineProperties, ao = Object.getOwnPropertyDescriptors, Re = Object.getOwnPropertySymbols, un = Object.prototype.hasOwnProperty, cn = Object.prototype.propertyIsEnumerable, vt = (e, t, n) => t in e ? io(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, V = (e, t) => {
  for (var n in t || (t = {})) un.call(t, n) && vt(e, n, t[n]);
  if (Re) for (var n of Re(t)) cn.call(t, n) && vt(e, n, t[n]);
  return e;
}, Ue = (e, t) => so(e, ao(t)), W = (e, t) => {
  var n = {};
  for (var r in e) un.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Re) for (var r of Re(e)) t.indexOf(r) < 0 && cn.call(e, r) && (n[r] = e[r]);
  return n;
}, lo = tt(), L = lo, fe = /{([^}]*)}/g, dn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, mn = /var\([^)]+\)/g;
function gt(e) {
  return N(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function uo(e) {
  return D(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function co(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Ke(e = "", t = "") {
  return co(`${N(e, !1) && N(t, !1) ? `${e}-` : e}${t}`);
}
function pn(e = "", t = "") {
  return `--${Ke(e, t)}`;
}
function mo(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function fn(e, t = "", n = "", r = [], o) {
  if (N(e)) {
    let l = e.trim();
    if (mo(l)) return;
    if (ne(l, fe)) {
      let a = l.replaceAll(fe, (s) => {
        let i = s.replace(/{|}/g, "").split(".").filter((u) => !r.some((d) => ne(u, d)));
        return `var(${pn(n, tn(i.join("-")))}${x(o) ? `, ${o}` : ""})`;
      });
      return ne(a.replace(mn, "0"), dn) ? `calc(${a})` : a;
    }
    return l;
  } else if (Ur(e)) return e;
}
function po(e, t, n) {
  N(t, !1) && e.push(`${t}:${n};`);
}
function le(e, t) {
  return e ? `${e}{${t}}` : "";
}
function hn(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(a, s) {
    let i = [], u = 0, d = "", c = null, m = 0;
    for (; u <= a.length; ) {
      let p = a[u];
      if ((p === '"' || p === "'" || p === "`") && a[u - 1] !== "\\" && (c = c === p ? null : p), !c && (p === "(" && m++, p === ")" && m--, (p === "," || u === a.length) && m === 0)) {
        let f = d.trim();
        f.startsWith("dt(") ? i.push(hn(f, s)) : i.push(r(f)), d = "", u++;
        continue;
      }
      p !== void 0 && (d += p), u++;
    }
    return i;
  }
  function r(a) {
    let s = a[0];
    if ((s === '"' || s === "'" || s === "`") && a[a.length - 1] === s) return a.slice(1, -1);
    let i = Number(a);
    return isNaN(i) ? a : i;
  }
  let o = [], l = [];
  for (let a = 0; a < e.length; a++) if (e[a] === "d" && e.slice(a, a + 3) === "dt(") l.push(a), a += 2;
  else if (e[a] === ")" && l.length > 0) {
    let s = l.pop();
    l.length === 0 && o.push([s, a]);
  }
  if (!o.length) return e;
  for (let a = o.length - 1; a >= 0; a--) {
    let [s, i] = o[a], u = e.slice(s + 3, i), d = n(u, t), c = t(...d);
    e = e.slice(0, s) + c + e.slice(i + 1);
  }
  return e;
}
var re = (...e) => fo(P.getTheme(), ...e), fo = (e = {}, t, n, r) => {
  if (t) {
    let { variable: o, options: l } = P.defaults || {}, { prefix: a, transform: s } = e?.options || l || {}, i = ne(t, fe) ? t : `{${t}}`;
    return r === "value" || Me(r) && s === "strict" ? P.getTokenValue(t) : fn(i, void 0, a, [o.excludedKeyRegex], n);
  }
  return "";
};
function Oe(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((r, o, l) => {
      var a;
      return r + o + ((a = j(t[l], { dt: re })) != null ? a : "");
    }, "");
    return hn(n, re);
  }
  return j(e, { dt: re });
}
function ho(e, t = {}) {
  let n = P.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: l = n.excludedKeyRegex } = t, a = [], s = [], i = [{ node: e, path: r }];
  for (; i.length; ) {
    let { node: d, path: c } = i.pop();
    for (let m in d) {
      let p = d[m], f = uo(p), g = ne(m, l) ? Ke(c) : Ke(c, tn(m));
      if (D(f)) i.push({ node: f, path: g });
      else {
        let v = pn(g), y = fn(f, g, r, [l]);
        po(s, v, y);
        let _ = g;
        r && _.startsWith(r + "-") && (_ = _.slice(r.length + 1)), a.push(_.replace(/-/g, "."));
      }
    }
  }
  let u = s.join("");
  return { value: s, tokens: a, declarations: u, css: le(o, u) };
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
  return ho(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l, a, s, i, u, d, c;
  let { preset: m, options: p } = t, f, g, v, y, _, $, h;
  if (x(m) && p.transform !== "strict") {
    let { primitive: b, semantic: k, extend: E } = m, B = k || {}, { colorScheme: F } = B, Q = W(B, ["colorScheme"]), K = E || {}, { colorScheme: J } = K, Z = W(K, ["colorScheme"]), Y = F || {}, { dark: X } = Y, oe = W(Y, ["dark"]), ee = J || {}, { dark: ie } = ee, se = W(ee, ["dark"]), H = x(b) ? this._toVariables({ primitive: b }, p) : {}, I = x(Q) ? this._toVariables({ semantic: Q }, p) : {}, te = x(oe) ? this._toVariables({ light: oe }, p) : {}, we = x(X) ? this._toVariables({ dark: X }, p) : {}, ae = x(Z) ? this._toVariables({ semantic: Z }, p) : {}, ot = x(se) ? this._toVariables({ light: se }, p) : {}, it = x(ie) ? this._toVariables({ dark: ie }, p) : {}, [wn, Tn] = [(l = H.declarations) != null ? l : "", H.tokens], [Pn, Cn] = [(a = I.declarations) != null ? a : "", I.tokens || []], [On, xn] = [(s = te.declarations) != null ? s : "", te.tokens || []], [kn, En] = [(i = we.declarations) != null ? i : "", we.tokens || []], [Ln, An] = [(u = ae.declarations) != null ? u : "", ae.tokens || []], [Nn, jn] = [(d = ot.declarations) != null ? d : "", ot.tokens || []], [Rn, Vn] = [(c = it.declarations) != null ? c : "", it.tokens || []];
    f = this.transformCSS(e, wn, "light", "variable", p, r, o), g = Tn;
    let In = this.transformCSS(e, `${Pn}${On}`, "light", "variable", p, r, o), Mn = this.transformCSS(e, `${kn}`, "dark", "variable", p, r, o);
    v = `${In}${Mn}`, y = [.../* @__PURE__ */ new Set([...Cn, ...xn, ...En])];
    let Dn = this.transformCSS(e, `${Ln}${Nn}color-scheme:light`, "light", "variable", p, r, o), Hn = this.transformCSS(e, `${Rn}color-scheme:dark`, "dark", "variable", p, r, o);
    _ = `${Dn}${Hn}`, $ = [.../* @__PURE__ */ new Set([...An, ...jn, ...Vn])], h = j(m.css, { dt: re });
  }
  return { primitive: { css: f, tokens: g }, semantic: { css: v, tokens: y }, global: { css: _, tokens: $ }, style: h };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: r, set: o, defaults: l, selector: a }) {
  var s, i, u;
  let d, c, m;
  if (x(t) && n.transform !== "strict") {
    let p = e.replace("-directive", ""), f = t, { colorScheme: g, extend: v, css: y } = f, _ = W(f, ["colorScheme", "extend", "css"]), $ = v || {}, { colorScheme: h } = $, b = W($, ["colorScheme"]), k = g || {}, { dark: E } = k, B = W(k, ["dark"]), F = h || {}, { dark: Q } = F, K = W(F, ["dark"]), J = x(_) ? this._toVariables({ [p]: V(V({}, _), b) }, n) : {}, Z = x(B) ? this._toVariables({ [p]: V(V({}, B), K) }, n) : {}, Y = x(E) ? this._toVariables({ [p]: V(V({}, E), Q) }, n) : {}, [X, oe] = [(s = J.declarations) != null ? s : "", J.tokens || []], [ee, ie] = [(i = Z.declarations) != null ? i : "", Z.tokens || []], [se, H] = [(u = Y.declarations) != null ? u : "", Y.tokens || []], I = this.transformCSS(p, `${X}${ee}`, "light", "variable", n, o, l, a), te = this.transformCSS(p, se, "dark", "variable", n, o, l, a);
    d = `${I}${te}`, c = [.../* @__PURE__ */ new Set([...oe, ...ie, ...H])], m = j(y, { dt: re });
  }
  return { css: d, tokens: c, style: m };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l;
  let { preset: a, options: s } = t, i = (l = a?.components) == null ? void 0 : l[e];
  return this.getPreset({ name: e, preset: i, options: s, params: n, set: r, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l, a;
  let s = e.replace("-directive", ""), { preset: i, options: u } = t, d = ((l = i?.components) == null ? void 0 : l[s]) || ((a = i?.directives) == null ? void 0 : a[s]);
  return this.getPreset({ name: s, preset: d, options: u, params: n, set: r, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${j(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: l }) {
  let a = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: l }), s = Object.entries(r).reduce((i, [u, d]) => i.push(`${u}="${d}"`) && i, []).join(" ");
  return Object.entries(a || {}).reduce((i, [u, d]) => {
    if (D(d) && Object.hasOwn(d, "css")) {
      let c = pe(d.css), m = `${u}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${m}" ${s}>${c}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: l }) {
  var a;
  let s = { name: e, theme: t, params: n, set: o, defaults: l }, i = (a = e.includes("-directive") ? this.getPresetD(s) : this.getPresetC(s)) == null ? void 0 : a.css, u = Object.entries(r).reduce((d, [c, m]) => d.push(`${c}="${m}"`) && d, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${u}>${pe(i)}</style>` : "";
}, createTokens(e = {}, t, n = "", r = "", o = {}) {
  let l = function(s, i = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: s, path: this.path, paths: i, value: void 0 };
    u.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && fe.test(this.value)) {
      let c = this.value.trim().replace(fe, (m) => {
        var p;
        let f = m.slice(1, -1), g = this.tokens[f];
        if (!g) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
        let v = g.computed(s, i, u);
        return Array.isArray(v) && v.length === 2 ? `light-dark(${v[0].value},${v[1].value})` : (p = v?.value) != null ? p : "__UNRESOLVED__";
      });
      d = dn.test(c.replace(mn, "0")) ? `calc(${c})` : c;
    }
    return Me(i.binding) && delete i.binding, u.pop(), { colorScheme: s, path: this.path, paths: i, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, a = (s, i, u) => {
    Object.entries(s).forEach(([d, c]) => {
      let m = ne(d, t.variable.excludedKeyRegex) ? i : i ? `${i}.${gt(d)}` : gt(d), p = u ? `${u}.${d}` : d;
      D(c) ? a(c, m, p) : (o[m] || (o[m] = { paths: [], computed: (f, g = {}, v = []) => {
        if (o[m].paths.length === 1) return o[m].paths[0].computed(o[m].paths[0].scheme, g.binding, v);
        if (f && f !== "none") for (let y = 0; y < o[m].paths.length; y++) {
          let _ = o[m].paths[y];
          if (_.scheme === f) return _.computed(f, g.binding, v);
        }
        return o[m].paths.map((y) => y.computed(y.scheme, g[y.scheme], v));
      } }), o[m].paths.push({ path: p, value: c, scheme: p.includes("colorScheme.light") ? "light" : p.includes("colorScheme.dark") ? "dark" : "none", computed: l, tokens: o }));
    });
  };
  return a(e, n, r), o;
}, getTokenValue(e, t, n) {
  var r;
  let o = ((s) => s.split(".").filter((i) => !ne(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), l = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, a = [(r = e[o]) == null ? void 0 : r.computed(l)].flat().filter((s) => s);
  return a.length === 1 ? a[0].value : a.reduce((s = {}, i) => {
    let u = i, { colorScheme: d } = u, c = W(u, ["colorScheme"]);
    return s[d] = c, s;
  }, void 0);
}, getSelectorRule(e, t, n, r) {
  return n === "class" || n === "attr" ? le(x(t) ? `${e}${t},${e} ${t}` : e, r) : le(e, le(t ?? ":root,:host", r));
}, transformCSS(e, t, n, r, o = {}, l, a, s) {
  if (x(t)) {
    let { cssLayer: i } = o;
    if (r !== "style") {
      let u = this.getColorSchemeOption(o, a);
      t = n === "dark" ? u.reduce((d, { type: c, selector: m }) => (x(m) && (d += m.includes("[CSS]") ? m.replace("[CSS]", t) : this.getSelectorRule(m, s, c, t)), d), "") : le(s ?? ":root,:host", t);
    }
    if (i) {
      let u = { name: "primeui" };
      D(i) && (u.name = j(i.name, { name: e, type: r })), x(u.name) && (t = le(`@layer ${u.name}`, t), l?.layerNames(u.name));
    }
    return t;
  }
  return "";
} }, P = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = Ue(V({}, t), { options: V(V({}, this.defaults.options), t.options) }), this._tokens = R.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), L.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = Ue(V({}, this.theme), { preset: e }), this._tokens = R.createTokens(e, this.defaults), this.clearLoadedStyleNames(), L.emit("preset:change", e), L.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = Ue(V({}, this.theme), { options: e }), this.clearLoadedStyleNames(), L.emit("options:change", e), L.emit("theme:change", this.theme);
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
  this._loadingStyles.size && (this._loadingStyles.delete(t), L.emit(`theme:${t}:load`, e), !this._loadingStyles.size && L.emit("theme:load"));
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
}, vo = `
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
function yt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function bt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? yt(Object(n), !0).forEach(function(r) {
      go(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : yt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function go(e, t, n) {
  return (t = yo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function yo(e) {
  var t = bo(e, "string");
  return he(t) == "symbol" ? t : t + "";
}
function bo(e, t) {
  if (he(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (he(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function _o(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  st() && st().components ? Wt(e) : t ? e() : Yn(e);
}
var So = 0;
function $o(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = z(!1), r = z(e), o = z(null), l = ln() ? window.document : void 0, a = t.document, s = a === void 0 ? l : a, i = t.immediate, u = i === void 0 ? !0 : i, d = t.manual, c = d === void 0 ? !1 : d, m = t.name, p = m === void 0 ? "style_".concat(++So) : m, f = t.id, g = f === void 0 ? void 0 : f, v = t.media, y = v === void 0 ? void 0 : v, _ = t.nonce, $ = _ === void 0 ? void 0 : _, h = t.first, b = h === void 0 ? !1 : h, k = t.onMounted, E = k === void 0 ? void 0 : k, B = t.onUpdated, F = B === void 0 ? void 0 : B, Q = t.onLoad, K = Q === void 0 ? void 0 : Q, J = t.props, Z = J === void 0 ? {} : J, Y = function() {
  }, X = function(ie) {
    var se = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (s) {
      var H = bt(bt({}, Z), se), I = H.name || p, te = H.id || g, we = H.nonce || $;
      o.value = s.querySelector('style[data-primevue-style-id="'.concat(I, '"]')) || s.getElementById(te) || s.createElement("style"), o.value.isConnected || (r.value = ie || e, je(o.value, {
        type: "text/css",
        id: te,
        media: y,
        nonce: we
      }), b ? s.head.prepend(o.value) : s.head.appendChild(o.value), no(o.value, "data-primevue-style-id", I), je(o.value, H), o.value.onload = function(ae) {
        return K?.(ae, {
          name: I
        });
      }, E?.(I)), !n.value && (Y = ue(r, function(ae) {
        o.value.textContent = ae, F?.(I);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, oe = function() {
    !s || !n.value || (Y(), Qr(o.value) && s.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return u && !c && _o(X), {
    id: g,
    name: p,
    el: o,
    css: r,
    unload: oe,
    load: X,
    isLoaded: Kn(n)
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
var _t, St, $t, wt;
function Tt(e, t) {
  return Co(e) || Po(e, t) || To(e, t) || wo();
}
function wo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function To(e, t) {
  if (e) {
    if (typeof e == "string") return Pt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Pt(e, t) : void 0;
  }
}
function Pt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Po(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, a, s = [], i = !0, u = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(i = (r = l.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!i && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return s;
  }
}
function Co(e) {
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
function We(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ct(Object(n), !0).forEach(function(r) {
      Oo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ct(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Oo(e, t, n) {
  return (t = xo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function xo(e) {
  var t = ko(e, "string");
  return ve(t) == "symbol" ? t : t + "";
}
function ko(e, t) {
  if (ve(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ve(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function xe(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Eo = function(t) {
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
}, Lo = {}, Ao = {}, O = {
  name: "base",
  css: Eo,
  style: vo,
  classes: Lo,
  inlineStyles: Ao,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(l) {
      return l;
    }, o = r(Oe(_t || (_t = xe(["", ""])), t));
    return x(o) ? $o(pe(o), We({
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
      return P.transformCSS(n.name || t.name, "".concat(o).concat(Oe(St || (St = xe(["", ""])), r)));
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
      var r = j(this.css, {
        dt: re
      }) || "", o = pe(Oe($t || ($t = xe(["", "", ""])), r, t)), l = Object.entries(n).reduce(function(a, s) {
        var i = Tt(s, 2), u = i[0], d = i[1];
        return a.push("".concat(u, '="').concat(d, '"')) && a;
      }, []).join(" ");
      return x(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(l, ">").concat(o, "</style>") : "";
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
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), l = Oe(wt || (wt = xe(["", ""])), j(this.style, {
        dt: re
      })), a = pe(P.transformCSS(o, l)), s = Object.entries(n).reduce(function(i, u) {
        var d = Tt(u, 2), c = d[0], m = d[1];
        return i.push("".concat(c, '="').concat(m, '"')) && i;
      }, []).join(" ");
      x(a) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(s, ">").concat(a, "</style>"));
    }
    return r.join("");
  },
  extend: function(t) {
    return We(We({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, q = tt();
function ge(e) {
  "@babel/helpers - typeof";
  return ge = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ge(e);
}
function Ot(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function ke(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ot(Object(n), !0).forEach(function(r) {
      No(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ot(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function No(e, t, n) {
  return (t = jo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function jo(e) {
  var t = Ro(e, "string");
  return ge(t) == "symbol" ? t : t + "";
}
function Ro(e, t) {
  if (ge(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ge(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Vo = {
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
}, Io = Symbol();
function Mo(e, t) {
  var n = {
    config: Gn(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(Io, n), Do(), Ho(e, n), n;
}
var ce = [];
function Do() {
  L.clear(), ce.forEach(function(e) {
    return e?.();
  }), ce = [];
}
function Ho(e, t) {
  var n = z(!1), r = function() {
    var u;
    if (((u = t.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !P.isStyleNameLoaded("common")) {
      var d, c, m = ((d = O.getCommonTheme) === null || d === void 0 ? void 0 : d.call(O)) || {}, p = m.primitive, f = m.semantic, g = m.global, v = m.style, y = {
        nonce: (c = t.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      O.load(p?.css, ke({
        name: "primitive-variables"
      }, y)), O.load(f?.css, ke({
        name: "semantic-variables"
      }, y)), O.load(g?.css, ke({
        name: "global-variables"
      }, y)), O.loadStyle(ke({
        name: "global-style"
      }, y), v), P.setLoadedStyleName("common");
    }
  };
  L.on("theme:change", function(i) {
    n.value || (e.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var o = ue(t.config, function(i, u) {
    q.emit("config:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = ue(function() {
    return t.config.ripple;
  }, function(i, u) {
    q.emit("config:ripple:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = ue(function() {
    return t.config.theme;
  }, function(i, u) {
    n.value || P.setTheme(i), t.config.unstyled || r(), n.value = !1, q.emit("config:theme:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), s = ue(function() {
    return t.config.unstyled;
  }, function(i, u) {
    !i && t.config.theme && r(), q.emit("config:unstyled:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ce.push(o), ce.push(l), ce.push(a), ce.push(s);
}
var Uo = {
  install: function(t, n) {
    var r = Wr(Vo, n);
    Mo(t, r);
  }
}, vn = {
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
    this.mounted = ln();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function Wo(e, t, n, r, o, l) {
  return l.inline ? Ne(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (qn(), Qn(zt, {
    key: 1,
    to: n.appendTo
  }, [Ne(e.$slots, "default")], 8, ["to"])) : Bt("", !0);
}
vn.render = Wo;
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
function zo() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = Jn();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var xt = O.extend({
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
function Bo(e) {
  return bn(e) || Fo(e) || yn(e) || gn();
}
function Fo(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function de(e, t) {
  return bn(e) || Ko(e, t) || yn(e, t) || gn();
}
function gn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function yn(e, t) {
  if (e) {
    if (typeof e == "string") return Ye(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ye(e, t) : void 0;
  }
}
function Ye(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Ko(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, a, s = [], i = !0, u = !1;
    try {
      if (l = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        i = !1;
      } else for (; !(i = (r = l.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!i && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return s;
  }
}
function bn(e) {
  if (Array.isArray(e)) return e;
}
function kt(e, t) {
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
    t % 2 ? kt(Object(n), !0).forEach(function(r) {
      me(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : kt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function me(e, t, n) {
  return (t = Yo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Yo(e) {
  var t = Go(e, "string");
  return ye(t) == "symbol" ? t : t + "";
}
function Go(e, t) {
  if (ye(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ye(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var zi = {
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
        L.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var r = this;
        L.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
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
    var t, n, r, o, l, a, s, i, u, d, c, m = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, p = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, f = m ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = f || p) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (l = o.onBeforeCreate) === null || l === void 0 || l.call(o);
    var g = (a = this.$primevueConfig) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a._usept, v = g ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.originalValue : void 0, y = g ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = y || v) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = zo(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = sn($e(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = w({
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
      return Xe(t) ? t.apply(void 0, r) : Le.apply(void 0, r);
    },
    _load: function() {
      G.isStyleNameLoaded("base") || (O.loadCSS(this.$styleOptions), this._loadGlobalStyles(), G.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !G.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (xt.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), G.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      x(t) && O.load(t, w({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!P.isStyleNameLoaded("common")) {
          var r, o, l = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, a = l.primitive, s = l.semantic, i = l.global, u = l.style;
          O.load(a?.css, w({
            name: "primitive-variables"
          }, this.$styleOptions)), O.load(s?.css, w({
            name: "semantic-variables"
          }, this.$styleOptions)), O.load(i?.css, w({
            name: "global-variables"
          }, this.$styleOptions)), O.loadStyle(w({
            name: "global-style"
          }, this.$styleOptions), u), P.setLoadedStyleName("common");
        }
        if (!P.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, m, p, f = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, g = f.css, v = f.style;
          (m = this.$style) === null || m === void 0 || m.load(g, w({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (p = this.$style) === null || p === void 0 || p.loadStyle(w({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), v), P.setLoadedStyleName(this.$style.name);
        }
        if (!P.isStyleNameLoaded("layer-order")) {
          var y, _, $ = (y = this.$style) === null || y === void 0 || (_ = y.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(y);
          O.load($, w({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), P.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, r, o, l = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, a = l.css, s = (o = this.$style) === null || o === void 0 ? void 0 : o.load(a, w({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = s.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      G.clearLoadedStyleNames(), L.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      L.off("theme:change", this._loadCoreStyles), L.off("theme:change", this._load), L.off("theme:change", this._themeScopedListener);
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
      return et(t, n, r);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, a = /./g.test(r) && !!o[r.split(".")[0]], s = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, i = s.mergeSections, u = i === void 0 ? !0 : i, d = s.mergeProps, c = d === void 0 ? !1 : d, m = l ? a ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, p = a ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, w(w({}, o), {}, {
        global: m || {}
      })), f = this._getPTDatasets(r);
      return u || !u && p ? c ? this._mergeProps(c, m, p, f) : w(w(w({}, m), p), f) : w(w({}, p), f);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return Le(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", l = r === "root" && x((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return r !== "transition" && w(w({}, r === "root" && w(w(me({}, "".concat(o, "name"), M(l ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), l && me({}, "".concat(o, "extend"), M(this.$.type.name))), {}, me({}, "".concat(this.$attrSelector), ""))), {}, me({}, "".concat(o, "section"), M(r)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return N(t) || en(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, l = function(s) {
        var i, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = o ? o(s) : s, c = M(r), m = M(n.$name);
        return (i = u ? c !== m ? d?.[c] : void 0 : d?.[c]) !== null && i !== void 0 ? i : d;
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
        var a, s = t._usept || ((a = this.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, i = s.mergeSections, u = i === void 0 ? !0 : i, d = s.mergeProps, c = d === void 0 ? !1 : d, m = l(t.originalValue), p = l(t.value);
        return m === void 0 && p === void 0 ? void 0 : N(p) ? p : N(m) ? m : u || !u && p ? c ? this._mergeProps(c, m, p) : w(w({}, m), p) : p;
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
      return this._getPTValue(this.pt, t, w(w({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = Le(this.$_attrsWithoutPT, this.ptm(n, r));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, w({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, w(w({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, w(w({}, this.$params), r)), l = this._getOptionValue(xt.inlineStyles, t, w(w({}, this.$params), r));
        return [l, o];
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
        return n._getOptionValue(r, n.$name, w({}, n.$params)) || j(r, w({}, n.$params));
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
      return w(w({
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
        var r = de(n, 2), o = r[0], l = r[1], a = o.split(":"), s = Bo(a), i = Ye(s).slice(1);
        return i?.reduce(function(u, d, c, m) {
          return !u[d] && (u[d] = c === m.length - 1 ? l : {}), u[d];
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
}, qo = `
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
`, Qo = {
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
  style: qo,
  classes: Qo
});
var Jo = `
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
  css: Jo
});
function be(e) {
  "@babel/helpers - typeof";
  return be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, be(e);
}
function Et(e, t) {
  return ti(e) || ei(e, t) || Xo(e, t) || Zo();
}
function Zo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xo(e, t) {
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
function ei(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, a, s = [], i = !0, u = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(i = (r = l.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!i && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return s;
  }
}
function ti(e) {
  if (Array.isArray(e)) return e;
}
function At(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function T(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? At(Object(n), !0).forEach(function(r) {
      Ge(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : At(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Ge(e, t, n) {
  return (t = ni(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ni(e) {
  var t = ri(e, "string");
  return be(t) == "symbol" ? t : t + "";
}
function ri(e, t) {
  if (be(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (be(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var S = {
  _getMeta: function() {
    return [D(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], j(D(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var r, o, l;
    return (r = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (l = n.ctx) === null || l === void 0 || (l = l.appContext) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.globalProperties) === null || l === void 0 ? void 0 : l.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: et,
  _getPTValue: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var _ = S._getOptionValue.apply(S, arguments);
      return N(_) || en(_) ? {
        class: _
      } : _;
    }, u = ((t = r.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, m = u.mergeProps, p = m === void 0 ? !1 : m, f = s ? S._useDefaultPT(r, r.defaultPT(), i, l, a) : void 0, g = S._usePT(r, S._getPT(o, r.$name), i, l, T(T({}, a), {}, {
      global: f || {}
    })), v = S._getPTDatasets(r, l);
    return c || !c && g ? p ? S._mergeProps(r, p, f, g, v) : T(T(T({}, f), g), v) : T(T({}, g), v);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return T(T({}, n === "root" && Ge({}, "".concat(r, "name"), M(t.$name))), {}, Ge({}, "".concat(r, "section"), M(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(a) {
      var s, i = r ? r(a) : a, u = M(n);
      return (s = i?.[u]) !== null && s !== void 0 ? s : i;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0, a = function(v) {
      return r(v, o, l);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var s, i = n._usept || ((s = t.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, u = i.mergeSections, d = u === void 0 ? !0 : u, c = i.mergeProps, m = c === void 0 ? !1 : c, p = a(n.originalValue), f = a(n.value);
      return p === void 0 && f === void 0 ? void 0 : N(f) ? f : N(p) ? p : d || !d && f ? m ? S._mergeProps(t, m, p, f) : T(T({}, p), f) : f;
    }
    return a(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0;
    return S._usePT(t, n, r, o, l);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, l = S._getConfig(r, o), a = {
      nonce: l == null || (t = l.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    S._loadCoreStyles(n, a), S._loadThemeStyles(n, a), S._loadScopedThemeStyles(n, a), S._removeThemeListeners(n), n.$loadStyles = function() {
      return S._loadThemeStyles(n, a);
    }, S._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!G.isStyleNameLoaded((t = r.$style) === null || t === void 0 ? void 0 : t.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var l;
      O.loadCSS(o), (l = r.$style) === null || l === void 0 || l.loadCSS(o), G.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, l = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!P.isStyleNameLoaded("common")) {
        var a, s, i = ((a = o.$style) === null || a === void 0 || (s = a.getCommonTheme) === null || s === void 0 ? void 0 : s.call(a)) || {}, u = i.primitive, d = i.semantic, c = i.global, m = i.style;
        O.load(u?.css, T({
          name: "primitive-variables"
        }, l)), O.load(d?.css, T({
          name: "semantic-variables"
        }, l)), O.load(c?.css, T({
          name: "global-variables"
        }, l)), O.loadStyle(T({
          name: "global-style"
        }, l), m), P.setLoadedStyleName("common");
      }
      if (!P.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var p, f, g, v, y = ((p = o.$style) === null || p === void 0 || (f = p.getDirectiveTheme) === null || f === void 0 ? void 0 : f.call(p)) || {}, _ = y.css, $ = y.style;
        (g = o.$style) === null || g === void 0 || g.load(_, T({
          name: "".concat(o.$style.name, "-variables")
        }, l)), (v = o.$style) === null || v === void 0 || v.loadStyle(T({
          name: "".concat(o.$style.name, "-style")
        }, l), $), P.setLoadedStyleName(o.$style.name);
      }
      if (!P.isStyleNameLoaded("layer-order")) {
        var h, b, k = (h = o.$style) === null || h === void 0 || (b = h.getLayerOrderThemeCSS) === null || b === void 0 ? void 0 : b.call(h);
        O.load(k, T({
          name: "layer-order",
          first: !0
        }, l)), P.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = t.preset();
    if (r && t.$attrSelector) {
      var o, l, a, s = ((o = t.$style) === null || o === void 0 || (l = o.getPresetTheme) === null || l === void 0 ? void 0 : l.call(o, r, "[".concat(t.$attrSelector, "]"))) || {}, i = s.css, u = (a = t.$style) === null || a === void 0 ? void 0 : a.load(i, T({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    G.clearLoadedStyleNames(), L.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    L.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, r, o, l, a) {
    var s, i, u = "on".concat(zr(n)), d = S._getConfig(o, l), c = r?.$instance, m = S._usePT(c, S._getPT(o == null || (s = o.value) === null || s === void 0 ? void 0 : s.pt, t), S._getOptionValue, "hooks.".concat(u)), p = S._useDefaultPT(c, d == null || (i = d.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[t], S._getOptionValue, "hooks.".concat(u)), f = {
      el: r,
      binding: o,
      vnode: l,
      prevVnode: a
    };
    m?.(c, f), p?.(c, f);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return Xe(t) ? t.apply(void 0, r) : Le.apply(void 0, r);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(s, i, u, d, c) {
      var m, p, f, g;
      i._$instances = i._$instances || {};
      var v = S._getConfig(u, d), y = i._$instances[t] || {}, _ = Me(y) ? T(T({}, n), n?.methods) : {};
      i._$instances[t] = T(T({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: i,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: y.$el || i || void 0,
        $style: T({
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
          return S._getPT(v?.pt, void 0, function(h) {
            var b;
            return h == null || (b = h.directives) === null || b === void 0 ? void 0 : b[t];
          });
        },
        isUnstyled: function() {
          var h, b;
          return ((h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (b = i._$instances[t]) === null || b === void 0 || (b = b.$binding) === null || b === void 0 || (b = b.value) === null || b === void 0 ? void 0 : b.unstyled : v?.unstyled;
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
          var h, b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return S._getPTValue(i._$instances[t], (h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, b, T({}, k));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", k = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return S._getPTValue(i._$instances[t], h, b, k, !1);
        },
        cx: function() {
          var h, b, k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = i._$instances[t]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : S._getOptionValue((b = i._$instances[t]) === null || b === void 0 || (b = b.$style) === null || b === void 0 ? void 0 : b.classes, k, T({}, E));
        },
        sx: function() {
          var h, b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, E = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return k ? S._getOptionValue((h = i._$instances[t]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, b, T({}, E)) : void 0;
        }
      }, _), i.$instance = i._$instances[t], (p = (f = i.$instance)[s]) === null || p === void 0 || p.call(f, i, u, d, c), i["$".concat(t)] = i.$instance, S._hook(t, s, i, u, d, c), i.$pd || (i.$pd = {}), i.$pd[t] = T(T({}, (g = i.$pd) === null || g === void 0 ? void 0 : g[t]), {}, {
        name: t,
        instance: i._$instances[t]
      });
    }, o = function(s) {
      var i, u, d, c = s._$instances[t], m = c?.watch, p = function(v) {
        var y, _ = v.newValue, $ = v.oldValue;
        return m == null || (y = m.config) === null || y === void 0 ? void 0 : y.call(c, _, $);
      }, f = function(v) {
        var y, _ = v.newValue, $ = v.oldValue;
        return m == null || (y = m["config.ripple"]) === null || y === void 0 ? void 0 : y.call(c, _, $);
      };
      c.$watchersCallback = {
        config: p,
        "config.ripple": f
      }, m == null || (i = m.config) === null || i === void 0 || i.call(c, c?.$primevueConfig), q.on("config:change", p), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), q.on("config:ripple:change", f);
    }, l = function(s) {
      var i = s._$instances[t].$watchersCallback;
      i && (q.off("config:change", i.config), q.off("config:ripple:change", i["config.ripple"]), s._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(s, i, u, d) {
        s.$pd || (s.$pd = {}), s.$pd[t] = {
          name: t,
          attrSelector: ro("pd")
        }, r("created", s, i, u, d);
      },
      beforeMount: function(s, i, u, d) {
        var c;
        S._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, i, u), r("beforeMount", s, i, u, d), o(s);
      },
      mounted: function(s, i, u, d) {
        var c;
        S._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, i, u), r("mounted", s, i, u, d);
      },
      beforeUpdate: function(s, i, u, d) {
        r("beforeUpdate", s, i, u, d);
      },
      updated: function(s, i, u, d) {
        var c;
        S._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, i, u), r("updated", s, i, u, d);
      },
      beforeUnmount: function(s, i, u, d) {
        var c;
        l(s), S._removeThemeListeners((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance), r("beforeUnmount", s, i, u, d);
      },
      unmounted: function(s, i, u, d) {
        var c;
        (c = s.$pd[t]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), r("unmounted", s, i, u, d);
      }
    };
  },
  extend: function() {
    var t = S._getMeta.apply(S, arguments), n = Et(t, 2), r = n[0], o = n[1];
    return T({
      extend: function() {
        var a = S._getMeta.apply(S, arguments), s = Et(a, 2), i = s[0], u = s[1];
        return S.extend(i, T(T(T({}, o), o?.methods), u));
      }
    }, S._extend(r, o));
  }
}, oi = `
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
`, ii = {
  root: "p-ink"
}, si = O.extend({
  name: "ripple-directive",
  style: oi,
  classes: ii
}), ai = S.extend({
  style: si
});
function _e(e) {
  "@babel/helpers - typeof";
  return _e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _e(e);
}
function li(e) {
  return mi(e) || di(e) || ci(e) || ui();
}
function ui() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ci(e, t) {
  if (e) {
    if (typeof e == "string") return qe(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? qe(e, t) : void 0;
  }
}
function di(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function mi(e) {
  if (Array.isArray(e)) return qe(e);
}
function qe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Nt(e, t, n) {
  return (t = pi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function pi(e) {
  var t = fi(e, "string");
  return _e(t) == "symbol" ? t : t + "";
}
function fi(e, t) {
  if (_e(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (_e(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
ai.extend("ripple", {
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
      n || (n = Jr("span", Nt(Nt({
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
        if (!this.isUnstyled() && He(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !ft(o) && !ht(o)) {
          var l = Math.max(qr(r), eo(r));
          o.style.height = l + "px", o.style.width = l + "px";
        }
        var a = Xr(r), s = t.pageX - a.left + document.body.scrollTop - ht(o) / 2, i = t.pageY - a.top + document.body.scrollLeft - ft(o) / 2;
        o.style.top = i + "px", o.style.left = s + "px", !this.isUnstyled() && Fr(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && He(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && He(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? li(t.children).find(function(n) {
        return Zr(n, "data-pc-name") === "ripple";
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
function hi(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function vi(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, yi(r.key), r);
  }
}
function gi(e, t, n) {
  return t && vi(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function yi(e) {
  var t = bi(e, "string");
  return Se(t) == "symbol" ? t : t + "";
}
function bi(e, t) {
  if (Se(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Se(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Bi = /* @__PURE__ */ (function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    hi(this, e), this.element = t, this.listener = n;
  }
  return gi(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = to(this.element);
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
})(), Fi = tt(), _i = `
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
`, Si = {
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
  style: _i,
  classes: Si
});
const $i = "data-wippy-overlay-layer";
function _n() {
  return typeof window < "u" && typeof window.document < "u";
}
function Sn() {
  return _n() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function wi() {
  return Sn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Ti = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Pi = 0;
const Ve = /* @__PURE__ */ new WeakMap();
function jt(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Ci(e, t) {
  if (!Ti.test(e.className))
    return;
  const n = e.style.cssText;
  jt(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!Ve.has(e)) {
    const r = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && jt(e, t);
    });
    r.observe(e, { attributes: !0, attributeFilter: ["style"] }), Ve.set(e, r);
  }
}
function nt(e) {
  const t = Ve.get(e);
  t && (t.disconnect(), Ve.delete(e));
}
function Oi(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function Qe(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Ie = /* @__PURE__ */ new Set(), rt = /* @__PURE__ */ new WeakMap();
let Rt = !1, Je = !1;
const Vt = ["w-theme-dark", "w-theme-light"], Ee = "data-wippy-theme-root", Ze = /* @__PURE__ */ new WeakMap();
function xi(e) {
  const t = [];
  let n = e ? e.parentNode : null;
  for (; n && n.nodeType === 1; )
    t.push(n), n = n.parentNode;
  return t;
}
function ki(e, t, n) {
  const r = [...xi(t), n.host], o = () => {
    let a;
    for (const s of r) {
      if (Vt.some((i) => s.classList.contains(i))) {
        a = s;
        break;
      }
      if (s.hasAttribute(Ee))
        break;
    }
    for (const s of Vt)
      e.classList.toggle(s, !!(a && a.classList.contains(s)));
    a ? e.setAttribute(Ee, "") : e.removeAttribute(Ee);
  };
  o();
  const l = new MutationObserver(o);
  for (const a of r)
    l.observe(a, { attributes: !0, attributeFilter: ["class", Ee] });
  Ze.set(e, l);
}
function $n(e) {
  Ze.get(e)?.disconnect(), Ze.delete(e);
}
function Ei() {
  Je = !1;
  for (const e of Ie) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && nt(t);
      Ie.delete(e), rt.get(e)?.disconnect(), $n(e);
      continue;
    }
    e.childElementCount > 0 && Qe(e);
  }
}
function It() {
  Je || (Je = !0, requestAnimationFrame(Ei));
}
function Li(e) {
  const t = document.createElement("div");
  t.setAttribute($i, "");
  const n = Sn();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Qe(t);
  const r = new MutationObserver((o) => {
    const l = t.__wippyAnchorName;
    for (const a of o) {
      if (l)
        for (const s of Array.from(a.addedNodes))
          s instanceof HTMLElement && Ci(s, l);
      for (const s of Array.from(a.removedNodes))
        s instanceof HTMLElement && nt(s);
    }
    t.isConnected && t.childElementCount > 0 && Qe(t);
  });
  return r.observe(t, { childList: !0 }), rt.set(t, r), Ie.add(t), Rt || (Rt = !0, window.addEventListener("scroll", It, { capture: !0, passive: !0 }), window.addEventListener("resize", It, { passive: !0 })), t;
}
function Mt(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Li(e.hostRoot), ki(e.layer, e.$el, e.hostRoot), wi())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++Pi}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function Dt(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && nt(t);
    Ie.delete(e.layer), rt.get(e.layer)?.disconnect(), $n(e.layer), e.layer.remove(), e.layer = null;
  }
}
let Ht = !1;
function Ai() {
  if (Ht)
    return;
  Ht = !0;
  const e = vn;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    _n() && (this.hostRoot = Oi(this.$el), this.mounted = !0, this.hostRoot && (this.inline || Mt(this), this.$watch("inline", (t) => {
      t ? Dt(this) : Mt(this);
    })));
  }, e.render = function() {
    return this.inline ? Ne(this.$slots, "default", { key: 0 }) : this.mounted ? Zn(zt, { key: 1, to: this.resolvedTarget || document.body }, [
      Ne(this.$slots, "default")
    ]) : Bt("", !0);
  }, e.unmounted = function() {
    Dt(this);
  };
}
const Ki = {
  install: (e) => {
    Ai(), e.use(Uo, { theme: "none" });
  }
};
export {
  O as B,
  Bi as C,
  Di as D,
  Hi as I,
  Fi as O,
  He as P,
  Mi as W,
  Ui as Y,
  x as a,
  vn as b,
  Fr as c,
  Ki as d,
  Vi as l,
  zi as s,
  Ii as u,
  Wi as x
};
//# sourceMappingURL=wc-runtime-C73IaGFn.js.map
