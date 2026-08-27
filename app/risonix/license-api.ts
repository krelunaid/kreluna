import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { risonixActivations, risonixLicenseEvents, risonixLicenses } from "../../db/schema";

type JsonObject = Record<string, unknown>;

const encoder = new TextEncoder();
const LICENSE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function required(name: keyof typeof env): string {
  const value = env[name] ?? process.env[String(name)];
  if (typeof value !== "string" || value.length < 24) throw new Error(`Configurazione ${String(name)} assente.`);
  return value;
}

function base64Url(bytes: Uint8Array): string {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const decoded = atob(padded);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

async function hash(value: string): Promise<string> {
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}

async function licenseHash(key: string) {
  return hash(`${required("RISONIX_LICENSE_PEPPER")}:${key.trim().toUpperCase()}`);
}

async function customerHash(email: string) {
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw apiError(400, "Email cliente non valida.");
  return hash(`${required("RISONIX_LICENSE_PEPPER")}:customer:${normalized}`);
}

async function sameSecret(left: string | null, right: string): Promise<boolean> {
  if (!left) return false;
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", encoder.encode(left)), crypto.subtle.digest("SHA-256", encoder.encode(right))]);
  return crypto.subtle.timingSafeEqual(a, b);
}

function apiError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

function errorResponse(error: unknown) {
  const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
  const message = error instanceof Error && status < 500 ? error.message : "Errore interno del server licenze.";
  if (status >= 500) console.error("Risonix license API failure", error);
  return Response.json({ error: message }, { status });
}

function text(body: JsonObject, key: string, max: number, requiredValue = true): string {
  const value = typeof body[key] === "string" ? body[key].trim() : "";
  if ((requiredValue && !value) || value.length > max) throw apiError(400, `Campo ${key} non valido.`);
  return value;
}

function licenseKey(): string {
  const random = crypto.getRandomValues(new Uint8Array(16));
  const body = Array.from(random, (value) => LICENSE_ALPHABET[value % LICENSE_ALPHABET.length]).join("");
  return `RIX-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}-${body.slice(12, 16)}`;
}

async function addEvent(licenseId: string, eventType: string, createdAt = Math.floor(Date.now() / 1000)) {
  await getDb().insert(risonixLicenseEvents).values({ id: crypto.randomUUID(), licenseId, eventType, createdAt });
}

async function signLease(activation: typeof risonixActivations.$inferSelect) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 180;
  const payload = {
    version: 1,
    license_id: activation.licenseId,
    activation_id: activation.id,
    device_id: activation.deviceId,
    issued_at: issuedAt,
    expires_at: expiresAt,
    online_required: true,
  };
  const lease = base64Url(encoder.encode(JSON.stringify(payload)));
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    fromBase64Url(required("RISONIX_SIGNING_PRIVATE_KEY_PKCS8_B64")),
    "Ed25519",
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("Ed25519", privateKey, encoder.encode(lease));
  return {
    activation_id: activation.id,
    lease,
    lease_signature: base64Url(new Uint8Array(signature)),
    signing_public_key: required("RISONIX_SIGNING_PUBLIC_KEY_B64"),
    expires_at: new Date(expiresAt * 1000).toISOString(),
    device_label: activation.deviceLabel,
  };
}

async function json(request: Request): Promise<JsonObject> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) throw apiError(415, "Contenuto JSON richiesto.");
  return (await request.json()) as JsonObject;
}

async function requireAdmin(request: Request) {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!(await sameSecret(bearer, required("RISONIX_ADMIN_SECRET")))) throw apiError(403, "Autorizzazione amministratore non valida.");
}

async function requireSite(request: Request) {
  if (!(await sameSecret(request.headers.get("x-kreluna-site-secret"), required("RISONIX_SITE_SECRET")))) throw apiError(403, "Collegamento Kreluna non autorizzato.");
}

async function controlToken() {
  return hash(`control:${required("RISONIX_ADMIN_SECRET")}:${required("RISONIX_DASHBOARD_PASSWORD")}`);
}

async function requireControl(request: Request, mutation = false) {
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)rx_admin=([^;]+)/)?.[1] ?? null;
  if (!(await sameSecret(cookie, await controlToken()))) throw apiError(401, "Sessione amministratore non valida.");
  if (mutation) {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) throw apiError(403, "Origine richiesta non valida.");
  }
}

async function controlLogin(request: Request) {
  const body = await json(request);
  if (!(await sameSecret(text(body, "password", 160), required("RISONIX_DASHBOARD_PASSWORD")))) throw apiError(403, "Password non valida.");
  return Response.json({ ok: true }, { headers: { "set-cookie": `rx_admin=${await controlToken()}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800` } });
}

