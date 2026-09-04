import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
const postcss = createRequire(require.resolve('@tailwindcss/postcss'))('postcss');

// Compile the existing presentation component at build time: one source of copy,
// translations, metadata and markup; no React hydration needed on this landing.
function compile(source, dependencies = {}) {
  const exports = {};
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'exports', js)(id => dependencies[id] ?? require(id), exports);
  return exports;
}
const faq = compile(await readFile('app/citybeam/citybeam-faq.ts', 'utf8'));
const landing = compile(await readFile('app/citybeam/citybeam-landing.tsx', 'utf8'), { './citybeam-faq': faq });
const cookieSource = ts.createSourceFile('cookie.tsx', await readFile('app/cookie-consent.tsx', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let cookieInitializer;
cookieSource.forEachChild(node => {
  if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) {
    if (declaration.name.getText(cookieSource) === 'copyByLanguage') cookieInitializer = declaration.initializer.getText(cookieSource);
  }
});
if (!cookieInitializer) throw Error('Cookie translations not found');
const copies = compile(`export default ${cookieInitializer}`).default;
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const locales = ['it', 'en', 'fr', 'es', 'de'];
const bodies = Object.fromEntries(locales.map(locale => [locale, renderToStaticMarkup(React.createElement(landing.default, { locale }))]));
const classes = new Set(['cookie-banner', 'cookie-settings-trigger', 'accept', 'skip-link']);
for (const html of Object.values(bodies)) for (const match of html.matchAll(/class="([^"]+)"/g)) match[1].split(/\s+/).forEach(c => classes.add(c));
const css = postcss.parse(await readFile('app/globals.css', 'utf8'));
css.walkRules(rule => {
  const selectors = rule.selectors.filter(selector => [...selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].every(m => classes.has(m[1])));
  if (selectors.length) rule.selectors = selectors; else rule.remove();
});
css.walkAtRules(rule => { if (rule.name.endsWith('keyframes') || (rule.nodes && !rule.nodes.length)) rule.remove(); });
css.walkComments(comment => comment.remove());
const styles = css.toString() + '\n[hidden]{display:none!important}';
await mkdir('public/assets', { recursive: true });
for (const locale of locales) {
  const m = landing.cityBeamMetadata(locale), c = copies[locale];
  const path = locale === 'it' ? '/citybeam' : `/${locale}/citybeam`;
  const policy = locale === 'en' ? '/en/cookies' : '/cookie';
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(m.title)}</title><meta name="description" content="${esc(m.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${m.alternates.canonical}">${Object.entries(m.alternates.languages).map(([lang,url])=>`<link rel="alternate" hreflang="${lang}" href="${url}">`).join('')}<meta property="og:title" content="${esc(m.title)}"><meta property="og:description" content="${esc(m.description)}"><meta property="og:url" content="${m.alternates.canonical}"><meta property="og:site_name" content="Kreluna"><meta property="og:type" content="website"><meta property="og:locale" content="${m.openGraph.locale}"><meta property="og:image" content="${m.openGraph.images[0].url}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(m.title)}"><meta name="twitter:description" content="${esc(m.description)}"><meta name="twitter:image" content="${m.openGraph.images[0].url}"><link rel="icon" href="/favicon-32.png"><meta name="theme-color" content="#050711"><link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/newsreader-500-italic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin><style>${styles}</style></head><body>${bodies[locale]}<button class="cookie-settings-trigger" id="cookie-settings" type="button">${esc(c.settings)}</button><aside class="cookie-banner" id="cookie-banner" aria-label="${esc(c.label)}" hidden><p>${esc(c.text)} <a href="${policy}">${esc(c.policy)}</a>.</p><div><button type="button" data-choice="technical">${esc(c.necessary)}</button><button type="button" class="accept" data-choice="accepted">${esc(c.accept)}</button></div></aside><script defer src="/assets/citybeam-consent.js"></script><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"563650c804544d489377014a00cc36f7"}'></script></body></html>`;
  await mkdir(`public${locale === 'it' ? '' : '/' + locale}`, { recursive: true });
  await writeFile(`public${path}.html`, html);
}
console.log(`Generated five static CityBeam pages; CSS ${styles.length} bytes, no framework scripts.`);
