import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './', // Projekt-Wurzel
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // Hier definieren wir die Einstiegspunkte für deine Subdomains
        main: resolve(__dirname, 'main/index.html'),
        career: resolve(__dirname, 'career/index.html'),
        dev: resolve(__dirname, 'dev/index.html'),
        lab: resolve(__dirname, 'lab/index.html'),
        docs: resolve(__dirname, 'docs/index.html'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Hier können wir später globale Variablen (wie dein beiges Theme) hinterlegen
        api: 'modern-compiler'
      },
    },
  },
});