async function listLicenses(request: Request, control = false) {
  if (control) await requireControl(request);
  else await requireAdmin(request);
  const db = getDb();
  const licenses = await db.select().from(risonixLicenses).orderBy(desc(risonixLicenses.createdAt)).limit(250);
  const result = await Promise.all(licenses.map(async (license) => {
    const [activation] = await db.select().from(risonixActivations).where(eq(risonixActivations.licenseId, license.id)).limit(1);
    return { license_id: license.id, status: license.status, order_reference: license.orderReference, created_at: new Date(license.createdAt * 1000).toISOString(), activation: activation ? { device_label: activation.deviceLabel, platform: activation.platform, app_version: activation.appVersion, status: activation.status, activated_at: new Date(activation.activatedAt * 1000).toISOString(), last_seen: new Date(activation.lastSeen * 1000).toISOString() } : null };
  }));
  return Response.json(result);
}

async function activate(request: Request) {
  const body = await json(request);
  const key = text(body, "license_key", 40).toUpperCase();
  const deviceId = text(body, "device_id", 80);
  const publicKey = text(body, "device_public_key", 80);
  const deviceLabel = text(body, "device_label", 120);
  const platform = text(body, "platform", 40);
  const appVersion = text(body, "app_version", 40);
  if (!key.startsWith("RIX-") || deviceId.length < 20 || fromBase64Url(publicKey).length !== 32) throw apiError(400, "Dati di attivazione non validi.");

  const db = getDb();
  const [license] = await db.select().from(risonixLicenses).where(eq(risonixLicenses.keyHash, await licenseHash(key))).limit(1);
  if (!license) throw apiError(403, "Codice licenza non valido.");
  if (license.status !== "active") throw apiError(403, "Questa licenza è disattivata.");
  const [existing] = await db.select().from(risonixActivations).where(eq(risonixActivations.licenseId, license.id)).limit(1);
  const now = Math.floor(Date.now() / 1000);
  let activation: typeof risonixActivations.$inferSelect;
  if (existing?.status === "active" && (existing.deviceId !== deviceId || existing.devicePublicKey !== publicKey)) {
    throw apiError(409, "Licenza già associata a un altro dispositivo. Liberalo dall’area Kreluna prima del trasferimento.");
  }
  if (existing) {
    const id = existing.status === "active" ? existing.id : crypto.randomUUID();
    await db.update(risonixActivations).set({ id, deviceId, devicePublicKey: publicKey, deviceLabel, platform, appVersion, status: "active", activatedAt: now, lastSeen: now, lastNonce: null }).where(eq(risonixActivations.licenseId, license.id));
    activation = { ...existing, id, deviceId, devicePublicKey: publicKey, deviceLabel, platform, appVersion, status: "active", activatedAt: now, lastSeen: now, lastNonce: null };
  } else {
    activation = { id: crypto.randomUUID(), licenseId: license.id, deviceId, devicePublicKey: publicKey, deviceLabel, platform, appVersion, status: "active", activatedAt: now, lastSeen: now, lastNonce: null };
    await db.insert(risonixActivations).values(activation);
  }
  await addEvent(license.id, "device_activated", now);
  return Response.json(await signLease(activation));
}

async function heartbeat(request: Request) {
  const body = await json(request);
  const activationId = text(body, "activation_id", 80);
  const nonce = text(body, "nonce", 80);
  const timestamp = Number(body.timestamp);
  const signature = text(body, "signature", 120);
  const platform = text(body, "platform", 40);
  const appVersion = text(body, "app_version", 40);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(timestamp) || Math.abs(now - timestamp) > 120 || nonce.length < 20) throw apiError(403, "Richiesta scaduta o non valida.");
  const db = getDb();
  const [activation] = await db.select().from(risonixActivations).where(and(eq(risonixActivations.id, activationId), eq(risonixActivations.status, "active"))).limit(1);
  if (!activation) throw apiError(403, "Attivazione non valida o disabilitata.");
  const [license] = await db.select().from(risonixLicenses).where(and(eq(risonixLicenses.id, activation.licenseId), eq(risonixLicenses.status, "active"))).limit(1);
  if (!license || activation.lastNonce === nonce) throw apiError(403, "Attivazione non valida o richiesta già utilizzata.");
  const deviceKey = await crypto.subtle.importKey("raw", fromBase64Url(activation.devicePublicKey), "Ed25519", false, ["verify"]);
  const valid = await crypto.subtle.verify("Ed25519", deviceKey, fromBase64Url(signature), encoder.encode(`${activationId}:${nonce}:${timestamp}`));
  if (!valid) throw apiError(403, "Verifica del dispositivo non riuscita.");
  await db.update(risonixActivations).set({ lastSeen: now, lastNonce: nonce, platform, appVersion }).where(eq(risonixActivations.id, activation.id));
  return Response.json(await signLease({ ...activation, lastSeen: now, lastNonce: nonce, platform, appVersion }));
}

async function createLicense(request: Request) {
  await requireAdmin(request);
  const body = await json(request);
  const key = licenseKey();
  const id = crypto.randomUUID();
  const email = typeof body.customer_email === "string" ? body.customer_email.trim() : "";
  await getDb().insert(risonixLicenses).values({
    id,
    keyHash: await licenseHash(key),
    status: "active",
    orderReference: typeof body.order_reference === "string" ? body.order_reference.trim().slice(0, 120) || null : null,
    customerEmailHash: email ? await customerHash(email) : null,
    createdAt: Math.floor(Date.now() / 1000),
  });
  return Response.json({ license_key: key, license_id: id }, { status: 201 });
}

