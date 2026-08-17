import { useEffect, useState } from "react";
import { ACTIVITY, REMINDERS } from "@/lib/os/data";
import { HOME_APPS, CATALOG } from "@/lib/os/catalog";
import { useOs } from "@/lib/os/store";
import type { DeskNav, OrbitId } from "@/lib/os/types";
import { FileTypeGlyph, OrbitNode } from "./FileGlyph";
import { AppIcon } from "./AppIcon";
import { OrbitMark } from "./Mark";
import { cn } from "@/lib/utils";

const NAV: { id: DeskNav; it: string; en: string; icon: string }[] = [
  { id: "home", it: "Home", en: "Home", icon: "home" },
  { id: "orbit", it: "Orbit", en: "Orbit", icon: "orbit" },
  { id: "stars", it: "Costellazioni", en: "Constellations", icon: "stars" },
  { id: "files", it: "File", en: "Files", icon: "files" },
  { id: "apps", it: "App", en: "Apps", icon: "apps" },
  { id: "settings", it: "Impostazioni", en: "Settings", icon: "set" },
];

const ORBITS: {
  id: OrbitId;
  it: string;
  en: string;
  icon: "work" | "person" | "study" | "rocket" | "chart";
  tone: "work" | "study" | "money" | "build" | "life";
  metaIt: string;
  metaEn: string;
}[] = [
  { id: "lavoro", it: "Lavoro", en: "Work", icon: "work", tone: "work", metaIt: "12 attività", metaEn: "12 items" },
  { id: "studio", it: "Studio", en: "Study", icon: "study", tone: "study", metaIt: "8 corsi", metaEn: "8 courses" },
  { id: "finanza", it: "Finanza", en: "Finance", icon: "chart", tone: "money", metaIt: "5 conti", metaEn: "5 accounts" },
  { id: "progetti", it: "Progetti", en: "Projects", icon: "rocket", tone: "build", metaIt: "4 attivi", metaEn: "4 active" },
  { id: "personale", it: "Personale", en: "Personal", icon: "person", tone: "life", metaIt: "7 aree", metaEn: "7 areas" },
];

const STARS: {
  id: string;
  it: string;
  en: string;
  hintIt: string;
  hintEn: string;
  orbits: OrbitId[];
}[] = [
  {
    id: "clienti",
    it: "Clienti attivi",
    en: "Active clients",
    hintIt: "Lavoro + Finanza. Contratti e scadenze, l’invio resta a te.",
    hintEn: "Work + Finance. Contracts and deadlines; sending stays with you.",
    orbits: ["lavoro", "finanza"],
  },
  {
    id: "opere",
    it: "Studio e opere",
    en: "Study and works",
    hintIt: "Studio + Progetti. Appunti, bozze, cose in corso.",
    hintEn: "Study + Projects. Notes, drafts, work in progress.",
    orbits: ["studio", "progetti"],
  },
  {
    id: "vita",
    it: "Casa e vita",
    en: "Home and life",
    hintIt: "Personale, con un piede nei progetti di casa.",
    hintEn: "Personal, with one foot in home projects.",
    orbits: ["personale", "progetti"],
  },
];

