import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Only immutable, anonymous editorial pages. Never snapshot account/API routes.
// Retain the original React payload/scripts so consent and navigation still hydrate.
const { default: worker } = await import(pathToFileURL(resolve('dist/server/index.js')).href);
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
export const publicPaths = ['', '/en', '/fr', '/es', '/de'].flatMap(prefix => [
  prefix || '/', `${prefix}/cosmora`, `${prefix}/cosmora/lucca-comics-2026`,
]);
for (const path of publicPaths) {
  const response = await worker.fetch(new Request(`https://www.kreluna.it${path}`, {
    headers: { accept: 'text/html' },
  }), env, ctx);
  if (response.status !== 200 || response.headers.has('set-cookie')) throw new Error(`Unsafe prerender: ${path}`);
  const html = await response.text();
  if (!html.includes('<h1') || !html.includes('rel="canonical"') || !html.includes('</html>')) throw new Error(`Incomplete prerender: ${path}`);
  const file = resolve('dist/client', path === '/' ? 'index.html' : `${path.slice(1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
console.log(`Prerendered ${publicPaths.length} public pages; original hydration and SEO retained.`);
