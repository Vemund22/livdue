// FULL ERSÄTTNING: bygger hela verk-kollektionen från nytt3.
// Läser först befintlig metadata+hash i minnet, wipe:ar sedan, bygger nytt.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from '/Users/vemunddue/Code/livdue/site/node_modules/sharp/lib/index.js';

const SITE = '/Users/vemunddue/Code/livdue/site';
const ASSETS = join(SITE, 'src/assets/verk');
const CONTENT = join(SITE, 'src/content/verk');
const N3 = '/Users/vemunddue/Code/livdue/inventory/nytt3';

const KAT_MAP = {
  malt: 'malt',
  stein: 'sten',
  'bronse:gress:objekt': 'objekt',
  tegninger: 'teckning',
  portrett: 'portratt',
  silver: 'silver',
  foto: 'foto',
  digitalt: 'digitalt',
};
// toppnivå MIXart -> digitalt
const CAMERA = /^(img|imge|ho9a|_?o9a|p\d{6,}|pict|dsc|\d{4}-\d\d-\d\d|\d{6,})/i;

const FEATURED = [
  ['sten', 'kyssen', 1],
  ['malt', 'blau', 2],
  ['teckning', 'listeners', 3],
  ['objekt', 'samtal', 4],
  ['portratt', 'pap', 5],
  ['sten', 'hakke', 6],
  ['digitalt', 'omhet', 7],
  ['silver', 'armcharm', 8],
];
const featKey = (k, s) => FEATURED.find(([kk, ss]) => kk === k && ss === s);

function cleanBase(f) {
  return basename(f, extname(f))
    .normalize('NFC')
    .replace(/ copy$/i, '')
    .replace(/\.?\s*jpe?g$/i, ''); // "Kyssenjpg" -> "Kyssen"
}
function slugify(name) {
  return name.normalize('NFC')
    .replace(/[ÅÄ]/g, 'A').replace(/[åä]/g, 'a').replace(/[Øø]/g, 'o')
    .replace(/[Ö]/g, 'O').replace(/[ö]/g, 'o').replace(/[ÉÈ]/g, 'E').replace(/[éè]/g, 'e')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function titleFrom(base) {
  let t = base.replace(/\(l\)$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/[a-zåäöø]/.test(t)) t = t.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function yaml(s) { return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`; }
async function dhash(file) {
  const w = 9, h = 8;
  const d = await sharp(file).grayscale().resize(w, h, { fit: 'fill' }).raw().toBuffer();
  const b = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w - 1; x++) b.push(d[y * w + x] > d[y * w + x + 1] ? 1 : 0);
  return b;
}
const hamming = (a, b) => a.reduce((s, v, i) => s + (v !== b[i] ? 1 : 0), 0);

// --- 1) Läs in gammal metadata + hash i minnet ---
const oldWorks = [];
for (const kat of readdirSync(ASSETS)) {
  const dir = join(ASSETS, kat);
  if (!statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(f)) continue;
    const slug = f.slice(0, -extname(f).length);
    const md = join(CONTENT, kat, slug + '.md');
    let meta = {};
    if (existsSync(md)) {
      const t = readFileSync(md, 'utf8');
      const g = (k) => (t.match(new RegExp(k + ':\\s*"([^"]*)"'))||[])[1];
      meta = { title: g('title'), teknik: g('teknik'), matt: g('matt'), ar: g('ar') };
    }
    oldWorks.push({ slug, ...meta, hash: await dhash(join(dir, f)) });
  }
}
console.log(`Läste ${oldWorks.length} gamla verk (metadata + hash).`);

// --- 2) Samla nya källbilder ---
const sources = [];
for (const [mapp, kat] of Object.entries(KAT_MAP)) {
  const dir = join(N3, mapp);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) if (/\.(jpe?g|png)$/i.test(f)) sources.push({ src: join(dir, f), f, kat });
}
for (const f of readdirSync(N3)) if (/mix.*\.(jpe?g|png)$/i.test(f)) sources.push({ src: join(N3, f), f, kat: 'digitalt' });
console.log(`Nya källbilder: ${sources.length}`);

// --- 3) Wipe ---
rmSync(CONTENT, { recursive: true, force: true });
rmSync(ASSETS, { recursive: true, force: true });

// --- 4) Bygg ---
const ord = {};
let n = 0;
const rapport = [];
for (const { src, f, kat } of sources) {
  const cb = cleanBase(f);
  let slug = slugify(cb) || 'verk';
  mkdirSync(join(ASSETS, kat), { recursive: true });
  mkdirSync(join(CONTENT, kat), { recursive: true });
  let s = slug, i = 2;
  while (existsSync(join(CONTENT, kat, s + '.md'))) s = `${slug}-${i++}`;
  slug = s;

  // metadata via hash-match mot gamla
  const h = await dhash(src);
  let best = null;
  for (const o of oldWorks) { const d = hamming(h, o.hash); if (!best || d < best.d) best = { d, o }; }
  const m = best && best.d <= 6 ? best.o : null;

  // titel: mammas filnamn om meningsfullt; annars gammal titel; annars Utan titel
  let title;
  if (!CAMERA.test(cb)) title = titleFrom(cb);
  else if (m && m.title && m.title !== 'Utan titel') title = m.title;
  else title = 'Utan titel';

  const e = extname(f).toLowerCase() === '.png' ? '.png' : '.jpg';
  const dest = join(ASSETS, kat, slug + e);
  let img = sharp(src).rotate();
  if (e === '.png') await img.png().toFile(dest); else await img.jpeg({ quality: 95 }).toFile(dest);

  ord[kat] = (ord[kat] ?? 0) + 1;
  const feat = featKey(kat, slug);
  const fm = ['---',
    `title: ${yaml(title)}`,
    `kategori: ${kat}`,
    `bild: ../../../assets/verk/${kat}/${slug}${e}`,
    m && m.teknik ? `teknik: ${yaml(m.teknik)}` : null,
    m && m.matt ? `matt: ${yaml(m.matt)}` : null,
    m && m.ar ? `ar: ${yaml(m.ar)}` : null,
    `ordning: ${ord[kat]}`,
    feat ? 'utvald: true' : null,
    feat ? `utvaldOrdning: ${feat[2]}` : null,
    '---', ''].filter(Boolean).join('\n');
  writeFileSync(join(CONTENT, kat, slug + '.md'), fm);
  rapport.push(`${kat}/${slug}  "${title}"${m ? `  [metadata: ${[m.teknik, m.matt, m.ar].filter(Boolean).join(', ') || '—'}]` : ''}${feat ? '  ★utvald' : ''}`);
  n++;
}
console.log(`\nByggde ${n} verk:\n` + rapport.join('\n'));
const featSaknas = FEATURED.filter(([k, s]) => !existsSync(join(CONTENT, k, s + '.md')));
if (featSaknas.length) console.log('\n!! Utvalda som INTE hittades:', featSaknas.map(([k, s]) => `${k}/${s}`).join(', '));
