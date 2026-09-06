import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('upcoming cards and signup themes are isolated from legacy section layout', async () => {
  const cards = await readFile('app/upcoming-projects.tsx', 'utf8');
  const signup = await readFile('app/launch-signup.tsx', 'utf8');
  const css = await readFile('app/globals.css', 'utf8');
  assert.ok(cards.includes('upcoming-card upcoming-card--${project.slug}'));
  assert.ok(signup.includes('launch-signup launch-signup--${project}'));
  assert.match(css, /\.upcoming-grid\s*\{[^}]*repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.upcoming-card-body\s*\{[^}]*flex: 1[^}]*flex-direction: column/);
  assert.match(css, /\.upcoming-card-body > a\s*\{[^}]*margin-top: auto/);
  assert.doesNotMatch(css, /\.upcoming-card\.velvet-table/);
});
