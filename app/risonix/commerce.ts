import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { risonixOrderEvents, risonixOrders } from "../../db/schema";
import {
  createPaidRisonixLicense,
  disableRisonixLicenseForRefund,
  hashRisonixCustomerEmail,
  hashRisonixUserId,
} from "./license-api";
import { verifyStripeSignature } from "./stripe-signature";

export { verifyStripeSignature } from "./stripe-signature";

type StripeObject = Record<string, unknown>;
type CustomerIdentity = { userId: string; email: string };

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const CHECKOUT_CONFIGURATION = [
  "RISONIX_PUBLIC_ORIGIN",
  "RISONIX_STRIPE_MODE",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RISONIX_STRIPE_PRICE_ID",
  "RISONIX_STRIPE_EXPECTED_AMOUNT",
  "RISONIX_STRIPE_CURRENCY",
  "RISONIX_STRIPE_TAX_BEHAVIOR",
  "RISONIX_PRICE_DISPLAY",
  "RISONIX_ORDER_ENCRYPTION_KEY_B64",
  "RISONIX_DOWNLOAD_MAC_URL",
  "RISONIX_EMAIL_PROVIDER",
  "RISONIX_EMAIL_API_URL",
  "RISONIX_EMAIL_API_KEY",
  "RISONIX_EMAIL_FROM",
  "RISONIX_SELLER_LEGAL_NAME",
  "RISONIX_SELLER_VAT_ID",
  "RISONIX_TERMS_URL",
  "RISONIX_PRIVACY_URL",
  "RISONIX_REFUND_POLICY_URL",
] as const;

function runtimeValue(name: string): string | undefined {
  const workerValue = (env as unknown as Record<string, unknown>)[name];
  const value = typeof workerValue === "string" ? workerValue : process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function required(name: (typeof CHECKOUT_CONFIGURATION)[number]): string {
  const value = runtimeValue(name);
  if (!value) throw commerceError(503, `Configurazione commercio incompleta: ${name}.`);
  return value;
}

function commerceError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
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

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return Uint8Array.from(bytes).buffer;
}

async function sha256(value: string): Promise<string> {
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}

function trustedHttpsUrl(name: (typeof CHECKOUT_CONFIGURATION)[number]): string {
  const value = required(name);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw commerceError(503, `Configurazione ${name} non valida.`);
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw commerceError(503, `Configurazione ${name} deve usare HTTPS.`);
  }
  return url.toString().replace(/\/$/, "");
}

function optionalTrustedHttpsUrl(name: string): string | null {
  const value = runtimeValue(name);
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw commerceError(503, `Configurazione ${name} non valida.`);
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw commerceError(503, `Configurazione ${name} deve usare HTTPS.`);
  return url.toString().replace(/\/$/, "");
}

function stripeConfiguration() {
  const mode = required("RISONIX_STRIPE_MODE");
  if (mode !== "test" && mode !== "live") throw commerceError(503, "Modalità Stripe non valida.");
  const secretKey = required("STRIPE_SECRET_KEY");
  const expectedPrefix = mode === "live" ? "sk_live_" : "sk_test_";
  if (!secretKey.startsWith(expectedPrefix)) throw commerceError(503, `È richiesta una chiave Stripe ${mode}.`);
  const priceId = required("RISONIX_STRIPE_PRICE_ID");
  if (!priceId.startsWith("price_")) throw commerceError(503, "Price ID Stripe non valido.");
  const expectedAmount = Number(required("RISONIX_STRIPE_EXPECTED_AMOUNT"));
  if (!Number.isInteger(expectedAmount) || expectedAmount <= 0) throw commerceError(503, "Importo Stripe atteso non valido.");
  const currency = required("RISONIX_STRIPE_CURRENCY").toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) throw commerceError(503, "Valuta Stripe non valida.");
  const taxBehavior = required("RISONIX_STRIPE_TAX_BEHAVIOR");
  if (taxBehavior !== "inclusive") throw commerceError(503, "Il prezzo Risonix deve essere IVA inclusa.");
  return { mode, secretKey, priceId, expectedAmount, currency, taxBehavior };
}

