import { useOs } from "@/lib/os/store";

export function EditorApp() {
  const lang = useOs((s) => s.lang);
  const fs = useOs((s) => s.fs);
  const editorId = useOs((s) => s.editorId);
  const setEditorId = useOs((s) => s.setEditorId);
  const writeFile = useOs((s) => s.writeFile);
  const createNode = useOs((s) => s.createNode);
  const files = fs.filter((n) => n.kind === "file" && !n.trashed && n.mime !== "img");
  const current = files.find((f) => f.id === editorId) ?? files[0];

  const newFile = () => {
    const id = createNode("desk", lang === "it" ? "Senza-titolo.md" : "Untitled.md", "file", "", "md");
    setEditorId(id);
  };

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-[min(200px,38%)] shrink-0 border-r border-line">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-[11px] tracking-wide text-mist uppercase">Disco</p>
          <button type="button" onClick={newFile} className="text-[12px] text-luna">
            {lang === "it" ? "Nuovo" : "New"}
          </button>
        </div>
        <div className="overflow-auto">
          {files.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setEditorId(f.id)}
              className={`block w-full truncate border-t border-line px-3 py-2 text-left text-[13px] ${current?.id === f.id ? "bg-ink-3" : "hover:bg-ink-3/50"}`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </aside>
      {current ? (
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <p className="truncate font-mono text-[12px]">{current.name}</p>
            <p className="text-[11px] text-ash">{current.size}</p>
          </div>
          <textarea
            value={current.content ?? ""}
            onChange={(e) => writeFile(current.id, e.target.value)}
            spellCheck={false}
            className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed outline-none"
          />
        </div>
      ) : (
        <p className="p-6 text-sm text-mist">{lang === "it" ? "Nessun file." : "No file."}</p>
      )}
    </div>
  );
}
