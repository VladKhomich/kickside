import { ws as n } from "@wippy-fe/proxy";
async function o(s) {
  const e = await n.sendWithResponse({ type: "session_open", start_token: s });
  if (e.topic === "session.opened" && e.data.session_id) return e.data.session_id;
  throw new Error("The start request did not return a chat session");
}
function i(s) {
  n.send({ type: "session_close", session_id: s });
}
export {
  i as c,
  o as e
};
//# sourceMappingURL=chatStart-Bxe6JK-R.js.map
