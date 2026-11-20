import { on as d } from "@wippy-fe/proxy";
function f(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function p(t, e) {
  if (e == null) return e;
  switch (t) {
    case "boolean":
    case "checkbox":
      return typeof e == "boolean" ? e : e === "true" ? !0 : e === "false" ? !1 : e;
    case "number":
    case "integer": {
      if (typeof e == "number") return e;
      if (typeof e == "string" && e.trim() !== "") {
        const n = Number(e);
        if (!Number.isNaN(n)) return n;
      }
      return e;
    }
    case "object":
    case "array":
      if (typeof e == "string")
        try {
          const n = JSON.parse(e);
          if (n && typeof n == "object") return n;
        } catch {
        }
      return e;
    default:
      return e;
  }
}
function l(t, e) {
  if (!e) return t;
  const n = {};
  for (const [r, i] of Object.entries(t))
    n[r] = p(e[r], i);
  return n;
}
function u(t, e, n) {
  if (e !== void 0 && !e) return null;
  const r = f(t) ? t : {}, i = [
    r,
    f(r.data) ? r.data : null,
    f(r.payload) ? r.payload : null,
    f(r.detail) ? r.detail : null
  ].filter(Boolean);
  for (const o of i) {
    if (o.event !== "component.meta.changed" && o.event !== "component.deleting" && o.event !== "component.deleted") continue;
    const c = String(o.component_id || ""), s = String(r.topic || o.topic || "");
    if (e === void 0) {
      if (!c && (!s.startsWith("component.") || s === "component.")) continue;
    } else if (c && c !== e || !c && s !== `component.${e}`) continue;
    const a = c || e || s.slice(10);
    return o.event === "component.deleting" && typeof o.deletion_job_id == "string" && o.deletion_job_id ? { event: o.event, component_id: a, deletion_job_id: o.deletion_job_id } : o.event !== "component.meta.changed" ? { event: o.event, component_id: a } : {
      event: "component.meta.changed",
      component_id: a,
      meta: l(f(o.meta) ? o.meta : {}, n),
      deleted: Array.isArray(o.deleted) ? o.deleted.map(String) : []
    };
  }
  return null;
}
function m(t, e, n) {
  const r = u(t, e, n);
  return r?.event === "component.meta.changed" ? r : null;
}
function y(t, e) {
  const n = u(t, e);
  return n && n.event !== "component.meta.changed" ? n : null;
}
function g(t, e, n) {
  if (!t) return null;
  const r = d(`component.${t}`, (i) => {
    const o = m(i, t, n);
    o && e(o);
  });
  return typeof r == "function" ? r : null;
}
export {
  y as a,
  m as c,
  g as s
};
//# sourceMappingURL=componentRealtime-m98w4dre.js.map
