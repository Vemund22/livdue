import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { KATEGORI_IDS } from './lib/kategorier';

const verk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/verk' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kategori: z.enum(KATEGORI_IDS),
      bild: image(),
      teknik: z.string().optional(),
      matt: z.string().optional(),
      ar: z.string().optional(),
      utvald: z.boolean().default(false),
      ordning: z.number().default(999),
      utvaldOrdning: z.number().optional(),
    }),
});

export const collections = { verk };
