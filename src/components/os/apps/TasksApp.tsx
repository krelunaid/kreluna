import { useState } from "react";
import { useOs } from "@/lib/os/store";

export function TasksApp() {
  const lang = useOs((s) => s.lang);
  const tasks = useOs((s) => s.tasks);
  const addTask = useOs((s) => s.addTask);
  const toggleTask = useOs((s) => s.toggleTask);
  const removeTask = useOs((s) => s.removeTask);
  const [title, setTitle] = useState("");

  return (
    <div className="flex h-full flex-col">
      <form
        className="flex gap-2 border-b border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addTask(title.trim());
          setTitle("");
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={lang === "it" ? "Nuovo compito…" : "New task…"}
          className="h-10 flex-1 rounded-xl bg-ink-3 px-3 text-sm outline-none"
        />
        <button type="submit" className="h-10 rounded-xl bg-luna px-3 text-sm font-medium text-luna-ink">
          {lang === "it" ? "Aggiungi" : "Add"}
        </button>
      </form>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 border-b border-line py-2.5">
            <button
              type="button"
              onClick={() => toggleTask(t.id)}
              className={`size-5 rounded-full border ${t.done ? "border-luna bg-luna" : "border-mist"}`}
            />
            <span className={`flex-1 text-sm ${t.done ? "text-ash line-through" : ""}`}>{t.title}</span>
            <button type="button" onClick={() => removeTask(t.id)} className="text-[11px] text-ash">
              {lang === "it" ? "Togli" : "Remove"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
