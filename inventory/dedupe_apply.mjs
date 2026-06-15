// Tar bort visuella dubbletter. För varje grupp behålls .md-posten med bäst
// metadata (titel/teknik/mått/år/utvald) men bilden byts till högsta upplösning.
import { copyFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const A = '/Users/vemunddue/Code/livdue/site/src/assets/verk';
const C = '/Users/vemunddue/Code/livdue/site/src/content/verk';

// Kopiera högupplösta bilden över vinnarpostens bildfil (samma .jpg-ändelse i alla fall)
const swaps = [
  ['sten/19.jpg', 'sten/gjennom.jpg'], // "Gjennom (1)" Granitt+Ek
  ['konst/kyet.jpg', 'konst/kyss.jpg'], // "Kyss" Marmor, utvald
  ['malt/megmedkat.jpg', 'konst/medkat.jpg'], // "Selvportrett med katt"
  ['malt/ogonblikket.jpg', 'konst/oyeblikket.jpg'], // "Öyeblikket"
  ['konst/romsv.jpg', 'konst/room86.jpg'], // "Room 86"
  ['sten/fonten.jpg', 'sten/fountain.jpg'], // "Fontene" Kalksten
  ['sten/gennom2.jpg', 'sten/genom.jpg'], // "Gjennom (3)"
  ['sten/tildeg-2.jpg', 'sten/tildeg.jpg'], // "Til deg" — behåll ren slug, bättre bild
];

for (const [src, dst] of swaps) {
  const s = join(A, src),
    d = join(A, dst);
  if (!existsSync(s)) throw new Error('saknas: ' + s);
  copyFileSync(s, d);
  console.log(`bild: ${src} -> ${dst}`);
}

// Slugs vars .md + bild ska tas bort helt
const remove = [
  'sten/19',
  'konst/gjennom-2',
  'konst/kyet',
  'malt/megmedkat',
  'malt/ogonblikket',
  'konst/romsv',
  'konst/ryggmotrygg-2', // dubbel av sten/ryggmotrygg
  'malt/img-5590', // tvilling av img-5590-2
  'sten/fonten',
  'sten/gennom2',
  'sten/hakke-2', // dubbel av utvald sten/hakke
  'sten/tildeg-2',
];

for (const slug of remove) {
  const md = join(C, slug + '.md');
  if (existsSync(md)) {
    rmSync(md);
    console.log(`md:  borttagen ${slug}.md`);
  }
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp', '.gif']) {
    const img = join(A, slug + ext);
    if (existsSync(img)) {
      rmSync(img);
      console.log(`img: borttagen ${slug}${ext}`);
    }
  }
}
console.log(`\nKlart. Tog bort ${remove.length} dubbletter.`);
