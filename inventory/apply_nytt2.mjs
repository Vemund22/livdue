// Applicerar planen: byter in bättre bildversioner (SWAP) och lägger till nya verk (NY).
// Bakar EXIF-orientering och strippar metadata vid kopiering (undviker sidledes bilder).
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from '/Users/vemunddue/Code/livdue/site/node_modules/sharp/lib/index.js';

const SITE = '/Users/vemunddue/Code/livdue/site';
const ASSETS = join(SITE, 'src/assets/verk');
const CONTENT = join(SITE, 'src/content/verk');
const plan = JSON.parse(readFileSync('/tmp/nytt2_plan.json', 'utf8'));

// model.JPG (REVIEW) = samma verk som img-7515, försumbar uppl-vinst -> hoppa
const SWAP = plan.SWAP;
const NY = plan.NY;

const CAMERA = /^(img[_ ]?\d|imge|ho9a|_?o9a|p\d{6,}|pict\d|dsc\d|\d{4}-\d\d-\d\d|\d{6,})/i;

function makeTitle(base) {
  if (CAMERA.test(base)) return 'Utan titel';
  let t = base.replace(/\(l\)$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/[a-zåäöø]/.test(t)) t = t.toLowerCase(); // helt versalt -> gemener
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function yaml(s) {
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
function ext(f) {
  const e = extname(f).toLowerCase();
  return e === '.jpeg' ? '.jpg' : e;
}
async function writeImg(src, dest) {
  // .rotate() utan argument = auto-orientera efter EXIF; strippar metadata
  const e = ext(dest);
  let img = sharp(src).rotate();
  if (e === '.png') await img.png().toFile(dest);
  else await img.jpeg({ quality: 95 }).toFile(dest);
}

// --- SWAP: byt bild, behåll .md/metadata ---
let swapped = 0;
for (const r of SWAP) {
  const catDir = join(ASSETS, r.matchKat);
  // hitta befintlig bildfil (valfri ändelse) för slug
  const cur = readdirSync(catDir).find((f) => f.slice(0, -extname(f).length) === r.matchSlug);
  if (!cur) {
    console.log(`!! SWAP hoppad, hittar ej ${r.matchKat}/${r.matchSlug}`);
    continue;
  }
  const destExt = ext(r.fil);
  const dest = join(catDir, r.matchSlug + destExt);
  await writeImg(r.src, dest);
  // om ändelsen ändrats (t.ex. .JPG->.jpg samma; men om gammal var .png och ny .jpg)
  const oldPath = join(catDir, cur);
  if (oldPath !== dest && existsSync(oldPath)) {
    const { rmSync } = await import('node:fs');
    rmSync(oldPath);
    // uppdatera bild-fältet i .md
    const md = join(CONTENT, r.matchKat, r.matchSlug + '.md');
    let txt = readFileSync(md, 'utf8');
    txt = txt.replace(/(bild:\s*\S+?)\.[a-zA-Z]+/, `$1${destExt}`);
    writeFileSync(md, txt);
  }
  console.log(`SWAP ${r.matchKat}/${r.matchSlug}  <-  ${r.mapp}/${r.fil}  (${r.kvotPx}x)`);
  swapped++;
}

// --- NY: lägg till verk ---
// nästa ordning per kategori (efter befintliga)
const nextOrd = {};
for (const kat of readdirSync(CONTENT)) {
  const d = join(CONTENT, kat);
  let max = 0;
  for (const f of readdirSync(d)) {
    const m = readFileSync(join(d, f), 'utf8').match(/ordning:\s*(\d+)/);
    if (m) max = Math.max(max, +m[1]);
  }
  nextOrd[kat] = max + 1;
}

function slugify(name) {
  return name
    .normalize('NFC')
    .replace(/[ÅÄ]/g, 'A').replace(/[åä]/g, 'a').replace(/[Øø]/g, 'o')
    .replace(/[Ö]/g, 'O').replace(/[ö]/g, 'o').replace(/[ÉÈ]/g, 'E').replace(/[éè]/g, 'e')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

let added = 0;
for (const r of NY) {
  const kat = r.kategori;
  mkdirSync(join(ASSETS, kat), { recursive: true });
  mkdirSync(join(CONTENT, kat), { recursive: true });
  let slug = slugify(r.base);
  if (!slug) slug = 'verk';
  let s = slug, n = 2;
  while (existsSync(join(CONTENT, kat, s + '.md'))) s = `${slug}-${n++}`;
  slug = s;
  const e = ext(r.fil);
  await writeImg(r.src, join(ASSETS, kat, slug + e));
  const title = makeTitle(r.base);
  const ord = nextOrd[kat]++;
  const fm = [
    '---',
    `title: ${yaml(title)}`,
    `kategori: ${kat}`,
    `bild: ../../../assets/verk/${kat}/${slug}${e}`,
    `ordning: ${ord}`,
    '---',
    '',
  ].join('\n');
  writeFileSync(join(CONTENT, kat, slug + '.md'), fm);
  console.log(`NY  ${kat}/${slug}  "${title}"  <- ${r.mapp}/${r.fil}`);
  added++;
}

console.log(`\nKlart: ${swapped} byten, ${added} nya verk.`);
