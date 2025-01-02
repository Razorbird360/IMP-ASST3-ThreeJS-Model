import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/IMP-ASST3-ThreeJS-Model/' : '/', 

  resolve: {
    alias: {},
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
