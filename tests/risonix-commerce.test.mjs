import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { verifyStripeSignature } from "../app/risonix/stripe-signature.ts";

test("verifies Stripe webhook signatures and rejects tampering or stale events", async () => {
  const payload = JSON.stringify({ id: "evt_test", type: "checkout.session.completed" });
  const secret = "whsec_test_only";
  const timestamp = 1_800_000_000;
  const signature = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  assert.equal(await verifyStripeSignature(payload, `t=${timestamp},v1=${signature}`, secret, timestamp), true);
  assert.equal(await verifyStripeSignature(`${payload}x`, `t=${timestamp},v1=${signature}`, secret, timestamp), false);
  assert.equal(await verifyStripeSignature(payload, `t=${timestamp},v1=${signature}`, secret, timestamp + 301), false);
});

test("keeps checkout authority server-side and fulfillment webhook-only", async () => {
  const commerce = await readFile("app/risonix/commerce.ts", "utf8");
  const checkoutPage = await readFile("app/risonix/acquista/page.tsx", "utf8");
  const environmentExample = await readFile(".env.example", "utf8");
  assert.match(commerce, /RISONIX_STRIPE_PRICE_ID/);
  assert.match(commerce, /RISONIX_SALES_ENABLED/);
  assert.match(commerce, /requireSalesEnabled\(\)/);
  assert.match(commerce, /sk_live_/);
  assert.match(commerce, /sk_test_/);
  assert.match(commerce, /rk_live_/);
  assert.match(commerce, /rk_test_/);
  assert.match(commerce, /mode !== "test" && mode !== "live"/);
  assert.match(commerce, /verifiedCheckoutSession/);
  assert.match(commerce, /createPaidRisonixLicense/);
  assert.match(commerce, /payment_confirmed_and_license_fulfilled/);
  assert.match(commerce, /full_refund_confirmed_and_license_disabled/);
  assert.doesNotMatch(checkoutPage, /sk_(?:test|live)_|whsec_/);
  assert.doesNotMatch(checkoutPage, /49[,.]00/);
  assert.match(environmentExample, /RISONIX_PRICE_DISPLAY=49,00 € IVA inclusa/);
  assert.match(environmentExample, /RISONIX_STRIPE_EXPECTED_AMOUNT=4900/);
  assert.match(environmentExample, /RISONIX_STRIPE_CURRENCY=eur/);
  assert.match(environmentExample, /RISONIX_STRIPE_TAX_BEHAVIOR=inclusive/);
  assert.match(environmentExample, /RISONIX_STRIPE_MODE=test/);
  assert.match(environmentExample, /RISONIX_SALES_ENABLED=false/);
  assert.match(commerce, /trustedHttpsUrl\("RISONIX_DOWNLOAD_WINDOWS_URL"\)/);
});

test("ships D1 order/event persistence and an idempotent provider event index", async () => {
  const migration = await readFile("drizzle/0002_worried_human_fly.sql", "utf8");
  assert.match(migration, /CREATE TABLE `risonix_orders`/);
  assert.match(migration, /CREATE TABLE `risonix_order_events`/);
  assert.match(migration, /CREATE UNIQUE INDEX `idx_risonix_order_events_provider`/);
  assert.match(migration, /`license_key_encrypted` text/);
  assert.match(migration, /`purchase_order_id` text/);
});

test("protects installer delivery behind authentication and a fulfilled order", async () => {
  const downloadRoute = await readFile("app/api/risonix/downloads/mac/route.ts", "utf8");
  const windowsDownloadRoute = await readFile("app/api/risonix/downloads/windows/route.ts", "utf8");
  const storage = await readFile("app/risonix/installer-storage.ts", "utf8");
  const hosting = JSON.parse(await readFile(".openai/hosting.json", "utf8"));
  assert.equal(hosting.r2, "FILES");
  assert.match(downloadRoute, /getChatGPTUser/);
  assert.match(downloadRoute, /hasFulfilledRisonixOrder/);
  assert.match(downloadRoute, /private, no-store/);
  assert.match(storage, /Risonix-1\.0\.0-macOS-arm64\.dmg/);
  assert.match(windowsDownloadRoute, /getChatGPTUser/);
  assert.match(windowsDownloadRoute, /hasFulfilledRisonixOrder/);
  assert.match(windowsDownloadRoute, /private, no-store/);
  assert.match(storage, /Risonix-1\.0\.0-Windows-x64\.msi/);
  assert.doesNotMatch(storage, /put\(/);
});

test("binds each license to its first device and blocks customer transfer", async () => {
  const licenseApi = await readFile("app/risonix/license-api.ts", "utf8");
  const accountPage = await readFile("app/risonix/account/page.tsx", "utf8");
  const customerReleaseRoute = await readFile("app/api/risonix/licenses/[licenseId]/release/route.ts", "utf8");
  assert.match(licenseApi, /if \(existing && \(existing\.deviceId !== deviceId \|\| existing\.devicePublicKey !== publicKey\)\)/);
  assert.match(licenseApi, /Licenza vincolata al primo dispositivo/);
  assert.doesNotMatch(licenseApi, /customerRelease/);
  assert.doesNotMatch(accountPage, /Libera questo dispositivo/);
  assert.match(customerReleaseRoute, /status: 403/);
});
