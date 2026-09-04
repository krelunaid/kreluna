import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "content/guides/come-scegliere-professionista-web.md");
const source = await readFile(sourcePath, "utf8");
const siteUrl = "https://www.kreluna.it";
const imageUrl = `${siteUrl}/assets/guide-scegliere-professionista-web.png`;
const published = "2026-08-28";

const languages = [
  {
    section: "Italiano",
    code: "it",
    htmlLang: "it-IT",
    locale: "it_IT",
    route: "/it/guide/come-scegliere-professionista-sito-web/",
    output: "public/it/guide/come-scegliere-professionista-sito-web/index.html",
    seoTitle: "Come scegliere un professionista per il sito web | Kreluna",
    description: "Una guida pratica per confrontare professionisti web, preventivi, portfolio, proprietà degli account, accessibilità e assistenza.",
    eyebrow: "Guida · Sviluppo web",
    resources: "/risorse.html",
    resourcesLabel: "Risorse",
    marketplaceLabel: "Marketplace",
    homeLabel: "Kreluna",
    authorLabel: "A cura di Kreluna",
    alt: "Titolare di una piccola impresa e professionista web esaminano insieme un progetto digitale.",
  },
  {
    section: "English",
    code: "en",
    htmlLang: "en-GB",
    locale: "en_GB",
    route: "/en/guides/how-to-choose-a-website-professional/",
    output: "public/en/guides/how-to-choose-a-website-professional/index.html",
    seoTitle: "How to choose a reliable website professional | Kreluna",
    description: "A practical guide to comparing web professionals, proposals, portfolios, account ownership, accessibility and ongoing support.",
    eyebrow: "Guide · Web development",
    resources: "/en/resources.html",
    resourcesLabel: "Resources",
    marketplaceLabel: "Marketplace",
    homeLabel: "Kreluna",
    authorLabel: "Published by Kreluna",
    alt: "A small-business owner and a web professional review a digital project together.",
  },
  {
    section: "Español",
    code: "es",
    htmlLang: "es",
    locale: "es_ES",
    route: "/es/guias/como-elegir-profesional-pagina-web/",
    output: "public/es/guias/como-elegir-profesional-pagina-web/index.html",
    seoTitle: "Cómo elegir un profesional para crear tu web | Kreluna",
    description: "Guía práctica para comparar profesionales web, presupuestos, portfolios, propiedad de cuentas, accesibilidad y mantenimiento.",
    eyebrow: "Guía · Desarrollo web",
    resources: "/risorse.html",
    resourcesLabel: "Guías",
    marketplaceLabel: "Marketplace",
    homeLabel: "Kreluna",
    authorLabel: "Publicado por Kreluna",
    alt: "Una persona propietaria de una pequeña empresa revisa un proyecto con un profesional web.",
  },
  {
    section: "Français",
    code: "fr",
    htmlLang: "fr",
    locale: "fr_FR",
    route: "/fr/guides/choisir-professionnel-creation-site-internet/",
    output: "public/fr/guides/choisir-professionnel-creation-site-internet/index.html",
    seoTitle: "Choisir un professionnel pour créer son site web | Kreluna",
    description: "Une méthode pratique pour comparer prestataires web, devis, portfolios, propriété des comptes, accessibilité et maintenance.",
    eyebrow: "Guide · Développement web",
    resources: "/risorse.html",
    resourcesLabel: "Guides",
    marketplaceLabel: "Marketplace",
    homeLabel: "Kreluna",
    authorLabel: "Publié par Kreluna",
    alt: "Une dirigeante de petite entreprise examine un projet numérique avec un professionnel du web.",
  },
  {
    section: "Deutsch",
    code: "de",
    htmlLang: "de",
    locale: "de_DE",
    route: "/de/ratgeber/zuverlaessigen-webentwickler-auswaehlen/",
    output: "public/de/ratgeber/zuverlaessigen-webentwickler-auswaehlen/index.html",
    seoTitle: "Einen zuverlässigen Website-Profi auswählen | Kreluna",
    description: "Praxisleitfaden zum Vergleich von Webprofis, Angeboten, Referenzen, Kontoinhaberschaft, Barrierefreiheit und Betreuung.",
    eyebrow: "Ratgeber · Webentwicklung",
    resources: "/risorse.html",
    resourcesLabel: "Ratgeber",
    marketplaceLabel: "Marketplace",
    homeLabel: "Kreluna",
    authorLabel: "Herausgegeben von Kreluna",
    alt: "Inhaberin eines kleinen Unternehmens bespricht ein digitales Projekt mit einem Webprofi.",
  },
];

