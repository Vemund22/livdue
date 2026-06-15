import sharp from '/Users/vemunddue/Code/livdue/site/node_modules/sharp/lib/index.js';
import { join } from 'node:path';
const A = '/Users/vemunddue/Code/livdue/site/src/assets/verk';

// Endast de osäkra grupperna (avstånd >= 4 eller serie-namn), stora thumbnails
const grupper = [
  ['konst/kyet.jpg', 'konst/kyss.jpg'],
  ['konst/livdue2.jpg', 'konst/livdue1.jpg'],
  ['malt/img-6104.jpg', 'malt/utan-titel-08647d.png'],
  ['sten/fonten.jpg', 'sten/fountain.jpg'],
  ['sten/gennom2.jpg', 'sten/genom.jpg', 'sten/ragsvadgj.jpg'],
  ['sten/hakke.jpg', 'sten/hakke-2.jpg'],
];
const CELL = 360, GAP = 8, COLS = 3;
async function thumb(f) {
  return sharp(join(A, f)).resize(CELL, CELL, { fit: 'contain', background: { r: 255, g: 255, b: 255 } }).toBuffer();
}
const W = COLS * CELL + (COLS + 1) * GAP;
const H = grupper.length * (CELL + GAP) + GAP;
const comp = [];
for (let r = 0; r < grupper.length; r++)
  for (let c = 0; c < grupper[r].length && c < COLS; c++)
    comp.push({ input: await thumb(grupper[r][c]), left: GAP + c * (CELL + GAP), top: GAP + r * (CELL + GAP) });
await sharp({ create: { width: W, height: H, channels: 3, background: { r: 235, g: 235, b: 235 } } }).composite(comp).png().toFile('/tmp/dupes_verify.png');
grupper.forEach((g, i) => console.log(`Rad ${i + 1}: ${g.join('  |  ')}`));
