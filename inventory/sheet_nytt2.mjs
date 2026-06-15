import sharp from '/Users/vemunddue/Code/livdue/site/node_modules/sharp/lib/index.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const ASSETS = '/Users/vemunddue/Code/livdue/site/src/assets/verk';
const plan = JSON.parse(readFileSync('/tmp/nytt2_plan.json', 'utf8'));

async function thumb(file, cell) {
  return sharp(file).resize(cell, cell, { fit: 'contain', background: { r: 255, g: 255, b: 255 } }).toBuffer();
}
async function grid(items, cols, cell, out) {
  const gap = 6;
  const rows = Math.ceil(items.length / cols);
  const W = cols * cell + (cols + 1) * gap;
  const H = rows * (cell + gap) + gap;
  const comp = [];
  for (let i = 0; i < items.length; i++) {
    comp.push({
      input: await thumb(items[i], cell),
      left: gap + (i % cols) * (cell + gap),
      top: gap + Math.floor(i / cols) * (cell + gap),
    });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 230, g: 230, b: 230 } } })
    .composite(comp).png().toFile(out);
}

// NY: grid 4 kol
await grid(plan.NY.map((r) => r.src), 4, 230, '/tmp/nytt2_NY.png');
console.log('NY (/tmp/nytt2_NY.png), läsordning vänster->höger, uppifrån:');
plan.NY.forEach((r, i) => console.log(`  ${i + 1}. ${r.mapp}/${r.fil} -> ${r.kategori}`));

// SWAP + REVIEW: par (ny | befintlig)
const pairs = [...plan.SWAP, ...plan.REVIEW];
const pairImgs = [];
for (const r of pairs) {
  pairImgs.push(r.src);
  pairImgs.push(join(ASSETS, r.matchKat, r.matchSlug + '.jpg'));
}
await grid(pairImgs, 2, 320, '/tmp/nytt2_SWAP.png');
console.log('\nSWAP/REVIEW (/tmp/nytt2_SWAP.png), varje rad: NY (vänster) | BEFINTLIG (höger):');
pairs.forEach((r, i) => console.log(`  rad ${i + 1}: ${r.mapp}/${r.fil}  |  ${r.matchKat}/${r.matchSlug}  (d=${r.dist}, ${r.kvotPx}x)`));
