import { EVENTS } from "@/lib/os/data";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { cn } from "@/lib/utils";

export function CalendarApp() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const today = ((new Date().getDay() + 6) % 7) as number;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-baseline justify-between px-5 py-3">
        <h2 className="font-display text-2xl tracking-[-0.03em]">{copy.cal.week}</h2>
        <p className="text-xs text-mist">{copy.cal.today}</p>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-7 border-t border-line">
        {copy.days.map((d, i) => (
          <div key={d} className={cn("min-h-0 border-l border-line first:border-l-0", i === today && "bg-ink-3/50")}>
            <p className={cn("px-2 py-2 text-[11px] tracking-wide uppercase", i === today ? "text-luna" : "text-mist")}>
              {d}
            </p>
            <div className="space-y-1.5 px-1.5 pb-2">
              {EVENTS.filter((e) => e.day === i).map((e) => (
                <div key={e.id} className="rounded-lg bg-ink-4 px-2 py-1.5">
                  <p className="font-mono text-[10px] text-ash">
                    {e.start}–{e.end}
                  </p>
                  <p className="text-[12px] leading-snug">{e.title}</p>
                  <p className="text-[10px] text-mist">{e.place}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
