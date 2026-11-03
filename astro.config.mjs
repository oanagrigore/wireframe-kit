import { defineConfig } from 'astro/config';

// Served at ogrigore.design/lab/wireframe-kit through a rewrite on the portfolio.
export default defineConfig({
  site: 'https://ogrigore.design',
  base: '/lab/wireframe-kit',
  trailingSlash: 'ignore',
});
