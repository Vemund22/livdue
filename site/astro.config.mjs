import { defineConfig } from 'astro/config';

// STAGING=1 bygger för GitHub Pages-staging under /livdue
const staging = process.env.STAGING === '1';

export default defineConfig({
  site: staging ? 'https://vemunddue.github.io' : 'https://livdue.com',
  base: staging ? '/livdue' : undefined,
  trailingSlash: 'ignore',
  // Gamla enspråkiga URL:er (kort live) → svenska språkvägen
  redirects: {
    '/verk': '/sv/verk',
    '/om': '/sv/om',
    '/kontakt': '/sv/kontakt',
  },
  image: {
    // Bilderna är konst — håll hög kvalitet men låt Astro generera responsiva storlekar
    responsiveStyles: true,
  },
});
