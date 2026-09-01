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
  assert.match(html, /<html lang="it-IT"/i);
  assert.match(html, /Kreluna \| Software, automazione e progetti digitali/);
  assert.match(html, /Tecnologia utile/);
  assert.match(html, /Progetti che prendono forma/);
  assert.match(html, /CityBeam/);
  assert.match(html, /Velvet Table/);
  assert.match(html, /href="\/progetti"/);
  assert.doesNotMatch(html, /Kreluna AI|Kreluna Office|Kreluna Cyber|Risonix/i);
  assert.doesNotMatch(html, /Velvet Tablet/i);
  assert.doesNotMatch(html, /LikeCash/i);
  assert.doesNotMatch(html, /Kreluna Token|KRL Beta|Vendita disattivata/i);
  assert.match(html, /rel="canonical" href="https:\/\/www\.kreluna\.it"/i);
  assert.match(html, /hreflang="it" href="https:\/\/www\.kreluna\.it"/i);
  assert.match(html, /hreflang="x-default" href="https:\/\/www\.kreluna\.it"/i);
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
  assert.match(html, /class="skip-link" href="#main-content"/i);
  assert.match(html, /<main id="main-content">/i);
  assert.match(html, /Kreluna/i);
  assert.match(html, /02114130475/);
  assert.match(html, /PT-622714/);
  assert.match(html, /P\. IVA 02114130475/i);
  assert.doesNotMatch(html, /Reine/i);
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

test("keeps the retired KRL Beta route unavailable", async () => {
  const response = await render("/krl");
  assert.equal(response.status, 404);
});

test("renders the dedicated Velvet Table concept page", async () => {
  const response = await render("/velvet-table");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /La sera, scelta/i);
  assert.match(html, /Velvet Table non è ancora un servizio attivo/i);
  assert.match(html, /id="lista-attesa"/i);
  assert.match(html, /Sono un cliente/i);
  assert.match(html, /Sono un ristoratore/i);
  assert.match(html, /Avvisami al lancio/i);
  assert.match(html, /Informativa privacy/i);
  assert.match(html, /src="\/velvet-table\/hero\.jpg"/i);
  assert.match(html, /src="\/velvet-table\/view-window\.jpg"/i);
  assert.match(html, /src="\/velvet-table\/garden-restaurant\.jpg"/i);
  assert.match(html, /Il ristorante giusto per la serata che immagini/i);
  assert.match(html, /Serata romantica/i);
  assert.match(html, /Primo appuntamento/i);
  assert.match(html, /Anniversario e occasioni speciali/i);
  assert.match(html, /Cena in giardino/i);
  assert.match(html, /Criteri leggibili, non etichette decorative/i);
  assert.match(html, /Disponibilità, caratteristiche del tavolo e condizioni di prenotazione/i);
  assert.match(html, /property="og:image" content="https:\/\/www\.kreluna\.it\/velvet-table\/og\.jpg"/i);
  assert.match(html, /rel="canonical" href="https:\/\/www\.kreluna\.it\/velvet-table"/i);
  assert.equal((html.match(/rel="canonical"/gi) ?? []).length, 1);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"ItemList"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"taxID":"02114130475"/);
  assert.doesNotMatch(html, /created-with|Created with|Helix/i);
  assert.doesNotMatch(html, /kreluna-ecosistema\.andreagadducci\.chatgpt\.site/i);
  assert.doesNotMatch(html, /LikeCash|KRL Beta/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});

test("renders localized Velvet Table pages with reciprocal language signals", async () => {
  const pages = [
    ["/en/velvet-table", "First date", "en-GB"],
    ["/fr/velvet-table", "Premier rendez-vous", "fr-FR"],
    ["/es/velvet-table", "Primera cita", "es-ES"],
    ["/de/velvet-table", "Erstes Date", "de-DE"],
  ];
  for (const [path, phrase, locale] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp(phrase, "i"));
    assert.match(html, new RegExp(`lang="${locale}"`, "i"));
    assert.match(html, /hreflang="it"/i);
    assert.match(html, /hreflang="en"/i);
    assert.match(html, /hreflang="fr"/i);
    assert.match(html, /hreflang="es"/i);
    assert.match(html, /hreflang="de"/i);
    assert.match(html, /hreflang="x-default"/i);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  }
});

