import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { editorialPages } from "../content/seo-editorial.mjs";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(projectDir, "public");
const updatedDate = "2026-08-14";
const markerStart = "<!-- KRELUNA_EDITORIAL_START -->";
const markerEnd = "<!-- KRELUNA_EDITORIAL_END -->";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cards(items) {
  return `<div class="grid editorial-grid">${items
    .map(
      ({ title, text }) =>
        `<article class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`,
    )
    .join("")}</div>`;
}

function steps(items) {
  return `<ol class="editorial-steps">${items
    .map(
      ({ title, text }) =>
        `<li><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div></li>`,
    )
    .join("")}</ol>`;
}

function bulletList(items) {
  return `<ul class="checklist">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function sourcesList(items) {
  return `<ul class="source-list">${items
    .map(
      ({ name, url, note }) =>
        `<li><a href="${escapeHtml(url)}" rel="noopener noreferrer">${escapeHtml(name)}</a>${
          note ? `<span>${escapeHtml(note)}</span>` : ""
        }</li>`,
    )
    .join("")}</ul>`;
}

function commercialBlock(page) {
  return `${markerStart}
<section class="section editorial-section" aria-labelledby="use-cases-${page.id}">
  <div class="eyebrow">${escapeHtml(page.labels.intent)}</div>
  <h2 id="use-cases-${page.id}">${escapeHtml(page.useCaseTitle)}</h2>
  <p class="intro">${escapeHtml(page.useCaseIntro)}</p>
  ${cards(page.useCases)}
</section>
<section class="section alt editorial-section" aria-labelledby="method-${page.id}">
  <div class="editorial-wide">
    <div class="eyebrow">${escapeHtml(page.labels.method)}</div>
    <h2 id="method-${page.id}">${escapeHtml(page.methodTitle)}</h2>
    <p class="intro">${escapeHtml(page.methodIntro)}</p>
    ${steps(page.steps)}
  </div>
</section>
<section class="section editorial-section" aria-labelledby="governance-${page.id}">
  <div class="split">
    <div>
      <div class="eyebrow">${escapeHtml(page.labels.governance)}</div>
      <h2 id="governance-${page.id}">${escapeHtml(page.governanceTitle)}</h2>
      <p class="intro">${escapeHtml(page.governanceText)}</p>
    </div>
    ${bulletList(page.governanceItems)}
  </div>
</section>
<section class="section editorial-section" aria-labelledby="measure-${page.id}">
  <div class="eyebrow">${escapeHtml(page.labels.measure)}</div>
  <h2 id="measure-${page.id}">${escapeHtml(page.measureTitle)}</h2>
  <p class="intro">${escapeHtml(page.measureIntro)}</p>
  ${cards(page.measures)}
</section>
<section class="section editorial-section" aria-labelledby="questions-${page.id}">
  <div class="eyebrow">${escapeHtml(page.labels.questions)}</div>
  <h2 id="questions-${page.id}">${escapeHtml(page.questionsTitle)}</h2>
  ${cards(page.faq)}
</section>
<section class="section editorial-sources" aria-labelledby="sources-${page.id}">
  <h2 id="sources-${page.id}">${escapeHtml(page.sourcesTitle)}</h2>
  <p class="intro">${escapeHtml(page.sourcesIntro)}</p>
  ${sourcesList(page.sources)}
  <p class="source-note">${escapeHtml(page.sourceDisclaimer)}</p>
</section>
${markerEnd}`;
}

function editorialBlock(page) {
  return `${markerStart}
<section class="section editorial-section" aria-labelledby="focus-${page.id}">
  <div class="eyebrow">${escapeHtml(page.labels.intent)}</div>
  <h2 id="focus-${page.id}">${escapeHtml(page.useCaseTitle)}</h2>
  <p class="intro">${escapeHtml(page.useCaseIntro)}</p>
  ${cards(page.useCases)}
</section>
<section class="section alt editorial-section" aria-labelledby="method-${page.id}">
  <div class="editorial-wide">
    <div class="eyebrow">${escapeHtml(page.labels.method)}</div>
    <h2 id="method-${page.id}">${escapeHtml(page.methodTitle)}</h2>
    <p class="intro">${escapeHtml(page.methodIntro)}</p>
    ${steps(page.steps)}
  </div>
</section>
<section class="section editorial-section" aria-labelledby="questions-${page.id}">
  <div class="eyebrow">${escapeHtml(page.labels.questions)}</div>
  <h2 id="questions-${page.id}">${escapeHtml(page.questionsTitle)}</h2>
  ${cards(page.faq)}
</section>
${page.sources?.length ? `<section class="section editorial-sources" aria-labelledby="sources-${page.id}"><h2 id="sources-${page.id}">${escapeHtml(page.sourcesTitle)}</h2><p class="intro">${escapeHtml(page.sourcesIntro)}</p>${sourcesList(page.sources)}<p class="source-note">${escapeHtml(page.sourceDisclaimer)}</p></section>` : ""}
${markerEnd}`;
}

function articleBlock(page) {
  return `${markerStart}
<section class="article-section editorial-section" aria-labelledby="decision-${page.id}">
  <div class="eyebrow">${escapeHtml(page.labels.method)}</div>
  <h2 id="decision-${page.id}">${escapeHtml(page.methodTitle)}</h2>
  <p>${escapeHtml(page.methodIntro)}</p>
  ${steps(page.steps)}
</section>
<section class="article-section editorial-section" aria-labelledby="questions-${page.id}">
  <div class="eyebrow">${escapeHtml(page.labels.questions)}</div>
  <h2 id="questions-${page.id}">${escapeHtml(page.questionsTitle)}</h2>
  <div class="article-faq">${page.faq
    .map(({ title, text }) => `<details><summary>${escapeHtml(title)}</summary><p>${escapeHtml(text)}</p></details>`)
    .join("")}</div>
</section>
${markerEnd}`;
}

function updateMeta(html, page) {
  let result = html
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/i,
      `<meta name="description" content="${escapeHtml(page.description)}">`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*">/i,
      `<meta property="og:title" content="${escapeHtml(page.title)}">`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*">/i,
      `<meta property="og:description" content="${escapeHtml(page.description)}">`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*">/i,
      `<meta name="twitter:title" content="${escapeHtml(page.title)}">`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*">/i,
      `<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
    );

  if (!/hreflang="x-default"/i.test(result)) {
    result = result.replace(
      /(<link rel="alternate" hreflang="en" href="[^"]+">)/i,
      `$1<link rel="alternate" hreflang="x-default" href="${escapeHtml(page.xDefault)}">`,
    );
  }

  result = result.replace(/href="\/assets\/seo\.css"/g, 'href="/assets/seo-20260814.css"');
  return result;
}

