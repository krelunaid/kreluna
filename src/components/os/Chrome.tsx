import { useMemo, useState } from "react";
import { CATALOG, HOME_APPS } from "@/lib/os/catalog";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import type { AppId } from "@/lib/os/types";
import { AppIcon } from "./AppIcon";
import { LunaMark } from "./Mark";
import { AppBody } from "./apps/registry";
import { cn } from "@/lib/utils";

export function Spotlight() {
  const open = useOs((s) => s.spotlight);
  const setSpotlight = useOs((s) => s.setSpotlight);
  const openApp = useOs((s) => s.openApp);
  const openNode = useOs((s) => s.openNode);
  const lang = useOs((s) => s.lang);
  const installed = useOs((s) => s.installed);
  const fs = useOs((s) => s.fs);
  const copy = t(lang);
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const apps = HOME_APPS.filter((id) => {
      if (!installed.includes(id)) return false;
      const meta = CATALOG[id];
      return (
        !query ||
        meta.title(lang).toLowerCase().includes(query) ||
        meta.hint(lang).toLowerCase().includes(query) ||
        id.includes(query)
      );
    });
    const files = fs
      .filter((f) => f.kind === "file" && !f.trashed && (!query || f.name.toLowerCase().includes(query)))
      .slice(0, 6);
    return { apps, files };
  }, [q, lang, fs, installed]);

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-60 flex items-start justify-center pt-[18vh]" onClick={() => setSpotlight(false)}>
      <div
        className="w-[min(560px,92vw)] overflow-hidden rounded-2xl bg-ink-2/95 shadow-panel backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={copy.spotlightPh}
          className="w-full bg-transparent px-5 py-4 text-[17px] text-paper outline-none placeholder:text-ash"
        />
        <div className="max-h-80 overflow-auto border-t border-line px-2 py-2">
          {results.apps.length === 0 && results.files.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-mist">{copy.noResults}</p>
          )}
          {results.apps.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                openApp(id);
                setSpotlight(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-paper/6"
            >
              <AppIcon id={id} size={32} />
              <span>
                <span className="block text-sm font-medium">{CATALOG[id].title(lang)}</span>
                <span className="block text-xs text-mist">{CATALOG[id].hint(lang)}</span>
              </span>
            </button>
          ))}
          {results.files.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                openNode(f.id);
                setSpotlight(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-paper/6"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-ink-4 text-[11px] text-mist">
                {f.mime}
              </span>
              <span className="text-sm">{f.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ControlCenter() {
  const open = useOs((s) => s.control);
  const lang = useOs((s) => s.lang);
  const theme = useOs((s) => s.theme);
  const focusMode = useOs((s) => s.focusMode);
  const volume = useOs((s) => s.volume);
  const brightness = useOs((s) => s.brightness);
  const space = useOs((s) => s.space);
  const setLang = useOs((s) => s.setLang);
  const setTheme = useOs((s) => s.setTheme);
  const toggleFocus = useOs((s) => s.toggleFocus);
  const setVolume = useOs((s) => s.setVolume);
  const setBrightness = useOs((s) => s.setBrightness);
  const setSpace = useOs((s) => s.setSpace);
  const copy = t(lang);
  if (!open) return null;
  return (
    <aside className="absolute top-11 right-3 z-60 w-[300px] space-y-2 rounded-2xl bg-ink-2/95 p-2 shadow-panel backdrop-blur-2xl">
      <div className="grid grid-cols-2 gap-2">
        <Tile title={copy.net} value={copy.netSecure} />
        <Tile title={copy.posture} value={copy.postureOk} />
      </div>
      <button
        type="button"
        onClick={toggleFocus}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left",
          focusMode ? "bg-luna text-luna-ink" : "bg-ink-3",
        )}
      >
        <span className="text-sm font-medium">{copy.focus}</span>
        <span className="text-xs">{focusMode ? copy.focusOn : copy.focusOff}</span>
      </button>
      <label className="block rounded-xl bg-ink-3 px-3 py-3">
        <span className="text-[11px] text-mist">{copy.volume}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="mt-2 w-full accent-luna"
        />
      </label>
      <label className="block rounded-xl bg-ink-3 px-3 py-3">
        <span className="text-[11px] text-mist">{lang === "it" ? "Luminosità" : "Brightness"}</span>
        <input
          type="range"
          min={20}
          max={100}
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="mt-2 w-full accent-luna"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSpace(0)}
          className={cn("rounded-xl px-3 py-3 text-left text-sm", space === 0 ? "bg-luna text-luna-ink" : "bg-ink-3")}
        >
          {lang === "it" ? "Spazio 1" : "Space 1"}
        </button>
        <button
          type="button"
          onClick={() => setSpace(1)}
          className={cn("rounded-xl px-3 py-3 text-left text-sm", space === 1 ? "bg-luna text-luna-ink" : "bg-ink-3")}
        >
          {lang === "it" ? "Spazio 2" : "Space 2"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === "night" ? "dawn" : "night")}
          className="rounded-xl bg-ink-3 px-3 py-3 text-left"
        >
          <span className="block text-[11px] text-mist">{copy.settings.appearance}</span>
          <span className="text-sm font-medium">{theme === "night" ? copy.themeNight : copy.themeDawn}</span>
        </button>
        <button
          type="button"
          onClick={() => setLang(lang === "it" ? "en" : "it")}
          className="rounded-xl bg-ink-3 px-3 py-3 text-left"
        >
          <span className="block text-[11px] text-mist">{copy.settings.language}</span>
          <span className="text-sm font-medium">{lang === "it" ? copy.langIt : copy.langEn}</span>
        </button>
      </div>
    </aside>
  );
}

