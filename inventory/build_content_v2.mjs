// Import v2 — bygger innehållet från NYHEMSIDA-mappen (hennes egen kuratering).
// Kategoristrukturen följer mappstrukturen. Metadata (titel/teknik/mått/år)
// återanvänds från gamla arkivet där filnamn matchar.
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  rmSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join, basename, extname } from 'node:path';

const INV = '/Users/vemunddue/Code/livdue/inventory';
const NYTT = join(INV, 'nytt/NYHEMSIDA');
const SITE = '/Users/vemunddue/Code/livdue/site';
const CONTENT = join(SITE, 'src/content/verk');
const ASSETS = join(SITE, 'src/assets/verk');

// Mappar i prioritetsordning — konst sist så att dubbletter landar i den
// mer specifika kategorin (stein/Hakke vinner över konst/Hakke)
const FOLDERS = [
  ['malt', 'malt'],
  ['stein', 'sten'],
  ['portrett', 'portratt'],
  ['silver', 'silver'],
  ['tegningerochfoto', 'teckning-foto'],
  ['div', 'div'],
  ['konst', 'konst'],
];

// Startsidans urval: [kategori, slug, ordning på startsidan]
const UTVALDA = [
  ['sten', 'cellist', 1],
  ['malt', 'vatevaren', 2],
  ['konst', 'listeners', 3],
  ['malt', 'melankoli', 4],
  ['sten', 'hakke', 5],
  ['teckning-foto', 'rappede-toner', 6],
  ['konst', 'kyss', 7],
  ['silver', 'armcharm', 8],
];

const GAMMAL_KATEGORIER = [
  'AKRYL/akryl',
  'BRONSE/bronse',
  'FOTO/FOTO1/foto1',
  'FOTO/FOTO2/foto2',
  'FOTO/FOTO3/foto3',
  'FOTO/FOTO4/foto4',
  'FOTO/FOTO5/foto5',
  'GRESS/gress',
  'MALERI/maleri',
  'OBJEKT/objekt',
  'PORTRETT/portrett',
  'ROM/rom',
  'STEIN/stein',
  'TEGNINGER/tegninger',
];

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
    .replace(/[Øø]/g, 'o')
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

// --- Bygg metadata-uppslag från gamla arkivet ---
const meta = new Map(); // slug -> {title, teknik, matt, ar}
for (const cat of GAMMAL_KATEGORIER) {
  const pagesDir = join(INV, 'gammal', cat.substring(0, cat.lastIndexOf('/')), 'pages');
  if (!existsSync(pagesDir)) continue;
  for (const f of readdirSync(pagesDir)) {
    if (!f.endsWith('.html')) continue;
    const html = readFileSync(join(pagesDir, f), 'utf8');
    const work = f.replace('.html', '');
    const titleM = html.match(/class="FileTitle1">([^<]+)</);
    const title = titleM ? decodeEntities(titleM[1]).split('|')[0].trim() : null;
    let teknik, matt, ar;
    const capM = html.match(/class="imagetitle"><p>([\s\S]*?)<\/p>/);
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
    if (title) meta.set(slugify(work), { title, teknik, matt, ar });
  }
}
console.log(`Metadata-uppslag: ${meta.size} verk från gamla arkivet`);

// --- Rensa gammalt innehåll ---
rmSync(CONTENT, { recursive: true, force: true });
rmSync(ASSETS, { recursive: true, force: true });

// --- Importera enligt hennes struktur ---
const seenHash = new Set();
const seenSlug = new Set();
const CAMERA_NAME = /^(img[_ e]|imge|p\d{6,}|pict\d|ho9a|dsc\d|\d+$|[0-9a-f]{8}-[0-9a-f]{4})/i;
// Samma foto i två format/mappar — behåll bara ett exemplar
const SKIP = new Set(['div/IMG_6956 2.jpg']);

let count = 0;
const rapport = [];

for (const [folder, kategori] of FOLDERS) {
  const dir = join(NYTT, folder);
  if (!existsSync(dir)) continue;
  // jpg/jpeg/png först så att gif/heic-tvillingar med samma namn hoppas över
  const files = readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .sort((a, b) => {
      const pri = (x) => (/\.gif$/i.test(x) ? 1 : 0);
      return pri(a) - pri(b) || a.localeCompare(b);
    });

  let ordning = 0;
  for (const f of files) {
    if (SKIP.has(`${folder}/${f}`)) {
      rapport.push(`hoppar (skip-lista): ${folder}/${f}`);
      continue;
    }
    const src = join(dir, f);
    const hash = createHash('md5').update(readFileSync(src)).digest('hex');
    if (seenHash.has(hash)) {
      rapport.push(`hoppar dubblett: ${folder}/${f}`);
      continue;
    }
    const base = basename(f, extname(f)).normalize('NFC');
    // " copy" och " 2"-suffix är alternativa exemplar — samma verk, eget slug-suffix
    const cleanBase = base.replace(/ copy$/i, '').replace(/ \d$/, '');
    let slug = slugify(cleanBase);
    if (/[0-9a-f]{8}-[0-9a-f]{4}-/i.test(base)) slug = 'utan-titel-' + base.slice(0, 6).toLowerCase();
    if (seenSlug.has(slug)) {
      slug = `${slug}-2`;
      if (seenSlug.has(slug)) {
        rapport.push(`hoppar tredje exemplaret: ${folder}/${f}`);
        continue;
      }
    }
    seenHash.add(hash);
    seenSlug.add(slug);

    // Titel: gamla arkivets metadata om filnamnet matchar, annars städat filnamn
    const old = meta.get(slugify(cleanBase));
    let title, teknik, matt, ar;
    if (old) {
      ({ title, teknik, matt, ar } = old);
    } else if (CAMERA_NAME.test(base)) {
      title = 'Utan titel';
    } else {
      title = base
        .replace(/^\d+\./, '')
        .replace(/[_-]+/g, ' ')
        .replace(/ copy$/i, '')
        .trim();
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    ordning++;
    const utvald = UTVALDA.find(([k, s]) => k === kategori && s === slug);
    const ext = extname(f).toLowerCase().replace('jpeg', 'jpg');
    mkdirSync(join(ASSETS, kategori), { recursive: true });
    mkdirSync(join(CONTENT, kategori), { recursive: true });
    copyFileSync(src, join(ASSETS, kategori, slug + ext));
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
      utvald ? `utvaldOrdning: ${utvald[2]}` : null,
      '---',
      '',
    ]
      .filter(Boolean)
      .join('\n');
    writeFileSync(join(CONTENT, kategori, slug + '.md'), fm);
    count++;
  }
}

console.log(`Skrev ${count} verk`);
rapport.forEach((r) => console.log('  ' + r));

// --- Porträttbilder till Om-sidan ---
const omDir = join(SITE, 'src/assets/om');
mkdirSync(omDir, { recursive: true });
copyFileSync(join(NYTT, 'LIV DUE/pivi.jpg'), join(omDir, 'portratt.jpg'));
copyFileSync(join(NYTT, 'LIV DUE/livi.cellistjobb.jpg'), join(omDir, 'cellist-arbete.jpg'));
console.log('Kopierade porträttbilder till src/assets/om/');
