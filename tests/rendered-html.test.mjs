import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Kreluna ecosystem homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="it">/i);
  assert.match(html, /Kreluna — Creiamo prodotti per ciò che viene dopo/);
  assert.match(html, /Kreluna AI/);
  assert.match(html, /Kreluna Office/);
  assert.match(html, /Kreluna Cyber/);
  assert.match(html, /LikeCash/);
  assert.match(html, /Kreluna Token/);
  assert.match(html, /Vendita disattivata/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders the safe KRL Beta route", async () => {
  const response = await render("/krl");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /KRL Beta/);
  assert.match(html, /Base Sepolia/);
  assert.match(html, /100\.000\.000 KRL/);
  assert.match(html, /Nessun valore reale/i);
  assert.match(html, /Acquisto non disponibile/i);
  assert.match(html, /Contratto.*Non ancora pubblicato/is);
  assert.doesNotMatch(html, /Compra ora|Rendimento garantito|Prezzo di lancio/i);
});