const alternates = Object.fromEntries(languages.map((language) => [language.code, `${siteUrl}${language.route}`]));

function extractSection(name) {
  const start = source.indexOf(`## ${name}\n`);
  if (start < 0) throw new Error(`Missing language section: ${name}`);
  const afterHeading = start + `## ${name}\n`.length;
  const next = source.indexOf("\n---\n\n## ", afterHeading);
  return source.slice(afterHeading, next < 0 ? source.length : next).trim();
}

function inline(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function markdownToHtml(markdown) {
  const firstTitle = markdown.match(/^# (.+)$/m);
  if (!firstTitle) throw new Error("Article title missing");
  const title = firstTitle[1].trim();
  const body = markdown.slice(firstTitle.index + firstTitle[0].length).trim();
  const lines = body.split("\n");
  const html = [];
  let list = null;
  let sectionOpen = false;
  const closeList = () => {
    if (list) html.push(`</${list}>`);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      if (sectionOpen) html.push("</section>");
      const heading = line.slice(3);
      html.push(`<section class="article-section"><h2 id="${slugify(heading)}">${inline(heading)}</h2>`);
      sectionOpen = true;
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("- ")) {
      if (list !== "ul") {
        closeList();
        list = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    const numbered = line.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      if (list !== "ol") {
        closeList();
        list = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${inline(numbered[1])}</li>`);
      continue;
    }
    closeList();
    html.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  if (sectionOpen) html.push("</section>");
  return { title, html: html.join("\n") };
}

function cleanSection(section) {
  const titleIndex = section.indexOf("\n# ");
  if (titleIndex < 0) throw new Error("Unable to locate article body");
  return section.slice(titleIndex + 1);
}

function languageLinks(current) {
  return languages.map((language) => `<a${language.code === current.code ? ' aria-current="page"' : ""} href="${language.route}">${language.code.toUpperCase()}</a>`).join("");
}

function buildPage(language, article) {
  const canonical = `${siteUrl}${language.route}`;
  const hreflang = languages.map((item) => `<link rel="alternate" hreflang="${item.code}" href="${siteUrl}${item.route}">`).join("");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Kreluna", url: `${siteUrl}/`, logo: { "@type": "ImageObject", url: `${siteUrl}/assets/logo.png` } },
      { "@type": "Article", "@id": `${canonical}#article`, headline: article.title, description: language.description, datePublished: published, dateModified: published, inLanguage: language.code, mainEntityOfPage: canonical, author: { "@id": `${siteUrl}/#organization` }, publisher: { "@id": `${siteUrl}/#organization` }, image: imageUrl, articleSection: "Web development", isAccessibleForFree: true },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kreluna", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: language.resourcesLabel, item: `${siteUrl}${language.resources}` },
        { "@type": "ListItem", position: 3, name: article.title, item: canonical },
      ] },
    ],
  };

  return `<!doctype html><html lang="${language.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${language.seoTitle}</title><meta name="description" content="${language.description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}">${hreflang}<link rel="alternate" hreflang="x-default" href="${alternates.it}"><meta property="og:type" content="article"><meta property="og:site_name" content="Kreluna"><meta property="og:title" content="${language.seoTitle}"><meta property="og:description" content="${language.description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${imageUrl}"><meta property="og:image:alt" content="${language.alt}"><meta property="og:locale" content="${language.locale}"><meta property="article:published_time" content="${published}"><meta property="article:modified_time" content="${published}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${language.seoTitle}"><meta name="twitter:description" content="${language.description}"><meta name="twitter:image" content="${imageUrl}"><link rel="icon" href="/assets/favicon-32.png"><link rel="stylesheet" href="/assets/seo-20260814.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><a class="skip-link" href="#main">Skip to content</a><header><div class="nav"><a class="brand" href="/"><img src="/assets/logo-128.png" alt="Kreluna" width="30" height="30">Kreluna</a><div class="links"><a href="${language.resources}">${language.resourcesLabel}</a><a href="/marketplace">${language.marketplaceLabel}</a><span class="article-languages">${languageLinks(language)}</span></div></div></header><main id="main"><nav class="crumb" aria-label="Breadcrumb"><a href="/">${language.homeLabel}</a> / <a href="${language.resources}">${language.resourcesLabel}</a> / <span>${article.title}</span></nav><article class="article"><header class="article-hero"><div class="eyebrow">${language.eyebrow}</div><h1>${article.title}</h1><p class="article-meta">${published} · ${language.authorLabel}</p></header><figure class="article-cover"><img src="/assets/guide-scegliere-professionista-web-1200.webp" srcset="/assets/guide-scegliere-professionista-web-640.webp 640w, /assets/guide-scegliere-professionista-web-1200.webp 1200w" sizes="(max-width: 800px) 94vw, 1000px" decoding="async" fetchpriority="high" alt="${language.alt}" width="1536" height="1024"><figcaption>${language.alt}</figcaption></figure>${article.html}<section class="article-cta"><a class="btn primary" href="/marketplace">${language.marketplaceLabel} Kreluna</a></section></article></main><footer><div class="footer"><div><strong>Kreluna</strong><p>AI, automation and digital tools for real work.</p></div><div><strong>Explore</strong><a href="${language.resources}">${language.resourcesLabel}</a><a href="/marketplace">${language.marketplaceLabel}</a></div></div><p class="project-status">Kreluna · P. IVA 02114130475 · REA PT-622714</p></footer></body></html>`;
}

for (const language of languages) {
  const article = markdownToHtml(cleanSection(extractSection(language.section)));
  const output = path.join(root, language.output);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, buildPage(language, article));
}

