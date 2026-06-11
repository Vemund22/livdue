import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://livdue.com',
  trailingSlash: 'ignore',
  image: {
    // Bilderna är konst — håll hög kvalitet men låt Astro generera responsiva storlekar
    responsiveStyles: true,
  },
});
