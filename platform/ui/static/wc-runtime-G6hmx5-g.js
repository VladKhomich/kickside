import { hasInjectionContext as Un, inject as et, effectScope as Wn, ref as H, markRaw as Hn, createApp as Fn, onMounted as Ht, onUnmounted as zn, watch as de, readonly as Kn, getCurrentInstance as at, nextTick as Yn, reactive as qn, renderSlot as je, openBlock as Gn, createBlock as Jn, Teleport as Ft, createCommentVNode as zt, useId as Qn, mergeProps as Ae, h as Zn } from "vue";
import { addCollection as Xn } from "@iconify/vue";
import { config as lt, addIcons as er, on as tr, applyThemeMode as Ce, host as nr, hostCss as rr, loadCss as or } from "@wippy-fe/proxy";
var He = "data-wippy-visible";
function ut(t) {
  const e = t.getAttribute(He);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var ir = Object.defineProperty, sr = (t, e, n) => e in t ? ir(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, x = (t, e, n) => sr(t, typeof e != "symbol" ? e + "" : e, n), ar = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], lr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function dt(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function ur(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    if (n)
      for (const [r, o] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [a, l] of Object.entries(o)) {
            const i = typeof l == "string" ? dt(a) : null;
            i && e.add(i);
          }
          continue;
        }
        const s = typeof o == "string" ? dt(r) : null;
        s && e.add(s);
      }
  return [...e].sort();
}
function dr(t) {
  if (t.length === 0)
    return "";
  const e = t.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${lr} {
${e}
}`;
}
function cr(t, e) {
  const n = dr(e);
  n && Kt(t, n, "@wippy-fe/css-variables-bridge");
}
function mr(t, e) {
  const r = (e ?? ar).map(async (o) => {
    const s = rr[o];
    if (!s)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await or(s);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${s}):`, a), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const s of o) {
      if (!s)
        continue;
      const a = document.createElement("style");
      a.textContent = s, a.setAttribute("role", "@wippy-fe/host-css"), t.appendChild(a);
    }
  });
}
function pr(t, e) {
  const n = document.createElement("style");
  n.textContent = e, t.appendChild(n);
}
function Kt(t, e, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = e, t.appendChild(r);
}
function fr(t, e) {
  Kt(t, e, "@wippy-fe/custom-css");
}
function Yt(t) {
  return t.__wippyHost ?? null;
}
function hr(t) {
  return t.replace(/-([a-z])/g, (e, n) => n.toUpperCase());
}
function gr(t, e, n) {
  switch (n.type) {
    case "string":
      return { value: e };
    case "number": {
      const r = Number.parseFloat(e);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${t}: expected a number` } : { value: r };
    }
    case "integer": {
      const r = Number.parseInt(e, 10);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${t}: expected an integer` } : { value: r };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const r = JSON.parse(e);
        return n.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${t}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${t}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function Me(t, e) {
  const n = {}, r = [];
  for (const [o, s] of Object.entries(e.properties)) {
    const a = t.getAttribute(o), l = hr(o);
    if (a === null) {
      s.default !== void 0 && (n[l] = s.default);
      continue;
    }
    const i = gr(o, a, s);
    i.error ? r.push(i.error) : n[l] = i.value;
  }
  return { props: n, errors: r };
}
var vr = class {
  constructor(t, e) {
    x(this, "_props"), x(this, "_errors"), x(this, "_content"), x(this, "_hostVisibility"), x(this, "_propsListeners", /* @__PURE__ */ new Set()), x(this, "_contentListeners", /* @__PURE__ */ new Set()), x(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), x(this, "_disposed", !1), x(this, "_emitToDom"), x(this, "props"), x(this, "events"), x(this, "content"), x(this, "hostVisibility"), this._props = t.props, this._errors = t.errors, this._content = t.content, this._hostVisibility = t.hostVisibility, this._emitToDom = e;
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
    }, this.content = t.hasContent ? {
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
  notifyProps(t, e) {
    if (!this._disposed) {
      this._props = t, this._errors = e;
      for (const n of this._propsListeners)
        n(t, e);
    }
  }
  /** @internal */
  notifyContent(t) {
    if (!this._disposed) {
      this._content = t;
      for (const e of this._contentListeners)
        e(t);
    }
  }
  /** @internal */
  notifyHostVisibility(t, e) {
    if (!(this._disposed || t === e)) {
      this._hostVisibility = t;
      for (const n of this._hostVisibilityListeners)
        n(t, e);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(t), e?.immediate && t(this._props, this._errors);
    const n = () => {
      this._propsListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeContent(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(t), e?.immediate && t(this._content);
    const n = () => {
      this._contentListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeHostVisibility(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(t), e?.immediate && t(this._hostVisibility, this._hostVisibility);
    const n = () => {
      this._hostVisibilityListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
}, yr = class extends HTMLElement {
  constructor() {
    super(), x(this, "_internals"), x(this, "_contentObserver", null), x(this, "_initialized", !1), x(this, "_container", null), x(this, "_reactive", null), x(this, "_lastProps", null), x(this, "_lastErrors", []), x(this, "_lastContent", null), x(this, "_themeUnsub", null), x(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = ut(this);
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
    const t = this.wippyConfig, e = Object.keys(t.propsSchema.properties), n = t.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...n, He])];
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
    return Yt(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(t, e) {
    this.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      composed: !0,
      detail: e
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
      const t = this.constructor.wippyConfig, e = !!t.contentTemplate;
      let n, r;
      if (this._lastProps !== null)
        n = this._lastProps, r = this._lastErrors;
      else {
        const s = Me(this, t.propsSchema);
        t.validateProps && s.errors.push(...t.validateProps(s.props)), n = s.props, r = s.errors, this._lastProps = n, this._lastErrors = r;
      }
      const o = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = o), this._reactive = new vr(
        { props: n, errors: r, content: o, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const t = this.constructor.wippyConfig, e = this._initialized, n = this.shadowRoot ?? this.attachShadow({ mode: t.shadowMode ?? "open" });
      let r;
      if (e)
        r = this._container;
      else {
        this.onInit(n), t.inlineCss && pr(n, t.inlineCss);
        try {
          const u = lt?.theming, d = ur(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          cr(n, d);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const u = lt?.theming, d = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            d && fr(n, d);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && mr(n, t.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const i = t.containerClasses ?? [];
        i.length > 0 && r.classList.add(...i), n.appendChild(r), this._container = r, er(Xn);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = tr("@theme", (i) => this._applyTheme(i)));
      const { props: o, errors: s } = Me(this, t.propsSchema);
      t.validateProps && s.push(...t.validateProps(o));
      const a = o;
      this._lastProps = a, this._lastErrors = s;
      let l = null;
      t.contentTemplate && (l = this._extractContent(t.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const i = this._extractContent(t.contentTemplate);
        this._lastContent = i, this._reactive?.notifyContent(i), this.onContentChanged(i);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, r, a, s, l, e), this._internals.states.delete("loading"), this._internals.states.add("ready"), e || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (t) {
      this.onError(t), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
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
  _applyTheme(t = nr.getThemeMode?.()) {
    Ce(t, this), this._container && Ce(t, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Ce("auto", this), this._container && Ce("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(t, e, n) {
    if (e === n)
      return;
    if (t === He) {
      const l = this._hostVisible, i = ut(this);
      if (i === l)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, l), this.onHostVisibilityChanged(i, l));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: s } = Me(this, r.propsSchema);
    r.validateProps && s.push(...r.validateProps(o));
    const a = o;
    this._lastProps = a, this._lastErrors = s, this._reactive?.notifyProps(a, s), this.onPropsChanged(a, s);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(t) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(t) {
    console.error(`${this.constructor.name} initialization failed:`, t);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(t, e) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(t, e) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(t) {
    return this.querySelector(`template[data-type="${t}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(t) {
  }
};
function br(t) {
  return t.__wippyHostBus ?? null;
}
function _r(t) {
  return t.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let qt;
const Gt = (t) => qt = t, Sr = () => Un() && et(Jt) || qt, Jt = (
  /* istanbul ignore next */
  Symbol()
);
function $r() {
  const t = Wn(!0), e = t.run(() => H({}));
  let n = [], r = [];
  const o = Hn({
    install(s) {
      Gt(o), o._a = s, s.provide(Jt, o), s.config.globalProperties.$pinia = o, r.forEach((a) => n.push(a)), r = [];
    },
    use(s) {
      return this._a ? n.push(s) : r.push(s), this;
    },
    _p: n,
    _a: null,
    _e: t,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return o;
}
var wr = Object.defineProperty, Tr = (t, e, n) => e in t ? wr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, le = (t, e, n) => Tr(t, typeof e != "symbol" ? e + "" : e, n), Qt = /* @__PURE__ */ Symbol("wippy:emit"), Pr = /* @__PURE__ */ Symbol("wippy:props"), Or = /* @__PURE__ */ Symbol("wippy:props_error"), Cr = /* @__PURE__ */ Symbol("wippy:content"), xr = /* @__PURE__ */ Symbol("wippy:panel-id"), kr = /* @__PURE__ */ Symbol("wippy:layout-bus"), Er = /* @__PURE__ */ Symbol("wippy:host"), Zt = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Bi() {
  const t = et(Qt);
  if (!t)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return t;
}
function Lr() {
  const t = et(Zt);
  if (!t)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return t;
}
function Ui(t) {
  const e = Lr();
  let n = !1, r = null, o = !1;
  function s() {
    if (r)
      return o = !0, r;
    let a;
    try {
      a = Promise.resolve(t());
    } catch (i) {
      a = Promise.reject(i);
    }
    const l = a.finally(() => {
      if (r === l && (r = null, n && o))
        return o = !1, s();
    });
    return r = l, l;
  }
  return Ht(() => (n = !0, s())), zn(() => {
    n = !1, o = !1;
  }), de(e, (a, l) => {
    if (n && l === !1 && a === !0)
      return s();
  }), e;
}
var Wi = class extends yr {
  constructor() {
    super(...arguments), le(this, "_vueApp", null), le(this, "_propsRef", H({})), le(this, "_errorsRef", H([])), le(this, "_contentRef", H(null)), le(this, "_hostVisibilityRef", H(null)), le(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(t, e, n, r, o, s) {
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
    const i = (u) => {
      if (l.signal.aborted)
        return;
      const d = Sr(), c = Fn(u.rootComponent);
      this._vueApp = c;
      const m = $r();
      if (u.piniaPlugins)
        for (const p of u.piniaPlugins)
          m.use(p);
      if (c.use(m), u.plugins)
        for (const p of u.plugins)
          c.use(p);
      c.provide(Pr, this._propsRef), c.provide(Or, this._errorsRef), c.provide(Qt, this.emitEvent.bind(this)), c.provide(Cr, this._contentRef), c.provide(Zt, this._hostVisibilityRef), c.provide(xr, _r(this)), c.provide(kr, br(this)), c.provide(Er, Yt(this)), u.providers && u.providers(c, this), c.mount(e), d && Gt(d);
    };
    if (a.rootComponent)
      i(a);
    else if (a.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), e.appendChild(u), a.lazyConfig().then((d) => {
        l.signal.aborted || (u.remove(), i(d));
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
}, Ar = Object.defineProperty, ct = Object.getOwnPropertySymbols, jr = Object.prototype.hasOwnProperty, Nr = Object.prototype.propertyIsEnumerable, mt = (t, e, n) => e in t ? Ar(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Vr = (t, e) => {
  for (var n in e || (e = {})) jr.call(e, n) && mt(t, n, e[n]);
  if (ct) for (var n of ct(e)) Nr.call(e, n) && mt(t, n, e[n]);
  return t;
};
function Pe(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0 || !(t instanceof Date) && typeof t == "object" && Object.keys(t).length === 0;
}
function Fe(t, e, n = /* @__PURE__ */ new WeakSet()) {
  if (t === e) return !0;
  if (!t || !e || typeof t != "object" || typeof e != "object" || n.has(t) || n.has(e)) return !1;
  n.add(t).add(e);
  let r = Array.isArray(t), o = Array.isArray(e), s, a, l;
  if (r && o) {
    if (a = t.length, a != e.length) return !1;
    for (s = a; s-- !== 0; ) if (!Fe(t[s], e[s], n)) return !1;
    return !0;
  }
  if (r != o) return !1;
  let i = t instanceof Date, u = e instanceof Date;
  if (i != u) return !1;
  if (i && u) return t.getTime() == e.getTime();
  let d = t instanceof RegExp, c = e instanceof RegExp;
  if (d != c) return !1;
  if (d && c) return t.toString() == e.toString();
  let m = Object.keys(t);
  if (a = m.length, a !== Object.keys(e).length) return !1;
  for (s = a; s-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(e, m[s])) return !1;
  for (s = a; s-- !== 0; ) if (l = m[s], !Fe(t[l], e[l], n)) return !1;
  return !0;
}
function Rr(t, e) {
  return Fe(t, e);
}
function De(t) {
  return typeof t == "function" && "call" in t && "apply" in t;
}
function O(t) {
  return !Pe(t);
}
function ze(t, e) {
  if (!t || !e) return null;
  try {
    let n = t[e];
    if (O(n)) return n;
  } catch {
  }
  if (Object.keys(t).length) {
    if (De(e)) return e(t);
    if (e.indexOf(".") === -1) return t[e];
    {
      let n = e.split("."), r = t;
      for (let o = 0, s = n.length; o < s; ++o) {
        if (r == null) return null;
        r = r[n[o]];
      }
      return r;
    }
  }
  return null;
}
function Ir(t, e, n) {
  return n ? ze(t, n) === ze(e, n) : Rr(t, e);
}
function B(t, e = !0) {
  return t instanceof Object && t.constructor === Object && (e || Object.keys(t).length !== 0);
}
function Xt(t = {}, e = {}) {
  let n = Vr({}, t);
  return Object.keys(e).forEach((r) => {
    let o = r;
    B(e[o]) && o in t && B(t[o]) ? n[o] = Xt(t[o], e[o]) : n[o] = e[o];
  }), n;
}
function Dr(...t) {
  return t.reduce((e, n, r) => r === 0 ? n : Xt(e, n), {});
}
function Hi(t, e) {
  let n = -1;
  if (O(t)) try {
    n = t.findLastIndex(e);
  } catch {
    n = t.lastIndexOf([...t].reverse().find(e));
  }
  return n;
}
function j(t, ...e) {
  return De(t) ? t(...e) : t;
}
function A(t, e = !0) {
  return typeof t == "string" && (e || t !== "");
}
function M(t) {
  return A(t) ? t.replace(/(-|_)/g, "").toLowerCase() : t;
}
function tt(t, e = "", n = {}) {
  let r = M(e).split("."), o = r.shift();
  if (o) {
    if (B(t)) {
      let s = Object.keys(t).find((a) => M(a) === o) || "";
      return tt(j(t[s], n), r.join("."), n);
    }
    return;
  }
  return j(t, n);
}
function en(t, e = !0) {
  return Array.isArray(t) && (e || t.length !== 0);
}
function Mr(t) {
  return O(t) && !isNaN(t);
}
function Fi(t = "") {
  return O(t) && t.length === 1 && !!t.match(/\S| /);
}
function ne(t, e) {
  if (e) {
    let n = e.test(t);
    return e.lastIndex = 0, n;
  }
  return !1;
}
function Br(...t) {
  return Dr(...t);
}
function he(t) {
  return t && t.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function V(t) {
  if (t && /[\xC0-\xFF\u0100-\u017E]/.test(t)) {
    let e = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let n in e) t = t.replace(e[n], n);
  }
  return t;
}
function Ur(t) {
  return A(t, !1) ? t[0].toUpperCase() + t.slice(1) : t;
}
function tn(t) {
  return A(t) ? t.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : t;
}
function nt() {
  let t = /* @__PURE__ */ new Map();
  return { on(e, n) {
    let r = t.get(e);
    return r ? r.push(n) : r = [n], t.set(e, r), this;
  }, off(e, n) {
    let r = t.get(e);
    return r && r.splice(r.indexOf(n) >>> 0, 1), this;
  }, emit(e, n) {
    let r = t.get(e);
    r && r.forEach((o) => {
      o(n);
    });
  }, clear() {
    t.clear();
  } };
}
function Wr(...t) {
  if (t) {
    let e = [];
    for (let n = 0; n < t.length; n++) {
      let r = t[n];
      if (!r) continue;
      let o = typeof r;
      if (o === "string" || o === "number") e.push(r);
      else if (o === "object") {
        let s = Array.isArray(r) ? [Wr(...r)] : Object.entries(r).map(([a, l]) => l ? a : void 0);
        e = s.length ? e.concat(s.filter((a) => !!a)) : e;
      }
    }
    return e.join(" ").trim();
  }
}
function Hr(t, e) {
  return t ? t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className) : !1;
}
function Fr(t, e) {
  if (t && e) {
    let n = (r) => {
      Hr(t, r) || (t.classList ? t.classList.add(r) : t.className += " " + r);
    };
    [e].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Be(t, e) {
  if (t && e) {
    let n = (r) => {
      t.classList ? t.classList.remove(r) : t.className = t.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Ke(t) {
  for (let e of document?.styleSheets) try {
    for (let n of e?.cssRules) for (let r of n?.style) if (t.test(r)) return { name: r, value: n.style.getPropertyValue(r).trim() };
  } catch {
  }
  return null;
}
function nn(t) {
  let e = { width: 0, height: 0 };
  if (t) {
    let [n, r] = [t.style.visibility, t.style.display], o = t.getBoundingClientRect();
    t.style.visibility = "hidden", t.style.display = "block", e.width = o.width || t.offsetWidth, e.height = o.height || t.offsetHeight, t.style.display = r, t.style.visibility = n;
  }
  return e;
}
function rn() {
  let t = window, e = document, n = e.documentElement, r = e.getElementsByTagName("body")[0], o = t.innerWidth || n.clientWidth || r.clientWidth, s = t.innerHeight || n.clientHeight || r.clientHeight;
  return { width: o, height: s };
}
function Ye(t) {
  return t ? Math.abs(t.scrollLeft) : 0;
}
function zr() {
  let t = document.documentElement;
  return (window.pageXOffset || Ye(t)) - (t.clientLeft || 0);
}
function Kr() {
  let t = document.documentElement;
  return (window.pageYOffset || t.scrollTop) - (t.clientTop || 0);
}
function Yr(t) {
  return t ? getComputedStyle(t).direction === "rtl" : !1;
}
function zi(t, e, n = !0) {
  var r, o, s, a;
  if (t) {
    let l = t.offsetParent ? { width: t.offsetWidth, height: t.offsetHeight } : nn(t), i = l.height, u = l.width, d = e.offsetHeight, c = e.offsetWidth, m = e.getBoundingClientRect(), p = Kr(), f = zr(), v = rn(), g, y, _ = "top";
    m.top + d + i > v.height ? (g = m.top + p - i, _ = "bottom", g < 0 && (g = p)) : g = d + m.top + p, m.left + u > v.width ? y = Math.max(0, m.left + f + c - u) : y = m.left + f, Yr(t) ? t.style.insetInlineEnd = y + "px" : t.style.insetInlineStart = y + "px", t.style.top = g + "px", t.style.transformOrigin = _, n && (t.style.marginTop = _ === "bottom" ? `calc(${(o = (r = Ke(/-anchor-gutter$/)) == null ? void 0 : r.value) != null ? o : "2px"} * -1)` : (a = (s = Ke(/-anchor-gutter$/)) == null ? void 0 : s.value) != null ? a : "");
  }
}
function Ki(t, e) {
  t && (typeof e == "string" ? t.style.cssText = e : Object.entries(e || {}).forEach(([n, r]) => t.style[n] = r));
}
function qr(t, e) {
  return t instanceof HTMLElement ? t.offsetWidth : 0;
}
function Yi(t, e, n = !0, r = void 0) {
  var o;
  if (t) {
    let s = t.offsetParent ? { width: t.offsetWidth, height: t.offsetHeight } : nn(t), a = e.offsetHeight, l = e.getBoundingClientRect(), i = rn(), u, d, c = r ?? "top";
    if (!r && l.top + a + s.height > i.height ? (u = -1 * s.height, c = "bottom", l.top + u < 0 && (u = -1 * l.top)) : u = a, s.width > i.width ? d = l.left * -1 : l.left + s.width > i.width ? d = (l.left + s.width - i.width) * -1 : d = 0, t.style.top = u + "px", t.style.insetInlineStart = d + "px", t.style.transformOrigin = c, n) {
      let m = (o = Ke(/-anchor-gutter$/)) == null ? void 0 : o.value;
      t.style.marginTop = c === "bottom" ? `calc(${m ?? "2px"} * -1)` : m ?? "";
    }
  }
}
function on(t) {
  if (t) {
    let e = t.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function Gr(t) {
  return !!(t !== null && typeof t < "u" && t.nodeName && on(t));
}
function me(t) {
  return typeof Element < "u" ? t instanceof Element : t !== null && typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
}
function Ne(t, e = {}) {
  if (me(t)) {
    let n = (r, o) => {
      var s, a;
      let l = (s = t?.$attrs) != null && s[r] ? [(a = t?.$attrs) == null ? void 0 : a[r]] : [];
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
      }, l);
    };
    Object.entries(e).forEach(([r, o]) => {
      if (o != null) {
        let s = r.match(/^on(.+)/);
        s ? t.addEventListener(s[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? Ne(t, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (t.$attrs = t.$attrs || {}) && (t.$attrs[r] = o), t.setAttribute(r, o));
      }
    });
  }
}
function Jr(t, e = {}, ...n) {
  {
    let r = document.createElement(t);
    return Ne(r, e), r.append(...n), r;
  }
}
function Qr(t, e) {
  return me(t) ? Array.from(t.querySelectorAll(e)) : [];
}
function sn(t, e) {
  return me(t) ? t.matches(e) ? t : t.querySelector(e) : null;
}
function qi(t, e) {
  t && document.activeElement !== t && t.focus(e);
}
function Zr(t, e) {
  if (me(t)) {
    let n = t.getAttribute(e);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function an(t, e = "") {
  let n = Qr(t, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`), r = [];
  for (let o of n) getComputedStyle(o).display != "none" && getComputedStyle(o).visibility != "hidden" && r.push(o);
  return r;
}
function Gi(t, e) {
  let n = an(t, e);
  return n.length > 0 ? n[0] : null;
}
function pt(t) {
  if (t) {
    let e = t.offsetHeight, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), e;
  }
  return 0;
}
function Ji(t, e) {
  let n = an(t, e);
  return n.length > 0 ? n[n.length - 1] : null;
}
function Xr(t) {
  if (t) {
    let e = t.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || Ye(document.documentElement) || Ye(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function eo(t, e) {
  return t ? t.offsetHeight : 0;
}
function ln(t, e = []) {
  let n = on(t);
  return n === null ? e : ln(n, e.concat([n]));
}
function to(t) {
  let e = [];
  if (t) {
    let n = ln(t), r = /(auto|scroll)/, o = (s) => {
      try {
        let a = window.getComputedStyle(s, null);
        return r.test(a.getPropertyValue("overflow")) || r.test(a.getPropertyValue("overflowX")) || r.test(a.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let s of n) {
      let a = s.nodeType === 1 && s.dataset.scrollselectors;
      if (a) {
        let l = a.split(",");
        for (let i of l) {
          let u = sn(s, i);
          u && o(u) && e.push(u);
        }
      }
      s.nodeType !== 9 && o(s) && e.push(s);
    }
  }
  return e;
}
function ft(t) {
  if (t) {
    let e = t.offsetWidth, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), e;
  }
  return 0;
}
function Qi() {
  return /(android)/i.test(navigator.userAgent);
}
function un() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Zi(t) {
  return !!(t && t.offsetParent != null);
}
function Xi() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function no(t, e = "", n) {
  me(t) && n !== null && n !== void 0 && t.setAttribute(e, n);
}
var xe = {};
function ro(t = "pui_id_") {
  return Object.hasOwn(xe, t) || (xe[t] = 0), xe[t]++, `${t}${xe[t]}`;
}
function oo() {
  let t = [], e = (a, l, i = 999) => {
    let u = o(a, l, i), d = u.value + (u.key === a ? 0 : i) + 1;
    return t.push({ key: a, value: d }), d;
  }, n = (a) => {
    t = t.filter((l) => l.value !== a);
  }, r = (a, l) => o(a).value, o = (a, l, i = 0) => [...t].reverse().find((u) => !0) || { key: a, value: i }, s = (a) => a && parseInt(a.style.zIndex, 10) || 0;
  return { get: s, set: (a, l, i) => {
    l && (l.style.zIndex = String(e(a, !0, i)));
  }, clear: (a) => {
    a && (n(s(a)), a.style.zIndex = "");
  }, getCurrent: (a) => r(a) };
}
var es = oo(), io = Object.defineProperty, so = Object.defineProperties, ao = Object.getOwnPropertyDescriptors, Ve = Object.getOwnPropertySymbols, dn = Object.prototype.hasOwnProperty, cn = Object.prototype.propertyIsEnumerable, ht = (t, e, n) => e in t ? io(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, I = (t, e) => {
  for (var n in e || (e = {})) dn.call(e, n) && ht(t, n, e[n]);
  if (Ve) for (var n of Ve(e)) cn.call(e, n) && ht(t, n, e[n]);
  return t;
}, Ue = (t, e) => so(t, ao(e)), W = (t, e) => {
  var n = {};
  for (var r in t) dn.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ve) for (var r of Ve(t)) e.indexOf(r) < 0 && cn.call(t, r) && (n[r] = t[r]);
  return n;
}, lo = nt(), E = lo, ge = /{([^}]*)}/g, mn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, pn = /var\([^)]+\)/g;
function gt(t) {
  return A(t) ? t.replace(/[A-Z]/g, (e, n) => n === 0 ? e : "." + e.toLowerCase()).toLowerCase() : t;
}
function uo(t) {
  return B(t) && t.hasOwnProperty("$value") && t.hasOwnProperty("$type") ? t.$value : t;
}
function co(t) {
  return t.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function qe(t = "", e = "") {
  return co(`${A(t, !1) && A(e, !1) ? `${t}-` : t}${e}`);
}
function fn(t = "", e = "") {
  return `--${qe(t, e)}`;
}
function mo(t = "") {
  let e = (t.match(/{/g) || []).length, n = (t.match(/}/g) || []).length;
  return (e + n) % 2 !== 0;
}
function hn(t, e = "", n = "", r = [], o) {
  if (A(t)) {
    let s = t.trim();
    if (mo(s)) return;
    if (ne(s, ge)) {
      let a = s.replaceAll(ge, (l) => {
        let i = l.replace(/{|}/g, "").split(".").filter((u) => !r.some((d) => ne(u, d)));
        return `var(${fn(n, tn(i.join("-")))}${O(o) ? `, ${o}` : ""})`;
      });
      return ne(a.replace(pn, "0"), mn) ? `calc(${a})` : a;
    }
    return s;
  } else if (Mr(t)) return t;
}
function po(t, e, n) {
  A(e, !1) && t.push(`${e}:${n};`);
}
function ue(t, e) {
  return t ? `${t}{${e}}` : "";
}
function gn(t, e) {
  if (t.indexOf("dt(") === -1) return t;
  function n(a, l) {
    let i = [], u = 0, d = "", c = null, m = 0;
    for (; u <= a.length; ) {
      let p = a[u];
      if ((p === '"' || p === "'" || p === "`") && a[u - 1] !== "\\" && (c = c === p ? null : p), !c && (p === "(" && m++, p === ")" && m--, (p === "," || u === a.length) && m === 0)) {
        let f = d.trim();
        f.startsWith("dt(") ? i.push(gn(f, l)) : i.push(r(f)), d = "", u++;
        continue;
      }
      p !== void 0 && (d += p), u++;
    }
    return i;
  }
  function r(a) {
    let l = a[0];
    if ((l === '"' || l === "'" || l === "`") && a[a.length - 1] === l) return a.slice(1, -1);
    let i = Number(a);
    return isNaN(i) ? a : i;
  }
  let o = [], s = [];
  for (let a = 0; a < t.length; a++) if (t[a] === "d" && t.slice(a, a + 3) === "dt(") s.push(a), a += 2;
  else if (t[a] === ")" && s.length > 0) {
    let l = s.pop();
    s.length === 0 && o.push([l, a]);
  }
  if (!o.length) return t;
  for (let a = o.length - 1; a >= 0; a--) {
    let [l, i] = o[a], u = t.slice(l + 3, i), d = n(u, e), c = e(...d);
    t = t.slice(0, l) + c + t.slice(i + 1);
  }
  return t;
}
var re = (...t) => fo(T.getTheme(), ...t), fo = (t = {}, e, n, r) => {
  if (e) {
    let { variable: o, options: s } = T.defaults || {}, { prefix: a, transform: l } = t?.options || s || {}, i = ne(e, ge) ? e : `{${e}}`;
    return r === "value" || Pe(r) && l === "strict" ? T.getTokenValue(e) : hn(i, void 0, a, [o.excludedKeyRegex], n);
  }
  return "";
};
function ke(t, ...e) {
  if (t instanceof Array) {
    let n = t.reduce((r, o, s) => {
      var a;
      return r + o + ((a = j(e[s], { dt: re })) != null ? a : "");
    }, "");
    return gn(n, re);
  }
  return j(t, { dt: re });
}
function ho(t, e = {}) {
  let n = T.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: s = n.excludedKeyRegex } = e, a = [], l = [], i = [{ node: t, path: r }];
  for (; i.length; ) {
    let { node: d, path: c } = i.pop();
    for (let m in d) {
      let p = d[m], f = uo(p), v = ne(m, s) ? qe(c) : qe(c, tn(m));
      if (B(f)) i.push({ node: f, path: v });
      else {
        let g = fn(v), y = hn(f, v, r, [s]);
        po(l, g, y);
        let _ = v;
        r && _.startsWith(r + "-") && (_ = _.slice(r.length + 1)), a.push(_.replace(/-/g, "."));
      }
    }
  }
  let u = l.join("");
  return { value: l, tokens: a, declarations: u, css: ue(o, u) };
}
var R = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(t) {
  return { type: "class", selector: t, matched: this.pattern.test(t.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(t) {
  return { type: "attr", selector: `:root${t},:host${t}`, matched: this.pattern.test(t.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(t) {
  return { type: "media", selector: t, matched: this.pattern.test(t.trim()) };
} }, system: { pattern: /^system$/, resolve(t) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(t.trim()) };
} }, custom: { resolve(t) {
  return { type: "custom", selector: t, matched: !0 };
} } }, resolve(t) {
  let e = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [t].flat().map((n) => {
    var r;
    return (r = e.map((o) => o.resolve(n)).find((o) => o.matched)) != null ? r : this.rules.custom.resolve(n);
  });
} }, _toVariables(t, e) {
  return ho(t, { prefix: e?.prefix });
}, getCommon({ name: t = "", theme: e = {}, params: n, set: r, defaults: o }) {
  var s, a, l, i, u, d, c;
  let { preset: m, options: p } = e, f, v, g, y, _, P, h;
  if (O(m) && p.transform !== "strict") {
    let { primitive: S, semantic: k, extend: N } = m, F = k || {}, { colorScheme: z } = F, J = W(F, ["colorScheme"]), K = N || {}, { colorScheme: Q } = K, Z = W(K, ["colorScheme"]), Y = z || {}, { dark: X } = Y, oe = W(Y, ["dark"]), ee = Q || {}, { dark: ie } = ee, se = W(ee, ["dark"]), U = O(S) ? this._toVariables({ primitive: S }, p) : {}, D = O(J) ? this._toVariables({ semantic: J }, p) : {}, te = O(oe) ? this._toVariables({ light: oe }, p) : {}, Oe = O(X) ? this._toVariables({ dark: X }, p) : {}, ae = O(Z) ? this._toVariables({ semantic: Z }, p) : {}, it = O(se) ? this._toVariables({ light: se }, p) : {}, st = O(ie) ? this._toVariables({ dark: ie }, p) : {}, [wn, Tn] = [(s = U.declarations) != null ? s : "", U.tokens], [Pn, On] = [(a = D.declarations) != null ? a : "", D.tokens || []], [Cn, xn] = [(l = te.declarations) != null ? l : "", te.tokens || []], [kn, En] = [(i = Oe.declarations) != null ? i : "", Oe.tokens || []], [Ln, An] = [(u = ae.declarations) != null ? u : "", ae.tokens || []], [jn, Nn] = [(d = it.declarations) != null ? d : "", it.tokens || []], [Vn, Rn] = [(c = st.declarations) != null ? c : "", st.tokens || []];
    f = this.transformCSS(t, wn, "light", "variable", p, r, o), v = Tn;
    let In = this.transformCSS(t, `${Pn}${Cn}`, "light", "variable", p, r, o), Dn = this.transformCSS(t, `${kn}`, "dark", "variable", p, r, o);
    g = `${In}${Dn}`, y = [.../* @__PURE__ */ new Set([...On, ...xn, ...En])];
    let Mn = this.transformCSS(t, `${Ln}${jn}color-scheme:light`, "light", "variable", p, r, o), Bn = this.transformCSS(t, `${Vn}color-scheme:dark`, "dark", "variable", p, r, o);
    _ = `${Mn}${Bn}`, P = [.../* @__PURE__ */ new Set([...An, ...Nn, ...Rn])], h = j(m.css, { dt: re });
  }
  return { primitive: { css: f, tokens: v }, semantic: { css: g, tokens: y }, global: { css: _, tokens: P }, style: h };
}, getPreset({ name: t = "", preset: e = {}, options: n, params: r, set: o, defaults: s, selector: a }) {
  var l, i, u;
  let d, c, m;
  if (O(e) && n.transform !== "strict") {
    let p = t.replace("-directive", ""), f = e, { colorScheme: v, extend: g, css: y } = f, _ = W(f, ["colorScheme", "extend", "css"]), P = g || {}, { colorScheme: h } = P, S = W(P, ["colorScheme"]), k = v || {}, { dark: N } = k, F = W(k, ["dark"]), z = h || {}, { dark: J } = z, K = W(z, ["dark"]), Q = O(_) ? this._toVariables({ [p]: I(I({}, _), S) }, n) : {}, Z = O(F) ? this._toVariables({ [p]: I(I({}, F), K) }, n) : {}, Y = O(N) ? this._toVariables({ [p]: I(I({}, N), J) }, n) : {}, [X, oe] = [(l = Q.declarations) != null ? l : "", Q.tokens || []], [ee, ie] = [(i = Z.declarations) != null ? i : "", Z.tokens || []], [se, U] = [(u = Y.declarations) != null ? u : "", Y.tokens || []], D = this.transformCSS(p, `${X}${ee}`, "light", "variable", n, o, s, a), te = this.transformCSS(p, se, "dark", "variable", n, o, s, a);
    d = `${D}${te}`, c = [.../* @__PURE__ */ new Set([...oe, ...ie, ...U])], m = j(y, { dt: re });
  }
  return { css: d, tokens: c, style: m };
}, getPresetC({ name: t = "", theme: e = {}, params: n, set: r, defaults: o }) {
  var s;
  let { preset: a, options: l } = e, i = (s = a?.components) == null ? void 0 : s[t];
  return this.getPreset({ name: t, preset: i, options: l, params: n, set: r, defaults: o });
}, getPresetD({ name: t = "", theme: e = {}, params: n, set: r, defaults: o }) {
  var s, a;
  let l = t.replace("-directive", ""), { preset: i, options: u } = e, d = ((s = i?.components) == null ? void 0 : s[l]) || ((a = i?.directives) == null ? void 0 : a[l]);
  return this.getPreset({ name: l, preset: d, options: u, params: n, set: r, defaults: o });
}, applyDarkColorScheme(t) {
  return !(t.darkModeSelector === "none" || t.darkModeSelector === !1);
}, getColorSchemeOption(t, e) {
  var n;
  return this.applyDarkColorScheme(t) ? this.regex.resolve(t.darkModeSelector === !0 ? e.options.darkModeSelector : (n = t.darkModeSelector) != null ? n : e.options.darkModeSelector) : [];
}, getLayerOrder(t, e = {}, n, r) {
  let { cssLayer: o } = e;
  return o ? `@layer ${j(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: t = "", theme: e = {}, params: n, props: r = {}, set: o, defaults: s }) {
  let a = this.getCommon({ name: t, theme: e, params: n, set: o, defaults: s }), l = Object.entries(r).reduce((i, [u, d]) => i.push(`${u}="${d}"`) && i, []).join(" ");
  return Object.entries(a || {}).reduce((i, [u, d]) => {
    if (B(d) && Object.hasOwn(d, "css")) {
      let c = he(d.css), m = `${u}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${m}" ${l}>${c}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: t = "", theme: e = {}, params: n, props: r = {}, set: o, defaults: s }) {
  var a;
  let l = { name: t, theme: e, params: n, set: o, defaults: s }, i = (a = t.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : a.css, u = Object.entries(r).reduce((d, [c, m]) => d.push(`${c}="${m}"`) && d, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${t}-variables" ${u}>${he(i)}</style>` : "";
}, createTokens(t = {}, e, n = "", r = "", o = {}) {
  let s = function(l, i = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: i, value: void 0 };
    u.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && ge.test(this.value)) {
      let c = this.value.trim().replace(ge, (m) => {
        var p;
        let f = m.slice(1, -1), v = this.tokens[f];
        if (!v) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
        let g = v.computed(l, i, u);
        return Array.isArray(g) && g.length === 2 ? `light-dark(${g[0].value},${g[1].value})` : (p = g?.value) != null ? p : "__UNRESOLVED__";
      });
      d = mn.test(c.replace(pn, "0")) ? `calc(${c})` : c;
    }
    return Pe(i.binding) && delete i.binding, u.pop(), { colorScheme: l, path: this.path, paths: i, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, a = (l, i, u) => {
    Object.entries(l).forEach(([d, c]) => {
      let m = ne(d, e.variable.excludedKeyRegex) ? i : i ? `${i}.${gt(d)}` : gt(d), p = u ? `${u}.${d}` : d;
      B(c) ? a(c, m, p) : (o[m] || (o[m] = { paths: [], computed: (f, v = {}, g = []) => {
        if (o[m].paths.length === 1) return o[m].paths[0].computed(o[m].paths[0].scheme, v.binding, g);
        if (f && f !== "none") for (let y = 0; y < o[m].paths.length; y++) {
          let _ = o[m].paths[y];
          if (_.scheme === f) return _.computed(f, v.binding, g);
        }
        return o[m].paths.map((y) => y.computed(y.scheme, v[y.scheme], g));
      } }), o[m].paths.push({ path: p, value: c, scheme: p.includes("colorScheme.light") ? "light" : p.includes("colorScheme.dark") ? "dark" : "none", computed: s, tokens: o }));
    });
  };
  return a(t, n, r), o;
}, getTokenValue(t, e, n) {
  var r;
  let o = ((l) => l.split(".").filter((i) => !ne(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(e), s = e.includes("colorScheme.light") ? "light" : e.includes("colorScheme.dark") ? "dark" : void 0, a = [(r = t[o]) == null ? void 0 : r.computed(s)].flat().filter((l) => l);
  return a.length === 1 ? a[0].value : a.reduce((l = {}, i) => {
    let u = i, { colorScheme: d } = u, c = W(u, ["colorScheme"]);
    return l[d] = c, l;
  }, void 0);
}, getSelectorRule(t, e, n, r) {
  return n === "class" || n === "attr" ? ue(O(e) ? `${t}${e},${t} ${e}` : t, r) : ue(t, ue(e ?? ":root,:host", r));
}, transformCSS(t, e, n, r, o = {}, s, a, l) {
  if (O(e)) {
    let { cssLayer: i } = o;
    if (r !== "style") {
      let u = this.getColorSchemeOption(o, a);
      e = n === "dark" ? u.reduce((d, { type: c, selector: m }) => (O(m) && (d += m.includes("[CSS]") ? m.replace("[CSS]", e) : this.getSelectorRule(m, l, c, e)), d), "") : ue(l ?? ":root,:host", e);
    }
    if (i) {
      let u = { name: "primeui" };
      B(i) && (u.name = j(i.name, { name: t, type: r })), O(u.name) && (e = ue(`@layer ${u.name}`, e), s?.layerNames(u.name));
    }
    return e;
  }
  return "";
} }, T = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(t = {}) {
  let { theme: e } = t;
  e && (this._theme = Ue(I({}, e), { options: I(I({}, this.defaults.options), e.options) }), this._tokens = R.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var t;
  return ((t = this.theme) == null ? void 0 : t.preset) || {};
}, get options() {
  var t;
  return ((t = this.theme) == null ? void 0 : t.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(t) {
  this.update({ theme: t }), E.emit("theme:change", t);
}, getPreset() {
  return this.preset;
}, setPreset(t) {
  this._theme = Ue(I({}, this.theme), { preset: t }), this._tokens = R.createTokens(t, this.defaults), this.clearLoadedStyleNames(), E.emit("preset:change", t), E.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(t) {
  this._theme = Ue(I({}, this.theme), { options: t }), this.clearLoadedStyleNames(), E.emit("options:change", t), E.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(t) {
  this._layerNames.add(t);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(t) {
  return this._loadedStyleNames.has(t);
}, setLoadedStyleName(t) {
  this._loadedStyleNames.add(t);
}, deleteLoadedStyleName(t) {
  this._loadedStyleNames.delete(t);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(t) {
  return R.getTokenValue(this.tokens, t, this.defaults);
}, getCommon(t = "", e) {
  return R.getCommon({ name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPresetC(n);
}, getDirective(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPresetD(n);
}, getCustomPreset(t = "", e, n, r) {
  let o = { name: t, preset: e, options: this.options, selector: n, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPreset(o);
}, getLayerOrderCSS(t = "") {
  return R.getLayerOrder(t, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(t = "", e, n = "style", r) {
  return R.transformCSS(t, e, r, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(t = "", e, n = {}) {
  return R.getCommonStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(t, e, n = {}) {
  return R.getStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(t) {
  this._loadingStyles.add(t);
}, onStyleUpdated(t) {
  this._loadingStyles.add(t);
}, onStyleLoaded(t, { name: e }) {
  this._loadingStyles.size && (this._loadingStyles.delete(e), E.emit(`theme:${e}:load`, t), !this._loadingStyles.size && E.emit("theme:load"));
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
};
function vt(t, e) {
  var n = typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (!n) {
    if (Array.isArray(t) || (n = go(t)) || e) {
      n && (t = n);
      var r = 0, o = function() {
      };
      return { s: o, n: function() {
        return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] };
      }, e: function(u) {
        throw u;
      }, f: o };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var s, a = !0, l = !1;
  return { s: function() {
    n = n.call(t);
  }, n: function() {
    var u = n.next();
    return a = u.done, u;
  }, e: function(u) {
    l = !0, s = u;
  }, f: function() {
    try {
      a || n.return == null || n.return();
    } finally {
      if (l) throw s;
    }
  } };
}
function go(t, e) {
  if (t) {
    if (typeof t == "string") return yt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? yt(t, e) : void 0;
  }
}
function yt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
var ts = {
  filter: function(e, n, r, o, s) {
    var a = [];
    if (!e)
      return a;
    var l = vt(e), i;
    try {
      for (l.s(); !(i = l.n()).done; ) {
        var u = i.value;
        if (typeof u == "string") {
          if (this.filters[o](u, r, s)) {
            a.push(u);
            continue;
          }
        } else {
          var d = vt(n), c;
          try {
            for (d.s(); !(c = d.n()).done; ) {
              var m = c.value, p = ze(u, m);
              if (this.filters[o](p, r, s)) {
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
    startsWith: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var o = V(n.toString()).toLocaleLowerCase(r), s = V(e.toString()).toLocaleLowerCase(r);
      return s.slice(0, o.length) === o;
    },
    contains: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var o = V(n.toString()).toLocaleLowerCase(r), s = V(e.toString()).toLocaleLowerCase(r);
      return s.indexOf(o) !== -1;
    },
    notContains: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var o = V(n.toString()).toLocaleLowerCase(r), s = V(e.toString()).toLocaleLowerCase(r);
      return s.indexOf(o) === -1;
    },
    endsWith: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var o = V(n.toString()).toLocaleLowerCase(r), s = V(e.toString()).toLocaleLowerCase(r);
      return s.indexOf(o, s.length - o.length) !== -1;
    },
    equals: function(e, n, r) {
      return n == null || n === "" ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() === n.getTime() : V(e.toString()).toLocaleLowerCase(r) == V(n.toString()).toLocaleLowerCase(r);
    },
    notEquals: function(e, n, r) {
      return n == null || n === "" ? !1 : e == null ? !0 : e.getTime && n.getTime ? e.getTime() !== n.getTime() : V(e.toString()).toLocaleLowerCase(r) != V(n.toString()).toLocaleLowerCase(r);
    },
    in: function(e, n) {
      if (n == null || n.length === 0)
        return !0;
      for (var r = 0; r < n.length; r++)
        if (Ir(e, n[r]))
          return !0;
      return !1;
    },
    between: function(e, n) {
      return n == null || n[0] == null || n[1] == null ? !0 : e == null ? !1 : e.getTime ? n[0].getTime() <= e.getTime() && e.getTime() <= n[1].getTime() : n[0] <= e && e <= n[1];
    },
    lt: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() < n.getTime() : e < n;
    },
    lte: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() <= n.getTime() : e <= n;
    },
    gt: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() > n.getTime() : e > n;
    },
    gte: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() >= n.getTime() : e >= n;
    },
    dateIs: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.toDateString() === n.toDateString());
    },
    dateIsNot: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.toDateString() !== n.toDateString());
    },
    dateBefore: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.getTime() < n.getTime());
    },
    dateAfter: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.getTime() > n.getTime());
    }
  },
  register: function(e, n) {
    this.filters[e] = n;
  }
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
function ve(t) {
  "@babel/helpers - typeof";
  return ve = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ve(t);
}
function bt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function _t(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? bt(Object(n), !0).forEach(function(r) {
      yo(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : bt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function yo(t, e, n) {
  return (e = bo(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function bo(t) {
  var e = _o(t, "string");
  return ve(e) == "symbol" ? e : e + "";
}
function _o(t, e) {
  if (ve(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (ve(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function So(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  at() && at().components ? Ht(t) : e ? t() : Yn(t);
}
var $o = 0;
function wo(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = H(!1), r = H(t), o = H(null), s = un() ? window.document : void 0, a = e.document, l = a === void 0 ? s : a, i = e.immediate, u = i === void 0 ? !0 : i, d = e.manual, c = d === void 0 ? !1 : d, m = e.name, p = m === void 0 ? "style_".concat(++$o) : m, f = e.id, v = f === void 0 ? void 0 : f, g = e.media, y = g === void 0 ? void 0 : g, _ = e.nonce, P = _ === void 0 ? void 0 : _, h = e.first, S = h === void 0 ? !1 : h, k = e.onMounted, N = k === void 0 ? void 0 : k, F = e.onUpdated, z = F === void 0 ? void 0 : F, J = e.onLoad, K = J === void 0 ? void 0 : J, Q = e.props, Z = Q === void 0 ? {} : Q, Y = function() {
  }, X = function(ie) {
    var se = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var U = _t(_t({}, Z), se), D = U.name || p, te = U.id || v, Oe = U.nonce || P;
      o.value = l.querySelector('style[data-primevue-style-id="'.concat(D, '"]')) || l.getElementById(te) || l.createElement("style"), o.value.isConnected || (r.value = ie || t, Ne(o.value, {
        type: "text/css",
        id: te,
        media: y,
        nonce: Oe
      }), S ? l.head.prepend(o.value) : l.head.appendChild(o.value), no(o.value, "data-primevue-style-id", D), Ne(o.value, U), o.value.onload = function(ae) {
        return K?.(ae, {
          name: D
        });
      }, N?.(D)), !n.value && (Y = de(r, function(ae) {
        o.value.textContent = ae, z?.(D);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, oe = function() {
    !l || !n.value || (Y(), Gr(o.value) && l.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return u && !c && So(X), {
    id: v,
    name: p,
    el: o,
    css: r,
    unload: oe,
    load: X,
    isLoaded: Kn(n)
  };
}
function ye(t) {
  "@babel/helpers - typeof";
  return ye = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ye(t);
}
var St, $t, wt, Tt;
function Pt(t, e) {
  return Co(t) || Oo(t, e) || Po(t, e) || To();
}
function To() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Po(t, e) {
  if (t) {
    if (typeof t == "string") return Ot(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ot(t, e) : void 0;
  }
}
function Ot(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function Oo(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var r, o, s, a, l = [], i = !0, u = !1;
    try {
      if (s = (n = n.call(t)).next, e !== 0) for (; !(i = (r = s.call(n)).done) && (l.push(r.value), l.length !== e); i = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!i && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return l;
  }
}
function Co(t) {
  if (Array.isArray(t)) return t;
}
function Ct(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function We(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ct(Object(n), !0).forEach(function(r) {
      xo(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ct(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function xo(t, e, n) {
  return (e = ko(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ko(t) {
  var e = Eo(t, "string");
  return ye(e) == "symbol" ? e : e + "";
}
function Eo(t, e) {
  if (ye(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (ye(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Ee(t, e) {
  return e || (e = t.slice(0)), Object.freeze(Object.defineProperties(t, { raw: { value: Object.freeze(e) } }));
}
var Lo = function(e) {
  var n = e.dt;
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
}, Ao = {}, jo = {}, C = {
  name: "base",
  css: Lo,
  style: vo,
  classes: Ao,
  inlineStyles: jo,
  load: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(s) {
      return s;
    }, o = r(ke(St || (St = Ee(["", ""])), e));
    return O(o) ? wo(he(o), We({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, e);
  },
  loadStyle: function() {
    var e = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return T.transformCSS(n.name || e.name, "".concat(o).concat(ke($t || ($t = Ee(["", ""])), r)));
    });
  },
  getCommonTheme: function(e) {
    return T.getCommon(this.name, e);
  },
  getComponentTheme: function(e) {
    return T.getComponent(this.name, e);
  },
  getDirectiveTheme: function(e) {
    return T.getDirective(this.name, e);
  },
  getPresetTheme: function(e, n, r) {
    return T.getCustomPreset(this.name, e, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return T.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = j(this.css, {
        dt: re
      }) || "", o = he(ke(wt || (wt = Ee(["", "", ""])), r, e)), s = Object.entries(n).reduce(function(a, l) {
        var i = Pt(l, 2), u = i[0], d = i[1];
        return a.push("".concat(u, '="').concat(d, '"')) && a;
      }, []).join(" ");
      return O(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(s, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return T.getCommonStyleSheet(this.name, e, n);
  },
  getThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [T.getStyleSheet(this.name, e, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), s = ke(Tt || (Tt = Ee(["", ""])), j(this.style, {
        dt: re
      })), a = he(T.transformCSS(o, s)), l = Object.entries(n).reduce(function(i, u) {
        var d = Pt(u, 2), c = d[0], m = d[1];
        return i.push("".concat(c, '="').concat(m, '"')) && i;
      }, []).join(" ");
      O(a) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(l, ">").concat(a, "</style>"));
    }
    return r.join("");
  },
  extend: function(e) {
    return We(We({}, this), {}, {
      css: void 0,
      style: void 0
    }, e);
  }
}, G = nt();
function be(t) {
  "@babel/helpers - typeof";
  return be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, be(t);
}
function xt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Le(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? xt(Object(n), !0).forEach(function(r) {
      No(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : xt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function No(t, e, n) {
  return (e = Vo(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Vo(t) {
  var e = Ro(t, "string");
  return be(e) == "symbol" ? e : e + "";
}
function Ro(t, e) {
  if (be(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (be(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Io = {
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
}, Do = Symbol();
function Mo(t, e) {
  var n = {
    config: qn(e)
  };
  return t.config.globalProperties.$primevue = n, t.provide(Do, n), Bo(), Uo(t, n), n;
}
var ce = [];
function Bo() {
  E.clear(), ce.forEach(function(t) {
    return t?.();
  }), ce = [];
}
function Uo(t, e) {
  var n = H(!1), r = function() {
    var u;
    if (((u = e.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !T.isStyleNameLoaded("common")) {
      var d, c, m = ((d = C.getCommonTheme) === null || d === void 0 ? void 0 : d.call(C)) || {}, p = m.primitive, f = m.semantic, v = m.global, g = m.style, y = {
        nonce: (c = e.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      C.load(p?.css, Le({
        name: "primitive-variables"
      }, y)), C.load(f?.css, Le({
        name: "semantic-variables"
      }, y)), C.load(v?.css, Le({
        name: "global-variables"
      }, y)), C.loadStyle(Le({
        name: "global-style"
      }, y), g), T.setLoadedStyleName("common");
    }
  };
  E.on("theme:change", function(i) {
    n.value || (t.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var o = de(e.config, function(i, u) {
    G.emit("config:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = de(function() {
    return e.config.ripple;
  }, function(i, u) {
    G.emit("config:ripple:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = de(function() {
    return e.config.theme;
  }, function(i, u) {
    n.value || T.setTheme(i), e.config.unstyled || r(), n.value = !1, G.emit("config:theme:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = de(function() {
    return e.config.unstyled;
  }, function(i, u) {
    !i && e.config.theme && r(), G.emit("config:unstyled:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ce.push(o), ce.push(s), ce.push(a), ce.push(l);
}
var Wo = {
  install: function(e, n) {
    var r = Br(Io, n);
    Mo(e, r);
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
    this.mounted = un();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function Ho(t, e, n, r, o, s) {
  return s.inline ? je(t.$slots, "default", {
    key: 0
  }) : o.mounted ? (Gn(), Jn(Ft, {
    key: 1,
    to: n.appendTo
  }, [je(t.$slots, "default")], 8, ["to"])) : zt("", !0);
}
vn.render = Ho;
var q = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(e) {
    return this._loadedStyleNames.has(e);
  },
  setLoadedStyleName: function(e) {
    this._loadedStyleNames.add(e);
  },
  deleteLoadedStyleName: function(e) {
    this._loadedStyleNames.delete(e);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function Fo() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", e = Qn();
  return "".concat(t).concat(e.replace("v-", "").replaceAll("-", "_"));
}
var kt = C.extend({
  name: "common"
});
function _e(t) {
  "@babel/helpers - typeof";
  return _e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, _e(t);
}
function zo(t) {
  return _n(t) || Ko(t) || bn(t) || yn();
}
function Ko(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function pe(t, e) {
  return _n(t) || Yo(t, e) || bn(t, e) || yn();
}
function yn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bn(t, e) {
  if (t) {
    if (typeof t == "string") return Ge(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ge(t, e) : void 0;
  }
}
function Ge(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function Yo(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var r, o, s, a, l = [], i = !0, u = !1;
    try {
      if (s = (n = n.call(t)).next, e === 0) {
        if (Object(n) !== n) return;
        i = !1;
      } else for (; !(i = (r = s.call(n)).done) && (l.push(r.value), l.length !== e); i = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!i && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return l;
  }
}
function _n(t) {
  if (Array.isArray(t)) return t;
}
function Et(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function $(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Et(Object(n), !0).forEach(function(r) {
      fe(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Et(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function fe(t, e, n) {
  return (e = qo(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function qo(t) {
  var e = Go(t, "string");
  return _e(e) == "symbol" ? e : e + "";
}
function Go(t, e) {
  if (_e(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (_e(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Jo = {
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
      handler: function(e) {
        E.off("theme:change", this._loadCoreStyles), e || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(e, n) {
        var r = this;
        E.off("theme:change", this._themeScopedListener), e ? (this._loadScopedThemeStyles(e), this._themeScopedListener = function() {
          return r._loadScopedThemeStyles(e);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var e, n, r, o, s, a, l, i, u, d, c, m = (e = this.pt) === null || e === void 0 ? void 0 : e._usept, p = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, f = m ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = f || p) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (s = o.onBeforeCreate) === null || s === void 0 || s.call(o);
    var v = (a = this.$primevueConfig) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a._usept, g = v ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, y = v ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = y || g) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = Fo(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var e;
    this.rootEl = sn(me(this.$el) ? this.$el : (e = this.$el) === null || e === void 0 ? void 0 : e.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = $({
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
    _hook: function(e) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(e)), r = this._useDefaultPT(this._getOptionValue, "hooks.".concat(e));
        n?.(), r?.();
      }
    },
    _mergeProps: function(e) {
      for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return De(e) ? e.apply(void 0, r) : Ae.apply(void 0, r);
    },
    _load: function() {
      q.isStyleNameLoaded("base") || (C.loadCSS(this.$styleOptions), this._loadGlobalStyles(), q.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var e, n;
      !q.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name && (kt.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), q.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var e = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      O(e) && C.load(e, $({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var e, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!T.isStyleNameLoaded("common")) {
          var r, o, s = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, a = s.primitive, l = s.semantic, i = s.global, u = s.style;
          C.load(a?.css, $({
            name: "primitive-variables"
          }, this.$styleOptions)), C.load(l?.css, $({
            name: "semantic-variables"
          }, this.$styleOptions)), C.load(i?.css, $({
            name: "global-variables"
          }, this.$styleOptions)), C.loadStyle($({
            name: "global-style"
          }, this.$styleOptions), u), T.setLoadedStyleName("common");
        }
        if (!T.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, m, p, f = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, v = f.css, g = f.style;
          (m = this.$style) === null || m === void 0 || m.load(v, $({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (p = this.$style) === null || p === void 0 || p.loadStyle($({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), g), T.setLoadedStyleName(this.$style.name);
        }
        if (!T.isStyleNameLoaded("layer-order")) {
          var y, _, P = (y = this.$style) === null || y === void 0 || (_ = y.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(y);
          C.load(P, $({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), T.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(e) {
      var n, r, o, s = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, e, "[".concat(this.$attrSelector, "]"))) || {}, a = s.css, l = (o = this.$style) === null || o === void 0 ? void 0 : o.load(a, $({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = l.el;
    },
    _unloadScopedThemeStyles: function() {
      var e;
      (e = this.scopedStyleEl) === null || e === void 0 || (e = e.value) === null || e === void 0 || e.remove();
    },
    _themeChangeListener: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      q.clearLoadedStyleNames(), E.on("theme:change", e);
    },
    _removeThemeListeners: function() {
      E.off("theme:change", this._loadCoreStyles), E.off("theme:change", this._load), E.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(e) {
      return e ? this.$options.hostName ? e.$.type.name === this.$options.hostName ? e : this._getHostInstance(e.$parentInstance) : e.$parentInstance : void 0;
    },
    _getPropValue: function(e) {
      var n;
      return this[e] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[e]);
    },
    _getOptionValue: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return tt(e, n, r);
    },
    _getPTValue: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, a = /./g.test(r) && !!o[r.split(".")[0]], l = this._getPropValue("ptOptions") || ((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.ptOptions) || {}, i = l.mergeSections, u = i === void 0 ? !0 : i, d = l.mergeProps, c = d === void 0 ? !1 : d, m = s ? a ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, p = a ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, $($({}, o), {}, {
        global: m || {}
      })), f = this._getPTDatasets(r);
      return u || !u && p ? c ? this._mergeProps(c, m, p, f) : $($($({}, m), p), f) : $($({}, p), f);
    },
    _getPTSelf: function() {
      for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return Ae(
        this._usePT.apply(this, [this._getPT(e, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var e, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", s = r === "root" && O((e = this.pt) === null || e === void 0 ? void 0 : e["data-pc-section"]);
      return r !== "transition" && $($({}, r === "root" && $($(fe({}, "".concat(o, "name"), M(s ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), s && fe({}, "".concat(o, "extend"), M(this.$.type.name))), {}, fe({}, "".concat(this.$attrSelector), ""))), {}, fe({}, "".concat(o, "section"), M(r)));
    },
    _getPTClassValue: function() {
      var e = this._getOptionValue.apply(this, arguments);
      return A(e) || en(e) ? {
        class: e
      } : e;
    },
    _getPT: function(e) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, s = function(l) {
        var i, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = o ? o(l) : l, c = M(r), m = M(n.$name);
        return (i = u ? c !== m ? d?.[c] : void 0 : d?.[c]) !== null && i !== void 0 ? i : d;
      };
      return e != null && e.hasOwnProperty("_usept") ? {
        _usept: e._usept,
        originalValue: s(e.originalValue),
        value: s(e.value)
      } : s(e, !0);
    },
    _usePT: function(e, n, r, o) {
      var s = function(v) {
        return n(v, r, o);
      };
      if (e != null && e.hasOwnProperty("_usept")) {
        var a, l = e._usept || ((a = this.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, i = l.mergeSections, u = i === void 0 ? !0 : i, d = l.mergeProps, c = d === void 0 ? !1 : d, m = s(e.originalValue), p = s(e.value);
        return m === void 0 && p === void 0 ? void 0 : A(p) ? p : A(m) ? m : u || !u && p ? c ? this._mergeProps(c, m, p) : $($({}, m), p) : p;
      }
      return s(e);
    },
    _useGlobalPT: function(e, n, r) {
      return this._usePT(this.globalPT, e, n, r);
    },
    _useDefaultPT: function(e, n, r) {
      return this._usePT(this.defaultPT, e, n, r);
    },
    ptm: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, e, $($({}, this.$params), n));
    },
    ptmi: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = Ae(this.$_attrsWithoutPT, this.ptm(n, r));
      return o?.hasOwnProperty("id") && ((e = o.id) !== null && e !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(e, n, $({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, e, $($({}, this.$params), n));
    },
    sx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, e, $($({}, this.$params), r)), s = this._getOptionValue(kt.inlineStyles, e, $($({}, this.$params), r));
        return [s, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(r) {
        return j(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, $({}, n.$params)) || j(r, $({}, n.$params));
      });
    },
    isUnstyled: function() {
      var e;
      return this.unstyled !== void 0 ? this.unstyled : (e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var e, n = Object.keys(((e = this.$.vnode) === null || e === void 0 ? void 0 : e.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(r) {
        var o = pe(r, 1), s = o[0];
        return n?.includes(s);
      }));
    },
    $theme: function() {
      var e;
      return (e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.theme;
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
      var e;
      return {
        nonce: (e = this.$primevueConfig) === null || e === void 0 || (e = e.csp) === null || e === void 0 ? void 0 : e.nonce
      };
    },
    $primevueConfig: function() {
      var e;
      return (e = this.$primevue) === null || e === void 0 ? void 0 : e.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var e = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: e,
          props: e?.$props,
          state: e?.$data,
          attrs: e?.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(e) {
        var n = pe(e, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(e, n) {
        var r = pe(n, 2), o = r[0], s = r[1], a = o.split(":"), l = zo(a), i = Ge(l).slice(1);
        return i?.reduce(function(u, d, c, m) {
          return !u[d] && (u[d] = c === m.length - 1 ? s : {}), u[d];
        }, e), e;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(e) {
        var n = pe(e, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(e, n) {
        var r = pe(n, 2), o = r[0], s = r[1];
        return e[o] = s, e;
      }, {});
    }
  }
}, Qo = `
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
`, Zo = {
  root: function(e) {
    var n = e.instance;
    return ["p-contextmenu p-component", {
      "p-contextmenu-mobile": n.queryMatches
    }];
  },
  rootList: "p-contextmenu-root-list",
  item: function(e) {
    var n = e.instance, r = e.processedItem;
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
C.extend({
  name: "contextmenu",
  style: Qo,
  classes: Zo
});
var Xo = `
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
`, ei = C.extend({
  name: "baseicon",
  css: Xo
});
function Se(t) {
  "@babel/helpers - typeof";
  return Se = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Se(t);
}
function Lt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function At(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Lt(Object(n), !0).forEach(function(r) {
      ti(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Lt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function ti(t, e, n) {
  return (e = ni(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ni(t) {
  var e = ri(t, "string");
  return Se(e) == "symbol" ? e : e + "";
}
function ri(t, e) {
  if (Se(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Se(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ns = {
  name: "BaseIcon",
  extends: Jo,
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
  style: ei,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var e = Pe(this.label);
      return At(At({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: e ? void 0 : "img",
        "aria-label": e ? void 0 : this.label,
        "aria-hidden": e
      });
    }
  }
};
function $e(t) {
  "@babel/helpers - typeof";
  return $e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, $e(t);
}
function jt(t, e) {
  return ai(t) || si(t, e) || ii(t, e) || oi();
}
function oi() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ii(t, e) {
  if (t) {
    if (typeof t == "string") return Nt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Nt(t, e) : void 0;
  }
}
function Nt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function si(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var r, o, s, a, l = [], i = !0, u = !1;
    try {
      if (s = (n = n.call(t)).next, e !== 0) for (; !(i = (r = s.call(n)).done) && (l.push(r.value), l.length !== e); i = !0) ;
    } catch (d) {
      u = !0, o = d;
    } finally {
      try {
        if (!i && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw o;
      }
    }
    return l;
  }
}
function ai(t) {
  if (Array.isArray(t)) return t;
}
function Vt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function w(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Vt(Object(n), !0).forEach(function(r) {
      Je(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Vt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function Je(t, e, n) {
  return (e = li(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function li(t) {
  var e = ui(t, "string");
  return $e(e) == "symbol" ? e : e + "";
}
function ui(t, e) {
  if ($e(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if ($e(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var b = {
  _getMeta: function() {
    return [B(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], j(B(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(e, n) {
    var r, o, s;
    return (r = (e == null || (o = e.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (s = n.ctx) === null || s === void 0 || (s = s.appContext) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.globalProperties) === null || s === void 0 ? void 0 : s.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: tt,
  _getPTValue: function() {
    var e, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var _ = b._getOptionValue.apply(b, arguments);
      return A(_) || en(_) ? {
        class: _
      } : _;
    }, u = ((e = r.binding) === null || e === void 0 || (e = e.value) === null || e === void 0 ? void 0 : e.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, m = u.mergeProps, p = m === void 0 ? !1 : m, f = l ? b._useDefaultPT(r, r.defaultPT(), i, s, a) : void 0, v = b._usePT(r, b._getPT(o, r.$name), i, s, w(w({}, a), {}, {
      global: f || {}
    })), g = b._getPTDatasets(r, s);
    return c || !c && v ? p ? b._mergeProps(r, p, f, v, g) : w(w(w({}, f), v), g) : w(w({}, v), g);
  },
  _getPTDatasets: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return w(w({}, n === "root" && Je({}, "".concat(r, "name"), M(e.$name))), {}, Je({}, "".concat(r, "section"), M(n)));
  },
  _getPT: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(a) {
      var l, i = r ? r(a) : a, u = M(n);
      return (l = i?.[u]) !== null && l !== void 0 ? l : i;
    };
    return e && Object.hasOwn(e, "_usept") ? {
      _usept: e._usept,
      originalValue: o(e.originalValue),
      value: o(e.value)
    } : o(e);
  },
  _usePT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, s = arguments.length > 4 ? arguments[4] : void 0, a = function(g) {
      return r(g, o, s);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, i = n._usept || ((l = e.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, u = i.mergeSections, d = u === void 0 ? !0 : u, c = i.mergeProps, m = c === void 0 ? !1 : c, p = a(n.originalValue), f = a(n.value);
      return p === void 0 && f === void 0 ? void 0 : A(f) ? f : A(p) ? p : d || !d && f ? m ? b._mergeProps(e, m, p, f) : w(w({}, p), f) : f;
    }
    return a(n);
  },
  _useDefaultPT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, s = arguments.length > 4 ? arguments[4] : void 0;
    return b._usePT(e, n, r, o, s);
  },
  _loadStyles: function() {
    var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, s = b._getConfig(r, o), a = {
      nonce: s == null || (e = s.csp) === null || e === void 0 ? void 0 : e.nonce
    };
    b._loadCoreStyles(n, a), b._loadThemeStyles(n, a), b._loadScopedThemeStyles(n, a), b._removeThemeListeners(n), n.$loadStyles = function() {
      return b._loadThemeStyles(n, a);
    }, b._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var e, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!q.isStyleNameLoaded((e = r.$style) === null || e === void 0 ? void 0 : e.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var s;
      C.loadCSS(o), (s = r.$style) === null || s === void 0 || s.loadCSS(o), q.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var e, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, s = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (e = o.theme) === null || e === void 0 ? void 0 : e.call(o)) === "none")) {
      if (!T.isStyleNameLoaded("common")) {
        var a, l, i = ((a = o.$style) === null || a === void 0 || (l = a.getCommonTheme) === null || l === void 0 ? void 0 : l.call(a)) || {}, u = i.primitive, d = i.semantic, c = i.global, m = i.style;
        C.load(u?.css, w({
          name: "primitive-variables"
        }, s)), C.load(d?.css, w({
          name: "semantic-variables"
        }, s)), C.load(c?.css, w({
          name: "global-variables"
        }, s)), C.loadStyle(w({
          name: "global-style"
        }, s), m), T.setLoadedStyleName("common");
      }
      if (!T.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var p, f, v, g, y = ((p = o.$style) === null || p === void 0 || (f = p.getDirectiveTheme) === null || f === void 0 ? void 0 : f.call(p)) || {}, _ = y.css, P = y.style;
        (v = o.$style) === null || v === void 0 || v.load(_, w({
          name: "".concat(o.$style.name, "-variables")
        }, s)), (g = o.$style) === null || g === void 0 || g.loadStyle(w({
          name: "".concat(o.$style.name, "-style")
        }, s), P), T.setLoadedStyleName(o.$style.name);
      }
      if (!T.isStyleNameLoaded("layer-order")) {
        var h, S, k = (h = o.$style) === null || h === void 0 || (S = h.getLayerOrderThemeCSS) === null || S === void 0 ? void 0 : S.call(h);
        C.load(k, w({
          name: "layer-order",
          first: !0
        }, s)), T.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = e.preset();
    if (r && e.$attrSelector) {
      var o, s, a, l = ((o = e.$style) === null || o === void 0 || (s = o.getPresetTheme) === null || s === void 0 ? void 0 : s.call(o, r, "[".concat(e.$attrSelector, "]"))) || {}, i = l.css, u = (a = e.$style) === null || a === void 0 ? void 0 : a.load(i, w({
        name: "".concat(e.$attrSelector, "-").concat(e.$style.name)
      }, n));
      e.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    q.clearLoadedStyleNames(), E.on("theme:change", e);
  },
  _removeThemeListeners: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    E.off("theme:change", e.$loadStyles), e.$loadStyles = void 0;
  },
  _hook: function(e, n, r, o, s, a) {
    var l, i, u = "on".concat(Ur(n)), d = b._getConfig(o, s), c = r?.$instance, m = b._usePT(c, b._getPT(o == null || (l = o.value) === null || l === void 0 ? void 0 : l.pt, e), b._getOptionValue, "hooks.".concat(u)), p = b._useDefaultPT(c, d == null || (i = d.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[e], b._getOptionValue, "hooks.".concat(u)), f = {
      el: r,
      binding: o,
      vnode: s,
      prevVnode: a
    };
    m?.(c, f), p?.(c, f);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var e = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return De(e) ? e.apply(void 0, r) : Ae.apply(void 0, r);
  },
  _extend: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(l, i, u, d, c) {
      var m, p, f, v;
      i._$instances = i._$instances || {};
      var g = b._getConfig(u, d), y = i._$instances[e] || {}, _ = Pe(y) ? w(w({}, n), n?.methods) : {};
      i._$instances[e] = w(w({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: e,
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
        $primevueConfig: g,
        $attrSelector: (m = i.$pd) === null || m === void 0 || (m = m[e]) === null || m === void 0 ? void 0 : m.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return b._getPT(g?.pt, void 0, function(h) {
            var S;
            return h == null || (S = h.directives) === null || S === void 0 ? void 0 : S[e];
          });
        },
        isUnstyled: function() {
          var h, S;
          return ((h = i._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (S = i._$instances[e]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.unstyled : g?.unstyled;
        },
        theme: function() {
          var h;
          return (h = i._$instances[e]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = i._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return b._getPTValue(i._$instances[e], (h = i._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, S, w({}, k));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", k = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return b._getPTValue(i._$instances[e], h, S, k, !1);
        },
        cx: function() {
          var h, S, k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", N = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = i._$instances[e]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : b._getOptionValue((S = i._$instances[e]) === null || S === void 0 || (S = S.$style) === null || S === void 0 ? void 0 : S.classes, k, w({}, N));
        },
        sx: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, N = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return k ? b._getOptionValue((h = i._$instances[e]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, S, w({}, N)) : void 0;
        }
      }, _), i.$instance = i._$instances[e], (p = (f = i.$instance)[l]) === null || p === void 0 || p.call(f, i, u, d, c), i["$".concat(e)] = i.$instance, b._hook(e, l, i, u, d, c), i.$pd || (i.$pd = {}), i.$pd[e] = w(w({}, (v = i.$pd) === null || v === void 0 ? void 0 : v[e]), {}, {
        name: e,
        instance: i._$instances[e]
      });
    }, o = function(l) {
      var i, u, d, c = l._$instances[e], m = c?.watch, p = function(g) {
        var y, _ = g.newValue, P = g.oldValue;
        return m == null || (y = m.config) === null || y === void 0 ? void 0 : y.call(c, _, P);
      }, f = function(g) {
        var y, _ = g.newValue, P = g.oldValue;
        return m == null || (y = m["config.ripple"]) === null || y === void 0 ? void 0 : y.call(c, _, P);
      };
      c.$watchersCallback = {
        config: p,
        "config.ripple": f
      }, m == null || (i = m.config) === null || i === void 0 || i.call(c, c?.$primevueConfig), G.on("config:change", p), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), G.on("config:ripple:change", f);
    }, s = function(l) {
      var i = l._$instances[e].$watchersCallback;
      i && (G.off("config:change", i.config), G.off("config:ripple:change", i["config.ripple"]), l._$instances[e].$watchersCallback = void 0);
    };
    return {
      created: function(l, i, u, d) {
        l.$pd || (l.$pd = {}), l.$pd[e] = {
          name: e,
          attrSelector: ro("pd")
        }, r("created", l, i, u, d);
      },
      beforeMount: function(l, i, u, d) {
        var c;
        b._loadStyles((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), r("beforeMount", l, i, u, d), o(l);
      },
      mounted: function(l, i, u, d) {
        var c;
        b._loadStyles((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), r("mounted", l, i, u, d);
      },
      beforeUpdate: function(l, i, u, d) {
        r("beforeUpdate", l, i, u, d);
      },
      updated: function(l, i, u, d) {
        var c;
        b._loadStyles((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), r("updated", l, i, u, d);
      },
      beforeUnmount: function(l, i, u, d) {
        var c;
        s(l), b._removeThemeListeners((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance), r("beforeUnmount", l, i, u, d);
      },
      unmounted: function(l, i, u, d) {
        var c;
        (c = l.$pd[e]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), r("unmounted", l, i, u, d);
      }
    };
  },
  extend: function() {
    var e = b._getMeta.apply(b, arguments), n = jt(e, 2), r = n[0], o = n[1];
    return w({
      extend: function() {
        var a = b._getMeta.apply(b, arguments), l = jt(a, 2), i = l[0], u = l[1];
        return b.extend(i, w(w(w({}, o), o?.methods), u));
      }
    }, b._extend(r, o));
  }
}, di = `
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
`, ci = {
  root: "p-ink"
}, mi = C.extend({
  name: "ripple-directive",
  style: di,
  classes: ci
}), pi = b.extend({
  style: mi
});
function we(t) {
  "@babel/helpers - typeof";
  return we = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, we(t);
}
function fi(t) {
  return yi(t) || vi(t) || gi(t) || hi();
}
function hi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function gi(t, e) {
  if (t) {
    if (typeof t == "string") return Qe(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Qe(t, e) : void 0;
  }
}
function vi(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function yi(t) {
  if (Array.isArray(t)) return Qe(t);
}
function Qe(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function Rt(t, e, n) {
  return (e = bi(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function bi(t) {
  var e = _i(t, "string");
  return we(e) == "symbol" ? e : e + "";
}
function _i(t, e) {
  if (we(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (we(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var rs = pi.extend("ripple", {
  watch: {
    "config.ripple": function(e) {
      e ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(e) {
    this.remove(e);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(e) {
      e.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(e) {
      e.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(e) {
      var n = this.getInk(e);
      n || (n = Jr("span", Rt(Rt({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), e.appendChild(n), this.$el = n);
    },
    remove: function(e) {
      var n = this.getInk(e);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(e), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(e) {
      var n = this, r = e.currentTarget, o = this.getInk(r);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && Be(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !pt(o) && !ft(o)) {
          var s = Math.max(qr(r), eo(r));
          o.style.height = s + "px", o.style.width = s + "px";
        }
        var a = Xr(r), l = e.pageX - a.left + document.body.scrollTop - ft(o) / 2, i = e.pageY - a.top + document.body.scrollLeft - pt(o) / 2;
        o.style.top = i + "px", o.style.left = l + "px", !this.isUnstyled() && Fr(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && Be(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(e) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Be(e.currentTarget, "p-ink-active"), e.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(e) {
      return e && e.children ? fi(e.children).find(function(n) {
        return Zr(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function Te(t) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Te(t);
}
function Si(t, e) {
  if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function $i(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, Ti(r.key), r);
  }
}
function wi(t, e, n) {
  return e && $i(t.prototype, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
}
function Ti(t) {
  var e = Pi(t, "string");
  return Te(e) == "symbol" ? e : e + "";
}
function Pi(t, e) {
  if (Te(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Te(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var os = /* @__PURE__ */ (function() {
  function t(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    Si(this, t), this.element = e, this.listener = n;
  }
  return wi(t, [{
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
})(), is = nt(), Oi = `
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
`, Ci = {
  root: function(e) {
    var n = e.props;
    return ["p-menu p-component", {
      "p-menu-overlay": n.popup
    }];
  },
  start: "p-menu-start",
  list: "p-menu-list",
  submenuLabel: "p-menu-submenu-label",
  separator: "p-menu-separator",
  end: "p-menu-end",
  item: function(e) {
    var n = e.instance;
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
C.extend({
  name: "menu",
  style: Oi,
  classes: Ci
});
const xi = "data-wippy-overlay-layer";
function Sn() {
  return typeof window < "u" && typeof window.document < "u";
}
function $n() {
  return Sn() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ki() {
  return $n() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Ei = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Li = 0;
const Re = /* @__PURE__ */ new WeakMap();
function It(t, e) {
  const n = t.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", e), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Ai(t, e) {
  if (!Ei.test(t.className))
    return;
  const n = t.style.cssText;
  It(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = n;
    return;
  }
  if (!Re.has(t)) {
    const r = new MutationObserver(() => {
      const o = t.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && It(t, e);
    });
    r.observe(t, { attributes: !0, attributeFilter: ["style"] }), Re.set(t, r);
  }
}
function rt(t) {
  const e = Re.get(t);
  e && (e.disconnect(), Re.delete(t));
}
function ji(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function Ze(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const Ie = /* @__PURE__ */ new Set(), ot = /* @__PURE__ */ new WeakMap();
let Dt = !1, Xe = !1;
function Ni() {
  Xe = !1;
  for (const t of Ie) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && rt(e);
      Ie.delete(t), ot.get(t)?.disconnect();
      continue;
    }
    t.childElementCount > 0 && Ze(t);
  }
}
function Mt() {
  Xe || (Xe = !0, requestAnimationFrame(Ni));
}
function Vi(t) {
  const e = document.createElement("div");
  e.setAttribute(xi, "");
  const n = $n();
  if (e.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && e.setAttribute("popover", "manual"), t.appendChild(e), n) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Ze(e);
  const r = new MutationObserver((o) => {
    const s = e.__wippyAnchorName;
    for (const a of o) {
      if (s)
        for (const l of Array.from(a.addedNodes))
          l instanceof HTMLElement && Ai(l, s);
      for (const l of Array.from(a.removedNodes))
        l instanceof HTMLElement && rt(l);
    }
    e.isConnected && e.childElementCount > 0 && Ze(e);
  });
  return r.observe(e, { childList: !0 }), ot.set(e, r), Ie.add(e), Dt || (Dt = !0, window.addEventListener("scroll", Mt, { capture: !0, passive: !0 }), window.addEventListener("resize", Mt, { passive: !0 })), e;
}
function Bt(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = Vi(t.hostRoot), ki())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++Li}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function Ut(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && rt(e);
    Ie.delete(t.layer), ot.get(t.layer)?.disconnect(), t.layer.remove(), t.layer = null;
  }
}
let Wt = !1;
function Ri() {
  if (Wt)
    return;
  Wt = !0;
  const t = vn;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    Sn() && (this.hostRoot = ji(this.$el), this.mounted = !0, this.hostRoot && (this.inline || Bt(this), this.$watch("inline", (e) => {
      e ? Ut(this) : Bt(this);
    })));
  }, t.render = function() {
    return this.inline ? je(this.$slots, "default", { key: 0 }) : this.mounted ? Zn(Ft, { key: 1, to: this.resolvedTarget || document.body }, [
      je(this.$slots, "default")
    ]) : zt("", !0);
  }, t.unmounted = function() {
    Ut(this);
  };
}
const ss = {
  install: (t) => {
    Ri(), t.use(Wo, { theme: "none" });
  }
};
export {
  Qi as $,
  C as B,
  os as C,
  zi as D,
  ts as F,
  Yi as I,
  Fi as J,
  Ji as L,
  Hi as M,
  is as O,
  Be as P,
  ft as R,
  Ki as S,
  pt as T,
  Wi as W,
  Xi as Y,
  O as a,
  vn as b,
  Fr as c,
  ns as d,
  Zi as e,
  Wr as f,
  rs as g,
  an as h,
  qi as i,
  Gi as j,
  Ir as k,
  Ui as l,
  ss as m,
  ze as p,
  Jo as s,
  Bi as u,
  qr as v,
  es as x,
  sn as z
};
//# sourceMappingURL=wc-runtime-G6hmx5-g.js.map
