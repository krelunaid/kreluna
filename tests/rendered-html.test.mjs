import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
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
  assert.match(html, /<html lang="it-IT">/i);
  assert.match(html, /Kreluna \| AI, automazione e cybersecurity/);
  assert.match(html, /Kreluna AI/);
  assert.match(html, /Kreluna Office/);
  assert.match(html, /Kreluna Cyber/);
  assert.match(html, /Velvet Tablet/);
  assert.doesNotMatch(html, /LikeCash/i);
  assert.match(html, /Kreluna Token/);
  assert.match(html, /Vendita disattivata/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.kreluna\.it\/"/i);
  assert.match(html, /hreflang="it" href="https:\/\/www\.kreluna\.it\/"/i);
  assert.match(html, /hreflang="en" href="https:\/\/www\.kreluna\.it\/en\/"/i);
  assert.match(html, /hreflang="x-default" href="https:\/\/www\.kreluna\.it\/"/i);
  assert.match(html, /name="robots" content="index, follow"/i);
  assert.match(html, /property="og:image" content="https:\/\/www\.kreluna\.it\/og-kreluna\.jpg"/i);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
  assert.match(html, /rel="preload" href="\/fonts\/space-grotesk-latin\.woff2" as="font"/i);
  assert.match(html, /<script id="kreluna-structured-data" type="application\/ld\+json">/i);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /<img src="\/kreluna-logo\.png" alt="" width="128" height="128"/i);
  assert.match(html, /href="https:\/\/www\.kreluna\.it\/en\/" hreflang="en" lang="en"/i);
  assert.match(html, /href="https:\/\/www\.kreluna\.it\/intelligenza-artificiale-aziende\.html"/i);
  assert.match(html, /href="https:\/\/www\.kreluna\.it\/ai-studi-professionali\.html"/i);
  assert.match(html, /href="https:\/\/cra24\.kreluna\.it\/"/i);
  assert.match(html, /class="skip-link" href="#main-content"/i);
  assert.match(html, /<main id="main-content">/i);
  assert.match(html, /AI Act — testo ufficiale/i);
  assert.equal((html.match(/<title>/gi) ?? []).length, 1);
  assert.equal((html.match(/<meta name="description"/gi) ?? []).length, 1);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.doesNotMatch(html, /andreagadducci\.chatgpt\.site/i);

  const jsonLdMatch = html.match(
    /<script id="kreluna-structured-data" type="application\/ld\+json">([^<]+)<\/script>/i,
  );
  assert.ok(jsonLdMatch);
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  const graphTypes = jsonLd["@graph"].map((entry) => entry["@type"]);
  assert.deepEqual(graphTypes, ["Organization", "WebSite", "WebPage", "FAQPage"]);
  assert.equal(jsonLd["@graph"][0]["@id"], "https://www.kreluna.it/#organization");

  const ids = new Set(
    [...html.matchAll(/\sid="([^"]+)"/gi)].map((match) => match[1]),
  );
  const localFragments = [...html.matchAll(/href="#([^"]+)"/gi)].map(
    (match) => match[1],
  );
  for (const fragment of localFragments) assert.ok(ids.has(fragment), `Missing #${fragment}`);
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
  assert.match(html, /name="robots" content="noindex, nofollow"/i);
  assert.doesNotMatch(html, /Compra ora|Rendimento garantito|Prezzo di lancio/i);
});

test("publishes a crawlable robots policy", async () => {
  const response = await render("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain\b/i);

  const robots = await response.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.match(robots, /Sitemap: https:\/\/www\.kreluna\.it\/sitemap\.xml/i);
});

test("publishes canonical localized URLs in the sitemap", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /(?:application|text)\/xml/i);

  const sitemap = await response.text();
  assert.equal((sitemap.match(/<url>/gi) ?? []).length, 28);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/en\/<\/loc>/i);
  assert.match(sitemap, /hreflang="it" href="https:\/\/www\.kreluna\.it\/"/i);
  assert.match(sitemap, /hreflang="en" href="https:\/\/www\.kreluna\.it\/en\/"/i);
  assert.match(sitemap, /hreflang="x-default" href="https:\/\/www\.kreluna\.it\/"/i);
  assert.doesNotMatch(sitemap, /kreluna-ai/i);
  assert.doesNotMatch(sitemap, /privacy|termini|cookie/i);
  assert.doesNotMatch(sitemap, /andreagadducci\.chatgpt\.site|<loc>[^<]*#/i);
});

test("ships lightweight, production-ready discovery assets", async () => {
  const manifest = JSON.parse(await readFile("public/site.webmanifest", "utf8"));
  assert.equal(manifest.lang, "it-IT");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.icons[0].src, "/favicon-192.png");
  assert.equal(manifest.icons[1].src, "/favicon-512.png");

  const socialImage = await stat("public/og-kreluna.jpg");
  assert.ok(socialImage.size < 250_000, `Social image is ${socialImage.size} bytes`);
});
