import { CATALOG } from "@/lib/os/catalog";
import { parseLuna } from "@/lib/os/luna";
import { EXTRA_APPS, useOs } from "@/lib/os/store";
import type { AppId } from "@/lib/os/types";
import { AppIcon } from "../AppIcon";

export function StoreApp() {
  const lang = useOs((s) => s.lang);
  const fs = useOs((s) => s.fs);
  const installed = useOs((s) => s.installed);
  const installApp = useOs((s) => s.installApp);
  const removeApp = useOs((s) => s.removeApp);
  const openApp = useOs((s) => s.openApp);
  const setLunaFile = useOs((s) => s.setLunaFile);
  const packages = fs.filter((n) => n.mime === "luna" && !n.trashed);

  return (
    <div className="h-full overflow-auto p-5">
      <h2 className="font-display text-2xl tracking-[-0.03em]">
        {lang === "it" ? "Archivio .luna" : ".luna archive"}
      </h2>
      <p className="mt-1 text-sm text-mist">
        {lang === "it"
          ? "Solo pacchetti nativi. I moduli extra si installano da qui; i .luna si ispezionano prima."
          : "Native packages only. Extra modules install from here; .luna files are inspected first."}
      </p>

      <p className="mt-6 text-xs font-medium tracking-wide text-mist uppercase">
        {lang === "it" ? "Pacchetti sul disco" : "Packages on disk"}
      </p>
      <div className="mt-2 space-y-2">
        {packages.map((file) => {
          const parsed = parseLuna(file.content ?? "");
          return (
            <div key={file.id} className="flex items-center gap-3 rounded-xl bg-ink-3 px-3 py-3">
              <span className="grid size-10 place-items-center rounded-xl bg-luna text-[10px] font-bold text-luna-ink">
                LUNA
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{parsed.ok ? parsed.pkg.name[lang] : file.name}</p>
                <p className="text-xs text-mist">
                  {parsed.ok ? parsed.pkg.summary[lang] : parsed.issues[0]?.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLunaFile(file.id);
                  openApp("luna");
                }}
                className="rounded-lg bg-ink-4 px-3 py-1.5 text-xs"
              >
                {lang === "it" ? "Ispeziona" : "Inspect"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs font-medium tracking-wide text-mist uppercase">
        {lang === "it" ? "Moduli extra" : "Extra modules"}
      </p>
      <div className="mt-2 space-y-2">
        {EXTRA_APPS.map((id) => {
          const on = installed.includes(id);
          return (
            <div key={id} className="flex items-center gap-3 rounded-xl bg-ink-3 px-3 py-3">
              <AppIcon id={id} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{CATALOG[id].title(lang)}</p>
                <p className="text-xs text-mist">{CATALOG[id].hint(lang)}</p>
              </div>
              {on ? (
                <div className="flex gap-2">
                  <button type="button" onClick={() => openApp(id)} className="rounded-lg bg-ink-4 px-3 py-1.5 text-xs">
                    {lang === "it" ? "Apri" : "Open"}
                  </button>
                  <button type="button" onClick={() => removeApp(id)} className="rounded-lg px-3 py-1.5 text-xs text-alert">
                    {lang === "it" ? "Rimuovi" : "Remove"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => installApp(id as AppId)}
                  className="rounded-lg bg-luna px-3 py-1.5 text-xs font-medium text-luna-ink"
                >
                  {lang === "it" ? "Installa" : "Install"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
