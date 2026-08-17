import { useState } from "react";
import { CASES } from "@/lib/os/data";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { cn } from "@/lib/utils";

type Tab = "cases" | "approvals";

export function OfficeApp() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const approvals = useOs((s) => s.approvals);
  const resolveApproval = useOs((s) => s.resolveApproval);
  const [tab, setTab] = useState<Tab>("cases");
  const [sel, setSel] = useState(CASES[0]?.id ?? "");
  const current = CASES.find((c) => c.id === sel);

  const status = (s: (typeof CASES)[0]["status"]) =>
    s === "open" ? copy.office.open : s === "review" ? copy.office.review : copy.office.done;

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden w-40 shrink-0 flex-col border-r border-line p-2 sm:flex">
        {(
          [
            ["cases", copy.office.cases],
            ["approvals", copy.office.approvals],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-lg px-3 py-2 text-left text-sm",
              tab === id ? "bg-ink-3 font-medium" : "text-mist hover:text-paper",
            )}
          >
            {label}
          </button>
        ))}
      </aside>
      {tab === "cases" ? (
        <div className="flex min-w-0 flex-1">
          <div className="min-w-0 flex-1 overflow-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-ink-2 text-[11px] tracking-wide text-mist uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">ID</th>
                  <th className="px-4 py-2.5 font-medium">{copy.office.client}</th>
                  <th className="hidden px-4 py-2.5 font-medium md:table-cell">{copy.office.status}</th>
                  <th className="px-4 py-2.5 font-medium">{copy.office.due}</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSel(c.id)}
                    className={cn(
                      "cursor-pointer border-t border-line",
                      sel === c.id ? "bg-ink-3" : "hover:bg-ink-3/50",
                    )}
                  >
                    <td className="px-4 py-2.5 font-mono text-[12px]">{c.code}</td>
                    <td className="px-4 py-2.5">{c.client}</td>
                    <td className="hidden px-4 py-2.5 md:table-cell">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px]",
                          c.status === "review" && "bg-warn/15 text-warn",
                          c.status === "open" && "bg-luna/10 text-luna",
                          c.status === "done" && "bg-ok/15 text-ok",
                        )}
                      >
                        {status(c.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-mist">{c.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {current && (
            <aside className="hidden w-64 shrink-0 border-l border-line p-4 lg:block">
              <p className="font-mono text-[11px] text-mist">{current.code}</p>
              <h3 className="mt-1 text-base font-medium">{current.title}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-mist">{copy.office.client}</dt>
                  <dd>{current.client}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-mist">{copy.office.owner}</dt>
                  <dd>{current.owner}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-mist">{copy.office.due}</dt>
                  <dd className="tabular-nums">{current.deadline}</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-mist">
                {lang === "it"
                  ? "Nessun documento esce da Office senza approvazione umana."
                  : "No document leaves Office without human approval."}
              </p>
            </aside>
          )}
        </div>
      ) : (
        <div className="flex-1 space-y-2 overflow-auto p-4">
          {approvals.map((a) => (
            <div key={a.id} className="rounded-xl bg-ink-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mist">{a.detail}</p>
                </div>
                <span className="rounded-full bg-ink-4 px-2 py-0.5 text-[10px] tracking-wide uppercase">
                  {a.risk}
                </span>
              </div>
              {a.status === "pending" ? (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => resolveApproval(a.id, "approved")}
                    className="rounded-lg bg-luna px-3 py-1.5 text-xs font-medium text-luna-ink"
                  >
                    {copy.approve}
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveApproval(a.id, "denied")}
                    className="rounded-lg bg-ink-4 px-3 py-1.5 text-xs"
                  >
                    {copy.deny}
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-mist">
                  {a.status === "approved" ? copy.approved : copy.denied}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
