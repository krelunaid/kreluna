import { env } from "cloudflare:workers";

export const RISONIX_MAC_INSTALLER_KEY =
  "risonix/1.0.0/macos/arm64/Risonix-1.0.0-macOS-arm64.dmg";

export const RISONIX_WINDOWS_INSTALLER_KEY =
  "risonix/1.0.0/windows/x64/Risonix-1.0.0-Windows-x64.msi";

type StoredInstaller = {
  body: ReadableStream<Uint8Array>;
  httpEtag?: string;
  size?: number;
};

type InstallerBucket = {
  get(key: string): Promise<StoredInstaller | null>;
};

export function installerBucket(): InstallerBucket {
  const bucket = (env as unknown as { FILES?: InstallerBucket }).FILES;
  if (!bucket) throw Object.assign(new Error("Archivio installer non configurato."), { status: 503 });
  return bucket;
}
