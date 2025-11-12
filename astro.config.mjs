// astro.config.ts
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [mdx(), sitemap()], // ❌ quita db()
  env: {
    schema: {
     ASTRO_DB_REMOTE_URL: envField.string({ context: 'server', access: 'secret' }),
     ASTRO_DB_APP_TOKEN: envField.string({ context: 'server', access: 'secret' }),
  },
},
});