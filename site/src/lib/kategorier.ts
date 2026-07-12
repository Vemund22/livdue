// Kategori-ID:n (URL-slugs). Visningsnamn per språk finns i i18n.ts.
export const KATEGORI_IDS = [
  'malt',
  'teckning',
  'sten',
  'objekt',
  'portratt',
  'silver',
  'foto',
  'digitalt',
] as const;

export type KategoriId = (typeof KATEGORI_IDS)[number];
