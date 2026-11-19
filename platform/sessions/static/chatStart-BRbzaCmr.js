import { ws as r, on as i } from "@wippy-fe/proxy";
function a(e) {
  return e.throwIfAborted(), new Promise((s, n) => {
    const t = i("welcome", () => {
      t(), e.removeEventListener("abort", o), s();
    });
    function o() {
      t(), n(e.reason);
    }
    e.addEventListener("abort", o, { once: !0 });
  });
}
async function d(e, s) {
  const n = { type: "session_open", start_token: e }, t = await r.sendWithResponse(n).catch(async (o) => {
    if (!(o instanceof Error) || o.message !== "WebSocket is not connected") throw o;
    return await a(s), s.throwIfAborted(), r.sendWithResponse(n);
  });
  if (t.topic === "session.opened" && t.data.session_id) return t.data.session_id;
  throw new Error("The start request did not return a chat session");
}
function f(e) {
  r.send({ type: "session_close", session_id: e });
}
export {
  f as c,
  d as e
};
//# sourceMappingURL=chatStart-BRbzaCmr.js.map
