import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? htmlFiles(`${dir}/${e.name}`) : `${dir}/${e.name}`))).flat().filter(f => f.endsWith('.html'));
}

test('localized guides link to real localized project hubs, not the hidden marketplace', async () => {
  const hubs = {it:'/progetti', en:'/en/projects', fr:'/fr/projects', es:'/es/projects', de:'/de/projects'};
  let count = 0;
  for (const [locale, hub] of Object.entries(hubs)) {
    for (const file of await htmlFiles(`public/${locale}`)) {
      if (!/\/(guide|guides|guias|ratgeber)\//.test(file)) continue;
      const html = await readFile(file, 'utf8');
      assert.ok(!/href="[^"]*\/marketplace/.test(html), file);
      assert.ok(html.includes(`href="${hub}"`), file);
      assert.ok(!html.includes('Kreluna Marketplace'), file);
      count++;
    }
  }
  assert.equal(count, 10);
});

test('prelaunch project schemas make no worldwide coverage claim', async () => {
  for (const file of ['app/citybeam/citybeam-landing.tsx','app/velvet-table/velvet-landing.tsx']) {
    assert.ok(!(await readFile(file, 'utf8')).includes('areaServed: "Worldwide"'), file);
  }
  const home = await readFile('app/page.tsx', 'utf8');
  assert.ok(home.includes('inLanguage: ["it-IT", "en-GB", "fr-FR", "es-ES", "de-DE"]'));
});
