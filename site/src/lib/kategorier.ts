// Kategorierna följer Livs egen indelning (nytt3)
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

export const KATEGORIER: Record<KategoriId, string> = {
  malt: 'Måleri',
  teckning: 'Teckning',
  sten: 'Sten',
  objekt: 'Objekt',
  portratt: 'Porträtt',
  silver: 'Silver',
  foto: 'Foto',
  digitalt: 'Digitalt',
};
