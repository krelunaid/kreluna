import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { FINDINGS, TREND } from "@/lib/os/data";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { cn } from "@/lib/utils";

export function CyberApp() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const addApproval = useOs((s) => s.addApproval);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const run = () => {
    if (running) return;
    setRunning(true);
    setDone(false);
    window.setTimeout(() => {
      setRunning(false);
      setDone(true);
      addApproval({
        title: lang === "it" ? "Pubblicare esito assessment" : "Publish assessment outcome",
        detail:
          lang === "it"
            ? "L’assessment è concluso. Pubblicarlo non è una certificazione."
            : "The assessment is complete. Publishing it is not a certification.",
        source: "cyber",
        risk: "low",
      });
    }, 1600);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto">
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        <div className="rounded-xl bg-ink-3 p-4">
          <p className="text-[11px] text-mist">{copy.cyber.score}</p>
          <p className="mt-1 font-display text-4xl tabular-nums">92</p>
        </div>
        <div className="rounded-xl bg-ink-3 p-4">
          <p className="text-[11px] text-mist">{copy.cyber.findings}</p>
          <p className="mt-1 font-display text-4xl tabular-nums">4</p>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-ink-3 p-4">
          <p className="text-[11px] text-mist">{copy.cyber.run}</p>
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="mt-3 h-9 rounded-lg bg-luna text-sm font-medium text-luna-ink disabled:opacity-60"
          >
            {running ? copy.cyber.running : done ? copy.cyber.done : copy.cyber.run}
          </button>
        </div>
      </div>
      <div className="px-4">
        <div className="h-36 rounded-xl bg-ink-3 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND}>
              <defs>
                <linearGradient id="lunaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-luna)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-luna)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="w" tick={{ fill: "var(--color-ash)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-ink-2)",
                  border: "1px solid var(--color-line)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="open" stroke="var(--color-luna)" fill="url(#lunaFill)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-ash">{copy.cyber.note}</p>
      </div>
      <div className="mt-3 min-h-0 flex-1 overflow-auto px-4 pb-4">
        {FINDINGS.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-3 border-t border-line py-3">
            <div>
              <p className="font-mono text-[11px] text-mist">{f.cve}</p>
              <p className="text-sm">{f.title}</p>
              <p className="text-xs text-ash">{f.asset}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase",
                f.severity === "high" || f.severity === "critical"
                  ? "bg-alert/15 text-alert"
                  : f.severity === "medium"
                    ? "bg-warn/15 text-warn"
                    : "bg-ok/15 text-ok",
              )}
            >
              {f.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
