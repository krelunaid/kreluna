import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const clientDir = path.resolve("dist/client");
const pages = [
  "en/index.html",
  "intelligenza-artificiale-aziende.html",
  "en/ai-for-business.html",
  "ai-studi-professionali.html",
  "en/ai-for-professional-services.html",
  "automazione-processi-aziendali.html",
  "en/business-process-automation.html",
  "cybersecurity-pmi-studi-professionali.html",
  "en/cybersecurity-smes-professional-firms.html",
  "azienda.html",
  "en/about.html",
  "contatti.html",
  "en/contact.html",
  "ai-per-commercialisti.html",
  "en/ai-for-accounting-firms.html",
  "ai-per-studi-legali.html",
  "en/ai-for-law-firms.html",
  "ai-consulenti-del-lavoro.html",
  "en/ai-for-payroll-hr-consultancies.html",
  "risorse.html",
  "en/resources.html",
  "ai-studi-professionali-dati-riservati.html",
  "en/ai-professional-services-confidential-data.html",
  "processi-aziendali-da-automatizzare.html",
  "en/which-business-processes-to-automate-first.html",
  "cybersecurity-pmi-phishing-ransomware-backup.html",
  "en/sme-cybersecurity-essentials.html",
];

function matchOne(html, expression, label) {
  const matches = [...html.matchAll(expression)];
  assert.equal(matches.length, 1, `${label}: expected one, found ${matches.length}`);
  return matches[0][1];
}

function visibleWordCount(html) {
  return html
    .replace(/<(?:script|style|nav|footer)\b[\s\S]*?<\/(?:script|style|nav|footer)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

test("ships every bilingual SEO page from versioned source", async () => {
  assert.equal(pages.length, 27);
  await Promise.all(pages.map((page) => access(path.join(clientDir, page))));
  await access(path.join(clientDir, "assets/seo-20260814.css"));
  await access(path.join(clientDir, ".htaccess"));
});

test("keeps metadata, language clusters, content and structured data valid", async () => {
  const titles = new Set();
  const descriptions = new Set();

  for (const page of pages) {
    const html = await readFile(path.join(clientDir, page), "utf8");
    const title = matchOne(html, /<title>([^<]+)<\/title>/gi, `${page} title`);
    const description = matchOne(
      html,
      /<meta name="description" content="([^"]+)">/gi,
      `${page} description`,
    );
    const canonical = matchOne(
      html,
      /<link rel="canonical" href="([^"]+)">/gi,
      `${page} canonical`,
    );
    const xDefault = matchOne(
      html,
      /<link rel="alternate" hreflang="x-default" href="([^"]+)">/gi,
      `${page} x-default`,
    );

    assert.ok(canonical.startsWith("https://www.kreluna.it/"), `${page} canonical origin`);
    assert.ok(xDefault.startsWith("https://www.kreluna.it/"), `${page} x-default origin`);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${page} H1`);
    assert.equal((html.match(/KRELUNA_EDITORIAL_START/g) ?? []).length, 1, `${page} editorial block`);
    assert.match(html, /href="\/assets\/seo-20260814\.css"/i, `${page} stylesheet`);
    assert.match(html, /<a class="skip-link" href="#main">/i, `${page} skip link`);
    assert.ok(visibleWordCount(html) >= 430, `${page} is too thin`);
    assert.ok(!titles.has(title), `Duplicate title: ${title}`);
    assert.ok(!descriptions.has(description), `Duplicate description: ${description}`);
    titles.add(title);
    descriptions.add(description);

    const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/gi)];
    assert.ok(jsonLdBlocks.length >= 1, `${page} JSON-LD`);
    const nodes = jsonLdBlocks.flatMap((match) => {
      const parsed = JSON.parse(match[1]);
      return Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
    });
    assert.ok(nodes.some((node) => node["@type"] === "FAQPage"), `${page} FAQPage`);
    const pageNode = nodes.find((node) =>
      ["WebPage", "AboutPage", "ContactPage", "CollectionPage"].includes(node["@type"]),
    );
    assert.ok(pageNode, `${page} page schema`);
    assert.equal(pageNode.dateModified, "2026-08-14", `${page} dateModified`);
    if (nodes.some((node) => node["@type"] === "Article")) {
      assert.match(
        html,
        /property="article:modified_time" content="2026-08-14"/i,
        `${page} article modified time`,
      );
    }
  }
});

test("ships the redirect, security, cache, compression and MIME policy", async () => {
  const rules = await readFile(path.join(clientDir, ".htaccess"), "utf8");
  assert.match(rules, /\^en\\\.html\$/);
  assert.match(rules, /\^in-arrivo\\\.html\$/);
  assert.match(rules, /\^kreluna-ai/);
  assert.match(rules, /Strict-Transport-Security/);
  assert.match(rules, /Content-Security-Policy/);
  assert.match(rules, /X-Content-Type-Options/);
  assert.match(rules, /max-age=31536000, immutable/);
  assert.match(rules, /BROTLI_COMPRESS|DEFLATE/);
  assert.match(rules, /application\/manifest\+json \.webmanifest/);
  assert.match(rules, /text\/x-component \.rsc/);
});
