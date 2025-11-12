// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import db from '@astrojs/db';

// https://astro.build/config 
export default defineConfig({
  site: 'https://example.com', // <-- ELIMINÉ EL ESPACIO AL FINAL
  
  output: 'server',
  
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  
  integrations: [mdx(), sitemap(), db()],
  
  vite: {
    resolve: {
      alias: {
        // FORZAR USO DE VERSIÓN NODE.JS DE PICOCOLORS
        'picocolors': 'picocolors/picocolors.node.js',
      },
    },
    ssr: {
      external: [
        // EXCLUIR MÓDULOS DE NODE.JS QUE NO EXISTEN EN CLOUDFLARE
        'node:fs', 'node:path', 'node:url', 'node:util', 'node:buffer',
        'node:process', 'node:os', 'node:crypto', 'node:stream', 'node:events',
        'node:net', 'node:tls', 'node:http', 'node:https', 'node:zlib',
        'node:child_process', 'node:worker_threads', 'node:assert', 'node:v8',
        'node:querystring', 'node:dns', 'node:perf_hooks', 'node:module',
        'node:readline', 'util', 'path', 'fs', 'os', 'crypto', 'stream',
        'events', 'net', 'tls', 'http', 'https', 'zlib', 'child_process',
        'worker_threads', 'assert', 'v8', 'querystring', 'dns', 'perf_hooks',
        'module', 'readline', 'tty', 'buffer', 'url',
      ],
    },
  },
});