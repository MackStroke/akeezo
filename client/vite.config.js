import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Env vars live in the repo root .env so client and server share one file.
  envDir: '..',
  resolve: {
    alias: {
      // shadcn/ui generates imports against this alias.
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Proxy in dev so the browser sees one origin and CORS never bites.
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY ?? 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
