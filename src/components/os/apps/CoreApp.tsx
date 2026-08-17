import { useRef, useState } from "react";
import { askCore } from "@/lib/os/ai";
import { reasonLocally } from "@/lib/os/reason";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "core";
  text: string;
}

export function CoreApp() {
  const lang = useOs((s) => s.lang);
  const approvals = useOs((s) => s.approvals);
  const copy = t(lang);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: prompt }]);
    setBusy(true);
    const pending = approvals
      .filter((a) => a.status === "pending")
      .map((a) => `- ${a.title} (${a.risk})`)
      .join("\n");
    const live = useOs.getState();
    const files = live.fs.filter((n) => n.kind === "file" && !n.trashed).slice(0, 20);
    const context = [
      `Kreluna Perimetro`,
      `Operator: ${live.operator || "ospite"}`,
      `Orbit: ${live.orbit}`,
      pending ? `Pending approvals:\n${pending}` : "No pending approvals.",
      `Files:\n${files.map((n) => `- ${n.name} (${n.mime ?? n.kind})`).join("\n")}`,
    ].join("\n\n");
    const local = reasonLocally({
      prompt,
      lang,
      operator: live.operator,
      orbit: live.orbit,
      approvals: live.approvals,
      fs: live.fs,
      notes: live.notes,
      mails: live.mails,
      tasks: live.tasks,
    });
    const res = live.coreNet
      ? await askCore({
          data: {
            prompt,
            lang,
            context,
          },
        }).catch(() => ({ ok: false as const, error: "offline" }))
      : { ok: false as const, error: "local" };
    const textOut = res.ok && res.text.trim() ? res.text : local;
    setMsgs((m) => [...m, { role: "core", text: textOut }]);
    setBusy(false);
    queueMicrotask(() => end.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-5 py-4">
        <p className="font-display text-2xl tracking-[-0.03em]">{copy.core.title}</p>
        <p className="mt-1 text-xs text-mist">{copy.core.sub}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-auto px-5 py-5">
        {msgs.length === 0 && (
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-mist">{copy.core.empty}</p>
            <div className="mt-5 flex flex-col gap-2">
              {[copy.core.suggest1, copy.core.suggest2, copy.core.suggest3].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-xl bg-ink-3 px-3 py-2.5 text-left text-sm hover:bg-ink-4"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user" ? "bg-luna text-luna-ink rounded-br-md" : "bg-ink-3 rounded-bl-md",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {busy && <p className="text-xs text-ash">{copy.core.thinking}</p>}
        <div ref={end} />
      </div>
      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={copy.core.ph}
          className="h-11 flex-1 rounded-xl bg-ink-3 px-3 text-sm outline-none placeholder:text-ash"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 rounded-xl bg-luna px-4 text-sm font-medium text-luna-ink disabled:opacity-50"
        >
          {copy.core.send}
        </button>
      </form>
    </div>
  );
}
