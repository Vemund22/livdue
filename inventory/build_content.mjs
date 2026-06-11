// Bygger content collection (markdown + bilder) från skrapat material.
// Körs efter scrape_gammal.sh. Idempotent — skriver över befintliga poster.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const INV = '/Users/vemunddue/Code/livdue/inventory';
const SITE = '/Users/vemunddue/Code/livdue/site';
const CONTENT = join(SITE, 'src/content/verk');
const ASSETS = join(SITE, 'src/assets/verk');

const KATEGORI_MAP = {
  MALERI: 'akvarell',
  AKRYL: 'akryl',
  TEGNINGER: 'teckning',
  'FOTO/FOTO1': 'foto',
  'FOTO/FOTO2': 'foto',
  'FOTO/FOTO3': 'foto',
  'FOTO/FOTO4': 'foto',
  'FOTO/FOTO5': 'foto',
  BRONSE: 'brons',
  OBJEKT: 'objekt',
  PORTRETT: 'portratt',
  GRESS: 'gras',
  ROM: 'rum',
  STEIN: 'sten',
};

// Verk från nya sajtens startsida → utvalda på nya startsidan, i denna ordning
const UTVALDA = ['waiting', 'axisS', 'fraktalS', 'perganS', 'treS', 'oneS', 'modellady'];
const EJ_VERK = new Set(['emblemo']); // logotyp, inte ett verk

function slugify(name) {
  return name
    .normalize('NFC')
    .replace(/___serialized\d*/g, '')
    .replace(/[ÅÄ]/g, 'A')
    .replace(/[åä]/g, 'a')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/[ÉÈ]/g, 'E')
    .replace(/[éè]/g, 'e')
    .replace(/Øø/g, 'o')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function yaml(str) {
  return `"${String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function writeVerk({ kategori, slug, title, teknik, matt, ar, ordning, utvald, srcImage }) {
  const ext = extname(srcImage).toLowerCase();
  mkdirSync(join(ASSETS, kategori), { recursive: true });
  mkdirSync(join(CONTENT, kategori), { recursive: true });
  copyFileSync(srcImage, join(ASSETS, kategori, slug + ext));
  const fm = [
    '---',
    `title: ${yaml(title)}`,
    `kategori: ${kategori}`,
    `bild: ../../../assets/verk/${kategori}/${slug}${ext}`,
    teknik ? `teknik: ${yaml(teknik)}` : null,
    matt ? `matt: ${yaml(matt)}` : null,
    ar ? `ar: ${yaml(ar)}` : null,
    `ordning: ${ordning}`,
    utvald ? 'utvald: true' : null,
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n');
  writeFileSync(join(CONTENT, kategori, slug + '.md'), fm);
}

let count = 0;
const misslyckade = [];
const ordCounter = {};

// --- Gamla arkivet ---
for (const [dir, kategori] of Object.entries(KATEGORI_MAP)) {
  const catDir = join(INV, 'gammal', dir);
  if (!existsSync(catDir)) continue;
  const name = readdirSync(catDir).find((f) => f.endsWith('.html'))?.replace('.html', '');
  if (!name) continue;
  const idx = readFileSync(join(catDir, name + '.html'), 'utf8');
  const order = [...idx.matchAll(new RegExp(`${name}_thumbs\\.pages/([^"]+)\\.html`, 'g'))]
    .map((m) => m[1])
    .filter((v, i, a) => a.indexOf(v) === i);

  order.forEach((work, i) => {
    const pagePath = join(catDir, 'pages', work + '.html');
    if (!existsSync(pagePath)) {
      misslyckade.push(`${dir}/${work}: detaljsida saknas`);
      return;
    }
    const html = readFileSync(pagePath, 'utf8');
    const titleM = html.match(/class="FileTitle1">([^<]+)</);
    const rawTitle = titleM ? decodeEntities(titleM[1]) : work;
    const title = rawTitle.split('|')[0].trim() || work;

    const capM = html.match(/class="imagetitle"><p>([\s\S]*?)<\/p>/);
    let teknik, matt, ar;
    if (capM) {
      const lines = capM[1]
        .split(/<br\s*\/?>/)
        .map((l) => decodeEntities(l.replace(/<[^>]+>/g, '')))
        .filter(Boolean);
      for (const line of lines) {
        if (/\(\d{4}\)|^\d{4}$/.test(line)) ar = line.replace(/[()]/g, '');
        else if (/\d+\s*[xX×]\s*\d+/.test(line)) matt = line;
        else if (!teknik) teknik = line.split('|')[0].trim();
      }
    }

    const imgM = html.match(new RegExp(`${name}_images[^"']*/(${work}\\.[a-zA-Z]+)`));
    const imgFile = imgM ? join(catDir, 'images', imgM[1]) : null;
    if (!imgFile || !existsSync(imgFile)) {
      misslyckade.push(`${dir}/${work}: bild saknas`);
      return;
    }
    ordCounter[kategori] = (ordCounter[kategori] ?? 0) + 1;
    writeVerk({
      kategori,
      slug: slugify(work),
      title,
      teknik,
      matt,
      ar,
      ordning: ordCounter[kategori],
      utvald: false,
      srcImage: imgFile,
    });
    count++;
  });
}

// --- Nya sajten ---
const nyaDir = join(INV, 'nya');
readdirSync(nyaDir).forEach((f) => {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) return;
  const base = decodeURIComponent(basename(f, extname(f))).normalize('NFC');
  const clean = base.replace(/___serialized\d*/g, '');
  if (EJ_VERK.has(clean)) return;
  const utvaldIdx = UTVALDA.indexOf(clean);
  writeVerk({
    kategori: 'senaste',
    slug: slugify(clean),
    title: clean,
    ordning: utvaldIdx >= 0 ? utvaldIdx + 1 : 100,
    utvald: utvaldIdx >= 0,
    srcImage: join(nyaDir, f),
  });
  count++;
});

console.log(`Skrev ${count} verk till ${CONTENT}`);
if (misslyckade.length) {
  console.log('Misslyckade:');
  misslyckade.forEach((m) => console.log('  ' + m));
}
