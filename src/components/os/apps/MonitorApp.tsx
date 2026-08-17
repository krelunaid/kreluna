import { useEffect, useState } from "react";
import { useOs } from "@/lib/os/store";
import { CATALOG } from "@/lib/os/catalog";

export function MonitorApp() {
  const lang = useOs((s) => s.lang);
  const wins = useOs((s) => s.wins);
  const closeWin = useOs((s) => s.closeWin);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1200);
    return () => clearInterval(id);
  }, []);

  const procs = [
    { id: "kern", name: "luna-kernel", cpu: 2.1 + (tick % 3) * 0.3, mem: 84, win: null as string | null },
    { id: "wm", name: "window-server", cpu: 1.4 + (tick % 2) * 0.4, mem: 62, win: null },
    ...wins.map((w) => ({
      id: w.id,
      name: CATALOG[w.appId].title(lang).toLowerCase().replace(/\s+/g, "-"),
      cpu: 3 + ((w.z + tick) % 9),
      mem: 28 + (w.w % 40),
      win: w.id as string | null,
    })),
  ];
  const cpu = Math.min(38, procs.reduce((a, p) => a + p.cpu, 0));
  const mem = Math.min(72, procs.reduce((a, p) => a + p.mem, 0) / 8);

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 gap-3 p-4">
        <Meter label="CPU" value={cpu} />
        <Meter label={lang === "it" ? "Memoria" : "Memory"} value={mem} />
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 pb-4">
        <table className="w-full text-left text-[13px]">
          <thead className="text-[11px] tracking-wide text-mist uppercase">
            <tr>
              <th className="py-2 font-medium">Process</th>
              <th className="py-2 font-medium">CPU</th>
              <th className="py-2 font-medium">MB</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {procs.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="py-2 font-mono text-[12px]">{p.name}</td>
                <td className="py-2 tabular-nums">{p.cpu.toFixed(1)}</td>
                <td className="py-2 tabular-nums">{p.mem}</td>
                <td className="py-2 text-right">
                  {p.win && (
                    <button type="button" onClick={() => closeWin(p.win!)} className="text-[11px] text-alert">
                      kill
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-ink-3 p-3">
      <div className="flex justify-between text-[11px] text-mist">
        <span>{label}</span>
        <span className="tabular-nums">{value.toFixed(0)}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-4">
        <div className="h-full bg-luna" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
