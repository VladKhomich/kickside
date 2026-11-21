const e = ["http", "https", "mailto"];
function u(t) {
  if (typeof t != "string") return;
  const o = t.trim();
  if (!(!o || o.startsWith("//") || /[\u0000-\u001f\u007f\\]/.test(o)))
    try {
      const r = new URL(o, "https://document.invalid/").protocol;
      if (e.includes(r.slice(0, -1))) return o;
    } catch {
      return;
    }
}
function s(t, o, r) {
  if (t.defaultPrevented || t.button !== 0 || t.metaKey || t.ctrlKey || t.altKey || t.shiftKey || (t.preventDefault(), !o)) return;
  let n = o;
  try {
    n = decodeURIComponent(o);
  } catch {
  }
  r.querySelector(`#${CSS.escape(n)}`)?.scrollIntoView();
}
function f(t, o) {
  return (r) => {
    if (typeof r == "string" || r instanceof Node || r.tagName !== "a") return t(r);
    const n = u(r.href), c = t({ ...r, href: n });
    return n?.startsWith("#") && c instanceof HTMLAnchorElement && c.addEventListener("click", (i) => s(i, n.slice(1), o)), c;
  };
}
export {
  u as approvedDocumentHref,
  f as documentLinkFactory,
  e as documentLinkSchemes
};
//# sourceMappingURL=links-7T67xoOU.js.map