test("renders CityBeam in five languages with complete reciprocal SEO signals", async () => {
  const pages = [
    ["/citybeam", "Il tuo momento sui grandi schermi", "it-IT", "it_IT"],
    ["/en/citybeam", "Your moment on the world’s biggest screens", "en-GB", "en_GB"],
    ["/fr/citybeam", "Votre moment sur les plus grands écrans", "fr-FR", "fr_FR"],
    ["/es/citybeam", "Tu momento en las pantallas más grandes", "es-ES", "es_ES"],
    ["/de/citybeam", "Dein Moment auf den größten Bildschirmen", "de-DE", "de_DE"],
  ];

  for (const [path, phrase, language, ogLocale] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${language}"`, "i"));
    assert.match(html, new RegExp(phrase, "i"));
    assert.match(html, new RegExp(`rel="canonical" href="https://www\\.kreluna\\.it${path}"`, "i"));
    assert.match(html, new RegExp(`property="og:locale" content="${ogLocale}"`, "i"));
    assert.match(html, /name="robots" content="index, follow"/i);
    for (const locale of ["it", "en", "fr", "es", "de", "x-default"]) {
      assert.match(html, new RegExp(`hreflang="${locale}"`, "i"));
    }
    assert.match(html, /<script id="citybeam-structured-data" type="application\/ld\+json">/i);
    assert.match(html, /"@type":"Service"/);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  }
});

test("renders localized project hubs without exposing inactive projects", async () => {
  const pages = [["/en", "en-GB"], ["/fr", "fr-FR"], ["/es", "es-ES"], ["/de", "de-DE"]];
  for (const [path, language] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp(`<html lang="${language}"`, "i"));
    assert.match(html, /CityBeam/i);
    assert.match(html, /Velvet Table/i);
    assert.match(html, /hreflang="it"/i);
    assert.match(html, /hreflang="en"/i);
    assert.match(html, /hreflang="fr"/i);
    assert.match(html, /hreflang="es"/i);
    assert.match(html, /hreflang="de"/i);
    assert.doesNotMatch(html, /Kreluna AI|Kreluna Office|Kreluna Cyber|Risonix|Helix/i);
  }
});

test("renders the Velvet Table restaurant acquisition page", async () => {
  const response = await render("/en/velvet-table/restaurants");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Coming soon · for restaurants/i);
  assert.match(html, /Let guests book normally/i);
  assert.match(html, /Planned U\.S\. customer price: \$15/i);
  assert.match(html, /Keep the full \$15 for your first 12 months/i);
  assert.match(html, /\$15 restaurant · \$0 Kreluna/i);
  assert.match(html, /\$12 restaurant · \$3 Kreluna/i);
  assert.match(html, /No table-selection fee/i);
  assert.match(html, /Join restaurant early access/i);
  assert.match(html, /audienceType":"Restaurant owners and managers"/i);
  assert.match(html, /rel="canonical" href="https:\/\/www\.kreluna\.it\/en\/velvet-table\/restaurants"/i);
  assert.match(html, /name="robots" content="noindex, follow"/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});

test("publishes a noindex Founding 100 program summary", async () => {
  const response = await render("/en/velvet-table/restaurants/founding-100");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Velvet Table[\s\S]*Founding 100/i);
  assert.match(html, /Twelve consecutive months/i);
  assert.match(html, /\$15 restaurant/i);
  assert.match(html, /\$0 Kreluna platform fee/i);
  assert.match(html, /name="robots" content="noindex, follow"/i);
  assert.match(html, /property="og:url" content="https:\/\/www\.kreluna\.it\/en\/velvet-table\/restaurants\/founding-100"/i);
  assert.match(html, /property="og:locale" content="en_US"/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});

test("links the English Velvet Table concept to the restaurant landing", async () => {
  const response = await render("/en/velvet-table");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /href="\/en\/velvet-table\/restaurants"[^>]*>For restaurants</i);
});

