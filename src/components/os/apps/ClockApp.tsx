import { useEffect, useState } from "react";
import { useOs } from "@/lib/os/store";

const ZONES = [
  { id: "Rome", tz: "Europe/Rome" },
  { id: "London", tz: "Europe/London" },
  { id: "New York", tz: "America/New_York" },
  { id: "Tokyo", tz: "Asia/Tokyo" },
];

export function ClockApp() {
  const lang = useOs((s) => s.lang);
  const [now, setNow] = useState(() => new Date());
  const [sec, setSec] = useState(0);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [run]);

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  return (
    <div className="flex h-full flex-col items-center overflow-auto px-5 py-6">
      <div className="relative size-40">
        <div className="absolute inset-0 rounded-full border border-line" />
        <Hand deg={h * 30 + m * 0.5} len={28} w={2.4} />
        <Hand deg={m * 6} len={42} w={1.6} />
        <Hand deg={s * 6} len={48} w={0.8} />
        <span className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-luna" />
      </div>
      <p className="mt-5 font-display text-4xl tabular-nums tracking-[-0.03em]">
        {now.toLocaleTimeString(lang === "it" ? "it-IT" : "en-GB")}
      </p>
      <div className="mt-6 grid w-full grid-cols-2 gap-2">
        {ZONES.map((z) => (
          <div key={z.id} className="rounded-xl bg-ink-3 px-3 py-2">
            <p className="text-[11px] text-mist">{z.id}</p>
            <p className="font-mono text-sm tabular-nums">
              {now.toLocaleTimeString(lang === "it" ? "it-IT" : "en-GB", {
                timeZone: z.tz,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 w-full rounded-xl bg-ink-3 p-4 text-center">
        <p className="text-[11px] text-mist">Timer</p>
        <p className="mt-1 font-mono text-3xl tabular-nums">
          {String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")}
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <button type="button" onClick={() => setRun((r) => !r)} className="rounded-lg bg-luna px-3 py-1.5 text-xs font-medium text-luna-ink">
            {run ? "Pause" : "Start"}
          </button>
          <button type="button" onClick={() => { setRun(false); setSec(0); }} className="rounded-lg bg-ink-4 px-3 py-1.5 text-xs">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function Hand({ deg, len, w }: { deg: number; len: number; w: number }) {
  return (
    <span
      className="absolute top-1/2 left-1/2 origin-bottom rounded-full bg-paper"
      style={{
        width: w,
        height: len,
        transform: `translate(-50%, -100%) rotate(${deg}deg)`,
      }}
    />
  );
}
