import { useState } from "react";
import { useOs } from "@/lib/os/store";
import { WALLS } from "@/lib/os/walls";

export function PhotosApp() {
  const lang = useOs((s) => s.lang);
  const fs = useOs((s) => s.fs);
  const setWall = useOs((s) => s.setWall);
  const wallId = useOs((s) => s.wallId);
  const pics = [
    ...WALLS.map((w) => ({ id: `wall-${w.id}`, name: lang === "it" ? w.it : w.en, src: w.src, wall: w.id })),
    ...fs
      .filter((n) => n.kind === "file" && n.mime === "img" && !n.trashed && n.content)
      .map((n) => ({ id: n.id, name: n.name, src: n.content as string, wall: null as string | null })),
  ];
  const [sel, setSel] = useState(pics[0]?.id ?? "");
  const current = pics.find((p) => p.id === sel);

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-[min(200px,36%)] shrink-0 overflow-auto border-r border-line p-2">
        {pics.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSel(p.id)}
            className={`mb-2 block w-full overflow-hidden rounded-xl ${sel === p.id ? "ring-1 ring-luna" : ""}`}
          >
            <img src={p.src} alt="" className="h-24 w-full object-cover" />
          </button>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col bg-ink">
        {current ? (
          <>
            <img src={current.src} alt="" className="min-h-0 flex-1 object-contain" />
            <div className="flex items-center justify-between border-t border-line px-4 py-2">
              <p className="text-sm">{current.name}</p>
              {current.wall && (
                <button
                  type="button"
                  onClick={() => setWall(current.wall!)}
                  className="text-xs text-luna"
                >
                  {wallId === current.wall
                    ? lang === "it"
                      ? "Sfondo attuale"
                      : "Current wallpaper"
                    : lang === "it"
                      ? "Usa come sfondo"
                      : "Use as wallpaper"}
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="m-auto text-sm text-mist">{lang === "it" ? "Seleziona un’immagine." : "Select an image."}</p>
        )}
      </div>
    </div>
  );
}
