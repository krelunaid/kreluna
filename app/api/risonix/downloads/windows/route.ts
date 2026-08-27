import { getChatGPTUser } from "@/app/chatgpt-auth";
import { hasFulfilledRisonixOrder } from "@/app/risonix/commerce";
import { installerBucket, RISONIX_WINDOWS_INSTALLER_KEY } from "@/app/risonix/installer-storage";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return new Response("Accesso richiesto", { status: 401 });
  if (!(await hasFulfilledRisonixOrder(user))) {
    return new Response("Acquisto Risonix non trovato", { status: 403 });
  }

  const installer = await installerBucket().get(RISONIX_WINDOWS_INSTALLER_KEY);
  if (!installer) return new Response("Installer temporaneamente non disponibile", { status: 503 });

  const headers = new Headers({
    "content-type": "application/x-msi",
    "content-disposition": 'attachment; filename="Risonix-1.0.0-Windows-x64.msi"',
    "cache-control": "private, no-store",
    "x-content-type-options": "nosniff",
  });
  if (installer.httpEtag) headers.set("etag", installer.httpEtag);
  if (installer.size) headers.set("content-length", String(installer.size));
  return new Response(installer.body, { status: 200, headers });
}
