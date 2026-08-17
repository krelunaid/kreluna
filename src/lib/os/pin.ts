const SALT = "kreluna-pin-v1";

export async function hashPin(pin: string) {
  const data = new TextEncoder().encode(`${SALT}:${pin.trim()}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function pinOk(pin: string) {
  return /^\d{4,6}$/.test(pin.trim());
}