async function createLicenseFromControl(request: Request) {
  await requireControl(request, true);
  const forwarded = new Request(request.url, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${required("RISONIX_ADMIN_SECRET")}` }, body: JSON.stringify(await json(request)) });
  return createLicense(forwarded);
}

async function controlMutation(request: Request, licenseId: string, action: "release" | "disable") {
  await requireControl(request, true);
  if (action === "release") {
    await getDb().update(risonixActivations).set({ status: "disabled" }).where(eq(risonixActivations.licenseId, licenseId));
    await addEvent(licenseId, "device_released_by_control");
  } else {
    await getDb().update(risonixLicenses).set({ status: "disabled" }).where(eq(risonixLicenses.id, licenseId));
    await getDb().update(risonixActivations).set({ status: "disabled" }).where(eq(risonixActivations.licenseId, licenseId));
    await addEvent(licenseId, "license_disabled_by_control");
  }
  return new Response(null, { status: 204 });
}

async function customerLicenses(request: Request) {
  await requireSite(request);
  const email = text(await json(request), "email", 254);
  const db = getDb();
  const licenses = await db.select().from(risonixLicenses).where(eq(risonixLicenses.customerEmailHash, await customerHash(email)));
  const now = Math.floor(Date.now() / 1000);
  const result = await Promise.all(licenses.map(async (license) => {
    const [activation] = await db.select().from(risonixActivations).where(and(eq(risonixActivations.licenseId, license.id), eq(risonixActivations.status, "active"))).limit(1);
    return { license_id: license.id, status: license.status, device_label: activation?.deviceLabel ?? null, app_version: activation?.appVersion ?? null, online: Boolean(activation && now - activation.lastSeen <= 90), activated_at: activation ? new Date(activation.activatedAt * 1000).toISOString() : null, last_seen: activation ? new Date(activation.lastSeen * 1000).toISOString() : null };
  }));
  return Response.json(result);
}

async function release(request: Request, licenseId: string, customer: boolean) {
  if (customer) {
    await requireSite(request);
    const email = text(await json(request), "email", 254);
    const [owned] = await getDb().select().from(risonixLicenses).where(and(eq(risonixLicenses.id, licenseId), eq(risonixLicenses.customerEmailHash, await customerHash(email)), eq(risonixLicenses.status, "active"))).limit(1);
    if (!owned) throw apiError(403, "Licenza non associata a questo account.");
  } else {
    await requireAdmin(request);
  }
  await getDb().update(risonixActivations).set({ status: "disabled" }).where(eq(risonixActivations.licenseId, licenseId));
  await addEvent(licenseId, customer ? "device_released_by_customer" : "device_released_by_admin");
  return new Response(null, { status: 204 });
}

async function disable(request: Request, licenseId: string) {
  await requireAdmin(request);
  await getDb().update(risonixLicenses).set({ status: "disabled" }).where(eq(risonixLicenses.id, licenseId));
  await getDb().update(risonixActivations).set({ status: "disabled" }).where(eq(risonixActivations.licenseId, licenseId));
  await addEvent(licenseId, "license_disabled_by_admin");
  return new Response(null, { status: 204 });
}

export async function handleLicenseApi(request: Request, path: string[]) {
  try {
    const route = path.join("/");
    if (request.method === "GET" && route === "health") return Response.json({ service: "risonix-license-server", status: "ok", public_key: required("RISONIX_SIGNING_PUBLIC_KEY_B64") });
    if (request.method === "GET" && route === "admin/licenses") return await listLicenses(request);
    if (request.method === "GET" && route === "control/licenses") return await listLicenses(request, true);
    if (request.method === "POST" && route === "control/session") return await controlLogin(request);
    if (request.method === "POST" && route === "control/licenses") return await createLicenseFromControl(request);
    const controlAction = route.match(/^control\/licenses\/([^/]+)\/(release-device|disable)$/);
    if (request.method === "POST" && controlAction) return await controlMutation(request, controlAction[1], controlAction[2] === "disable" ? "disable" : "release");
    if (request.method !== "POST") return Response.json({ error: "Metodo non supportato." }, { status: 405 });
    if (route === "licenses/activate") return await activate(request);
    if (route === "licenses/heartbeat") return await heartbeat(request);
    if (route === "admin/licenses") return await createLicense(request);
    if (route === "customer/licenses") return await customerLicenses(request);
    const adminRelease = route.match(/^admin\/licenses\/([^/]+)\/release-device$/);
    if (adminRelease) return await release(request, adminRelease[1], false);
    const customerRelease = route.match(/^customer\/licenses\/([^/]+)\/release-device$/);
    if (customerRelease) return await release(request, customerRelease[1], true);
    const adminDisable = route.match(/^admin\/licenses\/([^/]+)\/disable$/);
    if (adminDisable) return await disable(request, adminDisable[1]);
    return Response.json({ error: "Endpoint inesistente." }, { status: 404 });
  } catch (error) {
    return errorResponse(error);
  }
}