function updateStructuredData(html, page) {
  return html.replace(
    /<script type="application\/ld\+json">([^<]+)<\/script>/i,
    (full, raw) => {
      const data = JSON.parse(raw);
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [];
      for (const entry of graph) {
        if (["WebPage", "AboutPage", "ContactPage", "CollectionPage", "Article"].includes(entry["@type"])) {
          entry.dateModified = updatedDate;
          if (entry["@type"] !== "Article") entry.description = page.description;
        }
      }
      const filtered = graph.filter((entry) => entry["@type"] !== "FAQPage" && entry["@type"] !== "Service");
      if (page.kind === "commercial") {
        filtered.push({
          "@type": "Service",
          "@id": `${page.canonical}#service`,
          name: page.serviceName,
          description: page.description,
          provider: { "@id": "https://www.kreluna.it/#organization" },
          audience: { "@type": "Audience", audienceType: page.audience },
          url: page.canonical,
        });
      }
      filtered.push({
        "@type": "FAQPage",
        "@id": `${page.canonical}#faq`,
        mainEntity: page.faq.map(({ title, text }) => ({
          "@type": "Question",
          name: title,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      });
      data["@graph"] = filtered;
      return `<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
    },
  );
}

for (const page of editorialPages) {
  const filename = path.join(publicDir, page.file);
  let html = await readFile(filename, "utf8");
  html = html.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, "g"), "");
  html = updateMeta(html, page);
  html = updateStructuredData(html, page);
  if (page.kind === "article") {
    html = html
      .replace(
        /<meta property="article:modified_time" content="[^"]+">/i,
        `<meta property="article:modified_time" content="${updatedDate}">`,
      )
      .replace(
        "Pubblicata e verificata il 12 agosto 2026 · Lettura 10–12 minuti",
        "Pubblicata il 12 agosto 2026 · Aggiornata il 14 agosto 2026 · Lettura 14–16 minuti",
      )
      .replace(
        "Published and reviewed 12 August 2026 · 10–12 min read",
        "Published 12 August 2026 · Updated 14 August 2026 · 14–16 min read",
      );
  }

  const block = page.kind === "commercial" ? commercialBlock(page) : page.kind === "article" ? articleBlock(page) : editorialBlock(page);
  const insertionPoint = page.kind === "article" ? "<section class=\"article-section sources\"" : "</main>";
  if (!html.includes(insertionPoint)) throw new Error(`Insertion point missing in ${page.file}`);
  html = html.replace(insertionPoint, `${block}${insertionPoint}`);
  await writeFile(filename, `${html.trim()}\n`);
}

const notFoundPath = path.join(publicDir, "404.html");
let notFoundHtml = await readFile(notFoundPath, "utf8");
notFoundHtml = notFoundHtml
  .replace(
    '<a class="skip-link" href="#main">Vai al contenuto</a><a class="skip-link" href="#main">Vai al contenuto</a>',
    '<a class="skip-link" href="#main">Vai al contenuto</a>',
  )
  .replace('href="/assets/seo.css"', 'href="/assets/seo-20260814.css"');
await writeFile(notFoundPath, `${notFoundHtml.trim()}\n`);

console.log(`Enhanced ${editorialPages.length} SEO pages.`);