function publicConfiguration() {
  return {
    origin: trustedHttpsUrl("RISONIX_PUBLIC_ORIGIN"),
    priceDisplay: required("RISONIX_PRICE_DISPLAY"),
    macDownload: trustedHttpsUrl("RISONIX_DOWNLOAD_MAC_URL"),
    windowsDownload: optionalTrustedHttpsUrl("RISONIX_DOWNLOAD_WINDOWS_URL"),
    sellerName: required("RISONIX_SELLER_LEGAL_NAME"),
    sellerVatId: required("RISONIX_SELLER_VAT_ID"),
    termsUrl: trustedHttpsUrl("RISONIX_TERMS_URL"),
    privacyUrl: trustedHttpsUrl("RISONIX_PRIVACY_URL"),
    refundPolicyUrl: trustedHttpsUrl("RISONIX_REFUND_POLICY_URL"),
  };
}

async function encryptionKey() {
  const bytes = fromBase64Url(required("RISONIX_ORDER_ENCRYPTION_KEY_B64"));
  if (bytes.length !== 32) throw commerceError(503, "Chiave cifratura ordini non valida.");
  return crypto.subtle.importKey("raw", asArrayBuffer(bytes), "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encrypt(value: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await encryptionKey(), encoder.encode(value));
  return `v1.${base64Url(iv)}.${base64Url(new Uint8Array(encrypted))}`;
}

async function decrypt(value: string): Promise<string> {
  const [version, encodedIv, encodedValue] = value.split(".");
  if (version !== "v1" || !encodedIv || !encodedValue) throw commerceError(500, "Dato ordine cifrato non valido.");
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: asArrayBuffer(fromBase64Url(encodedIv)) },
    await encryptionKey(),
    asArrayBuffer(fromBase64Url(encodedValue)),
  );
  return decoder.decode(decrypted);
}

async function stripeRequest(path: string, init: RequestInit, idempotencyKey?: string): Promise<StripeObject> {
  const { secretKey } = stripeConfiguration();
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${secretKey}`);
  if (idempotencyKey) headers.set("idempotency-key", idempotencyKey);
  const response = await fetch(`https://api.stripe.com/v1/${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) throw commerceError(502, "Stripe non ha accettato la richiesta.");
  return (await response.json()) as StripeObject;
}

function stringField(object: StripeObject, key: string): string | null {
  return typeof object[key] === "string" ? object[key] as string : null;
}

function numberField(object: StripeObject, key: string): number | null {
  return typeof object[key] === "number" && Number.isFinite(object[key]) ? object[key] as number : null;
}

async function recordOrderEvent(orderId: string, eventType: string, providerEventId?: string, payloadHash?: string) {
  await getDb().insert(risonixOrderEvents).values({
    id: crypto.randomUUID(),
    orderId,
    providerEventId: providerEventId ?? null,
    eventType,
    payloadHash: payloadHash ?? null,
    createdAt: Math.floor(Date.now() / 1000),
  }).onConflictDoNothing();
}

export function commerceReadiness() {
  const missing = CHECKOUT_CONFIGURATION.filter((name) => !runtimeValue(name));
  if (!missing.length) {
    try {
      stripeConfiguration();
      publicConfiguration();
    } catch (error) {
      return { ready: false, missing: [], reason: error instanceof Error ? error.message : "Configurazione non valida." };
    }
  }
  return { ready: missing.length === 0, missing, reason: missing.length ? "Configurazione commerciale non ancora completa." : null };
}

