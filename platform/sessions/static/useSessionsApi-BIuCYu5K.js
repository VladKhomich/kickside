import { api as r } from "@wippy-fe/proxy";
function F(u) {
  return { intro: "default", markdown: "", markdown_alignment: "left", show_message: u === "sessions", show_agent_picker: !0 };
}
const o = "/api/v1";
function S() {
  async function u(s, e) {
    const { data: t } = await r.get(`${o}/sessions?limit=${s}&offset=${e}`);
    if (!t?.success) throw new Error(t?.error || "Failed to load sessions");
    return { sessions: t.sessions || [], total: t.count || 0 };
  }
  async function f(s) {
    const { data: e, status: t } = await r.get(`${o}/sessions/get?session_id=${encodeURIComponent(s)}`, {
      validateStatus: (n) => n === 200 || n === 403 || n === 404
    });
    if (t === 403 || t === 404) return null;
    if (!e?.success || e.session?.session_id !== s) throw new Error(e?.error || "Failed to load session");
    return e.session;
  }
  async function l() {
    try {
      const { data: s } = await r.get(`${o}/user-agents`), e = {};
      for (const t of s?.agents || [])
        t.id && t.title && (e[t.id] = t.title);
      return e;
    } catch {
      return {};
    }
  }
  async function g(s) {
    const { data: e } = await r.get(`${o}/agents/list?surface=${s}`);
    if (!e?.success) throw new Error(e?.error || "Failed to load agents");
    const t = (a) => Array.isArray(a) ? a.filter((c) => c?.name && c.start_token) : [], n = (Array.isArray(e.grouped) ? e.grouped : []).map((a) => ({ title: a.title || "", agents: t(a.agents) })).filter((a) => a.agents.length > 0), d = new Set(n.flatMap((a) => a.agents.map((c) => c.name))), i = t(e.agents).filter((a) => !d.has(a.name));
    return i.length > 0 && n.push({ title: n.length > 0 ? "Other" : "", agents: i }), { groups: n, screen: { ...F(s), ...e.chat_screen } };
  }
  async function w() {
    try {
      const { data: s } = await r.get(`${o}/connections/providers/badges`), e = /* @__PURE__ */ Object.create(null);
      for (const t of s?.providers || []) {
        const n = typeof t.provider == "string" ? t.provider.trim().toLowerCase() : "";
        if (!n) continue;
        const d = typeof t.title == "string" && t.title.trim() ? t.title.trim() : n, i = typeof t.icon == "string" && t.icon.trim() ? t.icon.trim() : "tabler:plug-connected";
        e[n] = { icon: i, label: d };
      }
      return e;
    } catch {
      return /* @__PURE__ */ Object.create(null);
    }
  }
  async function m(s, e = 30) {
    const t = `${o}/sessions/messages?session_id=${encodeURIComponent(s)}&limit=${e}`, { data: n } = await r.get(t);
    if (!n?.success) throw new Error(n?.error || "Failed to load messages");
    return n.messages || [];
  }
  async function p(s, e) {
    const { data: t } = await r.post(`${o}/sessions/rename`, {
      session_id: s,
      title: e
    });
    if (!t?.success) throw new Error(t?.error || "Failed to rename session");
  }
  async function h(s) {
    const e = `${o}/sessions/delete?session_id=${encodeURIComponent(s)}`, { data: t } = await r.delete(e);
    if (!t?.success) throw new Error(t?.error || "Failed to delete session");
  }
  async function y(s, e) {
    const { data: t } = await r.post(`${o}/sessions/favorite`, {
      session_id: s,
      favorite: e
    });
    if (!t?.success) throw new Error(t?.error || "Failed to update favorite");
  }
  async function $(s, e) {
    const { data: t } = await r.post(`${o}/sessions/start-token`, { agent: s, model: e });
    if (!t?.success || !t.token) throw new Error(t?.error || "Failed to start a new chat");
    return t.token;
  }
  async function _(s = {}) {
    const e = new URLSearchParams();
    e.set("limit", String(s.limit || 48)), s.sessionId && e.set("session_id", s.sessionId), s.cursor && e.set("cursor", s.cursor);
    const { data: t } = await r.get(`${o}/artifacts?${e.toString()}`);
    if (!t?.success) throw new Error(t?.error || "Failed to load artifacts");
    return {
      artifacts: t.artifacts || [],
      hasMore: t.pagination?.has_more === !0,
      nextCursor: t.pagination?.next_cursor || ""
    };
  }
  async function v(s) {
    const { data: e } = await r.get(`${o}/artifact/${encodeURIComponent(s)}`);
    if (e?.uuid !== s) throw new Error(e?.error || "Failed to load artifact");
    return { ...e, artifact_id: e.artifact_id || e.uuid };
  }
  async function E(s) {
    const { data: e } = await r.get(`${o}/artifact/${encodeURIComponent(s)}/content`, {
      responseType: "text"
    });
    return typeof e == "string" ? e : JSON.stringify(e, null, 2);
  }
  return { list: u, session: f, messages: m, rename: p, remove: h, setFavorite: y, startToken: $, agentTitles: l, chatAgents: g, providerBadges: w, artifacts: _, artifact: v, artifactContent: E };
}
export {
  F as d,
  S as u
};
//# sourceMappingURL=useSessionsApi-BIuCYu5K.js.map
