import { defineComponent as oe, defineAsyncComponent as ie, computed as g, ref as h, onBeforeUnmount as de, watch as ce, openBlock as n, createElementBlock as m, createVNode as d, unref as a, createElementVNode as o, createBlock as v, withCtx as c, createTextVNode as b, toDisplayString as w, withModifiers as fe, createCommentVNode as W, Fragment as ve } from "vue";
import { L as pe, X as me, f as $, l as be, J as he, h as ye } from "./WorkflowSearchList.vue_vue_type_script_setup_true_lang-BrsNr0R3.js";
import { s as k } from "./index-CSqVKKCx.js";
import { s as M } from "./index-3cGXfEXf.js";
import { a as we, b as ke, C as _e, s as ge, _ as G, g as Re, D as Ee, z as Ce, i as Ie } from "./http-error-CQeeeGpp.js";
import { a as Se, u as We } from "./wc-runtime-Tr5oXE7R.js";
import { on as K } from "@wippy-fe/proxy";
import { Icon as A } from "@iconify/vue";
import { _ as Oe } from "./EmbedWorkflowPicker.vue_vue_type_script_setup_true_lang-CQ6-HFXn.js";
const Pe = "Run Workflow";
function X(t, r) {
  const l = t[r];
  return typeof l == "string" ? l : "";
}
function $e(t) {
  return typeof t == "string" && t.trim().toLowerCase() === "dispatch" ? "dispatch" : "run";
}
function Ae(t) {
  if (t == null || t === "") return { value: null, error: "" };
  if (typeof t == "object")
    return Array.isArray(t) ? { value: null, error: "Input must be a JSON object." } : { value: t, error: "" };
  if (typeof t == "string") {
    const r = t.trim();
    if (!r) return { value: null, error: "" };
    try {
      const l = JSON.parse(r);
      return !l || typeof l != "object" || Array.isArray(l) ? { value: null, error: "Input must be a JSON object." } : { value: l, error: "" };
    } catch {
      return { value: null, error: "Input is not valid JSON." };
    }
  }
  return { value: null, error: "Input must be a JSON object." };
}
function je(t) {
  const r = t && typeof t == "object" ? t : {}, { value: l, error: f } = Ae(r.input), i = X(r, "label").trim() || Pe;
  return {
    workflowId: X(r, "flowId").trim(),
    input: l,
    inputError: f,
    mode: $e(r.mode),
    label: i
  };
}
function Le(t, r) {
  const l = pe(r), f = Array.isArray(l?.required) ? l?.required.map(String) : [];
  if (!f.length) return [];
  const i = t && typeof t == "object" && !Array.isArray(t) ? t : {};
  return f.filter((u) => {
    const I = i[u];
    return I == null || typeof I == "string" && I.trim() === "";
  });
}
function Ne(t, r) {
  const l = Le(t, r);
  return l.length ? { ok: !1, message: `Provide ${l.length === 1 ? `the ${l[0]} field` : `these fields: ${l.join(", ")}`} before running.`, missing: l } : { ok: !0, message: "", missing: l };
}
function Ve(t) {
  const r = we(t.status), l = ke(t.status);
  if (r === "error") {
    const f = _e(t.error);
    return { phase: "failed", tone: r, statusLabel: l, output: void 0, hasOutput: !1, outputPending: !1, reason: f, hasReason: !!f };
  }
  if (r === "ok") {
    const f = t.output !== void 0;
    return {
      phase: "completed",
      tone: r,
      statusLabel: l,
      output: t.output,
      hasOutput: f,
      outputPending: !f,
      reason: "",
      hasReason: !1
    };
  }
  return { phase: "running", tone: r, statusLabel: l, output: void 0, hasOutput: !1, outputPending: !1, reason: "", hasReason: !1 };
}
const Fe = { class: "wf-embed" }, xe = {
  key: 0,
  class: "wf-embed-note"
}, Je = {
  key: 3,
  class: "wf-embed-run"
}, Te = { class: "wf-embed-hd" }, Be = { class: "wf-embed-hd-ico" }, De = { class: "wf-embed-hd-main" }, qe = { class: "wf-embed-hd-title" }, Ue = { class: "wf-embed-input" }, ze = {
  key: 3,
  class: "wf-embed-subtle"
}, He = { class: "wf-embed-actions" }, Me = {
  key: 1,
  class: "wf-embed-status is-running"
}, Ge = {
  key: 0,
  class: "wf-embed-runid"
}, Ke = {
  key: 2,
  class: "wf-embed-result"
}, Xe = {
  key: 0,
  class: "wf-embed-runid"
}, Ye = { class: "wf-embed-actions" }, Qe = {
  key: 3,
  class: "wf-embed-result"
}, Ze = {
  key: 1,
  class: "wf-embed-subtle"
}, et = { class: "wf-embed-actions" }, tt = {
  key: 4,
  class: "wf-embed-result"
}, st = { class: "wf-embed-actions" }, ft = /* @__PURE__ */ oe({
  __name: "EmbedWorkflow",
  setup(t) {
    const r = ie(() => import("./SchemaEditor-lUYaplVs.js")), l = Se(), f = We(), i = g(() => je(l.value)), u = h(null), I = h(!1), R = h(""), O = h({}), q = h(0), N = h(!0), p = h("ready"), j = h(!1), E = h(""), _ = h(""), y = h(null);
    let V = null, U = null, F = !1;
    const Y = g(() => u.value ? `/workflows/${u.value.id}` : "");
    function Q() {
      u.value && f("navigate", { route: `/workflows/${u.value.id}` });
    }
    const x = g(() => u.value?.input_schema), Z = g(() => me(x.value)), ee = g(() => i.value.input !== null), J = g(() => Ne(O.value, x.value)), z = g(() => p.value === "ready" && !j.value && !i.value.inputError && N.value && J.value.ok), L = g(() => E.value.length > 8 ? E.value.slice(0, 8) : E.value), te = g(() => !i.value.workflowId);
    function T(s, e) {
      return Ce(s) === 403 ? "You don’t have access to this Workflow." : ye(s, e);
    }
    function P() {
      V?.(), V = null;
    }
    async function B() {
      const s = u.value?.id || "", e = E.value;
      if (!(!s || !e || F)) {
        F = !0;
        try {
          const { run: C } = await Re(s, e);
          if (u.value?.id !== s || E.value !== e) return;
          const S = Ve(C);
          y.value = S, p.value = S.phase;
        } catch (C) {
          _.value = T(C, "Lost track of this run."), p.value = "failed";
        } finally {
          F = !1;
        }
      }
    }
    function se(s) {
      P();
      try {
        const e = K(`kickside.thread.${s}`, (C) => {
          Ie(C, s) && B();
        });
        V = typeof e == "function" ? e : null;
      } catch {
      }
    }
    async function ae() {
      if (!(!u.value || !z.value)) {
        _.value = "", j.value = !0;
        try {
          const s = Number(u.value.published_version), e = await Ee(u.value.id, s, O.value || {});
          E.value = e, i.value.mode === "dispatch" ? p.value = "dispatched" : (y.value = null, p.value = "running", se(u.value.id), await B());
        } catch (s) {
          _.value = T(s, "Could not start the run.");
        } finally {
          j.value = !1;
        }
      }
    }
    function H(s) {
      P(), u.value = s, R.value = "", p.value = "ready", E.value = "", y.value = null, _.value = "", O.value = i.value.input ? { ...i.value.input } : {}, N.value = !0;
    }
    async function le(s) {
      I.value = !0, R.value = "";
      try {
        const C = (await be({ filter: "published" })).map((S) => he(S, {}, [], "")).find((S) => S.id === s && !!S.published_version);
        C ? H(C) : (u.value = null, R.value = "This Workflow isn’t published, or you don’t have access to it.");
      } catch (e) {
        u.value = null, R.value = T(e, "Could not load this Workflow.");
      } finally {
        I.value = !1;
      }
    }
    function D() {
      P(), p.value = "ready", E.value = "", y.value = null, _.value = "", q.value += 1;
    }
    function ne() {
      P(), u.value = null, R.value = "";
    }
    function re(s) {
      O.value = s || {};
    }
    function ue(s) {
      N.value = s;
    }
    try {
      const s = K("@visibility", (e) => {
        e === !0 && B();
      });
      U = typeof s == "function" ? s : null;
    } catch {
    }
    return de(() => {
      P(), U?.();
    }), ce(
      () => i.value.workflowId,
      (s) => {
        P(), s ? le(s) : (u.value = null, R.value = "");
      },
      { immediate: !0 }
    ), (s, e) => (n(), m("div", Fe, [
      I.value ? (n(), m("div", xe, [
        d(a(M), {
          class: "wf-status-spinner",
          "stroke-width": "4",
          "aria-label": "Loading Workflow"
        }),
        e[0] || (e[0] = o("span", null, "Loading Workflow…", -1))
      ])) : R.value ? (n(), v(a(k), {
        key: 1,
        class: "wf-embed-directed",
        severity: "error",
        closable: !1
      }, {
        default: c(() => [
          b(w(R.value), 1)
        ]),
        _: 1
      })) : u.value ? (n(), m("div", Je, [
        o("header", Te, [
          o("span", Be, [
            d(a(A), {
              icon: "tabler:route",
              "aria-hidden": "true"
            })
          ]),
          o("span", De, [
            o("span", qe, w(u.value.title), 1),
            d(a(ge), {
              class: "wf-embed-hd-sub",
              severity: "success",
              value: `Published v${u.value.published_version}`
            }, null, 8, ["value"])
          ]),
          d(a($), {
            as: "a",
            class: "wf-embed-open",
            href: Y.value,
            severity: "secondary",
            text: "",
            title: "Open this Workflow in the editor",
            onClick: fe(Q, ["prevent"])
          }, {
            default: c(() => [
              d(a(A), {
                icon: "tabler:external-link",
                "aria-hidden": "true"
              }),
              e[1] || (e[1] = o("span", null, "Open in editor", -1))
            ]),
            _: 1
          }, 8, ["href"]),
          te.value ? (n(), v(a($), {
            key: 0,
            type: "button",
            class: "wf-embed-change",
            severity: "secondary",
            text: "",
            onClick: ne
          }, {
            default: c(() => [...e[2] || (e[2] = [
              b("Change", -1)
            ])]),
            _: 1
          })) : W("", !0)
        ]),
        p.value === "ready" ? (n(), m(ve, { key: 0 }, [
          o("div", Ue, [
            i.value.inputError ? (n(), v(a(k), {
              key: 0,
              class: "wf-field-err",
              severity: "error",
              closable: !1
            }, {
              default: c(() => [
                b(w(i.value.inputError), 1)
              ]),
              _: 1
            })) : ee.value ? (n(), v(G, {
              key: 1,
              value: O.value,
              label: "Input",
              icon: "tabler:arrow-right-circle",
              open: !0
            }, null, 8, ["value"])) : Z.value ? (n(), v(a(r), {
              key: 2,
              mode: "value",
              schema: x.value,
              "model-value": O.value,
              "reset-key": q.value,
              rows: 6,
              label: "Input",
              placeholder: '{ "key": "value" }',
              "onUpdate:modelValue": re,
              onValid: ue
            }, null, 8, ["schema", "model-value", "reset-key"])) : (n(), m("p", ze, "This Workflow needs no input.")),
            !i.value.inputError && !J.value.ok ? (n(), v(a(k), {
              key: 4,
              class: "wf-embed-gate",
              severity: "warn",
              closable: !1
            }, {
              default: c(() => [
                b(w(J.value.message), 1)
              ]),
              _: 1
            })) : W("", !0)
          ]),
          o("div", He, [
            d(a($), {
              type: "button",
              class: "wf-embed-action",
              disabled: !z.value,
              loading: j.value,
              onClick: ae
            }, {
              default: c(() => [
                j.value ? W("", !0) : (n(), v(a(A), {
                  key: 0,
                  icon: i.value.mode === "dispatch" ? "tabler:send" : "tabler:player-play",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])),
                o("span", null, w(i.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled", "loading"])
          ]),
          _.value ? (n(), v(a(k), {
            key: 0,
            class: "wf-embed-err",
            severity: "error",
            closable: !1
          }, {
            default: c(() => [
              b(w(_.value), 1)
            ]),
            _: 1
          })) : W("", !0)
        ], 64)) : p.value === "running" ? (n(), m("div", Me, [
          d(a(M), {
            class: "wf-status-spinner",
            "stroke-width": "4",
            "aria-label": "Workflow running"
          }),
          o("span", null, [
            e[3] || (e[3] = b("Running…", -1)),
            L.value ? (n(), m("span", Ge, " · " + w(L.value), 1)) : W("", !0)
          ])
        ])) : p.value === "dispatched" ? (n(), m("div", Ke, [
          d(a(k), {
            class: "wf-embed-status is-ok",
            severity: "success",
            closable: !1
          }, {
            default: c(() => [
              o("span", null, [
                e[4] || (e[4] = b("Dispatched", -1)),
                L.value ? (n(), m("span", Xe, " · run " + w(L.value), 1)) : W("", !0)
              ])
            ]),
            _: 1
          }),
          o("div", Ye, [
            d(a($), {
              type: "button",
              class: "wf-embed-action",
              onClick: D
            }, {
              default: c(() => [
                d(a(A), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                }),
                e[5] || (e[5] = o("span", null, "Dispatch again", -1))
              ]),
              _: 1
            })
          ])
        ])) : p.value === "completed" ? (n(), m("div", Qe, [
          d(a(k), {
            class: "wf-embed-status is-ok",
            severity: "success",
            closable: !1
          }, {
            default: c(() => [...e[6] || (e[6] = [
              b("Completed", -1)
            ])]),
            _: 1
          }),
          y.value && y.value.hasOutput ? (n(), v(G, {
            key: 0,
            value: y.value.output,
            label: "Result",
            icon: "tabler:file-check",
            open: !0
          }, null, 8, ["value"])) : (n(), m("p", Ze, "Completed — no result was returned.")),
          o("div", et, [
            d(a($), {
              type: "button",
              class: "wf-embed-action",
              onClick: D
            }, {
              default: c(() => [
                d(a(A), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                }),
                e[7] || (e[7] = o("span", null, "Run again", -1))
              ]),
              _: 1
            })
          ])
        ])) : p.value === "failed" ? (n(), m("div", tt, [
          d(a(k), {
            class: "wf-embed-status is-error",
            severity: "error",
            closable: !1
          }, {
            default: c(() => [...e[8] || (e[8] = [
              b("Failed", -1)
            ])]),
            _: 1
          }),
          _.value ? (n(), v(a(k), {
            key: 0,
            class: "wf-embed-err",
            severity: "error",
            closable: !1
          }, {
            default: c(() => [
              b(w(_.value), 1)
            ]),
            _: 1
          })) : y.value && y.value.hasReason ? (n(), v(a(k), {
            key: 1,
            class: "wf-embed-reason",
            severity: "error",
            closable: !1
          }, {
            default: c(() => [
              b(w(y.value.reason), 1)
            ]),
            _: 1
          })) : (n(), v(a(k), {
            key: 2,
            class: "wf-embed-subtle",
            severity: "error",
            closable: !1
          }, {
            default: c(() => [...e[9] || (e[9] = [
              b("This run failed, and no further detail was reported.", -1)
            ])]),
            _: 1
          })),
          o("div", st, [
            d(a($), {
              type: "button",
              class: "wf-embed-action",
              onClick: D
            }, {
              default: c(() => [
                d(a(A), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                }),
                e[10] || (e[10] = o("span", null, "Run again", -1))
              ]),
              _: 1
            })
          ])
        ])) : W("", !0)
      ])) : (n(), v(Oe, {
        key: 2,
        onSelect: H
      }))
    ]));
  }
});
export {
  ft as default
};
