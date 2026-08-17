import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-ink px-6 text-center text-paper">
      <span className="text-alert" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={1.75} />
      </span>
      <h1 className="font-display text-2xl tracking-[-0.03em]">Qualcosa non ha retto</h1>
      <p className="max-w-md text-sm break-words text-mist">
        {error.message || "Errore inatteso. Ricarica il sistema."}
      </p>
    </main>
  );
}
