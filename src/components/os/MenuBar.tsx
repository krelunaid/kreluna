import { useEffect, useState } from "react";
import { Bell, Search, Wifi } from "lucide-react";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { deskContrast } from "@/lib/os/walls";
import { cn } from "@/lib/utils";

function DateLine() {
  const lang = useOs((s) => s.lang);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span className="inline-block w-28" />;
  const day = now.toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return (
    <span className="capitalize" suppressHydrationWarning>
      {day}
    </span>
  );
}

export function MenuBar() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const setSpotlight = useOs((s) => s.setSpotlight);
  const setControl = useOs((s) => s.setControl);
  const setNotif = useOs((s) => s.setNotif);
  const control = useOs((s) => s.control);
  const notifPanel = useOs((s) => s.notifPanel);
  const notifications = useOs((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const ink = deskContrast(useOs((s) => s.wallId), useOs((s) => s.deskInk));

  return (
    <header data-desk={ink} className="relative z-50 flex h-12 items-center justify-between px-6">
      <div className="w-24" />
      <div className="desk-ink flex items-center gap-3 text-sm">
        <DateLine />
        <span className="hidden h-4 w-px bg-current/25 sm:block" />
        <span className="hidden text-sm sm:block">
          24° {lang === "it" ? "Sereno" : "Clear"}
        </span>
      </div>
      <div className="brina flex items-center gap-0.5 rounded-full px-1 py-0.5 text-navy">
        <button
          type="button"
          onClick={() => setSpotlight(true)}
          className="grid size-9 place-items-center rounded-full hover:bg-white/50"
          aria-label={copy.search}
        >
          <Search className="size-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => setNotif(!notifPanel)}
          className={cn("relative grid size-9 place-items-center rounded-full hover:bg-white/50", notifPanel && "bg-white/60")}
        >
          <Bell className="size-4" strokeWidth={1.75} />
          {unread > 0 && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-luna" />}
        </button>
        <button
          type="button"
          onClick={() => setControl(!control)}
          className={cn("grid size-9 place-items-center rounded-full hover:bg-white/50", control && "bg-white/60")}
        >
          <Wifi className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
