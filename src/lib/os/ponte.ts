export interface Friend {
  code: string;
  name: string;
  trusted: boolean;
}

export interface Ask {
  from: string;
  name: string;
  kind: "help" | "offer";
}

export interface Session {
  peer: string;
  name: string;
  role: "host" | "guest";
  auto: boolean;
}

type Wire =
  | { t: "hello"; code: string; name: string }
  | { t: "ask"; from: string; name: string; to: string; kind: "help" | "offer" }
  | { t: "ok"; from: string; name: string; to: string; auto?: boolean }
  | { t: "no"; from: string; to: string }
  | { t: "cut"; from: string; to: string };

const KEY = "kreluna-ponte-v1";
const CH = "kreluna-ponte";

function load(): { code: string; name: string; friends: Friend[] } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as { code: string; name: string; friends: Friend[] };
  } catch {
    /* empty */
  }
  const code = `KRE-${Math.random().toString(36).slice(2, 5).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`;
  return { code, name: "Operatore", friends: [] };
}

function save(s: { code: string; name: string; friends: Friend[] }) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

const state = typeof window !== "undefined" ? load() : { code: "KRE-000", name: "Operatore", friends: [] as Friend[] };
let session: Session | null = null;
let incoming: Ask | null = null;
const subs = new Set<() => void>();
let channel: BroadcastChannel | null = null;

function emit() {
  for (const fn of subs) fn();
}

function send(msg: Wire) {
  channel?.postMessage(msg);
}

function onMsg(ev: MessageEvent<Wire>) {
  const m = ev.data;
  if (!m || typeof m !== "object") return;
  if (m.t === "hello" && m.code !== state.code) {
    const f = state.friends.find((x) => x.code === m.code);
    if (f && f.trusted && session?.peer !== m.code) {
      session = { peer: m.code, name: m.name, role: "host", auto: true };
      send({ t: "ok", from: state.code, name: state.name, to: m.code, auto: true });
      emit();
    }
    return;
  }
  if (m.t === "ask" && m.to === state.code) {
    const f = state.friends.find((x) => x.code === m.from);
    if (f?.trusted) {
      session = { peer: m.from, name: m.name, role: "host", auto: true };
      send({ t: "ok", from: state.code, name: state.name, to: m.from, auto: true });
      emit();
      return;
    }
    incoming = { from: m.from, name: m.name, kind: m.kind };
    emit();
    return;
  }
  if (m.t === "ok" && m.to === state.code) {
    session = { peer: m.from, name: m.name, role: "guest", auto: !!m.auto };
    incoming = null;
    emit();
    return;
  }
  if (m.t === "no" && m.to === state.code) {
    incoming = null;
    emit();
    return;
  }
  if (m.t === "cut" && (m.to === state.code || m.from === session?.peer)) {
    session = null;
    emit();
  }
}

export function ponteBoot(name: string) {
  state.name = name || state.name;
  save(state);
  if (typeof BroadcastChannel === "undefined") return;
  if (channel) return;
  channel = new BroadcastChannel(CH);
  channel.onmessage = onMsg;
  send({ t: "hello", code: state.code, name: state.name });
}

export function ponteSnap() {
  return { code: state.code, friends: state.friends, session, incoming };
}

export function ponteSub(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function ponteAdd(code: string, name: string) {
  const c = code.trim().toUpperCase();
  if (!c || c === state.code) return false;
  if (!state.friends.some((f) => f.code === c)) {
    state.friends = [...state.friends, { code: c, name: name.trim() || c, trusted: false }];
    save(state);
    emit();
  }
  return true;
}

export function ponteTrust(code: string, trusted: boolean) {
  state.friends = state.friends.map((f) => (f.code === code ? { ...f, trusted } : f));
  save(state);
  emit();
}

export function ponteForget(code: string) {
  state.friends = state.friends.filter((f) => f.code !== code);
  if (session?.peer === code) session = null;
  save(state);
  emit();
}

export function ponteAsk(code: string, kind: "help" | "offer") {
  send({ t: "ask", from: state.code, name: state.name, to: code, kind });
}

export function ponteAccept(trust: boolean) {
  if (!incoming) return;
  const { from, name } = incoming;
  if (!state.friends.some((f) => f.code === from)) {
    state.friends = [...state.friends, { code: from, name, trusted: trust }];
  } else if (trust) {
    state.friends = state.friends.map((f) => (f.code === from ? { ...f, trusted: true } : f));
  }
  save(state);
  session = { peer: from, name, role: "host", auto: false };
  send({ t: "ok", from: state.code, name: state.name, to: from });
  incoming = null;
  emit();
}

export function ponteDeny() {
  if (!incoming) return;
  send({ t: "no", from: state.code, to: incoming.from });
  incoming = null;
  emit();
}

export function ponteCut() {
  if (session) send({ t: "cut", from: state.code, to: session.peer });
  session = null;
  emit();
}
