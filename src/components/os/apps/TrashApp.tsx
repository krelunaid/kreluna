import { useOs } from "@/lib/os/store";

export function TrashApp() {
  const lang = useOs((s) => s.lang);
  const fs = useOs((s) => s.fs);
  const restoreNode = useOs((s) => s.restoreNode);
  const emptyTrash = useOs((s) => s.emptyTrash);
  const items = fs.filter((n) => n.trashed);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-mist">{items.length}</p>
        <button
          type="button"
          onClick={emptyTrash}
          disabled={!items.length}
          className="rounded-lg bg-alert/15 px-3 py-1.5 text-xs text-alert disabled:opacity-40"
        >
          {lang === "it" ? "Svuota cestino" : "Empty trash"}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {items.length === 0 && (
          <p className="p-6 text-sm text-mist">{lang === "it" ? "Cestino vuoto." : "Trash is empty."}</p>
        )}
        {items.map((n) => (
          <div key={n.id} className="flex items-center justify-between border-t border-line px-4 py-2.5">
            <span className="text-sm">{n.name}</span>
            <button type="button" onClick={() => restoreNode(n.id)} className="text-xs text-luna">
              {lang === "it" ? "Ripristina" : "Restore"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