export function OrbitHome() {
  const lang = useOs((s) => s.lang);
  const nav = useOs((s) => s.deskNav);
  const orbit = useOs((s) => s.orbit);
  const operator = useOs((s) => s.operator);
  const setDeskNav = useOs((s) => s.setDeskNav);
  const setOrbit = useOs((s) => s.setOrbit);
  const setSpotlight = useOs((s) => s.setSpotlight);
  const openApp = useOs((s) => s.openApp);
  const openNode = useOs((s) => s.openNode);
  const installed = useOs((s) => s.installed);
  const showActivity = useOs((s) => s.showActivity);
  const setShowActivity = useOs((s) => s.setShowActivity);
  const showReminders = useOs((s) => s.showReminders);
  const setShowReminders = useOs((s) => s.setShowReminders);
  const approvals = useOs((s) => s.approvals);
  const [hot, setHot] = useState(false);
  const [hotId, setHotId] = useState<OrbitId | null>(null);
  const fs = useOs((s) => s.fs);
  const setFsFolder = useOs((s) => s.setFsFolder);
  const deskInk = useOs((s) => s.deskInk);
  const wallId = useOs((s) => s.wallId);
  const ink =
    deskInk === "auto"
      ? wallId === "notte" || wallId === "anelli" || wallId === "ghiaccio" || wallId === "colline"
        ? "light"
        : "dark"
      : deskInk;

  useEffect(() => {
    if (nav !== "apps" && nav !== "stars") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useOs.setState({ deskNav: "home" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  return (
    <div className="relative h-full" data-desk={ink}>
      <div className="ice-veil pointer-events-none absolute inset-0 z-[1]" />
      <aside className="absolute top-3 bottom-3 left-3 z-[8] hidden w-56 flex-col rounded-[32px] bg-white/70 px-3 py-6 shadow-[0_12px_40px_rgb(80_120_190/0.08)] ring-1 ring-white/80 backdrop-blur-xl md:flex">
        <div className="mb-8 px-3">
          <button
            type="button"
            onClick={() => {
              const next = !(showActivity && showReminders);
              setShowActivity(next);
              setShowReminders(next);
            }}
            className="text-left"
            aria-label={lang === "it" ? "Mostra o nascondi attività e promemoria" : "Show or hide panels"}
          >
            <p className="relative font-display text-[20px] font-semibold tracking-[0.22em] text-[#1b2744]">
              <svg className="absolute -top-4 left-1/2 h-5 w-28 -translate-x-1/2 text-[#3d6dff]" viewBox="0 0 112 20" fill="none" aria-hidden>
                <path d="M8 16c16-14 80-14 96 0" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="56" cy="5" r="1.6" fill="currentColor" />
              </svg>
              KRELUNA
            </p>
            <p className="mt-1 text-[9px] tracking-[0.22em] text-[#7a86a0] uppercase">Il tuo universo. Connesso.</p>
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === "files") {
                  openApp("files");
                  return;
                }
                if (item.id === "settings") {
                  openApp("settings");
                  return;
                }
                if (item.id === "orbit") {
                  openApp("browser");
                  window.open("https://www.google.com/", "_blank", "noopener,noreferrer");
                  return;
                }
                if (item.id === nav && (item.id === "apps" || item.id === "stars")) {
                  useOs.setState({ deskNav: "home" });
                  return;
                }
                setDeskNav(item.id);
              }}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm",
                nav === item.id
                  ? "bg-[#dce8ff] font-medium text-[#3d6dff] shadow-sm"
                  : "text-[#5a657c] hover:bg-white/55",
              )}
            >
              <NavIcon id={item.icon} />
              {lang === "it" ? item.it : item.en}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 px-2 pt-6">
          <span className="grid size-10 place-items-center rounded-full border border-dashed border-[#3d6dff]/40 text-xs font-semibold text-[#3d6dff]">
            {(operator || "K").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-medium text-[#1b2744]">
              {lang === "it" ? "Bentornato" : "Welcome"}, {operator || "Luca"}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-[#2a9d6e]">
              <span className="size-1.5 rounded-full bg-[#2a9d6e]" />
              {lang === "it" ? "Sincronizzato" : "Synced"}
            </p>
          </div>
        </div>
      </aside>

      <div className="absolute inset-x-0 bottom-20 z-10 flex justify-center gap-2 px-4 md:hidden">
        <button
          type="button"
          onClick={() => openApp("core")}
          className="rounded-full bg-ink-2/90 px-3 py-2 text-xs shadow-panel"
        >
          Core
        </button>
        <button
          type="button"
          onClick={() => openApp("office")}
          className="rounded-full bg-ink-2/90 px-3 py-2 text-xs shadow-panel"
        >
          {lang === "it" ? `Coda (${approvals.filter((a) => a.status === "pending").length})` : `Queue (${approvals.filter((a) => a.status === "pending").length})`}
        </button>
        <button
          type="button"
          onClick={() => useOs.getState().lock()}
          className="rounded-full bg-ink-2/90 px-3 py-2 text-xs shadow-panel"
        >
          {lang === "it" ? "Blocca" : "Lock"}
        </button>
      </div>

      <div className="absolute inset-0 grid place-items-center px-4 md:px-56">
        {nav === "apps" ? (
          <div className="brina w-full max-w-2xl rounded-[28px] p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs tracking-wide text-mist uppercase">
                {lang === "it" ? "Applicazioni" : "Applications"}
              </p>
              <button
                type="button"
                onClick={() => useOs.setState({ deskNav: "home" })}
                className="text-xs text-mist hover:text-paper"
              >
                {lang === "it" ? "Chiudi" : "Close"}
              </button>
            </div>
            <div className="grid max-h-[min(58vh,28rem)] grid-cols-4 gap-3 overflow-y-auto sm:grid-cols-5">
              {HOME_APPS.filter((id) => installed.includes(id)).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    openApp(id);
                    useOs.setState({ deskNav: "home" });
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl p-2 hover:bg-white/40"
                >
                  <AppIcon id={id} size={52} />
                  <span className="w-full truncate text-center text-[11px]">{CATALOG[id].title(lang)}</span>
                </button>
              ))}
            </div>
          </div>
        ) : nav === "stars" ? (
          <div className="flex w-full max-w-lg flex-col gap-3">
            <p className="text-center text-xs tracking-wide text-mist uppercase">
              {lang === "it" ? "Legami tra orbite" : "Links between orbits"}
            </p>
            {STARS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setOrbit(s.orbits[0])}
                className="glass-card rounded-2xl px-5 py-4 text-left"
              >
                <p className="text-sm font-medium">{lang === "it" ? s.it : s.en}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{lang === "it" ? s.hintIt : s.hintEn}</p>
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {s.orbits.map((id) => {
                    const o = ORBITS.find((x) => x.id === id);
                    return (
                      <span key={id} className="rounded-full bg-ink-3 px-2 py-0.5 text-[11px]">
                        {o ? (lang === "it" ? o.it : o.en) : id}
                      </span>
                    );
                  })}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-6 aspect-square w-[min(480px,68vmin)]">
              <svg className="pointer-events-none absolute inset-0 z-[4] h-full w-full" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#3d6dff" strokeWidth="0.18" opacity="0.35" />
                {ORBITS.map((o, i) => {
                  const rad = ((i * 72 - 90) * Math.PI) / 180;
                  const x = 50 + 42 * Math.cos(rad);
                  const y = 50 + 42 * Math.sin(rad);
                  const on = hotId === o.id || orbit === o.id;
                  return (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={x}
                      y2={y}
                      stroke="#3d6dff"
                      strokeWidth={on ? 0.85 : 0.28}
                      strokeLinecap="round"
                      opacity={on ? 0.95 : 0.28}
                    />
                  );
                })}
              </svg>
              <span className="orbit-ring pointer-events-none absolute inset-[18%] rounded-full opacity-70" />
              <span
                className={cn(
                  "pointer-events-none absolute inset-[6%] rounded-full border-2 transition-colors duration-200",
                  hot || showActivity ? "border-luna/80" : "orbit-ring",
                )}
              />
              <button
                type="button"
                onClick={() => openApp("core")}
                className="absolute top-1/2 left-1/2 z-10 size-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-[0_16px_40px_rgb(40_80_160/0.35)] ring-4 ring-white/70 transition-transform duration-200 hover:scale-105 active:scale-95"
                aria-label={lang === "it" ? "Parla con Kreluna" : "Talk to Kreluna"}
              >
                <img src="/os/orb.jpg" alt="" className="size-full rounded-full object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle,transparent_35%,rgb(20_40_90/0.25))]">
                  <span className="text-center font-display text-[15px] font-semibold leading-tight text-white drop-shadow">
                    Kreluna
                    <br />
                    Core
                  </span>
                </span>
              </button>
              {ORBITS.map((o, i) => {
                const rad = ((i * 72 - 90) * Math.PI) / 180;
                const x = 50 + 42 * Math.cos(rad);
                const y = 50 + 42 * Math.sin(rad);
                return (
                  <div
                    key={o.id}
                    className="absolute z-10"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <OrbitNode
                      label={lang === "it" ? o.it : o.en}
                      icon={o.icon}
                      meta={lang === "it" ? o.metaIt : o.metaEn}
                      tone={o.tone}
                      active={orbit === o.id || hotId === o.id}
                      onClick={() => setOrbit(o.id)}
                      onDoubleClick={() => {
                        setOrbit(o.id);
                        const folder =
                          fs.find((n) => n.kind === "folder" && n.orbit === o.id && n.parent === "docs") ??
                          fs.find((n) => n.kind === "folder" && n.orbit === o.id);
                        if (folder) setFsFolder(folder.id);
                        openApp("files");
                      }}
                      onHover={(on) => {
                        setHot(on);
                        setHotId(on ? o.id : null);
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => openApp("core")}
              className="brina flex w-[min(28rem,86vw)] items-center gap-3 rounded-full bg-white/85 px-3 py-2.5 text-left text-sm text-[#7a86a0] ring-1 ring-white"
            >
              <img src="/os/orb.jpg" alt="" className="size-8 rounded-full object-cover" />
              <span className="flex-1">{lang === "it" ? "Chiedi a Kreluna…" : "Ask Kreluna…"}</span>
              <span className="grid size-8 place-items-center rounded-full bg-white/70 text-luna">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="9" y="3.5" width="6" height="11" rx="3" />
                  <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3.5" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>

      {(showActivity || showReminders) && (
      <aside className="absolute top-3 right-3 bottom-3 z-[8] hidden w-72 flex-col gap-4 md:flex">
        {showActivity && (
          <div className="glass-card rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-[#5a657c]">
                {lang === "it" ? "Attività recenti" : "Recent activity"}
              </p>
              <button
                type="button"
                onClick={() => openApp("files")}
                className="text-[11px] text-[#3d6dff]"
              >
                {lang === "it" ? "Vedi tutte" : "See all"}
              </button>
            </div>
            <ul className="space-y-2.5">
              {ACTIVITY.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => a.fileId && openNode(a.fileId)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <FileTypeGlyph mime={a.mime} size={28} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{a.title}</span>
                      <span className="text-xs text-mist">{a.when}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {showReminders && (
          <div className="glass-card rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-mist uppercase">
                {lang === "it" ? "Promemoria" : "Reminders"}
              </p>
              <button
                type="button"
                onClick={() => setShowReminders(false)}
                className="text-[11px] text-mist hover:text-paper"
              >
                {lang === "it" ? "Nascondi" : "Hide"}
              </button>
            </div>
            <ul className="space-y-3">
              {REMINDERS.map((r) => (
                <li key={r.id} className="flex gap-3">
                  <span className="mt-1 size-2 rounded-full bg-warn" />
                  <span>
                    <span className="block text-sm">{r.title}</span>
                    <span className="text-xs text-mist">{r.when}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      )}
    </div>
  );
}

function NavIcon({ id }: { id: string }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    className: "size-4",
  };
  if (id === "home") return <OrbitMark size={18} />;
  if (id === "orbit") return <OrbitMark size={22} />;
  if (id === "stars")
    return (
      <svg {...p}>
        <circle cx="7" cy="8" r="1.4" />
        <circle cx="16" cy="7" r="1.1" />
        <circle cx="13" cy="15" r="1.6" />
        <path d="M7 8c3 1 6 4 9 7" />
      </svg>
    );
  if (id === "files")
    return (
      <svg {...p}>
        <path d="M4 8.5 6 6h5l1.5 2.5H20v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5V8.5z" />
      </svg>
    );
  if (id === "apps")
    return (
      <svg {...p}>
        <rect x="4" y="4" width="6" height="6" rx="1.4" />
        <rect x="14" y="4" width="6" height="6" rx="1.4" />
        <rect x="4" y="14" width="6" height="6" rx="1.4" />
        <rect x="14" y="14" width="6" height="6" rx="1.4" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2l-1.4 1.4" />
    </svg>
  );
}
