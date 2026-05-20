import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'main/index.html'),
        about: resolve(__dirname, 'main/about.html'),
        career: resolve(__dirname, 'career/index.html'),
        lab: resolve(__dirname, 'lab/index.html'),
        docs: resolve(__dirname, 'docs/index.html'),
        dev: resolve(__dirname, 'dev/index.html')
      }
    }
  }
});