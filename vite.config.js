import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/static',
  server: {
    fs: {
      allow: ['../..'],
    },
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
});
