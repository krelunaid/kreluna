import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const clientDir = join(projectRoot, "dist", "client");

// Aruba serves directory indexes reliably. Keep the generated flat file as a
// fallback and add a directory index so the public URL remains /krl/.
await mkdir(join(clientDir, "krl"), { recursive: true });
await copyFile(join(clientDir, "krl.html"), join(clientDir, "krl", "index.html"));
