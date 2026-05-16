import { defineConfig } from 'vite'

export default defineConfig({
  // Project root (where index.html lives)
  root: '.',

  // Files here are served at '/' — no processing/hashing
  // img/ lives alongside index.html, so it's accessible as /img/...
  publicDir: false,

  server: {
    port: 5173,
    open: false,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
