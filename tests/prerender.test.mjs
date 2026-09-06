import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

test('public snapshots retain SEO, hydration and localized navigation', async () => {
  for (const locale of ['', 'en', 'fr', 'es', 'de']) {
    for (const suffix of ['', 'cosmora', 'cosmora/lucca-comics-2026']) {
      const route = [locale, suffix].filter(Boolean).join('/');
      const html = await readFile(`dist/client/${route || 'index'}.html`, 'utf8');
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
      assert.match(html, /rel="canonical"/);
      assert.match(html, /type="module"/);
      assert.match(html, /cookie/);
      if (!suffix) assert.match(html, /nav-cosmora/);
    }
  }
  for (const route of ['risonix/account', 'risonix/acquista', 'api/launch-waitlist']) {
    await assert.rejects(access(`dist/client/${route}.html`));
  }
});
