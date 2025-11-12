// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import db from '@astrojs/db';

// import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: 'server',

  // adapter: node({
  //   mode: 'standalone',
  // }),
  integrations: [mdx(), sitemap(), db()],

  adapter: cloudflare(),
});