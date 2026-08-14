import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const clientDir = join(projectRoot, "dist", "client");

// Aruba serves directory indexes reliably. Keep each generated flat file as a
// fallback and add a directory index so public URLs retain their trailing slash.
for (const route of ["krl", "store"]) {
  await mkdir(join(clientDir, route), { recursive: true });
  await copyFile(join(clientDir, `${route}.html`), join(clientDir, route, "index.html"));
}
