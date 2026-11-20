import { api as n } from "@wippy-fe/proxy";
function E(u) {
  return { intro: "default", markdown: "", markdown_alignment: "left", show_message: u === "sessions", show_agent_picker: !0 };
}
const a = "/api/v1";
function k() {
  async function u(s, e) {
    const { data: t } = await n.get(`${a}/sessions?limit=${s}&offset=${e}`);
    if (!t?.success) throw new Error(t?.error || "Failed to load sessions");
    return { sessions: t.sessions || [], total: t.count || 0 };
  }
  async function f() {
    try {
      const { data: s } = await n.get(`${a}/user-agents`), e = {};
      for (const t of s?.agents || [])
        t.id && t.title && (e[t.id] = t.title);
      return e;
    } catch {
      return {};
    }
  }
  async function l(s) {
    const { data: e } = await n.get(`${a}/agents/list?surface=${s}`);
    if (!e?.success) throw new Error(e?.error || "Failed to load agents");
    const t = (o) => Array.isArray(o) ? o.filter((c) => c?.name && c.start_token) : [], r = (Array.isArray(e.grouped) ? e.grouped : []).map((o) => ({ title: o.title || "", agents: t(o.agents) })).filter((o) => o.agents.length > 0), d = new Set(r.flatMap((o) => o.agents.map((c) => c.name))), i = t(e.agents).filter((o) => !d.has(o.name));
    return i.length > 0 && r.push({ title: r.length > 0 ? "Other" : "", agents: i }), { groups: r, screen: { ...E(s), ...e.chat_screen } };
  }
  async function g() {
    try {
      const { data: s } = await n.get(`${a}/connections/providers/badges`), e = /* @__PURE__ */ Object.create(null);
      for (const t of s?.providers || []) {
        const r = typeof t.provider == "string" ? t.provider.trim().toLowerCase() : "";
        if (!r) continue;
        const d = typeof t.title == "string" && t.title.trim() ? t.title.trim() : r, i = typeof t.icon == "string" && t.icon.trim() ? t.icon.trim() : "tabler:plug-connected";
        e[r] = { icon: i, label: d };
      }
      return e;
    } catch {
      return /* @__PURE__ */ Object.create(null);
    }
  }
  async function w(s, e = 30) {
    const t = `${a}/sessions/messages?session_id=${encodeURIComponent(s)}&limit=${e}`, { data: r } = await n.get(t);
    if (!r?.success) throw new Error(r?.error || "Failed to load messages");
    return r.messages || [];
  }
  async function m(s, e) {
    const { data: t } = await n.post(`${a}/sessions/rename`, {
      session_id: s,
      title: e
    });
    if (!t?.success) throw new Error(t?.error || "Failed to rename session");
  }
  async function p(s) {
    const e = `${a}/sessions/delete?session_id=${encodeURIComponent(s)}`, { data: t } = await n.delete(e);
    if (!t?.success) throw new Error(t?.error || "Failed to delete session");
  }
  async function h(s, e) {
    const { data: t } = await n.post(`${a}/sessions/favorite`, {
      session_id: s,
      favorite: e
    });
    if (!t?.success) throw new Error(t?.error || "Failed to update favorite");
  }
  async function y(s, e) {
    const { data: t } = await n.post(`${a}/sessions/start-token`, { agent: s, model: e });
    if (!t?.success || !t.token) throw new Error(t?.error || "Failed to start a new chat");
    return t.token;
  }
  async function $(s = {}) {
    const e = new URLSearchParams();
    e.set("limit", String(s.limit || 48)), s.sessionId && e.set("session_id", s.sessionId), s.cursor && e.set("cursor", s.cursor);
    const { data: t } = await n.get(`${a}/artifacts?${e.toString()}`);
    if (!t?.success) throw new Error(t?.error || "Failed to load artifacts");
    return {
      artifacts: t.artifacts || [],
      hasMore: t.pagination?.has_more === !0,
      nextCursor: t.pagination?.next_cursor || ""
    };
  }
  async function _(s) {
    const { data: e } = await n.get(`${a}/artifact/${encodeURIComponent(s)}`);
    if (!e?.uuid) throw new Error(e?.error || "Failed to load artifact");
    return { ...e, artifact_id: e.artifact_id || e.uuid };
  }
  async function v(s) {
    const { data: e } = await n.get(`${a}/artifact/${encodeURIComponent(s)}/content`, {
      responseType: "text"
    });
    return typeof e == "string" ? e : JSON.stringify(e, null, 2);
  }
  return { list: u, messages: w, rename: m, remove: p, setFavorite: h, startToken: y, agentTitles: f, chatAgents: l, providerBadges: g, artifacts: $, artifact: _, artifactContent: v };
}
export {
  E as d,
  k as u
};
//# sourceMappingURL=useSessionsApi-qNiqKQg2.js.map
