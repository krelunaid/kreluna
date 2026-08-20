import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OsShell } from "@/components/os/OsShell";
import "@/styles.css";

document.documentElement.dataset.krelunaHost = "desktop";

const root = document.getElementById("root");
if (!root) throw new Error("Kreluna desktop root is missing");

createRoot(root).render(
  <StrictMode>
    <OsShell />
  </StrictMode>,
);