async function addResourceCard(file, marker, card, anchor) {
  const filePath = path.join(root, file);
  let html = await readFile(filePath, "utf8");
  const block = `<!-- ${marker}_START -->${card}<!-- ${marker}_END -->`;
  const pattern = new RegExp(`<!-- ${marker}_START -->[\\s\\S]*?<!-- ${marker}_END -->`);
  if (pattern.test(html)) html = html.replace(pattern, block);
  else html = html.replace(anchor, `${block}${anchor}`);
  await writeFile(filePath, html);
}

await addResourceCard(
  "public/risorse.html",
  "KRELUNA_GUIDE_WEB_PRO_IT",
  '<article class="resource-card"><span class="resource-number">04</span><h3><a href="/it/guide/come-scegliere-professionista-sito-web/">Come scegliere un professionista affidabile per creare il sito della tua attività</a></h3><p>Una guida per confrontare esperienza, portfolio, preventivo, proprietà degli account, accessibilità e assistenza.</p><a class="text-link" href="/it/guide/come-scegliere-professionista-sito-web/">Leggi la guida →</a></article>',
  '</div></section><section class="section alt">',
);

await addResourceCard(
  "public/en/resources.html",
  "KRELUNA_GUIDE_WEB_PRO_EN",
  '<article class="resource-card"><span class="resource-number">04</span><h3><a href="/en/guides/how-to-choose-a-website-professional/">How to choose a reliable professional for your business website</a></h3><p>A guide to comparing experience, portfolios, proposals, account ownership, accessibility and ongoing support.</p><a class="text-link" href="/en/guides/how-to-choose-a-website-professional/">Read the guide →</a></article>',
  '</div></section><section class="section alt">',
);

console.log(`Generated ${languages.length} localized guide pages.`);
