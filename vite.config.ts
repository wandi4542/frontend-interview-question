import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [vue(), cloudflare()],
  server: {
    host: '0.0.0.0',
  },
  preview: {
    host: '0.0.0.0',
  },
  base: '/frontend-interview-question/',
});