import { create } from "zustand";
import { CATALOG } from "./catalog";
import { suggestLite, readCaps } from "./compat";
import { FS, NOTES, MAILS, SEED_APPROVALS, SEED_NOTIFS } from "./data";
import { serializeSystemImage } from "./kernel";
import { hashPin, pinOk } from "./pin";
import { sealManifest, serializeLuna, LUNA_FORMAT, LUNA_RUNTIME } from "./luna";
import type {
  AppId,
  Approval,
  CtxMenu,
  DeskNav,
  FsNode,
  Lang,
  MailItem,
  Mime,
  Note,
  Notif,
  OrbitId,
  Phase,
  TaskItem,
  Theme,
  Win,
} from "./types";

const PREFS_KEY = "kreluna-os-prefs-v4";

const CORE_APPS: AppId[] = [
  "core",
  "office",
  "cyber",
  "files",
  "mail",
  "calendar",
  "notes",
  "terminal",
  "settings",
  "browser",
  "store",
  "luna",
  "ponte",
];

export const EXTRA_APPS: AppId[] = [
  "calc",
  "editor",
  "photos",
  "monitor",
  "clock",
  "paint",
  "tasks",
  "trash",
];

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface Prefs {
  lang: Lang;
  theme: Theme;
  notes: Note[];
  mails: MailItem[];
  approvals: Approval[];
  notifications: Notif[];
  focus: boolean;
  setupDone: boolean;
  operator: string;
  fs: FsNode[];
  installed: AppId[];
  tasks: TaskItem[];
  volume: number;
  brightness: number;
  showActivity: boolean;
  showReminders: boolean;
  showOrbits: boolean;
  lite: boolean;
  wallId: string;
  wallDim: 0 | 1 | 2;
  saverMin: number;
  saverClock: boolean;
  appsOpen: "grid" | "store";
  deskInk: "auto" | "dark" | "light";
  pinHash: string;
  lockMin: number;
  coreNet: boolean;
}

function migrateFs(nodes: FsNode[]): FsNode[] {
  const list = nodes.map((n) => ({ ...n }));
  const ensure = (id: OrbitId, name: string) => {
    if (!list.some((n) => n.id === id)) {
      list.push({ id, name, kind: "folder", parent: "docs", orbit: id });
    }
  };
  ensure("lavoro", "Lavoro");
  ensure("personale", "Personale");
  ensure("studio", "Studio");
  ensure("progetti", "Progetti");
  ensure("finanza", "Finanza");
  const move: Record<string, string> = {
    famiglia: "personale",
    foto: "personale",
    casa: "personale",
    idee: "studio",
    fatture: "finanza",
    clienti: "lavoro",
  };
  for (const n of list) {
    const dest = move[n.id];
    if (dest && n.parent === "docs") n.parent = dest;
  }
  return list;
}

function loadPrefs(): Partial<Prefs> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? (JSON.parse(raw) as Partial<Prefs>) : {};
  } catch {
    return {};
  }
}

