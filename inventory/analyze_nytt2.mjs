// Jämför nya bilder i nytt2 mot befintliga verk via perceptuell dHash.
// Klassar varje ny bild: NY / SWAP (bättre version) / SKIP (dubblett ej bättre) / REVIEW (gränsfall).
// Skriver plan till /tmp/nytt2_plan.json + konsollsammanfattning. Ändrar inget.
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from '/Users/vemunddue/Code/livdue/site/node_modules/sharp/lib/index.js';

const SITE = '/Users/vemunddue/Code/livdue/site';
const ASSETS = join(SITE, 'src/assets/verk');
const CONTENT = join(SITE, 'src/content/verk');
const NYTT2 = '/Users/vemunddue/Code/livdue/inventory/nytt2';

// nytt2-mapp -> sajtkategori
const KAT_MAP = {
  malt: 'malt',
  stein: 'sten',
  foto: 'teckning-foto',
  tegninger: 'teckning-foto',
  portrett: 'portratt',
  silver: 'silver',
  'bronse:gress:objekt': 'konst',
};

function slugify(name) {
  return name
    .normalize('NFC')
    .replace(/ copy$/i, '')
    .replace(/\. jpg$/i, '')
    .replace(/[ÅÄ]/g, 'A').replace(/[åä]/g, 'a')
    .replace(/Ø/g, 'O').replace(/ø/g, 'o')
    .replace(/Ö/g, 'O').replace(/ö/g, 'o')
    .replace(/[ÉÈ]/g, 'E').replace(/[éè]/g, 'e')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function dhash(file) {
  const w = 9, h = 8;
  const data = await sharp(file).grayscale().resize(w, h, { fit: 'fill' }).raw().toBuffer();
  const bits = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w - 1; x++) bits.push(data[y * w + x] > data[y * w + x + 1] ? 1 : 0);
  return bits;
}
const hamming = (a, b) => a.reduce((d, v, i) => d + (v !== b[i] ? 1 : 0), 0);

// --- Index befintliga verk ---
const existing = [];
for (const kat of readdirSync(ASSETS)) {
  const dir = join(ASSETS, kat);
  if (!statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(f)) continue;
    const slug = f.slice(0, -extname(f).length);
    const path = join(dir, f);
    let meta = {};
    try { meta = await sharp(path).metadata(); } catch {}
    existing.push({
      kat, slug, path,
      px: (meta.width || 0) * (meta.height || 0),
      bytes: statSync(path).size,
      hash: await dhash(path),
    });
  }
}
console.log(`Indexerade ${existing.length} befintliga verk.\n`);

// --- Klassa nya bilder ---
const plan = { NY: [], SWAP: [], SKIP: [], REVIEW: [] };
for (const [mapp, kategori] of Object.entries(KAT_MAP)) {
  const dir = join(NYTT2, mapp);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(f)) continue;
    const src = join(dir, f);
    const base = basename(f, extname(f)).normalize('NFC');
    const slug = slugify(base);
    let meta = {};
    try { meta = await sharp(src).metadata(); } catch { continue; }
    const px = (meta.width || 0) * (meta.height || 0);
    const hash = await dhash(src);

    // bästa hash-match
    let best = null;
    for (const e of existing) {
      const d = hamming(hash, e.hash);
      if (!best || d < best.d) best = { d, e };
    }
    // filnamns-slug-match (stark signal)
    const slugMatch = existing.find((e) => e.slug === slug);

    const rec = {
      mapp, kategori, fil: f, src, base, slug, px,
      matchSlug: best.e.slug, matchKat: best.e.kat, dist: best.d,
      matchPx: best.e.px, kvotPx: best.e.px ? +(px / best.e.px).toFixed(2) : null,
      filnamnMatch: slugMatch ? `${slugMatch.kat}/${slugMatch.slug}` : null,
    };

    const klart = best.d <= 2 || (slugMatch && best.d <= 6);
    if (klart) {
      // samma verk — bättre bild?
      const target = slugMatch || best.e;
      rec.matchSlug = target.slug; rec.matchKat = target.kat;
      rec.kvotPx = target.px ? +(px / target.px).toFixed(2) : null;
      if (px > target.px * 1.25) plan.SWAP.push(rec);
      else plan.SKIP.push(rec);
    } else if (best.d <= 8) {
      plan.REVIEW.push(rec); // gränsfall: kan vara samma (annan vinkel) ELLER annat verk (färgkrock)
    } else {
      plan.NY.push(rec);
    }
  }
}

writeFileSync('/tmp/nytt2_plan.json', JSON.stringify(plan, null, 2));
const visa = (arr, rad) => arr.map(rad).join('\n');
console.log(`NYA verk (${plan.NY.length}):`);
console.log(visa(plan.NY, (r) => `  + ${r.mapp}/${r.fil}  -> ${r.kategori}  (närmast: ${r.matchKat}/${r.matchSlug} d=${r.dist})`));
console.log(`\nSWAP bättre version (${plan.SWAP.length}):`);
console.log(visa(plan.SWAP, (r) => `  ~ ${r.mapp}/${r.fil}  -> ${r.matchKat}/${r.matchSlug}  (d=${r.dist}, ${r.kvotPx}x px)`));
console.log(`\nSKIP dubblett ej bättre (${plan.SKIP.length}):`);
console.log(visa(plan.SKIP, (r) => `  = ${r.mapp}/${r.fil}  ~ ${r.matchKat}/${r.matchSlug}  (d=${r.dist}, ${r.kvotPx}x px)`));
console.log(`\nREVIEW gränsfall (${plan.REVIEW.length}):`);
console.log(visa(plan.REVIEW, (r) => `  ? ${r.mapp}/${r.fil}  ~ ${r.matchKat}/${r.matchSlug}  (d=${r.dist}, ${r.kvotPx}x px)`));
