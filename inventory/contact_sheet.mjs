// Bygger kontaktkartor (PNG) av dubblettgrupperna så de kan granskas visuellt.
import sharp from '/Users/vemunddue/Code/livdue/site/node_modules/sharp/lib/index.js';
import { join } from 'node:path';

const A = '/Users/vemunddue/Code/livdue/site/src/assets/verk';

// Grupperna från find_dupes.mjs — varje rad är en grupp (slug-stigar)
const grupper = [
  ['sten/19.jpg', 'sten/gjennom.jpg', 'konst/gjennom-2.jpg'],
  ['konst/kyet.jpg', 'konst/kyss.jpg'],
  ['konst/livdue2.jpg', 'konst/livdue1.jpg'],
  ['malt/megmedkat.jpg', 'konst/medkat.jpg'],
  ['malt/ogonblikket.jpg', 'konst/oyeblikket.jpg'],
  ['konst/romsv.jpg', 'konst/room86.jpg'],
  ['konst/ryggmotrygg-2.jpg', 'sten/ryggmotrygg.jpg'],
  ['malt/img-5590-2.jpg', 'malt/img-5590.jpg'],
  ['malt/img-6104.jpg', 'malt/utan-titel-08647d.png'],
  ['sten/fonten.jpg', 'sten/fountain.jpg'],
  ['sten/gennom2.jpg', 'sten/genom.jpg', 'sten/ragsvadgj.jpg'],
  ['sten/hakke.jpg', 'sten/hakke-2.jpg'],
  ['sten/tildeg-2.jpg', 'sten/tildeg.jpg'],
];

const CELL = 200;
const GAP = 6;
const COLS = 3;

async function thumb(file) {
  return sharp(join(A, file))
    .resize(CELL, CELL, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
    .toBuffer();
}

// En PNG per grupp-batch: rita alla grupper staplade, en rad per grupp
const rows = grupper.length;
const W = COLS * CELL + (COLS + 1) * GAP;
const H = rows * (CELL + GAP) + GAP;

const composites = [];
for (let r = 0; r < grupper.length; r++) {
  const g = grupper[r];
  for (let c = 0; c < g.length && c < COLS; c++) {
    composites.push({
      input: await thumb(g[c]),
      left: GAP + c * (CELL + GAP),
      top: GAP + r * (CELL + GAP),
    });
  }
}

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 235, g: 235, b: 235 } },
})
  .composite(composites)
  .png()
  .toFile('/tmp/dupes_sheet.png');

console.log('Skrev /tmp/dupes_sheet.png');
grupper.forEach((g, i) => console.log(`Rad ${i + 1}: ${g.join('  |  ')}`));
