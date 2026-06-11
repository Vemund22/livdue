// Kategorierna följer Livs egen mappstruktur i NYHEMSIDA
export const KATEGORI_IDS = [
  'malt',
  'sten',
  'konst',
  'teckning-foto',
  'portratt',
  'silver',
  'div',
] as const;

export type KategoriId = (typeof KATEGORI_IDS)[number];

export const KATEGORIER: Record<KategoriId, string> = {
  malt: 'Måleri',
  sten: 'Sten',
  konst: 'Konst',
  'teckning-foto': 'Teckning & foto',
  portratt: 'Porträtt',
  silver: 'Silver',
  div: 'Diverse',
};
