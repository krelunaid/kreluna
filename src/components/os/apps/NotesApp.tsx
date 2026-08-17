import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { cn } from "@/lib/utils";

export function NotesApp() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const notes = useOs((s) => s.notes);
  const noteId = useOs((s) => s.noteId);
  const setNoteId = useOs((s) => s.setNoteId);
  const updateNote = useOs((s) => s.updateNote);
  const addNote = useOs((s) => s.addNote);
  const current = notes.find((n) => n.id === noteId);

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-[min(240px,40%)] shrink-0 border-r border-line">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-xs text-mist">{notes.length}</p>
          <button type="button" onClick={addNote} className="text-[12px] text-luna">
            {copy.notes.new}
          </button>
        </div>
        <div className="overflow-auto">
          {notes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setNoteId(n.id)}
              className={cn(
                "block w-full border-t border-line px-3 py-2.5 text-left",
                noteId === n.id ? "bg-ink-3" : "hover:bg-ink-3/50",
              )}
            >
              <p className="truncate text-sm font-medium">{n.title || copy.notes.title}</p>
              <p className="truncate text-xs text-mist">{n.body || "…"}</p>
            </button>
          ))}
        </div>
      </aside>
      {current ? (
        <div className="flex min-w-0 flex-1 flex-col">
          <input
            value={current.title}
            onChange={(e) => updateNote(current.id, { title: e.target.value })}
            className="border-b border-line bg-transparent px-5 py-3 font-display text-2xl tracking-[-0.03em] outline-none"
          />
          <textarea
            value={current.body}
            onChange={(e) => updateNote(current.id, { body: e.target.value })}
            className="min-h-0 flex-1 resize-none bg-transparent px-5 py-4 text-sm leading-relaxed outline-none"
          />
        </div>
      ) : (
        <p className="p-6 text-sm text-mist">{copy.notes.empty}</p>
      )}
    </div>
  );
}
