import { useMemo, useState } from "react";
import { useOs } from "@/lib/os/store";
import {
  kindLabel,
  parseLuna,
  permLabel,
  serializeLuna,
  type LunaKind,
  type LunaParse,
} from "@/lib/os/luna";
import { cn } from "@/lib/utils";

type Tab = "formato" | "pacchetti" | "ispeziona" | "nuovo";

export function LunaApp() {
  const lang = useOs((s) => s.lang);
  const fs = useOs((s) => s.fs);
  const lunaFileId = useOs((s) => s.lunaFileId);
  const setLunaFile = useOs((s) => s.setLunaFile);
  const createLuna = useOs((s) => s.createLuna);
  const openApp = useOs((s) => s.openApp);
  const installApp = useOs((s) => s.installApp);
  const addApproval = useOs((s) => s.addApproval);
  const [tab, setTab] = useState<Tab>(lunaFileId ? "ispeziona" : "formato");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<LunaKind>("flow");
  const [summary, setSummary] = useState("");

  const files = fs.filter((n) => n.mime === "luna" && !n.trashed);
  const selected = files.find((n) => n.id === lunaFileId) ?? files[0];
  const parsed: LunaParse | null = selected ? parseLuna(selected.content ?? "") : null;

  const spec = useMemo(
    () => [
      {
        k: "LUNA/1",
        it: "Prima riga del file. Senza questa firma non è un pacchetto nativo.",
        en: "First line of the file. Without this mark it is not a native package.",
      },
      {
        k: "manifest",
        it: "JSON: id, nome, versione, tipo, runtime luna-1, permessi, humanGate.",
        en: "JSON: id, name, version, kind, luna-1 runtime, permissions, humanGate.",
      },
      {
        k: "humanGate",
        it: "Obbligatorio true. Un .luna non può decidere da solo.",
        en: "Must be true. A .luna package cannot decide on its own.",
      },
      {
        k: "luna-fp1",
        it: "Sigillo: impronta del manifesto. Se cambi una riga, il sigillo cade.",
        en: "Seal: fingerprint of the manifest. Change a line and the seal fails.",
      },
      {
        k: "non-PE",
        it: "Non è un .exe. Il runtime Luna legge il manifesto, non esegue binari estranei.",
        en: "Not an .exe. The Luna runtime reads the manifest; it does not run foreign binaries.",
      },
    ],
    [],
  );

  return (
    <div className="flex h-full flex-col bg-ink-2">
      <div className="flex flex-wrap gap-1 border-b border-line px-3 py-2">
        {(
          [
            ["formato", lang === "it" ? "Formato" : "Format"],
            ["pacchetti", lang === "it" ? "Pacchetti" : "Packages"],
            ["ispeziona", lang === "it" ? "Ispeziona" : "Inspect"],
            ["nuovo", lang === "it" ? "Nuovo" : "New"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm",
              tab === id ? "bg-luna text-luna-ink" : "text-mist hover:bg-ink-3",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "formato" && (
        <div className="min-h-0 flex-1 overflow-auto p-5">
          <p className="text-xs font-medium tracking-wide text-luna uppercase">LUNA/1</p>
          <h2 className="mt-1 font-display text-3xl tracking-[-0.03em]">
            {lang === "it" ? "Il formato nativo di Kreluna" : "Kreluna’s native format"}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            {lang === "it"
              ? "Un file .luna è un pacchetto di testo firmato. Dichiara chi è, cosa può toccare, e che ogni azione rilevante passa da te. Non è un .exe e non lo diventa rinominandolo."
              : "A .luna file is a signed text package. It declares who it is, what it may touch, and that every relevant action goes through you. It is not an .exe, and renaming it will not make it one."}
          </p>
          <ol className="mt-6 space-y-3">
            {spec.map((row) => (
              <li key={row.k} className="rounded-xl bg-ink-3 px-4 py-3">
                <p className="font-mono text-xs text-luna">{row.k}</p>
                <p className="mt-1 text-sm">{lang === "it" ? row.it : row.en}</p>
              </li>
            ))}
          </ol>
          <pre className="mt-6 overflow-auto rounded-xl bg-ink-3 p-4 font-mono text-[11px] leading-relaxed text-mist">
            {`LUNA/1
# Native Kreluna package. Not PE, not ELF, not Mach-O.

{
  "format": "luna-1",
  "id": "kreluna.core",
  "runtime": "luna-1",
  "humanGate": true,
  "permissions": [{ "id": "act.send", "grant": "ask" }],
  "seal": { "algo": "luna-fp1", "policy": "human-install" }
}`}
          </pre>
        </div>
      )}

      {tab === "pacchetti" && (
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {files.map((f) => {
              const p = parseLuna(f.content ?? "");
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setLunaFile(f.id);
                    setTab("ispeziona");
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left",
                    selected?.id === f.id ? "bg-ink-4" : "bg-ink-3 hover:bg-ink-4",
                  )}
                >
                  <span className="mt-0.5 grid size-10 place-items-center rounded-xl bg-luna text-[10px] font-bold text-luna-ink">
                    LUNA
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {p.ok ? p.pkg.name[lang] : f.name}
                    </span>
                    <span className="block text-xs text-mist">
                      {p.ok
                        ? `${p.pkg.id} · ${p.pkg.version} · ${kindLabel(p.pkg.kind, lang)}`
                        : p.issues[0]?.message}
                    </span>
                  </span>
                  <span className={cn("text-[11px]", p.ok ? "text-ok" : "text-alert")}>
                    {p.ok ? (lang === "it" ? "valido" : "valid") : lang === "it" ? "respinto" : "rejected"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "ispeziona" && parsed && selected && (
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {!parsed.ok ? (
            <div className="rounded-xl bg-alert/10 p-4 text-sm text-alert">
              <p className="font-medium">{lang === "it" ? "Pacchetto non valido" : "Invalid package"}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {parsed.issues.map((i) => (
                  <li key={i.code + i.message}>{i.message}</li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="font-mono text-xs text-mist">{parsed.pkg.id}</p>
              <h2 className="mt-1 font-display text-3xl">{parsed.pkg.name[lang]}</h2>
              <p className="mt-2 text-sm text-mist">{parsed.pkg.summary[lang]}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Row k={lang === "it" ? "Versione" : "Version"} v={parsed.pkg.version} />
                <Row k={lang === "it" ? "Tipo" : "Kind"} v={kindLabel(parsed.pkg.kind, lang)} />
                <Row k="Runtime" v={parsed.pkg.runtime} />
                <Row k={lang === "it" ? "Autore" : "Author"} v={parsed.pkg.author} />
                <Row k={lang === "it" ? "Orbita" : "Orbit"} v={parsed.pkg.orbit ?? "—"} />
                <Row k={lang === "it" ? "Ingresso" : "Entry"} v={parsed.pkg.entry ?? "—"} />
              </dl>
              <p className="mt-6 text-xs font-medium tracking-wide text-mist uppercase">
                {lang === "it" ? "Permessi" : "Permissions"}
              </p>
              <ul className="mt-2 space-y-2">
                {parsed.pkg.permissions.map((perm) => (
                  <li key={perm.id + perm.scope} className="rounded-xl bg-ink-3 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{permLabel(perm.id, lang)}</span>
                      <Grant grant={perm.grant} lang={lang} />
                    </div>
                    <p className="mt-1 text-xs text-mist">
                      {perm.scope} · {perm.why}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-medium tracking-wide text-mist uppercase">
                {lang === "it" ? "Sigillo" : "Seal"}
              </p>
              <p className="mt-2 font-mono text-[11px] break-all text-mist">
                {parsed.pkg.seal.fingerprint}
                <span className="mt-1 block">
                  {parsed.pkg.seal.signedBy} · {parsed.pkg.seal.policy}
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {parsed.pkg.appId && (
                  <button
                    type="button"
                    onClick={() => {
                      installApp(parsed.pkg.appId!);
                      openApp(parsed.pkg.appId!);
                    }}
                    className="rounded-xl bg-luna px-4 py-2 text-sm font-medium text-luna-ink"
                  >
                    {lang === "it" ? "Apri nel runtime" : "Open in runtime"}
                  </button>
                )}
                {parsed.pkg.kind === "flow" && (
                  <button
                    type="button"
                    onClick={() =>
                      addApproval({
                        title: parsed.pkg.name.it,
                        detail:
                          lang === "it"
                            ? "Il flusso è pronto. Nessuna azione parte senza di te."
                            : "The flow is ready. No action starts without you.",
                        source: "luna",
                        risk: "low",
                      })
                    }
                    className="rounded-xl bg-luna px-4 py-2 text-sm font-medium text-luna-ink"
                  >
                    {lang === "it" ? "Metti in coda" : "Queue flow"}
                  </button>
                )}
              </div>
              <pre className="mt-6 overflow-auto rounded-xl bg-ink-3 p-4 font-mono text-[11px] leading-relaxed text-mist">
                {serializeLuna(parsed.pkg)}
              </pre>
            </>
          )}
        </div>
      )}

      {tab === "nuovo" && (
        <form
          className="min-h-0 flex-1 overflow-auto p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            createLuna(name.trim(), kind === "app" || kind === "flow" ? kind : "library", summary.trim() || name.trim());
            setTab("ispeziona");
            setName("");
            setSummary("");
          }}
        >
          <h2 className="font-display text-2xl">
            {lang === "it" ? "Crea un pacchetto .luna" : "Create a .luna package"}
          </h2>
          <p className="mt-2 text-sm text-mist">
            {lang === "it"
              ? "Il sistema scrive LUNA/1, i permessi di default (niente invio, niente rete) e il sigillo. Poi lo trovi in Sistema → Pacchetti."
              : "The system writes LUNA/1, default permissions (no send, no network) and the seal. Then it lives in System → Packages."}
          </p>
          <label className="mt-5 block text-xs text-mist">{lang === "it" ? "Nome" : "Name"}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-10 w-full rounded-xl bg-ink-3 px-3 text-sm outline-none"
            placeholder={lang === "it" ? "Es. Revisione contratti" : "e.g. Contract review"}
          />
          <label className="mt-4 block text-xs text-mist">{lang === "it" ? "Tipo" : "Kind"}</label>
          <div className="mt-1 flex gap-2">
            {(["app", "flow", "library"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm",
                  kind === k ? "bg-luna text-luna-ink" : "bg-ink-3",
                )}
              >
                {kindLabel(k, lang)}
              </button>
            ))}
          </div>
          <label className="mt-4 block text-xs text-mist">{lang === "it" ? "Cosa fa" : "What it does"}</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-none rounded-xl bg-ink-3 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="mt-5 rounded-xl bg-luna px-4 py-2.5 text-sm font-medium text-luna-ink"
          >
            {lang === "it" ? "Sigilla e salva" : "Seal and save"}
          </button>
        </form>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-ink-3 px-3 py-2">
      <dt className="text-[11px] text-mist">{k}</dt>
      <dd className="mt-0.5 truncate font-medium">{v}</dd>
    </div>
  );
}

function Grant({ grant, lang }: { grant: "allow" | "deny" | "ask"; lang: "it" | "en" }) {
  const label =
    grant === "allow"
      ? lang === "it"
        ? "consentito"
        : "allow"
      : grant === "deny"
        ? lang === "it"
          ? "negato"
          : "deny"
        : lang === "it"
          ? "chiedi"
          : "ask";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium",
        grant === "allow" && "bg-ok/15 text-ok",
        grant === "deny" && "bg-alert/10 text-alert",
        grant === "ask" && "bg-warn/15 text-warn",
      )}
    >
      {label}
    </span>
  );
}
