import { defineComponent as R, ref as p, onUnmounted as W, computed as x, openBlock as c, createElementBlock as j, Fragment as B, createVNode as f, unref as s, createBlock as m, withCtx as i, createTextVNode as d, createCommentVNode as k, toDisplayString as U } from "vue";
import { L as $, f as w, h as V } from "./WorkflowSearchList.vue_vue_type_script_setup_true_lang-CifdAiNs.js";
import { s as T, g as A, c as I } from "./versions-BW024yDT.js";
import { s as J } from "./index-CSqVKKCx.js";
import { on as P } from "@wippy-fe/proxy";
import { a as z, u as D } from "./wc-runtime-Tr5oXE7R.js";
import { _ as F } from "./WcMount.vue_vue_type_script_setup_true_lang-CNWT59Oh.js";
import { _ as K } from "./EmbedWorkflowPicker.vue_vue_type_script_setup_true_lang-Buk9kei3.js";
const te = /* @__PURE__ */ R({
  __name: "WorkflowPicker",
  setup(L) {
    const n = z(), v = D(), r = p(!1), y = p(0), l = p("");
    let a = () => {
    };
    W(() => a());
    const b = x(() => Object.keys($(n.value.schema)?.properties || {})[0] || "flow_ref"), N = x(() => $(n.value.config)?.[b.value]);
    async function S(t) {
      t.published_version && (a(), await C({ kind: "flow", id: t.id, version: t.published_version }));
    }
    function h(t) {
      return JSON.stringify(t, (e, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.entries(o).sort(([u], [_]) => u.localeCompare(_))) : o);
    }
    async function C(t) {
      l.value = "";
      try {
        if (n.value.sourceContext) {
          if (!n.value.sourceSchema) throw new Error("The source item schema is unavailable.");
          const e = JSON.parse(n.value.sourceSchema), o = await A(t.id, t.version);
          if (o.version !== t.version) throw new Error("The published Workflow version is unavailable.");
          const u = h(e) === h(o.input_schema) ? { kind: "none" } : { kind: "expr", expr: await I(t.id, e, o.input_schema) };
          v("select", { input_schema: o.input_schema, transform: u });
        }
        v("change", { [b.value]: t });
      } catch (e) {
        l.value = V(e, "Could not select the published Workflow.");
      }
    }
    function E(t) {
      const e = t?.id;
      e && (r.value = !1, a(), a = P(`workflow.${e}`, async (o) => {
        const g = ((o?.data || o)?.events || []).find((O) => O.type === "kickside.workflows.events:version.published")?.body?.version;
        g && (await C({ kind: "flow", id: e, version: g }), a());
      }), v("navigate", { route: `/workflows/${encodeURIComponent(e)}/return/${encodeURIComponent(n.value.returnRoute || "")}` }));
    }
    return (t, e) => (c(), j(B, null, [
      f(K, {
        selected: N.value,
        onSelect: S
      }, null, 8, ["selected"]),
      s(n).sourceContext && s(n).returnRoute ? (c(), m(s(w), {
        key: 0,
        type: "button",
        "data-test": "new-workflow",
        severity: "secondary",
        outlined: "",
        onClick: e[0] || (e[0] = (o) => r.value = !0)
      }, {
        default: i(() => [...e[4] || (e[4] = [
          d("New workflow", -1)
        ])]),
        _: 1
      })) : k("", !0),
      l.value ? (c(), m(s(J), {
        key: 1,
        severity: "error",
        closable: !1
      }, {
        default: i(() => [
          d(U(l.value), 1)
        ]),
        _: 1
      })) : k("", !0),
      f(s(T), {
        visible: r.value,
        "onUpdate:visible": e[3] || (e[3] = (o) => r.value = o),
        modal: "",
        header: "New workflow"
      }, {
        footer: i(() => [
          f(s(w), {
            type: "button",
            severity: "secondary",
            outlined: "",
            onClick: e[1] || (e[1] = (o) => r.value = !1)
          }, {
            default: i(() => [...e[5] || (e[5] = [
              d("Cancel", -1)
            ])]),
            _: 1
          }),
          f(s(w), {
            type: "button",
            onClick: e[2] || (e[2] = (o) => y.value += 1)
          }, {
            default: i(() => [...e[6] || (e[6] = [
              d("Create", -1)
            ])]),
            _: 1
          })
        ]),
        default: i(() => [
          r.value ? (c(), m(F, {
            key: 0,
            tag: "kickside-workflow-setup",
            attrs: { "source-context": s(n).sourceContext, "submit-nonce": y.value || void 0 },
            onCreated: E
          }, null, 8, ["attrs"])) : k("", !0)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 64));
  }
});
export {
  te as default
};
