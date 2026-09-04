import { stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE_PATH || 'sharp');
const sources = ['citybeam-hero.png','assets/guide-scegliere-professionista-web.png','assets/guide-scegliere-software-gestionale.png','velvet-table/hero.jpg','velvet-table/garden-restaurant.jpg','velvet-table/salon.jpg','velvet-table/view-window.jpg','velvet-table/view-alcove.jpg','velvet-table/view-garden.jpg','velvet-table/night.jpg'];
let before=0,after=0;
for (const source of sources) {
  const input=`public/${source}`;
  const stem=input.replace(/\.(png|jpg)$/, '');
  const original=await stat(input);before+=original.size;
  for (const width of [640,1200]) await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:82,effort:6}).toFile(`${stem}-${width}.webp`);
  const optimized=await stat(`${stem}-1200.webp`);after+=optimized.size;
  console.log(`${source}: ${original.size} -> ${optimized.size} bytes (1200px WebP)`);
}
console.log(JSON.stringify({before,after,reduction:Math.round((1-after/before)*100)}));
