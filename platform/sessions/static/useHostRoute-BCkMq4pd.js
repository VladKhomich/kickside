import { onMounted as i, onBeforeUnmount as c } from "vue";
import { getLayoutManager as l, on as m } from "@wippy-fe/proxy";
import { p as f, m as P, l as g } from "./hostRoute-CHFKAd6h.js";
function d(o, p) {
  const r = o ? l(o) : null, n = [];
  let a = window.location.pathname;
  const s = () => f(P(g(o)) ?? a).path;
  let e = s();
  const h = e;
  function u() {
    const t = s();
    t !== e && (e = t, p(t));
  }
  return i(() => {
    n.push(m("@history", ({ path: t }) => {
      a = t, u();
    })), r && n.push(r.on("change", u));
  }), c(() => n.forEach((t) => t())), { initialPath: h, hostPath: () => a };
}
export {
  d as u
};
//# sourceMappingURL=useHostRoute-BCkMq4pd.js.map
