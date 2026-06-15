// Hittar VISUELLT identiska bilder bland verken (samma motiv, olika fil/upplösning).
// Använder dHash (difference hash) + Hamming-avstånd. Skriver bara en rapport;
// raderar inget. Kör med: node find_dupes.mjs [tröskel]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from '/Users/vemunddue/Code/livdue/site/node_modules/sharp/lib/index.js';

const ASSETS = '/Users/vemunddue/Code/livdue/site/src/assets/verk';
const CONTENT = '/Users/vemunddue/Code/livdue/site/src/content/verk';
const TROSKEL = Number(process.argv[2] ?? 8); // max Hamming-avstånd för "samma bild"

// dHash 9x8 -> 64 bitar. Robust mot omkomprimering/skalning.
async function dhash(file) {
  const w = 9,
    h = 8;
  const data = await sharp(file)
    .grayscale()
    .resize(w, h, { fit: 'fill' })
    .raw()
    .toBuffer();
  const bits = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = y * w + x;
      bits.push(data[i] > data[i + 1] ? 1 : 0);
    }
  }
  return bits;
}

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

const items = [];
for (const kat of readdirSync(ASSETS)) {
  const dir = join(ASSETS, kat);
  if (!statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(f)) continue;
    const path = join(dir, f);
    const slug = f.slice(0, -extname(f).length);
    let meta = { width: 0, height: 0 };
    try {
      meta = await sharp(path).metadata();
    } catch {}
    items.push({
      kat,
      slug,
      file: f,
      path,
      mdPath: join(CONTENT, kat, slug + '.md'),
      bytes: statSync(path).size,
      px: (meta.width || 0) * (meta.height || 0),
      hash: await dhash(path),
    });
  }
}
console.log(`Hashade ${items.length} bilder. Tröskel: ${TROSKEL} bitar.\n`);

// Union-find för att gruppera transitiva träffar
const parent = items.map((_, i) => i);
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
const union = (a, b) => {
  parent[find(a)] = find(b);
};
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    if (hamming(items[i].hash, items[j].hash) <= TROSKEL) union(i, j);
  }
}

const grupper = new Map();
items.forEach((it, i) => {
  const r = find(i);
  if (!grupper.has(r)) grupper.set(r, []);
  grupper.get(r).push(it);
});

const dubblettGrupper = [...grupper.values()].filter((g) => g.length > 1);
if (!dubblettGrupper.length) {
  console.log('Inga visuella dubbletter hittade.');
} else {
  console.log(`${dubblettGrupper.length} grupper med dubbletter:\n`);
  for (const g of dubblettGrupper) {
    // behåll störst (flest pixlar, sen flest bytes)
    g.sort((a, b) => b.px - a.px || b.bytes - a.bytes);
    const [behall, ...tabort] = g;
    console.log(`  BEHÅLL  ${behall.kat}/${behall.file}  (${behall.px} px, ${(behall.bytes / 1024 | 0)} kB)`);
    for (const t of tabort) {
      const d = hamming(behall.hash, t.hash);
      console.log(`  ta bort ${t.kat}/${t.file}  (${t.px} px, ${(t.bytes / 1024 | 0)} kB, avstånd ${d})`);
    }
    console.log('');
  }
}
