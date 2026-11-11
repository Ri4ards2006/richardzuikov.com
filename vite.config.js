import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // TODO / DRAFT hint lines render on the dev server only (DESIGN.md §19). Tied to the command, not to
  // NODE_ENV or --mode, so no build (production, Vercel preview, any mode) can ever ship them.
  define: {
    __DEV_HINTS__: JSON.stringify(command === 'serve'),
  },
  server: {
    port: 5173
  }
}));