function savePrefs(s: OsState) {
  if (typeof window === "undefined") return;
  const prefs: Prefs = {
    lang: s.lang,
    theme: s.theme,
    notes: s.notes,
    mails: s.mails,
    approvals: s.approvals,
    notifications: s.notifications,
    focus: s.focusMode,
    setupDone: s.setupDone,
    operator: s.operator,
    fs: s.fs,
    installed: s.installed,
    tasks: s.tasks,
    volume: s.volume,
    brightness: s.brightness,
    showActivity: s.showActivity,
    showReminders: s.showReminders,
    showOrbits: s.showOrbits,
    lite: s.lite,
    wallId: s.wallId,
    wallDim: s.wallDim,
    saverMin: s.saverMin,
    saverClock: s.saverClock,
    appsOpen: s.appsOpen,
    deskInk: s.deskInk,
    pinHash: s.pinHash,
    lockMin: s.lockMin,
    coreNet: s.coreNet,
  };
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function cascade(count: number): { x: number; y: number; w: number; h: number } {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const w = Math.min(880, Math.max(520, vw * 0.62));
  const h = Math.min(620, Math.max(380, vh * 0.62));
  const x = Math.max(240, (vw - w) / 2 + (count % 5) * 28);
  const y = Math.max(64, (vh - h) / 2 + (count % 5) * 22 - 40);
  return { x, y, w, h };
}

function nowLabel(lang: Lang) {
  return new Date().toLocaleTimeString(lang === "it" ? "it-IT" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface OsState {
  phase: Phase;
  lang: Lang;
  theme: Theme;
  setupDone: boolean;
  operator: string;
  deskNav: DeskNav;
  orbit: OrbitId;
  wins: Win[];
  focused: string | null;
  zTop: number;
  space: number;
  spotlight: boolean;
  control: boolean;
  notifPanel: boolean;
  appleMenu: boolean;
  aboutOpen: boolean;
  switcher: boolean;
  mobileApp: AppId | null;
  focusMode: boolean;
  volume: number;
  brightness: number;
  notifications: Notif[];
  approvals: Approval[];
  notes: Note[];
  noteId: string | null;
  mails: MailItem[];
  mailId: string | null;
  fs: FsNode[];
  fsFolder: string;
  editorId: string | null;
  lunaFileId: string | null;
  installed: AppId[];
  tasks: TaskItem[];
  ctx: CtxMenu | null;
  showActivity: boolean;
  showReminders: boolean;
  showOrbits: boolean;
  lite: boolean;
  wallId: string;
  wallDim: 0 | 1 | 2;
  saverMin: number;
  saverClock: boolean;
  appsOpen: "grid" | "store";
  deskInk: "auto" | "dark" | "light";
  pinHash: string;
  lockMin: number;
  coreNet: boolean;
  saverOn: boolean;
  bootDone: () => void;
  finishSetup: (operator: string) => void;
  unlock: (pin?: string) => Promise<boolean>;
  lock: () => void;
  sleep: () => void;
  restart: () => void;
  shutdown: () => void;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  setOperator: (name: string) => void;
  setShowActivity: (v: boolean) => void;
  setShowReminders: (v: boolean) => void;
  setShowOrbits: (v: boolean) => void;
  setLite: (v: boolean) => void;
  setWall: (id: string) => void;
  setWallDim: (n: 0 | 1 | 2) => void;
  setSaverMin: (n: number) => void;
  setSaverClock: (v: boolean) => void;
  setAppsOpen: (v: "grid" | "store") => void;
  setDeskInk: (v: "auto" | "dark" | "light") => void;
  setPin: (pin: string) => Promise<boolean>;
  clearPin: () => void;
  setLockMin: (n: number) => void;
  setCoreNet: (v: boolean) => void;
  bumpIdle: () => void;
  wakeSaver: () => void;
  startSaver: () => void;
  setDeskNav: (nav: DeskNav) => void;
  setOrbit: (id: OrbitId) => void;
  importFiles: (files: File[], parent?: string) => Promise<void>;
  toggleFocus: () => void;
  setVolume: (n: number) => void;
  setBrightness: (n: number) => void;
  setSpace: (n: number) => void;
  openApp: (appId: AppId) => void;
  closeWin: (id: string) => void;
  focusWin: (id: string) => void;
  minWin: (id: string) => void;
  maxWin: (id: string) => void;
  moveWin: (id: string, x: number, y: number) => void;
  resizeWin: (id: string, x: number, y: number, w: number, h: number) => void;
  snapWin: (id: string, side: "left" | "right" | "max") => void;
  cycleWins: () => void;
  setSpotlight: (v: boolean) => void;
  setControl: (v: boolean) => void;
  setNotif: (v: boolean) => void;
  setApple: (v: boolean) => void;
  setAbout: (v: boolean) => void;
  setSwitcher: (v: boolean) => void;
  closeChrome: () => void;
  markNotifsRead: () => void;
  pushNotif: (n: Omit<Notif, "id" | "time" | "read">) => void;
  resolveApproval: (id: string, status: "approved" | "denied") => void;
  addApproval: (a: Omit<Approval, "id" | "status">) => void;
  setNoteId: (id: string | null) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  addNote: () => void;
  setMailId: (id: string | null) => void;
  markMailRead: (id: string) => void;
  sendMail: (to: string, subject: string, body: string) => void;
  setFsFolder: (id: string) => void;
  createNode: (parent: string, name: string, kind: "file" | "folder", content?: string, mime?: FsNode["mime"]) => string;
  renameNode: (id: string, name: string) => void;
  tintNode: (id: string, tint: import("./types").FolderTint) => void;
  trashNode: (id: string) => void;
  restoreNode: (id: string) => void;
  emptyTrash: () => void;
  writeFile: (id: string, content: string) => void;
  openNode: (id: string) => void;
  setEditorId: (id: string | null) => void;
  setLunaFile: (id: string | null) => void;
  createLuna: (nameIt: string, kind: "app" | "flow" | "library", summary: string) => string;
  implant: () => string;
  installApp: (id: AppId) => void;
  removeApp: (id: AppId) => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  setCtx: (ctx: CtxMenu | null) => void;
  closeMobile: () => void;
}

const seed = loadPrefs();
const defaultInstalled: AppId[] = [...CORE_APPS, ...EXTRA_APPS];

export const useOs = create<OsState>((set, get) => ({
  phase: "desktop",
  lang: seed.lang ?? "it",
  theme: seed.theme ?? "dawn",
  setupDone: seed.setupDone ?? true,
  operator: seed.operator ?? "Luca",
  deskNav: "home",
  orbit: "lavoro",
  wins: [],
  focused: null,
  zTop: 40,
  space: 0,
  spotlight: false,
  control: false,
  notifPanel: false,
  appleMenu: false,
  aboutOpen: false,
  switcher: false,
  mobileApp: null,
  focusMode: seed.focus ?? false,
  volume: seed.volume ?? 70,
  brightness: seed.brightness ?? 80,
  notifications: seed.notifications ?? SEED_NOTIFS,
  approvals: seed.approvals ?? SEED_APPROVALS,
  notes: seed.notes ?? NOTES,
  noteId: (seed.notes ?? NOTES)[0]?.id ?? null,
  mails: seed.mails ?? MAILS,
  mailId: null,
  fs: migrateFs(seed.fs ?? FS.map((n) => ({ ...n }))),
  fsFolder: "docs",
  editorId: null,
  lunaFileId: "f-luna",
  installed: (() => {
    const list = seed.installed ?? defaultInstalled;
    return list.includes("ponte") ? list : [...list, "ponte"];
  })(),
  tasks: seed.tasks ?? [
    { id: "t1", title: "Revisionare ACM-0412", done: false },
    { id: "t2", title: "Chiudere rilievo TLS", done: false },
    { id: "t3", title: "Pubblicare solo fatti verificati", done: true },
  ],
  ctx: null,
  showActivity: seed.showActivity ?? true,
  showReminders: seed.showReminders ?? true,
  showOrbits: seed.showOrbits ?? true,
  lite: seed.lite ?? (typeof window !== "undefined" ? suggestLite(readCaps()) : false),
  wallId: !seed.wallId || seed.wallId === "orbita" ? "universo" : seed.wallId,
  wallDim: seed.wallDim ?? 1,
  saverMin: seed.saverMin ?? 2,
  saverClock: seed.saverClock ?? true,
  appsOpen: seed.appsOpen === "store" ? "store" : "grid",
  deskInk: seed.deskInk === "dark" || seed.deskInk === "light" ? seed.deskInk : "auto",
  pinHash: typeof seed.pinHash === "string" ? seed.pinHash : "",
  lockMin: seed.lockMin ?? 5,
  coreNet: seed.coreNet === true,
  saverOn: false,

  bootDone: () => set({ phase: get().setupDone ? "lock" : "setup" }),
  finishSetup: (operator) => {
    set({ setupDone: true, operator: operator.trim() || (get().lang === "it" ? "Operatore" : "Operator"), phase: "lock" });
    savePrefs(get());
  },
  unlock: async (pin) => {
    const need = get().pinHash;
    if (need) {
      if (!pin) return false;
      if ((await hashPin(pin)) !== need) return false;
    }
    set({ phase: "desktop", saverOn: false });
    return true;
  },
  lock: () => set({ phase: "lock", saverOn: false, appleMenu: false, control: false, notifPanel: false }),
  sleep: () =>
    set({
      phase: "sleep",
      appleMenu: false,
      control: false,
      notifPanel: false,
      spotlight: false,
      switcher: false,
    }),
  restart: () =>
    set({
      phase: "boot",
      wins: [],
      focused: null,
      mobileApp: null,
      appleMenu: false,
      aboutOpen: false,
      switcher: false,
    }),
  shutdown: () =>
    set({
      phase: "shutdown",
      appleMenu: false,
      wins: [],
      mobileApp: null,
    }),

  setLang: (lang) => {
    set({ lang });
    savePrefs(get());
  },
  setTheme: (theme) => {
    set({ theme });
    savePrefs(get());
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  },
  setOperator: (operator) => {
    set({ operator });
    savePrefs(get());
  },
  setShowActivity: (showActivity) => {
    set({ showActivity });
    savePrefs(get());
  },
  setShowReminders: (showReminders) => {
    set({ showReminders });
    savePrefs(get());
  },
  setShowOrbits: (showOrbits) => {
    set({ showOrbits });
    savePrefs(get());
  },
  setLite: (lite) => {
    set({ lite });
    savePrefs(get());
  },
  setWall: (wallId) => {
    set({ wallId });
    savePrefs(get());
  },
  setWallDim: (wallDim) => {
    set({ wallDim });
    savePrefs(get());
  },
  setSaverMin: (saverMin) => {
    set({ saverMin, saverOn: false });
    savePrefs(get());
  },
  setSaverClock: (saverClock) => {
    set({ saverClock });
    savePrefs(get());
  },
  setAppsOpen: (appsOpen) => {
    set({ appsOpen });
    savePrefs(get());
  },
  setDeskInk: (deskInk) => {
    set({ deskInk });
    savePrefs(get());
  },
  setPin: async (pin) => {
    if (!pinOk(pin)) return false;
    const pinHash = await hashPin(pin);
    set({ pinHash });
    savePrefs(get());
    return true;
  },
  clearPin: () => {
    set({ pinHash: "" });
    savePrefs(get());
  },
  setLockMin: (lockMin) => {
    set({ lockMin });
    savePrefs(get());
  },
  setCoreNet: (coreNet) => {
    set({ coreNet });
    savePrefs(get());
  },
  bumpIdle: () => {
    if (get().saverOn) set({ saverOn: false });
  },
  wakeSaver: () => {
    if (get().pinHash) set({ saverOn: false, phase: "lock" });
    else set({ saverOn: false });
  },
  startSaver: () => {
    if (get().phase === "desktop" && get().saverMin > 0) set({ saverOn: true });
  },
  setDeskNav: (deskNav) => {
    set({ deskNav });
    if (deskNav === "files") {
      get().openApp("files");
      const win = get().wins.find((w) => w.appId === "files" && w.space === get().space);
      if (win && !win.max) get().maxWin(win.id);
    }
    if (deskNav === "apps") {
      if (get().appsOpen === "store") {
        get().openApp("store");
      } else {
        set({ wins: get().wins.map((w) => ({ ...w, min: true })), focused: null });
      }
    }
    if (deskNav === "settings") get().openApp("settings");
    if (deskNav === "home") {
      set({ mobileApp: null });
    }
    if (deskNav === "orbit") {
      set({ deskNav: "home" });
    }
  },
  setOrbit: (orbit) => {
    set({ orbit });
    const folder =
      get().fs.find((n) => n.id === orbit) ??
      get().fs.find((n) => n.kind === "folder" && n.orbit === orbit);
    if (folder) get().setFsFolder(folder.id);
  },
  importFiles: async (files, parent) => {
    const dest = parent ?? get().fsFolder ?? "down";
    for (const file of files) {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf.slice(0, 24));
      const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join(" ");
      const mz = bytes[0] === 0x4d && bytes[1] === 0x5a;
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const mime: Mime =
        ext === "exe" || mz
          ? "exe"
          : ext === "luna"
            ? "luna"
            : ext === "pdf"
              ? "pdf"
              : ext === "docx"
                ? "docx"
                : ext === "xlsx"
                  ? "xlsx"
                  : ext === "pptx"
                    ? "pptx"
                    : ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)
                      ? "img"
                      : ext === "md"
                        ? "md"
                        : ext === "log"
                          ? "log"
                          : "bin";
      const text =
        mime === "md" || mime === "luna" || mime === "log"
          ? await file.text()
          : mime === "exe"
            ? "Binario Windows PE importato. Kreluna lo conserva e lo legge, ma non lo esegue."
            : "";
      get().createNode(dest, file.name, "file", text, mime);
      const created = get().fs.filter((n) => n.name === file.name && n.parent === dest).at(-1);
      if (created && (mime === "exe" || mime === "bin")) {
        set((s) => ({
          fs: s.fs.map((n) =>
            n.id === created.id
              ? { ...n, meta: hex, size: `${Math.max(1, Math.round(file.size / 1024))} KB` }
              : n,
          ),
        }));
      }
    }
    savePrefs(get());
    get().pushNotif({
      appId: "files",
      title: get().lang === "it" ? "File importati nel disco Kreluna" : "Files imported into Kreluna disk",
      body: files.map((f) => f.name).join(", "),
      kind: "info",
    });
  },
  toggleFocus: () => {
    set({ focusMode: !get().focusMode });
    savePrefs(get());
  },
  setVolume: (n) => {
    set({ volume: Math.max(0, Math.min(100, n)) });
    savePrefs(get());
  },
  setBrightness: (n) => {
    set({ brightness: Math.max(20, Math.min(100, n)) });
    savePrefs(get());
  },
  setSpace: (n) => set({ space: n, focused: null }),

  openApp: (appId) => {
    const s = get();
    if (!s.installed.includes(appId) && appId !== "store" && appId !== "settings") {
      get().installApp(appId);
    }
    const mobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 719px)").matches;
    if (mobile) {
      set({ mobileApp: appId, spotlight: false, control: false, notifPanel: false, switcher: false });
      return;
    }
    const existing = s.wins.find((w) => w.appId === appId && !w.min && w.space === s.space);
    if (existing) {
      get().focusWin(existing.id);
      set({ spotlight: false, switcher: false });
      return;
    }
    const minimized = s.wins.find((w) => w.appId === appId && w.min && w.space === s.space);
    if (minimized) {
      set({
        wins: s.wins.map((w) => (w.id === minimized.id ? { ...w, min: false } : w)),
      });
      get().focusWin(minimized.id);
      set({ spotlight: false, switcher: false });
      return;
    }
    const app = CATALOG[appId];
    const pos = cascade(s.wins.filter((w) => w.space === s.space).length);
    const id = uid("win");
    const z = s.zTop + 1;
    const win: Win = {
      id,
      appId,
      title: app.title(s.lang),
      x: pos.x,
      y: pos.y,
      w: app.w ?? pos.w,
      h: app.h ?? pos.h,
      z,
      min: false,
      max: false,
      space: s.space,
    };
    set({
      wins: [...s.wins, win],
      focused: id,
      zTop: z,
      spotlight: false,
      control: false,
      notifPanel: false,
      appleMenu: false,
      switcher: false,
      ctx: null,
    });
  },

  closeWin: (id) =>
    set((s) => {
      const next = s.wins.filter((w) => w.id !== id);
      return {
        wins: next,
        focused: s.focused === id ? (next.filter((w) => w.space === s.space).at(-1)?.id ?? null) : s.focused,
      };
    }),

  focusWin: (id) =>
    set((s) => {
      const z = s.zTop + 1;
      return {
        focused: id,
        zTop: z,
        appleMenu: false,
        control: false,
        notifPanel: false,
        switcher: false,
        ctx: null,
        wins: s.wins.map((w) => (w.id === id ? { ...w, z, min: false } : w)),
      };
    }),

  minWin: (id) =>
    set((s) => ({
      wins: s.wins.map((w) => (w.id === id ? { ...w, min: true, max: false } : w)),
      focused: s.focused === id ? null : s.focused,
    })),

  maxWin: (id) =>
    set((s) => ({
      wins: s.wins.map((w) => (w.id === id ? { ...w, max: !w.max } : w)),
      focused: id,
    })),

  moveWin: (id, x, y) =>
    set((s) => ({
      wins: s.wins.map((w) => (w.id === id ? { ...w, x, y, max: false } : w)),
    })),

  resizeWin: (id, x, y, w, h) =>
    set((s) => ({
      wins: s.wins.map((win) =>
        win.id === id ? { ...win, x, y, w: Math.max(360, w), h: Math.max(240, h), max: false } : win,
      ),
    })),

  snapWin: (id, side) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    if (side === "max") {
      get().maxWin(id);
      return;
    }
    const w = Math.floor(vw / 2) - 8;
    const h = vh - 36 - 96;
    const x = side === "left" ? 4 : Math.floor(vw / 2) + 4;
    get().resizeWin(id, x, 40, w, h);
    get().focusWin(id);
  },

  cycleWins: () => {
    const s = get();
    const list = s.wins.filter((w) => !w.min && w.space === s.space).sort((a, b) => a.z - b.z);
    if (!list.length) return;
    const i = list.findIndex((w) => w.id === s.focused);
    const next = list[(i + 1) % list.length];
    if (next) get().focusWin(next.id);
  },

  setSpotlight: (v) =>
    set({ spotlight: v, control: false, notifPanel: false, appleMenu: false, switcher: false, ctx: null }),
  setControl: (v) =>
    set({ control: v, spotlight: false, notifPanel: false, appleMenu: false, switcher: false, ctx: null }),
  setNotif: (v) =>
    set({ notifPanel: v, spotlight: false, control: false, appleMenu: false, switcher: false, ctx: null }),
  setApple: (v) =>
    set({ appleMenu: v, spotlight: false, control: false, notifPanel: false, switcher: false, ctx: null }),
  setAbout: (v) => set({ aboutOpen: v, appleMenu: false }),
  setSwitcher: (v) =>
    set({ switcher: v, spotlight: false, control: false, notifPanel: false, appleMenu: false, ctx: null }),
  closeChrome: () =>
    set({
      spotlight: false,
      control: false,
      notifPanel: false,
      appleMenu: false,
      switcher: false,
      ctx: null,
    }),
  closeMobile: () => set({ mobileApp: null }),
  setCtx: (ctx) => set({ ctx, appleMenu: false, control: false, notifPanel: false }),

  markNotifsRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
    savePrefs(get());
  },
  pushNotif: (n) => {
    set((s) => ({
      notifications: [
        { ...n, id: uid("nt"), time: nowLabel(s.lang), read: false },
        ...s.notifications,
      ],
    }));
    savePrefs(get());
  },

  resolveApproval: (id, status) => {
    set((s) => ({
      approvals: s.approvals.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
    savePrefs(get());
  },

  addApproval: (a) => {
    set((s) => ({
      approvals: [{ ...a, id: uid("ap"), status: "pending" }, ...s.approvals],
      notifications: [
        {
          id: uid("nt"),
          appId: a.source,
          title: s.lang === "it" ? "Approvazione richiesta" : "Approval required",
          body: a.title,
          time: nowLabel(s.lang),
          read: false,
          kind: "review",
        },
        ...s.notifications,
      ],
    }));
    savePrefs(get());
  },

  setNoteId: (id) => set({ noteId: id }),
  updateNote: (id, patch) => {
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
    savePrefs(get());
  },
  addNote: () => {
    const n: Note = {
      id: uid("note"),
      title: get().lang === "it" ? "Senza titolo" : "Untitled",
      body: "",
      updated: get().lang === "it" ? "Ora" : "Now",
    };
    set((s) => ({ notes: [n, ...s.notes], noteId: n.id }));
    savePrefs(get());
  },

  setMailId: (id) => set({ mailId: id }),
  markMailRead: (id) => {
    set((s) => ({
      mails: s.mails.map((m) => (m.id === id ? { ...m, unread: false } : m)),
    }));
    savePrefs(get());
  },
  sendMail: (to, subject, body) => {
    const item: MailItem = {
      id: uid("mail"),
      from: get().lang === "it" ? "Tu" : "You",
      fromEmail: `${get().operator || "operatore"}@kreluna.os`,
      subject,
      preview: body.slice(0, 80),
      body: `${to}\n\n${body}`,
      time: nowLabel(get().lang),
      unread: false,
      tag: get().lang === "it" ? "Inviate" : "Sent",
    };
    set((s) => ({ mails: [item, ...s.mails], mailId: item.id }));
    savePrefs(get());
  },

  setFsFolder: (id) => set({ fsFolder: id }),
  createNode: (parent, name, kind, content = "", mime = "txt") => {
    const id = uid(kind === "folder" ? "dir" : "file");
    const node: FsNode = {
      id,
      name,
      kind,
      parent,
      mime: kind === "file" ? mime : undefined,
      size: kind === "file" ? `${Math.max(1, Math.round(content.length / 40))} KB` : undefined,
      updated: get().lang === "it" ? "Ora" : "Now",
      content: kind === "file" ? content : undefined,
    };
    set((s) => ({ fs: [...s.fs, node] }));
    savePrefs(get());
    return id;
  },
  renameNode: (id, name) => {
    set((s) => ({ fs: s.fs.map((n) => (n.id === id ? { ...n, name } : n)) }));
    savePrefs(get());
  },
  tintNode: (id, tint) => {
    set((s) => ({ fs: s.fs.map((n) => (n.id === id ? { ...n, tint } : n)) }));
    savePrefs(get());
  },
  trashNode: (id) => {
    set((s) => ({
      fs: s.fs.map((n) => (n.id === id || n.parent === id ? { ...n, trashed: true } : n)),
    }));
    savePrefs(get());
  },
  restoreNode: (id) => {
    set((s) => ({
      fs: s.fs.map((n) => (n.id === id ? { ...n, trashed: false } : n)),
    }));
    savePrefs(get());
  },
  emptyTrash: () => {
    set((s) => ({ fs: s.fs.filter((n) => !n.trashed) }));
    savePrefs(get());
  },
  writeFile: (id, content) => {
    set((s) => ({
      fs: s.fs.map((n) =>
        n.id === id
          ? { ...n, content, size: `${Math.max(1, Math.round(content.length / 40))} KB`, updated: get().lang === "it" ? "Ora" : "Now" }
          : n,
      ),
    }));
    savePrefs(get());
  },
  setEditorId: (id) => set({ editorId: id }),
  setLunaFile: (id) => set({ lunaFileId: id }),
  createLuna: (nameIt, kind, summary) => {
    const slug = nameIt
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.|\.$/g, "") || "pacchetto";
    const operator = get().operator || "operatore";
    const pkg = sealManifest(
      {
        format: LUNA_FORMAT,
        id: `locale.${slug}`,
        name: { it: nameIt, en: nameIt },
        version: "0.1.0",
        kind,
        runtime: LUNA_RUNTIME,
        author: operator,
        orbit: get().orbit,
        summary: { it: summary, en: summary },
        permissions: [
          { id: "fs.read", scope: "/Documenti", grant: "ask", why: "Legge solo se lo chiedi." },
          { id: "act.send", scope: "any", grant: "deny", why: "Nessun invio autonomo." },
          { id: "net.out", scope: "none", grant: "deny", why: "Niente rete." },
        ],
        capabilities: ["draft", "never-autonomous"],
        humanGate: true,
      },
      `operator.${operator.toLowerCase()}`,
    );
    const file = `${nameIt.replace(/\s+/g, "")}.luna`;
    const id = get().createNode("native", file, "file", serializeLuna(pkg), "luna");
    set({ lunaFileId: id });
    return id;
  },
  implant: () => {
    const content = serializeSystemImage(get().operator);
    const existing = get().fs.find((n) => n.id === "f-sysimg" || n.name === "Kreluna.sys.luna");
    if (existing) {
      get().writeFile(existing.id, content);
      return existing.id;
    }
    return get().createNode("sys", "Kreluna.sys.luna", "file", content, "luna");
  },
  openNode: (id) => {
    const node = get().fs.find((n) => n.id === id);
    if (!node) return;
    if (node.kind === "folder") {
      set({ fsFolder: node.id });
      get().openApp("files");
      return;
    }
    if (node.mime === "img") {
      get().openApp("photos");
      return;
    }
    if (node.mime === "luna") {
      set({ lunaFileId: id });
      get().openApp("luna");
      return;
    }
    if (node.mime === "exe" || node.mime === "bin" || node.mime === "pdf" || node.mime === "docx" || node.mime === "xlsx" || node.mime === "pptx") {
      set({ fsFolder: node.parent ?? "docs" });
      get().openApp("files");
      return;
    }
    set({ editorId: id });
    get().openApp("editor");
  },

  installApp: (id) => {
    set((s) => ({ installed: s.installed.includes(id) ? s.installed : [...s.installed, id] }));
    savePrefs(get());
    get().pushNotif({
      appId: "store",
      title: get().lang === "it" ? "App installata" : "App installed",
      body: CATALOG[id].title(get().lang),
      kind: "info",
    });
  },
  removeApp: (id) => {
    if (CORE_APPS.includes(id)) return;
    set((s) => ({
      installed: s.installed.filter((a) => a !== id),
      wins: s.wins.filter((w) => w.appId !== id),
    }));
    savePrefs(get());
  },

  addTask: (title) => {
    const tsk: TaskItem = { id: uid("task"), title, done: false };
    set((s) => ({ tasks: [tsk, ...s.tasks] }));
    savePrefs(get());
  },
  toggleTask: (id) => {
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
    savePrefs(get());
  },
  removeTask: (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    savePrefs(get());
  },
}));
