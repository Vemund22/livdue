import type { KategoriId } from './kategorier';

export const LOCALES = ['sv', 'no', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en'; // fallback när enhetens språk ej är sv/no/en

export function isLocale(x: unknown): x is Locale {
  return typeof x === 'string' && (LOCALES as readonly string[]).includes(x);
}

// Gränssnittstexter per språk. Verk-titlar översätts ALDRIG (de kommer från innehållet).
export const UI: Record<Locale, {
  htmlLang: string;
  nav: { verk: string; om: string; kontakt: string };
  tagline: string;
  seeAll: string;
  metaDesc: string;
  siteTitle: string;
  aboutTitle: string;
  contactTitle: string;
  contactBody: string;
  langName: string;
}> = {
  sv: {
    htmlLang: 'sv',
    nav: { verk: 'Verk', om: 'Om', kontakt: 'Kontakt' },
    tagline: 'måleri · skulptur · teckning · foto · silver · film',
    seeAll: 'Se alla verk',
    metaDesc: 'Liv Due — konstnär. Måleri, skulptur, teckning, foto, silver och film.',
    siteTitle: 'Liv Due — konst',
    aboutTitle: 'Om Liv Due',
    contactTitle: 'Kontakt',
    contactBody:
      'Vill du veta mer om ett verk, fråga om pris eller bara säga hej? Skicka ett mail, jag svarar så fort jag kan.',
    langName: 'Svenska',
  },
  no: {
    htmlLang: 'no',
    nav: { verk: 'Arbeider', om: 'Om', kontakt: 'Kontakt' },
    tagline: 'maleri · skulptur · tegning · foto · sølv · film',
    seeAll: 'Se alle arbeider',
    metaDesc: 'Liv Due — kunstner. Maleri, skulptur, tegning, foto, sølv og film.',
    siteTitle: 'Liv Due — kunst',
    aboutTitle: 'Om Liv Due',
    contactTitle: 'Kontakt',
    contactBody:
      'Vil du vite mer om et arbeid, spørre om pris eller bare si hei? Send en e-post, så svarer jeg så fort jeg kan.',
    langName: 'Norsk',
  },
  en: {
    htmlLang: 'en',
    nav: { verk: 'Works', om: 'About', kontakt: 'Contact' },
    tagline: 'painting · sculpture · drawing · photography · silver · film',
    seeAll: 'See all works',
    metaDesc: 'Liv Due — artist. Painting, sculpture, drawing, photography, silver and film.',
    siteTitle: 'Liv Due — art',
    aboutTitle: 'About Liv Due',
    contactTitle: 'Contact',
    contactBody:
      'Want to know more about a work, ask about a price, or just say hello? Send an email and I’ll reply as soon as I can.',
    langName: 'English',
  },
};

export const CATEGORY_LABELS: Record<Locale, Record<KategoriId, string>> = {
  sv: {
    malt: 'Måleri',
    teckning: 'Teckning',
    sten: 'Sten',
    objekt: 'Objekt',
    portratt: 'Porträtt',
    silver: 'Silver',
    foto: 'Foto',
    digitalt: 'Digitalt',
  },
  no: {
    malt: 'Maleri',
    teckning: 'Tegning',
    sten: 'Stein',
    objekt: 'Objekt',
    portratt: 'Portrett',
    silver: 'Sølv',
    foto: 'Foto',
    digitalt: 'Digitalt',
  },
  en: {
    malt: 'Painting',
    teckning: 'Drawing',
    sten: 'Stone',
    objekt: 'Objects',
    portratt: 'Portraits',
    silver: 'Silver',
    foto: 'Photography',
    digitalt: 'Digital',
  },
};

export function catLabel(lang: Locale, id: KategoriId): string {
  return CATEGORY_LABELS[lang][id];
}
