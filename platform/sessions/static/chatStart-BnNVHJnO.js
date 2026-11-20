import { ws as r, on as a } from "@wippy-fe/proxy";
const d = "@COORDINATOR/chat", u = "kickside:chat-start-request", T = "kickside:chat-start-result", f = "kickside:chat-start";
function c(s) {
  return s.throwIfAborted(), new Promise((o, n) => {
    const e = a("welcome", () => {
      e(), s.removeEventListener("abort", t), o();
    });
    function t() {
      e(), n(s.reason);
    }
    s.addEventListener("abort", t, { once: !0 });
  });
}
async function p(s, o) {
  const n = { type: "session_open", start_token: s }, e = await r.sendWithResponse(n).catch(async (t) => {
    if (!(t instanceof Error) || t.message !== "WebSocket is not connected") throw t;
    return await c(o), o.throwIfAborted(), r.sendWithResponse(n);
  });
  if (e.topic === "session.opened" && e.data.session_id) return e.data.session_id;
  throw new Error("The start request did not return a chat session");
}
function h(s) {
  r.send({ type: "session_close", session_id: s });
}
async function _(s, o) {
  try {
    const n = await r.sendWithResponse({ type: "session_message", session_id: s, data: { text: o } }), e = n.data, t = e && "type" in e ? e.type : void 0;
    if (n.topic.startsWith("session:" + s + ":message:") && t === "received") return "sent";
    if (n.topic === "error" || t === "error" || e && t === "command_response" && "success" in e && e.success === !1) return "rejected";
  } catch {
  }
  return "unconfirmed";
}
export {
  u as C,
  T as a,
  f as b,
  h as c,
  d,
  p as e,
  _ as s
};
//# sourceMappingURL=chatStart-BnNVHJnO.js.map
