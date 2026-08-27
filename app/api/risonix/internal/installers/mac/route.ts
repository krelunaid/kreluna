import {
  authorizeInstallerUpload,
  installerBucket,
  RISONIX_MAC_INSTALLER_KEY,
  sha256Hex,
} from "@/app/risonix/installer-storage";

const MAX_INSTALLER_BYTES = 20 * 1024 * 1024;

export async function PUT(request: Request) {
  if (!(await authorizeInstallerUpload(request))) return new Response("Non autorizzato", { status: 401 });
  const declaredLength = Number(request.headers.get("content-length"));
  if (!Number.isFinite(declaredLength) || declaredLength <= 0 || declaredLength > MAX_INSTALLER_BYTES) {
    return new Response("Dimensione installer non valida", { status: 413 });
  }
  const expectedHash = request.headers.get("x-risonix-sha256")?.toLowerCase();
  if (!expectedHash || !/^[a-f0-9]{64}$/.test(expectedHash)) return new Response("Hash richiesto", { status: 400 });

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength !== declaredLength || bytes.byteLength > MAX_INSTALLER_BYTES) {
    return new Response("Dimensione installer non coerente", { status: 400 });
  }
  const actualHash = await sha256Hex(bytes);
  if (actualHash !== expectedHash) return new Response("Hash installer non coerente", { status: 400 });

  await installerBucket().put(RISONIX_MAC_INSTALLER_KEY, bytes, {
    httpMetadata: {
      contentType: "application/x-apple-diskimage",
      contentDisposition: 'attachment; filename="Risonix-1.0.0-macOS-arm64.dmg"',
    },
  });
  return Response.json({ ok: true, bytes: bytes.byteLength, sha256: actualHash });
}
