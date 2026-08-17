import { useRef, useState } from "react";
import { useOs } from "@/lib/os/store";
import { parseLuna } from "@/lib/os/luna";
import { FOLDER_TINTS, type FolderTint } from "@/lib/os/types";
import { t } from "@/lib/os/i18n";
import { FileTypeGlyph, FolderGlyph } from "../FileGlyph";
import { cn } from "@/lib/utils";

const SIDE = [
  { id: "desk", it: "Desktop", en: "Desktop" },
  { id: "docs", it: "Documenti", en: "Documents" },
  { id: "down", it: "Download", en: "Downloads" },
  { id: "img", it: "Immagini", en: "Pictures" },
  { id: "music", it: "Musica", en: "Music" },
  { id: "video", it: "Video", en: "Videos" },
  { id: "lavoro", it: "Lavoro", en: "Work" },
  { id: "personale", it: "Personale", en: "Personal" },
  { id: "studio", it: "Studio", en: "Study" },
  { id: "progetti", it: "Progetti", en: "Projects" },
  { id: "finanza", it: "Finanza", en: "Finance" },
  { id: "share", it: "Condivisi", en: "Shared" },
  { id: "sys", it: "Sistema", en: "System" },
];

export function FilesApp() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const fs = useOs((s) => s.fs);
  const folder = useOs((s) => s.fsFolder);
  const setFsFolder = useOs((s) => s.setFsFolder);
  const openNode = useOs((s) => s.openNode);
  const createNode = useOs((s) => s.createNode);
  const trashNode = useOs((s) => s.trashNode);
  const renameNode = useOs((s) => s.renameNode);
  const tintNode = useOs((s) => s.tintNode);
  const importFiles = useOs((s) => s.importFiles);
  const setCtx = useOs((s) => s.setCtx);
  const live = fs.filter((n) => !n.trashed);
  const current = live.find((n) => n.id === folder) ?? live.find((n) => n.id === "docs") ?? live[0];
  const children = live.filter((n) => n.parent === current.id);
  const folders = children.filter((n) => n.kind === "folder");
  const files = children.filter((n) => n.kind === "file");
  const [sel, setSel] = useState<string | null>(null);
  const selected = live.find((n) => n.id === sel);
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-full bg-ink-2 text-paper">
      <aside className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-line p-3 sm:flex">
        <p className="mb-2 px-2 text-[10px] tracking-wide text-mist uppercase">
          {lang === "it" ? "Luoghi" : "Places"}
        </p>
        {SIDE.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setFsFolder(s.id)}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-left text-[13px]",
              current.id === s.id ? "bg-ink-4 font-medium text-luna" : "text-mist hover:bg-ink-3",
            )}
          >
            {lang === "it" ? s.it : s.en}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setFsFolder("lavoro")}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-left text-[13px]",
            current.id === "lavoro" ? "bg-ink-4 font-medium text-luna" : "text-mist hover:bg-ink-3",
          )}
        >
          {lang === "it" ? "Orbita Lavoro" : "Work orbit"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
          <button
            type="button"
            disabled={!current.parent}
            onClick={() => current.parent && setFsFolder(current.parent)}
            className="rounded-lg bg-ink-3 px-2.5 py-1 text-xs disabled:opacity-40"
          >
            {lang === "it" ? "Indietro" : "Back"}
          </button>
          <h2 className="flex-1 truncate text-sm font-semibold">{current.name}</h2>
          <input
            ref={input}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const list = e.target.files;
              if (list?.length) void importFiles(Array.from(list), current.id);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="rounded-lg bg-ink-3 px-2.5 py-1 text-xs"
          >
            {lang === "it" ? "Importa" : "Import"}
          </button>
          {selected && (
            <button
              type="button"
              onClick={() =>
                selected.kind === "folder" ? setFsFolder(selected.id) : openNode(selected.id)
              }
              className="rounded-lg bg-luna px-2.5 py-1 text-xs font-medium text-luna-ink"
            >
              {copy.files.open}
            </button>
          )}
          <button
            type="button"
            onClick={() => createNode(current.id, lang === "it" ? "Cartella" : "Folder", "folder")}
            className="rounded-lg bg-ink-3 px-2.5 py-1 text-xs"
          >
            {copy.files.newFolder}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {folders.length > 0 && (
            <>
              <p className="mb-3 text-xs text-mist">{lang === "it" ? "Cartelle" : "Folders"}</p>
              <div className="mb-8 grid grid-cols-3 gap-5 sm:grid-cols-4">
                {folders.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setFsFolder(n.id)}
                    onDoubleClick={() => setFsFolder(n.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSel(n.id);
                      setCtx({ x: e.clientX, y: e.clientY, kind: "file", id: n.id });
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center",
                      sel === n.id ? "bg-ink-3 ring-2 ring-luna" : "hover:bg-ink-3/70",
                    )}
                  >
                    <FolderGlyph size={72} tint={n.tint} />
                    <span className="w-full truncate text-sm font-medium">{n.name}</span>
                    <span className="text-xs text-mist">
                      {live.filter((c) => c.parent === n.id && !c.trashed).length}{" "}
                      {lang === "it" ? "elementi" : "items"}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {files.length > 0 && (
            <>
              <p className="mb-3 text-xs text-mist">{lang === "it" ? "File recenti" : "Recent files"}</p>
              <ul className="space-y-1">
                {files.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => openNode(n.id)}
                      onDoubleClick={() => openNode(n.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSel(n.id);
                        setCtx({ x: e.clientX, y: e.clientY, kind: "file", id: n.id });
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left",
                        sel === n.id ? "bg-ink-4" : "hover:bg-ink-3",
                      )}
                    >
                      <FileTypeGlyph mime={n.mime} size={28} />
                      <span className="min-w-0 flex-1 truncate text-sm">{n.name}</span>
                      <span className="hidden text-xs text-mist sm:inline">{n.size}</span>
                      <span className="text-xs text-ash">{n.updated}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {children.length === 0 && <p className="text-sm text-mist">{copy.files.empty}</p>}
        </div>
      </div>

      {selected && (
        <aside className="hidden w-64 shrink-0 flex-col border-l border-line p-5 lg:flex">
          <div className="mb-4 grid place-items-center">
            {selected.kind === "folder" ? (
              <FolderGlyph size={88} tint={selected.tint} />
            ) : (
              <FileTypeGlyph mime={selected.mime} size={72} />
            )}
          </div>
          <h3 className="text-center text-sm font-semibold">{selected.name}</h3>
          <p className="mt-1 text-center text-xs text-mist">
            {selected.kind === "folder" ? (lang === "it" ? "Cartella" : "Folder") : selected.mime}
          </p>
          <dl className="mt-5 space-y-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-mist">{lang === "it" ? "Dimensione" : "Size"}</dt>
              <dd>{selected.size ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mist">{lang === "it" ? "Modifica" : "Modified"}</dt>
              <dd>{selected.updated ?? "—"}</dd>
            </div>
          </dl>
          {selected.kind === "folder" && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-mist">{lang === "it" ? "Sfera" : "Sphere"}</p>
              <div className="flex justify-center gap-2">
                {(Object.keys(FOLDER_TINTS) as FolderTint[]).map((tint) => (
                  <button
                    key={tint}
                    type="button"
                    aria-label={tint}
                    onClick={() => tintNode(selected.id, tint)}
                    className={cn(
                      "size-6 rounded-full",
                      (selected.tint ?? "luna") === tint ? "ring-2 ring-luna ring-offset-2 ring-offset-ink-2" : "",
                    )}
                    style={{
                      background: `radial-gradient(circle at 35% 30%, #fff, ${FOLDER_TINTS[tint].mid} 45%, ${FOLDER_TINTS[tint].deep})`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {selected.mime === "exe" && (
            <div className="mt-4 rounded-xl bg-ink-3 p-3 text-xs leading-relaxed text-mist">
              {lang === "it"
                ? "File .exe di un altro sistema. Kreluna lo legge e lo tiene sul disco, ma non lo esegue. I programmi nativi sono pacchetti .luna."
                : "An .exe from another system. Kreluna stores and reads it, but does not run it. Native programs are .luna packages."}
              {selected.meta && <p className="mt-2 font-mono text-[10px] break-all">{selected.meta}</p>}
            </div>
          )}
          {selected.mime === "luna" && (
            <LunaAside content={selected.content ?? ""} lang={lang} />
          )}
          {selected.content && selected.mime !== "img" && selected.mime !== "exe" && (
            <p className="mt-4 line-clamp-6 text-xs leading-relaxed text-mist">{selected.content}</p>
          )}
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <button
              type="button"
              onClick={() =>
                selected.kind === "folder" ? setFsFolder(selected.id) : openNode(selected.id)
              }
              className="w-full rounded-lg bg-luna py-2 text-xs font-medium text-luna-ink"
            >
              {copy.files.open}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const name = window.prompt(copy.files.rename);
                  if (name) renameNode(selected.id, name);
                }}
                className="flex-1 rounded-lg bg-ink-3 py-2 text-xs"
              >
                {copy.files.rename}
              </button>
              <button
                type="button"
                onClick={() => trashNode(selected.id)}
                className="flex-1 rounded-lg bg-alert/10 py-2 text-xs text-alert"
              >
                {copy.files.delete}
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

function LunaAside({ content, lang }: { content: string; lang: "it" | "en" }) {
  const parsed = parseLuna(content);
  if (!parsed.ok) {
    return (
      <div className="mt-4 rounded-xl bg-alert/10 p-3 text-xs leading-relaxed text-alert">
        {parsed.issues[0]?.message}
      </div>
    );
  }
  return (
    <div className="mt-4 rounded-xl bg-ink-3 p-3 text-xs leading-relaxed text-mist">
      <p className="font-medium text-paper">{parsed.pkg.id}</p>
      <p className="mt-1">{parsed.pkg.summary[lang]}</p>
      <p className="mt-2 font-mono text-[10px] break-all">{parsed.pkg.seal.fingerprint}</p>
      <p className="mt-2">
        {lang === "it"
          ? "Doppio clic apre l’ispettore Luna. Non è un .exe."
          : "Double-click opens the Luna inspector. This is not an .exe."}
      </p>
    </div>
  );
}