function Tile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-3 px-3 py-3">
      <p className="text-[11px] text-mist">{title}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

export function NotificationCenter() {
  const open = useOs((s) => s.notifPanel);
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const notifications = useOs((s) => s.notifications);
  const approvals = useOs((s) => s.approvals);
  const markNotifsRead = useOs((s) => s.markNotifsRead);
  const resolveApproval = useOs((s) => s.resolveApproval);
  const pending = approvals.filter((a) => a.status === "pending");
  if (!open) return null;
  return (
    <aside className="absolute top-11 right-3 z-60 flex w-[min(360px,92vw)] flex-col gap-3">
      {pending.length > 0 && (
        <div className="rounded-2xl bg-ink-2/95 p-3 shadow-panel backdrop-blur-2xl">
          <p className="mb-2 px-1 text-[11px] font-medium tracking-wide text-mist uppercase">{copy.pending}</p>
          <div className="space-y-2">
            {pending.map((a) => (
              <div key={a.id} className="rounded-xl bg-ink-3 p-3">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{a.detail}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => resolveApproval(a.id, "approved")}
                    className="rounded-lg bg-luna px-3 py-1.5 text-xs font-medium text-luna-ink"
                  >
                    {copy.approve}
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveApproval(a.id, "denied")}
                    className="rounded-lg bg-ink-4 px-3 py-1.5 text-xs font-medium"
                  >
                    {copy.deny}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-2xl bg-ink-2/95 p-3 shadow-panel backdrop-blur-2xl">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-medium tracking-wide text-mist uppercase">{copy.notif}</p>
          <button type="button" onClick={markNotifsRead} className="text-[11px] text-luna">
            {copy.markRead}
          </button>
        </div>
        {notifications.length === 0 && <p className="px-1 py-4 text-sm text-mist">{copy.emptyNotif}</p>}
        <div className="space-y-1">
          {notifications.map((n) => (
            <div key={n.id} className={cn("flex gap-3 rounded-xl px-2 py-2", !n.read && "bg-ink-3")}>
              <AppIcon id={n.appId} size={28} />
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <span className="shrink-0 font-mono text-[10px] text-ash">{n.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-mist">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function AboutDialog() {
  const open = useOs((s) => s.aboutOpen);
  const setAbout = useOs((s) => s.setAbout);
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-70 grid place-items-center bg-ink/50" onClick={() => setAbout(false)}>
      <div
        className="w-[min(420px,92vw)] rounded-2xl bg-ink-2 p-8 text-center shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <LunaMark className="mx-auto size-12" />
        <h2 className="mt-4 font-display text-3xl tracking-[-0.03em]">{copy.aboutTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-mist">{copy.aboutBody}</p>
        <p className="mt-4 font-mono text-[11px] text-ash">Luna 1.0 · 16 agosto 2026</p>
        <button
          type="button"
          onClick={() => setAbout(false)}
          className="mt-6 rounded-xl bg-luna px-5 py-2 text-sm font-medium text-luna-ink"
        >
          {copy.aboutClose}
        </button>
      </div>
    </div>
  );
}

export function Widgets() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const approvals = useOs((s) => s.approvals);
  const pending = approvals.filter((a) => a.status === "pending").length;
  return (
    <div className="pointer-events-none hidden w-[280px] flex-col gap-3 p-6 md:flex">
      <div className="rounded-2xl bg-ink/45 p-5 shadow-panel backdrop-blur-md">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.widgets.today}</p>
        <p className="mt-2 font-display text-4xl tracking-[-0.03em]">16</p>
        <p className="text-sm capitalize text-luna">{copy.months[7]}</p>
      </div>
      <div className="rounded-2xl bg-ink/45 p-5 shadow-panel backdrop-blur-md">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.widgets.security}</p>
        <p className="mt-2 text-2xl font-medium tabular-nums">92</p>
        <p className="text-xs text-mist">{copy.postureOk}</p>
      </div>
      <div className="rounded-2xl bg-ink/45 p-5 shadow-panel backdrop-blur-md">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.widgets.cases}</p>
        <p className="mt-2 text-2xl font-medium tabular-nums">{pending}</p>
        <p className="text-xs text-mist">{copy.pending}</p>
      </div>
    </div>
  );
}

export function MobileHome() {
  const lang = useOs((s) => s.lang);
  const openApp = useOs((s) => s.openApp);
  const installed = useOs((s) => s.installed);
  const apps = HOME_APPS.filter((id) => installed.includes(id));
  return (
    <div className="grid flex-1 grid-cols-4 content-start gap-x-3 gap-y-6 overflow-auto px-6 pt-8">
      {apps.map((id) => (
        <button key={id} type="button" onClick={() => openApp(id)} className="flex flex-col items-center gap-2">
          <AppIcon id={id} size={58} />
          <span className="text-[11px] text-paper/90">{CATALOG[id].title(lang)}</span>
        </button>
      ))}
    </div>
  );
}

export function MobileApp({ id }: { id: AppId }) {
  const closeMobile = useOs((s) => s.closeMobile);
  const lang = useOs((s) => s.lang);
  return (
    <div className="flex h-full flex-col bg-ink-2">
      <div className="flex items-center gap-2 px-3 pt-2 pb-1">
        <button type="button" onClick={closeMobile} className="px-1 py-2 text-sm text-luna">
          Home
        </button>
        <span className="flex-1 text-center text-sm font-medium">{CATALOG[id].title(lang)}</span>
        <span className="w-12" />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <AppBody id={id} />
      </div>
    </div>
  );
}
