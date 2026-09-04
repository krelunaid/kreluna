import { createRequire } from 'node:module';
import { stat } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE_PATH || 'sharp');
for (const width of [640, 1200]) {
  const output = `public/citybeam-hero-${width}.avif`;
  await sharp('public/citybeam-hero.png').resize({ width }).avif({ quality: 50, effort: 6 }).toFile(output);
  console.log(output, (await stat(output)).size);
}
await sharp('public/kreluna-logo.png').resize(64, 64).webp({ quality: 85 }).toFile('public/kreluna-logo-64.webp');