test("publishes a crawlable robots policy", async () => {
  const response = await render("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain\b/i);

  const robots = await response.text();
  assert.match(robots, /User-Agent: OAI-SearchBot[\s\S]*Allow: \//i);
  assert.match(robots, /User-Agent: GPTBot[\s\S]*Allow: \//i);
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.match(robots, /Sitemap: https:\/\/www\.kreluna\.it\/sitemap\.xml/i);
});

test("publishes canonical localized URLs in the sitemap", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /(?:application|text)\/xml/i);

  const sitemap = await response.text();
  assert.equal((sitemap.match(/<url>/gi) ?? []).length, 48);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/en<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/fr<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/es<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/de<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/velvet-table<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/fr\/velvet-table<\/loc>/i);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.kreluna\.it\/en\/velvet-table\/restaurants<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/progetti<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/citybeam<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/www\.kreluna\.it\/de\/citybeam<\/loc>/i);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.kreluna\.it\/risonix<\/loc>/i);
  assert.doesNotMatch(sitemap, /cybersecurity|sme-cybersecurity/i);
  assert.match(sitemap, /hreflang="de" href="https:\/\/www\.kreluna\.it\/de\/velvet-table"/i);
  assert.match(sitemap, /hreflang="it" href="https:\/\/www\.kreluna\.it"/i);
  assert.match(sitemap, /hreflang="en" href="https:\/\/www\.kreluna\.it\/en"/i);
  assert.match(sitemap, /hreflang="x-default" href="https:\/\/www\.kreluna\.it"/i);
  assert.doesNotMatch(sitemap, /kreluna-ai/i);
  assert.doesNotMatch(sitemap, /privacy|termini|cookie/i);
  assert.doesNotMatch(sitemap, /<loc>[^<]*#/i);
});

test("ships lightweight, production-ready discovery assets", async () => {
  const manifest = JSON.parse(await readFile("public/site.webmanifest", "utf8"));
  assert.equal(manifest.lang, "it-IT");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.icons[0].src, "/favicon-192.png");
  assert.equal(manifest.icons[1].src, "/favicon-512.png");

  const socialImage = await stat("public/og-kreluna.jpg");
  assert.ok(socialImage.size < 250_000, `Social image is ${socialImage.size} bytes`);

  const indexNowPayload = JSON.parse(await readFile("public/indexnow-urls.json", "utf8"));
  assert.equal(indexNowPayload.host, "www.kreluna.it");
  assert.equal(indexNowPayload.urlList.length, 48);
  assert.equal(new Set(indexNowPayload.urlList).size, 48);
  assert.ok(indexNowPayload.urlList.includes("https://www.kreluna.it"));
  for (const locale of ["", "en/", "fr/", "es/", "de/"]) {
    assert.ok(indexNowPayload.urlList.includes(`https://www.kreluna.it/${locale}velvet-table`));
  }
  for (const locale of ["en", "fr", "es", "de"]) {
    assert.ok(indexNowPayload.urlList.includes(`https://www.kreluna.it/${locale}`));
  }
  assert.ok(!indexNowPayload.urlList.includes("https://www.kreluna.it/en/velvet-table/restaurants"));
  for (const locale of ["", "en/", "fr/", "es/", "de/"]) {
    assert.ok(indexNowPayload.urlList.includes(`https://www.kreluna.it/${locale}citybeam`));
  }
  assert.ok(indexNowPayload.urlList.includes("https://www.kreluna.it/progetti"));
  assert.ok(!indexNowPayload.urlList.includes("https://www.kreluna.it/risonix"));
  assert.ok(indexNowPayload.urlList.every((url) => !/cybersecurity/i.test(url)));
});
