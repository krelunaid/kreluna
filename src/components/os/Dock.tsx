import { useState } from "react";
import { CATALOG, DOCK_APPS } from "@/lib/os/catalog";
import { useOs } from "@/lib/os/store";
import { AppIcon } from "./AppIcon";
import { OrbitMark } from "./Mark";
import { cn } from "@/lib/utils";

export function Dock({ mobile = false }: { mobile?: boolean }) {
  const lang = useOs((s) => s.lang);
  const openApp = useOs((s) => s.openApp);
  const wins = useOs((s) => s.wins);
  const focusWin = useOs((s) => s.focusWin);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <nav
      className={cn(
        "pointer-events-auto z-40 flex justify-center",
        mobile ? "px-3 pb-[max(10px,env(safe-area-inset-bottom))]" : "pb-3",
      )}
      aria-label="Dock"
    >
      <div
        className={cn(
          "flex items-end gap-4 rounded-full bg-white/75 px-5 py-2.5 shadow-[0_10px_30px_rgb(80_120_190/0.12)] ring-1 ring-white/80 backdrop-blur-xl",
          mobile && "w-full justify-around rounded-3xl px-3 py-2.5 gap-2",
        )}
      >
        <button
          type="button"
          onClick={() => {
            openApp("browser");
            window.open("https://www.google.com/", "_blank", "noopener,noreferrer");
          }}
          className="relative flex flex-col items-center"
          aria-label={lang === "it" ? "Navigazione" : "Navigation"}
        >
          {!mobile && hover === "orbit" && (
            <span className="absolute -top-7 rounded-md bg-ink-2 px-2 py-0.5 text-[11px] text-navy shadow-panel">
              Orbit
            </span>
          )}
          <span
            onMouseEnter={() => setHover("orbit")}
            onMouseLeave={() => setHover(null)}
            className="grid size-12 place-items-center rounded-full bg-white/90 ring-1 ring-[#3d6dff]/30"
          >
            <OrbitMark size={36} />
          </span>
        </button>
        {DOCK_APPS.map((id) => {
          const open = wins.some((w) => w.appId === id && !w.min);
          return (
            <button
              key={id}
              type="button"
              onMouseEnter={() => setHover(id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                const existing = wins.find((w) => w.appId === id);
                if (existing) focusWin(existing.id);
                else openApp(id);
              }}
              className="relative flex flex-col items-center"
              aria-label={CATALOG[id].title(lang)}
            >
              {!mobile && hover === id && (
                <span className="absolute -top-7 rounded-md bg-ink-2 px-2 py-0.5 text-[11px] text-navy shadow-panel">
                  {CATALOG[id].title(lang)}
                </span>
              )}
              <AppIcon id={id} size={mobile ? 40 : 48} />
              {open && <span className="mt-1 size-1 rounded-full bg-luna" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
