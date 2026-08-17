import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { AppIcon } from "./AppIcon";

export function ContextMenu() {
  const ctx = useOs((s) => s.ctx);
  const setCtx = useOs((s) => s.setCtx);
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const createNode = useOs((s) => s.createNode);
  const trashNode = useOs((s) => s.trashNode);
  const openNode = useOs((s) => s.openNode);
  const renameNode = useOs((s) => s.renameNode);
  const openApp = useOs((s) => s.openApp);
  const setFsFolder = useOs((s) => s.setFsFolder);
  if (!ctx) return null;

  const items =
    ctx.kind === "desk"
      ? [
          {
            label: copy.files.newFolder,
            run: () => createNode("desk", lang === "it" ? "Cartella" : "Folder", "folder"),
          },
          {
            label: copy.files.newFile,
            run: () => createNode("desk", lang === "it" ? "Nota.md" : "Note.md", "file", "", "md"),
          },
          { label: copy.apps.files, run: () => openApp("files") },
        ]
      : [
          { label: copy.files.open, run: () => ctx.id && openNode(ctx.id) },
          {
            label: copy.files.rename,
            run: () => {
              if (!ctx.id) return;
              const name = window.prompt(copy.files.rename);
              if (name) renameNode(ctx.id, name);
            },
          },
          { label: copy.files.delete, run: () => ctx.id && trashNode(ctx.id) },
          {
            label: copy.apps.files,
            run: () => {
              setFsFolder("desk");
              openApp("files");
            },
          },
        ];

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-70 cursor-default bg-transparent"
        aria-label="Chiudi menu"
        onClick={() => setCtx(null)}
      />
      <div
        className="fixed z-80 min-w-44 overflow-hidden rounded-xl bg-ink-2/95 py-1.5 shadow-panel backdrop-blur-xl"
        style={{ left: ctx.x, top: ctx.y }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {items.map((it) => (
          <button
            key={it.label}
            type="button"
            onClick={() => {
              it.run();
              setCtx(null);
            }}
            className="block w-full px-3.5 py-2 text-left text-[13px] hover:bg-paper/8"
          >
            {it.label}
          </button>
        ))}
      </div>
    </>
  );
}

export function AppSwitcher() {
  const open = useOs((s) => s.switcher);
  const wins = useOs((s) => s.wins);
  const space = useOs((s) => s.space);
  const focusWin = useOs((s) => s.focusWin);
  const setSwitcher = useOs((s) => s.setSwitcher);
  const lang = useOs((s) => s.lang);
  if (!open) return null;
  const list = wins.filter((w) => w.space === space && !w.min);
  return (
    <div className="absolute inset-0 z-70 grid place-items-center bg-ink/40" onClick={() => setSwitcher(false)}>
      <div className="flex flex-wrap justify-center gap-4 p-6" onClick={(e) => e.stopPropagation()}>
        {list.length === 0 && (
          <p className="text-sm text-mist">{lang === "it" ? "Niente di aperto" : "Nothing open"}</p>
        )}
        {list.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => {
              focusWin(w.id);
              setSwitcher(false);
            }}
            className="flex w-28 flex-col items-center gap-2"
          >
            <AppIcon id={w.appId} size={56} />
            <span className="truncate text-xs">{w.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
