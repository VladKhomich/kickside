import { api as r } from "@wippy-fe/proxy";
const o = "/api/v1";
function F() {
  async function u(s, e) {
    const { data: t } = await r.get(`${o}/sessions?limit=${s}&offset=${e}`);
    if (!t?.success) throw new Error(t?.error || "Failed to load sessions");
    return { sessions: t.sessions || [], total: t.count || 0 };
  }
  async function d(s) {
    const { data: e, status: t } = await r.get(`${o}/sessions/get?session_id=${encodeURIComponent(s)}`, {
      validateStatus: (n) => n === 200 || n === 403 || n === 404
    });
    if (t === 403 || t === 404) return null;
    if (!e?.success || e.session?.session_id !== s) throw new Error(e?.error || "Failed to load session");
    return e.session;
  }
  async function f() {
    try {
      const { data: s } = await r.get(`${o}/user-agents`), e = {};
      for (const t of s?.agents || [])
        t.id && t.title && (e[t.id] = t.title);
      return e;
    } catch {
      return {};
    }
  }
  async function l() {
    const { data: s } = await r.get(`${o}/agents/list`);
    if (!s?.success) throw new Error(s?.error || "Failed to load agents");
    const e = (a) => (a || []).filter((c) => c.name && c.start_token), t = (s.grouped || []).map((a) => ({ title: a.title || "", agents: e(a.agents) })).filter((a) => a.agents.length > 0), n = new Set(t.flatMap((a) => a.agents.map((c) => c.name))), i = e(s.agents).filter((a) => !n.has(a.name));
    return i.length > 0 && t.push({ title: t.length > 0 ? "Other" : "", agents: i }), t;
  }
  async function g() {
    try {
      const { data: s } = await r.get(`${o}/connections/providers/badges`), e = /* @__PURE__ */ Object.create(null);
      for (const t of s?.providers || []) {
        const n = typeof t.provider == "string" ? t.provider.trim().toLowerCase() : "";
        if (!n) continue;
        const i = typeof t.title == "string" && t.title.trim() ? t.title.trim() : n, a = typeof t.icon == "string" && t.icon.trim() ? t.icon.trim() : "tabler:plug-connected";
        e[n] = { icon: a, label: i };
      }
      return e;
    } catch {
      return /* @__PURE__ */ Object.create(null);
    }
  }
  async function w(s, e = 30) {
    const t = `${o}/sessions/messages?session_id=${encodeURIComponent(s)}&limit=${e}`, { data: n } = await r.get(t);
    if (!n?.success) throw new Error(n?.error || "Failed to load messages");
    return n.messages || [];
  }
  async function m(s, e) {
    const { data: t } = await r.post(`${o}/sessions/rename`, {
      session_id: s,
      title: e
    });
    if (!t?.success) throw new Error(t?.error || "Failed to rename session");
  }
  async function p(s) {
    const e = `${o}/sessions/delete?session_id=${encodeURIComponent(s)}`, { data: t } = await r.delete(e);
    if (!t?.success) throw new Error(t?.error || "Failed to delete session");
  }
  async function h(s, e) {
    const { data: t } = await r.post(`${o}/sessions/favorite`, {
      session_id: s,
      favorite: e
    });
    if (!t?.success) throw new Error(t?.error || "Failed to update favorite");
  }
  async function y(s, e) {
    const { data: t } = await r.post(`${o}/sessions/start-token`, { agent: s, model: e });
    if (!t?.success || !t.token) throw new Error(t?.error || "Failed to start a new chat");
    return t.token;
  }
  async function $(s = {}) {
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
  async function _(s) {
    const { data: e } = await r.get(`${o}/artifact/${encodeURIComponent(s)}/content`, {
      responseType: "text"
    });
    return typeof e == "string" ? e : JSON.stringify(e, null, 2);
  }
  return { list: u, session: d, messages: w, rename: m, remove: p, setFavorite: h, startToken: y, agentTitles: f, chatAgents: l, providerBadges: g, artifacts: $, artifact: v, artifactContent: _ };
}
export {
  F as u
};
//# sourceMappingURL=useSessionsApi-BuC8McBv.js.map
