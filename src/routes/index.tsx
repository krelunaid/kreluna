import { createFileRoute } from "@tanstack/react-router";
import { OsShell } from "@/components/os/OsShell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <OsShell />;
}
