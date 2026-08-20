import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Check,
  Circle,
  Files,
  Folder,
  Grid3X3,
  Home,
  Mic,
  Network,
  Orbit,
  PieChart,
  Plus,
  Rocket,
  Search,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { ACTIVITY } from "@/lib/os/data";
import { useOs } from "@/lib/os/store";
import type { AppId, LuminaNodeId } from "@/lib/os/types";
import { AppIcon } from "./AppIcon";
import { FileTypeGlyph } from "./FileGlyph";
import { cn } from "@/lib/utils";

const AREA_NODES: Array<{
  id: LuminaNodeId;
  it: string;
  en: string;
  metaIt: string;
  metaEn: string;
  icon: LucideIcon;
  x: string;
  y: string;
}> = [
  { id: "lavoro", it: "Lavoro", en: "Work", metaIt: "12 attività", metaEn: "12 items", icon: Briefcase, x: "50%", y: "10%" },
  { id: "studio", it: "Studio", en: "Study", metaIt: "8 corsi", metaEn: "8 courses", icon: BookOpen, x: "81%", y: "29%" },
  { id: "finanza", it: "Finanza", en: "Finance", metaIt: "5 conti", metaEn: "5 accounts", icon: PieChart, x: "81%", y: "65%" },
  { id: "files", it: "File", en: "Files", metaIt: "1.234 elementi", metaEn: "1,234 items", icon: Folder, x: "50%", y: "78%" },
  { id: "personale", it: "Personale", en: "Personal", metaIt: "7 aree", metaEn: "7 areas", icon: UserRound, x: "19%", y: "65%" },
  { id: "progetti", it: "Progetti", en: "Projects", metaIt: "4 attivi", metaEn: "4 active", icon: Rocket, x: "19%", y: "29%" },
];

const ORBIT_LINKS: Array<{ id: LuminaNodeId; x: number; y: number }> = [
  { id: "lavoro", x: 400, y: 60 },
  { id: "studio", x: 648, y: 174 },
  { id: "finanza", x: 648, y: 390 },
  { id: "files", x: 400, y: 468 },
  { id: "personale", x: 152, y: 390 },
  { id: "progetti", x: 152, y: 174 },
];

const DOCK_ITEMS: Array<{
  id: AppId;
  it: string;
  en: string;
}> = [
  { id: "core", it: "Focus", en: "Focus" },
  { id: "calendar", it: "Calendario", en: "Calendar" },
  { id: "mail", it: "Comunicazioni", en: "Messages" },
  { id: "cyber", it: "Analisi", en: "Insights" },
  { id: "notes", it: "Note", en: "Notes" },
];

function KrelunaBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("lumina-brand", compact && "lumina-brand--compact")}>
      <svg viewBox="0 0 190 38" aria-hidden>
        <path d="M10 29C34 4 126 3 176 27" />
        <circle cx="126" cy="6" r="2.2" />
        <path d="m126 0 1.7 4.2L132 6l-4.3 1.7L126 12l-1.7-4.3L120 6l4.3-1.8L126 0Z" />
      </svg>
      <div className="lumina-brand-copy">
        <strong>KRELUNA</strong>
        <span>Il tuo universo. Connesso.</span>
      </div>
    </div>
  );
}

function NavGlyph({ id }: { id: "home" | "orbit" | "stars" | "files" | "apps" | "settings" }) {
  const Icon =
    id === "home"
      ? Home
      : id === "orbit"
        ? Orbit
        : id === "stars"
          ? Network
          : id === "files"
            ? Files
            : id === "apps"
              ? Grid3X3
              : Settings;
  return <Icon className="size-[22px]" strokeWidth={1.55} aria-hidden />;
}

