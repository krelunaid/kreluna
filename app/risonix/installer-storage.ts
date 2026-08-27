import { env } from "cloudflare:workers";

export const RISONIX_MAC_INSTALLER_KEY =
  "risonix/1.0.0/macos/arm64/Risonix-1.0.0-macOS-arm64.dmg";

type StoredInstaller = {
  body: ReadableStream<Uint8Array>;
  httpEtag?: string;
  size?: number;
};

type InstallerBucket = {
  get(key: string): Promise<StoredInstaller | null>;
  put(
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string; contentDisposition?: string } },
  ): Promise<unknown>;
};

function runtimeValue(name: string): string | undefined {
  const workerValue = (env as unknown as Record<string, unknown>)[name];
  const value = typeof workerValue === "string" ? workerValue : process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function installerBucket(): InstallerBucket {
  const bucket = (env as unknown as { FILES?: InstallerBucket }).FILES;
  if (!bucket) throw Object.assign(new Error("Archivio installer non configurato."), { status: 503 });
  return bucket;
}

export async function authorizeInstallerUpload(request: Request): Promise<boolean> {
  const expected = runtimeValue("RISONIX_INSTALLER_UPLOAD_SECRET");
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return false;
  const [expectedHash, suppliedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(supplied)),
  ]);
  const left = new Uint8Array(expectedHash);
  const right = new Uint8Array(suppliedHash);
  let difference = left.length ^ right.length;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ (right[index] ?? 0);
  return difference === 0;
}

export async function sha256Hex(value: ArrayBuffer): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", value));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
