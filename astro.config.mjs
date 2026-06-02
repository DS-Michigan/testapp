// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough',
    sessionKVBindingName: undefined,
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});
