import { useEffect, useState } from "react";
import { useOs } from "@/lib/os/store";
import { OrbitMark } from "../Mark";

const KEY = "kreluna-nav-q";

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === "string").slice(0, 10) : [];
  } catch {
    return [];
  }
}

function googleSearch(q: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

export function BrowserApp() {
  const lang = useOs((s) => s.lang);
  const [draft, setDraft] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const remember = (q: string) => {
    const t = q.trim();
    if (!t) return;
    const next = [t, ...recent.filter((x) => x !== t)].slice(0, 10);
    setRecent(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex h-full flex-col bg-ink-2 text-paper">
      <div className="border-b border-line px-6 py-5">
        <div className="flex items-center gap-2">
          <OrbitMark size={22} />
          <p className="font-display text-xl tracking-tight">
            {lang === "it" ? "Navigazione" : "Navigation"}
          </p>
        </div>
        <p className="mt-1 text-xs text-mist">
          {lang === "it"
            ? "Il collegamento è diretto: Cerca manda la frase a Google, sul loro sito."
            : "The link is direct: Search sends the phrase to Google, on their site."}
        </p>
      </div>

      <form
        className="flex items-center gap-2 px-6 py-4"
        action="https://www.google.com/search"
        method="get"
        target="_blank"
        rel="noopener noreferrer"
        onSubmit={() => remember(draft)}
      >
        <input
          name="q"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={lang === "it" ? "Cerca su Google…" : "Search Google…"}
          className="h-11 flex-1 rounded-full bg-ink-3 px-5 text-sm outline-none placeholder:text-ash"
        />
        <button
          type="submit"
          className="h-11 rounded-full bg-luna px-5 text-sm font-medium text-luna-ink"
        >
          {lang === "it" ? "Cerca" : "Search"}
        </button>
      </form>

      <div className="px-6 pb-3">
        <a
          href="https://www.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full bg-ink-3 px-4 py-2 text-xs text-mist hover:text-paper"
        >
          {lang === "it" ? "Apri Google" : "Open Google"}
        </a>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
        <p className="mb-2 text-[11px] tracking-wide text-mist uppercase">
          {lang === "it" ? "Ultime 10" : "Last 10"}
        </p>
        {recent.length === 0 ? (
          <p className="text-sm text-mist">
            {lang === "it" ? "Ancora niente. Scrivi e premi Cerca." : "Nothing yet. Type and press Search."}
          </p>
        ) : (
          <ul className="space-y-1">
            {recent.map((q, i) => (
              <li key={`${q}-${i}`}>
                <a
                  href={googleSearch(q)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => remember(q)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-ink-3"
                >
                  <span className="w-6 text-sm font-medium text-luna">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{q}</span>
                  <span className="text-xs text-luna">{lang === "it" ? "Apri" : "Open"}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
