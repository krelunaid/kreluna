import { useEffect, useState } from "react";
import { useOs } from "@/lib/os/store";
import { Boot } from "./Boot";
import { Setup } from "./Setup";
import { LockScreen } from "./LockScreen";
import { SleepScreen, ShutdownScreen } from "./Power";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { WindowFrame } from "./Window";
import {
  AboutDialog,
  ControlCenter,
  MobileApp,
  MobileHome,
  NotificationCenter,
  Spotlight,
} from "./Chrome";
import { AppSwitcher, ContextMenu } from "./Desktop";
import { Wallpaper } from "./Wallpaper";
import { Screensaver } from "./Screensaver";
import { OrbitHome } from "./OrbitHome";
import { ponteBoot, ponteCut, ponteSnap, ponteSub } from "@/lib/os/ponte";

export function OsShell() {
  const phase = useOs((s) => s.phase);
  const theme = useOs((s) => s.theme);
  const wins = useOs((s) => s.wins);
  const space = useOs((s) => s.space);
  const mobileApp = useOs((s) => s.mobileApp);
  const closeChrome = useOs((s) => s.closeChrome);
  const setSpotlight = useOs((s) => s.setSpotlight);
  const setSwitcher = useOs((s) => s.setSwitcher);
  const setCtx = useOs((s) => s.setCtx);
  const closeWin = useOs((s) => s.closeWin);
  const focused = useOs((s) => s.focused);
  const cycleWins = useOs((s) => s.cycleWins);
  const setSpace = useOs((s) => s.setSpace);
  const lite = useOs((s) => s.lite);
  const brightness = useOs((s) => s.brightness);
  const saverOn = useOs((s) => s.saverOn);
  const saverMin = useOs((s) => s.saverMin);
  const startSaver = useOs((s) => s.startSaver);
  const bumpIdle = useOs((s) => s.bumpIdle);
  const lockMin = useOs((s) => s.lockMin);
  const lock = useOs((s) => s.lock);
  const operator = useOs((s) => s.operator);
  const [reel, setReel] = useState(false);
  const [ponteTick, setPonteTick] = useState(0);

  useEffect(() => {
    ponteBoot(operator);
    return ponteSub(() => setPonteTick((n) => n + 1));
  }, [operator]);
  void ponteTick;
  const ponte = ponteSnap();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme === "dawn" ? "light" : "dark";
    document.documentElement.toggleAttribute("data-lite", lite);
  }, [theme, lite]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlight(true);
      }
      if (meta && e.key.toLowerCase() === "tab") {
        e.preventDefault();
        if (e.shiftKey) setSwitcher(true);
        else cycleWins();
      }
      if (e.key === "Escape") closeChrome();
      if (meta && e.key.toLowerCase() === "w" && focused) {
        e.preventDefault();
        closeWin(focused);
      }
      if (meta && (e.key === "1" || e.key === "2")) {
        e.preventDefault();
        setSpace(e.key === "1" ? 0 : 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeChrome, setSpotlight, closeWin, focused, cycleWins, setSwitcher, setSpace]);

  useEffect(() => {
    if (phase !== "desktop") return;
    let last = Date.now();
    const bump = () => {
      last = Date.now();
      bumpIdle();
    };
    window.addEventListener("pointerdown", bump);
    window.addEventListener("pointermove", bump);
    window.addEventListener("keydown", bump);
    const id = window.setInterval(() => {
      const wait = Date.now() - last;
      if (lockMin > 0 && wait > lockMin * 60_000) {
        lock();
        return;
      }
      if (saverMin > 0 && wait > saverMin * 60_000) startSaver();
    }, 4000);
    return () => {
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("pointermove", bump);
      window.removeEventListener("keydown", bump);
      window.clearInterval(id);
    };
  }, [phase, saverMin, startSaver, bumpIdle, lockMin, lock]);

  if (phase === "boot") return <Boot />;
  if (phase === "setup") return <Setup />;
  if (phase === "lock") return <LockScreen />;
  if (phase === "sleep") return <SleepScreen />;
  if (phase === "shutdown") return <ShutdownScreen />;

  const visible = wins.filter((w) => w.space === space);

  return (
    <div className="relative h-full min-h-[100vh] min-h-svh overflow-hidden bg-ink text-paper">
      <Wallpaper />
      <div
        className="pointer-events-none absolute inset-0 z-[95] bg-navy"
        style={{ opacity: (100 - brightness) / 160 }}
      />
      {saverOn && <Screensaver />}
      {ponte.session && (
        <div className="absolute inset-x-0 top-8 z-[90] flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full bg-luna px-4 py-2 text-xs font-medium text-luna-ink shadow-panel">
            <span>
              {ponte.session.name} · {ponte.session.peer}
              {ponte.session.auto ? " · auto" : ""}
            </span>
            <button type="button" onClick={() => ponteCut()} className="underline">
              Taglia
            </button>
          </div>
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col">
        <MenuBar />
        <div className="relative min-h-0 flex-1">
          <div
            className="hidden h-full md:block"
            onContextMenu={(e) => {
              e.preventDefault();
              setCtx({ x: e.clientX, y: e.clientY, kind: "desk" });
            }}
          >
            <OrbitHome />
            {visible.map((w) => (
              <WindowFrame key={w.id} win={w} />
            ))}
          </div>
          <div className="flex h-full flex-col md:hidden">
            {mobileApp ? <MobileApp id={mobileApp} /> : <OrbitHome />}
          </div>
          <Spotlight />
          <ControlCenter />
          <NotificationCenter />
          <AboutDialog />
          <AppSwitcher />
          <ContextMenu />
          {reel && (
            <div className="absolute inset-0 z-[80] grid place-items-center bg-navy/70 p-5">
              <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl shadow-win">
                <button
                  type="button"
                  onClick={() => setReel(false)}
                  className="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full bg-ink-2/90 text-paper"
                  aria-label="Chiudi"
                >
                  ×
                </button>
                <video
                  src="/os/kreluna-presentazione.mp4?v=2"
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full bg-navy"
                />
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:block">
          <Dock />
        </div>
        <div className="md:hidden">{!mobileApp && <Dock mobile />}</div>
      </div>
    </div>
  );
}
