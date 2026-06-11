import { defineConfig } from 'astro/config';

// STAGING=1 bygger för GitHub Pages-staging under /livdue
const staging = process.env.STAGING === '1';

export default defineConfig({
  site: staging ? 'https://vemund22.github.io' : 'https://livdue.com',
  base: staging ? '/livdue' : undefined,
  trailingSlash: 'ignore',
  image: {
    // Bilderna är konst — håll hög kvalitet men låt Astro generera responsiva storlekar
    responsiveStyles: true,
  },
});
