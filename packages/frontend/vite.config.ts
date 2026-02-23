import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@bond-yield/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['@bond-yield/shared'],
  },
  build: {
    commonjsOptions: {
      include: [/@bond-yield\/shared/, /node_modules/],
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
});