export function risonixPurchasePresentation() {
  const readiness = commerceReadiness();
  const configured = readiness.ready ? publicConfiguration() : null;
  return {
    ready: readiness.ready,
    stripeMode: runtimeValue("RISONIX_STRIPE_MODE") === "live" ? "live" : "test",
    priceDisplay: runtimeValue("RISONIX_PRICE_DISPLAY") ?? "Prezzo da configurare",
    sellerName: runtimeValue("RISONIX_SELLER_LEGAL_NAME") ?? "Venditore da configurare",
    termsUrl: configured?.termsUrl ?? null,
    privacyUrl: configured?.privacyUrl ?? null,
    refundPolicyUrl: configured?.refundPolicyUrl ?? null,
  };
}

export async function createRisonixCheckout(request: Request, customer: CustomerIdentity): Promise<string> {
  const form = await request.formData();
  if (form.get("accept_terms") !== "yes") throw commerceError(400, "Devi accettare termini e politica di rimborso.");
  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin || requestOrigin !== new URL(request.url).origin) throw commerceError(403, "Origine della richiesta non valida.");

  const { origin } = publicConfiguration();
  const { priceId } = stripeConfiguration();
  const now = Math.floor(Date.now() / 1000);
  const orderId = crypto.randomUUID();
  await getDb().insert(risonixOrders).values({
    id: orderId,
    customerUserHash: await hashRisonixUserId(customer.userId),
    customerEmailHash: await hashRisonixCustomerEmail(customer.email),
    customerEmailEncrypted: await encrypt(customer.email.trim().toLowerCase()),
    status: "created",
    emailStatus: "pending",
    createdAt: now,
    updatedAt: now,
  });
  await recordOrderEvent(orderId, "order_created");

  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/risonix/conferma?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/risonix/acquista?annullato=1`,
    client_reference_id: orderId,
    customer_email: customer.email,
    "metadata[order_id]": orderId,
    "payment_intent_data[metadata][order_id]": orderId,
  });

  try {
    const session = await stripeRequest("checkout/sessions", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    }, `risonix-checkout-${orderId}`);
    const sessionId = stringField(session, "id");
    const checkoutUrl = stringField(session, "url");
    if (!sessionId || !checkoutUrl) throw commerceError(502, "Risposta checkout incompleta.");
    await getDb().update(risonixOrders).set({
      status: "checkout_pending",
      stripeCheckoutSessionId: sessionId,
      updatedAt: Math.floor(Date.now() / 1000),
    }).where(eq(risonixOrders.id, orderId));
    await recordOrderEvent(orderId, "checkout_created");
    return checkoutUrl;
  } catch (error) {
    await getDb().update(risonixOrders).set({ status: "failed", updatedAt: Math.floor(Date.now() / 1000) }).where(eq(risonixOrders.id, orderId));
    await recordOrderEvent(orderId, "checkout_creation_failed");
    throw error;
  }
}

async function sendTransactionalEmail(to: string, subject: string, text: string, html: string, idempotencyKey: string) {
  const provider = required("RISONIX_EMAIL_PROVIDER");
  if (!/^[a-z0-9_-]{2,30}$/i.test(provider)) throw commerceError(503, "Provider email non valido.");
  const response = await fetch(trustedHttpsUrl("RISONIX_EMAIL_API_URL"), {
    method: "POST",
    headers: {
      authorization: `Bearer ${required("RISONIX_EMAIL_API_KEY")}`,
      "content-type": "application/json",
      "idempotency-key": idempotencyKey,
      "x-risonix-email-provider": provider,
    },
    body: JSON.stringify({ from: required("RISONIX_EMAIL_FROM"), to: [to], subject, text, html }),
  });
  if (!response.ok) throw commerceError(502, "Invio email transazionale non riuscito.");
}

async function verifiedCheckoutSession(sessionId: string) {
  const session = await stripeRequest(`checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items.data.price`, { method: "GET" });
  const lineItems = session.line_items as { data?: Array<{ quantity?: number; price?: { id?: string; unit_amount?: number; currency?: string; tax_behavior?: string } }> } | undefined;
  const first = lineItems?.data?.[0];
  const { priceId, expectedAmount, currency, taxBehavior } = stripeConfiguration();
  if (
    stringField(session, "mode") !== "payment" ||
    stringField(session, "payment_status") !== "paid" ||
    first?.price?.id !== priceId ||
    first?.price?.unit_amount !== expectedAmount ||
    first?.price?.currency !== currency ||
    first?.price?.tax_behavior !== taxBehavior ||
    first.quantity !== 1 ||
    numberField(session, "amount_total") !== expectedAmount ||
    stringField(session, "currency") !== currency
  ) throw commerceError(400, "Pagamento Stripe non coerente con il prodotto Risonix.");
  return session;
}

async function fulfillPaidCheckout(event: StripeObject, payloadHash: string) {
  const eventId = stringField(event, "id");
  const embedded = event.data as { object?: StripeObject } | undefined;
  const embeddedSession = embedded?.object;
  const sessionId = embeddedSession ? stringField(embeddedSession, "id") : null;
  if (!eventId || !sessionId) throw commerceError(400, "Evento checkout incompleto.");
  const session = await verifiedCheckoutSession(sessionId);
  const metadata = session.metadata as Record<string, unknown> | undefined;
  const orderId = typeof metadata?.order_id === "string" ? metadata.order_id : stringField(session, "client_reference_id");
  if (!orderId) throw commerceError(400, "Ordine Stripe non associato.");

  const db = getDb();
  const [order] = await db.select().from(risonixOrders).where(and(
    eq(risonixOrders.id, orderId),
    eq(risonixOrders.stripeCheckoutSessionId, sessionId),
  )).limit(1);
  if (!order) throw commerceError(404, "Ordine Risonix inesistente.");
  const customer = session.customer_details as { email?: unknown } | undefined;
  const email = typeof customer?.email === "string" ? customer.email : await decrypt(order.customerEmailEncrypted);
  if (await hashRisonixCustomerEmail(email) !== order.customerEmailHash) throw commerceError(403, "Email pagamento non coerente con l’ordine.");

  const now = Math.floor(Date.now() / 1000);
  const paymentIntent = stringField(session, "payment_intent");
  await db.update(risonixOrders).set({
    status: "paid",
    stripePaymentIntentId: paymentIntent,
    currency: stringField(session, "currency"),
    amountTotal: numberField(session, "amount_total"),
    paidAt: order.paidAt ?? now,
    updatedAt: now,
  }).where(eq(risonixOrders.id, order.id));

  let licenseId = order.licenseId;
  let encryptedLicenseKey = order.licenseKeyEncrypted;
  if (!licenseId || !encryptedLicenseKey) {
    const license = await createPaidRisonixLicense(order.id, email);
    licenseId = license.licenseId;
    if (license.licenseKey) encryptedLicenseKey = await encrypt(license.licenseKey);
    const [latest] = await db.select().from(risonixOrders).where(eq(risonixOrders.id, order.id)).limit(1);
    encryptedLicenseKey ??= latest?.licenseKeyEncrypted ?? null;
    await db.update(risonixOrders).set({
      licenseId,
      licenseKeyEncrypted: encryptedLicenseKey,
      status: "fulfilled",
      fulfilledAt: now,
      updatedAt: now,
    }).where(eq(risonixOrders.id, order.id));
  }
  if (!encryptedLicenseKey) throw commerceError(500, "Licenza creata ma chiave di consegna non disponibile.");

  const [latest] = await db.select().from(risonixOrders).where(eq(risonixOrders.id, order.id)).limit(1);
  if (latest?.emailStatus !== "sent") {
    const licenseKey = await decrypt(encryptedLicenseKey);
    const config = publicConfiguration();
    try {
      await sendTransactionalEmail(
        email,
        "La tua licenza Risonix",
        `Pagamento confermato. Licenza: ${licenseKey}\nMac: ${config.macDownload}${config.windowsDownload ? `\nWindows: ${config.windowsDownload}` : ""}`,
        `<h1>Risonix è pronta</h1><p>Pagamento confermato.</p><p><strong>Licenza:</strong> ${licenseKey}</p><p><a href="${config.macDownload}">Scarica per Mac</a>${config.windowsDownload ? ` · <a href="${config.windowsDownload}">Scarica per Windows</a>` : ""}</p>`,
        `risonix-license-${order.id}`,
      );
      await db.update(risonixOrders).set({ emailStatus: "sent", updatedAt: Math.floor(Date.now() / 1000) }).where(eq(risonixOrders.id, order.id));
    } catch (error) {
      await db.update(risonixOrders).set({ emailStatus: "failed", updatedAt: Math.floor(Date.now() / 1000) }).where(eq(risonixOrders.id, order.id));
      throw error;
    }
  }
  await recordOrderEvent(order.id, "payment_confirmed_and_license_fulfilled", eventId, payloadHash);
}

async function handleFullRefund(event: StripeObject, payloadHash: string) {
  const eventId = stringField(event, "id");
  const embedded = event.data as { object?: StripeObject } | undefined;
  const charge = embedded?.object;
  if (!eventId || !charge || charge.refunded !== true) return;
  const paymentIntentId = stringField(charge, "payment_intent");
  if (!paymentIntentId) throw commerceError(400, "Rimborso senza pagamento associato.");
  const db = getDb();
  const [order] = await db.select().from(risonixOrders).where(eq(risonixOrders.stripePaymentIntentId, paymentIntentId)).limit(1);
  if (!order) throw commerceError(404, "Ordine del rimborso non trovato.");
  if (order.licenseId) await disableRisonixLicenseForRefund(order.licenseId);
  const now = Math.floor(Date.now() / 1000);
  await db.update(risonixOrders).set({ status: "refunded", refundedAt: now, updatedAt: now }).where(eq(risonixOrders.id, order.id));
  const email = await decrypt(order.customerEmailEncrypted);
  await sendTransactionalEmail(
    email,
    "Rimborso Risonix confermato",
    "Il rimborso completo è stato confermato. La licenza Risonix associata all’ordine è stata disattivata.",
    "<h1>Rimborso confermato</h1><p>La licenza Risonix associata all’ordine è stata disattivata.</p>",
    `risonix-refund-email-${order.id}`,
  );
  await recordOrderEvent(order.id, "full_refund_confirmed_and_license_disabled", eventId, payloadHash);
}

async function handleExpiredCheckout(event: StripeObject, payloadHash: string) {
  const eventId = stringField(event, "id");
  const embedded = event.data as { object?: StripeObject } | undefined;
  const session = embedded?.object;
  const sessionId = session ? stringField(session, "id") : null;
  if (!eventId || !sessionId) return;
  const db = getDb();
  const [order] = await db.select().from(risonixOrders).where(eq(risonixOrders.stripeCheckoutSessionId, sessionId)).limit(1);
  if (!order || order.status !== "checkout_pending") return;
  await db.update(risonixOrders).set({ status: "cancelled", updatedAt: Math.floor(Date.now() / 1000) }).where(eq(risonixOrders.id, order.id));
  await recordOrderEvent(order.id, "checkout_expired", eventId, payloadHash);
}

export async function handleRisonixStripeWebhook(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!(await verifyStripeSignature(payload, signature, required("STRIPE_WEBHOOK_SECRET")))) {
    throw commerceError(400, "Firma webhook Stripe non valida.");
  }
  const event = JSON.parse(payload) as StripeObject;
  const eventId = stringField(event, "id");
  const eventType = stringField(event, "type");
  if (!eventId || !eventType) throw commerceError(400, "Evento Stripe non valido.");
  const [duplicate] = await getDb().select({ id: risonixOrderEvents.id }).from(risonixOrderEvents).where(eq(risonixOrderEvents.providerEventId, eventId)).limit(1);
  if (duplicate) return { duplicate: true };
  const payloadHash = await sha256(payload);
  if (eventType === "checkout.session.completed" || eventType === "checkout.session.async_payment_succeeded") {
    await fulfillPaidCheckout(event, payloadHash);
  } else if (eventType === "charge.refunded") {
    await handleFullRefund(event, payloadHash);
  } else if (eventType === "checkout.session.expired") {
    await handleExpiredCheckout(event, payloadHash);
  }
  return { duplicate: false };
}

export async function requestRisonixRefund(orderId: string) {
  const db = getDb();
  const [order] = await db.select().from(risonixOrders).where(eq(risonixOrders.id, orderId)).limit(1);
  if (!order || order.status !== "fulfilled" || !order.stripePaymentIntentId) throw commerceError(409, "Ordine non rimborsabile.");
  await stripeRequest("refunds", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ payment_intent: order.stripePaymentIntentId, reason: "requested_by_customer" }),
  }, `risonix-refund-${order.id}`);
  await recordOrderEvent(order.id, "refund_requested_from_control");
}

export async function loadRisonixCustomerOrders(customer: CustomerIdentity) {
  const userHash = await hashRisonixUserId(customer.userId);
  const emailHash = await hashRisonixCustomerEmail(customer.email);
  const rows = await getDb().select().from(risonixOrders).where(and(
    eq(risonixOrders.customerUserHash, userHash),
    eq(risonixOrders.customerEmailHash, emailHash),
  )).orderBy(desc(risonixOrders.createdAt)).limit(50);
  return rows.map((order) => ({
    id: order.id,
    status: order.status,
    price: order.amountTotal === null || !order.currency ? null : new Intl.NumberFormat("it-IT", { style: "currency", currency: order.currency.toUpperCase() }).format(order.amountTotal / 100),
    emailStatus: order.emailStatus,
    createdAt: new Date(order.createdAt * 1000).toISOString(),
    paidAt: order.paidAt ? new Date(order.paidAt * 1000).toISOString() : null,
    refundedAt: order.refundedAt ? new Date(order.refundedAt * 1000).toISOString() : null,
  }));
}

export async function loadRisonixConfirmation(sessionId: string, customer: CustomerIdentity) {
  if (!/^cs_(?:test_)?[A-Za-z0-9]+$/.test(sessionId)) return null;
  const [order] = await getDb().select().from(risonixOrders).where(and(
    eq(risonixOrders.stripeCheckoutSessionId, sessionId),
    eq(risonixOrders.customerUserHash, await hashRisonixUserId(customer.userId)),
    eq(risonixOrders.customerEmailHash, await hashRisonixCustomerEmail(customer.email)),
  )).limit(1);
  if (!order) return null;
  const config = publicConfiguration();
  return {
    id: order.id,
    status: order.status,
    emailStatus: order.emailStatus,
    licenseKey: order.status === "fulfilled" && order.licenseKeyEncrypted ? await decrypt(order.licenseKeyEncrypted) : null,
    macDownload: order.status === "fulfilled" ? config.macDownload : null,
    windowsDownload: order.status === "fulfilled" ? config.windowsDownload : null,
  };
}

export async function listRisonixOrdersForControl() {
  const orders = await getDb().select().from(risonixOrders).orderBy(desc(risonixOrders.createdAt)).limit(250);
  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    amount_total: order.amountTotal,
    currency: order.currency,
    email_status: order.emailStatus,
    license_id: order.licenseId,
    created_at: new Date(order.createdAt * 1000).toISOString(),
    paid_at: order.paidAt ? new Date(order.paidAt * 1000).toISOString() : null,
    refunded_at: order.refundedAt ? new Date(order.refundedAt * 1000).toISOString() : null,
  }));
}

export function commerceErrorResponse(error: unknown) {
  const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;
  const message = error instanceof Error && status < 500 ? error.message : "Servizio commerciale Risonix non disponibile.";
  return Response.json({ error: message }, { status });
}
