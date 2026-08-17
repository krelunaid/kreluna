import { useEffect, useState } from "react";
import { useOs } from "@/lib/os/store";
import { wallById } from "@/lib/os/walls";

export function Screensaver() {
  const lang = useOs((s) => s.lang);
  const wallId = useOs((s) => s.wallId);
  const saverClock = useOs((s) => s.saverClock);
  const wake = useOs((s) => s.wakeSaver);
  const wall = wallById(wallId);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const go = () => wake();
    window.addEventListener("pointerdown", go);
    window.addEventListener("keydown", go);
    return () => {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
    };
  }, [wake]);

  const time = now.toLocaleTimeString(lang === "it" ? "it-IT" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <button
      type="button"
      onClick={wake}
      className="absolute inset-0 z-[90] overflow-hidden bg-ink text-paper"
    >
      <img src={wall.src} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-navy/35" />
      <img
        src="/os/orb.jpg"
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-[62%] rounded-full object-cover opacity-90 shadow-panel luna-breathe"
      />
      {saverClock && (
        <div className="absolute inset-x-0 bottom-[18%] text-center">
          <p className="font-display text-6xl tracking-tight tabular-nums">{time}</p>
          <p className="mt-2 text-sm capitalize text-mist">{date}</p>
        </div>
      )}
    </button>
  );
}
