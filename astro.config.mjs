// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.proaxiscpa.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404') && !page.includes('/tax-intake/success') && !page.includes('/disclaimer'),
      serialize(item) {
        if (item.url === 'https://www.proaxiscpa.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        if (item.url.includes('/service-areas/')) {
          item.priority = 0.9;
        }
        if (item.url.includes('/tax-services/') || item.url.includes('/business-services/')) {
          item.priority = 0.85;
        }
        if (item.url.includes('/resources/blog/')) {
          item.priority = 0.7;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
