import { useEffect, useState } from "react";
import { useOs } from "@/lib/os/store";
import {
  ponteAccept,
  ponteAdd,
  ponteAsk,
  ponteBoot,
  ponteCut,
  ponteDeny,
  ponteForget,
  ponteSnap,
  ponteSub,
  ponteTrust,
} from "@/lib/os/ponte";

export function PonteApp() {
  const lang = useOs((s) => s.lang);
  const operator = useOs((s) => s.operator);
  const it = lang === "it";
  const [, tick] = useState(0);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    ponteBoot(operator);
    return ponteSub(() => tick((n) => n + 1));
  }, [operator]);
  const snap = ponteSnap();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto p-4">
      <p className="text-xs text-mist">
        {it
          ? "Due Perimetri. La prima volta entrambi dicono sì. Poi, se lo segni fidato, si ricollegano da soli. Tu puoi sempre tagliare."
          : "Two Perimeters. The first time both say yes. Then, if marked trusted, they reconnect. You can always cut."}
      </p>
      <div className="mt-4 rounded-xl bg-ink-3 p-4">
        <p className="text-[11px] tracking-wide text-mist uppercase">{it ? "Il tuo codice" : "Your code"}</p>
        <p className="mt-1 font-display text-3xl tracking-[0.12em]">{snap.code}</p>
        <p className="mt-1 text-xs text-mist">{it ? "Dallo all’altro Kreluna. Non è una password." : "Give it to the other Kreluna. It is not a password."}</p>
      </div>

      {snap.session && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-luna px-4 py-3 text-luna-ink">
          <p className="text-sm">
            {snap.session.auto ? (it ? "Rientrato da solo · " : "Came back alone · ") : ""}
            {snap.session.name} ({snap.session.peer})
          </p>
          <button type="button" onClick={() => ponteCut()} className="text-xs font-medium underline">
            {it ? "Taglia" : "Cut"}
          </button>
        </div>
      )}

      {snap.incoming && (
        <div className="mt-3 rounded-xl bg-ink-3 p-4">
          <p className="text-sm">
            {snap.incoming.name} {it ? "chiede di entrare" : "asks to come in"} ({snap.incoming.from})
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => ponteAccept(false)} className="rounded-lg bg-luna px-3 py-1.5 text-xs font-medium text-luna-ink">
              {it ? "Accetta una volta" : "Accept once"}
            </button>
            <button type="button" onClick={() => ponteAccept(true)} className="rounded-lg bg-ink-4 px-3 py-1.5 text-xs">
              {it ? "Accetta e segna fidato" : "Accept and trust"}
            </button>
            <button type="button" onClick={() => ponteDeny()} className="text-xs text-alert">
              {it ? "Rifiuta" : "Deny"}
            </button>
          </div>
        </div>
      )}

      <form
        className="mt-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (ponteAdd(code, name)) {
            setCode("");
            setName("");
          }
        }}
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="KRE-…"
          className="h-10 w-32 rounded-lg bg-ink-3 px-3 text-sm outline-none"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={it ? "Nome" : "Name"}
          className="h-10 min-w-[8rem] flex-1 rounded-lg bg-ink-3 px-3 text-sm outline-none"
        />
        <button type="submit" className="rounded-lg bg-luna px-3 text-xs font-medium text-luna-ink">
          {it ? "Aggiungi" : "Add"}
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {snap.friends.map((f) => (
          <li key={f.code} className="flex flex-wrap items-center gap-2 rounded-xl bg-ink-3 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{f.name}</p>
              <p className="text-xs text-mist">{f.code}</p>
            </div>
            <button type="button" onClick={() => ponteAsk(f.code, "help")} className="text-xs text-luna">
              {it ? "Aiutalo" : "Help"}
            </button>
            <button type="button" onClick={() => ponteTrust(f.code, !f.trusted)} className="text-xs">
              {f.trusted ? (it ? "Fidato" : "Trusted") : it ? "Segna fidato" : "Trust"}
            </button>
            <button type="button" onClick={() => ponteForget(f.code)} className="text-xs text-alert">
              {it ? "Togli" : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
