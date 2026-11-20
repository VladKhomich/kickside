import { onMounted as h, onBeforeUnmount as w } from "vue";
import { getLayoutManager as d, on as f } from "@wippy-fe/proxy";
import { p as l, d as m, l as R } from "./hostRoute-zAgJIcxb.js";
function E(n, c) {
  const r = n ? d(n) : null, a = [], e = () => window.location.pathname + window.location.search + window.location.hash;
  let t = e();
  const u = () => m(R(n)) ?? t;
  let s = u();
  function i(o = u()) {
    o !== s && (s = o, c(l(o)));
  }
  function p() {
    t = e(), i(t);
  }
  return h(() => {
    a.push(f("@history", ({ path: o }) => {
      t = o === window.location.pathname ? e() : o, i();
    })), r && a.push(r.on("change", () => i())), window.addEventListener("popstate", p);
  }), w(() => {
    a.forEach((o) => o()), window.removeEventListener("popstate", p);
  }), { initialPath: l(s).path, hostPath: () => t };
}
export {
  E as u
};
//# sourceMappingURL=useHostRoute-CdzDcqsP.js.map
