import { useState } from "react";

const KEYS = ["C", "⌫", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];

export function CalcApp() {
  const [expr, setExpr] = useState("0");
  const [out, setOut] = useState("0");

  const press = (k: string) => {
    if (k === "C") {
      setExpr("0");
      setOut("0");
      return;
    }
    if (k === "⌫") {
      const next = expr.length <= 1 ? "0" : expr.slice(0, -1);
      setExpr(next);
      return;
    }
    if (k === "=") {
      try {
        const safe = expr.replace(/[^0-9+\-*/%.() ]/g, "");
        const val = Function(`"use strict"; return (${safe})`)() as number;
        if (!Number.isFinite(val)) throw new Error("nan");
        const s = String(Math.round(val * 1e10) / 1e10);
        setOut(s);
        setExpr(s);
      } catch {
        setOut("—");
      }
      return;
    }
    setExpr((e) => (e === "0" && /[0-9.]/.test(k) ? k : e + k));
  };

  return (
    <div className="flex h-full flex-col bg-ink p-3">
      <div className="rounded-xl bg-ink-3 px-4 py-5 text-right">
        <p className="truncate font-mono text-xs text-ash">{expr}</p>
        <p className="mt-1 font-display text-4xl tabular-nums tracking-[-0.03em]">{out}</p>
      </div>
      <div className="mt-3 grid flex-1 grid-cols-4 gap-1.5">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            className={`rounded-xl text-lg font-medium ${k === "=" ? "bg-luna text-luna-ink" : "bg-ink-3"}`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