export function LuminaHome() {
  const lang = useOs((s) => s.lang);
  const operator = useOs((s) => s.operator);
  const activeLuminaNode = useOs((s) => s.activeLuminaNode);
  const fs = useOs((s) => s.fs);
  const wins = useOs((s) => s.wins);
  const mobileApp = useOs((s) => s.mobileApp);
  const approvals = useOs((s) => s.approvals);
  const mails = useOs((s) => s.mails);
  const tasks = useOs((s) => s.tasks);
  const showActivity = useOs((s) => s.showActivity);
  const showReminders = useOs((s) => s.showReminders);
  const setOrbit = useOs((s) => s.setOrbit);
  const setActiveLuminaNode = useOs((s) => s.setActiveLuminaNode);
  const setFsFolder = useOs((s) => s.setFsFolder);
  const setSpotlight = useOs((s) => s.setSpotlight);
  const openApp = useOs((s) => s.openApp);
  const openNode = useOs((s) => s.openNode);
  const toggleTask = useOs((s) => s.toggleTask);

  const pending = approvals.filter((item) => item.status === "pending").length;
  const unread = mails.filter((item) => item.unread).length;

  const keepLuminaInView = () => {
    document.querySelector(".lumina-stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openArea = (id: LuminaNodeId) => {
    setActiveLuminaNode(id);
    if (id === "files") {
      setFsFolder("docs");
      openApp("files");
      return;
    }
    setOrbit(id);
    const folder =
      fs.find((node) => node.kind === "folder" && node.orbit === id && node.parent === "docs") ??
      fs.find((node) => node.kind === "folder" && node.orbit === id);
    if (folder) setFsFolder(folder.id);
    openApp("files");
  };

  const navItems: Array<{
    id: "home" | "orbit" | "stars" | "files" | "apps" | "settings";
    it: string;
    en: string;
    run: () => void;
  }> = [
    { id: "home", it: "Home", en: "Home", run: keepLuminaInView },
    {
      id: "orbit",
      it: "Orbit",
      en: "Orbit",
      run: keepLuminaInView,
    },
    {
      id: "stars",
      it: "Costellazioni",
      en: "Constellations",
      run: keepLuminaInView,
    },
    { id: "files", it: "Documenti", en: "Documents", run: () => openApp("files") },
    { id: "apps", it: "App", en: "Apps", run: () => openApp("store") },
    { id: "settings", it: "Impostazioni", en: "Settings", run: () => openApp("settings") },
  ];

  const appIsOpen = (id: AppId) => mobileApp === id || wins.some((win) => win.appId === id && !win.min);
  const badgeFor = (id: AppId) => (id === "core" ? pending : id === "mail" ? unread : id === "notes" ? 2 : 0);

  return (
    <div className="lumina-home">
      <div className="lumina-backdrop" aria-hidden />
      <div className="lumina-aurora" aria-hidden />

      <aside className="lumina-sidebar" aria-label={lang === "it" ? "Navigazione principale" : "Main navigation"}>
        <KrelunaBrand />
        <nav className="lumina-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.run}
              className={cn("lumina-nav-item", item.id === "home" && "is-active")}
              aria-current={item.id === "home" ? "page" : undefined}
              aria-label={lang === "it" ? item.it : item.en}
            >
              <NavGlyph id={item.id} />
              <span className="lumina-nav-label">{lang === "it" ? item.it : item.en}</span>
            </button>
          ))}
        </nav>
        <div className="lumina-user">
          <span className="lumina-avatar" aria-hidden>{(operator || "K").slice(0, 1).toUpperCase()}</span>
          <div className="lumina-user-copy">
            <span>{lang === "it" ? "Bentornato," : "Welcome,"}</span>
            <strong>{operator || "Luca"}</strong>
          </div>
        </div>
        <p className="lumina-sync"><i aria-hidden />{lang === "it" ? "Sincronizzato" : "Synced"}</p>
      </aside>

      <header className="lumina-mobile-header">
        <KrelunaBrand compact />
        <button type="button" onClick={() => openApp("settings")} aria-label={lang === "it" ? "Impostazioni" : "Settings"}>
          <Settings className="size-5" strokeWidth={1.6} aria-hidden />
        </button>
      </header>

      <div className="lumina-search-wrap">
        <button type="button" onClick={() => setSpotlight(true)} className="lumina-search" aria-label={lang === "it" ? "Apri la ricerca" : "Open search"}>
          <Sparkles className="lumina-search-spark" strokeWidth={1.45} aria-hidden />
          <span className="lumina-search-field">
            <Search className="size-4" strokeWidth={1.6} aria-hidden />
            <span>{lang === "it" ? "Cerca clienti, file, attività, fatture…" : "Search clients, files, tasks, invoices…"}</span>
            <kbd>⌘ K</kbd>
          </span>
          <span className="lumina-search-action"><Sparkles className="size-4" strokeWidth={1.4} aria-hidden /></span>
        </button>
      </div>

      <main className="lumina-stage" aria-labelledby="lumina-title">
        <h1 id="lumina-title" className="sr-only">Kreluna Lumina</h1>
        <div className="lumina-orbit-map">
          <svg className="lumina-orbit-lines" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden focusable="false">
            <ellipse cx="400" cy="286" rx="296" ry="220" />
            <ellipse cx="400" cy="286" rx="226" ry="168" opacity=".42" />
            <ellipse cx="400" cy="286" rx="346" ry="256" opacity=".18" />
            {ORBIT_LINKS.map((link) => (
              <line
                key={link.id}
                className={cn("lumina-orbit-link", activeLuminaNode === link.id && "is-active")}
                x1="400"
                y1="286"
                x2={link.x}
                y2={link.y}
              />
            ))}
            {[76, 146, 235, 328, 454, 548, 704].map((cx, index) => (
              <g key={cx}>
                <circle cx={cx} cy={286 + Math.sin(index * 1.8) * 160} r="7" className="lumina-orbit-dot-ring" />
                <circle cx={cx} cy={286 + Math.sin(index * 1.8) * 160} r="3" className="lumina-orbit-dot" />
              </g>
            ))}
          </svg>

          <button type="button" onClick={() => openApp("core")} className="lumina-core" aria-label={lang === "it" ? "Apri Kreluna Core" : "Open Kreluna Core"}>
            <span className="lumina-core-rings" aria-hidden />
            <img src="/os/lumina-core.webp" alt="" />
            <span className="lumina-core-label">Kreluna<br />Core</span>
          </button>

          {AREA_NODES.map((area) => {
            const Icon = area.icon;
            const active = activeLuminaNode === area.id;
            return (
              <div key={area.id} className={cn("lumina-node-pos", area.id === "files" && "lumina-node-pos--files")} style={{ left: area.x, top: area.y }}>
                <button
                  type="button"
                  onClick={() => openArea(area.id)}
                  className={cn("lumina-node", active && "is-active")}
                  aria-label={`${lang === "it" ? area.it : area.en}, ${lang === "it" ? area.metaIt : area.metaEn}`}
                  aria-pressed={active}
                >
                  <Icon className="lumina-node-icon" strokeWidth={1.45} aria-hidden />
                  <strong>{lang === "it" ? area.it : area.en}</strong>
                  <span>{lang === "it" ? area.metaIt : area.metaEn}</span>
                  <i aria-hidden><b /><b /><b /></i>
                </button>
              </div>
            );
          })}

          <button type="button" onClick={() => openApp("core")} className="lumina-ask">
            <img src="/os/lumina-core.webp" alt="" />
            <span>{lang === "it" ? "Chiedi a Kreluna…" : "Ask Kreluna…"}</span>
            <i><Mic className="size-5" strokeWidth={1.5} aria-hidden /></i>
          </button>
        </div>
      </main>

      <aside className="lumina-insights" aria-label={lang === "it" ? "Riepilogo" : "Overview"}>
        {showActivity && (
          <section className="lumina-panel">
            <div className="lumina-panel-head">
              <h2><Sparkles className="size-5" strokeWidth={1.45} aria-hidden />{lang === "it" ? "Attività recenti" : "Recent activity"}</h2>
              <button type="button" onClick={() => openApp("files")}>{lang === "it" ? "Vedi tutte" : "See all"}</button>
            </div>
            <div className="lumina-activity-list">
              {ACTIVITY.slice(0, 5).map((item) => (
                <button key={item.id} type="button" onClick={() => item.fileId && openNode(item.fileId)} className="lumina-activity-row">
                  <FileTypeGlyph mime={item.mime} size={30} />
                  <span><strong>{item.title}</strong><small>{item.when}</small></span>
                </button>
              ))}
            </div>
            <div className="lumina-pager" aria-hidden><i /><i /><i /></div>
          </section>
        )}

        {showReminders && (
          <section className="lumina-panel lumina-reminders">
            <div className="lumina-panel-head">
              <h2><Bell className="size-5" strokeWidth={1.45} aria-hidden />{lang === "it" ? "Promemoria" : "Reminders"}</h2>
              <button type="button" onClick={() => openApp("tasks")}><Plus className="size-3.5" aria-hidden />{lang === "it" ? "Nuovo" : "New"}</button>
            </div>
            <div className="lumina-task-list">
              {tasks.slice(0, 5).map((task, index) => (
                <div key={task.id} className="lumina-task-row">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={cn("lumina-check", task.done && "is-done")}
                    aria-label={task.done ? (lang === "it" ? "Segna come da fare" : "Mark incomplete") : (lang === "it" ? "Segna come completato" : "Mark complete")}
                    aria-pressed={task.done}
                  >
                    {task.done ? <Check className="size-3" aria-hidden /> : <Circle className="size-4" aria-hidden />}
                  </button>
                  <button type="button" onClick={() => openApp("tasks")} className="lumina-task-title">{task.title}</button>
                  <span className={cn(index === 0 ? "is-today" : index < 3 ? "is-tomorrow" : "")}>{index === 0 ? (lang === "it" ? "Oggi" : "Today") : index < 3 ? (lang === "it" ? "Domani" : "Tomorrow") : `${12 + index} Mag`}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      <nav className="lumina-dock" aria-label={lang === "it" ? "App principali" : "Main apps"}>
        <div className="lumina-dock-arc" aria-hidden />
        {DOCK_ITEMS.map((item) => {
          const active = appIsOpen(item.id);
          const badge = badgeFor(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openApp(item.id)}
              className={cn("lumina-dock-item", active && "is-open")}
              aria-label={lang === "it" ? item.it : item.en}
              aria-pressed={active}
            >
              <span className="lumina-dock-icon">
                <AppIcon id={item.id} size={62} />
                {badge > 0 && <em>{badge}</em>}
              </span>
              <span>{lang === "it" ? item.it : item.en}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
