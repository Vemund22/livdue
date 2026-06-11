export const KATEGORI_IDS = [
  'senaste',
  'akvarell',
  'akryl',
  'teckning',
  'foto',
  'brons',
  'sten',
  'gras',
  'objekt',
  'portratt',
  'rum',
] as const;

export type KategoriId = (typeof KATEGORI_IDS)[number];

export const KATEGORIER: Record<KategoriId, string> = {
  senaste: 'Senaste',
  akvarell: 'Akvarell',
  akryl: 'Akryl & kroki',
  teckning: 'Teckning',
  foto: 'Foto',
  brons: 'Brons',
  sten: 'Sten',
  gras: 'Gräs & torv',
  objekt: 'Objekt',
  portratt: 'Porträtt',
  rum: 'Rum & scenografi',
};
